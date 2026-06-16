import type { Meta, StoryObj } from "@storybook/react";

import { AudioInputIndicator } from "./AudioInputIndicator";

/**
 * Brand Blue primary token, supplied the way the lib story passed
 * `WordlyColors.wordlyBlue` (the active brand color comes from the consumer,
 * not the component default).
 */
const BRAND_BLUE = "hsl(var(--primary-blue-500))";
/** Muted gray for the disabled state — the lib used `WordlyColors.twilightHaze`. */
const DISABLED_GRAY = "hsl(var(--muted-foreground))";

const meta: Meta<typeof AudioInputIndicator> = {
  title: "Experience/Feedback/AudioInputIndicator",
  component: AudioInputIndicator,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Audio level visualizer: a row of vertical pills whose heights animate to reflect per-band amplitude. Faithful port of the MUI AudioInputIndicator; the active color is supplied by the consumer (stories use the Brand Blue token).",
      },
    },
  },
  argTypes: {
    audioData: { control: "object" },
    audioIndicatorColor: { control: "color" },
    audioIndicatorDisabledColor: { control: "color" },
    disabled: { control: "boolean" },
    maxHeight: { control: { type: "number", min: 10, max: 120, step: 5 } },
    animationDuration: {
      control: { type: "number", min: 0, max: 1000, step: 50 },
    },
    ariaLabel: { control: "text" },
  },
  args: {
    maxHeight: 50,
    animationDuration: 250,
    ariaLabel: "Audio input level",
  },
};

export default meta;

type Story = StoryObj<typeof AudioInputIndicator>;

const SILENT = [
  { id: 1, amplitude: 0 },
  { id: 2, amplitude: 0 },
  { id: 3, amplitude: 0 },
  { id: 4, amplitude: 0 },
  { id: 5, amplitude: 0 },
];

const ACTIVE = [
  { id: 1, amplitude: 0.75 },
  { id: 2, amplitude: 0.5 },
  { id: 3, amplitude: 0.9 },
  { id: 4, amplitude: 0.65 },
  { id: 5, amplitude: 0.3 },
];

export const EnabledNoAudio: Story = {
  args: {
    audioData: SILENT,
    audioIndicatorColor: BRAND_BLUE,
    disabled: false,
  },
};

export const EnabledWithAudio: Story = {
  args: {
    audioData: ACTIVE,
    audioIndicatorColor: BRAND_BLUE,
    disabled: false,
  },
};

export const DisabledNoAudio: Story = {
  args: {
    audioData: SILENT,
    audioIndicatorColor: DISABLED_GRAY,
    audioIndicatorDisabledColor: DISABLED_GRAY,
    disabled: true,
  },
};

export const DisabledWithAudio: Story = {
  args: {
    audioData: ACTIVE,
    audioIndicatorColor: DISABLED_GRAY,
    audioIndicatorDisabledColor: DISABLED_GRAY,
    disabled: true,
  },
};
