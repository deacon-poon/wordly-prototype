import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import {
  LanguageSelect,
  MOCK_LANGUAGES,
  type LanguageOption,
} from "./LanguageSelect";

const meta: Meta<typeof LanguageSelect> = {
  title: "Experience/Meeting Settings/LanguageSelect",
  component: LanguageSelect,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Port of the production MUI `LanguageSelect`, rebuilt on shadcn Command + Popover. Picks from the list of Wordly-supported languages with a searchable list and a check icon on the selected row. `compact` swaps the long display name for a short one. In production the language list is fetched from the API.",
      },
    },
  },
  argTypes: {
    handleChange: { action: "handleChange" },
    languages: { control: false },
  },
};

export default meta;

type Story = StoryObj<typeof LanguageSelect>;

/**
 * Controlled wrapper so the selection (and its check icon) updates on click,
 * mirroring the lib's controlled story template.
 */
function Controlled({
  value: initialValue = "en",
  handleChange,
  ...args
}: React.ComponentProps<typeof LanguageSelect>) {
  const [value, setValue] = React.useState<string | undefined>(initialValue);
  return (
    <div className="w-80">
      <LanguageSelect
        {...args}
        value={value}
        handleChange={(next) => {
          setValue(next);
          handleChange?.(next);
        }}
      />
    </div>
  );
}

export const Default: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    label: "Select a language",
    value: "en",
    "aria-label": "Language select",
    languages: MOCK_LANGUAGES,
  },
};

export const Compact: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    ...Default.args,
    label: "Language",
    compact: true,
  },
};

export const NoLabel: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    label: undefined,
    value: "ja",
    "aria-label": "Language select",
    languages: MOCK_LANGUAGES,
  },
};

export const Unselected: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    label: "Select a language",
    value: undefined,
    languages: MOCK_LANGUAGES,
  },
};

export const WithoutSearch: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    ...Default.args,
    searchable: false,
  },
};

export const Disabled: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    ...Default.args,
    disabled: true,
  },
};

const SHORT_LIST: LanguageOption[] = [
  {
    wordlyCode: "en",
    displayName: "English (US)",
    compactDisplayName: "English",
  },
  {
    wordlyCode: "ja",
    displayName: "Japanese — 日本語",
    compactDisplayName: "Japanese",
  },
  {
    wordlyCode: "ko",
    displayName: "Korean — 한국어",
    compactDisplayName: "Korean",
  },
  {
    wordlyCode: "ar",
    displayName: "Arabic — العربية",
    compactDisplayName: "Arabic",
  },
];

export const CustomLanguageList: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    label: "Select a language",
    value: "ja",
    languages: SHORT_LIST,
  },
};
