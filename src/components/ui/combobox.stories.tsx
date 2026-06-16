import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import {
  Calendar,
  User,
  Smile,
  Calculator,
  Settings,
  Wallet,
} from "lucide-react";

import {
  Combobox,
  type ComboboxOption,
  type ComboboxOptionType,
} from "./combobox";

/**
 * 1:1 mirror of the production Angular `WordlyCombobox` Overview stories
 *   wordly_portal: stories/core/wordly-combobox/story-1.Overview.stories.ts
 *
 * Searchable single-select on the shared Command + Popover primitives, wrapped
 * in the form-control wrapper. Same stories the portal exposes: Overview,
 * WithIcons, WithGroups (default + indented), Compact, Disabled, Readonly.
 *
 * The portal references lucide icons by string name (`lucideCalendar`, ...);
 * here the `icon` field is a lucide-react component, so the equivalents are
 * imported and assigned directly.
 */
const meta: Meta<typeof Combobox> = {
  title: "Design System/Molecules/Combobox",
  component: Combobox,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Simple searchable combobox component based on Spartan UI primitives.",
      },
    },
  },
  argTypes: {
    label: { control: "text" },
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
    readonly: { control: "boolean" },
    required: { control: "boolean" },
    value: { control: "text" },
    options: { control: "object" },
    error: { control: "boolean" },
    extraInfo: { control: "text" },
    showInfoIcon: { control: "boolean" },
    infoTooltipText: { control: "text" },
    helperText: { control: "text" },
    compact: { control: "boolean" },
    indentGroupedOptions: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Combobox>;

// Sample data (mirrors the portal Overview story data) ----------------------

const frameworkOptions: ComboboxOption[] = [
  { label: "AnalogJs", value: "123" },
  { label: "Angular", value: "1234" },
  { label: "React", value: "123456" },
  { label: "Vue", value: "1234567" },
  { label: "Svelte", value: "12345678" },
  { label: "NextJs", value: "123456789" },
];

const optionsWithIcons: ComboboxOption[] = [
  { label: "Calendar", value: "1", icon: Calendar },
  { label: "Profile", value: "2", icon: User },
  { label: "Settings", value: "3", icon: Settings, disabled: true },
];

const groupedOptions: ComboboxOptionType[] = [
  {
    groupLabel: "Suggestions",
    options: [
      { label: "Calendar", value: "calendar", icon: Calendar },
      { label: "Search Emoji", value: "1", icon: Smile },
      {
        label: "Calculator",
        value: "2",
        icon: Calculator,
        disabled: true,
      },
    ],
    showSeparator: true,
  },
  {
    groupLabel: "Settings",
    options: [
      { label: "Profile", value: "3", icon: User, shortcut: "⌘P" },
      { label: "Billing", value: "4", icon: Wallet, shortcut: "⌘B" },
      { label: "Settings", value: "5", icon: Settings, shortcut: "⌘S" },
    ],
  },
];

const combinedOptions: ComboboxOptionType[] = [
  ...frameworkOptions,
  ...optionsWithIcons,
  ...groupedOptions,
];

/** Controlled wrapper so a selection reflects live in the canvas. */
function ControlledCombobox(args: React.ComponentProps<typeof Combobox>) {
  const [value, setValue] = React.useState(args.value ?? "");
  return <Combobox {...args} value={value} onValueChange={setValue} />;
}

export const Overview: Story = {
  render: (args) => <ControlledCombobox {...args} />,
  args: {
    label: "Framework",
    placeholder: "Select framework...",
    options: combinedOptions,
    error: false,
    errorMessage: "Please select a value",
    disabled: false,
    readonly: false,
    required: false,
    extraInfo: "Choose the framework that best fits your project requirements",
    showInfoIcon: true,
    infoTooltipText:
      "The selected framework will determine your project structure, available features, and development workflow",
    helperText: "Start typing to search or click to see all available options",
  },
};

export const WithIcons: Story = {
  render: (args) => <ControlledCombobox {...args} />,
  args: {
    label: "Action",
    placeholder: "Choose an action...",
    options: optionsWithIcons,
    disabled: false,
    readonly: false,
    required: false,
    error: false,
    extraInfo: "Select an action to perform",
    showInfoIcon: true,
    infoTooltipText:
      "These actions will help you manage your account and preferences",
    helperText: "Choose from the available actions below",
  },
};

export const WithGroups: Story = {
  render: (args) => (
    <div className="flex flex-col gap-6" style={{ minWidth: 320 }}>
      <ControlledCombobox
        {...args}
        helperText="Default — options aligned with the group label"
      />
      <ControlledCombobox
        label="Command (indented)"
        placeholder={args.placeholder}
        options={groupedOptions}
        indentGroupedOptions
        helperText="indentGroupedOptions=true — options indented under each group label"
      />
    </div>
  ),
  args: {
    label: "Command",
    placeholder: "Type a command or search...",
    options: groupedOptions,
    disabled: false,
    readonly: false,
    required: false,
    error: false,
    extraInfo: "Commands are organized by category for easier navigation",
    showInfoIcon: true,
    infoTooltipText: "Use keyboard shortcuts when available for faster access",
    helperText: "Search or browse commands by category",
  },
};

export const Compact: Story = {
  render: (args) => <ControlledCombobox {...args} />,
  args: {
    label: "Timezone",
    placeholder: "Select timezone...",
    options: [
      { label: "New York", value: "America/New_York", shortLabel: "EDT" },
      {
        label: "Los Angeles",
        value: "America/Los_Angeles",
        shortLabel: "PDT",
      },
      { label: "London", value: "Europe/London", shortLabel: "GMT" },
      { label: "Tokyo", value: "Asia/Tokyo", shortLabel: "JST" },
      { label: "Sydney", value: "Australia/Sydney", shortLabel: "AEST" },
    ],
    compact: true,
    value: "America/New_York",
    helperText:
      "Compact mode shows the short label (abbreviation) in the trigger",
  },
};

export const Disabled: Story = {
  render: (args) => <ControlledCombobox {...args} />,
  args: {
    label: "Framework (Disabled)",
    options: frameworkOptions,
    disabled: true,
    value: "123456",
    helperText: "This combobox is disabled",
  },
};

export const Readonly: Story = {
  render: (args) => <ControlledCombobox {...args} />,
  args: {
    label: "Framework (Readonly)",
    options: frameworkOptions,
    readonly: true,
    value: "1234",
    helperText:
      "This combobox is readonly - you can see the value but cannot change it",
  },
};
