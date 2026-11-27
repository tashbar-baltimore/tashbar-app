# Kindergarten clarity checklist (Numbers branch)

Every game checked against `v2/curriculum/K-CLARITY-RULES.md`, played as a made-up boy in the full look (not `?fast=1`) at Chromebook (1366×768) and phone (390×844) size, with one wrong move. Pictures: `v2/screens/k-clarity/`.

## numbers-a: the map, Unit 1 and Unit 2

| Game | What was wrong | What changed | Pictures |
|---|---|---|---|
| Map (index.html) | On a phone, Unit 1's last three stops sat on top of each other and two ran off the bottom. On a Chromebook, every 8-stop unit (1, 3, 4, 5, 7, 8) had stops touching (the trophy sat on another stop). The towel icon had eyes. | New stop places for both screens: every stop is whole and on its own. Eyes taken off the towel icon. New test checks every unit on both screens. | map-before / map-after, map-phone-before / map-phone-after |
| Learn it (opener1) | The peek cloth had googly eyes (a face on an object, and a silly prop). | Plain cloth, no eyes (shared `frame.css`, so the cloth is plain in every Numbers game: Units 1 and 5 too). Otherwise clear: one card, big, and the voice says what the card shows. | opener1-after |
| Meet 1, 2, 3 (meet123) | Clear. One group, one hand, the voice says the number and how it looks ("Two and one"). Wrong move: the group lights up and the voice says how to fix the hand. | No change needed. | meet123-after |
| Meet 4 and 5 (meet45) | Clear (same game as above). | No change needed. | |
| Match it (match) | Cards of 4 and 5 Shabbos candles were crowded: the candles overlapped and were hard to see as 4 or 5. Cards were a little small. | Candles are smaller when there are 4 or 5, so each one stands apart (shared `frame.js`, candle cards only). Cards are a bit bigger. Test: candles never overlap. | match-candles-before / -after |
| Finger flash (fingers) | Cloth had eyes. | Plain cloth (see above). | cloth-eyes-before / -after |
| Peek (peek) | The towel had big moving eyes. Under the towel, the plate sat on a busy kitchen photo (curtains, shelves, cups, utensils), so the apples were not the only thing to look at. | No eyes. The plate now sits on a soft, plain, light background: only the plate and the apples. | peek-before / -after, peek-towel-before / -after |
| Find the mistake (mistake) | From round 4 on, the plate faded away before he answered, so he had to judge "Is Eli right?" with nothing to look at. | The plate stays in view the whole time he checks. (The "quick look" stays only in the bonus round, where the voice says "Quick look!" first.) | mistake-before / -after |
| Show me (check1) | Cloth had eyes. The flash is right for a mastery check of seeing at a glance. | Plain cloth. | |
| Learn it (opener2) | Stones 6 to 10 were five identical gold stars: a boy could not tell 7 from 8, and stars look like prizes, not amounts. | Every stone shows its own amount: rows of five like a ten-frame (7 = a row of 5 and 2 more). Past ten (bonus only) a third row starts. Test: every stone 1 to 15 shows its own number of dots. | stones-before / -after, stones-phone-after |
| Count and jump (jump) | Same star stones. In the drum game the voice said "Stand up! Jump each time you tap!" (he cannot jump and tap at once), and said it again right on top of "Tap the drum to count" in the first round. | Dot stones. The line is now "Tap the drum. Say each number with me!", once, in round 4 only (the first round already teaches the drum). The stand-up jumping stays in the warm-up chant, where it belongs. | jump-after |
| What comes next (next) | Same star stones. | Dot stones. The three "listen" answer stones are kept on purpose: the skill is saying the number words, and the demo shows "tap to hear, then drag". | stones-before / -after |
| Countdown (down) | Same star stones. | Dot stones. | down-after |
| Find the mistake (skip) | Same star stones, also in the "what Mendy said" bubbles, so "Mendy said seven here" showed a star. | Dot stones and dot bubbles. | skip-before / -after |
| Count with me (check2) | Same star stones. | Dot stones. | check2-after |

Choices made without asking (as a kindergarten teacher would): dots in rows of five rather than written numerals on the Unit 2 stones (boys meet numerals in Unit 4); the flash stays in the Unit 1 check and the Peek and Finger flash games, because seeing a small amount at a glance is the skill being taught.

## numbers-b: Unit 3 (Counting things) and Unit 4 (Numbers 0 to 5)

Taken over at 10:30 by another session (claim `numbers-b-takeover`): numbers-b was claimed at 05:56 and nothing had been pushed in 4½ hours. Every game played as a made-up boy at Chromebook and phone size with one wrong move (the Numbers game test: round, wrong move, end, phone), every picture looked at.

| Game | What was wrong | What changed | Pictures |
|---|---|---|---|
| Learn it (opener3), Mix it up, Oops! Find it, Show me (check3), Review (review3) | Clear: plain board, one group to count, every counted thing marked, a kind fix that shows how. | No change needed. | |
| Touch and Count (count3) | The voice called the same picture "siddurim" and once "the books" (11). | Always "siddurim". | numbers-b-count3-after |
| Give me (giveme) | Clear: challah rolls, a plate, the count is said one by one. | No change needed. | numbers-b-giveme-after |
| Learn it (opener4), Fill the frame, Match the number, Fix the frame, Show me 0 to 5 (check4), Review time | Clear: big numerals, dot cards and ten-frames, no decoration. | No change needed. | numbers-b-match4-after, numbers-b-check4-wrong-after |
| Trace it (trace4), Empty plate (zero4) | A card with ONE thing drew it as small as when there are five (29% of the card), so the one apple next to the big 1 was small (9). | A card with one thing draws it big (46%) (shared `frame.js`; one thing only, so nothing can overlap). All Numbers game tests pass. | numbers-b-trace4-before / -after, numbers-b-trace4-phone-after |

Seen, kept: Learn it (opener4) shows "apple = finger = 1" with = signs between the cards. The voice names the cards ("One apple. One finger."), so it stays; a teacher could swap the = signs for arrows later.

## numbers-c: Unit 5 (Five and more) and Unit 6 (The number path)

Each stop played as a made-up boy at Chromebook and phone size, start to end, with one wrong move; pictures of the start, the lesson, a round, the wrong move, its help and the end. (Pictures were taken in quick mode, `?fast=1`, which only shortens the waits; the screens are the same.) Pictures: `v2/screens/k-clarity/numbers-c-<stop>-<before|after>-<chromebook|phone>.jpg`.

| Game | What was wrong (rule) | What changed | Pictures |
|---|---|---|---|
| Learn it (opener5) | On a Chromebook the "8" card beside the bead rack ran off the right edge (12). | The rack is a little narrower when a number card stands beside it, so both fit. | opener5 |
| Fill the frame (tenframe) | A first wrong move only heard "Let's look again. A full row is five. Fix your frame." It did not show how (16). | The rows light up and he hears what the number is made of ("Ten is two full rows!", "Seven is five and two more."), then "Fix your frame." | tenframe |
| Bead push (beads) | The number to make was small in its card (12). First wrong move: same vague help (16). | Bigger number and picture in the card; the help lights the beads and says "Eight is five red and three white." | beads |
| Two hands (hands5) | Clear: peek, then show it on two hands; the "put one down" buttons are 66 px. | No change needed. | hands5 |
| Trace it (trace) | Clear: green start dot, the road, the rhyme, then the ten-frame picture. | No change needed. | trace |
| Find the mistake (mistake5) | The friend's hands in his speech bubble were small to count (9). First fix-help said only "A full row is five." (16). | Bigger hands in the bubble; every fix-help lights the frame and says the whole number ("A full row is five, and three more. Eight!"). | mistake5 |
| Review time (review5) | The start picture was a clock: it looks like telling time, not numbers (11). | A ten-frame, like every other Unit 5 stop. | review5 |
| Show me (check5) | In the bead rounds the number to make was small above the rack (12). | The number is about twice as big. | check5 |
| Learn it (opener6) | While he answered, an empty pale box sat at the bottom of the screen (the panel of a hidden arrow) (9). | The panel hides when nothing is in it. | opener6 |
| Path race (race6) | The arrow lay right over the one dot on the spinner, so "one dot" could not be seen (8). | The dots sit off the arrow's line, bigger; the spinner is a little bigger. | race6 |
| Where does it go? (where6) | Clear: empty stones, the number cards below, neighbours help. | Boys on the path are bigger (shared, see below). | where6 |
| Big steps (steps6) | "Where is Mendy now?" but Mendy was only about 40 px tall, half hidden behind the number signs (9). | The boys on the path are 25% taller (shared `path6.js`; also Review 7). | steps6 |
| Find the mistake (mistake6) | Clear: Avi hops wrong and he moves Avi; two swapped numbers and he swaps them back. | Bigger boys and spinner dots (shared). | mistake6 |
| Review time (review6) | In a "Fingers!" round with 5 or fewer, the hand had no height and did not show at all: he was asked "How many?" with nothing to count (8, 11). In the flower rounds an empty white bar sat at the bottom (9). The ten-frame and hands he counts were small (9). | The single hand has its size and shows its fingers. Empty panels are not drawn (`unit6.css`); the ten-frame and hands are about 30% bigger. | review6 |
| Show me (check6) | Clear: only 0 and 10 show, he places five numbers, then race turns. | Shared spinner and boys. | check6 |

New test: `v2/tests/k-clarity-numbers-c.js` plays every Unit 5 and 6 stop at both sizes and, at every moment he must answer, checks that each hand, ten-frame and bead rack really shows, no empty panel is drawn, and the number to make is big. (It fails on the old Review 6.)
Pictures for Hands and Trace (no change) are `numbers-c-hands5-*.jpg` and `numbers-c-trace-*.jpg`.

Choices made without asking: the Unit 6 path stays a straight 0–10 line across the whole screen (as big as a straight path can be); the cloth's eyes were already removed by numbers-a.

## numbers-d: Unit 7 (More, less, the same) and Unit 8 (Parts of 5)

Pictures: `v2/screens/k-clarity/numbers-d-<game>-before-chromebook.jpg` and `-after-` (Chromebook 1366×768 and phone 390×844; start, lesson, first round, the help after one wrong move, a later round, the end; full look, not `?fast=1`).

| Game | What was wrong (rule) | What changed | Pictures |
|---|---|---|---|
| All Unit 7 (the orchard) | Every orchard tree was covered in red apples, and the big apple tree stood beside the blankets in every game: a boy comparing apples saw dozens of extra apples (rules 8, 10). The blankets and apples were small in the middle of a big field; on a phone each apple was about 25 px (rule 9) | No apples hang on any tree: the only apples on screen are the ones to count (an apple still falls out of the leaves for "one more"). The apple tree stands only in the four games that use it (Learn it, One more one less, Find the mistake, Show me). The camera comes in so the blankets fill the screen; on a phone the friends are a little smaller and stand close beside their own blankets (never in front of an apple), so the apples are much bigger. Two rows of apples sit further apart, and scattered apples keep a bigger front-to-back gap, so from the camera no apple hides behind another | every Unit 7 sheet |
| Learn it (opener7) | As above; also an empty pale tile sat at the bottom when there was nothing to press (it looked like a button) | As above; the tile is see-through when there is nothing to press | opener7 |
| Line them up (pairs7) | The big apple tree full of apples stood right beside the blankets (rule 8) | No tree here; closer camera | pairs7 |
| Which is more? (more7) | The two number cards he taps were small at the bottom while empty blankets filled the screen (rule 9) | The number cards are about 1.5 times bigger: the biggest thing on the screen | more7 |
| One more, one less (build7) | Tree full of apples (rule 8) | The tree has leaves only; an apple still drops from it | build7 |
| The see-saw (seesaw7) | The apples on each tray were piled on top of each other: 5 or 6 apples could not be counted (rule 8). The see-saw sat small at the top with empty grass below, and a tree full of apples stood behind it | Long trays: the apples sit in rows of five, like a ten-frame (on a phone a shorter see-saw with rows of three, so it can be big). The camera frames the see-saw. No tree | seesaw7 |
| Find the mistake (mistake7) | Ari, who says the mistake, was a 30 px picture (rule 11: he must see who is talking). "Squeezed together" apples overlapped each other, so the boy could not count them. With 7 squeezed against 5 spread, both rows were the same length, so the "spread out looks like more" trick did not show (rule 7) | Ari is about 4 times bigger; bigger number cards. Squeezed apples are close but never touch. That round is now 6 squeezed against 4 spread out: the spread row is clearly longer, yet 6 is more. New test checks all of this | mistake7 |
| Review (review7) | Runs on the Unit 6 garden path (`path6.js`); numbers-c calmed that world for Unit 6, which also reaches this game | Nothing more changed here (shared world belongs to Unit 6) | review7 |
| Show me (check7) | Trees full of apples; scattered apples could tuck behind each other | As above | check7 |
| All Unit 8 (Bubby's kitchen) | Calm and clear (one table, kugel, towel, counters, a cup), but the camera showed the whole table, its legs and the floor, so the kugel slices on the plates were small (rule 9) | On a Chromebook the camera frames the tablecloth, so slices, plates and counters are bigger (the phone keeps its framing, so no counter is cut off the edge) | every Unit 8 sheet |
| Every Numbers game | The game's name showed only on the start screen (rule 13) | The title stays at the top, above the round dots, all game (shared `frame.js`) | |

New tests: `v2/tests/k-clarity-numbers.js` now checks the orchard (apples never touch, even squeezed; the spread-out row is longer; no apples on the trees; see-saw apples apart) at both sizes. `KNUM_ONLY=a.html,b.html` lets a builder run only some games in `k-numbers-games.js` (unset = every game, as before).

Choices made without asking (as a kindergarten teacher would): the apple tree keeps its leaves but no apples (an apple falling out of a tree is still natural); the see-saw on a phone uses rows of three instead of five, because a five-wide row would make every apple tiny; Unit 8 did not need a bigger change.

## review-numbers: independent review of every Numbers game (Units 1–8)

A fresh reviewer (who built none of it) looked at every game's pictures (a round, right after a wrong move, the end, a phone round) and read every game's spoken lines and wrong-move help, and scored each 1–5: "Would a 5-year-old know exactly what to do, and what is being taught, without an adult?"
(numbers-a and numbers-d had not marked themselves done; their sections above are complete and they had been idle for hours, so the review went ahead.)

**Round 1 scores**

| Unit | Scores |
|---|---|
| 1 | Learn it 4 · Meet 1,2,3 4 · Meet 4 and 5 4 · Match it 4 · Finger flash 4 · Peek 4 · Find the mistake 4 · Show me 4 |
| 2 | Learn it 4 · Count and jump 4 · What comes next 3 · Countdown 3 · Find the mistake 3 · Count with me 3 |
| 3 | Learn it 4 · Touch and count 4 · Give me 4 · Mix it up 4 · Find the mistake 3 · Show me 4 · Review 4 |
| 4 | Learn it 5 · Trace it 4 · Empty plate 3 · Fill the frame 4 · Match the number 4 · Fix the frame 3 · Show me 3 · Review time 4 |
| 5 | Learn it 4 · Fill the frame 4 · Bead push 4 · Two hands 4 · Trace it 4 · Find the mistake 4 · Review time 3 · Show me 4 |
| 6 | Learn it 4 · Path race 4 · Where does it go 3 · Big steps 4 · Find the mistake 3 · Review time **2** · Show me 4 |
| 7 | Learn it 4 · Line them up 3 · Which is more 3 · One more, one less 3 · The see-saw 4 · Find the mistake 3 · Review time 4 · Show me 3 |
| 8 | Learn it 4 · How many hiding 3 · Shake and spill 3 · Bond builder 3 · Find the mistake 3 · Review time 3 · Show me 3 |

Everything scored 3 or lower is being fixed (rows below), then scored again.

**Round 1 fixes (by unit):** Unit 2: the answer stones show their own dots (no more three identical speaker pictures), 6–10 as two big rows of five; skip's "said" bubbles are big and glow with their stone. Unit 3: twice's touch marks are big gold stars and the help counts them. Unit 4: zero4's hand starts as a fist; mistake4 shows the friend and never an empty frame; check4 is one job per round (build OR fingers: each number is asked one way, 12 rounds, not both ways in 18; a teacher's choice to keep the check short). Unit 5: review5 asks only what Unit 5 taught, answered on two hands or by tracing. Units 6–7: calm plain world (no painted garden, trees, flowers or petals), bigger number signs, review6's flowers one kind in a clear row in their own card, where6 on a phone brings the empty stones into view, mistake6 swaps only neighbours within 0–5 with that stretch glowing, the picnic boys stand on mats the colour of their blanket and the voice says so, apples twice as big, both blankets glow when he must tap one, the apples wait under a cloth, a big apple button instead of a half-hidden tree. Unit 8: the kitchen is just the table seen from above (things fill the screen), plates match their bond circles, the help counts the plates aloud (no finger talk with no hand), one tool per round, red and yellow hands on big cards, the total card that gave the answer away is gone. Every Numbers game test passes.

**Team choices (a kindergarten teacher's, written down for Esti):** wrong-move help is least-to-most: the first miss shows the picture or groups again, the second says the exact fix ("You have four. Put one down."); a "Show me" check shows the right answer after a miss and moves on (it is a check, not a lesson).

**Round 2 scores (a new reviewer):** Units 1–5 and 8 all 4 or 5 (Fill the frame 5, Ten-frame 5). Still 3: skip (Unit 2), steps6, mistake6 (Unit 6), pairs7, build7, mistake7, review7 (Unit 7). Being fixed, then scored again.


### numbers-b, extra fixes found by the first numbers-b session (added after the takeover)
The first numbers-b session (claim `numbers-b`) played every Unit 3 and 4 game too. These five fixes were not in the takeover's changes, so they are added here:
| Game | What was wrong | What changed |
|---|---|---|
| Give me (giveme) | The plate and rolls used only the left 60% of the screen; the right 40% was empty sky with just the check button. | The kitchen scene takes most of the screen (no hands in this game), so plate and rolls are bigger. |
| Review (review3) | "What comes next" stones were small flat blank ovals (about 30 px tall). | Big stones (up to 130 px), still lighting one by one. |
| Empty plate (zero4) | Five cookies (bonus) were piled on top of each other. | Cookies spread across the plate and are a bit smaller at 4 or 5, so none overlap. |
| Match the number (match4) | After a match, the small finger picture covered one of the things to count; on a phone the big numeral tag covered half the fruit. | The finger picture sits under the card (room made for it); the tag is smaller on a phone and sits on the corner. |
| Review time (review4) | The challah rolls in the tray were small. | Bigger rolls (up to 104 px), wider tray. |

**Round 3 (review-numbers-takeover-2, 2026-11-27 evening; the first takeover stopped at 17:52 when its helpers hit a usage limit).** Helper fixes wA (skip) and wC (Unit 8) were finished and merged (wA greyed the thumbs-up and never brightened it again: fixed). Three fresh reviewers in turn looked at full-look pictures of every round (Chromebook and phone, one wrong move) and read each game's lines and wrong-move help.

| Game | Round 3 first score | Fixed | Final score |
|---|---|---|---|
| Unit 2 Find the mistake (skip) | 3 | No stone stays bright after the count; on a phone the thumbs-up is no bigger than a stone; a stone he counted right gets a green tick; the demo starts "Watch me" | **4** |
| Unit 6 Where will Mendy land? (steps6) | 4 | — | **4** |
| Unit 6 Find the mistake (mistake6) | 3, 3, 3 | Spinner keeps its dots and Avi's start stone stays marked; on a phone start and landing are both on screen; the help counts hops ("One hop, two hops. Avi goes on three."); on mixed-up stones "Two goes here. This says three!"; the demo is the same job he then does | **4** |
| Unit 7 Line them up (pairs7) | 4 | Left-over apples wait in their own row in the line-up | **4** |
| Unit 7 One more, one less (build7) | 3 | The help SHOWS how (Dovid's apples on Shmuel's blanket, one drops in or lifts away); the first line says what to tap; the check is grey until the apples change | **4** |
| Unit 7 Find the mistake (mistake7) | 3, 3 | The pointing hand hides after each "Watch me" (it stayed on screen); squeezed apples stand apart; a wrong fix shows how; the voice says how before a fix | **4** |
| Unit 7 Review time (review7) | 4 | — | **4** |
| Unit 8 How many hiding (hide8) | 4 | "Watch the towel!" (no "close your eyes"); plain cloth and kugel | **4** |
| Unit 8 Show me (check8) | 4 | Bigger number bond and cards | **4** |
| Unit 8 Review time (review8) | 2 (4 of 6 rounds not seen before) | Ten-frame and hands rounds fill the screen (the play area had shrunk to 122 px and the frame sat off screen); finger-down button under the fist; kugel = kugel on the "same" button; plates apart, slices inside the rim; "Watch me" before frame and one-more rounds; a right one more drops into the marked spot | **4** |

**Every Numbers game, Units 1–8, now scores 4 or 5** (Units 1–5 and 8 from round 2, the rest from round 3). Tests: every changed game's test and the Numbers clarity checks pass.
**Team choices (written down for Esti):** 6–10 stay drawn as a full row of five and the rest (ten-frame structure) rather than dice patterns; mistake6 keeps both kinds of slip (hops and swapped numbers), each with its own "Watch me".
