# Prompt: the boy's simple home ("My day")

Use this prompt in any Claude session that works on the boy's home screen (grade 2 and up; K–1 stays games-only).

## What the HoS asked for (his words, 2026-11-23)
"Take another pass at the way the student sees his day and his things. Everything has to be much simpler, and what he needs to be doing should be clear to him ... the canteen, to buy things at the canteen, should be clear, and his work should be clear in front of him. There shouldn't be so many vague different options. Everything should be clear and clean and helpful and big ... things should be equal size ... one icon covering half the thing."

Then (same day): "brighter and happier. clearer and crispier. simple and adhd friendly."

**One line to check the finished work against:** a boy signs in and sees ONE screen of big, equal tiles; the first tile is his work and tells him exactly what to do now; the Canteen is its own tile; nothing vague.

## The prompt

> You are changing the boy's home in `src/GameMap.html` (grade 2 and up). Read `CLAUDE.md`, `CONTRIBUTING.md` and `docs/SIMPLIFY-AUDIT.md` first.
>
> Build a **Home** page that is the first thing a boy sees after sign-in:
> 1. A short greeting with his first name and one plain line: how much of today's work is done ("1 of 3 done today").
> 2. **Six tiles, all exactly the same size** (3 across on a Chromebook, 2 across on a phone). **The top half of every tile is one big icon on a colour block.** The bottom half is a big one- or two-word name and one short plain line. No other buttons on the page.
>    - **▶ My work** (first, glowing): "Do this now: Round 1 · Math · Factor Hunt". Opens his work for today (the 3 rounds + his rebbe's picks) with one big Play.
>    - **🗺️ My map**: his subject and level. Opens the map.
>    - **🥪 Canteen**: "Buy food with your money". Opens the Canteen tab of the store directly.
>    - **🛍️ Store**: shows his money. Opens My money (spend, save, give).
>    - **🎮 Arcade**: "Locked: finish your work" or "Open! Go play".
>    - **🎒 My things**: trophies, all my lessons, skill tree, bank and passport, on one page.
> 3. Every other page has **one** big "🏠 Home" button at the bottom instead of the 4-tab bar. No XP bar or rank chip at the top (they live in Trophies); the top shows only his money.
> 4. **Bright, happy, crisp, ADHD friendly:** a light sunny page (not the dark night sky), white tiles with bright colour tops, dark crisp text, big letters, lots of space. ONE thing glows (his work). No moving decorations, no counters or slogans fighting for his eye.
> 5. Plain words, no game-show slogans on his work page ("My work today", not "The Tashbar Challenge!").
>
> Keep every feature and every server call exactly as it is; only the doors change. The server sets all money. No new rewards.
>
> **Before you say done:** update the tests in `tests/run.js` to check the new home (6 equal tiles, work first, Canteen opens the canteen, one Home button), run `node tests/run.js` until ALL TESTS PASSED, and play it as a made-up boy at 1366×768 and 390×844. LOOK at the home, the work page, the canteen and My things, and put the pictures in the pull request. Check the result against the one line above.
