"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PanelRight, Download, Check, Languages, FileText, MapPin } from "lucide-react";

// ============================================================================
// Types
// ============================================================================

interface TranscriptPanelProps {
  session: {
    id: string;
    title: string;
    presenters: string[];
    scheduledDate: string;
    scheduledStart: string;
    endTime: string;
    status: string;
  };
  roomName: string;
  onClose: () => void;
}

interface Utterance {
  id: string;
  speaker: string;
  text: string;
  language: string;
  languageLabel: string;
  type: "source" | "translation";
  direction: "ltr" | "rtl";
  timestamp: string;
}

// ============================================================================
// Mock Data
// ============================================================================

const MOCK_UTTERANCES: Utterance[] = [
  {
    id: "u1",
    speaker: "Dr. Sarah Chen",
    text: "Good morning everyone. Today I want to talk about the future of technology and how it will reshape our world over the next decade.",
    language: "en",
    languageLabel: "English",
    type: "source",
    direction: "ltr",
    timestamp: "09:00:12",
  },
  {
    id: "u2",
    speaker: "Dr. Sarah Chen",
    text: "\u5927\u5BB6\u65E9\u4E0A\u597D\u3002\u4ECA\u5929\u6211\u60F3\u8C08\u8C08\u6280\u672F\u7684\u672A\u6765\uFF0C\u4EE5\u53CA\u5B83\u5C06\u5982\u4F55\u5728\u672A\u6765\u5341\u5E74\u91CD\u5851\u6211\u4EEC\u7684\u4E16\u754C\u3002",
    language: "zh",
    languageLabel: "Chinese",
    type: "translation",
    direction: "ltr",
    timestamp: "09:00:12",
  },
  {
    id: "u3",
    speaker: "Dr. Sarah Chen",
    text: "\u0635\u0628\u062D \u0628\u062E\u06CC\u0631 \u0628\u0647 \u0647\u0645\u0647. \u0627\u0645\u0631\u0648\u0632 \u0645\u06CC\u200C\u062E\u0648\u0627\u0647\u0645 \u062F\u0631\u0628\u0627\u0631\u0647 \u0622\u06CC\u0646\u062F\u0647 \u0641\u0646\u0627\u0648\u0631\u06CC \u0635\u062D\u0628\u062A \u06A9\u0646\u0645 \u0648 \u0627\u06CC\u0646\u06A9\u0647 \u0686\u06AF\u0648\u0646\u0647 \u062C\u0647\u0627\u0646 \u0645\u0627 \u0631\u0627 \u062F\u0631 \u062F\u0647\u0647 \u0622\u06CC\u0646\u062F\u0647 \u062A\u063A\u06CC\u06CC\u0631 \u062E\u0648\u0627\u0647\u062F \u062F\u0627\u062F.",
    language: "fa",
    languageLabel: "Farsi",
    type: "translation",
    direction: "rtl",
    timestamp: "09:00:12",
  },
  {
    id: "u4",
    speaker: "Dr. Sarah Chen",
    text: "Artificial intelligence is no longer a futuristic concept. It is here, integrated into every layer of our digital infrastructure.",
    language: "en",
    languageLabel: "English",
    type: "source",
    direction: "ltr",
    timestamp: "09:01:05",
  },
  {
    id: "u5",
    speaker: "Dr. Sarah Chen",
    text: "L\u2019intelligence artificielle n\u2019est plus un concept futuriste. Elle est l\u00E0, int\u00E9gr\u00E9e dans chaque couche de notre infrastructure num\u00E9rique.",
    language: "fr",
    languageLabel: "French",
    type: "translation",
    direction: "ltr",
    timestamp: "09:01:05",
  },
  {
    id: "u6",
    speaker: "Dr. Sarah Chen",
    text: "\u0915\u0943\u0924\u094D\u0930\u093F\u092E \u092C\u0941\u0926\u094D\u0927\u093F\u092E\u0924\u094D\u0924\u093E \u0905\u092C \u0915\u094B\u0908 \u092D\u0935\u093F\u0937\u094D\u092F\u0935\u093E\u0926\u0940 \u0905\u0935\u0927\u093E\u0930\u0923\u093E \u0928\u0939\u0940\u0902 \u0930\u0939\u0940\u0964 \u092F\u0939 \u092F\u0939\u093E\u0901 \u0939\u0948, \u0939\u092E\u093E\u0930\u0947 \u0921\u093F\u091C\u093F\u091F\u0932 \u092C\u0941\u0928\u093F\u092F\u093E\u0926\u0940 \u0922\u093E\u0902\u091A\u0947 \u0915\u0940 \u0939\u0930 \u092A\u0930\u0924 \u092E\u0947\u0902 \u0938\u092E\u093E\u0939\u093F\u0924\u0964",
    language: "hi",
    languageLabel: "Hindi",
    type: "translation",
    direction: "ltr",
    timestamp: "09:01:05",
  },
  {
    id: "u7",
    speaker: "Dr. Sarah Chen",
    text: "We are seeing breakthroughs in quantum computing that could solve problems classical computers would take millennia to crack.",
    language: "en",
    languageLabel: "English",
    type: "source",
    direction: "ltr",
    timestamp: "09:02:30",
  },
  {
    id: "u8",
    speaker: "Dr. Sarah Chen",
    text: "\u6211\u4EEC\u6B63\u5728\u89C1\u8BC1\u91CF\u5B50\u8BA1\u7B97\u7684\u7A81\u7834\uFF0C\u5B83\u53EF\u4EE5\u89E3\u51B3\u7ECF\u5178\u8BA1\u7B97\u673A\u9700\u8981\u51E0\u5343\u5E74\u624D\u80FD\u89E3\u51B3\u7684\u95EE\u9898\u3002",
    language: "zh",
    languageLabel: "Chinese",
    type: "translation",
    direction: "ltr",
    timestamp: "09:02:30",
  },
  {
    id: "u9",
    speaker: "Dr. Sarah Chen",
    text: "La informatica cu\u00E1ntica est\u00E1 logrando avances que podr\u00EDan resolver problemas que las computadoras cl\u00E1sicas tardar\u00EDan milenios en descifrar.",
    language: "es",
    languageLabel: "Spanish",
    type: "translation",
    direction: "ltr",
    timestamp: "09:02:30",
  },
  {
    id: "u10",
    speaker: "Dr. Sarah Chen",
    text: "But with great power comes great responsibility. We must address the ethical implications of these technologies.",
    language: "en",
    languageLabel: "English",
    type: "source",
    direction: "ltr",
    timestamp: "09:03:45",
  },
  {
    id: "u11",
    speaker: "Dr. Sarah Chen",
    text: "\u0627\u0645\u0627 \u0628\u0627 \u0642\u062F\u0631\u062A \u0628\u0632\u0631\u06AF\u060C \u0645\u0633\u0626\u0648\u0644\u06CC\u062A \u0628\u0632\u0631\u06AF\u06CC \u0646\u06CC\u0632 \u0645\u06CC\u200C\u0622\u06CC\u062F. \u0645\u0627 \u0628\u0627\u06CC\u062F \u0628\u0647 \u067E\u06CC\u0627\u0645\u062F\u0647\u0627\u06CC \u0627\u062E\u0644\u0627\u0642\u06CC \u0627\u06CC\u0646 \u0641\u0646\u0627\u0648\u0631\u06CC\u200C\u0647\u0627 \u0628\u067E\u0631\u062F\u0627\u0632\u06CC\u0645.",
    language: "fa",
    languageLabel: "Farsi",
    type: "translation",
    direction: "rtl",
    timestamp: "09:03:45",
  },
  {
    id: "u12",
    speaker: "Dr. Sarah Chen",
    text: "Mais un grand pouvoir implique de grandes responsabilit\u00E9s. Nous devons aborder les implications \u00E9thiques de ces technologies.",
    language: "fr",
    languageLabel: "French",
    type: "translation",
    direction: "ltr",
    timestamp: "09:03:45",
  },
  {
    id: "u13",
    speaker: "Dr. Sarah Chen",
    text: "Privacy, data sovereignty, and algorithmic bias are not just technical challenges \u2014 they are societal ones.",
    language: "en",
    languageLabel: "English",
    type: "source",
    direction: "ltr",
    timestamp: "09:04:58",
  },
  {
    id: "u14",
    speaker: "Dr. Sarah Chen",
    text: "\u0917\u094B\u092A\u0928\u0940\u092F\u0924\u093E, \u0921\u0947\u091F\u093E \u0938\u0902\u092A\u094D\u0930\u092D\u0941\u0924\u094D\u0935 \u0914\u0930 \u090F\u0932\u094D\u0917\u094B\u0930\u093F\u0926\u092E\u093F\u0915 \u092A\u0942\u0930\u094D\u0935\u093E\u0917\u094D\u0930\u0939 \u0915\u0947\u0935\u0932 \u0924\u0915\u0928\u0940\u0915\u0940 \u091A\u0941\u0928\u094C\u0924\u093F\u092F\u093E\u0901 \u0928\u0939\u0940\u0902 \u0939\u0948\u0902 \u2014 \u092F\u0947 \u0938\u093E\u092E\u093E\u091C\u093F\u0915 \u091A\u0941\u0928\u094C\u0924\u093F\u092F\u093E\u0901 \u0939\u0948\u0902\u0964",
    language: "hi",
    languageLabel: "Hindi",
    type: "translation",
    direction: "ltr",
    timestamp: "09:04:58",
  },
  {
    id: "u15",
    speaker: "Dr. Sarah Chen",
    text: "\u9690\u79C1\u3001\u6570\u636E\u4E3B\u6743\u548C\u7B97\u6CD5\u504F\u89C1\u4E0D\u4EC5\u4EC5\u662F\u6280\u672F\u6311\u6218\u2014\u2014\u5B83\u4EEC\u662F\u793E\u4F1A\u6311\u6218\u3002",
    language: "zh",
    languageLabel: "Chinese",
    type: "translation",
    direction: "ltr",
    timestamp: "09:04:58",
  },
  {
    id: "u16",
    speaker: "Dr. Sarah Chen",
    text: "Let me share three predictions for 2030. First, ambient computing will make devices invisible. Second, AI co-pilots will augment every profession.",
    language: "en",
    languageLabel: "English",
    type: "source",
    direction: "ltr",
    timestamp: "09:06:20",
  },
  {
    id: "u17",
    speaker: "Dr. Sarah Chen",
    text: "Permettez-moi de partager trois pr\u00E9dictions pour 2030. Premi\u00E8rement, l\u2019informatique ambiante rendra les appareils invisibles. Deuxi\u00E8mement, les copilotes IA augmenteront chaque profession.",
    language: "fr",
    languageLabel: "French",
    type: "translation",
    direction: "ltr",
    timestamp: "09:06:20",
  },
  {
    id: "u18",
    speaker: "Dr. Sarah Chen",
    text: "D\u00E9jenme compartir tres predicciones para 2030. Primero, la computaci\u00F3n ambiental har\u00E1 invisibles los dispositivos. Segundo, los copilotos de IA potenciar\u00E1n cada profesi\u00F3n.",
    language: "es",
    languageLabel: "Spanish",
    type: "translation",
    direction: "ltr",
    timestamp: "09:06:20",
  },
  {
    id: "u19",
    speaker: "Dr. Sarah Chen",
    text: "And third, real-time language translation will eliminate communication barriers entirely. Thank you.",
    language: "en",
    languageLabel: "English",
    type: "source",
    direction: "ltr",
    timestamp: "09:07:45",
  },
  {
    id: "u20",
    speaker: "Dr. Sarah Chen",
    text: "\u0648 \u0633\u0648\u0645\u060C \u062A\u0631\u062C\u0645\u0647 \u0647\u0645\u0632\u0645\u0627\u0646 \u0632\u0628\u0627\u0646 \u0645\u0648\u0627\u0646\u0639 \u0627\u0631\u062A\u0628\u0627\u0637\u06CC \u0631\u0627 \u06A9\u0627\u0645\u0644\u0627\u064B \u0627\u0632 \u0628\u06CC\u0646 \u062E\u0648\u0627\u0647\u062F \u0628\u0631\u062F. \u0645\u062A\u0634\u06A9\u0631\u0645.",
    language: "fa",
    languageLabel: "Farsi",
    type: "translation",
    direction: "rtl",
    timestamp: "09:07:45",
  },
];

const MOCK_SUMMARY = {
  overview:
    "Dr. Sarah Chen delivered a keynote on the trajectory of technology over the next decade, covering artificial intelligence integration, quantum computing breakthroughs, ethical considerations, and three key predictions for 2030.",
  keyTakeaways: [
    "AI is already embedded in every layer of digital infrastructure and is no longer a futuristic concept.",
    "Quantum computing breakthroughs are approaching that could solve problems intractable for classical computers.",
    "Ethical challenges including privacy, data sovereignty, and algorithmic bias must be treated as societal issues, not just technical ones.",
    "By 2030, ambient computing will make devices invisible, AI co-pilots will augment every profession, and real-time language translation will eliminate communication barriers.",
    "The intersection of technology and responsibility requires active engagement from technologists, policymakers, and citizens alike.",
  ],
  generatedAt: "2026-02-24T09:15:00Z",
};

// ============================================================================
// Helper: Language flag/tag
// ============================================================================

function LanguageTag({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-gray-400">
      <Languages className="h-3 w-3" />
      {label}
    </span>
  );
}

// ============================================================================
// Component
// ============================================================================

export function TranscriptPanel({
  session,
  roomName,
  onClose,
}: TranscriptPanelProps) {
  const [activeTab, setActiveTab] = useState<"transcript" | "summary">(
    "transcript"
  );

  const utteranceCount = MOCK_UTTERANCES.length;

  return (
    <div className="h-full flex flex-col bg-white border-l border-gray-200">
      {/* Sticky Header — matches SessionPanel layout */}
      <div className="flex-shrink-0 px-6 py-4 flex items-center justify-between bg-white sticky top-0 z-10 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary-teal-600" />
            <h2 className="text-lg font-semibold text-gray-900">Transcript</h2>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {roomName} · {session.title}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-9 w-9 p-0 hover:bg-primary-blue-50"
        >
          <PanelRight className="h-4 w-4 text-gray-600 hover:text-primary-blue-600 transition-colors" />
          <span className="sr-only">Close panel</span>
        </Button>
      </div>

      {/* Actions bar + Tabs */}
      <div className="flex-shrink-0 border-b border-gray-200 bg-white">
        {/* Actions row */}
        <div className="px-6 pt-3 pb-2 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("transcript")}
              className={`
                inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                ${
                  activeTab === "transcript"
                    ? "bg-primary-teal-600 text-white"
                    : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
                }
              `}
            >
              {activeTab === "transcript" && <Check className="h-3.5 w-3.5" />}
              Transcript
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("summary")}
              className={`
                inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                ${
                  activeTab === "summary"
                    ? "bg-primary-teal-600 text-white"
                    : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
                }
              `}
            >
              {activeTab === "summary" && <Check className="h-3.5 w-3.5" />}
              Summary
            </button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-primary-blue-50"
            aria-label="Download transcript"
          >
            <Download className="h-4 w-4 text-gray-600" />
          </Button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {activeTab === "transcript" ? (
          <TranscriptContent utterances={MOCK_UTTERANCES} />
        ) : (
          <SummaryContent />
        )}
      </div>

      {/* Sticky Footer */}
      <div className="flex-shrink-0 border-t px-6 py-4 flex justify-between items-center bg-white">
        <p className="text-xs text-gray-500">
          Utterances:{" "}
          <span className="font-medium text-gray-700">{utteranceCount}</span>
        </p>
        {activeTab === "transcript" && (
          <Button
            variant="outline"
            size="sm"
            className="text-gray-600"
            aria-label="Download transcript"
          >
            <Download className="h-4 w-4 mr-1.5" />
            Download
          </Button>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Transcript Content
// ============================================================================

function TranscriptContent({ utterances }: { utterances: Utterance[] }) {
  // Group utterances by timestamp to visually cluster source + translations
  let lastTimestamp = "";

  return (
    <div className="p-6 space-y-3">
      {utterances.map((utterance) => {
        const showTimestamp = utterance.timestamp !== lastTimestamp;
        lastTimestamp = utterance.timestamp;

        return (
          <div key={utterance.id}>
            {/* Timestamp divider for new source groups */}
            {showTimestamp && utterance.type === "source" && (
              <div className="flex items-center gap-2 mb-2 mt-4 first:mt-0">
                <span className="text-[10px] font-mono text-gray-400">
                  {utterance.timestamp}
                </span>
                <div className="flex-1 border-t border-gray-100" />
              </div>
            )}

            {utterance.type === "source" ? (
              /* Source utterance: left-aligned, light bubble */
              <div className="flex flex-col items-start max-w-[85%]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-gray-800">
                    {utterance.speaker}
                  </span>
                  <LanguageTag label={utterance.languageLabel} />
                </div>
                <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-2.5">
                  <p className="text-sm text-gray-900 leading-relaxed">
                    {utterance.text}
                  </p>
                </div>
              </div>
            ) : (
              /* Translation utterance: right-aligned, dark teal bubble */
              <div className="flex flex-col items-end ml-auto max-w-[85%]">
                <div className="flex items-center gap-2 mb-1">
                  <LanguageTag label={utterance.languageLabel} />
                </div>
                <div
                  className="bg-primary-teal-600 rounded-2xl rounded-tr-sm px-4 py-2.5"
                  dir={utterance.direction}
                >
                  <p className="text-sm text-white leading-relaxed">
                    {utterance.text}
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ============================================================================
// Summary Content
// ============================================================================

function SummaryContent() {
  return (
    <div className="p-6 space-y-6">
      {/* Overview */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-2">Overview</h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          {MOCK_SUMMARY.overview}
        </p>
      </div>

      {/* Key Takeaways */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-2">
          Key Takeaways
        </h3>
        <ul className="space-y-2">
          {MOCK_SUMMARY.keyTakeaways.map((takeaway, index) => (
            <li key={index} className="flex gap-2 text-sm text-gray-700">
              <span className="text-primary-teal-600 font-bold mt-0.5 flex-shrink-0">
                &bull;
              </span>
              <span className="leading-relaxed">{takeaway}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Generated info + button */}
      <div className="pt-2 border-t border-gray-100">
        <p className="text-xs text-gray-400 mb-3">
          Summary generated on{" "}
          {new Date(MOCK_SUMMARY.generatedAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
          })}
        </p>
        <Button
          variant="outline"
          size="sm"
          disabled
          className="opacity-60 gap-1.5"
        >
          <Check className="h-3.5 w-3.5" />
          Summary Generated
        </Button>
      </div>
    </div>
  );
}
