"use client";

import { useState } from "react";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Wordmark } from "./wordmark";
import { LANG_GROUPS, LANG_NAMES } from "../data/mock";

interface JoinOverlayProps {
  onJoin: (code: string, lang: string, name: string) => void;
  onDemo: () => void;
}

/** The full-screen "Join a session" form overlay (`.join-overlay`). */
export function JoinOverlay({ onJoin, onDemo }: JoinOverlayProps) {
  const [code, setCode] = useState("");
  const [lang, setLang] = useState("en");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [connecting, setConnecting] = useState(false);

  const handleCode = (raw: string) => {
    let v = raw.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
    if (v.length > 4) v = v.slice(0, 4) + "-" + v.slice(4, 8);
    setCode(v);
    setError("");
  };

  const submit = () => {
    if (!/^[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(code)) {
      setError("Please enter a valid session code in the format XXXX-0000.");
      return;
    }
    // Demo prototype: there is no real endpoint, so simulate a connect failure
    // (mirrors the prototype's behavior with no live session available).
    setConnecting(true);
    setTimeout(() => {
      setConnecting(false);
      setError("Could not connect. Check the session code and try again, or try the demo.");
    }, 1100);
    onJoin(code, lang, name);
  };

  return (
    <div className="absolute inset-0 z-[100] flex items-center justify-center bg-[rgba(0,14,36,0.55)] p-5 backdrop-blur-[3px]">
      <div className="w-full max-w-[420px] overflow-hidden rounded-2xl bg-white shadow-[0_24px_64px_rgba(0,14,36,0.22)]">
        <div className="px-6 pb-4 pt-6">
          <Wordmark className="mb-4 h-5 w-auto" />
          <div className="mb-1 text-xl font-bold text-[#121416]">Join a session</div>
          <div className="text-[13px] leading-relaxed text-[#646e78]">
            Enter the session code shown by your presenter to start receiving live translation.
          </div>
        </div>
        <div className="h-px bg-[#e3e6e8]" />
        <div className="flex flex-col gap-3.5 px-6 pb-6 pt-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#121416]" htmlFor="ah-join-code">
              Session code
            </label>
            <input
              id="ah-join-code"
              value={code}
              onChange={(e) => handleCode(e.target.value)}
              placeholder="XXXX-0000"
              maxLength={9}
              autoComplete="off"
              spellCheck={false}
              className={`rounded-lg border px-3 py-2.5 text-sm text-[#121416] outline-none transition focus:border-[#017cff] focus:shadow-[0_0_0_3px_rgba(1,124,255,0.12)] ${
                error ? "border-[#e04040] shadow-[0_0_0_3px_rgba(224,64,64,0.1)]" : "border-[#cdd2d7]"
              }`}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#121416]" htmlFor="ah-join-lang">
              Language
            </label>
            <select
              id="ah-join-lang"
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="cursor-pointer rounded-lg border border-[#cdd2d7] bg-white px-3 py-2.5 text-sm text-[#121416] outline-none focus:border-[#017cff] focus:shadow-[0_0_0_3px_rgba(1,124,255,0.12)]"
            >
              {LANG_GROUPS.map((g) => (
                <optgroup key={g.label} label={g.label}>
                  {g.codes.map((c) => (
                    <option key={c} value={c}>
                      {LANG_NAMES[c] ?? c}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#121416]" htmlFor="ah-join-name">
              Your name <span className="font-normal text-[#9ba3ab]">(optional)</span>
            </label>
            <input
              id="ah-join-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Kim"
              autoComplete="name"
              className="rounded-lg border border-[#cdd2d7] px-3 py-2.5 text-sm text-[#121416] outline-none transition focus:border-[#017cff] focus:shadow-[0_0_0_3px_rgba(1,124,255,0.12)]"
            />
          </div>
          {error && (
            <div className="rounded-md border border-[#f9cfcc] bg-[#fcebea] px-2.5 py-2 text-xs text-[#b8221a]">
              {error}
            </div>
          )}
          <Button
            onClick={submit}
            disabled={connecting}
            className="flex h-auto w-full items-center justify-center gap-2 rounded-[10px] bg-[#017cff] py-3 text-[15px] font-semibold text-white hover:bg-[#0063cc]"
          >
            {connecting ? (
              "Connecting…"
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                Join session
              </>
            )}
          </Button>
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-xs text-[#9ba3ab]">No code?</span>
            <button
              onClick={onDemo}
              className="cursor-pointer border-none bg-transparent text-xs text-[#0063cc] underline underline-offset-2 hover:text-[#0051a8]"
            >
              Try the demo instead
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
