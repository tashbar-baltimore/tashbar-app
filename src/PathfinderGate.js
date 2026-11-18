/* PathfinderGate.js — EVERY BOY STARTS WITH PATHFINDER (Head of School 2026-11-16 evening: "I want everyone to have to start with
   the Pathfinder"). Claude Code builder (4cc@). Read only: it writes nothing, pays nothing, places nothing.
   pfGateInfo(token) tells the boy's home screen (PathfinderCard.html) what he still owes, in order:
     1. the general Pathfinder (Reading, Math, Writing...) while it is open for him (pfEnabled_) and not finished (pfHello.show);
     2. then the Kodesh Pathfinder (pfkAllowed_) until he has one finished Kodesh test.
   While he is on a Pathfinder rest stop (PF.SIT.breakMin after a sitting), the gate does not block him: rest = the time it ends.
   A boy with no grade on the roster gets no general gate (his start level needs his grade); staff fix the roster note. */
function pfGateInfo(token) {
  var s = msSession_(token); if (!s || s.role !== 'kid' || !s.sid) return { show: false };
  var sid = String(s.sid), now = Date.now(), out = { general: null, kodesh: null, rest: 0 };
  try {
    if (pfEnabled_(sid)) {
      out.general = pfHello(token);
      var last = pfSessionsOf_(sid).pop(), sit = last && last.state && last.state.sit;
      if (out.general && out.general.show && sit && sit.paused && now - sit.paused < PF.SIT.breakMin * 60000) out.rest = sit.paused + PF.SIT.breakMin * 60000;
    }
  } catch (e) { out.general = null; }
  try {
    if (typeof pfkAllowed_ === 'function' && pfkAllowed_(sid)) {
      var K = pfkSessionsOf_(sid), done = K.some(function (x) { return x.status === 'complete'; }), going = K.some(function (x) { return x.status === 'active'; });
      out.kodesh = { show: !done, started: going };
    }
  } catch (e) { out.kodesh = null; }
  var g = out.general && out.general.show, k = out.kodesh && out.kodesh.show;
  out.next = g ? (out.rest ? 'rest' : 'general') : k ? 'kodesh' : '';
  out.show = !!out.next;
  out.rate = typeof pfRewardRate_ === 'function' ? pfRewardRate_(sid) : 1;   /* quarter rewards until done (optional Pathfinder) */
  return out;
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

/* OPTIONAL PATHFINDER, QUARTER REWARDS (Head of School 2026-11-16, replaces "everyone must start with the Pathfinder"):
   the Pathfinder is NOT required. A boy who has not finished it (the general Pathfinder while it is open for him, then the Kodesh
   Pathfinder) earns PF_REWARD.rate (one quarter) of every automatic T$ earning, rounded, at least 1 cent. Once he finishes, every
   earning is full again. Not cut: the Pathfinder's own pay (lessonId PATHFINDER), staff bonuses and corrections (other types),
   interest, store, gifts and refunds. The ledger reason says so. A boy who cannot take a part (no grade on the roster, or Pathfinder
   paused for new boys) is not cut for that part. */
var PF_REWARD = { ON: true, rate: 0.25 };
var PF_OWES_MEMO_ = {};
function pfOwes_(sid) {
  sid = String(sid || ''); if (PF_OWES_MEMO_[sid]) return PF_OWES_MEMO_[sid];
  var c = null, out = { general: false, kodesh: false };
  try { c = CacheService.getScriptCache(); var hit = c.get('pf_owes_' + sid); if (hit) return (PF_OWES_MEMO_[sid] = JSON.parse(hit)); } catch (e) {}
  try { if (typeof pfEnabled_ === 'function' && pfEnabled_(sid)) out.general = !pfSessionsOf_(sid).some(function (S) { return S.status === 'core' || S.status === 'complete'; }); } catch (e) {}
  try { if (typeof pfkAllowed_ === 'function' && pfkAllowed_(sid)) out.kodesh = !pfkSessionsOf_(sid).some(function (S) { return S.status === 'complete'; }); } catch (e) {}
  try { if (c) c.put('pf_owes_' + sid, JSON.stringify(out), out.general || out.kodesh ? 120 : 21600); } catch (e) {}
  return (PF_OWES_MEMO_[sid] = out);
}
function pfRewardRate_(sid) { if (!PF_REWARD.ON) return 1; var o = pfOwes_(sid); return o.general || o.kodesh ? PF_REWARD.rate : 1; }
