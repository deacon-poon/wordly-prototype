"use client";

/**
 * FormControlWrapper
 *
 * Faithful 1:1 React port of the production Angular shared wrapper:
 *   wordly_portal:
 *     libs/components/shared/wordly-controls/wordly-form-control-wrapper/
 *       wordly-form-control-wrapper.component.{html,ts}
 *
 * It encapsulates the UI elements shared between every form control
 * (input, select, etc.):
 *   - Label with required indicator + optional info icon/tooltip
 *   - Helper text (on top, stacked-only, OR below the control)
 *   - Error message (icon + text)
 *   - Extra info text
 *
 * The actual control (the <Select> trigger, etc.) is passed via `children`,
 * exactly like Angular's `<ng-content>`.
 *
 * Class presets are derived from the ported design-variants
 * (`generateWordlyClasses`) keyed off `layoutVariant`, mirroring how the
 * Angular WordlyFormControlBase feeds `containerClasses`/`labelClasses`/...
 * into this template. The default layout is the responsive
 * label-beside-control grid ("default"), matching the Angular default.
 */

import * as React from "react";
// This lucide-react version exports the legacy alias `AlertCircle` for the icon
// the portal references as `lucideCircleAlert` (same glyph). Aliased for parity.
import { AlertCircle as CircleAlert, Info } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  generateWordlyClasses,
  type WordlyDesignVariants,
} from "@/components/ui/design-variants";

/**
 * Mirrors WordlyFormControlWrapperComponent.removeGridClassesIfNoLabel().
 * When there is no label there is nothing to sit in the first grid column, so
 * the 2-column grid activation classes are stripped to avoid a phantom column.
 */
function removeGridClassesIfNoLabel(
  containerClasses: string,
  hasLabel: boolean
): string {
  if (hasLabel || !containerClasses) return containerClasses;
  return (
    containerClasses
      // Remove grid activation classes
      .replace(/\b(?:lg:|xl:|2xl:)?grid\b/g, "")
      // Remove grid-cols definitions
      .replace(/\b(?:lg:|xl:|2xl:)?grid-cols-\[[^\]]+\]/g, "")
      // Remove col-span classes
      .replace(/\b(?:lg:|xl:|2xl:)?col-span-\d+\b/g, "")
      // Clean up multiple spaces
      .replace(/\s+/g, " ")
      .trim()
  );
}

export interface FormControlWrapperProps {
  label?: string;
  required?: boolean;
  helperText?: string;
  /** Custom helper-text node (mirrors Angular `helperTextTemplate`). */
  helperTextTemplate?: React.ReactNode;
  showError?: boolean;
  currentErrorMessage?: string;
  extraInfo?: string;
  showInfoIcon?: boolean;
  infoTooltipText?: string;
  /**
   * When true, helper text renders between the label and the control instead
   * of below it. Only takes visual effect with the "stacked" layout, matching
   * the Angular `_helperTextOnTop` guard.
   */
  helperTextOnTop?: boolean;
  controlId?: string;

  // ===== DESIGN VARIANT INPUTS (drive the class presets) =====
  /** Container layout. Default "default" = responsive label-beside grid. */
  layoutVariant?: WordlyDesignVariants["layout"];
  labelStyleVariant?: WordlyDesignVariants["labelStyle"];
  labelSizeVariant?: WordlyDesignVariants["labelSize"];
  labelContextVariant?: WordlyDesignVariants["labelContext"];
  spacingVariant?: WordlyDesignVariants["spacing"];
  contentContextVariant?: WordlyDesignVariants["contentContext"];
  errorVariant?: WordlyDesignVariants["error"];
  helperSizeVariant?: WordlyDesignVariants["helperSize"];
  helperTextContextVariant?: WordlyDesignVariants["helperTextContext"];
  errorSizeVariant?: WordlyDesignVariants["errorSize"];
  errorContextVariant?: WordlyDesignVariants["errorContext"];
  severityVariant?: WordlyDesignVariants["severity"];
  themeVariant?: WordlyDesignVariants["theme"];
  extraInfoSizeVariant?: WordlyDesignVariants["extraInfoSize"];

  /** Optional class-string overrides (precomputed). */
  containerClasses?: string;
  labelClasses?: string;
  contentClasses?: string;
  helperTextClasses?: string;
  errorClasses?: string;
  extraInfoClasses?: string;

  className?: string;
  /** The control itself (Angular <ng-content>). */
  children?: React.ReactNode;
}

export function FormControlWrapper({
  label = "",
  required = false,
  helperText = "",
  helperTextTemplate,
  showError = false,
  currentErrorMessage = "",
  extraInfo = "",
  showInfoIcon = false,
  infoTooltipText = "",
  helperTextOnTop = false,
  controlId,
  layoutVariant = "default",
  labelStyleVariant,
  labelSizeVariant,
  labelContextVariant,
  spacingVariant,
  contentContextVariant,
  errorVariant,
  helperSizeVariant,
  helperTextContextVariant,
  errorSizeVariant,
  errorContextVariant,
  severityVariant,
  themeVariant,
  extraInfoSizeVariant,
  containerClasses,
  labelClasses,
  contentClasses,
  helperTextClasses,
  errorClasses,
  extraInfoClasses,
  className,
  children,
}: FormControlWrapperProps) {
  const hasLabel = !!label;

  // Mirror WordlyFormControlBase.updateClasses(): derive every class string
  // from the shared design-variants keyed off the layout variant.
  const classes = React.useMemo(
    () =>
      generateWordlyClasses({
        layout: layoutVariant,
        labelStyle: labelStyleVariant,
        labelContext: labelContextVariant,
        spacing: spacingVariant,
        contentContext: contentContextVariant,
        error: errorVariant ?? showError,
        helperSize: helperSizeVariant,
        helperTextContext: helperTextContextVariant,
        errorSize: errorSizeVariant,
        errorContext: errorContextVariant,
        severity: severityVariant,
        theme: themeVariant,
        labelSize: labelSizeVariant,
        extraInfoSize: extraInfoSizeVariant,
      }),
    [
      layoutVariant,
      labelStyleVariant,
      labelContextVariant,
      spacingVariant,
      contentContextVariant,
      errorVariant,
      showError,
      helperSizeVariant,
      helperTextContextVariant,
      errorSizeVariant,
      errorContextVariant,
      severityVariant,
      themeVariant,
      labelSizeVariant,
      extraInfoSizeVariant,
    ]
  );

  const resolvedContainer = removeGridClassesIfNoLabel(
    containerClasses ?? classes.container,
    hasLabel
  );
  const resolvedLabel = labelClasses ?? classes.label;
  const resolvedContent = contentClasses ?? classes.content;
  const resolvedHelper = helperTextClasses ?? classes.helperText;
  const resolvedError = errorClasses ?? classes.error;
  const resolvedExtraInfo = extraInfoClasses ?? classes.extraInfo;

  // _helperTextOnTop guard: only honored in the stacked layout.
  const helperOnTop = helperTextOnTop && layoutVariant === "stacked";
  const hasHelper = !!helperText || !!helperTextTemplate;

  const hintContent = helperTextTemplate ?? helperText;

  return (
    <div
      className={cn(
        resolvedContainer,
        helperOnTop && "helper-top-gap",
        className
      )}
    >
      {/* Label & required indicator */}
      {hasLabel ? (
        <div className={resolvedLabel}>
          <label htmlFor={controlId || undefined}>
            {label}
            {required ? <span className="text-destructive">*</span> : null}
          </label>

          {/* Info icon (tooltip text exposed via title for the React port) */}
          {showInfoIcon ? (
            <span
              className="shrink-0 inline-flex"
              title={infoTooltipText || undefined}
              aria-label={infoTooltipText || undefined}
            >
              <Info className="size-4" aria-hidden="true" />
            </span>
          ) : null}
        </div>
      ) : null}

      {/* Helper text ON TOP: between label and control (stacked layout only) */}
      {helperOnTop && hasHelper && !showError ? (
        <div className={cn(resolvedHelper, "pl-3")}>{hintContent}</div>
      ) : null}

      {/* Content wrapper for the control, helper text and extra info */}
      <div className={resolvedContent}>
        {/* Actual control (input, select, etc.) — Angular <ng-content> */}
        {children}

        {/* Helper text BELOW the control (default) */}
        {!helperOnTop && hasHelper && !showError ? (
          <div className={cn(resolvedHelper, "pl-3")}>{hintContent}</div>
        ) : null}

        {/* Error message */}
        {showError ? (
          <div className={cn(resolvedError, "pl-3")}>
            <div className="error-icon">
              <CircleAlert className="size-4 shrink-0" aria-hidden="true" />
            </div>
            <span>{currentErrorMessage}</span>
          </div>
        ) : null}

        {/* Extra info text */}
        {extraInfo ? (
          <div className={cn(resolvedExtraInfo, "pl-3")}>
            <CircleAlert className="size-4 text-blue-600" aria-hidden="true" />
            <span>{extraInfo}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
