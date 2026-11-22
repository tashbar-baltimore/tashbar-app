# Teaching Audit: how we teach today (2026-11-21)

**Method.** I played 11 lessons as a made-up test boy at phone size (390 px), one in each age band, covering Math, Reading, Writing, Science, Kriyah, Chumash and Gemara. I saved a picture of every screen. Then I scanned the data of all 1,370 lessons with `tools/audit/teaching-audit.js`. You can re-run both: `node tools/audit/teaching-audit.js`, and `IDS=… node tools/audit/play-shots.js` (add `OB=test` to see One Bite). The pictures stay local (`tools/audit/out/`, git-ignored). They contain only made-up boys.

## The one-page summary for the Head of School

**What's good:** the teaching material is already there. All 1,370 lessons have a hand-written Teacher Time with one big idea, two worked examples and the common mistake. Every question has a "How to do it" box, and practice is hands-on (sort, match, put in order, find them all). The material is strong. **The problem is how it is served.**

**The numbers**

| What | Today |
|---|---|
| Screen changes to finish one lesson (sample of 11) | **45 to 56** |
| Things to tap on one screen | up to **29** |
| Words on the screen, on average (even in Kindergarten) | **137 to 228** |
| Questions per lesson | 12–22 (average 17). 638 lessons have 18 or more |
| Lesson shape | **The same in all 1,370:** 3 Learn, about 10 Practice, 3 On your own |
| Plain multiple-choice questions (all phases) | 37% |
| Check questions asking something the lesson never taught | **866**, in 591 lessons (43% of lessons) |
| K–1 lessons with a question longer than 12 words (our own rule) | 142 of 323 |
| A check for a missing earlier skill before a lesson | none |
| A path back down to fill a gap | none (two fails sends him to "teacher check-in") |

**The 10 biggest problems**
1. **Too busy.** Money Storm, JACKPOT!, coin rain, a "+50¢ first try" flag, a money pill, a "Next goal" bar, a Quest chip, the Tashbar Bank sign and the Joke Jar all land on top of the work while the boy is trying to think. (See the picture "before-after-long-division".)
2. **The lesson opens with a quiz.** First comes "10-second challenge: get it right and skip the lesson", then "Learn it", then "Full lesson / Start the questions". That's three choices before he learns anything.
3. **The "Learn it" card pops up again before every Learn question.** It shows "Here's how it works / Show me step by step / I'm ready" each time.
4. **There is no single "this is what we're learning today."** The skill name sits in small print in a header, under other banners.
5. **The worked example is hidden.** The real step-by-step example (Teacher Time) sits behind a "Play the fun lesson" button that most boys skip.
6. **Too long for one sitting.** About 17 questions plus pop-ups is 10–15 minutes. That is too long for K–3 and for a boy with ADHD.
7. **Repetitive.** Every lesson in every subject and every age has the same shape and the same screens. The only thing that changes is the question kind.
8. **No gap path.** No lesson checks whether the boy has the skill it stands on, and none offers a smaller "bridge" lesson. A boy who is stuck fails twice, then waits for a teacher.
9. **Checks that were never taught (866).** These are worst in Reading (123 in 79 lessons), Computing (104) and Kodesh (227 across 408 lessons).
10. **The same layout for a 5-year-old and a 13-year-old.** Kindergarten screens carry about 190 words, and 142 K–1 lessons break the 12-word rule. The older boys get the same cartoons as the little ones.

## Scores per lesson played (1 = poor, 5 = excellent)

| Lesson | Band | Bite size | "Today we learn" | Worked example | Guided before alone | Calm screens | Ways of learning | Reading load fits age | Checks match teaching |
|---|---|---|---|---|---|---|---|---|---|
| MATH.NUM.L01.01 one-to-one | K | 4 | 2 | 2 | 3 | 1 | 3 | 2 | 4 |
| LK.KRI.L01.01.a Aleph–Hei | K | 4 | 2 | 2 | 3 | 1 | 3 | 3 | 5 |
| READ.PHON.L03.01 syllables | Gr 2 | 3 | 2 | 3 | 3 | 1 | 4 | 2 | 3 |
| MATH.OPS.L03.01 add within 100 | Gr 2 | 3 | 2 | 3 | 3 | 1 | 3 | 3 | 4 |
| MATH.OPS.L05.02 long division | Gr 4 | 3 | 2 | 3 | 3 | 1 | 3 | 3 | 4 |
| SCI.LAND.L04.02 | Gr 3 | 3 | 2 | 2 | 3 | 1 | 4 | 2 | 4 |
| READ.COMP.L06.01 | Gr 5 | 2 | 2 | 2 | 3 | 1 | 3 | 2 | 1 |
| LK.CHU.L03.01 | Gr 2 | 3 | 2 | 3 | 3 | 1 | 3 | 3 | 4 |
| MATH.ALG.L07.02 ratios | Gr 6 | 3 | 2 | 3 | 3 | 1 | 3 | 3 | 4 |
| WRIT.ESSAY.L07.02 evidence | Gr 6 | 2 | 2 | 2 | 3 | 1 | 3 | 2 | 3 |
| LK.GEM.L07.03 | Gr 6 | 3 | 2 | 3 | 3 | 1 | 3 | 3 | 4 |

Notes:
- **Wrong answers:** in practice, the choices lock for about 2 seconds and shuffle, and a fast tap gets "Slow down". In the check, he sees "Not this one" plus the answer. Nothing names the step he missed.
- **Access:** read-aloud buttons exist, and drag tasks already have a tap-tap way, which is good. There is no easy-read font, and contrast drops under the effects layer.
- **Missing earlier skill:** nothing happens until he fails.

## What the fix needs (now built as One Bite, see `docs/ONE-BITE-PLAYBOOK.md`)
- One calm path of 6 steps, the same every time.
- Today's Bite first, read aloud. The worked example one step per tap. A Mistake Detective card.
- Guided tries, then the steps fold away, then 3 checks.
- Nothing flying over the work. Pay still happens and shows once, at the end.
- Age bands for size, reading load and length. A ready check and a bridge bite for gaps. A smaller-step rescue when he is stuck.
- Hand-written bites, batch by batch, to close the 866.
