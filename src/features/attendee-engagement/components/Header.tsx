import { useState } from "react";
import { WordlyLogo } from "@/components/experience/branding/WordlyLogo";
import { Icon, VolumeIcon } from "../lib/icons";
import { ICON } from "../lib/reactions-data";
import { haptic, useHapticRef } from "../lib/haptics";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { LANGS } from "../data/languages";
import { HelpSheet } from "./HelpSheet";
import { SettingsSheet, type EngagementSettings } from "./SettingsSheet";
import styles from "../engagement.module.css";

/**
 * The translucent live-view header: Wordly logo, language selector (target +
 * original), audio toggle, and an overflow (⋮) menu. The language selector opens a
 * language picker; the overflow menu opens Help / Settings / Leave Session. Help and
 * Settings render as full-screen sheets (phone) / dialogs (wide).
 */
export function Header({
  logoHeight = "20px",
  compact = false,
}: {
  logoHeight?: string;
  compact?: boolean;
}) {
  const [audio, setAudio] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [lang, setLang] = useState("English (US)");
  const [settings, setSettings] = useState<EngagementSettings>({
    onlyFinal: false,
    ttsSameLang: false,
  });
  const hapticRef = useHapticRef();

  const menuItem = (
    icon: string,
    label: string,
    onClick: () => void,
    color = "var(--fg-1)"
  ) => (
    <button
      onClick={onClick}
      className={styles.menuRow}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 11,
        width: "100%",
        padding: "9px 10px",
        border: "none",
        background: "transparent",
        borderRadius: 7,
        cursor: "pointer",
        fontSize: 13.5,
        fontWeight: color === "var(--fg-1)" ? 500 : 600,
        color,
        textAlign: "left",
      }}
    >
      <Icon
        d={icon}
        size={18}
        color={color === "var(--fg-1)" ? "var(--fg-2)" : color}
      />
      {label}
    </button>
  );

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

      {/* click-away layer for the open overflow menu */}
      {menuOpen ? (
        <div
          onClick={() => setMenuOpen(false)}
          style={{ position: "fixed", inset: 0, zIndex: 19 }}
        />
      ) : null}

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

        {/* Language selector — ShadCN Select (DS component). */}
        <Select
          value={lang}
          onValueChange={(v) => {
            haptic("selection");
            setLang(v);
          }}
        >
          <SelectTrigger
            aria-label="Change language"
            className="h-11 w-auto shrink-0 gap-2 rounded-lg bg-white text-sm font-medium"
          >
            <Icon d={ICON.languages} size={16} color="var(--fg-3)" />
            {lang}
          </SelectTrigger>
          <SelectContent className="max-h-[340px] min-w-[248px]">
            {LANGS.map((L) => (
              <SelectItem
                key={L[0]}
                value={L[0]}
                className="pr-3 [&>span:last-child]:w-full"
              >
                <span className="flex w-full items-center justify-between gap-6">
                  <span>{L[0]}</span>
                  <span className="font-medium text-muted-foreground">
                    {L[1]}
                  </span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Audio toggle */}
        <button
          ref={hapticRef}
          onClick={() => {
            haptic("selection");
            setAudio((a) => !a);
          }}
          aria-label={audio ? "Audio on" : "Audio off"}
          title={audio ? "Audio on" : "Audio off"}
          className={audio ? undefined : styles.iconBtn}
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

        {/* Overflow menu */}
        <span style={{ position: "relative", flexShrink: 0, zIndex: 21 }}>
          <button
            onClick={() => setMenuOpen((m) => !m)}
            aria-label="More options"
            title="More options"
            className={menuOpen ? undefined : styles.iconBtn}
            style={{
              width: 38,
              height: 38,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 999,
              border: `1px solid ${menuOpen ? "var(--border-2)" : "transparent"}`,
              background: menuOpen ? "var(--gray-50)" : "transparent",
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
          {menuOpen ? (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 6px)",
                right: 0,
                minWidth: 190,
                zIndex: 40,
                background: "#fff",
                borderRadius: 12,
                border: "1px solid var(--border-1)",
                boxShadow: "var(--shadow-lg)",
                padding: 6,
                animation: "wEngPopIn .14s ease-out",
              }}
            >
              {menuItem(ICON.helpCircle, "Help", () => {
                setMenuOpen(false);
                setHelpOpen(true);
              })}
              {menuItem(ICON.gear, "Settings", () => {
                setMenuOpen(false);
                setSettingsOpen(true);
              })}
              <div
                style={{
                  height: 1,
                  background: "var(--border-1)",
                  margin: "5px 4px",
                }}
              />
              <a
                href="/dashboard"
                className={styles.menuRow}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 11,
                  width: "100%",
                  padding: "9px 10px",
                  borderRadius: 7,
                  textDecoration: "none",
                  fontSize: 13.5,
                  fontWeight: 600,
                  color: "var(--error, #E62D21)",
                }}
              >
                <Icon d={ICON.logout} size={18} color="var(--error, #E62D21)" />
                Leave Session
              </a>
            </div>
          ) : null}
        </span>
      </div>

      <HelpSheet
        open={helpOpen}
        onClose={() => setHelpOpen(false)}
        compact={compact}
      />
      <SettingsSheet
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        compact={compact}
        settings={settings}
        onChange={setSettings}
      />
    </div>
  );
}
