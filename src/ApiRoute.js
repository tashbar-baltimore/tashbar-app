/* ApiRoute (Claude Code builder, 2026-11-16, Head of School: "let's do Firebase").
   Lets the student page, when it is served from the fast file host (tashbar-learning-live.web.app), call the SAME
   server functions it calls today through google.script.run, as a POST to the /exec link.
   Not a new door: google.script.run can already call any top-level function whose name does not end in "_".
   This route is narrower: only the names in API_ALLOW (what the student page really calls). Every function keeps
   its own checks (sign-in token, tries limit, the server sets every money amount). */
var API_ALLOW = ["acAdminLoad", "acMoveStudents", "acMyScope", "acParentNewCode", "acSaveParent", "acSaveSchool", "acSaveStaffScope", "apiExport", "apiKidPage", "apiStaffPage", "arAnswer", "arCfAns", "arCfDone", "arCfGet", "arCfList", "arCfMake", "arJoin", "arMyStats", "arOpen", "arPoll", "arSet", "arTeach", "chAnswer", "chJoin", "chOpen", "chPoll", "chQs", "chStep", "chmParsha", "cnKidInfo", "cnOrderCancel", "cnOrderMenu", "cnOrderPlace", "crCatalog", "crClasses", "crDeleteClass", "crDeleteLesson", "crEndClass", "crInbox", "crLessons", "crMarkRead", "crRunning", "crSaveClass", "crSaveLesson", "crSend", "crStaffAdmin", "crStaffList", "crStaffSave", "crStartClass", "crUnread", "kpAck", "kpMine", "msAppUrl", "msBootstrap", "msLoad", "msMusicInfo", "msMusicPart", "msPhotoNotes", "msPhotoSubmit", "msQuestTools", "msQuestToolsGet", "msQuestToolsParts", "msReport", "msSave", "msSchoolGoal", "msSignInCode", "msSignInFast", "pfConfirmSave", "pfConfirmStart", "pfHello", "sbAddKids", "sbCreate", "sbLoad", "sbMove", "sbMySchool", "sbNewCode", "sbStyle", "sgAddStudent", "sgArchive", "sgAwardPrizes", "sgBechinaReady", "sgBoyDay", "sgChmSetLevel", "sgClassSky", "sgDesk", "sgFamily", "sgFamilyBulk", "sgFamilySet", "sgFixPoints", "sgFreeCode", "sgGive", "sgGroups", "sgKodesh", "sgKodeshBoy", "sgKodeshGrid", "sgKodeshMark", "sgLevel", "sgLevelBechina", "sgLevels", "sgLoad", "sgMoney", "sgMusicSet", "sgMyDesk", "sgNote", "sgNoteDelete", "sgNoteMany", "sgNotes", "sgNow", "sgParshaInfo", "sgPick", "sgPickCatalog", "sgReportDone", "sgReports", "sgSetCode", "sgSetParsha", "sgShoutSeen", "sgSince", "sgTeachTogether", "sgToday", "sgUndoFix", "sgWeek", "sgWeekNotes", "soundGet", "soundSave", "stBuy", "stInfo", "stStaffOrders", "stStaffSet", "tmCatalog", "tmEnd", "tmExtend", "tmList", "tmMine", "tmStart"];
function doPost(e) {
  var out = function (o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); };
  try {
    var req = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (!req || req.api !== 1) return out({ ok: false, error: 'Not an app request.' });
    var fn = String(req.fn || ''), g = (function () { return this; })() || globalThis;
    if (!/^[a-z][A-Za-z0-9]*$/.test(fn) || API_ALLOW.indexOf(fn) < 0 || typeof g[fn] !== 'function') return out({ ok: false, error: 'Not allowed.' });
    var res = g[fn].apply(null, Array.isArray(req.args) ? req.args.slice(0, 8) : []);
    return out({ ok: true, result: res === undefined ? null : res });
  } catch (err) { return out({ ok: false, error: String((err && err.message) || err).slice(0, 300) }); }
}

/* The student page as the server builds it today, with its md5. The Firebase-hosted page asks after each open:
   "is my page still current?" and keeps a newer one for the next open. Code only: no student data is in this page. */
function apiKidPage(have) {
  var html = sgQuest_().getContent();
  var h = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, html, Utilities.Charset.UTF_8).map(function (b) { return ('0' + (b & 255).toString(16)).slice(-2); }).join('');
  return String(have || '') === h ? { h: h, same: true } : { h: h, html: html };
}

/* The staff portal page as the server builds it today, with its md5 (same idea as apiKidPage). Code only.
   Every staff function still demands a staff sign-in token. */
function apiStaffPage(have) {
  var html = sgPage_().getContent();
  var h = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, html, Utilities.Charset.UTF_8).map(function (b) { return ('0' + (b & 255).toString(16)).slice(-2); }).join('');
  return String(have || '') === h ? { h: h, same: true } : { h: h, html: html };
}

/* PROTECTED EXPORT for the move to Firebase (Head of School, 2026-11-16: "go ahead with all"). READ ONLY.
   Hands the school's records to the Firebase server, one block of rows at a time. It answers only to a caller who
   knows the long secret key; this file holds only the key's SHA-256 fingerprint, never the key. Five wrong keys
   lock it for 10 minutes. To be removed when the move is finished.
     apiExport(key, 'tabs', book)                 -> the tabs of a book ('main' or 'canteen') with their sizes
     apiExport(key, 'rows', book, tab, [from, n]) -> up to 4000 rows, dates marked {$d: milliseconds}, with an md5 of the block
     apiExport(key, 'props')                      -> the script's stored settings */
var API_EXPORT_HASH = '594fdccf352810cfc28b62f5cae14034270893cd03e3527db1dcf13797ba0ae0';
function apiExport(key, what, book, tab, span) {
  var cache = CacheService.getScriptCache(), bad = Number(cache.get('api_export_bad') || 0);
  if (bad >= 5) throw new Error('Not allowed.');
  var hex = function (bytes) { return bytes.map(function (b) { return ('0' + (b & 255).toString(16)).slice(-2); }).join(''); };
  if (hex(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(key || ''), Utilities.Charset.UTF_8)) !== API_EXPORT_HASH) { cache.put('api_export_bad', String(bad + 1), 600); throw new Error('Not allowed.'); }
  if (what === 'props') return PropertiesService.getScriptProperties().getProperties();
  var id = book === 'canteen' ? cnBookId_() : TL.sheet, ss = SpreadsheetApp.openById(id);
  if (what === 'tabs') return { id: id, tabs: ss.getSheets().map(function (s) { return { name: s.getName(), rows: s.getLastRow(), cols: s.getLastColumn() }; }) };
  if (what === 'rows') {
    var sh = ss.getSheetByName(String(tab)); if (!sh) throw new Error('No such tab.');
    var last = sh.getLastRow(), cols = sh.getLastColumn(), from = Math.max(1, Number(span && span[0]) || 1), n = Math.min(4000, Math.max(1, Number(span && span[1]) || 1000));
    if (from > last || cols < 1) return { rows: [], last: last, cols: cols, from: from, sum: '' };
    var take = Math.min(n, last - from + 1), rng = sh.getRange(from, 1, take, cols);
    var rows = rng.getValues().map(function (r) { return r.map(function (v) { return v instanceof Date ? { $d: v.getTime() } : v; }); });
    var fm = sh.getRange(from, 1, 1, cols).getNumberFormats()[0], text = {}; fm.forEach(function (f, i) { if (f === '@') text[i + 1] = 1; });
    var body = JSON.stringify(rows);
    return { rows: rows, last: last, cols: cols, from: from, text: text, sum: hex(Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, body, Utilities.Charset.UTF_8)) };
  }
  throw new Error('Unknown request.');
}
