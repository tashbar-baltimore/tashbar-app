# Review round 1 · job F · Foundations K–2 (2026-11-24)

Written by job V (the independent checker). Fresh reviewers who did not write these lessons scored each one 1–5 on the HoS 9 points, against the lesson data and **every** check question the engine can draw. Every answer key was checked by hand. Summary and method: `docs/core-growth/REVIEWS.md`.

**Owner: please fix the lessons marked ✗ (any point below 4) first, then the URGENT lines, then the rest. When you fix one, say so in your PR and V re-scores it.**

Points: 1 goal · 2 teaching · 3 progression · 4 thinking steps · 5 mistake work · 6 variety and age fit · 7 taught then asked · 8 correct and clear · 9 warm. Fun = how exciting a boy would find it (1–5).

| Lesson | Name | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | Fun | Grade level | Result |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `READ.LV.L03.03` | Saw, Haul, Ball | 5 | 4 | 5 | 5 | 5 | 4 | 5 | 3 | 5 | 3 | ok | **✗ fix** |
| `READ.LV.L03.04` | Blue Moon Team | 5 | 5 | 5 | 5 | 5 | 4 | 5 | 5 | 5 | 3 | ok | ✓ pass |
| `READ.LV.L03.05` | Teams in Long Words | 5 | 5 | 5 | 5 | 5 | 4 | 5 | 5 | 5 | 3 | ok | ✓ pass |
| `READ.LV.L03.06` | Chair, Share, Bear | 5 | 5 | 5 | 4 | 5 | 4 | 5 | 5 | 5 | 3 | ok | ✓ pass |
| `READ.PHON.L03.04` | Open Door, Closed Door | 5 | 5 | 5 | 5 | 5 | 4 | 5 | 5 | 5 | 3 | ok | ✓ pass |
| `READ.PHON.L03.05` | Slide the Line | 5 | 5 | 5 | 5 | 5 | 4 | 5 | 5 | 5 | 3 | ok | ✓ pass |
| `READ.PHON.L03.06` | Silent E in Long Words | 5 | 4 | 5 | 5 | 3 | 4 | 5 | 3 | 5 | 3 | ok | **✗ fix** |
| `READ.PHON.L03.07` | Table or Puddle? | 5 | 5 | 5 | 5 | 5 | 4 | 5 | 5 | 5 | 3 | ok | ✓ pass |
| `READ.PHON.L03.08` | Catch the Bridge | 5 | 5 | 5 | 5 | 5 | 4 | 4 | 5 | 5 | 3 | ok | ✓ pass |
| `READ.PHON.L03.09` | City Cat | 5 | 5 | 5 | 5 | 5 | 4 | 5 | 5 | 5 | 3 | ok | ✓ pass |
| `READ.PHON.L03.10` | Giant Goat | 5 | 5 | 5 | 5 | 5 | 4 | 5 | 5 | 5 | 4 | ok | ✓ pass |
| `READ.PHON.L03.11` | Knock, Write, Lamb | 5 | 5 | 5 | 5 | 5 | 4 | 5 | 5 | 5 | 3 | ok | ✓ pass |
| `READ.PHON.L03.13` | Drop the E | 5 | 5 | 5 | 5 | 5 | 4 | 3 | 5 | 5 | 3 | ok | **✗ fix** |
| `READ.PHON.L03.14` | Double It | 5 | 5 | 5 | 5 | 5 | 4 | 3 | 5 | 5 | 4 | ok | **✗ fix** |
| `READ.PHON.L03.15` | Y to I | 5 | 5 | 5 | 5 | 5 | 4 | 3 | 5 | 5 | 3 | ok | **✗ fix** |

## Notes and copy-ready fixes, lesson by lesson

### `READ.LV.L03.03` Saw, Haul, Ball — FIX (a point below 4)
- **URGENT:** your 5 sort card "h__l" is keyed au (haul) only, but filling al gives "hall" (h+al+l), a real word with the aw sound; the how box says 'Which one makes a real word?' so a boy who picks al is marked wrong while right.
- **p2** — step 1: "Haul. Aw inside the word? Most times, spell it au." while your 4 asks him to find hawk and yawn (aw inside) and the exception is only on the rebbe board  
  **Fix:** step 1 t: "Haul. Inside the word? Most times au. But yawn and hawk: aw!" (12 words)
- **p6** — do+your kinds: tiles,listen,match,listen,tiles,findall,sort (same 5 kinds as every other lesson in F-1; no trace, no word chain)  
  **Fix:** Replace your 1 picture match with a spelling choice by place: sort {bins:['aw at the end','au inside'],cards:[['claw',0],['fault',1],['thaw',0],['haunt',1]]}
- **p8** — YOUR 5 cards: ["h__l",1] with bins aw/au/al  
  **Fix:** Replace ["h__l",1] with ["s__ce",1] (sauce; 'sawce' and 'salce' are not words).

### `READ.PHON.L03.06` Silent E in Long Words — FIX (a point below 4)
- **URGENT:** your 1 Mistake Detective marks "rep-til" as wrong, but rep-tl/rep-til is the FIRST pronunciation in Merriam-Webster for reptile (US). A boy who answers "Yes, rep-til" is defensibly right: two defensible answers in the mistake activity.
- **p2** — step 0: "Shimon and Ima bake cupcakes for Shabbos. Split: cup, cake." (the boy is never told WHERE to split; only the rebbe board says 'between the middle consonants')  
  **Fix:** Add a step before step 1: {t:'Cupcake. Two middle consonants, p and c. Split between them!', m:{type:'tiles',w:['cup','cake'],hi:[0]}}
- **p5** — Moishe read reptile as "rep-til". ... a:"No: rep \| tile"  
  **Fix:** {type:'listen',q:'Moishe read explode as "ex-plod".',hear:'Is Moishe right?',o:['No: ex \| plode','Yes, ex-plod','No: ex \| plood'],a:'No: ex \| plode',mis:true,say:'Mistake Detective! Did Moishe read it right?',how:'Look at the last part. Does it end with a quiet e?'}
- **p6** — do+your kinds: tiles,sort,listen,sort,tiles,findall,match (same 5 kinds as every other lesson in F-1; no trace, no word chain)  
  **Fix:** Swap your 5 match for a word-chain tiles: {type:'tiles',w:['in','side'],extra:['sid'],hear:'inside',say:'Build inside. Which part is long?',how:'Find the part with a quiet e.'} so the unit is not the same 5 kinds every lesson.
- **p8** — YOUR 1 reptile mistake (see urgent); also reptile used as a silent-e word in your 2  
  **Fix:** Use explode in your 1 (above) and swap ['reptile',0] in your 2 for ['explode',0].

### `READ.PHON.L03.13` Drop the E — FIX (a point below 4)
- **p6** — do+your kinds: sort,tiles,listen,match,findall,tiles,sort (same 5 kinds as every other lesson in F-1; no trace, no word chain)  
  **Fix:** Make your 2 picture match a pairs-to-base match: {pairs:[['skating','skate'],['riding','ride'],['hoping','hope'],['joking','joke']],say:'Match each word to its base word.',how:'Take off -ing. Put the quiet e back.'}
- **p7** — check "Add -ed to 'hope'" a=hoped is tapped as a right spelling in your 3; check "Add -ing to 'shine'" a=shining is built in your 4; making is a bank spotall item. 2-3 of 3 check answers were shown word-for-word.  
  **Fix:** checks: {q:'Add -ed to "save". Which is right?',o:['saved','saveed','savved'],a:'saved'}, {q:'Add -ing to "hide". Which is right?',o:['hiding','hideing'],a:'hiding'}, {q:'Add -ing to "bike". Which is right?',o:['biking','bikeing','bikking'],a:'biking'} (and re: close/closed, trade/trading, glide/gliding — hike, wave, slide are all shown earlier)

### `READ.PHON.L03.14` Double It — FIX (a point below 4)
- **p6** — your 5: "Avi taped a picture. Then he tapped on the door." + "Read it. Find the word that means touched lightly." (19 words for Gr 2)  
  **Fix:** q: "Avi taped a picture, then tapped the door." say: "Which word means touched lightly?" (13 words)
- **p7** — all 3 checks shown earlier word-for-word: running (do 1 'run', your 2 match 'running'), stopped (your 3 findall right spelling), hoping (watch move 'Hoping: stand!')  
  **Fix:** checks: {q:'Add -ing to "dig". Which is right?',o:['digging','diging','digeing'],a:'digging'}, {q:'Add -ed to "hug". Which is right?',o:['hugged','huged'],a:'hugged'}, {q:'Add -ed to "wipe". Which is right?',o:['wiped','wipped','wipeed'],a:'wiped'} (re: drop/dropped, trip/tripped, melt/melted — swim, clap, help are all shown earlier)

### `READ.PHON.L03.15` Y to I — FIX (a point below 4)
- **p6** — do+your kinds: sort,tiles,listen,match,findall,tiles,sort (same 5 kinds as every other lesson in F-1; no trace, no word chain)  
  **Fix:** do 1 and your 5 are the same sort; make your 5 a tiles: {type:'tiles',w:['s','t','o','r','i','es'],extra:['y'],hear:'stories',say:'Build stories. Change the y?',how:'Look at the letter before the y.'}
- **p7** — check "Add -es to 'bunny'" a=bunnies is built in do 2 and matched in your 2; check "Add -ing to 'carry'" a=carrying is built in your 4  
  **Fix:** checks: {q:'Add -es to "puppy". Which is right?',o:['puppies','puppys','puppyes'],a:'puppies'}, keep try/tried, {q:'Add -ing to "hurry". Which is right?',o:['hurrying','hurriing'],a:'hurrying'} (re: penny/pennies, spray/sprayed, fry/fried — berry, stay, dry are shown earlier)

### `READ.LV.L03.04` Blue Moon Team — pass
- **p6** — do+your kinds: listen,tiles,sort,listen,match,findall,match (match used twice) (same 5 kinds as every other lesson in F-1; no trace, no word chain)  
  **Fix:** Change your 5 rhyme match into a sort by team: {type:'sort',bins:['ew','ue','ui'],cards:[['crew',0],['glue',1],['suit',2],['stew',0],['true',1],['juice',2]],say:'Which team spells oo?',how:'Find the two letters that say oo together.'}

### `READ.LV.L03.05` Teams in Long Words — pass
- **p6** — do+your kinds: tiles,sort,listen,sort,listen,findall,tiles (same 5 kinds as every other lesson in F-1; no trace, no word chain)  
  **Fix:** Do 2 and your 2 are the same sort shape; make your 2 a tiles split: {type:'tiles',w:['tea','cher'],extra:['te','acher'],hear:'teacher',say:'Build teacher. Keep the team whole!',how:'Find ea. Keep it in one part.'}

### `READ.LV.L03.06` Chair, Share, Bear — pass
- **p4** — do 2 how: "Both teams say air. Which one did chair use in the lesson?" / your 3 how: "How did square look in the match?" (memory, not a thinking step)  
  **Fix:** do 2 how: "Chair rhymes with hair. Spell it the way hair ends."  your 3 how: "Square rhymes with care. Spell it the way care ends."
- **p6** — do+your kinds: sort,tiles,listen,match,tiles,findall,listen (same 5 kinds as every other lesson in F-1; no trace, no word chain)  
  **Fix:** Swap your 2 picture match (same pairs as the bank) for a sort: {bins:['air','are','ear'],cards:[['hair',0],['stare',1],['wear',2],['fair',0],['scare',1],['pear',2]]}

### `READ.PHON.L03.04` Open Door, Closed Door — pass
- **p6** — do+your kinds: sort,listen,sort,listen,tiles,match,findall (same 5 kinds as every other lesson in F-1; no trace, no word chain)  
  **Fix:** Make do 2 a 'sound swap' tiles chain instead of a listen: {type:'tiles',w:['g','o','t'],extra:['e'],hear:'got',say:'Go is open. Add one letter to close the door.',how:'Which letter closes the door after o?'}

### `READ.PHON.L03.05` Slide the Line — pass
- **p6** — do+your kinds: tiles,listen,sort,listen,sort,match,tiles (same 5 kinds as every other lesson in F-1; no trace, no word chain)  
  **Fix:** Replace your 4 match with a slide-the-line chain: tiles {w:['lem','on'],extra:['le'],hear:'lemon',say:'Try le first. Not a word? Slide!',how:'Read le long. Is lee-mon a word?'}

### `READ.PHON.L03.07` Table or Puddle? — pass
- **p6** — do+your kinds: tiles,sort,match,listen,findall,tiles,listen (same 5 kinds as every other lesson in F-1; no trace, no word chain)  
  **Fix:** Replace your 3 findall with a split-it tiles: {type:'tiles',w:['ma','ple'],extra:['map','le'],hear:'maple',say:'Build maple. Le takes one!',how:'Le grabs the consonant before it.'}

### `READ.PHON.L03.08` Catch the Bridge — pass
- **p6** — do+your kinds: tiles,sort,findall,listen,tiles,match,listen (same 5 kinds as every other lesson in F-1; no trace, no word chain)  
  **Fix:** Replace your 4 picture match with a word chain: tiles {w:['p','i','tch'],extra:['ch'],hear:'pitch',say:'Change one sound: pitch. Short or long i?',how:'Short vowel? Bring the t guard.'}
- **p7** — check "An elephant is hu… ." (a=ge): huge is the teacher worked example ("Spell the end of huge ... Ge: huge.") and a bank spotall item  
  **Fix:** {q:'Which ending finishes the word? The boys sang on the sta… .',o:['ge','dge'],a:'ge'}

### `READ.PHON.L03.09` City Cat — pass
- **p6** — do+your kinds: sort,tiles,listen,match,findall,tiles,sort (icy appears in your 3 and your 5) (same 5 kinds as every other lesson in F-1; no trace, no word chain)  
  **Fix:** your 5 repeats icy from your 3 and repeats the do 1 sort shape; make your 5 a tiles: {type:"tiles",w:["f","e","n","c","e"],extra:["s"],hear:"fence",say:"Build fence. Which letter says sss?",how:"C before e says sss."}

### `READ.PHON.L03.10` Giant Goat — pass
- **p6** — do+your kinds: findall,tiles,match,listen,tiles,sort,listen (same 5 kinds as every other lesson in F-1; no trace, no word chain)  
  **Fix:** Replace your 1 picture match (identical to the bank's) with a 'try juh, then guh' sort: {bins:['juh works','juh fails: guh'],cards:[['gem',0],['give',1],['gym',0],['get',1],['giant',0],['girl',1]],how:'Try juh first. Is it a word?'} (this also practises the exception the watch teaches)

### `READ.PHON.L03.11` Knock, Write, Lamb — pass
- **p6** — do+your kinds: listen,tiles,sort,match,findall,tiles,listen (same 5 kinds as every other lesson in F-1; no trace, no word chain)  
  **Fix:** Replace your 3 findall with a minimal-pair listen-and-build: tiles {w:['kn','o','t'],extra:['n'],hear:'knot',say:'Knot, like a tied rope. Build it!',how:'Not, like no? Or knot, a tie? This one has a quiet k.'}
