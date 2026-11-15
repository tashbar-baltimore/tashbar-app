/* Arena.js — v212 (takeover3, Head of School 2026-11-15: "a Chavrusa Arena … not only Torah, all the subjects … a clear winner that gains something").
   קִנְאַת סוֹפְרִים תַּרְבֶּה חָכְמָה (Bava Basra 21a): healthy rivalry between learners increases wisdom.
   LIVE CHAVRUSA DUEL between two boys on two Chromebooks (ArenaPage.html):
     1. The host picks a subject and a topic; his page builds 10 questions from the lessons (BANK_ALL) and calls arOpen → a 4-digit code.
     2. His chavrusa types the code (arJoin). After a 3-second countdown both answer the same 10 questions; each page polls arPoll
        every ~1.5 s, so each boy sees the other's candles light up.
     3. The server keeps the right answers and checks each answer (arAnswer), so nobody can fake a win. Score = right answers;
        a tie goes to the faster total time.
     4. The end: KINAS SOFRIM. Both see the questions the other missed with the right answers. The winner teaches his chavrusa;
        when the chavrusa taps "He taught me" (arTeach), the teacher earns a teaching bonus.
   ARENA POINTS (server-side only, from the AR_Duels and AR_Teach sheets): play 1, win 3 more, tie 1 more each, teach 2.
     Only 12 duels a day count, and at most 4 a day with the same chavrusa. Titles grow with points (ArenaPage shows them).
   No public ranking: a boy sees his own points, title and trophies; the rebbe sees the duels (StaffNotes sgParshaInfo → arena).
   A rebbe can switch the Arena off (SG_Settings 'arena' {on:false}), for example during class. Match state lives in the script cache (6 h). */
var AR = { TTL: 21600, DUELS: 'AR_Duels', DH: ['at', 'code', 'subject', 'topic', 'host_id', 'host_name', 'guest_id', 'guest_name', 'host_score', 'guest_score', 'host_ms', 'guest_ms', 'winner_id', 'n'],
  TEACH: 'AR_Teach', TH: ['at', 'code', 'teacher_id', 'learner_id'], PER_DAY: 12, PER_PAIR: 4, LIMIT_MS: 8 * 60000 };

function arKid_(token) { var s = msSession_(token); if (!s || !s.sid || s.role === 'staff') throw new Error('Please sign in again.'); return s; }
function arName_(sid) { var r = msRoster_().filter(function (x) { return x.id === sid; })[0]; return r ? String(r.name).split(' ')[0] : 'Chavrusa'; }
function arOn_() { var v = null; try { v = sgsGet_('arena'); } catch (e) {} return !(v && v.on === false); }
function arC_() { return CacheService.getScriptCache(); }
function arGet_(code) { var j = arC_().get('ar|' + code); return j ? JSON.parse(j) : null; }
function arPut_(m) { arC_().put('ar|' + m.code, JSON.stringify(m), AR.TTL); }
function arLock_(fn) { var l = LockService.getScriptLock(); l.waitLock(15000); try { return fn(); } finally { l.releaseLock(); } }
function arStr_(s, n) { return String(s == null ? '' : s).slice(0, n); }

function arView_(m, sid) {
  var me = m.host.id === sid ? m.host : m.guest, them = m.host.id === sid ? m.guest : m.host;
  var sc = function (p) { return p ? p.ans.filter(function (a) { return a && a.ok; }).length : 0; }, cnt = function (p) { return p ? p.ans.filter(Boolean).length : 0; };
  var v = { code: m.code, state: m.state, label: m.label, subject: m.subject, n: m.qs.length, start: m.start || 0, now: Date.now(),
    me: { name: me ? me.name : '', done: cnt(me), score: sc(me) }, them: them ? { name: them.name, done: cnt(them), score: sc(them) } : null,
    host: m.host.id === sid };
  if (m.state !== 'wait') v.qs = m.qs;
  if (m.state === 'done') {
    v.res = m.res;
    v.review = m.qs.map(function (q, i) { return { q: q.q, pic: q.pic || '', o: q.o, a: m.a[i], me: me && me.ans[i] ? me.ans[i].c : null, them: them && them.ans[i] ? them.ans[i].c : null }; });
    v.taught = !!m.taught;
  }
  return v;
}
/* the host opens a duel: pack = { subject, topic, label, qs:[{q, o:[…], pic, a}] } (a = index of the right choice, chosen on his page) */
function arOpen(token, pack) {
  var s = arKid_(token); if (!arOn_()) throw new Error('The Arena is closed right now. Ask your rebbe!');
  pack = pack || {}; var qs = Array.isArray(pack.qs) ? pack.qs.slice(0, 15) : [];
  if (qs.length < 5) throw new Error('This topic does not have enough questions yet. Pick another one!');
  var A = [], Q = qs.map(function (q) { var o = (Array.isArray(q.o) ? q.o : []).slice(0, 6).map(function (x) { return arStr_(x, 160); }), a = Math.round(Number(q.a));
    if (o.length < 2 || !(a >= 0 && a < o.length)) throw new Error('A question was not ready. Try again.'); A.push(a);
    return { q: arStr_(q.q, 300), o: o, pic: arStr_(q.pic, 120), id: arStr_(q.id, 40) }; });
  return arLock_(function () {
    var code = ''; for (var t = 0; t < 30; t++) { code = String(1000 + Math.floor(Math.random() * 9000)); if (!arGet_(code)) break; }
    var m = { code: code, at: Date.now(), subject: arStr_(pack.subject, 20), topic: arStr_(pack.topic, 40), label: arStr_(pack.label, 80), qs: Q, a: A,
      host: { id: s.sid, name: arName_(s.sid), ans: [] }, guest: null, state: 'wait' };
    arPut_(m); return arView_(m, s.sid);
  });
}
function arJoin(token, code) {
  var s = arKid_(token); if (!arOn_()) throw new Error('The Arena is closed right now. Ask your rebbe!'); code = String(code || '').replace(/\D/g, '');
  return arLock_(function () {
    var m = arGet_(code); if (!m) throw new Error('No duel has the code ' + code + '. Check the number with your chavrusa.');
    if (m.host.id === s.sid) throw new Error('That is your own duel. Give the code to your chavrusa!');
    if (m.guest && m.guest.id !== s.sid) throw new Error('That duel already has two players.');
    if (!m.guest) { m.guest = { id: s.sid, name: arName_(s.sid), ans: [] }; m.state = 'go'; m.start = Date.now() + 3500; arPut_(m); }
    return arView_(m, s.sid);
  });
}
function arFinish_(m) {
  if (m.state === 'done') return;
  var sc = function (p) { return p.ans.filter(function (a) { return a && a.ok; }).length; }, ms = function (p) { var t = 0; p.ans.forEach(function (a) { if (a) t = Math.max(t, a.ms); }); return t || 9e9; };
  var hs = sc(m.host), gs = m.guest ? sc(m.guest) : 0, hm = ms(m.host), gm = m.guest ? ms(m.guest) : 9e9, w = '';
  if (m.guest) { if (hs !== gs) w = hs > gs ? m.host.id : m.guest.id; else if (hs > 0 && Math.abs(hm - gm) > 1500) w = hm < gm ? m.host.id : m.guest.id; }
  m.res = { hs: hs, gs: gs, winner: w, tie: !w, hostName: m.host.name, guestName: m.guest ? m.guest.name : '' };
  m.state = 'done';
  try { sgdTab_(AR.DUELS, AR.DH).appendRow([new Date(), m.code, m.subject, m.label, m.host.id, m.host.name, m.guest ? m.guest.id : '', m.guest ? m.guest.name : '', hs, gs, hm < 9e9 ? hm : '', gm < 9e9 ? gm : '', w, m.qs.length]); } catch (e) {}
  try { arC_().remove('arst|' + m.host.id); if (m.guest) arC_().remove('arst|' + m.guest.id); } catch (e) {}
}
function arCheckEnd_(m) {
  if (m.state !== 'go' || !m.guest) return false;
  var n = m.qs.length, hd = m.host.ans.filter(Boolean).length === n, gd = m.guest.ans.filter(Boolean).length === n;
  if ((hd && gd) || Date.now() - (m.start || 0) > AR.LIMIT_MS) { arFinish_(m); return true; }
  return false;
}
function arPoll(token, code) {
  var s = arKid_(token); var m = arGet_(String(code || ''));
  if (!m) throw new Error('This duel has ended.');
  if (m.state === 'go' && Date.now() - (m.start || 0) > AR.LIMIT_MS) { arLock_(function () { m = arGet_(m.code); if (arCheckEnd_(m)) arPut_(m); }); }
  return arView_(m, s.sid);
}
function arAnswer(token, code, i, choice) {
  var s = arKid_(token); i = Math.round(Number(i)); choice = Math.round(Number(choice));
  return arLock_(function () {
    var m = arGet_(String(code || '')); if (!m) throw new Error('This duel has ended.');
    var p = m.host.id === s.sid ? m.host : (m.guest && m.guest.id === s.sid ? m.guest : null); if (!p) throw new Error('You are not in this duel.');
    if (m.state !== 'go' || !(i >= 0 && i < m.qs.length)) return { ok: false, right: null, view: arView_(m, s.sid) };
    var ok = false; if (!p.ans[i]) { ok = choice === m.a[i]; p.ans[i] = { c: choice, ok: ok, ms: Math.max(0, Date.now() - (m.start || Date.now())) }; } else ok = p.ans[i].ok;
    arCheckEnd_(m); arPut_(m);
    return { ok: ok, right: m.a[i], view: arView_(m, s.sid) };
  });
}
/* the chavrusa who lost (or tied) confirms: "he taught me" → the teacher earns the teaching bonus (once per duel) */
function arTeach(token, code) {
  var s = arKid_(token);
  return arLock_(function () {
    var m = arGet_(String(code || '')); if (!m || m.state !== 'done' || m.taught || !m.guest) return { ok: false };
    var me = m.host.id === s.sid ? m.host : m.guest, other = me === m.host ? m.guest : m.host; if (!me || me.id !== s.sid) return { ok: false };
    if (m.res.winner === s.sid) return { ok: false };
    m.taught = other.id; arPut_(m);
    try { sgdTab_(AR.TEACH, AR.TH).appendRow([new Date(), m.code, other.id, s.sid]); arC_().remove('arst|' + other.id); } catch (e) {}
    return { ok: true, teacher: other.name };
  });
}
/* points for one boy (server truth) */
function arPoints_(sid, duels, teach) {
  var day = {}, pair = {}, pts = 0, wins = 0, played = 0, taught = 0, wk = 0, weekAgo = Date.now() - 7 * 86400000, subj = {};
  duels.forEach(function (r) { var h = String(r[4]), g = String(r[6]); if (h !== sid && g !== sid) return; if (!g) return;
    var t = r[0] instanceof Date ? r[0].getTime() : new Date(r[0]).getTime(), dk = Utilities.formatDate(new Date(t), 'America/New_York', 'yyyy-MM-dd'), o = h === sid ? g : h;
    day[dk] = (day[dk] || 0) + 1; pair[dk + o] = (pair[dk + o] || 0) + 1; if (day[dk] > AR.PER_DAY || pair[dk + o] > AR.PER_PAIR) return;
    var p = 1; played++; var w = String(r[12]); if (w === sid) { p += 3; wins++; } else if (!w) p += 1;
    pts += p; if (t > weekAgo) wk += p; subj[r[2]] = (subj[r[2]] || 0) + (w === sid ? 1 : 0); });
  teach.forEach(function (r) { if (String(r[2]) === sid) { pts += 2; taught++; var t = r[0] instanceof Date ? r[0].getTime() : new Date(r[0]).getTime(); if (t > weekAgo) wk += 2; } });
  /* v225 PARSHA SIYUM: every Parsha duel or challenge with 7+ right counts (no daily cap) */
  var pars = {}; duels.forEach(function (r) { var h = String(r[4]), g = String(r[6]); if (h !== sid && g !== sid) return; var m = /^Parshas (.+?) \(Level/.exec(String(r[3] || '')); if (!m) return;
    var sc = Number(h === sid ? r[8] : r[9]) || 0, n = Number(r[13]) || 10; if (sc >= Math.ceil(n * 0.7)) pars[m[1]] = 1; });
  var cday = {}, classes = 0, teamWins = 0;
  (arPoints_.cls || []).forEach(function (r) { if (String(r[2]) !== sid) return; var t = r[0] instanceof Date ? r[0].getTime() : new Date(r[0]).getTime(), dk = Utilities.formatDate(new Date(t), 'America/New_York', 'yyyy-MM-dd');
    cday[dk] = (cday[dk] || 0) + 1; if (cday[dk] > CH.PER_DAY) return; var p = 1 + (r[7] === true || String(r[7]) === 'true' ? 2 : 0); pts += p; classes++; if (p > 1) teamWins++; if (t > weekAgo) wk += p; });
  return { pts: pts, wins: wins, played: played, taught: taught, week: wk, subj: subj, classes: classes, teamWins: teamWins, pars: Object.keys(pars) };
}
function arMyStats(token) {
  var s = arKid_(token), c = arC_(), k = 'arst|' + s.sid, hit = c.get(k); if (hit) { var o = JSON.parse(hit); o.on = arOn_(); return o; }
  arPoints_.cls = sgdRows_('AR_Class', 8); var out = arPoints_(s.sid, sgdRows_(AR.DUELS, AR.DH.length), sgdRows_(AR.TEACH, AR.TH.length)); out.on = arOn_();
  try { c.put(k, JSON.stringify(out), 600); } catch (e) {}
  return out;
}
/* staff: switch the Arena on/off; recent duels for the Parsha/Week card */
function arSet(token, on) {
  var s = sgStaff_(token), who = sgWho_(s);
  sgLock_(function () { sgdTab_(SGS.TAB, SGS.H).appendRow([new Date(), 'arena', JSON.stringify({ on: !!on, at: Date.now(), by: who.name || 'Staff' }), who.id || '', who.name || 'Staff']); });
  return arStaff_();
}
function arStaff_() {
  var rows = sgdRows_(AR.DUELS, AR.DH.length), teach = sgdRows_(AR.TEACH, AR.TH.length), since = Date.now() - 7 * 86400000;
  var recent = rows.filter(function (r) { var t = r[0] instanceof Date ? r[0].getTime() : new Date(r[0]).getTime(); return t > since && r[6]; }).slice(-12).reverse()
    .map(function (r) { return { at: r[0] instanceof Date ? r[0].getTime() : new Date(r[0]).getTime(), subject: r[2], topic: r[3], h: r[5], g: r[7], hs: r[8], gs: r[9], n: r[13], w: String(r[12]) === String(r[4]) ? r[5] : (String(r[12]) === String(r[6]) ? r[7] : '') }; });
  return { on: arOn_(), week: recent.length, recent: recent, taught: teach.filter(function (r) { var t = r[0] instanceof Date ? r[0].getTime() : new Date(r[0]).getTime(); return t > since; }).length };
}

/* ===== v214 CLASS CHIDON + SHEVATIM TEAMS (takeover3, HoS 2026-11-15: "go for it" — Arena Phase 2) =====
   The rebbe opens a class game from the staff page (StaffLive: Arena panel → "🏛️ Class Chidon") and shows it on the projector.
   Boys join on their Chromebooks with the code (ArenaPage: "Join the Class Chidon") and are spread evenly over 2-6 shevatim teams.
   The first boy to join builds the 10 questions from his lessons for the rebbe's topic (every page has the same lessons) and uploads
   them (chQs); the server keeps the answers. The rebbe starts; every question is shown on the projector and on every Chromebook at once;
   each right answer lays a stone in the team's colour on ONE shared Beis Hamikdash. The projector reveals the answer when time is up or
   everyone answered; the rebbe taps Next. At the end: the Beis Hamikdash built together + the winning shevet. No individual ranking is shown.
   ARENA POINTS (AR_Class sheet): every boy who answered +1, the winning team +2 more (at most 3 class games a day count). */
var CH = { TTL: 21600, TAB: 'AR_Class', H: ['at', 'code', 'sid', 'name', 'team', 'right', 'n', 'won'], QSEC: 25, PER_DAY: 3,
  TEAMS: [['Reuven', '#c0392b'], ['Shimon', '#16a085'], ['Levi', '#8e44ad'], ['Yehudah', '#2980b9'], ['Yissachar', '#d35400'], ['Zevulun', '#27ae60']] };
function chGet_(code) { var j = arC_().get('ch|' + code); return j ? JSON.parse(j) : null; }
function chPut_(g) { arC_().put('ch|' + g.code, JSON.stringify(g), CH.TTL); }
function chTally_(g) { var T = g.teams.map(function (t) { return { name: t[0], color: t[1], size: 0, right: 0, ans: 0 }; });
  Object.keys(g.players).forEach(function (sid) { var p = g.players[sid], t = T[p.team]; if (!t) return; t.size++; Object.keys(p.ans).forEach(function (i) { t.ans++; if (p.ans[i].ok) t.right++; }); });
  return T; }
function chView_(g, who) {   /* who: 'staff' or a sid */
  var v = { code: g.code, state: g.state, label: g.label, n: g.qs ? g.qs.length : 0, i: g.i, qStart: g.qStart || 0, qSec: CH.QSEC, now: Date.now(), teams: chTally_(g), count: Object.keys(g.players).length, ready: !!g.qs };
  if (g.qs && g.state !== 'lobby') { var q = g.qs[g.i]; v.q = q ? { q: q.q, o: q.o, pic: q.pic } : null; }
  if (g.state === 'reveal' || g.state === 'done') v.right = g.a[g.i];
  var answered = 0; Object.keys(g.players).forEach(function (sid) { if (g.players[sid].ans[g.i]) answered++; }); v.answered = answered;
  if (who === 'staff') v.names = g.teams.map(function (t, k) { return Object.keys(g.players).filter(function (sid) { return g.players[sid].team === k; }).map(function (sid) { return g.players[sid].name; }); });
  else { var p = g.players[who]; if (p) { v.me = { team: p.team, teamName: g.teams[p.team][0], color: g.teams[p.team][1], mine: p.ans[g.i] ? (g.state === 'q' ? { c: p.ans[g.i].c } : p.ans[g.i]) : null, right: Object.keys(p.ans).filter(function (i) { return p.ans[i].ok; }).length }; } }
  if (g.state === 'done') v.res = g.res;
  if (!g.qs && who !== 'staff') v.need = { topic: g.topic, subject: g.subject, label: g.label };
  return v;
}
function chOpen(token, opt) {
  var s = sgStaff_(token), who = sgWho_(s); opt = opt || {}; var nT = Math.max(2, Math.min(6, Math.round(Number(opt.teams) || 4)));
  return arLock_(function () { var code = ''; for (var t = 0; t < 30; t++) { code = String(1000 + Math.floor(Math.random() * 9000)); if (!chGet_(code) && !arGet_(code)) break; }
    var g = { code: code, at: Date.now(), by: who.name || 'Rebbe', topic: arStr_(opt.topic, 40), subject: arStr_(opt.subject, 20), label: arStr_(opt.label, 80), teams: CH.TEAMS.slice(0, nT), players: {}, qs: null, a: null, state: 'lobby', i: 0 };
    chPut_(g); return chView_(g, 'staff'); });
}
function chJoin(token, code) {
  var s = arKid_(token); if (!arOn_()) throw new Error('The Arena is closed right now. Ask your rebbe!'); code = String(code || '').replace(/\D/g, '');
  return arLock_(function () { var g = chGet_(code); if (!g) throw new Error('No Class Chidon has the code ' + code + '.');
    if (!g.players[s.sid]) { if (g.state === 'done') throw new Error('That Chidon is over.'); var cnt = g.teams.map(function () { return 0; }); Object.keys(g.players).forEach(function (k) { cnt[g.players[k].team]++; });
      var t = cnt.indexOf(Math.min.apply(null, cnt)); g.players[s.sid] = { name: arName_(s.sid), team: t, ans: {} }; chPut_(g); }
    return chView_(g, s.sid); });
}
function chQs(token, code, qs) {
  var s = arKid_(token);
  return arLock_(function () { var g = chGet_(String(code || '')); if (!g || !g.players[s.sid]) throw new Error('Join the Chidon first.'); if (g.qs) return chView_(g, s.sid);
    qs = Array.isArray(qs) ? qs.slice(0, 15) : []; if (qs.length < 5) return chView_(g, s.sid);
    var A = [], Q = []; qs.forEach(function (q) { var o = (Array.isArray(q.o) ? q.o : []).slice(0, 6).map(function (x) { return arStr_(x, 160); }), a = Math.round(Number(q.a)); if (o.length < 2 || !(a >= 0 && a < o.length)) return; A.push(a); Q.push({ q: arStr_(q.q, 300), o: o, pic: arStr_(q.pic, 120), id: arStr_(q.id, 40) }); });
    if (Q.length >= 5) { g.qs = Q; g.a = A; chPut_(g); } return chView_(g, s.sid); });
}
function chPoll(token, code) {
  var g = chGet_(String(code || '')); if (!g) throw new Error('This Chidon has ended.');
  var s = msSession_(token); var who = s && s.role === 'staff' ? 'staff' : (s && s.sid ? s.sid : null); if (!who) throw new Error('Please sign in again.');
  return chView_(g, who);
}
function chAnswer(token, code, i, choice) {
  var s = arKid_(token); i = Math.round(Number(i)); choice = Math.round(Number(choice));
  return arLock_(function () { var g = chGet_(String(code || '')); if (!g) throw new Error('This Chidon has ended.'); var p = g.players[s.sid]; if (!p) throw new Error('Join the Chidon first.');
    if (g.state === 'q' && i === g.i && !p.ans[i] && Date.now() - g.qStart <= (CH.QSEC + 2) * 1000) { p.ans[i] = { c: choice, ok: choice === g.a[i] }; chPut_(g); }
    return chView_(g, s.sid); });
}
/* the rebbe's buttons: start, reveal, next, end */
function chStep(token, code, act) {
  sgStaff_(token);
  return arLock_(function () { var g = chGet_(String(code || '')); if (!g) throw new Error('This Chidon has ended.');
    if (act === 'start' && g.state === 'lobby') { if (!g.qs) throw new Error('Waiting for the first student to join, so the questions can be made.'); g.state = 'q'; g.i = 0; g.qStart = Date.now(); }
    else if (act === 'reveal' && g.state === 'q') g.state = 'reveal';
    else if (act === 'next' && g.state === 'reveal') { if (g.i < g.qs.length - 1) { g.i++; g.state = 'q'; g.qStart = Date.now(); } else chFinish_(g); }
    else if (act === 'end' && g.state !== 'done') { if (g.qs && g.state !== 'lobby') chFinish_(g); else g.state = 'done'; }
    chPut_(g); return chView_(g, 'staff'); });
}
function chFinish_(g) {
  if (g.state === 'done' && g.res) return; var T = chTally_(g); var best = -1, win = -1, tie = false;
  T.forEach(function (t, k) { var sc = t.size ? t.right / t.size : 0; if (sc > best + 1e-9) { best = sc; win = k; tie = false; } else if (Math.abs(sc - best) < 1e-9) tie = true; });
  g.res = { winner: tie ? -1 : win, winnerName: tie ? '' : g.teams[win][0], stones: T.reduce(function (a, t) { return a + t.right; }, 0), teams: T };
  g.state = 'done';
  try { var sh = sgdTab_(CH.TAB, CH.H), rows = []; Object.keys(g.players).forEach(function (sid) { var p = g.players[sid], r = Object.keys(p.ans).filter(function (i) { return p.ans[i].ok; }).length, n = Object.keys(p.ans).length;
      if (n) rows.push([new Date(), g.code, sid, p.name, g.teams[p.team][0], r, n, !tie && p.team === win]); try { arC_().remove('arst|' + sid); } catch (e) {} });
    if (rows.length) sh.getRange(sh.getLastRow() + 1, 1, rows.length, CH.H.length).setValues(rows); } catch (e) {}
}

/* ===== v218 CHALLENGE A FRIEND (takeover3, Arena Phase 3; autonomous run for the HoS) =====
   A boy plays a 10-question challenge alone (arCfMake → answer each with arCfAns → arCfDone). His run is saved for 3 days (AR_Chal).
   Friends see it under "Open challenges" or type its code, and race his GHOST: his candles light at the moment he answered each one
   (arCfGet gives his per-question times, never his answers). The server checks every answer. Each friend's run is a duel row in AR_Duels,
   so it earns the normal Arena points with the same daily caps (12 a day, 4 with the same chavrusa). */
var CF = { TAB: 'AR_Chal', H: ['at', 'code', 'by_id', 'by_name', 'subject', 'label', 'qs', 'a', 'ms', 'score', 'status'], DAYS: 3 };
function cfRow_(code) { var sh = sgdTab_(CF.TAB, CF.H), n = sh.getLastRow(); if (n < 2) return null; var codes = sh.getRange(2, 2, n - 1, 1).getValues();
  for (var i = codes.length - 1; i >= 0; i--) if (String(codes[i][0]) === code) { var r = sh.getRange(i + 2, 1, 1, CF.H.length).getValues()[0]; return { row: i + 2, r: r, sh: sh }; } return null; }
function cfGet_(code) { var c = arC_(), hit = c.get('arc|' + code); if (hit) return JSON.parse(hit); var x = cfRow_(code); if (!x) return null;
  var r = x.r, o = { code: code, at: new Date(r[0]).getTime(), by: String(r[2]), byName: String(r[3]), subject: String(r[4]), label: String(r[5]), qs: JSON.parse(r[6] || '[]'), a: JSON.parse(r[7] || '[]'), ms: JSON.parse(r[8] || '[]'), score: Number(r[9]) || 0, status: String(r[10]) };
  try { c.put('arc|' + code, JSON.stringify(o), CH.TTL); } catch (e) {} return o; }
function arCfMake(token, pack) {
  var s = arKid_(token); if (!arOn_()) throw new Error('The Arena is closed right now. Ask your rebbe!');
  pack = pack || {}; var qs = Array.isArray(pack.qs) ? pack.qs.slice(0, 15) : []; if (qs.length < 5) throw new Error('This topic does not have enough questions yet. Pick another one!');
  var A = [], Q = qs.map(function (q) { var o = (Array.isArray(q.o) ? q.o : []).slice(0, 6).map(function (x) { return arStr_(x, 160); }), a = Math.round(Number(q.a)); if (o.length < 2 || !(a >= 0 && a < o.length)) throw new Error('A question was not ready. Try again.'); A.push(a); return { q: arStr_(q.q, 300), o: o, pic: arStr_(q.pic, 120), id: arStr_(q.id, 40) }; });
  return arLock_(function () { var code = ''; for (var t = 0; t < 40; t++) { code = String(10000 + Math.floor(Math.random() * 90000)); if (!cfRow_(code)) break; }
    var o = { code: code, at: Date.now(), by: s.sid, byName: arName_(s.sid), subject: arStr_(pack.subject, 20), label: arStr_(pack.label, 80), qs: Q, a: A, ms: [], score: 0, status: 'making', start: Date.now(), ans: [] };
    sgdTab_(CF.TAB, CF.H).appendRow([new Date(), code, s.sid, o.byName, o.subject, o.label, JSON.stringify(Q), JSON.stringify(A), '[]', 0, 'making']);
    arC_().put('arc|' + code, JSON.stringify(o), CH.TTL); arC_().put('arcp|' + code + '|' + s.sid, JSON.stringify({ start: Date.now(), ans: [] }), CH.TTL);
    return { code: code, qs: Q, label: o.label }; });
}
/* answer one question (maker or friend); the run is kept per boy in the cache */
function arCfAns(token, code, i, choice) {
  var s = arKid_(token); code = String(code || ''); i = Math.round(Number(i)); choice = Math.round(Number(choice));
  var o = cfGet_(code); if (!o) throw new Error('This challenge has ended.'); var k = 'arcp|' + code + '|' + s.sid, c = arC_();
  var run = JSON.parse(c.get(k) || 'null') || { start: Date.now(), ans: [] };
  if (!(i >= 0 && i < o.qs.length)) return { ok: false, right: null };
  if (!run.ans[i]) { run.ans[i] = { c: choice, ok: choice === o.a[i], ms: Date.now() - run.start }; c.put(k, JSON.stringify(run), CH.TTL); }
  return { ok: run.ans[i].ok, right: o.a[i] };
}
/* finish: the maker saves his run; a friend's run is compared and recorded as a duel */
function arCfDone(token, code) {
  var s = arKid_(token); code = String(code || '');
  return arLock_(function () { var o = cfGet_(code); if (!o) throw new Error('This challenge has ended.'); var run = JSON.parse(arC_().get('arcp|' + code + '|' + s.sid) || 'null'); if (!run) throw new Error('Your answers were not found. Try again.');
    var n = o.qs.length, sc = run.ans.filter(function (a) { return a && a.ok; }).length, ms = run.ans.map(function (a) { return a ? a.ms : null; }), last = Math.max.apply(null, ms.filter(function (x) { return x != null; }).concat([0]));
    if (s.sid === o.by) { if (o.status === 'making') { o.ms = ms; o.score = sc; o.status = 'open'; var x = cfRow_(code); if (x) x.sh.getRange(x.row, 9, 1, 3).setValues([[JSON.stringify(ms), sc, 'open']]); arC_().put('arc|' + code, JSON.stringify(o), CH.TTL); }
      return { code: code, maker: true, score: sc, n: n }; }
    var dk = 'arcd|' + code + '|' + s.sid; if (arC_().get(dk)) throw new Error('You already finished this challenge.'); arC_().put(dk, '1', CH.TTL);
    var hostLast = Math.max.apply(null, (o.ms || []).filter(function (x) { return x != null; }).concat([0])), w = '';
    if (sc !== o.score) w = sc > o.score ? s.sid : o.by; else if (Math.abs(last - hostLast) > 1500) w = last < hostLast ? s.sid : o.by;
    try { sgdTab_(AR.DUELS, AR.DH).appendRow([new Date(), 'C' + code, o.subject, o.label + ' (challenge)', o.by, o.byName, s.sid, arName_(s.sid), o.score, sc, hostLast, last, w, n]); arC_().remove('arst|' + s.sid); arC_().remove('arst|' + o.by); } catch (e) {}
    var review = o.qs.map(function (q, i) { return { q: q.q, pic: q.pic, o: q.o, a: o.a[i], me: run.ans[i] ? run.ans[i].c : null }; });
    return { code: code, maker: false, score: sc, theirs: o.score, byName: o.byName, n: n, winner: w === s.sid ? 'me' : (w ? 'them' : 'tie'), review: review };
  });
}
/* a friend opens a challenge: the questions and the maker's per-question times (for the ghost), never the answers */
function arCfGet(token, code) {
  var s = arKid_(token); code = String(code || '').replace(/\D/g, ''); var o = cfGet_(code);
  if (!o || o.status !== 'open') throw new Error('No open challenge has the code ' + code + '.');
  if (o.by === s.sid) throw new Error('That is your own challenge. Give the code to a friend!');
  if (Date.now() - o.at > CF.DAYS * 86400000) throw new Error('That challenge has ended (3 days).');
  var played = sgdRows_(AR.DUELS, AR.DH.length).some(function (r) { return String(r[1]) === 'C' + code && String(r[6]) === s.sid; });
  if (played) throw new Error('You already took this challenge.');
  arC_().put('arcp|' + code + '|' + s.sid, JSON.stringify({ start: Date.now(), ans: [] }), CH.TTL);
  return { code: code, byName: o.byName, label: o.label, subject: o.subject, qs: o.qs, ghost: o.ms, ghostScore: null, n: o.qs.length };
}
/* the Arena home: open challenges from others (last 3 days, not taken yet), and my own with how friends did */
function arCfList(token) {
  var s = arKid_(token), rows = sgdRows_(CF.TAB, CF.H.length), duels = sgdRows_(AR.DUELS, AR.DH.length), since = Date.now() - CF.DAYS * 86400000;
  var took = {}; duels.forEach(function (r) { if (String(r[1]).charAt(0) === 'C') { var k = String(r[1]).slice(1); (took[k] = took[k] || []).push({ id: String(r[6]), name: String(r[7]), sc: r[9], w: String(r[12]) }); } });
  var open = [], mine = [];
  rows.forEach(function (r) { var t = new Date(r[0]).getTime(), code = String(r[1]); if (t < since || String(r[10]) !== 'open') return;
    if (String(r[2]) === s.sid) mine.push({ code: code, label: String(r[5]), score: Number(r[9]) || 0, n: JSON.parse(r[7] || '[]').length, by: (took[code] || []).map(function (x) { return { name: x.name, sc: x.sc, beat: x.w === x.id }; }) });
    else if (!(took[code] || []).some(function (x) { return x.id === s.sid; })) open.push({ code: code, label: String(r[5]), byName: String(r[3]), subject: String(r[4]), at: t }); });
  return { open: open.slice(-10).reverse(), mine: mine.slice(-6).reverse() };
}
