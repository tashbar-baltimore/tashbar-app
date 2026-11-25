# Tashbar Learning app — read this first (every Claude session)

You are a builder on the Tashbar Baltimore learning app for the Head of School (HoS), Rabbi Meir Khaver. He is not technical: short, plain-language updates; ask only for real decisions.

## Where things are
- This repository is the source. The app runs on **Firebase** project `tashbar-learning-live`: students https://tashbar-learning-live.web.app, staff /staff/. Database: Firestore. Server: function `api` (us-east4).
- `src/` app code (still Apps Script style; the Firebase engine `server/runtime.js` runs it unchanged) · `packs/` lesson packs (must match `src/ContentPacks.js` TL_PACKS by sha256) · `web/` site builder · `functions/` server wrapper · `tests/` test kit.
- Coordination: GitHub Issues and pull requests. When you finish, tell the HoS in one line what will go live. The Drive HQ LOG (folder `1NOL4XyWQgf5wm60gGNbmVG6ujY6RBIGS`) still gets a short CHANGE note for anything that goes live.

## How to work
1. Read `CONTRIBUTING.md` (THE RULES). They are binding.
2. One topic per branch (`yourname/short-topic`) and per pull request. Run `node tests/run.js` before opening it; all must pass.
3. **AUTO-PUBLISH (HoS decision 2026-11-18): your pull request goes live by itself.** When the `test` check passes, **auto-publish** merges it and publishes server + site from this repository (about 15 minutes in all). Nobody reviews it, so you are the reviewer: test like it is going straight to the boys, because it is. If tests fail, nothing goes live — fix it on the same branch. To keep a pull request from going live, add the label `hold`. Never deploy by hand, never use clasp.
4. Lesson packs: change the file in `packs/`, then update its line in `TL_PACKS` (sha256 + bytes) in the same pull request. (Until switch-over day, packs also live in Drive "09 CONTENT PACKS"; **sync-packs** copies Drive → GitHub nightly.)

## Teaching standard (HoS, binding on every lesson)
- Each unit opens with a brief, clear, inspiring, patient lesson explaining what is taught (the unit opener), then hands-on practice. Teach real skills; no wasted time.
- No plain multiple choice in practice. Check questions stay tap kinds. Every question has a kid-friendly "How to do it" box.
- Modest, warm, normal frum family life; wide mix of names; kosher food. Never write the Divine Name (use ה׳; אלקים for Elokim). Kodesh is reviewed by a rebbe after it is live.
- No T$ / rewards on staff or admin screens. The server sets every money amount.

## Buttons (HoS decision 2026-11-23, binding)
- Every boy-facing button and piece of information comes from the button system: `src/UiKit.html` (`window.TLK`), rules in `docs/BUTTON-SYSTEM.md`. Do not draw your own buttons, do not restyle the kit, and do not change those rules without the HoS. `tests/lib/uikit.js` checks the kit.

## Quality guardrails (HoS 2026-11-22: "we need safeguards, we need guardrails ... make sure this doesn't keep on happening")
- **The tests are the gate.** Nothing goes live unless `node tests/run.js` passes, and it now checks:
  - **Quality gate** (`tests/lib/obquality.js`): every One Bite lesson with activities must meet the HoS quality rules a script can check (2 + 5 activities, 3+ kinds, no repeats, a mistake activity in do 1–2 or your 1–3, no tiles that only type an answer, spoken lines of 12 words or fewer, a song/move for K–3, "tap the reason" for 4–5, teach-it-back for 6–8, never the word "bite"). **New or changed lessons must pass every rule.** Lessons on `tests/quality-baseline.json` (not yet fixed) may not get worse, and that list may only shrink. Never add a lesson to it, never raise its `frozen` number, never weaken the rules.
  - **K–1 games only** (`tests/lib/k1home.js`): a Kindergarten or Grade 1 boy gets only the full-screen path of real games for his grade, in skill order, with no pop-ups.
- **See it as a boy before you say "done".** For anything a boy sees, play it as a made-up boy at Chromebook size (1366×768) and phone size, LOOK at every screen, and put the pictures in the pull request. Report what the boy sees, not that the tests passed. If you did not look, say so.
- **Independent review for lessons.** Before a lesson PR, a fresh reviewer (one that did not write it) scores each lesson 1–5 on the 9 points of the HoS quality standard, against the lesson data and its full range of check questions. Ship only when every score is 4 or 5, and put the score table in the PR.
- **Match the request, not a nearby idea.** Before building, write in one line what the HoS asked for in his words, and check the finished thing against that line (for example "K–1: only the real games, his grade, in skill order" is not "One Bite lessons on a shelf").

## Tashbar Learning 2.0 (HoS 2026-11-22)
- 1.0 (this app) keeps going exactly as before. 2.0 is a separate, clean app in `v2/` with its own site, https://tashbar-learning-v2.web.app. Read `v2/README.md` before touching `v2/`.
- A 2.0 pull request changes only `v2/` and the shared `art/` library. It goes in only when a person working on 2.0 (anyone the HoS sends the 2.0 instructions to, e.g. Mrs. Khaver, Esti) has her Claude post `APPROVED FOR 2.0 — <name>` after looking at its newest look link.
- Mrs. Khaver and Esti work on 2.0 in their own Claude with `v2/START-PROMPT.md`: one small piece of 1.0 at a time (look at it, decide, build it their way, approve).
- **Post that line only for the person working on 2.0 who, in the same conversation, looked at the newest look link and said to approve. Never post it otherwise, never ask anyone to post it, never merge or publish 2.0 by hand.**

## 2.0 try-out inside 1.0 (HoS 2026-11-25)
HoS: "Put all 2.0 into 1.0 for now, live. Leave 2.0 not live, waiting for the people it is waiting for. Let all the 2.0 requests be tested out live in 1.0."
- `try2/` (at the repository root) is a **copy for testing, not 2.0**. `tools/try2-sync.js` fills it from `v2/app` on main plus every open 2.0 pull request; the 1.0 site serves it at `/try2/`. Boys of the right grade see its pieces; staff and TEST- boys see all of it.
- The 2.0 rules above are unchanged: `v2/`, the 2.0 site, `v2-gate`, `publish-v2` and the approval line stay exactly as they are. Never edit `try2/` by hand (the sync overwrites it) and never change `v2/` from a try2 pull request.
- Builders do not chase 2.0 approvals. Every 2.0 pull request stays open for Mrs. Khaver or Esti.

## Shared art library (HoS 2026-11-24, binding on 1.0, 2.0 and every future app)
HoS: "I want the graphics for 1.0 and 2.0 to all be shared." All art (pictures, photos, drawings, icons, sounds, recorded clips, 3D models saved as files) lives once in `art/` and every app uses it from there. How: `art/README.md`.
- (a) Search `art/CATALOG.md` before ordering or making any art, and reuse what fits.
- (b) Everything made or received goes into `art/` in the same pull request that first uses it: the original (`art/originals/`), the app-ready file (`art/pics/`, `art/sounds/`, `art/models/`) and a catalog row (`node tools/art-catalog.js`, then fill in the row). That covers art made by Claude in code, art from the HoS's image account, and art from any other account. A pull request that changes only `art/` goes live by itself after the tests; one that also changes `v2/` still needs a 2.0 approver.
- (c) Never delete, replace or rename a library item without the HoS.
- (d) Order new pictures from the HoS's image account by email, as a numbered order list with file names, the screen, the size and the exact prompt (example: `docs/core-growth/F-picture-orders.md`). Check the inbox for replies.
- (e) Every item follows the picture rules in `docs/HANDOFF-PICS.md`: boys and men only; modest, frum family life; kosher food; no text inside pictures; no other religions' symbols; no Divine Name. Check every item that arrives against its order before adding it.
- (f) Cast characters look the same in every picture. Use the cast notes in `docs/CORE-GROWTH-LANES.md` and earlier pictures of them (search the catalog by cast name) as the reference.
- Any future app follows the same rule: its art lives in `art/`. `node tests/run.js` fails on a library file with no catalog row, a row with a missing file, an item with no source, licence or alt text, a picture over its size limit, or the same file twice.

## Never
- Real student names, codes or data in the repo, tests, screenshots, issues or chat.
- Ask anyone for a password or a 2-step code. Change Google Cloud permissions, billing or organization policies — tell the HoS what to click.
- Edit the Apps Script editor after switch-over day (until then, only with the HQ EDITOR-LOCK).
