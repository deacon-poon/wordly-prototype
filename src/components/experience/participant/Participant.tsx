"use client";

/**
 * Participant
 *
 * Port of the production `Participant` component family from
 * wordly-react-components-lib (MUI 6 + Emotion):
 *   src/components/app/dialogs/participant/{Participant,ParticipantName,WordlyAvatar}.tsx
 *
 * The original is three co-located pieces:
 *  - WordlyAvatar  — MUI <Avatar> with extracted initials, sizable, hideable.
 *  - ParticipantName — MUI <Typography> name with an optional "Presenter"
 *    label stacked above it.
 *  - Participant   — composes the name + an optional presenter indicator dot.
 *
 * This rebuild folds all three onto the shared shadcn `Avatar` primitive plus
 * Tailwind utilities. All the original MUI/Emotion styled code has been removed.
 * Theme colors are mapped to our brand tokens:
 *   lib wordlyBlue/brand → Brand Blue primary (primary / primary-blue-*)
 *   lib success green indicator (bobbleGreen) → accent-green-*
 *   lib grays (label) → gray-*
 *
 * Data arrives via props with small inline mock defaults (in production these
 * would be fetched from the participants API).
 */

import * as React from "react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// ---------------------------------------------------------------------------
// Initials helper — ported 1:1 from WordlyAvatar.extractInitials
// ---------------------------------------------------------------------------

/** Minimum chars to keep before falling back to "first 3 characters". */
const MINIMUM_NAME_CHARACTERS = 3;

/**
 * Extract initials from a name, assuming "given family" order. For other
 * syllabic languages (single contiguous token), takes up to the first 3 chars.
 */
export function extractInitials(name: string): string {
  const names = name.trim().toUpperCase().split(" ");

  // Single token (also handles empty strings): first 3 characters.
  if (names.length === 1) {
    return names[0].slice(0, MINIMUM_NAME_CHARACTERS);
  }

  // 2–3 tokens: first initial of each.
  if (names.length <= 3) {
    return names
      .map((n) => n[0])
      .join("")
      .slice(0, 3);
  }

  // 4+ tokens: first initial of the first and last names.
  return names[0].slice(0, 1) + names[names.length - 1].slice(0, 1);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export interface ParticipantProps {
  /** The name of the participant. Empty/blank renders as "Anonymous". */
  name?: string;

  /** Optional avatar image URL; falls back to the initials bubble. */
  avatarSrc?: string;

  /** Shrink the avatar, indicator, label, and margins. */
  small?: boolean;

  /** Render the "Presenter" label above the name + the indicator dot. */
  presenter?: boolean;

  /** Hide the name; render only the avatar (+ indicator). */
  compact?: boolean;

  /** Localized presenter label. Defaults to "Presenter". */
  presenterLabel?: string;

  /**
   * Keep the avatar's footprint but make it invisible (mirrors WordlyAvatar's
   * `hidden`: occupies space, visibility hidden).
   */
  avatarHidden?: boolean;

  className?: string;
}

/**
 * Participant (presenter or attendee): avatar + optional name/presenter label
 * + optional presenter indicator dot.
 */
export function Participant({
  name = "Bob Belcher", // mock default; in production, fetched from the API
  avatarSrc,
  small = false,
  presenter = false,
  compact = false,
  presenterLabel = "Presenter",
  avatarHidden = false,
  className,
}: ParticipantProps) {
  const trimmed = (name ?? "").trim();
  const formattedName = trimmed === "" ? "Anonymous" : trimmed;
  const initials = React.useMemo(
    () => extractInitials(formattedName),
    [formattedName]
  );

  return (
    <div className={cn("inline-flex w-full items-center", className)}>
      {/* Avatar — shadcn primitive replacing MUI WordlyAvatar. */}
      <Avatar
        aria-label={formattedName}
        className={cn(
          "bg-primary-blue-50 text-primary-blue-700",
          small ? "h-9 w-9 text-xs" : "h-10 w-10 text-sm",
          avatarHidden && "invisible"
        )}
      >
        {avatarSrc ? <AvatarImage src={avatarSrc} alt={formattedName} /> : null}
        <AvatarFallback className="bg-transparent font-medium text-primary-blue-700">
          {initials}
        </AvatarFallback>
      </Avatar>

      {/* Name block — replaces MUI ParticipantName; hidden when compact. */}
      {!compact ? (
        <div className={cn(small ? "ml-2.5" : "ml-4")}>
          {presenter ? (
            <div
              className={cn(
                "-mb-1 leading-none text-gray-500",
                small ? "text-[0.625rem]" : "text-xs"
              )}
            >
              {presenterLabel}
            </div>
          ) : null}
          <div className={cn("text-gray-900", small ? "text-sm" : "text-base")}>
            {formattedName}
          </div>
        </div>
      ) : null}

      {/* Presenter indicator dot — lib success green → accent-green token.
          Sits inline after the name (or after the avatar when compact),
          matching the original styled Indicator margin (15px / 10px compact). */}
      {presenter ? (
        <span
          aria-hidden="true"
          className={cn(
            "block h-3 w-3 shrink-0 rounded-full bg-accent-green-400",
            compact ? "ml-2.5" : "ml-4"
          )}
        />
      ) : null}
    </div>
  );
}

export default Participant;
