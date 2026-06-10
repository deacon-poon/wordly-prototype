import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { LanguageSelector } from "./language-selector";

const meta: Meta<typeof LanguageSelector> = {
  title: "Workspace Kit/LanguageSelector",
  component: LanguageSelector,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "React migration of the production Angular `wordly-language-selector`. " +
          "Single-select (dropdown) or multi-select (chips + add-more dialog), " +
          "searchable picker, max-selectable cap, detectable-only filter, a " +
          "sparkles remark for detectable languages, and loading/error/empty " +
          "states. Data via props (mock by default); no Angular DI layer.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    singleSelection: { control: "boolean" },
    searchable: { control: "boolean" },
    remarkSelectable: { control: "boolean" },
    onlyDetectable: { control: "boolean" },
    loading: { control: "boolean" },
    error: { control: "boolean" },
    disabled: { control: "boolean" },
    maxSelectable: { control: "number" },
  },
};

export default meta;
type Story = StoryObj<typeof LanguageSelector>;

/** Controlled wrapper so the stories reflect real selection state. */
function Controlled(props: React.ComponentProps<typeof LanguageSelector>) {
  const [value, setValue] = React.useState<string | string[]>(
    props.value ?? (props.singleSelection ? "" : [])
  );
  return (
    <div className="w-96">
      <LanguageSelector {...props} value={value} onValueChange={setValue} />
    </div>
  );
}

export const Basic: Story = {
  render: (args) => <Controlled {...args} />,
  args: { label: "Preferred Languages" },
};

export const SingleSelection: Story = {
  render: (args) => <Controlled {...args} />,
  args: { singleSelection: true, label: "Language", searchable: true },
};

export const WithSelectedChips: Story = {
  render: (args) => <Controlled {...args} />,
  args: { label: "Preferred Languages", value: ["en-US", "es-ES", "de-DE"] },
};

export const WithMaxSelectable: Story = {
  render: (args) => <Controlled {...args} />,
  args: { label: "Languages", maxSelectable: 3, value: ["en-US", "es-ES"] },
};

export const SingleSelectionError: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    singleSelection: true,
    label: "Language",
    error: true,
    required: true,
  },
};

export const DisabledWithSelection: Story = {
  render: (args) => <Controlled {...args} />,
  args: { label: "Languages", disabled: true, value: ["en-US", "fr-FR"] },
};

export const DetectableRemark: Story = {
  render: (args) => <Controlled {...args} />,
  args: { label: "Languages", remarkSelectable: true },
};

export const OnlyDetectable: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    label: "Detectable languages",
    onlyDetectable: true,
    remarkSelectable: true,
  },
};

export const Loading: Story = {
  render: (args) => <Controlled {...args} />,
  args: { label: "Languages", loading: true },
};

export const Error: Story = {
  render: (args) => <Controlled {...args} />,
  args: { label: "Languages", error: true },
};

export const Empty: Story = {
  render: (args) => <Controlled {...args} />,
  args: { label: "Languages", languages: [] },
};
