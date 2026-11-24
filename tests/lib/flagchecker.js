/* The flag checker (HoS 2026-11-24; docs/FLAG-CHECKER.md). Server side, on the Firebase engine with made-up data:
   a boy's written note is saved; the checker's list blanks roster names and carries no ids; a mark changes only reports
   made up to the list's time; 'fine' / 'fixed' leave the open list; an unknown verdict changes nothing. */
const vm = require('vm'), { createRuntime } = require('../../server/runtime.js');
module.exports = function () {
  const fails = [], oks = [];
  const rt = createRuntime({ store: { books: { T: { tabs: {}, order: [] } }, props: {} } }), r = c => vm.runInContext(c, rt.ctx), J = c => JSON.parse(r('JSON.stringify(' + c + ')'));
  r(`msSession_=function(t){return t==='staff'?{role:'staff',who:{id:'S1',name:'Rabbi Madeup'}}:{role:'boy',sid:t==='b2'?'B2':'B1'}};
     msRoster_=function(){return [{id:'B1',name:'Zevulun Madeupson'},{id:'B2',name:'Ploni Almoni'}]};
     msBook_=function(){return SpreadsheetApp.openById('T')};
     msTab_=function(){var b=msBook_();return b.getSheetByName('ev')||b.insertSheet('ev')};
     var e=msTab_('evidence'); e.appendRow(['at','sid','skill','phase','item','ok']);
     e.appendRow([new Date(),'B1','SK1','practice','What is 3+4?',0]); e.appendRow([new Date(),'B2','SK1','practice','What is 3+4?',1]);`);
  const s1 = J(`[msReport('b1',{skill:'SK1',phase:'practice',item:'What is 3+4?',reason:'wrong',note:'zevulun and PLONI think the key says 8, call 4105550000'}),
    msReport('staff',{skill:'SK1',phase:'practice',item:'What is 3+4?',reason:'confusing',note:'please check'}),
    msReport('b2',{skill:'SK2',item:'Spell cat',reason:'other'})]`);
  if (!s1.every(x => x && x.ok)) fails.push('flag checker: reports were not saved: ' + JSON.stringify(s1));
  const L = J('rpBotList_()'), f1 = (L.flags || []).find(f => f.skill === 'SK1'), txt = JSON.stringify(L);
  if (L.open !== 2 || !f1 || f1.open !== 2 || f1.staff !== 1 || f1.answers !== 2 || f1.wrong !== 1 || f1.boys !== 2) fails.push('flag checker list: wrong counts ' + txt.slice(0, 300));
  else if (!f1.notes.some(n => /^boy: \[name\] and \[name\] think the key says 8, call \[number\]$/.test(n))) fails.push('flag checker list: boy note missing or names not blanked: ' + JSON.stringify(f1.notes));
  if (/Zevulun|Ploni|Madeup|"B1"|"B2"|"S1"/i.test(txt)) fails.push('flag checker list leaks a name or an id');
  const wait = Date.now() + 5; while (Date.now() < wait) {}   /* a report made AFTER the list was read */
  J(`msReport('b2',{skill:'SK1',phase:'practice',item:'What is 3+4?',reason:'wrong'})`);
  const m2 = J(`rpBotMark_([{skill:'SK1',item:'What is 3+4?',verdict:'fixed',why:'key said 8; now 7'},{skill:'SK2',item:'Spell cat',verdict:'delete'}],${L.upTo})`);
  const L2 = J('rpBotList_()'), late = (L2.flags || []).find(f => f.skill === 'SK1');
  if (m2.changed !== 2) fails.push('flag checker mark: expected the 2 listed SK1 reports changed, got ' + JSON.stringify(m2));
  if (!late || late.open !== 1) fails.push('flag checker mark: a report made after the list must stay open for the next hour: ' + JSON.stringify(late));
  if (!(L2.flags || []).some(f => f.skill === 'SK2')) fails.push('flag checker mark: an unknown verdict must change nothing (SK2 should stay open)');
  const st = J(`(function(){ var x=msReport('b1',{skill:'SK1',phase:'practice',item:'What is 3+4?',reason:'wrong'}); return rpBotList_().flags.filter(function(f){return f.skill==='SK1'})[0]; })()`);
  if (!st || st.before.join() !== 'fixed: key said 8; now 7' || st.open !== 2) fails.push('flag checker: a new report on a fixed question should show the earlier decision: ' + JSON.stringify(st && st.before));
  const ro = J(`rpBotMark_([{skill:'SK1',item:'What is 3+4?',verdict:'reopen',why:'fix did not pass the tests; still open'}],Date.now()+1000)`);
  const L3 = J('rpBotList_()'), f3 = (L3.flags || []).find(f => f.skill === 'SK1');
  if (ro.changed !== 2 || !f3 || f3.open !== 4 || f3.before.indexOf('open: fix did not pass the tests; still open') < 0) fails.push('flag checker reopen: a failed fix must put its reports back to open and show the note: ' + JSON.stringify(ro) + ' ' + JSON.stringify(f3));
  if (!fails.length) oks.push('flag checker: boys can write what is wrong; the hourly list blanks names and has no ids; marks change only reports up to the list time');
  return { fails, oks };
};
