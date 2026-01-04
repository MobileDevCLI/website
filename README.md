# MobileDevCLI

<div align="center">

```
███╗   ███╗ ██████╗ ██████╗ ██╗██╗     ███████╗
████╗ ████║██╔═══██╗██╔══██╗██║██║     ██╔════╝
██╔████╔██║██║   ██║██████╔╝██║██║     █████╗
██║╚██╔╝██║██║   ██║██╔══██╗██║██║     ██╔══╝
██║ ╚═╝ ██║╚██████╔╝██████╔╝██║███████╗███████╗
╚═╝     ╚═╝ ╚═════╝ ╚═════╝ ╚═╝╚══════╝╚══════╝
                  DEV CLI
```

**Full dev environment in your pocket**

[Website](https://mobilecli.com) · [Twitter](https://twitter.com/MobileDevCLI) · [GitHub](https://github.com/MobileDevCLI)

</div>

---

## What is MobileDevCLI?

MobileDevCLI turns any Android phone into a complete AI-powered coding environment. One command installs everything you need: Claude Code (Anthropic's AI coding assistant), Node.js, Git, and GitHub CLI. Start coding from anywhere with just your phone.

## Quick Start

### 1. Install Termux
Download [Termux from F-Droid](https://f-droid.org/packages/com.termux/) (recommended) or Google Play Store.

### 2. Run the installer
```bash
curl -sL https://raw.githubusercontent.com/MobileDevCLI/setup/main/setup.sh | bash
```

### 3. Reload your shell
```bash
source ~/.bashrc
```

### 4. Login to GitHub and start coding
```bash
gh auth login
cc
```

That's it! You're ready to code.

---

## What Gets Installed

| Package | Description |
|---------|-------------|
| **Claude Code** | Anthropic's AI coding assistant in your terminal |
| **Node.js** | JavaScript runtime for modern development |
| **Git** | Version control system |
| **GitHub CLI** | Official GitHub command-line tool |

## Commands Reference

### Core Commands

| Command | Description |
|---------|-------------|
| `cc` | Start Claude Code in Autonomous Mode |
| `claude` | Same as `cc` |
| `gp "message"` | Git add, commit, and push in one command |
| `gs` | Git status |

### Extras (Optional)

Install additional Termux:API utilities:

```bash
curl -sL https://raw.githubusercontent.com/MobileDevCLI/setup/main/extras.sh | bash
```

Requires [Termux:API app](https://f-droid.org/packages/com.termux.api/).

| Command | Description |
|---------|-------------|
| `notify [title] [msg]` | Send Android notification |
| `toast [message]` | Show toast popup |
| `vibrate [ms]` | Vibrate phone |
| `torch [off]` | Toggle flashlight |
| `battery` | Show battery status |
| `photo [filename]` | Take a photo |
| `speak [text]` | Text to speech |
| `listen` | Speech to text |
| `clip-copy [text]` | Copy to clipboard |
| `clip-paste` | Paste from clipboard |
| `share [file/text]` | Share via Android |
| `open [url/file]` | Open with default app |
| `stay-awake` | Keep screen on |
| `stay-sleep` | Allow screen to sleep |
| `h` | Show help |

---

## Autonomous Mode

MobileDevCLI runs Claude Code in "Autonomous Mode" by default (`--dangerously-skip-permissions`). This means Claude can:

- Read and write files without asking
- Run shell commands without asking
- Work autonomously on your projects

This is perfect for mobile development where typing confirmations is tedious. If you prefer the standard permission model, run `claude` without the alias:

```bash
/data/data/com.termux/files/usr/bin/claude
```

---

## Auto CLAUDE.md

When you `cd` into a git repository, MobileDevCLI automatically creates a `CLAUDE.md` file if one doesn't exist. This file tells Claude about your project's conventions, commands, and guidelines.

Edit it to customize Claude's behavior for each project:

```markdown
# Project Guidelines

## Commands
- Build: `npm run build`
- Test: `npm test`
- Lint: `npm run lint`

## Notes
- Use TypeScript for all new files
- Follow existing code style
```

---

## Troubleshooting

### "Permission denied" errors
```bash
termux-setup-storage
```
Then restart Termux.

### Claude won't start
Make sure you have an Anthropic API key or Claude subscription:
```bash
claude
# Follow the authentication prompts
```

### GitHub CLI not working
```bash
gh auth login
# Select: GitHub.com > HTTPS > Yes > Login with web browser
```

### Termux:API commands not working
1. Install the [Termux:API app](https://f-droid.org/packages/com.termux.api/)
2. Grant all permissions when prompted
3. Run `termux-setup-storage` and restart Termux

### Package installation fails
```bash
pkg update && pkg upgrade
```

---

## Links

- **Website**: [mobilecli.com](https://mobilecli.com)
- **Twitter/X**: [@MobileDevCLI](https://twitter.com/MobileDevCLI)
- **GitHub**: [github.com/MobileDevCLI](https://github.com/MobileDevCLI)
- **Email**: mobiledevcli@gmail.com

---

## The Invention

This isn't just a setup script. **It's an invention.**

Read [GENESIS.md](GENESIS.md) for the full story of how we built an autonomous development platform that outperforms Replit - entirely on a phone.

---

## License & Intellectual Property

**Source Code**: MIT License - see [LICENSE](LICENSE)

**Method/Invention**: All Rights Reserved - see [IP_NOTICE.md](IP_NOTICE.md)

The code is open source. The method is proprietary intellectual property.

---

<div align="center">

**Invented by Samblamz. Built entirely on a mobile phone.**

Copyright (c) 2026 Samblamz / MobileDevCLI

</div>
