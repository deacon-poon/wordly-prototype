import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import {
  LanguageMultiSelect,
  MOCK_LANGUAGE_OPTIONS,
  type LanguageOption,
} from "./LanguageMultiSelect";

/**
 * `LanguageMultiSelect` is the shadcn/Tailwind migration of the production
 * meeting-settings multi-select (originally MUI 6 `Autocomplete`). It lets a
 * user pick multiple meeting languages from a searchable list, with a
 * "Select All" entry, a per-option dynamic-language indicator, dismissible
 * chips for the current selection, and clear/add affordances.
 */
const meta: Meta<typeof LanguageMultiSelect> = {
  title: "Experience/Meeting Settings/LanguageMultiSelect",
  component: LanguageMultiSelect,
  tags: ["autodocs"],
  argTypes: {
    className: { control: false },
    onSelectedLanguagesChange: { action: "selectedLanguagesChange" },
  },
  args: {
    label: "Add a Language",
    languageOptions: MOCK_LANGUAGE_OPTIONS,
    isMobile: false,
    selectAllLabel: "Select All",
    limitTags: 6,
    limitTagsMobile: 2,
  },
  decorators: [
    (Story) => (
      <div className="w-[420px] max-w-full p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof LanguageMultiSelect>;

/** Empty state — the floating label sits inline until focused or filled. */
export const Default: Story = {};

/** Pre-populated with a few selected languages, shown as dismissible chips. */
export const WithSelection: Story = {
  args: {
    selectedLanguages: [
      MOCK_LANGUAGE_OPTIONS[0],
      MOCK_LANGUAGE_OPTIONS[1],
      MOCK_LANGUAGE_OPTIONS[3],
    ],
  },
};

/** Every language selected — exercises the "Select All" / clear toggle. */
export const AllSelected: Story = {
  args: {
    selectedLanguages: [...MOCK_LANGUAGE_OPTIONS],
  },
};

/**
 * Mobile tag limit (2): selecting more than the limit collapses extras into a
 * "+N" overflow indicator.
 */
export const MobileTagLimit: Story = {
  args: {
    isMobile: true,
    limitTagsMobile: 2,
    selectedLanguages: [
      MOCK_LANGUAGE_OPTIONS[0],
      MOCK_LANGUAGE_OPTIONS[1],
      MOCK_LANGUAGE_OPTIONS[3],
      MOCK_LANGUAGE_OPTIONS[4],
    ],
  },
};

/** Interactive (uncontrolled-style) wrapper to demonstrate live selection. */
export const Interactive: Story = {
  render: (args) => {
    const [value, setValue] = React.useState<LanguageOption[]>([
      MOCK_LANGUAGE_OPTIONS[1],
    ]);
    return (
      <LanguageMultiSelect
        {...args}
        selectedLanguages={value}
        onSelectedLanguagesChange={setValue}
      />
    );
  },
};
