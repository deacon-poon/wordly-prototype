"use client";

import { Highlighter, User } from "lucide-react";
import {
  FEATURED_QUOTE,
  FULL_SUMMARY,
  KEY_TAKEAWAYS,
  REACTION_STATS,
  TOP_MOMENTS,
} from "../data/mock";
import { HighlightsChart } from "../components/highlights-chart";
import styles from "../styles.module.css";

/** Shareable public summary page (`#view-public`). */
export function PublicView() {
  return (
    <div className={`min-h-0 flex-1 overflow-y-auto bg-[#f8f9fa] ${styles.thinScroll}`}>
      <div className="mx-auto max-w-[680px] px-6 pb-16 pt-8">
        <div className="mb-8 text-center">
          <h1 className="mb-3 text-[26px] font-bold leading-snug text-[#121416]">
            An AI State of the Union: We&apos;ve Passed the Inflection Point
          </h1>
          <div className="flex items-center justify-center gap-1.5 text-sm text-[#646e78]">
            <User className="h-4 w-4" />
            Lenny Rachitsky &amp; Simon Willison · Lenny&apos;s Newsletter · April 2, 2026
          </div>
        </div>

        <div className="mb-6 rounded-xl border-[1.5px] border-[#b2d8ff] bg-[#f0f7ff] px-7 py-6">
          <p className="text-[17px] font-semibold leading-relaxed text-[#121416]">
            &ldquo;{FEATURED_QUOTE.text}&rdquo;
          </p>
          <p className="mt-2.5 text-xs text-[#646e78]">— {FEATURED_QUOTE.author}</p>
        </div>

        <div className="mb-4 rounded-xl border border-[#e3e6e8] bg-white px-7 py-6">
          <div className="mb-5 text-[15px] font-bold text-[#121416]">Key Takeaways</div>
          <div className="flex flex-col gap-3.5">
            {KEY_TAKEAWAYS.map((t, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#b2d8ff] text-xs font-bold text-[#0051a8]">
                  {i + 1}
                </div>
                <span className="pt-0.5 text-sm leading-normal text-[#121416]">{t}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6 rounded-xl border border-[#e3e6e8] bg-white px-7 py-6">
          <div className="mb-5 text-[15px] font-bold text-[#121416]">Full Summary</div>
          <div className="flex flex-col gap-4 text-sm leading-relaxed text-[#343a40]">
            {FULL_SUMMARY.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>

        <div className="mb-6 overflow-hidden rounded-xl border border-[#b2d8ff] bg-white">
          <div className="flex items-center gap-2.5 border-b border-[#b2d8ff] bg-[#f0f7ff] px-7 py-4">
            <div className="flex h-[30px] w-[30px] items-center justify-center rounded-lg border border-[#75b8ff] bg-[#d6eaff]">
              <Highlighter className="h-4 w-4 text-[#0063cc]" />
            </div>
            <span className="text-[15px] font-bold text-[#121416]">Audience Engagement</span>
          </div>
          <div className="flex flex-col gap-5 px-7 py-5">
            <div className="grid grid-cols-3 gap-3">
              {[
                ["Attendees who highlighted", "168", "68% of attendees"],
                ["Total highlights", "2,241", "Avg 13.3 per person"],
                ["Engagement", "High", "Top 10% of sessions", true],
              ].map(([label, value, sub, hi]) => (
                <div key={String(label)} className="rounded-[10px] border border-[#e3e6e8] bg-[#f8f9fa] p-3.5">
                  <div className="mb-1.5 text-[11px] font-medium text-[#646e78]">{label}</div>
                  <div className={`font-bold leading-none ${hi ? "text-[22px] text-[#0a7b3f]" : "text-[28px] text-[#121416]"}`}>
                    {value}
                  </div>
                  <div className="mt-1 text-[11px] text-[#9ba3ab]">{sub}</div>
                </div>
              ))}
            </div>

            <div>
              <div className="mb-2.5 text-xs font-semibold uppercase tracking-[0.06em] text-[#646e78]">
                Highlights over time
              </div>
              <HighlightsChart height={100} />
              <div className="mt-1 flex justify-between text-[10px] text-[#9ba3ab]">
                <span>10:00 AM</span>
                <span>10:26 AM</span>
                <span>10:52 AM</span>
                <span>11:18 AM</span>
              </div>
            </div>

            <div>
              <div className="mb-3 text-xs font-semibold uppercase tracking-[0.06em] text-[#646e78]">
                Most-highlighted moments
              </div>
              <div className="flex flex-col gap-2.5">
                {TOP_MOMENTS.map((m) => (
                  <div
                    key={m.rank}
                    className="flex items-start gap-2.5 rounded-lg border border-[#e3e6e8] bg-[#f8f9fa] px-3.5 py-3"
                  >
                    <div
                      className={`mt-px flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-md text-[11px] font-bold ${
                        m.rank === 1
                          ? "border border-[#b2d8ff] bg-[#f0f7ff] text-[#0051a8]"
                          : "border border-[#e3e6e8] bg-[#eef0f2] text-[#646e78]"
                      }`}
                    >
                      {m.rank}
                    </div>
                    <div className="flex-1 text-[13px] leading-normal text-[#121416]">{m.text}</div>
                    <div className="flex flex-shrink-0 items-center gap-1 rounded-md border border-[#b2d8ff] bg-[#f0f7ff] px-2 py-[3px]">
                      <span className="text-[13px] font-semibold text-[#0051a8]">{m.count}</span>
                      <span className="text-[11px] text-[#9ba3ab]">highlights</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2.5 text-xs font-semibold uppercase tracking-[0.06em] text-[#646e78]">
                Audience reactions <span className="font-normal normal-case tracking-normal text-[#9ba3ab]">847 total</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {REACTION_STATS.map((r) => (
                  <div
                    key={r.emoji}
                    className="flex min-w-0 flex-1 items-center gap-1.5 rounded-lg border border-[#e3e6e8] bg-[#f8f9fa] px-2.5 py-1.5"
                  >
                    <span className="flex-shrink-0 text-[15px] leading-none">{r.emoji}</span>
                    <span className="text-[13px] font-bold text-[#121416]">{r.count}</span>
                    <span className="text-[11px] text-[#9ba3ab]">{r.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 border-t border-[#e3e6e8] px-6 py-4 text-center text-xs text-[#646e78]">
        <a href="#" className="font-medium text-[#0063cc] no-underline">
          Wordly AI Interpretation
        </a>
        <span className="text-[#cdd2d7]">|</span>
        <span>Privacy Policy</span>
        <span className="text-[#cdd2d7]">|</span>
        <span>Terms of Service</span>
        <span className="text-[#cdd2d7]">|</span>
        <span>Copyright © 2019-2026 Wordly, Inc.</span>
      </div>
    </div>
  );
}
