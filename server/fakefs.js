/* A tiny in-memory stand-in for Firestore, enough to test server/fsstore.js on this machine. */
function fake() {
  const docs = new Map(); const clone = v => (v === undefined ? undefined : JSON.parse(JSON.stringify(v)));
  const doc = p => ({ path: p, id: p.split('/').pop(), get: async () => snap(p), set: async (d, o) => { docs.set(p, o && o.merge ? Object.assign({}, docs.get(p) || {}, clone(d)) : clone(d)); }, delete: async () => { docs.delete(p); }, collection: n => col(p + '/' + n) });
  const snap = p => ({ id: p.split('/').pop(), exists: docs.has(p), data: () => clone(docs.get(p)) });
  const col = p => ({ doc: id => doc(p + '/' + id), get: async () => { const out = []; for (const k of docs.keys()) if (k.indexOf(p + '/') === 0 && k.slice(p.length + 1).indexOf('/') < 0) out.push(snap(k)); return { forEach: f => out.forEach(f), size: out.length }; } });
  let busy = Promise.resolve();
  return { docs, collection: n => col(n), batch: () => { const ops = []; return { set: (r, d) => ops.push(() => r.set(d)), commit: async () => { for (const o of ops) await o(); } }; },
    runTransaction: fn => { const run = busy.then(async () => { const ops = []; const tx = { getAll: async (...refs) => refs.map(r => snap(r.path)), get: async r => snap(r.path), set: (r, d, o) => ops.push(() => r.set(d, o)), delete: r => ops.push(() => r.delete()) }; const res = await fn(tx); if (res !== false) for (const o of ops) await o(); return res; }); busy = run.catch(() => {}); return run; } };
}
module.exports = { fake };
