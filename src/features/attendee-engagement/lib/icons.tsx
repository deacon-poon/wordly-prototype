import type { CSSProperties } from "react";

/** Single-path stroke icon (24×24 viewBox), matching the design source's `Icon`. */
export function Icon({
  d,
  size = 16,
  color = "currentColor",
  sw = 1.9,
  fill = "none",
  style,
}: {
  d: string;
  size?: number;
  color?: string;
  sw?: number;
  fill?: "none" | string;
  style?: CSSProperties;
}) {
  const filled = fill !== "none";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? color : "none"}
      style={style}
    >
      <path
        d={d}
        stroke={filled ? "none" : color}
        fill={filled ? color : "none"}
        strokeWidth={sw}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Header audio toggle. `off` adds the red strikethrough line. */
export function VolumeIcon({
  size = 16,
  color = "currentColor",
  off = false,
}: {
  size?: number;
  color?: string;
  off?: boolean;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 23 23" fill="none">
      <path
        d="M15 7.8C15.65 8.68 16 9.73 16 10.81C16 11.9 15.65 12.95 15 13.81M18.36 17.18C19.2 16.34 19.86 15.35 20.31 14.26C20.77 13.17 21 11.99 21 10.81C21 9.63 20.77 8.46 20.31 7.37C19.86 6.28 19.2 5.29 18.36 4.45M10 3.52C10 3.38 9.96 3.24 9.88 3.12C9.8 3.01 9.69 2.92 9.56 2.87C9.44 2.81 9.29 2.8 9.16 2.83C9.02 2.85 8.9 2.92 8.8 3.02L5.41 6.4C5.28 6.53 5.13 6.64 4.96 6.71C4.78 6.78 4.6 6.81 4.42 6.81H2C1.73 6.81 1.48 6.92 1.29 7.11C1.11 7.29 1 7.55 1 7.81V13.81C1 14.08 1.11 14.33 1.29 14.52C1.48 14.71 1.73 14.81 2 14.81H4.42C4.6 14.81 4.78 14.85 4.96 14.92C5.13 14.99 5.28 15.1 5.41 15.23L8.8 18.61C8.89 18.71 9.02 18.78 9.16 18.8C9.29 18.83 9.44 18.82 9.56 18.76C9.69 18.71 9.8 18.62 9.88 18.5C9.96 18.39 10 18.25 10 18.11V3.52Z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {off ? (
        <line
          x1={1.07}
          y1={20.63}
          x2={20.69}
          y2={1}
          stroke="#FF0000"
          strokeWidth={2}
          strokeLinecap="round"
        />
      ) : null}
    </svg>
  );
}
