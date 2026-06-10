import type { Meta, StoryObj } from "@storybook/react";

import { CapsuleSummary } from "./CapsuleSummary";

const meta: Meta<typeof CapsuleSummary> = {
  title: "Experience/Published Summaries/CapsuleSummary",
  component: CapsuleSummary,
  tags: ["autodocs"],
  argTypes: {
    className: { control: false },
    text: { control: "text" },
  },
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof CapsuleSummary>;

export const Default: Story = {
  args: {
    text: "AI assistants will be standard for knowledge workers by 2030, fundamentally changing how we approach problem-solving and creativity.",
  },
};

export const ShortText: Story = {
  args: {
    text: "Key takeaway: sustainable computing is a business imperative.",
  },
};

export const LongText: Story = {
  args: {
    text: "AI assistants will be standard for knowledge workers by 2030, fundamentally changing how we approach problem-solving and creativity. The democratization of these tools means that sophisticated capabilities will be accessible to non-technical users across every industry and discipline.",
  },
};

export const RichContent: Story = {
  name: "Rich Content (ReactNode)",
  args: {
    text: (
      <>
        The session concluded that{" "}
        <strong className="font-semibold text-primary-blue-500">
          real-time translation
        </strong>{" "}
        will be a baseline expectation for global events, not a premium add-on.
      </>
    ),
  },
};
