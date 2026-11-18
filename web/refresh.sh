#!/usr/bin/env bash
# Rebuilds the Firebase copy from the live server and deploys it. Needs clasp signed in as the school owner.
set -euo pipefail; cd "$(dirname "$0")/.."
export NODE_USE_ENV_PROXY=1
node web/build.js
# Departments Course map + lesson-plan view: the inventory (src/CurriculumIndex.js) and one file per lesson (web/dist/curriculum/)
[ -d node_modules/jsdom ] || npm i --no-save --no-audit --no-fund jsdom@24.1.3 >/dev/null
node tools/curriculum_index.js web/dist src/Placement.js src/CurriculumIndex.js web/dist/curriculum || echo "curriculum index skipped"
python3 web/token.py /tmp/.fbtok
python3 web/deploy.py tashbar-learning-live /tmp/.fbtok "${1:-rebuild from live}"
rm -f /tmp/.fbtok
