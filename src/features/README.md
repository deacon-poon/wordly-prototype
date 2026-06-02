# `src/features/` — In-app prototype features

Each folder here is one prototype that renders **inside the real Wordly dashboard**
(sidebar + header), so it looks and behaves like a native part of the product.
You build only in your own folder; everything else is wired up for you.

> **Non-technical?** You don't run any of these commands yourself. Tell Claude
> Code what you want in plain English — it does the Git, build, and deploy work.
> See [`docs/COLLABORATING.md`](../../docs/COLLABORATING.md) for the four verbs.
> Agents: your full operating manual is [`.claude/CLAUDE.md`](../../.claude/CLAUDE.md).

## Anatomy of a feature

```
src/features/<id>/
  feature.config.ts   ← where it appears in the sidebar (group / label / icon) + owner
  index.tsx           ← your prototype UI — this is where you build
```

- **URL is automatic:** `src/features/<id>/` → `/lab/<id>`. You never write routes.
- **Sidebar is automatic:** a generator reads every `feature.config.ts` and composes
  the nav (`npm run generate:features`, also run on `dev`/`build`). You only edit your
  own `feature.config.ts` — never the shared sidebar.

## Create one

```bash
npm run create-feature <id> <github-owner>     # e.g. attend-flow justincepelak
```

Copies `_template/` → `src/features/<id>/`, fills in id/title/owner, and regenerates
the registry. Then build in `src/features/<id>/index.tsx` and preview with
`npm run dev` → `http://localhost:3000/lab/<id>`.

## The one rule: extend, don't edit

Add files **inside your own feature folder**. Reuse shared UI by importing from
`@/components/ui/*` — but never modify shared files (the shell, the design system,
the registry). Those are owner-gated to Deacon via [`.github/CODEOWNERS`](../../.github/CODEOWNERS);
that's what keeps everyone conflict-free. Need a shared component added or changed?
Ask Deacon — he promotes reusable pieces into the shared library so everyone benefits.

## `feature.config.ts` fields

| Field | What it does |
|-------|--------------|
| `id` | URL slug + folder name → `/lab/<id>` (kebab-case) |
| `title` | Page header + default sidebar label |
| `owner` | Your GitHub handle (who owns this folder) |
| `nav.group` | `main` / `workspace` / `organization` — which sidebar section |
| `nav.label` | Sidebar text |
| `nav.icon` | A [lucide.dev](https://lucide.dev/icons) icon name, PascalCase (e.g. `Sparkles`) |
| `nav.order` | Ordering within the group (lower = higher; default 100) |

> `_template/` is the scaffold — don't build in it directly; it's the source
> `create-feature` copies from.
