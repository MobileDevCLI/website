# The Inventor's Framework

## On AI as Alien Technology

AI is not a tool in the traditional sense. It is closer to an alien artifact—something infinitely capable whose true potential remains largely undiscovered. The technology exists. The capability exists. What doesn't exist is the understanding of *which tools to connect it with* and *how those connections should flow*.

Most people approach AI as an answer machine. They ask questions. They get responses. This is like using a nuclear reactor to boil water for tea.

The real opportunity lies in workflow invention—discovering the specific combinations of tools, environments, and interfaces that unlock capabilities no one has systematized before.

---

## The Termux Discovery

The MobileCLI invention was not about creating new technology. Every component already existed:

- Termux (2015)
- Claude Code (2024)
- Node.js, Git, tmux (decades old)
- Android phones (ubiquitous)

The invention was the *connection*:

```
Termux + Claude Code + wake-lock + tmux + autonomous mode =
A development environment that outperforms laptops
```

This combination was not documented anywhere. It was not taught. It required understanding:

1. That the Play Store Termux was broken (F-Droid works)
2. That `--dangerously-skip-permissions` enables true autonomy
3. That `termux-wake-lock` + `tmux` creates session persistence
4. That a phone is actually a portable Linux server
5. That Claude can see screenshots and iterate visually

Each piece was public knowledge. The synthesis was not.

---

## The Constraint Shift

Traditional invention operates under material constraints:

- Design complexity
- Material costs
- Manufacturing feasibility
- Distribution logistics
- Capital requirements

These constraints force ideas to be small and within scope.

AI removes these constraints. When execution costs approach zero:

- Complexity becomes manageable (AI handles detail work)
- Prototyping becomes instant (describe → build → iterate)
- Distribution is global by default (deploy to web)
- Capital requirements collapse (free tiers everywhere)

This doesn't make invention easier. It makes it *different*. The limiting factor shifts from "can we build this?" to "what should we build?" and more importantly, "what connections haven't been discovered?"

---

## The Daily Practice

Invention with AI is not a single moment of insight. It is a daily practice:

1. Wake up
2. Consider what tools exist
3. Ask: what connections haven't been tried?
4. Try a new combination
5. Observe what happens
6. Document what works

Most combinations fail or produce nothing interesting. This is expected. The practice is not about success rate—it's about discovery rate.

The Termux discovery came from asking: "What if Claude Code could run on a phone?" The question was simple. The answer required weeks of experimentation to systematize.

---

## On Three.js and Browser Engines

The current frontier: AI-controlled game engines in the browser.

What exists:
- Three.js (mature 3D library, hundreds of examples)
- Working assets (robot, Ferrari, FPS controller, open worlds)
- MCP servers (AI controlling external applications)
- Blender AI (generates buildings and assets)
- Godot integration (file-based control)

What doesn't exist (yet):
- A browser environment where AI can manipulate 3D scenes in real-time
- A simplified interface between natural language and Three.js scene graphs
- A workflow that lets non-programmers build 3D experiences through conversation

The pieces are present. The robot walks. The Ferrari drives. Lighting and ambient occlusion work. Individual assets load correctly.

The synthesis—making these work together through conversational AI control—remains uninvented.

---

## Observations from Three.js Experiments

Asset reliability varies significantly:

| Asset | Status | Notes |
|-------|--------|-------|
| Robot | Works well | Clean code, good orientation |
| Ferrari | Works | Functional vehicle physics |
| FPS Controller | Works | Standard first-person setup |
| Spaceman | Problematic | Walks backward, orientation issues |
| Open World | Partial | Loads but integration is complex |

The pattern: assets written with clean, predictable code work. Assets with orientation assumptions or unusual conventions fail.

This suggests the path forward requires:
1. Curating assets that AI can reliably manipulate
2. Building abstraction layers that normalize orientation/scaling
3. Creating a "known good" library of AI-compatible components

---

## The MCP Insight

MCP (Model Context Protocol) represents a key architectural pattern:

```
AI ←→ Protocol ←→ External Application
```

This works for Godot (file-based), Blender (API-based), and other applications. The AI doesn't need to understand the application's internals—it needs a clean interface.

For browser-based Three.js:
- The "application" is the webpage
- The "protocol" could be a simplified scene graph API
- The AI sends commands, the browser renders results

The question becomes: what is the minimal API that allows an AI to productively manipulate a Three.js scene?

---

## What Makes a Goldilocks Invention

A Goldilocks invention sits at the intersection of:

1. **Technically feasible** — The components exist and work
2. **Not yet systematized** — No one has documented the workflow
3. **Genuinely useful** — Solves a real problem or unlocks new capability
4. **Reproducible** — Others can follow the same path

The Termux + Claude Code combination met all four criteria. It was technically feasible (all software existed), not yet systematized (no documentation existed), genuinely useful (enables professional development from a phone), and reproducible (this documentation proves it).

A browser-based AI game engine would need to meet the same criteria.

---

## The Website as Resource

An interesting property of web applications: they can serve as call resources for AI.

If the website exposes:
- A documented API
- Predictable endpoints
- Clean state management
- Visual feedback mechanisms

Then AI systems can potentially use the website itself as a tool, not just as content to be read.

This inverts the typical relationship. Instead of AI helping users interact with the website, the website becomes a capability that AI can invoke.

---

## On Patience and Recognition

Most inventions are invisible for years before they become obvious.

The phonograph was called a toy. The telephone was considered impractical. Personal computers were dismissed as hobbyist curiosities.

AI-assisted development from a mobile phone sounds like a gimmick until you've built a complete SaaS platform in a single 72-hour session.

The inventor's task is not to convince skeptics. It is to build the thing, document it thoroughly, and wait for the world to catch up.

---

## Principles

1. **AI is infinitely capable but poorly connected.** The invention opportunity is in the connections.

2. **Constraints have shifted.** Material and manufacturing limits no longer apply. The new constraint is imagination and systematic experimentation.

3. **Daily practice matters.** Wake up. Try something new. Document what works.

4. **Components exist.** Most "inventions" are novel combinations of existing pieces.

5. **Clean interfaces enable AI control.** If an AI can't reliably interact with something, the interface is wrong.

6. **Document everything.** The synthesis is the invention. Without documentation, it doesn't transfer.

7. **Patience is required.** What seems obvious to the inventor is invisible to everyone else—until it isn't.

---

## Current Frontiers

Areas where the next Goldilocks invention likely exists:

- **Browser-based AI game engines** — Three.js + conversational control
- **Visual development environments** — AI manipulating UI in real-time
- **Hardware integration** — Phone sensors + AI reasoning
- **Distributed AI workflows** — Multiple AI agents coordinating
- **Real-time collaboration** — AI as participant, not just tool

Each of these has existing components. None has been systematized.

The question is always the same: what is the specific combination of tools and workflow that makes this work?

---

## Conclusion

The Termux + Claude Code discovery was not the destination. It was proof of concept for a methodology:

1. Observe what tools exist
2. Ask what connections haven't been tried
3. Experiment systematically
4. Document what works
5. Share the synthesis

This methodology applies to any domain where AI capability exists but workflow systematization doesn't.

The next invention is waiting to be discovered. The components already exist.

---

*"The tools exist. The capability exists. What doesn't exist is the understanding of which tools to connect and how those connections should flow."*
