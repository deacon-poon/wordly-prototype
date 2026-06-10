import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { Checkbox } from "./checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "Core/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

// Note: the prototype Checkbox is a bare Radix primitive (single export
// `Checkbox`, no CVA variants/sizes). It carries no label of its own, so the
// labelled/grouped stories compose it with a plain `label` to mirror the
// portal checkbox states (checked, unchecked, disabled, label placement, group).

// --- Bare states ------------------------------------------------------------

export const Unchecked: Story = {
  args: { checked: false },
};

export const Checked: Story = {
  args: { checked: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const DisabledChecked: Story = {
  args: { disabled: true, checked: true },
};

export const AllStates: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <Checkbox />
        <span className="text-xs text-gray-500">Unchecked</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Checkbox defaultChecked />
        <span className="text-xs text-gray-500">Checked</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Checkbox disabled />
        <span className="text-xs text-gray-500">Disabled</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Checkbox disabled defaultChecked />
        <span className="text-xs text-gray-500">Disabled checked</span>
      </div>
    </div>
  ),
};

// --- With label -------------------------------------------------------------

export const WithLabel: Story = {
  render: () => (
    <label className="flex items-center gap-2 text-sm text-gray-900">
      <Checkbox id="terms" defaultChecked />
      Accept terms and conditions
    </label>
  ),
};

/** Label on the left, checkbox on the far right (portal `checkboxEnd`). */
export const LabelEnd: Story = {
  render: () => (
    <label className="flex w-72 items-center justify-between text-sm text-gray-900">
      Enable notifications
      <Checkbox id="notify" defaultChecked />
    </label>
  ),
};

// --- Group (multiple options) ----------------------------------------------

/** Multiple checkboxes driving a controlled set, mirroring the portal options array. */
export const Group: Story = {
  render: () => {
    const LANGUAGES = ["English", "Spanish", "French", "German", "Japanese"];
    const [chosen, setChosen] = React.useState<Set<string>>(
      new Set(["English", "French"])
    );
    return (
      <fieldset className="flex flex-col gap-3">
        <legend className="mb-1 text-sm font-medium text-gray-700">
          Select languages
        </legend>
        {LANGUAGES.map((lang) => (
          <label
            key={lang}
            className="flex items-center gap-2 text-sm text-gray-900"
          >
            <Checkbox
              checked={chosen.has(lang)}
              onCheckedChange={(next) =>
                setChosen((prev) => {
                  const copy = new Set(prev);
                  if (next) copy.add(lang);
                  else copy.delete(lang);
                  return copy;
                })
              }
            />
            {lang}
          </label>
        ))}
      </fieldset>
    );
  },
};
