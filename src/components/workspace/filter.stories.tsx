import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { WorkspaceFilter, type FilterField, type FilterValues } from "./filter";

/**
 * Stories mirror the production Angular Overview story 1:1:
 *   wordly_portal: stories/business/wordly-filter/story-1.Overview.stories.ts
 * (Overview / WithFieldOptions / WithWorkspaceSelector). The Angular original
 * pulls its date-range initial value from `DateRangePresets last30`
 * (`[daysAgo(29), endOfDay()]`); `last30()` below reproduces that range.
 */

// Mirrors the portal mockWorkspaceOptions used by the Overview story's bridge.
const mockWorkspaceOptions = [
  { label: "Personal Workspace", value: "65b7a1cfa5f3b021c5a909e7" },
  { label: "Engineering", value: "65b7a253a5f3b021c5a90b20" },
  { label: "Marketing Team", value: "65b7a253a5f3b021c5a90b21" },
  { label: "Product Development", value: "65b7a253a5f3b021c5a90b22" },
  { label: "Design Team", value: "65b7a253a5f3b021c5a90b23" },
  { label: "Customer Success", value: "65b7a253a5f3b021c5a90b24" },
];

/** Reproduces the portal `DateRangePresets last30` compute: [daysAgo(29), today]. */
function last30() {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 29);
  return { from, to };
}

const baseFields: FilterField[] = [
  {
    key: "dateRange",
    type: "date-range",
    label: "Date Range",
    initialValue: last30(),
  },
  {
    key: "workspaceId",
    type: "ws-selector",
    label: "Workspace",
    config: {
      includeAllOption: true,
      defaultOption: "ALL",
      options: mockWorkspaceOptions,
    },
  },
  {
    key: "search",
    type: "input",
    label: "Search",
    placeholder: "ID, Title, Label, or Custom...",
  },
  { key: "active", type: "checkbox", label: "Active" },
];

const meta: Meta<typeof WorkspaceFilter> = {
  title: "Workspace Kit/WorkspaceFilter",
  component: WorkspaceFilter,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Data-driven filter. Pass a `FilterField[]` to configure which " +
          "controls appear (date-range, search, ws-selector, checkbox). Emits " +
          "a `FilterValues` record keyed by field key when the Search button " +
          "is clicked. React migration of the production Angular `wordly-filter`.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof WorkspaceFilter>;

/** Surfaces the submitted values below the bar (the Angular story uses the
 *  searchFilterParams action; here we render the emitted record). */
function Render(props: React.ComponentProps<typeof WorkspaceFilter>) {
  const [submitted, setSubmitted] = React.useState<FilterValues | null>(null);
  return (
    <div className="flex flex-col gap-4">
      <WorkspaceFilter
        {...props}
        onSearch={(v) => {
          setSubmitted(v);
          props.onSearch?.(v);
        }}
      />
      {submitted ? (
        <pre className="max-w-[1000px] overflow-auto rounded-md bg-gray-50 p-3 text-xs text-gray-700">
          {JSON.stringify(submitted, null, 2)}
        </pre>
      ) : null}
    </div>
  );
}

export const Overview: Story = {
  render: (args) => <Render {...args} />,
  args: {
    fields: baseFields,
    submitButtonLabel: "Search",
  },
};

export const WithFieldOptions: Story = {
  name: "With Field Options (disabled / initialValue / hidden)",
  render: (args) => <Render {...args} />,
  args: {
    fields: [
      {
        key: "dateRange",
        type: "date-range",
        label: "Date Range",
        initialValue: last30(),
      },
      {
        key: "search",
        type: "input",
        label: "Search",
        placeholder: "ID, Title, Label, or Custom...",
        initialValue: "pre-filled query",
      },
      {
        key: "workspaceId",
        type: "ws-selector",
        label: "Workspace",
        hidden: true,
      },
      {
        key: "active",
        type: "checkbox",
        label: "Active",
        disabled: true,
      },
    ],
    submitButtonLabel: "Search",
  },
};

export const WithWorkspaceSelector: Story = {
  name: "With Workspace Selector",
  render: (args) => <Render {...args} />,
  args: {
    fields: [
      {
        key: "dateRange",
        type: "date-range",
        label: "Date Range",
        initialValue: last30(),
      },
      {
        key: "workspaceId",
        type: "ws-selector",
        label: "Workspace",
        config: {
          searchable: true,
          clearable: true,
          includeAllOption: true,
          defaultOption: "65b7a253a5f3b021c5a90b24",
          options: mockWorkspaceOptions,
        },
      },
      {
        key: "search",
        type: "input",
        label: "Search",
        placeholder: "ID, Title, Label, or Custom...",
      },
      { key: "active", type: "checkbox", label: "Active" },
    ],
    submitButtonLabel: "Search",
    containerClass: "md:flex-nowrap",
  },
};
