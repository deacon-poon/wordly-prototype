import type { Meta, StoryObj } from "@storybook/react";

import { PresenterTranscriptBubble } from "./PresenterTranscriptBubble";
import { TranscriptText } from "./TranscriptText";

/**
 * Mirrors the lib stories `App/Meeting/Transcript/PresenterTranscriptBubble/Component`
 * (Default, NoMetadata, DefaultAlignRight, NoMetadataAlignRight, OnlyText,
 * WithBorder), kept under our `Experience/Transcript` namespace.
 *
 * Like the lib, the transcript line is composed as a `<TranscriptText>` child.
 * Click the bubble to toggle the metadata row.
 */
const meta: Meta<typeof PresenterTranscriptBubble> = {
  title: "Experience/Transcript/PresenterTranscriptBubble",
  component: PresenterTranscriptBubble,
  tags: ["autodocs"],
  argTypes: {
    className: { control: false },
    color: { control: "color" },
    borderColor: { control: "color" },
    showBorder: { control: "boolean" },
    micName: {
      control: "text",
      description: "Speaker name shown above the bubble",
    },
    language: {
      control: "text",
      description: "Language shown in metadata when the bubble is clicked",
    },
    rtl: { control: "boolean" },
    isNewSpeaker: { control: "boolean" },
    children: { control: false },
  },
};

export default meta;

type Story = StoryObj<typeof PresenterTranscriptBubble>;

export const Default: Story = {
  args: {
    alignRight: false,
    showBorder: false,
    micName: "John Wick",
    language: "English US",
    rtl: false,
    isNewMicName: true,
    isNewSpeaker: true,
    children: <TranscriptText>Nice to meet you.</TranscriptText>,
  },
};

export const NoMetadata: Story = {
  args: {
    alignRight: false,
    showBorder: false,
    micName: "",
    language: "",
    rtl: false,
    isNewMicName: false,
    isNewSpeaker: false,
    children: <TranscriptText>Nice to meet you.</TranscriptText>,
  },
};

export const DefaultAlignRight: Story = {
  args: {
    alignRight: true,
    showBorder: false,
    micName: "John Wick",
    language: "Arabic",
    rtl: true,
    isNewMicName: true,
    isNewSpeaker: true,
    children: <TranscriptText rtl>هذا نص نموذجي</TranscriptText>,
  },
};

export const NoMetadataAlignRight: Story = {
  args: {
    alignRight: true,
    showBorder: false,
    micName: "",
    language: "",
    rtl: true,
    isNewSpeaker: false,
    children: <TranscriptText rtl>هذا نص نموذجي</TranscriptText>,
  },
};

export const OnlyText: Story = {
  args: {
    alignRight: false,
    showBorder: false,
    micName: "",
    language: "",
    rtl: false,
    isNewSpeaker: false,
    children: <TranscriptText>Nice to meet you.</TranscriptText>,
  },
};

export const WithBorder: Story = {
  args: {
    alignRight: false,
    showBorder: true,
    micName: "John Wick",
    language: "English US",
    rtl: false,
    isNewMicName: true,
    children: <TranscriptText>This message has a border.</TranscriptText>,
  },
};
