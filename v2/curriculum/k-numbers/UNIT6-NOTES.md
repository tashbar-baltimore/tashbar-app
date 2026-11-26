# Kindergarten Numbers, Unit 6 "The path game": notes

**What Esti asked for (2026-11-26), in her words:** "if you recommend kindergarten number unit 6, then sure ... we don't want it to fall to a repetitive path, we want the extreme varieties" and "we don't want flat, we want immersive, we want 3D ... upgraded 2.0, not so much like 1.0."

**Skill (MAP.md):** numbers live on a line in order; one step forward is one more (K.CC.2, K.CC.4c). Chant: say each number as you step.

## The look: real 3D, the boy is inside the garden
- `path6.js` (three.js, our own copy in `lib/`): a sunny garden, the painted garden backdrop far behind, painted grass, soft sun with soft shadows, round trees, bushes, flowers.
- The number path: 11 stepping stones (0 to 10) with the same numerals as Units 4–5 painted on top, a sandy track between them, a green start mat and a red flag at ten.
- Mendy and Avi are the painted characters from Shapes, standing in the world and hopping stone to stone in a soft arc.
- Chromebook: the whole path shows. Phone: the camera follows along, 4 stones at a time (each stone about 90 px), with big arrow buttons to look left and right in the games where he places numbers.
- Every stone has a see-through tap spot over it (`.stone`), so taps and drags work as in every other game and the test can check sizes.
- Right answers: petals burst from the stone, the stone lifts, the star badge.

## Seven stops, seven different ways to play (no repeats)
| Stop | How he plays | New to the Numbers year |
|---|---|---|
| Learn it (opener6) | Watch Mendy walk 0–10 saying each number; stand up and "Step and say"; one more / one less shown; he taps "one more than five" himself | a walking lesson inside a 3D world |
| Path race (race6) | Spin the wheel (one dot / two dots), tap where Mendy will land (count on), Mendy and Avi race to the flag | spinner, counting on, racing a friend |
| Where does it go? (where6) | The wind blew numbers off the path; drag each number back to its empty stone (stones next door help) | placing numbers on a line |
| Big steps (steps6) | Stand up! Tap hop (he hops in the room too), hop back for one less, tap check when Mendy is on the goal | whole-body moving, going backwards |
| Find the mistake (mistake6) | Avi hopped wrong: tap where he should be. Or two numbers swapped places: tap both to swap them back | spotting order mistakes on a line |
| Review time (review6) | Units 3–5 come back: flowers grow in a 3D garden bed, fingers, a ten-frame; tap that number and Mendy hops there | review joined to the path |
| Show me (check6) | Mastery: only 0 and 10 show; he places five numbers, then two race turns | the map's mastery task |

## Choices I made (Esti said to keep going; tell me to change any)
- Unit 6 is the first Numbers unit in real 3D. Units 1–5 stay as they are for now; once Esti likes this look, they move into 3D one unit at a time (same lane).
- The path is straight, 0 to 10, left to right, as the map says.
- The spinner only lands where the game plans (6 turns always reach ten exactly), so every race ends at the flag.
- Pictures ordered (N6, see the art log): a painted garden path backdrop, stone, glowing stone, spinner, finish flag, hop shoes, path sign. Until they come, the stones, spinner and flag are made in code.

## Spoken lines (all new; 12 words or fewer, checked by the test)
Every line is in the page files; the test fails on any line over 12 words or with a word boys must never hear.
