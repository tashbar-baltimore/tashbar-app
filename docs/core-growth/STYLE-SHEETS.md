# Style sheets (one per band) and the picture-order format

Job T wrote this note (2026-11-24, prompt section 6). Every picture order from every Core Growth job uses the style sheet of its band, so a band looks like one world: the same art style, the same characters and the same colors. CLAUDE.md, `docs/HANDOFF-PICS.md` and the Family Life decision win where anything here differs.

## Rules for every band (they do not bend)
- **People:** boys and men only. No women or girls anywhere in a picture, even small in the background. Mothers and sisters can be in the words, never in a picture.
- **Frum and modest:** kippah and tzitzis on boys, and a hat and jacket on men where it fits. Modest, warm, normal frum family life, a wide mix of families (Ashkenazi, Sefardi, Bukharian, Teimani, Persian …). Kosher food only.
- **Never:** churches, crosses or other religions' symbols; alcohol; Halloween; fantasy creatures or magic; brand names or readable logos. No Divine Name readable anywhere, including on a sefer or a sign.
- **Body topics** (science): drawings or models only.
- **No text inside the picture.** The screen writes the words, so the picture never gives away an answer. A sign in a scene may only say a made-up shop name ("Gold's Bakery").
- **Every picture carries meaning on a work screen.** Big scenes go on unit openers, covers, chapter openers and win moments.
- **Files** (`docs/HANDOFF-PICS.md`):
  - WebP, at most 1,100 px wide and 200 KB (aim for 150 KB);
  - a row in `art/CATALOG.md` (the shared art library), with the licence "made for Tashbar Baltimore with an AI image tool, owned by the school";
  - alt text that describes the picture without naming a check answer.

## Sizes (what to ask for)
| Where | Size | Notes |
|---|---|---|
| Unit opener (TODAY WE LEARN of a unit) | 1100 × 620 (16:9) | The most dramatic scene of the unit's world. Keep the middle third calm: the screen puts words over the bottom. |
| Reader cover / chapter opener | 1100 × 825 (4:3) | The Reader's cover tilts this picture with depth. One clear subject, background soft. |
| Reader page picture | 1000 × 560 | Shows the moment on that page. No text. |
| Activity or question picture | 800 × 600 | Only when the picture is information the boy needs. |
| Character card (the cast sheet) | 800 × 1000 | One character, plain soft background, full body, front view. Make these **first** in every band, so later orders can say "same as card X". |

## The four bands

### K1 · Little Learners (Kindergarten–Grade 1)
- **Look:** bright, round, friendly picture-book art. Thick soft outlines, flat colors with a gentle shadow, big heads and big eyes, simple backgrounds. Everything reads at arm's length on a Chromebook.
- **Colors:** sunny yellow `#FFD45C`, sky blue `#7FC8F8`, grass green `#7CC59A`, warm orange `#FFB347`, soft cream background `#FFF8E1`. No black backgrounds.
- **Cast:** written by job F in `docs/core-growth/F-map.md` (the lanes file links it). Until then, use **only** objects, animals and scenes, with no recurring people.
- **Prompt start:** `Children's picture-book illustration, bright round friendly shapes, thick soft outlines, flat warm colors, simple background, for a Jewish boys' school; `

### B23 · Builders (Grades 2–3)
- **Look:** warm storybook watercolor and ink, like a classic chapter book. Light texture, clear faces with expression, more detail in the scene (a street, a kitchen, a shul).
- **Colors:** brick red `#C8553D`, golden wheat `#E0AE4F`, slate blue `#2F5FB3`, leaf green `#3FA36B`, paper cream `#FBF6EA`.
- **Cast:** written by job C23 in its map (the lanes file links it). The Reader's chapter books use this cast.
- **Prompt start:** `Warm storybook watercolor and ink illustration, gentle texture, expressive faces, detailed cozy setting, for a Jewish boys' school chapter book; `

### E45 · Explorers (Grades 4–5)
- **Look:** clean graphic-novel style. Confident ink lines, cel shading, dynamic angles for action, and real-world detail (maps, tools, a science fair).
- **Colors:** deep teal `#1F6E5A`, signal orange `#F28C28`, navy `#18284A`, sand `#E8D9B5`, white.
- **Cast:** **The Glen Avenue Crew** (`docs/core-growth/C45-map.md`, section 5): Yehuda Benaim, Avrumi Katz, Dovid Lerner, Binyamin Yusupov and Tzvi Hirsch Gold, all 10 in Grade 4 and 11 in Grade 5; Rabbi Feldman and Mr. Halpern. Make their five character cards first.
- **Prompt start:** `Clean graphic-novel illustration, confident ink lines, cel shading, dynamic angle, real-world detail, for a Jewish boys' school; `

### M68 · Masters (Grades 6–8)
- **Look:** respectful and grown-up. Painterly realism or documentary-style illustration, a calm color palette, no cartoon faces. Think of a good magazine feature.
- **Colors:** ink navy `#1F2633`, muted gold `#B8892E`, stone gray `#8A94A6`, deep green `#2E5E4E`, off-white `#F4F1EA`.
- **Cast:** **The Beacon newsroom** (`docs/core-growth/W48-map.md`, section 7; job C68 may replace it): Akiva Feldman, Eli Mizrahi, Gavriel Shirazi, Yoni Kaplan and Benny Okafor-Levine; Rabbi Rosen and Mr. Gross.
- **Prompt start:** `Painterly realistic editorial illustration, calm muted palette, natural light, respectful mature tone, for a Jewish boys' middle school; `

**Every prompt ends with:** `Boys and men only, modest frum dress (kippah, tzitzis), no women or girls, no text or letters in the image, no logos, no religious symbols of other faiths.`

## The picture-order list (one per job)
Each job keeps `docs/core-growth/<job>-picture-orders.md`. One table per batch of 20–40 pictures:

```
## Order 3 (2026-12-01) · status: SENT
| # | File name | Screen | Size | Prompt (band prompt start + this + the ending) | Alt text |
|---|---|---|---|---|---|
| 1 | core-c45-u02-opener.webp | READ.COMP.L05.20 unit opener (@today) | 1100x620 | The Glen Avenue Crew (cards 1-5) at the Inner Harbor at sunset, studying a folded paper map together, gulls overhead | Five boys look at a map by the harbor |
| 2 | core-c45-ants01-cover.webp | Reader cover, text C45.ANTS.01 | 1100x825 | A giant cutaway of an ant colony under a Baltimore park, tunnels and rooms, a queen ant in the deepest room | A cutaway drawing of an ant colony under the ground |
```

- **File name:** `core-<job>-<what>-<slot>.webp`, all lower case, for example `core-f-u03-opener.webp`, `core-c23-key01-p2.webp` or `core-g-cast-tzvi.webp`. Never reuse a name that is already in `art/pics/` (search `art/CATALOG.md` first).
- **Screen:** the skill id with `@today` (unit opener), `@watch`, or the text id with `cover` or `p<page>`, exactly where it will be linked (`src/RealPicsTeach.html` keys, or the text's `pic:`).
- **Status:** `DRAFT` (you are still writing it), `SENT` (you told the HoS), `ARRIVED` (in Drive), `LIVE` (merged), `REDO` (failed a check: say why on the row).
- **Tell the HoS in one line:** "Picture order 3 is ready (24 pictures): <link to the file on GitHub>."

## When the pictures arrive
1. **Sending the order:** the HoS gave builders the email address of the school's image account (HoS 2026-11-24; ask him for it, and never write it in the repository). Email the batch there: the rules above, the band styles, and one numbered block per picture, with its file name, size and prompt. Ask for a reply with each picture attached under its file name. **Check that inbox every hour** for replies and new instructions. The HoS may also put pictures in a Google Drive folder.
2. Fetch the pictures (Gmail attachment or Drive connector) into your scratchpad, never into the repository as they are.
3. **Check every picture** against its order and the rules above. Zoom in: a cross in a window, a girl in the background, letters on a sign, a brand on a box. Anything doubtful is `REDO`, with the reason.
4. Make each one WebP at its size (`python3 -I tools/pics-save.py` or Pillow), at most 200 KB.
5. Add the files to the shared art library (`art/pics/`, originals in `art/originals/`), one row each in `art/CATALOG.md`, and link them (the text's `pic:`, or a `TL_PIC_ADD` block in `src/RealPicsTeach.html`). `tools/pics-check.js` must say 0 problems.
6. One PR per batch, with the pictures at 1366×768 and 390 px in it.

**Until a picture arrives,** the screen shows a coded placeholder that still teaches and still looks good (the Reader's cover already does this). It is never an empty box.
