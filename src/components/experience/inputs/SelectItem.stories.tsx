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

/** Mirrors lib `WithCustomColors`: full color override set. */
export const WithCustomColors: Story = {
  args: {
    colors: {
      label: "hsl(var(--primary))",
      text: "hsl(var(--primary))",
      border: "hsl(var(--primary))",
      borderHover: "hsl(var(--primary))",
      borderFocused: "hsl(var(--primary))",
      placeholder: "hsl(var(--muted-foreground))",
    },
  },
};

/** Mirrors lib `WithDarkTheme`: dark color overrides on a dark surface. */
export const WithDarkTheme: Story = {
  args: {
    colors: {
      label: "#ffffff",
      background: "#000000",
      text: "#ffffff",
      border: "#757575",
      borderHover: "#9e9e9e",
      borderFocused: "#bdbdbd",
      placeholder: "#9e9e9e",
    },
  },
  parameters: {
    backgrounds: {
      default: "custom",
      values: [{ name: "custom", value: "#000000" }],
    },
  },
};
