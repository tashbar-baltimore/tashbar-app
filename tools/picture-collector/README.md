# Picture collector

Collects safe, freely licensed photos of animals, plants, tools and places for lessons, and records who took each one.
The pictures are saved in a folder on the computer that runs it (`picture-library/`, next to `tools/`). They are **never committed to git** and never hotlinked.

## Run it (school computer, about 2 hours for all 784 topics)
1. Install Node.js (free, nodejs.org, version 18 or newer).
2. Put the Pixabay key in the environment: `export PIXABAY_KEY=…` on Mac/Linux, or `set PIXABAY_KEY=…` on Windows. The tool never prints or saves it.
3. From the repository folder run `node tools/picture-collector/collect.js`.
4. If it stops (sleep, internet, Ctrl+C), run the same command again. It carries on where it left off.

Small runs: `--first 10`, or `--only barn-owl,saturn`. A different folder: `--out D:\pictures`.

## What it does
- **Sites, in this order:** Wikimedia Commons, then Pixabay (and Pexels once `PEXELS_KEY` exists), then NASA (space topics only) and the Library of Congress (history topics only). Openverse only fills a topic the others leave short, because its matches were the loosest in the test run and it allows only 200 searches a day without an account.
- **How many:** 8 pictures per topic (up to 10 for space and history topics).
- **Licences kept:** CC0, public domain, CC BY, CC BY-SA, the Pixabay Content License, NASA media, and Library of Congress items marked "no known restrictions". Non-commercial (NC), no-derivatives (ND), GFDL-only and anything unclear are skipped.
- **Pictures skipped:** narrower than 800 px, duplicates (same file, or same picture page), drawings/maps/statues, and anything whose title, tags or description has a blocked word. The blocked words are listed in `lib.js` (`BLOCK_WORDS`). A picture must also name the topic in its own words. `topics.json` can list `avoid` words for mix-ups (e.g. the ship *USS Fort McHenry*).
- **Being polite:** a pause between requests to each site, honouring Pixabay's and Openverse's rate-limit headers, waiting and retrying on "too many requests", caching Pixabay searches for 24 hours, and a User-Agent naming the app. Only the allowed sites are contacted. A picture hosted anywhere else is skipped and the site is named in the summary.

## Files it writes (in `picture-library/`)
| File | What |
|---|---|
| `images/<category>/<topic>/…` | the pictures |
| `credits.json` | one entry per picture: topic, source, original page URL, author, licence name + URL, file name, size |
| `credits.html` | the Credits page for the app |
| `review.html` | gallery to check every picture by eye |
| `state.json` | progress, so a re-run continues; also counts of skipped pictures by reason |

## A person must still look
Word filters miss things: in the test, a hammer-and-sickle artwork, a woman in a sleeveless dress, and a fantasy picture with a church outline all had harmless titles. Open `review.html`, then remove anything wrong:

`node tools/picture-collector/reject.js barn-owl-pixabay-1a2b3c4d.jpg …`

It is deleted, never downloaded again, and the next `collect.js` run tops the topic back up.

## Changing the topics
Edit `topics.json`. Each line is `id`, `name`, `category`, `group`, `query` (what to search for), optional `extra` (`nasa`/`loc`), and optional `avoid` words.
