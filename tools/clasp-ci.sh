#!/usr/bin/env bash
# Shared steps for the GitHub Actions that talk to Google. Never prints the sign-in token.
set -euo pipefail
SCRIPT_ID="1Nk4F9WGVvZDpknUzcdJzdSNSiJrEufWpl-P5P62s15B3iWf0lLHHyvnf"
DEPLOYMENTS=("AKfycbwcTw8upBIAN3n1D36TON-3u6_VQdo-6zLYJT_bMa11yeFwN9IhL_saGDciQP5QK70pEw" "AKfycbyPlajTiSGN6svBmVZ945nfDRua7LlRHFQIxW2QN72IgFnwIzykpmQO0Gh1CHuQovkUeA")

login() {            # CLASPRC = the whole .clasprc.json, from the "live" environment secret
  [ -n "${CLASPRC:-}" ] || { echo "The CLASPRC secret is not set in the 'live' environment."; exit 1; }
  umask 077; printf '%s' "$CLASPRC" > "$HOME/.clasprc.json"
  npm install -g @google/clasp@3.4.1 >/dev/null 2>&1
}

pull_editor() {      # pull_editor <dir>: what the Apps Script editor holds right now
  rm -rf "$1"; mkdir -p "$1"; printf '{"scriptId":"%s","rootDir":"."}\n' "$SCRIPT_ID" > "$1/.clasp.json"
  (cd "$1" && clasp pull >/dev/null 2>&1); rm -f "$1/.clasp.json"
}

same_as() {          # same_as <editor dir> <repo src dir>: stop with the difference if they are not the same
  if ! diff -rq "$1" "$2" >/tmp/editor.diff 2>&1; then
    echo "STOP: the Apps Script editor is not the same as the repository."
    echo "Someone changed the editor by hand, or an older build is still in it. Files that differ:"; cat /tmp/editor.diff
    diff -ru "$2" "$1" | head -200 || true; exit 1
  fi
}

check_live() {       # each live link must answer 200 with no Google sign-in page
  for id in "${DEPLOYMENTS[@]}"; do
    code=$(curl -sSL -o /tmp/exec.html -w '%{http_code}' "https://script.google.com/macros/s/$id/exec")
    if [ "$code" != "200" ] || grep -q "ServiceLogin\|accounts.google.com/v3/signin" /tmp/exec.html; then echo "Live link $id is NOT healthy (HTTP $code or a sign-in page)."; exit 1; fi
    echo "Live link ${id:0:12}… answers 200 with no sign-in page."
  done
}

deploy_both() {      # deploy_both <version number> <note>
  for id in "${DEPLOYMENTS[@]}"; do clasp update-deployment "$id" -V "$1" -d "$2" | tail -1; done
  clasp list-deployments | grep -c "@$1 " | grep -qx 2 || { echo "Both deployments are not on version $1:"; clasp list-deployments; exit 1; }
}
