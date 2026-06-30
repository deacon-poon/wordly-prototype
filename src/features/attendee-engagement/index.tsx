"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import EngagementApp from "./EngagementApp";
import { COACH_META, type CoachVariant } from "./components/Coach";
import { haptic, useHapticRef } from "./lib/haptics";

/**
 * Attendee Engagement — native React port of the Claude Design "Current version" board.
 *
 * The same responsive experience (live transcript + My Highlights + reactions) adapts
 * across phone / tablet / desktop. The four first-run coaching treatments (B1–B4) each
 * get their own shareable URL via `?v=`:
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
  const router = useRouter();
  const pathname = usePathname();
  const hapticRef = useHapticRef();

  const raw = (params.get("v") || "b1").toLowerCase();
  const coach: CoachVariant = (VARIANTS as string[]).includes(raw)
    ? (raw as CoachVariant)
    : "b1";

  const select = (v: CoachVariant) => {
    haptic("selection");
    router.replace(`${pathname}?v=${v}`, { scroll: false });
  };

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

      {/* Variant switcher — prototype comparison control (each option is its own URL) */}
      <div className="absolute right-3 top-3 z-[60] flex items-center gap-0.5 rounded-lg border border-[#e3e6e8] bg-white/95 p-0.5 shadow-sm backdrop-blur">
        {VARIANTS.map((v) => (
          <button
            key={v}
            ref={hapticRef}
            onClick={() => select(v)}
            title={COACH_META[v].title}
            className={`rounded-md px-2.5 py-1 text-[12px] font-semibold transition-colors ${
              coach === v
                ? "bg-[#0063cc] text-white"
                : "text-[#646e78] hover:bg-[#eef0f2] hover:text-[#121416]"
            }`}
          >
            {COACH_META[v].badge}
          </button>
        ))}
      </div>
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
