#!/usr/bin/env bash
# Regenerate images/og.png (1200x630) from src/og.html using headless Chrome.
# The font is served same-origin so @font-face resolves; output is written
# straight to images/og.png. Run after editing src/og.html.
set -euo pipefail
cd "$(dirname "$0")/.."

CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
if [ ! -x "$CHROME" ]; then
  echo "Chrome not found at: $CHROME (set CHROME=/path/to/chrome)" >&2
  exit 1
fi

python3 -m http.server 8137 >/dev/null 2>&1 &
SRV=$!
trap 'kill $SRV 2>/dev/null' EXIT
sleep 1

"$CHROME" --headless=new --disable-gpu --no-sandbox --hide-scrollbars \
  --force-device-scale-factor=1 --window-size=1200,630 \
  --default-background-color=00000000 \
  --screenshot=images/og.png "http://localhost:8137/src/og.html" >/dev/null 2>&1

echo "wrote images/og.png"
