# Keser Girls 3.0: starter prompt for M. Heinemann (owner)

Open Claude at **claude.ai/code**, start a session on the **tashbar-baltimore/tashbar-app** project, and paste everything in the box below. Use the same prompt every time you sit down to work on Keser Girls 3.0.

```
My name is M. Heinemann. I lead and own Keser Girls 3.0, and I have the final say on everything in it.

WHAT THIS IS
Keser Girls 3.0 is our school's learning app for girls (elementary and middle school): https://keser-girls-3.web.app
Its code is only in the keser/ folder of this project. 1.0 and 2.0 are the boys' apps; they stay as they are, and we may copy pieces from them.
Rabbi Khaver (Head of School), 2026-11-26: "She's gonna be leading and owning this 3.0 edition ... all authorities that are needed to allow anything that's needed and to break any other created rules ... the final deciding ability."
The look we want, in his words: "Make it 3D and immersive. Glam, girlish and exciting. Super glitzy and trendy. Like a hundred graphic designers from the top firms worked on it ... Not wordy, not tacky."

Before anything else, read in this project:
- keser/README.md (the rules, and my role as owner)
- keser/FEATURES.md (every piece and where it stands)
- keser/DECISIONS.md (my decisions so far)
- keser/NEXT-LEVEL-PROMPT.md (the plan and the design bar, piece by piece)
- keser/PICTURE-ORDERS.md (the picture style, the girls' cast, the orders)
- CLAUDE.md (the school's rules for every builder)

HOW WE WORK, EVERY SESSION
Speak to me in short, plain, non-technical sentences. Show me pictures. Ask me only for real decisions, with 2–3 clear choices and your recommendation first.

1. "What are we doing today?"
   - In a few lines, show me what is waiting on me: open Keser pull requests with their look links, questions for me, and pictures that came in. Then show the next pieces on keser/FEATURES.md.
   - Recommend ONE piece small enough to finish today. I choose.
2. Build it.
   - Only in keser/ (and the shared art library art/). Follow keser/README.md and the teaching standard in CLAUDE.md.
   - Add a test in keser/tests/. Run node tests/run.js.
   - Play it as a made-up girl at Chromebook size (1366x768) and phone size. Look at every screen and show me the pictures.
   - Open a pull request that changes ONLY keser/ and art/, starting with one line: what I asked for, in my words.
   - Tell me when its look link is ready. The system posts it on the pull request after the tests pass.
3. I look and tweak.
   - I open the look link on a Chromebook and a phone and tell you what I see. Make my changes on the same pull request. Repeat until I'm happy.
4. Put it in.
   - ONLY when I clearly say "approve it", post one comment on that pull request with exactly this line on its own:
     APPROVED FOR KESER — M. Heinemann
   - First check that nothing changed after the look link I last opened. If something did, give me the new look link first.
   - It is live on https://keser-girls-3.web.app about 5 minutes later.
5. My decisions.
   - When I decide something, or set aside a Keser rule, add a line to keser/DECISIONS.md (the date and my words) in the next pull request.
6. Pictures and graphics.
   - Order them from Rabbi Khaver's image account by email (ask me for the address; never write it in the project): a numbered order list with file names, the screen, the size and the exact prompt (keser/PICTURE-ORDERS.md).
   - Check the inbox for replies. Check every picture against its order and the rules before adding it to art/ with its catalog row ("Keser Girls only").
7. Wrap up.
   - Tell me in 2–3 lines what we did today and what is waiting on me.

ALWAYS
- One piece at a time. Finish it before starting the next.
- Modest and frum in every detail; girls' names, warm frum family life, kosher food. Never the Divine Name (use ה׳). Never the word "bite".
- Real student names, codes or data never go in the code, tests, pictures, pull requests or chat. This project is public.
- Never ask anyone for a password or a 2-step code.
```
