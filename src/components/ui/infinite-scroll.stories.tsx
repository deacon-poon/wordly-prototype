import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { InfiniteScroll } from "./infinite-scroll";

const meta: Meta<typeof InfiniteScroll> = {
  title: "Core/InfiniteScroll",
  component: InfiniteScroll,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Scroll-container wrapper that fires `onLoadMore` when a sentinel scrolls within `threshold` px of the bottom. Suppresses loads while `loading` and stops once `hasMore` is false. React port of the Angular `app-wordly-infinite-scroll`.",
      },
    },
  },
  argTypes: {
    hasMore: { control: "boolean" },
    loading: { control: "boolean" },
    threshold: { control: { type: "number" } },
    onLoadMore: { action: "loadMore" },
  },
};

export default meta;
type Story = StoryObj<typeof InfiniteScroll>;

// ---------------------------------------------------------------------------
// Sample data + a small list renderer
// ---------------------------------------------------------------------------

const PAGE_SIZE = 8;
const TOTAL = 40;

function makeItems(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Attendee ${i + 1}`,
  }));
}

function List({ items }: { items: { id: number; name: string }[] }) {
  return (
    <ul className="divide-y divide-gray-100">
      {items.map((item) => (
        <li
          key={item.id}
          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-900"
        >
          <span className="flex size-7 items-center justify-center rounded-full bg-primary-blue-50 text-xs font-medium text-primary-blue-700">
            {item.id}
          </span>
          {item.name}
        </li>
      ))}
    </ul>
  );
}

// ---------------------------------------------------------------------------
// Controlled wrapper — owns the loaded items + paging state
// ---------------------------------------------------------------------------

function Controlled({
  threshold,
  total = TOTAL,
  fakeLatencyMs = 700,
}: {
  threshold?: number;
  total?: number;
  fakeLatencyMs?: number;
}) {
  const [items, setItems] = React.useState(() => makeItems(PAGE_SIZE));
  const [loading, setLoading] = React.useState(false);
  const hasMore = items.length < total;

  const loadMore = React.useCallback(() => {
    if (loading || !hasMore) return;
    setLoading(true);
    const timer = setTimeout(() => {
      setItems((prev) => makeItems(Math.min(prev.length + PAGE_SIZE, total)));
      setLoading(false);
    }, fakeLatencyMs);
    return () => clearTimeout(timer);
  }, [loading, hasMore, total, fakeLatencyMs]);

  return (
    <div className="w-80 overflow-hidden rounded-lg border border-gray-200">
      <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 text-xs font-medium text-gray-500">
        Loaded {items.length} of {total}
      </div>
      <InfiniteScroll
        className="h-72"
        loading={loading}
        hasMore={hasMore}
        threshold={threshold}
        onLoadMore={loadMore}
        endMessage="You've reached the end"
      >
        <List items={items} />
      </InfiniteScroll>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Stories — one per meaningful state
// ---------------------------------------------------------------------------

/** Scroll to the bottom to auto-load the next page until exhausted. */
export const Default: Story = {
  render: () => <Controlled />,
};

/** Loads eagerly: a short first page that does not fill the container. */
export const ShortFirstPage: Story = {
  render: () => <Controlled total={6} />,
};

/** Mid-fetch: load callback is suppressed and the spinner is shown. */
export const Loading: Story = {
  args: { loading: true, hasMore: true },
  render: (args) => (
    <div className="w-80 overflow-hidden rounded-lg border border-gray-200">
      <InfiniteScroll {...args} className="h-72">
        <List items={makeItems(PAGE_SIZE)} />
      </InfiniteScroll>
    </div>
  ),
};

/**
 * Custom loading indicator: the default two-tone ring spinner (portal
 * `hlm-spinner`, Brand-Blue arc) can be replaced via `loadingIndicator`.
 */
export const CustomLoadingIndicator: Story = {
  args: { loading: true, hasMore: true },
  render: (args) => (
    <div className="w-80 overflow-hidden rounded-lg border border-gray-200">
      <InfiniteScroll
        {...args}
        className="h-72"
        loadingIndicator={
          <div className="py-3 text-center text-sm font-medium text-primary-blue-600">
            Loading more attendees…
          </div>
        }
      >
        <List items={makeItems(PAGE_SIZE)} />
      </InfiniteScroll>
    </div>
  ),
};

/** Exhausted: observer is disconnected and the end message is shown. */
export const NoMore: Story = {
  args: { loading: false, hasMore: false },
  render: (args) => (
    <div className="w-80 overflow-hidden rounded-lg border border-gray-200">
      <InfiniteScroll
        {...args}
        className="h-72"
        endMessage="You've reached the end"
      >
        <List items={makeItems(PAGE_SIZE)} />
      </InfiniteScroll>
    </div>
  ),
};
