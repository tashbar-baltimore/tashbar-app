/* Core Growth: which skill ids are already used under a prefix, and the next free Core Growth number.
   node tools/core-ids.js READ.COMP.L06      (docs/core-growth/HOW-TO-ADD-A-SKILL.md, step 1) */
const vm = require('vm'), path = require('path');
const { createRuntime } = require(path.join(__dirname, '..', 'server', 'runtime.js'));
const pre = String(process.argv[2] || '').replace(/\.$/, '');
if (!/^[A-Z]+\.[A-Z]+\.L\d\d$/.test(pre)) { console.log('Usage: node tools/core-ids.js READ.COMP.L06'); process.exit(1); }
const rt = createRuntime({ store: { books: {}, props: {} } });
const used = JSON.parse(vm.runInContext('JSON.stringify((function(){var o={};Object.keys(CI_INDEX.sk).forEach(function(i){o[i]=1});[READ_K8,LANG_K8,SCI_K8,SS_K12].forEach(function(L){L.forEach(function(x){o[x[0]]=1})});Object.keys(CR_SKILLS).forEach(function(i){o[i]=1});return Object.keys(o)})())', rt.ctx))
  .filter(id => id.indexOf(pre + '.') === 0).sort();
let n = 21; const nums = used.map(id => Number(id.split('.')[3])); while (nums.indexOf(n) >= 0) n++;
console.log('Used under ' + pre + ': ' + (used.join(', ') || 'none'));
console.log('Next free Core Growth id: ' + pre + '.' + String(n).padStart(2, '0'));
