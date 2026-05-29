# UI Fix Skill

## Description
Standardized phased workflow for UI fixes, preventing premature implementation and ensuring clean compilation.

## Invocation
`/ui-fix "<description of the UI issue>"`

## Workflow

Execute these phases sequentially. Do NOT skip phases or combine them.

### Phase 1: Discovery
Search for existing patterns relevant to the fix. Always check these before implementing:

**Layout patterns:**
- `src/components/layouts/AppShell.tsx` - Main layout with ResizablePanelGroup
- `src/components/layouts/AppShellProvider.tsx` - Global right panel state management
- `src/components/layouts/AppHeader.tsx` - Mobile detection + sidebar toggle
- `src/components/layouts/AppSidebar.tsx` - Sheet-based mobile sidebar

**Responsive hooks:**
- `src/hooks/use-mobile.ts` - `useIsMobile()` (768px), `useIsTablet()` (1024px), `useViewportSize()`

**Form patterns:**
- `src/components/events/forms/` - Composable form system with EventFormContext
- `src/components/events/SessionPanel.tsx` - Sticky header + scrollable form
- `src/components/events/SessionEditDrawer.tsx` - Sheet with inline mode support

**Overlay patterns:**
- `src/components/ui/sheet.tsx` - Sheet component (auto-renders close button in SheetContent)
- `src/components/ui/dialog.tsx` - Radix dialog, center-screen modal, max-w-lg
- `src/components/events/AddSessionModal.tsx` - Dialog with SessionForm

**UI conventions:**
- Button order: Cancel (left), Confirm (right), right-aligned
- Form labels: `text-gray-700`, primary text: `text-gray-900`
- Single-column vertical layout for form sections
- ConfirmationDialog component for destructive actions

Use Grep and Glob to find additional patterns relevant to the specific fix. Report what you found.

### Phase 2: Approval
Present findings to the user:
1. What existing patterns are relevant
2. What specific changes you propose
3. Which files will be modified

Wait for user approval before proceeding. Use AskUserQuestion if the approach has multiple valid options.

### Phase 3: Implementation
Make the changes. Follow existing patterns found in Phase 1. Keep changes minimal and focused.

### Phase 4: Verification
Run TypeScript compilation check:
```bash
bunx tsc --noEmit 2>&1 | head -50
```
If there are type errors in files you modified, fix them before proceeding.

### Phase 5: Summary
Report what changed:
- Files modified (with line numbers of key changes)
- Patterns followed
- Any remaining issues or follow-up work needed
