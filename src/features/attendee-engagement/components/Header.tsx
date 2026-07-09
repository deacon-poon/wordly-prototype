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

// Collapsed trigger shows the language in the user's OWN language (native label),
// while the dropdown keeps the English name + native label. Keyed by English name.
const NATIVE_LABEL: Record<string, string> = Object.fromEntries(LANGS);
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
  onLeave,
  lang: langProp,
  onLang,
  audio: audioProp,
  onAudio,
  speaking,
  settings: settingsProp,
  onSettings,
}: {
  logoHeight?: string;
  compact?: boolean;
  /** Leave Session → the end-of-session flow (highlights + copy out), not a bare nav. */
  onLeave?: () => void;
  /** Controlled language (lifted so the app can switch caption data + RTL layout). */
  lang?: string;
  onLang?: (lang: string) => void;
  /** Controlled TTS/audio toggle (lifted so the transcript can mark the line being
   *  read aloud). Falls back to local state when uncontrolled. */
  audio?: boolean;
  onAudio?: (on: boolean) => void;
  /** LIVE mode: true only while voice is actually playing — the ripple becomes an
   *  honest playback indicator instead of a constant animation. Omitted (demo):
   *  the ripple shows whenever audio is on, so the state stays demonstrable. */
  speaking?: boolean;
  /** Controlled settings (lifted so live TTS can honor ttsSameLang). */
  settings?: EngagementSettings;
  onSettings?: (next: EngagementSettings) => void;
}) {
  const [audioState, setAudioState] = useState(false);
  const audio = audioProp ?? audioState;
  const setAudio = onAudio ?? setAudioState;
  const [menuOpen, setMenuOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [langState, setLangState] = useState("English (US)");
  const lang = langProp ?? langState;
  const setLang = onLang ?? setLangState;
  const [pickerOpen, setPickerOpen] = useState(false);
  // Controlled from the app when provided (live TTS reads ttsSameLang there);
  // falls back to local state, same pattern as `audio` above.
  const [settingsState, setSettingsState] = useState<EngagementSettings>({
    onlyFinal: false,
    ttsSameLang: false,
  });
  const settings = settingsProp ?? settingsState;
  const setSettings = onSettings ?? setSettingsState;
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
        textAlign: "start",
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
          // Pure gradient fade to transparent — no backdrop blur. Streaming text
          // dissolves under the header via the white→transparent ramp alone (Graham:
          // the top should fade with a gradient, not blur).
          background:
            "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,.98) 46%, rgba(255,255,255,.72) 72%, rgba(255,255,255,0) 100%)",
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
        {compact ? (
          // Static DS asset on small screens (Justin: logo rendered tiny on iPhone
          // Safari). WordlyLogo's inline <svg> sets height + viewBox but no width,
          // and Safari doesn't derive intrinsic width from the viewBox ratio — the
          // <img> carries the artwork's explicit 190×57, so Safari sizes it right.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/logo/wordly-logo.svg"
            alt="Wordly"
            style={{ height: logoHeight, width: "auto", display: "block" }}
          />
        ) : (
          <WordlyLogo height={logoHeight} />
        )}
        <span style={{ flex: 1 }} />

        {/* Language selector — ShadCN Select (DS component). */}
        <Select
          value={lang}
          onValueChange={(v) => {
            haptic("selection");
            setLang(v);
          }}
          open={pickerOpen}
          onOpenChange={setPickerOpen}
        >
          <SelectTrigger
            aria-label="Change language"
            // Button states per the Wordly DS menu style guide (Figma 911-1868):
            // hover = accent-green-100 (#bbf7cb), pressed = accent-green-200
            // (#84f1a2); gray border + regular text unchanged.
            // NB: plain var() — inside the feature root these tokens are hex
            // (engagement.module.css), so hsl(var()) would not resolve.
            className="h-11 w-auto shrink-0 gap-2 rounded-lg bg-white text-sm font-medium transition-colors hover:bg-[var(--accent-green-100)] active:bg-[var(--accent-green-200)]"
            // While open, hold the hover tint (green-100) so the trigger reads active.
            style={
              pickerOpen ? { background: "var(--accent-green-100)" } : undefined
            }
          >
            <Icon d={ICON.languages} size={16} color="var(--fg-3)" />
            <span dir="auto">{NATIVE_LABEL[lang] ?? lang}</span>
          </SelectTrigger>
          <SelectContent
            className="max-h-[340px] min-w-[248px]"
            // Radix portals the menu to <body>, OUTSIDE the feature .root, so the
            // scoped green tokens aren't in scope here — re-declare them on the menu
            // so the item state classes (var(--accent-green-*)) resolve. Values mirror
            // engagement.module.css / the Wordly DS.
            style={
              {
                "--accent-green-50": "#dafbe4",
                "--accent-green-100": "#bbf7cb",
                "--accent-green-200": "#84f1a2",
                "--fg-1": "#121416",
              } as React.CSSProperties
            }
          >
            {LANGS.map((L) => (
              <SelectItem
                key={L[0]}
                value={L[0]}
                // Item states per the Wordly DS menu style guide (Figma 911-1868),
                // in ACCENT GREEN (secondary), not the default blue — scoped here,
                // not in the shared Select. Radix marks the hovered/keyboard item with
                // `data-highlighted` (NOT :focus), so target that. Plain var() (hex
                // tokens); `!` beats the shared Select's base focus:bg-accent.
                //   hover/highlight → green-100 · pressed → green-200 · selected → green-50
                className="rounded-[4px] pr-3 [&>span:last-child]:w-full data-[highlighted]:!bg-[var(--accent-green-100)] data-[highlighted]:!text-[var(--fg-1)] active:!bg-[var(--accent-green-200)] data-[highlighted]:active:!bg-[var(--accent-green-200)] data-[state=checked]:bg-[var(--accent-green-50)]"
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
            setAudio(!audio);
          }}
          aria-label={audio ? "Audio on, reading aloud" : "Audio off"}
          title={audio ? "Audio on" : "Audio off"}
          className={`${styles.ttsBtn} ${audio && (speaking ?? true) ? styles.audioPulse : ""}`}
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
                insetInlineEnd: 0,
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
              <button
                onClick={() => {
                  setMenuOpen(false);
                  // End-of-session flow: show highlights + copy-out before leaving.
                  if (onLeave) onLeave();
                  else window.location.href = "/dashboard";
                }}
                className={styles.menuRow}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 11,
                  width: "100%",
                  padding: "9px 10px",
                  borderRadius: 7,
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: 13.5,
                  fontWeight: 600,
                  color: "var(--error, #E62D21)",
                }}
              >
                <Icon d={ICON.logout} size={18} color="var(--error, #E62D21)" />
                Leave Session
              </button>
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
