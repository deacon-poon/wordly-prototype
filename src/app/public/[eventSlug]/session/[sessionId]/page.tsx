"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { use } from "react";
import {
  Calendar,
  Clock,
  ChevronLeft,
  User,
  FileText,
  Globe,
  Lightbulb,
  Quote,
  Share2,
  Copy,
  Check,
  Sparkles,
  MessageCircle,
  Target,
  BookOpen,
  HelpCircle,
  ArrowRight,
  Brain,
  Zap,
  Users,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EventChatbot } from "@/components/public/EventChatbot";

// Data interfaces
interface SessionDetail {
  id: string;
  title: string;
  presenters: string[];
  presenterBios?: { name: string; bio: string }[];
  scheduledDate: string;
  scheduledStart: string;
  endTime: string;
  duration: string;
  tldr: string;
  summary: string;
  keyTakeaways: string[];
  tags: string[];
  notableQuote?: {
    text: string;
    speaker: string;
  };
  roomName?: string;
  // AI-enhanced fields
  aiInsights: {
    sentiment:
      | "Inspirational"
      | "Technical"
      | "Practical"
      | "Strategic"
      | "Educational";
    audienceLevel: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
    keyTopics: string[];
    questionsAnswered: string[];
    suggestedFollowUp: string[];
    actionItems: string[];
    keyTerms: { term: string; definition: string }[];
    relatedSessionIds: string[];
  };
}

interface RelatedSession {
  id: string;
  title: string;
  presenters: string[];
  tags: string[];
}

const sentimentStyles: Record<string, { bg: string; icon: React.ReactNode }> = {
  Inspirational: {
    bg: "bg-amber-50 text-amber-700 border-amber-200",
    icon: <Sparkles className="h-4 w-4" />,
  },
  Technical: {
    bg: "bg-blue-50 text-blue-700 border-blue-200",
    icon: <Brain className="h-4 w-4" />,
  },
  Practical: {
    bg: "bg-green-50 text-green-700 border-green-200",
    icon: <Target className="h-4 w-4" />,
  },
  Strategic: {
    bg: "bg-purple-50 text-purple-700 border-purple-200",
    icon: <TrendingUp className="h-4 w-4" />,
  },
  Educational: {
    bg: "bg-primary-teal-50 text-primary-teal-700 border-primary-teal-200",
    icon: <BookOpen className="h-4 w-4" />,
  },
};

// Helper functions
function formatSessionDate(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
}

// Mock data
function getMockSessionData(
  sessionId: string,
  eventSlug: string
): {
  session: SessionDetail;
  event: { name: string; slug: string };
  relatedSessions: RelatedSession[];
} {
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  const sessionsMap: Record<string, SessionDetail> = {
    "ses-001": {
      id: "ses-001",
      title: "Opening Keynote: The Future of Technology",
      presenters: ["Dr. Sarah Chen"],
      presenterBios: [
        {
          name: "Dr. Sarah Chen",
          bio: "Chief AI Officer at TechCorp and former Stanford professor. Author of 'AI in the Enterprise' and advisor to Fortune 500 companies on digital transformation.",
        },
      ],
      scheduledDate: todayStr,
      scheduledStart: "9:00 AM",
      endTime: "10:30 AM",
      duration: "90 min",
      tldr: "AI assistants will be standard for knowledge workers by 2030, fundamentally changing how we approach problem-solving and creativity.",
      summary:
        "Dr. Chen opened the conference with a compelling vision of technology's trajectory over the next decade. She emphasized three key themes: the democratization of AI tools, the shift toward sustainable computing, and the growing importance of human-AI collaboration. The keynote highlighted how organizations must adapt their strategies to leverage emerging technologies while maintaining ethical considerations. Notable points included the prediction that by 2030, AI assistants will be standard in every knowledge worker's toolkit, fundamentally changing how we approach problem-solving and creativity. Dr. Chen also discussed the importance of building trust in AI systems through transparency and explainability, and how companies that embrace these principles will have a competitive advantage.",
      keyTakeaways: [
        "AI tools are becoming democratized and accessible to everyone",
        "Sustainable computing is no longer optional—it's a business imperative",
        "Human-AI collaboration will define the next era of productivity",
        "Organizations must adapt strategies while maintaining ethics",
      ],
      tags: ["AI", "Future of Work", "Strategy", "Innovation"],
      notableQuote: {
        text: "The companies that thrive in 2030 will be those that treat AI as a collaborator, not just a tool.",
        speaker: "Dr. Sarah Chen",
      },
      aiInsights: {
        sentiment: "Inspirational",
        audienceLevel: "All Levels",
        keyTopics: [
          "Artificial Intelligence",
          "Digital Transformation",
          "Human-AI Collaboration",
          "Sustainable Computing",
          "Enterprise Strategy",
        ],
        questionsAnswered: [
          "How will AI change the workplace by 2030?",
          "What skills will knowledge workers need in the AI era?",
          "How can organizations prepare for AI-driven transformation?",
          "What role does ethics play in AI adoption?",
        ],
        suggestedFollowUp: [
          "How to start an AI pilot program in my organization?",
          "What are the biggest barriers to AI adoption?",
          "How do I measure ROI on AI investments?",
          "What training should I provide my team for AI readiness?",
        ],
        actionItems: [
          "Audit current workflows for AI automation opportunities",
          "Start a cross-functional AI task force",
          "Develop an AI ethics framework for your organization",
          "Identify 3 quick-win AI use cases to pilot",
        ],
        keyTerms: [
          {
            term: "Human-AI Collaboration",
            definition:
              "A working model where humans and AI systems work together, each contributing their unique strengths—creativity and judgment from humans, speed and pattern recognition from AI.",
          },
          {
            term: "Democratization of AI",
            definition:
              "The trend of making AI tools accessible to non-technical users through no-code platforms, pre-built models, and user-friendly interfaces.",
          },
          {
            term: "Sustainable Computing",
            definition:
              "Computing practices that minimize environmental impact through energy-efficient hardware, renewable energy, and optimized algorithms.",
          },
        ],
        relatedSessionIds: ["ses-003", "ses-004", "ses-008"],
      },
    },
    "ses-002": {
      id: "ses-002",
      title: "Building Scalable Systems for the Modern Era",
      presenters: ["Michael Roberts", "Lisa Park"],
      presenterBios: [
        {
          name: "Michael Roberts",
          bio: "Principal Engineer at CloudScale Inc. 15+ years building distributed systems at Netflix and Amazon.",
        },
        {
          name: "Lisa Park",
          bio: "VP of Engineering at DataFlow. Led the migration of a 10M user platform to microservices.",
        },
      ],
      scheduledDate: todayStr,
      scheduledStart: "11:00 AM",
      endTime: "12:00 PM",
      duration: "60 min",
      tldr: "Microservices architecture with event-driven patterns is key to handling millions of concurrent users at scale.",
      summary:
        "This session covered architectural patterns for building systems that can handle millions of concurrent users. The speakers presented a case study from their work at a major tech company, detailing how they migrated from a monolithic architecture to microservices. Key takeaways included: the importance of event-driven architecture, strategies for managing distributed state, and practical tips for implementing circuit breakers and bulkheads. The Q&A session addressed common pitfalls in microservices adoption and strategies for managing technical debt during migration.",
      keyTakeaways: [
        "Event-driven architecture enables better scalability",
        "Circuit breakers and bulkheads are essential for resilience",
        "Start with a modular monolith before jumping to microservices",
        "Distributed state management requires careful planning",
      ],
      tags: ["Architecture", "Scalability", "Microservices", "DevOps"],
      notableQuote: {
        text: "The best architecture is the one your team can actually maintain.",
        speaker: "Michael Roberts",
      },
      aiInsights: {
        sentiment: "Technical",
        audienceLevel: "Intermediate",
        keyTopics: [
          "Microservices",
          "Event-Driven Architecture",
          "System Scalability",
          "Distributed Systems",
          "Resilience Patterns",
        ],
        questionsAnswered: [
          "When should we move from monolith to microservices?",
          "How do we handle failures in distributed systems?",
          "What patterns work best for high-traffic applications?",
          "How do we manage data consistency across services?",
        ],
        suggestedFollowUp: [
          "What monitoring tools work best for microservices?",
          "How do we handle cross-service transactions?",
          "What's the optimal team structure for microservices?",
          "How do we test microservices effectively?",
        ],
        actionItems: [
          "Identify service boundaries in your current monolith",
          "Implement circuit breakers for external dependencies",
          "Set up distributed tracing for observability",
          "Create a microservices migration roadmap",
        ],
        keyTerms: [
          {
            term: "Circuit Breaker",
            definition:
              "A design pattern that prevents cascading failures by temporarily stopping requests to a failing service, allowing it time to recover.",
          },
          {
            term: "Event-Driven Architecture",
            definition:
              "A software architecture where the flow of the program is determined by events—changes in state that trigger actions in other parts of the system.",
          },
          {
            term: "Bulkhead Pattern",
            definition:
              "A resilience pattern that isolates elements of an application into pools so that if one fails, the others continue to function.",
          },
        ],
        relatedSessionIds: ["ses-005", "ses-006"],
      },
    },
  };

  const session = sessionsMap[sessionId] || sessionsMap["ses-001"];

  const relatedSessions: RelatedSession[] = [
    {
      id: "ses-003",
      title: "Panel: The Ethics of Artificial Intelligence",
      presenters: ["Multiple Speakers"],
      tags: ["AI Ethics", "Policy"],
    },
    {
      id: "ses-004",
      title: "Hands-on: Building Your First ML Pipeline",
      presenters: ["Dr. James Wilson"],
      tags: ["Machine Learning", "Hands-on"],
    },
    {
      id: "ses-008",
      title: "Security in the Age of AI",
      presenters: ["David Chen", "Maria Santos"],
      tags: ["Security", "AI"],
    },
  ];

  return {
    session,
    event: { name: "AI & Machine Learning Summit 2026", slug: eventSlug },
    relatedSessions,
  };
}

// Section component for consistent styling
function InsightSection({
  icon,
  title,
  children,
  className,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-gray-200 overflow-hidden",
        className
      )}
    >
      <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-2">
          <span className="text-primary-teal-600">{icon}</span>
          <h3 className="font-semibold text-gray-900">{title}</h3>
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

// Share dropdown
function ShareButton({ session }: { session: SessionDetail }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const textToCopy = `${session.title}\n\n📌 TL;DR: ${
      session.tldr
    }\n\n🎯 Key Takeaways:\n${session.keyTakeaways
      .map((t) => `• ${t}`)
      .join("\n")}${
      session.notableQuote
        ? `\n\n💬 "${session.notableQuote.text}" — ${session.notableQuote.speaker}`
        : ""
    }`;
    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2">
      {copied ? (
        <Check className="h-4 w-4 text-green-600" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
      {copied ? "Copied!" : "Copy Summary"}
    </Button>
  );
}

export default function SessionDetailPage({
  params,
}: {
  params: Promise<{ eventSlug: string; sessionId: string }>;
}) {
  const resolvedParams = use(params);
  const { session, event, relatedSessions } = getMockSessionData(
    resolvedParams.sessionId,
    resolvedParams.eventSlug
  );

  const sentimentStyle = sentimentStyles[session.aiInsights.sentiment];

  // Chatbot state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInitialMessage, setChatInitialMessage] = useState<
    string | undefined
  >(undefined);

  const handleStartConversation = () => {
    // Set an initial message about this specific session
    setChatInitialMessage(
      `Tell me more about the session "${
        session.title
      }" by ${session.presenters.join(", ")}`
    );
    setIsChatOpen(true);
  };

  // Prepare session context for the chatbot
  const sessionContext = [
    {
      title: session.title,
      presenters: session.presenters,
      summary: session.summary,
      scheduledDate: session.scheduledDate,
      scheduledStart: session.scheduledStart,
      roomName: session.roomName || "",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <Image
            src="/logo/wordly-logo-rebrand-blue.svg"
            alt="Wordly"
            width={100}
            height={28}
            className="h-7 w-auto"
          />
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <Globe className="h-4 w-4" />
            <span>English</span>
          </div>
        </div>
      </header>

      {/* Back navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <Link
            href={`/public/${event.slug}`}
            className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to {event.name}
          </Link>
        </div>
      </div>

      {/* Session Hero */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-sm text-gray-600 bg-gray-100">
              <Clock className="h-3.5 w-3.5" />
              {session.duration}
            </span>
            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-sm font-medium border",
                sentimentStyle.bg
              )}
            >
              {sentimentStyle.icon}
              {session.aiInsights.sentiment}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-sm text-gray-600 bg-gray-100">
              <Users className="h-3.5 w-3.5" />
              {session.aiInsights.audienceLevel}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            {session.title}
          </h1>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
            <div className="flex items-center gap-2">
              {session.presenters.length > 1 ? (
                <Users className="h-5 w-5 text-primary-teal-600" />
              ) : (
                <User className="h-5 w-5 text-primary-teal-600" />
              )}
              <span className="font-medium">
                {session.presenters.join(", ")}
              </span>
            </div>
            <span className="text-gray-300">•</span>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary-teal-600" />
              <span>{formatSessionDate(session.scheduledDate)}</span>
            </div>
            <div className="flex items-center px-3 py-1.5 bg-primary-teal-50 border border-primary-teal-200 rounded-md">
              <Clock className="h-4 w-4 text-primary-teal-600 mr-1.5" />
              <span className="text-sm font-bold text-primary-teal-700">
                {session.scheduledStart} - {session.endTime}
              </span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {session.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary-teal-50 text-primary-teal-700"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <ShareButton session={session} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* TL;DR */}
            <div className="bg-gradient-to-r from-primary-teal-50 to-primary-teal-50/30 rounded-xl p-6 border border-primary-teal-100">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-5 w-5 text-primary-teal-600" />
                <span className="text-sm font-bold text-primary-teal-700 uppercase tracking-wider">
                  TL;DR
                </span>
              </div>
              <p className="text-lg text-gray-800 font-medium leading-relaxed">
                {session.tldr}
              </p>
            </div>

            {/* Key Takeaways */}
            <InsightSection
              icon={<Lightbulb className="h-5 w-5" />}
              title="Key Takeaways"
            >
              <ul className="space-y-3">
                {session.keyTakeaways.map((takeaway, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-teal-100 text-primary-teal-700 text-sm font-semibold flex items-center justify-center mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-gray-700 leading-relaxed">
                      {takeaway}
                    </span>
                  </li>
                ))}
              </ul>
            </InsightSection>

            {/* Notable Quote */}
            {session.notableQuote && (
              <div className="bg-white rounded-xl p-6 border-l-4 border-primary-teal-500 shadow-sm">
                <div className="flex items-start gap-4">
                  <Quote className="h-8 w-8 text-primary-teal-300 flex-shrink-0" />
                  <div>
                    <p className="text-xl text-gray-800 italic leading-relaxed mb-3">
                      &ldquo;{session.notableQuote.text}&rdquo;
                    </p>
                    <p className="font-semibold text-primary-teal-700">
                      — {session.notableQuote.speaker}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Full Summary */}
            <InsightSection
              icon={<FileText className="h-5 w-5" />}
              title="Full Summary"
            >
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {session.summary}
              </p>
            </InsightSection>

            {/* Action Items */}
            <InsightSection
              icon={<Zap className="h-5 w-5" />}
              title="Action Items"
            >
              <ul className="space-y-2">
                {session.aiInsights.actionItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded bg-amber-100 flex items-center justify-center mt-0.5">
                      <Check className="h-3 w-3 text-amber-600" />
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </InsightSection>

            {/* Key Terms Glossary */}
            <InsightSection
              icon={<BookOpen className="h-5 w-5" />}
              title="Key Terms"
            >
              <div className="space-y-4">
                {session.aiInsights.keyTerms.map((term, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                  >
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {term.term}
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {term.definition}
                    </p>
                  </div>
                ))}
              </div>
            </InsightSection>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* AI Assistant Card */}
            <div className="bg-gradient-to-br from-primary-teal-600 to-primary-teal-700 rounded-xl p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Ask AI about this session</h3>
                  <p className="text-sm text-white/80">Get instant answers</p>
                </div>
              </div>
              <p className="text-sm text-white/90 mb-4">
                Have questions about this presentation? Our AI assistant can
                help you dive deeper into the topics covered.
              </p>
              <Button
                variant="secondary"
                className="w-full bg-white text-primary-teal-700 hover:bg-white/90"
                onClick={handleStartConversation}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Start Conversation
              </Button>
            </div>

            {/* Questions Answered */}
            <InsightSection
              icon={<HelpCircle className="h-5 w-5" />}
              title="Questions Answered"
            >
              <ul className="space-y-2">
                {session.aiInsights.questionsAnswered.map((question, index) => (
                  <li
                    key={index}
                    className="text-sm text-gray-700 flex items-start gap-2"
                  >
                    <span className="text-primary-teal-500 mt-1">•</span>
                    {question}
                  </li>
                ))}
              </ul>
            </InsightSection>

            {/* Suggested Follow-up */}
            <InsightSection
              icon={<ArrowRight className="h-5 w-5" />}
              title="Explore Further"
            >
              <ul className="space-y-2">
                {session.aiInsights.suggestedFollowUp.map((question, index) => (
                  <li
                    key={index}
                    className="text-sm text-primary-teal-700 hover:text-primary-teal-800 cursor-pointer flex items-start gap-2 group"
                  >
                    <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
                    {question}
                  </li>
                ))}
              </ul>
            </InsightSection>

            {/* Speaker Info */}
            {session.presenterBios && session.presenterBios.length > 0 && (
              <InsightSection
                icon={<User className="h-5 w-5" />}
                title="About the Speaker"
              >
                <div className="space-y-4">
                  {session.presenterBios.map((presenter, index) => (
                    <div key={index}>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {presenter.name}
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {presenter.bio}
                      </p>
                    </div>
                  ))}
                </div>
              </InsightSection>
            )}

            {/* Related Sessions */}
            <InsightSection
              icon={<TrendingUp className="h-5 w-5" />}
              title="Related Sessions"
            >
              <div className="space-y-3">
                {relatedSessions.map((related) => (
                  <Link
                    key={related.id}
                    href={`/public/${event.slug}/session/${related.id}`}
                    className="block p-3 rounded-lg border border-gray-200 hover:border-primary-teal-300 hover:bg-primary-teal-50/50 transition-all"
                  >
                    <h4 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                      {related.title}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {related.presenters.join(", ")}
                    </p>
                  </Link>
                ))}
              </div>
            </InsightSection>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-16">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Image
                src="/logo/wordly-logo-rebrand-blue.svg"
                alt="Wordly"
                width={100}
                height={26}
                className="h-6 w-auto"
              />
              <span className="text-sm text-gray-400">
                © {new Date().getFullYear()} Wordly, Inc.
              </span>
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

      {/* AI Chatbot */}
      <EventChatbot
        eventName={event.name}
        eventDescription={`Session: ${session.title}`}
        sessions={sessionContext}
        open={isChatOpen}
        onOpenChange={setIsChatOpen}
        initialMessage={chatInitialMessage}
      />
    </div>
  );
}
