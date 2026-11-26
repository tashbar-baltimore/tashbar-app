# Keser Girls 3.0 · the girls' records (server)

The girls' records live in their **own Firestore database, named `keser`**, in project `tashbar-learning-live`, never in the boys' database (M. Heinemann, 2026-11-26, choice 1). The code is `server/keser.js` and its tests are `tests/lib/keserserver.js`. The rules are written at the top of `server/keser.js`.

## How a page calls it
POST to the server function `api` (the same address the boys' app uses) with
`{ "api": 1, "keser": "<call>", "args": [ ... ] }`. The answer is `{ ok: true, result }` or `{ ok: false, error: "<plain sentence>" }`.

| Who | Call | Sends | Gets |
|---|---|---|---|
| girl | `signIn` | her 6-digit code | `token`, `me` (first name, grade, class, crown, place) |
| girl | `me` | token | herself (never anyone else) |
| girl | `saveSteps` | token, up to 60 steps `{ sid, lesson, step, q, right, ms, done }` | how many were saved |
| staff | `staffSignIn` | 8-digit staff code | `token`, name, role |
| staff | `girls` | token | every girl: id, first name, grade, class, crown, place (never a code) |
| staff | `addGirl` | token, `{ first, grade, cls, crown }` | the girl and her code (**shown once**) |
| staff | `editGirl` | token, girl id, any of `{ first, grade, cls, crown }` | the girl |
| staff | `newCode` | token, girl id | her new code (**shown once**); the old one stops and she is signed out |
| staff | `girlCard` | token, girl id | the girl, `finished`, `notDone`, `hard` (questions she got wrong most), `last` |
| lead | `addStaff` | token, name | the staff member and her code (**shown once**) |
| anyone | `signOut` | token | done |

- `sid` is the device's own id for a step, so a step sent twice is kept once.
- Grades: K, 1–8. Crown colours: gold (default), rose, pearl, sapphire, emerald, amethyst, ruby. Everyone starts at place `start`.
- Wrong sign-in tries are limited per device address: 60 for girls and 15 for staff, per ten minutes.
- The very first staff code (the lead) is made once with the server's admin key (`firstLead`), only while there are no staff. Piece 2 (staff sign-in) decides how the lead gets it.

## The one-time set-up in Google Cloud (Rabbi Khaver)
Until this is done, every Keser call answers "The girls' records are not set up yet." The boys' app is not affected either way.
1. Open https://console.cloud.google.com/firestore/databases?project=tashbar-learning-live
2. Click **Create database**.
3. **Database ID:** `keser` (lower case, exactly).
4. **Edition / mode:** Standard edition, **Native mode**.
5. **Security rules:** **Production rules** (no one can read it from a web page; only our server can).
6. **Location:** **Region** `us-east4 (Northern Virginia)` (the same place as our server).
7. Click **Create database**. Nothing else is needed: the server already has permission for every database in the project.
