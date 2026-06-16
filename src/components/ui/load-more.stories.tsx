import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { LoadMore } from "@/components/ui/load-more";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";

/**
 * Storybook for LoadMore — mirrors the Angular portal
 * `stories/core/wordly-load-more/story-1.Overview.stories.ts` 1:1
 * (Overview, Loading next page, Without entity label, All items loaded).
 *
 * The Angular story renders a list of `app-wordly-item` rows above the
 * load-more control and appends the next batch (800 ms simulated delay) on
 * click. Here we reuse the React `Item` primitive and drive the same state.
 */

const ALL_ITEMS: { title: string; description: string }[] = [
  {
    title: "Introduction to Angular Signals",
    description: "Learn how to use signals for reactive state management",
  },
  {
    title: "Advanced TypeScript Patterns",
    description: "Explore type-safe patterns for large-scale applications",
  },
  {
    title: "Building Accessible UIs",
    description: "Best practices for creating inclusive user interfaces",
  },
  {
    title: "State Management with NgRx",
    description: "Managing complex application state with NgRx store",
  },
  {
    title: "Testing Angular Components",
    description: "Unit and integration testing strategies for Angular",
  },
  {
    title: "Reactive Forms Deep Dive",
    description: "Master reactive forms and custom validators",
  },
  {
    title: "Performance Optimisation Tips",
    description: "OnPush, lazy loading, and virtual scrolling techniques",
  },
  {
    title: "Custom Structural Directives",
    description: "Write your own *ngIf and *ngFor replacements",
  },
  {
    title: "Angular CDK Drag and Drop",
    description: "Add drag-and-drop interactions without third-party libs",
  },
  {
    title: "Server-Side Rendering with Angular",
    description: "Improve SEO and initial load with Angular Universal",
  },
];

function ItemList({
  items,
}: {
  items: { title: string; description: string }[];
}) {
  return (
    <>
      {items.map((item) => (
        <Item key={item.title} variant="outline">
          <ItemContent>
            <ItemTitle>{item.title}</ItemTitle>
            <ItemDescription>{item.description}</ItemDescription>
          </ItemContent>
        </Item>
      ))}
    </>
  );
}

const meta: Meta<typeof LoadMore> = {
  title: "Design System/Molecules/LoadMore",
  component: LoadMore,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          'Append-style load-more control. Renders a "Show More" button and item count status. Hides itself automatically when all items are loaded.',
      },
    },
  },
  argTypes: {
    count: {
      control: "number",
      description: "Total items available (EntityList.count)",
    },
    limit: {
      control: "number",
      description:
        "Page size — also used as next batch size (EntityList.limit)",
    },
    loadedCount: {
      control: "number",
      description: "Items currently rendered in the list",
    },
    entityLabel: {
      control: "text",
      description:
        'Label appended to the status text, e.g. "events" or "sessions". Omit to show generic "Show More" without an entity name.',
    },
    loading: {
      control: "boolean",
      description: "Shows spinner on button while next page is fetching",
    },
  },
};

export default meta;

type Story = StoryObj<typeof LoadMore>;

export const Overview: Story = {
  name: "Overview",
  args: { entityLabel: "items" },
  parameters: {
    docs: {
      description: {
        story:
          'Click "Show More" to load the next batch. Simulates an 800 ms network delay before revealing new items.',
      },
    },
  },
  render: (args) => {
    const limit = 3;
    const [loadedCount, setLoadedCount] = React.useState(3);
    const [loading, setLoading] = React.useState(false);

    const handleShowMore = () => {
      if (loading) return;
      setLoading(true);
      setTimeout(() => {
        setLoadedCount((prev) => Math.min(prev + limit, ALL_ITEMS.length));
        setLoading(false);
      }, 800);
    };

    return (
      <div className="flex flex-col gap-2">
        <ItemList items={ALL_ITEMS.slice(0, loadedCount)} />
        <LoadMore
          count={ALL_ITEMS.length}
          limit={limit}
          loadedCount={loadedCount}
          entityLabel={args.entityLabel}
          loading={loading}
          onShowMore={handleShowMore}
        />
      </div>
    );
  },
};

export const LoadingState: Story = {
  name: "Loading next page",
  args: { entityLabel: "items" },
  render: (args) => (
    <div className="flex flex-col gap-2">
      <ItemList items={ALL_ITEMS.slice(0, 3)} />
      <LoadMore
        count={10}
        limit={3}
        loadedCount={3}
        entityLabel={args.entityLabel}
        loading
      />
    </div>
  ),
};

export const NoEntityLabel: Story = {
  name: "Without entity label",
  args: { entityLabel: "" },
  parameters: {
    docs: {
      description: {
        story:
          'When entityLabel is omitted the button reads "Show More (x of T remaining)" with no entity name.',
      },
    },
  },
  render: (args) => {
    const limit = 3;
    const [loadedCount, setLoadedCount] = React.useState(3);
    const [loading, setLoading] = React.useState(false);

    const handleShowMore = () => {
      if (loading) return;
      setLoading(true);
      setTimeout(() => {
        setLoadedCount((prev) => Math.min(prev + limit, ALL_ITEMS.length));
        setLoading(false);
      }, 800);
    };

    return (
      <div className="flex flex-col gap-2">
        <ItemList items={ALL_ITEMS.slice(0, loadedCount)} />
        <LoadMore
          count={ALL_ITEMS.length}
          limit={limit}
          loadedCount={loadedCount}
          entityLabel={args.entityLabel}
          loading={loading}
          onShowMore={handleShowMore}
        />
      </div>
    );
  },
};

export const AllLoaded: Story = {
  name: "All items loaded",
  args: { entityLabel: "items" },
  render: (args) => (
    <div className="flex flex-col gap-2">
      <ItemList items={ALL_ITEMS.slice(0, 3)} />
      <p className="text-sm text-muted-foreground">
        (load-more is hidden — no items remaining)
      </p>
      <LoadMore
        count={3}
        limit={3}
        loadedCount={3}
        entityLabel={args.entityLabel}
        loading={false}
      />
    </div>
  ),
};
