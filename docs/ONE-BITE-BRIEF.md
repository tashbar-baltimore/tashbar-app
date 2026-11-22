# ONE BITE — the overhaul of HOW we teach (master brief, v2, 2026-11-21)

> **Words the boys see (HoS 2026-11-21):** boys never see the word "bite". The screens say **TODAY WE LEARN** (step 1), **LEVEL CLEAR!** and **▶ Next level** (step 6), and "lesson" everywhere else, matching the map. "One Bite" stays only as the builders' name for this project and its files.

Paste this into a Claude Code session on `tashbar-baltimore/tashbar-app`. It replaces the first "JUMBO PROMPT: One Bite".

You are a builder on the One Bite overhaul for the Head of School (HoS), Rabbi Meir Khaver. He is not technical. Give him short updates in plain words, with phone pictures. **Do not wait for his approval.** He decided (2026-11-21): keep working, use your best judgment and the best research, and show samples as you go. Stop only for money changes or anything that cannot be undone.

## Before you touch anything (10 minutes)
1. Read `CLAUDE.md`, `CONTRIBUTING.md`, `docs/STATE.md`, and this file. They are binding.
2. Read `docs/ONE-BITE-PLAYBOOK.md`, `docs/TEACHING-AUDIT.md` and `docs/ONE-BITE-LANES.md` if they exist. The lanes file says who is doing what.
3. List the open pull requests (`gh api repos/tashbar-baltimore/tashbar-app/pulls?state=open`). Do not edit files another open PR is changing. In particular, the Reading-level rebuild lane owns `READ.*` lesson content unless the lanes file says otherwise.
4. Pick ONE lane from `docs/ONE-BITE-LANES.md`, add a line to it saying you took it, and work only in that lane.

## The HoS's words (the brief)
> "A kid opens it up: this is what we're learning today. One little bite-sized piece. This is how we do it, this is how you're going to do it. Right now it's so busy … things flying this way and that way. The teaching is repetitive. We need many more ways of learning. Each age needs a different approach. Anyone, with any disability, with any missing gap, can join at any level and learn."

## The North Star: every lesson is ONE BITE
Every lesson teaches one small skill through the same six steps, so each boy learns the path by heart:

| Step | What the boy sees | Built from |
|---|---|---|
| 1. TODAY'S BITE | One sentence, one picture, read aloud, plus "Why it matters" in kid words | `bite.today`, `bite.why` (fallback: `TL_TEACH.big` / `hook`) |
| 2. WATCH ME | One worked example, one step per tap | `bite.watch` (fallback: `TL_TEACH.ex[0]`) |
| 3. DO IT WITH ME | Guided tries with the steps showing; hints one at a time; a wrong answer names the missed step | the lesson's `teach` items, then the first practice items |
| 4. YOUR TURN | Practice on his own; the "How to do it" box folds away once he gets one right | the rest of `practice` |
| 5. SHOW ME | 3 tap-kind check questions, one try each. Mastery is earned here (unchanged rules) | `check` |
| 6. BITE DONE! | One line on what he learned, one button to the next bite | the existing finish/save |

The rules for every screen: one thing per screen and **one big button forward**. No stacked pop-ups, no flying parts, no timers, and no money pill, goal bar, mascot or joke jar during a bite. A 6-dot progress strip sits at the top, and a read-aloud button is on every screen.

## How it is built (the decided design)
- **The player:** `src/OneBite.html`, a boy add-on registered in `Photos.js` AND `Speed.js`. It takes over the lesson screen for any lesson that is "on" and reuses the engine's own `buildMission` / `answer` / `next` / `finish`. That means mastery, saving, pay and the server stay exactly as they are. `QuestPage.html` is full, so nothing new goes in it.
- **The switch:** `window.OB_LIVE` is `'test'` (TEST- boys only), `'on'` (everyone) or `'off'`. `OB_SUBJECTS` lists the subjects that are on. Any lesson can use the player straight away: the player builds a bite from the lesson's existing data (auto-bite). A hand-written bite in `ONE_BITE[skillId]` makes it great.
- **Bite data:** `ONE_BITE[skillId]` is defined in `src/OneBiteData*.html` files (one per subject and band, each under 150 KB). The schema is in the playbook. The minimum per bite: `band`, `today`, `why`, `watch` (steps), `ways` (at least 2), `ready` (2 tap questions), `bridge` (skill id), and `oops`.
- **Ages:** the band (K1 Little Learners, B23 Builders, E45 Explorers, M68 Masters) sets the font size, the number of choices, the reading load, how many cartoons, the bite length and the voice-first behavior. The player picks the band from the skill id's level when the bite does not declare one.
- **Gaps:** before a bite, a 2-question ready check. Two misses offer the bridge bite with one button, then bring him back. Stuck mid-bite (2 misses on one step) opens a smaller "one step" rescue screen built from that question's how-box.
- **Access:** read-aloud everywhere (existing VoicePro), a dyslexia-friendly font switch, 48 px or larger targets, high contrast, a tap choice for every drag, text for every sound, no red "wrong" screens, and progress that never moves backward.

## Phases (each ends with something the HoS can see; no waiting between them)
1. **Audit** → `docs/TEACHING-AUDIT.md` plus a 1-page summary with pictures. (Done in round 1; read it.)
2. **Playbook** → `docs/ONE-BITE-PLAYBOOK.md` (six steps, bands, ways-of-learning menu, access checklist, gap rules, review, writing rules, research basis). (Round 1.)
3. **Player + pilot** → the player behind the switch for TEST- boys, auto-bites for every lesson, 12 hand-written pilot bites (3 per band, covering Math, Reading, Writing and Kriyah), and new tests. Then switch the pilot subjects to `'on'`. (Round 1 starts this.)
4. **Rollout** → hand-written bites in batches of 20–40 per PR, lane by lane (see lanes). Each PR lists: bites added, ways of learning used, never-taught checks fixed, and 2 phone pictures.
5. **Staff tools** → a "Teach it at the board" card per bite (the bite in one sentence, the worked example, one hands-on activity, the 3 common mistakes and what to say) on the staff boy card, plus "stuck groups" (boys stuck on the same bite).
6. **Keep improving** → per-bite signals (the step where boys get stuck, the real time taken) and a monthly list of the 10 bites to rewrite.

## Writing a bite (content lanes)
- One skill. 3–10 minutes, depending on the band. Kid words, short sentences, and one new word at a time.
- Use at least 2 different ways across the steps: a picture model, manipulatives (ten-frame, number line, blocks, fraction bars, letter tiles), a story, a frum-family scene (Shabbos table, shul, Yom Tov shopping, kosher kitchen), a song or chant, movement, build it, sort it, Mistake Detective, teach it back, a chavrusa task, drawing, or a game round.
- Every check question must be answerable from what the bite taught. The test counts the misses, and your PR must lower the count.
- Keep the teaching standard (unit opener, hands-on practice, no plain multiple choice in practice, tap-kind checks, a How-to-do-it box on every question, modest frum family life, a wide mix of names, kosher food). Never write the Divine Name (use ה׳, and אלקים for Elokim). Copy Hebrew by script from a source text. Kodesh gets "REBBE: review after live" in the PR.
- Use made-up test boys (TEST-…) for screenshots and tests. Real boys use the app normally; never put a real name, code or record in the repo, tests, pictures or chat.

## Publishing (unchanged)
One topic per branch (`claude/ob-…`) and per PR. Run `node tests/run.js` (about 10 minutes); it must pass. A PR that passes goes live by itself, so test it as if the boys see it today. Packs in `packs/` must match `TL_PACKS` (sha256 + bytes) in the same PR. No `//` in `.html` add-ons. No clasp and no hand deploys. After it is live: check it live, add a CHANGE note to the Drive HQ LOG (folder `1NOL4XyWQgf5wm60gGNbmVG6ujY6RBIGS`), and send the HoS one plain line with a phone picture.

## Finish line
A boy of any age, with any gap or difficulty, opens the app and knows in five seconds what he is learning today. He learns it well in a few minutes and can't wait for the next bite.
