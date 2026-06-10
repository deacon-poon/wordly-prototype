import type { Meta, StoryObj } from "@storybook/react";

import { EventTimestamp } from "./EventTimestamp";

const meta: Meta<typeof EventTimestamp> = {
  title: "Experience/Published Summaries/EventTimestamp",
  component: EventTimestamp,
  tags: ["autodocs"],
  argTypes: {
    className: { control: false },
    iconClassName: { control: false },
    textClassName: { control: false },
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
 * The lib's Emotion-only `iconColor` / `textColor` overrides are ported to
 * token-class overrides (no raw hex): here the icon uses Action Teal and the
 * text uses near-black gray-900.
 */
export const CustomColors: Story = {
  args: {
    dateTime: "2026-03-10T09:00:00Z",
    iconClassName: "text-action-teal-600",
    textClassName: "text-gray-900",
  },
};
