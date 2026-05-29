import type { Meta, StoryObj } from "@storybook/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";

const meta: Meta<typeof Dialog> = {
  title: "Design System/Core/Dialog",
  component: Dialog,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Dialog>;

// ── Basic ─────────────────────────────────────────────────────────────────────
export const Basic: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Session Settings</DialogTitle>
          <DialogDescription>
            Configure the settings for this Wordly session. Changes will take
            effect immediately.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">Dialog content goes here.</p>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

// ── With Form ─────────────────────────────────────────────────────────────────
export const WithForm: Story = {
  name: "With Form",
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Invite Wordly Bot</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite Wordly to a Meeting</DialogTitle>
          <DialogDescription>
            Enter a meeting link and Wordly will join as a real-time interpreter.
            Supports Microsoft Teams, Google Meet, and Zoom.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-1.5">
            <Label htmlFor="meeting-link">Meeting link</Label>
            <Input
              id="meeting-link"
              placeholder="https://teams.microsoft.com/l/meetup-join/…"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            It may take up to 30 seconds for Wordly to join your meeting.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Invite</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

// ── Destructive Confirm ────────────────────────────────────────────────────────
export const DestructiveConfirm: Story = {
  name: "Destructive Confirm",
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">End Session</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>End this session?</DialogTitle>
          <DialogDescription>
            This will disconnect all presenters and attendees. This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline">Keep Session</Button>
          <Button variant="destructive">End Session</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
