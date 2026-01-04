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
├── learn.html         # Setup guide
├── news.html          # News feed
├── games/
│   └── sketchbook.html   # Quick Draw paint app
├── PROJECT_HISTORY.md # Full project history & research
├── ROADMAP.md         # Full platform vision & feature roadmap
├── CLAUDE.md          # This file
├── README.md          # GitHub readme
└── LICENSE            # MIT
```

## Git Branching Strategy

### ALWAYS use this workflow:

**Branches:**
```
main        → Production (auto-deploys to Vercel)
develop     → Staging/testing
feature/*   → New features
hotfix/*    → Urgent production fixes
```

**Before Major Changes:**
```bash
# Create a version tag BEFORE making big changes
git tag -a v1.X.X -m "Description of current stable state"
git push origin v1.X.X

# Create feature branch
git checkout -b feature/feature-name
# ... make changes ...
git add -A && git commit -m "message"
git checkout main && git merge feature/feature-name
git push
```

**Rollback if Something Breaks:**
```bash
# See all tags
git tag -l

# Rollback to a tag
git checkout vX.X.X
git checkout -b rollback-branch
git push origin rollback-branch:main --force

# Or revert specific commits
git revert <commit-hash>
git push
```

**Tag Naming:**
- v1.0.0 → Major version (breaking changes)
- v1.1.0 → Minor version (new features)
- v1.1.1 → Patch (bug fixes)

### CRITICAL: Create a tag before:
- Adding authentication
- Adding payments
- Major redesigns
- Database changes
- Any change you might want to undo

## Commands
- Build/test: Just open HTML files in browser
- Deploy: `gp "message"` (auto-deploys via Vercel)
- Validate scripts: `bash -n setup.sh`
- Create tag: `git tag -a vX.X.X -m "message" && git push origin vX.X.X`

## Style Guidelines
- **Color scheme**: Black (#000000) background, Matrix green (#00ff41) accent
- **Font**: Monospace for code/terminal elements
- **Design**: Dark, minimal, professional
- **Mobile-first**: Always test on phone viewport

## Code Patterns
- Use vanilla HTML/CSS/JS (no frameworks currently)
- Inline styles are OK for single-page sites
- Always add `.html` extensions to internal links
- Mobile tabs appear on screens <768px
- Include `@media (max-width: 400px)` for extra small screens

## Important Rules
1. **Never share personal info** - user is anonymous (Samblamz)
2. **Always use Boris Mode** - `--dangerously-skip-permissions`
3. **Keep it simple** - no unnecessary complexity
4. **Mobile-first** - test on phone
5. **Update PROJECT_HISTORY.md** when making significant changes
6. **Create version tags** before major changes
7. **Sync both repos** - setup and website repos should match

## Two Repos (Keep in Sync)
1. `MobileDevCLI/setup` - Main source of truth
2. `MobileDevCLI/website` - Vercel deployment

After changes:
```bash
# Commit to setup repo
cd ~/mobiledevcli
git add -A && git commit -m "message" && git push

# Sync to website repo
cp *.html ~/mobiledevcli-website/
cp -r games ~/mobiledevcli-website/
cd ~/mobiledevcli-website
git add -A && git commit -m "message" && git push
```

## Current Priorities
See ROADMAP.md for full platform vision. Immediate:
1. Legal pages (Terms, Privacy, Liability)
2. SEO meta tags and sitemap
3. Backend decision (Firebase vs Supabase)
4. Twitter API integration
5. Newsletter setup

## Platform Vision (ROADMAP.md)
Building full SaaS with:
- User authentication (Google, GitHub)
- Paid subscriptions
- Social features (Twitter-like feed)
- Marketplace
- Analytics dashboard
- SEO optimization

## Links
- Live site: https://mobilecli.com
- Setup repo: https://github.com/MobileDevCLI/setup
- Website repo: https://github.com/MobileDevCLI/website

## When in Doubt
- Read PROJECT_HISTORY.md for what we've built
- Read ROADMAP.md for where we're going
