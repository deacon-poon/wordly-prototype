import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { TranscriptBubble } from "./TranscriptBubble";

const meta: Meta<typeof TranscriptBubble> = {
  title: "Experience/Transcript/TranscriptBubble",
  component: TranscriptBubble,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Chat-style bubble for a line of live transcription. Ported from the MUI library `TranscriptBubble`; the raw-hex `color`/`borderColor` props were replaced with a token-backed `tone` variant (Brand Blue stays primary). Supports left/right alignment, an optional border, a hover scrim, and a new-speaker indicator with a directional arrow.",
      },
    },
  },
  argTypes: {
    tone: {
      control: "select",
      options: ["muted", "primary", "success", "teal"],
    },
    alignRight: { control: "boolean" },
    showBorder: { control: "boolean" },
    showHoverEffect: { control: "boolean" },
    isNewSpeaker: { control: "boolean" },
    rtl: { control: "boolean" },
    children: { control: false },
  },
  args: {
    children:
      "Welcome everyone — today we'll walk through the new live-translation flow.",
    tone: "muted",
    alignRight: false,
    showBorder: false,
    showHoverEffect: false,
    isNewSpeaker: false,
    rtl: false,
  },
};

export default meta;

type Story = StoryObj<typeof TranscriptBubble>;

/** Another presenter's line — left-aligned, muted gray. */
export const OtherSpeaker: Story = {};

/** Your own speech — right-aligned, Brand Blue primary tone. */
export const YourSpeech: Story = {
  args: {
    children: "Sounds great, I can see the captions updating in real time.",
    tone: "primary",
    alignRight: true,
  },
};

/** New-speaker indicator above a left-aligned bubble. */
export const NewSpeakerLTR: Story = {
  args: { isNewSpeaker: true },
};

/** Right-to-left language: the arrow flips and the bubble aligns right. */
export const NewSpeakerRTL: Story = {
  args: {
    children: "مرحبا بالجميع، شكرا لانضمامكم إلى هذه الجلسة.",
    tone: "primary",
    alignRight: true,
    rtl: true,
    isNewSpeaker: true,
  },
};

/** Bordered variant (Brand Blue 2px border). */
export const WithBorder: Story = {
  args: { showBorder: true },
};

/** Clickable bubble with the darken-on-hover scrim. */
export const WithHoverEffect: Story = {
  args: { showHoverEffect: true },
};

/** A short conversation showing the two primary tones side by side. */
export const Conversation: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <TranscriptBubble tone="muted" isNewSpeaker>
        Thanks for joining — can everyone see the shared slides?
      </TranscriptBubble>
      <TranscriptBubble tone="muted">
        The captions are translating into Spanish for me, looks perfect.
      </TranscriptBubble>
      <TranscriptBubble tone="primary" alignRight isNewSpeaker>
        Great. I&apos;ll switch my output language to French now.
      </TranscriptBubble>
      <TranscriptBubble tone="primary" alignRight>
        Et voilà — the transcript follows along instantly.
      </TranscriptBubble>
    </div>
  ),
};
