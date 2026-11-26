# The shared art library

**HoS decision, 2026-11-24:** "I want the graphics for 1.0 and 2.0 to all be shared. I really want everything to be shared." Every picture, photo, drawing, sound and 3D model the school has, from the past, now and the future, lives here once, and every app (1.0, 2.0 and any app after them) uses it from here. The rule is in `CLAUDE.md`, "Shared art library".

## What is art
Pictures, photos, illustrations, scenes, characters, icons, backgrounds, diagrams saved as image files, sounds and recorded clips (letter sounds, songs, effects) and 3D models. Something drawn by code on the fly (CSS, SVG written in code) stays in its code. If it is saved as a file, it is art and it belongs here.

## The folders
| Folder | What goes in | Limits |
|---|---|---|
| `art/pics/` | the app-ready picture | WebP (older pictures may be JPEG), at most 1,100 px wide, at most 200 KB (aim for 150 KB) |
| `art/originals/` | the full-size original of a picture, so it can be re-cropped instead of re-made | JPEG or PNG, at most 1.5 MB, **same name** as its app-ready file (`pics/x.webp` + `originals/x.jpg`) |
| `art/sounds/` | sounds and recorded clips | MP3, OGG, WAV or M4A, at most 2 MB |
| `art/models/` | 3D models | GLB, glTF, OBJ or USDZ, at most 10 MB |
| `art/CATALOG.md` | one row per item | made by `node tools/art-catalog.js` |

**File names:** short, lowercase, letters, numbers and `-`, with a prefix for the job or area (for example `f-g2-garden.webp` for job F, Grade 2). Never reuse a name, never rename one.

## 1. Search first
Open `art/CATALOG.md` and search (Ctrl+F) for the thing, the character, the lesson id or the band. Reuse what fits. The catalog also lists art packed inside code or a lesson pack, and art still waiting on other branches: reuse those too instead of making them again.

## 2. Use it
- **1.0:** link the picture in `src/RealPics.html` (`TL_PICS`, file name only) or name the file in your add-on as `/pics/<file>` or `/sounds/<file>`. The 1.0 site build (`web/build.js`) copies every library file that 1.0 names into the site, at `/pics/`, `/sounds/` and `/models/`.
- **2.0:** name the file in `v2/app/` as `/pics/<file>`, `/sounds/<file>` or `/models/<file>`. The 2.0 build (`v2/build.js`) copies what 2.0 names from `art/` (2.0 keeps its own clean code and screens; only the art is shared).
- **Keser Girls 3.0:** name the file in `keser/app/` the same way; `keser/build.js` copies it from `art/`.
- **Any future app:** the same. Its art lives here, never in its own folder.

## 3. Add to it (in the same pull request that first uses it)
1. Check it against its order and the picture rules (`docs/HANDOFF-PICS.md`): boys and men only (exception: Keser Girls 3.0 art may show girls and women, modestly; write "Keser Girls only" in its "what it shows" cell, and it is never used in 1.0 or 2.0); modest, frum family life; kosher food; no text inside pictures; no other religions' symbols; no Divine Name. Cast characters must look the same as in their earlier pictures (cast notes in `docs/CORE-GROWTH-LANES.md`).
2. Put the app-ready file in `art/pics/` (or `sounds/`, `models/`) and the full-size original in `art/originals/`.
3. Run `node tools/art-catalog.js`. It adds a row and fills what it can (alt, source and licence from `TL_PICS`, the screens that use it, the date).
4. Fill in the rest of the row by hand: what it shows, the characters (by cast name), the band (K1 / B23 / E45 / M68 / staff), source, licence, author, who ordered or made it, and the alt text. For an AI picture the licence is "made for Tashbar Baltimore with an AI image tool, owned by the school". The script never overwrites a cell that has text.
5. `node tests/run.js` must pass. It fails when a file has no row, a row points to a missing file, an item has no source, licence or alt text, a picture is too big or too wide, or the same file is in the library twice.

## Ordering new pictures
Pictures from the HoS's image account are ordered by email: a numbered order list with the file names, the screen, the size and the exact prompt. Example: `docs/core-growth/F-picture-orders.md` (job F). Check the inbox for replies, check each picture against its order, then add it as in step 3.

## Never
- Delete, replace or rename a library item without the HoS.
- Keep a second copy of a library file anywhere else in the repository.
- Put real student names or data in a picture, a file name or the catalog.

## Pull requests
A pull request that changes only `art/` goes live by itself after the tests, like any 1.0 pull request. A 2.0 pull request may change `v2/` and `art/` together; it still needs a 2.0 approver, exactly as before.
