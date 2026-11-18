/* A tiny in-memory stand-in for Firestore, enough to test server/fsstore.js on this machine. */
function fake(lag) {   /* lag: ms each round trip takes, like the real Firestore (0 = instant) */
  lag = lag || 0; const wait = () => (lag ? new Promise(r => setTimeout(r, lag * (0.5 + Math.random()))) : Promise.resolve());
  const docs = new Map(); const clone = v => (v === undefined ? undefined : JSON.parse(JSON.stringify(v)));
  const doc = p => ({ path: p, id: p.split('/').pop(), get: async () => { await wait(); return snap(p); }, set: async (d, o) => { await wait(); apply(p, d, o); }, delete: async () => { apply(p, undefined); }, collection: n => col(p + '/' + n) });
  const stats = { reads: 0, bytes: 0 };   /* documents read and their size, like the Firestore bill */
  const snap = p => { stats.reads++; const d = docs.get(p); if (d) stats.bytes += JSON.stringify(d).length; return { id: p.split('/').pop(), exists: docs.has(p), data: () => clone(d) }; };
  const ops = { '==': (a, b) => a === b, '>': (a, b) => a > b, '>=': (a, b) => a >= b, '<': (a, b) => a < b, '<=': (a, b) => a <= b };
  const query = (p, conds) => ({ where: (f, op, v) => query(p, conds.concat([[f, op, v]])), get: async () => { await wait(); const out = []; for (const k of docs.keys()) if (k.indexOf(p + '/') === 0 && k.slice(p.length + 1).indexOf('/') < 0) { const d = docs.get(k); if (conds.every(([f, op, v]) => ops[op](d[f], v))) out.push(snap(k)); } return { forEach: f => out.forEach(f), size: out.length }; } });
  const col = p => Object.assign(query(p, []), { doc: id => doc(p + '/' + id) });
  /* Transactions as in the real Firestore: reads run in parallel; the commit is atomic and fails if any document the
     transaction read has changed since (then the whole function is retried, up to 5 times, as the real client does). */
  const ver = new Map(); const bump = p => ver.set(p, (ver.get(p) || 0) + 1);
  const apply = (p, d, o) => { if (d === undefined) docs.delete(p); else docs.set(p, o && o.merge ? Object.assign({}, docs.get(p) || {}, clone(d)) : clone(d)); bump(p); };
  const docOf = r => r.path;
  return { docs, stats, collection: n => col(n), batch: () => { const ops = []; return { set: (r, d) => ops.push(() => r.set(d)), commit: async () => { for (const o of ops) await o(); } }; },
    runTransaction: async fn => {
      for (let attempt = 0; attempt < 5; attempt++) {
        const seen = new Map(), ops = []; const look = p => { if (!seen.has(p)) seen.set(p, ver.get(p) || 0); return snap(p); };
        const tx = { getAll: async (...refs) => { await wait(); return refs.map(r => look(docOf(r))); }, get: async r => { await wait(); return look(docOf(r)); },
          set: (r, d, o) => ops.push([docOf(r), d, o]), delete: r => ops.push([docOf(r), undefined]) };
        const res = await fn(tx); await wait();
        let clash = false; for (const [p, v] of seen) if ((ver.get(p) || 0) !== v) clash = true;
        if (clash) continue;
        if (res !== false) for (const [p, d, o] of ops) apply(p, d, o);
        return res;
      }
      const e = new Error('10 ABORTED: Too much contention on these documents. Please try again.'); e.code = 10; throw e;
    } };
}
module.exports = { fake };
