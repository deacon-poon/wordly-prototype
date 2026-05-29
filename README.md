# Wordly Lab

A protected space for fast, executive-free product experimentation at Wordly. Prototypes ship as deployed URLs. Components land in a shared library that engineering pulls from. Handoff is a PR, not a presentation.

> **Who collaborates here:** Deacon Poon (Design), Graham Herrli (UX), Justin Cepelak (PM).
> **Engineering contacts for handoff:** Grace (React), Javier (Angular), Rob (Storybook), via Jo.

---

## What lives where

```
wordly-prototype/
├── apps/                       ← one folder per prototype (each deploys to its own URL)
│   ├── justin-prototype/       → https://justin-prototype.vercel.app  (live)
│   ├── _template/              → scaffold for new prototypes
│   └── design-system/          → docs site (Fumadocs)
├── packages/
│   ├── ui/                     ← @wordly/ui — shared component library (source of truth)
│   ├── tokens/                 ← @wordly/tokens — design tokens as CSS vars + JSON
│   └── config/                 ← @wordly/config — Tailwind preset + tsconfig base
├── src/                        ← legacy: original wordly-prototype dashboard (Next.js)
├── mobile-app/                 ← legacy: React Native attendee/presenter app
├── .claude/
│   ├── CLAUDE.md               ← AI context for Claude Design sessions
│   └── agents/                 ← designer.md, ux.md, pm.md — role-scoped agents
├── .storybook/                 ← Storybook config — indexes packages/ui
└── docs/
    ├── CONTRIBUTING.md         ← team workflow (start a prototype, add a component)
    └── handoff-checklist.md    ← sign-off criteria for graduation to engineering
```

---

## Quick start

```bash
# Install all workspaces (apps/* + packages/*)
npm install

# Browse the shared component library at localhost:6006
npm run dev:storybook

# Scaffold a new prototype from the template
npm run create-app my-idea

# Run a specific app
cd apps/my-idea && npm run dev
```

---

## How prototypes get deployed

Every app under `apps/` gets its own Vercel project. Push to a branch, get a URL back.

| Push to | What happens |
|---|---|
| `main` | Production URL updates (e.g. `justin-prototype.vercel.app`) |
| Any other branch | Unique preview URL for the branch (auth-walled by default) |
| Any PR | Vercel comments the preview URL on the PR |
| Files outside the app's folder | Build is skipped — no rebuild |

**Live URLs today:**
- 🚀 **Justin's prototype** → https://justin-prototype.vercel.app
- 📚 **Storybook** (`@wordly/ui` showcase) → deployed via `vercel-storybook.json` on push to `main`

---

## Adding a component to `@wordly/ui`

`packages/ui` is the single source of truth. Components used in any prototype must live here so engineering can review the same artifact at handoff time.

```bash
# 1. Create the component
packages/ui/src/components/[name].tsx

# 2. Export from the barrel
packages/ui/src/components/index.ts → add: export * from "./[name]";

# 3. Write a Storybook story
packages/ui/src/components/[name].stories.tsx

# 4. Use it in your app
import { Name } from "@wordly/ui";
```

Today: **67 components** in `@wordly/ui`. See full catalog in `.claude/CLAUDE.md`.

---

## AI-native workflow

This repo is set up for **Claude Design** (Anthropic) to read the codebase as primary context. Claude Design reads `.claude/CLAUDE.md` to understand:
- What components exist (the catalog)
- What design tokens are available (`packages/tokens/src/tokens.json`)
- The handoff criteria
- How to scaffold new prototypes

Other tools (Figma, etc.) consume the same design tokens via `packages/tokens/src/tokens.json` — single source, multiple surfaces.

**Role-scoped agents** in `.claude/agents/` capture how each person collaborates with AI:
- `designer.md` — Deacon
- `ux.md` — Graham
- `pm.md` — Justin

---

## Handoff to engineering

A prototype "graduates" out of Lab when it meets the criteria in [`docs/handoff-checklist.md`](docs/handoff-checklist.md). The artifact handed off is a **PR** containing:
- The prototype app
- Any new components landed in `packages/ui` with Storybook stories
- ≥70% production-reusable code (estimated)
- Vercel preview URL + Storybook URL

Engineering reviews the PR, not a Figma file or a Loom.

---

## Legacy work in this repo

| Path | What it is | Status |
|---|---|---|
| `src/` | Original wordly-prototype dashboard (Next.js, organization/events management) | Active — separate from Lab work |
| `mobile-app/` | React Native attendee/presenter app | Foundation only |

The Lab monorepo (`apps/` + `packages/`) was layered on top of the existing dashboard. They share the Vercel scope and Git history but are otherwise independent.

---

## Common commands

```bash
# Storybook
npm run dev:storybook            # localhost:6006
npm run build:storybook          # → storybook-static/

# Prototype scaffolding
npm run create-app [name]        # new app from apps/_template/

# Dashboard (legacy)
npm run dev                      # runs the Next.js app from src/
npm run build:vercel             # production build for Vercel

# Design tokens
npm run tokens:generate          # regenerate from Figma source
```

---

## Read next

- [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md) — workflow rules
- [`docs/handoff-checklist.md`](docs/handoff-checklist.md) — graduation criteria
- [`.claude/CLAUDE.md`](.claude/CLAUDE.md) — full AI context (components, tokens, patterns)
