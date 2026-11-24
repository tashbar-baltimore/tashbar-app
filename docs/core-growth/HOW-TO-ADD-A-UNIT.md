# How to add a unit: pre-check (test-out) and unit check (boss level)

Job T wrote this note (2026-11-24). It is for every content job. Read `HOW-TO-ADD-A-SKILL.md` first. CLAUDE.md wins where they differ.

A unit (prompt section 3, step 2) is 4–10 small skills, plus a real reading or writing task, plus a unit check. Each unit gets two checks:
- **Pre-check (test-out),** before the unit: one question per skill. Every skill he answers right is **shown**, so it leaves his path and he skips it. "No boy sits through what he already knows."
- **Unit check (the boss level),** after the unit: 8–12 questions that mix every skill of the unit with 2–3 from earlier units. One try each, a dramatic entrance and a win moment.
  - **8 of 10 (80%) passes** and the next unit opens.
  - Otherwise he sees "Almost there!" with a **Practice** button for exactly each lesson he missed.

Nothing here pays money or marks a skill mastered. Any money for checks is an HoS decision.

## Add a unit
In your data file, next to `TLCORE.add(...)`:

```js
if (window.TLCORE && TLCORE.units) TLCORE.units.add({
  id: 'C45.U01',                          /* job letters, .U, two digits; units of a job run in this order */
  title: 'Main Idea Detectives',
  c: 'READ',                              /* READ, WRIT or SCI: the subject of his path (Social Studies has no skill-by-skill path yet) */
  grade: 5,
  skills: ['READ.COMP.L06.13', 'READ.COMP.L06.14', 'READ.COMP.L06.15', 'READ.COMP.L06.16'],   /* the unit's small skills, in order (2-12) */
  review: ['READ.COMP.L05.03', 'READ.VOC.L05.02'],   /* 2-3 skills from earlier units (at most 4) */
  n: 10                                   /* questions in the unit check (6-12; default 10) */
  /* items: [{ skill: 'READ.COMP.L06.13', type: 'evidence', ... }]   optional: your own Activity Kit questions for a skill */
});
```

**Where the questions come from:** each skill's own **check** questions of the tap kinds "choose one" and "put in order" (most Reading and Language lessons have them), or your own `items` in any Activity Kit kind, with the `skill` they test. A skill with neither is left out of the check. Write good check questions and the unit check is good too.

**Keep it cold:** the unit check should not repeat the exact question he just answered in the lesson's Show me. Give each skill more than 3 check questions where you can, or add `items`.

## When the boy meets it
**On for every boy** (HoS decision 2026-11-24; the switch is `CU_LIVE` in `src/CoreUnits.html` and `src/CoreChecks.js`: `'on'`, `'test'` for TEST- boys only, or `'off'`):
- Starting the **first lesson of a unit** (no lesson of it mastered yet, and 3 or more skills) opens the **pre-check** first. If that lesson was shown, he goes straight to the first lesson he still needs.
- Starting a lesson of a unit whose **earlier unit is finished but not passed** opens that earlier unit's **check** first, once per visit. If he passes it or closes it, his lesson opens. If he does not pass, the screen gives him Practice buttons for exactly the lessons he missed, and the check comes back next time.
- The checks never wait on the internet: until his unit results have loaded, lessons open as usual. A unit with fewer than 2 tap questions never blocks anything. Every lesson still opens through One Bite.
- Code can open them at any time: `TLCORE.units.pre('C45.U01')` and `TLCORE.units.check('C45.U01')`. Both return a Promise of `{ done, passed, shown, missed }`, or `{ skipped: true }` when the unit has fewer than 2 tap questions. The questions are picked at random from each lesson's check questions, so a retry is not the same test.

## The rules the tests check
- `TLCORE.units.err(unit)` refuses a bad unit: bad id, no title, unknown subject, fewer than 2 skills, or `n` outside 6–12.
- `tests/lib/coreunits.js`, on the server:
  - one pre-check per unit, so no second try to fish for skips;
  - shown skills leave the path, and a missed skill comes back;
  - 80% passes, and a passed unit stays passed;
  - the switch is `'on'`, and `'test'` still keeps it to TEST- boys;
  - no money and no mastery are written.
- On the page, at 1366 and 390:
  - the entrance; cleared at 80%; "Almost there!" with Practice opening exactly the missed lesson;
  - the pre-check message;
  - the pre-check opening before a unit;
  - button system only.
