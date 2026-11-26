# Core Growth reviews (job V, the independent checker)

Job V builds no lessons and never reviews its own work. It scores every job's lessons on the HoS 9 points, plays them as a made-up TEST boy, and compares the jobs for evenness. The newest round is on top. Each round has one detail file per job in `docs/core-growth/reviews/`, with a score row and copy-ready fixes for every lesson.

**Job owners:** fix your ✗ lessons first (any point below 4), then the URGENT lines. Say in your PR which review lines it fixes, and V re-scores them in the next round.

---

## Round 2 (B1a) · 2026-11-26 · job F, all K–1 games, W13, their unit checks and book texts

### For the Head of School (plain words)

Rabbi Khaver: **the new K–3 work is mostly sound, but 12 places can mark a boy wrong for a right answer (one more blocks a letter from being sent), and the boss levels repeat questions he has just answered.**

- **Lessons:** 30 of 39 new lessons pass every point (F 17 of 24, W13 13 of 15). Almost every failure is the same thing: the check question was already answered in the lesson's own practice.
- **K–1 games:** 84 of 104 pass. The common problems: a "How" line read aloud that is longer than 12 words, and a few picture choices with two right answers.
- **Boss levels (unit checks):** 0 of 11 pass. None is wrong at the root, but each repeats the questions the boy just answered in his lessons, and some are half 2-choice guesses. The writing pieces in the W13 units are all sound.
- **Books:** 31 of 38 pass. Seven Kindergarten books use "see" and "to", which the K path does not teach yet.
- No Divine Name, nothing immodest, all food kosher.

### Results

| Part | Items | Pass (all points 4–5) | Detail |
|---|---|---|---|
| F · Grade 2 lessons (new since Round 1) | 24 | 17 | `reviews/R2-F.md` |
| W13 · Grade 3 lessons (new since Round 1) | 15 | 13 | `reviews/R2-W13.md` |
| K–1 games (F, FH helpers, W13) | 104 | 84 | `reviews/R2-K1-games.md` |
| Unit checks F.U21–U26, W13.U21/31/34/35/36 | 11 | 0 | `reviews/R2-units-texts.md` |
| Book texts (texts/F, FH1, W13) | 38 | 31 | `reviews/R2-units-texts.md` |

### URGENT: a boy can be marked wrong for a right answer (each checked by V against the data and the code)

| Where | Problem | Fix |
|---|---|---|
| **All unit checks** (`src/CoreUnits.html` `fromSkill`, line 55) | A lesson check with a picture-only `pic` loses its picture in the boss level, so "Build the word for the picture" has no picture. In **F.U22** (READ.LV.L03.01) **s-n-oo-p** and in **F.U24** (READ.PHON.L03.03) **c-a-f-e** are real words that are marked wrong. | One engine fix: keep a picture-only `pic` in unit checks (show it), or leave out questions that need their picture. Then re-check both units. |
| `READ.PHON.L01.07` act 1 (K game) | Shows and says **am**, but the answer is **at**; the tiles include m, so "am" can be built and is marked wrong. Seen on screen. | Remove `q`; say `Shmuli read am. Now tap Hear it, and build that word!` |
| `READ.PHON.L01.10` act 1 (K game) | Same pattern: shows **pin**, answer **tip**, tiles include n. | Remove `q`; say `Shmuli read pin. Now tap Hear it, and build that word!` |
| `READ.LV.L01.12` sort (K book game) | "Gad got a rag." is keyed thumbs-down, but Gad does get a rag in the earlier book *The Wet Dog* (FH1.K.22), and the game never says "in this book". | Change the card to "Gad got a fan." |
| `READ.PA.L02.20` sort (Gr 1) | 🐱 is keyed one beat (cat), but many boys say "kitty" (two beats). | Use 🌙 (moon). |
| `READ.LIT.L01.01` match (listen-along) | 🧔 Abba is keyed to 🎒, but Abba also walked Eli to school (🏫); each pair is marked as he taps it. The How line helps, but the pair is defensible. | Pair 👨‍🏫 (Rebbe) with 🎵 (he taught the song) instead of 🏫. |
| `READ.LIT.L01.02` match (listen-along) | 😴 is keyed to 🌙, but Baby Moishy falls asleep in the sukkah (🛖), so that pair is defensible too. | Use 🦉 with 🌙. |

### Cross-check with a second independent pass (more URGENT lines, each checked by V in the code)

A second builder session (claim #560) made its own full pass of B1a before stepping aside. Its notes are on branch `claude/awesome-feynman-kwbk84-b1a` (`docs/core-growth/reviews/R2-F.md`, `R2-W13.md`, pictures in `docs/screens/b1a-r2/`). Both passes found the unit-check pictures, `READ.PA.L02.20` 🐱 and `READ.LIT.L01.02` 😴. It also found these, and V checked each one:

| Where | Problem | Fix |
|---|---|---|
| **W13.U36** letter piece `W13.LETT3.01` (`src/CoreDataW13H3.html` around line 241) | The boy cannot send it. Every checklist line must pass before Send (`src/CoreWrite.html` line 122). The greeting line accepts only "dear", and the closing line has no "thank you,", yet the unit's own lessons teach "Thank you," as a closing (line 84) and show "Hi Avi" (line 90). A boy who follows the lesson is stuck on Fix. | Greeting `any: ['dear', 'hi', 'hello', 'to ']`; closing `any: ['love,', 'student,', 'respectfully,', 'sincerely,', 'thanks,', 'thank you,', 'your friend,']`. |
| `READ.PA.L01.15` sort (K, `src/CoreDataFH1.html` line 196) | 🐱 is keyed 3 sounds (cat), but "kitty" has 4. | Replace 🐱 with 🚌 (bus: 3 sounds, b-u-s). |
| `READ.FLU.L02.23` match (Gr 1) | "friend" = 👦👦 and "people" = 👥, but two boys are also people; each pair is marked as he taps it. | Use 🤝 for friend. |
| `READ.PA.L01.14` piece 5 (K) | "Big, change the middle to uh" is keyed 🐛, but 🐝 is also a bug. | Use pin → pan instead. |
| `READ.PHON.L01.16` piece 4 (K) | 🐸 is keyed fff (frog), but a boy may say "toad". | Use a 🐟 fish for fff. |

Lower, not URGENT (V's view):
- `WRIT.PARA.L02.06` act 1 (Gr 1): the spoken line is 21 words, and it says the answer ("I felt so happy! How did he feel?"). Fix: hear `Shmuli found his lost kippah. Listen to how he ended it.` and play the ending as its own line.
- 🦀 is used as a "short a" picture in `READ.PHON.L01.25` and `READ.PA.L01.15` (`src/CoreDataFH1.html` lines 182, 196). It is an animal, not food, so it may be within the rules; V leaves it to the F owner (🎒 and 🧢 already cover short a).
- For the test owners: `K.err` in `src/CoreK1.html` counts only `say` for the 12-word rule, but `how` and `hear` are spoken too; more than a dozen lines run 13–21 words. And no test checks that a K little reader uses only taught words ("see", "to", and "has"/"his" with s saying zzz appear before they are taught).

### What the boy sees (played as a made-up TEST boy, 1366×768 and 390 px)

I played `READ.FLU.L03.19` (F), `WRIT.PARA.L04.14` (W13) and the K game `READ.PHON.L01.07` at both sizes and looked at every screen.
- **What works:** clear screens, one main button, the How box on every practice screen, warm Shabbos Street stories.
- **What is wrong:** the K game shows "am" in big letters over faint "a t" boxes (URGENT above, found only by looking: the reviewer passed it); the "+1" coin lands on a match card for a moment (known, gap B7); the first Watch me step in `READ.FLU.L03.19` ("NAFTALI: Naftali is talking.") teaches very little.

### Problems across jobs

1. **Checks that are not cold (point 7).** Each lesson has exactly 3 check questions and asks all 3 every time, and in 7 lessons they were already answered in practice. The boss levels then ask the same 3 again. Fix per lesson (copy-ready in the detail files); for units, give each unit its own items and set `pre:'lessons'` (see `R2-units-texts.md`).
2. **2-choice checks** in F.U21, F.U23 and F.U24 (about half): a guesser can pass an 80% bar.
3. **K–1 How lines over 12 words** (read aloud on every miss) in 6 games.
4. **The same 7-activity order** in all 12 Grade 2 fluency lessons (point 6 at 4: passes, but flat).
5. **The right answer is the longest choice** in all 6 of W13.U31's own items (the test rule from #526 lists it as an old unit to fix).

### How round 2 was done

- **What:** every F and W13 lesson on `origin/main` not scored in Round 1 (39), all 104 K–1 games, the 11 F/W13 unit checks and the 38 book texts.
- **Data:** a script loaded the real boy page as a made-up TEST boy and saved each item's full data, with every distinct check question from 30 builds.
- **Reviewers:** 6 fresh reviewers in 6 batches, each with the standard, the Round 1 example and the data.
- **V's checks:** every URGENT claim checked in the data and the code. V added 2 URGENT items the reviewers missed (found by playing a game and then sweeping every tiles activity by script), and downgraded none.
- **Not done in this round:** re-scores of Round 1's ✗ lessons (they wait for gap B2c), and C45, S, G and W48 (gaps B1b and B1c).

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
