# Job C23 · Comprehension Grades 2–3: the skill map (2026-11-25)

Owner: job C23 (see `docs/CORE-GROWTH-LANES.md`; gap rows C1a and C1b on `docs/GAP-BOARD.md`). Binding rules: `CLAUDE.md`, `CONTRIBUTING.md`, `docs/CORE-GROWTH-PROMPT.md`, `docs/ONE-BITE-PLAYBOOK.md`. Where they differ, CLAUDE.md wins.

**The HoS's words (2026-11-24):** "Beef up all their lessons to contain about a half a year's worth of work … the variety of different ways to learn based on proven research … no downtime and fluff and boringness … we want to keep it exciting, we want to keep it popping."

**My one-line check for every C23 PR:** *Does a Grade 2 or 3 boy now have more real reading (real stories, real short articles, a real chapter book at his level), taught one small skill at a time, at an even high quality, exciting to do and with no filler?*

## 1. What a Grade 2–3 boy has today

The app has **7** Grade 2–3 lessons in this job's strands (comprehension and literature). **None of them is a One Bite lesson yet.** Each has its old practice and check questions, which a rebuild keeps (`TLCORE.upgrade`).

| Id | Name | Std | Grade |
|---|---|---|---|
| READ.COMP.L03.01 | Main Topic | RI.2.2 | 2 |
| READ.COMP.L03.02 | Text Tools | RI.2.5 | 2 |
| READ.COMP.L03.03 | Read to Learn | RI.2.1, RI.2.3 | 2 |
| READ.LIT.L03.01 | Retell It | RL.2.2 | 2 |
| READ.COMP.L04.01 | Five Questions | RL.3.1, RI.3.1 | 3 |
| READ.LIT.L04.01 | Moral of the Story | RL.3.2 | 3 |
| READ.LIT.L04.02 | Character Clues | RL.3.3 | 3 |

**What is already live and feeds this job:**
- **Grade 2 fluency belongs to job F** (`READ.FLU.L03.*`): 20 lessons, including the Shabbos Street Club little readers (`texts/F/F.WR.15`–`.25`) and three Readers' Theatre plays (`F.RT.01`–`.03`). C23 reuses those texts for comprehension and never rebuilds them.
- **Grade 3 fluency belongs to this job** (`READ.FLU.L04.01`–`.02` exist; new ones from `READ.FLU.L04.03`).

**Not this job:** vocabulary and word parts (`READ.VOC.*`) belong to **job G**; writing (`WRIT.*`) to **job W13**; phonics and Grade 2 fluency to **job F**.

## 2. How much this job builds (per grade)

Grade 2–3 boys read shorter texts and need more listening and rereading than Grades 4–5, so the per-lesson sizes are smaller than C45's.

| Per grade | Grade 2 | Grade 3 |
|---|---|---|
| Units (each about 1 week) | 8 | 8 |
| Small skill lessons | 30 (4 rebuilt, 26 new) | 32 (3 rebuilt, 29 new) |
| Reading texts with questions (Grade 2: 200–500 words; Grade 3: 300–800) | 20 (12 information in 4 topic sets, 8 stories, fables, poems) | 22 (same shape) |
| Chapter book (original, chapter by chapter) | 1 (10 chapters) | 1 (12 chapters) |
| Fluency passages ("read it 3 times") | job F | 16 |
| Unit checks + test-out pre-checks | 8 + 8 | 8 + 8 |
| **Expected hours for a typical boy** | **≈ 12.5** | **≈ 17** |

**Minutes used for planning (typical boy):** small skill lesson 8 · text with questions 12 (Grade 2) or 15 (Grade 3) · book chapter 15 · fluency passage 8 · unit check 10 · test-out pre-check 4. A boy who tests out of a skill skips it.

**The split of the 90 core hours:** comprehension ≈ 12.5 (Grade 2) and ≈ 17 (Grade 3) from this job, foundations and fluency (job F, Grade 2 mostly), grammar and words (job G), writing (job W13), science and social studies readings (job S, from Grade 4). The minutes are in `docs/core-growth/C23-ledger.md`.

## 3. The units

Every unit has, in this order (the same shape as C45 and C68, sized for Grades 2–3):
1. **Test-out pre-check:** one cold question per small skill. A skill he shows is skipped.
2. **Unit opener:** the unit's world in one scene, what we learn and why, short and warm (the big art goes here).
3. **Small skill lessons** in the One Bite shape. Each one teaches on one short passage and checks on a different, cold passage.
4. **The real reading:** the unit's texts (topic set, story or chapter), where every skill of the unit is used, with "find the proof" taps in the Reader.
5. **Fluency** (Grade 3): 2 "read it 3 times" passages from the texts he is reading (listen → read along → read alone → self-check; no recording, no timers).
6. **Unit check (boss level):** 8–10 tap questions, with 8–10 fresh items of its own (each with its `skill`), mixing every skill of the unit plus 2 from earlier units.

**Ways of learning** (letters as in C45/C68; each unit uses at least 4, and no two lessons in a row have the same shape): worked example (W), retrieval (R), tap the reason (Y), Mistake Detective (M), story maps and organizers (P), topic-set knowledge (K), reciprocal teaching for little ones, "teacher, find the proof" (RT), text evidence tap (E), listen first (L), song or move for K–3 (S), Readers' Theatre (T), chavrusa (C).

**B23 quality gate:** a song or a move in Watch me; spoken lines of 12 words or fewer; 3+ activity kinds; a mistake activity in do 1–2 or your 1–3; one story per lesson (the `read` kind once); never the word "bite".

**Ids:** level = grade + 1, so Grade 2 is `L03` and Grade 3 is `L04`. New ids continue from the next free number (`READ.COMP.L03.04`, `READ.LIT.L03.02`, `READ.COMP.L04.02`, `READ.LIT.L04.03`, `READ.FLU.L04.03`). They are **proposed** here and are added only with `tools/core/add-skill.js`.

### Grade 2 (L03)

**Chapter book:** C1 *The Shabbos Street Club and the Missing Map* (10 chapters, about 300–450 words each). Naftali finds half of an old map in his Zeidy's workshop; the club follows it around the neighborhood to a surprise for the whole shul.
**Topic sets:** Animals in winter (2.2) · From wheat to challah (2.4) · Our shul and our neighborhood (2.7).

#### Unit 2.1 · Story detectives (ask and answer) · Book C1 ch. 1–2
| # | Id | Small skill | Std | Status | Min | Ways |
|---|---|---|---|---|---|---|
| 1 | READ.COMP.L03.04 | Ask questions before and while you read | RL.2.1 | new | 8 | W, S, M |
| 2 | READ.COMP.L03.05 | Who, what, where, when: find it in the story | RL.2.1 | new | 8 | E, P, R |
| 3 | READ.COMP.L03.06 | Why and how: the answer is in the words | RL.2.1, RI.2.1 | new | 8 | E, Y, M |
| 4 | READ.LIT.L03.01 | Retell It: beginning, middle, end | RL.2.2 | rebuild | 8 | P, S, R |
Real reading: Book C1 ch. 1–2 · 2 short stories · unit check 2.1.

#### Unit 2.2 · What is it all about? (main topic) · topic set: Animals in winter
| # | Id | Small skill | Std | Status | Min | Ways |
|---|---|---|---|---|---|---|
| 5 | READ.COMP.L03.01 | Main Topic of a whole text | RI.2.2 | rebuild | 8 | W, K, M |
| 6 | READ.COMP.L03.07 | The focus of each paragraph | RI.2.2 | new | 8 | P, E, Y |
| 7 | READ.COMP.L03.02 | Text Tools: headings, captions, bold words | RI.2.5 | rebuild | 8 | W, R, S |
| 8 | READ.COMP.L03.08 | Pictures help me understand | RI.2.7 | new | 8 | P, L, M |
Real reading: 3 texts (bears sleep, birds fly south, squirrels store food) · unit check 2.2.

#### Unit 2.3 · How characters feel and act · Book C1 ch. 3–5
| # | Id | Small skill | Std | Status | Min | Ways |
|---|---|---|---|---|---|---|
| 9 | READ.LIT.L03.02 | How a character responds to a problem | RL.2.3 | new | 8 | E, Y, T |
| 10 | READ.LIT.L03.03 | Feelings in the words: said, shouted, whispered | RL.2.6 | new | 8 | T, L, M |
| 11 | READ.LIT.L03.04 | Beginning and end: how the story starts and wraps up | RL.2.5 | new | 8 | P, W, R |
| 12 | READ.LIT.L03.05 | Different voices for different characters | RL.2.6 | new | 8 | T, C, S |
Real reading: Book C1 ch. 3–5 · Readers' Theatre `F.RT.02` (reused) · unit check 2.3.

#### Unit 2.4 · How things happen (steps and connections) · topic set: From wheat to challah
| # | Id | Small skill | Std | Status | Min | Ways |
|---|---|---|---|---|---|---|
| 13 | READ.COMP.L03.03 | Read to Learn: how and why in a short article | RI.2.3 | rebuild | 8 | W, E, K |
| 14 | READ.COMP.L03.09 | Steps in order: first, next, then, last | RI.2.3 | new | 8 | P, S, M |
| 15 | READ.COMP.L03.10 | Why did the author write this? | RI.2.6 | new | 8 | Y, E, R |
| 16 | READ.COMP.L03.11 | The reasons an author gives | RI.2.8 | new | 8 | E, M, C |
Real reading: 3 texts (the wheat field, the mill, the bakery on Shabbos Street) · unit check 2.4.

#### Unit 2.5 · Lessons in stories (fables) · tales set
| # | Id | Small skill | Std | Status | Min | Ways |
|---|---|---|---|---|---|---|
| 17 | READ.LIT.L03.06 | The lesson of a fable | RL.2.2 | new | 8 | W, Y, S |
| 18 | READ.LIT.L03.07 | Two tellings of the same story | RL.2.9 | new | 8 | P, C, M |
| 19 | READ.LIT.L03.08 | Words that sing: rhyme, beat and repeated lines | RL.2.4 | new | 8 | L, S, R |
Real reading: 3 fables adapted from Aesop (public domain) · 1 poem · unit check 2.5.

#### Unit 2.6 · Story parts and the whole story · Book C1 ch. 6–8
| # | Id | Small skill | Std | Status | Min | Ways |
|---|---|---|---|---|---|---|
| 20 | READ.LIT.L03.09 | Problem and solution | RL.2.5 | new | 8 | P, E, M |
| 21 | READ.LIT.L03.10 | Pictures and words tell the story together | RL.2.7 | new | 8 | P, L, Y |
| 22 | READ.COMP.L03.12 | Find the proof: tap the sentence | RL.2.1 | new | 8 | E, R, C |
Real reading: Book C1 ch. 6–8 · unit check 2.6.

#### Unit 2.7 · Two texts, one topic · topic set: Our shul and our neighborhood
| # | Id | Small skill | Std | Status | Min | Ways |
|---|---|---|---|---|---|---|
| 23 | READ.COMP.L03.13 | Same and different: two texts on one topic | RI.2.9 | new | 8 | P, K, Y |
| 24 | READ.COMP.L03.14 | Find it fast: table of contents, glossary, index | RI.2.5 | new | 8 | W, S, M |
| 25 | READ.COMP.L03.15 | Ask, then look back to answer | RI.2.1 | new | 8 | E, RT, R |
Real reading: 3 texts (the shul library, the corner grocery, the mail carrier) · unit check 2.7.

#### Unit 2.8 · The whole book · Book C1 ch. 9–10
| # | Id | Small skill | Std | Status | Min | Ways |
|---|---|---|---|---|---|---|
| 26 | READ.LIT.L03.11 | Keep track of a chapter book | RL.2.10 | new | 8 | P, R, C |
| 27 | READ.LIT.L03.12 | The big lesson of the book | RL.2.2 | new | 8 | Y, E, S |
| 28 | READ.LIT.L03.13 | Compare two characters | RL.2.3, RL.2.9 | new | 8 | P, C, M |
| 29 | READ.COMP.L03.16 | Retell an article in my own words | RI.2.2 | new | 8 | W, R, Y |
| 30 | READ.LIT.L03.14 | Book club: talk about the book with a chavrusa | RL.2.10, SL.2.1 | new | 8 | C, RT, S |
Real reading: Book C1 ch. 9–10 · unit check 2.8 (the whole year).

### Grade 3 (L04)

**Chapter book:** C2 *The Shabbos Street Club and the Clock Tower Mystery* (12 chapters, about 500–700 words each). The old clock on the shul tower stops before Chanukah; Chaim, Avi, Naftali and Dovid, now a year older, work with Naftali's Zeidy to find out why.
**Topic sets:** Animals that build (3.2) · Trains and how they work (3.4) · Inventions in our home (3.6) · Rivers and bridges of Baltimore (3.7).

#### Unit 3.1 · Prove it from the text · Book C2 ch. 1–3
| # | Id | Small skill | Std | Status | Min | Ways |
|---|---|---|---|---|---|---|
| 1 | READ.COMP.L04.01 | Five Questions: who, what, where, when, why | RL.3.1 | rebuild | 8 | W, E, R |
| 2 | READ.COMP.L04.02 | Point to the proof | RL.3.1, RI.3.1 | new | 8 | E, Y, M |
| 3 | READ.LIT.L04.03 | Recount a story in order | RL.3.2 | new | 8 | P, S, R |
| 4 | READ.FLU.L04.03 | Read it like talking: phrasing | RF.3.4 | new | 8 | L, T, S |

#### Unit 3.2 · Main idea and key details · topic set: Animals that build
| # | Id | Small skill | Std | Status | Min | Ways |
|---|---|---|---|---|---|---|
| 5 | READ.COMP.L04.03 | The main idea of a short article | RI.3.2 | new | 8 | W, K, M |
| 6 | READ.COMP.L04.04 | Key details that hold it up | RI.3.2 | new | 8 | P, E, Y |
| 7 | READ.COMP.L04.05 | Words in a science text | RI.3.4 | new | 8 | E, R, C |
| 8 | READ.FLU.L04.04 | Read a fact text smoothly: numbers and names | RF.3.4 | new | 8 | L, F, W |

#### Unit 3.3 · Characters: traits, feelings, reasons · Book C2 ch. 4–6
| # | Id | Small skill | Std | Status | Min | Ways |
|---|---|---|---|---|---|---|
| 9 | READ.LIT.L04.02 | Character Clues: traits and reasons | RL.3.3 | rebuild | 8 | E, Y, P |
| 10 | READ.LIT.L04.04 | How a character's actions move the story | RL.3.3 | new | 8 | P, M, R |
| 11 | READ.LIT.L04.05 | Chapters build on each other | RL.3.5 | new | 8 | P, W, C |
| 12 | READ.FLU.L04.05 | Read with feeling: dialogue | RF.3.4 | new | 8 | T, L, S |

#### Unit 3.4 · Text features and search tools · topic set: Trains and how they work
| # | Id | Small skill | Std | Status | Min | Ways |
|---|---|---|---|---|---|---|
| 13 | READ.COMP.L04.06 | Text features: captions, labels, sidebars | RI.3.5 | new | 8 | W, K, M |
| 14 | READ.COMP.L04.07 | Search tools: keywords and links | RI.3.5 | new | 8 | P, S, R |
| 15 | READ.COMP.L04.08 | Maps, diagrams and photos | RI.3.7 | new | 8 | P, E, Y |
| 16 | READ.COMP.L04.09 | Steps in a process, in order | RI.3.3 | new | 8 | P, R, M |

#### Unit 3.5 · Message, lesson, moral · tales set
| # | Id | Small skill | Std | Status | Min | Ways |
|---|---|---|---|---|---|---|
| 17 | READ.LIT.L04.01 | Moral of the Story | RL.3.2 | rebuild | 8 | W, Y, S |
| 18 | READ.LIT.L04.06 | How the details show the lesson | RL.3.2 | new | 8 | E, M, C |
| 19 | READ.LIT.L04.07 | Stanzas, scenes and chapters | RL.3.5 | new | 8 | P, T, L |
| 20 | READ.LIT.L04.08 | Literal and not literal | RL.3.4 | new | 8 | Y, M, R |

#### Unit 3.6 · Cause, effect and comparison · topic set: Inventions in our home
| # | Id | Small skill | Std | Status | Min | Ways |
|---|---|---|---|---|---|---|
| 21 | READ.COMP.L04.10 | Cause and effect | RI.3.3, RI.3.8 | new | 8 | P, E, Y |
| 22 | READ.COMP.L04.11 | First, then, after that: time order | RI.3.8 | new | 8 | P, S, R |
| 23 | READ.COMP.L04.12 | Compare: same and different | RI.3.8 | new | 8 | P, K, M |
| 24 | READ.FLU.L04.06 | Fix it as you go: self-correct | RF.3.4 | new | 8 | L, M, F |

#### Unit 3.7 · Whose view? · topic set: Rivers and bridges of Baltimore · Book C2 ch. 7–9
| # | Id | Small skill | Std | Status | Min | Ways |
|---|---|---|---|---|---|---|
| 25 | READ.LIT.L04.09 | My view and the narrator's view | RL.3.6 | new | 8 | Y, C, M |
| 26 | READ.COMP.L04.13 | My view and the author's view | RI.3.6 | new | 8 | E, Y, C |
| 27 | READ.COMP.L04.14 | Two texts, one topic: the most important points | RI.3.9 | new | 8 | P, K, E |
| 28 | READ.LIT.L04.10 | Pictures add to the story | RL.3.7 | new | 8 | P, L, Y |

#### Unit 3.8 · Series and the whole book · Book C2 ch. 10–12
| # | Id | Small skill | Std | Status | Min | Ways |
|---|---|---|---|---|---|---|
| 29 | READ.LIT.L04.11 | Same characters, two books: compare | RL.3.9 | new | 8 | P, C, R |
| 30 | READ.LIT.L04.12 | Keep track of a long chapter book | RL.3.10 | new | 8 | P, R, S |
| 31 | READ.LIT.L04.13 | The book's big lesson, with proof | RL.3.2 | new | 8 | E, Y, C |
| 32 | READ.FLU.L04.07 | Readers' Theatre: a scene from the book | RF.3.4, SL.3.6 | new | 8 | T, C, L |

## 4. How each C23 lesson is built (so about 62 lessons stay even)

- **One Bite shape:** Today we learn → ready check (the skill beneath, with a bridge) → Watch me (one worked example on a short real passage, one step per tap, **with a song or a move**) → Mistake Detective (the real error boys make) → Do it with me (2) → Your turn (5) → Show me (3 tap checks) → Level clear.
- **Short real passages.** The teaching passage inside a lesson is 40–150 words. The check passage is a **different, cold** passage of the same kind. Long texts (stories, articles, chapters) load from the content store.
- **Listen first.** Every passage can be heard (the speaker button); Grade 2 lessons start each text by listening.
- **Tap kinds only**, big and clear at 390 px; no typing; no 2-choice checks.
- **No giveaways:** check answers never in Watch me or a How line; no tile order with two right answers; one story per lesson.
- **Chavrusa line** on Watch me ("Tell your chavrusa…"), and a **challenge round** after mastery.

## 5. The cast (band B23, Grades 2–3)

C23 **confirms** the B23 cast that job F proposed (`docs/core-growth/F-map.md`, section 8) and that F's little readers and plays already use:

**The Shabbos Street Club:** Naftali Rosen (builder, notebook of inventions), Avi Benhamou (joker, maps, his Saba's stories from Morocco), Chaim Weiss (reads everything, the club's "librarian"), Dovid Katz (youngest, brave, always hungry). In Grade 2 books they are 7–8; in Grade 3 books, a year older.
**Grown-ups:** Rabbi Feld (their rebbe), Naftali's Zeidy (a retired watchmaker with a workshop full of gears), Mr. Benhamou (owns the corner grocery).
**Places:** the clubhouse in the Rosens' garage, the shul and its library, the park by the river, the corner grocery.
**C23 adds** (here first, per the cast rules): **Shimon Abergel** (8, new in Grade 2 Unit 2.3 from Montreal, quiet, notices everything) and **Mr. Klein** the mail carrier. Kept the same in every text and job.

**Rules:** modest, warm, normal frum family life; Shabbos and Yom Tov; kosher food; davening and learning are part of the day, not the lesson's point; **pictures show boys and men only**; never the Divine Name (ה׳ in Hebrew, "Hashem" in English).

## 6. Picture orders
Each unit opener and each book chapter gets one picture, ordered in `docs/core-growth/C23-picture-orders.md` in the format of `docs/core-growth/F-picture-orders.md`, using the cast notes above. Until they arrive, screens use emoji and code-drawn story maps, never an empty box.

## 7. The order I build in
1. This map and the ledger (docs only).
2. **Unit 2.1**, then **Unit 3.1** (lessons, texts, unit checks), each its own PR.
3. Then 2.2 + 3.2, and so on. Book chapters are written with the unit that reads them.

Each lesson PR: a fresh reviewer's 9-point score table (all 4–5), pictures at 1366×768 and 390 px, and the ledger total.

## 8. Helpers wanted (also on the lanes file, once Unit 2.1 sets the pattern)
- C23 · Grade 2, Units 2.5–2.8.
- C23 · Grade 3, Units 3.5–3.8.
- C23 · Grade 3 fluency passages (16, from the unit texts).
