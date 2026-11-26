/* Flag checker inbox (HoS 2026-11-24). Run ONLY by .github/workflows/flag-checker.yml (the export key comes from Secret Manager).
     FLAG_ACTION=list                         -> prints the open "Report a problem" flags between the FLAGS-JSON markers
     FLAG_ACTION=mark FLAG_MARKS='[...]' FLAG_UPTO=<ms>  -> marks each question fine / fixed / open, with the checker's note
   What it prints: questions, reasons, boys' notes with names blanked, answer counts. Never an id or a name. */
const API = process.env.API_URL || 'https://api-q26c275eaa-uk.a.run.app';
async function admin(action, a) {
  const r = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ api: 1, admin: action, key: process.env.TL_EXPORT_KEY || '', a: a || {} }) });
  const j = JSON.parse(await r.text()); if (!j.ok) throw new Error(j.error || 'server error'); return j.result;
}
(async () => {
  const act = process.env.FLAG_ACTION || 'list';
  if (act === 'list') {
    const r = await admin('flagList', {});
    console.log('Open flagged questions: ' + r.open);
    console.log('===FLAGS-JSON-START==='); console.log(JSON.stringify(r)); console.log('===FLAGS-JSON-END===');
    return;
  }
  if (act === 'mark') {
    let marks; try { marks = JSON.parse(process.env.FLAG_MARKS || '[]'); } catch (e) { throw new Error('marks is not JSON: ' + e.message); }
    if (!Array.isArray(marks)) throw new Error('marks must be a list');
    const r = await admin('flagMark', { marks, upTo: Number(process.env.FLAG_UPTO) || 0 });
    console.log('Reports changed: ' + r.changed);
    return;
  }
  throw new Error('FLAG_ACTION must be list or mark');
})().catch(e => { console.error('flag inbox failed: ' + String(e.message || e).slice(0, 300)); process.exit(1); });
