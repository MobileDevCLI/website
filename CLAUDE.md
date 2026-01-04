# MobileDevCLI - AI Instructions

## Quick Context
This is MobileCLI - a brand/website/SaaS that turns Android phones into AI development environments.

**Owner**: Samblamz (anonymous - never share personal info)
**Website**: mobilecli.com
**GitHub**: github.com/MobileDevCLI
**Supabase**: mwxlguqukyfberyhtkmg.supabase.co

## Project Structure
```
├── setup.sh              # Main installer script
├── extras.sh             # Termux:API utilities
├── index.html            # Homepage (Three.js 3D hero)
├── login.html            # Auth (Supabase - GitHub OAuth)
├── dashboard.html        # User dashboard with setup wizard
├── pricing.html          # Free/Pro/Team tiers
├── learn.html            # Documentation
├── examples.html         # Three.js, physics examples
├── games.html            # Games arcade
├── news.html             # News feed
├── proof.html            # Case study
├── terms.html            # Terms of service
├── privacy.html          # Privacy policy
├── disclaimer.html       # Legal disclaimer
├── js/
│   └── supabase-config.js  # Supabase auth config
├── games/
│   └── sketchbook.html   # Quick Draw paint app
├── PROJECT_HISTORY.md    # Full project history
├── ROADMAP.md            # Platform vision
├── CLAUDE.md             # This file
├── README.md             # GitHub readme
└── LICENSE               # MIT
```

## Two Repos (Keep in Sync)

We have two repos that must stay synced:
1. `MobileDevCLI/setup` - Main source of truth (origin)
2. `MobileDevCLI/website` - Vercel deployment (website remote)

### Push to Both Repos:
```bash
git add -A && git commit -m "message"
git push origin master
git push website master --force
```

### Check Remotes:
```bash
git remote -v
# Should show:
# origin   https://github.com/MobileDevCLI/setup.git
# website  https://github.com/MobileDevCLI/website.git
```

---

## CRITICAL: Vercel + GitHub Troubleshooting

### Problem: Vercel stops deploying after making repo private

**What happens:**
When you change a GitHub repo from public to private, Vercel loses access and stops auto-deploying. The site shows old content.

**Solution:**
Make the repo public again:
```bash
gh repo edit MobileDevCLI/website --visibility public --accept-visibility-change-consequences
gh repo edit MobileDevCLI/setup --visibility public --accept-visibility-change-consequences
```

Then trigger a fresh deploy:
```bash
git commit --allow-empty -m "Trigger deploy"
git push origin master
git push website master
```

**Alternative (keep repo private):**
1. Go to https://vercel.com/dashboard → your project
2. Settings → Git → Disconnect
3. Reconnect and select the private repo
4. Click "Configure GitHub App" to grant private repo access
5. Redeploy

### Problem: Changes not showing on live site

**Checklist:**
1. Did you push to BOTH repos?
   ```bash
   git push origin master && git push website master
   ```

2. Check Vercel deployment status:
   - https://vercel.com/dashboard → Deployments tab
   - Look for latest commit hash

3. Hard refresh browser:
   - Mobile: Clear cache or use incognito
   - Desktop: Ctrl+Shift+R

4. Check which repo Vercel is connected to:
   - Vercel → Project Settings → Git
   - Should be `MobileDevCLI/website`

5. Force push to website repo:
   ```bash
   git push website master --force
   ```

### Problem: GitHub OAuth not working

**Checklist:**
1. Check Supabase Auth settings (Authentication → Providers → GitHub)
2. Verify callback URL: `https://mwxlguqukyfberyhtkmg.supabase.co/auth/v1/callback`
3. Check GitHub OAuth App settings: https://github.com/settings/developers
4. Ensure Client ID and Secret are correct in Supabase

---

## Git Workflow

### Quick Deploy:
```bash
git add -A && git commit -m "message" && git push origin master && git push website master
```

### Before Major Changes - Create a Tag:
```bash
git tag -a v1.X.X -m "Description"
git push origin v1.X.X
```

### Rollback if Something Breaks:
```bash
git revert <commit-hash>
git push origin master && git push website master
```

---

## Tech Stack

### Frontend
- Vanilla HTML/CSS/JS (no frameworks)
- Three.js for 3D graphics
- Inter + JetBrains Mono fonts

### Backend
- Supabase (Auth, Database)
- Vercel (Hosting, auto-deploy from GitHub)

### Auth
- Supabase Auth
- GitHub OAuth (configured)
- Google OAuth (pending setup)

### Pricing Tiers
- Free: $0 (1 project, basic features)
- Pro: $10/mo (unlimited projects, priority support)
- Team: $20/user/mo (team features, SSO)

---

## Style Guidelines

### Colors
- Background: #000000 (black)
- Primary: #00ff88 (green)
- Secondary: #00d4ff (cyan)
- Accent: #a855f7 (purple)
- Text: #ffffff / #a0a0a0 / #555555

### Design
- Dark theme, minimal, premium feel
- Gradient text for headings
- Glow effects on buttons and badges
- Three.js 3D backgrounds
- Mobile-first responsive

### Typography
- Headlines: Inter (800 weight)
- Body: Inter (400-500)
- Code: JetBrains Mono

---

## Navigation Structure

All pages should have consistent nav:
```html
<nav>
  Pricing | Docs | Examples | Dashboard | Login/Get Started
</nav>
```

Logo dropdown includes: GitHub, Twitter, YouTube, Email

---

## Important Rules

1. **Never share personal info** - user is anonymous (Samblamz)
2. **Always push to BOTH repos** - origin AND website
3. **Keep repos PUBLIC** - Vercel needs access (or configure private access)
4. **Mobile-first** - always test on phone
5. **Create tags before major changes**
6. **Update this file** when you learn something new

---

## Links

- Live site: https://mobilecli.com
- Setup repo: https://github.com/MobileDevCLI/setup
- Website repo: https://github.com/MobileDevCLI/website
- Supabase: https://supabase.com/dashboard
- Vercel: https://vercel.com/dashboard
- GitHub OAuth: https://github.com/settings/developers

---

## When in Doubt

1. Check if both repos are synced: `git log origin/master --oneline -1` vs `git log website/master --oneline -1`
2. Check Vercel deployment status
3. Make repos public if Vercel stops deploying
4. Read this file for solutions
