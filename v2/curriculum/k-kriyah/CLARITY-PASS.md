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

# review-kriyah (K-CLARITY weekend, from 2026-11-27 18:00 UTC)
Goal (Esti's words): "something a 5-6-year-old can figure out and learn, and it shouldn't be confusing." Every one of the 80 games is played as a boy (Chromebook and phone, full look, one wrong move), a fresh reviewer scores each 1–5 ("Would a 5-year-old know exactly what to do, and what is being taught, without an adult?"), and every game under 4 is fixed and scored again.

## Fixes
| Game(s) | What was wrong | What changed | Pictures |
|---|---|---|---|
| Letter Hunt (u1g3, u3g3, u4g6, u10 hunt) | The letters were thick 3D blocks standing far in front of their white tiles, so seen from the side they slid off the tiles (a Beis half off its tile, an Alef hanging below) (9, 12). A paper chain of rings ran along the back wall: seen edge-on, the rings looked like little Vovs and Zayins in a letter hunt (10, 11). Two hanging fruits, bright flowers in front, berry dots on the bushes, a village, fence, rocks and pines filled the edges (10). The letters bobbed and rocked all the time (10). A side-wall tile poked through the wall and cut its letter; floor tiles sank into the floor. On a phone the tiles crowded together and one ran off the screen. | Each letter is a flat sign sitting right on its tile, centred, with its dot on the face; tiles stand still and face him. No paper chain, hanging fruit, flowers, berries, village, fence, rocks or pines in the calm look (shared outdoor world, also behind Unit 10). The hiding places are moved so no tile touches a wall, the floor or another tile; on a phone they are three tidy rows, all on screen. | `before-hunt-*.jpg`, `after-hunt-*.jpg` |
