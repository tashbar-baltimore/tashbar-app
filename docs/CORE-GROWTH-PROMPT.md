# JUMBO PROMPT: Core Growth (a half year of real learning, every grade)

**For the Head of School (HoS):** paste this one line into any new Claude Code session on `tashbar-baltimore/tashbar-app`:

> Read `docs/CORE-GROWTH-PROMPT.md` in the repository and follow it. Take the next free job and claim it.

That is all. The session reads this file, sees which jobs are free in `docs/CORE-GROWTH-LANES.md`, claims the next one, and starts. You never need to choose a lane yourself.

---

You are a builder on Tashbar Learning **1.0** for the HoS, Rabbi Meir Khaver. He is not technical, so give him short updates in plain words, with pictures.

**Ship as soon as it is ready (2026-11-25).** When a piece of work is finished, open its pull request right away. Finished means: the tests pass, the independent review scores every point 4 or 5, and you have looked at it as a boy. Do not hold it back for anyone to look at or test. Auto-publish puts it live for every boy about 15 minutes after the `test` check passes. The tests and the review are the only gate, so do them properly.

**Do not wait for his approval between batches.** Keep working and use your best judgment. Stop only for:
- money changes;
- anything that cannot be undone;
- the points this file marks **HoS DECISION**.

## 0. First 20 minutes: read, then claim a job

1. Read `CLAUDE.md`, `CONTRIBUTING.md`, `docs/ONE-BITE-PLAYBOOK.md`, `docs/ONE-BITE-AUDIT-2026-11-22.md`, `docs/TEACHING-AUDIT.md`, `docs/HANDOFF-PICS.md`, this file and `docs/CORE-GROWTH-LANES.md`. They are binding. Where they differ, CLAUDE.md wins.
2. **Claim a job:**
   1. `git fetch origin main` and read `docs/CORE-GROWTH-LANES.md` **on `origin/main`**, not on an old copy.
   2. List the open pull requests. Any open PR titled `Core Growth claim: <job>` means that job is being claimed.
   3. Walk the **Jobs** table top to bottom. Take the **first job** whose status is `OPEN` and that has no open claim PR. If a job's "Needs" column names a job that is not `DONE`, you may still take it when its row says "can start now".
   4. **Stale jobs:** a `TAKEN` job counts as `OPEN` again when (a) its "Last update" is more than **48 hours** old, and (b) it has no open PR, and (c) it has no commit on its branch in 48 hours. Before you take it over, read what the last owner wrote and continue from there.
   5. **If every job is taken,** look at the **Helpers wanted** list. Each job owner lists pieces a helper can do, for example "Grade 5, Units 3–4". Take the first free piece and claim it the same way.
   6. **Make the claim:** make a branch `claude/core-claim-<job>`. Change **only your job's row**: status `TAKEN`, today's date, your session link, and "Last update" = now. Open a PR titled `Core Growth claim: <job>`. It goes live by itself after the tests (about 15 minutes). You may start reading and planning while it runs.
   7. **If the claim PR has a conflict,** fetch main again. If someone else took that job first, close your PR and claim the next free job.
3. **Match the request.** Here are the HoS's own words, 2026-11-24:

   > "Beef up all their lessons to contain about a half a year's worth of work, and to make the lesson quality even and upgraded … content, variety of skill lessons … the variety of different ways to learn based on proven research … reflective of the age and the skills being taught … the learning upgraded in a very, very dramatic way … 3D, immersive, comprehensive, varieties, very even … no downtime and fluff and boringness … we want to keep it exciting, we want to keep it popping, so that kids want to spend the time doing it."

   Your one-line check, for every PR: **"Does a boy now have more real, new learning in core skills, at an even high quality, that is exciting to do and has no filler?"**
4. **While you work,** update your row's "Last update" and "Where I am" at least once a day. A one-line PR is fine. When you stop, write exactly where you got to and what is next. Sessions have been lost overnight before.

## 1. What we are fixing

The analysis of 2026-11-23 found that each grade has about 60–70 short lessons in all of general studies. That is about 12–25 hours of new teaching. A boy runs out within weeks.

**The goal:** every grade, K–8, gets **half a school year (about 90 school days)** of real, new learning in the core skills. That learning is even in quality, varied, made for his age, **exciting enough that boys want to spend the time**, and has no filler.

**Mastery, not repetition.** A boy who shows he has a skill moves on to the next small skill at once. More lessons does **not** mean more drill. It means **more small steps up the ladder**, plus real reading and real writing. A fast boy keeps climbing into the next grade's ladder, so every grade must exist.

### What is in scope
| Kind | Subjects | Priority |
|---|---|---|
| **CORE** | Reading foundations (sounds, phonics, decoding, fluency), Reading comprehension (stories and information), Vocabulary and word parts, Grammar and sentences, Writing | **First.** Most of the work. |
| **SECONDARY** | Science, Social Studies | **Kept, not dropped (HoS).** Built after the core ladders for that band exist (job S). Their readings also count as information reading for the core, because boys understand what they read much better when they know about the topic. |
| **NOT IN SCOPE** | **Math (`MATH.*`) is handled separately. Do not touch any Math file or lesson.** Kodesh, Electives, Life and Computing are also out. | — |

**Not in scope at all:** `v2/` (Tashbar Learning 2.0). This is 1.0 work only.

## 2. How much to build (per grade, for the half year)

**Count minutes, not lessons.** Every content job keeps an **expected-minutes ledger** for a typical boy (`docs/core-growth/<job>-ledger.md`). Each PR reports the running total against the target.

| Per grade | K–1 | 2–3 | 4–5 | 6–8 |
|---|---|---|---|---|
| Core minutes a day (only to size how much to build; the boy's day is a list to cover, not a clock) | 45 | 60 | 60 | 60 |
| **Core hours for the half year** | **≈ 68** | **≈ 90** | **≈ 90** | **≈ 90** |
| Small skill lessons (5–12 min) | 140 | 110 | 100 | 90 |
| Reading texts with questions | 80 little readers (decodable first), plus 40 listen-along stories | 50 texts (150–600 words) and 3 chapter books | 35 texts (500–1,200 words) and 3 books | 30 texts (800–2,000 words) and 3 longer works |
| Fluency passages ("read it 3 times") | 40 | 40 | 25 | 10 (expression, poetry, speeches) |
| Writing pieces (plan → draft → revise → publish) | 30 (a picture and 1–3 sentences) | 14 (sentences, then paragraphs, letters, stories) | 12 (multi-paragraph) | 10 (essays, arguments, a short research piece) |
| Unit checks (mixed, cumulative) | 12 | 12 | 10 | 10 |

These are **minimums to plan from, not quotas to pad**. If a lesson is not needed, leave it out and say why in the ledger. Existing lessons (`READ.*`, `LANG.*`, `WRIT.*`) are reused and brought up to the standard. They count once they pass it.

**Order of building:** build in the order a boy meets the work.
1. **Unit 1** of every grade in your band;
2. then **Unit 2**;
3. and so on.

That way every boy gets new learning as soon as possible, and no grade sits empty while another is perfect.

## 3. The shape: skill map → units → lessons

### Step 1 · The skill map (your first content PR, docs only)
Write `docs/core-growth/<job>-map.md` for your band:
- **Core skills** (the big skills, for example "finds the main idea and the details that prove it").
- **Small skills** under each, in teaching order. Each small skill is one lesson.
- **Where each comes from:** Common Core ELA is the reference for grade level, and the science-of-reading research for K–3 foundations. Write the standard code next to each skill.
- **What already exists** (lesson id, and whether it passes the standard), **what is missing**, and **what you will build**, with minutes.
- **Units:** 4–10 small skills plus one real reading or writing task plus a unit check. Each unit is 1–2 weeks of a boy's time.
- **The cast:** a 1-page note on your band's recurring characters (section 5).
- **Helpers wanted:** add pieces a helper could take, such as "Grade 5, Units 3–4", to the Helpers list in the lanes file.

### Step 2 · Each unit has
1. **A unit opener (the HoS teaching standard).** It is brief, clear, inspiring and patient: what we are learning, why it matters, and a big picture or scene of the unit's world. This is where the most dramatic art goes (section 6).
2. **Small skill lessons** in the One Bite shape: Today we learn → (ready check) → Watch me → Mistake Detective → Do it with me → Your turn → Show me → Level clear.
3. **The real task**, such as a whole story or article, a chapter of the class book, or a writing piece. This is where the skills are *used*.
4. **A unit check:** 8–12 questions mixing every skill in the unit plus 2–3 from earlier units, all tap kinds. It is staged as an exciting "boss level" moment. Passing it opens the next unit by itself (job T builds this). Failing it sends him back to exactly the small skill he missed.
5. **Test-out:** before each unit, a short pre-check. A skill he already has is marked "shown", and he skips it. **No boy sits through what he already knows.**

### Step 3 · Lessons
- New lessons need new skill ids. Use the strand prefixes that exist (`READ.PA`, `READ.PHON`, `READ.FLU`, `READ.COMP`, `READ.LIT`, `READ.VOC`, `READ.LV`, `LANG.GRAM`, `LANG.MECH`, `LANG.USE`, `LANG.SENT`, `WRIT.SENT`, `WRIT.PARA`, `WRIT.ESSAY`, `WRIT.RES`, `WRIT.HAND`). Level = grade + 1. Number from the next free number.
- Add new skills **only the way job T's note says** (`docs/core-growth/HOW-TO-ADD-A-SKILL.md`). Until that note exists, build your map and write lesson data on your branch, but do not open lesson PRs.
- Lesson data goes in **your job's own data files**: `src/CoreData<Job><n>.html`, each under 150 KB. Register a new file in `Photos.js` AND `Speed.js` in the same order.
- **Long texts (stories, books, articles) never go in the start-up bundle.** They go in the content store that job T builds, which loads a text only when the boy opens it. Every Chromebook already loads about 40 MB at each start, and we must not make that worse.

## 4. The quality bar (binding on every lesson, every job)

- **The HoS 9-point standard:**
  1. a clear goal;
  2. real teaching;
  3. progression;
  4. thinking steps;
  5. mistake work;
  6. variety and age fit;
  7. what is asked was taught;
  8. correct and clear;
  9. warm.

  Every point must score **4 or 5**.
- **The quality gate** (`tests/lib/obquality.js`) must pass for every new or changed lesson:
  - 2 + 5 activities and 3+ kinds, with no repeats;
  - a mistake activity in do 1–2 or your 1–3;
  - no tiles that only type an answer;
  - spoken lines of 12 words or fewer;
  - a song or movement for K–3, "tap the reason" for 4–5, and teach-it-back for 6–8;
  - never the word "bite".

  Never add to `tests/quality-baseline.json`, never raise `frozen`, and never weaken a rule.
- **Taught, then asked.** Every check question must be answerable from what the lesson showed. Check the **whole range** of check questions, not one sample.
- **No giveaways.** Do not print the check answer before the check. Do not use "count the pictures" where the answer is the number of pictures. Do not use a tile order with two right answers. Keep a check passage "cold": teach on one text, check on another.
- **Reading level must match the grade.** Use passage lengths from section 2 and grade-level vocabulary. A Grade 5 "main idea" lesson on a 5-sentence paragraph is not grade level.
- **No plain multiple choice in practice.** Check questions stay tap kinds. Every question has a kid-friendly "How to do it" box that never gives the answer.
- **Family Life (HoS 2026-11-15):** modest, warm, normal frum family life; a wide mix of names; kosher food. Never write the Divine Name (use ה׳; אלקים for Elokim).
- **Independent review before every lesson PR.** A fresh reviewer that did not write the lessons (job V, or a fresh reviewer you start) scores each one 1–5 on the 9 points, against the lesson data and its full range of check questions. Ship only when every score is 4 or 5. Put the score table in the PR.
- **See it as a boy.** Play every new lesson as a made-up TEST- boy at Chromebook size (1366×768) and phone size (390 px). LOOK at every screen and put the pictures in the PR. Report what the boy sees. If you did not look, say so.
- **Make the content even across grades.** Job V compares jobs every week. A Grade 6 unit must feel as rich and exciting as a Grade 2 unit.

## 5. Ways of learning (research-based; each unit uses at least 4, and no two lessons in a row have the same shape)

### Across all ages (the learning-science base)
| Way | What it looks like in the app | Research |
|---|---|---|
| Explicit teaching with a worked example | Watch me, one step per tap, then the steps fade | Rosenshine 2012; Sweller (worked examples); Renkl & Atkinson (fading) |
| Retrieval practice | Show me, unit checks, warm-up questions from old skills | Roediger & Karpicke 2006; Dunlosky et al. 2013 ("high utility") |
| Spacing and mixing | Review at 1, 3, 7, 14, 30 and 60 days (already live); unit checks mix old and new | Cepeda et al. 2006; Rohrer (interleaving) |
| Mastery with test-out | Pre-check skips known skills; a failed check sends him to the exact small skill | Bloom 1984 (mastery learning) |
| Explaining why | "Tap the reason", "Which step did Dovid skip?" | Chi (self-explanation); Dunlosky 2013 |
| Feedback that names the step | A wrong answer says *which step* went wrong, never just "wrong" | Hattie & Timperley 2007 |
| Words and pictures together | A diagram, map or organizer next to the words, never instead of them | Mayer (multimedia principles); Paivio (dual coding) |
| Mistake work | Mistake Detective: find and fix the real error boys make | Durkin & Rittle-Johnson 2012 (contrasting cases) |
| Building knowledge | Texts in topic sets (5–8 texts on one topic), so knowledge grows and comprehension follows | Recht & Leslie 1988; Willingham |
| Challenge and choice | After mastery, an optional harder "challenge round"; a choice of which text in the topic set to read first | Self-determination theory (Deci & Ryan); "desirable difficulties" (Bjork) |

### Reading foundations (K–2, and older boys who need it)
- **Daily oral sound play:** rhyme, first sound, blend, segment, change a sound. No letters, just ears (National Reading Panel 2000).
- **Sound boxes (Elkonin boxes) and word building:** tap a tile for each sound, then build the word. **Word chains:** cat → hat → hit → hip.
- **Systematic phonics in a fixed order, then decodable little readers** that use only taught patterns (NRP 2000; Ehri, orthographic mapping).
- **"Heart words":** irregular words, with the tricky part marked in the picture.
- **Say it, trace it, write it:** a multisensory pattern (Orton-Gillingham tradition). Trace with a finger or a stylus on the Chromebook.
- **Dictation:** hear a word or sentence, then build or spell it.
- **Songs, chants and movement** for K–3. Every K–1 unit has a movement break.

### Fluency
- **Repeated reading with a model:** hear it read well, then read it along 3 times with the words lighting up (Rasinski; Samuels 1979).
- **Phrase-cued text** (scoops under phrases), **echo and choral reading**, **Readers' Theatre** (parts in a play, 2–5 boys or with the voice).
- **No voice recording (HoS 2026-11-24: "we're not doing recording yet").** Do not build anything that records a boy's voice. Fluency uses listen → read along → self-check.
- **No timers on the screen.**

### Comprehension and literature
- **Reciprocal teaching:** predict, question, clarify, summarize (Palincsar & Brown 1984). Each is a small skill first, then used on every text.
- **Text evidence:** "Tap the sentence that proves it" (the passage itself is the answer area).
- **Story grammar and retell:** characters, setting, problem, events, solution, using a story map he fills in.
- **Question types:** right there, think and search, author and me (Raphael, QAR).
- **Main idea:** the "umbrella" and its details, then **summarize in 15 words (GIST)**.
- **Inference ladders:** clue + what I know = inference.
- **Compare two texts** on the same topic, and **author's purpose and point of view** (Grades 4–8).
- **Close reading** for Grades 6–8: reread one paragraph for word choice and structure.
- **Chavrusa prompts:** "Tell your chavrusa which sentence proves it, and why." This fits our school and is proven peer learning.

### Vocabulary and word parts
- **Robust vocabulary:** 5–8 rich words per text, taught with kid-friendly meanings, examples and non-examples, then used again across the unit (Beck, McKeown & Kucan, *Bringing Words to Life*).
- **Word parts:** a prefix + root + suffix builder (un + help + ful). This matters most in Grades 3–8.
- **Context clues:** a small skill, then practice in every text.

### Grammar and sentences (HoS 2026-11-24: taught through writing, not label drills)
- Traditional grammar drills on their own did not improve writing (Graham & Perin 2007, *Writing Next*). So grammar is taught by **building and fixing sentences**:
  - **Sentence combining:** two short sentences become one strong one (Writing Next: a strong effect).
  - **Sentence expansion:** who, what, when, where, why.
  - **because / but / so**, **appositives** and **fix-it sentences** (Hochman & Wexler, *The Writing Revolution*).
  - Every grammar lesson ends with the boy using the skill in **his own sentence** about a text he read.
- Mechanics (capitals, punctuation, spelling patterns) are taught the same way: build, fix, use.
- Grammar terms (noun, verb, clause) are still taught, as tools for building better sentences, not as a goal by themselves.

### Writing
- **SRSD (Self-Regulated Strategy Development)** is the strongest-evidence writing method for children (Graham & Harris). Teach a memory strategy, model it, have him memorize it, then guided, then on his own. Examples:
  - **POW + TREE** for opinion writing;
  - **POW + WWW What=2 How=2** for stories;
  - **TIDE** for information writing.
- **Mentor text:** study a short, good model before writing the same kind.
- **Plan → draft → revise → publish**, each its own screen, with a checklist he must meet (not only self-ticked boxes).
- **Short daily writes** (2–5 sentences about the day's text) on most days.
- **K–2 transcription:** letter formation, spelling patterns and sentence dictation. Transcription is a real skill; the youngest writers need it fluent.
- **Teacher feedback:** every writing piece goes to the teacher's writing inbox (job T) with a simple rubric. **A writing piece is never marked "right" just for being typed.** Mastery of writing *skills* comes from the tap checks on the small skills. The *piece* is scored by the teacher.
- **Publishing:** his finished piece goes into "My book" with a picture, which his parents can see in the parent portal. Seeing his own book grow is a big motivator.

### By age (how the same ideas look at each band)
| Band | Feel |
|---|---|
| K1 (K–1) | Voice first, big pictures, songs, movement, manipulatives, 3–5 minutes per lesson, almost no reading in instructions. Off-screen tasks count: trace on paper, read to Mommy or Tatty. The K–1 home stays games-only (HoS rule); new lessons join its game path in skill order. |
| B23 (2–3) | Read-along highlighting, building and sorting, short chapter books with recurring characters, the first SRSD strategies. |
| E45 (4–5) | Strategies with reasons ("tap the reason"), longer texts, word parts, multi-paragraph writing, compare texts. |
| M68 (6–8) | Respect and challenge: debate, close reading, teach it back, real-world writing (letters, speeches, arguments), longer works, fewer cartoons and more real-world art. |

### Recurring characters (immersion through story)
Each band has **one warm frum family or group of friends who appear across its texts**, with a wide mix of names, kosher food, Shabbos and Yom Tov, and modest dress. Boys follow them from unit to unit, and chapter books end chapters on a **cliffhanger**, so boys want to come back. Write the cast note in your map first, so the characters stay consistent across jobs. Jobs in the same band share one cast (it is listed in the lanes file).

**Texts are original** (written for Tashbar) or **adapted from the public domain** (for example Aesop or classic fables, retold in keeping with our Family Life rules). Never copy a copyrighted book or article.

## 6. Make it pop: exciting, immersive, and still fast (HoS 2026-11-24)

The HoS wants a **dramatic** upgrade: 3D, immersive, cutting-edge, **exciting and popping, so boys want to spend the time**. The excitement must come **from the learning itself**, with the work screens staying quick and clear. Research is clear that decoration on top of the thinking lowers learning (Harp & Mayer 1998; Fisher, Godwin & Seltman 2014), and the app's own audit found "too busy". So put the energy where it lifts the learning.

### Where the big energy goes
- **Unit openers:** a full-scene illustration or a light 3D scene of the unit's world, with sound and a short, punchy "today we learn" moment.
- **The Reader:** an illustrated page for every story and chapter, depth and parallax on covers and chapter openers, characters that stay the same, and cliffhangers.
- **Manipulatives that feel real:** letter tiles, word-part blocks and sentence strips that lift, snap, click and pop into place, with satisfying sounds. A built word or a combined sentence "lights up" when it is right.
- **Animated worked examples:** a sentence being combined, a word being built, an inference ladder being climbed. Movement that *shows the step*.
- **Boss-level unit checks:** a dramatic entrance and a big win moment, then the next unit's world opens on the map.
- **Challenge rounds after mastery:** optional, harder, faster, for boys who want more.
- **"My book":** his published writing with pictures, growing through the year.
- **Models that are 3D by nature** (job S): solar system, the water cycle, the inside of a plant, a 3D globe and maps for history.
- **Money Show:** stays exactly as the HoS decided. Do not add new money effects or rewards (the server sets every amount; any change is an HoS decision). Job D makes every payment say what it is for.

### Rules that keep it fast and clear
- **Celebrate at moments of success and change of screen, not on top of thinking.** While he reads or works out an answer, the screen is clear.
- **Never make him wait.** Every effect is 1 second or less, does not block the next tap, and can be skipped by tapping.
- **Every picture on a work screen must carry meaning.** Ask: "If I take it away, does the boy lose information?" If not, it goes to the opener or the win moment instead.
- **No 3D drawing behind question screens.** The existing guard (`tests/lib/warp3d.js`) keeps lessons at full speed. A 3D model is allowed on a question screen only when the model *is* the question.
- A 3D scene must be ready in under 2 seconds on a Chromebook, have an off switch, and respect "reduce motion".
- Pictures follow the PICS rules (`docs/HANDOFF-PICS.md`): WebP, at most 1,100 px wide, at most 200 KB, a row in `art/CATALOG.md` with source, licence and author, and alt text (the shared art library, `art/README.md`). `tools/pics-check.js` must pass.
- Images of people: modest, warm, frum family life, by the Family Life decision.

### Who makes the art
- **Shared art library (HoS 2026-11-24):** all art lives once in `art/` for 1.0, 2.0 and every future app. Search `art/CATALOG.md` first and add what you make, with its row (CLAUDE.md, "Shared art library"; `art/README.md`).
- **You can make in code:** diagrams, organizers, story maps, letter and word tiles, 3D models (CSS 3D or a small WebGL scene), animated steps, and sound effects.
- **The HoS's image account makes illustrations:** scenes, characters and book pages. You cannot reach it yourself. Instead:
  1. Write a **picture order list**: `docs/core-growth/<job>-picture-orders.md`. For each picture give the file name, the screen it goes on, its size, the exact image prompt, and the band's **style sheet** (one per band, written once by job T: same art style, same characters, same colors).
  2. Batch the orders (20–40 at a time) and tell the HoS in one line: "Picture order N is ready: <link>."
  3. The HoS makes them and puts them in a Google Drive folder. Use the Drive connector to fetch them, check every one against its order and the Family Life rules, convert to WebP, and add them by PR to `art/` (original in `art/originals/`, app-ready WebP in `art/pics/`, a catalog row).
  4. Licence line: "made for Tashbar Baltimore with an AI image tool, owned by the school".
  5. Until the pictures arrive, the screen uses a coded placeholder that still teaches and still looks good, never an empty box.

## 7. The jobs

Each job edits **only its own files**. Take jobs in the order of the Jobs table in `docs/CORE-GROWTH-LANES.md` (the same order as below).

| Job | In plain words | What it builds | Owns |
|---|---|---|---|
| **T · Tools** (first; others can start planning at once) | The **tools every lesson writer needs** before lessons can be added. | (1) `HOW-TO-ADD-A-SKILL.md` and one simple way to add a new skill to every list that needs it (map, placement, curriculum index, staff grid). (2) The **content store**: long texts load only when opened. (3) The **book Reader**: a boy reads a story page by page, hears it read with the words lighting up, taps a word for its meaning, taps the sentence that proves an answer, and sees his chapter progress. (4) The **Writing Workshop**: plan → write → fix → finish screens with a checklist he must meet, and the **teacher writing inbox**, where the teacher reads, scores with a simple rubric and sends it back with a note. It replaces today's "any text counts as right". (5) **Unit checks and test-out**: passing opens the next unit by itself, and a miss sends him to the exact small skill. (6) New activity kinds: sentence builder and combiner, evidence tap, story map, word-part builder, fill the gap (cloze), dictation, put the story in order. (7) The style sheets, the picture-order format and the "make it pop" pieces from section 6 (snap and pop tiles, the boss-level entrance, "My book"). (8) The **minutes ledger** report: hours per grade per strand vs target. | `src/CoreKit*.html`, `src/CoreReader*.html`, `src/CoreWrite*.html`, the server code for the inbox and units, `tests/lib/core*.js`, `docs/core-growth/HOW-TO-*.md` |
| **D · The daily plan** | **Replace "3 lessons, then the Arcade opens"** with a plan built on **how much he covers, not minutes** (HoS 2026-11-24). | (1) **Today's list** for each boy: a set amount of material to cover, for example "2 reading lessons, 1 chapter of your book, 1 grammar lesson, 1 writing step, review". It is taken from where he stands on each ladder: core first, then Science or Social Studies, then review. **No minutes per subject and no timers.** The day is done when the list is covered, not when time runs out. A skill he tests out of counts as covered, so a fast boy moves ahead faster. (2) The amount on the list comes from a school default that staff can change per class and per boy. The builder suggests a default sized for a typical boy, and shows it to the HoS with pictures before it goes on for everyone (TEST- boys first). (3) One "next" button walks him through the list. He sees how much is left ("3 of 6 done"). The Arcade opens when the list is done. (4) **Money (HoS 2026-11-24):** keep paying for each thing finished and each right answer, exactly as today. The daily bonus is paid when the **whole list** is done ("if you do everything, you get your bonus"), instead of after 3 lessons. It keeps the same amount. Do not add any other new money. (5) **Make the money clear (HoS 2026-11-24: "I don't know if the kids understand what they're getting money for").** Every payment the boy sees says in a few words what it is for ("+$10 · You finished a lesson", "+$1 · Right answer", "Daily bonus · You finished today's list"), and the money page has a short "How I earn money" card in plain words. These are display only: the server sets every amount. (6) A staff screen shows each boy's list and how far he got. The K–1 games-only home stays (the list picks the next game). | `src/DailyPlan*.html`, its server file, `tests/lib/dailyplan.js`; the "My work" rounds in `src/GameMap.html` (only that part); the daily-bonus trigger and payment labels in `src/Money.js` (only those parts) |
| **F · Foundations K–2** | Learning to read: sounds, letters, reading words, first books. | Phonemic awareness, phonics, decoding, heart words, handwriting and spelling, little readers and listen-along stories, fluency K–2. | `src/CoreDataF*.html`, its texts |
| **C45 · Comprehension Gr 4–5** | Understanding what you read, Grades 4–5. | Comprehension and literature, information texts in topic sets, books, fluency Gr 4–5. | `src/CoreDataC45*.html` |
| **W48 · Writing Gr 4–8** | Real writing, Grades 4–8. | Multi-paragraph writing, opinion and argument, information and research, narrative, revision. | `src/CoreDataW48*.html` |
| **C23 · Comprehension Gr 2–3** | Understanding what you read, Grades 2–3. | Comprehension and literature, information texts in topic sets, chapter books, fluency Gr 3. | `src/CoreDataC23*.html` |
| **G · Grammar and words K–8** | Grammar through building sentences, plus vocabulary. | Sentences, grammar, mechanics, vocabulary and word parts. Every lesson ends in his own sentence about a text from the F or C jobs. | `src/CoreDataG*.html` |
| **C68 · Comprehension Gr 6–8** | Understanding what you read, Grades 6–8. | As above, Grades 6–8, with close reading and longer works. | `src/CoreDataC68*.html` |
| **W13 · Writing K–3** | Real writing, K–3. | Transcription, sentences, first paragraphs, SRSD stories and opinions, mentor texts. | `src/CoreDataW13*.html` |
| **S · Science and Social Studies** | Kept, after the core ladders for a band exist. | Units built on reading-rich topic sets, which double as information reading, plus one real 3D model or hands-on task and one short write per unit. | `src/CoreDataS*.html` |
| **V · Verifier** (takes no building job) | The independent checker. | Reviews every job's lesson PRs: scores lessons on the 9 points against their full check range, plays them as a boy, checks evenness and excitement across jobs and grades, and posts findings in `docs/core-growth/REVIEWS.md` and on the PRs. Never reviews its own work. | `docs/core-growth/REVIEWS.md` |

**Second accounts on the same job** take a piece from the **Helpers wanted** list. They never edit the same data file at the same time as the owner: a helper's file is `src/CoreData<Job>H<n>.html`.

## 8. Working rules (all jobs)

- **One topic per branch** (`claude/core-<job>-<topic>`) and per PR. **Small PRs:** 15–25 lessons, or one tool. Commit and push often.
- Run `node tests/run.js` before every PR; it must pass. Add `PLAY=<your id prefix>` to play your own lessons to the end. Use `node tools/audit/ob-quick.js` and `IDS=… node tools/audit/ob-qa.js`.
- **Auto-publish:** a PR that passes the tests goes live by itself in about 15 minutes. You are the reviewer, so test it as if the boys see it today. To keep a PR from going live, add the label `hold`. Never deploy by hand. Never use clasp.
- **Buttons (HoS 2026-11-23, binding):** every boy-facing button and piece of information comes from the button system, `src/UiKit.html` (`window.TLK`), with the rules in `docs/BUTTON-SYSTEM.md`. Never draw your own buttons or restyle the kit. New activity kinds and the Reader use the kit too.
- **Every PR description follows the template and has:**
  - the HoS's request line and your check against it;
  - what was added (lessons, texts, minutes) and the ledger's running total vs target;
  - ways of learning used;
  - the reviewer score table (all 4–5);
  - pictures at 1366×768 and 390 px;
  - what the boy sees, in plain words.
- **After it is live:** check it live. Add a CHANGE note in the Drive HQ LOG (folder `1NOL4XyWQgf5wm60gGNbmVG6ujY6RBIGS`). Send the HoS one plain line: what went live and how many hours a boy gained.
- **When a job is finished:** set its row to `DONE` with a one-line summary.
- **Never:**
  - real student names, codes or data in the repo, tests, pictures, issues or chat;
  - asking anyone for a password or 2-step code;
  - touching `MATH.*`, `v2/`, Kodesh files, or another job's files;
  - new money rewards;
  - recording boys' voices;
  - the word "bite" on a boy's screen;
  - the Divine Name.

## 9. Finish line

A boy in any grade signs in and has **half a year of new, real learning** in reading, comprehension, grammar and writing, built as small steps, with Science and Social Studies alongside. He skips what he knows, reads real stories and books at his level, writes real pieces a teacher reads, and is excited to keep going: rich worlds, characters he follows, things that snap and pop when he gets them right. No screen wastes his time, and every grade is as strong as every other.
