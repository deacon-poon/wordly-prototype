import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { WorkspaceSelector } from "./workspace-selector";

/**
 * 1:1 mirror of the production Angular Overview stories
 *   wordly_portal: stories/business/wordly-workspace-selector/story-1.Overview.stories.ts
 *
 * Same story variants/states (Overview, WithSearch, WithAllOption,
 * WithDefaultOption, WithDefaultWorkspace, WithGroups) and the same mock
 * workspace dataset (provided here via the component's MOCK_WORKSPACES /
 * MOCK_GROUPED_WORKSPACES defaults rather than the Angular bridge-service
 * provider).
 *
 * Title namespace kept as "Workspace Kit/WorkspaceSelector" to match the
 * existing sibling stories on this branch.
 */
const meta: Meta<typeof WorkspaceSelector> = {
  title: "Workspace Kit/WorkspaceSelector",
  component: WorkspaceSelector,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Workspace selector component that provides a user-friendly interface for selecting workspaces. Built on top of WordlySelect with automatic workspace loading from the API.",
      },
    },
  },
  argTypes: {
    label: { control: "text" },
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
    readonly: { control: "boolean" },
    required: { control: "boolean" },
    searchable: { control: "boolean" },
    clearable: { control: "boolean" },
    includeAllOption: { control: "boolean" },
    allOptionLabel: { control: "text" },
    defaultOption: { control: "text" },
    value: { control: "text" },
    error: { control: "boolean" },
    extraInfo: { control: "text" },
    showInfoIcon: { control: "boolean" },
    infoTooltipText: { control: "text" },
    helperText: { control: "text" },
    loadingText: { control: "text" },
    errorLoadingText: { control: "text" },
    noWorkspacesText: { control: "text" },
    showGroupedWorkspaces: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof WorkspaceSelector>;

/** Controlled wrapper so the stories reflect real selection state. */
function Controlled(props: React.ComponentProps<typeof WorkspaceSelector>) {
  const [value, setValue] = React.useState(props.value ?? "");
  // Honor defaultOption pre-selection emitted by the component on mount.
  return (
    <WorkspaceSelector {...props} value={value} onValueChange={setValue} />
  );
}

export const Overview: Story = {
  args: {
    label: "Workspace",
    placeholder: "Select a workspace...",
    disabled: false,
    readonly: false,
    required: false,
    searchable: false,
    clearable: false,
    error: false,
    extraInfo: "Choose the workspace where you want to work",
    showInfoIcon: true,
    infoTooltipText:
      "Workspaces help organize your projects and control access to resources. You can switch between Personal and Shared workspaces.",
    helperText: "Select from available workspaces loaded from the API",
    loadingText: "Loading workspaces...",
    errorLoadingText: "Failed to load workspaces",
    noWorkspacesText: "No workspaces available",
    showGroupedWorkspaces: false,
  },
  render: (args) => <Controlled {...args} />,
};

export const WithSearch: Story = {
  name: "With Search",
  args: {
    label: "Workspace",
    placeholder: "Search workspaces...",
    searchable: true,
    required: false,
    helperText: "Type to filter workspaces by name",
    clearable: true,
  },
  render: (args) => <Controlled {...args} />,
};

export const WithAllOption: Story = {
  name: "With All Option",
  args: {
    label: "Workspace",
    placeholder: "Select a workspace...",
    includeAllOption: true,
    searchable: true,
    required: false,
    helperText: "First option lets the user select all workspaces",
    clearable: true,
  },
  render: (args) => <Controlled {...args} />,
};

export const WithDefaultOption: Story = {
  name: "With Default Option (pre-selected)",
  args: {
    label: "Workspace",
    placeholder: "Select a workspace...",
    includeAllOption: true,
    searchable: true,
    clearable: true,
    defaultOption: "ALL",
    helperText: "All Workspaces is pre-selected on load via defaultOption",
  },
  render: (args) => <Controlled {...args} />,
};

export const WithDefaultWorkspace: Story = {
  name: "With Default Workspace (specific)",
  args: {
    label: "Workspace",
    placeholder: "Select a workspace...",
    searchable: true,
    clearable: true,
    defaultOption: "65b7a253a5f3b021c5a90b20",
    helperText:
      "Engineering workspace is pre-selected on load via defaultOption",
  },
  render: (args) => <Controlled {...args} />,
};

export const WithGroups: Story = {
  name: "With Groups (Personal & Shared)",
  args: {
    label: "Workspace",
    placeholder: "Select a workspace...",
    searchable: true,
    clearable: true,
    showGroupedWorkspaces: true,
    includeAllOption: true,
    allOptionLabel: "All Workspaces",
    helperText:
      "Workspaces showGroupedWorkspaces into Personal and Shared sections",
  },
  render: (args) => <Controlled {...args} />,
};
