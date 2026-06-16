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
 * - Colors mapped to OUR tokens: lib `.blueLink` → Brand Blue primary
 *   (`text-primary-blue-400`, == lib newWordlyBlue #017CFF); lib `.grayLink`/
 *   `.metaText`/`.pipe` gray (lightnessGray43 #646E78) → `text-gray-500`.
 *   No raw hex.
 * - Responsive separators reproduced with Tailwind arbitrary breakpoints that
 *   match the lib's exact media queries: pipes show at `min-[576px]:` /
 *   `min-[768px]:`, full-width breakers (`basis-full`) force wraps below those
 *   breakpoints (lib `.breakerMobile` 576px / `.breakerTablet` 768px).
 *
 * Pure presentational component (no state/effects), so no "use client".
 * Data arrives via props with inline mock defaults; in production the labels
 * and hrefs would be fetched from config / API.
 */

import * as React from "react";

import { cn } from "@/lib/utils";
import type { FooterProps } from "./Footer";

/**
 * FooterCM shares Footer's prop surface. The lib types this as
 * `Omit<FooterProps, 'sx'>`; our `Footer` never had an `sx` prop (it was
 * dropped during the MUI→Tailwind port), so `FooterCMProps` is simply
 * `FooterProps`. Kept as a re-derived alias to mirror the lib's relationship
 * and stay in sync if `FooterProps` changes.
 */
export type FooterCMProps = FooterProps;

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
        className={cn(linkBase, "text-primary-blue-400")}
        href={aiInterpretationHref}
        target="_blank"
        rel="noopener noreferrer"
      >
        {aiInterpretationLabel}
      </a>

      {/* pipe visible from tablet up (576px); breaker forces a wrap on mobile */}
      <span
        className="hidden font-sans text-sm leading-[21px] text-gray-500 min-[576px]:inline"
        aria-hidden="true"
      >
        |
      </span>
      <span className="h-0 basis-full min-[576px]:hidden" aria-hidden="true" />

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

      {/* pipe visible from desktop up (768px); breaker forces a wrap on tablet */}
      <span
        className="hidden font-sans text-sm leading-[21px] text-gray-500 min-[768px]:inline"
        aria-hidden="true"
      >
        |
      </span>
      <span className="h-0 basis-full min-[768px]:hidden" aria-hidden="true" />

      <span className="font-sans text-xs leading-[18px] tracking-[0.03px] text-gray-500">
        {`Copyright © 2019 - ${getCurrentYear()} ${companyName}`}
      </span>

      {version && (
        <>
          <span
            className="hidden font-sans text-sm leading-[21px] text-gray-500 min-[576px]:inline"
            aria-hidden="true"
          >
            |
          </span>
          <span
            className="h-0 basis-full min-[576px]:hidden"
            aria-hidden="true"
          />
          <span className="font-sans text-xs leading-[18px] tracking-[0.03px] text-gray-500">
            {`Version ${version}`}
          </span>
        </>
      )}
    </footer>
  );
}

export default FooterCM;
