# Simplify audit ("One button, one job"), with before → after numbers

Made-up boys only. Boy screens come from `tests/lib/screens.js` (the real boy page with the made-up boys from `tests/lib/kidmap.js`). Staff screens come from `tests/lib/staffscreens.js` (the real staff page on the real server code, `server/runtime.js`, with made-up boys such as "Made-up Fifth"). "Tappable" means everything a finger can hit on the screen at phone size (390 px), counting the top and bottom bars.

## The numbers

### Boys
| Screen | Before | After | PR |
|---|---|---|---|
| Lesson: screens before the first question | 4 (Learn it card → "3 quick examples" pop-up → 10-second Quick Hit → "Too easy / Show me the trick / Go to my questions") | **1** (Learn it card) | #130 |
| Lesson: big buttons on the first screen | 2 | **1** ("I'm ready!") | #130 |
| Lesson: teaching card popping up during practice (10 questions) | up to 10 | **0** (it waits behind Help me) | #130 |
| Lesson: Joke Jar opening mid-practice | yes (a dozen buttons over the questions) | **no** (after passing only) | #130 |
| Lesson: big buttons on the end screen | 2 | **1** ("▶ Next level") | #130 |
| Map: tappable | 16 | **11** | #140 |
| Map: ways to choose what to play | 2 (subject tabs + the goal card) | **1** PLAY + a quiet "Change subject" link | #140 |
| Bottom bar tabs | 5 (K–2: 3) | **4** (K–2: 3) | #140 |
| Separate "more" places (Arcade, Library, My Stuff, Skill tree, Pathfinder) | 5 places, reached from 3 screens | **1** More page, 4–5 named shelves | #140 |
| Trophies: tappable | 7 | **6** | #140 |
| Welcome pop-ups that can open on the map | 2 (game welcome + old night-sky vort card) | **1** | #140 |

### Staff
| Screen | Before | After | PR |
|---|---|---|---|
| Boy card: action buttons | 11 | **5** + one quiet "More about him" link | #142 |
| Places where the old staff card opens in full | 1 ("His day & everything else") + 3 actions that opened all of it | **0** (each row opens only its own part) | #142 |
| Start a class lesson: screens before picking boys | 2 (a 3-choice page, then the screen) | **1** (other ways are quiet links) | #142 |
| Curriculum: tiles | 7 tiles + a 4-button tree card + 2 "See the tree" buttons | **0 tiles**: one "What we teach" view + one list | #144 |
| Coverage per grade, at a glance | none | **"Grade 4: 18 of 18 built"** per subject | #144 |
| Areas with a one-sentence purpose | 3 of 5 | **5 of 5** | #146 |
| Big buttons per area header | up to 3 | **1** (others are quiet links) | #146 |

### Places per tool (each tool should live in one place)
| Tool | Before | After |
|---|---|---|
| Money (boys) | 2: money chip + Money tab | **1**: the chip |
| Pathfinder (boys) | chip in the top bar, beside the money | **More** |
| My Stuff (boys) | a button at the bottom of Trophies | **More** |
| All lessons / Library (boys) | the last tab in the subject-tab row | **More** |
| Needs me today (staff) | 2: Home + Today | **1**: Home |
| "13 boys" / Students (staff) | 2: School tile + Students | **1**: Students |
| Teacher mode / class lesson (staff) | 2 steps: chooser page, then Teacher mode | **1**: one screen |

### Old-look screens
| Screen | Before | After |
|---|---|---|
| Night-sky "Today's Vort" card over the game map | could appear | **gone** for every boy with a map (#140) |
| Pale Learn it card inside the game | pale sky | **game colours** (#130) |
| Old staff card as a landing page | yes | **gone** (#142) |
| Curriculum tile wall | yes | **gone** (#144) |
| School/Today tile walls | yes | **plain lists** (#146) |
| **Still old:** the lesson engine's question screen (streak pill over the title, "Quest" toasts, "Money storm" and Jackpot effects, the dark Practice / On your own intro card) | | **Not changed here, on purpose.** The One Bite lane (#136, `src/OneBite.html`) is rebuilding the whole lesson as 6 calm steps, with no pop-ups, banners or money effects. It is live for TEST- boys and will replace this screen for everyone. Changing the same screen twice would collide. |

## What was removed in the cleanup (step 7)
- `src/GameMap.html`: the styles for the old subject tabs, the "All lessons" tab, the skill-tree button and the My Stuff button (their only users are gone).
- `src/JokeJar.html`: the mid-lesson streak counter and its 5-minute timer (the mid-lesson jar is gone).
- `src/StaffHome.html`: the "His day & everything else" action, the old "Where the boys are" block and the old curriculum tile page. The curriculum fallback, used only if `StaffTeach.html` fails to load, is now a plain list.
- **Kept on purpose:** the Quick Hit challenge code in `src/Activities.html`. It no longer opens at the start of a lesson, but the Daily Mix (`src/Review.html`) still uses it.

Every removal is covered by `node tests/run.js` (ALL TESTS PASSED). Server calls are unchanged: 37 on the way to the boy's home, 5 on the staff first screen.
