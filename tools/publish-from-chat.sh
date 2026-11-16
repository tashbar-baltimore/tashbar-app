#!/usr/bin/env bash
# LIGHT VERSION publish: run by ONE builder chat that is signed in to clasp as the school owner.
# Usage: tools/publish-from-chat.sh check      (is the editor the same as the last published commit?)
#        tools/publish-from-chat.sh publish    (push main to the editor, make ONE version, move BOTH live links)
# live.json records which commit is live (this session cannot push git tags).
# It refuses if you are not on an up-to-date main, if tests were not run, or if someone changed the editor by hand.
set -euo pipefail
cd "$(dirname "$0")/.."; source tools/clasp-ci.sh; export NODE_USE_ENV_PROXY=1
[ -f "$HOME/.clasprc.json" ] || { echo "Not signed in to clasp. Run clasp login as the school owner first."; exit 1; }
git fetch -q origin main --tags
[ "$(git rev-parse --abbrev-ref HEAD)" = "main" ] && [ "$(git rev-parse HEAD)" = "$(git rev-parse origin/main)" ] && [ -z "$(git status --porcelain)" ] || { echo "Be on a clean, up-to-date main first."; exit 1; }
ver=$(node -p "require('./live.json').version"); lastc=$(node -p "require('./live.json').commit"); last="v$ver"
pull_editor /tmp/editor; mkdir -p /tmp/lastpub && rm -rf /tmp/lastpub/src && git archive "$lastc" src | tar -x -C /tmp/lastpub
same_as /tmp/editor /tmp/lastpub/src; echo "The editor matches $last."
[ "${1:-check}" = "publish" ] || exit 0
git diff --quiet "$lastc" HEAD -- src || true; [ -n "$(git diff --name-only "$lastc" HEAD -- src)" ] || { echo "Nothing new in src/ since $last."; exit 0; }
grep -q 'ANYONE_ANONYMOUS' src/appsscript.json || { echo "appsscript.json access changed. Stop."; exit 1; }
node tests/run.js >/tmp/test.out 2>&1 || { tail -15 /tmp/test.out; echo "Tests failed. Not publishing."; exit 1; }
git log --first-parent --pretty='- %s' "$lastc..HEAD" -- src | head -12 > /tmp/note.txt
clasp push -f | tail -1; pull_editor /tmp/after; same_as /tmp/after src
out=$(clasp create-version "GitHub publish: $(tr '\n' ' ' < /tmp/note.txt | cut -c1-200)" | tail -1); echo "$out"; n=$(echo "$out" | grep -o '[0-9]\+$')
deploy_both "$n" "v$n (GitHub publish)"; check_live
printf '{\n  "version": %s,\n  "commit": "%s",\n  "published": "%s"\n}\n' "$n" "$(git rev-parse HEAD)" "$(date -u +%Y-%m-%dT%H:%MZ)" > live.json
git add live.json && git commit -q -m "Published v$n" -m "$(cat /tmp/note.txt)" && git push -q origin main; echo "PUBLISHED v$n"; cat /tmp/note.txt
