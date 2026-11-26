# Re-review of six unit checks (gap B1d), 26 Nov 2026

**What the HoS asked, narrowed to this piece:** every boss level a boy plays is a fair, cold test of what the unit taught. It never marks a right answer wrong, and every check scores 4–5 on all 9 points.

**Checks:**
- C68.U77 "Two Authors, One Bay" (Gr 7)
- C68.U78 "The Whole Story" (Gr 7)
- C68.U85 "Point of View and Irony" (Gr 8)
- C68.U86 "Judge the Argument" (Gr 8)
- C68.U88 "Old Stories, New Stories" (Gr 8)
- C23.U21 "Story Detectives" (Gr 2)

These checks were never scored in a table, which put them on the "Re-review needed" list (#486, #496, #501, #513, #516).

## How it was reviewed
Every reviewer was a fresh agent that wrote none of the items it scored. Each one got:
- the standard;
- the map;
- the engine code;
- a packet with every question the check (and its pre-check) can ask, and every teach and practice line of its lessons.

Each round had a new reviewer, and the author never scored his own fix.

| Round | Result |
|---|---|
| 1, first review | All 6 FAIL: too easy for the grade, joke wrong options, answers taught word for word, no item on the unit's topic. Two URGENT items. |
| 2, re-score | 1 PASS. In most items the right answer was the longest choice. One more URGENT item. |
| 3, final score | 2 PASS. Four single items fixed. |
| 4, confirm | 5 PASS. U88: one wording clash between two items, fixed. |
| 5, confirm U88 | PASS |

The full reviews are in `R2-unitchecks-2026-11-26/`: the first reviews and the final scores.

## Final scores (every point 4 or 5)
| Unit | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| C68.U77 Two Authors, One Bay | 5 | 5 | 4 | 5 | 4 | 4 | 4 | 4 | 4 | PASS |
| C68.U78 The Whole Story | 5 | 5 | 4 | 4 | 4 | 4 | 4 | 4 | 5 | PASS |
| C68.U85 Point of View and Irony | 5 | 5 | 5 | 5 | 4 | 4 | 4 | 5 | 5 | PASS |
| C68.U86 Judge the Argument | 5 | 5 | 5 | 5 | 4 | 4 | 4 | 5 | 4 | PASS |
| C68.U88 Old Stories, New Stories | 5 | 5 | 4 | 5 | 4 | 4 | 4 | 4 | 5 | PASS |
| C23.U21 Story Detectives | 5 | 5 | 4 | 5 | 4 | 4 | 4 | 5 | 5 | PASS |

Every answer key was checked by hand: the own items, the review questions and every pre-check question. Nothing URGENT is left.

## Right answer marked wrong: fixed
- **C23.U21:** "Dovid wore his boots ___ the ground was wet." The word "where" also fit. The item is now a tap-the-reason item.
- **READ.COMP.L02.01**, review in C23.U21 (`packs/ReadMore.html`): the tiles "leaves / and / plants" had two right orders. They are now "A snail / eats / leaves and plants".
- **READ.COMP.L08.19 check 1:** "mark it as an open question" could be defended. The question now says the book already told him.

## Engine bugs found and fixed (`src/CoreUnits.html`)
- **Lost passages:** 51 of the 394 lesson questions that boss levels can draw lost their reading passage. The lesson keeps it in `pic`, and the boss level copied only `p`. A boy got "Which fact is in BOTH texts?" with no texts. Now the passage shows, keeping its line breaks.
- **Same items twice:**
  - The pre-check and the boss level asked the same first own item for every skill, and a retake repeated them.
  - Now each own item is picked at random.
  - A unit can set `pre:'lessons'`. Its pre-check then asks the lessons' own check questions, so its own items stay new for the boss level. The six units here use it. Social Studies keeps its own pre-check items, because its old lesson checks are 2-choice.
- **Long questions:** a question over 140 characters shows in reading type, not as a big bold heading.
- **Review skills:** only the first 3 review skills are asked. This is now said in the file header.

## Data fixed
- **New own items for all six checks.** They are harder, on the unit's topic and cold. The wrong options are real mistakes of about the same length as the key. Every skill has 2 own items.
- **"Tap the proof" answers:** in 9 checks the right answer was always first (this kind is never shuffled). Now the place varies, including in U75, U76 and U87.
- **Four "Same passage:" checks** (READ.COMP.L08.10, L08.12) had no passage. Each now carries its own.
- **Lesson check questions** were fixed for a second answer, unclear wording or a missing chart, and the boss-level review questions were made cold. The test "check answers never taught" (baseline 850) went up to 874, because a cold answer is not word for word in the lesson. So:
  - the lesson checks asked only in a pre-check (before the boy sees the lesson) or in their own lesson are back to their earlier reviewed wording (19 of them);
  - the ones a boss level asks answer with the lesson's own taught words ("a news report", "a loaded word", "the text explains why", "reread when lost").
  - The count is back to 850. A fresh reviewer checked all 24 late changes: every key is right, nothing URGENT, every unit still 4–5 (`R2-unitchecks-2026-11-26/6-late-changes.md`).
- **Kosher:** "the best crabs in the world" is now a pizza shop sign (`packs/HowToDo3.html`).
- **Shabbos:** "no computer to read it on" is now "at the Shabbos table, where no one reads a screen".
- **Review skills:**
  - U78 reviews 7.5, 7.6 and 7.7 (the old READ.LIT.L08.02 checks repeat practised passages).
  - U85 reviews suspense (READ.LIT.L08.11).
  - U88 reviews 8.5, 8.6 and 8.7.

## New guards (`tests/lib/coreunits.js`)
The test fails when, in any live unit:
- a lesson question loses its passage in the boss level;
- every "tap the proof" item has its answer in the same place;
- the right answer is the longest choice in more than half of its own items.

The old units that already break the last rule are on the list `LONG_OLD`: C68.U75, W13.U31, S.U04, S.U06, S.U07 and S.U08. That list may only shrink.

## Left for others (scores already 4, or outside these checks)
- **Variety:** every own item is "tap one of three". One order or sort item per unit would lift point 6. That needs a tap kind the boss level accepts.
- **"The whole year":** U78 and U88 can reach only the units that are built (7.5–7.7 and 8.5–8.7). When Units 7.1–7.4 and 8.1–8.4 are live, add one of their skills to the review list.
- **Lesson owners:** in several lesson check questions the right answer is plainly the longest. Examples:
  - READ.LIT.L09.02.1, L09.11.3, L09.12.1, L09.12.3;
  - READ.LIT.L03.01.2 and .3;
  - the 8.5–8.7 checks drawn as reviews.
- **READ.LIT.L08.02 checks** (`packs/ReadMore.html`, `KindsMore`, `HowToDo`) reuse practised passages. A cold "Dvar Torah" set is ready in the first review file.
- **U85 pre-check:** it asks the old Grade 3–5 READ.LIT.L09.01 checks.
- **The map:** it asks for a boss level "on a new passage" (one passage above several items). That needs an engine change.
