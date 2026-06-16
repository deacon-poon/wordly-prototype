import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import {
  DateRangePicker,
  type DateRangeValue,
  startOfDay,
  endOfDay,
} from "./date-range-picker";

const meta: Meta<typeof DateRangePicker> = {
  title: "Design System/Molecules/DateRangePicker",
  component: DateRangePicker,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Range date picker ported from the Angular `WordlyDateRangePickerComponent`. A preset rail (All Time, Today, Last 7/30/90 days, This/Last month, This/Last year, Custom) sits beside a two-month range calendar in a popover. The trigger reproduces the portal `hlmInput` anatomy (h-9, rounded-md, border-input, px-3, focus-visible ring) and shows the active preset label, or a formatted date range in custom mode. Error state uses the `destructive` token with a AlertCircle icon; the between-range calendar fill uses `accent-green-100`.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DateRangePicker>;

/** Stateful wrapper so the controlled `value`/`onValueChange` contract is exercised. */
function Controlled(props: React.ComponentProps<typeof DateRangePicker>) {
  const [value, setValue] = React.useState<DateRangeValue>(props.value ?? null);

  const fmt = (d: Date) =>
    d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="flex flex-col gap-3">
      <DateRangePicker {...props} value={value} onValueChange={setValue} />
      <p className="text-xs text-gray-500">
        {value ? `${fmt(value[0])} - ${fmt(value[1])}` : "All Time (no range)"}
      </p>
    </div>
  );
}

export const Default: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    defaultPreset: "last30",
  },
};

export const WithLabelAndHelper: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    label: "Report period",
    required: true,
    helperText: "Pick a preset or drag a custom range on the calendar.",
    defaultPreset: "last7",
  },
};

export const PreselectedRange: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    label: "Billing window",
    value: [startOfDay(new Date(2026, 0, 1)), endOfDay(new Date(2026, 2, 31))],
  },
};

export const AllTime: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    label: "Activity",
    value: null,
    defaultPreset: "allTime",
  },
};

export const Bounded: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    label: "Within this year",
    min: startOfDay(new Date(2026, 0, 1)),
    max: endOfDay(new Date()),
    defaultPreset: "thisMonth",
  },
};

export const ErrorState: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    label: "Date range",
    required: true,
    value: null,
    errorMessage: "This field is required",
  },
};

export const Disabled: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    label: "Date range",
    disabled: true,
    defaultPreset: "last30",
  },
};

/**
 * Custom (non-preset) range - exercises the formatted trigger label and, when the
 * popover is opened, the `accent-green-100` between-range fill on the calendar.
 */
export const CustomRange: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    label: "Custom window",
    helperText: "Open the picker to see the green between-range fill.",
    value: [startOfDay(new Date(2026, 1, 3)), endOfDay(new Date(2026, 1, 18))],
  },
};

/**
 * Active-preset highlight - opening the popover shows the matched preset
 * highlighted in the rail (neutral `bg-accent font-medium`, matching the portal).
 */
export const PresetHighlight: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    label: "Reporting period",
    defaultPreset: "last90",
  },
};
