# Fresh review: unit checks C68.U77, C68.U78, C68.U85 (boss levels)

Reviewer: independent (wrote none of this). Read: CLAUDE.md (Teaching standard, Quality guardrails), docs/core-growth/REVIEWS.md, docs/core-growth/C68-map.md (7.7, 7.8, 8.5, cast note), the three packets, src/CoreDataC68H1.html, src/CoreDataC68H2.html, src/CoreUnits.html, src/CoreKitActs.html (evidence/cloze), packs/HowToDo3.html (READ.LIT.L09.01 checks).

How I checked what a boy meets. I checked this against `build()` in CoreUnits.html:
- **U77:** n=10, 4 skills x 2 own items. The boy gets 4 own items, then 2 review checks, then the 4 other own items. He sees all 8 own items and 2 review questions.
- **U78:** n=10. The boy gets 4 own items, then 3 review checks, then 3 more own items. He sees 7 of the 8 own items and 3 review questions.
- **U85:** n=12, 5 skills x 2 own items. The boy gets 5 own items, then 2 review checks, then 5 more own items. He sees all 10 own items and 2 review questions.
- **Engine details:** no 2-choice items anywhere. Evidence options keep their written order, and the keys sit at different positions. Cloze options are shuffled (shufNot). The boss level shows no How box.
- **Passages:** the READ.LIT.L09.01 pre-check questions ("Exhibit/Hike/Library passage, on your own") do have their passage. It is in the `p` field in packs/HowToDo3.html, which the packet left out, and the engine shows `it.p`.

Every key below was checked by hand.

**URGENT: none.** I found no right answer that would be marked wrong.

---

## C68.U77 "Two Authors, One Bay" (Grade 7): PASS

| # | Point | Score | Evidence (quoted for every score under 5) |
|---|---|---|---|
| 1 | Goal | 5 | Each item tests its skill: shaping the same facts (A1, A5), agree/disagree (A2, A6), putting sources together (A3, A7), chart plus article (A4, A8). |
| 2 | Teaching | 5 | The lessons taught each move that is asked. Examples: L08.18 teach "The chart shows how much; the text explains why", and L08.17 teach "it names each source". |
| 3 | Progression | 4 | Two items per skill plus 2 review questions. There is no ramp, though: most items have the same weight. A6 ("They agree the farms clean the water; they disagree about allowing more") is much easier than A4 or A8. |
| 4 | Thinking steps and a hard case | 5 | A4: the trend is "dipped in 2020, then grew two years running" and the trap is "proves". A8: the chart counts "crabs caught, not crabs living". |
| 5 | Mistake work | 4 | Most wrong options are real misreadings ("disagree about the facts", "anywhere they set pots", "the new rules killed many crabs"). Keys are not the longest; lengths are close (e.g. 97/91/91). Two options are straw men: A1 "so Text 2 adds nothing to the news" and A6 "They agree on everything". |
| 6 | Variety and age fit | 4 | The content is clearly Grade 7 (two sources, chart plus article, causes). But 9 of 10 questions are "tap 1 of 3" (7 evidence, 2 review choose-one) and 1 is a cloze. |
| 7 | Taught then asked, cold | 4 | Every own item is new text (Back Creek, Mr. Dahan, Mill Point do not appear in any lesson). No 2-choice. A4 copies the pattern of lesson check B18.3, the dam item ("The chart shows the river rose less after 2015; the article gives a reason"), which the pre-check can ask. A6 reuses the lesson's View A/View B oyster frame ("both say oysters clean water"). |
| 8 | Correct and clear | 4 | All keys are correct. The grass figures 67/62/68/76 match the real Bay underwater-grass survey for 2019–2022. One soft spot is review question B.L08.14.3, which can appear here: "In three towns, night bike crashes fell by half" is keyed "relevant and enough". The lesson teaches "more than one case", so it is defensible, but a careful boy could say three towns is "not enough". |
| 9 | Warm | 4 | Modest and clean, with mixed names (Dahan). There is little frum life in the boss items themselves: A5 "My boys can no longer row to the island" is the only family touch. The topic is the crab and oyster industry (treif seafood), handled as environment and jobs, with no eating. That is acceptable under the map's kosher note. |

**Keys, U77**

| Item | Key | Correct? | Note |
|---|---|---|---|
| A1 | b, "Text 1 leads with the gain and its cause; Text 2 grants the gain, then turns to the rivers." | yes | Text 2 says "Sure, there is more grass" |
| A2 | "agree it grew but explain it two ways" | yes | cleaner water vs cool summer |
| A3 | c, "...So: more hiding places." | yes | only option that uses both sources |
| A4 | a, "dipped in 2020, then grew two years running; the article gives one reason" | yes | 62 to 68 to 76; b "every year" is false; c "proves" overclaims |
| A5 | c, gain for the town / loss for his family | yes | both say forty |
| A6 | a, agree clean water / disagree about more | yes | |
| A7 | b, two causes, each named | yes | c misreads: the rules did not kill crabs |
| A8 | b, "counts crabs caught, not crabs living" | yes | c is false: 370 < 410 |
| B L08.01.1/.2/.3 | longer day / plain facts vs feelings / 9 boys hurt | yes | |
| B L08.16.1/.2/.3 | agree / disagree / same fact read two ways | yes | |
| B L08.17.1/.2/.3 | each adds a piece / a piece from each text / joins and names | yes | .3's key is the longest by far (pre-check only) |
| B L08.18.1/.2/.3 | fall, then small rise / not counted / chart shows, article gives reason | yes | 60, 42, 30, 34 |
| Review L08.12.1/.2/.3 | counterclaim / his reply to the other side / the reason | yes | |
| Review L08.14.1/.2/.3 | not relevant / not enough / relevant and enough | yes | see point 8 |

**Optional fixes (nothing is under 4)**
- A1, option c: replace with `Text 1 is only an opinion and Text 2 is only a fact, so Text 2 is the one to trust.`
- A6, option c: replace with `They agree more farms should be allowed; they disagree about whether the farms block the creeks.`
- B L08.14.3: make it unarguable with `Evidence: "In three towns and in a state study of 2,000 riders, night bike crashes fell by half once riders used lights."`
- Variety: swap one A-item for a kit `sort` item (for example "Chart shows / Article tells" with four cards from the A4 data). The engine already accepts any non-Reader kit kind.

---

## C68.U78 "The Whole Story" (Grade 7): PASS

| # | Point | Score | Evidence |
|---|---|---|---|
| 1 | Goal | 5 | The items cover reading coach 2 (A1 sum-up, A5 a question to pull you through), story links (A2, A6), suspense (A3, A7) and theme with three proofs (A4, A8). |
| 2 | Teaching | 5 | Taught in the lessons: "sum it up in one sentence", the three links, the three suspense tools, and "beginning, middle and end" proofs. |
| 3 | Progression | 4 | The map calls this check "(the whole year so far)", but only 3 review questions come from earlier units (L08.10, L08.18, L08.12). It is a fair year-review, but a thin one. |
| 4 | Thinking steps and a hard case | 4 | There are good hard cases. A2: the storm (setting) makes the danger, but "The Levys are safe because ___" needs "a choice changed the plot". A3 asks him to tell apart three suspense tools. The rest are one-step labels: A6 "What link is this?" and A7. |
| 5 | Mistake work | 4 | Strong traps: A1 a (only the middle of the page), A4 b ("Ch. 8 ... Ch. 8 ... Ch. 8"), A8 c (a rule, not a theme). Weak options: A5 c "Why are bridges built over creeks and rivers?" and A7 c "to slow the story down with a quiet, calm moment". |
| 6 | Variety and age fit | 4 | All items are "tap 1 of 3" (6 evidence, 1 cloze, 3 review choose-one). Age fit is fine, but A6 and A7 read at about Grade 5 level. |
| 7 | Taught then asked, cold | 4 | Every own item is new text (Katz, Levys, Dov, Ezra, the fire hall). Two close copies: A6 "At the start, Ezra laughs at the old mill. After the flood, he ... rebuild[s] it" has the same frame as lesson check B L08.10.3, "At the start Ari laughs at the new boy... Ari defends him", which the pre-check can ask. A7's key "to make the reader turn the page" echoes the teach line "so you must turn the page". |
| 8 | Correct and clear | 4 | All keys are correct, with no second defensible answer. Two small clarity points. The spelling mixes "sefarim" (A1) with "Seforim" (review B18.1). A6's "Ezra" is also Shuey's friend in the lesson's clock story, a different boy with the same name. |
| 9 | Warm | 5 | Warm and modest: saving the sefarim from the flood, rebuilding every Sunday, the Levys' baby, Saba and the rowboat. Nothing breaks Shabbos rules, and there is no Divine Name. |

**Keys, U78**

| Item | Key | Correct? | Note |
|---|---|---|---|
| A1 | b, "The creek flooded the road, and Mr. Katz saved the car and the sefarim just in time." | yes | covers start, middle and end |
| A2 | "a choice changed the plot" | yes | "setting shaped the problem" is true of the danger, not of the safety |
| A3 | c, "...someone calling for help from the roof next door." | yes | a is a deadline; b is a question held back |
| A4 | a, ch. 1 / 4 / 8 proofs about acting while afraid | yes | b is all ch. 8; c is plot, not theme |
| A5 | b, "Will the Levys get across before the bridge falls?" | yes | a is already answered |
| A6 | a, "the plot changes the character" | yes | |
| A7 | b, "to make the reader turn the page to find out" | yes | |
| A8 | b, "Losing a house does not mean losing a home." | yes | |
| B L08.19.1/.2/.3 | reread / an open question / sum it up in one sentence | yes | |
| B L08.10.1/.2/.3 | setting / choice / plot changes the character | yes | |
| B L08.11.1/.2/.3 | deadline / held back / cliffhanger | yes | |
| B L08.12.1/.2/.3 | helping others / ch. 2, 5, 9 proofs / a theme | yes | |
| Review L08.10.1/.2/.3 | the other view / the turn to his view / he respects the other view | yes | |
| Review L08.18.1/.2/.3 | as in U77 | yes | |
| Review L08.12.1/.2/.3 | as in U77 | yes | |

**Optional fixes (nothing is under 4)**
- A6: make it colder than the lesson check. New stem: `When the flood comes, Ezra, who used to call the old mill "a pile of junk", carries its ledgers to safety. A year later he leads the boys who rebuild it. What link is this?` Keep the same options and key.
- A5, option c: replace with `Why did the Levys drive across the bridge so late at night?`. Like the key, it is about the chapter, but it looks backward and the chapter may never answer it.
- A7, option c: replace with `to hold back the answer to a question asked on page 1`. That is the tempting "question held back" confusion.
- Spelling: use `seforim` in A1 (both places) to match the rest of the app.
- Year review: consider raising `review` to 3 skills from 3 different earlier units. It is 3 now; keep it, but pick L08.02 or L08.14 instead of L08.18, which U77 already reviewed through A4 and A8.

---

## C68.U85 "Point of View and Irony" (Grade 8): PASS

| # | Point | Score | Evidence |
|---|---|---|---|
| 1 | Goal | 5 | Each of the five skills gets two items that test exactly that skill: purpose and viewpoint, dramatic irony, concede and refute, the narrator who knows less, and Readers' Theatre delivery. |
| 2 | Teaching | 5 | The lessons taught each move: "ask: what do I know that this character does not?", concede and refute signals, the Watson narrator, "pause before the big reveal". |
| 3 | Progression | 5 | Two items per skill, from naming the device (A1, A2) to choosing the narrator who best hides the answer (A9) and reading a two-part stage direction (A10). Two review questions come from Grade 7 and earlier Grade 8 work. |
| 4 | Thinking steps and a hard case | 5 | Hard cases: A1 "Nobody, not even the reader, knows..." (tension without irony). A6 "A fact inside a text does not make its purpose 'inform'". A10 "(calmly, but too fast)". |
| 5 | Mistake work | 4 | The traps are real: A2 "refutes a point, then concedes it", A4 "the dots are only punctuation", A10 "calm and steady all the way". Weak spots: A6 c "to entertain with a story about trains" is a straw man. A8's key starts with the signal word "But" and the concession starts "It is true that", so a boy can answer from signal words alone. |
| 6 | Variety and age fit | 4 | Clearly Grade 8 (unreliable-narrator clues, concede and refute, two-part stage directions). Format: 11 of 12 are "tap 1 of 3" (9 evidence, 2 review choose-one) and 1 is a cloze. |
| 7 | Taught then asked, cold | 4 | Every own item is new text. One near-copy: A6 "museum flyer ... Book your family's visit today; the train ride sells out every Sunday!" repeats the pre-check question B L09.01.1, "You need to see this exhibit... tickets are almost gone!" (museum, sells out, persuade). |
| 8 | Correct and clear | 5 | All keys are correct and there is no second defensible answer. Facts are true: the B&O, 1830, the first passenger trains, the Air and Space Museum in Washington. |
| 9 | Warm | 5 | The Beacon cast (Benny, Yoni, Akiva, Eli), "grandparents read the Beacon at the Shabbos table, where no one reads a screen" (Shabbos-correct), Zeidy home from Eretz Yisrael, the gabbai's son and the shul key. Mixed names. |

**Keys, U85**

| Item | Key | Correct? | Note |
|---|---|---|---|
| A1 | b, "We saw the letter slip behind the desk..." | yes | a is a mystery for everyone; c is the resolution |
| A2 | "concedes a point, then refutes it" | yes | "does cost money; that much is true. Still..." |
| A3 | c, chalk dust / "I thought nothing of it." | yes | |
| A4 | a, pause before "was the one who reported it missing" | yes | the ellipsis sits just before the reveal |
| A5 | c, "...ending ninety years of free reading" | yes | slanted; b says the books move to a new branch |
| A6 | a, persuade, with history as the hook | yes | "Book your family's visit today" |
| A7 | b, warm, funny tension | yes | the reader knows it is Zeidy |
| A8 | b, "But many grandparents read the Beacon at the Shabbos table..." | yes | a concedes; c repeats the other side |
| A9 | a, the gabbai's young son | yes | |
| A10 | c, calm words with a rushed pace | yes | |
| B L09.01.1/.2/.3 | persuade / first person / should be saved | yes | the passages are in `p` (packs/HowToDo3.html) and are shown |
| B L09.09.1/.2/.3 | dramatic irony / tension / the audience | yes | |
| B L09.14.1/.2/.3 | conceding / refuting / a counterclaim | yes | in .1, sentence 2 is "It is true that time is short." |
| B L09.10.1/.2/.3 | knows less / stays hidden longer / misses a clue | yes | |
| B FLU.L09.02.1/.2/.3 | slow, with doubt / pause / Akiva's line | yes | the wrong options in .1 and .2 are weak ("loud and silly", "skip the line"); pre-check only |
| Review L08.11.1/.2/.3 | deadline / held back / cliffhanger | yes | |
| Review VOC.L09.01.1/.2 | sofer / crept | yes | "feather" is a good trap |

**Optional fixes (nothing is under 4)**
- A6: move it away from the pre-check exhibit question. New stem: `A railroad museum's newsletter: "In 1830 the B&O ran America's first passenger trains. Members who renew by Sunday ride the 1830 rails free, and the free rides always run out." What is the newsletter's main purpose?` New option c: `to inform, because most of it is dates and history`. Keep a as the key.
- A8: take away the signal-word giveaway. Option a becomes `But it is true that paper costs more every year, and printing takes the boys a whole day.` Option b becomes `Many grandparents read the Beacon at the Shabbos table, where no one reads a screen.` Keep the key at index 1.
- Pre-check B FLU.L09.02.1: replace "loud and silly" with `quick and sharp, like an order`. The lesson's own teach line for (sharply) is "quick and hard", so this is a real confusion.

---

## Summary

| Unit | p1 | p2 | p3 | p4 | p5 | p6 | p7 | p8 | p9 | Keys | URGENT | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| C68.U77 Two Authors, One Bay (Gr 7) | 5 | 5 | 4 | 5 | 4 | 4 | 4 | 4 | 4 | 8 own + 18 B checked, all right | none | **PASS** |
| C68.U78 The Whole Story (Gr 7) | 5 | 5 | 4 | 4 | 4 | 4 | 4 | 4 | 5 | 8 own + 21 B checked, all right | none | **PASS** |
| C68.U85 Point of View and Irony (Gr 8) | 5 | 5 | 5 | 5 | 4 | 4 | 4 | 5 | 5 | 10 own + 20 B checked, all right | none | **PASS** |

The same notes apply to all three. Every boss question is "tap 1 of 3", and one or two own items in each unit copy the frame of a lesson check question that the pre-check can ask. Neither drops a score below 4. The optional fixes above would raise points 5–7.
