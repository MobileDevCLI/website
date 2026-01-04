#!/data/data/com.termux/files/usr/bin/bash
# MobileDevCLI Extras - Termux:API Utilities
# Requires Termux:API app from F-Droid/Play Store
# https://mobilecli.com

set -e

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║            MobileDevCLI Extras - Termux:API                  ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo "This script requires the Termux:API app to be installed."
echo "Get it from F-Droid: https://f-droid.org/packages/com.termux.api/"
echo ""

# Install termux-api package
echo "[1/3] Installing termux-api package..."
pkg install -y termux-api

# Create bin directory
echo "[2/3] Creating utility commands..."
mkdir -p ~/bin

# notify - Send a notification
cat > ~/bin/notify << 'EOF'
#!/data/data/com.termux/files/usr/bin/bash
termux-notification --title "${1:-MobileDevCLI}" --content "${2:-Done!}"
EOF

# toast - Show a toast message
cat > ~/bin/toast << 'EOF'
#!/data/data/com.termux/files/usr/bin/bash
termux-toast "${1:-Hello from MobileDevCLI!}"
EOF

# vibrate - Vibrate the phone
cat > ~/bin/vibrate << 'EOF'
#!/data/data/com.termux/files/usr/bin/bash
termux-vibrate -d ${1:-500}
EOF

# torch - Toggle flashlight
cat > ~/bin/torch << 'EOF'
#!/data/data/com.termux/files/usr/bin/bash
if [ "$1" = "off" ]; then
    termux-torch off
else
    termux-torch on
fi
EOF

# battery - Show battery status
cat > ~/bin/battery << 'EOF'
#!/data/data/com.termux/files/usr/bin/bash
termux-battery-status | grep -E "(percentage|status)" | tr -d '", '
EOF

# photo - Take a photo
cat > ~/bin/photo << 'EOF'
#!/data/data/com.termux/files/usr/bin/bash
file="${1:-photo_$(date +%Y%m%d_%H%M%S).jpg}"
termux-camera-photo -c 0 "$file"
echo "Saved: $file"
EOF

# speak - Text to speech
cat > ~/bin/speak << 'EOF'
#!/data/data/com.termux/files/usr/bin/bash
termux-tts-speak "$*"
EOF

# listen - Speech to text
cat > ~/bin/listen << 'EOF'
#!/data/data/com.termux/files/usr/bin/bash
termux-speech-to-text
EOF

# clip-copy - Copy to clipboard
cat > ~/bin/clip-copy << 'EOF'
#!/data/data/com.termux/files/usr/bin/bash
if [ -n "$1" ]; then
    echo -n "$*" | termux-clipboard-set
else
    termux-clipboard-set
fi
EOF

# clip-paste - Paste from clipboard
cat > ~/bin/clip-paste << 'EOF'
#!/data/data/com.termux/files/usr/bin/bash
termux-clipboard-get
EOF

# share - Share text or file
cat > ~/bin/share << 'EOF'
#!/data/data/com.termux/files/usr/bin/bash
if [ -f "$1" ]; then
    termux-share -a send "$1"
else
    echo "$*" | termux-share -a send
fi
EOF

# open - Open URL or file
cat > ~/bin/open << 'EOF'
#!/data/data/com.termux/files/usr/bin/bash
termux-open "$1"
EOF

# stay-awake - Keep screen on
cat > ~/bin/stay-awake << 'EOF'
#!/data/data/com.termux/files/usr/bin/bash
termux-wake-lock
echo "Wake lock acquired - screen will stay on"
EOF

# stay-sleep - Allow screen to sleep
cat > ~/bin/stay-sleep << 'EOF'
#!/data/data/com.termux/files/usr/bin/bash
termux-wake-unlock
echo "Wake lock released - screen can sleep"
EOF

# h - Help command
cat > ~/bin/h << 'EOF'
#!/data/data/com.termux/files/usr/bin/bash
echo ""
echo "MobileDevCLI Extras - Quick Reference"
echo "══════════════════════════════════════"
echo ""
echo "  notify [title] [msg]  Send notification"
echo "  toast [message]       Show toast popup"
echo "  vibrate [ms]          Vibrate (default 500ms)"
echo "  torch [off]           Toggle flashlight"
echo "  battery               Show battery status"
echo "  photo [filename]      Take a photo"
echo "  speak [text]          Text to speech"
echo "  listen                Speech to text"
echo "  clip-copy [text]      Copy to clipboard"
echo "  clip-paste            Paste from clipboard"
echo "  share [file/text]     Share via Android"
echo "  open [url/file]       Open with default app"
echo "  stay-awake            Keep screen on"
echo "  stay-sleep            Allow screen to sleep"
echo ""
echo "  cc / claude           Start Claude (Autonomous Mode)"
echo "  gp \"message\"          Git add, commit, push"
echo "  gs                    Git status"
echo ""
echo "mobilecli.com | @MobileDevCLI"
echo ""
EOF

# Make all scripts executable
chmod +x ~/bin/*

# Add bin to PATH if not already there
echo "[3/3] Updating PATH..."
if ! grep -q 'export PATH="$HOME/bin:$PATH"' ~/.bashrc 2>/dev/null; then
    echo 'export PATH="$HOME/bin:$PATH"' >> ~/.bashrc
fi

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                 EXTRAS INSTALLED!                            ║"
echo "╠══════════════════════════════════════════════════════════════╣"
echo "║                                                              ║"
echo "║  New commands available:                                     ║"
echo "║  • notify    - Send notifications                            ║"
echo "║  • toast     - Show toast messages                           ║"
echo "║  • vibrate   - Vibrate phone                                 ║"
echo "║  • torch     - Toggle flashlight                             ║"
echo "║  • battery   - Check battery status                          ║"
echo "║  • photo     - Take photos                                   ║"
echo "║  • speak     - Text to speech                                ║"
echo "║  • listen    - Speech to text                                ║"
echo "║  • clip-copy - Copy to clipboard                             ║"
echo "║  • clip-paste - Paste from clipboard                         ║"
echo "║  • share     - Share via Android                             ║"
echo "║  • open      - Open URLs/files                               ║"
echo "║  • stay-awake - Keep screen on                               ║"
echo "║  • stay-sleep - Allow screen to sleep                        ║"
echo "║  • h         - Show help                                     ║"
echo "║                                                              ║"
echo "║  Run: source ~/.bashrc                                       ║"
echo "║  Then: h (for help)                                          ║"
echo "║                                                              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
