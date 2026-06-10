/**
 * FooterCM
 *
 * React/shadcn migration of the production wordly-react-components-lib
 * `FooterCM` (branding/FooterCM.tsx). The original was a CSS-Module variant
 * of the Emotion `Footer`: a responsive row of legal/brand links plus a
 * copyright + optional version line, with pipe separators that collapse into
 * line breaks at narrow widths.
 *
 * Port notes:
 * - MUI `<Link>` → plain semantic `<a>` styled with Tailwind.
 * - `Footer.module.css` folded into inline Tailwind utilities.
 * - Colors mapped to OUR tokens: lib blueLink → Brand Blue primary
 *   (`text-primary`); lib gray (lightnessGray43) → `text-gray-500`.
 *   No raw hex.
 * - Responsive separators reproduced with Tailwind: pipes show at `sm:`/`md:`,
 *   full-width breakers (`basis-full`) force wraps below those breakpoints.
 *
 * Pure presentational component (no state/effects), so no "use client".
 * Data arrives via props with inline mock defaults; in production the labels
 * and hrefs would be fetched from config / API.
 */

import * as React from "react";

import { cn } from "@/lib/utils";

export interface FooterCMProps {
  aiInterpretationLabel?: string;
  aiInterpretationHref?: string;
  privacyPolicyLabel?: string;
  privacyPolicyHref?: string;
  termsOfServiceLabel?: string;
  termsOfServiceHref?: string;
  companyName?: string;
  /** Optional build/version string; when present, renders a "Version X" segment. */
  version?: string;
  className?: string;
}

const getCurrentYear = (): number => new Date().getFullYear();

const linkBase =
  "font-sans text-xs leading-[18px] tracking-[0.03px] no-underline hover:underline";

export function FooterCM({
  aiInterpretationLabel = "Wordly AI Interpretation",
  aiInterpretationHref = "https://wordly.ai",
  privacyPolicyLabel = "Privacy Policy",
  privacyPolicyHref = "https://wordly.ai/privacy-policy",
  termsOfServiceLabel = "Terms of Service",
  termsOfServiceHref = "https://wordly.ai/wordly-inc-terms-of-service",
  companyName = "Wordly, Inc.",
  version,
  className,
}: FooterCMProps) {
  return (
    <footer
      className={cn(
        "flex flex-wrap items-center justify-center gap-x-1 gap-y-0.5 bg-white p-1",
        className
      )}
    >
      <a
        className={cn(linkBase, "text-primary")}
        href={aiInterpretationHref}
        target="_blank"
        rel="noopener noreferrer"
      >
        {aiInterpretationLabel}
      </a>

      {/* pipe visible from tablet up; breaker forces a wrap on mobile */}
      <span
        className="hidden font-sans text-sm leading-[21px] text-gray-500 sm:inline"
        aria-hidden="true"
      >
        |
      </span>
      <span className="h-0 basis-full sm:hidden" aria-hidden="true" />

      <a
        className={cn(linkBase, "text-gray-500")}
        href={privacyPolicyHref}
        target="_blank"
        rel="noopener noreferrer"
      >
        {privacyPolicyLabel}
      </a>

      {/* always-visible pipe between the two legal links */}
      <span
        className="font-sans text-sm leading-[21px] text-gray-500"
        aria-hidden="true"
      >
        |
      </span>

      <a
        className={cn(linkBase, "text-gray-500")}
        href={termsOfServiceHref}
        target="_blank"
        rel="noopener noreferrer"
      >
        {termsOfServiceLabel}
      </a>

      {/* pipe visible from desktop up; breaker forces a wrap on tablet */}
      <span
        className="hidden font-sans text-sm leading-[21px] text-gray-500 md:inline"
        aria-hidden="true"
      >
        |
      </span>
      <span className="h-0 basis-full md:hidden" aria-hidden="true" />

      <span className="font-sans text-xs leading-[18px] tracking-[0.03px] text-gray-500">
        {`Copyright © 2019 - ${getCurrentYear()} ${companyName}`}
      </span>

      {version && (
        <>
          <span
            className="hidden font-sans text-sm leading-[21px] text-gray-500 sm:inline"
            aria-hidden="true"
          >
            |
          </span>
          <span className="h-0 basis-full sm:hidden" aria-hidden="true" />
          <span className="font-sans text-xs leading-[18px] tracking-[0.03px] text-gray-500">
            {`Version ${version}`}
          </span>
        </>
      )}
    </footer>
  );
}

export default FooterCM;
