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
var TL_PACK_STAMP = 'v383-k3v19-st1-g8c-alg1-rd5';   /* bump with every TL_PACKS change, so PACK HEALTH is rewritten at once */
var TL_PACK_FOLDER = '1hA-VSPnck5gCAuJYUB_yhPI3y2RvnOT_';
var TL_PACKS = {
  KLessons:   ['1htzdnzpHubUikC_DsFhwEfufByfDYnp6', '9b5a3e35345d1402e18361f31059289a0e95361494b5f928f33514c3f324c1d4', 110409],   /* K3 lessons v19 (Claude Code builder, HoS session 2026-11-18) */
  KReading:   ['1VkWmiGHz3085PfwFa09U0KpqatTUVJPT', '5fab2a455984a51f1d86c92bfcc834ba9044c5e9883e0cc80c6a9a68dec82483', 137957],   /* K3 lessons v19 (Claude Code builder, HoS session 2026-11-18) */
  KKriyah:    ['1jL5af8T_XlmYxeH2umXNgNx95jVgSQI2', '249442b9d82d7636c53f5f8e20fa3a442bf483650c8623daa959fe6feaf7ee4c', 398966],   /* K3 lessons v19 (Claude Code builder, HoS session 2026-11-18) */
  G1Math:     ['11MMTI8ENyJveUKojya0K6cxlmWy7TbIW', '4475cb33a9531e22a521a20275f0d86623422e1c4468c03f29e43378fed230a0', 146864],   /* K3 lessons v19 (Claude Code builder, HoS session 2026-11-18) */
  G1Reading:  ['1DzMWeol6HusGO9OqjYoiA1el4lmR7QBJ', '79318231e841b165159c2d531b8dc11c70e478f6e66f468892ea53a0565df025', 162520],   /* K3 lessons v19 (Claude Code builder, HoS session 2026-11-18) */
  G2Math:     ['github-only', '3c38135ab9ad6bb1a5efc60a5ddd16780929b04aae5d1d07e302de9feb2f0367', 203115],   /* K3 lessons v19 (Claude Code builder, HoS session 2026-11-18) */ /* + trade ten PV.L03.02, OPS.L03.01-02 (2026-11-20) */
  G2Reading:  ['github-only', '3c302a7445c944c447b60fc7d31276736ac00989f656d008c3c1b069068070d3', 228193],   /* K3 lessons v19 + deep comprehension READ.COMP.L03.01-03 (Claude cloud builder, 2026-11-20) */
  G3Math:     ['github-only', '92c269db660952760ec0f5ad8a3a3ec878e4186ff6b090730c4192154b90df0f', 246993],   /* K3 lessons v19 (Claude Code builder, HoS session 2026-11-18) */ /* + equal groups OPS.L04.04, .07, .02 (2026-11-20) */
  G4Math:     ['github-only', '123d302e490ab62bd1ee95a0298ad9a647983d1cabd9fd27bcf17e1f36417b8f', 306915],   /* 2026-11-20 4th Grade Math, 18 lessons on the K-3 lesson engine (Claude Code, yosef@ session); lives only in GitHub packs/; deep fractions FRAC.L05.01-03 (Claude cloud builder) */
  G5Math:     ['github-only', 'c689f7f97e7ea1c332c59a104814e279981192df307e96511dc6b2c86cf2aa37', 324924],   /* 2026-11-20 5th Grade Math, full 8-station lessons on the K-3 lesson engine (Claude Code, yosef@ session); lives only in GitHub packs/ */
  G6Math:     ['github-only', '5089fb22e91cdc8bce957e41091f2355f657fa88e0835e063d227b43a7825307', 334682],   /* 2026-11-20 6th Grade Math, full 8-station lessons on the K-3 lesson engine (Claude Code, yosef@ session); lives only in GitHub packs/ */
  G3Reading:  ['github-only', 'a3a8f852691a5c2c9b329ed3d4de8f369c3d4a9dd689d84c2b5a229506c908a8', 244138],   /* K3 lessons v19 (Claude Code builder, HoS session 2026-11-18) */ /* + read between the lines VOC.L04.01, LIT.L04.01-02 (2026-11-20) */
  KLearn:     ['1DH2pjtvG0DyfT6KUdnsw3FrHD7rF8CZm', 'cb33bddaadd34404d2637cd2f32b4f3d27b4845474432ffc59ce1f1c95f0e16b', 18377],   /* K3 lessons v19 (Claude Code builder, HoS session 2026-11-18) */
  KScience:   ['1XSUSORlAxQVq7LkD7-r6ZtOomiZv2eLt', 'e303f8707b8e29c19a6a6afb64a01ff158aadcbce18d7d494364236e7d2d0f4a', 128685],   /* K3 lessons v19 (Claude Code builder, HoS session 2026-11-18) */
  KWriting:   ['1YR5nV-vdq4ziknnA76w5JFkLF1syjOPh', '6d0c675511cace61e1bacb827813342a335e2608c05781a1809097ed5c387e4f', 120051],   /* K3 lessons v19 (Claude Code builder, HoS session 2026-11-18) */
  G1Science:  ['1QZS5qwUsXS4Rqx8NWmjp2CUdeFM8moSC', '00fc889cdcdc045af82331ae03af811d77d2c33cfcebc818e9770e8726ff8dbb', 148977],   /* K3 lessons v19 (Claude Code builder, HoS session 2026-11-18) */
  G1Writing:  ['1gGHGLgPVOtRe6U57RDqQfxgsDsnqRRxV', '49b94a466fd8f78326c6c74aa277129cfd6ede21b126111332337c2f541cf57b', 135038],   /* K3 lessons v19 (Claude Code builder, HoS session 2026-11-18) */
  G2Science:  ['1vtew20pLdu4CsI1XrKflYENWXQii2_FP', '7559722d5106787befb86e660c52737ceb18d47681e19b044b92b6aaeafd206a', 150375],   /* K3 lessons v19 (Claude Code builder, HoS session 2026-11-18) */
  G2Writing:  ['1NQM-JHc0KEwCQLv1sv69i1B8n_VVBrOb', '0685fffb706daa8137041327af94ef6eb5dba83210553102e35528e12f993495', 147078],   /* K3 lessons v19 (Claude Code builder, HoS session 2026-11-18) */
  G3Science:  ['1sFK6YeInMDZHa0uvW1W2HHSXJRPofe4T', 'eac8f520b2425cf4172165d31492ea59a7de04cc8169a9fd3116986414c993dc', 153367],   /* K3 lessons v19 (Claude Code builder, HoS session 2026-11-18) */
  G3Writing:  ['1rDDClNs2ehLMbdK8TocTw10ImOc-9jRC', '7102123af11bd740cd2dade46c3e82f8fdd8ad381f9072b040742cf26ab8aeef', 158757],   /* K3 lessons v19 (Claude Code builder, HoS session 2026-11-18) */
  KElectives: ['1nbxgYwdiBMTG5De_gyD73ucIyXDoKaIZ', '2bbd0a788530e7d8462cdee3dcfc7d5863f28784b51edcbd4aab0755d0abcd0e', 161796],   /* K3 lessons v19 (Claude Code builder, HoS session 2026-11-18) */
  /* name:        [Drive file id,                         sha256 of the exact bytes,                                          bytes  ]
     v106: the SOURCE files exactly as written (served verbatim). Code copies removed from the project. */
  HowToDo:        ['1_T3-xObN0aTVWwF_yNtkN1GwAwtb7FX2', '7b39d5ef4beb2d9c28ae5291abad3ad3cd717905a5a0bd5b771b2d4502be48fc', 2591843]   /* v418 Curriculum Fix Stage 1 (yosef@ 1025-ET; C3 left out: a 4th check item made LIFE.FIN.L05.02 unmasterable) */,   /* v289: v255 pack 988f60cf + esti2@ K6 v3 DO + K5 v3 DO + C12 DO. WAS: v255 (Claude Code builder): v253 pack + esti2@ C2 v3 How-to v2 block, appended at the end.  WAS: v253 (takeover4): + esti2@ C3b How-to v2 */
  HowToDo2:       ['1GQr7DqyyqUoLi8FPTJRX0gmH08wbPXjY', '065d0cd8d512a40d4097697a2ef86447a36205885dfc760b23e01694480216d6', 3025633]   /* v418 Curriculum Fix Stage 1 (yosef@ 1025-ET; C3 left out: a 4th check item made LIFE.FIN.L05.02 unmasterable) */,   /* v292 (takeover2): = 9fe22ed1 with KODESH BIG v4 (sefer words: Hebrew form above Rashi, pasuk, Mishna...; 27 labels, exact Sefaria copies). WAS: */   /* v290 (takeover2): v289 bcc5109f + KODESH BIG v3 + TL_TEACH RAS/MSH v2 (K1 text first, K2 Hebrew in Hebrew) + TL_KODESH_K2 (305 items, 264 boxes, names) + MOVEOFF1 v2. WAS: */   /* v289: v286 pack 55f9865d + esti2@ HB3 v2 DO. WAS: v286: v282 pack d27293bb + 3cc@ KNOT A DO (66, names fixed) + BEAT A DO (66). WAS: v282 (rabbikhaver cloud builder 2): v272 pack fa70aba1 + 3cc@ TL_ELEC_STUDIO_DO v2 (544 How-to boxes, Electives Studio 24 skills), appended at the end. WAS: v272 (takeover2): live 41e1eff5 + TL_KODESH_MOVEOFF1 (Rashi 29 + Mishnayos 28 practice off tap, 434 How-to boxes) + KODESH BIG v2 (replaces v1 in place: big Hebrew on sort/match/spot cards, uniform tiles, no stray emoji on hands-on Kodesh cards). WAS: */   /* v269 (takeover4): live dbf13366 + esti3@ MOVEOFF_GEM2..GEM8_DO (230 boxes) */
  ScienceMore:    ['1Zt3SMoTOddVBxPKdg9weA2cl96oYNdjO', '1048370760a0aade5d8aaef79d5bfbf6e1e7e4dd0e026de1df6c8112d158ad10', 3081753]   /* v418 Curriculum Fix Stage 1 (yosef@ 1025-ET; C3 left out: a 4th check item made LIFE.FIN.L05.02 unmasterable) */,   /* v229 (takeover4): = esti@ one-step candidate cand31: + TL_SCI_L6A/L6B/L6C + LGA/LGB/LGC (JOKEFIX last); all 132 Science skills hand-written */
  ScienceMore2:   ['1Bs92K6biY2Lquejgl4xkdFJ02OQKR4BH', '7e106dafd8e3c438ced9bbde7b22e233325399fb5773120d0a0d67a63ca720aa', 1759138]   /* 2026-11-19 (HoS chat): + TL_SCI_G8C, Science grade 8 last 3 units, 12 skills (PLANT/BODY/MATT L09). WAS: 98776a1e. */   /* v416 (rabbikhaver-cloud-builder-3): + G7BA + G8SN + G8BS + G8RH */   /* v388 (rabbikhaver-cloud-builder-3): + esti1@ G7FW Food Webs + G7RC Rock Cycle + G6HH Healthy Habits */,   /* v383 (takeover4): NEW. esti1@ Science grades 6-8: G6LS G6GB G6PK G6GO G6SL G7AC G7WC G7CU, each byte for byte (G6PK G6GO G6SL G7AC G7WC = FIX1). Joined after ScienceMore (too big to add to it). */
  ElectivesMore:  ['1Jr0-AF1vpW8Nj8SWejPxgC_oMaKksNMp', '5d8ede2f6ab0fda10350180e24feaf05f94aa84e20b9d41cf6dcc944982a34c0', 2319312]   /* v418 Curriculum Fix Stage 1 (yosef@ 1025-ET; C3 left out: a 4th check item made LIFE.FIN.L05.02 unmasterable) */,  /* v351 (cloud builder 1): takeover-3cc 60c1482d (v311 fe0e6fc7 + WOOD_B + art v8) + 3cc@ KITCH_A + KITCH_B + TL_CB1_KITCH_FIX1 + art_elec_studio v10 (48 pieces). WAS: */ /* v311 (cloud builder 1): 079623bb + 3cc@ TL_ELEC_STUDIO_WOOD_A (new course Woodshop Basics .01-.03; girls' names swapped for boys') before the Thinking and Arts wiring + art_elec_studio v7 (39 pieces) replacing v6 */
  ComputingMore:  ['1k0PTnhrWbciW1efdr-sPYalOPBLLNmCI', '7e714dcf653d5e7a31dbb46d72543fd46b2b128c020aaba8e31013c2e3f04813', 843550]   /* v418 Curriculum Fix Stage 1 (yosef@ 1025-ET; C3 left out: a 4th check item made LIFE.FIN.L05.02 unmasterable) */,   /* v234 (Claude Code builder): live v218 pack + esti1@ TL_COMP_NAMES1 (names and family pass, 69 entries), pasted before the subject wiring.  WAS: v218 (takeover4): v185b + esti1@ TL_COMP_ART1-3 (538 drawn cards) + TL_COMP_HINT1 */
  ReadMore:       ['1RxLm4CPbs8iGcgHsmZ96UrQpe3brVynd', 'c942f40199d55aec9d1b552e6ff5bddabc2f5c615ec60e098037c68c772e52bc', 730349]   /* v418 Curriculum Fix Stage 1 (yosef@ 1025-ET; C3 left out: a 4th check item made LIFE.FIN.L05.02 unmasterable) */,   /* v257 (Claude Code builder): = esti1@ CANDIDATE: + TL_READ_NAMES3 (29 items) + TL_READ_NAMES4 (91 items, 32 stories).  WAS: v234 (Claude Code builder): = esti1@ CANDIDATE: + TL_READ_NAMES2 (Writing names pass, 54 items).  WAS: v229 (takeover4): = esti1@ CANDIDATE: + TL_READ_NAMES1 (Language Arts names; Magic E -> Silent E) */
  SocialMore:     ['1y1FJk3qoXzfdmeDmm-8JXX0Z_0DhKi3M', '89e7235357520d58d6ddeaf46972e93194420ec9d44f2ec07078d5651302c2c1', 1595561]   /* v418 Curriculum Fix Stage 1 (yosef@ 1025-ET; C3 left out: a 4th check item made LIFE.FIN.L05.02 unmasterable) */,   /* v381 (rabbikhaver-cloud-builder-3): = esti1@ CANDIDATE: + TL_SOC_ART1..ART9 picture slices (CHANGE 0045..0842).  WAS: v234 (Claude Code builder): = esti1@ CANDIDATE: + TL_SOC_NAMES1 (names and family pass, 21 items).  WAS: v218 (takeover4): v185b + esti1@ TL_SOC_HINT1 */
  KodeshMore:     ['github-only', 'c77e875e4eb491be12a968fef0c76d1579b04f22bf6399dff94134babf9aedbd', 2829873]   /* v418 Curriculum Fix Stage 1 (yosef@ 1025-ET; C3 left out: a 4th check item made LIFE.FIN.L05.02 unmasterable) */,   /* v369 (takeover4): 73a0f6bc + esti2@ K8v3 (5b3ebc7e) + HB4v2 (054624a3) + C4v4 (ac4f6407) code at the END. WAS: 73a0f6bc. */   /* v357 (takeover2): e00bb968 + esti2@ C3v4 Chumash L04 code (203aff49) + TL_KODESH_TEACH_CHU4 v2 (8cbd87d5) at the END. WAS: */ /* v341 (takeover4): 20d51138 + esti2@ HB1 v2 Lashon Hakodesh L01 Island Lessons code (105ec1b2) at the END. WAS: */ /* v325 (takeover2): f8dc548a + esti2@ C2v4 Chumash L03 code (1b7e5927) + TL_KODESH_TEACH_CHU3 v2 (7cab3f21) + HB2v3 Lashon Hakodesh L02 code (042fe0e2) + TL_TEACH HB2v3 (6766a263) at the END. WAS: */ /* v314 (claude-code-builder-2): live 9c334553 + esti2@ CHU L02 C1 v4 code + TL_KODESH_TEACH_CHU2 v2 + TL_KODESH_TEACH_KRI2B v1 (6 new Kriyah lessons) + TL_KODESH_TEACH_KRI4 v2, appended at the END. WAS: */   /* v295: v289 pack 5eee89e7 + esti2@ K7 v4 Kriyah L03.07-.10 brachos (overrides K7 v3). WAS: v289 (rabbikhaver cloud builder 2): v269 pack 30d37cdb + esti2@ K5 v3, K6 v3, HB3 v2 (override), KRI1/KRI2/KRI3 v2 Teacher Time (override v1), C12 Yom Tov L04 Chanukah + YT4 Teacher Time. WAS: v269 (takeover4): live e10a7c25 + esti3@ MOVEOFF_GEM2..GEM8 (Gemara L07-L09 off tap) */ /* + deep Rashi L04.04-05 2026-11-20 */
  FactsMore:      ['1Z_MseTjl_ORln-vcC1p3ISwZnbNgemtL', 'c9cd1e5862a5c019a94e152e92a617378fc4bbc52281ee8e0a02d99ee4271050', 274446],   /* v190: + QA 1114 Part B, Fact Finders hint rows only (8).  v173: + TL_FACT_KINDS1 (60 new-kind items, bands; takeover4). v161: Fact Finders K-12 lessons + home panel (CHANGE 0125-ET developer2@), loaded after ElectivesMore */
  FactsHowTo:     ['1Ctj3JLBjdT9T6Snizyajdz64Rt7QfhJl', '668ce00851fefef0a5be14e9891711fe0fcfb5e21db017ed294e81ad9a500ff5', 218438],   /* v191: + QA 1114 Part A Fact Finders box + TL_FF_BOX2 (2 misleading boxes).  v190: + QA 1114 Part A, Fact Finders box only (1).  v173: + TL_FACT_KDO1 (60 boxes). v161: Fact Finders How to do it (1,170 boxes), loaded after HowToDo2 */
  KodeshQuestPage: ['12OY5wQkrj_HbBdAYnqaT2_9u94_7qDYF', '63ad200ccc2805c266ff8c8d19dea04bd77d2f64d729be6d0db5a4bec1156a0a', 2829207]   /* v418 Curriculum Fix Stage 1 (yosef@ 1025-ET; C3 left out: a 4th check item made LIFE.FIN.L05.02 unmasterable) */,   /* v283 (rabbikhaver cloud builder 2): v281 pack a01dd943 + esti3@ E3-AD art_lk_neshech (a909c80e) + E3-AE art_lk_iska (caa509d0), appended. WAS: v281 (rabbikhaver cloud builder): v278 pack + esti3@ E3-AC art_lk_perek4 (BM perek 4 chazarah, paper cut-out, a53a7140) appended.  WAS: v278 (takeover4): v275 ab7ba342 + esti3@ K2-FIX-3 + FIX-4 (shulchani, maneh, perek3, shomer, shlichus v2 K2 in place) + new E3-AA lk_chamesh (BM 4:7-4:8 comic) + E3-AB lk_devarim (BM 4:9-4:10 retro posters): Mishnayos BM perek 4 art complete */
  KodeshArt2:     ['1bpsfhWh6o1vJxoXwFHuBPks7qU-lN5pa', '44f331560fb60aec3e726adc609b14b4cbdd900c0e04c3a8d74eb2f71c27874d', 761134]   /* v418 Curriculum Fix Stage 1 (yosef@ 1025-ET; C3 left out: a 4th check item made LIFE.FIN.L05.02 unmasterable) */,   /* v295: v291 9cfe40c5 + esti3@ E3-AR art_lk_shomrim. WAS: v291: + esti3@ E3-AP art_lk_ochel, E3-AQ art_lk_kotzetz. WAS: v285 (rabbikhaver cloud builder 2): NEW pack, joined right after KodeshQuestPage (Photos.js + Speed.js group, like HowToDo2) because KodeshQuestPage is at the upload size. esti3@ art E3-AF lk_tzon, AG lk_seah, AJ lk_umanin, AK lk_chamor, AL lk_mashkon, AM lk_perek6, AN lk_poalim, AO lk_ochlin. Append new Kodesh art here. */
  MathMore:       ['1rWD1VPv1zQF6y6OA1MnmXkSfGmS8G3u1', 'c1a8ee76fe046f25566fc4633650513946088274651e729a063880c5a5b1ecf0', 202180]   /* v418 Curriculum Fix Stage 1 (yosef@ 1025-ET; C3 left out: a 4th check item made LIFE.FIN.L05.02 unmasterable) */,
  LifeMore:       ['1HYZPkB8_ZwfzMijsFiE_W8S9O6c2kNYL', '7f214d32d8e55667d2f1dbe99cba0d0455d10deca7f9dbf07d11a1a5bf1a763d', 248201]   /* v418 Curriculum Fix Stage 1 (yosef@ 1025-ET; C3 left out: a 4th check item made LIFE.FIN.L05.02 unmasterable) */,   /* v228 (takeover4): = esti1@ CANDIDATE: + TL_LIFE_NAMES1 (names and family pass, 33 items) */
  HowToDo3:       ['github-only', '194b5f7296248f536a6284df99f1c8fec7e0ada56557879fd9956aac482de071', 2010168]   /* 2026-11-19 (HoS chat): + TL_SCI_G8CDO, a How-to box for every new question. WAS: 45e74d39. */   /* v418 Curriculum Fix Stage 1 (yosef@ 1025-ET; C3 left out: a 4th check item made LIFE.FIN.L05.02 unmasterable) */   /* v416: + G7BADO + G8SNDO + G8BSDO + G8RHDO How-to blocks */   /* v388: + G7FWDO + G7RCDO + G6HHDO How-to blocks */,   /* v383 (takeover4): a62b36fd + esti1@ eight Science 6-8 How-to blocks (G6LSDO G6GBDO G6PKDO G6GODO G6SLDO G7ACDO G7WCDO G7CUDO) at the END. WAS: a62b36fd. */   /* v369 (takeover4): 275aee90 + esti2@ K8v3 (808cbfab) + HB4v2 (f78e3ee5) + C4v4 (0fe02ad8) TL_DO at the END. WAS: 275aee90. */   /* v361 (takeover2): 73f9a26e + TL_MATH_STATIC2 (backup hands-on sets MATH.GEO.L06.02 and GEO.L08.02) at the END. WAS: */ /* v357 (takeover2): d3e6e945 + esti2@ C3v4 TL_DO (07369e85) at the END. WAS: */ /* v351 (cloud builder 1): 05dd20ce + WOOD_B_DO fixed 3b857a0c + KITCH_A_DO + KITCH_B_DO at the END. WAS: */ /* v341 (takeover4): 291e771d + esti2@ HB1 v2 TL_DO (4af356b8) at the END. WAS: */ /* v325 (takeover2): 6a1dde0b + esti2@ C2v4 TL_DO (ca1cc690) + HB2v3 TL_DO (c4d0ef55) at the END. WAS: */ /* v314 (claude-code-builder-2): live ba1f72ae + esti2@ CHU L02 C1 v4 TL_DO (102 boxes), appended at the END. WAS: */   /* v311 (cloud builder 1): takeover2 v310 9ac3254b + 3cc@ TL_ELEC_STUDIO_WOOD_A_DO (66 boxes) at the END (HowToDo2 is at the upload size) */ /* + deep Rashi L04 How-to boxes 2026-11-20 */
  KindsMore:      ['1Nb2DJwN23nssbL9fKpFfj9puC48Onfkl', '52b9f8b442b2cb4d2ca32a1acf0e900ef5ca4750bb973add4315e3f2800b6ed9', 2129641]   /* v418 Curriculum Fix Stage 1 (yosef@ 1025-ET; C3 left out: a 4th check item made LIFE.FIN.L05.02 unmasterable) */   /* v312 (takeover4): v307 pack cf7da827 minus the 18 takeover4 Kodesh blocks, which moved to KindsMore3 (2.76 MB -> 2.13 MB). Nothing else changed. WAS: */   /* v307 (takeover4): v304 pack 31069d79 with my blocks: TL_SRC v2 206 sources (+23 Kriyah, +4 Chumash L9) so EVERY Kodesh lesson opens on its real text (334/334), + TL_TEACH CHU9 (LK.CHU.L09.01-04, set only where no lesson exists) so every Kodesh skill has Teacher Time. WAS: */   /* v304 (takeover4): v301 pack 3af8e495 with my blocks swapped: K3 audit round 3 (siddur, Shulchan Aruch, Kitzur, Mishnah Sukkah/RH/Taanis, Onkelos): Asher Yatzar source re-cut from Siddur Ashkenaz (cholams were missing), נְטִילַת יָדָיִם, Onkelos מָה מָמוֹן. WAS: */   /* v301 (takeover4): v300 pack f46fcb9f with TL_K2_HEB K3TT added (full-text audit of 2,291 Kodesh quotes vs Sefaria Torah+Mishnah+Gemara+Nach: 1,523 exact, 1 error fixed: מְזוּזָה מִיָּמִין, Shabbos 22a). WAS: */   /* v300 (takeover4): v298 pack 856fe0d5 with my blocks swapped: TL_SRC v2 (179 real sources from Sefaria, +37, so every Kodesh lesson outside Kriyah opens on its real text: Chumash L2-L4/L10, Rashi, Gemara, Mishnayos, Tefillah, Navi, Parsha, Yom Tov; tzevaos written צְבָקוֹת), TL_TEACH NAV + YT rebuilt with that fix, TL_K2_HEB dictionary fixes nelech=נֵלֵךְ, mitzvos=מִצְוֹת. WAS: */   /* v298 (takeover4): live v295 pack 908e4e98 with ONLY the TL_K2_HEB block swapped to v4 (K3: prefix+word only from a checked table of 37, fixes 13 wrong forms like הַיוֹם; Gemara/Rashi/Mishnayos restricted pass: letter names, final letters, דִּבּוּר הַמַּתְחִיל, pshat/drash/terutz/kushya/nekudos). WAS: */   /* v295: v291 6e4acc96 + 5cc@ SS VARIETY L1 + L2 + 1cc@ FIX10. WAS: v291: v288 pack ccca436c + 5cc@ LANG K2 + READ H1V2 + 1cc@ FIX9. WAS: v288 (rabbikhaver cloud builder 2): v287 pack 6e4e95dd + at the end 5cc@ TT VARIETY D, E, F, G1, G2, H1, H2 v2, I1, I2, I3, J, K1 + 1cc@ QA FIX2-FIX8. WAS: v287 (takeover4 via rabbikhaver cloud builder 2): live v284 pack 06a95f48 + Kodesh K2 fixes + TL_HOWFILL (1,754 Kodesh How-to boxes) + TL_OFFTAP v6 + 147 Torah Tracks TL_TEACH + TL_SRC 142; Math Variety A/B/C and QA FIX1 kept at the end. WAS: v284 (rabbikhaver cloud builder 2): v280 pack 5931b916 + 5cc@ TL_TEACH_MATH_VARIETY_A (fd54816f) + B (db42ef82) + C (240d4aee) + 1cc@ TL_QA_1CC_FIX1 (d6fa5702), appended at the end. WAS: v280 (takeover4): v279 + esti2@ C10 Chumash Level 11 (LK.CHU.L11.01-.03: Sifsei Chachamim, Mizrachi and Gur Aryeh, Why Rashi Chose This Pshat; 51 items + TL_DO + 3 TL_TEACH, K1-K2-K3 native) + names of sefarim and meforshim protected in TL_K2_HEB. Earlier: TL_K2_HEB v3, K3 fixes, TL_SRC 137 sources, CHU5-8 Teacher Time */,
  KindsMore3:     ['1bkVME9xNteRyr-sqkwPEQhzRs_eIxcvt', 'bf7860412efb9574a12cf452b20038502d3a59ce52d4263fccf4f46bcf82836f', 1281294]   /* v418 Curriculum Fix Stage 1 (yosef@ 1025-ET; C3 left out: a 4th check item made LIFE.FIN.L05.02 unmasterable) */,   /* v369 (takeover4): 6f262e0d with TL_SRC v4 (+45 Chemdas Gr4 + KRI.L04.06.a), TL_K2_HEB sin fix, + esti2@ MID12 (f97438fb) MID3 (8b898e20) HB4v2 TL_TEACH (8caa5241) NAV12 (86d1768f) at the END. WAS: 6f262e0d. */   /* v357 (takeover2): 7345f633 + TL_BOMBS1 + TL_GEN_HANDS1 + TL_SIM_HANDS1 (33 BSimcha) + TL_PAIRS_DEDUP1 at the END. WAS: */ /* v353 (takeover4): 3479926e + esti2@ TL_KODESH_TEACH_TEF12 (8eed02e2) + TEF3 (fed03795) at the END: Tefillah L01-L03 Teacher Time, 13 lessons. WAS: */ /* v341 (takeover4): 1bc59f83 with TL_SRC v3 (+18 Chemdas LK.CHEM real-text openings, 269 sources) + esti2@ HB1 v2 TL_TEACH (8200ee84) at the END. WAS: */ /* v334 (takeover2): same as v331 6eb329dc, with the girl's name Shira restored in one WRIT.ESSAY.L07.03 item (HoS women rule reset). WAS: */ /* v330 (takeover2): cb583492 + TL_NK_HANDS1 (16 ELEC.F, LANG, WRIT skills) + TL_CR_HANDS1 (55 Kodesh skills LK.CHU L05-L09 + LK.KRI: move off tap, Hebrew exact copies, K2 strict) at the END. WAS: */ /* v325 (takeover2): 8d57bf69 + esti2@ TL_KODESH_TEACH_HAL12 (1d95e4fe) + HAL3 (67d34c95) at the END. WAS: */ /* v312 (takeover4): the Kodesh blocks moved out of KindsMore, joined last after KindsMore2: TL_KODESH_TEACH CHU5-CHU11 + CHU9, Torah Tracks TL_TEACH (NAV MID HALTEF YT PAR0 PARA PARB), TL_HOWFILL, TL_K2_HEB v4, TL_SRC v2 (251 sources incl. 45 Lashon Hakodesh). */
  KindsMore2:     ['1FyjqthwrSjzz4TyEHqP51II_mrH5jJMA', 'ea748bcc66435c08392d56b2636a8ec37c4ebd3c6f6ecd8ab24cea80d8f0d6ac', 1764390]   /* v418 Curriculum Fix Stage 1 (yosef@ 1025-ET; C3 left out: a 4th check item made LIFE.FIN.L05.02 unmasterable) */   /* v357 (takeover2): 952dade6 + 5cc@ T7 TL_TEACH_COMP_TEACH_1 (48897cff) at the END, after COMP_PIC_1/2. WAS: */ /* v347 (cloud builder 1): v335 pack edca45cf + at the END 5cc@ TL_TEACH_SS_TEACH_2 v3 (41 SS.HIST+JHIST) + SS_TEACH_3 (19 SS) + ELEC_TEACH_1 (7 Fact Finders) + 1cc@ FIX24-25 (31 tries) + D_FIX12-14 + E_FIX1-4 (Science). WAS: */ /* v335 (cloud builder 1): v329 pack ea706a0e + at the END 1cc@ B_FIX15-17 (ELEC SPEAK ART MUS practice mix) + C_FIX6 v2 + C_FIX7 (57 Teacher Time tries) + D_FIX9-11 (LIFE WRIT practice mix). WAS: */ /* v329 (cloud builder 1): v326 pack 53accf48 + at the END 5cc@ Teacher Time E7 (FUSA+FWORLD 26) E8 E9 E10 (NUC 57) + 1cc@ TL_QA_1CC_FIX22 (31 short boxes) + FIX23 (5 sister boxes). WAS: */ /* v326 (cloud builder 1): takeover2 v325 pack ce015c7e + one ELEC.SPEAK Teacher Time line reworded (E4: 'The and and are not' read as a doubled word; 1cc@ LANE C NOTE 1537) */,
  AlgebraAscent:  ['github-only', '476b38e655284e0c21d2f7211c3ca3323ac795a41ebfd830f09174654d721e00', 397154]   /* 2026-11-19 Algebra Ascent (73 lessons + 10 camp exams), drafted in a Claude chat; lives only in GitHub packs/ (no Drive copy): the Firebase server reads packs/ first */
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
