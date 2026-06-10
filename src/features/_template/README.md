# Feature template

Don't edit this folder directly. Create your own feature instead:

```bash
npm run create-feature <name>        # e.g. npm run create-feature attend-flow
# optionally pass your GitHub handle as the owner:
npm run create-feature attend-flow my-github-username
```

That copies this template to `src/features/<name>/`, wires it into the sidebar,
and makes it live at `/lab/<name>`.

## What you get

```
src/features/<name>/
  feature.config.ts   ← where it shows up in the nav (group, label, icon)
  index.tsx           ← your prototype (start here)
```

## The loop

1. `npm run dev` → open `http://localhost:3000/lab/<name>`
2. Build inside your folder, reusing components from `@/components/ui/*`
3. Ship it (opens a PR + preview URL) — ask Claude: **"ship my feature"**

See `docs/COLLABORATING.md` for the full guide.

## ⚠️ Prototypes are React (`.tsx`), not raw HTML

`index.tsx` must be a React component — `"use client"` at the top and a
`export default function ...` that returns JSX. The route loads that default
export and renders it.

**Do not paste a raw `<!DOCTYPE html>` document into `index.tsx`.** It won't
compile as TSX and it breaks the build (and the deploy) for everyone.

If you've sketched an idea in plain HTML, that's fine as a starting point — ask
Claude: **"convert my HTML prototype to React"** and it'll port it into proper
`.tsx` components that reuse `@/components/ui/*`. That React version is what
ships; the design-system reuse is the whole point.
