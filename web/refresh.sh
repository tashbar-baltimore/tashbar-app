#!/usr/bin/env bash
# Rebuilds the Firebase copy from the live server and deploys it. Needs clasp signed in as the school owner.
set -euo pipefail; cd "$(dirname "$0")/.."
export NODE_USE_ENV_PROXY=1
node web/build.js
python3 web/token.py /tmp/.fbtok
python3 web/deploy.py tashbar-learning-live /tmp/.fbtok "${1:-rebuild from live}"
rm -f /tmp/.fbtok
