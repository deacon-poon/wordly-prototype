import { Overlay } from "./Overlay";
import { Icon } from "../lib/icons";
import { ICON } from "../lib/reactions-data";
import { haptic } from "../lib/haptics";

export type EngagementSettings = {
  onlyFinal: boolean;
  ttsSameLang: boolean;
};

const ROWS: { id: keyof EngagementSettings; label: string; hint: string }[] = [
  {
    id: "onlyFinal",
    label: "Show only complete phrases",
    hint: "When on, captions only appear after the speaker finishes a phrase, so the text doesn't update in place.",
  },
  {
    id: "ttsSameLang",
    label: "Play voice in same language as speaker",
    hint: "By default, Wordly doesn't speak when your language matches the speaker's. Turn this on to hear the virtual voice anyway.",
  },
];

/** Settings page — attendee playback preferences (checkbox toggles). */
export function SettingsSheet({
  open,
  onClose,
  compact,
  settings,
  onChange,
}: {
  open: boolean;
  onClose: () => void;
  compact?: boolean;
  settings: EngagementSettings;
  onChange: (next: EngagementSettings) => void;
}) {
  const toggle = (id: keyof EngagementSettings) => {
    haptic("selection");
    onChange({ ...settings, [id]: !settings[id] });
  };

  return (
    <Overlay
      open={open}
      onClose={onClose}
      compact={compact}
      title="Settings"
      icon={ICON.gear}
    >
      <div style={{ padding: "2px 16px 14px" }}>
        {ROWS.map((row, i) => {
          const on = settings[row.id];
          return (
            <div key={row.id}>
              <button
                onClick={() => toggle(row.id)}
                aria-pressed={on}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 11,
                  padding: "13px 0",
                  width: "100%",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <span
                  style={{
                    marginTop: 1,
                    width: 20,
                    height: 20,
                    flexShrink: 0,
                    borderRadius: 6,
                    background: on ? "var(--primary-blue-500)" : "#fff",
                    border: on ? "none" : "1.5px solid var(--gray-400)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxSizing: "border-box",
                  }}
                >
                  {on ? (
                    <Icon d={ICON.check} size={13} color="#fff" sw={3.2} />
                  ) : null}
                </span>
                <span
                  style={{ display: "flex", flexDirection: "column", gap: 3 }}
                >
                  <span
                    style={{
                      fontSize: 13.5,
                      fontWeight: 500,
                      color: "var(--fg-1)",
                    }}
                  >
                    {row.label}
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      color: "var(--fg-3)",
                      lineHeight: 1.45,
                    }}
                  >
                    {row.hint}
                  </span>
                </span>
              </button>
              {i < ROWS.length - 1 ? (
                <div style={{ height: 1, background: "var(--border-1)" }} />
              ) : null}
            </div>
          );
        })}
      </div>
    </Overlay>
  );
}
