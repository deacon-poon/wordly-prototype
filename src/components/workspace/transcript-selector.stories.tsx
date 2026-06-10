import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { TranscriptSelector } from "./transcript-selector";

const meta: Meta<typeof TranscriptSelector> = {
  title: "Workspace Kit/TranscriptSelector",
  component: TranscriptSelector,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "React migration of the production Angular `wordly-transcript-selector`. " +
          "Single-select of transcript-save modes (None / Private / Public) with " +
          "label, helper text, required marker, and loading/error/empty states. " +
          "Data via props (mock by default); no Angular DI layer.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "inline-radio",
      options: ["default", "sm"],
      description:
        "Trigger height — portal data-size (default → h-9, sm → h-8).",
    },
    searchable: { control: "boolean" },
    required: { control: "boolean" },
    loading: { control: "boolean" },
    error: { control: "boolean" },
    disabled: { control: "boolean" },
    readonly: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof TranscriptSelector>;

/** Controlled wrapper so the stories reflect real selection state. */
function Controlled(props: React.ComponentProps<typeof TranscriptSelector>) {
  const [value, setValue] = React.useState(props.value ?? "");
  return (
    <div className="w-80">
      <TranscriptSelector {...props} value={value} onValueChange={setValue} />
    </div>
  );
}

export const Basic: Story = {
  render: (args) => <Controlled {...args} />,
  args: { label: "Transcript" },
};

export const Required: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    label: "Transcript",
    required: true,
    helperText: "Choose who can access the saved transcript.",
  },
};

export const Searchable: Story = {
  render: (args) => <Controlled {...args} />,
  args: { label: "Transcript", searchable: true },
};

export const Preselected: Story = {
  render: (args) => <Controlled {...args} />,
  args: { label: "Transcript", value: "all" },
};

/** Portal `data-size="sm"` trigger (h-8). */
export const Small: Story = {
  render: (args) => <Controlled {...args} />,
  args: { label: "Transcript", size: "sm", value: "all" },
};

export const Disabled: Story = {
  render: (args) => <Controlled {...args} />,
  args: { label: "Transcript", value: "presenter", disabled: true },
};

/** Readonly mirrors the portal `wordly-select-readonly` state (no interaction). */
export const Readonly: Story = {
  render: (args) => <Controlled {...args} />,
  args: { label: "Transcript", value: "presenter", readonly: true },
};

export const Loading: Story = {
  render: (args) => <Controlled {...args} />,
  args: { label: "Transcript", loading: true },
};

export const Error: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    label: "Transcript",
    error: true,
    errorMessage: "Transcript mode is required.",
  },
};

export const Empty: Story = {
  render: (args) => <Controlled {...args} />,
  args: { label: "Transcript", options: [] },
};
