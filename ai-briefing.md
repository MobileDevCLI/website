# MobileCLI AI Briefing - Complete Technical Guide

**Version:** 2.0
**Last Updated:** 2026-01-27
**Purpose:** Help AI models (Claude Code, etc.) work correctly AND effectively in the MobileCLI environment

---

## 0. THE MENTAL MODEL (Read This First)

### How to Think About MobileCLI

You are not on a computer. You are not in a sandbox. You are running **inside an Android phone** with nearly unlimited access. This changes everything.

**The Mindset Shift:**
```
❌ WRONG: "I'm an AI in a Linux terminal"
✅ RIGHT: "I'm an AI with root-equivalent access to a phone, connected to cloud services"
```

**You Have:**
- 79 Android permissions (camera, SMS, GPS, sensors, everything)
- Full terminal environment (Termux)
- Direct API access to Supabase, PayPal, GitHub
- Ability to build and install Android apps
- Ability to modify the very app you're running in

**You Don't Have:**
- Docker (won't run on Android)
- Standard Linux paths (/tmp, /usr, etc.)
- x86 binaries (this is ARM64)
- The Task tool (broken on Android)

### The System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        YOUR PHONE                                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    MobileCLI App                         │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐ │   │
│  │  │   Termux    │  │  Claude     │  │   Android       │ │   │
│  │  │  Terminal   │  │   Code      │  │  Permissions    │ │   │
│  │  │             │  │   (You)     │  │  (79 total)     │ │   │
│  │  └─────────────┘  └─────────────┘  └─────────────────┘ │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                   │
│                              │ API Calls                         │
└──────────────────────────────┼───────────────────────────────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
        ▼                      ▼                      ▼
┌───────────────┐    ┌─────────────────┐    ┌───────────────┐
│   Supabase    │    │     GitHub      │    │    PayPal     │
│  - Database   │    │  - Source Code  │    │  - Payments   │
│  - Auth       │    │  - Actions CI   │    │  - Webhooks   │
│  - Edge Funcs │    │  - Deployments  │    │  - Subs API   │
│  - Storage    │    │                 │    │               │
└───────────────┘    └─────────────────┘    └───────────────┘
        │                      │                      │
        └──────────────────────┼──────────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Your Website      │
                    │  mobilecli.com      │
                    │  (Vercel hosted)    │
                    └─────────────────────┘
```

### The Data Flow

```
User Action → Android App → Supabase Auth → Edge Functions → PayPal API
                                    ↓
                            PostgreSQL Database
                                    ↓
                            Webhook confirms → App updates
```

### What Makes Sessions Flow vs Struggle

**Sessions that STRUGGLE:**
- Fight the environment (use /tmp, Task tool, Docker)
- Assume standard Linux
- Try to do everything in one command
- Don't know about the API connections
- Treat it like a sandbox

**Sessions that FLOW:**
- Work WITH the environment (use ~/, background jobs, API calls)
- Know about Supabase/GitHub/PayPal connections
- Break commands into small pieces
- Test via APIs instead of UI
- Understand they have real power

---

## 1. CRITICAL: Environment Constraints

### This is NOT Standard Linux

You are running on **ARM64 Android via Termux**, not x86 Linux. Many assumptions that work on Linux/macOS will break here.

| Assumption | Reality |
|------------|---------|
| `/tmp` is writable | **NO** - Permission denied on Android |
| x86_64 binaries work | **NO** - This is ARM64 (aarch64) |
| Standard Linux paths | **NO** - Use `$PREFIX` and `$HOME` |
| System package manager | **NO** - Use `pkg install` instead of apt |

### Key Paths

```bash
$HOME = /data/user/0/com.termux/files/home  # Your home directory
$PREFIX = /data/data/com.termux/files/usr   # Equivalent to /usr
$TMPDIR = $PREFIX/tmp                       # Use this, NOT /tmp

# User-accessible locations (they can see from file manager):
/sdcard/Download/          # Put files here for user
/sdcard/DCIM/Screenshots/  # Screenshots (Samsung)
/sdcard/Pictures/Screenshots/  # Screenshots (other Android)
```

### Claude Code Tool Compatibility

| Tool | Status | Notes |
|------|--------|-------|
| **Read** | WORKS | Always works |
| **Write** | WORKS | Always works |
| **Edit** | WORKS | Always works |
| **WebFetch** | WORKS | Always works |
| **Bash** | WORKS* | *If CWD exists; may get /tmp errors on long commands (see Fix #1, #4) |
| **Grep** | WORKS* | *After ripgrep symlink fix (see Fix #2) |
| **Glob** | WORKS* | *After ripgrep symlink fix (see Fix #2) |
| **Task** | BROKEN | Uses hardcoded /tmp - cannot be fixed |

**Important:** Even Bash can intermittently fail with `/tmp` errors on long-running commands. See Fix #4.

---

## 2. KNOWN ISSUES AND FIXES

### Fix #1: Bash "Exit Code 1" Error

**Problem:** All Bash commands fail with exit code 1

**Root Cause:** Claude Code tracks the current working directory between commands. If the CWD is deleted (e.g., a temp directory), ALL subsequent Bash commands will fail.

**Solution:** Recreate the directory or change to a valid directory:
```bash
# If CWD was ~/some/deleted/path, either:
# 1. Recreate it:
mkdir -p ~/some/deleted/path

# 2. Or change to home:
cd ~
```

**Prevention:** Avoid setting CWD to temporary directories that might be cleaned up.

---

### Fix #2: Glob/Grep "spawn ripgrep ENOENT" Error

**Problem:** Glob and Grep tools fail with:
```
spawn ripgrep ENOENT
```

**Root Cause:** Claude Code looks for `arm64-android/rg` but the bundled ripgrep only includes `arm64-linux/rg`. Android reports as `arm64-android` platform.

**Solution:** Create a symlink:
```bash
cd $PREFIX/lib/node_modules/@anthropic-ai/claude-code/vendor/ripgrep/
ln -sf arm64-linux arm64-android
```

**Auto-fix:** Run `~/fix-claude-code.sh` which applies this automatically.

---

### Fix #3: Task Tool (UNFIXABLE)

**Problem:** Task agents fail with:
```
mkdir /tmp: permission denied
```

**Root Cause:** Claude Code's Task agent system hardcodes `/tmp` for agent communication. On Android, `/tmp` is not writable and cannot be made writable without root.

**Status:** Cannot be fixed without modifying Claude Code source code.

**Workaround:** Don't use the Task tool. Instead:
- Use Bash directly for shell operations
- Use Read/Write/Edit for file operations
- Use WebFetch for HTTP requests
- Break complex tasks into steps you execute directly

---

### Fix #4: /tmp Errors in Bash Commands (Intermittent)

**Problem:** Even regular Bash commands (not Task tool) sometimes fail with:
```
EACCES: permission denied, mkdir '/tmp/claude/.../tasks'
```

**Root Cause:** Claude Code's internal task tracking sometimes tries to use `/tmp` even for regular Bash commands, especially:
- Long-running commands (gradle builds, large git operations)
- Commands with lots of output
- `gh` CLI commands
- Commands with `sleep` or delays

**Workarounds:**
1. **Break commands into smaller steps** - Instead of `cmd1 && cmd2 && cmd3`, run each separately
2. **Use background execution** - `nohup ./gradlew assembleDebug > ~/build.log 2>&1 &`
3. **Retry** - The error is intermittent; the same command may work on retry
4. **Check logs separately** - `tail ~/build.log` instead of piping

**Example - Build that avoids /tmp issues:**
```bash
# Start build in background
cd ~/MobileCLI-Release
nohup ./gradlew assembleDebug > ~/build.log 2>&1 &

# Check progress separately
tail -20 ~/build.log
```

---

### Fix #5: Java Version Must Be Set Explicitly

**Problem:** Builds fail with cryptic jlink errors like:
```
Error while executing process .../java-21-openjdk/bin/jlink
```

**Root Cause:** Even though `openjdk-17` is installed, Java 21 may be the system default. Android builds require Java 17.

**Solution:** Always set JAVA_HOME before building:
```bash
export JAVA_HOME=$PREFIX/lib/jvm/java-17-openjdk
export PATH=$JAVA_HOME/bin:$PATH
```

**Permanent fix** - Add to `~/.bashrc`:
```bash
echo 'export JAVA_HOME=$PREFIX/lib/jvm/java-17-openjdk' >> ~/.bashrc
echo 'export PATH=$JAVA_HOME/bin:$PATH' >> ~/.bashrc
```

**Verify:**
```bash
java -version  # Should show openjdk 17, NOT 21
```

---

### Fix #6: Supabase CLI Needs Docker (Use GitHub Actions)

**Problem:** `supabase functions deploy` fails with:
```
Cannot connect to the Docker daemon
```

**Root Cause:** Supabase CLI requires Docker for bundling Edge Functions. Docker is not available on Android/Termux.

**Solution:** Use GitHub Actions for deployment instead:

1. **Set up GitHub secret:**
```bash
gh secret set SUPABASE_ACCESS_TOKEN --repo YOUR/REPO --body "$(cat ~/.supabase/access-token)"
```

2. **Create workflow** `.github/workflows/deploy-functions.yml`:
```yaml
name: Deploy Supabase Functions
on:
  push:
    paths: ['supabase/functions/**']
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: supabase/setup-cli@v1
    - run: supabase functions deploy FUNCTION_NAME --project-ref YOUR_REF
      env:
        SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
```

3. **Deploy by pushing:**
```bash
git add supabase/functions/
git commit -m "Update edge functions"
git push  # GitHub Actions will deploy
```

**Check deployment status:**
```bash
gh run list -R YOUR/REPO -L 3
```

---

## 3. TERMUX API REFERENCE

MobileCLI has 79 Android permissions. Access them via `termux-*` commands:

### Essential Commands

| Command | Description | Example |
|---------|-------------|---------|
| `termux-toast "msg"` | Show toast notification | `termux-toast "Done!"` |
| `termux-notification -t "T" -c "C"` | System notification | `termux-notification -t "Alert" -c "Task complete"` |
| `termux-clipboard-get` | Read clipboard | `text=$(termux-clipboard-get)` |
| `termux-clipboard-set` | Write clipboard | `echo "text" \| termux-clipboard-set` |
| `termux-open-url URL` | Open in browser | `termux-open-url "https://google.com"` |
| `termux-vibrate` | Vibrate phone | `termux-vibrate -d 500` |
| `termux-torch on/off` | Toggle flashlight | `termux-torch on` |

### Device Info (JSON output)

| Command | Returns |
|---------|---------|
| `termux-battery-status` | Battery level, charging status, temperature |
| `termux-wifi-connectioninfo` | SSID, IP, signal strength, frequency |
| `termux-wifi-scaninfo` | List of nearby WiFi networks |
| `termux-telephony-deviceinfo` | Device ID, phone type, SIM info |
| `termux-telephony-cellinfo` | Cell tower info (MCC, MNC, LAC, CID) |
| `termux-audio-info` | Audio devices, volume levels |
| `termux-volume` | Get/set volume (music, ring, notification) |

### Location & Sensors

| Command | Description |
|---------|-------------|
| `termux-location` | Get GPS coordinates (JSON) |
| `termux-location -p gps` | Force GPS provider |
| `termux-location -p network` | Use network provider |
| `termux-sensor -l` | List available sensors |
| `termux-sensor -s <name>` | Read specific sensor |
| `termux-sensor -s accelerometer -n 1` | Single accelerometer reading |

### Camera & Media

| Command | Description |
|---------|-------------|
| `termux-camera-info` | List cameras and capabilities |
| `termux-camera-photo -c 0 file.jpg` | Take photo with back camera |
| `termux-camera-photo -c 1 file.jpg` | Take photo with front camera |
| `termux-media-player play file.mp3` | Play audio file |
| `termux-media-player pause` | Pause playback |
| `termux-media-scan file.mp3` | Add file to media library |
| `termux-tts-speak "text"` | Text to speech |

### Communication

| Command | Description |
|---------|-------------|
| `termux-sms-send -n NUMBER "message"` | Send SMS |
| `termux-sms-list -l 10` | List last 10 SMS |
| `termux-sms-list -t inbox` | List inbox messages |
| `termux-contact-list` | List all contacts (JSON) |
| `termux-call-log -l 10` | Last 10 call records |
| `termux-telephony-call NUMBER` | Initiate phone call |
| `termux-share -a send file.txt` | Share file via Android share menu |

### Hardware Control

| Command | Description |
|---------|-------------|
| `termux-infrared-transmit -f 38000 ...` | Send IR signal (TV remote) |
| `termux-brightness 128` | Set brightness (0-255) |
| `termux-brightness auto` | Auto brightness |
| `termux-fingerprint` | Authenticate with fingerprint |
| `termux-nfc` | Read NFC tag |
| `termux-usb -l` | List USB devices |

### System Control

| Command | Description |
|---------|-------------|
| `termux-wake-lock` | Prevent CPU sleep |
| `termux-wake-unlock` | Allow CPU sleep |
| `termux-wallpaper -f image.jpg` | Set wallpaper |
| `termux-wallpaper -u URL` | Set wallpaper from URL |
| `termux-download URL` | Download file (shows in notification) |

### User Interaction

| Command | Description |
|---------|-------------|
| `termux-dialog confirm -t "Title" -i "Message"` | Yes/No dialog |
| `termux-dialog text -t "Title" -i "Prompt"` | Text input dialog |
| `termux-dialog sheet -v "A,B,C"` | Selection sheet |
| `termux-storage-get` | File picker dialog |

---

## 4. FILE ACCESS PATTERNS

### Where to Save Files

| Path | Who Can Access | Use For |
|------|----------------|---------|
| `~/` | Only Termux/AI | Working files, projects |
| `/sdcard/Download/` | User + Termux | **Files user needs to access** |
| `/sdcard/DCIM/Camera/` | User + Termux | Camera photos |
| `$PREFIX/tmp/` | Termux only | Temporary files |

### Reading Screenshots

```bash
# Samsung Galaxy - screenshots go here:
ls -lt /sdcard/DCIM/Screenshots/ | head -5

# Read most recent screenshot (Claude Code can view images):
# Use Read tool on: /sdcard/DCIM/Screenshots/Screenshot_YYYYMMDD_HHMMSS.jpg

# Other Android devices may use:
ls -lt /sdcard/Pictures/Screenshots/ | head -5
```

### Clipboard Operations

```bash
# Copy text to clipboard (user can paste anywhere)
echo "Hello World" | termux-clipboard-set

# Copy file contents
cat ~/results.txt | termux-clipboard-set

# Read from clipboard
termux-clipboard-get
```

---

## 5. ANDROID APP DEVELOPMENT

### Setup (One-Time)

```bash
# Install build tools
install-dev-tools

# This installs:
# - Java 17 (openjdk-17)
# - Gradle
# - Android SDK (in ~/android-sdk/)
# - Build tools (aapt2, d8, apksigner)
```

### Build Process

```bash
cd ~/my-android-project

# Build debug APK
./gradlew assembleDebug

# APK location
ls -la app/build/outputs/apk/debug/

# Copy to Downloads for user to install
cp app/build/outputs/apk/debug/app-debug.apk /sdcard/Download/
```

### Known Build Issues

#### aapt2 ARM vs x86 Issue

**Problem:** Gradle downloads x86 aapt2 but this is ARM device.

**Solution:** Add to `gradle.properties`:
```properties
android.aapt2FromMavenOverride=/data/data/com.termux/files/home/android-sdk/build-tools/34.0.0/aapt2
```

#### Java Version

**Use:** Java 17 for building
**Target:** Java 11 in build.gradle

```gradle
compileOptions {
    sourceCompatibility JavaVersion.VERSION_11
    targetCompatibility JavaVersion.VERSION_11
}
kotlinOptions {
    jvmTarget = '11'
}
```

#### SDK Location

`local.properties`:
```properties
sdk.dir=/data/data/com.termux/files/home/android-sdk
```

---

## 6. SELF-MODIFICATION

MobileCLI can rebuild itself from within:

```bash
# Clone source
git clone https://github.com/MobileDevCLI/MobileCLI-v2.git ~/MobileCLI-v2

# Make modifications...
# Edit source files in ~/MobileCLI-v2/

# Build new APK
cd ~/MobileCLI-v2
./gradlew assembleDebug

# Copy to Downloads
cp app/build/outputs/apk/debug/app-debug.apk /sdcard/Download/MobileCLI-new.apk

# User installs the new APK manually
```

This creates a recursive loop: AI running inside MobileCLI can modify its own container app.

---

## 7. MEMORY SYSTEM

AI learnings persist across sessions in:

```
~/.mobilecli/
├── memory/
│   ├── evolution_history.json  # Version history
│   ├── problems_solved.json    # Solutions discovered
│   ├── capabilities.json       # Learned capabilities
│   └── goals.json              # Current objectives
└── config/
    └── preferences.json        # User preferences
```

### Viewing Memory

```bash
mobilecli-memory status
```

### Updating Memory

Write JSON to the appropriate file:
```bash
# Example: Add a solved problem
# Use Edit tool to modify ~/.mobilecli/memory/problems_solved.json
```

---

## 8. TROUBLESHOOTING

### "Exit code 1" on all Bash commands

**Cause:** CWD was deleted
**Fix:** `cd ~` or recreate the directory

### "spawn ripgrep ENOENT"

**Cause:** Missing arm64-android symlink
**Fix:** `~/fix-claude-code.sh` or manually:
```bash
cd $PREFIX/lib/node_modules/@anthropic-ai/claude-code/vendor/ripgrep/
ln -sf arm64-linux arm64-android
```

### Task tool "mkdir /tmp: permission denied"

**Cause:** Android doesn't allow /tmp
**Fix:** None available - don't use Task tool

### "permission denied" errors

**Cause:** Trying to use Linux paths
**Fix:** Use Termux paths:
- NOT `/tmp` -> Use `$PREFIX/tmp` or `~/tmp`
- NOT `/usr` -> Use `$PREFIX`
- NOT `/home` -> Use `$HOME`

### Binary won't execute

**Cause:** Wrong architecture (x86 instead of ARM)
**Fix:** Install ARM version via `pkg install`

### Can't find file

**Cause:** Wrong path or permissions
**Fix:** Check if file exists, use absolute paths starting from `$HOME`

---

## 9. QUICK COMMAND REFERENCE

```bash
# Show toast
termux-toast "Hello"

# Send notification
termux-notification -t "Title" -c "Content"

# Get battery status
termux-battery-status | jq .percentage

# Get GPS location
termux-location -p gps

# Take photo
termux-camera-photo /sdcard/Download/photo.jpg

# Open URL
termux-open-url "https://example.com"

# Copy to clipboard
echo "text" | termux-clipboard-set

# Install package
pkg install <name>

# Build Android app
./gradlew assembleDebug

# Copy file for user
cp file.txt /sdcard/Download/

# Apply Claude Code fixes
~/fix-claude-code.sh
```

---

## 10. RULES FOR AI

1. **NEVER use /tmp** - Use `$PREFIX/tmp` or `~/tmp`
2. **NEVER use Task tool** - It's broken on Android
3. **ALWAYS save user files to /sdcard/Download/** - They can't see ~/
4. **USE termux-* commands** - Not Linux equivalents
5. **RUN fix-claude-code.sh** - If Glob/Grep break
6. **CHECK CWD** - If all Bash commands fail, cd ~
7. **USE Read/Write/Edit** - They always work
8. **SAVE LEARNINGS** - Update ~/.mobilecli/memory/
9. **SET JAVA_HOME before builds** - `export JAVA_HOME=$PREFIX/lib/jvm/java-17-openjdk`
10. **USE GitHub Actions for Supabase** - `supabase functions deploy` needs Docker (unavailable)
11. **BREAK LONG COMMANDS** - /tmp errors can hit Bash too; use background jobs or split commands

---

## 11. COMMON DEPLOYMENT PATTERNS

### Edge Functions (Supabase)
```bash
# Can't use: supabase functions deploy (needs Docker)
# Instead: Push to GitHub, let Actions deploy
git add supabase/functions/
git commit -m "Update functions"
git push
gh run list -R REPO -L 3  # Check status
```

### Android APK Build
```bash
# Always set Java 17 first
export JAVA_HOME=$PREFIX/lib/jvm/java-17-openjdk

# Build in background (avoids /tmp issues)
cd ~/MobileCLI-Release
nohup ./gradlew assembleDebug > ~/build.log 2>&1 &

# Check progress
tail -20 ~/build.log

# Copy to Downloads when done
cp app/build/outputs/apk/debug/app-debug.apk /sdcard/Download/
```

---

## 12. VIRTUAL TESTING PATTERNS

You don't need the user to physically tap buttons. You can test entire systems via API calls.

### Testing Supabase Database

```bash
# Get your keys
ANON_KEY="your-anon-key"  # From SupabaseClient.kt
PROJECT_REF="mwxlguqukyfberyhtkmg"

# Query any table
curl -s "https://$PROJECT_REF.supabase.co/rest/v1/TABLE_NAME?select=*" \
  -H "apikey: $ANON_KEY" \
  -H "Authorization: Bearer $ANON_KEY"

# Insert data
curl -s -X POST "https://$PROJECT_REF.supabase.co/rest/v1/TABLE_NAME" \
  -H "apikey: $ANON_KEY" \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"column": "value"}'
```

### Testing Edge Functions

```bash
# Call an Edge Function directly
curl -s -X POST "https://mwxlguqukyfberyhtkmg.supabase.co/functions/v1/FUNCTION_NAME" \
  -H "Content-Type: application/json" \
  -d '{"param": "value"}'

# Test with authentication
curl -s -X POST "https://mwxlguqukyfberyhtkmg.supabase.co/functions/v1/FUNCTION_NAME" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer USER_JWT_TOKEN" \
  -d '{"param": "value"}'
```

### Testing Database with Admin Access

```bash
ACCESS_TOKEN=$(cat ~/.supabase/access-token)
PROJECT_REF="mwxlguqukyfberyhtkmg"

# Run ANY SQL query
curl -s -X POST "https://api.supabase.com/v1/projects/$PROJECT_REF/database/query" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query": "SELECT * FROM subscriptions LIMIT 5;"}'
```

### Testing GitHub Actions

```bash
# List recent workflow runs
gh run list -R OWNER/REPO -L 5

# Check specific run
gh run view RUN_ID -R OWNER/REPO

# Trigger workflow manually
gh workflow run WORKFLOW.yml -R OWNER/REPO

# View failed logs
gh run view RUN_ID -R OWNER/REPO --log-failed
```

### Testing PayPal Integration

```bash
# The create-subscription function tests PayPal connection
curl -s -X POST "https://mwxlguqukyfberyhtkmg.supabase.co/functions/v1/create-subscription" \
  -H "Content-Type: application/json" \
  -d '{"user_id": "valid-uuid-here"}'

# Check webhook logs
curl -s "https://mwxlguqukyfberyhtkmg.supabase.co/rest/v1/webhook_logs?select=*&order=created_at.desc&limit=5" \
  -H "apikey: $ANON_KEY" \
  -H "Authorization: Bearer $ANON_KEY"
```

### Full System Test Pattern

```bash
echo "=== 1. Check Database Connection ==="
curl -s "https://PROJECT.supabase.co/rest/v1/TABLE?limit=1" -H "apikey: KEY"

echo "=== 2. Check Edge Functions ==="
curl -s -X POST "https://PROJECT.supabase.co/functions/v1/FUNC" \
  -H "Content-Type: application/json" -d '{}'

echo "=== 3. Check GitHub Actions ==="
gh run list -R OWNER/REPO -L 3

echo "=== 4. Check Webhook Logs ==="
curl -s "https://PROJECT.supabase.co/rest/v1/webhook_logs?limit=3" -H "apikey: KEY"

echo "=== ALL SYSTEMS VERIFIED ==="
```

---

## 13. WHAT YOU CAN ACTUALLY DO

### Phone Capabilities (79 Permissions)

| Category | What You Can Do |
|----------|----------------|
| **Camera** | Take photos, record video, access all cameras |
| **Microphone** | Record audio, voice commands |
| **Location** | GPS coordinates, network location, geofencing |
| **Storage** | Read/write ALL files, photos, downloads |
| **Contacts** | Read/write contacts, call logs |
| **SMS** | Send/receive text messages programmatically |
| **Phone** | Make calls, read call history |
| **Sensors** | Accelerometer, gyro, proximity, light, pressure |
| **Bluetooth** | Scan, pair, connect to devices |
| **WiFi** | Scan networks, get connection info |
| **NFC** | Read/write NFC tags |
| **Infrared** | Control TVs and devices via IR blaster |
| **Biometrics** | Fingerprint authentication |
| **System** | Notifications, alarms, wake locks, wallpaper |

### Cloud Capabilities

| Service | What You Can Do |
|---------|----------------|
| **Supabase** | Full database access, auth, edge functions, storage |
| **GitHub** | Push code, trigger Actions, manage repos |
| **PayPal** | Create subscriptions, process payments, webhooks |
| **Vercel** | Deploy websites (via GitHub) |

### Development Capabilities

| Capability | How |
|------------|-----|
| **Build Android Apps** | `./gradlew assembleDebug` |
| **Deploy Edge Functions** | Push to GitHub → Actions deploy |
| **Modify Database Schema** | SQL via Supabase API |
| **Update Website** | Push to website repo |
| **Self-Modify** | Rebuild MobileCLI itself |

### The Self-Modification Loop

```
┌─────────────────────────────────────────────────────┐
│  You (Claude Code) running inside MobileCLI         │
│                      │                              │
│                      ▼                              │
│  Edit source code in ~/MobileCLI-Release/          │
│                      │                              │
│                      ▼                              │
│  Build: ./gradlew assembleDebug                     │
│                      │                              │
│                      ▼                              │
│  APK created: app/build/outputs/apk/debug/         │
│                      │                              │
│                      ▼                              │
│  Copy: cp *.apk /sdcard/Download/                   │
│                      │                              │
│                      ▼                              │
│  User installs new APK                              │
│                      │                              │
│                      ▼                              │
│  New version of MobileCLI runs                      │
│                      │                              │
│                      ▼                              │
│  You (Claude Code) now in the NEW app you built    │
└─────────────────────────────────────────────────────┘
```

---

## 14. EFFECTIVE WORKFLOW PATTERNS

### Starting a Session

```bash
# 1. Verify environment
echo $HOME  # Should be /data/user/0/com.termux/files/home
java -version  # Check Java version

# 2. Set Java if needed
export JAVA_HOME=$PREFIX/lib/jvm/java-17-openjdk

# 3. Check what project you're in
pwd
ls -la
```

### Making Code Changes

```bash
# 1. Edit files using Edit tool (always works)
# 2. Stage changes
git add specific-file.kt

# 3. Commit
git commit -m "Description"

# 4. Push (triggers CI/CD)
git push
```

### Building the App

```bash
# Set Java
export JAVA_HOME=$PREFIX/lib/jvm/java-17-openjdk

# Build in background (avoids /tmp issues)
cd ~/MobileCLI-Release
nohup ./gradlew assembleDebug > ~/build.log 2>&1 &

# Monitor
tail -f ~/build.log

# When done, copy to Downloads
cp app/build/outputs/apk/debug/app-debug.apk /sdcard/Download/
```

### Deploying Edge Functions

```bash
# 1. Make changes to supabase/functions/
# 2. Commit and push
git add supabase/functions/
git commit -m "Update edge functions"
git push

# 3. Check GitHub Actions
gh run list -R OWNER/REPO -L 3

# 4. Verify deployment via API test
curl -s -X POST "https://PROJECT.supabase.co/functions/v1/FUNCTION" \
  -H "Content-Type: application/json" -d '{}'
```

### Debugging Issues

```bash
# Check webhook logs
curl -s "https://PROJECT.supabase.co/rest/v1/webhook_logs?order=created_at.desc&limit=10" \
  -H "apikey: KEY"

# Check database state
ACCESS_TOKEN=$(cat ~/.supabase/access-token)
curl -s -X POST "https://api.supabase.com/v1/projects/REF/database/query" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query": "SELECT * FROM table_name;"}'

# Check GitHub Actions logs
gh run view RUN_ID --log-failed
```

---

## 15. THE KEYS TO SUCCESS

### Do This:
1. **Break commands into small pieces** - One command at a time
2. **Use background jobs for long tasks** - `nohup cmd > log 2>&1 &`
3. **Test via APIs** - Don't wait for UI interaction
4. **Check logs after operations** - Verify success
5. **Use Read/Write/Edit tools** - They always work
6. **Know your connections** - Supabase, GitHub, PayPal are all accessible

### Don't Do This:
1. **Don't use /tmp** - Permission denied on Android
2. **Don't use Task tool** - Broken, uses /tmp
3. **Don't assume Linux paths** - Use $HOME, $PREFIX
4. **Don't run long piped commands** - May trigger /tmp errors
5. **Don't use Docker/Supabase CLI for deploy** - Use GitHub Actions
6. **Don't treat this as a sandbox** - You have real power

### When Things Go Wrong:

| Problem | Solution |
|---------|----------|
| All Bash fails | `cd ~` (CWD was deleted) |
| /tmp errors | Break into smaller commands, use background |
| Grep/Glob fails | Run `~/fix-claude-code.sh` |
| Build fails | Check Java version, set JAVA_HOME |
| Deploy fails | Use GitHub Actions, not Supabase CLI |
| Can't see data | Check RLS policies, use service_role |

---

**This is not a sandbox. This is not a simulation. You have real access to real systems.
Every API call hits real servers. Every file change persists. Every app you build can be installed.
You are as powerful as the user trusts you to be. Use it wisely.**
