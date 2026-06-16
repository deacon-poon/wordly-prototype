import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import {
  WordlyLanguageSelect,
  MOCK_LANGUAGE_OPTIONS,
  type LanguageOption,
} from "./WordlyLanguageSelect";

const meta: Meta<typeof WordlyLanguageSelect> = {
  title: "Experience/Meeting Settings/WordlyLanguageSelect",
  component: WordlyLanguageSelect,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    className: { control: false },
    languageOptions: { control: false },
    selectedLanguageList: { control: false },
    activeLanguage: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof WordlyLanguageSelect>;

/**
 * Interactive wrapper — wires the controlled props (selected list + active
 * language) to local state so the dropdown, pills, and active-swap behavior all
 * work live in Storybook. In production these would be fetched/persisted via the
 * meeting-settings API.
 */
function InteractiveLanguageSelect(
  args: React.ComponentProps<typeof WordlyLanguageSelect>
) {
  const [selected, setSelected] = React.useState<LanguageOption[]>(
    args.selectedLanguageList ?? [
      MOCK_LANGUAGE_OPTIONS[0],
      MOCK_LANGUAGE_OPTIONS[2],
    ]
  );
  const [active, setActive] = React.useState<LanguageOption>(
    args.activeLanguage ?? MOCK_LANGUAGE_OPTIONS[2]
  );

  return (
    <div className="w-[420px] max-w-full">
      <WordlyLanguageSelect
        {...args}
        selectedLanguageList={selected}
        activeLanguage={active}
        onSelectLanguages={setSelected}
        onRemoveLanguage={(code) =>
          setSelected((prev) => prev.filter((l) => l.wordlyCode !== code))
        }
        onChangeActiveLanguage={setActive}
      />
    </div>
  );
}

/** Default: searchable dropdown, Select All row, divider, ALS sparkles. */
export const Default: Story = {
  render: (args) => <InteractiveLanguageSelect {...args} />,
  args: {
    label: "Add a Language",
    showSelectAll: true,
    showDivider: true,
    compact: false,
  },
};

/** Compact: hides the leading Translate glyph and uses short pill labels. */
export const Compact: Story = {
  render: (args) => <InteractiveLanguageSelect {...args} />,
  args: {
    label: "Add a Language",
    compact: true,
    showSelectAll: true,
    showDivider: false,
  },
};

/**
 * Remove mode: pills hide their X until the user clicks the minus button to
 * enter "remove mode" (then it becomes a confirm check).
 */
export const RemoveMode: Story = {
  render: (args) => <InteractiveLanguageSelect {...args} />,
  args: {
    label: "Add a Language",
    enableRemoveView: true,
    showSelectAll: true,
    showDivider: true,
  },
};

/** Selecting from the dropdown also promotes the language to active. */
export const ChangeActiveOnSelect: Story = {
  render: (args) => <InteractiveLanguageSelect {...args} />,
  args: {
    label: "Add a Language",
    changeActiveLanguageWithDropdown: true,
    closeListboxOnSelect: false,
    showSelectAll: true,
    showDivider: true,
  },
};

/** Add button disabled — the selected pills remain visible and active-swappable. */
export const AddDisabled: Story = {
  render: (args) => <InteractiveLanguageSelect {...args} />,
  args: {
    label: "Add a Language",
    disableAdd: true,
    showDivider: true,
  },
};

/** Pills are read-only: no remove buttons, but the active language is still shown. */
export const RemoveDisabled: Story = {
  render: (args) => <InteractiveLanguageSelect {...args} />,
  args: {
    label: "Add a Language",
    disableRemove: true,
    showDivider: true,
  },
};
