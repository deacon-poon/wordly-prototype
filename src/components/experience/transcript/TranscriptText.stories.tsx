import type { Meta, StoryObj } from "@storybook/react";

import { TranscriptText } from "./TranscriptText";

const meta: Meta<typeof TranscriptText> = {
  title: "Experience/Transcript/TranscriptText",
  component: TranscriptText,
  tags: ["autodocs"],
  argTypes: {
    className: { control: false },
    component: { control: false },
    variant: {
      control: "select",
      options: [
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "subtitle1",
        "subtitle2",
        "body1",
        "body2",
        "caption",
        "overline",
      ],
    },
    tone: {
      control: "select",
      options: ["default", "muted", "subtle", "primary", "success", "error"],
    },
    rtl: { control: "boolean" },
  },
  args: {
    rtl: false,
    variant: "body1",
    tone: "default",
    children:
      "Thank you all for joining today's session. We'll get started in just a moment.",
  },
};

export default meta;

type Story = StoryObj<typeof TranscriptText>;

export const Default: Story = {};

export const RightToLeft: Story = {
  args: {
    rtl: true,
    children: "شكرًا لجميع الحاضرين. سنبدأ الجلسة بعد لحظات.",
  },
};

export const Muted: Story = {
  args: {
    tone: "muted",
    children: "Speaker is connecting…",
  },
};

export const PrimaryTone: Story = {
  args: {
    tone: "primary",
    children: "Live caption highlighted for the active speaker.",
  },
};

export const ErrorTone: Story = {
  args: {
    tone: "error",
    children: "Translation unavailable for this segment.",
  },
};

export const VariantScale: Story = {
  render: () => (
    <div className="space-y-3">
      <TranscriptText variant="h4">Session heading (h4)</TranscriptText>
      <TranscriptText variant="subtitle1">
        Subtitle line (subtitle1)
      </TranscriptText>
      <TranscriptText variant="body1">
        Body 1 — the default transcript line size, comfortable for reading and
        responsive across viewports.
      </TranscriptText>
      <TranscriptText variant="body2">
        Body 2 — a denser line used for secondary transcript content.
      </TranscriptText>
      <TranscriptText variant="caption" tone="subtle">
        Caption — timestamps and metadata
      </TranscriptText>
      <TranscriptText variant="overline" tone="subtle">
        Overline label
      </TranscriptText>
    </div>
  ),
};
