/**
 * ParticipantName
 *
 * React migration of the production wordly-react-components-lib component
 * `src/components/app/dialogs/participant/ParticipantName.tsx`.
 *
 * The original used two typography helpers (NameTypography +
 * PresenterTypography) whose only job was font sizing in `em` units (so the name
 * scales with the parent font-size) plus a fixed neutral presenter-label color
 * (lib `twilightHaze`). Both are folded into Tailwind utilities here:
 *
 *   - NameTypography      → <span> with inline em font-size (1em / 0.875em small)
 *   - PresenterTypography → <span> with inline em font-size (0.75em / 0.625em
 *                           small), negative margin to tuck it against the name,
 *                           and the gray label color mapped to `text-gray-500`.
 *
 * Pure Tailwind, no external UI framework. Brand Blue stays primary elsewhere; this
 * component is intentionally neutral (name in foreground, label in gray) and
 * exposes `labelColor` for callers that need an accent (e.g. a presenter
 * highlight color). Data arrives via props — in production the participant
 * name would be fetched from the session/participant API.
 */

import * as React from "react";

import { cn } from "@/lib/utils";

export interface ParticipantNameProps {
  /** The name of the participant. */
  name: string;

  /** If true, shrinks the name and presenter-label font sizes. */
  small?: boolean;

  /** If true, renders the presenter label above the participant's name. */
  presenter?: boolean;

  /**
   * Localized string for the presenter label. Defaults to "Presenter".
   */
  presenterLabel?: string;

  /**
   * Optional color for the presenter label. Accepts a Tailwind text color
   * class (e.g. "text-primary") to stay within the design tokens. When
   * omitted the label uses the neutral `text-gray-500`.
   */
  labelColor?: string;

  className?: string;
}

/**
 * Renders a participant name, optionally with a small "Presenter" label above
 * it. Font sizes are expressed in `em` so the whole block scales with the
 * surrounding font-size (matching the original library behavior).
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
    <div className={cn("min-w-0", className)}>
      {presenter ? (
        <span
          // PresenterTypography: display:inherit, tucked under the name via a
          // negative bottom margin, scaled font-size in em. Neutral gray label
          // unless the caller supplies a token-based labelColor class.
          className={cn(
            "block leading-none -mb-[0.4375em]",
            labelColor ?? "text-gray-500"
          )}
          style={{ fontSize: small ? "0.625em" : "0.75em" }}
        >
          {presenterLabel}
        </span>
      ) : null}
      <span
        // NameTypography: scaled font-size in em, primary foreground color.
        className="block truncate leading-tight text-gray-900"
        style={{ fontSize: small ? "0.875em" : "1em" }}
      >
        {formattedName}
      </span>
    </div>
  );
}

export default ParticipantName;
