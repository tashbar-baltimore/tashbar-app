# Button tutorial (built 26 Nov 2026)

HoS ask (his words, one line): "simple cards on the real home screen; each card highlights one button or label, with a bubble underneath saying what it does and when to tap it, and a Next button to the next card."

## What the boy sees
- His own real home screen, dimmed, with ONE thing lit up (a soft ring around it, the rest of the page darker).
- A white bubble right under the lit thing (above it if it is near the bottom), with a small arrow pointing at it.
- In the bubble: the name in bold, one line "what it does", one line "when to tap it", and the buttons:
  - **Next** (kit main, the one thing to do), **‹ Back** (kit quiet, from card 2 on, grade 3 and up only), and a round kit ✕ top right of the bubble to stop the tour.
  - A small progress label "3 of 12" (blue, progress).
- Nothing on the home works while the tour is open (taps outside the bubble do nothing), so he cannot get lost.
- Last card: "That's all the buttons!" with main **Done**.

## The 12 cards (in this order)
| # | Lights up | Bubble words (draft) |
|---|---|---|
| 1 | A gold main button (the home's "Do this now" tile's button, or a sample) | **Gold button.** The one thing to do now. Tap it to go on. |
| 2 | A white quiet button ("Sign out") | **White button.** Another choice. Tap it only if you want that. |
| 3 | A round ✕ (shown on a sample pop-up) | **Round ✕.** Closes a pop-up. In a lesson it asks first. |
| 4 | The house (sample, top left; K–3 the big "Home") | **House.** Takes you back to your home page. |
| 5 | Back (sample; K–3 the big "Back") | **Back.** Goes back to the page you came from. |
| 6 | A purple tool (🔊 Read it to me) | **Purple circle.** A helper: it reads to you, plays music or gives a hint. |
| 7 | Green label (his money) | **Green = money.** Shows money. You can't tap it. |
| 8 | Blue label ("0 of 3 done today") | **Blue = how far you got.** |
| 9 | Yellow label ("Do this now") | **Yellow = do this now.** |
| 10 | Violet label (a rank or streak) | **Purple = your rank and trophies.** |
| 11 | Gray label ("Locked") | **Gray = not open yet.** |
| 12 | Pink label (his subject) | **Pink = the subject.** |

- If the home does not have one of these on it right now (✕, Back, tool, rank, lock), the card shows a small sample of the kit button or label inside the bubble, lit, so every card always has something to point at.
- All words and samples come from the kit (`TLK.main`, `TLK.quiet`, `TLK.x`, `TLK.home`, `TLK.back`, `TLK.tool`, `TLK.pill`); the tour draws no buttons of its own.

## How it will be built (when approved)
- One new add-on `src/ButtonTour.html` (registered in `Photos.js` and `Speed.js`), `window.TLTOUR.open()`. It finds each thing on the real home by its data attributes (e.g. `[data-gm="pfout"]` for Sign out), measures it, and places the ring and bubble; it re-measures on resize and phone/Chromebook size.
- Seen state saved per boy (so it shows once), and a way to replay it from My profile ("How the buttons work", a quiet button).
- No money, no rewards, never on staff or admin screens. K–1 boys (games-only path) do not get it.
- Test in `tests/run.js`: the tour opens on the home, has 12 cards, every card lights something visible, Next walks to the end, ✕ closes it, and the page has no non-kit buttons in the bubble.
- Pictures: each card for a made-up grade 2 and grade 5 boy at 1366×768 and 390 px.

## HoS answers (26 Nov 2026) and what was built
- It never plays by itself. It opens from a small round 💡 (purple tool) to the right of Sign out on the home, and from "How the buttons work · Show me" in My profile's settings (near the top).
- For his first 10 sign-ins, a small pop-up by the 💡 says what it is and that it is also in My profile (once per sign-in, counted per boy on the device; never for K–1).
- K–3: the short tour (6 cards) reads each bubble out loud by itself. Grade 4+: 12 cards with a Read it to me tool.
- The words only say what a thing is and where it sits, and that labels are only to read (HoS: "not explaining too much").
- The 💡 and Sign out sit flush with the right edge of the tiles.
- Code: the end of `src/GameMap.html` (`window.TLTOUR`). Pictures: `docs/screens/tour-gr5-*.jpg`, `tour-gr2-*.jpg`. Check: `node tools/screens/tour.js OUT TAG GRADE`.
