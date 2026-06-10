import type { Meta, StoryObj } from "@storybook/react";

import { InteractiveSpinner } from "./InteractiveSpinner";

const meta: Meta<typeof InteractiveSpinner> = {
  title: "Experience/Feedback/InteractiveSpinner",
  component: InteractiveSpinner,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Loading spinner that fades cycling status messages in and out below an animated ring. Ported from the MUI/Emotion lib component to shadcn + Tailwind; the message advances on each pulse iteration. The ring uses Brand Blue (`primary`).",
      },
    },
  },
  argTypes: {
    pulseDuration: { control: { type: "number", min: 1, max: 10 } },
    spinnerThickness: { control: { type: "number", min: 1, max: 8 } },
  },
};

export default meta;

type Story = StoryObj<typeof InteractiveSpinner>;

/** Default: cycles through several load-stage messages. */
export const Default: Story = {
  args: {
    messages: [
      "Hiya",
      "Give us a second while we load",
      "Hope it doesn't take long",
    ],
  },
};

/** Spinner only - no message rendered (matches the lib's `NoMessages` story). */
export const NoMessages: Story = {
  args: {},
};

/** A single static message that pulses without cycling. */
export const SingleMessage: Story = {
  args: {
    messages: ["Connecting to the session..."],
  },
};

/** Larger ring with a faster pulse, for full-screen / hero loading states. */
export const LargeAndFast: Story = {
  args: {
    messages: ["Spinning up your event", "Loading attendees", "Almost there"],
    spinnerSize: 72,
    spinnerThickness: 5,
    pulseDuration: 3,
  },
};

/** String-based size unit (em) instead of pixels. */
export const RelativeSize: Story = {
  args: {
    messages: ["Sizing with em units"],
    spinnerSize: "3em",
  },
};
