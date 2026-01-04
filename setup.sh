#!/data/data/com.termux/files/usr/bin/bash
# MobileDevCLI Setup Script
# Full dev environment in your pocket
# https://mobilecli.com

set -e

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                                                              ║"
echo "║   ███╗   ███╗ ██████╗ ██████╗ ██╗██╗     ███████╗           ║"
echo "║   ████╗ ████║██╔═══██╗██╔══██╗██║██║     ██╔════╝           ║"
echo "║   ██╔████╔██║██║   ██║██████╔╝██║██║     █████╗             ║"
echo "║   ██║╚██╔╝██║██║   ██║██╔══██╗██║██║     ██╔══╝             ║"
echo "║   ██║ ╚═╝ ██║╚██████╔╝██████╔╝██║███████╗███████╗           ║"
echo "║   ╚═╝     ╚═╝ ╚═════╝ ╚═════╝ ╚═╝╚══════╝╚══════╝           ║"
echo "║                     DEV CLI                                  ║"
echo "║                                                              ║"
echo "║         Full dev environment in your pocket                  ║"
echo "║                                                              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Step 1: Setup storage access
echo "[1/5] Setting up storage access..."
termux-setup-storage
sleep 2

# Step 2: Update packages
echo "[2/5] Updating Termux packages..."
pkg update -y && pkg upgrade -y

# Step 3: Install essentials
echo "[3/5] Installing Node.js, Git, and GitHub CLI..."
pkg install -y nodejs git gh

# Step 4: Install Claude Code
echo "[4/5] Installing Claude Code..."
npm install -g @anthropic-ai/claude-code

# Step 5: Configure environment
echo "[5/5] Configuring environment..."

# Create termux.properties if it doesn't exist
mkdir -p ~/.termux
if [ ! -f ~/.termux/termux.properties ]; then
    touch ~/.termux/termux.properties
fi

# Enable external apps
if ! grep -q "allow-external-apps" ~/.termux/termux.properties 2>/dev/null; then
    echo "allow-external-apps=true" >> ~/.termux/termux.properties
fi

# Backup existing .bashrc
if [ -f ~/.bashrc ]; then
    cp ~/.bashrc ~/.bashrc.backup.$(date +%s)
fi

# Add MobileDevCLI configuration to .bashrc
cat >> ~/.bashrc << 'BASHRC_END'

# ═══════════════════════════════════════════════════════════════════
# MobileDevCLI Configuration
# https://mobilecli.com
# ═══════════════════════════════════════════════════════════════════

# Autonomous Mode - Claude Code with full permissions
alias claude="claude --dangerously-skip-permissions"
alias cc="claude --dangerously-skip-permissions"

# Auto-create CLAUDE.md when entering git repos
cd() {
    builtin cd "$@" || return
    if [ -d .git ] && [ ! -f CLAUDE.md ]; then
        cat > CLAUDE.md << 'CLAUDEMD'
# Project Guidelines

## Commands
- Build: `npm run build` or check package.json
- Test: `npm test`
- Lint: `npm run lint`

## Notes
- Add project-specific instructions here
- Claude will read this file automatically
CLAUDEMD
        echo "Created CLAUDE.md for this project"
    fi
}

# Quick git push
gp() {
    local msg="${1:-update}"
    git add -A && git commit -m "$msg" && git push
}

# Quick git status
gs() {
    git status
}

# ═══════════════════════════════════════════════════════════════════
BASHRC_END

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                    SETUP COMPLETE!                           ║"
echo "╠══════════════════════════════════════════════════════════════╣"
echo "║                                                              ║"
echo "║  What's installed:                                           ║"
echo "║  • Claude Code (AI coding assistant)                         ║"
echo "║  • Node.js (JavaScript runtime)                              ║"
echo "║  • Git (version control)                                     ║"
echo "║  • GitHub CLI (gh command)                                   ║"
echo "║                                                              ║"
echo "║  New commands:                                               ║"
echo "║  • cc or claude  - Start Claude (Autonomous Mode)             ║"
echo "║  • gp \"message\"  - Quick git add, commit, push              ║"
echo "║  • gs            - Git status                                ║"
echo "║                                                              ║"
echo "║  Next steps:                                                 ║"
echo "║  1. Run: source ~/.bashrc                                    ║"
echo "║  2. Run: gh auth login                                       ║"
echo "║  3. Run: cc (to start Claude)                                ║"
echo "║                                                              ║"
echo "║  Optional extras (Termux:API features):                      ║"
echo "║  curl -sL mobilecli.com/extras.sh | bash                     ║"
echo "║                                                              ║"
echo "╠══════════════════════════════════════════════════════════════╣"
echo "║  mobilecli.com | @MobileDevCLI | github.com/MobileDevCLI     ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
