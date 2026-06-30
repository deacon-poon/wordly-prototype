import { useState } from "react";
import { WordlyLogo } from "@/components/experience/branding/WordlyLogo";
import { Icon, VolumeIcon } from "../lib/icons";
import { ICON } from "../lib/reactions-data";
import { haptic } from "../lib/haptics";

/**
 * The translucent live-view header: Wordly logo, language selector (target +
 * original), audio toggle, and an overflow (⋮) menu. The "exit" affordance lives in
 * the overflow menu per the meeting's toolbar-cleanup direction.
 */
export function Header({
  logoHeight = "20px",
  compact = false,
}: {
  logoHeight?: string;
  compact?: boolean;
}) {
  const [audio, setAudio] = useState(false);

  return (
    <div
      style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 20 }}
    >
      {/* fade scrim so streaming text dissolves under the header */}
      <div
        style={{
          position: "absolute",
          inset: "0 0 auto 0",
          height: compact ? 96 : 104,
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          background:
            "linear-gradient(180deg, rgba(255,255,255,.98) 0%, rgba(255,255,255,.9) 46%, rgba(255,255,255,.5) 76%, rgba(255,255,255,0) 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom,#000 0%,#000 56%,transparent 100%)",
          maskImage:
            "linear-gradient(to bottom,#000 0%,#000 56%,transparent 100%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: compact ? "14px 18px" : "15px 22px",
        }}
      >
        <WordlyLogo height={logoHeight} />
        <span style={{ flex: 1 }} />

        {/* Language selector */}
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            flexShrink: 0,
            whiteSpace: "nowrap",
            height: 38,
            padding: "0 11px",
            background: "#fff",
            border: "1px solid var(--border-2)",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 500,
            color: "var(--fg-1)",
            cursor: "pointer",
          }}
        >
          <Icon d={ICON.languages} size={16} color="var(--fg-3)" />
          English (US)
          {!compact ? (
            <span style={{ fontSize: 11, color: "var(--fg-3)" }}>
              Original: Spanish
            </span>
          ) : null}
          <Icon d={ICON.chevron} size={14} color="var(--fg-3)" />
        </span>

        {/* Audio toggle */}
        <button
          onClick={() => {
            haptic("selection");
            setAudio((a) => !a);
          }}
          aria-label={audio ? "Audio on" : "Audio off"}
          title={audio ? "Audio on" : "Audio off"}
          style={{
            width: 38,
            height: 38,
            flexShrink: 0,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: audio ? 999 : 8,
            border: `1px solid ${audio ? "#CDD2D7" : "transparent"}`,
            background: audio ? "#DAFBE4" : "transparent",
            color: audio ? "#121416" : "var(--fg-3)",
            cursor: "pointer",
          }}
        >
          <VolumeIcon
            size={18}
            color={audio ? "#121416" : "var(--fg-3)"}
            off={!audio}
          />
        </button>

        {/* Overflow */}
        <button
          aria-label="More options"
          title="More options"
          style={{
            width: 38,
            height: 38,
            flexShrink: 0,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 8,
            border: "1px solid transparent",
            background: "transparent",
            color: "var(--fg-2)",
            cursor: "pointer",
          }}
        >
          <svg width={18} height={18} viewBox="0 0 24 24" fill="var(--fg-2)">
            <circle cx={12} cy={5} r={1.7} />
            <circle cx={12} cy={12} r={1.7} />
            <circle cx={12} cy={19} r={1.7} />
          </svg>
        </button>
      </div>
    </div>
  );
}
