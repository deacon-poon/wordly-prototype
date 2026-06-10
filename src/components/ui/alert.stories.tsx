import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { Alert, AlertDescription } from "./alert";

/**
 * Core/Alert
 *
 * NOTE: This prototype Alert is intentionally minimal. It exports only `Alert`
 * (a styled container) and `AlertDescription` (the text inside). Unlike the
 * Angular portal alert, it has NO `variant` prop: the base styling is a fixed
 * blue (info) treatment. The portal variants (default/primary/success/warning/
 * destructive) are reproduced below purely via the `className` override the
 * component already accepts, so designers can see the target palette. If these
 * variants get adopted, the gap to close is a real `variant` prop on `Alert`.
 */
const meta: Meta<typeof Alert> = {
  title: "Core/Alert",
  component: Alert,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof Alert>;

// --- Base -------------------------------------------------------------------

/** Default usage: Alert wrapping a single AlertDescription. */
export const Default: Story = {
  render: () => (
    <Alert>
      <AlertDescription>
        Your session settings were saved successfully.
      </AlertDescription>
    </Alert>
  ),
};

/** Heading plus supporting description, the most common content shape. */
export const WithHeading: Story = {
  render: () => (
    <Alert>
      <div className="mb-1 text-sm font-semibold text-blue-900">
        Captions are now live
      </div>
      <AlertDescription>
        Attendees can switch their language from the session toolbar.
      </AlertDescription>
    </Alert>
  ),
};

/** Description-only, no heading. */
export const DescriptionOnly: Story = {
  render: () => (
    <Alert>
      <AlertDescription>
        This is a lightweight inline notice with no heading.
      </AlertDescription>
    </Alert>
  ),
};

/** Longer body copy to confirm wrapping and padding behavior. */
export const LongContent: Story = {
  render: () => (
    <Alert>
      <div className="mb-1 text-sm font-semibold text-blue-900">
        Before you start translating
      </div>
      <AlertDescription>
        Make sure your microphone is selected and your network is stable. Once
        the session begins, the source language is locked for all attendees and
        cannot be changed without ending the session and starting a new one.
      </AlertDescription>
    </Alert>
  ),
};

// --- Variant palette (simulated via className) ------------------------------

/**
 * The portal alert ships five variants. The prototype component has no variant
 * prop, so each row below overrides `className` to demonstrate the intended
 * palette only. These are showcase swatches, not a supported API.
 */
export const VariantPalette: Story = {
  render: () => (
    <div className="flex max-w-xl flex-col gap-3">
      <Alert className="border-gray-300 bg-gray-100">
        <AlertDescription className="text-gray-700">
          Default: general information.
        </AlertDescription>
      </Alert>

      <Alert>
        <AlertDescription>
          Primary: blue highlight (the base style).
        </AlertDescription>
      </Alert>

      <Alert className="border-green-200 bg-green-50">
        <AlertDescription className="text-green-800">
          Success: the operation completed.
        </AlertDescription>
      </Alert>

      <Alert className="border-amber-200 bg-amber-50">
        <AlertDescription className="text-amber-800">
          Warning: something needs your attention.
        </AlertDescription>
      </Alert>

      <Alert className="border-red-200 bg-red-50">
        <AlertDescription className="text-red-800">
          Destructive: an error occurred.
        </AlertDescription>
      </Alert>
    </div>
  ),
};
