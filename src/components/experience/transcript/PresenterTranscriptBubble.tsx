"use client";

/**
 * PresenterTranscriptBubble
 *
 * Faithful 1:1 port of the production library component
 * `wordly-react-components-lib/src/components/app/meeting/transcript/PresenterTranscriptBubble.tsx`
 * (MUI 6 + Emotion `styled`) onto our Tailwind/shadcn stack.
 *
 * Composition model reproduced exactly: the lib takes a `<TranscriptText>` (and
 * optional `<TranscriptMetadata>`) via `children`, pulls each out with a
 * `getComponentByType` helper, renders the text inside a `TranscriptBubble`, and
 * toggles the metadata row at the bottom of the bubble on click. The earlier
 * prototype port had switched to a flat `text`/`name`/`language` prop API — this
 * version restores the lib's children-composition contract (no external
 * consumers import this component, so the API change breaks nothing).
 *
 * Lib structure:
 *   - Root: inline-block, fit-content, max-w-full, text-align per alignRight.
 *   - AlignedContainer: flex column, items per alignRight, w-full.
 *   - MicName (when isNewMicName): 0.75rem / 500 / 1.125rem line, Roboto, padding
 *     12px on the leading side, text-align per side, inline-block, my-1.
 *   - Bubble wrapper: mx 5px.
 *   - TranscriptBubble (showHoverEffect, onClick=toggle, rtl, isNewSpeaker) holds
 *     `{text}` and, when expanded, a MetadataContainer:
 *       mt 6px, pt 4px, w-full, flex, justify per side, items-center, Roboto,
 *       0.85rem, padding 0 1px → wrapping the `<TranscriptMetadata>` child.
 *
 * Theme: the lib's `color`/`borderColor` hex props are PRESERVED for parity and
 * forwarded to TranscriptBubble; their defaults resolve to our tokens there
 * (`gray-100` fill / `action-teal-500` border for the teal `wordlyBlue`).
 */

import * as React from "react";

import { cn } from "@/lib/utils";
import { TranscriptBubble } from "./TranscriptBubble";
import { TranscriptText } from "./TranscriptText";
import {
  TranscriptMetadata,
  type TranscriptMetadataProps,
} from "./TranscriptMetadata";

export interface PresenterTranscriptBubbleProps {
  /** Class name for styling the root container. */
  className?: string;
  /** If true, aligns all components to the right of the bubble. */
  alignRight?: boolean;
  /** Color of the transcript bubble (forwarded to TranscriptBubble). */
  color?: string;
  /** Color of the border when showBorder is true. */
  borderColor?: string;
  /** Controls whether to show a border around the transcript bubble. */
  showBorder?: boolean;
  /** Callback function for when the bubble is clicked. */
  onClick?: (e: React.SyntheticEvent) => void;
  /** Name of the speaker to display above the bubble. */
  micName: string;
  /** Language of the transcript (shown in the TranscriptMetadata child). */
  language: string;
  /** Indicates if the language is right-to-left. */
  rtl?: boolean;
  /** If true, indicates the micName changed and should be shown above the bubble. */
  isNewMicName?: boolean;
  /** If true, renders a new-speaker indicator above the bubble. */
  isNewSpeaker?: boolean;
  /**
   * Child components. A `TranscriptText` is required; a `TranscriptMetadata` is
   * optional and is shown at the bottom of the bubble when it is clicked.
   */
  children: React.ReactNode;
}

/**
 * Finds the first child element of a given component type — a faithful inline
 * copy of the lib's `src/util/getComponentByType` helper.
 */
function getComponentByType(
  componentsList: React.ReactNode,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- accepts any React component type
  type: any
) {
  return React.Children.toArray(componentsList).find(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- React child elements need any to access .type
    (el: any) => el.type === type
  );
}

/**
 * Validates children in development: a `TranscriptText` child is required.
 * Mirrors the lib's `validateChildren`.
 */
function validateChildren(children: React.ReactNode) {
  if (
    typeof process === "undefined" ||
    process?.env?.NODE_ENV === "production"
  ) {
    return;
  }
  if (children === null) {
    throw new Error("No required children were provided. Validation failed.");
  }
  const text = getComponentByType(children, TranscriptText);
  if (text == null) {
    throw new Error(
      "Children passed to PresenterTranscriptBubble are invalid. TranscriptText is a required child component."
    );
  }
}

/**
 * Shows a presenter's transcription: the mic name, the transcribed text, and
 * (toggled by clicking the bubble) the speaker/language metadata at the bottom.
 */
export const PresenterTranscriptBubble: React.FC<
  PresenterTranscriptBubbleProps
> = ({
  className = "",
  alignRight,
  color,
  borderColor,
  showBorder = false,
  micName,
  language,
  rtl = false,
  isNewMicName = false,
  isNewSpeaker = false,
  children,
  onClick,
  ...otherProps
}) => {
  validateChildren(children);

  const metadata = getComponentByType(
    children,
    TranscriptMetadata
  ) as React.ReactElement<TranscriptMetadataProps> | null;
  const text = getComponentByType(children, TranscriptText);

  const [showMetadataAtBottom, setShowMetadataAtBottom] = React.useState(false);

  const handleClick = (e: React.SyntheticEvent) => {
    setShowMetadataAtBottom((prev) => !prev);
    onClick?.(e);
  };

  const shouldShowSpeakerIndicator = isNewSpeaker;

  return (
    // Root: inline-block, fit-content, max-w-full, text-align per side.
    <div
      className={cn(
        "inline-block w-fit max-w-full",
        alignRight ? "text-right" : "text-left",
        className
      )}
      {...otherProps}
    >
      {/* AlignedContainer */}
      <div
        className={cn(
          "flex w-full flex-col",
          alignRight ? "items-end" : "items-start"
        )}
      >
        {/* MicName */}
        {isNewMicName ? (
          <div
            className={cn(
              "my-1 inline-block w-auto box-border text-xs font-medium leading-[1.125rem]",
              alignRight ? "pr-3 text-right" : "pl-3 text-left"
            )}
          >
            {micName}
          </div>
        ) : null}

        {/* Bubble wrapper: mx 5px */}
        <div className="mx-[5px]">
          <TranscriptBubble
            alignRight={alignRight}
            color={color}
            borderColor={borderColor}
            showBorder={showBorder}
            onClick={handleClick}
            showHoverEffect
            rtl={rtl}
            isNewSpeaker={shouldShowSpeakerIndicator}
          >
            {text}
            {showMetadataAtBottom && metadata ? (
              // MetadataContainer
              <div
                className={cn(
                  "mt-1.5 flex w-full items-center px-px pt-1 text-[0.85rem]",
                  alignRight ? "justify-end" : "justify-start"
                )}
              >
                {metadata}
              </div>
            ) : null}
          </TranscriptBubble>
        </div>
      </div>
    </div>
  );
};

export default PresenterTranscriptBubble;
