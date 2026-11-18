# Current state

Synced from the live app on 2026-11-18 by rabbikhaver-cloud-builder-3. The Drive HQ notes (CURRENT_STATE, LOG) stay the record. Head of School decision 2026-11-16 0125Z: GitHub is a backup with tests, not the way changes are published.

## Live
- Both live links are on **v384**. Access: `ANYONE_ANONYMOUS`.
- `src/` = the Apps Script editor at v384, byte for byte. `packs/` = the 19 live lesson packs (each matches its line in `src/ContentPacks.js`).
- Students use **https://tashbar-learning-live.web.app** (Firebase). The Cloud Function `api` (us-east4) runs `functions/index.js` + `server/` + a copy of `src/`.
- `functions/index.js` and `server/` here = the source of the running function (revision api-00041, downloaded from its source archive). Before this sync, GitHub was older than the running server.

## Deploying the Firebase function
- `tools/deploy-function.sh` copies `server/` and `src/` next to `functions/index.js` and deploys with the running settings: 4 GiB, 2 CPU, timeout 1800 s, min 4 / max 50 instances, 6 requests per instance, secret `TL_EXPORT_KEY`.
- Put the editor's current code in `src/` first (`clasp pull`). If someone may have deployed since the last sync, download the running source first and compare (the LOG entry 2026-11-17_2233Z says how).

## Recent releases (newest first)
| Version | What |
|---|---|
| v384 | Music: the 16 high-energy tracks (EDM, trance, techno, drum & bass) play in Happy Mix; no "club" wording |
| v383 | Science grades 6–8: 8 units, 32 skills (new pack ScienceMore2) |
| v382 | High-energy music (original tracks made live by Web Audio) |
| v381 | Social Studies pictures TL_SOC_ART1–9 (SocialMore 3e3ec2fe) |
| v380 | Canteen review fixes |
| v379 | WelcomeJoy: celebration welcome, fanfare, Happy Mix on "Let's go!" |
| v378 | Canteen overhaul: no interest anywhere, Canteen Cash counted by code, pay when you order |
| v373–v377 | Organized home + Library v2; Pathfinder answer-key fix; Mastery Review for every boy |
| v337–v339 | Pathfinder (general K–8 and Kodesh) live for every real boy; daily path on |

## Rules in force (Head of School)
- Teaching rule (2026-11-17): review until automatic; direct step-by-step teaching in a planned sequence; smallest parts mastered first.
- No interest anywhere in the app (2026-11-17); interest is taught only as a topic.
- Hands-on practice: no plain multiple choice in practice. Check questions stay tap kinds.
- Family Life rule: modest, warm, normal frum family life; wide mix of names.
- Kodesh is reviewed by a rebbe after it is live.

## Known test results (test kit, editor v384 + all live packs)
- 1,330 lessons build with well-formed questions.
- `LK.CHEM.L04.07` cannot be played to "mastered" by the test kit (in every run since at least v378).
- The staff portal shows nothing within 60 s inside the test kit.
