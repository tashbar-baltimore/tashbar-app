# Confirm 2: unit checks C68.U86, C68.U88, C23.U21 (fresh reviewer)

The reviewer wrote none of this content. Sources read: CLAUDE.md, REVIEWS.md, C68-map (8.6, 8.8, cast), C23-map (2.1, cast), src/CoreDataC68H2.html:586, src/CoreDataC68H3.html:308, src/CoreDataC231.html:214, the engine src/CoreUnits.html (build/fromSkill/render) and src/CoreKitActs.html (evidence, cloze). Lesson-check passages were checked against the engine pool (pool.json) and packs/HowToDo3.html.

**How the engine builds each boss (checked in the code, CoreUnits.html:57-71):**
- **U86:** 5 skills + 2 reviews + 5 fill = 12. **All 10 own items** show every time.
- **U88:** 5 + 3 + 4 fill = 12. 9 of the 10 own items show (only one of the two READ.FLU.L09.03 items). **A5 and A10 always appear together.**
- **C23.U21:** 4 + 2 + 4 fill = 10. **All 8 own items** show.

**Packet note (not a content bug):** the v4 packet prints no PASSAGE for READ.COMP.L09.01 and L09.03 checks ("Library argument", "Class pet argument", "Whale sources", "Pizza sign", "Chaim's number"). The engine does show one. `prepItem` keeps `p`, `fromSkill` passes `it.p`, and pool.json has every passage. A boy is never asked about a text he cannot see.

**URGENT (a right answer marked wrong): none found.** I checked every key by hand, including all B* pre-check and review questions.

---

## C68.U86 "Judge the Argument" (Grade 8): PASS

| # | Point | Score | Why (quotes for anything under 5) |
|---|---|---|---|
| 1 | Goal | 5 | All 5 unit skills, 2 own items each. Reviews L09.14 and L09.09 come from 8.5, as the map says. |
| 2 | Teaching | 5 | Every boss item asks what the lessons taught: relevant + reliable, take-it-away test, who/when source check, fact vs. interpretation, read 1 / read 2. |
| 3 | Progression | 5 | The own items climb past the lesson checks. Both tests are needed together (A4), the newest source is a seller (A3), and a reading must fit all the facts (A9). |
| 4 | Thinking + hard case | 5 | Hard cases are A3 "a 2024 real estate website that says the town is 'booming'" (newest but selling), A4 (on topic but unreliable, beside reliable but off topic) and A9 (rain explains it). |
| 5 | Mistake work | 4 | **A2:** `o:['an interpretation','a counted fact','a fact the gabbai checked']`. Both wrong options are "a fact", so one idea removes both and it plays like a 2-choice. **A8:** "1958, because a different number must be a correction" tempts no one. Key lengths are well spread (key longest in only 3 of 10). |
| 6 | Variety and age fit | 4 | Clearly Grade 8 (census vs. seller, 1933 deposit insurance, gemach). But 9 of 10 own items are the same "tap one of three sentences" (`evidence`) and 1 is `cloze`, so the format is the same all the way through. |
| 7 | Taught then asked / cold | 4 | None of the own items is printed in a lesson (grep). A3 is close to practice "the number of people in Baltimore now … Source A, the 2020 Census". A2 is a near 2-choice (see 5). |
| 8 | Correct and clear | 5 | All keys are right. Facts check out: Bay Bridge opened 1952; deposit insurance 1933; Federal Reserve 1913 with 12 regional banks; Buttonwood 1792 with 24 brokers. Small point: the cloze heading is the kit's "Which word fits? Tap it into the gap." while the choices are phrases. |
| 9 | Warm | 4 | Yeshiva, shul, gabbai, gemach, Chesapeake. But **none of the 10 own items names a boy**: "A boy on the bus", "the 8th grade", "boys". Names come only from the review questions (Dovi, Moshe, Shloimy). |

**Key table (own items)**

| Item | Skill | Key (index) | Checked |
|---|---|---|---|
| A1 | L09.15 | 1 "…sold 40,000 vans last year." | ✓ true but off topic |
| A2 | L09.16 | "an interpretation" | ✓ a prediction from a fact |
| A3 | L09.03 | 2 "the 2020 national census…" | ✓ |
| A4 | L09.01 | 0 "A boy on the bus said 'everyone'…" | ✓ (1 is reliable, 2 is off topic) |
| A5 | FLU.L09.04 | 2 "A gemach lends money free…" | ✓ |
| A6 | L09.01 | 0 "A study of 500 students…" | ✓ |
| A7 | L09.15 | 2 "'I rode on Main Street once…'" | ✓ |
| A8 | L09.03 | 1 "1952, because two careful sources agree" | ✓ fact true |
| A9 | L09.16 | 1 "The rain kept the boys inside…" | ✓ (0 and 2 do not fit the indoor recess) |
| A10 | FLU.L09.04 | 2 "In 1933, Congress passed a law…" | ✓ (1 is not in the text) |

**B checks:** L09.01 .1/.2/.3 ✓ (passages shown) · L09.15 .1/.2/.3 ✓ · L09.03 .1/.2/.3 ✓ (blue whale heart about 400 lb is right) · L09.16 .1/.2/.3 ✓ · FLU.L09.04 .1/.2/.3 ✓ · review L09.14 .1 conceding ✓, .2 refuting ✓, .3 counterclaim ✓ · review L09.09 .1/.2/.3 ✓.

**Optional polish (nothing is under 4):**
- A2: `o:['an interpretation','a counted fact','a counterclaim']`, or use 'a concession' as the third choice, so the two wrong choices are different ideas.
- A8: replace choice 0 with `'1958, because the newest source is the forum post'`.
- Name boys in two items, for example A4 `'Shimmy said on the bus that "everyone" wants it.'` and A7 `'"I rode on Main Street once and nothing happened to me," says Yudi.'`

---

## C68.U88 "Old Stories, New Stories" (Grade 8): FAIL until one fix (A10); PASS after it

| # | Point | Score | Why (quotes for anything under 5) |
|---|---|---|---|
| 1 | Goal | 4 | All 5 skills are covered. The map says "unit check 8.8 (the whole year)", but the reviews (L09.18, L09.01, L09.10) reach back only to 8.5–8.7. Nothing from 8.1–8.4 can be asked, and the engine caps reviews at 3. |
| 2 | Teaching | 5 | Matches the lessons: guide / test / return, face and action on film, theme vs. summary with proof, the "/" marks and the line to remember, flashback / echo. |
| 3 | Progression | 5 | The own items are new stories that need the pattern applied, not named. Examples: A1's false helper, A7's "the meaning breaks". |
| 4 | Thinking + hard case | 5 | A1 "A stranger … who offers to carry the money" (a helper who is not the guide). A7 "Yes: films must cut scenes so the story fits" (the taught reason, used the wrong way). A2 wide shot vs. close-up. |
| 5 | Mistake work | 4 | **A5** choice "So we meet his grandson before we meet young Reuven." is filler. **A6** puts the definition on every choice, so "a test: he must choose to do right" just repeats the stem "He says no". Key lengths are well spread. |
| 6 | Variety and age fit | 4 | Grade 8 level, but all 10 own items are `evidence` (one of three), so the format is the same throughout. |
| 7 | Taught then asked / cold | 5 | All new stories. The Akiva lines in A4 ("one page at a time … truth is worth the work") are not in C68.SP.01 or the lesson. No 2-choice. |
| 8 | Correct and clear | **3** | **A5 and A10 always appear in the same boss and contradict each other.** A5: "A book opens with Reuven, now old … Chapter 2 jumps back sixty years". A10: "In Chapter 1, a stranger tells young Reuven…". A10 is a structure question (echo vs. "jumps back in time"), so the clash pushes a careful boy toward the flashback choice. Smaller point: A3 asks "Which is a theme, not a summary?", and choice 2 "You should never point out a friend's mistake" is also written as a theme. Only the unstated "the text backs it up" rules it out. |
| 9 | Warm | 5 | Yehoshua, Yoni, Shmuel, Akiva, Reuven, Dani, Avi. A chavrusa after seder, a siyum ("until the last daf"), a grandson's chasunah, Zeidy's farm. |

**Key table (own items)**

| Item | Skill | Key | Checked |
|---|---|---|---|
| A1 | L09.11 | 1 old trader shows the pass, turns back | ✓ |
| A2 | L09.12 | 2 close-up of his hand shaking | ✓ |
| A3 | L09.13 | 0 "Helping a friend kindly and privately…" | ✓ (see wording fix) |
| A4 | FLU.L09.03 | 2 before "And we learned…" | ✓ |
| A5 | L09.02 | 0 "we know it ends well and wonder how" | ✓ |
| A6 | L09.11 | 1 a test | ✓ |
| A7 | L09.12 | 1 "No: the ending needs that kindness" | ✓ |
| A8 | L09.13 | 0 "How you act after a loss…" | ✓ |
| A9 | FLU.L09.03 | 2 slashes between the parts | ✓ |
| A10 | L09.02 | 1 echoes the opening | ✓ key right, but the setup clashes with A5 |

**B checks:** L09.02 .1/.2/.3 ✓ · L09.11 .1/.2/.3 ✓ · L09.12 .1/.2/.3 ✓ · L09.13 .1 summary ✓, .2 supported ✓, .3 not supported ✓ · FLU.L09.03 .1/.2/.3 ✓ · review L09.18 .1/.2/.3 ✓ · review L09.01 ✓ (above) · review L09.10 .1/.2/.3 ✓.

Pre-check note (lesson checks, not the boss): the key is plainly the longest choice in L09.02.1 ("each day is one step, from missing home on Sunday to happy on Tuesday"), L09.11.3, L09.12.1 and L09.12.3. A guessing boy can skip those lessons. This is for the lesson owner.

**Copy-ready fix (required, point 8), src/CoreDataC68H3.html, A10 (READ.LIT.L09.02):**
```
q:'In Chapter 2, a stranger at the ship tells young Reuven, "Hold on to your name." In the last chapter, old Reuven says the same words to his grandson. What does the repeated line do?'
```
(p, a, look and how stay the same. Chapter 2 is the flashback in A5, so the two items now describe one book.)

**Copy-ready fix (recommended, point 8 wording), A3:**
```
q:'Story: Shmuel\'s chavrusa makes the same mistake every day. Shmuel does not say it in front of the class. After seder he shows him quietly, and soon his chavrusa gets it right. Which theme does the story prove (not a summary)?'
```

Optional (point 5): A5 choice 2 → `'So the book can skip the years in between.'` A6 → drop the definitions: `p:['the guide','a test','the return']`.

---

## C23.U21 "Story Detectives" (Grade 2): PASS

| # | Point | Score | Why (quotes for anything under 5) |
|---|---|---|---|
| 1 | Goal | 5 | All 4 skills, 2 own items each. The reviews are the Grade 1 ask/answer and story parts skills. |
| 2 | Teaching | 5 | The lessons taught each move: ask before / while reading, who/where/when, "because" for why vs. steps for how, and a retell with B-M-E plus the lesson. |
| 3 | Progression | 4 | A6 (why vs. how, with a mixed decoy) and A8 (order AND lesson) climb. But A5 "'Dovid wore his boots because the ground was wet.' Why…?" is the same level as check B.L03.06.1/.3, and A3 is a one-step "where". |
| 4 | Thinking + hard case | 5 | A6 choice "He fixed it because the chain fell off and he wanted to ride." (a why answer dressed up as how, with an added made-up reason). A8 choice 2 has the lesson but the parts out of order. A7 choice 0 has all the parts out of order. |
| 5 | Mistake work | 4 | Good tempting wrong choices in A3 ("On Sunday" comes first), A5 ("He liked his new boots."), A6 and A7. Weak ones: A1 "What color is the step?", A2 "How do you spell glove?". Key lengths are well spread. |
| 6 | Variety and age fit | 4 | Words a Grade 2 boy can read, but A8's choices run 92–101 characters ("Moshe said sorry and played with him. Then he teased the new boy. The lesson: be kind to new friends."), long for Grade 2 on a phone. All 8 own items are `evidence`. The retell skill would suit an `order` item. |
| 7 | Taught then asked / cold | 4 | Nothing is copied from the lessons (grep). A3 "On Sunday, Avi saw a frog at the river." uses the teach item "On Sunday, Avi went fishing." as a template. |
| 8 | Correct and clear | 5 | All keys are right. Every review tile order has only one right order ("in its shell", "a trail of slime", "A snail eats leaves and plants", the 3 lake events). |
| 9 | Warm | 5 | Cast names (Chaim, Avi, Dovid) plus Moshe. "Before Shabbos, the boys swept the shul". In the teasing story Moshe says sorry. Rabbi Feld's "No school today!". |

**Key table (own items)**

| Item | Skill | Key | Checked |
|---|---|---|---|
| A1 | L03.04 | 1 "What is in the box?" | ✓ |
| A2 | L03.04 | 2 "Who lost the glove?" | ✓ |
| A3 | L03.05 | 0 "at the river" | ✓ |
| A4 | L03.05 | 2 "Before Shabbos, …" | ✓ |
| A5 | L03.06 | 0 "The ground was wet." | ✓ |
| A6 | L03.06 | 1 "First he put the chain back on. Then…" | ✓ |
| A7 | LIT.L03.01 | 1 lost → looked → found, in order | ✓ |
| A8 | LIT.L03.01 | 0 in order + lesson | ✓ |

**B checks:** L03.04 .1/.2/.3 ✓ ("Yes, school is closed." is right) · L03.05 .1/.2/.3 ✓ · L03.06 .1/.2/.3 ✓ · LIT.L03.01 .1 order (one order only) ✓, .2 ✓, .3 ✓ · review COMP.L02.01 .1/.2/.3 tiles ✓ · review LIT.L02.01 .1/.2/.3 ✓.

Pre-check note: in LIT.L03.01.2 and .3 the key is by far the longest choice (.3 is a 4-sentence retell beside two 1-sentence ones). This is for the lesson owner.

**Optional polish (nothing is under 4):**
- A8: shorten the choices for Grade 2:
  `p:['Moshe teased the new boy. Then he said sorry. Lesson: be kind.','Moshe teased the new boy. Then he said sorry.','Moshe said sorry. Then he teased the new boy. Lesson: be kind.']`
- A1: choice 2 → `'Why is the door open?'`

---

## Summary

| Unit | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| C68.U86 | 5 | 5 | 5 | 5 | 4 | 4 | 4 | 5 | 4 | **PASS** |
| C68.U88 | 4 | 5 | 5 | 5 | 4 | 4 | 5 | **3** | 5 | **FAIL** (fix A10 → PASS) |
| C23.U21 | 5 | 5 | 4 | 5 | 4 | 4 | 4 | 5 | 5 | **PASS** |

Across all three: every own item is the `evidence` kind (U86 has one `cloze`), so point 6 stops at 4. Using one `order` or `storymap` item per unit would lift it.
