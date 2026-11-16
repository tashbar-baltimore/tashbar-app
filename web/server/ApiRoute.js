/* PROPOSAL, NOT INSTALLED. The one server change Stage 1 needs: let the file-hosted student page call the same
   server functions it calls today through google.script.run, as a POST to the /exec link.
   Same exposure as today: google.script.run can already call any top-level function whose name does not end in "_".
   This route is narrower: only the names in API_ALLOW (the functions the student page really calls).
   To install: add this file to src/ as ApiRoute.js, fill API_ALLOW from tools/list-kid-calls.js, publish as a normal batch. */
var API_ALLOW = { /* filled at install time, e.g. msBootstrap: 1, msSignInCode: 1, msLoad: 1, msSave: 1, ... */ };
function doPost(e) {
  var out = function (o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); };
  try {
    var req = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (!req || req.api !== 1) return out({ ok: false, error: 'Not an app request.' });
    var fn = String(req.fn || '');
    if (!/^[a-z][A-Za-z0-9]*$/.test(fn) || !Object.prototype.hasOwnProperty.call(API_ALLOW, fn) || typeof this[fn] !== 'function') return out({ ok: false, error: 'Not allowed.' });
    return out({ ok: true, result: this[fn].apply(null, Array.isArray(req.args) ? req.args : []) });
  } catch (err) { return out({ ok: false, error: String((err && err.message) || err).slice(0, 300) }); }
}
