import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Building2, Globe, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Combobox,
  type ComboboxOptionType,
  type ComboboxProps,
} from "@/components/ui/combobox";

// ---------------------------------------------------------------------------
// Sample data
// ---------------------------------------------------------------------------

const LANGUAGES: ComboboxOptionType[] = [
  { label: "English", value: "en", shortLabel: "EN" },
  { label: "Spanish", value: "es", shortLabel: "ES" },
  { label: "French", value: "fr", shortLabel: "FR" },
  { label: "German", value: "de", shortLabel: "DE" },
  { label: "Japanese", value: "ja", shortLabel: "JA", disabled: true },
];

const GROUPED: ComboboxOptionType[] = [
  {
    groupLabel: "Shared Workspaces",
    showSeparator: true,
    options: [
      { label: "Acme Global Events", value: "ws-acme", icon: Building2 },
      {
        label: "Northwind Conferences",
        value: "ws-northwind",
        icon: Building2,
      },
    ],
  },
  {
    groupLabel: "Personal Workspaces",
    options: [
      { label: "Avery Chen", value: "ws-avery", icon: User },
      { label: "Jordan Patel", value: "ws-jordan", icon: User },
    ],
  },
];

const WITH_SHORTCUTS: ComboboxOptionType[] = [
  { label: "Profile", value: "profile", icon: User, shortcut: "Ctrl+P" },
  {
    label: "Workspace",
    value: "workspace",
    icon: Building2,
    shortcut: "Ctrl+W",
  },
  { label: "Language", value: "language", icon: Globe, shortcut: "Ctrl+L" },
];

// ---------------------------------------------------------------------------
// Controlled wrapper (the component is value-controlled)
// ---------------------------------------------------------------------------

function Controlled({ value: initial, ...props }: ComboboxProps) {
  const [value, setValue] = React.useState(initial ?? "");
  return (
    <div className="w-72">
      <Combobox {...props} value={value} onValueChange={setValue} />
    </div>
  );
}

const meta: Meta<typeof Combobox> = {
  title: "Core/Combobox",
  component: Combobox,
  tags: ["autodocs"],
  render: (args) => <Controlled {...args} />,
};

export default meta;
type Story = StoryObj<typeof Combobox>;

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const Default: Story = {
  args: {
    options: LANGUAGES,
    placeholder: "Select language",
    label: "Language",
  },
};

export const Preselected: Story = {
  args: {
    options: LANGUAGES,
    value: "fr",
    label: "Language",
  },
};

// --- Sizes (match the portal button sizes: sm h-8 / default h-9 / lg h-10) ---

export const SizeSmall: Story = {
  args: {
    options: LANGUAGES,
    size: "sm",
    placeholder: "Select language",
    label: "Small (h-8)",
  },
};

export const SizeDefault: Story = {
  args: {
    options: LANGUAGES,
    size: "default",
    placeholder: "Select language",
    label: "Default (h-9)",
  },
};

export const SizeLarge: Story = {
  args: {
    options: LANGUAGES,
    size: "lg",
    placeholder: "Select language",
    label: "Large (h-10)",
  },
};

export const Compact: Story = {
  args: {
    options: LANGUAGES,
    value: "de",
    compact: true,
    label: "Compact trigger (shows shortLabel)",
  },
};

export const Grouped: Story = {
  args: {
    options: GROUPED,
    placeholder: "Select workspace",
    label: "Workspace",
  },
};

export const GroupedIndented: Story = {
  args: {
    options: GROUPED,
    indentGroupedOptions: true,
    placeholder: "Select workspace",
    label: "Indented groups",
  },
};

export const WithIconsAndShortcuts: Story = {
  args: {
    options: WITH_SHORTCUTS,
    placeholder: "Jump to...",
    label: "Quick actions",
  },
};

export const ValueSearch: Story = {
  args: {
    options: LANGUAGES,
    enableValueSearch: true,
    placeholder: "Search by name or code (e.g. 'fr')",
    label: "Searches labels and values",
  },
};

export const Required: Story = {
  args: {
    options: LANGUAGES,
    placeholder: "Select language",
    label: "Language",
    required: true,
  },
};

export const Error: Story = {
  args: {
    options: LANGUAGES,
    placeholder: "Select language",
    label: "Language",
    error: true,
  },
};

export const Disabled: Story = {
  args: {
    options: LANGUAGES,
    value: "en",
    label: "Language",
    disabled: true,
  },
};

export const Readonly: Story = {
  args: {
    options: LANGUAGES,
    value: "es",
    label: "Language",
    readonly: true,
  },
};

export const WithFooter: Story = {
  args: {
    options: GROUPED,
    placeholder: "Select workspace",
    label: "Workspace",
    showFooter: true,
    footer: (
      <Button variant="ghost" size="sm" className="w-full justify-start">
        + Create workspace
      </Button>
    ),
  },
};
