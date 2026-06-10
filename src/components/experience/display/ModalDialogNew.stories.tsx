import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Lightbulb } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ModalDialogNew } from "./ModalDialogNew";

const meta: Meta<typeof ModalDialogNew> = {
  title: "Experience/Display/ModalDialogNew",
  component: ModalDialogNew,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "shadcn/Tailwind port of the wordly-react-components-lib `ModalDialogNew` (MUI 6). Controlled dialog with optional title icon, RTL support, configurable confirm/close actions, and full title/action overrides.",
      },
    },
  },
  args: {
    open: true,
    title: "Sample Modal Dialog",
  },
};

export default meta;

type Story = StoryObj<typeof ModalDialogNew>;

const SampleBody = (
  <p>
    Sample modal dialog text. In production, this content would be populated
    from data fetched from the API.
  </p>
);

/** Title-only header with default confirm + close actions (Brand Blue primary). */
export const Default: Story = {
  args: {
    title: "Sample Modal Dialog",
    confirmButton: { textLabel: "Confirm", onClick: () => {} },
    closeButton: { textLabel: "Close", onClick: () => {} },
    children: SampleBody,
  },
};

/** Title accompanied by a lucide icon. */
export const WithIcon: Story = {
  args: {
    title: "Modal With Icon",
    titleIcon: <Lightbulb className="size-4 text-primary" />,
    confirmButton: { textLabel: "Confirm", onClick: () => {} },
    closeButton: { textLabel: "Close", onClick: () => {} },
    children: SampleBody,
  },
};

/**
 * No `closeButton.onClick`: the close button is kept invisible to preserve
 * layout while the confirm button stays right-aligned (matches the lib).
 */
export const ConfirmOnly: Story = {
  args: {
    title: "Confirm Only",
    confirmButton: { textLabel: "Got it", onClick: () => {} },
    children: SampleBody,
  },
};

/** Right-to-left layout: icon/text, actions, and the corner X all flip. */
export const RightToLeft: Story = {
  args: {
    rtl: true,
    title: "نافذة حوار",
    titleIcon: <Lightbulb className="size-4 text-primary" />,
    confirmButton: { textLabel: "تأكيد", onClick: () => {} },
    closeButton: { textLabel: "إغلاق", onClick: () => {} },
    children: <p>نص نموذجي لنافذة الحوار.</p>,
  },
};

/** `dialogActions` override replaces the default confirm/close row. */
export const CustomActions: Story = {
  args: {
    title: "Custom Actions",
    fullWidth: true,
    children: SampleBody,
    dialogActions: (
      <span className="flex w-full items-center justify-end gap-2">
        <Button type="button" variant="ghost" size="icon" aria-label="hint">
          <Lightbulb className="size-4" />
        </Button>
        <Button type="button" variant="outline">
          Maybe
        </Button>
        <Button type="button">Yes</Button>
      </span>
    ),
  },
};

/** `dialogTitleComponent` override replaces the title + icon entirely. */
export const CustomTitle: Story = {
  args: {
    fullWidth: true,
    children: SampleBody,
    dialogTitleComponent: (
      <span className="flex items-center gap-2 text-lg font-semibold text-gray-900">
        <Lightbulb className="size-5 text-primary" />
        This is a custom title
        <Lightbulb className="size-5 text-action-teal-500" />
      </span>
    ),
    confirmButton: { textLabel: "Confirm", onClick: () => {} },
    closeButton: { textLabel: "Close", onClick: () => {} },
  },
};

/** Interactive: open/close wired to local state. */
export const Interactive: Story = {
  render: (args) => {
    const [open, setOpen] = React.useState(false);
    return (
      <div className="p-4">
        <Button onClick={() => setOpen(true)}>Open dialog</Button>
        <ModalDialogNew
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          confirmButton={{
            textLabel: "Confirm",
            onClick: () => setOpen(false),
          }}
          closeButton={{ textLabel: "Close", onClick: () => setOpen(false) }}
        >
          {SampleBody}
        </ModalDialogNew>
      </div>
    );
  },
  args: {
    title: "Interactive Dialog",
    titleIcon: <Lightbulb className="size-4 text-primary" />,
  },
};
