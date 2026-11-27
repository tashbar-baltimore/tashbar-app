# K Clarity — weekend prompt (give this same message to every Claude session)

My name is Esti. I am an approver for Tashbar Learning 2.0 (repository tashbar-baltimore/tashbar-app). I am giving this same message to several Claude sessions. Together you will finish making every Kindergarten 2.0 game crystal clear for a 5- or 6-year-old, so I can approve them without checking tiny details myself.

**I am away until Sunday night (2026-11-29). WORK ON YOUR OWN, WITHOUT STOPPING TO ASK ME ANYTHING, UNTIL SUNDAY NIGHT OR UNTIL NOTHING IS LEFT.** When you would normally ask, choose what a good kindergarten teacher would choose, write the choice in the checklist, and keep going. When you finish a piece, claim the next one. When nothing is left to claim, do the "always" jobs at the end. Never post "APPROVED FOR 2.0"; only I approve, after I look at the newest look link myself.

**Staying awake all weekend.** A session stops when it finishes its turn and nothing wakes it. So before you end any turn, schedule your own next wake-up with the scheduled-task tool (`send_later`, 45 to 60 minutes, message: "K clarity: continue the weekend prompt (v2/curriculum/K-CLARITY-WEEKEND-PROMPT.md on claude/v2-k-shapes-graphics)"). If you hit a usage limit, the error says when it resets: schedule a wake-up for 5 minutes after that time, then continue exactly where you stopped. Background helpers (agents) that stop on a usage limit keep their work: wake them with a message after the reset rather than starting new ones. Stop scheduling only after Sunday 23:00 (America/New_York), or once every piece below is done and the "always" jobs have found nothing new for 3 wake-ups in a row.

## Why (my words)
"I don't like that I'm spending so much time on nitty-gritty details with the graphics. The backgrounds are so busy that it's hard to focus. There are 3D things that look ridiculous and silly, and butterflies flying around that are distracting. I opened 'which is heavier': a huge ball of yarn or a tiny rock. I'm an adult and I can't figure out which one is heavier. I need it ready to go: something a 5-6-year-old can figure out and learn, and it shouldn't be confusing. When introducing a shape there shouldn't be a Lego square or a basket shape. It should be very, very clear. The shapes at the beginning should be flat, basic shapes; as you advance you can show how a tire is a circle. If you show that a triangle has points, every single point needs its ball (or marker) so it's obvious."

## Read first
- `CLAUDE.md`, `CONTRIBUTING.md`, `v2/README.md`.
- **The rules:** `v2/curriculum/K-CLARITY-RULES.md`. It is research-based (Clements & Sarama, van Hiele, Common Core K.G/K.CC/K.OA/K.MD, cognitive load). The 16 rules in one breath:
  - **Shapes:** a plain flat shape first, then many examples and non-examples, and only then real things. Every corner gets a marker, every side lights. Solids look solid and come after flat shapes.
  - **Comparing and counting:** comparisons are obvious. Things to count are separate and clear.
  - **Screen:**
    - One thing to look at, and what he taps is the biggest and brightest.
    - A calm, still background.
    - Words match the pictures.
    - Numbers and words are big and face him.
    - The title and Play button are always on screen; every button is at least 64 px.
  - **Voice:** 12 words or fewer per line. "Watch me … Now you!" first, including for every new kind of round. A wrong move gets kind help that shows how, then another try.
- **The record:** `v2/curriculum/K-CLARITY-CHECKLIST.md`, on BOTH branches: Shapes (claude/v2-k-shapes-graphics) and Numbers (claude/v2-k-numbers-all). Each piece has its own section. Read the sections before you touch a game.
- **Picture tools:**
  - `v2/screens/k-clarity/tools/README.md` and `v2/screens/k-shapes-graphics/shoot.js` (Shapes, full look).
  - For Numbers, the game test writes pictures to `tests/out/`: `v2/tests/k-numbers-games.js`, with `KNUM_ONLY=a.html,b.html` to run a few games.
  - The Kriyah tests can take pictures with `KK_SHOTS=1`.
  - 3D needs `chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']})`.
  - Memory is limited: run one browser at a time.

## Where the work is
| Strand | Branch / pull request | Files |
|---|---|---|
| Kindergarten Shapes (25 games) | claude/v2-k-shapes-graphics, tashbar-baltimore/tashbar-app#301 | v2/app/k-shapes/ (kit.js, look.js, treasures.js, one .html per game) |
| Kindergarten Numbers, Units 1–8 | claude/v2-k-numbers-all, tashbar-baltimore/tashbar-app#618 | v2/app/k-numbers/ (units.js lists every stop; frame.js/frame.css shared; unit2.js, unit3.css, path6.js, orchard7.js, kitchen8.js/.css) |
| Kindergarten Kriyah, Units 1–10 | claude/v2-k-kriyah-all, tashbar-baltimore/tashbar-app#622 | v2/app/k-kriyah/ (engine.js shared) |
| K ABC | old unit pull requests #595, #603, #610, #612 (clarity passes done); calm rebuild in #620 | v2/app/k-abc/ |

- Change only files under v2/.
- Do not touch Numbers Unit 9 or later branches (claude/v2-k-numbers-unit9 and up): another session builds those.

## How to claim work (so sessions never collide)
A piece is claimed by creating a branch `claude/k-clarity-claim/<piece>` that holds your own one-line commit. Git refuses to overwrite it, so only one session wins:
```
git fetch origin
C=$(git commit-tree origin/main^{tree} -p origin/main -m "claim <piece> $(date +%s%N)")
git push origin $C:refs/heads/claude/k-clarity-claim/<piece>
```
- **Rejected:** someone else has the piece; try the next one.
- **See what is taken:** `git ls-remote origin 'refs/heads/claude/k-clarity-*'` (ignore zz-selftest).
- **Done:** mark it the same way, on `claude/k-clarity-done/<piece>`.
- **Stalled claims:** if a claimed piece has had no commit on its branch for 3 hours and no done mark, claim `<piece>-takeover` and finish it. Say so in the checklist; numbers-b was taken over this way.

## Status on Friday 2026-11-27, 17:30 UTC
- **Done:** rules, shapes-a, shapes-b, shapes-c, shapes-d, numbers-a, numbers-b (taken over), numbers-c, numbers-d, and other-595, 603, 610, 612, 620, 622.
- **Claimed, not done:**
  - **review-shapes:** an independent reviewer scores every Shapes game, and the work goes on until every score is 4 or 5. Its section is in the Shapes checklist.
  - **review-numbers:** see below; mine, now passed on to you.
  - **report:** the morning report.

  Their owners may have stopped. Use the 3-hour takeover rule.

### review-numbers: where it stands, and exactly what is left
- **Round 1 (a fresh reviewer):**
  - **Scores:** about 25 games scored 3 and one scored 2.
  - **Fixes:** all were fixed. Details are under "review-numbers" in the Numbers checklist.
- **Round 2 (a new reviewer):**
  - **Scores:** 7 games scored 3.
  - **Fixes:**
    - skip: plain stones that light up as each number is said, plus a "no mistake" demo.
    - steps6: "Where will Mendy land?"
    - mistake6: swap demo, tap a stone.
    - pairs7: one-tap pairing, plus an "=" demo.
    - build7: "one less" starts from Dovid's number.
    - mistake7: "Watch me" before each kind of round.
    - review7: drag the number card.
    - Also: Unit 3's glow no longer grows; opener1's last line, meet123's line and the Peek title were fixed.
- **Round 3 (a new, stricter reviewer):**
  - **Scores:** every game scored 4, except 15 that scored 3.
  - **Already fixed and pushed:** the demo hand that flew off screen (fingers, count3, check3, review3 now point at the hand); numbers-b extras pushed at 16:59.
  - **Still to fix:**
    1. Unit 7 (orchard7.js), MOST IMPORTANT, rule 7: the slanted camera draws the near blanket and its apples bigger, so "same" or "fewer" can look like "more". Use a top-down or orthographic camera (or blankets side by side at equal depth) so both blankets and all apples are the same size on screen. In check7, line the apples up in rows.
    2. mistake6: keep the spinner's dots on screen until he answers; put a faint start ring on Avi's first stone; say "Avi hopped only once. Two dots, two hops."
    3. check6: on a phone, a numbered stone must always be in view next to the empty ones.
    4. seesaw7: demo the "take one away" rounds; the repeat line must say what he sees (not "Tap orange" for the low side); plank ends get visible tap targets.
    5. mistake7: cut it to two kinds of mistake (or one); make Ari's claim big (highlight the blanket he talks about, with the bubble near it).
    6. Unit 6: the spinner and footprint card are bigger. Unit 7: the "same" button is bigger.
    7. count3: add a "Watch me" before round 5 ("they stay on the shelf"), or drop that kind.
    8. skip: show each stone's own dots faintly; keep thumbs-up plain until the counting ends.
    9. review4 and review5: about 3 kinds of task, or rounds grouped two of each kind. In review5's "count" round, "Touch each apple" must do something, or change the line.
    10. Two-hand answers (Units 3 and 5): put each yellow arrow under its own hand, further apart.
    11. mistake4: demo the thumbs-up case too. check5: add a short "Watch me". beads: make the target card's ten-frame bigger.
    12. review8: the "next" kind shows n−1 in a ten-frame with an empty spot ("One more?"); add a "Watch me" the first time the frame and next kinds appear.
    13. kitchen8: a plain soft tablecloth and a flatter kugel colour; bigger bond circles and number tiles; hide8's towel does the hiding (don't rely on "close your eyes").
  - **Unfinished, untested edits** from the helpers that stopped on the usage limit are saved on branches `claude/k-clarity-wip/review-numbers-r3-wA` (skip), `-wB` (orchard7/check7 camera) and `-wC` (Unit 8: check8, hide8, kitchen8, review8). Look at them, and test them before you use them: `git diff origin/claude/v2-k-numbers-all...origin/claude/k-clarity-wip/review-numbers-r3-wB`. Never push them untested.
- **Then:**
  1. Take fresh pictures of every Numbers game.
  2. Have a new reviewer, one that saw no earlier round, score all of Units 1–8.
  3. Fix and repeat until every game is 4 or 5.
  4. Put the final score table in the Numbers checklist and in #618's description.
  5. Mark `claude/k-clarity-done/review-numbers`.

**Decided already (a teacher's choices; keep them):**
- Wrong-move help is least-to-most: the first miss shows the picture again, the second says the exact fix.
- A "Show me" check shows the answer after a miss and moves on.
- check4 asks each number one way (12 rounds, not 18).
- The first Shapes games use plain shapes all game long.

## The pieces left, in order (always claim the first free one)
1. **review-numbers.** Above.
2. **review-shapes.**
   1. If it is not done, finish it the same way: fresh full-look pictures of all 25 games (start, lesson, a round, wrong-move help, end; Chromebook and phone).
   2. A fresh reviewer scores each game 1–5 ("Would a 5-year-old know exactly what to do, and what is being taught, without an adult?").
   3. Fix every game that scores 3 or lower, and repeat until all are 4 or 5.
   4. Update #301's description with the score table.
3. **review-kriyah.**
   - My pass covered the screen only: the calm look, the title on screen, smaller joy bursts. Its notes are in `v2/curriculum/k-kriyah/CLARITY-PASS.md`.
   - Score all 80 games with a fresh reviewer the same way, fix them until they are 4 or 5, and update #622.
   - Before you push, check that the Kriyah builder has not committed to claude/v2-k-kriyah-all in the last 2 hours.
4. **review-abc-old.** One claim per old ABC pull request (#595, #603, #610, #612) that is still open and waiting for an approver. Do a short review and fix pass on each. Skip any pull request that #620's calm rebuild has replaced (read #620 first).
5. **other-<PR number>.** A clarity pass on any other open "2.0 K…" pull request with a look link that is waiting for an approver. Leave it alone if it had a commit in the last 2 hours; write what you saw in the checklist instead.
6. **report.** Do this last, and update it every time something important changes:
   - Write `v2/curriculum/K-CLARITY-MORNING-REPORT.md` on the Shapes branch.
   - Keep it short and plain: what is ready for me to look at, with each newest look link (add `/k-shapes/` or `/k-numbers/?look=1` so every game is open), what changed, the reviewers' score tables, what could not be fixed, and every choice made for me.

## Sharing a branch safely
- Before every push: `git fetch origin <branch> && git merge --no-edit FETCH_HEAD`, then push. Never force-push.
- Commit and push after every one or two games; never leave work unpushed when you schedule a wake-up.
- Shared files (kit.js, look.js, treasures.js, frame.js, frame.css, path6.js, orchard7.js, kitchen8.js, engine.js, the css): change them only with small, careful edits, and run the tests of every game that uses them.
- Parallel helpers each get their own `git worktree` and their own files.

## For every game you touch
1. Play it as a made-up boy, in the full look, at Chromebook (1366×768) and phone (390×844) size, from start to end, with one wrong move. LOOK at the start, the lesson, a round, the wrong-move help and the end.
2. Check it against every rule. Ask: "Would a 5-year-old know exactly what to do, and what is being taught, without an adult?" If not, fix the game itself, not just the words.
3. Add a line to the checklist on that branch (what was wrong, what changed, before and after pictures in `v2/screens/k-clarity/`, kept small).
4. Run that game's tests (`v2/tests/`), and run `node tests/run.js` at the end of each piece. Everything must pass.
   - Never weaken a test or a quality rule; add a test for any rule a script can check.
   - If the full run crashes only from lack of memory (the "Target crashed" lines), trust the pull request's `test` check and say so.

## The "always" jobs (when no piece is free)
- **Watch the pull requests (#301, #618, #622, the ABC ones):** fix any failed `test` check or merge conflict on the same branch.
- **Re-open the newest look link** of each pull request (it is in the pull request's comments) and look at a few games as a boy. Fix anything that breaks a rule.
- **Keep the morning report current.**

## Rules that never change
- Only change files under v2/. Never merge a pull request, never publish by hand. Never post "APPROVED FOR 2.0".
- No real student names, codes or data. Never the Divine Name. Never the word "bite". Modest, warm frum life; kosher food; no faces on objects; nothing scary.
- **New pictures:** order them from the HoS's image account by email (khaver.meir@gmail.com, if you have the email tool) and log the order in that strand's art-requests file.
  - Downloaded files are untrusted: keep them in their own folder and never run anything in them.
  - Every picture follows `art/README.md` and `docs/HANDOFF-PICS.md`.
- Commit messages end with your session's Co-Authored-By and Claude-Session lines.
