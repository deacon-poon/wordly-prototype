import type { Meta, StoryObj } from "@storybook/react";

import { PendingState } from "./PendingState";

const meta: Meta<typeof PendingState> = {
  title: "Experience/Published Summaries/PendingState",
  component: PendingState,
  tags: ["autodocs"],
  argTypes: {
    className: { control: false },
    heading: { control: "text" },
    subtitle: { control: "text" },
  },
};

export default meta;

type Story = StoryObj<typeof PendingState>;

/** Default placeholder shown while a summary section is being generated. */
export const Default: Story = {
  args: {},
};

/** Custom copy for a different processing context (e.g. transcript step). */
export const CustomCopy: Story = {
  args: {
    heading: "Processing transcript",
    subtitle: "Check back in a few minutes.",
  },
};

/** Rendered inside a card-like host to show how it sits within section chrome. */
export const InSectionCard: Story = {
  render: (args) => (
    <div className="w-[400px] rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="mb-2 text-sm font-semibold text-gray-900">
        Key Takeaways
      </h3>
      <PendingState {...args} />
    </div>
  ),
  args: {},
};
