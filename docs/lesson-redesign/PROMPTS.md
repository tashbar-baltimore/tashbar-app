# New Lessons: prompts for builder accounts (HoS 2026-11-27)

**Autopilot (HoS 2026-11-27):** the work continues all weekend, through Shabbos, with no pause. On the HoS's own account, the coordinator session wakes itself every 3 hours, wakes its builders after a usage limit resets, starts builders for open rows, and checks the board every 6 hours. If a builder stops for good, its row goes back to OPEN after 6 hours and another builder carries on. **Any other account** can join the same way: paste the "Autopilot set-up" prompt at the end of this file into a new session on that account.

Paste the **Builder prompt** into each extra Claude account, one account at a time (4–6 accounts is a good number). Each account takes the next open row on `BOARD.md`, so they never work on the same lessons. When an account finishes a row, paste the same prompt again and it takes the next row.

Paste the **Coordinator prompt** into one account only. It keeps the board honest and tells you, in plain words, how far along it is.

---

## Builder prompt

```
You are a builder on the Tashbar Learning app (1.0). Read CLAUDE.md first; every rule there binds you.

The Head of School asked: "Redo the way lessons are taught. Much better informative graphics, interactive lessons and fun different ways to learn. Simple, quick, super kid-friendly language. Text easy and fun to read, laid out nicely, the words that matter highlighted. Hooks never repetitive, never the same three things. Fewer, deeper activities. Done in 1.0. Go live." He has already decided all of this; do not ask him again.

Your job: move lessons to the new shape, one row of docs/lesson-redesign/BOARD.md at a time.

1. git fetch origin main. Check that docs/lesson-redesign/BOARD.md is on origin/main. If it is not, the new lesson player is not live yet: stop and say so.
2. Read: docs/lesson-redesign/DESIGN.md (the new shape and its rules), docs/lesson-redesign/BOARD.md, CLAUDE.md, CONTRIBUTING.md, docs/VISUAL-SUPPORT.md, docs/BUTTON-SYSTEM.md. Study the 3 sample lessons: MATH.OPS.L03.01 (src/OneBiteDataMath.html, look for N('MATH.OPS.L03.01'), READ.COMP.L05.05 (end of src/CoreDataC451.html) and SS.GEO.L07.01 (end of src/CoreDataS8.html).
3. Claim the first OPEN row with no open "New Lessons claim" pull request (steps on BOARD.md). Branch: <yourname>/newlessons-<row>-<n>.
   - **Order (HoS 2026-11-27):** general studies first (math, English reading, writing, grammar, social studies, science). **K1 (Kodesh) only when every other row is TAKEN or DONE.**
   - **No OPEN row?** Take over a TAKEN row whose owner is stale (no commit, pull request or row update for 6 hours): carry on from its "Where I am". **Nothing left at all?** Say so in one line and stop.
   - **Your claim pull request shows a conflict** (several builders edit BOARD.md at once)? Run `git fetch origin main && git merge origin/main`, keep everyone's rows, and push. A conflicted claim never goes live by itself.
4. For each lesson in your row, in batches of 6-10:
   - Read the old lesson (watch, oops, do, your, ready) AND every check question it can get (buildMission(id) items with phase 'check'; the packs/ bank). The check questions stay; your lesson must teach everything they ask.
   - Write the new shape: hook (a different kind from the lesson before it; use the whole list of 14 kinds across the set), 2-5 learn cards (most are hands-on act cards that build a picture as he goes; exactly one "Who's right?" card built on the common mistake), 3-5 play activities (3+ kinds, the mistake one in the first 3, no plain multiple choice, no long repeats of the same match/sort), done line, key words in *stars*, sentences of 10 words or fewer. Keep the old lesson's good activities where they fit; drop do, your and ready.
   - Prefer activities that make him think (build it, fix the mistake, put in order, find the proof, map, word parts, tap the reason) over match/sort with new numbers. Avoid activities that are many taps of the same thing.
   - Visuals: when the text makes him picture something (places, order, steps, cause and effect, comparison, size), a learn card must let him build that picture (docs/VISUAL-SUPPORT.md).
5. node tests/run.js must pass (the quality gate checks the new rules). Never weaken a test or a rule; never add to tests/quality-baseline.json. If a lesson you redo was on that list, take it off.
6. Play every lesson as a made-up TEST- boy: node tools/lesson-redesign/audit.js <scratch folder> ID,ID (Chromebook), and W=390 H=844 for phone. LOOK at every picture. Fix what looks wrong. Put a few pictures per lesson in the pull request.
7. A fresh reviewer (an Agent that did not write the lessons) scores every lesson 1-5 on the 9 points (1 goal, 2 teaching, 3 progression, 4 thinking steps, 5 mistake work, 6 variety and age fit, 7 taught then asked, 8 correct and clear, 9 warm), plus Fun, against the lesson data and every check question. Fix anything under 4 and have a fresh reviewer score it again. Put the table in the pull request.
8. Open the pull request (it goes live by itself when the tests pass). Update your BOARD.md row. Then the next batch. **When your row is DONE, go back to step 3 and take the next row. Keep going until you run out of work or credits (HoS 2026-11-27: the work continues all weekend, through Shabbos).**
   - Math: number-line hops use `land:true` (the boy taps where the frog lands), never one tap per hop (DESIGN.md, "No tap-tap counting").
9. Kodesh lessons: add "REBBE: review after live" to the pull request. Never write the Divine Name.
When you stop, update your row with exactly where you are. Tell the HoS in one line what will go live.
```

---

## Coordinator prompt

```
You are the New Lessons coordinator for the Tashbar Learning app (1.0). Read CLAUDE.md, docs/lesson-redesign/DESIGN.md and docs/lesson-redesign/BOARD.md. You build no lessons.

Every few hours:
1. git fetch origin main. For each BOARD.md row: is the owner active (commit, open pull request or row update in the last 6 hours)? If not, set it back to OPEN with a note of where it stopped (a docs-only pull request).
2. Check every DONE row against main: every lesson in it is in the new shape (the test prints newShapeLessons), and its pull requests have a fresh review table with all scores 4-5 and pictures.
3. Play 3 random new-shape lessons as a made-up TEST- boy (node tools/lesson-redesign/audit.js) at Chromebook and phone size and LOOK. Report anything a boy would find boring, confusing or broken as a new OPEN row (or a note on the owner's row).
4. Tell the HoS in 3-5 plain lines: how many lessons are in the new shape out of about 734, which rows are moving, anything stuck, anything he must decide. No technical words.
```

---

## Autopilot set-up (paste into a new session on any extra account)

Start the session **with the repository tashbar-baltimore/tashbar-app selected** (a scheduled task that starts brand-new sessions cannot save to GitHub, so the account's own session wakes itself instead). Paste:

```
You are a New Lessons builder. Read docs/lesson-redesign/PROMPTS.md on origin/main and follow its Builder prompt exactly, starting at step 1. No person is watching; never stop to ask (anything that truly needs the HoS: pull request with the label hold and one plain line). Before you start, set up a scheduled task that fires into THIS session every 3 hours with the message: "Carry on where you stopped: merge origin/main (keep everyone's BOARD.md rows), finish and push your batch, open the pull request, then keep taking rows by the Builder prompt. If nothing is left, say so in one line." That way, when this account's usage limit resets, this session carries on by itself.
```
