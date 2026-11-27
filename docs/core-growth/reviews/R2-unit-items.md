# Unit checks F.U21–F.U26 and W13.U21/31/34/35/36: own boss-level items, fresh review (2026-11-27)

Follow-up to Review Round 2 (B1a). A fresh reviewer who wrote none of the items scored each unit on the 9 points, checking every own item (one right answer, cold, taught, How never gives the answer, fair). 19 items were fixed after the first pass; the re-score is at the bottom. **Final: 11 of 11 units pass, URGENT 0.**


What was checked: every own item in all 11 units, in the final `items` list in `src/` (new items, the 6 changed W13.U31 wrong choices, and the older items the boss level still draws). Each item was checked for a second defensible answer, cold vs the lessons' checks and do/your, taught, How line, fair lengths, grade fit and warmth. `pre:'lessons'` is on all 11 units, and in `build()` the boss draws own items first, so every item below reaches a boy.

Item numbers (`#n`) are the 0-based index in that unit's final `items` array.

| ID | Name | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | Fun | Grade level | Result |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `F.U21` | Syllables and Long Vowels | 5 | 4 | 5 | 4 | 4 | 4 | 5 | 5 | 4 | 3 | ok | ✓ pass |
| `F.U22` | Vowel Teams 2 | 5 | 4 | 5 | 4 | 4 | 4 | 3 | 4 | 4 | 3 | ok | **✗ fix** |
| `F.U23` | Bossy R and Tricky Endings | 5 | 4 | 5 | 4 | 4 | 4 | 3 | 4 | 5 | 3 | ok | **✗ fix** |
| `F.U24` | Soft Letters and Quiet Letters | 5 | 4 | 5 | 4 | 4 | 4 | 4 | 4 | 4 | 3 | ok | ✓ pass |
| `F.U25` | Endings That Change the Word | 5 | 4 | 5 | 4 | 5 | 4 | 4 | 5 | 5 | 3 | ok | ✓ pass |
| `F.U26` | Poems, Plays and Spelling | 5 | 4 | 5 | 4 | 4 | 4 | 4 | 4 | 5 | 4 | ok | ✓ pass |
| `W13.U21` | Writers Plan | 5 | 5 | 5 | 4 | 4 | 4 | 4 | 5 | 5 | 3 | ok | ✓ pass |
| `W13.U31` | Paragraph Builder | 5 | 5 | 5 | 4 | 4 | 4 | 4 | 4 | 5 | 4 | ok | ✓ pass |
| `W13.U34` | Explain It | 5 | 5 | 5 | 4 | 4 | 4 | 3 | 4 | 5 | 4 | ok | **✗ fix** |
| `W13.U35` | Little Researcher | 5 | 5 | 5 | 4 | 4 | 4 | 3 | 4 | 5 | 4 | ok | **✗ fix** |
| `W13.U36` | Revise, Edit, Publish | 5 | 5 | 5 | 4 | 4 | 4 | 3 | 4 | 5 | 4 | ok | **✗ fix** |

The fixes for the passing units (F.U24, F.U25, W13.U21) are recommended, not blocking.

### `F.U22` Vowel Teams 2 — FIX
- **p7, How points to the answer.** #0 READ.LV.L03.01 "Yitzy put on his ___ to walk in the snow." (boots / bats / bottles). How: "Which word has oo, like moon, and makes sense?" Only "boots" has oo, so the boy can spot it without reading.
  **Fix:** `"how":"Read each word slowly. Which one makes sense here?"`
- **p7, How gives the answer.** #7 READ.LV.L03.04 "Read \"threw\". The ew says ___." How: "Think of the blue moon team. What sound do they make?" "Moon" is the answer sound (oo, like zoo).
  **Fix:** `"how":"Find the two vowel letters. Which team rule fits them?"`
- **p7, not cold.** #11 READ.FLU.L03.02 "Read: \"Tzvi swept the floor / in the kitchen.\" The scoop \"in the kitchen\" tells ___." The lesson's own match activity has the pair "in the kitchen" → "where", word for word.
  **Fix:** `"t":"Read: \"Tzvi swept the floor / by the back door.\" The scoop \"by the back door\" tells ___."` (keep o and a)

### `F.U23` Bossy R and Tricky Endings — FIX
- **p7, How points to the answer.** #0 READ.PHON.L03.02 "We stayed inside during the ___." (storm / stamps / stop). How: "Look for a vowel with r after it." Only "storm" has one. The wrong choices also skip Bossy R, so the item tests meaning, not the skill.
  **Fix:** `"o":["star","storm","stork"],"a":"storm"` (every choice has Bossy R; keep the How)
- **p7, How points to the answer.** #3 READ.LV.L03.06 "Pesach comes once a ___." (yard / yellow / year). How: "Ear can say air or eer. Try eer first." Only "year" has ear.
  **Fix:** `"o":["pear","yarn","year"],"a":"year"` (pear also has ear, so the rule now has to be used; keep the How)

### `F.U24` Soft Letters and Quiet Letters — recommended
- **p7, How points to the answer.** #8 READ.PHON.L03.03 "Bubby cut a ___ of kugel for each of us." (slice / slipper / slim). How: "Check what c says before e." Only "slice" has a c.
  **Fix:** `"o":["since","slick","slice"],"a":"slice"`
- **p6, a weak choice makes it a 2-way guess.** #1 READ.PHON.L03.09 "Read: \"Bubby got a nice coat.\"" with choices coat / nice / Bubby. "Bubby" has no c.
  **Fix:** `"t":"Read: \"Bubby made a nice cup of cocoa.\" The word with a c that says sss is ___.","o":["cocoa","nice","cup"],"a":"nice"`
- **p6, a weak choice makes it a 2-way guess.** #9 READ.PHON.L03.03 "Read: \"Yisroel drew a knight on his kite.\"" with choices Yisroel / knight / kite. "Yisroel" has no k.
  **Fix:** `"t":"Read: \"Kalman drew a knight on his kite.\" The word with a quiet k is ___.","o":["Kalman","knight","kite"],"a":"knight"`

### `F.U25` Endings That Change the Word — recommended
- **p7, copies a do activity.** #11 READ.FLU.L03.04 "He reads at a ___ speed." (steady / snail / racing). The lesson's do cloze is "Read at ___ speed" with the same wrong choices, racing and snail.
  **Fix:** `{"skill":"READ.FLU.L03.04","type":"cloze","t":"Akiva knows this line well. It is smooth and easy. He should read it ___.","o":["one word at a time","like talking","as fast as he can"],"a":"like talking","say":"How should Akiva read it?","how":"Think of riding a bike on a smooth road."}`

### `W13.U21` Writers Plan — recommended
- **p7, How points to the answer.** #9 WRIT.SENT.L03.01 "Our class sang ___ at the Chanukah party." (happy / doughnuts / happily). How: "A how word often ends in -ly." Only "happily" ends in -ly.
  **Fix:** `"how":"Ask: how did they sing? Try each word in the blank."`

### `W13.U31` Paragraph Builder — pass
- The new items and the 6 changed wrong choices are sound. Each has one right answer, and none of the 10 right answers is now the longest choice.
- Optional, not scored: #5 has "Crack! The ice on the pond broke." followed by "The club went skating on the big pond on Sunday." Skating after the ice broke is an odd and unsafe picture. Optional change: `"Swish! Our skates zipped across the ice."` (still the only hook, and still not the longest choice).

### `W13.U34` Explain It — FIX
- **p7, not cold.** #8 WRIT.PARA.L04.15 "Mr. Benhamou’s scale has a dial. ___ it has a metal plate." with answer "Also,". The lesson check "A bike has two wheels. ___ it has a chain." has the same answer, "Also,", and another lesson check uses the same scale, dial and metal plate.
  **Fix:** `{"skill":"WRIT.PARA.L04.15","type":"evidence","q":"Yaakov wrote about his scooter. Which sentence uses but the right way?","p":["It has wheels, but it has a board.","It is small, but it is strong.","It is new, but it is not old."],"a":1,"look":"a but before something truly different","say":"Tap the sentence that uses but right.","how":"But shows something different. Does the second part really change?"}`
- **p7, How gives the answer.** #3 WRIT.PARA.L04.15 "One ___ part is the handlebar." (but / also / more). How: "Which one adds one more part?" The How says the answer word.
  **Fix:** `"how":"Read it with each word. Which one sounds right?"`
- **p8, fairness.** #9 WRIT.PARA.L04.16, the kettle item. The right answer, "So every whistle means the water is ready for tea." (50 letters), is by far the longest choice.
  **Fix:** `"p":["Also, some kettles are made of shiny metal.","The end.","So a whistle means the water is ready.","A kettle boils water."],"a":2`

### `W13.U35` Little Researcher — FIX
The boss uses all 8 own items, so each of these reaches every boy.
- **p7, not cold.** #1 WRIT.RES.L04.01 "Avi asked: “Which pet is the best?” That question is only an ___." with answer "opinion". The lesson check "Which fruit is the yummiest? … It is only an opinion." is the same question with the same answer.
  **Fix:** `{"skill":"WRIT.RES.L04.01","type":"cloze","t":"Yonah wants to learn “all about the sea.” For one report, that is much too ___.","o":["small","big","short"],"a":"big","say":"What is wrong with Yonah’s plan?","how":"Could one short article answer all of it?"}`
- **p7, not cold.** #4 WRIT.RES.L04.03, robins: headings “Homes” and “Food”, with answer "Food". The lesson check about squirrels uses the headings “Food” and “Nest” and has the same answer, "Food".
  **Fix:** `{"skill":"WRIT.RES.L04.03","type":"cloze","t":"Rafael’s question: “How do bees make honey?” His headings are “Flowers” and “The hive”. The note “sip sweet juice from roses” goes under ___.","o":["The hive","Flowers","the title"],"a":"Flowers","say":"Where does the note go?","how":"Read the note. Which heading does it tell about?"}`
- **p7, the answer repeats the question's word.** #5 WRIT.RES.L04.03 "Which note goes under “Carrying”?" The answer, "carry crumbs in their jaws", is the only choice with the heading's word. It is also the longest choice.
  **Fix:** `"p":["tunnels go deep","bring crumbs home in their jaws","ants are tiny","I saw ants at the park on Sunday"],"a":1`
- **p7, not cold.** #7 WRIT.RES.L04.04 "Chaim’s report ends: I found my facts in “Busy Bees”. He forgot the ___." with answer "author". The lesson check "I found my facts in “Snow and Ice”. What is missing? → the author" is the same question with the same answer.
  **Fix:** `{"skill":"WRIT.RES.L04.04","type":"cloze","t":"Chaim’s report ends: I found my facts in a book by Mrs. Rivka Stern. He forgot the ___.","o":["author","title","date"],"a":"title","say":"What did Chaim forget?","how":"A source line names two things. Which one is not there?"}`
- Note, not blocking: in #6 ("Life in the Desert") the right answer is 9 times as long as "by". It is the longest choice only by 2 letters, so it is left as it is.

### `W13.U36` Revise, Edit, Publish — FIX
- **p7, not cold.** #3 WRIT.ESSAY.L04.06 "Naftali wrote: “Cleaned we the clubhouse.” COPS letter ___ finds the mistake." with answer O. The lesson check "Avi wrote: “Swept we the sukkah floor.” Which COPS letter finds the mistake? → O" is the same question with the same answer.
  **Fix:** `{"skill":"WRIT.ESSAY.L04.06","type":"cloze","t":"Naftali wrote: “We cleaned the clubhowse.” COPS letter ___ finds the mistake.","o":["O","C","S"],"a":"S","say":"Which COPS letter finds it?","how":"Check C, then O, then P, then S. Where does it go wrong?"}`
- **p7, not cold.** #4 WRIT.PARA.L04.17 "Dovid writes to thank Mr. Levi, the school cook, for a hot lunch." The lesson check uses the same setup ("Avi writes to thank Mr. Levi, the school cook…"), and its answer "Dear Mr. Levi," is one of this item's wrong choices.
  **Fix:** `{"skill":"WRIT.PARA.L04.17","type":"evidence","q":"Yosef writes to thank Mr. Peretz, his neighbor, for a ride to school. Which closing fits?","p":["See ya!","With thanks,","Bye bye!!!","Dear Mr. Peretz,"],"a":1,"look":"a polite goodbye before his name","say":"Find the closing that fits.","how":"Who is reading it? Which part says goodbye?"}`

## Across the batch
- **How lines that point to the answer** (F.U22 #0, F.U23 #0 and #3, F.U24 #8, W13.U21 #9). The How names a letter pattern that only the right choice has. Either give every choice the pattern, or make the How "read each word, which makes sense".
- **The older W13 items are not cold** (W13.U34 #8, W13.U35 #1, #4 and #7, W13.U36 #3 and #4). They were written in the same frames as the lesson checks and have the same answers. Before `pre:'lessons'` this was hidden. Now the boy answers the lesson check in the pre-check and meets its twin in the boss level.
- **Every new item is sound:** one right answer, no right answer too long in any unit, say ≤ 12 words, How ≤ 15 words, warm, kosher, and a wide mix of names. No boy is marked wrong for a right answer.
- **Not caused by this change:** with `pre:'lessons'`, the F.U21–F.U24 test-out uses the lessons' checks, and many of them have 2 choices (PHON.L03.04, .05, .06, .07, .08, .09, .10). A boy can guess his way past those lessons. This was already true before the change, because those units had no items. The `CoreUnits.html` comment says pre:'lessons' units have "3+ choices", which is not true for these units.
- The older F.U26 items and the older W13 items have no `say`, so the kit's default spoken line is used. This is a small thing.

URGENT: 0

## Re-score after fixes

What was checked: `fixes-diff.patch` changes exactly the 19 flagged items and nothing else. I re-checked each new item for one right answer (every wrong choice tried), cold against the lesson checks and do/your, taught, a How line that never gives the answer, and fair lengths. I also re-ran the length check on the source in `src/`: no unit has the right answer as the longest choice in more than 1 of 3 items.

| ID | Name | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | Fun | Grade level | Result |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `F.U21` | Syllables and Long Vowels | 5 | 4 | 5 | 4 | 4 | 4 | 5 | 5 | 4 | 3 | ok | ✓ pass |
| `F.U22` | Vowel Teams 2 | 5 | 4 | 5 | 4 | 4 | 4 | 4 | 5 | 4 | 3 | ok | ✓ pass |
| `F.U23` | Bossy R and Tricky Endings | 5 | 4 | 5 | 4 | 4 | 4 | 4 | 5 | 5 | 3 | ok | ✓ pass |
| `F.U24` | Soft Letters and Quiet Letters | 5 | 4 | 5 | 4 | 4 | 5 | 5 | 5 | 4 | 3 | ok | ✓ pass |
| `F.U25` | Endings That Change the Word | 5 | 4 | 5 | 4 | 5 | 4 | 5 | 5 | 5 | 3 | ok | ✓ pass |
| `F.U26` | Poems, Plays and Spelling | 5 | 4 | 5 | 4 | 4 | 4 | 4 | 4 | 5 | 4 | ok | ✓ pass |
| `W13.U21` | Writers Plan | 5 | 5 | 5 | 4 | 4 | 4 | 5 | 5 | 5 | 3 | ok | ✓ pass |
| `W13.U31` | Paragraph Builder | 5 | 5 | 5 | 4 | 4 | 4 | 4 | 4 | 5 | 4 | ok | ✓ pass |
| `W13.U34` | Explain It | 5 | 5 | 5 | 4 | 4 | 4 | 4 | 5 | 5 | 4 | ok | ✓ pass |
| `W13.U35` | Little Researcher | 5 | 5 | 5 | 4 | 4 | 4 | 4 | 4 | 5 | 4 | ok | ✓ pass |
| `W13.U36` | Revise, Edit, Publish | 5 | 5 | 5 | 4 | 4 | 4 | 4 | 4 | 5 | 4 | ok | ✓ pass |

**How each replaced item checked out:**
- **One right answer.** All 19 have one. For example: bowls / boots / clowns (only boots can be worn in snow); stork / storm / scarf; yarn / year / pear; since / slick / slice; little / strong / tiny with "but" (only strong is different). In the kettle item, "A kettle is a pot for boiling water." is a definition, not a summing-up ending.
- **Cold.** None copies a lesson check or uses its answer word. In particular the W13.U34 "Also," twin, the W13.U35 opinion, Food and author twins, and the W13.U36 COPS O and Mr. Levi twins are all gone.
- **Taught.**
  - "too big" comes from the RES.L04.01 watch ("All about trees? Too big").
  - "readers can check" comes from the RES.L04.04 watch ("Now any reader can check the facts").
  - "but = something different" comes from the PARA.L04.15 watch.
  - "steady" comes from the FLU.L03.04 watch (the bike on a smooth road).
- **How lines.** No How names the answer or a pattern only the answer has. The Bossy R, ear and soft-c Hows now fit every choice.
- **Fair.** In every changed item the right answer is not the longest choice, or is tied for longest.

**Small notes (not blocking, no fix needed):**
- F.U22 #7, How "Blend the word and listen.": a boy who blends ew as "oh" gets "throw", a real word. The lesson's team rule still decides it, so it is fair.
- W13.U34 #8 ("small, but it is ___"): this tests what "but" means more than choosing the linking word. It is still taught and has one right answer.
- These were left from before and are within the limits: W13.U35 #6 and W13.U36 #1 and #5 (right answer longest, in at most 1 of 3 items per unit), and F.U26 #5.

Remaining problems: 0. URGENT: 0
