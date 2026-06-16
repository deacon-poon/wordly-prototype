import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { TimePicker } from "./time-picker";

/**
 * 1:1 mirror of the production Angular `WordlyTimePicker` Overview stories
 *   wordly_portal: stories/core/wordly-time-picker/story-1.Overview.stories.ts
 *
 * Native `<input type="time">` with a leading clock button, wrapped in the
 * shared form-control wrapper. Same three stories the portal exposes:
 * Overview (full affordances), Preselected Value, and Disabled.
 */
const meta: Meta<typeof TimePicker> = {
  title: "Design System/Molecules/TimePicker",
  component: TimePicker,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    disabled: {
      control: "boolean",
      description: "Whether the time picker is disabled",
    },
  },
};

export default meta;
type Story = StoryObj<typeof TimePicker>;

/** Controlled wrapper so the picker reflects edits live in the canvas. */
function ControlledTimePicker(args: React.ComponentProps<typeof TimePicker>) {
  const [value, setValue] = React.useState(args.value ?? "");
  return <TimePicker {...args} value={value} onValueChange={setValue} />;
}

export const Overview: Story = {
  name: "Overview",
  render: (args) => <ControlledTimePicker {...args} />,
  args: {
    id: "time-picker-overview",
    label: "Start Time",
    placeholder: "Select a time",
    helperText: "Choose the event start time",
    required: true,
    disabled: false,
    showInfoIcon: true,
    infoTooltipText: "The time when the event becomes active for attendees.",
    extraInfo: "All times are displayed in the event timezone.",
  },
};

export const WithPreselectedValue: Story = {
  name: "Preselected Value",
  render: (args) => <ControlledTimePicker {...args} />,
  args: {
    id: "time-picker-preselected",
    label: "Meeting Time",
    placeholder: "Select a time",
    helperText: "A time has been preselected",
    value: "09:00",
  },
};

export const Disabled: Story = {
  name: "Disabled",
  args: {
    id: "time-picker-disabled",
    label: "Locked Time",
    placeholder: "Select a time",
    disabled: true,
    value: "14:30",
  },
};
