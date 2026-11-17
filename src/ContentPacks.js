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
var TL_PACK_STAMP = 'v353';   /* bump with every TL_PACKS change, so PACK HEALTH is rewritten at once */
var TL_PACK_FOLDER = '1hA-VSPnck5gCAuJYUB_yhPI3y2RvnOT_';
var TL_PACKS = {
  /* name:        [Drive file id,                         sha256 of the exact bytes,                                          bytes  ]
     v106: the SOURCE files exactly as written (served verbatim). Code copies removed from the project. */
  HowToDo:        ['1M1RRrkH-Jg66IWGpOO9CWWlFcyHdSoX2', '746029e9f070451f4961b441b1c40458ccfe31d7fd6477d5f74a86e095e10530', 2590236],   /* v289: v255 pack 988f60cf + esti2@ K6 v3 DO + K5 v3 DO + C12 DO. WAS: v255 (Claude Code builder): v253 pack + esti2@ C2 v3 How-to v2 block, appended at the end.  WAS: v253 (takeover4): + esti2@ C3b How-to v2 */
  HowToDo2:       ['1m_tzjqRBTiT0n5i3gy3XegqKU-OiyzO1', '78c78567f2e52d8d646e362ee137b430524c60744b5b2778ff92bfe6acc4225a', 3025362],   /* v292 (takeover2): = 9fe22ed1 with KODESH BIG v4 (sefer words: Hebrew form above Rashi, pasuk, Mishna...; 27 labels, exact Sefaria copies). WAS: */   /* v290 (takeover2): v289 bcc5109f + KODESH BIG v3 + TL_TEACH RAS/MSH v2 (K1 text first, K2 Hebrew in Hebrew) + TL_KODESH_K2 (305 items, 264 boxes, names) + MOVEOFF1 v2. WAS: */   /* v289: v286 pack 55f9865d + esti2@ HB3 v2 DO. WAS: v286: v282 pack d27293bb + 3cc@ KNOT A DO (66, names fixed) + BEAT A DO (66). WAS: v282 (rabbikhaver cloud builder 2): v272 pack fa70aba1 + 3cc@ TL_ELEC_STUDIO_DO v2 (544 How-to boxes, Electives Studio 24 skills), appended at the end. WAS: v272 (takeover2): live 41e1eff5 + TL_KODESH_MOVEOFF1 (Rashi 29 + Mishnayos 28 practice off tap, 434 How-to boxes) + KODESH BIG v2 (replaces v1 in place: big Hebrew on sort/match/spot cards, uniform tiles, no stray emoji on hands-on Kodesh cards). WAS: */   /* v269 (takeover4): live dbf13366 + esti3@ MOVEOFF_GEM2..GEM8_DO (230 boxes) */
  ScienceMore:    ['1bAWD7Lz_1071tXoPhE3yRwr0N9lBj91s', 'd4c5925b379fa6500cfb876807e55e1b04d6e786fdf1f938d8de3ffd07e341bc', 3080753],   /* v229 (takeover4): = esti@ one-step candidate cand31: + TL_SCI_L6A/L6B/L6C + LGA/LGB/LGC (JOKEFIX last); all 132 Science skills hand-written */
  ElectivesMore:  ['1GfKcIed-aErl-dfhVIt24vrgikhu2KiG', 'f41481ad58c085025e51a33d216702204ef35fa115f673e9680cdd5aac1cd3fe', 2319069],  /* v351 (cloud builder 1): takeover-3cc 60c1482d (v311 fe0e6fc7 + WOOD_B + art v8) + 3cc@ KITCH_A + KITCH_B + TL_CB1_KITCH_FIX1 + art_elec_studio v10 (48 pieces). WAS: */ /* v311 (cloud builder 1): 079623bb + 3cc@ TL_ELEC_STUDIO_WOOD_A (new course Woodshop Basics .01-.03; girls' names swapped for boys') before the Thinking and Arts wiring + art_elec_studio v7 (39 pieces) replacing v6 */
  ComputingMore:  ['19JPeq6Df-yqbCCuw7NnfGeZHnStxI2YN', '1b8c7683086d39feb8f084261418dd2352c4bb3c238f8c4a29aa15688c5ec103', 846896],   /* v234 (Claude Code builder): live v218 pack + esti1@ TL_COMP_NAMES1 (names and family pass, 69 entries), pasted before the subject wiring.  WAS: v218 (takeover4): v185b + esti1@ TL_COMP_ART1-3 (538 drawn cards) + TL_COMP_HINT1 */
  ReadMore:       ['1yzNV2unsQvBM5GwocRUIvhqiFKZSwOmT', '9ff270280547e8313f2718b8665827ce466289217c8d0edb491d0dd8a0c4d990', 730377],   /* v257 (Claude Code builder): = esti1@ CANDIDATE: + TL_READ_NAMES3 (29 items) + TL_READ_NAMES4 (91 items, 32 stories).  WAS: v234 (Claude Code builder): = esti1@ CANDIDATE: + TL_READ_NAMES2 (Writing names pass, 54 items).  WAS: v229 (takeover4): = esti1@ CANDIDATE: + TL_READ_NAMES1 (Language Arts names; Magic E -> Silent E) */
  SocialMore:     ['1qzx59jcNu-I0ZZkklw0jBSk4NpK0b_3m', '9228a695676285761241240b3232cdb657a6bff5cb28b7d813b2b015eb341db0', 446809],   /* v234 (Claude Code builder): = esti1@ CANDIDATE: + TL_SOC_NAMES1 (names and family pass, 21 items).  WAS: v218 (takeover4): v185b + esti1@ TL_SOC_HINT1 */
  KodeshMore:     ['1iTFI_Cp1GO37HzTwFgwSUC93e40uQLOS', 'e00bb968a73855882efb023fdedd251d9079add9c4b718c8fb693478a8480bf6', 2616185],   /* v341 (takeover4): 20d51138 + esti2@ HB1 v2 Lashon Hakodesh L01 Island Lessons code (105ec1b2) at the END. WAS: */ /* v325 (takeover2): f8dc548a + esti2@ C2v4 Chumash L03 code (1b7e5927) + TL_KODESH_TEACH_CHU3 v2 (7cab3f21) + HB2v3 Lashon Hakodesh L02 code (042fe0e2) + TL_TEACH HB2v3 (6766a263) at the END. WAS: */ /* v314 (claude-code-builder-2): live 9c334553 + esti2@ CHU L02 C1 v4 code + TL_KODESH_TEACH_CHU2 v2 + TL_KODESH_TEACH_KRI2B v1 (6 new Kriyah lessons) + TL_KODESH_TEACH_KRI4 v2, appended at the END. WAS: */   /* v295: v289 pack 5eee89e7 + esti2@ K7 v4 Kriyah L03.07-.10 brachos (overrides K7 v3). WAS: v289 (rabbikhaver cloud builder 2): v269 pack 30d37cdb + esti2@ K5 v3, K6 v3, HB3 v2 (override), KRI1/KRI2/KRI3 v2 Teacher Time (override v1), C12 Yom Tov L04 Chanukah + YT4 Teacher Time. WAS: v269 (takeover4): live e10a7c25 + esti3@ MOVEOFF_GEM2..GEM8 (Gemara L07-L09 off tap) */
  FactsMore:      ['1Z_MseTjl_ORln-vcC1p3ISwZnbNgemtL', 'c9cd1e5862a5c019a94e152e92a617378fc4bbc52281ee8e0a02d99ee4271050', 274446],   /* v190: + QA 1114 Part B, Fact Finders hint rows only (8).  v173: + TL_FACT_KINDS1 (60 new-kind items, bands; takeover4). v161: Fact Finders K-12 lessons + home panel (CHANGE 0125-ET developer2@), loaded after ElectivesMore */
  FactsHowTo:     ['1Ctj3JLBjdT9T6Snizyajdz64Rt7QfhJl', '668ce00851fefef0a5be14e9891711fe0fcfb5e21db017ed294e81ad9a500ff5', 218438],   /* v191: + QA 1114 Part A Fact Finders box + TL_FF_BOX2 (2 misleading boxes).  v190: + QA 1114 Part A, Fact Finders box only (1).  v173: + TL_FACT_KDO1 (60 boxes). v161: Fact Finders How to do it (1,170 boxes), loaded after HowToDo2 */
  KodeshQuestPage: ['1zovKBQcv1PcNpmAlS6Cr2iFEJ2puKUah', '1f15957ff9ebb9008a87b3052723ea2add31da0b788db572a0d876ebf02f0b3a', 2829205],   /* v283 (rabbikhaver cloud builder 2): v281 pack a01dd943 + esti3@ E3-AD art_lk_neshech (a909c80e) + E3-AE art_lk_iska (caa509d0), appended. WAS: v281 (rabbikhaver cloud builder): v278 pack + esti3@ E3-AC art_lk_perek4 (BM perek 4 chazarah, paper cut-out, a53a7140) appended.  WAS: v278 (takeover4): v275 ab7ba342 + esti3@ K2-FIX-3 + FIX-4 (shulchani, maneh, perek3, shomer, shlichus v2 K2 in place) + new E3-AA lk_chamesh (BM 4:7-4:8 comic) + E3-AB lk_devarim (BM 4:9-4:10 retro posters): Mishnayos BM perek 4 art complete */
  KodeshArt2:     ['1wqi3k1xrcNKjg_72utRGZUiUniWvOWxh', 'c2000837e8cb73e20cd462257306daa74e3b175bb800a8f4ee435539e0ddb620', 761140],   /* v295: v291 9cfe40c5 + esti3@ E3-AR art_lk_shomrim. WAS: v291: + esti3@ E3-AP art_lk_ochel, E3-AQ art_lk_kotzetz. WAS: v285 (rabbikhaver cloud builder 2): NEW pack, joined right after KodeshQuestPage (Photos.js + Speed.js group, like HowToDo2) because KodeshQuestPage is at the upload size. esti3@ art E3-AF lk_tzon, AG lk_seah, AJ lk_umanin, AK lk_chamor, AL lk_mashkon, AM lk_perek6, AN lk_poalim, AO lk_ochlin. Append new Kodesh art here. */
  MathMore:       ['1sLwjGZaNaxZV11VjEBeoNaxKcEo3URUj', '0800e737ad88aeadddebe51c59eb617d936292415c118553fdc1e77bfa117ce7', 202153],
  LifeMore:       ['1OUAXEX2DIRWEymOvkm8PEms9lLlI8x-r', 'db1173f395ade01ab592bed328aef3f8086f86891da6f16bd2a44144f5075e6c', 248164],   /* v228 (takeover4): = esti1@ CANDIDATE: + TL_LIFE_NAMES1 (names and family pass, 33 items) */
  HowToDo3:       ['1zEFDljpBG5oTcwndMEcy0tULRTfiHFnI', 'd3e6e94519053a3dc3de10397a54594b109c553b79b28eba28e1d0052ce0d48b', 1580725],   /* v351 (cloud builder 1): 05dd20ce + WOOD_B_DO fixed 3b857a0c + KITCH_A_DO + KITCH_B_DO at the END. WAS: */ /* v341 (takeover4): 291e771d + esti2@ HB1 v2 TL_DO (4af356b8) at the END. WAS: */ /* v325 (takeover2): 6a1dde0b + esti2@ C2v4 TL_DO (ca1cc690) + HB2v3 TL_DO (c4d0ef55) at the END. WAS: */ /* v314 (claude-code-builder-2): live ba1f72ae + esti2@ CHU L02 C1 v4 TL_DO (102 boxes), appended at the END. WAS: */   /* v311 (cloud builder 1): takeover2 v310 9ac3254b + 3cc@ TL_ELEC_STUDIO_WOOD_A_DO (66 boxes) at the END (HowToDo2 is at the upload size) */
  KindsMore:      ['1JyDo-8rr9wkDGGlcW_wwKdEoQt45M_wR', '86a639eb467556fe382d566d3dd64e44942b45a09872c06576987a7d8c9ae786', 2129119]   /* v312 (takeover4): v307 pack cf7da827 minus the 18 takeover4 Kodesh blocks, which moved to KindsMore3 (2.76 MB -> 2.13 MB). Nothing else changed. WAS: */   /* v307 (takeover4): v304 pack 31069d79 with my blocks: TL_SRC v2 206 sources (+23 Kriyah, +4 Chumash L9) so EVERY Kodesh lesson opens on its real text (334/334), + TL_TEACH CHU9 (LK.CHU.L09.01-04, set only where no lesson exists) so every Kodesh skill has Teacher Time. WAS: */   /* v304 (takeover4): v301 pack 3af8e495 with my blocks swapped: K3 audit round 3 (siddur, Shulchan Aruch, Kitzur, Mishnah Sukkah/RH/Taanis, Onkelos): Asher Yatzar source re-cut from Siddur Ashkenaz (cholams were missing), נְטִילַת יָדָיִם, Onkelos מָה מָמוֹן. WAS: */   /* v301 (takeover4): v300 pack f46fcb9f with TL_K2_HEB K3TT added (full-text audit of 2,291 Kodesh quotes vs Sefaria Torah+Mishnah+Gemara+Nach: 1,523 exact, 1 error fixed: מְזוּזָה מִיָּמִין, Shabbos 22a). WAS: */   /* v300 (takeover4): v298 pack 856fe0d5 with my blocks swapped: TL_SRC v2 (179 real sources from Sefaria, +37, so every Kodesh lesson outside Kriyah opens on its real text: Chumash L2-L4/L10, Rashi, Gemara, Mishnayos, Tefillah, Navi, Parsha, Yom Tov; tzevaos written צְבָקוֹת), TL_TEACH NAV + YT rebuilt with that fix, TL_K2_HEB dictionary fixes nelech=נֵלֵךְ, mitzvos=מִצְוֹת. WAS: */   /* v298 (takeover4): live v295 pack 908e4e98 with ONLY the TL_K2_HEB block swapped to v4 (K3: prefix+word only from a checked table of 37, fixes 13 wrong forms like הַיוֹם; Gemara/Rashi/Mishnayos restricted pass: letter names, final letters, דִּבּוּר הַמַּתְחִיל, pshat/drash/terutz/kushya/nekudos). WAS: */   /* v295: v291 6e4acc96 + 5cc@ SS VARIETY L1 + L2 + 1cc@ FIX10. WAS: v291: v288 pack ccca436c + 5cc@ LANG K2 + READ H1V2 + 1cc@ FIX9. WAS: v288 (rabbikhaver cloud builder 2): v287 pack 6e4e95dd + at the end 5cc@ TT VARIETY D, E, F, G1, G2, H1, H2 v2, I1, I2, I3, J, K1 + 1cc@ QA FIX2-FIX8. WAS: v287 (takeover4 via rabbikhaver cloud builder 2): live v284 pack 06a95f48 + Kodesh K2 fixes + TL_HOWFILL (1,754 Kodesh How-to boxes) + TL_OFFTAP v6 + 147 Torah Tracks TL_TEACH + TL_SRC 142; Math Variety A/B/C and QA FIX1 kept at the end. WAS: v284 (rabbikhaver cloud builder 2): v280 pack 5931b916 + 5cc@ TL_TEACH_MATH_VARIETY_A (fd54816f) + B (db42ef82) + C (240d4aee) + 1cc@ TL_QA_1CC_FIX1 (d6fa5702), appended at the end. WAS: v280 (takeover4): v279 + esti2@ C10 Chumash Level 11 (LK.CHU.L11.01-.03: Sifsei Chachamim, Mizrachi and Gur Aryeh, Why Rashi Chose This Pshat; 51 items + TL_DO + 3 TL_TEACH, K1-K2-K3 native) + names of sefarim and meforshim protected in TL_K2_HEB. Earlier: TL_K2_HEB v3, K3 fixes, TL_SRC 137 sources, CHU5-8 Teacher Time */,
  KindsMore3:     ['1CM2wKnRLMtfwO5QNlAIqpqJ91DjXK8TH', '7345f633fd85f63c6ca6a1a6824f5ba91fefe82edf220d4e80e3116dc83174a2', 1091909],   /* v353 (takeover4): 3479926e + esti2@ TL_KODESH_TEACH_TEF12 (8eed02e2) + TEF3 (fed03795) at the END: Tefillah L01-L03 Teacher Time, 13 lessons. WAS: */ /* v341 (takeover4): 1bc59f83 with TL_SRC v3 (+18 Chemdas LK.CHEM real-text openings, 269 sources) + esti2@ HB1 v2 TL_TEACH (8200ee84) at the END. WAS: */ /* v334 (takeover2): same as v331 6eb329dc, with the girl's name Shira restored in one WRIT.ESSAY.L07.03 item (HoS women rule reset). WAS: */ /* v330 (takeover2): cb583492 + TL_NK_HANDS1 (16 ELEC.F, LANG, WRIT skills) + TL_CR_HANDS1 (55 Kodesh skills LK.CHU L05-L09 + LK.KRI: move off tap, Hebrew exact copies, K2 strict) at the END. WAS: */ /* v325 (takeover2): 8d57bf69 + esti2@ TL_KODESH_TEACH_HAL12 (1d95e4fe) + HAL3 (67d34c95) at the END. WAS: */ /* v312 (takeover4): the Kodesh blocks moved out of KindsMore, joined last after KindsMore2: TL_KODESH_TEACH CHU5-CHU11 + CHU9, Torah Tracks TL_TEACH (NAV MID HALTEF YT PAR0 PARA PARB), TL_HOWFILL, TL_K2_HEB v4, TL_SRC v2 (251 sources incl. 45 Lashon Hakodesh). */
  KindsMore2:     ['1gOyezhKcZ2RjZn_9G1os3aqZxQbyEL5i', '952dade6dcd411190110ec4f698587cb0b6875c9d5ee62aebabb3a5a7f3dfd16', 1732989]   /* v347 (cloud builder 1): v335 pack edca45cf + at the END 5cc@ TL_TEACH_SS_TEACH_2 v3 (41 SS.HIST+JHIST) + SS_TEACH_3 (19 SS) + ELEC_TEACH_1 (7 Fact Finders) + 1cc@ FIX24-25 (31 tries) + D_FIX12-14 + E_FIX1-4 (Science). WAS: */ /* v335 (cloud builder 1): v329 pack ea706a0e + at the END 1cc@ B_FIX15-17 (ELEC SPEAK ART MUS practice mix) + C_FIX6 v2 + C_FIX7 (57 Teacher Time tries) + D_FIX9-11 (LIFE WRIT practice mix). WAS: */ /* v329 (cloud builder 1): v326 pack 53accf48 + at the END 5cc@ Teacher Time E7 (FUSA+FWORLD 26) E8 E9 E10 (NUC 57) + 1cc@ TL_QA_1CC_FIX22 (31 short boxes) + FIX23 (5 sister boxes). WAS: */ /* v326 (cloud builder 1): takeover2 v325 pack ce015c7e + one ELEC.SPEAK Teacher Time line reworded (E4: 'The and and are not' read as a doubled word; 1cc@ LANE C NOTE 1537) */
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
