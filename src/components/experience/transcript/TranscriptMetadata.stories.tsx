import type { Meta, StoryObj } from "@storybook/react";

import { TranscriptMetadata } from "./TranscriptMetadata";

const meta = {
  title: "Experience/Transcript/TranscriptMetadata",
  component: TranscriptMetadata,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Speaker metadata row for a transcript phrase: a name (or mic-name fallback) and an italic language label. `alignRight` right-justifies and reverses the order; `boldName`, `size`, and token `tone` props control appearance. Ported from the MUI/Emotion lib component to shadcn/Tailwind.",
      },
    },
  },
  argTypes: {
    nameTone: {
      control: "select",
      options: [
        "default",
        "muted",
        "primary",
        "success",
        "destructive",
        "teal",
      ],
    },
    languageTone: {
      control: "select",
      options: [
        "default",
        "muted",
        "primary",
        "success",
        "destructive",
        "teal",
      ],
    },
    size: {
      control: "inline-radio",
      options: ["xs", "sm", "base"],
    },
  },
  decorators: [
    (Story) => (
      <div className="w-80 rounded-md border border-gray-200 p-3">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TranscriptMetadata>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LTRText: Story = {
  args: {
    name: "Michael Scott",
    alignRight: false,
    language: "English",
  },
};

export const RTLText: Story = {
  args: {
    name: "Michael Scott",
    alignRight: true,
    language: "Arabic - عربى",
  },
};

export const NoLanguage: Story = {
  args: {
    name: "Michael Scott",
    alignRight: false,
    language: "",
  },
};

export const BoldName: Story = {
  args: {
    name: "Michael Scott",
    language: "English",
    boldName: true,
  },
};

export const MicNameFallback: Story = {
  args: {
    name: "",
    micName: "Conference Room Mic 2",
    language: "Spanish",
  },
};

export const PrimaryTone: Story = {
  args: {
    name: "Pam Beesly",
    language: "French",
    nameTone: "primary",
    boldName: true,
  },
};

export const LargerSize: Story = {
  args: {
    name: "Dwight Schrute",
    language: "German",
    size: "base",
    nameTone: "success",
  },
};
