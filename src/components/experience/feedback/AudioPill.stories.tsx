import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { AudioPill } from "./AudioPill";

/**
 * `AudioPill` is the atomic bar of an audio level meter: a single vertical pill
 * whose height animates to represent one frequency band. Compose several side
 * by side (one per band) to build a full input indicator.
 *
 * Color defaults to the Brand Blue primary token; the height and animation
 * duration are arbitrary runtime values driven by audio amplitude.
 */
const meta: Meta<typeof AudioPill> = {
  title: "Experience/Feedback/AudioPill",
  component: AudioPill,
  tags: ["autodocs"],
  argTypes: {
    height: { control: { type: "range", min: 4, max: 60, step: 1 } },
    color: { control: "color" },
    animationDuration: { control: { type: "number" } },
  },
  args: {
    height: 36,
    animationDuration: 250,
    color: "hsl(var(--primary-blue-500))",
  },
};

export default meta;
type Story = StoryObj<typeof AudioPill>;

/** A single pill at its default height and Brand Blue primary color. */
export const Default: Story = {};

/** A short, near-silent pill (low amplitude band). */
export const Quiet: Story = {
  args: { height: 8 },
};

/** A tall pill representing a loud frequency band. */
export const Loud: Story = {
  args: { height: 56 },
};

/**
 * The production audio indicator dims pills with a muted gray when the input is
 * disabled. Any CSS color string is accepted.
 */
export const Disabled: Story = {
  args: { height: 20, color: "hsl(var(--muted-foreground))" },
};

/**
 * Five pills composed into an audio meter — the way `AudioPill` is consumed in
 * production. In production the heights are derived from live audio amplitude;
 * here they animate on an interval to demonstrate the transition.
 */
export const AudioMeter: Story = {
  render: (args) => {
    const bands = [1, 2, 3, 4, 5];
    const [heights, setHeights] = React.useState<number[]>([
      30, 18, 48, 24, 36,
    ]);

    React.useEffect(() => {
      const id = setInterval(() => {
        setHeights(() => bands.map(() => 8 + Math.round(Math.random() * 48)));
      }, 350);
      return () => clearInterval(id);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <div
        role="img"
        aria-label="Audio input level"
        className="flex h-[60px] w-[60px] flex-row items-center justify-center gap-0.5"
      >
        {bands.map((id, i) => (
          <AudioPill
            key={id}
            height={heights[i]}
            color={args.color}
            animationDuration={args.animationDuration}
          />
        ))}
      </div>
    );
  },
};
