# Wordly Lab — AI Context

> A protected space for fast, executive-free product experimentation.
> Design, build, iterate, validate. Repeat.

## Who uses this repo
- **Deacon** — Frontend Designer. Builds and polishes in code.
- **Justin** — Product Manager. Defines the prototype question and graduation criteria.
- **Graham** — Experience Designer. Frames what's being tested, owns validation.

## Repo structure

```
wordly-prototype/
├── apps/                   ← one folder per prototype
│   ├── _template/          ← scaffold for new prototypes
│   ├── justin-prototype/   ← Justin's HTML prototype
│   └── [your-app]/         ← future prototypes
├── packages/
│   ├── ui/                 ← @wordly/ui — ALL shared components live here
│   ├── tokens/             ← @wordly/tokens — design tokens (CSS + JSON)
│   └── config/             ← @wordly/config — shared Tailwind/TS/ESLint
└── .storybook/             ← Storybook → deployed to Vercel (free, public)
```

## Creating a new prototype

```bash
npm run create-app <name>
# e.g. npm run create-app attend
# Scaffolds apps/attend/ from _template/
```

Then build with components from `@wordly/ui`:
```tsx
import { Button, Card, Dialog, Input } from "@wordly/ui"
```

## Component library (@wordly/ui)

Source: `packages/ui/src/components/`
Import: `import { ComponentName } from "@wordly/ui"`

### Available components
- **Layout**: Card, Separator, Resizable, Sheet, Sidebar
- **Inputs**: Button, Input, Textarea, Select, Checkbox, RadioGroup, Switch, Toggle, ToggleGroup
- **Feedback**: Alert, Badge, Progress, Skeleton, Tooltip
- **Overlays**: Dialog, AlertDialog, Popover, HoverCard, DropdownMenu
- **Navigation**: Breadcrumb, Tabs, Command
- **Data**: Table, DataTable, Chart
- **Typography**: Typography (h1–h6, body, label, caption)
- **Forms**: Label, FormLayout
- **Wordly-specific**: SessionJoinModal, SessionJoinButton, SessionControlCenter, BotRemoteControl

### Adding a new component
1. Add the component file to `packages/ui/src/components/`
2. Export it from `packages/ui/src/components/index.ts`
3. Write a Storybook story in `packages/ui/src/components/[name].stories.tsx`
4. Use it in your app via `import { NewComponent } from "@wordly/ui"`

## Design tokens (@wordly/tokens)

Source: `packages/tokens/src/tokens.css` (CSS vars) + `tokens.json` (machine-readable)
Generated from the Wordly Figma design system via `npm run tokens:generate`

### Key color tokens
- **Brand Blue**: `--color-brand-blue-400: #017CFF` (primary CTA)
- **Action Teal**: `--color-action-teal-400: #1BC3E4` (interactive elements)
- **Accent Green**: `--color-accent-green-500: #15B743` (success / positive)
- **Navy**: `--color-brand-blue-600: #0051A8` (headers, emphasis)
- **Error**: `--color-error-500: #E62D21`
- **Gray UI**: use Tailwind gray scale

### Typography
- Font: **Roboto** (variable: `--font-roboto`)
- Scale: 2xs (8px) → 6xl (80px)

### Regenerating tokens
```bash
npm run tokens:generate
# Reads from Figma export, writes to packages/tokens/src/
```

## Storybook

Run locally: `npm run dev:storybook`
Deployed: Vercel (public URL — see Notion Wordly Lab page for link)

Every component in `packages/ui` should have a story.
Stories live at: `packages/ui/src/components/[name].stories.tsx`

## How to add an HTML prototype

1. Put HTML/CSS/JS files in `apps/[name]/public/`
2. `cd apps/[name] && npx serve public`
3. Push to a branch → get a Vercel preview URL

## Deployment

Every push to `main` → Storybook deploys to Vercel
Every PR → Vercel preview URL per app (post link in PR)

## Handoff criteria

A prototype is ready to hand off when:
- [ ] The question it was answering is written down
- [ ] At least one validation signal exists
- [ ] New components are in `packages/ui` with stories
- [ ] A PR is open with `docs/handoff-checklist.md` filled out
- [ ] Engineering contact identified (Grace/React, Javier/Angular, Rob/integration)

See `docs/handoff-checklist.md` for the full checklist.

## What NOT to do
- Don't define components locally inside an app — add them to `packages/ui`
- Don't enable cross-app navigation for usability test prototypes
- Don't add production logic — Lab prototypes produce proof, not production code
