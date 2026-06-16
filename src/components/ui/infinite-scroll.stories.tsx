import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { InfiniteScroll } from "./infinite-scroll";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

/**
 * 1:1 mirror of the portal infinite-scroll stories
 * (wordly_portal: stories/core/wordly-infinite-scroll/
 *   story-1.InfiniteScroll.stories.ts  → "With WordlyTable"
 *   story-2.DirectUsage.stories.ts     → "Direct Usage"
 *   story-3.MultipleInstances.stories.ts → "Multiple Instances").
 *
 * The portal stories drive `WordlyTableComponent` + `PaginatedList` (Angular
 * signals). This repo has no `WordlyTable` wrapper or `PaginatedList`, so the
 * mock data, toolbar controls (page size + simulated delay), and the
 * append-style pagination state are ported here: `usePaginatedList` reproduces
 * `PaginatedList`'s `items / loading / hasMore / count / loadedCount` surface,
 * and the table stories render the shadcn `Table` primitives inside
 * `InfiniteScroll`. Behavior matches: scroll near the bottom → `onLoadMore`,
 * suppressed while `loading`, spinner appended below.
 */

// ─── Mock data ────────────────────────────────────────────────────────────────

interface Session {
  id: number;
  title: string;
  presenter: string;
  date: string;
  duration: number;
  language: string;
  status: "Active" | "Draft" | "Completed";
}

const TITLES = [
  "Keynote: Future of AI Translation",
  "Workshop: Real-time Captioning",
  "Panel: Multilingual Events Best Practices",
  "Demo: New Glossary Features",
  "Technical Session: NLP Advances",
  "Roundtable: Accessibility Standards",
  "Live Q&A: Translation Accuracy",
  "Masterclass: Simultaneous Interpretation",
];
const PRESENTERS = [
  "Jane Smith",
  "John Doe",
  "Maria Garcia",
  "Alex Chen",
  "Sarah Johnson",
  "David Kim",
  "Priya Patel",
  "Carlos Ruiz",
];
const LANGUAGES = [
  "English",
  "Spanish",
  "French",
  "Mandarin",
  "Portuguese",
  "German",
  "Japanese",
  "Arabic",
];
const STATUSES: Session["status"][] = ["Active", "Draft", "Completed"];
const DURATIONS = [15, 30, 45, 60, 90, 120];

const TOTAL_RECORDS = 300;

const ALL_SESSIONS: Session[] = Array.from(
  { length: TOTAL_RECORDS },
  (_, i) => ({
    id: i + 1,
    title: `${TITLES[i % TITLES.length]} #${i + 1}`,
    presenter: PRESENTERS[i % PRESENTERS.length],
    date: `2026-${String((Math.floor(i / 25) % 12) + 1).padStart(2, "0")}-${String(
      (i % 28) + 1
    ).padStart(2, "0")}`,
    duration: DURATIONS[i % DURATIONS.length],
    language: LANGUAGES[i % LANGUAGES.length],
    status: STATUSES[i % STATUSES.length],
  })
);

// ─── PaginatedList port ─────────────────────────────────────────────────────
// Reproduces the portal `PaginatedList` signal surface as a React hook:
// items / loading / hasMore / count / loadedCount, with a `loadMore` that
// appends the next page after a simulated `delayMs`.

function usePaginatedList<T>(
  all: T[],
  pageSize: number,
  delayMs: number,
  total = all.length
) {
  const [items, setItems] = React.useState<T[]>([]);
  const [loading, setLoading] = React.useState(false);
  const pageRef = React.useRef(0);
  const timer = React.useRef<ReturnType<typeof setTimeout>>();

  const fetchPage = React.useCallback(
    (page: number) => {
      setLoading(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        const start = page * pageSize;
        const next = all.slice(start, start + pageSize);
        setItems((prev) => (page === 0 ? next : [...prev, ...next]));
        setLoading(false);
      }, delayMs);
    },
    [all, pageSize, delayMs]
  );

  const reset = React.useCallback(() => {
    clearTimeout(timer.current);
    pageRef.current = 0;
    setItems([]);
    fetchPage(0);
  }, [fetchPage]);

  // (Re)load whenever page size / delay change — mirrors the portal initList().
  React.useEffect(() => {
    reset();
    return () => clearTimeout(timer.current);
  }, [reset]);

  const loadedCount = items.length;
  const hasMore = loadedCount < total;

  const loadMore = React.useCallback(() => {
    if (loading || !hasMore) return;
    pageRef.current += 1;
    fetchPage(pageRef.current);
  }, [loading, hasMore, fetchPage]);

  return {
    items,
    loading,
    hasMore,
    count: total,
    loadedCount,
    loadMore,
    reset,
  };
}

// ─── Shared toolbar ───────────────────────────────────────────────────────────

function Toolbar({
  pageSize,
  delayMs,
  onPageSize,
  onDelay,
  loadedCount,
  count,
  loading,
  hasMore,
  onReset,
}: {
  pageSize: number;
  delayMs: number;
  onPageSize: (v: number) => void;
  onDelay: (v: number) => void;
  loadedCount: number;
  count: number;
  loading: boolean;
  hasMore: boolean;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-none items-center justify-between gap-4 border-b bg-background px-6 py-3">
      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm">
          <span className="whitespace-nowrap text-muted-foreground">
            Page size
          </span>
          <input
            type="range"
            min="5"
            max="50"
            step="5"
            value={pageSize}
            onChange={(e) => onPageSize(+e.target.value)}
            className="w-28 accent-primary"
          />
          <span className="w-6 text-center font-medium tabular-nums">
            {pageSize}
          </span>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <span className="whitespace-nowrap text-muted-foreground">Delay</span>
          <input
            type="range"
            min="0"
            max="2000"
            step="100"
            value={delayMs}
            onChange={(e) => onDelay(+e.target.value)}
            className="w-28 accent-primary"
          />
          <span className="w-16 font-medium tabular-nums">{delayMs} ms</span>
        </label>
      </div>
      <div className="flex items-center gap-3">
        <p className="text-sm text-muted-foreground">
          Loaded{" "}
          <span className="font-medium text-foreground">{loadedCount}</span> of{" "}
          <span className="font-medium text-foreground">{count}</span>
        </p>
        {loading && loadedCount > 0 ? (
          <p className="animate-pulse text-xs text-muted-foreground">
            Loading more…
          </p>
        ) : !hasMore && count > 0 ? (
          <p className="text-xs font-medium text-green-600">All loaded</p>
        ) : null}
        <button
          className="rounded border border-border bg-background px-3 py-1.5 text-xs transition-colors hover:bg-accent"
          onClick={onReset}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

function SessionsTable({ data }: { data: Session[] }) {
  return (
    <Table>
      <TableHeader className="sticky top-0 z-10 bg-background">
        <TableRow>
          <TableHead className="w-[60px] text-center">#</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Presenter</TableHead>
          <TableHead className="w-[120px]">Date</TableHead>
          <TableHead className="w-[100px]">Duration</TableHead>
          <TableHead className="w-[120px]">Language</TableHead>
          <TableHead className="w-[100px]">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((s) => (
          <TableRow key={s.id}>
            <TableCell className="text-center text-muted-foreground">
              {s.id}
            </TableCell>
            <TableCell>{s.title}</TableCell>
            <TableCell>{s.presenter}</TableCell>
            <TableCell>{s.date}</TableCell>
            <TableCell>{s.duration} min</TableCell>
            <TableCell>{s.language}</TableCell>
            <TableCell>{s.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof InfiniteScroll> = {
  title: "Design System/Molecules/InfiniteScroll",
  component: InfiniteScroll,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "`InfiniteScroll` is a scroll-container wrapper that fires `onLoadMore` when the user scrolls within `threshold` px of the bottom. The component IS its own scroll container (`overflow-y-auto`) — give it a bounded height and it scrolls internally. When `loading` is `true` the callback is suppressed and a spinner appears below the content, preventing duplicate emissions while a fetch is in progress; `hasMore` stops further loading once the list is exhausted.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof InfiniteScroll>;

// ─── Stories ──────────────────────────────────────────────────────────────────

/**
 * `InfiniteScroll` wrapping a table — mirrors the portal "With WordlyTable"
 * story. Scroll down to trigger progressive loading. Adjust batch size and
 * simulated API delay with the toolbar controls.
 */
export const WithTable: Story = {
  name: "With WordlyTable",
  render: () => {
    const [pageSize, setPageSize] = React.useState(20);
    const [delayMs, setDelayMs] = React.useState(800);
    const list = usePaginatedList(ALL_SESSIONS, pageSize, delayMs);
    return (
      <div className="flex flex-col" style={{ height: 350 }}>
        <Toolbar
          pageSize={pageSize}
          delayMs={delayMs}
          onPageSize={setPageSize}
          onDelay={setDelayMs}
          loadedCount={list.loadedCount}
          count={list.count}
          loading={list.loading}
          hasMore={list.hasMore}
          onReset={list.reset}
        />
        <InfiniteScroll
          className="flex-1 min-h-0"
          loading={list.loading && list.items.length > 0}
          hasMore={list.hasMore}
          onLoadMore={list.loadMore}
        >
          <SessionsTable data={list.items} />
        </InfiniteScroll>
      </div>
    );
  },
};

interface Item {
  id: number;
  label: string;
}

const ALL_ITEMS: Item[] = Array.from({ length: 300 }, (_, i) => ({
  id: i + 1,
  label: `Item ${i + 1}`,
}));

/**
 * `InfiniteScroll` wrapping a plain list directly — no table involved. Mirrors
 * the portal "Direct Usage" story.
 */
export const DirectUsage: Story = {
  name: "Direct Usage",
  render: () => {
    const [pageSize, setPageSize] = React.useState(20);
    const [delayMs, setDelayMs] = React.useState(800);
    const list = usePaginatedList(ALL_ITEMS, pageSize, delayMs);
    return (
      <div className="flex flex-col" style={{ height: 350 }}>
        <Toolbar
          pageSize={pageSize}
          delayMs={delayMs}
          onPageSize={setPageSize}
          onDelay={setDelayMs}
          loadedCount={list.loadedCount}
          count={list.count}
          loading={list.loading}
          hasMore={list.hasMore}
          onReset={list.reset}
        />
        <InfiniteScroll
          className="flex-1 min-h-0"
          loading={list.loading && list.items.length > 0}
          hasMore={list.hasMore}
          onLoadMore={list.loadMore}
        >
          <ul className="list-disc px-10 py-4">
            {list.items.map((item) => (
              <li key={item.id} className="py-1 text-sm">
                {item.label}
              </li>
            ))}
          </ul>
        </InfiniteScroll>
      </div>
    );
  },
};

const MULTI_ITEMS: Item[] = Array.from({ length: 200 }, (_, i) => ({
  id: i + 1,
  label: `Item ${i + 1}`,
}));

function MultiPanel({
  title,
  pageSize,
  height,
}: {
  title: string;
  pageSize: number;
  height: number;
}) {
  const list = usePaginatedList(MULTI_ITEMS, pageSize, 1500, 200);
  return (
    <div
      className="flex flex-col overflow-hidden rounded-lg border"
      style={{ height }}
    >
      <div className="flex-none border-b bg-muted/40 px-4 py-2 text-xs font-medium text-muted-foreground">
        {title}
        <span className="float-right">
          {list.loadedCount} / {list.count}
        </span>
      </div>
      <InfiniteScroll
        className="flex-1 min-h-0"
        loading={list.loading && list.items.length > 0}
        hasMore={list.hasMore}
        onLoadMore={list.loadMore}
      >
        <ul className="list-disc px-10 py-4">
          {list.items.map((item) => (
            <li key={item.id} className="py-1 text-sm">
              {item.label}
            </li>
          ))}
        </ul>
      </InfiniteScroll>
    </div>
  );
}

/**
 * Three independent scroll containers stacked vertically, each with its own
 * `usePaginatedList` (different page size / height), demonstrating that
 * multiple instances coexist without interfering. Mirrors the portal
 * "Multiple Instances" story.
 */
export const MultipleInstances: Story = {
  name: "Multiple Instances",
  render: () => (
    <div className="flex flex-col gap-6 bg-background p-6">
      <MultiPanel
        title="List · 200 px · page size 15"
        pageSize={15}
        height={200}
      />
      <MultiPanel
        title="List · 300 px · page size 20"
        pageSize={20}
        height={300}
      />
      <MultiPanel
        title="List · 400 px · page size 20"
        pageSize={20}
        height={400}
      />
    </div>
  ),
};
