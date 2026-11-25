# Button system handoff (for the next builder)

Rules: `docs/BUTTON-SYSTEM.md` (binding; kit `src/UiKit.html` `window.TLK`; test `tests/lib/uikit.js`).

## Done (live 24 Nov 2026)
- Round ✕ top right on every boy pop-up: #411 (shelf, music, week page, story, Gam Zu, note sent, find my levels, K–1 warm-up games) and #420 (store, bank/badges/journey/week rooms, Kodesh drawer, Kodesh Quest, Taryag, Torah Journey, Library, picture zoom, Spark Path).
- How it was done, reuse it:
  - `TLK.x(attrs,'tr')` for a pop-up card, `TLK.x(attrs,'')` inside a header row. Always with a fallback when `window.TLK` is missing.
  - Header CSS like `.xx-hd button{...}` must become `button:not(.tlk)` or it restyles the kit.
  - `src/GameMap.html`: `body:has(.overlay,#hlx-shelf,#lg-games,#gm-room,#tlstore,...) :is(#pr-av,#bbx-door,#tlmenu){visibility:hidden}` hides the Workbook button, profile circle and corner dots behind pop-ups. Add new pop-ups/pages to that list.
  - `src/SignOutBar.html` makeRoom() skips while the dots are hidden (it used to push buttons ~20–90 px away from the corner).
- Pictures and the overlap check: `tools/screens/` (README there).
- K–1 game ✕ is 84 px (size of its speaker button), Moshe's decision 24 Nov.

## Not done
- Seen, not changed: story "For the Shabbos table" box (white words on pale yellow); Spark Path cannot be reached from the new home and opens under it (no z-index on #tr-ov).
- Picture zoom ✕ was never seen in a picture (could not reach a lesson with a real picture).

## Done: step 2, the house top left on full pages (25 Nov 2026)
- The big yellow HOME bar `#gm-nav` is gone (`navHTML` returns nothing, `#gm-nav{display:none}`). Every full page in `src/GameMap.html` (My map, Change subject, My work, My profile, All my lessons, Store page, Arcade, ...) has `hud()` = Back (only when `GM.from` is set) + `TLK.home('data-gmnav="home"','',TLK.young(grade))` + the money chip, top left. Never on the home.
- Chumash page (`src/ChumashPage.html`) and the Block Builders Workbook home (`src/BlockBuildersUI.html`): the old ✕ became the kit house (same `data-chm="close"` / `data-bb="close"`). `#bbx button` is now `#bbx button:not(.tlk)` so it does not restyle the kit.
- Phone, My map with the Workbook door: the money chip moves under the house so the door does not cover it.
- Tests: `tests/run.js` now checks ONE kit house top left on every page but the home and no HOME bar.
- Pictures: `docs/screens/house-before-*.jpg`, `house-after-*.jpg`. Check: `node tools/screens/pages.js OUT TAG GRADE`.

## Done: step 3, Arena and Mistake Detective (25 Nov 2026)
- Arena (`src/ArenaPage.html` `outBtns()`): kit house top left; kit Back before it on inner pages (they come from the Arena menu). Phone: the title moves under the buttons when Back is there.
- Mistake Detective review (`src/Review.html`): kit ✕ top left (`TLK.x`). Corner dots, profile and Workbook hide behind it (`#mdx.on` in the GameMap hide list). Its end buttons ("New cases", "Done") are not changed.
- Pictures: `docs/screens/arena-before-*.jpg`, `arena-after-*.jpg`. Check: `node tools/screens/arena.js OUT TAG GRADE`.

## Done: step 4, Back on inner pages (25 Nov 2026)
- Workbook job page: kit Back (to the workbook, `data-bb="home"`) + kit house (leaves the workbook) top left, replacing "◀ 📘". K-3 phone: the job title moves under the buttons.
- Chumash inner pages: kit Back (`data-chm="home"`) before the house, replacing "⬅ parsha".
- Pictures: `docs/screens/inner-back-after-*.jpg`.

## Next
- Mistake Detective end buttons ("🔁 New cases" has icon + word) are not on the kit yet.
