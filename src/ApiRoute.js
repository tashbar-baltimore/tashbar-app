/* ApiRoute (Claude Code builder, 2026-11-16, Head of School: "let's do Firebase").
   Lets the student page, when it is served from the fast file host (tashbar-learning-live.web.app), call the SAME
   server functions it calls today through google.script.run, as a POST to the /exec link.
   Not a new door: google.script.run can already call any top-level function whose name does not end in "_".
   This route is narrower: only the names in API_ALLOW (what the student page really calls). Every function keeps
   its own checks (sign-in token, tries limit, the server sets every money amount). */
var API_ALLOW = ["apiKidPage","arAnswer", "arCfAns", "arCfDone", "arCfGet", "arCfList", "arCfMake", "arJoin", "arMyStats", "arOpen", "arPoll", "arTeach", "chAnswer", "chJoin", "chPoll", "chQs", "chmParsha", "cnKidInfo", "cnOrderCancel", "cnOrderMenu", "cnOrderPlace", "crSend", "crStaffList", "kpAck", "kpMine", "msAppUrl", "msBootstrap", "msLoad", "msMusicInfo", "msMusicPart", "msPhotoNotes", "msPhotoSubmit", "msQuestTools", "msQuestToolsGet", "msQuestToolsParts", "msReport", "msSave", "msSchoolGoal", "msSignInCode", "msSignInFast", "pfConfirmSave", "pfConfirmStart", "pfHello", "sbMySchool", "sgMyDesk", "sgShoutSeen", "soundGet", "soundSave", "stBuy", "stInfo", "tmMine"];
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
