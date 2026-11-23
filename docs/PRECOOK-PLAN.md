# Plan: pre-cook the lessons at publish time

Status: **plan only.** Nothing here is built yet. The HoS asked for this plan on 2026-11-23, after asking for "fast, quick, smooth" start-up.

## In plain words (for the HoS)

**What is slow today.** Every time a boy opens the app, his Chromebook does two big jobs before all lessons are ready:

1. **It turns about 40 MB of lesson files into a working program.** This is roughly half of the work.
2. **It runs clean-up passes over thousands of lessons.** This is roughly a quarter of the work. For example, one pass turns Hebrew written in English letters into Hebrew letters, and others fix wording and add "How to do it" boxes. These passes give the same result every time, yet they run again on every Chromebook at every open.

Reading the lesson data itself is only a small part. That is why "lazy loading" each lesson's data saved only about 5% when we tried it (2026-11-23), so it was not shipped.

**The idea.** Do the clean-up once, when a change is published, instead of on every boy's Chromebook. The publish step opens the app exactly as a Chromebook would, lets every pass run, and saves the finished lessons. The boys then receive lessons that are already cooked, and their Chromebooks skip the passes.

**What stays the same.** Lanes keep writing lessons exactly as they do now. Every lesson must come out exactly the same as before; a check proves that on every change, for all 1,376 lessons. If the check fails, nothing goes live.

**What the boys get.** The full app is ready sooner and the screen stutters less in the first seconds. This is on top of what is already live: no white screen, the home in about 1 s, K–1 games in about 4 s, and "One moment…" for an early tap.

**Size of the job.** It is done in small steps, one pull request each. Every step is useful by itself, and we can stop after any step.

| Step | What | About |
|---|---|---|
| 0 | Measure: list every clean-up pass and its cost | ½ day |
| 1 | The "same lessons" check runs in the tests on every change | ½ day |
| 2 | The publish step cooks the lessons and saves the result | 1–2 days |
| 3 | Passes skip their work when cooked lessons are present, one pass per PR, biggest first | ½ day per pass |
| 4 | (Later, bigger) ship cooked lesson data as data, not as program code, to cut the "turn into a program" half | to plan after step 3 |

**Decision for the HoS:** none needed to start steps 0–1. Before step 2, I will show the measured gain from step 0. If it is small, we stop there.

## For builders

### What we measured (test kit, 2026-11-23)

- **Where the time goes:** a CPU profile of a full load splits roughly into:
  - compiling the add-on pieces: indirect `eval` of the wrapped piece strings, about half;
  - load-time passes over `BANK_ALL` and the `TL_*` tables, about a quarter.
- **Biggest pieces,** measured with the CPU slowed 4×: KindsMore 1–3 about 2.6 s, HowToDo 1–3 about 0.9 s, ScienceMore about 0.9 s, KodeshQuestPage about 0.4 s.
- **Passes seen in the profile:**
  - `K2RUN` / `K2` / `word` (KindsMore3: Hebrew in Hebrew letters);
  - `HFRUN` (KindsMore3: How-to fill);
  - `clean` / `conv` / `good` (KindsMore and the grade packs);
  - `HALF` / `item` / `walk` (HowToDo, ElectivesMore).
- **Lazy per-skill data was tried and dropped.** Big pure-data literals were turned into per-key `JSON.parse` getters, with the same lessons proven. The KindsMore piece only went from 3.7 s to 3.5 s, because the passes read the tables at load anyway.

### The "same lessons" check (step 1)

The tool already exists as a prototype (it lives in the session scratchpad and will be moved to `tools/`).
- It loads the app headless, seeds `Math.random`, and runs `buildMission(id)` for every id in `BANK_ALL`.
- It hashes each result and each `TL_*`, `BANK*`, `LK_*` and `ONE_BITE` table.
- It compares two builds.

Known noise to handle:
- `READ.FLU.L02.01` and one key in `TL_TEACH` change between two loads of the same build, because something shuffles at load.
- The check must seed `Math.random` before the pieces run, not only before `buildMission`, or it must compare `TL_TEACH` per key and list the noisy keys.

### Cooking (step 2)

- **Where it runs:** in the publish job, after `web/build.js`, the same headless page the tests use loads all pieces and waits for every pass, including the late ones that run after all packs.
- **What it saves:** the final cooked state of the data tables the passes change, as `parts/cooked-<hash>.json`. The hash comes from the piece hashes, so a cooked file always matches the pieces it came from.
- **When it is ignored:** `boot.js` and the loader read the cooked file only when its hash matches the current pieces. Otherwise they ignore it, and the app behaves exactly as today.

### Skipping passes (step 3)

- **Opt in, one pass at a time.** Each pass gets a guard at the top: if `window.TL_COOKED` is set and that pass's name is in its list, skip the work but still set its `DONE` flags.
- **Order of loading:** the loader loads the cooked tables before the pieces run, so later code sees the same data it would have produced.
- **Every pass PR:** the "same lessons" check must show zero differences, and the full tests must pass.

### Risks

- **A pass that also installs functions or wrappers** cannot be skipped whole. Only its data-changing part can.
- **Lanes editing a pass** change its output. The cooked file is rebuilt on every publish and its hash ties it to the pieces, so a stale cooked file is never used.
- **Memory:** the cooked JSON is extra data. It is measured in step 2, and if it is too big, only the most expensive passes are cooked.
