# HANDOFF PROMPT — Kindergarten Kriyah for Tashbar Learning 2.0
(Paste everything below into a new Claude Code session on the repository `tashbar-baltimore/tashbar-app`.)

---

My name is Esti. I am an approver for Tashbar Learning 2.0. You are the builder for **Kindergarten Kriyah** (the Alef-Beis and first nekudos, a full school year).

Another session already did the research, the year map, the art direction and a 3D sample. Everything is saved on the branch **`claude/awesome-pasteur-ars9b3`**, in **`v2/curriculum/k-kriyah/`**.

**I am not checking in until 9:30 tomorrow morning.** Work on your own all night, without stopping to ask me anything. When you would normally ask, pick your recommended choice, write it down in the decisions list (Part F), and keep going. At 9:30 I want finished work waiting for me to look at and approve.

## PART A. READ FIRST (in this order)
1. `CLAUDE.md` and `CONTRIBUTING.md` (the repository rules).
2. `v2/README.md`, `v2/FEATURES.md`, `v2/APPROVERS.json`.
3. From the branch `claude/awesome-pasteur-ars9b3` (run `git fetch origin claude/awesome-pasteur-ars9b3`), read everything in `v2/curriculum/k-kriyah/`:
   - `BUILDER-PROMPT.md`: **the full binding rules from the Head of School.** Every rule in it applies to you.
   - `MAP.md`: the full-year map. **APPROVED.** Build only what is on it.
   - `ART-DIRECTION.md`: the graphics prompt. **Binding on every screen.**
   - `samples/kriyah-sample-3d.html`: **the 3D look I approved.** Match it. `samples/src-3d.html` is the same file with a placeholder for the letter outline. `samples/beis.txt` is the Beis outline. `samples/play3d.js` is the script that played it as a boy.
   - `samples/kriyah-sample-2d.html`: a flat version. Use it only as the fallback when a device can't show 3D.
   - `recording-script.pdf` / `section-12.pdf`: what the rebbe was asked to record. `samples/make.py` builds them.

## PART B. DECISIONS ALREADY MADE (do not reopen them)
- **Pronunciation:**
  - Kometz "aw", Pasach "ah", Segol "eh", Tzeirei "A" (as in "day"), Chirik "ee", Cholam "O", Kubutz and Shuruk "oo".
  - ת with a dagesh is **Tuf**; ת without a dagesh is **Suf** ("s" sound).
- **Nekudos are taught the Mesorah way:** nekudah, letter, sound ("Kometz, Beis, baw").
- **Letters come first, all of them, very well, before any nekudos.**
  - Each letter has its **name** and its **own lone sound**: Beis "b", Gimmel "g", Shin "sh".
  - **A letter never says "Sha" or "Shaw" before nekudos.**
  - **Alef and Ayin are quiet** ("Alef is quiet, it waits for its nekudah"), but he learns that Abba starts with Alef.
  - Matching games link a letter to a picture that starts with its sound (Shin goes with the shofar).
- **Look-alike letters:** taught apart first, then compared side by side with the difference glowing.
- **Final letters:** matched to their regular partners.
- **No writing in Kindergarten.** Ksav yad is not in K. There is no tracing to write; "feel the shape" is for touch only.
- **Listening for a word's first sound** ("Shabbos" starts with "Sha" = שַׁ) comes only with the nekudos, not before.
- **Graphics: real 3D** (three.js) in the approved sample's style: glossy "premium toy-box" 3D, a living world, original art only.
- **The voice is the rebbe's own recording.** Until it arrives, use the computer voice (speechSynthesis), clearly marked as temporary.
- **English game lines** ("Watch me… now you!"): computer voice for now.
- **Mendy** (kippah, tzitzis) is the friendly character. Beis = a house (bayis) with Mendy inside: the dot is "someone home". Veis = nobody home.

## PART C. THE REBBE'S RECORDING
- Rabbi Khaver: **rabbikhaver@tashbarbaltimore.org**.
- He was asked (by email, from Esti's Gmail) to record **only Section 12 tonight**: the 25 letters' own lone sounds, about 3 minutes, as a test. He will reply with a voice memo attached.
- The full list (sections 1–12, 288 sounds) comes later, in 5-minute pieces. Don't send him anything else.
- **If you can reach Esti's Gmail** (Gmail tools), look in that email thread for his reply.
- **If the recording is there:**
  1. Download it.
  2. Cut it into 25 separate sounds by the silences (ffmpeg `silencedetect`). They are in the order of `section-12.pdf`: בּ ב ג ד ה ו ז ח ט י כּ כ ל מ נ ס פּ פ צ ק ר שׁ שׂ תּ ת (Alef and Ayin are not in it).
  3. Check the count is exactly 25 plus the spoken "Section 12" at the start. If the count is off, don't guess: write it in the report.
  4. Save them small (mono MP3 or OGG, 64 kbps) in `v2/app/k-kriyah/audio/`, and use them in the games for the letter sounds.
  5. Do **not** reply to the rebbe. Esti will.
- **If it isn't there:** keep the computer voice, and build the games so each sound plays from an audio file when one exists and falls back to the computer voice when it doesn't.

## PART D. TONIGHT'S WORK: Unit 1, finished, as ONE pull request ready for my look in the morning
**My request, in my words:** "Build the first unit of Kindergarten Kriyah, in the 3D look I approved, ready for me to look at and approve at 9:30."

**Unit 1 (from MAP.md): Alef, Beis, Veis (א בּ ב).** Alef is quiet, Beis says "b", Veis says "v". He also learns how the games work.

Build, in this order:
1. **Unit opener (Picture Story)**, short, warm and patient:
   - Mendy's first day in cheder: Tatty walks him there, and the rebbe shows him the first letter.
   - Alef: Abba starts with Alef; Alef is quiet.
   - Beis: the house turns into Beis, and Mendy becomes the dot (as in the sample).
   - Veis: no dot, nobody home.
   - Every spoken line is 12 words or fewer, with a big "hear it again" button.
2. **Game 1: Look-Alike Detective, Beis and Veis.**
   - The sample's game, made complete: show-then-try demo, kind correction, 2-of-3 stars, and it quietly gets easier when he struggles (the right house glows).
3. **Game 2: Feel the Shape.**
   - He runs his finger along the 3D letter (א, בּ, ב) while it glows along the path and its name and sound play.
   - This is touch only, not writing.
4. **Game 3: Letter Hunt.**
   - Find every Beis hidden in a 3D scene: a sukkah, a shul or the Shabbos table.
   - Alef and Veis are mixed in as other letters.
5. **Game 4: Find the Mistake.**
   - "Yaakov says this is a Beis. Is he right?" He taps yes or no, then drags the right letter in.
6. **Mastery check:** "hear it, tap it", mixed. Tap-to-check is allowed. Passing is 2 of 3 stars.
7. **Bonus round** for quick boys (more letters, faster). Unit 1 has no earlier units, so there's no review round yet.

**Where things go** (stay in your own lane):
- `v2/app/k-kriyah/`: the games. Unit 1 starts at `v2/app/k-kriyah/index.html`.
  - Put three.js 0.160.0 and its add-ons in `v2/app/k-kriyah/lib/` (`three.module.min.js`, `SVGLoader.js`, `RoomEnvironment.js`), so nothing depends on another website and it works on slow Wi-Fi.
- `v2/tests/k-kriyah-*.js`: the tests.
- `v2/screens/k-kriyah/`: the pictures.
- `v2/curriculum/k-kriyah/`: notes, and the decisions list.
- **Do not change** shared files: `v2/app/index.html`, `v2/app/core.js`, `v2/FEATURES.md`, `v2/README.md`, the sign-in, the path, the art or sound kit.
  - The shared sign-in and path is in the open pull request [tashbar-baltimore/tashbar-app#248](https://github.com/tashbar-baltimore/tashbar-app/pull/248), not merged yet.
  - So for now each game saves its stars on the device (`localStorage`, key `tl2:k-kriyah`), and **also** sends `parent.postMessage({tl2game:'k-kriyah/u1gN', stars})` so the shared path can save it to the boy's record later.
  - List any shared change you need in the morning report, in one line each. Don't make it.

**Letter shapes:** use the real font outlines. Get them with npm `@fontsource/noto-serif-hebrew` (weight 800) plus `opentype.js`, writing the path with y pointing up, exactly as `samples/beis.txt` was made. Nekudos and dagesh are glossy 3D shapes you place yourself.

**Must work on:** a school Chromebook (1366×768) and a phone (390×844), by touch and by mouse. Buttons are at least 64 px. No pop-ups and no menus.
- If WebGL isn't available, show a flat fallback, never a blank screen.
- Add `?fast=1` so tests can run quickly (short waits).

## PART E. BEFORE YOU SAY IT'S READY (rules from BUILDER-PROMPT.md Part 5; all binding)
1. **Tests** in `v2/tests/k-kriyah-*.js`, one per game. Each exports `async (browser) => ({fails, oks})` and checks:
   - it loads, and shows real content (canvas pixels not blank);
   - it can be won;
   - a wrong answer is handled;
   - it saves;
   - the next game unlocks.
   - `node tests/run.js` must pass.
   - The test browser can do WebGL (checked: plain `chromium.launch()` gives WebGL 2).
2. **Play every game yourself as a made-up boy**, from start to end, at Chromebook size and phone size.
   - Take pictures of every game: at its start, in the middle, after a wrong answer, and at the end.
   - **Look at every picture.** A blank, white, half-loaded or frozen screen is a failure. Fix anything washed out, too small, cut off or crowded.
   - Software 3D is slow in this sandbox, so run long plays in the background and wait for them.
3. **Independent review:** start a fresh sub-agent that didn't build anything. It scores each game 1–5 on:
   - (a) teaches the named skill, (b) right for age 5–6, (c) builds on the last step, (d) every kind of learner, (e) show-then-try, (f) mistakes teach, (g) fun, (h) looks beautiful, (i) values and safety.
   - Fix things and score again until every score is 4 or 5. Put the table in the pull request.
4. **Kodesh care:**
   - Never write the Divine Name.
   - Never use the word "bite".
   - No real student names or codes. Use TEST codes only.
   - Write a "for the rebbe" note in the pull request listing every sound and rule used.

## PART F. GIT, PULL REQUEST AND THE MORNING
- **Branch:** create `claude/v2-k-kriyah-unit1` from the newest `origin/main`. Bring in all of `v2/curriculum/k-kriyah/` from `claude/awesome-pasteur-ars9b3`.
  - If this session says you may only push to one particular branch, use that branch, and say so in the report.
- Commit often, and **push before you stop**. The computer is erased afterward.
- **Open ONE pull request for Unit 1** that changes only `v2/`, with:
  - at the top, my request in my words (Part D);
  - what the boy sees and hears in each game;
  - the pictures;
  - the review score table;
  - the "for the rebbe" note;
  - the decisions you made on your own.
- When the tests pass, the system posts a **look link** on the pull request by itself.
- **NEVER post "APPROVED FOR 2.0".** Only I can ask for that, after I look. Never merge or publish by hand.
- **Write `v2/curriculum/k-kriyah/MORNING-REPORT.md`** (and put the same text in the pull request) in short, plain words:
  1. The look link, and **exactly where to tap**.
  2. What's finished, and what the boy sees and hears.
  3. What's not finished or is broken. Say it first, honestly.
  4. The decisions you made on your own, each one line, so I can say yes or change it.
  5. Whether the rebbe's recording arrived, and what you did with it.
  6. The shared changes you need, one line each.
  7. What's next (Unit 2: Gimmel, Daled, Hei).
- **If you finish Unit 1 early, don't start new features.** Polish Unit 1: more beautiful, smoother on a Chromebook, kinder corrections. Then stop.

## PART G. THE ONE-LINE GOAL (check every piece against it)
"Fun, easy, skill-building games that teach every kind of boy real skills, one step on top of the next, all year, until he graduates."
