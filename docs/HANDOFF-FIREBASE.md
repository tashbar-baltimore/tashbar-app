# Hand-off: finishing the move to Firebase

For any Claude Code session, on any account, that continues this work. Read this page, then `docs/FIREBASE.md`.

## What you need
1. This repository (`tashbar-baltimore/tashbar-app`) attached to the session. It is private: the account's Claude GitHub App must be given access to it.
2. A clasp sign-in as the Head of School (his school Google account, the owner of the Apps Script project): run `clasp login --redirect-port 8976` in the background, give him the Google link, he pastes back the `http://localhost:8976/?...` address, send that address once with `curl --noproxy '*'`. Never ask for a password or a 2-step code. Never probe the port. The sign-in expires about once a day (`invalid_rapt`); ask again when it does.
   - That one sign-in also works for Firebase and Google Cloud: `python3 web/token.py /tmp/.fbtok` writes a short-lived token; use it as `CLOUDSDK_AUTH_ACCESS_TOKEN` with `CLOUDSDK_CORE_PROJECT=tashbar-learning-live` and `CLOUDSDK_BILLING_QUOTA_PROJECT=tashbar-learning-live`.
3. The Google Drive connector, for the LOG folder `1NOL4XyWQgf5wm60gGNbmVG6ujY6RBIGS` and HQ folder `15aIi2etSxxLnfsUKO3_N1KGZGsxWSuHx`.
4. Set `NODE_USE_ENV_PROXY=1` for clasp and node network calls in the cloud container. `.clasp.json` needs `{"scriptId":"1Nk4F9WGVvZDpknUzcdJzdSNSiJrEufWpl-P5P62s15B3iWf0lLHHyvnf","rootDir":"."}` in a folder OUTSIDE the repository for pulls and pushes of the live editor.

## Rules that do not bend
- The Apps Script editor is shared with other builders. Before any push: check the LOG for an open `CLAIM__EDITOR-LOCK` with no release, write your own CLAIM, pull to a temp folder and diff against your base, push ONE batch, pull back and diff, `clasp create-version`, read the number from its output ("Created version N"), `clasp update-deployment <id> -V N` for BOTH deployments, check both `/exec` links answer 200 with no Google sign-in page, write `CHANGE+RELEASE` in the LOG. Keep `appsscript.json` `webapp.access` = `ANYONE_ANONYMOUS`.
- Never type a sign-in code. Never put real student names or data in the repository, the LOG, tests or chat. Student rows travel server to server only (Apps Script to the Firebase function); do not pull them onto the session's machine.
- Money: the server sets every amount. Do not change a pay rule. Any difference between the two systems' balances stops the switch.
- Do not change the organization's security policies. If Google refuses something, tell the Head of School what to click.
- Short, plain-language updates. He is not technical.

## Where things are (2026-11-16)
- Live Apps Script: v306 or later. `src/ApiRoute.js` there has `doPost` + `API_ALLOW`, `apiKidPage`, `apiStaffPage`, `apiExport` (read-only export, key-protected).
- Firebase project `tashbar-learning-live`, billing on. Hosting: student app `https://tashbar-learning-live.web.app`, staff `/staff/`. Function `api` at `https://api-q26c275eaa-uk.a.run.app` (us-east4, public). Firestore `(default)` in us-east4.
- The function answers `ping`, `msQuestTools`, `msQuestToolsParts`, `apiKidPage`, `apiStaffPage` itself and passes every other call to Apps Script.
- The engine that will take over the rest is built and tested with made-up students: `server/runtime.js` (runs `src/*.js` unchanged) and `server/fsstore.js` (data in Firestore). Test lane on the live function: `fbtest: "SELFTEST_<number>"`.
- The export key is in Secret Manager: secret `tl-export-key` in the Firebase project (the function's service account may read it). Its SHA-256 is `API_EXPORT_HASH` in `ApiRoute.js`. Never print it or commit it.
- Students still use the Apps Script `/exec` links. No real student data is in Firestore.

## Commands
```bash
node server/selftest.js            # real server code in plain memory, made-up students
node server/fstest-local.js        # Firestore layer on a stand-in database, compared with the one-at-a-time run
NODE_USE_ENV_PROXY=1 node server/fbtest-http.js   # the same on the live Firebase function
./tools/deploy-function.sh         # deploy functions/ (copies server/ and src/ in first)
./web/refresh.sh "note"            # rebuild Hosting from the live server and deploy
node tests/run.js                  # the page test kit
```
After pulling the live editor, copy its `.js`, `.html` and `appsscript.json` into `src/` before deploying the function, so Firebase runs the same code that is live.

## What is left, in order
1. **Import.** Add an admin action to the function (guarded by the export key) that pulls every tab of the `main` and `canteen` books through `apiExport(key,'rows',book,tab,[from,n])` and stores them in Firestore under a staging book (same block layout as `fsstore.js`; choose rows-per-block so a block stays under about 700 KB: `MS_State` and the `TL ...` record tabs hold cells up to 45,000 characters). Compare the md5 of each block (`sum`) with what was stored. Import `apiExport(key,'props')` into `sys/props`. Sizes on 2026-11-16: main 57 tabs, about 33,600 rows (TL Money 18,464; MS_Evidence 12,350); canteen 25 tabs, about 19,000 rows.
2. **Fidelity.** Google Sheets changes what is typed ("12" becomes 12, dates become dates, text columns keep text). `runtime.js` `coerce()` is an approximation. Use the imported copy to compare read-only calls on both systems and fix differences. The function should do the comparing and report only "same" or which fields differ, never the values.
3. **Stand-ins still missing:** DriveApp (photos, music, pack health), DocumentApp, MailApp, timers (`ScriptApp.newTrigger`), `SpreadsheetApp.create` (money archive).
4. **Speed.** Each tab or cache entry the code touches costs a rerun. Batch them: remember each function's needs (done for tabs), load cache keys by pattern, and consider per-block versions so two saves for different students do not collide on the whole tab.
5. **Shadow run**, then test students, then one class, then everyone. Copy Firestore back to Sheets nightly. Keep Apps Script ready to switch back. Remove `apiExport` when finished.

## Starter prompt for the next session
```
You are continuing the move of the Tashbar Baltimore learning app from Google Apps Script to Firebase.
The repository tashbar-baltimore/tashbar-app is attached. Read docs/HANDOFF-FIREBASE.md and docs/FIREBASE.md
first and follow the rules there exactly. Then: (1) tell me in 5 short lines what is live and what is left,
(2) get a clasp sign-in from me the way the hand-off describes, (3) run the three server tests to confirm
nothing broke, (4) carry on with the next unfinished item under "What is left, in order".
Work on your own. Stop only when I must sign in to Google or make a real decision. Short, plain updates.
```
