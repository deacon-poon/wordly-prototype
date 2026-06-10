import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { TimePicker } from "./time-picker";

const meta: Meta<typeof TimePicker> = {
  title: "Core/TimePicker",
  component: TimePicker,
  tags: ["autodocs"],
  argTypes: {
    value: { control: "text" },
    minuteStep: { control: { type: "number", min: 1, max: 30 } },
  },
};

export default meta;
type Story = StoryObj<typeof TimePicker>;

/**
 * Controlled wrapper — the canonical value is a 24-hour "HH:mm" string.
 * We surface the live value so the controlled behavior is visible in docs.
 */
function Controlled(props: React.ComponentProps<typeof TimePicker>) {
  const [value, setValue] = React.useState<string>(props.value ?? "");
  return (
    <div className="w-72 space-y-2">
      <TimePicker {...props} value={value} onValueChange={setValue} />
      <p className="text-xs text-muted-foreground">
        Value (HH:mm): <code>{value || "—"}</code>
      </p>
    </div>
  );
}

export const Default: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    label: "Start time",
    value: "09:30",
  },
};

export const TwentyFourHour: Story = {
  name: "24-hour",
  render: (args) => <Controlled {...args} />,
  args: {
    label: "Session start",
    value: "14:05",
    helperText: "Times are shown in 24-hour format.",
  },
};

export const TwelveHour: Story = {
  name: "12-hour (AM/PM)",
  render: (args) => <Controlled {...args} />,
  args: {
    label: "Doors open",
    value: "14:30",
    use12Hour: true,
    helperText: "Stored as 24h, displayed as AM/PM.",
  },
};

export const Required: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    label: "End time",
    required: true,
    value: "",
  },
};

export const WithError: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    label: "Start time",
    value: "10:00",
    error: true,
    errorMessage: "Start time must be before the end time.",
  },
};

export const Disabled: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    label: "Locked time",
    value: "08:00",
    disabled: true,
  },
};

export const FiveMinuteSteps: Story = {
  name: "Minute step",
  render: (args) => <Controlled {...args} />,
  args: {
    label: "Reminder at",
    value: "09:15",
    minuteStep: 15,
    helperText: "Minutes snap to 15-minute increments.",
  },
};

export const Empty: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    label: "Pick a time",
    placeholder: "--",
    value: "",
  },
};

/**
 * Side-by-side overview of every portal-aligned state on one canvas:
 * default, required, with helper text, error (icon + message), and disabled.
 * Mirrors `wordly-time-picker` rendered through the shared form-control wrapper.
 */
export const AllStates: Story = {
  render: () => (
    <div className="grid w-[22rem] grid-cols-1 gap-6">
      <Controlled label="Default" value="09:30" />
      <Controlled label="Required" required value="" />
      <Controlled
        label="With helper text"
        value="08:00"
        helperText="Local time for the venue."
      />
      <Controlled
        label="Error"
        value="10:00"
        error
        errorMessage="Start time must be before the end time."
      />
      <Controlled label="Disabled" value="08:00" disabled />
    </div>
  ),
};
