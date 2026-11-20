/* PathfinderGate.js — once "every boy starts with the Pathfinder" (Head of School 2026-11-16), then the optional Pathfinder with
   quarter rewards. HEAD OF SCHOOL DECISION 2026-11-20 ("split the Pathfinder"): the big test is no longer pushed (pfGateInfo below
   always says show: false) and the 25¢ rule now means the 🎫 LEVEL PASS (PathfinderLevel.js). The web.app hand-off stays for
   staff and for an old Pathfinder a boy still wants to finish from the Pathfinder page itself. Writes nothing, pays nothing. */
/* RETIRED (Head of School DECISION 2026-11-20, "split the Pathfinder"): the big Pathfinder is no longer pushed on a boy. No gate, no
   invitation, no corner card. Level checks (PathfinderLevel.js) take its place. Kept as a call so an old page still gets an answer. */
function pfGateInfo(token) {
  var s = msSession_(token); if (!s || s.role !== 'kid' || !s.sid) return { show: false };
  return { show: false, next: '', general: null, kodesh: null, rest: 0, retired: true, rate: pfRewardRate_(String(s.sid)) };
}

/* WEB.APP HAND-OFF (Head of School: "update the firebase"). A boy signed in on tashbar-learning-live.web.app who taps Start
   goes to the Pathfinder page on the Apps Script link, a different site that cannot see his web.app sign-in. So the card first asks
   for a one-time code (pfHandoff: kid sign-in only, random, good for 2 minutes, works once) and puts it in the link (?h=); the
   Pathfinder page trades it back for his sign-in (pfHandoffRedeem) and drops it. His sign-in itself never goes in a link. */
function pfHandoff(token) {
  var s = msSession_(token); if (!s || s.role !== 'kid' || !s.sid) throw new Error('Please sign in again.');
  var code = Utilities.getUuid().replace(/-/g, '').slice(0, 24);
  CacheService.getScriptCache().put('pf_ho_' + code, JSON.stringify({ token: String(token), sid: String(s.sid) }), 120);
  return code;
}
function pfHandoffRedeem(code) {
  code = String(code || ''); if (!/^[0-9a-f]{24}$/.test(code)) return null;
  var c = CacheService.getScriptCache(), raw = c.get('pf_ho_' + code); if (!raw) return null;
  c.remove('pf_ho_' + code);
  var o = JSON.parse(raw); try { var s = msSession_(o.token); if (!s || s.role !== 'kid' || String(s.sid) !== o.sid) return null; } catch (e) { return null; }
  return { token: o.token };
}

/* THE 25¢ RULE, NEW MEANING (Head of School DECISION 2026-11-20): the 🎫 LEVEL PASS. The old rule ("a quarter of every automatic
   earning until the whole Pathfinder, general and Kodesh, is finished") is gone. Now Money.js moneyPost_ cuts a lesson earning to
   PF_REWARD.rate ONLY for a lesson in a Math / Reading level that has a level check and where he has no Level Pass yet
   (pfLevelRate_ in PathfinderLevel.js). Not cut, as before: the Pathfinder's own pay (lessonId PATHFINDER), staff rows (e.by),
   interest, store, gifts, refunds; and now also every earning that is not a lesson in such a level (Kodesh, other subjects,
   streaks, daily goal, treasure chest). PF_REWARD.ON = false turns every cut off. */
var PF_REWARD = { ON: true, rate: 0.25 };
/* the share for one earning (Money.js) */
function pfLessonRate_(sid, lessonId) { try { return typeof pfLevelRate_ === 'function' ? pfLevelRate_(String(sid || ''), lessonId) : 1; } catch (e) { return 1; } }
/* for the Store and Canteen note (Canteen.js cnPfRate_): a quarter while a level he is on now still waits for its check */
function pfRewardRate_(sid) { if (!PF_REWARD.ON) return 1; try { return typeof pfLcNoteRate_ === 'function' ? pfLcNoteRate_(String(sid || '')) : 1; } catch (e) { return 1; } }
