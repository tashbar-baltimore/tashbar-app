const R=require('path').join(__dirname,'..','..','server')+'/';const { createRuntime } = require(R + 'runtime.js'), vm = require('vm');
module.exports=function(){ const BOOK='SELFTEST_ST'; const store = { books: {}, props: { SCHOOL_STAGING_DATABASE_ID: BOOK } };
 const rt = createRuntime({ store }); const call = (fn, ...a) => rt.call(fn, a);
 const TABLES = JSON.parse(vm.runInContext('JSON.stringify(TABLES)', rt.ctx)), bk = store.books[BOOK] = { tabs: {}, order: [] };
 TABLES.forEach(n => { bk.tabs['TL ' + n] = { rows: [['Record ID', 'Record JSON', 'Updated at (UTC)', 'Updated by']] }; bk.order.push('TL ' + n); });
 call('msBootstrap'); const H = (s, c) => vm.runInContext('msHash_(' + JSON.stringify(s) + ',' + JSON.stringify(c) + ')', rt.ctx);
 const roster = bk.tabs.MS_Roster.rows; const row = roster[0].map(() => ''); row[0]='TESTST01'; row[1]='Made-up Boy A'; row[5]='s0'; row[6]=H('s0','6123'); row[7]=true; roster.push(row);
 const si = call('msSignInFast','6123'); return call('stInfo', si.token); };
if(require.main===module){ const r=module.exports(); console.log(r.ok, r.items.length, r.balance); }
