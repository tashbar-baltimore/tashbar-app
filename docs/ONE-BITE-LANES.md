# One Bite: lanes (who does what)

> **ROUND 2 IS NOW THE PLAN (HoS, 2026-11-21 evening): short, hands-on, made for each age. Start with Kindergarten Math and the ABCs.** Read `docs/ONE-BITE-ROUND2.md` first. Round 2 lanes: **A** = the Activity Kit (`src/OneBite.html` + `src/OneBiteKit.html`), **B** = K–1 Math activities (`src/OneBiteDataMath.html`), **C** = K Reading, ABCs first (`src/OneBiteDataRead.html`).

Each lane edits **only its own files**, so 2–5 Claude accounts can work at the same time with no overlap. Before you start, add a line under "Taken" with the date and your account. When you stop, write where you got to.

| Lane | Files it owns | Work |
|---|---|---|
| **A · ob-core** | `src/OneBite.html`, `tests/lib/onebite.js`, `tools/audit/*`, `docs/ONE-BITE-*.md` | The player, switches, tests, staff "Teach it at the board" cards, stuck groups, per-bite signals |
| **B · ob-math** | `src/OneBiteDataMath.html` | Hand-written bites for every Math skill, K–8. Most-used levels first (L02–L05), batches of 25–40 per PR |
| **C · ob-literacy** | `src/OneBiteDataRead.html`, `src/OneBiteDataWrit.html` | Reading, phonics, Writing and Language. Do **not** edit `READ.*` packs: the Reading-level rebuild lane owns them. Write bites for skills that have no open Reading PR |
| **D · ob-kodesh** | `src/OneBiteDataKodesh.html` | Kriyah, then Chumash, Mishnayos, Gemara and Torah Tracks. Copy Hebrew by script from the lesson data or source texts. "REBBE: review after live" |
| **E · ob-more** | `src/OneBiteDataMore.html` | Science, Social Studies, Life, Computing and Electives |

**Other lanes running now:** the "One button, one job" simplify lane (PR #130, `docs/SIMPLIFY-AUDIT.md`) owns LearnFlow, QuestPage, Activities, JokeJar and the home. Its fixes are the look for any lesson not playing as a bite. One Bite never edits those files. The Reading-level rebuild lane owns the `READ.*` packs.

If a data file grows past about 400 KB, start `OneBiteDataMath2.html` and register it in `Photos.js` (msQuestToolsBody_) AND `Speed.js` (TL_PART_FILES), in the same order, before `OneBite`.

## Taken
- 2026-11-21 · Lane A · this session (Enterprise account): audit, playbook, player v1, 12 pilot bites, tests.
- 2026-11-22 · Round 2 Lane A · this session: **Activity Kit done** (`src/OneBiteKit.html` + player in `src/OneBite.html`): all 10 activity types, 3-in-a-row exit to Show me, fallback cap 2 + 5, K1 wiggle break and celebration, read-along, "tap the reason". Schema: `docs/ONE-BITE-PLAYBOOK.md` section 10. Tests in `tests/lib/onebite.js` check every `do`/`your` activity, so `node tools/audit/ob-quick.js` tells Lanes B and C exactly what to fix.
- 2026-11-21 · Lane B (started by the Lane A session): Math K–2 done. All L01–L03 skills have hand-written bites (65 bites in all, counting the pilots). **Next for Lane B:** L05 (MATH.OPS.L05.01, MATH.FRAC.L05.02), L07 (MATH.ALG.L07.04), L09 (MATH.ALG.L09.01/.02/.04, MATH.FUNC.L09.02), then any Math skill the map plays that has no bite (`Object.keys(GEN).filter(id => !ONE_BITE[id])`).

- 2026-11-22 · Round 2 Lane B (K–1 Math activities) · this session: `do`/`your` hands-on activities for every `MATH.*.L01.*` bite (batch 1), then `L02` (batch 2). Batch 1 (L01, 16 bites) and batch 2 (L02, 21 bites) are written; all K–1 Math bites now have `do`/`your`. The activity data shapes are written at the top of the Round 2 block in `src/OneBiteDataMath.html` for Lane A's kit.

- 2026-11-22 · Round 2 Lane C2 (Writing and Language) · this session: full lessons with `do`/`your` activities in `src/OneBiteDataWrit.html`. Batch 1 (K–2: every WRIT/LANG L01–L03 lesson, 24) in progress. Next: L04–L05, then L06–L09, then a polish pass.

## Starter prompt for a content lane (paste into a new Claude Code session on `tashbar-baltimore/tashbar-app`)

```
You are a builder on the Tashbar One Bite overhaul. Read CLAUDE.md, CONTRIBUTING.md, docs/ONE-BITE-BRIEF.md,
docs/ONE-BITE-PLAYBOOK.md and docs/ONE-BITE-LANES.md first. They are binding.
Your lane: <B ob-math | C ob-literacy | D ob-kodesh | E ob-more>. Add yourself under "Taken" in docs/ONE-BITE-LANES.md.
Edit only your lane's data file.

The job: write hand-written ONE BITE lessons (window.ONE_BITE['SKILL.ID'] = {...}) for the skills in your lane, in batches of 25–40 per pull request.
1. Get each skill's real content first:
   IDS=<comma list> node tools/audit/dump.js   (writes tools/audit/out/dump.json: Teacher Time, the How-to lines, and every question with its answer)
   node tools/audit/teaching-audit.js           (tools/audit/out/data.json: all lessons, with the count of never-taught checks)
   Start with the skills that have the most never-taught checks in your lane, and the most-used levels.
2. Write each bite to the playbook:
   - band; a today line of 10 words or fewer; why; a 2-question ready check on the skill it stands on, plus a real bridge skill id;
   - a worked example of 2–5 steps with at least one visual model (tenframe, line, blocks, fbar, tiles, emoji, scene, chant, move);
   - oops (wrong, right, why); at least 2 ways; done; board (one, activity, 3 mistakes).
   Make sure every check question in that lesson can be answered from what the bite shows. Use the exact words the check needs.
3. Check it: node tools/audit/ob-quick.js (it must pass), then
   OB=test IDS=<2 of your ids> node tools/audit/play-shots.js, and look at the pictures in tools/audit/out/shots-ob/.
4. Run node tests/run.js. It must pass, and the "check questions whose answer is never taught" count must go DOWN.
   Then update tests/baseline.json to the new lower number (UPDATE=1 node tests/run.js).
5. Open the PR: one batch per PR, branch claude/ob-<lane>-<batch>. In the PR list: the bites added, the ways used,
   the never-taught checks fixed, and 2 phone pictures. The PR goes live by itself when the tests pass.
6. Add a CHANGE note to the Drive HQ LOG (folder 1NOL4XyWQgf5wm60gGNbmVG6ujY6RBIGS) and send the HoS one plain line.
Rules: modest, warm frum family life; a wide mix of names; kosher food. Never the Divine Name (ה׳, אלקים). No real student data. No // in .html.
Don't wait for approval. Keep going batch after batch until your lane is done or you near 75% of the weekly usage limit.
Then write where you stopped under "Taken".
```
