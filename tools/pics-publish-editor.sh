#!/usr/bin/env bash
# PICS-1: publish src/RealPics.html to the live Apps Script editor safely, with nothing else changed.
# Pull -> swap ONE file -> pull again to prove nobody changed the editor meanwhile -> push -> pull back and compare -> version -> both deployments.
# Needs clasp signed in as the school owner. Usage: tools/pics-publish-editor.sh "version note"
set -euo pipefail; export NODE_USE_ENV_PROXY=1
NOTE="${1:-PICS-1 pictures}"; REPO="$(cd "$(dirname "$0")/.." && pwd)"; W="$(mktemp -d)"
ID='{"scriptId":"1Nk4F9WGVvZDpknUzcdJzdSNSiJrEufWpl-P5P62s15B3iWf0lLHHyvnf","rootDir":"."}'
pull() { mkdir -p "$1"; (cd "$1" && echo "$ID" > .clasp.json && clasp pull >/dev/null 2>&1); }
pull "$W/base"; cp -r "$W/base" "$W/ed"; cp "$REPO/src/RealPics.html" "$W/ed/RealPics.html"
grep -q "'RealPics'" "$W/ed/Speed.js" || { echo "RealPics is no longer in TL_PART_FILES: stop"; exit 1; }
CH=$( (diff -rq "$W/base" "$W/ed" --exclude=.clasp.json || true) | wc -l); [ "$CH" = 1 ] || { echo "expected exactly 1 changed file, got $CH: stop"; exit 1; }
pull "$W/again"; diff -rq "$W/base" "$W/again" --exclude=.clasp.json >/dev/null || { echo "the editor changed while preparing: run again"; exit 1; }
(cd "$W/ed" && clasp push --force >/dev/null 2>&1)
pull "$W/after"; diff -rq "$W/ed" "$W/after" --exclude=.clasp.json >/dev/null || { echo "after push the editor differs from what was pushed: CHECK NOW"; exit 1; }
V=$(cd "$W/ed" && clasp create-version "$NOTE" 2>&1 | grep -oE "Created version [0-9]+" | grep -oE "[0-9]+")
for d in AKfycbwcTw8upBIAN3n1D36TON-3u6_VQdo-6zLYJT_bMa11yeFwN9IhL_saGDciQP5QK70pEw AKfycbyPlajTiSGN6svBmVZ945nfDRua7LlRHFQIxW2QN72IgFnwIzykpmQO0Gh1CHuQovkUeA; do
  (cd "$W/ed" && clasp update-deployment "$d" -V "$V" -d "v$V $NOTE" 2>&1 | grep -v UNDICI | tail -1); done
echo "published v$V (editor copy kept at $W/ed)"; echo "$W/ed" > "$W/../.pics_last_editor"
