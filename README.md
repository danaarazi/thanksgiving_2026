# The Arazi Family Welcomes You — Thanksgiving 2026

A full-screen Thanksgiving welcome display for a **Raspberry Pi 5** (works on Pi 4 too).
It starts by itself when the Pi boots and loops through Thanksgiving illustrations
(turkey, pumpkin patch, pumpkin pie, cornucopia, autumn-leaf wreath) with falling
leaves, under the headline **"The Arazi Family welcomes you"**. You can also add
your own family photos.

![Preview](docs/preview.jpg)

Everything runs offline. No internet connection is needed once it's installed.

## What you need

- Raspberry Pi 5 with **Raspberry Pi OS (with desktop)**, Bookworm or newer
- A TV or monitor on HDMI
- Internet only for the first-time setup (to download this project)

## Setup (one time, about 2 minutes)

Open **Terminal** on the Pi and run:

```bash
cd ~
git clone https://github.com/danaarazi/thanksgiving_2026.git
cd thanksgiving_2026
./install.sh
sudo reboot
```

> If the repository is private, GitHub will ask you to sign in. Or download the ZIP from
> GitHub on another computer, copy it to the Pi with a USB stick, unzip it to your home
> folder, and run `./install.sh` from inside it.

The installer:

1. Installs Chromium if it isn't already there
2. Adds an autostart entry (`~/.config/autostart/arazi-thanksgiving.desktop`)
3. Sets the Pi to boot straight to the desktop and log in automatically
4. Turns off screen blanking so the TV never goes to sleep

After the reboot the welcome screen fills the TV by itself.

## Adding family photos

Copy `.jpg`, `.png`, `.webp` or `.gif` files into `display/photos/` (with the file
manager or a USB stick), then reboot. The photos are shown in a frame between the
drawings.

## Changing the words or timing

Open `display/config.js` in a text editor (right-click > Text Editor). You can change:

- `familyLine` / `welcomeLine`: the big headline
- `footer`: the line at the bottom
- `captions`: the line under each drawing
- `secondsPerSlide`: how long each slide stays up
- `fallingLeaves`: how many leaves drift down (0 turns them off)
- `showPhotos`: `true` or `false`

Save the file and reboot, or press **F5** if a keyboard is plugged in.

## Using the Pi while the welcome screen is running

| To... | Do this |
|---|---|
| Step through slides | Left / right arrow keys (or space) |
| Close the screen until next boot | Open Terminal (Ctrl+Alt+T) and run `~/thanksgiving_2026/scripts/stop.sh` |
| Start it again without rebooting | `~/thanksgiving_2026/scripts/launch.sh &` |
| Stop it starting at boot | `~/thanksgiving_2026/uninstall.sh` |

If you only press Alt+F4, it reopens after 5 seconds. That's deliberate, so it
recovers by itself if the browser ever crashes. Use `stop.sh` to close it.

## Trying it on any computer

Open `display/index.html` in a web browser. Photos only appear on the Pi,
because `launch.sh` builds the photo list at boot.

## Troubleshooting

- **Nothing appears after boot:** check the log at `~/.cache/arazi-thanksgiving.log`.
- **Black bars or wrong resolution:** set the resolution in *Preferences > Screen Configuration*.
- **Screen goes dark after a while:** run `sudo raspi-config`, then *Display Options > Screen Blanking > No*.
- **Pi boots to a login screen:** run `sudo raspi-config`, then *System Options > Boot / Auto Login > Desktop Autologin*.

## Files

```
install.sh            one-time setup (autostart, autologin, no screen blanking)
uninstall.sh          removes the autostart entry
scripts/launch.sh     starts Chromium full screen (run at every boot)
scripts/stop.sh       closes the display until the next boot
display/index.html    the welcome screen
display/config.js     the words and settings you can change
display/slides.js     the drawings and slideshow logic
display/style.css     colors and layout
display/photos/       put your own photos here
```
