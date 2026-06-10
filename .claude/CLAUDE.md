# Wordly Lab — AI Agent Operating Manual

> A protected space for fast product experimentation. **You (the agent) operate
> this repo on behalf of teammates who may not know Git or the command line.**
> They talk to you in plain English; you do all the Git/build/deploy work and
> report a shareable URL back. This file tells you how.

## Who you work for
- **Deacon** — Frontend Designer. Owns the shared UI and is the **sole PR reviewer/merge gate**.
- **Justin** — Product Manager. Defines what a prototype is answering.
- **Graham** — Experience Designer. Owns validation.

The overriding goal is **UI reusability**: every prototype should reuse the
shared component library and feed new reusable pieces back into it (Deacon curates).

---

## Two ways to build (pick the right track)

### Track A — In-app feature module  ← DEFAULT for "a feature in the dashboard"
Prototype a feature **inside the real Wordly dashboard** so it looks native and
lives where it really would. This is the primary collaboration model.

```
src/features/<id>/
  feature.config.ts   ← sidebar placement (group/label/icon) + owner. Pure data.
  index.tsx           ← the prototype UI. THIS is where you build.
```

- Route is automatic: `src/features/<id>/` → **`/lab/<id>`**. Never hand-write routes.
- Sidebar entry is automatic: a generator reads every `feature.config.ts` and
  composes the nav. It runs on `predev`/`prebuild`, or `npm run generate:features`.
- **Reuse dashboard UI from `@/components/ui/*`** (ShadCN/Radix primitives — Button,
  Dialog, Table, Tabs, Select, etc.). Match the product; don't reinvent.

### Track B — Standalone prototype in `apps/*`
For throwaway/rough explorations that should NOT live in the dashboard (incl.
plain HTML). Scaffold with `npm run create-app <name>`. These import from the
**`@wordly/ui`** package (`packages/ui`, 67 components) + `@wordly/tokens`.

> Reuse source differs by track: in-app features use `@/components/ui/*`;
> `apps/*` prototypes use `@wordly/ui`. Don't mix them up.

---

## The four verbs → exact commands

When a teammate uses one of these phrases, run the corresponding sequence. Always
narrate what you did in plain English (no jargon). Branch name is `feat/<owner>-<id>`.

### 1. "start a feature called X" / "create feature X"
```bash
git checkout main && git pull --ff-only
git checkout -b feat/<owner>-<id>
npm run create-feature <id> <owner>      # scaffolds src/features/<id>/, regenerates registry
```
Then tell them the URL it will live at: `/lab/<id>`, and that you'll build in
`src/features/<id>/index.tsx`.

### 2. "save my work"
```bash
git add -A
git commit -m "feat(<id>): <plain summary of what changed>"
```

### 3. "sync" / "get the latest"
```bash
git fetch origin
git rebase origin/main
```
- If `src/shell/feature-registry.generated.ts` conflicts, **don't hand-merge it** —
  run `npm run generate:features` and `git add` it (output is deterministic).
- Resolve other conflicts, then explain in plain terms ("Justin also added a
  sidebar item; I kept both").

### 4. "ship my feature" / "share it"
```bash
git push -u origin feat/<owner>-<id>
gh pr create --fill --base main
```
Then get the preview URL and report it back:
```bash
gh pr view --json url -q .url                       # the PR
# Vercel bot comments the preview URL on the PR within ~1–2 min:
gh pr view --json comments -q '.comments[].body' | grep -oE 'https://[^ ]*vercel.app' | head -1
```
Paste the clickable preview URL into the chat. Tell them **Deacon reviews and merges**.

---

## Guardrails — protect beginners and the shared UI

**Extend, don't edit.** Build only inside `src/features/<id>/`. These paths are
**owner-gated** (`.github/CODEOWNERS` → `@deacon-poon`) — do NOT modify them on a
teammate's feature branch; importing/reading from them is fine:

```
/src/shell/   /src/components/   /src/store/   /src/contexts/
/src/app/layout.tsx   /src/app/globals.css   /src/app/lab/
/packages/   /scripts/   /.github/
```

**Prototypes are React, never raw HTML.** `src/features/<id>/index.tsx` MUST be a
React module — `"use client"` + a default-exported component returning JSX. The
route renders that default export, so a raw `<!DOCTYPE html>` document pasted into
`index.tsx` does not compile and **breaks the build/deploy for everyone**. If a
teammate hands you an HTML sketch (or you find one as `index.tsx`), port it into
proper `.tsx` reusing `@/components/ui/*` — don't iframe it long-term. (A static
`public/*.html` + iframe wrapper is an acceptable *temporary* bridge to unbreak a
deploy, but flag it as debt: the real version is native React.)

- Need a shared component changed or added? **Don't fork it.** Build it locally in
  the feature first, then flag it for Deacon to promote into the shared library so
  everyone benefits. That promotion is the reusability flywheel — surface it, never
  bypass it.
- Don't hardcode hex colors — use the design tokens / Tailwind classes.
- Don't add production/backend logic. Lab prototypes produce proof, not production code.

---

## Reusable UI reference

**Dashboard (Track A)** — `@/components/ui/*` (ShadCN/Radix): Button, Input, Textarea,
Select, Checkbox, RadioGroup, Switch, Toggle, Card, Separator, Sheet, Sidebar, Dialog,
AlertDialog, Popover, HoverCard, DropdownMenu, Tooltip, Alert, Badge, Progress, Skeleton,
Breadcrumb, Tabs, Command, Table, DataTable, Chart, Typography, Label.

**Design tokens** — Roboto font; brand colors as CSS vars / Tailwind classes:
Brand Blue `#017CFF` (primary CTA), Action Teal `#1BC3E4`, Accent Green `#15B743`
(success), Navy `#0051A8`, Error `#E62D21`. Regenerate from Figma: `npm run tokens:generate`.

**`apps/*` prototypes (Track B)** — import the same families from `@wordly/ui`.

---

## Run / preview
```bash
npm run dev          # http://localhost:3000  → open /lab/<id> for an in-app feature
npm run dev:storybook   # localhost:6006 — component library showcase
```

## More docs
- `docs/COLLABORATING.md` — the human-facing teammate guide (plain English).
- `docs/handoff-checklist.md` — criteria to graduate a prototype to engineering.
- `src/features/_template/` — the scaffold `create-feature` copies from.
