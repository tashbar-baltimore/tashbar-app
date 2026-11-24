# Core Growth: jobs (who does what)

Read `docs/CORE-GROWTH-PROMPT.md` first. It explains how to claim a job (section 0).

**How to claim, in short:**
1. Read this file on `origin/main`, and list the open PRs titled `Core Growth claim: …`.
2. Take the first `OPEN` job, top to bottom, with no open claim PR.
3. Change **only your row** in a PR titled `Core Growth claim: <job>`.

**Stale jobs:** a `TAKEN` job with no update, no open PR and no commit for 48 hours is open again. Continue from where its last owner stopped.

## Jobs
| Order | Job | Status | Owner (session link) | Taken on | Last update | Where I am | Needs |
|---|---|---|---|---|---|---|---|
| 1 | **T · Tools** (Reader, Writing Workshop and teacher inbox, unit checks and test-out, new activity kinds, content store, how to add a skill, style sheets) | TAKEN | https://claude.ai/code/session_01WBvMX2ukMEquyXqwaDMAGw | 2026-11-24 | 2026-11-24 05:30 UTC | LIVE: how to add a skill (#288, `HOW-TO-ADD-A-SKILL.md`), content store (#304, `HOW-TO-ADD-A-TEXT.md`). In PR: Reader (#305), style sheets + picture order T-1 (#303). Built and tested, PRs next: 7 new activity kinds (`claude/core-T-activities`), Writing Workshop + teacher inbox (`claude/core-T-writing`, `HOW-TO-ADD-A-WRITING-TASK.md`). Next: unit checks and test-out (built), minutes ledger report (in PR) | none; start first |
| 2 | **D · The daily plan** (replace "3 lessons, then the Arcade" with today's list of material to cover; daily bonus when the whole list is done; every payment says what it is for) | TAKEN | https://claude.ai/code/session_01TScHB4zG82RAGTetxXcxpj | 2026-11-24 | 2026-11-24 02:45 UTC | Plan in #284; building today's list for TEST- boys (server list check, daily bonus on the whole list, My work rows) | none; can start now |
| 3 | **F · Foundations K–2** | TAKEN | https://claude.ai/code/session_01JPKZXHjMHR8MBsBECX3W7A | 2026-11-24 | 2026-11-24 05:40 UTC | Grade 2 Unit 1: 3 new lessons + Syllable Splitter rebuilt (PR open); next: Fluent Flyer with a cold check story, then Grade 2 Unit 2; picture order 1 sent | T for lesson PRs; can start the map now |
| 4 | **C45 · Comprehension Gr 4–5** | TAKEN | https://claude.ai/code/session_01JPKZXEMq9S1KawXgCw533p | 2026-11-24 | 2026-11-24 03:17 UTC | Skill map + ledger in review (`docs/core-growth/C45-map.md`); next: Units 4.1 + 5.1 and Book B1 ch. 1–3, lessons once T's how-to is merged | T for lesson PRs; can start the map now |
| 5 | **W48 · Writing Gr 4–8** | TAKEN | https://claude.ai/code/session_01HB2X6dqysjU6rtBkKPF5Xf | 2026-11-24 | 2026-11-24 06:25 UTC | Gr 4 Unit 1 live (#313); Gr 5 Unit 1 in a PR; Gr 6 Unit 1 in review; picture batch 1 arriving from the HoS image account | T (Writing Workshop); can start the map now |
| 6 | **C23 · Comprehension Gr 2–3** | OPEN | | | | | T for lesson PRs; can start the map now |
| 7 | **G · Grammar and words K–8** | TAKEN | https://claude.ai/code/session_013qbMrgAu9CyoyPphT4PmMj | 2026-11-24 | 2026-11-24 04:10 UTC | Skill map and ledger written (`docs/core-growth/G-map.md`, `G-ledger.md`); next: rebuild the 2 to-fix lessons, then Unit 1 of every grade | T for lesson PRs; can start the map now |
| 8 | **C68 · Comprehension Gr 6–8** | TAKEN | https://claude.ai/code/session_01F5TiU4gVh7WZ9cRWBJEpNU | 2026-11-24 | 2026-11-24 05:00 UTC | Skill map + ledger in review (`docs/core-growth/C68-map.md`, `C68-ledger.md`); next: Units 6.1, 7.1, 8.1 skill lessons (`src/CoreDataC681.html`) and W1/W4/W7 ch. 1–4 | T for lesson PRs; can start the map now |
| 9 | **W13 · Writing K–3** | OPEN | | | | | T (Writing Workshop); can start the map now |
| 10 | **S · Science and Social Studies** | OPEN | | | | | the core map of a band; can start the map now |
| 11 | **V · Verifier** (reviews, takes no building job) | OPEN | | | | | starts when the first lesson PR opens |

Status values: `OPEN`, `TAKEN`, `DONE`.

## Helpers wanted
Job owners add pieces a second account can take. A helper claims a piece the same way as a job, with a PR titled `Core Growth claim: <job> helper <piece>`.

| Job | Piece | Status | Helper (session link) | Last update |
|---|---|---|---|---|
| F | K Units 6–10 (lessons and little readers; see `docs/core-growth/F-map.md`) | OPEN | | |
| F | Grade 1 Units 7–12 (lessons and little readers) | OPEN | | |
| F | K–1 listen-along stories (70, in topic sets) and their understanding lessons | OPEN | | |
| F | Grade 2 Units 4–6 (lessons, word-study readers, Readers' Theatre) | OPEN | | |
| C45 | Grade 5, Units 5.4–5.6 (lessons and topic-set texts; see `docs/core-growth/C45-map.md`) | OPEN | | |
| C45 | Grade 5, Units 5.7–5.9 | OPEN | | |
| C45 | Books B2 *Lost on the Ridge Trail* and B5 *Shabbos at the Lighthouse* (after B1 sets the pattern) | OPEN | | |
| C45 | Fluency passages, Grades 4 and 5 (50, from the unit texts) | OPEN | | |
| G | Grades 6–8 (L07–L09), Units 1–6 (see `docs/core-growth/G-map.md`) | OPEN | | |
| G | Word Work sets for C45 and C68 texts (Grades 4–8), once their Shared texts are listed | OPEN | | |
| C68 | Grade 7, Units 7.5–7.8 (lessons and topic-set texts; see `docs/core-growth/C68-map.md`) | OPEN | | |
| C68 | Grade 8, Units 8.5–8.8 (lessons and topic-set texts) | OPEN | | |
| C68 | Longer works W2 *Snowbound* and W6 *The Flood* (after W1 sets the pattern) | OPEN | | |
| C68 | Adapted public-domain works W5 (Verne), W8 (Conan Doyle), W9 (Stevenson) | OPEN | | |

## Casts (recurring characters, one per band)
| Band | Cast note | Written by |
|---|---|---|
| K1 (K–1) | the Peretz family on Maple Street (`docs/core-growth/F-map.md`, section 8) | F |
| B23 (2–3) | the Shabbos Street Club, proposed by F; C23 confirms or extends (`docs/core-growth/F-map.md`, section 8) | F |
| E45 (4–5) | The Glen Avenue Crew: `docs/core-growth/C45-map.md` section 5 | C45 |
| M68 (6–8) | The Beacon newsroom: `docs/core-growth/W48-map.md` section 7 (C68 uses it too: `docs/core-growth/C68-map.md` section 5) | W48 |

## Shared texts
The F and C jobs list texts that the G and W jobs may use for "his own sentence" and writing tasks.

| Text id | Title | Grade | Words | Job |
|---|---|---|---|---|

## Ledger (core hours built / target, per grade)
| Grade | Foundations | Comprehension | Grammar and words | Writing | Total built | Target |
|---|---|---|---|---|---|---|
| K | | | | | 0 | 68 |
| 1 | | | | | 0 | 68 |
| 2 | 0.8 | | | | 0.8 | 90 |
| 3 | | | | | 0 | 90 |
| 4 | | | | | 0 | 90 |
| 5 | | | | | 0 | 90 |
| 6 | | | | | 0 | 90 |
| 7 | | | | | 0 | 90 |
| 8 | | | | | 0 | 90 |
