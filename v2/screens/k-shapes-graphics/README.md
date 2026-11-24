# Kindergarten Shapes: before and after pictures

One folder per game. In each: `before-chromebook.jpg`, `after-chromebook.jpg` (1366×768) and `before-phone.jpg`, `after-phone.jpg` (390×844).
Each sheet shows the screens a boy sees, in order: start, lesson, find, drop, mistake, end (some games show 4 or 5 of them; see the pull request).

- **before**: the first look (Find the triangles: the original plain room).
- **after**: the new look, each unit in its own world with a painted backdrop.

Made with `shoot.js` (plays each game as a made-up boy, through its unit test, in picture mode `?fast=1&shot=1`) and `sheets.py`.
In picture mode the game runs at test speed, so a few in-between moments (like confetti) can look slightly different from real play.
