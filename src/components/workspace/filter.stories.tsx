import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import {
  WorkspaceFilter,
  FILTER_TYPES,
  MOCK_FILTER_FIELDS,
  MOCK_WORKSPACE_OPTIONS,
  type FilterField,
  type FilterValues,
} from "./filter";

const meta: Meta<typeof WorkspaceFilter> = {
  title: "Workspace Kit/WorkspaceFilter",
  component: WorkspaceFilter,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "React migration of the production Angular `wordly-filter`. A " +
          "config-driven filter bar built from a `fields` contract " +
          "(date-range, ws-selector, checkbox, input) that emits collected " +
          "values via `onSearch`. Built on shadcn primitives (Input, Checkbox, " +
          "Calendar + Popover, Command + Popover, Button); no Angular DI layer.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof WorkspaceFilter>;

/** Controlled wrapper that surfaces the submitted values below the bar. */
function Controlled(props: React.ComponentProps<typeof WorkspaceFilter>) {
  const [submitted, setSubmitted] = React.useState<FilterValues | null>(null);
  return (
    <div className="flex flex-col gap-4">
      <WorkspaceFilter
        {...props}
        onSearch={(v) => {
          setSubmitted(v);
          props.onSearch?.(v);
        }}
      />
      {submitted ? (
        <pre className="max-w-[1000px] overflow-auto rounded-md bg-gray-50 p-3 text-xs text-gray-700">
          {JSON.stringify(submitted, null, 2)}
        </pre>
      ) : null}
    </div>
  );
}

export const Basic: Story = {
  render: (args) => <Controlled {...args} />,
  args: { fields: MOCK_FILTER_FIELDS },
};

export const CustomSubmitLabel: Story = {
  render: (args) => <Controlled {...args} />,
  args: { fields: MOCK_FILTER_FIELDS, submitButtonLabel: "Apply filters" },
};

const INPUT_ONLY_FIELDS: FilterField[] = [
  {
    key: "name",
    type: FILTER_TYPES.input,
    label: "Name",
    placeholder: "Search by name",
  },
  {
    key: "host",
    type: FILTER_TYPES.input,
    label: "Host",
    placeholder: "Search by host",
  },
];

export const InputsOnly: Story = {
  render: (args) => <Controlled {...args} />,
  args: { fields: INPUT_ONLY_FIELDS },
};

const WORKSPACE_PICKER_FIELDS: FilterField[] = [
  {
    key: "workspace",
    type: FILTER_TYPES.wsSelector,
    label: "Workspace",
    placeholder: "Select workspace",
    config: {
      searchable: true,
      clearable: true,
      includeAllOption: true,
      options: MOCK_WORKSPACE_OPTIONS,
    },
  },
];

export const WorkspacePicker: Story = {
  render: (args) => <Controlled {...args} />,
  args: { fields: WORKSPACE_PICKER_FIELDS },
};

const REQUIRED_FIELDS: FilterField[] = [
  {
    key: "dateRange",
    type: FILTER_TYPES.dateRange,
    label: "Date range",
    required: true,
  },
  { key: "search", type: FILTER_TYPES.input, label: "Search", required: true },
  {
    key: "activeOnly",
    type: FILTER_TYPES.checkbox,
    label: "Active only",
    required: true,
  },
];

export const RequiredFields: Story = {
  render: (args) => <Controlled {...args} />,
  args: { fields: REQUIRED_FIELDS },
};

/**
 * Submit with every required field empty to see the error/invalid state
 * (destructive border on inputs, the date-range/workspace triggers, and the
 * checkbox) — mirrors the Angular form-control-wrapper `showError` behavior
 * after `markAsSubmitted()`.
 */
export const ErrorState: Story = {
  render: (args) => <Controlled {...args} />,
  args: { fields: REQUIRED_FIELDS, submitButtonLabel: "Filter" },
  parameters: {
    docs: {
      description: {
        story:
          "Click Filter without filling the required fields to reveal the " +
          "portal-aligned invalid state (destructive borders, blocked submit).",
      },
    },
  },
};

const DISABLED_FIELDS: FilterField[] = [
  {
    key: "dateRange",
    type: FILTER_TYPES.dateRange,
    label: "Date range",
    disabled: true,
  },
  {
    key: "workspace",
    type: FILTER_TYPES.wsSelector,
    label: "Workspace",
    placeholder: "Select workspace",
    disabled: true,
    config: { options: MOCK_WORKSPACE_OPTIONS },
  },
  {
    key: "search",
    type: FILTER_TYPES.input,
    label: "Search",
    placeholder: "Search by name",
    disabled: true,
  },
  {
    key: "activeOnly",
    type: FILTER_TYPES.checkbox,
    label: "Active only",
    disabled: true,
  },
];

/** Every field disabled — exercises the disabled state across control types. */
export const DisabledFields: Story = {
  render: (args) => <Controlled {...args} />,
  args: { fields: DISABLED_FIELDS },
};

export const Empty: Story = {
  render: (args) => <Controlled {...args} />,
  args: { fields: [] },
};
