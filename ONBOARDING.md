# Welcome: building the Tashbar Learning app

You'll be working with Claude Code (claude.ai/code) on the learning app used by the boys at Tashbar Baltimore.
The Head of School (HoS), Rabbi Meir Khaver, sets direction; developer@tashbarbaltimore.org manages the code and access.
Read this once, do the setup checklist, then paste the master prompt at the bottom into a new Claude Code session.

---

## 1. Setup checklist (one time, about 30 minutes)

Do these in order. Ask the HoS or developer@ for anything marked **(ask)**.

1. **School Google account.** You need a `@tashbarbaltimore.org` account **(ask)**.
   - Sign in to Chrome with it.
   - Open Drive → Shared drives, and check you can see **HQ**, including the **LOG** folder.
2. **GitHub.**
   1. Make a GitHub account at https://github.com, or use your own.
   2. Send your GitHub username to developer@. They invite you to the **tashbar-baltimore** organization with **Write** access to **tashbar-app** **(ask)**.
   3. Accept the email invite.
   4. Check that https://github.com/tashbar-baltimore/tashbar-app opens for you.
3. **Claude.**
   1. Sign in at https://claude.ai with your **school** Google account.
   2. Go to https://claude.ai/connect-github and connect **the same GitHub account** you were invited with. Approve **tashbar-baltimore** if GitHub asks.
   - **Common trap:** if Claude can't see the repository, you are probably signed in to github.com with a different GitHub account.
     1. Sign out of github.com.
     2. Sign in with the invited account.
     3. Open https://claude.ai/connect-github again and reconnect.
   - If it still can't see the repository, ask developer@ to check that the Claude app is installed on tashbar-baltimore (https://github.com/apps/claude → Configure).
4. **Cloud environment.**
   1. In a Claude Code session, open the environment menu at the top, then click **Edit**.
   2. **Environment variables:** add `PIXABAY_KEY=...` and `PEXELS_KEY=...` **(ask for the school's keys)**. Never paste keys into a chat.
   3. **Network access → Allowed domains:** add these, and leave "Allow package managers" ticked:
      `pixabay.com, cdn.pixabay.com, api.pexels.com, images.pexels.com, commons.wikimedia.org, upload.wikimedia.org, www.loc.gov, tile.loc.gov, api.openverse.org, www.sefaria.org`
   4. Save. New sessions pick up the changes.
5. **Firebase.** You do **not** need Firebase access to publish: GitHub publishes for you.
   - If you want to look at the live project, ask developer@ for **Viewer** access to Firebase project `tashbar-learning-live`.
   - Never change Google Cloud permissions, billing or policies yourself.
6. **Check it works.**
   1. Start a new Claude Code session with **tashbar-baltimore/tashbar-app** selected.
   2. Ask: *"Run node tests/run.js and tell me if it passes."* It should print **ALL TESTS PASSED**.

---

## 2. How the work works

- **Where things are**
  - **The app:** Firebase project `tashbar-learning-live`.
    - Students: https://tashbar-learning-live.web.app
    - Staff: https://tashbar-learning-live.web.app/staff/
  - **The code:** GitHub `tashbar-baltimore/tashbar-app`.
    - `src/`: app code.
    - `packs/`: lesson packs.
    - `web/`: site builder, and pictures in `web/pics/`.
    - `tests/`: the test kit.
    - `tools/`: helpers.
  - **Coordination:** GitHub Issues and pull requests, plus the **HQ LOG** folder in Drive for short notes.
- **Publishing is automatic.**
  1. You (with Claude) work on a branch named `yourname/short-topic`.
  2. Run `node tests/run.js`. Everything must pass.
  3. Open a pull request using the template.
  4. When GitHub's `test` check passes, **auto-publish merges it and puts it live in about 15 minutes**.
  - **Nobody reviews it, so you are the reviewer.** Test as if it goes straight to the boys, because it does.
  - To stop a pull request from going live, add the label **`hold`**.
  - **Never deploy by hand, never use clasp, never push straight to main.**
- **The HQ LOG** (Drive folder `1NOL4XyWQgf5wm60gGNbmVG6ujY6RBIGS`). Short notes, named like `2026-11-19_1520-ET__CLAUDE__CHANGE+RELEASE__what-went-live__yourname.md`.
  - **CLAIM:** before a big piece of work, so two people don't do the same thing.
  - **CHANGE+RELEASE:** after anything goes live. Include what changed, the PR link, and anything for the rebbe.
- **Kodesh content** goes live first and is reviewed by a rebbe afterwards. List it under "REBBE: review after live" in the pull request and the LOG note.
- **Updates to the HoS:** short and plain. One line on what will go live. Ask only for real decisions.

---

## 3. The rules

### Always
- One topic per branch and per pull request. Small is better.
- Tests pass before opening a pull request. Include a phone-size (390 px) screenshot of anything boys see.
- Lesson packs:
  - change the file in `packs/`;
  - update its line in `TL_PACKS` in `src/ContentPacks.js` (sha256 and bytes) in the same pull request.
- Add-on `.html` files use `/* */` comments, never `//`.
- A new add-on must be registered in both `Photos.js` and `Speed.js`.
- `src/appsscript.json` keeps `webapp.access` = `ANYONE_ANONYMOUS`.
- `QuestPage.html` is full: new student-page code goes in its own add-on file.

### Teaching standard (HoS, binding on every lesson)
- Each unit opens with a brief, clear, inspiring, patient lesson, then hands-on practice. Teach real skills; no wasted time.
- No plain multiple choice in practice. Check questions stay tap kinds.
- Every question has a kid-friendly "How to do it" box.
- Modest, warm, normal frum family life. Use a wide mix of names. Kosher food only.
- Never write the Divine Name: use ה׳, and אלקים for Elokim.
- The server sets every money amount. No T$ or rewards on staff or admin screens.

### Picture rules (PICS-1)
- **People:** boys and men only, with **no women or girls anywhere**, even small in the background.
- **Settings:** frum, modest settings, and kosher food.
- **Not allowed:** churches, crosses or other religions' symbols; alcohol, Halloween or fantasy creatures.
- **Body topics:** drawings or models only, never photos of people.
- **Kosel:** the stones only, no crowds.
- **When in doubt, leave it out.**
- **Licences:**
  - **Allowed:** public domain, CC0, CC BY, CC BY-SA, the Pixabay or Pexels licence, the Library of Congress "no known restrictions", or our own photos.
  - **Record** the source, licence and author for every file in `web/pics/SOURCES.md`.
  - **Never:** modern publisher pages (ArtScroll, Koren and similar), textbooks, or Google Images.
- **Never give the answer away:**
  - A label is allowed only where the screen's "how" line already teaches that word.
  - Pure question screens (no "how" line) get the plain picture with no marks.
  - The caption must not name or describe the answer.
  - Skip any picture that is itself the answer.

### Never
- Put real student names, codes or data in the repository, tests, screenshots, issues or chat.
- Ask anyone for a password or a 2-step code.
- Paste API keys or tokens into a chat.
- Edit the Apps Script editor.
- Deploy by hand.
- Change Google Cloud permissions, billing or policies (tell the HoS what to click instead).
- Send automatic emails or summaries to anyone.

---

## 4. Master prompt: real pictures across the app (PICS-1)

Paste this into a **new** Claude Code session with `tashbar-baltimore/tashbar-app` selected:

```
use a workflow

You are continuing PICS-1 for the Tashbar Baltimore learning app: real, high-quality pictures on every
lesson screen that talks about something a boy should see, with a red box, arrow and short label on the
part the lesson talks about. developer@ and the Head of School have approved this work.

SETUP
1. Read CLAUDE.md, CONTRIBUTING.md and docs/HANDOFF-PICS.md first.
   CLAUDE.md wins where they differ: publish ONLY by pull request (auto-publish makes it live when the
   test check passes). Never push to main, never use clasp, never deploy by hand.
2. Check the environment: PIXABAY_KEY and PEXELS_KEY are set, and the Allowed domains in the hand-off work.
   If anything is missing, tell me in one line what to add, then continue with what works.
3. Build the screen list from the code, not the audit sheet:
   python3 tools/pics-screens.py /tmp/screens.json
   node tools/pics-check.js src/RealPics.html /tmp/screens.json web/pics   (must say 0 problems)
   Every new link uses the exact key 'LESSON.ID|question' from screens.json.

FIRST PULL REQUEST: make the checker enforce the rules (small, before any pictures)
Add to tools/pics-check.js, and make tests fail on any of these:
- a mark (box/label) on a screen whose "how" line is empty (pure question screen);
- a label with a word that is not in that screen's "how" line;
- a TL_PICS entry missing source, licence, author or alt;
- a picture file over 200 KB or wider than 1200 px.
Fix any existing link that breaks these, run node tests/run.js, open the pull request, wait for it to go live.

PICTURE SOURCES, best first
1. Our own photos: Drive folder "PICS inbox" in HQ, if it exists. A staff photo of the real object always
   wins. Licence: "Tashbar Baltimore own photo", author: the staff member's first name only.
2. Pixabay API (safesearch=true), then Pexels API.
3. Library of Congress (history, Eretz Yisrael, Judaica; Matson collection), NASA/NOAA/USGS/NIH.
4. Wikimedia Commons last (rate-limited: standard thumbnail sizes only, pause about 12 s between calls).

THE RULES (none of them bend)
- Picture rules: boys and men only, no women or girls anywhere, even small in the background. Frum,
  modest settings. Kosher food. No churches, crosses or other religions' symbols. No alcohol,
  Halloween or fantasy creatures. Body topics: drawings or models only. Kosel: stones only, no crowds.
  When in doubt, leave it out.
- Licences: public domain, CC0, CC BY, CC BY-SA, Pixabay or Pexels licence, LOC "no known restrictions",
  our own photos. Record source, licence and author for every file. Never modern publisher pages,
  textbooks or Google Images.
- Never give the answer away:
  - labels only where the screen's "how" line already teaches that word;
  - pure question screens get the plain picture with no marks;
  - the caption (alt) must not name or describe the answer;
  - skip the picture when the picture itself is the answer (for example a caterpillar for "What
    hatches from a butterfly egg?").
- Quality: sharp and well lit, the thing fills the frame, no watermarks or text overlays.
  WebP, at most 1200 px wide, about 150 KB or less.
- Kodesh pictures go on the rebbe review list.

WORK
4. Group the remaining screens by THING (frog, magnet, map of Eretz Yisrael, Gemara daf...). One picture
   serves many screens. Work the things that cover the most screens first.
5. Run a workflow that fans out by subject: science animals, body, plants, earth, matter, sky; social
   studies; computing; electives; life skills; the remaining Kodesh.
   - Each WORKER: lists its screens from screens.json; searches the sources in order; drops anything
     whose tags break the rules; makes a contact sheet and looks at every candidate; picks the best;
     crops into web/pics with a SOURCES.md line; writes TL_PICS and TL_PIC_MAP entries.
   - Each worker saves its work after every picture, so a restart or usage limit loses nothing.
   - Each worker returns its entries and files. It does NOT publish.
6. A separate CHECKER per subject opens every chosen picture and every link and removes anything doubtful:
   the picture rules, the answer rules above, the licence, and that each box sits on the part it names.
7. Merge each subject into src/RealPics.html as its own TL_PIC_ADD block. Then:
   - run pics-check.js (0 problems) and node tests/run.js (all pass);
   - draw sample screens through the real add-on with tools/pics-sheet.js, both labelled screens and
     pure question screens;
   - look at the sheets yourself.

PUBLISH
8. One pull request per subject, about 100 to 300 screens each, on branch yourname/pics-<subject>.
   Fill in the template. List the Kodesh pictures under "REBBE: review after live".
9. Watch each pull request until it merges and the site publishes. Then confirm a few picture URLs load at
   https://tashbar-learning-live.web.app/pics/ before opening the next one, so two never clash.
10. After each subject is live, write a short CHANGE+RELEASE note in the HQ LOG (Drive folder
    1NOL4XyWQgf5wm60gGNbmVG6ujY6RBIGS): screens, pictures, PR link, rebbe list.

Give me a short, plain update after each subject: how many screens, how many pictures, and one sample sheet.
Stop only when a real decision is needed or the keys are missing.
```

### Where PICS-1 stands (2026-11-19)
- **Live:** 534 screens and 235 pictures (batches 1–8; the latest are tashbar-baltimore/tashbar-app#49 and tashbar-baltimore/tashbar-app#50).
- **Still to do:** about 2,000 of the 2,565 screens on the HQ "PICS-1 audit" sheet.
- **Lessons learned:**
  - The audit sheet often lacks lesson IDs. Always match screens with `tools/pics-screens.py`.
  - Many "teaching" screens also end in a question, which is why the label rule above exists.
  - Small rounds survive usage limits and restarts much better than one huge run.
