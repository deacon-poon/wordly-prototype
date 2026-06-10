import type { Meta, StoryObj } from "@storybook/react";
import { Lightbulb, Loader2 } from "lucide-react";

import { KeyTakeawaysCM } from "./KeyTakeawaysCM";

/**
 * `KeyTakeawaysCM` — a numbered list of key takeaways inside a summary card.
 * Ported from the production wordly-react-components-lib (MUI 6) to our
 * shadcn/Tailwind foundation. Brand Blue drives the number badges.
 */
const meta: Meta<typeof KeyTakeawaysCM> = {
  title: "Experience/Published Summaries/KeyTakeawaysCM",
  component: KeyTakeawaysCM,
  tags: ["autodocs"],
  argTypes: {
    icon: { control: false },
    body: { control: false },
    className: { control: false },
    titleAs: { control: false },
  },
  args: {
    icon: <Lightbulb className="text-primary-blue-400" />,
    title: "Key Takeaways",
  },
  decorators: [
    (Story) => (
      <div className="max-w-xl p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof KeyTakeawaysCM>;

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

/** No takeaways yet: header is preserved, body renders nothing. */
export const EmptyItems: Story = {
  args: {
    items: [],
  },
};

/**
 * In-progress placeholder state — section header preserved, body replaced
 * with an inline pending placeholder. Mirrors the digest page when a section's
 * status is `in_progress`. (The lib used a shared `PendingStateCM`; here it is
 * inlined to avoid a cross-component dependency in this single-component port.)
 */
export const Pending: Story = {
  args: {
    body: (
      <div className="flex items-center gap-3 px-5 pb-[21px] pt-5 text-sm text-muted-foreground">
        <Loader2 className="size-4 shrink-0 animate-spin text-primary-blue-400" />
        <span>Generating key takeaways from the session transcript…</span>
      </div>
    ),
  },
};

/** Title rendered as a real `h2` heading without changing its visual styling. */
export const SemanticHeading: Story = {
  args: {
    titleAs: "h2",
    items: [
      "Use `titleAs` to set the heading level for document outline / a11y.",
      "Visual styling stays identical regardless of the chosen element.",
    ],
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
