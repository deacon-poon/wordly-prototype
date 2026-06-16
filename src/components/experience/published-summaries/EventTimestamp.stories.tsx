import type { Meta, StoryObj } from "@storybook/react";

import { EventTimestamp } from "./EventTimestamp";

const meta: Meta<typeof EventTimestamp> = {
  title: "Experience/Published Summaries/EventTimestamp",
  component: EventTimestamp,
  tags: ["autodocs"],
  argTypes: {
    className: { control: false },
  },
  args: {
    // Pin the time zone so Storybook output is deterministic across viewers.
    timeZone: "UTC",
  },
};

export default meta;

type Story = StoryObj<typeof EventTimestamp>;

export const Default: Story = {
  args: {
    dateTime: "2026-03-10T09:00:00Z",
  },
};

export const Afternoon: Story = {
  args: {
    dateTime: "2026-03-10T14:30:00Z",
  },
};

export const Midnight: Story = {
  args: {
    dateTime: "2026-01-01T00:00:00Z",
  },
};

export const Localized: Story = {
  args: {
    dateTime: "2026-03-10T09:00:00Z",
    locale: "fr-FR",
  },
};

/**
 * Mirrors the lib's `CustomColors` story: the Emotion-only `iconColor` /
 * `textColor` overrides. The hex values below are Storybook demo inputs (not
 * component styling) proving the runtime override works — they match the lib
 * story exactly (brand pink icon, onyx text).
 */
export const CustomColors: Story = {
  args: {
    dateTime: "2026-03-10T09:00:00Z",
    iconColor: "#E6007E",
    textColor: "#121416",
  },
};
