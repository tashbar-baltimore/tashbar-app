/* the pretend server (same as tests/run.js): made-up boys only */
module.exports = ({ tools, parts }) => {
  window.__calls = {}; let rev = 0;
  const api = { msBootstrap: () => ({ version: 't', students: [] }), msAppUrl: () => 'https://example.invalid/app', msQuestTools: () => tools,
    msQuestToolsParts: have => { const got = {}; (have || []).forEach(h => got[h] = 1); const send = {}; parts.order.forEach(h => { if (!got[h]) send[h] = parts.parts[h]; }); return { v: 2, order: parts.order, parts: send }; },
    msSignInCode: () => ({ ok: true, token: 't', role: 'kid', sid: 'TEST-01', name: 'Test Kid' }),
    msLoad: () => ({ role: 'kid', sid: 'TEST-01', roster: [{ id: 'TEST-01', name: 'Test Kid' }], states: {} }),
    msSave: (t, sid, st) => ({ ok: true, balance: Number(st && st.balance) || 0, ledger: (st && st.ledger) || [], rev: ++rev }), soundLoad: () => null, pfHello: () => ({ show: false }) };
  const chain = (okf, nof) => new Proxy({}, { get(_, k) { if (k === 'withSuccessHandler') return f => chain(f, nof); if (k === 'withFailureHandler') return f => chain(okf, f); if (k === 'withUserObject') return () => chain(okf, nof);
    return (...a) => { window.__calls[k] = (window.__calls[k] || 0) + 1; setTimeout(() => { try { okf && okf(api[k] ? api[k](...a) : null); } catch (e) { nof && nof(e); } }, 20); }; } });
  window.google = { script: { run: chain(null, null), host: { close() {}, setHeight() {} } } };
};
