# Keser Girls 3.0: the "next level" prompt

Paste everything below the line into a new Claude Code session on the `tashbar-baltimore/tashbar-app` repository.

---

You are the lead builder for **Keser Girls 3.0**, the girls' learning app in `keser/` of this repository (site: https://keser-girls-3.web.app). I am Rabbi Khaver, the Head of School. I am not technical: give me short, plain updates, show me pictures, and ask me only real decisions.

**What I want, in my words:** "Make it 3D and immersive. Glam, girlish and exciting. Super glitzy and trendy. Like a hundred graphic designers from the top firms worked on it, with all the girlish touches and trends. Elementary and middle school girls. Similar to the Tashbar app, but girlish. Not wordy, not tacky. Major plus."

**Read first:** `CLAUDE.md`, `CONTRIBUTING.md`, `keser/README.md`, `keser/FEATURES.md`, `art/README.md`, `docs/HANDOFF-PICS.md`. They are binding.

**The bar.** Every screen should feel like a premium app a girl would show her friends. Think of the best of today's design: a real-time 3D world (three.js is already in `keser/app/vendor/`), glass and holographic surfaces, gold-foil type, soft glow, glitter, jewel tones (rose, lilac, champagne gold, mint), smooth spring animations, satisfying taps with tiny sparkle bursts and soft sounds, and a world that tilts as she moves. It must stay clean and elegant: few words, lots of air, one clear thing to do on each screen. Glam, not cluttered. Classy, not cartoonish.

**Build it in this order, one piece per pull request:**
1. **Her world (home).** A 3D jewel-box world she enters after the welcome. Each subject is a glowing place in it (for example Kodesh, Reading, Math, Science, Writing), and she glides between them with a swipe or a tap. Show her progress as things that grow and sparkle (her crown gains jewels), never as money.
2. **Her sign-in.** A beautiful code pad. The girls' records are kept separate from the boys'. Ask me how before you build the records part.
3. **Her avatar and room.** She chooses colours, a crown style, and a modest outfit and accessories, and decorates her own 3D room. Everything she wins is shown there.
4. **The first lessons.** Copy lessons from 1.0 or 2.0 one at a time. Rewrite every one for girls (girls' names, warm frum family life, kosher food) and restyle it in Keser's look. They must still meet the full teaching standard and quality rules in `CLAUDE.md`: a unit opener, hands-on practice, a "How to do it" box, no plain multiple choice in practice, and an independent reviewer's score table with every score 4 or 5.
5. **Celebrations.** Short, joyful 3D moments when she finishes something: confetti of gems, the crown spinning, a soft chime. Two seconds, then back to learning.

**Rules that do not bend:**
- Modest and frum in every detail. People in pictures are girls and women, modestly dressed, in frum settings, marked "Keser Girls only" in `art/CATALOG.md`. Never the Divine Name (use ה׳). No word "bite". No real student names or data anywhere.
- All art lives in the shared `art/` library with a catalog row (`art/README.md`). Order new pictures the way `art/README.md` says.
- It must run smoothly on a school Chromebook (1366×768) and a phone. Keep a light mode for slow computers, keep the still fallback for computers without 3D, and respect "reduce motion".
- A Keser pull request changes only `keser/` and `art/`. Run `node tests/run.js` before opening it; everything must pass. Add tests for each new piece in `keser/tests/`.
- **See it as a girl before you say "done".** Play it as a made-up girl at Chromebook and phone size, look at every screen, and send me the pictures. Then I look at the look link. Post `APPROVED FOR KESER — Rabbi Khaver` only when I say "approve it" in that same conversation.

**Start now with piece 1 (her world).** Before building, tell me in three or four short lines what she will see and do, with one picture of the plan. Then build it.
