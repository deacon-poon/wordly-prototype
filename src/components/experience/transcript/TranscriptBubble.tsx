"use client";

/**
 * TranscriptBubble
 *
 * React/shadcn migration of the production library component
 * `wordly-react-components-lib/src/components/app/meeting/transcript/TranscriptBubble.tsx`
 * (originally MUI 6 `styled()` + Emotion).
 *
 * A chat-style bubble that holds a line of live transcription (though any
 * content is supported). The bubble hugs its content, supports left/right
 * alignment (with the asymmetric "tail" corner), an optional border, an
 * optional hover highlight, and an optional new-speaker indicator with a
 * directional double-arrow.
 *
 * Port notes:
 * - The MUI version exposed raw hex `color` / `borderColor` props. Per the lab
 *   guardrail (no raw hex — token classes only), those are replaced with a
 *   token-backed `tone` variant. The two real product usages map cleanly:
 *     - "another presenter" bubble (lightGrayish) → tone="muted" (gray-100)
 *     - "your speech" bubble (wordlyBlue) → tone="primary" (Brand Blue)
 *   The library's overlay/tail geometry (radius 12px, 0.375rem/0.5em padding,
 *   the 10%-black hover scrim) is reproduced with Tailwind utilities.
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronsRight, ChevronsLeft } from "lucide-react";

import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Tone variants — token-backed replacement for the lib's raw `color` prop.
// Brand Blue stays the primary tone (matches the "your speech" bubble).
// ---------------------------------------------------------------------------

const bubbleVariants = cva(
  // Base: inline block that hugs content, library padding (6px / 0.5em),
  // relative so the hover scrim can absolutely fill it.
  "relative inline-block h-fit px-2 py-1.5 transition-colors",
  {
    variants: {
      tone: {
        muted: "bg-gray-100 text-gray-900",
        primary: "bg-primary text-primary-foreground",
        success: "bg-accent-green-50 text-accent-green-900",
        teal: "bg-action-teal-50 text-action-teal-900",
      },
      alignRight: {
        // Tail on the top-right for the local speaker, top-left otherwise.
        true: "rounded-[12px_0_12px_12px]",
        false: "rounded-[0_12px_12px_12px]",
      },
    },
    defaultVariants: {
      tone: "muted",
      alignRight: false,
    },
  }
);

export type TranscriptBubbleTone = NonNullable<
  VariantProps<typeof bubbleVariants>["tone"]
>;

export interface TranscriptBubbleProps {
  /** Aligns the bubble (and its speaker indicator) to the right and flips the tail corner. */
  alignRight?: boolean;

  /**
   * Token-backed fill tone. Replaces the library's raw `color` hex prop.
   * `muted` = another presenter, `primary` = your own speech (Brand Blue).
   */
  tone?: TranscriptBubbleTone;

  /** Draw a Brand Blue border around the bubble. */
  showBorder?: boolean;

  /**
   * Apply a subtle darken-on-hover scrim and a pointer cursor (the library's
   * `:hover:before` 10%-black overlay).
   */
  showHoverEffect?: boolean;

  /** Render a new-speaker indicator (directional double-arrow) above the bubble. */
  isNewSpeaker?: boolean;

  /** Right-to-left language: flips the speaker arrow direction and padding side. */
  rtl?: boolean;

  /** Bubble content (typically transcript text). */
  children?: React.ReactNode;

  /** Click handler for the bubble. */
  onClick?: (e: React.SyntheticEvent) => void;

  className?: string;
}

export function TranscriptBubble({
  alignRight = false,
  tone = "muted",
  showBorder = false,
  showHoverEffect = false,
  isNewSpeaker = false,
  rtl = false,
  children,
  onClick,
  className,
}: TranscriptBubbleProps) {
  const SpeakerIcon = rtl ? ChevronsLeft : ChevronsRight;

  return (
    <div
      className={cn(
        "flex w-fit flex-col",
        alignRight ? "items-end" : "items-start"
      )}
    >
      {isNewSpeaker ? (
        <div
          className={cn(
            "my-1 flex w-full items-center text-xs font-medium leading-[18px]",
            alignRight ? "justify-end" : "justify-start"
          )}
        >
          <span
            className={cn(
              "flex h-4 items-center leading-none text-primary",
              alignRight ? "pr-2" : "pl-2"
            )}
          >
            <SpeakerIcon className="size-4" aria-hidden="true" />
          </span>
        </div>
      ) : null}

      <div
        onClick={onClick}
        className={cn(
          bubbleVariants({ tone, alignRight }),
          showBorder && "border-2 border-primary",
          (showHoverEffect || onClick) && "cursor-pointer",
          // Hover scrim: the library's `:before` 10%-black overlay that fades in.
          showHoverEffect &&
            "before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-black/10 before:opacity-0 before:transition-opacity before:duration-200 hover:before:opacity-100",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}

export default TranscriptBubble;
