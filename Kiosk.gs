/* Tashbar kiosk helper: the app's own web address, so staff can be sent to the teacher page (?ms=1&staff=1). */
function msAppUrl() { return ScriptApp.getService().getUrl(); }

/* Code-only sign-in (Head of School 2026-11-08: no name screen, no lockout). Codes must be unique. Staff code opens the teacher dashboard. */
function msSignInCode(code) {
  code = String(code || '').replace(/\D/g, '').slice(0, 8);
  if (code.length < 4) return { ok: false };
  msEnsureSetup_();
  var p = PropertiesService.getScriptProperties(), role = null, sid = null, name = '', staffInfo = null;
  var staffName = msStaffMatch_(code);
  if (staffName) { role = 'staff'; name = staffName; staffInfo = typeof cnStaffInfo_ === 'function' ? cnStaffInfo_(code) : null; }
  else { var r = msRoster_().filter(function (x) { return msHash_(x.salt, code) === x.hash; })[0]; if (r) { role = 'kid'; sid = r.id; name = r.name; } }
  if (!role) return { ok: false };
  var token = Utilities.getUuid();
  CacheService.getScriptCache().put('ms_tok_' + token, JSON.stringify({ role: role, sid: sid, staff: staffInfo, who: role === 'staff' && typeof sgStaffRow_ === 'function' ? sgStaffRow_(code) : null }), MS.TOKEN_HOURS * 3600);
  return { ok: true, token: token, role: role, sid: sid, name: name };
}

/* TL-040 real staff codes (Head of School, 2026-11-08). Tab MS_Staff in the school database: staff_id, name, code_salt, code_hash, active.
   When MS_Staff has an active row, only those codes are staff codes (the old practice staff code stops working). Returns the staff name or null. */
function msStaffMatch_(code) {
  code = String(code || '');
  var sh = msBook_().getSheetByName('MS_Staff'), n = sh ? sh.getLastRow() : 0;
  var rows = n > 1 ? sh.getRange(2, 1, n - 1, 6).getValues().filter(function (r) { return r[0] && r[4] !== false && String(r[4]).toUpperCase() !== 'FALSE' && String(r[5]).toLowerCase() !== 'canteen'; }) : [];
  if (rows.length) {
    for (var i = 0; i < rows.length; i++) if (msHash_(String(rows[i][2]), code) === String(rows[i][3])) return String(rows[i][1]);
    return null;
  }
  var p = PropertiesService.getScriptProperties();
  return msHash_(p.getProperty('MS_STAFF_SALT'), code) === p.getProperty('MS_STAFF_HASH') ? 'Staff' : null;
}
