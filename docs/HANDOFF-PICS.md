# Hand-off: PICS-1, real pictures across the whole app

For any Claude Code session that continues this work. The starter prompt is at the bottom.

## What PICS-1 is
- The request came from developer@, and everything is approved: "everything is approved if you deem it good".
- Every lesson screen that talks about something a boy should see gets a real photo or scan, not an emoji.
- When the lesson talks about a part of the thing, that part gets a red box, an arrow and a label. Example: a Gemara daf with Rashi boxed.
- The target is all 2,565 flagged screens first, then every lesson, then tens of thousands of pictures over time.

## Where it stands (2026-11-18 ~10:00 ET)
- 121 screens and 30 pictures are live (editor v415, Firebase function api-00068).
- **Done:**
  - Gemara daf (Rashi, Tosafos, Mishna, גמ׳);
  - Mishkan (two models), Beis Hamikdash model;
  - tefillin, shofar, arba minim, sukkah, tzitzis, matzah, mezuzah, sefer Torah;
  - pyramids, Nile, Dead Sea, Yarden, Sinai desert;
  - Lloyd Street and Touro synagogues, Capitol, White House, Supreme Court, Washington, Lincoln, Roman aqueduct;
  - sun, moon (crater boxed), planets, leaf.
- **Not done:** almost all science (animals, body, plants, earth, matter), most social studies, computing (keyboard and screens), electives, life skills. HQ spreadsheet "PICS-1 audit" (1b9skmwaC5ksqnHekDkLdEYWi-nrzh2QE220o6Z0kJpU) lists the 2,565 screens.

## How it works (all on GitHub `main`)
- `src/RealPics.html` holds everything:
  - `TL_PICS` is the library: id -> {file, w, h, alt, source, licence, author}.
  - `TL_PIC_MAP` says which screen shows which picture. Key: `'LESSON.ID|exact question text'`. Value: `{id, mark:[{box:[x,y,w,h] in %, label, from:'left'|'right'|'top'|'bottom', at:0..1}], cap, keep}`.
  - It wraps `render()`, puts the picture on the screen, keeps labels inside the picture, and adds tap-to-zoom with the credit line.
  - The emoji stays as the fallback. Hebrew-text pics (a Rashi to read) always stay. `keep:true` keeps the emoji too.
  - It is loaded LAST in `TL_PART_FILES` (Speed.js) and in `msQuestToolsBody_` (Photos.js).
- `web/pics/` holds the picture files (max ~1100 px, JPEG quality ~85). `web/pics/SOURCES.md` has one line per file: source | licence | author.
- `web/build.js` copies `web/pics` into the site. ALWAYS `git pull` main before `web/refresh.sh`, or a rebuild deletes the pictures.
- **Tools:**
  - `python3 tools/pics-screens.py out.json` lists every screen (lesson id, question, teaching line, current pic).
  - `node tools/pics-check.js src/RealPics.html out.json web/pics` checks that every link names a real screen and every picture exists. It must print "0 problems".
  - `node tools/pics-sheet.js src/RealPics.html web/pics sheet.png "ID|question" ...` draws the screens through the real add-on. Look at it before publishing.
  - `python3 web/pics_deploy.py tashbar-learning-live <tokenfile> "note"` clones the LIVE site and adds the pictures. Nothing else on the site changes.
  - `tools/pics-publish-editor.sh "note"` publishes RealPics.html as the ONLY editor change. It pulls, proves nothing changed meanwhile, pushes, pulls back to compare, then creates the version and updates both deployments.
  - `NODE_USE_ENV_PROXY=1 SYNC_EDITOR=1 tools/pics-publish-server.sh <folder printed by the editor script>` redeploys the running Firebase function with RealPics.html plus the published editor. It refuses if the running engine is old (no `mergePlan`).

## Rules that do not bend
1. **Picture rules** (Pictures.html PIC_BAN, Head of School):
   - boys and men only: NO women or girls, even small in the background;
   - frum settings, kosher food;
   - no churches, crosses or other religions' symbols;
   - no alcohol, Halloween or fantasy creatures.
   - Body pictures are drawings or models only, never photos of people.
   - When in doubt, leave it out.
2. **Licences:** public domain, CC0, CC BY, CC BY-SA, Pixabay Content License, Pexels License, Library of Congress "no known restrictions". Record source, licence and author for every file. NO modern publisher pages (ArtScroll, Koren, textbooks) and no Google Images.
3. **Never give the answer away.**
   - A question screen gets the picture with NO label naming the answer, and a neutral caption.
   - Teaching screens (with a "how" line) may label things.
   - Skip a picture that would itself answer the question (for example "How do you play a shofar?").
4. **Kodesh pictures** go on the rebbe review list in the LOG note.
5. **Publishing:**
   - Use the two scripts. Never push other files to the editor.
   - Never deploy the function from an old checkout.
   - Write a CHANGE+RELEASE note in the HQ LOG (Drive folder 1NOL4XyWQgf5wm60gGNbmVG6ujY6RBIGS) after each batch.
6. **Never put student data anywhere.** Never print keys or tokens.

## Work environment (cloud session)
- **Repository:** `tashbar-baltimore/tashbar-app`, branch `main`.
- **Network:** these must be Allowed domains:
  - `commons.wikimedia.org`, `upload.wikimedia.org`, `thumb.wikimedia.org`
  - `www.loc.gov`, `tile.loc.gov`
  - `pixabay.com`, `cdn.pixabay.com`, `api.pexels.com`, `images.pexels.com`
  - `api.openverse.org`, `www.sefaria.org`
- **API keys** (environment Network secrets or variables, never in chat): `PIXABAY_KEY`, `PEXELS_KEY`.
- **Google sign-in (clasp)** as the school owner (Head of School's account), for the editor and Firebase:
  1. Run `clasp login --redirect-port 8976` in the background (clasp 3.x: `npm i -g @google/clasp@3.4.1`).
  2. Give the person the Google link.
  3. They paste back the `http://localhost:8976/?...` address.
  4. Send it once with `curl --noproxy '*'`.
  5. Never ask for a password or code.
  - `python3 web/token.py /tmp/.fbtok` then gives a short-lived token for gcloud and Hosting.
- Use `NODE_USE_ENV_PROXY=1` for clasp and node network calls.
- **Picture sources, best first:**
  1. **Pixabay API** (`https://pixabay.com/api/?key=$PIXABAY_KEY&q=...&image_type=photo&safesearch=true&per_page=50`): fast, about 100 calls a minute.
  2. **Pexels API** (header `Authorization: $PEXELS_KEY`).
  3. **Library of Congress** (`https://www.loc.gov/photos/?q=...&fo=json`; images on tile.loc.gov): best for history, Eretz Yisrael and Judaica (the Matson collection).
  4. **Wikimedia Commons:** heavily rate-limited from cloud sessions. Use only its standard thumbnail sizes (330px, 960px) and pause about 12 s between calls.

## The batch loop
1. Pick a subject (for example frog life cycle) and list its screens with `pics-screens.py`. Prefer teaching screens.
2. Search the sources. Throw away anything whose tags or title mention woman, girl, lady, church, cross, christmas, easter, temple of another religion, beer, wine, bikini, and so on.
3. Make a contact sheet of the candidates and LOOK at every one. Pick the best that passes the rules.
4. Crop and resize into `web/pics/`, and add a line to SOURCES.md.
5. Add the TL_PICS entries and the TL_PIC_MAP links: exact question text, boxes only where the lesson talks about a part.
6. Run `pics-check.js` (0 problems) and `pics-sheet.js`, and look at the sheet.
7. Publish:
   1. commit and push to main;
   2. `pics_deploy.py`;
   3. `pics-publish-editor.sh`;
   4. `pics-publish-server.sh`;
   5. write the LOG note.

## Starter prompt for the next builder
See the bottom of this file. The same text was given to developer@ in chat.

```
use a workflow

You are continuing PICS-1 for the Tashbar Baltimore learning app: real pictures on every lesson screen,
with a red box, arrow and label on the part the lesson talks about. developer@ has approved this work.

Setup:
1. The repository tashbar-baltimore/tashbar-app is attached. Work on branch main. Read docs/HANDOFF-PICS.md
   first and follow every rule in it exactly (picture rules: no women or girls, no other religions'
   symbols, kosher; licences recorded; never give a question's answer away).
2. Check the environment: the Allowed domains and the PIXABAY_KEY / PEXELS_KEY variables listed in the
   hand-off. If any is missing, tell me in one line what to add, then continue with what works.
3. Get a clasp sign-in from me the way the hand-off describes (I paste back the localhost address).
   Never ask for a password.
4. Run: python3 tools/pics-screens.py /tmp/screens.json, then
   node tools/pics-check.js src/RealPics.html /tmp/screens.json web/pics. It must say 0 problems.

Work:
5. Run a workflow that fans out by subject. Each worker takes one subject from the HQ "PICS-1 audit" list
   (science animals, body (drawings or models only), plants, earth, matter, sky; social studies;
   computing (keyboard and screens); electives; life skills; the remaining Kodesh). For each subject it:
   lists the screens; searches Pixabay, then Pexels, then the Library of Congress; drops anything whose tags
   break the picture rules; makes a contact sheet and looks at every candidate; picks the best; crops into
   web/pics with a SOURCES.md line; and writes TL_PICS and TL_PIC_MAP entries (exact question text, boxes
   only on teaching screens). It returns its entries and files. It does NOT publish.
6. A separate checker reviews every chosen picture against the rules and every link against "never give
   the answer away". It removes anything doubtful.
7. You merge the results into src/RealPics.html, run pics-check.js (0 problems) and pics-sheet.js, and look
   at the sheets yourself.
8. Publish in batches of about 100 to 300 screens, with the scripts in the hand-off: commit and push main,
   web/pics_deploy.py, tools/pics-publish-editor.sh, tools/pics-publish-server.sh. Then write a
   CHANGE+RELEASE note in the HQ LOG.

Short, plain updates to me after each batch: how many screens, how many pictures, one sample sheet.
Stop only when I must sign in to Google or a real decision is needed.
```
