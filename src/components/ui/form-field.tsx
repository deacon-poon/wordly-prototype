"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface FormFieldProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** Field label rendered above the control. */
  label?: React.ReactNode;
  /** Helper text shown below the control (hidden when `error` is present). */
  description?: React.ReactNode;
  /** Error message; replaces the description and marks the control invalid. */
  error?: React.ReactNode;
  /** Show the required asterisk on the label. */
  required?: boolean;
  /**
   * The control (Input, Select, Checkbox, RadioGroup, …). The field auto-wires
   * `id`, `aria-describedby`, and `aria-invalid` onto a single control child.
   */
  children: React.ReactElement;
}

/**
 * Standard vertical form-field layout: label → control → description/error.
 * One reusable wrapper so every field (select, checkbox, radio, input) looks
 * consistent and stays accessible without hand-wiring ids each time.
 *
 *   <FormField label="Source language" description="Spoken in the room">
 *     <Select>…</Select>
 *   </FormField>
 *
 *   <FormField label="Email" error="Enter a valid email" required>
 *     <Input type="email" />
 *   </FormField>
 */
const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  (
    { label, description, error, required, className, children, ...props },
    ref
  ) => {
    const reactId = React.useId();
    const child = React.Children.only(children);
    const controlId = (child.props as { id?: string }).id ?? reactId;
    const descriptionId = description ? `${controlId}-description` : undefined;
    const errorId = error ? `${controlId}-error` : undefined;
    const describedBy = errorId ?? descriptionId;

    const control = React.cloneElement(
      child,
      {
        id: controlId,
        "aria-describedby":
          [(child.props as Record<string, unknown>)["aria-describedby"], describedBy]
            .filter(Boolean)
            .join(" ") || undefined,
        "aria-invalid": error
          ? true
          : (child.props as Record<string, unknown>)["aria-invalid"],
      } as Partial<typeof child.props>
    );

    return (
      <div
        ref={ref}
        className={cn("flex flex-col items-start gap-1.5", className)}
        {...props}
      >
        {label && (
          <Label htmlFor={controlId} className="text-gray-700">
            {label}
            {required && (
              <span className="ml-0.5 text-destructive" aria-hidden="true">
                *
              </span>
            )}
          </Label>
        )}
        {control}
        {error ? (
          <p id={errorId} className="text-sm text-destructive">
            {error}
          </p>
        ) : description ? (
          <p id={descriptionId} className="text-sm text-gray-600">
            {description}
          </p>
        ) : null}
      </div>
    );
  }
);
FormField.displayName = "FormField";

export { FormField };
