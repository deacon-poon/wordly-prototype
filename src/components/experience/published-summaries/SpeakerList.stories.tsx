import type { Meta, StoryObj } from "@storybook/react";

import { SpeakerList } from "./SpeakerList";

const meta: Meta<typeof SpeakerList> = {
  title: "Experience/Published Summaries/SpeakerList",
  component: SpeakerList,
  tags: ["autodocs"],
  argTypes: {
    className: { control: false },
    iconClassName: { control: false },
    textClassName: { control: false },
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

export const CustomColors: Story = {
  args: {
    speakers: ["Dr. Sarah Chen", "John Smith"],
    iconClassName: "text-action-teal-500",
    textClassName: "text-gray-900",
  },
};
