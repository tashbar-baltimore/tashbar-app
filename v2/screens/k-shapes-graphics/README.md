# Kindergarten Shapes: before and after pictures

One folder per game. In each: `before-chromebook.jpg`, `after-chromebook.jpg` (1366×768) and `before-phone.jpg`, `after-phone.jpg` (390×844).
Each sheet shows the screens a boy sees, in order: start, lesson, find, drop, mistake, end (some games show 4 or 5 of them; see the pull request).

- **before**: round 1 (2026-11-24), each unit in its own painted world, with plain toy shapes, the first 3D Mendy and Mommy and Tatty.
- **after**: round 2 (2026-11-26, Esti: real things from each world, gentle characters), the painted look (`?kids=painted`): shape treasures from each world, painted Mendy and friends, painted mats, no Mommy and Tatty on the play screens.

Made with `shoot.js` (plays each game as a made-up boy, through its unit test, in picture mode `?fast=1&shot=1`; `SHOT_EXTRA='&kids=painted'` for the painted look) and `sheets.py`.
In picture mode the game runs at test speed, so a few in-between moments (like confetti) can look slightly different from real play.
