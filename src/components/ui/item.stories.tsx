import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Folder, Settings, User, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
  type ItemData,
} from "@/components/ui/item";

const meta: Meta<typeof Item> = {
  title: "Core/Item",
  component: Item,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Generic list-row primitive ported from the Angular `app-wordly-item`. Leading media slot, title + description content, and a trailing actions slot. CVA variants for visual style (default / outline / muted) and density (default / sm), plus link, selected, and interactive states.",
      },
    },
  },
  argTypes: {
    variant: { control: "select", options: ["default", "outline", "muted"] },
    size: { control: "radio", options: ["default", "sm"] },
    mediaVariant: { control: "select", options: ["default", "icon", "image"] },
  },
  decorators: [
    (Story) => (
      <div className="w-[420px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Item>;

// --- Single, slotted rows ---------------------------------------------------

export const Default: Story = {
  args: { variant: "default" },
  render: (args) => (
    <Item {...args}>
      <ItemMedia mediaVariant="icon">
        <User />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>User Settings</ItemTitle>
        <ItemDescription>Configure your account preferences</ItemDescription>
      </ItemContent>
    </Item>
  ),
};

export const Outline: Story = {
  render: () => (
    <Item variant="outline">
      <ItemMedia mediaVariant="icon">
        <Settings />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Workspace Settings</ItemTitle>
        <ItemDescription>Bordered card-style row</ItemDescription>
      </ItemContent>
    </Item>
  ),
};

export const Muted: Story = {
  render: () => (
    <Item variant="muted">
      <ItemMedia mediaVariant="icon">
        <Folder />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Archived Events</ItemTitle>
        <ItemDescription>Subdued background variant</ItemDescription>
      </ItemContent>
    </Item>
  ),
};

export const CompactDensity: Story = {
  name: "Density: sm",
  render: () => (
    <Item variant="outline" size="sm">
      <ItemMedia mediaVariant="icon">
        <FileText />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Transcript.txt</ItemTitle>
        <ItemDescription>Compact padding for dense lists</ItemDescription>
      </ItemContent>
    </Item>
  ),
};

export const WithActions: Story = {
  render: () => (
    <Item variant="outline">
      <ItemMedia mediaVariant="icon">
        <User />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>John Doe</ItemTitle>
        <ItemDescription>john.doe@example.com</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Badge variant="secondary">Admin</Badge>
        <Button size="sm" variant="outline">
          Edit
        </Button>
      </ItemActions>
    </Item>
  ),
};

export const WithAvatarImage: Story = {
  render: () => (
    <Item variant="outline">
      <ItemMedia mediaVariant="image">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://i.pravatar.cc/80?img=12" alt="Avery Chen" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Avery Chen</ItemTitle>
        <ItemDescription>Personal workspace</ItemDescription>
      </ItemContent>
    </Item>
  ),
};

// --- Link rows (trailing chevron / selected eye) ----------------------------

export const AsLink: Story = {
  render: () => (
    <Item isLink href="#settings" variant="outline">
      <ItemMedia mediaVariant="icon">
        <Settings />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Go to Settings</ItemTitle>
        <ItemDescription>Renders as an anchor with a chevron</ItemDescription>
      </ItemContent>
    </Item>
  ),
};

export const Selected: Story = {
  render: () => (
    <Item isLink selected variant="default" interactive>
      <ItemMedia mediaVariant="icon">
        <Folder />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Acme Global Events</ItemTitle>
        <ItemDescription>
          Selected: accent-green-50 bg, accent-green-700 left border, eye icon
          in accent-green-800
        </ItemDescription>
      </ItemContent>
    </Item>
  ),
};

// --- States matrix (portal-aligned tokens) ----------------------------------

export const States: Story = {
  name: "States (hover / active / selected / disabled)",
  render: () => (
    <div className="flex flex-col gap-3">
      <Item
        interactive
        variant="outline"
        data="hoverable"
        onItemClick={() => {}}
      >
        <ItemMedia mediaVariant="icon">
          <Folder />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Interactive row</ItemTitle>
          <ItemDescription>
            Hover → accent-green-100, active → accent-green-200
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item isLink selected variant="outline">
        <ItemMedia mediaVariant="icon">
          <Folder />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Selected row</ItemTitle>
          <ItemDescription>accent-green-700 left border</ItemDescription>
        </ItemContent>
      </Item>
      <Item
        variant="outline"
        aria-disabled
        className="pointer-events-none opacity-50"
      >
        <ItemMedia mediaVariant="icon">
          <FileText />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Disabled row</ItemTitle>
          <ItemDescription>opacity-50, no pointer events</ItemDescription>
        </ItemContent>
      </Item>
    </div>
  ),
};

// --- Interactive (clickable, echoes data) -----------------------------------

const InteractiveDemo = () => {
  const [clicked, setClicked] = React.useState<string | null>(null);
  return (
    <div className="flex flex-col gap-2">
      <Item
        interactive
        variant="muted"
        data="row-a"
        onItemClick={(d) => setClicked(String(d))}
      >
        <ItemMedia mediaVariant="icon">
          <FileText />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Click this row</ItemTitle>
          <ItemDescription>
            Hover + active feedback; echoes data
          </ItemDescription>
        </ItemContent>
      </Item>
      <p className="text-sm text-gray-500">
        Last clicked: <span className="font-medium">{clicked ?? "none"}</span>
      </p>
    </div>
  );
};

export const Interactive: Story = {
  render: () => <InteractiveDemo />,
};

// --- Data-driven mode -------------------------------------------------------

const SAMPLE_ITEMS: ItemData[] = [
  {
    title: "Event Brief.pdf",
    description: "Updated 2 days ago",
    icon: <FileText />,
    mediaVariant: "icon",
    href: "#brief",
  },
  {
    title: "Speaker List.csv",
    description: "Updated last week",
    icon: <FileText />,
    mediaVariant: "icon",
    href: "#speakers",
  },
  {
    title: "Run of Show",
    description: "Draft",
    icon: <Folder />,
    mediaVariant: "icon",
    href: "#ros",
  },
];

export const DataDrivenWithSeparators: Story = {
  name: "Data-driven (items + separators)",
  render: () => (
    <Item variant="default" isLink items={SAMPLE_ITEMS} showSeparators />
  ),
};
