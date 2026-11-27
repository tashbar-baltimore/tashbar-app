# Shell overhaul (1.0 boys' app): the feature checklist

**Asked for (2026-11-27, Esti with the Head of School):** "Delete all the old layers and build a new, simple, quick, upgraded one. The code can be upgraded too; the features and functions must remain. Cleaner and calmer, but very exciting and inspiring, with incredible pictures, immersive 3D-like pictures and movement." Esti chose "Shell only".

**One line to check every piece against:** every feature a boy has today still works, inside one clean new shell that looks and moves like the Mountain Kingdom (work) and the Golden City in the Clouds (free time).

Binding: `CLAUDE.md`, `CONTRIBUTING.md`, `docs/BUTTON-SYSTEM.md`, `docs/WORLD.md`, `docs/CLASSES-BUCKET.md`, `docs/SHELL-AND-LESSONS.md` (the seam with the lesson overhaul), `art/README.md`. Pictures: orders YCB-1 to YCB-4 in `docs/classes-bucket/PICTURE-ORDERS.md`.

## How this list is used
- **Nothing old is deleted until its row is ticked.** A row is ticked `[x]` only when the new shell does it **and** it was played as a made-up TEST boy at 1366×768 and phone size, with the picture in the pull request.
- Rows marked **(dead)** have no way in today; the new shell may drop them, saying so in the pull request.
- Rows marked **(gap)** are broken or unreachable today; the new shell fixes them.
- Test intent never weakens: when a test's selector changes, the new test guarantees the same thing (listed in Part C).

## Scope
- **Rebuilt and then deleted:** his home/hub (QuestPage `vHub` wrappers, HomePlus, HomeLift, HomeLayout, HomeFocus, WelcomeJoy, GameMap), the floating buttons, menus, pop-ups and places, the Your Classes & Bucket screens and the doors/lock in `src/ClassMode.html`, and the flights.
- **Untouched:** lessons and every lesson/question engine and pack (lesson side owns them, `docs/SHELL-AND-LESSONS.md`), the server and all money/progress logic (the server sets every amount), staff/teacher screens, and the K–1 games path (`tests/lib/k1home.js`).
- **The seam:** lessons open only through `startMission(world, skillId, 'skill')` (wrapped as `openLesson(id)`); the way out is the done screen's `data-act` `tohub` / `start` / `retry`. Changes to `src/UiKit.html` and `tests/run.js` are add-only; anything else on the seam needs a `SEAM:` issue first.

## The plan (each step is its own pull request)
Several Claude accounts build it at once (Esti, 2026-11-27): who owns which file and place, the kit (`src/ShellKit.html`) and the rules are in **`docs/SHELL-CONTRACT.md`**.

1. **New shell home and flights.** One new add-on (`src/Shell.html`, `window.SH`): the Great Terrace home (layered picture scene with gentle CSS drift), his place tiles (the kit's `tlk-tile` with the YCB-3 picture faces), the money pill and corner menu, a place registry (one row per place: world, scene, icon, how it opens, its door), and the flight engine (about 2 s, tap to skip, "reduce motion" fades). Places still open their existing screens. Grade 2+ only; K–1 keep their games.
2. **His places and pop-ups**, rebuilt one by one inside the new shell, each with its scene and every function from Part B.
3. **Your Classes & Bucket** moved into the new shell (Teacher Time Hall, Bucket Spring, worksheet screen, the airtight lock and doors), still passing `tests/lib/classesbucket.js`.
4. **Delete the old shell code** and move the tests that pointed at it to the new shell (same intent, never weaker).

## Things found while listing (to fix in the new shell, not to copy)
- (gap) **The home "Store" tile opens My money**, not the Store (`GameMap.html` ~612, `data-gmnav="money"`). The Store opens only from inside My money or My profile.
- (gap) **Talk to my Rebbe has no way in from the map home.** Its card lives on the hidden old home; GameMap only harvests `#hlx-mrow > .hlx-btn`. It is still reachable from a lesson's "Still stuck?" and from Kodesh Quest. Rebbe shout-outs, Torah Plus and Taryag/Torah Tracks cards may be cut off the same way.
- (risk) **GameMap is a skin over the hidden old home.** It re-clicks old-home buttons (`data-gmpx`, `firePx`) and re-runs old drawing to copy `.bank`, `.badgepanel`, `.journey`, `.p3week`. Several server calls (`sgMyDesk`, `msSchoolGoal`, `arMyStats`, `sbMySchool`, `libMyLibrary`, `klMe`, `kpMine`, `tdlToday`, `pfdToday`) run only because the hidden old home is drawn. The new shell must call each one itself before the old home goes.
- (risk) **Every subject panel reaches the boy only through the `tlFindLevelCard` string chain** (32 places add to it; ReadMore replaces the first one). The new shell must replace that chain with a real list, or keep calling it.
- (gap) **The Gate's door layer never shows**: `ycGate` uses `ycw-k-gate-doors`, which is missing from `YCW_ART`.
- (dead) `DOORS.store` lists `[data-gmnav="store"]`, which nothing produces; GameMap's `mine` (My Stuff) tab and the `#gm-nav` bar have no way in; the fallback `.tl-out` Sign out is always hidden.
- (gap) **Olam Haba can be opened by a teacher's door rule but has no tile**, so it never shows on the class screen.
- (gap) Hand-drawn buttons that break the button rule: the old live-class cards (`.tmc .go`, `.tml`), the Olam Haba sheet's "Keep going!", the Talk to my Rebbe form, the Arena's own buttons, the My Library tabs and spines.
- (test gaps) `classesbucket.js` "Start opens his class lesson" passes for any array (line 233 is overwritten at 241); its `#tlmenu` check ends in `|| true`; the uikit "kit loads first" check only compares against `#hp-css`; pictures under `/pics` are blocked in tests and the test map has grade null, so the world scenes are almost untested. Nothing opens and uses the Store, money page, Arena, Mistake Detective, My Library, Music, Talk to my Rebbe, Olam Haba sheet, Passport, Kodesh Quest, Taryag or Torah Plus. The new shell adds a test for each place it rebuilds.
- (rule) The K–1 quiet check counts class and style changes on `body` too: the new shell must not toggle body classes on a timer while a K–1 game is open.

---

# Part A · The home and its frame

Read-only research, 2026-11-27. Line numbers are approximate (files are edited often). "API" = server function reached by
`google.script.run.X` or QuestPage's `run('X', ...)` helper (QuestPage.html ~1801). "Test" quotes the selector the test really uses;
"none" means nothing in `node tests/run.js` checks it.

Legend for grade columns: **K1** = K1Only active (roster grade 0/1 from `klMe`, or a non-TEST boy whose map has every subject at Level <= 2, or `localStorage tl-k1only=1`).
**K-3** = `TLK.young(grade)` (UiKit.html: grade <= 3) → bigger house/back with words. **k2** = GameMap's `body.gm-k2` (every world on his map at Level <= 2).

---

### 0. How the boy page is assembled

| ✓ | Feature | What it does | File / line | API | Grade | Guarded by |
|---|---|---|---|---|---|---|
| [ ] | `sgQuest_()` page build | QuestPage.html + appended (before `</body>`) in this exact order: **UiKit, SignOutBar, OilTrail, JellyTrail, PathfinderCard, FireLinks, PathfinderGo, HomePage, SignInEnergy, Warp3D, KidReminders, CalmScreens** (LAST). Each in its own try/catch (missing file = silently skipped). Then theme+sound wrappers `tlSound_(tlTheme_(page,'boy'))`, title "Tashbar Learning · Middle School". | src/StaffGrid.js 24-44 | — | all | tests/lib/uikit.js: "the kit is loaded before every other part of the page" (checks `#tlk-css` comes first) |
| [ ] | Boot cover `html.tl-boot` | If CalmScreens is present (`__tlCalm` in bar), injects `<style id="tl-boot-css">` + script in `<head>` that hides everything on #0B0630 until CalmScreens lifts it; self-lifts after 4 s. | StaffGrid.js 37-39; CalmScreens.html ~22 `lift()` | — | all | none (indirect: run.js timing waits for keypad digits) |
| [ ] | Every other plain link → this one sign-in page | `sgRoute_` sends plain link / `?ms=1` / old `?pl=1` / old staff link to `sgQuest_()`; `?sg=1` staff, `?pp=1` parent, `?cp=1`, `?pf=1`, `?spark=1` elsewhere. Firebase: `src/ApiRoute.js:23` serves `sgQuest_().getContent()`. | StaffGrid.js 11-21; ApiRoute.js 23 | — | — | none |
| [ ] | Add-on list `msQuestToolsBody_()` | ~110 files joined, each in its own `try{(0,eval)(...)}catch(e){console.error(label)}`. Order (labels): CanteenKid, MathMore, ReadMore, ScienceMore(+2), ElectivesMore, FactsMore, TradesMore, ComputingMore, LifeMore, SocialMore, KodeshMore, SimchaMore, Shine, Helpers, Review, Adapt, Motivation, JokeJar, SimchaLife, TalkRebbe, KodeshQuestPage(+KodeshArt2), KinderKriyah, Guides, Pictures, Music(+EnergyMusic), HowToDo(+2,+3), FactsHowTo, AnswerGuard, **HomePlus**, StoreKid, Activities, KindsMore(+2,+3), **RebbePick**, OlamHaba, **TorahPlus**, **ChumashPage**, KriyahMore, **TorahTracks(+TaryagQuest)**, **ArenaPage**, ClassMode, **HomeLift**, LearnWays, **DailyPath**, **[BoyLibrary, HomeLayout, MasteryReview, WelcomeJoy, HomeFocus, LessonPop, LearnFlow, VoicePro, WorldThemeUI, KMathGamesUI, K1LettersUI, LblGateUI]** (one piece), KLessons, KReading, RealPics, ScreenFit, KKriyah, G1Math…G6Math, G3Reading, KLearn, KScience, KWriting, G1Science, G1Writing, G2Science, G2Writing, G3Science, G3Writing, KElectives, AlgebraAscent, **GameMap**, OneBiteData* (8), @core (CoreSkills.js `coreFiles_()`), OneBiteKit, OneBite, OneBiteMoney, MoneyShow, RealPicsTeach, BlockBuildersData, BlockBuildersUI, ChumashLabData, ChumashLab, **DailyPlanUI**, BigWork, **K1Only** (last). Pack files (packs/*.html, TL_PACKS) are read through `tlFileText_`. | src/Photos.js 202-294 | `msQuestTools`, `msQuestToolsGet(hash)` (old loader) | all | tests/lib/core.js:50-51 "the boy's page pieces (Speed.js) do not match msQuestToolsBody_ (Photos.js)" |
| [ ] | `TL_PART_FILES` must match | Same files, same order, grouped arrays = one piece; `@core` expands to `coreFiles_()`. `TL_PART_NOSEP` (ComputingMore…Adapt) joined without `\n;` so bytes match. `tlToolParts_()` throws "Speed.js TL_PART_FILES is missing X" if Photos.js names a file not listed → page falls back to old loader. Pack-only pieces hashed by TL_PACKS sha (`P…`), others MD5 (`M…`). | src/Speed.js 9-60 | `msQuestToolsParts(have)` | all | tests/lib/core.js:50 (byte-for-byte join == body) |
| [ ] | Loader v2 (`tlLoader2Src_`) | IndexedDB `tashbar-parts` cache of pieces; asks only missing hashes; deletes old `tashbar-tools` DB; offline → cached order; any failure → old loader. Pieces run in slices (~50 ms) with breaks; waits while boy scrolls/types (700 ms); never runs pieces while a K game window is open. | Speed.js 63-190 | `msQuestToolsParts` | all | run.js 120-122 (timing run: "lesson add-ons did not finish loading in 3 minutes", waits `window.TLT && BANK_ALL > 500`) |
| [ ] | Timers held during load | `setTimeout/setInterval` started by a piece are held until all pieces ran, then released (repeating ones wrapped by `quietly` = skip while `body.k1-home`, unless fn `__k1keep`). | Speed.js ~120-135 | — | K1 quiet | tests/lib/k1home.js: "the hidden big-boy home changed N times in 3 s behind a K game" (MutationObserver ≤15) |
| [ ] | "⏳ One moment…" tap hold `#tl-wait1` | A tap on the home before all pieces ran is swallowed, rushed, then replayed on the same element (matched by tag/id/dataset/text). Not on sign-in, `#k1o`, game windows. | Speed.js ~140-150 | — | all | none |
| [ ] | K-1 wait cover `#tl-k1wait` "🎮 Getting your games ready…" | While loading, if `tl-k1only`/`tl-k1g:<sid>` says K/1, a full-screen cover hides the big-boy home; first open asks grade once. | Speed.js ~92-108 | `klMe` | K1 | tests/lib/k1fast.js (PLAY within 8 s on a K-1 Chromebook, with `tl-k1fast`) |
| [ ] | K-1 FIRST ordering (switched OFF) | Only with `localStorage tl-k1fast=1` + `tl-k1dev=1`: K games + K1Only + OneBiteData run first; non-K1 boy → `location.reload()` with `tl-load-normal`. | Speed.js ~153-160 | — | K1 | tests/lib/k1fast.js |
| [ ] | `?diag=1` timing box `#tl-diag` | Hidden diagnostics overlay (piece timing, long tasks, PLAY taps, errors), kept per tab in sessionStorage `tl-diag`. | Speed.js 66-82 | — | — | none |

### 1. Boot, sign-in, welcome

| ✓ | Feature | Boy sees / does | File / line | API | Grade | Guarded by |
|---|---|---|---|---|---|---|
| [ ] | `boot()` | Loads roster names; "Can't reach the school. Check the Wi-Fi." + retry every 15 s; then loads add-ons. | QuestPage.html 2238-2242 | `msBootstrap`, then `msQuestTools` (`tlLoadTools`) | all | run.js FAKE stubs `msBootstrap` |
| [ ] | Keypad (`vSignin`) | 4 code dots, keys 0-9 `data-act="pin"`, ⌫ `data-act="del"`, Sign in `data-act="signin"`; keyboard digits/Backspace/Enter; 4th digit signs in (HomePage). Error "That code didn't work". Staff code → "Staff signed in" link. | QuestPage.html 1975-1993, 2176-2178, 2204, 2211 | — | all | tests/lib/warp3d.js: `.sg5keys button[data-act="pin"]` must be 0-9, `.sg5keys [data-act="del"]`, `[data-act="signin"]` |
| [ ] | Fast sign-in (HomePage overrides `pinGo`) | One trip: code check + state + class-mode answer + his map. Sets `SRV.token`, `TL_APP_URL`, `TL_PRE_TM`, **`window.TL_MAP`**, then `A.view='hub'; render(); welcome();` and `TLT.notes()` after 2.5 s. Parent → `?pp=1`; staff → `?sg=1` (sessionStorage `tl-session`). Failure → old `pinGo` (msSignInCode + msLoad). | src/HomePage.html 669-693; QuestPage.html 2212-2236 | `msSignInFast` (fallback `msSignInCode`, `msLoad`, `msAppUrl`) | all | tests/lib/kidmap.js (server: map rides with msSignInFast); run.js timing run |
| [ ] | HomePage sign-in look v3/v4/v5 (honey logo, chalkboard, Hebrew date, "thought", flying subjects) | Front page art; `brand()` replaced with logo (HomePlus also swaps `brand()` for `TL_LOGO`). | HomePage.html 1-668; HomePlus.html 264 | — | all | none |
| [ ] | SignInEnergy v6/v7 | Wraps `vSignin`: hype line (one per day), rocket launch while busy, night-sky stage, 🎵 HYPE button (EnergyMusic). Off: `TL_SIGNIN_V6=false`. | src/SignInEnergy.html 2-27, 93 | — | all | warp3d.js uses its `.sg5keys` |
| [ ] | Warp3D galaxy | Canvas `#w3d`, `body.w3d`/`w3d-si`: 3D keypad, hyperspace on sign-in, welcome burst. Only on sign-in (`si`/`warp`) and when a `.wjy`/`.gmw` welcome is open; OFF on hub pages, lessons, K1 (`body.k1-home`/`#k1o`). Off: `TL_W3D=false`. | src/Warp3D.html 2-36 | — | off for K1 | tests/lib/warp3d.js: on for keypad (`body.w3d-si`, `#w3d` visible, `pointer-events:none`), off in a lesson, off switch; run.js 202 "his map must be the bright page… `gm-lite` and not `w3d`" |
| [ ] | `welcome()` chain | Base QuestPage welcome (1897) → **WelcomeJoy** (bright sun, rainbow letters, confetti, fanfare, chips streak/up next/bank, "Let's go! 🚀" `data-act="closeov"` starts Happy Mix music; once per 90 s) → **GameMap welcome `.gmw`** (outermost, only when he has a map: "Welcome back, <first>!", streak + bank chips, YOUR NEXT LEVEL + ▶ PLAY `data-gmw="play"` (clicks `#gm .gm-goal .gm-play`), "1 ▶ Play / 2 🎯 3 missions / 3 💵 Earn", 🗺️ My map, 🌟 Some chizuk `data-act="sm-need"`, Today's vort from `TL_SIMCHA.vort`; marks `tlSimMorning:<sid>` so B'Simcha morning pop-up is skipped). | QuestPage 1897; WelcomeJoy.html 41-92; GameMap.html 1431-1458 | none (music saves prefs via `saveStudent` → `msSave`) | K1: suppressed by K1Only | tests/lib/k1home.js calls `welcome()` and requires nothing over `#k1o`; none for the welcome content |
| [ ] | Theme tune | 20 s Ma'oz Tzur rock/club intro on every new sign-in (`GM.tuneSid` poll 250 ms); loads `/sounds/theme.mp3` (art/sounds) or renders it in `OfflineAudioContext`; unlocks audio on first tap; holds background music until done; respects sound off; `TL_THEME_URL` override. | GameMap.html 1321-1430 | — (fetches `/sounds/theme.mp3` or live site) | all except PREVIEW | none |
| [ ] | TLT.notes() | Photo/write add-on notes 2.5 s after sign-in. | QuestPage 2223; Photos.js QUEST_TOOLS | — | all | none |

### 2. The frame (always-on pieces outside the hub)

| ✓ | Feature | Boy sees / does | File / line | API | Grade | Guarded by |
|---|---|---|---|---|---|---|
| [ ] | **Auto sign-out after 5 quiet minutes** | `IDLE=5*60000`; activity = pointerdown/keydown/touchstart/**wheel** (capture). `tick()` every 1 s → `doOut()` (hidden `data-act="signout"` button). | src/SignOutBar.html 4-25 | (save first, below) | all signed-in | run.js 101-104 dispatches a synthetic `wheel` every 30 s so tests are not signed out (no test that it fires) |
| [ ] | Sign out saves first | Capture listener on any `[data-act="signout"]`: `saveStudent(A.st)` before QuestPage's handler (which stashes pending evidence `svStash`, resets, `TashbarSound.signOut()`, clears A/SRV). | SignOutBar.html 8-9; QuestPage.html 2180 | `msSave` | all | none |
| [ ] | Fallback Sign out `.tl-out` | Top-right "Sign out" when no visible in-page signout button; **hidden by the corner menu CSS** (`.tl-out{display:none!important}`). Also hides any fixed "Placement" button on boy screens. | SignOutBar.html 11-24 | — | all | none |
| [ ] | Back arrow `.tl-back` | Round ← top-left on `play` and `result` views, label = "Map"/"Home" (`where()`); in a lesson with answers asks "Go back to the map? … won't be saved" (`.tl-bq`: Keep going / Go back) → `quit-yes`; on result → `tohub`. Hides the lesson's own `.phero [data-act="quit"]`. | SignOutBar.html 30-75 | — | all | none |
| [ ] | **Corner menu `#tlmenu`** | Three dots top-right (white on dark/gm pages, navy on light); opens leftwards: Sign out (word pill, `act('signout')`), ✉️ Message my rebbe (`data-tr="open"` → TalkRebbe), Sound toggle (`data-act="sound"`), Music pill [music panel `data-act="mubtn"` · play/pause (TashbarMusic) · next `munext`], ✕ close. Press-hold/hover labels, Esc/outside closes, "breathes" while music plays. Hidden when signed out. `makeRoom()` shifts any button lying under the dots. API `window.TL_MENU={open,close,actions,state}` (used by GameMap profile: Sound, Music, Sign out). | SignOutBar.html 78-268 | indirect (`crSend`/`crStaffList` via TalkRebbe) | all; hidden over K games (`body:has(#klov) #tlmenu`) and behind pop-ups (GameMap 1167) | tests/lib/classesbucket.js 243 only (`!!document.querySelector('#tlmenu')… \|\| true` — always passes) |
| [ ] | UiKit `window.TLK` | main/quiet/x/home/back/tool/pill/box/ask/tile helpers, `TLK.young(g)` (g≤3), `TLK.WORDS`, `TLK.X_SVG`. | src/UiKit.html | — | K-3 bigger home/back | tests/lib/uikit.js (`.tlk-main` gold, `.tlk-quiet` white, `.tlk-x/.tlk-home/.tlk-back` 44 px round, pills/boxes flat) |
| [ ] | PathfinderCard → **🎫 Level Check** | Hidden `.pf-card` stub kept for old add-ons; `window.pfCardInfo_` stub; `window.tlLevelCheckFor(id)` (from `TL_MAP.lc`); **wraps `window.startMission`** (at frame load, i.e. innermost-but-one): before the first lesson of a Math/Reading level whose check is waiting → `#pf-cf` dialog: "New level! Quick check first" (Start the check / "Not now (lessons here pay 25¢ of each $1)"), questions (choice or typed, Read it to me, How to do it), ✕ quits to map, result "LEVEL PASS … N of M right", skipped skills list; then refreshes `TL_MAP`. | src/PathfinderCard.html 10-68 | `pfLevelCheckStart`, `pfLevelCheckSave`, `kmMyMap` | Math/Reading levels with lc=1 | run.js 174-183 ("🎫 Level Check · then: …", `.gm-goal h1`, `.gm-goal .m`, `.gm-goal [data-gm=play]`, removes `#pf-cf`); tests/lib/levelpass.js (server) |
| [ ] | PathfinderGo | If sessionStorage `tl-pfgo` note (from Pathfinder day-1 page, <30 min) and boy on hub with no overlay → `startMission(n.c,n.id,'skill')` once. | src/PathfinderGo.html | — | TEST boys only in practice | none |
| [ ] | FireLinks | On web.app only: links/`window.open` to `?pp/cp/so/canteen/pf/check=1` get a one-time code and go to `/pages/<kind>/` (Firebase copy) with `&tlh=` and `&back=`. | src/FireLinks.html | `tlHandoff` | all | none |
| [ ] | KidReminders `#kpr` | "💌 A note from <home>" pop-up for parent reminders at their time; "Got it! 👍" acks. Polls at 6 s then every 60 s. | src/KidReminders.html | `kpMine`, `kpAck` | all (K1Only says reminders never show) | none |
| [ ] | CalmScreens | Lifts boot cover; pop-up fade plays once across redraws (getAnimations); calm chizuk line, no bobbing, Olam Haba cloud parked bottom corner, no clock on phones; pointer + yellow focus ring on all buttons; SOFT 3D rewrites hard ledge shadows sitewide (`TL_SOFT3D=false` off). Off `TL_CALM=false`. | src/CalmScreens.html | — | all | none |
| [ ] | OilTrail / JellyTrail | Chanukah olive-oil default trail through 3 Tevet 5787 (`window.tlOilOn`) and Sufganiyah jelly trail store item (`tlJellyOn`); HomePlus trail defers to them. | src/OilTrail.html, src/JellyTrail.html | — | all | tests/lib/oiltrail.js, tests/lib/jellytrail.js |
| [ ] | HomePlus FX (every boy) | `HP_FX=true`: big cursor, tap splash/swipe blade (`#hpblade` canvas), Store tap blasts (`tlTapStyle`), cha-ching + coins to bank when balance rises, honey jar `#hpjar` in lessons, SKY VAULT money show on right answers, weekly treasure chest pop-up (`hpchestov`) when `msSave` returns `chest.paid`. `window.tlSplash`. | src/HomePlus.html 284-580, 253-260 | `msSave` result `.chest` | all | tests/lib/storefx.js (store effects) |
| [ ] | Floating corner items (outside #gm) | `#pr-av` profile picture dot (home tab only, `data-gmnav="more"`; GameMap 703-707, 800 ms poll); `#bbx-door` "📘 Workbook" (BlockBuildersUI 579-584: home tab or Math map, Math Level 2-4 / TEST / `BB_LIVE`); `#clab-door` "📜 Chumash & Timeline Lab" (ChumashLab 918-922: home tab only, eligible); `#tlcash` money pill (StoreKid ~170; hidden on `gm-on`); `#tlclock` clock (Shine.html 95; moved above Olam Haba cloud by GameMap `clockClear` every 1.5 s); `#ohsky` Olam Haba cloud (OlamHaba.html 90, mini via HomeLift `ohmini`). All hidden when a pop-up/drawer/store/room is open (GameMap 1167) and over K games. | as listed | — | `#tlmenu/#ohsky/#tlclock` hidden with `#klov` | run.js 214 checks `#pr-av` text = picked avatar; tests/lib/blockbuilders.js, chumashlab.js (their doors) |

### 3. The old hub `vHub()` (still built every render, underneath #gm, as the DOM source for GameMap proxies)

`render()` (QuestPage 1960) → `vHub()` when `A.view==='hub'`. Base content (QuestPage 1994-2018):

| ✓ | Piece | Selector | Notes / API | Guarded by |
|---|---|---|---|---|
| [ ] | `tlAdvance(st)` | — | Opens the road after a boss win (`saveStudent`, toast "The road ahead is open!"). QuestPage 1766 | none |
| [ ] | Hero header: avatar, name, 🔥 streak, Skills mastered XP bar, `#wallet` "Tashbar Bank balance" `#bal`, 🔊 `data-act="sound"`, Sign out `data-act="signout"` | `header.top.hero`, `#wallet`, `#bal` | HomePlus moves `#wallet` and tools into `.hpbar`; HomePlus `bankTo` animates `#bal` | none |
| [ ] | `${tlFindLevelCard(A.st)}` | see §4 | chain of panels | see §4 |
| [ ] | Next up / Boss card | `.nextup` `data-act="start"` / `data-act="boss"` | from `suggestion(st)` (GameMap replaces `window.suggestion` with the map's next step, GameMap 1149-1153) | none |
| [ ] | `p3HubHTML(st)` (Motivation.html 67-78) | `.p3quest` Today's Quest (3 goals), `.p3week` "Look how far you've come" + `data-act="p3replay"` Play my week + `data-act="p3shab"` My Shabbos page | — | none |
| [ ] | Journey map | `.panel.journey` (`journeyHTML`, QuestPage 1949) | proxied by GameMap room "map" | none |
| [ ] | Four worlds MATH/READ/WRIT/VOC with nodes | `.world` `.node` `data-act="start|locked|boss"` | HomePlus picks VOC as tile `w-VOC` | none |
| [ ] | Badges | `.panel.badgepanel` (8 BADGES, QuestPage 1856ff) | proxied by GameMap room "badges" | none |
| [ ] | Tashbar Bank statement | `.panel.bank` (last 5 ledger rows, ribbis note) | proxied by GameMap room "bank" | none |

**vHub wrappers, in load order** (each `const _vHub=vHub; vHub=function(){…}`; later = outer):

| ✓ | Wrapper | Adds | File / line | API | Guarded by |
|---|---|---|---|---|---|
| [ ] | HomePlus (replaces) | `HP._vHub=vHub` (base). New `vHub` = `home(st)`: `.hp.hp2` with `.hpbar` (hello, streak, wallet + "+$x today", ✉️ `data-tr="open"`, sound/sign-out), `.hpmission` TODAY'S MISSION stepping stones (`steps()`: find math level, MATH/READ/WRIT next or boss, KQ game button `data-kk="land"`, Limudei Kodesh strand `data-lk="go"` or `data-hp="open" data-k="lkpanel"`, Science on even days / Social Studies odd), big "▶ Start my day", chest `.hpchest`, `.hpbonus` (p3quest/rvcard/sgoal/p3week), What's new `.hpnew` (21-day NEW tags), Pick an adventure `.hptiles` (GROUPS: Discover, Electives, Trades, Play & learn incl. Joke Book `data-hp="jokes"` and Find my levels `data-hp="levels"`, Heart & soul, "More"), My progress tabs `data-hp="tab"` (journey/badges/bank), drawer `.hpdraw` with a panel's full HTML (`HP.panels`). Live switch `HOME_PLUS_LIVE=true`. `data-hp="check"` → `tlOpenCheck(s)`; `levels` → Find my levels overlay (Math/Reading/Social Studies). Wraps `startMission` (closes drawer) and `saveStudent` (chest). | src/HomePlus.html 22-282 | via saveStudent `msSave` | none |
| [ ] | RebbePick | `section.rp` "💌 From my rebbe" after `</header>` (if `.hpbar`): ⭐ Star of the week, 🎯 goals with progress, shout-outs with "❤️ Thank you" (`data-rp="thanks"`), 📌 picks `data-rp="go"` (Start ▶ / Done! Again); big shout-out pop-up once with confetti; toast when a picked lesson is mastered. Sets **`window.TL_DESK`** (used by My work). Polls every 1.5 s, server at most every 3 min. | src/RebbePick.html 60-113 | `sgMyDesk`, `sgShoutSeen` | none |
| [ ] | TorahPlus | `section.tp` after header: Shabbos/Yom Tov greeting (Hebrew calendar), "Did you daven today?" Shacharis/Mincha/Maariv (st.dav, lights cloud), Parsha of the week (opens Chumash page `data-chmopen`), My Torah scroll. | src/TorahPlus.html 1-114 | — (state via msSave) | none |
| [ ] | ChumashPage | `.chm-card` after `</header>` (all 54 parshiyos). | src/ChumashPage.html 321-327 | `chmParsha` (when opened) | none |
| [ ] | TorahTracks | `.tt-card` (Torah Journey, `data-tj="go"`, `data-tj="pass"` passport) after `</header>`; second wrapper `.ms-me` My School banner (non-Baltimore families/pods). | src/TorahTracks.html 4133-4148 | `sbMySchool` (once) | none |
| [ ] | TaryagQuest | `.hptile.tq-tile` `data-tq="open"` "Taryag Quest · n of 613" inserted at the start of `.hptiles`. | src/TaryagQuest.html 86-88 | — | none |
| [ ] | ArenaPage | `.ar-card` `data-aropen="1"` "Chavrusa Showdown" (title, points, wins) after `</header>`; full duel app in `#ar-ov`. | src/ArenaPage.html 446-456 | `arMyStats` (1.5 s after first hub), `arOpen/arJoin/arAnswer/arPoll/arTeach/arCheer/arShake/arPower/arCf*`, `chJoin/chQs/chPoll/chAnswer` | tests/lib/classesbucket.js (door `data-aropen` blocked in class) |
| [ ] | HomeLift | `HL._vHub=vHub`; `lift(h)`: `.hlband` chizuk band (big line rotates every 7 s) + `.hlmq` marquee under `.hpbar`; moves What's new into `.hpbonus` (`.hlnewbox`); `body.hl-hub`; later passes: `.calmfeat` (arena/tt/chm cards), `details.calmmore` "✨ More: quests, my progress, badges and what's new"; Olam Haba mini cloud `body.ohmini` (`TL_OH_MINI`); bright Pathfinder gate CSS. | src/HomeLift.html 74-82, 222, 260-290 | — | none |
| [ ] | BoyLibrary | `.bl-card` "My Library" when server says on; `#bl-ov` bookshelf (gold = mastered, glowing = next, 📌 = assigned with due day; no level numbers); tap a book = `startMission`. | src/BoyLibrary.html 1-76 | `libMyLibrary` | tests/lib/classesbucket.js (door `data-bl-open` blocked) |

Render-level re-arrangers (wrap `render`, not `vHub`):

| ✓ | Layer | Does | File / line | Guarded by |
|---|---|---|---|---|
| [ ] | HomeLayout (`HOME_LAYOUT_LIVE=true`) | After each render (+0/60/360/800 ms) re-homes the `.hp2` DOM into `#hlx-top` (Start here `data-hlx="go"`, Today's steps box `#hlx-stepbox`), **`.hlx-lib` My Library** (`#hlx-lib`: stats `.hlx-stats`, search `#hlx-q`/`#hlx-res`, recents `.hlx-rec`, filter chips `data-hlxf`, groups `.hlx-grp` of `.hlx-card` with `.hlx-main`/`.hlx-nb` Next lesson/`.hlx-sb` All lessons shelf `#hlx-shelf`; 26 registered subjects SUB: KRI, LSH, CHU, RAS, MSH, GEM, HAL, TEF, YT, MID, PAR, NAV, CHEM, TRY, MATH, READ, WRIT, SCI, SS, FF, LIFE, COMP, ARTS, NUC, SPARK, VOC, SIM, HM), **`.hlx-games` `#hlx-grow`** (ar-card, Mistake Detective, Joke Book), **`.hlx-mine` `#hlx-mrow`** (Store `data-st="open"`, My bank/trophies/journey `data-hp="tab"`, Torah passport `data-tj="pass"`, Play my week, Shabbos page, Find my levels; strays + `details.calmmore`), `#hlx-hold` (hidden). `window.tlHomeArrange`. | src/HomeLayout.html 1-330 | none directly; GameMap libHTML depends on it |
| [ ] | HomeFocus | Three doors Learn/Play/My Stuff (`data-hf="lib|games|mine"`, `body.hf-*`), K game banners `.hf-kl` (KL/KR/KK `data-kl/kr/kk="open"`), bright pop-ups. | src/HomeFocus.html | run.js 219: "no old-style door page may open" — `hf-games`/`hf-lib`/`hf-mine` must stay off |
| [ ] | WorldThemeUI / LblGateUI (LEARN BY LEVEL, `TL_LBL_LIVE=true`) | Age world class on body (explorers K-1, adventurers 2-3, trailblazers 4-5, navigators 6-8); `TL_PLAN`; gate: nothing above level (`startMission` backstop shows "blocked"). | WorldThemeUI.html; LblGateUI.html 29 | `lblAskGrade`, `lblPlan` | none |

### 4. `tlFindLevelCard(st)` chain (panels injected into the old hub, then harvested by HomePlus as tiles/drawers)

Base (QuestPage 1770): "🧭 Find your math level" if no `st.place.MATH` (`tlFindLevel()` → overlay/in-app `tlOpenCheck('MATH')`, `msAppUrl`). Order below = load order; "prepend" = puts its card before earlier ones.

| ✓ | File | Adds (class / title / opener) | Shown when | API |
|---|---|---|---|---|
| [ ] | packs/ReadMore.html | **REPLACES the base (does not call it)**: Find your math level + 📖 Find your reading level (`tlFindReadLevel`, `?pl=1&check=1&s=READ`) | no `place.MATH` / `place.READ` | `msAppUrl` |
| [ ] | packs/ScienceMore.html | `sciPanel` → `.scipanel` Science (`data-sci="open"`, `#sci-ov`) | always | — |
| [ ] | packs/ElectivesMore.html (2 wraps) | `.elpanel` Journey Into the Atom; `.arpanel` Thinking & Arts (`data-elec`) | always | — |
| [ ] | packs/FactsMore.html | `.ffpanel` Fact Finders K-12 | always | — |
| [ ] | src/TradesMore.html | `.trpanel` Spark Path · Electricity (opens `?spark=1` in a frame) | always | `msAppUrl` |
| [ ] | packs/ComputingMore.html | `.cppanel` Computer Town | always | — |
| [ ] | packs/LifeMore.html | `.lfpanel` Life & Money | always | — |
| [ ] | packs/SocialMore.html | `.sspanel` Social Studies | always | — |
| [ ] | packs/KodeshMore.html | **prepend** `.lkpanel` Limudei Kodesh ladders (Kriyah, Chumash, Rashi, Mishnayos, Gemara; `data-lk="go"`) | `KODESH_LIVE` or TEST | — |
| [ ] | src/SimchaMore.html | `.simpanel` B'Simcha | `SIM_LIVE` / TEST | — |
| [ ] | src/Helpers.html | **prepend** `.sgoal` School goal for <month> (+ most improved first names) | server has a goal | `msSchoolGoal` (every 10 min); Helpers also `msReport` (Report a problem) |
| [ ] | src/Review.html (1) | **prepend** `.rvcard` 🔀 Daily Mix (`data-rvmix`) | due review skills | — |
| [ ] | src/Review.html (2) | `.mdcard` 🕵️ Mistake Detective (`data-mdopen`) | pool ≥ 3, not `TL_MD_OFF` | — |
| [ ] | src/SimchaLife.html | `.hmcard` 🌈 Hashem Moments (`data-hm="story"`) | hub & `SIM_LIVE!==false` | — |
| [ ] | src/TalkRebbe.html | `.trcard` ✉️ Talk to my Rebbe or Teacher (`data-tr="open"`) | hub | `crStaffList`, `crSend` |
| [ ] | src/KinderKriyah.html | `.kkcard` 🎮 Kodesh Quest (112 games) unless `.lkpanel` already present | hub & on & needs | — |
| [ ] | packs/KLessons.html | `.klcard` 🍎 Kindergarten Math (17) `data-kl="open"` → `#klov` | TEST or `K_LESSONS_LIVE` & grade 0-1 | `klMe` |
| [ ] | packs/KReading.html | Kindergarten Reading `#krov` | TEST or LIVE & grade 0-1 | `klMe` |
| [ ] | packs/KKriyah.html | Kriyah nekudos `#kkov` | grade 0-3 | `klMe` |
| [ ] | packs/G1Math, G1Reading, G1Science, G1Writing | 1st grade cards (`.g1mcard` …) | grade 1-2 | `klMe` |
| [ ] | packs/G2Math, G2Reading, G2Science, G2Writing | 2nd grade cards | grade 2-3 | `klMe` |
| [ ] | packs/G3Math, G3Reading, G3Science, G3Writing | 3rd grade cards (`.g3scard` 30 lessons…) | grade 3-4 | `klMe` |
| [ ] | packs/G4Math / G5Math / G6Math | grade 4-5 / 5-6 / 6-7 | `klMe` |
| [ ] | packs/KLearn.html | **prepend** `.klncard` 🌱 Practice Again / Keep Learning (`data-kln`) | `KLEARN.mine()` non-empty | — |
| [ ] | packs/KScience, KWriting | K science / writing cards | grade 0-1 | `klMe` |
| [ ] | packs/KElectives.html | Think, Talk, Sing and Draw | grade 0-4 | `klMe` |
| [ ] | packs/AlgebraAscent.html | `.algacard` ⛰️ Algebra Ascent (73 lessons) `data-alga="open"` | grade 7-8 | `klMe` |
| [ ] | src/K1Only.html (last) | wraps to return `''` when K1 is on | K1 | — |

Guarded by: nothing tests the chain itself. `#app [data-hp=levels]`/`[data-hp=check]` are scraped by GameMap noMap/profile.

### 5. GameMap `#gm` (the map home that covers everything above) — src/GameMap.html

Install: wraps `render` (1139-1144) → `sync()` after every render; shown only when `A.view==='hub'`, `A.st`, and not `body.tm-on` (ClassMode). `GM.sid` change (new sign-in) → `GM.tab='home'`. `body.gm-on` (overlay visible, page scroll locked), `gm-nav`, `gm-home`, `gm-lite` (always), `gm-k2`, `gm-lesson` (in a lesson with a map). Data: `window.TL_MAP` (kmMyMap) must have `sid===A.st.id`. Mastery merges local `A.st.skills` with server `x[2]`; `known` = level-check skipped (`lc.known`).

**GM.tab pages**

| ✓ | GM.tab | What the boy sees | Function / line | DOM it scrapes / proxies | API | Grade | Guarded by (run.js unless noted) |
|---|---|---|---|---|---|---|---|
| [ ] | `home` | "Good morning, <first>!" + dots + line ("N of 3 done today" / "All your work is done today!" / list "N of 6 done today"), quiet **Sign out** (`data-gm="pfout"`) + 💡 lightbulb (`data-gm="pftour"`), then **6 equal tiles** `.gm-hts > .gm-ht`: ✏️ My work (`.work.now` "Do this now", `data-gmnav="missions"`), 🗺️ My map (`data-gmnav="map"`, subject·Level pill), 🥪 Canteen (`data-cno="open"` → CanteenKid 3D room), 🛍️ Store (`data-gmnav="money"`, money pill), 🎮 Arcade (`data-gmnav="games"`, Locked pill until work done), My profile (avatar, `data-gmnav="more"`). No map: "Your map is almost ready." + `noMapHTML` and only 4 tiles. | `homeHTML` 600-616 | — | — | all (not K1: K1Only covers) | 189-191, 240: `.gm-hts > .gm-ht` n=6, equal size, `.top` 44-56 % height, first `.work.now` /DO THIS NOW/, `.gm-hts .gm-ht.food[data-cno=open]`, no `#gm-nav button`, only `.gm-hi .gm-out > .tlk-quiet[data-gm=pfout]` + `.tlk-tool[data-gm=pftour]`; tests/lib/dailyplan.js `.gm-hi p` "0 of 6 done today" |
| [ ] | 3D Canteen (from home tile) | `#cn-shop.cw3d` room with doors Buy food / Get money / My story / Lessons (`.cw-door[data-p=buy|cash|story|learn]`), LIFE money lessons `[data-cno=lesson][data-c=LIFE]`, Home `[data-cno=close]`. | src/CanteenKid.html | `cnKidInfo`, `cnOrderMenu`, `cnOrderPlace`, `cnOrderCancel` | all | 192-199, 241: doors `buy,cash,story,learn`, `.cw-room` pointer-events none, ≥5 money lessons, closes; tests/lib/canteen.js (server) |
| [ ] | `map` | HUD (`.gm-hud`: Back `data-gm="gmback"` if `GM.from`, kit house `data-gmnav="home"`, money **pill** `.gm-mny .tlk-money`), unit bar `.gm-unit` (world art + unit name, "N to the boss"/"Boss now!", "Change subject" `data-gmnav="subjects"` if >1 world), winding path `pathHTML` (≤12 cleared steps shown above, floating numbers, landscape SVG, deco statues, nodes `.gm-n` `.d/.u/.now/.boss/.kn/.lc` `data-gm="node"`, locked tap → `.gm-pop` "🔒 Locked", current card `.gm-l.now` with (i) `data-gm="info"` typewriter), goal card `.gm-goal` (Your next level / Today's pick, title, "🧠 You'll learn / Real skill", ▶ Play `data-gm="play"`, "Read it to me" `data-gm="say"` with progress ring). Level check waiting → `.gm-goal.gm-lcg` "🎫 Level Check". Unit cleared → "🏆 unit cleared!". First open each day: zoomed-out glide-in (`gm-zoom:<sid>:<date>` in localStorage). Skill tree view (`GM.view='tree'`, `treeHTML`: strands, SOON/locked/now/done/known; tap → `.gm-sheet` with Play/Replay). | `sync` 1026-1035, `pathHTML` 714, `goalHTML` 793, `lcGoalHTML` 789, `treeHTML` 770, `sheet` 781, `zoomIntro` 1041 | `TL_MAP` only | `kmMyMap` (after a mastered step, `refreshLater` 1055) | K-3: house+"Home" | 176-183 (level check), 201-209 (`gm-lite`, not `w3d`, `.gm-goal h1/.learn`, `.gm-n` count, one `.gm-n.boss`, one `.gm-hud .tlk-pill.tlk-money`, no `.gm-hud [data-gmnav=money], .gm-hud .gm-money`, flat `.tlk-pill/.tlk-box`, one `.tlk-home[data-gmnav=home]` top-left <220/<90 px, one `.gm-play`, no `[data-gm=world]` on map), 224 PLAY starts `km.map.subjects.MATH.now` and leaves `gm-on` |
| [ ] | `subjects` | "Change subject" shelves `.gm-shelf` `data-gm="world" data-k` (✓ All cleared / 🎫 Level check first / Level n · on your map now). Worlds: MATH, K:CHU, READ, K:GEM, K:MSH, K:RAS, K:KRI, LANG, HEB, SCI, SOC, LIFE, COMP, ELEC, VOC (only those with lessons at his level). | `subjectsHTML` 592 | — | — | — | 208-209: `[data-gmnav=subjects]`, `[data-gm=world][data-k="K:CHU"]`, locked Chumash `.gm-n.u` → `.gm-pop` /Locked/, Chumash goal |
| [ ] | `missions` (My work) | Marquee `.gm-marq` ("MY WORK TODAY"/"TODAY'S LIST", "N of 3 done"/"All done!"), rounds `.gm-rd` (won ✓ / `.live` "Your turn" / Next / "Ask your rebbe"), rebbe picks `.gm-rd.rebbe` "FROM <REBBE> · Picked for you" (max 2, from `TL_DESK`), BONUS ROUND `.gm-rd.final` (opens Arcade), 🎁 treasure chest `.gm-chest`, CTA `.gm-cta .gm-play` "▶ Play round n"/"▶ Next"/"▶ Keep climbing". 3 rounds = school daily goal (server pays), or Today's list (§6). | `missionsHTML` 823, `plan` 815 | `window.TL_DESK` | via DailyPlanUI `tdlToday` | — | 221 (3 rounds, one `.gm-rd.live`), tests/lib/dailyplan.js `.gm-marq`, `.gm-rd`, `.gm-rd.live`, `.gm-cta .gm-play`, `.gm-rd.won`, no /minute\|timer/ |
| [ ] | `games` (Arcade) | Locked: `.gm-lock` "🔒 Arcade locked · Clear N more rounds" (or "Finish N more things on today's list") + teaser SHOWDOWN/DETECTIVE/JOKE BOOK + "▶ Go to my work". Open: "★ BONUS ROUND ★ The Arcade" tiles **proxied from `#hlx-grow`/`.hlx-games`** (ar-card big, Mistake Detective, Joke Book; locked if `disabled`/`.pfdlocked`) + Kodesh Quest tile from `[data-k=lkpanel]`. | `arcadeHTML` 838, `arcadeOpenHTML` 933 | `#hlx-grow`, `.hlx-games`, `.hlx-mine [data-k=lkpanel]`, `#app [data-hp=open][data-k=lkpanel]` | — | — | 222 `.gm-lock` + still `gm-on`; dailyplan.js `.gm-lock` text |
| [ ] | `money` (Store tile) | My money box, +today/+this week pills, Payday (Thu/Fri), treasure chest, "What can I do with my money?" Spend/Save (Store goal progress)/Give/Canteen → `data-st="open" data-t="fun|real|give|canteen"`, My money story `.mm-story` (This week / Everything, `data-gm="mstory"`, running balance), "🎒 Things I bought" `data-t="mine"`. Display only (server ledger). | `moneyHTML` 896 | `TLSTORE.info` | `stInfo` (`storeInfo` 890) | — | none |
| [ ] | `more` (My profile) | `.pr-title` "My profile"; card `.pr-me`: avatar (16 pictures, `data-gm="pfav"` → `#pr-pick` `data-gm="pfavk"`, saved `st.av` + `localStorage arAv`), name, grade, boxes Days in a row/Badges/Lessons done, settings Sound (`pfsnd` → `TL_MENU.actions.setSound`), Music (`pfmus`), Sign out (`pfout` → `TL_MENU.actions.signOut`). Main: My levels `.pr-lv` per world + "Find my levels" (proxy `#app [data-hp=levels]`), How the buttons work card (`pftour`), Recently finished (map `growth.week`), My badges `.pr-b` (8) + rank, My bank (Balance, Latest money in, "Open my bank" → room bank), Recently bought (store orders, "See all" `pfshop`), My stuff shelves (trails/taps/colors/bonus/home/other, "In use"), More doors `.pr-tile`: Tashbar Store (proxy), every `#hlx-mrow > .hlx-btn` (journey map/passport/play my week/Shabbos page… as proxies or rooms), 📚 All my lessons `data-gm="lib"`, 🌳 Skill tree `data-gm="treeview"` (not k2), 📈 My week `data-gmnav="me"` (not k2). | `moreHTML` 630-687, `pfClick` 691-701, `pfPick` 689 | `#app [data-hp=levels]`, `.hlx-mine #hlx-mrow > .hlx-btn` | `stInfo` | k2 hides Skill tree and My week | 210-217, 247-253: `.pr-title`, `.pr-lv` = subjects, 8 `.pr-b`, `.tlk-quiet[data-gm=pfout]`, `.pr-tile[data-gm=lib]`, ≥6 `.pr-tile`, `[data-gm=pfav]` → 16 `#pr-pick [data-gm=pfavk]`, `.pr-bav`, `#pr-av`, `.gm-ht.things b` = "My profile"; Back `.tlk-back[data-gm=gmback]` from All my lessons returns to `more`; none on profile |
| [ ] | `me` (My week / trophies) | Rank medal (Bronze→Legend by steps), XP (100/step) pills, rank ladder, cheer vs last week, boxes This week/Last week/Days in a row/Bosses beaten, WHAT I LEARNED THIS WEEK (8), MY BADGES. | `growthHTML` 848 | — | — | k2 → redirected to `map` | none |
| [ ] | `lib` (All my lessons) | "My Library" header with `.hlx-stats`, search `#gm-q` (redraw 250 ms), filter chips `data-gm="lf"` (All/Kodesh/General/Heart & Soul/Started/New/Done), 🔁 review strip (proxy `#mr-card [data-mr]`, MasteryReview), "Pick up where you left off" (proxies `.hlx-rec`, `.bl-card` bookshelf), every group/card **proxied from `.hlx-lib .hlx-grp .hlx-card`** (`.hlx-main`, `.hlx-nb`, `.hlx-sb`) + extra group buttons. "Loading…" until HomeLayout built it. | `libHTML` 940 | `.hlx-lib`, `.hlx-stats span`, `#mr-card`, `.hlx-rec`, `.bl-card`, `.hlx-grp`, `.hlx-card`, `.bar i` | — | — | 218 `[data-gm=lib]` → `GM.tab==='lib'` & `gm-on`; 232 |
| [ ] | `mine` (My Stuff) | Proxied tiles from `.hlx-mine #hlx-mrow > .hlx-btn`, My Library, Daily Mix strip `[data-rvmix]`, Today's Quest `.p3quest`, school goal `.sgoal`, What's new from `.calmin`. **No button reaches it any more** (only `data-gm="stuff"`, which nothing renders). | `stuffHTML` 961 | `.hlx-mine`, `#lg-libbtn`, `.rvcard`, `.p3quest`, `.sgoal`, `.calmin [data-hp=open]` | — | — | none (dead page) |
| [ ] | `nomap` (derived) | "🗺️ Your map is almost ready!" + 🧭 Find my levels (proxy) + 📚 All my lessons. Never the old home. | `noMapHTML` 980 | `#app [data-hp=levels]`, `[data-hp=check]` | — | — | 225, 235 `#gm .gm-none` |
| [ ] | Rooms `#gm-room` (bank / badges / map / week) | Dialog with ✕ (`data-gm="roomx"`) showing **outerHTML of `.bank`, `.badgepanel`, `.journey`, `.p3week` taken from `HP._vHub()`** (base vHub, re-run on demand), relabeled with kit pills; "Play my week" replays in the room (`p3replay`). | `room` 973-979, `firePx` 926 | `.bank`, `.badgepanel`, `.journey`, `.p3week` | — | — | none |
| [ ] | `#gm-nav` bottom bar | Now empty (`navHTML` returns ''); `navHTMLOld` kept. | 803-807 | — | — | — | 191 / 207: no `#gm-nav button` |

**Other GameMap features**

| ✓ | Feature | Detail | Line | API | Guarded by |
|---|---|---|---|---|---|
| [ ] | Proxy mechanism `data-gmpx` | `px(el)` stores the old button; capture click → `firePx` (re-find by signature in `#app`, disabled → toast "🔒 Not yet!", `data-hp="tab"` → room, else `el.click()`). | 924-932, 1121 | — | indirect |
| [ ] | `play(id)` = how the map opens a lesson | Stops read-aloud; if a K game pack (KL/KR/KK) has the id and is on, and no One Bite for it is live → `K.open(id)`; else if `BANK_ALL[id]`/`GEN[id]` → `startMission(worldFor(id), id, 'skill')`; else falls back to `lib` tab. | 1061-1068 | — | 224, 177 |
| [ ] | Win moments | On return to hub with a newly mastered step (<15 min): celebration `#gm-cel` "Level clear!/Rank up!/Boss beaten!" with loot (real skill, new rank, +100 XP, unit finished, unlocked, boss distance, "💵 You earned +$x" read from ledger, watched 5 s) and "▶ Next level"/"🗺️ Map". | 862-880, 1002-1006 | — | none |
| [ ] | Daily party | When rounds/list reach total once per day (`gm-day-<sid>-<date>` localStorage): "Challenge complete!"/"All done today!" with loot, 🎮 Arcade / 🗺️ Map. List waits for server `complete`. | 991-1000 | — | none |
| [ ] | `window.suggestion` override | Welcome/end-screen "Next mission" = map's next step. | 1149-1153 | — | none |
| [ ] | `GM.nextLevel()` | Used by WelcomeJoy chip. | 1154 | — | none |
| [ ] | Drawer lift | HomePlus `.hpdraw` moved to body when `gm-nav`. | 1007 | — | none |
| [ ] | pf-card watcher | MutationObserver on `.pf-card` style → `sync()`. | 1155 | — | none |
| [ ] | Pop-up restyle | Every `.overlay`/`.ocard` on gm pages gets the dark-purple game look; `#mutoast` hidden; floating items hidden behind pop-ups. | 1159-1200 | — | none |
| [ ] | Button tour `TLTOUR` | Ring + bubble on the real home; K-3: 6 cards read aloud automatically; 4+: 12 cards + "Read it to me"; opened by 💡 or profile card. | 1462-1531 | — | none |
| [ ] | Lightbulb hint `#tl-tourhint` | First 10 sign-ins per boy per device (`tl-tourhint-<sid>`), not K-1, polled every 2.5 s. | 1534-1551 | — | none |
| [ ] | `.hf-back` capture | A HomeFocus "Back home" while gm-nav → `GM.tab='home'`. | 1138 | — | none |

### 6. Today's work feeds

| ✓ | Feature | Detail | File / line | API | Grade | Guarded by |
|---|---|---|---|---|---|---|
| [ ] | DailyPlanUI (TODAY'S LIST) | `window.tlDailyPlan(ws)` → rows per list line (READ, LANG, MATH, KODESH, KNOW), j-th open row = j-th next step, local mastery counts at once, `open` only when server says `complete`. Re-asks after `loadStudent` and every `saveStudent`; relabels payout "Daily bonus · You finished today's list". | src/DailyPlanUI.html | `tdlToday` | Grade 2+ (server; K-1 null → 3 rounds) | tests/lib/dailyplan.js server() + page() (see §5 missions) |
| [ ] | DailyPath (Pathfinder daily path) | `window.tlPfdPlan` replaces HomePlus mission steps (Kodesh, Math, Reading, Writing, Sci/SS, 🚀 booster, "about N min"); `window.tlPfdLock` disables adventure tiles (`.pfdlocked`) until path done; climb moments. Feeds HomePlus (old home), not GameMap. | src/DailyPath.html 20-96 | `pfdToday` | TEST boys with a profile (`PFD_LIVE=false`) | none |
| [ ] | 3-round default plan | `plan(ws)` in GameMap: 3 rounds = 3 mastered today; today's pick rotates subjects. | GameMap 815-820 | — | non-list boys (K-1) | run.js 221/236 |

### 7. Opening lessons and coming back

| ✓ | Feature | Detail | File / line | Guarded by |
|---|---|---|---|---|
| [ ] | `startMission(c,id,kind)` base | Builds items (`buildBoss`/`buildRetry`/`buildMission`), `A.play`, adds world to `st.worlds`, `A.view='play'`, `phaseIntro()` overlay (Practice / On your own / Boss). | QuestPage.html 2023-2041 | run.js 159 (plays sampled lessons) |
| [ ] | startMission wrapper chain (load order, inner→outer) | PathfinderCard (frame, level check) → Adapt (⚡ Fast track offer after 2 perfect masteries in a subject: check questions first) → HomePlus (close drawer) → StoreKid (`T.lesson` timer) → Activities (warm-up **only when kind omitted** — every home path passes `'skill'`) → ClassMode (only the class lesson during class) → TorahTracks (Chemdas song first) → MasteryReview (cumulative review) → LblGateUI (blocks above-level) → OneBite (takes over when `OB_LIVE` / bite exists) → CoreUnits (@core, unit order). | Adapt.html 16; HomePlus 281; StoreKid 194; Activities 131; ClassMode 273; TorahTracks 3911; MasteryReview 42; LblGateUI 29; OneBite 173; CoreUnits 217; PathfinderCard 55 | tests/lib/onebite.js, classesbucket.js (blocked start), levelpass.js |
| [ ] | Home entry points that start lessons | `data-act="start"` (+`data-c`,`data-id`) and `data-act="boss"` (QuestPage 2183-2185), `data-gm="play"` (GameMap), `data-lk="go"` (Kodesh), `data-rp="go"` (RebbePick `start`), `data-kln`, `data-kl/kr/kk/g1m/…="open"` (game packs), `data-rvmix`, `data-mdopen`, bookshelf (BoyLibrary), `.hlx-nb`/`.hlx-book` (HomeLayout `playDs`: act/lk/ss/fact/life/comp/arts/elec), `data-tq="open"`, `data-tj="go"`, PathfinderGo note. | various | partial |
| [ ] | `data-act="tohub"` landing | QuestPage 2186: `A.drop=A.res.dropKey; A.view='hub'; A.overlay=null; render(); scrollTo(0,0)`. GameMap then shows **the same GM.tab he left from** (map/missions/home; `GM.tab` is not reset), clears `GM.world` and re-fetches the map if steps went up, then win moment / daily party. Buttons: result screen "See my map"/"Back to map" (QuestPage 2130-2136), One Bite end "Back to my map"/"My map" (OneBite.html 157-170), Back arrow on result (SignOutBar `leave`). `quit-yes` (2188) does the same without `A.drop`. | QuestPage 2186-2188; GameMap 1139-1144 | none specific |
| [ ] | ClassMode lock (Your Classes & Bucket) | During a class period `body.tm-on`: #gm hidden, `.ycw` class world, only class lessons, every door (`data-cno`, `data-st`, `data-aropen`, `data-mdopen`, `data-bl-open`, `data-tj`, `data-act=mubtn`, `data-tr`, `data-gmnav=*`, `data-hp`) swallowed unless the teacher opened it. | src/ClassMode.html 37-488 | `tmMine`, `ycSheetOpen/Img/Save` | tests/lib/classesbucket.js page() |

### 8. K-1 games-only path (K1Only)

| ✓ | Feature | Detail | File / line | API | Guarded by |
|---|---|---|---|---|---|
| [ ] | Who | roster grade 0/1 (`klMe`, cached `tl-k1g:<sid>`), or non-TEST map all Level ≤2, or `?k1=1` / `tl-k1only=1`; `?k1=0` off. | K1Only.html 18-34 | `klMe` | tests/lib/k1home.js |
| [ ] | Home = `#k1o` full-screen game path, `body.k1-home` | One grade's real games in skill order (K: KL/KR/KK Level 1; G1: G1M/G1R/KK Level 2), game 1 open, next unlocks at score ≥2, giant PLAY `.k1-play`, tiles `.k1-t(.lock)`; no map/tabs/store/money/menus; no pop-ups (welcome, vort, reminders, payday, joke jar, level checks, find-your-level); `tlFindLevelCard` → ''. Game window `#klov/#krov/#kkov/#kkov2/#g1mov/#g1rov` with `k1fit` styles, `k1say` voice bridge, `.k1-wait` cover. | K1Only.html 36-226 | — | tests/lib/k1home.js: `#k1o`, `body.k1-home`, `elementFromPoint` centre/top-right/bottom-left inside `#k1o`, `.k1-t` = `KL.list()` L01 order, `.k1-t.lock` = n-1, no "bite", `.k1-play` → game overlay with `iframe.srcdoc` containing `id="k1fit"` and `k1say`, `.k1-wait` leaves ≤15 s, ≤15 mutations/3 s, passing game 1 opens game 2 (st.klm/klr/klk), grade 1 → only `.L02.` |

### 9. Test coverage summary for this slice

| ✓ | Test | What it pins (selectors) |
|---|---|---|
| [ ] | tests/run.js 120-127 timing run | keypad digits visible, add-ons loaded (`TLT`, `BANK_ALL>500`), hub text >200 chars, counts `serverCallsToKidHome`, saves `tests/out/kid-home-phone.png` (390 px) — no visual assertion |
| [ ] | tests/run.js 170-254 map home | §5 table (home tiles, canteen, map, PLAY, subjects, missions, arcade, profile, back, lib, no old doors, noMap) |
| [ ] | tests/lib/dailyplan.js page() | My work list rows, Arcade lock text |
| [ ] | tests/lib/k1home.js | §8 |
| [ ] | tests/lib/k1fast.js | K-1 first loader (with manual switch) |
| [ ] | tests/lib/warp3d.js | 3D on keypad only, off in lessons and with `TL_W3D=false` |
| [ ] | tests/lib/uikit.js | kit look + loaded first |
| [ ] | tests/lib/core.js:50 | Photos.js body == Speed.js pieces |
| [ ] | tests/lib/kidmap.js, levelpass.js (server) | `kmMyMap` via `msSignInFast`, level checks |
| [ ] | tests/lib/classesbucket.js page() | class lock and door blocking (`.ycw`, door attributes above) |
| [ ] | Not tested at all | 5-minute auto sign-out, corner menu, back arrow, sign-out save, welcome/gmw content, theme tune, money page, rooms, My week, win moments, daily party, button tour/hint, reminders, RebbePick, TorahPlus, BoyLibrary, HomeLayout/HomeFocus internals, tlFindLevelCard chain, FireLinks, PathfinderGo, DailyPath, Workbook/Lab doors visibility rules, `#tl-wait1` tap replay |

### 10. Risks and surprises (for the rebuild)

1. **GameMap is a skin over a hidden old home.** The whole HomePlus → HomeLift → HomeLayout → HomeFocus stack is still rendered on every `render()` (HomeLayout re-arranges 5 times per render: 0/60/360/800 ms) underneath `#gm`, only so GameMap can scrape `.hlx-lib`, `.hlx-games/#hlx-grow`, `.hlx-mine/#hlx-mrow`, `#mr-card`, `.bl-card`, `[data-hp=levels]`, `[data-k=lkpanel]` and re-click them (`data-gmpx` proxies matched by text/dataset signature). Rooms re-run the base `HP._vHub()` to get `.bank/.badgepanel/.journey/.p3week`. Removing any of those layers silently empties All my lessons, the Arcade, Find my levels and profile doors ("Loading…").
2. **ReadMore replaces the `tlFindLevelCard` base without chaining**, so the base QuestPage card is dead; every subject panel (Science, Electives, Facts, Trades, Computing, Life, Social, Kodesh, B'Simcha, Hashem Moments, Talk to Rebbe, Kodesh Quest, all K/G packs, Algebra) only reaches the boy through this string chain → HomePlus `panels` → HomeLayout cards → GameMap `lib` proxies. Three wrappers prepend (KodeshMore, Helpers, Review, KLearn).
3. **Server calls hidden in the hub chain** (not visible from GameMap): `sgMyDesk` (≤ every 3 min, sets `TL_DESK` for My work), `msSchoolGoal` (10 min), `arMyStats`, `sbMySchool`, `libMyLibrary`, `klMe` (many packs each call it per boy), `tdlToday` (after every save), `pfdToday`, `kpMine` (every 60 s), `stInfo`, `kmMyMap` (after mastery), `tmMine`.
4. The `mine` tab (My Stuff) and `data-gm="stuff"`/`data-gmnav="store"` paths are dead code; `#gm-nav` is empty; `.tl-out` is permanently hidden by the corner-menu CSS; PathfinderCard no longer calls `pfHello` (only a comment mentions it).
5. The **5-minute auto sign-out** counts `wheel` as activity and is untested (tests deliberately suppress it). Sign-out saves via a capture listener; any new sign-out button must carry `data-act="signout"` to keep the save.
6. **Activities' warm-up items never run from the home**: its wrapper only acts when `kind` is omitted, but `data-act="start"` and GameMap `play()` both pass `'skill'`.
7. PathfinderCard wraps `startMission` at frame-load time (before the add-ons), so the level check sits inside every later wrapper; One Bite / LblGate / ClassMode decisions happen before it runs.
8. Loader behaviour (held timers, K-1 quiet, tap replay, IndexedDB pieces, `?diag=1`) is part of the shell contract; K-1 FIRST ordering is switched off but still tested (k1fast with manual flags).
9. Welcome is three nested layers (base → WelcomeJoy → GameMap `.gmw`), each with its own once-per-90-s guard; Warp3D draws the galaxy only while `.wjy`/`.gmw` is open.
10. Grade logic is scattered: `TLK.young` (≤3), GameMap `gm-k2` (all levels ≤2: hides Skill tree/My week), K1Only (roster 0/1 or map ≤2 for non-TEST), tour hint off for grade ≤1, every K/G pack's own `on()` grade window plus `*_LIVE` flags, DailyPlanUI list from Grade 2 (server), WorldThemeUI age worlds.

---

# Part B · His places and pop-ups

Read-only inventory, built from the code on 2026-11-27. "L" = approximate line in the file. Every money amount is set by the server: the page only shows `A.st.balance` / `A.st.ledger`, which `msSave` (src/MiddleSchool.js L184) recomputes (`msCheckPay_`) and sends back, or the amounts `stInfo`, `stBuy`, `cnOrderMenu` and `cnOrderPlace` return.

### 0. Cross-cutting rules that every place must keep

| [ ] | Rule | Where | Test |
|---|---|---|---|
| [ ] | **Door list (canonical):** `window.TL_DOORS` lists every boy place with its tap selectors and overlay: canteen `[data-cno]`/`#cn-shop`; store `[data-st],[data-gmnav="money"],[data-gmnav="store"],[data-gm="pfshop"],[data-gm="mstory"],.mm-c`/`#tlstore`; arena `[data-aropen],[data-ar]`/`#ar-ov`; games `[data-mdopen],[data-md],[data-kk],[data-hp="jokes"],[data-gmnav="games"]`/`#mdx,#kkov`; blockbuilders `#bbx-door`/`#bbx`; chumashlab `#clab-door`/`#clab`; library `[data-bl-open]`/`#bl-ov`; olamhaba `#ohsky,#ohb`/`.ohsheet`; torah `[data-tj],[data-tq],[data-chmopen],[data-csg]`/`.tt-ov,.tt-pv,#csg,.tq-ov,.tq-pv,#chm-ov`; music `[data-act="mubtn"],[data-act="munext"],[data-action=musicPanel/playPause/next]`; talk `[data-tr="open"],[data-item="message"],[data-ak="rebbe"]`; profile `[data-gmnav="more"],[data-gmnav="me"],#pr-av,[data-gm=pfav/pfavk/pfavx/room/pftour]`/`#gm-room,#pr-pick,#tl-tour` | src/ClassMode.html L291-304 | tests/lib/classesbucket.js `.page()` (L235-255): during a class lock, taps on `data-cno=open`, `data-st=open`, `data-aropen`, `data-mdopen`, `data-bl-open`, `data-tj=pass`, `data-act=mubtn`, `data-tr=open`, `data-gmnav=more/map/missions`, `data-hp=levels` must be stopped and none of `#cn-shop,#tlstore,#ar-ov,#mdx,#bl-ov` may show; `#ohsky` hidden; a teacher's rule can open only the Canteen (`.ycw [data-ycdoor="canteen"]`); a door taken away (`closed:['store']`) stays shut |
| [ ] | **Class lock:** while locked, only class work opens. The floating doors (Olam Haba cloud, Workbook, Chumash Lab, profile dot) are hidden. Sign out always works (`SAFE` list L306) | ClassMode.html L285-306 | same as above |
| [ ] | **K-1 games only:** a K or Grade 1 boy gets only the full-screen game path `#k1o`. No map, store, missions, money bar, menus or pop-ups (welcome, reminders, store payday, joke jar, find-your-level) | src/K1Only.html L1-20 | tests/lib/k1home.js (also checks `#kkov` and `#ohsky` stay off) |
| [ ] | **Money is the server's:** `pay()` (QuestPage L1524) writes a *request* row. `msSave` re-checks every row (`msCheckPay_`) and returns the true `balance`/`ledger`, which replace the page's copy (`svGo`, QuestPage ~L1840) | MiddleSchool.js L184-208 | run.js `__srvErr` (every server call must succeed); tests/lib/saveload.js |
| [ ] | **Button system:** every place uses `TLK.x/home/back/main/quiet/tool/pill/box` (fallback HTML if TLK is missing) | src/UiKit.html | tests/lib/uikit.js (checks the kit itself, not each place) |
| [ ] | **The hidden old home feeds the new one.** GameMap (`#gm`) shows "proxy" buttons (`data-gmpx`) that press buttons of the old home. HomeLayout builds that old home under the map: `#hlx-lib`, `#hlx-games`/`#hlx-grow`, `#hlx-mine`/`#hlx-mrow`. QuestPage `vHub()` builds `.bank`, `.badgepanel`, `.journey` and `.p3week` | GameMap L918-931 (`px`, `firePx`), L973 (`room`); HomeLayout.html L250-320 | run.js map-home block (`o.lib`, `o.oldDoor`, `o.locked`) |

### 1. Home tiles and the GameMap frame (src/GameMap.html)

| [ ] | Item | Opens with | What the boy sees / can do | Server | File / L | Test |
|---|---|---|---|---|---|---|
| [ ] | Home (6 equal tiles) | sign-in, `data-gmnav="home"` (kit house top left on every other page) | Greeting with his first name. Daily dots plus "N of M done today". Tiles: **My work** (DO THIS NOW, glowing), **My map**, **Canteen** (`data-cno="open"`), **Store** (`data-gmnav="money"`, shows "You have $x"), **Arcade** (locked until work done), **My profile** (his picture). A quiet "Sign out" (`data-gm=pfout`) and a 💡 tool (`data-gm=pftour`) | none (the map comes with sign-in, `msSignInFast .map`; `kmMyMap` refresh after mastery) | homeHTML L600-621; refreshLater L1055 | run.js map-home `o.home`: 6 tiles, first `.work.now` "DO THIS NOW", equal size, Canteen `.gm-ht.food[data-cno=open]`, no tab bar, one `.gm-out > .tlk-quiet[data-gm=pfout]`, one `.tlk-tool[data-gm=pftour]`, no other buttons |
| [ ] | HUD on every page | — | Back (`data-gm=gmback`, only on a page reached from My profile), house, money pill (information, not a button) | — | hud L584-587 | run.js `o.info` (`.gm-hud .tlk-pill.tlk-money`, no `[data-gmnav=money]` in HUD), `o.tabs`, `o.homeBtn`, `backOnLib/backTo` |
| [ ] | Profile dot | `#pr-av` (`data-gmnav=more`) next to Workbook, home only | His picture; opens My profile | — | pfDot L703-707 | run.js `o.prof.dot` |
| [ ] | Button tour | `data-gm=pftour` | `#tl-tour` cards with read-aloud, on the real home | — | L1474-1553 (`TLTOUR`) | run.js `H.bulb` (button exists only) |
| [ ] | Win moments | automatic after a mastery | `#gm-cel`: LEVEL CLEAR / BOSS BEATEN / RANK UP, loot list, "💵 You earned +$x" read from the ledger (`earnedFor`), Next level / Map | — | celebrate L983, winMoment L864, watchPay L863 | none |
| [ ] | Daily party | automatic when the list or rounds are done | "Challenge complete" / "All done today!", Arcade / Map | — (bonus paid by the server: `moneyDailyGoal_`) | checkDaily L997 | none |
| [ ] | No-map screen | boy with no map | "Your map is almost ready", Find my levels (proxy), All my lessons | — | noMapHTML L980 | run.js `o.noMap` (`#gm .gm-none`) |

### 2. Store (src/StoreKid.html, server src/Store.js)

| [ ] | Item | Opens with | What the boy sees / can do | Server | File / L | Test |
|---|---|---|---|---|---|---|
| [ ] | Open / close | any `[data-st="open"][data-t=tab]`; `window.tlStore(keepTab)`; GameMap `data-gm=pfshop` | `#tlstore.stov` dialog: header "🏪 Tashbar Store", My money box, Level-Pass quarter note when `pf<1` (`tlQuarterHTML`). Close `data-st=close` or Esc. The money badge hides while the Store is open | `stInfo(token)` → items, seasons, owned, orders(25), canteen{cash,rate,weekMax,weekUsed}, gift{dayMax,today}, friends, given, wall, stars, week, pf, openPrizes | openStore L240, draw L243, load L223 | classesbucket.js (`#tlstore` must NOT open in class); none opens it otherwise |
| [ ] | Tabs | `data-st=tab data-t=fun/real/canteen/give/mine/week` | The open tab shows as a "now" pill | — | TABS L239 | none |
| [ ] | Fun tab shelves | — | Holiday shop (seasonal; buyable only in its Hebrew-calendar window, owned forever), Tap blasts, Trails, App colors, Bonuses, Home upgrades. Each card: price pill, "Need $x more" bar, Buy it, Use it / Stop using it, Make it my goal / Not my goal, a live preview window for trails and blasts (`.stpv[data-pv]`, tap to play) | — | body L271, card L262, SHELVES L238, pvRun ~L410 | tests/lib/storefx.js: no two Fun items share a name, emoji, tap blast, trail or near-identical app colors (`window.TL_STORE_FX`) |
| [ ] | Buy flow | `data-st=buy` → confirm `.stconf` → `data-st=yes` / `no` | "Buy X? It costs $y. You will have $z left." Then a done card ("It's yours!", "Your prize is on its way!", "Canteen Cash added!", "Thank you for giving!", "Gift sent!"), flying money, register sound | `stBuy(token,itemId,{clientId,to,amount})`: checks, charges once by key `store:<sid>:<oid>`, returns `balance`, `ledger`, `order`, `cash` | buy L295-310; Store.js L211-249 | none |
| [ ] | Server rules for buying | — | already owned (wear/keep); season closed; at most 3 prizes waiting (`OPEN_PRIZES`); Canteen Card needs an account, at most $5 Canteen Cash a week (`CANTEEN_WEEK`), rate $200 → $1 (`CANTEEN_RATE`), refund if the canteen can't be reached; gift: whole dollars, at most $100 a day (`GIFT_DAY`), same test/real group; "You need $x more" | — | Store.js L11-19, L211-249 | none |
| [ ] | Real prizes tab | `data-t=real` | Note: staff hand it out, money back if not. Prize cards | `stBuy` (status waiting); staff `stStaffOrders/stStaffSet` | body L273 | none |
| [ ] | Canteen Cards tab | `data-t=canteen` | Explains Canteen Cash, "Go to the canteen" (`data-cno=open`), week limit left, card items | `stBuy` kind card → `stCanteenCredit_` | body L274 | none |
| [ ] | Give tab | `data-t=give` | Tzedakah total (school / mine), donate cards, **Send money to a friend**: search `#st-gq`, list `#st-gto`, amounts $1/5/10/20/50 (`data-st=amt`), Send (`data-st=sendgift`), **Builders' Wall** of names | `stBuy('gift')` | body L275-282 | none |
| [ ] | My stuff tab | `data-t=mine` | My upgrades, My orders (On its way / Got it / Money back), **Tashbar sky** of named stars | — | body L283-285 | none |
| [ ] | My week tab | `data-t=week` | Bar chart Sun-Fri, Earned this week, Best day, Spent and given, Treasure chest box, no-interest (ribbis) note | (`stInfo.week`) | body L286-289 | none |
| [ ] | Savings goal | `data-st=goal` | Goal kept in `st.store.goal`, saved with `saveStudent` | `msSave` | click L322 | none |
| [ ] | Wear / use | `data-st=wear` | `st.store.wear[slot]`: frame (gold/fire/rainbow), crown, title, home theme (space/ocean/gold), pet buddy, sound (duck/drum), coins, tap, trail, app color, bonuses | `msSave` | click L323; dress L337; colors ~L520 | jellytrail.js / oiltrail.js (trail slot) |
| [ ] | Effects in play | — | Pet pops on a right answer, quack/drum, fireworks every 3-combo (`bonus-combo`), confetti cannon button on the home (`data-st=cannon`, `bonus-cannon`) | — | p3Ans wrap L362; cannon L527 | none |
| [ ] | Money badge | always (not K-1, not sign-in) | `#tlcash` "MY MONEY $x" plus "+$x today" (from his ledger), "+$x on the way" during a lesson (estimate only). Information, not a button | — | pill L171-189 | run.js map-home: `body.gm-on #tlcash` hidden on the map |
| [ ] | Paycheck after a lesson | automatic on the result screen when new ledger rows arrive | `.strec` receipt: lines print, PAID stamp, "Put it in my bank" (`.strec-go`), money flies to the badge | (ledger from `msSave`) | receipt L204-221 | none |
| [ ] | Payday | Thursday or Friday, once a week, earned > 0 | Opens the Store on My week with a PAYDAY banner and money rain | — | weekly L228 | none |
| [ ] | Home goal bar | home (old layout) | `.stgoalbar` goal progress or "The Tashbar Store is open!" | — | goalBar L333 | none |
| [ ] | Store items: Olive oil trail (Chanukah default) | automatic 23 Nov 2026 to 3 Tevet 5787 for every signed-in boy unless he bought a trail | Olives on every tap (buttons too, never where he types or draws). The oil bends a snapshot of `#gm` | — | src/OilTrail.html L1-20 (`tlOilOn`, `tlOilTapOn`, `TL_OIL`) | tests/lib/oiltrail.js (in/out of season, no click caught, `data-no-oil`) |
| [ ] | Store items: Sufganiyah jelly trail (`hol-jelly`, $250) | worn in his trail slot | Jelly swipe plus donut splat on tap; a tap blast he wears wins the tap; real-engine preview in the store card (`TL_JELLY.preview`) | — | src/JellyTrail.html | tests/lib/jellytrail.js |
| [ ] | HomePlus HP_FX | `window.HP_FX=true` | Tap splash plus swipe trail (`tlSplash`, styled by `tlTapStyle`), honey jar coin counter `#hpjar` during play, Sky Vault money show on right answers, `tlChaChing` count-up when the balance rises, treasure chest open (`chestOpen` when `msSave` returns `chest.paid`) | (`msSave.chest`) | src/HomePlus.html L24, L257, L361-372, L463, L475, L489+ | indirect: oiltrail.js / jellytrail.js check the free streak steps aside |

### 3. Bank / My money

| [ ] | Item | Opens with | What the boy sees / can do | Server | File / L | Test |
|---|---|---|---|---|---|---|
| [ ] | My money page | home **Store** tile `data-gmnav="money"` (note: the Store tile opens this page, not the Store) | Balance box, +today, +this week, payday pill (Thu/Fri), treasure chest (`st.chest` days of need, Opened). "What can I do with my money?": **Spend** (`data-st=open fun`), **Save** (goal progress → store tab), **Give** (`give`), **Canteen** (`canteen`). **My money story** tabs This week / Everything (`data-gm=mstory data-v=week/all`): every row with the balance after it, step names made readable (`whyText`). **Things I bought** (`data-st=open mine`) | `stInfo` (asked once if the Store has not loaded it, `storeInfo` L890) | moneyHTML L896-917 | none (ClassMode lists `[data-gmnav="money"]`, `.mm-c` as Store doors) |
| [ ] | Old "My bank" room | My profile "Open my bank" `data-gm=room data-t=bank`; My stuff proxies | `#gm-room` window showing QuestPage `.bank`: "Tashbar Bank, Savings account ····123", Available balance, statement table (Date / Description / Amount / Balance, last 5 rows; "No deposits yet"), no-interest (ribbis) note | — | GameMap room L973; QuestPage L2017-2019 | none |
| [ ] | Deposit slip on the result screen | after a lesson | "Tashbar Bank · Deposit": payout lines (Skill mastered, First-try bonus, 3 skills this week, Badge: …, Daily goal / "Daily bonus · You finished today's list", Right answers), Total deposit, New balance; coins fly to the wallet with a count-up | `msSave` returns the true balance; `daily` | vResult QuestPage ~L2144; DailyPlanUI relabel L41 | none |
| [ ] | **$1,000 Club** badge | automatic when balance ≥ 1000 | Badge "🏦 $1,000 Club" (+$10.00 request), progress "$n of $1,000 · $x more to go!" | `msSave`/`msCheckPay_` | QuestPage L1791, L2112, badgeCard L2165 | none |
| [ ] | Ledger shown signs | — | A negative row shows as red "−$" on the old bank (StoreKid fixes `+-`) | — | StoreKid render wrap L355 | none |

### 4. Trophies / badges / growth

| [ ] | Item | Opens with | What the boy sees / can do | Server | File / L | Test |
|---|---|---|---|---|---|---|
| [ ] | "My week" growth page (old nav name: Trophies, tab `me`) | My profile tile "📈 My week" `data-gmnav="me"` (not for K-2: `gm-k2` sends `me` to `map`) | Rank medal (Bronze → Legend by steps mastered), XP = steps×100 (game points, never money), steps, "N to next rank", rank ladder, cheer (this week vs last week), boxes This week / Last week / Days in a row / Bosses beaten, WHAT I LEARNED THIS WEEK (8), MY BADGES grid | — | growthHTML L848-861; RANKS L33 | none |
| [ ] | Badges (8) | My profile section; old room `data-t=badges` | `BADGES` from QuestPage: Perfect Lesson, 3 Skills in One Week, Never Quit, Published Writer, All 4 Subjects, $1,000 Club, Rose to the Challenge, Master Builder: tier, reward pill, progress, cheer when earned | (earned in `st.badges`; paid through `msSave`) | QuestPage L1785-1794, badgeCard L2163; GameMap moreHTML `bdg` | run.js `P.badges === 8` (`.pr-b`) |
| [ ] | Arena trophies | Arena home | wins, taught, handshakes, lightning, subject champion | `arMyStats` | ArenaPage `trophies()` L35 | none |

### 5. My profile (GameMap `more` tab) and its sub-pages

| [ ] | Item | Opens with | What the boy sees / can do | Server | File / L | Test |
|---|---|---|---|---|---|---|
| [ ] | Page | `data-gmnav="more"` (home tile, `#pr-av`) | Title "My profile". Left: big picture, **Change** (`data-gm=pfav`), name, grade (Kindergarten / Grade n from `TL_MAP.grade`), boxes Days in a row / Badges / Lessons done, **My settings**: Sound On/Off (`pfsnd` → `TL_MENU.actions.setSound`), Music "Choose music" (`pfmus` → `openMusicPanel`), Sign out (`pfout`). Main: **My levels** (one row per subject, Level n, "x of y steps", bar; "Find my levels" proxy), **How the buttons work** (tour card), **Recently finished** (map growth, 5), **My badges** (8, earned count, Rank), **My bank** (Balance, Latest money in, Open my bank), **Recently bought** (5 orders, See all → store `mine`), **My stuff** shelves (Trails, Tap blasts, App colors, Bonuses, Home upgrades, Other; Change → store `fun`; "In use"), **More of my things** tiles | `stInfo` (`storeInfo`) | moreHTML L630-688 | run.js `o.prof`: `.pr-title` "My profile", `.pr-lv` count = subjects, 8 `.pr-b`, `.tlk-quiet[data-gm=pfout]`, `.pr-tile[data-gm=lib]`, ≥6 `.pr-tile`; tile name `.gm-ht.things b` |
| [ ] | Picture picker | `data-gm=pfav` | `#pr-pick` dialog, X (`pfavx`), 16 pictures (`data-gm=pfavk data-k`, the Arena's AVS). The one he picks goes to `st.av` and `localStorage arAv` and shows on the page, the home tile and `#pr-av` | `msSave` (`saveStudent`) | pfPick L689, pfClick L691-695 | run.js `P.pick===16`, `P.av/big/dot/onTile` |
| [ ] | More of my things tiles | `.pr-tile` | Tashbar Store; every `#hlx-mrow > .hlx-btn` from the old home except store, levels, bank and badges: My journey map (room `map`), 🛂 My Torah passport (`data-tj=pass` proxy), 🎬 Play my week (`p3replay`, plays in `#gm-room` week), 🕯️ My Shabbos page (`p3shab`); **All my lessons** (`data-gm=lib`), **Skill tree** (`data-gm=treeview`, not K-2, needs a map), **My week** (`data-gmnav=me`, not K-2) | — | L673-686 | run.js `P.tiles >= 6`, Back test |
| [ ] | All my lessons | `data-gm=lib` | Game Library: stats, search `#gm-q`, filter chips (`data-gm=lf`: All, Kodesh, General, Heart & Soul, Started, New, Done), Mastery review strip (`#mr-card [data-mr]` → ▶ Review), "Pick up where you left off" (`.hlx-rec`), 📚 My bookshelf (→ BoyLibrary `.bl-card`), each subject card (main, next, second buttons) and extra group buttons, all proxies; Back returns to My profile | — | libHTML L940-960 | run.js `o.lib`, `P.backOnLib`, `P.backTo==='more'` |
| [ ] | Skill tree | `data-gm=treeview` or `data-gm=tree` on the map | `.gm-tree`: "🌳 SKILL TREE", strands, nodes ✓ / ⏭ known / now / 🔒 / SOON (`data-gm=tn`) → `.gm-sheet` with status, Replay / ▶ Play, Close (`sheetx`) | — | treeHTML L770, sheet L781 | none |
| [ ] | My map (path) | `data-gmnav="map"` | Unit header, "N to the boss", Change subject (`data-gmnav=subjects` → `data-gm=world data-k`), path nodes, BOSS castle, locked pop "Locked", goal card (▶ Play `data-gm=play`, Read it to me `data-gm=say`), 🎫 Level Check goal card | `kmMyMap` (refresh) | pathHTML L714, goalHTML L793 | run.js `o.goal/learn/nodes/boss/toast/chu/play/plays/worldTabsOnMap`; tests/lib/kidmap.js (server) |
| [ ] | Arcade | `data-gmnav="games"` | Locked: "Arcade locked: finish N more", teasers (SHOWDOWN, DETECTIVE, JOKE BOOK), Go to my work. Open: "🎮 The Arcade", a tile per `#hlx-grow` child (Chavrusa Showdown `.ar-card`, Mistake Detective, Joke Book), plus 🎮 Kodesh Quest (`[data-k=lkpanel]` proxy) | — | arcadeHTML L838, arcadeOpenHTML L933 | run.js `o.locked` (`.gm-lock`) |
| [ ] | My Stuff (tab `mine`) | `data-gm=stuff` (no button found that sets it now) | Old "My Stuff" game screen: Library, every `#hlx-mrow` button, Daily Mix strip `[data-rvmix]`, `.p3quest` list, `.sgoal` school goal, What's new | — | stuffHTML L961 | none |

### 6. My work (GameMap `missions` + Today's list + Today's path + Rebbe picks)

| [ ] | Item | Opens with | What the boy sees / can do | Server | File / L | Test |
|---|---|---|---|---|---|---|
| [ ] | My work page | `data-gmnav="missions"` (first home tile) | Header "MY WORK TODAY" / "TODAY'S LIST", "N of M done". Rows: done ✓ (Cleared / Done), live row "Your turn" (`data-gm=play`), next rows, "Nothing left at your level today. Tell your rebbe!", rebbe picks 📌 "FROM RABBI X · Picked for you", BONUS ROUND (Arcade open/locked), Treasure chest line, CTA ▶ Next / Play round n / Keep climbing | — | missionsHTML L823-837; plan L815 | run.js `o.rounds===3`, `o.live===1` (no-list boy); tests/lib/dailyplan.js `.page()` |
| [ ] | Today's list (Grade 2 up) | `window.tlDailyPlan(ws)` | One row per thing to cover ("2 Reading, 1 Writing, 1 Math, 1 Kodesh, 1 Science"). Rows turn ✓ on local mastery; the Arcade/party opens only when the server says `complete`; result line relabeled "Daily bonus · You finished today's list" | `tdlToday(token)` after sign-in and after every save | src/DailyPlanUI.html L1-48; DailyPlan.js L102 | tests/lib/dailyplan.js `.server()` and `.page(pg,map)` |
| [ ] | Today's path (Pathfinder D) | `window.tlPfdPlan` (HomePlus), `.pfd` with sign-in | One stop per subject (Kodesh first), booster stop, "about N min", climb moments overlay `#pfd-ov` ("Level up!"). TEST- boys with a Pathfinder profile only (`PFD_LIVE=false`) | `pfdToday(token)`; `msSave` returns `.pfd` | src/DailyPath.html L1-99; PathfinderDaily.js L341 | none in run.js |
| [ ] | Rebbe picks and shout-outs | home section; `window.TL_DESK` feeds My work rows | "From my rebbe": shout-outs (praise, Torah moment, Good Shabbos, star of the week, goal with progress) as cards; a new one opens BIG once (`.rp-ov`, confetti), with "Thank you" (`data-rp=shoutok/thanks`); PICKED FOR YOU with Start (`data-rp=go`) | `sgMyDesk(token)` (every 3 min); `sgShoutSeen(token,[ids],thanks)` | src/RebbePick.html L64-108; StaffNotes.js L109, L123 | none |

### 7. Canteen (src/CanteenKid.html, server src/Canteen.js)

| [ ] | Item | Opens with | What the boy sees / can do | Server | File / L | Test |
|---|---|---|---|---|---|---|
| [ ] | 3D canteen room | `data-cno="open"` (home Canteen tile, store canteen tab, old card "Buy food"/"See it") | `#cn-shop.cw3d`, `body.cn-open`, painted room `.cw-room` (never catches a tap), kit house (`data-cno=close`, Esc), 🔊 Read it to me (`data-cno=say`). Four doors `.cw-door[data-p]`: **Buy food**, **Get money**, **My story**, **Lessons** (`data-cno=door`). Polls every 15 s. In class: "The canteen opens after class." | `cnOrderMenu(token)` → menu (emoji/pic, price, sold out, left), cash, pf, story(8), open order, recent(3); `cnKidInfo(token)` | oOpen L236, oDraw L264, cwDoors L305 | run.js map-home `H.cw`: `#cn-shop.cw3d`, `.cw-room` pointer-events none, doors `buy,cash,story,learn`, each opens, ≥5 `[data-cno=lesson][data-c=LIFE]`, Home closes it |
| [ ] | Buy food | door `buy` | Wallet in dollars AND coins, steps "1 Pick food 2 Pay 3 Get your food", food tiles (`data-cno=add`, 🔒 if too expensive, sold out), tray (`data-cno=sub` ✕), Next (`check`), confirm Buy it / Not now (`buy`/`back`), money coach tips | `cnOrderPlace(token,cart,clientId)`: one open order at a time, stock check, `{ok:false,short}` if not enough; charges once by `ord:<id>` | vShop L241, vCheck L249, click L344-348; Canteen.js L707-746 | none (tests/lib/canteen.js covers the kiosk sale only) |
| [ ] | Track my order | after paying | I paid → The canteen is making it → I got my food; "Cancel and get my money back" for 110 s while pending and not seen | `cnOrderCancel(token,orderId)` (refund once, too late after `CN.CANCEL_MS` or when seen) | vTrack L255-262; Canteen.js L748-760 | none |
| [ ] | Get money | door `cash` | From your teachers (20¢ per sign-off goal), from the Store (Canteen Card) → "Get a Canteen Card" (`data-cno=tostore data-st=open data-t=canteen`) | — | vCash L308 | run.js (door opens) |
| [ ] | My story | door `story` | Money in and out (canteen wallet) | (`cnOrderMenu.story`) | vStory L263 | run.js (door opens) |
| [ ] | Lessons | door `learn` | All `LIFE.FIN.*` money lessons (✅ done / ▶ Next) and, if assigned, the 6 Canteen Crew lessons (VOC.CREW.01-06) → `startMission` | `cnKidInfo.crew` | vLearn L314-321 | run.js `c.learn >= 5` |
| [ ] | Old home card | old hub | `.cn-card` Canteen money balance, Buy food / See it, Level-Pass quarter picture; Crew course card n/6 | `cnKidInfo` (every 20-60 s on the hub) | cards L356-370 | none |
| [ ] | Grade / money rules | — | Canteen Cash is NOT Tashbar money; `pf<1` → "one quarter" note; no account → "Ask the office" | — | header L2-6, sayNow L327 | none |

### 8. Chavrusa Arena / Showdown (src/ArenaPage.html, server src/Arena.js)

**New shell (workstream D, `src/ShCity.html`, test `tests/lib/shell-city.js`, pictures `docs/screens/shell/arena|games|workshop/`):** places `arena`, `games` (Mistake Detective, Daily Mix, Kodesh Quest) and `workshop` (Block Builders, Chumash Lab). The Arena and the Pavilion open only when his work is done; the Workshop stays open as the two doors are today. Every row below is played by the test with made-up server answers.

| [ ] | Item | Opens with | What the boy sees / can do | Server | File / L | Test |
|---|---|---|---|---|---|---|
| [x] | Open | `[data-aropen]` (`.ar-card` "Chavrusa Showdown", in the Arcade) | `#ar-ov` game-show overlay; Esc closes (not while playing) | `arMyStats(token)` (points, wins, played, taught, quests) | open L217, card L452 | classesbucket.js (`#ar-ov` must not open in class) |
| [x] | Home | — | Title (Talmid → Gaon) with Hebrew, Arena points, wins, showdowns, taught, progress to next title, trophies, weekly quests; avatar pick (`data-ar=av`); buttons: New showdown (`new`), Join with a code (`join`), Challenge a friend (`cfnew`), Class showdown (`cjoin`), Shtender duel (`ppnew`); open challenges (`cftake`), take by code (`cfjoin`) | `arCfList(token)` | homeH L264-280, cfListH L362 | none |
| [x] | Pick subject / topic | `subj` / `topic` / `mix` / `ptopic`+`plv` (Parsha by level), Lightning toggle `lt`, `mk`, `syopen` | Every subject in BANK_ALL; "Mix of what I mastered"; 10 questions built on the page (20 in Lightning) | `arOpen(token,{subject,topic,label,qs,mode,av})` → 4-digit code | goWith L421-427 | none |
| [x] | Live duel | wait / count / play | Code tiles, 3-2-1-GO, podiums with avatars and LED scores, A-F answers (`ans`, keys 1-6/A-F), power-ups ✂️ Split / 🛡️ 2nd Chance / ⚡ Double (`pw`), cheers (`cheer`, fixed kind messages), announcer banners | `arJoin(token,code,av)`, `arPoll(token,code)` ~1.5 s, `arAnswer(token,code,i,choice)`, `arPower`, `arCheer` | onClick L386-452 | none |
| [x] | End | — | Winner, both see the other's misses with answers (kinas sofrim), "He taught me" (`taught`), Yasher Koach handshake (`shake`), REMATCH (`rematch`), Another showdown (`again`) | `arTeach`, `arShake` | L336-338, L449 | none |
| [x] | Challenge a friend (async) | `cfnew` / `cftake` / `cfjoin` (5-digit code) | Race a friend's saved run; ghost progress | `arCfMake`, `arCfGet`, `arCfAns`, `arCfDone`, `arCfList` | L340-374, L425 | none |
| [x] | Class showdown | `cjoin` (staff runs `chOpen`/`chStep`) | Team color, question, answers (`cans`), reveal | `chJoin`, `chPoll`, `chQs` (page sends questions), `chAnswer` | L341-356 | none |
| [x] | Shtender duel | `ppnew` → names (`#ar-p2`, `ppgo`) → pass the Chromebook (`ppnext`) | Two boys, one Chromebook, practice, no points | — (answers saved as evidence via `ev()`) | ppH L376 | none |
| [x] | Rules | — | Points only (play 1, win +3, tie +1, teach +2, handshake +1; 12 duels a day, 4 with the same chavrusa). **No money** (Arena.js has no money post). The rebbe can switch the Arena off (`arOn_`, `arSet`). Answers count for the Olam Haba cloud | — | Arena.js L1-25 | none |

### 9. Mistake Detective and Daily Mix (src/Review.html)

| [ ] | Item | Opens with | What the boy sees / can do | Server | File / L | Test |
|---|---|---|---|---|---|---|
| [x] | Mistake Detective | `[data-mdopen]` (Arcade tile; home card "Start a case"); off switch `TL_MD_OFF` | `#mdx.on`: intro, best score; 6 cases from non-Kodesh skills he has worked on (needs ≥3). Each case: 1 SPOT IT (👍/👎 `s1`), 2 FIX IT, 3 PROVE IT (clue), SOLVED stamp with the right answer, the mistake and why; points; ranks (Rookie → Chief Inspector); New cases / Done; keys 1-3, Enter; 🔊 (`data-md=say`) | none: pays nothing, saves nothing; best score in `localStorage tl_md_best_<id>` | L95-262 (open L151, close L153, end L195) | classesbucket.js (`#mdx` must not open in class) |
| [x] | Daily Mix spaced review | `[data-rvmix]` (My Stuff strip, `.rvcard`) | One mixed round of up to 8 questions from due skills; result "6 of 7 right", Fix it now (Quick Hit) | none (never pays; `st.rv` in his state via `msSave`) | L1-94 | none |
| [ ] | Mastery review | `#mr-card [data-mr]` (All my lessons strip) | Spaced review 1/3/7/14/30/60 days | (state) | src/MasteryReview.html | none | Not in workstream D: it sits on the All my lessons strip (left for that place).

### 10. Kodesh Quest (src/KinderKriyah.html)

| [ ] | Item | Opens with | What the boy sees / can do | Server | File / L | Test |
|---|---|---|---|---|---|---|
| [x] | Kodesh Quest | `data-kk="open"`, `data-kk="all"` (Kodesh lands only), `data-kk="land" data-land data-band` (deep link, `.lkgame` buttons in the Limudei Kodesh panel), Arcade tile (`[data-k=lkpanel]` proxy); `window.tlKinderKriyah`, `tlKQOpen` | `#kkov.kkov`: sandboxed iframe (srcdoc, allow-scripts) with 112 games and Island Lessons for K-8 bands; X (`data-kk=close`) | none direct. **Money bridge:** each right answer posts `{tlQuest:1}` → evidence row `LK.QUEST.<game>` in `SRV.pendingEv` → `saveStudent` → `msSave` pays it (correct / firstTry; wrong rows `ok:false` are not paid). Progress (`kqStore`: band, best, mastery, units, played) → `st.kq` (≤12000 chars). "Talk to my Rebbe" inside a lesson → `tlTalkRebbe()` with a pre-filled note | L26-127 | k1home.js (`#kkov` checks for K-1) |
| [x] | Grade rule | — | `KINDER_KRIYAH_LIVE=true` (every boy); lands are placed by level (K = 1 … 7-8 = 8-9) | — | L19, L24, L61-85 | none |

### 11. Block Builders workbook (src/BlockBuildersUI.html, server src/BlockBuilders.js)

| [ ] | Item | Opens with | What the boy sees / can do | Server | File / L | Test |
|---|---|---|---|---|---|---|
| [x] | Door | `#bbx-door` "📘 Workbook", fixed top right, on the home or his Math map | Shows only if `BB_LIVE` allows: TEST- boys, or Math level 2-4 (`eligible`); `#workbook` in the address opens it | — | door L581-585, eligible L579 | tests/lib/blockbuilders.js #5 (door on a TEST- boy's Math map, not above Math level 4) |
| [x] | Workbook | `X.openBook(jobId)` | `#bbx`: home list of jobs with stars; WATCH ME (Dot/Tenzi speak, step through `wnext`/`wback`, `hear`, `mute`); the printed workbook page with his name and date, live answer boxes plus number pad, hints, "Watch me" with his numbers after a 2nd miss; pen layer (stylus writes anywhere, undo, clear); pencil mode (`pencil`, Check my work `pcheck`); timer on timed jobs; Finish → Job done with score; Sheet B | `bbMine(token)`, `bbPage(token,pageId)` (pen strokes), `bbSave(token,pageId,data)` (2.5 s after a change; also kept on the Chromebook) | openBook L536, click L555-575, save L523-528 | blockbuilders.js #1-4 (all 137 pages compile, right answer accepted / wrong refused, 390 px page, taps-only play, pen stroke survives reopen) |
| [x] | Money | — | No money, mastery or evidence | — | header L10-12 | blockbuilders.js |

### 12. Chumash & Timeline Lab (src/ChumashLab.html + ChumashLabData.html)

| [ ] | Item | Opens with | What the boy sees / can do | Server | File / L | Test |
|---|---|---|---|---|---|---|
| [x] | Door | `#clab-door` (kit tile, bottom center, home only) | Grade 3 and up, or TEST- (`CLAB_LIVE='on'`) | — | door L918-923, eligible L31 | tests/lib/chumashlab.js #6 (grade 5 and TEST- see it, grade 1 does not) |
| [x] | Lab | `X.openLab(where)` | `#clab`: six labs: Shorashim, Milim, Prefixes & Suffixes, Stop Signs (trop), Pasuk Workshop, Timeline (English/Hebrew). Each unit: lesson, practice, game, quiz with a "How to do it" box; locked/Up next/Done; Timeline game | none: progress in `localStorage clab:<id>` | hub L224, L912 | chumashlab.js #1-5 (data, 300 questions, plays by taps, kit buttons only, no money/points/gems, no sideways scroll at 390 px) |

### 13. My Library (src/BoyLibrary.html, server src/Library.js)

| [ ] | Item | Opens with | What the boy sees / can do | Server | File / L | Test |
|---|---|---|---|---|---|---|
| [ ] | Bookshelf | `[data-bl-open]` (`.bl-card` "My Library · N books picked for you"; GameMap All my lessons → "📚 My bookshelf" proxy) | `#bl-ov.bl-ov`: "<Name>'s Library", X (`data-bl=close`, Esc); tabs: 📌 For me (picks with From / due day, Start) plus a shelf per subject (`data-bl=tab`); shelves Earlier / Now / Next / Your books; spines: gold = mastered, glowing = next, 📌 = assigned; never a level number; a book starts the lesson (`data-bl=go`; Science/Electives open their pack overlays `#sci-ov`/`#elec-ov`) | `libMyLibrary(token)` (`LIB.BOY_LIVE=true`; off → `{off:true}`) | L1-75; Library.js L395 | classesbucket.js (`#bl-ov` must not open in class) |

### 14. Olam Haba (src/OlamHaba.html)

| [ ] | Item | Opens with | What the boy sees / can do | Server | File / L | Test |
|---|---|---|---|---|---|---|
| [ ] | Sky column | always on boy screens (not sign-in, Teacher-mode lock, K-1 home, print) | `#ohsky` fixed right column (slim on phones): cloud "Olam Haba" (Hebrew in Kodesh), pillar grows with today's effort, light rises on every answer (Kodesh 5x), surges, stars forever, gate of light, sunrise, comets. Never a number | none; `st.ohb {d,t,k,L}` saved with `msSave` | L1-110, paint L95, shown L94 | classesbucket.js (`#ohsky` hidden in class); k1home.js (`#ohsky` off for K-1) |
| [ ] | "My Olam Haba" sheet | tap/Enter on the cloud `#ohb` | `.ohsheet`: cloud, today's line, growth line, how it works, **My Pearls of Olam Haba**, Avos quotes, "Keep going! ✨" (a plain button, not kit) | — | sheet L180-195 | none |
| [ ] | Hooks | `window.tlOH` (torah moment, davening), `tlOHSunrise` | Used by TorahPlus davening and RebbePick Torah moments | — | L159-189 | none |

### 15. Music (src/Music.html, server src/MusicServer.js)

| [ ] | Item | Opens with | What the boy sees / can do | Server | File / L | Test |
|---|---|---|---|---|---|---|
| [ ] | Music panel | `data-act="mubtn"` (🎵 `#mubtn` in the old home tools); corner menu `data-action="musicPanel"`; My profile "Choose music" (`pfmus`) | `A.overlay` `.mupanel`: X, "school music off" note, moods (No music, Happy Mix, Focus, Energy, Game tunes, generated high-energy styles; `data-act=mumood`), volume `#muvol`, headphones note, Now playing with Next (`munext`). Mood/volume saved in `st.music` | `msMusicInfo(token)` (track list, school off switch); `msMusicPart(token,id,part)` (base64 chunks, cached in the browser) | panel L184-196, click L197-201 | classesbucket.js (`data-act=mubtn` stopped in class) |
| [ ] | Play/pause/next in the corner menu | `data-action=playPause/next` | — | — | src/SignOutBar.html L135-137, L219-221 | none |

### 16. Talk to my Rebbe (src/TalkRebbe.html, server src/Classroom.js)

| [ ] | Item | Opens with | What the boy sees / can do | Server | File / L | Test |
|---|---|---|---|---|---|---|
| [ ] | Note form | `data-tr="open"` (`.trcard` added through `tlFindLevelCard` on the old hub); `window.tlTalkRebbe()` (lesson "Still stuck?" after 5 tries `data-ak=rebbe`, Kodesh Quest) | Overlay: Who is it for? (`#tr-to`), Your note (`#tr-text`, 1000 chars, counter), "🔒 Only the person you pick will see this note", Send my note (`data-tr=send`), Not now; sent card "It went to X" | `crStaffList(token)`; `crSend(token,staffId,text)` (daily cap `CR.PERDAY`) | L1-48; Classroom.js L41-52 | classesbucket.js (`data-tr=open` stopped in class) |

### 17. Torah Tracks, Passport, Taryag Quest, Torah Plus, Chumash page

| [ ] | Item | Opens with | What the boy sees / can do | Server | File / L | Test |
|---|---|---|---|---|---|---|
| [ ] | Torah Journey card | `.tt-card` on the old hub (HomeLayout keeps it hidden; "Continue my Torah Journey" button goes to the Kodesh group of All my lessons) | Continue my journey (`data-tj=go`), 🛂 passport (`data-tj=pass`), track tiles (`data-tj=trk`: Halacha, Tefillah, Yomim Tovim, Middos, Parsha, Navi, Chemdas) | — | card L3992-3995; vHub wrap L4134 | none |
| [ ] | Land map | `data-tj=trk data-k` | `.tt-ov`: winding path of stations ✓/⭐/n (`data-tj=pv`) → preview `.tt-pv` (Back to the map `pvx`, Start this station / Review `go`), X (`data-tj=x`) | — (lesson through `startMission('LK',id)`) | map L3996-4009 | none |
| [ ] | **Torah Passport** | `data-tj="pass"` (land header 🛂, journey card, My profile "My Torah passport" proxy) | `.tt-ov` "🛂 My Torah Passport · n of N": guide line, every track's stamps (on = mastered) | — | passport L4010-4014 | classesbucket.js (`data-tj=pass` stopped in class) |
| [ ] | Chemdas song | before every `LK.CHEM.L04.*` lesson | `#csg` sing-along, then the lesson (`TL_CHEM_SING`) | — | L3843-3918 | run.js turns it off for lesson play |
| [ ] | My school band | — | `.ms-me` banner for a family / homeschool / group / another school | `sbMySchool(token)` | L4135-4148 | none |
| [ ] | Taryag Quest | `data-tq="open"` (✋ tile in Pick an adventure; HomeLayout holds it hidden); `TL_TRY_OPEN()` | `.tq-ov`: hand map with 14 Worlds (`data-tq=bone`), Six-Wall Room, mitzvah cards (`pv` → `.tq-pv`, `go` starts the lesson), X | — (no money code) | src/TaryagQuest.html L86-134 | none |
| [ ] | Torah Plus | section on the old hub | Shabbos/Yom Tov banner (candles, menorah), "Did you daven today?" Shacharis/Mincha/Maariv (`data-tp=dav` → `st.dav`, lights Olam Haba), Parsha of the week (`data-tp=par`, from the rebbe), My Torah scroll (`data-tp=scroll` → `.tp-sheet`) | (`st.dav` via `msSave`; parsha from `tlRP` / `sgMyDesk`) | src/TorahPlus.html L75-113 | none |
| [ ] | Chumash page | `[data-chmopen]` (`.chm-card`, Parsha card) | `#chm-ov`: 54 parshiyos, pasuk words, levels 1-8 | `chmParsha(token,name)` | src/ChumashPage.html L62, L322-324 | none |

### 18. Other boy places found in src/ (and packs/)

| [ ] | Place | Opens with | Notes | Server | File | Test |
|---|---|---|---|---|---|---|
| [ ] | Joke Book / Joke Jar 2 | `data-hp="jokes"` (Arcade tile) → `window.tlJokeBook()` | Guess the punchline, flip the card | — | src/JokeJar.html; HomePlus L218-219, L275 | none |
| [ ] | Kid reminders | automatic | `#kpr` reminder pop-ups from staff/parents, acknowledged | `kpAck(token,id)` plus a due-list call | src/KidReminders.html L19-21; Access.js L320 | k1home.js (no pop-ups for K-1) |
| [ ] | Corner menu | `#tlmenu` top right | Sign out, auto sign-out after 5 quiet minutes, Music panel / play-pause / next | — | src/SignOutBar.html | none |
| [ ] | Level check card | `.pf-card` / `#pf-cf` | Level Pass, quarter pay note | (Pathfinder) | src/PathfinderCard.html | run.js level-check card test (`.gm-lcg`) |
| [ ] | Treasure chest open | `msSave` returns `chest.paid` | `.hpchestov` | (`moneyChestStatus_`) | HomePlus L257-261 | none |
| [ ] | Trades / Spark Path | `#tr-ov` | Spark Path window | (saved like a lesson) | src/TradesMore.html, SparkPath.html | none |
| [ ] | Science / Electives / Algebra / K overlays | `#sci-ov`, `#elec-ov`, `algaov`, `klov/krov/kscov/kwrov/kelov` | Subject overlays in lesson packs (not src/) | — | packs/ScienceMore*.html, ElectivesMore.html, AlgebraAscent.html, K*.html | lesson tests |
| [ ] | B'Simcha (SIM) panel | `[data-k="simpanel"]` | Heart & Soul lessons; `SIM_LIVE=true` | — | src/SimchaMore.html, SimchaLife.html | lesson tests |
| [ ] | Welcome / 3D | after sign-in | WelcomeJoy "Let's go!", Warp3D world (looks only) | — | src/WelcomeJoy.html, Warp3D.html | tests/lib/warp3d.js |
| [ ] | Your Classes & Bucket screen | class lock | `.ycw` class screen, `#ycworld`, `#ysheet`, door tiles `[data-ycdoor]` | ClassesBucket.js | src/ClassMode.html | classesbucket.js |

### Gaps and risks to decide before the rebuild
- [ ] **The Store tile opens My money, not the Store.** The home "Store" tile is `data-gmnav="money"` (GameMap L612). The Store itself opens only from inside that page or from My profile.
- [ ] **Proxies to the hidden old home.** The bank room, badges room, journey map, Play my week, Shabbos page, Passport, Find my levels, the Arcade tiles, Kodesh Quest and every All-my-lessons card press buttons built by the hidden old home (HomeLayout / QuestPage `vHub`). Removing the old home breaks them all.
- [ ] **Talk to my Rebbe has no door on the map home (not checked in a browser).** Its card is added through `tlFindLevelCard` on the old hub. HomeLayout moves unknown sections into `#hlx-mrow` (L312-319), but GameMap reads only `#hlx-mrow > .hlx-btn`. The same probably holds for the RebbePick section (its picks still show in My work), the TorahPlus section and the Taryag / Torah Tracks cards. Play it as a made-up boy to confirm.
- [ ] **"My week" means two things.** It is the Store tab `week` (money) and the GameMap `me` page (rank and XP). "Trophies" means the `me` page, the badges room and the My profile badges.
- [ ] The `mine` (My Stuff) GameMap tab still has a handler (`data-gm=stuff`), but nothing in src/ emits that button.
- [ ] Some buttons are not kit buttons: the `.ohsheet` "Keep going!" button, the TalkRebbe form (`.btn`), the Arena's own `.btn`, the BoyLibrary tabs and spines, the TorahTracks map, the HomePlus/StoreKid `.stbtn`/`.stcannon` and the Arena theming.
- [ ] Very few automated tests cover these places. No test opens and uses the Store, the money page, the bank, the Arena, Mistake Detective, My Library, Music, Talk to my Rebbe, the Olam Haba sheet, the Passport, Kodesh Quest, Taryag or TorahPlus. Only the class-lock test checks that they stay shut, and storefx checks the Store's item data. The places with real play tests are the Canteen (run.js), My profile, My map, My work, the Arcade lock, Block Builders, the Chumash Lab, the trails and the K-1 path.

---

# Part C · Your Classes & Bucket, the lock and doors, K–1, and the tests that guard the shell

Read-only research, 2026-11-27. Sources read in full: `src/ClassMode.html` (487 lines), `src/K1Only.html`, `tests/run.js`, `tests/lib/k1home.js`, `tests/lib/classesbucket.js` (page part + server asserts), `tests/lib/dailyplan.js` (page part), plus the listed test libs. Line numbers are from the current checkout.

Use the `[ ]` column as the rebuild checklist: tick an item only when the replacement still does it (or a HoS decision drops it).

---

## 0. Where ClassMode sits (load order matters)

| [ ] | Fact | Where |
|---|---|---|
| [ ] | ClassMode is loaded **near the end, "LAST so it wraps everything"**: after HomePlus, StoreKid, RebbePick, OlamHaba, TorahPlus, ChumashPage, KriyahMore, TorahTracks, ArenaPage; **before** HomeLift, LearnWays, DailyPath, HomeLayout..., GameMap, K1Only, CanteenKid. It wraps `startMission` and `render` (whatever exists when it loads). | `src/Photos.js:243` (`msQuestToolsBody_`), `src/Speed.js:10-12` `TL_PART_FILES` (must stay in step with Photos.js) |
| [ ] | Bails out entirely unless `render`, `startMission`, `A` exist. | ClassMode.html:7 |
| [ ] | K1Only loads last (`Photos.js:293`); `K1O.hook()` re-wraps `render` after every other piece. | K1Only.html:149-155 |
| [ ] | Sign-in hands the class answer to ClassMode with no extra trip: `msSignInFast` returns `r.tm = tmMine(token)`, `r.tmOk`; HomePage sets `window.TL_PRE_TM={sid,at,ok,r}`; ClassMode `pre(sid)` uses it if < 120 s old. | `src/Speed.js:19`, `src/HomePage.html:681`, ClassMode.html:370 |

## 1. Globals ClassMode exposes / consumes (other files depend on them)

| [ ] | Global | Used by | Meaning |
|---|---|---|---|
| [ ] | `window.TM_CLASS()` | `CanteenKid.html:208` (inClass), `TradesMore.html:52` (removes `#tr-ov` every 3 s) | the running class/lock object, or null if none **or if a teacher opened the canteen door** (`!doorOpen('canteen')`) |
| [ ] | `window.TL_DOORS` | (exported DOORS table) | page-side door table |
| [ ] | `window.TM_CHECK` | worksheet "Hand it in" re-asks the server after 800 ms | = `check()` |
| [ ] | `window.TL_SHEET = {open, close, sync, state}` | `startClass` opens `SHEET.*`; `check()` calls `TL_SHEET.sync(SKILLS())` | worksheet screen |
| [ ] | body class `tm-on` | `GameMap.html:1011` (`hub=... && !body.tm-on`) | a lock screen is drawn in `#app` |
| [ ] | body classes `yc-world`, `yc-home`, `yc-city`, `yc-lock` | ClassMode CSS only | world on (locked), Great Terrace home, Golden City backgrounds, locked |
| [ ] | Reads: `A.st`, `A.view`, `A.play`, `A.res`, `A.overlay`, `SRV.token`, `BANK_ALL`, `GEN`, `TL_DO`, `CURR/WORLD/WCOL/WG` (adds `TCH`), `mastered()`, `skillName()`, `toast()`, `SND.tap/wrong/win/whoosh`, `run()`, `window.TLK`, `window.TL_MAP` (`grade`, `sid`), `window.GM.tab`, body classes `gm-on`, `gm-home`, `k1-home` | | |

## 2. Server calls (boy side)

| [ ] | Call | From | When | Notes |
|---|---|---|---|---|
| [ ] | `tmMine(token)` | ClassMode `check()` :371-383 | every 25 s (`setInterval(check,25000)` :386), at sid change if no `TL_PRE_TM`, right after a Teacher Time ends (:385), 800 ms after a sheet is handed in | `TeacherMode.js:78`: asks `ycMine_(sid, liveSession)` first; `undefined` = schedule does not touch him, falls through to live class; result passed through `ycDecorate_` (take-aways: adds `closed`, removes closed from `doors`; with no lock returns `{open:true, id:'yc-open:..', closed}`) |
| [ ] | `msSignInFast(pin)` | HomePage pinGo | sign in | carries `tm`, `tmOk`, `map` |
| [ ] | `ycSheetOpen(token,id)` | worksheet `open()` :470 | open a sheet | returns `{sheet, work, canEdit, status}` |
| [ ] | `ycSheetImg(token,id,i)` | `loadPage()` :442 | uploaded sheet page picture (text sheets drawn locally on canvas) | |
| [ ] | `ycSheetSave(token,id,work,handIn)` | `save()` :464 | autosave 2.5 s after a change, page turn, close, hand in | |
| [ ] | `klMe(token)` | K1Only `fetchGrade()` | once per boy | grade cached in localStorage `tl-k1g:<sid>` |

Shape of a lock answer (`ycMine_`, ClassesBucket.js:127-151): `{id, skill, skills[], lessons[] (TCH.* bodies), clsName, name, subj, by, until, now, names{}, handed{}, doors[], closed[]?, yc:{k:'T1'|'T2'|'IS', label, cls, next:{k,name,at,show}, why:''|'now'|'empty'}, bucket?:{core[], addons[], complete, total, done}}`. Client fixes clock skew: `until = Date.now() + (until - now)`.

## 3. ClassMode screens (boy-facing), what each must keep

### 3a. Router (render wrap) — ClassMode.html:273-283
| [ ] | Behaviour |
|---|---|
| [ ] | `startMission` wrapped: while a lock is set, any id not in `SKILLS()` or `kind==='boss'` -> `SND.wrong()`, back to hub, re-render. |
| [ ] | `render` wrapped: on `A.view==='result'` for a class skill, counts `TMC.done++` once (`A.res.tmCounted`); in bucket mode re-checks the server after 4 s. |
| [ ] | While locked and `A.view==='play'` with a non-class lesson: forced back to hub. |
| [ ] | While locked and `A.view==='hub'`: `#app.innerHTML = lockHTML()`, adds `tm-on`, removes `hp-on`, `A.overlay=null`; if `s.yc` adds `yc-world` and flies to `spring` (IS) or `hall`. No "Getting your day ready" wait (v162). |
| [ ] | Otherwise removes `tm-on`, `yc-world`, calls original render. |
| [ ] | Click on `[data-tm=go]` (capture, document) -> `startClass(data-id)`; a `.ycpaper` first gets `.ycfly` (260 ms) unless reduce motion. |
| [ ] | `startClass`: `SHEET.<id>` -> `TL_SHEET.open`; `SCI`/`ELEC` -> synthesizes hidden `[data-sci=open]` / `[data-elec=open]` button click, returns if `#sci-ov`/`#elec-ov` appeared; lesson not in `BANK_ALL` or `GEN` -> toast "still loading"; else `_start(subj,id,'skill')` (the original `startMission`, **seam**). |

### 3b. Teacher Time screen (Teacher Time Hall) — `ycHTML()` :245-249
| [ ] | Element | Detail |
|---|---|---|
| [ ] | `section.ycw` | page on top of world |
| [ ] | ring `.ycw-ring` | minutes left, fraction of `yc.len` (default 35) — top right, hidden <700 px |
| [ ] | plaque `.ycw-plaque(.ycpl)` | `TLK.pill('now', yc.label)` e.g. "Teacher Time 1" + `<h2>` class name |
| [ ] | `.ycw-sub` | "with {teacher} · Your teacher picked this/these for now." |
| [ ] | papers `.ycpapers` | one `button.tlk.tlk-tile.ycpaper[data-tm=go][data-id]` per skill: subject band (color per subject), icon art, title, "done" seal if handed in or mastered |
| [ ] | Start | only if exactly 1 skill: `TLK.main(WORDS.start,'data-tm="go" data-id=..')` in `.ycgo` |
| [ ] | door tiles | `doorTiles()` (3e) |
| [ ] | bottom bar `.ycw-bar` | `TLK.pill('lock','Next: {name} at {show}')` or "Only your work is open now"; `pill('prog','Until h:mm')` |

### 3c. Independent Study bucket (Bucket Spring) — `ycISHTML()` :227-243
| [ ] | Element | Detail |
|---|---|---|
| [ ] | plaque | `pill('now','Independent Study')`, h2 "My bucket" / "Your bucket is done!" |
| [ ] | why line | `why==='empty'` "No class work right now, so it is bucket time." / `'now'` "Your teacher sent you to your bucket." / complete "Your core is done. Your add-ons are out!" / default "Pull a paper out of your bucket. Any order you like." |
| [ ] | crystal bucket `.ycbucket` | back/front picture layers (or painted glass fallback), `.ycglow` + sparkles when complete |
| [ ] | papers in bucket | core items not done (done = `x.done` or mastered) |
| [ ] | done pile `.ycdone` | tray picture + check + `pill('prog','Done n of N')` |
| [ ] | add-ons `.ycadds` | sub "Add-on"; `locked` (div, not button, grey, lock icon) until core complete |
| [ ] | door tiles beside bucket | `doorTiles('side')` |
| [ ] | celebration | confetti once per lock id (`ycCelebrated`), `SND.win`; skipped on reduce motion |
| [ ] | item title | subj/sheet lines use `x.name`; lesson lines use `nameOf(skill)` (TMC.s.names, BANK_ALL name, skillName) |

### 3d. Old teacher live-class screens (no `s.yc`) — :250-261
| [ ] | `lockHTML()` one lesson: `.tmw > .tmc` card "Class lesson", subject icon, "Look at the board...", done banner, `button.go[data-tm=go]` ("Start the lesson"/"Practice again") — **NOT from the button kit** |
| [ ] | `lockManyHTML()` several lessons: `.tmlist` of `button.tml[data-tm=go]` rows — **NOT from the button kit** |
| [ ] | footer: "The rest of the app opens again when class ends (at h:mm)." |
| [ ] | Teacher-made lessons `TCH.*` arrive with questions: `addTeacherLessons` builds `BANK_ALL[id]={name,teach:[],practice,check}` (last 3 qs = check; <4 qs reuses), `TL_DO[id]` how-to. |

### 3e. Door tiles on class screens — `doorTiles()` :365-366
| [ ] | Only doors in `TMC.s.doors` that have a `go` and are `doorOpen` (opened by rule, not taken away). Row with `pill('now','Open for you now')`, each `button.tlk.tlk-tile.ycdoor[data-ycdoor=k]`: art icon (`DOORART`) or emoji, name, "Your teacher opened this". |
| [ ] | Click (capture, :363) -> `SND.tap`, `doorCss()`, then if in world and not reduce motion: flight `ycwGo('city', D.go)` (gondola up to Golden City), else `D.go()`. |

### 3f. Worksheet screen `#ysheet` — :393-486 (separate IIFE)
| [ ] | Feature | Detail |
|---|---|---|
| [ ] | host | `#ysheet` fixed, z-index 2147483647, `role=dialog`, aria-label Worksheet |
| [ ] | top bar | `TLK.x('data-ys="close"','tl','Close')`, title, `pill('prog','Page i of n')`, tools (`TLK.tool`): pen, colors black/blue/red, type (text), eraser, undo; active tool gets `.on`; status pill `lock` Saving…/Not saved yet/Saved; read-only shows "Handed in ✓"/"Closed" |
| [ ] | page | uploaded page image (`ycSheetImg`) or text sheet drawn on canvas (1000x1294, 8 questions/page, wraps, 2 answer lines each); canvas overlay for pen strokes |
| [ ] | coordinates | 0-10000 across page width (same on teacher screen); stroke width 28/26; max 4000 points; eraser radius 160 |
| [ ] | typing | tap with text tool -> `textarea.ystx` at point, max 400 chars, empty removed on blur |
| [ ] | autosave | 2.5 s after change; save on page turn and close; error -> toast, stays dirty |
| [ ] | footer | `TLK.quiet(WORDS.back/next)` page nav; `TLK.main('Hand it in')` -> `TLK.ask({icon:'📝',title:'Hand it in?',text:...,yes:'Hand it in'})`; yes -> save(true), read-only, close, toast "Handed in! Great work. ⭐", `SND.win`, `TM_CHECK` after 800 ms |
| [ ] | sync | when class moves on and the sheet is no longer in skills: save, read-only, close, toast "Class time is over. Your work is saved." |
| [ ] | resize | re-lays canvas |

## 4. The airtight lock (capture listener) — ClassMode.html:306-329

| [ ] | Rule | Code |
|---|---|---|
| [ ] | `locked()` = `TMC.s && A.st && A.view!=='signin'` | :308 |
| [ ] | `doorOpen(d)` = d in `TMC.s.doors` and not in `TMC.closed` | :309 |
| [ ] | `guard(e)` on **window, capture**, for `click` and `keydown` (only Enter/Space) | :313-322 |
| [ ] | Not locked: only a taken-away door is blocked (toast "Your teacher closed {name} for now.") | :315 |
| [ ] | Locked, order: (1) sign out always passes: `[data-act="signout"],[data-gm="pfout"],[data-item="signout"],.tl-out`; (2) a door: passes only if `doorOpen`, else toast closed / "That opens after class time."; (3) `A.view` play/result: everything passes (lesson's own buttons); (4) inside `SAFE`; (5) inside an opened door's overlay `ov`; (6) else blocked, toast "Only your class work is open now." | :316-321 |
| [ ] | Block = `preventDefault` + `stopImmediatePropagation`, toast at most every 2.5 s | :312 |
| [ ] | `SAFE` = `#ysheet,.ycw,.tmw,#tlmenu,[data-act="signout"],[data-gm="pfout"],.tl-out,.tlk-ask,#kpr,#kprb,#toast,[data-th],#tlclock` | :306 |
| [ ] | `FLOAT` (floating doors hidden while locked unless opened) = `#ohsky,#bbx-door,#clab-door,#pr-av,#tashbar-sound` | :307 |
| [ ] | `doorCss()` every 700 ms writes `<style id="yc-doors">`: `display:none!important` for each shut door's `hide` + `ov` (shut = taken away, or locked and not opened) plus FLOAT items while locked; toggles `body.yc-lock`. Only rewrites if text changed (keeps K-1 page quiet). | :324-329 |
| [ ] | Note: the lesson is not server-checked (docs: "for lessons the lock is on the page"); worksheets are server-checked (`ycBoyOpen_`). | docs/CLASSES-BUCKET.md |

## 5. DOORS table (page) — ClassMode.html:291-304, and server `YC.DOORS` (ClassesBucket.js:437-439)

| [ ] | id | Page name / icon | Trigger selectors (`sel`) | `hide` (floating door) | Overlays (`ov`) | `go` (open from tile) | Server `YC.DOORS` name | Rule can open? |
|---|---|---|---|---|---|---|---|---|
| [ ] | `all` | — (not on page) | — | — | — | — | The whole app 🌐 | 1 (lifts lock; server returns null) |
| [ ] | `canteen` | Canteen 🥪 | `[data-cno]` | — | `#cn-shop` | hidden button `data-cno=open` | Canteen | 1 |
| [ ] | `store` | Store 🛍️ | `[data-st],[data-gmnav="money"],[data-gmnav="store"],[data-gm="pfshop"],[data-gm="mstory"],.mm-c` | — | `#tlstore` | `window.tlStore()` else hidden `data-st=open data-t=fun` | Store | 1 |
| [ ] | `arena` | Chavrusa duels ⚔️ | `[data-aropen],[data-ar]` | — | `#ar-ov` | hidden `data-aropen=1` | Chavrusa duels | 1 |
| [ ] | `games` | Mistake Detective 🕵️ | `[data-mdopen],[data-md],[data-kk],[data-hp="jokes"],[data-gmnav="games"]` | — | `#mdx,#kkov` | hidden `data-mdopen=1` | Mistake Detective & Kodesh Quest | 1 |
| [ ] | `blockbuilders` | Block Builders 🧱 | `#bbx-door` | `#bbx-door` | `#bbx` | `BBX.openBook()` | Block Builders workbook | 1 |
| [ ] | `chumashlab` | Chumash Lab 🧪 | `#clab-door` | `#clab-door` | `#clab` | `CLAB.openLab()` | Chumash Lab | 1 |
| [ ] | `library` | My Library 📚 | `[data-bl-open]` | — | `#bl-ov` | hidden `data-bl-open=1` | My Library (books) | 1 |
| [ ] | `olamhaba` | Olam Haba ☁️ | `#ohsky,#ohb` | `#ohsky` | `.ohsheet` | **none** (no tile even if opened) | Olam Haba cloud | 1 |
| [ ] | `torah` | Torah Tracks 📜 | `[data-tj],[data-tq],[data-chmopen],[data-csg]` | — | `.tt-ov,.tt-pv,#csg,.tq-ov,.tq-pv,#chm-ov` | none | Torah Tracks, Taryag & Chumash page | 0 (take-away only) |
| [ ] | `music` | Music 🎵 | `[data-act="mubtn"],[data-act="munext"],[data-action="musicPanel"],[data-action="playPause"],[data-action="next"]` | — | — | none | Music | 0 |
| [ ] | `talk` | Talk to my Rebbe ✉️ | `[data-tr="open"],[data-item="message"],[data-ak="rebbe"]` | — | — | none | Talk to my Rebbe | 0 |
| [ ] | `profile` | My profile 🎒 | `[data-gmnav="more"],[data-gmnav="me"],#pr-av,[data-gm="pfav"],[data-gm="pfavk"],[data-gm="pfavx"],[data-gm="room"],[data-gm="pftour"]` | `#pr-av` | `#gm-room,#pr-pick,#tl-tour` | none | My profile | 0 |

Door art (`DOORART`): canteen `ycb-ic-canteen`, arena `ycb-ic-duels`, store `ycb-ic-store`, games `ycw-ic-detective`, blockbuilders `ycw-ic-blocks`, chumashlab `ycw-ic-lab`, library `ycw-ic-library`, olamhaba `ycw-ic-calm`.

Notes for the rebuild:
- [ ] Every new place must get a door id + trigger selectors + overlay selectors, or it will be (a) blocked as "Only your class work is open now" while locked (fine) but (b) **never openable by a teacher rule and never take-away-able** (silent gap). Server `YC.DOORS` ids must equal page `DOORS` ids.
- [ ] `[data-gmnav="store"]` matches nothing in src today (likely stale). `data-gmnav` values in GameMap: home, map, missions, games, money, more, me, subjects.
- [ ] Map (`data-gmnav=map`), My work (`missions`), subjects, `data-hp=levels` are **not doors**: blocked while locked, never closable.
- [ ] The tests click synthetic buttons with these attributes (5b) — a rebuild that renames triggers must update DOORS and the test map together.

## 6. The world (docs/WORLD.md) — ClassMode.html:37-210, 330-362

| [ ] | Piece | Detail |
|---|---|---|
| [ ] | `YCW_ART` (:45-53) | registry of library pictures served from `/pics/<name>.webp`; number = side-by-side slices (`-1..-n`). ~80 names: ycb-* (paper, done tray, confetti, lock, subject icons, door icons, bucket back/front/glow, sparkles, clouds 1-4), ycw-k-* kingdom (sky, far, mid, near, hall, spring, terrace, gate, library, summit, nook, trail(4), birds, bridge), ycw-c-* city (sky, far, mid, near, square, skygate, canteen, market, arena, pavilion, workshop, calm, gondola), ycw-fx-* (cloudwall, rays, mist, trail), ycw-ui-* (plaque kingdom/city, ring, coin, star), ycw-ic-* (work, trail, profile, music, talk, tracks, games, detective, blocks, lab, library, calm). A name not listed -> painted CSS stand-in. |
| [ ] | `YCI(n)`, `YCP(n,cls)` | single img / multi-slice `.ycw-pic` (cover-fit via container queries 177.78cqh / 56.25cqw) |
| [ ] | `YCW_SCENES` (:56) | gate(-1,0), terrace(0,0), hall(1,0), spring(2,0), trail(3,0) in part `k`; city(2,1) part `c` |
| [ ] | `#ycworld` (:60-76) | fixed, `aria-hidden`, `pointer-events:none`, z-index 1 (29 on yc-home); layers sky/csky/cfar/cl(clouds)/far/mid/cmid/cnear/place/mist/birds/gondola/near/clouds(fx)/rays, each `data-d` depth |
| [ ] | camera loop `ycwLoop` (:78-90) | rAF always scheduled; writes only while flying (at rest returns; drift is CSS `ycAmb` 40 s / `ycDrift`); layers translate by remaining distance x depth, push-scale; cloud wall opacity; `--k`/`--c` kingdom/city mix |
| [ ] | `ycwGo(name,done)` (:92-100) | first visit or reduce motion: arrive instantly; else flight 2200 ms (2800 ms if changing height, i.e. to the city), birds (sideways) or gondola (up) animation, `SND.whoosh`; place picture fades in with slow Ken Burns (`ycwKen` 24 s) |
| [ ] | Flights used | hall <-> spring (period change), terrace on home, `city` before an opened door |
| [ ] | `body.yc-world` | `#ycworld` shown, `#app` transparent z 2, `#tl-tourhint` hidden |
| [ ] | **The Gate** `ycGate()` (:348-354) | after sid appears (sign-in) and `TL_MAP.grade>=2` and not `k1-home` (:389): `#ycgate` fixed z 2147483600, `pointer-events:none` (taps go through), starts only when gate images loaded (else after 1.5 s if any loaded, else removed quietly), 3.4 s fly-through + flash, removed at 3.6 s. Skipped on reduce motion or if `ycw-k-gate` not in YCW_ART. Uses `ycw-k-gate-doors` **which is not in YCW_ART**, so the door layer never shows. |
| [ ] | **Great Terrace home** (:357-362, every 600 ms) | conditions: not locked, `A.view==='hub'`, map is his (`TL_MAP.sid===A.st.id`), grade>=2, `body.gm-on.gm-home`, `GM.tab==='home'`, not `k1-home`, `ycw-k-terrace` in art -> `body.yc-home` + fly to terrace. CSS: `#ycworld` z 29, `#gm` transparent, **`#app{visibility:hidden}`**, `.gm-hi` white rounded card, dark h1. |
| [ ] | **Golden City behind places** `ycBg()`/`ycCityCss()` (:333-345, every 700 ms) | grade>=2, his map, not k1-home -> `body.yc-city`; background (3 slices + veil) on: `#cn-shop` canteen, `#tlstore.stov` market, `#ar-ov` arena (dark veil), `#mdx.on` pavilion, `.kkov` pavilion, `#bbx` / `#clab` workshop, `.bl-ov` Library Tower (kingdom), `.ohsheet` calm sky, `#gm-cel` **Summit** behind celebrations. Lessons excluded (lesson side owns its background). |
| [ ] | Reduce motion | `YCW.reduce` from `matchMedia` at load: no flights (instant arrive), no Gate, no confetti, no paper lift, door opens without flight; CSS `@media (prefers-reduced-motion)`: no ambient drift, no bob, no Ken Burns, no confetti layer. |
| [ ] | Still unused (WORLD.md) | trail, fortress, stops, bridge, waterfall, gondola as a ride, plaque-city, ring picture, nook (for lesson side) |
| [ ] | Screens on record | `docs/screens/classes-bucket/` (gate, home, teacher-time, flight, bucket, confetti; Chromebook + phone) |

## 7. Timers in ClassMode (K-1 "quiet page" budget applies)

| [ ] | Interval | What |
|---|---|---|
| [ ] | 700 ms | `doorCss()` (writes style only on change; `classList.toggle('yc-lock',L)`) |
| [ ] | 700 ms | yc-city on/off |
| [ ] | 600 ms | yc-home on/off |
| [ ] | 700 ms | sid watcher: sign out clears TMC + shows nothing; new sid -> Gate (grade>=2) and `pre()`/`check()` |
| [ ] | 5000 ms | class `until` passed offline -> clear lock, render, `check()` if it was a schedule period |
| [ ] | 25000 ms | `check()` (tmMine) |
| [ ] | rAF | `ycwLoop` (no writes at rest) |

## 8. K-1 (src/K1Only.html)

| [ ] | Rule | Detail |
|---|---|---|
| [ ] | Who (`K1O.on()`) | localStorage `tl-k1only` `'0'` off / `'1'` on (set by `?k1=1` / `?k1=0`); roster grade K(0)/1 from `klMe`; or a non-TEST boy whose map has every subject level <= 2 |
| [ ] | Grade for packs (`gradeNow`) | K1O.grade, else MATH level 2 -> grade 1, else 0 |
| [ ] | Packs | K: KL Math (`st.klm`, L01), KR ABC (`st.klr`, L01), KK Kriyah (`st.klk`, L01). G1: G1M (`st.g1m`, L02), G1R (`st.g1r`, L02), KK (`st.klk`, L02). Game ids filtered by `/\.L0{lv}\./`, in the pack's own `list()` order. Passed = score >= 2. Next game unlocks when the one before is passed; game 1 always open. |
| [ ] | Home `#k1o` | `role=main`, fixed inset 0, z 2147483000; top: 🔊 `data-k1=say`, "Hi, {first}!", `button.k1-out[data-act=signout]` "👋 Bye"; subject tabs `.k1-s[data-k1=subj]` (if >1); giant `.k1-play[data-k1=play]` "▶ PLAY"; path `.k1-t` tiles (`data-k1=play` or `locked`, `aria-disabled`), number = `TLK.pill(now/lock/prog)`, star when passed. Not from button kit except the pills. |
| [ ] | Whitelist | `body.k1-home > *:not(#k1o):not(#klov):not(#krov):not(#kkov):not(#kkov2):not(#g1mov):not(#g1rov){display:none!important}`; game overlays z 2147483600; `body.k1-home` overflow hidden. |
| [ ] | k1-mode hides | `#kpr, #jj-card, #jj-ctl, #tlstore, #gz-root, .gm-sheet, #gm-room` |
| [ ] | No pop-ups | wraps `welcome` (no-op), `tlLevelCheckFor` (null), `tlFindLevelCard` (''); `A.overlay=null` on every paint and every 1.2 s tick; re-hooks via `K1O.hook()` after all pieces load |
| [ ] | Game window | `play()` opens `window[pack].open(id)`; `dress()` prepends `GAME_VOICE` (speechSynthesis bridge to parent, `k1say`/`k1said`/`k1hush`/`k1ready`) + `GAME_CSS` (`<style id="k1fit">` full screen) to the iframe `srcdoc`; `shield()` "Here comes your game!" `.k1-wait` cover until `k1ready`; reload srcdoc at 10 s; "Try again" at 25 s |
| [ ] | Voice | teacher TTS at `tts-...run.app` with 1.5 s race, falls back to device voice |
| [ ] | K-1 lesson look | `.ob-K1` hides `.ob-why`, `.ob-meta`, `.obk-how`; zoom 1.3/1.5 on big screens (lesson side, but CSS lives here) |
| [ ] | Device memory | `tl-k1dev` '1'/'0' (Speed.js K-1 FIRST loads games first) |
| [ ] | Server side | `ycState_` returns null for grade < 2 (K-1 never locked); world/gate/terrace/city all require grade>=2 and not `k1-home` |

## 9. Tests that depend on shell selectors

### 9a. How tests/run.js runs the page (for running it)
| [ ] | Fact |
|---|---|
| [ ] | Command: `node tests/run.js` (needs `playwright` 1.56.1 + chromium: CI does `npm install --no-save playwright@1.56.1 && npx playwright install --with-deps chromium`). CI runs 2 machines `PART=1/2`, `PART=2/2`, 60-min timeout each. |
| [ ] | Options: `SAMPLE=40` lessons played (default 40), `PLAY=ID,prefix`, `ALL=1` (~2 h), `PAGES=4` side-by-side kid pages (default 4; `PAGES=1` = one page), `PART=k/n`, `UPDATE=1` rewrites baseline, `LANE=keser`. |
| [ ] | Page build: `tests/lib/build.js` `kid()` runs every `src/*.js` in a Node vm with Google stand-ins and calls `sgQuest_().getContent()`; add-ons come from `msQuestTools()` / `msQuestToolsParts([])`. |
| [ ] | Browser: `openPage()` (run.js:99-115): context 1366x768; init script `FAKE` replaces `google.script.run` with a Proxy (msBootstrap, msQuestTools(Parts), msSignInCode -> TEST-01, msLoad, msSave, soundLoad, pfHello; **every other call returns `null` after 20 ms**); a synthetic `wheel` every 30 s keeps the auto sign-out away; `pageerror` and `console.error` (except "Failed to load resource") are collected and FAIL the run; all network except `http://app.test/` and `/texts/*.json` is **aborted** (so `/pics/*.webp` never load in tests). |
| [ ] | Test boy: `A.st = loadStudent({id:'TEST-01',name:'Test Kid'}); A.view='hub'; SRV.token='t'; render()`; map tests set `window.TL_MAP = km.map` (from `tests/lib/kidmap.js`, server-made map of made-up TESTKM01, **grade null**). |
| [ ] | Timing run (4x CPU throttle): sign-in pad (digit buttons) within 90 s; `BANK_ALL>500` + `window.TLT` within 180 s; kid home `innerText>200` within 60 s; screenshot `tests/out/kid-home-phone.png` at 390x800. Each lesson page waits for BANK_ALL>500 then 20 s. |
| [ ] | Order in kidTests: timing run, k1fast (own page), v2 tests, Keser tests, lesson audit + sampled lessons, **map home block**, dailyplan.page, classesbucket.page, core.page (incl. corek1), writemin, latekinds, unitpieces, sciindex, onebite, teachpics, obquality, **k1home**, **warp3d**, **blockbuilders**, **chumashlab**, **uikit**, **oiltrail**, **jellytrail**, **storefx**. All on the same main page `pg`, sequentially, each resets `A`. Then staff page, then server-only libs (classesbucket server, dailyplan server, kidmap, canteen, ...). |

### 9b. tests/run.js map-home block (run.js:170-259)

| [ ] | Line | Selector / condition | Intent (replacement must still guarantee) |
|---|---|---|---|
| [ ] | 175-176 | Level-check card: `GM.world='MATH'; GM.sig=''`; `#gm`; click `.gm-hts [data-gmnav=map]`; read `.gm-goal h1`, `.gm-goal .m`, `.gm-l.now`; click `.gm-goal [data-gm=play]`; removes `#pf-cf` | map goal card exists |
| [ ] | 180-183 | h1 matches `/Level Check/`, `.m` contains `'then: ' + name`, node `/LEVEL CHECK/`; PLAY -> `A.view==='play' && A.play.id === map.subjects.MATH.now` | a level with its check waiting shows "🎫 Level Check · then: X"; PLAY leads into the lesson |
| [ ] | 186-187 | `GM.sid=''` (fresh sign-in lands on home); `body.gm-on` && `#gm` | boy with a map gets the game home |
| [ ] | 189-191 | `.gm-hts > .gm-ht` tiles: **n===6**; first has classes `work` + `now` and text `/DO THIS NOW/i`; all same width & height (rounded px); `.top` child height 44%-56% of tile; `.gm-hts .gm-ht.food[data-cno=open]` exists; no `#gm-nav button` or `#gm-nav` display none; **zero** other buttons in `#gm` except `.gm-ht`, `.gm-out > .tlk-quiet[data-gm=pfout]`, `.gm-out > .tlk-tool[data-gm=pftour]`; exactly **1** `.gm-hi .gm-out > .tlk-quiet[data-gm=pfout]` and **1** `.gm-hi .gm-out > .tlk-tool[data-gm=pftour]` | home = 6 equal tiles, icon top half, My work DO THIS NOW first, Canteen tile, no tab bar, one kit Sign out, one round tour lightbulb, nothing else |
| [ ] | 194-199 | click `.gm-ht.food` -> `#cn-shop.cw3d`; `.cw-room` computed `pointer-events:none`; `.cw-door` `data-p` order **`buy,cash,story,learn`**; clicking cash/story/learn/buy each makes that `.cw-door.on` (panels string `cashstorylearnbuy`); learn shows >=5 `[data-cno=lesson][data-c=LIFE]`; `[data-cno=close]` removes `#cn-shop` and `body.cn-open` | 3D canteen room with 4 doors that each open, money lessons listed, Home closes |
| [ ] | 200 | nav helper: `#gm .tlk-home[data-gmnav=home]` then `.gm-hts [data-gmnav=<t>]` | every page reached from home tiles; house returns home |
| [ ] | 202 | after `go('map')`: `body.gm-lite`, **not** `body.w3d`, `#gm` backgroundImage contains `255, 247, 214` | map is the bright page (no 3D galaxy) |
| [ ] | 203 | `.gm-goal h1` == next level name; `.gm-goal .learn` contains skill text; `.gm-n` count >0; exactly 1 `.gm-n.boss` | map shows goal now, real skill, path with one BOSS |
| [ ] | 205-206 | exactly **1** `.gm-hud .tlk-pill.tlk-money`; **0** `.gm-hud [data-gmnav=money], .gm-hud .gm-money`; no `.tlk-pill,.tlk-box` (outside a button) with shadow, border or pointer cursor | money by the house is one flat kit pill, not a button; info never looks like a button |
| [ ] | 207 | exactly **1** `.tlk-home[data-gmnav=home]` in `#gm`, its rect `left<220 && top<90`, no `#gm-nav button`; exactly **1** `.gm-play`; **0** `[data-gm=world]` on map | one kit house top-left on every non-home page; map has one PLAY and no subject tabs |
| [ ] | 208-209 | `[data-gmnav=subjects]` -> `[data-gm=world][data-k="K:CHU"]` -> `.gm-goal h1` == Chumash goal; locked `.gm-n.u` click -> `.gm-pop` or `.gm-toast` text `/Locked/`; back to MATH via subjects | Change subject works; Chumash goal; locked level says so |
| [ ] | 210-211 | `go('more')`: `.pr-title` == "My profile"; `.pr-lv` count == subjects+kodesh count; **8** `.pr-b`; `.tlk-quiet[data-gm=pfout]`; `.pr-tile[data-gm=lib]`; `.pr-tile` >= 6 | profile page: level row per subject, 8 badges, Sign out, All my lessons, old doors as tiles |
| [ ] | 212-214 | `[data-gm=pfav]` -> `#pr-pick [data-gm=pfavk]` count **16**; click 3rd -> `A.st.av` set, `.pr-bav` == av, `#pr-pick` gone; home -> `#pr-av` text == av, `.gm-ht.things b` == "My profile", `.gm-ht.things .pr-tav` == av | 16 avatars; pick kept and shown on page, home tile, floating circle by Workbook |
| [ ] | 216-217 | on profile no `[data-gm=gmback]`; `.pr-tile[data-gm=lib]` -> `.tlk-back[data-gm=gmback]` exists, click -> `GM.tab==='more'` | Back from a page opened from My profile returns to it; profile (from home) has none |
| [ ] | 218 | `[data-gm=lib]` -> `GM.tab==='lib'` && `body.gm-on` | All lessons is a game screen |
| [ ] | 219 | `go('games')` -> none of `body.hf-games/hf-lib/hf-mine` | no old-style door pages |
| [ ] | 221 | `go('missions')`: **3** `.gm-rd:not(.final):not(.rebbe)`, **1** `.gm-rd.live` | My work with no list: 3 rounds, one live |
| [ ] | 222 | `go('games')`: `.gm-lock` exists and `body.gm-on` | Arcade locked until rounds cleared |
| [ ] | 224 | map `[data-gm=play]` -> `A.view==='play'`, `A.play.id === MATH.now`; then **not** `body.gm-on` and not `body.gm-nav` | PLAY starts his goal; shell steps away during lesson |
| [ ] | 225 | `TL_MAP=null`, TEST-01: `body.gm-on` && `#gm .gm-none` | no map -> "Your map is almost ready" game screen, never the old home |
| [ ] | 240 | fail message: "6 equal tiles, icon on the top half, My work · DO THIS NOW first, a Canteen tile that opens the canteen, no tab bar, ONE kit Sign out (HoS 2026-11-25), ONE round lightbulb (HoS 2026-11-26) and no other buttons" | |
| [ ] | 245 | "every page but the home has ONE kit house top left and no HOME bar" | |
| [ ] | 246 | "the map has ONE big PLAY and no subject tabs" | |

Globals the block relies on: `GM.world`, `GM.sid`, `GM.sig`, `GM.tab` ('home','map','more','lib','missions','games'), `window.TL_MAP`, `loadStudent`, `render`, body classes `gm-on`, `gm-home`, `gm-lite`, `gm-nav`, `w3d`, `cn-open`, `hf-*`.

### 9c. tests/lib/dailyplan.js `page(pg,map)` (lines 103-138; run.js:256)
| [ ] | Selector / condition | Intent |
|---|---|---|
| [ ] | sets `window.TL_TDL.by[sid]` list (5 items, total 6), `GM.sid=''`, same nav helper (`#gm .tlk-home[data-gmnav=home]`, `.gm-hts [data-gmnav=..]`) | |
| [ ] | home `.gm-hi p` text matches `/0 of 6 done today/` | home line shows today's progress |
| [ ] | missions: **6** `.gm-rd:not(.final):not(.rebbe)`, **1** `.gm-rd.live`; `.gm-marq` has `TODAY'S LIST` and `0 of 6 done`; first `.gm-rd.live` `data-id` == READ.now; `.gm-rd[data-id]` with text READING: 2 distinct ids; `.gm-cta .gm-play` text `/Next/`; no `/minute|timer|⏱/i` in `#gm` | My work: one row per list item, core first, one Next, no timers |
| [ ] | games: `.gm-lock` text `/6 more things on today's list/` | Arcade locked until list done, says why |
| [ ] | after mastering (`GM.sig=''`): `.gm-marq h1` `/1 of 6 done/`, **1** `.gm-rd.won` | done shows at once |
| [ ] | list complete: `.gm-marq` `/All done/`, games has no `.gm-lock` | all done opens Arcade |
| [ ] | no list: 3 rounds | old behaviour kept |

### 9d. tests/lib/classesbucket.js `page(pg)` (lines 213-276; run.js:257) — Teacher Time + airtight lock
| [ ] | Selector / condition | Intent |
|---|---|---|
| [ ] | stubs `google.script.run.tmMine` to return `window.__ycR` (T1 lock with 1 READ skill, next T2 1:55) | |
| [ ] | `.ycw` appears within 6 s of `render()`; first `.ycw .tlk-pill` text `/Teacher Time 1/i` | Teacher Time screen with period name |
| [ ] | in `.ycw`: exactly **1** `button.tlk.tlk-tile`, exactly **1** `button.tlk.tlk-main`, **0** buttons without class `tlk` | only the button kit on the class screen (1 paper, 1 Start) |
| [ ] | `.ycw` text `/Next: Teacher Time 2 at 1:55/` | says what is next |
| [ ] | `startMission('READ', otherId,'skill')` does not start it | another lesson cannot start |
| [ ] | click `.ycw .tlk-main` -> (meant to check) `A.view==='play' && A.play.id===ids[0]` | Start opens his class lesson (**see surprise 1: not actually asserted**) |
| [ ] | appends + clicks synthetic buttons with: canteen `data-cno=open`, store `data-st=open data-t=fun`, arena `data-aropen=1`, games `data-mdopen=1`, library `data-bl-open=1`, torah `data-tj=pass`, music `data-act=mubtn`, talk `data-tr=open`, profile `data-gmnav=more`, map `data-gmnav=map`, work `data-gmnav=missions`, other `data-hp=levels`; a bubbling document listener must hear **none** | airtight: no part of the app hears a tap during class |
| [ ] | none of `#cn-shop,#tlstore,#ar-ov,#mdx,#bl-ov` visible (`offsetParent!==null`) | nothing else opens |
| [ ] | `#ohsky` absent or `display:none` | floating Olam Haba cloud hidden in class |
| [ ] | lock with `doors:['canteen']` -> `.ycw [data-ycdoor="canteen"]` appears; clicking canteen + store triggers -> heard exactly `["canteen"]` | a rule opens only that door, with a tile |
| [ ] | `{open:true, closed:['store']}` (no lock) after 2.5 s: store+arena+map clicked -> heard exactly `["arena","map"]`; no `.ycw` | take-away shuts that door outside class; rest opens |
| [ ] | `__ycR=null`: `.ycw` gone within 4.5 s | home back when schedule lets go |

Server part (lines 12-211, run.js:343): walks a made-up afternoon via `ycNow_`; 100+ asserts on `tmMine` shapes (`yc.k`, `skills`, `until`, `yc.next.show`, `by`, `clsName`, `bucket.total/done/complete/core[i].done`, `handed`, `doors`, `closed`, `open`), switch off/test/on, K-1 excluded, overrides, sheets, rules (`ycSaveRule`), take-aways (`ycTakeAway`/`ycGiveBack`), `ycAccess().doors` includes `all`, rule cannot open `torah`. **Not shell-dependent**, but the page must keep consuming exactly these fields.

### 9e. tests/lib/k1home.js (whole file, run.js:278; also run from k1fast.js after full load)
| [ ] | Line | Selector / condition | Intent |
|---|---|---|---|
| [ ] | 14 | `window.K1O` exists | K1Only loaded |
| [ ] | 17-19 | `localStorage tl-k1only='1'`, `A.st=loadStudent({id:'KCHECK-01'})`, `K1O.grade=0`, `K1O.subj='MATH'`, `render()`, `welcome()` | |
| [ ] | 21-22 | after 400 ms: `#k1o` exists and `body.k1-home` | K boy's home is the game path |
| [ ] | 24 | `document.elementFromPoint` at centre, (W-20,20), (20,H-20) is inside `#k1o` | nothing else on screen (no pop-up, map, tabs, store) |
| [ ] | 25-29 | `#k1o .k1-t` `data-id` list === `KL.list()` ids matching `/\.L01\./` in order; all `.L01.`; `.k1-t.lock` count === tiles-1 | only K games, pack's skill order, game 1 open rest locked |
| [ ] | 30 | `#k1o` innerText has no `/\bbites?\b/i` | never "bite" |
| [ ] | 31-38 | `.k1-play` click -> one of `#klov,#krov,#kkov,#kkov2,#g1mov,#g1rov` exists, not `display:none`; its iframe `srcdoc` contains `id="k1fit"` and `k1say` | PLAY opens a real game full screen with the voice bridge |
| [ ] | 40-42 | `.k1-wait` cover present, gone within 15 s | never a white game window |
| [ ] | 45 | waits up to 8 s for `#ohsky .rise, .ohp, .hlring` to finish | |
| [ ] | 47-49 | MutationObserver on `documentElement` (subtree, childList, attributes, characterData) for **3 s**: mutations whose target is outside `#k1o,#klov,#krov,#kkov,#kkov2,#g1mov,#g1rov` must be **<= 15** | the hidden big-boy page stays quiet behind a K game (any shell timer that writes DOM/attrs/classes counts) |
| [ ] | 52-59 | for MATH/READ/LK (`st.klm/klr/klk`): setting game 1 score 3 unlocks `.k1-t[data-id=game2]` | passing game 1 opens game 2 (each pack's own save key) |
| [ ] | 61-63 | `K1O.grade=1`: all `#k1o .k1-t` ids match `/\.L02\./` | Grade 1 sees only Grade 1 games |

`tests/lib/k1fast.js` (run.js:129): own page with `tl-k1fast`, `tl-k1dev`, `tl-k1only`='1'; `#k1o .k1-play` must appear within **8 s** of page open; after full load reruns k1home; `BANK_ALL` >= 1000. Intent: K-1 Chromebook shows PLAY fast.
`tests/lib/corek1.js` (via core.js:146): `#k1o .k1-t` order (new game sits right after its "after" game, locked), game cover `#k1cov` uses kit only (`.tlk-main` <= 1, no non-`tlk` buttons outside `.obk`), no sideways scroll, tap targets >= 44 px.

### 9f. Other test libs touching the shell
| [ ] | File:line | Selectors / conditions | Intent |
|---|---|---|---|
| [ ] | `blockbuilders.js:13,84-90` | sets `window.__bbKM`; for each boy: `TL_MAP` with MATH level, `GM.world='MATH'; GM.tab='map'; GM.sig=''; render()`, wait 1 s, `#bbx-door` exists? Must be: TESTKM01 (lvl5) **yes**, MADEUP-9 (lvl6) **no**, MADEUP-3 (lvl3) **yes** | workbook 📘 door shows on the Math map for TEST- boys and Math levels 2-4 only |
| [ ] | `blockbuilders.js:38-81` | `#bbx`, `#bbx-sc` (no sideways scroll), `#bbx [data-bb=...]`, `#bbx-pad`, `#bbx-paper` | workbook itself (place, not shell frame) |
| [ ] | `chumashlab.js:23,125-127,139` | `window.__clKM`; `TL_MAP` with `grade`, `GM.sid=''; GM.tab='home'; GM.sig=''`, wait 900 ms, `#clab-door` exists: grade 5 **yes**, TEST-CL2 grade 1 **yes**, MADEUP-G1 grade 1 **no** | Chumash Lab door: grade 5 and TEST boys, never grade 1 (note: grade 5 render turns on yc-home/yc-city here) |
| [ ] | `chumashlab.js:37-43,122,132-147` | `#clab`, `.clab-top .tlk-home` (house), no `.clab-top .tlk-x` on lab home, `[data-lab]` count 6, `.clab-top .tlk-x` on question screens, all buttons `tlk`/`tw`/`gap`, no sideways scroll at 390 px | lab is kit-only; house on hub, X in a run |
| [ ] | `uikit.js:15-17` | `#tlk-css` must exist and come **before** `#hp-css` (HomePage.html style) in document order | the kit loads before every other part (if `#hp-css` disappears this check silently passes) |
| [ ] | `uikit.js:20-76` | draws kit in a `#tlk-test` host and inside `.foot` (QuestPage link-style footer): MAIN gold `rgb(251,191,36)` + shadow + pointer; QUIET white + border; X/house/back 44 px round, icon centred +-0.5 px, no words; pills/boxes flat, never gold/white/purple `rgb(91,63,208)`, one colour per meaning; K-3 Home/Back 52 px with word; `TLK.young(0..3)` true, 4 false; `ask` = 1 main + 1 quiet "Not now", no X | the button system (any kit restyle for the world must still pass these measurements) |
| [ ] | `warp3d.js:12-24` | `A.view='signin'`: `body.w3d` + `body.w3d-si` + `#w3d` visible + `pointer-events:none`; `.sg5keys button[data-act=pin]` data-n 0-9; `.sg5keys [data-act=del]`; `[data-act=signin]`; in a lesson `body.w3d` off; `window.TL_W3D=false` turns it off | 3D sign-in layer never catches taps, keypad intact, off in lessons, off switch |
| [ ] | `oiltrail.js` | `window.TL_OIL`, `tlOilOn`, `tlOilTapOn`, `bladeOn`, `#tl-oil` + 2 canvases `pointer-events:none`; `data-no-oil` on touched canvas; `HP_FX` tap splash nodes class `^(hpsplash|hpdot|hpem)` on body: swipe fires none, tap fires; olive per tap incl. on buttons (button still clicks), never in a textarea | seasonal trail never blocks taps; HomePlus tap splash rules |
| [ ] | `jellytrail.js` | `TL_JELLY`, `tlJellyOn/TapOn`, `#tl-jelly` canvases pass clicks, `data-no-jelly`, `A.st.store.wear.trail='hol-jelly'` | store trail item never blocks taps |
| [ ] | `storefx.js` | `src/Store.js` `STORE.ITEMS` fun items (names/emoji unique); `window.TL_STORE_FX` (`tapOf`, `trailOf`, `pvStatic` with `class="pvrb"`, `COLORS`, colour distance >= 30) | store effect tables stay on window from StoreKid.html |
| [ ] | `onebite.js`, `corereadkinds.js` | everything under `#app` (`.ob-dots li`, `.ob-foot .ob-go`, `.ob-done`, `.ob-pay`, `.ob-party`, `[data-ob=...]`, `#crd`) | lesson side; shell must keep `#app` (seam) |
| [ ] | `screens.js` (manual harness, not in run.js) | same FAKE, 390x844, map boy | for screenshots ("see it as a boy") |

## 10. Surprises / risks found

1. **"Start opens his class lesson" is not really tested.** In `tests/lib/classesbucket.js` page part, `o.opened` is set to a boolean (line 233) and then **overwritten** with an array of visible overlays (line 241). `chk(o.opened, 'Start opens his class lesson')` (line 268) then passes for any array, even `[]`. A rebuild that breaks Start would not fail the kit. (`o.signOutOk` is also `|| true`, never checked.)
2. **The world is almost untested.** Network to `/pics/*` is aborted in tests, and the shared test map (`kidmap.js` TESTKM01) has `grade: null`, so the Gate, the Great Terrace home (`yc-home`, which sets `#app{visibility:hidden}`) and the Golden City backgrounds (`yc-city`) never switch on in the map-home block. Only the chumashlab door check briefly renders a grade-5 home. The 6-tile home asserts run **without** the world.
3. `ycGate` uses `ycw-k-gate-doors`, which is **not** in `YCW_ART`, so the opening-doors layer never shows.
4. `DOORS.store.sel` includes `[data-gmnav="store"]`, which nothing in `src/` emits (stale).
5. The old live-class screens (`.tmc .go`, `.tml`) are hand-drawn buttons, not from the button kit (breaks the "button system" rule; the test only checks the `.ycw` screen).
6. `olamhaba` can be opened by a rule but has no `go`, so it never gets a tile on the class screen; it only becomes unhidden.
7. The lock is page-side for lessons; while a lesson is open (`A.view` play/result) the guard lets **every** tap through (not just the lesson's own buttons).
8. ClassMode wraps `startMission` and `render` (shared seam functions) and must stay loaded after the pieces it wraps; K1Only re-wraps `render` again last. Any shell rebuild that replaces `render` must keep both wrappers working, or re-host them.
9. `uikit.js` "kit loads first" only compares against `#hp-css`; if HomePage's style id changes, that guarantee silently stops being checked.
10. The K-1 quiet check counts **attribute** mutations too: any new shell interval that toggles a class or style on `body`/`html` while a K-1 game is open can exceed the 15-in-3-s budget.
