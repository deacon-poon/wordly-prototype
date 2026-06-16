import type { Meta, StoryObj } from "@storybook/react";

import { Footer } from "./Footer";

const meta: Meta<typeof Footer> = {
  title: "Experience/Branding/Footer",
  component: Footer,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Responsive Wordly footer with AI interpretation, privacy, and terms links, plus copyright and an optional version string. Collapses from a single row on desktop, to two rows on tablet, to four rows on mobile. Ported from the MUI 6 + Emotion lib component to shadcn/Tailwind with Brand Blue as primary.",
      },
    },
  },
  argTypes: {
    className: { control: false },
  },
};

export default meta;

type Story = StoryObj<typeof Footer>;

export const Default: Story = {
  args: {},
};

export const WithVersion: Story = {
  args: {
    version: "3.0.2",
  },
};

export const CustomLabels: Story = {
  args: {
    aiInterpretationLabel: "Powered by Wordly",
    privacyPolicyLabel: "Privacy",
    termsOfServiceLabel: "Terms",
    companyName: "Acme Corp.",
    version: "1.2.3",
  },
};

/** Narrow viewport: the footer collapses to four stacked rows. */
export const Mobile: Story = {
  args: {
    version: "3.0.2",
  },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};
