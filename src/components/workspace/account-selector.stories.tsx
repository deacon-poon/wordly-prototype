import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { AccountSelector, type Account } from "./account-selector";

const meta: Meta<typeof AccountSelector> = {
  title: "Workspace Kit/AccountSelector",
  component: AccountSelector,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "React migration of the production Angular `wordly-account-selector`. " +
          "Single-select over accounts with an `ownAccounts` filter, a " +
          "customizable `labelFormatter`, an optional owner/minutes detail line, " +
          "and loading/error/empty states. Data via props (mock by default); no " +
          "Angular DI or AccountService layer.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "inline-radio",
      options: ["default", "sm"],
      description: "Control height — portal data-size (default h-9 / sm h-8).",
    },
    ownAccounts: { control: "boolean" },
    showDetail: { control: "boolean" },
    searchable: { control: "boolean" },
    clearable: { control: "boolean" },
    loading: { control: "boolean" },
    error: { control: "boolean" },
    disabled: { control: "boolean" },
    readonly: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof AccountSelector>;

/** Controlled wrapper so the stories reflect real selection state. */
function Controlled(props: React.ComponentProps<typeof AccountSelector>) {
  const [value, setValue] = React.useState(props.value ?? "");
  return (
    <div className="w-80">
      <AccountSelector {...props} value={value} onValueChange={setValue} />
    </div>
  );
}

export const Basic: Story = {
  render: (args) => <Controlled {...args} />,
  args: { label: "Account" },
};

export const Searchable: Story = {
  render: (args) => <Controlled {...args} />,
  args: { searchable: true, clearable: true },
};

export const WithDetail: Story = {
  render: (args) => <Controlled {...args} />,
  args: { showDetail: true, searchable: true, label: "Account" },
};

export const OwnAccountsOnly: Story = {
  render: (args) => <Controlled {...args} />,
  args: { ownAccounts: true, label: "Your accounts" },
};

/** Mirrors the Angular `labelFormatter` @Input (title + remaining minutes). */
export const CustomLabel: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    label: "Account",
    labelFormatter: (a: Account) =>
      `${a.title} — ${a.availableMinutes.toLocaleString()} min`,
  },
};

export const Required: Story = {
  render: (args) => <Controlled {...args} />,
  args: { label: "Account", required: true },
};

/** Both portal sizes side by side — default (h-9) and sm (h-8). */
export const Sizes: Story = {
  render: (args) => (
    <div className="flex w-80 flex-col gap-4">
      <Controlled {...args} size="default" label="Default (h-9)" />
      <Controlled {...args} size="sm" label="Small (h-8)" />
    </div>
  ),
};

/** Selected + clearable shows the clear button at right-8 before the chevron. */
export const Clearable: Story = {
  render: (args) => <Controlled {...args} />,
  args: { label: "Account", clearable: true, value: "acct-acme" },
};

export const Disabled: Story = {
  render: (args) => <Controlled {...args} />,
  args: { label: "Account", disabled: true, value: "acct-acme" },
};

/** Read-only: keeps the selected value visible but blocks interaction. */
export const Readonly: Story = {
  render: (args) => <Controlled {...args} />,
  args: { label: "Account", readonly: true, value: "acct-acme" },
};

export const WithHelperText: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    label: "Account",
    helperText: "Pick the account this event bills against.",
  },
};

export const Loading: Story = {
  render: (args) => <Controlled {...args} />,
  args: { loading: true },
};

export const Error: Story = {
  render: (args) => <Controlled {...args} />,
  args: { error: true },
};

/** Invalid state with an inline error message (portal errorMessage). */
export const ErrorWithMessage: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    label: "Account",
    required: true,
    error: true,
    errorMessage: "Please select an account",
  },
};

export const Empty: Story = {
  render: (args) => <Controlled {...args} />,
  args: { accounts: [] },
};
