"use client";

import React, { useState, useMemo, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  ChevronDown,
  ChevronLeft,
  Download,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { WaysToJoinModal } from "@/components/WaysToJoinModal";
import { PresentationEditDrawer } from "@/components/events/PresentationEditDrawer";
import { StageAccordion } from "@/components/events/StageAccordion";

// Data interfaces (will be imported from shared types in production)
interface Session {
  id: string;
  title: string;
  presenters: string[];
  scheduledDate: string;
  scheduledStart: string;
  endTime: string;
  status: "pending" | "active" | "completed" | "skipped";
}

interface Stage {
  id: string;
  name: string;
  sessionCount: number;
  stageSessionId: string;
  passcode: string;
  sessions: Session[];
}

type EventStatus = "active" | "upcoming" | "past";

interface Event {
  id: string;
  name: string;
  dateRange: string;
  startDate: Date;
  endDate: Date;
  stageCount: number;
  sessionCount: number;
  description: string;
  publicSummaryUrl?: string;
  stages: Stage[];
}

// Helper functions
function getEventStatus(startDate: Date, endDate: Date): EventStatus {
  const now = new Date();
  if (now >= startDate && now <= endDate) {
    return "active";
  } else if (now < startDate) {
    return "upcoming";
  } else {
    return "past";
  }
}

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

function groupSessionsByDate(sessions: Session[]): [string, Session[]][] {
  const grouped = sessions.reduce((acc, session) => {
    const date = session.scheduledDate;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(session);
    return acc;
  }, {} as Record<string, Session[]>);

  return Object.entries(grouped).sort(([dateA], [dateB]) =>
    dateA.localeCompare(dateB)
  );
}

function isSessionToday(sessionDate: string): boolean {
  const today = new Date().toISOString().split("T")[0];
  return sessionDate === today;
}

function hasSessionsToday(stage: Stage): boolean {
  return stage.sessions.some((session) => isSessionToday(session.scheduledDate));
}

// Helper to get relative dates
const getRelativeDate = (daysFromNow: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date;
};

const formatDateRange = (startDate: Date, endDate: Date): string => {
  const start = startDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
  const end = endDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  return `${start}-${endDate.getDate()}, ${endDate.getFullYear()}`;
};

// Generate mock event data based on event ID
function getMockEventData(eventId: string): Event {
  // Map of event IDs to event data
  const eventDataMap: Record<string, Partial<Event>> = {
    "evt-001": {
      name: "AI & Machine Learning Summit 2024",
      startDate: getRelativeDate(0),
      endDate: getRelativeDate(1),
      description: "Live conference on the latest advances in AI, machine learning, and deep learning technologies",
      publicSummaryUrl: "/public/ai-ml-summit-2024",
    },
    "evt-002": {
      name: "Cloud Infrastructure & DevOps Summit",
      startDate: getRelativeDate(7),
      endDate: getRelativeDate(8),
      description: "Two-day summit focused on cloud architecture, Kubernetes, and modern DevOps practices",
      publicSummaryUrl: "/public/cloud-devops-summit-2024",
    },
    "evt-003": {
      name: "Frontend Development Conference 2024",
      startDate: getRelativeDate(14),
      endDate: getRelativeDate(15),
      description: "Explore the latest in frontend technologies, React, Vue, and modern web development",
    },
  };

  const eventData = eventDataMap[eventId] || eventDataMap["evt-001"];
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  return {
    id: eventId,
    name: eventData.name || "Sample Event",
    dateRange: formatDateRange(eventData.startDate || getRelativeDate(0), eventData.endDate || getRelativeDate(1)),
    startDate: eventData.startDate || getRelativeDate(0),
    endDate: eventData.endDate || getRelativeDate(1),
    stageCount: 3,
    sessionCount: 12,
    description: eventData.description || "A comprehensive conference featuring industry experts",
    publicSummaryUrl: eventData.publicSummaryUrl,
    stages: [
      {
        id: "stage-001",
        name: "Main Auditorium",
        sessionCount: 5,
        stageSessionId: "MAIN-1234",
        passcode: "123456",
        sessions: [
          {
            id: "ses-001",
            title: "Opening Keynote: The Future of Technology",
            presenters: ["Dr. Sarah Chen", "John Smith"],
            scheduledDate: today,
            scheduledStart: "09:00",
            endTime: "10:30",
            status: "pending",
          },
          {
            id: "ses-002",
            title: "Scalable Architecture Patterns",
            presenters: ["Mike Rodriguez"],
            scheduledDate: today,
            scheduledStart: "11:00",
            endTime: "12:00",
            status: "pending",
          },
          {
            id: "ses-003",
            title: "Security Best Practices",
            presenters: ["Alex Thompson"],
            scheduledDate: today,
            scheduledStart: "13:30",
            endTime: "14:30",
            status: "pending",
          },
          {
            id: "ses-004",
            title: "Building Modern Applications",
            presenters: ["Jennifer Wu"],
            scheduledDate: tomorrow,
            scheduledStart: "09:00",
            endTime: "10:30",
            status: "pending",
          },
          {
            id: "ses-005",
            title: "Performance Optimization Techniques",
            presenters: ["Robert Kim", "Dr. Lisa Wang"],
            scheduledDate: tomorrow,
            scheduledStart: "11:00",
            endTime: "12:30",
            status: "pending",
          },
        ],
      },
      {
        id: "stage-002",
        name: "Workshop Room A",
        sessionCount: 4,
        stageSessionId: "WORK-5678",
        passcode: "234567",
        sessions: [
          {
            id: "ses-006",
            title: "Hands-on Workshop: Advanced Techniques",
            presenters: ["Lisa Park", "David Martinez"],
            scheduledDate: today,
            scheduledStart: "09:00",
            endTime: "11:00",
            status: "pending",
          },
          {
            id: "ses-007",
            title: "Interactive Coding Session",
            presenters: ["Emily Zhang"],
            scheduledDate: today,
            scheduledStart: "11:30",
            endTime: "13:00",
            status: "pending",
          },
          {
            id: "ses-008",
            title: "Deep Dive: Technical Patterns",
            presenters: ["Tom Anderson"],
            scheduledDate: today,
            scheduledStart: "14:00",
            endTime: "15:30",
            status: "pending",
          },
          {
            id: "ses-009",
            title: "Real-world Case Studies",
            presenters: ["Rachel Green", "Bob Johnson"],
            scheduledDate: tomorrow,
            scheduledStart: "10:00",
            endTime: "11:30",
            status: "pending",
          },
        ],
      },
      {
        id: "stage-003",
        name: "Breakout Room B",
        sessionCount: 3,
        stageSessionId: "BREK-1234",
        passcode: "345678",
        sessions: [
          {
            id: "ses-010",
            title: "Panel Discussion: Industry Trends",
            presenters: ["Multiple Speakers"],
            scheduledDate: today,
            scheduledStart: "10:00",
            endTime: "11:30",
            status: "pending",
          },
          {
            id: "ses-011",
            title: "Networking Session",
            presenters: ["Event Staff"],
            scheduledDate: today,
            scheduledStart: "12:00",
            endTime: "13:30",
            status: "pending",
          },
          {
            id: "ses-012",
            title: "Closing Remarks",
            presenters: ["Conference Host"],
            scheduledDate: tomorrow,
            scheduledStart: "16:00",
            endTime: "17:00",
            status: "pending",
          },
        ],
      },
    ],
  };
}

// Copy Button Component
export default function EventDetailPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [selectedTab, setSelectedTab] = useState<"active" | "upcoming" | "past" | "all">("active");
  const [waysToJoinModal, setWaysToJoinModal] = useState<{
    stage: Stage | null;
    eventName: string | null;
  }>({ stage: null, eventName: null });
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<{
    session: Session;
    eventName: string;
    stageName: string;
    stageSessionId: string;
    stagePasscode: string;
  } | null>(null);
  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set());

  // Generate mock event data based on the event ID
  // In production, this would be fetched from an API
  const event: Event = getMockEventData(resolvedParams.eventId);

  const eventStatus = getEventStatus(event.startDate, event.endDate);
  const isPastEvent = eventStatus === "past";

  // Group all sessions by date across all stages
  const sessionsByDate = useMemo(() => {
    const grouped: Record<string, Array<{ stage: Stage; session: Session }>> = {};
    
    event.stages.forEach((stage) => {
      stage.sessions.forEach((session) => {
        if (!grouped[session.scheduledDate]) {
          grouped[session.scheduledDate] = [];
        }
        grouped[session.scheduledDate].push({ stage, session });
      });
    });

    // Sort sessions within each date by time
    Object.keys(grouped).forEach((date) => {
      grouped[date].sort((a, b) => 
        a.session.scheduledStart.localeCompare(b.session.scheduledStart)
      );
    });

    return grouped;
  }, [event.stages]);

  // Filter dates based on selected tab
  const filteredDates = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const allDates = Object.keys(sessionsByDate).sort();

    if (selectedTab === "all") {
      return allDates;
    }

    if (selectedTab === "active") {
      // Show only today's date
      return allDates.filter((date) => date === today);
    }

    if (selectedTab === "upcoming") {
      // Show future dates
      return allDates.filter((date) => date > today);
    }

    if (selectedTab === "past") {
      // Show past dates
      return allDates.filter((date) => date < today);
    }

    return allDates;
  }, [sessionsByDate, selectedTab]);

  // Auto-expand today's date on mount
  React.useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setExpandedDates(new Set([today]));
  }, [selectedTab]);

  const toggleDateExpansion = (date: string) => {
    const newExpanded = new Set(expandedDates);
    if (newExpanded.has(date)) {
      newExpanded.delete(date);
    } else {
      newExpanded.add(date);
    }
    setExpandedDates(newExpanded);
  };

  const handleStartStage = (
    stage: Stage,
    eventName: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setWaysToJoinModal({
      stage,
      eventName,
    });
  };

  const handleWaysToJoin = (
    stage: Stage,
    eventName: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setWaysToJoinModal({
      stage,
      eventName,
    });
  };

  const handleEditSession = (
    session: Session,
    eventName: string,
    stage: Stage,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setEditingSession({
      session,
      eventName,
      stageName: stage.name,
      stageSessionId: stage.stageSessionId,
      stagePasscode: stage.passcode,
    });
    setIsEditDrawerOpen(true);
  };

  const handleDownloadForAV = () => {
    // Generate CSV content with event details for AV crew
    const csvRows = [];

    // Header
    csvRows.push(
      "Event,Stage,Session ID,Passcode,Presentation Title,Presenters,Date,Start Time,End Time,Present URL"
    );

    // Data rows for each stage and presentation
    event.stages.forEach((stage) => {
      const presentUrl = `https://present.wordly.ai/${stage.stageSessionId}`;

      stage.sessions.forEach((session) => {
        const row = [
          `"${event.name}"`,
          `"${stage.name}"`,
          stage.stageSessionId,
          stage.passcode,
          `"${session.title}"`,
          `"${session.presenters.join(", ")}"`,
          session.scheduledDate,
          session.scheduledStart,
          session.endTime,
          presentUrl,
        ];
        csvRows.push(row.join(","));
      });
    });

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${event.name.replace(/\s+/g, "-")}-AV-Details.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const mainContent = (
    <div className="h-full overflow-y-auto bg-white">
      {/* Page header */}
      <div className="border-b">
        <div className="px-6 py-6">
          {/* Back button and title */}
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => router.push("/events")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-gray-900">
                Event: {event.name}
              </h1>
              <p className="text-sm text-gray-600 mt-1">{event.description}</p>
            </div>
          </div>

          {/* Event metadata */}
          <div className="flex items-center gap-2 text-sm mb-3">
            <Calendar className="h-4 w-4 text-primary-teal-600" />
            <span className="text-gray-700 font-medium">{event.dateRange}</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600">{event.stageCount} stages</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600">{event.sessionCount} presentations</span>
          </div>

          {/* Action links */}
          <div className="flex items-center gap-4 mb-6">
            {event.publicSummaryUrl && (
              <a
                href={event.publicSummaryUrl}
                className="inline-flex items-center gap-1.5 text-sm text-primary-teal-600 hover:text-primary-teal-700 font-medium"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Public Summaries Page</span>
              </a>
            )}
            <button
              onClick={handleDownloadForAV}
              className="inline-flex items-center gap-1.5 text-sm text-primary-teal-600 hover:text-primary-teal-700 font-medium"
            >
              <Download className="h-4 w-4" />
              <span>Download for AV</span>
            </button>
          </div>

          {/* Tab navigation */}
          <Tabs value={selectedTab} onValueChange={(value: any) => setSelectedTab(value)}>
            <TabsList>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Schedule grouped by date */}
      <div className="p-6 space-y-6">
        {filteredDates.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-600">
              {selectedTab === "active" && "No sessions scheduled for today"}
              {selectedTab === "upcoming" && "No upcoming sessions"}
              {selectedTab === "past" && "No past sessions"}
            </p>
          </Card>
        ) : (
          // Display dates first, then stages within each date
          filteredDates.map((date) => {
            const sessionsForDate = sessionsByDate[date];
            
            // Group sessions by stage for this date
            const stageSessionsMap = sessionsForDate.reduce((acc, { stage, session }) => {
              if (!acc[stage.id]) {
                acc[stage.id] = {
                  stage,
                  sessions: [],
                };
              }
              acc[stage.id].sessions.push(session);
              return acc;
            }, {} as Record<string, { stage: Stage; sessions: Session[] }>);

            const stagesList = Object.values(stageSessionsMap);

            const isDateExpanded = expandedDates.has(date);

            return (
              <div
                key={date}
                className={`relative transition-all duration-200 border rounded-lg ${
                  isDateExpanded 
                    ? "border-gray-300 bg-gray-50/30 shadow-sm" 
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                {/* Date Header - Collapsible Accordion */}
                <button
                  onClick={() => toggleDateExpansion(date)}
                  className="w-full p-6 text-left"
                >
                  <div className="flex items-center gap-3">
                    <ChevronDown
                      className={`h-5 w-5 text-primary-teal-600 transition-transform duration-200 flex-shrink-0 ${
                        isDateExpanded ? "rotate-0" : "-rotate-90"
                      }`}
                    />
                    <Calendar className="h-5 w-5 text-primary-teal-600" />
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {formatSessionDate(date)}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {sessionsForDate.length} {sessionsForDate.length === 1 ? "presentation" : "presentations"} across {stagesList.length} {stagesList.length === 1 ? "stage" : "stages"}
                      </p>
                    </div>
                  </div>
                </button>

                {/* Stages for this date */}
                {isDateExpanded && (
                  <div className="px-6 pb-6 pt-2 space-y-3">
                    {stagesList.map(({ stage, sessions }) => {
                      // Create a modified stage object with only sessions for this date
                      const stageWithDateSessions = {
                        ...stage,
                        sessions: sessions,
                      };

                      return (
                        <StageAccordion
                          key={stage.id}
                          stage={stageWithDateSessions}
                          defaultExpanded={true}
                          onStartStage={(stage, e) => handleStartStage(stage, event.name, e)}
                          onLinksToJoin={(stage, e) => handleWaysToJoin(stage, event.name, e)}
                          onEditSession={(session, stage, e) =>
                            handleEditSession(session, event.name, stage, e)
                          }
                          isPastEvent={isPastEvent}
                          showCredentials={true}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Ways to Join Modal */}
      {waysToJoinModal.stage && (
        <WaysToJoinModal
          isOpen={!!waysToJoinModal.stage}
          onClose={() => setWaysToJoinModal({ stage: null, eventName: null })}
          sessionId={waysToJoinModal.stage.stageSessionId}
          passcode={waysToJoinModal.stage.passcode}
          roomName={waysToJoinModal.stage.name}
          type="stage"
          sessionCount={waysToJoinModal.stage.sessions.length}
          sessions={waysToJoinModal.stage.sessions.map((s) => ({
            title: s.title,
            scheduledStart: s.scheduledStart,
            endTime: s.endTime,
          }))}
        />
      )}
    </div>
  );

  return (
    <div className="h-full">
      {isEditDrawerOpen && editingSession ? (
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel defaultSize={60} minSize={45}>
            {mainContent}
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={40} minSize={30}>
            <div className="h-full flex flex-col bg-white border-l">
              {/* Custom header */}
              <div className="border-b px-6 py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Presentation
                  </h2>
                  <p className="text-sm text-gray-600 mt-0.5">
                    {editingSession.eventName} · {editingSession.stageName}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsEditDrawerOpen(false);
                    setEditingSession(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              {/* Presentation edit form */}
              <div className="flex-1 overflow-y-auto">
                <PresentationEditDrawer
                  session={editingSession.session}
                  isOpen={true}
                  onClose={() => {
                    setIsEditDrawerOpen(false);
                    setEditingSession(null);
                  }}
                  onSave={(updatedSession) => {
                    console.log("Save presentation:", updatedSession);
                    setIsEditDrawerOpen(false);
                    setEditingSession(null);
                  }}
                  inline={true}
                  stageName={editingSession.stageName}
                  stageSessionId={editingSession.stageSessionId}
                  stagePasscode={editingSession.stagePasscode}
                />
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      ) : (
        mainContent
      )}
    </div>
  );
}

