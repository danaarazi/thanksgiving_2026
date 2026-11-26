#!/usr/bin/env bash
# One-time setup: makes the Arazi Thanksgiving welcome screen start
# automatically, full screen, every time the Raspberry Pi boots.
#
#   Usage:  cd thanksgiving_2026 && ./install.sh
set -euo pipefail

if [ "$(id -u)" -eq 0 ]; then
  echo "Please run this as your normal user (not with sudo): ./install.sh"
  exit 1
fi

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LAUNCH="$ROOT/scripts/launch.sh"
AUTOSTART_DIR="$HOME/.config/autostart"
DESKTOP_FILE="$AUTOSTART_DIR/arazi-thanksgiving.desktop"

echo "==> Making scripts executable"
chmod +x "$ROOT"/scripts/*.sh "$ROOT"/install.sh "$ROOT"/uninstall.sh

echo "==> Checking for Chromium"
if ! command -v chromium-browser >/dev/null 2>&1 && ! command -v chromium >/dev/null 2>&1; then
  sudo apt-get update
  sudo apt-get install -y chromium-browser || sudo apt-get install -y chromium
fi

echo "==> Adding autostart entry: $DESKTOP_FILE"
mkdir -p "$AUTOSTART_DIR"
cat >"$DESKTOP_FILE" <<DESKTOP
[Desktop Entry]
Type=Application
Name=Arazi Thanksgiving Welcome Screen
Comment=Full-screen Thanksgiving slideshow
Exec=/bin/bash "$LAUNCH"
X-GNOME-Autostart-enabled=true
Terminal=false
DESKTOP

if command -v raspi-config >/dev/null 2>&1; then
  echo "==> Setting the Pi to boot straight to the desktop and log in automatically"
  sudo raspi-config nonint do_boot_behaviour B4 || echo "   (could not change boot behaviour - set it in raspi-config > System Options > Boot / Auto Login)"
  echo "==> Turning off screen blanking"
  sudo raspi-config nonint do_blanking 1 || echo "   (could not disable blanking - set it in raspi-config > Display Options > Screen Blanking)"
else
  echo "!! raspi-config not found. Make sure the device auto-logs in to the desktop and screen blanking is off."
fi

cat <<DONE

All set! The welcome screen will start by itself every time the Pi boots.

  * Add family photos:   copy .jpg/.png files into  $ROOT/display/photos
  * Change the wording:  edit  $ROOT/display/config.js
  * Try it right now:    $LAUNCH &
  * Close it (until next boot):  $ROOT/scripts/stop.sh
  * Remove autostart:    $ROOT/uninstall.sh

Reboot now with:  sudo reboot
DONE
