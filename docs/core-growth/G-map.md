# Job G · Grammar and words, K–8: the skill map (plan, 2026-11-24)

Owner: job G (see `docs/CORE-GROWTH-LANES.md`). Binding rules: `CLAUDE.md`, `docs/CORE-GROWTH-PROMPT.md`. Where they differ, CLAUDE.md wins.

**The HoS's words (2026-11-24):** "Beef up all their lessons to contain about a half a year's worth of work … the variety of different ways to learn based on proven research … reflective of the age and the skills being taught … no downtime and fluff and boringness." And on grammar: taught **through writing, not label drills** (prompt section 5).

**My one-line check for every G PR:** *Does a boy now build and fix real sentences and learn real words (each small skill taught, then used in his own sentence about something he read), at an even high quality, exciting to do and with no filler?*

## 1. What G covers, and what it does not

| G builds | Another job builds |
|---|---|
| Grammar, usage and sentences K–8 (`LANG.GRAM`, `LANG.USE`, `LANG.SENT`): build, combine, expand, fix | Writing whole pieces (W13 K–3, W48 Gr 4–8, `WRIT.*`). W48's `WRIT.SENT` sentence-craft lessons (variety, strong openings) stay W48's. |
| Mechanics K–8 (`LANG.MECH`): capitals, punctuation; spelling from Grade 3 | Spelling K–2 (`LANG.MECH.L01.01` Sound It Out, `LANG.MECH.L02.03` Pattern Speller): **job F**, because it is phonics |
| Vocabulary and word parts K–8 (`READ.VOC`): context clues, prefixes, roots, suffixes, figurative language, shades of meaning, academic words | Reading the texts (F, C23, C45, C68) |
| **Word Work** sets: 5–8 rich words for each F/C text (kid-friendly meaning, example and non-example, use it) | The Reader and the tap-a-word glossary (job T) |
| **Sentence workouts**: 5-minute "use it in your own sentence about today's text" after a G lesson | The Writing Workshop and teacher inbox (job T), where the boy's own sentences are read |

**Where the line with W13 and W48 is:** G teaches the *sentence move* (combine with *although*, add an appositive, fix a run-on). The writing jobs teach *when and why* a writer uses it in a piece. The existing `WRIT.SENT.L03.01` (Spice It Up) and `WRIT.SENT.L04.01` (Join It) are writing-strand lessons and stay with W13; G's combining and expansion lessons are `LANG.SENT` and come first on the ladder, so W13 can use them as the bridge.

**Ids:** level = grade + 1 (K = L01, Grade 8 = L09). Ids in *italics* are planned; each is added only the way `docs/core-growth/HOW-TO-ADD-A-SKILL.md` says (`node tools/core/add-skill.js next …`, then `add-skill.js G …`), into G's list `src/CoreDataG.js` and lesson files `src/CoreDataG1.html`, `src/CoreDataG2.html`, … (each under 150 KB). `LANG.*` and `READ.VOC.*` sit on the shared Language Arts & Writing and Reading ladders in teaching order.

## 2. What exists today
**46 lessons** are on the ladders in G's strands (34 `LANG.*`, 12 `READ.VOC.*`). 44 are on this map; the 2 K–1 spelling lessons go to job F. Each has a hand-written Teacher Time, reused when it is rebuilt.
- **None meets the HoS standard as a One Bite lesson yet.** Only 5 have a One Bite lesson at all (`READ.VOC.L02.01`, `READ.VOC.L03.01`, `LANG.GRAM.L09.01`, `LANG.MECH.L09.01`, `LANG.USE.L09.01`). Two of them (`READ.VOC.L03.01`, `LANG.MECH.L09.01`) are on `tests/quality-baseline.json` (the to-fix list). The 2026-11-22 audit passed the Grade 8 `LANG.GRAM` and `LANG.USE` lessons on the 9 points, but their activities still need checking against the current gate.
- **Rebuild** in the tables below = the lesson is kept (same id, same place on the map) and gets a full One Bite lesson with `do`/`your` activities that pass the gate. When it passes, it counts. Rebuilt lessons are changed in their own file, never re-added (`TLCORE.add` never replaces a lesson).

## 3. The shape of every G lesson (so 173 lessons stay even)
The One Bite path: **Today we learn → ready check → Watch me → Mistake Detective → Do it with me → Your turn → Show me → Level clear**, and then:
- **Build, fix, use** (Writing Revolution, Hochman & Wexler; *Writing Next*, Graham & Perin 2007: sentence combining is one of the strongest moves; grammar drills alone are not). Every grammar lesson's activities **build** a sentence (tiles, job T's sentence builder), **fix** a broken one (Mistake Detective, sort "fixed / still broken") and end with a **sentence workout**: his own sentence about a text he read, sent to the teacher's inbox. The mastery check stays 3 tap questions.
- **Vocabulary is robust** (Beck, McKeown & Kucan, *Bringing Words to Life*): kid-friendly meaning, an example and a non-example, "would you rather" and "which fits" taps, then the word comes back in later texts. **Word parts** use a prefix + root + suffix builder (Nagy & Anderson; Baumann et al. on morphology teaching). **Context clues** are taught as named clue types (definition, example, contrast, cause), then used on every text.
- **Taught, then asked:** every Show me question is the same kind as Your turn, on new words or sentences (cold). No check prints its answer earlier. No tile order with two right answers (a combined sentence often has two right orders, so combining checks are "which sentence is combined correctly" taps, not free tile orders).
- **By age:**
  - **K1:** all oral first: hear it, tap the picture, move. A song or chant in every unit (the "Naming word, action word" chant; the "Who-what-where" clap). The K–1 home stays **games only**: G's K–1 lessons join the game path in skill order, with no pop-ups.
  - **B23:** sentence strips that snap together, word-family trees, a song for because/but/so.
  - **E45:** "tap the reason" after each right answer (why is this the right comma?).
  - **M68:** teach it back ("Tell your chavrusa when a comma goes before *and*"), a challenge round, real-world sentences (letters, speeches, news).
- **Mistake Detective uses the real errors boys make:** "me and Dovid went", "their/there", "Me and him", "should of", a comma splice, "irregardless", a dangling modifier from a real boy's draft (made up, never a real boy's work).

**Ways of learning in G** (prompt section 5; each unit uses at least 4, and no two lessons in a row share a shape): worked example with fading (W) · retrieval and mixed review (R) · tap the reason / self-explanation (Y) · Mistake Detective (M) · building with tiles and strips (B) · sentence combining and expansion (C) · word-part builder (P) · robust vocabulary: example / non-example (V) · song, chant or movement for K–3 (S) · chavrusa and teach it back (T) · challenge round after mastery (X).

## 4. Word Work and sentence workouts (the part that uses the reading)
- **Word Work set** (one per text the F/C jobs list in "Shared texts"): 5–8 words from the text, chosen as Beck's "Tier 2" words (useful across subjects: *reluctant, fragile, investigate*). 3 screens: meet the words (picture + kid meaning + the sentence from the text), sort examples and non-examples, use one in a sentence. The words come back in the unit check and in later texts. **K–1:** 3 words per listen-along story, all oral, picture taps.
- **Sentence workout** (Grades 2–8): after a grammar or sentence lesson, 5 minutes: "Write one sentence about *[today's text]* that uses *[the skill]*." It goes to the teacher's inbox (job T) with the skill named, so the teacher sees whether he can use it. It is never auto-marked right.
- Until job T's inbox and the Shared texts list exist, Word Work and workouts are written as data on my branch and wait.

## 5. The casts
G is the only job in every band, so it **uses each band's cast** from the lanes file and never makes its own: K1 and B23 when F and C23 write theirs; **E45: the Glen Avenue Crew** (`docs/core-growth/C45-map.md` section 5); **M68: The Beacon newsroom** (`docs/core-growth/W48-map.md` section 7, or C68's if it writes one first). Example sentences in G lessons are about the cast and their world, so the boy meets the same boys in reading, writing and grammar. Modest, warm, normal frum family life; kosher food; boys and men only in pictures; never the Divine Name.

## 6. The ladders, grade by grade
Each row is one small skill lesson (K–1: 4–6 min; Grades 2–3: 6–8; Grades 4–8: 7–9). Each unit ends with a **unit check** (8–12 tap items: every skill of the unit plus 2–3 from earlier units, staged as a "boss level"; passing opens the next unit, a miss sends him to the exact skill; job T builds it). Before each unit, a short **test-out** pre-check skips skills he already has.

### Kindergarten (L01) · band K1
| Unit | Id | Small skill (game name · what he learns) | Std | Status | Min |
|---|---|---|---|---|---|
| **K U1 · Words that name and do** | LANG.GRAM.L01.01 | Naming Words (existing) | L.K.1b | rebuild | 5 |
|  | LANG.GRAM.L01.02 | Action Words (existing) | L.K.1b | rebuild | 5 |
|  | *LANG.GRAM.L01.03* | One or More? · Hear and say plural -s and -es (dog, dogs; box, boxes) | L.K.1c | new | 5 |
|  | *LANG.GRAM.L01.04* | Question Words · Who, what, where, when, why, how | L.K.1d | new | 5 |
| **K U2 · Say a whole sentence** | *LANG.SENT.L01.01* | Whole Thought · A sentence tells who and what happens | L.K.1f | new | 5 |
|  | *LANG.SENT.L01.02* | Tell Me More · Grow a sentence: add where or when | L.K.1f | new | 5 |
|  | *LANG.GRAM.L01.05* | Where Is It? · In, on, under, next to, behind | L.K.1e | new | 5 |
|  | *LANG.SENT.L01.03* | And Joins · Join two ideas with "and" | L.K.1f | new | 5 |
| **K U3 · Word play** | *READ.VOC.L01.01* | Sort It · Sort pictures into groups (food, animals, tools) | L.K.5a | new | 5 |
|  | *READ.VOC.L01.02* | Opposites · Opposites: big, small; hot, cold | L.K.5b | new | 5 |
|  | *READ.VOC.L01.03* | Walk, March, Tiptoe · Act out verbs that are almost the same | L.K.5d | new | 5 |
|  | *READ.VOC.L01.04* | Where Do We See It? · Connect words to real life (a sukkah, a shul) | L.K.5c | new | 4 |
| **K U4 · First marks on the page** | *LANG.MECH.L01.02* | Big Letter First · Capital at the start and for I | L.K.2a | new | 5 |
|  | *LANG.MECH.L01.03* | Stop Sign · A period ends a telling sentence | L.K.2b | new | 5 |
|  | *LANG.GRAM.L01.06* | Ask or Tell? · Hear the difference: asking or telling | L.K.1d | new | 4 |

### Grade 1 (L02) · band K1
| Unit | Id | Small skill (game name · what he learns) | Std | Status | Min |
|---|---|---|---|---|---|
| **G1 U1 · Nouns and their jobs** | *LANG.GRAM.L02.04* | Name or Special Name? · Common and proper nouns | L.1.1b | new | 5 |
|  | LANG.GRAM.L02.01 | One or Many (existing) | L.1.1c | rebuild | 5 |
|  | *LANG.GRAM.L02.05* | Whose Is It? · Possessive nouns with 's (Dovid's hat) | L.1.1b | new | 5 |
|  | LANG.MECH.L02.02 | Proper Names (existing) | L.1.2a | rebuild | 5 |
| **G1 U2 · Verbs that match** | *LANG.GRAM.L02.06* | He Runs, They Run · Match the verb to one or many | L.1.1c | new | 5 |
|  | LANG.GRAM.L02.03 | Then and Now (existing) | L.1.1e | rebuild | 6 |
|  | *LANG.GRAM.L02.07* | I, Me, My, They · Personal pronouns | L.1.1d | new | 5 |
| **G1 U3 · Build and join sentences** | LANG.MECH.L02.01 | Asking or Telling (existing) | L.1.1j | rebuild | 5 |
|  | *LANG.SENT.L02.01* | And, But, Or, So · Join two short sentences | L.1.1g, L.1.1j | new | 6 |
|  | *LANG.SENT.L02.02* | Because · Say why with "because" | L.1.1g | new | 5 |
|  | LANG.GRAM.L02.02 | Describing Words (existing) | L.1.1f | rebuild | 5 |
|  | *LANG.GRAM.L02.08* | A, An, This, That · Pick the right little word (determiners) | L.1.1h | new | 5 |
|  | *LANG.GRAM.L02.09* | Up, Down, Across · Prepositions of place and time | L.1.1i | new | 5 |
| **G1 U4 · Little marks** | *LANG.MECH.L02.04* | Comma Pause · Commas in a date and a list | L.1.2c | new | 5 |
|  | *LANG.MECH.L02.05* | Mark the End · Pick the end mark that fits | L.1.2b | new | 5 |
| **G1 U5 · Words and meanings** | READ.VOC.L02.01 | Word Sort (existing) | L.1.5a | rebuild (has a round-1 bite) | 5 |
|  | *READ.VOC.L02.02* | What Is It? Tell Me Two · Define by group and one detail (a duck is a bird that swims) | L.1.5b | new | 5 |
|  | *READ.VOC.L02.03* | Look, Looks, Looked · Find the root word inside | L.1.4c | new | 5 |
|  | *READ.VOC.L02.04* | Peek, Glance, Stare · Shades of meaning in verbs | L.1.5d | new | 5 |
|  | *READ.VOC.L02.05* | Sentence Clue · Use the sentence to find a word's meaning | L.1.4a | new | 5 |

### Grade 2 (L03) · band B23
| Unit | Id | Small skill (game name · what he learns) | Std | Status | Min |
|---|---|---|---|---|---|
| **G2 U1 · Sentences that work** | LANG.SENT.L03.01 | Whole Thought (existing) | L.2.1f | rebuild | 8 |
|  | *LANG.SENT.L03.02* | Because, But, So · Finish one idea three ways | L.2.1f | new | 8 |
|  | *LANG.SENT.L03.03* | Grow It · Expand a kernel: who, did what, when, where | L.2.1f | new | 7 |
|  | *LANG.SENT.L03.04* | Switch It Around · Move a part to the front: "After Shabbos, we…" | L.2.1f | new | 7 |
| **G2 U2 · Nouns and pronouns** | LANG.GRAM.L03.01 | Irregular Plurals (existing) | L.2.1b | rebuild | 7 |
|  | *LANG.GRAM.L03.03* | A Flock of Words · Collective nouns (a team, a class) | L.2.1a | new | 6 |
|  | *LANG.GRAM.L03.04* | Myself, Himself · Reflexive pronouns | L.2.1c | new | 6 |
| **G2 U3 · Verbs and describing words** | LANG.GRAM.L03.02 | Irregular Past (existing) | L.2.1d | rebuild | 7 |
|  | *LANG.GRAM.L03.05* | How Did He Do It? · Adjective or adverb: quick or quickly | L.2.1e | new | 7 |
|  | *LANG.GRAM.L03.06* | Pick the Best Word · Choose the stronger adjective or adverb | L.2.1e | new | 6 |
| **G2 U4 · Capitals and apostrophes** | *LANG.MECH.L03.02* | Big Names · Capitals for holidays, places and names of things | L.2.2a | new | 7 |
|  | LANG.MECH.L03.01 | Apostrophe Basics (existing) | L.2.2c | rebuild | 8 |
|  | *LANG.MECH.L03.03* | Dear and Love · Commas in a letter's greeting and closing | L.2.2b | new | 6 |
|  | *LANG.USE.L03.01* | Talk or Write? · Talking with friends vs writing for school | L.2.3a | new | 6 |
| **G2 U5 · Word detectives** | READ.VOC.L03.01 | Prefix Start (existing) | L.2.4b | rebuild (on to-fix list) | 7 |
|  | *READ.VOC.L03.02* | Same Root, Same Family · happy, unhappy, happiness | L.2.4c | new | 7 |
|  | *READ.VOC.L03.03* | Two Words, One Word · Compound words: snow + man | L.2.4d | new | 6 |
|  | *READ.VOC.L03.04* | Clue Spotter · Context clues in a sentence | L.2.4a | new | 7 |
|  | *READ.VOC.L03.05* | Look It Up · A glossary in the back of a book | L.2.4e | new | 6 |
|  | *READ.VOC.L03.06* | Toss, Throw, Hurl · Shades of meaning | L.2.5b | new | 6 |

### Grade 3 (L04) · band B23
| Unit | Id | Small skill (game name · what he learns) | Std | Status | Min |
|---|---|---|---|---|---|
| **G3 U1 · Sentence builders** | *LANG.SENT.L04.01* | Simple, Compound, Complex · Three kinds of sentences | L.3.1i | new | 8 |
|  | *LANG.SENT.L04.02* | When, If, Since · Join with a subordinating conjunction | L.3.1h | new | 8 |
|  | *LANG.SENT.L04.03* | Fix the Run-On · Split or join a run-on the right way | L.3.1i | new | 7 |
|  | *LANG.SENT.L04.04* | Combine Two · Two short sentences become one strong one | L.3.1i, L.3.3a | new | 8 |
| **G3 U2 · Parts of speech at work** | *LANG.GRAM.L04.04* | What Job Does It Do? · Noun, verb, adjective, adverb in a sentence | L.3.1a | new | 8 |
|  | *LANG.GRAM.L04.05* | Kindness and Courage · Abstract nouns | L.3.1c | new | 7 |
|  | LANG.GRAM.L04.01 | Pronoun Partners (existing) | L.3.1f | rebuild | 8 |
|  | LANG.GRAM.L04.02 | Agree to Agree (existing) | L.3.1f | rebuild | 8 |
| **G3 U3 · Verbs through time** | *LANG.GRAM.L04.06* | Walked, Walk, Will Walk · Simple verb tenses | L.3.1e | new | 7 |
|  | *LANG.GRAM.L04.07* | Sang, Sung · More irregular verbs | L.3.1d | new | 7 |
|  | LANG.GRAM.L04.03 | Bigger, Biggest (existing) | L.3.1g | rebuild | 7 |
| **G3 U4 · Marks that matter** | LANG.MECH.L04.01 | Capital Check (existing) | L.3.2a | rebuild | 7 |
|  | LANG.MECH.L04.02 | Talking Marks (existing) | L.3.2c | rebuild | 8 |
|  | *LANG.MECH.L04.03* | Street, City, State · Commas in addresses | L.3.2b | new | 6 |
|  | *LANG.MECH.L04.04* | The Boys' Bikes · Plural possessives | L.3.2d | new | 7 |
|  | *LANG.MECH.L04.05* | Add the Ending · Spelling with -ed, -ing, -s (the base word changes) | L.3.2e | new | 7 |
| **G3 U5 · Word parts** | *READ.VOC.L04.04* | Un-, Re-, Pre-, Dis- · Prefixes change meaning | L.3.4b | new | 8 |
|  | *READ.VOC.L04.05* | -ful, -less, -able · Suffixes change meaning | L.3.4b | new | 8 |
|  | *READ.VOC.L04.06* | Root Finder · Use a known root: company, companion | L.3.4c | new | 7 |
|  | READ.VOC.L04.01 | Clue Hunter (existing) | L.3.4a | rebuild | 7 |
|  | READ.VOC.L04.02 | Dictionary Detective (existing) | L.3.4d | rebuild | 7 |
| **G3 U6 · Word meanings and choices** | READ.VOC.L04.03 | Literal or Not (existing) | L.3.5a | rebuild | 7 |
|  | *READ.VOC.L04.07* | Thought, Believed, Suspected · Shades of meaning for "sure" | L.3.5c | new | 7 |
|  | *LANG.USE.L04.01* | Say It Better · Choose words and phrases for effect | L.3.3a | new | 7 |

### Grade 4 (L05) · band E45
| Unit | Id | Small skill (game name · what he learns) | Std | Status | Min |
|---|---|---|---|---|---|
| **G4 U1 · Complete, correct sentences** | *LANG.SENT.L05.01* | Fragment or Sentence? · Find and fix fragments and run-ons | L.4.1f | new | 8 |
|  | *LANG.SENT.L05.02* | Who, Which, That · Combine with a relative pronoun | L.4.1a | new | 9 |
|  | *LANG.SENT.L05.03* | Add a Phrase · Expand with a prepositional phrase | L.4.1e | new | 8 |
|  | LANG.MECH.L05.01 | Comma Rules (existing) | L.4.2c | rebuild | 8 |
| **G4 U2 · Verbs with helpers** | *LANG.GRAM.L05.02* | Was Running, Will Be Running · Progressive tenses | L.4.1b | new | 8 |
|  | *LANG.GRAM.L05.03* | Can, May, Must · Modal verbs | L.4.1c | new | 8 |
|  | LANG.GRAM.L05.01 | Tense Lock (existing) | L.4.1b | rebuild | 8 |
| **G4 U3 · Describe it right** | *LANG.GRAM.L05.04* | Big Old Red Truck · Order of adjectives | L.4.1d | new | 7 |
|  | *LANG.USE.L05.02* | The Precise Word · Pick the exact word (shouted, not said) | L.4.3a | new | 8 |
|  | *LANG.USE.L05.03* | Punctuation for Effect · ! and … and — change how it sounds | L.4.3b | new | 7 |
| **G4 U4 · Talk on the page** | *LANG.MECH.L05.02* | "Quote," He Said · Commas and quotation marks with a speaker tag | L.4.2b | new | 8 |
|  | LANG.USE.L05.01 | Mix-Up Words (existing) | L.4.1g | rebuild | 8 |
|  | *LANG.MECH.L05.03* | Capital Rules Review · Capitals in titles, names and places | L.4.2a | new | 7 |
|  | *LANG.USE.L05.04* | Formal or Friendly? · Choose the style for the reader | L.4.3c | new | 7 |
| **G4 U5 · Greek and Latin builders** | *READ.VOC.L05.02* | Tele, Photo, Graph · Greek parts: telegraph, photograph, autograph | L.4.4b | new | 9 |
|  | *READ.VOC.L05.03* | Word Part Builder · Prefix + root + suffix | L.4.4b | new | 9 |
|  | *READ.VOC.L05.04* | Definition Clues · Context clues: the definition or example is right there | L.4.4a | new | 8 |
|  | *READ.VOC.L05.05* | Dictionary Pro · Pronunciation and the right meaning | L.4.4c | new | 7 |
| **G4 U6 · Words with color** | *READ.VOC.L05.06* | As Brave as a Lion · Similes and metaphors | L.4.5a | new | 8 |
|  | *READ.VOC.L05.07* | Idioms and Sayings · Idioms, adages and proverbs | L.4.5b | new | 8 |
|  | READ.VOC.L05.01 | Same and Opposite (existing) | L.4.5c | rebuild | 7 |
|  | *READ.VOC.L05.08* | School Words · Academic words: compare, explain, describe | L.4.6 | new | 7 |

### Grade 5 (L06) · band E45
| Unit | Id | Small skill (game name · what he learns) | Std | Status | Min |
|---|---|---|---|---|---|
| **G5 U1 · Combine, expand, reduce** | *LANG.SENT.L06.01* | Combine to One · Combine sentences three ways | L.5.3a | new | 9 |
|  | *LANG.SENT.L06.02* | Appositive · Add a noun phrase that renames: "Rabbi Feldman, our rebbe," | L.5.3a | new | 9 |
|  | *LANG.SENT.L06.03* | Cut It Down · Reduce a wordy sentence | L.5.3a | new | 8 |
|  | LANG.GRAM.L06.01 | Conjunction Kit (existing) | L.5.1a | rebuild | 8 |
| **G5 U2 · Verbs and time** | LANG.GRAM.L06.02 | Perfect Tense (existing) | L.5.1b | rebuild | 8 |
|  | *LANG.GRAM.L06.03* | Time Signal · Use tense to show when things happen | L.5.1c | new | 8 |
|  | *LANG.GRAM.L06.04* | Tense Shift Fix · Find and fix a wrong shift in tense | L.5.1d | new | 8 |
| **G5 U3 · Small words, big jobs** | *LANG.GRAM.L06.05* | Either Or, Neither Nor · Correlative conjunctions | L.5.1e | new | 8 |
|  | *LANG.GRAM.L06.06* | Wow! Oh! · Interjections and prepositions | L.5.1a | new | 7 |
|  | *LANG.MECH.L06.03* | Comma in a Series · Commas in a list of phrases | L.5.2a | new | 7 |
|  | *LANG.MECH.L06.04* | Opening Comma · Comma after an introduction | L.5.2b | new | 7 |
| **G5 U4 · Titles and names** | LANG.MECH.L06.01 | Title Style (existing) | L.5.2c | rebuild | 8 |
|  | *LANG.MECH.L06.05* | Book or Chapter? · Italics, underlining or quotation marks for titles | L.5.2d | new | 7 |
|  | LANG.MECH.L06.02 | Suffix Spelling (existing) | L.5.2e | rebuild | 8 |
| **G5 U5 · Roots and clues** | READ.VOC.L06.01 | Root Power (existing) | L.5.4b | rebuild | 9 |
|  | *READ.VOC.L06.03* | Cause and Contrast Clues · Context clues from cause, effect and contrast | L.5.4a | new | 8 |
|  | *READ.VOC.L06.04* | Two Words, Same Spelling · Homographs (a bow, to bow) | L.5.5c | new | 7 |
|  | *READ.VOC.L06.05* | Thesaurus Smart · Find a better word, check its meaning | L.5.4c | new | 7 |
| **G5 U6 · Figurative language** | READ.VOC.L06.02 | Figure It Out (existing) | L.5.5a | rebuild | 8 |
|  | *READ.VOC.L06.06* | What the Saying Means · Idioms, adages and proverbs in a story | L.5.5b | new | 8 |
|  | *READ.VOC.L06.07* | However, Moreover · Words that signal contrast and addition | L.5.6 | new | 7 |

### Grade 6 (L07) · band M68
| Unit | Id | Small skill (game name · what he learns) | Std | Status | Min |
|---|---|---|---|---|---|
| **G6 U1 · Pronouns that point clearly** | LANG.GRAM.L07.01 | Pronoun Precision (existing) | L.6.1a, L.6.1d | rebuild | 9 |
|  | *LANG.GRAM.L07.02* | Myself for Emphasis · Intensive pronouns | L.6.1b | new | 7 |
|  | *LANG.GRAM.L07.03* | Stay in Person · Fix shifts in pronoun number and person | L.6.1c | new | 8 |
| **G6 U2 · Sentence power** | *LANG.SENT.L07.01* | Sentence Combining Lab · Combine 3 sentences with clauses and appositives | L.6.3a | new | 9 |
|  | *LANG.SENT.L07.02* | Kernel to Masterpiece · Expand with phrases that add meaning | L.6.3a | new | 9 |
|  | LANG.MECH.L07.01 | Extra Info (existing) | L.6.2a | rebuild | 8 |
| **G6 U3 · Style and tone** | LANG.USE.L07.01 | Formal Voice (existing) | L.6.3b | rebuild | 8 |
|  | *LANG.USE.L07.02* | Standard English Fix · Recognize and fix slang and errors in formal writing | L.6.1e | new | 8 |
|  | *LANG.MECH.L07.02* | Spell It Right · Grade 6 spelling patterns and checking | L.6.2b | new | 7 |
| **G6 U4 · Roots and checking meaning** | *READ.VOC.L07.02* | Aud, Vis, Port · Greek and Latin roots (audience, visible, transport) | L.6.4b | new | 9 |
|  | *READ.VOC.L07.03* | Clue to Meaning · Context: the sentence and the paragraph | L.6.4a | new | 8 |
|  | *READ.VOC.L07.04* | Check Your Guess · Verify a meaning in a dictionary | L.6.4d | new | 7 |
| **G6 U5 · How words feel** | READ.VOC.L07.01 | Word Choice (existing) | L.6.5c | rebuild | 8 |
|  | *READ.VOC.L07.05* | Thrifty or Stingy? · Connotation: same meaning, different feeling | L.6.5c | new | 8 |
|  | *READ.VOC.L07.06* | The Wind Whispered · Personification | L.6.5a | new | 7 |
| **G6 U6 · Word relationships** | *READ.VOC.L07.07* | Part and Whole · Analogies: cause/effect, part/whole, item/category | L.6.5b | new | 9 |
|  | *READ.VOC.L07.08* | Academic Words · Analyze, evidence, conclude: words for every subject | L.6.6 | new | 8 |

### Grade 7 (L08) · band M68
| Unit | Id | Small skill (game name · what he learns) | Std | Status | Min |
|---|---|---|---|---|---|
| **G7 U1 · Phrases and clauses** | *LANG.GRAM.L08.03* | Phrase or Clause? · Tell a phrase from a clause and its job | L.7.1a | new | 9 |
|  | LANG.GRAM.L08.01 | Clause Builder (existing) | L.7.1b | rebuild | 9 |
|  | *LANG.SENT.L08.01* | Compound-Complex · Build sentences that show how ideas connect | L.7.1b | new | 9 |
| **G7 U2 · Modifiers** | LANG.GRAM.L08.02 | Modifier Fix (existing) | L.7.1c | rebuild | 9 |
|  | *LANG.MECH.L08.01* | Coordinate Adjectives · A comma between adjectives that work alike | L.7.2a | new | 7 |
|  | *LANG.MECH.L08.02* | Spell It Right 7 · Grade 7 spelling patterns | L.7.2b | new | 7 |
| **G7 U3 · Precise and concise** | LANG.USE.L08.01 | Cut the Clutter (existing) | L.7.3a | rebuild | 8 |
|  | *LANG.SENT.L08.02* | Sharpen the Sentence · Replace weak verbs and empty words | L.7.3a | new | 8 |
| **G7 U4 · Roots and clues** | *READ.VOC.L08.03* | Bell, Belli: War Words · Greek and Latin roots (belligerent, bellicose) | L.7.4b | new | 9 |
|  | READ.VOC.L08.02 | Context Master (existing) | L.7.4a, L.7.4c | rebuild | 8 |
|  | *READ.VOC.L08.04* | Check It Twice · Verify an inferred meaning | L.7.4d | new | 7 |
| **G7 U5 · Beyond the literal** | READ.VOC.L08.01 | Beyond Literal (existing) | L.7.5a | rebuild | 8 |
|  | *READ.VOC.L08.05* | Allusions · A phrase that points to a famous story (a David and Goliath match) | L.7.5a | new | 8 |
|  | *READ.VOC.L08.06* | Refined, Polite, Respectful · Connotation and denotation | L.7.5c | new | 8 |
| **G7 U6 · Word relationships** | *READ.VOC.L08.07* | Analogy Ladder · Synonym, antonym and analogy relationships | L.7.5b | new | 9 |
|  | *READ.VOC.L08.08* | Academic Words 7 · Words for argument: claim, counterclaim, relevant | L.7.6 | new | 8 |

### Grade 8 (L09) · band M68
| Unit | Id | Small skill (game name · what he learns) | Std | Status | Min |
|---|---|---|---|---|---|
| **G8 U1 · Verbals** | *LANG.GRAM.L09.02* | Gerunds · An -ing verb used as a noun | L.8.1a | new | 9 |
|  | *LANG.GRAM.L09.03* | Participles · A verb form that describes | L.8.1a | new | 9 |
|  | *LANG.GRAM.L09.04* | Infinitives · To + verb: what it does in a sentence | L.8.1a | new | 8 |
| **G8 U2 · Voice and mood** | LANG.GRAM.L09.01 | Active Voice (existing) | L.8.1b, L.8.3a | rebuild (has a round-1 bite) | 9 |
|  | *LANG.GRAM.L09.05* | If I Were · Verb moods: indicative, imperative, conditional, subjunctive | L.8.1c | new | 9 |
|  | *LANG.GRAM.L09.06* | Shift Check · Fix wrong shifts in voice and mood | L.8.1d | new | 8 |
| **G8 U3 · Punctuation for meaning** | LANG.MECH.L09.01 | Punctuation Pro (existing) | L.8.2a | rebuild (on to-fix list) | 8 |
|  | *LANG.MECH.L09.02* | Leave It Out… · An ellipsis to show words left out of a quote | L.8.2b | new | 7 |
|  | *LANG.MECH.L09.03* | Spell It Right 8 · Grade 8 spelling and commonly confused words | L.8.2c | new | 7 |
|  | LANG.USE.L09.01 | Editor's Eye (existing) | L.8.1, L.8.2 | rebuild (has a round-1 bite) | 9 |
| **G8 U4 · Sentence style** | *LANG.SENT.L09.01* | Style Moves · Parallel structure | L.8.3a | new | 9 |
|  | *LANG.SENT.L09.02* | Emphasis · Put the important part where it lands (end of the sentence) | L.8.3a | new | 8 |
| **G8 U5 · Roots and clues** | *READ.VOC.L09.02* | Ced, Cede: Go · Greek and Latin roots (precede, recede, secede) | L.8.4b | new | 9 |
|  | *READ.VOC.L09.03* | Clue Strategies · Choose the right strategy for an unknown word | L.8.4a, L.8.4d | new | 8 |
| **G8 U6 · Shades and figures** | READ.VOC.L09.01 | Shades of Meaning (existing) | L.8.5b | rebuild | 8 |
|  | *READ.VOC.L09.04* | Irony and Puns · Verbal irony and puns | L.8.5a | new | 8 |
|  | *READ.VOC.L09.05* | Firm or Bullheaded? · Connotation in argument | L.8.5c | new | 8 |
|  | *READ.VOC.L09.06* | Academic Words 8 · Words for research: source, cite, synthesize | L.8.6 | new | 7 |

## 7. Totals (planned; the ledger tracks what is built)
Counted from the tables above by script. Word Work = one set per F/C text (prompt section 2 text counts: K–1 listen-along stories, Grades 2–3 50 texts, Grades 4–5 35, Grades 6–8 30). Sentence workouts = 30–40 per grade (Grades 2–8).

| Grade | Skill lessons (new + rebuild) | Lesson min | Word Work sets (min) | Sentence workouts (min) | Unit checks (min) | **Hours** |
|---|---|---|---|---|---|---|
| Kindergarten | 15 (13 + 2) | 73 | 40 (160) | 0 (0) | 4 (20) | **4.2** |
| Grade 1 | 20 (14 + 6) | 102 | 40 (160) | 0 (0) | 5 (25) | **4.8** |
| Grade 2 | 20 (15 + 5) | 135 | 50 (400) | 30 (150) | 5 (50) | **12.2** |
| Grade 3 | 24 (16 + 8) | 176 | 50 (400) | 30 (150) | 6 (60) | **13.1** |
| Grade 4 | 22 (18 + 4) | 172 | 35 (350) | 40 (200) | 6 (72) | **13.2** |
| Grade 5 | 21 (15 + 6) | 164 | 35 (350) | 40 (200) | 6 (72) | **13.1** |
| Grade 6 | 17 (13 + 4) | 137 | 30 (300) | 40 (200) | 6 (72) | **11.8** |
| Grade 7 | 16 (11 + 5) | 131 | 30 (300) | 40 (200) | 6 (72) | **11.7** |
| Grade 8 | 18 (14 + 4) | 148 | 30 (300) | 40 (200) | 6 (72) | **12.0** |
| **All** | **173 (129 + 44)** | | | | **50** | **96** |


**Why about 12–13 hours a grade (Grades 2–8), not 20:** C45 proposed about 20 hours for grammar and words. G plans what the standards and research need, with no padding: mastery, not drill. A boy who shows a skill moves on, and spaced review (already live) brings old skills back. The extra hours of the half year are better spent reading and writing, where G's skills are *used* (every workout is a sentence about his reading). **For job V:** with C45 ≈ 35, W48 ≈ 22–25, G ≈ 13 and S ≈ 10, Grades 4–5 come to about 80–83 of the 90 core hours; the gap is a question for the comprehension and writing jobs (more texts or pieces), not for more grammar drill. K–1 is small on purpose: K–1 time belongs to foundations (job F), and G's K–1 lessons are short oral games on the game path.

## 8. Order of building (prompt section 2)
1. **Unit 1 of every grade** (K U1 … G8 U1): 4 + 4 + 4 + 4 + 4 + 4 + 3 + 3 + 3 = **33 lessons**, in 2 PRs (K–3, then 4–8), each with the independent 9-point review and pictures at 1366×768 and 390 px. The K–1 lessons are played on the K–1 game path to prove "games only, his grade, in skill order".
2. Then Unit 2 of every grade, and so on.
3. **First, a small rebuild PR:** the 2 lessons on the to-fix list (`READ.VOC.L03.01`, `LANG.MECH.L09.01`) brought up to every gate rule, so the to-fix list shrinks.
4. Word Work sets join each unit when the F/C texts they belong to are live. Sentence workouts join when job T's inbox is live.

## 9. What G needs from other jobs
- **Job T:** the sentence builder and combiner activity kinds, the word-part builder, the teacher inbox (for workouts), unit checks and test-out. Until then, G uses the kit that exists (`tiles`, `sort`, `match`, `findall`, `listen`).
- **F, C23, C45, C68:** their "Shared texts" rows, so each Word Work set and workout names a real text. Until a text is listed, a lesson's own sentences use the band's cast.
- **W13 and W48:** they link to G's sentence skills as bridges; G keeps the `LANG.SENT` ids stable.
- **The K1 and B23 casts** (F and C23 claims are open).

## 10. Helpers wanted (added to the lanes file)
- G · Grades 6–8 (L07–L09), Units 1–6
- G · Word Work sets for C45 and C68 texts (Grades 4–8), once their Shared texts are listed

A helper writes in `src/CoreDataGH<n>.html` and follows this map and the band's cast.
