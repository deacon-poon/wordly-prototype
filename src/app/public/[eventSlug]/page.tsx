"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { use } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Search,
  ChevronDown,
  ChevronRight,
  User,
  FileText,
  ExternalLink,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Data interfaces
interface SessionSummary {
  id: string;
  title: string;
  presenters: string[];
  scheduledDate: string;
  scheduledStart: string;
  endTime: string;
  summary: string;
  transcriptUrl?: string;
}

interface Stage {
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
  stageCount: number;
  sessionCount: number;
  stages: Stage[];
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

function getUniqueStages(stages: Stage[]): string[] {
  return stages.map((s) => s.name);
}

function getUniqueDates(stages: Stage[]): string[] {
  const dates = new Set<string>();
  stages.forEach((stage) => {
    stage.sessions.forEach((session) => {
      dates.add(session.scheduledDate);
    });
  });
  return Array.from(dates).sort();
}

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
    description: "A comprehensive conference featuring industry experts and thought leaders.",
  };

  return {
    id: `evt-${eventSlug}`,
    slug: eventSlug,
    name: baseEvent.name!,
    dateRange: `${formatSessionDate(todayStr).split(",")[1].trim()} - ${formatSessionDate(dayAfterStr).split(",")[1].trim()}`,
    description: baseEvent.description!,
    stageCount: 3,
    sessionCount: 9,
    stages: [
      {
        id: "stage-001",
        name: "Main Hall",
        sessions: [
          {
            id: "ses-001",
            title: "Opening Keynote: The Future of Technology",
            presenters: ["Dr. Sarah Chen"],
            scheduledDate: todayStr,
            scheduledStart: "9:00 AM",
            endTime: "10:30 AM",
            summary:
              "Dr. Chen opened the conference with a compelling vision of technology's trajectory over the next decade. She emphasized three key themes: the democratization of AI tools, the shift toward sustainable computing, and the growing importance of human-AI collaboration. The keynote highlighted how organizations must adapt their strategies to leverage emerging technologies while maintaining ethical considerations. Notable points included the prediction that by 2030, AI assistants will be standard in every knowledge worker's toolkit, fundamentally changing how we approach problem-solving and creativity.",
            transcriptUrl: "#",
          },
          {
            id: "ses-002",
            title: "Building Scalable Systems for the Modern Era",
            presenters: ["Michael Roberts", "Lisa Park"],
            scheduledDate: todayStr,
            scheduledStart: "11:00 AM",
            endTime: "12:00 PM",
            summary:
              "This session covered architectural patterns for building systems that can handle millions of concurrent users. The speakers presented a case study from their work at a major tech company, detailing how they migrated from a monolithic architecture to microservices. Key takeaways included: the importance of event-driven architecture, strategies for managing distributed state, and practical tips for implementing circuit breakers and bulkheads. The Q&A session addressed common pitfalls in microservices adoption.",
            transcriptUrl: "#",
          },
          {
            id: "ses-003",
            title: "Panel: The Ethics of Artificial Intelligence",
            presenters: ["Multiple Speakers"],
            scheduledDate: tomorrowStr,
            scheduledStart: "9:00 AM",
            endTime: "10:30 AM",
            summary:
              "A thought-provoking panel discussion featuring ethicists, technologists, and policymakers. The panelists debated the responsibility of AI developers in ensuring fair and unbiased systems. Key topics included: algorithmic accountability, the role of regulation in AI development, and frameworks for ethical AI deployment. The discussion concluded with actionable recommendations for organizations looking to implement responsible AI practices.",
            transcriptUrl: "#",
          },
        ],
      },
      {
        id: "stage-002",
        name: "Workshop Room A",
        sessions: [
          {
            id: "ses-004",
            title: "Hands-on: Building Your First ML Pipeline",
            presenters: ["Dr. James Wilson"],
            scheduledDate: todayStr,
            scheduledStart: "2:00 PM",
            endTime: "4:00 PM",
            summary:
              "This practical workshop guided attendees through building an end-to-end machine learning pipeline. Starting from data ingestion, participants learned to preprocess data, train models, and deploy them to production. The instructor emphasized best practices for model versioning, experiment tracking, and automated testing. Participants left with a working pipeline template they could adapt for their own projects.",
            transcriptUrl: "#",
          },
          {
            id: "ses-005",
            title: "Advanced Kubernetes Patterns",
            presenters: ["Emily Zhang"],
            scheduledDate: tomorrowStr,
            scheduledStart: "11:00 AM",
            endTime: "12:30 PM",
            summary:
              "Emily shared advanced Kubernetes patterns learned from operating clusters at scale. Topics covered included: custom controllers and operators, multi-tenancy strategies, and cost optimization techniques. The session included live demonstrations of implementing a custom operator and debugging common cluster issues. Attendees appreciated the real-world examples and troubleshooting tips.",
            transcriptUrl: "#",
          },
          {
            id: "ses-006",
            title: "Data Engineering Best Practices",
            presenters: ["Robert Kim"],
            scheduledDate: dayAfterStr,
            scheduledStart: "9:00 AM",
            endTime: "10:30 AM",
            summary:
              "A comprehensive overview of modern data engineering practices. The session covered data pipeline architecture, quality assurance, and observability. Robert presented a maturity model for data platforms and provided concrete steps for teams at different stages. The discussion on data contracts and schema evolution was particularly relevant for teams managing complex data ecosystems.",
            transcriptUrl: "#",
          },
        ],
      },
      {
        id: "stage-003",
        name: "Breakout Room B",
        sessions: [
          {
            id: "ses-007",
            title: "Product-Led Growth Strategies",
            presenters: ["Amanda Foster"],
            scheduledDate: todayStr,
            scheduledStart: "3:00 PM",
            endTime: "4:00 PM",
            summary:
              "Amanda shared insights from scaling multiple SaaS products using product-led growth. The talk covered: designing for self-service, optimizing activation funnels, and building features that drive viral growth. Case studies from successful PLG companies illustrated key principles. Attendees received a framework for evaluating their own products' PLG potential.",
            transcriptUrl: "#",
          },
          {
            id: "ses-008",
            title: "Security in the Age of AI",
            presenters: ["David Chen", "Maria Santos"],
            scheduledDate: tomorrowStr,
            scheduledStart: "2:00 PM",
            endTime: "3:30 PM",
            summary:
              "This session explored the intersection of cybersecurity and artificial intelligence. The speakers covered both offensive and defensive applications of AI in security, including: AI-powered threat detection, adversarial machine learning attacks, and secure AI model deployment. Practical demonstrations showed how attackers can exploit ML systems and how defenders can protect against these threats.",
            transcriptUrl: "#",
          },
          {
            id: "ses-009",
            title: "Closing Keynote: What's Next",
            presenters: ["Conference Organizers"],
            scheduledDate: dayAfterStr,
            scheduledStart: "4:00 PM",
            endTime: "5:00 PM",
            summary:
              "The conference concluded with a forward-looking session summarizing key themes and announcements. Highlights included: the announcement of next year's conference dates, a recap of the most impactful sessions based on attendee feedback, and a preview of emerging topics to watch. The organizers thanked sponsors, speakers, and attendees for making the event a success.",
            transcriptUrl: "#",
          },
        ],
      },
    ],
  };
}

// Highlight text component for search results
function HighlightText({ text, searchQuery }: { text: string; searchQuery: string }) {
  if (!searchQuery || searchQuery.trim() === "") {
    return <>{text}</>;
  }

  const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) => 
        regex.test(part) ? (
          <mark key={index} className="bg-yellow-200 text-gray-900 rounded px-0.5">
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  );
}

// Components
function SummaryCard({ 
  session, 
  eventSlug, 
  searchQuery = "" 
}: { 
  session: SessionSummary; 
  eventSlug: string;
  searchQuery?: string;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const summaryPreview = session.summary.slice(0, 200);
  const hasMore = session.summary.length > 200;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-primary-teal-300 hover:shadow-md transition-all">
      <div className="mb-4">
        <h4 className="text-lg font-semibold text-gray-900 mb-2">
          <HighlightText text={session.title} searchQuery={searchQuery} />
        </h4>
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
          <div className="flex items-center gap-1.5">
            <User className="h-4 w-4 text-primary-teal-600" />
            <span>
              <HighlightText text={session.presenters.join(", ")} searchQuery={searchQuery} />
            </span>
          </div>
          <span className="text-gray-300">•</span>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-primary-teal-600" />
            <span>
              {session.scheduledStart} - {session.endTime}
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="h-4 w-4 text-primary-teal-600" />
          <span className="text-sm font-medium text-primary-teal-700 uppercase tracking-wide">
            Summary
          </span>
        </div>
        <p className="text-gray-700 leading-relaxed">
          <HighlightText 
            text={isExpanded ? session.summary : summaryPreview + (hasMore && !isExpanded ? "..." : "")} 
            searchQuery={searchQuery} 
          />
        </p>
        {hasMore && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-3 text-sm font-medium text-primary-teal-600 hover:text-primary-teal-700 flex items-center gap-1"
          >
            {isExpanded ? "Show less" : "Read more"}
            <ChevronDown
              className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
            />
          </button>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <Link
          href={`/public/${eventSlug}/transcript/${session.id}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-teal-600 hover:text-primary-teal-700"
        >
          <ExternalLink className="h-4 w-4" />
          Read Full Transcript
        </Link>
      </div>
    </div>
  );
}

function StageSection({
  stage,
  sessions,
  eventSlug,
  searchQuery = "",
}: {
  stage: Stage;
  sessions: SessionSummary[];
  eventSlug: string;
  searchQuery?: string;
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white hover:from-gray-100 hover:to-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <MapPin className="h-5 w-5 text-primary-teal-600" />
          <h3 className="text-lg font-semibold text-gray-900">{stage.name}</h3>
          <span className="text-sm text-gray-500">
            ({sessions.length} {sessions.length === 1 ? "session" : "sessions"})
          </span>
        </div>
        <ChevronDown
          className={`h-5 w-5 text-gray-500 transition-transform ${isExpanded ? "" : "-rotate-90"}`}
        />
      </button>

      {isExpanded && (
        <div className="p-6 pt-2 space-y-4">
          {sessions.map((session) => (
            <SummaryCard key={session.id} session={session} eventSlug={eventSlug} searchQuery={searchQuery} />
          ))}
        </div>
      )}
    </div>
  );
}

function DateSection({
  date,
  filteredStages,
  eventSlug,
  searchQuery = "",
}: {
  date: string;
  filteredStages: Stage[];
  eventSlug: string;
  searchQuery?: string;
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Get sessions for this date from already filtered stages
  const stagesWithSessions = filteredStages
    .map((stage) => ({
      stage,
      sessions: stage.sessions.filter((s) => s.scheduledDate === date),
    }))
    .filter((s) => s.sessions.length > 0);

  return (
    <div className="space-y-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-3 py-3 px-4 bg-primary-teal-50 rounded-lg hover:bg-primary-teal-100 transition-colors"
      >
        <ChevronDown
          className={`h-5 w-5 text-primary-teal-600 transition-transform ${isExpanded ? "" : "-rotate-90"}`}
        />
        <Calendar className="h-5 w-5 text-primary-teal-600" />
        <h2 className="text-lg font-bold text-gray-900">
          {formatSessionDate(date)}
        </h2>
      </button>

      {isExpanded && (
        <div className="space-y-4 pl-4">
          {stagesWithSessions.map(({ stage, sessions }) => (
            <StageSection key={stage.id} stage={stage} sessions={sessions} eventSlug={eventSlug} searchQuery={searchQuery} />
          ))}
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
  const [selectedStage, setSelectedStage] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<string>("all");

  // Get mock event data
  const event = getMockEventData(resolvedParams.eventSlug);

  // Get unique stages and dates for filters
  const uniqueStages = getUniqueStages(event.stages);
  const uniqueDates = getUniqueDates(event.stages);

  // Filter sessions based on search and filters
  const filteredStages = useMemo(() => {
    return event.stages
      .filter((stage) => selectedStage === "all" || stage.name === selectedStage)
      .map((stage) => ({
        ...stage,
        sessions: stage.sessions.filter((session) => {
          const matchesDate =
            selectedDate === "all" || session.scheduledDate === selectedDate;
          const matchesSearch =
            searchQuery === "" ||
            session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            session.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
            session.presenters.some((p) =>
              p.toLowerCase().includes(searchQuery.toLowerCase())
            );
          return matchesDate && matchesSearch;
        }),
      }))
      .filter((stage) => stage.sessions.length > 0);
  }, [event.stages, selectedStage, selectedDate, searchQuery]);

  // Get filtered dates
  const filteredDates = useMemo(() => {
    const dates = new Set<string>();
    filteredStages.forEach((stage) => {
      stage.sessions.forEach((session) => {
        dates.add(session.scheduledDate);
      });
    });
    return Array.from(dates).sort();
  }, [filteredStages]);

  const totalFilteredSessions = filteredStages.reduce(
    (acc, stage) => acc + stage.sessions.length,
    0
  );

  return (
    <div className="min-h-screen bg-white">
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
              <span>{event.sessionCount} Presentations</span>
            </div>
            <span className="text-gray-300">•</span>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary-teal-600" />
              <span>{event.stageCount} Stages</span>
            </div>
          </div>
          <p className="text-gray-600 max-w-3xl">
            {event.description}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-[52px] z-40">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[200px] max-w-sm relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search summaries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-9 border-gray-200"
              />
            </div>
            <Select value={selectedStage} onValueChange={setSelectedStage}>
              <SelectTrigger className="w-[160px] h-9 border-gray-200">
                <SelectValue placeholder="All Stages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                {uniqueStages.map((stage) => (
                  <SelectItem key={stage} value={stage}>
                    {stage}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedDate} onValueChange={setSelectedDate}>
              <SelectTrigger className="w-[160px] h-9 border-gray-200">
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
            <span className="text-sm text-gray-400">
              {totalFilteredSessions} {totalFilteredSessions === 1 ? "result" : "results"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {filteredDates.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No summaries found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredDates.map((date) => (
              <DateSection
                key={date}
                date={date}
                filteredStages={filteredStages}
                eventSlug={resolvedParams.eventSlug}
                searchQuery={searchQuery}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-16">
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
