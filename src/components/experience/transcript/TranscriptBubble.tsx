"use client";

/**
 * TranscriptBubble
 *
 * Faithful 1:1 port of the production library component
 * `wordly-react-components-lib/src/components/app/meeting/transcript/TranscriptBubble.tsx`
 * (MUI 6 `styled` + Emotion) onto our Tailwind/shadcn stack.
 *
 * A chat-style bubble that holds a line of live transcription (any content is
 * supported). Lib structure reproduced exactly:
 *   - `Container`: flex column, items-end|items-start (alignRight), width fit-content.
 *   - `SpeakerIndicator` (when isNewSpeaker): my-1, 12px/500/18px, flex items-center,
 *     w-full, justify-end|start. Inner `SpeakerIconStyled` span: paddingLeft 8 (ltr)
 *     / paddingRight 8 (rtl), 1rem icon. MUI `KeyboardDoubleArrowRight/Left` →
 *     lucide `ChevronsRight`/`ChevronsLeft`.
 *   - `StyledDiv` (the bubble): background=color, border-radius
 *     `12px 0 12px 12px` (alignRight) else `0 12px 12px 12px`, padding
 *     `0.375rem 0.5em`, position relative, height fit-content, inline-block,
 *     `cursor: pointer` ALWAYS, optional 2px border (showBorder). A `:before`
 *     overlay (rgba(0,0,0,0.1), radius `10px 0 10px 10px`/`0 10px 10px 10px`)
 *     fades in on hover ONLY when showHoverEffect is true.
 *
 * The lib's `color`/`borderColor` hex props are PRESERVED (same names/types) for
 * 1:1 API parity. Per the lab no-raw-hex guardrail their DEFAULTS use our tokens:
 *   - `color`  default → `bg-gray-100` (lib `lightGrayish` #EEF0F2).
 *   - `borderColor` default → `action-teal-500` (lib `wordlyBlue` is the teal
 *     #24C7E6, not the product Brand Blue). A passed hex is applied inline.
 */

import * as React from "react";
import { ChevronsRight, ChevronsLeft } from "lucide-react";

import { cn } from "@/lib/utils";

export interface TranscriptBubbleProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "color" | "onClick"
> {
  /** If true, aligns children to the right and flips the tail corner radius. */
  alignRight?: boolean;

  /**
   * Fill color for the bubble (lib prop, same name/type). Defaults to a token
   * (`gray-100`, the lib's `lightGrayish`); pass a hex to override inline.
   */
  color?: string;

  /**
   * Color of the border when `showBorder` is true (lib prop). Defaults to the
   * `action-teal-500` token (the lib's teal `wordlyBlue`).
   */
  borderColor?: string;

  /** Controls whether to show a border around the bubble. */
  showBorder?: boolean;

  /**
   * If true, applies a darken-on-hover scrim and (the lib always sets the
   * pointer cursor regardless).
   */
  showHoverEffect?: boolean;

  /** Children of this component. This can be anything. */
  children?: React.ReactNode;

  /** Callback function for when the bubble is clicked. */
  onClick?: (e: React.SyntheticEvent) => void;

  /** If true, renders a new-speaker indicator above the bubble. */
  isNewSpeaker?: boolean;

  /** Indicates if the language is right-to-left. */
  rtl?: boolean;
}

/**
 * Wordly bubble component meant to hold a text transcription; any content is
 * supported. The bubble resizes to fit its content.
 */
export const TranscriptBubble: React.FC<TranscriptBubbleProps> = ({
  alignRight,
  color,
  borderColor,
  showBorder,
  showHoverEffect,
  isNewSpeaker = false,
  rtl = false,
  children,
  onClick,
  className,
  style,
  ...otherProps
}) => {
  const SpeakerIcon = rtl ? ChevronsLeft : ChevronsRight;

  // Lib: backgroundColor = color (default lightGrayish token), optional 2px border.
  const bubbleStyle: React.CSSProperties = { ...style };
  if (color) bubbleStyle.backgroundColor = color;
  if (showBorder && borderColor) bubbleStyle.borderColor = borderColor;

  return (
    <div
      className={cn(
        "flex w-fit flex-col",
        alignRight ? "items-end" : "items-start"
      )}
    >
      {isNewSpeaker ? (
        // SpeakerIndicator: my-1, 12px/500/18px, w-full, justify per side.
        <div
          className={cn(
            "my-1 flex w-full items-center text-xs font-medium leading-[18px]",
            alignRight ? "justify-end" : "justify-start"
          )}
        >
          <span
            className={cn(
              // SpeakerIconStyled: 1rem icon, h-4, padding on the inner side.
              "flex h-4 items-center text-base leading-none text-action-teal-500",
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
          // StyledDiv: relative inline-block, fit height, lib padding (6px / 8px),
          // cursor-pointer ALWAYS (matches the lib), tail corner per alignRight.
          "relative inline-block h-fit cursor-pointer justify-end px-2 py-1.5 transition-colors",
          alignRight
            ? "rounded-[12px_0_12px_12px]"
            : "rounded-[0_12px_12px_12px]",
          // Default fill token when no explicit color hex is passed.
          color ? undefined : "bg-gray-100 text-gray-900",
          showBorder &&
            cn("border-2", borderColor ? undefined : "border-action-teal-500"),
          // Lib `:before` overlay: present always; hover opacity gated by showHoverEffect.
          "before:pointer-events-none before:absolute before:inset-0 before:bg-black/10 before:opacity-0 before:transition-all before:duration-200",
          alignRight
            ? "before:rounded-[10px_0_10px_10px]"
            : "before:rounded-[0_10px_10px_10px]",
          showHoverEffect && "hover:before:opacity-100",
          className
        )}
        style={Object.keys(bubbleStyle).length ? bubbleStyle : undefined}
        {...otherProps}
      >
        {children}
      </div>
    </div>
  );
};

export default TranscriptBubble;
