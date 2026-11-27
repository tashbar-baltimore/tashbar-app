# Unit 8 (Shin, Sin, Tav, Sav): builder's notes

**The request, in the Head of School's words:** "UNIT 8: Shin, Sin, Tav, Sav (Moshe in the kitchen; the kitchen painting and pictures are already in art/)". Later decision (HoS): the boys' first language is English, so every picture goes with a letter by the first sound of its **English** name (shoe → Shin), never by a Hebrew word.

**Checked against the map:**
- **Skill:** שׁ "sh", שׂ "s", תּ "t", ת "s". Tells Shin from Sin (the dot's side) and Hei, Ches and Tav apart.
- **Games:** Picture Story, Feel the Shape, Look-Alike Detective (Shin and Sin: the dot; Ches and Tav: Tav's foot), Sound Match, Find the Mistake, then the check, a review and the bonus round.
- **Mastery:** all letters so far, mixed.
- **Story:** the map's shofar and Simchas Torah story is replaced with an everyday one, the kitchen.

## The games, in order (Unit 8 opens when Unit 7's check is passed)
| Stone | Game | What he does |
|---|---|---|
| 1 | Moshe in the kitchen (story) | A shoe turns into Shin ("A shoe! Shoe starts with sh."). Shin's dot hops to the left, and it is Sin. A table turns into Tav; Tav's dot floats away, and it is Sav. Then Shin and Sin side by side (a ring round each dot), then Hei, Ches and Tav side by side (an arrow at each difference), a chant of all 27 letters, and he taps each new one. |
| 2 | Feel the Shape | In Alef-Beis order: Shin (and he taps its dot on the right), Sin (its dot on the left), Tav (an arrow at its foot, and he taps its dot) and Sav. |
| 3 | Look-Alike Detective | He sorts Shin and Sin (the dot's side), then Ches and Tav (Tav's foot). |
| 4 | Sound Match | Shoe and sheep go to Shin, sun and sock to Sin, table, teapot and turtle to Tav. At the end Tav's dot floats away on its stand: "No dot. Now it is Sav! Sav says s, just like Sin." |
| 5 | Find the Mistake | The demo: "Yaakov says this is a Sin" (it is a Shin: the dot is on the right). Then Shin/Sin, Tav/Sav and Sav/Ches rounds. A ring circles the dot; an arrow points at the foot. |
| 6 | Show what you know (mastery check) | 9 questions: Shin beside Sin, Tav and Sav beside Ches, "Which letter says sh?", "Which letter says t?", "Which letter says s?" (with Shin beside Sin), and an older letter. |
| 7 | Review: Look-Alikes | Daled and Reish, then Hei and Kuf: the spaced review of Unit 7. |
| 8 | Bonus: letter rain | Four short rounds: Shin, Sin, Tav, Sav. |

## TODO: pictures still to come (ordered by the coordinator)
Each ordered picture already has its place. Until the file is in `v2/app/k-kriyah/art/obj/`, a simple stand-in shows; the moment the file is there, the painted picture shows by itself (no code change needed; see `pictures.js`, "ordered pictures").
| File to add | Word | Letter | Where it is used | Until it comes |
|---|---|---|---|---|
| `art/obj/shoe.webp` | shoe | Shin | the story's first picture; Sound Match | a simple 3D blue sneaker |
| `art/obj/sheep.webp` | sheep | Shin | Sound Match | the painted lamb (`lamb.webp`) |
| `art/obj/sock.webp` | sock | Sin | Sound Match | a simple 3D striped sock |
| `art/obj/teapot.webp` | teapot | Tav | Sound Match | a simple 3D blue teapot |

Pictures already in `art/obj/` and used: `table.webp` (Tav, story and Sound Match), `turtle.webp` (Tav), `sun.webp` (Sin). `tree.webp` is not used in Unit 8 (seven cards are enough). The kitchen pictures for the earlier Hebrew words (clock, apple, drum, backpack) are no longer used in Unit 8.

After the pictures come: run `KK_SHOTS=1` for `k-kriyah-70-u8-story.js` and `k-kriyah-73-u8-soundmatch.js` at both sizes, look at them, and remake `gallery/u8g0.jpg` and `gallery/u8g3.jpg`.

## Decisions I made on my own (each one line, so you can say yes or change it)
1. **The story is Moshe in the kitchen with Mommy:** he finds his shoe (Shin) and sets the table with Mommy (Tav).
2. **Moshe** wears a light blue kippah, has dark blond hair and a white shirt (to match his ordered painted pictures).
3. **Sin comes from Shin by the dot hopping to the left,** and Sav from Tav losing its dot, the way Fei came from Pei.
4. **Shin's and Sin's dot is its own dot on top, not a dagesh:** in the app it sits above the right head (Shin) or the left head (Sin); Tav's dagesh sits inside.
5. **The words for the dots, the same in every game:** "Shin has its dot on the right. Sin has its dot on the left." "Tav has a dot. Sav has no dot."
6. **Ches and Tav:** "Tav has a foot at the bottom. Ches has no foot." The arrow points at Tav's foot and at Ches's plain leg.
7. **The story also shows Hei, Ches and Tav side by side** (the map's request), with an arrow at each one's difference.
8. **Sav and Ches are also asked together** (Find the Mistake and the check): Sav has no dot, so only the foot tells them apart. Tav beside Ches could be told by the dot alone.
9. **Sound Match stands are Shin, Sin and Tav.** Sav is never a stand beside Sin (both say s); it appears at the end, on Tav's stand. No older letter comes back as a stand this time, because the older picture words are being changed to English on the lower units.
10. **No gold mark ever sits above Shin or Sin,** since it could look like their dot: the story's letters grow instead of getting a star, the bonus stone on the path shows Tav, and on the gold signs (Find the Mistake, the bonus round) Shin and Sin sit a little lower so their dot is on the white, never on the gold frame.
11. **More room around Shin and Sin:** wider gaps in the chant rows and the side-by-side views, so a dot never seems to belong to the next letter or the letter above.
12. **The spaced review ("Remember these?") knows the new look-alikes and sounds:** Shin/Sin, Tav/Sav and Ches/Tav are look-alikes; Samech, Sin and Sav (s) and Tes and Tav (t) never stand together in it.
13. **The review stone is Unit 7's look-alikes** (Daled/Reish, Hei/Kuf), like each unit before it.

## For the rebbe (every sound and rule used in Unit 8)
- **Letters:** Shin (שׁ) says "sh"; Sin (שׂ) says "s"; Tav (תּ) says "t"; Sav (ת) says "s". These are lone sounds, never with a vowel.
- **Names, a question for the rebbe:** the approved map said **Tuf and Suf**; the Head of School has now written **Tav and Sav**, so the app says Tav and Sav. Which names should the boys hear? (It is one word to change everywhere.)
- **Dot rules:** Shin's dot is on top on the right; Sin's dot is on top on the left. Tav has a dot (dagesh) and says t; without the dot it is Sav and says s.
- **Same sounds:** Sin says s, like Samech and Sav. Tav says t, like Tes. The app never asks "which says s?" with two of them on screen.
- **Look-alikes:** Hei's leg doesn't touch the roof; Ches's leg touches the roof; Tav has a foot at the bottom. (For the rebbe: is "a foot" the right word for Tav's bottom left?)
- **Words (English, by the first sound):** shoe and sheep (Shin, sh), sun and sock (Sin, s), table, teapot and turtle (Tav, t). Sav has no picture: a word whose sound is s is taught with Sin. (For the rebbe: should a boy also hear that Shabbos ends with Sav?)
- **Chant order:** Alef, Beis, Veis, Gimmel, Daled, Hei, Vov, Zayin, Ches, Tes, Yud, Kaf, Chaf, Lamed, Mem, Nun, Samech, Ayin, Pei, Fei, Tzadik, Kuf, Reish, Shin, Sin, Tav, Sav.
- **Temporary:** the letter sounds are the computer voice until the rebbe's recording is in. For now it says "shh", "suh" and "tuh"; the rebbe's recording says the lone sounds.

## What's next
Unit 9: the final letters (ך ם ן ף ץ).
