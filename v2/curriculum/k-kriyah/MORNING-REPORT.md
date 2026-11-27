# Morning report: Kindergarten Kriyah, Unit 1 (for Esti, 9:30)

## 1. Where to look, and where to tap
- **The pull request:** https://github.com/tashbar-baltimore/tashbar-app/pull/258. All tests pass on it.
- **The look link could not be made.** It isn't this pull request's fault: the 2.0 website (`tashbar-learning-v2`) doesn't exist in Firebase yet, and every 2.0 look link since #248 has failed the same way.
  - The Head of School can fix it in a minute. Go to console.firebase.google.com, then project **tashbar-learning-live**, then **Hosting**, then **Add another site**, type `tashbar-learning-v2` and tap **Add**.
  - Then the look link appears on the pull request by itself. The steps are also in a comment there.
- **So you can look this morning anyway,** there is a private preview of the same games: https://claude.ai/artifact/QzuVDEKRC89ziKCkAP68gj
  - It opens in Claude for the account this was built in (2.0d@tashbarbaltimore.org). If you use a different account, share it from the page's Share menu.
  - The approval itself still needs the look link (the 2.0 rules).
- **Where to tap:**
  1. Unit 1's path shows seven stepping stones. **Tap the glowing pink stone** (with the little house), then the big green ▶ button, to start Mendy's story.
  2. Each game ends with stars, then a big green arrow to the next game.
  3. The house button, top right, goes back to the path. The speaker button, top left, says the last line again.
- **Turn the sound on.** Everything is spoken; nothing needs reading.
- A new stone opens only after 2 stars on the one before it, just as for a boy.

## 2. What's broken or not finished (first, honestly)
- **The letter sounds are the computer voice for now.**
  - It says "buh" for Beis and "vuh" for Veis, because a computer can't say a lone "b". That is close to the letter-with-a-vowel sound you ruled out.
  - It's marked on screen as temporary, and the rebbe's recording replaces it with no code change. **Esti decided (2026-11-23): keep "buh"/"vuh" until then.**
- **The rebbe's recording did not reach me.** His reply goes to your Gmail. This session can only read 2.0d@tashbarbaltimore.org, where nothing has arrived (not even the onboarding email). When it comes, forward it to 2.0d, or follow `v2/app/k-kriyah/audio/README.md`.
- **The chant at the end of the story is a simple spoken rhythm with a drum** ("Alef, quiet! Beis, b! Veis, v!"). It isn't a real nigun; that needs you to choose a tune.
- **A boy who keeps getting 1 star can keep replaying** (each time with an easier start), and no teacher is told. One line to decide: after 3 tries, open the next game anyway, or flag it for the teacher?
- **On a computer that can't show 3D,** a boy gets a clean flat screen with the three letters to tap and hear, not full flat versions of the games.
- **I played everything in a test browser.** The 3D was slow there (software drawing), so I could only judge smoothness from the pictures. Please try it on a real school Chromebook.

## 3. What's finished: what the boy sees and hears
1. **Mendy's first day** (the opener):
   - Tatty walks Mendy to cheder, and the rebbe shows him Alef ("Abba starts with Alef. Alef is quiet.").
   - The house turns into Beis, and Mendy becomes the dot. Mendy goes out to play: no dot, Veis.
   - A short chant, then he taps each letter.
2. **Look-Alike Detective:** he drags each letter to its house. Beis goes to the house where Mendy is home (the dot); Veis goes to the empty house.
3. **Feel the Shape:** he runs his finger along a glowing road on each big letter (touch only, not writing). On Beis he taps Mendy's dot.
4. **Letter Hunt:** he finds every Beis, then every Veis, hidden around the sukkah.
5. **Find the Mistake:** "Yaakov says this is a Beis. Is he right?" He taps ✓ or ✗, then fixes Yaakov's sign.
6. **Show what you know:** 9 "hear it, tap it" questions. This is the unit's check, and 2 stars passes.
7. **Bonus, letter rain:** for quick boys (opens at 3 stars on the check). He catches the falling letters.

Every game:
- starts with "Watch me… now you!";
- answers a mistake kindly, says why, and lets him try again;
- quietly gets easier when he struggles.

**Checked:**
- All tests pass, including every Kriyah game at Chromebook and phone size.
- I looked at every picture at both sizes; they are in the pull request.
- An independent reviewer scored every game 4 or 5 on all 9 points; the table is in the pull request.

## 4. Decisions I made on my own (yes, or change it)
They are in `v2/curriculum/k-kriyah/UNIT1-NOTES.md`, "Decisions I made on my own", one line each. The main ones:
1. The bonus round opens only at 3 stars on the mastery check.
2. Feel the Shape uses a glowing road, not dots (dots could look like the dagesh). He can start anywhere, so it isn't writing.
3. Nothing gold or round sits near a letter in Letter Hunt; each letter is on a plain tile.
4. Letter Hunt is in a sukkah, because Unit 1 is in Tishrei.
5. Star cut-offs for each game (listed in the notes). Always tapping one button can't pass Find the Mistake.
6. On a phone, the mastery check doesn't show the rebbe (no room).

## 5. The rebbe's recording
It did not arrive here (see section 2). The games already play his recording the moment it's added, and use the computer voice until then. I did not write to him.

## 6. Shared changes needed (I didn't make them)
- The shared sign-in and path (tashbar-baltimore/tashbar-app#248) should open `k-kriyah/index.html` for a Kindergarten boy and save the stars each game sends.
- The 3D kit (`engine.js`) and `ART-DIRECTION.md` could move into the shared art kit.
- `v2/FEATURES.md` should list "Kindergarten Kriyah, Unit 1" once it's approved.

## 7. What's next
Unit 2: Gimmel, Daled, Hei (ג ד ה). It uses the same game kinds, plus the first review round of Alef, Beis and Veis.
