import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Building2,
  CalendarClock,
  Globe,
  MapPin,
  Tag,
  User,
  Users,
  XCircle,
  Zap,
} from "lucide-react";

import {
  UnifiedSearch,
  type ActiveFilter,
  type SearchFilterCategory,
} from "./unified-search";

const meta: Meta<typeof UnifiedSearch> = {
  title: "Design System/Organisms/UnifiedSearch",
  component: UnifiedSearch,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A single search bar that blends free-text query with categorized, color-coded filter chips. " +
          "Introduced for the unified search on the Events list & detail pages, and reused on Organization Usage. " +
          "Selected filters render as removable chips inline with the input; the dropdown groups filterable " +
          "options by category (each with its own icon + color token). Typing narrows the option list and " +
          "highlights the matched substring. Keyboard: Enter fires `onSearch`, Escape closes, Backspace on an " +
          "empty input removes the last chip. Categories can be single- or multi-select (`multiple`, default true). " +
          "The component is fully controlled — supply `query`, `activeFilters`, and the change callbacks.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof UnifiedSearch>;

// --- Sample categories ------------------------------------------------------
// Mirrors the real configuration used on the Events and Organization Usage pages.

const EVENT_CATEGORIES: SearchFilterCategory[] = [
  {
    key: "status",
    label: "Status",
    icon: Globe,
    color: "green",
    multiple: false,
    options: [
      { value: "ACTIVE", label: "Active", icon: Zap },
      { value: "ENDED", label: "Ended", icon: XCircle },
    ],
  },
  {
    key: "room",
    label: "Room",
    icon: MapPin,
    color: "blue",
    options: [
      { value: "main-hall", label: "Main Hall" },
      { value: "breakout-a", label: "Breakout A" },
      { value: "breakout-b", label: "Breakout B" },
    ],
  },
  {
    key: "presenter",
    label: "Presenter",
    icon: User,
    color: "purple",
    options: [
      { value: "alex", label: "Alex Rivera" },
      { value: "sam", label: "Sam Chen" },
      { value: "jordan", label: "Jordan Patel" },
    ],
  },
  {
    key: "label",
    label: "Label",
    icon: Tag,
    color: "amber",
    options: [
      { value: "engineering", label: "Engineering" },
      { value: "marketing", label: "Marketing" },
      { value: "executive", label: "Executive" },
    ],
  },
];

/** Stateful wrapper so the controlled query/activeFilters contract is exercised. */
function Controlled(props: React.ComponentProps<typeof UnifiedSearch>) {
  const [query, setQuery] = React.useState(props.query ?? "");
  const [activeFilters, setActiveFilters] = React.useState<ActiveFilter[]>(
    props.activeFilters ?? []
  );

  return (
    <div className="flex w-[560px] max-w-full flex-col gap-3">
      <UnifiedSearch
        {...props}
        query={query}
        activeFilters={activeFilters}
        onQueryChange={setQuery}
        onFiltersChange={setActiveFilters}
      />
      <p className="text-xs text-gray-500">
        query: <span className="font-mono">{query || "—"}</span> · filters:{" "}
        <span className="font-mono">
          {activeFilters.length
            ? activeFilters.map((f) => `${f.categoryKey}:${f.value}`).join(", ")
            : "—"}
        </span>
      </p>
    </div>
  );
}

export const Default: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    categories: EVENT_CATEGORIES,
    activeFilters: [],
    query: "",
    placeholder: "Search sessions, rooms, presenters…",
  },
};

export const WithActiveFilters: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    categories: EVENT_CATEGORIES,
    query: "",
    placeholder: "Search sessions, rooms, presenters…",
    activeFilters: [
      { categoryKey: "status", value: "ACTIVE" },
      { categoryKey: "room", value: "main-hall" },
      { categoryKey: "presenter", value: "alex" },
    ],
  },
};

export const WithQueryText: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    categories: EVENT_CATEGORIES,
    activeFilters: [{ categoryKey: "label", value: "engineering" }],
    query: "Main",
    placeholder: "Search sessions, rooms, presenters…",
  },
};

/** Organization Usage configuration — status + workspace categories. */
export const OrganizationUsage: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    placeholder: "Search by ID, label, or custom fields…",
    activeFilters: [],
    query: "",
    categories: [
      {
        key: "status",
        label: "Status",
        icon: Globe,
        color: "green",
        options: [
          { value: "ACTIVE", label: "Active", icon: Zap },
          { value: "ENDED", label: "Ended", icon: XCircle },
        ],
      },
      {
        key: "workspace",
        label: "Workspace",
        icon: Building2,
        color: "blue",
        options: [
          { value: "personal", label: "My Workspace", icon: Users },
          { value: "finance", label: "Finance", icon: Building2 },
          { value: "product", label: "Product", icon: Building2 },
          { value: "success", label: "Customer Success", icon: Building2 },
        ],
      },
      {
        key: "period",
        label: "Period",
        icon: CalendarClock,
        color: "teal",
        multiple: false,
        options: [
          { value: "30d", label: "Last 30 days" },
          { value: "quarter", label: "This quarter" },
          { value: "year", label: "This year" },
        ],
      },
    ],
  },
};
