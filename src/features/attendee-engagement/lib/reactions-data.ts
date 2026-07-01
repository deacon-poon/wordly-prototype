// Icon path data + the five reactions — ported verbatim from the Claude Design source.
/* eslint-disable */

export const ICON = {
  check: "M5 12.5l4.2 4.2L19 7",
  plus: "M12 5v14M5 12h14",
  x: "M6 6l12 12M18 6L6 18",
  chevron: "M6 9l6 6 6-6",
  x2: "M6 6l12 12M18 6L6 18",
  globe:
    "M12 3a9 9 0 100 18 9 9 0 000-18M3.5 9.5h17M3.5 14.5h17M12 3c2.6 2.6 2.6 15.4 0 18M12 3c-2.6 2.6-2.6 15.4 0 18",
  languages: "m5 8 6 6M4 14l6-6 2-3M2 5h12M7 2h1m14 20-5-10-5 10M14 18h6",
  speaker: "M4 9.5v5h3.5L12 18.5V5.5L7.5 9.5zM15.5 9a4 4 0 010 6",
  star: "M12 4.2l2.1 4.9 5.3.5-4 3.5 1.2 5.2L12 15.7 7.4 18.3l1.2-5.2-4-3.5 5.3-.5z",
  bookmark: "M6 4h12v16l-6-3.6L6 20z",
  flag: "M6 3v18M6 4h11l-2.2 4L17 12H6",
  note: "M5 4h10l4 4v12H5zM15 4v4h4",
  highlighter: "M5 19h14M8.5 15l7.2-7.2 3 3L11.5 18H8.5z",
  send: "M4 12l16-7-6.5 16-2.2-6.8z",
  thumbup:
    "M7 21V10M3 12.5v6.5a2 2 0 002 2h2V10H5a2 2 0 00-2 2.5zM7 10l4.2-7.2c1.3-.2 2.3.8 2.1 2L12.6 9h5.1a2 2 0 011.95 2.45l-1.6 7A2 2 0 0116.1 21H7",
  thumbdown:
    "M17 3v11M21 11.5V5a2 2 0 00-2-2h-2v11h2a2 2 0 002-2.5zM17 14l-4.2 7.2c-1.3.2-2.3-.8-2.1-2L11.4 15H6.3a2 2 0 01-1.95-2.45l1.6-7A2 2 0 017.9 3H17",
  arrowup: "M12 19V5M6 11l6-6 6 6",
  arrowdown: "M12 5v14M6 13l6 6 6-6",
  tag: "M3 7v4.6c0 .5.2 1 .6 1.4l7.4 7.4a2 2 0 002.8 0l4.6-4.6a2 2 0 000-2.8L11 5.6a2 2 0 00-1.4-.6H5a2 2 0 00-2 2z",
  // Lucide reaction icons (combined subpaths)
  lThumbUp:
    "M7 10v12M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a2 2 0 0 1 2 2z",
  lThumbDown:
    "M17 14V2M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a2 2 0 0 1-2-2z",
  lBulb:
    "M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5M9 18h6M10 22h4",
  lHelp:
    "M7.9 20A9 9 0 1 0 4 16.1L2 22ZM9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01",
  lBookmark: "M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z",
  ellipsisV: "M12 5h.01M12 12h.01M12 19h.01",
  helpCircle:
    "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01",
  gear: "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z",
  logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  gripH:
    "M5 9h.01M9 9h.01M13 9h.01M17 9h.01M5 15h.01M9 15h.01M13 15h.01M17 15h.01",
  smilePlus:
    "M22 11v1a10 10 0 1 1-9-10M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01M16 5h6M19 2v6",
  lock: "M7 11V8a5 5 0 0 1 10 0v3M6 11h12a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1z",
  shareIos: "M12 3v13M8 7l4-4 4 4M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7",
  maximize:
    "M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3",
  minimize2:
    "M8 3v3a2 2 0 0 1-2 2H3M21 8h-3a2 2 0 0 1-2-2V3M3 16h3a2 2 0 0 1 2 2v3M16 21v-3a2 2 0 0 1 2-2h3",
};

export type Reaction = {
  e: string;
  icon: string;
  l: string;
  c: string;
  cbg: string;
  cbg2: string;
  cbdr: string;
};

export const REACT5 = [
  {
    e: "👍",
    icon: ICON.lThumbUp,
    l: "Agree",
    c: "var(--accent-green-700)",
    cbg: "var(--accent-green-25)",
    cbg2: "var(--accent-green-10)",
    cbdr: "var(--accent-green-400)",
  },
  {
    e: "👎",
    icon: ICON.lThumbDown,
    l: "Disagree",
    c: "var(--rare-orange-600)",
    cbg: "var(--rare-orange-25)",
    cbg2: "var(--rare-orange-10)",
    cbdr: "var(--rare-orange-300)",
  },
  {
    e: "💡",
    icon: ICON.lBulb,
    l: "Insight",
    c: "var(--amber-600)",
    cbg: "var(--amber-25)",
    cbg2: "var(--amber-10)",
    cbdr: "var(--amber-300)",
  },
  {
    e: "❓",
    icon: ICON.lHelp,
    l: "Question",
    c: "var(--violet-600)",
    cbg: "var(--violet-25)",
    cbg2: "var(--violet-10)",
    cbdr: "var(--violet-300)",
  },
  {
    e: "📌",
    icon: ICON.lBookmark,
    l: "Save",
    c: "var(--primary-blue-600)",
    cbg: "var(--primary-blue-25)",
    cbg2: "var(--primary-blue-10)",
    cbdr: "var(--border-brand)",
  },
];

// Map emoji → reaction meta. `ICON_FOR['📌']` is the plain-save state.
export const ICON_FOR: Record<string, Reaction> = {};
REACT5.forEach((r) => {
  ICON_FOR[r.e] = r;
});

// The four expressive reactions (📌 is the plain-save state, not a reaction).
export const REACT4 = REACT5.filter((r) => r.e !== "📌");
