#!/data/data/com.termux/files/usr/bin/bash
#
# MobileCLI One-Tap Setup Script
# Copyright (c) 2026 MobileCLI. All rights reserved.
#
# This script automates the complete setup of an autonomous AI development
# environment on Android devices using Termux.
#
# Usage: curl -sL https://mobilecli.com/install | bash
#
# License: This script is provided for MobileCLI Pro subscribers only.
# Redistribution is prohibited under the Terms of Service.
#

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Version
VERSION="1.0.0"
INSTALL_LOG="$HOME/.mobilecli/install.log"

# Banner
print_banner() {
    echo -e "${GREEN}"
    echo '  __  __       _     _ _       _____ _      _____ '
    echo ' |  \/  |     | |   (_) |     / ____| |    |_   _|'
    echo ' | \  / | ___ | |__  _| | ___| |    | |      | |  '
    echo ' | |\/| |/ _ \| '\''_ \| | |/ _ \ |    | |      | |  '
    echo ' | |  | | (_) | |_) | | |  __/ |____| |____ _| |_ '
    echo ' |_|  |_|\___/|_.__/|_|_|\___|\_____|______|_____|'
    echo -e "${NC}"
    echo -e "${CYAN}  Autonomous AI Development Environment${NC}"
    echo -e "${PURPLE}  Version ${VERSION}${NC}"
    echo ""
}

# Logging
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$INSTALL_LOG"
}

print_step() {
    echo -e "${CYAN}[${1}/${TOTAL_STEPS}]${NC} ${BOLD}$2${NC}"
    log "Step $1: $2"
}

print_success() {
    echo -e "    ${GREEN}✓${NC} $1"
    log "SUCCESS: $1"
}

print_warning() {
    echo -e "    ${YELLOW}!${NC} $1"
    log "WARNING: $1"
}

print_error() {
    echo -e "    ${RED}✗${NC} $1"
    log "ERROR: $1"
}

# Check if running in Termux
check_termux() {
    if [ ! -d "/data/data/com.termux" ]; then
        print_error "This script must be run in Termux"
        echo ""
        echo "Download Termux from F-Droid (NOT Play Store):"
        echo "https://f-droid.org/packages/com.termux/"
        exit 1
    fi
}

# Create installation directory
setup_directories() {
    mkdir -p "$HOME/.mobilecli"
    mkdir -p "$HOME/.mobilecli/sessions"
    mkdir -p "$HOME/.mobilecli/templates"
    mkdir -p "$HOME/.mobilecli/backups"
    mkdir -p "$HOME/projects"
    log "Created MobileCLI directories"
}

# Main installation
TOTAL_STEPS=10

main() {
    print_banner
    check_termux
    setup_directories

    echo -e "${BOLD}Starting MobileCLI Setup...${NC}"
    echo ""
    log "=== Installation started ==="

    # Step 1: Update package lists
    print_step 1 "Updating package lists"
    if pkg update -y >> "$INSTALL_LOG" 2>&1; then
        print_success "Package lists updated"
    else
        print_warning "Some packages may not have updated"
    fi

    # Step 2: Upgrade existing packages
    print_step 2 "Upgrading existing packages"
    if pkg upgrade -y >> "$INSTALL_LOG" 2>&1; then
        print_success "Packages upgraded"
    else
        print_warning "Some packages may not have upgraded"
    fi

    # Step 3: Install essential packages
    print_step 3 "Installing essential packages"
    PACKAGES="nodejs-lts git gh openssh tmux python vim curl wget jq htop nano termux-api"

    for pkg_name in $PACKAGES; do
        if pkg install -y "$pkg_name" >> "$INSTALL_LOG" 2>&1; then
            print_success "Installed $pkg_name"
        else
            print_warning "Could not install $pkg_name"
        fi
    done

    # Step 4: Setup storage access
    print_step 4 "Setting up storage access"
    if [ ! -d "$HOME/storage" ]; then
        echo -e "    ${YELLOW}Please grant storage permission when prompted...${NC}"
        termux-setup-storage
        sleep 3
        if [ -d "$HOME/storage" ]; then
            print_success "Storage access granted"
        else
            print_warning "Storage access may need manual setup"
        fi
    else
        print_success "Storage already configured"
    fi

    # Step 5: Install Claude Code
    print_step 5 "Installing Claude Code"
    if npm install -g @anthropic-ai/claude-code >> "$INSTALL_LOG" 2>&1; then
        print_success "Claude Code installed"
        CLAUDE_VERSION=$(claude --version 2>/dev/null || echo "unknown")
        print_success "Version: $CLAUDE_VERSION"
    else
        print_error "Failed to install Claude Code"
        echo "    Try manually: npm install -g @anthropic-ai/claude-code"
    fi

    # Step 6: Configure Git
    print_step 6 "Configuring Git"
    if [ -z "$(git config --global user.name)" ]; then
        echo -e "    ${YELLOW}Git user.name not set${NC}"
        read -p "    Enter your name: " GIT_NAME
        git config --global user.name "$GIT_NAME"
    fi
    if [ -z "$(git config --global user.email)" ]; then
        echo -e "    ${YELLOW}Git user.email not set${NC}"
        read -p "    Enter your email: " GIT_EMAIL
        git config --global user.email "$GIT_EMAIL"
    fi
    print_success "Git configured"

    # Step 7: Setup SSH key
    print_step 7 "Setting up SSH key"
    if [ ! -f "$HOME/.ssh/id_ed25519" ]; then
        ssh-keygen -t ed25519 -f "$HOME/.ssh/id_ed25519" -N "" >> "$INSTALL_LOG" 2>&1
        print_success "SSH key generated"
        echo ""
        echo -e "    ${CYAN}Add this key to GitHub:${NC}"
        echo -e "    ${YELLOW}$(cat $HOME/.ssh/id_ed25519.pub)${NC}"
        echo ""
    else
        print_success "SSH key already exists"
    fi

    # Step 8: Create productivity aliases
    print_step 8 "Creating productivity aliases"

    ALIAS_FILE="$HOME/.mobilecli/aliases.sh"
    cat > "$ALIAS_FILE" << 'ALIASES'
# MobileCLI Productivity Aliases
# Generated by MobileCLI Setup Script

# ===== Claude Shortcuts =====
alias cc="claude"
alias cca="claude --dangerously-skip-permissions"
alias ccp="claude --print"
alias ccr="claude --resume"

# ===== Session Management =====
alias dev="tmux attach -t dev 2>/dev/null || tmux new -s dev"
alias work="tmux attach -t work 2>/dev/null || tmux new -s work"
alias wake="termux-wake-lock && echo '🔒 Wake lock enabled'"
alias unwake="termux-wake-unlock && echo '🔓 Wake lock disabled'"

# ===== Quick Navigation =====
alias proj="cd ~/projects"
alias home="cd ~"
alias ..="cd .."
alias ...="cd ../.."

# ===== Git Shortcuts =====
alias gs="git status"
alias ga="git add -A"
alias gc="git commit -m"
alias gp="git push"
alias gl="git log --oneline -10"
alias gd="git diff"
alias gpull="git pull"
alias gac="git add -A && git commit -m"

# ===== System Info =====
alias battery="termux-battery-status | jq -r '.percentage, .status'"
alias wifi="termux-wifi-connectioninfo | jq -r '.ssid, .ip'"
alias storage="df -h | grep -E '^/dev|Filesystem'"

# ===== Quick Actions =====
alias notify="termux-notification -t 'MobileCLI' -c"
alias say="termux-tts-speak"
alias copy="termux-clipboard-set"
alias paste="termux-clipboard-get"
alias shot="termux-screenshot"
alias share="termux-share"

# ===== Development =====
alias serve="npx http-server -p 8080"
alias py="python"
alias npi="npm install"
alias npr="npm run"

# ===== Session Persistence Combo =====
autonomous() {
    echo "🚀 Starting autonomous development session..."
    termux-wake-lock
    tmux new-session -d -s autonomous 2>/dev/null || tmux attach -t autonomous
    echo "✓ Wake lock enabled"
    echo "✓ Tmux session ready"
    echo ""
    echo "Run: claude --dangerously-skip-permissions"
}

# ===== Quick Project Setup =====
newproject() {
    if [ -z "$1" ]; then
        echo "Usage: newproject <project-name>"
        return 1
    fi
    mkdir -p ~/projects/$1
    cd ~/projects/$1
    git init
    echo "# $1" > README.md
    echo "Created project: $1"
}

# ===== Status Check =====
status() {
    echo "=== MobileCLI Status ==="
    echo ""
    echo "Battery: $(termux-battery-status 2>/dev/null | jq -r '.percentage // "N/A"')%"
    echo "Wake Lock: $(pgrep -x "termux-wake-lock" > /dev/null && echo "Active" || echo "Inactive")"
    echo "Tmux Sessions: $(tmux list-sessions 2>/dev/null | wc -l || echo "0")"
    echo "Node: $(node --version 2>/dev/null || echo "Not installed")"
    echo "Claude: $(claude --version 2>/dev/null || echo "Not installed")"
    echo ""
}

# ===== Help =====
mchelp() {
    echo "=== MobileCLI Commands ==="
    echo ""
    echo "SESSION:"
    echo "  dev         - Start/attach dev tmux session"
    echo "  wake        - Enable wake lock"
    echo "  autonomous  - Full autonomous setup"
    echo ""
    echo "CLAUDE:"
    echo "  cc          - Run Claude"
    echo "  cca         - Run Claude (autonomous mode)"
    echo "  ccr         - Resume last Claude session"
    echo ""
    echo "GIT:"
    echo "  gs/ga/gc/gp - Status/Add/Commit/Push"
    echo "  gac 'msg'   - Add all and commit"
    echo ""
    echo "TOOLS:"
    echo "  status      - Show system status"
    echo "  battery     - Check battery"
    echo "  notify 'x'  - Send notification"
    echo "  newproject  - Create new project"
    echo ""
}

echo "MobileCLI aliases loaded. Type 'mchelp' for commands."
ALIASES

    # Add to .bashrc if not already there
    if ! grep -q "mobilecli/aliases.sh" "$HOME/.bashrc" 2>/dev/null; then
        echo "" >> "$HOME/.bashrc"
        echo "# MobileCLI Aliases" >> "$HOME/.bashrc"
        echo "source $HOME/.mobilecli/aliases.sh" >> "$HOME/.bashrc"
    fi

    print_success "Aliases created"
    print_success "Type 'mchelp' for command reference"

    # Step 9: Create default CLAUDE.md template
    print_step 9 "Creating default CLAUDE.md template"

    cat > "$HOME/.mobilecli/templates/CLAUDE.md.default" << 'CLAUDEMD'
# Project Instructions

## Development Environment
This project is being developed using MobileCLI - autonomous AI development on Android.

## Workflow
1. Make changes
2. Test locally
3. Commit with descriptive message
4. Push to remote

## Code Standards
- Write clean, readable code
- Add comments for complex logic
- Follow existing patterns in the codebase
- Test changes before committing

## Git Workflow
```bash
git add -A && git commit -m "description" && git push
```

## Important Notes
- Always verify changes work before committing
- Create backups before major refactors
- Document any new patterns or decisions
CLAUDEMD

    print_success "Default CLAUDE.md template created"

    # Step 10: Final setup and verification
    print_step 10 "Verifying installation"

    echo ""
    INSTALL_SUCCESS=true

    # Check Node
    if command -v node &> /dev/null; then
        print_success "Node.js: $(node --version)"
    else
        print_error "Node.js not found"
        INSTALL_SUCCESS=false
    fi

    # Check Git
    if command -v git &> /dev/null; then
        print_success "Git: $(git --version | cut -d' ' -f3)"
    else
        print_error "Git not found"
        INSTALL_SUCCESS=false
    fi

    # Check Claude
    if command -v claude &> /dev/null; then
        print_success "Claude Code: installed"
    else
        print_error "Claude Code not found"
        INSTALL_SUCCESS=false
    fi

    # Check tmux
    if command -v tmux &> /dev/null; then
        print_success "tmux: $(tmux -V | cut -d' ' -f2)"
    else
        print_error "tmux not found"
        INSTALL_SUCCESS=false
    fi

    # Check gh
    if command -v gh &> /dev/null; then
        print_success "GitHub CLI: $(gh --version | head -1 | cut -d' ' -f3)"
    else
        print_warning "GitHub CLI not found (optional)"
    fi

    echo ""

    # Final summary
    if [ "$INSTALL_SUCCESS" = true ]; then
        echo -e "${GREEN}${BOLD}========================================${NC}"
        echo -e "${GREEN}${BOLD}   MobileCLI Setup Complete!${NC}"
        echo -e "${GREEN}${BOLD}========================================${NC}"
        echo ""
        echo -e "${CYAN}Next Steps:${NC}"
        echo ""
        echo "  1. Restart Termux or run:"
        echo -e "     ${YELLOW}source ~/.bashrc${NC}"
        echo ""
        echo "  2. Start an autonomous session:"
        echo -e "     ${YELLOW}autonomous${NC}"
        echo ""
        echo "  3. Run Claude in autonomous mode:"
        echo -e "     ${YELLOW}cca${NC}"
        echo ""
        echo "  4. View all commands:"
        echo -e "     ${YELLOW}mchelp${NC}"
        echo ""
        echo -e "${PURPLE}Documentation: https://mobilecli.com/learn${NC}"
        echo -e "${PURPLE}Pro Dashboard: https://mobilecli.com/pro-preview${NC}"
        echo ""
        log "=== Installation completed successfully ==="
    else
        echo -e "${RED}${BOLD}========================================${NC}"
        echo -e "${RED}${BOLD}   Setup Incomplete${NC}"
        echo -e "${RED}${BOLD}========================================${NC}"
        echo ""
        echo "Some components failed to install."
        echo "Check the log file: $INSTALL_LOG"
        echo ""
        log "=== Installation completed with errors ==="
    fi

    # Record installation
    echo "$(date '+%Y-%m-%d %H:%M:%S')" > "$HOME/.mobilecli/installed"
    echo "$VERSION" >> "$HOME/.mobilecli/installed"
}

# Run main function
main "$@"
