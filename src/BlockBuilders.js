/* ===== BLOCK BUILDERS WORKBOOK (HoS 2026-11-22: "a mix of A and B, the full shebang").
   The Khaver family's "My Block Math Builders Workbook" (carrying and borrowing) as a living workbook in the app:
   the boy works on the workbook page itself (every answer box checks itself, a pen layer for the stylus), and a
   "Watch me" screen teaches each job's example step by step first. Pages are in BlockBuildersData.html, the player
   in BlockBuildersUI.html, the teacher board in BlockBuildersStaff.html.

   Storage: one tab, MS_BlockBuilders, one row per boy per page: his answers, his pen strokes, his score.
   Calls (API_ALLOW):
     bbMine(token)                      the signed-in boy: every page's score and answers (no pen strokes, so it is light)
     bbPage(token, pageId)              the signed-in boy: one page with his pen strokes
     bbSave(token, pageId, data)        the signed-in boy: saves one page (answers, strokes, score). Kid tokens only.
     bbClass(token)                     staff: every boy they may see, his pages done and scores (no strokes)
     bbBoyPage(token, sid, pageId)      staff: one boy's page with his pen strokes, to look at his work
   No money, no mastery and no evidence rows are written (those need a Head of School DECISION). */
var BB = { TAB: 'MS_BlockBuilders', HEAD: ['student_id', 'page_id', 'answers_json', 'ink_json', 'score', 'total', 'done', 'updated_at'], MAX_INK: 42000, MAX_ANS: 6000 };

function bbTab_() {
  var ss = msBook_(), sh = ss.getSheetByName(BB.TAB);
  if (!sh) { sh = ss.insertSheet(BB.TAB); sh.getRange(1, 1, 1, BB.HEAD.length).setValues([BB.HEAD]); }
  return sh;
}
function bbRows_() {
  var sh = bbTab_(), n = sh.getLastRow();
  if (n < 2) return [];
  return sh.getRange(2, 1, n - 1, BB.HEAD.length).getValues();
}
function bbKid_(token) {
  var s = msSession_(token);
  if (!s || s.role !== 'kid' || !s.sid) throw new Error('This is for students only.');
  return String(s.sid);
}
function bbOkId_(id) { id = String(id || ''); if (!/^[A-Z]{1,3}[0-9]{2}[AB]?$/.test(id)) throw new Error('Unknown page.'); return id; }
function bbJson_(t, d) { try { return JSON.parse(t || '') || d; } catch (e) { return d; } }
function bbSummary_(r) { return { a: bbJson_(r[2], {}), score: Number(r[4]) || 0, total: Number(r[5]) || 0, done: !!Number(r[6]), at: r[7] ? new Date(r[7]).getTime() : 0, ink: !!String(r[3] || '').length && String(r[3]) !== '[]' }; }

function bbMine(token) {
  var sid = bbKid_(token), pages = {};
  bbRows_().forEach(function (r) { if (String(r[0]) === sid) pages[String(r[1])] = bbSummary_(r); });
  return { ok: true, pages: pages };
}
function bbPage(token, pageId) {
  var sid = bbKid_(token); pageId = bbOkId_(pageId);
  var row = bbRows_().filter(function (r) { return String(r[0]) === sid && String(r[1]) === pageId; })[0];
  if (!row) return { ok: true, page: null };
  var p = bbSummary_(row); p.strokes = bbJson_(row[3], []); return { ok: true, page: p };
}
function bbSave(token, pageId, data) {
  var sid = bbKid_(token); pageId = bbOkId_(pageId); data = data || {};
  var ans = JSON.stringify(data.a && typeof data.a === 'object' ? data.a : {});
  if (ans.length > BB.MAX_ANS) throw new Error('Too much data.');
  var ink = JSON.stringify(Array.isArray(data.strokes) ? data.strokes : []);
  if (ink.length > BB.MAX_INK) ink = '[]';   /* a page full of scribbles: keep the answers, drop the drawing */
  var score = Math.max(0, Math.min(200, Math.round(Number(data.score) || 0))), total = Math.max(0, Math.min(200, Math.round(Number(data.total) || 0)));
  var line = [sid, pageId, ans, ink, score, total, data.done ? 1 : 0, new Date()];
  var lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    var sh = bbTab_(), n = sh.getLastRow(), at = -1;
    if (n >= 2) { var keys = sh.getRange(2, 1, n - 1, 2).getValues(); for (var i = 0; i < keys.length; i++) if (String(keys[i][0]) === sid && String(keys[i][1]) === pageId) { at = i; break; } }
    if (at >= 0) sh.getRange(at + 2, 1, 1, BB.HEAD.length).setValues([line]); else sh.appendRow(line);
  } finally { lock.releaseLock(); }
  return { ok: true };
}
function bbStaff_(token) { var s = msSession_(token); if (!s || s.role !== 'staff') throw new Error('Staff only.'); return s; }
function bbClass(token) {
  bbStaff_(token);
  var boys = msRoster_().filter(function (r) { return !msIsTest_(r.id); }), see = {}; boys.forEach(function (b) { see[b.id] = 1; });
  var by = {};
  bbRows_().forEach(function (r) { var sid = String(r[0]); if (!see[sid]) return; var s = bbSummary_(r); (by[sid] = by[sid] || {})[String(r[1])] = { score: s.score, total: s.total, done: s.done, at: s.at, ink: s.ink }; });
  return { ok: true, boys: boys.map(function (b) { return { id: b.id, name: b.name, pages: by[b.id] || {} }; }).filter(function (b) { return Object.keys(b.pages).length; }), all: boys.length };
}
function bbBoyPage(token, sid, pageId) {
  bbStaff_(token); tlGuard_(token, sid); sid = String(sid || ''); pageId = bbOkId_(pageId);
  var sess = msSession_(token); if (!msCanSee_(sess, sid)) throw new Error('Not allowed.');
  var row = bbRows_().filter(function (r) { return String(r[0]) === sid && String(r[1]) === pageId; })[0];
  if (!row) return { ok: true, page: null };
  var p = bbSummary_(row); p.strokes = bbJson_(row[3], []); return { ok: true, page: p };
}
