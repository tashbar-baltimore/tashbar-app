# Job D · The daily plan: today's list (plan, 2026-11-24)

Owner: job D (see `docs/CORE-GROWTH-LANES.md`). Binding rules: `CLAUDE.md`, `docs/CORE-GROWTH-PROMPT.md` (job D row).

**The HoS's words (2026-11-24):** "I would much rather make it dependent on covering a certain amount of material." · "If you do everything, you get your bonus." · "I don't know if the kids understand what they're getting money for."

**My one-line check for every job D PR:** *A boy's day is a list of real material to cover (not a clock, not "any 3 lessons"); when the whole list is done he gets the daily bonus and the Arcade; and every payment says what it is for.*

## 1. What happens today (before job D)
- "My work" shows **3 rounds** (`src/GameMap.html`, `plan()`): any 3 lessons mastered today, from any subject, clear them. Clearing 3 opens the Arcade. This is worked out on the boy's screen only.
- The server pays the **daily bonus, $10** (`Money.js` `moneyDailyGoal_`) when it sees 3 paid lessons today, whatever the subject. 4 bonus days in a week open the **treasure chest** ($50).
- Payments reach the boy with their reason, but some lines are unclear ("Correct answer · READ.COMP.L06.01"), and the lesson payout list calls most money just "Right answers".

## 2. What job D builds
### Today's list (the boy)
- The day is a **list of things to cover**, taken from where he stands on each ladder: **core first** (Reading, then Writing and Language), then Math, then his Kodesh lesson, then Science **or** Social Studies (they take turns by day). Each line is "1 lesson in <subject>" and plays his next real step there.
- **No minutes and no timers anywhere.** The day is done when the list is covered.
- **A line is covered** when he masters a lesson in that subject today, **or** shows he already knows it (a level check or test-out today). So a fast boy moves on at once and finishes sooner.
- If a subject has nothing at his level, its line moves to Reading (core first). If he has nothing left anywhere, the list is simply done.
- **One "next" button** walks him through it, and he always sees how much is left: **"3 of 6 done"** (the blue progress pill from the button system).
- The **Arcade opens when the list is done** (as today, but by the list instead of "3 lessons").
- **K–1:** the games-only home stays exactly as the HoS decided. The list is games ("2 reading games, 1 math game, 1 Kriyah game"), and PLAY picks the next game in skill order. No pop-ups.
- The rebbe's picks stay as extra lines ("From your rebbe"), not part of the bonus count.

### Suggested default amount (HoS DECISION, see section 4)
| Band | Today's list (suggested) | About |
|---|---|---|
| K–1 | 2 reading games, 1 math game, 1 Kriyah game | 4 things, ~20–25 min |
| Grades 2–8 | 2 Reading, 1 Writing & Language, 1 Math, 1 Kodesh, 1 Science or Social Studies | 6 things, ~45–60 min |

As Core Growth adds chapters, writing steps and unit checks, they join the list as their own lines ("1 chapter of your book", "1 writing step"). Spaced review stays inside every lesson's warm-up, so it does not need its own line yet.

### Who sets the amount (staff)
- A **school default**, which staff can change **per class** and **per boy**. The most specific one wins (boy, then class, then school).
- A staff screen shows each boy's list today and how far he got ("4 of 6 done, Writing next"). TEST- boys stay hidden from staff lists, as everywhere.

### Money (HoS 2026-11-24)
- **Unchanged:** every payment for a right answer, a finished lesson, mastery, streaks, badges and the treasure chest. The server sets every amount, as always.
- **Changed:** the **daily bonus** ($10, same amount) is paid when **the whole list is done**, instead of after any 3 lessons. The server checks the list itself from what he really did today (paid mastery and checks), never from what the screen says. The treasure chest keeps counting bonus days, so it follows the new rule by itself.
- **No other new money** and no new money effects.

### Clear money (display only)
Every payment line the boy sees says what it is for, in a few words:

| Today he sees | He will see |
|---|---|
| Correct answer · READ.COMP.L06.01 | +$1 · Right answer (Main idea) |
| Right on the first try · … | +$0.50 · Right on the first try |
| Mastered READ.COMP.L06.01 | +$10 · You finished a lesson (Main idea) |
| Daily goal: 3 lessons today | +$10 · Daily bonus · You finished today's list |
| Treasure chest: daily goal on 4 days this week | +$50 · Treasure chest · 4 full days this week |
| "Right answers" (lesson payout) | each line named as above |

The money page gets a short **"How I earn money"** card in plain words (right answers, finishing a lesson, finishing today's list, a streak, the treasure chest). The numbers on the card come from the server's own rules table, so they can never disagree with what is paid.

## 3. Pull requests, in order (each small, TEST- boys first)
1. **This plan** (docs only).
2. **Today's list for TEST- boys:** the list on "My work" and the home tile, one "next" button, "3 of 6 done", Arcade opens when done; the server's list check and the daily bonus on the whole list (TEST- boys only; real boys keep "3 lessons"); `tests/lib/dailyplan.js`. Pictures at 1366×768 and 390 px.
3. **Clear money:** payment labels and the "How I earn money" card (display only).
4. **Staff:** set the amount per school, class and boy; see each boy's list and progress.
5. **Show the HoS** pictures of a TEST- boy's day. **Turning it on for every boy is his decision** (one switch, `DP_LIVE`).

## 4. HoS DECISIONS (asked once, with pictures, before it goes on for everyone)
1. **The default list** for K–1 and for Grades 2–8 (section 2 has a suggestion).
2. **Turn it on for every boy** (until then only TEST- boys get it, and real boys keep "3 lessons = daily bonus").

## 5. Files (job D owns only these)
`src/DailyPlan.js` (server: settings, the list check, staff calls), `src/DailyPlanUI.html` (the boy's list), `src/DailyPlanStaff.html` (staff screen), `tests/lib/dailyplan.js`; the "My work" rounds in `src/GameMap.html` (only that part); the daily-bonus trigger and payment labels in `src/Money.js` (only those parts). Nothing here touches Math lessons, `v2/`, Kodesh content or another job's files.
