/* ApiRoute (Claude Code builder, 2026-11-16, Head of School: "let's do Firebase").
   Lets the student page, when it is served from the fast file host (tashbar-learning-live.web.app), call the SAME
   server functions it calls today through google.script.run, as a POST to the /exec link.
   Not a new door: google.script.run can already call any top-level function whose name does not end in "_".
   This route is narrower: only the names in API_ALLOW (what the student page really calls). Every function keeps
   its own checks (sign-in token, tries limit, the server sets every money amount). */
var API_ALLOW = ["acAdminLoad", "acMoveStudents", "acMyScope", "acParentNewCode", "acSaveParent", "acSaveSchool", "acSaveStaffScope", "apiKidPage", "apiStaffPage", "arAnswer", "arCfAns", "arCfDone", "arCfGet", "arCfList", "arCfMake", "arJoin", "arMyStats", "arOpen", "arPoll", "arSet", "arTeach", "chAnswer", "chJoin", "chOpen", "chPoll", "chQs", "chStep", "chmParsha", "cnKidInfo", "cnOrderCancel", "cnOrderMenu", "cnOrderPlace", "crCatalog", "crClasses", "crDeleteClass", "crDeleteLesson", "crEndClass", "crInbox", "crLessons", "crMarkRead", "crRunning", "crSaveClass", "crSaveLesson", "crSend", "crStaffAdmin", "crStaffList", "crStaffSave", "crStartClass", "crUnread", "kpAck", "kpMine", "msAppUrl", "msBootstrap", "msLoad", "msMusicInfo", "msMusicPart", "msPhotoNotes", "msPhotoSubmit", "msQuestTools", "msQuestToolsGet", "msQuestToolsParts", "msReport", "msSave", "msSchoolGoal", "msSignInCode", "msSignInFast", "pfConfirmSave", "pfConfirmStart", "pfHello", "sbAddKids", "sbCreate", "sbLoad", "sbMove", "sbMySchool", "sbNewCode", "sbStyle", "sgAddStudent", "sgArchive", "sgAwardPrizes", "sgBechinaReady", "sgBoyDay", "sgChmSetLevel", "sgClassSky", "sgDesk", "sgFamily", "sgFamilyBulk", "sgFamilySet", "sgFixPoints", "sgFreeCode", "sgGive", "sgGroups", "sgKodesh", "sgKodeshBoy", "sgKodeshGrid", "sgKodeshMark", "sgLevel", "sgLevelBechina", "sgLevels", "sgLoad", "sgMoney", "sgMusicSet", "sgMyDesk", "sgNote", "sgNoteDelete", "sgNoteMany", "sgNotes", "sgNow", "sgParshaInfo", "sgPick", "sgPickCatalog", "sgReportDone", "sgReports", "sgSetCode", "sgSetParsha", "sgShoutSeen", "sgSince", "sgTeachTogether", "sgToday", "sgUndoFix", "sgWeek", "sgWeekNotes", "soundGet", "soundSave", "stBuy", "stInfo", "stStaffOrders", "stStaffSet", "tmCatalog", "tmEnd", "tmExtend", "tmList", "tmMine", "tmStart"];
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
