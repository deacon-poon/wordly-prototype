import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "@/components/ui/button";
import { ModalDialog, type ModalDialogProps } from "./ModalDialog";

// ModalDialog is controlled (open + onClose). Stories wrap it in a small
// launcher so the dialog can be opened/closed interactively in the canvas.
function ModalDialogDemo({
  open: initialOpen = false,
  onConfirm,
  ...props
}: Partial<ModalDialogProps>) {
  const [open, setOpen] = React.useState(initialOpen);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <ModalDialog
        title="Sample Modal Dialog"
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={
          onConfirm === null
            ? null
            : () => {
                onConfirm?.();
                setOpen(false);
              }
        }
        {...props}
      >
        {props.children ?? (
          <p>
            Sample modal dialog text. In production, this content would be
            composed from data fetched via the API.
          </p>
        )}
      </ModalDialog>
    </>
  );
}

const meta: Meta<typeof ModalDialogDemo> = {
  title: "Experience/Display/ModalDialog",
  component: ModalDialogDemo,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Port of the production wordly-react-components-lib `ModalDialog` (MUI + Emotion) onto shadcn/Radix Dialog + Tailwind. Optional title, toggleable dividers, scrollable body, and an actions row with a tertiary Close and an optional Brand-Blue Confirm.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ModalDialogDemo>;

/** Default: title, dividers, Close + Confirm (Brand Blue). */
export const Default: Story = {
  args: { open: true },
};

/** Informational dialog with no Confirm action (onConfirm = null). */
export const InfoOnly: Story = {
  args: {
    open: true,
    title: "About this session",
    onConfirm: null,
    closeText: "Got it",
  },
};

/** Destructive confirm — e.g. deleting a record. */
export const DestructiveConfirm: Story = {
  args: {
    open: true,
    title: "Delete session?",
    confirmText: "Delete",
    confirmVariant: "destructive",
    closeText: "Cancel",
    children: (
      <p>
        This will permanently remove the session and all of its transcripts.
        This action cannot be undone.
      </p>
    ),
  },
};

/** Dividers hidden for a cleaner, borderless body. */
export const NoDividers: Story = {
  args: {
    open: true,
    title: "Quick note",
    hideDividers: true,
  },
};

/** No title — body-only content. */
export const NoTitle: Story = {
  args: {
    open: true,
    title: undefined,
  },
};

/** Wider panel for denser content via fullWidth. */
export const FullWidth: Story = {
  args: {
    open: true,
    title: "Session details",
    fullWidth: true,
    children: (
      <div className="space-y-3">
        <p>
          A wider panel suits forms or multi-column layouts. The body region
          scrolls independently when content overflows.
        </p>
        {Array.from({ length: 8 }).map((_, i) => (
          <p key={i} className="text-gray-600">
            Row {i + 1}: additional detail that demonstrates the scrollable
            content area inside the dialog.
          </p>
        ))}
      </div>
    ),
  },
};

/** Confirm disabled (e.g. invalid form state). */
export const ConfirmDisabled: Story = {
  args: {
    open: true,
    title: "Complete the form",
    confirmDisabled: true,
  },
};
