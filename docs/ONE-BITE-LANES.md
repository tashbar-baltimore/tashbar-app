# One Bite: lanes (who does what)

> **ROUND 2 IS NOW THE PLAN (HoS, 2026-11-21 evening): short, hands-on, made for each age. Start with Kindergarten Math and the ABCs.** Read `docs/ONE-BITE-ROUND2.md` first. Round 2 lanes: **A** = the Activity Kit (`src/OneBite.html` + `src/OneBiteKit.html`), **B** = K–1 Math activities (`src/OneBiteDataMath.html`), **C** = K Reading, ABCs first (`src/OneBiteDataRead.html`).

Each lane edits **only its own files**, so 2–5 Claude accounts can work at the same time with no overlap. Before you start, add a line under "Taken" with the date and your account. When you stop, write where you got to.

| Lane | Files it owns | Work |
|---|---|---|
| **A · ob-core** | `src/OneBite.html`, `tests/lib/onebite.js`, `tools/audit/*`, `docs/ONE-BITE-*.md` | The player, switches, tests, staff "Teach it at the board" cards, stuck groups, per-bite signals |
| **B · ob-math** | `src/OneBiteDataMath.html` | Hand-written bites for every Math skill, K–8. Most-used levels first (L02–L05), batches of 25–40 per PR |
| **C · ob-literacy** | `src/OneBiteDataRead.html`, `src/OneBiteDataWrit.html` | Reading, phonics, Writing and Language. Do **not** edit `READ.*` packs: the Reading-level rebuild lane owns them. Write bites for skills that have no open Reading PR |
| **D · ob-kodesh** | `src/OneBiteDataKodesh.html` | Kriyah, then Chumash, Mishnayos, Gemara and Torah Tracks. Copy Hebrew by script from the lesson data or source texts. "REBBE: review after live" |
| **E · ob-more** | `src/OneBiteDataMore.html` | Science, Social Studies, Life, Computing and Electives |

**Other lanes running now:** the "One button, one job" simplify lane (PR #130, `docs/SIMPLIFY-AUDIT.md`) owns LearnFlow, QuestPage, Activities, JokeJar and the home. Its fixes are the look for any lesson not playing as a bite. One Bite never edits those files. The Reading-level rebuild lane owns the `READ.*` packs.

If a data file grows past about 400 KB, start `OneBiteDataMath2.html` and register it in `Photos.js` (msQuestToolsBody_) AND `Speed.js` (TL_PART_FILES), in the same order, before `OneBite`.

## Taken
- 2026-11-21 · Lane A · this session (Enterprise account): audit, playbook, player v1, 12 pilot bites, tests.
- 2026-11-22 · Round 2 Lane A · this session: **Activity Kit done** (`src/OneBiteKit.html` + player in `src/OneBite.html`): all 10 activity types, 3-in-a-row exit to Show me, fallback cap 2 + 5, K1 wiggle break and celebration, read-along, "tap the reason". Schema: `docs/ONE-BITE-PLAYBOOK.md` section 10. Tests in `tests/lib/onebite.js` check every `do`/`your` activity, so `node tools/audit/ob-quick.js` tells Lanes B and C exactly what to fix.
- 2026-11-21 · Lane B (started by the Lane A session): Math K–2 done. All L01–L03 skills have hand-written bites (65 bites in all, counting the pilots). **Next for Lane B:** L05 (MATH.OPS.L05.01, MATH.FRAC.L05.02), L07 (MATH.ALG.L07.04), L09 (MATH.ALG.L09.01/.02/.04, MATH.FUNC.L09.02), then any Math skill the map plays that has no bite (`Object.keys(GEN).filter(id => !ONE_BITE[id])`).

- 2026-11-22 · Round 2 Lane B (K–1 Math activities) · this session: `do`/`your` hands-on activities for every `MATH.*.L01.*` bite (batch 1), then `L02` (batch 2). Batch 1 (L01, 16 bites) and batch 2 (L02, 21 bites) are written; all K–1 Math bites now have `do`/`your`. The activity data shapes are written at the top of the Round 2 block in `src/OneBiteDataMath.html` for Lane A's kit.
  - Batch 3 (Grade 2, `L03`, 18 bites): `do`/`your` for every `MATH.*.L03.*` bite, plus a chant or move and short Watch Me steps where a check asked something not shown. Batch 4 (Grade 3, `L04`, 23 bites): whole new bites (every `MATH.*.L04.*` skill had none) with `do`/`your` activities. **Next for Lane B:** the round-1 leftovers L05 `MATH.OPS.L05.01`, `MATH.FRAC.L05.02`; L07 `MATH.ALG.L07.04`; L09 `MATH.ALG.L09.01/.02/.04`, `MATH.FUNC.L09.02`.
- 2026-11-22 · Round 2 Lane C (K Reading, ABCs first) · this session: built the 6 ABC lessons (#161, took over #153) and the other 10 K Reading lessons (#170). **Quality round (HoS, night of 2026-11-22): all 16 of my K lessons reworked and independently reviewed, every point 4+:** READ.PA.L01.01–.06 (#194, min score 3→4), READ.PHON.L01.02–.04 + READ.FLU.L01.01 (#195, 3→4), READ.PHON.L01.01.a–.f ABCs (#197, 2→4; also fixed the live error "box starts with x"), then Watch Me / Teacher Time say every letter sound aloud (quality4). Never-taught count 868 → 853 over these PRs. **Still a 4, not a 5:** the ABCs model say-it-slowly only in the guided first activity (Watch Me is kept to 5 steps). **For the Reading pack owner (Show me questions):** Rhyme check 3 is yes/no; Short Vowels checks never test e or i; Snap Words "spelled right" checks never name the word; Book Explorer 🌱/🌿 order is hard to see. **Next for Lane C (K):** a stricter "only 5 counts" pass. Levels 1 COMP and 2+ belong to the second Lane C session; Writing to Lane C2; Gr 2–8 Reading to Lane C3.
- 2026-11-22 · Round 2 Lane C (K Reading, ABCs first) · this session: took over PR #153 (an earlier session's ABC split) on branch `claude/ob-read-abc`. Batch 1 = READ.PHON.L01.01 split into 6 ABC bites `.a`–`.f` (A–D, E–H, I–L, M–Q, R–U, V–Z), each a real lesson + a bite with `do`/`your` in the Activity Kit's exact shapes (listen, trace, findall, match, tiles). The old id stays as the ABC Review after `.f`; a boy who mastered it counts `.a`–`.f` as mastered. **Next:** READ.PA.L01.01–.06 (branch `claude/ob-read-k-pa`), then READ.PHON.L01.02–.04, READ.FLU.L01.01, then L02.
- 2026-11-22 · Round 2 Lane C, second session (`claude/serene-hopper-b1z4d9`): QUALITY ROUND (HoS 2026-11-22 night), **stopped 9:00 AM ET**. My 14 lessons: READ.COMP.L01.01–.02 and the 12 Level 2 Reading lessons (Grade 1). Live: #188 (9 phonics lessons), #189 (5 story lessons), #190 (stricter pass on all 14), #191 (4 never-taught checks taught, 858 → 854; spoken sounds spelled as sounds). PR 5 raises Story Listener, Read smoothly and Endings toward 5. Before → after (independent reviewers, lowest score per lesson): before the round, most lessons had 2s–3s (no explicit teaching, plain choices, check words never shown); now every lesson is 4+ on all 9 points, and 9 of the 14 have mostly 5s. Nothing of mine is under 4. Also: an independent review of the other Lane C session's K lessons is in #166; that session is reworking them (#194, #195, then the ABCs). Next: push the remaining 4s to 5 (most are 'taught then asked' and 'progression'); the READ.* pack problems the reviewers found are listed in #190 for the Reading-level lane. Earlier Level 3–6 drafts are NOT shipped (Lane C3 owns L03–L09).
- 2026-11-22 · Round 2 Lane B (K–1 Math), follow-up · this session: checked all 37 L01 + L02 bites against the kit and the round-2 rules (activities, 2+ kinds, no repeats, 3 choices at most, a song or movement, spoken lines). All pass. Fixed the last 4 checks the bites did not show: in front of / behind (MATH.GEO.L01.02), which row has more (MATH.NUM.L01.04), writing 107 (MATH.NUM.L02.01), and "some, then 7 more, makes 16" (MATH.OPS.L02.09). **Stopped here: K–1 Math (L01 and L02) is done.** Next for Lane B: Grade 2–3 (L03) `do`/`your`, read-along band.
- 2026-11-22 · Round 2 Lane B2 · this session: Math Grades 4–8, `src/OneBiteDataMath2.html` (MATH.*.L05–L09: full lessons with `do`/`your` activities). Started: the file is registered, with the first 4 L05 lessons.
- 2026-11-22 · Round 2 Lane D (Kodesh, Kriyah first) · first Lane D session (stopped 2026-11-22 ~8 AM ET). Owns `LK.KRI.L01.01.a`–`L01.04.a`, `LK.KRI.L03.*` and the non-Kriyah K–2 Kodesh lessons; the second Lane D session owns L01.05–L01.08 and L02. **Quality round, independently reviewed:** Aleph-Beis 1–8 LIVE (#187), min score 2–3 → every score 4–5. Grade 2 Kriyah 3-2 sneaky Patach, 3-3 Mapik Hei, 3-5 tricky dots: min 2 → every score 4–5 (PR claude/ob-kodesh-q-gr2a). **Open:** 3-1 short-o T is reworked and passed review, but on the phone the app font draws the short-o T (U+05C7) the same as a plain Kamatz, so it is held. needs HoS/Lane A: a font (or kit style) that shows the Kamatz Katan's longer leg. 3-4 middle Sheva is reworked; its last fix needs one more review round. 3-6 to 3-10 scored min 2 and are not reworked yet (the reviewer asked for: new words in the later activities, a find-it-in-the-pasuk step, an oops sort per lesson, and no long unreadable phrase matches). K Tefillah/Halacha/Middos/Navi (12) are rebuilt after review (named boy, picture cards, ✅/❌ Mistake Detective sort, 3 content errors fixed: shoes card, Shmuel's words, morning card); the re-review was cut off by the usage limit, so they are NOT shipped. K Chemdas/Parsha/Yom Tov and Gr 1 Tefillah/Halacha/Middos/Navi drafts exist but have not been reviewed: do not ship them as they are. **Next:** re-review the K Kodesh 12 and 3-4, rework 3-6 to 3-10, then the other drafts, each through the independent reviewer. REBBE: review after live.

- 2026-11-22 · Round 2 Lane C3 · Reading Grades 2–8, `src/OneBiteDataRead2.html` · this session: full lessons plus `do`/`your` activities for `READ.*.L03`–`L09`, in batches (L03, L04, L05–L06, L07–L09). Setup PR: the new file, registered in Photos.js and Speed.js, with 5 Grade 2 lessons. **Display limits learned from the pictures:** an activity's `q` shows very big (keep it 46 characters or fewer); findall cells fit 4 letters; listen choices fit about 14 characters; match sides about 16 characters.

## Starter prompt for a content lane (paste into a new Claude Code session on `tashbar-baltimore/tashbar-app`)

```
You are a builder on the Tashbar One Bite overhaul. Read CLAUDE.md, CONTRIBUTING.md, docs/ONE-BITE-BRIEF.md,
docs/ONE-BITE-PLAYBOOK.md and docs/ONE-BITE-LANES.md first. They are binding.
Your lane: <B ob-math | C ob-literacy | D ob-kodesh | E ob-more>. Add yourself under "Taken" in docs/ONE-BITE-LANES.md.
Edit only your lane's data file.

The job: write hand-written ONE BITE lessons (window.ONE_BITE['SKILL.ID'] = {...}) for the skills in your lane, in batches of 25–40 per pull request.
1. Get each skill's real content first:
   IDS=<comma list> node tools/audit/dump.js   (writes tools/audit/out/dump.json: Teacher Time, the How-to lines, and every question with its answer)
   node tools/audit/teaching-audit.js           (tools/audit/out/data.json: all lessons, with the count of never-taught checks)
   Start with the skills that have the most never-taught checks in your lane, and the most-used levels.
2. Write each bite to the playbook:
   - band; a today line of 10 words or fewer; why; a 2-question ready check on the skill it stands on, plus a real bridge skill id;
   - a worked example of 2–5 steps with at least one visual model (tenframe, line, blocks, fbar, tiles, emoji, scene, chant, move);
   - oops (wrong, right, why); at least 2 ways; done; board (one, activity, 3 mistakes).
   Make sure every check question in that lesson can be answered from what the bite shows. Use the exact words the check needs.
3. Check it: node tools/audit/ob-quick.js (it must pass), then
   OB=test IDS=<2 of your ids> node tools/audit/play-shots.js, and look at the pictures in tools/audit/out/shots-ob/.
4. Run node tests/run.js. It must pass, and the "check questions whose answer is never taught" count must go DOWN.
   Then update tests/baseline.json to the new lower number (UPDATE=1 node tests/run.js).
5. Open the PR: one batch per PR, branch claude/ob-<lane>-<batch>. In the PR list: the bites added, the ways used,
   the never-taught checks fixed, and 2 phone pictures. The PR goes live by itself when the tests pass.
6. Add a CHANGE note to the Drive HQ LOG (folder 1NOL4XyWQgf5wm60gGNbmVG6ujY6RBIGS) and send the HoS one plain line.
Rules: modest, warm frum family life; a wide mix of names; kosher food. Never the Divine Name (ה׳, אלקים). No real student data. No // in .html.
Don't wait for approval. Keep going batch after batch until your lane is done or you near 75% of the weekly usage limit.
Then write where you stopped under "Taken".
```
