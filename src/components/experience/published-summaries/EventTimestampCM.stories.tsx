import type { Meta, StoryObj } from "@storybook/react";

import { EventTimestampCM } from "./EventTimestampCM";

/**
 * `EventTimestampCM` renders a formatted date/time with a calendar icon.
 * Ported from the production library (Published Summaries family). Pass an
 * explicit `timeZone` for deterministic output across viewers — these stories
 * pin `UTC` so the rendered text is stable in docs/snapshots.
 *
 * In production the `dateTime` would be fetched from the events API.
 */
const meta = {
  title: "Experience/Published Summaries/EventTimestampCM",
  component: EventTimestampCM,
  tags: ["autodocs"],
  argTypes: {
    className: { control: false },
  },
} satisfies Meta<typeof EventTimestampCM>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    dateTime: "2026-03-10T09:00:00Z",
    timeZone: "UTC",
  },
};

export const Afternoon: Story = {
  args: {
    dateTime: "2026-03-10T14:30:00Z",
    timeZone: "UTC",
  },
};

export const Midnight: Story = {
  args: {
    dateTime: "2026-01-01T00:00:00Z",
    timeZone: "UTC",
  },
};

/** Same instant, French locale — `Intl.DateTimeFormat` localizes the labels. */
export const Localized: Story = {
  args: {
    dateTime: "2026-03-10T09:00:00Z",
    locale: "fr-FR",
    timeZone: "UTC",
  },
};
