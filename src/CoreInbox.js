/* ===== CoreInbox.js: CORE GROWTH WRITING WORKSHOP + TEACHER WRITING INBOX, the server (job T, T-4, 2026-11-24). The boy's screens are src/CoreWrite.html.
   HoS rule (CORE-GROWTH-PROMPT.md section 5, Writing): "A writing piece is never marked right just for being typed." The boy plans, writes,
   fixes (a checklist he must meet) and sends his piece (src/CoreWrite.html). His teacher reads it in the staff portal's writing inbox
   (src/CoreWriteStaff.html), scores it with the task's simple rubric (1 to 4 on each row) and sends it back to fix with a note, or publishes it
   to the boy's "My book". Mastery of writing SKILLS still comes from the tap checks of the small skill lessons; the piece is the teacher's.

   Storage: one tab, CW_Pieces, one row per piece.
   Calls (API_ALLOW):
     cwSave(token, piece)                     the signed-in boy: saves a draft, or sends it (status 'draft' or 'sent'). Kid tokens only.
                                              He can change a piece only while it is a draft or was sent back to him ('returned').
     cwMine(token)                            the signed-in boy: his own pieces (text, status, his teacher's scores and note)
     cwInbox(token)                           staff: pieces from the boys they may see, newest first (sent ones first)
     cwScore(token, id, scores, note, action) staff: rubric scores (1-4 each) and a note; action 'return' (send back to fix) or 'publish' (My book)
   No money, no mastery and no evidence rows are written here (any of those needs a Head of School DECISION). */
var CW = { TAB: 'CW_Pieces', HEAD: ['piece_id', 'student_id', 'task_id', 'title', 'text', 'plan_json', 'checks_json', 'status', 'scores_json', 'note', 'pic', 'created_at', 'sent_at', 'scored_at', 'scored_by', 'rubric_json'],
  MAX_TEXT: 8000, MAX_PLAN: 4000, MAX_NOTE: 600, STATUS: ['draft', 'sent', 'returned', 'published'] };

function cwTab_() {
  var ss = msBook_(), sh = ss.getSheetByName(CW.TAB);
  if (!sh) { sh = ss.insertSheet(CW.TAB); sh.getRange(1, 1, 1, CW.HEAD.length).setValues([CW.HEAD]); }
  return sh;
}
function cwRows_() { var sh = cwTab_(), n = sh.getLastRow(); return n < 2 ? [] : sh.getRange(2, 1, n - 1, CW.HEAD.length).getValues(); }
function cwJson_(t, d) { try { return JSON.parse(t || '') || d; } catch (e) { return d; } }
function cwStr_(v, max) { return String(v == null ? '' : v).replace(/\r\n/g, '\n').slice(0, max); }
function cwTime_(v) { return v ? new Date(v).getTime() : 0; }
function cwKid_(token) { var s = msSession_(token); if (!s || s.role !== 'kid' || !s.sid) throw new Error('This is for students only.'); return String(s.sid); }
function cwStaff_(token) { var s = msSession_(token); if (!s || s.role !== 'staff') throw new Error('Staff only.'); return s; }
function cwOkTask_(id) { id = String(id || ''); if (!/^[A-Z][A-Z0-9]*(\.[A-Z0-9]+){1,3}$/.test(id)) throw new Error('Unknown writing task.'); return id; }
function cwPiece_(r, full) {
  var p = { id: String(r[0]), sid: String(r[1]), task: String(r[2]), title: String(r[3] || ''), status: String(r[7] || 'draft'), scores: cwJson_(r[8], []), note: String(r[9] || ''), pic: String(r[10] || ''),
    created: cwTime_(r[11]), sent: cwTime_(r[12]), scored: cwTime_(r[13]), rubric: cwJson_(r[15], []), words: (String(r[4] || '').match(/[A-Za-z0-9’']+/g) || []).length };
  if (full) { p.text = String(r[4] || ''); p.plan = cwJson_(r[5], {}); p.checks = cwJson_(r[6], []); }
  return p;
}

function cwSave(token, piece) {
  var sid = cwKid_(token); piece = piece || {};
  var task = cwOkTask_(piece.task), status = piece.status === 'sent' ? 'sent' : 'draft';
  var text = cwStr_(piece.text, CW.MAX_TEXT), title = cwStr_(piece.title, 80).replace(/\n/g, ' ').trim();
  var plan = JSON.stringify(piece.plan && typeof piece.plan === 'object' ? piece.plan : {}); if (plan.length > CW.MAX_PLAN) throw new Error('The plan is too long.');
  var checks = JSON.stringify(Array.isArray(piece.checks) ? piece.checks.slice(0, 12).map(function (c) { return { t: cwStr_(c && c.t, 120), ok: !!(c && c.ok) }; }) : []);
  var rubric = JSON.stringify(Array.isArray(piece.rubric) ? piece.rubric.slice(0, 6).map(function (x) { return cwStr_(x, 80); }) : []);
  var pic = cwStr_(piece.pic, 16);
  if (status === 'sent' && (text.match(/[A-Za-z]+/g) || []).length < 3) throw new Error('Write your piece before you send it.');
  var lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    var sh = cwTab_(), rows = cwRows_(), at = -1, id = String(piece.id || '');
    if (id) { for (var i = 0; i < rows.length; i++) if (String(rows[i][0]) === id) { at = i; break; }
      if (at < 0) throw new Error('That piece was not found.');
      if (String(rows[at][1]) !== sid) throw new Error('Not allowed.');
      var st = String(rows[at][7]); if (st === 'sent' || st === 'published') throw new Error(st === 'sent' ? 'Your teacher has this piece now.' : 'This piece is already in your book.'); }
    else id = 'CW-' + Utilities.getUuid().slice(0, 12);
    var old = at >= 0 ? rows[at] : null, now = new Date();
    var line = [id, sid, task, title, text, plan, checks, status, old ? old[8] : '', old ? old[9] : '', pic, old ? old[11] : now, status === 'sent' ? now : (old ? old[12] : ''), old ? old[13] : '', old ? old[14] : '', rubric];
    if (at >= 0) sh.getRange(at + 2, 1, 1, CW.HEAD.length).setValues([line]); else sh.appendRow(line);
    return { ok: true, id: id, status: status };
  } finally { lock.releaseLock(); }
}

function cwMine(token) {
  var sid = cwKid_(token);
  return { ok: true, pieces: cwRows_().filter(function (r) { return String(r[1]) === sid; }).map(function (r) { return cwPiece_(r, true); }).sort(function (a, b) { return (b.sent || b.created) - (a.sent || a.created); }) };
}

function cwInbox(token) {
  var sess = cwStaff_(token), names = {};
  msRoster_().forEach(function (r) { names[r.id] = r.name; });
  var order = { sent: 0, returned: 1, published: 2 };
  var out = cwRows_().filter(function (r) { var st = String(r[7]); return st !== 'draft' && names[String(r[1])] && msCanSee_(sess, String(r[1])); })
    .map(function (r) { var p = cwPiece_(r, true); p.name = names[p.sid]; return p; })
    .sort(function (a, b) { return (order[a.status] - order[b.status]) || (b.sent - a.sent); });
  return { ok: true, pieces: out.slice(0, 300), waiting: out.filter(function (p) { return p.status === 'sent'; }).length };
}

function cwScore(token, id, scores, note, action) {
  var sess = cwStaff_(token); id = String(id || '');
  if (action !== 'return' && action !== 'publish') throw new Error('Choose: send it back to fix, or publish it.');
  note = cwStr_(note, CW.MAX_NOTE).trim();
  var sc = (Array.isArray(scores) ? scores : []).slice(0, 6).map(function (v) { v = Math.round(Number(v)); return v >= 1 && v <= 4 ? v : 0; });
  if (action === 'return' && !note) throw new Error('Write a short note so he knows what to fix.');
  var lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    var sh = cwTab_(), rows = cwRows_(), at = -1;
    for (var i = 0; i < rows.length; i++) if (String(rows[i][0]) === id) { at = i; break; }
    if (at < 0) throw new Error('That piece was not found.');
    var sid = String(rows[at][1]); tlGuard_(token, sid); if (!msCanSee_(sess, sid)) throw new Error('Not allowed.');
    if (String(rows[at][7]) === 'draft') throw new Error('He has not sent this piece yet.');
    var who = (sess.who && (sess.who.name || sess.who.id)) || 'staff';
    var r = rows[at].slice(); r[7] = action === 'publish' ? 'published' : 'returned'; r[8] = JSON.stringify(sc); r[9] = note; r[13] = new Date(); r[14] = cwStr_(who, 60);
    sh.getRange(at + 2, 1, 1, CW.HEAD.length).setValues([r]);
    return { ok: true, id: id, status: r[7] };
  } finally { lock.releaseLock(); }
}
