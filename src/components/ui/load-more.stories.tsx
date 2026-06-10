import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { LoadMore } from "./load-more";

const meta: Meta<typeof LoadMore> = {
  title: "Core/LoadMore",
  component: LoadMore,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Visual parity with the portal `app-wordly-load-more`, which proxies a single " +
          "`wordly-button` (variant `outline`, size `sm`). Anatomy: min-h 36px, padding " +
          "8px 12px, radius 6px, 14px/20px Roboto medium, white bg, gray-800 text, 1px " +
          "gray-200 border. The portal's Teal hover/active ramp is remapped to OUR Brand " +
          "Blue primary (primary-blue-50 hover / primary-blue-100 active). Loading dims to " +
          "70% opacity with a wait cursor and swaps the chevron for a spinner.",
      },
    },
  },
  argTypes: {
    onShowMore: { action: "showMore" },
  },
};

export default meta;
type Story = StoryObj<typeof LoadMore>;

/**
 * Stateful wrapper: clicking "Show More" simulates loading the next batch and
 * appending it to the loaded count, until everything is loaded (component hides).
 */
function Controlled({
  count,
  limit,
  entityLabel,
  initialLoaded = 0,
}: {
  count: number;
  limit: number;
  entityLabel?: string;
  initialLoaded?: number;
}) {
  const [loadedCount, setLoadedCount] = React.useState(initialLoaded);
  const [loading, setLoading] = React.useState(false);

  function handleShowMore() {
    setLoading(true);
    setTimeout(() => {
      setLoadedCount((c) => Math.min(c + limit, count));
      setLoading(false);
    }, 900);
  }

  return (
    <div className="max-w-md space-y-3">
      <ul className="space-y-1 text-sm text-gray-700">
        {Array.from({ length: loadedCount }).map((_, i) => (
          <li key={i} className="rounded-md border border-gray-200 px-3 py-1.5">
            {entityLabel ? `${capitalizeWord(entityLabel)} ` : "Item "}
            {i + 1}
          </li>
        ))}
      </ul>
      <LoadMore
        count={count}
        limit={limit}
        loadedCount={loadedCount}
        entityLabel={entityLabel}
        loading={loading}
        onShowMore={handleShowMore}
      />
    </div>
  );
}

function capitalizeWord(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Default: more items remaining, no entity label. */
export const Default: Story = {
  args: {
    count: 50,
    limit: 10,
    loadedCount: 10,
  },
};

/** With an entity label, capitalized in the button copy. */
export const WithEntityLabel: Story = {
  args: {
    count: 42,
    limit: 8,
    loadedCount: 8,
    entityLabel: "sessions",
  },
};

/**
 * Loading state (portal `.state-loading`): spinner replaces the chevron, the
 * button dims to 70% opacity with a wait cursor, and clicks are blocked.
 */
export const Loading: Story = {
  args: {
    count: 50,
    limit: 10,
    loadedCount: 10,
    entityLabel: "attendees",
    loading: true,
  },
};

/** Near the end: next batch is smaller than the page limit. */
export const PartialNextBatch: Story = {
  args: {
    count: 23,
    limit: 10,
    loadedCount: 20,
    entityLabel: "events",
  },
};

/** Nothing left to load — the component renders nothing (like Angular display:none). */
export const FullyLoaded: Story = {
  args: {
    count: 10,
    limit: 10,
    loadedCount: 10,
    entityLabel: "rows",
  },
};

/** Interactive: click "Show More" to load batches until exhausted. */
export const Interactive: Story = {
  render: () => (
    <Controlled
      count={37}
      limit={10}
      entityLabel="documents"
      initialLoaded={10}
    />
  ),
};
