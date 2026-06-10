import type { Meta, StoryObj } from "@storybook/react";

import { SummaryHeader } from "./SummaryHeader";

const meta: Meta<typeof SummaryHeader> = {
  title: "Experience/Published Summaries/SummaryHeader",
  component: SummaryHeader,
  tags: ["autodocs"],
  argTypes: {
    className: { control: false },
    as: {
      control: "inline-radio",
      options: ["h1", "h2", "h3"],
    },
  },
  args: {
    title: "Opening Keynote: The Future of Technology",
    as: "h2",
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

export const AsH1: Story = {
  name: "As H1 (page-level heading)",
  args: {
    as: "h1",
    title: "All-Hands Town Hall Recap",
  },
};
