# MobileDevCLI - AI Instructions

## Quick Context
This is MobileDevCLI - a brand/website/toolset that turns Android phones into AI development environments.

**Owner**: Samblamz (anonymous - never share personal info)
**Website**: mobilecli.com
**GitHub**: github.com/MobileDevCLI

## Project Structure
```
├── setup.sh           # Main installer script
├── extras.sh          # Termux:API utilities
├── index.html         # Homepage (Matrix hero)
├── games.html         # Games arcade
├── learn.html         # AI environments comparison
├── games/
│   └── sketchbook.html   # Quick Draw paint app
├── PROJECT_HISTORY.md # Full project history & research
├── CLAUDE.md          # This file
├── README.md          # GitHub readme
└── LICENSE            # MIT
```

## Commands
- Build/test: Just open HTML files in browser
- Deploy: `gp "message"` (auto-deploys via Vercel)
- Validate scripts: `bash -n setup.sh`

## Style Guidelines
- **Color scheme**: Black (#000000) background, Matrix green (#00ff41) accent
- **Font**: Monospace for code/terminal elements
- **Design**: Dark, minimal, professional
- **Mobile-first**: Always test on phone viewport

## Code Patterns
- Use vanilla HTML/CSS/JS (no frameworks)
- Inline styles are OK for single-page sites
- Always add `.html` extensions to internal links
- Mobile tabs appear on screens <768px

## Important Rules
1. **Never share personal info** - user is anonymous (Samblamz)
2. **Always use Boris Mode** - `--dangerously-skip-permissions`
3. **Keep it simple** - no unnecessary complexity
4. **Mobile-first** - test on phone
5. **Update PROJECT_HISTORY.md** when making significant changes

## Current Priorities
1. Twitter API integration
2. Newsletter setup (Buttondown)
3. News page creation
4. Content aggregation system
5. More tutorials/documentation

## Links
- Live site: https://mobilecli.com
- Setup repo: https://github.com/MobileDevCLI/setup
- Website repo: https://github.com/MobileDevCLI/website

## When in Doubt
Read PROJECT_HISTORY.md for full context on what we've built and why.
