# ONE BITE, Round 2: short, hands-on, made for each age (HoS direction, 2026-11-21 evening)

> **Words the boys see (HoS 2026-11-21):** boys never see the word "bite". The screens say **TODAY WE LEARN** (step 1), **LEVEL CLEAR!** and **▶ Next level** (step 6), and "lesson" everywhere else, matching the map. "One Bite" stays only as the builders' name for this project and its files.

**This is what we are doing now.** Start with **Kindergarten Math** and **Kindergarten Reading (the ABCs)**, then go up level by level.

## What the HoS said
> "This is what I'm talking about. I need this." The lessons still feel like "a question, then a question, then three questions." Make them **short**. Make practice **hands-on, with many different ways**. Make **each age feel different**. Start with Math and the ABCs from Kindergarten.

## Where we are (round 1, live for TEST- boys)
- `src/OneBite.html` plays every lesson as 6 steps: Today's Bite → Watch Me → Do it with me → Your turn → Show me → Bite Done.
- It is calm (no pop-ups, coins or banners), with one button, read-aloud and age bands.
- 65 hand-written bites in `src/OneBiteData*.html`: all Math L01–L03, plus pilots.

**What round 1 did NOT change:** steps 3–5 are still the old ~16 question cards. That is the next job.

## The new rules for every bite (round 2)
1. **Short.**
   - "Do it with me": 2 guided tries.
   - "Your turn": 3–5 activities, and he moves on after **3 right in a row**.
   - "Show me": the 3 check questions (the engine needs exactly 3 for mastery; keep them tap kinds).
   - Bite length: K–1 3–5 minutes, Gr 2–3 5 minutes, Gr 4–5 5–7, Gr 6–8 7–10.
2. **Hands-on, not a question list.**
   - "Do it with me" and "Your turn" are **activities he does with his fingers**: drag dots into a ten-frame, hop a frog on a number line, build a word from letter tiles, tap every "b" on a page, sort picture cards, build a number with blocks, trace a letter with his finger.
   - Every bite mixes at least **2 different activities**. The same lesson never repeats the same activity twice in a row.
   - Every drag also works with tap-tap.
3. **Each age feels different.**
   - **K–1:** voice-first (every instruction is spoken, no reading needed), big pictures, 3 choices at most, big 76 px targets, a song or a movement in every bite, and a celebration.
   - **Gr 2–3:** read-along. **Gr 4–5:** real-world problems, plus "tap the reason". **Gr 6–8:** strategy choice, challenge, teach it back, fewer cartoons.
4. **Taught, then asked.** Every check question uses only what Watch Me and the activities showed.
5. **Money stays exciting (HoS 2026-11-21 22:22):** a gold money chip in the One Bite header shows his real balance on every screen. Every right answer sends a coin flying into it, and Bite Done has a big counting-up "YOU EARNED" moment (`src/OneBiteMoney.html`, display only; the server sets every amount). The old pop-up money shows (Money Storm, Jackpot, coin rain over the work) stay off during a bite.
6. **Unchanged:** mastery, pay and saving (the engine's `answer`/`finish`; the server sets all money); the HoS teaching standard; the How-to-do-it help; family-life rules; no real student data (the repository is PUBLIC).

## The work: three lanes, which can run at the same time in three accounts

### Lane A: the Activity Kit (player). **DONE 2026-11-22: the data schema for `do`/`your` is in `docs/ONE-BITE-PLAYBOOK.md` section 10.** Files: `src/OneBite.html` and a new `src/OneBiteKit.html` (register it in Photos.js AND Speed.js, before OneBite)
- **Build reusable, touch-friendly activities that read their data from `ONE_BITE[id].do` (guided) and `ONE_BITE[id].your` (practice):**
  - `tenframe` (drag or tap dots to make N);
  - `hop` (number line: start, hop by k, land on the answer);
  - `count` (tap each picture to count, then pick the number);
  - `blocks` (build a number with tens and ones);
  - `tiles` (build a word or number from tiles in order);
  - `findall` (tap every target in a grid: letters, shapes, numbers);
  - `match` (pair pictures with letters, sounds or numbers);
  - `sort` (cards into 2–3 bins);
  - `trace` (trace a letter or number on a dotted path with a finger; pass when about 80% is covered);
  - `listen` (hear a sound or word, then tap the matching picture or letter).
- **Look at `src/KMathGamesUI.html` and `src/K1LettersUI.html` first.** They already have drag, voice and I-do-we-do-you-do rounds for K–1 behind the LBL gate. Reuse their mechanics and look; don't rebuild from zero.
- **Recording and flow:** each activity records a result into the engine as a practice item (`p.results`, phase `practice`), so evidence rows still save.
  - The player stops "Your turn" after 3 right in a row and goes straight to Show me.
  - If a bite has no `do`/`your`, the player falls back to the lesson's own questions, capped at 2 guided + 5 practice.
- **Tests (tests/lib/onebite.js):**
  - every activity type renders at 390 px and works by tap only;
  - every bite with `your` reaches Show me in 8 activities or fewer;
  - every pilot plays to mastered;
  - nothing changes for non-TEST boys while `OB_LIVE` is `'test'`.

### Lane B: Kindergarten and Grade 1 Math activities. File: `src/OneBiteDataMath.html`
- For every `MATH.*.L01.*` skill, then `L02`, add `do:[2 activities]` and `your:[5 activities]` to the existing bite.
- Use at least 2 activity types per bite, matched to the skill:
  - counting → `count` and `tenframe`;
  - adding → `tenframe` and `hop`;
  - teen numbers → `blocks`;
  - shapes → `findall` and `sort`;
  - money → `count` and `sort`.
- Rewrite the 3 check questions where they ask something the bite did not show.

### Lane C: Kindergarten Reading, the ABCs first. Files: `src/OneBiteDataRead.html` (plus the lesson data, if new skills are needed)
- **First the ABCs:** letter names, letter sounds and letter shapes, in small groups like Kriyah (4–5 letters per bite, about 6 bites for A–Z). Each bite has:
  - **Watch Me:** each letter's name and sound, a keyword picture, and how to write it;
  - **activities:** `listen` (hear the sound, tap the letter), `findall` (tap every b), `match` (letter ↔ picture), and `trace` (finger-trace the letter);
  - a chant or song every time.
- **Then** the rest of K Reading: `READ.PA.L01.*` (rhyme, beats, first sound, blend, chop), then `READ.PHON.L01.02–.04` (sound match, short vowels, read CVC), then `READ.FLU.L01.01` (snap words), then L02.
- `READ.PHON.L01.01` "Letter Lineup" packs all 26 letters into one lesson, which is not a bite. **Split it into ABC bites:** add skill ids `READ.PHON.L01.01.a` … `.f`, the same way Kriyah uses `LK.KRI.L01.01.a`.
  - Find every place a skill id must be registered (the bank, the kid map, the curriculum index, the placement list) by searching for how `LK.KRI.L01.01.a` is wired.
  - Keep the old id working (map it to `.a` or keep it as a review), so no boy loses progress.
- Short, plain words: 12 words or fewer per line. Every instruction is spoken. Hebrew is never in an English read-aloud line.

## How to work (every lane)
1. Read `CLAUDE.md`, `CONTRIBUTING.md`, `docs/ONE-BITE-PLAYBOOK.md`, `docs/ONE-BITE-LANES.md` and this file. Add your name and lane under "Taken" in ONE-BITE-LANES.md. Check the open PRs, and do not edit another lane's files.
2. **Lanes B and C can start now**: write `do`/`your` data to the schema in Lane A's list. If Lane A's kit isn't merged yet, the player ignores those fields (round-1 behaviour), so nothing breaks.
3. Check your work:
   - `node tools/audit/ob-quick.js`;
   - `OB=test IDS=<ids> node tools/audit/play-shots.js`, then look at the pictures in `tools/audit/out/shots-ob/`;
   - `node tests/run.js`, which must pass.
4. Work in batches of about 10–20 bites per PR (branch `claude/ob-<lane>-<batch>`), with 2 phone pictures in each PR. A PR goes live by itself when the tests pass. After it is live, add a CHANGE note to the Drive HQ LOG and send the HoS one plain line with a picture.
5. Don't wait for approval. Keep going until your lane's levels are done or you are near 75% of the weekly limit. Then write where you stopped in ONE-BITE-LANES.md.

## Done looks like
A Kindergarten boy opens Math or Reading. He hears what he's learning, watches it once, does it with his fingers in 3–4 different ways, shows he knows it, and is done in about 4 minutes, wanting the next one.
