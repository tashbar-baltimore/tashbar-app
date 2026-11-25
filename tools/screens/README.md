# Screen pictures and the "nothing touches the ✕" check (made-up boys only)

Test tools for builders. Nothing here is part of the app. They use `tests/lib/screens.js` (a made-up boy page, fake server).

| File | What it does |
|---|---|
| `popups1.js OUT TAG [ids]` | Opens the batch-1 pop-ups (store, bank, trophies, journey, week, homeplus, kodeshquest, taryag, sparkpath, torahtracks, piczoom, library) at 1366×768 and 390×844, saves `OUT/TAG-<id>-cb.png` / `-ph.png`, prints the overlap check for each. `ids` = comma list to do only some. |
| `popups2.js OUT TAG [ids]` | Same for batch 2 (shelf, music, weekreport, story, gamzu, notesent, levels). |
| `k1game.js OUT TAG "Count the stars"` | A K–1 math warm-up game at both sizes; checks its ✕ closes it. |
| `overlap.js` | Page function: for every visible kit ✕ (`.tlk-x`) lists anything inside the same pop-up within 4 px of it, and anything drawn on top of it. Empty `hits` = clean. Copy the idea for the house/back (`.tlk-home`, `.tlk-back`). |
| `stinfo.js` | Made-up store shelf from the real server code (so the store picture is not empty). |
| `sheet.py DIR TAG OUTBASE id="Label" ...` | Joins pictures into one labeled sheet per size (`OUTBASE-chromebook.png`, `OUTBASE-phone.png`). |

Run from the repository root, e.g. `node tools/screens/popups2.js /tmp/x after music,levels`.
Each run takes a few minutes (the page loads every lesson). Do not run it at the same time as `node tests/run.js`.
Note: the overlap check cannot see inside an iframe (Kodesh Quest, Spark Path), so LOOK at those pictures.
