# Kindergarten ABC 2.0 — builder notes

Lane: `k-abc` (Esti, 2026-11-26). The map is `MAP.md` ("the map looks fine"). One unit per branch and pull request: `claude/v2-k-abc-unitN`, each on top of the one before.

## How the games are built
- `play.html?u=1&g=rhyme` is one page for every game; `units/uN.js` says what each game is (`ORDER` and `GAMES`).
- `game.js` the shell: buttons, Mendy, tap and drag pictures, gentle fix, glowing hint after two tries, stars, test hooks (`window.__abc`).
- `kit3d.js` the 3D look kit (Esti approved the look sample). `scenes.js` worlds and set pieces. `props.js` every picture word as a small 3D model made in code. `cast.js` painted Mendy standing inside the 3D world.
- `index.html` the menu: one row of picture buttons per unit, in play order, with his stars. The look samples stay below.
- Test: `v2/tests/k-abc-unitN.js` plays every game of the unit to the end with a real mouse at 1366x768 and 390x844, with one wrong move in each game.

## Small choices I made (Esti can change any of them)
1. **No locks on the menu for now.** The map says the next game opens at 2 stars. 2.0 has no shared progress yet, so every game stays open (so you can see everything from one look link). His stars show on each button, saved in his browser. When 2.0 gets saved progress, the lock is one line.
2. **Mendy is the painted Mendy from 2.0 Shapes** (same pictures, copied into `v2/app/k-abc/art/`), so the boys meet one Mendy everywhere. He stands inside the 3D world and always turns to face the boy.
3. **No faces on objects.** The pictures (hat, sun, cake, clock...) have no faces. Animals (cat, goat, bee, fish, snake) have small kind eyes. The look sample's apple friend has a face; I will not use it in the units (the art bible says no faces on objects).
4. **Who makes the mistake in "Fix it".** The map says a boy's name always comes with his picture. Until the friends' painted pictures arrive (order A1), Mendy makes the mistakes himself: "Sun and map rhyme! Am I right?" The boy checks Mendy. When the pictures arrive, Eli and Ari take over as in the map.
5. **Added from 1.0 K (Pencil Power): "Bee Paths"** in Unit 1, finger tracing of lines, a curve, a circle and a zigzag, so his hand is ready to trace letters in Unit 2.
6. **Pictures live in the lane folder** (`v2/app/k-abc/art/`), not in the shared `art/` library. CLAUDE.md asks for `art/`, but your lane rules say I may change only lane folders. **Shared change to ask about:** may I copy them into `art/` later (needs a catalog row each)?
7. **The menu tiles are pictures of the games themselves** (made from the game screens), saved small in `art/thumb-*.webp`.

## 1.0 K English skills checked against the map (what goes where)
1.0's K English is in `packs/KReading.html` (14 lessons) and `packs/KWriting.html` (9 lessons). Everything 1.0 teaches is placed in a unit:
| 1.0 skill | 2.0 unit |
|---|---|
| Rhyme, clap the beats, first sound, left to right | Unit 1 |
| Pre-writing lines, curves, circle, zigzag (Pencil Power) | Unit 1 (Bee Paths) |
| Letter sounds, writing each small letter | Units 2–6 (letter kit) |
| Blend, chop (segment), read CVC words | Units 2–9 |
| Telling b/d (and p/q) apart, reversed letters | Unit 5 (b or d?) |
| Letter names, capitals, small letters, what comes next in the ABC | Unit 7 |
| Writing all capitals | Unit 7 (trace the capitals) |
| Final sound / last letter, spell CVC with tiles | Unit 9 |
| Snap words (25 in 1.0) | Unit 10: about 40 heart words (see below) |
| Counting words in a sentence, spaces between words | Unit 11 (Word hop) |
| Sentence: capital at the start, spaces, end dot | Unit 11 (Build a sentence) |
| Writing his own name | Unit 11 (my name, traced) |
| Naming words and action words | Unit 11 (Read and match) |
| Book parts: front, back, where to start | Unit 13 (how a book works) |
| Listening: who, what, first / next / last | Unit 13 (after each story), and story moments from Unit 2 |
| Adding or taking away a beat | Review A (bonus) |

**Heart words (about 40, Esti):** the map's 13 + family words, plus 1.0's snap words and a few more: I, the, a, is, to, he, we, my, said, was, of, you, are, and, see, like, go, me, look, no, yes, play, she, be, do, for, have, here, they, what, where, come, put, one, two, little, down, Tatty, Mommy, Bubby, Zeidy (42). Taught a few at a time in Unit 10, used in Units 11–13.

## Game kinds per unit (so no game repeats an earlier kind without a new twist)
### Unit 1 — Ears On
| Game | Kind | World |
|---|---|---|
| opener | lesson: watch Mendy, tap along (bell, two pictures, drum, moon), clap-along song | morning meadow |
| rhyme | drag a picture across the pond onto its rhyme (pairs hop out onto the bank) | Rhyme Pond |
| clap | rhythm: tap the drum once per word part, then the check button | Drum Hill, golden light |
| sort | sort by first sound into two baskets (mmm / sss), drag | Sound Garden |
| train | order: load cars from the engine side, the train reads left to right, tap where we start | Picture Train, hills |
| paths | finger tracing of shapes (line, across, hill, circle, zigzag), the bee follows | Bee Meadow |
| fixit | judge: thumbs up / down on what Eli said, then drag in the right picture | the fence meadow |
| check | mastery: tap kinds only (the rhyme, how many claps on dot stones, the first sound) | sunset stage |
| review | mixed walk: one rhyme drag, one drum word, one first-sound tap, one "which first" tap | morning pond |

### Unit 1 — reviewer fixes (independent review, 2026-11-26)
First review 3.9 overall (progression 3, taught→asked 3). Fixed: the check no longer claps the answer (the parts are only said); a dot stone appears in Drum Hill after each right answer, so the check's dot stones were practised; fixed easy-to-hard clap order (1, 2, 3 parts, twice); wider Rhyme Pond; the chant rhymes and claps once per word part; the train is pulled by its engine and loads from a green start flag; Fix It: Mendy checks himself, and the sock round drags the sock to the sss basket; a left-to-right step in the opener; a hint in the review's "which first"; a clearer bun.

### Unit 2 — s a t p
The letter kit (map) for each letter, each letter with its own world and twist. The meet / trace / hunt games repeat **by design** (the map's letter kit: "boys learn the game once, then spend their time on the letter"); each letter changes the world, the picture that grows, and the hunt's kind of play.
| Game | Kind | World / twist |
|---|---|---|
| opener | lesson: a letter is a picture of a sound; the four friends; tap each letter; the s-a-t-p action chant | Mendy's garden table |
| s-meet, a-meet, t-meet, p-meet | meet: the picture grows into the letter, its sound, a mouth picture, a body action, tap to hear, "which starts with it" | snake pond · apple vine · ticking tree with a woodpecker · pinwheel on a stick |
| s-trace ... p-trace | trace 3 rounds: on the shiny path, on dots, alone; the picture grows under his finger | same worlds |
| s-hunt | moving targets: pictures float past on lily pads; drag the sss ones to the snake | pond parade |
| a-hunt | pick from a tree: pictures hang in the apple tree; drag the a ones into the crate | apple tree |
| t-hunt | build: only t pictures become blocks in a tower (stickers on each block) | tower on a stump |
| p-hunt | tap moving targets: pop the bubbles with p pictures | bubbles over the hill |
| slide, slide2 | blending: push each letter tile down the slide into the next, left to right; "tap" goes to its picture | playground slide |
| story | listening + finding words he can read (sat, pat, tap) | three picture frames |
| fixit | judge Mendy's word (thumbs), then drag the right letter tile into the glowing spot | the meadow shelf |
| check | mastery, tap kinds: hear a sound → tap its letter; see a letter → tap its picture; hear a word → tap it | sunset stage |
| review | Units 1–2 mixed: rhyme tap, picture → letter drag, drum parts, hear sounds → tap the word | the pond |

Small choices: the p picture is a **pinwheel** (p's stick and round top), the t picture is a **tree** with a woodpecker that taps t-t-t (the map's chant word "tick-tock" stays). Mommy and Tatty are not on play screens (Esti 2026-11-26), so the map's story "Tatty sat. Pat, pat, pat!" became "The cat sat. Pat, pat, pat! The cat taps the tap." The friends for the opener chant are snake, apple, turtle, penguin.
