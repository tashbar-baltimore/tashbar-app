# Math lesson kit (grades 4–8, the G<n>Math packs)

This kit builds `packs/G4Math.html` … `packs/G8Math.html`. Each pack is a full 8-station teaching lesson for every Math skill of one grade: warm-up, story, mini-movie, together, practice, real life, check, hooray. It runs on the proven K-3 lesson engine.

## Files
- **`engine-page.html` / `engine-wrapper.js`:** the K-3 engine page and its app wrapper, taken from `packs/G3Math.html`. Do not edit these.
- **`g4lessons.js` … `g8lessons.js`:** the lessons, one file per grade.
  - Each file starts with `L.length=0;`, adds problem kinds (`G.name=async c=>…`), then `L.push(mk<g>('MATH.X.L0<g+1>.NN', title, emoji, sub, warm, [storyHtml, storyLine], movie, together, practice, real, check))`.
  - Later grades reuse the grade 4 helpers, so a grade is always built on top of `g4lessons.js`.
- **`buildg.js`:** builds one pack. Run it from the repo root:
  `node tools/math-lessons/buildg.js tools/math-lessons tools/math-lessons/g4lessons.js,tools/math-lessons/g6lessons.js /tmp/G6Math.html 6 "short blurb ending with and more." "🧗"`
- **`register.py <grade> <pack>`:** copies the pack into `packs/` and registers it in `Photos.js`, `Speed.js`, `ContentPacks.js` (`github-only`) and `tools/skill_flow.js`. Then run `node tools/skill_flow.js` to rebuild the curriculum tree.
- **`robot.js <pack> <rounds>`:** plays every lesson to the end at 390 px. It must show every lesson finished with 3/3, 0 errors, and about 17 clicks each.
- **`verify.js <pack> <out.json>`:** collects real questions and their marked answers.
- **`check/check<g>.py <samples.json>`:** recomputes the answers independently. It must report 0 BAD.
- **`shots.js`:** takes phone screenshots of chosen screens. Edit its `WANT` list, then look at the contact sheet.

## Rules every lesson keeps
- Every question is a tap (`numQ`, `choiceText` or `pickQ`), with exactly one right answer and no duplicate choices.
- The mini-movie teaches everything the check asks. Its `say('…')` lines are plain string literals, so the curriculum tree can read them.
- **No drawing shows crossing lines:**
  - perpendicular lines are a corner;
  - coordinate axes meet at a corner or break at the origin;
  - grids are dots;
  - vertical angles and transversals are taught in text only.
- Boys' names, kosher food, frum settings, no Hebrew.
- No `//` anywhere in the lesson files. The build stops if it finds one.
- No apostrophes inside single-quoted strings.

## Status, 2026-11-20
| Grade | Status |
|---|---|
| 4 | Live (tashbar-baltimore/tashbar-app#64) |
| 5 | Pull request tashbar-baltimore/tashbar-app#73 |
| 6 | Built and tested (robot 54/54, 1,224 answers 0 wrong); not yet registered |
| 7 | Snapshot of work in progress. Rebuild, robot, check and screenshot before shipping. |
| 8 | Built and tested (robot 48/48, 980 answers 0 wrong, screenshots checked); not yet registered |
