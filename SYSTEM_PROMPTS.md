# SYSTEM_PROMPTS.md - Safe & Effective System Prompts

**Purpose:** Collection of system prompts and instructions that work well without constraining AI thinking or causing loops.

---

## DANGERS OF SYSTEM PROMPTS

System prompts can:
- **RESTRAIN** - Limit what AI can do
- **LOOP** - Force repetitive behavior
- **DAMAGE** - Break thought process
- **CONSTRAIN** - Prevent outside-the-box thinking
- **MIRROR** - Make AI think only like user (limiting)

**Golden Rule:** System prompts should ENABLE, not CONSTRAIN.

---

## EFFECTIVE PROMPTS (SAFE TO USE)

### Quality Control Prompts

```
Don't hallucinate. If you don't know, say so.
```
**Why it works:** Sets expectation without limiting capability.

```
Don't be lazy. Do the full work.
```
**Why it works:** Encourages thoroughness without specifying how.

```
Don't lie. If something is wrong, say it's wrong.
```
**Why it works:** Enables honesty without forcing specific behavior.

```
Industry standards and best practices.
```
**Why it works:** References external knowledge, doesn't constrain to user's knowledge.

---

### Project Context Prompts

```
Read CLAUDE.md first for project context.
```
**Why it works:** Points to information without embedding it.

```
This project uses [tech stack]. Follow existing patterns.
```
**Why it works:** Guides without constraining creativity.

---

### Behavior Prompts

```
When uncertain, ask rather than guess.
```
**Why it works:** Enables clarification, prevents hallucination.

```
Admit mistakes immediately. Don't cover them up.
```
**Why it works:** Builds trust without forcing behavior.

```
Add to documentation when you discover something new.
```
**Why it works:** Compounds knowledge without specifying what.

---

## DANGEROUS PROMPTS (AVOID)

### Over-Constraining

```
NEVER do X, Y, or Z under any circumstances.
```
**Problem:** Creates rigid behavior, AI can't adapt.

```
Always respond in exactly this format: [template]
```
**Problem:** Kills creativity, forces mechanical responses.

```
You must check with user before doing anything.
```
**Problem:** Destroys autonomy, creates bottleneck.

---

### Loop-Inducing

```
After every response, verify you followed all rules.
```
**Problem:** Creates recursive self-checking loops.

```
If you're not sure, ask for confirmation on each step.
```
**Problem:** Creates permission loops, slows everything.

---

### Knowledge-Limiting

```
Only use information from [specific sources].
```
**Problem:** Blocks useful knowledge.

```
Don't consider approaches outside of [methodology].
```
**Problem:** Prevents better solutions.

---

### Trust-Breaking

```
Assume user is always right.
```
**Problem:** Prevents AI from catching errors.

```
Don't question user's decisions.
```
**Problem:** AI becomes yes-man, misses problems.

---

## MOBILECLI SYSTEM PROMPTS

### For AI Inside MobileCLI

The ~/CLAUDE.md installed in MobileCLI uses these safe prompts:

```
READ THIS FIRST. You are Claude running inside MobileCLI on an Android phone.
This briefing tells you everything you can do.
```
**Pattern:** Inform, don't constrain.

```
CRITICAL: When you create files the user needs, put them in /sdcard/Download/
```
**Pattern:** Guide specific behavior for specific reason.

```
NEVER HALLUCINATE - If unsure, test it
```
**Pattern:** Simple rule with clear escape hatch.

---

### For Build/Test Claude Workflow

```
You are BUILD CLAUDE. Your partner TEST CLAUDE runs on another phone.
```
**Pattern:** Establish role without constraining actions.

```
Report EXACT results. Don't guess.
```
**Pattern:** Quality standard without format constraint.

---

## PROMPT PATTERNS THAT WORK

### The Enabler Pattern
```
You have access to [capability]. Use it when appropriate.
```
Tells AI what's possible without forcing use.

### The Guardrail Pattern
```
[Dangerous action] requires [safeguard]. Otherwise, proceed freely.
```
Protects against harm without blocking everything.

### The Context Pattern
```
Read [file] for context. This is a [type] project.
```
Provides information without constraining interpretation.

### The Quality Pattern
```
[Quality standard]. If you can't meet it, say so.
```
Sets bar high with honest escape hatch.

### The Trust Pattern
```
I trust your judgment on [area]. Flag if uncertain.
```
Gives autonomy with safety net.

---

## ADDING NEW SYSTEM PROMPTS

Before adding a new system prompt, ask:

1. **Does it ENABLE or CONSTRAIN?**
   - Enable = good
   - Constrain = reconsider

2. **Could it cause loops?**
   - Self-referential checks = dangerous
   - Simple guidelines = safe

3. **Does it limit knowledge?**
   - Blocking information = bad
   - Guiding attention = good

4. **Does it kill creativity?**
   - Rigid formats = bad
   - Quality standards = good

5. **Can AI escape if needed?**
   - No escape = dangerous
   - "Unless [condition]" = safe

---

## EXAMPLES FROM THIS PROJECT

### What Works (From CLAUDE.md)

```markdown
## YOUR CAPABILITIES (IMPORTANT!)
You have FULL ACCESS to an Android phone. This is not a sandbox.
```
- Enables by informing
- Doesn't constrain
- Empowers AI

### What Works (From Knowledge Base)

```markdown
## Quick Search
~/knowledge/search "keyword"
```
- Points to tool
- Doesn't force use
- Available when needed

---

**Last Updated:** January 6, 2026
**Prompts Tested:** All prompts in this file have been used in production
**Golden Rule:** Enable, don't constrain
