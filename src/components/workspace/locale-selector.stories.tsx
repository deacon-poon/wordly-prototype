import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { LocaleSelector } from "./locale-selector";

const meta: Meta<typeof LocaleSelector> = {
  title: "Workspace Kit/LocaleSelector",
  component: LocaleSelector,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "React migration of the production Angular `wordly-locale-selector`. " +
          "A single-select locale picker (label, placeholder, required, " +
          "searchable, clearable) with loading/error/empty states. Data via " +
          "props (mock supported-locales by default); no Angular DI layer.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    searchable: { control: "boolean" },
    clearable: { control: "boolean" },
    required: { control: "boolean" },
    loading: { control: "boolean" },
    error: { control: "boolean" },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof LocaleSelector>;

/** Controlled wrapper so the stories reflect real selection state. */
function Controlled(props: React.ComponentProps<typeof LocaleSelector>) {
  const [value, setValue] = React.useState(props.value ?? "");
  return (
    <div className="w-80">
      <LocaleSelector {...props} value={value} onValueChange={setValue} />
    </div>
  );
}

export const Basic: Story = {
  render: (args) => <Controlled {...args} />,
  args: { label: "Language" },
};

export const Searchable: Story = {
  render: (args) => <Controlled {...args} />,
  args: { label: "Language", searchable: true, clearable: true },
};

export const Required: Story = {
  render: (args) => <Controlled {...args} />,
  args: { label: "Language", required: true },
};

/** Helper text beneath the control (portal wordlyHelperTextVariants). */
export const WithHelperText: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    label: "Language",
    helperText: "Choose the locale attendees will hear.",
  },
};

/** Pre-selected + clearable, showing the inline clear affordance. */
export const SelectedClearable: Story = {
  render: (args) => <Controlled {...args} />,
  args: { label: "Language", value: "es", clearable: true },
};

export const Loading: Story = {
  render: (args) => <Controlled {...args} />,
  args: { label: "Language", loading: true },
};

export const Error: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    label: "Language",
    error: true,
    errorMessage: "Failed to load locales",
  },
};

export const Empty: Story = {
  render: (args) => <Controlled {...args} />,
  args: { label: "Language", locales: [] },
};

export const Disabled: Story = {
  render: (args) => <Controlled {...args} />,
  args: { label: "Language", disabled: true },
};
