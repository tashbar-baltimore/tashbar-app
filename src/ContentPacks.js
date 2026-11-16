/* ContentPacks.js — lessons kept in Google Drive instead of in the code (v100, takeover builder 2, 2026-11-12).
   WHY: Apps Script allows ~10 MB of code per project. Lesson files (ScienceMore, HowToDo, …) can live in Drive instead.

   RULES (read before changing anything here):
   0. v106 FINDING: HtmlService strips comments with a crude rule that also cuts "//" inside strings ("http://…" broke ScienceMore
      for the boys). Packs are served VERBATIM, so a pack = the source file exactly as written. Never make a pack from an EXPORT file.
   1. A pack is an exact copy of an add-on file (same text as the .html file, <script> … </script> included), stored in the
      HQ folder "09 CONTENT PACKS" (TL_PACK_FOLDER). Pack files are NEVER edited or deleted: a change = upload a NEW file,
      then change ONE line below (new id + sha256 + bytes) and publish. Old files stay for rollback (republish an old version).
   2. The app uses a pack ONLY if its sha256 matches the line below. So nothing changes for the boys until a builder publishes,
      and the EDITOR LOCK / pull-diff / version rules keep working exactly as before.
   3. If a pack cannot be read or does not match, the app uses the same-named file in the code if it is still there
      (safety net) and records the problem in the health note (09 CONTENT PACKS / "PACK HEALTH …").
      Remove a file from the code ONLY after the health note shows it "ok" from real use.
   4. Every reader goes through tlFileText_(name): Photos.js (boy page add-ons), Placement.js, TeacherMode.js, StaffGrid.js, Family.js.
   Tools for builders: HQ "07 CONTENT PACKS — how to add or change lessons" (steps + pack tool). */
var TL_PACK_STAMP = 'v289';   /* bump with every TL_PACKS change, so PACK HEALTH is rewritten at once */
var TL_PACK_FOLDER = '1hA-VSPnck5gCAuJYUB_yhPI3y2RvnOT_';
var TL_PACKS = {
  /* name:        [Drive file id,                         sha256 of the exact bytes,                                          bytes  ]
     v106: the SOURCE files exactly as written (served verbatim). Code copies removed from the project. */
  HowToDo:        ['1M1RRrkH-Jg66IWGpOO9CWWlFcyHdSoX2', '746029e9f070451f4961b441b1c40458ccfe31d7fd6477d5f74a86e095e10530', 2590236],   /* v289: v255 pack 988f60cf + esti2@ K6 v3 DO + K5 v3 DO + C12 DO. WAS: v255 (Claude Code builder): v253 pack + esti2@ C2 v3 How-to v2 block, appended at the end.  WAS: v253 (takeover4): + esti2@ C3b How-to v2 */
  HowToDo2:       ['1piZUTmdNf_G1DE42HVdHLiqnEnN7yJYM', 'bcc5109f37d3326b505ada4de8f1f6c9d92c2c7017ea365e21c792e434a879a0', 2769207],   /* v289: v286 pack 55f9865d + esti2@ HB3 v2 DO. WAS: v286: v282 pack d27293bb + 3cc@ KNOT A DO (66, names fixed) + BEAT A DO (66). WAS: v282 (rabbikhaver cloud builder 2): v272 pack fa70aba1 + 3cc@ TL_ELEC_STUDIO_DO v2 (544 How-to boxes, Electives Studio 24 skills), appended at the end. WAS: v272 (takeover2): live 41e1eff5 + TL_KODESH_MOVEOFF1 (Rashi 29 + Mishnayos 28 practice off tap, 434 How-to boxes) + KODESH BIG v2 (replaces v1 in place: big Hebrew on sort/match/spot cards, uniform tiles, no stray emoji on hands-on Kodesh cards). WAS: */   /* v269 (takeover4): live dbf13366 + esti3@ MOVEOFF_GEM2..GEM8_DO (230 boxes) */
  ScienceMore:    ['1bAWD7Lz_1071tXoPhE3yRwr0N9lBj91s', 'd4c5925b379fa6500cfb876807e55e1b04d6e786fdf1f938d8de3ffd07e341bc', 3080753],   /* v229 (takeover4): = esti@ one-step candidate cand31: + TL_SCI_L6A/L6B/L6C + LGA/LGB/LGC (JOKEFIX last); all 132 Science skills hand-written */
  ElectivesMore:  ['1hxrlp4EtuT8vxzpREyzFLo9jRU0TTdlS', '78b6b6fc1fbf22b5be81e07c15934dea91189ef1c4e015493e5199bccbcd616f', 1816617],   /* v286: v282b pack 57a98496 + 3cc@ KNOT A + BEAT A (girls' names changed to boys' names) before the Arts wiring + KNOT/BEAT Arts rows and banner + art_elec_studio v4 (30 pieces) REPLACING v2. WAS: v282 (rabbikhaver cloud builder 2): v225 pack 3277dfbf + 3cc@ TL_ELEC_STUDIO v2 (PHOTO, PIANO, SEW, FIX L06.01-.06, 24 TL_TEACH) right before the Arts wiring + 4 new Arts rows and banner names (fixes found by cloud builder 1) + art_elec_studio.js at the end (24 Studio pieces, window.ART.es_*). WAS: v225 (takeover4): + esti1@ TL_NUC_ICON1 (49 icons; svg namespace written with escaped slashes) */
  ComputingMore:  ['19JPeq6Df-yqbCCuw7NnfGeZHnStxI2YN', '1b8c7683086d39feb8f084261418dd2352c4bb3c238f8c4a29aa15688c5ec103', 846896],   /* v234 (Claude Code builder): live v218 pack + esti1@ TL_COMP_NAMES1 (names and family pass, 69 entries), pasted before the subject wiring.  WAS: v218 (takeover4): v185b + esti1@ TL_COMP_ART1-3 (538 drawn cards) + TL_COMP_HINT1 */
  ReadMore:       ['1yzNV2unsQvBM5GwocRUIvhqiFKZSwOmT', '9ff270280547e8313f2718b8665827ce466289217c8d0edb491d0dd8a0c4d990', 730377],   /* v257 (Claude Code builder): = esti1@ CANDIDATE: + TL_READ_NAMES3 (29 items) + TL_READ_NAMES4 (91 items, 32 stories).  WAS: v234 (Claude Code builder): = esti1@ CANDIDATE: + TL_READ_NAMES2 (Writing names pass, 54 items).  WAS: v229 (takeover4): = esti1@ CANDIDATE: + TL_READ_NAMES1 (Language Arts names; Magic E -> Silent E) */
  SocialMore:     ['1qzx59jcNu-I0ZZkklw0jBSk4NpK0b_3m', '9228a695676285761241240b3232cdb657a6bff5cb28b7d813b2b015eb341db0', 446809],   /* v234 (Claude Code builder): = esti1@ CANDIDATE: + TL_SOC_NAMES1 (names and family pass, 21 items).  WAS: v218 (takeover4): v185b + esti1@ TL_SOC_HINT1 */
  KodeshMore:     ['1oPShC6wcpCkfaG1DIeb2pyhwZWRwLJpa', '5eee89e77e657d2a9dab932bdff5de5dc6022320463f3273dd5ebb894b1604c6', 2368645],   /* v289 (rabbikhaver cloud builder 2): v269 pack 30d37cdb + esti2@ K5 v3, K6 v3, HB3 v2 (override), KRI1/KRI2/KRI3 v2 Teacher Time (override v1), C12 Yom Tov L04 Chanukah + YT4 Teacher Time. WAS: v269 (takeover4): live e10a7c25 + esti3@ MOVEOFF_GEM2..GEM8 (Gemara L07-L09 off tap) */
  FactsMore:      ['1Z_MseTjl_ORln-vcC1p3ISwZnbNgemtL', 'c9cd1e5862a5c019a94e152e92a617378fc4bbc52281ee8e0a02d99ee4271050', 274446],   /* v190: + QA 1114 Part B, Fact Finders hint rows only (8).  v173: + TL_FACT_KINDS1 (60 new-kind items, bands; takeover4). v161: Fact Finders K-12 lessons + home panel (CHANGE 0125-ET developer2@), loaded after ElectivesMore */
  FactsHowTo:     ['1Ctj3JLBjdT9T6Snizyajdz64Rt7QfhJl', '668ce00851fefef0a5be14e9891711fe0fcfb5e21db017ed294e81ad9a500ff5', 218438],   /* v191: + QA 1114 Part A Fact Finders box + TL_FF_BOX2 (2 misleading boxes).  v190: + QA 1114 Part A, Fact Finders box only (1).  v173: + TL_FACT_KDO1 (60 boxes). v161: Fact Finders How to do it (1,170 boxes), loaded after HowToDo2 */
  KodeshQuestPage: ['1zovKBQcv1PcNpmAlS6Cr2iFEJ2puKUah', '1f15957ff9ebb9008a87b3052723ea2add31da0b788db572a0d876ebf02f0b3a', 2829205],   /* v283 (rabbikhaver cloud builder 2): v281 pack a01dd943 + esti3@ E3-AD art_lk_neshech (a909c80e) + E3-AE art_lk_iska (caa509d0), appended. WAS: v281 (rabbikhaver cloud builder): v278 pack + esti3@ E3-AC art_lk_perek4 (BM perek 4 chazarah, paper cut-out, a53a7140) appended.  WAS: v278 (takeover4): v275 ab7ba342 + esti3@ K2-FIX-3 + FIX-4 (shulchani, maneh, perek3, shomer, shlichus v2 K2 in place) + new E3-AA lk_chamesh (BM 4:7-4:8 comic) + E3-AB lk_devarim (BM 4:9-4:10 retro posters): Mishnayos BM perek 4 art complete */
  KodeshArt2:     ['1MjscVopONACZstp_UaXdJJpfG7Fd_YH1', 'b74ff9fbb57f7c8102a8f9239c22d8f249cc09811bb8ef1d7332fd847cd3d1a8', 538779],   /* v285 (rabbikhaver cloud builder 2): NEW pack, joined right after KodeshQuestPage (Photos.js + Speed.js group, like HowToDo2) because KodeshQuestPage is at the upload size. esti3@ art E3-AF lk_tzon, AG lk_seah, AJ lk_umanin, AK lk_chamor, AL lk_mashkon, AM lk_perek6, AN lk_poalim, AO lk_ochlin. Append new Kodesh art here. */
  MathMore:       ['1sLwjGZaNaxZV11VjEBeoNaxKcEo3URUj', '0800e737ad88aeadddebe51c59eb617d936292415c118553fdc1e77bfa117ce7', 202153],
  LifeMore:       ['1OUAXEX2DIRWEymOvkm8PEms9lLlI8x-r', 'db1173f395ade01ab592bed328aef3f8086f86891da6f16bd2a44144f5075e6c', 248164],   /* v228 (takeover4): = esti1@ CANDIDATE: + TL_LIFE_NAMES1 (names and family pass, 33 items) */
  KindsMore:      ['1DG5H_R1_oepEpIejXmM6M62udTbj5OU_', 'ccca436c34a71a0fc13fcef7a10a5610e30c9147f479a347287fb9f4131a316e', 2620438]   /* v288 (rabbikhaver cloud builder 2): v287 pack 6e4e95dd + at the end 5cc@ TT VARIETY D, E, F, G1, G2, H1, H2 v2, I1, I2, I3, J, K1 + 1cc@ QA FIX2-FIX8. WAS: v287 (takeover4 via rabbikhaver cloud builder 2): live v284 pack 06a95f48 + Kodesh K2 fixes + TL_HOWFILL (1,754 Kodesh How-to boxes) + TL_OFFTAP v6 + 147 Torah Tracks TL_TEACH + TL_SRC 142; Math Variety A/B/C and QA FIX1 kept at the end. WAS: v284 (rabbikhaver cloud builder 2): v280 pack 5931b916 + 5cc@ TL_TEACH_MATH_VARIETY_A (fd54816f) + B (db42ef82) + C (240d4aee) + 1cc@ TL_QA_1CC_FIX1 (d6fa5702), appended at the end. WAS: v280 (takeover4): v279 + esti2@ C10 Chumash Level 11 (LK.CHU.L11.01-.03: Sifsei Chachamim, Mizrachi and Gur Aryeh, Why Rashi Chose This Pshat; 51 items + TL_DO + 3 TL_TEACH, K1-K2-K3 native) + names of sefarim and meforshim protected in TL_K2_HEB. Earlier: TL_K2_HEB v3, K3 fixes, TL_SRC 137 sources, CHU5-8 Teacher Time */
};
var TL_PACK_CHUNK = 25000;          /* characters per cache entry (cache values must stay under 100 KB) */
var TL_PACK_TTL = 21600;            /* 6 hours in the server cache */
var TL_PACK_MEMO_ = {};             /* per request */

function tlFileText_(name) {
  if (Object.prototype.hasOwnProperty.call(TL_PACK_MEMO_, name)) return TL_PACK_MEMO_[name];
  var t = null, p = TL_PACKS[name];
  if (p) t = tlPackRead_(name, p);
  var code = null; try { code = HtmlService.createHtmlOutputFromFile(name).getContent(); } catch (e) { code = null; }   /* code copy, if still in the project */
  if (t !== null && code !== null && code !== t) { tlPackHealth_(name, 'CODE COPY DIFFERS from the pack — using the code copy. ' + tlDiffNote_(code, t)); t = code; }
  if (t === null) { if (code === null) throw new Error('No pack and no file named ' + name); t = code; }   /* safety net / not a pack */
  TL_PACK_MEMO_[name] = t;
  return t;
}

/* Where two texts first differ (for the health note): lengths, position, and the characters there as \u codes. */
function tlDiffNote_(a, b) {
  var n = Math.min(a.length, b.length), i = 0; while (i < n && a.charCodeAt(i) === b.charCodeAt(i)) i++;
  var u = function (s) { return s.split('').map(function (ch) { var c = ch.charCodeAt(0); return c >= 32 && c < 127 && ch !== '|' ? ch : '\\u' + ('000' + c.toString(16)).slice(-4); }).join(''); };
  var diffs = 0; for (var j = 0; j < n && diffs < 1000; j++) if (a.charCodeAt(j) !== b.charCodeAt(j)) diffs++;
  return 'code ' + a.length + ' chars, pack ' + b.length + ' chars, first difference at ' + i + ': code[' + u(a.substr(Math.max(0, i - 20), 60)) + '] pack[' + u(b.substr(Math.max(0, i - 20), 60)) + '] differing positions (same index, max 1000): ' + diffs;
}
function tlHex_(bytes) { return bytes.map(function (b) { return ('0' + (b & 255).toString(16)).slice(-2); }).join(''); }

function tlPackRead_(name, p) {
  var id = p[0], sha = p[1], key = 'pk:' + sha.slice(0, 24), c = null;
  try { c = CacheService.getScriptCache(); } catch (e) {}
  try {                                                         /* 1. server cache (keyed by sha, so a new pack never reads an old copy) */
    if (c) { var n = Number(c.get(key + ':n') || 0);
      if (n > 0) { var keys = []; for (var i = 0; i < n; i++) keys.push(key + ':' + i);
        var got = c.getAll(keys), parts = [], ok = true;
        for (var j = 0; j < n; j++) { if (got[keys[j]] == null) { ok = false; break; } parts.push(got[keys[j]]); }
        if (ok) return parts.join(''); } }
  } catch (e) {}
  try {                                                         /* 2. Drive, checked against the sha256 */
    var blob = DriveApp.getFileById(id).getBlob(), bytes = blob.getBytes();
    var h = tlHex_(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, bytes));
    if (h !== sha) { tlPackHealth_(name, 'MISMATCH: Drive file sha256 ' + h.slice(0, 12) + ' is not ' + sha.slice(0, 12) + ' — using the code copy if there is one'); return null; }
    var text = blob.getDataAsString('UTF-8');
    try { if (c) { var o = {}, k = 0; for (var s = 0; s < text.length; s += TL_PACK_CHUNK) o[key + ':' + (k++)] = text.slice(s, s + TL_PACK_CHUNK); o[key + ':n'] = String(k); c.putAll(o, TL_PACK_TTL); } } catch (e) {}
    tlPackHealth_(name, 'ok');
    return text;
  } catch (e) { tlPackHealth_(name, 'READ FAILED: ' + (e && e.message) + ' — using the code copy if there is one'); return null; }
}

/* Health note: one Drive text file in the packs folder, rewritten at most every 6 h per status (and at once when a status changes). */
function tlPackHealth_(name, status) {
  try {
    var c = CacheService.getScriptCache(), ck = 'pkh:' + TL_PACK_STAMP + ':' + name + ':' + status.slice(0, 220);
    if (c && c.get(ck)) return; if (c) c.put(ck, '1', TL_PACK_TTL);
    var pr = PropertiesService.getScriptProperties(), all = {};
    try { all = JSON.parse(pr.getProperty('TL_PACK_HEALTH') || '{}'); } catch (e) { all = {}; }
    all[name] = { status: status + ' [' + TL_PACK_STAMP + ']', sha: (TL_PACKS[name] || [])[1] || '', at: new Date().toISOString() };
    pr.setProperty('TL_PACK_HEALTH', JSON.stringify(all));
    var lines = ['PACK HEALTH — written by the Tashbar app (do not edit). One line per pack: name | status | sha256 | when (UTC).'];
    Object.keys(all).sort().forEach(function (k) { lines.push(k + ' | ' + all[k].status + ' | ' + all[k].sha + ' | ' + all[k].at); });
    var fid = pr.getProperty('TL_PACK_HEALTH_FILE'), f = null;
    if (fid) { try { f = DriveApp.getFileById(fid); } catch (e) { f = null; } }
    if (f) f.setContent(lines.join('\n'));
    else { f = DriveApp.getFolderById(TL_PACK_FOLDER).createFile('PACK HEALTH (written by the app, do not edit).txt', lines.join('\n'), MimeType.PLAIN_TEXT); pr.setProperty('TL_PACK_HEALTH_FILE', f.getId()); }
  } catch (e) {}
}

/* Editor test (Run ▶ tlPackSelfTest): reads every pack fresh from Drive and checks it. */
function tlPackSelfTest() {
  var out = [];
  Object.keys(TL_PACKS).forEach(function (name) {
    var p = TL_PACKS[name];
    try { var b = DriveApp.getFileById(p[0]).getBlob(), by = b.getBytes(), h = tlHex_(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, by));
      out.push(name + ': ' + (h === p[1] && by.length === p[2] ? 'OK' : 'BAD (sha ' + h.slice(0, 12) + ', ' + by.length + ' bytes)'));
    } catch (e) { out.push(name + ': READ FAILED ' + e.message); }
  });
  Logger.log(out.join('\n')); return out.join('\n');
}

/* v103 EXPORT: HtmlService removes block and line comments from the code before serving it, so a pack made from the source file
   is not byte-equal to what the boys have always run. To move a file with ZERO change for the boys, the app itself saves
   exactly what it serves into 09 CONTENT PACKS ("EXPORT <name> — <sha12> — what the app serves.html") and writes the id +
   sha256 into PACK HEALTH. The builder then points TL_PACKS at that file. Runs once per file per content (skips if unchanged). */
var TL_PACK_EXPORT = [];   /* v106: not needed any more — packs are the source files. HtmlService's comment stripping also cut "//" inside strings (it broke ScienceMore), so NEVER build a pack from an EXPORT. */
function tlPackExportAll_() {
  var pr = PropertiesService.getScriptProperties(), folder = null;
  TL_PACK_EXPORT.forEach(function (name) {
    try {
      var t = HtmlService.createHtmlOutputFromFile(name).getContent();
      var sha = tlHex_(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, t, Utilities.Charset.UTF_8)), key = 'TL_PACK_EXPORTED_' + name;
      if (pr.getProperty(key) === sha) return;
      if (TL_PACKS[name] && TL_PACKS[name][1] === sha) { pr.setProperty(key, sha); return; }   /* already the pack */
      folder = folder || DriveApp.getFolderById(TL_PACK_FOLDER);
      var f = folder.createFile('EXPORT ' + name + ' — ' + sha.slice(0, 12) + ' — what the app serves.html', t, MimeType.PLAIN_TEXT);
      var bytes = f.getBlob().getBytes(), sha2 = tlHex_(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, bytes));
      pr.setProperty(key, sha);
      tlPackHealth_('EXPORT ' + name, 'exported id ' + f.getId() + ' sha256 ' + sha2 + ' bytes ' + bytes.length + (sha2 === sha ? ' (verified)' : ' (SHA DIFFERS after save!)'));
    } catch (e) { tlPackHealth_('EXPORT ' + name, 'EXPORT FAILED: ' + (e && e.message)); }
  });
  Object.keys(TL_PACKS).forEach(function (name) { try { tlFileText_(name); } catch (e) { tlPackHealth_(name, 'NOT SERVED: ' + (e && e.message)); } });   /* v105: one staff-screen visit checks every pack */
}
