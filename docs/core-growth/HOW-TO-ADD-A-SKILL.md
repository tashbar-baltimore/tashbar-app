# How to add a new skill (Core Growth)

Written by job T (Tools), 2026-11-24. Every content job (F, C23, C45, C68, G, W13, W48, S) adds its lessons this way and **no other way**.
CLAUDE.md and `docs/CORE-GROWTH-PROMPT.md` win where anything here differs.

## The short version
A new skill needs **two files that your job owns**, and nothing else:

| File | Where it runs | What goes in it |
|---|---|---|
| `src/SkillsCore<Job>.js` (e.g. `SkillsCoreF.js`, helper: `SkillsCoreC45H1.js`) | the server | **The ladder rows**: where each new skill sits on the map, its rung name, its plain-words name, and your data files |
| `src/CoreData<Job><n>.html` (e.g. `CoreDataF1.html`, helper: `CoreDataC45H1.html`) | the boy page | **The lessons**: questions, Teacher Time, the hand-written One Bite lesson |

That is all. You do **not** edit `Placement.js`, `CurriculumIndex.js`, `Photos.js`, `Speed.js`, `QuestPage.html` or any pack. `src/SkillRegistry.js` puts your rows on the ladder, in the course map index and in the "built" list. `src/CoreKit.html` puts your lessons on the page. Both load your files by themselves.

Once both files are in, the skill shows up in all of these places:
- the boy's map and his path, in your order;
- placement and level checks;
- the staff grid, the library and Departments;
- the Department course map.

It plays in the One Bite player, and the test kit checks it.

## Step 1 · Pick the id
- Use a strand prefix that exists: `READ.PA`, `READ.PHON`, `READ.FLU`, `READ.COMP`, `READ.LIT`, `READ.VOC`, `READ.LV`, `LANG.GRAM`, `LANG.MECH`, `LANG.USE`, `LANG.SENT`, `WRIT.SENT`, `WRIT.PARA`, `WRIT.ESSAY`, `WRIT.RES`, `WRIT.HAND`. Science and Social Studies (job S) use `SCI.*` and `SS.*`.
- **Level = grade + 1.** Kindergarten is `L01`, Grade 5 is `L06`.
- **Number from the next free number** in that strand and level. To see the numbers already used:

  ```bash
  node tools/core-ids.js READ.COMP.L06
  ```

  Change `READ.COMP.L06` to your strand and level. It lists the ids already used and the next free one. To stay clear of the old numbers, Core Growth numbers start at **21**: `READ.COMP.L06.21`, `.22` and so on.
- **Never reuse an old id** for a new lesson. The tests refuse an id that is already on a ladder or already a lesson.
- **Math (`MATH.*`) is not part of Core Growth.** The registry refuses it.

## Step 2 · The ladder rows (`src/SkillsCore<Job>.js`)
```js
/* SkillsCoreC45.js: job C45 (Comprehension, Grades 4-5). Ladder rows for docs/core-growth/C45-map.md. Owned by job C45. */
crAdd_({ job: 'C45', files: ['CoreDataC451', 'CoreDataC452'], skills: [
  /* Grade 4 (L05), Unit 1: Main idea */
  { id: 'READ.COMP.L05.21', after: 'READ.COMP.L05.01', game: 'Umbrella Hunt', skill: 'Find the main idea of a paragraph', unit: 'C45-4-1' },
  { id: 'READ.COMP.L05.22', after: 'READ.COMP.L05.21', game: 'Proof Pins',    skill: 'Find the details that prove the main idea', unit: 'C45-4-1' },
  /* Grade 5 (L06), Unit 1 */
  { id: 'READ.COMP.L06.21', before: 'READ.COMP.L06.02', game: 'Clue Ladder', skill: 'Make an inference from clues', unit: 'C45-5-1' }
] });
```
- **`after`** puts the skill right after that skill on the ladder. **`before`** puts it right before. The anchor must be a skill **of the same level**: an old one, or one you added above it in the same call.
  - A row with `after: 'X'` and the next row with `after: <the new id>` keeps them in your order.
- **`game`** is the rung name the boy sees on his map. Make it short and exciting.
- **`skill`** is the plain words staff see.
- **`unit`** is your unit code from your map (`<job>-<grade>-<unit>`). Unit checks and test-out (job T, coming) read it.
- **`files`** lists your data files. When a file nears 150 KB, start the next one (`CoreDataC452`) and add it here.
- **One `crAdd_` call per job.** A helper uses its own job code (`C45H1`), its own `SkillsCoreC45H1.js` and its own `CoreDataC45H1.html`.
- The file name **must start with `SkillsCore`**. The server loads files in name order, and `SkillRegistry.js` has to load first.
- **Careful with `before` on the first skill of a level.** That skill becomes where a newly placed boy starts that level. `tests/lib/kidmap.js` expects `READ.COMP.L05.01` to stay the first Reading Level 5 skill. `tests/lib/levelpass.js` uses `LANG.GRAM.L05.01`. Leave those first.
- Only add a row when its lesson is in the same PR. The test fails a row with no lesson, and a lesson with no row.

## Step 3 · The lessons (`src/CoreData<Job><n>.html`)
```html
<script>
/* CoreDataC451.html: job C45 lessons, Grade 4 Unit 1 (docs/core-growth/C45-map.md). Owned by job C45. No double slash in this file. */
CORE_ADD('C45', {
'READ.COMP.L05.21': { name: 'Find the main idea of a paragraph',
  teach: [ { q: '…', o: ['right', 'wrong', 'wrong'], how: 'How to do it…' }, … ],
  practice: [ { t: 'sort', … , h: 'How to do it…' }, … ],
  check: [ { q: '…', o: ['right', 'wrong', 'wrong', 'wrong'] }, …exactly 3 tap items… ],
  tt:   { hook: '…', big: '…', intro: ['…'], ex: [ … ], oops: { … }, idea: '…', try: { … } },
  bite: { band: 'E45', today: '…', why: '…', ready: [ … ], bridge: 'READ.COMP.L04.02', bridgeName: '…',
          watch: { q: '…', steps: [ … ], a: '…' }, oops: { q: '…', wrong: '…', right: '…', why: '…' },
          ways: [ … ], done: '…', do: [ 2 activities ], your: [ 5 activities ] },
  how:  { s: 'One How to do it line', q: { … } } },
'READ.COMP.L05.22': { name: … }
});
</script>
```
- **Write every lesson as `'ID': { name: …` with exactly that shape.** The server finds built skills by that text.
- **`teach`, `practice` and `check`** use the engine's question format (`docs/HOW-TO-WRITE-A-LESSON.md`). `o[0]` is the right answer; the engine shuffles the choices.
  - Check has **exactly 3** items, all tap kinds. Mastery needs all 3 right.
  - Every check answer must appear in what the lesson teaches. The test counts misses, and the count may not go up.
- **`bite` is required.** It is the hand-written One Bite lesson (`docs/ONE-BITE-PLAYBOOK.md`), and it must have `do` (2) and `your` (5). The quality gate (`tests/lib/obquality.js`) then checks every rule on it, and a Core Growth lesson can never go on the to-fix list.
- **`tt`** is Teacher Time ("Teach me how"). It is optional, but a good one counts as teaching for the "taught, then asked" check.
- **`how`** is optional. It goes to `TL_DO`.
- **No double slash** anywhere in the file (use `/* */`). Keep each file **under 150 KB**.
- **Long texts** (stories, chapters, articles) do **not** go here. They go in the content store (job T, coming), so they load only when the boy opens them.
- **Kindergarten and Grade 1 (`L01`, `L02`):** a K–1 boy sees only the games path (HoS rule, `tests/lib/k1home.js`). A new K–1 skill is on the ladder and in staff screens, but it reaches K–1 boys only through their game path. Job F: ask job T before your first K–1 lesson PR.

## Step 4 · Check it
```bash
node tests/lib/coreskills.js
```
This checks your rows and files on the real server engine, in about 30 seconds.

```bash
PLAY=READ.COMP.L05.2 node tests/run.js
```
This is the whole test kit. It also plays your new lessons to "mastered" and runs the quality gate on every bite. All of it must pass.

```bash
node tools/audit/ob-quick.js
```

```bash
IDS=READ.COMP.L05.21 node tools/audit/ob-qa.js
```

```bash
OB=test IDS=READ.COMP.L05.21 node tools/audit/play-shots.js
```
The first two check the One Bite lessons. The last one takes a picture of every screen. Look at every one, at 1366×768 and 390 px.

Then do what `docs/CORE-GROWTH-PROMPT.md` section 4 asks: an independent review (every point 4 or 5), pictures in the PR, and the ledger.

## What the registry does for you (for the curious)
| Place | How it gets your skill |
|---|---|
| Ladders `READ_K8` / `LANG_K8` / `SCI_K8` / `SS_K12` (`Placement.js`) | `crAdd_` puts the row in place when the server starts. The boy's map, path, placement, level checks, staff grid, library and Departments all read these. |
| The "built" list (`plBuilt_`) | `SkillRegistry.js` also reads your CoreData files for `'ID': { name:` |
| Department course map (`CI_INDEX.lad` / `.sk`) | added at the same place, and the course map's cache key changes |
| The boy page | `CoreKit.html`, then each CoreData file, load right after `OneBiteDataUpper`, in both loaders (`Photos.js crToolsJs_`, `Speed.js tlPartFiles_`) |
| `BANK_ALL`, `READ` / `WRIT`, `TL_TEACH`, `ONE_BITE`, `TL_DO` | `CORE_ADD` |

**Mistakes the registry refuses** (the tests fail, so nothing goes live):
- an unknown or other-level anchor;
- an id that already exists, or a badly formed id;
- a Math id;
- a row with no name;
- a data file not named `CoreData…`, or one another job already uses;
- the same job added twice;
- a row without its lesson, or a lesson without its row;
- a file of 150 KB or more, or one with a double slash;
- a lesson with no bite or without `do` and `your`.

**Not covered yet (later job T pieces):** the content store for long texts, the Reader, the Writing Workshop and teacher inbox, unit checks and test-out (they will read `unit`), and the new activity kinds. Until each one is in, build your map and lesson data on your branch, but do not open lesson PRs that need it.
