import type {
  LangBar,
  LangGroup,
  ReactEmoji,
  ReactionStat,
  ScriptLine,
  SessionSummary,
  TopMoment,
} from "../types";

export const REACT_EMOJIS: ReactEmoji[] = ["👍", "👎", "❤️", "❓"];

export const LANG_NAMES: Record<string, string> = {
  en: "English (US)",
  "en-GB": "English (UK)",
  "en-AU": "English (AU)",
  ar: "Arabic",
  "zh-CN": "Chinese (Simplified)",
  "zh-TW": "Chinese (Traditional)",
  "zh-HK": "Cantonese",
  nl: "Dutch",
  fr: "French",
  "fr-CA": "French (Canada)",
  de: "German",
  hi: "Hindi",
  id: "Indonesian",
  it: "Italian",
  ja: "Japanese",
  ko: "Korean",
  ms: "Malay",
  pl: "Polish",
  "pt-BR": "Portuguese (Brazil)",
  pt: "Portuguese",
  ru: "Russian",
  es: "Spanish",
  "es-MX": "Spanish (LatAm)",
  sw: "Swahili",
  tl: "Tagalog",
  ta: "Tamil",
  th: "Thai",
  tr: "Turkish",
  uk: "Ukrainian",
  ur: "Urdu",
  vi: "Vietnamese",
  af: "Afrikaans",
  sq: "Albanian",
  hy: "Armenian",
  bn: "Bengali",
  bs: "Bosnian",
  bg: "Bulgarian",
  ca: "Catalan",
  hr: "Croatian",
  cs: "Czech",
  da: "Danish",
  et: "Estonian",
  fi: "Finnish",
  ka: "Georgian",
  el: "Greek",
  gu: "Gujarati",
  ht: "Haitian Creole",
  he: "Hebrew",
  hu: "Hungarian",
  is: "Icelandic",
  ga: "Irish",
  kn: "Kannada",
  lv: "Latvian",
  lo: "Lao",
  lt: "Lithuanian",
  mk: "Macedonian",
  mt: "Maltese",
  no: "Norwegian",
  fa: "Persian",
  pa: "Punjabi",
  ro: "Romanian",
  sr: "Serbian",
  sk: "Slovak",
  sl: "Slovenian",
  sv: "Swedish",
  cy: "Welsh",
  zu: "Zulu",
};

export const LANG_GROUPS: LangGroup[] = [
  { label: "English", codes: ["en", "en-GB", "en-AU"] },
  {
    label: "Common languages",
    codes: [
      "ar", "zh-CN", "zh-TW", "zh-HK", "nl", "fr", "fr-CA", "de", "hi", "id",
      "it", "ja", "ko", "ms", "pl", "pt-BR", "pt", "ru", "es", "es-MX", "sw",
      "tl", "ta", "th", "tr", "uk", "ur", "vi",
    ],
  },
  {
    label: "Other languages",
    codes: [
      "af", "sq", "hy", "bn", "bs", "bg", "ca", "hr", "cs", "da", "et", "fi",
      "ka", "el", "gu", "ht", "he", "hu", "is", "ga", "kn", "lv", "lo", "lt",
      "mk", "mt", "no", "fa", "pa", "ro", "sr", "sk", "sl", "sv", "cy", "zu",
    ],
  },
];

export const DEMO_SCRIPT: ScriptLine[] = [
  { speaker: "Lenny Rachitsky", time: "10:02", text: 'Simon, you co-created Django, you built Datasette, you coined the term "prompt injection" — you\'ve been at the center of this AI wave longer than almost anyone. Where are we right now?' },
  { speaker: "Simon Willison", time: "10:03", text: 'November 2025 was the inflection point. That\'s when AI coding agents crossed from "mostly works" to "actually works." I don\'t think people have fully reckoned with how fast everything changed in that one month.' },
  { speaker: "Simon Willison", time: "10:04", text: "Today, probably 95% of the code that I produce, I didn't type it myself. And I've been writing software for 25 years. That number would have seemed completely absurd to me even eighteen months ago." },
  { speaker: "Lenny Rachitsky", time: "10:06", text: "So what does a day actually look like for you now? What's changed in how you work?" },
  { speaker: "Simon Willison", time: "10:07", text: "I fire up four agents in parallel. Each one is working on a different problem. I'm reviewing output, asking clarifying questions, redirecting. By 11 a.m., I am completely wiped out. It's cognitively exhausting in a way that solo coding never was." },
  { speaker: "Simon Willison", time: "10:08", text: "Using coding agents well is taking every inch of my 25 years of experience as a software engineer. You need to know what good looks like. You need to catch the subtle bugs. The agents don't know what they don't know." },
  { speaker: "Lenny Rachitsky", time: "10:10", text: 'You\'ve talked about the "dark factory" pattern — what do you mean by that?' },
  { speaker: "Simon Willison", time: "10:11", text: "A dark factory is a manufacturing plant that runs without lights — because there's nobody there. I think we're going to see a lot of software projects that are essentially dark factories. Agents building, agents reviewing, agents shipping." },
  { speaker: "Lenny Rachitsky", time: "10:13", text: "What's your approach for keeping the quality bar high when you're working this fast?" },
  { speaker: "Simon Willison", time: "10:14", text: "Red-green TDD. Write a failing test first. Then have the agent make it pass. It sounds old-fashioned but it's the best forcing function I've found. It gives the model a concrete target and gives you a clear signal when it's actually done." },
  { speaker: "Simon Willison", time: "10:15", text: "I also built the pelican benchmark — a deliberately absurd test to see if models will just hallucinate plausible-sounding answers. Most of them fail it immediately. Knowing that helps me calibrate how much to trust any given output." },
  { speaker: "Lenny Rachitsky", time: "10:17", text: "You've written a lot about prompt injection. Why does it worry you so much?" },
  { speaker: "Simon Willison", time: "10:18", text: "There's a lethal trifecta: an agent with access to private data, the ability to make outbound requests, and exposure to untrusted content. When all three are present, prompt injection becomes a serious attack vector. And most agentic systems have all three." },
  { speaker: "Simon Willison", time: "10:19", text: "My prediction is that we're going to see a Challenger disaster. Not necessarily catastrophic loss of life — but some very public, very embarrassing failure of an agentic system that everyone trusted, caused by prompt injection." },
  { speaker: "Lenny Rachitsky", time: "10:21", text: "Who's most at risk from all of this — from the pace of change?" },
  { speaker: "Simon Willison", time: "10:22", text: "Mid-career engineers. Not senior — they have enough experience to know what they don't know. Not juniors — they're used to learning fast. The dangerous zone is someone who's been doing this 5 to 10 years and thinks they've got it figured out. They're the ones the agents are going to fool." },
  { speaker: "Simon Willison", time: "10:24", text: "Code is now cheap. I want that to be a good thing. I want us to build software that is better than we were building before — more accessible, more thoughtful, more humane. But cheap code can also mean careless code. The responsibility doesn't go away just because the agent wrote it." },
];

export const PRESENTER_LANGS = [
  { name: "English (US)", active: true },
  { name: "French (FR)", active: false },
  { name: "Spanish (ES)", active: false },
];

export const PRESENTER_PARTICIPANTS = [
  { role: "Presenter", name: "Lenny Rachitsky" },
  { role: "Presenter", name: "Simon Willison" },
];

export const SESSIONS: SessionSummary[] = [
  { id: "SWAI-0402", date: "Apr 2, 2026", time: "10:00 AM", durationMins: 78, attendees: 247, highlights: 2241, status: "Completed" },
  { id: "MXQR-4422", date: "May 8, 2026", time: "2:00 PM", durationMins: 312, attendees: 84, status: "Completed" },
  { id: "PLDK-9901", date: "May 7, 2026", time: "10:30 AM", durationMins: 540, attendees: 136, status: "Completed" },
  { id: "BWRN-1155", date: "May 5, 2026", time: "3:00 PM", durationMins: 180, attendees: 52, status: "Completed" },
  { id: "ZQTF-7823", date: "May 2, 2026", time: "9:00 AM", durationMins: 624, attendees: 198, status: "Completed" },
  { id: "HNCV-3310", date: "Apr 29, 2026", time: "1:00 PM", durationMins: 288, attendees: 71, status: "Completed" },
];

export const LANG_BARS: LangBar[] = [
  { name: "English", count: 112, pct: 45.3, color: "#e74c3c" },
  { name: "Spanish", count: 48, pct: 19.4, color: "#4a90d9" },
  { name: "Portuguese", count: 35, pct: 14.2, color: "#2ecc71" },
  { name: "German", count: 22, pct: 8.9, color: "#f39c12" },
  { name: "French", count: 16, pct: 6.5, color: "#9b59b6" },
  { name: "Japanese", count: 9, pct: 3.6, color: "#e67e22" },
  { name: "Korean", count: 5, pct: 2.0, color: "#1abc9c" },
];

export const TOP_MOMENTS: TopMoment[] = [
  { rank: 1, text: "Today, probably 95% of the code that I produce, I didn't type it myself. And I've been writing software for 25 years.", count: 156 },
  { rank: 2, text: "Using coding agents well is taking every inch of my 25 years of experience as a software engineer. The agents don't know what they don't know.", count: 128 },
  { rank: 3, text: "My prediction is that we're going to see a Challenger disaster — some very public, very embarrassing failure of an agentic system caused by prompt injection.", count: 104 },
];

export const REACTION_STATS: ReactionStat[] = [
  { emoji: "👍", count: 312, pct: 37 },
  { emoji: "❤️", count: 248, pct: 29 },
  { emoji: "❓", count: 167, pct: 20 },
  { emoji: "👎", count: 120, pct: 14 },
];

/** Highlights-over-time series used by the analytics line chart. */
export const HL_CHART_DATA = [4, 9, 18, 31, 52, 74, 89, 94, 87, 72, 58, 48, 63, 81, 76, 54, 38, 21];

export const KEY_TAKEAWAYS = [
  'November 2025 was the inflection point — AI coding agents crossed from "mostly works" to "actually works," and the pace of change accelerated sharply',
  "Coding agents don't reduce the need for experience — using them well requires every bit of seniority you have to catch what they miss",
  'The "lethal trifecta" of prompt injection — private data access, outbound requests, and untrusted content — is present in most agentic systems today',
  "Code is now cheap — the responsibility is to use that abundance to build software that is more accessible and humane, not merely more",
];

export const FULL_SUMMARY = [
  'Simon Willison — Django co-creator, Datasette founder, and the person who coined the term "prompt injection" — joined Lenny Rachitsky for a wide-ranging conversation on where AI development actually stands in early 2026. Willison\'s central claim: November 2025 was the real inflection point, the month when AI coding agents stopped being impressive demos and started being genuinely useful tools for professional software engineers.',
  "Today, Willison says roughly 95% of the code he produces wasn't typed by him directly — remarkable for someone with 25 years of engineering experience. But he's careful to resist triumphalism: using agents well is cognitively demanding in a new way. He routinely runs four agents in parallel and is exhausted by 11 a.m. The work hasn't gotten easier; it's shifted from writing to reviewing, directing, and catching subtle errors that agents confidently produce.",
  'He introduced the "dark factory" concept — the idea that some software projects will run almost entirely on agentic pipelines with minimal human oversight. He finds this technically plausible and strategically unsettling. His preferred counter is test-driven development: write a failing test first, then have the agent make it pass. It keeps quality measurable and keeps humans accountable for specifying what "correct" actually means.',
  'The conversation\'s sharpest edge was on security. Willison described the "lethal trifecta" of prompt injection risk — an agent with access to private data, the ability to make outbound requests, and exposure to untrusted content. Most agentic systems exhibit all three. He predicts a Challenger-style public failure is coming: not necessarily catastrophic, but embarrassing enough to reset how the industry thinks about trust and oversight. Mid-career engineers, he warned, are most vulnerable — experienced enough to move fast but not experienced enough to know where the floor is.',
];

export const FEATURED_QUOTE = {
  text: "Today, probably 95% of the code that I produce, I didn't type it myself. And I've been writing software for 25 years. That number would have seemed completely absurd to me even eighteen months ago.",
  author: "Simon Willison",
};

export const PUBLIC_AI_INSIGHT =
  "Attendees engaged most heavily with Simon's personal experience claims — the 95% stat and the “wiped out by 11 a.m.” framing resonated far more than the abstract predictions. The Challenger disaster quote drove a secondary spike, suggesting this audience is thinking seriously about AI risk, not just capability. Highlights were densely clustered in the first 30 minutes and the final 10, with a relative lull during the TDD and benchmarking sections.";
