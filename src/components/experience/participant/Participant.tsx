"use client";

/**
 * Participant
 *
 * Faithful 1:1 port of the production wordly-react-components-lib component
 * `src/components/app/dialogs/participant/Participant.tsx` (MUI 6 + Emotion),
 * rebuilt on our Tailwind / shadcn stack.
 *
 * Lib structure (mirrored exactly):
 *   <Root display:inline-flex; align-items:center; width:100%>
 *     {renderParticipantName(...)}   // <Name> wrapper → <ParticipantName/>, hidden when compact
 *     {presenter && <Indicator/>}    // 12x12 circle
 *
 * NOTE: the lib `Participant` does NOT render an avatar — it composes only the
 * name block + the presenter indicator dot. (The avatar lives in the separate
 * `WordlyAvatar` component.) This rebuild matches that.
 *
 * Color mapping (lib raw hex → our design tokens; no raw hex):
 *   indicatorColor default '#52fa6e' (green) → bg-accent-green-400 token
 *   labelColor      default '#8F8F8F' (gray) → text-gray-500 (via ParticipantName)
 * Both props remain overridable; callers pass a Tailwind class to stay on tokens.
 */

import * as React from "react";

import { cn } from "@/lib/utils";
import { ParticipantName } from "./ParticipantName";

export interface ParticipantProps {
  /** The name of the participant. */
  name: string;

  /** If true, this will shrink the presenter indicator circle and margins. */
  small?: boolean;

  /** If true, display the presenter indicator circle. */
  presenter?: boolean;

  /** If true, this will not render the ParticipantName component. */
  compact?: boolean;

  /**
   * Color of the presenter indicator circle. Lib accepted a hex string; here it
   * accepts a Tailwind background class (token-based). Defaults to the accent
   * green token (lib default '#52fa6e').
   */
  indicatorColor?: string;

  /**
   * Color of the presenter label. Lib accepted a hex string; here it accepts a
   * Tailwind text-color class. Defaults to neutral gray (lib default '#8F8F8F').
   */
  labelColor?: string;

  className?: string;
}

/**
 * Helper that renders the name of the participant if compact=false.
 * Mirrors the lib `renderParticipantName` + `<Name>` styled wrapper.
 *
 * @returns Participant's name block, or null when compact.
 */
function renderParticipantName(
  name: string,
  presenter?: boolean,
  labelColor?: string,
  small: boolean = false,
  compact: boolean = false
): JSX.Element | null {
  if (!compact) {
    return (
      // <Name>: display inherit (not compact), marginLeft 10px small / 15px.
      <div className={cn(small ? "ml-2.5" : "ml-[15px]")}>
        <ParticipantName
          name={name}
          small={small}
          presenter={presenter}
          labelColor={labelColor}
        />
      </div>
    );
  }
  return null;
}

/**
 * React component for the participant (presenter or attendee).
 */
export function Participant({
  name,
  small = false,
  presenter = false,
  compact = false,
  indicatorColor = "bg-accent-green-400",
  labelColor,
  className,
}: ParticipantProps) {
  return (
    // <Root>: inline-flex, items-center, full width.
    <div className={cn("inline-flex w-full items-center", className)}>
      {renderParticipantName(name, presenter, labelColor, small, compact)}
      {presenter ? (
        // <Indicator>: 12x12 circle, marginLeft 10px compact / 15px otherwise.
        <span
          aria-hidden="true"
          className={cn(
            "block h-3 w-3 shrink-0 rounded-full",
            indicatorColor,
            compact ? "ml-2.5" : "ml-[15px]"
          )}
        />
      ) : null}
    </div>
  );
}

export default Participant;
