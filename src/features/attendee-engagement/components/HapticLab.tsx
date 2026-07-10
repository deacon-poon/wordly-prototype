"use client";

import { useEffect, useRef, useState } from "react";
import { hapticTrigger, pulseIOSHaptic } from "../lib/haptics";
import styles from "../engagement.module.css";

/**
 * Haptic Lab — ?haptic=lab
 *
 * iOS Safari has NO supported programmatic haptic API: the Taptic Engine fires
 * only for real user activation of a native `<input type="checkbox" switch>`.
 * Every "workaround" (programmatic label/input .click()) is a loophole Apple
 * keeps tightening, and behavior differs by iOS version. This page turns the
 * guessing into a 1-minute device test: each row exercises ONE mechanism and
 * logs whether it toggled — the tester reports which rows actually BUZZ.
 *
 * A: real tap on an overlay switch (the mechanism behind tap-to-save; baseline)
 * B: label.click() inside a tap handler (user-activated programmatic)
 * C: input.click() inside a tap handler
 * D: label.click() from a 450ms timer while the finger is still down
 *    (the mid-gesture long-press case this item is about)
 * E: input.click() from pointerup after a ≥450ms hold (release, direct)
 * F: label.click() from pointerup after a ≥450ms hold (current production path)
 */

function useSwitch(): [
  React.MutableRefObject<HTMLInputElement | null>,
  () => void,
] {
  const ref = useRef<HTMLInputElement | null>(null);
  const make = () => {
    if (ref.current || typeof document === "undefined") return;
    const input = document.createElement("input");
    input.type = "checkbox";
    input.setAttribute("switch", "");
    input.tabIndex = -1;
    input.setAttribute("aria-hidden", "true");
    input.style.cssText =
      "position:fixed;bottom:0;right:0;width:1px;height:1px;opacity:0;pointer-events:none;";
    document.body.appendChild(input);
    ref.current = input;
  };
  return [ref, make];
}

export default function HapticLab() {
  const [log, setLog] = useState<Record<string, number>>({});
  const bump = (k: string) => setLog((p) => ({ ...p, [k]: (p[k] ?? 0) + 1 }));

  // Dedicated switches for C and E (direct input.click()).
  const [switchC, makeC] = useSwitch();
  const [switchE, makeE] = useSwitch();
  useEffect(() => {
    makeC();
    makeE();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const heldLongEnough = useRef(false);

  const row: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "4px 0",
  };
  const btn: React.CSSProperties = {
    flexShrink: 0,
    width: 190,
    minHeight: 56,
    padding: "8px 10px",
    borderRadius: 12,
    border: "1px solid var(--border-2)",
    background: "#fff",
    fontSize: 13,
    fontWeight: 700,
    color: "var(--fg-1)",
    cursor: "pointer",
    WebkitUserSelect: "none",
    userSelect: "none",
    touchAction: "none",
  };
  const count = (k: string) => (
    <span
      style={{
        fontSize: 12.5,
        color: log[k] ? "var(--accent-green-700)" : "var(--fg-4)",
        fontWeight: 600,
      }}
    >
      {log[k] ? `toggled ×${log[k]}` : "not fired yet"}
    </span>
  );

  return (
    <div
      className={styles.root}
      style={{
        position: "fixed",
        inset: 0,
        overflowY: "auto",
        background: "#F0F7FF",
        padding: "20px 16px 40px",
        fontFamily: "var(--font-sans)",
      }}
    >
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <h1 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 4px" }}>
          Haptic Lab
        </h1>
        <p style={{ fontSize: 13, color: "var(--fg-3)", margin: "0 0 16px" }}>
          On your iPhone, work each row and note which ones you actually FEEL.
          Every row logs when its mechanism toggles — a row that toggles but
          doesn&apos;t buzz means iOS blocked the haptic, not the code.
        </p>

        {/* A — baseline: real tap on an overlay switch. Host is a DIV (like the
            real transcript bubble) — an input nested in a <button> is invalid
            interactive content and never receives the tap. */}
        <div style={row}>
          <div
            role="button"
            tabIndex={0}
            ref={(el) => {
              hapticTrigger(el);
              // Log the overlay input's toggles.
              const input = el?.querySelector("input[switch]");
              if (input && !(input as HTMLElement).dataset.labLogged) {
                (input as HTMLElement).dataset.labLogged = "1";
                input.addEventListener("change", () => bump("A"));
              }
            }}
            // touch-action must allow the tap→click synthesis (the real bubble
            // uses pan-y); `none` here would keep the switch from ever toggling.
            style={{ ...btn, touchAction: "manipulation" }}
          >
            A · Tap me
            <br />
            <span style={{ fontWeight: 400 }}>real tap on overlay switch</span>
          </div>
          {count("A")}
        </div>

        {/* B — programmatic label.click() inside the tap handler */}
        <div style={row}>
          <button
            style={btn}
            onClick={() => {
              pulseIOSHaptic();
              bump("B");
            }}
          >
            B · Tap me
            <br />
            <span style={{ fontWeight: 400 }}>label.click() in handler</span>
          </button>
          {count("B")}
        </div>

        {/* C — programmatic input.click() inside the tap handler */}
        <div style={row}>
          <button
            style={btn}
            onClick={() => {
              switchC.current?.click();
              bump("C");
            }}
          >
            C · Tap me
            <br />
            <span style={{ fontWeight: 400 }}>input.click() in handler</span>
          </button>
          {count("C")}
        </div>

        {/* D — the actual mid-gesture case: timer fires while finger is down */}
        <div style={row}>
          <button
            style={btn}
            onPointerDown={() => {
              heldLongEnough.current = false;
              holdTimer.current = setTimeout(() => {
                heldLongEnough.current = true;
                pulseIOSHaptic();
                bump("D");
              }, 450);
            }}
            onPointerUp={() => {
              if (holdTimer.current) clearTimeout(holdTimer.current);
            }}
            onPointerCancel={() => {
              if (holdTimer.current) clearTimeout(holdTimer.current);
            }}
          >
            D · Hold me (450ms)
            <br />
            <span style={{ fontWeight: 400 }}>
              timer label.click() mid-press
            </span>
          </button>
          {count("D")}
        </div>

        {/* E — release after hold, direct input.click() */}
        <div style={row}>
          <button
            style={btn}
            onPointerDown={() => {
              heldLongEnough.current = false;
              holdTimer.current = setTimeout(() => {
                heldLongEnough.current = true;
              }, 450);
            }}
            onPointerUp={() => {
              if (holdTimer.current) clearTimeout(holdTimer.current);
              if (heldLongEnough.current) {
                switchE.current?.click();
                bump("E");
              }
            }}
          >
            E · Hold ≥450ms, release
            <br />
            <span style={{ fontWeight: 400 }}>input.click() on release</span>
          </button>
          {count("E")}
        </div>

        {/* F — release after hold, label.click() (current production path) */}
        <div style={row}>
          <button
            style={btn}
            onPointerDown={() => {
              heldLongEnough.current = false;
              holdTimer.current = setTimeout(() => {
                heldLongEnough.current = true;
              }, 450);
            }}
            onPointerUp={() => {
              if (holdTimer.current) clearTimeout(holdTimer.current);
              if (heldLongEnough.current) {
                pulseIOSHaptic();
                bump("F");
              }
            }}
          >
            F · Hold ≥450ms, release
            <br />
            <span style={{ fontWeight: 400 }}>
              label.click() on release (current)
            </span>
          </button>
          {count("F")}
        </div>

        <p style={{ fontSize: 12.5, color: "var(--fg-3)", marginTop: 18 }}>
          Report back: which letters buzzed, your iOS version, and whether
          Settings → Sounds &amp; Haptics → System Haptics is on. Expected: A
          always buzzes (it&apos;s the tap-to-save mechanism). If only A buzzes,
          iOS blocks every programmatic path and the mid-gesture haptic is a
          platform limitation we document and close.
        </p>
      </div>
    </div>
  );
}
