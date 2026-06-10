import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "./accordion";

const meta: Meta<typeof Accordion> = {
  title: "Core/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof Accordion>;

// --- Single (default) -------------------------------------------------------

/** Single mode: only one item can be expanded at a time. */
export const Single: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-full max-w-lg">
      <AccordionItem value="item-1">
        <AccordionTrigger>What is Wordly?</AccordionTrigger>
        <AccordionContent>
          Wordly is a real-time translation platform for live events and
          meetings.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>How many languages are supported?</AccordionTrigger>
        <AccordionContent>
          Wordly supports more than 50 languages for both speech and text.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Do attendees need an app?</AccordionTrigger>
        <AccordionContent>
          No. Attendees join from any browser using a session link or QR code.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

// --- Multiple ---------------------------------------------------------------

/** Multiple mode: several items can be open at the same time. */
export const Multiple: Story = {
  render: () => (
    <Accordion type="multiple" className="w-full max-w-lg">
      <AccordionItem value="item-1">
        <AccordionTrigger>Audio settings</AccordionTrigger>
        <AccordionContent>
          Configure microphone source and noise suppression.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Caption settings</AccordionTrigger>
        <AccordionContent>
          Choose font size, contrast, and display position for captions.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Language settings</AccordionTrigger>
        <AccordionContent>
          Pick the source language and the languages offered to attendees.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

// --- Default open -----------------------------------------------------------

/** A single accordion with the first item open by default. */
export const DefaultOpen: Story = {
  render: () => (
    <Accordion
      type="single"
      collapsible
      defaultValue="item-1"
      className="w-full max-w-lg"
    >
      <AccordionItem value="item-1">
        <AccordionTrigger>Getting started</AccordionTrigger>
        <AccordionContent>
          This section is expanded on first render via defaultValue.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Advanced options</AccordionTrigger>
        <AccordionContent>This section starts collapsed.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

// --- Single item ------------------------------------------------------------

/** Minimal single-item accordion used as a show/hide disclosure. */
export const SingleItem: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-full max-w-lg">
      <AccordionItem value="details">
        <AccordionTrigger>Show session details</AccordionTrigger>
        <AccordionContent>
          Host: Wordly Team. Duration: 60 minutes. Recording: enabled.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};
