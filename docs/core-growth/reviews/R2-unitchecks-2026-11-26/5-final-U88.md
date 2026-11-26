# Independent review: unit check C68.U88 "Old Stories, New Stories" (Grade 8, boss level, n=12)

Reviewer: fresh, wrote none of this content. Sources: packet `rv/v5/C68.U88.md`, `rv/v5/pool.json` (all distinct check questions, with passages), `src/CoreDataC68H3.html` (unit at line 308, lessons above it), `texts/C68/C68.SP.01.txt`, `src/CoreUnits.html` build()/question(), `src/CoreKitActs.html` (evidence kind), `docs/core-growth/C68-map.md` unit 8.8, `docs/core-growth/REVIEWS.md`.

Engine facts checked: the boss gets 1 own item per unit skill (5), 1 lesson check per review skill (3), then 4 more own items (so both items of 4 of the 5 skills appear together). The evidence kind shows `look` only after a wrong tap, and in the boss a wrong tap = wrong (`bump` -> answer(false)), so `look`/`how` give nothing away. The pre-check (`pre:'lessons'`) uses the lesson check questions, so the 10 own items stay new for the boss.

## Score row

| 1 goal | 2 teaching | 3 progression | 4 thinking + hard case | 5 mistake work | 6 variety / age | 7 taught then cold | 8 correct + clear | 9 warm |
|---|---|---|---|---|---|---|---|---|
| 5 | 5 | 4 | 5 | 4 | 4 | 4 | 4 | 5 |

**Verdict: PASS** (every point 4 or 5). No URGENT item: no key is wrong, and no item has a second defensible answer. Four small fixes below are recommended (A2, A4, A10; and the borrowed review keys).

### Why each score under 5 (quoted)

- **3 progression = 4.** The map says "unit check 8.8 (the whole year)", but the review list is `['READ.COMP.L09.18','READ.COMP.L09.01','READ.LIT.L09.10']`, all from units 8.5–8.7. Units 8.1–8.4 have no live lessons yet (I grepped `src/` for READ.COMP.L09.04, READ.LIT.L09.03/.06/.08, READ.COMP.L09.08: none), so this is the best possible today. When 8.1–8.4 go live, put one of their skills first in `review` (the engine only takes the first 3). Within the boss the mix runs from labelling (A6, A9) to real judgment (A5, A7, A1), which is fine for a shuffled check.
- **5 mistake work = 4.** The unit's own items are strong (A1 "A stranger on the road who offers to carry the money" is a fine trap; A5 "So the ending stays a surprise" and A7 "Yes: films must cut scenes" are taught ideas used wrongly), and none of the 10 own keys is the longest choice. Two weak spots:
  - A4 distractor B names its own flaw: "after \"We argued, we fixed,\" **so the list of three is split in two**". No boy picks an option that tells him it is a mistake.
  - The 3 "From before" questions are borrowed lesson checks, and their key is the longest choice in 8 of 9: READ.COMP.L09.18 .1 (70 vs 64/58), .2 (22 vs 20/10, and the only two-quote choice), .3 (57 vs 32/28); READ.COMP.L09.01 .1 (41), .2 (75 vs 35/17), .3 (36 vs 24/17); READ.LIT.L09.10 .2 (30), .3 (16). The pre-check pool has the same tell (key longest in 12 of 15). These belong to the other units' lessons, so they do not fail this unit, but in this boss a boy can win the 3 review points by length.
- **6 variety / age fit = 4.** All 10 own items are one kind (`type:'evidence'`, tap 1 of 3 sentences) and all review checks are choose-one, so the boss is 12 three-choice taps. (Siblings U85/U86 are the same 9 evidence + 1 cloze, so this matches the series.) Age fit is good: real Grade 8 judgments. A6 and A9 are easy for Grade 8: A6's choices carry their definitions ("a test: he must choose to do right" right after "He says no"), A9 is spotted at a glance.
- **7 taught then asked / cold = 4.** A2's key repeats a practised pair almost word for word. Lesson practice (CoreDataC68H3 line 46): `['show his hands shaking','to show his fear without words']`. Boss A2 key: "A close-up of his hand shaking on the rail as he climbs." The rest of the own items are new scenes (Yehoshua, Yoni, Shmuel, Akiva's lines, Reuven, Dani, Avi, the siyum), applying the skill cold.
- **8 correct and clear = 4.** Every key is right (table below). Two wording flaws:
  - **A10 vs A5 (likely in the same boss: both are READ.LIT.L09.02 own items).** A5: "A book opens with Reuven, now old, dancing at his grandson's chasunah. Chapter 2 jumps back sixty years". A10: the line is first said "In Chapter 2, a stranger at the ship"; key: "It **echoes the opening** and shows how far he has come." The line does not come from the opening (Chapter 1 is the chasunah); it echoes Chapter 2. A careful boy who just did A5 is told the opening is the chasunah. The key is still the only defensible choice, so not URGENT.
  - **A4** says "Akiva's speech at the Beacon's last edition: \"We built this paper one page at a time ...\"". The boy read Akiva's real speech (`texts/C68/C68.SP.01.txt`, "The Last Edition"); none of these lines is in it, and the lesson taught that its line to remember is "Good. Now do it better." Putting invented lines in Akiva's mouth can confuse the boy who read it. Use a new speaker.

## Key table (checked by hand)

### Own items (boss level)

| # | Skill | Key | Right? | Notes |
|---|---|---|---|---|
| A1 | L09.11 | An old trader who shows him the safe pass, then turns back. | Yes | Guide = shows the way, does not walk it. Stranger who carries the money is a shortcut/test (consistent with Benny "asking strangers for a ride" = tests, and A6). Good hard case. |
| A2 | L09.12 | A close-up of his hand shaking on the rail as he climbs. | Yes | Wide shot = mood of the place, sign = words on screen. Key was practised (line 46). Fix below. |
| A3 | L09.13 | Helping a friend kindly and privately helps him grow. | Yes | B = summary, C = contradicted by the story. "(not a summary)" in q is a mild hint; acceptable. |
| A4 | FLU.L09.03 | just before "And we learned that the truth is worth the work." | Yes | A = mid-phrase, B = splits the list (self-labelled). Speaker fix below. |
| A5 | L09.02 | So we know it ends well and wonder how he got there. | Yes | B contradicts Chapter 1 (we already saw the ending); C literal. Good. |
| A6 | L09.11 | a test: he must choose to do right | Yes | Easy (definition in choice). |
| A7 | L09.12 | No: the ending needs that kindness, so the meaning breaks. | Yes | A is the tempting half-truth (films do cut to fit time). Good. |
| A8 | L09.13 | How you act after a loss shows who you are. | Yes | B contradicted (he practised and lost), C summary. |
| A9 | FLU.L09.03 | We learned in the cold. / We learned in the heat. / We learned until the last daf. | Yes | A = one breath, B = beats inside the parts. Easy. |
| A10 | L09.02 | It echoes the opening and shows how far he has come. | Yes (wording) | A = flashback (taught contrast: flashback vs echo), C = foreshadowing, wrong at the last chapter. "the opening" should be "Chapter 2". Fix below. |

### Review questions in the boss ("From before")

| Id | Key | Right? | Length tell |
|---|---|---|---|
| COMP.L09.18.1 | The storm reached the coast at 4 a.m. with winds of 90 miles per hour. | Yes | longest |
| COMP.L09.18.2 | "failed us" and "must" | Yes | longest, only two-quote choice |
| COMP.L09.18.3 | It added a loaded word, so now it sounds like an opinion. | Yes (the edit also dropped "until 6 p.m."; key is still the only defensible choice) | longest |
| COMP.L09.01.1 | The library should stay open until 8 p.m. (passage shown) | Yes | longest |
| COMP.L09.01.2 | Studies show that streets with trees are up to 10 degrees cooler in summer. | Yes | longest |
| COMP.L09.01.3 | It is one person's story, not facts. | Yes (a brother's word about a hamster) | longest |
| LIT.L09.10.1 | a narrator who knows less | Yes | no |
| LIT.L09.10.2 | the answer stays hidden longer | Yes | longest (by 2 letters) |
| LIT.L09.10.3 | he misses a clue | Yes | longest |

### Pre-check pool (lesson check questions of the 5 unit skills)

| Id | Key | Right? |
|---|---|---|
| LIT.L09.02.1 | each day is one step, from missing home on Sunday to happy on Tuesday (Camp Diary shown) | Yes (longest by far) |
| LIT.L09.02.2 | the story behind an object from long ago (Watch story shown) | Yes |
| LIT.L09.02.3 | to bring the story full circle and resolve it | Yes |
| LIT.L09.11.1 | the call | Yes |
| LIT.L09.11.2 | the guide | Yes ("the dark moment" is taught in the lesson intro, line 119) |
| LIT.L09.11.3 | He sits down and teaches his brother, the way the captain taught him. | Yes |
| LIT.L09.12.1 | Dovid stares at the phone, then at the door, as the music slows. | Yes |
| LIT.L09.12.2 | It fits the time but keeps the scene the meaning needs. | Yes |
| LIT.L09.12.3 | to make the audience feel the fear the book showed in words | Yes |
| LIT.L09.13.1 | a summary | Yes |
| LIT.L09.13.2 | supported by the text | Yes |
| LIT.L09.13.3 | not supported | Yes |
| FLU.L09.03.1 | "be kind, and be brave" | Yes |
| FLU.L09.03.2 | between "strangers." and "We leave" | Yes |
| FLU.L09.03.3 | give each part a short beat | Yes |

No two items that can meet in one boss contradict each other on a key. A1, A6 and the lesson's Benny pairs agree (a ride/shortcut offer = a test, not a guide). A8 and the pre-check's Moshe item are different stories and do not clash. Only the A5/A10 "opening" wording rubs (above).

## Point 9 (warm)
Chasunah, siyum, chavrusa after seder, Zeidy's farm, harvest money for the family, kindness to a stranger; names Yehoshua, Yoni, Shmuel, Akiva, Reuven, Dani, Avi; a mother appears only in words, waiting at home. No Divine Name, no non-kosher food, never the word "bite". (Book-and-film is the lesson's own topic, RL.8.7; not scored here.)

## Copy-ready fixes (recommended; nothing is under 4)

All in `src/CoreDataC68H3.html`, unit `C68.U88` items.

1. **A10 (point 8)** - say where the line really comes from:
   `p:['It jumps back in time to the day Reuven first came to America.','It echoes Chapter 2 and shows how far he has come.','It hints at what will happen next.'], a:1`
2. **A4 (points 5 and 8)** - new speaker, and no self-labelled distractor (key no longer the odd one out by length):
   `q:'Eli\'s speech at the Beacon\'s goodbye party: "We built this paper one page at a time. We argued, we fixed, we tried again. And we learned that the truth is worth the work." Where should the longest pause go?', p:['between "one page" and "at a time"','after "We argued, we fixed,"','before "And we learned"'], a:2`
3. **A2 (point 7)** - a film tool the lesson did not practise as a pair (sound), so he applies the skill cold:
   `p:['A sign on the attic door that says KEEP OUT.','A wide shot of the dark house from across the street at night.','We hear his quick breathing as he climbs, step by step.'], a:2` (keep `look` and `how`).
4. **A6 (point 6, optional)** - drop the definitions so the boy must name the stage:
   `p:['the guide','the tests','the return'], a:1, how:'Is someone helping him, or is he being tried?'`
5. **Borrowed review keys (point 5, for the owners of U86/U87/U85, optional)** - lengthen one distractor so the key is not the longest, e.g. READ.COMP.L09.01.2 add `'My neighbor says the trees on his street are the prettiest in the whole city.'` in place of `'Trees are pretty.'`; READ.COMP.L09.18.1 change `'Every family should buy a storm kit before it is too late.'` to `'Every family in our town should buy a storm kit now, before it is far too late.'`.

## Not done
I did not play the boss as a boy on screen (no screenshots); this is a data review against the engine code.
