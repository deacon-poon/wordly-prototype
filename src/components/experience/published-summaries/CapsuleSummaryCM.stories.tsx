import type { Meta, StoryObj } from "@storybook/react";

import { CapsuleSummaryCM } from "./CapsuleSummaryCM";

const meta: Meta<typeof CapsuleSummaryCM> = {
  title: "Experience/Published Summaries/CapsuleSummaryCM",
  component: CapsuleSummaryCM,
  tags: ["autodocs"],
  argTypes: {
    text: { control: "text" },
    className: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Displays a brief capsule summary in a highlighted container. Ported from the MUI/Emotion production component to shadcn + Tailwind. Brand Blue tokens (primary-blue-25 background, primary-blue-100 border).",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof CapsuleSummaryCM>;

export const Default: Story = {
  args: {
    text: "AI assistants will be standard for knowledge workers by 2030, fundamentally changing how we approach problem-solving and creativity.",
  },
};

export const LongText: Story = {
  args: {
    text: "AI assistants will be standard for knowledge workers by 2030, fundamentally changing how we approach problem-solving and creativity. The democratization of these tools means that sophisticated capabilities will be accessible to non-technical users across every industry and discipline.",
  },
};

export const ShortText: Story = {
  args: {
    text: "Key takeaway: sustainable computing is a business imperative.",
  },
};

export const WithInlineFormatting: Story = {
  args: {
    text: (
      <>
        The single most important insight:{" "}
        <strong className="font-semibold text-primary-blue-500">
          real-time translation
        </strong>{" "}
        removes the language barrier from live events entirely.
      </>
    ),
  },
};
