import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";
import { Mail, Plus, Loader2, ArrowRight, Users } from "lucide-react";

const meta: Meta<typeof Button> = {
  title: "Design System/Core/Button",
  component: Button,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "destructive",
        "outline",
        "secondary",
        "ghost",
        "link",
        "success",
      ],
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "icon"],
    },
    disabled: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// ── Playground ───────────────────────────────────────────────────────────────
export const Playground: Story = {
  args: {
    children: "Button",
    variant: "default",
    size: "default",
    disabled: false,
  },
};

// ── All Variants ─────────────────────────────────────────────────────────────
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="default">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="success">Success</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};

// ── All Sizes ─────────────────────────────────────────────────────────────────
export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-end gap-3">
      <Button size="lg">Large</Button>
      <Button size="default">Default</Button>
      <Button size="sm">Small</Button>
      <Button size="icon">
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  ),
};

// ── With Icons ────────────────────────────────────────────────────────────────
export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button>
        <Mail className="mr-2 h-4 w-4" />
        Email
      </Button>
      <Button variant="outline">
        <Plus className="mr-2 h-4 w-4" />
        Add new
      </Button>
      <Button variant="secondary">
        Continue
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
      <Button variant="default">
        <Users className="mr-2 h-4 w-4" />
        Join Session
      </Button>
    </div>
  ),
};

// ── Loading State ─────────────────────────────────────────────────────────────
export const Loading: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Connecting…
      </Button>
      <Button variant="outline" disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading…
      </Button>
    </div>
  ),
};

// ── Disabled States ───────────────────────────────────────────────────────────
export const Disabled: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button disabled>Primary</Button>
      <Button variant="secondary" disabled>
        Secondary
      </Button>
      <Button variant="outline" disabled>
        Outline
      </Button>
      <Button variant="destructive" disabled>
        Destructive
      </Button>
    </div>
  ),
};

// ── Wordly-specific CTAs ──────────────────────────────────────────────────────
export const WordlyCTAs: Story = {
  name: "Wordly CTAs",
  render: () => (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
        Common Wordly actions
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <Button>
          <Users className="mr-2 h-4 w-4" />
          Join Session
        </Button>
        <Button variant="success">
          <Plus className="mr-2 h-4 w-4" />
          Start Session
        </Button>
        <Button variant="outline">Copy Link</Button>
        <Button variant="ghost" size="sm">
          Cancel
        </Button>
      </div>
    </div>
  ),
};
