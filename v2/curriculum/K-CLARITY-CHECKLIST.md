# Kindergarten clarity checklist (ABC Unit 1, pull request #595)

Checked against the Kindergarten clarity rules (`v2/curriculum/K-CLARITY-RULES.md` on the Shapes and Numbers branches; rules numbered the same).
Every game was played as a made-up boy in the full 3D look (`?fast=1&tier=2`: quick waits, full picture) at Chromebook (1366×768) and phone (390×844) size, with one wrong move. Pictures: `v2/screens/k-clarity/abc-u1-<game>-<before|after>-<chromebook|phone>.jpg` (opener, rhyme, clap, sort and fixit; the other games share the same world change).

## other-595: Kindergarten ABC Unit 1 "Ears On"

| Game | What was wrong (rule) | What changed | Pictures |
|---|---|---|---|
| All 9 games | The world was busy: thousands of spiky 3D grass blades swaying all over the screen, pink butterflies flying, glowing pollen floating, 40 flowers (10). Every right answer set off a big confetti storm over the whole screen (10). | Calm by default, the same choice as Shapes: no grass blades, no butterflies, no floating sparkles, 10 flowers far from the play (`scenes.js`; `?busy=1` shows the old world). A right answer gets a small burst near the answer; the end gets a smaller one (`game.js`). | opener, rhyme, clap, sort, fixit |
| All 9 games | The game's name was nowhere on the screen (13). | The name sits at the top in a white pill above the round dots (`play.html`). | opener, rhyme, clap, sort, fixit |
| Ears On! (opener) | Busy world (above). Otherwise clear: one thing on the table at a time (bell, cat and hat, drum, moon). | Calm world. | opener |
| Rhyme Pond | The camera looked across the pond almost level, so the near pictures covered the far ones (the cat over the sun, the hat over the bun) (8, 9). | The pond is seen more from above, so each picture stands clear. | rhyme |
| Drum Hill | Busy world, a butterfly over the drum (10). Clear otherwise: a dot appears for each clap. | Calm world. | clap |
| Sound Garden | Busy world (10). | Calm world. | sort |
| The Picture Train | Busy world (10). | Calm world. | train |
| Bee Paths | Busy world; confetti storm after each path (10). | Calm world, small burst. | paths |
| Fix It | Busy world (10). Clear otherwise: Eli and Mendy, two pictures, thumbs up or down. | Calm world. | fixit |
| Listening Walk, Show Me | Busy world (10). | Calm world. | review, check |

Not changed (for Esti): ABC is being rebuilt "the calm way" (#620, a sample waiting for her). These Unit 1 games stay 3D; if the calm rebuild replaces them, these fixes can be dropped.

## other-610: Kindergarten ABC Unit 3 "i n m d" (pull request #610)

Played as a made-up boy in the full look at Chromebook and phone size, one wrong move per game. Pictures: `v2/screens/k-clarity/abc-u3-<game>-before-*.jpg` (the builder's own pictures, plus full-look ones for Trace i and the n hunt) and `-after-*.jpg`. Unit 1's calm world (#595: no grass blades, butterflies or floating sparkles; a small reward burst; the game's name on screen) is merged into this branch, so Unit 3 has it too.

| Game | What was wrong (rule) | What changed | Pictures |
|---|---|---|---|
| Every Unit 3 game | The title said "Kindergarten ABC", not the game (13); on a phone a long name was cut ("Memory Ca...") | Each game shows its own name (Meet i, Trace n, Basket Catch, Memory Cards ...); a long name wraps on a phone | all |
| Meet i, n, m, d | The letter was shown only as a picture made of things (an inchworm, a net, mountains, a drum and stick): it barely looked like a letter (1, the letter version of "plain shapes first"). Big sparkle storms on every cheer (10). A purple butterfly flew round the n (10) | Right after "This shape is a letter", the plain letter, as it looks in a book, pops up beside the picture-letter ("In a book, it looks like this.") and stays all game. The letter worlds cheer with a small burst. No butterfly (he still taps the net's hoop). The dish (it looks like a plate, a p word) is never asked about | abc-u3-i-meet, n-meet |
| Trace i, n, m, d | The path to trace was a pale cream ghost on light green, with white pulsing dots: almost invisible (9) | A white road with still, dark-blue dots, like a tracing worksheet (shared tracer, so every tracing game gains) | abc-u3-i-trace |
| The Inchworm Path (i hunt) | Clear. One answer is an iguana, which many children call a "lizard"; the other choice (a fish) is clearly not i, so it can still be solved | Left as is (the word list is shared with Unit 2; noted for Esti) | abc-u3-i-hunt |
| Basket Catch (n hunt) | Butterflies carried the pictures, flying all over the screen (Esti's exact complaint, 10); the catcher was a net while a net was also one of the answers (11) | The pictures sit still in neat rows; the catcher is a basket ("Drag the basket over them"); the leftover pictures clear away before the new word; on a phone the basket waits below the pictures, never on top of one | abc-u3-n-hunt |
| Memory Cards (m hunt) | Each card back had a gold ring with a dot: it looked like one more picture | Plain card backs | abc-u3-m-hunt |
| Drum on d (d hunt) | The dish looked like a plate (p), so "does it start with d?" was arguable (7) | The dish is not used | abc-u3-d-hunt |
| Listening Walk (review) | The mop looked like a cupcake liner on a stick | A real mop: long floppy strands (shared picture, so Unit 1 gains too) | abc-u3-review |
| Slide the Sounds, Sound Boxes, Slide Again, Fix It, Show Me | Clear: big letter tiles, one thing at a time | No change | abc-u3-slide, boxes, fixit, check |

Choices made without asking: the picture-letters stay (a picture that becomes the letter helps children remember the sound), but always next to the plain letter; the iguana stays for now. Not changed: ABC is also being rebuilt "the calm way" in a sample (#620) that waits for Esti; these 3D games stay until she decides.
Tests: the whole Unit 3 test (`v2/tests/k-abc-unit3.js`) passes: all 19 games to the end at Chromebook and phone size, wrong moves get a gentle fix, 3 stars for perfect play. (Under heavy load the "Drum on d" wrong-move check, which waits only 4 seconds, can time out; it passes on a quiet machine.)
