import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { GlossarySelector } from "./glossary-selector";

const meta: Meta<typeof GlossarySelector> = {
  title: "Workspace Kit/GlossarySelector",
  component: GlossarySelector,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "React migration of the production Angular `wordly-glossary-selector`. " +
          "Single-select over a glossary list, with an optional 'None' entry, " +
          "label / helper text / error message, required, disabled, read-only, " +
          "loading and empty states. Data via props (mock by default); no " +
          "Angular DI/service layer.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "inline-radio",
      options: ["default", "sm"],
      description:
        "Trigger height — portal data-size: default (h-9) / sm (h-8).",
    },
    searchable: { control: "boolean" },
    displayNoneOption: { control: "boolean" },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
    readonly: { control: "boolean" },
    required: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof GlossarySelector>;

/** Controlled wrapper so the stories reflect real selection state. */
function Controlled(props: React.ComponentProps<typeof GlossarySelector>) {
  const [value, setValue] = React.useState(props.value ?? "");
  return (
    <div className="w-80">
      <GlossarySelector {...props} value={value} onValueChange={setValue} />
    </div>
  );
}

export const Basic: Story = {
  render: (args) => <Controlled {...args} />,
  args: { label: "Glossary" },
};

export const Searchable: Story = {
  render: (args) => <Controlled {...args} />,
  args: { label: "Glossary", searchable: true },
};

export const WithNoneOption: Story = {
  render: (args) => <Controlled {...args} />,
  args: { label: "Glossary", displayNoneOption: true },
};

export const Required: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    label: "Glossary",
    required: true,
    helperText: "Applied to all sessions in this event.",
  },
};

export const Loading: Story = {
  render: (args) => <Controlled {...args} />,
  args: { label: "Glossary", loading: true },
};

export const ErrorState: Story = {
  render: (args) => <Controlled {...args} />,
  args: { label: "Glossary", errorMessage: "Failed to load glossaries" },
};

export const Disabled: Story = {
  render: (args) => <Controlled {...args} />,
  args: { label: "Glossary", disabled: true },
};

export const ReadOnly: Story = {
  render: (args) => <Controlled {...args} />,
  args: { label: "Glossary", readonly: true, value: "gl-medical" },
};

/** Portal data-size="sm" → h-8 trigger. */
export const SmallSize: Story = {
  render: (args) => <Controlled {...args} />,
  args: { label: "Glossary", size: "sm" },
};

export const Empty: Story = {
  render: (args) => <Controlled {...args} />,
  args: { label: "Glossary", glossaries: [] },
};
