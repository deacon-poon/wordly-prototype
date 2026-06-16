import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./select";

/**
 * Radix-based Select. Composed from sub-parts: Select (Root), SelectTrigger,
 * SelectValue, SelectContent, SelectItem, SelectGroup, SelectLabel,
 * SelectSeparator. There is no single prop-driven component, so each story
 * composes the parts via render. States mirror the portal wordly-select:
 * placeholder, default value, grouped options, disabled item, disabled control.
 */
const meta: Meta<typeof Select> = {
  title: "Design System/Molecules/Select",
  component: Select,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof Select>;

// --- Basic ------------------------------------------------------------------

export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[260px]">
        <SelectValue placeholder="Select a language" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en-us">English (US)</SelectItem>
        <SelectItem value="es-mx">Spanish (MX)</SelectItem>
        <SelectItem value="fr-fr">French (FR)</SelectItem>
        <SelectItem value="cy">Welsh - Cymraeg</SelectItem>
      </SelectContent>
    </Select>
  ),
};

// --- With a preset value ----------------------------------------------------

export const WithDefaultValue: Story = {
  render: () => (
    <Select defaultValue="es-mx">
      <SelectTrigger className="w-[260px]">
        <SelectValue placeholder="Select a language" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en-us">English (US)</SelectItem>
        <SelectItem value="es-mx">Spanish (MX)</SelectItem>
        <SelectItem value="fr-fr">French (FR)</SelectItem>
        <SelectItem value="cy">Welsh - Cymraeg</SelectItem>
      </SelectContent>
    </Select>
  ),
};

// --- Grouped + labels + separator -------------------------------------------

export const Grouped: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[260px]">
        <SelectValue placeholder="Select a language" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Americas</SelectLabel>
          <SelectItem value="en-us">English (US)</SelectItem>
          <SelectItem value="es-mx">Spanish (MX)</SelectItem>
          <SelectItem value="pt-br">Portuguese (BR)</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Europe</SelectLabel>
          <SelectItem value="fr-fr">French (FR)</SelectItem>
          <SelectItem value="de-de">German (DE)</SelectItem>
          <SelectItem value="cy">Welsh - Cymraeg</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

// --- Item disabled ----------------------------------------------------------

export const WithDisabledItem: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[260px]">
        <SelectValue placeholder="Select a language" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en-us">English (US)</SelectItem>
        <SelectItem value="es-mx">Spanish (MX)</SelectItem>
        <SelectItem value="ja" disabled>
          Japanese (coming soon)
        </SelectItem>
        <SelectItem value="fr-fr">French (FR)</SelectItem>
      </SelectContent>
    </Select>
  ),
};

// --- Disabled control -------------------------------------------------------

export const Disabled: Story = {
  render: () => (
    <Select disabled defaultValue="en-us">
      <SelectTrigger className="w-[260px]">
        <SelectValue placeholder="Select a language" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en-us">English (US)</SelectItem>
        <SelectItem value="es-mx">Spanish (MX)</SelectItem>
      </SelectContent>
    </Select>
  ),
};

// --- Long / scrollable list -------------------------------------------------

export const ScrollableList: Story = {
  render: () => {
    const LANGUAGES = [
      "English",
      "Spanish",
      "French",
      "German",
      "Japanese",
      "Korean",
      "Mandarin",
      "Cantonese",
      "Portuguese",
      "Italian",
      "Dutch",
      "Swedish",
      "Norwegian",
      "Danish",
      "Finnish",
      "Polish",
      "Czech",
      "Hungarian",
      "Greek",
      "Turkish",
    ];
    return (
      <Select>
        <SelectTrigger className="w-[260px]">
          <SelectValue placeholder="Select a language" />
        </SelectTrigger>
        <SelectContent>
          {LANGUAGES.map((lang) => (
            <SelectItem key={lang} value={lang.toLowerCase()}>
              {lang}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  },
};

// --- Controlled with a label ------------------------------------------------

/** A controlled select wired to local state, with a field label above it. */
export const Controlled: Story = {
  render: () => {
    const [value, setValue] = React.useState("en-us");
    return (
      <div className="flex max-w-xs flex-col gap-2">
        <label
          htmlFor="lang-select"
          className="text-sm font-medium text-gray-700"
        >
          Source language
        </label>
        <Select value={value} onValueChange={setValue}>
          <SelectTrigger id="lang-select" className="w-[260px]">
            <SelectValue placeholder="Select a language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en-us">English (US)</SelectItem>
            <SelectItem value="es-mx">Spanish (MX)</SelectItem>
            <SelectItem value="fr-fr">French (FR)</SelectItem>
            <SelectItem value="cy">Welsh - Cymraeg</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-gray-500">Selected: {value}</p>
      </div>
    );
  },
};
