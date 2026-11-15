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
var TL_PACK_STAMP = 'v197';   /* bump with every TL_PACKS change, so PACK HEALTH is rewritten at once */
var TL_PACK_FOLDER = '1hA-VSPnck5gCAuJYUB_yhPI3y2RvnOT_';
var TL_PACKS = {
  /* name:        [Drive file id,                         sha256 of the exact bytes,                                          bytes  ]
     v106: the SOURCE files exactly as written (served verbatim). Code copies removed from the project. */
  HowToDo:        ['1B6aA9nhLwVs34uz6brXXL4av_ltkxPqg', '2bd51bddf7a871796ce422e7cab82ca9606f2bbd97a1214d9fd138fa0c9bb2d0', 2339584],
  HowToDo2:       ['1GzAtgaAD81yup5-RtwC_XAkhZ_yQXrZd', 'b19d49fa59fe94aa4a61f621be8e01dce360774230aef5a6fcb0f08132f2600f', 1677535],   /* staged: = esti@ CANDIDATE b19d49fa (staged a1ed1589 with G8+G9 boxes + TL_ARTS_K3DO + K4DO).  v190: + G8 + G9 TL_DO at the END.  v185: + G6 + G7 TL_DO at the END.  v185: + TL_KODESH_E3_DO_KINDS_RAS at the END.  v183: + TL_KODESH_E3_DO_KINDS_GEM + DO_KINDS_MSH at the END.  v182: + C8 v3 TL_DO + TL_KODESH_E3_DO1 at the END.  v181: = v177 + TL_ARTS_K2DO (137 boxes) at the END.  v177: = esti@ CANDIDATE (v172 + TL_ARTS_K1DO) + C8 v2 TL_DO. v172: + TL_ARTS_KDO1 (28 boxes) at the END. v168: + TL_HEB_DO1 at the END. v165: + Arts TL_ARTS_DO1/DO2/DO3 at the END. v157: + TL_DO for K7 v2, R6, M6, M7, R7, C8 at the END (after takeover3 v156 block). v156: + takeover3 How-to giveaway fixes at the END (sweep 1,000 boxes, math guard 25 recipes, 10 coin/halves boxes). v139: part 2 of HowToDo (split for upload size); loaded right after it by Photos.js. v142: + HEB L01-L05 RULE v2 fix (58 boxes); v143: + C7 TL_DO; v144: + C4 v2 TL_DO; v146: + Arts L12-L16 TL_DO; v149: + C5 v2 TL_DO; v150: + SIM7 v2 TL_DO */
  ScienceMore:    ['1Oa0ITQmDw8wKFwVUNCp2jlCW5oKIfmAs', '3e85a2ae7560871fba500cda464b6956a71fc0a5a64373205d353dab9f6ef5f2', 683019],
  ElectivesMore:  ['1OVmVyQIpNxJ9fvXgQ6atEzuDhKwDyBPk', '6a7db18257c581fb86e1e4c7025a8a0b1a8674fba0775fe34106114918278f86', 1205437],   /* staged: = esti@ CANDIDATE 6a7db182 (live + TL_ARTS_K3 + K4 + KART v2; CHANGE 1905 + 2050).  v181: = esti@ CANDIDATE 47ccddb5 (v177 + TL_ARTS_K2 second K-1 lessons + TL_ARTS_KART 140 drawings).  v177: = esti@ CANDIDATE (v172 + TL_ARTS_K1 Arts L01-L02 + K-1 row-start wiring). v172: + TL_ARTS_KINDS1 (28 new-kind items, bands, pegs; takeover4). v165: + Arts TL_ARTS_FAIR2/FIX1/FIX2/FIX3 (esti@ Jobs B, C, D3). v157: + Arts L10-L11 fair wrong choices patch (TL_ARTS_FAIR1 = 23/0). v146: + Arts L12-L16 (b61-b65 v2) */
  ComputingMore:  ['1QY13CXakIV5PVcuIaRjdHs6nkXUYi18P', 'cdef700ea5e419d77f453897db14a1dd500780ca42e4d716b4c22ccf9f1f073f', 640799],
  ReadMore:       ['1LKpB_D3kP4MGmfEt4iVSRI64WimOSLBc', 'f100bb5e961e21cf21669c0d9151a0102dfab0965e15974f946f4eebbb9743d0', 545116],
  SocialMore:     ['1yumHQ0CFr6q_BwTc5DaptY0LfwYlD637', '453ea0ec9c96d7c4d3d75823bc1e968e3c84f24f02d738c6a6e1e045e81ec794', 432337],
  KodeshMore:     ['16zJBoOeMTzLk-JEn5K1BqtXBWgoXnEE8', '62c133cbde495c2b0c4a10c60c4d869bd0cc4a010d8f65a342d31cc350eecc1a', 1463824],   /* v197 (takeover4): v190 staged pack + Kodesh Quest in the Limudei Kodesh panel (track MIN Brachos, Davening and Yom Tov; Quest lands at each step; HEB starts at the level check) */
  FactsMore:      ['1Z_MseTjl_ORln-vcC1p3ISwZnbNgemtL', 'c9cd1e5862a5c019a94e152e92a617378fc4bbc52281ee8e0a02d99ee4271050', 274446],   /* v190: + QA 1114 Part B, Fact Finders hint rows only (8).  v173: + TL_FACT_KINDS1 (60 new-kind items, bands; takeover4). v161: Fact Finders K-12 lessons + home panel (CHANGE 0125-ET developer2@), loaded after ElectivesMore */
  FactsHowTo:     ['1Ctj3JLBjdT9T6Snizyajdz64Rt7QfhJl', '668ce00851fefef0a5be14e9891711fe0fcfb5e21db017ed294e81ad9a500ff5', 218438],   /* v191: + QA 1114 Part A Fact Finders box + TL_FF_BOX2 (2 misleading boxes).  v190: + QA 1114 Part A, Fact Finders box only (1).  v173: + TL_FACT_KDO1 (60 boxes). v161: Fact Finders How to do it (1,170 boxes), loaded after HowToDo2 */
  KodeshQuestPage: ['1IkA5nOLVtPFsAss_mkTJFuyDxPX43GQF', 'cfcf525aa7e2f28d9a324f7b5cbca3284ab3a73728bf2620b5425294e9996f48', 887997],   /* v196 (takeover3, HoS): warm-ups only from the same world (ABC Trace showed Brachos). v178: Kodesh Quest v9 page (kodesh@ CHANGE 1530-ET, page sha 15b8c44d…) as window.TL_KQ_PAGE; read by KinderKriyah.html */
  MathMore:       ['1sLwjGZaNaxZV11VjEBeoNaxKcEo3URUj', '0800e737ad88aeadddebe51c59eb617d936292415c118553fdc1e77bfa117ce7', 202153],
  LifeMore:       ['1Cg8sYXWx2mc0_1sv5soJPFC14sQyVNkk', '9c041469ba57bc7d1a010b2e53092f05e4e8a346c1991326cabf326444b9a10a', 164005],   /* v181: = esti1@ CANDIDATE 9c041469 (v165 + TL_LIFE_FAIR1 fair wrong choices, 67 items). */
  KindsMore:      ['1Bb5X2kbWo6xFi15adIg6Uz9HKcBQL5nD', 'd8674bd38c2104c9528e0e84937c43c34333f54a90fd283381ecda4ace590e3f', 770367]   /* v193: KindsMore v5 = 1,202 items (waves 1-5: every standard skill has 2 activities of different kinds).  v192: KindsMore v4 = 1,049 items (waves 1-4: every L1-9 standard skill has 2 activities of different kinds).  v191: KindsMore v3 = 769 items (waves 1-3: + a second, different activity for 212 Level 1-4 skills).  v183: KindsMore v2 = 557 hand-written items (wave 1: 214 skills with no kind; wave 2: 343 skills that had only Quick Match).  v179: one new-kind item + How-to box for 214 skills that had none (takeover4). Loaded right after Activities. */
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
