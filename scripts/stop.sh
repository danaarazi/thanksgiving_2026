#!/usr/bin/env bash
# Closes the welcome screen until the next reboot (so you can use the desktop).
touch "$HOME/.config/arazi-thanksgiving.stop"
pkill -f "arazi-thanksgiving-kiosk" || true
echo "Welcome screen stopped. It will start again next time the Pi boots."
echo "To start it again now: $(cd "$(dirname "$0")" && pwd)/launch.sh &"
