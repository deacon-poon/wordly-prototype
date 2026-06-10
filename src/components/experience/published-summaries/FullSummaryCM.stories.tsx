import type { Meta, StoryObj } from "@storybook/react";
import { FileText, Loader2 } from "lucide-react";

import { FullSummaryCM } from "./FullSummaryCM";

const meta: Meta<typeof FullSummaryCM> = {
  title: "Experience/Published Summaries/FullSummaryCM",
  component: FullSummaryCM,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Displays a published full summary as a card with an icon + title header and a stacked-paragraph body. Port of the production lib `FullSummaryCM`, rebuilt on Tailwind tokens (MUI/Emotion removed). The `body` slot can replace paragraph content with a placeholder (pending / empty states).",
      },
    },
  },
  argTypes: {
    icon: { control: false },
    body: { control: false },
    className: { control: false },
  },
  args: {
    icon: <FileText className="text-primary" />,
    title: "Full Summary",
  },
};

export default meta;
type Story = StoryObj<typeof FullSummaryCM>;

export const Default: Story = {};

export const SingleParagraph: Story = {
  args: {
    title: "Brief Summary",
    paragraphs: [
      "The meeting covered quarterly results and upcoming product milestones. All teams reported progress on their key objectives.",
    ],
  },
};

/**
 * In-progress placeholder — header preserved, body replaced with a pending
 * placeholder via the `body` slot. Mirrors a section whose status is still
 * `in_progress` on the digest page.
 */
export const Pending: Story = {
  args: {
    body: (
      <div className="flex flex-col items-center gap-2 px-5 pb-[21px] pt-6 text-center">
        <Loader2
          className="size-6 animate-spin text-action-teal-500"
          aria-hidden="true"
        />
        <p className="text-base font-medium text-gray-900">
          Summary is being created
        </p>
        <p className="text-sm text-gray-500">
          The summary will be available soon.
        </p>
      </div>
    ),
  },
};

/**
 * Empty paragraph list — the body region renders nothing, leaving just the
 * section header.
 */
export const EmptyParagraphs: Story = {
  args: {
    title: "Summary Pending",
    paragraphs: [],
  },
};
