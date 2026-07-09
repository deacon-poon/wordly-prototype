import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Minimal web TTS for the LIVE attend feed, mirroring attend.wordly.ai's
 * behavior: finalized phrases are queued through `speechSynthesis` in the
 * language they streamed in; turning audio off cancels the queue immediately.
 * (The production attend app plays server-generated voice — speechSynthesis is
 * the prototype-grade stand-in with the same interaction contract.)
 *
 * `speaking` is true only while voice is actually playing — it drives the
 * header button's ripple, so the pulse is an honest playback indicator rather
 * than a constant animation while the toggle is merely on.
 */
export function useSpeechTts(enabled: boolean) {
  const [speaking, setSpeaking] = useState(false);
  const queued = useRef(0);
  const idle = useCallback(() => {
    queued.current = 0;
    setSpeaking(false);
  }, []);

  const enabledRef = useRef(enabled);
  useEffect(() => {
    enabledRef.current = enabled;
    if (!enabled && typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      idle();
    }
  }, [enabled, idle]);
  // Leaving the view stops the voice.
  useEffect(
    () => () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    },
    []
  );

  const speak = useCallback((text: string, lang?: string) => {
    if (
      !enabledRef.current ||
      typeof window === "undefined" ||
      !window.speechSynthesis ||
      !text.trim()
    ) {
      return;
    }
    const u = new SpeechSynthesisUtterance(text);
    if (lang) {
      u.lang = lang;
      const base = lang.toLowerCase().split("-")[0];
      const voice = window.speechSynthesis
        .getVoices()
        .find((v) => v.lang.toLowerCase().startsWith(base));
      if (voice) u.voice = voice;
    }
    queued.current += 1;
    setSpeaking(true);
    const done = () => {
      queued.current -= 1;
      if (queued.current <= 0) {
        queued.current = 0;
        setSpeaking(false);
      }
    };
    u.onend = done;
    u.onerror = done;
    // speak() queues natively, so phrases play in arrival order.
    window.speechSynthesis.speak(u);
  }, []);

  return { speak, speaking };
}
