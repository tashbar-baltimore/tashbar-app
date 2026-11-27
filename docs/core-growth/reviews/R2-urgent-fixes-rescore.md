# Fresh re-score of the Round 2 URGENT fixes (B1a follow-up, 2026-11-27)

A fresh reviewer who wrote neither the lessons nor the fixes scored each changed item on the 9 points. Two fixes were incomplete on the first pass; they were finished and re-scored (bottom). Final: 11 of 11 pass.

# Re-score of the urgent fixes (B1a): fresh reviewer

Checked each change in `urgent-diff.patch` against the full current item in `wt-urgent/src/` and its story in `wt-urgent/texts/`. Tiles are judged strictly against `w` (`OneBiteKit.html` T.tiles.judge). In K–1, `CoreK1.html` plays the `say` line and then the `hear` word by itself. The letter checklist was checked against `CoreWrite.html` check(): it lowercases the text, joins whitespace into single spaces, and looks for `' ' + word`.

| ID | Name | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | Fun | Grade level | Result |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `READ.PHON.L01.07` | My First Words | 5 | 4 | 4 | 4 | 4 | 4 | 4 | 3 | 4 | 4 | ok | **✗ fix** |
| `READ.PHON.L01.10` | Pin, Tap, Nap | 5 | 4 | 4 | 4 | 4 | 4 | 4 | 3 | 4 | 4 | ok | **✗ fix** |
| `READ.LV.L01.12` | Book: Mop It Up | 4 | 4 | 4 | 3 | 4 | 4 | 5 | 4 | 5 | 3 | ok | **✗ fix** |
| `READ.PA.L02.20` | Every Beat Has a Vowel | 5 | 4 | 5 | 4 | 5 | 4 | 4 | 4 | 4 | 4 | ok | ✓ pass |
| `READ.PA.L01.15` | Four Sounds | 5 | 4 | 4 | 4 | 4 | 4 | 4 | 4 | 4 | 4 | ok | ✓ pass |
| `READ.LIT.L01.01` | Who Is in the Story? | 5 | 4 | 4 | 4 | 4 | 5 | 5 | 4 | 5 | 4 | ok | ✓ pass |
| `READ.LIT.L01.02` | Where Is the Story? | 5 | 4 | 4 | 4 | 4 | 5 | 4 | 4 | 5 | 4 | ok | ✓ pass |
| `READ.FLU.L02.23` | Heart Words: friend, people | 5 | 4 | 4 | 4 | 4 | 5 | 5 | 4 | 5 | 4 | ok | ✓ pass |
| `READ.PA.L01.14` | Change the End | 5 | 4 | 4 | 4 | 4 | 4 | 4 | 4 | 4 | 4 | ok | ✓ pass |
| `READ.PHON.L01.16` | Fish and Lion | 5 | 4 | 4 | 4 | 4 | 4 | 4 | 4 | 5 | 4 | ok | ✓ pass |
| `W13.LETT3.01` | A Letter to a Real Reader (W13.U36) | 5 | 5 | 4 | 4 | 4 | 4 | 5 | 4 | 5 | 3 | ok | ✓ pass |

## Did each fix work?
- **PHON.L01.07 / PHON.L01.10: only half fixed.** The `q:'am'` / `q:'pin'` that showed the word on screen is gone, which is good. But the new line, "Shmuli read am. Now tap Hear it, and build that word!", still points "that word" back at **am**. The pool (a, t, m) can build *am*, and `judge` marks it wrong. In L01.10 the pool (t, i, p, n) can build *pin* the same way. Both lines are under 12 words.
- **LV.L01.12: fixed.** "Gad got a fan." is plainly not in the book, and *fan* is decodable. The other cards still match the story ("Gad hit the cup" 👍, "Gad is sad" 👎 because the book says "No", "Gad did a big job" 👍).
- **PA.L02.20: fixed.** 🌙 is moon, one beat (the old 🐱 could be called "kitty", two beats). Every card now has a single beat count.
- **PA.L01.15: fixed.** 🚌 is bus, b‑u‑s, three sounds (the old 🐱 could be "kitty"). No new second answer.
- **PA.L01.14: fixed.** The old 🐝 is a bug too, so it was a second right answer to "big with uh". 🚌 *bus* is a fair distractor: it changes the end, not the middle.
- **PHON.L01.16: fixed.** 🔥 is fire or flame, and both start with fff. No new second answer.
- **FLU.L02.23: fixed.** 👦👦 could also mean "people". 🤝 is a weaker picture of "friend", but with 💧 and 👥 the match comes out the same by elimination.
- **LIT.L01.01: fixed.** 🧔 Abba walked Eli to 🏫, so the old card had two answers. 👨‍🏫→🎵 ("Rebbe Gutman taught the boys a song") is in the story and belongs only to the Rebbe. The new How line names the clues without naming the people.
- **LIT.L01.02: fixed.** The old 😴 could go to the sukkah, because Moishy fell asleep there. 🦉 for night is common knowledge for a K boy, but it is not in the story (see the optional fix).
- **W13.LETT3.01: fixed.** The lessons teach these greetings and closings: "Dear …," (both lessons), "Hi Avi!" (the friend letter in your‑5), and the closings "Thank you," "Your student," "With love," and "Respectfully,". Each one now meets a checklist line. ' hi ' matches "Hi Avi!", ' love,' matches "With love,", and ' thank you,' matches "Thank you,". A boy who follows the unit's lessons can meet every app-checked line. The new words only make it easier to pass ("Thank you, Zeidy, for…" in the body also meets the closing line). No boy is marked wrong for a right letter.

## Fixes

### `READ.PHON.L01.07` My First Words — FIX
- **8 correct and clear (a second answer is still possible):** piece 1 says "Shmuli read am. Now tap Hear it, and build that word!" Then `hear:'at'` plays, the pool has a, t and m, and *am* is marked wrong. **Fix:** `say:'Am is the apple sound, then mmm. Now build a new word!'` (11 words). This puts back the blending model the old line had, and "a new word" points to the *at* that plays next.

### `READ.PHON.L01.10` Pin, Tap, Nap — FIX
- **8 correct and clear (a second answer is still possible):** piece 1 says "Shmuli read pin. Now tap Hear it, and build that word!" The pool t, i, p, n can build *pin*, but `w` is *tip*. **Fix:** `say:'Pin is puh, the itch sound, nnn. Now build a new word!'` (11 words).

### `READ.LV.L01.12` Book: Mop It Up — FIX (old problem, not caused by the fix)
- **4 thinking steps (the How line gives an answer):** the mistake sort's How line is "Was Gad sad? The book says no!", which hands over the card "Gad is sad." **Fix:** `how:'Find each line in the book. Did it really happen?'`

### Optional (not blocking, all old)
- `READ.LIT.L01.02`: 🦉 is not a clue from the story. To keep the match tied to the book, use `['⭐','🌙']`. The story says "he could see the stars twinkling in the night sky". Then change the earlier sort card `['⭐',0]` to `['🍞',0]` (challos), so the star is not used twice.
- How lines over 12 words. The K1 checker only counts `say`, but a boy hears these from the How button:
  - LIT.L01.01 piece 2: `how:'The main character is in almost every page. Who do we hear about most?'` should be `how:'Who do we hear about the most?'`
  - LIT.L01.01 piece 3: `how:'Did we hear about him in the story?'`
  - LIT.L01.02 piece 5 hear: `hear:'A cat peeked in. Did Eli go out to the cat?'`
  - FLU.L02.23 piece 2: `how:'Listen to each sound. This a does not sound like cat.'`
  - FLU.L02.23 piece 4: `how:'Try to sound it out. Does it break the rules?'`

## Across the batch
- The picture swaps are good: each new picture has one name a K boy would use, and none brings in a second answer.
- The two Shmuli "model" lines were rewritten to drop the shown word, but they still name the old word just before "build that word". When a line models one word and then asks for another, say "a new word".
- Some How lines run past 12 words. The K1 checker does not catch them, because it only counts `say`.

URGENT: 2 — `READ.PHON.L01.07` and `READ.PHON.L01.10` (the word Shmuli read can still be built from the tiles and is marked wrong). The fixes did not create them, but did not fully remove them.

## Re-score after fixes

| ID | Name | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | Fun | Grade level | Result |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `READ.PHON.L01.07` | My First Words | 5 | 4 | 4 | 4 | 4 | 4 | 4 | 4 | 4 | 4 | ok | ✓ pass |
| `READ.PHON.L01.10` | Pin, Tap, Nap | 5 | 4 | 4 | 4 | 4 | 4 | 4 | 4 | 4 | 4 | ok | ✓ pass |
| `READ.LV.L01.12` | Book: Mop It Up | 4 | 4 | 4 | 4 | 4 | 4 | 5 | 4 | 5 | 3 | ok | ✓ pass |

- **PHON.L01.07:** the tiles are now a, t and p in 2 boxes. The only real word they make is *at*, and *am* can no longer be built. "a new word" points to the *at* the game plays next. The line is 10 words.
- **PHON.L01.10:** the tiles are now t, i, p and m in 3 boxes, so *pin* can no longer be built. *pit* can be built, but the game plays *tip* and the line says "a new word", so there is no second right answer. The line is 10 words.
- **LV.L01.12:** the How line "Find each line in the book. Did it really happen?" teaches a way to check and no longer gives away a card.

URGENT after fixes: 0.
