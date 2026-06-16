import type { Meta, StoryObj } from "@storybook/react";

import { WordlyLogo } from "./WordlyLogo";

const meta: Meta<typeof WordlyLogo> = {
  title: "Experience/Branding/WordlyLogo",
  component: WordlyLogo,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Wordly wordmark. Ported from wordly-react-components-lib; the lib's " +
          "hard-coded newWordlyBlue is now the Brand Blue primary token " +
          "(`text-primary-blue-400`), driven via `currentColor`. Recolor with a " +
          "Tailwind `className` text token, or pass `color` for a one-off override.",
      },
    },
  },
  argTypes: {
    height: { control: "text" },
    viewBox: { control: "text" },
    color: { control: "color" },
    label: { control: "text" },
    className: { control: "text" },
  },
};

export default meta;

type Story = StoryObj<typeof WordlyLogo>;

/** Default: Brand Blue primary, 30px tall, accessible name "Wordly". */
export const Default: Story = {
  args: {
    height: "30px",
  },
};

/** Larger rendering to inspect the wordmark detail. */
export const Large: Story = {
  args: {
    height: "80px",
  },
};

/** Recolored via Tailwind token classes (the idiomatic shadcn approach). */
export const TokenColors: Story = {
  render: (args) => (
    <div className="flex flex-col gap-6">
      <WordlyLogo {...args} className="text-primary-blue-400" />
      <WordlyLogo {...args} className="text-primary-blue-600" />
      <WordlyLogo {...args} className="text-gray-700" />
      <WordlyLogo {...args} className="text-accent-green-500" />
    </div>
  ),
  args: {
    height: "40px",
  },
};

/** On a dark surface using the white token. */
export const OnDark: Story = {
  render: (args) => (
    <div className="rounded-md bg-primary-blue-700 p-8">
      <WordlyLogo {...args} className="text-white" />
    </div>
  ),
  args: {
    height: "40px",
  },
};

/**
 * Explicit `color` prop override (API parity with the original component).
 * Prefer recoloring via a Tailwind `className` token (see TokenColors); the
 * `color` prop accepts a raw value only for parity with the lib original.
 * Here we pass `currentColor` and drive the actual color from the Navy token
 * class so no raw hex is hard-coded.
 */
export const ColorPropOverride: Story = {
  render: (args) => (
    <WordlyLogo
      {...args}
      color="currentColor"
      className="text-primary-blue-600"
    />
  ),
  args: {
    height: "40px",
  },
};

/**
 * Decorative usage: `label=""` hides the SVG from assistive tech via
 * `aria-hidden`, for when adjacent visible text already names the brand.
 */
export const Decorative: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      <WordlyLogo {...args} />
      <span className="text-sm text-gray-700">
        Decorative logo (aria-hidden) beside naming text
      </span>
    </div>
  ),
  args: {
    height: "24px",
    label: "",
  },
};
