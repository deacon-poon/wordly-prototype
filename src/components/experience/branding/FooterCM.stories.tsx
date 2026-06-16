import type { Meta, StoryObj } from "@storybook/react";

import { FooterCM } from "./FooterCM";

const meta: Meta<typeof FooterCM> = {
  title: "Experience/Branding/FooterCM",
  component: FooterCM,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    className: { control: false },
  },
};

export default meta;

type Story = StoryObj<typeof FooterCM>;

/** Default footer — brand link, legal links, and copyright with the current year. */
export const Default: Story = {
  args: {},
};

/** Adds a trailing "Version X" segment after the copyright line. */
export const WithVersion: Story = {
  args: {
    version: "3.0.2",
  },
};

/** Every label and the company name overridden, with a version. */
export const CustomLabels: Story = {
  args: {
    aiInterpretationLabel: "Powered by Wordly",
    privacyPolicyLabel: "Privacy",
    termsOfServiceLabel: "Terms",
    companyName: "Acme Corp.",
    version: "1.2.3",
  },
};

/**
 * Narrow viewport: pipe separators collapse and the segments wrap onto
 * their own lines (full-width breakers force the wraps).
 */
export const NarrowViewport: Story = {
  args: {
    version: "3.0.2",
  },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
  decorators: [
    (Story) => (
      <div className="max-w-[360px] border border-gray-200">
        <Story />
      </div>
    ),
  ],
};
