# Current state

Imported from the Drive note "02 CURRENT_STATE v269" (2026-11-15 23:58Z, written by builder takeover4). The Drive notes stay the record until the switch to GitHub is approved.

## Live
- Both live links are on **v272**. Access: `ANYONE_ANONYMOUS`.
- `main` was re-imported from the editor at v272 on 2026-11-16 and tagged `v272`.

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
