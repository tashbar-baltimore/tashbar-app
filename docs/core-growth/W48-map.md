# Job W48 · Writing, Grades 4–8: the skill map (2026-11-24)

Owner: job W48 (see `docs/CORE-GROWTH-LANES.md`). Binding rules: `CLAUDE.md`, `docs/CORE-GROWTH-PROMPT.md`. Where they differ, CLAUDE.md wins.

**The HoS's words (2026-11-24):** "Beef up all their lessons to contain about a half a year's worth of work … the variety of different ways to learn based on proven research … reflective of the age and the skills being taught … no downtime and fluff and boringness … we want to keep it exciting."

**My one-line check for every W48 PR:** *Does a Grade 4–8 boy now have more real, new writing to learn and do (small skills he uses at once in real pieces a teacher reads), at an even high quality, exciting, with no filler?*

## 1. What W48 covers, and what it does not

| W48 builds | Another job builds |
|---|---|
| Writing a whole piece: paragraphs, then multi-paragraph pieces | Sentence grammar, combining, expansion, mechanics, vocabulary (job **G**, `LANG.*`) |
| Opinion (Gr 4–5) and argument (Gr 6–8) | Reading the texts boys write about (jobs **C45**, **C68**) |
| Information writing and short research | The Writing Workshop screens and the teacher writing inbox (job **T**) |
| Narrative (true and made-up stories) | Science and Social Studies topic sets (job **S**) |
| Planning, revising, editing a whole piece; writing about reading | Writing K–3 (job **W13**) |

**Where the line with job G is:** G teaches a sentence skill (for example "combine with *although*"). W48 teaches *when and why* a writer uses it inside a piece (for example "a counterclaim sentence starts with *although*"). W48 uses only the strands `WRIT.PARA`, `WRIT.ESSAY`, `WRIT.RES` and, for whole-piece sentence craft only (strong openings, variety for effect), `WRIT.SENT`.

**Levels:** Level = grade + 1. Grade 4 = L05, Grade 5 = L06, Grade 6 = L07, Grade 7 = L08, Grade 8 = L09.

## 2. How much W48 builds (per grade, for the half year)

Writing is about a quarter of the core day. The other three quarters are reading, comprehension, grammar and words (jobs C and G).

| Per grade | Gr 4 (L05) | Gr 5 (L06) | Gr 6 (L07) | Gr 7 (L08) | Gr 8 (L09) |
|---|---|---|---|---|---|
| Units | 5 | 5 | 5 | 5 | 5 |
| Small skill lessons (7–10 min) | 32 | 30 | 27 | 25 | 23 |
| Writing pieces (plan → draft → revise → publish, over several days; 75 min each in Gr 4–5, 90 in Gr 6–8) | 12 | 12 | 10 | 10 | 10 |
| Quick writes (2–5 sentences on a text he read; 6 min in Gr 4–5, 7 in Gr 6–8) | 30 | 30 | 25 | 25 | 25 |
| Unit checks (~10 min) | 5 | 5 | 5 | 5 | 5 |
| **Expected hours for a typical boy** | **≈ 23** | **≈ 23** | **≈ 23** | **≈ 22** | **≈ 22** |

The running total is kept in `docs/core-growth/W48-ledger.md`. These are minimums to plan from, not quotas: a skill that is not needed is left out and the ledger says why.

**Pieces need job T's Writing Workshop and inbox.** Small skill lessons, quick-write prompts and unit checks do not, so they are built first. A piece is **never** marked right just for being typed: the teacher scores it with the rubric (section 6).

## 3. What exists today (Grades 4–8 writing)

19 skills. Only 2 have a hand-written One Bite lesson with activities; the rest play the old auto-lesson from Teacher Time. An existing lesson counts toward the ledger only once it is brought up to the standard (it then gets `do`/`your` activities in its own file, `src/OneBiteDataWrit.html`).

| Id | Name | Std | One Bite activities today | In this map |
|---|---|---|---|---|
| WRIT.PARA.L05.01 | Paragraph with transition words | W.4.2c | yes (check vs gate) | Gr 4 U1 |
| WRIT.PARA.L05.02 | Step-by-step how-to paragraph | W.4.2a | no | Gr 4 U4 |
| WRIT.PARA.L05.03 | Story with Dialogue | W.4.3b | no | Gr 4 U2 |
| WRIT.PARA.L05.04 | Opinion Paragraph | W.4.1a | no | Gr 4 U3 |
| WRIT.PARA.L05.05 | Fix It Up | W.4.5 | no | Gr 4 U1 |
| WRIT.ESSAY.L06.01 | Three-Part Piece | W.5.2a | no | Gr 5 U1 |
| WRIT.PARA.L06.01 | Summary paragraph | W.5.9 | no | Gr 5 U1 |
| WRIT.PARA.L06.02 | Letter Writer | W.5.4 | no | Gr 5 U3 |
| WRIT.ESSAY.L07.01 | State a claim with reasons | W.6.1a | no | Gr 6 U1 |
| WRIT.ESSAY.L07.02 | Quote evidence and explain it | W.6.1b | yes (check vs gate) | Gr 6 U1 |
| WRIT.ESSAY.L07.03 | Show, Don't Tell | W.6.3d | no | Gr 6 U2 |
| WRIT.SENT.L07.01 | Vary It | W.6.3 / L.6.3a | no | Gr 6 U2 |
| WRIT.ESSAY.L08.01 | Five-Paragraph Argument | W.7.1 | no | Gr 7 U1 |
| WRIT.ESSAY.L08.02 | Answer a counterclaim | W.7.1a | no | Gr 7 U1 |
| WRIT.ESSAY.L08.03 | Explain It All | W.7.2 | no | Gr 7 U2 |
| WRIT.ESSAY.L09.01 | Business writing | W.8.4 | no | Gr 8 U5 |
| WRIT.RES.L09.01 | Find and judge sources | W.8.8 | no | Gr 8 U4 |
| WRIT.RES.L09.02 | Paraphrase and cite | W.8.8 | no | Gr 8 U4 |
| WRIT.RES.L09.03 | Short research report | W.8.7 | no | Gr 8 U4 |

**Also known:** PR #180 (on `hold`, an older lane) holds 16 L04–L05 Writing and Language One Bite lessons. Before W48 upgrades an L05 lesson in `OneBiteDataWrit.html`, I check #180 and reuse what is good, so no work is lost or done twice.

**What is missing:** almost everything. Grades 4–8 have about 4 writing skills per grade and no real pieces a teacher reads. Missing in every grade: planning a piece, intros and conclusions, elaboration, organizing a multi-paragraph piece, narrative craft, research steps, and revising a whole piece.

## 4. The units, grade by grade

Each unit: **opener** → **small skills** (in this order) → **the real task** (pieces) → **unit check** (8–12 tap questions, 2–3 from earlier units). A **test-out** pre-check comes first, so a boy skips skills he already shows.

**Ids:** "new" ids below are the next free numbers *today*. The real id is taken with `node tools/core/add-skill.js next <prefix>` (job T) at build time, so the numbers may shift. Minutes are for a typical boy.

**Ways of learning:** every unit uses at least 4 of these, and no two lessons in a row have the same shape: **SRSD memory strategy** (POW, TREE, WWW, TIDE, and for Gr 6–8 their grown-up forms), **mentor text** (study a short good model first), **worked example with fading**, **Mistake Detective**, **build and sort** (sentence strips, paragraph puzzles, organizers), **evidence tap** (tap the sentence that proves it), **tap the reason** (Gr 4–5), **teach it back / chavrusa** (Gr 6–8), **retrieval** (warm-ups and unit checks), **choice** (a challenge round after mastery; choose the topic).

---

### Grade 4 (L05) · "Glen Avenue Gazette"

**U1 · Paragraph Power** (W.4.2a, W.4.2c, W.4.4, W.4.5)
Opener: the Glen Avenue Crew start a club newsletter, the *Glen Avenue Gazette*, and every page needs a strong paragraph.

| # | Id | Game name | He learns to … | Std | Status | Min |
|---|---|---|---|---|---|---|
| 1 | WRIT.PARA.L05.06 *(new)* | Umbrella Sentence | write a topic sentence that covers all the details | W.4.2a | build | 8 |
| 2 | WRIT.PARA.L05.07 *(new)* | Belongs or Not? | keep every detail on the topic; cut the one that wanders | W.4.2a | build | 7 |
| 3 | WRIT.PARA.L05.08 *(new)* | Say More | stretch a detail with an example or a fact ("For example, …") | W.4.2b | build | 8 |
| 4 | WRIT.PARA.L05.01 | Road Sign Words | link details with transition words | W.4.2c | upgrade | 8 |
| 5 | WRIT.PARA.L05.09 *(new)* | Tie It Up | write a closing sentence that says the big idea a new way | W.4.2e | build | 7 |
| 6 | WRIT.PARA.L05.05 | Fix It Up | reread and fix a paragraph with a checklist | W.4.5 | upgrade | 8 |

Real task: **Piece 1** · one information paragraph for the newsletter on a topic from a C45 text. **Piece 2** · a "club notice" paragraph (who, what, when, why come). Quick writes: 6.

**U2 · Real Stories** (W.4.3a–e)
Opener: Tzvi Hirsch's Erev Shabbos at the bakery when everything went wrong, told two ways: flat and alive.

| # | Id | Game name | He learns to … | Std | Status | Min |
|---|---|---|---|---|---|---|
| 1 | WRIT.ESSAY.L05.01 *(new)* | POW + WWW | plan a story with POW and the W-W-W questions (SRSD) | W.4.3a | build | 9 |
| 2 | WRIT.PARA.L05.10 *(new)* | Open the Scene | start with who, where and the problem | W.4.3a | build | 8 |
| 3 | WRIT.PARA.L05.11 *(new)* | Then What? | order events with time words (first, later, just then) | W.4.3c | build | 7 |
| 4 | WRIT.PARA.L05.03 | Talking Characters | use dialogue to show what a character thinks | W.4.3b | upgrade | 8 |
| 5 | WRIT.PARA.L05.12 *(new)* | Five-Senses Camera | add sensory details the reader can see and hear | W.4.3d | build | 8 |
| 6 | WRIT.PARA.L05.13 *(new)* | Show the Feeling | show a feeling with actions, not "he was sad" | W.4.3b | build | 8 |
| 7 | WRIT.PARA.L05.14 *(new)* | Story Ending | end with how it worked out and what he learned | W.4.3e | build | 7 |

Real task: **Piece 3** · a true story ("A time I helped get ready for Yom Tov"). **Piece 4** · a made-up scene with the Glen Avenue Crew. **Piece 5** · a short journal entry from a character's view. Quick writes: 6.

**U3 · My Opinion, My Reasons** (W.4.1a–d)
Opener: the class must choose: a trip to the farm or to the aquarium. Who convinces Rabbi Feldman?

| # | Id | Game name | He learns to … | Std | Status | Min |
|---|---|---|---|---|---|---|
| 1 | WRIT.ESSAY.L05.02 *(new)* | POW + TREE | plan an opinion with TREE: Topic, Reasons, Explain, Ending (SRSD) | W.4.1a | build | 9 |
| 2 | WRIT.PARA.L05.04 | Say What You Think | state an opinion clearly in one sentence | W.4.1a | upgrade | 7 |
| 3 | WRIT.PARA.L05.15 *(new)* | Reason or Not? | tell a real reason from "because I like it" | W.4.1b | build | 8 |
| 4 | WRIT.PARA.L05.16 *(new)* | Back It Up | support a reason with a fact or detail | W.4.1b | build | 8 |
| 5 | WRIT.PARA.L05.17 *(new)* | Linking Words | join opinion and reasons (for instance, in addition, in order to) | W.4.1c | build | 7 |
| 6 | WRIT.PARA.L05.18 *(new)* | Opinion Ending | end by saying the opinion again with a push | W.4.1d | build | 7 |

Real task: **Piece 6** · an opinion piece (intro, 2–3 reason paragraphs, ending). **Piece 7** · an opinion letter to the principal or a parent. Quick writes: 6.

**U4 · Explain It** (W.4.2a–e)
Opener: the Crew build a "How it works" corner for the class museum.

| # | Id | Game name | He learns to … | Std | Status | Min |
|---|---|---|---|---|---|---|
| 1 | WRIT.ESSAY.L05.03 *(new)* | TIDE Plan | plan an information piece with TIDE: Topic, Important Details, Ending (SRSD) | W.4.2a | build | 9 |
| 2 | WRIT.PARA.L05.02 | How-To Steps | write steps in order a reader can follow | W.4.2a | upgrade | 8 |
| 3 | WRIT.ESSAY.L05.04 *(new)* | Group It | sort facts into groups; one group = one paragraph | W.4.2a | build | 8 |
| 4 | WRIT.ESSAY.L05.05 *(new)* | Headings Help | add headings and a picture with a caption | W.4.2a | build | 7 |
| 5 | WRIT.PARA.L05.19 *(new)* | Facts, Words, Quotes | develop a topic with facts, definitions and a quote | W.4.2b | build | 8 |
| 6 | WRIT.PARA.L05.20 *(new)* | Expert Words | use the exact topic word, not "thing" | W.4.2d | build | 7 |

Real task: **Piece 8** · a how-to. **Piece 9** · a multi-paragraph "All about …" piece with headings (a topic from job S or C45). **Piece 10** · a labelled diagram page with captions. Quick writes: 6.

**U5 · Little Researcher** (W.4.7, W.4.8, W.4.9, W.4.5)
Opener: a mystery question ("Why does the challah rise?") the Crew must answer from real sources.

| # | Id | Game name | He learns to … | Std | Status | Min |
|---|---|---|---|---|---|---|
| 1 | WRIT.RES.L05.01 *(new)* | Good Question | ask a research question you can answer | W.4.7 | build | 8 |
| 2 | WRIT.RES.L05.02 *(new)* | Notes, Not Copies | take notes in your own words | W.4.8 | build | 9 |
| 3 | WRIT.RES.L05.03 *(new)* | Sort Your Notes | sort notes into groups for paragraphs | W.4.8 | build | 8 |
| 4 | WRIT.RES.L05.04 *(new)* | Where I Found It | list sources (title, author) | W.4.8 | build | 7 |
| 5 | WRIT.ESSAY.L05.06 *(new)* | Revise with ARMS | revise: Add, Remove, Move, Substitute | W.4.5 | build | 9 |
| 6 | WRIT.ESSAY.L05.07 *(new)* | Edit with COPS | edit: Capitals, Order, Punctuation, Spelling | W.4.5 | build | 8 |
| 7 | WRIT.PARA.L05.21 *(new)* | Answer from the Text | answer a question about a text with a detail from it | W.4.9 | build | 8 |

Real task: **Piece 11** · a short research report (2–3 paragraphs, sources listed). **Piece 12** · a thank-you letter to someone who helped (real audience). Quick writes: 6.

Grade 4 totals: 32 small skills (5 upgrades, 27 new); 12 pieces; 30 quick writes; 5 unit checks.

---

### Grade 5 (L06) · "Glen Avenue Gazette, year 2"

**U1 · Plan the Whole Piece** (W.5.2a, W.5.2e, W.5.9, W.5.4)

| # | Id | Game name | He learns to … | Std | Status | Min |
|---|---|---|---|---|---|---|
| 1 | WRIT.ESSAY.L06.01 | Three-Part Piece | plan intro, body, conclusion | W.5.2a | upgrade | 8 |
| 2 | WRIT.ESSAY.L06.02 *(new)* | Hook the Reader | open with a question, a fact or a short scene | W.5.2a | build | 8 |
| 3 | WRIT.ESSAY.L06.03 *(new)* | Point, Proof, Explain | build a body paragraph: point, proof, explain | W.5.2b | build | 9 |
| 4 | WRIT.ESSAY.L06.04 *(new)* | Strong Finish | conclude by tying back to the hook and the big idea | W.5.2e | build | 8 |
| 5 | WRIT.PARA.L06.01 | Summary Paragraph | sum up a text: main idea and key details, no opinion | W.5.9 | upgrade | 8 |
| 6 | WRIT.PARA.L06.03 *(new)* | Who Is Reading? | change words for the reader (a friend, a teacher, a Zaidy) | W.5.4 | build | 7 |

Real task: **Piece 1** · a summary of a C45 text. **Piece 2** · a three-part information piece. Quick writes: 6.

**U2 · Stories That Pull You In** (W.5.3a–e)

| # | Id | Game name | He learns to … | Std | Status | Min |
|---|---|---|---|---|---|---|
| 1 | WRIT.ESSAY.L06.05 *(new)* | Story Mountain | plan a story: problem, rising events, turning point, end | W.5.3a | build | 9 |
| 2 | WRIT.PARA.L06.04 *(new)* | Dialogue + Action | mix what they say with what they do | W.5.3b | build | 8 |
| 3 | WRIT.PARA.L06.05 *(new)* | Slow Motion | slow down the big moment; speed past the boring part (pacing) | W.5.3b | build | 9 |
| 4 | WRIT.PARA.L06.06 *(new)* | Time Jumps | move through time with phrases and clauses (that evening, after we left) | W.5.3c | build | 7 |
| 5 | WRIT.PARA.L06.07 *(new)* | Picture Words | choose concrete words and sensory details | W.5.3d | build | 8 |
| 6 | WRIT.PARA.L06.08 *(new)* | It Follows | end with a conclusion that grows out of the events | W.5.3e | build | 7 |

Real task: **Piece 3** · a made-up story with the cast. **Piece 4** · a true story about a chesed he saw. **Piece 5** · a new ending for a story he read. Quick writes: 6.

**U3 · Opinion With Proof** (W.5.1a–d, W.5.9)

| # | Id | Game name | He learns to … | Std | Status | Min |
|---|---|---|---|---|---|---|
| 1 | WRIT.ESSAY.L06.06 *(new)* | TREE, Level 2 | plan an opinion on a text-based question | W.5.1a | build | 8 |
| 2 | WRIT.PARA.L06.09 *(new)* | Best Reason First? | put reasons in a logical order and say why | W.5.1b | build | 8 |
| 3 | WRIT.PARA.L06.10 *(new)* | Proof from the Text | support a reason with a fact or quote from a text | W.5.1b | build | 9 |
| 4 | WRIT.PARA.L06.11 *(new)* | Because, So, Therefore | link with phrases and clauses (consequently, specifically) | W.5.1c | build | 7 |
| 5 | WRIT.PARA.L06.02 | Letter Writer | write a letter with the right parts and tone | W.5.4 | upgrade | 8 |
| 6 | WRIT.PARA.L06.12 *(new)* | Ending That Pushes | conclude with a call to act or to think | W.5.1d | build | 7 |

Real task: **Piece 6** · an opinion essay on a text question. **Piece 7** · a letter to the editor of the class paper. Quick writes: 6.

**U4 · Explain and Compare** (W.5.2a–d, W.5.9)

| # | Id | Game name | He learns to … | Std | Status | Min |
|---|---|---|---|---|---|---|
| 1 | WRIT.ESSAY.L06.07 *(new)* | Same and Different | plan a compare-and-contrast piece (block or point by point) | W.5.2a | build | 9 |
| 2 | WRIT.PARA.L06.13 *(new)* | In Contrast | link across ideas (in contrast, similarly, especially) | W.5.2c | build | 7 |
| 3 | WRIT.PARA.L06.14 *(new)* | Quote It Right | put a short quote in a sentence and say who said it | W.5.2b | build | 8 |
| 4 | WRIT.PARA.L06.15 *(new)* | Define It | explain a hard word for the reader inside the sentence | W.5.2b | build | 7 |
| 5 | WRIT.PARA.L06.16 *(new)* | Exact Words | swap vague words for precise topic words | W.5.2d | build | 7 |
| 6 | WRIT.ESSAY.L06.08 *(new)* | Two Texts, One Piece | use details from two texts on one topic | W.5.9 | build | 9 |

Real task: **Piece 8** · a compare-and-contrast essay from two texts. **Piece 9** · an information piece with headings and a diagram. Quick writes: 6.

**U5 · Research Team** (W.5.7, W.5.8, W.5.5)

| # | Id | Game name | He learns to … | Std | Status | Min |
|---|---|---|---|---|---|---|
| 1 | WRIT.RES.L06.01 *(new)* | Many Sources | find the answer in more than one source | W.5.7 | build | 8 |
| 2 | WRIT.RES.L06.02 *(new)* | Paraphrase It | say it in your own words, and keep the meaning | W.5.8 | build | 9 |
| 3 | WRIT.RES.L06.03 *(new)* | Note Cards | one fact per card, with its source | W.5.8 | build | 8 |
| 4 | WRIT.RES.L06.04 *(new)* | Source List | write a simple source list | W.5.8 | build | 7 |
| 5 | WRIT.ESSAY.L06.09 *(new)* | Revise the Whole Thing | revise for order and missing parts, not only spelling | W.5.5 | build | 9 |
| 6 | WRIT.ESSAY.L06.10 *(new)* | Peer Feedback | give a chavrusa one praise, one question, one push | W.5.5 | build | 8 |

Real task: **Piece 10** · a research report (3–4 paragraphs, source list). **Piece 11** · a "how we found out" research journal. **Piece 12** · a published piece for "My book" chosen from the year, revised again. Quick writes: 6.

Grade 5 totals: 30 small skills (3 upgrades, 27 new); 12 pieces; 30 quick writes; 5 unit checks.

---

### Grade 6 (L07) · "The Beacon" (the boys' class newspaper)

**U1 · Make Your Case** (W.6.1a–e)

| # | Id | Game name | He learns to … | Std | Status | Min |
|---|---|---|---|---|---|---|
| 1 | WRIT.ESSAY.L07.01 | Claim and Reasons | state a claim and the reasons for it | W.6.1a | upgrade | 9 |
| 2 | WRIT.ESSAY.L07.04 *(new)* | Fact or Opinion Evidence | choose relevant, credible evidence | W.6.1b | build | 9 |
| 3 | WRIT.ESSAY.L07.02 | Quote and Explain | quote evidence, then explain how it proves the claim | W.6.1b | upgrade | 9 |
| 4 | WRIT.PARA.L07.01 *(new)* | Glue Between Reasons | clarify how claim and reasons connect (as a result, this shows) | W.6.1c | build | 8 |
| 5 | WRIT.PARA.L07.02 *(new)* | Formal Voice | keep a formal style (no slang, no "you guys") | W.6.1d | build | 8 |
| 6 | WRIT.PARA.L07.03 *(new)* | Close the Case | conclude by following from the argument | W.6.1e | build | 8 |

Real task: **Piece 1** · an argument essay for The Beacon. **Piece 2** · a short speech for a class debate (read aloud at home). Quick writes: 5.

**U2 · Narrative Craft** (W.6.3a–e)

| # | Id | Game name | He learns to … | Std | Status | Min |
|---|---|---|---|---|---|---|
| 1 | WRIT.ESSAY.L07.05 *(new)* | Hook and Orient | open a story so the reader knows who, where, and why to care | W.6.3a | build | 9 |
| 2 | WRIT.ESSAY.L07.06 *(new)* | Whose Eyes? | choose a point of view and keep it | W.6.3a | build | 8 |
| 3 | WRIT.ESSAY.L07.03 | Show, Don't Tell | show with action, dialogue and detail | W.6.3d | upgrade | 9 |
| 4 | WRIT.PARA.L07.04 *(new)* | Meanwhile, Elsewhere | signal a shift in time or place | W.6.3c | build | 8 |
| 5 | WRIT.SENT.L07.01 | Vary It | vary sentence length and openings for effect | W.6.3 | upgrade | 8 |
| 6 | WRIT.PARA.L07.05 *(new)* | Ending That Lands | end with reflection or a resolution that fits | W.6.3e | build | 8 |

Real task: **Piece 3** · a narrative (true or made up). **Piece 4** · a "reporter's scene": a real event retold as a story for The Beacon. Quick writes: 5.

**U3 · The Informative Essay** (W.6.2a–f)

| # | Id | Game name | He learns to … | Std | Status | Min |
|---|---|---|---|---|---|---|
| 1 | WRIT.ESSAY.L07.07 *(new)* | Pick the Pattern | organize by definition, classification, compare, or cause-effect | W.6.2a | build | 9 |
| 2 | WRIT.ESSAY.L07.08 *(new)* | Thesis Sentence | write a thesis that previews the essay | W.6.2a | build | 9 |
| 3 | WRIT.PARA.L07.06 *(new)* | Develop the Point | develop with facts, definitions, details, quotes, examples | W.6.2b | build | 9 |
| 4 | WRIT.PARA.L07.07 *(new)* | Smooth Transitions | link paragraphs, not just sentences | W.6.2c | build | 8 |
| 5 | WRIT.PARA.L07.08 *(new)* | Charts and Captions | add a graphic that adds information, with a caption | W.6.2a | build | 8 |
| 6 | WRIT.PARA.L07.09 *(new)* | So What? | conclude with why the topic matters | W.6.2f | build | 8 |

Real task: **Piece 5** · an informative essay (topic from job S or C68). **Piece 6** · a Beacon feature with a chart. Quick writes: 5.

**U4 · Research Desk** (W.6.7, W.6.8)

| # | Id | Game name | He learns to … | Std | Status | Min |
|---|---|---|---|---|---|---|
| 1 | WRIT.RES.L07.01 *(new)* | Narrow the Question | turn a big topic into a question one report can answer | W.6.7 | build | 8 |
| 2 | WRIT.RES.L07.02 *(new)* | Can I Trust It? | judge if a source is credible | W.6.8 | build | 9 |
| 3 | WRIT.RES.L07.03 *(new)* | Quote or Paraphrase? | choose when to quote and when to paraphrase | W.6.8 | build | 9 |
| 4 | WRIT.RES.L07.04 *(new)* | Credit the Source | give basic source information | W.6.8 | build | 8 |
| 5 | WRIT.RES.L07.05 *(new)* | Notes to Outline | turn notes into an outline | W.6.7 | build | 9 |

Real task: **Piece 7** · a short research report. **Piece 8** · an interview write-up (he interviews a family member; written as Q and A). Quick writes: 5.

**U5 · Writing About Reading** (W.6.9, W.6.5)

| # | Id | Game name | He learns to … | Std | Status | Min |
|---|---|---|---|---|---|---|
| 1 | WRIT.ESSAY.L07.09 *(new)* | Claim About a Character | make a claim about a character, with proof | W.6.9 | build | 9 |
| 2 | WRIT.PARA.L07.10 *(new)* | RACE Answer | Restate, Answer, Cite, Explain in a short answer | W.6.9 | build | 9 |
| 3 | WRIT.PARA.L07.11 *(new)* | The Author's Craft | write about why an author made a choice | W.6.9 | build | 9 |
| 4 | WRIT.ESSAY.L07.10 *(new)* | Revise for Argument | revise: is every paragraph proving the claim? | W.6.5 | build | 9 |

Real task: **Piece 9** · a literary response essay. **Piece 10** · a book review for The Beacon. Quick writes: 5.

Grade 6 totals: 27 small skills (4 upgrades, 23 new); 10 pieces; 25 quick writes; 5 unit checks.

---

### Grade 7 (L08) · "The Beacon, year 2"

**U1 · Argument, Both Sides** (W.7.1a–e)

| # | Id | Game name | He learns to … | Std | Status | Min |
|---|---|---|---|---|---|---|
| 1 | WRIT.ESSAY.L08.01 | Five-Paragraph Argument | plan an argument with a claim, reasons and evidence | W.7.1a | upgrade | 9 |
| 2 | WRIT.ESSAY.L08.02 | Answer a Counterclaim | name the other side, then answer it | W.7.1a | upgrade | 9 |
| 3 | WRIT.PARA.L08.01 *(new)* | Logical Steps | show the reasoning: because this, therefore that | W.7.1b | build | 9 |
| 4 | WRIT.PARA.L08.02 *(new)* | Accurate Sources | use accurate, credible sources, and say where they come from | W.7.1b | build | 8 |
| 5 | WRIT.PARA.L08.03 *(new)* | Cohesion Words | link claims, counterclaims, reasons and evidence | W.7.1c | build | 8 |
| 6 | WRIT.PARA.L08.04 *(new)* | Argument Ending | conclude by following from and supporting the argument | W.7.1e | build | 8 |

Real task: **Piece 1** · an argument essay with a counterclaim. **Piece 2** · a debate speech, with the other side's best point answered. Quick writes: 5.

**U2 · Explain with Depth** (W.7.2a–f)

| # | Id | Game name | He learns to … | Std | Status | Min |
|---|---|---|---|---|---|---|
| 1 | WRIT.ESSAY.L08.03 | Explain It All | plan an informative essay that previews what follows | W.7.2a | upgrade | 9 |
| 2 | WRIT.ESSAY.L08.04 *(new)* | Cause and Effect | organize by cause and effect | W.7.2a | build | 9 |
| 3 | WRIT.PARA.L08.05 *(new)* | Precise and Technical | use precise language and topic words | W.7.2d | build | 8 |
| 4 | WRIT.PARA.L08.06 *(new)* | Objective Tone | keep a formal, objective tone (no "I think" in an information piece) | W.7.2e | build | 8 |
| 5 | WRIT.PARA.L08.07 *(new)* | Bring It Home | conclude by supporting the information presented | W.7.2f | build | 8 |

Real task: **Piece 3** · a cause-and-effect essay. **Piece 4** · an explainer for younger boys (Grade 3 readers: same facts, simpler words). Quick writes: 5.

**U3 · Story Architect** (W.7.3a–e)

| # | Id | Game name | He learns to … | Std | Status | Min |
|---|---|---|---|---|---|---|
| 1 | WRIT.ESSAY.L08.05 *(new)* | Plot Plan | plan a plot that builds tension | W.7.3a | build | 9 |
| 2 | WRIT.PARA.L08.08 *(new)* | Character by Dialogue | show who a character is by how he speaks | W.7.3b | build | 8 |
| 3 | WRIT.PARA.L08.09 *(new)* | Flashback | use a flashback and signal it clearly | W.7.3c | build | 9 |
| 4 | WRIT.PARA.L08.10 *(new)* | Precise Detail | choose the one detail that captures the action | W.7.3d | build | 8 |
| 5 | WRIT.PARA.L08.11 *(new)* | Reflective Ending | end by reflecting on what it meant | W.7.3e | build | 8 |

Real task: **Piece 5** · a narrative with a flashback. **Piece 6** · a historical-fiction scene from a C68 or S topic. Quick writes: 5.

**U4 · Research Project** (W.7.7, W.7.8)

| # | Id | Game name | He learns to … | Std | Status | Min |
|---|---|---|---|---|---|---|
| 1 | WRIT.RES.L08.01 *(new)* | More Questions | let one answer lead to sharper questions | W.7.7 | build | 8 |
| 2 | WRIT.RES.L08.02 *(new)* | Search Smart | choose search words and judge results | W.7.8 | build | 8 |
| 3 | WRIT.RES.L08.03 *(new)* | No Copying | quote or paraphrase without plagiarism | W.7.8 | build | 9 |
| 4 | WRIT.RES.L08.04 *(new)* | Cite It | cite in a standard format | W.7.8 | build | 8 |
| 5 | WRIT.RES.L08.05 *(new)* | Synthesize | combine what several sources say | W.7.7 | build | 9 |

Real task: **Piece 7** · a research report from several sources. **Piece 8** · a research poster page (headings, chart, sources). Quick writes: 5.

**U5 · Two Texts, One Essay** (W.7.9, W.7.5)

| # | Id | Game name | He learns to … | Std | Status | Min |
|---|---|---|---|---|---|---|
| 1 | WRIT.ESSAY.L08.06 *(new)* | Compare Two Texts | compare how two texts treat one topic | W.7.9 | build | 9 |
| 2 | WRIT.PARA.L08.12 *(new)* | Theme Statement | write a theme claim and prove it | W.7.9 | build | 9 |
| 3 | WRIT.ESSAY.L08.07 *(new)* | Revise for Reader | revise: what will confuse the reader? | W.7.5 | build | 9 |
| 4 | WRIT.ESSAY.L08.08 *(new)* | Edit Like a Pro | edit a whole piece in three passes | W.7.5 | build | 8 |

Real task: **Piece 9** · a compare-two-texts essay. **Piece 10** · a published Beacon piece for "My book", revised again. Quick writes: 5.

Grade 7 totals: 25 small skills (3 upgrades, 22 new); 10 pieces; 25 quick writes; 5 unit checks.

---

### Grade 8 (L09) · "The Beacon, editors' year"

**U1 · Argument That Holds Up** (W.8.1a–e)

| # | Id | Game name | He learns to … | Std | Status | Min |
|---|---|---|---|---|---|---|
| 1 | WRIT.ESSAY.L09.02 *(new)* | Claim vs Counterclaim | distinguish his claim from other claims | W.8.1a | build | 9 |
| 2 | WRIT.ESSAY.L09.03 *(new)* | Rebuttal | answer the other side with evidence | W.8.1a | build | 9 |
| 3 | WRIT.PARA.L09.01 *(new)* | Spot the Weak Link | find a weak reason or a reasoning mistake | W.8.1b | build | 9 |
| 4 | WRIT.PARA.L09.02 *(new)* | Evidence Ladder | rank evidence from weak to strong | W.8.1b | build | 9 |
| 5 | WRIT.PARA.L09.03 *(new)* | Connect the Logic | show how claims, counterclaims and evidence relate | W.8.1c | build | 8 |
| 6 | WRIT.PARA.L09.04 *(new)* | Final Word | conclude by following from the argument | W.8.1e | build | 8 |

Real task: **Piece 1** · an argument essay with a rebuttal. **Piece 2** · an op-ed for The Beacon. Quick writes: 5.

**U2 · Informative Synthesis** (W.8.2a–f)

| # | Id | Game name | He learns to … | Std | Status | Min |
|---|---|---|---|---|---|---|
| 1 | WRIT.ESSAY.L09.04 *(new)* | Big Idea, Many Parts | organize ideas into broad categories | W.8.2a | build | 9 |
| 2 | WRIT.PARA.L09.05 *(new)* | Well-Chosen Facts | pick the most relevant, well-chosen facts | W.8.2b | build | 9 |
| 3 | WRIT.PARA.L09.06 *(new)* | Varied Transitions | create cohesion with varied transitions | W.8.2c | build | 8 |
| 4 | WRIT.PARA.L09.07 *(new)* | Implications | conclude with what it means and why it matters | W.8.2f | build | 8 |

Real task: **Piece 3** · an informative synthesis essay from 3 texts. **Piece 4** · a "how it works" explainer with a diagram. Quick writes: 5.

**U3 · Voice and Reflection** (W.8.3a–e)

| # | Id | Game name | He learns to … | Std | Status | Min |
|---|---|---|---|---|---|---|
| 1 | WRIT.ESSAY.L09.05 *(new)* | Memoir Moment | choose a small true moment that means something big | W.8.3a | build | 9 |
| 2 | WRIT.PARA.L09.08 *(new)* | Two Time Frames | move between then and now, and signal it | W.8.3c | build | 9 |
| 3 | WRIT.PARA.L09.09 *(new)* | Voice | sound like a real person: word choice and rhythm | W.8.3d | build | 8 |
| 4 | WRIT.PARA.L09.10 *(new)* | Reflection | end by reflecting on what he learned | W.8.3e | build | 8 |

Real task: **Piece 5** · a memoir. **Piece 6** · a tribute to a grandparent or teacher (real audience). Quick writes: 5.

**U4 · Research Paper** (W.8.7, W.8.8)

| # | Id | Game name | He learns to … | Std | Status | Min |
|---|---|---|---|---|---|---|
| 1 | WRIT.RES.L09.01 | Find and Judge Sources | find sources and judge if they are credible | W.8.8 | upgrade | 9 |
| 2 | WRIT.RES.L09.02 | Paraphrase and Cite | paraphrase and cite correctly | W.8.8 | upgrade | 9 |
| 3 | WRIT.RES.L09.04 *(new)* | Focused Questions | generate focused follow-up questions | W.8.7 | build | 8 |
| 4 | WRIT.RES.L09.05 *(new)* | Works Cited | write a works-cited list in a standard format | W.8.8 | build | 8 |
| 5 | WRIT.RES.L09.03 | Short Research Report | put it all together in a report | W.8.7 | upgrade | 9 |

Real task: **Piece 7** · a research paper (4–5 paragraphs, works cited). **Piece 8** · a research presentation script. Quick writes: 5.

**U5 · Writing for the Real World** (W.8.4, W.8.5)

| # | Id | Game name | He learns to … | Std | Status | Min |
|---|---|---|---|---|---|---|
| 1 | WRIT.ESSAY.L09.01 | Business Letter | write a clear, polite business letter or email | W.8.4 | upgrade | 9 |
| 2 | WRIT.ESSAY.L09.06 *(new)* | Speech That Moves | write a short speech: hook, three points, close | W.8.4 | build | 9 |
| 3 | WRIT.PARA.L09.11 *(new)* | Cut the Extra | make writing concise | W.8.5 | build | 8 |
| 4 | WRIT.ESSAY.L09.07 *(new)* | Editor's Desk | revise someone else's piece and explain the changes | W.8.5 | build | 9 |

Real task: **Piece 9** · a formal letter or email to a real person (a sponsor, a rav, a company). **Piece 10** · a graduation-style speech for "My book". Quick writes: 5.

Grade 8 totals: 23 small skills (4 upgrades, 19 new); 10 pieces; 25 quick writes; 5 unit checks.

---

**All grades:** 137 small skills (19 upgrades, 118 new), 54 pieces, 135 quick writes, 25 unit checks. The ledger shows the hours.

## 5. How a W48 small skill lesson looks (One Bite shape)

Today we learn → ready check → **Watch me** (a mentor text or worked example, one step per tap) → **Mistake Detective** (the real mistake boys make, for example "a reason that is only 'because I like it'") → **Do it with me** (2 activities, steps showing) → **Your turn** (5 hands-on activities: sort, match, put in order, build, find them all) → **Show me** (3 tap checks on a fresh, "cold" passage) → **Level clear** with one line on what he can now do, and the **use it now** step: he writes one or two sentences with the skill about a text he read (it goes to the teacher, not scored right/wrong).

- **Gr 4–5 (E45):** "tap the reason" after a right answer ("Why is this the best topic sentence?").
- **Gr 6–8 (M68):** teach-it-back ("Tell your chavrusa the 4 parts of RACE"), calmer screens, real-world art.
- Passages are grade-level length (section 2 of the prompt). A Grade 7 lesson works on a full paragraph or two, not on single sentences.
- No plain multiple choice in practice; checks are tap kinds; every item has a "How to do it" box that never gives the answer.

## 6. Writing pieces and the teacher's rubric

Each piece is played in job T's Writing Workshop: **Plan** (the unit's SRSD organizer) → **Draft** → **Revise** (a checklist he must meet: for example "my reason has a fact" with the sentence highlighted) → **Publish** (to the teacher's inbox, then "My book" once returned).

One simple rubric for every piece, 1–4 on each line, so teachers learn it once:
1. **Focus:** it answers the task and keeps to it.
2. **Organization:** the unit's structure is there (TREE, TIDE, story mountain …).
3. **Support:** reasons, facts, details or story moments are developed.
4. **Craft:** the unit's skills are used (transitions, dialogue, a counterclaim …).
5. **Conventions:** capitals, punctuation, spelling (job G's skills).

The teacher scores it and writes one note. The piece counts as done when the teacher returns it.

## 7. The casts (shared with the reading jobs of the same band)

**E45 (Grades 4–5): the Glen Avenue Crew**, written by job C45 (`docs/core-growth/C45-map.md`, section 5). W48 uses it exactly: Yehuda Benaim, Avrumi Katz, Dovid Lerner, Binyamin Yusupov, Tzvi Hirsch Gold, Rabbi Feldman and Mr. Halpern. Their club newsletter, the *Glen Avenue Gazette*, is where Grade 4–5 boys publish. A new recurring character is added to C45's note first.

**M68 (Grades 6–8): The Beacon newsroom** (offered by W48; if job C68 writes a different cast first, I switch to theirs). Five boys who run their yeshiva's class newspaper, *The Beacon*:
- **Akiva Feldman**: the editor; fair, strict about facts. (Rabbi Feldman of the Glen Avenue Crew is his uncle.)
- **Eli Mizrahi**: sports and debates; argues every side.
- **Gavriel Shirazi**: photos and charts; quiet, notices everything.
- **Yoni Kaplan**: features and interviews; talks to everyone, from the custodian to his Zaidy.
- **Benny Okafor-Levine**: joined this year from another city; writes the best stories.
- Grown-ups: Rabbi Rosen (the menahel, who reads every issue), Mr. Gross (the faculty adviser). Stories: a fundraiser for a family in need, a school election, a trip to a historic site, a mystery in the school archive, a debate tournament.

**Rules for both casts (same as C45's):** same names and traits in every text and job; modest, warm, normal frum family life, Shabbos and Yom Tov, kosher food; **pictures show boys and men only** (`docs/HANDOFF-PICS.md`); never the Divine Name (ה׳ in Hebrew, "Hashem" in English).

## 8. Order of building

1. **Now (docs only):** this map and the ledger (`docs/core-growth/W48-ledger.md`).
2. **When job T's how-to is on `main`:** Unit 1 of every grade (Gr 4 → Gr 8), 15–25 lessons per PR, in `src/CoreDataW481.html` and on. Each PR: the quality gate, independent review (every score 4–5), pictures at 1366×768 and 390 px.
3. **Upgrades** of the existing 19 lessons go in their own PR in `src/OneBiteDataWrit.html`, after checking #180.
4. Then Unit 2 of every grade, Unit 3, and so on.
5. **Pieces** turn on when job T's Writing Workshop and inbox are live. Their prompts, organizers and checklists are written with each unit, so they are ready.
6. **Picture orders** (`docs/core-growth/W48-picture-orders.md`) in batches of 20–40, mainly unit openers and the two casts.

## 9. Helpers wanted (also in the lanes file)

A helper writes in `src/CoreDataW48H<n>.html` and claims a piece with a PR titled `Core Growth claim: W48 helper <piece>`.

| Piece | Ready when |
|---|---|
| W48 Grades 6–8, Units 2–3 (small skills) | Unit 1 of all grades is live |
| W48 Grades 4–5, Units 4–5 (small skills) | Unit 1 of all grades is live |
| W48 Grades 6–8, Units 4–5 (small skills) | Unit 1 of all grades is live |
