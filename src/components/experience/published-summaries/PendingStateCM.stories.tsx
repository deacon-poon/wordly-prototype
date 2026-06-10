import type { Meta, StoryObj } from "@storybook/react";
import { Lightbulb, FileText } from "lucide-react";

import { PendingStateCM } from "./PendingStateCM";

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
 * Shown the way it really appears: as the body of a published-summary
 * section card, header preserved while the content is still generating.
 * The card chrome here is a lightweight stand-in for KeyTakeawaysCM /
 * FullSummaryCM (header + body slot).
 */
export const InContext: Story = {
  render: () => (
    <div className="flex max-w-[800px] flex-col gap-4">
      <SectionCard
        icon={<Lightbulb className="size-5" />}
        title="Key Takeaways"
      >
        <PendingStateCM />
      </SectionCard>

      <SectionCard icon={<FileText className="size-5" />} title="Full Summary">
        <PendingStateCM />
      </SectionCard>
    </div>
  ),
};

function SectionCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <div className="mb-2 flex items-center gap-2 text-primary">
        {icon}
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      </div>
      {children}
    </div>
  );
}
