import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import {
  WorkspaceSelector,
  MOCK_GROUPED_WORKSPACES,
} from "./workspace-selector";

const meta: Meta<typeof WorkspaceSelector> = {
  title: "Workspace Kit/WorkspaceSelector",
  component: WorkspaceSelector,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "React migration of the production Angular `wordly-workspace-selector`. " +
          "Searchable, clearable, optional 'All Workspaces' entry, grouped " +
          "shared/personal workspaces, and loading/error/empty states. Data via " +
          "props (mock by default); no Angular DI layer.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: { control: "inline-radio", options: ["default", "sm"] },
    searchable: { control: "boolean" },
    clearable: { control: "boolean" },
    includeAllOption: { control: "boolean" },
    loading: { control: "boolean" },
    error: { control: "boolean" },
    disabled: { control: "boolean" },
    readonly: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof WorkspaceSelector>;

/** Controlled wrapper so the stories reflect real selection state. */
function Controlled(props: React.ComponentProps<typeof WorkspaceSelector>) {
  const [value, setValue] = React.useState(props.value ?? "");
  return (
    <div className="w-80">
      <WorkspaceSelector {...props} value={value} onValueChange={setValue} />
    </div>
  );
}

export const Basic: Story = {
  render: (args) => <Controlled {...args} />,
  args: { label: "Workspace" },
};

export const Searchable: Story = {
  render: (args) => <Controlled {...args} />,
  args: { searchable: true, clearable: true },
};

export const Grouped: Story = {
  render: (args) => <Controlled {...args} />,
  args: { groupedWorkspaces: MOCK_GROUPED_WORKSPACES, searchable: true },
};

export const WithAllOption: Story = {
  render: (args) => <Controlled {...args} />,
  args: { includeAllOption: true },
};

export const Small: Story = {
  render: (args) => <Controlled {...args} />,
  args: { label: "Workspace", size: "sm" },
};

export const WithHelperText: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    label: "Workspace",
    helperText: "Pick the workspace for this event.",
  },
};

export const Loading: Story = {
  render: (args) => <Controlled {...args} />,
  args: { loading: true },
};

export const ErrorState: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    label: "Workspace",
    required: true,
    error: true,
    errorMessage: "Please select a workspace.",
  },
};

export const Readonly: Story = {
  render: (args) => <Controlled {...args} />,
  args: { label: "Workspace", readonly: true, value: "ws-acme" },
};

export const Disabled: Story = {
  render: (args) => <Controlled {...args} />,
  args: { label: "Workspace", disabled: true, value: "ws-acme" },
};

export const Empty: Story = {
  render: (args) => <Controlled {...args} />,
  args: { workspaces: [] },
};
