#!/usr/bin/env bash
# LIGHT VERSION publish: run by ONE builder chat that is signed in to clasp as the school owner.
# Usage: tools/publish-from-chat.sh check      (is the editor the same as the last published commit?)
#        tools/publish-from-chat.sh publish    (push main to the editor, make ONE version, move BOTH live links)
# It refuses if you are not on an up-to-date main, if tests were not run, or if someone changed the editor by hand.
set -euo pipefail
cd "$(dirname "$0")/.."; source tools/clasp-ci.sh; export NODE_USE_ENV_PROXY=1
[ -f "$HOME/.clasprc.json" ] || { echo "Not signed in to clasp. Run clasp login as the school owner first."; exit 1; }
git fetch -q origin main --tags
[ "$(git rev-parse --abbrev-ref HEAD)" = "main" ] && [ "$(git rev-parse HEAD)" = "$(git rev-parse origin/main)" ] && [ -z "$(git status --porcelain)" ] || { echo "Be on a clean, up-to-date main first."; exit 1; }
last=$(git tag --list 'v[0-9]*' --sort=-v:refname | head -1)
[ -n "$last" ] || { echo "No vN tag yet. Tag the commit that matches the live editor first (git tag vN)."; exit 1; }
pull_editor /tmp/editor; mkdir -p /tmp/lastpub && rm -rf /tmp/lastpub/src && git archive "$last" src | tar -x -C /tmp/lastpub
same_as /tmp/editor /tmp/lastpub/src; echo "The editor matches $last."
[ "${1:-check}" = "publish" ] || exit 0
[ "$(git rev-parse "$last^{commit}")" != "$(git rev-parse HEAD)" ] || { echo "Nothing new on main since $last."; exit 0; }
grep -q 'ANYONE_ANONYMOUS' src/appsscript.json || { echo "appsscript.json access changed. Stop."; exit 1; }
node tests/run.js >/tmp/test.out 2>&1 || { tail -15 /tmp/test.out; echo "Tests failed. Not publishing."; exit 1; }
git log --first-parent --pretty='- %s' "$last..HEAD" | head -12 > /tmp/note.txt
clasp push -f | tail -1; pull_editor /tmp/after; same_as /tmp/after src
out=$(clasp create-version "GitHub publish: $(tr '\n' ' ' < /tmp/note.txt | cut -c1-200)" | tail -1); echo "$out"; n=$(echo "$out" | grep -o '[0-9]\+$')
deploy_both "$n" "v$n (GitHub publish)"; check_live
git tag -a "v$n" -F /tmp/note.txt && git push -q origin "v$n"; echo "PUBLISHED v$n"; cat /tmp/note.txt
