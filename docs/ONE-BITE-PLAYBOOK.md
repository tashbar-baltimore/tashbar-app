# The One Bite Playbook (v1, 2026-11-21)

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
- No pop-ups, confetti, money pill, banners, mascot or joke jar during a bite. Pay still happens, and is shown once on Bite Done.
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
