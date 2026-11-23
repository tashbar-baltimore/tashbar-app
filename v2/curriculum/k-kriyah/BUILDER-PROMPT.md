My name is [YOUR NAME]. We are building Tashbar Learning 2.0. Read this whole message before doing anything. It is binding for every session and every builder.

=====================================================================
PART 1. WHAT WE ARE DOING
=====================================================================
- 2.0 is rebuilt FROM SCRATCH, starting with the very first skill of Kindergarten.
- 1.0 is NOT a source of code or content for 2.0. You may look at 1.0 only to learn what went wrong or for an idea. Nothing is copied from it.
- We build one subject at a time, one unit at a time, in skill order. THIS SESSION'S SUBJECT: KINDERGARTEN KRIYAH (the Alef-Beis and first nekudos), a complete school year, from day 1 to a real graduation. (Other sessions are building other subjects; see Part 7.)
- I am in charge. You are the builder. I approve every plan before you build it and every piece before it goes in.
- Before anything else, read: CLAUDE.md, v2/README.md, v2/FEATURES.md, v2/APPROVERS.json. Then tell me in 3 lines where things stand.

THE ONE-LINE GOAL (check every piece against it):
"Fun, easy, skill-building games that teach every kind of boy real skills, one step on top of the next, all year, until he graduates."

=====================================================================
PART 2. THE ORDER OF WORK (never skip a step)
=====================================================================
STEP A. RESEARCH (before any building, once per subject)
- Research how 5- and 6-year-old boys best learn the Alef-Beis and first Kriyah. Use the strongest sources: how chadarim and Kriyah programs teach (letter-by-letter, look-alike letters taught apart, the order of letters and nekudos), Hebrew-reading research for young children, phonemic awareness for Hebrew sounds, multisensory methods (see it, say it, trace it), picture and story mnemonics for each letter, letter formation, blending a letter with a nekudah (בּ + ָ = "baw"), memory techniques (spaced review, retrieval, interleaving), and Universal Design for Learning.
- KODESH RULES: use the pronunciation and nekudos sounds this school uses. If you are not sure (for example the sound of kametz, or tav vs. sav), ASK ME, and list it as a question for the rebbe. Never guess. Everything in Kodesh is reviewed by a rebbe after it is live; write a short "for the rebbe" note in the pull request listing every sound and rule used.
- Also collect the best tricks and methods used anywhere in the world (Singapore, Japan, Montessori, Math Recovery, etc.).
- Give me a SHORT research summary in plain words: the 10–15 most powerful methods, what each one is, and which kinds of learners it helps (seeing, hearing, moving, touching, music, slow-and-steady, quick).
- Name your sources. Never invent a study or a statistic.

STEP B. THE FULL-YEAR MAP (I approve it before any game is built)
- A full-year Kindergarten Kriyah curriculum: units in order, each unit's skills in order, each skill building on the one before.
- For each unit: the skill in one line, the standard it meets, the games that teach it, the trick or method each game uses, and the check that shows the boy has mastered it.
- Include where the review rounds come back (spaced review of earlier skills) and the end-of-year graduation.
- One page per unit at most. Plain words. Save it as v2/curriculum/k-kriyah/MAP.md.
- Starting skeleton to refine with the research (change it if research says so, and tell me why):
  1. Listening for sounds in Hebrew/Yiddish words he knows (first sound of "Shabbos", "challah")
  2. First letters, a few at a time (for example א ב ג ד): see it, say it, trace it, a picture story for each
  3. Look-alike letters taught apart, side by side (ב/כ, ד/ר, ה/ח/ת, ו/ז, ג/נ, ט/מ, ס/ם)
  4. The rest of the Alef-Beis, a few at a time, with constant review of earlier letters
  5. Dagesh letters (בּ/ב, כּ/כ, פּ/פ, תּ/ת) and the final letters (ך ם ן ף ץ)
  6. Writing the letters (trace with a finger, the path)
  7. First nekudos: kametz and patach with each letter (say the sound together)
  8. More nekudos, one at a time, each used right away with known letters
  9. Reading two-letter, then three-letter combinations, slowly and smoothly
  10. Reading short familiar words (from brachos, Shabbos, Yom Tov) once the letters and nekudos are known
  11. Graduation: a celebration review of the whole year, then a certificate screen
- Ask me to approve the map. I may change it. Do not build until I say "the map is approved".

STEP C. BUILD ONE UNIT (one unit = one pull request)
- Start with ONE game, so I can approve the look and feel. Then build the rest of the unit the same way.
- Each unit has: the unit opener (a short, warm, patient lesson that shows and tells what we are learning), then the games in order, then a mastery check, then a review round of earlier units.

STEP D. SEE IT AS A BOY, THEN SHOW ME
(rules in Part 5)

STEP E. I LOOK, WE TWEAK, I APPROVE
(the look link + /compare/; only my "approve it" puts it in)

=====================================================================
PART 3. HOW EVERY GAME MUST TEACH (the teaching rules)
=====================================================================
1. ONE SKILL PER GAME. Every game teaches one named skill from the map. If a screen, animation or sound does not help that skill, take it out.
2. SEE, SAY, TRACE, READ. Start with the sound and a picture story, then the letter inside the picture, then the plain letter, then the letter with its nekudah. Look-alike letters are always taught side by side, with the difference pointed out.
3. EVERY KIND OF LEARNER, IN EVERY UNIT:
   - Seeing: a picture story for each letter, the difference between look-alike letters highlighted in color.
   - Hearing: every letter and nekudah sound spoken clearly, in the school's pronunciation.
   - Moving: trace letters with a finger, "show the shape with your hands", tap along while reading.
   - Music and rhythm: an Alef-Beis song or nigun-style chant for each unit.
   - Story: a short, warm story from frum family life, Shabbos and Yom Tov.
   - Slow learners get more steps and more help; quick learners get a harder "bonus" round. Nobody is stuck, nobody is bored.
4. NO READING NEEDED. A Kindergarten boy cannot read. Every instruction is spoken, with a big "hear it again" button. Pictures carry the meaning.
5. SHOW, THEN TRY. Every game starts by SHOWING how to do it (a short demo with voice: "Watch me... now you!"). This is the "How to do it" box for K.
6. SHORT AND CLEAR. Spoken lines are 12 words or fewer. One instruction at a time.
7. MISTAKES TEACH. A wrong answer is never just "wrong". Show him why, kindly, and let him try again. Include at least one "find the mistake" game per unit ("Yaakov said this letter is a ד. Is he right?").
8. MASTERY BEFORE MOVING ON. The next game opens only when he shows he can do it (2 stars of 3). If he struggles, the game quietly gets easier and gives more help.
9. REVIEW COMES BACK. Earlier skills return in short review rounds (spaced review), mixed together, so he never forgets.
10. NO PLAIN MULTIPLE CHOICE. He builds, drags, traces, sorts, matches, and moves along a path. Tap-to-check is fine for checks.
11. SHORT SESSIONS. A boy can finish a game in 2–4 minutes. A day's work is 10–15 minutes.
12. KODESH CARE. Never write the Divine Name, in any spelling, even in practice words (use ה׳; אלקים for Elokim). No pasuk or bracha is shown in a game way that is not respectful. Use the school's pronunciation; ask me when unsure. A rebbe reviews it after it is live.
13. REAL SKILLS ONLY. No time-wasting screens, no long cartoons, no "fluff". Celebrations are short (2 seconds) and then back to learning.

=====================================================================
PART 4. LOOK, FEEL AND VALUES
=====================================================================
- BEAUTIFUL: bright, clean, modern, one consistent art style across all of 2.0. Big pictures, smooth motion, happy sounds. Better than any learning app he has seen.
- Original art only (drawn by you as SVG or approved images). No characters, music or art from other apps, shows or games.
- FULL SCREEN, one game at a time, giant buttons (at least 64 pixels), works by touch and by mouse, no pop-ups, no menus to get lost in, no ads, no links out.
- Works on a school Chromebook (1366×768) and a phone. Loads fast. Works with slow Wi-Fi.
- Warm, modest, normal frum family life: Tatty, Mommy, Bubby, Zeidy, shul, Shabbos table, sukkah, cheder. A wide mix of names (Mendy, Shloimy, Yaakov, Ari, Dovid, Eli, Avi, Tzvi, Moshe, Chaim...). Kosher food only.
- Never write the Divine Name (use ה׳; אלקים for Elokim).
- Boys never see the word "bite".
- No money (T$) on staff screens. The server sets every money amount.
- Real student names, codes or data never go in code, tests, pictures, pull requests or chat. Only TEST codes.

=====================================================================
PART 5. GUARDRAILS (so we never repeat the old mistakes)
=====================================================================
1. MATCH THE REQUEST. Before building, write in one line what I asked for, in my words. When done, check the finished thing against that line. A nearby idea is not the request.
2. NO RUNAWAY BUILDING. Build only what is on the approved map, and only your own subject. No extra features, menus, rewards, stores, points, characters or screens unless I asked. If you have a good idea, SUGGEST it in one line; do not build it.
3. SMALL PIECES. One unit per pull request. One game first when it is a new kind of game.
4. NEVER SAY "DONE" UNTIL YOU HAVE SEEN IT WORK.
   - Play every game yourself as a made-up boy, from sign-in to the end, at Chromebook size and phone size.
   - Take pictures of: the sign-in, the path, the unit opener, EVERY game at its start, in the middle, after a wrong answer, and at the end.
   - LOOK at every picture. A blank, white, half-loaded or frozen screen is a failure, even if the tests pass. (In the first try, the game was a blank white screen with only a voice and an X. That must never happen again.)
   - Check sound plays, the voice matches the screen, and nothing is cut off.
   - Tell me what the boy SEES and HEARS, not that "the tests passed". If you could not look at something, say so plainly.
5. AUTOMATIC TESTS FOR EVERY GAME in v2/tests/: it loads, it shows real content (not blank), it can be won, a wrong answer is handled, it saves, the next game unlocks. `node tests/run.js` must pass.
6. INDEPENDENT REVIEW. Before I look, a fresh reviewer (one that did not build it) scores each game 1–5 on: (a) teaches the named skill, (b) right for age 5–6, (c) builds on the last step, (d) every kind of learner, (e) show-then-try, (f) mistakes teach, (g) fun, (h) looks beautiful, (i) values and safety. Only show me games where every score is 4 or 5. Put the table in the pull request.
7. ONLY v2/. Never change anything outside v2/. Never merge or publish by hand.
8. APPROVAL. Post "APPROVED FOR 2.0 — [my name]" ONLY when I say "approve it" in this conversation, for that pull request, after I looked at its newest look link. Never for anyone else. If anything changed after I looked, tell me and give me the new link.
9. NO GUESSING. If you are not sure what I want, ask me one short question with 2–3 choices, your recommendation first.
10. HONESTY. Never invent research, test results or pictures. If something is broken, say so first.

=====================================================================
PART 6. HOW YOU TALK TO ME
=====================================================================
- Short, plain, non-technical sentences. No code words.
- Ask me only for real decisions, with 2–3 choices and your recommendation first.
- When a look link is ready, give me the /compare/ link and tell me exactly where to tap.
- At the end of each session: 2–3 lines on what we did, and what is next.

=====================================================================
PART 7. WORKING NEXT TO OTHER SESSIONS (several subjects are built at the same time)
=====================================================================
- Other sessions are building other Kindergarten subjects at the same time (Numbers, ABC, Kriyah, Shapes). Stay in your own lane.
- Your subject's files live ONLY in: v2/curriculum/k-kriyah/ (the map and notes), v2/app/k-kriyah/ (the games), v2/tests/k-kriyah-*.js (the tests), v2/screens/k-kriyah/ (the pictures).
- Your branch name starts with claude/v2-k-kriyah-. Your pull requests change only your own folders.
- SHARED PARTS (sign-in, the boy's path/home, the art style and sounds kit, v2/app/index.html, v2/app/core.js, v2/FEATURES.md, v2/README.md) belong to everyone. Do not change them inside your subject's pull request. If your subject needs a shared change, tell me in one line; it gets its own small pull request that I approve by itself.
- Before you start, look at the open 2.0 pull requests and what is already in v2/, so you match the art style and do not repeat another session's work.

=====================================================================
START NOW
=====================================================================
Read the files in Part 1. Then do STEP A (research summary for Kindergarten Kriyah) and show it to me. Do not build anything yet.
