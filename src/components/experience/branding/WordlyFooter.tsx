/**
 * WordlyFooter
 *
 * React migration of the production library `WordlyFooter`
 * (wordly-react-components-lib: src/components/library/branding/WordlyFooter.tsx).
 *
 * The MUI/Emotion original is a static branding footer: a home link, a
 * Privacy Policy | Terms of Service sub-link row, a copyright line, and an
 * optional version line. We drop MUI (Box/Link/Typography + `styled`) and the
 * `sx` prop and rebuild on plain semantic HTML + Tailwind utilities, faithfully
 * mirroring the lib's `styled` rules:
 *   - root `<footer>`  → `color: 'grey'`, centered, 20px top padding
 *   - links (MUI Link) → Brand Blue primary token (`text-primary-blue-400`,
 *     == lib newWordlyBlue #017CFF); main link 0.875rem, sub-links 0.8125rem;
 *     no underline, underline on hover
 *   - copyright/version (MetadataText) → 0.625rem, block; color INHERITS the
 *     root grey (the lib sets no explicit color on these)
 *
 * The public surface is preserved exactly: `version` (optional version line),
 * `translations` (overridable link/label copy), and `ariaLabels` (home-link
 * aria-label). The MUI `sx` prop is replaced by `className`.
 */

import * as React from "react";

import { cn } from "@/lib/utils";

export interface WordlyFooterTranslations {
  footerHomeLink: string;
  privacyPolicy: string;
  termsOfService: string;
  version: string;
}

export interface WordlyFooterAriaLabels {
  footerHomeLink: string;
}

export interface WordlyFooterProps {
  /** Version number to be displayed in the footer. Omit/empty to hide. */
  version?: string;
  /** Overridable link/label copy (defaults to the standard Wordly strings). */
  translations?: Partial<WordlyFooterTranslations>;
  /** Aria labels for the footer links. */
  ariaLabels?: Partial<WordlyFooterAriaLabels>;
  /** Extra classes merged onto the root `<footer>` (replaces the MUI `sx`). */
  className?: string;
}

const DEFAULT_TRANSLATIONS: WordlyFooterTranslations = {
  footerHomeLink: "Wordly AI Interpretation",
  privacyPolicy: "Privacy Policy",
  termsOfService: "Terms of Service",
  version: "Version",
};

/** The current year, used in the copyright notice. */
const getCurrentYear = () => new Date().getFullYear();

const linkClasses =
  "text-primary-blue-400 no-underline transition-colors hover:underline focus-visible:underline focus-visible:outline-none";

/**
 * Standard Wordly branding footer: home link, Privacy Policy / Terms of
 * Service sub-links, copyright, and an optional version line.
 */
export function WordlyFooter({
  version,
  translations,
  ariaLabels,
  className,
}: WordlyFooterProps) {
  const t = { ...DEFAULT_TRANSLATIONS, ...translations };

  return (
    <footer className={cn("pt-5 text-center text-gray-500", className)}>
      <span className="block">
        <a
          href="https://wordly.ai"
          target="_blank"
          rel="noreferrer"
          aria-label={ariaLabels?.footerHomeLink ?? ""}
          tabIndex={0}
          className={cn(linkClasses, "text-sm")}
        >
          {t.footerHomeLink}
        </a>
      </span>

      <span className="block">
        <a
          href="https://wordly.ai/privacy-policy"
          target="_blank"
          rel="noreferrer"
          tabIndex={0}
          className={cn(linkClasses, "text-[0.8125rem]")}
        >
          {t.privacyPolicy}
        </a>
        <span> | </span>
        <a
          href="https://wordly.ai/wordly-inc-terms-of-service"
          target="_blank"
          rel="noreferrer"
          tabIndex={0}
          className={cn(linkClasses, "text-[0.8125rem]")}
        >
          {t.termsOfService}
        </a>
      </span>

      <span className="block text-[0.625rem]">
        Copyright © 2019-{getCurrentYear()} Wordly, Inc.
      </span>

      {version ? (
        <span className="block text-[0.625rem]">
          {t.version} {version}
        </span>
      ) : null}
    </footer>
  );
}

export default WordlyFooter;
