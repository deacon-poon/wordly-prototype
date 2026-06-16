import type { Meta, StoryObj } from "@storybook/react";

import { WordlyFooter } from "./WordlyFooter";

const meta: Meta<typeof WordlyFooter> = {
  title: "Experience/Branding/WordlyFooter",
  component: WordlyFooter,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  args: {
    version: "1.0.0",
    ariaLabels: {
      footerHomeLink: "Wordly AI Home",
    },
  },
};

export default meta;

type Story = StoryObj<typeof WordlyFooter>;

/** Default footer with a version line. */
export const Default: Story = {};

/** Version omitted — the version line is hidden. */
export const NoVersion: Story = {
  args: {
    version: "",
  },
};

/** Localized copy via the `translations` prop. */
export const Localized: Story = {
  args: {
    version: "2.4.1",
    translations: {
      footerHomeLink: "Interprétation Wordly AI",
      privacyPolicy: "Politique de confidentialité",
      termsOfService: "Conditions d'utilisation",
      version: "Version",
    },
    ariaLabels: {
      footerHomeLink: "Accueil Wordly AI",
    },
  },
};

/** Rendered on a dark surface via `className` (replaces the MUI `sx` prop). */
export const OnDarkSurface: Story = {
  render: (args) => (
    <div className="bg-primary-navy-900 p-8">
      <WordlyFooter {...args} />
    </div>
  ),
};
