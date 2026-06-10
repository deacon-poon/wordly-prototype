import type { Meta, StoryObj } from "@storybook/react";

import { SpeakerListCM } from "./SpeakerListCM";

const meta: Meta<typeof SpeakerListCM> = {
  title: "Experience/Published Summaries/SpeakerListCM",
  component: SpeakerListCM,
  tags: ["autodocs"],
  argTypes: {
    className: { control: false },
    speakers: { control: "object" },
  },
};

export default meta;

type Story = StoryObj<typeof SpeakerListCM>;

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

export const ManySpeakers: Story = {
  args: {
    speakers: [
      "Dr. Sarah Chen",
      "John Smith",
      "Jane Doe",
      "Prof. Amara Okafor",
      "Liang Wei",
    ],
  },
};

/** Empty speaker list renders nothing. */
export const Empty: Story = {
  args: {
    speakers: [],
  },
};
