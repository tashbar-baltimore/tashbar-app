#!/usr/bin/env bash
# PICS-1: put src/RealPics.html on the Firebase function WITHOUT touching anyone else's server code.
# Downloads the RUNNING function source, checks it has the current engine, swaps only app/src/RealPics.html,
# checks its src equals the given live-editor copy, and redeploys with the running settings.
# Usage: tools/pics-publish-server.sh <folder holding a fresh pull of the live editor>
set -euo pipefail; REPO="$(cd "$(dirname "$0")/.." && pwd)"; ED="$1"; W="$(mktemp -d)"
python3 "$REPO/web/token.py" /tmp/.fbtok >/dev/null
export CLOUDSDK_AUTH_ACCESS_TOKEN=$(cat /tmp/.fbtok) CLOUDSDK_CORE_PROJECT=tashbar-learning-live CLOUDSDK_BILLING_QUOTA_PROJECT=tashbar-learning-live CLOUDSDK_CORE_DISABLE_PROMPTS=1
SRC=$(gcloud functions describe api --gen2 --region=us-east4 --format='value(buildConfig.source.storageSource.bucket,buildConfig.source.storageSource.object)' | tr '\t' '/')
gcloud storage cp "gs://$SRC" "$W/src.zip" >/dev/null 2>&1; (cd "$W" && unzip -q src.zip -d fn)
grep -q mergePlan "$W/fn/app/server/fsstore.js" || { echo "the running server has the OLD engine: stop and tell the LOG"; exit 1; }
cp "$REPO/src/RealPics.html" "$W/fn/app/src/RealPics.html"
D=$( (diff -rq "$W/fn/app/src" "$ED" --exclude=.clasp.json || true) | wc -l)
if [ "$D" != 0 ]; then echo "running server src differs from the published editor in $D files:"; { diff -rq "$W/fn/app/src" "$ED" --exclude=.clasp.json || true; } | head
  if [ "${SYNC_EDITOR:-}" = 1 ]; then echo "SYNC_EDITOR=1: copying the published editor into src (as the hand-off says)"; (cd "$ED" && for f in *.js *.html appsscript.json; do [ -f "$f" ] && cp "$f" "$W/fn/app/src/$f"; done)
    D2=$( (diff -rq "$W/fn/app/src" "$ED" --exclude=.clasp.json || true) | wc -l); [ "$D2" = 0 ] || { echo "still differs: stop"; exit 1; }
  else echo "re-run with SYNC_EDITOR=1 to bring the server in line with the published editor"; exit 1; fi; fi
node --check "$W/fn/index.js"; printf 'node_modules\n' > "$W/fn/.gcloudignore"
gcloud functions deploy api --gen2 --region=us-east4 --runtime=nodejs22 --source="$W/fn" --entry-point=api --trigger-http --allow-unauthenticated --memory=4Gi --cpu=2 --timeout=1800s --max-instances=50 --min-instances=4 --concurrency=6 --set-secrets=TL_EXPORT_KEY=tl-export-key:latest 2>&1 | grep -E "state:|ERROR"
gcloud run revisions list --service=api --region=us-east4 --format='value(metadata.name,metadata.creationTimestamp)' --limit=1
rm -f /tmp/.fbtok
