#!/usr/bin/env bash
# Deploys the Firebase server function. Copies the app's server code (src/ and server/) next to it first.
set -euo pipefail; cd "$(dirname "$0")/.."
rm -rf functions/app && mkdir -p functions/app && cp -r server src functions/app/
node --check functions/index.js
python3 web/token.py /tmp/.fbtok >/dev/null
export CLOUDSDK_AUTH_ACCESS_TOKEN=$(cat /tmp/.fbtok) CLOUDSDK_CORE_PROJECT=tashbar-learning-live CLOUDSDK_CORE_DISABLE_PROMPTS=1 CLOUDSDK_BILLING_QUOTA_PROJECT=tashbar-learning-live
printf 'node_modules\n' > functions/.gcloudignore
gcloud functions deploy api --gen2 --region=us-east4 --runtime=nodejs22 --source=functions --entry-point=api --trigger-http --allow-unauthenticated --memory=4Gi --cpu=2 --timeout=1800s --max-instances=50 --min-instances=3 --concurrency=40 --set-secrets=TL_EXPORT_KEY=tl-export-key:latest 2>&1 | grep -E "state:|ERROR|uri:" || true
rm -f /tmp/.fbtok
