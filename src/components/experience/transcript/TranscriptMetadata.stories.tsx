import type { Meta, StoryObj } from "@storybook/react";

import { TranscriptMetadata } from "./TranscriptMetadata";

/**
 * Mirrors the lib stories `App/Meeting/Transcript/TranscriptMetadata/Component`
 * (LTRText, RTLText, NoLanguage), kept under our `Experience/Transcript`
 * namespace. Speaker name (or mic-name fallback) + an italic language label;
 * `alignRight` right-justifies the row.
 */
const meta = {
  title: "Experience/Transcript/TranscriptMetadata",
  component: TranscriptMetadata,
  tags: ["autodocs"],
  argTypes: {
    className: { control: false },
    nameColor: { control: "color" },
    languageColor: { control: "color" },
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
    nameColor: "#000",
    languageColor: "#999",
  },
};

export const RTLText: Story = {
  args: {
    name: "Michael Scott",
    alignRight: true,
    language: "Arabic - عربى",
    nameColor: "#000",
    languageColor: "#999",
  },
};

export const NoLanguage: Story = {
  args: {
    name: "Michael Scott",
    alignRight: false,
    language: "",
    nameColor: "#000",
    languageColor: "#999",
  },
};
