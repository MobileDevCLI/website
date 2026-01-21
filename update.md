# MobileCLI Updates

**Version:** 2.0.0-beta.34
**Date:** January 21, 2026

---

## What's New in beta.34

### Self-Healing API Scripts
App now automatically detects and regenerates API scripts on every launch. If scripts were overwritten by `pkg install termux-api`, they are automatically restored.

### API Result File Fix (beta.33)
Fixed issue where data-returning API commands returned empty output.

### Android 14+ Broadcast Fix (beta.32)
Fixed API commands not working on Android 14+ by using explicit broadcasts.

---

## Important: API Script Regeneration

If you installed the `termux-api` package, it overwrites MobileCLI's built-in API scripts. To fix:

```bash
# Download and run regeneration script
curl -s https://mobilecli.com/regenerate-api.sh | bash
```

Or manually:
```bash
bash /sdcard/Download/regenerate-api.sh
```

**Do NOT run `pkg install termux-api`** - MobileCLI has its own built-in API.

---

## Version History

| Version | Commit | Description |
|---------|--------|-------------|
| beta.34 | 693cc57 | Self-healing API script regeneration |
| beta.33 | d667389 | API result file directory fix |
| beta.32 | bc70ad7 | Android 14+ explicit broadcasts |
| beta.31 | 74eb24a | Update drawer button |
| beta.30 | b397f39 | AI Briefing drawer button |

**To revert:** `git revert <commit>` then rebuild.

---

## Quick Tips

### Power Mode
Launch Claude with auto-accept enabled:
- Drawer menu → Power Mode
- Or run: `claude --dangerously-skip-permissions`

### Test API Commands
```bash
termux-vibrate
termux-toast "Hello"
termux-battery-status
```

---

## Need Help?

- Visit: https://mobilecli.com
- Tap "AI Briefing" to teach your AI about MobileCLI
- Tap "Help" in the drawer menu for quick reference

---

*Last updated: January 21, 2026*
