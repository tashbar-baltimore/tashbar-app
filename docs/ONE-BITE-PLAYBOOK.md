# The One Bite Playbook (v1, 2026-11-21)

> **NEW LESSONS (HoS 2026-11-27):** lessons are moving to a new shape (THINK, LEARN, TRY IT, SHOW ME, DONE; fewer, deeper activities). New and redone lessons follow `docs/lesson-redesign/DESIGN.md`, not the six steps below. Old-shape lessons keep playing as described here until they are redone.


> **Words the boys see (HoS 2026-11-21):** boys never see the word "bite". The screens say **TODAY WE LEARN** (step 1), **LEVEL CLEAR!** and **▶ Next level** (step 6), and "lesson" everywhere else, matching the map. "One Bite" stays only as the builders' name for this project and its files.

> One bite, one path, one button. In five seconds a boy knows what he is learning today. A few minutes later he knows how to do it.

## 1. The six steps (they never change)
| # | Step | Purpose | Research basis |
|---|---|---|---|
| 1 | **TODAY'S BITE** | One sentence, one picture, read aloud, plus "Why it matters". Then an optional 2-question **ready check**. | Clear learning goal and activating prior knowledge (Rosenshine 2012, principle 1; Hattie, "learning intentions") |
| 2 | **WATCH ME** | One worked example, one step per tap, then a **Mistake Detective** card (the common error, crossed out, and why) | Worked-example effect (Sweller); explicit instruction; contrasting cases (Durkin & Rittle-Johnson) |
| 3 | **DO IT WITH ME** | Guided tries with the "How to do it" steps showing. After 2 misses, the *one small step at a time* rescue opens. | Gradual release: I do, we do, you do (Pearson & Gallagher); guided practice with high success (Rosenshine 5–6) |
| 4 | **YOUR TURN** | Hands-on practice (sort, match, build, find, type). After 2 first-try rights, the steps fold away ("Need the steps?"). | Fading scaffolds (Renkl & Atkinson); hands-on work over plain multiple choice (HoS rule) |
| 5 | **SHOW ME** | 3 tap-kind questions, one try each. Mastery is earned here (the rules are unchanged). | Retrieval practice (Roediger & Karpicke); mastery learning (Bloom) |
| 6 | **BITE DONE!** | One line on what he learned and one button to the next bite. It comes back for spaced review. | Spacing effect (Cepeda et al.); self-efficacy (Bandura) |

**The screen rules:**
- One thing per screen and one big green button forward.
- A 6-dot strip at the top, with ✕, 🔊 and **Aa** (easy-read letters).
- No pop-ups, confetti, banners, mascot or joke jar during a bite.
- **Money stays exciting (HoS 2026-11-21 22:22):** a gold money chip in the One Bite header shows his real balance on every screen. Every right answer sends a coin flying into it, and Bite Done has a big counting-up "YOU EARNED" moment (`src/OneBiteMoney.html`, display only; the server sets every amount). The old pop-up money shows (Money Storm, Jackpot, coin rain over the work) stay off during a bite.
- No timers.

## 2. Age bands (each bite has one; the default comes from its level)
| Band | Levels | Feel | Text | Choices | Length |
|---|---|---|---|---|---|
| **K1 Little Learners** | L01–L02 | voice-first (auto read-aloud), big pictures, songs, manipulatives | 26 px, lines of 12 words or fewer, almost no reading | 3 at most | 3–5 min |
| **B23 Builders** | L03–L04 | manipulatives move to symbols, short read-along, one new word at a time | 22 px | 3–4 | 5 min |
| **E45 Explorers** | L05–L06 | worked steps, real-world problems, "tap the reason" | 20 px | 4 | 5–7 min |
| **M68 Masters** | L07+ | fewer cartoons, more respect: strategy choice, challenge, teach it back, why it matters in life and Torah | 18 px, calm blue accent, small pictures | 4 | 7–10 min |

## 3. Ways of learning (each bite uses at least 2)
The **built-in visual models** are in `OneBite.html` (`m:` on a watch step or a ready question):

| Model | Code | Best for |
|---|---|---|
| Ten-frame | `{type:'tenframe', n:9, n2:1}` | K–2 counting, making ten |
| Number line | `{type:'line', from:0, to:20, hops:[8,10,15]}` | adding and subtracting, integers |
| Base-ten blocks | `{type:'blocks', tens:3, ones:4}` | place value, regrouping |
| Fraction bar | `{type:'fbar', n:3, d:4}` | fractions |
| Letter or part tiles | `{type:'tiles', w:['ro','bot'], hi:[0], he:false}` | phonics, syllables, Hebrew letters (`he:true`) |
| Picture count | `{type:'emoji', e:'🍎', n:7, group:5}` | K counting, arrays (`group`) |
| Family scene | `{type:'scene', e:'🕯️', t:'Erev Shabbos, Mommy sets 2 candles…'}` | real-life frum-family problems |
| Song or chant | `{type:'chant', lines:['Two, four, six, eight…']}` | facts, rules, letters |
| Movement | `{type:'move', t:'Stand up! Stomp each beat.'}` | K–3 movement breaks |

The **question kinds** (from the lesson's own practice) add more: sort it, match it, build it, find them all, type it. **Mistake Detective** comes from `oops`.

Use **teach it back** and **chavrusa** in Masters bites as a watch step ("Tell your chavrusa the 3 steps").

## 4. Gaps: join at any level
- **Ready check:** `ready:[2 tap questions]` on the skill this bite stands on. If he misses both (or the only one), he is offered the **bridge bite** (`bridge:'SKILL.ID'`) with one button. When he finishes it, Bite Done says "Back to: …" and returns him. He can always choose "Keep going here".
- **Stuck mid-bite:** after 2 misses on one question, the *one small step at a time* rescue shows that question's How-to lines one by one.
- **Not mastered:** "Almost there! Practice round ▶" (the engine's retry). After a second fail, "Let's team up" (the rebbe or teacher check-in, unchanged).

## 5. Spaced review
A finished bite comes back as a quick warm-up item in later lessons (the existing MasteryReview and warm-up). It is shown in step 1 as the ready check, never as a pop-up.

## 6. Writing rules
- **Today line:** 4–9 words, a verb first if possible ("Add 9 the quick way"). **Why:** one sentence, kid words, real life.
- **Watch:** 2–5 steps, each one short sentence. Show the answer at the end.
- **Oops:** the real mistake boys make, crossed out next to the right one, plus one line on why.
- One new word at a time; bold it and say what it means.
- Show modest, warm, normal frum family life, with a wide mix of names (Yossi, Chaim, Akiva, Shimon, Dovid, Moishe, Eli, Naftali…) and kosher food.
- Never write the Divine Name (use ה׳, and אלקים for Elokim). Copy Hebrew by script from a source. Kodesh gets "REBBE: review after live".
- Every check question must be answerable from what the bite showed (the test counts the misses).

## 7. The data format (`window.ONE_BITE[id]` in `src/OneBiteData*.html`)
```js
B['MATH.OPS.L02.05'] = {
  band:'K1', pic:'🔟', today:'Make a ten to add fast', why:'Tens are easy. 9 + 5 is just 10 + 4!',
  ready:[{q:'How many more make 10?  8 + ? = 10', o:['2','3','1'], a:'2', m:{type:'tenframe',n:8}}],
  bridge:'MATH.OPS.L01.04', bridgeName:'Ten friends',
  watch:{ q:'9 + 5', m:{type:'tenframe',n:9,n2:5}, steps:[
      {t:'9 needs 1 more to make 10.', m:{type:'tenframe',n:9,n2:1}},
      'Take 1 from the 5. Now it is 4.', '10 + 4 = 14.'], a:'9 + 5 = 14' },
  oops:{ q:'9 + 5', wrong:'13', right:'14', why:'When you take 1 from the 5, 4 are left, not 3.' },
  ways:['tenframe','picture','Mistake Detective'], done:'You can make a ten to add fast!',
  board:{ one:'Make a ten', activity:'Ten-frame cards in pairs', mistakes:['…','…','…'] }   /* Phase 5: Teach it at the board */
};
```
Anything left out comes from the lesson's own Teacher Time (an auto-bite).

## 8. Accessibility checklist (every bite)
- ☐ 🔊 on every screen; K1 reads aloud by itself.
- ☐ **Aa** easy-read letters (wider spacing, a plain font).
- ☐ Targets 48 px or larger (K1 76 px), high contrast, and it works at 200% zoom.
- ☐ Every drag has a tap-tap way. Every sound has text.
- ☐ No red "wrong" screens and no public failure. Progress dots never go backward.
- ☐ Enter or Space presses the green button.

## 9. Switches and rollout
- `window.OB_LIVE`: `'test'` (TEST- boys only), `'on'` (every boy, limited by `OB_SUBJECTS` if set), or `'off'`.
- **Rollout:** test boys first, then by subject, with the hand-written bites added in batches of 20–40 per PR.

## 10. The Activity Kit (round 2, `src/OneBiteKit.html`)
A bite with `do:[…]` and `your:[…]` plays **hands-on activities** in steps 3 and 4 instead of the lesson's question cards.
- **Do it with me** plays every `do` activity (1–3; 2 is best), with the How-to box open and gentle help (counts shown, ghost tiles, a pulsing first target).
- **Your turn** plays the `your` activities (3–5). After **3 right on the first try in a row** it goes straight to **Show me**. A miss starts the run again. When the list runs out, Show me comes next anyway. The How-to box hides behind "👀 Need help?" until he asks or misses.
- A wrong try shows the help line. A Check activity missed twice shows the answer and moves on (it is recorded as not right).
- The player never puts the same activity twice in a row (it reorders `your` when it can). The test fails if it cannot.
- Every activity is saved as an engine result (phase `teach` for `do`, `practice` for `your`), so evidence rows still save. Mastery, pay and saving are unchanged: Show me is the lesson's own 3 check questions.
- **No `do`/`your`:** the lesson's own questions play, capped at 2 guided + 5 practice, and practice also ends after 3 right in a row.
- **Little Learners (K1):** every instruction is spoken; 3 choices at most (the test checks); big targets; a 🧍 wiggle break before Your turn when the bite has no `chant` or `move` model; a celebration on Bite Done.
- **Builders and up:** the instruction's words light up as it is read (read-along). **Explorers:** add `why:{q,o,a}` to any activity for "tap the reason" after a right answer.

Every activity may have: `say` (spoken instruction; a good default is made), `how` (the How-to line; a default is made), `q` (a big prompt such as `3 + 4`), `pic` (an emoji; `art:apple` uses the K–1 games' drawings), `why`.

| Type | Data | He does |
|---|---|---|
| `tenframe` | `{type:'tenframe', n:7, start:0}` (n up to 20; `start` dots are already in, blue). **Take away:** `{type:'tenframe', n:4, start:9}` (start bigger than n; n can be 0) | taps boxes (or drags the dot) until the frame shows n, then Check. Take away: taps dots OFF (they show ✕) until n are left |
| `hop` | `{type:'hop', start:3, add:4, unit:1, from, to}` (add < 0 hops back; unit 2, 5, 10 for skip counting; at most 20 hops wide) | taps Hop ▶ / ◀ Hop, counting hops, then Check |
| `count` | `{type:'count', n:6, pic:'🍎', name:'apple', o:['5','6','7']}` (`o` optional) | taps each picture (it gets a number), then picks how many |
| `blocks` | `{type:'blocks', n:14}` | adds tens and ones (tap a block to take it away), then Check; 14 ones is "trade 10 ones for a ten" |
| `tiles` | `{type:'tiles', w:['c','a','t'], extra:['b'], hear:'cat', he:false}` | taps tiles into the slots in order, then Check (numbers work too: `w:['2','4','6']`) |
| `findall` | `{type:'findall', grid:['b','d','b','p'], find:'b', findSay:'b'}` (`find` can be a list; up to 20 cells) | taps every target |
| `match` | `{type:'match', pairs:[['🍎','a'],['🐝','b']]}` (2–4 pairs; K1 3 at most) | taps one, then its partner (or drags) |
| `sort` | `{type:'sort', bins:['Circle','Not a circle'], cards:[['⚪',0],['🔺',1]]}` (2–3 bins, 2–8 cards) | one card at a time: taps (or drags it to) the right box |
| `trace` | `{type:'trace', glyph:'b', name:'letter b', he:false}` | traces the dotted letter with a finger; passes at about 80% covered |
| `listen` | `{type:'listen', hear:'buh', clip:'letter-sound:b', o:['b','d','p'], a:'b', cap:'the sound at the start of ball'}` | hears it (auto-played, 🔊 again), taps the match |

**Display (Lane A2, 2026-11-22):** long text in match items, sort cards and bins, findall cells, choices, tiles and the `q` prompt **shrinks to fit** (2 lines at most, never sticking out), so you do not have to cut words to the bone. A `\n` in a sort card, findall cell or match item **stacks rows**: `['⚽\n📦',0]` is a ball above a box. Keep findall cells short (3 characters or one emoji pair): a cell is about 70 px wide.

**Check your lessons like the QA does:** `IDS=<id prefixes> node tools/audit/ob-qa.js` writes `tools/audit/out/ob-qa.md` (layout at 390 px, age fit, variety, taught-then-asked, rules, math). Live QA findings are posted in issue #166.

Hebrew (`he:true`) is never spoken by a computer voice: give `listen` a recorded `clip`. Example bite:
```js
B['SKILL.ID'] = { band:'K1', …round-1 fields…,
  do:[ {type:'tenframe', n:5}, {type:'count', n:5, pic:'🍎', name:'apple'} ],
  your:[ {type:'count', n:7, pic:'⭐', name:'star'}, {type:'tenframe', n:6}, {type:'findall', grid:['5','3','5','2','5','4'], find:'5'},
         {type:'count', n:4, pic:'🕯️', name:'candle'}, {type:'tenframe', n:8} ] };
```
Check it: `node tools/audit/ob-quick.js` (it tells you exactly which activity is wrong), then `OB=test IDS=<ids> node tools/audit/play-shots.js` (one picture per activity, opened and done).
