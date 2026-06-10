import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import {
  ChipSelector,
  type ChipSelectorOption,
} from "@/components/ui/chip-selector";

const LANGUAGES: ChipSelectorOption[] = [
  { value: "en", text: "English" },
  { value: "es", text: "Spanish", help: "Including Latin American variants" },
  { value: "fr", text: "French" },
  { value: "de", text: "German" },
  { value: "ja", text: "Japanese" },
  { value: "zh", text: "Mandarin Chinese" },
  { value: "ar", text: "Arabic", help: "Modern Standard Arabic" },
  { value: "pt", text: "Portuguese" },
];

const meta: Meta<typeof ChipSelector> = {
  title: "Core/ChipSelector",
  component: ChipSelector,
  tags: ["autodocs"],
  args: {
    label: "Languages",
    options: LANGUAGES,
    itemTypeName: "languages",
  },
};
export default meta;

type Story = StoryObj<typeof ChipSelector>;

/** Controlled wrapper — the component is fully controlled via value/onValueChange. */
function Controlled({
  initial = [],
  ...props
}: { initial?: string[] } & Omit<
  React.ComponentProps<typeof ChipSelector>,
  "value" | "onValueChange"
>) {
  const [value, setValue] = React.useState<string[]>(initial);
  return <ChipSelector value={value} onValueChange={setValue} {...props} />;
}

export const Empty: Story = {
  render: (args) => <Controlled {...args} />,
};

export const WithSelection: Story = {
  render: (args) => <Controlled initial={["en", "es"]} {...args} />,
};

export const Searchable: Story = {
  render: (args) => <Controlled initial={["fr"]} {...args} searchable />,
};

export const WithMaxLimit: Story = {
  render: (args) => (
    <Controlled initial={["en"]} {...args} maxSelectable={3} searchable />
  ),
};

export const MaxLimitReached: Story = {
  name: "Max limit reached (Add disabled)",
  render: (args) => (
    <Controlled initial={["en", "es", "fr"]} {...args} maxSelectable={3} />
  ),
};

export const WithHelpTooltips: Story = {
  render: (args) => (
    <Controlled initial={["es", "ar"]} {...args} showChipInfoTooltip />
  ),
};

export const ShowAllInPicker: Story = {
  name: "Picker shows selected options",
  render: (args) => (
    <Controlled initial={["en", "de"]} {...args} hideSelectedOptions={false} />
  ),
};

export const Required: Story = {
  render: (args) => <Controlled {...args} required />,
};

export const Disabled: Story = {
  render: (args) => <Controlled initial={["en", "fr"]} {...args} disabled />,
};

export const ReadOnly: Story = {
  render: (args) => <Controlled initial={["en", "ja"]} {...args} readOnly />,
};

export const Loading: Story = {
  render: (args) => <Controlled {...args} isLoading />,
};

export const ErrorState: Story = {
  render: (args) => (
    <Controlled
      {...args}
      hasError
      onRetry={() => console.log("retry clicked")}
    />
  ),
};
