# Visual Support Plan: S.U08 "Ancient Empires and Eretz Yisroel" (Grade 6 Social Studies, Unit 1)

Rules: `docs/VISUAL-SUPPORT.md`. Reviewed 2026-11-27, page by page.

## 1. Unit, book and pages
- Book: The Beacon newsroom articles (cast: Gavriel, Yoni, Eli, Akiva, Benny, Mr. Gross).
  - `S.ANCI6.01` "The Land at the Center": p1 the land and its neighbors, p2 the waters, p3 Mitzrayim and the Nile.
  - `S.ANCI6.02` "Four Kingdoms": p1 Bavel and Persia, p2 Greece and Chanukah, p3 Rome and the Churban.
  - `S.ANCI6.03` "Guarding the Oral Torah": p1 Sinai to Yavneh, p2 the Mishnah, p3 the Gemara in Bavel.
- Lessons: `src/CoreDataS8.html` (SS.GEO.L07.01, SS.HIST.L07.01–04, SS.JHIST.L07.01). Unit check and map project: `src/CoreDataS11.html`, unit `S.U08`, project `S.PROJ6.SS1` "The Map of the Four Kingdoms". Skill question banks: `packs/SocialMore.html` and others.
- Today the unit has **no map, timeline or diagram the boy builds**. The only picture is the painted relief map `core-map-eretz-yisroel` (sea, Kinneret, Jordan River, Dead Sea; no borders, no neighbors), shown as the opener picture.

## 2. Flagged sections

| # | Text | Visual | Priority |
|---|---|---|---|
| V1 | S.ANCI6.01 p1: three continents, the sea on the west, four neighbors | Build-along map of Eretz Yisroel and its neighbors | **HIGH** |
| V2 | S.ANCI6.01 p2: Kinneret, Jordan River, Dead Sea | Same map, waters added; side view of the river going downhill | **HIGH** |
| V3 | S.ANCI6.01 p3: Mitzrayim and the Nile | Same map, extended southwest; the Nile's year as a 4-step cycle | **HIGH** |
| V4 | S.ANCI6.02 all pages: where the four kingdoms were | Wider map: Bavel, Persia, Greece, Rome around Eretz Yisroel | **HIGH** |
| V5 | S.ANCI6.02 all pages: the order of the four kingdoms | Timeline built card by card, before/after labels | **HIGH** |
| V6 | S.ANCI6.03: the chain of the Oral Torah | Timeline / chain from Har Sinai to the Gemara | MEDIUM |
| V7 | S.ANCI6.03 p2–3: Mishnah and Gemara, Tannaim and Amoraim | Side-by-side chart | MEDIUM |
| V8 | S.ANCI6.02 p3: the Kosel is part of the wall around the Har Habayis | Labeled diagram of the Har Habayis | MEDIUM |
| V9 | S.ANCI6.01 p1: why empires wanted the land | Cause-and-effect chain | MEDIUM |
| V10 | Unfamiliar objects: papyrus, pyramid, cedar, Roman road and arch | Labeled picture next to the word | LOW |
| V11 | Size: "a narrow land, much smaller than most of its neighbors"; "one of the longest rivers" | Scale comparison | LOW |

### V1 · HIGH · The land and its neighbors (S.ANCI6.01 p1)
- **Text:** "Three continents meet near Eretz Yisroel: Asia, Africa and Europe." "On the west side of Eretz Yisroel is the Mediterranean Sea… To the north is Lebanon… To the northeast is Syria. To the east is the country of Jordan. To the southwest is Egypt." "North is always at the top of the map."
- **Questions that need it:** lesson `do` 2 "Match each neighbor to its direction" (Lebanon–north, Syria–northeast, Egypt–southwest); `your` 2 "Travel from west to east" (Mediterranean coast, Yerushalayim, Dead Sea, Jordan); `ready` "On a map, which way is north?"; unit check "You sail from Eretz Yisroel straight west. Which sea are you on?" and "A trader walks from Mitzrayim to Bavel. Which land does he cross?"; pack questions "Which country is to the north / east / northeast of Eretz Yisroel?"; the unit project map.
- **Visual:** a simple drawn outline map (not the painting): Eretz Yisroel in the middle marked "You are here", the sea, and the four neighbors as plain shapes, each with a pattern as well as a color.
- **What the boy does, with the reading:** the map opens blank beside page 1.
  1. After "Three continents meet": tap Asia, then Africa, then Europe on a small inset (Europe across the sea to the northwest, Africa to the southwest, Asia to the east).
  2. After "On the west side… is the Mediterranean Sea": "Tap the blue sea." It fills in and gets its label.
  3. "Now tap where Lebanon is." (north) · "Tap Syria." (northeast) · "Tap the country of Jordan." (east) · "Tap Egypt." (southwest). Right: the land locks in with its name. Wrong: "Reread: Gavriel drew Lebanon to the north. Which way is north on the compass?"
  4. Then the existing match activity, with the finished map on screen.
- **Anchors:** compass rose with N, S, E, W **and NE, SW** (the questions use northeast and southwest), always in the corner; "North is at the top"; "You are here" on Eretz Yisroel; the book's names (Egypt, and Mitzrayim under it).
- **Images:** none to order: a plain outline map drawn in code (SVG), labels drawn by the app, so the blank and answer-key versions are one drawing. Goes into `art/` with a catalog row. Not requested yet; not needed from the image account.

### V2 · HIGH · The waters (S.ANCI6.01 p2)
- **Text:** "In the north… lies the Kinneret… Out of its southern end flows the Jordan River… it ends in the Dead Sea." "The Jordan flows south because the Dead Sea is far lower than the Kinneret." "Its shore is the lowest place on land on earth."
- **Questions that need it:** `oops` "Which way does the Jordan River flow?"; `your` 1 sort Dead Sea / Kinneret; `your` 4 cloze "the ___ place on land on earth"; `your` 5 "Tap every body of water"; pack questions "Is the Kinneret north or south of the Dead Sea?", "Follow the Jordan River. Put the stops in order."
- **Visual:** the same map, now with the waters; plus a small side view (a hill line from the Kinneret down to the Dead Sea, with a sea-level line), so "south on the paper, downhill on the ground" is something he sees.
- **What the boy does:** "Tap the lake in the north." (Kinneret locks in, light blue, label "fresh"). "Drag your finger south along the river." (the Jordan draws itself, arrow pointing south). "Tap where the river ends." (Dead Sea, white with a salt pattern, label "salty"). Then the side view: "Which end is lower? Tap it."
- **Anchors:** compass rose; an arrow on the river showing which way it flows; "sea level" line on the side view; fresh / salty written, not only colored.
- **Images:** same drawn map. The painting `core-map-eretz-yisroel` can stay as the opener picture.

### V3 · HIGH · Mitzrayim and the Nile (S.ANCI6.01 p3)
- **Text:** "Then Gavriel moved his pencil southwest, to Mitzrayim." "The Nile flows north through the desert until it empties into the Mediterranean Sea." Flood, mud, seeds, wheat; "most people… lived on a narrow green strip along the Nile."
- **Questions that need it:** SS.HIST.L07.01 `ready` "Which way is Mitzrayim from Eretz Yisroel?"; `oops` "Which way does the Nile flow?"; `do` 2 evidence "why towns hugged the river"; `your` 1 order the Nile farmer's year; unit check "A town far from the Nile. What problem would it have?"
- **Visual:** (a) the map slides southwest: "Trace the Nile from the desert to the sea" (arrow points north), then "Color the strip where people lived" (green with a dotted pattern; the desert stays tan). (b) A 4-step cycle with numbered arrows: river rises → water goes down, leaves mud → plant → wheat.
- **Anchors:** compass rose; river arrow; numbered steps 1–4 with arrows that go round.
- **Images:** drawn map (same drawing, wider view). Cycle: small pictures, check the catalog first (wheat, mud, river) before ordering.

### V4 · HIGH · Where the four kingdoms were (S.ANCI6.02)
- **Text:** Bavel "between two great rivers, the Tigris and the Euphrates, in the country we call Iraq today"; Persia "the land that is Iran today"; Alexander's empire "from Greece to Egypt and far past Persia"; Rome "from the city of Rome in Italy".
- **Questions that need it:** SS.HIST.L07.02 `your` Mistake Detective "Bavel was in today's Egypt / Persia was in today's Greece"; unit check "A trader walks from Mitzrayim to Bavel. Which land does he cross?"; the unit project `S.PROJ6.SS1`, which asks him to draw the lands around the Mediterranean, the Nile, Bavel between its rivers, Persia, Greece and Rome, "an arrow for each kingdom that ruled Eretz Yisroel". He cannot draw what he never saw.
- **Visual:** a wider drawn map: the Mediterranean in the middle, Eretz Yisroel marked "You are here", Mitzrayim and the Nile, the two rivers and Bavel, Persia beyond, Greece and Italy across the sea.
- **What the boy does:** one page, one kingdom. Page 1: "Tap the two rivers." "Tap Bavel, between them." "Tap Persia." Page 2: "Tap Greece, across the sea." Page 3: "Tap Rome, in Italy." Each kingdom gets its card number (1–4) when it locks in. The finished map is his model for the unit project.
- **Anchors:** compass rose; "You are here"; numbers 1–4 on the kingdoms, matching the timeline (V5); today's names under the old ones (Iraq, Iran), as the book does.
- **Images:** drawn map. The painting `core-map-galus-bavel` (road from the sea to a city between two rivers) can go beside the Bavel step.

### V5 · HIGH · The four kingdoms in order (S.ANCI6.02)
- **Text:** "four kingdoms ruled over the Jewish people, one after another… Bavel, Persia, Greece and Rome."
- **Questions that need it:** SS.HIST.L07.02 `your` 1 order (Bavel destroys → galus → Persia conquers → Koresh); SS.HIST.L07.03 order the four kingdoms; SS.HIST.L07.04 sort first / second Beis Hamikdash; unit check order "the first Beis Hamikdash is destroyed… the Jews rebuild"; SS.HIST.L07.04 `oops`, `ready` "Which empire destroyed the first Beis Hamikdash?".
- **Visual:** Akiva's four cards on the wall, as a timeline. After each page the boy pins the card and drags its events onto it: Bavel (first Churban, galus) → Persia (Koresh, return, Purim) → Greece (Alexander, Antiochus, Chanukah) → Rome (Titus, second Churban, the galus we are still in).
- **Anchors:** a clear start (first Beis Hamikdash stands) and end ("today: we are still waiting for this galus to end"); "before / after" arrows; the same numbers 1–4 as the map. **No dates until the coordinator decides which dates (see 3b).**
- **Images:** none; built from the button kit.

### V6 · MEDIUM · The chain of the Oral Torah (S.ANCI6.03)
- **Text:** Har Sinai → passed by mouth, teacher to student → Churban, Yavneh → Rebbi writes the Mishnah → Amoraim in Bavel → Gemara gathered by Rav Ashi and Ravina.
- **Questions:** SS.JHIST.L07.01 `do` 2 order; `oops` "Which came first, the Mishnah or the Gemara?"; `ready` "Where was the Torah given?".
- **Visual:** a chain timeline, one link per page; he adds each link as he reads. Anchors: start (Har Sinai) and end (a boy opening a Gemara today), before/after arrows.

### V7 · MEDIUM · Mishnah and Gemara (S.ANCI6.03 p2–3)
- **Questions:** `your` sort Mishnah / Gemara; match Tannaim; cloze Amoraim; unit check "The sages who taught the Mishnah are called the ___."
- **Visual:** a two-column chart he fills in: who (Tannaim / Amoraim), where (Eretz Yisroel / Bavel and Eretz Yisroel), what it is (short, clear, six sedarim / questions and answers on each Mishnah).

### V8 · MEDIUM · The Kosel (S.ANCI6.02 p3)
- **Questions:** SS.HIST.L07.04 `oops` "What is the Kosel?" (the mix-up is thinking it is a wall of the Beis Hamikdash building itself); proof "What still stands?"; match Har Habayis.
- **Visual:** a simple labeled diagram from above: the mountain, the outer wall around it, the place where the Beis Hamikdash stood, and the western part of the outer wall marked "the Kosel". Boy taps: "Tap the mountain." "Tap the wall around it." "Tap the part still standing in the west."
- **Images:** an outline diagram drawn in code is enough; check the catalog for a Kosel photo for beside it. Needs the kodesh rebbe's look.

### V9 · MEDIUM · Why empires wanted the land (S.ANCI6.01 p1)
- **Questions:** `your` proof "Why did so many empires want this small land?"; unit check trader question.
- **Visual:** three-link chain with arrows: three continents meet here → traders and armies must pass through → whoever rules it controls the roads → empires fight for it. Can sit under the V1 map: roads drawn from Africa, Asia and Europe meeting at "You are here".

### V10 · LOW · Unfamiliar objects
papyrus, pyramid, cedar tree, Roman stone road and arch, the menorah of the Beis Hamikdash. Search the catalog first. **Do not order a picture of hieroglyphics**: real ones are full of pictures of Egyptian gods (`docs/HANDOFF-PICS.md`, no other religions' symbols). If a picture is wanted, ask the creator first.

### V11 · LOW · Size
A bar comparing the length of the Jordan River and the Nile, and Eretz Yisroel's size next to Egypt's on the same map scale (the V1 map shows this if drawn to scale).

## 3. Accuracy problems and mismatches (flag to the coordinator; not picked quietly)
- **3a. A question asks for a place the book never places.** SS.GEO.L07.01 `your` 2 "Travel from west to east" puts Yerushalayim between the coast and the Dead Sea, and its "How to do it" says "Yerushalayim is in the hills west of the Dead Sea". The text never mentions Yerushalayim's place. (The fact is right.) Fix: add Yerushalayim to the V1 map with one step ("Tap Yerushalayim, in the hills west of the Dead Sea"), or add one sentence to page 1.
- **3b. Dates.** The unit project checklist says "I read it out loud and checked every date", but the three texts give **no dates**. Before any timeline shows dates, the coordinator and the kodesh rebbe must decide which dates to use: the two Batei Mikdash have different dates in the Jewish count (Seder Olam) and in the usual history books, and they are about 165 years apart for the first Churban. Until then, V5 and V6 use before/after only, and the checklist line should be fixed.
- **3c. The trader question.** Unit check "A trader walks from Mitzrayim to Bavel. Which land does he cross?" The book says three continents meet at Eretz Yisroel, but never says Mitzrayim is in Africa or Bavel is in Asia, or where Bavel is from Eretz Yisroel. Only the V1 + V4 maps make this answerable.
- **3d.** Checked and right (against standard atlases): Lebanon north, Syria northeast, Jordan east, Egypt southwest; the sea on the west; Kinneret in the north, fresh; the Jordan River flows south into the Dead Sea; the Dead Sea's shore is the lowest place on land; the Nile flows north into the Mediterranean; Bavel on the Tigris and Euphrates in today's Iraq; Persia in today's Iran; Rome in Italy.

## 4. Build order
1. **V1 + V2 + V3** together: one drawn map that grows across "The Land at the Center" (needs a new "map" activity kind; none exists in the app today).
2. **V4** (same activity kind, wider map) and **V5** (timeline).
3. V6–V9, then V10–V11.

## The test
After V1–V5, every question listed above can be answered from what the boy built. Not yet true for 3a and 3b until the coordinator answers.
