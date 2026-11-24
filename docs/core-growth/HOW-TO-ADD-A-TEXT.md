# How to add a long text (the content store)

Job T wrote this note (2026-11-24). It is for every job that writes stories, chapters, articles, poems or plays (F, C23, C45, C68, G, W13, W48, S). CLAUDE.md wins where they differ.

**Why a store?** Every Chromebook already downloads about 40 MB when it starts. Long texts would make that worse. So a text lives in its own file and is loaded **only when a boy opens it**.

## 1. Write the text
Make `texts/<JOB>/<ID>.txt`. The file name is the id, and the id starts with your job letters, for example `texts/C45/C45.ANTS.01.txt`.

```
id: C45.ANTS.01
title: The Busy Ant Colony
grade: 5
kind: article
topic: Ants
source: original
pic: ants-colony.webp
---
An ant colony is like a busy town. Every ant has a job.

A blank line starts a new paragraph.
===
Three equal signs on their own line start a new page.
--- words
colony: a big group of ants that live and work together
queen: the one ant that lays all the eggs
```

- **grade:** K, or 1 to 8.
- **kind:** story, chapter, article, poem, play, letter, speech or fable.
  - A **chapter** also needs `book: The Lost Map` and `chapter: 3`.
  - In a **play**, each line is `NAME: words`, in a paragraph of its own.
- **topic:** texts in one topic set share a topic, for example "Ants". Build knowledge with 5–8 texts per topic.
- **source:** `original`, or `adapted from <a public-domain work>` (for example "adapted from Aesop"). **Never copy a copyrighted book or article.**
- **pic** (optional): a picture already in `web/pics/`, with its line in `web/pics/SOURCES.md` (`docs/HANDOFF-PICS.md`).
- **words** (optional): the robust-vocabulary words for this text, 5–8 of them, each with a kid-friendly meaning of 120 letters at most. A boy taps the word in the Reader to see its meaning. Every listed word must appear in the text.
- **Pages:** a page is what fits on one screen of the Reader. Aim for about 80–150 words a page for Grades 2–3, 150–250 for 4–5 and 200–300 for 6–8. K–1 pages are 1–3 sentences.

## 2. Check it
```bash
node tools/core/texts.js check
```
```bash
node tools/core/texts.js show C45.ANTS.01
```
The check (also run by `node tests/run.js`) fails on:
- a bad id or a file name that does not match it;
- a missing title, grade, kind or source;
- a length outside the grade's range (section 2 of the prompt): for example, 500–1,500 words for Grade 5, but a poem, letter, speech or play may be shorter;
- the Divine Name;
- a vocabulary word that is not in the text;
- a missing picture;
- a sentence over 400 letters;
- a text over 60 KB (split it into chapters).

Sentences are split by the tool at `.`, `!` and `?`. `show` lets you see the split. "Mr.", "Mrs.", "Dr." and "R." are not treated as the end of a sentence.

## 3. Open it in the Reader
The book Reader (`src/CoreReader.html`) shows any text from the store:
- a cover with depth for a story or chapter;
- one calm page at a time, with "Page 2 of 5";
- **Read it to me** (🔊): each sentence lights up, and each word as it is said;
- tap a vocabulary word to see its meaning, or tap any word in Grades K–3 to hear it;
- ‹ Back from Grade 3 up;
- a short "Chapter 3 done!" moment at the end.

K–1 boys get big type, and each page is read to them by itself. The Reader remembers the page where he stopped, and that he finished, in his own saved state.

```js
TLCORE.reader.open('C45.ANTS.01', { grade: 5 }).then(function (r) { /* r.done, r.page, r.pages */ });
```

**Tap the sentence that proves it.** Add `ask`, and the whole text becomes the answer area:
```js
TLCORE.reader.open('C45.ANTS.01', { grade: 5, exit: 'x', ask: {
  q: 'Which sentence shows that the queen is important to the colony?',
  proof: 'The queen lays the eggs',          /* words from the proof sentence, or sentence numbers [12] */
  how: 'Find the sentence about what the queen does.',
  look: 'what the queen does' } })
  .then(function (r) { /* r.proof = { right: true, tries: 1 } */ });
```
- The question opens on the page that holds the proof. That page has no paging buttons and no Back.
- A wrong tap names what to look for ("Look for the words that tell what the queen does").
- The second miss puts a soft glow on the paragraph that holds the proof.
- After the third miss, the proof is shown and read again. It is never shown before he tries.
- `exit: 'x'` puts the lesson ✕ top left (inside a lesson); the default is the house (a full page).
- Write `proof` so it matches **one** sentence. `node tools/core/texts.js show <ID>` lists the sentences.

To load a text in your own code: `TLCORE.text('C45.ANTS.01')` gives a Promise of the text, and `TLCORE.textSentences(t)` gives every sentence in reading order.

Coming next from job T: the Reader inside a lesson as an activity ("read this chapter", "tap the proof"), so a lesson's data can name a text without any code.

## Rules that do not bend
Family Life (modest, warm, normal frum family life; a wide mix of names; kosher food), never the Divine Name (Hashem in English, ה׳ in Hebrew), reading level that matches the grade, and **cold check passages**: teach on one text and check on another.
