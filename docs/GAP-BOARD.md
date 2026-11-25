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
_From `node tools/core/ledger.js`, 2026-11-25 13:50 UTC. Grade 1 shows 0 because the counter misses the K–1 games (gap B6); 26 Grade 1 games are live._

| K | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| 4.1/68 | 0*/68 | 9.8/90 | 2.6/90 | 13.4/90 | 11.1/90 | 4.1/90 | 3.7/90 | 3.8/90 |

## Gaps (top to bottom = priority)
| ID | Priority | Gap | Status | Owner (session link) | Last update (UTC) | Where I am / proof (PR links) |
|---|---|---|---|---|---|---|
| D1 | HoS decision | Social Studies path (#432): `SS` next to `SCI` in src/CoreUnits.html + test; then a unit check, test-out and project for every live Social Studies Unit 1 (Gr 4–8) | OPEN | | | |
| D2 | HoS decision | Science index names (#391, option a): rename the 64 Gr 6–8 names to the real lessons, keep the Torah-linked topics as planned skills, add a test | OPEN | | | |
| D3 | HoS decision | 2.0 try-out inside 1.0: every open 2.0 PR playable at /try2/ for the right grades, refreshed every 3 hours; 2.0 itself unchanged | OPEN | | | |
| A1 | P0 | Test check near its 45-min limit (2 runs cancelled): make it reliably under 25 min without weakening any check | OPEN | | | |
| A2 | P0 | Round 1 URGENT "right answer marked wrong" fixes (h__l, rep-til, skating rink, W48 "wanders off" checks, "rebbe sold it") + sweep for the same bug | OPEN | | | |
| A3a | P0 | Writing engine: a write is never auto-right; grade minimums; test | OPEN | | | |
| A3b | P0 | W48 (Gr 4–8): every live unit's real task is a Writing Workshop piece; real minimums | OPEN | | | |
| A3c | P0 | W13 (Gr K–3): the same for the live W13 units | OPEN | | | |
| A4 | P0 | K–1 game bugs #402 (tiny text), #378 (word over instruction), #343 (no "how" after a miss) | OPEN | | | |
| B1a | P1 | Review Round 2: F, all K–1 games, W13 | OPEN | | | |
| B1b | P1 | Review Round 2: C45 and S | OPEN | | | |
| B1c | P1 | Review Round 2: G and W48 | OPEN | | | |
| B2a | P1 | Fix Round 1 failed lessons: W48 Grades 4–5 | OPEN | | | |
| B2b | P1 | Fix Round 1 failed lessons: W48 Grades 6–8 | OPEN | | | |
| B2c | P1 | Fix Round 1 failed lessons: G (11), F (5), C45 (4) | OPEN | | | |
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
