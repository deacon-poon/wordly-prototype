import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { ChipInput } from "./chip-input";

/**
 * ChipInput — React migration of the portal `app-wordly-chip-input`
 * (wordly_portal: libs/components/core/chip-input).
 *
 * Stories mirror the portal Overview.stories 1:1
 * (stories/core/wordly-chip-input/story-1.Overview.stories.ts):
 * Overview, With Preloaded Chips, Unique Values Only.
 *
 * Lets users type values and commit them as removable chips. Press Tab
 * (default) or blur to commit a chip; customize the commit keys via
 * `separatorKeys`. Press Backspace on an empty input to remove the last chip.
 */
const meta: Meta<typeof ChipInput> = {
  title: "Design System/Molecules/ChipInput",
  component: ChipInput,
  tags: ["autodocs"],
  argTypes: {
    chipVariant: {
      control: "select",
      options: [
        "outline",
        "default",
        "primary",
        "secondary",
        "info",
        "destructive",
      ],
      description: "Visual style of the chip badges",
    },
    uniqueValues: {
      control: "boolean",
      description: "Prevent duplicate chips from being added",
    },
    disabled: {
      control: "boolean",
      description: "Whether the input is disabled",
    },
    required: {
      control: "boolean",
      description: "Whether the field is required",
    },
  },
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof ChipInput>;

/**
 * Controlled wrapper so the stories behave like the portal reactive-forms
 * demos: typed entries commit to chips and persist across renders.
 */
function ControlledChipInput({
  initial = [],
  ...props
}: React.ComponentProps<typeof ChipInput> & { initial?: string[] }) {
  const [value, setValue] = React.useState<string[]>(initial);
  return (
    <div style={{ maxWidth: 480 }}>
      <ChipInput {...props} value={value} onValueChange={setValue} />
    </div>
  );
}

export const Overview: Story = {
  name: "Overview",
  render: (args) => <ControlledChipInput {...args} />,
  args: {
    label: "Presenters",
    placeholder: "Type a name and press Tab",
    helperText: "Add one or more presenter names",
    required: false,
    disabled: false,
    chipVariant: "outline",
    uniqueValues: false,
    separatorKeys: ["Tab"],
  },
};

export const WithPreloadedChips: Story = {
  name: "With Preloaded Chips",
  render: (args) => (
    <ControlledChipInput
      {...args}
      initial={["Alice Johnson", "Bob Smith", "Carol White"]}
    />
  ),
  args: {
    label: "Speakers",
    placeholder: "Add another speaker",
    helperText: "Pre-populated with existing speakers",
    chipVariant: "primary",
  },
};

export const UniqueValuesOnly: Story = {
  name: "Unique Values Only",
  render: (args) => <ControlledChipInput {...args} />,
  args: {
    label: "Tags",
    placeholder: "Type a tag and press Tab or comma",
    helperText: "Duplicate tags are silently ignored",
    chipVariant: "secondary",
    uniqueValues: true,
    separatorKeys: ["Tab", ","],
  },
};
