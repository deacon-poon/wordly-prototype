import type { Meta, StoryObj } from "@storybook/react";

import { SummaryHeader } from "./SummaryHeader";

const meta: Meta<typeof SummaryHeader> = {
  title: "Experience/Published Summaries/SummaryHeader",
  component: SummaryHeader,
  tags: ["autodocs"],
  argTypes: {
    className: { control: false },
  },
  args: {
    title: "Opening Keynote: The Future of Technology",
  },
};

export default meta;

type Story = StoryObj<typeof SummaryHeader>;

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
