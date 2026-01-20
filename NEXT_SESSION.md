# MobileCLI - Quick Start for Next Session

**Read this first when starting a new Claude Code session.**

---

## Your App is 90% Done!

### What's Working
- Android app: 100% functional
- Website: Live at mobilecli.com
- Supabase: Configured and ready
- Legal docs: Complete

### What You Need to Do (30 min total)

#### Step 1: Stripe Setup (15 min)
1. Go to https://stripe.com
2. Create 4 products:
   - MobileCLI Pro Monthly: $10/mo
   - MobileCLI Pro Yearly: $100/yr
   - MobileCLI Team Monthly: $20/mo
   - MobileCLI Team Yearly: $200/yr
3. Copy the Price IDs
4. Copy the Publishable Key
5. Update `website/js/stripe-config.js`

#### Step 2: Verify Supabase SQL (5 min)
1. Go to https://supabase.com/dashboard/project/mwxlguqukyfberyhtkmg
2. Check if tables exist (waitlist, profiles, subscriptions, app_licenses)
3. If not, run `website/supabase-setup.sql` in SQL Editor

#### Step 3: Release Key (5 min)
```bash
keytool -genkey -v -keystore mobilecli-release.keystore -alias mobilecli -keyalg RSA -keysize 2048 -validity 10000
```

#### Step 4: Play Store (5 min + $25)
1. Go to https://play.google.com/console
2. Pay $25
3. Create listing

---

## Key Files

| File | What It Does |
|------|--------------|
| `ROADMAP_AND_STATUS.md` | Full project status |
| `SECURITY_AUDIT.md` | Pre-release checklist |
| `COMPLETE_SYSTEM_DOCUMENTATION.md` | Technical reference |
| `website/js/stripe-config.js` | **UPDATE THIS WITH STRIPE KEYS** |
| `website/supabase-setup.sql` | Database schema |

---

## Quick Commands

```bash
# Build debug APK
cd MobileCLI-CLEAN && ./gradlew assembleDebug

# Push to GitHub
git add . && git commit -m "message" && git push

# Check website
open https://mobilecli.com
```

---

## Supabase Credentials (Already Configured)
```
URL: https://mwxlguqukyfberyhtkmg.supabase.co
Key: In website/js/supabase-config.js
```

---

## Important Notes

1. **Security Audit**: Run before public release (see SECURITY_AUDIT.md)
2. **Personal Data**: Remove any personal info before release
3. **iOS**: Planned for future (needs iPad)
4. **Goal**: Sell to Anthropic/Google after gaining traction

---

**Full details: Read ROADMAP_AND_STATUS.md**
