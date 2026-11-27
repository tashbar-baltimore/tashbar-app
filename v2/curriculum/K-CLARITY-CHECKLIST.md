# Kindergarten clarity checklist (Shapes)

One line per game: what was wrong, what changed, and the pictures (before and after, Chromebook 1366×768 and phone 390×844) in `v2/screens/k-clarity/<game>/`.
Rules: `v2/curriculum/K-CLARITY-RULES.md`. Each session adds its own section; keep the other sections as they are.

## shapes-b: Fix the shape, Find the hexagons, Mystery shape, What comes next?, Copy and sing, The solid shapes

| Game | What was wrong (rule) | What changed | Pictures |
|---|---|---|---|

## shapes-d: Big and small, Line them up, Heavy and light, Shape party 1, 2 and 3, Graduation day

Played each game as a made-up boy in the full look at Chromebook and phone size, with wrong moves (the unit tests' player, `shoot.js`), and looked at every picture. Teacher's choices made without asking are marked *(choice)*.

| Game | What was wrong (rule) | What changed | Pictures |
|---|---|---|---|
| Big and small | The "big" and "small" pieces were all different things (a big cube, a small hexagon, a big cone...), only 1.8 times apart, so with the camera's depth a small piece could look as big as a big one (7). The lesson showed the big ball alone, then the small ball alone, up close, so the small ball looked big (7, 11). The friend's mistake showed one big ball alone: big compared with what? (7). When counting, the pieces lay in a heap in the box (8). Carved-wood and leaf paint on the pieces (9). | Every kind comes as a big and a small one of the same thing in the same colour (ball, cube, triangle), the big one 2.5 times the small, plain one colour; 3 big, 5 small. In the lesson the small ball comes beside the big one. In the mistake a small blue ball sits beside the big yellow one ("Is the yellow ball small?"). As each thing is counted it hops and its number appears in a neat row above its box (1 2 3, 1 2 3 4 5), and the numbers stay until he answers which box has more. *(choice: balls, cubes and triangles, things every child knows)* | `v2/screens/k-clarity/big-and-small/` |
| Line them up | The start line was white on white snow: he could not see where to line up (9, 12). Everything sat small in the top corner; on the phone the start of the scarves was cut off and Mendy was off screen (9). In the lesson "the red one looks longer" was not true in the picture (11). Bonus: two scarves were too close to tell (1.8 and 2.4) (7). | A thick dark start line and a real green flag on a pole. The camera looks at the scarves and towers, so they fill the screen at both sizes. In the lesson and the mistake the shorter scarf sticks out clearly further. Bonus scarves 1.4, 2.4, 3.4. | `v2/screens/k-clarity/line-them-up/` |
| Heavy and light | The scale and the things were small and far up the screen with a big empty mat (9). The rock and hay bale were tiny (9). The lesson said "Now the big ball... the ball is light" while showing a balloon (11). Bonus: rock 5 against balloon 2 was not a big difference (7). | Camera closer at both sizes; bigger rock and hay bale (still much smaller than the big balloon, so "big is not always heavy" is plain). The lesson says the names of what is on the scale ("the big balloon"). On the phone the two things sit closer together, so neither is cut off. He can grab a thing anywhere on it (before, the top of a big balloon could not be grabbed). Every pair is 3 times or more apart; the light one is always a balloon or a feather. | `v2/screens/k-clarity/heavy-and-light/` |
| Shape party 1 | Every piece had party paper on it (polka dots, gingham, a lace doily circle), so the shape was hard to see (1, 9). | Plain one-colour flat shapes (`plain: true`). The look-alikes (oval, kite, curvy triangle) stay as close non-examples (2). | `v2/screens/k-clarity/shape-party-1/` |
| Shape party 2 | Party paper on the flat shapes; the sphere was a party balloon, the cube a gift box, the cone a party hat (6, 11: "a sphere is like a ball" while showing a balloon). | Plain flat shapes and plain solids (a real ball-sphere, cube, cylinder, cone). | `v2/screens/k-clarity/shape-party-2/` |
| Shape party 3 | Same party paper and balloon-sphere (6). Two clues a child could argue: "I am a small solid" and "I am flat and big" (size is not a shape clue) (7). | Plain shapes and solids. Clues: "I am solid. I am round all over, like a ball." and "I am flat. Four sides the same." | `v2/screens/k-clarity/shape-party-3/` |
| Graduation day | The sphere in the lesson was a balloon with a knot; party paper on the shapes (6, 9). | Plain shapes and solids; the lesson shows a plain blue sphere. The mistake (hexagon "five corners?") marks and counts all six corners. | `v2/screens/k-clarity/graduation/` |

Shared kit changes (only games that ask for them are affected): `keep` (a lesson piece stays beside the one before), `mistake.beside` (a second piece to compare with), `countTags` (a number over each counted thing); the measuring start line and flag (only Line them up measures); the balance lesson's words use the names of its things (only Heavy and light weighs).
New test: `v2/tests/k-shapes-compare.js` checks rule 7 for the three comparing games.
