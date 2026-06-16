import type { Meta, StoryObj } from "@storybook/react";

import { TranscriptText } from "./TranscriptText";

/**
 * Mirrors the lib stories `App/Meeting/Transcript/TranscriptText/Component`
 * (Default + Rtl), kept under our `Experience/Transcript` namespace.
 */
const meta: Meta<typeof TranscriptText> = {
  title: "Experience/Transcript/TranscriptText",
  component: TranscriptText,
  tags: ["autodocs"],
  argTypes: {
    className: { control: false },
    textColor: { control: "color" },
  },
};

export default meta;

type Story = StoryObj<typeof TranscriptText>;

export const Default: Story = {
  args: {
    rtl: false,
    children: "Lorem ipsum",
    textColor: "#1F1F1F",
  },
};

export const Rtl: Story = {
  args: {
    rtl: true,
    children: "هذا نص نموذجي",
    textColor: "#1F1F1F",
  },
};
