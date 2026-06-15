"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export interface PasswordInputProps extends Omit<
  React.ComponentProps<"input">,
  "type"
> {
  /** Start with the password revealed (default false). */
  defaultVisible?: boolean;
}

/**
 * Password field with a show/hide toggle — the atomic version of the eye-toggle
 * input that was previously hand-rolled across the app (login, invite, session
 * join). The input reserves trailing space (`pr-10`) so the eye button never
 * sits on top of the placeholder or the typed value.
 */
const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, defaultVisible = false, disabled, ...props }, ref) => {
    const [visible, setVisible] = React.useState(defaultVisible);
    return (
      <div className="relative w-full">
        <Input
          ref={ref}
          type={visible ? "text" : "password"}
          disabled={disabled}
          // Reserve room for the toggle so text/placeholder never run under it.
          className={cn("pr-10", className)}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          disabled={disabled}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          tabIndex={disabled ? -1 : 0}
          className={cn(
            "absolute right-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50"
          )}
        >
          {visible ? (
            <EyeOff className="size-4" aria-hidden="true" />
          ) : (
            <Eye className="size-4" aria-hidden="true" />
          )}
        </button>
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
