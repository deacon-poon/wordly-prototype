"use client";

/**
 * ModalDialog
 *
 * Port of the production wordly-react-components-lib `ModalDialog`
 * (MUI 6 + Emotion) onto this repo's shadcn/Radix + Tailwind foundation.
 *
 * The original is a thin wrapper over MUI `<Dialog>` with:
 *   - optional title (`DialogTitle`)
 *   - dividers above/below the body (`<Divider>`, toggled via `hideDividers`)
 *   - a scrollable content region (`DialogContent`)
 *   - an actions row (`DialogActions`) holding a tertiary "Close" button and
 *     an optional primary "Confirm" button (rendered only when `onConfirm` is set).
 *
 * Mapping applied:
 *   MUI Dialog/DialogContent/DialogTitle  → @/components/ui/dialog (Radix)
 *   MUI <Divider>                         → @/components/ui/separator
 *   TextButton prominence="tertiary"      → Button variant="ghost"  (Close)
 *   TextButton prominence="primary"       → Button variant="default" (Confirm, Brand Blue)
 *   Emotion styled bits                   → Tailwind utility classes inline
 *
 * The lib's brand `wordlyBlue` / `newWordlyBlue` maps to OUR Brand Blue
 * primary token (the `bg-primary` shadcn token) — so the Confirm button stays
 * Brand Blue by default. A `confirmVariant` prop allows the destructive/success
 * accents without raw hex.
 */

import * as React from "react";

import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Button, type ButtonProps } from "@/components/ui/button";

// ---------------------------------------------------------------------------
// Props — mirrors the lib's ModalDialogProps public surface, minus MUI-only
// passthroughs (DialogProps, PaperProps). Data/content arrives via children.
// ---------------------------------------------------------------------------

export interface ModalDialogProps {
  /** Open state of the dialog (controlled). */
  open: boolean;
  /** Fired when the dialog requests to close (Close button, backdrop, Esc). */
  onClose: () => void;
  /** Title shown in the header section. Omit to hide the header entirely. */
  title?: string;
  /** Body content of the dialog. */
  children: React.ReactNode;
  /** Label for the Close (tertiary) button. */
  closeText?: string;
  /** Label for the Confirm (primary) button. */
  confirmText?: string;
  /**
   * Confirm callback. When null/undefined, the Confirm button is not rendered
   * (matches the lib: "If this prop is null, no confirm option will be shown").
   */
  onConfirm?: (() => void) | null;
  /** Brand-Blue by default; switch to destructive/success accents as needed. */
  confirmVariant?: "default" | "destructive" | "success" | "secondary";
  /**
   * Styling/behavior passthrough for the Confirm button (mirrors the lib's
   * `confirmButtonProps: Omit<TextButtonProps, 'label' | 'handleClick'>`).
   * Forwarded to our shadcn Button (variant, size, disabled, className, etc.).
   */
  confirmButtonProps?: Omit<ButtonProps, "children" | "onClick">;
  /** Disable the Confirm button (e.g. while a form is invalid). */
  confirmDisabled?: boolean;
  /** Hide the separators above and below the body content. */
  hideDividers?: boolean;
  /** Stretch the dialog to a wider, full-width-ish panel. */
  fullWidth?: boolean;
  /** Hide the action footer altogether (content-only / custom-footer use). */
  hideActions?: boolean;
  /** Extra classes for the dialog panel. */
  className?: string;
}

/**
 * Dialog to display information, with an optional confirm action.
 */
export function ModalDialog({
  open,
  onClose,
  title,
  children,
  closeText = "Close",
  confirmText = "Confirm",
  onConfirm = null,
  confirmVariant = "default",
  confirmButtonProps,
  confirmDisabled = false,
  hideDividers = false,
  fullWidth = false,
  hideActions = false,
  className,
}: ModalDialogProps) {
  // Radix fires onOpenChange(false) for backdrop click + Esc; route to onClose,
  // matching MUI's onClose(event, reason) close behavior.
  function handleOpenChange(next: boolean) {
    if (!next) onClose();
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        aria-modal="true"
        aria-describedby="modal-description"
        className={cn(
          "p-0 gap-0 overflow-hidden",
          fullWidth ? "max-w-2xl" : "max-w-lg",
          className
        )}
      >
        {title ? (
          <DialogHeader className="px-6 py-4 text-left">
            <DialogTitle id="modal-title" className="text-gray-900">
              {title}
            </DialogTitle>
          </DialogHeader>
        ) : null}

        {!hideDividers && title ? <Separator /> : null}

        <div
          id="modal-description"
          role="main"
          tabIndex={0}
          className="max-h-[60vh] overflow-y-auto px-6 py-4 text-sm text-gray-700 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0"
        >
          {children}
        </div>

        {!hideActions ? (
          <>
            {!hideDividers ? <Separator /> : null}
            <DialogFooter className="px-6 py-4">
              <Button variant="ghost" onClick={onClose}>
                {closeText}
              </Button>
              {onConfirm ? (
                <Button
                  variant={confirmVariant}
                  onClick={onConfirm}
                  disabled={confirmDisabled}
                  {...confirmButtonProps}
                >
                  {confirmText}
                </Button>
              ) : null}
            </DialogFooter>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
