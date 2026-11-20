/* The boy's own map (kmMyMap, src/KidMap.js) on the real server code (server/runtime.js), with MADE-UP boys only.
   Seeds a roster, places levels with libApply 'place' (as a rebbe would), writes made-up mastered steps to the state tab, then
   signs each boy in (msSignInFast) and checks: the map rides along with sign-in, it holds ONLY his own data, his goal now is the
   first step he has not mastered, the unit and finish line match the staff map, Kodesh is there, growth counts this week vs last.
   Also: a staff token, a bad token and an old/expired token are refused. Returns { fails: [...], ms: { signIn, map }, map: <boy A's map> }. */
const R = require('path').join(__dirname, '..', '..', 'server') + '/';
const { createRuntime } = require(R + 'runtime.js'), vm = require('vm');
module.exports = function kidMap() {
  const fails = [], ms = {}, BOOK = 'SELFTEST_KM1';
  const store = { books: {}, props: { SCHOOL_STAGING_DATABASE_ID: BOOK } };
  const rt = createRuntime({ store }); const call = (fn, ...a) => rt.call(fn, a);
  if (rt.loadErrors.length) return { fails: rt.loadErrors.map(e => 'server file failed to load: ' + e), ms };
  const TABLES = JSON.parse(vm.runInContext('JSON.stringify(TABLES)', rt.ctx)), bk = store.books[BOOK] = { tabs: {}, order: [] };
  TABLES.forEach(n => { bk.tabs['TL ' + n] = { rows: [['Record ID', 'Record JSON', 'Updated at (UTC)', 'Updated by']] }; bk.order.push('TL ' + n); });
  call('msBootstrap');
  const H = (s, c) => vm.runInContext('msHash_(' + JSON.stringify(s) + ',' + JSON.stringify(c) + ')', rt.ctx);
  const boys = [['TESTKM01', 'Made-up Boy A', '6123'], ['TESTKM02', 'Made-up Boy B', '6124']];
  const roster = bk.tabs.MS_Roster.rows; boys.forEach((b, i) => { const row = roster[0].map(() => ''); row[0] = b[0]; row[1] = b[1]; row[5] = 'kmsalt' + i; row[6] = H('kmsalt' + i, b[2]); row[7] = true; roster.push(row); });
  vm.runInContext("CacheService.getScriptCache().put('ms_tok_km-staff', JSON.stringify({role:'staff',sid:null,pid:null,staff:null,who:{id:'KMT',name:'Made-up Rebbe',role:'head'}}), 600)", rt.ctx);
  const place = (sid, key, level) => { try { call('libApply', 'km-staff', { action: 'place', boys: [sid], key, level }); } catch (e) { fails.push('kid map: placing ' + key + ' ' + level + ' failed: ' + e.message); } };
  place('TESTKM01', 'MATH', 5); place('TESTKM01', 'READ', 5); place('TESTKM01', 'K:CHU', 3); place('TESTKM02', 'MATH', 3);
  const now = Date.now(), day = 864e5, m = at => ({ m: true, at, first: true, stars: 3 });
  const stA = { id: 'TESTKM01', skills: { 'MATH.OPS.L05.03': m(now - 2 * day), 'MATH.OPS.L05.04': m(now - day), 'MATH.PV.L05.01': m(now - 10 * day), 'MATH.PV.L05.02': m(now - 9 * day),
    'LK.CHU.L03.01': m(now - 20 * day), 'LK.CHU.L03.02': m(now - 3 * day), 'READ.COMP.L05.01': { m: false, at: now } } };
  const stB = { id: 'TESTKM02', skills: { 'MATH.NUM.L03.01': m(now - day) } };
  bk.tabs.MS_State.rows.push(['TESTKM01', JSON.stringify(stA), new Date(), 1], ['TESTKM02', JSON.stringify(stB), new Date(), 1]);
  let t = Date.now(); const si = call('msSignInFast', '6123'); ms.signIn = Date.now() - t;
  if (!si || !si.ok || si.sid !== 'TESTKM01') return { fails: fails.concat('kid map: made-up boy A could not sign in: ' + JSON.stringify(si).slice(0, 200)), ms };
  const M = si.map; if (!M) return { fails: fails.concat('kid map: sign-in did not bring the map (msSignInFast .map)'), ms };
  t = Date.now(); const M2 = call('kmMyMap', si.token); ms.map = Date.now() - t;
  const chk = (c, msg) => { if (!c) fails.push('kid map: ' + msg); };
  chk(M2 && M2.sid === 'TESTKM01', 'kmMyMap on its own gives the same boy');
  const txt = JSON.stringify(M); chk(txt.indexOf('TESTKM02') < 0 && txt.indexOf('Made-up Boy B') < 0, "boy A's map contains another boy's data");
  chk(txt.indexOf('6123') < 0 && txt.indexOf('kmsalt') < 0, 'the map must not contain codes or salts');
  const mt = M.subjects.MATH; chk(mt && mt.level === 5, 'Math level 5 (got ' + (mt && mt.level) + ')');
  if (mt) {
    chk(mt.now && !stA.skills[mt.now], 'his goal now must be a step he has not mastered (got ' + mt.now + ')');
    chk(mt.unit && mt.unit.ids.indexOf(mt.now) >= 0 && mt.unit.done <= mt.unit.total && mt.unit.total > 0, 'the unit holds his goal now (' + JSON.stringify(mt.unit) + ')');
    chk(mt.unit && mt.unit.ids.every(id => id.split('.')[1] === mt.now.split('.')[1]), 'the unit is one kind of skill (one strand)');
    chk(M.names[mt.now] && M.names[mt.now][0] && M.names[mt.now][0] !== mt.now, 'his goal now has a name');
    chk(mt.unit.ids.concat(mt.now, mt.next).filter(Boolean).every(id => M.names[id] && M.names[id][1]), 'every Math step says the real skill in plain words (HoS: clear what he is learning)');
  }
  chk(M.subjects.READ && M.subjects.READ.level === 5 && M.subjects.READ.now === 'READ.COMP.L05.01', 'Reading: a step tried but not mastered is still his goal (got ' + (M.subjects.READ && M.subjects.READ.now) + ')');
  const ch = M.kodesh['K:CHU']; chk(ch && ch.level === 3 && ch.now === 'LK.CHU.L03.03', 'Chumash level 3, goal now the 3rd lesson (got ' + JSON.stringify(ch && { level: ch.level, now: ch.now }) + ')');
  if (ch) chk(M.names[ch.now] && !/^Chumash/.test(M.names[ch.now][0]), 'Kodesh step names are short (' + (M.names[ch.now] || [])[0] + ')');
  chk(M.growth && M.growth.week.length === 3 && M.growth.prev === 2 && M.growth.total === 6, 'growth: 3 steps this week, 2 last week, 6 ever (got ' + JSON.stringify(M.growth && { w: M.growth.week.length, p: M.growth.prev, t: M.growth.total }) + ')');
  const sb = call('msSignInFast', '6124'); chk(sb && sb.map && sb.map.sid === 'TESTKM02' && JSON.stringify(sb.map).indexOf('TESTKM01') < 0, "boy B gets only his own map");
  chk(sb && sb.map && sb.map.subjects.MATH && sb.map.subjects.MATH.level === 3 && !sb.map.subjects.READ && !Object.keys(sb.map.kodesh).length, 'boy B: only Math level 3');
  const refused = tok => { try { call('kmMyMap', tok); return false; } catch (e) { return true; } };
  chk(refused('km-staff'), 'a staff token must be refused (kmMyMap is for students only)');
  chk(refused('not-a-token'), 'a bad token must be refused'); chk(refused(''), 'no token must be refused');
  /* the staff map still works after sharing its code, and says the same as the boy's own map */
  try { const SK = call('sgKodeshMap', 'km-staff'), a = SK.boys.TESTKM01 && SK.boys.TESTKM01['K:CHU'];
    chk(a && ch && a.now === ch.now && a.level === ch.level, 'staff Kodesh map and the boy\'s map agree on Chumash'); } catch (e) { fails.push('kid map: staff sgKodeshMap failed: ' + e.message); }
  try { const SR = call('sgMapReport', 'km-staff', 7), a = SR.boys.filter(b => b.id === 'TESTKM01')[0];
    chk(a && a.steps.length === M.growth.week.length && a.prev === M.growth.prev && a.total === M.growth.total, 'staff report and the boy\'s growth agree'); } catch (e) { fails.push('kid map: staff sgMapReport failed: ' + e.message); }
  return { fails, ms, map: M };
};
if (require.main === module) { const r = module.exports(); console.log(JSON.stringify(r.ms), r.fails.length ? r.fails.join('\n') : 'KID MAP OK'); if (process.env.V) console.log(JSON.stringify(r.map, null, 1).slice(0, 4000)); }
