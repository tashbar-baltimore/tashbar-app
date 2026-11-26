# Keser Girls 3.0

**What this is (Head of School, Rabbi Khaver, 2026-11-26):** "I want to make a third app geared for girls. Keser Girls 3.0."
A separate, clean learning app for girls, at its own link: **https://keser-girls-3.web.app**. 1.0 and 2.0 (the boys' apps) stay exactly as they are.

## Who owns Keser Girls 3.0 (HoS 2026-11-26)
**M. Heinemann leads and owns Keser Girls 3.0.** In the HoS's words: "She's gonna be leading and owning this 3.0 edition. She's gonna have all authorities that are needed to allow anything that's needed and to break any other created rules. She's going to have the final deciding ability. So please refer all questions to her, and please give her all information and access is needed."
- **Every question about Keser** goes to her: what to build, how it looks, lessons, pictures, records, rules. A builder working in someone else's session sends the question to her by email. Her address is her school email; it is **not written here because this repository is public**, so ask the HoS for it.
- **She has the final say.** She may approve anything for Keser and change or set aside any Keser rule (in this file, `FEATURES.md`, `PICTURE-ORDERS.md` or the prompts). Her Claude writes each such decision, with the date, in `keser/DECISIONS.md`. Where a school-wide rule in `CLAUDE.md` seems to block her, tell her plainly and do what she decides.
- **Keep her informed.** Give her every look link, every open Keser pull request and every picture order, and tell her what is waiting on her.
- She works in her own Claude with `keser/START-PROMPT.md`.

## The one rule
**Nothing goes into Keser Girls 3.0 without an approver's "yes".** Approvers are on `keser/APPROVERS.json` (today: M. Heinemann, the owner, and Rabbi Khaver).
The yes is one line her or his Claude posts on the pull request: `APPROVED FOR KESER — <name>`, and only after that person looked at the newest look link and said to approve. No one else ever posts it.

## How a piece gets in (like 2.0)
1. Pick one piece (`keser/FEATURES.md`): something new, or a piece of 1.0 / 2.0.
2. Build it clean in `keser/` (a copy, so a change to the boys' apps never leaks in), made right for girls.
3. Test it as a made-up girl at Chromebook size (1366×768) and phone size; look at every screen; pictures in the pull request.
4. Open a pull request that changes only `keser/` (and the shared art library `art/`). When its tests pass, `keser-gate` puts it on a private **look link** and posts it on the pull request.
5. The approver looks, asks for changes, looks again. When she or he says "approve it", Claude posts `APPROVED FOR KESER — <name>`. Then it merges and goes live (about 5 minutes).

## Rules for Keser Girls 3.0
- Every rule of the school applies (teaching standard, no Divine Name, no word "bite", no real student data, no money on staff screens, modest frum family life, kosher food), except that **it is written for girls**: girls' names, girls in the stories and pictures.
- **Pictures (HoS 2026-11-26):** Keser Girls 3.0 may show girls and women, modestly dressed, in modest frum settings. Those pictures still live in the shared library `art/`, with **"Keser Girls only"** in the catalog's "what it shows" cell, and are never used in 1.0 or 2.0. All other picture rules stay the same (`docs/HANDOFF-PICS.md`). Pictures with no people (maps, objects, nature) are shared with the boys' apps as usual.
- **Students:** the girls' records are kept separate from the boys'. How (a separate server or database) is decided by M. Heinemann when the sign-in piece is built.

## For builders
- **Buttons and labels:** every button a girl sees comes from the Keser kit `app/kit.css` (`.k-btn`, `.k-icon`, `.k-foil`, `.k-dots`). Do not draw your own.
- **Pictures:** orders and the girls' cast are in `PICTURE-ORDERS.md` (the image account's address is never written in the repository).
- A Keser pull request changes **only** `keser/` and `art/`. One that also changes 1.0 or 2.0 files is refused.
- Never publish by hand. `publish-keser` puts it live only after `keser-gate` has seen an approver's yes.
- Tests: `tests/lib/kesercheck.js` (builds on its own, gate wired, no "bite" / Divine Name). A piece may bring its own tests in `keser/tests/*.js` (each exports `async (browser) => ({ fails, oks })`).
