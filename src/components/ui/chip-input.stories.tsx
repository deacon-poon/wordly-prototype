import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { ChipInput } from "./chip-input";

const meta: Meta<typeof ChipInput> = {
  title: "Core/ChipInput",
  component: ChipInput,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Text input that turns entries into removable chips. Press Enter or comma to commit; Backspace on an empty input removes the last chip. Controlled `value: string[]`.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ChipInput>;

/** Controlled wrapper so the chip array round-trips through state. */
function Controlled(props: React.ComponentProps<typeof ChipInput>) {
  const [value, setValue] = React.useState<string[]>(props.value ?? []);
  return (
    <div className="w-80">
      <ChipInput {...props} value={value} onValueChange={setValue} />
    </div>
  );
}

export const Default: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    label: "Tags",
    placeholder: "Add a tag",
    value: ["events", "translation"],
  },
};

export const Empty: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    label: "Attendee emails",
    placeholder: "Type an email and press Enter",
    value: [],
  },
};

export const UniqueValues: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    label: "Languages (no duplicates)",
    placeholder: "Add a language",
    uniqueValues: true,
    value: ["English", "Spanish"],
  },
};

/**
 * All portal chip variants (WordlyBadgeVariant): default, primary, secondary,
 * outline, info, destructive. `primary` and `info` map to Brand Blue / Action
 * Teal respectively per the prototype's brand mapping.
 */
export const Variants: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      <Controlled label="default" chipVariant="default" value={["draft"]} />
      <Controlled label="primary" chipVariant="primary" value={["live"]} />
      <Controlled
        label="secondary"
        chipVariant="secondary"
        value={["pending"]}
      />
      <Controlled label="outline" chipVariant="outline" value={["tag"]} />
      <Controlled label="info" chipVariant="info" value={["new"]} />
      <Controlled
        label="destructive"
        chipVariant="destructive"
        value={["error"]}
      />
    </div>
  ),
};

export const ChipVariantPrimary: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    label: "Topics",
    placeholder: "Add a topic",
    chipVariant: "primary",
    value: ["Keynote", "Q&A"],
  },
};

export const Required: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    label: "Invitees",
    required: true,
    placeholder: "Add an invitee",
    value: ["avery@wordly.ai"],
  },
};

export const ErrorState: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    label: "Domains",
    error: true,
    placeholder: "Add a domain",
    value: ["bad domain"],
  },
};

export const Disabled: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    label: "Tags",
    disabled: true,
    value: ["locked", "readonly"],
  },
};
