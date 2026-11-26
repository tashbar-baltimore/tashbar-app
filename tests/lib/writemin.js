/* A WRITE IS NEVER RIGHT ON ITS OWN (gap A3a, HoS 2026-11-25: "really writes").
   Before: checkAnswer said `if(it.t==='write') return true;`, and 160+ writing boxes had min:0, so a blank box counted as right.
   Now, on the boy page (QuestPage.html) and the older page (MiddleSchoolPage.html):
     - a practice write must not be blank and must meet its own min;
     - the graded check piece needs at least the grade minimum: Grades 2-5 (levels 3-6) 25 words, Grades 6-8 (levels 7-9+) 35;
     - K-1 (levels 1-2) is picture/oral and stays as it was.
   The Writing Workshop (CoreWrite.html) refuses a task whose min is below its grade minimum.
     source(): both pages' checkAnswer + wrPrep, run as written, on blank, too-short and long-enough pieces.
     page(pg): the same on the live boy page with real lessons, every graded check piece's minimum, and the Workshop rule. */
const fs = require('fs'), path = require('path'), vm = require('vm');
const SRC = path.join(__dirname, '..', '..', 'src');
const W = n => new Array(n).fill('word').join(' ');

function fnText(s, name) { const i = s.indexOf('function ' + name + '('); if (i < 0) return null; let d = 0, j = s.indexOf('{', i);
  for (; j < s.length; j++) { if (s[j] === '{') d++; else if (s[j] === '}' && --d === 0) return s.slice(i, j + 1); } return null; }

function cases(checkAnswer, wrPrep, where, fails) {
  const prep = (raw, phase, id) => wrPrep(Object.assign({}, raw, { phase }), id);
  const T = [
    ['a blank practice write', prep({ t: 'write', min: 0 }, 'practice', 'WRIT.PARA.L05.06'), '', false],
    ['a practice write of only spaces', prep({ t: 'write', min: 0 }, 'practice', 'WRIT.PARA.L05.06'), '   \n ', false],
    ['a short practice answer (3 words, min 0)', prep({ t: 'write', min: 0 }, 'practice', 'LANG.GRAM.L03.01'), 'feet mice children', true],
    ['a practice write below its own min (9 of 10)', prep({ t: 'write', min: 10 }, 'practice', 'WRIT.PARA.L05.06'), W(9), false],
    ['a Grade 4 check piece, blank', prep({ t: 'write', min: 0 }, 'check', 'WRIT.PARA.L05.01'), '', false],
    ['a Grade 4 check piece with min 10, 24 words (grade minimum 25)', prep({ t: 'write', min: 10 }, 'check', 'WRIT.PARA.L05.01'), W(24), false],
    ['a Grade 4 check piece with min 10, 25 words', prep({ t: 'write', min: 10 }, 'check', 'WRIT.PARA.L05.01'), W(25), true],
    ['a Grade 2 check piece, 24 words', prep({ t: 'write' }, 'check', 'WRIT.PARA.L03.01'), W(24), false],
    ['a Grade 7 check piece with min 20, 34 words (grade minimum 35)', prep({ t: 'write', min: 20 }, 'check', 'WRIT.ESSAY.L08.01'), W(34), false],
    ['a Grade 7 check piece with min 20, 35 words', prep({ t: 'write', min: 20 }, 'check', 'WRIT.ESSAY.L08.01'), W(35), true],
    ['a Grade 8 check piece with min 60, 59 words', prep({ t: 'write', min: 60 }, 'check', 'WRIT.RES.L09.03'), W(59), false],
    ['a K check write (picture/oral, unchanged)', prep({ t: 'write', min: 0 }, 'check', 'WRIT.PARA.L01.01'), '', true],
    ['a Grade 1 practice write (picture/oral, unchanged)', prep({ t: 'write', min: 0 }, 'practice', 'WRIT.PARA.L02.01'), '', true],
    ['a write that never went through wrPrep, blank', { t: 'write', min: 0, phase: 'practice' }, '', false]];
  let n = 0; T.forEach(([name, it, ans, want]) => { let got; try { got = !!checkAnswer(it, ans); } catch (e) { got = 'crash: ' + e; } if (got !== want) fails.push('writing (' + where + '): ' + name + ' must ' + (want ? 'pass' : 'NOT pass') + ' (got ' + got + ')'); else n++; });
  return n;
}

function source() {
  const fails = [], oks = [];
  for (const f of ['QuestPage.html', 'MiddleSchoolPage.html']) {
    const s = fs.readFileSync(path.join(SRC, f), 'utf8');
    if (/t===['"]write['"]\)\s*return true/.test(s)) fails.push('writing: ' + f + ' still counts every write as right');
    const ca = fnText(s, 'checkAnswer'), wp = fnText(s, 'wrPrep');
    if (!ca || !wp) { fails.push('writing: ' + f + ' has no checkAnswer or wrPrep'); continue; }
    if (!/\.map\(x=>wrPrep\(x,id\)\)/.test(fnText(s, 'buildMission') || '')) fails.push('writing: ' + f + ' buildMission must give every write its minimum (wrPrep)');
    const ctx = { gcd: (a, b) => b ? ctx.gcd(b, a % b) : a, parseNum: Number }; vm.createContext(ctx);
    vm.runInContext(ca + '\n' + wp, ctx, { filename: f });
    const n = cases(ctx.checkAnswer, ctx.wrPrep, f, fails);
    if (!fails.length) oks.push('writing (' + f + '): blank and too-short pieces fail, the graded piece needs 25 words (Gr 2-5) or 35 (Gr 6-8), short practice answers still pass, K-1 unchanged (' + n + ' cases)');
  }
  return { fails, oks };
}

async function page(pg) {
  const fails = [], oks = [];
  const r = await pg.evaluate(() => {
    const W = n => new Array(n).fill('word').join(' '), o = { bad: [], checks: 0, tried: 0 };
    const writes = id => { try { return buildMission(id).filter(x => x.t === 'write'); } catch (e) { return []; } };
    /* real lessons: a Grade 4 practice write (min 0) and graded check pieces */
    const pr = writes('WRIT.PARA.L05.06').filter(x => x.phase === 'practice')[0];
    if (!pr) o.bad.push('no practice write found in WRIT.PARA.L05.06');
    else { o.tried++; if (checkAnswer(pr, '')) o.bad.push('WRIT.PARA.L05.06: a blank practice write passed'); if (!checkAnswer(pr, 'Our Shabbos table is long. Ima sets it. We sing.')) o.bad.push('WRIT.PARA.L05.06: a real practice answer did not pass'); }
    const ck = writes('WRIT.PARA.L05.01').filter(x => x.phase === 'check')[0];
    if (!ck) o.bad.push('no check write found in WRIT.PARA.L05.01');
    else { o.tried++; if (checkAnswer(ck, '')) o.bad.push('WRIT.PARA.L05.01: a blank piece passed'); if (checkAnswer(ck, W(24))) o.bad.push('WRIT.PARA.L05.01: a 24-word piece passed'); if (!checkAnswer(ck, W(ck.min))) o.bad.push('WRIT.PARA.L05.01: a piece of ' + ck.min + ' words did not pass'); }
    /* every graded check piece (Grades 2-8) on the page has at least its grade minimum */
    Object.keys(BANK_ALL).forEach(id => { const m = /\.L(\d\d)\./.exec(id), L = m ? +m[1] : 0; if (L < 3 || GEN[id]) return;
      writes(id).filter(x => x.phase === 'check').forEach(x => { o.checks++; const need = L >= 7 ? 35 : 25; if (!(x.min >= need)) o.bad.push(id + ': its graded piece asks for ' + x.min + ' words; Grade ' + (L - 1) + ' needs at least ' + need);
        if (checkAnswer(x, '') || checkAnswer(x, W(need - 1))) o.bad.push(id + ': a blank or ' + (need - 1) + '-word piece passed'); }); });
    /* the Writing Workshop refuses a task below its grade minimum */
    if (window.TLCORE && TLCORE.write && TLCORE.write.err) {
      const T = { id: 'ZZTEST.OPIN.02', title: 'T', grade: 5, prompt: 'P', strategy: { steps: [['P', 'Pick']] }, plan: [{ k: 'a', label: 'A' }, { k: 'b', label: 'B' }],
        checks: [{ t: 'five sentences', sentences: 5 }, { t: 'caps', caps: true }, { t: 'read it', self: true }], rubric: ['a', 'b'] };
      const e = (g, min) => TLCORE.write.err(Object.assign({}, T, { grade: g, min }));
      if (!e(5, 10)) o.bad.push('Workshop: a Grade 5 task with min 10 was accepted (needs 25+)');
      if (!e(7, 30)) o.bad.push('Workshop: a Grade 7 task with min 30 was accepted (needs 35+)');
      if (e(5, 25) || e(7, 35) || e(1, 10)) o.bad.push('Workshop: a task at the grade minimum (or a Grade 1 task) was refused: ' + (e(5, 25) || e(7, 35) || e(1, 10)));
    } else o.bad.push('the Writing Workshop (TLCORE.write) is not on the boy page');
    return o; });
  r.bad.forEach(b => fails.push('writing (boy page): ' + b));
  if (!fails.length) oks.push('writing (boy page): blank and short pieces fail on real lessons; all ' + r.checks + ' graded pieces in Grades 2-8 ask for at least 25 (Gr 2-5) or 35 (Gr 6-8) words; the Workshop refuses a task below its grade minimum');
  return { fails, oks };
}

module.exports = { source, page };
