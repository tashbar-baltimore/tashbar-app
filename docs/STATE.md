# Current state

**2026-11-19 SWITCH-OVER:** GitHub is the only source. The live app (site + server) is built from `main`; pull requests that pass the tests are merged and published automatically (auto-publish). The Apps Script editor is no longer edited. The notes below are history.

Imported from the Drive note "02 CURRENT_STATE v269" (2026-11-15 23:58Z, written by builder takeover4). The Drive notes stay the record until the switch to GitHub is approved.

## Block Builders workbook (2026-11-22)
- The Khaver family's "My Block Math Builders Workbook" (carrying and borrowing) in the app: a 📘 Workbook button on the boy's Math map (Math levels 2-4 and TEST- boys; switch `window.BB_LIVE`: 'on' / 'all' / 'test' / 'off').
- Every job: Watch me (Dot or Tenzi reads the words aloud; the example plays step by step with moving blocks), then the workbook page itself with the boy's name and date: live answer boxes checked at once with a hint, a second miss offers "Watch me" with those numbers, and a pen layer for the stylus. Sheet B for more practice; scores and pen work saved per page (tab MS_BlockBuilders; also on the Chromebook).
- Teacher board: staff portal → Reports → 📘 Block Builders workbook (each boy's first-try scores; tap a page to see it with his pen work).
- Files: `src/BlockBuilders.js`, `src/BlockBuildersData.html` (pages), `src/BlockBuildersUI.html` (player), `src/BlockBuildersStaff.html`; test `tests/lib/blockbuilders.js`.
- Transcribed: Getting Ready to Add 1-10, Carrying 1-23 (A and B), Getting Ready to Subtract 1-12, Borrowing 1-5 (A and B) and 6A. The rest of Borrowing and "Putting It All Together" show "page on the way" (the PDF is too large for the Drive connector; send the pages to finish). Items marked `pic2:1` have picture numbers that were not in the text copy: check them against the printed page.
- No money, mastery or evidence rows are written by the workbook (needs a Head of School decision).

## One Bite (2026-11-21)
- New lesson player `src/OneBite.html` (six calm steps), switch `OB_LIVE` (`'test'` = TEST- boys only at first). Hand-written bites in `src/OneBiteData*.html`. Read `docs/ONE-BITE-BRIEF.md`, `docs/ONE-BITE-PLAYBOOK.md`, `docs/ONE-BITE-LANES.md`, `docs/TEACHING-AUDIT.md`.

## Live
- Both live links are on **v272**. Access: `ANYONE_ANONYMOUS`.
- `main` was re-imported from the editor at v272 on 2026-11-16.

## Recent releases
- **v262 / v264:** Teacher Time real teaching frame: "How we will learn this" welcome, a sneak peek of a real question, "You are ready"; it opens on every unmastered lesson; "Teach me how" teaches the exact question.
- **v267:** full lesson preview for staff: a slideshow of every screen, with real question cards and an answer key.
- **v268:** art mount: 24 art lessons inside KodeshQuestPage, an art scene in Teacher Time, a "Picture lesson" button, and an Art Studio gallery in Curriculum Preview.
- **v269:** Gemara move-off-tap (GEM2–GEM8): all 31 Gemara skills pass the hands-on rule.
- Earlier the same day: names-and-family passes (Life, Reading, Computing, Social Studies, Writing), Chumash Island Lessons L02–L08 and L10, Torah Tracks all hands-on, Parsha deep dives for all 54 parshiyos, sign-in v4, Chavrusa Arena, access for schools, roles and parents.

## Staged, not live
- TL_OFFTAP v3 (extra hands-on items, capped at 20 per lesson, for Electives, Life, B'Simcha, Reading, Language, Writing, Social Studies, Computing). Offline result: 356 of 653 skills pass the hands-on rule. It ships after a play-to-mastered run on all 653.

## Engine note
- Check questions must stay tap kinds. A non-tap check question gets moved to practice, and mastery then fails.

## Rules in force
- Hands-on practice: no plain multiple choice in practice (Head of School).
- Teacher Time teaches kindly, and questions match what was taught (Head of School).
- Family Life decision (2026-11-15): modest, warm, normal frum family life; wide mix of names.
- Kodesh is reviewed by a rebbe after it is live.

## Numbers from the first test run (v268)
- 1,170 lessons build with well-formed questions.
- 1,134 check questions have an answer that does not appear in that lesson's teaching text. This is a rough count (many are fair "apply it" questions); the tests only stop it from going up.
- Timings with the CPU slowed 4x: sign-in pad about 1.4 s, student home about 1.1 s, all lessons loaded about 5 s, staff first screen under 1 s (with a pretend server that answers at once).
