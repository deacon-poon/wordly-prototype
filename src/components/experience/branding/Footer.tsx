/**
 * Footer
 *
 * React/shadcn+Tailwind port of the wordly-react-components-lib MUI 6 + Emotion
 * `Footer` (src/components/library/branding/Footer.tsx). The original styled MUI
 * `Link`/`footer` with hardcoded brand colors and CSS media queries to collapse
 * the row layout.
 *
 * This port replaces all MUI/Emotion with semantic HTML + Tailwind utilities and
 * maps the lib palette to our design tokens:
 *   - lib blue link  (lightnessBlue53) → Brand Blue primary `text-primary-blue-400`
 *   - lib gray text  (lightnessGray43) → `text-gray-600`
 *   - lib white bg                     → `bg-white`
 *
 * Responsive collapse is reproduced with Tailwind's `sm:`/`md:` breakpoints
 * (Tailwind sm = 640px, md = 768px — close to the original 576/768px intent):
 * single row on desktop, two rows on tablet, four rows on mobile. The flex
 * "breakers" (`basis-full`) force wraps at the smaller breakpoints and hide as
 * the viewport grows, exactly like the original `BreakerMobile`/`BreakerTablet`.
 *
 * All content is prop-driven with inline mock defaults; in production the labels
 * and version would come from app config / an API.
 */

import * as React from "react";

import { cn } from "@/lib/utils";

export interface FooterProps {
  /** Label for the Wordly AI Interpretation link. */
  aiInterpretationLabel?: string;
  /** URL for the Wordly AI Interpretation link. */
  aiInterpretationHref?: string;
  /** Label for the Privacy Policy link. */
  privacyPolicyLabel?: string;
  /** URL for the Privacy Policy link. */
  privacyPolicyHref?: string;
  /** Label for the Terms of Service link. */
  termsOfServiceLabel?: string;
  /** URL for the Terms of Service link. */
  termsOfServiceHref?: string;
  /** Company name rendered in the copyright line. */
  companyName?: string;
  /** Optional version string. When omitted, the version segment and its separator are hidden. */
  version?: string;
  /** Optional CSS class name for external styling. */
  className?: string;
}

const getCurrentYear = (): number => new Date().getFullYear();

// Shared link typography (lib `linkBase`): 12px / 18px line-height, hover underline.
const linkBase =
  "text-xs leading-[18px] tracking-[0.03px] no-underline hover:underline";

// Pipe separator typography (lib `Pipe`): 14px / 21px, gray.
const pipeClass = "text-sm leading-[21px] text-gray-600 select-none";

// Meta text (copyright / version) — 12px / 18px, gray.
const metaClass = "text-xs leading-[18px] tracking-[0.03px] text-gray-600";

export function Footer({
  aiInterpretationLabel = "Wordly AI Interpretation",
  aiInterpretationHref = "https://wordly.ai",
  privacyPolicyLabel = "Privacy Policy",
  privacyPolicyHref = "https://wordly.ai/privacy-policy",
  termsOfServiceLabel = "Terms of Service",
  termsOfServiceHref = "https://wordly.ai/wordly-inc-terms-of-service",
  companyName = "Wordly, Inc.",
  version,
  className,
}: FooterProps) {
  return (
    <footer
      className={cn(
        "flex flex-wrap items-center justify-center bg-white p-1 font-sans gap-x-1 gap-y-0.5",
        className
      )}
    >
      <a
        href={aiInterpretationHref}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(linkBase, "text-primary-blue-400")}
      >
        {aiInterpretationLabel}
      </a>

      {/* Pipe shown from tablet up (lib PipeTabletUp). */}
      <span aria-hidden="true" className={cn(pipeClass, "hidden sm:inline")}>
        |
      </span>
      {/* Force a line break on mobile only (lib BreakerMobile). */}
      <span aria-hidden="true" className="h-0 basis-full sm:hidden" />

      <a
        href={privacyPolicyHref}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(linkBase, "text-gray-600")}
      >
        {privacyPolicyLabel}
      </a>

      {/* Always-visible pipe between Privacy and Terms (lib Pipe). */}
      <span aria-hidden="true" className={pipeClass}>
        |
      </span>

      <a
        href={termsOfServiceHref}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(linkBase, "text-gray-600")}
      >
        {termsOfServiceLabel}
      </a>

      {/* Pipe shown from desktop up (lib PipeDesktopUp). */}
      <span aria-hidden="true" className={cn(pipeClass, "hidden md:inline")}>
        |
      </span>
      {/* Force a line break on tablet and below (lib BreakerTablet). */}
      <span aria-hidden="true" className="h-0 basis-full md:hidden" />

      <span className={metaClass}>
        {`Copyright © 2019 - ${getCurrentYear()} ${companyName}`}
      </span>

      {version ? (
        <>
          {/* Pipe shown from tablet up (lib PipeTabletUp). */}
          <span
            aria-hidden="true"
            className={cn(pipeClass, "hidden sm:inline")}
          >
            |
          </span>
          {/* Force a line break on mobile only (lib BreakerMobile). */}
          <span aria-hidden="true" className="h-0 basis-full sm:hidden" />
          <span className={metaClass}>{`Version ${version}`}</span>
        </>
      ) : null}
    </footer>
  );
}

export default Footer;
