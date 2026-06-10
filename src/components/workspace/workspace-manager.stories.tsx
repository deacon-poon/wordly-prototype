import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { WorkspaceManager, MOCK_WORKSPACE_ITEMS } from "./workspace-manager";

const meta: Meta<typeof WorkspaceManager> = {
  title: "Workspace Kit/WorkspaceManager",
  component: WorkspaceManager,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "React migration of the production Angular `wordly-workspace-manager`. " +
          "A workspace combobox with an 'Add workspace' action and a user menu " +
          "(Edit profile / Log out), plus a 'Create New Workspace' dialog with a " +
          "name input (max length). Data via props (mock by default); no Angular " +
          "DI / bridge / data service layer.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    loading: { control: "boolean" },
    error: { control: "boolean" },
    disabled: { control: "boolean" },
    readonly: { control: "boolean" },
    hideAddWorkspace: { control: "boolean" },
    wsNameMaxLength: { control: "number" },
  },
};

export default meta;
type Story = StoryObj<typeof WorkspaceManager>;

/** Controlled wrapper so the stories reflect real selection state. */
function Controlled(props: React.ComponentProps<typeof WorkspaceManager>) {
  const [value, setValue] = React.useState(props.value ?? "");
  return (
    <div className="w-80">
      <WorkspaceManager {...props} value={value} onValueChange={setValue} />
    </div>
  );
}

export const Basic: Story = {
  render: (args) => <Controlled {...args} />,
  args: { value: "ws-acme" },
};

export const Empty: Story = {
  render: (args) => <Controlled {...args} />,
  args: { workspaces: [] },
};

export const Loading: Story = {
  render: (args) => <Controlled {...args} />,
  args: { loading: true },
};

export const Error: Story = {
  render: (args) => <Controlled {...args} />,
  args: { error: true },
};

export const Disabled: Story = {
  render: (args) => <Controlled {...args} />,
  args: { value: "ws-acme", disabled: true },
};

/** Read-only trigger: portal outline button, no popover. */
export const Readonly: Story = {
  render: (args) => <Controlled {...args} />,
  args: { value: "ws-acme", readonly: true },
};

/** Placeholder state: no selection -> muted-foreground trigger text. */
export const Placeholder: Story = {
  render: (args) => <Controlled {...args} />,
  args: { value: "" },
};

/** Non-admin SSO users: the "Add workspace" action is hidden. */
export const NoAddWorkspace: Story = {
  render: (args) => <Controlled {...args} />,
  args: { value: "ws-northwind", hideAddWorkspace: true },
};

/** Custom create-dialog copy and a tighter name limit. */
export const CustomCreateDialog: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    workspaces: MOCK_WORKSPACE_ITEMS,
    dialogTitle: "New Team Workspace",
    dialogDescription: "Give your workspace a memorable name",
    createButtonText: "Create workspace",
    wsNameMaxLength: 24,
  },
};
