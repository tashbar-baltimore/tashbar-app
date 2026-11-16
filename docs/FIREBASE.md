# Moving off Apps Script to Firebase: where it stands

Project: `tashbar-learning-live` (billing on). Head of School decision 2026-11-16: Firebase is part of the school's own system.

## Live now
| Piece | Address | What it is |
|---|---|---|
| Student app | https://tashbar-learning-live.web.app | Exact copy of the live student page and lesson packs, on Firebase Hosting |
| Staff portal | https://tashbar-learning-live.web.app/staff/ | Exact copy of the live staff portal (`?sg=1` goes there too) |
| Server | https://api-q26c275eaa-uk.a.run.app | Cloud Function `api` (region us-east4). Answers MOVED calls itself, passes the rest to Apps Script |
| Database | Firestore `(default)`, us-east4 | Created, EMPTY. No student data has been moved |

The old `/exec` links still work exactly as before and are what students use until the Head of School switches them.

## How the pieces fit
- `web/build.js` builds the hosted pages FROM THE LIVE SERVER (`apiKidPage`, `apiStaffPage`, `msQuestTools`, `msQuestToolsParts`).
- `web/boot.js` runs first on each page: stands in for `google.script.run`, loads lesson pieces from the fast host, then checks with the server in the background and keeps a newer page or newer pieces on the device for the next open. `web/sw.js` serves a kept page.
- `web/refresh.sh` rebuilds and deploys Hosting in one step (needs clasp signed in as the owner).
- `src/ApiRoute.js` (in the Apps Script project): `doPost` with an allow-list (`API_ALLOW`), plus `apiKidPage` and `apiStaffPage`. A new server function called by a page must be added to `API_ALLOW`.
- `functions/index.js`: the Firebase server. `MOVED` lists the calls it answers itself.

## Moved to Firebase so far (no student data)
`ping`, `msQuestTools`, `msQuestToolsParts`, `apiKidPage`, `apiStaffPage`. These are the calls every device makes on opening. The function asks Apps Script once every 2 minutes and answers everyone from memory: about 0.1 s each instead of 5 to 13 s, and no load on Apps Script.

## The engine for the rest (built and tested, not carrying real data)
- `server/runtime.js` runs the app's own server code (`src/*.js`) UNCHANGED outside Apps Script, on stand-ins for SpreadsheetApp, CacheService, LockService, PropertiesService, Utilities and HtmlService. A fresh copy of the code starts for each request (about 8 ms).
- `server/fsstore.js` keeps that data in Firestore: each spreadsheet tab is stored as blocks of rows. Data is loaded when the code first touches it and the function is run again. A change is written in ONE transaction that first checks no tab it read has changed; otherwise everything is reloaded and the function runs again. Nothing a half-finished run wrote (rows, cache, settings) carries into the next run.
- The function has a TEST LANE (`fbtest: "SELFTEST_<number>"`) that runs this on Firebase with made-up practice students only. Real calls never take that path and it refuses any other book name.

### Tests (all with made-up students)
| Test | What it shows |
|---|---|
| `node server/selftest.js` | the real msBootstrap, msSignInCode, msLoad, msSave run in plain memory; a made-up reward is refused; a repeated save pays once |
| `node server/fstest-local.js` | the Firestore layer (stand-in database) gives exactly the same balances as the one-at-a-time memory run, including 6 saves at the same moment |
| `node server/fbtest-http.js` | the same on the LIVE Firebase server and real Firestore: balances 82.5 and 68, every ledger entry exactly once |

Measured on Firebase (2026-11-16): sign-in about 0.5 s, load 0.7 to 1.5 s, save about 1 s, six saves at once 2 to 6 s each. Apps Script: 4 to 5 s for the simplest call, and about 30 at once.
The Firebase times are high because each tab or cache entry the code touches costs one rerun; batching those is the next speed step.

## Still to do before real students use it
1. Copy the school database (every tab) from Google Sheets into Firestore, and check it row for row. The clasp sign-in cannot read Sheets, so this needs an export call inside the Apps Script project.
2. Google Sheets auto-typing: the stand-in turns "12" into 12, "TRUE" into true and simple dates into dates. Real data will show where it differs; compare results call by call before trusting it.
3. Stand-ins not built: Google Drive (photos, lesson packs come from the fast host instead), Google Docs, email, timers.
4. Shadow run: send real calls to both servers, answer from Apps Script, compare the answers, fix differences.
5. Switch test students, then one class, then everyone; copy Firestore back to Sheets nightly so reports keep working; keep Apps Script ready to switch back.

## Order of the move
1. Sign-in (`msSignInCode`, `msSignInFast`), load (`msLoad`), save (`msSave`): needs student state in Firestore, a copy back to Sheets so staff screens keep working, and test students first.
2. Money (`Money.js`, `msCheckPay_`, store, interest, prizes): port the rules unchanged, compare every balance against the Sheets ledger nightly before switching.
3. Staff screens (`sg*`, `cr*`, `ac*`, `sb*`): one tab at a time, reading only what each screen needs.
4. Then retire Apps Script.

Measured pass-through times that show why: a simple call 4 to 5 s, `sgLoad` 16 s.

## Deploying
- Hosting: `./web/refresh.sh "note"`.
- Function: `gcloud functions deploy api --gen2 --region=us-east4 --runtime=nodejs22 --source=functions --entry-point=api --trigger-http --allow-unauthenticated --memory=1Gi --timeout=300s --max-instances=50 --min-instances=1` with an access token from the clasp sign-in (`web/token.py`).
- The clasp sign-in expires about once a day (school Google policy). A deploy service account would remove that; not set up yet.

## Things the owner changed by hand
- Firebase project created; Blaze billing turned on.
- Organization policy "Domain restricted sharing" overridden to Allow all for this one project, so the function can be public.
