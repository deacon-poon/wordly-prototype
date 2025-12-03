"use client";

import React, { useState } from "react";
import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  ArrowLeft,
  Globe,
  Download,
  Share2,
  Copy,
  Check,
  Play,
  Pause,
  ChevronDown,
  FileText,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Data interfaces
interface TranscriptSegment {
  id: string;
  timestamp: string;
  speaker: string;
  text: string;
}

interface SessionTranscript {
  id: string;
  title: string;
  presenters: string[];
  scheduledDate: string;
  scheduledStart: string;
  endTime: string;
  stageName: string;
  eventName: string;
  eventSlug: string;
  summary: string;
  keyTakeaways: string[];
  transcript: TranscriptSegment[];
}

// Helper function
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
}

// Mock data generator
function getMockTranscriptData(eventSlug: string, sessionId: string): SessionTranscript {
  const transcriptSegments: TranscriptSegment[] = [
    {
      id: "seg-001",
      timestamp: "00:00",
      speaker: "Dr. Sarah Chen",
      text: "Good morning everyone, and thank you for joining us for this opening keynote. I'm thrilled to be here today to discuss what I believe is one of the most transformative periods in technology history.",
    },
    {
      id: "seg-002",
      timestamp: "00:15",
      speaker: "Dr. Sarah Chen",
      text: "Over the next hour, we're going to explore three key themes that I believe will define the next decade of technological advancement. These are: the democratization of AI tools, the shift toward sustainable computing, and the growing importance of human-AI collaboration.",
    },
    {
      id: "seg-003",
      timestamp: "00:42",
      speaker: "Dr. Sarah Chen",
      text: "Let's start with democratization. Five years ago, working with large language models required significant technical expertise and substantial computational resources. Today, any developer can integrate powerful AI capabilities into their applications with just a few lines of code.",
    },
    {
      id: "seg-004",
      timestamp: "01:08",
      speaker: "Dr. Sarah Chen",
      text: "This democratization has profound implications. We're seeing AI being applied in fields that were previously untouched by this technology. Healthcare, education, agriculture, small businesses - the barriers to entry have essentially disappeared.",
    },
    {
      id: "seg-005",
      timestamp: "01:35",
      speaker: "Dr. Sarah Chen",
      text: "But with this democratization comes responsibility. As AI tools become more accessible, we must ensure that they're being used ethically and responsibly. This brings me to a critical point about governance and oversight.",
    },
    {
      id: "seg-006",
      timestamp: "02:01",
      speaker: "Dr. Sarah Chen",
      text: "Organizations need to establish clear frameworks for AI usage. This isn't just about compliance - it's about building trust with your users and stakeholders. The companies that get this right will have a significant competitive advantage.",
    },
    {
      id: "seg-007",
      timestamp: "02:28",
      speaker: "Dr. Sarah Chen",
      text: "Now, let's talk about sustainable computing. The computational requirements of modern AI systems are enormous. Training a single large language model can consume as much energy as several households use in a year.",
    },
    {
      id: "seg-008",
      timestamp: "02:55",
      speaker: "Dr. Sarah Chen",
      text: "This is not sustainable. The industry is responding with innovations in hardware efficiency, algorithmic optimization, and renewable energy adoption. We're seeing a shift toward smaller, more efficient models that can run on edge devices.",
    },
    {
      id: "seg-009",
      timestamp: "03:22",
      speaker: "Dr. Sarah Chen",
      text: "The concept of 'right-sizing' your AI is becoming crucial. Not every task requires a 100-billion parameter model. Often, a well-tuned smaller model can achieve comparable results with a fraction of the computational cost.",
    },
    {
      id: "seg-010",
      timestamp: "03:48",
      speaker: "Dr. Sarah Chen",
      text: "Finally, let's discuss human-AI collaboration. This is perhaps the most exciting and nuanced topic. The question is no longer 'Will AI replace humans?' but rather 'How can humans and AI work together most effectively?'",
    },
    {
      id: "seg-011",
      timestamp: "04:15",
      speaker: "Dr. Sarah Chen",
      text: "I predict that by 2030, AI assistants will be standard in every knowledge worker's toolkit. But these assistants won't replace human creativity and judgment - they'll amplify them.",
    },
    {
      id: "seg-012",
      timestamp: "04:41",
      speaker: "Dr. Sarah Chen",
      text: "Think about how we use calculators today. No one considers it 'cheating' to use a calculator for complex arithmetic. AI tools will become similarly ubiquitous - essential aids that free us to focus on higher-level thinking.",
    },
    {
      id: "seg-013",
      timestamp: "05:08",
      speaker: "Dr. Sarah Chen",
      text: "The key skill for the future isn't just technical proficiency with AI tools. It's the ability to effectively collaborate with AI - to know when to rely on it, when to override it, and how to combine its capabilities with human insight.",
    },
    {
      id: "seg-014",
      timestamp: "05:35",
      speaker: "Dr. Sarah Chen",
      text: "Let me share a concrete example. In our research lab, we've been experimenting with AI-assisted scientific discovery. The AI doesn't replace scientists - it helps them explore hypothesis spaces more efficiently.",
    },
    {
      id: "seg-015",
      timestamp: "06:02",
      speaker: "Dr. Sarah Chen",
      text: "Our researchers generate ideas, the AI helps evaluate and refine them, and together they arrive at insights that neither could have reached alone. This is the future of human-AI collaboration.",
    },
    {
      id: "seg-016",
      timestamp: "06:28",
      speaker: "Dr. Sarah Chen",
      text: "Now, I want to open up for some questions from the audience. We have about twenty minutes before we need to wrap up. Yes, the gentleman in the blue shirt.",
    },
    {
      id: "seg-017",
      timestamp: "06:45",
      speaker: "Audience Member",
      text: "Thank you, Dr. Chen. I'm curious about your thoughts on AI regulation. Do you think government oversight will help or hinder innovation in this space?",
    },
    {
      id: "seg-018",
      timestamp: "07:02",
      speaker: "Dr. Sarah Chen",
      text: "That's a great question, and it's one I've thought about extensively. I believe thoughtful regulation can actually accelerate innovation by establishing clear rules of the road.",
    },
    {
      id: "seg-019",
      timestamp: "07:25",
      speaker: "Dr. Sarah Chen",
      text: "The key word there is 'thoughtful.' Overly prescriptive regulations that can't adapt to rapidly changing technology would indeed be harmful. But principles-based frameworks that establish ethical guardrails while leaving room for innovation - those can be incredibly valuable.",
    },
    {
      id: "seg-020",
      timestamp: "07:52",
      speaker: "Dr. Sarah Chen",
      text: "We've seen this work in other industries. Financial services, healthcare, aviation - these are all heavily regulated industries that continue to innovate. The same can be true for AI.",
    },
    {
      id: "seg-021",
      timestamp: "08:18",
      speaker: "Audience Member 2",
      text: "Dr. Chen, you mentioned sustainable computing. What specific technologies do you think will have the biggest impact on reducing AI's environmental footprint?",
    },
    {
      id: "seg-022",
      timestamp: "08:35",
      speaker: "Dr. Sarah Chen",
      text: "Several technologies are showing promise. Neuromorphic computing - chips that mimic the brain's architecture - can be orders of magnitude more efficient than traditional GPUs for certain AI workloads.",
    },
    {
      id: "seg-023",
      timestamp: "08:58",
      speaker: "Dr. Sarah Chen",
      text: "There's also exciting work in sparse attention mechanisms and mixture-of-experts models that activate only the relevant parts of a network for each input. This dramatically reduces computational requirements.",
    },
    {
      id: "seg-024",
      timestamp: "09:22",
      speaker: "Dr. Sarah Chen",
      text: "And we can't overlook the importance of software optimization. Better training algorithms, more efficient data pipelines, and smarter caching strategies can all contribute to significant energy savings.",
    },
    {
      id: "seg-025",
      timestamp: "09:48",
      speaker: "Dr. Sarah Chen",
      text: "Thank you all for your excellent questions. As we wrap up, I want to leave you with one final thought. We are at an inflection point in the history of technology.",
    },
    {
      id: "seg-026",
      timestamp: "10:08",
      speaker: "Dr. Sarah Chen",
      text: "The decisions we make today - as researchers, developers, business leaders, and policymakers - will shape how AI develops for generations to come. Let's make those decisions wisely.",
    },
    {
      id: "seg-027",
      timestamp: "10:28",
      speaker: "Dr. Sarah Chen",
      text: "Thank you for your attention, and I look forward to continued conversations throughout this conference. Enjoy the rest of your day.",
    },
  ];

  return {
    id: sessionId,
    title: "Opening Keynote: The Future of Technology",
    presenters: ["Dr. Sarah Chen"],
    scheduledDate: new Date().toISOString().split("T")[0],
    scheduledStart: "9:00 AM",
    endTime: "10:30 AM",
    stageName: "Main Hall",
    eventName: "AI & Machine Learning Summit 2024",
    eventSlug: eventSlug,
    summary:
      "Dr. Chen opened the conference with a compelling vision of technology's trajectory over the next decade. She emphasized three key themes: the democratization of AI tools, the shift toward sustainable computing, and the growing importance of human-AI collaboration. The keynote highlighted how organizations must adapt their strategies to leverage emerging technologies while maintaining ethical considerations.",
    keyTakeaways: [
      "AI tools are becoming democratized, enabling applications across healthcare, education, agriculture, and small businesses",
      "Sustainable computing requires 'right-sizing' AI models - not every task needs massive models",
      "By 2030, AI assistants will be standard tools for knowledge workers, amplifying rather than replacing human capabilities",
      "Effective human-AI collaboration is the key skill for the future workforce",
      "Thoughtful, principles-based regulation can accelerate innovation by establishing clear ethical guardrails",
    ],
    transcript: transcriptSegments,
  };
}

// Copy button component
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopy}
      className="h-8 px-3"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 mr-1.5" />
          Copied
        </>
      ) : (
        <>
          <Copy className="h-4 w-4 mr-1.5" />
          Copy
        </>
      )}
    </Button>
  );
}

// Transcript segment component
function TranscriptSegment({
  segment,
  isHighlighted,
}: {
  segment: TranscriptSegment;
  isHighlighted: boolean;
}) {
  return (
    <div
      className={`py-4 px-4 rounded-lg transition-colors ${
        isHighlighted ? "bg-primary-teal-50 border-l-4 border-primary-teal-500" : "hover:bg-gray-50"
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-16 text-sm font-mono text-primary-teal-600 pt-0.5">
          {segment.timestamp}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-gray-900 mb-1">
            {segment.speaker}
          </div>
          <p className="text-gray-700 leading-relaxed">{segment.text}</p>
        </div>
      </div>
    </div>
  );
}

export default function TranscriptPage({
  params,
}: {
  params: Promise<{ eventSlug: string; sessionId: string }>;
}) {
  const resolvedParams = use(params);
  const [language, setLanguage] = useState("en");
  const [activeSegment, setActiveSegment] = useState<string | null>(null);

  // Get mock transcript data
  const session = getMockTranscriptData(
    resolvedParams.eventSlug,
    resolvedParams.sessionId
  );

  // Format full transcript for copy
  const fullTranscriptText = session.transcript
    .map((seg) => `[${seg.timestamp}] ${seg.speaker}: ${seg.text}`)
    .join("\n\n");

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <Image
            src="/asset/wordly-logo-teal-with-container.png"
            alt="Wordly"
            width={100}
            height={28}
            className="h-7 w-auto"
          />
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[140px] h-8 border-gray-200">
              <Globe className="h-4 w-4 mr-2 text-gray-500" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Español</SelectItem>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="de">Deutsch</SelectItem>
              <SelectItem value="zh">中文</SelectItem>
              <SelectItem value="ja">日本語</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      {/* Back Link & Session Header */}
      <div className="border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <Link
            href={`/public/${session.eventSlug}`}
            className="inline-flex items-center gap-2 text-primary-teal-600 hover:text-primary-teal-700 font-medium text-sm mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {session.eventName}
          </Link>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            {session.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
            <div className="flex items-center gap-1.5">
              <User className="h-4 w-4 text-primary-teal-600" />
              <span>{session.presenters.join(", ")}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-primary-teal-600" />
              <span>{formatDate(session.scheduledDate)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-primary-teal-600" />
              <span>
                {session.scheduledStart} - {session.endTime}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-primary-teal-600" />
              <span>{session.stageName}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="h-9">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button variant="outline" size="sm" className="h-9">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <CopyButton text={fullTranscriptText} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - AI Summary */}
          <div className="lg:col-span-1 space-y-6">
            {/* Summary Card */}
            <div className="bg-gradient-to-br from-primary-teal-50 to-white border border-primary-teal-100 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-primary-teal-600" />
                <h2 className="font-semibold text-gray-900">AI Summary</h2>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                {session.summary}
              </p>
            </div>

            {/* Key Takeaways */}
            <div className="border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-primary-teal-600" />
                <h2 className="font-semibold text-gray-900">Key Takeaways</h2>
              </div>
              <ul className="space-y-3">
                {session.keyTakeaways.map((takeaway, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary-teal-100 text-primary-teal-700 rounded-full flex items-center justify-center text-xs font-semibold">
                      {index + 1}
                    </span>
                    <span className="text-gray-700 leading-relaxed">
                      {takeaway}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Transcript Stats */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Transcript Stats
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-2xl font-bold text-primary-teal-600">
                    {session.transcript.length}
                  </div>
                  <div className="text-gray-500">Segments</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary-teal-600">
                    ~10 min
                  </div>
                  <div className="text-gray-500">Duration</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary-teal-600">
                    {session.transcript
                      .reduce((acc, seg) => acc + seg.text.split(" ").length, 0)
                      .toLocaleString()}
                  </div>
                  <div className="text-gray-500">Words</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary-teal-600">
                    {new Set(session.transcript.map((s) => s.speaker)).size}
                  </div>
                  <div className="text-gray-500">Speakers</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Full Transcript */}
          <div className="lg:col-span-2">
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              {/* Transcript Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">Full Transcript</h2>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>Auto-generated by Wordly AI</span>
                </div>
              </div>

              {/* Transcript Content */}
              <div className="divide-y divide-gray-100">
                {session.transcript.map((segment) => (
                  <TranscriptSegment
                    key={segment.id}
                    segment={segment}
                    isHighlighted={activeSegment === segment.id}
                  />
                ))}
              </div>

              {/* Transcript Footer */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-500">
                  End of transcript • {session.transcript.length} segments •{" "}
                  {session.transcript
                    .reduce((acc, seg) => acc + seg.text.split(" ").length, 0)
                    .toLocaleString()}{" "}
                  words
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-16">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Image
                src="/asset/wordly-logo-teal-with-container.png"
                alt="Wordly"
                width={100}
                height={26}
                className="h-6 w-auto"
              />
              <span className="text-sm text-gray-500">Powered by Wordly AI</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <a href="#" className="hover:text-gray-900 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-gray-900 transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

