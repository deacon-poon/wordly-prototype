import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { RoomSelector } from "./room-selector";

const meta: Meta<typeof RoomSelector> = {
  title: "Workspace Kit/RoomSelector",
  component: RoomSelector,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "React migration of the production Angular `wordly-room-selector`. " +
          "A searchable room combobox with an optional inline 'Add Room' footer " +
          "and dialog (scoped to an event), plus loading/error/empty states. " +
          "Data via props (mock by default); no Angular DI layer.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    searchable: { control: "boolean" },
    required: { control: "boolean" },
    showAddRoom: { control: "boolean" },
    loading: { control: "boolean" },
    error: { control: "boolean" },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof RoomSelector>;

/** Controlled wrapper so the stories reflect real selection state. */
function Controlled(props: React.ComponentProps<typeof RoomSelector>) {
  const [value, setValue] = React.useState(props.value ?? "");
  return (
    <div className="w-80">
      <RoomSelector {...props} value={value} onValueChange={setValue} />
    </div>
  );
}

/** Default: searchable combobox (matches the portal, which always shows search). */
export const Basic: Story = {
  render: (args) => <Controlled {...args} />,
  args: { label: "Room" },
};

/** Required field — the `*` indicator uses the destructive token. */
export const Required: Story = {
  render: (args) => <Controlled {...args} />,
  args: { label: "Room", required: true },
};

/** Search input suppressed (pass `searchable={false}`). */
export const WithoutSearch: Story = {
  render: (args) => <Controlled {...args} />,
  args: { label: "Room", searchable: false },
};

/** Inline "+ Add New Room" footer + dialog, scoped to an event. */
export const WithAddRoom: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    label: "Room",
    showAddRoom: true,
    eventId: "evt-123",
    eventName: "Q3 Global Town Hall",
  },
};

export const Loading: Story = {
  render: (args) => <Controlled {...args} />,
  args: { label: "Room", loading: true },
};

/** Error/invalid: trigger gets a destructive border. */
export const Error: Story = {
  render: (args) => <Controlled {...args} />,
  args: { label: "Room", required: true, error: true },
};

export const Disabled: Story = {
  render: (args) => <Controlled {...args} />,
  args: { label: "Room", disabled: true },
};

export const Empty: Story = {
  render: (args) => <Controlled {...args} />,
  args: { label: "Room", rooms: [] },
};
