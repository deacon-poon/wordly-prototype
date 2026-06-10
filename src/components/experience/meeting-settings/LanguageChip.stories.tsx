import type { Meta, StoryObj } from "@storybook/react";

import { LanguageChip } from "./LanguageChip";

/**
 * `LanguageChip` is the shadcn/Tailwind migration of the production lib
 * `LanguageChip` (MUI 6 + Emotion). It shows a language as a selectable,
 * dismissible pill in the meeting language settings UI.
 */
const meta = {
  title: "Experience/Meeting Settings/LanguageChip",
  component: LanguageChip,
  tags: ["autodocs"],
  args: {
    label: "English (US)",
    hasError: false,
    isDisabled: false,
    isSelected: false,
    isALSSupported: false,
    hideRemoveButton: false,
    onRemove: () => {},
    onSelected: () => {},
    ariaLabels: {
      languageChipSelected: "Selected",
      languageChipNotSelected: "Not selected",
      languageChipALSNotSupported: "ALS not supported",
    },
  },
} satisfies Meta<typeof LanguageChip>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Resting / outlined state. */
export const Default: Story = {};

/** Selected — filled with Brand Blue, white content. */
export const Selected: Story = {
  args: { label: "Korean — 한국어", isSelected: true },
};

/** Error — destructive border + text, not clickable. */
export const Error: Story = {
  args: { label: "French (FR)", hasError: true },
};

/** Disabled — dimmed and not interactive. */
export const Disabled: Story = {
  args: { label: "Japanese — 日本語", isDisabled: true },
};

/** ALS supported — shows the sparkle decorator. */
export const ALSSupported: Story = {
  args: { label: "Arabic — العربية", isALSSupported: true },
};

/** ALS supported while selected — sparkle goes white on the Brand Blue fill. */
export const ALSSelected: Story = {
  args: { label: "Spanish — Español", isALSSupported: true, isSelected: true },
};

/** Remove button hidden — display-only chip. */
export const HideRemoveButton: Story = {
  args: { label: "Spanish — Español", hideRemoveButton: true },
};

/** A wrapping row of chips, as they appear in the settings list. */
export const ChipRow: Story = {
  render: () => (
    <div className="flex max-w-md flex-wrap gap-2">
      <LanguageChip label="English (US)" isSelected />
      <LanguageChip label="Spanish — Español" isALSSupported />
      <LanguageChip label="French (FR)" />
      <LanguageChip label="German — Deutsch" hasError />
      <LanguageChip label="Japanese — 日本語" isDisabled />
      <LanguageChip label="Arabic — العربية" isALSSupported isSelected />
    </div>
  ),
};
