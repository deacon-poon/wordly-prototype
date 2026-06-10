/**
 * SpeakerListCM
 *
 * Ported from wordly-react-components-lib (MUI 6 + Emotion + CSS Module) to this
 * repo's shadcn/Tailwind foundation. Displays a list of speaker names preceded by
 * a person icon. Renders nothing when the list is empty.
 *
 * Port notes:
 * - MUI `SvgIcon` → lucide-react `Users` icon (same person/speaker semantics).
 * - MUI `Typography variant="body1"` → plain `<span>` with Tailwind text utilities.
 * - Emotion / CSS Module styles folded into Tailwind classes inline.
 * - Theme mapping: icon stroke `WordlyColors.lightnessBlue33` →
 *   `text-primary-blue-600` (Brand Blue stays primary); body text color →
 *   `text-gray-700`.
 *
 * Data arrives via props (small inline mock default below); in production the
 * speaker list would be fetched from the API.
 */

import * as React from "react";
import { Users } from "lucide-react";

import { cn } from "@/lib/utils";

export interface SpeakerListProps {
  /** Speaker display names. Renders nothing when empty. */
  speakers: string[];
  /** Optional extra classes merged onto the root. */
  className?: string;
}

// In production this would be fetched from the API.
const DEFAULT_SPEAKERS = ["Dr. Sarah Chen", "John Smith"];

export function SpeakerListCM({
  speakers = DEFAULT_SPEAKERS,
  className,
}: SpeakerListProps) {
  if (speakers.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Users
        className="h-5 w-5 shrink-0 text-primary-blue-600"
        strokeWidth={1.667}
        aria-hidden="true"
      />
      <span className="text-base font-medium leading-6 text-gray-700">
        {speakers.join(", ")}
      </span>
    </div>
  );
}

export default SpeakerListCM;
