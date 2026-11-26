# Restored Book Club lessons, chapters 1–3 of Books B2 and B5 (2026-11-26)

**What happened:** the chapter-books PR (#479, 25 Nov) put Ridge Trail ch. 1–3 (`READ.LIT.L05.30`–`.32`, Grade 4) and Lighthouse ch. 1–3 (`READ.LIT.L06.30`–`.32`, Grade 5) in `src/CoreDataC45H3.html`. The same day, fluency batch 2 (#493) wrote a new file with the same name. The 6 lessons vanished from the boys' path: a listed skill with no lesson is hidden, so no test failed. Found during gap B1b (Review Round 2, C45).

**Fix:** the file is restored from `c3d48c4` as `src/CoreDataC45H34.html`, and the 6 rows in `src/CoreDataC45.js` point to it. A new test (`tests/lib/corefiles.js`) fails when a listed lesson is missing from the data file it names. It found 6 failures on the old main and finds 0 now (522 rows).

**Review:** standards are stricter than when these lessons were written, so they were scored again before going back in. Four rounds; every reviewer was new and had written none of the lessons. After every change, the changed lessons were scored again by a new reviewer. Every proof string was split with `tools/core/textfmt.js` `sentences()`.

| Round | Pass | Found and fixed |
|---|---|---|
| 1 | 3 of 6 | L05.30 check 2 and L06.31 check 3 had a second right answer; L05.32 check 3 and L06.31 check 2 could be answered without the card; a match card in L05.32 fit two answers |
| 2 | 1 of 3 | L05.32 proof: a second sentence of the chapter also answered it; L06.31 new check 2 had a second right answer. Teacher answer keys added (the "never taught" counter stays at 850) |
| 3 | 0 of 2 | L05.32 checks 1–2 and L06.31 check 1 could be answered from the question; one match pair in L06.31 fit two ways |
| 4 | 2 of 2 | clean |

| Lesson | Name | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | Fun | Final round |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `READ.LIT.L05.30` | Ridge Trail 1: Twenty Blue Marks | 5 | 4 | 5 | 4 | 5 | 5 | 4 | 4 | 5 | 4 | 2 |
| `READ.LIT.L05.31` | Ridge Trail 2: The Anvil Cloud | 5 | 5 | 4 | 5 | 5 | 5 | 4 | 4 | 5 | 5 | 1 |
| `READ.LIT.L05.32` | Ridge Trail 3: Count the Seconds | 5 | 4 | 5 | 4 | 5 | 5 | 4 | 5 | 5 | 5 | 4 |
| `READ.LIT.L06.30` | Lighthouse 1: The Light on Iron Legs | 5 | 5 | 5 | 4 | 5 | 5 | 4 | 4 | 5 | 4 | 1 |
| `READ.LIT.L06.31` | Lighthouse 2: The Bay's Own Schedule | 5 | 5 | 5 | 4 | 5 | 5 | 5 | 4 | 5 | 4 | 4 |
| `READ.LIT.L06.32` | Lighthouse 3: Erev Shabbos at Sea | 5 | 5 | 4 | 4 | 5 | 5 | 4 | 5 | 5 | 4 | 1 |

"Final round" = the round whose reviewer scored the lesson as it is now; no lesson changed after it.

**Polish left (4s, not failures):**
- L05.32: do 2's reason "Lightning hits tall, high things" is not said in chapter 3. A one-line addition to the chapter would close it.
- L06.31: the proof's neighbouring sentence ("The storm was arriving many hours ahead…") is a weak second reading. Reword the question to "what the Coast Guard said about the waves".
- Several checks in L05.30, L06.30 and L06.32 have one weak third choice.

No Kodesh content. No Divine Name.
