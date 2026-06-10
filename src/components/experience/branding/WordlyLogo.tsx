/**
 * WordlyLogo
 *
 * React/shadcn migration of the production `WordlyLogo` from
 * wordly-react-components-lib (src/components/library/branding/WordlyLogo.tsx).
 *
 * The original was MUI-themed only via a single imported color constant
 * (`WordlyColors.newWordlyBlue`) used as the SVG fill default — there was no
 * Emotion/styled markup to fold in. This port drops that hard-coded value and
 * instead drives the logo color through Tailwind tokens:
 *
 *   - default fill is `currentColor`, with the wrapping `<svg>` carrying the
 *     brand token class `text-primary-blue-400` (the Brand Blue primary token,
 *     an exact match for the lib's newWordlyBlue).
 *   - callers can recolor with Tailwind utilities via `className`
 *     (e.g. `text-primary-blue-600`, `text-white`) — the idiomatic shadcn way.
 *   - a raw `color` prop is preserved for API parity with the original; when
 *     set it overrides the token on the `fill`.
 *
 * Accessibility behavior matches the original: `label` (default "Wordly")
 * exposes the SVG to assistive tech with `role="img"`; `label=""` marks it
 * decorative via `aria-hidden`.
 *
 * No data is fetched — this is a static brand asset (no API source).
 */

import * as React from "react";

import { cn } from "@/lib/utils";

export interface WordlyLogoProps {
  /** Height of the logo. Default is "30px". */
  height?: string | number;
  /**
   * SVG viewBox (min-x, min-y, width, height). Default "0 0 344 103" matches
   * the source artwork bounds.
   */
  viewBox?: string;
  /**
   * Optional explicit fill color (API parity with the lib original). Prefer a
   * Tailwind text-* token via `className` instead of a raw value. When set,
   * this wins over the token color.
   */
  color?: string;
  /**
   * Accessible name. Defaults to "Wordly" (renders `role="img"` + label).
   * Pass `label=""` to mark the logo purely decorative (`aria-hidden`) —
   * useful when adjacent visible text already names it.
   */
  label?: string;
  /**
   * Extra classes on the `<svg>`. Use brand text tokens to recolor, e.g.
   * `text-primary-blue-600`, `text-white`. Defaults to `text-primary-blue-400`.
   */
  className?: string;
}

export function WordlyLogo({
  height = "30px",
  viewBox = "0 0 344 103",
  color,
  label = "Wordly",
  className,
}: WordlyLogoProps) {
  const decorative = label === "";
  // currentColor inherits from the svg's text-* token unless an explicit
  // `color` is supplied for parity with the original API.
  const fill = color ?? "currentColor";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={height}
      viewBox={viewBox}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative ? true : undefined}
      className={cn("text-primary-blue-400", className)}
    >
      <g>
        <path
          d="M111.799 16.044L115.707 1.16055H108.879C98.2628 1.16055 88.9673 8.33555 86.2734 18.6046L77.7914 51.0388L65.3885 1.14722H50.0249L37.6887 50.8387L29.2468 18.6046C26.5662 8.33555 17.2707 1.16055 6.65488 1.16055H0L3.90757 16.044H6.65488C10.5091 16.044 13.8832 18.6446 14.8568 22.3788L27.9531 72.6971H45.2372L57.7201 24.686L70.2029 72.6971H87.487L100.677 22.3788C101.65 18.6579 105.024 16.044 108.879 16.044H111.799Z"
          fill={fill}
        />
        <path
          d="M167.252 43.6633V72.6834H182.135V43.6633C182.135 38.3954 186.43 34.1011 191.698 34.1011H198.446L202.34 19.2177H191.698C178.214 19.2177 167.252 30.1802 167.252 43.6633Z"
          fill={fill}
        />
        <path
          d="M146.795 22.6579C142.567 20.284 137.859 19.1104 132.685 19.1104C127.51 19.1104 122.776 20.2974 118.522 22.6579C114.267 25.0318 110.867 28.2592 108.346 32.3535C105.812 36.4478 104.558 41.1555 104.558 46.4634C104.558 51.7713 105.825 56.3991 108.346 60.5334C110.88 64.6676 114.267 67.9084 118.522 70.2823C122.776 72.6562 127.497 73.8298 132.685 73.8298C137.873 73.8298 142.581 72.6428 146.795 70.2823C151.023 67.9084 154.397 64.6676 156.931 60.5334C159.464 56.3991 160.718 51.718 160.718 46.4634C160.718 41.2089 159.451 36.4478 156.931 32.3535C154.397 28.2592 151.023 25.0184 146.795 22.6579ZM144.154 53.9585C143.034 56.1323 141.5 57.8261 139.54 59.053C137.593 60.2666 135.299 60.8801 132.672 60.8801C130.044 60.8801 127.737 60.2666 125.763 59.053C123.776 57.8394 122.229 56.1457 121.109 53.9585C119.989 51.7847 119.429 49.2907 119.429 46.4634C119.429 43.6361 119.989 41.1689 121.109 39.0217C122.229 36.8745 123.776 35.1808 125.763 33.9272C127.75 32.6736 130.044 32.0601 132.672 32.0601C135.299 32.0601 137.579 32.6869 139.54 33.9272C141.487 35.1808 143.034 36.8745 144.154 39.0217C145.275 41.1689 145.835 43.6494 145.835 46.4634C145.835 49.2774 145.275 51.7847 144.154 53.9585Z"
          fill={fill}
        />
        <path
          d="M244.563 24.7261C243.189 23.3524 241.589 22.1788 239.708 21.272C236.734 19.8316 233.32 19.1115 229.479 19.1115C224.491 19.1115 219.97 20.3251 215.943 22.7656C211.915 25.1929 208.714 28.4736 206.341 32.6079C203.967 36.7422 202.793 41.3566 202.793 46.4778C202.793 51.599 203.967 56.1467 206.301 60.3077C208.634 64.4687 211.822 67.7627 215.849 70.2033C219.877 72.6305 224.465 73.8575 229.586 73.8575C233.173 73.8575 236.494 73.204 239.575 71.8837C241.936 70.8701 243.923 69.4831 245.523 67.7361V72.7106H258.966V0.000366211H244.563V24.7261ZM242.869 53.9595C241.749 56.1334 240.202 57.8271 238.215 59.0541C236.228 60.2677 233.92 60.8812 231.306 60.8812C228.692 60.8812 226.332 60.2677 224.251 59.0541C222.171 57.8404 220.557 56.1467 219.397 53.9595C218.25 51.7857 217.663 49.2918 217.663 46.4645C217.663 43.6372 218.237 41.1699 219.397 39.0228C220.544 36.8756 222.171 35.1819 224.251 33.9282C226.332 32.6746 228.679 32.0611 231.306 32.0611C233.934 32.0611 236.241 32.6746 238.215 33.8882C240.202 35.1018 241.749 36.7956 242.869 38.9827C243.989 41.1566 244.549 43.6505 244.549 46.4778C244.549 49.3051 243.989 51.799 242.869 53.9729V53.9595Z"
          fill={fill}
        />
        <path
          d="M281.87 0.000366211H267.466V72.6839H281.87V0.000366211Z"
          fill={fill}
        />
        <path
          d="M343.898 20.2572H328.441L318.292 47.8903C317.465 49.7707 316.678 51.6645 315.905 53.5716L303.675 20.2572H288.218L308.783 72.4293C307.223 76.6836 305.356 81.138 303.062 83.4719C296.9 91.3804 282.244 90.9669 281.923 79.3242H267.587C267.32 90.3268 275.789 100.396 286.565 102.356C301.941 105.65 315.691 94.4211 320.306 80.5512L343.898 20.2572Z"
          fill={fill}
        />
      </g>
    </svg>
  );
}

export default WordlyLogo;
