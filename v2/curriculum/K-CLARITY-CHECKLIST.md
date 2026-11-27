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
