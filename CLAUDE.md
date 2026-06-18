# Wordly Prototype - Project Instructions

## Project Context

Wordly is a translation platform prototype (design exploration, not production). The production app is Journey. This is a Next.js 15 App Router application with React 18, TypeScript, Tailwind CSS, and ShadCN/ui components.

## Key Documentation

- `docs/architecture.md` - System architecture, directory structure, data flow
- `docs/decision.md` - Architectural decision log
- `docs/frontend-architecture.md` - **Legacy vs rebrand chrome**: the two interchangeable frontends, `?chrome=` URL switching, and how to add screens
- `docs/feature.json` - Feature tracker with completion criteria
- `src/documentation/` - Feature specs and gap analyses
- `docs/COLLABORATING.md` - Human guide for prototype creators (the four verbs)

## Wordly Lab — Collaboration Architecture (READ THIS)

This repo is a **shared prototyping app**. Multiple people (mostly non-technical,
driving Claude Code) build prototypes here. Each prototype is a **feature module**
that plugs into the app with **zero edits to shared files**, so contributors never
collide. As the agent, you own the Git/build/deploy mechanics for them.

### Feature modules

- One folder per prototype: `src/features/<name>/` — `<name>` is **semantic** (what
  it is, e.g. `attendee-highlights`), **never a person's name**.
- Required files: `feature.config.ts` (the contract) + `index.tsx` (`"use client"`,
  default-exports the root component). Build everything else inside that folder.
- `src/features/_template/` is the starter. Do not build in it.

### The contract — `feature.config.ts`

```ts
{
  id: "attendee-highlights",      // == folder name; route becomes /lab/<id>
  title: "Attendee Highlights",
  owner: "github-handle",          // ownership metadata (not the folder name)
  stage: "draft",
  chrome: "portal" | "standalone", // see below (default "portal")
  nav: { group: "main"|"workspace"|"organization", label, icon, order }
}
```

- **`chrome: "portal"`** → renders inside the dashboard shell (sidebar + header).
  Use for admin/portal features (Events, settings, etc.).
- **`chrome: "standalone"`** → full-screen, no shell. Use for **attendee/public
  end-user experiences**. It still gets a sidebar entry (the portal → experience
  launch point); the feature must provide its own "← Portal" link back to `/dashboard`.
  Decide by asking: _is this the admin portal, or an end-user/attendee experience?_

### How registration works (don't hand-wire it)

- `npm run create-feature <name> [github-owner]` scaffolds a feature from the template.
- A codegen step (`npm run generate:features`, auto-run on `predev`/`prebuild`) scans
  `src/features/*` and rewrites `src/shell/feature-registry.generated.ts`. That powers
  the sidebar (`nav-registry.ts` → `nav-workspace.tsx`) and the single catch-all route
  `src/app/lab/[feature]/page.tsx`. **Adding a feature touches no shared file.**
- Never hand-edit `feature-registry.generated.ts`; regenerate it (resolves any conflict).

### Rules for the agent

- **Extend, don't edit.** Stay inside the contributor's `src/features/<name>/` folder.
  `src/shell/`, `src/components/`, `packages/`, layout, and globals are owner-gated
  (`.github/CODEOWNERS` → @deacon-poon). If a change there is truly needed, flag it —
  it will require Deacon's review.
- Reuse atoms from `@/components/ui/*` to match the product look (the reusability goal).
- Use the project's brand tokens (`primary-blue-*`, `accent-green-*`, `action-teal-*`).
- Never add to `globals.css` or `tailwind.config.js` for a single feature; scope styles
  to the feature (Tailwind utilities or a `*.module.css`).

### Shipping

- Use `/ship` (see `.claude/commands/ship.md`): commit on a `feat/<person>-<feature>`
  branch, push, open/update a PR into `main`. Vercel's Git integration auto-builds a
  **preview deployment and posts the URL on the PR** — relay that URL back in chat.
- Use `/new-feature <name>` (see `.claude/commands/new-feature.md`) to start one.

## Workflow

### Periodic Review

- Run `/insights` periodically to analyze session patterns and identify friction points
- Review generated reports and incorporate improvement tips here

### Context Loading

- Use Context7 MCP (`resolve-library-id` + `query-docs`) to fetch latest docs for unfamiliar libraries before implementation
- Always check `docs/feature.json` for current feature status before starting work

### Multi-Agent Tasks

- When using parallel agents / Task tool, set clear completion criteria
- Do NOT poll task lists indefinitely - if a subtask hasn't responded after 3 checks, flag it and move on
- Prefer git worktrees over branches for parallel agent isolation

### Browser Testing

- Use Playwright MCP for runtime verification of UI changes
- Verify visual output after significant UI modifications
- Check console errors and DOM state, not just screenshots

### Predictive Analysis

- After implementing features, predict where the app could fail before testing
- Pattern-match against common failure modes (null states, race conditions, edge cases)
- This catches issues that automated tests miss

## Development Standards

### TypeScript

- Strict mode is enabled as a quality signal, not a deployment gate (this is a prototype)
- Fix type errors when practical - prioritize forward progress over zero-error builds
- Prefer proper fixes over `as any` or `@ts-ignore`, but don't block on pre-existing errors in unrelated files
- The PostToolUse hook runs `tsc --noEmit` as non-blocking feedback after edits

### Testing (TDD)

- Write tests FIRST, then implement
- Test files are PROTECTED by hooks - do not modify tests to make them pass
- Fix the implementation to satisfy the tests

### UI Patterns

- Single-column vertical layout for form sections
- Confirmation dialogs use ConfirmationDialog component (not browser `confirm()`)
- Button order: Cancel (left), Confirm (right), right-aligned
- Use `text-gray-700` for form labels, `text-gray-900` for primary text

### Key Layout Architecture

- **AppShell** (`src/components/layouts/AppShell.tsx`) - Main layout: collapsible sidebar (240px) + ResizablePanelGroup for content/right-panel split (60%/40% default, 45% min)
- **AppShellProvider** (`src/components/layouts/AppShellProvider.tsx`) - Global right panel state via React Context (open/close/title/content)
- **AppHeader** (`src/components/layouts/AppHeader.tsx`) - Mobile sidebar toggle with `useIsMobile()`
- **AppSidebar** (`src/components/layouts/AppSidebar.tsx`) - Sheet-based mobile sidebar

### Responsive Hooks

- `useIsMobile()` - 768px breakpoint (`src/hooks/use-mobile.ts`)
- `useIsTablet()` - 1024px breakpoint (`src/hooks/use-mobile.ts`)
- `useViewportSize()` - Returns `{width, height}` with resize listener

### Form Component System

- **EventFormContext** - Composable form system in `src/components/events/forms/`
- **SessionPanel** (`src/components/events/SessionPanel.tsx`) - Sticky header + scrollable form content
- **SessionEditDrawer** (`src/components/events/SessionEditDrawer.tsx`) - Sheet component with inline mode support

### Overlay Patterns

- **Sheet** (`src/components/ui/sheet.tsx`) - Side panel overlay; SheetContent auto-renders close button
- **Dialog** (`src/components/ui/dialog.tsx`) - Center-screen modal via Radix, `max-w-lg` with full width base
- **AddSessionModal** (`src/components/events/AddSessionModal.tsx`) - Dialog wrapping SessionForm

### Event Detail Page Responsive Behavior

- **Desktop**: Side-by-side ResizablePanels (content + session panel)
- **Tablet**: Session panel as 65% width overlay with backdrop (click backdrop to close)
- **Mobile**: Session panel covers entire screen, no backdrop

## Session Workflow

### UI Fix Workflow

Use `/ui-fix "<description>"` for standardized phased UI fixes:

1. Discovery - search existing patterns before changing anything
2. Approval - present findings, wait for confirmation
3. Implementation - make minimal, focused changes
4. Verification - run `tsc --noEmit` to verify clean compilation
5. Summary - report changes and remaining work

### Session Completion Checklist

Before ending any session, verify:

- [ ] Changes compile cleanly (`bunx tsc --noEmit`)
- [ ] Uncommitted changes are either committed or noted
- [ ] Summary of what changed and any follow-up work is communicated
