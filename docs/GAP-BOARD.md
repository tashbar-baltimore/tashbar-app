# Gap board (HoS 2026-11-25)

The shared list of gaps for every builder account working toward the finish line. The worker prompt and the coordinator prompt are in `docs/GAP-PROMPTS.md`.

**How to claim (workers):**
1. Read this file on a fresh `origin/main`, and list the open PRs titled `Gap claim: …`.
2. Take the first `OPEN` row, top to bottom, that has no open claim PR.
3. Open a PR titled `Gap claim: <ID> <short name>` that changes **only your row**: status `TAKEN`, your session link, the time (UTC) and "where I am". It is docs only and goes live by itself.
4. Update your row when you ship (put the PR links in the last column) and when you stop. Mark it `DONE` only when the work is live on main.

**Stale:** a `TAKEN` row with no commit, no open PR and no update for **6 hours** is `OPEN` again. The next builder continues from where it stopped and does not start over.

**Coordinator:** one account (see `docs/GAP-PROMPTS.md`) keeps this board honest. It frees stale rows, checks every `DONE` against main, refreshes the ledger below, and reports to the HoS.

## The finish line
- D1–D3 live: Social Studies unit checks; Science names fixed; every open 2.0 piece playable at `/try2/` in 1.0 for the right grades, refreshed every 3 hours.
- 0 known "right answer marked wrong" items on main.
- No writing box counts blank or short as right; every W13 and W48 unit has a Writing Workshop piece that reaches the teacher.
- K–1 bugs #402, #378 and #343 closed.
- The test check runs in under 25 minutes, with no cancelled runs in a day.
- Review Round 2 done; at least 90% of live Core Growth lessons pass all 9 points, and every job at least 80%.
- C23 and C68 each have at least Units 1–4 per grade live, with unit checks.
- Ledger: at least 25 hours per grade (K–8), then 50, then the targets (68 for K–1, 90 for Grades 2–8).
- `tests/quality-baseline.json` goes from 101 toward 0.

## Ledger (hours of new core learning built / target)
_From `node tools/core/ledger.js`, 2026-11-25 17:15 UTC (coordinator). Grade 1 shows 0 because the counter misses the K–1 games (gap B6); 26 Grade 1 games are live._

| K | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| 4.1/68 | 0*/68 | 9.8/90 | 2.6/90 | 21.8/90 | 20.6/90 | 4.7/90 | 6.0/90 | 9.2/90 |

## Gaps (top to bottom = priority)
| ID | Priority | Gap | Status | Owner (session link) | Last update (UTC) | Where I am / proof (PR links) |
|---|---|---|---|---|---|---|
| A1 | P0 (top: coordinator 25 Nov) | Test check at its 45-min limit (3 runs cut off on 25 Nov: #649, #651, #662; 12 of the last 25 passing runs took over 35 min, none under 25): make it reliably under 25 min without weakening any check | TAKEN | https://claude.ai/code/session_01A6aeyh1CSsqY5yDtX8XEGE (coordinator) | 2026-11-25 17:25 | Measuring where the time goes; fix on branch claude/peaceful-cerf-yx1pgz-test-speed |
| A5 | P0 | docs/CORE-GROWTH-LANES.md on main still has merge-conflict marks (lines 40–46, from #484): keep the newest C45 helper rows, remove the marks, and add a test that fails on conflict marks in any text file | TAKEN | https://claude.ai/code/session_01A6aeyh1CSsqY5yDtX8XEGE (coordinator) | 2026-11-25 17:25 | Fixed + test on branch claude/peaceful-cerf-yx1pgz-lanes-marks; tests running, PR next |
| D1 | HoS decision | Social Studies path (#432): `SS` next to `SCI` in src/CoreUnits.html + test; then a unit check, test-out and project for every live Social Studies Unit 1 (Gr 4–8) | OPEN | | | |
| D2 | HoS decision | Science index names (#391, option a): rename the 64 Gr 6–8 names to the real lessons, keep the Torah-linked topics as planned skills, add a test | TAKEN | https://claude.ai/code/session_015qpxB9qGaqzj8notpPXamM | 2026-11-25 20:05 | Reading CI_INDEX.lad.SCI and packs/ScienceMore*; branch claude/wizardly-cannon-hogqso-d2 |
| D3 | HoS decision | 2.0 try-out inside 1.0: every open 2.0 PR playable at /try2/ for the right grades, refreshed every 3 hours; 2.0 itself unchanged | OPEN | | | |
| A2 | P0 | Round 1 URGENT "right answer marked wrong" fixes (h__l, rep-til, skating rink, W48 "wanders off" checks, "rebbe sold it") + sweep for the same bug; also READ.FLU.L05.16 "line right after Number one" (re-score 25 Nov) | TAKEN | https://claude.ai/code/session_01A6aeyh1CSsqY5yDtX8XEGE (coordinator) | 2026-11-25 17:25 | Fixing the 5 URGENT cards, then the sweep; branch claude/peaceful-cerf-yx1pgz-a2-right-answers |
| A3a | P0 | Writing engine: a write is never auto-right; grade minimums; test | OPEN | | | |
| A3b | P0 | W48 (Gr 4–8): every live unit's real task is a Writing Workshop piece; real minimums | OPEN | | | |
| A3c | P0 | W13 (Gr K–3): the same for the live W13 units | OPEN | | | |
| A4 | P0 | K–1 game bugs #402 (tiny text), #378 (word over instruction), #343 (no "how" after a miss) | OPEN | | | |
| A6 | P0 | A lesson can start before all its parts load and quietly skip activities (seen in the coordinator's play-through: 1 "with me" + 2 "your turn" played). Find out if a slow Chromebook gives a boy a short lesson with no warning; if so, wait for the parts or show a message; add a test | OPEN | | | |
| B1a | P1 | Review Round 2: F, all K–1 games, W13 | OPEN | | | |
| B1b | P1 | Review Round 2: C45 and S | OPEN | | | |
| B1c | P1 | Review Round 2: G and W48 | OPEN | | | |
| B2a | P1 | Fix Round 1 failed lessons: W48 Grades 4–5 | OPEN | | | |
| B2b | P1 | Fix Round 1 failed lessons: W48 Grades 6–8 | OPEN | | | |
| B2c | P1 | Fix Round 1 failed lessons: G (11), F (5), C45 (4) | OPEN | | | |
| B2d | P1 | Social Studies Gr 6–8 Unit 1: 12 of 18 lessons fail the 25 Nov re-score (2-choice checks, answer in the picture, How boxes pointing to teach cards One Bite never shows); fixes in packs/SocialMore.html + packs/HowToDo.html (docs/core-growth/reviews/R2-rescore-2026-11-25.md, #489) | TAKEN | https://claude.ai/code/session_01A6aeyh1CSsqY5yDtX8XEGE (coordinator) | 2026-11-25 18:00 | Fixing on branch claude/peaceful-cerf-yx1pgz-ss-checks |
| B2e | P1 | Re-score fixes: WRIT.PARA.L02.01, WRIT.PARA.L02.03 (Gr 1 games), WRIT.ESSAY.L03.01, READ.FLU.L05.15, READ.LIT.L09.01 (same file, #489) | TAKEN | https://claude.ai/code/session_01A6aeyh1CSsqY5yDtX8XEGE (coordinator) | 2026-11-25 18:00 | Fixing on branch claude/peaceful-cerf-yx1pgz-rescore-fixes |
| B3 | P1 | Cold checks: no check answer shown earlier in its lesson; no 2-choice checks | OPEN | | | |
| B4 | P1 | "Write one sentence" activity kind (teacher-scored), then add it to the end of the G lessons | OPEN | | | |
| B5-1 | P1 | Quality baseline: fix old lessons 1–15 on tests/quality-baseline.json, shrink the list | OPEN | | | |
| B5-2 | P1 | Quality baseline: lessons 16–30 | OPEN | | | |
| B5-3 | P1 | Quality baseline: lessons 31–45 | OPEN | | | |
| B5-4 | P1 | Quality baseline: lessons 46–60 | OPEN | | | |
| B5-5 | P1 | Quality baseline: lessons 61–75 | OPEN | | | |
| B5-6 | P1 | Quality baseline: lessons 76–90 | OPEN | | | |
| B5-7 | P1 | Quality baseline: lessons 91–101 | OPEN | | | |
| B6 | P1 | Counters: #310 (cold reading checks), ledger counts K–1 games, check and close #296 if solved | OPEN | | | |
| B7 | P1 | Screens (play-through 25 Nov): the streak banner ("WOW!", "3 IN A ROW", "5 STREAK") covers the question; Show Me answers fall below the screen at 1366×768 with long passages or big type; "put in order" cards hidden under Check on Chromebook; phone answer buttons on listen screens about 12px (Gr 2); sorted cards cut off behind Next on phone. Fix in the engine/button system only (window.TLK, docs/BUTTON-SYSTEM.md), pictures at both sizes | OPEN | | | |
| B8 | P1 | Picture chips that mean nothing (e.g. blue circles labelled "Chaim"/"ZEIDY" in READ.FLU.L03.19, a gift labelled "gives" and a hammer labelled "Build" in WRIT.ESSAY.L07.09): audit the chip pictures on Core Growth lessons and fix or remove | OPEN | | | |
| B9 | P1 | Small text bugs: WRIT.ESSAY.L07.09 ready check reads "In Quote evidence and explain it, after the evidence you…" (src/CoreDataW4823.html:183); SS.HIST.L09.01 title and the line under it repeat; console note "TL_QA_1CC_FIX20: box changed or missing, skipped: LANG.USE.L05.01" on every lesson | OPEN | | | |
| B10 | P1 | K–1 polish: K book pages (READ.LV.L01.08 "The Wet Dog") have no pictures; one wrong tap of 3 gives 1 star and "Good trying!" (harsh for K); Gr 1 plan boxes say "Tap a card, then here" (a Gr 1 boy can't read it; say it out loud or show a picture cue) | OPEN | | | |
| C1a | P2 | C23 Comprehension Grade 2 (nothing built): map, ledger, units with texts and unit checks | OPEN | | | |
| C1b | P2 | C23 Comprehension Grade 3 | OPEN | | | |
| C2a | P2 | C68 Comprehension Grade 6 Units 6.1–6.4 (none live) | OPEN | | | |
| C2b | P2 | C68 Grade 7 Units 7.1–7.4 | OPEN | | | |
| C2c | P2 | C68 Grade 8 Units 8.1–8.4 | OPEN | | | |
| C3 | P2 | W13 Writing K–3 Units 2–6 (start with the OPEN W13 helper rows in CORE-GROWTH-LANES.md) | OPEN | | | |
| C4 | P2 | G Units 7–8 (Gr 2–8), then K–1 grammar; Word Work sets for C45/C68 texts | OPEN | | | |
| C5 | P2 | K–1 reading: Grade 1 little readers; the next listen-along story sets | OPEN | | | |
| C6 | P2 | C45: unit checks for Units 4.1–4.7 and 5.1–5.5; bring back from closed #456 only what #450 lacks | OPEN | | | |
| C7 | P2 | Remaining OPEN helper rows in CORE-GROWTH-LANES.md (C68 W2/W6, W13 prompt sets) | OPEN | | | |
| C8 | P3 | Science Unit 2 for Grades 4–8 | OPEN | | | |

## Coordinator notes (25 Nov 17:15 UTC)
- **Stuck:** claim PR #476 (C68 helper W5/W8/W9) has not gone live: its test run was cut off at the 45-minute limit (#662). Its owner should not re-push just to retry; it goes in with the next run after A1, or one careful re-push.
- **Core Growth owners near the 48-hour stale line** (CORE-GROWTH-LANES.md): D (last update 24 Nov 02:45), C68 owner (24 Nov 05:00; Units 6.1/7.1/8.1 not live, see C2), F owner (24 Nov 10:45), V (24 Nov 17:35). They become OPEN on 26 Nov at those times unless updated.
- **C3 (W13 Units 2–6):** the W13 owner is active and building Unit 2 (#487, Kindergarten). A C3 worker starts with the OPEN W13 helper rows (Grade 3 Units 4–6, Grade 2 Units 5–6), not Unit 2.
- **Collisions:** none between open 1.0 PRs (#476, #482, #486 and #487 each change a different row or unit).
- **Daily play-through (25 Nov, coordinator, made-up TEST- boy, 1366×768 + phone):** 8 lessons, one per job: F READ.FLU.L03.19, K READ.LV.L01.08, Gr 1 WRIT.PARA.L02.02, C45 READ.FLU.L05.11, C68 READ.LIT.L08.02, G READ.VOC.L07.01, W48 WRIT.ESSAY.L07.09, S SS.HIST.L09.01. No page errors. All are warm and modest, and each has real hands-on practice and a How box. What a boy sees going wrong: rows A6, B7, B8, B9, B10.
- **#491** is a second PR of the board commit; it is already on main through #488 and adds nothing.

## Re-review needed (for B1)
**Done 25 Nov 18:00:** fresh re-score in `docs/core-growth/reviews/R2-rescore-2026-11-25.md` (#489): 31 of 49 pass (S 6/18, C45+C68 20/23, W13 5/8); fixes are B2d, B2e and A2. Lesson PRs merged on 25 Nov whose score table shows a score below 4 that was "fixed" but never scored again (the rule: ship only when every score is 4 or 5). B1 re-scores these lessons first.
- #473 Grade 8 Social Studies Unit 1 (a 2 and five 3s; sample pictures only)
- #472 Grade 7 Social Studies Unit 1 (a 2 and two 3s; sample pictures only)
- #467 Grade 6 Social Studies Unit 1 (five 3s; sample pictures only)
- #484 C45 "Read It 3 Times" fluency batch 1 (three 3s)
- #480 W13 Grade 1 Unit 1 (a 3)
- #475 W13 Grade 2 Unit 1 polish (a 3; only 2 of 4 lessons pictured)
- #474 C68 Grade 8 Unit 8.5 (a 3)
Still to re-score: the unit checks in #483 and #481 (not fully scored).
