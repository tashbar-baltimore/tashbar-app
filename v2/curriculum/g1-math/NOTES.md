# Grade 1 Math 2.0 — lane notes (g1-math)

Lane folders: `v2/app/g1-math/`, `v2/curriculum/g1-math/`, `v2/tests/g1-math-*.js`, `v2/screens/g1-math-*/`.
Branches: `claude/v2-g1-math-map` (the map), then `claude/v2-g1-math-unit1`, `-unit2` ... each on top of the one before.

## Small choices I made (Esti can change any of them)
- **15 units, not 14.** Grade 1 has more separate skills, and 1.0 also teaches coins. Reason in MAP.md.
- **Coins stay** (Unit 14), even though coins are a Grade 2 standard, because 1.0 teaches them in Grade 1. They are framed as tzedakah.
- **He writes numbers** on a big number pad (Grade 1 standard 1.NBT.1). 1.0 only let him tap.
- **Mendy is drawn in 3D code** for now (a year older: a little taller, a slightly smaller head than K). Painted Grade 1 pictures of Mendy and friends are ordered (art-requests.md); when they arrive and are checked, they can replace the 3D boys.
- **The 1.0 "alligator" signs become a seesaw** that tips toward the bigger number (no faces on objects, and the sign still "opens to the bigger one").
- **Saved stars** are kept on the device for now. Joining the school server's saved progress (like K Numbers' frame) is a shared change: see "Shared changes" below.
- Captions: the voice says everything, and a short caption shows what was said (Grade 1 boys are starting to read).

## Shared changes I need (please pass on; I did not touch them)
- Please add "Grade 1 Math" to the 2.0 home (`v2/app/index.html`), linking to `g1-math/`.
- Later: a shared sign-in / saved-progress frame for Grade 1 lanes (K Numbers has one in its own folder).

## Game kinds per unit (so no unit repeats an earlier kind without a new twist)
| Unit | Game | Kind (how it plays) |
|---|---|---|
| 1 | Opener: past 100 | tap stones in order as they light (follow-along lesson) |
| 1 | Hop ahead | predict a landing spot on a path, then watch the check |
| 1 | Fix the wall | drag pieces into gaps of a grid (120 chart) |
| 1 | Crate count | tap groups then singles to count, then write the number on the pad; last round: hear a number and write it |
| 1 | Find the mistake | find the wrong item in a row, then write the right number |
| 1 | Mastery check | mixed: predict, drag-to-gap, count-and-write, hear-and-write |
| 1 | Review | mixed Kindergarten items in the same world |

Next units must check this table. For example, Unit 2 "Sail on" moves the boat by dragging along a line (not tapping a spot, not predicting).

## Unit 1 notes (built)
- Files: `v2/app/g1-math/unit1.html` (the hill and every game, `?g=`), `u1.js`, `kit3d.js`, `lib/` (three.js r180, MIT). Test: `v2/tests/g1-math-unit1.js`. Pictures: `v2/screens/g1-math-unit1/`.
- Stars are kept on the device (localStorage) until a shared sign-in frame exists. 2 stars opens the next stone on the hill.
- A boy who does not master the check is sent to the game for what he missed most.
- Independent review: 3 rounds (scores in the pull request). Round 3: every point 4 or 5.
