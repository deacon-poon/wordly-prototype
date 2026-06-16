import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { CustomFields, type CustomField } from "./custom-fields";

/**
 * Mirrors the portal Overview story 1:1:
 *   wordly_portal: stories/business/wordly-custom-fields/story-1.Overview.stories.ts
 *
 * Single "Overview" story: a header + description, then a "Basic Usage" block
 * rendering <app-wordly-custom-fields> bound to the controllable args (label,
 * helperText, required, disabled, readonly, addFieldLabel, fieldNamePlaceholder,
 * fieldValuePlaceholder), emitting valueChange. The `title:` namespace is kept as
 * the existing "Workspace Kit/CustomFields".
 */
const meta: Meta<typeof CustomFields> = {
  title: "Workspace Kit/CustomFields",
  component: CustomFields,
  argTypes: {
    // Common form control properties
    label: { control: "text" },
    helperText: { control: "text" },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
    readonly: { control: "boolean" },
    // Component specific properties
    addFieldLabel: { control: "text" },
    fieldNamePlaceholder: { control: "text" },
    fieldValuePlaceholder: { control: "text" },
    // Events
    onValueChange: { action: "valueChange" },
  },
  args: {
    label: "Custom Fields",
    helperText: "Add custom fields for additional information",
    required: false,
    disabled: false,
    readonly: false,
    addFieldLabel: "Add Field",
    fieldNamePlaceholder: "Field name",
    fieldValuePlaceholder: "Field value",
  },
};

export default meta;
type Story = StoryObj<typeof CustomFields>;

// Basic Overview Story
export const Overview: Story = {
  name: "Overview",
  render: (args) => {
    const [value, setValue] = React.useState<CustomField[]>([]);
    return (
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Custom Fields Component</h3>
        <p className="text-gray-600 mb-6">
          This component allows users to dynamically add and manage custom field
          pairs (name and value). It integrates with Angular forms and supports
          validation.
        </p>

        {/* Basic Usage */}
        <div>
          <h4 className="text-md font-medium mb-3">Basic Usage</h4>
          <CustomFields
            {...args}
            value={value}
            onValueChange={(next) => {
              setValue(next);
              args.onValueChange?.(next);
            }}
          />
        </div>
      </div>
    );
  },
};
