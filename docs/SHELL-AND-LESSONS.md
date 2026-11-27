# Shell overhaul and lesson overhaul: who works where (agreed 2026-11-27)

Two overhauls of the 1.0 boys' app run side by side, both approved by the Head of School:
- **Shell overhaul:** everything around the lessons (home, places, store, bank, trophies, profile, passport, canteen, arena, games, library, Olam Haba, music, Talk to my Rebbe, My work, the My map frame, Your Classes & Bucket, flights). Look: `docs/WORLD.md`.
- **Lesson overhaul:** how a lesson teaches inside the lesson box (THINK, LEARN, TRY IT, SHOW ME, DONE; a lesson switches when its data has `hook`, `learn` and `play`). Board: `docs/lesson-redesign/BOARD.md`. How lessons are organized for a boy (subjects, levels, units, map, order, mastery, DO THIS NOW, unit checks, boss levels, `kmMyMap` / `TL_MAP`) does not change.

## Who owns which files
- **Lesson side:** `src/OneBite*.html`, `src/OneBiteKit.html`, `src/CoreKit*.html`, `src/CoreData*.html`, `src/CoreReader.html`, `src/KriyahMore.html`, `packs/`, `docs/lesson-redesign/`, `tests/lib/onebite.js`, `tests/lib/obquality.js`. The lesson side also draws the whole frame around a lesson: top bar (✕, step dots, 🔊, Aa), the money chip inside the lesson, the footer's main button, the background, the done screen and its celebration.
- **Shell side:** the home and the places (GameMap, HomePlus, HomeLift, HomeLayout, StoreKid, the bank, ...), My work, the My map frame, ClassMode / Your Classes & Bucket, the flights, `docs/WORLD.md`.
- **Shared, add only:** `src/UiKit.html` and `tests/run.js`. Adding is fine; changing anything already there is a seam change. Picture faces on kit buttons are fine only if every existing class (`tlk-main`, `tlk-quiet`, `tlk-x`, `tlk-tool`, `tlk-key`, `tlk-pill`) still works as before.

## The seam (the only two places they meet)
- **In:** one call, `startMission(world, skillId, 'skill')` (QuestPage; One Bite wraps it). The shell may wrap it in its own `openLesson(id)` but must call it, never copy it.
- **Out:** the done screen's existing `data-act="tohub"` / `"start"` / `"retry"`. The shell decides where "tohub" lands.
- Between them the lesson is a closed box. The shell does not change `startMission`, `buildMission`, `answer`, `next`, `finish`, `render`, `overlay`, `phaseIntro`, or the shape of `A.play` / `A.res` / `A.view`; keeps `#app` inside `.wrap`; and leaves `body.ob-on` alone. The engine's save to the server is unchanged.
- The world's pictures stay out of lessons (the lesson side draws its own background).

## Changing the seam
Whoever wants to change anything on the seam or in the shared files first posts a GitHub issue titled `SEAM: <what changes>` and waits for the other side to answer before merging.
