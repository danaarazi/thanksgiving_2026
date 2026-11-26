#!/usr/bin/env bash
# Starts the Arazi Thanksgiving welcome screen full-screen in Chromium.
# Run automatically at login by ~/.config/autostart/arazi-thanksgiving.desktop
set -u

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DISPLAY_DIR="$ROOT/display"
PROFILE="$HOME/.config/arazi-thanksgiving-kiosk"
LOG="$HOME/.cache/arazi-thanksgiving.log"
mkdir -p "$(dirname "$LOG")" "$PROFILE"
exec >>"$LOG" 2>&1
echo "=== $(date) starting welcome screen ==="

# Only ever run one copy, even if more than one autostart mechanism fires.
exec 9>"${XDG_RUNTIME_DIR:-/tmp}/arazi-thanksgiving.lock"
if ! flock -n 9; then
  echo "Already running, exiting."
  exit 0
fi

STOP_FILE="$HOME/.config/arazi-thanksgiving.stop"
rm -f "$STOP_FILE"

# Give the desktop a moment to finish starting.
sleep "${ARAZI_START_DELAY:-5}"

# --- Build the photo list from display/photos -------------------------------
{
  echo "// Generated automatically by scripts/launch.sh - do not edit."
  echo "window.ARAZI_PHOTOS = ["
  find "$DISPLAY_DIR/photos" -maxdepth 1 -type f \
    \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' -o -iname '*.webp' -o -iname '*.gif' \) \
    -printf '%f\n' 2>/dev/null | sort | while IFS= read -r f; do
      # escape backslashes and quotes for JavaScript; the page URL-encodes the name
      esc=${f//\\/\\\\}; esc=${esc//\"/\\\"}
      echo "  \"photos/\" + encodeURIComponent(\"$esc\"),"
    done
  echo "];"
} >"$DISPLAY_DIR/photos.js"
echo "Photos found: $(grep -c 'photos/' "$DISPLAY_DIR/photos.js")"

# --- Keep the screen awake (X11 sessions; Wayland is handled by install.sh) --
if [ -n "${DISPLAY:-}" ] && command -v xset >/dev/null 2>&1; then
  xset s off -dpms s noblank || true
fi

# --- Find Chromium ------------------------------------------------------------
BROWSER=""
for b in chromium-browser chromium google-chrome; do
  if command -v "$b" >/dev/null 2>&1; then BROWSER="$b"; break; fi
done
if [ -z "$BROWSER" ]; then
  echo "Chromium not found. Run: sudo apt install chromium-browser (or chromium)"
  exit 1
fi

# Stop Chromium from showing a "restore pages?" bubble after a power cut.
PREFS="$PROFILE/Default/Preferences"
if [ -f "$PREFS" ]; then
  sed -i 's/"exited_cleanly":false/"exited_cleanly":true/; s/"exit_type":"[^"]*"/"exit_type":"Normal"/' "$PREFS"
fi

# Keep relaunching if the browser is ever closed or crashes
# (to close it until the next reboot, run scripts/stop.sh).
while true; do
  "$BROWSER" \
    --kiosk \
    --start-fullscreen \
    --noerrdialogs \
    --disable-infobars \
    --no-first-run \
    --disable-session-crashed-bubble \
    --disable-features=Translate,TranslateUI \
    --disable-pinch \
    --overscroll-history-navigation=0 \
    --check-for-update-interval=31536000 \
    --password-store=basic \
    --allow-file-access-from-files \
    --user-data-dir="$PROFILE" \
    "file://$DISPLAY_DIR/index.html"
  echo "Browser exited with code $? at $(date); restarting in 5s"
  [ -f "$STOP_FILE" ] && { echo "Stop file present, not restarting."; exit 0; }
  sleep 5
done
