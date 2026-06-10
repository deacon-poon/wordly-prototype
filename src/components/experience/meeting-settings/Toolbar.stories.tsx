import type { Meta, StoryObj } from "@storybook/react";
import { Info, Share2, SunMoon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Toolbar } from "./Toolbar";

const meta: Meta<typeof Toolbar> = {
  title: "Experience/Meeting Settings/Toolbar",
  component: Toolbar,
  tags: ["autodocs"],
  argTypes: {
    className: { control: false },
    children: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Toolbar rendered at the top of every meeting-settings view: a title on the left, action items on the right, and a divider underneath. Ported from the production MUI library to shadcn + Tailwind.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Toolbar>;

/** The canonical state from the original library story: title + three icon actions. */
export const Default: Story = {
  args: {
    title: "Sample Toolbar",
  },
  render: (args) => (
    <Toolbar {...args}>
      <Button variant="ghost" size="icon" aria-label="Toggle theme">
        <SunMoon className="h-5 w-5" />
      </Button>
      <Button variant="ghost" size="icon" aria-label="About">
        <Info className="h-5 w-5" />
      </Button>
      <Button variant="ghost" size="icon" aria-label="Share">
        <Share2 className="h-5 w-5" />
      </Button>
    </Toolbar>
  ),
};

/** Title only — no actions on the right. */
export const TitleOnly: Story = {
  args: {
    title: "Meeting Settings",
  },
};

/** No title — actions only, which sit flush right thanks to the auto margin. */
export const ActionsOnly: Story = {
  render: () => (
    <Toolbar>
      <Button variant="ghost" size="icon" aria-label="Share">
        <Share2 className="h-5 w-5" />
      </Button>
    </Toolbar>
  ),
};

/** Mixes a labeled action button with icon actions. */
export const WithLabeledAction: Story = {
  args: {
    title: "Languages",
  },
  render: (args) => (
    <Toolbar {...args}>
      <Button variant="outline" size="sm">
        <Info className="mr-2 h-4 w-4" />
        About
      </Button>
      <Button size="sm">
        <Share2 className="mr-2 h-4 w-4" />
        Share
      </Button>
    </Toolbar>
  ),
};
