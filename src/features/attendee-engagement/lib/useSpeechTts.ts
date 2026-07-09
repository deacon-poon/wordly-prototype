import { useCallback, useEffect, useRef } from "react";

/**
 * Minimal web TTS for the LIVE attend feed, mirroring attend.wordly.ai's
 * behavior: finalized phrases are queued through `speechSynthesis` in the
 * language they streamed in; turning audio off cancels the queue immediately.
 * (The production attend app plays server-generated voice — speechSynthesis is
 * the prototype-grade stand-in with the same interaction contract.)
 */
export function useSpeechTts(enabled: boolean) {
  const enabledRef = useRef(enabled);
  useEffect(() => {
    enabledRef.current = enabled;
    if (!enabled && typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, [enabled]);
  // Leaving the view stops the voice.
  useEffect(
    () => () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    },
    []
  );

  return useCallback((text: string, lang?: string) => {
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
    // speak() queues natively, so phrases play in arrival order.
    window.speechSynthesis.speak(u);
  }, []);
}
