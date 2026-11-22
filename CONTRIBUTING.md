# How we work

## THE RULES
- Work on your own branch. One topic per pull request. Small is better.
- Never edit in the Apps Script editor. Never publish by hand. Only the publish button goes live.
- Tests must pass. Include a phone-size screenshot for anything kids see.
- No `//` comments in add-on `.html` files (use `/* */`). A new boy add-on must be registered in `Photos.js` AND `Speed.js`. Apps Script forbids a `.js` and `.html` with the same base name.
- Never write the Divine Name: use ה׳, and אלקים for Elokim.
- No real student names, codes or data in the repository, tests, screenshots or issues.
- Don't send any weekly summary or email to anyone automatically.
- Never ask anyone for a password or 2-step code.

## More rules the app already depends on
- Money: the server sets every amount. Do not add new money rewards or change what money is worth without a Head of School decision.
- `src/appsscript.json` must keep `webapp.access` = `ANYONE_ANONYMOUS`. The tests fail if it changes.
- `QuestPage.html` is at its size limit. New student-page code goes in its own add-on file.
- Content follows the Head of School's Family Life decision (2026-11-15): modest, warm, normal frum family life; a wide mix of names; kosher food.
- Kodesh content is reviewed by a rebbe after it is live. Say so in the pull request.
- Every question needs a kid-friendly "How to do it" box.
- Quality guardrails (HoS 2026-11-22): the tests run a quality gate on every lesson and a K–1 games-only check; new lessons must pass every rule, and the to-fix list may only shrink. Look at what a boy sees (pictures in the PR) and get an independent review before you call anything done. Details: CLAUDE.md, "Quality guardrails".

## Step by step
1. Pick an issue from the Work Queue and say you are taking it.
2. Make a branch: `yourname/short-topic`.
3. Make the change. Run `node tests/run.js`. To play your own lessons to the end, add `PLAY=LK.CHU.L03` (an id or the start of an id).
4. Take a phone-size screenshot (390 px wide) of anything students see.
5. Open a pull request with the template filled in. Link the issue.
6. A lead approves and merges. You never publish.

## What the tests check
- Every file parses, the access setting is unchanged, the lesson packs match the table.
- The student page and the staff portal open with no errors.
- Every lesson builds with well-formed questions; a sample is played start to finish to "mastered".
- The number of check questions whose answer was never taught must not go up (the starting number is in `tests/baseline.json`).
- Timings and the number of server calls are printed; put them in your pull request.
