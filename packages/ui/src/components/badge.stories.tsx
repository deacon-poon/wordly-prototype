import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./badge";

const meta: Meta<typeof Badge> = {
  title: "Design System/Core/Badge",
  component: Badge,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
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
};

export default meta;
type Story = StoryObj<typeof Badge>;

// ── Playground ───────────────────────────────────────────────────────────────
export const Playground: Story = {
  args: {
    children: "Badge",
    variant: "default",
    size: "default",
  },
};

// ── All Variants ─────────────────────────────────────────────────────────────
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="navy">Brand Blue</Badge>
      <Badge variant="accent">Accent Green</Badge>
    </div>
  ),
};

// ── All Sizes ─────────────────────────────────────────────────────────────────
export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-end gap-3">
      <Badge size="lg">Large</Badge>
      <Badge size="default">Default</Badge>
      <Badge size="sm">Small</Badge>
    </div>
  ),
};

// ── Wordly Status Badges ──────────────────────────────────────────────────────
export const StatusBadges: Story = {
  name: "Status Badges",
  render: () => (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
        Session states
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <Badge variant="accent">● Live</Badge>
        <Badge variant="secondary">Scheduled</Badge>
        <Badge variant="outline">Draft</Badge>
        <Badge variant="destructive">Ended</Badge>
      </div>
      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
        Feature labels
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <Badge variant="navy">Most Popular</Badge>
        <Badge variant="navy">Recommended</Badge>
        <Badge variant="secondary">Beta</Badge>
        <Badge variant="outline">New</Badge>
      </div>
    </div>
  ),
};
