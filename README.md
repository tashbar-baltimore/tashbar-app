# Tashbar Baltimore learning app

A Google Apps Script web app for the school: lessons, Teacher Time, the store and bank, the Chavrusa Arena, and the staff portal. Students use it on Chromebooks and phones.

This repository is where the app is built. **Nobody edits in the Apps Script editor and nobody publishes by hand.**

## What is where
| Folder | What it holds |
|---|---|
| `src/` | The Apps Script code, exactly as it runs (`.js` = server, `.html` = pages and add-ons) |
| `packs/` | The big lesson packs (the live app reads these from Google Drive; see "Lesson packs" below) |
| `tests/` | The automatic tests (pretend server, made-up kids only) |
| `.github/` | The buttons: test, push-to-test, publish, rollback |
| `docs/` | The current state, the lesson guide, how publishing works |

## How a change gets to the students
1. A creator makes a branch and opens a **pull request**. The **test** check runs by itself.
2. The Head of School or a lead reads it, taps **Approve**, then **Merge**.
3. Merged work waits on `main`. Students do not see it yet.
4. When ready: the Head of School tells one builder chat **"publish"**. Both live links move to one new version, with a release note listing what was merged.
5. If something is wrong: tell that chat **"roll back to version N"**.

## Start here
- Creators: read [CONTRIBUTING.md](CONTRIBUTING.md), then [docs/HOW-TO-WRITE-A-LESSON.md](docs/HOW-TO-WRITE-A-LESSON.md).
- What is live now: [docs/STATE.md](docs/STATE.md).
- How publishing is wired and what the owner must set up: [docs/PUBLISHING.md](docs/PUBLISHING.md).

## Run the tests yourself
```bash
node tests/run.js
```
It needs Node 22 and Playwright with Chromium. Options are listed at the top of `tests/run.js`.

## Lesson packs
Fourteen large lesson files live in Google Drive, and `src/ContentPacks.js` lists each one with a fingerprint (sha256). `packs/` holds the same files so the tests can read them. The tests fail if a file in `packs/` does not match the table. Changing a pack is a two-part job today; see [docs/PUBLISHING.md](docs/PUBLISHING.md).
