import { useCallback, useEffect, useRef, useState } from "react";
import { TRANSCRIPT, SPEAKERS } from "../data/transcript";
import type { StreamState } from "./useTranscriptStream";

/**
 * LIVE mode — the real Wordly `/attend` WebSocket feed (Endpoint Services API v1.3).
 *
 * Lifecycle per the spec: open socket → `connect` → await `status.success` →
 * stream `phrase`/`users` → `end` closes the session → `disconnect`. Non-final
 * results update the same `phraseId` in place; a stale non-final arriving after
 * the final for its phrase is ignored. If the socket drops unexpectedly we
 * reconnect with the SAME attendee `identifier` (so the attendee isn't counted
 * twice), with a small backoff. `echo` keep-alives every 25s.
 *
 * The hook feeds the SAME contract the demo engine uses — it maintains the
 * module TRANSCRIPT/SPEAKERS in place and returns `{ eng, last, ended }` — so
 * every downstream surface (bubbles, highlights, share, session-complete, RTL)
 * works against live data unchanged.
 */

export type AttendConfig = {
  /** Presentation code, format XXXX-0000. */
  code: string;
  /** Attendee passcode for restricted sessions. */
  accessKey?: string;
  /** Full wss endpoint URL override (?env=dev → wss://dev-timely.wordly.ai/attend). */
  endpoint?: string;
};

const ENDPOINT = "wss://endpoint.wordly.ai/attend";
// Per the Endpoint Services API doc: "For Wordly Lab projects use connectionCode: 9010".
const CONNECTION_CODE = "9010";

/** Distinct per-speaker name colours, assigned in join order. */
const PALETTE = [
  "var(--primary-blue-600)",
  "var(--accent-green-700)",
  "var(--primary-blue-400)",
  "var(--gray-500)",
  "var(--violet-600)",
  "var(--amber-600)",
  "var(--rare-orange-600)",
];

export type AttendStatus = "idle" | "connecting" | "live" | "error";

export function useAttendStream({
  config,
  initialLanguageCode,
}: {
  /** Live session config; omit to keep the hook inert (demo mode). */
  config?: AttendConfig;
  initialLanguageCode: string;
}) {
  // Transcript lives in the module array; this counter re-renders consumers.
  const [, setTick] = useState(0);
  const [ended, setEnded] = useState(false);
  const [status, setStatus] = useState<AttendStatus>(
    config ? "connecting" : "idle"
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const ws = useRef<WebSocket | null>(null);
  const closedForGood = useRef(false);
  const phraseIds = useRef(new Map<string, number>()); // phraseId → bubble id
  const finals = useRef(new Set<string>());
  const nextId = useRef(1);
  const speakerCount = useRef(0);
  const langRef = useRef(initialLanguageCode);

  // Stable per-browser attendee identifier — reused across reconnects so the
  // same attendee is not counted twice (per spec).
  const identifier = useRef("");
  if (!identifier.current && typeof window !== "undefined") {
    const KEY = "wordly-lab-attendee-id";
    identifier.current =
      localStorage.getItem(KEY) ||
      (typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `lab-${Date.now()}`);
    try {
      localStorage.setItem(KEY, identifier.current);
    } catch {
      /* private mode — a per-load id is fine */
    }
  }

  useEffect(() => {
    if (!config || typeof window === "undefined") return;
    closedForGood.current = false;
    // The live feed replaces the demo script entirely.
    TRANSCRIPT.splice(0, TRANSCRIPT.length);
    setTick((t) => t + 1);

    let retries = 0;
    let echoTimer: ReturnType<typeof setInterval> | undefined;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;

    const bump = () => setTick((t) => t + 1);

    const onPhrase = (m: {
      phraseId?: string;
      speakerId?: string;
      name?: string;
      translatedText?: string;
      isFinal?: boolean;
    }) => {
      if (!m.phraseId || typeof m.translatedText !== "string") return;
      // Ignore a non-final result that arrives after the final one (spec).
      if (finals.current.has(m.phraseId) && !m.isFinal) return;
      if (m.isFinal) finals.current.add(m.phraseId);

      const sp = m.speakerId || "speaker";
      if (!SPEAKERS[sp]) {
        SPEAKERS[sp] = {
          name: m.name || `Speaker ${speakerCount.current + 1}`,
          role: "",
          c: PALETTE[speakerCount.current % PALETTE.length],
          mic: "panel",
        };
        speakerCount.current += 1;
      } else if (m.name) {
        SPEAKERS[sp].name = m.name;
      }

      let id = phraseIds.current.get(m.phraseId);
      if (id == null) {
        id = nextId.current++;
        phraseIds.current.set(m.phraseId, id);
      }
      const idx = TRANSCRIPT.findIndex((b) => b.id === id);
      // Stamp the language the phrase streamed in (re-stamped on updates: after a
      // `change`, non-final revisions arrive re-translated into the new language).
      const bubble = { id, sp, text: m.translatedText, lang: langRef.current };
      if (idx >= 0) TRANSCRIPT[idx] = bubble;
      else TRANSCRIPT.push(bubble);
      bump();
    };

    const onUsers = (m: {
      presenters?: { speakerId?: string; name?: string }[];
    }) => {
      for (const p of m.presenters || []) {
        if (p.speakerId && p.name && SPEAKERS[p.speakerId]) {
          SPEAKERS[p.speakerId].name = p.name;
        }
      }
      bump();
    };

    const open = () => {
      if (closedForGood.current) return;
      setStatus("connecting");
      const sock = new WebSocket(config.endpoint || ENDPOINT);
      ws.current = sock;

      sock.onopen = () => {
        sock.send(
          JSON.stringify({
            type: "connect",
            presentationCode: config.code,
            languageCode: langRef.current,
            ...(config.accessKey ? { accessKey: config.accessKey } : {}),
            name: "Wordly Lab attendee",
            identifier: identifier.current,
            connectionCode: CONNECTION_CODE,
          })
        );
      };

      sock.onmessage = (ev) => {
        if (typeof ev.data !== "string") return;
        let msg: Record<string, unknown>;
        try {
          msg = JSON.parse(ev.data);
        } catch {
          return;
        }
        switch (msg.type) {
          case "status":
            if (msg.success) {
              retries = 0;
              setStatus("live");
              setErrorMsg(null);
            } else {
              // Bad code / restricted / out of minutes… — terminal, don't retry.
              closedForGood.current = true;
              setStatus("error");
              setErrorMsg(
                `${(msg.message as string) || "Unable to join the session"} (code ${msg.code})`
              );
              sock.close();
            }
            break;
          case "phrase":
            onPhrase(msg);
            break;
          case "users":
            onUsers(msg);
            break;
          case "end":
            // Presentation is over → drives the Session complete flow.
            closedForGood.current = true;
            setEnded(true);
            try {
              sock.send(JSON.stringify({ type: "disconnect" }));
            } catch {
              /* already closing */
            }
            sock.close();
            break;
          case "error":
            setErrorMsg((msg.message as string) || "Session error");
            break;
        }
      };

      sock.onclose = () => {
        if (echoTimer) clearInterval(echoTimer);
        if (!closedForGood.current) {
          // Unexpected drop — reconnect with the same identifier (spec).
          retries += 1;
          retryTimer = setTimeout(open, Math.min(5000, 800 * retries));
        }
      };

      if (echoTimer) clearInterval(echoTimer);
      echoTimer = setInterval(() => {
        try {
          if (sock.readyState === WebSocket.OPEN)
            sock.send(JSON.stringify({ type: "echo" }));
        } catch {
          /* no-op */
        }
      }, 25000);
    };

    open();
    return () => {
      closedForGood.current = true;
      if (echoTimer) clearInterval(echoTimer);
      if (retryTimer) clearTimeout(retryTimer);
      try {
        if (ws.current?.readyState === WebSocket.OPEN)
          ws.current.send(JSON.stringify({ type: "disconnect" }));
      } catch {
        /* no-op */
      }
      ws.current?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config?.code, config?.accessKey, config?.endpoint]);

  /** Future phrases arrive translated into this language (spec: `change`). */
  const changeLanguage = useCallback((languageCode: string) => {
    langRef.current = languageCode;
    try {
      if (ws.current?.readyState === WebSocket.OPEN)
        ws.current.send(JSON.stringify({ type: "change", languageCode }));
    } catch {
      /* reconnect will use langRef */
    }
  }, []);

  // Same contract as the demo engine: bi = newest line index, wi = its word
  // count (so it renders fully, with the newest-word fade as text grows).
  const last = TRANSCRIPT.length - 1;
  const eng: StreamState = {
    bi: Math.max(0, last),
    wi: last >= 0 ? TRANSCRIPT[last].text.split(" ").length : 0,
  };
  return { eng, last, ended, status, errorMsg, changeLanguage };
}
