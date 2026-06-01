#!/usr/bin/env bash
# Recompute the CSP sha256 hash for the inlined theme script.
#
# The theme toggle is inlined into the <head> of every page (a minified copy of
# js/theme.js) so it costs no request and still runs before first paint. The
# strict CSP allows it via a 'sha256-...' source instead of 'unsafe-inline'.
#
# If you change the inline <script>, run this to get the new hash, then replace
# the 'sha256-...' token in the script-src directive of every page's CSP
# (index.html, building/index.html, leading/index.html). All pages must carry
# the same inline script and therefore the same hash.
set -euo pipefail
cd "$(dirname "$0")/.."

hash=$(python3 - <<'PY'
import re, hashlib, base64
html = open('index.html', encoding='utf-8').read()
m = re.search(r'<script>(.*?)</script>', html, re.S)
if not m:
    raise SystemExit('no inline <script> found in index.html')
print('sha256-' + base64.b64encode(hashlib.sha256(m.group(1).encode()).digest()).decode())
PY
)

echo "CSP token: '$hash'"
echo "Verifying all pages carry this hash in their CSP..."
for f in index.html building/index.html leading/index.html; do
  if grep -q "$hash" "$f"; then
    echo "  ok    $f"
  else
    echo "  STALE $f  (update the sha256 token in its script-src)"
  fi
done
