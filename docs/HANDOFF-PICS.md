# Hand-off: PICS-1, real pictures across the whole app

For any Claude Code session that continues this work. The starter prompt is at the bottom.
CLAUDE.md wins where anything here differs: publish ONLY by pull request (auto-publish), never by hand, never clasp.

**Shared art library (HoS 2026-11-24):** every picture lives once in `art/` (see CLAUDE.md, "Shared art library", and `art/README.md`). Search `art/CATALOG.md` before finding or ordering a picture; a new picture goes into `art/pics/` with a catalog row in the same pull request.

## What PICS-1 is
- Every lesson screen that talks about something a boy should see gets a real photo, scan, drawing or model, not an emoji.
- When the screen's "how" line teaches a part of the thing, that part gets a red box, an arrow and a short label.
- Approved by developer@ and the Head of School.

## Where it stands (2026-11-21)
- Round 1 is live: 11 pull requests (#70, #89, #92, #93, #94, #95, #96, #99, #104, #106, #108), one per subject.
  **2,862 screens have pictures, using 480 pictures.** Each subject has a CHANGE+RELEASE note in the HQ LOG.
- Round 2 (8 groups: Kodesh x3, electives x2, computing, social studies, science and life-skills sweep) was being
  worked on screens that still had no picture. Check `git log --grep "PICS-1"` on main to see what landed.
- What is left is mostly screens with nothing to see (reading Hebrew, grammar, number, choice and sort screens).
  Many were skipped on purpose. Only add a picture where it clearly helps and every rule passes.

## How it works (all on GitHub `main`)
- `src/RealPics.html` holds everything. `TL_PICS` is the library: id -> {file, w, h, alt, source, licence, author}.
  `TL_PIC_MAP` maps `'LESSON.ID|exact question'` -> `{id, mark:[{box:[x,y,w,h] %, label, from, at}], cap, keep}`.
  Each batch is its own `TL_PIC_ADD({...lib}, {...map})` block at the end of the file.
- `art/pics/` (the shared art library) holds the files (WebP, <=1100 px wide, <=200 KB; aim for 150 KB). `art/CATALOG.md` has one row per file (`node tools/art-catalog.js` adds it; `web/pics/SOURCES.md` was merged into it on 2026-11-24).
- `node tests/run.js` runs `tools/pics-check.js`, so a bad link fails the `test` check and nothing goes live. The checker fails on:
  - a link to a screen that does not exist;
  - a picture missing source, licence, author or alt;
  - a file over 200 KB or wider than 1200 px;
  - a mark on a screen with an empty "how" line;
  - a label word that the "how" line does not teach.

## PICS-2 (from 2026-11-23): pictures where the TEACHING happens
- Round 1 and round 2 put a picture on question screens. PICS-2 goes to unit openers, teach / "how to do it" screens,
  One Bite lessons (TODAY WE LEARN, worked examples, activities) and reading passages.
- Order: unit openers -> One Bite -> reading passages -> science / social studies / life skills / electives teach screens ->
  Kodesh teach screens (REBBE list) -> upgrades of weak live pictures -> round-2 leftovers (thermometer with no numbers,
  rain gauge, the ~30 screens un-linked from Capitol, White House, Liberty Bell, Louisiana map, transistor).
- One PICS-2 pull request open at a time; title starts "PICS-2".
- Teaching screens use `src/RealPicsTeach.html` (loads after One Bite) with the same TL_PICS library and TL_PIC_ADD blocks. Keys:
  - `'SKILL.ID|@today'`: TODAY WE LEARN (the unit opener); replaces the big emoji. A UNIT prefix works too (`'SCI.ANIM.L04|@today'`); the most exact key wins.
  - `'SKILL.ID|@watch'`: WATCH ME (worked example); a smaller picture under the tag, only while no model is drawn.
  - `'@passage|KEY'`: a reading passage (`p:'KEY'`); one topic picture under its title.
  - No marks on these. `pics-check.js` checks that the skill, unit or passage exists. `tests/lib/teachpics.js` tests the screens at 390 px and 1366x768.
- Round 2's lane folders and its list of bad live pictures are on branch `claude/adoring-ramanujan-bwh0ev` in `pics-pending2/`
  (`upgrades.md`). Never link a picture on that list again; replace it with a new id.

## What round 2 learned
- Checkers ALWAYS find something: a cross in window bars, a person in a reflection, a brand stamped on a key, a label on the answer.
- A stork is not a kosher bird: never for shiluach haken.
- A Pixabay picture whose uploader is "Pexels" has no known author: skip it.
- Jar and bottle labels hide text and brands: zoom in, or skip.
- Check every reused live picture against `upgrades.md` before linking it again.
- A picture hides the screen's own small text picture (under 40 characters) unless the link has `"keep": true`.
  `pics-check.js` now WARNS about this; publish with no warnings.

## Tools
- `node tools/pics-todo.js screens.json SCI.ANIM [lane ...] [--json todo.json]`: screens with no picture yet for an id prefix
  (leaves out screens already linked live or in the lanes given). Build each lane's work list from this.
- `python3 -I tools/pics-lane-rm.py <lane> pic <id> | link "ID|q" | unused`: take a picture (with all its links) or single
  links out of a lane folder. Checkers use it instead of editing JSON by hand.
- `python3 tools/pics-screens.py out.json`: every screen (id, question, how, emoji). Build the work list from this, not the audit sheet.
- `python3 -I tools/pics-find.py <dir> "words" --src pixabay,loc,nasa,openverse[,commons] --n 16 [--illus] [--allow word]`
  searches the free sources, drops anything whose tags break the picture rules, and writes `<dir>/sheet.jpg` (numbered tiles) and `cands.json`.
  LOOK at the sheet: tags miss things (a mosque arch came through untagged once).
- `python3 -I tools/pics-save.py save <lane> <dir> <tile#> <pic-id> --alt "..." [--crop x,y,w,h]` crops, resizes and encodes WebP,
  and records lib.json and sources.md in a lane folder. `pics-save.py grid <file> <out.jpg>` draws a 10% grid for box coordinates.
- A lane folder = `lib.json`, `map.json`, `pics/`, `sources.md`. Commands:
  - `node tools/pics-lane.js check <lane> screens.json` runs the real checker on RealPics + the lane (must say 0 problems);
  - `... sheet <lane> out.png "ID|q" ...` draws screens through the real add-on;
  - `... merge <lane> "note"` adds the block to RealPics.html, copies the files into `art/pics` and adds their catalog rows.
- `node tools/pics-sheet.js src/RealPics.html art/pics out.png "ID|q" ...` draws screens from the repo itself.

## Rules that do not bend
1. **Picture rules:**
   - boys and men only: no women or girls anywhere, even small in the background;
     (only exception, HoS 2026-11-26: pictures for the girls' app Keser Girls 3.0 may show girls and women, modestly dressed, in modest frum settings. Write "Keser Girls only" in the catalog's "what it shows" cell; such a picture is never used in 1.0 or 2.0, and the tests check that. See `keser/README.md`.)
   - frum, modest settings; kosher food;
   - no churches, crosses or other religions' symbols (also minarets, menhirs);
   - no alcohol, Halloween or fantasy creatures;
   - body topics: drawings or models only;
   - Kosel: stones only, no crowds;
   - no Divine Name readable in any picture;
   - when in doubt, ask the creator (see "Exceptions" below); until he or she answers, leave it out.
   **Exceptions (HoS 2026-11-26).** HoS: "The point of these rules is that pictures we didn't review first shouldn't go in without us realizing it. We only realize it once the kids are seeing it. Not that they're restricting creators from creating content that they feel is suitable."
   - When a picture breaks one of the rules above, do not use it quietly and do not drop it quietly. Show the picture to the **creator of that lesson** (the staff member who asked for it or built it), say which rule it breaks, and ask whether to use it.
   - The creator may allow it as a **one-time exception**: that picture, in that lesson or screen, after seeing it first. Using the same picture somewhere else needs that creator's OK again.
   - Write the exception at the end of the row's "what it shows" cell in `art/CATALOG.md`: `EXCEPTION (<rule>): allowed by <creator>, <date>, for <screen>`. Put it in the pull request too, under "Picture exceptions".
   - Until the creator answers, leave the picture out (show the name only) and list it in the pull request as waiting.
   - Only the picture rules in point 1 bend this way. Licences (point 2) and never giving the answer away (point 3) still hold.
2. **Licences:** public domain, CC0, CC BY, CC BY-SA, Pixabay, Pexels, LOC "no known restrictions". Source, licence and author are recorded for every file.
3. **Never give the answer away:**
   - labels only with words from the screen's "how" line;
   - pure question screens get the plain picture;
   - the alt (read aloud) and cap must not name the answer;
   - skip the screen when the picture itself is the answer.
4. **Kodesh pictures** go under "REBBE: review after live" in the pull request and in the LOG note.
5. **Picture ids:** never re-save an id that already exists. Round 1 hit this twice: a different photo under a live id, and a re-crop that would have moved a live box. Pick a new id, or reuse the live file.

## What we learned (round 1)
- Fan out by subject: one WORKER per subject (search -> look -> save -> link, saving after every picture), then a separate CHECKER
  that opens every picture and link and removes anything doubtful. Each checker removed 10 to 60 links (number screens, choice screens, answer give-aways).
- Look at the sample sheets yourself before publishing. Every round still found something:
  - a label on the wrong part (nucleus on a membrane question);
  - a picture that is too tall for a phone (crop it; e.g. `thermometer-scale.webp`);
  - colours or a picture that hint at the answer.
- Publish one subject at a time: branch from the latest main, merge the lane, run `node tests/run.js` (about 8 minutes), push, open the pull request.
  Wait until it merges AND a new picture URL loads at https://tashbar-learning-live.web.app/pics/<file> before the next one.
  Other builders merge too, so look for your merge in the last ~25 commits, not just the newest.
- If the publish job (`firebase-deploy`) fails with a Google Cloud "internal error, try again later", re-run the failed job once. That happened once (Kodesh, #108).
- Limits:
  - the Library of Congress JSON often comes without licence details, so pics-find drops it;
  - Wikimedia Commons answers HTTP 429 from cloud sessions;
  - Pixabay is the workhorse;
  - Pexels needs PEXELS_KEY (not set).
- Usage limits stop workflows mid-run. Resume with the same run id: finished agents come back from cache, and the lane folders keep the work.

## Work environment
- Allowed domains: pixabay.com, cdn.pixabay.com, api.pexels.com, images.pexels.com, www.loc.gov, tile.loc.gov,
  images-api.nasa.gov, images-assets.nasa.gov, api.openverse.org, commons.wikimedia.org, upload.wikimedia.org.
- Keys as environment variables or network secrets (never in chat): PIXABAY_KEY (set), PEXELS_KEY (optional).
- Lane folders live in the session's scratchpad: they are lost when the session ends. Publish before you stop.

## Starter prompt for the next builder
```
You are continuing PICS-1 for the Tashbar Baltimore learning app: real, high-quality pictures on every lesson screen that
talks about something a boy should see, with a red box, arrow and short label on the part the lesson talks about.
developer@ and the Head of School have approved this work. Use a workflow.

1. Read CLAUDE.md, CONTRIBUTING.md and docs/HANDOFF-PICS.md. CLAUDE.md wins: publish ONLY by pull request (auto-publish),
   never push to main, never clasp, never deploy by hand.
2. Check PIXABAY_KEY and the allowed domains in the hand-off. Tell me in one line if anything is missing, then continue.
3. python3 tools/pics-screens.py /tmp/screens.json; node tools/pics-check.js src/RealPics.html /tmp/screens.json art/pics (0 problems).
   List the screens that still have no picture, by subject. Group them by THING; things that cover the most screens go first.
4. Run a workflow: one worker per subject group using tools/pics-find.py, pics-save.py and pics-lane.js (lane folders), then a
   separate checker per group that removes anything doubtful. Follow every rule in the hand-off; reuse existing pictures first.
5. For each group: merge the lane, pics-check (0 problems), node tests/run.js (all pass), draw and LOOK at sample sheets
   (labelled and pure question screens), open one pull request (template filled, Kodesh under "REBBE: review after live"),
   wait until it merges and a new picture URL loads at https://tashbar-learning-live.web.app/pics/, then the next group.
6. After each group is live: a short CHANGE+RELEASE note in the HQ LOG (Drive folder 1NOL4XyWQgf5wm60gGNbmVG6ujY6RBIGS).
Short plain updates after each group: screens, pictures, one sample sheet. Keep going without waiting for me; stop only for a
real decision or a missing key.
```
