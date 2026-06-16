"use client";

/**
 * TextField
 *
 * React migration of the production library `TextField`
 * (wordly-react-components-lib: src/components/library/inputs/TextField.tsx).
 *
 * The MUI original is a thin wrapper over `<MuiTextField variant="standard" />`
 * (an underline-style text input) with a floating label, `required`/`disabled`
 * states, a `password` toggle via `isPassword`, and an `inputColor` override
 * applied through a styled-component. Here we rebuild that surface on the shared
 * shadcn primitives (Input + Label) + Tailwind, dropping @mui/material and
 * @emotion entirely.
 *
 * Decisions for parity + product fit:
 * - Keep the same public surface: label, placeholder, required, disabled,
 *   isPassword, aria-label, inputColor, plus controlled value/defaultValue.
 * - `variant` controls the look: the lib hardcodes MUI `variant="standard"`
 *   (underline), so "standard" is OUR default too for 1:1 fidelity. "outlined"
 *   (the product's bordered @/components/ui/input) is offered as an option.
 * - `inputColor` is honored as an inline `color` style (the one legitimate use
 *   of a caller-supplied color; component-owned colors use tokens only).
 * - Added error/helper text affordances to match the repo convention proof
 *   (workspace-selector): destructive border + AlertCircle on error, muted
 *   helper text otherwise.
 *
 * Color mapping (lib palette → our tokens): wordlyBlue/brand focus → ring
 * (Brand Blue primary), grays to gray-* / muted-foreground, error to destructive.
 * In production, field values would be bound to form state / fetched from API.
 */

import * as React from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface TextFieldProps extends Omit<
  React.ComponentProps<"input">,
  "color"
> {
  /** String that will be used as the label. */
  label?: string;
  /** Default value (uncontrolled). */
  defaultValue?: string;
  /** Controlled value. */
  value?: string;
  /** Callback for when the user changes the text field. */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /** Placeholder text. */
  placeholder?: string;
  /** Marks the field required (adds an asterisk + aria-required). */
  required?: boolean;
  /** Disables the field. */
  disabled?: boolean;
  /** Renders a password field (with a show/hide toggle). */
  isPassword?: boolean;
  /** Accessible label / id for screen readers. */
  "aria-label"?: string;
  /**
   * Custom color for the input text (the one caller-supplied color allowed).
   * Underline/label color is theme-owned and uses tokens.
   */
  inputColor?: string;
  /** "standard" = MUI underline (lib default); "outlined" = product bordered input. */
  variant?: "outlined" | "standard";
  /** Error state — destructive styling + message. */
  error?: boolean;
  /** Message shown below the field when `error` is set. */
  errorMessage?: string;
  /** Helper text shown below the field when not in an error state. */
  helperText?: string;
  /** Wrapper className. */
  className?: string;
}

export function TextField({
  label = "",
  defaultValue,
  value,
  onChange,
  placeholder = "",
  required = false,
  disabled = false,
  isPassword = false,
  "aria-label": ariaLabel,
  inputColor,
  variant = "standard",
  error = false,
  errorMessage,
  helperText,
  className,
  id,
  type,
  ...otherProps
}: TextFieldProps) {
  const reactId = React.useId();
  const fieldId = id ?? ariaLabel ?? reactId;
  const [showPassword, setShowPassword] = React.useState(false);

  const resolvedType = isPassword
    ? showPassword
      ? "text"
      : "password"
    : (type ?? "text");

  const describedById =
    error && errorMessage
      ? `${fieldId}-error`
      : helperText
        ? `${fieldId}-helper`
        : undefined;

  return (
    <div className={cn("flex w-full flex-col gap-1.5", className)}>
      {label ? (
        <Label
          htmlFor={fieldId}
          className={cn(
            "text-gray-700",
            disabled && "cursor-not-allowed opacity-70",
            error && "text-destructive"
          )}
        >
          {label}
          {required ? (
            <span className="ml-0.5 text-destructive" aria-hidden="true">
              *
            </span>
          ) : null}
        </Label>
      ) : null}

      <div className="relative">
        <Input
          id={fieldId}
          type={resolvedType}
          value={value}
          defaultValue={defaultValue}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          onChange={onChange}
          aria-label={!label ? ariaLabel : undefined}
          aria-invalid={error || undefined}
          aria-required={required || undefined}
          aria-describedby={describedById}
          style={inputColor ? { color: inputColor } : undefined}
          className={cn(
            // Standard (MUI underline) variant: strip the box, keep a bottom rule.
            variant === "standard" &&
              "rounded-none border-0 border-b border-input bg-transparent px-0 shadow-none focus-visible:border-ring focus-visible:ring-0",
            error && "border-destructive aria-invalid:border-destructive",
            isPassword && "pr-10"
          )}
          {...otherProps}
        />

        {isPassword ? (
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            disabled={disabled}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2 rounded-sm p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50"
            )}
          >
            {showPassword ? (
              <EyeOff className="size-4" aria-hidden="true" />
            ) : (
              <Eye className="size-4" aria-hidden="true" />
            )}
          </button>
        ) : null}
      </div>

      {error && errorMessage ? (
        <div
          id={`${fieldId}-error`}
          className="flex items-center gap-1 text-sm text-destructive"
        >
          <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
          <span>{errorMessage}</span>
        </div>
      ) : helperText && !error ? (
        <p id={`${fieldId}-helper`} className="text-sm text-muted-foreground">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}

export default TextField;
