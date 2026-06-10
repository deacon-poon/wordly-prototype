import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { Chip } from "./chip";

const meta: Meta<typeof Chip> = {
  title: "Core/Chip",
  component: Chip,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "selected", "info"],
    },
    disabled: { control: "boolean" },
    selectable: { control: "boolean" },
    showCloseButton: { control: "boolean" },
    showHelpIcon: { control: "boolean" },
  },
  args: {
    text: "English (US)",
  },
};

export default meta;
type Story = StoryObj<typeof Chip>;

// --- Variants ---------------------------------------------------------------

export const Default: Story = {
  args: { text: "English (US)" },
};

export const Selected: Story = {
  args: { text: "Welsh - Cymraeg", variant: "selected" },
};

export const Info: Story = {
  args: { text: "Beta feature", variant: "info" },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Chip text="Default" variant="default" />
      <Chip text="Selected" variant="selected" />
      <Chip text="Info" variant="info" />
    </div>
  ),
};

/** Selectable hover states: default → blue border, selected → darker blue. */
export const SelectableStates: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Chip text="Default (hover me)" variant="default" selectable />
      <Chip text="Selected (hover me)" variant="selected" selectable />
      <Chip text="Disabled" variant="default" selectable disabled />
    </div>
  ),
};

// --- Dismissible ------------------------------------------------------------

export const Dismissible: Story = {
  args: {
    text: "Spanish (MX)",
    onRemove: () => {},
  },
};

/** A live filter-tag row: removing a chip drops it from local state. */
export const RemovableList: Story = {
  render: () => {
    const [tags, setTags] = React.useState([
      "English (US)",
      "Spanish (MX)",
      "French (FR)",
      "Welsh - Cymraeg",
    ]);
    return (
      <div className="flex flex-wrap items-center gap-2">
        {tags.length === 0 ? (
          <span className="text-sm text-gray-500">No languages selected</span>
        ) : (
          tags.map((t) => (
            <Chip
              key={t}
              text={t}
              onRemove={() => setTags((prev) => prev.filter((x) => x !== t))}
            />
          ))
        )}
      </div>
    );
  },
};

// --- Selectable (controlled) ------------------------------------------------

/** Selectable chips toggle a controlled `selected` state on click/Enter/Space. */
export const Selectable: Story = {
  render: () => {
    const LANGUAGES = ["English", "Spanish", "French", "German", "Japanese"];
    const [chosen, setChosen] = React.useState<Set<string>>(
      new Set(["Spanish"])
    );
    return (
      <div className="flex flex-wrap items-center gap-2">
        {LANGUAGES.map((lang) => (
          <Chip
            key={lang}
            text={lang}
            selectable
            selected={chosen.has(lang)}
            onSelectedChange={(next) =>
              setChosen((prev) => {
                const copy = new Set(prev);
                if (next) copy.add(lang);
                else copy.delete(lang);
                return copy;
              })
            }
          />
        ))}
      </div>
    );
  },
};

// --- Help icon --------------------------------------------------------------

export const WithHelpIcon: Story = {
  args: {
    text: "Advanced Option",
    variant: "info",
    showHelpIcon: true,
    helpText: "Additional language support is enabled for this session.",
  },
};

// --- Disabled ---------------------------------------------------------------

export const Disabled: Story = {
  args: {
    text: "Locked",
    disabled: true,
    onRemove: () => {},
  },
};
