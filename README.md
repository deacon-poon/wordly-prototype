# Wordly Lab

A protected space for fast, executive-free product experimentation at Wordly. Prototypes ship as deployed URLs. Components land in a shared library that engineering pulls from. Handoff is a PR, not a presentation.

> **Who collaborates here:** Deacon Poon (Design), Graham Herrli (UX), Justin Cepelak (PM).
> **Engineering contacts for handoff:** Grace (React), Javier (Angular), Rob (Storybook), via Jo.

---

## The deal: you build a feature, it gets a URL — automatically

You don't wire up routes, sidebars, or deploys. You drop a folder under `src/features/`,
and the app does the rest **deterministically**:

```
src/features/<id>/   →   sidebar entry + route at /lab/<id>   →   Vercel preview URL on your PR
   (you build here)        (generated, never hand-wired)            (posted automatically)
```

`<id>` is semantic (what the thing *is*, e.g. `attendee-highlights`) — **never a person's name**.

---

## Two ways to build (pick the right track)

### Track A — In-app feature module  ← **DEFAULT**
Prototype a feature **inside the real Wordly dashboard** so it looks native and lives where
it actually would. This is the primary collaboration model.

```
src/features/<id>/
  feature.config.ts   ← the contract: sidebar placement + owner. Pure data.
  index.tsx           ← "use client", default-exports your root component. BUILD HERE.
  …                   ← components/, data/, types.ts, *.module.css — anything else, inside this folder.
```

- **Reuse dashboard UI from `@/components/ui/*`** (ShadCN/Radix: Button, Dialog, Table, Tabs, …).
- Route `/lab/<id>` and the sidebar item are **generated** — you never touch shared files.

### Track B — Standalone prototype in `apps/*`
For throwaway/rough explorations that should **not** live in the dashboard (incl. plain HTML).
These import from **`@wordly/ui`** (`packages/ui`) + `@wordly/tokens`.

> Reuse source differs by track: in-app features use `@/components/ui/*`; `apps/*` prototypes
> use `@wordly/ui`. Don't mix them up.

---

## What lives where

```
wordly-prototype/
├── src/
│   ├── features/                 ← Track A: one folder per prototype → /lab/<id>
│   │   ├── _template/            → scaffold create-feature copies from (don't build here)
│   │   └── attendee-highlights/  → Justin's prototype → /lab/attendee-highlights
│   ├── app/
│   │   ├── lab/[feature]/        → single catch-all route that renders any feature (generated wiring)
│   │   └── doc/                  → /doc — native, always-current component showcase
│   ├── shell/                    ← app shell + feature-registry.generated.ts (owner-gated; never hand-edit)
│   └── components/ui/            ← ShadCN/Radix primitives reused by Track A features
├── apps/                         ← Track B: standalone prototypes (each its own Vercel project)
│   ├── _template/                → scaffold for new standalone apps
│   └── design-system/            → Fumadocs docs site
├── packages/
│   ├── ui/                       ← @wordly/ui — shared component library (Track B source of truth)
│   ├── tokens/                   ← @wordly/tokens — design tokens as CSS vars + JSON
│   └── config/                   ← @wordly/config — Tailwind preset + tsconfig base
├── scripts/
│   ├── create-feature.js         → scaffolds src/features/<id>/ from the template
│   └── generate-feature-registry.js → scans features, rewrites the registry (runs on predev/prebuild)
├── .storybook/                   ← Storybook config — indexes packages/ui
└── docs/
    ├── COLLABORATING.md          ← plain-English teammate guide
    └── handoff-checklist.md      ← sign-off criteria for graduation to engineering
```

---

## Quick start

```bash
npm install                       # install all workspaces

npm run dev                       # http://localhost:3000  → open /lab/<id> or /doc
npm run create-feature <id> <owner>   # scaffold a Track A feature (regenerates the registry)

npm run dev:storybook             # localhost:6006 — @wordly/ui showcase
npm run create-app <name>         # scaffold a Track B standalone app
```

The agent normally runs these for you — see the four verbs in `.claude/CLAUDE.md`
("start a feature", "save my work", "sync", "ship it").

---

## How a feature gets its route + sidebar entry (the deterministic part)

You never hand-wire routing. Adding a feature touches **no shared file**:

1. `npm run create-feature <id> <owner>` copies `src/features/_template/` → `src/features/<id>/`.
2. A codegen step (`npm run generate:features`, auto-run on `predev`/`prebuild`) scans every
   `src/features/*/feature.config.ts` and rewrites `src/shell/feature-registry.generated.ts`.
3. That registry powers the sidebar nav **and** the single catch-all route
   `src/app/lab/[feature]/page.tsx`. Your feature is now live at **`/lab/<id>`**.

**Never hand-edit `feature-registry.generated.ts`** — regenerate it (the output is deterministic,
which also resolves any merge conflict on it).

### The contract — `feature.config.ts`
```ts
{
  id: "attendee-highlights",        // == folder name; route becomes /lab/<id>
  title: "Attendee Highlights",
  owner: "justin",                  // ownership metadata (not the folder name)
  stage: "draft",
  chrome: "portal" | "standalone",  // "portal" = inside dashboard shell; "standalone" = full-screen end-user
  nav: { group: "main"|"workspace"|"organization", label, icon, order }
}
```

---

## How prototypes get deployed

| Push to | What happens |
|---|---|
| Any branch / PR | Vercel builds a **preview** and comments the URL on the PR |
| `main` | Production URL updates |
| Files outside a Track-B app's folder | That app's build is skipped — no rebuild |

**Today:** Track A features render inside the main `wordly-prototype` Vercel project
(open `/lab/<id>` on its preview URL). Storybook deploys via `vercel-storybook.json`.
There is no separate per-feature URL — that's the point of Track A: one app, native placement.

---

## Adding a component to `@wordly/ui` (Track B)

`packages/ui` is the source of truth for standalone apps. Components used in any Track-B prototype
must live here so engineering reviews the same artifact at handoff.

```bash
packages/ui/src/components/[name].tsx          # 1. create
packages/ui/src/components/index.ts            # 2. export * from "./[name]";
packages/ui/src/components/[name].stories.tsx  # 3. write a Storybook story
import { Name } from "@wordly/ui";             # 4. use it
```

For Track A features, reuse `@/components/ui/*` directly. Need a shared component changed or added?
**Don't fork it** — build it locally in your feature, then flag it for Deacon to promote into the
shared library. That promotion is the reusability flywheel.

---

## Component documentation surfaces

| Surface | What it is | Run |
|---|---|---|
| `/doc` | Native, always-current in-app showcase of `@/components/ui/*` (Track A primitives) | `npm run dev` → `/doc` |
| Storybook | Interactive `@wordly/ui` catalog (Track B) | `npm run dev:storybook` |
| `apps/design-system` | Fumadocs docs site (foundations, tokens, component docs) | run from its folder |

---

## Handoff to engineering

A prototype "graduates" out of Lab when it meets the criteria in
[`docs/handoff-checklist.md`](docs/handoff-checklist.md). The artifact handed off is a **PR**:
the feature (or app), any new shared components with stories, and a Vercel preview URL.
Engineering reviews the PR, not a Figma file or a Loom.

---

## Guardrails

**Extend, don't edit.** Build only inside your `src/features/<id>/` (or `apps/<name>/`) folder.
These paths are owner-gated (`.github/CODEOWNERS` → `@deacon-poon`) — read/import freely, but don't
modify them on a feature branch:

```
/src/shell/   /src/components/   /src/store/   /src/contexts/
/src/app/layout.tsx   /src/app/globals.css   /src/app/lab/
/packages/   /scripts/   /.github/
```

- Don't hardcode hex colors — use the design tokens / Tailwind classes
  (Brand Blue `#017CFF`, Action Teal `#1BC3E4`, Accent Green `#15B743`, Navy `#0051A8`, Error `#E62D21`).
- Don't add to `globals.css` or `tailwind.config.js` for a single feature — scope styles to it.
- Don't add production/backend logic. Lab prototypes produce proof, not production code.

---

## Read next

- [`docs/COLLABORATING.md`](docs/COLLABORATING.md) — plain-English teammate guide (the four verbs)
- [`docs/handoff-checklist.md`](docs/handoff-checklist.md) — graduation criteria
- [`.claude/CLAUDE.md`](.claude/CLAUDE.md) — full AI agent operating manual (components, tokens, workflow)
