/* StaffReview.js — TEACHING RULE Stage C: the REBBE VIEW of review (Head of School DECISION 2026-11-17 1005-ET, HQ "00 TEACHING RULE").
   rabbikhaver-cloud-builder-3, 2026-11-18 (Head of School 2026-11-17: "do all the stuff that's ready").
   READ ONLY. It reads each boy's saved review schedule, st.mr = {skill: [level, dueDay, lastKind]}, which MasteryReview.html (Stage A)
   writes on the boy page, and tells staff:
   - AUTOMATIC: the skill held up in 3 or more clean spaced reviews (first try, no hints, not rushed, on later days);
   - SLIPPING: he missed it in a review and has not won it back yet (the review level fell back and it is due again by tomorrow);
   - BUILDING: mastered, reviews under way; DUE: reviews waiting today.
   Writes nothing, changes no mastery, evidence or money. Staff only (sgStaff_); one boy also goes through tlGuard_.
   The page side is StaffReviewPage.html. Both functions are in API_ALLOW (ApiRoute.js) so the Firebase staff page can call them. */
var SRV_AUTO = 3;   /* the same number as MasteryReview.html AUTO */
function srvDay_() { var d = new Date(); return Math.floor((d.getTime() - d.getTimezoneOffset() * 60000) / 86400000); }
/* pure: one boy's state -> {tracked, due, building, auto:[ids], slip:[ids]} */
function srvSum_(st, today) {
  var M = (st && st.mr) || {}, t = today == null ? srvDay_() : today, out = { tracked: 0, due: 0, building: 0, auto: [], slip: [] };
  Object.keys(M).forEach(function (id) {
    var r = M[id]; if (!r || !r.length) return;
    var lv = Number(r[0]) || 0, due = Number(r[1]) || 0, kind = String(r[2] || '');
    out.tracked++; if (due <= t) out.due++;
    if (lv >= SRV_AUTO) out.auto.push(id);
    else if (kind && lv <= 1 && due <= t + 1) out.slip.push(id);   /* a miss sets level down and due tomorrow; a clean answer moves it 3+ days out */
    else out.building++;
  });
  return out;
}
function srvName_(id) { try { if (typeof pfdNameOf_ === 'function') { var n = pfdNameOf_(id); if (n && n !== id) return String(n).replace(/\s*\bLevel\s*\d+\b/gi, '').trim(); } } catch (e) {} try { var o = typeof sgNames_ === 'function' ? sgNames_() : {}; if (o[id]) return o[id][0]; } catch (e) {} return id; }
function srvState_(sid) { var row = typeof msStateRowOf_ === 'function' ? msStateRowOf_(sid) : []; try { return row && row[0] && row[0][1] ? JSON.parse(row[0][1]) : {}; } catch (e) { return {}; } }
/* one boy, for his drawer */
function sgBoyReview(token, sid) {
  tlGuard_(token, sid); sgStaff_(token); sid = String(sid || '');
  var s = srvSum_(srvState_(sid)), nm = function (id) { return [id, srvName_(id)]; };
  return { tracked: s.tracked, due: s.due, building: s.building, auto: s.auto.map(nm), slip: s.slip.map(nm) };
}
/* every boy he may see, slipping first */
function sgReviewAll(token) {
  sgStaff_(token);
  var states = {}; msRows_('state').forEach(function (r) { var sid = String(r[0] || ''); if (!sid) return; try { states[sid] = JSON.parse(r[1]); } catch (e) {} });
  var t = srvDay_();
  return msRoster_().filter(function (r) { return !/^TEST-/.test(r.id); }).map(function (r) {
    var x = srvSum_(states[r.id] || {}, t); return { id: r.id, name: r.name, tracked: x.tracked, auto: x.auto.length, slip: x.slip.length, due: x.due };
  }).sort(function (a, b) { return b.slip - a.slip || b.due - a.due || a.name.localeCompare(b.name); });
}
