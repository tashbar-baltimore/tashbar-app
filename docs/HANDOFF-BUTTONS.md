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
- Deferred: Arena (⬅ Back + ✕) and Review (✕ + Done).
- Seen, not changed: story "For the Shabbos table" box (white words on pale yellow); Spark Path cannot be reached from the new home and opens under it (no z-index on #tr-ov).
- Picture zoom ✕ was never seen in a picture (could not reach a lesson with a real picture).

## Next: step 2, the house top left on full pages (decided)
- Replace the big yellow HOME bar `#gm-nav` (src/GameMap.html) with `TLK.home(attrs,'tl',TLK.young(grade))`: grade 4+ round 44 px house; K–3 bigger "🏠 Home".
- Pages: My map, My work, My profile (GameMap), the Chumash page (`src/ChumashPage.html`, its ✕ top left `data-chm="close"`), the Block Builders Workbook (`src/BlockBuildersUI.html`, `.bbx-ib data-bb="close"`).
- Back (`TLK.back`) sits before the house, only where the rules say (My profile → All my lessons, Skill tree, My week; My map → Change subject). Back already exists from #358; keep it.
- Never on the home itself, never on a pop-up. Top left always means "out"; corner dots stay top right.
- Check: house/back not touching anything (copy `tools/screens/overlap.js` for `.tlk-home,.tlk-back`), K–3 and grade 4+ boys, 1366×768 and 390 px.
