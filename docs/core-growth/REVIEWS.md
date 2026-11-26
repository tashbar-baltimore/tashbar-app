# Core Growth reviews (job V, the independent checker)

Job V builds no lessons and never reviews its own work. It scores every job's lessons on the HoS 9 points, plays them as a made-up TEST boy, and compares the jobs for evenness. The newest round is on top. Each round has one detail file per job in `docs/core-growth/reviews/`, with a score row and copy-ready fixes for every lesson.

**Job owners:** fix your ✗ lessons first (any point below 4), then the URGENT lines. Say in your PR which review lines it fixes, and V re-scores them in the next round.

---

## Round 2 (part B1c) · 2026-11-26 · G and W48

### For the Head of School (plain words)

Rabbi Khaver: **the new Grammar lessons are uneven, and the new Writing lessons for Grades 4–8 are not yet at your bar.**

- **Grammar (G): 22 of 53 new lessons pass every point (42%).**
  - The Grade 2–4 lessons are good: 13 of 18 pass.
  - From Grade 5 up they get weaker. Only 2 of the 17 Grade 7–8 lessons pass.
  - Why: the end-of-lesson check often repeats an answer the boy has already seen, or gives only two choices.
  - Ten Grade 7–8 lessons are all built the same way, and that shape is too easy for those grades.
- **Writing for Grades 4–8 (W48): 0 of 63 new lessons pass.**
  - The writing is warm and the examples are good.
  - But every lesson uses only match, sort and tile games, and the boy never writes.
  - These are the same two problems the first review found on 24 Nov. These lessons were built after it, and they repeat them.
  - Gap A3b (in progress) adds the real writing pieces. W48 also needs harder activity kinds.
- **A boy can be marked wrong, or is told to do something he cannot see, in 13 places. I checked each one in the code.**
  - Grammar (2): a Yosef "coat of many colors" card keyed the wrong way, and "busy as a bee", where "idiom" is also right.
  - Writing (11):
    - Four checks tell him to "leave out" a line that never appears (the same bug as the first review).
    - Two checks have two right orders.
    - Two checks have a second fair answer.
    - Four activities ask about an article or a source the lesson never shows him.

### Results by job

| Job | Scored | Pass | % | Detail |
|---|---|---|---|---|
| G · Grammar and words | 53 | 22 | 42% | `reviews/R2-G.md` |
| W48 · Writing Gr 4–8 | 63 | 0 | 0% | `reviews/R2-W48.md` |
| **All (B1c)** | **116** | **22** | **19%** | |

### URGENT (each one checked again in the code; full rows and copy-ready fixes in the detail files)

| Item | Job | Problem |
|---|---|---|
| `READ.VOC.L08.05` do 2 | G | "A coat of many colors means a very colorful coat." is keyed Right (it points to Yosef) |
| `READ.VOC.L08.01` check | G | "busy as a bee" keyed simile; "idiom" is defensible |
| `WRIT.PARA.L08.08`, `.L08.10`, `.L08.11` check 3 | W48 | "Leave out the …" line is never shown (`order` ignores `extra`) |
| `WRIT.ESSAY.L08.07` check 3 | W48 | Two right orders, and an unseen "leave out" line |
| `WRIT.PARA.L05.18` check 3 | W48 | Two right orders; `L06.12` keys the other one right |
| `WRIT.PARA.L06.09` check 2 | W48 | "so the reader remembers it" is defensible |
| `WRIT.ESSAY.L06.06` your 4, `WRIT.PARA.L06.10` do 2 | W48 | Keyed against an article the boy never sees |
| `WRIT.RES.L05.03` your 3, `WRIT.RES.L06.02` your 3 | W48 | He is never shown which source said what |
| `WRIT.RES.L07.02` check 1 | W48 | A definition keyed "quote it"; "paraphrase" is also right |

**For job T (tests):** a test that fails any engine `order` check whose hint says "leave out" while the question has an `extra` would stop this bug from coming back a third time.

### How part B1c was done
- **What was scored:**
  - Every G and W48 lesson live on `origin/main` at 26 Nov 19:08 UTC that Round 1 did not score.
  - The 10 G Grade 6–8 lessons rebuilt after Round 1.
  - Not scored again: the Round 1 ✗ lessons, which are gap B2c (G) and the fresh re-scores in #497 and #518 (W48).
- **The checks:** `tools/audit/unitpool.js` dumped every distinct check question each lesson can draw (25 builds per skill).
- **The reviewers:** 7 fresh reviewers each scored one batch. None of them, and not this builder, wrote any of these lessons.
- **What a boy sees:** one lesson per job was played as a made-up TEST- boy at both sizes, to Level clear. Pictures: `docs/screens/b1c-r2/`.

---

## Round 1 · 2026-11-24 · all 151 live Core Growth lessons

### For the Head of School (plain words)

Rabbi Khaver: **the new lessons teach well, but they are not yet even, and the writing jobs do not yet make a boy write.**

- **98 of 151 new lessons (65%) pass every point** of your standard. The goals, the worked examples, the Mistake Detective and the warmth are strong in every job.
- **4 lessons had a real mistake a boy could be marked wrong for.** I checked each one by hand (list below). Each needs a one-line fix.
- **The biggest gap: no boy writes yet in the new writing lessons.** Jobs W13 and W48 teach writing skills with tap activities. That is good, but no lesson opens the new Writing Workshop, so no piece reaches a teacher. The old write box would count a blank page as right (see "Problems across jobs").
- **The quality is uneven between jobs.** Grammar (G), Comprehension 4–5 (C45) and Phonics (F) mostly pass. Writing for Grades 4–8 (W48) passes only 11 of 44, because every lesson has the same three activity kinds, and those are too easy for Grades 6–8.
- **Excitement is middling, about 3.5 out of 5.** Lessons feel like drills with a different coat of paint. The story-based reading lessons are the most exciting.

### Results by job

| Job | Lessons | Pass (all points 4–5) | % | Avg fun (1–5) | Weakest point (avg) | Detail |
|---|---|---|---|---|---|---|
| C45 · Comprehension Gr 4–5 | 29 | 25 | 86% | 3.9 | p6 variety 4.1 | `reviews/R1-C45.md` |
| G · Grammar and words | 59 | 48 | 81% | 3.6 | p6 variety 3.9 | `reviews/R1-G.md` |
| F · Foundations (Gr 2 phonics) | 15 | 10 | 67% | 3.1 | p6 variety 4.0 | `reviews/R1-F.md` |
| W13 · Writing K–3 | 4 | 4 | 100% | 3.0 | p3, p6, p7 at 4.0 | `reviews/R1-W13.md` |
| W48 · Writing Gr 4–8 | 44 | 11 | 25% | 3.2 | p6 variety 3.3 | `reviews/R1-W48.md` |
| **All** | **151** | **98** | **65%** | **3.5** | p6 variety and age fit | |

Not reviewed in this round: the 5 K–1 full-screen games of job F (they are games, not One Bite lessons; next round), the unit checks, and the book texts on their own. C23, C68 and S have no live lessons yet.

### URGENT: a boy can be marked wrong for a right answer (each checked by V by hand)

| Lesson | Job | Problem | Fix |
|---|---|---|---|
| `READ.LV.L03.03` your 5 | F | The sort card "h__l" is keyed **au** (haul) only, but **al** makes "hall", a real word with the same sound. The how box says "Which one makes a real word?" | Change the card to "s__ce" (sauce). |
| `READ.PHON.L03.06` your 1 | F | The Mistake Detective says Moishe is wrong to read *reptile* as "rep-til". That is a normal American way to say it (the first pronunciation in Merriam-Webster). | Use *explode* read as "ex-plod". |
| `LANG.GRAM.L09.02` your 2 | G | "The **skating** rink froze." is keyed "Not a gerund". *Skating rink* = a rink for skating, which most grammars call a gerund. The how line "Before a noun, the -ing word describes it" teaches a rule that breaks here. | Use "The skating boys laughed." |
| `WRIT.PARA.L05.07` check 3, and 9 more W48 checks | W48 | The check says "leave out the detail that wanders off", but the engine's `order` question has no `extra` field, so the wandering sentence is never shown. The boy is told to leave out a sentence he cannot see. The same `extra` is ignored in the checks of `WRIT.ESSAY.L06.03`, `.L06.04`, `.L06.05`, `.L08.04` and `WRIT.PARA.L07.03`, `.L08.01`, `.L08.04`, `.L08.06`, `.L08.07`. | Make each one an `mc` "Which sentence wanders off?" question, or drop "leave out" from the wording. |

No Divine Name anywhere. The word "bite" does not appear on any boy screen. No Family Life problem was found (one gentle fix in `READ.COMP.L05.08`: the wild-guess card "The rebbe sold it" should be a non-person guess).

### Problems across jobs (for the job owners and job T)

1. **No writing reaches a teacher yet (W13, W48).** Checked in the code:
   - None of the `src/CoreDataW13*` or `src/CoreDataW48*` files calls `TLCORE.write.open`, so no Writing Workshop piece exists.
   - In One Bite, the `do`/`your` activities replace the lesson's practice, so the engine `write` task never plays.
   - If it did play, all 48 `write` tasks have `min:0`. `src/MiddleSchoolPage.html:1116` marks every `write` as right, and `:1386` only checks the word minimum and the ticked boxes, so a blank box would count.

   **Fix (W13 and W48):** each unit's real task should be a Workshop piece (`docs/core-growth/HOW-TO-ADD-A-WRITING-TASK.md`), and every engine `write` should get a real minimum (25+ words for Gr 2–5, 35+ for Gr 6–8).
2. **The same shape in every lesson (all jobs, point 6).**
   - Grammar: 54 lessons in a row use match + sort + tiles, mostly in the same order.
   - W48: every lesson uses only match, sort and tiles. Tiles of 3–4 chunks with one obvious extra word are too easy for Grades 6–8.
   - Teach-it-back for Grades 6–8 appears only as a line in Watch me, never as an activity.

   **Fix:** in each lesson, swap at least one of those for a kind the kit already has: the evidence tap, combine, story map, word parts, fill the gap, dictation, story order or spot-all.
3. **Grammar lessons do not end with "his own sentence" (G, all 59).** The G map and the HoS rule ask every grammar lesson to end with the boy writing his own sentence about a text he read. None does yet. The reviewers gave point 3 a 4 for this and did not fail lessons on it, because the kit has no free-writing activity. **Job T / G:** a short "write one sentence" step (scored by the teacher, never auto-right) would close it.
4. **Checks that are not "cold" (all jobs, point 7).** Often the check answer was printed earlier in practice:
   - F: *hoping*, *running*, *stopped*, *bunnies*;
   - G: *players'*, *transport*, *pacified*;
   - C45: "It is wise to ask for help when you need it." appears 4 times before check 1 of `READ.LIT.L05.06`.

   Many checks are also 2-choice judgments ("Proves it / Not proof"), which a boy can pass by guessing, and they rarely ask him to *do* the skill on the cold passage. Each case has a fix in the detail files.
5. **Repeats of a lower grade (point 6, grade level).**
   - W48 Grade 4 `WRIT.PARA.L05.06`, `.L05.07` and `.L05.09` are close copies of W13's Grade 2 L03.04–.06, on Grade 2-level sentences.
   - G `LANG.USE.L07.02` (Gr 6) drills the same gonna/wanna swaps as Grade 2.
   - C45 `READ.LIT.L05.03` only labels story parts, a Grade 2–3 skill.
   - W48 `WRIT.PARA.L05.11` uses first / after that / finally, Gr 1–2 time words.

   Job owners should talk to each other when a skill repeats across bands: the higher grade must climb, not repeat.
6. **Long answer cards (C45 mostly).** Choices in `listen` and sort cards wrap to 3–8 lines at phone size (the script QA found 129 layout notes; the reviewers confirmed the worst). Shorter wordings are in `reviews/R1-C45.md`.
7. **Celebrations on top of the thinking (the One Bite player, not one job).** Playing as a TEST boy, "3 IN A ROW!", "5 STREAK!", "FIRST TRY!" and flying coins land over the next question's text on Your turn and Show me (see the pictures). Prompt section 6 says "celebrate at moments of success and change of screen, not on top of thinking". This is the shared player code (`src/OneBiteKit.html` / `src/OneBiteMoney.html`). **It is for the HoS to decide**, because the money show is his decision.

### What the boy sees (played as a made-up TEST boy)

I played 5 lessons, one from each job, from start to Level clear, at phone size (390 px) and Chromebook size (1366×768): `READ.PHON.L03.14` (F), `READ.LIT.L06.08` (C45), `LANG.SENT.L09.01` (G), `WRIT.PARA.L09.04` (W48) and `WRIT.PARA.L03.05` (W13). That is 137 phone screens and 111 Chromebook screens, with 0 page errors.

- **What works:**
  - He sees one clear "TODAY WE LEARN" line.
  - Watch me builds the example one step per tap (for example h-o-p → h-o-pp + ing).
  - The Mistake Detective crosses out the real error.
  - The Show me "How to do it" box is there, with "Teach me how".
  - The story lessons show a whole short story to read.
- **What is wrong:**
  - Banners and coins cover the question words for a moment (problem 7).
  - At 390 px the C45 sort bins with long cards are cut off at the bottom (`READ.LIT.L06.08`, do 1).
  - The W48 Grade 8 sort cards "60 boys, 30 seats. However, …" are too thin to judge.
  - In the phonics check "Add -ing to hope", he has just practised *hoping*.

Pictures: `docs/screens/v-r1-phone-READ.PHON.L03.14.jpg` (every screen, phone) and `docs/screens/v-r1-chromebook-WRIT.PARA.L09.04.jpg` (every screen, Chromebook).

### How round 1 was done

- **What was reviewed:** every lesson listed in `src/CoreData*.js` on `origin/main` at `08f6818` (24 Nov). That is 156 skills: 151 One Bite lessons plus the 5 K–1 games.
- **The full check range:** for each lesson, a script loaded the real boy page with the pretend server and built it 30 times. It saved the One Bite data, the engine lesson, Teacher Time and **every distinct check question** the engine can draw.
- **Script QA:** `tools/audit/ob-qa.js` checked layout at 390 px, age fit, variety, taught-then-asked and rules. It found 0 must-fix and 129 should-fix notes, which were given to the reviewers as leads to verify, not as findings.
- **Fresh reviewers:** 9 reviewers who did not write any of the lessons worked through 10 batches of 4–20 lessons. Each got only the standard, the maps, the lesson data, the full check dump and the script leads. They scored 1–5 on the 9 points, quoted the exact text for every score under 5 with one copy-ready fix, and checked every answer key by hand.
- **V's own checks:** V checked every URGENT claim and every cross-job claim in the code before writing it here. Two reviewer claims were dropped as wrong:
  - "every check has an empty How-to box": the box is filled from the lesson's How-to data, as the pictures show;
  - "the write task marks blank work right in One Bite": the task does not play in One Bite at all.
- **Pictures:** 5 lessons played to the end as a TEST boy at both sizes (above).
- **Next round:** the 5 K–1 games, the unit checks (boss levels), the book texts, re-scores of fixed lessons, and every new lesson PR as it opens.
