# Publishing: how it is wired

## We use the LIGHT VERSION (Head of School, 2026-11-16)
- Creators open pull requests. The `test` check runs by itself. The Head of School or a lead approves and merges.
- **Going live:** the Head of School tells ONE builder chat "publish". That chat, signed in to clasp as the school owner, runs `tools/publish-from-chat.sh publish`. It runs the tests, stops if anyone changed the editor by hand, pushes main, makes ONE version, moves BOTH live links, checks them, and tags the commit `vN`.
- **Rolling back:** the same chat points both live links at an earlier version (`clasp update-deployment <id> -V <n>` for both ids in `tools/clasp-ci.sh`) and checks them.
- Nobody else pushes to the editor. GitHub does not force these rules on the free plan; everyone follows them.
- Lesson packs: a pack change still needs a chat with Drive access to upload the file and put its id, sha256 and size in `src/ContentPacks.js` in the same pull request.

The rest of this page describes the FULL version (buttons inside GitHub). It is optional and can be added later.

## The four buttons (GitHub → Actions)
| Name | When it runs | What it does |
|---|---|---|
| test | every pull request | runs `tests/run.js`; must pass |
| push-to-test | after a merge to main | puts main into the Apps Script editor (HEAD). Uses no version slot. Try it at the `/dev` link |
| publish | by hand | makes ONE version, points BOTH live links at it, checks both links, tags the commit `vN`. Refuses if the editor differs from main and shows the difference |
| rollback | by hand | points BOTH live links at an earlier version you type |

All three that talk to Google are **off** until the repository variable `GITHUB_PUBLISHING` is set to `on`.

## What the owner must set up (once)
1. **A paid GitHub plan for this repository (Team, or Pro).** On the free plan a private repository cannot have: required pull requests, required tests, required approvals, code owners that are enforced, or protected "environments". Without it the rules are only a promise.
2. **Environment `live`** (Settings → Environments): allow only the `main` branch, and add the Head of School as a required reviewer.
3. **Secret `CLASPRC`** inside that environment: the whole contents of a `.clasprc.json` made by `clasp login` as the school owner account. Keep it in the environment, not as a plain repository secret, so only approved runs from `main` can use it.
4. **Variable `GITHUB_PUBLISHING` = `on`** (Settings → Secrets and variables → Actions → Variables) on the day of the switch.
5. **Branch protection on `main`**: require a pull request, require the `test` check, require 1 approval, require review from code owners.

## Lesson packs (not solved yet)
The live app reads 14 lesson packs from Google Drive and checks each against the fingerprint in `src/ContentPacks.js`. The publish button does not upload packs. Until that is built:
- A change to a pack needs someone with Drive access to upload the new file to the packs folder and put its new id, sha256 and size in `src/ContentPacks.js` in the same pull request as the `packs/` change.
- The tests keep `packs/` and the table in step.

## The switch from the old way
Until the Head of School says the switch is done, builders keep using the Drive LOG lock. After the switch nobody pushes with clasp by hand; push-to-test will stop and show the difference if someone does.
