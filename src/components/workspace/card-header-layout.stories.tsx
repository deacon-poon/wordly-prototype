import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { CardHeaderLayout } from "./card-header-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Mirrors the portal Overview story 1:1:
 *   wordly_portal: stories/core/wordly-card/story-1.Overview.stories.ts
 *
 * The Angular `Overview` renders the DEFAULT card variant as a "Login to your
 * account" card: title + description, a "Sign Up" link action in the header, an
 * email/password form in the content slot, and Login / Reset Form buttons in the
 * footer slot. We reproduce that exact composition.
 *
 * The Angular meta is `title: 'Core/WordlyCard'`; we keep the repo's existing
 * "Workspace Kit/..." namespace family.
 */
const meta: Meta<typeof CardHeaderLayout> = {
  title: "Workspace Kit/CardHeaderLayout",
  component: CardHeaderLayout,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "React migration of the production Angular `wordly-card` (DEFAULT variant). " +
          "A card with header (title / description / action), content, and footer " +
          "slots, ported from the Spartan hlm card anatomy 1:1.",
      },
    },
  },
  argTypes: {
    cardClass: { control: "text" },
    headerClass: { control: "text" },
    contentClass: { control: "text" },
    footerClass: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof CardHeaderLayout>;

export const Overview: Story = {
  name: "Overview",
  render: (args) => (
    <div className="w-[360px]">
      <CardHeaderLayout
        {...args}
        title="Login to your account"
        description="Enter your email below to login to your account"
        actions={
          <Button variant="link" className="h-auto p-0">
            Sign Up
          </Button>
        }
        footer={
          <div className="flex w-full flex-col gap-2">
            <Button type="button" className="w-full">
              Login
            </Button>
            <Button variant="outline" className="w-full">
              Reset Form
            </Button>
          </div>
        }
      >
        <form className="flex flex-col gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" />
          </div>
        </form>
      </CardHeaderLayout>
    </div>
  ),
  args: {},
};
