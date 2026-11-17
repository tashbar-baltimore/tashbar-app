/* Keeps the runtime's data in Firestore.
   Layout:  books/{book}                     { tabs: [names in order] }
            books/{book}/tabs/{tab}          { ver, nRows, per (rows per chunk), text: {col:1} }
            books/{book}/tabs/{tab}/chunks/c{n}   { rows: JSON of rows [n*per, (n+1)*per) }
            cache/{sha1(key)}                { k, v, until }
            sys/props                        { map }
   A request runs the function; whatever it touches that is not loaded yet is loaded and the function runs again.
   If the run changed anything, ONE Firestore transaction checks that no tab it read has changed since it was read,
   then writes the changed chunks. If something did change, everything is reloaded and the function runs again.
   So two saves at the same moment can never lose or double a row. */
const crypto = require('crypto');
const { createRuntime } = require('./runtime.js');
const enc = v => JSON.stringify(v, (k, x) => x, 0);
const pack = rows => JSON.stringify(rows.map(r => r.map(v => (v instanceof Date ? { $d: v.getTime() } : v))));
const unpack = s => JSON.parse(s).map(r => r.map(v => (v && typeof v === 'object' && '$d' in v ? new Date(v.$d) : v)));
const tid = n => encodeURIComponent(n).replace(/\./g, '%2E'), ck = k => crypto.createHash('sha1').update(k).digest('hex');
const perFor = name => (/Evidence|Money|Ledger|Log|Audit|History|Throttle/i.test(name) ? 400 : 20);

class FsServer {
  constructor(db, opts) { this.db = db; this.opts = opts || {}; this.ns = this.opts.ns || '';   /* ns keeps a test book's cache and settings apart from everything else */ this.mem = { tabs: {}, books: {} }; }   /* mem: this instance's copy of tabs, by version */
  bookRef(b) { return this.db.collection('books').doc(tid(b)); }
  tabRef(b, t) { return this.bookRef(b).collection('tabs').doc(tid(t)); }

  async load(store, n) {
    if (n.kind === 'book') { const d = await this.bookRef(n.key).get(); const names = d.exists ? (d.data().tabs || []) : []; const tabs = {}; names.forEach(x => { tabs[x] = {}; }); store.books[n.key] = { tabs, order: names.slice() }; store.read['book|' + n.key] = d.exists ? (d.data().ver || 0) : 0; return; }
    if (n.kind === 'cache') { const d = await this.db.collection('cache').doc(ck(this.ns + '|' + n.key)).get(); store.cache[n.key] = d.exists ? { v: d.data().v, until: d.data().until } : null; return; }
    if (n.kind === 'tab') { const i = n.key.indexOf('|'), b = n.key.slice(0, i), t = n.key.slice(i + 1); const meta = await this.tabRef(b, t).get(); const m = meta.exists ? meta.data() : { ver: 0, nRows: 0, per: perFor(t), text: {} };
      const hit = this.mem.tabs[n.key]; let rows;
      if (hit && hit.ver === m.ver) rows = hit.rows.map(r => r.slice()); else { const cs = await this.tabRef(b, t).collection('chunks').get(); const parts = []; cs.forEach(c => { parts[Number(c.id.slice(1))] = unpack(c.data().rows); }); rows = []; for (let k = 0; k < parts.length; k++) if (parts[k]) parts[k].forEach((r, j) => { rows[k * m.per + j] = r; }); for (let k = 0; k < rows.length; k++) if (!rows[k]) rows[k] = []; this.mem.tabs[n.key] = { ver: m.ver, rows: rows.map(r => r.slice()) }; }
      store.books[b].tabs[t] = { rows, text: Object.assign({}, m.text || {}), per: m.per || perFor(t), ver: m.ver || 0 }; store.read['tab|' + n.key] = m.ver || 0; return; }
    throw new Error('unknown need ' + n.kind);
  }

  async commit(store) {
    const dirtyTabs = Object.keys(store.dirty || {}), dirtyCache = Object.keys(store.dirtyCache || {});
    if (!dirtyTabs.length && !dirtyCache.length && !store.dirtyProps && !Object.keys(store.dirtyBooks || {}).length) return true;
    const db = this.db, self = this;
    const ok = await db.runTransaction(async tx => {
      const keys = Object.keys(store.read).filter(k => k.indexOf('tab|') === 0 && (!store.touched || store.touched[k.slice(4)] || (store.dirty || {})[k.slice(4)]));     /* only tabs this run opened */
      const metas = keys.length ? await tx.getAll(...keys.map(k => { const key = k.slice(4), i = key.indexOf('|'); return self.tabRef(key.slice(0, i), key.slice(i + 1)); })) : [];
      for (let i = 0; i < keys.length; i++) { const v = metas[i].exists ? (metas[i].data().ver || 0) : 0; if (v !== store.read[keys[i]]) return false; }
      for (const b of Object.keys(store.dirtyBooks || {})) tx.set(self.bookRef(b), { tabs: store.books[b].order }, { merge: true });
      for (const key of dirtyTabs) { const i = key.indexOf('|'), b = key.slice(0, i), t = key.slice(i + 1), tab = store.books[b].tabs[t]; if (!tab || !tab.rows) continue; const per = tab.per || perFor(t), rows = tab.rows;
        const d = (store.dirtyRows || {})[key] || { rows: {} }, shifted = (store.shifted || {})[key]; const chunks = {};
        Object.keys(d.rows).forEach(r => { chunks[Math.floor((Number(r) - 1) / per)] = 1; });
        const nChunks = Math.ceil(rows.length / per); if (shifted) for (let c = Math.floor((shifted - 1) / per); c < nChunks + 1; c++) chunks[c] = 1;
        Object.keys(chunks).map(Number).forEach(c => { const slice = rows.slice(c * per, (c + 1) * per); const ref = self.tabRef(b, t).collection('chunks').doc('c' + c); if (slice.length) { const body = pack(slice); if (body.length > 950000) throw new Error('A block of rows in ' + t + ' is too large to store.'); tx.set(ref, { rows: body }); } else tx.delete(ref); });
        tx.set(self.tabRef(b, t), { ver: (tab.ver || 0) + 1, nRows: rows.length, per, text: tab.text || {} }); }
      dirtyCache.forEach(k => { const e = store.cache[k], ref = db.collection('cache').doc(ck(self.ns + '|' + k)); if (e) tx.set(ref, { ns: self.ns, k, v: e.v, until: e.until, expireAt: new Date(e.until) }); else tx.delete(ref); });
      if (store.dirtyProps) tx.set(db.collection('sys').doc('props' + (self.ns ? '_' + self.ns : '')), { map: store.props });
      return true;
    });
    if (ok) for (const key of dirtyTabs) { const i = key.indexOf('|'), tab = store.books[key.slice(0, i)].tabs[key.slice(i + 1)]; if (tab && tab.rows) this.mem.tabs[key] = { ver: (tab.ver || 0) + 1, rows: tab.rows.map(r => r.slice()) }; }
    else for (const k of Object.keys(store.read)) if (k.indexOf('tab|') === 0) delete this.mem.tabs[k.slice(4)];   /* someone else wrote: forget this instance's copies */
    return ok;
  }

  /* PRELOAD: bring every tab of the given books into this instance's memory, re-reading only tabs whose version
     changed, plus every live cache entry of this namespace. After this a call normally runs ONCE. */
  async preload(store, books) {
    for (const b of books) {
      const bd = await this.bookRef(b).get(); const names = bd.exists ? (bd.data().tabs || []) : [];
      const metas = await this.bookRef(b).collection('tabs').get(); const meta = {}; metas.forEach(d => { meta[decodeURIComponent(d.id)] = d.data(); });
      const tabs = {}; store.books[b] = { tabs, order: names.slice() }; store.read['book|' + b] = 0;
      await Promise.all(names.map(async t => { const key = b + '|' + t, m = meta[t] || { ver: 0, nRows: 0, per: perFor(t), text: {} }; let hit = this.mem.tabs[key];
        if (!hit || hit.ver !== (m.ver || 0)) { const cs = await this.tabRef(b, t).collection('chunks').get(); const parts = []; cs.forEach(c => { parts[Number(c.id.slice(1))] = unpack(c.data().rows); });
          const rows = []; for (let k = 0; k < parts.length; k++) if (parts[k]) parts[k].forEach((r, j) => { rows[k * (m.per || perFor(t)) + j] = r; }); for (let k = 0; k < rows.length; k++) if (!rows[k]) rows[k] = [];
          hit = this.mem.tabs[key] = { ver: m.ver || 0, rows }; }
        tabs[t] = { rows: hit.rows, shared: true, text: Object.assign({}, m.text || {}), per: m.per || perFor(t), ver: m.ver || 0 }; store.read['tab|' + key] = m.ver || 0; }));
    }
    if (global.gc) global.gc();
    const now = Date.now(); if (!this.memCache || now - this.memCache.at > 5000) { const q = await this.db.collection('cache').where('ns', '==', this.ns).get(); const c = {}; q.forEach(d => { const x = d.data(); if (x.until > now) c[x.k] = { v: x.v, until: x.until }; }); this.memCache = { at: now, c }; }
    Object.assign(store.cache, this.memCache.c); store.cacheComplete = true;
  }

  /* Run one server function to the end. Returns { result } or { error }, plus how many loads and reruns it took. */
  async run(fn, args) {
    const t0 = Date.now(); let loads = 0, runs = 0;
    const propsDoc = await this.db.collection('sys').doc('props' + (this.ns ? '_' + this.ns : '')).get(); const props = Object.assign({}, this.opts.props || {}, propsDoc.exists ? propsDoc.data().map : {});
    for (let attempt = 0; attempt < 8; attempt++) {
      const store = { lazy: true, books: {}, cache: {}, props: Object.assign({}, props), dirty: {}, read: {}, needs: [] };
      /* start with the books and tabs this function needed last time, so it usually runs once or twice instead of once per tab */
      const loaded = ((this.hints || (this.hints = {}))[fn] || []).slice();
      for (let pass = 0; pass < 400; pass++) {
        /* fresh copies of what is loaded so far (a rerun must not see the last run's writes) */
        store.touched = {}; store.dirty = {}; store.dirtyRows = {}; store.dirtyCache = {}; store.dirtyBooks = {}; store.shifted = {}; store.dirtyProps = 0; store.needs = []; store.props = Object.assign({}, props); store.cache = {}; store.books = {}; store.read = {};   /* nothing a half-finished run wrote may leak into the next run: not rows, not cache entries, not settings */
        if (this.opts.preload) { const bs = [props.SCHOOL_STAGING_DATABASE_ID, props.CANTEEN_SHEET_ID].filter(Boolean); await this.preload(store, bs); }
        for (const n of loaded) { if (this.opts.preload && n.kind === 'tab' && store.books[n.key.split('|')[0]]) continue; try { await this.load(store, n); } catch (e) { throw new Error('loading ' + n.kind + ' ' + n.key + ': ' + (e.message || e)); } }
        const rt = createRuntime({ store, appUrl: this.opts.appUrl, packs: this.opts.packs }); runs++;
        let out, err = null; try { out = rt.call(fn, args); } catch (e) { err = e; }
        if (store.needs.length) { const seen = {}; loaded.forEach(n => { seen[n.kind + n.key] = 1; }); const fresh = store.needs.filter(n => !seen[n.kind + n.key] && (seen[n.kind + n.key] = 1)); if (!fresh.length && err && err.__need) throw new Error('could not load ' + err.message); for (const n of fresh) { loaded.push(n); loads++; } if (fresh.length) continue; }
        if (err && !err.__need) { /* a real error from the app's own code: nothing is saved */ return { error: String(err.message || err), ms: Date.now() - t0, loads, runs }; }
        let done; try { done = await this.commit(store); } catch (e) { throw new Error('saving (' + Object.keys(store.dirty).join(', ') + ' / cache ' + Object.keys(store.dirtyCache || {}).length + '): ' + (e.message || e)); }
        if (done) { this.hints[fn] = loaded.filter(n => n.kind !== 'cache'); return { result: out, ms: Date.now() - t0, loads, runs, wrote: Object.keys(store.dirty).length }; }
        break;      /* someone else changed a tab we read: start over */
      }
      await new Promise(r => setTimeout(r, 40 + Math.random() * 120 * (attempt + 1)));
    }
    return { error: 'The school server is busy. Please try again.', ms: Date.now() - t0, loads, runs };
  }
}
module.exports = { FsServer };
