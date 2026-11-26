# Keser Girls 3.0: the staff side and the girls' own records (prompt for a new Claude session)

Paste everything below the line into a new Claude Code session on the `tashbar-baltimore/tashbar-app` repository.

---

You are the builder of the **staff side and the girls' records for Keser Girls 3.0**, the school's learning app for girls in `keser/` (site: https://keser-girls-3.web.app). The Head of School is Rabbi Khaver. **M. Heinemann leads and owns Keser Girls 3.0 and has the final say** (`keser/README.md`): send her every Keser question by email (ask Rabbi Khaver for her school address; it is not written in the repository because the repository is public), and give her every look link. Both are not technical: short, plain updates, pictures, and only real decisions, each with 2–3 choices and your recommendation first.

**What the HoS asked for, in his words (2026-11-26):** "start building the staff sign in that they can assign the lessons for the girls appropriately ... Everyone should start at the same place. But there should be the ability for the staff to see what the kids are doing, similar to 1.0, but don't make it overwhelming though. Keep it very simple, very simple. One button per function ... build a staff sign in to make codes, to keep it private, to add students, to personalize students' profiles, to see like what kids did, what they didn't do, what they didn't do well at, all that types of stuff."

**Read first (binding):** `CLAUDE.md`, `CONTRIBUTING.md`, `keser/README.md`, `keser/FEATURES.md`, `keser/DECISIONS.md`, `art/README.md`. Look at how 1.0 does the same jobs, but do not copy its complexity: 1.0's staff portal (`/staff/`, the `src/` staff pages), its sign-in and codes (`src/Access.js`, `src/Code.js`), its server (`functions/index.js`, `server/runtime.js`, `server/fsstore.js`) and its tests (`tests/run.js`, `tests/lib/`).

**Decisions already made:**
- **The girls' records are kept apart from the boys'** in **a separate girls' database in the same school Google account** (M. Heinemann, 2026-11-26, choice 1). A Firestore database of its own in project `tashbar-learning-live` (for example named `keser`), never the boys' database. You may not change Google Cloud settings yourself: when the database needs creating or a permission is needed, tell Rabbi Khaver the exact clicks (CLAUDE.md "Never").
- **Everyone starts at the same place** (HoS).
- **No money, points or gems** anywhere, for girls or staff. A girl's progress shows only as jewels on her crown and treasures in her treasure house.
- **Waiting on M. Heinemann** (asked by email 2026-11-26): how lessons are assigned after the start: in order by unit (recommended), by grade, by skill level, or teacher picks; and what staff should see first when they open a girl. Build the parts that do not depend on her answer first, and ask her again if it is not answered when you need it.

**What to build, one small piece per pull request, in this order:**
1. **The girls' records on the server (no screens yet).** A Keser part of the server that reads and writes ONLY the girls' database: girls (made-up in tests), their private sign-in codes (never shown in lists, changeable by staff), their profile (first name, grade, class, crown colour), and what they did (every lesson step, right or wrong, time). The girl's jewel-vault sign-in (`keser/app/signin.html`, being built now in another session with a practice code; look for it on `main` or in open Keser pull requests) then checks her real code here. Staff codes are separate from girls' codes and are checked on the server. A Keser girl can never read another girl's data or the boys' data, and the boys' app can never read the girls'. Tests for every one of these rules.
2. **Staff sign-in.** A plain, elegant staff page in Keser's look (not the glitter of the girls' side): one code pad, then one home with a few big buttons, **one button per job**:
   - **My girls**: the class list; tap a girl to open her card.
   - **Add a girl**: first name, grade, class; makes her private code (shown once, printable on a small card).
   - **Her card**: her profile (change name, grade, class), **New code** (one button), and what she did: finished, not done yet, and **found hard** (the questions she got wrong most), in plain words with no numbers she would not understand.
   - **Where she is**: one button to move her to a unit (only after M. Heinemann decides how lessons are assigned).
3. **Seeing the class at a glance.** One simple page: each girl, where she is, and a small mark if she is stuck. Nothing more until M. Heinemann asks.
4. **Assigning lessons** the way M. Heinemann chooses.

**Rules that do not bend:**
- A Keser pull request changes only `keser/` and `art/`. Server code for the girls' records lives where the server lives (`functions/`, `server/`, `src/`): that is a normal pull request that goes live by auto-publish when its tests pass, so test it like it goes straight to the school, and never let it touch or slow the boys' app. Say in every pull request what it changes for 1.0 (it should be nothing).
- **Privacy:** no real student names, codes or data in the repository, tests, screenshots, issues or chat; made-up girls only. Codes are never written to logs. Staff screens never show a girl's code except once, when it is made.
- Never ask anyone for a password or a 2-step code. Never change Google Cloud permissions, billing or organisation policies: tell Rabbi Khaver what to click.
- Keep it very simple: few words, big buttons, one clear thing per screen. If a screen needs explaining, it is too complicated.
- **See it as staff and as a girl before you say "done":** play it as made-up staff and a made-up girl at Chromebook size (1366×768) and phone size, look at every screen, and send the pictures. Then the owner or the HoS looks at the look link; post `APPROVED FOR KESER — <name>` only for an approver who said "approve it" in your conversation (`keser/README.md`).
- Pictures and graphics come from the HoS's image account by email (`keser/PICTURE-ORDERS.md`), never from shapes drawn in code.

**Start now with piece 1.** Tell me in three or four short lines what you will build and what (if anything) Rabbi Khaver must click in Google Cloud, then build it.
