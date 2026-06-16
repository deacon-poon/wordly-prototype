import type { Meta, StoryObj } from "@storybook/react";

import { ParticipantName } from "./ParticipantName";

const meta: Meta<typeof ParticipantName> = {
  title: "Experience/Participant/ParticipantName",
  component: ParticipantName,
  tags: ["autodocs"],
  argTypes: {
    name: { control: "text" },
    small: { control: "boolean" },
    presenter: { control: "boolean" },
    presenterLabel: { control: "text" },
    labelColor: { control: false },
    className: { control: false },
  },
  args: {
    name: "Bob Belcher",
    small: false,
    presenter: false,
    presenterLabel: "Presenter",
  },
};

export default meta;

type Story = StoryObj<typeof ParticipantName>;

/** Default: just the participant's name at base (1em) size. */
export const Default: Story = {};

/** Presenter label tucked above the name. */
export const Presenter: Story = {
  args: {
    presenter: true,
  },
};

/** Compact variant — name and label scaled down (0.875em / 0.625em). */
export const Small: Story = {
  args: {
    small: true,
    presenter: true,
  },
};

/** Empty / whitespace name falls back to "Anonymous". */
export const Anonymous: Story = {
  args: {
    name: "   ",
  },
};

/** Localized presenter label. */
export const LocalizedLabel: Story = {
  args: {
    presenter: true,
    presenterLabel: "Presentador",
  },
};

/** Token-based accent color for the presenter label (Brand Blue primary). */
export const BrandLabelColor: Story = {
  args: {
    presenter: true,
    labelColor: "text-primary",
  },
};

/** Scales with the surrounding font-size (sizes are expressed in em). */
export const InheritsFontSize: Story = {
  args: {
    presenter: true,
  },
  render: (args) => (
    <div className="flex flex-col gap-6">
      <div style={{ fontSize: 16 }}>
        <ParticipantName {...args} />
      </div>
      <div style={{ fontSize: 24 }}>
        <ParticipantName {...args} />
      </div>
      <div style={{ fontSize: 40 }}>
        <ParticipantName {...args} />
      </div>
    </div>
  ),
};
