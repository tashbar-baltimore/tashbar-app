#!/bin/bash
# usage: next2.sh <branch> <title> <prev-merge-grep> <prev-check-file> <lane> [<lane>...]
set -e
S=/tmp/claude-0/-home-user-tashbar-app/42af2cc6-8d7d-5106-8c35-0fbc61680814/scratchpad; B=$1; T=$2; PREV=$3; PF=$4; shift 4
cd /home/user/pub
ok=; for i in $(seq 1 480); do git fetch -q origin main; git log origin/main --oneline -25 | grep -qi "$PREV" && { ok=1; break; }; sleep 30; done
[ -n "$ok" ] || { echo "FAILED: prev merge not seen"; exit 1; }
git log origin/main --oneline -25 | grep -i "$PREV" | head -1
git checkout -q -B $B origin/main
for L in "$@"; do node tools/pics-lane.js merge $S/lanes/$L "PICS-1 round 2 $L (2026-11-21): independently checked"; done
python3 tools/pics-screens.py $S/screens-main.json >/dev/null
node tools/pics-check.js src/RealPics.html $S/screens-main.json web/pics | tail -3
node tests/run.js > $S/test-${B##*/}.log 2>&1 || { echo TESTS FAILED; tail -30 $S/test-${B##*/}.log; exit 1; }
grep -E "^TIMINGS|^COUNTS|pictures:" $S/test-${B##*/}.log
for i in $(seq 1 240); do c=$(curl -s -o /dev/null -w "%{http_code}" https://tashbar-learning-live.web.app/pics/$PF); [ "$c" = 200 ] && break; sleep 30; done
[ "$c" = 200 ] || { echo "FAILED: prev pic not live"; exit 1; }
echo "prev live: $PF $c"
git add -A src/RealPics.html web/pics
git commit -qm "$T

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01AAtYyoKg7AckFAFv2av6MC"
git push -q -u origin $B 2>&1 | grep -v "^remote:" || true
echo "PUSHED $B"
