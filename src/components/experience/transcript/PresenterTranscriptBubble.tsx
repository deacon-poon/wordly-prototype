"use client";

/**
 * PresenterTranscriptBubble
 *
 * React/shadcn migration of the production `PresenterTranscriptBubble` from
 * wordly-react-components-lib (MUI 6 + Emotion `styled`). It renders a single
 * presenter's transcription as a chat-style bubble: an optional mic-name label,
 * an optional "new speaker" indicator (double-arrow), the bubble body holding
 * the transcribed text, and — toggled by clicking the bubble — a metadata row
 * (speaker name + language) at the bottom.
 *
 * Port notes:
 * - All Material UI and Emotion styled-component usage is removed. The original
 *   styled divs (Root, AlignedContainer,
 *   MicName, Bubble, StyledDiv hover `:before`, SpeakerIndicator) are folded
 *   into Tailwind utility classes. The MUI `KeyboardDoubleArrowRight/Left`
 *   icons become lucide-react `ChevronsRight`/`ChevronsLeft`.
 * - The original composed `TranscriptText` + `TranscriptMetadata` via
 *   `children` + a runtime `getComponentByType` validator. For a self-contained
 *   prototype component we take the transcript via the `text` prop and the
 *   metadata via `name`/`language` props (in production these arrive from the
 *   live transcription stream / API).
 * - Theme mapping (lib palette → our tokens): the lib's `wordlyBlue` (a teal)
 *   maps to `action-teal-*`; the neutral bubble fill `lightGrayish`
 *   maps to `gray-100`; metadata grays map to `gray-*` / `muted-foreground`.
 *   Brand Blue remains the product primary (not used as the bubble fill here).
 */

import * as React from "react";
import { ChevronsRight, ChevronsLeft } from "lucide-react";

import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Bubble fill variants — replaces the MUI `color` hex prop with token classes.
// The lib defaulted to `lightGrayish` (neutral) with an optional `wordlyBlue`
// (teal) border. We expose semantic variants instead of raw hex.
// ---------------------------------------------------------------------------

export type TranscriptBubbleVariant = "neutral" | "teal" | "green";

const bubbleFill: Record<TranscriptBubbleVariant, string> = {
  neutral: "bg-gray-100 text-gray-900",
  teal: "bg-action-teal-50 text-action-teal-900",
  green: "bg-accent-green-50 text-accent-green-900",
};

const bubbleBorder: Record<TranscriptBubbleVariant, string> = {
  neutral: "border-action-teal-500",
  teal: "border-action-teal-500",
  green: "border-accent-green-500",
};

// ---------------------------------------------------------------------------
// Data contract (mirrors the lib props; metadata folded in from children).
// In production, `text`, `name`, and `language` arrive from the live
// transcription stream / API.
// ---------------------------------------------------------------------------

export interface PresenterTranscriptBubbleProps {
  /** The transcribed text shown inside the bubble. */
  text: React.ReactNode;
  /** Speaker / mic name. Shown as the label above the bubble and in metadata. */
  micName?: string;
  /** Language label shown (italic) in the metadata row. */
  language?: string;

  /** Align the whole bubble (and its corner radius) to the right. */
  alignRight?: boolean;
  /** Render the transcript text right-to-left. */
  rtl?: boolean;

  /** Bubble fill/border color. Defaults to the neutral gray fill. */
  variant?: TranscriptBubbleVariant;
  /** Draw a colored border around the bubble (lib `showBorder`). */
  showBorder?: boolean;

  /** Show the mic-name label above the bubble (lib `isNewMicName`). */
  isNewMicName?: boolean;
  /** Show the new-speaker indicator (double-arrow) above the bubble. */
  isNewSpeaker?: boolean;

  /**
   * Whether the metadata row starts expanded. The bubble is also click-to-
   * toggle (uncontrolled) like the original.
   */
  defaultMetadataOpen?: boolean;

  /** Forwarded click handler (fires in addition to the metadata toggle). */
  onClick?: (e: React.SyntheticEvent) => void;

  className?: string;
}

export function PresenterTranscriptBubble({
  text,
  micName,
  language,
  alignRight = false,
  rtl = false,
  variant = "neutral",
  showBorder = false,
  isNewMicName = false,
  isNewSpeaker = false,
  defaultMetadataOpen = false,
  onClick,
  className,
}: PresenterTranscriptBubbleProps) {
  const [showMetadata, setShowMetadata] = React.useState(defaultMetadataOpen);

  const handleClick = (e: React.SyntheticEvent) => {
    setShowMetadata((prev) => !prev);
    onClick?.(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick(e);
    }
  };

  const SpeakerIcon = rtl ? ChevronsLeft : ChevronsRight;
  const displayName = micName || "";

  return (
    // Root: inline-block, fit-content width, text alignment per side (lib Root).
    <div
      className={cn(
        "inline-block w-fit max-w-full",
        alignRight ? "text-right" : "text-left",
        className
      )}
    >
      {/* AlignedContainer: column stack, items aligned per side. */}
      <div
        className={cn(
          "flex w-full flex-col",
          alignRight ? "items-end" : "items-start"
        )}
      >
        {/* MicName label (lib MicName: 0.75rem, medium, side padding). */}
        {isNewMicName && displayName ? (
          <div
            className={cn(
              "my-1 inline-block box-border w-auto text-xs font-medium leading-[1.125rem] text-gray-700",
              alignRight ? "pr-3 text-right" : "pl-3 text-left"
            )}
          >
            {displayName}
          </div>
        ) : null}

        {/* Bubble wrapper (lib Bubble: 5px horizontal margin). */}
        <div className="mx-[5px]">
          <div
            className={cn(
              "flex w-fit flex-col",
              alignRight ? "items-end" : "items-start"
            )}
          >
            {/* New-speaker indicator (lib SpeakerIndicator + icon). */}
            {isNewSpeaker ? (
              <div
                className={cn(
                  "my-1 flex w-full items-center",
                  alignRight ? "justify-end" : "justify-start"
                )}
                aria-hidden="true"
              >
                <span
                  className={cn(
                    "flex h-4 items-center leading-none text-action-teal-500",
                    alignRight ? "pr-2" : "pl-2"
                  )}
                >
                  <SpeakerIcon className="size-4" />
                </span>
              </div>
            ) : null}

            {/* The bubble itself (lib StyledDiv). Group enables the hover
                overlay that the original drew with a `:before` pseudo-element. */}
            <div
              role="button"
              tabIndex={0}
              aria-expanded={showMetadata}
              onClick={handleClick}
              onKeyDown={handleKeyDown}
              className={cn(
                "group relative inline-block h-fit cursor-pointer px-2 py-1.5 outline-none transition-colors",
                "focus-visible:ring-2 focus-visible:ring-action-teal-500 focus-visible:ring-offset-1",
                bubbleFill[variant],
                // Corner radius: tail on the top-left, unless aligned right
                // (then the tail is top-right) — matches the lib radii.
                alignRight
                  ? "rounded-[12px_0_12px_12px]"
                  : "rounded-[0_12px_12px_12px]",
                showBorder && cn("border-2", bubbleBorder[variant])
              )}
            >
              {/* Hover overlay (lib `:before` rgba(0,0,0,0.1)). */}
              <span
                aria-hidden="true"
                className={cn(
                  "pointer-events-none absolute inset-0 bg-black/10 opacity-0 transition-opacity duration-200 group-hover:opacity-100",
                  alignRight
                    ? "rounded-[10px_0_10px_10px]"
                    : "rounded-[0_10px_10px_10px]"
                )}
              />

              {/* Transcript text (lib TranscriptText). */}
              <div
                dir={rtl ? "rtl" : "ltr"}
                className={cn(
                  "relative h-auto w-full text-base",
                  rtl ? "text-right" : "text-left"
                )}
              >
                {text}
              </div>

              {/* Metadata row, toggled on click (lib MetadataContainer +
                  TranscriptMetadata: name + italic language). */}
              {showMetadata && (displayName || language) ? (
                <div
                  className={cn(
                    "relative mt-1.5 flex w-full items-center gap-2 px-px pt-1 text-xs",
                    alignRight ? "justify-end" : "justify-start"
                  )}
                >
                  {displayName ? (
                    <span className="max-w-full truncate text-gray-900">
                      {displayName}
                    </span>
                  ) : null}
                  {language ? (
                    <span className="truncate italic text-gray-500">
                      {language}
                    </span>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PresenterTranscriptBubble;
