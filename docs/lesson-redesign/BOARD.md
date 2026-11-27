# New Lessons board (HoS 2026-11-27)

Every lesson moves to the new shape in `DESIGN.md` (THINK, LEARN, TRY IT, SHOW ME, DONE). This board lists the work, one row per job.
The prompts for builder accounts are in `PROMPTS.md`.

**What the HoS asked for:** "Redo the way lessons are taught. Much better informative graphics, interactive lessons and fun different ways to learn. Simple, quick, super kid-friendly language. Text easy and fun to read, laid out nicely, the words that matter highlighted. Hooks never repetitive, never the same three things. Fewer, deeper activities. Done in 1.0. Go live."

## How to claim (builders)
1. Read this file on a fresh `origin/main`, and list the open pull requests titled `New Lessons claim: …`.
2. Take the first `OPEN` row, top to bottom, that has no open claim pull request.
3. Open a pull request titled `New Lessons claim: <ID>` that changes **only your row**: status `TAKEN`, your session link, the time (UTC) and "where I am". It is docs only and goes live by itself.
4. Redo the row's lessons in batches of about 6–10 (one pull request per batch). Update your row each time you ship and when you stop. Mark it `DONE` only when every lesson in the row is live on main in the new shape.

**Stale:** a `TAKEN` row with no commit, no open pull request and no update for **6 hours** is `OPEN` again. The next builder carries on from where it stopped.

## Progress
_Lessons in the new shape: the test prints `newShapeLessons` (tests/lib/obquality.js). About 734 lessons have activities._

| Row | Job | Lessons (levels) | Files | Status | Owner (session link) | Last update (UTC) | Where I am / pull requests |
|---|---|---|---|---|---|---|---|
| P0 | Engine + 3 sample lessons | MATH.OPS.L03.01, READ.COMP.L05.05, SS.GEO.L07.01 | src/OneBite.html, src/UiKit.html, tests | DONE when live | https://claude.ai/code/session_015qpxB9anh6EkNUEJ97DHM5 | 2026-11-27 | This pull request |
| M1 | Math Grades 2–3 | MATH.* L03–L04 (about 40) | src/OneBiteDataMath*.html | TAKEN | https://claude.ai/code/session_01Cri5bRC4HsP9vYnMCURp1S | 2026-11-27 17:04 | Claimed; reading the lessons, batch 1 next |
| M2 | Math Grades 4–8 | MATH.* L05–L09 (about 22) | src/OneBiteDataMath*.html, src/OneBiteDataUpper.html | OPEN | | | |
| R1 | C45 Grade 4 reading, part 1 | READ.* L05 in C45 (first 30) | src/CoreDataC45*.html | TAKEN | https://claude.ai/code/session_01JPKZXGrA39PYd4bzsQc36i | 2026-11-27 17:10 | Claimed; starting batch 1 (first 6-10 lessons) |
| R2 | C45 Grade 4 reading, part 2 | READ.* L05 in C45 (other 30) | src/CoreDataC45*.html | OPEN | | | |
| R3 | C45 Grade 5 reading, part 1 | READ.* L06 in C45 (first 31) | src/CoreDataC45*.html | OPEN | | | |
| R4 | C45 Grade 5 reading, part 2 | READ.* L06 in C45 (other 31) | src/CoreDataC45*.html | TAKEN | https://claude.ai/code/session_01HB2X6azif4KsNBt5xr8e8K | 2026-11-27 17:18 | Claimed. My 31 = rows 32–62 of the C45 teaching order (src/CoreDataC45.js): READ.LIT.L06.31–41 (Lighthouse 2–12) and READ.FLU.L06.11–30 (Read It 3 Times). Batch 1 (Lighthouse) next |
| R5 | C68 Grades 6–8 reading | 37 lessons (L07–L09) | src/CoreDataC68*.html | OPEN | | | |
| R6 | F Grade 2 fluency + C23 | 39 + 3 lessons (L03) | src/CoreDataF*.html, src/CoreDataFH*.html, src/CoreDataC23*.html | OPEN | | | |
| R7 | Other reading, language, writing (not in a job) | READ.*, LANG.*, WRIT.* in OneBiteData*.html, L03+ (about 40) | src/OneBiteDataRead*.html, src/OneBiteDataWrit.html, src/OneBiteDataUpper.html | OPEN | | | |
| G1 | Grammar Grades 2–4 | G lessons L03–L05 (49) | src/CoreDataG*.html | OPEN | | | |
| G2 | Grammar Grades 5–8 | G lessons L06–L09 (53) | src/CoreDataG*.html | OPEN | | | |
| W1 | Writing Grades 2–3 (W13) | 37 lessons (L03–L04) | src/CoreDataW13*.html | OPEN | | | |
| W2 | Writing Grades 4–5 (W48) | 50 lessons (L05–L06) | src/CoreDataW48*.html | OPEN | | | |
| W3 | Writing Grades 6–8 (W48) | 57 lessons (L07–L09) | src/CoreDataW48*.html | OPEN | | | |
| S1 | Social Studies | SS.* (about 30) | src/CoreDataS*.html, src/OneBiteData*.html | OPEN | | | |
| S2 | Science | SCI.* (20) | src/CoreDataS2.html, src/CoreDataS3.html and the other src/CoreDataS*.html | OPEN | | | |
| K1 | Kodesh (Chumash, Kriah, Halacha, Tefillah, Navi, Mishnah) | LK.* (65) | src/OneBiteDataKodesh.html (and src/KriyahMore.html) | OPEN | | | Kodesh: REBBE review after live |
| L1 | Young levels (seen as bridges and by older boys filling gaps; K–1 boys play the K–1 games) | MATH.*, READ.* L01–L02 (about 70) | src/OneBiteData*.html | OPEN (last) | | | |

## Rules for every row (binding)
- Follow `DESIGN.md` and CLAUDE.md. The quality gate (`node tests/run.js`) must pass; it checks the new rules, including hook variety inside a set.
- **Every hook in a set is a different kind** where you can; never the same kind twice in a row, never one kind for more than a third of a set.
- Keep every check question (Show me) as it is unless a fresh reviewer finds it wrong. Every check question must be answerable from what the lesson now teaches.
- A fresh reviewer (one that did not write the lessons) scores each lesson 1–5 on the 9 points against the lesson data and its full range of check questions. Ship only when every score is 4 or 5. Put the table in the pull request.
- Play every lesson as a made-up TEST- boy at 1366×768 and phone size (`node tools/lesson-redesign/audit.js OUTDIR ID,ID`), LOOK at every screen, and put pictures in the pull request.
- Pictures and art: search `art/CATALOG.md` first; new art goes in `art/` (CLAUDE.md "Shared art library").
