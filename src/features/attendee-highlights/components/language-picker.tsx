"use client";

import { Check, Globe, ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LANG_GROUPS, LANG_NAMES } from "../data/mock";
import styles from "../styles.module.css";

interface LanguagePickerProps {
  value: string;
  onChange: (code: string) => void;
}

/** Sub-nav language selector + anchored popover (`.lang-selector` / `.lang-popover`). */
export function LanguagePicker({ value, onChange }: LanguagePickerProps) {
  const label = (LANG_NAMES[value] ?? value).toUpperCase();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="flex h-9 items-center gap-1 border-b-2 border-[#017cff] px-2 text-[13px] font-medium text-[#121416]"
          aria-haspopup="listbox"
        >
          <Globe className="h-[15px] w-[15px]" />
          {label}
          <ChevronDown className="h-[13px] w-[13px]" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className={`max-h-[380px] w-[280px] overflow-y-auto rounded-[10px] border border-[#cdd2d7] p-0 py-1.5 shadow-[0_8px_32px_rgba(0,14,36,0.18)] ${styles.thinScroll}`}
      >
        {LANG_GROUPS.map((g) => (
          <div key={g.label}>
            <div className="px-3.5 pb-1 pt-2 text-[10px] font-bold uppercase tracking-[0.08em] text-[#9ba3ab]">
              {g.label}
            </div>
            {g.codes.map((code) => {
              const selected = code === value;
              return (
                <button
                  key={code}
                  onClick={() => onChange(code)}
                  className={`flex w-full items-center justify-between gap-2 px-3.5 py-2 text-left text-[13px] transition ${
                    selected
                      ? "bg-[#f0f7ff] font-semibold text-[#00458f]"
                      : "text-[#121416] hover:bg-[#f8f9fa]"
                  }`}
                >
                  <span>{LANG_NAMES[code] ?? code}</span>
                  {selected && <Check className="h-3.5 w-3.5 flex-shrink-0 text-[#0063cc]" />}
                </button>
              );
            })}
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
}
