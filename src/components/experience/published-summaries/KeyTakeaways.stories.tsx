import type { Meta, StoryObj } from "@storybook/react";
import { CalendarClock, Lightbulb } from "lucide-react";

import { KeyTakeaways } from "./KeyTakeaways";

const meta: Meta<typeof KeyTakeaways> = {
  title: "Experience/Published Summaries/KeyTakeaways",
  component: KeyTakeaways,
  tags: ["autodocs"],
  argTypes: {
    icon: { control: false },
    body: { control: false },
    className: { control: false },
  },
  args: {
    icon: <Lightbulb className="text-primary" />,
    title: "Key Takeaways",
  },
  decorators: [
    (Story) => (
      <div className="max-w-xl p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof KeyTakeaways>;

export const Default: Story = {
  args: {
    items: [
      "AI tools are becoming democratized and accessible to everyone",
      "Sustainable computing is no longer optional—it’s a business imperative",
      "Human-AI collaboration will define the next era of productivity",
      "Organizations must adapt strategies while maintaining ethics",
    ],
  },
};

export const SingleItem: Story = {
  args: {
    title: "Key Takeaway",
    items: [
      "The quarterly revenue target was exceeded by 15%, driven primarily by new enterprise contracts.",
    ],
  },
};

export const EmptyItems: Story = {
  args: {
    items: [],
  },
};

/**
 * In-progress placeholder state — section header preserved, body replaced
 * with a centered pending placeholder. Mirrors the digest page when a
 * section's status is `in_progress`.
 */
export const Pending: Story = {
  args: {
    body: (
      <div className="flex flex-col items-center gap-2 py-6">
        <CalendarClock
          className="size-10 text-gray-300"
          strokeWidth={1.5}
          aria-hidden="true"
        />
        <p className="text-center text-base font-medium leading-6 text-gray-600">
          Summary is being created
        </p>
        <p className="text-center text-sm leading-5 text-gray-500">
          The summary will be available soon.
        </p>
      </div>
    ),
  },
};

export const ManyItems: Story = {
  args: {
    items: [
      "AI tools are becoming democratized and accessible to everyone",
      "Sustainable computing is no longer optional—it’s a business imperative",
      "Human-AI collaboration will define the next era of productivity",
      "Organizations must adapt strategies while maintaining ethics",
      "Data privacy regulations will continue to tighten globally",
      "Remote work infrastructure requires ongoing investment",
      "Cross-functional teams deliver higher-quality outcomes",
      "Customer feedback loops should be shortened to weekly cycles",
      "Technical debt reduction should be prioritized this quarter",
      "New onboarding processes reduced ramp-up time by 30%",
    ],
  },
};

/**
 * Custom heading level — `titleAs="h2"` renders a real `<h2>` for document
 * outline / a11y while keeping the same visual styling.
 */
export const CustomHeadingLevel: Story = {
  args: {
    titleAs: "h2",
    items: [
      "Renders the title as a real <h2> element",
      "Visual styling is unchanged",
    ],
  },
};
