import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { TimezoneSelector } from "./timezone-selector";

const meta: Meta<typeof TimezoneSelector> = {
  title: "Workspace Kit/TimezoneSelector",
  component: TimezoneSelector,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "React migration of the production Angular `wordly-timezone-selector`. " +
          "Grouped by IANA region, searchable (city/abbreviation/id), optional " +
          "compact trigger (abbreviation), clearable, and loading/error/empty " +
          "states. Data via props (mock by default); no Angular DI / " +
          "moment-timezone layer.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: { control: "inline-radio", options: ["default", "sm"] },
    compact: { control: "boolean" },
    searchable: { control: "boolean" },
    clearable: { control: "boolean" },
    showLeadingIcon: { control: "boolean" },
    loading: { control: "boolean" },
    error: { control: "boolean" },
    disabled: { control: "boolean" },
    readonly: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof TimezoneSelector>;

/** Controlled wrapper so the stories reflect real selection state. */
function Controlled(props: React.ComponentProps<typeof TimezoneSelector>) {
  const [value, setValue] = React.useState(props.value ?? "");
  return (
    <div className="w-80">
      <TimezoneSelector {...props} value={value} onValueChange={setValue} />
    </div>
  );
}

export const Basic: Story = {
  render: (args) => <Controlled {...args} />,
  args: { label: "Timezone" },
};

export const Searchable: Story = {
  render: (args) => <Controlled {...args} />,
  args: { searchable: true, clearable: true },
};

export const Compact: Story = {
  render: (args) => <Controlled {...args} />,
  args: { compact: true, value: "America/Los_Angeles" },
};

export const Required: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    label: "Timezone",
    required: true,
    helperText: "Used for session start times.",
  },
};

export const Loading: Story = {
  render: (args) => <Controlled {...args} />,
  args: { loading: true },
};

export const Error: Story = {
  render: (args) => <Controlled {...args} />,
  args: { error: true, errorMessage: "Failed to load timezones" },
};

export const Empty: Story = {
  render: (args) => <Controlled {...args} />,
  args: { groups: [] },
};

/** Disabled trigger - portal `disabled` (opacity-50, no interaction). */
export const Disabled: Story = {
  render: (args) => <Controlled {...args} />,
  args: { label: "Timezone", disabled: true, value: "America/New_York" },
};

/**
 * Read-only - mirrors the Angular combobox `readonly`: the trigger renders but
 * does not open (a non-interactive button, not a disabled one).
 */
export const Readonly: Story = {
  render: (args) => <Controlled {...args} />,
  args: { label: "Timezone", readonly: true, value: "Europe/London" },
};

/** Opt-in leading clock icon (off by default to match the portal trigger). */
export const WithLeadingIcon: Story = {
  render: (args) => <Controlled {...args} />,
  args: { label: "Timezone", showLeadingIcon: true, value: "Asia/Tokyo" },
};

/** Small trigger height (h-8) - mirrors the portal `data-size="sm"`. */
export const Small: Story = {
  render: (args) => <Controlled {...args} />,
  args: { label: "Timezone", size: "sm", value: "Europe/Paris" },
};
