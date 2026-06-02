# Collaborating on Wordly Lab

This repo lets you **prototype a feature directly inside the Wordly app** — so it
looks and behaves like a native part of the product, in the place it would really
live. You build in your own folder; Claude handles all the Git work.

> You don't need to know Git or the command line. You drive Claude Code in plain
> English. The verbs below are all you need.

---

## How it works

Every prototype is a **feature module** — one self-contained folder under
`src/features/`. It plugs into the real sidebar and gets its own URL automatically.

```
src/features/<your-feature>/
  feature.config.ts   ← where it appears in the sidebar (group, label, icon)
  index.tsx           ← your prototype (this is where you build)
```

The golden rule that keeps everyone conflict-free:

> **Extend, don't edit.** Add files inside your own feature folder. Never change
> files outside it. Shared things (the shell, the design system) are Deacon's to
> change — ask him.

---

## Start a feature

Tell Claude:

> **"Create a new feature called attend-flow"**

(or run `npm run create-feature attend-flow your-github-handle`)

You'll get `src/features/attend-flow/`, it'll show up in the sidebar, and it's
live at `http://localhost:3000/lab/attend-flow`.

## Build it

- Edit `src/features/<name>/index.tsx`.
- Reuse existing UI: buttons, dialogs, tables, etc. live in `@/components/ui/*`.
- Set where it shows up in the sidebar by editing `feature.config.ts`
  (`group`: `main` / `workspace` / `organization`, plus `label` and `icon`).
- Preview locally: `npm run dev`, then open `/lab/<name>`.

## The four verbs (just ask Claude)

| Say this | Claude does |
|----------|-------------|
| **"start a feature called X"** | scaffolds `src/features/X/` and wires it in |
| **"save my work"** | commits your changes on a `feat/<you>-<feature>` branch |
| **"sync"** | pulls the latest app, rebases your branch, resolves any conflicts |
| **"ship my feature"** | pushes and opens a PR; you get a Vercel preview URL to share |

## Review & deploy

- Opening a PR triggers a **Vercel preview deployment** of the whole app — one shared
  project, no per-person setup. Your prototype is live at **`<preview-url>/lab/<name>`**,
  a shareable link. CI also runs lint + build (on bun) as a sanity check.
- **Deacon reviews and merges.** Anything that touches shared files
  (`src/shell/`, `src/components/`, `packages/`) needs his sign-off — that's
  enforced automatically via `CODEOWNERS`.

---

## FAQ

**Where does my feature's URL come from?** Automatically: `src/features/<name>/`
→ `/lab/<name>`. You don't create routes.

**How does it appear in the sidebar without me editing the sidebar?** A small
generator (`npm run generate:features`, run automatically on `dev`/`build`)
reads every feature folder and composes the nav. You only edit your own
`feature.config.ts`.

**I need a shared component changed / a new one added.** Ask Deacon — he owns the
shared design system and will promote reusable pieces so everyone benefits.
