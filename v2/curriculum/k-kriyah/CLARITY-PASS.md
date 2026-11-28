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
| Every game (shared engine, calm look) | Round 1 reviewer (Units 1–2): letters were thick 3D blocks that swayed and turned all the time, so from the side they looked doubled, Hei's gap closed and the dot drifted (12). The painted scenes were still busy (houses, cave, waterfall, rainbow shelves, beach umbrella) (10). Confetti and clouds of sparkles landed on the letters after every tap; gold stars spun above learned letters (9). An orange-gold ring round the dot looked like a big "O" on the letter. Round bushes with pink dots stood beside the houses. A grown-ups' note was at the bottom of every screen. On a phone, long titles were cut ("Show what you kn…"). | Letters are less than half as thick, with the dot resting on the face; every letter stands still and faces him (Feel, Detective, Sorter, Sound Match, stories, Find the Mistake, Mastery, Train, rain, Practice, Spot the Difference, Dot Builder). The painting behind is much paler and softer. No confetti during play; a few small sparkles just above the letter. A green tick (not a gold star) marks a learned letter. The "look here" ring is thin and pink. No bushes with dots. The grown-ups' note shows only before Play. Titles wrap onto two lines on a phone. | |
| Show what you know (all units) | A basket filled with tiny tumbling letters (a second thing to look at). After a wrong tap the right letter only hopped while the voice explained (16). | No basket: the dots at the top count. After a wrong tap the right letter glows, the hand points at it, "Now you tap …", and he taps it himself before the next question. | |
| Look-Alike Detective (Beis/Veis houses) | The card swayed and flipped round (a mirrored letter) as it flew into the house; little letters piled on the doorstep; a wrong drop got "Try again!" with nothing shown (16). | Still and face-on, no flip, no pile. After a wrong drop: "Beis goes to the house with Mendy", the hand carries the letter halfway there, "Now you!" | |
| Alef-Beis Train | Letters sank into their cars: Alef showed two bumps, Hei lost its leg, Beis's dot was hidden (the reviewer's only 2). The "fill the empty places" round had no "Watch me" (15). A wrong car got words only (16). | Each letter's foot stands on the car roof, whole. The gap round starts with "Watch me": the hand fills the first gap, then "Now you!". After a wrong car, the hand moves the right car halfway, then "Now you!" | |
| Sound Match | On a phone four stands were in two rows seen from above, back letters tiny, front ones tipped (12). A wrong drop got words only (16). | On a phone, one row of four, all the same size. After a wrong drop the hand carries the picture halfway to its letter, then "Now you!" | |
| Mendy's first day | On a phone the big Beis covered Alef (12); at the end Alef was cut at the edge. | On a phone Alef waits small, up high, while Beis and Veis are taught, then all three line up, smaller, all on screen. | |
| Letter rain (bonus) | Falling letters swung and turned; from the side a Beis looked like two letters (12). | They fall straight down, face-on. | |

## Choices made for Esti (a kindergarten teacher's choice; change any of them)
- **The dot stays gold and round.** The whole course teaches "Mendy is the dot", so it keeps its look; everything *else* gold or round near a letter is gone (stars, confetti, fruit, berries, ring garland).
- **No speech bubble for Yaakov's claim.** A bubble showing the letter he claims would turn "is the name right?" into "do the shapes match?". He hears the claim, and the speaker button says it again.
- **Letter rain keeps the Home button hidden while letters fall** (so he doesn't leave by accident with a tap meant for a letter); it is back between rounds.
- **On a phone, Yaakov steps aside while the boy drags the fix** (no room beside the tiles); he comes back when it is fixed.

## Round 2 (a new reviewer, Units 1–2, after the fixes above): what was still wrong, and what changed
| Game(s) | Round-2 finding | Change |
|---|---|---|
| Letter Hunt (scored 1) | On a phone the tiles covered the letters: only the gold dots showed (the flatter calm letters plus the hunt's own extra flattening left them paper-thin against the tile). The sukkah was still busy (fruit bowl, cup, chairs, picture, leaf balls, sun). | No extra flattening; the tile sits a little behind the letter. **New test:** every hidden letter must show blue letter paint on screen (it fails on the old code, passes now). No bowl, cup, chairs, picture, leaf balls or sun in the calm look. Phone letters a little bigger, three tidy rows that never touch (checked by the test, three runs). |
| Every game (shared) | White sparkles still landed on letters (inside Veis, where the dot goes); letters cast letter-shaped shadows that looked like a mirrored second row; gold doorknobs and gold sign frames sat next to letters. | Calm look: no sparkles at all (the chime and the letter's hop are the joy); letters cast no shadow; doorknobs brown, sign frames wood. Only the dot is gold. |
| Feel the Shape | "Watch me" traced only one piece of Alef; the road was faint; the road sat in front of the (now flatter) letter. | The hand traces every piece of the road, lifting between pieces; the road is bright and sits on the letter's face. |
| Mendy's first day | No "Watch me" before the first "Tap Alef!"; on a phone Alef waited very small. | "Watch me. I tap Alef." (hand taps, Alef hops), then "Now you! Tap Alef!"; Alef waits bigger on a phone; a tapped letter hops, never spins. |
| Shloimy at the zoo (and every later story) | "Let's see the animals!" with no animals; on a phone the picture sat on Shloimy's head; waiting letters 25–40 px. | "Let's see what we find!"; on a phone the picture shows on its own beside the people; waiting letters bigger. |
| Sound Match (phone) | Four letters in one row were about 45 px. | Two shelves of two, all at the same distance, about twice as big. |
| Alef-Beis Train | The waiting cars stood in a line that looked like a finished train. | They stand well apart. |
| Letter rain | A wrong tap pushed the letter back up onto the one above it (two letters became one blob on a phone); letters small; help shown too briefly while letters kept falling. | The tapped letter keeps its place; letters bigger; the rain stops longer while the arrow shows the difference; wooden sign frame. |
