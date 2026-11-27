# Kriyah clarity pass (K-CLARITY "other-622", 2026-11-27)

Rules: `v2/curriculum/K-CLARITY-RULES.md` (on the Shapes branch, claude/v2-k-shapes-graphics). What Esti asked: "The backgrounds are so busy that it's hard to focus ... butterflies flying around that are distracting ... something a 5-6-year-old can figure out."

## What changed (every Kriyah game, through engine.js)
| Rule | Before | After |
|---|---|---|
| 10 calm background | Painted scenes at full colour (bookshelves, kitchens, picnic, houses); in the 3D hills world, butterflies and birds flew, clouds drifted, shul flags swayed, specks of light floated | The painted picture is paler, softer and less colourful (a white veil and a soft blur behind the canvas); no butterflies, birds, drifting clouds, swaying flags or floating light. `?busy=1` shows the old look for comparing. |
| 9 one thing to look at | Each right answer threw 22 to 45 confetti bits and many sparkles over the letters | A small, short burst (8 to 16 bits, fewer sparkles, close to the letter) |
| 13 title on screen | No game name on screen | The game's name (from `units.js`) is at the top, between the sound and home buttons, on Chromebook and phone |
| (bug) | Champion Day: the red stage top flickered in red and brown stripes (two surfaces at the same height) | The red top sits just above the wood |

New test `v2/tests/k-kriyah-clarity.js`: all 80 games show their name and a Play button of 64 px or more (Chromebook, and every fifth game on a phone), with the calm look on. Tests run after the change: path, Unit 1 story, Unit 2 train, Unit 8 story, Unit 9 partners, Unit 10 story, gallery, clarity: all pass.

Pictures: `v2/screens/k-clarity/kriyah/` (before and after).

## Seen, not changed (for the Kriyah builder or Esti)
- Unit 8 story, about 8 seconds in: the shofar the rebbe holds sits across his face. A small thing, but it looks odd.
- Unit 10 Champion Day keeps its balloon arch (it is the celebration the story is about); it is still, not moving.
- The gallery pictures (`gallery/*.jpg`) still show the older 3D people for Units 1–7; the games themselves use the painted people.
- This pass is the screen (calm, title, buttons). It did not re-score the teaching of each of the 80 games; their scores are in the unit pull requests.
