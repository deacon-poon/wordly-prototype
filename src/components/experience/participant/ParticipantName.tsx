/**
 * ParticipantName
 *
 * Faithful 1:1 port of the production wordly-react-components-lib component
 * `src/components/app/dialogs/participant/ParticipantName.tsx` (MUI 6 + Emotion),
 * rebuilt on Tailwind utilities.
 *
 * Lib structure (mirrored exactly):
 *   <div>
 *     {presenter && <PresenterTypography small color={labelColor}>{presenterLabel}</PresenterTypography>}
 *     <NameTypography small>{formattedName}</NameTypography>
 *   </div>
 *
 * The two styled `Typography` helpers only set font sizing (in `em`, so the
 * block scales with the surrounding font-size) and, for the presenter label, a
 * tucking negative margin:
 *   - NameTypography      → fontSize 0.875em (small) / 1em
 *   - PresenterTypography → display:inherit, marginBottom:-0.4375em,
 *                           fontSize 0.625em (small) / 0.75em, color={labelColor}
 *
 * Color parity: the lib applies NO default color to either line — both inherit
 * the surrounding text color (MUI textPrimary). The presenter label only takes
 * a color when `labelColor` is supplied. We keep that exactly. `labelColor`
 * accepts a Tailwind text-color class (token-based) instead of the lib's hex.
 */

import * as React from "react";

import { cn } from "@/lib/utils";

export interface ParticipantNameProps {
  /** The name of the participant. */
  name: string;

  /** If true, this will shrink the name and presenter label font sizes. */
  small?: boolean;

  /** If true, this adds the presenter label above the participant's name. */
  presenter?: boolean;

  /** Localized string for the presenter label. Defaults to "Presenter". */
  presenterLabel?: string;

  /**
   * Color of the label. Lib accepted a hex string; here it accepts a Tailwind
   * text-color class (token-based). When omitted the label inherits the
   * surrounding text color (lib parity).
   */
  labelColor?: string;

  className?: string;
}

/**
 * Renders the participant name and, when `presenter` is true, the presenter
 * label tucked above it. Font sizes are expressed in `em` so the block scales
 * with the surrounding font-size (matching the lib behavior).
 */
export function ParticipantName({
  name,
  small = false,
  presenter = false,
  presenterLabel = "Presenter",
  labelColor,
  className,
}: ParticipantNameProps) {
  // Trim and fall back to an anonymous label when empty (lib parity).
  const trimmedName = name.trim();
  const formattedName = trimmedName === "" ? "Anonymous" : trimmedName;

  return (
    <div className={className}>
      {presenter ? (
        // PresenterTypography: display inherit, tucked under the name via the
        // -0.4375em bottom margin, scaled em font-size. Color only when given.
        <span
          className={cn("block leading-none -mb-[0.4375em]", labelColor)}
          style={{ fontSize: small ? "0.625em" : "0.75em" }}
        >
          {presenterLabel}
        </span>
      ) : null}
      {/* NameTypography: scaled em font-size, inherits text color. */}
      <span className="block" style={{ fontSize: small ? "0.875em" : "1em" }}>
        {formattedName}
      </span>
    </div>
  );
}

export default ParticipantName;
