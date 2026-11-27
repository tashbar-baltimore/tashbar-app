# Job F · Foundations K–2: the minutes ledger

Expected minutes for a **typical boy**, first time through. Updated with every F pull request. Plan: `docs/core-growth/F-map.md`.

## How minutes are counted
| Piece | Minutes each | Why |
|---|---|---|
| Small-skill lesson | K 4–5, Gr 1 5–6, Gr 2 7 (per lesson, from the map) | One Bite length per band (playbook section 2) |
| Little reader | K 8 first read + 2 rereads of 4 = 16; Gr 1 10 + 2 × 5 = 20; Gr 2 12 + 6 = 18 | Decodable text is read 3 times across the week (repeated reading) |
| Listen-along story or fact book | K–1: 10 | Listen, rich words, 3 questions |
| Fluency passage | K 6, Gr 1 7, Gr 2 8 | Hear it, read along 3 times, self-check |
| Unit check | K 6, Gr 1–2 8 | 8–12 items |
| Unit opener | 2 | Brief, inspiring, patient |
| Spaced review | 5 per lesson (5 returns × 1 minute) | The live review at 1, 3, 7, 14, 30, 60 days |

A boy who tests out of a skill skips it, so a fast boy needs fewer minutes. That is the point (mastery, not repetition).

## Planned (from the map)
| Grade | Lessons | Readers | Listen-along | Fluency | Checks | Openers | Review | **Planned F hours** | Grade target (all jobs) |
|---|---|---|---|---|---|---|---|---|---|
| K | 381 | 800 | 400 | 120 | 60 | 20 | 400 | **≈ 36 (2,176 min)** | 68 |
| 1 | 447 | 1,600 | 300 | 280 | 96 | 24 | 380 | **≈ 52 (3,121 min)** | 68 |
| 2 | 224 | 450 | — | 320 | 48 | 12 | 160 | **≈ 20 (1,214 min)** | 90 |

## Built and live (passes the standard)
| Grade | Lessons | Texts | Hours built | Planned |
|---|---|---|---|---|
| K | 64 games: Unit 1 (`READ.PA.L01.07`–`.09`), Unit 2 (`READ.PHON.L01.05`–`.07`, `READ.FLU.L01.02`, `WRIT.HAND.L01.05`), Unit 3 (`READ.PHON.L01.08`–`.10`, `READ.FLU.L01.03`, `WRIT.HAND.L01.06`), Unit 4 (`READ.PHON.L01.11`–`.13`, `READ.PA.L01.10`, `READ.FLU.L01.04`), Units 6–10 by the F helper (42 games incl. 18 little-book games, `src/CoreDataFH1.html`), listen-along set 1 by the F helper (4 games, `src/CoreDataFH3.html`) | 4 listen-along stories, 18 little books (helper) | ≈ 5.3 (64 × 5 min) | 36 |
| 1 | 39 games: `READ.PHON.L02.22`, `READ.PA.L02.02`; Unit 2 (`READ.PHON.L02.06`–`.09`, `READ.FLU.L02.03`); Unit 3 (`READ.PHON.L02.10`–`.13`, `READ.PA.L02.03`, `WRIT.HAND.L02.02`); Units 7–12 by the F helper (26 games, `src/CoreDataFH2.html`) | 0 | ≈ 3.9 (39 × 6 min) | 52 |
| 2 | 22 (`READ.PHON.L03.04`–`.17`, `READ.LV.L03.03`–`.06`, `READ.FLU.L03.02`–`.04` new; `READ.PHON.L03.01` rebuilt) + 5 unit checks (`F.U21`–`F.U25`) | 0 | ≈ 5.1 (22 × 12 min with review, + 5 × 8 min checks) | 20 |

Existing lessons count only once they pass the standard (prompt, section 2).

**Waiting:** `READ.FLU.L03.01` Fluent Flyer (Grade 2 Unit 1) needs a new, cold check story in its content pack before it can pass (issue #310). `READ.FLU.L03.04` Just-Right Speed did not need it: its checks are about reading speed, not about a passage.

**Still to build in Grade 2 (map):** Unit 6 (`READ.FLU.L03.05`–`.07`, `READ.PHON.L03.18`, `WRIT.HAND.L03.01`) and its unit check `F.U26`. Units 1–5 have their checks (`src/CoreDataF3.html`).

## Left out on purpose
- K little readers in Units 1–2: a boy cannot yet decode text, so "readers" there would be filler. Listen-along stories take that time.
- K fluency passages: 20, not 40, for the same reason (they start in Unit 7).

## Helper: K–1 listen-along stories (`src/CoreDataFH3.html`, `texts/F/`)
Each listen-along game is one story (read aloud, rich words) plus its understanding questions: 10 minutes (the "Listen-along story" row above), plus 5 minutes of spaced review.

| Grade | Built (live) | Minutes | Planned (map) |
|---|---|---|---|
| K | 4 stories, topic set "Eli's First Week" (`F.LA.K01`–`K04`), each with its game: `READ.LIT.L01.01` Who Is in the Story?, `.02` Where Is the Story?, `.03` Problem and Fix, `.04` Retell It | 4 × (10 + 5) = **60** | 40 stories and fact books (400 min) + their 12 understanding skills |
| 1 | 0 | 0 | 30 stories and fact books (300 min) |

## Helper: Grade 2 Units 4–6 (`src/CoreDataFH4.html`, `texts/F/F.PO.*`, `texts/F/F.RT.*`)
The F owner built the Units 4–5 lessons and checks. This helper builds Unit 6, the Grade 2 word-study little readers and the Readers' Theatre scripts. Minutes as above: Grade 2 lesson 7 (+ 5 review), fluency text 8, unit check 8.

| Piece | Built | Minutes |
|---|---|---|
| Unit 6 lessons | `READ.FLU.L03.05` Poem Beat, `.06` Readers' Theatre, `.07` Fix It As You Go, `READ.PHON.L03.18` Spell It Back, `WRIT.HAND.L03.01` Neat Paragraph | 5 × 12 = 60 (Readers' Theatre 8 + 5) → **61** |
| Fluency texts | `F.PO.01` *Rain on the Sukkah* (poem), `F.RT.01` *The Clock That Stopped* (Readers' Theatre, 6 parts) | 2 × 8 = **16** |
| Unit check | `F.U26` Poems, Plays and Spelling (the end-of-Grade-2 boss level) | **8** |
| Word-study little readers | `F.WR.15`–`.24` (10 stories, 160–210 words, Units 4–5 patterns), each with its own read-and-prove lesson: `READ.FLU.L03.08`–`.17` | 10 × 18 (first read + rereads, per the Grade 2 reader row) = **180** |
| Readers' Theatre scripts 2–3 | `F.RT.02` *The Lost Siddur*, `F.RT.03` *The Snow Day Fort*, each with its own lesson: `READ.FLU.L03.18`, `.19` | 2 × (8 text + 10 lesson) = **36** |
| Little reader 25 | `F.WR.25` *The Club Fair* (end-of-Grade-2 story, every pattern), lesson `READ.FLU.L03.20` | **18** |
| **Total** | | **319 min ≈ 5.3 h** |

The helper piece is complete. The map's readers 1–14 (Units 1–3) belong to the F owner's units; this helper piece covers 15–25.
