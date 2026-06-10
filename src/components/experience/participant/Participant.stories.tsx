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
    presenterLabel: { control: "text" },
    avatarSrc: { control: "text" },
  },
};

export default meta;

type Story = StoryObj<typeof Participant>;

/** Attendee: avatar + name, no presenter label or indicator. */
export const Default: Story = {};

/** Presenter: adds the "Presenter" label above the name and the green dot. */
export const Presenter: Story = {
  args: { presenter: true },
};

/** Small variant: shrinks the avatar, label, name, and indicator. */
export const Small: Story = {
  args: { small: true, presenter: true },
};

/** Compact: hides the name, rendering only the avatar (+ indicator). */
export const Compact: Story = {
  args: { compact: true, presenter: true },
};

/** Blank name falls back to "Anonymous". */
export const Anonymous: Story = {
  args: { name: "   " },
};

/** Initials handling across single, multi, and very long names. */
export const InitialsVariants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <Participant {...args} name="Tina" />
      <Participant {...args} name="Bob Belcher" />
      <Participant {...args} name="Linda Susan Belcher" />
      <Participant {...args} name="Jimmy Junior Pesto Junior" />
    </div>
  ),
};

/** Avatar image with initials fallback. */
export const WithAvatarImage: Story = {
  args: {
    name: "Gene Belcher",
    avatarSrc: "https://i.pravatar.cc/80?img=12",
  },
};

/** Localized presenter label. */
export const LocalizedPresenterLabel: Story = {
  args: { presenter: true, presenterLabel: "Presentador" },
};
