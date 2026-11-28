# Shell overhaul: the five workstream prompts (2026-11-27)

Here are the five prompts. Paste each one into a different Claude account (Claude Code on the web, repository tashbar-baltimore/tashbar-app). They can all start right away.

============================================================
PROMPT A
============================================================
You are building ONE workstream of the Tashbar 1.0 boys' app SHELL OVERHAUL (repository tashbar-baltimore/tashbar-app). Several Claude accounts are building it at the same time, each in its own files. This session is for Esti (staff); Rabbi Khaver (Head of School) approves the whole plan. Talk to Esti in short, plain language and ask her only real decisions.

WHAT WAS ASKED, in their words: "Delete all the old layers and build a new, simple, quick, upgraded one. The code can be upgraded too; the features and functions must remain. Cleaner and calmer, but very exciting and inspiring, with incredible pictures, immersive 3D-like pictures and movement."
One line to check every piece against: every feature a boy has today still works, inside one clean new shell that looks and moves like the Mountain Kingdom (work) and the Golden City in the Clouds (free time).

START:
1. git fetch origin. If origin/main already has src/ShellKit.html, branch from origin/main; otherwise branch from origin/esti/shell-overhaul-1 (the lead session's branch with the kit; it merges first). Your branch: esti/shell-money.
2. Read, in this order (all binding): CLAUDE.md, CONTRIBUTING.md, docs/SHELL-CONTRACT.md (WHO OWNS WHAT and HOW A PLACE IS BUILT — follow it exactly), your rows in docs/SHELL-OVERHAUL.md (named below), docs/BUTTON-SYSTEM.md, docs/WORLD.md, docs/SHELL-AND-LESSONS.md, art/README.md, src/ShellKit.html.
3. Before building, play today's version of each of your places as a made-up boy (tools/screens/*.js, tests/lib/screens.js) so you know every function you must keep.

YOUR WORKSTREAM: A — his money. Places: `bank` (My money, in the Treasury vault; kingdom; door store; scene ycw-k-vault; icon ycw-ic-bank) and `store` (the Grand Market; city; door store; scene ycw-c-market; icon ycb-ic-store).
Your rows in docs/SHELL-OVERHAUL.md: Part B "2. Store" and "3. Bank / My money", plus the money rows in Part A (the cash badge, payday, the paycheck receipt).
Keep every function: the store's 6 tabs (Fun, Real prizes, Canteen Cards, Give, My stuff, My week), buying with TLK.ask (stInfo, stBuy), the savings goal, the paycheck receipt after a lesson and Thursday/Friday payday, the money page (balance, Spend/Save/Give/Canteen, the money story by week or everything), the bank statement, the deposit slip, the $1,000 Club (the server re-checks it), and the store items' effects (olive-oil trail, jelly trail, HomePlus effects): tests/lib/oiltrail.js, jellytrail.js and storefx.js must keep passing.
Fix: today the home's "Store" tile opens My money; now they are two places, and the Store is reachable from My money too.

THE RULES THAT MATTER MOST:
- Edit ONLY: src/ShMoney.html, tests/lib/shell-money.js, docs/screens/shell/<your place ids>/, and the checklist rows for your places in docs/SHELL-OVERHAUL.md. Never edit src/ShellKit.html, src/UiKit.html, src/ClassMode.html, src/GameMap.html, src/Photos.js, src/Speed.js, tests/run.js, another workstream's file, any lesson file or pack, the server's money/progress code, or staff screens. Need something there? Open a GitHub issue "SHELL-KIT: <what you need>" and carry on with the rest.
- Do NOT delete or change the old screens; the lead session deletes them in the last step, once your rows are ticked.
- Rebuild each screen FRESH in your file (cleaner, calmer, inspiring), with the same functions and the same server calls as today. Big inner game engines may be moved into your file and cleaned up instead of rewritten from zero, as long as the old file can be deleted later. Call the server with SHK.call(...). The server sets every money amount: show what it sends, never compute money.
- Lessons open only with SHK.openLesson(skillId). Buttons ONLY from the kit (window.TLK): at most one main per screen, quiet for other choices, TLK.ask for "Buy this?"-type questions, pills/boxes for information, tlk-tile for cards. Full pages: the house top left (SHK.page). Pop-ups: one round x top right (SHK.pop). Words as in docs/BUTTON-SYSTEM.md ("My money", "canteen money").
- Grade 2 and up only (SHK.on()); K-1 keep their games, never show them anything. Nothing drawn by script at rest (CSS movement only; no timers that change the page or toggle body classes).
- Pictures: use the scene and icon names in docs/SHELL-CONTRACT.md (pictures on order YCB-4 show the world's sky and mountains until they arrive; that is fine). Need a picture nobody ordered? Open a "SHELL-KIT: picture <name>" issue with the screen, size and exact prompt. Never write the Head of School's email address anywhere. Picture rules: docs/HANDOFF-PICS.md.
- No real student names, codes or data anywhere (made-up TEST boys only).

YOUR TEST (tests/lib/shell-money.js): open each of your places with SHK.go(id), use every function with made-up server answers (copy the google.script.run proxy from tests/lib/classesbucket.js page()), check: only kit buttons, one house top left or one x top right, the words, that the right server call was made with the right arguments, and that a lesson opens through SHK.openLesson. Restore the page at the end. tests/run.js runs it automatically. Never weaken any other test or the quality gate.

FINISH:
- PAGES=1 node tests/run.js alone (about 50 minutes; give it a 2-hour timeout) must pass. Merge origin/main into your branch first; other builders push often.
- See it as a boy: node tools/screens/shell.js /tmp/shots after 5 <ids> and again with grade 3 (both sizes come out: 1366x768 and 390x844). Use SETUP='...' for made-up money or answers so screens are not empty. LOOK at every picture, fix what looks wrong, save them in docs/screens/shell/<id>/.
- Open ONE pull request "New shell A: <places>" with: what the boy sees, the pictures, your ticked rows, test timings, and anything you found broken today. It goes live by itself when the test check passes (your places reach boys only once the new home shows their tiles, so this is safe). If it fails, fix it on the same branch.
- Tell Esti in one plain line what went live.

============================================================
PROMPT B
============================================================
You are building ONE workstream of the Tashbar 1.0 boys' app SHELL OVERHAUL (repository tashbar-baltimore/tashbar-app). Several Claude accounts are building it at the same time, each in its own files. This session is for Esti (staff); Rabbi Khaver (Head of School) approves the whole plan. Talk to Esti in short, plain language and ask her only real decisions.

WHAT WAS ASKED, in their words: "Delete all the old layers and build a new, simple, quick, upgraded one. The code can be upgraded too; the features and functions must remain. Cleaner and calmer, but very exciting and inspiring, with incredible pictures, immersive 3D-like pictures and movement."
One line to check every piece against: every feature a boy has today still works, inside one clean new shell that looks and moves like the Mountain Kingdom (work) and the Golden City in the Clouds (free time).

START:
1. git fetch origin. If origin/main already has src/ShellKit.html, branch from origin/main; otherwise branch from origin/esti/shell-overhaul-1 (the lead session's branch with the kit; it merges first). Your branch: esti/shell-profile.
2. Read, in this order (all binding): CLAUDE.md, CONTRIBUTING.md, docs/SHELL-CONTRACT.md (WHO OWNS WHAT and HOW A PLACE IS BUILT — follow it exactly), your rows in docs/SHELL-OVERHAUL.md (named below), docs/BUTTON-SYSTEM.md, docs/WORLD.md, docs/SHELL-AND-LESSONS.md, art/README.md, src/ShellKit.html.
3. Before building, play today's version of each of your places as a made-up boy (tools/screens/*.js, tests/lib/screens.js) so you know every function you must keep.

YOUR WORKSTREAM: B — who he is. Places: `profile` (his room; kingdom; door profile; scene ycw-k-room; icon ycw-ic-profile), `trophies` (the Trophy Hall; kingdom; door profile; scene ycw-k-trophies; icon ycw-ic-trophy), `passport` (Torah Tracks and his passport; kingdom; door torah; scene ycw-k-library until a better one; icon ycw-ic-passport).
Your rows in docs/SHELL-OVERHAUL.md: Part B "4. Trophies", "5. My profile" and "17. Torah Tracks, Passport, Taryag Quest, Torah Plus, Chumash page", and the GameMap me/more rows in Part A.
Keep every function: his picture (16 to pick, saved with saveStudent; it shows on the page, the home tile and everywhere it shows today), settings, a level row per subject, the 8 badges, rank, XP, this week vs last week, what I learned, All my lessons, Skill tree, My week (with the round Back returning to My profile, as today), the button tour, Torah Tracks with the passport stamps, Taryag Quest, Torah Plus (Shabbos/Yom Tov, davening, Parsha), the Chumash page (chmParsha). Your test must guarantee everything the tests/run.js profile block guarantees today (16 pictures, 8 badges, Back returns to My profile, his picture kept), for the new places.

THE RULES THAT MATTER MOST:
- Edit ONLY: src/ShProfile.html, tests/lib/shell-profile.js, docs/screens/shell/<your place ids>/, and the checklist rows for your places in docs/SHELL-OVERHAUL.md. Never edit src/ShellKit.html, src/UiKit.html, src/ClassMode.html, src/GameMap.html, src/Photos.js, src/Speed.js, tests/run.js, another workstream's file, any lesson file or pack, the server's money/progress code, or staff screens. Need something there? Open a GitHub issue "SHELL-KIT: <what you need>" and carry on with the rest.
- Do NOT delete or change the old screens; the lead session deletes them in the last step, once your rows are ticked.
- Rebuild each screen FRESH in your file (cleaner, calmer, inspiring), with the same functions and the same server calls as today. Big inner game engines may be moved into your file and cleaned up instead of rewritten from zero, as long as the old file can be deleted later. Call the server with SHK.call(...). The server sets every money amount: show what it sends, never compute money.
- Lessons open only with SHK.openLesson(skillId). Buttons ONLY from the kit (window.TLK): at most one main per screen, quiet for other choices, TLK.ask for "Buy this?"-type questions, pills/boxes for information, tlk-tile for cards. Full pages: the house top left (SHK.page). Pop-ups: one round x top right (SHK.pop). Words as in docs/BUTTON-SYSTEM.md ("My money", "canteen money").
- Grade 2 and up only (SHK.on()); K-1 keep their games, never show them anything. Nothing drawn by script at rest (CSS movement only; no timers that change the page or toggle body classes).
- Pictures: use the scene and icon names in docs/SHELL-CONTRACT.md (pictures on order YCB-4 show the world's sky and mountains until they arrive; that is fine). Need a picture nobody ordered? Open a "SHELL-KIT: picture <name>" issue with the screen, size and exact prompt. Never write the Head of School's email address anywhere. Picture rules: docs/HANDOFF-PICS.md.
- No real student names, codes or data anywhere (made-up TEST boys only).

YOUR TEST (tests/lib/shell-profile.js): open each of your places with SHK.go(id), use every function with made-up server answers (copy the google.script.run proxy from tests/lib/classesbucket.js page()), check: only kit buttons, one house top left or one x top right, the words, that the right server call was made with the right arguments, and that a lesson opens through SHK.openLesson. Restore the page at the end. tests/run.js runs it automatically. Never weaken any other test or the quality gate.

FINISH:
- PAGES=1 node tests/run.js alone (about 50 minutes; give it a 2-hour timeout) must pass. Merge origin/main into your branch first; other builders push often.
- See it as a boy: node tools/screens/shell.js /tmp/shots after 5 <ids> and again with grade 3 (both sizes come out: 1366x768 and 390x844). Use SETUP='...' for made-up money or answers so screens are not empty. LOOK at every picture, fix what looks wrong, save them in docs/screens/shell/<id>/.
- Open ONE pull request "New shell B: <places>" with: what the boy sees, the pictures, your ticked rows, test timings, and anything you found broken today. It goes live by itself when the test check passes (your places reach boys only once the new home shows their tiles, so this is safe). If it fails, fix it on the same branch.
- Tell Esti in one plain line what went live.

============================================================
PROMPT C
============================================================
You are building ONE workstream of the Tashbar 1.0 boys' app SHELL OVERHAUL (repository tashbar-baltimore/tashbar-app). Several Claude accounts are building it at the same time, each in its own files. This session is for Esti (staff); Rabbi Khaver (Head of School) approves the whole plan. Talk to Esti in short, plain language and ask her only real decisions.

WHAT WAS ASKED, in their words: "Delete all the old layers and build a new, simple, quick, upgraded one. The code can be upgraded too; the features and functions must remain. Cleaner and calmer, but very exciting and inspiring, with incredible pictures, immersive 3D-like pictures and movement."
One line to check every piece against: every feature a boy has today still works, inside one clean new shell that looks and moves like the Mountain Kingdom (work) and the Golden City in the Clouds (free time).

START:
1. git fetch origin. If origin/main already has src/ShellKit.html, branch from origin/main; otherwise branch from origin/esti/shell-overhaul-1 (the lead session's branch with the kit; it merges first). Your branch: esti/shell-work.
2. Read, in this order (all binding): CLAUDE.md, CONTRIBUTING.md, docs/SHELL-CONTRACT.md (WHO OWNS WHAT and HOW A PLACE IS BUILT — follow it exactly), your rows in docs/SHELL-OVERHAUL.md (named below), docs/BUTTON-SYSTEM.md, docs/WORLD.md, docs/SHELL-AND-LESSONS.md, art/README.md, src/ShellKit.html.
3. Before building, play today's version of each of your places as a made-up boy (tools/screens/*.js, tests/lib/screens.js) so you know every function you must keep.

YOUR WORKSTREAM: C — his work and his way up the mountain. Places: `work` (My work, in the study loft; kingdom; no door; scene ycw-k-study; icon ycw-ic-work) and `map` (the Trail up the mountain: his map and levels; kingdom; no door; scene ycw-k-trail with ycw-k-stop / ycw-k-fortress; icon ycw-ic-trail). Also set SHK.subjects = function returning his subjects and level panels (in your own file): the clean list that replaces the tlFindLevelCard chain (Part A section 4 lists all 32 panels; keep every one that a boy can reach today).
Your rows in docs/SHELL-OVERHAUL.md: Part A "4. tlFindLevelCard", the GameMap map/subjects/missions rows in "5.", "6. Today's work feeds", "7. Opening lessons", and Part B "6. My work".
Keep every function: DO THIS NOW (the next thing to do, first), the 3 rounds, Today's list from grade 2 (tdlToday), Today's path for TEST- boys (pfdToday), rebbe picks and shout-outs (sgMyDesk, sgShoutSeen), Find my levels, the subject levels, the boss levels and unit checks, Play (SHK.openLesson), and the server calls that today only run because the hidden old home is drawn (sgMyDesk, msSchoolGoal, tdlToday after a save, pfdToday): call the ones your places need yourself. How lessons are organized (map, order, mastery, kmMyMap / TL_MAP) does NOT change. Your test must guarantee what tests/lib/dailyplan.js and the run.js map checks guarantee today (one Play on the map page, 3 rounds, DO THIS NOW first).

THE RULES THAT MATTER MOST:
- Edit ONLY: src/ShWork.html, tests/lib/shell-work.js, docs/screens/shell/<your place ids>/, and the checklist rows for your places in docs/SHELL-OVERHAUL.md. Never edit src/ShellKit.html, src/UiKit.html, src/ClassMode.html, src/GameMap.html, src/Photos.js, src/Speed.js, tests/run.js, another workstream's file, any lesson file or pack, the server's money/progress code, or staff screens. Need something there? Open a GitHub issue "SHELL-KIT: <what you need>" and carry on with the rest.
- Do NOT delete or change the old screens; the lead session deletes them in the last step, once your rows are ticked.
- Rebuild each screen FRESH in your file (cleaner, calmer, inspiring), with the same functions and the same server calls as today. Big inner game engines may be moved into your file and cleaned up instead of rewritten from zero, as long as the old file can be deleted later. Call the server with SHK.call(...). The server sets every money amount: show what it sends, never compute money.
- Lessons open only with SHK.openLesson(skillId). Buttons ONLY from the kit (window.TLK): at most one main per screen, quiet for other choices, TLK.ask for "Buy this?"-type questions, pills/boxes for information, tlk-tile for cards. Full pages: the house top left (SHK.page). Pop-ups: one round x top right (SHK.pop). Words as in docs/BUTTON-SYSTEM.md ("My money", "canteen money").
- Grade 2 and up only (SHK.on()); K-1 keep their games, never show them anything. Nothing drawn by script at rest (CSS movement only; no timers that change the page or toggle body classes).
- Pictures: use the scene and icon names in docs/SHELL-CONTRACT.md (pictures on order YCB-4 show the world's sky and mountains until they arrive; that is fine). Need a picture nobody ordered? Open a "SHELL-KIT: picture <name>" issue with the screen, size and exact prompt. Never write the Head of School's email address anywhere. Picture rules: docs/HANDOFF-PICS.md.
- No real student names, codes or data anywhere (made-up TEST boys only).

YOUR TEST (tests/lib/shell-work.js): open each of your places with SHK.go(id), use every function with made-up server answers (copy the google.script.run proxy from tests/lib/classesbucket.js page()), check: only kit buttons, one house top left or one x top right, the words, that the right server call was made with the right arguments, and that a lesson opens through SHK.openLesson. Restore the page at the end. tests/run.js runs it automatically. Never weaken any other test or the quality gate.

FINISH:
- PAGES=1 node tests/run.js alone (about 50 minutes; give it a 2-hour timeout) must pass. Merge origin/main into your branch first; other builders push often.
- See it as a boy: node tools/screens/shell.js /tmp/shots after 5 <ids> and again with grade 3 (both sizes come out: 1366x768 and 390x844). Use SETUP='...' for made-up money or answers so screens are not empty. LOOK at every picture, fix what looks wrong, save them in docs/screens/shell/<id>/.
- Open ONE pull request "New shell C: <places>" with: what the boy sees, the pictures, your ticked rows, test timings, and anything you found broken today. It goes live by itself when the test check passes (your places reach boys only once the new home shows their tiles, so this is safe). If it fails, fix it on the same branch.
- Tell Esti in one plain line what went live.

============================================================
PROMPT D
============================================================
You are building ONE workstream of the Tashbar 1.0 boys' app SHELL OVERHAUL (repository tashbar-baltimore/tashbar-app). Several Claude accounts are building it at the same time, each in its own files. This session is for Esti (staff); Rabbi Khaver (Head of School) approves the whole plan. Talk to Esti in short, plain language and ask her only real decisions.

WHAT WAS ASKED, in their words: "Delete all the old layers and build a new, simple, quick, upgraded one. The code can be upgraded too; the features and functions must remain. Cleaner and calmer, but very exciting and inspiring, with incredible pictures, immersive 3D-like pictures and movement."
One line to check every piece against: every feature a boy has today still works, inside one clean new shell that looks and moves like the Mountain Kingdom (work) and the Golden City in the Clouds (free time).

START:
1. git fetch origin. If origin/main already has src/ShellKit.html, branch from origin/main; otherwise branch from origin/esti/shell-overhaul-1 (the lead session's branch with the kit; it merges first). Your branch: esti/shell-city.
2. Read, in this order (all binding): CLAUDE.md, CONTRIBUTING.md, docs/SHELL-CONTRACT.md (WHO OWNS WHAT and HOW A PLACE IS BUILT — follow it exactly), your rows in docs/SHELL-OVERHAUL.md (named below), docs/BUTTON-SYSTEM.md, docs/WORLD.md, docs/SHELL-AND-LESSONS.md, art/README.md, src/ShellKit.html.
3. Before building, play today's version of each of your places as a made-up boy (tools/screens/*.js, tests/lib/screens.js) so you know every function you must keep.

YOUR WORKSTREAM: D — the Golden City's games. Places: `arena` (the Chavrusa Arena; city; door arena; scene ycw-c-arena; icon ycw-ic-arena), `games` (the Game Pavilion: Mistake Detective and Kodesh Quest; city; door games; scene ycw-c-pavilion; icon ycw-ic-games), `workshop` (Block Builders and Chumash Lab; city; scene ycw-c-workshop; its two tiles carry door blockbuilders and door chumashlab).
Your rows in docs/SHELL-OVERHAUL.md: Part B "8. Chavrusa Arena", "9. Mistake Detective", "10. Kodesh Quest", "11. Block Builders", "12. Chumash & Timeline Lab".
Keep every function: the Arena (live duel, Lightning, power-ups, cheers, handshake, async challenges, class showdown, the one-Chromebook Shtender duel; all 18 ar*/ch* server calls; points only, never money), Mistake Detective and the Daily Mix, Kodesh Quest (right answers saved as evidence; the server pays), Block Builders (shows only for Math level 2-4 or TEST- boys; bbMine, bbPage, bbSave), Chumash Lab (grade 3 and up; progress on the Chromebook), and the rule that the games open only when his work is done ("Opens when your work is done"). tests/lib/blockbuilders.js and chumashlab.js must keep passing; your test must guarantee their door rules for the new tiles too.

THE RULES THAT MATTER MOST:
- Edit ONLY: src/ShCity.html, tests/lib/shell-city.js, docs/screens/shell/<your place ids>/, and the checklist rows for your places in docs/SHELL-OVERHAUL.md. Never edit src/ShellKit.html, src/UiKit.html, src/ClassMode.html, src/GameMap.html, src/Photos.js, src/Speed.js, tests/run.js, another workstream's file, any lesson file or pack, the server's money/progress code, or staff screens. Need something there? Open a GitHub issue "SHELL-KIT: <what you need>" and carry on with the rest.
- Do NOT delete or change the old screens; the lead session deletes them in the last step, once your rows are ticked.
- Rebuild each screen FRESH in your file (cleaner, calmer, inspiring), with the same functions and the same server calls as today. Big inner game engines may be moved into your file and cleaned up instead of rewritten from zero, as long as the old file can be deleted later. Call the server with SHK.call(...). The server sets every money amount: show what it sends, never compute money.
- Lessons open only with SHK.openLesson(skillId). Buttons ONLY from the kit (window.TLK): at most one main per screen, quiet for other choices, TLK.ask for "Buy this?"-type questions, pills/boxes for information, tlk-tile for cards. Full pages: the house top left (SHK.page). Pop-ups: one round x top right (SHK.pop). Words as in docs/BUTTON-SYSTEM.md ("My money", "canteen money").
- Grade 2 and up only (SHK.on()); K-1 keep their games, never show them anything. Nothing drawn by script at rest (CSS movement only; no timers that change the page or toggle body classes).
- Pictures: use the scene and icon names in docs/SHELL-CONTRACT.md (pictures on order YCB-4 show the world's sky and mountains until they arrive; that is fine). Need a picture nobody ordered? Open a "SHELL-KIT: picture <name>" issue with the screen, size and exact prompt. Never write the Head of School's email address anywhere. Picture rules: docs/HANDOFF-PICS.md.
- No real student names, codes or data anywhere (made-up TEST boys only).

YOUR TEST (tests/lib/shell-city.js): open each of your places with SHK.go(id), use every function with made-up server answers (copy the google.script.run proxy from tests/lib/classesbucket.js page()), check: only kit buttons, one house top left or one x top right, the words, that the right server call was made with the right arguments, and that a lesson opens through SHK.openLesson. Restore the page at the end. tests/run.js runs it automatically. Never weaken any other test or the quality gate.

FINISH:
- PAGES=1 node tests/run.js alone (about 50 minutes; give it a 2-hour timeout) must pass. Merge origin/main into your branch first; other builders push often.
- See it as a boy: node tools/screens/shell.js /tmp/shots after 5 <ids> and again with grade 3 (both sizes come out: 1366x768 and 390x844). Use SETUP='...' for made-up money or answers so screens are not empty. LOOK at every picture, fix what looks wrong, save them in docs/screens/shell/<id>/.
- Open ONE pull request "New shell D: <places>" with: what the boy sees, the pictures, your ticked rows, test timings, and anything you found broken today. It goes live by itself when the test check passes (your places reach boys only once the new home shows their tiles, so this is safe). If it fails, fix it on the same branch.
- Tell Esti in one plain line what went live.

============================================================
PROMPT E
============================================================
You are building ONE workstream of the Tashbar 1.0 boys' app SHELL OVERHAUL (repository tashbar-baltimore/tashbar-app). Several Claude accounts are building it at the same time, each in its own files. This session is for Esti (staff); Rabbi Khaver (Head of School) approves the whole plan. Talk to Esti in short, plain language and ask her only real decisions.

WHAT WAS ASKED, in their words: "Delete all the old layers and build a new, simple, quick, upgraded one. The code can be upgraded too; the features and functions must remain. Cleaner and calmer, but very exciting and inspiring, with incredible pictures, immersive 3D-like pictures and movement."
One line to check every piece against: every feature a boy has today still works, inside one clean new shell that looks and moves like the Mountain Kingdom (work) and the Golden City in the Clouds (free time).

START:
1. git fetch origin. If origin/main already has src/ShellKit.html, branch from origin/main; otherwise branch from origin/esti/shell-overhaul-1 (the lead session's branch with the kit; it merges first). Your branch: esti/shell-places.
2. Read, in this order (all binding): CLAUDE.md, CONTRIBUTING.md, docs/SHELL-CONTRACT.md (WHO OWNS WHAT and HOW A PLACE IS BUILT — follow it exactly), your rows in docs/SHELL-OVERHAUL.md (named below), docs/BUTTON-SYSTEM.md, docs/WORLD.md, docs/SHELL-AND-LESSONS.md, art/README.md, src/ShellKit.html.
3. Before building, play today's version of each of your places as a made-up boy (tools/screens/*.js, tests/lib/screens.js) so you know every function you must keep.

YOUR WORKSTREAM: E — the quieter places. Places: `canteen` (the Canteen Court; city; door canteen; scene ycw-c-canteen; icon ycb-ic-canteen), `library` (the Library Tower, My Library; kingdom; door library; scene ycw-k-library; icon ycw-ic-library), `olamhaba` (the Olam Haba sky; city; door olamhaba; scene ycw-c-calm; icon ycw-ic-calm), `music` (the Music Pavilion; city; door music; scene ycw-c-music; icon ycw-ic-music), `talk` (Talk to my Rebbe, the Message Tower; kingdom; door talk; scene ycw-k-post; icon ycw-ic-talk).
Your rows in docs/SHELL-OVERHAUL.md: Part B "7. Canteen", "13. My Library", "14. Olam Haba", "15. Music", "16. Talk to my Rebbe".
Keep every function: the Canteen's 4 doors in this order (Buy food, Get canteen money, My story, Lessons; cnOrderMenu, cnOrderPlace, cnOrderCancel, cnKidInfo; "canteen money" wording; closed during class unless a teacher opened it, via TM_CLASS), My Library (libMyLibrary), the Olam Haba sky and its sheet, Music (msMusicInfo, msMusicPart; music can be turned off), Talk to my Rebbe (crStaffList, crSend: pick any staff member, write, send with TLK.ask; only that staff member sees it). Fix: Talk to my Rebbe had no way in from the home (now it is a place); the Olam Haba "Keep going!", the Talk to my Rebbe form and the Library tabs used hand-drawn buttons (now kit only). Your test must guarantee the canteen door order that tests/run.js checks today.

THE RULES THAT MATTER MOST:
- Edit ONLY: src/ShPlaces.html, tests/lib/shell-places.js, docs/screens/shell/<your place ids>/, and the checklist rows for your places in docs/SHELL-OVERHAUL.md. Never edit src/ShellKit.html, src/UiKit.html, src/ClassMode.html, src/GameMap.html, src/Photos.js, src/Speed.js, tests/run.js, another workstream's file, any lesson file or pack, the server's money/progress code, or staff screens. Need something there? Open a GitHub issue "SHELL-KIT: <what you need>" and carry on with the rest.
- Do NOT delete or change the old screens; the lead session deletes them in the last step, once your rows are ticked.
- Rebuild each screen FRESH in your file (cleaner, calmer, inspiring), with the same functions and the same server calls as today. Big inner game engines may be moved into your file and cleaned up instead of rewritten from zero, as long as the old file can be deleted later. Call the server with SHK.call(...). The server sets every money amount: show what it sends, never compute money.
- Lessons open only with SHK.openLesson(skillId). Buttons ONLY from the kit (window.TLK): at most one main per screen, quiet for other choices, TLK.ask for "Buy this?"-type questions, pills/boxes for information, tlk-tile for cards. Full pages: the house top left (SHK.page). Pop-ups: one round x top right (SHK.pop). Words as in docs/BUTTON-SYSTEM.md ("My money", "canteen money").
- Grade 2 and up only (SHK.on()); K-1 keep their games, never show them anything. Nothing drawn by script at rest (CSS movement only; no timers that change the page or toggle body classes).
- Pictures: use the scene and icon names in docs/SHELL-CONTRACT.md (pictures on order YCB-4 show the world's sky and mountains until they arrive; that is fine). Need a picture nobody ordered? Open a "SHELL-KIT: picture <name>" issue with the screen, size and exact prompt. Never write the Head of School's email address anywhere. Picture rules: docs/HANDOFF-PICS.md.
- No real student names, codes or data anywhere (made-up TEST boys only).

YOUR TEST (tests/lib/shell-places.js): open each of your places with SHK.go(id), use every function with made-up server answers (copy the google.script.run proxy from tests/lib/classesbucket.js page()), check: only kit buttons, one house top left or one x top right, the words, that the right server call was made with the right arguments, and that a lesson opens through SHK.openLesson. Restore the page at the end. tests/run.js runs it automatically. Never weaken any other test or the quality gate.

FINISH:
- PAGES=1 node tests/run.js alone (about 50 minutes; give it a 2-hour timeout) must pass. Merge origin/main into your branch first; other builders push often.
- See it as a boy: node tools/screens/shell.js /tmp/shots after 5 <ids> and again with grade 3 (both sizes come out: 1366x768 and 390x844). Use SETUP='...' for made-up money or answers so screens are not empty. LOOK at every picture, fix what looks wrong, save them in docs/screens/shell/<id>/.
- Open ONE pull request "New shell E: <places>" with: what the boy sees, the pictures, your ticked rows, test timings, and anything you found broken today. It goes live by itself when the test check passes (your places reach boys only once the new home shows their tiles, so this is safe). If it fails, fix it on the same branch.
- Tell Esti in one plain line what went live.
