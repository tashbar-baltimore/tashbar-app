# The boys' world (Tashbar 1.0 student experience)

**Decided 2026-11-27** by Esti, with the Head of School (Rabbi Khaver) present and approving: the whole student side of **1.0** is being rebuilt around the new afternoon (Teacher Time, Independent Study, Free Play; `docs/CLASSES-BUCKET.md`) as one immersive world. It is built in 1.0, not 2.0 (2.0 stays the slow, curriculum-first app).

**In her words:** "more of an immersive experience, a lot of 3D, similar to the vault ... you fly through ... and you go to your next place, and a lot of happiness, and a lot of excitement, and calmness, and relaxation, and stunning, rich, inspiring feelings of empowerment ... all the graphics and the movement and the soaring feelings should all match." Bright and happy, never dark.

**One line to check every piece against:** a boy soars through one beautiful, bright world. Work happens in a calm mountain kingdom; free time is a golden city in the clouds. Every picture, movement and sound feels like the same world.

## Two parts of one world
| Part | When | The feeling | Places |
|---|---|---|---|
| **The Mountain Kingdom** (the regular program) | Sign-in, Teacher Time, Independent Study, his own lessons, map and work | Calm, strong, focused, sunrise-gold, fresh air | The Gate (sign-in), the Great Terrace (home), the Teacher Time Hall, the Bucket Spring (Independent Study), the Trail up the mountain (his map and levels), the Library Tower, the quiet study nook around a lesson, the Summit (celebrations) |
| **The Golden City in the Clouds** (Free Play) | Whatever a teacher opened ("Who gets what, when"), Free Play, after-hours | Joy, reward, wonder, "I earned this" | The Sky Gate (the flight up), the City Square (free-play home), the Canteen Court, the Grand Market (store), the Chavrusa Arena, the Game Pavilion (arcade, Mistake Detective, Kodesh Quest), the Workshop (Block Builders, Chumash Lab), the Olam Haba sky |

- **Flying:** every move between places is a short flight (about 2 seconds): over bridges and waterfalls in the kingdom; up through the clouds into the golden city when free time opens (the big moment). A boy can always tap to skip, and "reduce motion" turns flights into a soft fade.
- **Calm where it counts:** lesson screens stay clean and quiet. The world frames the learning; it never covers it.
- **Sound:** gentle uplifting music per part (kingdom: strings and wind; city: bright and bouncy), soft whooshes on flights, a warm chime on every check mark. Music can be turned off.

## Look rules (every picture, every screen)
- Top-quality 3D animated-film look, bright late-morning sun from the upper right, rich detail, soft glow, vivid but not neon. Cool for boys 9–14; never babyish; never dark or scary.
- Kingdom palette: sky blue, meadow green, warm stone, sunrise gold, waterfall white. City palette: gold, cream, sky blue, soft rose, sparkle white.
- Pictures are layered (far, middle, near, each a cut-out) so the camera can move through them; real 3D only for a few showpiece objects (the crystal bucket). Every screen has a simple flat fallback for a slow Chromebook.
- School picture rules (`docs/HANDOFF-PICS.md`): no words, letters or numbers inside pictures; no people unless a picture says so (boys and men only, modest frum dress); kosher food; no crosses or other religions' symbols (including window bars, railings, patterns); no domes or towers that look like a church or mosque; no Divine Name; no logos.

## Buttons
The button system (`src/UiKit.html`, `docs/BUTTON-SYSTEM.md`) stays the one source of every boy-facing button. The new look is applied by restyling the kit to match the world (with the HoS's approval above), never by drawing buttons by hand.

## Picture orders
`docs/classes-bucket/PICTURE-ORDERS.md`: YCB-1 (the afternoon, sent 2026-11-27) and YCB-2 (the whole world).

## What is built (2026-11-27, all in `src/ClassMode.html`; pictures listed in `YCW_ART`)
- **The Gate** after sign-in (grade 2+ known): the Gate opens and the camera flies through (about 3 s); waits for the picture; never blocks a tap.
- **Home on the Great Terrace** (grade 2+, home tab, not in class time).
- **Teacher Time Hall** and **Bucket Spring** (the afternoon, `docs/CLASSES-BUCKET.md`); flights between them push through the valley with eagles; a door a teacher opened rises through the clouds (gondola) to the Golden City.
- **Golden City behind the free-time places**: Store (Grand Market), Chavrusa duels (Arena), Mistake Detective and Kodesh Quest (Game Pavilion), Block Builders and Chumash Lab (Workshop), My Library (Library Tower), Olam Haba (calm sky). The Canteen keeps its own 3D room.
- **The quiet nook** behind every lesson.
- Still to use: the Trail (his map), the Summit (celebrations), the fortress, stops, bridge, waterfall, gondola as a ride, plaque for the city, ring.
- Rules kept: at rest nothing is drawn by script (the drift is CSS), so nothing moves behind a K-1 game; K-1 boys see none of this; reduce motion turns flights off.
