# Unit 2 (Gimmel, Daled, Hei): builder's notes

**The request, in Esti's words:** "Start Unit 2 and continue working."

**Checked against it:** Unit 2 from the approved map. Story: Shloimy and Zeidy, gefen and dag. Games: Picture Story, Feel the Shape, Sound Match, Alef-Beis Train (Alef to Hei), Find the Mistake. Mastery: all 6 letters, mixed. Built in the same 3D look as Unit 1, with the unit's review round at the end.

## Where it is
- The same folders as Unit 1. Unit 2 is `index.html?u=2`, and its games are `play.html?g=u2g0` to `u2g7`.
- **`units.js`** now lists every unit and its games, so the path, the games and the tests all read one list. Adding Unit 3 is mostly adding its games there.
- **`pictures.js`** holds the 3D pictures for "starts with" games: grapes, gelt, fish, dreidel, Havdalah candle, mountain and house.
- **`letters.js`** now has the shape of every letter, including the final letters, for the units still to come.

## The games, in order (a game opens at 2 of 3 stars)
Unit 2 opens when Unit 1's mastery check is passed.

| Stone | Game | What he does |
|---|---|---|
| 1 | Shloimy visits Zeidy (opener story) | The grapes turn into Gimmel, the fish into Daled and the Havdalah candle into Hei. Then a chant of all six letters, and he taps each new one. |
| 2 | Feel the Shape | Runs his finger along the glowing road on Gimmel, Daled and Hei. |
| 3 | Sound Match | Drags each picture (gefen, gelt, dag, dreidel, Havdalah candle, har) to the letter it starts with. |
| 4 | Alef-Beis Train | Puts the letter cars on the train in order, Alef to Hei, while the chant plays. Round 2 fills the gaps. |
| 5 | Find the Mistake | "Yaakov says this is a Gimmel. Is he right?" Taps ✓ or ✗, then fixes Yaakov's sign. |
| 6 | Show what you know (mastery check) | 9 "hear it, tap it" questions over all six letters. Each question shows a new letter and an older one. |
| 7 | Review: Beis and Veis | A short Look-Alike Detective round, the unit's spaced review of Unit 1's hardest skill. |
| 8 | Bonus: letter rain | For quick boys (opens at 3 stars on the check): catch Gimmel, then Daled, then Hei. |

## Decisions I made on my own (each one line, so you can say yes or change it)
1. **Hei's picture is a Havdalah candle** ("Motzei Shabbos, Zeidy makes Havdalah"). The map named only gefen and dag. Only the candle is shown, never the bracha.
2. **Sound Match pictures:**
   - Gimmel: gefen (grapes) and gelt (Chanukah coins).
   - Daled: dag (fish) and dreidel.
   - Hei: Havdalah candle and har (mountain).

   He hears "Gefen starts with g," as Part B allows for matching games (Shin goes with the shofar). Each picture is a separate 3D object, never next to a letter.
3. **The computer voice says "guh", "duh" and "huh"** for the new sounds, like your "keep buh" decision, until the rebbe's recording arrives.
4. **Train order:** Alef, Beis, Veis, Gimmel, Daled, Hei, the way the boys sing it in cheder (Beis and Veis both, one after the other).
5. **The Train goes to the left,** the way Hebrew reads. Round 2 has gaps to fill, so he places letters in the middle of the order, not only at the end.
6. **"What to look for" words in Find the Mistake:** Gimmel has a foot, Daled has a long roof (no little leg), and Hei has a little leg.
7. **The unit's review round is Beis and Veis sorting** (6 letters), Unit 1's hardest skill. The mastery check already mixes all six letters.
8. **The mastery check shows three letters for each question:** the answer, one other new letter and one older letter. Beis is always shown beside Veis.
9. **The path shows one unit at a time.** A round button with the unit's letters (א–ב, ג–ה) goes to the other unit. The next unit's button appears only when it's open.
10. **After Unit 1's mastery check, the green arrow goes on to Unit 2's story.** Unit 1's bonus stays on Unit 1's path.

## For the rebbe (every sound and rule used in Unit 2)
- **Letters:** Gimmel (ג) says "g", Daled (ד) says "d", Hei (ה) says "h". These are their own lone sounds, never said with a vowel.
- **Words:**
  - gefen (grapevine), gelt (Chanukah coins), dag (fish), dreidel, Havdalah, har (mountain), Zeidy, Motzei Shabbos.
  - "Gefen starts with g" and the like are used only in matching, as Part B allows.
- **Order chanted:** Alef, Beis, Veis, Gimmel, Daled, Hei.
- **Havdalah:** only the candle is shown, respectfully. No bracha text, no pasuk, no Divine Name.
- **Temporary:** the letter sounds are the computer voice until the rebbe's recording is in.

## Shared changes needed (none made here)
- The same as Unit 1: the shared path (#248) should open `k-kriyah/index.html` for a Kindergarten boy and save each game's stars.

## What's next
Unit 3: Vov, Zayin, Ches (ו ז ח), the first look-alike unit (ו/ז, ה/ח). It needs Detective and Letter Hunt made general, as Unit 2 did for the other games.
