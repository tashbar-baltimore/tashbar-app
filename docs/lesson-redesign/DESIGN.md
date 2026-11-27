# New Lessons: the design (HoS 2026-11-27)

**What the HoS asked for, in his words:** "I am not loving the way the lessons flow. The boys still have a lot of repetitive clicking that does not encourage understanding and it is boring. Redo the way lessons are taught, add much better informative graphics and interactive lessons and fun different ways to learn, and teach it in simple, quick, super kid-friendly language." Text "should be easy and fun to read, lay on the screen nicely, and the words that matter should be highlighted and pop." Hooks: "a picture, puzzle, a cool hook ... shouldn't be repetitive and boring, and they shouldn't be like the same three things."

**HoS decisions (2026-11-27):** fewer, deeper activities instead of the fixed 2 + 5 · the fixed six steps change · done in 1.0 · go live.

## What was wrong (audit, `AUDIT.md`)
A live lesson takes 39–48 taps. About 4 in 10 are "Next" taps that only show more words (Watch Me alone: 8 "Next step" taps of text). Many "your turn" screens are the same match or sort with new numbers. A boy can click through by pattern.

## The new lesson: 5 parts, every tap makes him think
| Dot | Boy sees | What happens | Rule |
|---|---|---|---|
| 1 | **🤔 THINK** | **The hook.** A picture, puzzle, mystery, "what's wrong here?", guess, odd one out, riddle, challenge, story moment... He taps a guess. No right or wrong yet: "Let's find out!" | A different hook kind from the lesson before it. Never the same three kinds over and over. |
| 2 | **💡 LEARN** | **Learn by doing.** 2–4 short cards that build on the screen as he goes. Each card has one or two short sentences with the **key words highlighted**, and a picture he works with (blocks, number line, map, timeline, sentence parts...). Most cards ask him to DO the step (drag, build, tap), and the next card appears by itself when he gets it. One card is **Who's right?**: two boys, two answers, he picks who is right and sees why. | At least half the cards are hands-on. No card is just text. |
| 3 | **🎮 TRY IT** | **3–5 deep activities**, all different kinds, mixed among: build it, fix the mistake, sort, put in order, find the proof, map, word parts, hop the number line, explain why... | 3+ kinds, no kind twice in a row, one is built on a likely mistake. |
| 4 | **⭐ SHOW ME** | 3 check questions, one try each. Mastery is earned here (unchanged). | Unchanged. |
| 5 | **🌟 DONE** | The hook comes back: "Remember the puzzle? The answer was **83**!" plus what he learned and the next level. | Pays off the hook. |

About **20–25 taps** a lesson instead of 40+, and almost every one is a thinking tap.

## Text that pops
- Write `*word*` around the words that matter. They show highlighted (the kit's `TLK.key` look: bold, a warm marker behind the word). 1–3 per card; never a whole sentence.
- Sentences of **10 words or fewer**. Everyday words. One idea per card.
- Big, roomy type; short lines; the picture beside the words on a Chromebook, under them on a phone. No walls of text.
- Read aloud: 🔊 on every screen; K–2 hear it by itself. Asterisks are never read out.

## Hook kinds (`hook.kind`)
`puzzle` · `mystery` · `whatswrong` · `guess` (estimate) · `oddone` · `riddle` · `notice` (what do you notice?) · `predict` · `challenge` · `story` · `wouldyou` (which would you pick?) · `fact` (did you know?) · `compare` (which is bigger/longer/older?) · `secret` (crack the code)
The test fails when two lessons in a row in the same set (same subject and level, in lesson order) use the same hook kind, or when one kind is more than a third of a set's hooks (set of 4 or more).

## Lesson data (in `ONE_BITE[id]`, the same files as now)
```js
B['MATH.OPS.L03.01'] = { band:'B23', pic:'🧱',
  today:'Add tens first, then ones',              // the one-line goal (Done screen, staff preview)
  hook:{ kind:'guess', pic:'🧱',
    t:'Yossi has *38* stickers. Zeidy gives him *45* more.',
    q:'About how many now?', o:['about 70','about 80','about 90'],
    pay:'It was *83*! Tens first made it quick.' },
  learn:[
    { t:'Every number has *tens* and *ones*.', act:{ type:'blocks', n:38, say:'Build 38.', how:'3 tens, then 8 ones.' } },
    { t:'Add the *tens* first: 30 + 40.', act:{ type:'hop', start:38, add:40, unit:10, say:'Hop 4 tens.', how:'Each hop is 10.' } },
    { t:'Then the *ones*: 8 + 5 = 13.', m:{ type:'blocks', tens:1, ones:3 } },
    { who:{ q:'38 + 45 = ?', o:[['Moshe','73'],['Eli','83']], a:1, why:'Moshe forgot the *ten* inside 13.' } } ],
  play:[ /* 3-5 activities from the Activity Kit (src/OneBiteKit.html, src/CoreKitActs.html), each with say, how, and mis:true on the mistake one */ ],
  done:'You add 2-digit numbers: *tens first*, then ones.' };
```
- `learn` cards: `{t, m}` (a picture model: tenframe, line, blocks, fbar, tiles, emoji, kpic, scene, chant, move), `{t, act}` (any kit activity, played guided with "How to do it" showing), or `{who:{q, o:[[name, answer],[name, answer]], a, why}}`.
- K–3 (K1, B23): one card is a song or a move (`m:{type:'chant'}` or `m:{type:'move'}`).
- Grades 4–5 (E45): 2+ activities with "tap the reason" (`why:{...}`).
- Grades 6–8 (M68): one card is teach-it-back ("Tell your chavrusa the 3 steps").
- Lessons still in the old shape keep playing the old way until they are redone.

## The new quality gate (`tests/lib/obquality.js`)
For a new-shape lesson (has `hook`, `learn`, `play`), the build fails unless:
- **hook**: a kind from the list, a short line (`t`, 12 words or fewer per sentence), a question with 2–4 guesses, and a `pay` line.
- **learn**: 2–4 cards; at least half hands-on (`act` or `who`); every card has a key word (`*word*`); every sentence 10 words or fewer; exactly one `who` card.
- **play**: 3–5 activities, 3+ kinds, no kind twice in a row, one mistake activity (`mis:true` or a mistake bin) in the first 3, no digit-typing tiles, every activity has a `say` of 12 words or fewer and a `how`.
- **band**: song or move (K1, B23) · 2+ "tap the reason" (E45) · teach-it-back (M68).
- **hook variety** (see above). **No word "bite".**
- Old-shape lessons are checked by the old rules; `tests/quality-baseline.json` can still only shrink.

## Rollout
`BOARD.md` lists every job and its lessons. One account takes one row at a time, redoes its lessons in the new shape, has a fresh reviewer score them (9 points, all 4–5), looks at them as a boy, and ships one pull request per set.
