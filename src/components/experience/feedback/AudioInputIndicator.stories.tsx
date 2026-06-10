import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { AudioInputIndicator } from "./AudioInputIndicator";

const meta: Meta<typeof AudioInputIndicator> = {
  title: "Experience/Feedback/AudioInputIndicator",
  component: AudioInputIndicator,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Audio level visualizer: a row of vertical pills whose heights animate to reflect per-band amplitude. Ported from the MUI AudioInputIndicator; colors use our design tokens (Brand Blue when active, muted gray when disabled).",
      },
    },
  },
  argTypes: {
    audioData: { control: "object" },
    disabled: { control: "boolean" },
    maxHeight: { control: { type: "number", min: 10, max: 120, step: 5 } },
    animationDuration: {
      control: { type: "number", min: 0, max: 1000, step: 50 },
    },
    barClassName: { control: "text" },
    disabledBarClassName: { control: "text" },
    ariaLabel: { control: "text" },
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
  args: { audioData: SILENT, disabled: false },
};

export const EnabledWithAudio: Story = {
  args: { audioData: ACTIVE, disabled: false },
};

export const DisabledNoAudio: Story = {
  args: { audioData: SILENT, disabled: true },
};

export const DisabledWithAudio: Story = {
  args: { audioData: ACTIVE, disabled: true },
};

/** A taller meter with more bands. */
export const TallSpectrum: Story = {
  args: {
    audioData: [
      { id: 1, amplitude: 0.2 },
      { id: 2, amplitude: 0.55 },
      { id: 3, amplitude: 0.85 },
      { id: 4, amplitude: 1 },
      { id: 5, amplitude: 0.7 },
      { id: 6, amplitude: 0.4 },
      { id: 7, amplitude: 0.15 },
    ],
    maxHeight: 80,
  },
};

/**
 * Live demo: amplitudes are re-randomized on an interval to simulate a Web
 * Audio analyser stream (production wires this to a real mic input).
 */
export const LiveSimulation: Story = {
  render: (args) => {
    const [data, setData] = React.useState(SILENT);
    React.useEffect(() => {
      const t = setInterval(() => {
        setData(
          Array.from({ length: 5 }, (_, i) => ({
            id: i + 1,
            amplitude: Math.random(),
          }))
        );
      }, 250);
      return () => clearInterval(t);
    }, []);
    return <AudioInputIndicator {...args} audioData={data} />;
  },
  args: { disabled: false, animationDuration: 250 },
};
