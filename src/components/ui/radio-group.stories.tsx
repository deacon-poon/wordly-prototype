import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { RadioGroup, RadioGroupItem } from "./radio-group";
import { Label } from "./label";

const meta: Meta<typeof RadioGroup> = {
  title: "Design System/Atoms/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

// --- Default (vertical) -----------------------------------------------------

/** Basic vertical radio group with labels wired to each item via htmlFor/id. */
export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="english">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="english" id="lang-en" />
        <Label htmlFor="lang-en">English (US)</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="spanish" id="lang-es" />
        <Label htmlFor="lang-es">Spanish (MX)</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="french" id="lang-fr" />
        <Label htmlFor="lang-fr">French (FR)</Label>
      </div>
    </RadioGroup>
  ),
};

// --- Horizontal orientation -------------------------------------------------

/** Horizontal layout, matching the portal orientation option. */
export const Horizontal: Story = {
  render: () => (
    <RadioGroup defaultValue="weekly" className="flex flex-row gap-6">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="daily" id="freq-daily" />
        <Label htmlFor="freq-daily">Daily</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="weekly" id="freq-weekly" />
        <Label htmlFor="freq-weekly">Weekly</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="monthly" id="freq-monthly" />
        <Label htmlFor="freq-monthly">Monthly</Label>
      </div>
    </RadioGroup>
  ),
};

// --- With group label and helper text ---------------------------------------

/** A labeled group with descriptive helper text, like a real form field. */
export const WithGroupLabel: Story = {
  render: () => (
    <div className="space-y-2">
      <Label className="text-gray-900">Caption display</Label>
      <p className="text-sm text-gray-500">
        Choose how captions appear during the session.
      </p>
      <RadioGroup defaultValue="overlay" className="pt-1">
        <div className="flex items-center gap-2">
          <RadioGroupItem value="overlay" id="cap-overlay" />
          <Label htmlFor="cap-overlay">Overlay on video</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="sidebar" id="cap-sidebar" />
          <Label htmlFor="cap-sidebar">Side panel</Label>
        </div>
      </RadioGroup>
    </div>
  ),
};

// --- Disabled (whole group) -------------------------------------------------

/** Every item disabled by passing disabled on the Root. */
export const DisabledGroup: Story = {
  render: () => (
    <RadioGroup defaultValue="english" disabled>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="english" id="dg-en" />
        <Label htmlFor="dg-en">English (US)</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="spanish" id="dg-es" />
        <Label htmlFor="dg-es">Spanish (MX)</Label>
      </div>
    </RadioGroup>
  ),
};

// --- Single disabled item ---------------------------------------------------

/** Only one option is disabled, the rest stay selectable. */
export const DisabledItem: Story = {
  render: () => (
    <RadioGroup defaultValue="english">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="english" id="di-en" />
        <Label htmlFor="di-en">English (US)</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="welsh" id="di-cy" disabled />
        <Label htmlFor="di-cy" className="opacity-50">
          Welsh - Cymraeg (coming soon)
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="french" id="di-fr" />
        <Label htmlFor="di-fr">French (FR)</Label>
      </div>
    </RadioGroup>
  ),
};

// --- Card variant -----------------------------------------------------------

/** Card-style selection, mirroring the portal card variant. */
export const CardVariant: Story = {
  render: () => {
    const OPTIONS = [
      { value: "speaker", label: "Speaker", hint: "Present and be translated" },
      {
        value: "attendee",
        label: "Attendee",
        hint: "Listen and read captions",
      },
      { value: "host", label: "Host", hint: "Manage the session" },
    ];
    return (
      <RadioGroup defaultValue="attendee" className="grid grid-cols-3 gap-3">
        {OPTIONS.map((opt) => (
          <Label
            key={opt.value}
            htmlFor={`card-${opt.value}`}
            className="flex cursor-pointer flex-col items-start gap-1 rounded-lg border p-4 hover:bg-accent has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value={opt.value} id={`card-${opt.value}`} />
              <span className="font-medium text-gray-900">{opt.label}</span>
            </div>
            <span className="text-sm text-gray-500">{opt.hint}</span>
          </Label>
        ))}
      </RadioGroup>
    );
  },
};

// --- Controlled -------------------------------------------------------------

/** Controlled value with live echo of the current selection. */
export const Controlled: Story = {
  render: () => {
    const [value, setValue] = React.useState("english");
    return (
      <div className="space-y-3">
        <RadioGroup value={value} onValueChange={setValue}>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="english" id="ctl-en" />
            <Label htmlFor="ctl-en">English (US)</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="spanish" id="ctl-es" />
            <Label htmlFor="ctl-es">Spanish (MX)</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="german" id="ctl-de" />
            <Label htmlFor="ctl-de">German (DE)</Label>
          </div>
        </RadioGroup>
        <p className="text-sm text-gray-500">Selected: {value}</p>
      </div>
    );
  },
};
