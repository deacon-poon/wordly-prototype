import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";

const meta: Meta<typeof Dialog> = {
  title: "Core/Dialog",
  component: Dialog,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof Dialog>;

// --- Default ----------------------------------------------------------------

/** Standard dialog: trigger button opens a centered modal with title, body, and footer actions. */
export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Session settings</DialogTitle>
          <DialogDescription>
            Update how this translation session behaves for attendees.
          </DialogDescription>
        </DialogHeader>
        <p className="text-sm text-gray-700">
          Changes apply immediately to everyone currently in the session.
        </p>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button>Save changes</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

// --- With a form ------------------------------------------------------------

/** Dialog wrapping a simple form, the most common admin/portal use. */
export const WithForm: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Rename session</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename session</DialogTitle>
          <DialogDescription>
            Give this session a name attendees will recognize.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2 py-2">
          <Label htmlFor="session-name">Session name</Label>
          <Input id="session-name" defaultValue="All-Hands Q3" />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button>Save</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

// --- Destructive confirmation -----------------------------------------------

/** Confirmation pattern: a destructive action confirmed inside the dialog footer. */
export const DestructiveConfirm: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete session</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete this session?</DialogTitle>
          <DialogDescription>
            This permanently removes the session and its transcript. This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="destructive">Delete</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

// --- No description ---------------------------------------------------------

/** Minimal dialog with only a title and a single confirm action. */
export const TitleOnly: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Quick notice</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Saved</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Got it</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

// --- Long content -----------------------------------------------------------

/** Wider dialog with scrollable body for longer content. */
export const ScrollableContent: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">View terms</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Translation accuracy notice</DialogTitle>
          <DialogDescription>
            Please review before enabling live captions.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-64 space-y-3 overflow-y-auto text-sm text-gray-700">
          {Array.from({ length: 8 }).map((_, i) => (
            <p key={i}>
              Machine translation is provided in real time and may contain
              errors. Critical communications should be verified by a human
              translator. Paragraph {i + 1}.
            </p>
          ))}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button>I understand</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

// --- Controlled -------------------------------------------------------------

/** Controlled open state driven by external React state. */
export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <div className="flex items-center gap-3">
        <Button onClick={() => setOpen(true)}>Open from outside</Button>
        <span className="text-sm text-gray-500">
          State: {open ? "open" : "closed"}
        </span>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Controlled dialog</DialogTitle>
              <DialogDescription>
                Open state is owned by the parent component.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  },
};
