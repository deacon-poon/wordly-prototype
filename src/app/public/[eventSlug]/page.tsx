"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { use } from "react";
import {
  Calendar,
  Clock,
  Search,
  ChevronDown,
  User,
  FileText,
  Globe,
  Lightbulb,
  Quote,
  Share2,
  Copy,
  Check,
  Sparkles,
  Tag,
  X,
  List,
  LayoutGrid,
  ArrowRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { EventChatbot } from "@/components/public/EventChatbot";
import { cn } from "@/lib/utils";

type ViewMode = "detailed" | "compact";

// Data interfaces
interface SessionSummary {
  id: string;
  title: string;
  presenters: string[];
  scheduledDate: string;
  scheduledStart: string;
  endTime: string;
  sessionType: "Keynote" | "Workshop" | "Panel" | "Talk" | "Breakout";
  duration: string;
  tldr: string;
  summary: string;
  keyTakeaways: string[];
  tags: string[];
  notableQuote?: {
    text: string;
    speaker: string;
  };
  locationName?: string;
}

interface Location {
  id: string;
  name: string;
  sessions: SessionSummary[];
}

interface PublicEvent {
  id: string;
  slug: string;
  name: string;
  dateRange: string;
  description: string;
  locationCount: number;
  sessionCount: number;
  locations: Location[];
}

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

function getUniqueDates(sessions: SessionSummary[]): string[] {
  const dates = new Set<string>();
  sessions.forEach((session) => {
    dates.add(session.scheduledDate);
  });
  return Array.from(dates).sort();
}

function getUniqueTags(sessions: SessionSummary[]): string[] {
  const tags = new Set<string>();
  sessions.forEach((session) => {
    session.tags.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort();
}

// Convert time string to comparable number for sorting
function timeToMinutes(time: string): number {
  const match = time.match(/(\d+):(\d+)\s*(AM|PM)?/i);
  if (!match) return 0;
  let hours = parseInt(match[1]);
  const minutes = parseInt(match[2]);
  const period = match[3]?.toUpperCase();
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

// Flatten all sessions from locations into a single chronological list
function getAllSessions(locations: Location[]): SessionSummary[] {
  const sessions: SessionSummary[] = [];
  locations.forEach((location) => {
    location.sessions.forEach((session) => {
      sessions.push({
        ...session,
        locationName: location.name,
      });
    });
  });
  // Sort by date, then by time
  return sessions.sort((a, b) => {
    const dateCompare = a.scheduledDate.localeCompare(b.scheduledDate);
    if (dateCompare !== 0) return dateCompare;
    return timeToMinutes(a.scheduledStart) - timeToMinutes(b.scheduledStart);
  });
}

// Session type colors
const sessionTypeStyles: Record<string, string> = {
  Keynote: "bg-amber-100 text-amber-800 border-amber-200",
  Workshop: "bg-purple-100 text-purple-800 border-purple-200",
  Panel: "bg-blue-100 text-blue-800 border-blue-200",
  Talk: "bg-primary-teal-100 text-primary-teal-800 border-primary-teal-200",
  Breakout: "bg-gray-100 text-gray-800 border-gray-200",
};

// Mock data generator based on event slug
function getMockEventData(eventSlug: string): PublicEvent {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date(today);
  dayAfter.setDate(dayAfter.getDate() + 2);

  const todayStr = today.toISOString().split("T")[0];
  const tomorrowStr = tomorrow.toISOString().split("T")[0];
  const dayAfterStr = dayAfter.toISOString().split("T")[0];

  const eventData: Record<string, Partial<PublicEvent>> = {
    "ai-ml-summit-2024": {
      name: "AI & Machine Learning Summit 2024",
      description:
        "Live conference on the latest advances in AI, machine learning, and deep learning technologies. Industry leaders and researchers share insights on the future of artificial intelligence.",
    },
    "cloud-devops-summit-2024": {
      name: "Cloud & DevOps Summit 2024",
      description:
        "Two-day summit focused on cloud architecture, Kubernetes, and modern DevOps practices. Learn from practitioners building scalable infrastructure.",
    },
    "design-ux-conf-2024": {
      name: "Design & UX Conference 2024",
      description:
        "Explore the latest in design systems, UX research, and product design methodologies from top design leaders.",
    },
  };

  const baseEvent = eventData[eventSlug] || {
    name: eventSlug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
    description:
      "A comprehensive conference featuring industry experts and thought leaders.",
  };

  return {
    id: `evt-${eventSlug}`,
    slug: eventSlug,
    name: baseEvent.name!,
    dateRange: `${formatSessionDate(todayStr)
      .split(",")[1]
      .trim()} - ${formatSessionDate(dayAfterStr).split(",")[1].trim()}`,
    description: baseEvent.description!,
    locationCount: 3,
    sessionCount: 9,
    locations: [
      {
        id: "loc-001",
        name: "Main Hall",
        sessions: [
          {
            id: "ses-001",
            title: "Opening Keynote: The Future of Technology",
            presenters: ["Dr. Sarah Chen"],
            scheduledDate: todayStr,
            scheduledStart: "9:00 AM",
            endTime: "10:30 AM",
            sessionType: "Keynote",
            duration: "90 min",
            tldr: "AI assistants will be standard for knowledge workers by 2030, fundamentally changing how we approach problem-solving and creativity.",
            summary:
              "Dr. Chen opened the conference with a compelling vision of technology's trajectory over the next decade. She emphasized three key themes: the democratization of AI tools, the shift toward sustainable computing, and the growing importance of human-AI collaboration. The keynote highlighted how organizations must adapt their strategies to leverage emerging technologies while maintaining ethical considerations.",
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
          },
          {
            id: "ses-002",
            title: "Building Scalable Systems for the Modern Era",
            presenters: ["Michael Roberts", "Lisa Park"],
            scheduledDate: todayStr,
            scheduledStart: "11:00 AM",
            endTime: "12:00 PM",
            sessionType: "Talk",
            duration: "60 min",
            tldr: "Microservices architecture with event-driven patterns is key to handling millions of concurrent users at scale.",
            summary:
              "This session covered architectural patterns for building systems that can handle millions of concurrent users. The speakers presented a case study from their work at a major tech company, detailing how they migrated from a monolithic architecture to microservices.",
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
          },
          {
            id: "ses-003",
            title: "Panel: The Ethics of Artificial Intelligence",
            presenters: [
              "Dr. Emily Watson",
              "Prof. James Liu",
              "Sarah Mitchell",
            ],
            scheduledDate: tomorrowStr,
            scheduledStart: "9:00 AM",
            endTime: "10:30 AM",
            sessionType: "Panel",
            duration: "90 min",
            tldr: "AI developers have a responsibility to ensure fair, unbiased systems through transparent algorithms and diverse training data.",
            summary:
              "A thought-provoking panel discussion featuring ethicists, technologists, and policymakers. The panelists debated the responsibility of AI developers in ensuring fair and unbiased systems.",
            keyTakeaways: [
              "Algorithmic accountability must be built into development processes",
              "Regulation is coming—proactive compliance is better than reactive",
              "Diverse teams build less biased AI systems",
              "Transparency in AI decision-making builds user trust",
            ],
            tags: ["AI Ethics", "Policy", "Governance", "Responsibility"],
          },
        ],
      },
      {
        id: "loc-002",
        name: "Workshop Room A",
        sessions: [
          {
            id: "ses-004",
            title: "Hands-on: Building Your First ML Pipeline",
            presenters: ["Dr. James Wilson"],
            scheduledDate: todayStr,
            scheduledStart: "2:00 PM",
            endTime: "4:00 PM",
            sessionType: "Workshop",
            duration: "120 min",
            tldr: "A complete guide to building production-ready ML pipelines with proper versioning, experiment tracking, and automated testing.",
            summary:
              "This practical workshop guided attendees through building an end-to-end machine learning pipeline. Starting from data ingestion, participants learned to preprocess data, train models, and deploy them to production.",
            keyTakeaways: [
              "Model versioning is critical for reproducibility",
              "Experiment tracking saves countless hours debugging",
              "Automated testing for ML models prevents production issues",
              "Start simple and iterate—don't over-engineer from day one",
            ],
            tags: ["Machine Learning", "MLOps", "Data Engineering", "Hands-on"],
            notableQuote: {
              text: "A model that can't be reproduced is a model that can't be trusted.",
              speaker: "Dr. James Wilson",
            },
          },
          {
            id: "ses-005",
            title: "Advanced Kubernetes Patterns",
            presenters: ["Emily Zhang"],
            scheduledDate: tomorrowStr,
            scheduledStart: "11:00 AM",
            endTime: "12:30 PM",
            sessionType: "Talk",
            duration: "90 min",
            tldr: "Custom operators and multi-tenancy patterns unlock the full potential of Kubernetes at enterprise scale.",
            summary:
              "Emily shared advanced Kubernetes patterns learned from operating clusters at scale. Topics covered included: custom controllers and operators, multi-tenancy strategies, and cost optimization techniques.",
            keyTakeaways: [
              "Custom operators automate complex operational tasks",
              "Multi-tenancy requires careful namespace and RBAC planning",
              "Resource quotas prevent noisy neighbor problems",
              "Cost optimization starts with visibility into resource usage",
            ],
            tags: ["Kubernetes", "Cloud Native", "DevOps", "Infrastructure"],
          },
          {
            id: "ses-006",
            title: "Data Engineering Best Practices",
            presenters: ["Robert Kim"],
            scheduledDate: dayAfterStr,
            scheduledStart: "9:00 AM",
            endTime: "10:30 AM",
            sessionType: "Talk",
            duration: "90 min",
            tldr: "Data contracts and schema evolution are the foundation of reliable, maintainable data pipelines.",
            summary:
              "A comprehensive overview of modern data engineering practices. The session covered data pipeline architecture, quality assurance, and observability.",
            keyTakeaways: [
              "Data contracts create clear interfaces between teams",
              "Schema evolution strategies prevent breaking changes",
              "Observability in data pipelines catches issues before users do",
              "Data quality is everyone's responsibility",
            ],
            tags: [
              "Data Engineering",
              "Data Quality",
              "Analytics",
              "Best Practices",
            ],
          },
        ],
      },
      {
        id: "loc-003",
        name: "Breakout Room B",
        sessions: [
          {
            id: "ses-007",
            title: "Product-Led Growth Strategies",
            presenters: ["Amanda Foster"],
            scheduledDate: todayStr,
            scheduledStart: "3:00 PM",
            endTime: "4:00 PM",
            sessionType: "Breakout",
            duration: "60 min",
            tldr: "Self-service onboarding and optimized activation funnels are the keys to sustainable product-led growth.",
            summary:
              "Amanda shared insights from scaling multiple SaaS products using product-led growth. The talk covered: designing for self-service, optimizing activation funnels, and building features that drive viral growth.",
            keyTakeaways: [
              "Self-service reduces friction and scales infinitely",
              "Activation is the most important metric for PLG",
              "Viral features should provide value to both sharer and receiver",
              "Free tiers should showcase your best features, not hide them",
            ],
            tags: ["Product Strategy", "Growth", "SaaS", "Business"],
            notableQuote: {
              text: "Your free tier is your best salesperson. Make sure it's doing its job.",
              speaker: "Amanda Foster",
            },
          },
          {
            id: "ses-008",
            title: "Security in the Age of AI",
            presenters: ["David Chen", "Maria Santos"],
            scheduledDate: tomorrowStr,
            scheduledStart: "2:00 PM",
            endTime: "3:30 PM",
            sessionType: "Talk",
            duration: "90 min",
            tldr: "AI is a double-edged sword for security—it powers both advanced threats and sophisticated defenses.",
            summary:
              "This session explored the intersection of cybersecurity and artificial intelligence. The speakers covered both offensive and defensive applications of AI in security.",
            keyTakeaways: [
              "AI-powered threat detection catches attacks humans miss",
              "Adversarial attacks can fool ML models with minimal perturbations",
              "Model security is now part of the attack surface",
              "Defense in depth applies to AI systems too",
            ],
            tags: ["Security", "AI", "Cybersecurity", "Risk Management"],
          },
          {
            id: "ses-009",
            title: "Closing Keynote: What's Next",
            presenters: ["Conference Organizers"],
            scheduledDate: dayAfterStr,
            scheduledStart: "4:00 PM",
            endTime: "5:00 PM",
            sessionType: "Keynote",
            duration: "60 min",
            tldr: "The conference wrapped up with key announcements and a preview of emerging trends to watch in the coming year.",
            summary:
              "The conference concluded with a forward-looking session summarizing key themes and announcements. Highlights included next year's dates, session recaps, and emerging topics to watch.",
            keyTakeaways: [
              "Edge AI and on-device processing are emerging trends",
              "Sustainability in tech will become a differentiator",
              "Cross-functional collaboration is more important than ever",
              "Community feedback shapes better conferences",
            ],
            tags: ["Trends", "Future", "Community", "Wrap-up"],
          },
        ],
      },
    ],
  };
}

// Highlight text component for search results
function HighlightText({
  text,
  searchQuery,
}: {
  text: string;
  searchQuery: string;
}) {
  if (!searchQuery || searchQuery.trim() === "") {
    return <>{text}</>;
  }

  const regex = new RegExp(
    `(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "gi"
  );
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <mark
            key={index}
            className="bg-yellow-200 text-gray-900 rounded px-0.5"
          >
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  );
}

// Tag component
function TopicTag({
  tag,
  isSelected,
  onClick,
}: {
  tag: string;
  isSelected?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-all",
        isSelected
          ? "bg-primary-teal-600 text-white"
          : "bg-primary-teal-50 text-primary-teal-700 hover:bg-primary-teal-100"
      )}
    >
      {tag}
    </button>
  );
}

// Share dropdown component
function ShareButton({ session }: { session: SessionSummary }) {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
        title="Share"
      >
        <Share2 className="h-4 w-4" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-1 z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[160px]">
            <button
              onClick={() => {
                handleCopy();
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {copied ? "Copied!" : "Copy summary"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// Compact Card Component for compact view
function CompactCard({
  session,
  eventSlug,
  searchQuery = "",
  onTagClick,
}: {
  session: SessionSummary;
  eventSlug: string;
  searchQuery?: string;
  onTagClick?: (tag: string) => void;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-primary-teal-300 hover:shadow-md transition-all">
      <div className="flex items-start gap-4">
        {/* Left: Session info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span
              className={cn(
                "inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border",
                sessionTypeStyles[session.sessionType]
              )}
            >
              {session.sessionType}
            </span>
            <span className="text-xs text-gray-500">
              {session.scheduledStart} - {session.endTime}
            </span>
          </div>

          <Link
            href={`/public/${eventSlug}/session/${session.id}`}
            className="block group"
          >
            <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-primary-teal-600 transition-colors line-clamp-1">
              <HighlightText text={session.title} searchQuery={searchQuery} />
            </h4>
          </Link>

          <p className="text-sm text-gray-600 mb-2">
            <HighlightText
              text={session.presenters.join(", ")}
              searchQuery={searchQuery}
            />
          </p>

          <p className="text-sm text-gray-700 line-clamp-2">
            <HighlightText text={session.tldr} searchQuery={searchQuery} />
          </p>

          <div className="flex flex-wrap gap-1.5 mt-3">
            {session.tags.slice(0, 3).map((tag) => (
              <TopicTag key={tag} tag={tag} onClick={() => onTagClick?.(tag)} />
            ))}
            {session.tags.length > 3 && (
              <span className="text-xs text-gray-400">
                +{session.tags.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Right: View details button */}
        <Link
          href={`/public/${eventSlug}/session/${session.id}`}
          className="flex-shrink-0 p-2 rounded-lg bg-primary-teal-50 text-primary-teal-600 hover:bg-primary-teal-100 transition-colors"
        >
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}

// Enhanced Summary Card Component (Detailed View)
function SummaryCard({
  session,
  eventSlug,
  searchQuery = "",
  onTagClick,
}: {
  session: SessionSummary;
  eventSlug: string;
  searchQuery?: string;
  onTagClick?: (tag: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-primary-teal-300 hover:shadow-lg transition-all">
      {/* Header row with badges and share */}
      <div className="px-6 pt-5 pb-4 border-b border-gray-100 bg-gradient-to-r from-gray-50/50 to-white">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Session type and duration badges */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span
                className={cn(
                  "inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold border",
                  sessionTypeStyles[session.sessionType]
                )}
              >
                {session.sessionType}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                {session.duration}
              </span>
            </div>

            {/* Title */}
            <Link
              href={`/public/${eventSlug}/session/${session.id}`}
              className="block group"
            >
              <h4 className="text-lg font-semibold text-gray-900 mb-2 leading-tight group-hover:text-primary-teal-600 transition-colors">
                <HighlightText text={session.title} searchQuery={searchQuery} />
              </h4>
            </Link>

            {/* Presenter and time */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-1.5">
                <User className="h-4 w-4 text-primary-teal-600" />
                <span className="font-medium">
                  <HighlightText
                    text={session.presenters.join(", ")}
                    searchQuery={searchQuery}
                  />
                </span>
              </div>
              <span className="text-gray-300">•</span>
              <span>
                {session.scheduledStart} - {session.endTime}
              </span>
            </div>
          </div>

          {/* Share button */}
          <ShareButton session={session} />
        </div>

        {/* Topic tags */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {session.tags.map((tag) => (
            <TopicTag key={tag} tag={tag} onClick={() => onTagClick?.(tag)} />
          ))}
        </div>
      </div>

      {/* Content body */}
      <div className="px-6 py-5 space-y-5">
        {/* TL;DR section */}
        <div className="bg-gradient-to-r from-primary-teal-50 to-primary-teal-50/30 rounded-lg p-4 border border-primary-teal-100">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-primary-teal-600" />
            <span className="text-xs font-bold text-primary-teal-700 uppercase tracking-wider">
              TL;DR
            </span>
          </div>
          <p className="text-gray-800 font-medium leading-relaxed">
            <HighlightText text={session.tldr} searchQuery={searchQuery} />
          </p>
        </div>

        {/* Key Takeaways */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="h-4 w-4 text-amber-500" />
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Key Takeaways
            </span>
          </div>
          <ul className="space-y-2">
            {session.keyTakeaways.map((takeaway, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary-teal-100 text-primary-teal-700 text-xs font-semibold flex items-center justify-center mt-0.5">
                  {index + 1}
                </span>
                <span className="text-gray-700 leading-relaxed">
                  <HighlightText text={takeaway} searchQuery={searchQuery} />
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Notable Quote */}
        {session.notableQuote && (
          <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-primary-teal-500">
            <div className="flex items-start gap-3">
              <Quote className="h-5 w-5 text-primary-teal-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-gray-800 italic leading-relaxed mb-2">
                  &ldquo;{session.notableQuote.text}&rdquo;
                </p>
                <p className="text-sm font-medium text-primary-teal-700">
                  — {session.notableQuote.speaker}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Expandable full summary */}
        {isExpanded && (
          <div className="border-t border-gray-100 pt-4">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-4 w-4 text-gray-500" />
              <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                Full Summary
              </span>
            </div>
            <p className="text-gray-700 leading-relaxed">
              <HighlightText text={session.summary} searchQuery={searchQuery} />
            </p>
          </div>
        )}

        {/* Actions row */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm font-medium text-gray-500 hover:text-gray-700 flex items-center gap-1 transition-colors"
          >
            {isExpanded ? "Show less" : "Read full summary"}
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                isExpanded && "rotate-180"
              )}
            />
          </button>

          <Link
            href={`/public/${eventSlug}/session/${session.id}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-teal-600 hover:text-primary-teal-700 transition-colors"
          >
            View full insights
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function DateSection({
  date,
  sessions,
  eventSlug,
  searchQuery = "",
  onTagClick,
  viewMode = "detailed",
}: {
  date: string;
  sessions: SessionSummary[];
  eventSlug: string;
  searchQuery?: string;
  onTagClick?: (tag: string) => void;
  viewMode?: ViewMode;
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="space-y-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-3 py-3 px-4 bg-primary-teal-50 rounded-lg hover:bg-primary-teal-100 transition-colors"
      >
        <ChevronDown
          className={cn(
            "h-5 w-5 text-primary-teal-600 transition-transform",
            !isExpanded && "-rotate-90"
          )}
        />
        <Calendar className="h-5 w-5 text-primary-teal-600" />
        <h2 className="text-lg font-bold text-gray-900">
          {formatSessionDate(date)}
        </h2>
        <span className="text-sm text-gray-500">
          ({sessions.length}{" "}
          {sessions.length === 1 ? "presentation" : "presentations"})
        </span>
      </button>

      {isExpanded && (
        <div className={cn("space-y-4", viewMode === "compact" && "space-y-2")}>
          {sessions.map((session) =>
            viewMode === "compact" ? (
              <CompactCard
                key={session.id}
                session={session}
                eventSlug={eventSlug}
                searchQuery={searchQuery}
                onTagClick={onTagClick}
              />
            ) : (
              <SummaryCard
                key={session.id}
                session={session}
                eventSlug={eventSlug}
                searchQuery={searchQuery}
                onTagClick={onTagClick}
              />
            )
          )}
        </div>
      )}
    </div>
  );
}

export default function PublicSummaryPage({
  params,
}: {
  params: Promise<{ eventSlug: string }>;
}) {
  const resolvedParams = use(params);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>("all");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("detailed");

  // Get mock event data
  const event = getMockEventData(resolvedParams.eventSlug);

  // Get all sessions flattened and sorted chronologically
  const allSessions = useMemo(
    () => getAllSessions(event.locations),
    [event.locations]
  );

  // Get unique dates and tags for filters
  const uniqueDates = useMemo(() => getUniqueDates(allSessions), [allSessions]);
  const uniqueTags = useMemo(() => getUniqueTags(allSessions), [allSessions]);

  // Filter sessions based on search, date, and tag filters
  const filteredSessions = useMemo(() => {
    return allSessions.filter((session) => {
      const matchesDate =
        selectedDate === "all" || session.scheduledDate === selectedDate;
      const matchesTag = !selectedTag || session.tags.includes(selectedTag);
      const matchesSearch =
        searchQuery === "" ||
        session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.tldr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.keyTakeaways.some((t) =>
          t.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        session.presenters.some((p) =>
          p.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        session.tags.some((t) =>
          t.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchesDate && matchesTag && matchesSearch;
    });
  }, [allSessions, selectedDate, selectedTag, searchQuery]);

  // Group filtered sessions by date
  const sessionsByDate = useMemo(() => {
    const grouped: Record<string, SessionSummary[]> = {};
    filteredSessions.forEach((session) => {
      if (!grouped[session.scheduledDate]) {
        grouped[session.scheduledDate] = [];
      }
      grouped[session.scheduledDate].push(session);
    });
    return grouped;
  }, [filteredSessions]);

  // Get sorted dates that have sessions
  const filteredDates = useMemo(
    () => Object.keys(sessionsByDate).sort(),
    [sessionsByDate]
  );

  const totalFilteredSessions = filteredSessions.length;

  const handleTagClick = (tag: string) => {
    setSelectedTag(selectedTag === tag ? null : tag);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <Image
            src="/asset/wordly-logo-teal-with-container.png"
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

      {/* Event Hero */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {event.name}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary-teal-600" />
              <span>{event.dateRange}</span>
            </div>
            <span className="text-gray-300">•</span>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary-teal-600" />
              <span>{allSessions.length} Presentations</span>
            </div>
          </div>
          <p className="text-gray-600 max-w-3xl">{event.description}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-[52px] z-40">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[200px] max-w-md relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search presentations, speakers, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-9 border-gray-200"
              />
            </div>
            <Select value={selectedDate} onValueChange={setSelectedDate}>
              <SelectTrigger className="w-[180px] h-9 border-gray-200">
                <SelectValue placeholder="All Days" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Days</SelectItem>
                {uniqueDates.map((date) => (
                  <SelectItem key={date} value={date}>
                    {formatSessionDate(date).split(",")[0]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Selected tag filter indicator */}
            {selectedTag && (
              <button
                onClick={() => setSelectedTag(null)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-teal-600 text-white text-sm font-medium rounded-full"
              >
                <Tag className="h-3 w-3" />
                {selectedTag}
                <X className="h-3 w-3" />
              </button>
            )}

            {/* View toggle */}
            <div className="flex items-center gap-1 ml-auto bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("detailed")}
                className={cn(
                  "p-1.5 rounded-md transition-colors",
                  viewMode === "detailed"
                    ? "bg-white text-primary-teal-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                )}
                title="Detailed view"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("compact")}
                className={cn(
                  "p-1.5 rounded-md transition-colors",
                  viewMode === "compact"
                    ? "bg-white text-primary-teal-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                )}
                title="Compact view"
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            <span className="text-sm text-gray-500">
              {totalFilteredSessions}{" "}
              {totalFilteredSessions === 1 ? "presentation" : "presentations"}
            </span>
          </div>

          {/* Topic tags row */}
          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
            <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
              <Tag className="h-3 w-3" />
              Topics:
            </span>
            {uniqueTags.slice(0, 10).map((tag) => (
              <TopicTag
                key={tag}
                tag={tag}
                isSelected={selectedTag === tag}
                onClick={() => handleTagClick(tag)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {filteredDates.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No presentations found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria
            </p>
            {selectedTag && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setSelectedTag(null)}
              >
                Clear tag filter
              </Button>
            )}
          </div>
        ) : (
          <div
            className={cn("space-y-8", viewMode === "compact" && "space-y-6")}
          >
            {filteredDates.map((date) => (
              <DateSection
                key={date}
                date={date}
                sessions={sessionsByDate[date]}
                eventSlug={resolvedParams.eventSlug}
                searchQuery={searchQuery}
                onTagClick={handleTagClick}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-16">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Image
                src="/asset/wordly-logo-teal-with-container.png"
                alt="Wordly"
                width={100}
                height={26}
                className="h-6 w-auto"
              />
              <span className="text-sm text-gray-500">
                Powered by Wordly AI
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
        eventDescription={event.description}
        sessions={allSessions.map((session) => ({
          title: session.title,
          presenters: session.presenters,
          summary: session.summary,
          scheduledDate: session.scheduledDate,
          scheduledStart: session.scheduledStart,
          locationName: session.locationName || "",
        }))}
      />
    </div>
  );
}
