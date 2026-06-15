import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { Button } from "./button";

const meta: Meta<typeof Button> = {
  title: "Design System/Atoms/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "secondary",
        "outline",
        "ghost",
        "destructive",
        "success",
        "link",
      ],
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "icon"],
    },
    disabled: { control: "boolean" },
    asChild: { control: false },
  },
  args: {
    children: "Button",
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// --- Variants ---------------------------------------------------------------

export const Default: Story = {
  args: { children: "Continue", variant: "default" },
};

export const Secondary: Story = {
  args: { children: "Secondary", variant: "secondary" },
};

export const Outline: Story = {
  args: { children: "Outline", variant: "outline" },
};

export const Ghost: Story = {
  args: { children: "Ghost", variant: "ghost" },
};

export const Destructive: Story = {
  args: { children: "Delete session", variant: "destructive" },
};

export const Success: Story = {
  args: { children: "Save changes", variant: "success" },
};

export const Link: Story = {
  args: { children: "View details", variant: "link" },
};

/** Every CVA variant side by side for a quick visual audit. */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="default">Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="success">Success</Button>
      <Button variant="link">Link</Button>
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

/** The default, sm and lg sizes lined up against the same variant. */
export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

/** Icon size renders a square 40x40 button. Use an aria-label for a11y. */
export const Icon: Story = {
  render: () => (
    <Button size="icon" aria-label="Add item">
      <PlusGlyph />
    </Button>
  ),
};

/** A leading glyph plus a text label inside a default-size button. */
export const WithIcon: Story = {
  render: () => (
    <Button>
      <PlusGlyph />
      <span className="ml-2">Add language</span>
    </Button>
  ),
};

// --- States -----------------------------------------------------------------

export const Disabled: Story = {
  args: { children: "Disabled", disabled: true },
};

/** Disabled state applied across each variant for contrast checking. */
export const DisabledVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="default" disabled>
        Default
      </Button>
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

/**
 * asChild renders the styles onto a child element via Radix Slot.
 * Here the button styling is applied to a plain anchor tag.
 */
export const AsChildLink: Story = {
  render: () => (
    <Button asChild variant="outline">
      <a href="#button-as-link">Open in new view</a>
    </Button>
  ),
};

// --- Local helpers (ASCII-only inline SVG, no extra deps) -------------------

function PlusGlyph() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M8 3v10M3 8h10" />
    </svg>
  );
}
