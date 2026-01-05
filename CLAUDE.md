# MobileDevCLI - AI Instructions

## Quick Context
This is MobileCLI - a brand/website/SaaS that turns Android phones into AI development environments.

**Owner**: Samblamz (anonymous - never share personal info)
**Website**: mobilecli.com
**GitHub**: github.com/MobileDevCLI
**Supabase**: mwxlguqukyfberyhtkmg.supabase.co

## The Invention (PROTECTED IP)

**Read GENESIS.md** - This project isn't just a website. It's an invention.

**IMPORTANT:** See IP_NOTICE.md for intellectual property protection.
- Code = MIT License (open source)
- Method/Invention = All Rights Reserved (proprietary)

We built an autonomous development platform that outperforms Replit:
- Runs locally on a phone (not cloud)
- Costs less (subscription vs per-compute)
- Uses less data (local execution)
- Runs forever (24+ hour sessions)
- Full system access (not sandboxed)
- Smarter (Opus 4.5 with thinking)

This entire website was built in ONE continuous AI conversation on a phone.

---

## Project Structure
```
├── GENESIS.md            # THE INVENTION - read this first
├── setup.sh              # Main installer script
├── extras.sh             # Terminal:API utilities
├── index.html            # Homepage (Three.js + Cannon.js physics hero)
├── login.html            # Auth (Supabase - GitHub OAuth)
├── dashboard.html        # User dashboard with setup wizard
├── pricing.html          # Free/Pro/Team tiers
├── learn.html            # Documentation
├── examples.html         # Three.js, physics examples
├── demos.html            # Interactive demos hub (NEW)
├── demo/                 # Individual demo pages (NEW)
│   ├── fluid.html        # Navier-Stokes fluid simulation
│   ├── cloth.html        # Verlet cloth physics
│   ├── galaxy.html       # Particle galaxy generator
│   ├── gravity.html      # N-body gravity simulation
│   ├── fractal.html      # Mandelbrot/Julia explorer
│   └── ...               # More demos
├── games.html            # Games arcade
├── news.html             # News feed
├── proof.html            # Case study
├── terms.html            # Terms of service (includes Beta notice)
├── privacy.html          # Privacy policy (GDPR + CCPA)
├── disclaimer.html       # Legal disclaimer
├── ip.html               # Intellectual property notice
├── dmca.html             # DMCA policy
├── legal-guide.html      # Public guide: AI-powered IP protection
├── security-guide.html   # Public guide: Security best practices
├── js/
│   └── supabase-config.js  # Supabase auth config
├── games/
│   └── sketchbook.html   # Quick Draw paint app
├── quickstart.html       # Simple setup guide (command-focused)
├── research.html         # Research log / discoveries
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

### Problem: Vercel shows old deployment time (not auto-deploying)

**Symptoms:**
- Vercel dashboard shows "11 hours ago" or old time
- Git pushes succeed but site doesn't update
- Browser shows old content even after cache clear

**Diagnosis:**
Vercel has lost its GitHub webhook connection.

**Fix - Reconnect Git in Vercel:**
1. Vercel Dashboard → Your Project → Settings → Git
2. Click "Disconnect" under Connected Git Repository
3. Click "Connect Git Repository"
4. Select `MobileDevCLI/website`, branch `master`
5. Click Deploy

**Quick Fix - Manual Redeploy:**
1. Vercel Dashboard → Deployments tab
2. Click "..." on any deployment → "Redeploy"
3. UNCHECK "Use existing Build Cache"
4. Click "Redeploy"

---

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

### Problem: Changes not showing on live site (THE BIG ONE)

**Root Cause Analysis (January 4, 2026):**

We spent HOURS debugging this. Multiple phones, multiple browsers, different locations (even had mom check from her house) - all showed old content. But `curl` showed new content. Here's what we learned:

**The Real Issue: Multi-Layer Caching**

There are FOUR caching layers that can serve stale content:
1. **Browser Cache** - Your browser stores pages locally
2. **Vercel Edge Cache** - Vercel's global CDN caches at edge nodes
3. **ISP/DNS Cache** - Your internet provider may cache
4. **OS/Network Cache** - Device-level caching

**The Definitive Test:**
```bash
# This bypasses ALL caching and shows what the server actually has
curl -sL "https://www.mobilecli.com" | grep "some unique text"
```

If `curl` shows the new content but browsers don't → It's a cache problem, NOT a deployment problem.

**The Solution We Implemented:**

Added `vercel.json` with aggressive cache-busting:
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

**The Visual Verification Test:**
When in doubt, add a bright red banner with timestamp:
```html
<div style="background: #ff0000; color: white; text-align: center; padding: 15px; font-size: 18px; font-weight: bold; position: fixed; top: 0; left: 0; right: 0; z-index: 9999;">
    SITE UPDATED: [DATE/TIME] - If you see this, deployment works!
</div>
```

If you see the red banner → Deployment works, remove the banner.
If you don't → Check Vercel connection to correct repo.

---

### Legacy: Browser Cache Solutions

**Diagnosis Steps:**
1. Verify GitHub has the changes:
   ```bash
   # Check raw file directly from GitHub
   curl -s https://raw.githubusercontent.com/MobileDevCLI/website/master/index.html | grep "hero-badge" -A 2
   ```

2. If GitHub shows new content but browser shows old → **Browser Cache**

**Browser Cache Solution (Mobile):**

Samsung Internet:
1. Menu (three lines) → Privacy → Delete browsing data
2. Check "Cached images and files"
3. Tap "Delete"
4. OR use Secret Mode (incognito) to test

Chrome Mobile:
1. Settings → Privacy → Clear browsing data
2. Check "Cached images and files"
3. Tap "Clear data"

**Verification Command:**
```bash
# Fetch live site and check content
curl -s https://mobilecli.com | grep -o 'hero-badge.*</span>' | head -1
```

**Full Checklist (if not browser cache):**
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
  Pricing | Docs | Quick Start | Research | Demos | Legal | Security | Login/Get Started
</nav>
```

Logo dropdown includes: GitHub, Discord, Twitter/X, YouTube, Contact

Footer should include: Terms | Privacy | Disclaimer | IP Notice | DMCA | Legal Guide | Security Guide

**Community Links:**
- Discord: https://discord.gg/mobilecli
- GitHub: https://github.com/MobileDevCLI
- Twitter/X: https://twitter.com/MobileDevCLI
- YouTube: https://youtube.com/@MobileDevCLI

---

## Important Rules

1. **Never share personal info** - user is anonymous (Samblamz)
2. **Always push to BOTH repos** - origin AND website
3. **Keep repos PUBLIC** - Vercel needs access (or configure private access)
4. **Mobile-first** - always test on phone
5. **Create tags before major changes**
6. **Update this file** when you learn something new

---

## Demo Development Rules

### Quality Standards (Autonomous Mode)
- **Target 30fps minimum** on mobile devices
- **Test on actual device** - not just browser
- **Verify everything** - verification is the 2-3x quality multiplier
- **Commit frequently** with good descriptive messages
- **Push after each demo** so user can test live

### Demo Requirements
- Touch controls must work smoothly
- Mouse controls for desktop
- Back button to /demos.html
- Info panel explaining the demo
- Control buttons for common actions
- Works fullscreen on mobile

### WebGL Best Practices
- Use `powerPreference: "high-performance"`
- Limit pixel ratio: `Math.min(window.devicePixelRatio, 2)`
- Clean up resources on page leave
- Handle WebGL context loss gracefully

---

## Links

- Live site: https://mobilecli.com
- Setup repo: https://github.com/MobileDevCLI/setup
- Website repo: https://github.com/MobileDevCLI/website
- Supabase: https://supabase.com/dashboard
- Vercel: https://vercel.com/dashboard
- GitHub OAuth: https://github.com/settings/developers

---

## Discovered Capabilities

### Screenshot Access (January 4, 2026)
Claude Code can read and analyze screenshots directly from the phone's storage:

```bash
# Screenshots location (Samsung)
~/storage/dcim/Screenshots/

# Screenshots location (Pixel)
~/storage/pictures/Screenshots/

# Claude can read these with the Read tool
Read ~/storage/dcim/Screenshots/Screenshot_20260104.jpg
```

**Use cases:**
- Visual debugging - screenshot a bug, Claude sees it
- UI iteration - "make this button bigger" with visual reference
- Game development - Claude can see rendered frames
- Verification loop - the 2-3x quality multiplier, now visual

### Terminal:API Integration
Full hardware access via Terminal:API app:

```bash
pkg install terminal-api  # Install package
# Also install Terminal:API app from F-Droid

# Available commands:
terminal-camera-photo     # Take photo
terminal-screenshot       # Screenshot (needs Terminal:API)
terminal-notification     # Send notification
terminal-toast            # Show toast message
terminal-vibrate          # Vibrate phone
terminal-tts-speak        # Text to speech
terminal-speech-to-text   # Voice input
terminal-clipboard-get    # Read clipboard
terminal-clipboard-set    # Write clipboard
terminal-share            # Share intent
terminal-open-url         # Open URL
terminal-wifi-connectioninfo  # WiFi info
terminal-battery-status   # Battery info
terminal-wake-lock        # Prevent CPU sleep
```

### Long-Running Sessions
Keep Claude running for days:

```bash
# The combo for persistent sessions
terminal-wake-lock                           # Prevent sleep
terminal-notification -t "Dev" --ongoing     # Keep priority
tmux new -s dev                            # Survive Terminal close
claude --dangerously-skip-permissions      # Autonomous mode
```

---

## Legal Knowledge (IP Protection)

### Dual-License Structure
Every project should use dual licensing:
- **Code (MIT License)**: HTML, CSS, JS, shell scripts - open source
- **Method/Invention (All Rights Reserved)**: The unique process, workflow, or system

### Essential Legal Documents
1. **GENESIS.md** - Invention story with timestamps (first conception, development, launch)
2. **IP_NOTICE.md** - Clear statement of what's protected
3. **EVIDENCE_TIMELINE.md** - Chronological evidence catalog for lawyers
4. **terms.html** - Terms of Service with arbitration clause
5. **privacy.html** - Privacy policy (must have GDPR + CCPA sections)
6. **disclaimer.html** - Liability limitations
7. **ip.html** - Public IP notice
8. **dmca.html** - DMCA takedown policy

### Terms of Service Must Include
- Beta/development status notice (limits liability)
- Binding arbitration clause (JAMS recommended)
- Class action waiver with 30-day opt-out
- Governing law (Delaware recommended)
- Indemnification clause
- IP protection language

### Evidence Collection
Document EVERYTHING from Day 1:
- Screenshots with timestamps (phone auto-adds metadata)
- Git commit history (immutable timestamps)
- GitHub API timestamps (verifiable via `gh api repos/org/repo`)
- Third-party archives (Wayback Machine: `curl "https://web.archive.org/save/URL"`)
- Witness statements (get written statements from anyone who saw development)

### Third-Party Separation
When using existing tools (Terminal, Claude Code, etc.):
- Clearly state what you invented vs what's third-party
- Never claim ownership of others' tools
- Your innovation is the METHOD, not the tools

### Third-Party Attribution Requirements

**Termux (GPLv3)**
- Must include license and copyright notice
- Must indicate any changes made
- Any modifications must be GPLv3
- Source code must be available if distributing
- Terminal Emulator for Android component is Apache 2.0 (Jack Palevich)

**Claude Code (Anthropic TOS)**
- Proprietary: © Anthropic PBC, All Rights Reserved
- Use subject to Anthropic's Commercial Terms of Service
- Users own outputs (code generated)
- Recommended attribution: "Generated with Claude"

**Node.js, Git, GitHub CLI**
- Include copyright notices for MIT and GPLv2 components
- No modifications needed for usage-only

**Where to place attributions:**
1. ip.html - Section 15: Third-Party Attributions (public)
2. terms.html - Section 23: Third-Party Software Acknowledgment
3. LICENSE file in GitHub repo

### Alternative Android Terminals
Other powerful terminal emulators (besides Termux):
- **UserLAnd** - Full Linux without root, easy GUI
- **Andronix** - Full Linux distros (Ubuntu, Kali, Arch)
- **NeoTerm** - Modern terminal, built as Termux frontend
- **GNURoot Debian** - Basic Debian environment
- **Kali NetHunter** - Security testing focused
- **ReTerminal** - Material 3 design, Termux-compatible

*Note: We are developing a dedicated AI Terminal for Android & iOS.*

### Liability Protection Requirements

**Terms of Service Must Include:**
1. Beta/development status notice
2. "As Is" disclaimer of warranties
3. Limitation of liability clause
4. Indemnification from users
5. Binding arbitration (JAMS)
6. Class action waiver with 30-day opt-out
7. **Assumption of Risk** - users accept all risks of:
   - Running scripts on their devices
   - Data loss or device damage
   - Third-party software failures
   - AI-generated code errors
8. **Release of Liability** - waiver of claims

**Account/Payment Consent:**
Users must explicitly confirm they:
- Read and accept all terms
- Understand the assumption of risk
- Are 18+ or age of majority
- Have legal capacity to agree

### What to Gitignore (Private Legal Docs)
```
PERSONAL_*.md
ADDITIONAL_EVIDENCE.md
LEGAL_STATUS_REPORT.md
*_PRIVATE.md
*_SECRET.*
```

---

## Security Knowledge

### Never Expose (CRITICAL)
- Private API keys (sk-*, service keys)
- Passwords or credentials
- Database connection strings with passwords
- JWT signing secrets
- Personal names, addresses, phone numbers
- Location data that identifies you
- Witness names (in public repos)

### Safe to Expose
- Supabase ANON key (designed for client-side use)
- Public OAuth client IDs
- Supabase project URL
- Public API endpoints
- Alias/pseudonym (e.g., "Samblamz")

### Git Security
```bash
# Before committing, check for secrets:
grep -rn "api_key\|secret\|password\|sk-\|pk_" .

# Check what you're about to commit:
git diff --staged

# If you accidentally commit secrets:
# 1. IMMEDIATELY rotate the credential
# 2. History rewrite is complex - assume secret is compromised
```

### .gitignore Template
```
# Private files
PERSONAL_*.md
*_PRIVATE.md
*_SECRET.*
.env
.env.local
credentials.json
secrets.json

# Build/IDE
node_modules/
.vscode/
.idea/
dist/
build/
```

### Website Security Headers
```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;">
<meta http-equiv="X-Frame-Options" content="DENY">
<meta http-equiv="X-Content-Type-Options" content="nosniff">
```

### Supabase Security
- ANON key = safe in client code (use Row Level Security)
- SERVICE key = NEVER in client code
- Always enable RLS on tables:
```sql
ALTER TABLE your_table ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own data" ON your_table
FOR SELECT USING (auth.uid() = user_id);
```

### Security Audit Checklist
- [ ] No real names in public files
- [ ] No API keys (except public anon keys)
- [ ] No passwords or secrets
- [ ] .env files gitignored
- [ ] No private keys committed
- [ ] No location data that identifies you
- [ ] No witness/family names in public repos

---

## Legal & Security Pages

### legal-guide.html
Public teaching page that explains:
- How to use AI for IP protection
- Dual-licensing structure
- Evidence documentation
- Third-party separation
- Arbitration and dispute resolution

### security-guide.html
Public teaching page that explains:
- Protecting secrets and credentials
- Personal data protection
- Git security best practices
- Supabase security
- Claude Code permission modes
- Mobile/Terminal security

---

## FREEMIUM MODEL & SECRET SAUCE PROTECTION

### ⚠️ CRITICAL RULE: NEVER LEAK SECRET SAUCE TO FREE PAGES ⚠️

Before writing ANY content to a free page, ask yourself:
> "Does this reveal HOW to do it, or just WHAT is possible?"

- **WHAT is possible** = FREE (sell the dream, show capabilities)
- **HOW to do it** = PRO ONLY (the actual methodology)

### The Business Model
```
FREE: Teasers only (shows WHAT is possible, not HOW)
PRO ($10/mo): All secret sauce revealed - full methodology
TEAM ($20/user/mo): Team features + SSO
```

**Future State:** Pro content will be gated behind Supabase login. Users must be authenticated AND have active Pro subscription to access pro-preview.html content.

### What is "Secret Sauce"? (COMPLETE LIST)

**NEVER put these on free pages:**

| Secret Sauce | Why It's Protected |
|--------------|-------------------|
| `--dangerously-skip-permissions` | Enables autonomous AI operation |
| `--permission-mode=dontAsk` | Alternative autonomous flag |
| `termux-wake-lock` | CPU persistence command |
| `tmux new -s dev` | Session persistence command |
| F-Droid download link | Play Store version is broken |
| `https://f-droid.org/packages/com.termux/` | Direct download URL |
| Complete setup script sequence | The exact order of commands |
| Three-layer persistence combo | wake-lock + tmux + autonomous mode |
| CLAUDE.md knowledge compounding | The AI memory pattern |

**Safe for free pages:**
- General concepts: "autonomous mode", "session persistence", "CPU active"
- Capabilities: "72 hours", "25+ pages", "zero battery drain"
- Results: "built entire SaaS", "supercomputer access"
- Benefits: "as fast as MacBook Pro", "flat subscription"

### Page Classification

**FREE PAGES (Teasers Only):**
```
index.html, proof.html, pricing.html, demos.html, games.html
dashboard.html, learn.html, quickstart.html, examples.html
news.html, research.html, labs.html
legal-guide.html, security-guide.html
terms.html, privacy.html, disclaimer.html, ip.html, dmca.html
```

Rules for FREE pages:
- Show WHAT is possible (jaw-dropping capabilities)
- Explain benefits and results
- Use generic descriptions: "CPU Persistence", "Session Survival", "Autonomous Mode"
- Always end with CTA to Pro for the "how"
- NEVER include specific commands, flags, or download links

**PRO PAGE (Full Secret Sauce):**
```
pro-preview.html (ONLY this page reveals everything)
```

Rules for PRO page:
- Contains ALL secret sauce
- Exact commands, flags, download links
- Step-by-step methodology
- Copy-paste ready setup
- Will be gated behind Supabase auth + subscription check

### How to Write Teaser Content

**Pattern: Describe the EFFECT, not the COMMAND**

| SECRET (Pro Only) | TEASER (Free OK) |
|-------------------|------------------|
| `termux-wake-lock` | "Phone stays active even with screen off" |
| `tmux new -s dev` | "Session survives even when app is backgrounded" |
| `--dangerously-skip-permissions` | "AI works autonomously without manual approval" |
| F-Droid link | "Special download source (Pro subscribers get the link)" |
| Full command sequence | "The exact commands? That's in the Pro methodology." |

**Example Transformation:**

```html
<!-- ❌ WRONG - Leaking secret sauce on free page -->
<h2>How It Worked</h2>
<ul>
  <li>termux-wake-lock — Kept CPU active</li>
  <li>tmux — Session persisted</li>
  <li>--dangerously-skip-permissions — Autonomous mode</li>
</ul>

<!-- ✅ RIGHT - Proper teaser for free page -->
<h2>How It Worked</h2>
<ul>
  <li><strong>CPU Persistence</strong> — Phone stayed active even with screen off</li>
  <li><strong>Session Survival</strong> — Work continued when app was backgrounded</li>
  <li><strong>Autonomous Mode</strong> — AI worked continuously without manual approval</li>
</ul>
<p><em>The exact commands? That's in the Pro methodology.</em></p>
```

### Before Committing - MANDATORY Audit

**Run this check before EVERY commit that touches HTML:**

```bash
# Check for secret sauce leaks in free pages
grep -ri "f-droid\|dangerously-skip-permissions\|permission-mode\|termux-wake-lock\|tmux new\|tmux attach" *.html | grep -v pro-preview

# Check proof.html specifically (common leak location)
grep -i "dangerously\|wake-lock\|tmux\|f-droid" proof.html
```

**If matches found → FIX BEFORE PUSHING**

Replace specific commands with generic descriptions.

### Pro Access & Supabase Integration

**Current State:**
- pro-preview.html is publicly accessible (honor system)
- robots.txt blocks it from search engines

**Future State (when Supabase subscription is ready):**
1. User must be logged in (Supabase Auth)
2. User must have active Pro subscription (check `subscriptions` table)
3. If not Pro → redirect to pricing.html with upgrade CTA
4. Pro content rendered only after validation

**Supabase Tables Needed:**
```sql
-- Users table (auto-created by Supabase Auth)
-- Subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  tier TEXT NOT NULL, -- 'free', 'pro', 'team'
  status TEXT NOT NULL, -- 'active', 'cancelled', 'expired'
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);
```

**Pro Page Access Check (JavaScript):**
```javascript
// This will go in pro-preview.html when ready
async function checkProAccess() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    window.location.href = '/login.html?redirect=pro-preview';
    return false;
  }

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('tier, status')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single();

  if (!sub || sub.tier === 'free') {
    window.location.href = '/pricing.html?upgrade=true';
    return false;
  }

  return true; // User has Pro access
}
```

### Summary: The Golden Rule

**When in doubt, ask:**
> "If someone reads this, will they know EXACTLY how to do it?"

- **YES** → Pro only
- **NO, just impressed** → Free is OK

---

## Inspiration Resources

### Two Minute Papers (Dr. Károly Zsolnai-Fehér)
The best AI and physics research explained simply. Essential viewing for cutting-edge demos.

**Links:**
- YouTube: https://www.youtube.com/@TwoMinutePapers
- Twitter: https://twitter.com/karoly_zsolnai
- Patreon: https://www.patreon.com/TwoMinutePapers
- Personal site: https://users.cg.tuwien.ac.at/zsolnai/

**Key Topics for Our Demos:**
- Fluid simulations (Navier-Stokes)
- Gaussian Splatting (3D from photos)
- Neural Radiance Fields (NeRF)
- Cloth and soft body physics
- Smoke and fire simulations
- AI image generation
- Physics engines

**Interactive Demos Inspired by Two Minute Papers:**
- WebGL Fluid Simulation: https://paveldogreat.github.io/WebGL-Fluid-Simulation/
- GPU Fluid Experiments: https://haxiomic.github.io/GPU-Fluid-Experiments/html5/
- 3D Gaussian Splatting: https://repo-sam.inria.fr/fungraph/3d-gaussian-splatting/
- Awesome Gaussian Splatting: https://mrnerf.github.io/awesome-3D-gaussian-splatting/

When building new demos, check Two Minute Papers for inspiration. His videos explain cutting-edge research in accessible ways that can guide our WebGL implementations.

### Lambda GPU Cloud
For running heavy AI/ML research that requires GPU power.

**Links:**
- Main site: https://lambda.ai/
- Pricing: https://lambda.ai/pricing
- On-Demand: https://lambda.ai/service/gpu-cloud

**Pricing (as of Jan 2026):**
- H100: ~$1.35/hr
- A100: affordable hourly rates
- No egress fees
- Pre-installed PyTorch, CUDA, Lambda Stack

**Use for:**
- Training Gaussian Splatting models
- Running SIGGRAPH paper code
- Training NeRFs
- Any heavy ML workload

### SIGGRAPH Research with Demos
Cem Yuksel's research has many papers featured on Two Minute Papers with source code and demos:
- https://www.cemyuksel.com/research/
- Real-Time Fiber Cloth (2 TMP episodes)
- Vertex Block Descent (SIGGRAPH 2025 Audience Choice)
- Stochastic Lightcuts (featured on TMP)
- Interactive Splines demo

### Physics Playground Collections
- PhET: https://phet.colorado.edu/ (106 physics simulations!)
- My Physics Lab: https://www.myphysicslab.com/
- oPhysics: https://ophysics.com/
- Science Playground List: https://thescienceplayground.com/ (thousands!)

---

## Additional Documentation

**WEBSITE.md** - Complete website documentation
- Full architecture and deployment guide
- All pitfalls and solutions
- Component documentation
- Common tasks reference
- READ THIS for comprehensive understanding

**GENESIS.md** - The invention story
- IP protection documentation
- Prior art declaration
- Method specification

**ROADMAP.md** - Platform vision
- Feature roadmap
- Priority order
- Success metrics

---

## When in Doubt

1. Check if both repos are synced: `git log origin/master --oneline -1` vs `git log website/master --oneline -1`
2. Check Vercel deployment status
3. Make repos public if Vercel stops deploying
4. Read this file for solutions
5. **Full website docs**: Read WEBSITE.md
6. **Legal questions**: Check LEGAL_KNOWLEDGE.md in home directory
7. **Security questions**: Check SECURITY_PRACTICES.md in home directory
8. **Invention/IP**: Read GENESIS.md
