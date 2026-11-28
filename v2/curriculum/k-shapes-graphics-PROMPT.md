# K Shapes 2.0: overnight graphics prompt (Esti, 2026-11-24)

Paste everything below the line into Claude Code (a cloud session on `tashbar-baltimore/tashbar-app`).

---

You are the art team for Kindergarten Shapes in Tashbar Learning 2.0. Read `CLAUDE.md`, `v2/README.md` and the top of `v2/app/k-shapes/kit.js` and `v2/app/k-shapes/look.js` first.

**What Esti wants, in her words:** "The graphics have to be 1,000 times better: sharper, higher quality, colorful, a whole other world. A happy world that expands the brain and is pleasant and exciting to look at. It should look like a team of graphic designers worked on it."

**Where things are**
- 23 games, 12 units, all built on the shared 3D engine `v2/app/k-shapes/kit.js` (three.js r160 in `lib/`).
- The new look lives in `v2/app/k-shapes/look.js`. A game switches it on with `world: '<name>'` in its config (Find the triangles already has `world: 'playroom'`).
- Branch: `claude/v2-k-shapes-graphics` (made from `claude/v2-k-shapes-unit12`). Keep working on it. Its pull request has the look link.

**The bar: a top kids' animated film or premium kids' app, not "a nicer version of what was there"**
1. **Sharp:** no blurry or jagged edges on a Chromebook (1366×768) or a phone. Draw at high detail, use smooth geometry (many segments, rounded bevels) and crisp textures.
2. **Color:** bright, rich, happy toy colors; glossy shapes that catch the light; soft colored shadows. Never dull, gray or washed out.
3. **Light:** warm sunny glow, soft shine on every shape, rim light, sparkles and star bursts for right answers.
4. **Worlds:** each unit gets its own beautiful, imaginative world with depth and detail, a soft blurry background and things gently moving. Make them happy and wonder-filled, for example a candy-colored toy land, a sunny garden full of giant flowers, a floating island in the clouds, a bright toy train town, a starry space playground, an underwater bubble world, a bakery. **Do not force a Jewish theme into the worlds.** It is a shapes game, so the worlds should simply be joyful and exciting.
5. **Characters:** loveable and friendly, like a good animated film for little kids. Keep them modest and warm (the school's standard). They are a small part of the picture: the world and the shapes are the stars.
6. **Motion:** smooth and bouncy. Squash and stretch on landing, wiggling boxes, gliding camera, confetti and stars. Never choppy. A slow Chromebook gets simpler effects, never a slower game.
7. **Keep everything that works:** the teaching, the voice, the order of each game, the tests, buttons of 64 px or more, no reading needed. Change only how things LOOK.

**How to work (all night, without waiting to be asked)**
- **Keep working until about 9:00 am (Baltimore time) without stopping or waiting for a reply.** When one piece is done, pick the next one and carry on. Do not ask questions overnight. Make sensible choices and write them down for Esti.
- Order: first make Find the triangles stunning. Then build one world per unit and bring every game over to the new look (`world:` in each game, plus any mode-specific art in `look.js` and `kit.js`).
- After each real step: run that unit's test (`v2/tests/k-shapes-unitN.js`), play it as a made-up boy at 1366×768 and 390×844, **look at every screen**, fix what looks off, then commit and push. Pushing updates the look link.
- Before stopping: `node tests/run.js` must pass completely. Only change files under `v2/`.
- **Never** post `APPROVED FOR 2.0`, never merge, never publish by hand. Esti approves after she looks.

**When Esti checks in, have ready**
- The look link (on the pull request) for the newest version.
- Before and after pictures at Chromebook and phone size for every game you changed, in the pull request.
- A short, plain list: what changed, which games have the new look, and anything you were not sure about.
- Exactly which pictures from ChatGPT would help (if any), for example a painted sky or a world backdrop, with the size and style.
