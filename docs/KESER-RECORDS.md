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
| first time | `setupLead` | the setup word, your name | the lead and her or his code (**shown once**) |
| staff | `staffMe` | token | name and role (is the page still signed in?) |
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
- Wrong sign-in tries are counted per device address (an IPv6 home network counts as one), in the same step that checks the code, so guesses sent all at once cannot slip past: 60 for girls and 15 for staff per ten minutes, and 300 per day. Right codes are never counted, so a whole school signing in together is never locked out.
- A session lasts only while the code it was opened with is still her code: a new code ends every old session at once.
- A girl can save up to 5,000 steps a day (so no one can fill the records).
- The very first staff code (the lead) is made once, with a setup word Rabbi Khaver puts in the database himself (below), on the staff page's "First time" screen (`setupLead`). The word is deleted once used, and it works only while there are no staff. (`firstLead` does the same with the server's admin key, for emergencies.)

## The one-time set-up in Google Cloud (Rabbi Khaver)
Until this is done, every Keser call answers "The girls' records are not set up yet." The boys' app is not affected either way.
1. Open https://console.cloud.google.com/firestore/databases?project=tashbar-learning-live
2. Click **Create database**.
3. **Database ID:** `keser` (lower case, exactly).
4. **Edition / mode:** Standard edition, **Native mode**.
5. **Security rules:** **Production rules** (no one can read it from a web page; only our server can).
6. **Location:** **Region** `us-east4 (Northern Virginia)` (the same place as our server).
7. Click **Create database**. Nothing else is needed: the server already has permission for every database in the project.

## The very first staff code (Rabbi Khaver, once, after the database is made)
1. In the same page (Firestore), open the database **keser**.
2. Click **Start collection**. Collection ID: `sys`.
3. Document ID: `setup`. Add one field: name `word`, type **string**, value: a setup word you make up (at least 8 letters; do not share it).
4. Click **Save**.
5. Open the Keser staff page, tap **First time**, type the same setup word and your name. Your staff code shows once: write it down. The setup word is then deleted by itself.

## Or: the keser-setup job does both (HoS 2026-11-26: "I give you permission to create the girls database ... and the setup word")
`.github/workflows/keser-setup.yml` (run by hand, main only, with the keyless Google pass the app is published with):
it makes the `keser` database (us-east4, no web-page access) if it is missing, and puts in only the **sha256** of a setup word
(`sys/setup.hash`), never the word. The Head of School is given the word privately and types it on the staff page's "First time" screen.
Nothing is replaced once a lead exists.
