import type { Meta, StoryObj } from "@storybook/react";

import { WordlyQRCode } from "./WordlyQRCode";

const meta: Meta<typeof WordlyQRCode> = {
  title: "Experience/Display/WordlyQRCode",
  component: WordlyQRCode,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "primary", "teal", "inverted"],
    },
    size: { control: { type: "range", min: 96, max: 320, step: 8 } },
    framed: { control: "boolean" },
  },
  args: {
    link: "https://attend.wordly.ai/join/WRDL-2026",
    variant: "default",
    size: 200,
    framed: false,
  },
};

export default meta;
type Story = StoryObj<typeof WordlyQRCode>;

export const Default: Story = {};

export const BrandBlue: Story = {
  args: { variant: "primary" },
};

export const ActionTeal: Story = {
  args: { variant: "teal" },
};

export const Inverted: Story = {
  args: { variant: "inverted" },
};

export const Framed: Story = {
  args: { framed: true, variant: "primary" },
};

export const Small: Story = {
  args: { size: 120 },
};

export const ColorClassOverride: Story = {
  name: "Color class override (lib parity)",
  args: {
    codeColorClass: "fill-primary-blue-600",
    backgroundColorClass: "fill-primary-blue-25",
    framed: true,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-end gap-6">
      {(["default", "primary", "teal", "inverted"] as const).map((v) => (
        <div key={v} className="flex flex-col items-center gap-2">
          <WordlyQRCode variant={v} size={140} framed />
          <span className="text-sm text-gray-700">{v}</span>
        </div>
      ))}
    </div>
  ),
};
