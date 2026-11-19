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

## Never
- Real student names, codes or data in the repo, tests, screenshots, issues or chat.
- Ask anyone for a password or a 2-step code. Change Google Cloud permissions, billing or organization policies — tell the HoS what to click.
- Edit the Apps Script editor after switch-over day (until then, only with the HQ EDITOR-LOCK).
