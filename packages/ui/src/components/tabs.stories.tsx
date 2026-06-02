import type { Meta, StoryObj } from "@storybook/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";

const meta: Meta<typeof Tabs> = {
  title: "Design System/Core/Tabs",
  component: Tabs,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Tabs>;

// ── Basic ─────────────────────────────────────────────────────────────────────
export const Basic: Story = {
  render: () => (
    <Tabs defaultValue="presenter" className="w-[460px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="presenter">Presenter</TabsTrigger>
        <TabsTrigger value="attendee">Attendee</TabsTrigger>
      </TabsList>
      <TabsContent value="presenter">
        <Card>
          <CardHeader>
            <CardTitle>Join as Presenter</CardTitle>
            <CardDescription>
              Send audio to Wordly for real-time interpretation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label>Session passcode</Label>
              <Input placeholder="Enter your passcode" />
            </div>
            <Button className="w-full">Present Now</Button>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="attendee">
        <Card>
          <CardHeader>
            <CardTitle>Join as Attendee</CardTitle>
            <CardDescription>
              Access real-time translations on your device.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label>Session code</Label>
              <Input placeholder="e.g. ABC-123" />
            </div>
            <Button className="w-full" variant="outline">
              Join Session
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  ),
};

// ── Session Settings ──────────────────────────────────────────────────────────
export const SessionSettings: Story = {
  name: "Session Settings",
  render: () => (
    <Tabs defaultValue="general" className="w-[500px]">
      <TabsList>
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="languages">Languages</TabsTrigger>
        <TabsTrigger value="access">Access</TabsTrigger>
      </TabsList>
      <TabsContent value="general" className="mt-4 space-y-4">
        <div className="grid gap-1.5">
          <Label>Session name</Label>
          <Input defaultValue="Annual Conference 2026" />
        </div>
        <div className="grid gap-1.5">
          <Label>Session ID</Label>
          <Input defaultValue="ABC-123" disabled />
        </div>
        <Button>Save</Button>
      </TabsContent>
      <TabsContent value="languages" className="mt-4">
        <p className="text-sm text-muted-foreground">
          Language configuration goes here.
        </p>
      </TabsContent>
      <TabsContent value="access" className="mt-4">
        <p className="text-sm text-muted-foreground">
          Access control settings go here.
        </p>
      </TabsContent>
    </Tabs>
  ),
};
