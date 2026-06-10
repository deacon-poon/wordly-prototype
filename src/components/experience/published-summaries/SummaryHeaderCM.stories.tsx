import type { Meta, StoryObj } from "@storybook/react";

import { SummaryHeaderCM } from "./SummaryHeaderCM";

const meta: Meta<typeof SummaryHeaderCM> = {
  title: "Experience/Published Summaries/SummaryHeaderCM",
  component: SummaryHeaderCM,
  tags: ["autodocs"],
  argTypes: {
    title: { control: "text" },
    className: { control: false },
  },
  args: {
    title: "Opening Keynote: The Future of Technology",
  },
};

export default meta;

type Story = StoryObj<typeof SummaryHeaderCM>;

export const Default: Story = {};

export const ShortTitle: Story = {
  args: {
    title: "Q1 Review",
  },
};

export const LongTitle: Story = {
  args: {
    title:
      "Annual Strategic Planning Session: Aligning Cross-Functional Teams for Product Excellence in 2026",
  },
};
