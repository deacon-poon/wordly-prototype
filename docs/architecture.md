# Wordly Prototype - Architecture

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 3.4 + CSS custom properties (design tokens from Figma) |
| UI Components | Radix UI primitives + ShadCN/ui pattern (`src/components/ui/`) |
| State Management | Redux Toolkit (sidebar, user) + React Context (workspace, app shell) + localStorage (events) |
| Forms | react-hook-form + @hookform/resolvers + Zod |
| Tables | @tanstack/react-table |
| Drag & Drop | @dnd-kit |
| Date Handling | date-fns + date-fns-tz + react-day-picker |
| AI Integration | Vercel AI SDK (@ai-sdk/openai, @ai-sdk/react) |
| Charts | Recharts |
| Icons | Lucide React + Radix Icons |
| Notifications | Sonner (toast) |
| Storybook | v7.6 (dev documentation for UI components) |
| Deployment | Vercel |

## Directory Structure

```
src/
├── app/                    # Next.js App Router pages and layouts
│   ├── (auth)/             # Auth route group (login) - no AppShell
│   ├── api/chat/           # AI chat API route (OpenAI streaming)
│   ├── dashboard/          # Dashboard with charts
│   ├── events/             # Event list + [eventId] detail pages
│   ├── glossaries/         # Glossary management
│   ├── history/            # Session history
│   ├── organization/       # Org settings (billing, users, custom-fields)
│   ├── public/             # Public-facing pages (no AppShell) - [eventSlug] with sessions/transcripts
│   ├── sessions/           # Session list + [sessionId] detail
│   ├── transcripts/        # Transcript management
│   ├── workspace/          # Workspace settings (defaults, users, custom-fields)
│   ├── layout.tsx          # Root layout: Providers > AppShellProvider > children + Toaster
│   ├── globals.css         # Tailwind + Figma design tokens import
│   └── page.tsx            # Landing page (unauthenticated)
│
├── components/
│   ├── ui/                 # ~60 ShadCN-style primitives (button, dialog, select, tabs, sidebar, etc.)
│   │                       # Barrel-exported via index.ts. Includes domain-specific UI like
│   │                       # session-join-modal, bot-remote-control, datetime-picker, confirmation-dialog
│   ├── events/             # Event domain components (modals, drawers, panels)
│   │   └── forms/          # Composable form system: EventDetailsForm, RoomForm, SessionForm,
│   │                       # ScheduleBuilder + shared types, context, and constants
│   ├── layouts/            # AppShell (sidebar+header+resizable panels), AppShellProvider (context),
│   │                       # AppSidebar, AppHeader, SessionsLayout
│   ├── dashboard/          # Chart components (activity, minutes usage, sessions bar, progress)
│   ├── transcripts/        # Transcript editor, detail view, list panel, workspace
│   ├── billing/            # Billing selection and layout components
│   ├── workspace/          # Workspace card header, invite users dialog
│   ├── public/             # EventChatbot (AI-powered event Q&A)
│   ├── stories/            # Storybook stories (atoms/, organisms/, pages/)
│   └── [top-level]         # Shared components: app-header, app-sidebar, nav-*, QrCode,
│                           # WaysToJoinModal, data-table, team-switcher, etc.
│
├── store/                  # Redux Toolkit store
│   ├── index.ts            # configureStore with sidebar + user reducers
│   ├── providers.tsx       # <Provider> + <WorkspaceProvider> wrapper
│   └── slices/             # sidebarSlice, userSlice (active), authSlice, sessionSlice,
│                           # glossarySlice, transcriptSlice (defined but not wired to store)
│
├── contexts/
│   └── workspace-context.tsx  # React Context for active workspace selection (mock data)
│
├── hooks/
│   ├── use-mobile.ts       # useIsMobile(), useIsTablet(), useViewportSize() - window resize listeners
│   └── use-redux.ts        # useAppDispatch, useAppSelector typed hooks
│
├── lib/
│   ├── utils.ts            # cn() (clsx+twMerge), formatDate(), truncateText()
│   ├── eventStore.ts       # localStorage CRUD for events (getStoredEvents, saveEvent, deleteEvent,
│   │                       # serializeEvent, deserializeEvent) - prototype persistence layer
│   ├── design-tokens.ts    # Figma-extracted color tokens, typography, spacing as TS objects
│   ├── colors.ts           # Extended color system utilities
│   ├── accessible-colors.ts # WCAG contrast utilities
│   ├── color-combinations.ts / color-exploration.ts  # Color palette tooling
│   ├── fonts.ts            # Font configuration
│   └── utils/              # parseSchedule.ts, colors.ts
│
├── styles/generated/       # Auto-generated from Figma: figma-tokens.css, figma-tailwind.js,
│                           # figma-variable-map.json (via `npm run tokens:generate`)
│
├── mock/                   # Mock data files (e.g., Bulk Sessions.csv)
├── documentation/          # Domain docs: wordly-event.md, wordly-transcript.md, wordly-endpoints.md,
│                           # wordly-workspaces.md, color-system.md, events-gap-analysis.md, etc.
├── services/               # Empty - reserved for future API service layer
├── types/                  # Empty - types are co-located in components/forms/types.ts and slices
└── utils/                  # Empty - utilities are in lib/utils.ts
```

## Data Flow

### State Management Layers

1. **Redux Toolkit** (`src/store/`) - Global app state
   - `sidebarSlice`: sidebar collapsed state (used by AppShell)
   - `userSlice`: user plan info and activity (plan name, available/scheduled time)
   - Additional slices exist (auth, session, glossary, transcript) but are **not wired** to the store yet

2. **React Context** - Scoped shared state
   - `WorkspaceContext`: active workspace name + workspace list (mock data)
   - `AppShellContext` (in AppShellProvider): right panel open/close state, content, title
   - `EventFormContext` (in `components/events/forms/`): multi-step form state for event creation/editing

3. **localStorage** (`src/lib/eventStore.ts`) - Prototype persistence
   - Events are stored in `localStorage` under key `wordly_events`
   - CRUD operations: `getStoredEvents()`, `saveEvent()`, `deleteEvent()`
   - Serialization handles Date <-> ISO string conversion
   - **This is a prototype pattern** - production would use API calls

4. **Component State** (`useState`) - Most domain data lives here
   - Event list page initializes mock data in `useState` with hardcoded events
   - Event detail page reads from localStorage, manages rooms/sessions in local state
   - Forms use react-hook-form's internal state

### Data Flow Pattern
```
Page Component (useState with mock data)
  -> localStorage (eventStore.ts) for cross-page persistence
  -> Child components receive data via props
  -> Forms use react-hook-form + EventFormContext
  -> Redux only for global UI state (sidebar, user plan)
  -> Contexts for scoped shared state (workspace, app shell panels)
```

## Key Patterns

### Component Architecture
- **AppShell Pattern**: Root layout wraps everything in `Providers` (Redux + Workspace) then `AppShellProvider` which conditionally renders the shell (sidebar, header, resizable panels) based on route. Auth and public routes skip the shell.
- **Barrel Exports**: `components/ui/index.ts` exports all ~45 UI primitives. `components/events/forms/index.ts` exports all form components and types.
- **Domain Components**: Organized by feature domain (events/, transcripts/, dashboard/, billing/).
- **Modal/Drawer Pattern**: Complex operations use modal dialogs (AddRoomModal, AddSessionModal, EventSettingsModal) or slide-out drawers (SessionEditDrawer, PresentationEditDrawer).

### Form Handling
- **react-hook-form** for form state management with Zod validation
- **Composable Form System** in `components/events/forms/`:
  - `types.ts` - All shared types, defaults, constants (languages, timezones, accounts, glossaries)
  - `EventFormContext.tsx` - Context provider with `useEventForm()`, `useStandaloneRoomForm()`, `useStandaloneSessionForm()`
  - Individual form components: `EventDetailsForm`, `RoomForm`, `SessionForm`, `ScheduleBuilder`
  - Wizard flow support via `WizardStep` type: "details" -> "schedule" -> "review"

### Styling Conventions
- **Tailwind utility classes** as primary styling method
- **Figma design tokens** auto-generated to CSS custom properties (`globals.css` imports `figma-tokens.css`)
- **Brand color system** (2026 rebrand):
  - Primary: Brand Blue 500 (`#0063CC`) - `primary-blue-*` classes
  - Secondary: Accent Green 500 (`#15B743`) - `accent-green-*` classes
  - Action: Teal 600 (`#128197`) - `action-teal-*` classes, `primary-teal-*` legacy alias
- **`cn()` utility** (clsx + tailwind-merge) used throughout for conditional class merging
- **No dark mode active** (darkMode: ["class"] configured but not implemented)
- **Roboto** as primary font family

### Toast Notifications
- Sonner `<Toaster>` mounted in root layout, positioned top-right with rich colors
- Used via `toast.success()`, `toast.error()` from `sonner` package

### Responsive Design
- `useViewportSize()` hook for viewport-aware rendering
- AppShell collapses sidebar on mobile (< 1028px breakpoint)
- `useIsMobile()` (< 768px), `useIsTablet()` (480-768px) hooks available
- Resizable panels via `react-resizable-panels` for desktop layouts

## API Layer

### Current State (Prototype)
- **No backend API** - all data is mock/hardcoded or localStorage
- **Single API route**: `src/app/api/chat/route.ts` - OpenAI-powered streaming chat for event Q&A
- **Mock data** is inline in page components (events page has ~10 hardcoded events)
- **Mock constants** in `components/events/forms/types.ts`: ACCOUNTS, GLOSSARIES, LANGUAGES, TIMEZONES, POOL_OF_MINUTES

### AI Integration
- Vercel AI SDK (`ai` + `@ai-sdk/openai` + `@ai-sdk/react`)
- Used for public event chatbot: streams responses about event sessions
- Model: `gpt-4o-mini` via OpenAI provider

### Future Service Layer
- `src/services/` directory exists but is empty
- `src/documentation/wordly-endpoints.md` contains API endpoint documentation for future integration
- Production would replace localStorage with API calls via services

## Routing

### Route Structure
| Route | Purpose |
|-------|---------|
| `/` | Landing page (no AppShell) |
| `/login` | Auth login page (route group `(auth)`, no AppShell) |
| `/dashboard` | Main dashboard with charts and stats |
| `/events` | Event list with status tabs (Today/Future/Past/All) |
| `/events/[eventId]` | Event detail - rooms, sessions, settings |
| `/sessions` | Session management list |
| `/sessions/[sessionId]` | Session detail page |
| `/transcripts` | Transcript list (has own layout) |
| `/glossaries` | Glossary management |
| `/history` | Session history |
| `/organization/billing` | Org-level billing |
| `/organization/users` | Org-level user management |
| `/organization/custom-fields` | Org custom fields (shared layout) |
| `/workspace/defaults` | Workspace default settings |
| `/workspace/users` | Workspace user management |
| `/workspace/custom-fields` | Workspace custom fields (shared layout) |
| `/public/[eventSlug]` | Public event page (no AppShell) |
| `/public/[eventSlug]/session/[sessionId]` | Public session view |
| `/public/[eventSlug]/transcript/[sessionId]` | Public transcript view |
| `/api/chat` | AI chat streaming endpoint |

### Layout Hierarchy
```
RootLayout (Providers + AppShellProvider + Toaster)
├── AppShell (sidebar + header + resizable panels) - most routes
├── (auth)/layout.tsx - auth pages, no shell
├── public/layout.tsx - public pages, no shell
├── organization/layout.tsx - org settings shared layout
├── workspace/layout.tsx - workspace settings shared layout
└── transcripts/layout.tsx - transcript-specific layout
```

### Navigation
- **Sidebar** (`AppSidebar`): Primary navigation, collapsible, workspace switcher at top
- **Breadcrumbs**: Available via `ui/breadcrumb.tsx` component
- **Router**: `useRouter()` from `next/navigation` for programmatic navigation
- **Page titles**: Derived from pathname in `AppShellProvider.getPageTitle()`
