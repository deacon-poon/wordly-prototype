import type { Meta, StoryObj } from "@storybook/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";
import { Button } from "./button";
import { Badge } from "./badge";
import { Globe, Mic, Monitor } from "lucide-react";

const meta: Meta<typeof Card> = {
  title: "Design System/Core/Card",
  component: Card,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Card>;

// ── Basic ─────────────────────────────────────────────────────────────────────
export const Basic: Story = {
  render: () => (
    <Card className="w-[360px]">
      <CardHeader>
        <CardTitle>Session Overview</CardTitle>
        <CardDescription>
          Configure how attendees join your Wordly session.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Use the options below to manage how participants connect and what
          languages are available for real-time interpretation.
        </p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button>Save</Button>
        <Button variant="outline">Cancel</Button>
      </CardFooter>
    </Card>
  ),
};

// ── Join Option Card ──────────────────────────────────────────────────────────
export const JoinOptionCard: Story = {
  name: "Join Option Card",
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl">
      <Card className="border-primary-teal-200 bg-primary-teal-50/30">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-teal-100 text-primary-teal-700">
              <Mic className="w-5 h-5" />
            </div>
            <Badge variant="navy" size="sm">
              Most Popular
            </Badge>
          </div>
          <CardTitle className="text-base">In-Person Event</CardTitle>
          <CardDescription>
            Present live at an event with your microphone.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button size="sm" className="w-full">
            Present Now
          </Button>
        </CardFooter>
      </Card>

      <Card className="border-accent-green-200 bg-accent-green-50/30">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent-green-100 text-accent-green-700">
            <Globe className="w-5 h-5" />
          </div>
          <CardTitle className="text-base">Join on Your Device</CardTitle>
          <CardDescription>
            Use smartphone or tablet to access translations.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button size="sm" variant="outline" className="w-full">
            Join Session
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted text-muted-foreground">
            <Monitor className="w-5 h-5" />
          </div>
          <CardTitle className="text-base">Big Screen Display</CardTitle>
          <CardDescription>
            Display translations on large screens or projectors.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button size="sm" variant="outline" className="w-full">
            Open Display
          </Button>
        </CardFooter>
      </Card>
    </div>
  ),
};

// ── Stat Card ─────────────────────────────────────────────────────────────────
export const StatCard: Story = {
  name: "Stat Card",
  render: () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl">
      {[
        { label: "Active Sessions", value: "12", change: "+3 today" },
        { label: "Total Attendees", value: "1,284", change: "+48 this week" },
        { label: "Languages", value: "24", change: "Available" },
        { label: "Uptime", value: "99.9%", change: "Last 30 days" },
      ].map(({ label, value, change }) => (
        <Card key={label}>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground mb-1">{label}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  ),
};
