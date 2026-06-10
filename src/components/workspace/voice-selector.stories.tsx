import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { VoiceSelector } from "./voice-selector";

const meta: Meta<typeof VoiceSelector> = {
  title: "Workspace Kit/VoiceSelector",
  component: VoiceSelector,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "React migration of the production Angular `wordly-voice-selector`. " +
          "A trigger button opens a modal to pick a voice pack, optionally " +
          "expand a voice-sample player (choose a language + play a preview), " +
          "then commit with Select. Includes loading/error/empty states. Data " +
          "via props (mock by default); no Angular DI / audio playback layer.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    loading: { control: "boolean" },
    error: { control: "boolean" },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof VoiceSelector>;

/** Controlled wrapper so the stories reflect real selection state. */
function Controlled(props: React.ComponentProps<typeof VoiceSelector>) {
  const [value, setValue] = React.useState(props.value ?? "");
  return (
    <div className="w-80">
      <VoiceSelector {...props} value={value} onValueChange={setValue} />
    </div>
  );
}

export const Basic: Story = {
  render: (args) => <Controlled {...args} />,
  args: { label: "Voice", required: true },
};

/** Trigger in its selected/active state (a voice pack already committed). */
export const Selected: Story = {
  render: (args) => <Controlled {...args} />,
  args: { label: "Voice", value: "vp-marcus" },
};

export const Loading: Story = {
  render: (args) => <Controlled {...args} />,
  args: { loading: true },
};

/** Error/invalid state — trigger border + text use the destructive token. */
export const Error: Story = {
  render: (args) => <Controlled {...args} />,
  args: { label: "Voice", required: true, error: true },
};

export const Empty: Story = {
  render: (args) => <Controlled {...args} />,
  args: { voicePacks: [] },
};

export const Disabled: Story = {
  render: (args) => <Controlled {...args} />,
  args: { label: "Voice", disabled: true },
};
