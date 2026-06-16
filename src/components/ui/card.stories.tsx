import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./card";
import { Button } from "./button";

/**
 * Card is a composable container built from sub-parts: Card, CardHeader,
 * CardTitle, CardDescription, CardContent, and CardFooter. It has no CVA
 * variants of its own, so these stories showcase representative compositions
 * that mirror the portal WordlyCard slots (title, description, action,
 * content, footer) and its default vs rich layouts.
 */
const meta: Meta<typeof Card> = {
  title: "Design System/Molecules/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof Card>;

// --- Default ----------------------------------------------------------------

/** The standard card: header (title + description), content, and footer. */
export const Default: Story = {
  render: () => (
    <Card className="w-[360px]">
      <CardHeader>
        <CardTitle>Session Settings</CardTitle>
        <CardDescription>
          Configure languages and access for this session.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Attendees can join with a code and pick their preferred language.
        </p>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>Save</Button>
      </CardFooter>
    </Card>
  ),
};

// --- Header only ------------------------------------------------------------

/** Just the header parts: title and description, no content or footer. */
export const HeaderOnly: Story = {
  render: () => (
    <Card className="w-[360px]">
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>Your last session ended 2 hours ago.</CardDescription>
      </CardHeader>
    </Card>
  ),
};

// --- Content only -----------------------------------------------------------

/** A bare card used purely as a surface for arbitrary content. */
export const ContentOnly: Story = {
  render: () => (
    <Card className="w-[360px]">
      <CardContent className="pt-6">
        <p className="text-sm">
          A minimal card with no header or footer, useful as a plain surface.
        </p>
      </CardContent>
    </Card>
  ),
};

// --- With header action -----------------------------------------------------

/** Mirrors the portal "action" slot: a control aligned in the header row. */
export const WithHeaderAction: Story = {
  render: () => (
    <Card className="w-[400px]">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="space-y-1.5">
          <CardTitle>Live Captions</CardTitle>
          <CardDescription>Real-time transcription is active.</CardDescription>
        </div>
        <Button variant="ghost" size="sm">
          Manage
        </Button>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Captions appear for all attendees in their chosen language.
        </p>
      </CardContent>
    </Card>
  ),
};

// --- Stat card --------------------------------------------------------------

/** A compact metric card, a common dashboard composition. */
export const Stat: Story = {
  render: () => (
    <Card className="w-[220px]">
      <CardHeader className="pb-2">
        <CardDescription>Total Attendees</CardDescription>
        <CardTitle className="text-4xl">1,284</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">+12% from last session</p>
      </CardContent>
    </Card>
  ),
};

// --- Rich (expandable) ------------------------------------------------------

/**
 * Mirrors the portal "rich" variant: an image banner, icon, and content that
 * expands or collapses. Composition is done with the shared sub-parts plus
 * a local toggle (no special variant prop exists on this Card).
 */
export const Rich: Story = {
  render: () => {
    const [expanded, setExpanded] = React.useState(false);
    return (
      <Card className="w-[400px] overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary-blue-500 to-action-teal-500" />
        <CardHeader>
          <CardTitle>Multilingual Webinar</CardTitle>
          <CardDescription>5 languages, 320 attendees</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            A rich card pairs a media banner with a title and supporting copy.
          </p>
          {expanded ? (
            <p className="mt-3 text-sm text-muted-foreground">
              Expanded detail: translation runs on the live audio feed and is
              delivered to each attendee in their selected language.
            </p>
          ) : null}
        </CardContent>
        <CardFooter>
          <Button
            variant="link"
            className="px-0"
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? "Show less" : "Show more"}
          </Button>
        </CardFooter>
      </Card>
    );
  },
};

// --- Grid -------------------------------------------------------------------

/** Several cards laid out in a responsive grid. */
export const Grid: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {["English", "Spanish", "French"].map((lang) => (
        <Card key={lang}>
          <CardHeader>
            <CardTitle>{lang}</CardTitle>
            <CardDescription>Translation enabled</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Attendees can join in {lang}.
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  ),
};
