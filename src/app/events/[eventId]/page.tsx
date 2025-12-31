"use client";

import React, { useState, useMemo, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  ChevronDown,
  ChevronLeft,
  Download,
  ExternalLink,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getStoredEvent,
  saveEvent,
  deserializeEvent,
  serializeEvent,
} from "@/lib/eventStore";
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
import { LocationAccordion } from "@/components/events/LocationAccordion";
import {
  AddLocationModal,
  EditLocationModal,
} from "@/components/events/AddLocationModal";
import { AddSessionModal } from "@/components/events/AddSessionModal";
import type {
  LocationFormData,
  SessionFormData,
} from "@/components/events/forms";

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

interface Location {
  id: string;
  name: string;
  sessionCount: number;
  locationSessionId: string;
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
  locationCount: number;
  sessionCount: number;
  description: string;
  publicSummaryUrl?: string;
  locations: Location[];
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

function hasSessionsToday(location: Location): boolean {
  return location.sessions.some((session) =>
    isSessionToday(session.scheduledDate)
  );
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
  // First, check if the event exists in localStorage (user-created events)
  const storedEvent = getStoredEvent(eventId);
  if (storedEvent) {
    return deserializeEvent(storedEvent);
  }

  // Map of event IDs to event data (demo events)
  const eventDataMap: Record<string, Partial<Event>> = {
    "evt-001": {
      name: "AI & Machine Learning Summit 2024",
      startDate: getRelativeDate(0),
      endDate: getRelativeDate(1),
      description:
        "Live conference on the latest advances in AI, machine learning, and deep learning technologies",
      publicSummaryUrl: "/public/ai-ml-summit-2024",
    },
    "evt-002": {
      name: "Cloud Infrastructure & DevOps Summit",
      startDate: getRelativeDate(7),
      endDate: getRelativeDate(8),
      description:
        "Two-day summit focused on cloud architecture, Kubernetes, and modern DevOps practices",
      publicSummaryUrl: "/public/cloud-devops-summit-2024",
    },
    "evt-003": {
      name: "Frontend Development Conference 2024",
      startDate: getRelativeDate(14),
      endDate: getRelativeDate(15),
      description:
        "Explore the latest in frontend technologies, React, Vue, and modern web development",
    },
  };

  const eventData = eventDataMap[eventId];
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  // For new events (not in our mock data), return an empty event
  if (!eventData) {
    return {
      id: eventId,
      name: "New Event",
      dateRange: formatDateRange(getRelativeDate(0), getRelativeDate(1)),
      startDate: getRelativeDate(0),
      endDate: getRelativeDate(1),
      locationCount: 0,
      sessionCount: 0,
      description: "Add locations and sessions to get started",
      locations: [],
    };
  }

  return {
    id: eventId,
    name: eventData.name || "Sample Event",
    dateRange: formatDateRange(
      eventData.startDate || getRelativeDate(0),
      eventData.endDate || getRelativeDate(1)
    ),
    startDate: eventData.startDate || getRelativeDate(0),
    endDate: eventData.endDate || getRelativeDate(1),
    locationCount: 3,
    sessionCount: 12,
    description:
      eventData.description ||
      "A comprehensive conference featuring industry experts",
    publicSummaryUrl: eventData.publicSummaryUrl,
    locations: [
      {
        id: "loc-001",
        name: "Main Auditorium",
        sessionCount: 5,
        locationSessionId: "MAIN-1234",
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
        id: "loc-002",
        name: "Workshop Room A",
        sessionCount: 4,
        locationSessionId: "WORK-5678",
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
        id: "loc-003",
        name: "Breakout Room B",
        sessionCount: 3,
        locationSessionId: "BREK-1234",
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
  const [selectedTab, setSelectedTab] = useState<
    "active" | "upcoming" | "past" | "all"
  >("active");
  const [waysToJoinModal, setWaysToJoinModal] = useState<{
    location: Location | null;
    eventName: string | null;
  }>({ location: null, eventName: null });
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<{
    session: Session;
    eventName: string;
    locationName: string;
    locationSessionId: string;
    locationPasscode: string;
  } | null>(null);
  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set());

  // Add Location/Session modals
  const [isAddLocationModalOpen, setIsAddLocationModalOpen] = useState(false);
  const [isAddSessionModalOpen, setIsAddSessionModalOpen] = useState(false);
  const [addSessionContext, setAddSessionContext] = useState<{
    locationName: string;
    locationSessionId: string;
    locationPasscode: string;
  } | null>(null);
  const [editLocationContext, setEditLocationContext] = useState<{
    location: Location;
  } | null>(null);
  const [isEditLocationModalOpen, setIsEditLocationModalOpen] = useState(false);

  // Generate mock event data based on the event ID
  // In production, this would be fetched from an API
  // Using state so we can update it when adding locations/sessions
  const [event, setEvent] = useState<Event>(() =>
    getMockEventData(resolvedParams.eventId)
  );

  // Save event changes to localStorage for persistence
  useEffect(() => {
    // Only save user-created events (not demo events)
    if (
      event.id.startsWith("evt-") &&
      !["evt-001", "evt-002", "evt-003"].includes(event.id)
    ) {
      saveEvent(serializeEvent(event));
    }
  }, [event]);

  const eventStatus = getEventStatus(event.startDate, event.endDate);
  const isPastEvent = eventStatus === "past";

  // Group all sessions by date across all locations
  const sessionsByDate = useMemo(() => {
    const grouped: Record<
      string,
      Array<{ location: Location; session: Session }>
    > = {};

    event.locations.forEach((location) => {
      location.sessions.forEach((session) => {
        if (!grouped[session.scheduledDate]) {
          grouped[session.scheduledDate] = [];
        }
        grouped[session.scheduledDate].push({ location, session });
      });
    });

    // Sort sessions within each date by time
    Object.keys(grouped).forEach((date) => {
      grouped[date].sort((a, b) =>
        a.session.scheduledStart.localeCompare(b.session.scheduledStart)
      );
    });

    return grouped;
  }, [event.locations]);

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

  const handleStartLocation = (
    location: Location,
    eventName: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    // Open Present web app directly
    const presentUrl = `https://present.wordly.ai/${location.locationSessionId}`;
    window.open(presentUrl, "_blank", "noopener,noreferrer");
  };

  const handleWaysToJoin = (
    location: Location,
    eventName: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setWaysToJoinModal({
      location,
      eventName,
    });
  };

  const handleEditSession = (
    session: Session,
    eventName: string,
    location: Location,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setEditingSession({
      session,
      eventName,
      locationName: location.name,
      locationSessionId: location.locationSessionId,
      locationPasscode: location.passcode,
    });
    setIsEditDrawerOpen(true);
  };

  const handleDownloadForAV = () => {
    // Generate CSV content with event details for AV crew
    const csvRows = [];

    // Header
    csvRows.push(
      "Event,Location,Session ID,Passcode,Presentation Title,Presenters,Date,Start Time,End Time,Present URL"
    );

    // Data rows for each location and presentation
    event.locations.forEach((location) => {
      const presentUrl = `https://present.wordly.ai/${location.locationSessionId}`;

      location.sessions.forEach((session) => {
        const row = [
          `"${event.name}"`,
          `"${location.name}"`,
          location.locationSessionId,
          location.passcode,
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
        <div className="px-6 py-5">
          {/* Row 1: Back + Title */}
          <div className="flex items-center gap-3 mb-1">
            <button
              onClick={() => router.push("/events")}
              className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-gray-500" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">
              {event.name}
            </h1>
          </div>

          {/* Row 2: Metadata */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4 ml-10">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span>{event.dateRange}</span>
            <span className="text-gray-300">·</span>
            <span>{event.locationCount} locations</span>
            <span className="text-gray-300">·</span>
            <span>{event.sessionCount} presentations</span>
          </div>

          {/* Row 3: Tabs (left) + Actions (right) */}
          <div className="flex items-center justify-between ml-10">
            <Tabs
              value={selectedTab}
              onValueChange={(value: any) => setSelectedTab(value)}
            >
              <TabsList>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="past">Past</TabsTrigger>
                <TabsTrigger value="all">All</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Actions grouped together */}
            <div className="flex items-center gap-2">
              {event.publicSummaryUrl && (
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="text-gray-600 hover:text-gray-900"
                >
                  <a
                    href={event.publicSummaryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4 mr-1.5" />
                    Public Summaries Page
                  </a>
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownloadForAV}
                className="text-gray-600 hover:text-gray-900"
              >
                <Download className="h-4 w-4 mr-1.5" />
                Bulk Download Links
              </Button>
              <Button
                onClick={() => setIsAddLocationModalOpen(true)}
                size="sm"
                disabled={isPastEvent}
                className="bg-primary-teal-600 hover:bg-primary-teal-700 text-white"
                title={
                  isPastEvent ? "Cannot add to past events" : "Add Location"
                }
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Location
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule grouped by date */}
      <div className="p-6 space-y-6">
        {/* Show locations without sessions */}
        {event.locations.filter((loc) => loc.sessions.length === 0).length >
          0 && (
          <div className="space-y-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-400" />
              <h3 className="text-sm font-semibold text-amber-800">
                Locations awaiting sessions
              </h3>
              <span className="text-xs text-amber-600">
                (
                {
                  event.locations.filter((loc) => loc.sessions.length === 0)
                    .length
                }{" "}
                {event.locations.filter((loc) => loc.sessions.length === 0)
                  .length === 1
                  ? "location"
                  : "locations"}
                )
              </span>
            </div>
            <p className="text-xs text-amber-700 ml-4">
              These locations don&apos;t have any sessions scheduled yet. Add
              sessions to schedule them on specific dates.
            </p>
            {event.locations
              .filter((loc) => loc.sessions.length === 0)
              .map((location) => (
                <LocationAccordion
                  key={location.id}
                  location={location}
                  defaultExpanded={false}
                  onStartLocation={(location, e) =>
                    handleStartLocation(location, event.name, e)
                  }
                  onLinksToJoin={(location, e) =>
                    handleWaysToJoin(location, event.name, e)
                  }
                  onRenameLocation={(location) => {
                    setEditLocationContext({ location });
                    setIsEditLocationModalOpen(true);
                  }}
                  onDeleteLocation={(location) => {
                    if (
                      confirm(
                        `Are you sure you want to delete "${location.name}"?`
                      )
                    ) {
                      setEvent((prev) => ({
                        ...prev,
                        locations: prev.locations.filter(
                          (l) => l.id !== location.id
                        ),
                        locationCount: prev.locationCount - 1,
                      }));
                    }
                  }}
                  onAddSession={(location) => {
                    setAddSessionContext({
                      locationName: location.name,
                      locationSessionId: location.locationSessionId,
                      locationPasscode: location.passcode,
                    });
                    setIsAddSessionModalOpen(true);
                  }}
                  isPastEvent={isPastEvent}
                  showCredentials={true}
                />
              ))}
          </div>
        )}

        {filteredDates.length === 0 &&
        event.locations.filter((loc) => loc.sessions.length === 0).length ===
          0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-600">
              {selectedTab === "active" && "No sessions scheduled for today"}
              {selectedTab === "upcoming" && "No upcoming sessions"}
              {selectedTab === "past" && "No past sessions"}
              {selectedTab === "all" && event.locations.length === 0 && (
                <>
                  No locations yet.{" "}
                  <button
                    onClick={() => setIsAddLocationModalOpen(true)}
                    className="text-primary-teal-600 hover:underline font-medium"
                  >
                    Add your first location
                  </button>{" "}
                  to get started.
                </>
              )}
            </p>
          </Card>
        ) : filteredDates.length > 0 ? (
          // Display dates first, then locations within each date
          filteredDates.map((date) => {
            const sessionsForDate = sessionsByDate[date];

            // Group sessions by location for this date
            const locationSessionsMap = sessionsForDate.reduce(
              (acc, { location, session }) => {
                if (!acc[location.id]) {
                  acc[location.id] = {
                    location,
                    sessions: [],
                  };
                }
                acc[location.id].sessions.push(session);
                return acc;
              },
              {} as Record<string, { location: Location; sessions: Session[] }>
            );

            const locationsList = Object.values(locationSessionsMap);

            const isDateExpanded = expandedDates.has(date);

            return (
              <div
                key={date}
                className={`relative transition-all duration-200 border rounded-lg ${
                  isDateExpanded
                    ? "border-gray-200 bg-white shadow-sm ring-1 ring-inset ring-gray-100"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                {/* Date Header - Collapsible Accordion */}
                <button
                  onClick={() => toggleDateExpansion(date)}
                  className="w-full px-4 py-4 flex items-center text-left"
                >
                  {/* Left: Icon column (fixed width for alignment) */}
                  <div className="w-8 flex-shrink-0 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary-teal-600" />
                  </div>

                  {/* Center: Date info (grows) */}
                  <div className="flex-1 flex items-center gap-3 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {formatSessionDate(date)}
                    </h3>
                    <span className="text-sm text-gray-500">
                      ({sessionsForDate.length}{" "}
                      {sessionsForDate.length === 1
                        ? "presentation"
                        : "presentations"}
                      , {locationsList.length}{" "}
                      {locationsList.length === 1 ? "location" : "locations"})
                    </span>
                  </div>

                  {/* Right: Chevron column (fixed width for alignment) */}
                  <div className="w-10 flex-shrink-0 flex items-center justify-center">
                    <ChevronDown
                      className={`h-5 w-5 text-primary-teal-600 transition-transform duration-200 ${
                        isDateExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>

                {/* Locations for this date */}
                {isDateExpanded && (
                  <div className="px-4 pb-4 pt-2 space-y-3">
                    {locationsList.map(({ location, sessions }) => {
                      // Create a modified location object with only sessions for this date
                      const locationWithDateSessions = {
                        ...location,
                        sessions: sessions,
                      };

                      return (
                        <LocationAccordion
                          key={location.id}
                          location={locationWithDateSessions}
                          defaultExpanded={true}
                          onStartLocation={(location, e) =>
                            handleStartLocation(location, event.name, e)
                          }
                          onLinksToJoin={(location, e) =>
                            handleWaysToJoin(location, event.name, e)
                          }
                          onEditSession={(session, location, e) =>
                            handleEditSession(session, event.name, location, e)
                          }
                          onRenameLocation={(location) => {
                            setEditLocationContext({ location });
                            setIsEditLocationModalOpen(true);
                          }}
                          onDeleteLocation={(location) => {
                            // In production, show confirmation dialog then call API
                            if (
                              confirm(
                                `Delete location "${location.name}"? This will also delete all sessions in this location.`
                              )
                            ) {
                              console.log("Delete location:", location.id);
                            }
                          }}
                          onAddSession={(location) => {
                            setAddSessionContext({
                              locationName: location.name,
                              locationSessionId: location.locationSessionId,
                              locationPasscode: location.passcode,
                            });
                            setIsAddSessionModalOpen(true);
                          }}
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
        ) : null}
      </div>

      {/* Ways to Join Modal */}
      {waysToJoinModal.location && waysToJoinModal.eventName && (
        <WaysToJoinModal
          open={!!waysToJoinModal.location}
          onOpenChange={(open) => {
            if (!open) {
              setWaysToJoinModal({ location: null, eventName: null });
            }
          }}
          roomSessionId={waysToJoinModal.location.locationSessionId}
          roomName={waysToJoinModal.location.name}
          eventName={waysToJoinModal.eventName}
          type="location"
          sessionCount={waysToJoinModal.location.sessions.length}
          sessions={waysToJoinModal.location.sessions.map((s) => ({
            title: s.title,
            scheduledStart: s.scheduledStart,
            endTime: s.endTime,
          }))}
        />
      )}

      {/* Add Location Modal */}
      <AddLocationModal
        open={isAddLocationModalOpen}
        onOpenChange={setIsAddLocationModalOpen}
        eventName={event.name}
        onSave={async (
          locationData: LocationFormData,
          sessions?: SessionFormData[]
        ) => {
          // Create sessions if provided from bulk upload
          const newSessions: Session[] = sessions
            ? sessions.map((s, index) => ({
                id: `session-${Date.now()}-${index}`,
                title: s.title,
                presenters: s.presenters
                  .split(",")
                  .map((p) => p.trim())
                  .filter(Boolean),
                scheduledDate: s.scheduledDate,
                scheduledStart: s.scheduledStart,
                endTime: s.endTime,
                status: "pending" as const,
              }))
            : [];

          // Create a new location with generated IDs
          const newLocation: Location = {
            id: `loc-${Date.now()}`,
            name: locationData.name,
            sessionCount: newSessions.length,
            locationSessionId:
              locationData.locationSessionId ||
              `LOC-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
            passcode:
              locationData.passcode || Math.random().toString().substring(2, 8),
            sessions: newSessions,
          };

          // Update event state with new location
          setEvent((prev) => ({
            ...prev,
            locations: [...prev.locations, newLocation],
            locationCount: prev.locationCount + 1,
            sessionCount: prev.sessionCount + newSessions.length,
          }));

          setIsAddLocationModalOpen(false);
        }}
      />

      {/* Edit Location Modal */}
      {editLocationContext && (
        <EditLocationModal
          open={isEditLocationModalOpen}
          onOpenChange={setIsEditLocationModalOpen}
          eventName={event.name}
          initialData={{
            id: editLocationContext.location.id,
            name: editLocationContext.location.name,
          }}
          onSave={async (locationData: LocationFormData) => {
            // Update the location in state
            setEvent((prev) => ({
              ...prev,
              locations: prev.locations.map((loc) =>
                loc.id === editLocationContext.location.id
                  ? { ...loc, name: locationData.name }
                  : loc
              ),
            }));

            setIsEditLocationModalOpen(false);
            setEditLocationContext(null);
          }}
        />
      )}

      {/* Add Session Modal */}
      {addSessionContext && (
        <AddSessionModal
          open={isAddSessionModalOpen}
          onOpenChange={(open) => {
            setIsAddSessionModalOpen(open);
            if (!open) {
              setAddSessionContext(null);
            }
          }}
          locationName={addSessionContext.locationName}
          locationSessionId={addSessionContext.locationSessionId}
          locationPasscode={addSessionContext.locationPasscode}
          eventName={event.name}
          defaultDate={event.startDate.toISOString().split("T")[0]}
          onSave={async (sessionData: SessionFormData) => {
            // Find the location to add the session to
            const locationId = event.locations.find(
              (loc) =>
                loc.locationSessionId === addSessionContext.locationSessionId
            )?.id;

            if (!locationId) {
              console.error("Location not found");
              return;
            }

            // Create a new session
            const newSession: Session = {
              id: `ses-${Date.now()}`,
              title: sessionData.title,
              presenters: sessionData.presenters
                .split(",")
                .map((p) => p.trim())
                .filter(Boolean),
              scheduledDate: sessionData.scheduledDate,
              scheduledStart: sessionData.scheduledStart,
              endTime: sessionData.endTime,
              status: "pending",
            };

            // Update event state with new session
            setEvent((prev) => ({
              ...prev,
              sessionCount: prev.sessionCount + 1,
              locations: prev.locations.map((loc) =>
                loc.id === locationId
                  ? {
                      ...loc,
                      sessions: [...loc.sessions, newSession],
                      sessionCount: loc.sessionCount + 1,
                    }
                  : loc
              ),
            }));

            setIsAddSessionModalOpen(false);
            setAddSessionContext(null);
          }}
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
                    {editingSession.eventName} · {editingSession.locationName}
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
                  locationName={editingSession.locationName}
                  locationSessionId={editingSession.locationSessionId}
                  locationPasscode={editingSession.locationPasscode}
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
