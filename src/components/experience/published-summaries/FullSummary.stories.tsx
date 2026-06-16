import type { Meta, StoryObj } from "@storybook/react";
import { FileText } from "lucide-react";

import { FullSummary } from "./FullSummary";
import { PendingState } from "./PendingState";

const meta: Meta<typeof FullSummary> = {
  title: "Experience/Published Summaries/FullSummary",
  component: FullSummary,
  tags: ["autodocs"],
  argTypes: {
    icon: { control: false },
    body: { control: false },
    className: { control: false },
  },
};

export default meta;

type Story = StoryObj<typeof FullSummary>;

const summaryIcon = <FileText className="text-primary" />;

export const Default: Story = {
  args: {
    icon: summaryIcon,
    title: "Full Summary",
    paragraphs: [
      "Dr. Chen opened the conference with a compelling vision of technology’s trajectory over the next decade. She emphasized three key themes: the democratization of AI tools, the shift toward sustainable computing, and the growing importance of human-AI collaboration.",
      "The keynote began with a historical perspective on technological revolutions, drawing parallels between the current AI transformation and previous industrial shifts. Dr. Chen noted that unlike previous revolutions, the AI era will affect knowledge workers most profoundly.",
      "A significant portion of the talk focused on the democratization of AI tools. She demonstrated how platforms are making sophisticated AI capabilities accessible to non-technical users, predicting that by 2030, AI assistants will be standard in every knowledge worker’s toolkit.",
    ],
  },
};

export const SingleParagraph: Story = {
  args: {
    icon: summaryIcon,
    title: "Brief Summary",
    paragraphs: [
      "The meeting covered quarterly results and upcoming product milestones. All teams reported progress on their key objectives.",
    ],
  },
};

export const EmptyParagraphs: Story = {
  args: {
    icon: summaryIcon,
    title: "Summary Pending",
    paragraphs: [],
  },
};

/**
 * In-progress placeholder state — section header preserved, body replaced with
 * the `PendingState` placeholder. Mirrors the digest page when a section's
 * status is `'in_progress'`.
 */
export const Pending: Story = {
  args: {
    icon: summaryIcon,
    title: "Full Summary",
    body: <PendingState />,
  },
};

export const LongContent: Story = {
  args: {
    icon: summaryIcon,
    title: "Full Summary",
    paragraphs: [
      "Dr. Chen opened the conference with a compelling vision of technology’s trajectory over the next decade. She emphasized three key themes: the democratization of AI tools, the shift toward sustainable computing, and the growing importance of human-AI collaboration.",
      "The keynote began with a historical perspective on technological revolutions, drawing parallels between the current AI transformation and previous industrial shifts. Dr. Chen noted that unlike previous revolutions, the AI era will affect knowledge workers most profoundly.",
      "A significant portion of the talk focused on the democratization of AI tools. She demonstrated how platforms are making sophisticated AI capabilities accessible to non-technical users, predicting that by 2030, AI assistants will be standard in every knowledge worker’s toolkit.",
      "Dr. Chen also addressed the importance of sustainable computing, arguing that environmental responsibility is no longer optional but a business imperative. She highlighted how organizations must balance AI’s computational demands with energy efficiency goals.",
      "The keynote concluded with a call to action for organizations to begin their AI transformation journey now. She emphasized that companies treating AI as a collaborator rather than just a tool will have significant competitive advantages in the coming decade.",
    ],
  },
};
