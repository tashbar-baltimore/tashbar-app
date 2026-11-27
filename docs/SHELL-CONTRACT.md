# The new shell: how the workstreams fit together (2026-11-27)

The shell overhaul (`docs/SHELL-OVERHAUL.md`) is built by **several Claude accounts at once** (Esti, 2026-11-27: "to get it done quicker, not to compromise the quality"). This page is what keeps them from stepping on each other. It is binding on every workstream, together with `CLAUDE.md`, `CONTRIBUTING.md`, `docs/BUTTON-SYSTEM.md`, `docs/WORLD.md`, `docs/SHELL-AND-LESSONS.md` and `art/README.md`.

**One line to check every piece against:** every feature a boy has today still works, inside one clean new shell that looks and moves like the Mountain Kingdom (work) and the Golden City in the Clouds (free time).

## Who owns what
Each workstream edits **only its own files**. Nothing else.

| Workstream | Its file | Its test | Its places (SHK place ids) |
|---|---|---|---|
| 0 (the lead session) | `src/ShellKit.html`, `src/ShHome.html`, `src/ClassMode.html`, `src/GameMap.html`, `src/Photos.js`, `src/Speed.js`, `tests/run.js`, `tests/lib/screens.js`, `tools/screens/shell.js`, this page | `tests/lib/shell-kit.js`, `tests/lib/shell-home.js` | the home (Great Terrace), the City Square, the corner menu, where a finished lesson lands; Your Classes & Bucket (step 3); deleting the old shell (step 4); adding new pictures to `art/` and `SHK.ART` |
| A | `src/ShMoney.html` | `tests/lib/shell-money.js` | `bank` (My money, the Treasury), `store` (the Grand Market) |
| B | `src/ShProfile.html` | `tests/lib/shell-profile.js` | `profile` (his room), `trophies` (the Trophy Hall), `passport` (Torah Tracks, Taryag Quest, Torah Plus, the Chumash page) |
| C | `src/ShWork.html` | `tests/lib/shell-work.js` | `work` (My work), `map` (the Trail), and `SHK.subjects()` (set in its own file): the list of his subjects and levels that replaces the `tlFindLevelCard` chain |
| D | `src/ShCity.html` | `tests/lib/shell-city.js` | `arena` (Chavrusa Arena), `games` (the Game Pavilion: Mistake Detective, Kodesh Quest), `workshop` (Block Builders, Chumash Lab) |
| E | `src/ShPlaces.html` | `tests/lib/shell-places.js` | `canteen`, `library`, `olamhaba`, `music`, `talk` (Talk to my Rebbe) |

- Your rows in `docs/SHELL-OVERHAUL.md`: tick only the rows for your places (other workstreams tick theirs; git merges different lines cleanly).
- Your pictures: `docs/screens/shell/<your place id>/`.
- **Never edit** another workstream's file, `src/ShellKit.html`, `src/UiKit.html`, `src/ClassMode.html`, `src/GameMap.html`, `src/Photos.js`, `src/Speed.js`, `tests/run.js`, any lesson file (`OneBite*`, `CoreKit*`, `CoreData*`, `CoreReader`, `KriyahMore`, `packs/`), the server's money or progress code, or staff screens. If you need a change there, open a GitHub issue titled `SHELL-KIT: <what you need>` (or `SEAM: ...` for the lesson seam) and carry on with the rest; workstream 0 answers.
- **Old code stays** until step 4. You do not delete or change the old screens (StoreKid, GameMap, ArenaPage, ...). Workstream 0 deletes them once every row is ticked.

## How a place is built
1. **Register it** in your file: `SHK.place({ id, name, world, icon, scene, door, order, sub, pill, show, open })`.
   - `world`: `'k'` (Mountain Kingdom: work) or `'c'` (Golden City: free time). `scene`: its picture (below). `icon`: a picture name or an emoji; `emoji`: shown instead while the icon picture is still on order.
   - `door`: its class-lock door from `TL_DOORS` in `src/ClassMode.html` (`store`, `profile`, `torah`, `canteen`, `arena`, `games`, `blockbuilders`, `chumashlab`, `library`, `olamhaba`, `music`, `talk`). A tile with a door is shut during class unless a teacher opened that door; a place with no door is shut during class.
   - `sub()`, `pill()`: the tile's small line and its information pill (`TLK.pill`), from the same data today's tile uses. `show()`: false hides the tile (the same grade and "switched on" rules as today).
   - `open(def)`: draws the place with `SHK.page({...})` (a full page: the house top left) or `SHK.pop({...})` (a pop-up: one round x top right). Inner pages of a full page pass `back:true, onBack` (the round Back before the house).
2. **Rebuild it fresh**, cleaner and calmer: the same functions and the same server calls as today (your rows in `docs/SHELL-OVERHAUL.md` list them), new code. Call the server with `SHK.call('fnName', ...args)` (it adds his token). **The server sets every money amount:** show what it sends; never work out a price, a reward or a balance yourself.
3. **Lessons** open only with `SHK.openLesson(skillId)` (the seam). Never call `startMission` yourself, never draw anything inside a lesson.
4. **Buttons** come only from the kit (`window.TLK`): one `TLK.main` at most per screen, `TLK.quiet` for every other choice, `TLK.ask` for "Buy this?" / "Send this?", `TLK.pill` / `TLK.box` for information, class `tlk tlk-tile` for cards that open something (`SHK.tile(id)` draws a place's tile). Words from `TLK.WORDS` and `docs/BUTTON-SYSTEM.md` ("My money", "canteen money", "Tashbar Bank"). Never draw a button by hand. K–3 (`SHK.young()`): the bigger Home and Back.
5. **The look** (`docs/WORLD.md`): bright, calm, clean, never dark; exciting and inspiring for boys 9–14. Put content on `shk-card` boxes over the scene so words stay easy to read. Gentle CSS movement only; **nothing drawn by script at rest** (no `setInterval` that changes the page; no timer that toggles a class on `body`).
6. **Who sees it:** grade 2 and up (`SHK.on()`). Kindergarten and Grade 1 keep their games path (`src/K1Only.html`); never show anything to them.
7. **Your test** (`tests/lib/shell-<you>.js`, `module.exports.page = async (pg, map) => ({ fails, oks })`, run automatically by `tests/run.js`): open each of your places with `SHK.go(id)`, use every function with made-up server answers (copy the `google.script.run` proxy in `tests/lib/classesbucket.js`), check only kit buttons, one house top left or one x top right, the words, and that the server was asked the right call. Close everything and restore the page at the end. Never weaken any other test.

## Scenes and pictures
- Already in the library (`SHK.ART`): kingdom `ycw-k-terrace`, `-hall`, `-spring`, `-trail`, `-library`, `-summit`, `-nook`, `-gate`; city `ycw-c-square`, `-skygate`, `-canteen`, `-market`, `-arena`, `-pavilion`, `-workshop`, `-calm`; layers `ycw-k/c-sky`, `-far`, `-mid`, `-near`; effects `ycw-fx-cloudwall`, `-rays`, `-mist`, `-trail`; pieces `ycw-k-stop`, `-fortress`, `-bridge`, `-waterfall`, `-birds`, `ycw-c-gondola`, `ycw-ui-plaque-kingdom`, `-plaque-city`, `-ring`, `-coin`, `-star`, `ycb-cloud-1..4`, `ycb-confetti`, `ycb-sparkles`; icons `ycb-ic-*` and `ycw-ic-*` (search `art/CATALOG.md`).
- **On order (YCB-4, sent 2026-11-27, `docs/classes-bucket/PICTURE-ORDERS.md`):** `ycw-k-vault`, `ycw-k-vault-door`, `ycw-k-trophies`, `ycw-k-room`, `ycw-k-post`, `ycw-k-study`, `ycw-c-music`, `ycw-k-arch`, `ycw-c-arch`, `ycw-fx-petals`, `ycw-fx-glints`, `ycw-k-passport`, `ycw-k-seal`, `ycw-k-chest`, `ycw-k-cup`, icons `ycw-ic-bank`, `-trophy`, `-passport`, `-kodesh`, `-week`, `-skills`, `-lessons`, `-arena`. **Use these names now.** Until a picture is in `SHK.ART`, the kit shows the world's sky and mountains instead, so nothing breaks. Workstream 0 adds each picture to `art/` and `SHK.ART` when it arrives.
- Need a picture nobody ordered? Open a `SHELL-KIT: picture <name>` issue with the screen, size and exact prompt (same style block as YCB-4); workstream 0 orders it. Never add art without a catalog row.
- `SHK.has(name)`, `SHK.img(name, cls)`, `SHK.pic(name)` (a sliced scene), `SHK.scene(name, world)`.

## The kit (`src/ShellKit.html`, `window.SHK`)
| Call | What it does |
|---|---|
| `SHK.place(def)` / `SHK.places(world)` / `SHK.tile(id)` / `SHK.go(id)` | register a place; list the ones he may see; its tile; fly there and open it |
| `SHK.page({id, world, scene, title, icon, body, back, onBack, onClose, right})` | a full page over the scene, the house top left (Back before it when `back`) |
| `SHK.pop({id, world, title, icon, body, onClose})` | a pop-up with one round x top right; outside tap and Escape close it |
| `SHK.body(id, html)` | replace a page's or pop-up's content (redraw after a server answer) |
| `SHK.close(id)` / `SHK.closeAll()` | close it (the house flies home) |
| `SHK.fly(world, open)` | the flight (about 2 s, tap skips, reduce motion fades); opens the place at once under it |
| `SHK.openLesson(skillId)` | the seam: opens a lesson exactly as the map's Play does |
| `SHK.call(fn, ...args)` | a server call with his token (a Promise) |
| `SHK.on()`, `SHK.grade()`, `SHK.young()`, `SHK.money()`, `SHK.esc(text)` | is the shell for him; his grade; K–3; his money as the server last sent it; safe text |

## Seeing it as a boy (before you say "done")
- `node tools/screens/shell.js /tmp/shots after 5 bank,store` (grade 5) and again with grade `3`: pictures at 1366×768 and 390×844 with the world pictures, plus the house/x overlap check and any button that is not from the kit. Add `SETUP='A.st.balance=42.5'` (or made-up server answers) so the screens are not empty. LOOK at every picture; put them in `docs/screens/shell/<id>/` and in the pull request. Report what the boy sees.
- Do not run screenshots and `node tests/run.js` at the same time.

## Pull requests
- Branch `esti/shell-<your place or workstream>`, one pull request per workstream (or one per place if that is faster), titled `New shell <A–E>: <places>`. Merge `main` into your branch before opening (other builders push often).
- `PAGES=1 node tests/run.js` must pass (about 50 minutes; give it a 2-hour timeout; run it alone).
- A 1.0 pull request goes live by itself when the test check passes. **Your place reaches boys only when the new home shows its tile**, so going live early is safe; until then it is reachable only by `SHK.go(id)`.
- In the pull request: your ticked checklist rows, the pictures (both sizes, grade 3 and grade 5), what the boy sees, the test timings, and anything you found broken today. End with the attribution line from your session.
- After it is live: tell Esti in one plain line what went live.
