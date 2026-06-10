import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { MainContainer } from "./main-container";
import { Button } from "./button";

const meta: Meta<typeof MainContainer> = {
  title: "Core/MainContainer",
  component: MainContainer,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="h-[560px] w-full bg-gray-50 p-6">
        <Story />
      </div>
    ),
  ],
  args: {
    title: "Events",
  },
};

export default meta;
type Story = StoryObj<typeof MainContainer>;

const SampleRows = () => (
  <ul className="divide-y divide-border rounded-md border border-border">
    {["Quarterly All-Hands", "Investor Town Hall", "Product Launch Q&A"].map(
      (name) => (
        <li
          key={name}
          className="flex items-center justify-between px-4 py-3 text-sm text-gray-900"
        >
          <span>{name}</span>
          <span className="text-xs text-muted-foreground">Scheduled</span>
        </li>
      )
    )}
  </ul>
);

export const Default: Story = {
  args: {
    description: "Manage and schedule your translated sessions.",
    children: <SampleRows />,
  },
};

export const WithHeaderAction: Story = {
  args: {
    description: "All events across your workspace.",
    action: <Button size="sm">New event</Button>,
    children: <SampleRows />,
  },
};

export const WithFooter: Story = {
  args: {
    description: "Confirm your changes before publishing.",
    children: <SampleRows />,
    footerAlignment: "right",
    footer: (
      <>
        <Button variant="outline">Cancel</Button>
        <Button>Save changes</Button>
      </>
    ),
  },
};

export const WithExtraActions: Story = {
  args: {
    description: "Filter and search the event list.",
    extraActions: (
      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          Filter
        </Button>
        <Button variant="outline" size="sm">
          Sort
        </Button>
      </div>
    ),
    children: <SampleRows />,
  },
};

export const Loading: Story = {
  args: {
    description: "Fetching the latest events.",
    loading: true,
    loadingText: "Loading events...",
    children: <SampleRows />,
  },
};

export const FooterCentered: Story = {
  args: {
    description: "Footer content centered.",
    children: <SampleRows />,
    footerAlignment: "center",
    footer: <Button>Acknowledge</Button>,
  },
};

export const NoContentPadding: Story = {
  args: {
    showContentPadding: false,
    description:
      "Flush content with no inner padding (showContentPadding=false).",
    children: <SampleRows />,
  },
};

export const NoBorders: Story = {
  args: {
    showBorders: false,
    description: "Borderless variant for embedding inside another surface.",
    children: <SampleRows />,
  },
};

export const StickyHeader: Story = {
  args: {
    description: "Header stays fixed; only the body scrolls.",
    stickyHeader: true,
    children: (
      <div className="space-y-2">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="rounded-md border border-border px-4 py-3 text-sm text-gray-900"
          >
            Session row {i + 1}
          </div>
        ))}
      </div>
    ),
  },
};

/** Controlled wrapper — the side panel open state lives in the consumer. */
export const WithResizableSidePanel: Story = {
  render: (args) => {
    const [open, setOpen] = React.useState(true);
    return (
      <MainContainer
        {...args}
        hasSidePanel
        resizableRightPanel
        sidePanelOpen={open}
        onSidePanelToggle={setOpen}
        action={
          <Button
            size="sm"
            variant="outline"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? "Hide details" : "Show details"}
          </Button>
        }
        sidePanel={
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-900">
              Event details
            </h4>
            <p className="text-sm text-muted-foreground">
              Drag the handle on the left edge to resize this panel. Click the
              chevron to close it.
            </p>
          </div>
        }
      >
        <SampleRows />
      </MainContainer>
    );
  },
  args: {
    description: "Drag the divider to resize the right panel.",
  },
};

/** Non-resizable, fixed-width side panel variant. */
export const WithFixedSidePanel: Story = {
  render: (args) => {
    const [open, setOpen] = React.useState(true);
    return (
      <MainContainer
        {...args}
        hasSidePanel
        resizableRightPanel={false}
        sidePanelOpen={open}
        onSidePanelToggle={setOpen}
        sidePanel={
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-900">Filters</h4>
            <p className="text-sm text-muted-foreground">
              Fixed-width panel (no drag handle).
            </p>
          </div>
        }
      >
        <SampleRows />
      </MainContainer>
    );
  },
  args: {
    description: "Fixed-width side panel (breakpoint-based).",
  },
};
