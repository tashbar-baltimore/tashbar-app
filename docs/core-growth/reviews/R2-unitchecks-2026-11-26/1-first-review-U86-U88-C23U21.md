# Unit checks (boss levels) review · C68.U86, C68.U88, C23.U21 (2026-11-26)

**Fresh reviewer.** I wrote none of this content. I read:
- the standard (CLAUDE.md, REVIEWS.md, R2);
- the maps (C68 §3–5, C23 §3–5) and the cast notes;
- the three packets;
- the unit sources (`src/CoreDataC68H2.html:585`, `src/CoreDataC68H3.html:308`, `src/CoreDataC231.html:214`);
- the full check pool with passages (`pool.json`);
- the boss engine `src/CoreUnits.html`.

I checked every answer key by hand. I did not score down for the two known engine issues: passages not shown, and evidence answers first (a:0).

Points: 1 goal · 2 teaching · 3 progression · 4 thinking steps · 5 mistake work · 6 variety and age fit · 7 taught then asked (cold) · 8 correct and clear · 9 warm.

## First: what the boss level REALLY draws (from `CoreUnits.html` `build()`, lines 57–67)

The engine takes the unit's own items first, in array order. It uses a lesson check question only when a skill has no unused own item left. So the sets are fixed:

| Unit | Pre-check (test-out) | Boss level (n) | Own items never drawn | Lesson checks drawn |
|---|---|---|---|---|
| C68.U86 | A4, A1, A3, A2, A5 | A4, A1, A3, A2, A5, **1 random L09.14 check, 1 random L09.09 check**, A6, A7, A8 (10) | **A9** | only the 2 review skills |
| C68.U88 | A5, A1, A2, A3, A4 | A5, A1, A2, A3, A4, **1 random L09.09 check, 1 random L09.18 check**, A10, A6, A7 (10) | **A8, A9** | only the 2 review skills |
| C23.U21 | A1, A3, A5, A7 | A1, A3, A5, A7, **1 random L02.01 COMP check, 1 random L02.01 LIT check**, A2, A4 (8) | **A6, A8** | only the 2 review skills |

What this means:
- **The pre-check items are exactly the first five (U86, U88) or four (C23) boss items.** A boy who misses the pre-check, does the lessons, and then plays the boss gets the same questions again. The boss level is not cold for him.
  - This is an engine fix: the pre-check should take the *last* own item for each skill, or a lesson check question.
  - I scored it once under point 7 for each unit. It needs the coordinator or job T.
- **The unit skills' lesson check questions (B.\*) are never drawn by the boss while own items exist.** They still play as the lessons' own Show me checks. I scored the boss on what it draws. I still checked every B question (point 8 table) and list fixes, because they play in the lessons.
- **The `how` on an `evidence` item is never shown anywhere.** The kit's evidence How box is built from `look` (`CoreKitActs.html:84`), and the boss shows no How box. Only `look` and `how` on cloze matter in practice.
- **Fix n:**
  - With **U86 `n:12`, U88 `n:12`, C23 `n:10`**, every own item is drawn. The maps allow 8–12 (C68) and 8–10 (C23).
  - The fill loop runs `i < skills*2`, so 12 and 10 are reachable.
  - With the extra U86 item A10 below, n:12 draws A6–A10.

---

## C68.U86 "Judge the Argument" (Grade 8)

| Point | Score | Quote and reason (every score under 5) |
|---|---|---|
| 1 Goal | 4 | Every item has the right skill. But **A4** "Strong evidence is relevant and ___" checks a definition, not the skill. Nothing uses the unit's topic set ("Money and trust": barter, banks, gemach, credit). The map asks for a check "on a new passage", and no passage is used. |
| 2 Teaching | 4 | The items match the lessons. The How lines **A4** ("is it from someone who knows?") and **A5** ("Sense first, then detail.") hand over the answer. They are never shown in the boss level, but they would be if the items were reused. |
| 3 Progression | 3 | All 8 own items in the boss level are one-step and easy. None asks for the hard cases the lessons built up to: relevant but unreliable, newer but a seller, two careful sources agree. |
| 4 Thinking steps | 3 | No hard case. **A3** puts a careful 2023 report against "a 1998 newspaper ad" and "a sign at the town fair". The newest source is also the careful one, so "newer" alone gets it right. |
| 5 Mistake work | 3 | Silly distractors: **A5** "Memorize every number first." / "Skip to the last sentence."; **A8** "which number is bigger" / "which source has more pictures"; **A4** "surprising" / "repeated". |
| 6 Variety, age fit | 3 | Only two kinds (evidence used as choose-one, and cloze). A3, A4, A5 and A8 are Grade 4–5 work: a Grade 5 boy gets them right without the Grade 8 lessons. |
| 7 Cold | 2 | **A5** answer "Read it once for the big idea." is word for word the lesson's order tile "Read it once for the big idea." (and the teach answer "the big idea"). **A3** is the practice item "2020 Census vs 1990 tour guide" again. **A8** is the Watch me (Everest heights, "Who and When"). **A4** repeats the practice line "relevant AND reliable". Pre-check = boss (above). |
| 8 Correct, clear | 3 | All keys are right (table below). **A2** gives no fact: "The new shul will be too small in five years" is a *prediction*, and the lesson's "interpretation" is what a *fact* means. **A3** says "Two sources disagree" but shows three. **B.L09.15.3** (lesson): "true but off topic" can be defended. **B.FLU.L09.04.3**: "after two reads … no details" contradicts the method (the second read *is* the detail read). |
| 9 Warm | 4 | Yeshiva, shul and night seder are warm. The own items have no names and no Beacon cast. **B.L09.03.2** (lesson check) is "A sign at a crab house … the best crabs in the world": praising a treif food. Fix below. |

### Point 8: every item (key right? second answer?)
| Item | Key right? | Second answer defensible? |
|---|---|---|
| A1 | yes | weak: "painted blue in 2015" hints at the van's age. Fixed below. |
| A2 | yes | concept unclear (prediction, no fact given) |
| A3 | yes | no (wording: "two" sources, three shown) |
| A4 | yes | no |
| A5 | yes | no |
| A6 | yes | "Chess boards are cheap" is relevant (cost) but weaker. Acceptable. |
| A7 | yes | no |
| A8 | yes | no |
| A9 | yes | no (never drawn) |
| B.L09.01.1–.3 | yes, yes, yes | no |
| B.L09.15.1 | yes | no |
| B.L09.15.2 | yes | no. The stem "This evidence…" does not fit "a feeling, not a fact". |
| B.L09.15.3 | yes | **yes**: the cousin story argues *against* the claim, and "runs fast" is arguably off topic |
| B.L09.03.1–.3 | yes, yes, yes | no ("150 rivers" is close to the usual "more than 150 rivers and streams") |
| B.L09.16.1–.3 | yes, yes, yes | no |
| B.FLU.L09.04.1–.2 | yes, yes | no |
| B.FLU.L09.04.3 | yes | wording contradicts the method |
| B.L09.14.1, .3 | yes | no |
| B.L09.14.2 | yes (best of three) | the second sentence does not answer the cost at all, and "a counterclaim" does not fit "What does it do?" |
| B.L09.09.1–.3 | yes | no |

### Items to fix (U86)
Own items go in `src/CoreDataC68H2.html` `C68.U86 items`, and set **`n:12`**.

**A1 (must):** too easy, and the date hint. Replacement:
```js
{type:'evidence', skill:'READ.COMP.L09.15', q:'Claim: the yeshiva needs a bigger van. Which evidence does NOT belong?', p:['The company that makes the van sold 40,000 vans last year.','The old van seats 12, and the 8th grade now has 22 boys.','Twice this month, boys had to wait for a second trip.'], a:0, look:'a true fact that does not help this claim', how:'Take each one away. Is the claim any weaker?'},
```
**A2 (must):** no fact given (prediction, not interpretation), and weak distractors. Replacement:
```js
{type:'cloze', skill:'READ.COMP.L09.16', t:'Fact: 30 new families joined the shul this year. Reading: "In five years the shul will be too small." The reading is ___.', o:['an interpretation','a counted fact','a counterclaim'], a:'an interpretation', how:'Could you count it today, or is it what someone thinks the fact means?'},
```
**A3 (must):** not cold (practice Census vs tour guide), no hard case, and "two" sources with three shown. Replacement (hard case: newer, but a seller):
```js
{type:'evidence', skill:'READ.COMP.L09.03', q:'Three sources give different numbers for a town\'s population. Which do you trust?', p:['the 2020 national census, which counted every home','a 2024 real estate website that says the town is "booming"','a 2010 encyclopedia'], a:0, look:'a careful count, not a seller', how:'Ask of each one: who counted, and when?'},
```
**A4 (must):** a definition, not the skill. Replacement (relevant but not reliable):
```js
{type:'evidence', skill:'READ.COMP.L09.01', q:'Claim: the yeshiva should open the gym on Sunday mornings. Which evidence is about the claim but NOT reliable?', p:['A boy on the bus said "everyone" wants it.','The gym teacher\'s sign-up sheet: 64 boys signed in one day.','The yeshiva\'s records show the gym was built in 1985.'], a:0, look:'on topic, but not from someone who checked', how:'Use both tests on each one: is it about the claim? Is it from someone who knows?'},
```
**A5 (must):** the answer is word for word in the lesson, and the distractors are silly. Replacement (do the skill on a cold dense paragraph, topic set "Money and trust"):
```js
{type:'evidence', skill:'READ.FLU.L09.04', q:'Read 1, for the big idea: "Many shuls have a gemach. It lends money with no interest and no fee, and it asks only that each loan be paid back on time, so the next family can borrow too." What is the big idea?', p:['A gemach lends money free, and paying it back keeps it going for others.','Many shuls have a gemach.','Each loan must be paid back on time.'], a:0, look:'what the whole paragraph is about', how:'Cover the details. What is the paragraph mostly saying?'},
```
**A6 (should):** distractors too weak for Grade 8. Replacement (two real traps: an expert's opinion, and a true fact that is off topic):
```js
{type:'evidence', skill:'READ.COMP.L09.01', q:'Claim: the yeshiva should start a chess club. Which evidence is strongest?', p:['A study of 500 students found that chess players did better in math.','A chess champion says chess is the best game in the world.','Chess was invented more than 1,400 years ago.'], a:0, look:'relevant and reliable', how:'Test each one: is it about the claim? Is it a fact from someone who checked?'},
```
**A7 (should):** the same "invented long ago" pattern as the teach item (1950 card) and B.L09.15.1 (2,000-year libraries). Replacement (true, about bike lanes, but not about this street):
```js
{type:'evidence', skill:'READ.COMP.L09.15', q:'Claim: Main Street needs a bike lane. Which evidence does NOT belong?', p:['Bike lanes in Amsterdam are painted red.','Twelve bike accidents happened on Main Street last year.','Two hundred boys ride to yeshiva on Main Street.'], a:0, look:'a true fact about bike lanes that does not help this street', how:'Ask of each one: does it show THIS street needs a lane?'},
```
**A8 (must):** near-identical to Watch me, and silly distractors. Replacement (the "do others agree?" step; the bridge opened in 1952, checked):
```js
{type:'evidence', skill:'READ.COMP.L09.03', q:'When did the Chesapeake Bay Bridge open? A 2022 Maryland state website says 1952. A 2015 encyclopedia says 1952. A forum post with no name says 1958. Which year do you use?', p:['1952, because two careful sources agree','1958, because a different number must be a correction','none, because the sources disagree'], a:0, look:'what careful sources agree on', how:'Who wrote each one? Do the careful ones agree?'},
```
**A9 (should):** never drawn (fixed by n:12). A harder fact distractor:
```js
{type:'evidence', skill:'READ.COMP.L09.16', q:'Fact: 60 boys came to the library on Monday, 20 more than last Monday. Which sentence is an interpretation?', p:['The new books are what brought the boys in.','60 boys came on Monday.','That is 20 more than last Monday.'], a:0, look:'what someone says the fact means', how:'Which one could you not count?'},
```
**A10 (new, must):** READ.FLU.L09.04 has only one own item, so the pre-check and boss level always ask the same one. Add:
```js
{type:'evidence', skill:'READ.FLU.L09.04', q:'Read 2, for detail: "A bank lends out most of the money people keep in it. In 1933, Congress passed a law to insure deposits, so a family would not lose its savings if a bank failed." Which detail proves that savings became safer?', p:['In 1933, Congress passed a law to insure deposits.','A bank lends out most of the money people keep in it.','Most families have a bank account.'], a:0, look:'the detail that backs up the big idea', how:'Find the big idea first. Then find the detail that proves it.'}
```

Lesson check questions (shape: the first choice in `o` is the right one):
- **B.READ.COMP.L09.15.2** (should, `src/CoreDataC68H2.html`): the stem does not fit the choices. → q: `Claim: buses should have seat belts. "In crashes, seat belts cut injuries by about half." This evidence is...` o: `['belongs: it supports the claim','true but off topic','a feeling, not a fact']`
- **B.READ.COMP.L09.15.3** (must, line 348): a second answer can be defended. → q: `Claim: every boy should eat breakfast. "My cousin eats breakfast every day, and he is never tired." What is wrong with it?` o: `["one person's story, not proof",'true but off topic','nothing']`
- **B.READ.COMP.L09.03.2** (must, kosher; `packs/HowToDo3.html`, update its `TL_PACKS` line). Rename its How key too.
  - p: `A sign in a pizza shop window says: We make the best pizza in Baltimore.`
  - q: `Pizza sign, on your own. Can you use this as a fact in a report?`
  - o: `['No. It is an opinion from someone selling pizza.','Yes. It is on a sign.','Yes. Many people agree.']`
- **B.READ.COMP.L09.03.3** (should, not cold: the answer is the practice answer "Check it in another reliable source."):
  - p: `Chaim found a number on one website with no author: more than 150 rivers and streams flow into the Chesapeake Bay. Then he found the same number on a State of Maryland website.`
  - q: `Chaim's number, on your own. What can he do now?`
  - o: `['Use it: a careful source agrees.','Leave it out: the first website had no author.','Change it a little to be safe.']`
- **B.READ.COMP.L09.16.1** (should, the same choices as teach item 1) → q: `Fact: the lunchroom is crowded. Writer A: "Build a bigger lunchroom." Writer B: "Eat in two shifts." Which is true?` o: `['They agree on the fact but read what it means differently.','They disagree about whether the lunchroom is crowded.','They agree on the plan.']`
- **B.READ.FLU.L09.04.2** (should, not cold: the same bridge sentence is in L09.03 practice, and the answer is the teach line) → q: `"In 1792, twenty-four brokers met under a buttonwood tree on Wall Street." Reading aloud, where should you slow down most?` o: `['at "1792", "twenty-four" and "Wall Street"','at "met under a"','nowhere: read it all at one speed']`
- **B.READ.FLU.L09.04.3** (must, wording contradicts the method) → q: `After one read, Yitzy can say the big idea but cannot name one detail. What should he do next?` o: `['read it again, slowly, and check each detail against the big idea','read it again just as fast','move on: the big idea is enough']`
- **B.READ.COMP.L09.14.2** (must, drawn as a review in U86) → q: `"Critics say a bigger shul costs too much. But every Yom Tov, a full shul turns families away, and that costs us more." What does the second sentence do?` o: `['refutes the critics','concedes a point','states the author\'s claim']`

**Verdict U86: FAIL** (points 3, 4, 5, 6 and 8 at 3; point 7 at 2).

---

## C68.U88 "Old Stories, New Stories" (Grade 8)

| Point | Score | Quote and reason (every score under 5) |
|---|---|---|
| 1 Goal | 4 | All five skills are covered. But the map says unit 8.8 is "the whole year", and it uses only 2 review skills (the engine allows 3). No item uses the unit's book (W9 *Kidnapped* ch. 5–8). |
| 2 Teaching | 4 | The items match the lessons. The How line on **A6** ("Who once did this for him?") gives the answer. |
| 3 Progression | 3 | Every item the boss level draws is one-step identification. Nothing asks him to judge a change, weigh two readings, or plan a speech. |
| 4 Thinking steps | 3 | No hard case: a right verdict with the wrong reason (A7), a summary dressed as a theme (A3), or a helper who is really a test (A1). |
| 5 Mistake work | 2 | Silly distractors: **A1** "The money pouch." / "The storm that blocks the road." (not people, but the guide is a person); **A2** "shoes" / "house"; **A4** "sit down"; **A7** "Yes: films should change everything"; **A10** "a mistake by the author"; **A9** "whisper" / "laugh"; review **B.L09.18.1** "a poem", **.2** "a recipe", **.3** "a weather report". These are 2-choice items in disguise. |
| 6 Variety, age fit | 2 | Five of the boss level's first five items are Grade 4–5 work: **A5** "a chapter jumps back … What is it? a flashback"; **A3** theme vs summary; **A2** "close-up of his ___ face"; **A1** pick the guide; **A4** "pause". |
| 7 Cold | 2 | **A4** "should ___ pause" is the teach answer "slow and clear, with a pause before it". **A6** "he gives what he was given" is the teach answer "he does for someone else what was done for him". **A5** is the teach item "Which chapter jumps back in time?". **A2** is the teach answer "through his face…". **A3** is the "Theme, or summary?" sort. **A10** is the practice "Tap every way the ending echoes". Review **B.L09.18.3** repeats the teach item "The careless club owners…". Pre-check = boss. |
| 8 Correct, clear | 3 | All keys are right. **A2**: "shoes" can be defended (a close-up of tapping or shaking feet is a common way films show nerves). Lesson checks **B.L09.12.1** ("What could it use?" → "by printing the words on the screen") do not fit the stem grammatically, and the stem rules out two choices. **B.L09.02.1–.3** reuse the teach and practice passages (not cold). |
| 9 Warm | 4 | Avi, Moshe, Dovid, Dovi and Shloimy, the harvest money, an uncle teaching swimming: warm and modest. But the Beacon cast is never used in this unit, which is Grade 8's last. |

### Point 8: every item
| Item | Key right? | Second answer defensible? |
|---|---|---|
| A1 | yes | no |
| A2 | yes | **yes: "shoes"** (feet close-up). Drawn in both the pre-check and the boss level. |
| A3, A4, A5 | yes | no |
| A6 | yes | no ("the dark moment" is not one of the taught stages, but it is a harmless distractor) |
| A7 | yes | no |
| A8 | yes | no (never drawn) |
| A9 | yes | no (never drawn) |
| A10 | yes | no |
| B.L09.02.1–.3 | yes | no (but not cold: the Camp Diary is used in practice, and the Watch story is the teach passage) |
| B.L09.11.1–.3 | yes | no |
| B.L09.12.1 | yes | no, but the grammar does not fit and the stem gives it away |
| B.L09.12.2–.3 | yes | no (the choices are the teach item's choices, word for word) |
| B.L09.13.1 | yes | "a fact" is weakly defensible ("The story is about…" is a true statement) |
| B.L09.13.2–.3 | yes | no |
| B.FLU.L09.03.1–.3 | yes | no (the choices are the teach item's choices, word for word) |
| B.L09.09.1–.3 | yes | no |
| B.L09.18.1–.2 | yes | no |
| B.L09.18.3 | yes | mild: "stubborn" could appear in a quote in a news report. Keyed by the taught rule. |

### Items to fix (U88)
Own items go in `src/CoreDataC68H3.html` `C68.U88 items`, and set **`n:12`**. Also consider adding a third review skill from units 8.1–8.4 ("the whole year").

**A1 (must):** distractors that are not people. Replacement (a stranger who is a test, and the mother who is the call):
```js
{type:'evidence', skill:'READ.LIT.L09.11', q:'A new story: Yehoshua must cross the mountains to bring his family the harvest money. Which one is the guide?', p:['An old trader who shows him the safe pass, then turns back.','A stranger who offers to carry the money for him.','His mother, waiting at home for the money.'], a:0, look:'who shows the hero the way', how:'The guide shows the way but does not walk it for him.'},
```
**A2 (must):** a second answer, and taught word for word. Replacement:
```js
{type:'evidence', skill:'READ.LIT.L09.12', q:'In the book, Yoni\'s thoughts tell us he is scared of the dark attic. The film has no words for his thoughts. Which film choice shows his fear best?', p:['A close-up of his hand shaking on the rail, with slow, low music.','A sign on the attic door that says KEEP OUT.','A wide shot of the house from across the street.'], a:0, look:'a way to see a feeling', how:'Which one lets us see what HE feels, not just the place?'},
```
**A3 (must):** Grade 4 level, and not cold. Replacement (a summary that tempts, and a theme the text does not support):
```js
{type:'evidence', skill:'READ.LIT.L09.13', q:'Story: Shmuel\'s chavrusa makes the same mistake every day. Shmuel does not say it in front of the class. After seder he shows him quietly, and soon his chavrusa gets it right. Which is a theme, not a summary?', p:['Helping a friend kindly and privately helps him grow.','Shmuel shows his chavrusa the mistake after seder.','You should never point out a friend\'s mistake.'], a:0, look:'what the story means, and the text backs it up', how:'Is it what happened, or what it means? Does the story prove it?'},
```
**A4 (must):** the answer is the teach answer, and "sit down" is silly. Replacement (a cold speech with the Beacon cast):
```js
{type:'evidence', skill:'READ.FLU.L09.03', q:'Akiva\'s speech at the Beacon\'s last edition: "We built this paper one page at a time. We argued, we fixed, we tried again. And we learned that the truth is worth the work." Where should the longest pause go?', p:['just before "And we learned that the truth is worth the work."','between "one page" and "at a time"','after "We argued"'], a:0, look:'the pause before the line to remember', how:'Find the line people should remember. Where does a pause let it land?'},
```
**A5 (must):** the teach item, Grade 4 level. Replacement (why the author chose this order):
```js
{type:'evidence', skill:'READ.LIT.L09.02', q:'A book opens with Reuven, now old, dancing at his grandson\'s chasunah. Chapter 2 jumps back sixty years, to the day he came to America alone. Why open at the end of his story?', p:['So we know it ends well and wonder how he got there.','So the ending stays a surprise until the last page.','Because every book must start with a flashback.'], a:0, look:'what the order makes the reader feel', how:'What do we know after Chapter 1? What do we want to find out?'},
```
**A6 (must):** the answer is the teach answer, and the How gives it away. Replacement (the "tests" stage, with a guide-looking trap):
```js
{type:'evidence', skill:'READ.LIT.L09.11', q:'On the road to his Zeidy\'s farm, Dani is offered a ride if he skips the stop his father told him to take. He says no and walks on in the rain. Which stage is this?', p:['a test: he must choose to do right','the guide: someone shows him the way','the return: he comes home changed'], a:0, look:'a hard choice on the road', how:'Is someone helping him, or is he being tried?'},
```
**A7 (must):** strawman distractors. Replacement (the hard case: right verdict, wrong reason):
```js
{type:'evidence', skill:'READ.LIT.L09.12', q:'A film of a book cuts the hero\'s kindness to a stranger. At the end of the book, that same stranger saves him. Is the cut a good change?', p:['No: the ending needs that kindness, so the meaning breaks.','Yes: films must cut scenes to fit the time.','No: a film must keep every scene of the book.'], a:0, look:'whether the meaning survives', how:'Take the scene out. Does the ending still make sense?'},
```
**A8 (should):** weak distractors, and never drawn until n:12.
```js
{type:'evidence', skill:'READ.LIT.L09.13', q:'Story: Avi practices every night but still loses the race. He walks over and cheers for the winner. Which reading does the text best support?', p:['How you act after a loss shows who you are.','If you practice enough, you will always win.','Avi loses the race and cheers for the winner.'], a:0, look:'a theme the whole story backs up', how:'What does Avi do after he loses? What does that show?'},
```
**A9 (must, once n:12 draws it):** "beat" is the teach word, and the distractors are silly.
```js
{type:'evidence', skill:'READ.FLU.L09.03', q:'Speech: "We came as strangers. We learned as chavrusos. We leave as brothers." How should the speaker read these three lines?', p:['Each line strong, with a short beat between, and the last one slowest.','All three fast, in one breath, to build speed.','The first line loud, and the last two in a whisper.'], a:0, look:'how to read a list of three', how:'Three short lines: how does each one land?'},
```
**A10 (must):** not cold, and "a mistake by the author" is silly. Replacement (same Reuven book as A5):
```js
{type:'evidence', skill:'READ.LIT.L09.02', q:'In Chapter 1, a stranger tells young Reuven, "Hold on to your name." In the last chapter, old Reuven says the same words to his grandson. What does the repeated line do?', p:['It echoes the opening and shows how far he has come.','It jumps back in time to Chapter 1.','It hints at what will happen next.'], a:0, look:'a line said twice, by two people', how:'Who says it first, and who says it last?'}
```

Review lesson checks drawn by this boss level (READ.COMP.L09.18 lives in `src/CoreDataC68H2.html`):
- **B.READ.COMP.L09.18.1** (must): "a poem" is silly. → q: `Which sentence is from a news report?` o: `['The storm reached the coast at 4 a.m. with winds of 90 miles per hour.','The storm proved, once again, that our leaders never plan ahead.','Every family should buy a storm kit before it is too late.']`
- **B.READ.COMP.L09.18.2** (must): "a recipe" is silly. → q: `"The town's leaders failed us, and they must resign." Which words show it is from an opinion piece?` o: `['"failed us" and "must"','"The town\'s leaders"','"and they"']`
- **B.READ.COMP.L09.18.3** (must): the teach item again. → q: `A news report says: "The mayor kept the shelters closed until 6 p.m." An editor changes it to: "The stubborn mayor kept the shelters closed." What did the change do?` o: `['It added a loaded word, so now it sounds like an opinion.','It added a fact you could check.','It made the sentence fairer.']`

Lesson Show me checks (`src/CoreDataC68H3.html`):
- **B.READ.LIT.L09.02.1–.3** (should, not cold: the Watch story and the Camp Diary are both used before the check). Use one new cold passage for all three:
  - PASSAGE: `The Lantern (short) / Ch. 1, Today: Ari finds a dented brass lantern in his Saba's attic. Saba says only, "It lit the way once. It will light it again." / Ch. 2, 1949: On a dark night in Teiman, young Saba carries the lantern ahead of his family on the long walk to Aden, where airplanes wait to take them to Eretz Yisroel. / Ch. 3, Today: Ari polishes the lantern and fixes its handle. / Ch. 4, Chanukah: Ari sets the lantern by the window beside the menorah. Saba smiles. "I told you it would light the way again."`
  - .1 q: `Why does Chapter 2 jump back to 1949?` o: `['to show why the old lantern matters so much to Saba','to tell what Ari does on Chanukah','to show what Ari will do next']`
  - .2 q: `Which line from Chapter 1 does the ending pay off?` o: `['"It lit the way once. It will light it again."','Ari finds a dented brass lantern.','The lantern is in Saba\'s attic.']`
  - .3 (order) q: `Put the events in the order they really happened in time.` tiles: `['Saba carries the lantern on the walk to Aden.','Ari finds the lantern in the attic.','Ari fixes the handle.','Ari sets the lantern by the menorah.']`
- **B.READ.LIT.L09.11.3** (should, the teach answer word for word) → q: `Back home, the boy sees his little brother stuck on the same tide charts. Which ending shows the boy has changed most?` o: `['He sits down and teaches his brother, the way the captain taught him.','He tells his brother the trip was hard.','He hangs the charts on his wall.']`
- **B.READ.LIT.L09.12.1** (should) → q: `In the book, Dovid silently worries about his father. Which film choice shows the worry without words on screen?` o: `['Dovid stares at the phone, then at the door, as the music slows.','Dovid laughs with his friends at the table.','The film skips the scene.']`
- **B.READ.LIT.L09.12.2** (should) → q: `A 300-page book becomes a 90-minute film. It cuts the long boat chapter but keeps the storm that changes the hero. Why is that a good choice?` o: `['It fits the time but keeps the scene the meaning needs.','It makes the film more confusing.','It shows the boat chapter was wrong.']`
- **B.READ.LIT.L09.12.3** (should) → q: `The film plays slow, low music as the boys search the dark cellar. The book says nothing about sound. Why did the film add it?` o: `['to make the audience feel the fear the book showed in words','to give a new fact about the cellar','to change what happens next']`
- **B.READ.FLU.L09.03.1** (should) → q: `Graduation speech: "So remember this: be kind, and be brave." Which words should be slowest and clearest?` o: `['"be kind, and be brave"','"So remember"','"this"']`
- **B.READ.FLU.L09.03.2** (should) → q: `"We came here as strangers. We leave as brothers." Where should the longest pause go?` o: `['between "strangers." and "We leave"','after "We came"','after "We leave as"']`
- **B.READ.FLU.L09.03.3** (should) → q: `"Show up. Work hard. Help others." A boy reads it all in one breath. What should he change?` o: `['give each part a short beat','skip "Work hard"','read it even faster']`

**Verdict U88: FAIL** (points 5, 6 and 7 at 2; points 3, 4 and 8 at 3).

---

## C23.U21 "Story Detectives" (Grade 2)

| Point | Score | Quote and reason (every score under 5) |
|---|---|---|
| 1 Goal | 4 | All four skills are covered. But **A1** checks a fact about the method ("look at the title and ___"), not asking a question. In the boss level, retelling is checked only by **A7**, which gives no story to retell. |
| 2 Teaching | 4 | The items match the lessons, and the How lines are clear. **A2**'s How ("Which question is about the glove?") would no longer separate the choices once a glove-word distractor is added. Fixed below. |
| 3 Progression | 3 | All the boss level's own items are the easiest form of each skill. The only items with a passage to read are the two review items. |
| 4 Thinking steps | 3 | No hard case: a sentence with both a WHEN and a WHERE part, a retell out of order, a question whose answer is already printed, or a WHY sentence posing as a HOW sentence. |
| 5 Mistake work | 3 | **A7** "Moshe had a hat." / "The car was blue." (the longest choice is right). **A2** "How tall is the door?" **A1** "last word". |
| 6 Variety, age fit | 4 | Readable by a Grade 2 boy, with short words and short sentences. But there are only two kinds plus the review tiles. |
| 7 Cold | 3 | **A1** answer "picture" is the teach answer "the title and the picture". **A5** is the teach item "Which word often points to a WHY answer? because". Pre-check = boss for A1, A3, A5 and A7. The lesson checks **B.L03.04.1, .3, B.L03.06.2, .3** repeat their teach items with the same choices (they play in the lessons). |
| 8 Correct, clear | **2** | **A5 (URGENT):** "Dovid wore his boots ___ the ground was wet." **"where" also fits**: "Dovid wore his boots where the ground was wet" is a good English sentence that makes sense. A5 is drawn in BOTH the pre-check and the boss level, so a boy can be marked wrong for a right answer. **B.READ.COMP.L02.01.3 (URGENT, drawn as a review):** the tiles "leaves / and / plants" have **two right orders** ("plants and leaves"), which breaks the map's own rule "no tile order with two right answers". **A7** asks for "the best retell of a story" but gives no story. |
| 9 Warm | 5 | Avi, Dovid, Naftali, Moshe, Shloimy, Yanky, Shmuel, Ezriel, Eitan and Yair; Shabbos, shul, challah. The Shabbos Street Club cast is used. Nothing to fix. |

### Point 8: every item
| Item | Key right? | Second answer defensible? |
|---|---|---|
| A1 | yes | no |
| A2 | yes | no |
| A3 | yes | no |
| A4 | yes | no |
| A5 | yes | **YES: "where"** |
| A6 | yes | no (never drawn) |
| A7 | yes | no story given, so the boy cannot check the retell against it |
| A8 | yes | no (never drawn) |
| B.L03.04.1–.3 | yes | no |
| B.L03.05.1–.3 | yes | no |
| B.L03.06.1–.3 | yes | no |
| B.LIT.L03.01.1 (order) | yes | no, one order only |
| B.LIT.L03.01.2–.3 | yes | no (in .3, the right retell is much the longest) |
| B.COMP.L02.01.1 "in its shell" | yes | no |
| B.COMP.L02.01.2 "a trail of slime" | yes | no |
| B.COMP.L02.01.3 "leaves and plants" | yes | **YES: "plants and leaves"** |
| B.LIT.L02.01.1–.2 | yes | no |
| B.LIT.L02.01.3 (order) | yes | no |

### Items to fix (C23.U21)
Own items go in `src/CoreDataC231.html` `C23.U21 items`, and set **`n:10`** so A6 and A8 are drawn.

**A5 (URGENT):** a second right word. Replacement (find the WHY in the words, with a tempting guess):
```js
{type:'evidence', skill:'READ.COMP.L03.06', q:'"Dovid wore his boots because the ground was wet." Why did Dovid wear his boots?', p:['The ground was wet.','He liked his new boots.','He was going to shul.'], a:0, look:'the reason in the words', how:'Find "because". Read the words after it.'},
```
**A1 (must):** the teach answer. Replacement (ask a question while reading; the trap is a question already answered):
```js
{type:'evidence', skill:'READ.COMP.L03.04', q:'You read: "Chaim opened the door. The box on the step was moving!" What is the best question to ask now?', p:['What is in the box?','Who opened the door?','What is for lunch?'], a:0, look:'a question the story will answer next', how:'Which question makes you want to keep reading?'},
```
**A2 (should):** a tempting distractor, and a How that still works.
```js
{type:'evidence', skill:'READ.COMP.L03.04', q:'Title: "The Lost Glove". Which is the best question to ask before you read?', p:['Who lost the glove?','What is a glove?','What is for dinner?'], a:0, look:'a question the story will answer', how:'Which question will the story answer?'},
```
**A3 (should):** the same frame as the teach item. Replacement (find WHERE when a WHEN part is also there):
```js
{type:'evidence', skill:'READ.COMP.L03.05', q:'"On Sunday, Avi saw a frog at the river." Which words tell WHERE?', p:['at the river','On Sunday','Avi'], a:0, look:'a place', how:'Is it a person, a place or a time?'},
```
**A4 (should):** a tempting distractor (an opening part that tells WHERE):
```js
{type:'evidence', skill:'READ.COMP.L03.05', q:'Which sentence tells WHEN?', p:['Before Shabbos, the boys swept the shul.','In the shul, the boys swept the floor.','The boys swept the shul.'], a:0, look:'a time', how:'Find the words that tell a time.'},
```
**A6 (should, drawn once n:10):** a WHY sentence as the trap:
```js
{type:'evidence', skill:'READ.COMP.L03.06', q:'Which sentence tells HOW Naftali fixed the bike?', p:['First he tightened the chain, then he pumped the tire.','He fixed it because he wanted to ride to shul.','The bike was red.'], a:0, look:'the steps', how:'HOW tells the steps. WHY tells the reason.'},
```
**A7 (must):** no story, and trivial distractors. Replacement (the story is given; traps: out of order, and no end):
```js
{type:'evidence', skill:'READ.LIT.L03.01', q:'Story: Moshe lost his hat. He looked in his room and in the yard. At last his brother found it in the car. Which retell is best?', p:['Moshe lost his hat. He looked all over. His brother found it in the car.','His brother found the hat in the car. Moshe lost his hat. He looked all over.','Moshe lost his hat. He looked in his room.'], a:0, look:'beginning, middle and end, in order', how:'Does it tell the start, the middle and the end, in order?'},
```
**A8 (must, drawn once n:10):** trivial distractors. Traps: a retell with no lesson, and a retell with a wrong lesson:
```js
{type:'evidence', skill:'READ.LIT.L03.01', q:'Story: Moshe teased the new boy. Then he saw him sitting alone. Moshe said sorry and played with him. Which retell has the parts AND the lesson?', p:['Moshe teased the new boy, saw him alone, and said sorry. The lesson: be kind to new friends.','Moshe teased the new boy, saw him alone, and said sorry.','Moshe played with the new boy. The lesson: always play ball.'], a:0, look:'all the parts, in order, and the lesson', how:'Count the parts: beginning, middle, end, lesson.'}
```

Lesson check questions:
- **B.READ.COMP.L02.01.3 (URGENT; `packs/ReadMore.html:495`, update its `TL_PACKS` line).** Two right orders. → `{t:'order', q:'Read the page. Where is a snail\'s shell? Build the answer from the page.', pic:PG.snail, tiles:['on','its','back'], h:'Find the word "shell."'}`
- **B.READ.COMP.L03.04.1** (should, the teach item word for word; `src/CoreDataC231.html`) → q: `Dovid is in the middle of a story. Should he ask questions now?` o: `['Yes, readers ask questions while they read.','No, only after the story ends.','No, questions stop the reading.']`
- **B.READ.COMP.L03.04.3** (should, the same choices as the teach item) → q: `Before reading "Snow Day", Dovid asked, "Will school close?" Then he read: "The phone rang. Rabbi Feld said, 'No school today!'" What is the answer?` o: `['Yes, school is closed.','No, school is open.','The story does not say.']`
- **B.READ.COMP.L03.06.1** (should; it asks a fact about the method instead of the answer) → q: `"Avi brought an umbrella because the sky was dark." Why did Avi bring an umbrella?` o: `['the sky was dark','Avi brought an umbrella','it was Sunday']`
- **B.READ.COMP.L03.06.2** (should, the teach item's frame and choices) → q: `Which sentence tells HOW Naftali made the challah?` o: `['First he mixed the dough, then he shaped it.','He made it because it was Erev Shabbos.','The challah was big.']`
- **B.READ.COMP.L03.06.3** (should, the teach item's choices word for word) → q: `"The dog barked because a cat was on the fence." Why did the dog bark?` o: `['A cat was on the fence.','The dog was hungry.','It was dark out.']`
- Change the How boxes of the lesson checks above to fit the new questions.

**Verdict C23.U21: FAIL** (point 8 at 2, with 2 URGENT items; points 3, 4, 5 and 7 at 3).

---

## Summary
| Unit | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | Result | Fixes (must / should) |
|---|---|---|---|---|---|---|---|---|---|---|---|
| C68.U86 | 4 | 4 | 3 | 3 | 3 | 3 | **2** | 3 | 4 | **FAIL** | 10 own (incl. 1 new) + 8 lesson checks, n:12 |
| C68.U88 | 4 | 4 | 3 | 3 | **2** | **2** | **2** | 3 | 4 | **FAIL** | 10 own + 3 review checks + 10 lesson checks, n:12 |
| C23.U21 | 4 | 4 | 3 | 3 | 3 | 4 | 3 | **2** | 5 | **FAIL** | 8 own + 6 lesson checks, n:10; **2 URGENT** |

**URGENT (a right answer marked wrong):** C23.U21 **A5** ("where" fits the gap) and **B.READ.COMP.L02.01.3** ("plants and leaves").

**Engine note for the coordinator:** the pre-check and the boss level draw the same first own item for each skill (`CoreUnits.html` `per()` is used in both modes). Have the pre-check take the last own item, or a lesson check question.
