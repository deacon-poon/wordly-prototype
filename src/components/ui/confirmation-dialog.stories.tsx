import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Trash2, LogOut, AlertTriangle } from "lucide-react";

import { ConfirmationDialog } from "./confirmation-dialog";
import { Button } from "./button";

/**
 * ConfirmationDialog is a controlled overlay: drive it with `open` /
 * `onOpenChange`. Each story below wraps it in a trigger button with local
 * state so the dialog can be opened and dismissed live in the canvas.
 */
const meta: Meta<typeof ConfirmationDialog> = {
  title: "Core/ConfirmDialog",
  component: ConfirmationDialog,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive"],
    },
    isLoading: { control: "boolean" },
    confirmText: { control: "text" },
    cancelText: { control: "text" },
    title: { control: "text" },
    description: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof ConfirmationDialog>;

// A small live harness: a trigger button that controls dialog open state.
function DialogHarness({
  triggerLabel = "Open dialog",
  ...props
}: Partial<React.ComponentProps<typeof ConfirmationDialog>> & {
  triggerLabel?: string;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <div>
      <Button onClick={() => setOpen(true)}>{triggerLabel}</Button>
      <ConfirmationDialog
        open={open}
        onOpenChange={setOpen}
        title={props.title ?? "Confirm Action"}
        description={props.description ?? "Are you sure you want to proceed?"}
        onConfirm={props.onConfirm ?? (() => {})}
        {...props}
      />
    </div>
  );
}

// --- Variants ---------------------------------------------------------------

/** Default (confirm) variant: neutral teal confirm button, no icon. */
export const Default: Story = {
  render: () => (
    <DialogHarness
      triggerLabel="Confirm action"
      title="Confirm Action"
      description="Are you sure you want to proceed?"
    />
  ),
};

/** Destructive variant: red confirm button, used for irreversible actions. */
export const Destructive: Story = {
  render: () => (
    <DialogHarness
      triggerLabel="Delete event"
      variant="destructive"
      title="Delete Event"
      description="This will permanently remove the event and all its sessions. This action cannot be undone."
      confirmText="Delete"
    />
  ),
};

// --- With icon --------------------------------------------------------------

/** An icon renders centered above the title. Destructive tints it red. */
export const WithIcon: Story = {
  render: () => (
    <DialogHarness
      triggerLabel="Leave session"
      title="Leave Session"
      description="You can rejoin at any time from your dashboard."
      confirmText="Leave"
      icon={<LogOut className="h-10 w-10" />}
    />
  ),
};

/** Destructive variant with an icon: emphasizes a high-stakes action. */
export const DestructiveWithIcon: Story = {
  render: () => (
    <DialogHarness
      triggerLabel="Delete account"
      variant="destructive"
      title="Delete Account"
      description="All of your data will be erased immediately."
      confirmText="Delete account"
      icon={<Trash2 className="h-10 w-10" />}
    />
  ),
};

// --- Type-to-confirm --------------------------------------------------------

/**
 * Validation gate: the confirm button stays disabled until the user types the
 * exact `validationText`. Useful for dangerous, irreversible operations.
 */
export const TypeToConfirm: Story = {
  render: () => (
    <DialogHarness
      triggerLabel="Delete workspace"
      variant="destructive"
      title="Delete Workspace"
      description="This permanently deletes the workspace and removes all members."
      confirmText="Delete workspace"
      validationText="DELETE"
      icon={<AlertTriangle className="h-10 w-10" />}
    />
  ),
};

/** Type-to-confirm with a custom label above the input. */
export const TypeToConfirmCustomLabel: Story = {
  render: () => (
    <DialogHarness
      triggerLabel="Remove organization"
      variant="destructive"
      title="Remove Organization"
      description="Confirm by typing the organization name below."
      confirmText="Remove"
      validationText="Acme Corp"
      validationLabel="Type the organization name to confirm"
    />
  ),
};

// --- Loading ----------------------------------------------------------------

/**
 * Loading state: both buttons disable and the confirm label switches to
 * Processing while an async action runs.
 */
export const Loading: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    return (
      <div>
        <Button onClick={() => setOpen(true)}>Save changes</Button>
        <ConfirmationDialog
          open={open}
          onOpenChange={setOpen}
          title="Save Changes"
          description="Apply these updates to the live event?"
          confirmText="Save"
          isLoading={loading}
          onConfirm={() => {
            setLoading(true);
            window.setTimeout(() => {
              setLoading(false);
              setOpen(false);
            }, 1500);
          }}
        />
      </div>
    );
  },
};

// --- Custom labels ----------------------------------------------------------

/** Confirm and cancel text are fully customizable. */
export const CustomLabels: Story = {
  render: () => (
    <DialogHarness
      triggerLabel="Publish event"
      title="Publish Event"
      description="Attendees will be able to join once published."
      confirmText="Publish now"
      cancelText="Not yet"
    />
  ),
};
