import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs";

const meta: Meta<typeof Tabs> = {
  title: "Design System/Molecules/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

// --- Default ----------------------------------------------------------------

/** Basic three-tab set with the first tab active by default. */
export const Default: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="w-[480px]">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="sessions">Sessions</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <p className="text-sm text-gray-700">
          Event summary, attendee counts, and language coverage.
        </p>
      </TabsContent>
      <TabsContent value="sessions">
        <p className="text-sm text-gray-700">
          Schedule, speakers, and per-session translation settings.
        </p>
      </TabsContent>
      <TabsContent value="settings">
        <p className="text-sm text-gray-700">
          Access control, branding, and export options.
        </p>
      </TabsContent>
    </Tabs>
  ),
};

// --- Two tabs ---------------------------------------------------------------

/** A compact two-tab layout. */
export const TwoTabs: Story = {
  render: () => (
    <Tabs defaultValue="live" className="w-[360px]">
      <TabsList>
        <TabsTrigger value="live">Live</TabsTrigger>
        <TabsTrigger value="transcript">Transcript</TabsTrigger>
      </TabsList>
      <TabsContent value="live">
        <p className="text-sm text-gray-700">Real-time translated captions.</p>
      </TabsContent>
      <TabsContent value="transcript">
        <p className="text-sm text-gray-700">Full session transcript.</p>
      </TabsContent>
    </Tabs>
  ),
};

// --- Full width -------------------------------------------------------------

/** Tab list stretched to fill its container (portal FULL variant). */
export const FullWidth: Story = {
  render: () => (
    <Tabs defaultValue="english" className="w-[480px]">
      <TabsList className="w-full">
        <TabsTrigger value="english" className="flex-1">
          English
        </TabsTrigger>
        <TabsTrigger value="spanish" className="flex-1">
          Spanish
        </TabsTrigger>
        <TabsTrigger value="french" className="flex-1">
          French
        </TabsTrigger>
      </TabsList>
      <TabsContent value="english">
        <p className="text-sm text-gray-700">English captions are active.</p>
      </TabsContent>
      <TabsContent value="spanish">
        <p className="text-sm text-gray-700">Spanish captions are active.</p>
      </TabsContent>
      <TabsContent value="french">
        <p className="text-sm text-gray-700">French captions are active.</p>
      </TabsContent>
    </Tabs>
  ),
};

// --- Disabled tab -----------------------------------------------------------

/** One trigger is disabled and cannot be selected. */
export const DisabledTab: Story = {
  render: () => (
    <Tabs defaultValue="details" className="w-[480px]">
      <TabsList>
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="attendees">Attendees</TabsTrigger>
        <TabsTrigger value="billing" disabled>
          Billing
        </TabsTrigger>
      </TabsList>
      <TabsContent value="details">
        <p className="text-sm text-gray-700">Event details and description.</p>
      </TabsContent>
      <TabsContent value="attendees">
        <p className="text-sm text-gray-700">Registered attendee list.</p>
      </TabsContent>
      <TabsContent value="billing">
        <p className="text-sm text-gray-700">
          Billing is unavailable for this plan.
        </p>
      </TabsContent>
    </Tabs>
  ),
};

// --- Controlled -------------------------------------------------------------

/** Active tab held in local state, switched by an external control. */
export const Controlled: Story = {
  render: () => {
    const [value, setValue] = React.useState("first");
    return (
      <div className="flex flex-col gap-3 w-[480px]">
        <button
          type="button"
          className="self-start rounded-md bg-[#017CFF] px-3 py-1.5 text-sm font-medium text-white"
          onClick={() => setValue(value === "first" ? "second" : "first")}
        >
          Toggle active tab
        </button>
        <Tabs value={value} onValueChange={setValue}>
          <TabsList>
            <TabsTrigger value="first">First</TabsTrigger>
            <TabsTrigger value="second">Second</TabsTrigger>
          </TabsList>
          <TabsContent value="first">
            <p className="text-sm text-gray-700">First panel content.</p>
          </TabsContent>
          <TabsContent value="second">
            <p className="text-sm text-gray-700">Second panel content.</p>
          </TabsContent>
        </Tabs>
      </div>
    );
  },
};
