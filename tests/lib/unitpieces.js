/* EVERY LIVE WRITING UNIT, GRADES 2+, ENDS IN A WRITING WORKSHOP PIECE THAT REACHES THE TEACHER (gap A3c; HoS 2026-11-25:
   "No writing box counts blank or short as right; every W13 and W48 unit has a Writing Workshop piece that reaches the teacher.")
   A unit's real task is `task:` on TLCORE.units.add (docs/core-growth/HOW-TO-ADD-A-UNIT.md, HOW-TO-ADD-A-WRITING-TASK.md).
   Kindergarten and Grade 1 writing units are picture/oral games and are exempt (same as gap A3a).
     source():  finds every TLCORE.units.add({ id: '<JOB>.U<g><n>' ... }) in src/ for the jobs below, with its grade.
     page(pg):  on the boy page, every one of those units (grade 2+) is registered (U.add did not refuse it), has a task for its
                own grade that the Workshop accepts (TLCORE.write.err is ''), asks for at least the grade minimum (25 Gr 2-5,
                35 Gr 6-8), has a task id no other unit uses, and opens in the Workshop from U.project().
   JOBS: W13 (Writing K-3). Gap A3b adds 'W48' here when every live W48 unit has its piece. Never remove a job. */
const fs = require('fs'), path = require('path');
const SRC = path.join(__dirname, '..', '..', 'src');
const JOBS = ['W13'];

function source() {
  const units = [], re = /TLCORE\.units\.add\(\{\s*id:\s*'([A-Z0-9]+)\.U(\d)(\d)'[^}]*?grade:\s*(\d+)/g;
  for (const f of fs.readdirSync(SRC).filter(x => /\.(html|js)$/.test(x))) {
    const t = fs.readFileSync(path.join(SRC, f), 'utf8'); let m; re.lastIndex = 0;
    while ((m = re.exec(t))) if (JOBS.indexOf(m[1]) >= 0) units.push({ id: m[1] + '.U' + m[2] + m[3], grade: +m[4], file: f, idGrade: +m[2] });
  }
  return units;
}

async function page(pg) {
  const fails = [], oks = [], all = source(), want = all.filter(u => u.grade >= 2);
  all.forEach(u => { if (u.idGrade !== u.grade) fails.push('writing units: ' + u.id + ' (src/' + u.file + ') says grade ' + u.grade + ' but its id says grade ' + u.idGrade); });
  if (!want.length) { fails.push('writing units: found no Grade 2+ ' + JOBS.join('/') + ' units in src/ (the unit pattern changed?)'); return { fails, oks }; }
  const r = await pg.evaluate(async (want) => {
    const o = { bad: [], opened: 0 }, sleep = ms => new Promise(x => setTimeout(x, ms));
    if (!window.TLCORE || !TLCORE.units || !TLCORE.write) { o.bad.push('TLCORE.units or TLCORE.write is not on the boy page'); return o; }
    const U = TLCORE.units, floor = g => g >= 6 ? 35 : g >= 2 ? 25 : 0, seen = {};
    U.list.forEach(u => { if (u.task && u.task.id) (seen[u.task.id] = seen[u.task.id] || []).push(u.id); });
    for (const w of want) {
      const u = U.byId[w.id];
      if (!u) { o.bad.push(w.id + ' (src/' + w.file + ') is not on the page: TLCORE.units.add refused it (open the console for the reason)'); continue; }
      const t = u.task;
      if (!t) { o.bad.push(w.id + ' "' + u.title + '" has no Writing Workshop piece (task:). Every Grade 2+ writing unit needs one'); continue; }
      const e = TLCORE.write.err(t); if (e) { o.bad.push(w.id + ': its piece ' + t.id + ' is refused by the Workshop: ' + e); continue; }
      if (+t.grade !== +u.grade) o.bad.push(w.id + ': its piece ' + t.id + ' is for grade ' + t.grade + ', but the unit is grade ' + u.grade);
      const min = Math.max(Number(t.min) || 30, floor(+t.grade));
      if (!(min >= floor(+u.grade))) o.bad.push(w.id + ': its piece asks for ' + min + ' words; grade ' + u.grade + ' needs at least ' + floor(+u.grade));
      if (seen[t.id].length > 1) o.bad.push(w.id + ': its piece id ' + t.id + ' is also used by ' + seen[t.id].filter(x => x !== w.id).join(', ') + ' (the teacher inbox keeps one piece per id)');
      try { const p = U.project(w.id); let st = null;
        for (let k = 0; k < 40 && !(st && document.getElementById('cwr')); k++) { await sleep(50); st = TLCORE.write.state(); }
        if (!document.getElementById('cwr') || !st || st.task !== t.id) o.bad.push(w.id + ': U.project() did not open its piece in the Workshop (got ' + (st && st.task) + ')');
        else o.opened++;
        TLCORE.write.close(); await Promise.race([p, sleep(300)]);
      } catch (x) { o.bad.push(w.id + ': opening its piece crashed: ' + String(x).slice(0, 120)); try { TLCORE.write.close(); } catch (y) {} }
    }
    return o;
  }, want);
  r.bad.forEach(b => fails.push('writing units: ' + b));
  if (!fails.length) oks.push('writing units: all ' + want.length + ' live Grade 2+ ' + JOBS.join('/') + ' units (' + want.map(u => u.id).join(', ') + ') end in a Writing Workshop piece at the grade minimum that opens for the boy (K-1 writing is picture/oral, exempt)');
  return { fails, oks };
}

module.exports = { source, page, JOBS };
