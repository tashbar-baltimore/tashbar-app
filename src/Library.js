/* Library.js — the Tashbar Library and the One-Tap Command Center (server side of StaffLibrary.html).
   Claude Code builder (session for 4cc@), 2026-11-16. Design: Drive LOG "HANDOFF LIBRARY-OVERHAUL" (build brief).

   WHAT IT DOES
   1. libCatalog: ONE list of every lesson the app has, each with a shelf address (Wing > Subject > Strand > Level).
      It is built from the lists the app already keeps (Placement ladders, the staff catalog, the Kodesh lessons,
      Teacher mode, Simcha, Trades), so it never disagrees with them. Cached per pack stamp.
   2. libRoster: the boys this staff member may see (Access.js scope), with grade, classes/groups and placements.
   3. libApply: ONE call does an action for MANY boys: place / assign / block / pass, and their undo.
      It writes through the SAME tabs the app already reads (PL_Place, SG_Settings chmlv, SG_Picks, Teacher mode,
      KD_Marks), so the boy's app sees the change exactly as today. Every action is logged in LIB_History.

   RULES KEPT
   - No skill ID is renamed. Money is untouched (picks and marks never pay; nothing here writes money).
   - Every boy goes through tlGuard_ (scope) and the roster check; staff only.
   - Nothing here rebuilds the staff desk: answers are small, so the screen never reloads. */

var LIB = {
  VER: 'lib2',
  HIST: 'LIB_History', HIST_H: ['at', 'by_id', 'by_name', 'action', 'detail_json'],
  /* Wing, Subject, Strand name, placement key (PL.SUBJECTS key, 'CHM' = Chumash level 1-8, '' = none yet) */
  STRANDS: {
    'LK.KRI': ['Torah', 'Kriyah & Lashon Hakodesh', 'Kriyah', 'K:KRI'], 'LK.KES': ['Torah', 'Kriyah & Lashon Hakodesh', 'Krias Shema', ''],
    'HEB': ['Torah', 'Kriyah & Lashon Hakodesh', 'Lashon Hakodesh', 'HEB'], 'LK.LSH': ['Torah', 'Kriyah & Lashon Hakodesh', 'Lashon Hakodesh', 'HEB'],
    'LK.CHU': ['Torah', 'Chumash & Mefarshim', 'Chumash', 'K:CHU'], 'LK.RAS': ['Torah', 'Chumash & Mefarshim', 'Rashi', 'K:RAS'], 'LK.MFG': ['Torah', 'Chumash & Mefarshim', 'Mefarshim', ''],
    'LK.MSH': ['Torah', 'Mishnah & Gemara', 'Mishnayos', 'K:MSH'], 'LK.GEM': ['Torah', 'Mishnah & Gemara', 'Gemara', 'K:GEM'],
    'LK.HAL': ['Torah', 'Torah Life', 'Halacha', ''], 'LK.TEF': ['Torah', 'Torah Life', 'Tefillah', ''], 'LK.YT': ['Torah', 'Torah Life', 'Yomim Tovim', ''],
    'LK.MID': ['Torah', 'Torah Life', 'Middos', ''], 'LK.MIN': ['Torah', 'Torah Life', 'Brachos, Davening and Yom Tov', ''],
    'LK.PAR': ['Torah', 'Parsha, Navi & Toldos', 'Parsha', ''], 'LK.NAV': ['Torah', 'Parsha, Navi & Toldos', 'Navi', ''], 'LK.TOL': ['Torah', 'Parsha, Navi & Toldos', 'Toldos', ''], 'LK.CHEM': ['Torah', 'Torah Life', 'Chemdas: Yediyos Kelaliyos', ''],
    'MATH.NUM': ['Learning', 'Math', 'Number sense', 'MATH'], 'MATH.OPS': ['Learning', 'Math', 'Operations', 'MATH'], 'MATH.PV': ['Learning', 'Math', 'Place value', 'MATH'],
    'MATH.FRAC': ['Learning', 'Math', 'Fractions & decimals', 'MATH'], 'MATH.RAT': ['Learning', 'Math', 'Fractions & decimals', 'MATH'], 'MATH.MEAS': ['Learning', 'Math', 'Measurement', 'MATH'],
    'MATH.GEO': ['Learning', 'Math', 'Geometry', 'MATH'], 'MATH.STAT': ['Learning', 'Math', 'Data & statistics', 'MATH'], 'MATH.ALG': ['Learning', 'Math', 'Algebra', 'MATH'],
    'MATH.FUNC': ['Learning', 'Math', 'Functions', 'MATH'],
    'READ.PA': ['Learning', 'Reading', 'Phonemic awareness', 'READ'], 'READ.PHON': ['Learning', 'Reading', 'Phonics', 'READ'], 'READ.FLU': ['Learning', 'Reading', 'Fluency', 'READ'],
    'READ.VOC': ['Learning', 'Reading', 'Vocabulary', 'READ'], 'READ.COMP': ['Learning', 'Reading', 'Comprehension', 'READ'], 'READ.LIT': ['Learning', 'Reading', 'Literature', 'READ'],
    'READ.LV': ['Learning', 'Reading', 'Leveled books', 'READ'],
    'LANG.GRAM': ['Learning', 'Writing & Language', 'Grammar', 'LANG'], 'LANG.MECH': ['Learning', 'Writing & Language', 'Mechanics', 'LANG'], 'LANG.SENT': ['Learning', 'Writing & Language', 'Sentences', 'LANG'],
    'LANG.USE': ['Learning', 'Writing & Language', 'Usage', 'LANG'], 'WRIT.HAND': ['Learning', 'Writing & Language', 'Handwriting', 'LANG'], 'WRIT.SENT': ['Learning', 'Writing & Language', 'Sentences', 'LANG'],
    'WRIT.PARA': ['Learning', 'Writing & Language', 'Paragraphs', 'LANG'], 'WRIT.ESSAY': ['Learning', 'Writing & Language', 'Essays', 'LANG'], 'WRIT.RES': ['Learning', 'Writing & Language', 'Research', 'LANG'],
    'SCI.PHYS': ['Learning', 'Science', 'Physics', 'SCI'], 'SCI.MATT': ['Learning', 'Science', 'Matter & chemistry', 'SCI'], 'SCI.SKY': ['Learning', 'Science', 'Sky & space', 'SCI'],
    'SCI.LAND': ['Learning', 'Science', 'Earth & land', 'SCI'], 'SCI.EARTH': ['Learning', 'Science', 'Earth & land', 'SCI'], 'SCI.ANIM': ['Learning', 'Science', 'Animals', 'SCI'],
    'SCI.PLANT': ['Learning', 'Science', 'Plants', 'SCI'], 'SCI.LIFE': ['Learning', 'Science', 'Plants', 'SCI'], 'SCI.BODY': ['Learning', 'Science', 'Human body', 'SCI'],
    'SCI.INQ': ['Learning', 'Science', 'How scientists work', 'SCI'],
    'SS.COMM': ['Learning', 'Social Studies', 'Community', 'SOC'], 'SS.CIV': ['Learning', 'Social Studies', 'Civics', 'SOC'], 'SS.ECON': ['Learning', 'Social Studies', 'Economics', 'SOC'],
    'SS.GEO': ['Learning', 'Social Studies', 'Geography', 'SOC'], 'SS.HIST': ['Learning', 'Social Studies', 'History', 'SOC'], 'SS.JHIST': ['Learning', 'Social Studies', 'Jewish history', 'SOC'],
    'COMP.DIG': ['Skills', 'Computing', 'Digital life', 'COMP'], 'COMP.PROG': ['Skills', 'Computing', 'Programming', 'COMP'], 'COMP.TYPE': ['Skills', 'Computing', 'Typing', 'COMP'],
    'LIFE.FIN': ['Skills', 'Life & Money', 'Money & finance', 'COMP'], 'LIFE.BUD': ['Skills', 'Life & Money', 'Budgeting', 'COMP'],
    'ELEC': ['Skills', 'Studio', 'Studio', 'ELEC'], 'VOC': ['Skills', 'Trades', 'Trades', 'VOC'],
    'SIM': ['Heart', "B'Simcha", 'Simcha skills', ''], 'EMU': ['Heart', 'Emunah & Bitachon', 'Emunah & Bitachon', '']
  },
  BAND: { 'LK.HAL': 1, 'LK.TEF': 1, 'LK.YT': 1, 'LK.MID': 1, 'LK.PAR': 1, 'LK.NAV': 1, 'LK.CHEM': 1 },   /* TorahTracks: L01-L03 are grade bands K-2, 3-5, 6-8 */
  ALIAS: { 'MATH.FUN': 1 },   /* old codes that point at others: hidden */
  MAX_BOYS: 80, MAX_CARDS: 24,
  /* who may change a boy's LEVEL (place, mark passed, set grade). Decided 2026-11-16 (Library session for the Head of School):
     head, admin, rebbe, teacher (and the old practice staff code). Office and canteen may view and assign only. Boys: nothing. */
  LEVEL_ROLES: { head: 1, admin: 1, rebbe: 1, teacher: 1, '': 1 },
  PL: 'LIB_Playlists', PL_H: ['playlist_id', 'name', 'owner_id', 'owner_name', 'cards_json', 'updated_at', 'deleted'],
  STUCK_FAILS: 3, QUIET_DAYS: 5,
  KP: 'LIB_Place', KP_H: ['student_id', 'track', 'level', 'by_id', 'by_name', 'at', 'cleared'],   /* Kodesh track placement (read by the daily path) */
  TRACKS: { KRI: 'Kriyah', CHU: 'Chumash', RAS: 'Rashi', MSH: 'Mishnayos', GEM: 'Gemara' },
  DUE: 'LIB_Due', DUE_H: ['student_id', 'lesson_id', 'due', 'by_name', 'at'],   /* due date for an assigned lesson; newest row wins; '' clears */
  BOY_LIVE: true   /* the boy's "My Library": true = every boy (Head of School 2026-11-16: "turn it all on"). false = TEST- boys only. */
};

/* ---------- 1. the catalog ---------- */
function libStrandOf_(id) {
  var p = String(id).split('.'), two = p[0] + '.' + p[1];
  if (LIB.STRANDS[two]) return two;
  if (LIB.STRANDS[p[0]]) return p[0];
  return '';
}
function libLevelOf_(id) { var m = /\.L(\d\d)\./.exec(String(id)); return m ? Number(m[1]) : 0; }
function libClean_(s) { return String(s == null ? '' : s).replace(/\s+/g, ' ').trim().slice(0, 140); }

/* card = [code, title, kidTitle, strand, level, order, live(1/0), kind] ; kind: L lesson, K Kodesh, T track */
function libBuild_() {
  var cards = {}, order = 0;
  var unshelved = {};
  function add(id, title, kid, live, kind) {
    id = String(id || ''); if (!id || LIB.ALIAS[id.split('.').slice(0, 2).join('.')]) return;
    var sc = libStrandOf_(id); if (!sc) { unshelved[id] = 1; return; }
    var c = cards[id];
    if (!c) { c = cards[id] = [id, '', '', sc, libLevelOf_(id), ++order, 0, kind || 'L']; }
    if (title && !c[1]) c[1] = libClean_(title);
    if (kid && !c[2] && libClean_(kid) !== c[1]) c[2] = libClean_(kid);
    if (live) c[6] = 1;
  }
  var built = {}; try { plBuilt_().forEach(function (x) { built[x] = 1; }); } catch (e) {}
  /* a. the Blueprint ladders (teaching order) */
  ['MATH', 'READ', 'LANG', 'SCI', 'SOC'].forEach(function (k) { (plList_(k) || []).forEach(function (x) { add(x[0], x[2] || x[1], x[1], built[x[0]], 'L'); }); });
  try { if (typeof SCI_HS !== 'undefined') SCI_HS.forEach(function (x) { add(x[0], x[2] || x[1], x[1], built[x[0]], 'L'); }); } catch (e) {}
  /* b. the staff catalog (Computing, Electives, Life, Social Studies packs) */
  try { var sc = sgCatalog_().list; Object.keys(sc).forEach(function (k) { sc[k].forEach(function (x) { add(x[0], x[2] || x[1], x[1], x[3], 'L'); }); }); } catch (e) {}
  /* c. Teacher mode list (QuestPage + Math/Read/Science/Electives packs): these are playable */
  try { tmCatalog_().forEach(function (x) { add(x.id, '', x.name, 1, 'L'); }); } catch (e) {}
  /* d. Limudei Kodesh in teaching order (KodeshMore, KriyahMore, TorahTracks; HEB = Lashon Hakodesh) */
  try { var L = sgpKodeshLessons_(); (typeof SGP_TRACK_ORDER !== 'undefined' ? SGP_TRACK_ORDER : Object.keys(L.order)).forEach(function (k) { (L.order[k] || []).forEach(function (id) { add(id, L.names[id], '', 1, 'K'); }); }); } catch (e) {}
  /* e. Simcha and Trades files */
  ['SimchaMore', 'TradesMore', 'SparkPath'].forEach(function (f) {
    var t = ''; try { t = plFileText_(f) || HtmlService.createHtmlOutputFromFile(f).getContent(); } catch (e) { t = ''; }
    var re = /['"]((?:SIM|VOC)\.(?:[A-Z]+\.)?L\d\d\.\d\d)['"]\s*:\s*\{\s*["']?name["']?\s*:\s*(['"])((?:\\.|(?!\2)[^\\])*)\2/g, m;
    while ((m = re.exec(t))) add(m[1], '', m[3].replace(/\\(.)/g, '$1'), 1, 'L');
  });
  var list = Object.keys(cards).map(function (k) { var c = cards[k]; if (!c[1]) c[1] = c[2] || ''; return c; });
  list.sort(function (a, b) { return a[3] < b[3] ? -1 : a[3] > b[3] ? 1 : (a[4] - b[4]) || (a[5] - b[5]); });
  var strands = {}; Object.keys(LIB.STRANDS).forEach(function (k) { var s = LIB.STRANDS[k]; strands[k] = { wing: s[0], subj: s[1], name: s[2], place: s[3], band: LIB.BAND[k] ? 1 : 0 }; });
  return { unshelved: Object.keys(unshelved).sort().slice(0, 200), v: LIB.VER, stamp: (typeof TL_PACK_STAMP !== 'undefined' ? TL_PACK_STAMP : ''), at: new Date().toISOString(), strands: strands, cards: list,
    subjects: PL.SUBJECTS.map(function (s) { return [s[0], s[1], s[2], s[3]]; }) };
}
/* cached in pieces (CacheService holds 100 KB a key) */
function libCatalogData_() {
  var c = CacheService.getScriptCache(), key = 'lib:' + LIB.VER + ':' + (typeof TL_PACK_STAMP !== 'undefined' ? TL_PACK_STAMP : '0');
  try { var n = Number(c.get(key + ':n') || 0); if (n) { var parts = c.getAll(Array.apply(null, Array(n)).map(function (_, i) { return key + ':' + i; })), s = '';
    for (var i = 0; i < n; i++) { var p = parts[key + ':' + i]; if (p == null) { s = ''; break; } s += p; } if (s) return JSON.parse(s); } } catch (e) {}
  var d = libBuild_();
  try { var j = JSON.stringify(d), size = 90000, put = {}, k = 0; for (var o = 0; o < j.length; o += size) put[key + ':' + (k++)] = j.slice(o, o + size); put[key + ':n'] = String(k); c.putAll(put, 21600); } catch (e) {}
  return d;
}
function libCatalog(token) { sgStaff_(token); return libCatalogData_(); }

/* ---------- 2. the roster ---------- */
function libGradeOf_(note) { var m = /grade\s+(K|\d+)\b/i.exec(String(note || '')); return m ? (m[1].toUpperCase() === 'K' ? 0 : Number(m[1])) : null; }
function libRoster(token) {
  var s = sgStaff_(token), who = sgWho_(s);
  var rows = {}; msRows_('roster').forEach(function (r) { rows[String(r[0])] = r; });
  var boys = msRoster_().map(function (r) { var row = rows[r.id] || []; return { id: r.id, name: r.name, grade: libGradeOf_(row[8]), test: /^TEST-/.test(r.id) ? 1 : 0, place: {} }; });
  var ix = {}; boys.forEach(function (b) { ix[b.id] = b; });
  plRows_('place').forEach(function (r) { var b = ix[String(r[0])]; if (b && r[1]) b.place[String(r[1])] = { lv: Number(r[2]) || 0, start: String(r[3] || ''), by: String(r[5] || ''), at: r[4] ? new Date(r[4]).getTime() : 0 }; });
  var chm = {}; try { chm = sgsGet_('chmlv') || {}; } catch (e) {}
  Object.keys(chm).forEach(function (sid) { if (ix[sid]) ix[sid].place.CHM = { lv: Number(chm[sid]) || 0, by: 'staff' }; });
  var kp = libKpAll_(); Object.keys(kp).forEach(function (sid) { if (!ix[sid]) return; Object.keys(kp[sid]).forEach(function (k) { var x = kp[sid][k]; ix[sid].place['K:' + k] = { lv: x.level, by: 'staff', at: x.at, who: x.by }; }); });
  var groups = []; try { groups = sgGroups(token); } catch (e) {}
  var picks = {}; try { var P = sgdPicks_(); Object.keys(P).forEach(function (k) { var p = P[k]; if (ix[p.sid]) (picks[p.sid] = picks[p.sid] || []).push(p.id); }); } catch (e) {}
  var blocks = []; try { blocks = tmRead_().filter(function (x) { return x.until > Date.now(); }).map(function (x) { return { id: x.id, skill: x.skill, name: x.name, sids: x.sids.filter(function (id) { return !!ix[id]; }), until: x.until, by: x.by }; }).filter(function (x) { return x.sids.length; }); } catch (e) {}
  var dues = {}; try { var D = libDueAll_(); Object.keys(D).forEach(function (k) { var sid = k.split('|')[0]; if (ix[sid]) dues[k] = D[k]; }); } catch (e) {}
  return { me: { id: who.id, name: who.name, role: who.role, head: sgIsHead_(s) }, boys: boys, groups: groups, picks: picks, blocks: blocks, dues: dues };
}

/* ---------- 3. one action, many boys ---------- */
function libHistTab_() { return sgdTab_(LIB.HIST, LIB.HIST_H); }
function libLog_(who, action, detail) { libHistTab_().appendRow([new Date(), who.id || '', who.name || 'Staff', action, JSON.stringify(detail).slice(0, 45000)]); }
function libApply(token, req) {
  req = req || {}; var boys = (Array.isArray(req.boys) ? req.boys : []).map(String).filter(function (x, i, a) { return x && a.indexOf(x) === i; });
  if (!boys.length) throw new Error('Tick at least one boy.');
  if (boys.length > LIB.MAX_BOYS) throw new Error('That is too many boys at once (' + LIB.MAX_BOYS + ' at most).');
  tlGuard_(token, boys);
  var s = sgStaff_(token), who = sgWho_(s);
  var R = {}; msRoster_().forEach(function (r) { R[r.id] = r.name; });
  boys.forEach(function (b) { if (!R[b]) throw new Error('A ticked boy is not on your list. Reload and try again.'); });
  var act = String(req.action || ''), out = { ok: true, action: act, boys: boys, changed: {}, undo: null, msg: '' };
  if (/^(un)?(place|pass|grade)$/.test(act) && !LIB.LEVEL_ROLES[String(who.role || '')]) throw new Error('Only a rebbe, teacher, admin or the Head of School can change a level or a grade. You can assign lessons.');
  var cards = (Array.isArray(req.cards) ? req.cards : []).map(String).filter(function (x, i, a) { return x && a.indexOf(x) === i; }).slice(0, LIB.MAX_CARDS);
  var n = boys.length, plural = n === 1 ? ' boy' : ' boys';

  if (act === 'grade' || act === 'ungrade') {
    return sgLock_(function () {
      var sh = msTab_('roster'), last = sh.getLastRow(), ids = last < 2 ? [] : sh.getRange(2, 1, last - 1, 1).getValues(), notes = last < 2 ? [] : sh.getRange(2, 9, last - 1, 1).getValues(), before = {};
      var g = act === 'grade' ? Math.round(Number(req.grade)) : null; if (act === 'grade' && !(g >= 0 && g <= 12)) throw new Error('Pick a grade from K to 12.');
      boys.forEach(function (b) { for (var i = 0; i < ids.length; i++) if (String(ids[i][0]) === b) {
        var old = String(notes[i][0] || ''), nu;
        if (act === 'ungrade') nu = String((req.prev || {})[b] == null ? old : req.prev[b]);
        else { var tag = 'grade ' + (g === 0 ? 'K' : g); nu = /grade\s+(K|\d+)\b/i.test(old) ? old.replace(/grade\s+(K|\d+)\b/i, tag) : (old ? tag + ' · ' + old : tag); }
        before[b] = old; sh.getRange(i + 2, 9).setValue(nu); out.changed[b] = { grade: libGradeOf_(nu) }; break; } });
      libLog_(who, act, { grade: g, boys: boys, before: before });
      out.undo = act === 'grade' ? { action: 'ungrade', boys: boys, prev: before } : null;
      out.msg = act === 'grade' ? 'Set ' + n + plural + ' to ' + (g === 0 ? 'Kindergarten' : 'grade ' + g) + '.' : 'Put back the grade for ' + n + plural + '.';
      return out; });
  }
  if ((act === 'place' || act === 'unplace') && /^K:/.test(String(req.key || ''))) {
    var trk = String(req.key).slice(2); if (!LIB.TRACKS[trk]) throw new Error('That Kodesh track cannot be placed on yet.');
    var klv = Math.round(Number(req.level) || 0); if (act === 'place' && !(klv >= 1 && klv <= 13)) throw new Error('Pick a level from 1 to 13.');
    return sgLock_(function () {
      var cur = libKpAll_(), sh = libKpTab_(), now = new Date(), rows = [], before = {};
      boys.forEach(function (b) { var old = cur[b] && cur[b][trk]; before[b] = old ? { lv: old.level } : null;
        var lvNew = act === 'place' ? klv : ((req.prev || {})[b] && req.prev[b].lv) || 0;
        rows.push([b, trk, lvNew || '', who.id || '', who.name || 'Staff', now, !lvNew]); out.changed[b] = { key: 'K:' + trk, place: lvNew ? { lv: lvNew, by: 'staff', at: now.getTime() } : null }; });
      sh.getRange(sh.getLastRow() + 1, 1, rows.length, LIB.KP_H.length).setValues(rows);
      libLog_(who, act === 'place' ? 'place' : 'undo-place', { key: 'K:' + trk, level: klv, boys: boys, before: before });
      out.undo = act === 'place' ? { action: 'unplace', key: 'K:' + trk, boys: boys, prev: before } : null;
      out.msg = act === 'place' ? 'Placed ' + n + plural + ' at ' + LIB.TRACKS[trk] + ' Level ' + klv + '.' : 'Put back ' + n + plural + '.';
      return out; });
  }
  if (act === 'place' || act === 'unplace') {
    var key = String(req.key || ''), level = Math.round(Number(req.level) || 0), start = String(req.start || '');
    if (act === 'unplace') {   /* undo: put back exactly what was there */
      var prev = req.prev || {};
      return sgLock_(function () {
        boys.forEach(function (b) { var p = prev[b];
          if (key === 'CHM') { var cur = sgsGet_('chmlv') || {}; if (p && p.lv) cur[b] = p.lv; else delete cur[b]; sgdTab_(SGS.TAB, SGS.H).appendRow([new Date(), 'chmlv', JSON.stringify(cur), who.id || '', who.name || 'Staff']); }
          else if (p && p.lv) plUpsert_(b, key, p.lv, p.start || '', p.by || 'staff'); else plRemove_(b, key);
          out.changed[b] = { key: key, place: p && p.lv ? p : null }; });
        libLog_(who, 'undo-place', { key: key, boys: boys }); out.msg = 'Put back ' + n + plural + '.'; return out; });
    }
    if (key === 'CHM') { if (!(level >= 1 && level <= 8)) throw new Error('Chumash levels run from 1 to 8.'); }
    else { var subj = plSubject_(key); if (!subj) throw new Error('That shelf cannot be placed on yet.'); if (level < subj[2] || level > subj[3]) throw new Error(subj[1] + ' runs from Level ' + subj[2] + ' to Level ' + subj[3] + '.'); }
    return sgLock_(function () {
      var before = {}, prevRows = {}; plRows_('place').forEach(function (r) { prevRows[String(r[0]) + '|' + String(r[1])] = r; });
      if (key === 'CHM') {
        var cur = sgsGet_('chmlv') || {};
        boys.forEach(function (b) { before[b] = cur[b] ? { lv: cur[b] } : null; cur[b] = level; out.changed[b] = { key: 'CHM', place: { lv: level, by: 'staff' } }; });
        sgdTab_(SGS.TAB, SGS.H).appendRow([new Date(), 'chmlv', JSON.stringify(cur), who.id || '', who.name || 'Staff']);
      } else {
        boys.forEach(function (b) { var r = prevRows[b + '|' + key]; before[b] = r ? { lv: Number(r[2]) || 0, start: String(r[3] || ''), by: String(r[5] || '') } : null;
          plUpsert_(b, key, level, start, 'staff'); out.changed[b] = { key: key, place: { lv: level, start: start, by: 'staff', at: Date.now() } }; });
      }
      libLog_(who, 'place', { key: key, level: level, start: start, boys: boys, before: before });
      out.undo = { action: 'unplace', key: key, boys: boys, prev: before };
      out.msg = 'Placed ' + n + plural + ' at ' + (key === 'CHM' ? 'Chumash level ' : (plSubject_(key)[1] + ' Level ')) + level + '.';
      return out;
    });
  }

  if (act === 'assign' || act === 'unassign') {
    if (!cards.length) throw new Error('Choose a lesson first.');
    var names = {}; cards.forEach(function (id) { var nm = sgdLessonName_(id); if (!nm) throw new Error('One lesson is not in the app yet: ' + id + '.'); names[id] = nm; });
    var note = String(req.note || '').replace(/[\u0000-\u001F]/g, ' ').trim().slice(0, 160), undo = act === 'unassign';
    sgLock_(function () { var sh = sgdTab_(SGD.PICK, SGD.PICK_H), now = new Date(), rows = [];
      boys.forEach(function (b) { cards.forEach(function (id) { rows.push([now, b, id, names[id], who.id || '', who.name || 'Staff', note, undo]); }); });
      sh.getRange(sh.getLastRow() + 1, 1, rows.length, SGD.PICK_H.length).setValues(rows); });
    var due = String(req.due || ''); if (due && !/^\d{4}-\d{2}-\d{2}$/.test(due)) throw new Error('That due date is not a date.');
    if (due || undo) { var dsh = libDueTab_(), dnow = new Date(), drows = []; boys.forEach(function (b) { cards.forEach(function (id) { drows.push([b, id, undo ? '' : "'" + due, who.name || 'Staff', dnow]);   /* leading ' keeps it TEXT in Sheets, so the day can never shift */ }); }); dsh.getRange(dsh.getLastRow() + 1, 1, drows.length, LIB.DUE_H.length).setValues(drows); }
    boys.forEach(function (b) { out.changed[b] = { picks: undo ? { remove: cards } : { add: cards }, due: undo ? null : (due || null), cards: cards }; });
    libLog_(who, act, { cards: cards, boys: boys, note: note, due: due });
    out.undo = undo ? null : { action: 'unassign', boys: boys, cards: cards };
    out.msg = (undo ? 'Took back ' : 'Assigned ') + (cards.length === 1 ? '“' + names[cards[0]] + '”' : cards.length + ' lessons') + (undo ? ' from ' : ' to ') + n + plural + (due && !undo ? ', due ' + due : '') + '.';
    return out;
  }

  if (act === 'block') {
    if (cards.length !== 1) throw new Error('A class block uses one lesson. Choose one lesson card.');
    var list = tmStart(token, boys, cards[0], Number(req.minutes) || 40);
    var mine = (list || []).filter(function (x) { return x.skill === cards[0] && boys.every(function (b) { return x.sids.indexOf(b) >= 0; }); }).pop();
    libLog_(who, 'block', { card: cards[0], minutes: Number(req.minutes) || 40, boys: boys });
    boys.forEach(function (b) { out.changed[b] = { block: { skill: cards[0], until: mine ? mine.until : 0 } }; });
    out.undo = mine ? { action: 'unblock', boys: boys, id: mine.id } : null;
    out.msg = n + plural + ' locked to this lesson for ' + (Number(req.minutes) || 40) + ' minutes.';
    return out;
  }
  if (act === 'unblock') {
    var id = String(req.id || '');
    sgLock_(function () { tmWrite_(tmRead_().map(function (x) { if (x.id === id) x.sids = x.sids.filter(function (b) { return boys.indexOf(b) < 0; }); return x; }).filter(function (x) { return x.sids.length; })); });
    libLog_(who, 'unblock', { id: id, boys: boys }); boys.forEach(function (b) { out.changed[b] = { block: null }; });
    out.msg = 'Ended the class block for ' + n + plural + '.'; return out;
  }

  if (act === 'pass' || act === 'unpass') {
    if (!cards.length) throw new Error('Choose a lesson first.');
    var K = sgpKodeshLessons_(); cards.forEach(function (id) { if (!K.names[id]) throw new Error('Mark passed is for Limudei Kodesh lessons (a bechina). ' + id + ' is not one.'); });
    var un = act === 'unpass';
    sgLock_(function () { var sh = sgpMarkTab_(), now = new Date(), rows = [];
      boys.forEach(function (b) { cards.forEach(function (id) { rows.push([now, b, id, who.id || '', who.name || 'Staff', String(req.note || '').slice(0, 200), un]); }); });
      sh.getRange(sh.getLastRow() + 1, 1, rows.length, SGP_MARK_HEAD.length).setValues(rows); });
    libLog_(who, act, { cards: cards, boys: boys });
    boys.forEach(function (b) { out.changed[b] = { marks: un ? { remove: cards } : { add: cards } }; });
    out.undo = un ? null : { action: 'unpass', boys: boys, cards: cards };
    out.msg = (un ? 'Took back the mark for ' : 'Marked passed for ') + n + plural + '.';
    return out;
  }
  throw new Error('Unknown action.');
}

/* the last actions, for the History list */
function libHistory(token) {
  sgStaff_(token);
  var sh = libHistTab_(), last = sh.getLastRow(); if (last < 2) return [];
  var from = Math.max(2, last - 59), v = sh.getRange(from, 1, last - from + 1, LIB.HIST_H.length).getValues();
  return v.reverse().map(function (r) { var d = {}; try { d = JSON.parse(r[4]); } catch (e) {} return { at: new Date(r[0]).getTime(), by: String(r[2]), action: String(r[3]), n: (d.boys || []).length, key: d.key || '', level: d.level || 0, cards: d.cards || (d.card ? [d.card] : []) }; });
}


/* ---------- 4. Mastery Map + "Needs you" (read only) ---------- */
/* one pass over MS_State for the boys in scope: per subject how much of his current level he has mastered,
   lessons he is stuck on (3+ misses, not mastered), and when he last saved. */
function libMap(token) {
  sgStaff_(token);
  var ros = {}; msRoster_().forEach(function (r) { ros[r.id] = 1; });
  var place = {}; plRows_('place').forEach(function (r) { var sid = String(r[0]); if (ros[sid]) (place[sid] = place[sid] || {})[String(r[1])] = Number(r[2]) || 0; });
  var lists = {}; ['MATH', 'READ', 'LANG', 'SCI', 'SOC'].forEach(function (k) { var by = {}; (plList_(k) || []).forEach(function (x) { var l = libLevelOf_(x[0]); (by[l] = by[l] || []).push(x[0]); }); lists[k] = by; });
  var names = {}; try { libCatalogData_().cards.forEach(function (c) { names[c[0]] = c[2] || c[1]; }); } catch (e) {}
  var now = Date.now(), out = {}, dues = {}, today = Utilities.formatDate(new Date(), 'America/New_York', 'yyyy-MM-dd'), P = {};
  try { dues = libDueAll_(); P = sgdPicks_(); } catch (e) {}
  msRows_('state').forEach(function (r) {
    var sid = String(r[0]); if (!ros[sid]) return;
    var st = {}; try { st = JSON.parse(r[1]) || {}; } catch (e) { st = {}; }
    var sk = st.skills || {}, fails = st.fails || {}, row = { last: r[2] ? new Date(r[2]).getTime() : 0, prog: {}, stuck: [], mastered: 0, month: {}, recent: [] };
    var m30 = now - 30 * 864e5;
    Object.keys(sk).forEach(function (id) { if (!(sk[id] && sk[id].m)) return; row.mastered++;
      var at = Number(sk[id].at) || 0; if (at >= m30) { var sc = libStrandOf_(id), subj = sc && LIB.STRANDS[sc] ? LIB.STRANDS[sc][1] : 'Other'; row.month[subj] = (row.month[subj] || 0) + 1; row.recent.push([at, names[id] || id]); } });
    row.recent.sort(function (a, b) { return b[0] - a[0]; }); row.recent = row.recent.slice(0, 8).map(function (x) { return x[1]; });
    Object.keys(lists).forEach(function (k) { var lv = (place[sid] || {})[k]; if (!lv || !lists[k][lv]) return; var ids = lists[k][lv], done = ids.filter(function (id) { return sk[id] && sk[id].m; }).length; row.prog[k] = [done, ids.length]; });
    Object.keys(fails).forEach(function (id) { var f = Number(fails[id]) || 0; if (f >= LIB.STUCK_FAILS && !(sk[id] && sk[id].m)) row.stuck.push([id, f, names[id] || id]); });
    row.stuck.sort(function (a, b) { return b[1] - a[1]; }); row.stuck = row.stuck.slice(0, 4);
    row.overdue = []; Object.keys(dues).forEach(function (k) { var p = k.split('|'); if (p[0] !== sid || dues[k] >= today || !P[k] || (sk[p[1]] && sk[p[1]].m)) return; row.overdue.push([p[1], dues[k], names[p[1]] || P[k].name]); });
    out[sid] = row;
  });
  Object.keys(ros).forEach(function (sid) { if (!out[sid]) out[sid] = { last: 0, prog: {}, stuck: [], mastered: 0, month: {}, recent: [], overdue: [] }; });
  return { at: now, quietDays: LIB.QUIET_DAYS, boys: out };
}

/* ---------- 5. Playlists: a named set of lessons, saved once, assigned again in one tap ---------- */
function libPlTab_() { return sgdTab_(LIB.PL, LIB.PL_H); }
function libPlRead_() {
  var sh = libPlTab_(), n = sh.getLastRow(); if (n < 2) return [];
  var last = {}; sh.getRange(2, 1, n - 1, LIB.PL_H.length).getValues().forEach(function (r) { if (r[0]) last[String(r[0])] = r; });   /* newest row per playlist wins */
  return Object.keys(last).map(function (k) { var r = last[k], cards = []; try { cards = JSON.parse(r[4] || '[]'); } catch (e) {} return { id: k, name: String(r[1]), ownerId: String(r[2]), owner: String(r[3]), cards: cards, at: r[5] ? new Date(r[5]).getTime() : 0, deleted: r[6] === true || String(r[6]).toUpperCase() === 'TRUE' }; })
    .filter(function (p) { return !p.deleted; }).sort(function (a, b) { return b.at - a.at; });
}
function libPlaylists(token) { sgStaff_(token); return libPlRead_(); }
function libSavePlaylist(token, pl) {
  var s = sgStaff_(token), who = sgWho_(s); pl = pl || {};
  var name = String(pl.name || '').replace(/[\u0000-\u001F]/g, ' ').trim().slice(0, 60); if (!name) throw new Error('Give the playlist a name.');
  var cards = (Array.isArray(pl.cards) ? pl.cards : []).map(String).filter(function (x, i, a) { return x && a.indexOf(x) === i; }).slice(0, LIB.MAX_CARDS);
  if (!cards.length) throw new Error('Choose at least one lesson for the playlist.');
  var id = String(pl.id || ''), old = id ? libPlRead_().filter(function (p) { return p.id === id; })[0] : null;
  if (old && old.ownerId !== String(who.id || '') && !sgIsHead_(s)) throw new Error('Only the person who made this playlist can change it.');
  if (!id) id = 'PL-' + Utilities.getUuid().slice(0, 8);
  sgLock_(function () { libPlTab_().appendRow([id, name, old ? old.ownerId : (who.id || ''), old ? old.owner : (who.name || 'Staff'), JSON.stringify(cards), new Date(), false]); });
  libLog_(who, 'playlist', { id: id, name: name, cards: cards, boys: [] });
  return libPlRead_();
}
function libDeletePlaylist(token, id) {
  var s = sgStaff_(token), who = sgWho_(s); id = String(id || '');
  var old = libPlRead_().filter(function (p) { return p.id === id; })[0]; if (!old) return libPlRead_();
  if (old.ownerId !== String(who.id || '') && !sgIsHead_(s)) throw new Error('Only the person who made this playlist can delete it.');
  sgLock_(function () { libPlTab_().appendRow([id, old.name, old.ownerId, old.owner, JSON.stringify(old.cards), new Date(), true]); });
  libLog_(who, 'playlist-delete', { id: id, name: old.name, boys: [] });
  return libPlRead_();
}


/* ---------- 6. Kodesh track placement (LIB_Place; append-only, newest row per boy + track wins) ---------- */
function libKpTab_() { return sgdTab_(LIB.KP, LIB.KP_H); }
function libKpAll_() {
  var ss = msBook_(), sh = ss.getSheetByName(LIB.KP); if (!sh) return {};
  var n = sh.getLastRow(); if (n < 2) return {};
  var out = {}; sh.getRange(2, 1, n - 1, LIB.KP_H.length).getValues().forEach(function (r) { var sid = String(r[0] || ''), k = String(r[1] || ''); if (!sid || !k) return;
    var o = out[sid] = out[sid] || {}; if (r[6] === true || String(r[6]).toUpperCase() === 'TRUE' || !Number(r[2])) delete o[k]; else o[k] = { level: Number(r[2]), by: String(r[4] || 'Staff'), at: r[5] ? new Date(r[5]).getTime() : 0 }; });
  return out;
}
/* for the daily path (PathfinderDaily.js, takeover-3cc): a staff placement for this boy's Kodesh tracks, {KRI:{level,by,at}, ...} */
function libKodeshPlace_(sid) { return libKpAll_()[String(sid)] || {}; }

/* ---------- 7. Parents assign practice to their own children (Head of School 2026-11-16: anyone but the child may assign) ---------- */
function libParentKid_(token, sid) { var p = ppKid_(token, sid); return p; }
function libParentCatalog(token, sid) {
  sid = String(sid || ''); var p = libParentKid_(token, sid);
  var st = {}; msRows_('state').some(function (r) { if (String(r[0]) === sid) { try { st = JSON.parse(r[1]) || {}; } catch (e) {} return true; } return false; });
  var sk = st.skills || {}, done = function (id) { return !!(sk[id] && sk[id].m); };
  var place = (plPlacements_() || {})[sid] || {}, row = msRows_('roster').filter(function (r) { return String(r[0]) === sid; })[0] || [], grade = libGradeOf_(row[8]);
  var cat = libCatalogData_(), playable = {}; try { sgdCatalog_().forEach(function (x) { playable[x[0]] = 1; }); } catch (e) {}
  var by = {}; cat.cards.forEach(function (c) { if (playable[c[0]]) (by[c[3]] = by[c[3]] || []).push(c); });
  var groups = [];
  [['MATH', 'Math', ['MATH.']], ['READ', 'Reading', ['READ.']], ['LANG', 'Writing', ['WRIT.', 'LANG.']], ['SCI', 'Science', ['SCI.']], ['SOC', 'Social Studies', ['SS.']]].forEach(function (g) {
    var lv = (place[g[0]] && place[g[0]].level) || (grade != null ? grade + 1 : 0); if (!lv) return;
    var list = []; Object.keys(by).forEach(function (s) { if (g[2].some(function (pre) { return s.indexOf(pre) === 0; })) by[s].forEach(function (c) { if ((c[4] === lv || c[4] === lv + 1) && !done(c[0])) list.push(c); }); });
    list.sort(function (a, b) { return a[4] - b[4] || a[5] - b[5]; });
    if (list.length) groups.push({ key: g[0], name: g[1], level: lv, cards: list.slice(0, 16).map(function (c) { return [c[0], c[2] || c[1], c[1]]; }) });
  });
  try { var K = sgpKodeshLessons_(), names = { KRI: 'Kriyah', CHU: 'Chumash', RAS: 'Rashi', MSH: 'Mishnayos', GEM: 'Gemara', LSH: 'Lashon Hakodesh', PAR: 'Parsha', HAL: 'Halacha', TEF: 'Tefillah', YT: 'Yomim Tovim', MID: 'Middos', NAV: 'Navi' };
    Object.keys(names).forEach(function (k) { var ids = (K.order[k] || []).filter(function (id) { return !done(id); }).slice(0, 6); if (ids.length) groups.push({ key: 'LK.' + k, name: names[k], level: 0, cards: ids.map(function (id) { return [id, K.names[id] || id, '']; }) }); }); } catch (e) {}
  return { kid: sid, groups: groups, mine: libParentPicks_(p, sid) };
}
function libParentPicks_(p, sid) { var me = 'P-' + p.id, out = []; try { var P = sgdPicks_(); Object.keys(P).forEach(function (k) { var x = P[k]; if (x.sid === sid && x.byId === me) out.push({ id: x.id, name: x.name, at: x.at }); }); } catch (e) {} return out; }
function libParentAssign(token, sid, cards, undo) {
  sid = String(sid || ''); var p = libParentKid_(token, sid);
  cards = (Array.isArray(cards) ? cards : [cards]).map(String).filter(function (x, i, a) { return x && a.indexOf(x) === i; }).slice(0, 12);
  if (!cards.length) throw new Error('Choose a lesson first.');
  var names = {}; cards.forEach(function (id) { var nm = sgdLessonName_(id); if (!nm) throw new Error('That lesson is not in the app yet.'); names[id] = nm; });
  var label = String(p.title || p.name || 'Parent').slice(0, 40);
  sgLock_(function () { var sh = sgdTab_(SGD.PICK, SGD.PICK_H), now = new Date(); sh.getRange(sh.getLastRow() + 1, 1, cards.length, SGD.PICK_H.length).setValues(cards.map(function (id) { return [now, sid, id, names[id], 'P-' + p.id, label, 'Practice at home', !!undo]; })); });
  libLog_({ id: 'P-' + p.id, name: label }, undo ? 'parent-unassign' : 'parent-assign', { cards: cards, boys: [sid] });
  return { ok: true, msg: (undo ? 'Took back ' : 'Assigned ') + (cards.length === 1 ? '“' + names[cards[0]] + '”' : cards.length + ' lessons') + '.', mine: libParentPicks_(p, sid) };
}


/* ---------- 8. due dates (LIB_Due; newest row per boy + lesson wins; '' = no due date) ---------- */
function libDueTab_() { return sgdTab_(LIB.DUE, LIB.DUE_H); }
function libDueAll_() {
  var sh = msBook_().getSheetByName(LIB.DUE); if (!sh) return {};
  var n = sh.getLastRow(); if (n < 2) return {};
  var out = {}; sh.getRange(2, 1, n - 1, LIB.DUE_H.length).getValues().forEach(function (r) { var k = String(r[0] || '') + '|' + String(r[1] || ''); if (!r[0] || !r[1]) return;
    var d = r[2] instanceof Date ? Utilities.formatDate(r[2], Session.getScriptTimeZone(), 'yyyy-MM-dd') : String(r[2] || '').replace(/^'/, ''); if (d) out[k] = d; else delete out[k]; });
  return out;
}

/* ---------- 9. the boy's own Library ("My Library" on his home screen; BoyLibrary.html) ----------
   He never sees a level number (PF-TWO1 4.6): shelves are "Done", "Now" and "Next". Only lessons the app can play.
   BOY_LIVE false: TEST- boys only. Read only: nothing here writes, pays or changes mastery. */
/* PF-TWO1 4.6: a boy never sees a level number. "Chumash Level 3: Tell the Perek" / "Chumash 6: Who Said to Whom" -> the part after
   the colon (his shelf already names the subject); any other "Level 3" or "4-7" step code is dropped (as pfdBoyName_ does). */
function libBoyName_(n) {
  n = String(n == null ? '' : n); var m = /^([^:]*\d[^:]*):\s*(.+)$/.exec(n); if (m) n = m[2];
  return n.replace(/\s*\bLevel\s*\d+\b/gi, '').replace(/\s*\b\d+-\d+\b/g, '').replace(/\s+:/g, ':').replace(/^\s*:\s*/, '').trim() || 'Lesson';
}
function libMyLibrary(token) {
  var s = msSession_(token); if (!s || s.role !== 'kid' || !s.sid) throw new Error('Please sign in again.');
  var sid = String(s.sid); if (!LIB.BOY_LIVE && !/^TEST-/.test(sid)) return { off: true };
  var row = msRows_('roster').filter(function (r) { return String(r[0]) === sid; })[0] || [], grade = libGradeOf_(row[8]);
  var place = (plPlacements_() || {})[sid] || {}, kp = libKodeshPlace_(sid);
  var cat = libCatalogData_(), playable = {}; try { sgdCatalog_().forEach(function (x) { playable[x[0]] = 1; }); } catch (e) {}
  var by = {}; cat.cards.forEach(function (c) { if (playable[c[0]]) (by[c[3]] = by[c[3]] || []).push(c); });
  var shelves = [];
  [['MATH', 'Math', '📐', ['MATH.']], ['READ', 'Reading', '📖', ['READ.']], ['LANG', 'Writing', '✏️', ['WRIT.', 'LANG.']], ['SCI', 'Science', '🔬', ['SCI.']], ['SOC', 'Social Studies', '🌍', ['SS.']]].forEach(function (g) {
    var lv = (place[g[0]] && place[g[0]].level) || (grade != null ? grade + 1 : 0); if (!lv) return;
    var list = []; Object.keys(by).forEach(function (sc) { if (g[3].some(function (pre) { return sc.indexOf(pre) === 0; })) by[sc].forEach(function (c) { if (c[4] >= lv - 1 && c[4] <= lv + 1) list.push(c); }); });
    list.sort(function (a, b) { return a[4] - b[4] || a[5] - b[5]; });
    if (list.length) shelves.push({ name: g[1], icon: g[2], books: list.slice(0, 48).map(function (c) { return [c[0], libBoyName_(c[2] || c[1]), c[4] < lv ? 'before' : c[4] === lv ? 'now' : 'next']; }) });
  });
  try { var K = sgpKodeshLessons_(), names = { KRI: ['Kriyah', '🔤'], CHU: ['Chumash', '📜'], RAS: ['Rashi', '✒️'], MSH: ['Mishnayos', '📚'], GEM: ['Gemara', '🏛️'], LSH: ['Lashon Hakodesh', '📝'], PAR: ['Parsha', '🕯️'], HAL: ['Halacha', '⚖️'], TEF: ['Tefillah', '🙏'], YT: ['Yomim Tovim', '🍎'], MID: ['Middos', '💛'], NAV: ['Navi', '👑'] };
    Object.keys(names).forEach(function (k) { var ids = (K.order[k] || []).filter(function (id) { return playable[id] || K.names[id]; }); if (!ids.length) return;
      var lv = kp[k] ? kp[k].level : 0, sel = lv ? ids.filter(function (id) { var l = libLevelOf_(id); return l >= lv - 1 && l <= lv + 1; }) : ids;
      if (!sel.length) sel = ids; shelves.push({ name: names[k][0], icon: names[k][1], kodesh: 1, books: sel.slice(0, 48).map(function (id) { var l = libLevelOf_(id); return [id, libBoyName_(K.names[id] || id), lv ? (l < lv ? 'before' : l === lv ? 'now' : 'next') : 'track']; }) }); }); } catch (e) {}
  var picks = [], dues = libDueAll_(); try { var P = sgdPicks_(); Object.keys(P).forEach(function (k) { var p = P[k]; if (p.sid === sid) picks.push([p.id, libBoyName_(p.name), p.by, dues[k] || '']); }); } catch (e) {}
  return { on: true, shelves: shelves, picks: picks };
}
