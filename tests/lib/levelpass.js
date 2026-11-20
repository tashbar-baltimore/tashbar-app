/* LEVEL CHECKS and the 🎫 LEVEL PASS (src/PathfinderLevel.js, HoS DECISION 2026-11-20) on the real server code (server/runtime.js),
   with MADE-UP boys only. Proves: a boy with no pass at a checkable level gets 25% lesson pay; the server-scored level check gives the
   pass (and full pay); skills he answered right are skipped on his map and in his lineup and are NOT paid as mastery; one check per
   level; a staff placement still wins; a level with no check (Kodesh, other subjects) is never cut; an old applied Pathfinder result
   counts as the pass; the map carries the check list with sign-in. Returns { fails: [...], ms: { start, save }, notes: [...] }. */
const R = require('path').join(__dirname, '..', '..', 'server') + '/';
const { createRuntime } = require(R + 'runtime.js'), vm = require('vm');
module.exports = function levelPass() {
  const fails = [], ms = {}, notes = [], BOOK = 'SELFTEST_LP1';
  const store = { books: {}, props: { SCHOOL_STAGING_DATABASE_ID: BOOK } };
  const rt = createRuntime({ store }); const call = (fn, ...a) => rt.call(fn, a);
  const ev = s => JSON.parse(vm.runInContext('JSON.stringify(' + s + ')', rt.ctx));
  if (rt.loadErrors.length) return { fails: rt.loadErrors.map(e => 'server file failed to load: ' + e), ms, notes };
  const TABLES = JSON.parse(vm.runInContext('JSON.stringify(TABLES)', rt.ctx)), bk = store.books[BOOK] = { tabs: {}, order: [] };
  TABLES.forEach(n => { bk.tabs['TL ' + n] = { rows: [['Record ID', 'Record JSON', 'Updated at (UTC)', 'Updated by']] }; bk.order.push('TL ' + n); });
  call('msBootstrap');
  const H = (s, c) => vm.runInContext('msHash_(' + JSON.stringify(s) + ',' + JSON.stringify(c) + ')', rt.ctx);
  const boys = [['TESTLP01', 'Made-up Boy A', '7311', 'grade 5'], ['TESTLP02', 'Made-up Boy B', '7312', 'grade 4']];
  const roster = bk.tabs.MS_Roster.rows; boys.forEach((b, i) => { const row = roster[0].map(() => ''); row[0] = b[0]; row[1] = b[1]; row[5] = 'lpsalt' + i; row[6] = H('lpsalt' + i, b[2]); row[7] = true; row[8] = b[3]; roster.push(row); });
  vm.runInContext("CacheService.getScriptCache().put('ms_tok_lp-staff', JSON.stringify({role:'staff',sid:null,pid:null,staff:null,who:{id:'LPT',name:'Made-up Rebbe',role:'head'}}), 600)", rt.ctx);
  const place = (sid, key, level) => { try { call('libApply', 'lp-staff', { action: 'place', boys: [sid], key, level }); } catch (e) { fails.push('level pass: placing ' + key + ' ' + level + ' failed: ' + e.message); } };
  place('TESTLP01', 'MATH', 5); place('TESTLP01', 'READ', 5);
  bk.tabs.MS_State.rows.push(['TESTLP01', JSON.stringify({ id: 'TESTLP01', skills: {} }), new Date(), 1], ['TESTLP02', JSON.stringify({ id: 'TESTLP02', skills: {} }), new Date(), 1]);
  const chk = (c, msg) => { if (!c) fails.push('level pass: ' + msg); return c; };
  /* pay one right answer in a lesson through the real msSave; returns the cents the ledger row got */
  let n = 0; const pay = (tok, sid, skill) => { n++; const before = ev("moneyRowsFor_('" + sid + "').length");
    call('msSave', tok, sid, { id: sid, skills: {} }, [{ skill, phase: 'practice', item: 'q' + n, ok: true, first: false, at: Date.now() }], []);
    const rows = ev("moneyRowsFor_('" + sid + "')").slice(before).filter(r => r.lessonId === skill && r.type === 'earn'); return rows.length ? rows[0].cents : null; };
  const si = call('msSignInFast', '7311'); if (!si || !si.ok || si.sid !== 'TESTLP01') return { fails: fails.concat('level pass: made-up boy A could not sign in'), ms, notes };
  const tok = si.token, M = si.map;
  if (!chk(M && M.lc && Array.isArray(M.lc.MATH) && M.lc.MATH.length === 9, 'the map that rides with sign-in must carry .lc (the level checks)')) return { fails, ms, notes };
  chk(M.lc.MATH[4] === 1, 'Math Level 5 must have a level check waiting (got ' + M.lc.MATH[4] + ')');
  chk(!JSON.stringify(M.lc).match(/TESTLP02|7311|lpsalt/), 'the level check list holds only his own data');
  const mathL5 = M.subjects.MATH.skills.filter(y => y[1]).map(y => y[0]);
  /* 1. no pass at a checkable level: 25% */
  const c1 = pay(tok, 'TESTLP01', mathL5[0]); chk(c1 === 25, 'before the level check a Math Level 5 right answer pays 25¢ of $1 (got ' + c1 + ')');
  /* 2. a level with no check is never cut: Kodesh, Writing, and any Math/Reading level the bank cannot check */
  const ck = pay(tok, 'TESTLP01', 'LK.CHU.L03.03'); chk(ck === 100, 'a Kodesh lesson is never cut (got ' + ck + ')');
  const cw = pay(tok, 'TESTLP01', 'LANG.GRAM.L05.01'); chk(cw === 100, 'a Writing / Language lesson is never cut (got ' + cw + ')');
  const noChk = []; ['MATH', 'READ'].forEach(k => M.lc[k].forEach((v, i) => { if (!v) noChk.push(k + '|' + (i + 1)); }));
  if (noChk.length) { const [k, L] = noChk[0].split('|'), id = ev('(plList_("' + k + '")||[]).filter(function(x){return plMathLevel_(x[0])===' + L + ';})[0][0]');
    const cn = pay(tok, 'TESTLP01', id); chk(cn === 100, k + ' Level ' + L + ' has no level check, so it must never be cut (got ' + cn + ')'); }
  else { vm.runInContext("PF_LC_AV_['MATH|7|2'] = false", rt.ctx); const cn = pay(tok, 'TESTLP01', 'MATH.NUM.L07.01'); chk(cn === 100, 'a level marked "no check" must never be cut (got ' + cn + ')'); vm.runInContext("delete PF_LC_AV_['MATH|7|2']", rt.ctx); }
  /* 3. the check: server-scored, no answer key on the page */
  let t = Date.now(); const st = call('pfLevelCheckStart', tok, 'MATH', 5); ms.start = Date.now() - t;
  if (!chk(st && st.items && st.items.length >= 3 && st.items.length <= 10, 'the Math Level 5 check must have 3 to 10 questions (got ' + (st && st.items && st.items.length) + ')')) return { fails, ms, notes };
  chk(!/"ans"|"accept"|"wrong"|"b":/.test(JSON.stringify(st.items)), 'the check sent to the page must not carry answers or keys');
  const ix = st.items.map(it => ev('(function(){ var it=pfIx_().byId[' + JSON.stringify(it.id) + ']; return {skill:it.skill, ans:it.ans}; })()'));
  const skills = [...new Set(ix.map(x => x.skill))]; chk(skills.every(s => mathL5.indexOf(s) >= 0), 'every question is from a built Math Level 5 skill');
  chk(st.items.length === Math.min(10, skills.length * 2) || skills.length >= Math.min(10, st.items.length), 'about 1 question per skill, capped at 10');
  /* he gets the first two skills right, the rest wrong */
  const rightSk = skills.slice(0, 2), answers = st.items.map((it, j) => ({ item: it.id, value: rightSk.indexOf(ix[j].skill) >= 0 ? ix[j].ans : 'zz-not-it' }));
  t = Date.now(); const sv = call('pfLevelCheckSave', tok, 'MATH', 5, answers); ms.save = Date.now() - t;
  chk(sv && sv.pass && sv.right === answers.filter((a, j) => rightSk.indexOf(ix[j].skill) >= 0).length && sv.of === st.items.length, 'the check is scored on the server (got ' + JSON.stringify(sv && { r: sv.right, of: sv.of }) + ')');
  chk(sv && JSON.stringify(sv.known.slice().sort()) === JSON.stringify(rightSk.slice().sort()), 'skills answered right become "already know it" (got ' + JSON.stringify(sv && sv.known) + ')');
  const tampered = call('pfLevelCheckSave', tok, 'MATH', 5, st.items.map(it => ({ item: it.id, value: 'x' })));
  chk(tampered && tampered.already && ev("pfLcTab_().getLastRow()") === 2, 'at most one level check per subject level (a second save must not add a row)');
  const again = call('pfLevelCheckStart', tok, 'MATH', 5); chk(again && again.done, 'the check does not open twice (got ' + JSON.stringify(again).slice(0, 80) + ')');
  /* 4. full pay after the pass */
  const c2 = pay(tok, 'TESTLP01', mathL5[mathL5.length - 1]); chk(c2 === 100, 'after the level check (the 🎫 Level Pass) a Math Level 5 right answer pays in full (got ' + c2 + ')');
  /* 5. known skills: skipped on his map and in his lineup, never paid as mastery */
  const M2 = call('kmMyMap', tok); chk(M2.lc.MATH[4] === 2, 'the map shows the Level Pass at Math Level 5');
  chk(rightSk.every(s => M2.lc.known.indexOf(s) >= 0), 'the map lists the skills he already knows');
  chk(rightSk.indexOf(M2.subjects.MATH.now) < 0, 'his goal now must skip skills he already knows (got ' + M2.subjects.MATH.now + ')');
  chk(M2.subjects.MATH.skills.filter(y => rightSk.indexOf(y[0]) >= 0).every(y => y[2] === 0 && y[3] === 1), 'known skills are marked known (4th value), never mastered');
  const plan = ev("plPlanFor_('TESTLP01', {}).place.MATH");
  chk(plan && plan.path && rightSk.every(s => plan.path.indexOf(s) < 0) && rightSk.indexOf(plan.start) < 0, 'his lineup (plPlanFor_) skips known skills');
  const stA = JSON.parse(bk.tabs.MS_State.rows.filter(r => r[0] === 'TESTLP01').pop()[1]); chk(rightSk.every(s => !(stA.skills || {})[s]), 'a known skill is never written as mastered');
  const before = ev("moneyRowsFor_('TESTLP01').length");
  call('msSave', tok, 'TESTLP01', { id: 'TESTLP01', skills: {} }, [], [{ why: 'Mastered ' + rightSk[0], amt: 10 }]);
  chk(!ev("moneyRowsFor_('TESTLP01')").slice(before).some(r => /Mastered/.test(r.reason)), 'a known skill must not be paid as mastery');
  chk(!ev("moneyRowsFor_('TESTLP01')").some(r => /level check|Level Pass/i.test(r.reason) && r.cents > 0 && !r.lessonId), 'the level check itself pays nothing');
  /* 6. a staff placement still wins: the check never moved his level; a new staff level gets its own check and is cut until then */
  const pA = ev("plPlacements_()['TESTLP01'].MATH"); chk(pA.level === 5 && pA.by === 'staff', 'the level check must not change a staff placement (got ' + JSON.stringify(pA) + ')');
  place('TESTLP01', 'MATH', 6); const M3 = call('kmMyMap', tok);
  chk(M3.subjects.MATH.level === 6 && M3.lc.MATH[5] === 1, 'after staff move him to Math Level 6 the map follows staff and offers the Level 6 check');
  const l6 = M3.subjects.MATH.skills.filter(y => y[1])[0][0]; const c6 = pay(tok, 'TESTLP01', l6); chk(c6 === 25, 'Math Level 6 (no pass yet) pays 25¢ (got ' + c6 + ')');
  const c5 = pay(tok, 'TESTLP01', mathL5[1]); chk(c5 === 100, 'Math Level 5 (pass kept) still pays in full (got ' + c5 + ')');
  /* 7. an old applied Pathfinder result counts as the pass for the level it placed; a boy placed by his grade */
  const sb = call('msSignInFast', '7312'); const MB = sb.map; chk(MB && MB.subjects.MATH && MB.subjects.MATH.level === 5 && MB.subjects.MATH.byGrade && MB.lc.MATH[4] === 1, 'unplaced grade-4 boy: Math Level 5 by grade with its check waiting');
  const bL5 = MB.subjects.MATH.skills.filter(y => y[1])[2][0]; const b1 = pay(sb.token, 'TESTLP02', bL5); chk(b1 === 25, 'boy B without a pass gets 25¢ (got ' + b1 + ')');
  vm.runInContext("pfTab_('results').appendRow([new Date(), 'PF-old1', 'TESTLP02', 'MATH', 'done', 5, 'MATH.PV.L05.01', 0, 0.4, '{}', 'High', '{}', '[]', '[]', '{}', '[]', 20, 'yes', 'pathfinder', '{}']); CacheService.getScriptCache().remove('pf_lp_TESTLP02'); PF_LP_MEMO_ = {};", rt.ctx);
  const b2 = pay(sb.token, 'TESTLP02', MB.subjects.MATH.skills.filter(y => y[1])[3][0]); chk(b2 === 100, 'an old applied Pathfinder result counts as the Level Pass (got ' + b2 + ')');
  /* 8. refusals and the staff report */
  const refused = (fn, ...a) => { try { call(fn, ...a); return false; } catch (e) { return true; } };
  chk(refused('pfLevelCheckStart', 'lp-staff', 'MATH', 5), 'a staff token must be refused by the level check');
  chk(refused('pfLevelCheckStart', tok, 'K:CHU', 3) && refused('pfLevelCheckStart', tok, 'MATH', 12), 'no level check for Kodesh or an unknown level');
  try { const rep = call('pfReport', 'lp-staff', 'TESTLP01'); chk(rep.levelChecks && rep.levelChecks.length === 1 && rep.levelChecks[0].level === 5 && rep.levelChecks[0].known.length === 2, 'the staff Pathfinder report lists the level check'); } catch (e) { fails.push('level pass: staff pfReport failed: ' + e.message); }
  try { const g = call('pfGateInfo', tok); chk(g && !g.show, 'the big Pathfinder gate is retired (pfGateInfo.show must be false)'); } catch (e) { fails.push('level pass: pfGateInfo failed: ' + e.message); }
  notes.push('checkable levels: MATH ' + M.lc.MATH.join('') + ' READ ' + M.lc.READ.join('') + ' (0 none, 1 waiting, 2 pass)');
  return { fails, ms, notes };
};
if (require.main === module) { const r = module.exports(); console.log(JSON.stringify(r.ms), r.notes.join(' | ')); console.log(r.fails.length ? r.fails.join('\n') : 'LEVEL PASS OK'); }
