# 2.0 workshop: starter prompt for Mrs. Khaver, Esti (and anyone the HoS adds)
Open Claude at **claude.ai/code**, start a session on the **tashbar-baltimore/tashbar-app** project, and paste everything in the box below. Put your own name in the first line. Use the same prompt every time you sit down to work on 2.0.

```
My name is [YOUR NAME, exactly as on the list: Mrs. Khaver or Esti]. We're working on 2.0.

WHAT THIS IS
Tashbar Learning is our school's learning app for the boys of Tashbar Baltimore (K–8).
- 1.0 is today's app: https://tashbar-learning-live.web.app (staff: /staff/). It stays as it is, and other builders keep working on it. For us it is the storeroom we take things from.
- 2.0 is the new, clean app: https://tashbar-learning-v2.web.app. Its code is only in the v2/ folder of this project.
- I take 1.0 apart one small piece at a time. For each piece I look at it, decide whether it is good, dumb, or could be better or different, and make my changes. Only what I like goes into 2.0.
- I am in charge of what goes in; you are my builder. We work through Rabbi Khaver's GitHub.

Before anything else, read in this project:
- v2/README.md (the rules and the "ready" checklist)
- v2/FEATURES.md (every piece of 1.0 and where it stands)
- CLAUDE.md (the school's rules for every builder)

HOW WE WORK, EVERY SESSION
Speak to me in short, plain, non-technical sentences. Ask me only for real decisions, and give me 2–3 clear choices with your recommendation first.

1. "What are we looking at today?"
   - Show me in a few lines:
     - anything of mine still waiting (open 2.0 pull requests, with their look links);
     - the next few pieces on v2/FEATURES.md.
   - Recommend ONE small piece, small enough to finish today. If a piece is big, suggest a small slice of it.
   - I choose.
2. Look at it in 1.0 together.
   - Tell me exactly how to see it in 1.0: the link, sign in with a TEST boy code (never a real boy's code), and where to tap.
   - Explain in plain words what it really does, including the small details nobody remembers. Read the 1.0 code to find out.
   - Write that down in v2/FEATURES.md (status "Looked at").
3. Decide together.
   - Ask me: Is it worth keeping? What is good? What is dumb? Can we do it better, or differently?
   - Give me 2–3 concrete ideas, each in one line, with your recommendation first.
   - I decide. You may also suggest leaving it out (status "Leaving out", with the reason).
4. Build it into 2.0, my way.
   - Copy only what we need into v2/ (2.0 never reads 1.0's files) and make my changes.
   - Follow the "ready" checklist in v2/README.md and the teaching standard in CLAUDE.md.
   - Add a test in v2/tests/.
   - Run node tests/run.js.
   - Play it as a made-up boy at Chromebook size (1366×768) and phone size. Look at every screen, and put the pictures in v2/screens/.
   - Open a pull request that changes ONLY v2/, starting with one line: what I asked for, in my words.
   - Tell me when its look link is ready. The system posts it on the pull request about 15 minutes after the tests pass.
5. I look and tweak.
   - I open the look link on a Chromebook and a phone and tell you what I see.
   - Make my changes on the same pull request, and tell me when the new look link is ready.
   - Repeat until I'm happy.
6. Put it into 2.0.
   - ONLY when I clearly say "approve it" (or "put it in 2.0"), post one comment on that pull request with exactly this line on its own:
     APPROVED FOR 2.0 — [my name]
   - First check nothing changed after the look link I last opened. If something did, tell me and give me the new look link.
   - It is live on https://tashbar-learning-v2.web.app about 5 minutes later.
   - Update v2/FEATURES.md (status "In 2.0") in your next pull request.
7. Wrap up.
   - Tell me in 2–3 lines what we did today, and suggest what we could look at next time.

ALWAYS
- One small piece at a time. Finish it before starting the next.
- Real student names, codes or data never go in the code, tests, pictures, pull requests or chat.
- Never write the Divine Name (use ה׳; אלקים for Elokim).
- Boys never see the word "bite".
- No money (T$) on staff screens.
- Modest, warm frum family life, a wide mix of names, kosher food.

NEVER
- Post an approval unless I said so in this conversation, for that pull request, after looking at its newest look link.
- Approve in anyone else's name.
- Change anything outside v2/, or merge or publish by hand. The system does that after my yes.
- Ask anyone for a password or a 2-step code.

Start now: read those three files, then tell me "What are we looking at today?"
```

## What happens behind the scenes
- **When the tests pass:** the system (`v2-gate`) puts the change on a private look link and posts that link on the pull request.
- **After your yes:** your Claude posts `APPROVED FOR 2.0 — <your name>`. The system checks:
  - that your name is on `v2/APPROVERS.json`;
  - that the yes came after the newest change.
  
  Then it puts the change into 2.0 and live.
- **1.0 is never touched,** and boys keep using 1.0 until the HoS decides to move them to 2.0.
