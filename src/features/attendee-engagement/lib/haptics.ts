/**
 * Web haptics — gives the prototype real tactile feedback on phones.
 *
 * iOS Safari never shipped `navigator.vibrate`, so this uses the now-well-known trick
 * (Lochie Axon's web-haptics, https://haptics.lochie.me): an invisible
 * `<input type="checkbox" switch>` + `<label>` — programmatically `.click()`ing the
 * *label* makes Safari fire the Taptic Engine. (Clicking the input directly does not
 * work.) On Android / elsewhere we fall back to `navigator.vibrate`. On desktop it's a
 * harmless no-op.
 */

let labelEl: HTMLLabelElement | null = null;

function ensureSwitch(): HTMLLabelElement | null {
  if (typeof document === "undefined") return null;
  if (labelEl) return labelEl;
  const input = document.createElement("input");
  input.type = "checkbox";
  input.setAttribute("switch", ""); // the iOS-haptic-emitting attribute
  input.id = "wEngHapticSwitch";
  input.tabIndex = -1;
  input.setAttribute("aria-hidden", "true");
  const label = document.createElement("label");
  label.htmlFor = "wEngHapticSwitch";
  label.setAttribute("aria-hidden", "true");
  label.style.cssText =
    "position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;opacity:0;pointer-events:none;";
  label.appendChild(input);
  document.body.appendChild(label);
  labelEl = label;
  return label;
}

function tap() {
  try {
    ensureSwitch()?.click();
  } catch {
    /* no-op */
  }
}

export type HapticKind =
  | "light"
  | "medium"
  | "heavy"
  | "selection"
  | "success"
  | "warning"
  | "error";

// Vibration patterns (ms). For iOS, each non-gap segment becomes one Taptic tap.
const PRESETS: Record<HapticKind, number | number[]> = {
  selection: 4,
  light: 8,
  medium: 16,
  heavy: 30,
  success: [12, 60, 24],
  warning: [20, 50, 20],
  error: [28, 40, 28, 40, 28],
};

/** Fire a haptic. `kind` is a preset name (default "light") or a raw vibrate pattern. */
export function haptic(kind: HapticKind | number | number[] = "light") {
  const pat = typeof kind === "string" ? PRESETS[kind] : kind;

  // iOS Taptic Engine — one tap per pulse; space extra taps by the gap values.
  tap();
  if (Array.isArray(pat) && pat.length > 1) {
    let delay = 0;
    for (let i = 2; i < pat.length; i += 2) {
      delay += pat[i - 1];
      setTimeout(tap, delay);
    }
  }

  // Android / fallback.
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
