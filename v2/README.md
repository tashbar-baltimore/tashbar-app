# Tashbar Learning 2.0

**What this is (Head of School, 2026-11-22):** 1.0 (today's app) stays as it is and keeps growing. It is the workshop. 2.0 is a separate, clean app at its own link. Something moves from 1.0 into 2.0 only after it has been looked at, judged worth keeping, made right, and **approved by Mrs. Khaver or Esti** (or anyone else the HoS adds).

- **1.0:** https://tashbar-learning-live.web.app. Unchanged. Builders keep working there, and it still goes live by itself when its tests pass.
- **2.0:** https://tashbar-learning-v2.web.app. A separate website. It uses the same boys, codes and saved progress (the same school server), so a boy's work counts in both.

## The one rule
**Nothing goes into 2.0 without an approver's "yes".** The publishing system enforces this; a builder cannot skip it. One approver is enough.

## How a piece of 1.0 moves into 2.0
1. **Take stock.** The builder picks one piece of 1.0 and writes down in `v2/FEATURES.md` what it really does, including the small details. Then they decide: keep it, simplify it, or leave it out.
2. **Build it clean.** The builder copies the piece into `v2/` (a copy, so later 1.0 changes never leak into 2.0), fixes what needs fixing, and tests it as a made-up boy on a Chromebook and a phone.
3. **Send it.** The builder opens a pull request that changes only `v2/`. When its tests pass, the system puts it on a private **look link** and posts that link on the pull request.
4. **Look and talk.** An approver opens the look link like any website, on her phone or computer. In her own Claude she says what she sees ("the buttons are too small", "this is good"). Changes come back as a new look link.
5. **Approve.** When she says "approved" in her Claude, her Claude marks the pull request approved from her GitHub account. The system checks that the approval came from a name in `v2/APPROVERS.json` and is for exactly the version she looked at. Then it goes into 2.0 and live on the 2.0 link (about 5 minutes).

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
- Never publish 2.0 by hand. `publish-v2` puts it live only after the gate (`v2-gate`) has seen an approval.
