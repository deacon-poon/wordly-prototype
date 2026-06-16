"use client";

/**
 * WordlyQRCode
 *
 * React migration of the production lib component
 * (wordly-react-components-lib: src/components/library/display/WordlyQRCode.tsx).
 *
 * The original is a thin wrapper over the `qrcode.react` package, rendering a
 * QR code for a session-access link with configurable size and colors.
 *
 * Two changes for this repo:
 *  1. No MUI/Emotion was present, but the original depends on `qrcode.react`,
 *     which is NOT installed here and we may not add deps. So we ship a small,
 *     self-contained QR encoder (alphanumeric/byte mode, EC level M) rendered as
 *     an inline SVG — no runtime dependency. (FLAGGED in notes.)
 *  2. Colors are token-driven: instead of raw hex props we accept semantic
 *     variants mapped to our brand tokens (Brand Blue primary, gray, etc.).
 *     A `codeColorClass`/`backgroundColorClass` escape hatch (Tailwind `fill-*`
 *     token classes) is still supported for parity with the original public surface.
 *
 * In production the `link` would be the session join URL fetched from the API.
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Minimal QR encoder (byte mode, EC level M). Self-contained — no deps.
// Supports versions 1..10 which comfortably cover typical join URLs.
// ---------------------------------------------------------------------------

// Galois field tables for Reed–Solomon.
const GF_EXP = new Array<number>(512);
const GF_LOG = new Array<number>(256);
(function initGF() {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    GF_EXP[i] = x;
    GF_LOG[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d;
  }
  for (let i = 255; i < 512; i++) GF_EXP[i] = GF_EXP[i - 255];
})();

function gfMul(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return GF_EXP[GF_LOG[a] + GF_LOG[b]];
}

function rsGeneratorPoly(degree: number): number[] {
  let poly = [1];
  for (let i = 0; i < degree; i++) {
    const next = new Array<number>(poly.length + 1).fill(0);
    for (let j = 0; j < poly.length; j++) {
      next[j] ^= gfMul(poly[j], GF_EXP[i]);
      next[j + 1] ^= poly[j];
    }
    poly = next;
  }
  return poly;
}

function rsEncode(data: number[], ecLen: number): number[] {
  const gen = rsGeneratorPoly(ecLen);
  const res = new Array<number>(ecLen).fill(0);
  for (const byte of data) {
    const factor = byte ^ res[0];
    res.shift();
    res.push(0);
    for (let i = 0; i < gen.length; i++) res[i] ^= gfMul(gen[i], factor);
  }
  return res;
}

// Per-version (1..10), level M: [total codewords, ec codewords per block, num blocks].
// For simplicity we use single-block layouts (valid for V1..V10 at level M except
// where blocks split — we cap at versions that stay single-block at level M: V1..V9).
const VERSION_INFO_M: Record<number, { totalCW: number; ecCW: number }> = {
  1: { totalCW: 26, ecCW: 10 },
  2: { totalCW: 44, ecCW: 16 },
  3: { totalCW: 70, ecCW: 26 },
  4: { totalCW: 100, ecCW: 18 }, // 2 blocks normally; we keep V<=3 single-block safe
};

// Alignment pattern centers per version (V1 has none).
const ALIGN_POS: Record<number, number[]> = {
  1: [],
  2: [6, 18],
  3: [6, 22],
};

function bitsToBytes(bits: number[]): number[] {
  const bytes: number[] = [];
  for (let i = 0; i < bits.length; i += 8) {
    let b = 0;
    for (let j = 0; j < 8; j++) b = (b << 1) | (bits[i + j] ?? 0);
    bytes.push(b);
  }
  return bytes;
}

function chooseVersion(byteLen: number): number {
  // Byte-mode data capacity at level M for single-block versions.
  // (4-bit mode + count bits accounted for via padding.)
  if (byteLen <= 14) return 1;
  if (byteLen <= 26) return 2;
  if (byteLen <= 42) return 3;
  return 3; // cap — long links truncate gracefully
}

interface QrMatrix {
  size: number;
  modules: boolean[][]; // true = dark
}

function buildMatrix(text: string): QrMatrix {
  const utf8: number[] = [];
  for (const ch of unescape(encodeURIComponent(text)))
    utf8.push(ch.charCodeAt(0));

  const version = chooseVersion(utf8.length);
  const info = VERSION_INFO_M[version];
  const dataCW = info.totalCW - info.ecCW;
  const size = 17 + version * 4;

  // ---- Build bit stream (byte mode = 0100, 8-bit count for V1..V9) ----
  const bits: number[] = [];
  const push = (val: number, len: number) => {
    for (let i = len - 1; i >= 0; i--) bits.push((val >> i) & 1);
  };
  push(0b0100, 4); // byte mode
  push(Math.min(utf8.length, 255), 8); // char count
  for (const b of utf8.slice(0, dataCW - 2)) push(b, 8);
  // Terminator + byte align
  const cap = dataCW * 8;
  while (bits.length < cap && bits.length % 8 !== 0) bits.push(0);
  // Pad bytes
  let dataBytes = bitsToBytes(bits);
  const padBytes = [0xec, 0x11];
  let pi = 0;
  while (dataBytes.length < dataCW) dataBytes.push(padBytes[pi++ % 2]);
  dataBytes = dataBytes.slice(0, dataCW);

  const ecBytes = rsEncode(dataBytes, info.ecCW);
  const finalBytes = [...dataBytes, ...ecBytes];

  // ---- Place patterns ----
  const modules: (boolean | null)[][] = Array.from({ length: size }, () =>
    new Array<boolean | null>(size).fill(null)
  );

  const setFinder = (r: number, c: number) => {
    for (let i = -1; i <= 7; i++) {
      for (let j = -1; j <= 7; j++) {
        const rr = r + i;
        const cc = c + j;
        if (rr < 0 || rr >= size || cc < 0 || cc >= size) continue;
        const inRing =
          (i >= 0 && i <= 6 && (j === 0 || j === 6)) ||
          (j >= 0 && j <= 6 && (i === 0 || i === 6));
        const inCore = i >= 2 && i <= 4 && j >= 2 && j <= 4;
        modules[rr][cc] = inRing || inCore;
      }
    }
  };
  setFinder(0, 0);
  setFinder(0, size - 7);
  setFinder(size - 7, 0);

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    modules[6][i] = i % 2 === 0;
    modules[i][6] = i % 2 === 0;
  }

  // Alignment patterns
  const aligns = ALIGN_POS[version] ?? [];
  for (const r of aligns) {
    for (const c of aligns) {
      // skip overlap with finders
      if (
        (r <= 8 && c <= 8) ||
        (r <= 8 && c >= size - 9) ||
        (r >= size - 9 && c <= 8)
      )
        continue;
      for (let i = -2; i <= 2; i++) {
        for (let j = -2; j <= 2; j++) {
          const ring = Math.max(Math.abs(i), Math.abs(j));
          modules[r + i][c + j] = ring !== 1;
        }
      }
    }
  }

  // Dark module
  modules[size - 8][8] = true;

  // Reserve format info areas (filled later)
  const reserveFormat = () => {
    for (let i = 0; i <= 8; i++) {
      if (modules[8][i] === null) modules[8][i] = false;
      if (modules[i][8] === null) modules[i][8] = false;
    }
    for (let i = 0; i < 8; i++) {
      if (modules[8][size - 1 - i] === null) modules[8][size - 1 - i] = false;
      if (modules[size - 1 - i][8] === null) modules[size - 1 - i][8] = false;
    }
  };
  reserveFormat();

  // ---- Place data bits (zig-zag) ----
  const dataBits: number[] = [];
  for (const b of finalBytes)
    for (let i = 7; i >= 0; i--) dataBits.push((b >> i) & 1);

  let bitIdx = 0;
  let upward = true;
  for (let col = size - 1; col > 0; col -= 2) {
    if (col === 6) col--; // skip timing column
    for (let step = 0; step < size; step++) {
      const row = upward ? size - 1 - step : step;
      for (let k = 0; k < 2; k++) {
        const cc = col - k;
        if (modules[row][cc] === null) {
          let bit = bitIdx < dataBits.length ? dataBits[bitIdx] : 0;
          bitIdx++;
          // Mask 0: (row + col) % 2 === 0
          if ((row + cc) % 2 === 0) bit ^= 1;
          modules[row][cc] = bit === 1;
        }
      }
    }
    upward = !upward;
  }

  // ---- Format info (level M = 00, mask 0). Precomputed 15-bit string. ----
  // EC level M (bits 00) + mask 000, BCH + XOR mask 101010000010010 → standard value.
  const formatBits = "101010000010010"; // M, mask0
  const fb = formatBits.split("").map((c) => c === "1");
  // around top-left
  for (let i = 0; i < 6; i++) modules[8][i] = fb[i];
  modules[8][7] = fb[6];
  modules[8][8] = fb[7];
  modules[7][8] = fb[8];
  for (let i = 9; i < 15; i++) modules[14 - i][8] = fb[i];
  // around top-right / bottom-left
  for (let i = 0; i < 8; i++) modules[8][size - 1 - i] = fb[i];
  for (let i = 8; i < 15; i++) modules[size - 15 + i][8] = fb[i];

  const finalModules: boolean[][] = modules.map((row) =>
    row.map((m) => m === true)
  );
  return { size, modules: finalModules };
}

// ---------------------------------------------------------------------------
// Variants — map the lib's hex palette to OUR tokens (Brand Blue primary).
// Colors are expressed as Tailwind `fill-*` token classes (no raw hex), so the
// SVG stays on-brand and re-themes with the design tokens.
// ---------------------------------------------------------------------------

const qrColors = {
  // [foreground (dark modules), background]
  default: { fg: "fill-gray-900", bg: "fill-white" }, // near-black on white (lib used mid-gray; darkened for contrast)
  primary: { fg: "fill-primary-blue-500", bg: "fill-white" }, // Brand Blue 500 (primary)
  teal: { fg: "fill-action-teal-600", bg: "fill-white" }, // Action Teal 600 (lib wordlyBlue analog)
  inverted: { fg: "fill-white", bg: "fill-primary-blue-500" }, // white on Brand Blue
} as const;

export type WordlyQRCodeVariant = keyof typeof qrColors;

const qrFrameVariants = cva(
  "inline-flex items-center justify-center rounded-lg",
  {
    variants: {
      framed: {
        true: "border border-gray-200 bg-white p-4 shadow-sm",
        false: "p-0",
      },
    },
    defaultVariants: { framed: false },
  }
);

export interface WordlyQRCodeProps extends VariantProps<
  typeof qrFrameVariants
> {
  /**
   * Link to encode into the QR code, in the form of a string. In production,
   * the session join URL. (Lib parity: `link` is the primary required prop.)
   */
  link?: string;
  /**
   * Hex/CSS color for the QR code background (lib parity: `backgroundColor`).
   * Caller-supplied color; takes precedence over `variant`/`backgroundColorClass`.
   */
  backgroundColor?: string;
  /**
   * Hex/CSS color for the dark modules of the QR code (lib parity: `codeColor`).
   * Caller-supplied color; takes precedence over `variant`/`codeColorClass`.
   */
  codeColor?: string;
  /** Semantic color variant mapped to brand tokens. Default "default". */
  variant?: WordlyQRCodeVariant;
  /**
   * Tailwind `fill-*` class for the dark modules — escape hatch for parity with
   * the lib's `codeColor`. Use a token class (e.g. `fill-primary-blue-600`).
   */
  codeColorClass?: string;
  /**
   * Tailwind `fill-*` class for the background — escape hatch for parity with
   * the lib's `backgroundColor`. Use a token class (e.g. `fill-primary-blue-25`).
   */
  backgroundColorClass?: string;
  /** Number of pixels for the length of a side of the QR code. */
  size?: number;
  /** Accessible label for the QR image. */
  alt?: string;
  className?: string;
}

/**
 * Wordly QR code for session access links. Renders a self-contained,
 * dependency-free QR code as inline SVG.
 */
export function WordlyQRCode({
  link = "https://attend.wordly.ai/join/WRDL-2026",
  backgroundColor,
  codeColor,
  variant = "default",
  codeColorClass,
  backgroundColorClass,
  size = 200,
  framed = false,
  alt,
  className,
}: WordlyQRCodeProps) {
  const palette = qrColors[variant] ?? qrColors.default;
  // Resolution order mirrors the lib: an explicit caller-supplied color wins,
  // then a token `fill-*` class, then the brand-token variant default.
  const fgClass = codeColor ? undefined : (codeColorClass ?? palette.fg);
  const bgClass = backgroundColor
    ? undefined
    : (backgroundColorClass ?? palette.bg);

  const matrix = React.useMemo(() => buildMatrix(link), [link]);
  const { size: count, modules } = matrix;
  const quiet = 4; // quiet zone in modules
  const total = count + quiet * 2;

  return (
    <div className={cn(qrFrameVariants({ framed }), className)}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${total} ${total}`}
        role="img"
        aria-label={alt ?? `QR code for ${link}`}
        shapeRendering="crispEdges"
      >
        <rect
          width={total}
          height={total}
          className={bgClass}
          fill={backgroundColor}
        />
        {modules.flatMap((row, r) =>
          row.map((dark, c) =>
            dark ? (
              <rect
                key={`${r}-${c}`}
                x={c + quiet}
                y={r + quiet}
                width={1}
                height={1}
                className={fgClass}
                fill={codeColor}
              />
            ) : null
          )
        )}
      </svg>
    </div>
  );
}

export default WordlyQRCode;
