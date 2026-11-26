# Review round 2 · job F · Grade 2 One Bite lessons (2026-11-26)

Written for gap B1a by the builder session https://claude.ai/code/session_018i8rBtzsMZ73AmXKN2L4G3, which wrote none of these lessons. Fresh reviewers (who also wrote none of them) scored each item on the HoS 9 points against its data and EVERY check question the engine can draw (30 builds). V checked every URGENT claim against the data and the code before listing it (see REVIEWS.md, Round 2). Points: 1 goal · 2 teaching · 3 progression · 4 thinking steps · 5 mistake work · 6 variety and age fit · 7 taught then asked · 8 correct and clear · 9 warm.

**Owner: fix the ✗ lessons first (any point below 4). Say in your PR which lines it fixes.**


Fresh, independent reviewer. Each lesson was read in full (oneBite ready / watch / oops / do / your, teacherTime, howto, the engine lesson's teach and practice) and every check question in its check range (check + re, all 6 per lesson) was checked by hand against the key and against what the lesson shows before the check. Story / play / poem texts F.PO.01, F.RT.01, F.WR.15 were read.

Points: 1 goal · 2 teaching · 3 progression · 4 thinking steps · 5 mistake work · 6 variety and age fit · 7 taught then asked · 8 correct and clear · 9 warm.

| Lesson | Name | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | Fun | Grade level | Result |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `READ.PHON.L03.16` | Helpful Endings | 5 | 5 | 5 | 5 | 5 | 4 | 5 | 5 | 5 | 3 | ok | ✓ pass |
| `READ.PHON.L03.17` | Prefix Peel | 5 | 5 | 5 | 5 | 5 | 4 | 4 | 5 | 5 | 4 | ok | ✓ pass |
| `READ.FLU.L03.04` | Just-Right Speed | 5 | 4 | 4 | 4 | 4 | 4 | 4 | 5 | 5 | 3 | ok | ✓ pass |
| `READ.PHON.L03.12` | Phone and Photo | 5 | 5 | 5 | 5 | 5 | 4 | 3 | 5 | 5 | 3 | ok | **✗ fix** |
| `READ.FLU.L03.02` | Scoop and Read | 5 | 5 | 5 | 5 | 5 | 4 | 3 | 5 | 5 | 3 | ok | **✗ fix** |
| `READ.FLU.L03.03` | Who Is Talking? | 5 | 5 | 5 | 5 | 5 | 4 | 5 | 5 | 5 | 4 | ok | ✓ pass |
| `READ.FLU.L03.05` | Poem Beat | 5 | 5 | 5 | 5 | 5 | 5 | 4 | 4 | 5 | 4 | ok | ✓ pass |
| `READ.FLU.L03.06` | Readers' Theatre | 5 | 5 | 5 | 5 | 5 | 4 | 5 | 5 | 5 | 4 | ok | ✓ pass |
| `READ.FLU.L03.07` | Fix It As You Go | 5 | 5 | 5 | 5 | 5 | 4 | 3 | 5 | 5 | 3 | ok | **✗ fix** |
| `READ.PHON.L03.18` | Spell It Back | 5 | 4 | 5 | 5 | 5 | 4 | 2 | 5 | 5 | 3 | ok | **✗ fix** |
| `WRIT.HAND.L03.01` | Neat Paragraph | 5 | 5 | 5 | 5 | 5 | 4 | 4 | 5 | 5 | 3 | ok | ✓ pass |
| `READ.FLU.L03.08` | Spice at the Store | 5 | 4 | 5 | 5 | 5 | 4 | 5 | 4 | 5 | 3 | ok | ✓ pass |

No answer key was found wrong, and no check has a second defensible answer. No Divine Name, no immodesty, food all kosher (soup, challah, cake, pretzels, cocoa, cinnamon).

## Notes and copy-ready fixes

### `READ.PHON.L03.12` Phone and Photo — FIX
- **p7** — 2 of the 6 check-range items are printed word-for-word, with the same wrong choice, in the engine practice spotall before the check: check `Chaim wrote "telefone". How should he spell it?` (a=telephone) = practice cells `telephone` ok / `telefone` not ok; re `Yanky wrote "microfone"` (a=microphone) = practice cells `microphone` / `microfone`. teacherTime idea also says "Telephone, microphone and photo all spell fff with ph."
  **Fix:** check: `{q:'Chaim wrote "megafone". How should he spell it?', o:['megaphone','megafone','megafhone']}` · re: `{q:'Yanky wrote "saxofone". How should he spell it?', o:['saxophone','saxofone','saxofhone']}` (both use the -phone chunk he learned in phone; neither word appears earlier). howto for each: "Think of phone.\nWhich letters spell fff in phone?"

### `READ.FLU.L03.02` Scoop and Read — FIX
- **p7** — check `... / swept the porch / before Shabbos." What does "before Shabbos" tell?` (a=when): the same scoop "before Shabbos" is a card in the engine practice sort, binned `when`. Check `Is this a good scoop or a broken scoop: "ran up the"?` and re `"under the tree"` are 2-choice (good / broken): a boy who guesses passes half the time. So 2 of 3 checks in each set are not a cold test.
  **Fix:** check 1: `{q:'Read: "Chaim and Moishe / swept the porch / at sunrise." What does "at sunrise" tell?', o:['when','where','who']}` · check 2: `{q:'Which is one good scoop?', o:['ran up the hill','ran up the','hill ran up the']}` (a='ran up the hill') · re 3: `{q:'Which is one good scoop?', o:['under the tree','the tree under','under the']}` (a='under the tree'). howto for the new 2 and 3: "Read each one out loud.\nWhich sounds whole, like one idea?"

### `READ.FLU.L03.07` Fix It As You Go — FIX
- **p7** — every check-range item reuses a look-alike pair the boy already met: check `"Zeidy sat in his chain to rest."` (a=chain) = practice pairs `"Mendy sat in a chain." → chair`; check `"The shop sailed on the sea."` (a=shop) = practice sort `The word is "ship"` with card `shop`; check `"Moishe fed the d_ck"` (duck/deck/dock) = practice pairs `duck – dock`; re `cl_ck` (clock/click/cluck) = practice pairs `clock – click`; re `washed his hands with soup` = teach `"We ate hot soap."` and your 2 `soap → soup`.
  **Fix:** check: `{q:'Yanky read: "The frog sat on a log in the pound." Which word does not make sense?', o:['pound','frog','log']}` · `{q:'Read: "Mendy wore his b__ts in the snow." Which word looks right AND makes sense?', o:['boots','bats','bits']}` · `{q:'Chaim read: "Naftali put his hat on his heap." Which word should he look at again?', o:['heap','hat','put']}` · re: `{q:'Read: "Avi read a book in b_d at night." Which word looks right AND makes sense?', o:['bed','bad','bud']}` (keep the other two re items only if their pairs are taken out of practice; else swap soup for `"Dovid brushed his teeth with a brash."` o:['brash','teeth','brushed']). howto lines stay as now ("Read it like talking.\nWhich word could not really happen here?" / "Try each word in the sentence.").
- (optional, p6) do 1 reads `F.RT.01`, the same play already used in Readers' Theatre, and it has nothing to catch. Better: a short practice text with 2 planted look-alike words to find, or keep the play but say: "Read the play. Stop if a word makes no sense." (10 words).

### `READ.PHON.L03.18` Spell It Back — FIX
- **p7 (2)** — all 6 check-range answers are printed, with the same misspelling, in the engine practice spotall "Tap every word spelled the right way": `badge/bage`, `skipping/skiping`, `puppies/puppys`, `knot/nott`, `patch/pach`, `shaping/shapeing`. The check is a copy of the practice grid.
  **Fix:** check: `{q:'Pick the right spelling. A bird sat on the window ___. (short e, then the j sound)', o:['ledge','lege','ledj']}` · `{q:'Pick the right spelling. The boys are ___ for the chassan. (clap + ing)', o:['clapping','claping','clappeing']}` · `{q:'Pick the right spelling. Three little ___ ran in the field. (more than one pony)', o:['ponies','ponys','ponyes']}` · re: `{q:'Pick the right spelling. Abba cut the challah with a ___. (a quiet k, then the n sound)', o:['knife','nife','knif']}` · `{q:'Pick the right spelling. Ima baked a big ___ of cookies. (short a, then the ch sound)', o:['batch','bach','batsh']}` · `{q:'Pick the right spelling. Chaim is ___ his bike to shul. (ride + ing)', o:['riding','rideing','ridding']}`. Keep the howto lines' shape (e.g. "Short e, then the j sound.\nHow is j spelled right after a short vowel?").
- **p2 (4, not failing)** — Watch me models tch, doubling, y→ies, kn and soft c, but never dge, wr or ph, which your 1 (bridge) and your 2 (wrist, graph, fudge) ask. A review lesson, so 4. Optional step: `{t:'I hear: bridge. Short i, then the j sound: dge.', m:{type:'tiles',w:['b','r','i','dge'],hi:[3]}}`.

## Across the batch
- **Check items copied from practice (4 of 12 fail p7).** The engine `practice` spotall / pairs / sort is built from the same words as `check`/`re` (Spell It Back worst: the spotall is the check pool). Before shipping, grep each check answer against `practice`, `teach`, `do`, `your` and Watch me.
- **2-choice checks** (Scoop "good/broken scoop", Prefix Peel "pretty", "rebuild") let a guess pass half the time. Give every check 3 choices.
- **Same skeleton every lesson:** do 2 is always a "Mistake Detective!" listen, your 5 is always "Challenge!", and 5 fluency/handwriting lessons have a "Put the steps in order" of the strategy the boy was just told (Just-Right your 3, Who Is Talking your 4, Readers' Theatre your 5, Fix It your 3, Neat Paragraph your 3), and the engine practice has the same order. That is recall, not a thinking step. Swap one per lesson for a real task (for example, in Just-Right: sort 4 printed readings of one sentence into too fast / too slow / just right).
- **Zaidy / Zeidy spelled both ways** (44 / 26 in this batch; Poem Beat your 4 says "Zeidy" while the rest of the lesson says Zaidy). Pick one (the texts use Zeidy) and use it everywhere.
- **Watch me steps over 12 words** (not checked by the gate): Helpful Endings step 1 (17), Scoop and Read step 5 (30), Just-Right step 6 (20). Split them into two steps.
- **Practice copied straight into oneBite:** many `your` activities are the engine practice item word-for-word (Poem Beat your 1 and 2, Readers' Theatre your 2 and 3, Spell It Back your 5, Fix It your 2 and 4, Neat Paragraph your 1). So the boy does the same item twice when he does both.

Small optional polish (passing lessons): Spice at the Store your 4 asks "What did Mr. Benhamou ask the boys to save him?", but the text says "tell your mother to save me a slice". Better: "What did Mr. Benhamou want Chaim's mother to save him?" · Poem Beat your 3 answer "RAIN-drops DANC-ing DOWN" is printed in Watch me step 3. Use "DRIP, DRIP, DRIP from the LEAF-y TOP" from the poem.

URGENT: 0

---

## Review round 2 (B1a) · batch B · job F · Grade 2 fluency / little readers

Fresh, independent reviewer. Each lesson scored against its oneBite, teacherTime, engine lesson (teach + practice), the story/play text in `texts/F/`, and every check question in `checks` (and the `re` retry set). Every check key was verified by hand; every check word was searched for in the lesson before the check.

| Lesson | Name | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | Fun | Grade level | Result |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `READ.FLU.L03.14` | Ginger in the Cage | 5 | 5 | 5 | 4 | 5 | 4 | 3 | 4 | 5 | 4 | ok | **✗ fix** |
| `READ.FLU.L03.09` | Knots and a Wrapped Gift | 5 | 5 | 5 | 5 | 5 | 4 | 5 | 5 | 5 | 3 | ok | ✓ pass |
| `READ.FLU.L03.15` | The Photo Contest | 5 | 5 | 5 | 5 | 5 | 4 | 4 | 5 | 5 | 4 | ok | ✓ pass |
| `READ.FLU.L03.11` | Baking Day | 5 | 5 | 5 | 5 | 5 | 4 | 4 | 5 | 5 | 4 | ok | ✓ pass |
| `READ.FLU.L03.16` | The Running Race | 5 | 5 | 5 | 5 | 5 | 4 | 4 | 5 | 5 | 4 | ok | ✓ pass |
| `READ.FLU.L03.12` | Berries for the Babies | 5 | 5 | 5 | 5 | 5 | 4 | 3 | 5 | 5 | 4 | ok | **✗ fix** |
| `READ.FLU.L03.17` | The Helpful Club | 5 | 5 | 5 | 5 | 5 | 4 | 3 | 4 | 5 | 3 | ok | **✗ fix** |
| `READ.FLU.L03.10` | Treasure in the Garden | 5 | 4 | 5 | 5 | 5 | 4 | 4 | 5 | 5 | 4 | ok | ✓ pass |
| `READ.FLU.L03.13` | Unpack and Repack | 5 | 5 | 5 | 5 | 5 | 4 | 5 | 5 | 5 | 4 | ok | ✓ pass |
| `READ.FLU.L03.18` | Theatre: The Lost Siddur | 5 | 5 | 5 | 5 | 5 | 4 | 5 | 5 | 5 | 4 | ok | ✓ pass |
| `READ.FLU.L03.19` | Theatre: The Snow Day Fort | 5 | 5 | 5 | 5 | 5 | 4 | 4 | 5 | 5 | 5 | ok | ✓ pass |
| `READ.FLU.L03.20` | The Club Fair | 5 | 4 | 5 | 5 | 4 | 4 | 4 | 5 | 5 | 4 | ok | ✓ pass |

## Lessons to fix

### `READ.FLU.L03.14` Ginger in the Cage — FIX
- **p7** — 2 of 3 check answers were shown earlier: check "What does the g in large say?" and check "What does the g in magic say?"; the practice sort has `{label:'large',bin:'s'}` and `{label:'magic',bin:'s'}` under "Soft g: j".  
  **Fix:** in practice sort 1 replace `{label:'large',bin:'s'}` with `{label:'edge',bin:'s'}` and `{label:'magic',bin:'s'}` with `{label:'giant',bin:'s'}`. Replace check 2 with a cold hard-g item (see p4).
- **p4** — all 3 drawn checks (large, magic, gym) have the answer "j". A boy who taps "j" every time gets 3 of 3 without looking at the next letter.  
  **Fix:** check 2: `{q:'Read: "Chaim fed the goose." What does the g in goose say?', o:['g as in go','j','no sound'], a:'g as in go'}`; howto for it: "Look at the letter right after it.\nIs it e, i or y?"
- **p8** — the story teaches "g before e says j" but has "behind the big box of **gears**" (hard g before e, not flagged). Watch step 1 also says it with no "often": "Ginger, gentle, gerbil: g before i or e says j."  
  **Fix:** text F.WR.16: "They looked behind the big box of blocks." Watch step 1 t: "Ginger, gentle, gerbil: g before e or i often says j." (10 words)

### `READ.FLU.L03.12` Berries for the Babies — FIX
- **p7** — all 3 check answers are in the practice before the check: puppies and fried are in the spotall (`puppies` ok, `fried` ok), and ponies is in pairs `["ponies","pony"]`. The retry item ladies is in the same pairs (`["ladies","lady"]`). Also, 2 of 3 checks have the same answer ("the y changes to i").  
  **Fix (practice, keeps the checks cold):** spotall cells → `[{label:'cherries',ok:true},{label:'cherrys',ok:false},{label:'copied',ok:true},{label:'copyed',ok:false}]`; pairs 2 → `[["pennies","penny"],["jellies","jelly"],["ponds","pond"]]`.  
  **And check 2:** `{q:'Read: "Avi enjoyed the trip." What happened to the base word enjoy?', o:['nothing changed','the y changes to i','a letter was doubled'], a:'nothing changed'}` (vowel before y, as taught with played).

### `READ.FLU.L03.17` The Helpful Club — FIX
- **p7** — every check and every retry item was answered word-for-word in the practice before it: check "cloudless" = pairs `["cloudless","no clouds at all"]`; check "carefully … with care" = pairs `["carefully","with care"]`; check "sadness" = spotall cell `sadness`; retries thankful, fearless, loudly = pairs `["thankful","full of thanks"]`, `["fearless","not afraid at all"]`, `["loudly","in a loud way"]`. The check tests memory, not the suffix skill.  
  **Fix (practice):** pairs 6 → `[["hopeful","full of hope"],["painless","no pain at all"],["gladly","in a glad way"]]`; pairs 7 → `[["joyful","full of joy"],["brightly","in a bright way"]]`; in the spotall replace `{label:'sadness',ok:true}` with `{label:'darkness',ok:true}`.
- **p8** (minor) — Mr. Gold's story: "There was no light at night, just candles." A shul in Mr. Gold's boyhood had electric lights; a Grade 2 boy may take it as fact.  
  **Fix:** "The shul was small, and the boys learned at one long table."

## Notes on passing lessons (points at 4; fix when convenient)
- `READ.FLU.L03.15` p7: check "graph" is in the practice sort (`{label:'graph',bin:'f'}`). **Fix:** sort item → `{label:'gopher',bin:'f'}` (not nephew: that is a retry word).
- `READ.FLU.L03.11` p7: check "waving → wave" is in pairs `["waving","wave"]`. **Fix:** pairs item → `["joking","joke"]`.
- `READ.FLU.L03.16` p7: check "clapping → clap" is in the spotall (`clapping`) and both sorts (`clapped`). **Fix:** check 3 → `{q:'Read: "Dovid was hugging his Zeidy." What is the base word of hugging?', o:['hug','hugg','huge'], a:'hug'}`.
- `READ.FLU.L03.19` p7: check "Which line should sound the strongest?" uses the exact three lines of your 4 (evidence) and the spotall ("DOVID: (shouting) Me! Me! Me!"). **Fix:** check 3 → `{q:'Which line should sound the strongest?', o:['NAFTALI: (cheering) We won!','NAFTALI: (softly) We won!','NAFTALI: We won.'], a:'NAFTALI: (cheering) We won!'}`.
- `READ.FLU.L03.10` p2/p7: the watch only lists patterns ("Knelt and wrote: quiet letters."); check "plumber" has mb in the middle, but Grade 2 taught "mb at the end". Answer b is correct and "say it out loud" gets him there. **Fix:** watch step 3 t: "Knelt, wrote, climb: quiet letters. Read past them!"
- `READ.FLU.L03.20` p2/p5: the mistake (do 2, "cheered" in one beat) uses -ed sounds that this lesson never shows. **Fix:** watch step 3 t: "Shaping, sprinkling, cheered. Cheered has one beat: cheerd!" (8 words)
- `READ.FLU.L03.18` / `L03.19` / `L03.11` / `L03.09` p6: two "your" activities copy the engine practice word for word (L03.18 your 2 match + your 4 order; L03.19 your 1 sort + your 3 match; L03.11 and L03.09 your 3 order). The boy does the same task twice.

## Across the batch
- **Practice built from the check words** (L03.12, L03.17, L03.14; one word in L03.11, L03.15, L03.16, L03.19): the engine practice uses the very words the check asks about, so the check is not cold. Before shipping, search the practice for each check and retry word.
- **Same 7-step shape in all 12 lessons:** read → listen (Mistake Detective) → proof → findall → (one varied kind) → proof → cloze. Only your 3 changes. p6 stays at 4 everywhere; vary at least one more slot per lesson (e.g. dictation, parts, storymap, evidence are already in the kit).
- **"Your" activities that copy the engine practice** (story order, word-meaning match, who-said-it sort) appear in 4 lessons; replace them with a new task on the same story.
- **Move lines over 12 words** in 9 lessons (e.g. L03.09 "Put a finger on your lips for every quiet letter: k in knot, w in wrap, b in lamb!", 19 words). If the move line is spoken, cut it to 12 words or fewer.
- Good across the batch: warm, frum Shabbos Street Club stories (brachah and checking berries, challah for Shabbos, fixing a kippah before a race, a lost siddur), kosher food, a wide mix of names (Benhamou, Feld, Gold, Rosen), clear "How to do it" lines that teach a method without the answer, and every check key verified correct.

URGENT: 0
