# Job F · Foundations K–2: the skill map

Written by job F (session https://claude.ai/code/session_01JPKZXHjMHR8MBsBECX3W7A), 2026-11-24. Docs only. Binding rules: `CLAUDE.md`, `docs/CORE-GROWTH-PROMPT.md`, `docs/ONE-BITE-PLAYBOOK.md`.

**The HoS's request, in his words:** "Beef up all their lessons to contain about a half a year's worth of work … the learning upgraded in a very, very dramatic way … no downtime and fluff and boringness … so that kids want to spend the time doing it."
**Check for this job:** does a Kindergarten, Grade 1 or Grade 2 boy now have half a year of real, new steps in **learning to read** (sounds, letters, reading words, first books, smooth reading), at an even high quality, exciting to do, with no filler?

## 1. What job F covers (and what it leaves to other jobs)

| Area | Job F builds | Left to |
|---|---|---|
| Hearing sounds (phonemic awareness) | K–1, plus a short Grade 2 refresher inside the Grade 2 units | — |
| Letters and sounds, phonics, decoding, word study | K–2 (strands `READ.PHON`, `READ.LV`) | Word parts in Grades 3+ → G |
| Heart words (irregular high-frequency words) | K–2 (`READ.FLU`, "Snap Words") | — |
| Spelling the patterns (dictation, building words) | K–2, inside every phonics unit, plus short "spell it" lessons (`READ.PHON`) | Capitals and punctuation → G (`LANG.MECH`) |
| Handwriting (letter formation, spacing) | K–2 (`WRIT.HAND`) | Cursive (Grade 3, `WRIT.HAND.L04`) → W13 |
| Fluency | K–2 (`READ.FLU`) | Grade 3 fluency → C23 |
| Little readers (decodable books) | K–2 | — |
| Listen-along stories and K–1 understanding (story parts, retell, questions, information books) | **K–1** (`READ.COMP`, `READ.LIT` at L01–L02), because no other job covers K–1 comprehension | Grade 2+ comprehension → C23 |
| Vocabulary lessons, grammar | Rich words are taught *inside* stories (5–8 per listen-along story) | Vocabulary and grammar lessons → G |
| Writing sentences and pieces | — (the K–1 little readers give W13 a picture and words to write about) | W13 |

**Levels:** Kindergarten = `L01`, Grade 1 = `L02`, Grade 2 = `L03` (level = grade + 1).

**Sources.** Grade-level reference: Common Core ELA Reading Foundational Skills (RF.K–2.1–4), plus RL/RI.K–1 for the listen-along work and L.K–2.2 for spelling patterns. Teaching order: the science-of-reading research — National Reading Panel 2000 (phonemic awareness and systematic phonics), Ehri (orthographic mapping: hear the sounds, map them to letters, store the word), Scarborough's reading rope, Kilpatrick (phoneme manipulation), Rasinski and Samuels (repeated reading), Beck, McKeown & Kucan (rich words in read-alouds). The letter-sound order below is built so a boy can **read real words after the first 4 letters** (a common, research-based design: high-use sounds first, look-alikes b/d and p/q kept apart).

## 2. How every F lesson looks

Every small-skill lesson is a One Bite lesson (TODAY WE LEARN → ready check → Watch me → Mistake Detective → Do it with me → Your turn → Show me → LEVEL CLEAR!) that passes `tests/lib/obquality.js`, with a song, chant or movement in every K–2 lesson. The ways of learning used across F (each unit uses at least 4, and no two lessons in a row have the same shape):

| Way | In F lessons | Research |
|---|---|---|
| Oral sound play, no letters | Rhyme, clap, blend, chop, change a sound (`listen` with spoken choices) | NRP 2000; Kilpatrick |
| Sound boxes and word building | One tile per sound, then build the word (`tiles` with `hear`) | Elkonin; Ehri |
| Word chains | cat → hat → hit → hip: change one sound, build the new word | Blevins; Ehri |
| Systematic phonics in a fixed order, then decodable readers | Each little reader uses only taught patterns and taught heart words (a script checks this, section 7) | NRP 2000 |
| Heart words | The tricky part of the word is marked in a heart; the rest is sounded out | Ehri; orthographic mapping |
| Say it, trace it, write it | `trace` on the screen, plus "trace it on paper" off-screen tasks | Orton-Gillingham tradition |
| Dictation | Hear a word or sentence, build or spell it | Moats |
| Songs, chants and movement | Every unit has a sound song and a movement break | — |
| Repeated reading with a model | Hear it read, read along 3 times with the words lighting up; no recording, no timers (HoS) | Rasinski; Samuels 1979 |
| Mistake work | Mistake Detective on the real errors: b/d swaps, guessing from the first letter, skipping the silent e, "said" sounded out | Durkin & Rittle-Johnson 2012 |
| Retrieval and spacing | Ready checks, Show me, unit checks that mix in 2–3 older skills, the live review at 1, 3, 7, 14, 30, 60 days | Roediger & Karpicke; Cepeda |
| Test-out | A unit pre-check: a boy who already reads the pattern skips it | Bloom |

**Rules F keeps on every lesson (from the 2026-11-22 audit of the existing K–1 Reading lessons):**
- **Sounds are written as sounds**, never bare letters, in anything the voice says: "mmm", "sss", "ah", "tuh", "kuh" (the audit found the voice saying "aitch says aitch"). The letter itself is shown, not spoken.
- **No "count the pictures"**: a "how many sounds / beats" item never shows that many pictures.
- **No two right orders** in tiles. **No spoken giveaway**: the voice never reads the word the boy is asked to read.
- **Cold checks**: Show me uses words and sentences that were not on the teaching screens.
- **Practice gets harder**: your 1–5 climbs; the last one is never easier than the first.
- **No real word as a "wrong spelling"** (the audit found "ham" offered as a wrong spelling of "him").

## 3. Kindergarten (L01): "Learning my sounds" — 10 units

**Core skills (Kindergarten):**
1. Hears and plays with the sounds in words (RF.K.2).
2. Knows every letter and its main sound (RF.K.1d, RF.K.3a–b).
3. Reads and builds short-vowel words (CVC) (RF.K.2d, RF.K.3).
4. Reads the first heart words by sight (RF.K.3c).
5. Reads little books with purpose and understanding (RF.K.4).
6. Understands stories and information books read to him: who, where, what happened, retell, questions, new words (RL.K.1–7, RI.K.1–7).
7. Forms every letter correctly (L.K.1a, handwriting).

**Letter-sound order (K):** m a s t · p i n · c/k o d · g h e · f l u r · b j w · y v z · x qu. (b comes 3 units after d; q comes last.)

Key: **E** = existing lesson (kept; "fix" = brought up to the standard first). **N** = new. Minutes are for a typical boy, first time through.

### K Unit 1 · Listening Ears (2 weeks)
| # | Skill | Id | Std | Min |
|---|---|---|---|---|
| 1 | How a book works (front, top, left to right) | E `READ.PA.L01.01` Book Explorer | RF.K.1a | 5 |
| 2 | Words in a sentence: clap each word | N `READ.PA.L01.07` | RF.K.1c | 4 |
| 3 | Hear a rhyme | E `READ.PA.L01.02` Rhyme Time (fix: sounds as sounds) | RF.K.2a | 4 |
| 4 | Make a rhyme | N `READ.PA.L01.08` | RF.K.2a | 4 |
| 5 | Clap the beats (syllables) | E `READ.PA.L01.03` | RF.K.2b | 4 |
| 6 | Push beats together, take one away | N `READ.PA.L01.09` | RF.K.2b | 4 |
| 7 | First sound | E `READ.PA.L01.04` (fix) | RF.K.2d | 4 |
| 8 | Hold your pencil, lines and circles | E `WRIT.HAND.L01.01` Pencil Power | — | 5 |
**Real task:** 4 listen-along stories (Eli's first week; section 6). **Unit check:** 8 items, all oral (rhyme, beats, first sound).

### K Unit 2 · Meet m, a, s, t (1–2 weeks)
| # | Skill | Id | Std | Min |
|---|---|---|---|---|
| 1 | Letters A–D by name | E `READ.PHON.L01.01.a` (fix: "bite" line) | RF.K.1d | 4 |
| 2 | m says mmm, a says ah | N `READ.PHON.L01.05` | RF.K.3a–b | 5 |
| 3 | s says sss, t says tuh | N `READ.PHON.L01.06` | RF.K.3a | 5 |
| 4 | Blend sounds you hear (onset and rime: mmm-at) | E `READ.PA.L01.05` Blend It (fix) | RF.K.2c | 4 |
| 5 | Read my first words: am, at, sat, mat | N `READ.PHON.L01.07` | RF.K.3 | 5 |
| 6 | Heart words: the, a | N `READ.FLU.L01.02` | RF.K.3c | 4 |
| 7 | Write m, a, s, t (say it, trace it, write it) | N `WRIT.HAND.L01.05` | L.K.1a | 5 |
**Real task:** little readers 1–2 ("Sam at the mat" style, only m a s t + the, a). **Unit check.**

### K Unit 3 · p, i, n (1–2 weeks)
| # | Skill | Id | Std | Min |
|---|---|---|---|---|
| 1 | Letters E–H by name | E `READ.PHON.L01.01.b` | RF.K.1d | 4 |
| 2 | p says puh, i says ih | N `READ.PHON.L01.08` | RF.K.3a–b | 5 |
| 3 | n says nnn | N `READ.PHON.L01.09` | RF.K.3a | 4 |
| 4 | Chop a word into sounds (sound boxes) | E `READ.PA.L01.06` Chop It (fix) | RF.K.2d | 4 |
| 5 | Read and build words with a and i (pin, tap, nap) | N `READ.PHON.L01.10` | RF.K.3b | 5 |
| 6 | Heart words: I, is | N `READ.FLU.L01.03` | RF.K.3c | 4 |
| 7 | Write p, i, n | N `WRIT.HAND.L01.06` | L.K.1a | 5 |
**Real task:** little readers 3–5. **Unit check.**

### K Unit 4 · c/k, o, d (1–2 weeks)
| # | Skill | Id | Std | Min |
|---|---|---|---|---|
| 1 | Letters I–L by name | E `READ.PHON.L01.01.c` | RF.K.1d | 4 |
| 2 | c and k both say kuh | N `READ.PHON.L01.11` | RF.K.3a | 5 |
| 3 | o says ah, d says duh | N `READ.PHON.L01.12` | RF.K.3a–b | 5 |
| 4 | Last sound | N `READ.PA.L01.10` | RF.K.2d | 4 |
| 5 | Word chains: cat → cot → dot | N `READ.PHON.L01.13` | RF.K.2e | 5 |
| 6 | Heart words: to, see | N `READ.FLU.L01.04` | RF.K.3c | 4 |
| 7 | Write c, o, d (the "c family") | N `WRIT.HAND.L01.07` | L.K.1a | 5 |
**Real task:** little readers 6–9. **Unit check.**

### K Unit 5 · g, h, e (1–2 weeks)
| # | Skill | Id | Std | Min |
|---|---|---|---|---|
| 1 | Letters M–Q by name | E `READ.PHON.L01.01.d` | RF.K.1d | 4 |
| 2 | g says guh, h says huh | N `READ.PHON.L01.14` | RF.K.3a | 5 |
| 3 | e says eh | N `READ.PHON.L01.15` | RF.K.3b | 4 |
| 4 | Middle sound | N `READ.PA.L01.11` | RF.K.2d | 4 |
| 5 | Short vowel sounds together (a, i, o, e) | E `READ.PHON.L01.03` (fix) | RF.K.3b | 5 |
| 6 | Heart words: we, he, me | N `READ.FLU.L01.05` | RF.K.3c | 4 |
| 7 | Write g, h, e | N `WRIT.HAND.L01.08` | L.K.1a | 5 |
**Real task:** little readers 10–14; listen-along stories 5–12 (Zeidy's farm). **Unit check.**

### K Unit 6 · f, l, u, r (2 weeks)
| # | Skill | Id | Std | Min |
|---|---|---|---|---|
| 1 | Letters R–U by name | E `READ.PHON.L01.01.e` | RF.K.1d | 4 |
| 2 | f says fff, l says lll | N `READ.PHON.L01.16` | RF.K.3a | 5 |
| 3 | u says uh, r says rrr | N `READ.PHON.L01.17` | RF.K.3a–b | 5 |
| 4 | Blend three sounds you hear (phonemes) | N `READ.PA.L01.12` | RF.K.2c | 4 |
| 5 | Read CVC words with every short vowel | E `READ.PHON.L01.04` Read CVC (fix) | RF.K.3b | 5 |
| 6 | Sound it out, don't guess (look at every letter) | N `READ.PHON.L01.18` | RF.K.3d | 5 |
| 6b | Spell it by its sounds (from job G: spelling K–2 is phonics) | E `LANG.MECH.L01.01` Sound It Out | L.K.2c–d | 5 |
| 7 | Write f, l, u, r | N `WRIT.HAND.L01.09` | L.K.1a | 5 |
**Real task:** little readers 15–20. **Unit check** (the first "boss level" that mixes Units 1–6).

### K Unit 7 · b, j, w (and b/d look-alikes) (1–2 weeks)
| # | Skill | Id | Std | Min |
|---|---|---|---|---|
| 1 | b says buh: the bat and ball (b vs d) | N `READ.PHON.L01.19` | RF.K.3a | 5 |
| 2 | j says juh, w says wuh | N `READ.PHON.L01.20` | RF.K.3a | 5 |
| 3 | Change the first sound | N `READ.PA.L01.13` | RF.K.2e | 4 |
| 4 | Heart words: my, go, no, so | N `READ.FLU.L01.06` | RF.K.3c | 4 |
| 5 | Read a sentence: point to each word | N `READ.FLU.L01.07` | RF.K.4 | 5 |
| 6 | Write b, j, w (b starts with a tall line) | N `WRIT.HAND.L01.10` | L.K.1a | 5 |
**Real task:** little readers 21–26. **Unit check.**

### K Unit 8 · y, v, z, x, qu (2 weeks)
| # | Skill | Id | Std | Min |
|---|---|---|---|---|
| 1 | Letters V–Z by name; the whole ABC song | E `READ.PHON.L01.01.f`, E `READ.PHON.L01.01` Letter Lineup | RF.K.1b, 1d | 8 |
| 2 | y says yuh, v says vvv, z says zzz | N `READ.PHON.L01.21` | RF.K.3a | 5 |
| 3 | x says ks (at the end: box, six); qu says kw | N `READ.PHON.L01.22` | RF.K.3a | 5 |
| 4 | Every letter's sound (sound match) | E `READ.PHON.L01.02` Sound Match (fix) | RF.K.3a | 5 |
| 5 | Change the last sound and the middle sound | N `READ.PA.L01.14` | RF.K.2e | 4 |
| 6 | Write y, v, z, x, q | N `WRIT.HAND.L01.11` | L.K.1a | 5 |
**Real task:** little readers 27–32. **Unit check.**

### K Unit 9 · Reading real sentences (2 weeks)
| # | Skill | Id | Std | Min |
|---|---|---|---|---|
| 1 | One more: -s makes more (cats, pins) | N `READ.PHON.L01.23` | RF.K.3 | 5 |
| 2 | Look-alike words: cap or cat? (check every letter) | N `READ.PHON.L01.24` | RF.K.3d | 5 |
| 3 | Snap Words (review of all K heart words so far) | E `READ.FLU.L01.01` | RF.K.3c | 4 |
| 4 | Heart words: like, and, you, said, was | N `READ.FLU.L01.08` | RF.K.3c | 5 |
| 5 | Read it 3 times: smooth like talking | N `READ.FLU.L01.09` | RF.K.4 | 5 |
| 6 | Big letters: capitals I know (names, the first word) | N `WRIT.HAND.L01.12` | L.K.1a | 5 |
**Real task:** little readers 33–40; fluency passages 1–10. **Unit check.**

### K Unit 10 · Long and short; my first chapter (2 weeks)
| # | Skill | Id | Std | Min |
|---|---|---|---|---|
| 1 | Long or short? a says its name in "acorn" | N `READ.PHON.L01.25` | RF.K.3b | 5 |
| 2 | Two letters, one sound: sh, ch, th (a first look) | N `READ.PHON.L01.26` | RF.K.3a | 5 |
| 3 | Chop four-sound words (frog, hand) | N `READ.PA.L01.15` | RF.K.2d | 4 |
| 4 | Heart words: have, of, they, are | N `READ.FLU.L01.10` | RF.K.3c | 5 |
| 5 | Write my name and a short sentence neatly | E `WRIT.HAND.L01.04` Name Writer, E `WRIT.HAND.L01.02`, `.03` | L.K.1a | 15 |
**Real task:** little readers 41–50 (the first 3-chapter little book). **Unit check** (end-of-Kindergarten "boss", mixing all 10 units).

### K listening and understanding (a lesson every 2–3 days, across Units 1–10)
These go with the listen-along stories (section 6). Each one teaches on one story and checks on another.
| # | Skill | Id | Std | Min |
|---|---|---|---|---|
| 1 | Tiny Tales: what happened? | E `READ.COMP.L01.01` | RL.K.1 | 5 |
| 2 | Story Listener: first, next, last | E `READ.COMP.L01.02` (fix) | RL.K.2 | 5 |
| 3 | Who is in the story? (characters) | N `READ.LIT.L01.01` | RL.K.3 | 5 |
| 4 | Where is the story? (setting) | N `READ.LIT.L01.02` | RL.K.3 | 5 |
| 5 | The problem and the fix | N `READ.LIT.L01.03` | RL.K.3 | 5 |
| 6 | Retell it with 3 pictures | N `READ.LIT.L01.04` | RL.K.2 | 5 |
| 7 | Picture clues: what does the picture tell me? | N `READ.COMP.L01.03` | RL.K.7 | 5 |
| 8 | Ask a who / what / where question | N `READ.COMP.L01.04` | RL.K.1 | 5 |
| 9 | A new word in the story: what does it mean? | N `READ.COMP.L01.05` | RL.K.4 | 5 |
| 10 | Story book or fact book? | N `READ.COMP.L01.06` | RL.K.5 | 5 |
| 11 | Fact book: the topic and one fact | N `READ.COMP.L01.07` | RI.K.2 | 5 |
| 12 | Same and different: two characters | N `READ.LIT.L01.05` | RL.K.9 | 5 |

**Kindergarten totals (F):** 81 small-skill lessons (23 existing, 58 new), 50 little readers, 40 listen-along stories, 20 fluency passages, 10 unit checks, 10 unit openers.

## 4. Grade 1 (L02): "I can read!" — 12 units

**Core skills (Grade 1):**
1. Hears, blends, chops and changes every sound, also in blends (RF.1.2).
2. Reads two letters with one sound, blends, silent e, vowel teams, bossy r, endings and two-syllable words (RF.1.3).
3. Reads the Grade 1 heart words by sight (RF.1.3g).
4. Reads Grade 1 books smoothly, with expression, and fixes his own mistakes (RF.1.4).
5. Spells what he can read (L.1.2d–e, dictation).
6. Understands stories and information books: key details, retell, characters, lesson, text features (RL.1, RI.1).
7. Writes neatly with spaces between words (L.1.1a).

### G1 Unit 1 · Back to sounds (1 week)
| # | Skill | Id | Std | Min |
|---|---|---|---|---|
| 1 | Short vowels warm-up: read and build CVC words fast | N `READ.PHON.L02.05` | RF.1.3b | 6 |
| 2 | Swap a Sound | E `READ.PA.L02.01` (fix: sounds as sounds) | RF.1.2d | 5 |
| 3 | Long or short vowel? (hear it) | N `READ.PA.L02.02` | RF.1.2a | 5 |
| 4 | Snap Words 2 | E `READ.FLU.L02.01` (fix: the check names the word; no real-word wrong spellings) | RF.1.3g | 5 |
| 5 | Neat Lines: tall, small and tail letters | E `WRIT.HAND.L02.01` | L.1.1a | 5 |
**Real task:** little readers 1–4. **Unit check.**

### G1 Unit 2 · Two letters, one sound (2 weeks)
| # | Skill | Id | Std | Min |
|---|---|---|---|---|
| 1 | Digraph Duo (sh, ch, th, wh) | E `READ.PHON.L02.01` | RF.1.3a | 6 |
| 2 | sh and ch: ship or chip? | N `READ.PHON.L02.06` | RF.1.3a | 6 |
| 3 | th and wh | N `READ.PHON.L02.07` | RF.1.3a | 6 |
| 4 | ck at the end (duck, back) | N `READ.PHON.L02.08` | RF.1.3a | 6 |
| 5 | Spell it: digraph words (dictation) | N `READ.PHON.L02.09` | L.1.2d | 6 |
| 6 | Heart words: what, where, when, who | N `READ.FLU.L02.03` | RF.1.3g | 5 |
**Real task:** little readers 5–10. **Unit check.**

### G1 Unit 3 · Blends (2 weeks)
| # | Skill | Id | Std | Min |
|---|---|---|---|---|
| 1 | Blend Builders | E `READ.PHON.L02.02` | RF.1.2b | 6 |
| 2 | l-blends: bl, cl, fl, pl, sl | N `READ.PHON.L02.10` | RF.1.2b | 6 |
| 3 | r-blends: br, cr, dr, fr, gr, tr | N `READ.PHON.L02.11` | RF.1.2b | 6 |
| 4 | s-blends: sk, sn, sp, st, sw | N `READ.PHON.L02.12` | RF.1.2b | 6 |
| 5 | Blends at the end: -nd, -nt, -st, -mp | N `READ.PHON.L02.13` | RF.1.2b | 6 |
| 6 | Chop words with blends (4 and 5 sounds) | N `READ.PA.L02.03` | RF.1.2d | 5 |
| 7 | Spaces between words | N `WRIT.HAND.L02.02` | L.1.1a | 5 |
**Real task:** little readers 11–16; fluency passages 1–6. **Unit check.**

### G1 Unit 4 · -ff, -ll, -ss, -ng, -nk (1–2 weeks)
| # | Skill | Id | Std | Min |
|---|---|---|---|---|
| 1 | Double the f, l, s at the end (puff, bell, kiss) | N `READ.PHON.L02.14` | RF.1.3 | 6 |
| 2 | -ng and -nk (ring, bank) | N `READ.PHON.L02.15` | RF.1.3 | 6 |
| 3 | Heart words: there, could, would, should | N `READ.FLU.L02.04` | RF.1.3g | 5 |
| 4 | Smooth Reader | E `READ.FLU.L02.02` | RF.1.4b | 6 |
| 5 | Spell it: blends and endings (dictation) | N `READ.PHON.L02.16` | L.1.2d | 6 |
**Real task:** little readers 17–22. **Unit check.**

### G1 Unit 5 · Silent e (2 weeks)
| # | Skill | Id | Std | Min |
|---|---|---|---|---|
| 1 | Silent E (a_e, i_e) | E `READ.LV.L02.01` | RF.1.3c | 6 |
| 2 | o_e, u_e, e_e | N `READ.LV.L02.03` | RF.1.3c | 6 |
| 3 | Add the e: cap → cape, kit → kite | N `READ.LV.L02.04` | RF.1.3c | 6 |
| 4 | Scoop it: read in phrases | N `READ.FLU.L02.05` | RF.1.4b | 6 |
| 5 | Spell it: silent e words | N `READ.LV.L02.05` | L.1.2d | 6 |
| 5b | Pattern Speller (from job G) | E `LANG.MECH.L02.03` | L.1.2d | 6 |
| 6 | Capital letters, neat and on the line | N `WRIT.HAND.L02.03` | L.1.1a | 5 |
**Real task:** little readers 23–30; fluency passages 7–12. **Unit check.**

### G1 Unit 6 · Endings (1–2 weeks)
| # | Skill | Id | Std | Min |
|---|---|---|---|---|
| 1 | Ending Smart (-s, -ed, -ing) | E `READ.PHON.L02.04` (fix: practice climbs) | RF.1.3f | 6 |
| 2 | -ed says t, d or id | N `READ.PHON.L02.17` | RF.1.3f | 6 |
| 3 | -s or -es? (cats, boxes) | N `READ.PHON.L02.18` | L.1.2d | 6 |
| 4 | Heart words: does, done, some, come | N `READ.FLU.L02.06` | RF.1.3g | 5 |
| 5 | Read it with feeling: . ? ! | N `READ.FLU.L02.07` | RF.1.4b | 6 |
**Real task:** little readers 31–36. **Unit check** (mixes Units 1–6).

### G1 Unit 7 · Vowel teams 1 (2 weeks)
| # | Skill | Id | Std | Min |
|---|---|---|---|---|
| 1 | Vowel Teams 1 (overview) | E `READ.LV.L02.02` | RF.1.3c | 6 |
| 2 | ai and ay (rain, play) | N `READ.LV.L02.06` | RF.1.3c | 6 |
| 3 | ee and ea (tree, seat) | N `READ.LV.L02.07` | RF.1.3c | 6 |
| 4 | oa and ow (boat, snow) | N `READ.LV.L02.08` | RF.1.3c | 6 |
| 5 | Spell it: which team? (rain or rane?) | N `READ.LV.L02.09` | L.1.2d | 6 |
| 6 | Does it make sense? Go back and fix it | N `READ.FLU.L02.08` | RF.1.4c | 6 |
**Real task:** little readers 37–44; fluency passages 13–20. **Unit check.**

### G1 Unit 8 · Long i and long e spellings (1–2 weeks)
| # | Skill | Id | Std | Min |
|---|---|---|---|---|
| 1 | igh and y at the end say i (night, fly) | N `READ.LV.L02.10` | RF.1.3c | 6 |
| 2 | y at the end of a long word says ee (happy) | N `READ.LV.L02.11` | RF.1.3c | 6 |
| 3 | Open syllables: he, go, my | N `READ.PHON.L02.19` | RF.1.3e | 6 |
| 4 | Heart words: again, any, many, very | N `READ.FLU.L02.09` | RF.1.3g | 5 |
**Real task:** little readers 45–50. **Unit check.**

### G1 Unit 9 · Bossy r (2 weeks)
| # | Skill | Id | Std | Min |
|---|---|---|---|---|
| 1 | ar (car, farm) | N `READ.PHON.L02.20` | RF.1.3 | 6 |
| 2 | or (fork, storm) | N `READ.PHON.L02.21` | RF.1.3 | 6 |
| 3 | er, ir, ur all say er | N `READ.PHON.L02.22` | RF.1.3 | 6 |
| 4 | Spell it: bossy r words | N `READ.PHON.L02.23` | L.1.2d | 6 |
| 5 | Read a part: talking in a story (quotes) | N `READ.FLU.L02.10` | RF.1.4b | 6 |
**Real task:** little readers 51–58; fluency passages 21–28. **Unit check.**

### G1 Unit 10 · Two-syllable words (2 weeks)
| # | Skill | Id | Std | Min |
|---|---|---|---|---|
| 1 | Two-Part Words (compound words) | E `READ.PHON.L02.03` | RF.1.3e | 6 |
| 2 | Every beat has a vowel | N `READ.PA.L02.04` | RF.1.3d | 5 |
| 3 | Split between two consonants: rab-bit, nap-kin | N `READ.PHON.L02.24` | RF.1.3e | 6 |
| 4 | -er and -est (faster, fastest) | N `READ.PHON.L02.25` | RF.1.3f | 6 |
| 5 | Copy a sentence neatly | N `WRIT.HAND.L02.04` | L.1.1a | 5 |
**Real task:** little readers 59–66. **Unit check.**

### G1 Unit 11 · More vowel sounds (2 weeks)
| # | Skill | Id | Std | Min |
|---|---|---|---|---|
| 1 | ou and ow say ow (cloud, cow) | N `READ.LV.L02.12` | RF.1.3c | 6 |
| 2 | oi and oy (coin, boy) | N `READ.LV.L02.13` | RF.1.3c | 6 |
| 3 | oo: moon and book | N `READ.LV.L02.14` | RF.1.3c | 6 |
| 4 | Heart words: because, people, water, friend | N `READ.FLU.L02.11` | RF.1.3g | 5 |
| 5 | Sentence dictation: hear it, write it | N `READ.PHON.L02.26` | L.1.2d–e | 6 |
**Real task:** little readers 67–74; fluency passages 29–36. **Unit check.**

### G1 Unit 12 · Putting it all together (1–2 weeks)
| # | Skill | Id | Std | Min |
|---|---|---|---|---|
| 1 | Read a word you never saw: try the vowel sounds | N `READ.PHON.L02.27` | RF.1.3 | 6 |
| 2 | Read the Grade 1 heart words fast | N `READ.FLU.L02.12` | RF.1.3g | 5 |
| 3 | Read a page 3 times: smooth, with expression | N `READ.FLU.L02.13` | RF.1.4 | 6 |
**Real task:** little readers 75–80 (a 4-chapter little book); fluency passages 37–40. **Unit check** (end-of-Grade-1 "boss").

### Grade 1 understanding (a lesson every 2–3 days, with the listen-along stories and little readers)
| # | Skill | Id | Std | Min |
|---|---|---|---|---|
| 1 | Ask and Answer | E `READ.COMP.L02.01` | RL.1.1 | 6 |
| 2 | Story Parts | E `READ.LIT.L02.01` (fix: practice climbs; no order in the q) | RL.1.3 | 6 |
| 3 | Retell with the important details | N `READ.LIT.L02.02` | RL.1.2 | 6 |
| 4 | The lesson of the story | N `READ.LIT.L02.03` | RL.1.2 | 6 |
| 5 | How does he feel? Words that show feelings | N `READ.LIT.L02.04` | RL.1.4 | 6 |
| 6 | Who is telling the story? | N `READ.LIT.L02.05` | RL.1.6 | 6 |
| 7 | Compare two characters' adventures | N `READ.LIT.L02.06` | RL.1.9 | 6 |
| 8 | Main topic and key details | N `READ.COMP.L02.02` | RI.1.2 | 6 |
| 9 | Fact book tools: title, headings, bold words | N `READ.COMP.L02.03` | RI.1.5 | 6 |
| 10 | Pictures and words teach together | N `READ.COMP.L02.04` | RI.1.7 | 6 |
| 11 | The reasons the author gives | N `READ.COMP.L02.05` | RI.1.8 | 6 |
| 12 | Two fact books on one topic | N `READ.COMP.L02.06` | RI.1.9 | 6 |
| 13 | Story or facts? How can I tell? | N `READ.COMP.L02.07` | RL.1.5 | 6 |
| 14 | Word Sort (shelf words: what group?) | E `READ.VOC.L02.01` | L.1.5a | 6 |

**Grade 1 totals (F):** 77 small-skill lessons (14 existing, 63 new), 80 little readers, 30 listen-along stories, 40 fluency passages, 12 unit checks, 12 unit openers.

## 5. Grade 2 (L03): "Word builder" — 6 foundations units

Grade 2 comprehension, literature and the chapter books are job C23's. F builds the Grade 2 **word study and fluency** units. They sit on the same Reading ladder as C23's; the plan is to **alternate** them (F Unit 1, C23 Unit 1, F Unit 2, …) so a boy meets decoding and understanding side by side. C23 and F agree the order when C23 writes its map.

**Where they sit on the live ladder:** today's Grade 2 Reading ladder starts with Vowel Teams 2 (`READ.LV.L03.01`), so F does not move the level's first skill (job T's rule). New skills go in next to the existing lesson they belong with: Unit 1's `READ.PHON.L03.04` goes right before Syllable Splitter (`READ.PHON.L03.01`), and `.05` and `.06` right after it.

**Core skills (Grade 2):**
1. Reads long and short vowels in one- and two-syllable words, and every vowel team (RF.2.3a–c).
2. Splits and reads longer words by syllable type (RF.2.3c–d).
3. Reads common prefixes and suffixes (RF.2.3d).
4. Reads the Grade 2 irregular words (RF.2.3e–f).
5. Reads Grade 2 text smoothly, with expression, and fixes his own mistakes (RF.2.4).
6. Spells the patterns he reads (L.2.2d).

### G2 Unit 1 · Syllables and long-vowel review (2 weeks)
| # | Skill | Id | Std | Min |
|---|---|---|---|---|
| 1 | Long or short? Closed and open syllables | N `READ.PHON.L03.04` | RF.2.3a | 7 |
| 2 | Syllable Splitter | E `READ.PHON.L03.01` (fix: add the two-consonant split; see the audit) | RF.2.3c | 7 |
| 3 | Split after the vowel: ro-bot, mu-sic | N `READ.PHON.L03.05` | RF.2.3c | 7 |
| 4 | Silent e in long words (cupcake, invite) | N `READ.PHON.L03.06` | RF.2.3c | 7 |
| 5 | Fluent Flyer | E `READ.FLU.L03.01` (fix: no answer before the check) | RF.2.4b | 7 |
**Real task:** word-study little readers 1–4; fluency passages 1–6. **Unit check.**

### G2 Unit 2 · Vowel teams 2 (2 weeks)
| # | Skill | Id | Std | Min |
|---|---|---|---|---|
| 1 | Vowel Teams 2 | E `READ.LV.L03.01` (fix) | RF.2.3b | 7 |
| 2 | Vowel Teams 3 | E `READ.LV.L03.02` (fix) | RF.2.3b | 7 |
| 3 | aw, au, al (saw, haul, ball) | N `READ.LV.L03.03` | RF.2.3b | 7 |
| 4 | ew, ue, ui (new, blue, fruit) | N `READ.LV.L03.04` | RF.2.3b | 7 |
| 5 | Vowel teams in two-syllable words (rainbow, peanut) | N `READ.LV.L03.05` | RF.2.3c | 7 |
| 6 | Phrase by phrase: scoop and read | N `READ.FLU.L03.02` | RF.2.4b | 7 |
**Real task:** word-study little readers 5–9; fluency passages 7–14. **Unit check.**

### G2 Unit 3 · Bossy r and tricky endings (2 weeks)
| # | Skill | Id | Std | Min |
|---|---|---|---|---|
| 1 | Bossy R review in long words (garden, turtle) | E `READ.PHON.L03.02` (fix) | RF.2.3c | 7 |
| 2 | air, are, ear (chair, share, bear) | N `READ.LV.L03.06` | RF.2.3b | 7 |
| 3 | Consonant -le (table, puzzle) | N `READ.PHON.L03.07` | RF.2.3c | 7 |
| 4 | -dge and -tch (bridge, catch) | N `READ.PHON.L03.08` | L.2.2d | 7 |
| 5 | Read it with expression: who is talking? | N `READ.FLU.L03.03` | RF.2.4b | 7 |
**Real task:** word-study little readers 10–14; fluency passages 15–20. **Unit check.**

### G2 Unit 4 · Soft c, soft g, silent letters (2 weeks)
| # | Skill | Id | Std | Min |
|---|---|---|---|---|
| 1 | Soft c: c before e, i, y says sss | N `READ.PHON.L03.09` | RF.2.3 | 7 |
| 2 | Soft g: g before e, i, y often says juh | N `READ.PHON.L03.10` | RF.2.3 | 7 |
| 3 | Silent letters: kn, wr, mb, gh | N `READ.PHON.L03.11` | RF.2.3e | 7 |
| 4 | ph says fff | N `READ.PHON.L03.12` | RF.2.3e | 7 |
| 5 | Tricky Spellings (Grade 2 heart words) | E `READ.PHON.L03.03` (fix) | RF.2.3f | 7 |
**Real task:** word-study little readers 15–19; fluency passages 21–28. **Unit check.**

### G2 Unit 5 · Word endings that change the word (2 weeks)
| # | Skill | Id | Std | Min |
|---|---|---|---|---|
| 1 | Drop the e, then add -ing or -ed (bake → baking) | N `READ.PHON.L03.13` | L.2.2d | 7 |
| 2 | Double it: hop → hopping | N `READ.PHON.L03.14` | L.2.2d | 7 |
| 3 | y → i: baby → babies, cry → cried | N `READ.PHON.L03.15` | L.2.2d | 7 |
| 4 | Suffixes -ful, -less, -ly, -ness | N `READ.PHON.L03.16` | RF.2.3d | 7 |
| 5 | Prefixes un-, re-, pre-, dis- (reading them) | N `READ.PHON.L03.17` | RF.2.3d | 7 |
| 6 | Not too fast, not too slow | N `READ.FLU.L03.04` | RF.2.4b | 7 |
**Real task:** word-study little readers 20–24; fluency passages 29–34. **Unit check.**

### G2 Unit 6 · Readers' Theatre and poems (1–2 weeks)
| # | Skill | Id | Std | Min |
|---|---|---|---|---|
| 1 | Read a poem with its beat | N `READ.FLU.L03.05` | RF.2.4b | 7 |
| 2 | Readers' Theatre: take a part | N `READ.FLU.L03.06` | RF.2.4b | 8 |
| 3 | Fix it as you go: does it look right and make sense? | N `READ.FLU.L03.07` | RF.2.4c | 7 |
| 4 | Spell it: Grade 2 pattern dictation | N `READ.PHON.L03.18` | L.2.2d | 7 |
| 5 | Neat writing: a whole paragraph | N `WRIT.HAND.L03.01` | — | 6 |
**Real task:** word-study little reader 25; fluency passages 35–40 (3 Readers' Theatre scripts with the B23 cast). **Unit check** (end-of-Grade-2 word-study "boss").

**Grade 2 totals (F):** 32 small-skill lessons (6 existing, 26 new), 25 word-study little readers, 40 fluency passages, 6 unit checks, 6 unit openers.

## 6. The texts F writes

| Kind | K | Gr 1 | Gr 2 | Rules |
|---|---|---|---|---|
| Little readers (decodable) | 50 (10–60 words; from Unit 2) | 80 (40–200 words) | 25 (150–300 words) | Only taught letter-sounds and taught heart words (a script checks every word against the unit's list). 3 tap questions each. Read 3 times across the week. |
| Listen-along stories and fact books | 40 (150–400 words, read to him) | 30 (250–500 words) | — | 5–8 rich words each, taught with kid meanings and a picture. 30 stories + 10 fact books in K; 20 + 10 in Gr 1, in **topic sets** (e.g. 5 farm books, 5 Shabbos books, 5 weather books). |
| Fluency passages ("read it 3 times") | 20 | 40 | 40 | Hear it read well, then read along 3 times with the words lighting up. Phrases scooped. No timers, no recording. |
| Unit checks | 10 | 12 | 6 | 8–12 tap items, mixed, plus 2–3 from earlier units; staged as a boss level. |

Why Kindergarten has 50 readers and 20 fluency passages, not 80 and 40: a K boy can only read decodable text once he knows about 8 letter-sounds (Unit 3). Padding Units 1–2 with "readers" he cannot read would be filler. The listen-along stories fill that time with real understanding instead.

**Texts are original**, written for Tashbar. A few K–1 listen-along stories are retold Aesop fables (public domain), kept to the Family Life rules. Long texts (over about 300 words) go in job T's content store, not the start-up bundle.

## 7. Checks F adds (on its own files, after job T's note)
- **Decodable check:** every word in a little reader is either sounded out from the patterns taught up to that unit, or a heart word taught by then. A word that breaks this fails the test.
- **Sounds, not letter names:** a spoken field (`say`, `hear`, `how`) never has a bare single consonant letter where a sound is meant.
- **No count giveaway:** no `count` item asks "how many sounds/beats".
- These go in `tests/lib/corefound.js` (an F-owned test file, named with job T's `core*` prefix; job T is told first).

## 8. The cast

### K1 band (K–1): the Peretz family on Maple Street
- **Eli Peretz** (5, Kindergarten): curious, asks "why?", loves Zeidy's goats. The K stories follow him.
- **Shmuli Peretz** (6, Grade 1): Eli's big brother; reads to Eli; proud of his new reading. The Grade 1 stories follow him.
- **Moishy** (the baby), **Abba** (runs Peretz Bakery: challah, rugelach, rolls), **Mommy** (in words only), **Zeidy Avraham and Bubby** (a small farm outside town: goats, hens, a garden, a donkey called Pita).
- **Friends:** Ovadia Mizrachi (his Saba bakes pita and makes Shabbos for the street), Akiva Klein, Yitzy Levi, Refael Abergel, Naftali Stern.
- **Rebbe Gutman** (Eli's rebbe), **Reb Chaim** (the mailman who knows every family).
- **Decodable names** for the first little readers (sounded out with the first letters): **Gad, Dan, Dov, Tal, Zev, Ben**, Eli's friends in the park. The pets: **Hop** (a bunny) and **Pita** (Zeidy's donkey).
- **Places:** Maple Street, the bakery, shul, the park, Zeidy's farm, the library. **Times:** Erev Shabbos, Shabbos, Sukkos in the sukkah, Chanukah, Purim, a rainy day, the first snow.
- **Look:** warm watercolor, round shapes, boys in kippah and tzitzis, men with beards and hats; no women or girls in pictures (picture rules). Kosher food only.

### B23 band (2–3): the Shabbos Street Club (proposed by F; job C23 confirms or extends)
- **Naftali Rosen** (8, Grade 2): builder, keeps a notebook of inventions. **Avi Benhamou** (8): joker, loves maps and his Saba's stories from Morocco. **Chaim Weiss** (9, Grade 3): reads everything, the club's "librarian". **Dovid Katz** (7): youngest, brave, always hungry.
- **Grown-ups:** Rabbi Feld (their rebbe), Naftali's Zeidy (a retired watchmaker with a workshop full of gears), Mr. Benhamou (owns the corner grocery).
- **Settings:** the clubhouse in the Rosens' garage, the shul library, the park by the river, the corner grocery.
- This lets F's Grade 2 little readers and Readers' Theatre scripts feed straight into C23's Grade 2 chapter books.

## 9. Order of building (section 2 of the prompt: Unit 1 of every grade first)
1. Unit 1 of K, Grade 1 and Grade 2 (with fixes to the existing lessons inside those units), plus the first listen-along stories.
2. Then Unit 2 of each grade, and so on.
3. **What F waits for from job T:**
   - `HOW-TO-ADD-A-SKILL.md` on main (branch `claude/core-T-add-skill`): before any lesson PR.
   - How a new K–1 skill joins the K–1 game path (`K1Only.html`): K and Grade 1 lessons cannot go to a K–1 boy until then. **Grade 2 Unit 1 can go first** while T finishes this.
   - The content store and the Reader: for little readers and listen-along stories longer than about 300 words.
   - Unit checks and test-out: until then, F writes the unit-check items in its data files, ready for T's tool.
4. While waiting, F writes lesson data and texts on its own branches (allowed by the prompt, section 3, step 3).

## 10. Totals and minutes

| Grade | Small skills (existing + new) | Little readers | Listen-along | Fluency | Unit checks | F hours (first time through, plus planned rereads and review) | Grade target (all jobs) |
|---|---|---|---|---|---|---|---|
| K | 81 (23 + 58) | 50 | 40 | 20 | 10 | ≈ 36 | 68 |
| 1 | 77 (14 + 63) | 80 | 30 | 40 | 12 | ≈ 52 | 68 |
| 2 | 32 (6 + 26) | 25 | — | 40 | 6 | ≈ 20 | 90 |

The rest of each grade's target comes from G (grammar, vocabulary), W13 (writing) and, in Grade 2, C23 (comprehension and chapter books). The working sheet is `docs/core-growth/F-ledger.md`.

## 11. Helpers wanted (added to the lanes file)
A helper writes into `src/CoreDataFH<n>.html` and claims a piece with a PR titled `Core Growth claim: F helper <piece>`.
1. **F · K Units 6–10** (lessons and little readers).
2. **F · Grade 1 Units 7–12** (lessons and little readers).
3. **F · K–1 listen-along stories** (70 stories and fact books, in topic sets, with their understanding lessons).
4. **F · Grade 2 Units 4–6** (lessons, word-study readers, Readers' Theatre).
