import type { Meta, StoryObj } from "@storybook/react";

import { Participant } from "./Participant";

const meta: Meta<typeof Participant> = {
  title: "Experience/Participant/Participant",
  component: Participant,
  tags: ["autodocs"],
  args: {
    name: "Bob Belcher",
    small: false,
    presenter: false,
    compact: false,
  },
  argTypes: {
    indicatorColor: { control: false },
    labelColor: { control: false },
    className: { control: false },
  },
};

export default meta;

type Story = StoryObj<typeof Participant>;

/** Attendee: just the name, no presenter label or indicator. */
export const Default: Story = {};

/** Presenter: adds the "Presenter" label above the name and the indicator dot. */
export const Presenter: Story = {
  args: { presenter: true },
};

/** Small variant: shrinks the label, name, and indicator margins. */
export const Small: Story = {
  args: { small: true, presenter: true },
};

/** Compact: hides the name, rendering only the presenter indicator. */
export const Compact: Story = {
  args: { compact: true, presenter: true },
};

/** Blank name falls back to "Anonymous". */
export const Anonymous: Story = {
  args: { name: "   " },
};

/** Initials/name handling across single, multi, and very long names. */
export const NameVariants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <Participant {...args} name="Tina" />
      <Participant {...args} name="Bob Belcher" />
      <Participant {...args} name="Linda Susan Belcher" />
      <Participant {...args} name="Jimmy Junior Pesto Junior" />
    </div>
  ),
};
