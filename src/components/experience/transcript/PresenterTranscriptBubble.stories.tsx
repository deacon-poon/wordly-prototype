import type { Meta, StoryObj } from "@storybook/react";

import { PresenterTranscriptBubble } from "./PresenterTranscriptBubble";

const meta: Meta<typeof PresenterTranscriptBubble> = {
  title: "Experience/Transcript/PresenterTranscriptBubble",
  component: PresenterTranscriptBubble,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Chat-style presenter transcription bubble. Click the bubble to toggle the speaker/language metadata row. Ported from the MUI/Emotion `PresenterTranscriptBubble` in wordly-react-components-lib onto shadcn + Tailwind tokens.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["neutral", "teal", "green"],
    },
    alignRight: { control: "boolean" },
    rtl: { control: "boolean" },
    showBorder: { control: "boolean" },
    isNewMicName: { control: "boolean" },
    isNewSpeaker: { control: "boolean" },
    defaultMetadataOpen: { control: "boolean" },
    text: { control: "text" },
    micName: { control: "text" },
    language: { control: "text" },
  },
  args: {
    text: "Nice to meet you.",
    micName: "John Wick",
    language: "English US",
    variant: "neutral",
    alignRight: false,
    rtl: false,
    showBorder: false,
    isNewMicName: true,
    isNewSpeaker: true,
    defaultMetadataOpen: false,
  },
};

export default meta;

type Story = StoryObj<typeof PresenterTranscriptBubble>;

/** Default: left-aligned, with mic-name label and new-speaker indicator. */
export const Default: Story = {};

/** No metadata label or indicator — just the bubble. */
export const NoMetadata: Story = {
  args: {
    isNewMicName: false,
    isNewSpeaker: false,
    micName: undefined,
    language: undefined,
  },
};

/** Right-aligned RTL bubble (e.g. Arabic), with the tail on the top-right. */
export const AlignRightRTL: Story = {
  args: {
    text: "هذا نص نموذجي",
    micName: "John Wick",
    language: "Arabic",
    alignRight: true,
    rtl: true,
    isNewMicName: true,
    isNewSpeaker: true,
  },
};

/** Bubble with a colored teal border (lib `showBorder`). */
export const WithBorder: Story = {
  args: {
    text: "This message has a border.",
    showBorder: true,
    variant: "neutral",
    isNewSpeaker: false,
  },
};

/** Metadata row expanded by default (the click-to-toggle target). */
export const MetadataExpanded: Story = {
  args: {
    defaultMetadataOpen: true,
  },
};

/** Teal fill variant (lib `wordlyBlue` → our `action-teal-*`). */
export const TealVariant: Story = {
  args: {
    variant: "teal",
    text: "How is the weather over there today?",
  },
};

/** Green fill variant mapped to `accent-green-*`. */
export const GreenVariant: Story = {
  args: {
    variant: "green",
    text: "Thanks, that worked perfectly.",
    micName: "Ada Lovelace",
    language: "English UK",
  },
};

/** A short back-and-forth showing left/right alignment in a column. */
export const Conversation: Story = {
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-2">
      <PresenterTranscriptBubble
        text="Welcome everyone, can you hear me clearly?"
        micName="John Wick"
        language="English US"
        isNewMicName
        isNewSpeaker
      />
      <PresenterTranscriptBubble
        text="نعم، نسمعك جيدًا."
        micName="Layla Hassan"
        language="Arabic"
        alignRight
        rtl
        variant="teal"
        isNewMicName
        isNewSpeaker
      />
      <PresenterTranscriptBubble
        text="Great, let's get started."
        micName="John Wick"
        language="English US"
      />
    </div>
  ),
};
