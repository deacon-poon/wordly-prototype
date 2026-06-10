import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import {
  CustomFields,
  MOCK_PROFILE_FIELDS,
  MOCK_SESSION_FIELDS,
  type CustomField,
} from "./custom-fields";

const meta: Meta<typeof CustomFields> = {
  title: "Workspace Kit/CustomFields",
  component: CustomFields,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "React migration of the production Angular `wordly-custom-fields`. " +
          "Two contexts: PROFILE (user authors name+value pairs with add/remove " +
          "and duplicate detection) and SESSION (system-defined names with " +
          "type-aware value controls: text, numeric, single- and multi-select). " +
          "Controlled via props (mock by default); no Angular DI/forms layer.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    context: { control: "inline-radio", options: ["profile", "session"] },
    stacked: { control: "boolean" },
    showError: { control: "boolean" },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
    readonly: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof CustomFields>;

/** Controlled wrapper so the stories reflect real edit state. */
function Controlled(props: React.ComponentProps<typeof CustomFields>) {
  const [value, setValue] = React.useState<CustomField[]>(props.value ?? []);
  return (
    <div className="w-[520px]">
      <CustomFields {...props} value={value} onValueChange={setValue} />
    </div>
  );
}

export const Basic: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    label: "Custom Fields",
    context: "profile",
    value: MOCK_PROFILE_FIELDS,
  },
};

export const ProfileEmpty: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    label: "Custom Fields",
    context: "profile",
    helperText: "Add name/value pairs to describe this profile.",
  },
};

export const ProfileDuplicateError: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    label: "Custom Fields",
    context: "profile",
    value: [
      { name: "Region", value: "EMEA", labelType: { typeId: "TEXT" } },
      { name: "Region", value: "APAC", labelType: { typeId: "TEXT" } },
    ],
  },
};

export const Session: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    label: "Session Details",
    context: "session",
    value: MOCK_SESSION_FIELDS,
  },
};

export const SessionStacked: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    label: "Session Details",
    context: "session",
    stacked: true,
    value: MOCK_SESSION_FIELDS,
  },
};

export const SessionRequiredError: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    label: "Session Details",
    context: "session",
    showError: true,
    value: [
      {
        name: "Session Title",
        value: "",
        required: true,
        labelType: { typeId: "TEXT" },
      },
      {
        name: "Room",
        value: "",
        required: true,
        labelType: {
          typeId: "SINGLE_SELECT_OPTION",
          choices: ["Auditorium A", "Auditorium B", "Breakout 1"],
        },
      },
    ],
  },
};

/** PROFILE showError: incomplete rows redden the name input + value (empty) input. */
export const ProfileRequiredError: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    label: "Custom Fields",
    context: "profile",
    required: true,
    showError: true,
    value: [
      { name: "Department", value: "", labelType: { typeId: "TEXT" } },
      { name: "", value: "EMEA", labelType: { typeId: "TEXT" } },
    ],
  },
};

/** SESSION stacked + required error: type-aware controls all show the invalid border. */
export const SessionStackedRequiredError: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    label: "Session Details",
    context: "session",
    stacked: true,
    showError: true,
    value: [
      {
        name: "Expected Attendees",
        value: "",
        required: true,
        labelType: { typeId: "NUMERIC" },
      },
      {
        name: "Languages",
        selectedValues: [],
        required: true,
        labelType: {
          typeId: "MULTI_SELECT_OPTION",
          choices: ["English", "Spanish", "French"],
        },
      },
    ],
  },
};

export const Disabled: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    label: "Custom Fields",
    context: "profile",
    disabled: true,
    value: MOCK_PROFILE_FIELDS,
  },
};

/** Readonly: values are visible but locked; no add/remove affordances (portal parity). */
export const ProfileReadonly: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    label: "Custom Fields",
    context: "profile",
    readonly: true,
    value: MOCK_PROFILE_FIELDS,
  },
};
