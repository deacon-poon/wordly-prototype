import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { SelectItem, type SelectOption } from "./SelectItem";

const languageOptions: SelectOption[] = [
  { value: "en", label: "English (US)" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "ja", label: "Japanese" },
];

const numberOptions: SelectOption[] = [
  { value: 10, label: "Ten" },
  { value: 20, label: "Twenty" },
  { value: 30, label: "Thirty" },
];

const meta: Meta<typeof SelectItem> = {
  title: "Experience/Inputs/SelectItem",
  component: SelectItem,
  tags: ["autodocs"],
  args: {
    label: "Language",
    placeholder: "Choose an option",
    options: languageOptions,
  },
};

export default meta;
type Story = StoryObj<typeof SelectItem>;

export const Default: Story = {};

export const WithNumbers: Story = {
  args: {
    label: "Quantity",
    placeholder: "Select amount",
    options: numberOptions,
  },
};

export const WithDefaultValue: Story = {
  args: {
    defaultValue: "en",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: "fr",
  },
};

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = React.useState<string | number>("es");
    return (
      <div className="space-y-3">
        <SelectItem {...args} value={value} onChange={setValue} />
        <p className="text-sm text-muted-foreground">
          Selected value: <code className="font-mono">{String(value)}</code>
        </p>
      </div>
    );
  },
};

export const WithCustomColors: Story = {
  args: {
    colors: {
      label: "var(--primary)",
      text: "var(--primary)",
      border: "var(--primary)",
      placeholder: "var(--muted-foreground)",
    },
  },
};
