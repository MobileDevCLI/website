#!/data/data/com.termux/files/usr/bin/bash
# MobileCLI API Script Regenerator
# Overwrites termux-api package scripts with MobileCLI's built-in API
#
# Usage: curl -s https://mobilecli.com/regenerate-api.sh | bash
#
# This fixes the issue where `pkg install termux-api` overwrites
# MobileCLI's custom scripts that use the built-in TermuxApiReceiver.

PREFIX=/data/data/com.termux/files/usr
BIN=$PREFIX/bin
TMP=$PREFIX/tmp

mkdir -p "$TMP"

echo "=== MobileCLI API Script Regenerator ==="
echo ""

# Base script generator
gen_script() {
    local name="$1"
    local method="$2"
    local args="${3:-\"\"}"
    cat > "$BIN/$name" << EOF
#!/data/data/com.termux/files/usr/bin/bash
# MobileCLI API: $name
RESULT_FILE="$TMP/api_result_\$\$"
am broadcast -n com.termux/com.termux.TermuxApiReceiver -a com.termux.api.API_CALL \\
    --es api_method "$method" \\
    --es api_args $args \\
    --es result_file "\$RESULT_FILE" \\
    > /dev/null 2>&1
sleep 0.3
if [ -f "\$RESULT_FILE" ]; then
    cat "\$RESULT_FILE"
    rm -f "\$RESULT_FILE"
fi
EOF
    chmod 755 "$BIN/$name"
    echo "  Generated: $name"
}

echo "Generating API scripts..."
echo ""

# Clipboard
gen_script "termux-clipboard-get" "clipboard-get" '""'
gen_script "termux-clipboard-set" "clipboard-set" '"\$*"'

# Notifications
gen_script "termux-toast" "toast" '"\$*"'

# Device Info
gen_script "termux-battery-status" "battery-status" '""'
gen_script "termux-vibrate" "vibrate" '"\${1:-1000}"'
gen_script "termux-brightness" "brightness" '""'
gen_script "termux-torch" "torch" '"\${1:-on}"'
gen_script "termux-volume" "volume" '""'
gen_script "termux-audio-info" "audio-info" '""'

# Network
gen_script "termux-wifi-connectioninfo" "wifi-connectioninfo" '""'
gen_script "termux-wifi-scaninfo" "wifi-scaninfo" '""'
gen_script "termux-wifi-enable" "wifi-enable" '"\$1"'

# Location
gen_script "termux-location" "location" '""'

# Camera
gen_script "termux-camera-info" "camera-info" '""'

# TTS
gen_script "termux-tts-engines" "tts-engines" '""'
gen_script "termux-tts-speak" "tts-speak" '"\$*"'

# Telephony
gen_script "termux-telephony-call" "telephony-call" '"\$1"'
gen_script "termux-telephony-cellinfo" "telephony-cellinfo" '""'
gen_script "termux-telephony-deviceinfo" "telephony-deviceinfo" '""'

# SMS
gen_script "termux-sms-list" "sms-list" '"\$*"'

# Contacts
gen_script "termux-contact-list" "contact-list" '""'

# Call Log
gen_script "termux-call-log" "call-log" '"\${1:-10}"'

# Sensors
gen_script "termux-sensor" "sensor" '"\$*"'

# Biometric
gen_script "termux-fingerprint" "fingerprint" '""'

# Infrared
gen_script "termux-infrared-frequencies" "infrared-frequencies" '""'

# USB
gen_script "termux-usb" "usb" '""'

# NFC
gen_script "termux-nfc" "nfc" '""'

# Bluetooth
gen_script "termux-bluetooth-info" "bluetooth-info" '""'
gen_script "termux-bluetooth-scaninfo" "bluetooth-scaninfo" '""'
gen_script "termux-bluetooth-paired" "bluetooth-paired" '""'
gen_script "termux-bluetooth-enable" "bluetooth-enable" '"\$1"'

# System
gen_script "termux-open-url" "open-url" '"\$1"'
gen_script "termux-download" "download" '"\$*"'
gen_script "termux-share" "share" '"\$*"'
gen_script "termux-wallpaper" "wallpaper" '"\$1"'
gen_script "termux-media-scan" "media-scan" '"\$1"'

# Wake Lock
gen_script "termux-wake-lock" "wake-lock" '"acquire"'
gen_script "termux-wake-unlock" "wake-lock" '"release"'

echo ""
echo "=== Done! ==="
echo ""
echo "Generated $(ls $BIN/termux-* 2>/dev/null | wc -l) API scripts."
echo ""
echo "Test with:"
echo "  termux-vibrate"
echo "  termux-toast 'Hello from MobileCLI'"
echo "  termux-battery-status"
echo ""
echo "NOTE: Do NOT run 'pkg install termux-api' - it will overwrite these scripts."
