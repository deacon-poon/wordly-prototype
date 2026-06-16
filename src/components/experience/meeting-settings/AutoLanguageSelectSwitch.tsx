"use client";

/**
 * AutoLanguageSelectSwitch
 *
 * React/shadcn migration of the production MUI `AutoLanguageSelectSwitch`
 * (wordly-react-components-lib: src/components/app/meeting/settings).
 *
 * The original is a styled MUI `Switch` whose anatomy is deliberately
 * non-standard: the thumb is larger than a normal switch, and when the
 * switch is ON the thumb becomes a circular, brand-bordered "AutoAwesome"
 * sparkle marking Automatic Language Selection (ALS). We reproduce that
 * anatomy with a single `role="switch"` button + Tailwind:
 *   - track: full pill, primary (Brand Blue) tint, dimmer when unchecked
 *   - thumb: white circle when OFF; bordered sparkle (Sparkles icon) when ON
 *   - keyboard: Space/Enter toggle (Enter handled to match the original)
 *
 * MUI/Emotion are fully removed. Colors come from our design tokens only:
 *   MUI palette.primary.main  -> `primary` (Brand Blue)
 *   MUI action.disabled*      -> `muted` / opacity
 *   MUI background.accent     -> `primary/10` hover halo
 *   MUI icon (AutoAwesomeIcon)-> lucide `Sparkles`
 *
 * The original exposed deep per-slot color overrides + an `iconWidth` knob
 * via Emotion `styled`. Those map to a single `size` token here (the lab
 * favors token reuse over arbitrary hex), with `iconWidth` kept as an escape
 * hatch for the rare custom-sized case. State is driven via props.
 */

import * as React from "react";
import { Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

export interface AutoLanguageSelectSwitchProps {
  /** Whether ALS is currently on (controlled). */
  value: boolean;
  /**
   * Fired when the switch is toggled. Receives the next boolean value.
   * (The MUI original passed a ChangeEvent; here we pass the value directly,
   * matching this repo's `onCheckedChange` switch convention.)
   */
  onToggleSwitch: (checked: boolean) => void;
  /** Disable the control. */
  disabled?: boolean;
  /**
   * Diameter of the thumb / sparkle icon. Defaults to `1.5rem` to match the
   * MUI original's default `iconWidth`.
   */
  iconWidth?: string;
  /** Accessible label for the switch. */
  ariaLabel: string;
  /** Optional extra classes on the root button. */
  className?: string;
  style?: React.CSSProperties;
}

/**
 * ALS switch. In production this is wired to the meeting's
 * automatic-language-selection setting; here state arrives via props.
 */
export function AutoLanguageSelectSwitch({
  value,
  onToggleSwitch,
  disabled = false,
  iconWidth = "1.5rem",
  ariaLabel,
  className,
  style,
}: AutoLanguageSelectSwitchProps) {
  const handleKeyUp = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (!disabled) onToggleSwitch(!value);
    }
  };

  // Track is twice the thumb wide; height a touch taller so the larger thumb
  // overhangs the track (mirrors the MUI overflow:visible thumb).
  const trackStyle: React.CSSProperties = {
    width: `calc(${iconWidth} * 2)`,
    height: iconWidth,
    ...style,
  };
  const thumbStyle: React.CSSProperties = {
    width: iconWidth,
    height: iconWidth,
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => !disabled && onToggleSwitch(!value)}
      onKeyUp={handleKeyUp}
      style={trackStyle}
      className={cn(
        "group relative inline-flex shrink-0 items-center rounded-full p-0 align-middle outline-none transition-colors duration-300",
        "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        // Track tint: solid primary when on, faded primary when off (MUI used
        // primary for both track states with opacity:0.5 on the unchecked track).
        value ? "bg-primary" : "bg-primary/40",
        disabled ? "cursor-not-allowed bg-muted opacity-50" : "cursor-pointer",
        className
      )}
    >
      {/* Hover/active halo behind the thumb — mirrors the MUI box-shadow ring. */}
      <span
        aria-hidden="true"
        style={thumbStyle}
        className={cn(
          "absolute top-1/2 -translate-y-1/2 rounded-full transition-all duration-200",
          value ? "right-0 translate-x-1" : "left-0 -translate-x-1",
          !disabled &&
            "group-hover:scale-[1.6] group-hover:bg-primary/10 group-active:scale-[2]"
        )}
      />

      {/* Thumb */}
      <span
        aria-hidden="true"
        style={thumbStyle}
        className={cn(
          "relative z-10 flex items-center justify-center rounded-full transition-transform duration-300 ease-in-out",
          value
            ? "translate-x-[calc(100%-0.25rem)] border-2 bg-background"
            : "translate-x-[-0.25rem] bg-white shadow",
          // Border + icon color follow primary, dimming when disabled.
          value && (disabled ? "border-primary/40" : "border-primary")
        )}
      >
        {value ? (
          <Sparkles
            className={cn(
              "h-[80%] w-[80%]",
              disabled ? "text-primary/40" : "text-primary"
            )}
            strokeWidth={2}
            aria-hidden="true"
          />
        ) : null}
      </span>
    </button>
  );
}

export default AutoLanguageSelectSwitch;
