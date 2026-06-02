import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./input";
import { Label } from "./label";
import { Button } from "./button";
import { Search, Mail, Eye, EyeOff, AlertCircle } from "lucide-react";
import React, { useState } from "react";

const meta: Meta<typeof Input> = {
  title: "Design System/Core/Input",
  component: Input,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
    type: {
      control: "select",
      options: ["text", "email", "password", "search", "number", "url"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

// ── Playground ───────────────────────────────────────────────────────────────
export const Playground: Story = {
  args: {
    placeholder: "Enter text…",
  },
};

// ── With Label ────────────────────────────────────────────────────────────────
export const WithLabel: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email">Email address</Label>
      <Input id="email" type="email" placeholder="name@wordly.ai" />
    </div>
  ),
};

// ── States ────────────────────────────────────────────────────────────────────
export const States: Story = {
  render: () => (
    <div className="space-y-4 max-w-sm">
      <div className="grid gap-1.5">
        <Label>Default</Label>
        <Input placeholder="Enter a value…" />
      </div>
      <div className="grid gap-1.5">
        <Label>With value</Label>
        <Input defaultValue="wordly-session-2024" />
      </div>
      <div className="grid gap-1.5">
        <Label>Disabled</Label>
        <Input disabled placeholder="Not editable" />
      </div>
      <div className="grid gap-1.5">
        <Label>Disabled with value</Label>
        <Input disabled defaultValue="read-only-value" />
      </div>
    </div>
  ),
};

// ── With Error ────────────────────────────────────────────────────────────────
export const WithError: Story = {
  name: "With Error",
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="meeting-link">Meeting link</Label>
      <Input
        id="meeting-link"
        aria-invalid
        placeholder="https://teams.microsoft.com/…"
        defaultValue="not-a-valid-url"
      />
      <p className="flex items-center gap-1 text-sm text-destructive">
        <AlertCircle className="h-3.5 w-3.5" />
        Please enter a valid URL
      </p>
    </div>
  ),
};

// ── Search Input ──────────────────────────────────────────────────────────────
export const SearchInput: Story = {
  name: "Search Input",
  render: () => (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input className="pl-8" placeholder="Search sessions…" type="search" />
    </div>
  ),
};

// ── Password Input ────────────────────────────────────────────────────────────
export const PasswordInput: Story = {
  name: "Password Input",
  render: function PasswordInputStory() {
    const [show, setShow] = useState(false);
    return (
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="password">Passcode</Label>
        <div className="relative">
          <Input
            id="password"
            type={show ? "text" : "password"}
            placeholder="Enter session passcode"
          />
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
          >
            {show ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    );
  },
};

// ── Bot Invite Form ───────────────────────────────────────────────────────────
export const BotInviteForm: Story = {
  name: "Bot Invite Form (Wordly)",
  render: () => (
    <div className="w-full max-w-sm space-y-4">
      <div className="grid gap-1.5">
        <Label htmlFor="meeting-url">Meeting link</Label>
        <Input
          id="meeting-url"
          type="url"
          placeholder="https://teams.microsoft.com/l/meetup-join/…"
        />
        <p className="text-xs text-muted-foreground">
          Supports Microsoft Teams, Google Meet, Zoom, and WebEx.
        </p>
      </div>
      <div className="flex gap-2">
        <Button>Invite Wordly</Button>
        <Button variant="outline">Cancel</Button>
      </div>
    </div>
  ),
};
