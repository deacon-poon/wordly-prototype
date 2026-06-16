import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { TranscriptSelector } from "./transcript-selector";

/**
 * 1:1 mirror of the production Angular Overview story
 *   wordly_portal: stories/business/wordly-transcript-selector/story-1.Overview.stories.ts
 *
 * Same single `Overview` story with the same args (label "Transcript", the
 * "Choose how transcripts are saved for this session" helper text, the
 * "Select transcript mode" placeholder, triggerClass "w-full", and the
 * disabled/readonly/required/showInfoIcon/infoTooltipText/extraInfo flags).
 * The three transcript-mode options come from the component's
 * MOCK_TRANSCRIPT_OPTIONS default rather than the Angular ConstantsService
 * provider.
 *
 * Title namespace kept as "Workspace Kit/TranscriptSelector" to match the
 * existing sibling stories on this branch.
 */
const meta: Meta<typeof TranscriptSelector> = {
  title: "Workspace Kit/TranscriptSelector",
  component: TranscriptSelector,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Transcript selector component that displays available transcript save modes (None, Private, Workspace). " +
          "Extends WordlyProxyControlBase for transparent form integration. " +
          "Options are built from ConstantsService transcript mode configuration.",
      },
    },
  },
  argTypes: {
    value: { control: "text" },
    disabled: { control: "boolean" },
    readonly: { control: "boolean" },
    label: { control: "text" },
    required: { control: "boolean" },
    helperText: { control: "text" },
    placeholder: { control: "text" },
    triggerClass: { control: "text" },
    extraInfo: { control: "text" },
    showInfoIcon: { control: "boolean" },
    infoTooltipText: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof TranscriptSelector>;

/** Controlled wrapper so the story reflects real selection state. */
function Controlled(props: React.ComponentProps<typeof TranscriptSelector>) {
  const [value, setValue] = React.useState(props.value ?? "");
  return (
    <TranscriptSelector {...props} value={value} onValueChange={setValue} />
  );
}

export const Overview: Story = {
  name: "Overview",
  args: {
    value: "",
    disabled: false,
    readonly: false,
    label: "Transcript",
    required: false,
    helperText: "Choose how transcripts are saved for this session",
    placeholder: "Select transcript mode",
    triggerClass: "w-full",
    extraInfo: "",
    showInfoIcon: false,
    infoTooltipText: "",
  },
  render: (args) => <Controlled {...args} />,
};
