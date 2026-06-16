import type { Meta, StoryObj } from "@storybook/react";

import { WordlyAvatar } from "./WordlyAvatar";

const meta: Meta<typeof WordlyAvatar> = {
  title: "Experience/Participant/WordlyAvatar",
  component: WordlyAvatar,
  tags: ["autodocs"],
  argTypes: {
    name: { control: "text" },
    small: { control: "boolean" },
    hidden: { control: "boolean" },
    src: { control: "text" },
    color: { control: false },
    textColor: { control: false },
  },
  args: {
    name: "Michael Scott",
  },
};

export default meta;
type Story = StoryObj<typeof WordlyAvatar>;

/** Default bubble (lib default: white bubble / black text → neutral tokens). */
export const Default: Story = {};

/** Small variant on Brand Blue. */
export const Small: Story = {
  args: {
    name: "Pam Beesly",
    small: true,
    color: "bg-primary",
    textColor: "text-primary-foreground",
  },
};

/** Image source replaces the initials when it loads. */
export const WithImage: Story = {
  args: {
    name: "Jim Halpert",
    src: "https://i.pravatar.cc/80?img=12",
    color: "bg-primary",
    textColor: "text-primary-foreground",
  },
};

/** Single token name → first 3 characters. */
export const SingleName: Story = {
  args: {
    name: "Dwight",
    color: "bg-action-teal-600",
    textColor: "text-white",
  },
};

/** 4+ token name → first + last initials. */
export const LongName: Story = {
  args: {
    name: "Robert California Dunder Mifflin",
    color: "bg-accent-green-500",
    textColor: "text-white",
  },
};

/** Hidden: not displayed but still consumes layout space. */
export const Hidden: Story = {
  args: { name: "Creed Bratton", hidden: true },
};

/** Token-backed color options (Brand Blue stays primary). */
export const Colors: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <WordlyAvatar
        name="Primary Brand"
        color="bg-primary"
        textColor="text-primary-foreground"
      />
      <WordlyAvatar
        name="Action Teal"
        color="bg-action-teal-600"
        textColor="text-white"
      />
      <WordlyAvatar
        name="Accent Green"
        color="bg-accent-green-500"
        textColor="text-white"
      />
      <WordlyAvatar
        name="Neutral Gray"
        color="bg-gray-200"
        textColor="text-gray-700"
      />
    </div>
  ),
};

/** Small vs default sizing. */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <WordlyAvatar
        name="Small One"
        small
        color="bg-primary"
        textColor="text-primary-foreground"
      />
      <WordlyAvatar
        name="Default Two"
        color="bg-primary"
        textColor="text-primary-foreground"
      />
    </div>
  ),
};
