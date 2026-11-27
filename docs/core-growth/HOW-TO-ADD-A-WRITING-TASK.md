# How to add a writing task (the Writing Workshop and the teacher's inbox)

Job T wrote this note (2026-11-24). It is for jobs W13 and W48, and for any job whose unit ends in a real writing piece. CLAUDE.md wins where they differ.

**The HoS rule:** a writing piece is never marked right just for being typed (prompt section 5). Mastery of writing *skills* comes from the tap checks of the small skill lessons. The *piece* is planned, written and fixed by the boy, then read and scored by his teacher.

## What the boy does (`src/CoreWrite.html`)
1. **Plan.** He sees the task, the **strategy card** (for example POW + TREE) and the plan boxes (the organizer). Next waits until every box has a few words, and says which box is still empty.
2. **Write.** His plan stays one tap away (beside the writing on a Chromebook, folded on a phone). Sentence starters drop in where he is typing. A word counter shows how far he has come. Next waits for the task's minimum words.
3. **Fix.** His **checklist**: the app checks every line it can and ticks it by itself (✓), and he must meet every line before Next. A line the app cannot check, like "I read it out loud to myself", he ticks himself. 🔊 reads his writing back to him. A piece sent back by his teacher opens here, with the teacher's note on top; it stays "sent back" (note and all) until he sends it again.
4. **Finish.** He gives it a title and picks a picture, sees it as a book page, and taps **Send**.

His draft is kept on the Chromebook as he types and on the server at each step; when the two differ, the newer one wins, and what he is typing is never replaced. A boy has one open piece per task. **My book** (`TLCORE.write.book()`) shows every piece his teacher published, with its picture and the teacher's note, and pieces sent back to fix. There is no money anywhere in the workshop.

## What the teacher does (`src/CoreWriteStaff.html`)
In the staff portal, go to **Reports → ✍️ Writing inbox**. Pieces waiting are on top. Open one to see his piece, his plan and his checklist. Score each rubric row from 1 (not yet) to 4 (strong) and write a short note. Then choose:
- **Send back to fix:** a note is required. He sees it on the Fix screen.
- **Publish to his book:** every row must be scored first.

## The task
A task is plain data in your job's data file. Open it from a lesson, a unit's real task or a button, with:

```js
TLCORE.write.open(TASK, { grade: 5, exit: 'x' /* inside a lesson: the X asks "Leave this lesson?"; leave it out for the house */ }).then(function (r) { /* r.sent, r.id */ });
```

```js
var TASK = {
  id: 'W48.OPIN.01',                          /* job letters first, like a text id */
  title: 'Should our class have a pet?',
  grade: 5, kind: 'opinion',
  prompt: 'Your class may get a pet. Should it? Tell your opinion and give reasons.',
  strategy: { name: 'POW + TREE',
    steps: [['P', 'Pick my idea'], ['O', 'Organize my notes'], ['W', 'Write and say more']],
    more:  [['T', 'Topic sentence'], ['R', 'Reasons: 3 or more'], ['E', 'Ending'], ['E', 'Examine']] },
  plan: [ { k: 'topic', label: 'T · My opinion', hint: 'I think our class should…' },
          { k: 'r1', label: 'R · Reason 1' }, { k: 'r2', label: 'R · Reason 2' }, { k: 'r3', label: 'R · Reason 3' },
          { k: 'end', label: 'E · My ending' } ],
  starters: ['I think', 'One reason is', 'Another reason is', 'Also,', 'In the end,'],
  min: 60,                                    /* words before Write -> Fix */
  checks: [
    { t: 'I wrote at least 5 sentences.', sentences: 5 },
    { t: 'I told my opinion first.', first: 'topic' },
    { t: 'I used linking words.', any: ['one reason', 'another', 'also', 'because'] },
    { t: 'Every sentence starts with a capital and ends with . ! or ?', caps: true },
    { t: 'I used every part of my plan.', plan: true },
    { t: 'I read it out loud to myself.', self: true } ],
  rubric: ['My opinion is clear', 'Reasons with details', 'Order and linking words', 'Capitals, end marks and spelling'],
  pics: ['🐠', '🐹', '🦜', '📚']
};
```

**Checks the app can do:**

| Check | Met when |
|---|---|
| `sentences: 5` | there are at least 5 sentences |
| `words: 80` | there are at least 80 words |
| `caps: true` | every sentence starts with a capital and ends with `.` `!` or `?` |
| `any: ['because', ...]` | his writing uses at least one of these words |
| `first: 'topic'` | his first sentence uses the key words of that plan box |
| `plan: true` | every plan box's key words appear in his writing |
| `self: true` | he ticks it himself (use this only for things the app cannot see) |

A plan box with very short words ("a dog", "Yes!") is still checked by its own words, so a checklist line can always be met, and a line that is not met says which plan box to use.

`TLCORE.write.err(task)` returns `''` or what is wrong. It is checked when the task opens, and a broken task never opens.

## Quick writes (W13, HoS 2026-11-27)
A **quick write** is 3 to 5 sentences (25+ words) about a text the boy just read, using a writing skill he already has. It goes to the same teacher inbox, and the teacher scores it like a piece.

**How it reaches him:** a lesson that opens a text (a `read` or `proof` activity) with quick writes ends, on **Level clear**, with a "Next: a quick write for your teacher" line, **Quick write** (main) and **Not now** (quiet). He picks one of the text's prompts, then: **Write** (the prompt, a "How to do it" box, sentence starters, the word count; 📖 opens the story again) and **Check** (the checklist he must meet), then **Send**. The teacher sees the prompt above his writing. Two steps only: no plan boxes, no strategy card, no title or picture step.

**The data** (`kind: 'quick'`; W13's are in `src/CoreDataW13H7.html`, loaded through `CORE_DATA_FILES.W13` in `src/CoreDataW13.js`):

```js
TLCORE.write.quick.add([{
  id: 'W13.QW.ST01A', kind: 'quick', text: 'C23.ST.01', story: 'The Noise in the Sukkah',   /* story = the text's title, exactly */
  grade: 2, skill: 'WRIT.PARA.L02.05', uses: 'Time Words',                                 /* a writing skill he has had */
  title: 'What Happened That Night',
  prompt: 'Tell what happened in the sukkah that night, in order. Use time-order words.',
  how: ['First: what did Dovid hear?', 'Next: what did he do?', 'Then: what did he see?', 'Last: what did the boys do with the challah?'],   /* 2-5 steps */
  starters: ['First,', 'Next,', 'Then,', 'Last,'], min: 25,
  checks: [{ t: 'I wrote at least 3 sentences.', sentences: 3 }, { t: 'I used time-order words.', any: ['first', 'next', 'then', 'last'] },
           { t: 'Every sentence starts with a capital and ends with . ! or ?', caps: true }, { t: 'I checked my facts in the story.', self: true }],
  rubric: ['Tells what happened, in the right order', 'Time-order words move it along', 'Facts match the story', 'Capitals, end marks and spelling']
}]);
```

- `TLCORE.write.err` checks it (a quick write needs `text`, `story` and 2–5 `how` steps, and may not use `first` or `plan` checks). A broken one is refused, with the reason in the console.
- **Two per text.** Check every fact against the text. An `any` line must be one a good, honest answer always meets (a letter has no end mark after "Your friend, Naftali", so a letter uses no `caps` line).
- `TLCORE.write.quick.pick(textId, opts)` opens the picker; `quick.forBite(bite)` says whether a lesson offers one; `quick.of(textId)` lists a text's.
- `tests/lib/quickwrite.js` checks every quick write and plays the screens at 1366 and 390.

## Strategies to use (SRSD: Graham and Harris)
| Kind | Strategy | Plan boxes |
|---|---|---|
| Opinion | POW + TREE | Topic sentence, Reasons (3+), Ending, Examine |
| Story | POW + WWW, What = 2, How = 2 | Who, When, Where, What does he want, What happens, How does it end, How does he feel |
| Information | TIDE | Topic, Important details (3), Ending |
| Argument (6–8) | STOP + DARE | Develop a topic sentence, Add supporting ideas, Reject a counter-argument, End |
| K–2 sentences | Picture + 1–3 sentences | My picture, Who, Did what |

Teach the strategy in the unit's small skill lessons first (model it, he memorizes it with a tap check, then guided practice). The workshop is where he uses it on his own.

## Rules
- Family Life, never the Divine Name, and grade-level prompts. A prompt about a text he read builds knowledge: name the text.
- Rubric rows are what the teacher scores, 2 to 6 rows in plain words. Match them to the checklist.
- Do not mark a lesson mastered because a piece was sent. The piece is the teacher's.
