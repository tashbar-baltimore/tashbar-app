# Adding a builder (one time per person, about 10 minutes)

Every builder works the same way: their own Claude account + their own free GitHub account, both connected to this one repository. No passwords are shared. No paid plan is needed.

## The person does
1. **Make a free GitHub account** at https://github.com/signup with their school email (e.g. `1cc@tashbarbaltimore.org`). Turn on two-step sign-in when GitHub offers it.
2. **Accept the invitation** email from GitHub to join `tashbar-baltimore`.
3. **In Claude** (claude.ai, school account): open **Claude Code** (the Code toggle at the top) → **Connect GitHub** → allow it → choose repository **tashbar-baltimore/tashbar-app**.
4. **Start every session with:**
   ```
   Work in tashbar-baltimore/tashbar-app. Read CLAUDE.md and CONTRIBUTING.md first and follow them.
   My task: <one task, or "take the next open issue labelled for me">.
   When done, open a pull request with the tests passing. It goes live by itself.
   ```

## The Head of School (or a lead) does
- Invite the person: GitHub → `tashbar-baltimore` → **People** → **Invite member** → their school email → role **Member**.
- Nothing. Pull requests that pass the tests are merged and published automatically (auto-publish). To stop one, add the label `hold`; to pause everything, set the repository variable `AUTO_PUBLISH` to `off`.

## Why this way
- One source (this repository), many builders in parallel on separate branches: no editor lock, no daily Google sign-in.
- `CLAUDE.md` loads the rules and the teaching standard into every Claude session automatically, so nobody has to paste the long standing prompt.
- Nothing reaches the boys unless it passes the tests; then it goes live by itself, and any release can be undone by publishing the version before it.
