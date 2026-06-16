import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { RoomSelector } from "./room-selector";

/**
 * 1:1 mirror of the production Angular Overview stories
 *   wordly_portal: stories/business/wordly-room-selector/story-1.Overview.stories.ts
 *
 * Same story variants/args (Overview, WithEventFilter, Required, Disabled,
 * Readonly) and the same mock room dataset (provided here via the component's
 * MOCK_ROOMS default rather than the Angular bridge-service provider).
 *
 * Title namespace kept as "Workspace Kit/RoomSelector" to match the existing
 * sibling stories on this branch.
 */
const meta: Meta<typeof RoomSelector> = {
  title: "Workspace Kit/RoomSelector",
  component: RoomSelector,
  parameters: {
    layout: "padded",
  },
  argTypes: {
    eventId: {
      control: "select",
      options: [undefined, "event-001", "event-002", "event-003"],
      description:
        "Optional event ID to filter rooms by event. If not provided, loads all rooms.",
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
    helperText: {
      control: "text",
      description: "Helper text displayed below the select",
    },
    readonly: {
      control: "boolean",
      description: "Whether the field is read-only",
    },
    showInfoIcon: {
      control: "boolean",
      description: "Whether to show the info icon next to the label",
    },
    infoTooltipText: {
      control: "text",
      description: "Tooltip text displayed when hovering over the info icon",
    },
    extraInfo: {
      control: "text",
      description: "Additional information text displayed below the component",
    },
  },
  args: {
    eventId: undefined,
    placeholder: "Select a room",
    label: "Room",
    required: false,
    disabled: false,
    helperText: "",
    readonly: false,
    showInfoIcon: false,
    infoTooltipText: "",
    extraInfo: "",
  },
};

export default meta;
type Story = StoryObj<typeof RoomSelector>;

/** Controlled wrapper so the stories reflect real selection state. */
function Controlled(props: React.ComponentProps<typeof RoomSelector>) {
  const [value, setValue] = React.useState(props.value ?? "");
  return <RoomSelector {...props} value={value} onValueChange={setValue} />;
}

export const Overview: Story = {
  render: (args) => <Controlled {...args} />,
};

export const WithEventFilter: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    eventId: "event-001",
    label: "Room (Filtered by Event)",
    placeholder: "Select a room from event",
    helperText: "Showing only rooms for Event 001",
  },
};

export const Required: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    label: "Room (Required)",
    required: true,
    helperText: "This field is required",
  },
};

export const Disabled: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    label: "Room (Disabled)",
    disabled: true,
    helperText: "This field is currently disabled",
  },
};

export const Readonly: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    label: "Room (Read-only)",
    readonly: true,
    helperText: "This field is read-only",
  },
};
