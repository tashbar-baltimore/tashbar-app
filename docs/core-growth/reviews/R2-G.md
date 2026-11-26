# Review round 2 · job G · Grammar and words (2026-11-26)

Gap B1c (docs/GAP-BOARD.md). Fresh reviewers who wrote none of these lessons scored every G lesson live on `origin/main` (26 Nov, 19:08 UTC) that Round 1 did not score. That is 43 new lessons, plus the 10 existing Grade 6–8 skills rebuilt as One Bite lessons in `src/CoreDataGH1.html` (#461). Each reviewer got the standard, the G map, the lesson data and **every distinct check question the engine can draw** (dumped with `tools/audit/unitpool.js`, 25 builds per skill). Every answer key was checked by hand. Each URGENT line below was then checked again in the code by the builder who wrote this file, who wrote none of the lessons. The 11 Round 1 ✗ lessons are gap B2c and are not scored again here. G has no unit checks yet.

**Owner (job G): fix the ✗ lessons first (any point below 4), then the URGENT lines. Say in your PR which lines it fixes; the next round re-scores them.**

Points: 1 goal · 2 teaching · 3 progression · 4 thinking steps · 5 mistake work · 6 variety and age fit · 7 taught then asked · 8 correct and clear · 9 warm. Fun = how exciting a boy would find it (1–5).

## Summary

| Batch | Lessons | Pass (all 4–5) | % |
|---|---|---|---|
| 1 · Grades 2–4 | 18 | 13 | 72% |
| 2 · Grades 5–7 | 18 | 7 | 39% |
| 3 · Grades 7–8 (incl. the 10 rebuilt) | 17 | 2 | 12% |
| **All G** | **53** | **22** | **42%** |

The higher the grade, the weaker the lessons.

**Why lessons fail:**
- **Point 7, checks that are not cold.** The check answer is printed earlier in the lesson; a check has only 2 choices; or one choice is the only real word.
- **Point 6, the same shape in a row.** Ten new Grade 7–8 lessons use the same 7 steps. Their tiles are 3–4 chunks with one obvious order, which is too easy for Grades 7–8.
- **Repeats a lower grade.** `READ.VOC.L06.06` is close to a copy of Grade 4's `READ.VOC.L05.07`. `READ.VOC.L08.07` and `READ.VOC.L09.05` repeat Grade 4 and Grade 6 lessons.
- **The 10 rebuilt lessons:** most of their old check questions have only 2 choices.

**Still open from Round 1 (problem 3):** no lesson ends with the boy writing his own sentence. Point 3 was scored 4 for this and no lesson was failed on it. Gap B4 builds that step.

## URGENT (each one checked again in the code)

| Item | Problem | Fix |
|---|---|---|
| `READ.VOC.L08.05` do 2 (`src/CoreDataG7.html`) | The Mistake Detective card "A coat of many colors means a very colorful coat." is keyed **Right**. As an allusion it points to Yosef (a gift showing the favorite son). A boy who follows the lesson's own rule taps Mistake and is marked wrong. | `["A coat of many colors means a gift that shows one son is the favorite.", 0]` |
| `READ.VOC.L08.01` Show me check (`packs/HowToDo3.html`) | "Dovid was as busy as a bee": the choices are idiom, metaphor and simile, keyed simile. Dictionaries list "busy as a bee" as an idiom, so idiom is defensible. | Use a fresh simile, e.g. "Dovid zipped around the kitchen like a wind-up toy." (update the pack's `TL_PACKS` line) |

**Near miss (fix with the next PR):** in `READ.VOC.L07.05` check 2, "the printer" is a person. The next lesson keys "The printer refused to work" as personification (a machine). Use "the pressman" or "the copier".

## What the boy sees (played as a made-up TEST- boy)
`LANG.SENT.L08.02` (Sharpen the Sentence, Grade 7) was played from start to Level clear at 390 px and at 1366×768: 26 screens, 0 page errors. Pictures: `docs/screens/b1c-r2/phone-LANG.SENT.L08.02.jpg` and `chromebook-LANG.SENT.L08.02.jpg`.
- **What works:**
  - Watch me cuts "There was a really big crowd that made a lot of noise" down to "A big crowd roared." one step at a time.
  - Real Mistake Detective work.
  - A good fill-the-gap.
- **What is wrong:**
  - Streak banners cover the question (gap B7).
  - Picture chips that mean nothing on Show me, e.g. a blue circle labelled "boys" (gap B8).
  - The tile build "debated / had a debate about" is easy for Grade 7.

---

## Batch 1 · G (Grammar and words), part 1

Source: lesson data (`BITE` watch/oops/do/your and `LESSONS` teach/check) from `src/CoreDataG6.html` (16 lessons), `src/CoreDataG5.html` (`LANG.MECH.L05.02`) and `src/CoreDataG8.html` (`READ.VOC.L05.06`) at `bded1ed`, plus every distinct check question in `batch1.json`. Every key (checks and practice) was checked by hand. Fresh reviewer; I wrote none of these lessons.

Points: 1 goal · 2 teaching · 3 progression · 4 thinking steps · 5 mistake work · 6 variety and age fit · 7 taught then asked · 8 correct and clear · 9 warm.

| Lesson | Name | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | Fun | Grade level | Result |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `READ.VOC.L03.02` | Same Root, Same Family | 5 | 5 | 4 | 4 | 5 | 4 | 4 | 5 | 5 | 3 | ok | ✓ pass |
| `READ.VOC.L03.03` | Two Words, One Word | 5 | 5 | 4 | 5 | 5 | 4 | 4 | 5 | 5 | 4 | ok | ✓ pass |
| `READ.VOC.L03.04` | Clue Spotter | 5 | 5 | 4 | 5 | 5 | 4 | 5 | 4 | 5 | 3 | ok | ✓ pass |
| `READ.VOC.L03.05` | Look It Up | 5 | 5 | 4 | 5 | 5 | 4 | 3 | 4 | 5 | 3 | ok | **✗ fix** |
| `READ.VOC.L03.06` | Toss, Throw, Hurl | 5 | 4 | 4 | 5 | 5 | 4 | 4 | 4 | 5 | 4 | ok | ✓ pass |
| `LANG.USE.L04.01` | Say It Better | 5 | 5 | 4 | 5 | 5 | 4 | 4 | 5 | 5 | 4 | ok | ✓ pass |
| `READ.VOC.L04.04` | Un-, Re-, Pre-, Dis- | 5 | 5 | 4 | 4 | 5 | 4 | 4 | 5 | 5 | 3 | ok | ✓ pass |
| `READ.VOC.L04.05` | -ful, -less, -able | 5 | 5 | 4 | 4 | 5 | 4 | 3 | 5 | 5 | 4 | ok | **✗ fix** |
| `READ.VOC.L04.06` | Root Finder | 5 | 4 | 4 | 5 | 5 | 4 | 4 | 4 | 5 | 3 | ok | ✓ pass |
| `READ.VOC.L04.07` | Thought, Believed, Suspected | 5 | 5 | 4 | 5 | 5 | 4 | 4 | 5 | 5 | 4 | ok | ✓ pass |
| `LANG.MECH.L05.02` | "Quote," He Said | 5 | 4 | 4 | 5 | 5 | 4 | 4 | 5 | 5 | 3 | ok | ✓ pass |
| `READ.VOC.L05.02` | Tele, Photo, Graph | 5 | 4 | 4 | 5 | 5 | 4 | 4 | 5 | 5 | 4 | ok | ✓ pass |
| `READ.VOC.L05.03` | Word Part Builder | 5 | 5 | 4 | 5 | 5 | 4 | 3 | 5 | 5 | 4 | ok | **✗ fix** |
| `READ.VOC.L05.04` | Definition Clues | 5 | 5 | 4 | 5 | 4 | 4 | 3 | 4 | 5 | 3 | ok | **✗ fix** |
| `READ.VOC.L05.05` | Dictionary Pro | 5 | 5 | 4 | 5 | 5 | 4 | 4 | 5 | 5 | 3 | ok | ✓ pass |
| `READ.VOC.L05.06` | As Brave as a Lion | 5 | 5 | 4 | 5 | 5 | 4 | 4 | 5 | 5 | 4 | ok | ✓ pass |
| `READ.VOC.L05.07` | Idioms and Sayings | 5 | 5 | 4 | 5 | 5 | 4 | 3 | 5 | 5 | 4 | ok | **✗ fix** |
| `READ.VOC.L05.08` | School Words | 5 | 4 | 4 | 5 | 5 | 4 | 4 | 5 | 5 | 3 | ok | ✓ pass |

### URGENT

URGENT: none. No check or practice key marks a right answer wrong (all 54 check questions and every do/your key verified by hand). No Divine Name, no girls or women in any emoji/picture (pics are objects: 🌳 🌻 🔍 📖 ⚾ 🎨 🔤 ✨ 🌱 🪜 💬 📷 🧱 🔎 🦁 💡 📝), no other religions' symbols, all food kosher (challah, cholent, kugel, rugelach, grape juice), and the word "bite" is on no boy screen.

### Across the batch (read first)

- **Same shape in 16 of 18 lessons (p6).** do = [match, Mistake sort] and your 2 = sort, your 4 = match in almost every lesson (only `LANG.MECH.L05.02` and `READ.VOC.L05.03` start differently). Prompt section 5: "no two lessons in a row have the same shape". Each lesson below has one swap; doing even half of them breaks the pattern.
- **No lesson ends with his own sentence (p3).** The path ends at Show me. Each lesson below has a copy-ready `workout` (sent to the teacher, never auto-marked), as in R1-G.
- **"Only real word" distractors.** Several checks offer made-up words (relike, fixful, endable, disread) next to one real word, so a boy can pass without knowing the part's meaning. Use real words as distractors.
- **Say lines that hand over the meaning.** "Fill the gap with the word that means not agree" leaves no thinking. Let the sentence carry the meaning; say only "Fill the gap with the word that fits."

---

### `READ.VOC.L03.02` Same Root, Same Family — pass
- **p3** — (no closing sentence workout)  
  **Fix:** workout:{say:'Your sentence!', t:'Write one sentence about your family that uses a help word: helper, helpful or unhelpful.'}
- **p4** — your 3 say: "Fill the gap with the word for someone who bakes." / how: "Bake + -er means someone who bakes."  
  **Fix:** say:'Fill the gap with the family word that fits.' how:'Who bakes? Root bake + -er.'
- **p6** — do [match, sort] · your [parts, sort, cloze, match, cloze], the batch shape.  
  **Fix:** Swap your 4 (match) for findall: grid ['helper','hammer','helpful','happy','unhelpful','helmet'], find ['helper','helpful','unhelpful'], say:'Tap every word in the help family.'
- **p7** — check: "unhelpful … What does unhelpful mean?" → "not helpful"; your 1 says "Build the word that means not helpful."  
  **Fix:** Change your 1 to parts ['un','kind'] extra ['ness'], mean 'not kind', say 'Build the word that means not kind.'

### `READ.VOC.L03.03` Two Words, One Word — pass
- **p3** — (no workout)  
  **Fix:** workout:{say:'Your sentence!', t:'Write one sentence about your Shabbos table that uses a compound word, like tablecloth or candlestick.'}
- **p6** — batch shape (match, sort first).  
  **Fix:** Swap do 1 match for findall: grid ['snowman','jumping','lunchbox','happy','toothbrush','running'], find ['snowman','lunchbox','toothbrush'].
- **p7** — check: "Which two words make "birdhouse"?" options "bir + dhouse", "birdh + ouse": only one choice has real words, and birdhouse was in your 4.  
  **Fix:** q:'Tatty built a birdhouse for the yard. What is a birdhouse?' o:['a house for birds','a bird that lives in a house','a bird near the house'] a:'a house for birds'.

### `READ.VOC.L03.04` Clue Spotter — pass
- **p3** — (no workout)  
  **Fix:** workout:{say:'Your sentence!', t:'Write one sentence with a hard word and a clue right after it, like "Zeidy was weary, very tired."'}
- **p6** — batch shape; your 1 tiles only re-order the four clue steps.  
  **Fix:** Swap your 1 for findall on q:'"The pond was frigid, so icy cold that we shivered."' grid ['pond','frigid','icy cold','shivered'], find ['icy cold','shivered'], say:'Tap the clue words.'
- **p8** — do 1 say: "Match each hard word to its meaning." how: "Use the clues from the sentences." No sentence is on the screen (enormous, scalding, timid), so there is no clue to use.  
  **Fix:** Add q:'The box was enormous, very big. The soup was scalding, very hot. Dovi was timid, not brave.'

### `READ.VOC.L03.05` Look It Up — FIX (a point below 4)
- **p3** — your 1 tiles ["crop","harvest","orchard","soil"] is the exact list from Watch me, already in order.  
  **Fix:** w:['bread','seed','sprout','vine'] (two s-words, so he must use the second letter); also add workout:{say:'Your sentence!', t:'Write one sentence that uses a glossary word you learned: orchard, harvest or sprout.'}
- **p6** — batch shape.  
  **Fix:** Swap your 4 (match) for findall: q:'Glossary words start with s. Which come before "soil"?' grid ['sand','stem','seed','sun','sky','sap'], find ['sand','seed','sky','sap'].
- **p7** — check: "Shloimy meets the hard word "vine" … Where can he look up what it means?" (fact recall; "on the cover"/"in the title" are not real choices) and "Which letter do you look at next?" → "the second letter" (printed in do 2 how: "Same first letter? Check the second letter."). Only 1 of 3 checks makes him use a glossary, and none makes him read a meaning.  
  **Fix:** check 2 → q:'Glossary: "vine: a plant that climbs and grows grapes." Shloimy reads, "The grapes hung on the vine." What is a vine?' o:['a plant that climbs','a bunch of grapes','a kind of fence']. check 3 → q:'Which word comes first in a glossary?' o:['sprout','seed','soil'] a:'seed'.
- **p8** — do 1 and your 4 say: "Read the glossary. Match each word to its meaning." No glossary is shown; soil and sprout meanings were never shown before do 1.  
  **Fix:** Add q to both: do 1 q:'Glossary · orchard: a field of fruit trees · soil: the dirt plants grow in · sprout: to start to grow'; your 4 q:'Glossary · crop: a plant grown for food · harvest: to pick crops when ready · soil: the dirt plants grow in'.

### `READ.VOC.L03.06` Toss, Throw, Hurl — pass
- **p2** — do 1 match "glance → a quick look", "stare → a long look": glance and stare are never taught in Watch me.  
  **Fix:** Add watch step {t:'Looks have shades too: glance is quick, stare is long.'}.
- **p3** — (no workout)  
  **Fix:** workout:{say:'Your sentence!', t:'Write one sentence about a hot or cold day. Pick the word that is just strong enough.'}
- **p6** — batch shape.  
  **Fix:** Swap your 2 (sort) for tiles: w:['warm','hot','scorching'] extra ['cool'], say:'Put the hot words in order, least hot first.'
- **p7** — check: "Which word is colder than cool but not as cold as freezing?" → cold; your 5 just built "cool, cold, freezing".  
  **Fix:** Make your 5 the hot ladder (warm, hot, scorching) and keep the cold ladder for the check only.
- **p8** — do 2 card: "The tea was scorching, so Moshe gulped it right away." (Mistake) under "Does the word fit?": scorching fits tea; the wrong part is gulped, so a careful boy can say Right.  
  **Fix:** Replace the pair with ["Avi glanced at the clock for one second.",0] / ["Avi stared at the clock for one second.",1].

### `LANG.USE.L04.01` Say It Better — pass
- **p3** — (no workout; this is a LANG.USE lesson, so the G map's "own sentence" rule applies directly)  
  **Fix:** workout:{say:'Your sentence!', t:'Write one sentence about getting ready for Shabbos. Use one strong word instead of went or said.'}
- **p6** — do [match, sort] · your [tiles, sort, cloze, match, sort]: sort three times.  
  **Fix:** Swap your 5 (sort) for findall: q:'"Avi went to shul. He said hello. The kugel was good."' grid ['went','shul','said','hello','good','kugel'], find ['went','said','good'], say:'Tap every plain word you could make stronger.'
- **p7** — check: ""The snowman in the yard was very big." Which word says it better?" → huge; do 1 matched "very big" → "huge" word for word.  
  **Fix:** q:'"The snowman in the yard was very cold." Which word says it better?' o:['freezing','cool','warm'] — and drop ["very cold","freezing"] from your 4 (use ["very tired","exhausted"]).

### `READ.VOC.L04.04` Un-, Re-, Pre-, Dis- — pass
- **p3** — (no workout)  
  **Fix:** workout:{say:'Your sentence!', t:'Write one sentence about helping at home that uses a re- or un- word.'}
- **p4** — your 3 say: "Fill the gap with the word that means not agree." The say line does the thinking.  
  **Fix:** say:'Fill the gap with the word that fits.' how:'They did not agree. Which prefix means not?'
- **p6** — batch shape.  
  **Fix:** Swap your 4 (match) for findall: grid ['unkind','under','retell','read','preheat','pretzel'], find ['unkind','retell','preheat'], say:'Tap the words that really have a prefix.'
- **p7** — check: "Yanky does not like cold weather. Which word …?" o: ["dislike","relike","prelike"]: only one real word, guessable.  
  **Fix:** o:['dislike','redo','prepay'] a:'dislike'.

### `READ.VOC.L04.05` -ful, -less, -able — FIX (a point below 4)
- **p3** — (no workout)  
  **Fix:** workout:{say:'Your sentence!', t:'Write one sentence about a boy in your class using a -ful or -less word.'}
- **p4** — your 3 say: "Fill the gap with the word that means full of care."  
  **Fix:** say:'Fill the gap with the word that fits.' how:'It can break, so take care. Full of care or without care?'
- **p6** — batch shape.  
  **Fix:** Swap your 4 (match) for findall: grid ['hopeful','table','fearless','bless','washable','useful'], find ['hopeful','fearless','washable','useful'], say:'Tap the words with a real suffix.'
- **p7** — checks: o ["fixable","fixless","fixful"] and ["endless","endful","endable"]: in 2 of 3 checks only one choice is a real word, so he passes without knowing what the suffix means.  
  **Fix:** check 1 o:['fixable','careless','thankful'] a:'fixable'; check 2 o:['endless','helpful','washable'] a:'endless'.

### `READ.VOC.L04.06` Root Finder — pass
- **p2** — today's named skill is company/companion (G map: "Use a known root: company, companion"), but Watch me only does replay, playful, player. Companion is first met in your 3 behind "Need help?".  
  **Fix:** Add watch step {t:'Harder words too: company and companion share a root. Both are about people together.', m:{type:'tiles', w:['company','companion'], hi:[0,1]}}.
- **p3** — (no workout)  
  **Fix:** workout:{say:'Your sentence!', t:'Write one sentence about a friend that uses companion or company.'}
- **p6** — batch shape.  
  **Fix:** Swap your 2 (sort) for findall: grid ['player','plate','replay','plan','playful','planet'], find ['player','replay','playful'], say:'Tap every word with the root play.'
- **p7** — check: "Companion has the same root as company. What idea do they share?" → together; your 4 how says "Company and companion share the idea together."  
  **Fix:** your 4 how:'Think: who is with you?'
- **p8** — teach/how: "Same root, same idea: together." The shared root is really pan (bread); "together" comes from com-. Also "share the idea together" is not a clear sentence.  
  **Fix:** 'Company and companion share a root. Both are about people being together.'

### `READ.VOC.L04.07` Thought, Believed, Suspected — pass
- **p3** — (no workout)  
  **Fix:** workout:{say:'Your sentence!', t:'Write one sentence about a mystery at home. Use knew, suspected or wondered.'}
- **p6** — batch shape.  
  **Fix:** Swap your 4 (match) for findall: q:'"Dovi wondered where the key was. He suspected Avi had it. Then he saw it and knew."' grid ['wondered','key','suspected','saw','knew','Avi'], find ['wondered','suspected','knew'].
- **p7** — check: ""Eli suspected the cake was for him…" How sure is Eli?" → "not sure yet"; your 2 sorted "suspected" into "Not sure yet" word for word.  
  **Fix:** your 2 bins ['Proof','No proof yet'].

### `LANG.MECH.L05.02` "Quote," He Said — pass
- **p2** — the question mark rule (check 3) is not in Watch me; it first shows in your 2 / your 4.  
  **Fix:** Add watch step {t:'Asking? The ? goes inside, and no comma.', m:{type:'tiles', w:['"Is it here?"','Avrumi','asked.'], hi:[0]}}.
- **p3** — (no workout)  
  **Fix:** workout:{say:'Your sentence!', t:'Write one thing Zeidy said at the Shabbos table. Use a speaker tag, a comma and quotation marks.'}
- **p6** — tiles 3 times; your 3 tiles ["Dovid","said,","\"Shabbos starts soon.\""] has no extra.  
  **Fix:** your 3 extra:['said']; swap your 4 (match) for findall on '"We won," Yehuda said.' grid ['"','We','won',',','"','said','.'], find [','], say:'Tap the comma. Is it inside?'
- **p7** — check: ""We are late," Shmuel said. Where is the comma?" The comma is printed in the sentence, so he only looks.  
  **Fix:** q:'Which is right?' o:['"We are late," Shmuel said.','"We are late", Shmuel said.','"We are late." Shmuel said.'] a:'"We are late," Shmuel said.'

### `READ.VOC.L05.02` Tele, Photo, Graph — pass
- **p2** — Watch me teaches only photo + graph. auto first comes in do 1; phon (check 3) only in the oops line.  
  **Fix:** Add watch steps {t:'Auto means self: an autograph is a name you write yourself.'} and {t:'Phon means sound: telephone, microphone.'}.
- **p3** — (no workout)  
  **Fix:** workout:{say:'Your sentence!', t:'Write one sentence that uses telephone, photograph or autograph.'}
- **p6** — batch shape.  
  **Fix:** Swap your 2 (sort tele/graph) for sort bins ['Has phon (sound)','Has photo (light)'] cards ['telephone',0],['microphone',0],['photograph',1],['telephoto',1]] — this also practises the phon/photo mix-up.
- **p7** — check: "Avrumi asked the visiting rebbe to sign his name … What did Avrumi get?" → autograph; your 1 is the same story ("asked the author to sign his book … autograph").  
  **Fix:** your 1 t:'Mr. Halpern pointed the ___ at the moon to see it up close.' o:['telescope','photograph','autograph'] a:'telescope' (how: far + see).

### `READ.VOC.L05.03` Word Part Builder — FIX (a point below 4)
- **p3** — (no workout)  
  **Fix:** workout:{say:'Your sentence!', t:'Write one sentence about something at home that is unbreakable or refillable.'}
- **p6** — un-, re-, -ful, -able, unhelpful are the same parts as Grade 3 (`READ.VOC.L04.04`, `.L04.05`). Only port and -ness are new.  
  **Fix:** Climb in your 4: parts ['dis','agree','able'] extra ['ness'], mean 'not able to agree, hard to get along with'; and in your 2: t:'The old map was ___. Nobody could read it.' o:['unreadable','rereadable','readers'].
- **p7** — check: ""unthankful" … What does the suffix -ful mean?" (a Grade 3 fact, taught in L04.05) and ""irreplaceable." Which part should you start with?" (method recall). Only check 1 makes him build or read a word.  
  **Fix:** check 2 → q:'Tatty bought a portable table for the sukkah. Port means carry. What does portable mean?' o:['able to be carried','one who carries','carried back'] a:'able to be carried'. check 3 → q:'Bubby calls her old candlesticks "irreplaceable." What does it mean?' o:['nothing else can take their place','they were replaced again','they are easy to replace'].

### `READ.VOC.L05.04` Definition Clues — FIX (a point below 4)
- **p3** — (no workout)  
  **Fix:** workout:{say:'Your sentence!', t:'Write one sentence with a hard word and its meaning after a comma, like "A sofer, a man who writes Torah scrolls, came to shul."'}
- **p5** — do 2 sorts signal-word labels (""Which means" signals an example clue."), not the real reading error. The real error is in the oops: "Mint is only one example."  
  **Fix:** do 2 cards ['"…legumes, such as beans and lentils." Legumes are foods like beans.',0],['"…legumes, such as beans and lentils." Legumes are lentils only.',1],['"…punctual, which means always on time." Punctual means never late.',0],['"…punctual, which means always on time." Punctual means a clock.',1].
- **p6** — batch shape; your 3 tiles has no extra.  
  **Fix:** your 3 extra:['which means']; swap your 4 (match) for findall on '"The sofer, a man who writes Torah scrolls, came to shul."' grid ['sofer','a man who writes','Torah scrolls','came','shul'], find ['a man who writes','Torah scrolls'], say:'Tap the definition.'
- **p7** — no check asks what the word means (the goal is "find a word's meaning"); check 3 "What shows where the meaning starts?" o ["the comma","such as","because"] is guessable, because only the comma is in the sentence.  
  **Fix:** check 3 → q:'"The baker used a spatula, a flat tool for lifting and spreading." What is a spatula?' o:['a kitchen tool','a kind of bread','a baker's helper'] a:'a kitchen tool'.
- **p8** — your 4 pair "provisions, such as bread and water" → "supplies for a trip": "for a trip" cannot be found from the clue.  
  **Fix:** right side 'food and other things you need'.

### `READ.VOC.L05.05` Dictionary Pro — pass
- **p3** — (no workout)  
  **Fix:** workout:{say:'Your sentence!', t:'Write two sentences: one with REC·ord and one with re·CORD.'}
- **p6** — sort 3 times; your 1 and your 5 cloze have only 2 choices.  
  **Fix:** your 5 o:['sense 1','sense 2','neither one']; swap your 2 (sort) for tiles: w:['ob','JECT'] extra ['OB'], say:'Build the verb: Ima did not ___.'
- **p7** — check: "A dictionary shows LEM·on. Which syllable is stressed?" — the capitals give it away.  
  **Fix:** q:'Dovid will pre·SENT his project. Which word means the same?' o:['show','gift','late'] a:'show'.

### `READ.VOC.L05.06` As Brave as a Lion — pass
- **p3** — (no workout)  
  **Fix:** workout:{say:'Your sentence!', t:'Write one simile about your Shabbos table, with like or as.'}
- **p6** — batch shape; "The yard was a sea of snow." appears 3 times (do 2, your 2, your 4).  
  **Fix:** your 4 pair ['The shul was an oven in the heat wave.','The shul was very hot.'].
- **p7** — the goal says "explain what each means", but all 3 checks only label; check 3 ("would like a seat") is the oops trick again.  
  **Fix:** check 2 → q:'"After the long hike, Dovid's legs were jelly." What does it mean?' o:['His legs felt weak and wobbly.','He spilled jelly on his legs.','His legs were sticky.'].

### `READ.VOC.L05.07` Idioms and Sayings — FIX (a point below 4)
- **p3** — (no workout)  
  **Fix:** workout:{say:'Your sentence!', t:'Write one sentence about your day that uses an idiom, like lend a hand.'}
- **p6** — batch shape; your 3 tiles has no extra.  
  **Fix:** your 3 extra:['they fly.'].
- **p7** — every check reuses a practised item with its meaning printed: "a piece of cake" → "very easy" (Watch me, do 1, do 2), "in hot water" → "in trouble" (do 1), "Don't count your chickens…" (your 3, your 4). Nothing is cold.  
  **Fix:** check 1 → q:'Before the siyum, Yanky had butterflies in his stomach. What does it mean?' o:['He felt nervous.','He ate too much.','He was outside.']; check 3 → q:'"Time to hit the books," said Tzvi Hirsch before the test. What does he mean?' o:['start learning hard','hit his books','put books away'].

### `READ.VOC.L05.08` School Words — pass
- **p2** — Watch me teaches compare and contrast only; explain and describe first come in do 1.  
  **Fix:** Add watch step {t:'Explain means tell why. Describe means tell what it is like.'}.
- **p3** — (no workout; he never answers a school question)  
  **Fix:** workout:{say:'Your sentence!', t:'Contrast a sukkah and a house in one sentence. Use but.'}
- **p6** — batch shape.  
  **Fix:** Swap your 4 (match) for sort bins ['Compare','Contrast'] cards ['Both have walls.',0],['A sukkah has schach, but a house has a roof.',1],['A family eats in both.',0],['A house is for all year, but a sukkah is for a week.',1].
- **p7** — all 3 checks match a word to its definition, the same thing do 1 printed ("contrast — tell how they are different").  
  **Fix:** check 1 → q:'"Contrast summer and winter." Which answer does it?' o:['Summer is hot, but winter is cold.','Both are seasons.','Winter has snow because it is cold.'] a:'Summer is hot, but winter is cold.'

Batch 1: 13 of 18 pass; URGENT: 0


---

## Batch 2 · G, part 2

Source: `src/CoreDataG9.html` (LANG.MECH.L06.03, .L06.04, .L07.02), `src/CoreDataG7.html` (READ.VOC.L06.03–.07, .L07.05, .L07.06, .L07.08), `src/CoreDataG8.html` (READ.VOC.L07.07), `src/CoreDataGH1.html` (TLCORE.upgrade lessons; their Show me checks read from `packs/ReadMore.html`, including the name-variant draws). Scored on the BITE/UP data the boy sees (opener, watch, oops, do, your, how) plus every check the engine can draw. The old `teach[]` is not shown in One Bite, so it was not counted as teaching. Every key was checked by hand.

Points: 1 goal · 2 teaching · 3 progression · 4 thinking steps · 5 mistake work · 6 variety and age fit · 7 taught then asked · 8 correct and clear · 9 warm.

| Lesson | Name | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | Fun | Grade level | Result |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `LANG.MECH.L06.03` | Comma in a Series | 5 | 5 | 4 | 5 | 5 | 4 | 4 | 5 | 5 | 3 | ok | ✓ pass |
| `LANG.MECH.L06.04` | Opening Comma | 5 | 4 | 4 | 5 | 5 | 4 | 4 | 5 | 5 | 3 | ok | ✓ pass |
| `READ.VOC.L06.03` | Cause and Contrast Clues | 5 | 4 | 4 | 5 | 5 | 4 | 4 | 5 | 5 | 3 | ok | ✓ pass |
| `READ.VOC.L06.04` | Two Words, Same Spelling | 5 | 5 | 4 | 5 | 5 | 4 | 4 | 4 | 5 | 4 | ok | ✓ pass |
| `READ.VOC.L06.05` | Thesaurus Smart | 5 | 5 | 4 | 5 | 5 | 3 | 4 | 5 | 5 | 3 | ok | **✗ fix** |
| `READ.VOC.L06.06` | What the Saying Means | 5 | 5 | 4 | 4 | 5 | 3 | 3 | 5 | 5 | 3 | **below** | **✗ fix** |
| `READ.VOC.L06.07` | However, Moreover | 5 | 5 | 4 | 5 | 5 | 4 | 4 | 5 | 5 | 3 | ok | ✓ pass |
| `LANG.GRAM.L07.01` | Pronoun Precision (upgrade) | 5 | 4 | 4 | 5 | 5 | 4 | 3 | 4 | 5 | 4 | ok | **✗ fix** |
| `LANG.MECH.L07.01` | Extra Info (upgrade) | 5 | 5 | 4 | 5 | 5 | 4 | 3 | 5 | 5 | 4 | ok | **✗ fix** |
| `LANG.MECH.L07.02` | Spell It Right | 5 | 3 | 4 | 5 | 5 | 4 | 3 | 5 | 5 | 3 | ok | **✗ fix** |
| `LANG.USE.L07.01` | Formal Voice (upgrade) | 5 | 5 | 4 | 4 | 5 | 4 | 3 | 5 | 5 | 3 | ok (checks below) | **✗ fix** |
| `READ.VOC.L07.01` | Word Choice (upgrade) | 5 | 5 | 4 | 5 | 5 | 4 | 5 | 5 | 5 | 4 | ok | ✓ pass |
| `READ.VOC.L07.05` | Thrifty or Stingy? | 5 | 4 | 4 | 4 | 5 | 3 | 3 | 4 | 5 | 3 | ok | **✗ fix** |
| `READ.VOC.L07.06` | The Wind Whispered | 5 | 5 | 4 | 5 | 5 | 3 | 3 | 4 | 5 | 4 | ok | **✗ fix** |
| `READ.VOC.L07.07` | Part and Whole | 5 | 5 | 4 | 5 | 5 | 3 | 5 | 5 | 5 | 4 | ok | **✗ fix** |
| `READ.VOC.L07.08` | Academic Words | 5 | 4 | 4 | 4 | 5 | 3 | 4 | 5 | 5 | 3 | ok | **✗ fix** |
| `LANG.GRAM.L08.01` | Complex Sentences (upgrade) | 5 | 5 | 4 | 5 | 5 | 4 | 4 | 4 | 5 | 3 | ok | ✓ pass |
| `LANG.GRAM.L08.02` | Misplaced Modifiers (upgrade) | 5 | 5 | 4 | 5 | 5 | 4 | 3 | 5 | 5 | 4 | ok | **✗ fix** |

**URGENT: none.** No key marks a right answer wrong. No people in any lesson emoji, no non-kosher food, no Divine Name, no other religions' symbols, and the word "bite" appears on no boy screen. Girls' names in the upgrade checks (Miriam, Tova, Adina) are the approved name-variant draws (`TL_READ_NAMES`), so they are not a problem. One near miss is under `READ.VOC.L07.05`/`.L07.06` p8: "the printer" is a person in one check and a machine in the next.

**Across the batch (for job G):**
- **The same shape again.** All 7 E45 lessons (MECH.L06.03–.04, VOC.L06.03–.07) run match/tiles + Mistake sort, then cloze, tiles, sort, match, cloze. All 4 new M68 VOC lessons (L07.05–.08) run match, Mistake sort, then tiles, sort, cloze, tiles, match. Prompt §5 says "no two lessons in a row have the same shape."
- **Tiles that only re-type a given sentence.** The M68 lessons each have two 3–4-chunk tile builds with no extra and one obvious order. Following the R1 W48 precedent, they are too easy for Grade 6, so those lessons score p6 3.
- **No lesson ends with his own sentence** (p3 4 everywhere, as in R1). Use the same fix for each: a closing `workout` step sent to the teacher, never marked right automatically.
- **The upgrade lessons (GH1) still use the old 2-choice checks.** A boy can pass them by guessing, and they mostly repeat the watch word for word (p7 3).

## Notes and copy-ready fixes, lesson by lesson

### `LANG.MECH.L06.03` Comma in a Series: pass
- **p3:** the lesson ends on cloze "Dovid swept the porch, washed the dishes___ and set the table." and never has him write a list of his own. **Fix:** add `workout:{say:'Your sentence!', t:'Write one sentence about getting ready for Shabbos with a list of three things you did. Put the commas in.'}` (to the teacher).
- **p6:** in do 1 and your 3 the commas come already attached to the tiles ("challah,", "filled the cups,"), so building only puts phrases in order and never places a comma. **Fix:** your 3 → `w:['Yehuda set the table',',','filled the cups',',','and folded the napkins.'], extra:[',']` (he must place each comma and leave one out).
- **p7:** check 1 "Moshe set out plates___ cups, and forks." uses the same frame as your 1 ("challah___ grape juice, and candles") with single words, a Grade 1 skill. **Fix:** check 1 → "Avrumi lit the candles___ poured the wine, and sliced the challah." options `[',', '.', ';']`, keyed `,` (a list of phrases).

### `LANG.MECH.L06.04` Opening Comma: pass
- **p2:** the watch models only the clause opener. Opening words (yes, no, well) and long phrases are never shown before do 2 marks "Yes I can help." as a mistake. **Fix:** add a watch step 5: "Two more openers. A word: Yes, I can help. A long phrase: After a long day at the yeshiva, Dovid slept. Each gets a comma too."
- **p3:** no sentence of his own. **Fix:** `workout:{say:'Your sentence!', t:'Write one sentence about your morning that starts with When, After or Because. Put the comma where the opener ends.'}`.
- **p6:** do 1 tiles `extra:["rang"]` is a meaningless decoy, and the comma comes already attached to the tile, so the boy never places it. Yes/no/well repeats the Grade 4 LANG.MECH.L05.01. **Fix:** do 1 → `w:['When the bell rang',',','the boys','lined up.'], extra:[',']` with how "The comma goes where the opener ends."
- **p7:** the answer to check 3 ("a clause with its own subject and verb") is printed word for word in your 2's match. Check 1 "No___" uses the same frame as your 1 "Well___". **Fix:** check 1 → "Before the guests arrived Eli swept the porch. Where does the comma go?" options `['after arrived','after Eli','after porch']`, keyed `after arrived`.

### `READ.VOC.L06.03` Cause and Contrast Clues: pass
- **p2:** the watch models only a contrast clue ("Unlike…placid"). The cause clue is first shown in the oops. **Fix:** add a watch step 5: "Cause clue: Avrumi was famished, so he ate two bowls. So shows a result. He ate a lot because he was very hungry."
- **p3:** **Fix:** `workout:{say:'Your sentence!', t:'Write one sentence that teaches a hard word with because, so, but or unlike.'}`.
- **p6:** your 2 tiles "It was frigid outside, / so / Dovid wore / his warmest coat." needs no clue skill at all (no extra, one order). **Fix:** make it a cloze: "It was frigid outside, so Dovid wore his warmest coat. Frigid means ___." options `['very cold','very windy','very bright']`.
- **p7:** check 3 "scalding … so Zeidy let it cool" is keyed "very hot", the same frame and answer as your 1 "sweltering … Sweltering means very hot". **Fix:** check 3 → "Shimon was elated, unlike his brother, who was sad about the rain. What does elated mean?" options `['very happy','very sad','very tired']`.

### `READ.VOC.L06.04` Two Words, Same Spelling: pass
- **p3:** **Fix:** `workout:{say:'Your sentence!', t:'Write one sentence that uses tear or wind two ways.'}`.
- **p6:** your 2 tiles "The wind / made me / wind / my scarf tighter." only puts tiles in order, with no sound or meaning choice. **Fix:** after the build, add `why:{q:'How do you say the second wind?', o:['rhymes with find','rhymes with pinned','rhymes with bend'], a:'rhymes with find'}`.
- **p7:** check 3 "What are they called?" only recalls the label from the opener. It does not use the skill. **Fix:** "The boys took a bow after the play. How do you say bow here?" options `['rhymes with cow','rhymes with go','rhymes with toy']`.
- **p8:** do 1 why "Why does lead rhymes with seed mean to guide?" is ungrammatical, and the key "That sound is the action word" does not explain why. **Fix:** `why:{q:'Mr. Halpern will lead the trip. Which lead is it?', o:['to guide: rhymes with seed','a gray metal: rhymes with bed','a drop from your eye'], a:'to guide: rhymes with seed'}`.

### `READ.VOC.L06.05` Thesaurus Smart: FIX
- **p3:** **Fix:** `workout:{say:'Your sentence!', t:'Take the plain word walked or said. Write one sentence with a stronger word that fits.'}`.
- **p6:** your 3 sort repeats your 1 exactly ("The baby is asleep, so Avrumi whispered/shouted"). Your 2 tiles "The aroma / of fresh challah / filled / the house." says "with the word that fits" but offers no other word, and just rebuilds do 2's card. **Fix:** your 2 → `extra:['The stink']` with how "Pick the word with the good feeling". Your 3 cards → `[['Dovid strolled to the finish line to win the race.',1],['Dovid raced to the finish line to win the race.',0],['Zeidy chuckled at the joke.',0],['Zeidy sobbed at the joke.',1]]`.

### `READ.VOC.L06.06` What the Saying Means: FIX (repeats Grade 4)
- **p6 / grade level:** this is close to a copy of the Grade 4 lesson `READ.VOC.L05.07` "Idioms and Sayings". Both use "a piece of cake", "under the weather", "Practice makes perfect", "Say little and do much", "Who is wise? One who learns from…" and the same idiom/saying sort. Grade 5 must climb. **Fix:** replace the idioms with new Grade 5 ones and make him use story clues:
  - do 1 pairs `[['spill the beans','tell a secret'],['cost an arm and a leg','cost a lot'],['the ball is in your court','it is your turn to decide'],['on thin ice','close to trouble']]`;
  - your 4 pairs `[["Don't judge a book by its cover.",'Do not decide from how it looks.'],['Where there is a will, there is a way.','If you really want it, you will find a way.'],['Do not judge your friend until you stand in his place.','Understand him before you judge him.']]`.
- **p4:** your 1 how "This saying is from Pirkei Avos." is a fact, not a method. **Fix:** "Ask: what did Eli do? Which word in the saying matches it?"
- **p7:** check 1 ("Actions speak louder than words" → "What you do shows more than what you say.") and check 2 ("break the ice" → "started a friendly talk") are answered word for word in your 4 and do 1. **Fix:**
  - check 1 → "Moshe kept saying he would practice, but he never did. Zeidy said, 'Where there is a will, there is a way.' What does Zeidy mean?" options `['If Moshe really wants it, he will find a way.','Moshe needs a map.','Moshe should stop trying.']`;
  - check 2 → "Before the play, Dovid had butterflies in his stomach. How did he feel?" options `['very nervous','very hungry','sick from bugs']`.

### `READ.VOC.L06.07` However, Moreover: pass
- **p3:** **Fix:** `workout:{say:'Your sentence!', t:'Write two sentences about your Shabbos. Start the second with However or Moreover.'}`.
- **p6:** your 2 tiles "Although / it rained, / the game / went on." has the comma already in the tile and no extra, so it is ordering only. **Fix:** `w:['It rained hard.','However,','the game','went on.'], extra:['Moreover,']`.
- **p7:** check 1 (tiny apartment / twenty guests → However) uses the same frame as your 1 (youngest / fastest → However). **Fix:** check 1 → "Write the next sentence. 'Our bus broke down on the way to the trip.' Which fits?" options `['However, we still reached the zoo by noon.','Moreover, we still reached the zoo by noon.','In addition, we still reached the zoo by noon.']`.

### `LANG.GRAM.L07.01` Pronoun Precision (upgrade): FIX
- **p2 / p8:** watch step 4 says "Unclear: 'Eli told Yoni that he won.' … It works the same way: two things, then it." The example has no "it", so the step is confusing. **Fix:** "Unclear: 'Eli told Yoni that he won.' Who won? Two boys, then he. Fix it with the name: 'Yoni won, and Eli told him.'"
- **p3:** **Fix:** `workout:{say:'Your sentence!', t:'Write one sentence that starts with My friend and I and ends with … and me.'}`.
- **p7:** all 3 Show me checks have 2 choices ("I, or me?", "Him, or he?", the dog sentence), so a boy can guess. Check 2 repeats the watch's cover-up item. **Fix:**
  - check 1 → "Mr. Gross asked Yoni and ___ to check the headline." options `['me','I','myself']`;
  - check 3 → "'Akiva told Benny that his photo won.' Which fix is clear?" options `["Akiva told Benny, 'Your photo won.'","Akiva told him that his photo won.","He told Benny that it won."]`.

### `LANG.MECH.L07.01` Extra Info (upgrade): FIX
- **p3:** **Fix:** `workout:{say:'Your sentence!', t:'Write one sentence about someone you know, with an extra fact set off on both sides.'}`.
- **p7:** all 3 checks have 2 choices. Check 3 "Dashes, or parentheses?" recalls watch step 4 ("Dashes shout") word for word. **Fix:**
  - check 1 → add a third option "Doniel, the youngest boy in shiur won the prize."
  - check 3 → "Which sentence closes the extra part the right way?" options `['The trip—our longest ever—ended at night.','The trip—our longest ever, ended at night.','The trip (our longest ever—ended at night.']`.

### `LANG.MECH.L07.02` Spell It Right: FIX
- **p2:** the watch models only ie/ei. Doubling and soft c/g, two of the three patterns, come up only in one crammed line, step 5 ("Then the doubling rule and the soft c and g rule"). **Fix:** replace step 5 with two steps:
  - "Doubling: say it. beGIN: the stress is last, so double: beginning. VISit: the stress is first, so do not: visiting."
  - "Soft c or g before -able or -ous: keep the e so it stays soft: notice → noticeable, courage → courageous."
  - Move the teach-it-back line to the oops `why`.
- **p3:** **Fix:** `workout:{say:'Your sentence!', t:'Write one sentence with a word from each pattern: ie/ei, a doubled ending, and -able or -ous.'}`.
- **p7:** every check answer is printed earlier: "weird" (watch step 4 and do 2), "visiting" (the oops and do 1), "courageous" (your 5). **Fix:**
  - check 1 → options `['protein','shield','deceive']`, keyed `protein`;
  - check 2 → "An idea ___ to Benny last night." options `['occurred','occured','ocurred']`;
  - check 3 → "Spring weather is very ___." options `['changeable','changable','chaingeable']`.

### `LANG.USE.L07.01` Formal Voice (upgrade): FIX
- **p3:** **Fix:** `workout:{say:'Your sentence!', t:'Write the closing sentence of a formal letter to the menahel about a class trip.'}`.
- **p4:** your 1 how "Which one would fit in a report?" only repeats the question. **Fix:** "Say it to the menahel. Which word sounds exact and grown-up?"
- **p7 / grade level:** the 3 checks have 2 choices each and are Grade 4 level ("report for school, or a chat with your brother?" repeats LANG.USE.L05.04). None tests the lesson's own skill, keeping the voice in every sentence. **Fix:** check 3 → "Eli's letter: 'Dear Rabbi Rosen, Our class would like to visit the bakery. It would be awesome. We will be very careful.' Which sentence breaks the formal voice?" options `['It would be awesome.','Our class would like to visit the bakery.','We will be very careful.']`. Check 2 → add a third option, "outstanding", and ask "Which word is slang?" with key "awesome".

### `READ.VOC.L07.01` Word Choice (upgrade): pass
- **p3:** **Fix:** `workout:{say:'Your sentence!', t:'Write one sentence about your Shabbos table with two words that make it feel warm.'}`.
- **p6:** good mix of kinds (sort, cloze, match, evidence, tiles). Only point: your 5 sort (praises / puts him down) is off the mood topic. **Fix:** cards `[['glowed',0],['loomed',1],['giggled',0],['shuddered',1]]` with bins "Cheerful mood" / "Tense mood".

### `READ.VOC.L07.05` Thrifty or Stingy?: FIX
- **p2:** the goal names three feelings (positive, neutral, negative), but the watch teaches only positive and negative. Check 3 then asks for the neutral word. **Fix:** watch step 4 → "Same meaning, different feeling. Thrifty is positive, careful is neutral, stingy is negative. The feeling is the connotation."
- **p3:** **Fix:** `workout:{say:'Your sentence!', t:'Write one sentence that praises a friend with a positive word, like confident or curious.'}`.
- **p4:** your 5 how "Think about who you would want to be." is not a method. **Fix:** "Ask: would he be glad or hurt to hear it?"
- **p6:** your 1 tiles "Akiva is / thrifty: / he saves / his allowance." gives no word to choose. Your 4 "Connotation is / the feeling / a word / carries." is a rote 4-tile build. **Fix:** your 1 → `extra:['stingy:']`. Your 4 → a sort with bins Positive / Negative and cards `[['slender',0],['skinny',1],['determined',0],['stubborn',1]]`.
- **p7:** every check reuses a taught word: thrifty/stingy (watch), curious/nosy (do 1), "sure" (your 2 sort). In check 3, "arrogant of the answer" and "nosy of the answer" are not English, so grammar alone gives away "sure". **Fix:**
  - check 1 → "The Beacon ad wants buyers to like the small room. Which word fits?" options `['cozy','cramped','small']`;
  - check 3 → "A plain news line with no strong feeling: 'Moshe ___ the room.'" options `['entered','barged into','glided into']`.
- **p8:** check 2 "Benny asks the printer many questions" makes "the printer" a person. The very next lesson (L07.06, whose bridge is this lesson) keys "The printer refused to work" as personification. **Fix:** "Benny asks the pressman many questions…"

### `READ.VOC.L07.06` The Wind Whispered: FIX
- **p3:** **Fix:** `workout:{say:'Your sentence!', t:'Write one sentence that gives a thing in your house a human action. Make it feel calm or busy.'}`.
- **p6:** your 1 tiles "The tired / old bus / groaned / up the hill." has no extra, so he only puts it in order. Your 4 is a 3-tile method build. **Fix:** your 1 → `extra:['drove']` with how "Pick the human action". Your 4 → a findall `grid:['The door groaned','The door closed','The sun smiled','The sun rose','The kettle sang','The kettle boiled'], find:['The door groaned','The sun smiled','The kettle sang']`.
- **p7:** in check 3, "wild and scary" → "howled" is printed in your 5 ("The wind howled." → "wild"), and your 3 already offers howled. **Fix:** check 3 → "Gavriel wants the sea in his story to feel angry. Which verb fits 'The waves ___ the rocks'?" options `['punched','kissed','touched']`.
- **p8:** in check 1, "The printer refused to work on deadline day." is personification only if the printer is a machine. In L07.05 "the printer" is a man. **Fix:** "The copier refused to work on deadline day."

### `READ.VOC.L07.07` Part and Whole: FIX
- **p3:** **Fix:** `workout:{say:'Your sentence!', t:'Write your own analogy for one relationship and say it as a sentence.'}`.
- **p6:** your 1 tiles "A wheel / is part of / a bike." (3 tiles, one order) and your 4 "Say the first pair / as a sentence, / then test it…" are Grade 1-level builds. Tool/use is in the goal but never sorted. **Fix:**
  - your 1 → cloze "Hammer is to nail as broom is to ___." options `['dust','closet','handle']`, keyed `dust`, how "A hammer is used on a nail. A broom is used on…";
  - your 4 → `{type:'sort', bins:['Part/whole','Tool/use'], cards:[['oven and bake',1],['key and lock',1],['pen and write',1],['keyboard and computer',0],['wing and bird',0],['crust and pie',0]], say:'Sort each pair by its relationship.', how:'Part of, or used to?'}`.

### `READ.VOC.L07.08` Academic Words: FIX
- **p2:** the watch uses evidence, infer, conclude and summarize, but never shows *analyze*. The step "To summarize: clues, then inference, then conclusion" uses summarize for something else. **Fix:** step 4 → "To analyze, he looked at each part: coats, umbrellas, the wet floor." Move "summarize" into a new step 5: "To summarize the story in one line: Akiva saw clues and took an umbrella."
- **p3:** **Fix:** `workout:{say:'Your sentence!', t:'Write one sentence about a science or history lesson that uses evidence and conclude.'}`.
- **p4:** do 1 how "Think of a class where you used it." is not a method. **Fix:** "Ask: break apart? prove? figure out? decide? shorten?"
- **p6:** your 1 "Read the question. / Gather evidence. / Draw a conclusion." and your 4 "The evidence / supports / my conclusion." are 3-tile, one-order builds. **Fix:** your 4 → `w:['The evidence','supports','my conclusion.'], extra:['summarizes','my guess.']`. Your 1 → an evidence tap: "Which sentence is evidence, not a conclusion?" p `['The plant grew 4 cm in a week.','Sunlight helps plants grow.','I think plants like Shabbos candles.']`, a 0.
- **p7:** check 1 ("main points of a long chapter" → summarize) is close to word for word with your 2's card "Give the main points of the chapter." **Fix:** check 1 → "Rabbi Rosen says: 'Tell me in two sentences what the article was about.' What must the boys do?" with the same options.

### `LANG.GRAM.L08.01` Complex Sentences (upgrade): pass
- **p3:** **Fix:** `workout:{say:'Your sentence!', t:'Write one complex sentence about today\'s news story. Start it with although, because or when.'}`.
- **p6:** your 1 tiles builds a 3-chunk sentence whose clause is already marked; the extra "When the paper came out" is good. **Fix:** let him pick the link: `w:['Although the press broke,','the paper','came out on time.'], extra:['Because the press broke,']`.
- **p7:** check 1 (simple / compound / complex) is the same item shape as your 2's evidence tap. **Fix:** check 1 → "Which sentence shows WHY Avi measured twice?" options `['Because the board was expensive, Avi measured twice.','Avi measured twice, and the board was expensive.','Avi measured twice.']`.
- **p8:** check 2's key "When the light turns green, the battery is charged." makes the light the cause. The natural link is the other way round. **Fix:** make all three options start "When the battery is charged…": `'When the battery is charged, the light turns green.'` (key), `'When the battery is charged the light, turns green.'`, `'The battery is charged when, the light turns green.'`.

### `LANG.GRAM.L08.02` Misplaced Modifiers (upgrade): FIX
- **p3:** **Fix:** `workout:{say:'Your sentence!', t:'Write one sentence that starts with an -ing phrase. Put the person doing it right after the comma.'}`.
- **p7:** all 3 checks have 2 choices. Check 2 ("Only Tova knew" vs "Tova only knew") repeats watch step 4 and your 1's match. Check 3's distractor "it is too short" is a throwaway. **Fix:**
  - check 2 → "Which sentence says Gavriel took no other picture?" options `['Gavriel took only one picture.','Only Gavriel took one picture.','Gavriel only, took one picture.']`;
  - check 3 → options `['it sounds like we were barking','it sounds like the dog was watching','it is perfectly clear']`.

Batch 2: 7 of 18 pass; URGENT: 0


---

## Batch 3 · G, part 3 (incl. the 10 rebuilt Grade 6–8 lessons)

Source: lesson data in `src/CoreDataG3/G4/G7/G8/G9.html` and `src/CoreDataGH1.html` (TLCORE.upgrade; old checks from `packs/ReadMore.html`, `packs/HowToDo3.html`, converted by `packs/KindsMore.html` TL_OFFTAP), plus every check in `batch3.json` and the engine dump. Fresh reviewer; every key checked by hand.

Points: 1 goal · 2 teaching · 3 progression · 4 thinking steps · 5 mistake work · 6 variety and age fit · 7 taught then asked · 8 correct and clear · 9 warm.

| Lesson | Name | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | Fun | Grade level | Result |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `LANG.MECH.L08.01` | Coordinate Adjectives | 5 | 5 | 4 | 5 | 5 | 3 | 4 | 5 | 5 | 3 | ok | **✗ fix** |
| `LANG.MECH.L08.02` | Spell It Right 7 | 5 | 4 | 4 | 4 | 5 | 4 | 3 | 5 | 5 | 3 | ok | **✗ fix** |
| `LANG.SENT.L08.02` | Sharpen the Sentence | 5 | 5 | 4 | 4 | 5 | 3 | 3 | 4 | 5 | 3 | ok | **✗ fix** |
| `LANG.USE.L08.01` | Cut the Clutter (rebuilt) | 5 | 5 | 4 | 4 | 5 | 4 | 2 | 5 | 5 | 4 | ok (checks too easy) | **✗ fix** |
| `READ.VOC.L08.01` | Beyond Literal (rebuilt) | 5 | 5 | 4 | 5 | 5 | 5 | 5 | 3 | 5 | 4 | ok | **✗ fix** |
| `READ.VOC.L08.02` | Context Master (rebuilt) | 5 | 5 | 4 | 5 | 5 | 4 | 5 | 5 | 5 | 4 | ok | ✓ pass |
| `READ.VOC.L08.05` | Allusions | 5 | 5 | 4 | 4 | 4 | 3 | 3 | 3 | 5 | 4 | ok | **✗ fix** |
| `READ.VOC.L08.06` | Refined, Polite, Respectful | 5 | 5 | 4 | 5 | 5 | 3 | 3 | 5 | 5 | 3 | ok | **✗ fix** |
| `READ.VOC.L08.07` | Analogy Ladder | 5 | 5 | 4 | 5 | 5 | 3 | 5 | 5 | 5 | 3 | **too easy** | **✗ fix** |
| `READ.VOC.L08.08` | Academic Words 7 | 5 | 5 | 4 | 5 | 5 | 3 | 4 | 5 | 5 | 3 | ok | **✗ fix** |
| `LANG.MECH.L09.03` | Spell It Right 8 | 5 | 5 | 4 | 4 | 5 | 4 | 4 | 5 | 5 | 3 | ok | ✓ pass |
| `READ.VOC.L09.01` | Shades of Meaning (rebuilt) | 5 | 5 | 4 | 5 | 5 | 5 | 3 | 5 | 5 | 4 | ok | **✗ fix** |
| `READ.VOC.L09.02` | Ced, Cede: Go | 4 | 5 | 4 | 4 | 5 | 3 | 4 | 5 | 5 | 3 | ok | **✗ fix** |
| `READ.VOC.L09.03` | Clue Strategies | 5 | 5 | 4 | 5 | 5 | 3 | 4 | 4 | 5 | 3 | ok | **✗ fix** |
| `READ.VOC.L09.04` | Irony and Puns | 5 | 5 | 4 | 5 | 5 | 3 | 4 | 4 | 5 | 4 | ok | **✗ fix** |
| `READ.VOC.L09.05` | Firm or Bullheaded? | 5 | 5 | 4 | 5 | 5 | 3 | 3 | 5 | 5 | 3 | **too easy** | **✗ fix** |
| `READ.VOC.L09.06` | Academic Words 8 | 5 | 4 | 4 | 5 | 5 | 3 | 4 | 5 | 5 | 3 | ok | **✗ fix** |

### URGENT (a boy can be marked wrong for a right answer)
1. `READ.VOC.L08.05` do 2 (sort): the card "A coat of many colors means a very colorful coat." is keyed **Right**. As an allusion it points to Yosef (a favorite son's gift that stirs jealousy). A boy who uses the lesson's own rule (oops: "An allusion points to the story") taps Mistake and is marked wrong, and the card teaches the literal reading the lesson warns against. **Fix:** `["A coat of many colors means a gift that shows one son is the favorite.", 0]`.
2. `READ.VOC.L08.01` Show me check 3 ("Pesach sentence… What kind of figurative language is this?", passage "Dovid was as busy as a bee", options idiom / metaphor / simile, key simile). Dictionaries (e.g. Cambridge) list "(as) busy as a bee" as an **idiom**, so a boy who knows the saying can tap idiom and be marked wrong. **Fix** (in `packs/HowToDo3.html`, plus its `TL_PACKS` line): passage "The week before Pesach, Dovid zipped around the kitchen like a wind-up toy." (still keyed simile).

No Divine Name, no girls or women in any picture, no other religions' symbols, no non-kosher food, and the word "bite" does not appear on a boy screen. (FYI, not scored down: in `READ.VOC.L09.01` check 3 the pack's TL_READ_NAMES3 swap shows "Batya … notice her" in a boys' check. That follows the HoS 2026-11-14 names decision.)

### Across the batch (point 6)
Ten new lessons (`LANG.SENT.L08.02`, `READ.VOC.L08.05–.08`, `READ.VOC.L09.02–.06`) all have the same 7-slot shape: do = match, sort(Mistake) · your = tiles, sort, cloze, tiles, match. In most of them, both tiles are 3–4 chunks with no extra tile, so the boy orders a sentence he has already read and never chooses anything. This is the "same shape every lesson" problem from Round 1, now with one cloze added, and it is too easy for Grades 7–8. Each lesson below has a copy-ready swap. Point 3 is 4 everywhere: no lesson ends with the boy's own sentence (the G map's sentence workout). The fix is the same `workout` line as in R1.

---

### `LANG.MECH.L08.01` Coordinate Adjectives: FIX
- **p3**: no own sentence. **Fix:** `workout:{say:'Your sentence!', t:'Write one sentence about the Beacon newsroom with two equal describers and a comma between them.'}`
- **p6**: only 3 kinds (sort ×3, match ×2, tiles ×2). In the tiles the comma is already inside the tile "a cold," and the extra tile "cold" (no "a") can never fit, so the build does not test the comma. **Fix:** your 1 `extra:['a cold','windy,']`, your 4 `extra:['a careful','honest,']`. Replace your 5 sort with `{type:'evidence', q:'Which sentence has the comma right?', p:['Yoni wore a dark, blue coat.','Yoni met a kind, patient rebbe.','Yoni saw two, small boys.'], a:1, look:'a pair that passes both tests', say:'Tap the sentence with the comma right.', how:'Try and between them, then switch them.'}`
- **p7**: check 3 options "no: never put a comma between adjectives" / "no: warm is a color": only one choice says yes, and it gives its own reason. **Fix:** `o:['yes: "soft and warm" works, and they switch','no: soft tells about warm, like dark blue','no: a comma never goes before the last describer']`

### `LANG.MECH.L08.02` Spell It Right 7: FIX
- **p2**: affect/effect is never taught on screen (it is only on the teacher board), but check 3 needs "affect is the action". **Fix:** add a watch step `{t:'Affect is the action: noise can affect sleep. Effect is the thing: a strong effect.'}`
- **p3**: **Fix:** `workout:{say:'Your sentence!', t:'Write one sentence about the Beacon with an -able or -ible word and then or than.'}`
- **p4**: your 3 how "After a strong, you need a noun: effect." gives the answer. **Fix:** `how:'After "a strong" you need a thing, a noun. Which word is the thing?'`
- **p6**: do 1 and your 5 match "important → importance", "different → difference". The stem alone makes the match, so the boy never chooses the ending. **Fix:** your 5 → `{type:'cloze', t:'Rabbi Rosen thanked the boys for their ___.', o:['patience','patiance','pacience'], a:'patience', say:'Pick the right spelling.', how:'Patient gives the ending.'}`
- **p7**: check 2 "'Different' helps you spell which word?" → "difference" is printed in your 5 (`["different","difference"]`). Check 3 (affect) is not taught (see p2). **Fix:** check 2 → `{q:'"Excellent" helps you spell which word?', o:['excellence','excellance','excelence']}`, plus the watch step above.

### `LANG.SENT.L08.02` Sharpen the Sentence: FIX
- **p3**: **Fix:** `workout:{say:'Your sentence!', t:'Write one sentence about today\'s text with a strong verb and no empty words.'}`
- **p4**: how lines "One strong verb." / "Show the action." are labels, not a method. **Fix:** your 3 `how:'Picture Benny. Which verb lets you see how he moved? Went and was could be anything.'`
- **p6**: the batch shape, with 3-chunk tiles ("The editors / debated / the headline." + 1 extra). It also reuses Cut the Clutter (`LANG.USE.L08.01`, the bridge): "went quickly → sprinted", "made a decision → decided", "really/very". **Fix:** do 1 pairs → `[['looked quickly','glanced'],['walked heavily','stomped'],['ate fast','gulped']]`. Your 4 → `{type:'evidence', q:'Which sentence still needs sharpening?', p:['The rain pounded the roof.','There was a boy who ran to the door.','Akiva grabbed the umbrella.'], a:1, look:'There was, or a weak verb', say:'Tap the sentence to sharpen.', how:'Look for There was or an empty word.'}`
- **p7**: check 2 key "really" is the empty word in watch step 2 and your 2. Check 3 distractors 'add "really"' / 'cut "shul"' are throwaways. **Fix:** check 2 → `{q:'Which version is sharpest?', o:["The rebbe praised Akiva's essay.","There was praise from the rebbe for Akiva's essay.","The rebbe gave really nice praise to Akiva's essay."]}`. Check 3 → `{q:'Sharpen: "There were three boys who swept the shul."', o:['Three boys swept the shul.','There were three boys, and they swept the shul.','There were three boys who really swept the shul.']}`
- **p8**: check 1 "Replace the weak verb" also lets "walked" replace "went" ("Yoni walked slowly…"). **Fix:** `q:'Replace "went slowly" with one strong verb: "Yoni went slowly through the dark archive."'`

### `LANG.USE.L08.01` Cut the Clutter (rebuilt): FIX
- **p3**: **Fix:** `workout:{say:'Your sentence!', t:'Write one sentence about the Beacon, then cut it to half the words.'}`
- **p4**: your 2 how "Made a decision = decided." gives the answer. **Fix:** `how:'Look for a noun phrase one verb could replace, like gave help → helped.'`
- **p6**: your 1 ("Eli ___ across the field", sprinted) is the same item as Sharpen the Sentence's your 3 and oops. **Fix:** `{type:'cloze', t:'Eli ___ the ball over the fence.', o:['hurled','threw very hard','sent with force'], a:'hurled', …}`
- **p7**: all three Show me checks have **2 choices**, and the question names both ("Final end, or happy end?", "Stared, or saw?"). Check 3 ("The game was very, really, super exciting in every single way.") is a Grade 2 contrast. **Fix** (pack override at `packs/ReadMore.html` ~line 5659, plus its `TL_PACKS` line): `{q:'Which phrase repeats itself?', o:['unexpected surprise','sudden storm','early start']}`, `{q:'Which one verb can replace "looked at for a long time"?', o:['stared','saw','glanced']}`, `{q:'Which sentence is sharpest?', o:['Our class finished the masechta.','Our class reached the final end of the masechta.','Our class made a completion of the masechta.']}`

### `READ.VOC.L08.01` Beyond Literal (rebuilt): FIX
- **p8**: URGENT 2 above (busy as a bee = idiom too).
- **p3**: **Fix:** `workout:{say:'Your sentence!', t:'Write one sentence about deadline night with a figure of speech, then name its kind.'}`

### `READ.VOC.L08.02` Context Master (rebuilt): pass
- **p3**: **Fix:** `workout:{say:'Your sentence!', t:'Write a sentence with a hard word and a clue (definition, example or contrast) that unlocks it.'}`
- **p6**: check 1 word TIMID and your 5 cards INSTRUMENTS / FRUITS are Grade 3 words. **Fix:** your 5 cards `['UTENSILS such as forks and ladles',1]`, `['a TRIBUTARY, a stream that feeds a river',0]`. Check 1 → DIFFIDENT, same sentence, `o:['shy and unsure of himself','loud and bold','very tall']`.

### `READ.VOC.L08.05` Allusions: FIX
- **p8 / p5**: URGENT 1 above (coat of many colors keyed Right in the Mistake Detective).
- **p3**: **Fix:** `workout:{say:'Your sentence!', t:'Write one sentence about the Beacon team that uses one of today\'s allusions.'}`
- **p4**: your 3 how "A huge, long job." is the meaning of the keyed choice. **Fix:** `how:'Which story is famous for a giant job that took years?'`
- **p6**: the batch shape. Your 4 tiles "Rabbi Rosen / has / the patience / of Hillel." (no extra) copies the oops sentence. Your 5 match "a Dovid and Golyas match → Dovid" is solved by the name inside the phrase. The whole lesson uses only 4 allusions. **Fix:** your 4 → `{type:'cloze', t:'Moshe answered every hard question in the contest. Rebbe smiled: "You have the wisdom of ___."', o:['Shlomo','Golyas','Noach'], a:'Shlomo', say:'Pick the famous name.', how:'Which king is famous for wisdom?'}`
- **p7**: Show me reuses the 3 drilled allusions. Check 3 (giant model → "an ark-sized project") is your 3 (cleaning shul → "an ark-sized project") again. **Fix:** check 3 → `{q:'Akiva ended a fight between two friends with a fair, clever answer. Which allusion fits?', o:['the wisdom of Shlomo','an ark-sized project','a Dovid and Golyas match']}` (once your 4 teaches Shlomo).

### `READ.VOC.L08.06` Refined, Polite, Respectful: FIX
- **p3**: **Fix:** `workout:{say:'Your sentence!', t:'Write one fair, neutral sentence about a Beacon event, then one that praises it.'}`
- **p6**: the batch shape. Your 1 "Denotation is / the dictionary / meaning / of a word." and your 4 "The guests / admired / Zeidy's / refined manners." have no extra tile: he never chooses a word. **Fix:** your 4 `extra:['stuffy manners.']`. Your 1 → `{type:'evidence', q:'Which sentence makes Zeidy sound good?', p:['Zeidy is stubborn about learning every night.','Zeidy is devoted to learning every night.','Zeidy is fixated on learning every night.'], a:1, look:'a positive word', say:'Tap the kind sentence.', how:'Same fact. Which word praises?'}`
- **p7**: check 1 is crowd/mob (watch, do 1, do 2, your 2, your 3). Check 2 is determined/stubborn (do 1, your 2). **Fix:** check 1 → `{q:'Benny writes "The house was small." Yoni writes "The house was cramped." What is the same in both words?', o:['the denotation','the connotation','the feeling']}`. Check 2 → `{q:'Akiva writes a tribute to Zeidy, who learned every night for 60 years. Which word fits best?', o:['devoted','obsessed','fanatical']}`

### `READ.VOC.L08.07` Analogy Ladder: FIX
- **p3**: **Fix:** `workout:{say:'Your sentence!', t:'Write your own antonym analogy, then name the relationship.'}`
- **p6 (too easy)**: do 1 synonym match (enormous/huge, rapid/fast) and your 2 synonym/antonym sort are Grade 4 work (`READ.VOC.L05.01` Same and Opposite). Grade 6 `READ.VOC.L07.07` already did harder analogies (part/whole, cause). Your 1 and your 4 tiles have no extra. **Fix:** do 1 pairs → `[['candid','frank'],['meager','scant'],['benevolent','kind'],['futile','useless']]`. Your 4 → `{type:'cloze', t:'Meager is to plentiful as futile is to ___.', o:['useful','useless','hopeless'], a:'useful', say:'Keep the relationship.', how:'Meager and plentiful are opposites.'}`

### `READ.VOC.L08.08` Academic Words 7: FIX
- **p3**: **Fix:** `workout:{say:'Your sentence!', t:'Write a claim about the Beacon, one relevant piece of evidence, and a "This shows" sentence.'}`
- **p6**: the batch shape. Your 1 tiles have 3 chunks and no extra. Your 4 tiles and your 5 match copy the watch word for word ("Some say bins cost too much", "We toss 40 bottles a week"). **Fix:** your 5 pairs → `[['The shul should start a youth minyan.','claim'],['Thirty boys asked for one.','evidence'],['This shows boys want to daven together.','reasoning'],['Some say there is no room.','counterclaim']]`. Your 1 → `{type:'evidence', q:'Claim: The Beacon should add a puzzle page. Which sentence is reasoning?', p:['Forty boys asked for puzzles.','This shows puzzles would bring in readers.','Mr. Gross likes blue ink.'], a:1, look:'"This shows"', say:'Tap the reasoning.', how:'Reasoning explains how the evidence proves the claim.'}`
- **p7**: check 3 distractor "it is too long" is a throwaway. **Fix:** `o:['it is not relevant','it is a counterclaim','it is reasoning, not evidence']`

### `LANG.MECH.L09.03` Spell It Right 8: pass
- **p3**: **Fix:** `workout:{say:'Your sentence!', t:'Write one sentence about the Beacon with misspell, unnecessary or dissatisfied.'}`
- **p4**: your 3 how "Two r's and two s's." spells the answer. **Fix:** `how:'Trick: Really Red, So Shy. Count the r\'s and s\'s.'`
- **p6**: your 5 match "im + mature → immature" is solved by the stem. **Fix:** → `{type:'cloze', t:'The two headlines were ___: one long, one short.', o:['dissimilar','disimilar','dissimiler'], a:'dissimilar', say:'Pick the right spelling.', how:'dis + similar: keep both s\'s.'}`
- **p7**: all three check words (separate, accommodate, misspelled) are spelled out earlier. **Fix:** check 1 → `{q:'"The typo went ___ until Thursday." Which spelling is right?', o:['unnoticed','unoticed','unnotticed']}`

### `READ.VOC.L09.01` Shades of Meaning (rebuilt): FIX
- **p7**: the pack's TL_OFFTAP (`packs/KindsMore.html` ~line 8082) turns the plain "thrifty" check into "Match each question to its answer." Its partners can only be the two other plain items: the shofar/matzah analogy (→ Pesach, a Grade 2 item) and the quill analogy (→ sofer). I worked this out from the code; I did not play it. So check 1 shows "…a quill is to a ____ → sofer", which is check 2 word for word, and "thrifty" has no wrong choice beside it. **Fix** (`packs/ReadMore.html` `READ.VOC.L09.01` check 1, plus its `TL_PACKS` line; a picture text keeps it from being converted): `{q:'Which word fits best?', pic:'At 80, Zeidy still hikes and laughs like a boy. Tatty smiles and calls him ____.', o:['youthful','childish','immature'], h:'Tatty is praising him. Which word is a compliment?'}`
- **p3**: **Fix:** `workout:{say:'Your sentence!', t:'Write one sentence praising someone, using the exact shade you want.'}`

### `READ.VOC.L09.02` Ced, Cede: Go: FIX
- **p1**: the goal names "cess" (process, excess), but no activity or check uses it. **Fix:** your 4 → `{type:'parts', parts:['ex','cess'], extra:['ceed'], mean:'too much; going beyond', roles:['prefix','root'], say:'Build the word that means too much.', how:'ex = beyond, cess = go.'}`
- **p3**: **Fix:** `workout:{say:'Your sentence!', t:'Write one sentence about the Beacon with precede, exceed or concede.'}`
- **p4**: your 3 how "Concede = give in." gives the answer. **Fix:** `how:'Con = with, cede = yield. What do you do when you cannot win?'`
- **p6**: the batch shape. Your 1 "The water / began to / recede / after the storm." and your 4 "to go / beyond / a limit" have no extra: he never chooses the root word. **Fix:** your 1 `extra:['precede','exceed']`, and your 4 as in p1.
- **p7**: check 1 key "comes before" repeats do 1 "precede → go before". **Fix:** `{q:'"Mincha precedes Maariv." Which comes first?', o:['Mincha','Maariv','both at once']}`

### `READ.VOC.L09.03` Clue Strategies: FIX
- **p3**: **Fix:** `workout:{say:'Your sentence!', t:'Pick a hard word from your reading. Write the tool you used and the meaning you verified.'}`
- **p6**: the batch shape. Your 4 "The soup / was lukewarm, / neither hot nor cold." has no extra, so he never tests a guess. **Fix:** `{type:'evidence', q:'Which guess for TEPID passes the test?', p:['The soup was boiling, neither hot nor cold.','The soup was lukewarm, neither hot nor cold.','The soup was frozen, neither hot nor cold.'], a:1, look:'the one that still makes sense', say:'Test each guess.', how:'Put the guess in the sentence. Does it still make sense?'}`
- **p7**: check 3 distractors "pick a new word" / "stop reading" are throwaways. **Fix:** `o:['verify it in the sentence and a dictionary','use it in his essay right away','skip the rest of the paragraph']`
- **p8**: your 5 says "Match each word to the meaning you worked out", but "elated" and "inaccurate" never appear earlier. **Fix:** pairs → `[['tepid','lukewarm'],['unavoidable','cannot be avoided'],['refillable','can be filled again']]`

### `READ.VOC.L09.04` Irony and Puns: FIX
- **p3**: **Fix:** `workout:{say:'Your sentence!', t:'Write one line of verbal irony a Beacon boy might say on a rainy trip day.'}`
- **p6**: the batch shape. Your 2 sort repeats 3 of do 2's 4 cards (bus breakdown, math book, calendar). Your 1 and your 4 tiles have no extra. **Fix:** your 2 cards → `[['After a 3-hour wait, Akiva said, "What a short line!"',0],['The bicycle could not stand up: it was two-tired.',1],['Seeing the messy room, Tatty said, "So neat!"',0],['The baker quit: he could not make enough dough.',1]]`
- **p7**: checks 1 and 3 both test irony, and the third choices ("a definition clue", "not a joke at all") are throwaways, so each is close to a 2-way guess. **Fix:** check 1 `o:['verbal irony','a pun','a simile']`
- **p8**: your 1 "Build why the dough joke is a pun", but the dough joke is never shown. **Fix:** add `q:'"The baker quit: he could not make enough dough."'` to your 1.

### `READ.VOC.L09.05` Firm or Bullheaded?: FIX
- **p3**: **Fix:** `workout:{say:'Your sentence!', t:'Write one sentence that makes a plan sound good, then rewrite it with neutral words.'}`
- **p6 (too easy)**: thrifty/cheap, confident/arrogant and curious/nosy (do 1, do 2, your 2, oops) are Grade 6 `READ.VOC.L07.05` "Thrifty or Stingy?" again. The boy never reads an argument. Your 1 and your 4 tiles have no extra. **Fix:** do 1 pairs → `[['steadfast','obstinate'],['frugal','miserly'],['assertive','pushy']]`. Your 4 → `{type:'evidence', q:'Which sentence is loaded to make the other side sound bad?', p:['The council voted 5 to 2 for the new park.','Their reckless scheme will waste our money.','The park will cost $40,000.'], a:1, look:'a word with a strong bad feeling', say:'Tap the loaded sentence.', how:'Facts or feelings?'}`
- **p7**: check 3 key "What are the facts under the feelings?" is watch step 4 word for word. Check 2 bold/reckless is the do 2 pair. **Fix:** check 3 → `{q:'"Their bullheaded editor refused our plan." What is the plain fact?', o:['The editor did not agree to the plan.','The editor is a bad person.','The plan was perfect.']}`. Check 2 `o:['daring','prudent','rash']`, key rash.

### `READ.VOC.L09.06` Academic Words 8: FIX
- **p2**: paraphrase is taught only in the oops and the chavrusa line. **Fix:** add a watch step `{t:'Paraphrase: tell Zeidy\'s story in your own words, and still cite him.'}`
- **p3**: **Fix:** `workout:{say:'Your sentence!', t:'Write one sentence that cites a source and paraphrases what it says.'}`
- **p6**: the batch shape. Your 1 and your 4 tiles have no extra and copy the watch ("According to…", "Both… and…"). **Fix:** your 4 → `{type:'evidence', q:'Which sentence synthesizes two sources?', p:['Zeidy says the shul was rebuilt.','Both Zeidy and the 1952 newspaper say the shul was rebuilt in one year.','The newspaper is old.'], a:1, look:'two sources put together', say:'Tap the synthesis.', how:'Synthesize = put sources together.'}`
- **p7**: check 3 distractors "paraphrased" / "synthesized" are not traits of an article, and the check repeats your 3. **Fix:** `{q:'Which source is most credible for a report on owls?', o:['an article by a bird expert, with facts you can check','a post with no name on it','a friend who saw an owl once']}`

Batch 3: 2 of 17 pass; URGENT: 2


---

