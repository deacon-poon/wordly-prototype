import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { VoiceSelector } from "./voice-selector";

/**
 * 1:1 mirror of the production Angular Overview story
 *   wordly_portal: stories/business/wordly-voice-selector/story-1.Overview.stories.ts
 *
 * Same single `Overview` story with the same args (label "Voice Pack
 * Selection", placeholder "Select a voice pack...", the same helper/extra-info
 * copy, required, info icon + tooltip, error message, and a preselected
 * value of "1"). The voice packs + per-pack languages come from the
 * component's MOCK_VOICE_PACKS default — equivalent to the Angular
 * WordlyVoiceSelectorBridgeService mock (Masculine/Feminine, English/Spanish).
 *
 * Title namespace kept as "Workspace Kit/VoiceSelector" to match the existing
 * sibling stories on this branch.
 */
const meta: Meta<typeof VoiceSelector> = {
  title: "Workspace Kit/VoiceSelector",
  component: VoiceSelector,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A business component that provides voice pack selection functionality with preview capabilities. " +
          "It uses a modal dialog to display available voice packs and allows users to preview and select voices. " +
          "Features: modal-based voice pack selection, voice preview with audio playback, FormControl integration, " +
          "language-specific voice pack filtering, and bridge-service integration with cloud-tts services.",
      },
    },
  },
  argTypes: {
    label: {
      control: "text",
      description: "Label text for the component",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text for the trigger button",
    },
    helperText: {
      control: "text",
      description: "Helper text displayed below the component",
    },
    extraInfo: {
      control: "text",
      description: "Additional information text displayed below helper text",
    },
    required: {
      control: "boolean",
      description: "Whether the field is required",
    },
    disabled: {
      control: "boolean",
      description: "Whether the component is disabled",
    },
    readonly: {
      control: "boolean",
      description: "Whether the component is read-only",
    },
    showInfoIcon: {
      control: "boolean",
      description: "Whether to show the info icon next to the label",
    },
    infoTooltipText: {
      control: "text",
      description: "Tooltip text for the info icon",
    },
    error: {
      control: "boolean",
      description: "Whether to display error state",
    },
    errorMessage: {
      control: "text",
      description: "Error message to display when in error state",
    },
    value: {
      control: "text",
      description: "Initial value (voice pack UUID)",
    },
  },
};

export default meta;
type Story = StoryObj<typeof VoiceSelector>;

/** Controlled wrapper so the story reflects real selection state. */
function Controlled(props: React.ComponentProps<typeof VoiceSelector>) {
  const [value, setValue] = React.useState(props.value ?? "");
  return <VoiceSelector {...props} value={value} onValueChange={setValue} />;
}

export const Overview: Story = {
  name: "Overview",
  args: {
    label: "Voice Pack Selection",
    placeholder: "Select a voice pack...",
    helperText: "Choose the voice pack for text-to-speech synthesis",
    extraInfo: "Voice packs determine the quality and style of spoken content",
    required: true,
    disabled: false,
    readonly: false,
    showInfoIcon: true,
    infoTooltipText:
      "Voice packs contain different voice styles and languages for audio generation",
    error: false,
    errorMessage: "Please select a voice pack",
    value: "1",
  },
  render: (args) => <Controlled {...args} />,
};
