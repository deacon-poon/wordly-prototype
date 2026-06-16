import type { Meta, StoryObj } from "@storybook/react";

import { SpeakerList } from "./SpeakerList";

const meta: Meta<typeof SpeakerList> = {
  title: "Experience/Published Summaries/SpeakerList",
  component: SpeakerList,
  tags: ["autodocs"],
  argTypes: {
    className: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof SpeakerList>;

export const SingleSpeaker: Story = {
  args: {
    speakers: ["Dr. Sarah Chen"],
  },
};

export const MultipleSpeakers: Story = {
  args: {
    speakers: ["Dr. Sarah Chen", "John Smith", "Jane Doe"],
  },
};

export const Empty: Story = {
  args: {
    speakers: [],
  },
};

/**
 * Mirrors the lib's `CustomColors` story: the Emotion-only `iconColor` /
 * `textColor` overrides. The hex values are Storybook demo inputs (not component
 * styling), matching the lib story exactly (brand pink icon, onyx text).
 */
export const CustomColors: Story = {
  args: {
    speakers: ["Dr. Sarah Chen", "John Smith"],
    iconColor: "#E6007E",
    textColor: "#121416",
  },
};
