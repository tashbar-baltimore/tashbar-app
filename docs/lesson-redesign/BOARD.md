# New Lessons board (HoS 2026-11-27)

Every lesson moves to the new shape in `DESIGN.md` (THINK, LEARN, TRY IT, SHOW ME, DONE). This board lists the work, one row per job.
The prompts for builder accounts are in `PROMPTS.md`.

**What the HoS asked for:** "Redo the way lessons are taught. Much better informative graphics, interactive lessons and fun different ways to learn. Simple, quick, super kid-friendly language. Text easy and fun to read, laid out nicely, the words that matter highlighted. Hooks never repetitive, never the same three things. Fewer, deeper activities. Done in 1.0. Go live."

## How to claim (builders)
1. Read this file on a fresh `origin/main`, and list the open pull requests titled `New Lessons claim: …`.
2. Take the first `OPEN` row, top to bottom, that has no open claim pull request.
3. Open a pull request titled `New Lessons claim: <ID>` that changes **only your row**: status `TAKEN`, your session link, the time (UTC) and "where I am". It is docs only and goes live by itself.
4. Redo the row's lessons in batches of about 6–10 (one pull request per batch). Update your row each time you ship and when you stop. Mark it `DONE` only when every lesson in the row is live on main in the new shape.

**Stale:** a `TAKEN` row with no commit, no open pull request and no update for **6 hours** is `OPEN` again. The next builder carries on from where it stopped.

## Progress
_Lessons in the new shape: the test prints `newShapeLessons` (tests/lib/obquality.js). About 734 lessons have activities._

| Row | Job | Lessons (levels) | Files | Status | Owner (session link) | Last update (UTC) | Where I am / pull requests |
|---|---|---|---|---|---|---|---|
| P0 | Engine + 3 sample lessons | MATH.OPS.L03.01, READ.COMP.L05.05, SS.GEO.L07.01 | src/OneBite.html, src/UiKit.html, tests | DONE | https://claude.ai/code/session_015qpxB9anh6EkNUEJ97DHM5 | 2026-11-27 15:25 | Live: #635 |
| C1 | Coordinator fixes after the first play-through | MATH.OPS.L03.01 (hops) | src/OneBiteKit.html, src/MoneyShow.html, tests/lib/onebite.js | DONE | https://claude.ai/code/session_015qpxB9anh6EkNUEJ97DHM5 | 2026-11-28 07:20 | Live: #652 (hop `land:true`, banner on the top strip in lessons) |
| M1 | Math Grades 2–3 | MATH.* L03–L04 (about 40) | src/OneBiteDataMath*.html | TAKEN | https://claude.ai/code/session_01Cri5bRC4HsP9vYnMCURp1S | 2026-11-27 | Batch 1 (9 of 40): MATH.OPS.L03.02–.06 and MATH.PV.L03.01–.04 in the "New Lessons M1 batch 1" pull request (11 fresh reviews; final all 4–5). Next: batch 2 = MATH.MEAS.L03.01–.04, NUM.L03.01–.02, GEO.L03.01, STAT.L03.01 (drafted, not yet reviewed). Then the 23 L04 lessons. |
| M2 | Math Grades 4–8 | MATH.* L05–L09 (about 22) | src/OneBiteDataMath*.html, src/OneBiteDataUpper.html | OPEN | | 2026-11-28 12:10 | Stale (since 2026-11-27 17:55): set OPEN 2026-11-28 12:10. Batch 1 (14 Grade 4–5 lessons) is in pull request #640: tests FAIL and it has the label hold. Start there: fix the failing tests, then remove hold. |
| R1 | C45 Grade 4 reading, part 1 | READ.* L05 in C45 (first 30) | src/CoreDataC45*.html | OPEN | | 2026-11-28 12:10 | Stale (no activity since 2026-11-27 17:10): set OPEN by the coordinator 2026-11-28 12:10. Claimed, no batch pushed yet. |
| R2 | C45 Grade 4 reading, part 2 | READ.* L05 in C45 (other 30) | src/CoreDataC45*.html | OPEN | | 2026-11-28 12:10 | Stale (since 2026-11-27 17:20): set OPEN 2026-11-28 12:10. Claimed, no batch pushed yet. |
| R3 | C45 Grade 5 reading, part 1 | READ.* L06 in C45 (first 31) | src/CoreDataC45*.html | OPEN | | 2026-11-28 12:10 | Stale (since 2026-11-27 19:02): set OPEN 2026-11-28 12:10. Batch 1 (11 lessons) is LIVE (#661). Drafts on branches claude/newlessons-R3-2 and claude/newlessons-R3-3 (pushed, no pull request): start from them. |
| R4 | C45 Grade 5 reading, part 2 | READ.* L06 in C45 (other 31) | src/CoreDataC45*.html | OPEN | | 2026-11-28 12:10 | Stale (since 2026-11-27 17:18): set OPEN 2026-11-28 12:10. Its 31 = rows 32–62 of the C45 teaching order (src/CoreDataC45.js). No batch pushed yet. |
| R5 | C68 Grades 6–8 reading | 37 lessons (L07–L09) | src/CoreDataC68*.html | TAKEN | https://claude.ai/code/session_01NmKrTiVHqa1LEMS62zP9mn | 2026-11-27 19:40 | 14 of 37 done. Batch 1 (READ.COMP.L08.10–15, READ.LIT.L08.09) in tashbar-baltimore/tashbar-app#667; batch 2 (READ.COMP.L08.16–19, READ.LIT.L08.10–12, now in src/CoreDataC68H8.html) in tashbar-baltimore/tashbar-app#671. Not started: Grade 8 (C68H2: 10, C68H3: 4) and Grade 6 (C68H7: 9). Lessons: keep every tile 2–4 words (phone), no quote marks in cloze options. |
| R6 | F Grade 2 fluency + C23 | 39 + 3 lessons (L03) | src/CoreDataF*.html, src/CoreDataFH*.html, src/CoreDataC23*.html | TAKEN | https://claude.ai/code/session_015qpxB9aMQFaeLZMi5QymPB | 2026-11-28 07:20 | Batch 1 (READ.PHON.L03.04–.18, 15 lessons) in branch claude/newlessons-R6-1: reviewed, tests running, pull request next. Then FLU, LV, COMP, WRIT.HAND |
| R7 | Other reading, language, writing (not in a job) | READ.*, LANG.*, WRIT.* in OneBiteData*.html, L03+ (about 40) | src/OneBiteDataRead*.html, src/OneBiteDataWrit.html, src/OneBiteDataUpper.html | OPEN | | 2026-11-28 12:10 | Stale (since 2026-11-27 19:00): set OPEN 2026-11-28 12:10. Claimed, no batch pushed yet. |
| G1 | Grammar Grades 2–4 | G lessons L03–L05 (49) | src/CoreDataG*.html | OPEN | | | |
| G2 | Grammar Grades 5–8 | G lessons L06–L09 (53) | src/CoreDataG*.html | TAKEN | https://claude.ai/code/session_015qpxB9VcPo74ZQ8fKvNuAY | 2026-11-28 07:10 | All 53 drafted on branch claude/newlessons-G2-1; 40 passed independent review (all 4–5), the rest in re-review. Batch pull requests next. |
| W1 | Writing Grades 2–3 (W13) | 37 lessons (L03–L04) | src/CoreDataW13*.html | OPEN | | | |
| W2 | Writing Grades 4–5 (W48) | 50 lessons (L05–L06) | src/CoreDataW48*.html | TAKEN | https://claude.ai/code/session_015qpxBA4q9oXCibnuQ4yWC2 | 2026-11-28 07:40 | Batch 1 (8: WRIT.PARA.L05.06–09, WRIT.ESSAY.L06.02–04, WRIT.PARA.L06.03) in its pull request; batch 2 (W486, 6 story lessons) next |
| W3 | Writing Grades 6–8 (W48) | 57 lessons (L07–L09) | src/CoreDataW48*.html | TAKEN | https://claude.ai/code/session_015qpxB94YmCQzBn7jqxa8Qk | 2026-11-27 18:45 | Claimed; reading the lessons, batch 1 next |
| S1 | Social Studies | SS.* (about 30) | src/CoreDataS*.html, src/OneBiteData*.html | OPEN | | | |
| S2 | Science | SCI.* (20) | src/CoreDataS2.html, src/CoreDataS3.html and the other src/CoreDataS*.html | TAKEN | https://claude.ai/code/session_016cU9PXYjBvSiqu8FzyhB3z | 2026-11-27 20:40 | Batch 1 (8 of 20): SCI.SKY.L05.01-04 + SCI.LAND.L06.01-04, pull request "New Lessons S2 batch 1". Next: batch 2 = SCI.LAND.L07.01-04, SCI.PLANT.L08.01-04, SCI.MATT.L09.01-04 (S3, S4, S5) |
| K1 | Kodesh (Chumash, Kriah, Halacha, Tefillah, Navi, Mishnah) | LK.* (65) | src/OneBiteDataKodesh.html (and src/KriyahMore.html) | WAIT (take only when every other row is TAKEN or DONE; HoS 2026-11-27) | | | Kodesh: REBBE review after live |
| L1 | Young levels (seen as bridges and by older boys filling gaps; K–1 boys play the K–1 games) | MATH.*, READ.* L01–L02 (about 70) | src/OneBiteData*.html | OPEN (last) | | | |

## Coordinator notes 
- **2026-11-28 12:30 play-through (TEST- boy, 1366×768 and 390 px): MATH.PV.L03.02, SCI.LAND.L06.02, WRIT.PARA.L05.07.** All three play to mastered, 0 page errors, clear and warm; the science water-in-100-cups hook and the writing "wanders off" lessons are strong.
  - **M1 (fix in the next batch):** M1 batch 1 was built before `land:true` went live, so its hops are one tap per hop. MATH.PV.L03.02 takes **64 taps**: "Hop 10 tens from 0" is 10 taps, "Hop by 100s" 6 taps. Switch every hop that is not itself the counting skill to `land:true` (DESIGN.md, "No tap-tap counting"), in MATH.PV.L03.02 and the other batch 1 lessons (e.g. "hop back 8 from 35").
  - **All rows:** the green "+$20 YOU EARNED IT" banner can still land over the first screen of the next lesson when a boy taps Next level quickly (it starts on the Done screen). Small; noted for gap B7.
- **2026-11-28 12:10 (for the HoS):** 9 math, 8 science, 11 Grade 5 reading and 8 Grade 4–5 writing lessons are live in the new shape, plus the 3 samples. Grammar, Grade 2 reading, Grade 7 reading, Grade 6 history and more writing are finished and waiting for their final check. This account keeps hitting its 5-hour limit, so builders work in bursts. Six jobs from other accounts went quiet overnight and are open again for any builder. Nothing for you to decide.

- **Math (M1, M2):** for Grade 2 and up, use hop `land:true` (the boy taps where the frog lands), not tap-tap hopping. See DESIGN.md, "No tap-tap counting". In MATH.OPS.L03.01, "build 73" still takes about 10 taps.
- **R1 (or whichever row holds it):** READ.COMP.L05.05 is done (P0). Its Try it 2 tile "the oven is hot by 5" reads oddly ("by 5 o'clock"?). Fix it with a fresh review.
- **All rows:** on a phone, a "try again" line can push the activity below the Check bar (gap B7).

## Rules for every row (binding)
- Follow `DESIGN.md` and CLAUDE.md. The quality gate (`node tests/run.js`) must pass; it checks the new rules, including hook variety inside a set.
- **Every hook in a set is a different kind** where you can; never the same kind twice in a row, never one kind for more than a third of a set.
- Keep every check question (Show me) as it is unless a fresh reviewer finds it wrong. Every check question must be answerable from what the lesson now teaches.
- A fresh reviewer (one that did not write the lessons) scores each lesson 1–5 on the 9 points against the lesson data and its full range of check questions. Ship only when every score is 4 or 5. Put the table in the pull request.
- Play every lesson as a made-up TEST- boy at 1366×768 and phone size (`node tools/lesson-redesign/audit.js OUTDIR ID,ID`), LOOK at every screen, and put pictures in the pull request.
- Pictures and art: search `art/CATALOG.md` first; new art goes in `art/` (CLAUDE.md "Shared art library").
