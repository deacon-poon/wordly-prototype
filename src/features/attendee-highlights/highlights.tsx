"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, LogOut, Volume2, VolumeX } from "lucide-react";
import type { ConnStatus, ReactEmoji, TranscriptItem, ViewKey } from "./types";
import { DEMO_SCRIPT } from "./data/mock";
import { Wordmark } from "./components/wordmark";
import { ConnStatusPill } from "./components/conn-status-pill";
import { LanguagePicker } from "./components/language-picker";
import { JoinOverlay } from "./components/join-overlay";
import { EndedModal } from "./components/ended-modal";
import { AttendeeView } from "./views/attendee-view";
import { PresenterView } from "./views/presenter-view";
import { OrganizerView } from "./views/organizer-view";
import { PublicView } from "./views/public-view";
import styles from "./styles.module.css";

const VIEW_TABS: { key: ViewKey; label: string }[] = [
  { key: "attendee", label: "Attend" },
  { key: "presenter", label: "Present" },
  { key: "ended", label: "Session ended" },
  { key: "organizer", label: "Portal usage page" },
  { key: "public", label: "Public summary page" },
];

export default function Feature() {
  // ── Core shared state ──────────────────────────────────────────────
  const [view, setView] = useState<ViewKey>("attendee");
  const [joined, setJoined] = useState(false);
  const [sessionCode, setSessionCode] = useState("");
  const [connStatus, setConnStatus] = useState<ConnStatus>("demo");
  const [connLabel, setConnLabel] = useState("Demo");
  const [language, setLanguage] = useState("en");
  const [muted, setMuted] = useState(false);

  const [transcript, setTranscript] = useState<TranscriptItem[]>([]);
  const [highlighted, setHighlighted] = useState<Set<number>>(new Set());
  const [reactions, setReactions] = useState<Record<number, Set<ReactEmoji>>>({});
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const scriptIndex = useRef(0);
  const idCounter = useRef(0);
  const demoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Demo transcript playback ───────────────────────────────────────
  const stopDemo = useCallback(() => {
    if (demoTimer.current) {
      clearTimeout(demoTimer.current);
      demoTimer.current = null;
    }
  }, []);

  const beginDemo = useCallback(() => {
    stopDemo();
    const deliverNext = () => {
      if (scriptIndex.current >= DEMO_SCRIPT.length) return;
      const line = DEMO_SCRIPT[scriptIndex.current++];
      const id = ++idCounter.current;
      setTranscript((prev) => [...prev, { id, ...line }]);
      demoTimer.current = setTimeout(deliverNext, 1650 + Math.random() * 900);
    };
    demoTimer.current = setTimeout(deliverNext, 400);
  }, [stopDemo]);

  const startDemo = useCallback(() => {
    setJoined(true);
    setSessionCode("Demo mode");
    setConnStatus("demo");
    setConnLabel("Demo");
    scriptIndex.current = 0;
    idCounter.current = 0;
    setTranscript([]);
    beginDemo();
  }, [beginDemo]);

  // The demo prototype has no live backend; "Join" surfaces a connect error
  // in the overlay, so here we simply track the entered code/language.
  const handleJoin = useCallback((code: string, lang: string) => {
    setSessionCode(code);
    setLanguage(lang);
  }, []);

  useEffect(() => () => stopDemo(), [stopDemo]);

  // ── Highlight + reaction logic ─────────────────────────────────────
  const toggleHighlight = useCallback((item: TranscriptItem) => {
    setHighlighted((prev) => {
      const next = new Set(prev);
      if (next.has(item.id)) {
        next.delete(item.id);
        setReactions((r) => {
          const copy = { ...r };
          delete copy[item.id];
          return copy;
        });
        setSelectedId((sel) => {
          if (sel !== item.id) return sel;
          const remaining = [...next];
          return remaining.length ? remaining[remaining.length - 1] : null;
        });
      } else {
        next.add(item.id);
        setSelectedId(item.id);
      }
      return next;
    });
  }, []);

  const react = useCallback((id: number, emoji: ReactEmoji) => {
    setReactions((prev) => {
      const next = { ...prev };
      const set = new Set(next[id] ?? []);
      if (set.has(emoji)) set.delete(emoji);
      else set.add(emoji);
      next[id] = set;
      return next;
    });
  }, []);

  const exitSession = useCallback(() => {
    stopDemo();
    setConnStatus("demo");
    setConnLabel("Disconnected");
    setView("ended");
  }, [stopDemo]);

  const highlights = transcript.filter((t) => highlighted.has(t.id));
  const showSubNav = view === "attendee" || view === "ended";

  return (
    <div className={`flex h-screen flex-col bg-white ${styles.root}`}>
      {/* TOP NAV */}
      <div className="flex h-14 flex-shrink-0 items-center justify-between gap-3 border-b border-[#e3e6e8] bg-white pl-5 pr-4">
        <div className="flex flex-shrink-0 items-center gap-3.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="block h-7 w-auto"
            src="https://www.encoreglobal.com/wp-content/uploads/2025/04/encore-logo-vector.svg"
            alt="Encore"
          />
          <span className="h-5 w-px bg-[#e3e6e8]" />
          <span className="flex items-center gap-1.5 text-[11px] leading-none text-[#9ba3ab]">
            Powered by
            <Wordmark className="h-[22px] w-auto" />
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Linkage back to the portal prototype experience */}
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[#646e78] transition hover:bg-[#eef0f2] hover:text-[#121416]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Portal
          </Link>
          <span className="h-5 w-px bg-[#e3e6e8]" />
          <div className="flex gap-0.5 rounded-lg border border-[#e3e6e8] bg-[#eef0f2] p-0.5">
            {VIEW_TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setView(t.key)}
                className={`whitespace-nowrap rounded-md px-3 py-[5px] text-xs font-medium transition ${
                  view === t.key
                    ? "bg-white text-[#121416] shadow-[0_1px_3px_rgba(0,0,0,0.1)]"
                    : "text-[#646e78] hover:text-[#121416]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SUB NAV (attendee / ended) */}
      {showSubNav && (
        <div className="flex h-11 flex-shrink-0 items-center justify-between border-b border-[#e3e6e8] bg-white px-5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-[#646e78]">{sessionCode || "—"}</span>
            <ConnStatusPill status={connStatus} label={connLabel} />
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setMuted((v) => !v)}
              aria-label={muted ? "Unmute" : "Mute"}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-[#646e78] hover:bg-[#eef0f2]"
            >
              {muted ? <VolumeX className="h-[18px] w-[18px]" /> : <Volume2 className="h-[18px] w-[18px]" />}
            </button>
            <LanguagePicker value={language} onChange={setLanguage} />
            <button
              onClick={exitSession}
              aria-label="Leave session"
              title="Leave session"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-[#b8221a] hover:bg-[#eef0f2]"
            >
              <LogOut className="h-[18px] w-[18px]" />
            </button>
          </div>
        </div>
      )}

      {/* MAIN */}
      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        {view === "attendee" && (
          <AttendeeView
            transcript={transcript}
            highlighted={highlighted}
            reactions={reactions}
            selectedId={selectedId}
            onToggleHighlight={toggleHighlight}
            onSelect={setSelectedId}
            onReact={react}
          />
        )}
        {view === "presenter" && (
          <PresenterView transcript={transcript} highlighted={highlighted} reactions={reactions} />
        )}
        {view === "organizer" && <OrganizerView onOpenPublic={() => setView("public")} />}
        {view === "public" && <PublicView />}
        {view === "ended" && (
          <>
            {/* keep attendee feed behind the modal for visual continuity */}
            <AttendeeView
              transcript={transcript}
              highlighted={highlighted}
              reactions={reactions}
              selectedId={selectedId}
              onToggleHighlight={toggleHighlight}
              onSelect={setSelectedId}
              onReact={react}
            />
            <EndedModal
              transcript={transcript}
              highlights={highlights}
              onClose={() => setView("attendee")}
              onViewPublic={() => setView("public")}
            />
          </>
        )}

        {/* Join overlay sits above the attendee view until joined */}
        {!joined && view === "attendee" && (
          <JoinOverlay onJoin={handleJoin} onDemo={startDemo} />
        )}
      </div>
    </div>
  );
}
