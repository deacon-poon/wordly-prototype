import { useCallback } from "react";

/**
 * Web haptics for the prototype.
 *
 * iOS Safari never shipped `navigator.vibrate`. The reliable workaround (tijnjh's
 * ios-haptics v3 / haptics.lochie.me) is to overlay the *real* interactive element
 * with an invisible `<input type="checkbox" switch>`: the user's actual tap toggles
 * the switch, which fires the Taptic Engine. The click still bubbles to the element's
 * own handler, so behaviour is unchanged. (Programmatically `.click()`ing an
 * off-screen switch — the older trick — does not reliably fire, hence the overlay.)
 *
 * Android / other browsers fall back to `navigator.vibrate`. Desktop is a no-op.
 */

/**
 * Inject the invisible haptic switch as an overlay on `el` (idempotent). Verbatim
 * port of ios-haptics v3's `hapticTrigger`, with two safe additions: we only force
 * `position:relative` when the element is statically positioned (so absolutely-placed
 * controls like the chip / jump button aren't displaced), and the input is hidden
 * from the a11y tree.
 */
export function hapticTrigger(el: HTMLElement | null) {
  if (typeof document === "undefined" || !el) return;
  if (el.dataset.hapticOverlay) return;
  el.dataset.hapticOverlay = "1";

  const input = document.createElement("input");
  input.type = "checkbox";
  input.setAttribute("switch", "");
  input.setAttribute("aria-hidden", "true");
  input.tabIndex = -1;
  Object.assign(input.style, {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    margin: "0",
    opacity: "0",
    cursor: "pointer",
    clipPath: "inset(0 round 999px)",
    touchAction: "manipulation",
  });
  input.style.setProperty("-webkit-tap-highlight-color", "transparent");

  if (getComputedStyle(el).position === "static")
    el.style.position = "relative";
  el.insertAdjacentElement("beforeend", input);
}

/**
 * Ref callback that arms an element for iOS haptics on tap. Reusable across many
 * elements (e.g. inside a .map) — injection is idempotent per element.
 *   <button ref={useHapticRef()} onClick={…}>…</button>
 */
export function useHapticRef<T extends HTMLElement = HTMLElement>() {
  return useCallback((el: T | null) => hapticTrigger(el), []);
}

export type HapticKind =
  | "light"
  | "medium"
  | "heavy"
  | "selection"
  | "success"
  | "warning"
  | "error";

const PRESETS: Record<HapticKind, number | number[]> = {
  selection: 4,
  light: 8,
  medium: 16,
  heavy: 30,
  success: [12, 60, 24],
  warning: [20, 50, 20],
  error: [28, 40, 28, 40, 28],
};

/**
 * Android / fallback haptic via `navigator.vibrate` (no-op on iOS Safari + desktop).
 * iOS feedback comes from the `hapticTrigger` overlay on the tapped element. Call this
 * for interactions that can't carry an overlay (e.g. the draggable sheet handle, or
 * programmatic state changes) so Android still buzzes.
 */
export function haptic(kind: HapticKind | number | number[] = "light") {
  const pat = typeof kind === "string" ? PRESETS[kind] : kind;
  if (
    typeof navigator !== "undefined" &&
    typeof navigator.vibrate === "function"
  ) {
    try {
      navigator.vibrate(pat);
    } catch {
      /* no-op */
    }
  }
}

// ── Programmatic pulse (for moments NOT tied to a tap, e.g. the reaction rail opening
// on a long-press) ───────────────────────────────────────────────────────────────────
// The overlay technique only fires on a real tap, so for a mid-gesture haptic we use
// the label-click trick (haptics.lochie.me): a hidden, on-screen <label> bound to an
// <input switch> — clicking the *label* programmatically fires the iOS Taptic Engine.
// Kept on-screen (1px, opacity 0) rather than off-screen, which iOS honours more reliably.
let pulseLabel: HTMLLabelElement | null = null;
function ensurePulse(): HTMLLabelElement | null {
  if (typeof document === "undefined") return null;
  if (pulseLabel) return pulseLabel;
  const input = document.createElement("input");
  input.type = "checkbox";
  input.setAttribute("switch", "");
  input.id = "wEngPulseSwitch";
  input.tabIndex = -1;
  input.setAttribute("aria-hidden", "true");
  const label = document.createElement("label");
  label.htmlFor = "wEngPulseSwitch";
  label.setAttribute("aria-hidden", "true");
  label.style.cssText =
    "position:fixed;bottom:0;right:0;width:1px;height:1px;opacity:0;overflow:hidden;pointer-events:none;";
  label.appendChild(input);
  document.body.appendChild(label);
  pulseLabel = label;
  return label;
}

/** A subtle programmatic haptic — iOS Taptic via the label-click trick + a short
 *  Android vibrate. Use for the reaction rail opening on long-press / swipe. */
export function pulseHaptic(kind: HapticKind = "light") {
  try {
    ensurePulse()?.click();
  } catch {
    /* no-op */
  }
  haptic(kind);
}

/**
 * iOS-only Taptic pulse (no Android vibrate). Safari gates the label-click trick on
 * user activation, so a long-press TIMER can't fire it — call this from the real
 * pointerup instead: the long-press haptic lands on RELEASE (rail already showing),
 * while Android already buzzed at rail-display via the timer.
 */
export function pulseIOSHaptic() {
  try {
    ensurePulse()?.click();
  } catch {
    /* no-op */
  }
}
