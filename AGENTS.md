# Agent guide

This repo is the **Wordly Lab** shared prototyping app. If you are an agent working
here, read **`CLAUDE.md`** first — specifically the "Wordly Lab — Collaboration
Architecture" section. It explains how prototypes are built as self-contained feature
modules under `src/features/<name>/`, the `feature.config.ts` contract (including the
`chrome: portal | standalone` choice), how features auto-register into the nav and the
`/lab/<name>` route, and the "extend, don't edit" rule for shared, owner-gated code.

Commands:
- `/new-feature <name>` — scaffold a new prototype (see `.claude/commands/new-feature.md`)
- `/ship` — commit, push, open a PR, and surface the Vercel preview URL (`.claude/commands/ship.md`)

Human-facing guide: `docs/COLLABORATING.md`.
