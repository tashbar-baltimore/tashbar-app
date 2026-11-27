# Lesson Redesign prompt (HoS 2026-11-27)

Paste everything below the line into a fresh Claude session on this repository.

---

You are rebuilding HOW lessons teach in the Tashbar Learning app (1.0). Read `CLAUDE.md` first; every rule there still binds you.

**What the Head of School asked for, in his words:** "I am not loving the way the lessons flow. The boys still have a lot of repetitive clicking that does not encourage understanding and it is boring. Redo the way lessons are taught, add much better informative graphics and interactive lessons and fun different ways to learn, and teach it in simple, quick, super kid-friendly language."

Check everything you build against that sentence. "More activities" or "prettier buttons" is not what he asked for.

## The problem today
- Every lesson runs the same six steps (`docs/ONE-BITE-PLAYBOOK.md`): Today We Learn → Watch Me (one tap per step) → 2 "with me" → 5 "your turn" → 3 "show me" → Level Clear.
- That is 10+ answer screens plus many "next" taps, mostly match / sort / tap. Boys click through by pattern without thinking.
- Review Round 2 found the same: Writing Gr 4–8 passed 0 of 63 lessons ("only match/sort/tiles, the boy never writes").

## What a good lesson feels like now
1. **Hook in 10 seconds.** A puzzle, a surprise, a story moment or a question he wants answered. Not a title card.
2. **Teach with a picture that moves when he does.** He drags, builds, slides or taps, and the picture changes to show the idea (blocks regroup, a map fills in, a timeline grows, a sentence snaps together). The graphic explains; it does not decorate. Follow `docs/VISUAL-SUPPORT.md`.
3. **Every tap must need thinking.** No "Next" taps that only show more words. No same activity kind twice in a row. No questions a boy can get by guessing or by spotting a pattern. No more than 2 look-alike questions with new numbers.
4. **Fewer, deeper activities.** About 3–5 rich ones beat 7 quick ones.
5. **Mix the ways to learn** (at least 3 per lesson): build it; fix the mistake; predict, then see; who is right? (two boys, two answers); explain why (tap the reason); estimate, then check; make your own problem for a friend; story mission ("help Shmuli fix the sukkah plan"); write or draw with the pen; teach it back; song or move (K–3). No timers.
6. **Wrong answers teach.** Show why with the picture ("Look: you only made 1 ten. Count the ones."), never just "Try again".
7. **Kid words.** Sentences of 10 words or fewer. Everyday words. One idea per screen. Read aloud for K–2.
8. **Short.** K–1 3–5 min, Gr 2–3 about 5, Gr 4–5 6–8, Gr 6–8 8–10.

## How to work (stop where it says stop)
1. **Read:** `CLAUDE.md`, `CONTRIBUTING.md`, `docs/ONE-BITE-PLAYBOOK.md`, `docs/HOW-TO-WRITE-A-LESSON.md`, `docs/TEACHING-AUDIT.md`, `docs/VISUAL-SUPPORT.md`, `docs/BUTTON-SYSTEM.md`, `docs/core-growth/REVIEWS.md`, `src/OneBite.html`, `src/CoreKitActs.html`, `tests/lib/obquality.js`.
2. **Audit (look as a boy):** play 6 live lessons as a made-up TEST- boy at 1366×768 and phone size: one K–1, one Gr 2–3 math, one Gr 4–5 reading, one Gr 4–8 writing, one Gr 6–8 social studies, one Gr 6–8 grammar. For each: total taps, taps that needed thinking, minutes, the most boring moment, screenshots. Write `docs/lesson-redesign/AUDIT.md`.
3. **Design:** write `docs/lesson-redesign/DESIGN.md`: the new lesson flow, each new activity kind with a picture sketch, how the moving graphics are built (code-drawn SVG first; ordered pictures go in `art/`), and the kid-word rules. List in plain words every current rule it would change (for example the six fixed steps, the "2 + 5 activities" rule in the quality gate, Watch Me one tap per step) and what you propose instead.
   **STOP.** Send the HoS a short plain summary and the questions he must decide. Do not change the quality gate, the button system or the six steps without his yes.
4. **Pilot (after his yes):** rebuild 3 lessons in the new style (one K–1 math, one Gr 3–4 reading, one Gr 6 social studies), behind a switch for TEST- boys only. New buttons and screens come from the button system (`window.TLK`); if the kit is missing something, ask the HoS. Add the label `hold` to the pull request so it does not go live by itself.
5. **Show:** before/after screenshots at both sizes, before/after tap counts and minutes, and a fresh reviewer's 1–5 scores on the 9 quality points. Give the HoS the look link and say in one line what a boy will see.
6. **Roll out (only after the HoS approves the pilot):** write the new recipe into `docs/HOW-TO-WRITE-A-LESSON.md`, update the quality gate test to check it (as the HoS decided), add a Gap board row per job, and redo lessons job by job, worst-scoring first.

## Never
- Weaken a rule to make a test pass, or add a lesson to `tests/quality-baseline.json`.
- Draw your own buttons or restyle the kit.
- Write the Divine Name; use real student names or data; put T$ on staff screens.
- Turn the pilot on for every boy without the HoS.
