import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { GlossarySelector } from "./glossary-selector";

/**
 * 1:1 mirror of the production Angular Overview stories
 *   wordly_portal: stories/business/wordly-glossary-selector/story-1.Overview.stories.ts
 *
 * Same Overview args (label / placeholder / helperText / required / disabled /
 * readonly / showInfoIcon + tooltip) and the same mock glossary dataset
 * (provided here via the component's MOCK_GLOSSARIES default rather than the
 * Angular bridge-service provider).
 *
 * Title namespace kept as "Workspace Kit/GlossarySelector" to match the existing
 * sibling stories on this branch.
 */
const meta: Meta<typeof GlossarySelector> = {
  title: "Workspace Kit/GlossarySelector",
  component: GlossarySelector,
  parameters: {
    layout: "padded",
  },
  argTypes: {
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
    readonly: {
      control: "boolean",
      description: "Whether the field is read-only",
    },
    helperText: {
      control: "text",
      description: "Helper text displayed below the select",
    },
    showInfoIcon: {
      control: "boolean",
      description: "Whether to show the info icon next to the label",
    },
    infoTooltipText: {
      control: "text",
      description: "Tooltip text displayed when hovering over the info icon",
    },
  },
};

export default meta;
type Story = StoryObj<typeof GlossarySelector>;

/** Controlled wrapper so the stories reflect real selection state. */
function Controlled(props: React.ComponentProps<typeof GlossarySelector>) {
  const [value, setValue] = React.useState(props.value ?? "");
  return <GlossarySelector {...props} value={value} onValueChange={setValue} />;
}

/**
 * Default glossary selector demo (mirrors the Angular Overview story).
 */
export const Overview: Story = {
  args: {
    label: "Select Glossary",
    placeholder: "Choose a glossary...",
    helperText: "Select the glossary to use for translations",
    required: false,
    disabled: false,
    readonly: false,
    showInfoIcon: true,
    infoTooltipText:
      "Glossaries contain approved terminology and translations for consistent messaging",
  },
  render: (args) => (
    <div style={{ padding: 20 }}>
      <h3 style={{ marginBottom: 16, color: "#374151" }}>
        WordlyGlossarySelector Demo
      </h3>
      <Controlled {...args} />
    </div>
  ),
};
