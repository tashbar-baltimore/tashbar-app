#!/usr/bin/env node
/* Core Growth (job T, T-8): the MINUTES LEDGER REPORT. Hours of new core learning BUILT per grade and strand, against the half-year target
   (CORE-GROWTH-PROMPT.md section 2: K-1 about 68 hours, Grades 2-8 about 90). Counts only what is really in the app:
     - every skill listed in a job's src/CoreData<Job>.js whose lesson is in its data file ("built"): its min (8 if not given);
     - every text in texts/<JOB>/: reading time at a typical speed for its grade, plus 8 minutes of questions;
     - every unit added with TLCORE.units.add in a data file: 4 (pre-check) + 12 (unit check) minutes.
   Strands: Foundations (READ.PA, READ.PHON, and READ.FLU up to Grade 2; texts of job F) · Comprehension (READ.COMP, READ.LIT, READ.LV,
   READ.FLU from Grade 3; texts of C23, C45, C68) · Grammar and words (LANG.*, READ.VOC; texts of G) · Writing (WRIT.*; texts of W13, W48).
   Science and Social Studies (job S) are shown apart: they are not core hours. Existing lessons are not counted here (they count in a job's
   own ledger once they pass the standard).
     node tools/core/ledger.js            prints the table
     node tools/core/ledger.js --write    also writes it into the Ledger table of docs/CORE-GROWTH-LANES.md (only that table) */
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..', '..'), SRC = path.join(ROOT, 'src');
const B = require(path.join(ROOT, 'tests', 'lib', 'build.js'));
const STRANDS = ['Foundations', 'Comprehension', 'Grammar and words', 'Writing'];
const TARGET = [68, 68, 90, 90, 90, 90, 90, 90, 90];
const WPM = [20, 50, 90, 110, 125, 140, 150, 160, 170];
const G = n => n === 0 ? 'K' : String(n);

function strandOfSkill(id, grade) {
  const [p, s] = id.split('.');
  if (p === 'READ' && (s === 'PA' || s === 'PHON')) return 'Foundations';
  if (p === 'READ' && s === 'FLU') return grade <= 2 ? 'Foundations' : 'Comprehension';
  if (p === 'READ' && s === 'VOC') return 'Grammar and words';
  if (p === 'READ') return 'Comprehension';
  if (p === 'LANG') return 'Grammar and words';
  if (p === 'WRIT') return 'Writing';
  return 'Science and Social Studies';
}
function strandOfJob(job) { return /^F/.test(job) ? 'Foundations' : /^C/.test(job) ? 'Comprehension' : /^G/.test(job) ? 'Grammar and words' : /^W/.test(job) ? 'Writing' : 'Science and Social Studies'; }

function report() {
  const { ctx, loadErrors } = B.sandbox(); if (loadErrors.length) throw new Error('src does not load: ' + loadErrors.join('; '));
  const rows = JSON.parse(vm.runInContext('JSON.stringify(typeof coreRows_ === "function" ? coreRows_() : [])', ctx));
  const files = JSON.parse(vm.runInContext('JSON.stringify(typeof coreFiles_ === "function" ? coreFiles_() : [])', ctx));
  const text = {}; files.forEach(f => { const p = path.join(SRC, f + '.html'); text[f] = fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : ''; });
  const min = {}, add = (g, s, m) => { if (!(g >= 0 && g <= 8)) return; const k = g + '|' + s; min[k] = (min[k] || 0) + m; };
  let skills = 0, listed = 0;
  rows.forEach(r => { listed++; const lv = Number((/\.L(\d\d)\./.exec(r.id) || [])[1]) || 0, g = lv - 1;
    const built = new RegExp("['\"]" + r.id.replace(/\./g, '\\.') + "['\"]\\s*:\\s*\\{\\s*['\"]?name['\"]?\\s*:").test(text[r.file] || '');
    if (built) { skills++; add(g, strandOfSkill(r.id, g), r.min || 8); } });
  let texts = 0; try { const T = require('./texts.js').load(); T.out.forEach(t => { texts++; add(t.grade, strandOfJob(t.id.split('.')[0]), Math.round(t.words / (WPM[t.grade] || 120)) + 8); }); } catch (e) {}
  let units = 0; Object.keys(text).forEach(f => { const re = /TLCORE\.units\.add\(\s*\{\s*id:\s*['"]([A-Z0-9]+)\.U\d\d['"][\s\S]{0,400}?grade:\s*(\d)/g; let m;
    while ((m = re.exec(text[f]))) { units++; add(Number(m[2]), strandOfJob(m[1]), 16); } });
  const lines = [], h = m => m ? (m / 60).toFixed(1) : '';
  lines.push('| Grade | ' + STRANDS.join(' | ') + ' | Total built | Target |', '|---|' + STRANDS.map(() => '---').join('|') + '|---|---|');
  for (let g = 0; g <= 8; g++) { const per = STRANDS.map(s => min[g + '|' + s] || 0), tot = per.reduce((a, b) => a + b, 0);
    lines.push('| ' + G(g) + ' | ' + per.map(h).join(' | ') + ' | ' + (tot ? (tot / 60).toFixed(1) : '0') + ' | ' + TARGET[g] + ' |'); }
  const ss = Object.keys(min).filter(k => /Science/.test(k)).reduce((a, k) => a + min[k], 0);
  return { table: lines.join('\n'), skills, listed, texts, units, scienceHours: ss / 60 };
}

if (require.main === module) {
  const r = report();
  console.log(r.table);
  console.log('\nCounted: ' + r.skills + ' built skill(s) of ' + r.listed + ' listed, ' + r.texts + ' text(s), ' + r.units + ' unit(s). Science and Social Studies (not core): ' + r.scienceHours.toFixed(1) + ' h.');
  if (process.argv.includes('--write')) {
    const P = path.join(ROOT, 'docs', 'CORE-GROWTH-LANES.md'); let s = fs.readFileSync(P, 'utf8');
    const i = s.indexOf('## Ledger'); if (i < 0) throw new Error('no "## Ledger" in the lanes file');
    const t0 = s.indexOf('| Grade', i), endM = s.slice(t0).search(/\n(?!\|)/), t1 = endM < 0 ? s.length : t0 + endM;
    s = s.slice(0, t0) + r.table + s.slice(t1);
    s = s.replace(/(## Ledger[^\n]*\n)(?:_Written by[^\n]*\n)?/, '$1_Written by `node tools/core/ledger.js --write` on ' + new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC: hours of new Core Growth learning that is built (lessons, texts, unit checks)._\n');
    fs.writeFileSync(P, s); console.log('wrote the Ledger table in docs/CORE-GROWTH-LANES.md');
  }
}
module.exports = { report };
