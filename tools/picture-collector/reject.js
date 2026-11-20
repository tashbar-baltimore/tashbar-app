#!/usr/bin/env node
/* Remove pictures a person rejected while reviewing. They are deleted, taken off credits.json, and never downloaded again.
   The topic is reopened, so the next run of collect.js tops it back up with other pictures.
   Run: node tools/picture-collector/reject.js barn-owl-pixabay-1a2b3c4d.jpg [more file names…] [--out <picture-library folder>] */
'use strict';
const fs = require('fs'), path = require('path'); const L = require('./lib');
const args = process.argv.slice(2); const oi = args.indexOf('--out');
const OUT = path.resolve(oi >= 0 ? args.splice(oi, 2)[1] : path.join(__dirname, '..', '..', 'picture-library'));
const credits = L.readJSON(path.join(OUT, 'credits.json'), []); const state = L.readJSON(path.join(OUT, 'state.json'), { topics: {}, rejected: [] });
state.rejected = state.rejected || [];
let n = 0;
for (const name of args) {
  const i = credits.findIndex(c => path.basename(c.file) === path.basename(name));
  if (i < 0) { console.log('not found:', name); continue; }
  const [c] = credits.splice(i, 1); state.rejected.push(c.sha256, c.sourceId);
  try { fs.unlinkSync(path.join(OUT, 'images', c.file)); } catch (e) { /* already gone */ }
  if (state.topics[c.topic]) state.topics[c.topic] = { sources: {} };
  n++; console.log('removed:', c.file);
}
L.writeJSONAtomic(path.join(OUT, 'credits.json'), credits); L.writeJSONAtomic(path.join(OUT, 'state.json'), state);
require('./make-pages').build(OUT);
console.log(`${n} removed. Run collect.js again to refill those topics.`);
