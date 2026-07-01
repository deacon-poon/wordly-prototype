import { useEffect } from "react";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";
import { Icon } from "../lib/icons";
import { ICON } from "../lib/reactions-data";
import styles from "../engagement.module.css";

/**
 * A modal shell shared by the Help, Settings, and Share flows. On phone it's a
 * full-screen sheet that slides up; on wider screens it's a centred dialog card.
 * Portalled to <body> (with `styles.root` so DS tokens resolve) and dismissible via the
 * backdrop, the close button, or Escape.
 */
export function Overlay({
  open,
  onClose,
  title,
  icon,
  compact = false,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  icon: string;
  /** Phone → full-screen sheet; otherwise → centred dialog. */
  compact?: boolean;
  children: ReactNode;
  footer?: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  const card: React.CSSProperties = compact
    ? {
        width: "100%",
        height: "100%",
        borderRadius: 0,
        animation: "wEngSheetUp .26s cubic-bezier(.32,.72,0,1)",
      }
    : {
        width: "min(480px, 92vw)",
        maxHeight: "84vh",
        borderRadius: 16,
        boxShadow: "var(--shadow-lg)",
        animation: "wEngPopIn .18s ease-out",
      };

  return createPortal(
    <div
      className={styles.root}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 70,
        background: "rgba(15,23,42,.45)",
        display: "flex",
        alignItems: compact ? "stretch" : "center",
        justifyContent: "center",
        padding: compact ? 0 : 16,
        animation: "wEngFade .16s ease-out",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{
          background: "#fff",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          ...card,
        }}
      >
        <div
          style={{
            flexShrink: 0,
            padding: "14px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid var(--border-1)",
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              fontSize: 15,
              fontWeight: 600,
              color: "var(--fg-1)",
            }}
          >
            <Icon d={icon} size={18} color="var(--primary-blue-500)" />
            {title}
          </span>
          <button
            onClick={onClose}
            aria-label="Close"
            className={styles.iconBtn}
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon d={ICON.x} size={17} color="var(--fg-3)" />
          </button>
        </div>

        <div style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
          {children}
        </div>

        {footer ? (
          <div
            style={{
              flexShrink: 0,
              borderTop: "1px solid var(--border-1)",
              background: "#fff",
            }}
          >
            {footer}
          </div>
        ) : null}
      </div>
    </div>,
    document.body
  );
}
