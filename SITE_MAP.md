# MobileCLI Site Map

**Last Updated:** January 4, 2026
**Total Pages:** 48

---

## Site Structure

```
mobilecli.com/
├── Main Pages
│   ├── index.html              # Homepage with 3D physics hero
│   ├── pricing.html            # Pricing tiers (Free/Pro/Team)
│   ├── login.html              # Supabase GitHub OAuth login
│   ├── dashboard.html          # User dashboard & setup wizard
│   ├── learn.html              # Full documentation
│   ├── quickstart.html         # Quick start guide
│   ├── examples.html           # Code examples gallery
│   └── news.html               # News feed
│
├── Interactive Pages
│   ├── demos.html              # WebGL demos hub
│   ├── games.html              # Games arcade
│   ├── ai-hub.html             # AI tools directory (50+ tools)
│   ├── twominutepapers.html    # Two Minute Papers resources
│   ├── engine.html             # Browser game engine
│   ├── labs.html               # Experimental features
│   ├── ai-quality.html         # AI quality comparison
│   └── pro-preview.html        # Pro methodology (gated)
│
├── Content Pages
│   ├── research.html           # Research lab (Pro)
│   └── proof.html              # Case study: 72 hours
│
├── Legal Pages
│   ├── terms.html              # Terms of Service
│   ├── privacy.html            # Privacy Policy
│   ├── disclaimer.html         # Legal Disclaimer
│   ├── ip.html                 # IP Notice
│   ├── dmca.html               # DMCA Policy
│   ├── legal-guide.html        # AI Legal Protection Guide
│   └── security-guide.html     # Security Best Practices
│
├── demo/                       # WebGL Demos (16 pages)
│   ├── fluid.html              # Navier-Stokes fluid
│   ├── cloth.html              # Verlet cloth physics
│   ├── galaxy.html             # Particle galaxy
│   ├── gravity.html            # N-body gravity
│   ├── fractals.html           # Mandelbrot/Julia
│   ├── boids.html              # Flocking simulation
│   ├── fire.html               # Procedural fire
│   ├── waves.html              # Wave interference
│   ├── terrain.html            # Procedural terrain
│   ├── metaballs.html          # Metaball visualization
│   ├── raymarching.html        # Raymarching shader
│   ├── shaderart.html          # Shader art gallery
│   ├── life.html               # Game of Life
│   ├── neural.html             # Neural network viz
│   ├── audio.html              # Audio visualization
│   └── magnetic.html           # Magnetic field lines
│
├── games/                      # Games (2 pages)
│   ├── sketchbook.html         # Quick Draw paint app
│   └── vibe-jam-2025.html      # Vibe Jam game entry
│
└── sketchbook/                 # Sketchbook 3D Demo (4 pages)
    ├── index.html              # Main sketchbook demo
    ├── index_v2.html           # Version 2
    ├── diagnostic.html         # WebGL diagnostic
    └── minimal.html            # Minimal test
```

---

## Page Categories

### Public (Free) Pages - 28
All users can access these pages without authentication:

| Page | Purpose | Key Features |
|------|---------|--------------|
| / | Homepage | Three.js hero, value props, CTAs |
| /pricing.html | Pricing | 3 tiers comparison |
| /login.html | Authentication | GitHub OAuth via Supabase |
| /learn.html | Documentation | Full docs, 7 tabs |
| /quickstart.html | Quick Start | 6-step setup guide |
| /examples.html | Examples | Code samples gallery |
| /news.html | News | AI/mobile dev updates |
| /demos.html | Demo Hub | Links to all 16 demos |
| /games.html | Games | Games arcade |
| /ai-hub.html | AI Hub | 50+ AI tools by category |
| /twominutepapers.html | Resources | Research demos collection |
| /engine.html | Game Engine | Browser-based Unity-like |
| /labs.html | Labs | Experimental features |
| /proof.html | Case Study | 72-hour build story |
| /research.html | Research | Research previews (teaser) |
| /ai-quality.html | AI Quality | Model comparisons |
| /terms.html | Terms | Terms of Service |
| /privacy.html | Privacy | Privacy Policy |
| /disclaimer.html | Disclaimer | Legal disclaimer |
| /ip.html | IP Notice | Intellectual property |
| /dmca.html | DMCA | DMCA policy |
| /legal-guide.html | Legal Guide | AI IP protection guide |
| /security-guide.html | Security | Security best practices |
| /demo/* | Demos | 16 WebGL demos |

### Pro (Authenticated) Pages - 2
Require authentication and Pro subscription:

| Page | Purpose |
|------|---------|
| /dashboard.html | User dashboard |
| /pro-preview.html | Full methodology |

### Utility Pages - 4
Development/testing pages:

| Page | Purpose |
|------|---------|
| /sketchbook/diagnostic.html | WebGL diagnostics |
| /sketchbook/minimal.html | Minimal test page |
| /sketchbook/test.html | Test page |
| /games/vibe-jam-2025.html | Game jam entry |

---

## Navigation Structure

### Desktop Navigation
```
Logo (dropdown: GitHub, Twitter, YouTube, Email)
├── Pricing
├── Docs
├── Demos
├── Games
├── Research
└── Login/Get Started
```

### Mobile Navigation (Tabs)
```
Home | Pricing | Docs | Demos | Games | Login
```

### Footer Links
```
Home | Terms | Privacy | Disclaimer | IP Notice | DMCA
© 2026 Samblamz / MobileDevCLI. All Rights Reserved.
```

---

## URL Patterns

### Clean URLs
All pages use `.html` extension:
- `https://mobilecli.com/pricing.html`
- `https://mobilecli.com/demos.html`
- `https://mobilecli.com/demo/fluid.html`

### Subdirectories
| Path | Content |
|------|---------|
| /demo/ | 16 WebGL demos |
| /games/ | 2 game pages |
| /sketchbook/ | 4 sketchbook pages |

---

## Tech Stack by Page Type

### Static Pages (Legal, Content)
- Vanilla HTML/CSS
- No JavaScript required
- Mobile-responsive

### Interactive Pages (Demos, Games)
- Three.js (3D graphics)
- Cannon.js (physics)
- Custom shaders (GLSL)
- Touch/mouse controls

### Auth Pages (Login, Dashboard)
- Supabase Auth
- GitHub OAuth
- Session management

### Game Engine
- Three.js
- Cannon.js
- Monaco Editor
- LocalStorage persistence

---

## SEO Metadata

All pages include:
- `<title>` - Page title
- `<meta name="description">` - Page description
- `<link rel="canonical">` - Canonical URL
- Open Graph tags (key pages)

---

## Performance Notes

### Demo Pages
- Target: 30fps minimum on mobile
- Use `powerPreference: "high-performance"`
- Limit pixel ratio: `Math.min(devicePixelRatio, 2)`

### Main Pages
- Lazy load images
- Minimal JavaScript on landing
- CSS animations over JS where possible

---

## Robots.txt

```
User-agent: *
Disallow: /pro-preview.html
Disallow: /sketchbook/diagnostic.html
Disallow: /sketchbook/test.html
Disallow: /sketchbook/minimal.html
```

---

*Site map generated January 4, 2026*
