# Unit-check review 1 · C68 boss levels U77, U78, U85 (2026-11-26)

**Fresh reviewer** (wrote none of this content). Scored on the HoS 9 points against the review packets, the unit data in `src/CoreDataC68H1.html` (U77, U78) and `src/CoreDataC68H2.html` (U85), the One Bite lesson data in the same files, the old-lesson checks in `packs/ReadMore.html`, and the boss-level builder `src/CoreUnits.html` (`build()`, lines 57–67). Every answer key was checked by hand. Not scored down (already being fixed): passages of lesson checks not shown in the boss level; `evidence` items listing the right answer first.

Points: 1 goal · 2 teaching · 3 progression · 4 thinking steps / hard case · 5 mistake work · 6 variety and age fit · 7 taught then asked (cold, no 2-choice) · 8 correct and clear · 9 warm.

## What a boy actually gets (from `src/CoreUnits.html` `build()`)

I traced the builder, because it decides which items are ever drawn:

1. For each unit skill it takes **the first unused own item** for that skill, else a random lesson check. Then it takes `review.slice(0, 3)`. Then it fills up to `n` by going round the unit skills again.
2. The **pre-check (test-out) runs the same code** with `mode 'pre'`, so it shows **exactly the same first own item for each skill** that the boss level shows later. There is no randomness in which own item is picked.

What that means here:

| Unit | Drawn every time | Never drawn |
|---|---|---|
| U77 | A1–A4 (always the same), 1 review check each from L08.12 and L08.14, plus 1 random lesson check from each unit skill | none |
| U78 | A1–A4, 1 random lesson check each from L08.19, L08.10 and L08.11, 1 review check each from L08.02, L08.12 and L08.16 | **every `READ.LIT.L08.12` lesson check** (the fill stops before it) and **the whole review skill `READ.COMP.L08.18`** (only the first 3 review skills are used) |
| U85 | A5, A1, A2, A3, A4, A6, A7, A8 (the same 8 own items every time), 1 review check each from L08.02 and VOC.L09.01 | **A9**, and **every lesson check of all 5 unit skills** |

**Results:**
- **Not cold.** A boy who takes the pre-check has already answered A1–A4 (U77, U78) or A1–A5 (U85) before he reaches the boss level.
- **Retakes repeat.** A boy who fails and retakes sees the same own items again. In U85 that is 8 of the 10 questions.
- **Fix for job T, in `src/CoreUnits.html`:** in `per()`, pick a **random** unused own item instead of the first. In `'pre'` mode, either skip own items or use a different one from the boss level, for example the last own item for that skill.
- **For the unit authors:** give every skill **at least 2 own items**, so the pre-check and the boss level can differ. In U78, move `READ.COMP.L08.18` into the first 3 review skills, or drop it from `review`.

**No unit has a "new passage".** The map (`C68-map.md` §2, step 6) says a unit check is "8–12 tap questions on a new passage". All three checks are made of unrelated one-line items:
- **U77**, "Two Authors, One Bay": none of its items is about the bay.
- **U78**, "The whole book" (W6 *The Flood*): nothing comes from the book or a long text.
- **U85** (W8 Sherlock Holmes): there is no mystery passage.

My replacement own items below share one short cold text set per unit, so each check finally tests the unit's topic.

---

## Unit C68.U77 · "Two Authors, One Bay" · Grade 7

| # | Point | Score | Quote and reason (every score under 5) |
|---|---|---|---|
| 1 | Goal | **3** | The skills are the right ones, but the check is about a library, a sports team, a school play and sukkahs. Nothing is about the bay, and there is no pair of texts to compare. RI.7.9 ("analyze how two authors writing about the same topic shape their presentations") is tested only with one-line quotes, e.g. A1 "Text 1: 'Readers lost their quiet corner.' Text 2: 'The town saved $40,000 a year.'" |
| 2 | Teaching | 4 | Items match what the lessons taught. The How lines are short and useful ("Start at 2022. Compare each number with the next."). |
| 3 | Progression | **3** | There is no hard item. Every own item is a one-step recall. A2 (coach and parent) and B.16.3 (recess and reading program) test the same move twice in one check. |
| 4 | Thinking steps | **3** | There is no hard case. A1's stem already says "the same fact", which kills the option "They report two different events." A4's stem gives "a fall, then a small ___", so only one word is left to think about. |
| 5 | Mistake work | **2** | Many wrong options are not real mistakes: A2 "with no reason given"; A4 "fall" / "stop"; A1 "Both focus on the readers."; B.01.2 "Text 1 is excited; Text 2 is angry"; B.17.1 "it is the longest"; B.17.2 "a longer copied line"; B.18.2 "the biggest number"; B.16.1/.2 "only one mentions shade" (both plainly mention shade). |
| 6 | Variety and age fit | **2** | A2 and A4 are Grade 3–4 work: A4 is a 4-number trend with the answer pattern in the stem, and A2 only asks "same way or two ways". All 10 items are "choose one". There is no item where a Grade 7 boy must weigh two whole texts. |
| 7 | Taught then asked / cold | **2** | **A4**'s key "a fall, then a small rise" is the taught phrase: the Watch me says "A steep fall, then a small rise", there is a pairs card "a fall, then a small rise", and it is the key of B.18.1.<br>**B.01.1 / B.01.2** use the Menahel/journal pair that the lesson practised. The sort put "buses will leave at 5:15" under Only the notice and "there will be a siyum with a barbecue" under Only the journal, which are exactly B.01.1's two wrong options. The practice item "What does ONLY Text 2 tell? → how a boy felt about the change, and what made him glad" is B.01.2's key.<br>**B.01.3** uses the Willow Street teach passage, after a pairs activity that matched Officer Levy to safety.<br>**B.18.3** has the same three options and the same answer as teach question 3 ("neither / the text explains why / the chart explains why").<br>**The pre-check** shows A1–A4, which come back in the boss level. |
| 8 | Correct and clear | 4 | Every key is right (table below). There is one soft spot: in B.17.3, "it covers everything at once" is wrong, but A is weaker mainly because it never answers "why". The key "it names each source" is a slogan more than the real reason. |
| 9 | Warm | 5 | Sukkahs, seforim, the Menahel's Mishnayos chabura and a siyum with a barbecue. Names: Ari, Avi, Yehuda, Mr. Gold, Officer Levy. No Divine Name. |

### Answer keys checked by hand

| Item | Key right? | Second defensible option? |
|---|---|---|
| A1 | Yes | No |
| A2 | Yes | No |
| A3 | Yes | No ("Chanukah" uses two sources, but one does not answer the question: a good trap) |
| A4 | Yes (15→11→13) | No |
| B.READ.COMP.L08.01.1 | Yes ("day is getting longer" is in both texts) | No |
| B.READ.COMP.L08.01.2 | Yes | No |
| B.READ.COMP.L08.01.3 | Yes | No |
| B.READ.COMP.L08.16.1 | Yes | No |
| B.READ.COMP.L08.16.2 | Yes | No |
| B.READ.COMP.L08.16.3 | Yes | Slightly: "they agree" (both agree that scores rose), but the key is clearly best |
| B.READ.COMP.L08.17.1 | Yes | No |
| B.READ.COMP.L08.17.2 | Yes | No |
| B.READ.COMP.L08.17.3 | Yes | Weak, see point 8 |
| B.READ.COMP.L08.18.1 | Yes | No |
| B.READ.COMP.L08.18.2 | Yes | No |
| B.READ.COMP.L08.18.3 | Yes | No |
| B.READ.COMP.L08.12.1 / .2 / .3 | Yes / Yes / Yes | No |
| B.READ.COMP.L08.14.1 / .2 / .3 | Yes / Yes / Yes | .2: "not relevant" is not defensible, since a brother who loves soccer is on topic |

### Items to fix (U77)

The new own items share one cold text set about **underwater bay grass**, which none of the 7.7 texts teach. Shape: in `evidence` the right answer is `a:0`, which the engine re-orders.

**A1** (`READ.COMP.L08.01`). Problem: one-line quotes, the stem gives a distractor away, silly options, not about the bay.
```json
{"type": "evidence", "skill": "READ.COMP.L08.01", "q": "Both texts report that the bay grass grew this year. Text 1, a state report: \"Grass beds grew again this year, mostly in the shallow lower bay. Cleaner water lets sunlight reach the bottom.\" Text 2, a letter to the Beacon from Mr. Dahan, who runs a fishing boat: \"Sure, there is more grass by my island. But up the rivers the water is still brown, and nothing grows there.\" How does each writer shape the same news?", "p": ["Text 1 puts the gain and its cause first; Text 2 grants the gain, then turns to where nothing grew.", "Text 2 says the grass did not grow at all this year.", "Text 1 gives facts and Text 2 gives only feelings, so Text 2 adds nothing."], "a": 0, "look": "what each writer puts first, and what he adds", "how": "Same news. What does each writer put first? What does the second one add?"}
```

**A2** (`READ.COMP.L08.16`). Problem: Grade 3 level, and "with no reason given" is silly.
```json
{"type": "cloze", "skill": "READ.COMP.L08.16", "t": "Text 1: \"The bay grass grew this year because the water is cleaner.\" Text 2: \"Yes, there is more grass, but that is because last summer was cool, and grass grows best in a cool year.\" On the grass, the two writers ___.", "o": ["report the same fact but explain it two ways", "disagree about whether the grass grew", "agree on why the grass grew"], "a": "report the same fact but explain it two ways", "how": "First ask: do both say the grass grew? Then ask: do they give the same reason?"}
```

**A3** (`READ.COMP.L08.17`). It works, but replace it so the check stays on one topic. Optional.
```json
{"type": "evidence", "skill": "READ.COMP.L08.17", "q": "Question: why might crabbers near the lower-bay islands find more young crabs this year? Source 1, a state survey: \"Grass beds grew this year, mostly in the shallow lower bay.\" Source 2, a crabbing guide: \"Young crabs hide in grass beds while their shells are soft.\" Which answer puts the sources together?", "p": ["The survey says more grass grew there, and the guide says young crabs hide in grass, so there are more hiding places.", "The guide says young crabs hide in grass, so that alone is the whole answer.", "The survey says more grass grew, and a map shows the bay is about 200 miles long."], "a": 0, "look": "an answer that joins a piece from each source", "how": "What does each source add? Which answer joins the two pieces to answer the question?"}
```

**A4** (`READ.COMP.L08.18`). Problem: the key is the taught phrase, and the item is Grade 3–4 level.
```json
{"type": "evidence", "skill": "READ.COMP.L08.18", "q": "Chart: Underwater grass in the bay (thousands of acres). 2019: 67 · 2020: 62 · 2021: 67 · 2022: 76. Article: \"Cleaner water lets sunlight reach the grass.\" Which sentence reads the chart and the article correctly?", "p": ["The grass dipped in 2020, then grew two years in a row; the article gives one reason it can grow.", "The grass grew every year from 2019 to 2022.", "The chart proves that cleaner water made the grass grow."], "a": 0, "look": "the trend from the chart, the reason from the text", "how": "Read the title. Compare each number with the next. Which one shows, and which one tells why?"}
```
(The numbers are rounded from the Chesapeake Bay Program yearly grass survey. The author should check them once against the survey before publishing.)

**Every skill needs at least 2 own items** (see the engine note). Second items, ready to add:
```json
{"type": "evidence", "skill": "READ.COMP.L08.01", "q": "Both texts report that 40 boats now farm oysters in the creek. Text 1, the county paper: \"Forty oyster farms now line Back Creek, bringing jobs and cleaner water.\" Text 2, a letter from a neighbor: \"Forty farms now crowd Back Creek. My boys can no longer row to the island.\" How do they shape the same fact?", "p": ["Text 1 makes the farms a gain for the town; Text 2 makes them a loss for his family.", "They disagree about how many farms there are.", "Both writers want more farms in the creek."], "a": 0, "look": "what each writer makes the forty farms seem", "how": "Same number. Does each writer make it sound good or bad, and for whom?"}
{"type": "evidence", "skill": "READ.COMP.L08.16", "q": "View A: \"Oyster farms clean the water, and the state should allow more of them.\" View B: \"Oyster farms clean the water, but they block the creeks where families fish and row.\" Where do they agree, and where do they disagree?", "p": ["They agree the farms clean the water; they disagree about allowing more.", "They disagree about whether the farms clean the water.", "They agree on everything; View B just says it longer."], "a": 0, "look": "one shared point and one split", "how": "List what both say. Then find the point where they part ways."}
{"type": "evidence", "skill": "READ.COMP.L08.17", "q": "Question: why did the crab harvest fall this year? Text 1: \"A cold winter killed many crabs.\" Text 2: \"New rules cut the harvest season by two weeks.\" Which answer is strongest?", "p": ["Two causes: a cold winter killed many crabs (Text 1), and a shorter season meant fewer days to catch them (Text 2).", "A cold winter killed many crabs, says Text 1.", "Crabs are not kosher, so the harvest does not matter."], "a": 0, "look": "an answer with a piece from each text, each named", "how": "Does the answer use both texts and say where each piece came from?"}
{"type": "evidence", "skill": "READ.COMP.L08.18", "q": "Chart title: Maryland crab harvest, 2015–2022. A writer uses it to say Virginia's harvest fell. What is wrong?", "p": ["The chart counts Maryland only, so it cannot show Virginia.", "Nothing; Maryland and Virginia share the bay, so the numbers are the same.", "The chart is too old to use."], "a": 0, "look": "what the title says the chart counts", "how": "Read the title first. Where, and what, does it count?"}
```
(The third distractor in the L08.17 item is a deliberate off-topic "true fact" trap. Change it if the author prefers.)

**B.READ.COMP.L08.01.1 and .2** (in `packs/ReadMore.html`, `T8.day`). Problem: the passage and both distractors of .1 were sorted in practice, and .2's key was a practice answer. Fix: a cold pair. Add `T8.shul` and replace the two checks. Update the `ReadMore` and `HowToDo` lines in `TL_PACKS`, and keep exactly 3 checks.
```
shul:`Text 1: Notice from the Shul Office
Many families asked for a later Sunday minyan. So, starting Rosh Chodesh Kislev, Sunday Shacharis will begin at 8:00 instead of 7:30. A hot breakfast will follow davening.

Text 2: From Shmuel's Journal
Sunday davening is half an hour later now. Abba is glad to sleep in, but I miss the 7:30 minyan. That was when Abba and I learned together in the car on the way.`,
```
- .1: `{q:'Which fact is in BOTH texts?', pic:T8.shul, o:['Sunday davening now starts half an hour later','a hot breakfast will follow davening','Shmuel and Abba learned together in the car'], h:'Find something the notice says. Look for it in Shmuel\'s journal, maybe in other words.'}`
- .2: `{q:'How do the two texts present the same change differently?', pic:T8.shul, o:['The notice gives the new time and the reason; the journal shows what Shmuel loses','The notice argues against the change; the journal argues for it','The journal disagrees about the new time'], h:'What does each writer care about? The time, or what it means for him?'}`

**B.READ.COMP.L08.01.3**. Problem: it uses the teach passage, and the answer (Officer Levy's safety fact) was matched in practice. Its distractors are not reasons at all. Fix, on `T8.shul`: `{q:'Shmuel wants the 7:30 minyan back. Which fact from the notice could make the shul keep 8:00?', pic:T8.shul, o:['many families asked for a later time','Shacharis used to begin at 7:30','the change starts on Rosh Chodesh Kislev'], h:'Why did the shul make the change? Find the reason in the notice.'}`

**B.READ.COMP.L08.16.1** (dead third option; the same item is a review check in U78). Fix: `{"q": "Yehuda's father: \"The new park needs more trees for shade.\" His uncle: \"The park needs shade, but a roof over the benches works faster.\" On whether the park needs shade, they...", "o": ["agree", "disagree", "only the father says it needs shade"], "h": "Read past the word but. Does the uncle also say the park needs shade?"}`

**B.READ.COMP.L08.16.2**. Fix: `{"q": "Yehuda's father: \"Plant more trees for shade.\" His uncle: \"We need shade, but a roof over the benches is faster.\" On how to make shade, they...", "o": ["disagree", "agree", "only the uncle gives a way to make shade"], "h": "Trees, or a roof?"}`

**B.READ.COMP.L08.17.1**. Problem: silly distractors. Fix: `{"q": "Question: why did the town's pond freeze late this year? Ari answers: \"A warm winter (Text 1), warm water from a factory (Text 2) and a deep pond (Text 3).\" Why is his answer strong?", "o": ["each text adds a different piece", "all three texts say the same thing, so it must be true", "it uses the most famous text"], "h": "What did each text give Ari?"}`

**B.READ.COMP.L08.17.2**. Fix: `{"q": "Avi has three articles about bees. He answers using one and copies its last line. What is missing?", "o": ["a piece from each text", "a stronger opinion of his own", "more words from the same article"], "h": "How many texts did he use?"}`

**B.READ.COMP.L08.17.3**. Problem: the key is a slogan, and A never answers "why". Fix: `{"q": "Question: why are bees in trouble? A: \"Bees are in trouble because of sprays.\" B: \"The farm article blames sprays; the science article adds a disease.\" What makes B stronger?", "o": ["it joins a piece from each article and says where each came from", "it is longer", "it uses the science article, and science is always right"], "h": "Count B's sources. Does it say where each piece came from?"}`

**B.READ.COMP.L08.18.3**. Problem: same options and answer as teach question 3. Fix: `{"q": "Article: \"After the new dam opened upstream in 2015, the river rose less each spring.\" Chart: spring river height, 2010–2020. Which sentence is right?", "o": ["The chart shows the river rose less after 2015; the article gives a reason.", "The chart proves the dam caused it.", "The article shows the river was highest in 2011."], "h": "Which one shows the numbers, and which one tells why?"}`

**Verdict U77: FAIL** (1 = 3, 3 = 3, 4 = 3, 5 = 2, 6 = 2, 7 = 2).

---

## Unit C68.U78 · "The Whole Story" · Grade 7 (W6 *The Flood* ch. 5–8, "the whole year so far")

| # | Point | Score | Quote and reason (every score under 5) |
|---|---|---|---|
| 1 | Goal | **3** | The unit is "the whole book" and "reading coach 2: a long chapter on your own" (RL.7.10). There is no passage and nothing from W6, so L08.19 is tested by A1, a one-line scenario ("Naftali reaches chapter 9 and has forgotten who the stranger is"). The map calls check 7.8 "the whole year so far", but the review covers only units 7.2, 7.6 and 7.7, and the engine drops `READ.COMP.L08.18` (`review.slice(0,3)`). |
| 2 | Teaching | 4 | Items match the lessons. The How lines help ("Could it happen in the middle of a city?"). |
| 3 | Progression | **3** | All 4 own items are easy, and no item is hard. `READ.LIT.L08.12` lesson checks can never be drawn. |
| 4 | Thinking steps | **3** | There is no hard case. A2 prints the taught label in the stem: "Here the ___ shapes the problem". The lesson's three link names are "the setting shapes the problem / a choice changes the plot / the plot changes the character", so the stem alone gives "setting". |
| 5 | Mistake work | **3** | A1 has one good trap ("Add it to his open questions", a real mistake because the book already answered it). Many other options are dead: A3 "Then, at last, the long day was over and he fell asleep." and "He thought quietly about everything…"; A1 "Skip ahead to the next chapter."; B.19.2 "nothing at all"; B.02.3 "both boys love the rain". |
| 6 | Variety and age fit | **2** | A3 (which ending is suspenseful, two of three endings flat) and A4 (theme vs "Neighbors.") are Grade 3–4 work. RL.7.2 asks for a theme *developed over the course of the text*, and the lesson teaches three proofs from the beginning, middle and end. The check never asks for that. |
| 7 | Taught then asked / cold | **2** | **B.19.1**: the options "keep going faster / … / reread the page" are teach question 4's options, with the same answer.<br>**B.11.3**: "Then the lights went out." is the twin of teach "And then it stopped." (cliffhanger).<br>**B.12.1/.2** copy teach ("Clocks" → topic; "the beginning, middle and end"), although they are never drawn.<br>**B.02.1/.2** use "The Last Out", which was practised in two activities. **B.02.3** uses the Rainy Sunday teach passage after the spot-all "Tap every line that shows Yaakov's view at the START", which is the same question.<br>A2 restates the taught label.<br>The pre-check shows A1–A4, and they return in the boss level. |
| 8 | Correct and clear | 4 | Every key is right. Two wordings are confusing:<br>B.10.2 "Yaakov decides to tell the coach he broke the window, so the team misses the final": why would telling make the team miss the final?<br>B.19.1 "finishes a chapter … reread **the page**": which page? |
| 9 | Warm | 5 | Tefillin before the bus, Yanky and Avromi's kindness, Eretz Yisrael rain as a bracha. Names: Naftali, Dovid, Moshe, Yaakov, Reuven, Chaim, Ari. No Divine Name. |

### Answer keys checked by hand

| Item | Key right? | Second defensible option? |
|---|---|---|
| A1 | Yes | Faint: rereading "two chapters slowly" is heavy. Skimming back to where the stranger first appears is what a strong reader does, but no option says that, so the key stands |
| A2 / A3 / A4 | Yes / Yes / Yes | No |
| B.READ.COMP.L08.19.1 / .2 / .3 | Yes / Yes / Yes | No |
| B.READ.LIT.L08.10.1 | Yes | No |
| B.READ.LIT.L08.10.2 | Yes | No, but the cause and effect is muddled (point 8) |
| B.READ.LIT.L08.10.3 | Yes | Slightly: "a choice changes the plot" (Ari chooses to help), but the item asks about the change in Ari, so the key is best |
| B.READ.LIT.L08.11.1 / .2 / .3 | Yes / Yes / Yes | No |
| B.READ.LIT.L08.12.1 / .2 / .3 | Yes / Yes / Yes | No (never drawn) |
| B.READ.LIT.L08.02.1 / .2 / .3 | Yes / Yes / Yes | No |
| B.READ.COMP.L08.12.x, B.READ.COMP.L08.16.x | Yes (see U77) | No |
| B.READ.COMP.L08.18.x | Yes (see U77) | Never drawn here |

### Items to fix (U78)

The new own items use one cold flood scene. It is original, with none of W6's own lines, so it is cold and still on the book's topic.

**A1** (`READ.COMP.L08.19`). Problem: a one-line scenario, it duplicates B.19.1 (the boss level can draw both), and "Skip ahead" is a dead option. New: a real long-page summary, the core reading-coach move at Grade 7.
```json
{"type": "evidence", "skill": "READ.COMP.L08.19", "q": "Sum up this page in one sentence. \"By noon the creek had climbed over the road. Mr. Katz drove the car up the hill, then ran back for the sefarim in the basement. The water was at his knees when he carried up the last box, and his wife was calling from the porch for him to hurry.\" Which is the best one-sentence sum-up?", "p": ["The creek flooded the road, and Mr. Katz saved the car and the sefarim just before the water got deep.", "Mr. Katz drove the car up the hill.", "The water was at his knees, and his wife was calling from the porch."], "a": 0, "look": "one sentence that covers the start, middle and end of the page", "how": "Who did what, and how did it end? One sentence, the whole page."}
```

**A2** (`READ.LIT.L08.10`). Problem: the stem gives the label, and it is too easy. New: a hard case where a setting is present but a choice drives the event.
```json
{"type": "cloze", "skill": "READ.LIT.L08.10", "t": "The storm cut the power, and the radio said the creek would crest within the hour. Shimon could stay by the radio or run down the hill to warn the Levys. He ran, and the Levys got out in time. The Levys are safe because ___.", "o": ["a choice changed the plot", "the setting shaped the problem", "the plot changed the character"], "a": "a choice changed the plot", "how": "The storm made the danger. What made the Levys safe? Ask: what if he had stayed?"}
```

**A3** (`READ.LIT.L08.11`). Problem: two of the three endings are flat, so it is Grade 3 level. New: three real suspense tools; tell them apart.
```json
{"type": "evidence", "skill": "READ.LIT.L08.11", "q": "Which chapter ending is a cliffhanger, not a ticking deadline or a question held back?", "p": ["Then, over the roar of the water, they heard someone calling for help from the roof next door.", "The river would crest at six. It was already a quarter past five, and the boat still had no oars.", "Saba would never say why he kept the old rowboat in the shed, and tonight he went out to check it again."], "a": 0, "look": "a page that stops at the worst moment", "how": "Is time running out? Is an answer saved for later? Or does it stop right at the danger?"}
```

**A4** (`READ.LIT.L08.12`). Problem: theme vs a single word is Grade 4 work. New: theme plus three proofs spread across the book (RL.7.2).
```json
{"type": "evidence", "skill": "READ.LIT.L08.12", "q": "Theme: \"Courage means acting while you are still afraid.\" Which three proofs show it best across the whole book?", "p": ["Ch. 1: Dov hides from the thunder. Ch. 4: shaking, he carries the Levys' baby up the stairs. Ch. 8: he admits he was scared the whole time.", "Three lines from ch. 8, where the fire chief praises Dov.", "Ch. 1, ch. 4 and ch. 8: each tells how high the river rose."], "a": 0, "look": "proofs about the theme, from the beginning, middle and end", "how": "Are the proofs about the theme, and are they spread across the book?"}
```

**Second own items** (so the pre-check and the boss level can differ):
```json
{"type": "evidence", "skill": "READ.COMP.L08.19", "q": "Before reading a long chapter called \"The Night the Bridge Fell\", Elisha writes a question to answer. Which is the best one?", "p": ["Who was on the bridge, and did they get across?", "How many pages is this chapter?", "What is the last word of the chapter?"], "a": 0, "look": "a question the chapter itself will answer", "how": "Use the title. What will the chapter tell you?"}
{"type": "evidence", "skill": "READ.LIT.L08.10", "q": "At the start, Ezra laughs at the old mill. After the flood, he spends every Sunday helping to rebuild it. What link is this?", "p": ["the plot changes the character", "the setting shapes the problem", "a choice changes the plot"], "a": 0, "look": "who he is at the start, and at the end", "how": "Compare Ezra at the start and at the end. What changed him?"}
{"type": "evidence", "skill": "READ.LIT.L08.11", "q": "Why does the author end chapter 5 with \"Then the phone rang. It was the fire hall.\" and not tell the call until chapter 6?", "p": ["to make the reader turn the page to find out", "because the call does not matter", "to show that the story is over"], "a": 0, "look": "what the held-back call does to the reader", "how": "What do you want to do when the chapter stops there?"}
{"type": "evidence", "skill": "READ.LIT.L08.12", "q": "Which is a theme statement, not a topic, a summary or a rule?", "p": ["A family that loses its house can still keep its home.", "Floods.", "Always help your neighbors."], "a": 0, "look": "a full sentence about life that the story shows", "how": "A word is a topic. An order is a rule. A theme is what the story shows about life."}
```

**B.READ.COMP.L08.19.1**. Problem: teach question 4's options with the same answer, and "the page" does not fit "a chapter". Fix: `{"q": "Dovid finishes chapter 6 and cannot say why the boys left the camp. What is his best next move?", "o": ["go back to the part where they leave and reread it", "mark it as an open question and read on", "read the summary on the back cover"], "h": "Lost? The book already told you. Go back, slowly."}`

**B.READ.LIT.L08.10.2**. Problem: muddled cause and effect. Fix: `{"q": "Yaakov decides to tell the coach he broke the window. The coach benches him for the final, and the team must play without its best pitcher. What is this?", "o": ["a choice changes the plot", "the plot changes the character", "the setting shapes the problem"], "h": "What if he had kept quiet?"}`

**B.READ.LIT.L08.11.3**. Problem: the twin of the teach line. Fix: `{"q": "A chapter ends: \"Behind the locked cellar door, something heavy hit the floor.\" What is this?", "o": ["a cliffhanger ending", "a question held back", "a ticking deadline"], "h": "Does the page stop at the worst moment?"}`

**B.READ.LIT.L08.02.1 / .2 / .3** (review, also drawn in U85). Problem: the passages were practised. Fix: one cold two-voice passage in the lesson's own format, with three checks on it.
```
Passage "The Dvar Torah"
NOSSON
For a month I practised my bar mitzvah dvar Torah. When I stood up, my mind went blank. I read from the card, fast, staring at the tablecloth. I was sure everyone was bored.
CHEZKY
I sat next to Nosson's Zeidy. When Nosson read the part about his great-grandfather leaving Tunis with nothing, Zeidy took off his glasses and wiped his eyes. He whispered to me, "He said it exactly right."
```
- .1: `{q:'Why does Nosson think his dvar Torah went badly?', o:['his mind went blank and he read fast from the card','Zeidy told him it was wrong','Chezky laughed at him'], h:'Find what Nosson says about himself in his own part.'}`
- .2: `{q:'What does the reader know that Nosson does not know?', o:['his Zeidy was moved and said he said it exactly right','he read from a card','his dvar Torah was about his great-grandfather'], h:'Nosson cannot see what Chezky saw. What does Chezky\'s part tell us?'}`
- .3: `{q:'Which sentence best contrasts the two views of the same dvar Torah?', o:['Nosson thinks it bored everyone; Chezky sees it touch Zeidy\'s heart','both boys think it went badly','Chezky thinks Nosson should have practised more'], h:'How does each boy see the same moment?'}`

**B.READ.LIT.L08.12.1 / .2** (low priority, never drawn now, but they are copies of teach questions):
- .1: `{"q": "A story's theme is \"Help given in time is worth more than help given later.\" What is its topic?", "o": ["helping others", "Help given in time is worth more than help given later.", "The boys fill sandbags before the storm."], "h": "A topic is a word or two. A theme is a sentence about life."}`
- .2: `{"q": "Chaim's theme: \"Owning up takes more strength than hiding.\" Which proofs are best?", "o": ["ch. 2: Eli hides the broken lamp; ch. 5: hiding it makes him miserable; ch. 9: he tells Abba and feels lighter", "three lines from ch. 9, where Eli tells Abba", "ch. 2, 5 and 9: each describes the lamp"], "h": "Are the proofs about the theme, and spread across the story?"}`

**Unit data:** in `C68.U78.review`, put `READ.COMP.L08.18` among the first three, or remove it. Today it is never asked.

**Verdict U78: FAIL** (1 = 3, 3 = 3, 4 = 3, 5 = 3, 6 = 2, 7 = 2).

---

## Unit C68.U85 · "Point of View and Irony" · Grade 8 (W8 Sherlock Holmes ch. 5–8)

| # | Point | Score | Quote and reason (every score under 5) |
|---|---|---|---|
| 1 | Goal | **3** | All 5 skills are present, including fluency. But both `READ.LIT.L09.01` items test only persuade/inform/entertain (A5 "Come to our siyum! … The purpose is to ___.", A6 "a guide to the city's bus routes"). RL.8.6/RI.8.6 at Grade 8 is about the author's point of view and how he handles other views. There is no mystery passage from W8 or a cold one. |
| 2 | Teaching | 4 | Items match the lessons. The How lines are clear ("Granted: does the author agree, or answer?"). |
| 3 | Progression | **3** | Every boy gets the same 8 own items, and all are easy. Two pairs repeat each other inside one check: A1/A7 ("we saw X hide Y; who is wrong?") and A2/A8 (both about the cost of a trip, both with "Granted"). A9 is never drawn. |
| 4 | Thinking steps | **3** | There is no hard case. A4 "(firmly) … voice should be ___" gives the answer in the stage direction. A2's signal word "Granted" gives the answer. No item has a concession without a signal word, tension with no irony, or a narrator clue to weigh. |
| 5 | Mistake work | **3** | A8 is good: concede, counterclaim and refute are the real confusions. Others are dead: A1 "YANKY: Let us set the table." / "MOTHER: The guests are here."; A7 "MOSHE: What a nice day."; A2 "ignoring"; A4 "silly", "soft and sleepy"; A6 "a funny poem about a lost shoe". |
| 6 | Variety and age fit | **2** | A5, A6 (persuade/inform/entertain with an ad, a bus guide and a funny poem) and A4 (read the stage-direction word) are Grade 2–4 work in a Grade 8 boss level. |
| 7 | Taught then asked / cold | **2** | **A2** "Granted, the field trip costs money" and **A8** "Granted, the trip is expensive" copy the lesson's sort card "Granted, the trip is long." (Concede) and its Oops line.<br>**A7** "Chaim forgot my birthday" repeats the practised pattern three more times: practice "He walks in and sighs, 'Nobody remembered.'", check "No cake. Dovi forgot.", check "Nobody ever fixes anything here".<br>**A3/A9** "I watched … I could not tell what he saw" copy the lesson's cards "I followed my uncle. I had no idea what he saw." and "I held the lamp while Uncle Leib studied the broken lock…".<br>**The pre-check** shows A5, A1, A2, A3 and A4, and every one returns in the boss level. A retake repeats 8 of 10. |
| 8 | Correct and clear | 4 | Every key is right. Two weak spots:<br>A1 never says why Yanky put the ring in the challah cover, so it reads like a prank. That is not wrong, but it is odd.<br>B.14.2 (never drawn) "Critics say a bigger shul costs too much. A full shul turns families away every Yom Tov." is keyed "refuting a point", but the second sentence does not answer the cost; it gives a different reason. |
| 9 | Warm | 5 | Siyum, challah cover, a birthday, the Beacon cast (Akiva). No Divine Name. |

### Answer keys checked by hand

| Item | Key right? | Second defensible option? |
|---|---|---|
| A1 | Yes | No |
| A2 | Yes | No |
| A3 | Yes | No |
| A4 | Yes | No |
| A5 | Yes | Faint: "inform", but the line gives no facts, so "persuade" stands |
| A6 / A7 / A8 / A9 | Yes / Yes / Yes / Yes | No |
| B.READ.LIT.L09.01.1 / .2 / .3 | Yes / Yes / Yes (checked against the passages in `packs/HowToDo3.html`) | No (never drawn) |
| B.READ.LIT.L09.09.1 / .2 / .3 | Yes / Yes / Yes | No (never drawn) |
| B.READ.COMP.L09.14.1 / .3 | Yes / Yes | No (never drawn) |
| B.READ.COMP.L09.14.2 | Weak, see point 8 | Yes: the second sentence is closer to "a reason for the claim" than a refutation (never drawn) |
| B.READ.LIT.L09.10.1 / .2 / .3 | Yes / Yes / Yes | No (never drawn) |
| B.READ.FLU.L09.02.1 / .2 / .3 | Yes / Yes / Yes | No (never drawn) |
| B.READ.LIT.L08.02.1 / .2 / .3 | Yes / Yes / Yes | No (passages practised: fix under U78) |
| B.READ.VOC.L09.01.1 / .2 | Yes / Yes | No ("ink" and "feather" are good traps) |

### Items to fix (U85)

The new items use cold scenes with the Beacon cast and a Watson-style narrator. None of them quotes W8.

**A1** (`READ.LIT.L09.09`). Problem: the wrong options are random lines. New: a hard case, tension with no knowledge gap against real dramatic irony.
```json
{"type": "evidence", "skill": "READ.LIT.L09.09", "q": "Which moment is dramatic irony?", "p": ["We watched the missing letter slip behind the desk. Akiva tells the room, \"Someone here took it,\" and stares at Benny.", "Nobody, not even the reader, knows who took the letter. Akiva stares at Benny.", "Akiva finds the letter behind the desk and laughs at himself."], "a": 0, "look": "a gap between what we saw and what the character believes", "how": "Ask: what do I know that this character does not? Tension alone is not irony."}
```

**A7** (`READ.LIT.L09.09`). Problem: a copy of the practised "someone forgot" pattern. New: what the gap does.
```json
{"type": "evidence", "skill": "READ.LIT.L09.09", "q": "We know the stranger knocking at the door is Zeidy, home early from Eretz Yisrael as a surprise. Inside, the boys whisper, \"Don't open it. We don't know who he is.\" What does the author gain from this gap?", "p": ["warm, funny tension while we wait for the boys to find out", "a mystery for the reader to solve", "a flashback that explains the past"], "a": 0, "look": "what the audience feels because it knows more", "how": "Who knows the answer already: the boys or you? So is it a mystery for you?"}
```

**A2** (`READ.COMP.L09.14`). Problem: the signal word "Granted" was taught on a near-identical card. New: a concession without "granted", and an order trap.
```json
{"type": "cloze", "skill": "READ.COMP.L09.14", "t": "\"The trip to Washington does cost money; that much is true. Still, one day at the Air and Space Museum teaches what no textbook can.\" In these two sentences, the author ___.", "o": ["concedes a point, then refutes it", "refutes a point, then concedes it", "only states the other side"], "a": "concedes a point, then refutes it", "how": "Sentence 1: does he agree with part of the other side? Sentence 2: does he answer it?"}
```

**A8** (`READ.COMP.L09.14`). The item is good; only change the topic so it does not repeat A2 and the practised "trip".
```json
{"type": "evidence", "skill": "READ.COMP.L09.14", "q": "Some say the Beacon should stop printing and go online only. Which sentence refutes that?", "p": ["But many grandparents who read it every Shabbos have no computer to read it on.", "It is true that paper costs more every year.", "Some say printing the paper wastes money."], "a": 0, "look": "an answer to the other side, not agreement or a repeat", "how": "Which one answers the worry, instead of agreeing with it or repeating it?"}
```

**A3** (`READ.LIT.L09.10`). Problem: it copies the practised "I watched … I could not tell" cards. New: a Grade 8 hard case, a clue the narrator plants but misses.
```json
{"type": "evidence", "skill": "READ.LIT.L09.10", "q": "A mystery is told by the detective's helper. Which sentence gives the reader a clue that the narrator himself misses?", "p": ["\"Our visitor brushed chalk dust from his sleeve and said he had come straight from the bank. I thought nothing of it.\"", "\"I was sure, at once, that the clerk was the thief.\"", "\"My uncle said nothing, and I could not tell what he was thinking.\""], "a": 0, "look": "a detail the narrator reports but does not understand", "how": "Find a detail that does not fit the story the visitor tells. Does the narrator notice it?"}
```

**A9** (`READ.LIT.L09.10`). It is never drawn today, and it copies A3. Replace it so it becomes a real second item:
```json
{"type": "evidence", "skill": "READ.LIT.L09.10", "q": "Why would a Sherlock Holmes mystery be weaker if Holmes told it himself?", "p": ["He would know the answer from the start, so the reader could not guess along.", "Holmes uses harder words than Watson.", "The reader would learn fewer facts about the case."], "a": 0, "look": "what a narrator who knows everything does to a mystery", "how": "Who knows the answer early? What would that do to the guessing?"}
```

**A4** (`READ.FLU.L09.02`). Problem: the stage direction gives the answer, and it is Grade 3 level. New: pacing a reveal with no stage direction.
```json
{"type": "evidence", "skill": "READ.FLU.L09.02", "q": "BENNY: The last person to touch the folder... was the one who reported it missing. How should Benny read this line?", "p": ["slow down and pause before \"was the one who reported it missing\"", "speed up to the end so it sounds exciting", "say every word at the same loud level"], "a": 0, "look": "where the reveal is, and what the voice does just before it", "how": "Find the reveal. Where does the audience need a breath before it?"}
```
A second fluency item:
```json
{"type": "evidence", "skill": "READ.FLU.L09.02", "q": "YONI: (calmly, but too fast) I was home all night. Ask anyone. What should the actor show?", "p": ["calm words, but a rushed pace that hints he is nervous", "a slow, sleepy voice", "a loud, angry shout"], "a": 0, "look": "two parts of the stage direction working together", "how": "Read both parts of the ( ). What does 'too fast' tell the audience?"}
```

**A5** (`READ.LIT.L09.01`). Problem: persuade/inform/entertain is Grade 2–4 work. New: the author's viewpoint slipping into a news report (RI.8.6).
```json
{"type": "evidence", "skill": "READ.LIT.L09.01", "q": "A reporter writes about the town's plan to close the old library. Which sentence lets the reporter's own viewpoint slip in?", "p": ["The council will close the library in June, ending ninety years of free reading for the town.", "The council voted 5 to 2 to close the library in June.", "The library's books will move to the new branch on Park Avenue."], "a": 0, "look": "words that judge, not just report", "how": "Which sentence only reports, and which one makes you feel something about the closing?"}
```

**A6** (`READ.LIT.L09.01`). Problem: Grade 2 level. New: main purpose when facts serve a sales push (the lesson's own Oops: "topic is not purpose").
```json
{"type": "evidence", "skill": "READ.LIT.L09.01", "q": "A museum flyer: \"Ride the 1830 rails! Our B&O tour shows you the first passenger trains in America. Book your family's visit today; the train ride sells out every Sunday!\" What is the flyer's main purpose?", "p": ["to persuade families to visit, using history as the hook", "to inform, because it gives a fact about the first trains", "to entertain with a story about trains"], "a": 0, "look": "what the writer wants you to do", "how": "A fact inside a text does not make its purpose 'inform'. What does it ask you to do?"}
```

**B.READ.COMP.L09.14.2** (never drawn today, but it will be once the engine picks randomly). Fix: `{q:'"Critics say a bigger shul costs too much. But the building fund already holds half the cost, and families have pledged the rest." What does the second sentence do?', o:['refuting a point','conceding a point','a counterclaim']}` (shape as in that file: key first).

**B.READ.LIT.L08.02.x** (review): use the "Dvar Torah" fix under U78.

**Verdict U85: FAIL** (1 = 3, 3 = 3, 4 = 3, 5 = 3, 6 = 2, 7 = 2).

---

## Summary

| Unit | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | Verdict | Items to fix |
|---|---|---|---|---|---|---|---|---|---|---|---|
| C68.U77 | 3 | 4 | 3 | 3 | 2 | 2 | 2 | 4 | 5 | **FAIL** | 12 (A1, A2, A4; B.01.1–.3, B.16.1–.2, B.17.1–.3, B.18.3), plus A3 optional and 4 new second own items |
| C68.U78 | 3 | 4 | 3 | 3 | 3 | 2 | 2 | 4 | 5 | **FAIL** | 12 (A1–A4; B.19.1, B.10.2, B.11.3, B.02.1–.3, B.LIT.L08.12.1–.2), plus 4 new second own items and the review order |
| C68.U85 | 3 | 4 | 3 | 3 | 3 | 2 | 2 | 4 | 5 | **FAIL** | 10 (A1–A9 and B.14.2), plus a second fluency item; B.02 shared with U78 |

- **No answer key is wrong. Nothing marks a right answer wrong (no URGENT items).**
- All three fail for the same reasons:
  - the own items are one-liners at Grade 3–4 level with dead distractors;
  - several checks repeat taught lines or practised passages;
  - the engine makes every check less cold, because the pre-check and the boss level show the same first own item, and U85 is the same 8 items every time.
- **Job T (engine, `src/CoreUnits.html`):**
  - pick a random unused own item in `per()`, and use a different one, or a lesson check, in `'pre'` mode;
  - say in the file header that only the first 3 review skills are used, or use all of them.
- **Pack rule (from the `TL_PACKS` note on ReadMore):** keep exactly 3 checks per skill when you replace the `packs/ReadMore.html` checks, because a 4th once made a skill unmasterable.
