# Job W48 · Writing, Grades 4–8: the skill map (2026-11-24)

Owner: job W48 (see `docs/CORE-GROWTH-LANES.md`). Binding rules: `CLAUDE.md`, `docs/CORE-GROWTH-PROMPT.md`, `docs/ONE-BITE-PLAYBOOK.md`. CLAUDE.md wins where they differ.

**The HoS's words (2026-11-24):** "Beef up all their lessons to contain about a half a year's worth of work … the variety of different ways to learn based on proven research … no downtime and fluff and boringness … we want to keep it exciting."

**My one-line check for every W48 PR:** *Does a boy in Grades 4–8 now have more real, new writing to learn and do, at an even high quality, that is exciting to do and has no filler?*

## 1. In one page (for the Head of School)

- **Today:** a boy in Grades 4–8 has **19 writing lessons in all** (about 4 per grade). Each one ends with "write a paragraph", and any typing counts as right. That is **under 1 hour** of writing per grade.
- **After W48:** each grade gets about **21 hours** of real writing for the half year:
  - **20–31 short skill lessons** per grade (8–9 minutes each), every one hands-on, with a worked example, Mistake Detective and a tap-kind check;
  - **10–12 real writing pieces** per grade (plan → draft → fix → publish), which a teacher reads and scores in the writing inbox. A piece is **never** "right" just because he typed;
  - a **unit check** ("boss level") after each unit, and a **test-out** before it, so he skips what he already knows;
  - **short daily writes** (2–5 sentences about the day's reading).
- **What makes it exciting:** the boys write **for a real place**.
  - Grades 4–5 run the **Rosewood Gazette**, a kids' neighborhood newspaper. Every unit fills a page: the how-to column, the opinion column, "Our Stories", the science page, book reviews, letters.
  - Grades 6–8 are the **Rosewood Town Hall** student council. They argue for real projects, research them, write letters and emails to officials, and give speeches.
  - His finished pieces go into **"My book"** with a picture, which his parents see.
- **Proven methods:** the memory strategies with the strongest research for children's writing (SRSD: POW + TREE, WWW, TIDE, STOP & DARE), studying a short model first, sentence combining, and plan → draft → revise as separate steps (Graham & Perin 2007; Graham & Harris).
- **Order of building:** Unit 1 of every grade first (Grades 4–8), then Unit 2, and so on.
- **What I need from job T first:** the "how to add a skill" tool (in review, #288) for the skill lessons, and the **Writing Workshop and teacher inbox** for the pieces. Until then I write the lessons on my branch.

## 2. What W48 owns, and where the lines are

| W48 owns | Not W48 |
|---|---|
| `WRIT.*` skills at levels **L05–L09** (Grades 4–8): paragraphs, essays, stories, research, real-world writing, and sentence craft *for writing* (`WRIT.SENT`) | `LANG.*` (grammar, mechanics, usage, vocabulary): **job G**. A W48 lesson may *use* a grammar idea (a comma after "However,"), but never teaches the grammar term itself. |
| The **writing pieces** for Grades 4–8 (their prompts, mentor texts, checklists and teacher rubrics) | The **Writing Workshop screens** and **teacher inbox** themselves: **job T** |
| The **daily-write prompts** for Grades 4–8 (2–5 sentences about the day's text) | The **texts** they are about: jobs **C45** and **C68** (listed in "Shared texts") |
| `src/CoreDataW48<n>.html`, `src/CoreDataW48.js` (skill list), `docs/core-growth/W48-*.md` | Grades K–3 writing: **job W13**. `WRIT.PARA.L04.01` (Grade 3) stays with W13. |

**Existing lessons:** the 19 `WRIT.*` lessons at L05–L09 are **reused and upgraded** (section 6). Each is upgraded in its own file, not copied into mine. Open PR **#180** (on `hold`) already has hands-on activities for the 5 Grade 4 lessons (`WRIT.PARA.L05.01`–`.05`); I start from that work and bring it up to this standard rather than redo it.

## 3. How a writing unit works

Every unit has the same 6 parts, so the boy always knows where he is. The *inside* of each part changes from unit to unit.

| Part | What the boy does | Minutes (Gr 4–5 / 6–8) |
|---|---|---|
| **Unit opener** | A full scene of the unit's world (the Gazette newsroom, the Town Hall), the assignment from a character ("The Gazette needs an opinion column by Friday!"), and the one memory strategy for this unit. | 3 / 3 |
| **Test-out** | 4–6 tap questions. A skill he shows is marked "shown" and skipped. | 3 / 3 |
| **Mentor text** | A short, strong model of the kind of writing (150–600 words, written for Tashbar). He taps its parts: "Tap the reason", "Tap the hook". It is a teaching text, and its parts are never re-asked in a check. | inside the first lesson |
| **Skill lessons (4–6)** | One Bite shape: Today we learn → Watch me → Mistake Detective → Do it with me → Your turn → Show me → Level clear. | 8 / 9 each |
| **Quick piece** (mid-unit) | A short piece (1–2 paragraphs) through all four Workshop steps in one or two sittings. | 40 / 45 |
| **Unit piece** (end) | The real thing for the Gazette or Town Hall: plan → draft → fix (with a checklist he must meet) → publish into "My book". Teacher scores it with the unit rubric. | 80 / 100 |
| **Unit check ("boss level")** | 8–12 tap questions: every skill in the unit plus 2–3 from earlier units. Pass opens the next unit; a miss sends him to the exact skill. | 8 / 8 |

**How a skill lesson stays checkable.** Writing *skills* are checked by taps, never by typing: pick the sentence that is a claim, tap the detail that does not belong, put the paragraph in order, combine two sentences with tiles, tap the evidence that proves it, choose the better hook and tap the reason. Typed writing goes only to the Workshop, where a teacher reads it.

**Ending in his own writing.** Every skill lesson's Level clear offers **"Use it now"**: one or two sentences in his writing notebook using today's skill on his current piece or the day's text. It is saved to his notebook and the teacher can see it. It is never marked right or wrong and never pays.

### The Writing Workshop steps (built by job T; W48 supplies the content)
1. **Plan:** the unit's organizer (TREE, WWW, TIDE, STOP & DARE, compare chart, research notes), filled in by tapping and short typing.
2. **Draft:** his plan sits beside the writing box, one part at a time.
3. **Fix:** revise, then edit, with a checklist he must meet. Each checklist line is a tap task he does *on his own draft* ("Tap your claim", "Tap each reason", "Tap the sentence where you answer the other side"). A line he cannot tap is a line he still needs to write.
4. **Publish:** clean copy plus a picture into "My book"; it goes to the teacher inbox with the unit rubric (4 rows, 1–4 points: Ideas and focus, Organization, Evidence or detail, Conventions).

## 4. Ways of learning used (research)

Each unit uses at least 4 of these, and no two lessons in a row have the same shape.

| Way | How W48 uses it | Research |
|---|---|---|
| **SRSD memory strategies** | One strategy per genre, taught in 6 stages: discuss it, model it (think-aloud), memorize it (tap the letters in order), guided use, own use, and goal-setting. | Graham & Harris (SRSD); Graham & Perin 2007, *Writing Next* (strategy instruction, effect size 0.82) |
| **Mentor texts** | Study a short model, tap its parts, then write the same kind. | *Writing Next* ("study of models"); Graham et al. 2012 (IES practice guide) |
| **Worked example, then fading** | Watch me shows one paragraph being built, one move per tap; Do it with me leaves gaps; Your turn is his. | Sweller; Renkl & Atkinson |
| **Sentence combining** | Two or three short sentences snap into one strong one with tiles. | *Writing Next* (sentence combining); Saddler & Graham 2005 |
| **because / but / so, and appositives** | Expand a bare claim three ways; add who-or-what detail. | Hochman & Wexler, *The Writing Revolution* |
| **Specific product goals** | Every piece has a checklist with concrete goals ("2 reasons, each with an example"). | *Writing Next* (product goals) |
| **Mistake work** | Mistake Detective: the real error boys make (a fact used as a claim, a quote with no explanation, a story with no problem). | Durkin & Rittle-Johnson 2012 |
| **Tap the reason (Gr 4–5)** / **Teach it back (Gr 6–8)** | After a right answer he taps why it is right; in Grades 6–8 he explains the strategy to a chavrusa or to the screen character. | Chi (self-explanation); Dunlosky 2013 |
| **Writing to read** | Daily writes and responses about the C45/C68 texts, so writing and reading lift each other. | Graham & Hebert 2010, *Writing to Read* |
| **Collaborative writing** | Chavrusa prompts at plan and fix steps ("Read your claim to your chavrusa. Can he argue against it?"). | *Writing Next* (collaborative writing) |
| **Inquiry and research** | Short research pieces from the S and C topic sets, with notes, sources and a teacher check. | *Writing Next* (inquiry) |
| **Retrieval and spacing** | Unit checks mix old skills; finished lessons come back as warm-ups. | Roediger & Karpicke 2006; Cepeda et al. 2006 |
| **Mastery and test-out** | Skip what he shows; a miss sends him to the exact skill. | Bloom 1984 |

**What is new for the boy, age by age:** Grades 4–5 (E45) build with tiles, sort, and "tap the reason"; Grades 6–8 (M68) get fewer cartoons and real-world art, debate (argue both sides), close looks at a mentor paragraph, teach it back, and writing for real readers (a city official, a camp director, a high school).

## 5. The casts (proposed for the bands; C45 and C68 may adopt or replace)

Jobs in the same band share one cast. No cast is written yet, so I propose these. **If C45 or C68 writes its band's cast first, theirs wins and I use it.** The Casts table in the lanes file points here.

### E45 (Grades 4–5): the Rosewood Gazette
Four friends in the fourth and fifth grade on Rosewood Avenue start a kids' newspaper. Every writing unit fills a page of the next issue.
- **Akiva Feldman** (Gr 5), editor. Asks "but why?" about everything; loves science.
- **Yehuda Tawil** (Gr 4), the storyteller. His family is Syrian; his **Saba Eli** tells stories of growing up in Aleppo and Brooklyn.
- **Naftali Brenner** (Gr 5), careful and organized; builds things and writes the how-to column.
- **Rafael Hakimi** (Gr 4), new on the block (his family is Persian); takes the photos and is learning to write in English with confidence.
- **Families and neighbors:** the Feldmans (Tatty bakes challah for the shul kiddush, Mommy, little sister **Chani**, **Bubby Rus**), **Rabbi Golan** (their rebbe, reads every issue), **Mr. Davidson** at the hardware store (buys an ad), the **Ohr Chaim** shul.
- **Recurring threads:** the Gazette's deadline every Friday before Shabbos; the empty lot the boys want turned into a garden; a mystery about who keeps leaving the shul's lost-and-found box tidy.

### M68 (Grades 6–8): the Rosewood Town Hall
The yeshiva's middle-school student council, which meets on Tuesdays in the library. They argue for real projects, research them and write to real readers.
- **Ari Rosen** (Gr 8), council head. Confident, sometimes too fast to decide; learns to listen to the other side.
- **Dovid Mizrahi** (Gr 7), the speechwriter. Thoughtful, quotes his grandfather; plays chess.
- **Binyamin "Benny" Katz** (Gr 7), the researcher. Loves numbers, charts and checking sources.
- **Shalom Abergel** (Gr 6), practical and sporty; asks "but will it actually work?"
- **Yisroel Meir Gold** (Gr 6), the newest member, quiet at first, the best storyteller of them all.
- **Adults:** **Rabbi Stern** (the menahel), **Mr. Levinson** (English teacher and council adviser), **Councilwoman Reyes** (the city official the boys write to), the boys' families at the Shabbos table.
- **Recurring threads:** the council's big project for the year (a gemach for sports equipment and a bus-stop shelter), a debate tournament against another yeshiva, and the eighth-graders' high-school applications.

Both casts follow Family Life (HoS 2026-11-15): modest, warm, normal frum family life; a wide mix of names; kosher food; Shabbos and Yom Tov. Never the Divine Name.

## 6. The existing lessons (reused, upgraded)

None of the 19 passes the standard today: 17 have no hands-on activities (only round-1 data) and each ends in a typed "write" check that any text passes. `WRIT.PARA.L05.01` was scored **FAIL** in the 2026-11-22 audit (points 3, 4, 6, 7 at 2); `WRIT.ESSAY.L07.02` scored 2s in the teaching audit. Each is upgraded in place (its own file) to the One Bite shape with `do`/`your`, a tap-only check, and a slot in a unit below.

| Id | Grade | Name today | Unit below | Upgrade |
|---|---|---|---|---|
| `WRIT.PARA.L05.01` | 4 | Paragraph with transition words | G4 U1 | from #180; fix the audit's p3/p4/p7 |
| `WRIT.PARA.L05.02` | 4 | Step-by-step how-to paragraph | G4 U1 | from #180 |
| `WRIT.PARA.L05.03` | 4 | Story with Dialogue | G4 U3 | from #180 |
| `WRIT.PARA.L05.04` | 4 | Opinion Paragraph | G4 U2 | from #180; becomes "TREE paragraph" |
| `WRIT.PARA.L05.05` | 4 | Fix It Up | G4 U6 | from #180; becomes ARMS revising |
| `WRIT.ESSAY.L06.01` | 5 | Three-Part Piece | G5 U1 | full rework |
| `WRIT.PARA.L06.01` | 5 | Summary paragraph | G5 U4 | full rework |
| `WRIT.PARA.L06.02` | 5 | Letter Writer | G5 U2 | becomes "letter to the editor" |
| `WRIT.ESSAY.L07.01` | 6 | State a claim with reasons | G6 U1 | full rework |
| `WRIT.ESSAY.L07.02` | 6 | Quote evidence and explain it | G6 U2 | full rework |
| `WRIT.ESSAY.L07.03` | 6 | Show, Don't Tell | G6 U4 | full rework |
| `WRIT.SENT.L07.01` | 6 | Vary It | G6 U4 | full rework (sentence craft for stories) |
| `WRIT.ESSAY.L08.01` | 7 | Five-Paragraph Argument | G7 U1 | full rework |
| `WRIT.ESSAY.L08.02` | 7 | Answer a counterclaim | G7 U1 | full rework |
| `WRIT.ESSAY.L08.03` | 7 | Explain It All | G7 U2 | full rework |
| `WRIT.ESSAY.L09.01` | 8 | Business writing | G8 U5 | full rework |
| `WRIT.RES.L09.01` | 8 | Find and judge sources | G8 U3 | full rework |
| `WRIT.RES.L09.02` | 8 | Paraphrase and cite | G8 U3 | full rework |
| `WRIT.RES.L09.03` | 8 | Short research report | G8 U3 | full rework |

## 7. The map, grade by grade

**How to read it.** Each row is one small skill = one lesson. **Ids** for new skills are planned from the next free number and are confirmed with `node tools/core/add-skill.js next <prefix>` when I build them. ★ = an existing lesson (section 6). **Std** = Common Core Writing (W) or Language (L) code. **Kinds** = the main hands-on activities (One Bite kit and job T's new kinds: *combine* = sentence combiner, *evidence* = tap the sentence that proves it, *cloze* = fill the gap, *order* = put it in order, *map* = story map / organizer).

Every lesson also has: Watch me (a think-aloud on the mentor text), a Mistake Detective, "tap the reason" (Gr 4–5) or "teach it back" (Gr 6–8), and a 3-question tap check that asks only what was taught, on a *different* example than the one taught (a "cold" check).

---

### Grade 4 (level L05, E45) · Rosewood Gazette, Issue 1 · 6 units, 31 lessons, 12 pieces

**G4 U1 · Paragraph Power** (the "All About Our Block" page). Strategy: *a paragraph is a hamburger: top bun, fillings, bottom bun*.
| # | Id | Skill (what he can do) | Std | Kinds |
|---|---|---|---|---|
| 1 | `WRIT.PARA.L05.06` | Write a topic sentence that names the main idea | W.4.2a | sort (topic sentence or detail), tiles (build one), findall |
| 2 | `WRIT.PARA.L05.07` | Keep only details that belong (cut the stray one) | W.4.2b, W.4.4 | findall (the stray), sort, match |
| 3 | ★ `WRIT.PARA.L05.01` | Link details with road signs (first, next, however, as a result) | W.4.2c | sort (order / change / result), cloze, tiles |
| 4 | ★ `WRIT.PARA.L05.02` | Write a step-by-step how-to paragraph | W.4.2, W.4.4 | order, cloze, findall (missing step) |
| 5 | `WRIT.PARA.L05.08` | End with a closing sentence that wraps it up | W.4.2e | match (paragraph to closing), sort (closes / starts new), tiles |
Quick piece: **How-to column** ("How to braid a challah", "How to set up for Shabbos guests"), 1 paragraph. Unit piece: **All about…** information paragraph (topic from the C45 topic set), 1–2 paragraphs.

**G4 U2 · Opinion with POW + TREE** (the opinion column). Strategy: **POW** (Pick my idea, Organize my notes, Write and say more) + **TREE** (Topic sentence, Reasons 3, Explain each, Ending).
| # | Id | Skill | Std | Kinds |
|---|---|---|---|---|
| 1 | `WRIT.ESSAY.L05.01` | Tell an opinion from a fact | W.4.1a | sort (fact / opinion), findall, match |
| 2 | `WRIT.ESSAY.L05.02` | Memorize POW + TREE and use it to plan | W.4.1, W.4.5 | order (the letters), map (TREE organizer), match |
| 3 | `WRIT.ESSAY.L05.03` | Give reasons with "because" and explain each with an example | W.4.1b | tiles (because-chain), match (reason to example), findall (not-a-reason) |
| 4 | `WRIT.ESSAY.L05.04` | Link opinion and reasons (for instance, in addition, in order to) | W.4.1c | cloze, sort, tiles |
| 5 | ★ `WRIT.PARA.L05.04` | Write a TREE opinion paragraph | W.4.1 | order (TREE parts), findall (missing part), sort |
| 6 | `WRIT.ESSAY.L05.05` | End by saying the opinion again in a new way | W.4.1d | match, sort (new way / copied), tiles |
Quick piece: **Opinion paragraph** ("The best Motzei Shabbos activity"). Unit piece: **Opinion column**, 3 paragraphs ("Our block needs a garden in the empty lot").

**G4 U3 · Story Builders** ("Our Stories" page). Strategy: **WWW, What = 2, How = 2** (Who, When, Where; What does he want, What happens; How does it end, How does he feel).
| # | Id | Skill | Std | Kinds |
|---|---|---|---|---|
| 1 | `WRIT.PARA.L05.09` | Plan a story with WWW What=2 How=2 | W.4.3, W.4.5 | order, map (story map), match |
| 2 | `WRIT.PARA.L05.10` | Start strong: who, where and when, and a problem | W.4.3a | sort (strong / weak start), tiles, findall |
| 3 | ★ `WRIT.PARA.L05.03` | Use dialogue to move the story (with correct marks) | W.4.3b, L.4.2b | tiles (build the line), findall (mark errors), sort |
| 4 | `WRIT.PARA.L05.11` | Show feelings with actions and senses | W.4.3b, W.4.3d | sort (show / tell), match (feeling to action), cloze |
| 5 | `WRIT.PARA.L05.12` | Move through time with time words | W.4.3c | order, cloze, findall |
| 6 | `WRIT.PARA.L05.13` | End so it feels finished | W.4.3e | match (story to ending), sort, tiles |
Quick piece: **A small moment** (one scene, slowed down). Unit piece: **True story** for "Our Stories" (3 paragraphs).

**G4 U4 · Teach It with TIDE** (the science page). Strategy: **TIDE** (Topic, Important evidence, Detail, Ending).
| # | Id | Skill | Std | Kinds |
|---|---|---|---|---|
| 1 | `WRIT.ESSAY.L05.06` | Memorize TIDE and plan a teaching piece | W.4.2, W.4.5 | order, map (TIDE organizer), match |
| 2 | `WRIT.ESSAY.L05.07` | Group facts into sections with headings | W.4.2a | sort (facts into headings), match, findall |
| 3 | `WRIT.ESSAY.L05.08` | Teach with facts, definitions and examples | W.4.2b | match (word to kid-friendly definition), sort, cloze |
| 4 | `WRIT.ESSAY.L05.09` | Use exact words, not "stuff" and "things" | W.4.2d | findall (vague words), tiles (swap), match |
| 5 | `WRIT.ESSAY.L05.10` | Add a picture with a caption that teaches | W.4.2a | match (picture to caption), sort (teaches / decorates), order |
Quick piece: **Fact box** (one section with a heading and a captioned picture). Unit piece: **Science page report**, 3 sections with headings, from the C45 or S topic set.

**G4 U5 · Answer with Evidence** (book reviews). Strategy: **RACE** (Restate, Answer, Cite, Explain).
| # | Id | Skill | Std | Kinds |
|---|---|---|---|---|
| 1 | `WRIT.ESSAY.L05.11` | Turn the question into my first sentence | W.4.9 | tiles, match, sort (restates / does not) |
| 2 | `WRIT.ESSAY.L05.12` | Pick the evidence that proves my answer | W.4.9, RL.4.1 | evidence, findall, sort |
| 3 | `WRIT.ESSAY.L05.13` | Quote it or say it in my own words | W.4.8, L.4.2b | sort (quote / own words), tiles, findall (copied) |
| 4 | `WRIT.ESSAY.L05.14` | Explain how the evidence proves it | W.4.9 | match (evidence to explanation), cloze ("This shows…"), sort |
Quick piece: **One RACE paragraph** about a C45 story. Unit piece: **Book review** for the Gazette (2–3 paragraphs: my opinion of the book, with evidence).

**G4 U6 · Little Researchers** (the "Did You Know?" page).
| # | Id | Skill | Std | Kinds |
|---|---|---|---|---|
| 1 | `WRIT.RES.L05.01` | Ask a research question I can answer | W.4.7 | sort (good / too big / yes-no), tiles, match |
| 2 | `WRIT.RES.L05.02` | Take notes in my own words, not copying | W.4.8 | sort (note / copy), match (sentence to note), findall |
| 3 | `WRIT.RES.L05.03` | Sort my notes into groups and list my sources | W.4.8 | sort, order, match (fact to source) |
| 4 | ★ `WRIT.PARA.L05.05` | Revise with ARMS (Add, Remove, Move, Substitute) | W.4.5 | findall, tiles (move), sort (A/R/M/S) |
| 5 | `WRIT.PARA.L05.14` | Edit with CUPS (Capitals, Usage, Punctuation, Spelling) | W.4.5, L.4.2 | findall (errors), sort, tiles |
Quick piece: **Note cards + source list** on his question. Unit piece: **"Did You Know?" research report**, 3 paragraphs plus sources.

---

### Grade 5 (level L06, E45) · Rosewood Gazette, Issue 2 · 6 units, 30 lessons, 12 pieces

**G5 U1 · Build for the Reader** (the front page).
| # | Id | Skill | Std | Kinds |
|---|---|---|---|---|
| 1 | ★ `WRIT.ESSAY.L06.01` | Build a piece: introduction, body, conclusion | W.5.2a | order, sort, findall |
| 2 | `WRIT.ESSAY.L06.02` | Open with a hook (a question, a surprising fact, a scene) | W.5.2a | sort (hook kinds), match, tiles |
| 3 | `WRIT.PARA.L06.03` | One main idea per paragraph: where to start a new one | W.5.2a, W.5.4 | findall (the break), sort, order |
| 4 | `WRIT.ESSAY.L06.03` | Put sections in a logical order | W.5.2a | order, match, sort (time / importance / problem-solution) |
| 5 | `WRIT.ESSAY.L06.04` | End with a conclusion that adds a "so what" | W.5.2e | match, sort, tiles |
Quick piece: **Rewrite a dull opening** three ways. Unit piece: **Front-page article**, 4 paragraphs.

**G5 U2 · Opinion, Stronger** (the opinion page). Strategy: POW + TREE again, now with ordered reasons.
| # | Id | Skill | Std | Kinds |
|---|---|---|---|---|
| 1 | `WRIT.ESSAY.L06.05` | Order reasons: strongest last | W.5.1b | order, sort, tap the reason |
| 2 | `WRIT.ESSAY.L06.06` | Back reasons with facts and details | W.5.1b | match, evidence, findall (not support) |
| 3 | `WRIT.ESSAY.L06.07` | Link ideas: consequently, specifically, as a result | W.5.1c | cloze, sort, tiles |
| 4 | ★ `WRIT.PARA.L06.02` | Write a letter to the editor (letter form, polite and clear) | W.5.1, W.5.4 | order (letter parts), findall, sort (polite / rude) |
| 5 | `WRIT.ESSAY.L06.08` | Finish with a conclusion tied to the opinion | W.5.1d | match, sort, tiles |
Quick piece: **Letter to the editor**. Unit piece: **Opinion essay**, 4–5 paragraphs.

**G5 U3 · Storytellers** (the fiction page; the cast's own story).
| # | Id | Skill | Std | Kinds |
|---|---|---|---|---|
| 1 | `WRIT.PARA.L06.04` | Choose a narrator and stay with him (I or he) | W.5.3a | findall (slips), sort, tiles |
| 2 | `WRIT.PARA.L06.05` | Pace it: slow down the big moment, speed through the rest | W.5.3b | sort (slow / fast), order, match |
| 3 | `WRIT.PARA.L06.06` | Mix dialogue, description and reaction | W.5.3b | sort, tiles, cloze |
| 4 | `WRIT.PARA.L06.07` | Manage the order of events with transitions | W.5.3c | order, cloze, findall |
| 5 | `WRIT.PARA.L06.08` | Pick exact words and sense details | W.5.3d | findall, tiles (swap), match |
| 6 | `WRIT.PARA.L06.09` | End with what the character learned | W.5.3e | match, sort, tiles |
Quick piece: **Slow-motion moment**. Unit piece: **Short story** with the Gazette crew (4–5 paragraphs).

**G5 U4 · Compare It** (the "Which is better?" page).
| # | Id | Skill | Std | Kinds |
|---|---|---|---|---|
| 1 | ★ `WRIT.PARA.L06.01` | Write a summary paragraph (main idea + key details, no opinions) | W.5.8 | findall (not in summary), order, sort |
| 2 | `WRIT.ESSAY.L06.09` | Plan a compare-and-contrast piece (Venn to outline) | W.5.2a | map (Venn), sort (alike / different), order |
| 3 | `WRIT.ESSAY.L06.10` | Choose block or point-by-point order | W.5.2a | sort, order, match |
| 4 | `WRIT.ESSAY.L06.11` | Link with in contrast, similarly, especially | W.5.2c | cloze, sort, tiles |
| 5 | `WRIT.ESSAY.L06.12` | Use facts from two texts and say which text | W.5.9b | evidence, match (fact to text), sort |
Quick piece: **Summary** of one C45 text. Unit piece: **Compare-and-contrast article** from two texts in a C45 topic set.

**G5 U5 · Respond to Literature** (book corner).
| # | Id | Skill | Std | Kinds |
|---|---|---|---|---|
| 1 | `WRIT.ESSAY.L06.13` | Write a claim about a character or a theme | W.5.9a | sort (claim / retell), tiles, match |
| 2 | `WRIT.ESSAY.L06.14` | Find evidence from two places in the story | W.5.9a | evidence, findall, order |
| 3 | `WRIT.ESSAY.L06.15` | Explain it: "This shows … because …" | W.5.9a | cloze, match, sort (explains / repeats) |
| 4 | `WRIT.ESSAY.L06.16` | Compare two characters in writing | W.5.9a, RL.5.3 | map, sort, tiles |
Quick piece: **RACE paragraph** on a theme. Unit piece: **Literary essay**, 3–4 paragraphs.

**G5 U6 · Research from Several Sources** (the special report).
| # | Id | Skill | Std | Kinds |
|---|---|---|---|---|
| 1 | `WRIT.RES.L06.01` | Ask a question and smaller questions under it | W.5.7 | sort, order, tiles |
| 2 | `WRIT.RES.L06.02` | Skim to find the sources that help | W.5.7, W.5.8 | sort (helps / does not), findall, match |
| 3 | `WRIT.RES.L06.03` | Paraphrase, don't copy (and when to quote) | W.5.8 | sort (paraphrase / plagiarism), match, tiles |
| 4 | `WRIT.RES.L06.04` | Make a source list | W.5.8 | order (parts of an entry), findall (missing part), match |
| 5 | `WRIT.ESSAY.L06.17` | Add a chart or diagram that teaches | W.5.2a | match (data to chart), sort, findall |
Quick piece: **Notes from two sources**. Unit piece: **Special report** with sources and a diagram (4 paragraphs).

---

### Grade 6 (level L07, M68) · Town Hall, Year 1 · 5 units, 22 lessons, 10 pieces

**G6 U1 · Make Your Case** (the council's first proposal). Strategy: **STOP & DARE** (Suspend judgment, Take a side, Organize ideas, Plan more as you write; Develop your topic sentence, Add supporting ideas, Reject an argument for the other side, End with a conclusion).
| # | Id | Skill | Std | Kinds |
|---|---|---|---|---|
| 1 | ★ `WRIT.ESSAY.L07.01` | State a claim people could argue about | W.6.1a | sort (claim / fact / topic), tiles, findall |
| 2 | `WRIT.ESSAY.L07.04` | Plan with STOP & DARE: list both sides first | W.6.1, W.6.5 | map (two-column), order, sort |
| 3 | `WRIT.ESSAY.L07.05` | Give clear reasons with relevant evidence | W.6.1b | match, evidence, findall (irrelevant) |
| 4 | `WRIT.ESSAY.L07.06` | Sound formal, not chatty | W.6.1d | sort (formal / chatty), tiles (rewrite), findall |
| 5 | `WRIT.ESSAY.L07.07` | End with a conclusion that follows from the argument | W.6.1e | match, sort, teach it back |
Quick piece: **Claim + reasons paragraph**. Unit piece: **Proposal argument** to Rabbi Stern, 5 paragraphs.

**G6 U2 · Evidence That Convinces** (the council researches its proposal).
| # | Id | Skill | Std | Kinds |
|---|---|---|---|---|
| 1 | ★ `WRIT.ESSAY.L07.02` | Quote evidence and explain it | W.6.1b, W.6.9 | evidence, tiles (lead-in + quote), match |
| 2 | `WRIT.RES.L07.01` | Judge a source: is it believable? | W.6.8 | sort (credible / not), findall (warning signs), tap reason |
| 3 | `WRIT.RES.L07.02` | Paraphrase without copying | W.6.8 | sort, match, tiles |
| 4 | `WRIT.ESSAY.L07.08` | Write a claim-evidence-reasoning paragraph | W.6.1b, W.6.9b | order (C-E-R), findall (missing R), map |
Quick piece: **CER paragraph**. Unit piece: **Evidence-based response** to a C68 article (3–4 paragraphs).

**G6 U3 · Explain It Clearly** (the council's report to parents).
| # | Id | Skill | Std | Kinds |
|---|---|---|---|---|
| 1 | `WRIT.ESSAY.L07.09` | Choose a structure: definition, classify, compare, cause-effect | W.6.2a | match (topic to structure), sort, order |
| 2 | `WRIT.ESSAY.L07.10` | Write a cause-and-effect paragraph | W.6.2a, W.6.2c | order, match (cause to effect), cloze |
| 3 | `WRIT.ESSAY.L07.11` | Use headings, a chart or a diagram | W.6.2a | match, sort (helps / clutters), findall |
| 4 | `WRIT.ESSAY.L07.12` | Use exact subject words and define them | W.6.2d | match, cloze, findall |
Quick piece: **Cause-and-effect paragraph**. Unit piece: **Explanatory article** with a chart (4–5 paragraphs, from the S topic set).

**G6 U4 · Tell It Well** (Yisroel Meir's story contest).
| # | Id | Skill | Std | Kinds |
|---|---|---|---|---|
| 1 | ★ `WRIT.ESSAY.L07.03` | Show, don't tell | W.6.3d | sort (show / tell), tiles, match |
| 2 | `WRIT.PARA.L07.01` | Choose a point of view and a narrator | W.6.3a | sort, findall (slips), match |
| 3 | `WRIT.PARA.L07.02` | Signal shifts in time and place | W.6.3c | order, cloze, findall |
| 4 | ★ `WRIT.SENT.L07.01` | Vary sentences for rhythm | W.6.3, L.6.3a | combine, sort (short / long effect), tiles |
| 5 | `WRIT.PARA.L07.03` | End with reflection | W.6.3e | match, sort, teach it back |
Quick piece: **Scene rewrite** (tell → show). Unit piece: **Short story** for the contest (600–800 words).

**G6 U5 · First Research Project** (the bus-stop shelter).
| # | Id | Skill | Std | Kinds |
|---|---|---|---|---|
| 1 | `WRIT.RES.L07.03` | Narrow a topic into a question | W.6.7 | sort (too big / just right), order, tiles |
| 2 | `WRIT.RES.L07.04` | Choose search words | W.6.8 | match, sort, findall |
| 3 | `WRIT.RES.L07.05` | Take notes and keep track of sources | W.6.8 | sort, match (note to source), order |
| 4 | `WRIT.RES.L07.06` | Write a basic bibliography entry | W.6.8 | order (parts), findall (missing), match |
Quick piece: **Annotated source list** (3 sources, one line each). Unit piece: **Short research piece** (4–5 paragraphs, with a bibliography).

---

### Grade 7 (level L08, M68) · Town Hall, Year 2 · 5 units, 22 lessons, 10 pieces

**G7 U1 · Argue Both Sides** (the debate tournament).
| # | Id | Skill | Std | Kinds |
|---|---|---|---|---|
| 1 | ★ `WRIT.ESSAY.L08.01` | Build a five-paragraph argument | W.7.1 | order, map, findall |
| 2 | ★ `WRIT.ESSAY.L08.02` | Acknowledge the other side's claim | W.7.1a | sort (counterclaim / support), match, tiles |
| 3 | `WRIT.ESSAY.L08.04` | Answer it with a rebuttal and evidence | W.7.1b | match, evidence, order |
| 4 | `WRIT.ESSAY.L08.05` | Spot weak reasoning (overgeneralizing, "everyone does it") | W.7.1b | sort (sound / weak), findall, teach it back |
| 5 | `WRIT.ESSAY.L08.06` | Link claims, reasons and evidence clearly | W.7.1c | cloze, sort, combine |
Quick piece: **Counterclaim-and-rebuttal paragraph**. Unit piece: **Argument essay** with a counterclaim (5 paragraphs).

**G7 U2 · Explain It All** (the council's guide for new students).
| # | Id | Skill | Std | Kinds |
|---|---|---|---|---|
| 1 | ★ `WRIT.ESSAY.L08.03` | Explain a topic with a clear thesis and plan | W.7.2a | order, map, sort |
| 2 | `WRIT.ESSAY.L08.07` | Weave quotes into my own sentences | W.7.2b | tiles, sort (smooth / dropped), findall |
| 3 | `WRIT.ESSAY.L08.08` | Use transitions that show how ideas connect | W.7.2c | cloze, sort, combine |
| 4 | `WRIT.ESSAY.L08.09` | Write a conclusion that goes one step further | W.7.2f | match, sort, teach it back |
Quick piece: **Explain a process**. Unit piece: **Explanatory essay** for the new-student guide.

**G7 U3 · Characters Who Live** (the story contest, round 2).
| # | Id | Skill | Std | Kinds |
|---|---|---|---|---|
| 1 | `WRIT.PARA.L08.01` | Build a character: what he wants and what stops him | W.7.3a | map, match, sort |
| 2 | `WRIT.PARA.L08.02` | Let dialogue show who he is | W.7.3b | sort, match (line to trait), findall |
| 3 | `WRIT.PARA.L08.03` | Build suspense and pace the climb | W.7.3b | order, sort, cloze |
| 4 | `WRIT.PARA.L08.04` | Choose words for mood | W.7.3d | findall, sort (mood), tiles |
| 5 | `WRIT.PARA.L08.05` | End with a turn and a reflection | W.7.3e | match, sort, teach it back |
Quick piece: **Dialogue scene**. Unit piece: **Short story** (800–1,000 words).

**G7 U4 · Research That Asks More** (the gemach project).
| # | Id | Skill | Std | Kinds |
|---|---|---|---|---|
| 1 | `WRIT.RES.L08.01` | Ask questions that lead to more questions | W.7.7 | sort, order, tiles |
| 2 | `WRIT.RES.L08.02` | Check a source for accuracy and bias | W.7.8 | sort, findall (slanted words), tap reason |
| 3 | `WRIT.RES.L08.03` | Quote, paraphrase and cite in a standard format | W.7.8 | tiles, order, findall |
| 4 | `WRIT.RES.L08.04` | Put two sources together in one paragraph | W.7.7, W.7.9 | map, combine, order |
Quick piece: **Synthesis paragraph** (two sources). Unit piece: **Research report** (5–6 paragraphs, works cited).

**G7 U5 · Write for Real Readers** (letters, emails and a speech).
| # | Id | Skill | Std | Kinds |
|---|---|---|---|---|
| 1 | `WRIT.ESSAY.L08.10` | Match tone to the reader (friend, teacher, official) | W.7.4 | sort, match, tiles |
| 2 | `WRIT.ESSAY.L08.11` | Write a formal email: subject, greeting, one clear ask | W.7.4 | order, findall, sort |
| 3 | `WRIT.ESSAY.L08.12` | Write a speech that grabs and is remembered | W.7.4, SL.7.4 | sort (hook / repetition / call to action), order, teach it back |
| 4 | `WRIT.ESSAY.L08.13` | Cut wordiness | W.7.5, L.7.3a | findall, combine, tiles |
Quick piece: **Formal email** to Councilwoman Reyes. Unit piece: **Persuasive speech** for Town Hall (read aloud to the family; no recording).

---

### Grade 8 (level L09, M68) · Town Hall, Year 3 · 5 units, 20 lessons, 10 pieces

**G8 U1 · Argument at Full Strength** (the debate final).
| # | Id | Skill | Std | Kinds |
|---|---|---|---|---|
| 1 | `WRIT.ESSAY.L09.02` | Make my claim different from the other claims | W.8.1a | sort, match, tiles |
| 2 | `WRIT.ESSAY.L09.03` | Is the evidence enough? Is it relevant? | W.8.1b | sort (enough / not), evidence, teach it back |
| 3 | `WRIT.ESSAY.L09.04` | Explain the link between evidence and claim (reasoning) | W.8.1b | cloze, match, order |
| 4 | `WRIT.ESSAY.L09.05` | Hold it together: cohesion and formal style | W.8.1c, W.8.1d | combine, cloze, findall |
Quick piece: **Rebuttal paragraph**. Unit piece: **Argument essay** (5–6 paragraphs).

**G8 U2 · Write About a Text** (the yeshiva literary magazine).
| # | Id | Skill | Std | Kinds |
|---|---|---|---|---|
| 1 | `WRIT.ESSAY.L09.06` | Write a thesis about a text | W.8.9a | sort (thesis / summary), tiles, match |
| 2 | `WRIT.ESSAY.L09.07` | Embed a quote and analyze it, not just retell | W.8.9a | sort (analysis / summary), tiles, evidence |
| 3 | `WRIT.ESSAY.L09.08` | Compare how two texts treat one theme | W.8.9a, RL.8.9 | map, sort, teach it back |
Quick piece: **Analysis paragraph**. Unit piece: **Literary analysis essay** (5 paragraphs, from a C68 longer work).

**G8 U3 · The Research Paper** (the council's final report).
| # | Id | Skill | Std | Kinds |
|---|---|---|---|---|
| 1 | `WRIT.RES.L09.04` | Ask my own question and refocus it | W.8.7 | sort, order, tiles |
| 2 | ★ `WRIT.RES.L09.01` | Find and judge sources | W.8.8 | sort, findall, tap reason |
| 3 | ★ `WRIT.RES.L09.02` | Paraphrase and cite | W.8.8 | tiles, sort, order |
| 4 | `WRIT.RES.L09.05` | Synthesize sources and avoid plagiarism | W.8.8 | combine, sort (mine / borrowed), findall |
| 5 | ★ `WRIT.RES.L09.03` | Organize a short research report | W.8.7, W.8.2 | order, map, findall |
Quick piece: **Annotated bibliography**. Unit piece: **Research paper** (6–7 paragraphs, works cited).

**G8 U4 · Memoir** (the graduation book).
| # | Id | Skill | Std | Kinds |
|---|---|---|---|---|
| 1 | `WRIT.PARA.L09.01` | Use a flashback | W.8.3, W.8.3c | order, sort, findall |
| 2 | `WRIT.PARA.L09.02` | Show two places or times side by side | W.8.3c | order, match, cloze |
| 3 | `WRIT.PARA.L09.03` | Reflect: what it means to me now | W.8.3e | sort (reflects / retells), match, teach it back |
| 4 | `WRIT.PARA.L09.04` | Choose words that set the mood | W.8.3d | findall, tiles, sort |
Quick piece: **Flashback scene**. Unit piece: **Memoir** (800–1,200 words) for the graduation book.

**G8 U5 · Writing for the Real World** (high-school applications and the city).
| # | Id | Skill | Std | Kinds |
|---|---|---|---|---|
| 1 | ★ `WRIT.ESSAY.L09.01` | Write a business letter or email | W.8.4 | order, findall, sort |
| 2 | `WRIT.ESSAY.L09.09` | Write an op-ed: hook, claim, proof, call to action | W.8.1, W.8.4 | order, sort, evidence |
| 3 | `WRIT.ESSAY.L09.10` | Write about myself for an application | W.8.3, W.8.4 | sort (specific / vague), tiles, teach it back |
| 4 | `WRIT.ESSAY.L09.11` | Revise for the reader: cut, clarify, check | W.8.5 | findall, combine, sort |
Quick piece: **Business email**. Unit piece: **Op-ed** or **application essay** (his choice; 500–700 words).

## 8. Minutes (the ledger in short; full ledger in `W48-ledger.md`)

| Grade | Skill lessons | Pieces (quick + unit) | Openers, test-outs, unit checks | Daily writes | **Total** |
|---|---|---|---|---|---|
| 4 | 31 × 8 = 248 | 6 × (40 + 80) = 720 | 6 × 14 = 84 | 45 × 5 = 225 | **1,277 min ≈ 21.3 h** |
| 5 | 30 × 8 = 240 | 720 | 84 | 225 | **1,269 min ≈ 21.2 h** |
| 6 | 22 × 9 = 198 | 5 × (45 + 100) = 725 | 5 × 14 = 70 | 225 | **1,218 min ≈ 20.3 h** |
| 7 | 22 × 9 = 198 | 725 | 70 | 225 | **1,218 min ≈ 20.3 h** |
| 8 | 20 × 9 = 180 | 725 | 70 | 225 | **1,200 min = 20.0 h** |

**Writing's share of the 90 core hours:** about **21 hours a grade (23%)**. That leaves about 69 hours a grade for comprehension, fluency and grammar/words (jobs C45, C68, G). I'll put this in the lanes ledger's Writing column as the W48 target; if job V finds the split uneven, it moves.

**Left out on purpose:** no separate handwriting or cursive lessons (W13 ends cursive at Grade 3; Grade 4–8 pieces are typed, as W.4.6–W.8.6 expect); no grammar-term lessons (job G); no "write 5 paragraphs" check questions (writing is scored by the teacher, never by the app).

## 9. Daily writes (2–5 sentences, about the day's text)

A short write on most days, attached to the C45 / C68 text the boy read that day. Each prompt uses a skill he has learned ("Write 3 sentences: your opinion of Saba Eli's choice, with one *because*"). It goes into his notebook, the teacher can see it, and it is never marked right or wrong. I write them once the C45 and C68 texts are listed in "Shared texts": about **45 per grade**.

## 10. Build order and PRs

1. **This PR:** the map, the ledger and the proposed casts (docs only).
2. **Unit 1 of every grade** (Grades 4–8: 5 + 5 + 5 + 5 + 4 = **24 lessons**) in 2 PRs of about 12, once job T's add-skill tool (#288) is live. Each PR has the independent review table and pictures.
3. **Unit 1 pieces** (prompts, mentor texts, checklists, rubrics) once job T's Writing Workshop is live.
4. Then Unit 2 of every grade, and so on to Unit 6.
5. **Picture orders** (`W48-picture-orders.md`): the 28 unit openers and the mentor-text pictures, in batches, once job T's style sheets exist.

## 11. Helpers wanted

Added to the Helpers list in the lanes file. A helper writes in `src/CoreDataW48H<n>.html` and follows this map exactly.

| Piece | Lessons |
|---|---|
| W48 · Grade 7, Units 1–5 (skill lessons) | 22 |
| W48 · Grade 8, Units 1–5 (skill lessons) | 20 |
