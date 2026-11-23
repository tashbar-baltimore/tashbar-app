# Unit 1 (Alef, Beis, Veis): builder's notes

**The request, in Esti's words:** "Build the first unit of Kindergarten Kriyah, in the 3D look I approved, ready for me to look at and approve at 9:30."

## Where it is
- The games: `v2/app/k-kriyah/`. Unit 1 starts at `index.html` (the path of stones). Each game is `play.html?g=u1g0` … `u1g6`.
- The shared parts of the games (3D world, Mendy and family, 3D letters, voice, stars, saving): `engine.js`. Letter shapes: `letters.js` (from the Noto Serif Hebrew font). three.js 0.160.0 is in `lib/`, so nothing loads from another website.
- Tests: `v2/tests/k-kriyah-*.js` (helpers in `v2/tests/k-kriyah-lib/`). Pictures: `v2/screens/k-kriyah/`.

## The games, in order (a game opens at 2 of 3 stars)
| Stone | Game | What he does |
|---|---|---|
| 1 | Mendy's first day (opener story) | Tatty walks Mendy to cheder; the rebbe shows Alef (Abba starts with Alef; Alef is quiet). The house turns into Beis with Mendy as the dot; Mendy goes out and it's Veis. A short chant, then he taps each letter. |
| 2 | Look-Alike Detective | Drags (or taps) each letter to its house: Beis to the house where Mendy is home, Veis to the empty one. |
| 3 | Feel the Shape | Runs his finger along the glowing road on each big letter. Touch only, not writing. |
| 4 | Letter Hunt | Finds every Beis hidden in the sukkah, then every Veis. |
| 5 | Find the Mistake | "Yaakov says this is a Beis. Is he right?" Taps yes or no, then drags the right letter onto Yaakov's sign. |
| 6 | Show what you know (mastery check) | "Hear it, tap it": 9 questions by name and by sound, mixed. |
| 7 | Bonus: letter rain | For quick boys (opens at 3 stars on the check): catch the falling Beis, then Veis, then Alef, faster each round. |

## Decisions I made on my own (each one line, so you can say yes or change it)
1. **The bonus round opens only after 3 stars on the mastery check** (2 stars passes the unit; the bonus is for quick boys).
2. **Feel the Shape has no failing.** It's touch only, so finishing gives 3 stars (2 if he needed more than 4 reminders).
3. **Feel the Shape uses a glowing road, not dots.** Dots on a Beis could look like the dagesh, the very thing he's learning to notice.
   - He can start anywhere on the road and go either way, so it stays "feeling the shape" and doesn't turn into learning to write.
   - On Beis, he also taps Mendy's dot.
4. **"Done" marks are gold stars above a letter, never dots below it** (a dot below could look like a nekudah).
5. **The computer voice says "buh" and "vuh"** for Beis's and Veis's sounds until the rebbe's recording arrives (a computer can't say a lone "b"). It is marked on screen as temporary.
6. **Letter Hunt is in a sukkah** (Unit 1 falls in Tishrei), with two rounds: Beis first, then Veis.
7. **Stars:** 2 stars passes. The cut-offs for each game:
   - **Detective** (8 letters): 0 mistakes is 3 stars, 1–2 is 2 stars.
   - **Letter Hunt:** 0–1 wrong taps is 3 stars, 2–3 is 2 stars.
   - **Find the Mistake:** 0 mistakes is 3 stars, 1 is 2 stars. Yaakov is right exactly half the time, so always tapping one button can't pass.
   - **Mastery check:** 8 of 9 right the first time is 3 stars, 6 of 9 is 2 stars. A question asked with only two letters on screen (the easier version) is practice: it comes back with all three, and only that one counts.
   - **Bonus:** catching 80% with at most 2 wrong taps is 3 stars, catching half is 2 stars.
8. **A missed mastery question comes back at the end,** for practice only (it doesn't count again).
9. **A boy who didn't pass a game last time** gets an easier start next time: fewer letters, and the hint glow from the beginning.
10. **Detective also works by tapping a house,** for boys who find dragging hard.
11. **The opener ends with a short chant,** "Alef, quiet! Beis, b! Veis, v!", twice with a drum beat. It's for boys who learn by rhythm. It isn't a full song; a real nigun for each unit needs your choice of tune.
12. **Locked games show their picture in grey.** The unit path is 3D stepping stones with Unit 1's three letters floating above. The stone to play next glows, and Mendy stands by it.
13. **Letter Hunt:** every hidden letter sits on a plain cream tile, and there is nothing gold or yellow near a hiding place, so nothing can look like the dagesh.
14. **The bonus round hides the home button while letters fall,** so a boy chasing a letter can't leave by accident.
15. **On a computer that can't show 3D,** he gets a clean flat screen with the three letters to tap and hear, plus a note for the teacher. There are no full flat versions of each game.
16. **Find the Mistake has 6 rounds plus 1 demo,** mixing all three letters. If Yaakov was right and the boy said no, he hears why and answers again (that answer doesn't count).
17. **Characters:** Mendy (blue kippah), Tatty (brown beard, black hat, navy jacket), the rebbe (grey beard, black hat and jacket), and Yaakov (red kippah).
18. **Unit 1 has no review round,** because there are no earlier units yet. It starts in Unit 2.

## For the rebbe (every sound and rule used in Unit 1)
- **Letters:** Alef (א), Beis (בּ, with the dagesh) and Veis (ב, no dagesh).
- **Alef is quiet:** "Alef is quiet. It waits for its nekudah." The boy also hears "Abba starts with Alef."
- **Beis says "b"** (its own lone sound). **Veis says "v"** (its own lone sound). No letter says a sound with a vowel ("ba", "baw") in this unit.
- **The dagesh in Beis is taught as "Mendy is the dot inside: someone is home."** Veis has no dot: "nobody home."
- **Words used:** bayis (a house), cheder, sukkah, Abba, Tatty, rebbe, nekudah. No pasuk, no bracha, and no Divine Name anywhere.
- **Temporary:** the letter sounds are the computer voice until the rebbe's own recording is in (see `v2/app/k-kriyah/audio/README.md`).

## Shared changes needed (none made here)
- When the shared sign-in and path (open pull request tashbar-baltimore/tashbar-app#248) is in, it should open `k-kriyah/index.html` for a Kindergarten boy and save the stars each game sends (`{tl2game: 'k-kriyah/u1gN', stars}`) to his record.
- The art style (`ART-DIRECTION.md`) and the 3D kit in `engine.js` (world, people, letters, sparkles) could move into the shared art kit in their own small pull request.
- `v2/FEATURES.md` should list "Kindergarten Kriyah, Unit 1" once it's approved.

## What's next
Unit 2: Gimmel, Daled, Hei (ג ד ה), built the same way with the same game kinds, plus the first review round of Unit 1's letters.
