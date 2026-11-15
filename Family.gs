/* ===== Family.js (v73, takeover builder, 2026-11-11)
   1. Family contacts (tab Family_Contacts) and the Friday family message: the staff screen builds one short message
      per boy (skills mastered this week, his streak, one thing to praise, one thing to practice, his levels), to PRINT
      or to EMAIL through the staff member's own mail (a mailto link). Automatic sending is not built: it would need a new
      Google permission that the Head of School must approve in the editor first.
   2. Monthly prizes (Head of School decision 2026-11-11 20:45): most improved 1st/2nd/3rd and the school goal, paid
      once per month through the money rules (Money.js RULES month*). Only the Head of School can award them. ===== */
var FAM = { TAB: 'Family_Contacts', HEAD: ['student_id', 'parents', 'email', 'phone', 'notes', 'updated', 'by'] };
function famSheet_() {
  var ss = msBook_(), sh = ss.getSheetByName(FAM.TAB);
  if (!sh) { sh = ss.insertSheet(FAM.TAB); sh.getRange(1, 1, 1, FAM.HEAD.length).setValues([FAM.HEAD]).setFontWeight('bold'); sh.setFrozenRows(1); }
  return sh;
}
function famClip_(s, n) { return String(s == null ? '' : s).replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, n); }
function famContacts_() { var sh = famSheet_(), n = sh.getLastRow(), o = {}; if (n >= 2) sh.getRange(2, 1, n - 1, FAM.HEAD.length).getValues().forEach(function (r, i) { if (r[0]) o[String(r[0])] = { row: i + 2, parents: String(r[1] || ''), email: String(r[2] || ''), phone: String(r[3] || ''), notes: String(r[4] || '') }; }); return o; }
function famWeekStart_() { var d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - d.getDay()); return d.getTime(); }   /* Sunday */
function sgFamily(token) {
  var s = sgStaff_(token), ctx = sgCtx_(), c = famContacts_(), w0 = famWeekStart_();
  var kn = famKodeshNames_();
  var boys = msRoster_().filter(function (r) { return !/^TEST-/.test(r.id); }).map(function (r) {
    var row = sgRow_(r, ctx), st = ctx.states[r.id] || {}, sk = st.skills || {}, week = [];
    var kweek = [];
    Object.keys(sk).forEach(function (k) { if (sk[k] && sk[k].m && Number(sk[k].at) >= w0) (/^(LK|HEB)\./.test(k) ? kweek : week).push(k); });   /* v91: Limudei Kodesh kept separate (HEB = Lashon Hakodesh L1-9, DECISION 0135) */
    var con = c[r.id] || {};
    return { id: r.id, name: r.name, week: week, kweek: kweek.map(function (k) { return kn[k] || k; }), streak: (st.streak && st.streak.n) || 0, cells: row.cells, mm: row.mm, parents: con.parents || '', email: con.email || '', phone: con.phone || '' };
  }).sort(function (a, b) { return a.name.localeCompare(b.name); });
  return { boys: boys, head: sgIsHead_(s), week: w0 };
}
function sgFamilySet(token, sid, f) {
  var s = sgHead_(token); sid = String(sid || ''); f = f || {};
  if (!msRoster_().some(function (x) { return x.id === sid; })) throw new Error('That boy is not on the list.');
  var email = famClip_(f.email, 200); if (email && !/^[^@\s,;]+@[^@\s,;]+\.[^@\s,;]+(\s*[,;]\s*[^@\s,;]+@[^@\s,;]+\.[^@\s,;]+)*$/.test(email)) throw new Error('That email does not look right.');
  return sgLock_(function () {
    var sh = famSheet_(), c = famContacts_(), line = [sid, famClip_(f.parents, 120), email, famClip_(f.phone, 60), famClip_(f.notes, 200), new Date(), String((s.who && s.who.name) || 'Head of School')];
    if (c[sid]) sh.getRange(c[sid].row, 1, 1, line.length).setValues([line]); else sh.appendRow(line);
    return { ok: true };
  });
}
/* Paste from a spreadsheet: one boy per line, "Boy name <tab or comma> parents <tab or comma> email <tab or comma> phone". Matches by name. */
function sgFamilyBulk(token, text) {
  sgHead_(token); var roster = msRoster_(), done = [], miss = [];
  String(text || '').split(/\r?\n/).slice(0, 400).forEach(function (line) {
    var p = line.split(/\t|,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map(function (x) { return x.replace(/^"|"$/g, '').trim(); }); if (!p[0]) return;
    var r = roster.filter(function (x) { return x.name.toLowerCase() === p[0].toLowerCase(); })[0];
    if (!r) { miss.push(p[0]); return; }
    try { sgFamilySet(token, r.id, { parents: p[1], email: p[2], phone: p[3] }); done.push(r.name); } catch (e) { miss.push(p[0] + ' (' + e.message + ')'); }
  });
  return { saved: done.length, missed: miss };
}
/* Monthly prizes. ym = 'YYYY-MM'. Same goal as the staff "This month" page: 8 skills per real boy, at least 50. */
function sgAwardPrizes(token, ym) {
  var s = sgHead_(token); ym = String(ym || ''); if (!/^\d{4}-\d{2}$/.test(ym)) throw new Error('Pick a month.');
  var y = Number(ym.slice(0, 4)), m = Number(ym.slice(5)) - 1, a = new Date(y, m, 1).getTime(), b = new Date(y, m + 1, 1).getTime();
  if (b > Date.now()) throw new Error('Prizes are awarded after the month is over.');
  var states = {}; msRows_('state').forEach(function (r) { try { states[String(r[0])] = JSON.parse(r[1]); } catch (e) {} });
  var boys = msRoster_().filter(function (r) { return !/^TEST-/.test(r.id); }).map(function (r) {
    var sk = (states[r.id] || {}).skills || {}, n = 0; Object.keys(sk).forEach(function (k) { var t = Number(sk[k] && sk[k].at); if (sk[k] && sk[k].m && t >= a && t < b) n++; });
    return { id: r.id, name: r.name, n: n };
  });
  var total = boys.reduce(function (x, r) { return x + r.n; }, 0), goal = Math.max(50, Math.ceil(boys.length * 8 / 10) * 10), paid = [], by = String((s.who && s.who.name) || 'Head of School');
  var top = boys.filter(function (r) { return r.n > 0; }).sort(function (p, q) { return q.n - p.n || p.name.localeCompare(q.name); }).slice(0, 3);
  return sgLock_(function () {
    top.forEach(function (r, i) { var rule = 'monthImproved' + (i + 1), row = moneyPost_({ sid: r.id, type: 'bonus', cents: moneyRule_(rule), reason: MONEY.RULES[rule].label + ' (' + ym + ')', key: 'prize:improved:' + ym + ':' + (i + 1), by: by }); if (row) paid.push(r.name + ': ' + MONEY.RULES[rule].label); });
    if (total >= goal) boys.forEach(function (r) { if (r.n < 1) return; var row = moneyPost_({ sid: r.id, type: 'bonus', cents: moneyRule_('monthSchoolGoal'), reason: MONEY.RULES.monthSchoolGoal.label + ' (' + ym + ')', key: 'prize:goal:' + ym + ':' + r.id, by: by }); if (row) paid.push(r.name + ': school goal'); });
    return { ym: ym, total: total, goal: goal, reached: total >= goal, top: top, paid: paid };
  });
}

/* v74: the school goal for the boys' home screen (cached 10 minutes). First names only for the shout-out. */
function msSchoolGoal(token) {
  msSession_(token);
  var c = CacheService.getScriptCache(), hit = c.get('tl_goal_v1'); if (hit) { try { return JSON.parse(hit); } catch (e) {} }
  var states = {}; msRows_('state').forEach(function (r) { try { states[String(r[0])] = JSON.parse(r[1]); } catch (e) {} });
  var now = new Date(), a = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  var boys = msRoster_().filter(function (r) { return !/^TEST-/.test(r.id); }).map(function (r) {
    var sk = (states[r.id] || {}).skills || {}, n = 0; Object.keys(sk).forEach(function (k) { if (sk[k] && sk[k].m && Number(sk[k].at) >= a) n++; });
    return { first: String(r.name || '').split(' ')[0], n: n };
  });
  var total = boys.reduce(function (x, r) { return x + r.n; }, 0), goal = Math.max(50, Math.ceil(boys.length * 8 / 10) * 10);
  var top = boys.filter(function (r) { return r.n > 0; }).sort(function (p, q) { return q.n - p.n; }).slice(0, 3).map(function (r) { return r.first; });
  var out = { total: total, goal: goal, top: top, month: Utilities.formatDate(now, 'America/New_York', 'MMMM') };
  try { c.put('tl_goal_v1', JSON.stringify(out), 600); } catch (e) {}
  return out;
}

/* v91: names of Limudei Kodesh lessons (read from KodeshMore.html), so the Friday message can list them in their own line. */
function famKodeshNames_() {
  var t = ''; try { t = tlFileText_('KodeshMore'); } catch (e) { return {}; }
  var re = /['"](LK\.[A-Z]+\.L\d\d\.\d\d(?:\.[a-z])?)['"]\s*:\s*\{\s*name\s*:\s*(['"])((?:\\.|(?!\2)[^\\])*)\2/g, m, o = {};
  while ((m = re.exec(t))) if (!o[m[1]]) o[m[1]] = m[3];
  var h = /['"](HEB\.[A-Z]+\.L\d\d\.\d\d)['"]\s*:\s*\{\s*["']?name["']?\s*:\s*(['"])((?:\\.|(?!\2)[^\\])*)\2/g;   /* Lashon Hakodesh (HEB) lesson names */
  while ((m = h.exec(t))) if (!o[m[1]]) o[m[1]] = m[3].replace(/\\(.)/g, '$1');
  return o;
}
