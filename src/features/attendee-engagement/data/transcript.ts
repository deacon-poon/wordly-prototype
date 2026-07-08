// Speakers + transcript content — ported verbatim from the Claude Design source
// ("Current version.dc.html"). This is the streaming-demo script the engine reveals
// word-by-word (see lib/useTranscriptStream.ts). `revise` marks a leading phrase that
// first streams as a rough draft translation, then re-renders into the corrected wording.

export type Speaker = { name: string; role: string; c: string; mic: string };
export type Bubble = {
  id: number;
  sp: string;
  text: string;
  ambiguous?: boolean;
  revise?: { finalHeadLen: number; draftHead: string[] };
  /** LIVE mode only: the wordly language code this phrase streamed in (spec §14 —
   *  a bubble keeps the language/direction it arrived with). Demo bubbles resolve
   *  language via the per-language snapshots instead. */
  lang?: string;
};

export const SPEAKERS: Record<string, Speaker> = {
  mod: {
    name: "Lars Eriksson",
    role: "Moderator",
    c: "var(--gray-500)",
    mic: "pod",
  },
  ao: {
    name: "Dr. Amara Okafor",
    role: "WHO · Geneva",
    c: "var(--primary-blue-600)",
    mic: "panel",
  },
  pm: {
    name: "Dr. Priya Menon",
    role: "Lancet Countdown",
    c: "var(--accent-green-700)",
    mic: "panel",
  },
  cm: {
    name: "Carlos Mendes",
    role: "Clean Air Coalition",
    c: "var(--primary-blue-400)",
    mic: "panel",
  },
};

export const TRANSCRIPT: Bubble[] = [
  {
    id: 1,
    sp: "mod",
    text: "Welcome back, everyone. This afternoon we turn to the question at the heart of this summit: financing resilient health systems in a warming world.",
  },
  {
    id: 2,
    sp: "ao",
    text: "Climate change is no longer a future risk. It is the defining health challenge of our generation, and it is already here.",
    revise: {
      finalHeadLen: 8,
      draftHead: [
        "The",
        "risk",
        "of",
        "climate",
        "change",
        "is",
        "no",
        "longer",
        "distant.",
      ],
    },
  },
  {
    id: 3,
    sp: "ao",
    text: "Every year, heat, flooding, and shifting disease patterns push tens of millions of people toward crisis.",
  },
  {
    id: 4,
    sp: "pm",
    text: "Dengue is now a European concern, not only a tropical one, and the maps are being redrawn every single season.",
    revise: {
      finalHeadLen: 6,
      draftHead: [
        "Dengue",
        "has",
        "become",
        "a",
        "seasonal",
        "worry",
        "in",
        "Europe,",
      ],
    },
  },
  {
    id: 5,
    sp: "mod",
    text: "Priya, when you brief finance ministers, what is the number that actually moves them?",
  },
  {
    id: 6,
    sp: "pm",
    text: "One figure. For every dollar invested in resilient health infrastructure, communities avoid roughly four dollars in emergency spending.",
  },
  {
    id: 7,
    sp: "ao",
    text: "Green hospitals and clean transport cut emissions and the disease burden at the very same time.",
    revise: {
      finalHeadLen: 5,
      draftHead: ["Clean", "transport", "and", "modern", "clinics"],
    },
  },
  {
    id: 8,
    sp: "cm",
    ambiguous: true,
    text: "We have the technology. What we lack is the will to redirect subsidies away from fossil fuels and toward the front line.",
  },
  {
    id: 9,
    sp: "ao",
    text: "So my ask to this room is simple. Treat the health of the planet and the health of people as one mandate.",
  },
  {
    id: 10,
    sp: "mod",
    text: "Let us widen the lens. Carlos, you work where air quality and poverty overlap. What does that look like on the ground?",
  },
  {
    id: 11,
    sp: "cm",
    text: "In the neighborhoods we serve, children grow up with asthma rates double the city average, simply because of where the highway was built.",
  },
  {
    id: 12,
    sp: "cm",
    text: "Clean air is not a luxury. It is the difference between a child finishing school and a child in and out of the emergency room.",
  },
  {
    id: 13,
    sp: "pm",
    text: "And the costs are not evenly shared. The communities least responsible for emissions almost always carry the heaviest health burden.",
    revise: {
      finalHeadLen: 4,
      draftHead: ["The", "costs", "fall", "unevenly,"],
    },
  },
  {
    id: 14,
    sp: "ao",
    text: "That is the injustice at the core of this. Vulnerability is not random; it is built by decades of policy choices.",
  },
  {
    id: 15,
    sp: "mod",
    text: "Amara, the World Health Organization has called this the greatest health threat of the century. Is that framing helping or scaring people?",
  },
  {
    id: 16,
    sp: "ao",
    text: "Fear alone paralyzes. What we need is a sense of agency, a belief that the actions we take this decade genuinely change the outcome.",
  },
  {
    id: 17,
    sp: "ao",
    text: "And they do. Every tenth of a degree we prevent translates into millions of lives that are healthier, longer, and more secure.",
  },
  {
    id: 18,
    sp: "pm",
    text: "Let me put a number on that. Limiting warming to well below two degrees could prevent hundreds of thousands of heat deaths a year by mid-century.",
  },
  {
    id: 19,
    sp: "mod",
    text: "Those numbers are staggering. But ministers tell me they live election to election, not decade to decade.",
  },
  {
    id: 20,
    sp: "pm",
    text: "Then we reframe it. Resilient health systems pay back within a single budget cycle by cutting emergency admissions and lost workdays.",
    revise: { finalHeadLen: 3, draftHead: ["So", "we", "must"] },
  },
  {
    id: 21,
    sp: "cm",
    text: "Exactly. When you cool a school with trees and ventilation instead of diesel generators, you save money in the very first summer.",
  },
  {
    id: 22,
    sp: "ao",
    text: "Prevention is the cheapest medicine we have ever discovered, and yet it is the first line item that gets cut.",
  },
  {
    id: 23,
    sp: "mod",
    text: "Why is that? If the math is this clear, what is the real barrier?",
  },
  {
    id: 24,
    sp: "cm",
    ambiguous: true,
    text: "Inertia, mostly. The savings are spread across everyone, while the costs land on a few powerful balance sheets today.",
  },
  {
    id: 25,
    sp: "pm",
    text: "And the benefits are invisible. No politician gets to cut a ribbon in front of the pandemic that never happened.",
  },
  {
    id: 26,
    sp: "ao",
    text: "So our job is to make the invisible visible: to show the asthma attack avoided, the harvest saved, the family that stayed home from the clinic.",
  },
  {
    id: 27,
    sp: "mod",
    text: "Let us talk about heat specifically. It is the quiet killer in all of this.",
  },
  {
    id: 28,
    sp: "pm",
    text: "Heat is now the deadliest weather hazard in many countries, and it is the one we are least prepared for.",
    revise: {
      finalHeadLen: 5,
      draftHead: ["Heat", "kills", "more", "than", "storms,"],
    },
  },
  {
    id: 29,
    sp: "ao",
    text: "The cruelty of heat is that it targets the old, the very young, the outdoor worker. It widens every inequality we already have.",
  },
  {
    id: 30,
    sp: "cm",
    text: "A construction worker in our city loses roughly a month of wages each year now to days that are simply too hot to work safely.",
  },
  {
    id: 31,
    sp: "mod",
    text: "So what does a heat-resilient city actually look like?",
  },
  {
    id: 32,
    sp: "cm",
    text: "Shade, water, and warning. Tree canopy over every bus stop, cooling centers within a short walk, and an alert that reaches people before the danger peaks.",
  },
  {
    id: 33,
    sp: "ao",
    text: "And a named season. We give hurricanes names so people take them seriously. We should treat heat waves with the same gravity.",
  },
  {
    id: 34,
    sp: "pm",
    text: "Some cities have started naming and ranking heat waves. Early evidence shows it genuinely changes how people behave.",
    revise: {
      finalHeadLen: 6,
      draftHead: ["A", "few", "cities", "have", "begun", "ranking"],
    },
  },
  {
    id: 35,
    sp: "mod",
    text: "Let us bring in water, because flooding is the other face of this.",
  },
  {
    id: 36,
    sp: "pm",
    text: "Floods do not just drown; they poison. Contaminated water after a flood drives outbreaks of cholera and other diseases for weeks.",
  },
  {
    id: 37,
    sp: "ao",
    text: "And they sever care. A clinic underwater is a clinic that cannot deliver a baby or dialyze a patient when it matters most.",
  },
  {
    id: 38,
    sp: "cm",
    text: "We learned to build our community clinic on raised ground with its power and records above the flood line. It stayed open through the last storm.",
  },
  {
    id: 39,
    sp: "mod",
    text: "That is resilience in concrete terms. Amara, how do we scale that thinking to a national health system?",
  },
  {
    id: 40,
    sp: "ao",
    text: "You climate-proof every new facility by default, and you retrofit the critical ones first: maternity wards, dialysis units, intensive care.",
    revise: {
      finalHeadLen: 4,
      draftHead: ["You", "protect", "the", "hospitals"],
    },
  },
  {
    id: 41,
    sp: "pm",
    text: "And you make the energy clean while you are at it. A hospital running on solar keeps the lights on when the grid fails in a storm.",
  },
  {
    id: 42,
    sp: "cm",
    ambiguous: true,
    text: "We put panels on our clinic roof two years ago. During the last blackout, ours was the only building on the street with power.",
  },
  {
    id: 43,
    sp: "mod",
    text: "So the climate solution and the resilience solution are often the same solution.",
  },
  {
    id: 44,
    sp: "ao",
    text: "Almost always. That is the hopeful part of this story that gets lost in the gloom.",
  },
  {
    id: 45,
    sp: "pm",
    text: "Cutting fossil fuels cleans the air, which prevents heart attacks and strokes today, long before the climate benefit even arrives.",
  },
  {
    id: 46,
    sp: "ao",
    text: "We call it the health co-benefit, and in many countries it more than pays for the cost of climate action all on its own.",
  },
  {
    id: 47,
    sp: "mod",
    text: "If that is true, why is it not the headline of every climate negotiation?",
  },
  {
    id: 48,
    sp: "pm",
    text: "Because health and climate ministries rarely sit at the same table. The savings show up in one budget and the costs in another.",
    revise: {
      finalHeadLen: 7,
      draftHead: ["Because", "the", "two", "sides", "almost", "never", "talk,"],
    },
  },
  {
    id: 49,
    sp: "cm",
    text: "In our experience, the moment a health minister sees the hospital bills from a heat wave, the conversation changes completely.",
  },
  {
    id: 50,
    sp: "mod",
    text: "Let us talk about the people delivering care. Health workers are on the front line of all of this.",
  },
  {
    id: 51,
    sp: "ao",
    text: "They are exhausted. A nurse working through a heat wave with no cooling and a doubled patient load is being asked to do the impossible.",
  },
  {
    id: 52,
    sp: "pm",
    text: "And they are first responders to disasters they had no hand in causing. We owe them protection, training, and rest.",
  },
  {
    id: 53,
    sp: "cm",
    text: "Our community health workers are also our best early warning system. They know who on their street will not survive the next hot night.",
  },
  {
    id: 54,
    sp: "mod",
    text: "That local knowledge feels irreplaceable. Can technology support it without replacing it?",
  },
  {
    id: 55,
    sp: "ao",
    text: "Technology should hand the worker better tools, not a pink slip. A good forecast in the right hands saves lives; a forecast no one acts on saves none.",
    revise: {
      finalHeadLen: 5,
      draftHead: ["Technology", "must", "help", "the", "worker,"],
    },
  },
  {
    id: 56,
    sp: "pm",
    text: "Prediction is now good enough to tell a city which neighborhoods, even which blocks, will be hit hardest by the next heat wave.",
  },
  {
    id: 57,
    sp: "cm",
    ambiguous: true,
    text: "But a prediction that stays on a dashboard helps no one. It has to reach a person who can knock on a door.",
  },
  {
    id: 58,
    sp: "mod",
    text: "Let us turn to money, since that is where this began. Where does the financing actually come from?",
  },
  {
    id: 59,
    sp: "pm",
    text: "Three places: redirected fossil fuel subsidies, climate funds that finally treat health as eligible, and the savings from prevention itself.",
  },
  {
    id: 60,
    sp: "ao",
    text: "The subsidies alone are enormous. The world spends far more propping up fossil fuels than it would cost to climate-proof every hospital on earth.",
    revise: {
      finalHeadLen: 6,
      draftHead: ["The", "money", "already", "exists,", "it", "is"],
    },
  },
  {
    id: 61,
    sp: "cm",
    text: "Move a fraction of that to clean buses and shaded streets, and you would see the asthma wards empty within a few years.",
  },
  {
    id: 62,
    sp: "mod",
    text: "That sounds simple on a stage and impossible in a parliament.",
  },
  {
    id: 63,
    sp: "pm",
    text: "It is hard, but not impossible. The countries that have cut subsidies did it by giving the savings straight back to families as clean energy and care.",
  },
  {
    id: 64,
    sp: "ao",
    text: "People support change when they can feel it in their own lives: a lower bill, a cooler home, a child who breathes easier.",
  },
  {
    id: 65,
    sp: "mod",
    text: "Let us bring in the global picture. How do we keep this fair between rich and poor nations?",
  },
  {
    id: 66,
    sp: "pm",
    text: "The countries that emitted the least are paying the highest price in lives. Any honest plan has to start by naming that debt.",
    revise: {
      finalHeadLen: 5,
      draftHead: ["Those", "who", "pollute", "least", "suffer"],
    },
  },
  {
    id: 67,
    sp: "ao",
    text: "Financing must flow to where the harm lands, and it must flow as support, not as loans that deepen the next crisis.",
  },
  {
    id: 68,
    sp: "cm",
    text: "And it must reach the community, not stop at the capital. The last mile is where money turns into health, or disappears.",
  },
  { id: 69, sp: "mod", text: "How do we make sure it reaches that last mile?" },
  {
    id: 70,
    sp: "cm",
    ambiguous: true,
    text: "You fund the people who already live there. Local groups know the need, and they stay long after the visiting projects have packed up.",
  },
  {
    id: 71,
    sp: "ao",
    text: "And you measure what matters: not how much was spent, but how many people stayed healthy and how many crises never happened.",
  },
  {
    id: 72,
    sp: "pm",
    text: "Good data is its own form of justice. You cannot protect a community you have decided not to count.",
  },
  {
    id: 73,
    sp: "mod",
    text: "We have a few minutes left. I want each of you to leave this room with one practical step.",
  },
  {
    id: 74,
    sp: "cm",
    text: "Plant shade and protect the people who work outside. It is cheap, it is fast, and it saves lives this very summer.",
  },
  {
    id: 75,
    sp: "pm",
    text: "Put a health expert in every climate negotiation, and a climate expert in every health budget. The wall between them has to come down.",
    revise: {
      finalHeadLen: 6,
      draftHead: ["Bring", "the", "two", "ministries", "into", "one"],
    },
  },
  {
    id: 76,
    sp: "ao",
    text: "Treat the health of the planet and the health of people as a single account. They were never separate to begin with.",
  },
  {
    id: 77,
    sp: "mod",
    text: "Let us take a few questions from our delegates. There is a hand near the front.",
  },
  {
    id: 78,
    sp: "pm",
    text: "A wonderful question. Yes, even small island states can lead here, and many already do, far ahead of larger nations.",
    revise: {
      finalHeadLen: 7,
      draftHead: ["Yes,", "and", "the", "smallest", "nations", "often", "lead"],
    },
  },
  {
    id: 79,
    sp: "ao",
    text: "The places most exposed to this crisis are often the most innovative, because for them adaptation is not theory; it is survival.",
  },
  { id: 80, sp: "mod", text: "Another question, near the back this time." },
  {
    id: 81,
    sp: "cm",
    text: "How do we keep momentum after the conference ends? Honestly, by going home and changing one budget line, not by waiting for the next summit.",
  },
  {
    id: 82,
    sp: "pm",
    text: "Momentum is built locally and added up globally. Every city that acts gives the next city permission to act.",
  },
  {
    id: 83,
    sp: "mod",
    text: "We have time for one last reflection from each of you.",
  },
  {
    id: 84,
    sp: "ao",
    ambiguous: true,
    text: "I have spent my career in this field, and for the first time the solutions are clearer than the obstacles. That is reason for hope.",
  },
  {
    id: 85,
    sp: "pm",
    text: "The evidence is overwhelming and it points one way. What we are missing is not knowledge; it is the courage to spend it.",
  },
  {
    id: 86,
    sp: "cm",
    text: "I think of the children on our street. They did not cause this, and they are watching to see whether we meant any of it.",
  },
  {
    id: 87,
    sp: "mod",
    text: "That is a powerful place to land. Before we close, what gives each of you the most genuine optimism?",
  },
  {
    id: 88,
    sp: "ao",
    text: "The young clinicians. They refuse to separate the health of their patients from the health of the world those patients live in.",
  },
  {
    id: 89,
    sp: "pm",
    text: "The data finally catching up to the lived reality, so that no one can pretend not to know any longer.",
    revise: {
      finalHeadLen: 4,
      draftHead: ["The", "numbers", "finally", "matching"],
    },
  },
  {
    id: 90,
    sp: "cm",
    text: "My neighbors. When we put up the first shade structure, the whole block came out to help. People want to be part of the fix.",
  },
  {
    id: 91,
    sp: "mod",
    text: "And what is the one thing you would ask of the people listening to this session right now?",
  },
  {
    id: 92,
    sp: "ao",
    text: "Carry the health argument into every room you enter. It is the argument that turns a distant threat into a personal one.",
    revise: {
      finalHeadLen: 5,
      draftHead: ["Take", "this", "message", "everywhere", "you"],
    },
  },
  {
    id: 93,
    sp: "pm",
    text: "Fund prevention as if it were treatment, because it is the most effective treatment we will ever have.",
  },
  {
    id: 94,
    sp: "cm",
    text: "And listen to the communities living this every day. The expertise you need is already on the ground, waiting to be asked.",
  },
  {
    id: 95,
    sp: "mod",
    text: "Thank you all. I think we have shown that the health lens does not shrink the climate challenge; it makes it human.",
  },
  {
    id: 96,
    sp: "ao",
    text: "It makes it urgent and it makes it winnable in the same breath. That combination is rare and we should use it.",
  },
  {
    id: 97,
    sp: "pm",
    text: "Every fraction of a degree is measured in lives. That is the scoreboard that should guide every decision from here.",
  },
  {
    id: 98,
    sp: "cm",
    text: "And every shaded street and clean bus is a vote for those lives. Change is built one block at a time.",
  },
  {
    id: 99,
    sp: "mod",
    text: "On that note, please join me in thanking our extraordinary panel for a genuinely hopeful conversation.",
  },
  {
    id: 100,
    sp: "mod",
    text: "We will break for fifteen minutes and reconvene for the working sessions. Thank you, all of you, for being here.",
  },
];

export const SPK = (b: Bubble): Speaker =>
  SPEAKERS[b.sp as keyof typeof SPEAKERS];

/** Words revealed for a bubble once fully streamed (accounts for draft→final swap). */
export function revealLen(b: Bubble): number {
  const w = b.text.split(" ").length;
  if (!b.revise) return w;
  return b.revise.draftHead.length + (w - b.revise.finalHeadLen);
}

export const clamp = (t: string, n = 92): string =>
  t.length > n ? t.slice(0, n - 1).trim() + "…" : t;

// ── Caption language switch (prototype) ────────────────────────────────────────
// The demo "feed" can serve the captions in Arabic (data/transcript-ar.ts) to mock
// the RTL experience end-to-end. The exported TRANSCRIPT/SPEAKERS are swapped IN
// PLACE, so every consumer re-reads the active language on its next render — the
// same shape as the real attend feed changing caption language mid-session. Saved
// highlight ids and the stream position stay valid because ids/order are identical.

import { TRANSCRIPT_AR, SPEAKER_NAMES_AR } from "./transcript-ar";
import { TRANSCRIPT_HE, SPEAKER_NAMES_HE } from "./transcript-he";

const TRANSCRIPT_EN: Bubble[] = TRANSCRIPT.map((b) => ({ ...b }));
const SPEAKER_NAMES_EN: Record<string, { name: string; role: string }> =
  Object.fromEntries(
    Object.entries(SPEAKERS).map(([k, s]) => [
      k,
      { name: s.name, role: s.role },
    ])
  );

export type TranscriptLang = "en" | "ar" | "he";
const SOURCES: Record<
  TranscriptLang,
  { script: Bubble[]; names: Record<string, { name: string; role: string }> }
> = {
  en: { script: TRANSCRIPT_EN, names: SPEAKER_NAMES_EN },
  ar: { script: TRANSCRIPT_AR, names: SPEAKER_NAMES_AR },
  he: { script: TRANSCRIPT_HE, names: SPEAKER_NAMES_HE },
};

let activeLang: TranscriptLang = "en";
export const getTranscriptLang = () => activeLang;

export function setTranscriptLang(l: TranscriptLang) {
  if (l === activeLang) return;
  activeLang = l;
  const { script, names } = SOURCES[l];
  TRANSCRIPT.splice(0, TRANSCRIPT.length, ...script.map((b) => ({ ...b })));
  for (const k of Object.keys(SPEAKERS)) {
    SPEAKERS[k].name = names[k].name;
    SPEAKERS[k].role = names[k].role;
  }
}

// ── Per-bubble caption language (spec §14) ──────────────────────────────────────
// So a mid-session language switch affects only bubbles that stream AFTER it (mixing
// LTR + RTL in one session), each bubble is rendered from the language it was streamed
// in. These accessors expose the stable per-language snapshots (setTranscriptLang
// copies OUT of these and never mutates them), keyed by the shared bubble ids/order.
export const scriptFor = (l: TranscriptLang): Bubble[] => SOURCES[l].script;
export const speakerNameFor = (
  l: TranscriptLang,
  sp: string
): { name: string; role: string } => SOURCES[l].names[sp];
export const isCaptionRTL = (l: TranscriptLang): boolean =>
  l === "ar" || l === "he";
