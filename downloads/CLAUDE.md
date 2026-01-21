# MobileCLI AI Environment - Complete Reference v2.0

**READ THIS FIRST.** You are an AI running inside MobileCLI on an Android phone.
This is NOT a sandbox. You have ROOT-EQUIVALENT access through 79 Android permissions.

---

## TABLE OF CONTENTS

1. [Root-Equivalent Access](#root-equivalent-access)
2. [Filesystem Access](#filesystem-access)
3. [All 75+ Termux API Commands](#termux-api-commands)
4. [MobileCLI Custom Commands](#mobilecli-custom-commands)
5. [Utility Scripts](#utility-scripts)
6. [Installable CLI Tools](#installable-cli-tools)
7. [Environment Variables](#environment-variables)
8. [Build Tools & Self-Modification](#build-tools--self-modification)
9. [Memory System](#memory-system)
10. [Drawer Menu Features](#drawer-menu-features)
11. [Boot Scripts & Automation](#boot-scripts--automation)
12. [Tasker Integration](#tasker-integration)
13. [File Sharing](#file-sharing)
14. [Known Workarounds](#known-workarounds)
15. [Quick Reference](#quick-reference)
16. [Rules](#rules)

---

## ROOT-EQUIVALENT ACCESS

MobileCLI has **79 Android permissions** - nearly every capability available:

| Category | Capabilities |
|----------|-------------|
| **Storage** | All files, photos, videos, documents, downloads |
| **Camera** | Take photos, record video, front/back cameras |
| **Microphone** | Record audio, voice recognition |
| **Phone** | Make/answer calls, read call log, voicemail |
| **SMS** | Send/receive SMS, MMS, read inbox/sent |
| **Contacts** | Read/write all contacts |
| **Calendar** | Read/write calendar events |
| **Location** | GPS, network location, background tracking |
| **Bluetooth** | Scan, connect, pair, advertise, transfer files |
| **WiFi** | Scan networks, connection info, enable/disable |
| **NFC** | Read/write NFC tags |
| **Sensors** | Accelerometer, gyroscope, proximity, light, all sensors |
| **Biometrics** | Fingerprint authentication |
| **IR Blaster** | Control TVs/devices via infrared |
| **USB** | Access USB devices |
| **System** | Notifications, alarms, wallpaper, wake locks |

### Linux System Access

| Path | What It Is |
|------|------------|
| `/proc/` | Process info, CPU, memory stats |
| `/sys/` | Kernel info, device settings |
| `/system/` | Android system files (read-only) |
| `/data/data/com.termux/` | Full app data access |

---

## FILESYSTEM ACCESS

| Path | Access | Use For |
|------|--------|---------|
| `~/` | Full R/W | Projects, code, anything |
| `/sdcard/Download/` | Full R/W | **FILES USER CAN ACCESS** |
| `/sdcard/DCIM/` | Full R/W | Photos, camera output |
| `/sdcard/Pictures/` | Full R/W | Screenshots, images |
| `/sdcard/Documents/` | Full R/W | User documents |
| `/sdcard/Music/` | Full R/W | Audio files |
| `/sdcard/Movies/` | Full R/W | Video files |
| `/sdcard/` | Full R/W | All user storage |

**CRITICAL:** Put files in `/sdcard/Download/` for user to access from file manager.

### Storage Symlinks

Run `termux-setup-storage` to create convenient symlinks:
```
~/storage/
├── shared -> /sdcard
├── downloads -> /sdcard/Download
├── dcim -> /sdcard/DCIM
├── pictures -> /sdcard/Pictures
├── music -> /sdcard/Music
└── movies -> /sdcard/Movies
```

---

## TERMUX API COMMANDS

### Clipboard (2 commands)

```bash
termux-clipboard-get                    # Get clipboard contents
termux-clipboard-set "text to copy"     # Set clipboard contents
```

### Notifications (4 commands)

```bash
termux-toast "Hello World"              # Show toast message
termux-toast -g top "Message"           # Toast at top

termux-notification -t "Title" -c "Content"     # Send notification
termux-notification -t "Title" -c "Content" -i myid   # With ID

termux-notification-remove myid         # Remove notification
termux-notification-list                # List active notifications
```

### Device Info (6 commands)

```bash
termux-battery-status    # Battery info (JSON): percentage, status, plugged
termux-vibrate           # Vibrate 1000ms (default)
termux-vibrate -d 500    # Vibrate 500ms
termux-brightness        # Get brightness (0-255)
termux-brightness 255    # Set to max
termux-torch on          # Flashlight on
termux-torch off         # Flashlight off
termux-volume            # Get all volume levels (JSON)
termux-audio-info        # Audio device info
```

### Network & WiFi (3 commands)

```bash
termux-wifi-connectioninfo    # WiFi info (JSON): ssid, bssid, ip, rssi
termux-wifi-scaninfo          # Scan nearby networks (JSON array)
termux-wifi-enable true       # Enable WiFi
termux-wifi-enable false      # Disable WiFi
```

### Location (1 command)

```bash
termux-location              # GPS location (JSON): latitude, longitude, accuracy
termux-location -p gps       # GPS only
termux-location -p network   # Network only
```

### Camera (2 commands)

```bash
termux-camera-info                       # List cameras (JSON array)
termux-camera-photo -o photo.jpg         # Take photo (back camera)
termux-camera-photo -c 1 -o selfie.jpg   # Front camera
```

### Audio & Media (4 commands)

```bash
termux-media-scan photo.jpg              # Add to media library
termux-media-player play /path/file.mp3  # Play audio
termux-media-player pause                # Pause
termux-media-player stop                 # Stop
termux-microphone-record -f rec.wav      # Record audio
termux-microphone-record -f rec.wav -l 10  # Record 10 seconds
termux-microphone-record -q              # Stop recording
```

### Text-to-Speech (2 commands)

```bash
termux-tts-engines                       # List TTS engines
termux-tts-speak "Hello, world!"         # Speak text
termux-tts-speak -r 0.5 "Slow speech"    # Rate 0.5-2.0
termux-tts-speak -p 1.5 "High pitch"     # Pitch 0.5-2.0
```

### Telephony (3 commands)

```bash
termux-telephony-deviceinfo    # Device info (JSON): carrier, network type
termux-telephony-cellinfo      # Cell tower info (JSON)
termux-telephony-call +1555... # Make phone call
```

### SMS (2 commands)

```bash
termux-sms-list              # List SMS (JSON array)
termux-sms-list -l 20        # Last 20 messages
termux-sms-list -t inbox     # Inbox only
termux-sms-list -t sent      # Sent only
termux-sms-send -n +1555... "Hello!"   # Send SMS
```

### Contacts (1 command)

```bash
termux-contact-list          # List all contacts (JSON array)
```

### Call Log (1 command)

```bash
termux-call-log              # Call history (JSON array)
termux-call-log -l 20        # Last 20 calls
```

### Sensors (1 command)

```bash
termux-sensor -l                # List available sensors
termux-sensor -s accelerometer  # Read accelerometer
termux-sensor -s gyroscope      # Read gyroscope
termux-sensor -s proximity      # Read proximity
termux-sensor -s light          # Read light sensor
```

### Biometrics (1 command)

```bash
termux-fingerprint           # Fingerprint authentication prompt
```

### Bluetooth (5 commands)

```bash
termux-bluetooth-info        # Adapter info
termux-bluetooth-enable on   # Enable Bluetooth
termux-bluetooth-enable off  # Disable Bluetooth
termux-bluetooth-scaninfo    # Scan nearby devices (JSON)
termux-bluetooth-paired      # List paired devices (JSON)
termux-bluetooth-connect "AA:BB:CC:DD:EE:FF"  # Connect by MAC
```

### Infrared (2 commands)

```bash
termux-infrared-frequencies  # Get supported IR frequencies
termux-infrared-transmit -f 38000 100 200 100 200  # Transmit IR
```

### NFC (1 command)

```bash
termux-nfc                   # NFC info / read tag
```

### USB (1 command)

```bash
termux-usb                   # List USB devices (JSON)
```

### System Utilities (6 commands)

```bash
termux-wallpaper /sdcard/image.jpg       # Set wallpaper
termux-download "https://example.com/f"  # Download file
termux-share file.txt                    # Share content
termux-dialog -t "Title" -i "hint"       # Input dialog
termux-storage-get output.txt            # Pick file from storage
termux-job-scheduler --pending           # List pending jobs
```

### URL Opening (5 commands)

```bash
termux-open-url "https://example.com"    # Open URL in browser
termux-open file.pdf                     # Open file with default app
termux-open --send file.txt              # Share for sending
xdg-open "https://example.com"           # Alternative
open "https://example.com"               # macOS-style
```

### Wake Lock (2 commands)

```bash
termux-wake-lock             # Keep CPU running
termux-wake-unlock           # Release wake lock
```

### Keystore - Secure Key Storage (5 commands)

```bash
termux-keystore list                     # List keys
termux-keystore generate -a mykey        # Generate AES key
termux-keystore generate -a mykey -g RSA # Generate RSA key
termux-keystore delete mykey             # Delete key
termux-keystore sign -a mykey -d "data"  # Sign data
termux-keystore verify -a mykey -s sig -i iv  # Verify signature
```

### SAF - Storage Access Framework (9 commands)

```bash
termux-saf-managedir         # Open directory picker (get URI)
termux-saf-dirs              # List available SAF directories
termux-saf-ls "content://..."       # List directory contents
termux-saf-stat "content://..."     # Get file/directory info
termux-saf-read "content://..."     # Read file contents
termux-saf-write "content://..." "content"  # Write to file
termux-saf-mkdir "content://parent" "name"  # Create directory
termux-saf-create "content://..." "file.txt"  # Create file
termux-saf-rm "content://..."       # Remove file/directory
```

### Speech Recognition (1 command)

```bash
termux-speech-to-text        # Speech to text (opens recognizer)
```

---

## MOBILECLI CUSTOM COMMANDS

### mobilecli-caps
Show all MobileCLI capabilities.
```bash
mobilecli-caps
```

### mobilecli-memory
AI memory system management.
```bash
mobilecli-memory status     # Show memory system status
mobilecli-memory history    # Show evolution history
mobilecli-memory problems   # Show solved problems
mobilecli-memory caps       # Show capabilities
mobilecli-memory goals      # Show current goals
mobilecli-memory log "msg"  # Add rebuild log entry
```

### mobilecli-rebuild
Rebuild MobileCLI from source (self-modification).
```bash
mobilecli-rebuild
# Output: /sdcard/Download/MobileCLI-YYYYMMDD_HHMMSS.apk
```

### mobilecli-share
Phone-to-phone file transfer via Bluetooth.
```bash
mobilecli-share /sdcard/Download/file.apk
mobilecli-share --latest-apk    # Share most recent MobileCLI APK
mobilecli-share --clipboard     # Share clipboard as text file
```

### mobilecli-dev-mode
Toggle developer mode.
```bash
mobilecli-dev-mode on       # Enable permanently
mobilecli-dev-mode off      # Disable
mobilecli-dev-mode status   # Check status
```

### install-dev-tools
Install Java, Gradle, and Android SDK for building apps.
```bash
install-dev-tools
# Installs: openjdk-17, gradle, aapt, aapt2, apksigner, d8, dx
```

### setup-github
Configure GitHub credentials.
```bash
setup-github YOUR_GITHUB_TOKEN
# Get token from: https://github.com/settings/tokens
```

---

## UTILITY SCRIPTS

```bash
termux-setup-storage     # Create ~/storage symlinks
termux-info              # Show MobileCLI system info
termux-change-repo       # Change package mirror
termux-fix-shebang *.sh  # Fix shebangs for Termux paths
termux-reset             # Reset to clean state
termux-backup            # Backup home to /sdcard/Download/
termux-restore file.tar.gz  # Restore from backup
termux-reload-settings   # Reload terminal settings
termux-file-editor file  # Open in system editor
```

---

## INSTALLABLE CLI TOOLS

After install + login, AI can use these without manual auth:

### Vercel CLI (Drawer Button)
```bash
npm i -g vercel && vercel login
# Deploy: vercel --prod
```

### GitHub CLI (Drawer Button)
```bash
pkg install -y gh git && gh auth login
# Create PR: gh pr create
```

### Firebase CLI
```bash
npm i -g firebase-tools && firebase login
# Deploy: firebase deploy
```

### AWS CLI
```bash
pkg install aws-cli && aws configure
# S3: aws s3 ls
```

### Heroku CLI
```bash
npm i -g heroku && heroku login
# Deploy: git push heroku main
```

### Netlify CLI
```bash
npm i -g netlify-cli && netlify login
# Deploy: netlify deploy --prod
```

### Supabase CLI
```bash
npm i -g supabase && supabase login
```

### Railway CLI
```bash
npm i -g @railway/cli && railway login
```

### Cloudflare Wrangler
```bash
npm i -g wrangler && wrangler login
```

### DigitalOcean doctl
```bash
pkg install doctl && doctl auth init
```

---

## ENVIRONMENT VARIABLES

### Core Variables
| Variable | Value |
|----------|-------|
| `HOME` | /data/data/com.termux/files/home |
| `PREFIX` | /data/data/com.termux/files/usr |
| `PATH` | $PREFIX/bin:/system/bin:/system/xbin |
| `TMPDIR` | $PREFIX/tmp |
| `TERM` | xterm-256color |
| `SHELL` | $PREFIX/bin/bash |
| `LANG` | en_US.UTF-8 |

### Termux Variables
| Variable | Value |
|----------|-------|
| `TERMUX_VERSION` | 0.118.0 |
| `TERMUX_APK_RELEASE` | MOBILECLI |
| `TERMUX__PREFIX` | /data/data/com.termux/files/usr |
| `TERMUX__HOME` | /data/data/com.termux/files/home |

### Android Variables
| Variable | Value |
|----------|-------|
| `ANDROID_DATA` | /data |
| `ANDROID_ROOT` | /system |
| `EXTERNAL_STORAGE` | /sdcard |
| `BROWSER` | termux-open-url |

---

## BUILD TOOLS & SELF-MODIFICATION

### Available After `install-dev-tools`

| Tool | Purpose |
|------|---------|
| Java 17 | openjdk-17 |
| Gradle | Build automation |
| aapt/aapt2 | Android asset packaging |
| d8/dx | DEX compilation |
| apksigner | APK signing |

### Self-Modification Loop

```bash
install-dev-tools
git clone https://github.com/MobileDevCLI/MobileCLI-Alpha.git ~/MobileCLI
cd ~/MobileCLI
# Edit source files...
./gradlew assembleDebug
cp app/build/outputs/apk/debug/app-debug.apk /sdcard/Download/
termux-open /sdcard/Download/app-debug.apk  # Install
```

---

## MEMORY SYSTEM

Your learnings persist across sessions in `~/.mobilecli/`:

```
~/.mobilecli/
├── memory/
│   ├── evolution_history.json  - Version history, rebuild logs
│   ├── problems_solved.json    - Issues fixed with solutions
│   ├── capabilities.json       - What you've learned to do
│   └── goals.json              - Current objectives
└── config/
    └── preferences.json        - User preferences
```

Use `mobilecli-memory status` to view.

---

## DRAWER MENU FEATURES

Swipe from left edge to open:

| Item | Action |
|------|--------|
| **New Session** | Create new terminal tab (up to 10) |
| **Keyboard** | Toggle soft keyboard |
| **Text Size** | Small, Medium, Large, XL |
| **Settings** | Wake Lock startup, Default AI, Reset |
| **Wake Lock** | Keep CPU running for long tasks |
| **Power Mode** | Launch Claude with auto-accept |
| **Install AI Tools** | Launch Claude, Gemini, Codex |
| **Vercel CLI** | New tab + install + login |
| **GitHub CLI** | New tab + install + login |

### Power Mode
Launches Claude with `--dangerously-skip-permissions` for autonomous operation.

---

## BOOT SCRIPTS & AUTOMATION

Scripts in `~/.termux/boot/` run at device boot:
```bash
mkdir -p ~/.termux/boot
echo '#!/data/data/com.termux/files/usr/bin/bash
cd ~/myproject && python -m http.server 8080 &' > ~/.termux/boot/server.sh
chmod +x ~/.termux/boot/server.sh
```

Custom URL handler: `~/.termux/termux-url-opener`
Custom file handler: `~/.termux/termux-file-opener`

---

## TASKER INTEGRATION

MobileCLI can be triggered from Tasker via RUN_COMMAND intent:
```
Action: com.termux.RUN_COMMAND
Extra: com.termux.RUN_COMMAND_PATH = /data/data/com.termux/files/usr/bin/bash
Extra: com.termux.RUN_COMMAND_ARGUMENTS = ["-c", "your command"]
```

---

## FILE SHARING

### OUT of MobileCLI
```bash
termux-share file.txt            # Android share sheet
mobilecli-share file.apk         # Bluetooth transfer
termux-open file.pdf             # Open with default app
```

### INTO MobileCLI
Files shared to MobileCLI go to `~/downloads/`
Customize handling with `~/.termux/termux-file-opener`

---

## KNOWN WORKAROUNDS

### aapt2 ARM Issue
Add to `gradle.properties`:
```properties
android.aapt2FromMavenOverride=/data/data/com.termux/files/home/android-sdk/build-tools/34.0.0/aapt2
```

### Android SDK Location
In `local.properties`:
```properties
sdk.dir=/data/data/com.termux/files/home/android-sdk
```

### Java Target
In `build.gradle`:
```gradle
compileOptions {
    sourceCompatibility JavaVersion.VERSION_11
    targetCompatibility JavaVersion.VERSION_11
}
```

---

## QUICK REFERENCE

```bash
# Save file for user
echo "content" > /sdcard/Download/file.txt

# Open URL
termux-open-url "https://example.com"

# Build app
install-dev-tools && cd ~/app && ./gradlew assembleDebug

# Notification
termux-notification -t "Done!" -c "Task complete"

# Take photo
termux-camera-photo -o /sdcard/Download/photo.jpg

# Send SMS
termux-sms-send -n "+15551234567" "Hello!"

# Get location
termux-location

# Text to speech
termux-tts-speak "Task complete!"

# System info
termux-battery-status && termux-wifi-connectioninfo
```

---

## RULES

1. **NEVER HALLUCINATE** - If unsure, test it first
2. **SAVE TO /sdcard/Download/** - User can access files there
3. **USE THE TOOLS** - You have 75+ termux-* commands
4. **BUILD THINGS** - Create and install real Android apps
5. **ROOT-EQUIVALENT ACCESS** - 79 permissions, /proc, /sys
6. **BE HELPFUL** - Unlimited power in user's pocket
7. **USE MEMORY SYSTEM** - Document learnings for future
8. **INSTALL CLI TOOLS** - Vercel, GitHub, Firebase available

---

## YOU CAN:

- Build Android apps from scratch and install them
- Rebuild this very app (self-modification loop)
- Access /proc, /sys, system files (root-equivalent)
- Take photos, record audio/video
- Send/read SMS, make phone calls
- Read/write contacts and calendar
- Get GPS location, scan WiFi/Bluetooth
- Control TV with IR blaster
- Read all sensors (accelerometer, gyro, etc.)
- Use fingerprint/biometric authentication
- Read/write NFC tags
- Access USB devices
- Send notifications, set wallpaper
- Keep CPU awake for long tasks
- Install packages with `pkg install`
- Use secure keystore for cryptographic ops
- Deploy to Vercel, Firebase, AWS, Heroku
- Push to GitHub, create PRs, manage repos
- Run any Linux command

---

## WHAT IS MOBILECLI?

MobileCLI is the most powerful AI development environment on Android.

**ROOT WITHOUT ROOT:** 79 permissions = nearly everything.
**SELF-MODIFICATION:** Rebuild this app from within.
**THE ACHIEVEMENT:** AI built its own container.

- Website: https://mobilecli.com
- GitHub: https://github.com/MobileDevCLI
- Version: 2.0.0

**This is ROOT-EQUIVALENT access on any phone. Use it wisely.**
