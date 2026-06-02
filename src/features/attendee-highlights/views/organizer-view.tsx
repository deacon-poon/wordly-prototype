"use client";

import { useState } from "react";
import {
  Activity,
  Calendar,
  Clock,
  FileText,
  Globe,
  Highlighter,
  LayoutDashboard,
  MoreHorizontal,
  Search,
  Users,
} from "lucide-react";
import {
  LANG_BARS,
  REACTION_STATS,
  SESSIONS,
  TOP_MOMENTS,
} from "../data/mock";
import { HighlightsChart } from "../components/highlights-chart";
import { AiSummary } from "../components/ai-summary";
import { PUBLIC_AI_INSIGHT } from "../data/mock";
import styles from "../styles.module.css";

interface OrganizerViewProps {
  onOpenPublic: () => void;
}

const PORTAL_NAV = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: FileText, label: "Sessions" },
  { icon: Activity, label: "Activity", active: true },
  { icon: FileText, label: "Transcripts" },
  { icon: Users, label: "Users" },
];

export function OrganizerView({ onOpenPublic }: OrganizerViewProps) {
  const [search, setSearch] = useState("");
  const [activeId, setActiveId] = useState(SESSIONS[0].id);

  const filtered = SESSIONS.filter((s) =>
    s.id.toLowerCase().includes(search.toLowerCase()),
  );
  const active = SESSIONS.find((s) => s.id === activeId) ?? SESSIONS[0];

  return (
    <div className="flex min-h-0 w-full flex-1 overflow-hidden">
      {/* Portal side nav */}
      <div className="flex w-[180px] flex-shrink-0 flex-col overflow-y-auto border-r border-[#e3e6e8] bg-white py-2">
        {PORTAL_NAV.map((n) => {
          const Icon = n.icon;
          return (
            <div
              key={n.label}
              className={`flex cursor-pointer items-center gap-2.5 px-4 py-2.5 text-[13px] font-medium transition ${
                n.active
                  ? "bg-[#0063cc] font-semibold text-white"
                  : "text-[#646e78] hover:bg-[#eef0f2] hover:text-[#121416]"
              }`}
            >
              <Icon className="h-[18px] w-[18px] flex-shrink-0" />
              {n.label}
            </div>
          );
        })}
      </div>

      {/* Session list */}
      <div className="flex w-[280px] flex-shrink-0 flex-col overflow-hidden border-r border-[#e3e6e8] bg-white">
        <div className="flex-shrink-0 border-b border-[#e3e6e8] p-4">
          <div className="mb-2 text-sm font-semibold text-[#121416]">Activity</div>
          <div className="flex items-center gap-1.5 rounded-md border border-[#e3e6e8] bg-[#f8f9fa] px-2.5 py-1.5">
            <Search className="h-3.5 w-3.5 flex-shrink-0 text-[#9ba3ab]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search sessions…"
              className="w-full bg-transparent text-xs text-[#121416] outline-none"
            />
          </div>
        </div>
        <div className={`flex-1 overflow-y-auto ${styles.thinScroll}`}>
          {filtered.map((s) => {
            const isActive = s.id === activeId;
            return (
              <div
                key={s.id}
                onClick={() => setActiveId(s.id)}
                className={`cursor-pointer border-b border-[#e3e6e8] px-4 py-3 transition hover:bg-[#f8f9fa] ${
                  isActive ? "border-l-[3px] border-l-[#0063cc] bg-[#f0f7ff] pl-[13px]" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`text-[13px] font-semibold ${isActive ? "text-[#0051a8]" : "text-[#121416]"}`}>
                    {s.id}
                  </div>
                  {s.highlights && (
                    <span className="inline-flex items-center gap-1 rounded-[3px] border border-[#b2d8ff] bg-[#f0f7ff] px-1.5 py-0.5 text-[10px] font-semibold text-[#0051a8]">
                      <Highlighter className="h-2.5 w-2.5" />
                      {s.highlights.toLocaleString()}
                    </span>
                  )}
                </div>
                <div className="mt-0.5 text-[11px] text-[#646e78]">
                  {s.date} · {s.time}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-3">
                  <span className="text-[11px] text-[#646e78]">{s.durationMins} mins</span>
                  <span className="text-[11px] text-[#646e78]">{s.attendees} attendees</span>
                  <span className="rounded-[3px] bg-[#e6f6ec] px-1.5 py-0.5 text-[10px] font-semibold text-[#0a7b3f]">
                    {s.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Session detail */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#f8f9fa]">
        <div className="flex flex-shrink-0 items-start justify-between border-b border-[#e3e6e8] bg-white px-5 py-4">
          <div>
            <div className="mb-1 text-lg font-bold tracking-[0.02em] text-[#121416]">{active.id}</div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#646e78]">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3 text-[#9ba3ab]" />
                {active.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-[#9ba3ab]" />
                {active.time}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3 text-[#9ba3ab]" />
                {active.attendees} attendees
              </span>
              <span className="rounded-[3px] border border-[#c5e8d2] bg-[#e6f6ec] px-1.5 py-0.5 text-[10px] font-semibold text-[#0a7b3f]">
                {active.status}
              </span>
            </div>
          </div>
          <div className="flex flex-shrink-0 items-center gap-2">
            <button className="flex items-center gap-1.5 rounded-md border border-[#cdd2d7] bg-white px-3 py-1.5 text-xs font-medium text-[#646e78] hover:bg-[#f8f9fa]">
              <FileText className="h-3 w-3" /> Transcript
            </button>
            <button
              onClick={onOpenPublic}
              className="flex items-center gap-1.5 rounded-md border border-[#75b8ff] bg-[#f0f7ff] px-3 py-1.5 text-xs font-medium text-[#0051a8] hover:bg-[#d6eaff]"
            >
              <Highlighter className="h-3 w-3" /> Public summary
            </button>
            <button className="flex items-center gap-1.5 rounded-md border border-[#cdd2d7] bg-white px-3 py-1.5 text-xs font-medium text-[#646e78] hover:bg-[#f8f9fa]">
              <MoreHorizontal className="h-3 w-3" />
            </button>
          </div>
        </div>

        <div className={`flex-1 overflow-y-auto p-5 ${styles.thinScroll}`}>
          {/* Usage + languages cards */}
          <div className="mb-3.5 grid grid-cols-1 gap-3.5 lg:grid-cols-2">
            <div className="overflow-hidden rounded-[10px] border border-[#e3e6e8] bg-white">
              <div className="flex items-center justify-between border-b border-[#e3e6e8] px-4 py-3">
                <div className="flex items-center gap-2 text-[13px] font-semibold text-[#121416]">
                  <span className="flex h-[26px] w-[26px] items-center justify-center rounded-md border border-[#e3e6e8] bg-[#f8f9fa]">
                    <Activity className="h-[13px] w-[13px] text-[#646e78]" />
                  </span>
                  Usage summary
                </div>
              </div>
              <div className="px-4 py-3.5">
                {[
                  ["Status", "Completed", true],
                  ["Start time", "10:00 AM PST"],
                  ["Duration", "1h 18m"],
                  ["Minutes used", "312"],
                  ["Attendees", "247"],
                  ["Presenter language", "English (US)"],
                  ["Attendee languages", "7 languages"],
                ].map(([label, value, ok], i, arr) => (
                  <div
                    key={String(label)}
                    className={`flex items-center justify-between py-1.5 text-xs ${
                      i < arr.length - 1 ? "border-b border-[#e3e6e8]" : ""
                    }`}
                  >
                    <span className="text-[#646e78]">{label}</span>
                    <span className={`font-medium ${ok ? "text-[#0a7b3f]" : "text-[#121416]"}`}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-[10px] border border-[#e3e6e8] bg-white">
              <div className="flex items-center justify-between border-b border-[#e3e6e8] px-4 py-3">
                <div className="flex items-center gap-2 text-[13px] font-semibold text-[#121416]">
                  <span className="flex h-[26px] w-[26px] items-center justify-center rounded-md border border-[#e3e6e8] bg-[#f8f9fa]">
                    <Globe className="h-[13px] w-[13px] text-[#646e78]" />
                  </span>
                  Attendee languages
                </div>
                <span className="text-[11px] text-[#9ba3ab]">7 languages</span>
              </div>
              <div className="flex flex-col gap-2.5 p-4">
                {LANG_BARS.map((l) => (
                  <div key={l.name} className="flex flex-col gap-1">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs font-medium text-[#121416]">{l.name}</span>
                      <span className="text-[11px] text-[#646e78]">{l.count}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded bg-[#eef0f2]">
                      <div className="h-full rounded" style={{ width: `${l.pct}%`, background: l.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Engagement card */}
          <div className="overflow-hidden rounded-[10px] border border-[#b2d8ff] bg-white">
            <div className="flex items-center gap-2 border-b border-[#b2d8ff] bg-[#f0f7ff] px-4 py-3">
              <span className="flex h-[26px] w-[26px] items-center justify-center rounded-md border border-[#75b8ff] bg-[#d6eaff]">
                <Highlighter className="h-[13px] w-[13px] text-[#0063cc]" />
              </span>
              <span className="flex-1 text-[13px] font-semibold text-[#121416]">Audience engagement</span>
              <span className="inline-flex rounded-[3px] border border-[#84f1a2] bg-[#daf8e5] px-1.5 py-0.5 text-[10px] font-bold tracking-[0.04em] text-[#0f802f]">
                NEW
              </span>
            </div>
            <div className="flex flex-col gap-3 px-4 py-3.5">
              <div className="grid grid-cols-3 gap-2">
                {[
                  ["Attendees who highlighted", "168", "68% of attendees"],
                  ["Total highlights", "2,241", "Avg 13.3 per person"],
                  ["Engagement", "High", "Top 10% of sessions", true],
                ].map(([label, value, sub, hi]) => (
                  <div key={String(label)} className="rounded-[7px] border border-[#e3e6e8] bg-[#f8f9fa] px-3 py-2.5">
                    <div className="mb-1.5 text-[10px] font-medium leading-tight text-[#646e78]">{label}</div>
                    <div className={`text-xl font-bold leading-none ${hi ? "text-base text-[#0a7b3f]" : "text-[#121416]"}`}>
                      {value}
                    </div>
                    <div className="mt-0.5 text-[10px] text-[#9ba3ab]">{sub}</div>
                  </div>
                ))}
              </div>

              <div className="h-px bg-[#e3e6e8]" />
              <div>
                <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#646e78]">
                  Highlights over time
                </div>
                <HighlightsChart height={90} />
                <div className="mt-1 flex justify-between text-[10px] text-[#9ba3ab]">
                  <span>10:00 AM</span>
                  <span>10:26 AM</span>
                  <span>10:52 AM</span>
                  <span>11:18 AM</span>
                </div>
              </div>

              <div className="h-px bg-[#e3e6e8]" />
              <div>
                <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#646e78]">
                  Most-highlighted moments
                </div>
                {TOP_MOMENTS.map((m, i, arr) => (
                  <div
                    key={m.rank}
                    className={`flex items-start gap-2 py-1.5 text-xs ${i < arr.length - 1 ? "border-b border-[#e3e6e8]" : ""}`}
                  >
                    <div
                      className={`mt-px flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded text-[10px] font-bold ${
                        m.rank === 1
                          ? "border border-[#b2d8ff] bg-[#f0f7ff] text-[#0051a8]"
                          : "border border-[#e3e6e8] bg-[#eef0f2] text-[#646e78]"
                      }`}
                    >
                      {m.rank}
                    </div>
                    <div className="flex-1 leading-snug text-[#121416]">{m.text}</div>
                    <div className="flex-shrink-0 whitespace-nowrap rounded border border-[#b2d8ff] bg-[#f0f7ff] px-1.5 py-0.5 text-[11px] font-semibold text-[#0051a8]">
                      {m.count}
                    </div>
                  </div>
                ))}
              </div>

              <div className="h-px bg-[#e3e6e8]" />
              <div>
                <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#646e78]">
                  Audience reactions <span className="font-normal text-[#9ba3ab]">847 total</span>
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

              <div className="h-px bg-[#e3e6e8]" />
              <AiSummary text={PUBLIC_AI_INSIGHT} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
