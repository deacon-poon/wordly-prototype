import type { Meta, StoryObj } from "@storybook/react";

import { WordlyAvatar } from "./WordlyAvatar";

const meta: Meta<typeof WordlyAvatar> = {
  title: "Experience/Participant/WordlyAvatar",
  component: WordlyAvatar,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "primary",
        "teal",
        "success",
        "destructive",
        "neutral",
        "muted",
      ],
    },
    small: { control: "boolean" },
    hidden: { control: "boolean" },
    src: { control: "text" },
  },
  args: {
    name: "Michael Scott",
    variant: "neutral",
  },
};

export default meta;
type Story = StoryObj<typeof WordlyAvatar>;

export const Default: Story = {};

export const Small: Story = {
  args: { name: "Pam Beesly", small: true, variant: "primary" },
};

export const WithImage: Story = {
  args: {
    name: "Jim Halpert",
    src: "https://i.pravatar.cc/80?img=12",
    variant: "primary",
  },
};

export const SingleName: Story = {
  args: { name: "Dwight", variant: "teal" },
};

export const LongName: Story = {
  args: { name: "Robert California Dunder Mifflin", variant: "success" },
};

export const Hidden: Story = {
  args: { name: "Creed Bratton", hidden: true },
};

export const Variants: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <WordlyAvatar name="Primary Brand" variant="primary" />
      <WordlyAvatar name="Action Teal" variant="teal" />
      <WordlyAvatar name="Success Green" variant="success" />
      <WordlyAvatar name="Destructive Red" variant="destructive" />
      <WordlyAvatar name="Neutral Gray" variant="neutral" />
      <WordlyAvatar name="Muted Tone" variant="muted" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <WordlyAvatar name="Small One" small variant="primary" />
      <WordlyAvatar name="Default Two" variant="primary" />
    </div>
  ),
};
