# Tashbar Learning 2.0

**What this is (Head of School, 2026-11-22):** 1.0 (today's app) stays as it is and keeps growing. It is the workshop. 2.0 is a separate, clean app at its own link. Something moves from 1.0 into 2.0 only after it has been looked at, judged worth keeping, made right, and **approved by Mrs. Khaver or Esti** (or anyone else the HoS adds).

- **1.0:** https://tashbar-learning-live.web.app. Unchanged. Builders keep working there, and it still goes live by itself when its tests pass.
- **2.0:** https://tashbar-learning-v2.web.app. A separate website. It uses the same boys, codes and saved progress (the same school server), so a boy's work counts in both.

## The one rule
**Nothing goes into 2.0 without an approver's "yes".** The publishing system checks for it, and one approver is enough. **The approval line is posted only for an approver who, in that same conversation, has looked at the newest look link and said to approve.** No one else ever posts it.

## How a piece of 1.0 moves into 2.0 (a small workshop, one piece at a time)
Mrs. Khaver or Esti run it in her own Claude, with the prompt in `v2/START-PROMPT.md`. She is in charge and her Claude is the builder.
1. **"What are we looking at today?"** She picks one small piece of 1.0 from `v2/FEATURES.md`.
2. **Look at it in 1.0 together.** Her Claude shows her where it is, explains what it really does, and writes it down in `v2/FEATURES.md`.
3. **Decide.** Is it good, dumb, or could it be done better or differently? She decides: keep it as is, change it, or leave it out.
4. **Build it clean.** Her Claude copies only what is needed into `v2/` (a copy, so 1.0 changes never leak into 2.0), makes her changes, tests it as a made-up boy on a Chromebook and a phone, and opens a pull request that changes only `v2/`.
5. **Look and tweak.** When the tests pass, the system puts it on a private **look link** and posts that link on the pull request. She opens it like any website and says what to change. Her Claude changes it, and a new look link follows. This repeats until she likes it. The look link has a **review page** (add `/compare/`): today's 1.0 on the left, the new 2.0 version on the right, side by side, with a Phone-size button. On a phone it switches between them with tabs.
6. **Put it in.** When she says "approve it", her Claude posts one line on the pull request: `APPROVED FOR 2.0 — <her name>`. Everyone works through the HoS's GitHub, so that line is the yes. The gate (`v2-gate`) checks that her name is on `v2/APPROVERS.json` (as it is on main) and that the line came after the newest change. Then it goes into 2.0 and live (about 5 minutes).

Other builders (like the HoS's sessions) may also prepare a 2.0 piece the same way, but it still waits for her yes.

## The "ready" checklist (every piece, before it is sent)
- [ ] It does what the HoS asked, in his words (written at the top of the pull request).
- [ ] Every test passes (`node tests/run.js`).
- [ ] Played as a made-up boy at Chromebook size (1366×768) and phone size; every screen looked at; pictures in the pull request.
- [ ] Lessons: an independent reviewer scored all 9 points of the HoS standard 4 or 5.
- [ ] No real student data, no Divine Name, no word "bite", no money on staff screens, modest frum family life.
- [ ] It works on its own inside 2.0 (it does not reach into 1.0's files).

## What is in 2.0 so far
See `v2/FEATURES.md`.

## For builders
- A 2.0 pull request changes **only** files under `v2/`. A pull request that mixes 1.0 and 2.0 changes is refused.
- 1.0 pull requests must not touch `v2/`. If one does, it waits for an approver like any 2.0 change.
- A 2.0 piece brings its own tests in `v2/tests/` (each file exports `async (browser) => ({ fails, oks })`). `node tests/run.js` runs them all.
- Never publish 2.0 by hand. `publish-v2` puts it live only after the gate (`v2-gate`) has seen an approval.
