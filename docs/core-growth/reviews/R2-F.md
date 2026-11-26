# Review round 2 · job F · Foundations K–2 (2026-11-26)

Gap B1a (docs/GAP-BOARD.md). Fresh reviewers who wrote none of these lessons scored every F lesson, K–1 game, unit check, little reader and listen-along story live on `origin/main` at `db6e493` that Round 1 did not score: 24 Grade 2 One Bite lessons, 87 K–1 games, 6 unit checks and 37 texts. Each reviewer got the standard, the maps, the lesson data and **every distinct check question the engine can draw** (dumped with `tools/audit/unitpool.js`). Every answer key was checked by hand. Every URGENT line below was then checked again in the code by the builder who wrote this file (it wrote none of the lessons).

**Owner (job F): fix the ✗ items first (any point below 4), then the URGENT lines. Say in your PR which lines it fixes; the next round re-scores them.** The five Round 1 ✗ lessons (`READ.LV.L03.03`, `READ.PHON.L03.06`, `.13`, `.14`, `.15`) are gap B2c and are not scored again here.

Points: 1 goal · 2 teaching · 3 progression · 4 thinking steps · 5 mistake work · 6 variety and age fit · 7 taught then asked · 8 correct and clear · 9 warm. Fun = how exciting a boy would find it (1–5).

## Summary

| Part | Scored | Pass (all 4–5) | % |
|---|---|---|---|
| Grade 2 One Bite lessons (batches 1–2) | 24 | 19 | 79% |
| K–1 games (batches 3–6) | 87 | 65 | 75% |
| Unit checks F.U21–F.U26 | 6 | 0 | 0% |
| Texts (Gr 2 readers, plays, poem; K listen-along; K little readers) | 37 | 34 | 92% |

**Why the unit checks fail:** F.U21–F.U25 have no questions of their own. Every question is a lesson's own Show me question that the boy has already answered, so the check is not cold, and many of them have only 2 choices. F.U26 has 4 questions of its own. Batch 2 has copy-ready questions for every unit.

## URGENT (each one checked again in the code)

| Item | Problem | Fix |
|---|---|---|
| `READ.PHON.L01.25` piece 5 and `READ.PA.L01.15` piece 4 (`src/CoreDataFH1.html` lines 182, 196) | 🦀 crab is not kosher (Family Life rule). | Replace with 🧲 (magnet, short a) in L01.25 and 🐍 (snake, 4 sounds) in L01.15. |
| `READ.PA.L01.15` piece 4 | 🐱 is keyed "3 sounds" (cat). A boy who says "kitty" counts 4 sounds and is marked wrong. | Cards `[['🐍',1],['🚌',0],['🥁',1],['🐟',0],['☀️',0]]`. |
| `READ.PA.L02.20` sort 1 (`CoreDataFH2`) | 🐱 is keyed "one beat". "Kitty" and "kitten" have two beats. | Use 🔑 (key). |
| `READ.FLU.L02.23` match (`CoreDataFH2`) | "friend" goes with 👦👦 and "people" goes with 👥. Two boys are also people. | Use 🤝 for friend. |
| `READ.PA.L01.14` piece 5 (`CoreDataFH1` line 123) | "Big, change the middle to uh" is keyed 🐛, but 🐝 is also a bug. | Use pin → pan: choices 🍳 📌 🖊️, answer 🍳. |
| `READ.PHON.L01.16` piece 4 (`CoreDataFH1`) | 🐸 is keyed fff (frog). Some boys say "toad", which fits neither box. | Use 🔥 (fire). |
| `READ.LIT.L01.02` piece 6 (`CoreDataFH3` line 29) | 😴 is keyed to 🌙, but in the story (`F.LA.K02`) Baby Moishy falls asleep in the sukkah, so 😴–🛖 is also right. | Pairs `[['🌿','🛖'],['🎒','🏫'],['🦉','🌙']]`. |
| Unit checks F.U22, F.U24 (`src/CoreUnits.html` `fromSkill`, line 55) | A lesson question "Build the word for the picture" comes into the unit check without its picture, because a picture-only `pic` is dropped. With no picture, tiles s, p, oo, n also make "snoop" and f, a, c, e also make "cafe", so a boy who builds a real word is marked wrong. Cake, light, horn and rabbit in F.U21–F.U26 also ask about a picture the boy cannot see. | Give each unit its own questions (batch 2), or keep the picture in `fromSkill()` (job T). |

## Rules broken that the tests do not catch (for job T)
- **Spoken lines over 12 words.** A K–1 game speaks the `how` line after every miss (since #547), but `K.err` in `src/CoreK1.html` counts only `say`. Seven `how` lines in batch 3 have 13–16 words; batch 6 lists more. A test should count `how` (and `hear` when it is a sentence).
- **Little readers.** Every word is decodable except *has* and *his*: their s says zzz, which is never taught and is not on the heart-word list, and they appear in 13 of the 18 books. The decodable check F-map section 7 promises (`tests/lib/corefound.js`) does not exist.
- **Cast spelling.** The grandfather is "Zaidy" in `CoreDataF1.html` and `CoreDataF3.html`, but "Zeidy" in `CoreDataFH4.html` and in the cast note.

## What the boy sees (played as a made-up TEST- boy)
`READ.FLU.L03.19` (The Snow Day Fort, a play) was played from start to Level clear, Reader included, at 390 px and at 1366×768: 29 screens, 0 page errors. Pictures: `docs/screens/b1a-r2/phone-READ.FLU.L03.19.jpg` and `chromebook-READ.FLU.L03.19.jpg`.
- **What works:** a clear goal, a 6-step Watch me, a Mistake Detective, a real play to read in the book, "find the line that proves it" in the book, and a How box on every Show me.
- **What is wrong:**
  - "3 IN A ROW!" and "5 STREAK!" banners cover the question on Your turn and Show me (gap B7).
  - Ready check 2 is a 2-choice question.
  - Check 3's answer was shown earlier in the lesson (batch 2).
- **Not played by me:** the K–1 games. They were scored from their data only. The pictures of the K–1 game screens are in #547 (gap A4).

---

## Batch 1 · F Grade 2 One Bite lessons, part 1

Fresh independent reviewer (did not write these lessons). Scored against the lesson data in `src/CoreDataF1.html`, `src/CoreDataF3.html`, `src/CoreDataFH4.html` (BITE watch/oops/do/your, HOWTO lines), the texts `texts/F/F.PO.01`, `F.RT.01`, `F.WR.15`, `F.WR.16`, `F.WR.17`, and every check question the engine can draw (batch file). Every answer key was checked by hand.

Points: 1 goal · 2 teaching · 3 progression · 4 thinking steps · 5 mistake work · 6 variety and age fit · 7 taught then asked · 8 correct and clear · 9 warm. Fun = how exciting a boy would find it (1–5).

| Lesson | Name | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | Fun | Grade level | Result |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `READ.PHON.L03.16` | Helpful Endings | 5 | 5 | 5 | 5 | 5 | 5 | 4 | 5 | 5 | 3 | ok | ✓ pass |
| `READ.PHON.L03.17` | Prefix Peel | 5 | 5 | 5 | 5 | 5 | 5 | 3 | 5 | 5 | 4 | ok | **✗ fix** |
| `READ.FLU.L03.04` | Just-Right Speed | 5 | 4 | 5 | 5 | 5 | 4 | 4 | 5 | 5 | 3 | ok | ✓ pass |
| `READ.PHON.L03.12` | Phone and Photo | 5 | 5 | 5 | 5 | 5 | 5 | 4 | 5 | 5 | 4 | ok | ✓ pass |
| `READ.FLU.L03.02` | Scoop and Read | 5 | 5 | 5 | 5 | 5 | 4 | 3 | 5 | 5 | 3 | ok | **✗ fix** |
| `READ.FLU.L03.03` | Who Is Talking? | 5 | 5 | 5 | 5 | 5 | 5 | 4 | 5 | 5 | 4 | ok | ✓ pass |
| `READ.FLU.L03.05` | Poem Beat | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 4 | 5 | 4 | ok | ✓ pass |
| `READ.FLU.L03.06` | Readers' Theatre | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 4 | ok | ✓ pass |
| `READ.FLU.L03.07` | Fix It As You Go | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 4 | ok | ✓ pass |
| `READ.PHON.L03.18` | Spell It Back | 5 | 4 | 5 | 5 | 5 | 5 | 4 | 5 | 5 | 3 | ok | ✓ pass |
| `WRIT.HAND.L03.01` | Neat Paragraph | 5 | 4 | 4 | 5 | 5 | 3 | 3 | 5 | 5 | 3 | too easy in parts (repeats Grade 1) | **✗ fix** |
| `READ.FLU.L03.08` | Spice at the Store | 5 | 5 | 5 | 5 | 5 | 5 | 4 | 5 | 5 | 4 | ok | ✓ pass |
| `READ.FLU.L03.14` | Ginger in the Cage | 5 | 5 | 5 | 5 | 5 | 5 | 3 | 5 | 5 | 4 | ok | **✗ fix** |
| `READ.FLU.L03.09` | Knots and a Wrapped Gift | 5 | 5 | 5 | 5 | 5 | 5 | 4 | 5 | 5 | 4 | ok | ✓ pass |

URGENT: none. Every answer key was checked by hand, and no check or activity marks a boy wrong for a right answer. No Divine Name. The word "bite" is not on any boy screen (only in code names such as `BITE`). No girls or women appear in emoji or art (Mommy and Chaim's mother are named in story words only, which the cast note allows). All food is kosher, and there are no other religions' symbols.

**Across the batch (small, for job F):** the same cast grandfather is spelled **"Zaidy"** in `CoreDataF1.html` (13 times) and `CoreDataF3.html` (17 times), but **"Zeidy"** in `CoreDataFH4.html` and in the F-map cast note. A boy sees both spellings in one unit. **Fix:** change every `Zaidy` to `Zeidy` in `src/CoreDataF1.html` and `src/CoreDataF3.html`. If a changed string is a HOWTO key, change the matching check `q` too.

## Notes and copy-ready fixes, lesson by lesson

### `READ.PHON.L03.17` Prefix Peel: FIX (a point below 4)
- **p7:** check 2 is `{q:'Read "pretty". Is pre a prefix here?', o:['no, it is a fake prefix','yes, it is a real prefix']}`. This is a 2-choice yes/no a boy can pass by guessing. It is also the same frame and the same two options as do 2 ("Is re a prefix in ready?").
  **Fix:** check 2 becomes `{q:'Which word has a FAKE prefix? Peel off the front.', o:['reason','reload','unzip']}`, with HOWTO q `'Which word has a FAKE prefix? Peel off the front.':'Peel off re or un from each word.\nWhich one leaves no real word?'`. The keys: "reason" peels to "ason" (not a word), "reload" to "load" and "unzip" to "zip" (both real words).

### `READ.FLU.L03.02` Scoop and Read: FIX (a point below 4)
- **p7:** check 2 is `{q:'Is this a good scoop or a broken scoop: "ran up the"?', o:['broken scoop','good scoop']}`. This is a 2-choice guess, and it only labels a scoop. It never asks him to read in scoops.
  **Fix:** `{q:'Which reader scooped it right?', o:['Moishe / ran up the hill / after lunch.','Moishe ran / up the / hill after lunch.','Moishe ran up / the hill after / lunch.']}`, with HOWTO q `'Which reader scooped it right?':'Check every /.\nDoes any / cut a scoop in two?'`.
- **p6:** every activity labels or sorts scoops (sort, evidence, cloze, order, sort, match, evidence). He never hears scooped reading against choppy reading, although the prompt's fluency rule is listen → read along → self-check.
  **Fix:** replace your 1 (cloze) with `{type:'listen', q:'The book says: "The boys ran up the hill after lunch."', hear:'The boys ran. Up the. Hill after lunch.', o:['broken scoops','good scoops','too fast'], a:'broken scoops', say:'Listen to Yanky. How did he scoop it?', how:'Did he pause in the middle of a scoop?'}`.

### `READ.FLU.L03.04` Just-Right Speed: pass
- **p2/p6:** the lesson is about reading speed, but he never hears too fast, too slow or just right. Every step is talk about speed (cloze, evidence, order, findall, sort).
  **Fix:** replace your 1 cloze (`'Read at ___ speed…'`, which recalls the Watch me words) with `{type:'listen', q:'The book says: "We went to the park after school."', hear:'We went park after school.', o:['too fast: he skipped words','too slow','just right'], a:'too fast: he skipped words', say:'Listen to Chaim. How did he read it?', how:'Look at the book line. Did he say every word?'}`.
- **p7:** check 3's answer "slow down for it, then speed back up" is almost the Watch me line "A long new word? Slow down … Then speed back up." It is still applied to a new word (invitation), so this note is minor.
  **Fix (optional):** change the options to `['read it part by part: in-vi-ta-tion','read the rest of the page slowly too','guess it from the first letter']`.

### `READ.PHON.L03.16` Helpful Endings: pass
- **p7:** check 3 `'Read "proudly". What does -ly say at the end?'` (lee) recalls a fact that Watch me said word for word ("-ly says lee"). It does not ask him to read the word.
  **Fix:** `{q:'Read "proudly". Cover the ending. What is the base word?', o:['proud','prod','pride']}`, with HOWTO q `'Read "proudly". Cover the ending. What is the base word?':'Cover -ly with your finger.\nRead the letters that are left.'`.

### `READ.PHON.L03.12` Phone and Photo: pass
- **p7:** check 1 `'Read "photograph". What does the ph say?'` has the same options (fff/puh/huh) and the same answer as your 1 ("What should ph say?"). None of the three checks tests the up + hill split the lesson teaches. Check 3 also lists "he", which is not in "xylophone".
  **Fix:** check 3 becomes `{q:'Read "uphold". Do the p and h say fff?', o:['no: up + hold','yes: u + phold','yes: uph + old']}`, with HOWTO q `'Read "uphold". Do the p and h say fff?':'Look for two small words joined together.\nDoes p end one and h start the next?'`.

### `READ.FLU.L03.03` Who Is Talking?: pass
- **p7:** check 3 `'Chaim said, "My shoe is wet." What do the quotation marks show?'` → "the words someone says" recalls a definition that Watch me says word for word ("They hold the words someone says").
  **Fix:** `{q:'Chaim said, "My shoe is wet." Which words did Chaim say?', o:['My shoe is wet.','Chaim said','Chaim said my shoe']}`, with HOWTO q `'Chaim said, "My shoe is wet." Which words did Chaim say?':'Find the quotation marks.\nRead only the words inside them.'`.

### `READ.FLU.L03.05` Poem Beat: pass
- **p8:** check 3 `'In "shining", which part is strong?', o:['shin','ing','both the same']`. The chunk "shin" reads as the word *shin* (short i), but the word says SHY-ning. That can confuse a careful reader. The key is still the only sensible answer.
  **Fix:** `{q:'Clap "Shabbos candles shining bright". In "candles", which part is strong?', o:['can','dles','both the same']}`, with HOWTO q `'…In "candles", which part is strong?':'Say candles slowly and clap it.\nWhich part do you say louder?'`.

### `READ.FLU.L03.06` Readers' Theatre: pass. No changes. The cue, the ( ) words and the play text all line up, and every check uses a new script.

### `READ.FLU.L03.07` Fix It As You Go: pass. No changes needed. One small idea: do 1 rereads `F.RT.01`, which has no misread words to catch. A version of the play with 2 look-alike swaps would make the read step itself practise the skill.

### `READ.PHON.L03.18` Spell It Back: pass
- **p2:** Watch me runs 5 patterns in 5 one-line steps (tch, double, y→i, kn, soft c). It never shows a whole sentence being spelled before do 1 asks him to build "Zeidy will fix the clock."
  **Fix:** add a step after the city step: `{t:'I hear: Zeidy will fix the clock. Capital Z, ck in clock, a period.', m:{type:'tiles', w:['Zeidy','will','fix','the','clock.'], hi:[4]}}`.
- **p7:** check 3 `'Two little ___ slept in the box. (more than one puppy)'` with puppies/puppys/puppyes copies the sentence frame and the option pattern of your 4 (`'Two little ___ slept in the crib.'` babies/babys/babyes).
  **Fix:** `{q:'Pick the right spelling. Mendy picked three ripe ___ for Shabbos. (more than one cherry)', o:['cherries','cherrys','cherryes']}`, with HOWTO q `'…(more than one cherry)':'Cherry ends in y after a consonant.\nWhat happens to the y?'`.

### `WRIT.HAND.L03.01` Neat Paragraph: FIX (a point below 4)
- **p6 (age fit):** the map row is "Neat writing: a whole paragraph" (Grade 2). But your 1 (tall/small/tail sort), your 5 (find the tail letters) and both traces repeat Grade 1 `WRIT.HAND.L02.01` Neat Lines and `L02.02` Spaces. Only the indent and the whole-word rule are new.
  **Fix:** replace your 1 with a paragraph-level sort: `{type:'sort', bins:['Fix it','Fine'], cards:[['the second line is indented too',0],['the first line is indented',1],['each sentence starts a new line',0],['the next sentence goes right after the period',1],['half a word at the end of a line',0],['one finger space between words',1]], say:'A paragraph: fix it, or fine?', how:'Only the first line is indented. Sentences follow each other on the line.'}`. Then add a Watch me step after the finger-space step: `{t:'The next sentence goes right after the period, on the same line.'}`.
- **p7:** check 1 `'Naftali is starting a new paragraph. Where does his first word go?'` → "in a bit from the left edge" is the Watch me line word for word ("I start in a bit from the left edge"). Check 3 (`"suk-"` / `"kah"`) is the same mistake as do 2 (`"Shab"` / `"bos"`). Two of three checks are not cold.
  **Fix:** check 1 becomes `{q:'Mendy wrote "jump" with the j and the p sitting on the line, like the u and m. What should he fix?', o:['make the j and p tails dip below the line','make the u and m taller','nothing, it is neat']}`, with HOWTO q `'…What should he fix?':'Which letters in jump have tails?\nWhere do tails go?'`.
- **p2/p3:** he never builds or writes a paragraph on screen. The lesson ends on an easy letter hunt, and only the Done line sends him to copy on paper. With the sort above, the lesson climbs to paragraph rules. Also make the last item a challenge at paragraph level by changing your 5 to `{type:'evidence', q:'Which paragraph follows the rules?', p:['Dovid ate lunch. / Then he helped Zeidy.','Dovid ate lunch. Then he helped Zeidy.','Dovid ate lunch. Then he hel- / ped Zeidy.'], a:1, look:'sentences on the same line, whole words', say:'Challenge! Tap the neat paragraph.', how:'Sentences follow each other. No word is split.'}`. Here "/" marks a new line, and the Watch me step above teaches it.

### `READ.FLU.L03.14` Ginger in the Cage: FIX (a point below 4)
- **p7:** all three checks are keyed **j** (large, magic, gym). A boy who taps j every time passes, so the check cannot tell whether he knows when g stays hard.
  **Fix:** check 1 becomes `{q:'Read: "Shimon ate a plum in the garden." What does the g in garden say?', o:['g as in go','j','no sound']}`. The existing RH matcher (`/the [cg] in /`) already gives it the right how line. Do not use *gift* or *get*: they break the "g before e or i" rule he was taught.

### `READ.FLU.L03.08` Spice at the Store: pass
- **p7:** the goal is "…and prove what happened", but all 3 checks only ask what the c says. The third option, "ch", is never likely, so each check is close to a 2-way guess.
  **Fix:** check 2 becomes `{q:'Read: "Yanky needed a pencil. His old one broke in half." Why did Yanky need a pencil?', o:['his old one broke','he lost it','he wanted a red one']}`. Keep the juice (sss) and count (k) checks.

### `READ.FLU.L03.09` Knots and a Wrapped Gift: pass
- **p7:** two of three checks are kn → k (knife, knob), and no check covers mb, a pattern the lesson teaches.
  **Fix:** check 3 becomes `{q:'Read: "Avi\'s cold fingers felt numb." Which letter in numb is quiet?', o:['b','m','n']}`.

Batch 1: 10 of 14 pass; URGENT: 0


---

## Batch 2 · F Grade 2 One Bite lessons part 2, F unit checks F.U21–F.U26, Grade 2 texts

Fresh, independent reviewer (did not write these). Scored against the lesson data in `src/CoreDataFH4.html` (the One Bite `do`/`your`, watch, oops and Show me checks), every check question the engine can draw, the unit-check pools (`src/CoreUnits.html` `build()` / `fromSkill()`), and the texts in `texts/F/`. Every answer key was checked by hand.

Points: 1 goal · 2 teaching · 3 progression · 4 thinking steps · 5 mistake work · 6 variety and age fit · 7 taught then asked · 8 correct and clear · 9 warm. Unit checks: points 2, 4 and 5 do not apply to a check ("–"). Texts: only points 1, 6, 8, 9 and Fun.

| Lesson | Name | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | Fun | Grade level | Result |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `READ.FLU.L03.15` | The Photo Contest | 5 | 5 | 5 | 5 | 5 | 4 | 4 | 5 | 5 | 4 | ok | ✓ pass |
| `READ.FLU.L03.10` | Treasure in the Garden | 5 | 5 | 5 | 4 | 5 | 4 | 4 | 4 | 5 | 4 | ok | ✓ pass |
| `READ.FLU.L03.11` | Baking Day | 5 | 5 | 5 | 5 | 5 | 4 | 4 | 5 | 5 | 4 | ok | ✓ pass |
| `READ.FLU.L03.16` | The Running Race | 5 | 5 | 5 | 5 | 5 | 4 | 4 | 5 | 5 | 4 | ok | ✓ pass |
| `READ.FLU.L03.12` | Berries for the Babies | 5 | 5 | 5 | 5 | 5 | 4 | 4 | 4 | 5 | 4 | ok | ✓ pass |
| `READ.FLU.L03.17` | The Helpful Club | 5 | 5 | 5 | 5 | 5 | 4 | 4 | 5 | 5 | 3 | ok | ✓ pass |
| `READ.FLU.L03.13` | Unpack and Repack | 5 | 5 | 5 | 5 | 5 | 4 | 5 | 4 | 5 | 4 | ok | ✓ pass |
| `READ.FLU.L03.18` | Theatre: The Lost Siddur | 5 | 5 | 5 | 5 | 5 | 5 | 4 | 5 | 5 | 5 | ok | ✓ pass |
| `READ.FLU.L03.19` | Theatre: The Snow Day Fort | 5 | 5 | 5 | 5 | 5 | 5 | 3 | 5 | 5 | 5 | ok | **✗ fix** |
| `READ.FLU.L03.20` | The Club Fair | 5 | 5 | 5 | 5 | 5 | 4 | 4 | 4 | 5 | 4 | ok | ✓ pass |
| `F.U21` (unit check) | Syllables and Long Vowels | 5 | – | 4 | – | – | 4 | 2 | 4 | 5 | 3 | ok | **✗ fix** |
| `F.U22` (unit check) | Vowel Teams 2 | 5 | – | 4 | – | – | 4 | 2 | 2 | 5 | 3 | ok | **✗ fix** |
| `F.U23` (unit check) | Bossy R and Tricky Endings | 5 | – | 4 | – | – | 4 | 2 | 4 | 5 | 3 | ok | **✗ fix** |
| `F.U24` (unit check) | Soft Letters and Quiet Letters | 5 | – | 4 | – | – | 4 | 2 | 2 | 5 | 3 | ok | **✗ fix** |
| `F.U25` (unit check) | Endings That Change the Word | 5 | – | 4 | – | – | 4 | 2 | 5 | 5 | 3 | ok | **✗ fix** |
| `F.U26` (unit check) | Poems, Plays and Spelling | 5 | – | 4 | – | – | 5 | 3 | 4 | 5 | 4 | ok | **✗ fix** |
| `F.WR.15` (text) | Spice at the Corner Store | 5 | – | – | – | – | 5 | – | 5 | 5 | 3 | ok | ✓ pass |
| `F.WR.16` (text) | Ginger in the Cage | 5 | – | – | – | – | 5 | – | 5 | 5 | 4 | ok | ✓ pass |
| `F.WR.17` (text) | Knots, Lambs and a Wrapped Gift | 5 | – | – | – | – | 5 | – | 5 | 5 | 3 | ok | ✓ pass |
| `F.WR.18` (text) | The Photo Contest | 5 | – | – | – | – | 5 | – | 5 | 5 | 4 | ok | ✓ pass |
| `F.WR.19` (text) | The Gem in the Garden | 5 | – | – | – | – | 5 | – | 5 | 5 | 4 | ok | ✓ pass |
| `F.WR.20` (text) | Baking Day | 5 | – | – | – | – | 5 | – | 5 | 5 | 4 | ok | ✓ pass |
| `F.WR.21` (text) | The Running Race | 5 | – | – | – | – | 5 | – | 5 | 5 | 4 | ok | ✓ pass |
| `F.WR.22` (text) | Berries for the Babies | 5 | – | – | – | – | 5 | – | 5 | 5 | 4 | ok | ✓ pass |
| `F.WR.23` (text) | The Helpful Club | 5 | – | – | – | – | 5 | – | 5 | 5 | 3 | ok | ✓ pass |
| `F.WR.24` (text) | Unpack and Repack | 5 | – | – | – | – | 5 | – | 5 | 5 | 4 | ok | ✓ pass |
| `F.WR.25` (text) | The Club Fair | 5 | – | – | – | – | 5 | – | 4 | 5 | 4 | ok | ✓ pass |
| `F.RT.01` (play) | The Clock That Stopped | 5 | – | – | – | – | 5 | – | 5 | 5 | 5 | ok | ✓ pass |
| `F.RT.02` (play) | The Lost Siddur | 5 | – | – | – | – | 5 | – | 5 | 5 | 4 | ok | ✓ pass |
| `F.RT.03` (play) | The Snow Day Fort | 5 | – | – | – | – | 5 | – | 5 | 5 | 5 | ok | ✓ pass |
| `F.PO.01` (poem) | Rain on the Sukkah | 5 | – | – | – | – | 5 | – | 5 | 5 | 4 | ok | ✓ pass |

### URGENT: a boy can be marked wrong for a right answer (checked by hand)

| Item | Problem | Fix |
|---|---|---|
| `F.U22` (from `READ.LV.L03.01` check) | "Build the word for the picture. Tap the tiles in order." tiles `s, p, oo, n`. In a unit check the picture is **never shown**: `src/CoreUnits.html` `fromSkill()` sets `p` only when `pic` has letters, so the 🥄 is dropped. With no picture, **s-n-oo-p = "snoop"**, a real word, and it is marked wrong. | Give F.U22 its own items (below), or in `fromSkill()` keep a picture-only pic: `var p = it.p \|\| (it.pic ? String(it.pic) : '');` |
| `F.U24` (from `READ.PHON.L03.03` check) | Same bug: "Build the word for the picture" with tiles `f, a, c, e` and no 🙂 shown. **c-a-f-e = "cafe"** is a real word and is marked wrong. | Same fix as above, plus F.U24's own items (below). |

The same missing picture also hits "Build the word for the picture" in F.U21 (`c a k e`, and the rabbit sentence), F.U22 (`l igh t`), F.U23 and F.U26 (`h or n`). Those have only one real answer, but the boy is asked about a picture he cannot see (point 8).

No Divine Name. No girl or woman in any picture or emoji (mothers appear in words only, which is allowed). No non-kosher food (berries are checked and a brachah is made: lovely). The word "bite" is not on any boy screen.

---

## Notes and copy-ready fixes

**Across the 7 little-reader lessons (point 6):** L03.15, .11, .16, .12, .17, .10, .13 all play the same shape: `read → listen (Mistake Detective) | proof → findall → (one of match/order/sort/parts/storymap) → proof → cloze`. Inside one lesson that is 6 kinds (good), but seven lessons in a row have the same shape (prompt section 5: "no two lessons in a row have the same shape"). Scored 4, not failed. **Fix for the set:** in at least every other reader, swap the second `proof` for a `storymap` (Who / Where / Problem / Solution) or an `order` of story events, and move the `findall` to Do it with me in one of them.

**Across the readers (point 7):** the Show me checks test only the word pattern, never "prove what happened" on a cold text, although every goal says "and prove what happened". Scored 4. The per-lesson fixes below also stop two of the three checks from having the same key.

### `READ.FLU.L03.15` The Photo Contest — pass
- **p6** — the same reader shape (see above). **Fix:** replace your 3 `match` with `{type:'order', steps:['Rabbi Feld tells about the contest.','Naftali takes a photo of Zeidy.','Rabbi Feld puts the photos on the wall.','The boys give the trophy to Zeidy.'], say:'Put the story in order.', how:'What happened first? What happened at the end?'}`
- **p7** — checks 1 and 2 are both "What does the ph in ___ say?" with key `fff`, so a boy who knows only "ph = fff" gets both. **Fix:** check 2 → `{q:'Read: "Avi spoke into the microphone." Which two letters in microphone say fff?', o:['ph','cr','ne']}` (a: ph)

### `READ.FLU.L03.10` Treasure in the Garden — pass
- **p4** — your 3 storymap how: "Tap a card, then its box." That tells him how to tap, not how to think. **Fix:** `how:'Who found it? Where? What did he hope? What was it really?'`
- **p6** — the same reader shape (see above). Fix as above.
- **p7** — the goal is "every pattern from Unit 4", but the three checks test only soft c and quiet letters (no soft g, no ph). **Fix:** check 3 → `{q:'Read: "Avi made a phone call to Zeidy." What does the ph in phone say?', o:['fff','p','h']}` (a: fff). Also, check 2 ("Mendy scraped his knuckle on the fence.") is word for word the `re` question of READ.FLU.L03.09, and `re` 2 ("Yanky sang the alphabet song.") is word for word check 2 of READ.FLU.L03.15. **Fix:** check 2 → `{q:'Read: "Dovid hurt his knee in the garden." Which letter in knee is quiet?', o:['k','n','e']}` (a: k).
- **p8** — storymap card "Problem: Dovid hopes it is a gem." is not a problem. The lesson is named "Treasure in the Garden" but the story he opens is "The Gem in the Garden", and the board activity says "The Gem in the Garden". **Fix:** `cards:['Dovid','the garden','What is the green stone?','It is sea glass, a treasure']`, and rename the lesson "The Gem in the Garden" (or the text, so both match).

### `READ.FLU.L03.11` Baking Day — pass
- **p6** — the same reader shape (see above).
- **p7** — checks 1 and 2 both have the key "dropped the e", and skate, ride and wave were all matched word for word in READ.PHON.L03.13 your 2 the week before. **Fix:** check 2 → `{q:'Read: "Yanky was painting the fence." What happened to the base word paint?', o:['nothing changed','dropped the e','doubled the letter']}` (a: nothing changed; taught in watch step 1, "Rolling: roll + ing. Nothing changed.")

### `READ.FLU.L03.16` The Running Race — pass
- **p6** — the same reader shape (see above).
- **p7** — checks 1 and 2 both have the key "doubled the letter". The base of check 3, *clapping*, sits beside *clapped* in your 3 and in the story. **Fix:** check 2 → `{q:'Read: "The dog was barking at the cat." What happened to the base word bark?', o:['nothing changed','doubled the letter','dropped the e']}` (a: nothing changed); check 3 → `{q:'Read: "Mendy was humming a niggun." What is the base word of humming?', o:['hum','humm','hume']}` (a: hum)

### `READ.FLU.L03.12` Berries for the Babies — pass
- **p6** — the same reader shape (see above).
- **p7** — checks 1 and 2 both have the key "the y changes to i". **Fix:** check 2 → `{q:'Read: "Avi enjoyed the trip." What happened to the base word enjoy?', o:['nothing changed','the y was changed to i','a letter was doubled']}` (a: nothing changed; watch step 4 teaches "a vowel before the y, so it stays").
- **p8** — the choices mix tenses: "the y changes to i" next to "the e was dropped" and "a letter was doubled". **Fix:** in all check and `re` options, write `'the y was changed to i'`.

### `READ.FLU.L03.17` The Helpful Club — pass
- **p6** — the same reader shape (see above).
- **p7** — check 2, "carried the tray carefully … with care": watch step 2 says "Careful: full of care." That is close to giving the answer. **Fix:** check 2 → `{q:'Read: "Shimon spoke kindly to the new boy." How did Shimon speak?', o:['in a kind way','in a mean way','very loudly']}` (a: in a kind way)

### `READ.FLU.L03.13` Unpack and Repack — pass
- **p6** — the same reader shape (see above).
- **p8** — your 4 sort puts `['unlock',0]` in the bin "not", but unlock means *undo* the lock, not "not lock" (watch step 1 itself says "un- means undo"). **Fix:** `['unkind',0]`

### `READ.FLU.L03.18` Theatre: The Lost Siddur — pass
- **p7** — check 3's answer "the name and the ( ) words" is the rule printed in watch step 3 and in the oops *why*. He picks the phrase without doing the skill. **Fix:** `{q:'In a play: "SHIMON: (proudly) I built it myself." What does Shimon say out loud?', o:['I built it myself.','Shimon, proudly, I built it myself.','Proudly, I built it myself.']}` (a: I built it myself.)

### `READ.FLU.L03.19` Theatre: The Snow Day Fort — FIX (a point below 4)
- **p7** — check 3 "Which line should sound the strongest?" with choices `DOVID: (shouting) Me! Me! Me!` / `(quietly) Me too!` / `Me too.`. The same Dovid lines are the oops card and your 4 evidence ("CHAIM: …", "DOVID: (shouting) Me! Me! Me!", "DOVID: (quietly) Me too!"). So the answer was shown word for word twice. The `re` item "(amazed) We did it!" is also the Do-it-with-me Mistake Detective line. **Fix:** check 3 → `{q:'Which line should sound the strongest?', o:['MOISHE: (cheering) Hooray! It snowed!','MOISHE: (calmly) It snowed.','MOISHE: It snowed?']}` (a: the first); `re` 3 → `{q:'Which of Yanky\'s lines should sound the strongest?', o:['YANKY: (excited) Look, a rainbow!','YANKY: (sleepily) Look, a rainbow.','YANKY: Look, a rainbow.']}` (a: the first)

### `READ.FLU.L03.20` The Club Fair — pass
- **p6** — the same reader shape (see above). This one has a storymap, which helps.
- **p7** — *wrapped* (check 1) is word for word watch step 1 of READ.FLU.L03.09 ("Wrapped: the w is quiet."), and *smiled* (check 3) is the oops word of READ.FLU.L03.11.
- **p8** — check 1 "Which letter in wrapped is quiet?" offers `p`. *Wrapped* has a double p that makes one sound, and a boy fresh from "Double It" can defend "one p is quiet". **Fix:** check 1 → `{q:'Read: "Zeidy fixed the clock with a wrench." Which letter in wrench is quiet?', o:['w','r','n']}` (a: w); check 3 → `{q:'Read: "Avi traded maps with Chaim." What happened to the base word trade?', o:['dropped the e','doubled the letter','nothing changed']}` (a: dropped the e)

---

### Unit checks F.U21–F.U25 — FIX (shared problem first)
How they build (`src/CoreUnits.html` `build()`): these units have **no own `items`**, so every question is one of the lesson's own Show me questions, word for word. The boy has already answered each one in that lesson. Many are **2-choice**: every check of PHON.L03.04, .05, .06, .07, .08, .09 and .10, plus 2 of 3 in LV.L03.05, PHON.L03.15 and others. A 10-question check needs 8 right, and a guesser gets half the 2-choice ones. Keys: all verified correct, except the two URGENT picture items.

- **p7 (all five, score 2)** — not cold, and many 2-choice. **Fix:** add own `items` to each unit, one for **every skill and every review skill**. `per()` takes own items first, so the 2-choice lesson questions stop being drawn. All items below have 3 choices, use new words, and each key was checked by hand.
- **p8 (U21, U23: 4; U22, U24: 2)** — "Build the word for the picture" with the picture dropped (URGENT above). The own items fix it for these units. Also fix `fromSkill()` for every other job's units.
- **p3 (4)** — the questions are shuffled, so there is no warm-up. Fine for a boss level.
- **p6 (4)** — almost all `mc`. The items below add `evidence` and `cloze`.

**F.U21** `items:`
```js
{ skill:'READ.PHON.L03.04', type:'evidence', q:'Which word starts with an open part, so the vowel says its name?', p:['ba | by','rab | bit','nap | kin'], a:0, look:'a first part that ends with its vowel', how:'Find the part that ends with a vowel. Open door: the vowel says its name.' },
{ skill:'READ.PHON.L03.01', type:'evidence', q:'Where do you snip "basket"?', p:['ba | sket','bas | ket','bask | et'], a:1, look:'between the two middle consonants', how:'Find the two consonants in the middle. Snip between them.' },
{ skill:'READ.PHON.L03.05', type:'evidence', q:'Read "lemon". Which split makes a real word?', p:['lee | mon','lem | on','lemo | n'], a:1, look:'the split that sounds like a real word', how:'Try the long vowel first. Not a word? Slide the line.' },
{ skill:'READ.PHON.L03.06', type:'evidence', q:'Read "sunshine". Which part has a quiet e?', p:['sun','shine','both parts'], a:1, look:'the part that ends in e', how:'Look at the end of each part. Which one ends in a quiet e?' },
{ skill:'READ.FLU.L03.01', type:'evidence', q:'Which one sounds smooth, like talking?', p:['The. Cat. Sat. On. The. Mat.','The cat sat on the mat.','Thecatsatonthemat.'], a:1, look:'words read together, with spaces', how:'Smooth reading sounds like talking: not word. by. word.' },
{ skill:'READ.LV.L02.01', type:'cloze', t:'Zeidy rode his ___ to shul.', o:['bike','bik','biek'], a:'bike', how:'Long i, like its name? A quiet e at the end.' },
{ skill:'READ.PHON.L02.03', type:'evidence', q:'Read "napkin". Which shows its two parts?', p:['nap | kin','na | pkin','napk | in'], a:0, look:'two small parts you can read', how:'Split between the two middle consonants.' }
```
**F.U22** `items:`
```js
{ skill:'READ.LV.L03.01', type:'cloze', t:'Dovid put on his ___ to go out in the rain.', o:['boots','butes','bots'], a:'boots', how:'The middle sound is oo, like moon.' },
{ skill:'READ.LV.L03.02', type:'cloze', t:'The stars are so ___ tonight.', o:['bright','brite','brit'], a:'bright', how:'Three letters say long i: igh.' },
{ skill:'READ.LV.L03.03', type:'cloze', t:'The cat licked its ___.', o:['paws','pauz','palz'], a:'paws', how:'At the end of a word or before s, spell aw.' },
{ skill:'READ.LV.L03.04', type:'cloze', t:'Avi ___ a picture of the shul.', o:['drew','drue','droo'], a:'drew', how:'At the end of this word, oo is spelled ew.' },
{ skill:'READ.LV.L03.05', type:'evidence', q:'Which split keeps the vowel team together?', p:['rain | coat','ra | incoat','rainc | oat'], a:0, look:'ai and oa not cut in half', how:'Never cut a vowel team in half.' },
{ skill:'READ.FLU.L03.02', type:'evidence', q:'Which line has good scoops?', p:['Naftali ran / to the park / after lunch.','Naftali ran to / the park after / lunch.','Naftali / ran to the / park after lunch.'], a:0, look:'each scoop is a whole chunk', how:'A good scoop is who, did what, where or when.' },
{ skill:'READ.PHON.L03.04', type:'evidence', q:'Which word starts with an open part?', p:['ti | ger','pic | nic','win | ter'], a:0, look:'a first part that ends with its vowel', how:'Open door: the part ends with the vowel.' },
{ skill:'READ.PHON.L03.05', type:'evidence', q:'Read "wagon". Which split makes a real word?', p:['wa | gon (long a)','wag | on (short a)','wago | n'], a:1, look:'the split that sounds like a real word', how:'Try long first. Not a word? Slide the line.' }
```
**F.U23** `items:`
```js
{ skill:'READ.PHON.L03.02', type:'evidence', q:'Where do you split "garden"?', p:['gar | den','ga | rden','gard | en'], a:0, look:'keep the a and r together', how:'Bossy r stays with its vowel.' },
{ skill:'READ.LV.L03.06', type:'cloze', t:'Moishe sat on a ___ at the table.', o:['chair','chaer','cheer'], a:'chair', how:'Which spelling says air and makes sense?' },
{ skill:'READ.PHON.L03.07', type:'cloze', t:'Shimon did a ___ with 100 pieces.', o:['puzzle','puzzel','puzzul'], a:'puzzle', how:'A consonant plus le at the end.' },
{ skill:'READ.PHON.L03.08', type:'cloze', t:'Abba will throw and Avi will ___ the ball.', o:['catch','cach','catsh'], a:'catch', how:'After a short vowel, ch is spelled tch.' },
{ skill:'READ.FLU.L03.03', type:'evidence', q:'"Can I help?" asked Dovid. Which words does Dovid say?', p:['Can I help?','asked Dovid','Can I help? asked Dovid'], a:0, look:'the words inside the quotation marks', how:'Only the words inside " " are said.' },
{ skill:'READ.LV.L03.03', type:'cloze', t:'Zeidy took a long ___ by the lake.', o:['walk','wawk','wauk'], a:'walk', how:'Before l, the aw sound is spelled al.' },
{ skill:'READ.PHON.L03.06', type:'evidence', q:'Read "pancake". Which part says its long name?', p:['pan','cake','both parts'], a:1, look:'the part with a quiet e', how:'A quiet e at the end makes the vowel say its name.' }
```
**F.U24** `items:`
```js
{ skill:'READ.PHON.L03.09', type:'evidence', q:'Which word has a soft c that says sss?', p:['pencil','candy','cup'], a:0, look:'c with e, i or y after it', how:'Look at the letter right after the c.' },
{ skill:'READ.PHON.L03.10', type:'evidence', q:'Which word has a g that says j?', p:['page','gum','flag'], a:0, look:'g with e, i or y after it', how:'Look at the letter right after the g.' },
{ skill:'READ.PHON.L03.11', type:'evidence', q:'Which word has a quiet letter?', p:['wrist','rest','risk'], a:0, look:'a letter you see but do not hear', how:'Say each word. Which letter do you see but not hear?' },
{ skill:'READ.PHON.L03.12', type:'cloze', t:'Naftali drew a ___ of how tall each boy is.', o:['graph','graf','grap'], a:'graph', how:'Which two letters spell fff in this word?' },
{ skill:'READ.PHON.L03.03', type:'cloze', t:'Avi is my best ___.', o:['friend','frend','freind'], a:'friend', how:'A tricky word: remember the i before the e.' },
{ skill:'READ.LV.L03.06', type:'cloze', t:'We had to ___ the last cookie.', o:['share','shair','sher'], a:'share', how:'Which spelling says air at the end of the word?' },
{ skill:'READ.PHON.L03.08', type:'cloze', t:'Dovid sat on the ___ of the pool.', o:['edge','ege','etch'], a:'edge', how:'After a short vowel, the j sound is spelled dge.' }
```
(Check that *friend* is on the Grade 2 Tricky Spellings list. If not, use one that is.)

**F.U25** `items:`
```js
{ skill:'READ.PHON.L03.13', type:'cloze', t:'Shimon was ___ a letter to Zeidy.', o:['writing','writeing','writting'], a:'writing', how:'Write ends in a quiet e. What happens before -ing?' },
{ skill:'READ.PHON.L03.14', type:'cloze', t:'Yanky ___ the door shut.', o:['slammed','slamed','slameed'], a:'slammed', how:'Short vowel and one last letter: double it.' },
{ skill:'READ.PHON.L03.15', type:'cloze', t:'The tree had red ___.', o:['cherries','cherrys','cherryes'], a:'cherries', how:'Consonant before the y? Change y to i, then add -es.' },
{ skill:'READ.PHON.L03.16', type:'evidence', q:'Which word means "of no use"?', p:['useless','useful','using'], a:0, look:'the ending that means without', how:'-less means without.' },
{ skill:'READ.PHON.L03.17', type:'cloze', t:'The cup is empty. Avi will ___ it.', o:['refill','prefill','unfill'], a:'refill', how:'Which prefix means again?' },
{ skill:'READ.FLU.L03.04', type:'evidence', q:'Which boy reads at a just-right speed?', p:['Moishe reads fast and skips words.','Moishe reads like talking and slows down for hard words.','Moishe stops after every word.'], a:1, look:'like talking, slow on the bumps', how:'Just right: like talking. Slow down for a hard word, then speed back up.' },
{ skill:'READ.PHON.L03.09', type:'evidence', q:'Which word has a soft c?', p:['race','cap','coat'], a:0, look:'c with e, i or y after it', how:'Look at the letter right after the c.' },
{ skill:'READ.LV.L03.05', type:'evidence', q:'Which split keeps the vowel team together?', p:['pea | nut','pe | anut','pean | ut'], a:0, look:'ea not cut in half', how:'Never cut a vowel team in half.' }
```

### `F.U26` Poems, Plays and Spelling — FIX
- Good: 4 own cold items, one per skill, all 3-choice, keys right (pennies; cue = SHIMON, a:1; *cold* rhymes with gold and fits; "grass of milk" is the misread).
- **p7 (3)** — the 3 review questions and the 3 extra fill-ins come word for word from the lessons' Show me. Review READ.PHON.L03.05 is 3 of 3 2-choice, and READ.LV.L03.05 2 of 3. **Fix:** add these own items:
```js
{ skill:'READ.LV.L03.05', type:'evidence', q:'Which split keeps the vowel team together?', p:['rain | bow','ra | inbow','rainb | ow'], a:0, look:'ai not cut in half', how:'Never cut a vowel team in half.' },
{ skill:'READ.PHON.L03.05', type:'evidence', q:'Read "robin". Which split makes a real word?', p:['ro | bin (long o)','rob | in (short o)','robi | n'], a:1, look:'the split that sounds like a real word', how:'Try long first. Not a word? Slide the line.' },
{ skill:'READ.PHON.L03.02', type:'cloze', t:'The ___ walked slowly to the pond.', o:['turtle','tertle','tirtle'], a:'turtle', how:'Which bossy r spelling is in turtle?' },
{ skill:'READ.FLU.L03.06', type:'evidence', q:'You read Avi. Which line is your cue?', p:['ZEIDY: Who is hungry?','DOVID: I am!','AVI: Me too!'], a:1, look:'the line right before Avi\'s', how:'Find AVI. Which line comes just before it?' },
{ skill:'READ.PHON.L03.18', type:'cloze', t:'Chaim was ___ to the bus stop.', o:['running','runing','runeing'], a:'running', how:'Short vowel and one last letter: double it before -ing.' }
```
- **p8 (4)** — the review "Build the word for the picture" (`h or n`) has no picture (see URGENT note). The items above remove it.

---

### Texts
All 15 texts are original and warm: the Shabbos Street Club, Zeidy, Rabbi Feld, challah for Shabbos, a brachah before tasting, checked berries, a siddur found, a sukkah poem. They are 139–279 words, Grade 2 length. Each one is full of the pattern of its lesson (soft c, soft g, quiet letters, ph, endings, prefixes). The names are mostly the four club boys, Zeidy and Rabbi Feld; more names come only in the checks. Words in pictures: the texts carry no art.

- **`F.WR.25` p8 (4)** — "When he **wound** it": *wound* is also read "woond" (a hurt), so a Grade 2 boy will likely misread it. And "two puppies that hopped past the **phone on the corner**" is an odd picture. **Fix:** "When he turned the key, it ticked gently." (and change the glossary line `wound` → `key: a small tool you turn to make a clock go`), and "He even added two puppies that hopped past the phone shop on the corner."
- Small notes, not scored down:
  - `F.WR.16`: "Zeidy's old giant coat" → "Zeidy's giant old coat".
  - `F.RT.02`: in the cast note, Mr. Benhamou is presumably Avi Benhamou's father, yet in the play Avi greets him like a neighbor, and `F.WR.20` says "Avi's father". **Fix:** decide in `F-map.md` §8 whether they are related, and say so.
  - `F.WR.23`: "There was no light at night, just candles." is unclear for a shul "long ago". Make it "In the old shul, they learned at night by candlelight."

Batch 2: 24 of 31 pass; URGENT: 2


---

## Batch 3 · K and Grade 1 games in CoreDataF2 and the K listen-along story games (CoreDataFH3)

Fresh reviewer (did not write these). Every piece read in `src/CoreDataF2.html` and `src/CoreDataFH3.html`. Every key and every emoji was checked by hand against what a 5–6 year old would call it. The stories `texts/F/F.LA.K01`–`K04` were read in full. For a K–1 game, "teaching" means the first piece models the skill out loud, and "checks" means the later pieces.

Points: 1 goal · 2 teaching · 3 progression · 4 thinking steps · 5 mistake work · 6 variety and age fit · 7 taught then asked · 8 correct and clear · 9 warm.

| Lesson | Name | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | Fun | Grade level | Result |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `READ.PA.L01.07` | Clap the Words | 5 | 5 | 5 | 5 | 5 | 4 | 5 | 4 | 5 | 3 | ok | ✓ pass |
| `READ.PA.L01.08` | Rhyme Maker | 4 | 5 | 5 | 5 | 5 | 5 | 4 | 5 | 5 | 4 | ok | ✓ pass |
| `READ.PA.L01.09` | Beat Builder | 5 | 5 | 5 | 5 | 5 | 4 | 3 | 4 | 5 | 4 | ok | **✗ fix** |
| `READ.PHON.L02.22` | CVC Speedway | 4 | 3 | 5 | 5 | 5 | 5 | 4 | 4 | 5 | 3 | ok | **✗ fix** |
| `READ.PA.L02.02` | Long or Short? | 5 | 3 | 5 | 4 | 5 | 5 | 3 | 5 | 5 | 3 | ok | **✗ fix** |
| `READ.PHON.L01.05` | Moon and Apple | 5 | 5 | 5 | 5 | 5 | 5 | 4 | 4 | 5 | 3 | ok | ✓ pass |
| `READ.PHON.L01.06` | Sss and Tuh | 5 | 5 | 5 | 5 | 5 | 5 | 4 | 5 | 5 | 3 | ok | ✓ pass |
| `READ.PHON.L01.07` | My First Words | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 3 | ok | ✓ pass |
| `READ.FLU.L01.02` | Heart Words: the, a | 5 | 5 | 5 | 5 | 5 | 5 | 4 | 4 | 5 | 3 | ok | ✓ pass |
| `WRIT.HAND.L01.05` | Write m, a, s, t | 5 | 5 | 5 | 4 | 5 | 5 | 5 | 5 | 5 | 4 | ok | ✓ pass |
| `READ.PHON.L01.08` | Pop and Itch | 5 | 5 | 5 | 4 | 5 | 5 | 4 | 5 | 5 | 3 | ok | ✓ pass |
| `READ.PHON.L01.09` | Nnn Like Nest | 5 | 5 | 5 | 4 | 5 | 5 | 3 | 5 | 5 | 3 | ok | **✗ fix** |
| `READ.PHON.L01.10` | Pin, Tap, Nap | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 4 | 5 | 3 | ok | ✓ pass |
| `READ.FLU.L01.03` | Heart Words: I, is | 5 | 5 | 5 | 5 | 5 | 5 | 4 | 5 | 5 | 3 | ok | ✓ pass |
| `WRIT.HAND.L01.06` | Write p, i, n | 5 | 5 | 5 | 4 | 5 | 5 | 5 | 5 | 5 | 4 | ok | ✓ pass |
| `READ.LIT.L01.01` | Who Is in the Story? | 5 | 4 | 5 | 4 | 5 | 5 | 5 | 5 | 5 | 4 | ok | ✓ pass |
| `READ.LIT.L01.02` | Where Is the Story? | 5 | 4 | 5 | 5 | 4 | 5 | 5 | 3 | 5 | 4 | ok | **✗ fix** |
| `READ.LIT.L01.03` | Problem and Fix | 5 | 4 | 4 | 5 | 5 | 5 | 4 | 4 | 5 | 4 | ok | ✓ pass |
| `READ.LIT.L01.04` | Retell It | 4 | 4 | 5 | 5 | 5 | 5 | 4 | 4 | 5 | 4 | ok | ✓ pass |
| `F.LA.K01` (text) | Eli's First Day | 5 | – | – | – | – | 5 | – | 5 | 5 | 4 | ok | ✓ pass |
| `F.LA.K02` (text) | Supper in the Sukkah | 5 | – | – | – | – | 5 | – | 5 | 5 | 4 | ok | ✓ pass |
| `F.LA.K03` (text) | The Kippah That Flew Away | 5 | – | – | – | – | 5 | – | 5 | 5 | 4 | ok | ✓ pass |
| `F.LA.K04` (text) | Challah for Shabbos | 5 | – | – | – | – | 5 | – | 5 | 5 | 4 | ok | ✓ pass |

### URGENT
1. **Wrong for a right answer: `READ.LIT.L01.02` piece 6 (match).** Pairs `['😴','🌙'],['🌿','🛖'],['🎒','🏫']`. In the story "Baby Moishy fell asleep on Abba's shoulder" **in the sukkah**, so a boy who pairs 😴 with 🛖 is right from the story but gets a bump.  
   **Fix:** `pairs:[['🌿','🛖'],['🎒','🏫'],['🦉','🌙']]` (an owl has nothing to do with the sukkah in the story).
2. **A spoken line over 12 words: `READ.LIT.L01.02` piece 5.** The hear line "A cat peeked in. Did Eli leave the sukkah and go to the cat?" is 14 words. (Fix under that lesson, p5.)
3. **Spoken How lines over 12 words.** The game speaks the How line after every miss (`src/CoreK1.html` miss(): `say(s.msg + ' ' + OBK.how(d))`). These are over 12 words: `WRIT.HAND.L01.05` piece 4 (16), `READ.PHON.L01.08` piece 4 (14), `WRIT.HAND.L01.06` piece 4 (14), `READ.PHON.L01.09` piece 1 (13), `READ.LIT.L01.01` piece 2 (14) and piece 3 (13). The game test counts only `say`, so these got through. Copy-ready shorter lines are under each lesson.

Clear on everything else: no girl or woman emoji (👶 and the cast 🧒 are not girls; men are 🧔 👨‍🏫 👨), no non-kosher food, no other religions' symbols, no Divine Name, the word "bite" is not on any boy screen, no letters inside pictures that give the answer, and no bare vowel sound is spoken.

## Notes and copy-ready fixes, lesson by lesson

### `READ.PA.L01.07` Clap the Words — pass
- **p6:** 3 of the 5 pieces are the same "listen, how many claps" (pieces 1, 4 and 5).  
  **Fix:** make piece 5 a tiles piece: `{type:'tiles', w:['🧔','🍞','🔥'], hear:'Abba bakes challah.', say:'Each picture is one word. Put them in order.', how:'Listen. Which word comes first? Then next?'}`, and keep piece 4 as the mistake piece.
- **p8:** in this game 👏 means **one word**, but two games later (Beat Builder) the same 👏 / 👏👏 boxes mean **one beat (syllable)**: "Mon-key: two claps". A K boy is told that banana is one clap here and will clap ba-na-na there. Also, a 5-year-old calls 👀 "eyes", not "sees" (piece 2).  
  **Fix:** keep 👏 for words here and give Beat Builder 🥁 beats (see below). Piece 2: `w:['👦','🍽️','🐰']`, `hear:'Eli feeds Hop.'`.

### `READ.PA.L01.08` Rhyme Maker — pass
- **p1:** the goal says "Hear and **make** rhymes", but the boy never makes a rhyme. He only finds and matches them.  
  **Fix:** goal: "Hear and find rhymes".
- **p7:** 🌳 tree is the model rhyme in piece 1 ("Bee, tree") and then a card in piece 3's "rhymes with bee?" sort.  
  **Fix:** piece 3 cards `[['3️⃣',0],['🐻',1],['🔑',0],['🐢',1]]` (three, bear, key, turtle).

### `READ.PA.L01.09` Beat Builder — FIX (a point below 4)
- **p6:** 4 of the 6 pieces are listen.  
  **Fix:** make piece 2 `{type:'tiles', w:['☀️','🌼'], hear:'sunflower', say:'Sun-flower! Put the two parts in order.', how:'Say it slowly. Which part comes first?'}`.
- **p7:** the piece 3 say gives away 2 of the 4 cards: "Clap with Shmuli! Mon-key: two claps. Bee: one clap." with cards 🐝 and 🐵. The findall in piece 4 then reuses 🐝 and 🐟 (from piece 3) and 🧁 (from piece 1).  
  **Fix (with the 🥁 change):** piece 3 `{type:'sort', bins:['🥁','🥁🥁'], cards:[['🐄',0],['🦒',1],['🦆',0],['🐯',1]], say:'Drum with Shmuli! Bee: one beat. Mon-key: two beats.', how:'Say it and drum. Count your beats.'}`; piece 4 `grid:['🌈','🦆','🥕','🍌','🍋','🔑'], find:['🌈','🥕','🍋'], findSay:'picture with two beats'` (🍌 banana has 3 beats, so it is a fair trap).
- **p8:** 👏 / 👏👏 means words in Clap the Words and beats here (see above). The 🥁 fix settles it.

### `READ.PHON.L02.22` CVC Speedway — FIX (a point below 4)
- **p1:** "Read and build short-vowel words **fast**", but nothing is timed or quick, and "Speedway" promises a race.  
  **Fix:** goal: "Read and build short-vowel words". Name: "CVC Road Trip".
- **p2:** piece 1 "Zevi has a map. Three sounds. One tile for each." never models the sounds out loud, and a Grade 1 boy gets no other lesson.  
  **Fix:** piece 1 `say:'Map: mmm, apple sound, puh. Three sounds. One tile each!'` (10 words; no bare vowel is spoken).
- **p7:** map is built in piece 1 and is then a sort card in piece 4.  
  **Fix:** piece 4 card `['bat',0]` in place of `['map',0]`.
- **p8:** piece 2 matches "bag" to 🎒, which is a knapsack (the K story calls it that).  
  **Fix:** `pairs:[['bed','🛏️'],['bus','🚌'],['web','🕸️']]`.

### `READ.PA.L02.02` Long or Short? — FIX (a point below 4)
- **p2:** piece 1 opens with "Long like cake, or short like cat?" and never says what "long" means. "Says its name" first comes in piece 2's How line.  
  **Fix:** piece 1 `say:'Cake: the middle says its name. Long! Cat does not: short.'` (11 words).
- **p4:** piece 1's How line "Listen to the middle sound." gives no way to tell long from short.  
  **Fix:** piece 1 `how:'Does the middle say its name, like cake? Then it is long.'`.
- **p7:** the last piece reuses pictures he has already sorted: snake, bat and hat (piece 1), kite (piece 2) and bike (piece 3). The piece 4 findall also counts 🐝 itself, the example word, as a target.  
  **Fix:** piece 5 `pairs:[['🐋','🚂'],['🍎','🐜'],['🔥','🕷️']]` (whale/train, apple/ant, fire/spider: each pair has one sound and no cross pair works). Piece 4: `grid:['🧀','🥚','🌳','🛏️','🔑','🕸️'], find:['🧀','🌳','🔑']`.

### `READ.PHON.L01.05` Moon and Apple — pass
- **p7:** the piece 3 sort reuses 🐭 (piece 1), and ⚓ and 🐜 (piece 2).  
  **Fix:** cards `[['🗺️',0],['🪓',1],['🐵',0],['⚓',1],['🧲',0]]`.
- **p8:** many 5-year-olds call 🐜 "bug". That starts with b, so it fits no box in the sort.  
  **Fix:** the card fix above takes 🐜 out of the sort. In the piece 2 grid, keep 🐜 only if the voice names it, or swap it for 🚑 (ambulance).

### `READ.PHON.L01.06` Sss and Tuh — pass
- **p7:** ☀️ sun is the answer in piece 1 and comes back in the piece 5 match.  
  **Fix:** piece 5 `pairs:[['🦷','t'],['🧽','s'],['🗺️','m']]` (sponge).

### `READ.PHON.L01.07` My First Words — pass
All 5. The repeats of am, at, sat and mat are the goal itself.

### `READ.FLU.L01.02` Heart Words: the, a — pass
- **p7:** piece 2 shows `q:'a'` big at the top, and the answer is also "a". He can match the shape without reading.  
  **Fix:** delete `q:'a'` from piece 2 (keep `pic:'❤️'`).
- **p8:** piece 6 builds "at the mat" ("Hop sat. Where?"). People say "on the mat", so the phrase sounds odd.  
  **Fix:** `say:'Last one! Hop sat at the mat to eat. Build it.'` (11 words), so "at" makes sense.

### `WRIT.HAND.L01.05` Write m, a, s, t — pass
- **p4:** piece 4 How line "Look for a cross and a straight top. A hook on top is a different letter." is 16 words and spoken.  
  **Fix:** `how:'Look for a cross and a flat top. No hook!'` (10).

### `READ.PHON.L01.08` Pop and Itch — pass
- **p4:** piece 4 How line "Puh has a long line that goes down low, with its tummy on top." is 14 words, and q also has a long line and a tummy on top, so the line does not tell p from q.  
  **Fix:** `how:'Line on the left, going down low. Tummy on the right.'` (11).
- **p7:** piece 3 says the answer before he is asked: "This letter starts itch **and insect**. Which one starts like itch?" with hear "insect, moon, tooth".  
  **Fix:** `say:'This letter starts itch. Which one starts like itch?'`.

### `READ.PHON.L01.09` Nnn Like Nest — FIX (a point below 4)
- **p4:** piece 1 How line "Say each picture. Nnn hums in your nose. Mmm hums on your lips." is 13 words.  
  **Fix:** `how:'Nnn hums in your nose. Mmm hums on your lips.'` (10).
- **p7:** the last findall's three targets were all shown before: 👃 nose (piece 1's answer), 9️⃣ nine (piece 5) and 🪺 nest (the game's key picture).  
  **Fix:** piece 6 `grid:['🪡','🐭','📰','🍐','🪺','🦷'], find:['🪡','📰','🪺']` (needle, newspaper and nest; do not use 🥜, which a boy calls "peanut").

### `READ.PHON.L01.10` Pin, Tap, Nap — pass
- **p8:** piece 6 matches "pan" to 🍳. A 5-year-old sees "egg".  
  **Fix:** `pairs:[['pin','📌'],['nap','😴'],['map','🗺️']]`.

### `READ.FLU.L01.03` Heart Words: I, is — pass
- **p7:** "I sit." is built in piece 2 and then matched in piece 5.  
  **Fix:** piece 2 `w:['I','sat'], hear:'I sat.'`.

### `WRIT.HAND.L01.06` Write p, i, n — pass
- **p4:** piece 4 How line "Short line, dot on top, no tail. A tall line is a different letter." is 14 words.  
  **Fix:** `how:'Short line, dot on top. A tall line is not it.'` (11).

### `READ.LIT.L01.01` Who Is in the Story? — pass
- **p2:** the word "character" (the skill) is only in a How line, so nothing says what to listen for before the story.  
  **Fix:** story `say:'Listen for who is in the story. They are the characters!'` (11).
- **p4:** the piece 2 How line is 14 words ("…is in almost every page…") and the piece 3 How line is 13.  
  **Fix:** piece 2 `how:'The main character is on almost every page. Who is he?'` (11). Piece 3 `how:'Did we hear about him in the story? Yes or no?'` (10).

### `READ.LIT.L01.02` Where Is the Story? — FIX (a point below 4)
- **p2:** "setting" is only in a How line. The story say "Where are they? When is it?" is fine but does not name the idea.  
  **Fix:** story `say:'Listen for where they are, and is it day or night?'` (11).
- **p5:** piece 5 hear "A cat peeked in. Did Eli leave the sukkah and go to the cat?" is 14 words (URGENT 2). It is also not a likely mistake: the story never says Eli went to the cat.  
  **Fix:** `{type:'listen', hear:'Did they eat supper in the kitchen?', o:['👍','👎'], a:'👎', mis:true, say:'Careful! Where did they eat supper?', how:'Most nights we eat inside. Where did they eat on Sukkos?'}`.
- **p8:** the 😴 → 🛖 pair is also right from the story (URGENT 1).  
  **Fix:** `pairs:[['🌿','🛖'],['🎒','🏫'],['🦉','🌙']]`.

### `READ.LIT.L01.03` Problem and Fix — pass
- **p2:** "problem" and "fix" are defined only in How lines.  
  **Fix:** story `say:'Listen. Something goes wrong. Then how does it get better?'` (10).
- **p3:** the easy problem/fix sort comes last, after the harder order piece.  
  **Fix:** swap pieces 5 and 6 (sort, then order).
- **p7:** the order steps `['💨🔵','🔍🌳','📮🌲🔵']` are exactly the right answers of pieces 2 and 4 (and a distractor), so the order is half given.  
  **Fix:** `steps:['💨🔵','😢','🔍🌳','📎🔵']` (wind, sad, search, clip).
- **p8:** a 5-year-old must guess that 🔵 is a blue kippah.  
  **Fix:** use a K–1 game drawing of a kippah (an `art:` picture) in place of 🔵. Do not name it in the hear line, because that would give the answer.

### `READ.LIT.L01.04` Retell It — pass
- **p1:** the goal is "beginning, **middle** and end", but the sort has only Beginning and End.  
  **Fix:** piece 5 `bins:['🌅 Beginning','⏳ Middle','🌙 End'], cards:[['🥣',0],['🥖🥖',1],['🕯️',2],['🔥',1]]`.
- **p2:** nothing models first / next / last before the story.  
  **Fix:** story `say:'Listen for first, next, then last. Then tell it back!'` (10).
- **p7:** piece 6 "What came right before the oven?" asks what he laid out one piece earlier (🥖🥖 before 🔥).  
  **Fix:** `hear:'What did Abba do right after the dough rested?', o:['🙏','🔥','🕯️'], a:'🙏'` (hafrashas challah).
- **p8:** 🥖 is a long French loaf, not a braided challah.  
  **Fix:** use the K–1 drawing of a challah (`art:`) for the braid step.

### Texts `F.LA.K01`–`K04` (all pass)
They are warm and modest, with real frum life: Modeh Ani, rugelach, Shalom aleichem, Kiddush and leishev basukkah, zemiros, a kippah clip, hafrashas challah. The names are well mixed (Eli, Shmuli, Moishy, Ovadia and his Saba, Rebbe Gutman, Reb Chaim). There are no women in pictures, and the food is kosher. Sentences are short and fit reading aloud to K. No fix needed.

Batch 3: 14 of 19 pass; URGENT: 3


---

## Batch 4 · Kindergarten games (CoreDataFH1), part 1

Fresh, independent reviewer (did not write these games). Source: `src/CoreDataFH1.html`. Every piece read (say, how, hear, options, answer, mis). Every answer key and every emoji checked by hand for what a 5-year-old would call it. Note: in a K–1 game the `say` and `how` lines are both spoken (`src/CoreK1.html` line 139); cards, match items and grid cells are not.

Points: 1 goal · 2 teaching · 3 progression · 4 thinking steps · 5 mistake work · 6 variety and age fit · 7 taught then asked · 8 correct and clear · 9 warm. Fun 1–5.

| Lesson | Name | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | Fun | Grade level | Result |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `READ.PHON.L01.16` | Fish and Lion | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 3 | 5 | 4 | ok | **✗ fix** |
| `READ.PHON.L01.17` | Run Up the Hill | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 4 | 5 | 4 | ok | ✓ pass |
| `READ.PA.L01.12` | Sound Train | 5 | 4 | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 4 | ok | ✓ pass |
| `READ.PHON.L01.18` | Every Letter Counts | 5 | 3 | 5 | 5 | 5 | 5 | 5 | 4 | 5 | 3 | ok | **✗ fix** |
| `WRIT.HAND.L01.09` | Write f, l, u, r | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 4 | 3 | ok | ✓ pass |
| `READ.PHON.L01.19` | Bat and Ball | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 4 | 5 | 4 | ok | ✓ pass |
| `READ.PHON.L01.20` | Jam and Web | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 4 | 5 | 4 | ok | ✓ pass |
| `READ.PA.L01.13` | Change the First Sound | 5 | 4 | 5 | 5 | 4 | 5 | 5 | 4 | 4 | 3 | ok | ✓ pass |
| `READ.FLU.L01.06` | Heart Words: my, go, no, so | 5 | 5 | 5 | 5 | 5 | 5 | 4 | 5 | 4 | 3 | ok | ✓ pass |
| `READ.FLU.L01.07` | Point and Read | 5 | 3 | 3 | 5 | 3 | 5 | 5 | 4 | 5 | 4 | ok | **✗ fix** |
| `WRIT.HAND.L01.10` | Write b, j, w | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 4 | 3 | ok | ✓ pass |
| `READ.PHON.L01.21` | Yo-yo, Van, Zebra | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 4 | 5 | 4 | ok | ✓ pass |
| `READ.PHON.L01.22` | Box and Queen | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 3 | ok | ✓ pass |
| `READ.PA.L01.14` | Change the End | 5 | 4 | 5 | 4 | 4 | 5 | 5 | 3 | 4 | 3 | ok | **✗ fix** |
| `WRIT.HAND.L01.11` | Write y, v, z, x, q | 5 | 5 | 5 | 5 | 5 | 4 | 5 | 5 | 4 | 3 | ok | ✓ pass |
| `READ.PHON.L01.23` | One More: -s | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 4 | 4 | 3 | ok | ✓ pass |
| `READ.PHON.L01.24` | Cap or Cat? | 5 | 4 | 5 | 5 | 5 | 5 | 5 | 5 | 4 | 3 | ok | ✓ pass |
| `READ.FLU.L01.08` | Heart Words: said, was, you | 5 | 5 | 5 | 5 | 5 | 4 | 4 | 5 | 5 | 3 | ok | ✓ pass |
| `READ.FLU.L01.09` | Smooth Like Talking | 4 | 5 | 5 | 5 | 5 | 5 | 5 | 4 | 5 | 3 | ok | ✓ pass |
| `WRIT.HAND.L01.12` | Big Letters | 4 | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 4 | 3 | ok | ✓ pass |
| `READ.PHON.L01.25` | Long or Short? | 5 | 3 | 4 | 5 | 4 | 5 | 2 | 5 | 3 | 3 | ok | **✗ fix** |

## URGENT
1. `READ.PA.L01.14` Change the End, piece 5 (mis): hear "Big. Change the middle to uh." key 🐛, choices 🐛 🐝 🛍️. A bee **is a bug**, and 🐛 looks like a caterpillar to most 5-year-olds. A boy who hears "bug" and taps 🐝 is defensibly right and marked wrong.
2. `READ.PHON.L01.25` Long or Short?, piece 5: grid has 🦀 (crab), on the forbidden non-kosher list.
3. `READ.PHON.L01.16` Fish and Lion, piece 4: sort card 🐸 (keyed fff). Many boys call it "toad" (tuh), the exact frog/toad case: no box fits his name for it, so he guesses.

## Notes and copy-ready fixes, game by game

### `READ.PHON.L01.16` Fish and Lion — FIX (a point below 4)
- **p8** — sort cards `['🐸',0]` (frog/toad, see URGENT 3).  
  **Fix:** replace `['🐸',0]` with `['🔥',0]` ("fire" and "flame" both start with fff).

### `READ.PHON.L01.17` Run Up the Hill — pass
- **p8** — the sort is "Say the picture" but one card is the printed word `['up',1]`. It is the only text card, and the u inside it gives the answer away.  
  **Fix:** replace `['up',1]` with `['🐰',0]` (rabbit, rrr). ☂️ stays the uh card.

### `READ.PA.L01.12` Sound Train — pass
- **p2** — piece 1 say: "Push the sounds together, like train cars. What is it?" asks before it models one blend out loud.  
  **Fix:** piece 1 say: "Puh, ih, nnn: pin! Now push these sounds together." (9 words; pin is not in this game)

### `READ.PHON.L01.18` Every Letter Counts — FIX (a point below 4)
- **p2** — piece 1 say: "Read every letter. Put each word with its picture." This is an instruction, not a model. He gets no example of "check every letter, not just the first" before he is asked to do it.  
  **Fix:** piece 1 say: "Mmm, aa, tuh: mat, not map! Read every letter." (10 words; mat is not a card)
- **p8** — 📌 is the picture for "pin" in pieces 2 and 4. Many boys say "tack", and 🐶 for "pup" reads as "dog". Both work only by elimination.  
  **Fix:** piece 2: replace `['pup','🐶']` with `['pan','🍳']`. Piece 4: keep 📌, but how: "It is a pin. Read each word to the very end." 

### `WRIT.HAND.L01.09` Write f, l, u, r — pass
- **p9** — no family, no names, no warm moment in 7 pieces.  
  **Fix:** piece 6 say: "Eli hears rain on the sukkah. Which letter starts rain?" (10 words)

### `READ.PHON.L01.19` Bat and Ball — pass
- **p8** — sort card 🐶 (keyed duh, "dog"), but many boys say "puppy" (puh), and p looks like b/d.  
  **Fix:** replace `['🐶',1]` with `['🍩',1]` (donut).

### `READ.PHON.L01.20` Jam and Web — pass
- **p8** — match `['win','🏆']` and `['jet','✈️']`: a boy calls these "trophy" and "airplane", so they work only by elimination.  
  **Fix:** replace `['win','🏆']` with `['wet','💦']`.

### `READ.PA.L01.13` Change the First Sound — pass
- **p2** — piece 1 asks right away: "Cat. Change the first sound to huh. What is it?" No change is modeled first.  
  **Fix:** piece 1 say: "Mop, top! Only the first sound changed. Now cat, huh." (10 words)
- **p5** — the mis piece's trap picture 🐔 (keyed "hen", the unchanged word) is a "chicken" to a 5-year-old, so the trap does not test the real mistake.  
  **Fix:** piece 3 → `hear:'Hat. Change huh to buh.', o:['🦇','🎩','🐱'], a:'🦇'`, say: "Careful! Change only the first sound. Hat, with buh." Traps: 🎩 (did not change it), 🐱 (put in the wrong new sound).
- **p8** — piece 5 key 🐛 for "bug". It reads as caterpillar/worm and works by elimination only (no bee here, so it is not urgent).  
  **Fix:** keep it, but give the how line "Bug: a tiny crawling thing. Keep the end of rug."
- **p9** — no family or names.  
  **Fix:** piece 5 say: "Eli looks at the rug. Change rrr to buh!" (9 words)

### `READ.FLU.L01.06` Heart Words: my, go, no, so — pass
- **p7** — every piece voices the heart word first (listen ×3, findall `findSay:'go'`, dictation), so he never reads a heart word with no voice to help.  
  **Fix:** add piece 6: `{type:'sort', bins:['🟢','🛑'], cards:[['Go!',0],['No!',1],['Go, Dan!',0],['No, Gad!',1]], say:'Green light or red light? Read each card.', how:'Guh-oh means go. Nnn-oh means stop.'}`
- **p9** — no family; the only sentence is "My cat can go."  
  **Fix:** the sort above adds Dan and Gad.

### `READ.FLU.L01.07` Point and Read — FIX (a point below 4)
- **p2 / p3** — piece 1 is the hardest piece: 4 unvoiced sentences to read and sort ("The cat can nap." … "A dog ran to Dan."), with no model of reading word by word.  
  **Fix:** swap pieces 1 and 2, and make the new piece 1 say: "Dan. Can. Run. One word at a time. Build it." (9 words)
- **p5** — the mis piece is the 👍/👎 silly-sentence sort ("A hat can run."). That is sense-checking, not the K reader's likely mistake (skipping little words). The real mistake work is in piece 5 (`extra:['the']`), which is not marked.  
  **Fix:** remove `mis:true` from piece 4. Piece 5: add `mis:true`, say: "Careful! Little words count. Do not skip any. Build it." (9 words)
- **p8** — "A dog ran to Dan." and "I see a big bus." use *to* and *see*. Neither is taught yet: *see* comes with Snap Words in Unit 9, and *to* is on no K heart-word list.  
  **Fix:** card → `['A dog ran in the fog.',1]`. Piece 5 → `hear:'Gad got on a big bus.', w:['Gad','got','on','a','big','bus.'], extra:['the']`.

### `WRIT.HAND.L01.10` Write b, j, w — pass
- **p9** — no family or names.  
  **Fix:** piece 6 say: "Eli sees a web by Zeidy's goats. Build web." (9 words)

### `READ.PHON.L01.21` Yo-yo, Van, Zebra — pass
- **p8** — match `['yam','🍠']`: a boy says "sweet potato" (or does not know it), so it works by elimination only.  
  **Fix:** replace `['yam','🍠']` with `['zip','🤐']` (the say stays the same).

### `READ.PHON.L01.22` Box and Queen — pass (no notes)

### `READ.PA.L01.14` Change the End — FIX (a point below 4)
- **p8** — URGENT 1: piece 5 `o:['🐛','🐝','🛍️'], a:'🐛'` (a bee is a bug).  
  **Fix:** piece 5 → `{type:'listen', hear:'Pin. Change the middle to aa.', o:['🍳','📌','🖊️'], a:'🍳', mis:true, say:'Careful! Change only the middle. Pin, with aa.', how:'Keep puh and nnn. Put aa in the middle.'}` (pan; pen is the wrong-middle trap, pin is the unchanged trap)
- **p2** — piece 1 asks before it models: "Cat. Change the last sound to puh. What is it?"  
  **Fix:** piece 1 say: "Hot, hop! Only the end changed. Now cat, end puh." (10 words)
- **p4** — piece 4 say: "Hat. Change the middle to the middle sound of mop." This is two steps for a 5-year-old, and the how line ("Keep huh and tuh. Only the middle tile changes.") never tells him what the middle of mop is.  
  **Fix:** say: "Hat. Change the middle to ah, like mop. Build it." how: "Keep huh and tuh. Put ah in the middle."
- **p5** — the mis piece's traps (bee, bags) are not the likely mistake, which is changing the wrong place. Fixed by the pin/pan/pen piece above.
- **p9** — no family or names.  
  **Fix:** piece 2 say: "Zeidy has a cap. Change its end. Tap every new word." (11 words)

### `WRIT.HAND.L01.11` Write y, v, z, x, q — pass
- **p6** — 8 pieces, 5 of them traces, and the last two are traces back to back (x, then q). That is long for K. He also builds fox (piece 6) before he traces x (piece 7).  
  **Fix:** order the pieces ... trace z, **trace x**, **tiles fox**, trace q (swap pieces 6 and 7).
- **p9** — no family or names.  
  **Fix:** tiles say: "Zeidy saw a fox by the hens! Build fox." (9 words)

### `READ.PHON.L01.23` One More: -s — pass
- **p8** — piece 6 "I see the dogs." uses *see* before Snap Words (Unit 9 #3) teaches it.  
  **Fix:** `hear:'Dan can pet the dogs.', w:['Dan','can','pet','the','dogs.'], extra:['dog.']`.
- **p9** — no family.  
  **Fix:** the Dan sentence above.

### `READ.PHON.L01.24` Cap or Cat? — pass
- **p2** — piece 1 gives a method but no model: "They start the same. Check the last letter. Match."  
  **Fix:** say: "Mat, map, man: only the end changes. Check it. Match." (10 words; none of these is a card)
- **p9** — no family.  
  **Fix:** piece 5 say: "Eli wants a pet. Build pet. Check the last tile!" (10 words)

### `READ.FLU.L01.08` Heart Words: said, was, you — pass
- **p6** — 4 of 7 pieces are the same listen-and-tap, with 5 new heart words in one K game.  
  **Fix:** piece 6 → `{type:'findall', grid:['and','an','and','ant','and','had'], find:'and', findSay:'and', say:'And joins things: Abba and Moishy. Tap every and.', how:'Aa, nnn, duh. Look for duh at the end.'}`
- **p7** — every heart word is voiced before he reads it.  
  **Fix:** add piece 8: `{type:'sort', bins:['🙂','😢'], cards:[['I like you.',0],['Gad was sad.',1],['I like the cat.',0],['Dov was sad.',1]], say:'Happy or sad? Read each one.', how:'Read to the end. Is it sad?'}`

### `READ.FLU.L01.09` Smooth Like Talking — pass
- **p1** — the goal is that *he* reads smoothly, but the game can only check that he hears choppy vs smooth and can build sentences. That is fair for a screen game, but it is only half the goal.  
  **Fix:** piece 2 say: "Build it. Then read it out loud, smooth like talking." (10 words), so the read-aloud step happens on every build.
- **p8** — sort card "A fox ran to his den." uses *to* (not taught).  
  **Fix:** `['A fox is in his den.',1]`.

### `WRIT.HAND.L01.12` Big Letters — pass
- **p1** — the goal is "names **and the first word**", but the only first word checked (Tal) is also a name.  
  **Fix:** piece 6 → `hear:'The dog can hop.', w:['The','dog','can','hop.'], extra:['the'], say:'Listen. Build it. The first word gets a big letter.', how:'A sentence starts with a big letter.'`
- **p9** — names but no family moment.  
  **Fix:** sort cards → `[['Eli',0],['eli',1],['Ben',0],['ben',1]]`.

### `READ.PHON.L01.25` Long or Short? — FIX (a point below 4)
- **p7** — piece 3 findall grid `['🚂','🐱','🍇','🎩','🐍','🦇']` is the **same six pictures** as the piece 1 sort, and piece 2's "snake" is also a piece 1 card. Two of five pieces are repeats, not cold.  
  **Fix:** piece 3 grid `['🐋','🥫','🐌','🪜','✈️','🐀']`, find `['🐋','🐌','✈️']` (whale, snail, plane). Piece 2 `hear:'rake'`, say "Is rake short like apple, or long like cake?", how "Say rake slowly. Hear ay in the middle?"
- **p2** — piece 1 is a 6-card sort of a brand-new idea (long vs short), with no model.  
  **Fix:** make the rake listen piece 1 with say: "Cake: kuh, ay, kuh. It says its name, ay. Long!" (10 words), and then the sort.
- **p3** — the climb is flat because pieces 3 and 1 are the same. Fixed by the new grid above.
- **p5** — the mis piece is "Man: short or long?" That is fine, but it comes after a run of long items rather than targeting the real trap (hearing ay in any word with a).  
  **Fix:** keep man, and change the how to "Man: mmm, aa, nnn. Aa is short, not its name." 
- **p9** — 🦀 in piece 5 (URGENT 2), and no family.  
  **Fix:** piece 5 grid → `['🧲','🌊','🎒','🍰','🧢','🚂']`, find `['🧲','🎒','🧢']` (magnet, backpack, cap). Piece 1 say: "Eli's Shabbos cake says ay. Short like apple, or long?" (10 words)

Batch 4: 16 of 21 pass; URGENT: 3


---

## Batch 5 · Kindergarten games (CoreDataFH1), part 2, and K little readers

Fresh reviewer (did not write these). Source: `src/CoreDataFH1.html` lines 184–319; texts `texts/FH1/FH1.K.15–32.txt`. Every key, emoji and sentence checked by hand against the book text. Heart words by unit (F-map 3): U2–5 the, a, I, is, to, see, we, he, me; U7 my, go, no, so. Letters: to U6 m a s t p i n c k o d g h e f l u r; U7 + b j w; U8 + y v z x qu.

Points: 1 goal · 2 teaching · 3 progression · 4 thinking steps · 5 mistake work · 6 variety and age fit · 7 taught then asked · 8 correct and clear · 9 warm. Fun = how exciting a boy would find it (1–5).

| Lesson | Name | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | Fun | Grade level | Result |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `READ.PHON.L01.26` | Shhh, Ch, Th | 5 | 4 | 5 | 5 | 5 | 5 | 4 | 4 | 4 | 3 | ok | ✓ pass |
| `READ.PA.L01.15` | Four Sounds | 5 | 3 | 4 | 4 | 5 | 4 | 5 | 3 | 2 | 3 | ok | **✗ fix** |
| `READ.FLU.L01.10` | Heart Words: have, of, they | 5 | 4 | 4 | 4 | 5 | 4 | 3 | 4 | 4 | 2 | ok | **✗ fix** |
| `READ.LV.L01.01` | Book: Hop the Pet | 4 | 4 | 4 | 4 | 5 | 4 | 5 | 5 | 5 | 3 | ok | ✓ pass |
| `READ.LV.L01.02` | Book: The Fig in the Cup | 4 | 4 | 4 | 4 | 5 | 4 | 4 | 5 | 5 | 3 | ok | ✓ pass |
| `READ.LV.L01.03` | Book: The Red Rug | 4 | 4 | 4 | 4 | 5 | 4 | 5 | 4 | 5 | 3 | ok | ✓ pass |
| `READ.LV.L01.04` | Book: Fun in the Sun | 4 | 4 | 4 | 4 | 4 | 4 | 4 | 5 | 4 | 3 | ok | ✓ pass |
| `READ.LV.L01.05` | Book: The Pup Can Dig | 4 | 4 | 4 | 4 | 5 | 4 | 5 | 5 | 4 | 3 | ok | ✓ pass |
| `READ.LV.L01.06` | Book: The Hat on the Dog | 4 | 4 | 4 | 4 | 5 | 4 | 4 | 4 | 4 | 3 | ok | ✓ pass |
| `READ.LV.L01.07` | Book: The Bug in the Jug | 4 | 4 | 4 | 4 | 5 | 4 | 5 | 5 | 4 | 3 | ok | ✓ pass |
| `READ.LV.L01.08` | Book: The Wet Dog | 4 | 4 | 4 | 4 | 5 | 4 | 4 | 5 | 4 | 3 | ok | ✓ pass |
| `READ.LV.L01.09` | Book: Jam on a Bun | 4 | 4 | 4 | 4 | 5 | 4 | 5 | 5 | 5 | 3 | ok | ✓ pass |
| `READ.LV.L01.10` | Book: Go, Bus, Go! | 4 | 4 | 4 | 4 | 5 | 4 | 4 | 5 | 4 | 3 | ok | ✓ pass |
| `READ.LV.L01.11` | Book: The Web on the Log | 4 | 4 | 4 | 4 | 5 | 4 | 5 | 4 | 5 | 3 | ok | ✓ pass |
| `READ.LV.L01.12` | Book: Mop It Up | 4 | 4 | 4 | 4 | 5 | 4 | 4 | 5 | 5 | 3 | ok | ✓ pass |
| `READ.LV.L01.13` | Book: The Fox in the Box | 4 | 4 | 4 | 4 | 5 | 4 | 5 | 5 | 4 | 3 | ok | ✓ pass |
| `READ.LV.L01.14` | Book: The Hen in the Box | 4 | 4 | 4 | 4 | 5 | 4 | 4 | 5 | 5 | 3 | ok | ✓ pass |
| `READ.LV.L01.15` | Book: Go, Van, Go! | 4 | 4 | 4 | 4 | 5 | 4 | 5 | 4 | 5 | 3 | ok | ✓ pass |
| `READ.LV.L01.16` | Book: Zip Up! | 4 | 4 | 4 | 4 | 5 | 4 | 4 | 5 | 5 | 3 | ok | ✓ pass |
| `READ.LV.L01.17` | Book: The Quiz | 4 | 4 | 4 | 4 | 5 | 4 | 5 | 4 | 4 | 2 | ok | ✓ pass |
| `READ.LV.L01.18` | Book: The Red Wax | 4 | 4 | 4 | 4 | 5 | 4 | 4 | 5 | 4 | 3 | ok | ✓ pass |

### Little readers (points 1, 6, 8, 9 and Fun; "–" = does not apply)

All 18 are **reachable by a boy**: each is opened by the `story` piece of its `READ.LV.L01.xx` game (texts built to `/texts/<ID>.json` by `web/build.js`), on the K path right after Write f,l,u,r (15–20), Write b,j,w (21–26) and Write y,v,z,x,q (27–32), so each set comes after its letters. Decodable apart from **has / his** (s says zzz; never taught, not a listed heart word). Note: the decodable check F-map section 7 promises (`tests/lib/corefound.js`) does not exist yet, so nothing catches this.

| Text | Title | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | Fun | Opened by |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `FH1.K.15` | Hop the Pet | 5 | – | – | – | – | 5 | – | 4 | 5 | 3 | LV.L01.01 |
| `FH1.K.16` | The Fig in the Cup | 5 | – | – | – | – | 5 | – | 4 | 5 | 3 | LV.L01.02 |
| `FH1.K.17` | The Red Rug | 5 | – | – | – | – | 5 | – | 4 | 5 | 3 | LV.L01.03 |
| `FH1.K.18` | Fun in the Sun | 5 | – | – | – | – | 5 | – | 5 | 4 | 3 | LV.L01.04 |
| `FH1.K.19` | The Pup Can Dig | 5 | – | – | – | – | 5 | – | 4 | 4 | 3 | LV.L01.05 |
| `FH1.K.20` | The Hat on the Dog | 5 | – | – | – | – | 5 | – | 3 | 4 | 3 | LV.L01.06 |
| `FH1.K.21` | The Bug in the Jug | 5 | – | – | – | – | 5 | – | 4 | 4 | 3 | LV.L01.07 |
| `FH1.K.22` | The Wet Dog | 5 | – | – | – | – | 5 | – | 5 | 4 | 3 | LV.L01.08 |
| `FH1.K.23` | Jam on a Bun | 5 | – | – | – | – | 5 | – | 4 | 5 | 4 | LV.L01.09 |
| `FH1.K.24` | Go, Bus, Go! | 5 | – | – | – | – | 5 | – | 5 | 4 | 3 | LV.L01.10 |
| `FH1.K.25` | The Web on the Log | 5 | – | – | – | – | 5 | – | 4 | 5 | 3 | LV.L01.11 |
| `FH1.K.26` | Mop It Up | 5 | – | – | – | – | 5 | – | 5 | 5 | 3 | LV.L01.12 |
| `FH1.K.27` | The Fox in the Box | 5 | – | – | – | – | 5 | – | 4 | 4 | 3 | LV.L01.13 |
| `FH1.K.28` | The Hen in the Box | 5 | – | – | – | – | 5 | – | 4 | 5 | 3 | LV.L01.14 |
| `FH1.K.29` | Go, Van, Go! | 5 | – | – | – | – | 5 | – | 3 | 5 | 3 | LV.L01.15 |
| `FH1.K.30` | Zip Up! | 5 | – | – | – | – | 5 | – | 4 | 5 | 3 | LV.L01.16 |
| `FH1.K.31` | The Quiz | 5 | – | – | – | – | 5 | – | 3 | 4 | 2 | LV.L01.17 |
| `FH1.K.32` | The Red Wax | 5 | – | – | – | – | 5 | – | 4 | 4 | 3 | LV.L01.18 |

## URGENT
1. **`READ.PA.L01.15` piece 4: 🦀 (crab) is a non-kosher creature** on the 3-or-4-sounds sort: `['🦀',1]`. (The same 🦀 is in `READ.PHON.L01.25`'s short-aa findall, line 182, outside this batch: please fix there too.)
2. **`READ.PA.L01.15` piece 4: 🐱 can be named "kitty"** (k-i-t-ee, 4 sounds), but it is keyed 3 sounds (`['🐱',0]`). A boy who says "kitty" and taps 4 is marked wrong for a right answer.

## Notes and copy-ready fixes, lesson by lesson

### `READ.PHON.L01.26` Shhh, Ch, Th — pass
- **p2** — chuh is never modelled before he must sort it: piece 2 sort `say:'Shhh or chuh? Put each picture in its box.'` is the first time ch appears.  
  **Fix:** piece 2 say: `'Shhh is quiet. Chuh is a sneeze! Shhh or chuh?'` (9 words).
- **p7** — ship is in piece 1 (`hear:'ship'`), piece 4 (`'ship'` in the grid) and piece 6 (`['ship','🚢']`).  
  **Fix:** piece 6 pairs: `[['fish','🐟'],['shed','🛖'],['bath','🛁']]` (a word he has not matched before).
- **p8** — sort cards `['🚢',0]` (a boy says "boat") and `['🐚',0]` (a boy says "seashell", sss).  
  **Fix:** `cards:[['🦈',0],['👞',0],['🧀',1],['🪑',1],['🍒',1]]` (shark, shoe).
- **p9** — no people, no family at all; neutral.  
  **Fix:** piece 5 say: `'Eli has a chin. Build chin. Chuh is one tile.'` (10 words).

### `READ.PA.L01.15` Four Sounds — FIX (points below 4)
- **URGENT:** 🦀 non-kosher; 🐱 "kitty" = 4 sounds (see above).
- **p2** — piece 1 asks at once: `say:'Four sounds this time! Push them together.'`; nothing models four sounds out loud first.  
  **Fix:** make piece 1 the model: `{type:'listen', hear:'fff... rrr... ah... guh', o:['🐸','🐟','🦊'], a:'🐸', say:'Fff, rrr, ah, guh. Four sounds! Frog. Your turn: tap it.', how:'Say the four sounds faster and faster.'}` (10 words), and keep piece 5 (tent) as his cold blend.
- **p3** — last piece (blend tent) is the same task as piece 1; the game ends no harder than it starts.  
  **Fix:** last piece: `{type:'tiles', w:['m','i','l','k'], extra:['n'], hear:'milk', say:'Milk. Four sounds. Build it with no help!', how:'Mmm, ih, lll, kuh. One tile for each sound.'}`
- **p4** — piece 1 how "Say the four sounds faster and faster." is fine; piece 4 how "One finger for each sound" never says to count the fingers.  
  **Fix:** piece 4 how: `'Say it slowly. One finger for each sound. Count your fingers.'`
- **p6** — only 5 pieces, 3 kinds (listen ×3, tiles, sort).  
  **Fix:** add the milk tiles above as a sixth piece (keep tent too).
- **p8** — 🐱 kitty; 🦀.  
  **Fix:** piece 4 cards: `[['🐍',1],['🚌',0],['🥁',1],['🐟',0],['☀️',0]]` (snake 4, bus 3, drum 4, fish 3, sun 3).
- **p9** — 🦀 crab; no people.  
  **Fix:** the cards above; piece 2 say: `'Eli has a hand. Hand has four sounds. Build it.'` (9 words).

### `READ.FLU.L01.10` Heart Words: have, of, they — FIX (a point below 4)
- **p2** — no heart is ever put on the tricky part; only `have` gets a reason ("Its last letter is quiet").  
  **Fix:** piece 2 say: `'Of says uv. The f says vvv! That part is the heart.'` (11 words).
- **p3** — pieces 1, 3, 4 are the same hear-and-tap; piece 4 (`are` vs `am`, `an`) is the easiest piece but comes 4th.  
  **Fix:** piece 4 options: `o:['are','ear','air']` → `o:['are','ran','arm']` (look-alikes with a and r).
- **p4** — piece 4 how "Three letters. The last one is quiet." does not tell him how to tell are from am/an.  
  **Fix:** `how:'Look for a, then r, then a quiet e.'`
- **p6** — 3 kinds; 3 of 6 pieces are listen.  
  **Fix:** the cold match below replaces piece 4.
- **p7** — every piece speaks the target before he finds it (`hear:'have'`, `say:'...Tap every of.'`, `hear:'they'`, `say:'...Tap are.'`, both dictations); he never reads a heart word cold. The findall grid `['of','off','of','on','of','if']` can be done by tapping the 3 copies that look the same.  
  **Fix:** replace piece 4 with a cold read: `{type:'match', pairs:[['I have a hat.','🎩'],['They are on a bus.','🚌'],['A cup of milk.','🥛']], say:'Read each one by yourself. Match it to its picture.', how:'Have, they, are, of are heart words. Read every word.'}`
- **p8** — piece 4 `say:'Are is a heart word. It says ar. Tap are.'` reads the answer twice.  
  **Fix:** with the match above this line goes; if kept: `say:'Find the heart word that says ar.'`
- **p9** — "They are my pals." / "We have a dog." are fine but nameless.  
  **Fix:** `hear:'Gad and Dov are my pals.'`, `w:['Gad','and','Dov','are','my','pals.']` (and is a U9 heart word, taught before U10).

### Book games `READ.LV.L01.01`–`.18` — all pass; points shared by all 18
- **p1 (all)** — goal "Read the little book": the Reader reads it to him once; he never reads a whole line of it himself.  
  **Fix (each book):** add a 5th piece, a line from the book: `{type:'dictation', hear:'Hop is a fun pet!', w:['Hop','is','a','fun','pet!'], say:'Build a line from the book. Then read it.', how:'Say it softly. Tap the words in order.'}` (change the line per book).
- **p2 (all)** — the questions are never modelled; the first question is asked cold after the book.  
  **Fix (each):** first question say: `'Think back. Where did Hop sit? Tap the answer.'` (pattern: "Think back." + question).
- **p3 (all)** — the last piece (build or find a 3-letter word) is easier than the sentence sort before it.  
  **Fix (each):** put the tiles/findall piece second and the sort last.
- **p4 (all)** — how lines "Read every word. Think back to the book." give no method.  
  **Fix (each sort):** `how:'Read it. Did the book say that? Yes: thumbs up.'`
- **p6 (all)** — 4 pieces, 3 kinds (story + 2), same shape in all 18 books.  
  **Fix:** the dictation piece above adds a 4th kind.
- **p7 (findall books: .02 .04 .06 .08 .10 .12 .14 .16 .18)** — the target is in the grid 3 times and every other word once (e.g. `['fig','fit','fig','fin','fig','dig']`), so he can tap the 3 copies that look the same without reading.  
  **Fix (example .02):** `{type:'findall', grid:['fig','dig','fit','wig','fin','pig'], find:['fig','dig','wig','pig'], findSay:'word that ends like fig', say:'Tap every word that ends like fig.', how:'Look at the last two letters: ig.'}`
- **p9 (4s)** — plain, warm, but no family or frum touch in these (.04 .05 .06 .07 .08 .10 .13 .17 .18).  
  **Fix (example .09 style):** where a book has food or kindness, say so in the first question; e.g. .18 say `'Zev did a big job! What did he get?'`.

Book-specific:
- **`.03` p8** — mis line `say:'Careful! Some happened in other books. Thumbs up or down.'` but card `'Hop ran in the mud.'` never happened in any book (book 15: "Hop sat in the mud").  
  **Fix:** card `['Hop sat in the mud.',1]`.
- **`.04` p5** — mis line `say:'Careful! What did Dan do first, before the cup?'` rules out both cup answers for him.  
  **Fix:** `say:'Careful! Think of the start of the book. What did Dan do first?'` (12 words).
- **`.06` p8** — the book says "Is it on the dog? It is!" then "The dog had a nap on the hat." (dog on the hat); key `a:'on the dog'`.  
  **Fix (text FH1.K.20 p.3):** `The hat is on the dog. The dog had a nap.`
- **`.11` p8** — card `['Tal cut the web.',0]`: the book never says Tal cut it ("Tal got a big lid. Tap, tap! The web is cut."); a careful reader says 👎.  
  **Fix:** `['Tal got a big lid.',0]`.
- **`.15` p8** — `o:['Ben','Zev','Gad'], a:'Zev'`: Ben "has a van", so a boy may say Ben was in it (he drives it).  
  **Fix:** `o:['Dov','Zev','Gad']`.
- **`.17` p8 / Fun 2** — "Dov did six. Dov did ten!" never says six what; a K boy does not know what a quiz is.  
  **Fix (text FH1.K.31 p.1–2):** `Dov has a quiz. It has ten sums. Is it a big quiz? Yes!` / `Dov did six. Dov did ten! Dov did not quit.` (sums: s-u-m-s, decodable).

### Little readers
- **has / his (K.15 .16 .17 .19 .20 .21 .23 .27 .28 .29 .30 .31 .32) p8** — s says zzz here, never taught and not a listed heart word.  
  **Fix:** teach has and his as heart words (like is) in `READ.FLU.L01.06` and its F-map row: add `{type:'findall', grid:['has','his','hat','has','hit','his'], find:['has','his'], findSay:'has or his', say:'Has and his: the s says zzz! Tap each one.', how:'Huh, then a or i, then zzz.'}`.
- **K.20 p8 3** — "on the dog" vs "nap on the hat" (see `.06`). Fix above.
- **K.29 p8 3** — two young boys own a "big tan van", tug it out of mud, and Zev gets in; who drives? Confusing for a K boy.  
  **Fix (p.3):** `Up, up! The van can go. Ben and Zev got in.` and game `.15` question: `{type:'listen', hear:'Who did tug the van?', o:['Zev and Ben','Gad and Dov','Tal'], a:'Zev and Ben', mis:true, say:'Careful! Who did tug? Tap the answer.', how:'Zev can tug. Ben can tug. Find both.'}`
- **K.31 p8 3** — six what? Fix above (`It has ten sums.`).
- **K.16 / .17 / .27 / .28 p8 4** — has/his only.
- **K.25 p8 4** — "Tal got a big lid. Tap, tap! The web is cut." (a lid does not cut).  
  **Fix (p.3):** `Tal got a big pin. Tap, tap! The web is cut.`
- **K.27 p8 4** — "It is a fox Zev can hug" never says it is a toy; a boy pictures a real fox on his bed.  
  **Fix:** `It is a fox Zev can hug. It is not a fox in a den. It is a fun fox to hug.` (already near this; add the last line.)
- **p9 4s (K.18 .19 .20 .21 .22 .24 .31 .32)** — warm but no family or frum detail (hard with U6–8 letters).  
  **Fix (example K.24 p.4, decodable to U7):** `Ben sat. Tal sat. Tal had a bun. Ben had a bun. Go, bus, go!` (two friends sharing a snack).

Batch 5: 19 of 21 pass; URGENT: 2


---

## Batch 6 · Grade 1 games (CoreDataFH2)

Fresh reviewer (did not write these games). Source: `src/CoreDataFH2.html`. Every piece (say, how, hear, options, answer, mis) read; every answer key and every emoji checked by hand. For a K–1 game, "checks" = its later pieces (point 7 asks whether they use new words).

Points: 1 goal · 2 teaching · 3 progression · 4 thinking steps · 5 mistake work · 6 variety and age fit · 7 taught then asked · 8 correct and clear · 9 warm.

| Lesson | Name | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | Fun | Grade level | Result |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `READ.LV.L02.20` | Rain and Play | 5 | 4 | 5 | 5 | 5 | 5 | 4 | 5 | 5 | 3 | ok | ✓ pass |
| `READ.LV.L02.21` | Tree and Seat | 5 | 4 | 5 | 4 | 5 | 5 | 3 | 5 | 5 | 3 | ok | **✗ fix** |
| `READ.LV.L02.22` | Boat and Snow | 5 | 4 | 5 | 5 | 5 | 5 | 4 | 5 | 5 | 3 | ok | ✓ pass |
| `READ.LV.L02.23` | Which Team? | 5 | 4 | 5 | 5 | 5 | 5 | 3 | 5 | 5 | 3 | ok | **✗ fix** |
| `READ.FLU.L02.20` | Does It Make Sense? | 5 | 4 | 5 | 5 | 5 | 4 | 4 | 4 | 5 | 4 | ok | ✓ pass |
| `READ.LV.L02.24` | Night Flight | 5 | 4 | 5 | 5 | 5 | 5 | 4 | 4 | 4 | 3 | ok | ✓ pass |
| `READ.PHON.L02.40` | Open Door Words | 4 | 5 | 5 | 5 | 5 | 4 | 5 | 5 | 4 | 3 | ok (one-beat only, near easy) | ✓ pass |
| `READ.LV.L02.25` | Happy Puppy | 5 | 5 | 5 | 4 | 5 | 5 | 4 | 5 | 5 | 4 | ok | ✓ pass |
| `READ.FLU.L02.21` | Heart Words: any, many, very | 4 | 5 | 5 | 5 | 5 | 5 | 4 | 5 | 5 | 3 | ok | ✓ pass |
| `READ.PHON.L02.41` | Car Farm | 5 | 5 | 5 | 5 | 5 | 5 | 4 | 5 | 5 | 4 | ok | ✓ pass |
| `READ.PHON.L02.42` | Fork and Storm | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 3 | ok | ✓ pass |
| `READ.PHON.L02.43` | Her, Bird, Fur | 5 | 5 | 5 | 4 | 5 | 5 | 5 | 5 | 5 | 3 | ok | ✓ pass |
| `READ.PHON.L02.44` | Spell Bossy R | 5 | 4 | 5 | 5 | 5 | 5 | 4 | 4 | 5 | 3 | ok | ✓ pass |
| `READ.FLU.L02.22` | Talking in a Story | 5 | 5 | 5 | 5 | 5 | 4 | 5 | 4 | 5 | 4 | ok | ✓ pass |
| `READ.PA.L02.20` | Every Beat Has a Vowel | 5 | 4 | 5 | 5 | 5 | 5 | 5 | 3 | 4 | 4 | ok | **✗ fix** |
| `READ.PHON.L02.45` | Rabbit Split | 5 | 5 | 5 | 5 | 5 | 5 | 3 | 5 | 5 | 3 | ok | **✗ fix** |
| `READ.PHON.L02.46` | Fast, Faster, Fastest | 5 | 5 | 5 | 5 | 5 | 5 | 4 | 4 | 5 | 4 | ok | ✓ pass |
| `WRIT.HAND.L02.20` | Copy It Neatly | 4 | 4 | 5 | 5 | 5 | 5 | 5 | 5 | 4 | 3 | ok | ✓ pass |
| `READ.LV.L02.26` | Cloud and Cow | 5 | 5 | 5 | 5 | 5 | 5 | 3 | 5 | 4 | 3 | ok | **✗ fix** |
| `READ.LV.L02.27` | Coin and Boy | 5 | 5 | 5 | 5 | 5 | 5 | 3 | 4 | 5 | 3 | ok | **✗ fix** |
| `READ.LV.L02.28` | Moon and Book | 5 | 5 | 5 | 5 | 5 | 5 | 3 | 5 | 4 | 3 | ok | **✗ fix** |
| `READ.FLU.L02.23` | Heart Words: friend, people | 5 | 3 | 4 | 4 | 5 | 5 | 4 | 3 | 5 | 3 | ok | **✗ fix** |
| `READ.PHON.L02.47` | Hear It, Write It | 5 | 4 | 5 | 5 | 5 | 4 | 5 | 5 | 5 | 3 | ok | ✓ pass |
| `READ.PHON.L02.48` | Try the Vowel | 5 | 5 | 5 | 5 | 5 | 5 | 3 | 4 | 5 | 3 | ok | **✗ fix** |
| `READ.FLU.L02.24` | Heart Word Dash | 4 | 4 | 5 | 5 | 5 | 5 | 4 | 5 | 5 | 3 | ok | ✓ pass |
| `READ.FLU.L02.25` | Read It 3 Times | 3 | 3 | 4 | 4 | 5 | 4 | 4 | 4 | 5 | 3 | ok | **✗ fix** |

## URGENT
- `READ.FLU.L02.23` match: pairs `['friend','👦👦']` and `['people','👥']`. Two boys ARE people: a boy who matches people → 👦👦 is marked wrong while right.
- `READ.PA.L02.20` sort piece 1: `['🐱',0]` (one beat). A 6-year-old often calls 🐱 "kitty" or "kitten" (two beats): marked wrong while right.

## General note (all 26 games)
- The `how` line is spoken on every miss (`CoreK1.html` miss(): msg + how). Many are 13–19 words, e.g. Rain and Play sort how "Find the two letters that say the long a sound. Are they inside, or at the very end?" (18). The test only counts `say`, so nothing fails, but the HoS rule is "spoken lines of 12 words or fewer". Not scored down here; worth trimming in the same pass.
- Most games open with a sort whose `say` gives the rule plus the model words (good), but no piece models one card out loud first. That is why point 2 is 4, not 5, in several games.

## Notes and copy-ready fixes, game by game

### `READ.LV.L02.21` Tree and Seat — FIX
- **p2** — piece 1 say: "Two teams, one sound: ee! Sort the words by team." (names the sound but never says one model word)  
  **Fix:** say: "Tree has ee. Seat has ea. Both say ee! Sort them."
- **p4** — tiles how "Green is spelled like sheep and feet." / "You read peach in the garden." (memory; there is no rule for ee vs ea, so a rhyme anchor is the real method; fine, but "you read it" is not a method)  
  **Fix:** see p7 (teach rhyme anchors).
- **p7** — both spelling pieces repeat earlier words: tiles `green` (sort card in piece 1), tiles `peach` (match piece 2).  
  **Fix:** `{type:'tiles', w:['s','w','ee','t'], extra:['ea'], hear:'sweet', say:'Bubby\'s cake is sweet. Build sweet.', how:'Sweet rhymes with feet. Spell it the same way.'}` and `{type:'tiles', w:['t','ea','ch'], extra:['ee'], hear:'teach', say:'Rebbi will teach us. Build teach.', how:'Teach rhymes with peach. Spell it the same way.'}`

### `READ.LV.L02.23` Which Team? — FIX
- **p2** — piece 1 say "Read each word. Is the team inside or at the end?" (no model)  
  **Fix:** say: "Rain: ai inside. Day: ay at the end. Now you sort!"
- **p7** — later pieces reuse the model words: tiles `snail` and listen `paint` (both matched in Rain and Play), findall `rain/day/boat` (the bin words of the last three games), dictation "I play in the rain." (both model words).  
  **Fix:** findall `{grid:['wait','wayt','stay','stai','soap','sowp'], find:['wait','stay','soap'], findSay:'right spelling', ...}`; dictation `{type:'dictation', hear:'Wait by the road, Eli.', w:['Wait','by','the','road,','Eli.'], extra:['rowd,'], say:'Listen. Build the sentence. Pick the right teams.', how:'Say it softly. Is each long sound inside a word, or at the end?'}`

### `READ.FLU.L02.20` Does It Make Sense? — pass
- **p2** — piece 1 say "Does it make sense? If not, stop and go back!" (rule, no model). **Fix:** say: "I sail my bat? Silly! Go back: boat. Now you sort!"
- **p6** — only 3 kinds (sort ×2, evidence ×2, tiles). **Fix:** make piece 3 a `listen`: `{type:'listen', hear:'Abba bakes a loaf.', o:['makes sense','go back!'], a:'makes sense', say:'Listen. Does it make sense?', how:'Could that really happen?'}`
- **p7 / p8** — tiles `boat`: hear auto-plays "boat", so the "go back and fix" step is answered by the voice. **Fix:** keep it, but say: "Shmuli read bat. Look again! Build the word that fits." → move it after the second sort and use `goat` with "The bat eats hay." context.

### `READ.LV.L02.24` Night Flight — pass
- **p2** — piece 1 has no model word read for igh. **Fix:** say: "Night has igh. Fly ends in y. Both say long i!" 
- **p7** — evidence `night` repeats the match ("You read it in the match"). **Fix:** p: `['Eli has a bad frite.','Eli has a bad fright.','Eli has a bad fryt.']`, a:1, how: "Fright rhymes with night. Spell it the same way." 
- **p8** — match `['night','🌙']`: the picture is a moon; works only by elimination. **Fix:** `['night','🌃']`.
- **p9** — only one name (Eli). **Fix:** listen say: "Yitzy holds Zeidy's hand tight! Which spelling?" (8)

### `READ.PHON.L02.40` Open Door Words — pass
- **p1/p6** — piece 2 (tiles hen) practises a closed word, and every open word is a K heart word he already knows by sight (no, go, so, he, we, me, be). **Fix:** replace tiles hen with a two-beat open word: `{type:'tiles', w:['ro','bot'], extra:['rob','ot'], hear:'robot', say:'Ro has an open door. Build robot!', how:'Clap it: ro, bot. The first beat ends with the vowel.'}`
- **p9** — no names. **Fix:** dictation hear "He and Eli go." w `['He','and','Eli','go.']`.

### `READ.LV.L02.25` Happy Puppy — pass
- **p4** — evidence how "Sun has a short u, so the n is doubled." (doubling not taught). **Fix:** how: "Clap it: sun, ny. Sun keeps its n, then ny."
- **p7** — dictation "The puppy is happy." both words built/matched earlier. **Fix:** `{type:'dictation', hear:'The bunny is fluffy.', w:['The','bunny','is','fluffy.'], extra:['fluffee.'], ...}`

### `READ.FLU.L02.21` Heart Words: any, many, very — pass
- **p1** — name says "any, many, very" but 3 of 7 pieces are `again`. **Fix:** name: "Heart Words: any, again" or add `again` to the name (30 letters max): "Any, Many, Very, Again".
- **p7** — any/again repeat (expected for heart words); ok.

### `READ.PHON.L02.41` Car Farm — pass
- **p7** — evidence `barn` was sort card 1; dictation `car` is the model. **Fix:** evidence q 'Which sentence is spelled right?', p: `['The dog can bak.','The dog can bark.','The dog can brak.']`, a:1, how: "Say bark slowly. The ar team goes in the middle." 

### `READ.PHON.L02.43` Her, Bird, Fur — pass
- **p4** — listen how "You matched this word to its picture. Think: which team was in it?" (memory). **Fix:** how: "Bird has the i team, like first and shirt."

### `READ.PHON.L02.44` Spell Bossy R — pass
- **p2** — no model before the picture sort. **Fix:** say: "Car says ar. Fork says or. Say each picture!" (8)
- **p7** — all six pictures were matched in the last two games; `corn` again in the right/not right sort. **Fix:** in piece 4 swap `['corn',0],['carn',1]` for `['short',0],['shart',1]`.
- **p8** — `['🫙',0]` (jar): many 6-year-olds call it "bottle" (fits neither bin). **Fix:** `['🦈',0]` (shark).

### `READ.FLU.L02.22` Talking in a Story — pass
- **p6** — 4 kinds, but 3 of 7 are sorts of long sentences ("whispered", "asleep"); heavy reading for Gr 1. **Fix:** shorten: `['"Shh, he is asleep," said Eli.',1]`
- **p8** — how "Look for the little marks, like tiny 66 and 99" but the data uses straight quotes `"`, which do not look like 66/99. **Fix:** use curly quotes “ ” in every card, or how: "Look for the little marks around the words someone says."

### `READ.PA.L02.20` Every Beat Has a Vowel — FIX
- **p2** — piece 1 sort asks before modelling. **Fix:** say: "Cat: one clap. Car-rot: two claps! Clap each one."
- **p8** — URGENT: `['🐱',0]` ("kitty"/"kitten" = two beats).  
  **Fix:** `['🔑',0]` (key: one beat, one name).
- **p9** — one name, no family moment. **Fix:** match say: "Shmuli and Zeidy clap each word. Match its claps."

### `READ.PHON.L02.45` Rabbit Split — FIX
- **p7** — `kitten` appears in the match, the evidence and the dictation; `basket` in sort, match and dictation.  
  **Fix:** evidence `{type:'evidence', q:'Which sentence is spelled right?', p:['Dovid ate a mufin.','Dovid ate a muffin.','Dovid ate a muffen.'], a:1, look:'muffin split into muf and fin', say:'Dovid has a snack! Tap the sentence spelled right.', how:'Clap it: muf, fin. Spell each beat.'}`; dictation `{type:'dictation', hear:'Akiva lost his mitten in the snow.', w:['Akiva','lost','his','mitten','in','the','snow.'], extra:['miten'], say:'Listen. Build the sentence about Akiva.', how:'Say it softly. Split the long word into beats.'}`

### `READ.PHON.L02.46` Fast, Faster, Fastest — pass
- **p7** — dictation `softest` was a sort card. **Fix:** hear "Bubby's pillow is the softest." → "Zeidy's hat is the tallest." w `['Zeidy\'s','hat','is','the','tallest.']`, extra `['taller.']`.
- **p8** — match say "Bike, car, rocket!" reads the answer order aloud. **Fix:** say: "Read each word. Match the right picture." 

### `WRIT.HAND.L02.20` Copy It Neatly — pass
- **p1** — the boy never copies a shown sentence on screen; the copy is "on paper for Abba". **Fix:** first piece shows the model: `{type:'dictation', hear:'I see a cat.', w:['I','see','a','cat.'], extra:['i'], q:'I see a cat.', say:'Look at it. Copy it with the tiles.', how:'Same capital, same spaces, same dot.'}`
- **p2** — opens with the mistake sort. **Fix:** move the evidence piece first with say: "Look! A capital, spaces, a dot. Which copy has them?"
- **p9** — only Abba. **Fix:** trace say: "Copy The for Zeidy's card. Start with a big T." (9)

### `READ.LV.L02.26` Cloud and Cow — FIX
- **p7** — tiles `mouth` was sort card 1; evidence `cloud` was the match; findall `cow` was the match.  
  **Fix:** tiles `{type:'tiles', w:['c','ou','ch'], extra:['ow'], hear:'couch', say:'Zeidy naps on the couch. Build couch.', how:'Couch is spelled like out and shout.'}`; evidence p: `['Avi has a rownd ball.','Avi has a round ball.','Avi has a rond ball.'], how:'Round is spelled like out and found.'`; findall swap `'cow','cot'` for `'howl','hole'`, find `['loud','found','howl']`.
- **p9** — names only in the bin pictures. Covered by the Avi/Zeidy fixes above.

### `READ.LV.L02.27` Coin and Boy — FIX
- **p7** — `joy` (sort 1 → listen → findall), `coin` (match → findall → dictation), `boy` (match → dictation).  
  **Fix:** findall `{grid:['join','jot','coil','cot','soy','sob'], find:['join','coil','soy'], findSay:'word that says oy', ...}`; dictation `{type:'dictation', hear:'The boys join in.', w:['The','boys','join','in.'], extra:['joyn'], say:'Listen. Build the sentence about the boys.', how:'Say it softly. Is each oy sound inside a word or at the end?'}`
- **p8** — match `['toy','🧸']`: he will call it "teddy" or "bear"; works only by elimination. **Fix:** `['toy','🪀']` (yo-yo) or `['toy','🚂']`.

### `READ.LV.L02.28` Moon and Book — FIX
- **p7** — tiles `foot` (sort 1), evidence `book` (match), dictation "Look at the moon!" (sort 1 + match).  
  **Fix:** tiles `{type:'tiles', w:['w','oo','l'], extra:['u'], hear:'wool', mis:true, say:'Careful! Wool sounds like book. Which letters spell it?', how:'The book sound is spelled with the same team as book.'}`; evidence p: `['Abba sweeps with a broom.','Abba sweeps with a brook.','Abba sweeps with a brim.'], a:0`; dictation hear "Shmuli stood on the stool." w `['Shmuli','stood','on','the','stool.']`, extra `['stud']`.
- **p9** — evidence and findall have no family moment; fixed by the Abba line above.

### `READ.FLU.L02.23` Heart Words: friend, people — FIX
- **p2** — piece 1 listen say "Heart words break the rules. Listen and tap the word." No heart word is taught (no tricky part named) before he must pick one.  
  **Fix:** new piece 1: `{type:'findall', grid:['friend','fried','friend','frog','friend','find'], find:'friend', findSay:'friend', say:'Friend: fr, a quiet i, then end. Tap each friend!', how:'Friend has f, r, i, then end. Check every letter.'}` (11 words)
- **p3** — the opening listen (choose people/friend/because) is harder than piece 2 (tiles water). Fixed by the new piece 1.
- **p4** — tiles how "The a in water does not say a, like cat." (letter name spoken; sounds as sounds). **Fix:** how: "Water starts wah. Listen: wah, t, er."
- **p8** — URGENT: match `['friend','👦👦']` and `['people','👥']` (two boys are people).  
  **Fix:** pairs `[['friend','🤝'],['water','💧'],['people','👥']]`

### `READ.PHON.L02.48` Try the Vowel — FIX
- **p7** — tiles `head` and evidence `bread` were both sort cards in piece 1 (bread is also the bin label).  
  **Fix:** tiles `{type:'tiles', w:['s','p','r','ea','d'], extra:['e'], hear:'spread', say:'Bubby spreads jam. Build spread.', how:'Spread is spelled like bread, with a team.'}`; evidence p: `['Eli takes a deep breth.','Eli takes a deep breath.','Eli takes a deep brath.'], a:1, q:'Which sentence is spelled right?'`. Sort 1: swap `['bread',1]` for `['sweat',1]` so the bin label is not also a card.
- **p8** — match `['meat','🍖']`: a boy says "bone" or "chicken"; works by elimination. **Fix:** `['meat','🥩']`.

### `READ.FLU.L02.24` Heart Word Dash — pass
- **p1** — goal says "quickly and surely"; nothing is timed or fast. **Fix:** findall say "Snap! Tap every said before I count to five!" (hold count 1–5 in voice).
- **p2** — no heart word modelled. **Fix:** say: "Said: sss, eh, d. The ai says eh! Tap every said." (10)
- **p7** — words all reviewed (fine for a dash).

### `READ.FLU.L02.25` Read It 3 Times — FIX
- **p1** — goal "Read a short story 3 times". The boy never rereads one passage: Read 1 and Read 2 are different sentences built from tiles, Read 3 is a find question; no piece has him read aloud with expression.  
  **Fix:** make Read 1 a listen-along of one short kite story `{type:'story', text:'F.KITE.G1', say:'Read 1: listen and follow the words.'}` (add the text in `texts/`), then Read 2 and Read 3 use sentences from that same story.
- **p2** — "Read 1: listen. Then scoop it into phrases!" The voice reads the sentence smoothly, so "listen for the little stops" has nothing to hear; a phrase is never modelled.  
  **Fix:** piece 1 say: "Eli and Shmuli... ran to the park. Hear the scoops? Build them!" (12)
- **p4** — sort how "A question mark asks. An exclamation mark shouts. A dot tells." is fine; scoop how "Each scoop is one phrase" uses a word he does not know. **Fix:** how: "Read words that go together in one breath."
- **p6** — 2 dictations of phrases + 1 two-choice listen; no movement or voice work. **Fix:** sort say: "Careful! Look at the end mark. Read it out loud!"
- **p8** — listen o `['choppy','smooth']`: only 2 choices, 50% guess. **Fix:** o `['choppy','smooth','too fast']`, a `'choppy'`.

### Other passes (notes for points scored 4)
- `READ.LV.L02.20` Rain and Play — p2: piece 1 sort models rain/play but no card; p7: tiles `train` was matched in piece 2. **Fix:** tiles w `['ch','ai','n']`, hear 'chain', say "Build chain. The long a sound is inside."
- `READ.LV.L02.22` Boat and Snow — p2: no model card; p7: `coat` and `boat` reappear in findall/evidence. **Fix:** evidence p `['Abba rows to the cowst.','Abba rows to the coast.','Abba rows to the coest.']`, a:1, look 'the inside team'.
- `READ.PHON.L02.47` Hear It, Write It — p2: piece 1 counts words with no model; p6: 3 of 6 are dictations. **Fix:** piece 1 say: "I. See. Me. Three words! Now: hold up a finger each." (11)

Batch 6: 16 of 26 pass; URGENT: 2


---

