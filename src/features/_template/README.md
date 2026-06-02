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
