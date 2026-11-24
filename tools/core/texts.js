#!/usr/bin/env node
/* Core Growth (job T): the content store. Long texts live in texts/<JOB>/<ID>.txt (format: tools/core/textfmt.js,
   guide: docs/core-growth/HOW-TO-ADD-A-TEXT.md) and are published as /texts/<ID>.json by web/build.js.
     node tools/core/texts.js check            every text: format, grade length, Divine Name, words, picture, size
     node tools/core/texts.js show <ID>        the text as the Reader gets it (JSON), with its word count
     node tools/core/texts.js build <dir>      writes <dir>/<ID>.json for every text (web/build.js does this) */
const fs = require('fs'), path = require('path');
const F = require('./textfmt.js');
const ROOT = path.join(__dirname, '..', '..'), TEXTS = path.join(ROOT, 'texts'), PICS = path.join(ROOT, 'art', 'pics');

function load() {
  const out = [], problems = [], seen = {};
  if (!fs.existsSync(TEXTS)) return { out, problems };
  const pics = fs.existsSync(PICS) ? new Set(fs.readdirSync(PICS)) : null;
  for (const job of fs.readdirSync(TEXTS).sort()) {
    const d = path.join(TEXTS, job); if (!fs.statSync(d).isDirectory()) { if (!/^README/i.test(job)) problems.push('texts/' + job + ': put texts in texts/<JOB>/'); continue; }
    if (!/^[A-Z][A-Z0-9]*$/.test(job)) problems.push('texts/' + job + ': the folder is the job letters (F, C45, ...)');
    for (const f of fs.readdirSync(d).sort()) {
      const rel = 'texts/' + job + '/' + f;
      if (!/\.txt$/.test(f)) { problems.push(rel + ': only .txt files go here'); continue; }
      const r = F.parse(fs.readFileSync(path.join(d, f), 'utf8'), rel); r.problems.forEach(x => problems.push(rel + ': ' + x)); if (!r.text) continue;
      const T = r.text;
      if (f !== T.id + '.txt') problems.push(rel + ': the file name must be its id (' + T.id + '.txt)');
      if (T.id.split('.')[0] !== job) problems.push(rel + ': the id must start with the job letters (' + job + '.)');
      if (seen[T.id]) problems.push(rel + ': id ' + T.id + ' is also used by ' + seen[T.id]); seen[T.id] = rel;
      F.check(T, pics).forEach(x => problems.push(rel + ': ' + x));
      out.push(T);
    }
  }
  return { out, problems };
}

function build(dir) {
  const { out, problems } = load(); if (problems.length) throw new Error('texts have problems:\n' + problems.join('\n'));
  fs.mkdirSync(dir, { recursive: true });
  out.forEach(T => fs.writeFileSync(path.join(dir, T.id + '.json'), JSON.stringify(T)));
  return out.length;
}

module.exports = { load, build };

if (require.main === module) {
  const a = process.argv.slice(2);
  if (a[0] === 'check') { const { out, problems } = load(); problems.forEach(p => console.log('PROBLEM ' + p)); console.log(out.length + ' text(s), ' + out.reduce((n, t) => n + t.words, 0) + ' words, ' + problems.length + ' problem(s)'); process.exit(problems.length ? 1 : 0); }
  else if (a[0] === 'show') { const T = load().out.find(t => t.id === a[1]); if (!T) { console.error('no text ' + a[1]); process.exit(1); } console.log(JSON.stringify(T, null, 1)); }
  else if (a[0] === 'build') { console.log('wrote ' + build(a[1] || path.join(ROOT, 'web', 'dist', 'texts')) + ' text(s)'); }
  else console.log(fs.readFileSync(__filename, 'utf8').split('*/')[0]);
}
