# Visual support rules (HoS 2026-11-27, binding on every curriculum builder)

These are the Head of School's rules, in his words, for every lesson, unit and text in 1.0, 2.0, Keser Girls 3.0 and every future app.
Repository notes (how each rule fits this repository) are in the boxes marked **Here**.
Each unit's Visual Support Plan goes in `docs/visual-plans/<unit id>.md` (first one: `docs/visual-plans/S.U08.md`).

## Purpose
Our students often read text that describes something they are expected to picture: where a place is, what order things happened in, how something works. Then they get a question that needs that picture. If they never saw it, they can't answer, even if they understood every word. Our job is to turn words into visuals that students build as they read, so by the end of the lesson they can SEE the answer instead of guessing it.

Example that started this: In the social studies book "The Land at the Center" (`texts/S/S.ANCI6.01.txt`), a boy describes Israel's neighbors and where they are. Then students are asked to "match each neighbor to its direction" (`src/CoreDataS8.html`, SS.GEO.L07.01). With no map, this is very hard. The fix: an interactive map that students fill in step by step as the story goes ("Touch the blue sea." "Now click where Lebanon is."), with a compass rose (N, S, E, W) always visible, so the matching question at the end is easy.

## Rule 1: Read every unit slowly and flag what needs a visual
Go through the text section by section. Do not skim. For every passage, ask: "Would a student need to picture something to understand this, or to answer the questions about it?" If yes, flag it.

| Flag this | Visual |
|---|---|
| Places and directions: countries, cities, rivers, seas, mountains, "north of," "next to," "across from," routes and journeys | Interactive or fill-in map with a compass rose in the corner |
| Order of events: history, a story's plot, someone's life, "first… then… later…" | Timeline students add to as they read |
| Steps in a process: how something is made, grown, built, or how a system works | Numbered step diagram or flowchart |
| Cause and effect: "because," "so," "as a result," "this led to" | Cause-and-effect chain with arrows |
| Comparisons: two places, people, time periods, or things being contrasted | Side-by-side chart or Venn diagram |
| People and relationships: families, tribes, leaders, who is connected to whom | Family tree or relationship web |
| Size, amount, distance, time spans ("300 miles," "40 years," "a million people") | Scale drawing, bar, or comparison to something familiar |
| New or unfamiliar vocabulary and objects (a desert oasis, an ancient tool, a type of building) | Labeled picture next to the word |
| Parts of a whole: a building, the body, a city layout, a map region | Labeled diagram students fill in |
| Abstract ideas: government, trade, climate, borders | A simple concrete picture or model that shows the idea |

## Rule 2: Check the questions against the text
Before building anything, read the end-of-section and end-of-unit questions. For each question, ask: "Can a student answer this ONLY from what they read?" If the answer depends on a picture the student never saw (a map, a sequence, a comparison), that section MUST get a visual. The visual must give students exactly what they need to answer that question.

> **Here:** "the questions" means every question the boy can meet on that text: the lesson's `do` and `your` activities, its `ready` and `oops`, the skill's own question bank in `packs/` (the practice bank and "Show me" check), and the unit check and unit project in `TLCORE.units` (for Social Studies, `src/CoreDataS11.html`).

## Rule 3: Build it along with the reading, not after
- The visual grows as the student reads. Each paragraph or page adds one piece: "Tap the sea." "Click where Lebanon is." "Add this event to the timeline."
- Students DO something (tap, click, drag, color, label). They don't just look.
- Give immediate, gentle feedback: correct answers lock in place; wrong answers get a hint pointing back to the text ("Reread: the boy says Lebanon is to the north. Which way is north on the compass?").
- By the end, the student has built the whole picture themselves.

> **Here:** every tap and every hint is a boy-facing button or piece of information, so it comes from the button system (`src/UiKit.html`, `docs/BUTTON-SYSTEM.md`). Every step still has a kid-friendly "How to do it" box, and spoken lines stay 12 words or fewer (quality gate).

## Rule 4: Always include the "anchors"
- Maps: compass rose (N, S, E, W, and NE/NW/SE/SW if the questions use them) always visible in the corner. Mark the place the story is about clearly ("You are here").
- Timelines: clear start and end, with dates or "before/after" labels.
- Diagrams: numbered steps and arrows showing direction.
- Use the same vocabulary the book and the questions use.

## Rule 5: Check accuracy
- Check every fact in the visual against a reliable source, not only the book. (Example: Lebanon is NORTH of Israel, Syria is NORTHEAST, Jordan is EAST, Egypt is SOUTHWEST.)
- If the book, the questions, and the real facts don't match, do not quietly pick one. Flag it to the curriculum coordinator.

> **Here:** flag it in the unit's plan (section "Accuracy problems") and in a GitHub issue, and tell the HoS in one line. Kodesh history and dates also go to the rebbe who reviews kodesh.

## Rule 6: Keep it simple and student-friendly
- One idea per visual. Don't crowd the screen.
- Large, clear labels and big tap targets (students may use tablets).
- Use color to help (blue = water, etc.), but never ONLY color. Also use labels or patterns.
- Instructions in short, plain sentences at the students' reading level.
- Must work on a phone, tablet, and computer, and also print as a paper version for students without a device.

> **Here:** look at it as a made-up boy at Chromebook size (1366×768) and phone size, and put the pictures in the pull request (CLAUDE.md, "Quality guardrails").

## Rule 7: Getting pictures and artwork
When you need images (outline maps, pictures of places or objects, diagrams), email the HoS's image account. Be specific:
- Which unit and book, and which page or section
- Exactly what image you need (e.g., "blank outline map of Israel and its neighbors, no labels" AND "same map with labels, for the answer key")
- Preferred format: high-resolution PNG or SVG
- What the image is for (what students will do with it)

Always request BOTH a blank version (for students to fill in) and a labeled version (answer key) when relevant.

> **Here:** the address is in the HoS's instructions, not written here because this repository is public. Search `art/CATALOG.md` first and reuse what fits; write the order as a numbered list (example: `docs/core-growth/F-picture-orders.md`); everything that arrives goes into `art/` with a catalog row, and follows `docs/HANDOFF-PICS.md` (CLAUDE.md, "Shared art library"). A plain outline map or diagram may also be drawn in code (SVG); it goes into `art/` the same way. Map labels are not "text inside a picture": the app draws them on top, so the blank and labeled versions come from one drawing.

## Rule 8: What to deliver for each unit
For every unit you review, produce a Visual Support Plan with:
1. Unit name, book, and pages.
2. A list of every flagged section, each with:
   - The text or concept (quote or short summary)
   - Why students need a visual (which question depends on it)
   - The type of visual (map, timeline, diagram, chart, etc.)
   - What the student DOES with it, step by step, tied to the reading
   - The anchors to include (compass, dates, labels)
   - Images needed, and whether they've been requested
3. Any accuracy problems or mismatches between the book and the questions.
4. A priority level: HIGH (a question can't be answered without it), MEDIUM (it strongly helps understanding), LOW (nice to have).

Build HIGH-priority visuals first.

## The test
When you're done, ask: "Could a student who did this activity answer every question at the end without guessing?" If not, the visual support isn't finished.
