export type ViewKey = "attendee" | "presenter" | "ended" | "organizer" | "public";

export type ReactEmoji = "👍" | "👎" | "❤️" | "❓";

export type ConnStatus = "connecting" | "live" | "demo" | "error";

export interface ScriptLine {
  speaker: string;
  time: string;
  text: string;
}

/** A finalized transcript bubble shown in the attendee feed. */
export interface TranscriptItem {
  id: number;
  speaker: string;
  text: string;
  time: string;
}

export interface LangGroup {
  label: string;
  codes: string[];
}

export interface SessionSummary {
  id: string;
  date: string;
  time?: string;
  durationMins: number;
  attendees: number;
  highlights?: number;
  status: string;
}

export interface LangBar {
  name: string;
  count: number;
  pct: number;
  color: string;
}

export interface TopMoment {
  rank: number;
  text: string;
  count: number;
}

export interface ReactionStat {
  emoji: string;
  count: number;
  pct: number;
}
