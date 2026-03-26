# Lazy Loading with "Show More" — Events, Rooms & Sessions

> **Status:** Draft for review
> **Date:** 2026-03-24 (updated)
> **Context:** [Slack thread — Sebastian, Javier, Justin, Graham]
> **Decision:** Cache + lazy load first 50 items, then "Show More" button to load next batch (product decision 2026-03-24). Backed by paginated DTOs.

---

## 1. Problem Statement

The current Events UI loads full collections with no pagination. As events, rooms, and sessions grow, this creates:

- **Performance risk** — unbounded payloads for events with hundreds of rooms/sessions
- **Missing UX** — no design for progressive loading, loading states, or scroll-triggered fetches
- **"Add Session" placement** — currently pinned to the bottom of the list, unreachable when lists grow long
- **Filter/grouping ambiguity** — unclear whether Now/Upcoming/Past/All filters are client-side or server-side

### Four levels need "Show More" (confirmed by Graham, 2026-03-24)

| Level | Container | Initial Load | "Show More" |
|-------|-----------|-------------|-------------|
| **Events list** (`/events`) | Main page | First 50 events | Load 50 more |
| **Days per event** (`/events/[id]`) | Main content | First 50 days | Load 50 more |
| **Rooms per day** (`/events/[id]`) | Day accordion | First 50 rooms | Load 50 more |
| **Sessions per room** (`/events/[id]`) | Room accordion | First 50 sessions | Load 50 more |

---

## 2. Design Principles

1. **No nested scrollbars** — main content has one scroll; accordions push content down (Javier's recommendation)
2. **Lazy load on expand** — rooms load when day accordion opens; sessions load when room accordion opens
3. **Cache first 50, then "Show More"** — initial load returns up to 50 items per level. If more exist, a "Show More" button appears at the bottom to load the next 50 (not automatic scroll-triggered)
4. **Server-side filtering** — Now/Upcoming/Past/All triggers a new API request with `period` enum, not client-side filtering
5. **Consistent with platform** — uses paginated DTOs like existing endpoints (e.g., `pendingOnly` on `/presentations`)
6. **"Add" actions stay accessible** — "Add Session" button is always placed above the "Show More" button so users never have to load all items just to add a new one

---

## 3. API Contract

### 3.1 Events List

```
GET /events?period={now|upcoming|past|all}&cursor={string}&limit={number}
```

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `period` | enum | `all` | Time filter: `now` (today), `upcoming`, `past`, `all` |
| `cursor` | string | — | Opaque cursor from previous response |
| `limit` | number | 20 | Page size |

**Response:**
```json
{
  "items": [Event],
  "nextCursor": "string | null",
  "total": 142
}
```

### 3.2 Rooms by Event + Day

```
GET /events/{eventId}/rooms?day={YYYY-MM-DD}&cursor={string}&limit={number}
```

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `day` | string (YYYY-MM-DD) | — | Required. Fetches rooms active on this day |
| `cursor` | string | — | Opaque cursor |
| `limit` | number | 50 | Page size |

**Response:**
```json
{
  "items": [Room],
  "nextCursor": "string | null",
  "total": 38
}
```

> **Note:** A room spanning multiple days appears under each day accordion. The backend handles this — the room is returned for each `day` query it spans.

### 3.3 Sessions by Room

```
GET /events/{eventId}/rooms/{roomId}/sessions?day={YYYY-MM-DD}&cursor={string}&limit={number}
```

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `day` | string (YYYY-MM-DD) | optional | Filters sessions to a specific day |
| `cursor` | string | — | Opaque cursor |
| `limit` | number | 50 | Page size |

**Response:**
```json
{
  "items": [Session],
  "nextCursor": "string | null",
  "total": 85
}
```

### 3.4 Days for an Event

```
GET /events/{eventId}/days?period={now|upcoming|past|all}
```

Returns the list of days that have rooms/sessions, respecting the period filter. This is a lightweight call (just date strings) that powers the day accordion headers without loading rooms.

**Response:**
```json
{
  "days": ["2026-03-13", "2026-03-14", "2026-03-15"],
  "total": 3
}
```

---

## 4. UX Behavior

### 4.1 Events List Page (`/events`)

```
┌─────────────────────────────────────────────┐
│  Events                        [+ New Event] │
│  ┌─────────────────────────────────────────┐ │
│  │ [Today] [Future] [Past] [All]           │ │
│  └─────────────────────────────────────────┘ │
│                                               │
│  ┌─ Event Card ──────────────────────────┐   │
│  │ AI & ML Summit 2026  ·  Mar 13–14     │   │
│  │ 3 rooms · 10 sessions                 │   │
│  └───────────────────────────────────────┘   │
│  ┌─ Event Card ──────────────────────────┐   │
│  │ Product Launch 2026   ·  Apr 5        │   │
│  │ 2 rooms · 6 sessions                  │   │
│  └───────────────────────────────────────┘   │
│  ... (up to 50 events)                        │
│                                               │
│  ┌───────────────────────────────────────┐   │
│  │  ▼ Show More (50 of 142 remaining)    │   │
│  │    Showing 50 of 192 events           │   │
│  └───────────────────────────────────────┘   │
│                                               │
└─────────────────────────────────────────────┘
```

**Behavior:**
- Initial load: fetch first 50 events for selected `period`
- Switching tabs (Today/Future/Past/All) → new API call with `period` param, resets cursor
- If more than 50 results, "Show More" button appears at bottom
- Clicking "Show More" fetches next 50 and appends to list
- Button shows count: "Show More (50 of N remaining)"
- End of list: button disappears — list simply ends

### 4.2 Event Detail Page — Day Accordions

```
┌─────────────────────────────────────────────┐
│  AI & ML Summit 2026                         │
│  [Now] [Upcoming] [Past] [All]               │
│                                               │
│  ▼ Thursday, March 13  (3 rooms · 65 sess)   │ ← Day accordion (expanded)
│  ┌───────────────────────────────────────┐   │
│  │  ▼ Main Auditorium (65 presentations) │   │ ← Room accordion
│  │  ┌────────────────────────────────┐   │   │
│  │  │ Opening Keynote · 9:00–10:30   │   │   │ ← Session row
│  │  │ Panel Discussion · 11:00–12:00 │   │   │
│  │  │ ... (up to 50 sessions)        │   │   │
│  │  └────────────────────────────────┘   │   │
│  │  [+ Add Session]                      │   │ ← ABOVE "Show More"
│  │  ┌────────────────────────────────┐   │   │
│  │  │ ▼ Show More (15 of 15 remaining)│  │   │ ← "Show More" button
│  │  │   Showing 50 of 65 sessions    │   │   │
│  │  └────────────────────────────────┘   │   │
│  │                                       │   │
│  │  ▶ Breakout Room A (3 presentations)  │   │ ← Collapsed room
│  │                                       │   │
│  │  ... (up to 50 rooms)                 │   │
│  │  ┌────────────────────────────────┐   │   │
│  │  │ ▼ Show More Rooms (N remaining) │  │   │ ← Room-level "Show More"
│  │  └────────────────────────────────┘   │   │
│  └───────────────────────────────────────┘   │
│                                               │
│  ▶ Friday, March 14  (2 rooms · 8 sess)      │ ← Collapsed day
│                                               │
└─────────────────────────────────────────────┘
```

**Day accordion behavior:**
- On page load: fetch `/events/{id}/days?period=all` to get day headers
- Days render as collapsed accordions with summary counts (lightweight)
- Expanding a day → fetch first 50 rooms for that day (`GET /rooms?day=YYYY-MM-DD&limit=50`)
- If >50 rooms, "Show More Rooms" button appears at the bottom of the room list
- Today's date auto-expands on mount
- Switching period filter → re-fetch days list, collapse all, auto-expand first

**Room accordion behavior:**
- Rooms render collapsed by default when fetched
- Expanding a room → show first 50 sessions for that room+day
- If >50 sessions, "Show More" button appears below the "Add Session" button
- **"Add Session" is always placed ABOVE "Show More"** — users never need to load all sessions to add a new one
- No nested scrollbars — all content uses the main page scroll, "Show More" pushes content down

**Session loading behavior:**
- First 50 sessions shown on room expand
- "Show More" button loads next 50 and appends
- Button shows remaining count for transparency
- When all loaded, button disappears

### 4.3 "Add" Button Placement (answers Sebastian's question)

**Principle:** "Add" actions are always accessible without loading all items.

| Level | "Add" Button Location | Relationship to "Show More" |
|-------|----------------------|----------------------------|
| **Events** | Header bar ("+ New Event") | Independent — always in sticky header |
| **Rooms** | Header bar ("+ Add Room") | Independent — always in sticky header |
| **Sessions** | 1. Room header `⋮` menu<br>2. Below last visible session | **Above** "Show More" button |

**Session-level detail (the key case):**

```
│  Session 50 (last visible)         │
│  [+ Add Session]                   │  ← Always accessible
│  ──────────────────────────────    │
│  ▼ Show More (15 of 15 remaining) │  ← Below the button
│    Showing 50 of 65 sessions       │
```

This ensures:
- The button is always reachable after scrolling through visible sessions
- Users don't have to load all 65+ sessions just to add one more
- The "Show More" button provides a clear affordance for loading remaining items
- Both actions (add new vs. see more existing) are visually distinct and separated

### 4.4 Loading & Empty States

| State | Display |
|-------|---------|
| **Initial load** | 3 skeleton cards (events) or 2 skeleton rows (rooms/sessions) |
| **Loading more** | Single skeleton row with spinner at bottom of list |
| **End of list** | Nothing — list simply ends (no "you've reached the end" message) |
| **Empty filter** | Contextual message: "No upcoming events" / "No past sessions" |
| **Error** | Inline retry: "Failed to load. [Retry]" |
| **Accordion loading** | Skeleton rows inside expanded accordion |

### 4.5 Scroll Restoration

- Navigating back from event detail to events list → restore scroll position
- Expanding/collapsing accordions → maintain scroll position relative to the toggled element
- Panel open/close → no scroll jump (use `scrollIntoView` if selected item is occluded)

---

## 5. State Management

### 5.1 Data Flow

```
Page Mount
  │
  ├─ Events List: fetch page 1 with period filter
  │   └─ scroll sentinel → fetch page 2, 3, ...
  │
  └─ Event Detail:
      ├─ fetch days (lightweight)
      │
      ├─ expand Day accordion
      │   └─ fetch rooms for day (page 1)
      │       └─ scroll sentinel → fetch more rooms
      │
      └─ expand Room accordion
          └─ fetch sessions for room+day (page 1)
              └─ scroll sentinel → fetch more sessions
```

### 5.2 Cache Strategy

- **Stale-while-revalidate**: show cached data immediately, refetch in background on revisit
- **Accordion cache**: once rooms/sessions are loaded for a day/room, keep in memory while on page
- **Filter change**: clear cache and refetch (period filter changes the dataset)
- **Mutation invalidation**: adding/editing/deleting a session invalidates the room's session cache

---

## 6. Implementation Notes (Prototype)

The prototype demonstrates "Show More" with client-side array slicing against a large mock dataset:

1. **Page size = 50** — consistent across all levels (events, rooms, sessions)
2. **`visibleCount` state** — tracks how many items to show per list, incremented by 50 on "Show More" click
3. **Mock data** — Main Auditorium has 65 sessions to demonstrate the pattern
4. **No `IntersectionObserver` needed** — user-initiated "Show More" click is simpler

### Key files modified

| File | Change |
|------|--------|
| `src/app/events/[eventId]/page.tsx` | Added `visibleRoomsPerDay` state, "Show More Rooms" button, 65-session mock room |
| `src/components/events/RoomAccordion.tsx` | Added `visibleCount`/`PAGE_SIZE`, slices sessions, renders "Show More" below "Add Session" |

### "Show More" pattern

```tsx
const PAGE_SIZE = 50;
const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
const visibleItems = allItems.slice(0, visibleCount);
const hasMore = allItems.length > visibleCount;
const remaining = allItems.length - visibleCount;

return (
  <>
    {visibleItems.map(item => <ItemRow key={item.id} {...item} />)}
    <AddButton />           {/* ← Always accessible */}
    {hasMore && (
      <Button onClick={() => setVisibleCount(prev => prev + PAGE_SIZE)}>
        Show More ({Math.min(remaining, PAGE_SIZE)} of {remaining} remaining)
      </Button>
    )}
  </>
);
```

### Production implementation

In production, "Show More" will trigger an API call with cursor-based pagination:

```tsx
const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
  queryKey: ['sessions', roomId, day],
  queryFn: ({ pageParam }) => fetchSessions({ cursor: pageParam, limit: 50 }),
  getNextPageParam: (lastPage) => lastPage.nextCursor,
});
```

---

## 7. Open Questions

| # | Question | Owner | Status |
|---|----------|-------|--------|
| 1 | What are realistic max counts? (rooms/day, sessions/room) | Product | Needed for page size tuning |
| 2 | Should day headers show accurate counts before all rooms load? | UX | Proposed: yes, from `/days` endpoint |
| 3 | Room spanning multiple days — show duplicate or link? | Product | Current: show in each day (Sebastian confirmed) |
| 4 | Should "Add Room" also be accessible when room list is long? | UX | Proposed: keep in header + FAB on mobile |
| 5 | Keyboard navigation for infinite scroll (accessibility)? | UX | Proposed: focus management on new items |

---

## 8. Acceptance Criteria

- [ ] Events list loads in pages of 20, next page fetched on scroll
- [ ] Period filter (now/upcoming/past/all) triggers new API request, resets list
- [ ] Day accordions load room list on expand (not on page mount)
- [ ] Room accordions load session list on expand (not on day expand)
- [ ] "Add Session" button is always accessible without scrolling past all sessions
- [ ] No nested scrollbars — all content uses the main page scroll
- [ ] Loading skeletons shown during fetch
- [ ] Scroll position maintained on accordion toggle
- [ ] Error states with retry capability
- [ ] Works on mobile (full-screen panel, no horizontal scroll)
