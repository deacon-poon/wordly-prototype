import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";

import { Calendar } from "./calendar";

/**
 * The prototype ships a single `Calendar` primitive (a styled react-day-picker
 * v9 DayPicker). The portal `app-wordly-date-picker` is a popover-anchored input
 * wrapping that same calendar. There is no standalone DatePicker export here, so
 * these stories showcase the underlying `Calendar` in the states the portal
 * date-picker exposes: empty selection, a selected date, range selection, a
 * dropdown caption (month/year jump), a min/max bounded calendar, and disabled.
 */
const meta: Meta<typeof Calendar> = {
  title: "Core/DatePicker",
  component: Calendar,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    showOutsideDays: { control: "boolean" },
    captionLayout: {
      control: "select",
      options: ["label", "dropdown", "dropdown-months", "dropdown-years"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Calendar>;

// --- Empty / default --------------------------------------------------------

/** No date selected yet, equivalent to the picker showing its placeholder. */
export const Default: Story = {
  args: {
    mode: "single",
    showOutsideDays: true,
  },
};

// --- Single date selected ---------------------------------------------------

/** A single selected date with live state, mirroring a chosen value. */
export const SingleSelected: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    return (
      <div className="space-y-3">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
        />
        <p className="text-sm text-gray-700">
          Selected: {date ? format(date, "MMM d, yyyy") : "none"}
        </p>
      </div>
    );
  },
};

// --- Range selection --------------------------------------------------------

/** Range mode: pick a start and end date for an event window. */
export const RangeSelection: Story = {
  render: () => {
    const [range, setRange] = React.useState<DateRange | undefined>();
    return (
      <div className="space-y-3">
        <Calendar
          mode="range"
          selected={range}
          onSelect={setRange}
          numberOfMonths={2}
          className="rounded-md border"
        />
        <p className="text-sm text-gray-700">
          From: {range?.from ? format(range.from, "MMM d, yyyy") : "none"} - To:{" "}
          {range?.to ? format(range.to, "MMM d, yyyy") : "none"}
        </p>
      </div>
    );
  },
};

// --- Multiple dates ---------------------------------------------------------

/** Multiple mode: select several individual dates. */
export const MultipleDates: Story = {
  render: () => {
    const [dates, setDates] = React.useState<Date[] | undefined>([]);
    return (
      <div className="space-y-3">
        <Calendar
          mode="multiple"
          selected={dates}
          onSelect={setDates}
          className="rounded-md border"
        />
        <p className="text-sm text-gray-700">
          {dates && dates.length > 0
            ? dates.length + " date(s) selected"
            : "No dates selected"}
        </p>
      </div>
    );
  },
};

// --- Dropdown caption (month/year jump) -------------------------------------

/** Dropdown caption lets the user jump months and years, matching the portal
 * captionLayout="dropdown" mode. Bounded with startMonth/endMonth. */
export const DropdownCaption: Story = {
  args: {
    mode: "single",
    captionLayout: "dropdown",
    startMonth: new Date(2020, 0),
    endMonth: new Date(2030, 11),
    defaultMonth: new Date(2026, 5),
  },
};

// --- Bounded with min/max ---------------------------------------------------

/** Disables dates before today and more than 30 days out, like a min/max
 * bounded booking window. */
export const BoundedRange: Story = {
  render: () => {
    const today = new Date();
    const max = new Date();
    max.setDate(today.getDate() + 30);
    const [date, setDate] = React.useState<Date | undefined>();
    return (
      <div className="space-y-3">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          disabled={{ before: today, after: max }}
          className="rounded-md border"
        />
        <p className="text-sm text-gray-700">
          Selectable: today through the next 30 days only.
        </p>
      </div>
    );
  },
};

// --- Disabled ---------------------------------------------------------------

/** Fully disabled calendar: every day is non-interactive. */
export const Disabled: Story = {
  args: {
    mode: "single",
    selected: new Date(),
    disabled: true,
  },
};
