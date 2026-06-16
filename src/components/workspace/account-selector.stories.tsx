import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { AccountSelector, type Account } from "./account-selector";

/**
 * 1:1 mirror of the production Angular Overview stories
 *   wordly_portal: stories/business/wordly-account-selector/Overview.stories.ts
 *
 * Same story variants/states (Overview, FullWidthTrigger, CustomLabelWithOwner,
 * CustomLabelWithMinutes, CustomLabelComplex) and the same mock account dataset
 * (provided here via the component's MOCK_ACCOUNTS default rather than the
 * Angular bridge-service provider).
 *
 * Title namespace kept as "Workspace Kit/AccountSelector" to match the existing
 * sibling stories on this branch.
 */
const meta: Meta<typeof AccountSelector> = {
  title: "Workspace Kit/AccountSelector",
  component: AccountSelector,
  parameters: {
    layout: "padded",
  },
  argTypes: {
    ownAccounts: {
      control: "boolean",
      description: "When true, shows only accounts owned by current user",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text for the select field",
    },
    label: {
      control: "text",
      description: "Label for the select field",
    },
    required: {
      control: "boolean",
      description: "Whether the field is required",
    },
    disabled: {
      control: "boolean",
      description: "Whether the field is disabled",
    },
    triggerClass: {
      control: "text",
      description:
        'CSS class(es) applied to the select trigger element (e.g. "w-full")',
    },
    helperText: {
      control: "text",
      description: "Helper text shown below the field",
    },
    labelFormatter: {
      control: false,
      description: "Function to customize how account labels are displayed",
    },
  },
};

export default meta;
type Story = StoryObj<typeof AccountSelector>;

/** Controlled wrapper so the stories reflect real selection state. */
function Controlled(props: React.ComponentProps<typeof AccountSelector>) {
  const [value, setValue] = React.useState(props.value ?? "");
  return <AccountSelector {...props} value={value} onValueChange={setValue} />;
}

/**
 * Default account selector showing all accounts
 */
export const Overview: Story = {
  args: {
    label: "Select Account",
    placeholder: "Choose an account",
    ownAccounts: false,
    required: false,
    disabled: false,
    helperText: "Select an account from the available options",
  },
  render: (args) => (
    <div style={{ maxWidth: 400 }}>
      <Controlled {...args} />
    </div>
  ),
};

/**
 * Account selector with full-width trigger via triggerClass
 */
export const FullWidthTrigger: Story = {
  args: {
    label: "Select Account",
    placeholder: "Choose an account",
    ownAccounts: false,
    required: false,
    disabled: false,
    triggerClass: "w-full",
    helperText: "The trigger expands to fill the container width",
  },
  render: (args) => (
    <div style={{ width: 600 }}>
      <p style={{ marginBottom: 16, fontSize: 14, color: "#666" }}>
        With triggerClass=&quot;w-full&quot; — trigger fills container
      </p>
      <Controlled {...args} />

      <hr style={{ margin: "24px 0" }} />

      <p style={{ marginBottom: 16, fontSize: 14, color: "#666" }}>
        Without triggerClass — default trigger width
      </p>
      <Controlled {...args} triggerClass="" />
    </div>
  ),
};

/**
 * Account selector with custom label formatter showing title and owner
 */
export const CustomLabelWithOwner: Story = {
  args: {
    label: "Select Account",
    placeholder: "Choose an account",
    ownAccounts: false,
    required: false,
    disabled: false,
    helperText:
      "Account selector with custom formatting showing title and owner",
    labelFormatter: (account: Account) =>
      `${account.title} (Owner: ${account.ownerName})`,
  },
  render: (args) => (
    <div style={{ maxWidth: 500 }}>
      <Controlled {...args} />
    </div>
  ),
};

/**
 * Account selector with custom label formatter showing minutes available
 */
export const CustomLabelWithMinutes: Story = {
  args: {
    label: "Select Account",
    placeholder: "Choose an account",
    ownAccounts: false,
    required: false,
    disabled: false,
    helperText: "Account selector showing available minutes for each account",
    labelFormatter: (account: Account) =>
      `${account.title} - ${account.availableMinutes} mins available`,
  },
  render: (args) => (
    <div style={{ maxWidth: 500 }}>
      <Controlled {...args} />
    </div>
  ),
};

/**
 * Account selector with complex custom formatting
 */
export const CustomLabelComplex: Story = {
  args: {
    label: "Select Account",
    placeholder: "Choose an account",
    ownAccounts: false,
    required: false,
    disabled: false,
    helperText:
      "Account selector with complex formatting showing multiple properties",
    labelFormatter: (account: Account) => {
      const hours = Math.floor(account.availableMinutes / 60);
      const mins = account.availableMinutes % 60;
      return `${account.title} | ${account.ownerName} | ${hours}h ${mins}m left`;
    },
  },
  render: (args) => (
    <div style={{ maxWidth: 600 }}>
      <Controlled {...args} />
    </div>
  ),
};
