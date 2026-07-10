"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import EngagementApp from "./EngagementApp";
import HapticLab from "./components/HapticLab";
import type { CoachVariant } from "./components/Coach";

/**
 * Attendee Engagement — native React port of the Claude Design "Current version" board.
 *
 * The same responsive experience (live transcript + My Highlights + reactions) adapts
 * across phone / tablet / desktop. The four first-run coaching treatments (B1–B4) each
 * have their own shareable URL via `?v=`; switch between them from Spotlight (⌘K), not
 * an on-screen control:
 *   /lab/attendee-engagement?v=b1   (coached-in-panel — default)
 *   /lab/attendee-engagement?v=b2   (dismissible pill)
 *   /lab/attendee-engagement?v=b3   (first-run spotlight)
 *   /lab/attendee-engagement?v=b4   (persistent hint banner)
 *
 * `chrome: "standalone"` (feature.config.ts) renders this full-screen with no portal
 * shell, so we provide our own "← Portal" link back to /dashboard.
 */
const VARIANTS: CoachVariant[] = ["b1", "b2", "b3", "b4"];

function EngagementRoute() {
  const params = useSearchParams();
  const raw = (params.get("v") || "b1").toLowerCase();
  const coach: CoachVariant = (VARIANTS as string[]).includes(raw)
    ? (raw as CoachVariant)
    : "b1";
  // ?demo=end → start on the final transcript line so the end-of-session flow
  // (Session complete sheet) can be demoed in seconds instead of ~8 minutes.
  const demoEnd = (params.get("demo") || "").toLowerCase() === "end";
  // ?lang=ar|he → RTL captions + mirrored transcript/rail (chrome stays LTR).
  const langParam = (params.get("lang") || "").toLowerCase();
  const initialLang =
    langParam === "ar" ? "Arabic" : langParam === "he" ? "Hebrew" : undefined;
  // ?code=XXXX-0000[&key=passcode] → LIVE session via the real /attend feed
  // (wss://endpoint.wordly.ai/attend) instead of the scripted demo.
  const code = (params.get("code") || "").trim().toUpperCase();
  // ?env=dev|staging|preview targets that environment's endpoint server
  // (wss://<env>-timely.wordly.ai/attend, per wordly_portal environment configs) —
  // use it when the session was created in the dev/staging portal. Default: prod.
  const env = (params.get("env") || "").toLowerCase();
  const endpoint = ["dev", "staging", "preview"].includes(env)
    ? `wss://${env}-timely.wordly.ai/attend`
    : undefined;
  const live = code
    ? { code, accessKey: params.get("key") || undefined, endpoint }
    : undefined;

  // ?haptic=lab → the iOS haptic test matrix (tracker item: mid-gesture Taptic).
  if ((params.get("haptic") || "").toLowerCase() === "lab") {
    return <HapticLab />;
  }

  return (
    <div className="fixed inset-0 bg-[#f0f4f8]">
      <EngagementApp
        coach={coach}
        demoEnd={demoEnd}
        initialLang={initialLang}
        live={live}
      />
    </div>
  );
}

export default function Feature() {
  return (
    <Suspense fallback={<div className="fixed inset-0 bg-[#f0f4f8]" />}>
      <EngagementRoute />
    </Suspense>
  );
}
