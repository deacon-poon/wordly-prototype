"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import EngagementApp from "./EngagementApp";
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

  return (
    <div className="fixed inset-0 bg-[#f0f4f8]">
      <EngagementApp coach={coach} />

      {/* Portal link */}
      <Link
        href="/dashboard"
        className="absolute left-3 top-3 z-[60] inline-flex items-center gap-1.5 rounded-lg border border-[#e3e6e8] bg-white/95 px-3 py-1.5 text-[13px] font-medium text-[#646e78] shadow-sm backdrop-blur transition-colors hover:bg-[#f8f9fa] hover:text-[#121416]"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Portal
      </Link>
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
