"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/**
 * Attendee Highlights — "Prototype C" (one-tap react + highlight UX).
 *
 * Justin authored this exploration as a self-contained HTML document. To make it
 * a valid feature module (the route loads this file's default export as a React
 * component), the prototype is served as a static asset from
 * `public/lab/attendee-highlights/prototype-c.html` and embedded full-screen here.
 *
 * NOTE: This is a temporary bridge so the prototype builds and deploys. The real
 * version should be rebuilt natively in React/TSX, reusing `@/components/ui/*`
 * (see this folder's README and the _template). An iframe doesn't share the
 * design system or feed reusable pieces back into the shared library.
 *
 * `chrome: "standalone"` (see feature.config.ts) renders this with no dashboard
 * shell, so we provide our own "← Portal" link back to /dashboard per the contract.
 */
export default function AttendeeHighlights() {
  return (
    <div className="fixed inset-0 bg-[#f0f4f8]">
      <Link
        href="/dashboard"
        className="absolute left-3 top-3 z-50 inline-flex items-center gap-1.5 rounded-lg border border-[#e3e6e8] bg-white/95 px-3 py-1.5 text-[13px] font-medium text-[#646e78] shadow-sm backdrop-blur transition-colors hover:bg-[#f8f9fa] hover:text-[#121416]"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Portal
      </Link>
      <iframe
        src="/lab/attendee-highlights/prototype-c.html"
        title="Attendee Highlights — Prototype C"
        className="h-full w-full border-0"
      />
    </div>
  );
}
