# Wordly Prototype - Architecture Decision Log

Project: wordly-prototype
Started: 2025-05-05
Last Updated: 2026-02-11
Total Commits: ~298

---

## Decision Log

### DEC-001: Next.js 15 with App Router

- **Date**: 2025-05-05 (initial), upgraded 2025-09-24
- **Status**: Accepted
- **Context**: Needed a modern React framework for prototyping Wordly's portal UI. The product requires both server-rendered public pages (e.g., public summary pages) and highly interactive client-side admin interfaces (event management, session panels).
- **Decision**: Use Next.js with the App Router. Started on Next.js 14, upgraded to Next.js 15.5+ in September 2025. React pinned at 18.2.0.
- **Consequences**: App Router provides file-based routing with layouts, server components by default, and route groups (e.g., `(auth)`, `public`). The `"use client"` directive is applied selectively for interactive components. React 18 remains pinned despite Next.js 15 supporting React 19, likely for ecosystem compatibility.

---

### DEC-002: Hybrid State Management (Redux Toolkit + React Context + localStorage)

- **Date**: 2025-05-05 (Redux), evolved through 2026-01
- **Status**: Accepted
- **Context**: The prototype needs multiple layers of state: global app state (sidebar, user), workspace selection, complex event form wizard state, and persistent event data. A single approach would not fit all needs.
- **Decision**: Three-tier state management:
  1. **Redux Toolkit** (`@reduxjs/toolkit` 2.0.1) for global app state -- sidebar collapse state and user/auth data via `src/store/slices/`.
  2. **React Context** for domain-specific state -- `WorkspaceContext` for workspace selection, `EventFormContext` with `useReducer` for the multi-step event creation wizard.
  3. **localStorage** via `src/lib/eventStore.ts` for persisting event/room/session data as a lightweight mock database.
- **Consequences**: Redux handles cross-cutting concerns but is intentionally kept minimal (only 2 slices: sidebar, user). Complex form state uses Context+Reducer, avoiding Redux boilerplate for transient wizard state. localStorage persistence is explicitly documented as a prototype stand-in for API calls. This layered approach keeps each concern isolated but adds cognitive overhead for developers navigating three state mechanisms.

---

### DEC-003: ShadCN/ui + Radix Primitives for Component Library

- **Date**: 2025-05-05 (initial setup)
- **Status**: Accepted
- **Context**: Needed an accessible, customizable component library that could be styled to match Wordly's brand. Pre-built libraries like Material UI were too opinionated; building from scratch was too slow for prototyping.
- **Decision**: Use ShadCN/ui components backed by Radix UI primitives. The project uses 17+ Radix packages (accordion, alert-dialog, avatar, checkbox, dialog, dropdown-menu, hover-card, label, popover, progress, radio-group, select, separator, tabs, toggle, toggle-group, tooltip) plus additional ShadCN patterns (command via cmdk, sheet via vaul, calendar via react-day-picker).
- **Consequences**: Components live in `src/components/ui/` and are fully owned/customizable. Radix provides accessibility out of the box (keyboard navigation, ARIA attributes, focus management). The tradeoff is maintaining a large number of UI primitives in-house rather than relying on a versioned design system package.

---

### DEC-004: Tailwind CSS for Styling

- **Date**: 2025-05-05
- **Status**: Accepted
- **Context**: Needed a styling approach that supports rapid prototyping, is consistent with ShadCN/ui conventions, and allows precise brand customization.
- **Decision**: Tailwind CSS 3.4 with `tailwind-merge`, `clsx`, `class-variance-authority` (CVA), and `tailwindcss-animate`. Extended with `@tailwindcss/container-queries` for responsive component-level layouts.
- **Consequences**: Utility-first approach enables fast iteration. CVA provides type-safe variant definitions for components. Container queries (added Jan 2026) allow components to respond to their container size rather than viewport, critical for the resizable panel layout. No CSS modules or styled-components in the codebase.

---

### DEC-005: WCAG 2.1 AA Color System with Brand Tokens

- **Date**: 2025-05-11 (color system), refined 2025-06-05
- **Status**: Accepted
- **Context**: Wordly's brand uses teal and pink. The UI needed a comprehensive color system that passes WCAG contrast requirements while maintaining brand identity.
- **Decision**: Implemented a custom color system with 10-shade scales (50-900) for each color family (teal, pink/green, gray). Uses `wcag-contrast-utils` for programmatic contrast validation. Applied a 70/20/10 color ratio: 70% neutrals/gray, 20% brand teal/navy, 10% accent green. Pink was replaced with green as the accent color in June 2025. Design tokens defined in `src/lib/design-tokens.ts` with Storybook documentation.
- **Consequences**: All color choices are accessibility-validated. The color system is documented in `src/documentation/color-system.md` and Storybook stories. The 70/20/10 rule provides a consistent visual hierarchy across all pages.

---

### DEC-006: Event Form Architecture (Context + useReducer Wizard)

- **Date**: 2025-12-31 (design sync), implemented through 2026-01
- **Status**: Accepted
- **Context**: Event creation involves a multi-step wizard (details, schedule, review) with complex nested state (event -> rooms -> sessions). React Hook Form was already in the project but the wizard pattern needed coordinated state across steps.
- **Decision**: Built `EventFormContext` using React's `useReducer` with a discriminated union action pattern. The context provides both raw dispatch and convenience methods (`addRoom`, `updateSession`, etc.). Standalone hooks (`useStandaloneRoomForm`, `useStandaloneSessionForm`) support forms used outside the wizard (e.g., the add session modal). Form validation is manual (not react-hook-form) for the wizard; Zod is available but used primarily for API-level validation.
- **Consequences**: The wizard state is fully typed with `EventFormState`, `WizardStep`, and `FormMode` types in `src/components/events/forms/types.ts`. This centralizes all event form logic but means react-hook-form is underutilized for event forms specifically. The December 31 design sync eliminated event-level defaults, simplifying the form to just name, timezone, and account.

---

### DEC-007: Client-Side Mock Data (No Backend)

- **Date**: 2025-05-05
- **Status**: Accepted
- **Context**: This is a design prototype for validating UX flows before production implementation. Building a real backend would slow down iteration.
- **Decision**: All data is mocked client-side. Events persist via localStorage (`src/lib/eventStore.ts`). Accounts, glossaries, languages, timezones, and voice packs are defined as `const` arrays in `src/components/events/forms/types.ts`. Mock workspaces are hardcoded in `WorkspaceContext`. The gap analysis document (`src/documentation/events-gap-analysis.md`) tracks implementation at ~36% of the full spec.
- **Consequences**: Enables rapid UI iteration without API dependencies. The localStorage approach means data survives page refreshes but not across browsers/devices. All mock data files are clearly annotated with comments like "in production, fetched from API." The `eventStore.ts` includes serialize/deserialize helpers anticipating future API migration.

---

### DEC-008: Bulk Schedule Upload (Excel/CSV Parsing)

- **Date**: 2026-01-14
- **Status**: Accepted
- **Context**: Event organizers often have schedules in spreadsheets. Manual session entry is tedious for large events.
- **Decision**: Implemented client-side Excel/CSV parsing using the `xlsx` library. The upload flow: file selection -> parsing via `src/lib/utils/parseSchedule.ts` -> review modal (`BulkUploadReviewModal`) with validation table -> confirmation with option to skip invalid rows -> merge into event state. Evolved from Excel-only to CSV with explicit End Time column support.
- **Consequences**: Parsing runs entirely client-side, keeping the no-backend constraint. The review step provides inline validation with tooltips for errors. Template download (CSV format) guides users toward the expected schema. Multiple debugging iterations (visible in git history) indicate the parsing/review handoff was complex to get right.

---

### DEC-009: Terminology Evolution (Stage -> Location -> Room)

- **Date**: 2025-12 (stage to location), 2026-01-19 (location to room)
- **Status**: Accepted
- **Context**: The concept of "where sessions happen" within an event went through naming iterations as the product team refined the domain model.
- **Decision**: Renamed twice: "Stage" -> "Location" (December 2025 per gap analysis) -> "Room" (January 19, 2026 per UX review). Each rename was a full codebase refactor: component names, variable names, types, and UI labels.
- **Consequences**: The final "Room" terminology aligns with the Wordly portal's actual domain language. Types use `Room`, `RoomFormData`, `roomSessionId`. The `RoomAccordion` component replaced `LocationAccordion` which replaced `StageAccordion`. Historical documentation still references older terms in some places.

---

### DEC-010: Timezone Handling (react-timezone-select + date-fns-tz)

- **Date**: 2026-01-05 (initial), overhauled 2026-02-11
- **Status**: Accepted
- **Context**: Events span timezones. Sessions need timezone-aware display. The January 2026 design sync established that events have a single timezone that sessions inherit by default.
- **Decision**: Use `react-timezone-select` for the timezone picker UI and `date-fns-tz` for timezone conversion logic. `date-fns` (v4) handles general date manipulation. Event-level timezone is stored in `EventDetailsFormData.timezone` and inherited by sessions. The timezone selector underwent a major overhaul on 2026-02-11 for UI consistency.
- **Consequences**: IANA timezone identifiers (e.g., "America/Los_Angeles") are used throughout. A curated list of 20 common timezones is provided in `types.ts` as a quick-select, while the full react-timezone-select picker offers all IANA zones. Dates are parsed as local timezone rather than UTC to avoid off-by-one day errors (fixed 2026-01-06).

---

### DEC-011: Drag-and-Drop with dnd-kit

- **Date**: ~2025-07 (estimated from dependency addition)
- **Status**: Accepted (limited use)
- **Context**: The data table component needed reorderable rows for certain management views.
- **Decision**: Use `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/modifiers`, and `@dnd-kit/utilities` for drag-and-drop interactions.
- **Consequences**: Currently used only in `src/components/data-table.tsx`. The library is installed but not heavily leveraged across the app. A July 2025 commit explicitly removed "weird drag behavior from sidebar," suggesting some experimentation with broader usage that was pulled back.

---

### DEC-012: Resizable Panel Layout

- **Date**: 2025-05-29
- **Status**: Accepted
- **Context**: The event detail page needs a main content area alongside a session edit side panel. The layout should work responsively across desktop and tablet.
- **Decision**: Use `react-resizable-panels` for the AppShell and event detail layouts. Desktop (1028px+) uses side-by-side resizable panels with a 60/40 default split. Mobile/tablet (<1028px) uses an overlay panel mode with proper z-index stacking.
- **Consequences**: The panel can be resized between 25-55% width on desktop. Mobile users get a full-width overlay that doesn't compress the main content. This approach was refined through multiple commits to fix scrolling, sizing, and overlap behavior.

---

### DEC-013: Storybook for Design System Documentation

- **Date**: 2025-05-12
- **Status**: Accepted
- **Context**: Needed a way to document and showcase UI components, design tokens, color palettes, typography, and spacing independently from the application.
- **Decision**: Storybook 7.6 with `@storybook/nextjs` adapter. Stories for accessibility guides, color palettes, design tokens, typography, spacing, mobile guidelines, cross-platform layouts, and form layouts. Separate Vercel deployment for Storybook (`vercel-storybook.json`).
- **Consequences**: Design system documentation lives alongside components as `.stories.tsx` files in `src/components/ui/`. Storybook has its own build pipeline and deployment. The Roboto font (Wordly brand) is configured in both the app and Storybook preview.

---

### DEC-014: Vercel for Deployment

- **Date**: 2025-05-05 (CI/CD setup), refined 2025-06-06
- **Status**: Accepted
- **Context**: Needed hosting for both the Next.js prototype app and the Storybook documentation site.
- **Decision**: Deploy on Vercel with two separate configurations: `vercel.json` for the main Next.js app and `vercel-storybook.json` for Storybook. Vercel Toolbar (`@vercel/toolbar`) integrated for development feedback.
- **Consequences**: Push-to-deploy workflow. The main app auto-detects Next.js settings. Storybook deploys as a static site. Multiple deployment fixes in the git history indicate the dual-deploy setup required iteration.

---

### DEC-015: AI-Powered Event Chatbot

- **Date**: 2025-12-19 (public summary with chatbot)
- **Status**: Accepted
- **Context**: The public summary page for events could benefit from an AI assistant that can answer questions about sessions, speakers, and topics.
- **Decision**: Integrate Vercel AI SDK (`ai` v5, `@ai-sdk/openai`, `@ai-sdk/react`) with a streaming API route at `src/app/api/chat/route.ts`. The chatbot receives event context (session summaries, speaker info) as system prompt and streams responses.
- **Consequences**: This is the only server-side API route in the prototype. The OpenAI integration requires an API key in production. Streaming responses are capped at 30 seconds. The AI SDK was updated from v4 to v5 format (parts array instead of content) in January 2026.

---

### DEC-016: One Account Per Event Policy

- **Date**: 2026-01-27
- **Status**: Accepted
- **Context**: The January 2026 design sync (Graham/Justin) established that billing should be simplified: each event is associated with exactly one account for minutes tracking.
- **Decision**: Added `account` and `totalMinutes` fields to the event data model. `EventDetailsFormData` includes `accountId`. A "Pool of Minutes" concept links accounts to remaining minutes. All sessions in an event share the same account.
- **Consequences**: Simplifies billing UX -- users select an account once at event creation rather than per-session. The `POOL_OF_MINUTES` mock data in `types.ts` simulates account balances. Backward compatibility is handled via defaults in `deserializeEvent()`.

---

### DEC-017: Toast Notifications with Sonner

- **Date**: 2026-01-05
- **Status**: Accepted
- **Context**: User actions (saving events, deleting sessions, bulk upload completion) needed clear feedback.
- **Decision**: Use `sonner` for toast notifications. Configured globally in the root layout with `position="top-right"`, `richColors`, and `closeButton` enabled.
- **Consequences**: Lightweight alternative to building a custom notification system. Sonner provides success, error, and info variants out of the box. Placed outside the Providers wrapper in the layout for maximum availability.

---

### DEC-018: Confirmation Dialogs for Destructive Actions

- **Date**: 2026-01-14 (sessions), 2026-02-11 (rooms)
- **Status**: Accepted
- **Context**: Accidental deletions of sessions and rooms needed prevention. The prototype initially lacked confirmation for destructive actions.
- **Decision**: Created a reusable `ConfirmationDialog` component (`src/components/ui/confirmation-dialog.tsx`) built on Radix AlertDialog. Used for session deletion (Jan 14) and room deletion (Feb 11).
- **Consequences**: Consistent destructive action pattern across the app. The dialog is generic enough to be reused for any confirmation need. Follows the Radix AlertDialog accessibility pattern with proper focus trap and keyboard handling.
