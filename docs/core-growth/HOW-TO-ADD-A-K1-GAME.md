# How to add a K–1 game (new Kindergarten and Grade 1 skills on the K–1 game path)

Job T wrote this note (2026-11-24) for job F, and for any job with K–1 skills. CLAUDE.md wins where they differ.

**The HoS rule (2026-11-22):** a Kindergarten or Grade 1 boy gets **games only**. His home is one full-screen path of real games for his grade, in the order the skills build, one game at a time, with no pop-ups (`src/K1Only.html`). So a new K–1 skill reaches a K–1 boy as a **game**, never as a question lesson.

## What a K–1 game is (`src/CoreK1.html`)
- **Full screen and voice first:** each piece's spoken line is read to him. 🔊 says it again.
- **4 to 8 Activity Kit pieces:** find, sort, match, tiles, trace, listen, count, ten-frame, or the core kinds. Each piece uses big targets (at least 72 px, 104 px on a Chromebook).
- **Mistakes:**
  - a wrong tap shakes, and the game says what to look at;
  - after 3 misses the game shows the answer and moves on.
- **Stars:** a star for each piece right on the first try. At the end he gets 0 to 3 stars ("You did it!" at 2 or more), with **Next** and **Play again**.
- **Where stars are saved:** where his path's game pack saves its stars (Kindergarten ABC: `st.klr`; Grade 1 Reading: `st.g1r`). The path opens the next game at 2 stars, exactly like the other games.
- **Nothing else:** no money, no mastery and no evidence rows, the same as the K–1 game packs.

## Add one
In your data file, next to `TLCORE.add(...)`:

```js
if (window.TLCORE && TLCORE.k1) TLCORE.k1.add({
  id: 'READ.PHON.L01.07',          /* a K (L01) or Grade 1 (L02) reading or writing skill id, listed with add-skill.js */
  grade: 0,                        /* 0 = Kindergarten (ABC path), 1 = Grade 1 (Reading path); must match the id's level */
  name: 'Short a Train',           /* 30 letters at most; shown on his path */
  after: 'READ.PHON.L01.01.f',     /* the game it comes right after on that path (left out: the end of the path) */
  acts: [
    { type: 'listen', hear: 'apple', clip: '...', o: ['a', 'e', 'i'], a: 'a', say: 'What sound starts apple?', how: 'Say apple slowly. Hear the first sound.' },
    { type: 'findall', grid: ['a', 'e', 'a', 'o', 'a', 'i'], find: 'a', say: 'Tap every a.', how: 'Look at each letter. Is it a?' },
    { type: 'tiles', w: ['c', 'a', 't'], extra: ['b'], hear: 'cat', say: 'Build cat.', how: 'Say it slowly. Tap the sounds in order.' },
    { type: 'sort', bins: ['Short a', 'Not a'], cards: [['🐱', 0], ['🐝', 1], ['🎩', 0]], say: 'Short a or not?', how: 'Say the word. Hear the middle.', mis: true }
  ]
});
```

**Rules** (`TLCORE.k1.err(game)` refuses a game that breaks them):
- 4 to 8 pieces, with 3 or more kinds;
- every piece passes the Activity Kit's own check at the K1 band (3 choices at most);
- every spoken line is 12 words or fewer.

Also follow the One Bite rules for K–1 (`docs/ONE-BITE-PLAYBOOK.md`):
- a spoken line never uses a lone letter for its sound (a computer voice reads "b" as "bee", so `listen` plays a real word);
- Hebrew is never spoken by the computer voice;
- one piece should be the boy's likely mistake (`mis: true`).

**The skill row still comes first:** list the skill with `tools/core/add-skill.js` (it puts it on the ladder for the staff grid and placement). The game is what a K–1 boy plays.

## What the tests check (`tests/lib/corek1.js`)
At 1366 and 390, with a made-up K boy and a made-up game:
- the game sits right after its `after` game, locked until that game is passed;
- PLAY opens it full screen on top of everything, and it plays by tap only, with one wrong tap that says what to look at;
- the end gives the right stars, saved in `st.klr`, and the next game opens;
- button system only, targets of 44 px or more, and no sideways scroll.
