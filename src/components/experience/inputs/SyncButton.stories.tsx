import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { SyncButton } from "./SyncButton";

const meta: Meta<typeof SyncButton> = {
  title: "Experience/Inputs/SyncButton",
  component: SyncButton,
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "select",
      options: ["default", "inherit", "primary", "secondary"],
    },
    secondsPerRevolution: { control: { type: "number", min: 0.1, step: 0.1 } },
    syncing: { control: "boolean" },
    disabled: { control: "boolean" },
    onClick: { table: { disable: true } },
  },
  args: {
    "aria-label": "Sync",
    color: "primary",
  },
};

export default meta;
type Story = StoryObj<typeof SyncButton>;

export const Default: Story = {};

export const Syncing: Story = {
  args: { syncing: true },
};

export const Disabled: Story = {
  args: { syncing: false, disabled: true },
};

export const WithTooltip: Story = {
  args: { tooltip: "Sync now" },
};

export const SlowRevolution: Story = {
  args: { syncing: true, secondsPerRevolution: 2 },
};

export const Colors: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <SyncButton {...args} color="default" aria-label="Sync default" />
      <SyncButton {...args} color="primary" aria-label="Sync primary" />
      <SyncButton {...args} color="secondary" aria-label="Sync secondary" />
    </div>
  ),
};

/** Interactive: click toggles a 2s spin, mirroring a real sync round-trip. */
export const Interactive: Story = {
  render: (args) => {
    const [syncing, setSyncing] = React.useState(false);
    return (
      <SyncButton
        {...args}
        syncing={syncing}
        onClick={() => {
          setSyncing(true);
          setTimeout(() => setSyncing(false), 2000);
        }}
      />
    );
  },
};
