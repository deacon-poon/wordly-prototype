import type { Meta, StoryObj } from "@storybook/react";

import { Badge } from "./badge";

const meta: Meta<typeof Badge> = {
  title: "Core/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "secondary",
        "destructive",
        "outline",
        "teal",
        "navy",
        "accent",
      ],
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg"],
    },
  },
  args: {
    children: "Badge",
    variant: "default",
    size: "default",
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

// --- Variants ---------------------------------------------------------------

export const Default: Story = {
  args: { children: "Default", variant: "default" },
};

export const Secondary: Story = {
  args: { children: "Draft", variant: "secondary" },
};

export const Destructive: Story = {
  args: { children: "Error", variant: "destructive" },
};

export const Outline: Story = {
  args: { children: "Pending", variant: "outline" },
};

// Brand variants (teal and navy both map to Brand Blue; accent maps to Accent Green)

export const Teal: Story = {
  args: { children: "Live", variant: "teal" },
};

export const Navy: Story = {
  args: { children: "Active", variant: "navy" },
};

export const Accent: Story = {
  args: { children: "Success", variant: "accent" },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="teal">Teal</Badge>
      <Badge variant="navy">Navy</Badge>
      <Badge variant="accent">Accent</Badge>
    </div>
  ),
};

// --- Sizes ------------------------------------------------------------------

export const Small: Story = {
  args: { children: "Small", size: "sm" },
};

export const Large: Story = {
  args: { children: "Large", size: "lg" },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge size="sm">Small</Badge>
      <Badge size="default">Default</Badge>
      <Badge size="lg">Large</Badge>
    </div>
  ),
};

// --- Real-world status row --------------------------------------------------

export const StatusRow: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="accent">Live</Badge>
      <Badge variant="secondary">Draft</Badge>
      <Badge variant="outline">Scheduled</Badge>
      <Badge variant="destructive">Cancelled</Badge>
    </div>
  ),
};
