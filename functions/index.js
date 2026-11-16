/* Tashbar server on Firebase (Stage 2). One HTTPS function, "api".
   TODAY: answers "ping" itself and passes every other app call through to the Apps Script server unchanged, so the
   pages can talk to this address without any change in behaviour. Each server function then moves here one at a
   time; a function that has moved is answered here and no longer passed through.
   No student data is stored here yet. */
const { onRequest } = require('firebase-functions/v2/https');
const APPS_SCRIPT = 'https://script.google.com/macros/s/AKfycbwcTw8upBIAN3n1D36TON-3u6_VQdo-6zLYJT_bMa11yeFwN9IhL_saGDciQP5QK70pEw/exec';
const MOVED = { ping: async () => ({ pong: true, at: new Date().toISOString(), server: 'firebase' }) };

exports.api = onRequest({ region: 'us-east4', cors: true, memory: '512MiB', timeoutSeconds: 120, maxInstances: 50 }, async (req, res) => {
  try {
    if (req.method !== 'POST') return res.status(200).json({ ok: true, result: 'Tashbar server' });
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body && Object.keys(req.body).length ? req.body : JSON.parse((req.rawBody || '{}').toString()));
    if (!body || body.api !== 1 || !/^[a-z][A-Za-z0-9]*$/.test(String(body.fn || ''))) return res.status(200).json({ ok: false, error: 'Not an app request.' });
    if (MOVED[body.fn]) return res.status(200).json({ ok: true, result: await MOVED[body.fn].apply(null, Array.isArray(body.args) ? body.args : []) });
    const r = await fetch(APPS_SCRIPT, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ api: 1, fn: body.fn, args: body.args || [] }), redirect: 'follow' });
    res.status(200).type('application/json').send(await r.text());
  } catch (e) { res.status(200).json({ ok: false, error: String((e && e.message) || e).slice(0, 300) }); }
});
