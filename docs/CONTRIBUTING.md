# Contributing to Wordly Lab

## Starting a new prototype

```bash
npm run create-app <name>
cd apps/<name>
npm install
npm run dev
```

## Adding a component to @wordly/ui

1. Create `packages/ui/src/components/[name].tsx`
2. Add export to `packages/ui/src/components/index.ts`
3. Write a story: `packages/ui/src/components/[name].stories.tsx`
4. Import in your app: `import { Name } from "@wordly/ui"`

## Adding an HTML prototype (no React needed)

1. Create `apps/<name>/public/index.html`
2. Add `apps/<name>/package.json` (copy from `apps/justin-prototype/package.json`)
3. Run: `cd apps/<name> && npx serve public`

## Repo structure

```
apps/          ← one folder per prototype
packages/ui/   ← shared components (@wordly/ui)
packages/tokens/ ← design tokens (@wordly/tokens)
packages/config/ ← shared Tailwind/TS config (@wordly/config)
```

## Rules

- Components belong in `packages/ui`, not inside individual apps
- Import from `@wordly/ui`, not from local paths
- Every new component needs a Storybook story
- Cross-app navigation must be disabled in usability test prototypes
- The handoff artifact is a PR, not a Figma link or Loom

## Handoff checklist

See `docs/handoff-checklist.md` before opening a handoff PR.
