# How to add a new skill (Core Growth)

Job T wrote this note (2026-11-24). Every content job (F, C23, C45, C68, G, W13, W48, S) adds new skills **only** this way. Read `docs/CORE-GROWTH-PROMPT.md` first. CLAUDE.md wins where they differ.

## The short version
1. Get a free id:
   ```bash
   node tools/core/add-skill.js next READ.COMP.L06
   ```
2. Add the skill to your job's list. Say where it goes on the ladder, which lesson file holds it, its Common Core code, and the minutes it takes a typical boy:
   ```bash
   node tools/core/add-skill.js C45 READ.COMP.L06.13 "Gist Builder" "Sum up a passage in 15 words" --file CoreDataC451 --after READ.COMP.L06.01 --std RI.5.2 --min 8
   ```
   For the next skill in the same level you can leave out `--after`. It goes right after the row above it.
3. Write the lesson in `src/CoreDataC451.html` (the tool makes the file the first time).
4. Run the tests, and play your new skill to the end:
   ```bash
   PLAY=READ.COMP.L06.13 node tests/run.js
   ```

**You never edit** `Placement.js`, `CurriculumIndex.js`, `Photos.js`, `Speed.js` or any other job's file. At start-up, `src/CoreSkills.js` puts your skill into every list that needs it.

## What you own
| File | What it holds |
|---|---|
| `src/CoreData<Job>.js` | Your job's **list of new skills**, in teaching order (one row per skill). Only `tools/core/add-skill.js` or you edit it. |
| `src/CoreData<Job><n>.html` | Your **lesson data**: `CoreData<Job>1.html`, `CoreData<Job>2.html`, and so on. Keep each file under **150 KB** (the test checks), then start the next number. |
| `src/CoreData<Job>H<n>.html` | A helper's data file (from the Helpers list). The helper adds rows to the owner's list in their own PR, with `--file CoreData<Job>H<n>`. |

Job letters: `F`, `C23`, `C45`, `C68`, `G`, `W13`, `W48`, `S`. Never use `.html` and `.js` with the same base name: `CoreDataF.js` is right, `CoreDataF.html` is not.

## One row in the list
```js
CORE_SKILLS.C45 = [
  ["READ.COMP.L06.13", "Gist Builder", "Sum up a passage in 15 words", { after: "READ.COMP.L06.01", std: "RI.5.2", file: "CoreDataC451", min: 8 }],
  ["READ.COMP.L06.14", "Gist Check", "Check a summary against the passage", { std: "RI.5.2", file: "CoreDataC451", min: 6 }]
];
```
- **id**: an existing strand prefix (`READ.PA`, `READ.PHON`, `READ.FLU`, `READ.COMP`, `READ.LIT`, `READ.VOC`, `READ.LV`, `LANG.GRAM`, `LANG.MECH`, `LANG.USE`, `LANG.SENT`, `WRIT.SENT`, `WRIT.PARA`, `WRIT.ESSAY`, `WRIT.RES`, `WRIT.HAND`; for job S, `SCI.*` and `SS.*`). **Level = grade + 1** (Kindergarten is L01, Grade 5 is L06). The number is the next free one (`next`).
- **game name**: 40 letters at most. It shows on the boy's map.
- **objective**: what he learns, in plain words. It shows under the name.
- **after** or **before**: the skill already on the ladder that this one follows or goes in front of. It must be on the **same ladder and the same level**. Reading skills sit on the Reading ladder. `LANG.*` and `WRIT.*` share the Language Arts & Writing ladder. A row with neither comes right after the row above it.
- **std**: the Common Core code (also written in your skill map).
- **file**: your data file that holds the lesson.
- **min**: minutes for a typical boy. This feeds the minutes ledger.

**Where does a new skill go?** In teaching order, inside its level. The boy's map follows this order exactly. A boy who is placed at a level starts at its **first** skill. So do not put a new skill in front of a level's first skill unless it really is the first thing to teach. If you do, `tests/lib/kidmap.js` expects `READ.COMP.L05.01` to be the first Reading step of Level 5; tell job T before moving it.

## The lesson data file
The tool makes this. You fill in `LESSONS`:
```html
<script>
/* CoreDataC451.html: Core Growth job C45, lesson data ... */
(function () {
  var LESSONS = {
    'READ.COMP.L06.13':{name:'Gist Builder', teach:[ ...3... ], practice:[ ...6 hands-on... ], check:[ ...3 tap kinds... ], re:[ ...3... ]}
  };
  var TEACH = {}, HOWTO = {}, BITE = {};
  if (window.TLCORE) TLCORE.add('C45', LESSONS, { teach: TEACH, howto: HOWTO, bite: BITE });
})();
</script>
```
- **The shape matters:** write `'ID':{name:` exactly like that: quoted id, colon, brace, `name` first. The server finds a "built" lesson by that shape. A listed skill with no lesson yet is **hidden from boys** (it is not "built"), so you can list a whole unit first and fill it in later.
- **The lesson** uses the engine's normal shape (`docs/HOW-TO-WRITE-A-LESSON.md`): `teach` 3, `practice` about 6 hands-on items (no plain multiple choice), `check` 3 **tap kinds**, `re` 3. In a choice item the **first** choice in `o` is the right one (the engine shuffles them). Every item has a kid-friendly `how` that never gives the answer.
- **TEACH** = Teacher Time (`TL_TEACH` shape), **HOWTO** = How-to boxes (`TL_DO` shape), **BITE** = the One Bite lesson (`ONE_BITE` shape, `docs/ONE-BITE-PLAYBOOK.md`), all keyed by id. Every new lesson needs a **BITE with `do` and `your`** that passes the quality gate (`tests/lib/obquality.js`): 2 + 5 activities, 3+ kinds, the mistake activity, the song or move for K–3, "tap the reason" for 4–5, teach-it-back for 6–8, and never the word "bite".
- `TLCORE.add` puts each lesson into `READ` (READ.\*), `WRIT` (LANG.\* and WRIT.\*) and `BANK_ALL`. It **never replaces** a lesson that is already there; the test fails on a clash. To improve an **existing** lesson, change it in its own file, not here.
- **Long texts** (stories, chapters, articles over about 300 words) do **not** go in this file. They go in the content store (job T builds it next; this note will say how). A short passage inside a question is fine.
- No `//` comments in `.html` files: use `/* */`.

## What happens at start-up (so you know what you get)
`src/CoreSkills.js` reads every `CORE_SKILLS.<Job>` list and:
- puts each skill into its ladder in `Placement.js` (`READ_K8`, `LANG_K8`, `SCI_K8`, `SS_K12`) at its place. That gives you the boy's map and path, placement, the staff grid, "Give him this skill", the Library and the Pathfinder level lists;
- adds it to the curriculum index (`CI_INDEX`), for the Departments course map and skill names;
- tells `plBuilt_` to look in your data files, so the skill counts as "built" once its lesson is there;
- loads `CoreKit.html` and then every data file named in a list on the boy's page. They load after the One Bite data and before the One Bite player, one cached piece per file, so a Chromebook only downloads the file that changed.

## Checks
- `node tools/core/add-skill.js check` lists every problem in every job's list.
- `node tests/run.js` (`tests/lib/core.js`) fails on:
  - a bad id;
  - an id listed twice, or one that is already on a ladder;
  - a place on another ladder or level, or a place that does not exist;
  - a missing name, objective or file;
  - a data file that is missing or over 150 KB;
  - a lesson that clashes with an existing one;
  - a built skill that is not a real lesson on the page;
  - a lesson with fewer than 3 check questions.
- Then the usual rules: the quality gate, "taught, then asked" (`tests/baseline.json` may not go up), play to "mastered" (`PLAY=<id>`), the independent review (every point 4 or 5) and pictures at 1366×768 and 390 px.

## Not covered yet (job T is building these next)
- **K–1 home:** a K or Grade 1 boy sees only the game path (`K1Only.html`). How a new K–1 skill joins that path will be added here.
- The content store for long texts, the Reader, the Writing Workshop, unit checks and test-out, and the new activity kinds.
- **Pathfinder level-check items** for new skills. Until then a new skill is simply not part of the level check, which is safe: the boy meets it on his path.
- The staff **skill-flow chart** (`tools/skill_flow.js`) still charts only the old ladders.
