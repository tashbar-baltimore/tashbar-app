# Long texts (the content store)

Stories, chapters, articles, poems and plays for Core Growth. Each job keeps its texts in its own folder, `texts/<JOB>/<ID>.txt`. Read `docs/core-growth/HOW-TO-ADD-A-TEXT.md`.

These texts are **not** in the start-up download. The site serves each one as `/texts/<ID>.json` (built by `web/build.js`), and the boy's page loads it only when he opens it.

Check every text with:

```bash
node tools/core/texts.js check
```
