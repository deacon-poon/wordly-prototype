"use client";

/**
 * ModalDialogNew
 *
 * React/shadcn port of the production `wordly-react-components-lib`
 * `ModalDialogNew` (MUI 6 + Emotion). The original wraps MUI's
 * `Dialog`/`DialogTitle`/`DialogContent`/`DialogActions` with an `IconButton`
 * close affordance and `TextButton` confirm/close actions.
 *
 * This port rebuilds the same public surface on our shadcn primitives
 * (Radix Dialog via `@/components/ui/dialog` + Button) and Tailwind tokens:
 *  - controlled `open` + `onClose`
 *  - optional `title` + `titleIcon`, or a full `dialogTitleComponent` override
 *  - RTL mode (reverses title icon/text order, action order, and the X corner)
 *  - default confirm/close actions via `confirmButton` / `closeButton`, or a
 *    full `dialogActions` override
 *  - a corner X close button (mirrors the MUI IconButton)
 *  - `ariaLabels` passthrough for title/content/actions
 *
 * MUI/Emotion removed entirely. The lib's TextButton `prominence` maps to our
 * Button variants: primary → default (Brand Blue), tertiary → outline. The
 * lib's grey divider/border (lightnessGray82) maps to `border-gray-*`.
 * Content is supplied via `children`; in production the surrounding data would
 * be fetched from the API.
 */

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "@/components/ui/button";

// ---------------------------------------------------------------------------
// Button options (mirrors the lib's `ButtonOptions` / TextButton surface)
// ---------------------------------------------------------------------------

export interface ModalDialogButtonOptions {
  /** Text to show in the button. */
  textLabel?: string;
  /** Styling props forwarded to the underlying Button (variant, size, etc.). */
  buttonProps?: Omit<ButtonProps, "children" | "onClick">;
  /**
   * Click handler. For the confirm button, if omitted the button is not
   * rendered (matches the lib). For the close button, if omitted the button is
   * rendered but kept invisible to preserve layout (matches the lib).
   */
  onClick?: () => void;
  /** Ref to the underlying button element. */
  buttonRef?: React.Ref<HTMLButtonElement>;
}

export interface ModalDialogNewAriaLabels {
  titleId?: string;
  contentId?: string;
  actionButtons?: string;
}

export interface ModalDialogNewProps {
  /** Open state of the modal dialog. */
  open: boolean;
  /**
   * Close callback (overlay click / Esc / corner X). This only closes the
   * dialog — use `closeButton.onClick` for the close button's own action.
   */
  onClose?: () => void;

  /** Stretch the dialog to fill its width constraint (maps to MUI `fullWidth`). */
  fullWidth?: boolean;

  /** Title text. Ignored when `dialogTitleComponent` is provided. */
  title?: string;
  /** Optional icon rendered next to the title. */
  titleIcon?: React.ReactNode;

  /**
   * Right-to-left layout: reverses title icon/text order, action button order,
   * content text alignment, and moves the corner X to the opposite side.
   * @default false
   */
  rtl?: boolean;

  /** Confirm (primary) action. Not rendered unless `onClick` is provided. */
  confirmButton?: ModalDialogButtonOptions;
  /** Close (tertiary) action. Rendered invisibly when `onClick` is omitted. */
  closeButton?: ModalDialogButtonOptions;

  /**
   * Full replacement for the action row. When provided, `confirmButton` and
   * `closeButton` are ignored.
   */
  dialogActions?: React.ReactNode;
  /**
   * Full replacement for the title region. When provided, `title` and
   * `titleIcon` are ignored.
   */
  dialogTitleComponent?: React.ReactNode;

  /** ARIA labels for the title / content / action regions. */
  ariaLabels?: ModalDialogNewAriaLabels;

  /** Class applied to the dialog panel. */
  className?: string;

  /** Dialog body content (wrapped in a scrollable content region). */
  children: React.ReactNode;
}

/**
 * Dialog to display information, with optional title icon, RTL support, and
 * configurable confirm/close actions.
 */
export function ModalDialogNew({
  open,
  onClose,
  fullWidth = false,
  title,
  titleIcon,
  rtl = false,
  confirmButton,
  closeButton,
  dialogActions,
  dialogTitleComponent,
  ariaLabels = {},
  className,
  children,
}: ModalDialogNewProps) {
  const confirmProps: ModalDialogButtonOptions = {
    textLabel: "Confirm",
    onClick: () => {},
    ...confirmButton,
  };
  const closeProps: ModalDialogButtonOptions = {
    textLabel: "Close",
    onClick: () => {},
    ...closeButton,
  };

  const hasTitle = Boolean(title || dialogTitleComponent);

  function handleOpenChange(next: boolean) {
    if (!next) onClose?.();
  }

  const renderDefaultActions = () => (
    <>
      <Button
        type="button"
        variant="outline"
        ref={closeProps.buttonRef}
        onClick={closeProps.onClick}
        className={cn(
          // Lib keeps the close button in the layout but hides it when it has
          // no handler, so the confirm button stays right-aligned.
          !closeButton?.onClick && "invisible"
        )}
        {...closeProps.buttonProps}
      >
        {closeProps.textLabel}
      </Button>
      {confirmButton?.onClick ? (
        <Button
          type="button"
          variant="default"
          ref={confirmProps.buttonRef}
          onClick={confirmProps.onClick}
          {...confirmProps.buttonProps}
        >
          {confirmProps.textLabel}
        </Button>
      ) : null}
    </>
  );

  return (
    <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-black/80",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          )}
        />
        <DialogPrimitive.Content
          dir={rtl ? "rtl" : "ltr"}
          aria-modal
          className={cn(
            "fixed left-[50%] top-[50%] z-50 grid max-w-lg translate-x-[-50%] translate-y-[-50%] gap-2 rounded-lg border border-gray-300 bg-white p-3 shadow-lg duration-200",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            fullWidth ? "w-full" : "w-[calc(100%-2rem)]",
            className
          )}
        >
          {/* Title region (mirrors MUI DialogTitle). Always present for the
              corner X; the heading content only shows when a title exists. */}
          <div
            className={cn(
              "relative flex items-center justify-between px-3 pt-1",
              rtl ? "flex-row-reverse pl-[30px] pr-3" : "pr-[30px] pl-3"
            )}
          >
            {hasTitle ? (
              dialogTitleComponent != null ? (
                <DialogPrimitive.Title asChild>
                  <div id={ariaLabels.titleId} className="min-w-0">
                    {dialogTitleComponent}
                  </div>
                </DialogPrimitive.Title>
              ) : (
                <DialogPrimitive.Title
                  id={ariaLabels.titleId}
                  className={cn(
                    "flex items-center text-lg font-semibold leading-none tracking-tight text-gray-900",
                    rtl ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  {titleIcon ? (
                    <span
                      className={cn(
                        "flex items-center",
                        rtl ? "ml-2" : "mr-2",
                        "[&_svg]:size-4"
                      )}
                      aria-hidden="true"
                    >
                      {titleIcon}
                    </span>
                  ) : null}
                  <span>{title}</span>
                </DialogPrimitive.Title>
              )
            ) : (
              // Radix requires a Title for accessibility; keep a visually
              // hidden one when no title is supplied.
              <DialogPrimitive.Title className="sr-only">
                Dialog
              </DialogPrimitive.Title>
            )}

            <DialogPrimitive.Close
              aria-label="close"
              className={cn(
                "absolute top-1 rounded-sm p-1 text-gray-500 opacity-70 transition-opacity hover:opacity-100",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                rtl ? "left-1" : "right-1"
              )}
            >
              <X className="size-4" />
            </DialogPrimitive.Close>
          </div>

          {/* Content region (mirrors MUI DialogContent). */}
          <div
            aria-label={ariaLabels.contentId}
            className={cn(
              "max-h-[70vh] overflow-y-auto p-3 text-sm text-gray-700",
              rtl ? "text-right" : "text-left"
            )}
          >
            {children}
          </div>

          {/* Action region (mirrors MUI DialogActions). */}
          <div
            aria-label={ariaLabels.actionButtons}
            className={cn(
              "flex items-center justify-between gap-2 px-3 pb-1",
              rtl ? "flex-row-reverse" : "flex-row"
            )}
          >
            {dialogActions != null ? dialogActions : renderDefaultActions()}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
