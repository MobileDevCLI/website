# WEBSITE.md - Complete Website & Development Guide

**Last Updated**: January 4, 2026
**Purpose**: Single source of truth for MobileDevCLI website, development stack, and operations

---

## QUICK CONTEXT FOR NEW AI SESSIONS

Copy this section if you need to quickly onboard an AI to this project:

```
PROJECT: MobileDevCLI (mobilecli.com)
OWNER: Samblamz (anonymous - NEVER share personal info)
WHAT IT IS: SaaS platform that turns Android phones into AI development environments
BUILT WITH: Termux + Claude Code on Android phone (the product demos itself)

REPOS:
- origin: github.com/MobileDevCLI/setup (source of truth)
- website: github.com/MobileDevCLI/website (Vercel deployment)

ALWAYS PUSH TO BOTH: git push origin master && git push website master

FREEMIUM MODEL:
- Free pages: Teasers only (no real commands, no secret sauce)
- Pro (pro-preview.html): Full secret sauce revealed

SECRET SAUCE (Pro only):
- F-Droid download link for Termux
- --dangerously-skip-permissions flag
- Full autonomous mode setup
- Complete methodology

KEY FILES:
- CLAUDE.md: AI instructions (checked into git)
- WEBSITE.md: This file - full website documentation
- GENESIS.md: Invention story and IP protection
- pro-preview.html: Pro subscriber content (reveals all secrets)
```

---

## TABLE OF CONTENTS

1. [Website Architecture](#website-architecture)
2. [Tech Stack](#tech-stack)
3. [Deployment Pipeline](#deployment-pipeline)
4. [Page Structure](#page-structure)
5. [Freemium Model & Secret Sauce](#freemium-model--secret-sauce)
6. [Authentication System](#authentication-system)
7. [Legal Structure](#legal-structure)
8. [Security Practices](#security-practices)
9. [SEO Implementation](#seo-implementation)
10. [Development Environment](#development-environment)
11. [Git Workflow](#git-workflow)
12. [Known Pitfalls & Solutions](#known-pitfalls--solutions)
13. [Component Documentation](#component-documentation)
14. [Design System](#design-system)
15. [Common Tasks](#common-tasks)
16. [Troubleshooting Guide](#troubleshooting-guide)
17. [Goals & Roadmap](#goals--roadmap)

---

## 1. WEBSITE ARCHITECTURE

### Domain & Hosting
```
Domain: mobilecli.com (registered)
DNS: Managed by Vercel
Hosting: Vercel (auto-deploy from GitHub)
SSL: Automatic HTTPS via Vercel
CDN: Vercel Edge Network (global)
```

### Repository Structure
```
MobileDevCLI/
├── setup/          # Source of truth (origin remote)
└── website/        # Deployment target (website remote)

Both repos must stay in sync!
```

### File Structure
```
/data/data/com.termux/files/home/mobiledevcli/
├── index.html              # Homepage (Mixed Chaos 3D hero)
├── dashboard.html          # User dashboard
├── pricing.html            # Free/Pro/Team tiers
├── login.html              # GitHub OAuth via Supabase
├── pro-preview.html        # PRO CONTENT - All secret sauce revealed
│
├── learn.html              # Documentation (teasers only)
├── quickstart.html         # Quick setup guide (teasers only)
├── examples.html           # Code examples (teasers only)
├── research.html           # Research discoveries
├── news.html               # News feed
├── proof.html              # Case study / proof of concept
│
├── demos.html              # Interactive demos hub
├── demo/                   # 17 WebGL demos
│   ├── fluid.html          # Navier-Stokes fluid
│   ├── cloth.html          # Verlet cloth physics
│   ├── galaxy.html         # Particle galaxy
│   └── ... (17 total)
│
├── games.html              # Games arcade
├── games/                  # Game files
│   └── sketchbook.html     # Quick Draw paint app
│
├── labs.html               # Experimental features
│
├── terms.html              # Terms of Service
├── privacy.html            # Privacy Policy (GDPR + CCPA)
├── disclaimer.html         # Legal disclaimer
├── ip.html                 # IP notice
├── dmca.html               # DMCA policy
├── legal-guide.html        # Public legal education
├── security-guide.html     # Public security education
│
├── js/
│   └── supabase-config.js  # Supabase auth config
│
├── sitemap.xml             # SEO sitemap
├── robots.txt              # Search engine rules
├── vercel.json             # Vercel configuration
│
├── CLAUDE.md               # AI instructions
├── WEBSITE.md              # This file
├── GENESIS.md              # Invention documentation
├── IP_NOTICE.md            # IP protection
├── ROADMAP.md              # Platform roadmap
├── PROJECT_HISTORY.md      # Development history
├── README.md               # GitHub readme
└── LICENSE                 # MIT License
```

---

## 2. TECH STACK

### Frontend
```
Language: Vanilla HTML/CSS/JavaScript (no frameworks)
3D Graphics: Three.js r128+
Physics: Cannon.js
Fonts: Inter (UI), JetBrains Mono (code)
Icons: CSS-based, no external dependencies
```

### Backend Services
```
Authentication: Supabase Auth
Database: Supabase PostgreSQL
OAuth Providers: GitHub (configured), Google (planned)
Project URL: mwxlguqukyfberyhtkmg.supabase.co
```

### Deployment
```
Hosting: Vercel (vercel.com)
CI/CD: Automatic on git push to website remote
Build: None (static files)
Cache: Disabled for HTML (vercel.json)
```

### Development Environment
```
Device: Android phone (Samsung Galaxy)
Terminal: Termux (from F-Droid, NOT Play Store)
AI: Claude Code CLI (@anthropic-ai/claude-code)
Editor: Claude does all editing
Version Control: Git + GitHub CLI (gh)
```

---

## 3. DEPLOYMENT PIPELINE

### How It Works
```
1. You make changes on phone via Claude Code
2. Commit changes: git add -A && git commit -m "message"
3. Push to BOTH repos: git push origin master && git push website master
4. Vercel detects push to website repo
5. Vercel deploys instantly (no build step)
6. Changes live at mobilecli.com within seconds
```

### Vercel Configuration (vercel.json)
```json
{
  "headers": [
    {
      "source": "/(.*).html",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    }
  ]
}
```

### Why This Matters
- `max-age=0, must-revalidate` prevents browser caching issues
- Changes appear immediately without clearing cache
- Critical fix discovered after hours of debugging (Jan 4, 2026)

---

## 4. PAGE STRUCTURE

### Public Pages (Free - Teasers Only)

| Page | URL | Purpose | Secret Sauce Status |
|------|-----|---------|---------------------|
| Home | / | Landing, 3D hero | TEASER ONLY |
| Dashboard | /dashboard.html | User dashboard | TEASER ONLY |
| Pricing | /pricing.html | Subscription tiers | Shows tiers |
| Learn | /learn.html | Documentation | TEASER ONLY |
| Quick Start | /quickstart.html | Setup guide | TEASER ONLY |
| Examples | /examples.html | Code examples | TEASER ONLY |
| Research | /research.html | Discoveries | Public |
| News | /news.html | News feed | Public |
| Proof | /proof.html | Case study | Public |
| Demos | /demos.html | WebGL demos | Public |
| Games | /games.html | Game arcade | Public |
| Labs | /labs.html | Experiments | Public |

### Pro Page (Reveals All Secret Sauce)

| Page | URL | Purpose |
|------|-----|---------|
| Pro Preview | /pro-preview.html | FULL SECRET SAUCE |

**Pro Preview Contains:**
- F-Droid download link (exact URL)
- `--dangerously-skip-permissions` flag
- Complete autonomous mode setup
- Full methodology and workflow
- All the "real" commands
- Tabbed interface: Overview, Setup, Commands, Research, Story, Troubleshooting

### Legal Pages

| Page | URL | Purpose |
|------|-----|---------|
| Terms | /terms.html | Terms of Service |
| Privacy | /privacy.html | Privacy Policy |
| Disclaimer | /disclaimer.html | Liability disclaimer |
| IP | /ip.html | Intellectual property |
| DMCA | /dmca.html | DMCA policy |
| Legal Guide | /legal-guide.html | Public IP education |
| Security Guide | /security-guide.html | Public security education |

---

## 5. FREEMIUM MODEL & SECRET SAUCE

### The Business Model
```
FREE ($0/month):
- Access to all public pages
- Teasers showing WHAT is possible
- No real commands or setup details
- Demos and games accessible
- Limited dashboard features

PRO ($10/month):
- Full pro-preview.html access
- All secret sauce revealed
- Real commands and exact URLs
- Complete methodology
- Priority support
- Badge on profile

TEAM ($20/user/month):
- Everything in Pro
- Team collaboration
- SSO integration
- Admin controls
```

### What Is "Secret Sauce"?

The secret sauce is the specific knowledge that makes this work. It includes:

1. **F-Droid Download Link**
   - The Play Store Termux is OUTDATED and broken
   - F-Droid version is the ONLY working version
   - This is not common knowledge

2. **--dangerously-skip-permissions Flag**
   - Enables fully autonomous AI operation
   - Claude works without confirmation prompts
   - The key to "overnight coding" capability

3. **Complete Methodology**
   - Terminal setup commands
   - Wake lock for persistent sessions
   - tmux for session survival
   - The specific workflow that works

### How We Protect Secret Sauce

**FREE PAGES show teasers like:**
```html
<!-- learn.html, quickstart.html, etc. -->
<p>Pro subscribers get the exact download link</p>
<p>See Pro documentation for download link</p>
<p>Special permission flags (Pro only)</p>
<p>Full Autonomous Mode (Pro feature)</p>
```

**PRO PAGE reveals reality:**
```html
<!-- pro-preview.html -->
<p>Download from F-Droid (NOT Play Store):</p>
<a href="https://f-droid.org/packages/com.termux/">https://f-droid.org/packages/com.termux/</a>

<code>claude --dangerously-skip-permissions</code>
```

### Audit Checklist for Secret Sauce

When editing free pages, VERIFY:
- [ ] No F-Droid links (use "Pro: Get Link" or similar)
- [ ] No `--dangerously-skip-permissions` (use "special permission flags")
- [ ] No complete terminal setup commands
- [ ] No full methodology revealed
- [ ] Teasers point to /pro-preview.html

**Files that need auditing after changes:**
- dashboard.html
- examples.html
- learn.html
- quickstart.html
- news.html
- disclaimer.html
- security-guide.html

---

## 6. AUTHENTICATION SYSTEM

### Supabase Auth Setup
```
Project URL: https://mwxlguqukyfberyhtkmg.supabase.co
Auth Provider: GitHub OAuth (primary)
Callback URL: https://mwxlguqukyfberyhtkmg.supabase.co/auth/v1/callback
```

### Login Flow
```
1. User clicks "Login with GitHub" on login.html
2. Redirect to GitHub OAuth
3. GitHub authenticates user
4. Redirect to Supabase callback
5. Supabase creates/updates user session
6. Redirect back to dashboard.html
7. JavaScript checks auth state, shows user info
```

### Client-Side Config (js/supabase-config.js)
```javascript
const SUPABASE_URL = 'https://mwxlguqukyfberyhtkmg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGci...'; // Public key, safe to expose

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

### Important: ANON Key vs Service Key
- **ANON KEY**: Safe in client code (public)
- **SERVICE KEY**: NEVER expose (backend only)

---

## 7. LEGAL STRUCTURE

### Dual-License Model
```
CODE (MIT License):
- HTML, CSS, JavaScript files
- Shell scripts (setup.sh, extras.sh)
- Open source, can fork/modify

METHOD/INVENTION (All Rights Reserved):
- The workflow described in GENESIS.md
- The CLAUDE.md compounding system
- The specific combination of technologies
- NOT open source, proprietary IP
```

### Legal Documents

1. **terms.html** - Terms of Service
   - Beta disclaimer
   - Binding arbitration (JAMS)
   - Class action waiver (30-day opt-out)
   - Limitation of liability
   - Governing law: Delaware

2. **privacy.html** - Privacy Policy
   - GDPR compliance (EU)
   - CCPA compliance (California)
   - Data collection disclosure
   - User rights (access, deletion)

3. **disclaimer.html** - Liability Disclaimer
   - "As is" service
   - No warranty
   - Assumption of risk
   - Third-party software acknowledgment

4. **ip.html** - IP Notice
   - Copyright declaration
   - Dual-license explanation
   - Prior art declaration (Jan 2-4, 2026)

5. **dmca.html** - DMCA Policy
   - Takedown procedure
   - Counter-notification process

### IP Protection Strategy

1. **Trade Secret Protection**
   - Secret sauce behind paywall
   - "Reasonable measures" for legal protection
   - Freemium model IS a protective measure

2. **Documentation**
   - GENESIS.md with timestamps
   - Git commit history (immutable)
   - GitHub API timestamps verifiable

3. **Third-Party Attribution**
   - Termux: GPLv3
   - Claude Code: Anthropic TOS
   - Node.js, Git: MIT/GPL

---

## 8. SECURITY PRACTICES

### Never Expose
```
- Private API keys (sk-*, service keys)
- Supabase SERVICE key
- Passwords or credentials
- Personal name, location, phone
- Database connection strings
- JWT signing secrets
```

### Safe to Expose
```
- Supabase ANON key (designed for client-side)
- Public OAuth client IDs
- Supabase project URL
- Public API endpoints
- Alias "Samblamz"
```

### .gitignore (Already Configured)
```
PERSONAL_*.md
*_PRIVATE.md
*_SECRET.*
.env
.env.local
credentials.json
node_modules/
```

### robots.txt (Protects Pro Content)
```
User-agent: *
Allow: /

# Protect premium content from indexing
Disallow: /pro-preview.html
Disallow: /admin/
Disallow: /api/
```

---

## 9. SEO IMPLEMENTATION

### Current Implementation

**sitemap.xml** - Lists all 19 public pages:
- Excludes pro-preview.html (protected)
- Priority based on page importance
- Monthly/weekly change frequency

**robots.txt** - Search engine rules:
- Allows all public pages
- Blocks pro-preview.html
- Blocks admin and API paths

**Meta Tags (Every Page)**:
```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="...">
<meta name="keywords" content="...">

<!-- Open Graph -->
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:type" content="website">
<meta property="og:url" content="...">

<!-- Twitter Cards -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@MobileDevCLI">
```

**JSON-LD Structured Data (index.html)**:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "MobileDevCLI",
  ...
}
</script>
```

### Target Keywords
- "Claude Code Android"
- "AI development phone"
- "Mobile coding CLI"
- "Termux AI development"
- "Android development terminal"

---

## 10. DEVELOPMENT ENVIRONMENT

### Hardware
```
Device: Android phone (Samsung Galaxy series tested)
Requirements: Android 7.0+, 4GB RAM minimum
Storage: 10GB+ free recommended
```

### Software Stack
```
Terminal: Termux (F-DROID VERSION ONLY)
         - NOT Play Store (outdated)
         - Get from: https://f-droid.org/packages/com.termux/

AI CLI: Claude Code (@anthropic-ai/claude-code)
        - npm install -g @anthropic-ai/claude-code
        - claude login (OAuth to Anthropic)

Version Control: Git + GitHub CLI
                 - pkg install git gh
                 - gh auth login
```

### Session Persistence
```bash
# Keep terminal alive
termux-wake-lock

# Persistent notification
termux-notification -t "Dev Session" --ongoing

# Session survival
tmux new -s dev

# Autonomous AI operation
claude --dangerously-skip-permissions
# OR
claude --permission-mode=dontAsk
```

### Storage Access
```bash
# Grant storage permissions (one-time)
termux-setup-storage

# Screenshots location (Samsung)
~/storage/dcim/Screenshots/

# Claude can read images directly
# Use Read tool on image paths
```

---

## 11. GIT WORKFLOW

### Two Repos - ALWAYS Push Both
```bash
# Check remotes
git remote -v
# Should show:
# origin   https://github.com/MobileDevCLI/setup.git
# website  https://github.com/MobileDevCLI/website.git

# Standard push (ALWAYS use this)
git add -A && git commit -m "message"
git push origin master
git push website master
```

### Why Two Repos?
- **origin (setup)**: Source of truth, main development
- **website**: Vercel watches this for deployment
- Both must have identical content

### Version Tags (Before Major Changes)
```bash
# Create tag
git tag -a v1.X.X -m "Description"
git push origin v1.X.X

# List tags
git tag -l

# Rollback if needed
git checkout v1.X.X
```

### Commit Message Format
```
Short description (50 chars max)

- Detail 1
- Detail 2

[Generated with Claude Code]

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```

---

## 12. KNOWN PITFALLS & SOLUTIONS

### Pitfall 1: Vercel Not Deploying

**Symptoms**: Push succeeds but site doesn't update

**Cause**: Vercel lost GitHub webhook connection

**Solution**:
```
1. Vercel Dashboard → Project → Settings → Git
2. Click "Disconnect"
3. Click "Connect Git Repository"
4. Select MobileDevCLI/website, branch master
5. Deploy
```

### Pitfall 2: Browser Cache Shows Old Content

**Symptoms**: curl shows new content, browser shows old

**Diagnosis**:
```bash
# Test what server actually has
curl -sL "https://mobilecli.com" | grep "unique text"
```

**Solution**: Already implemented in vercel.json
```json
"Cache-Control": "public, max-age=0, must-revalidate"
```

### Pitfall 3: Making Repo Private Breaks Vercel

**Cause**: Vercel loses access to private repos

**Solution**:
```bash
# Make public again
gh repo edit MobileDevCLI/website --visibility public --accept-visibility-change-consequences

# Trigger deploy
git commit --allow-empty -m "Trigger deploy"
git push website master
```

### Pitfall 4: Ripgrep Not Found on Android

**Symptoms**: Grep tool errors with ENOENT

**Solution**: Use bash grep instead
```bash
grep -ri "pattern" /path/*.html
```

### Pitfall 5: Forgot to Push to Both Repos

**Symptoms**: Origin updated but site not

**Solution**: Always use both:
```bash
git push origin master && git push website master
```

### Pitfall 6: Secret Sauce Leaking to Free Pages

**Prevention**: Before committing, audit for:
```bash
grep -ri "f-droid\|dangerously-skip-permissions" *.html | grep -v pro-preview
```

If matches found → Fix before pushing

### Pitfall 7: Pro Preview Incomplete

**History**: Pro preview was just one tab, no navigation

**Solution**: Rebuilt as full site with:
- Complete navigation bar
- 6 tabbed sections
- Mobile menu
- Footer
- All secret sauce properly revealed

---

## 13. COMPONENT DOCUMENTATION

### Hero Section (index.html)

**Mixed Chaos 3D Scene**:
- Three.js for rendering
- Cannon.js for physics
- Custom water surface shader
- Fire particles
- Floating physics objects
- Mode toggle (scroll vs play mode)

**Mode Toggle Pattern**:
```javascript
// Solves touch/scroll conflict
scrollMode: Canvas visual only, normal scrolling
playMode: Touch interaction, scrolling disabled
Auto-returns to scroll mode after 30s inactivity
```

### Navigation Structure

**Desktop Nav**:
```html
Logo (dropdown: GitHub, Discord, Twitter, YouTube, Contact)
Pricing | Docs | Quick Start | Research | Demos | Legal | Security | Login
```

**Mobile Nav**:
```html
Logo | Menu (hamburger)
Dropdown sections: Product, Interactive, Resources, Guides, Community, Legal, Account
```

### Footer Links
```
Terms | Privacy | Disclaimer | IP Notice | DMCA | Legal Guide | Security Guide
```

### Tabbed Interfaces

Used in: learn.html, pro-preview.html, examples.html

```javascript
// Tab switching pattern
function switchTab(tabId) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    document.getElementById(tabId).classList.add('active');
}
```

---

## 14. DESIGN SYSTEM

### Colors
```css
--bg: #000000;           /* Pure black background */
--primary: #00ff88;      /* Green (brand) */
--secondary: #00d4ff;    /* Cyan (accent) */
--accent: #a855f7;       /* Purple (Pro/premium) */
--text: #ffffff;         /* Primary text */
--text-muted: #a0a0a0;   /* Secondary text */
--text-dim: #555555;     /* Tertiary text */
```

### Typography
```css
/* Headlines */
font-family: 'Inter', sans-serif;
font-weight: 800;

/* Body */
font-family: 'Inter', sans-serif;
font-weight: 400-500;

/* Code */
font-family: 'JetBrains Mono', monospace;
```

### Common Patterns

**Gradient Text**:
```css
background: linear-gradient(135deg, #00ff88, #00d4ff);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

**Glow Effect**:
```css
box-shadow: 0 0 20px rgba(0, 255, 136, 0.3);
```

**Button Style**:
```css
background: linear-gradient(135deg, #00ff88, #00d4ff);
color: #000;
padding: 12px 24px;
border-radius: 8px;
font-weight: 600;
```

---

## 15. COMMON TASKS

### Add a New Page
```bash
1. Create newpage.html
2. Copy header/nav from existing page
3. Add to sitemap.xml
4. Add navigation links to other pages
5. Commit and push to both repos
```

### Update Secret Sauce (Pro Only)
```bash
1. Edit pro-preview.html ONLY
2. NEVER add real commands to free pages
3. Audit free pages for leaks
4. Commit and push
```

### Deploy Hotfix
```bash
git add -A
git commit -m "Hotfix: description"
git push origin master && git push website master
```

### Verify Deployment
```bash
# Check what server has
curl -sL "https://mobilecli.com/pagename.html" | grep "unique text"
```

### Rollback Bad Deploy
```bash
git revert HEAD
git push origin master && git push website master
```

### Test on Mobile
```bash
# Serve locally
npx http-server -p 8080

# Access from phone browser
http://localhost:8080
```

---

## 16. TROUBLESHOOTING GUIDE

### Site Not Updating

1. **Check if pushed to website repo**:
   ```bash
   git log website/master --oneline -1
   ```

2. **Verify Vercel received it**:
   - Go to Vercel Dashboard → Deployments
   - Check latest commit hash matches

3. **Force redeploy**:
   - Vercel → Deployments → ... → Redeploy
   - UNCHECK "Use existing Build Cache"

4. **Test with curl**:
   ```bash
   curl -sL "https://mobilecli.com" | head -50
   ```

### Login Not Working

1. **Check Supabase**:
   - Dashboard → Authentication → Users
   - Check if user exists

2. **Check GitHub OAuth App**:
   - github.com/settings/developers
   - Verify callback URL

3. **Check browser console**:
   - F12 → Console → Look for errors

### Page Looks Wrong on Mobile

1. **Check viewport meta**:
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   ```

2. **Check CSS media queries**:
   ```css
   @media (max-width: 768px) { ... }
   ```

3. **Test in Chrome DevTools**:
   - F12 → Toggle device toolbar

---

## 17. GOALS & ROADMAP

### Completed (January 2026)
- [x] Full marketing website
- [x] 17+ WebGL demos
- [x] GitHub OAuth authentication
- [x] Supabase database integration
- [x] Freemium paywall structure
- [x] Legal compliance (Terms, Privacy, GDPR, CCPA)
- [x] SEO implementation (sitemap, robots, structured data)
- [x] Secret sauce protection
- [x] Dual-repo deployment
- [x] Mobile-first design
- [x] Mode toggle hero (scroll/play)

### In Progress
- [ ] Stripe payment integration
- [ ] User subscription management
- [ ] Pro content gating (enforce paywall)

### Planned
- [ ] Google OAuth
- [ ] User profiles
- [ ] Admin dashboard
- [ ] Newsletter (Buttondown)
- [ ] Discord integration
- [ ] AI chatbot for support
- [ ] Community marketplace

### Success Metrics
```
- 100 user signups
- First paying subscriber
- Top 10 for target keywords
- $100/month revenue
```

---

## APPENDIX: FILE QUICK REFERENCE

### Configuration Files
| File | Purpose |
|------|---------|
| vercel.json | Vercel config (cache headers) |
| robots.txt | Search engine rules |
| sitemap.xml | SEO sitemap |
| js/supabase-config.js | Auth configuration |

### MD Documentation Files
| File | Purpose |
|------|---------|
| CLAUDE.md | AI instructions (main) |
| WEBSITE.md | This file |
| GENESIS.md | Invention story |
| IP_NOTICE.md | IP protection |
| ROADMAP.md | Feature roadmap |
| PROJECT_HISTORY.md | Session history |

### Protected Files (Never Commit)
| Pattern | Reason |
|---------|--------|
| PERSONAL_*.md | Personal info |
| *_PRIVATE.md | Private docs |
| *_SECRET.* | Secrets |
| .env* | Environment vars |

---

## CONTACT & LINKS

```
Website: https://mobilecli.com
GitHub: https://github.com/MobileDevCLI
Twitter: https://twitter.com/MobileDevCLI
YouTube: https://youtube.com/@MobileDevCLI
Discord: https://discord.gg/mobilecli
Email: mobiledevcli@gmail.com
```

---

*This document is the complete reference for the MobileDevCLI website. Update it whenever you discover something new, fix a bug, or change how things work. Future AI sessions depend on this being accurate.*

**Last verified**: January 4, 2026
