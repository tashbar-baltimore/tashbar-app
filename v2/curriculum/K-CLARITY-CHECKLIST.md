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
