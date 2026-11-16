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
var TL_PACK_STAMP = 'v276';   /* bump with every TL_PACKS change, so PACK HEALTH is rewritten at once */
var TL_PACK_FOLDER = '1hA-VSPnck5gCAuJYUB_yhPI3y2RvnOT_';
var TL_PACKS = {
  /* name:        [Drive file id,                         sha256 of the exact bytes,                                          bytes  ]
     v106: the SOURCE files exactly as written (served verbatim). Code copies removed from the project. */
  HowToDo:        ['1ElJ4TYBFZOlmo_fW0eGOiehdzU6otO_R', '988f60cfaf389de4c55ed20b203d0b4648a80d8c7efcfe652056a56792344f93', 2545783],   /* v255 (Claude Code builder): v253 pack + esti2@ C2 v3 How-to v2 block, appended at the end.  WAS: v253 (takeover4): + esti2@ C3b How-to v2 */
  HowToDo2:       ['15m_68yQRu04aLdlOYboGp7IV6GHj0SBx', 'fa70aba1f83f5650972c491402f0d0724beb599ffcafe4789da754de9ab380dc', 2601736],   /* v272 (takeover2): live 41e1eff5 + TL_KODESH_MOVEOFF1 (Rashi 29 + Mishnayos 28 practice off tap, 434 How-to boxes) + KODESH BIG v2 (replaces v1 in place: big Hebrew on sort/match/spot cards, uniform tiles, no stray emoji on hands-on Kodesh cards). WAS: */   /* v269 (takeover4): live dbf13366 + esti3@ MOVEOFF_GEM2..GEM8_DO (230 boxes) */
  ScienceMore:    ['1bAWD7Lz_1071tXoPhE3yRwr0N9lBj91s', 'd4c5925b379fa6500cfb876807e55e1b04d6e786fdf1f938d8de3ffd07e341bc', 3080753],   /* v229 (takeover4): = esti@ one-step candidate cand31: + TL_SCI_L6A/L6B/L6C + LGA/LGB/LGC (JOKEFIX last); all 132 Science skills hand-written */
  ElectivesMore:  ['1XmVkXX3JIs4nS0sBWJCj9szyxMM0R1BM', '3277dfbf620527a844e3eaa99b7a76c06f3cee875c18b254466c6086645dabf4', 1290788],   /* v225 (takeover4): + esti1@ TL_NUC_ICON1 (49 icons; svg namespace written with escaped slashes) */
  ComputingMore:  ['19JPeq6Df-yqbCCuw7NnfGeZHnStxI2YN', '1b8c7683086d39feb8f084261418dd2352c4bb3c238f8c4a29aa15688c5ec103', 846896],   /* v234 (Claude Code builder): live v218 pack + esti1@ TL_COMP_NAMES1 (names and family pass, 69 entries), pasted before the subject wiring.  WAS: v218 (takeover4): v185b + esti1@ TL_COMP_ART1-3 (538 drawn cards) + TL_COMP_HINT1 */
  ReadMore:       ['1yzNV2unsQvBM5GwocRUIvhqiFKZSwOmT', '9ff270280547e8313f2718b8665827ce466289217c8d0edb491d0dd8a0c4d990', 730377],   /* v257 (Claude Code builder): = esti1@ CANDIDATE: + TL_READ_NAMES3 (29 items) + TL_READ_NAMES4 (91 items, 32 stories).  WAS: v234 (Claude Code builder): = esti1@ CANDIDATE: + TL_READ_NAMES2 (Writing names pass, 54 items).  WAS: v229 (takeover4): = esti1@ CANDIDATE: + TL_READ_NAMES1 (Language Arts names; Magic E -> Silent E) */
  SocialMore:     ['1qzx59jcNu-I0ZZkklw0jBSk4NpK0b_3m', '9228a695676285761241240b3232cdb657a6bff5cb28b7d813b2b015eb341db0', 446809],   /* v234 (Claude Code builder): = esti1@ CANDIDATE: + TL_SOC_NAMES1 (names and family pass, 21 items).  WAS: v218 (takeover4): v185b + esti1@ TL_SOC_HINT1 */
  KodeshMore:     ['1PkMM5LdZtqXyTmMDGVKCoZ62e-cvEVAT', '30d37cdb2873872bf12f7ccbe9276cba00efcc50a025c0ee45aed7a33399d14a', 2186642],   /* v269 (takeover4): live e10a7c25 + esti3@ MOVEOFF_GEM2..GEM8 (Gemara L07-L09 off tap) */
  FactsMore:      ['1Z_MseTjl_ORln-vcC1p3ISwZnbNgemtL', 'c9cd1e5862a5c019a94e152e92a617378fc4bbc52281ee8e0a02d99ee4271050', 274446],   /* v190: + QA 1114 Part B, Fact Finders hint rows only (8).  v173: + TL_FACT_KINDS1 (60 new-kind items, bands; takeover4). v161: Fact Finders K-12 lessons + home panel (CHANGE 0125-ET developer2@), loaded after ElectivesMore */
  FactsHowTo:     ['1Ctj3JLBjdT9T6Snizyajdz64Rt7QfhJl', '668ce00851fefef0a5be14e9891711fe0fcfb5e21db017ed294e81ad9a500ff5', 218438],   /* v191: + QA 1114 Part A Fact Finders box + TL_FF_BOX2 (2 misleading boxes).  v190: + QA 1114 Part A, Fact Finders box only (1).  v173: + TL_FACT_KDO1 (60 boxes). v161: Fact Finders How to do it (1,170 boxes), loaded after HowToDo2 */
  KodeshQuestPage: ['1ww95zopmDe9URlExTsEn3VUMVKgMj6Fd', 'ab7ba342b706f08beef795937c6947014952edf2e971d3f0023a37ce691e8de8', 2390505],   /* v275 (takeover4): live 71deb849 + esti3@ KODESH-E3-K2-FIX-2: lk_keilim / lk_chesronos / lk_kinyan v2 K2 replaced in place, lk_onaah v2.1 + lk_sela v2.1 K2 added (Hebrew terms in Hebrew letters) */
  MathMore:       ['1sLwjGZaNaxZV11VjEBeoNaxKcEo3URUj', '0800e737ad88aeadddebe51c59eb617d936292415c118553fdc1e77bfa117ce7', 202153],
  LifeMore:       ['1OUAXEX2DIRWEymOvkm8PEms9lLlI8x-r', 'db1173f395ade01ab592bed328aef3f8086f86891da6f16bd2a44144f5075e6c', 248164],   /* v228 (takeover4): = esti1@ CANDIDATE: + TL_LIFE_NAMES1 (names and family pass, 33 items) */
  KindsMore:      ['12X05R7Rkyr4zZfpWvVytHDgZpQobHinu', 'bf7215ee0a9fc4ab969a43b295875a3d53732c8c35e4bbc1e3a2382da829b405', 1561806]   /* v275 (takeover4): live 5578c956 with the 49 Lashon Hakodesh Teacher Time lessons rewritten in Hebrew letters (HoS rule K2: no transliteration) */
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
