# The Button System (boys' app)

Decided by the Head of School, 23 Nov 2026. The pictures are on "The Button System" page (claude.ai artifact G6kqMhNm71M57ZUYS8QUYj).
The look lives in ONE file, `src/UiKit.html`, and the test `tests/lib/uikit.js` checks it. **Use the kit; do not draw your own buttons.**

## Buttons
| Kind | Job | Look | Kit |
|---|---|---|---|
| Main | The one thing to do now | Solid gold, words only, at most one per screen | `TLK.main('Start', 'data-act="…"')` |
| Quiet | Every other choice | White, thin outline, words only | `TLK.quiet('Not now', …)` |
| ✕ | Close a pop-up / leave a lesson | Round 44 px, icon only | `TLK.x(attrs, 'tr')` pop-up · `TLK.x(attrs, 'tl')` lesson |
| House | Leave a full page (My map, My work, My profile) | Grade 4+: round 44 px, icon only, top left. **K–3: a bigger button with the house and the word "Home"** (the one exception to "icon or words") | `TLK.home(attrs, 'tl', TLK.young(grade))` |
| Tool | Read it to me, music, hint | Round, one icon, one look per tool everywhere | `TLK.tool(icon, label, attrs)` |
| Tile | Opens a place | The whole card is the button; no "OPEN ▶" inside | class `tlk tlk-tile` |

- Every button **floats** (soft lift: solid color + soft wide shadow) and **settles** onto the page when tapped. Hand pointer; yellow ring with the keyboard.
- **Icon or words, never both.** No "✕ Close", no "▶ Start". The one exception: the K–3 Home button (house + "Home"). The ▶ only ever means "play a sound or video".
- Never an underlined web link for an action.

## Where things sit
- **Pop-up** (bank, trophies, store, passport): one round ✕ **top right**. Nothing else closes it (tapping outside or Escape also closes it).
- **Full page** (My map, My work, My profile): the round **house top left**.
- **Lesson**: ✕ **top left**; it always asks "Leave this lesson?" with **Keep learning** (main) and **Leave** (quiet).
  Grade 3 and up: a quiet **‹ Back** beside Next on **teaching screens only** (never on questions; never for K–2).
- Top left always means "out". The corner menu dots stay top right.

## Questions ("Buy this?", "Send this?")
A **main** button that says what happens + a **quiet "Not now"**. **No ✕.** Never "Yes / No". `TLK.ask({title, yes, yesAttrs, noAttrs})`.

## Information is never a button
Soft-tint pills and boxes, no shadow, no outline, no hand pointer, never a button's colors. **One color per meaning on every page:**

| Kind | Kit | For |
|---|---|---|
| Money | `TLK.pill('money', '$5.00')` (green) | prices, rewards, the money |
| Progress | `'prog'` (blue) | "0 of 8 earned", "2 of 3 done today" |
| Do this now | `'now'` (yellow) | what to do next, today's pick |
| Rank and trophies | `'rank'` (violet) | ranks, levels, streaks, trophies |
| Locked | `'lock'` (gray) | anything not open yet |
| Subject | `'subj'` (pink) | "Math · Level 5", "Chumash" |

Stat boxes: `TLK.box(kind, label, value)`, in the color of what they count.

## Words (`TLK.WORDS`)
Start · Next · ‹ Back · Check · Buy it / Not now · Send / Not now · Keep learning / Leave · Try again.
Money is **"My money"**. The canteen's balance is always **"canteen money"** (never just "money"). **"Tashbar Bank"** stays wherever it names the bank itself (paychecks, deposit slips, the no-interest note, the $1,000 Club, money lessons).
