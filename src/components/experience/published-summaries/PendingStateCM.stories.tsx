import type { Meta, StoryObj } from "@storybook/react";
import { Lightbulb, FileText } from "lucide-react";

import { PendingStateCM } from "./PendingStateCM";
import { KeyTakeawaysCM } from "./KeyTakeawaysCM";
import { FullSummaryCM } from "./FullSummaryCM";

const meta: Meta<typeof PendingStateCM> = {
  title: "Experience/Published Summaries/PendingStateCM",
  component: PendingStateCM,
  tags: ["autodocs"],
  argTypes: {
    className: { control: false },
  },
};

export default meta;

type Story = StoryObj<typeof PendingStateCM>;

/** Default copy — the section is still being generated. */
export const Default: Story = {
  args: {},
};

/** Custom heading + subtitle override the defaults. */
export const CustomCopy: Story = {
  args: {
    heading: "Processing transcript",
    subtitle: "Check back in a few minutes.",
  },
};

/**
 * Renders the placeholder as the body of `KeyTakeawaysCM` and `FullSummaryCM`,
 * with populated counterparts for visual comparison. Mirrors the lib's
 * `InContext` story / the Figma in-progress frames — section header preserved,
 * body replaced.
 */
export const InContext: Story = {
  render: () => (
    <div className="flex max-w-[800px] flex-col gap-4">
      <KeyTakeawaysCM
        icon={<Lightbulb className="text-primary-blue-400" />}
        title="Key Takeaways"
        body={<PendingStateCM />}
      />
      <KeyTakeawaysCM
        icon={<Lightbulb className="text-primary-blue-400" />}
        title="Key Takeaways"
        items={[
          "AI tools are becoming democratized and accessible to everyone",
          "Sustainable computing is no longer optional—it’s a business imperative",
          "Human-AI collaboration will define the next era of productivity",
        ]}
      />
      <FullSummaryCM
        icon={<FileText className="text-primary-blue-400" />}
        title="Full Summary"
        body={<PendingStateCM />}
      />
      <FullSummaryCM
        icon={<FileText className="text-primary-blue-400" />}
        title="Full Summary"
        paragraphs={[
          "Dr. Chen opened the conference with a compelling vision of technology’s trajectory over the next decade.",
          "A significant portion of the talk focused on the democratization of AI tools, predicting that by 2030 AI assistants will be standard.",
        ]}
      />
    </div>
  ),
};
