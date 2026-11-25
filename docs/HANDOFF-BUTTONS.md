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

## Done: step 5, information on the kit labels (25 Nov 2026)
- Every label a boy only reads is a kit pill or box (`TLK.pill`, `TLK.box`), one color per meaning: money green, progress blue, do-this-now yellow, rank violet, locked gray, subject pink. Holders are flat (no shadow, no outline).
  - Home tiles (`src/GameMap.html` `homeHTML`): "Do this now" (now), "Done" (prog), Arcade "Locked" (lock), My map "Math · Level 5" (subj), Store "You have $…" (money), "0 of 3 done today" (prog).
  - The money by the house (`hud()`): a money pill, **no longer a button** (the Store opens from its home tile). Test: `tests/run.js` "button system step 5".
  - My map: unit bar (subject pill, "N to the boss" / "Boss now!" / "Cleared"), goal card ("Your next level", "Today's pick", subject + levels-to-boss). My work: each round's "Your turn" / "Next" / "Cleared" / "Locked" / "Picked for you", the treasure chest line. Money page: "My money" box, today/this-week pills, payday, money story amounts.
  - Store pop-up (`src/StoreKid.html`): "My money" box, prices (money), "Yours" (prog), "Need $… more" (lock), holiday "Back before …" (lock), order states, My week boxes.
  - Arena home (`src/ArenaPage.html`): Arena points, wins (rank), showdowns, taught, "N more points to become …" (prog), trophies (rank), topic "Mastered" (prog).
  - Workbook home (`src/BlockBuildersUI.html`): "Next" (now), "Page on the way" (lock). Chumash home (`src/ChumashPage.html`): Parsha (subj), this week's (now), pesukim (prog), level and mastered (rank).
  - K–1 games path (`src/K1Only.html`): each game's number (now / prog / lock).
- Mistake Detective end (`src/Review.html`): "New cases" = `TLK.main`, "Done" = `TLK.quiet`, words only. Enter/focus use `.mdkit .tlk-main`.
- Pictures: `docs/screens/info-before-*.jpg`, `info-after-*.jpg`. Check: `node tools/screens/info.js OUT TAG GRADE` (+ `pages.js`, `arena.js`).

## Done: step 6, the Store pop-up's buttons on the kit (25 Nov 2026)
- `src/StoreKid.html`: tabs are words only; the open tab is a `now` label (you are here), the others kit quiet buttons; on a phone they wrap.
- Each card: "Buy it", "Make it my goal", "Use it" are kit quiet buttons (many cards, so no main); "My goal" and "In use" are labels with a quiet "Not my goal" / "Stop using it".
- "Go to the canteen" quiet; gift amounts quiet (the chosen one a money label); "Send $…" main.
- "Buy …?" question: main "Buy it" / "Send" / "Give it" + quiet "Not now" (title now readable: it was light text on white). Done card: main "Yay!". Paycheck: main "Put it in my bank".
- CSS like `.sttabs button` / `.stcard button` / `.amts button` (and GameMap's `body.gm-nav .sttabs button`) now use `:not(.tlk)`.
- Pictures: `docs/screens/store-buttons-before-*.jpg`, `store-buttons-after-*.jpg`. Check: `node tools/screens/info.js OUT TAG 5 storepop,storegive,storeask`.
- Not changed: the old home's goal bar and store button (`goalBar`, `.stbtn`), which only show on the old home.

## Next
- Not yet on kit labels: Mistake Detective's points and case dots, the old Trophies/My week rooms, Canteen, lesson screens. The Chumash/Workbook/Arena buttons are not on the kit yet.
