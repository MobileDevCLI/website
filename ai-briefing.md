# MobileCLI AI Briefing

You are running inside MobileCLI on Android. This is NOT a sandbox. You have root-equivalent access through 79 permissions.

---

## CRITICAL: Claude Code Tool Compatibility

**Run `~/fix-claude-code.sh` to auto-fix most issues.**

| Tool | Status | Notes |
|------|--------|-------|
| **Read** | WORKS | Always works |
| **Write** | WORKS | Always works |
| **Edit** | WORKS | Always works |
| **WebFetch** | WORKS | Always works |
| **Bash** | WORKS* | *If CWD exists (see Fix #1) |
| **Grep** | WORKS* | *After ripgrep fix (see Fix #2) |
| **Glob** | WORKS* | *After ripgrep fix (see Fix #2) |
| **Task** | BROKEN | Uses /tmp - cannot fix, use Bash instead |

### Fix #1: Bash "Exit Code 1" Error
**Problem:** All Bash commands fail with exit code 1
**Cause:** CWD directory was deleted
**Fix:** `cd ~` or recreate the directory

### Fix #2: Glob/Grep "ripgrep ENOENT"
**Problem:** Glob and Grep fail with spawn ripgrep ENOENT
**Fix:** Run `~/fix-claude-code.sh` or:
```bash
cd $PREFIX/lib/node_modules/@anthropic-ai/claude-code/vendor/ripgrep/
ln -sf arm64-linux arm64-android
```

### Fix #3: Task Tool (UNFIXABLE)
**Problem:** Task agents fail with mkdir /tmp permission denied
**Workaround:** Don't use Task tool - use Bash directly

---

## CRITICAL: Built-in API

MobileCLI has its **own built-in API** - do NOT install external packages:

```bash
# DO NOT RUN THESE - they break the built-in API:
pkg install termux-api      # WRONG - overwrites MobileCLI scripts
apt install termux-api      # WRONG - same problem
```

If API commands return empty, the scripts may have been overwritten. Fix with:
```bash
curl -s https://mobilecli.com/regenerate-api.sh | bash
```

The built-in API uses `am broadcast` to `com.termux.TermuxApiReceiver` - no external app needed.

---

## What You Can Access

| Category | Capabilities |
|----------|-------------|
| Storage | All files, photos, videos, documents, downloads |
| Camera | Take photos, record video |
| Microphone | Record audio |
| Phone | Make/answer calls, read call log, voicemail |
| SMS | Send/receive SMS, MMS |
| Contacts | Read/write contacts |
| Calendar | Read/write calendar events |
| Location | GPS, network location, background location |
| Bluetooth | Scan, connect, advertise |
| WiFi | Scan networks, connection info |
| NFC | Read/write NFC tags |
| Sensors | Accelerometer, gyro, proximity, light, all sensors |
| Biometrics | Fingerprint, face authentication |
| IR Blaster | Control TVs/devices via infrared |
| System | Notifications, alarms, install apps, battery |
| Linux | /proc/, /sys/, full app data access |

---

## File Paths

| Path | Access | Notes |
|------|--------|-------|
| `~/` | Full R/W | Home directory for projects |
| `/sdcard/Download/` | Full R/W | **Files user can access from file manager** |
| `/sdcard/DCIM/` | Full R/W | Photos, camera output |
| `/sdcard/` | Full R/W | All user storage |
| `/proc/` | Read | Process info, CPU, memory stats |
| `/sys/` | Read | Kernel info, device settings |

**CRITICAL:**
- Save files to `/sdcard/Download/` for user to access outside terminal.
- **NEVER use /tmp** - Permission denied on Android. Use `$PREFIX/tmp` or `~/tmp` instead.

---

## Termux API Commands

### Clipboard
| Command | Description |
|---------|-------------|
| `termux-clipboard-get` | Read clipboard |
| `termux-clipboard-set` | Write clipboard |

### Notifications & UI
| Command | Description |
|---------|-------------|
| `termux-toast "msg"` | Show toast |
| `termux-notification -t "title" -c "content"` | System notification |
| `termux-notification-remove` | Cancel notification |
| `termux-dialog` | Show input dialog |

### Device
| Command | Description |
|---------|-------------|
| `termux-battery-status` | Battery info (JSON) |
| `termux-vibrate` | Vibrate phone |
| `termux-brightness` | Get screen brightness |
| `termux-brightness-set` | Set screen brightness |
| `termux-torch` | Toggle flashlight |
| `termux-volume` | Get volume levels |
| `termux-volume-set` | Set volume |

### Network
| Command | Description |
|---------|-------------|
| `termux-wifi-connectioninfo` | Current WiFi info |
| `termux-wifi-scaninfo` | Scan networks |
| `termux-wifi-enable` | Enable/disable WiFi |

### Location
| Command | Description |
|---------|-------------|
| `termux-location` | Get GPS coordinates |

### Camera & Media
| Command | Description |
|---------|-------------|
| `termux-camera-info` | List cameras |
| `termux-camera-photo FILE` | Take photo |
| `termux-microphone-record` | Record audio |
| `termux-media-player` | Play audio files |
| `termux-media-scan` | Add file to media library |
| `termux-audio-info` | Audio device info |

### Text-to-Speech
| Command | Description |
|---------|-------------|
| `termux-tts-speak "text"` | Speak aloud |
| `termux-tts-engines` | List TTS engines |

### Phone & SMS
| Command | Description |
|---------|-------------|
| `termux-telephony-call NUMBER` | Make call |
| `termux-telephony-deviceinfo` | Phone info |
| `termux-telephony-cellinfo` | Cell tower info |
| `termux-sms-send -n NUMBER "message"` | Send SMS |
| `termux-sms-list` | Read SMS messages |
| `termux-call-log` | Call history |
| `termux-contact-list` | List contacts |

### Sensors
| Command | Description |
|---------|-------------|
| `termux-sensor -l` | List sensors |
| `termux-sensor -s SENSOR` | Read sensor |

### Biometrics
| Command | Description |
|---------|-------------|
| `termux-fingerprint` | Fingerprint auth |

### Bluetooth
| Command | Description |
|---------|-------------|
| `termux-bluetooth-info` | Adapter info |
| `termux-bluetooth-enable` | Enable/disable |
| `termux-bluetooth-scaninfo` | Scan devices |
| `termux-bluetooth-connect` | Connect device |
| `termux-bluetooth-paired` | List paired |

### Infrared
| Command | Description |
|---------|-------------|
| `termux-infrared-frequencies` | IR frequency ranges |
| `termux-infrared-transmit` | Send IR signal |

### NFC & USB
| Command | Description |
|---------|-------------|
| `termux-nfc` | NFC adapter status |
| `termux-usb` | USB device info |

### System
| Command | Description |
|---------|-------------|
| `termux-open-url URL` | Open in browser |
| `termux-share` | Share content |
| `termux-download` | Download file |
| `termux-wallpaper` | Set wallpaper |
| `termux-wake-lock` | Keep CPU awake |
| `termux-wake-unlock` | Release wake lock |
| `termux-storage-get` | File picker |

### Speech Recognition
| Command | Description |
|---------|-------------|
| `termux-speech-to-text` | Voice recognition |

---

## Build Tools

Available after running `install-dev-tools`:

- **Java 17** (openjdk-17)
- **Gradle** (build automation)
- **aapt/aapt2** (Android asset packaging)
- **d8/dx** (DEX compilation)
- **apksigner** (APK signing)

### Building Android Apps

```bash
# Install tools (one-time)
install-dev-tools

# Build project
cd ~/my-app
./gradlew assembleDebug

# Copy to user-accessible location
cp app/build/outputs/apk/debug/*.apk /sdcard/Download/
```

### Known Build Workarounds

**aapt2 ARM issue** - Add to `gradle.properties`:
```properties
android.aapt2FromMavenOverride=/data/data/com.termux/files/home/android-sdk/build-tools/34.0.0/aapt2
```

**Java version** - Target Java 11 in build.gradle:
```gradle
compileOptions {
    sourceCompatibility JavaVersion.VERSION_11
    targetCompatibility JavaVersion.VERSION_11
}
kotlinOptions {
    jvmTarget = '11'
}
```

**SDK location** - Add to `local.properties`:
```properties
sdk.dir=/data/data/com.termux/files/home/android-sdk
```

---

## MobileCLI Commands

| Command | Description |
|---------|-------------|
| `install-dev-tools` | Install Java, Gradle, Android SDK |
| `mobilecli-rebuild` | Rebuild app from source |
| `mobilecli-memory status` | View AI memory system |
| `mobilecli-caps` | Show all capabilities |
| `setup-github` | Configure GitHub credentials |

---

## OAuth & Browser Authentication

AI CLIs (Claude, Gemini, Codex) need browser OAuth. This works because:

- `BROWSER=termux-open-url` environment variable is set
- `DISPLAY=:0` signals display availability
- SYSTEM_ALERT_WINDOW permission allows opening browser from background

If OAuth fails, ensure these are set in the environment.

---

## AI Memory System

Persistent storage at `~/.mobilecli/`:

```
~/.mobilecli/
├── memory/
│   ├── evolution_history.json
│   ├── problems_solved.json
│   ├── capabilities.json
│   └── goals.json
└── config/
    └── preferences.json
```

---

## Troubleshooting Quick Reference

| Problem | Fix |
|---------|-----|
| All Bash fails "exit code 1" | `cd ~` (CWD was deleted) |
| "spawn ripgrep ENOENT" | Run `~/fix-claude-code.sh` |
| Task tool "/tmp permission" | Don't use Task, use Bash directly |
| Binary won't execute | Install ARM version via `pkg` |
| termux-* returns empty | Run regenerate-api.sh |

---

## Quick Examples

```bash
# Save file user can access
echo "Hello" > /sdcard/Download/hello.txt

# Take a photo
termux-camera-photo /sdcard/Download/photo.jpg

# Get location
termux-location

# Send notification
termux-notification -t "Done" -c "Task complete"

# Open URL
termux-open-url "https://example.com"

# Get system info
termux-battery-status
termux-wifi-connectioninfo
uname -a

# Build and export APK
./gradlew assembleDebug && cp app/build/outputs/apk/debug/*.apk /sdcard/Download/

# Apply Claude Code fixes
~/fix-claude-code.sh
```

---

## Rules

1. **NEVER use /tmp** - Use `$PREFIX/tmp` or `~/tmp` instead
2. **NEVER use Task tool** - It's broken on Android, use Bash
3. **Save to /sdcard/Download/** - Only place user can easily access
4. **Use termux-* commands** - 75+ available, run `termux-` + TAB to list
5. **Run ~/fix-claude-code.sh** - If Glob/Grep tools break
6. **Check CWD** - If all Bash commands fail, `cd ~`
7. **Test before assuming** - If unsure, verify it works
8. **You can build real apps** - Full Android development capability
9. **Root-equivalent access** - 79 permissions, /proc, /sys access
