/* Chumash.js — v199 (takeover3, Head of School 2026-11-15: "massively expand Kodesh … full parshiyos … Torah, Torah, and more Torah").
   The whole Chumash for the boys' Chumash page (ChumashPage.html): every pasuk of all 54 parshiyos, every word split into
   prefix / stem / ending with its shoresh and meaning, the English, and Rashi (Hebrew + English).

   DATA: five JSON files in Drive, folder "09 CONTENT PACKS" (TL_PACK_FOLDER), one per sefer. Built by takeover3 from:
     - Hebrew text and word analysis: Open Scriptures Hebrew Bible (morphhb, CC BY 4.0), trope removed.
     - English: Metsudah Chumash (Metsudah Publications 2009, CC-BY, via Sefaria).
     - Rashi Hebrew and English: Rashi Chumash (Metsudah Publications 2009, CC-BY, via Sefaria).
     - Word meanings for boys: written by takeover3 (about 700 most common words); other words use the Open Scriptures lexicon.
   NAMES RULE (house rule): the Shem is never in these files; it is written ה׳. Elokim is written אלקים (English: Elokim / Hashem).
   RULES: the files are NEVER edited. A change = upload a NEW file, change its line below (id + sha256 + bytes), bump CHM_STAMP, publish.
   The server uses a file only if its sha256 matches. One Parsha (about 150-200 KB) is kept in the script cache for 6 hours. */
var CHM_STAMP = 'v199';
var CHM_FILES = {
  /* sefer:     [Drive file id, sha256 of the exact bytes, bytes] */
  Bereishis: ['1PHteHJo5rNcCEE4yoim_5YNXKY6FHMvV', 'f2b8aa64ebeb66aadc62faef7a68410d3d075ef91fe154fb15ae12b4c6082ef4', 1945322],
  Shemos:    ['1AvYOh6-gAS7Ece6TPRUPJ5H1NHyL7V5G', 'ab85fe35eddb72b5ec9b195eeca83dcf197974c092b2fe8e594b81aefea832c1', 1823113],
  Vayikra:   ['1-VRXD83wczo0Pqw_aC547-6SeVEMvTc_', 'e901e28d5a6b761f7f9f610628b0e91b54f8c372d39238f9f71145a3942df02c', 1176687],
  Bamidbar:  ['1cmwlDiorqeGKSWGFAHuMrx-iH1Y1njzF', 'b8ace020b3d05a0d08f8c91477ad475b7ca3f0460b89935a382795f84bdb0eae', 1404777],
  Devarim:   ['1bQyR74gUf2zeZ8PQyBgSpgO2MK-Rxzp_', 'c4c1e586985a15e55cdb331ad2cc701c356ff13efbad03d66c55f4c5097f8dc7', 1289362]
};
var CHM_SEFER = [['Bereishis', 0, 12], ['Shemos', 12, 23], ['Vayikra', 23, 33], ['Bamidbar', 33, 43], ['Devarim', 43, 54]];

function chmSeferOf_(name) {
  var all = SGS.PARSHIYOS, i = all.indexOf(name);
  if (i < 0) return null;
  for (var k = 0; k < CHM_SEFER.length; k++) if (i >= CHM_SEFER[k][1] && i < CHM_SEFER[k][2]) return CHM_SEFER[k][0];
  return null;
}
function chmRead_(sefer) {
  var f = CHM_FILES[sefer];
  if (!f || !f[0]) throw new Error('The Chumash for ' + sefer + ' is not ready yet.');
  var bytes = DriveApp.getFileById(f[0]).getBlob().getBytes();
  var sha = tlHex_(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, bytes));
  if (sha !== f[1]) { try { tlPackHealth_('Chumash ' + sefer, 'SHA MISMATCH ' + sha); } catch (e) {} throw new Error('The Chumash file for ' + sefer + ' does not match. Please tell the office.'); }
  return JSON.parse(Utilities.newBlob(bytes).getDataAsString('UTF-8'));
}
/* the boy page asks for one Parsha: a JSON string { name, sefer, p: [pesukim], hi: [highlighted], lex: {strong: [shoresh, meaning, kind, curated]} } */
function chmParsha(token, name) {
  var s = msSession_(token);
  if (!s || (!s.sid && s.role !== 'staff')) throw new Error('Please sign in again.');
  name = String(name || '');
  var sefer = chmSeferOf_(name);
  if (!sefer) throw new Error('There is no Parsha called ' + name + '.');
  var key = 'chm|' + CHM_STAMP + '|' + name, cache = CacheService.getScriptCache();
  try {
    var n = +cache.get(key + '|n');
    if (n > 0) {
      var keys = []; for (var i = 0; i < n; i++) keys.push(key + '|' + i);
      var got = cache.getAll(keys), parts = [];
      for (var j = 0; j < n; j++) { if (got[keys[j]] == null) { parts = null; break; } parts.push(got[keys[j]]); }
      if (parts) return parts.join('');
    }
  } catch (e) {}
  var data = chmRead_(sefer), out = null;
  Object.keys(data.parshiyos).forEach(function (pn) {
    var P = data.parshiyos[pn], lex = {};
    P.p.forEach(function (ps) { ps.w.forEach(function (w) { var k = w[2]; if (k && data.lex[k]) lex[k] = data.lex[k]; }); });
    var str = JSON.stringify({ name: pn, sefer: sefer, p: P.p, hi: P.hi, lex: lex });
    if (pn === name) out = str;
    try {   /* keep every Parsha of this sefer, so the next boy (or next week) is fast */
      var CH = 40000, pieces = {}, cnt = Math.ceil(str.length / CH), k2 = 'chm|' + CHM_STAMP + '|' + pn;
      for (var c = 0; c < cnt; c++) pieces[k2 + '|' + c] = str.slice(c * CH, (c + 1) * CH);
      cache.putAll(pieces, 21600); cache.put(k2 + '|n', String(cnt), 21600);
    } catch (e) {}
  });
  if (!out) throw new Error('There is no Parsha called ' + name + '.');
  return out;
}
/* for the builders: open every sefer once and report (run from the editor) */
function chmSelfTest() {
  var r = [];
  Object.keys(CHM_FILES).forEach(function (s) { try { var d = chmRead_(s); r.push(s + ': ok, ' + Object.keys(d.parshiyos).length + ' parshiyos'); } catch (e) { r.push(s + ': ' + e.message); } });
  Logger.log(r.join('\n')); return r;
}
