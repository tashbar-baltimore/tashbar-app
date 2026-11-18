/* Keeps the runtime's data in Firestore.
   Layout:  books/{book}                     { tabs: [names in order] }
            books/{book}/tabs/{tab}          { ver, nRows, per (rows per chunk), text: {col:1} }
            books/{book}/tabs/{tab}/chunks/c{n}   { rows: JSON of rows [n*per, (n+1)*per) }
            cache/{sha1(key)}                { k, v, until }
            sys/props                        { map }
   A request runs the function; whatever it touches that is not loaded yet is loaded and the function runs again.
   If the run changed anything, ONE Firestore transaction checks that no tab it read has changed since it was read,
   then writes the changed chunks. If something did change, everything is reloaded and the function runs again.
   So two saves at the same moment can never lose or double a row.
   ROW-MERGE TABS (MERGE below: one row per boy, e.g. Pathfinder sessions and answers): another save to the same tab
   does NOT force a rerun. The transaction re-reads the blocks it writes and goes ahead when (1) every row this run
   changed is still exactly as this run read it, and (2) no row added by someone else meanwhile belongs to the same
   boy (key column) as a row this run writes. New rows are moved down to the tab's current end. Otherwise: rerun. */
const crypto = require('crypto');
const { createRuntime } = require('./runtime.js');
const enc = v => JSON.stringify(v, (k, x) => x, 0);
const pack = rows => JSON.stringify(rows.map(r => r.map(v => (v instanceof Date ? { $d: v.getTime() } : v))));
const unpack = s => JSON.parse(s).map(r => r.map(v => (v && typeof v === 'object' && '$d' in v ? new Date(v.$d) : v)));
const tid = n => encodeURIComponent(n).replace(/\./g, '%2E'), ck = k => crypto.createHash('sha1').update(k).digest('hex');
const perFor = name => (/Evidence|Money|Ledger|Log|Audit|History|Throttle/i.test(name) ? 400 : 20);
/* tab -> key columns (1-based). A row added by someone else meanwhile clashes with this run when it shares a value in any of
   these columns with a row this run writes. Pathfinder tabs: the boy (or his session). TL Money: the boy, AND the pay-once key
   (col 10), because Money.js checks some keys across the whole ledger; the ledger is only ever added to (rows removed only for
   made-up practice boys, which the shift counter catches). */
const MERGE = { PF_Sessions: [2], PF_Ksessions: [2], PF_Answers: [3], PF_Results: [3], PF_Queue: [3], PF_Sound: [9], 'TL Money': [3, 10] };
const blank = r => !r || r.every(x => x === '' || x === undefined || x === null);

class FsServer {
  constructor(db, opts) { this.db = db; this.opts = opts || {}; this.ns = this.opts.ns || '';   /* ns keeps a test book's cache and settings apart from everything else */ this.mem = { tabs: {}, books: {} }; }   /* mem: this instance's copy of tabs, by version */
  bookRef(b) { return this.db.collection('books').doc(tid(b)); }
  tabRef(b, t) { return this.bookRef(b).collection('tabs').doc(tid(t)); }

  async load(store, n) {
    if (n.kind === 'book') { const d = await this.bookRef(n.key).get(); const names = d.exists ? (d.data().tabs || []) : []; const tabs = {}; names.forEach(x => { tabs[x] = {}; }); store.books[n.key] = { tabs, order: names.slice() }; store.read['book|' + n.key] = d.exists ? (d.data().ver || 0) : 0; return; }
    if (n.kind === 'remote') { const memo = store.remoteMemo || (store.remoteMemo = {}); if (!Object.prototype.hasOwnProperty.call(memo, n.key)) { const [name, args] = JSON.parse(n.key);
        if (!this.opts.remote) throw new Error('Google Drive is not connected on this server.'); try { memo[n.key] = await this.opts.remote(name, args); } catch (e) { memo[n.key] = { __err: String(e.message || e).slice(0, 300) }; } }
      (store.remote || (store.remote = {}))[n.key] = memo[n.key]; return; }
    if (n.kind === 'cache') { const d = await this.db.collection('cache').doc(ck(this.ns + '|' + n.key)).get(); store.cache[n.key] = d.exists ? { v: d.data().v, until: d.data().until } : null; return; }
    if (n.kind === 'tab') { const i = n.key.indexOf('|'), b = n.key.slice(0, i), t = n.key.slice(i + 1); const meta = await this.tabRef(b, t).get(); const m = meta.exists ? meta.data() : { ver: 0, nRows: 0, per: perFor(t), text: {} };
      const got = this.mem.tabs[n.key] = this.newer(await this.readRows(b, t, m, this.mem.tabs[n.key]), this.mem.tabs[n.key]); const rows = got.rows;
      /* shared: the runtime copies before its first write, so `base` stays exactly what was read (row-merge compares against it) */
      store.books[b].tabs[t] = { rows, shared: true, base: rows, text: Object.assign({}, m.text || {}), per: got.per, ver: got.ver, shift: got.shift || 0, incFrom: m.incFrom || 0 }; store.read['tab|' + n.key] = got.ver; return; }
    throw new Error('unknown need ' + n.kind);
  }

  async commit(store) {
    const dirtyTabs = Object.keys(store.dirty || {}), dirtyCache = Object.keys(store.dirtyCache || {});
    if (!dirtyTabs.length && !dirtyCache.length && !store.dirtyProps && !Object.keys(store.dirtyBooks || {}).length) return true;
    const db = this.db, self = this;
    let later = [];
    const ok = await db.runTransaction(async tx => {
      const keys = Object.keys(store.read).filter(k => k.indexOf('tab|') === 0 && (!store.touched || store.touched[k.slice(4)] || (store.dirty || {})[k.slice(4)]));     /* only tabs this run opened */
      const metas = keys.length ? await tx.getAll(...keys.map(k => { const key = k.slice(4), i = key.indexOf('|'); return self.tabRef(key.slice(0, i), key.slice(i + 1)); })) : [];
      const moved = {};   /* row-merge tabs someone else changed meanwhile: key -> current tab meta */
      for (let i = 0; i < keys.length; i++) { const v = metas[i].exists ? (metas[i].data().ver || 0) : 0; if (v === store.read[keys[i]]) continue;
        const key = keys[i].slice(4), t = key.slice(key.indexOf('|') + 1), tab = store.books[key.slice(0, key.indexOf('|'))].tabs[t];
        if (!self.mergeable(store, key, t, tab)) { store.clash = t; return false; }
        if (store.dirty[key]) moved[key] = metas[i].data(); }   /* only read, never written: other boys' rows changed, his did not matter to this run */
      const merged = {};
      const mk = Object.keys(moved), plans = await Promise.all(mk.map(key => self.mergePlan(tx, store, key, moved[key])));   /* all tabs' blocks in one round trip each, side by side */
      for (let j = 0; j < mk.length; j++) { if (!plans[j]) { store.clash = mk[j].slice(mk[j].indexOf('|') + 1) + ' (same boy)'; return false; } merged[mk[j]] = plans[j]; }
      for (const b of Object.keys(store.dirtyBooks || {})) tx.set(self.bookRef(b), { tabs: store.books[b].order }, { merge: true });
      for (const key of Object.keys(merged)) { const i = key.indexOf('|'), b = key.slice(0, i), t = key.slice(i + 1), pl = merged[key];
        for (const c of Object.keys(pl.chunks)) { const body = pack(pl.chunks[c]); if (body.length > 950000) throw new Error('A block of rows in ' + t + ' is too large to store.'); tx.set(self.tabRef(b, t).collection('chunks').doc('c' + c), { rows: body, v: pl.ver + 1 }); }
        tx.set(self.tabRef(b, t), { ver: pl.ver + 1, nRows: pl.nRows, per: pl.per, shift: pl.shift, incFrom: pl.incFrom || pl.ver + 1, text: pl.text }); }
      for (const key of dirtyTabs) { if (merged[key]) continue; const i = key.indexOf('|'), b = key.slice(0, i), t = key.slice(i + 1), tab = store.books[b].tabs[t]; if (!tab || !tab.rows) continue; const per = tab.per || perFor(t), rows = tab.rows;
        const d = (store.dirtyRows || {})[key] || { rows: {} }, shifted = (store.shifted || {})[key]; const chunks = {};
        Object.keys(d.rows).forEach(r => { chunks[Math.floor((Number(r) - 1) / per)] = 1; });
        const nChunks = Math.ceil(rows.length / per); if (shifted) for (let c = Math.floor((shifted - 1) / per); c < nChunks + 1; c++) chunks[c] = 1;
        Object.keys(chunks).map(Number).forEach(c => { const slice = rows.slice(c * per, (c + 1) * per); const ref = self.tabRef(b, t).collection('chunks').doc('c' + c); if (slice.length) { const body = pack(slice); if (body.length > 950000) throw new Error('A block of rows in ' + t + ' is too large to store.'); tx.set(ref, { rows: body, v: (tab.ver || 0) + 1 }); } else tx.delete(ref); });
        /* v: the version that saved this block; incFrom: every save from that version on stamped its blocks (old code drops it) */
        tx.set(self.tabRef(b, t), { ver: (tab.ver || 0) + 1, nRows: rows.length, per, shift: (tab.shift || 0) + (shifted ? 1 : 0), incFrom: tab.incFrom || (tab.ver || 0) + 1, text: tab.text || {} }); }   /* shift: counts saves that deleted or moved rows */
      /* sign-in tickets and other small entries are saved with the rows; big or many entries are saved right after, in batches */
      const inTx = dirtyCache.filter(k => /^(ms_tok_|ms_try_|tl_scope_)/.test(k)).slice(0, 50), inTxSet = {}; inTx.forEach(k => { inTxSet[k] = 1; }); later = dirtyCache.filter(k => !inTxSet[k]);
      inTx.forEach(k => { const e = store.cache[k], ref = db.collection('cache').doc(ck(self.ns + '|' + k)); const at = Date.now(); if (e) tx.set(ref, { ns: self.ns, k, v: e.v, until: e.until, expireAt: new Date(e.until), at }); else tx.set(ref, { ns: self.ns, k, v: '', until: 0, expireAt: new Date(at), at }); });
      if (store.dirtyProps) tx.set(db.collection('sys').doc('props' + (self.ns ? '_' + self.ns : '')), { map: store.props });
      store.merged = merged; return true;
    }).catch(e => { if (e && (e.code === 10 || /ABORTED|contention/i.test(String(e.message)))) return false; throw e; });   /* Firestore gave up on contention: same as a clash, rerun */
    if (ok && later.length) { const mc = this.memCache && this.memCache.c; let batch = db.batch(), n = 0, bytes = 0; const at = Date.now();
      for (const k of later) { const e = store.cache[k]; if (e && mc && mc[k] && mc[k].v === e.v && Math.abs(mc[k].until - e.until) < 600000) continue;   /* unchanged: skip */
        const ref = db.collection('cache').doc(ck(self.ns + '|' + k)), doc = e ? { ns: self.ns, k, v: e.v, until: e.until, expireAt: new Date(e.until), at } : { ns: self.ns, k, v: '', until: 0, expireAt: new Date(at), at }; const sz = (doc.v || '').length + 200;
        if (n && (n >= 400 || bytes + sz > 8e6)) { await batch.commit().catch(() => {}); batch = db.batch(); n = 0; bytes = 0; }
        batch.set(ref, doc); n++; bytes += sz; if (mc) { if (e) mc[k] = { v: e.v, until: e.until }; else delete mc[k]; } }
      if (n) await batch.commit().catch(() => {}); }
    if (ok) for (const key of dirtyTabs) { if (store.merged && store.merged[key]) continue;   /* merged: keep the older copy; the next look reads just the new blocks */
      const i = key.indexOf('|'), tab = store.books[key.slice(0, i)].tabs[key.slice(i + 1)]; if (tab && tab.rows) this.mem.tabs[key] = { ver: (tab.ver || 0) + 1, rows: tab.rows.map(r => r.slice()), shift: (tab.shift || 0) + ((store.shifted || {})[key] ? 1 : 0), per: tab.per || perFor(key.slice(i + 1)) }; }
    /* a clash keeps this copy's tabs: each is labelled with its version, and the rerun reads only what changed since */
    return ok;
  }

  /* A tab's rows at version m.ver. `hit` is this copy's last copy of the tab. Unchanged: reuse it. Changed, and every save since
     then stamped its blocks (incFrom) with no rows deleted or moved (shift): read ONLY the blocks saved after it. Else: read all. */
  async readRows(b, t, m, hit) {
    const per = m.per || perFor(t), ver = m.ver || 0, shift = m.shift || 0;
    if (hit && hit.ver >= ver && hit.per === per) return hit;   /* same, or this copy already saved a newer one */
    /* calls arriving together share one read of the same tab version */
    const pk = b + '|' + t + '|' + ver + '|' + (hit ? hit.ver : -1), pend = this.pending || (this.pending = {});
    if (pend[pk]) return pend[pk];
    try { return await (pend[pk] = this.readRowsNow(b, t, m, hit, per, ver, shift)); } finally { delete pend[pk]; }
  }
  async readRowsNow(b, t, m, hit, per, ver, shift) {
    const fill = rows => { for (let k = 0; k < rows.length; k++) if (!rows[k]) rows[k] = []; return rows; };
    if (this.opts.incremental !== false && hit && hit.ver > 0 && ver > hit.ver && m.incFrom && hit.ver >= m.incFrom - 1 && (hit.shift || 0) === shift && hit.per === per) {
      const q = await this.tabRef(b, t).collection('chunks').where('v', '>', hit.ver).get(); const rows = hit.rows.slice();   /* a new array: earlier runs keep theirs */
      q.forEach(c => { const k = Number(c.id.slice(1)); unpack(c.data().rows).forEach((r, j) => { rows[k * per + j] = r; }); });
      if (m.nRows != null && rows.length > m.nRows) rows.length = m.nRows;
      this.incReads = (this.incReads || 0) + 1; return { ver, rows: fill(rows), shift, per };
    }
    if (process.env.FS_WHY) { const why = !hit ? 'first' : hit.per !== per ? 'per' : hit.ver > ver ? 'mem newer' : !m.incFrom ? 'no incFrom' : hit.ver < m.incFrom - 1 ? 'before incFrom' : (hit.shift || 0) !== shift ? 'shift' : hit.ver === 0 ? 'ver0' : 'other'; const w = this.why || (this.why = {}); w[t + ': ' + why] = (w[t + ': ' + why] || 0) + 1; }
    const cs = await this.tabRef(b, t).collection('chunks').get(); const rows = [];
    cs.forEach(c => { const k = Number(c.id.slice(1)); unpack(c.data().rows).forEach((r, j) => { rows[k * per + j] = r; }); });
    this.fullReads = (this.fullReads || 0) + 1; return { ver, rows: fill(rows), shift, per };
  }

  newer(a, b) { return b && b.per === a.per && b.ver > a.ver ? b : a; }   /* two reads raced: keep the later version */

  /* May this tab's clash be settled row by row? Only MERGE tabs, rows changed in place or added (no deleted or shifted rows), tab not new. */
  mergeable(store, key, t, tab) {
    if (this.opts.merge === false || !MERGE[t] || !tab || !tab.base) return false;
    if ((store.shifted || {})[key] || (store.dirtyBooks || {})[key.slice(0, key.indexOf('|'))]) return false;
    return true;
  }
  /* Inside the transaction: re-read the blocks this run writes plus the rows others added, and lay this run's rows on top.
     Returns { chunks: {c: rows}, ver, nRows, per, text } or null (a real clash: rerun). */
  async mergePlan(tx, store, key, cur) {
    const i = key.indexOf('|'), b = key.slice(0, i), t = key.slice(i + 1), tab = store.books[b].tabs[t], kcs = MERGE[t].map(c => c - 1);
    const per = cur.per || tab.per || perFor(t); if (per !== (tab.per || perFor(t))) return null;
    if ((cur.shift || 0) !== (tab.shift || 0)) return null;   /* rows were deleted or moved since this run read the tab */
    if (!cur.incFrom || cur.incFrom > (tab.ver || 0) + 1) return null;   /* a save since this run's read came from older server code (no shift count): be strict */
    const base = tab.base, baseN = base.length, curN = cur.nRows || 0, d = (store.dirtyRows || {})[key] || { rows: {} };
    const same = (x, y) => pack([x || []]) === pack([y || []]);
    /* this run's changed rows, with where they go now */
    const writes = []; for (const r of Object.keys(d.rows).map(Number).sort((x, y) => x - y)) { const mine = tab.rows[r - 1] || [];
      if (r <= baseN) { if (same(mine, base[r - 1])) continue; writes.push({ at: r, row: mine, was: base[r - 1] }); }
      else if (!blank(mine)) writes.push({ at: curN + (r - baseN), row: mine, added: true }); }
    const keysOf = {}, put = (r, c) => { if (r && r[c] !== '' && r[c] != null) keysOf[c + ':' + String(r[c])] = 1; };
    writes.forEach(w => kcs.forEach(c => { put(w.row, c); put(w.was, c); }));
    /* blocks to read: the ones written, and the ones holding rows others added since this run read the tab */
    const need = {}; writes.forEach(w => { need[Math.floor((w.at - 1) / per)] = 1; });
    for (let r = baseN + 1; r <= curN; r++) need[Math.floor((r - 1) / per)] = 1;
    const cs = Object.keys(need).map(Number); const snaps = cs.length ? await tx.getAll(...cs.map(c => this.tabRef(b, t).collection('chunks').doc('c' + c))) : [];
    const chunks = {}; cs.forEach((c, j) => { chunks[c] = snaps[j].exists ? unpack(snaps[j].data().rows) : []; });
    const rowAt = r => (chunks[Math.floor((r - 1) / per)] || [])[(r - 1) % per];
    for (let r = baseN + 1; r <= curN; r++) { const x = rowAt(r); if (x && !blank(x) && kcs.some(c => keysOf[c + ':' + String(x[c])])) return null; }   /* someone else added a row for the same boy (or the same pay-once key) */
    for (const w of writes) { if (w.added) continue; if (!same(rowAt(w.at), w.was)) return null; }                       /* his row changed under this run */
    let nRows = curN; const touched = {};
    for (const w of writes) { const c = Math.floor((w.at - 1) / per), arr = chunks[c]; while (arr.length < ((w.at - 1) % per) + 1) arr.push([]); arr[(w.at - 1) % per] = w.row; touched[c] = 1; if (w.at > nRows) nRows = w.at; }
    const out = {}; Object.keys(touched).forEach(c => { out[c] = chunks[c]; });
    return { chunks: out, ver: cur.ver || 0, nRows, per, shift: cur.shift || 0, incFrom: cur.incFrom || 0, text: Object.assign({}, cur.text || {}, tab.text || {}) };
  }

  /* PRELOAD: bring every tab of the given books into this instance's memory, re-reading only tabs whose version
     changed, plus every live cache entry of this namespace. After this a call normally runs ONCE. */
  async preload(store, books) {
    for (const b of books) {
      const bd = await this.bookRef(b).get(); const names = bd.exists ? (bd.data().tabs || []) : [];
      const metas = await this.bookRef(b).collection('tabs').get(); const meta = {}; metas.forEach(d => { meta[decodeURIComponent(d.id)] = d.data(); });
      const tabs = {}; store.books[b] = { tabs, order: names.slice() }; store.read['book|' + b] = 0;
      await Promise.all(names.map(async t => { const key = b + '|' + t, m = meta[t] || { ver: 0, nRows: 0, per: perFor(t), text: {} };
        const hit = this.mem.tabs[key] = this.newer(await this.readRows(b, t, m, this.mem.tabs[key]), this.mem.tabs[key]);
        tabs[t] = { rows: hit.rows, shared: true, base: hit.rows, text: Object.assign({}, m.text || {}), per: hit.per, ver: hit.ver, shift: hit.shift || 0, incFrom: m.incFrom || 0 }; store.read['tab|' + key] = hit.ver; }));
    }
    if (global.gc) global.gc();
    const now = Date.now();
    /* shared memory (sign-ins, saved pieces): loaded in full once, then only what changed since the last look (every 2 seconds) */
    if (!this.memCache || now - this.memCache.full > 600000) { const q = await this.db.collection('cache').where('ns', '==', this.ns).get(); const c = {}; let top = 0; q.forEach(d => { const x = d.data(); if (x.at > top) top = x.at; if (x.until > now) c[x.k] = { v: x.v, until: x.until }; }); this.memCache = { at: now, full: now, top: top || now, c }; }
    else if (now - this.memCache.at > 2000) { const since = this.memCache.top - 10000; this.memCache.at = now;
      try { const q = await this.db.collection('cache').where('ns', '==', this.ns).where('at', '>', since).get(); const c = this.memCache.c;
        q.forEach(d => { const x = d.data(); if (x.at > this.memCache.top) this.memCache.top = x.at; if (x.until > now) c[x.k] = { v: x.v, until: x.until }; else delete c[x.k]; }); }
      catch (e) { this.memCache.full = 0; } }
    Object.assign(store.cache, this.memCache.c); store.cacheComplete = true;
  }

  /* Run one server function to the end. Returns { result } or { error }, plus how many loads and reruns it took. */
  async run(fn, args) {
    const t0 = Date.now(); let loads = 0, runs = 0;
    const propsDoc = await this.db.collection('sys').doc('props' + (this.ns ? '_' + this.ns : '')).get(); const props = Object.assign({}, this.opts.props || {}, propsDoc.exists ? propsDoc.data().map : {});
    const runMemo = {};
    for (let attempt = 0; attempt < 8; attempt++) {
      const store = { lazy: true, books: {}, cache: {}, props: Object.assign({}, props), dirty: {}, read: {}, needs: [], remoteMemo: runMemo };   /* Google answers are kept for the whole call, even across retries: a photo is saved once */
      /* start with the books and tabs this function needed last time, so it usually runs once or twice instead of once per tab */
      const loaded = ((this.hints || (this.hints = {}))[fn] || []).slice();
      for (let pass = 0; pass < 400; pass++) {
        /* fresh copies of what is loaded so far (a rerun must not see the last run's writes) */
        store.touched = {}; store.dirty = {}; store.dirtyRows = {}; store.dirtyCache = {}; store.dirtyBooks = {}; store.shifted = {}; store.dirtyProps = 0; store.needs = []; store.props = Object.assign({}, props); store.cache = {}; store.books = {}; store.read = {}; store.remote = {};   /* nothing a half-finished run wrote may leak into the next run: not rows, not cache entries, not settings */
        if (this.opts.preload) { const bs = [props.SCHOOL_STAGING_DATABASE_ID, props.CANTEEN_SHEET_ID].filter(Boolean); await this.preload(store, bs); }
        for (const n of loaded) { if (this.opts.preload && n.kind === 'tab' && store.books[n.key.split('|')[0]]) continue; try { await this.load(store, n); } catch (e) { throw new Error('loading ' + n.kind + ' ' + n.key + ': ' + (e.message || e)); } }
        const rt = createRuntime({ store, appUrl: this.opts.appUrl, packs: this.opts.packs }); runs++;
        let out, err = null; try { out = rt.call(fn, args); } catch (e) { err = e; }
        if (store.needs.length) { const seen = {}; loaded.forEach(n => { seen[n.kind + n.key] = 1; }); const fresh = store.needs.filter(n => !seen[n.kind + n.key] && (seen[n.kind + n.key] = 1)); if (!fresh.length && err && err.__need) throw new Error('could not load ' + err.message); for (const n of fresh) { loaded.push(n); loads++; } if (fresh.length) continue; }
        if (err && !err.__need) { /* a real error from the app's own code: nothing is saved */ return { error: String(err.message || err), ms: Date.now() - t0, loads, runs }; }
        let done; try { done = await this.commit(store); } catch (e) { throw new Error('saving (' + Object.keys(store.dirty).join(', ') + ' / cache ' + Object.keys(store.dirtyCache || {}).length + '): ' + (e.message || e)); }
        if (done) { this.hints[fn] = loaded.filter(n => n.kind !== 'cache' && n.kind !== 'remote'); return { result: out, ms: Date.now() - t0, loads, runs, wrote: Object.keys(store.dirty).length }; }
        if (store.clash) (this.clashes || (this.clashes = {}))[store.clash] = (this.clashes[store.clash] || 0) + 1;   /* which tab made calls start over (counts only) */
        break;      /* someone else changed a tab we read: start over */
      }
      await new Promise(r => setTimeout(r, 40 + Math.random() * 120 * (attempt + 1)));
    }
    return { error: 'The school server is busy. Please try again.', ms: Date.now() - t0, loads, runs };
  }
}
module.exports = { FsServer };
