# K clarity picture tools (full look, for checking games as a boy sees them)
Run from the repository root. Output folders are your own scratch folder, never the repo, until you pick the sheets to keep.
- `node v2/screens/k-clarity/tools/shoot2.js <unit> <outdir> after <game> cb|phone`: plays the unit's test as a boy in the full look and takes start / lesson / find / wrong / mistake / end pictures.
- `node v2/screens/k-clarity/tools/quick3.js <game> <w> <h> <outprefix>`: lesson and first-round pictures only (fast, good for phone 390 844).
- `WAIT=... node v2/screens/k-clarity/tools/wrongq.js <game> 1366 768 <out.png>`: one wrong drop, then the picture of the help (hand to the right box).
- `python3 v2/screens/k-clarity/tools/sheets2.py <outdir>`: one picture sheet per game and size into v2/screens/k-clarity/<game>/.
- `node v2/screens/k-clarity/tools/one.js v2/tests/k-shapes-unit1.js`: runs one test file.
Unit to game: 1 find-circles find-triangles find-squares find-rectangles shape-sorter; 2 count-corners fix-shape; 3 find-hexagons mystery-shape; 4 what-comes-next copy-and-sing; 5 solid-shapes flat-or-solid; 6 build-shapes; 7 where-is-it; 8 fix-the-pattern pattern-train; 9 sort-colors big-and-small; 10 line-them-up; 11 heavy-and-light; 12 shape-party-1..3 graduation.
The machine is slow (software graphics): run at most two picture jobs at once, detached (setsid nohup), and wait with a background until-loop.
