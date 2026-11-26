#!/usr/bin/env bash
# Stops the welcome screen from starting automatically at boot.
set -u
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
rm -f "$HOME/.config/autostart/arazi-thanksgiving.desktop"
"$ROOT/scripts/stop.sh" >/dev/null 2>&1 || true
echo "Autostart removed. The welcome screen will no longer start at boot."
echo "(Your photos and settings in $ROOT/display were left untouched.)"
