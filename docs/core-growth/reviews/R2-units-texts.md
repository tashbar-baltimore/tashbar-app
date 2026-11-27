# Review round 2 · unit checks (F, W13) and book texts (2026-11-26)

Written for gap B1a by the builder session https://claude.ai/code/session_018i8rBtzsMZ73AmXKN2L4G3, which wrote none of these lessons. Fresh reviewers (who also wrote none of them) scored each item on the HoS 9 points against its data and EVERY check question the engine can draw (30 builds). V checked every URGENT claim against the data and the code before listing it (see REVIEWS.md, Round 2). Points: 1 goal · 2 teaching · 3 progression · 4 thinking steps · 5 mistake work · 6 variety and age fit · 7 taught then asked · 8 correct and clear · 9 warm.


Fresh, independent reviewer. Method: every unit's real question pool was drawn from the engine (`TLCORE.units.questions(u,'check')` built 60 times per unit, plus each skill's full lesson-check pool, made-up TEST boy only), every key checked by hand, and the code path in `src/CoreUnits.html` (`fromSkill`, `build`) read. Every text file was read in full; the K books were checked word by word against the K path's taught letters and heart words (`src/CoreDataFH1.html` lines 207, 246, 283: heart words only the, a, I, is, my, go, no, so; no blends).

Points for a unit: 1 goal · 2 teaching (Practice routing, task scaffolds) · 3 progression (skill order, review) · 4 thinking steps · 5 mistake work · 6 variety and age fit (2-choice guessing, kinds) · 7 taught then asked, and cold (not the same question he already answered) · 8 correct and clear (keys, missing pictures, right answer not the longest in most items) · 9 warm.

## 1. Unit checks (boss levels)

| ID | Name | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | Fun | Grade level | Result |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `F.U21` | Syllables and Long Vowels | 5 | 4 | 5 | 4 | 4 | 3 | 3 | 3 | 4 | 3 | ok | **✗ fix** |
| `F.U22` | Vowel Teams 2 | 5 | 4 | 5 | 4 | 4 | 3 | 3 | 2 | 4 | 3 | ok | **✗ fix** |
| `F.U23` | Bossy R and Tricky Endings | 5 | 4 | 5 | 4 | 4 | 3 | 3 | 3 | 4 | 3 | ok | **✗ fix** |
| `F.U24` | Soft Letters and Quiet Letters | 5 | 4 | 5 | 4 | 4 | 3 | 3 | 2 | 4 | 3 | ok | **✗ fix** |
| `F.U25` | Endings That Change the Word | 5 | 4 | 5 | 4 | 5 | 4 | 3 | 4 | 4 | 3 | ok | **✗ fix** |
| `F.U26` | Poems, Plays and Spelling | 5 | 4 | 5 | 4 | 4 | 4 | 3 | 3 | 5 | 4 | ok | **✗ fix** |
| `W13.U21` | Writers Plan | 5 | 5 | 5 | 4 | 4 | 4 | 3 | 4 | 5 | 3 | ok | **✗ fix** |
| `W13.U31` | Paragraph Builder | 5 | 5 | 5 | 4 | 4 | 4 | 3 | 3 | 5 | 4 | ok | **✗ fix** |
| `W13.U34` | Explain It | 5 | 5 | 5 | 4 | 4 | 4 | 3 | 4 | 5 | 4 | ok | **✗ fix** |
| `W13.U35` | Little Researcher | 5 | 5 | 5 | 4 | 4 | 4 | 3 | 4 | 5 | 4 | ok | **✗ fix** |
| `W13.U36` | Revise, Edit, Publish | 5 | 5 | 5 | 4 | 4 | 4 | 3 | 4 | 5 | 4 | ok | **✗ fix** |

Writing Workshop pieces: all five are sound and above the 25-word minimum (W13.U21 min 30, U31 45, U34 60, U35 70, U36 50). Each has a named strategy, a plan, starters and checks that match the rubric. W13.U35's source article exists (`texts/W13/W13.LEAF.01.txt`, by Mr. Levi Adler, and it matches the task's title/author checks).

### Two code facts behind most of the fixes (checked in `src/CoreUnits.html`)
- **A. Checks are not cold.** `fromSkill` takes the lesson's own check questions. Every one of these lessons has exactly **3** check questions, and the lesson asks **all 3** every time (40 builds, always the same 3). So a unit with no `items` (F.U21–F.U25, W13.U21) gives a boss level made **only** of questions he already answered in the lessons. Units with `items` but no `pre:'lessons'` (F.U26, W13.U31, U34, U35, U36) use those same items in the **pre-check** (`per()` tries `ownOf` first), so the boss repeats the pre-check. F.U26 and W13.U34 have one item per skill: **the boss repeats every pre-check question exactly.**
- **B. Pictures disappear.** `fromSkill` keeps `pic` only when it has letters or digits, so the order questions "Build the word for the picture. Tap the tiles in order." show **no picture** in the unit check (only `5️⃣` survives, because of the digit). The order check marks right only the exact tile order.

### `F.U21` Syllables and Long Vowels — FIX
- **p7** — no `items`: all 10 questions are the lessons' own checks, word for word (e.g. "Snip it, on your own. Where do you snip "pencil"?", "Read "ca | mel" with a long a…"). See A.
  **Fix:** add `pre:'lessons'` and these items (add a 2nd per skill in the same pattern):
  `items:[{skill:'READ.PHON.L03.04',type:'cloze',t:'In "ti | ger", the first part "ti" is ___.',o:['open, long i','closed, short i','closed, long i'],a:'open, long i',how:'Does a consonant close the door after the vowel?'},{skill:'READ.PHON.L03.01',type:'cloze',t:'Snip "napkin": ___',o:['nap | kin','na | pkin','napk | in'],a:'nap | kin',how:'Find the two middle consonants. Snip between them.'},{skill:'READ.PHON.L03.05',type:'cloze',t:'"ro | bin" with a long o is not a word. Slide the line: ___',o:['rob | in','r | obin','robi | n'],a:'rob | in',how:'Try the vowel short. Where does the line go then?'},{skill:'READ.PHON.L03.06',type:'cloze',t:'In "pancake", the a in cake says ___.',o:['its name, like ape','short, like apple','nothing, it is quiet'],a:'its name, like ape',how:'Look at the part with the quiet e. What does e do?'},{skill:'READ.FLU.L03.01',type:'evidence',q:'Which line should sound like asking?',p:['"Is it ready yet?" asked Tzvi.','"Please pass the honey to Bubby."','"We did it!" cheered the boys.'],a:0,look:'the line with a question mark',how:'Look at the end mark of each line.'}]`
- **p6** — 9 of the 15 skill questions have only 2 choices (all of READ.PHON.L03.04, L03.05, L03.06: "Open…/Closed…", "Long…/Short…", "o / i"), so about 6 of 10 boss questions are coin flips against an 80% bar.
  **Fix:** the 3-choice items above; they are drawn first.
- **p8** — review READ.LV.L02.01 "Build the word for the picture" shows no picture (cake, home), and READ.PHON.L02.03 "Build the sentence for the picture" shows none. See B.
  **Fix:** in `fromSkill`, drop picture questions that lose their picture: `.filter(function (x) { return !(/for the picture/i.test(x.q) && !(x.pic && /[A-Za-z0-9]/.test(String(x.pic)))); })`, or swap the review to `review:['READ.PHON.L03.02']`-style skills without picture tiles.

### `F.U22` Vowel Teams 2 — FIX
- **URGENT p8** — READ.LV.L03.01 check "Build the word for the picture. Tap the tiles in order." tiles `s`,`p`,`oo`,`n`, keyed "s p oo n". In the unit check the 🥄 is not shown (B), so **s-n-oo-p = "snoop"**, a real word, is marked wrong.
  **Fix:** in READ.LV.L03.01's check, use `broom` (tiles `b`,`r`,`oo`,`m`, picture 🧹), which has no second word; and apply the B filter above.
- **p8** — READ.LV.L03.02 (all 3 checks: light, bunny, fly) and LV.L03.01 (mouth) are "Build the word for the picture" with no picture: a letter scramble, not a reading item.
  **Fix:** B filter, plus items below.
- **p7** — no `items`: every question is a lesson check he already answered (A).
  **Fix:** `pre:'lessons'`, `items:[{skill:'READ.LV.L03.01',type:'cloze',t:'Avi put on his ___ to walk in the snow.',o:['boots','bats','boats'],a:'boots',how:'Which word has oo, like moon, and makes sense?'},{skill:'READ.LV.L03.02',type:'cloze',t:'The stars are so ___ tonight.',o:['bright','bridge','brain'],a:'bright',how:'Which word makes sense? Check: igh says i.'},{skill:'READ.LV.L03.03',type:'cloze',t:'Moshe wrote on the board with ___.',o:['chalk','choke','check'],a:'chalk',how:'Which word has al saying aw, like ball?'},{skill:'READ.LV.L03.04',type:'cloze',t:'Yaakov fixed the torn page with ___.',o:['glue','glow','gull'],a:'glue',how:'Which word has ue saying oo?'},{skill:'READ.LV.L03.05',type:'cloze',t:'Good split for "railroad": ___',o:['rail | road','ra | ilroad','railr | oad'],a:'rail | road',how:'Keep each vowel team together.'},{skill:'READ.FLU.L03.02',type:'evidence',q:'Which one has good scoops?',p:['Shmuel read / a sefer after / Maariv.','Shmuel read a sefer / after Maariv.','Shmuel / read a / sefer after Maariv.'],a:1,look:'scoops that sound like talking',how:'Read each one out loud. Which sounds like talking?'}]`
- **p6** — review PHON.L03.04 and L03.05 plus LV.L03.05 and FLU.L03.02 bring 2-choice items ("good scoop / broken scoop", "Yes… / No…"). The items above are 3-choice and drawn first.

### `F.U23` Bossy R and Tricky Endings — FIX
- **p8** — READ.PHON.L03.02 "Build the word for the picture" (horn, cart) with no picture (B).
  **Fix:** B filter, and the item below.
- **p7** — no `items` (A).
  **Fix:** `pre:'lessons'`, `items:[{skill:'READ.PHON.L03.02',type:'cloze',t:'Yossi rode his bike to the ___ to play.',o:['park','pack','peak'],a:'park',how:'Which word has ar, the bossy r team?'},{skill:'READ.LV.L03.06',type:'cloze',t:'Please sit on the ___ by the window.',o:['chair','cheer','chain'],a:'chair',how:'Which word makes sense? Read air, like hair.'},{skill:'READ.PHON.L03.07',type:'cloze',t:'In "maple", the a says ___.',o:['its name','short, like apple','ar, like car'],a:'its name',how:'Cover -ple. Is the first part open or closed?'},{skill:'READ.PHON.L03.08',type:'cloze',t:'The bird sat on the window ___.',o:['ledge','lege','leadge'],a:'ledge',how:'Short vowel right before? Then use dge.'},{skill:'READ.FLU.L03.03',type:'cloze',t:'"Wait for me!" called Shmuel to Eli. The one talking is ___.',o:['Shmuel','Eli','both boys'],a:'Shmuel',how:'Find the word called. Who did the calling?'}]`
- **p6** — all of PHON.L03.07 and L03.08 and review PHON.L03.06 are 2-choice ("long… / short…", "ch / tch"): about half the boss is guessable. The items above are 3-choice.

### `F.U24` Soft Letters and Quiet Letters — FIX
- **URGENT p8** — READ.PHON.L03.03 check "Build the word for the picture." tiles `f`,`a`,`c`,`e`, keyed "f a c e". In the unit check the picture is not shown (B), so **c-a-f-e = "cafe"**, a real word, is marked wrong.
  **Fix:** in PHON.L03.03's check use `mice` (tiles `m`,`i`,`c`,`e`, picture 🐭), and apply the B filter.
- **p7** — no `items` (A).
  **Fix:** `pre:'lessons'`, `items:[{skill:'READ.PHON.L03.09',type:'cloze',t:'In "pencil", the c says ___.',o:['sss, like city','kuh, like cake','ch, like chin'],a:'sss, like city',how:'Look at the letter after c. Is it e, i or y?'},{skill:'READ.PHON.L03.10',type:'cloze',t:'In "giraffe", the g says ___.',o:['juh, like gem','guh, like goat','zh, like beige'],a:'juh, like gem',how:'Look at the letter after g. Is it e, i or y?'},{skill:'READ.PHON.L03.11',type:'cloze',t:'In "thumb", the quiet letter is ___.',o:['b','m','h'],a:'b',how:'Say it slowly. Which letter do you not hear?'},{skill:'READ.PHON.L03.12',type:'cloze',t:'Chaim saw a ___ swim by the boat.',o:['dolphin','dolfin','dollphin'],a:'dolphin',how:'In long words, which two letters often say fff?'},{skill:'READ.PHON.L03.03',type:'cloze',t:'Bubby put ___ in our cold drinks.',o:['ice','ise','eyes'],a:'ice',how:'Long i, then sss. Which letter says sss before e?'}]`
- **p6** — PHON.L03.09 and L03.10 (all 6 checks) and review PHON.L03.08 are 2-choice: about 6 of 10 coin flips. The items above are 3-choice.

### `F.U25` Endings That Change the Word — FIX
- **p7** — no `items` (A). Round 1 already found that the L03.13 to L03.15 check answers (hoped, shining, making…) are shown word for word inside the lessons, and the boss repeats them a third time.
  **Fix:** `pre:'lessons'`, `items:[{skill:'READ.PHON.L03.13',type:'cloze',t:'Shmuel is ___ his bike to shul.',o:['riding','rideing','ridding'],a:'riding',how:'Base word ends in a quiet e? What happens before -ing?'},{skill:'READ.PHON.L03.14',type:'cloze',t:'The frog ___ into the pond.',o:['hopped','hoped','hoppped'],a:'hopped',how:'Short vowel, one last consonant? Then what?'},{skill:'READ.PHON.L03.15',type:'cloze',t:'Moishe picked ten ___ from the tree.',o:['cherries','cherrys','cherryes'],a:'cherries',how:'Consonant before y? What happens to y before -es?'},{skill:'READ.PHON.L03.16',type:'cloze',t:'"Helpful" means ___.',o:['full of help','without help','help again'],a:'full of help',how:'Cover -ful. What does -ful add?'},{skill:'READ.PHON.L03.17',type:'cloze',t:'"Reread" means read ___.',o:['again','before','not'],a:'again',how:'Peel off re-. What does re- mean?'},{skill:'READ.FLU.L03.04',type:'cloze',t:'Tzvi reads so fast that he skips words. He should ___.',o:['slow down','read faster','stop reading'],a:'slow down',how:'What makes reading sound like talking?'}]`

### `F.U26` Poems, Plays and Spelling — FIX
- **p7** — one own item per skill and no `pre:'lessons'`: the pre-check shows exactly these 4 items (pennies, cue line, cold, grass of milk), and the boss shows them again. The 3 fill questions are lesson checks word for word (A).
  **Fix:** add `pre:'lessons'` (all four lessons' checks have 3 choices), and a 2nd item per skill, e.g. `{skill:'READ.PHON.L03.18',type:'cloze',t:'Avi ___ the ball to Eli.',o:['tossed','tosed','tost'],a:'tossed',how:'Base word plus -ed. Does anything change?'}`.
- **p8** — review READ.PHON.L03.02 draws "Build the word for the picture" (horn, cart) with no picture (B).
  **Fix:** B filter, or `review:['READ.LV.L03.05','READ.PHON.L03.05','READ.LV.L03.06']`.

### `W13.U21` Writers Plan — FIX
- **p7** — no `items`: all 8 questions are the 5 lessons' and 3 review lessons' own checks, word for word (A).
  **Fix:** `pre:'lessons'`, `items:[{skill:'WRIT.ESSAY.L03.01',type:'cloze',t:'Avi wrote notes, then wrote and said more. First, he had to ___.',o:['pick his idea','add a picture first','copy a friend'],a:'pick his idea',how:'Say POW. What does P stand for?'},{skill:'WRIT.PARA.L03.04',type:'evidence',q:'Details: Eli sets the table. Tzvi pours water. Abba makes Kiddush. Which is the best topic sentence?',p:['Eli sets the table with the new white plates.','Our family gets ready for Shabbos.','Is Shabbos fun?'],a:1,look:'the sentence that covers every detail',how:'Which one covers every detail?'},{skill:'WRIT.PARA.L03.05',type:'evidence',q:'Topic: Shmuel helps Bubby bake. Which detail should he cut?',p:['He cracks the eggs into the big bowl.','His bike is green.','He stirs the dough.'],a:1,look:'the detail that is not about the topic',how:'Which one is not about baking?'},{skill:'WRIT.PARA.L03.06',type:'evidence',q:'Topic: Our class loves recess. Which is the best closing?',p:['Our class loves recess.','That is why recess is the best part of our day.','The swings are red and the slide is tall and shiny.'],a:1,look:'the big idea in new words',how:'Not a copy, not a new detail.'},{skill:'WRIT.SENT.L03.01',type:'cloze',t:'Spice it up: The ___ dog barked loudly.',o:['fluffy','quickly','barked'],a:'fluffy',how:'You need a word that tells what kind of dog.'}]`
- Note (not scored down): the WRIT.PARA.L03.04 checks have no question ("…Topic sentence: "Yossi polishes the becher."" then the choices). Add "What is it?" at the end of each.

### `W13.U31` Paragraph Builder — FIX
- **p8** — in all 6 own items the right answer is the longest choice ("Did you ever hold a sefer that is 100 years old?", "Every boy asked to read twice.", "twelve bags of leaves", "Now the Levins feel welcome on our street.", "Zeidy is proud of him", and "Crack! The ice…" by one letter). With the pool items, about 5 of 8 boss answers are the longest.
  **Fix (swap one distractor in each):** "This is about a sefer." → "This paragraph is going to tell you all about a sefer." · "The club went skating on Sunday." → "The club went skating on the big pond on Sunday." · "The room has a clock." → "The room has a big round clock on the back wall." · "a lot" → "a lot of stuff in the yard" · "The end." → "The club baked cookies and cakes for a new family." · "he has a sled" → "he also has a red sled in the yard".
- **p7** — no `pre:'lessons'`: the pre-check draws one of each skill's two items, and the boss draws one of the same two at random (half the time a repeat). The other 5 boss questions are lesson checks word for word (A).
  **Fix:** add `pre:'lessons'`.

### `W13.U34` Explain It — FIX
- **p7** — one own item per skill and no `pre:'lessons'`: the pre-check asks the whistle, toaster, magnet, "Also," and kettle items, and the boss asks **exactly the same 5**, plus 3 review lesson checks word for word. All 8 were seen before.
  **Fix:** add `pre:'lessons'` and a 2nd item per skill, e.g. `{skill:'WRIT.PARA.L04.14',type:'evidence',q:'Which sentence is a definition?',p:['Our sukkah has a schach roof made of thick green branches.','Schach is the roof of a sukkah, made from plants.','Schach is nice.'],a:1,look:'what the hard word means',how:'Which sentence tells what the word means?'}`.

### `W13.U35` Little Researcher — FIX
- **p7** — no `pre:'lessons'`: the boss uses all 8 own items, so every pre-check question comes back. The 3 review questions are lesson checks word for word. About 7 of 11 seen before.
  **Fix:** add `pre:'lessons'`.

### `W13.U36` Revise, Edit, Publish — FIX
- **p7** — no `pre:'lessons'`: the boss uses 5 of the 6 own items (so most pre-check items return), and the 3 review questions are lesson checks word for word.
  **Fix:** add `pre:'lessons'`.

## 2. Book texts

Note: the three folders hold **38** `.txt` files, not 43 (F 19, FH1 18, W13 1). All 38 were read. A text passes when Decodable/level fit, Correct and clear, and Warm are all 4 or 5. Fun is reported, but it does not decide pass or fail (same as for lessons).

| Text | Grade | Decodable/level fit (1-5) | Correct and clear (1-5) | Warm and family life (1-5) | Fun (1-5) | Result |
|---|---|---|---|---|---|---|
| `F.LA.K01` Eli's First Day (listen-along) | K | 5 | 5 | 5 | 4 | ✓ pass |
| `F.LA.K02` Supper in the Sukkah | K | 5 | 5 | 5 | 4 | ✓ pass |
| `F.LA.K03` The Kippah That Flew Away | K | 5 | 5 | 5 | 4 | ✓ pass |
| `F.LA.K04` Challah for Shabbos | K | 5 | 5 | 5 | 4 | ✓ pass |
| `F.PO.01` Rain on the Sukkah (poem) | 2 | 5 | 4 | 5 | 4 | ✓ pass |
| `F.RT.01` The Clock That Stopped (play) | 2 | 5 | 5 | 5 | 5 | ✓ pass |
| `F.RT.02` The Lost Siddur (play) | 2 | 5 | 5 | 5 | 4 | ✓ pass |
| `F.RT.03` The Snow Day Fort (play) | 2 | 5 | 5 | 5 | 4 | ✓ pass |
| `F.WR.15` Spice at the Corner Store | 2 | 5 | 3 | 5 | 4 | **✗ fix** |
| `F.WR.16` Ginger in the Cage | 2 | 5 | 4 | 4 | 4 | ✓ pass |
| `F.WR.17` Knots, Lambs and a Wrapped Gift | 2 | 5 | 5 | 5 | 4 | ✓ pass |
| `F.WR.18` The Photo Contest | 2 | 5 | 5 | 5 | 4 | ✓ pass |
| `F.WR.19` The Gem in the Garden | 2 | 5 | 5 | 4 | 4 | ✓ pass |
| `F.WR.20` Baking Day | 2 | 5 | 5 | 5 | 4 | ✓ pass |
| `F.WR.21` The Running Race | 2 | 5 | 5 | 5 | 4 | ✓ pass |
| `F.WR.22` Berries for the Babies | 2 | 5 | 5 | 5 | 4 | ✓ pass |
| `F.WR.23` The Helpful Club | 2 | 5 | 4 | 5 | 3 | ✓ pass |
| `F.WR.24` Unpack and Repack | 2 | 5 | 5 | 5 | 4 | ✓ pass |
| `F.WR.25` The Club Fair | 2 | 5 | 4 | 5 | 4 | ✓ pass |
| `FH1.K.15` Hop the Pet | K | 5 | 5 | 4 | 3 | ✓ pass |
| `FH1.K.16` The Fig in the Cup | K | 3 | 4 | 4 | 4 | **✗ fix** |
| `FH1.K.17` The Red Rug | K | 5 | 5 | 4 | 3 | ✓ pass |
| `FH1.K.18` Fun in the Sun | K | 3 | 5 | 4 | 3 | **✗ fix** |
| `FH1.K.19` The Pup Can Dig | K | 3 | 5 | 4 | 4 | **✗ fix** |
| `FH1.K.20` The Hat on the Dog | K | 5 | 5 | 4 | 4 | ✓ pass |
| `FH1.K.21` The Bug in the Jug | K | 3 | 5 | 4 | 3 | **✗ fix** |
| `FH1.K.22` The Wet Dog | K | 5 | 5 | 4 | 3 | ✓ pass |
| `FH1.K.23` Jam on a Bun | K | 5 | 5 | 4 | 4 | ✓ pass |
| `FH1.K.24` Go, Bus, Go! | K | 3 | 5 | 4 | 3 | **✗ fix** |
| `FH1.K.25` The Web on the Log | K | 5 | 4 | 4 | 3 | ✓ pass |
| `FH1.K.26` Mop It Up | K | 5 | 5 | 4 | 3 | ✓ pass |
| `FH1.K.27` The Fox in the Box | K | 5 | 5 | 4 | 4 | ✓ pass |
| `FH1.K.28` The Hen in the Box | K | 3 | 5 | 4 | 3 | **✗ fix** |
| `FH1.K.29` Go, Van, Go! | K | 5 | 4 | 4 | 4 | ✓ pass |
| `FH1.K.30` Zip Up! | K | 5 | 5 | 4 | 3 | ✓ pass |
| `FH1.K.31` The Quiz | K | 3 | 5 | 4 | 3 | **✗ fix** |
| `FH1.K.32` The Red Wax | K | 5 | 5 | 3 | 3 | **✗ fix** |
| `W13.LEAF.01` Why Do Leaves Change Color? (leaflet) | 3 | 5 | 5 | 4 | 4 | ✓ pass |

Length check: the K books have 29–49 words (fine), the Grade 2 readers 179–227 (within 150–300), and the leaflet 252. Facts in the leaflet (chlorophyll, hidden yellow/orange, red from trapped sugar, the seal at the stem) are correct. Nothing URGENT in any text: no Divine Name, nothing immodest, all food kosher, no other religions' symbols. Names are varied (Benhamou, Feld, Gold, Peretz, Ovadia, Saba, Gad/Dan/Tal/Ben/Zev/Dov).

### `FH1.K.16`, `K.18`, `K.19`, `K.21`, `K.24`, `K.28`, `K.31` — FIX (decodable)
The header in `src/CoreDataFH1.html` says these books use only taught letters and the heart words the, a, I, is (later also my, go, no, so). Two words used here are never taught on the K path: **"see"** (K.16, K.21, K.28) and **"to"** (K.18, K.19, K.21, K.24, K.31).
- K.16: "Dan can not see it." → **"Dan can not get it."**
- K.18: "It is fun to run in the sun." → **"Run in the sun! It is fun!"**
- K.19: "The pup ran to Dan." → **"Up ran the pup!"**
- K.21: "Ben can see a bug in the jug." → **"A bug is in Ben's jug!"** (or "A bug is in the jug!") · "The bug ran to a big log." → **"The bug ran up a big log."**
- K.24: "The bus got to Tal." → **"Tal is at the bus."**
- K.28: "A fox can see the hen!" → **"A fox is at the box!"**
- K.31: "It is fun to get it!" → **"Yes! It is fun!"**
- Also check: "has" and "his" (s says z) appear from Book 1. Teach "s can say z" before the books or count them as heart words.

### `FH1.K.32` The Red Wax — FIX (warm)
- No other person and no kindness: Zev fixes a jug alone (warm 3). **Fix (decodable):** start "Gad has a jug. The jug has a gap. Zev got red wax." and end "No gap! Gad can sip. Zev can fix a lot!"

### `F.WR.15` Spice at the Corner Store — FIX (correct)
- Contradiction: "Mommy needs rice and **a bag of** cinnamon", then Mr. Benhamou brings "**a tiny jar of** cinnamon". A question on what he brought could confuse the boy. **Fix:** "Mommy needs rice and a jar of cinnamon."

### Small notes on passing texts (optional)
- `F.WR.23`: "There was no light at night, just candles" in old Mr. Gold's boyhood shul is unlikely for a man born in the 1940s. → "The shul was small and lit by oil lamps" or "…in his little town far away".
- `F.WR.25`: "two puppies that hopped past the phone on the corner" reads as a list of review words. → "two puppies playing by the phone on the corner".
- `F.PO.01`: "But Chaim lifts the cloth up high" does not say which cloth. → "But Chaim tucks the challah cloth / to keep it for our sake."
- `FH1.K.25`: "Tal got a big lid. Tap, tap! The web is cut." A lid does not cut. → "Tal got a big lid. Tap, tap! The web is off."

## Across the batch
- **Not cold, by design:** the lesson checks have exactly 3 questions, all asked every time, and the unit pool reuses them. 6 of 11 units have no `items`, and the 5 that do lack `pre:'lessons'`, so the pre-check spends the boss's own items. Fix for all: own items (2 per skill) plus `pre:'lessons'`.
- **Pictures dropped in unit checks** (`fromSkill` keeps only text pics). This makes "Build the word for the picture" a guessing scramble and produced both URGENT keys (snoop, cafe). Fix it once in `src/CoreUnits.html` (filter or show the emoji), not unit by unit.
- **2-choice items** dominate the Grade 2 phonics pools (open/closed, long/short, soft/hard, ch/tch). Against an 80% bar, about half of F.U21, U23 and U24 is a coin flip.
- **No "How to do it" in unit checks:** `fromSkill` questions carry no `how` line, while own `items` do. One more reason to give every skill own items.
- **K books:** "see" and "to" are used but never taught (7 books). The K books are kind but have almost no family or frum life (no Abba, Ima, Shabbos). Decodable words like "Dad"/"Mom" are not the school's style, so warmth comes from friends helping. Keep it that way, and add a helper where a book has none.
- **Names in W13 items:** Dovid, Chaim, Avi and Naftali (the club cast) fill most items. Use the wider cast (Tzvi, Eli, Shmuel, Yaakov, Ovadia, Benhamou) in new items.

URGENT: 2
1. `F.U22`: READ.LV.L03.01 check "s p oo n" is shown without its picture in the unit check, so "snoop" (a real word) is marked wrong.
2. `F.U24`: READ.PHON.L03.03 check "f a c e" is shown without its picture in the unit check, so "cafe" (a real word) is marked wrong.
