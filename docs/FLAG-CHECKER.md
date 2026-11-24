# The flag checker (runs every hour by itself)

**What the HoS asked for (2026-11-24, his words):** "they should be able to type what the problem is, and then you, every hour, you fix it, some sort of automatic way. And yeah, they should all go live by themselves. No one's gonna have time to keep checking in on this." Also: a flag must **not** knock a question out by itself ("maybe it's a great question ... and the kid just doesn't know the answer and he flagged it improperly").

So a flag never changes anything on its own. Every hour, a Claude Code session (a scheduled task, no API account) does this:

1. Reads the open flags.
2. Investigates each flagged question in this repository.
3. Decides whether the flag was right. If yes, it fixes the question (or takes it out) in a normal pull request, which auto-publish sends live after the tests.
4. Marks each flag with its decision and a one-line reason. Staff can see the reason on the staff screen.

## The parts
- **Boy side:** `src/Helpers.html`, item 1. He taps 🚩 and picks one of 4 reasons. Grade 2 and up can then write what is wrong (optional, 300 letters).
- **Server side:** `src/Reports.js`. Reports are rows in the `Problem_Reports` tab: `status` is `open`, `fine`, `fixed` or `done` (done = a staff member marked it), and `checker` holds the checker's note. `rpBotList_` and `rpBotMark_` are the checker's functions.
- **The door:** `functions/index.js` admin actions `flagList` and `flagMark`, which need the export key. Only the workflow `.github/workflows/flag-checker.yml` has the key. It reads it from Secret Manager the same way `sync-packs` does.
- **What leaves the server:** the question text, skill id, reasons, boys' notes with every roster name blanked to `[name]`, and answer counts. Never a student id or name.

## Each hourly run, step by step (for the checker session)

### 0. Finish last hour's work first
List open pull requests whose branch starts with `claude/` and whose title starts with `Flag fix:`. If one has a failed `test` check, read the failing test, fix it on the same branch and push. If it cannot be fixed in this run, close the pull request. Then run `mark` with `open` for its questions, adding "fix did not pass the tests; still open".

### 1. Read the flags
- Use the GitHub MCP tool `actions_run_trigger` to run workflow `flag-checker.yml` on `main` with `action=list`.
- Wait until that run finishes. Check with `actions_list` / `actions_get` about every 20 seconds, for at most 5 minutes.
- Read the job log (`get_job_logs`) and take the JSON between `===FLAGS-JSON-START===` and `===FLAGS-JSON-END===`.
- If `open` is 0, stop. Say "No open flags" and end the session.
- Keep the `upTo` number: `mark` needs it.

Each flag has these fields:
- `skill`: the lesson or skill id.
- `phase`: where in the lesson it was (practice, check and so on).
- `item`: the question text the boy saw.
- `open`: how many open reports.
- `staff`: how many of the reports came from staff.
- `reasons`: wrong / confusing / broken / other.
- `notes`: what the boys or staff wrote.
- `before`: earlier decisions on this same question.
- `answers`, `wrong`, `boys`: how many times it was answered, how many answers were wrong, and how many different boys answered it.

### 2. Investigate each flagged question
Find the question in this repository. Search for the `item` text (or a distinctive part of it) and the `skill` id in `packs/`, `src/` and `src/CurriculumIndex.js`. Some questions are made by a generator, for example math with random numbers. Then find the generator and check the rule it follows, not just this one case.

Read the question with what surrounds it: its answer, its choices, the "How to do it" box, the picture or sound it names, the lesson's opener, and the other questions in that lesson. Then decide which of these it is:

- **REAL PROBLEM:** fix it. Examples:
  - The answer key is wrong, or more than one choice is right.
  - The question gives the answer away.
  - The words don't match the picture or sound, or the picture or sound is missing.
  - A typo changes the meaning.
  - The question asks about something the lesson never taught.
  - The "How to do it" box is missing or wrong.
  - It is unclear for the boy's grade.
  - It breaks the teaching standard in `CLAUDE.md`.
- **FINE:** the question is right and clear, and the boy most likely just didn't know the answer. Clues:
  - Most boys answer it right (look at `answers` and `wrong`).
  - The note shows he misunderstood the skill.
  - "Wrong" was picked but the key is right.
  - Mark it `fine`, with a short reason a rebbe would accept, for example "Answer 12 is right: 3 groups of 4. Most boys get it right."
- **NOT SURE:** the question is about meaning in Kodesh text, the note points to something you cannot check from the repository, or the evidence is mixed. Mark it `open`, with what you found, so a person sees it on the staff screen.

Be fair both ways. Never mark a question `fine` only because few boys flagged it, and never "fix" a good question only because a boy said it was wrong. Many reports, many wrong answers and clear notes all point toward a real problem.

`before` matters. If it says `fine` and new reports keep coming, look again with fresh eyes. Several boys hitting the same thing is a real signal.

### 3. Fix the real problems (one pull request for this run)
- Make the smallest change that fixes it. If a question cannot be made good, take it out, and keep the lesson valid (the minimum number of questions, kinds and so on).
- **Lesson packs:** change the file in `packs/`, then update its line in `src/ContentPacks.js` `TL_PACKS` (sha256 and bytes) in the same pull request. See `CLAUDE.md` step 4.
- **Kodesh:** fix only plain mistakes (a typo, a wrong answer key, a picture mismatch, an answer given away). Never change the meaning of a pasuk, a Rashi or a halacha. Mark those `open` for a rebbe. Never write the Divine Name (use ה׳, and אלקים for Elokim).
- Follow `CLAUDE.md` and `CONTRIBUTING.md`: the teaching standard, the button system, the quality gate (a lesson on `tests/quality-baseline.json` may not get worse), and no real student names or data anywhere.
- Run `node tests/run.js`. Everything must pass. If one fix breaks the tests and you cannot mend it, leave that fix out and mark that question `open` with the reason.
- **Open ONE pull request** titled `Flag fix: <date> <hour> (<n> questions)`. For each question, the body has the skill, the old text and answer, the new text and answer, the reason, and how many boys flagged it. It never includes student names. End it with the attribution lines your session gives you. Do **not** add the `hold` label. The HoS decided these go live by themselves.
- If a fix changes what a boy sees on the screen (not only words or an answer key), play that question as a made-up boy at 1366×768 and look at it before you open the pull request. Say in the pull request what the boy now sees.

### 4. Mark every flag you read
Run `flag-checker.yml` on `main` again with:
- `action=mark`
- `upTo` = the number from the list
- `marks` = a JSON list like `[{"skill":"...","item":"<exact item text from the list>","verdict":"fine|fixed|open","why":"one short line"}]`

Rules for marking:
- Use `fixed` for questions in the pull request. Put the pull request link in `why`.
- Only reports made at or before `upTo` are changed. Newer ones stay open for the next hour.
- Keep `why` under 300 letters, plain and kind. Staff read it.

### 5. End
Say in one or two lines: how many flags, how many were fine, how many were fixed (with the pull request link), and how many were left for a person. Do not message the HoS. The staff screen shows the notes.

## Limits that keep it safe
- A flag alone never changes or hides a question. Only a checked fix in a pull request that passes the tests does.
- At most 40 questions a run, and 60 marks a run.
- No student ids or names ever leave the server through this door. The workflow log holds questions and blanked notes only.
- **When it runs:** at 13 minutes past each hour, 7 am to 9 pm Sunday to Thursday, and 7 am to noon on Friday (Baltimore time). It does not run on Shabbos. Flags that come in then wait for Sunday morning. It runs as scheduled tasks named "Flag checker", in the Claude Code session that built it.
- To pause the checker: turn off those scheduled tasks (claude.ai → Scheduled tasks), or add `hold` to its pull requests.
