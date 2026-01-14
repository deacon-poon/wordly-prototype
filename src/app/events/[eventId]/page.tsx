"use client";

import React, { useState, useMemo, useEffect, use } from "react";
import {
  Calendar,
  Check,
  ChevronDown,
  Download,
  Edit2,
  ExternalLink,
  FileSpreadsheet,
  Plus,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  getStoredEvent,
  saveEvent,
  deserializeEvent,
  serializeEvent,
} from "@/lib/eventStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { WaysToJoinModal } from "@/components/WaysToJoinModal";
import { LocationAccordion } from "@/components/events/LocationAccordion";
import {
  AddLocationModal,
  EditLocationModal,
} from "@/components/events/AddLocationModal";
import { SessionPanel } from "@/components/events/SessionPanel";
import {
  UploadScheduleModal,
  type SessionDefaults,
} from "@/components/events/UploadScheduleModal";
import {
  BulkUploadReviewModal,
  type UploadedSession,
} from "@/components/events/BulkUploadReviewModal";
import type {
  LocationFormData,
  SessionFormData,
} from "@/components/events/forms";
import { parseScheduleFile } from "@/lib/utils/parseSchedule";

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
  timezone: string; // Event timezone (e.g., "America/Los_Angeles")
  locationCount: number;
  sessionCount: number;
  description: string;
  publicSummaryUrl?: string;
  locations: Location[];
}

// Helper functions
function getEventStatus(startDate: Date, endDate: Date): EventStatus {
  const now = new Date();
  // Compare dates only (ignore time) to avoid timezone issues
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const start = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate()
  );
  const end = new Date(
    endDate.getFullYear(),
    endDate.getMonth(),
    endDate.getDate()
  );

  if (today >= start && today <= end) {
    return "active";
  } else if (today < start) {
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
      timezone: "America/Los_Angeles",
      description:
        "Live conference on the latest advances in AI, machine learning, and deep learning technologies",
      publicSummaryUrl: "/public/ai-ml-summit-2024",
    },
    "evt-002": {
      name: "Cloud Infrastructure & DevOps Summit",
      startDate: getRelativeDate(7),
      endDate: getRelativeDate(8),
      timezone: "America/New_York",
      description:
        "Two-day summit focused on cloud architecture, Kubernetes, and modern DevOps practices",
      publicSummaryUrl: "/public/cloud-devops-summit-2024",
    },
    "evt-003": {
      name: "Frontend Development Conference 2024",
      startDate: getRelativeDate(14),
      endDate: getRelativeDate(15),
      timezone: "America/Los_Angeles",
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
      timezone: "America/Los_Angeles",
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
    timezone: eventData.timezone || "America/Los_Angeles",
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
  const resolvedParams = use(params);
  const [selectedTab, setSelectedTab] = useState<
    "active" | "upcoming" | "past" | "all"
  >("active");
  const [waysToJoinModal, setWaysToJoinModal] = useState<{
    location: Location | null;
    eventName: string | null;
  }>({ location: null, eventName: null });
  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set());

  // Session panel state (unified for add/edit)
  const [sessionPanelState, setSessionPanelState] = useState<{
    isOpen: boolean;
    mode: "add" | "edit";
    session?: Session;
    locationId: string;
    locationName: string;
  } | null>(null);

  // Add Location modal
  const [isAddLocationModalOpen, setIsAddLocationModalOpen] = useState(false);
  const [editLocationContext, setEditLocationContext] = useState<{
    location: Location;
  } | null>(null);
  const [isEditLocationModalOpen, setIsEditLocationModalOpen] = useState(false);

  // Event name editing
  const [isEditingEventName, setIsEditingEventName] = useState(false);
  const [editedEventName, setEditedEventName] = useState("");

  // Bulk upload flow modals
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isBulkReviewModalOpen, setIsBulkReviewModalOpen] = useState(false);
  const [parsedSessions, setParsedSessions] = useState<UploadedSession[]>([]);

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
    // Open Join web app directly (presenter entry point)
    const joinUrl = `https://join.wordly.ai/${location.locationSessionId}`;
    window.open(joinUrl, "_blank", "noopener,noreferrer");
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
    location: Location,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setSessionPanelState({
      isOpen: true,
      mode: "edit",
      session,
      locationId: location.id,
      locationName: location.name,
    });
  };

  const handleAddSession = (location: Location) => {
    setSessionPanelState({
      isOpen: true,
      mode: "add",
      locationId: location.id,
      locationName: location.name,
    });
  };

  const handleCloseSessionPanel = () => {
    setSessionPanelState(null);
  };

  const handleSaveSession = (
    sessionData: Session | SessionFormData,
    isNew: boolean,
    newLocationId?: string
  ) => {
    if (isNew) {
      // Adding new session
      const formData = sessionData as SessionFormData;
      const newSession: Session = {
        id: `ses-${Date.now()}`,
        title: formData.title,
        presenters: formData.presenters
          .split(",")
          .map((p) => p.trim())
          .filter(Boolean),
        scheduledDate: formData.scheduledDate,
        scheduledStart: formData.scheduledStart,
        endTime: formData.endTime,
        status: "pending",
      };

      // Add to selected location (which may be different from the one panel was opened from)
      const targetLocationId = newLocationId || sessionPanelState?.locationId;
      
      setEvent((prev) => ({
        ...prev,
        sessionCount: prev.sessionCount + 1,
        locations: prev.locations.map((loc) =>
          loc.id === targetLocationId
            ? {
                ...loc,
                sessions: [...loc.sessions, newSession],
                sessionCount: loc.sessionCount + 1,
              }
            : loc
        ),
      }));
      toast.success(`Session "${formData.title}" added successfully`);
    } else {
      // Editing existing session
      const updatedSession = sessionData as Session;
      const originalLocationId = sessionPanelState?.locationId;
      
      // Check if session is being moved to a different location
      if (newLocationId && newLocationId !== originalLocationId) {
        // Move session to new location
        setEvent((prev) => ({
          ...prev,
          locations: prev.locations.map((loc) => {
            if (loc.id === originalLocationId) {
              // Remove from original location
              return {
                ...loc,
                sessions: loc.sessions.filter((s) => s.id !== updatedSession.id),
                sessionCount: loc.sessionCount - 1,
              };
            }
            if (loc.id === newLocationId) {
              // Add to new location
              return {
                ...loc,
                sessions: [...loc.sessions, updatedSession],
                sessionCount: loc.sessionCount + 1,
              };
            }
            return loc;
          }),
        }));
        const newLocationName = event.locations.find((l) => l.id === newLocationId)?.name;
        toast.success(`Session moved to "${newLocationName}"`);
      } else {
        // Update in same location
        setEvent((prev) => ({
          ...prev,
          locations: prev.locations.map((loc) =>
            loc.id === originalLocationId
              ? {
                  ...loc,
                  sessions: loc.sessions.map((s) =>
                    s.id === updatedSession.id ? updatedSession : s
                  ),
                }
              : loc
          ),
        }));
        toast.success("Session updated successfully");
      }
    }

    setSessionPanelState(null);
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

  // Bulk upload handlers
  const handleBulkUpload = async (file: File, defaults: SessionDefaults) => {
    try {
      // Parse the uploaded file
      const sessions = await parseScheduleFile(file, defaults.timezone);
      
      if (sessions.length === 0) {
        toast.error("No sessions found in the file. Please check the format.");
        // Still open review modal with mock data for demo
        setParsedSessions([]);
        setIsUploadModalOpen(false);
        setIsBulkReviewModalOpen(true);
        return;
      }
      
      // Apply defaults to sessions that don't have values
      const sessionsWithDefaults = sessions.map((session) => ({
        ...session,
        timezone: session.timezone || defaults.timezone,
        glossary: session.glossary || defaults.glossaryId,
        account: session.account || defaults.accountId,
        voicePack: session.voicePack || defaults.voicePack,
        language: session.language || defaults.startingLanguage,
      }));

      setParsedSessions(sessionsWithDefaults);
      setIsUploadModalOpen(false);
      setIsBulkReviewModalOpen(true);
      
      toast.success(`Parsed ${sessions.length} sessions from file`);
    } catch (error) {
      console.error("Error parsing file:", error);
      toast.error(error instanceof Error ? error.message : "Failed to parse file");
      // Still open review modal with mock data for demo
      setParsedSessions([]);
      setIsUploadModalOpen(false);
      setIsBulkReviewModalOpen(true);
    }
  };

  const handleBulkReviewSubmit = (sessions: UploadedSession[]) => {
    console.log("handleBulkReviewSubmit called with", sessions.length, "sessions");
    console.log("Sessions data:", sessions);
    
    // Process the reviewed sessions and add them to the event
    const locationMap = new Map<
      string,
      { sessions: Session[]; locationId: string; existingLocationId?: string }
    >();

    // Check if locations already exist
    const existingLocations = new Map(
      event.locations.map((loc) => [loc.name.toLowerCase(), loc.id])
    );

    sessions.forEach((session, index) => {
      const locationName = session.location;
      const locationKey = locationName.toLowerCase();

      if (!locationMap.has(locationName)) {
        locationMap.set(locationName, {
          sessions: [],
          locationId: `loc-${Date.now()}-${index}`,
          existingLocationId: existingLocations.get(locationKey),
        });
      }

      const loc = locationMap.get(locationName)!;
      loc.sessions.push({
        id: `ses-${Date.now()}-${index}`,
        title: session.title,
        presenters: session.presenter.split(",").map((p) => p.trim()),
        scheduledDate: session.date,
        scheduledStart: session.startTime,
        endTime: session.endTime,
        status: "pending",
      });
    });

    // Update event with new locations and sessions
    setEvent((prev) => {
      const updatedLocations = [...prev.locations];

      locationMap.forEach((data, name) => {
        if (data.existingLocationId) {
          // Add sessions to existing location
          const locIndex = updatedLocations.findIndex(
            (loc) => loc.id === data.existingLocationId
          );
          if (locIndex !== -1) {
            updatedLocations[locIndex] = {
              ...updatedLocations[locIndex],
              sessions: [
                ...updatedLocations[locIndex].sessions,
                ...data.sessions,
              ],
              sessionCount:
                updatedLocations[locIndex].sessions.length +
                data.sessions.length,
            };
          }
        } else {
          // Create new location
          updatedLocations.push({
            id: data.locationId,
            name,
            sessionCount: data.sessions.length,
            locationSessionId: `LOC-${Math.random()
              .toString(36)
              .substring(2, 6)
              .toUpperCase()}`,
            passcode: Math.random().toString().substring(2, 8),
            sessions: data.sessions,
          });
        }
      });

      // Recalculate date range if needed
      const allDates = updatedLocations.flatMap((loc) =>
        loc.sessions.map((s) => new Date(s.scheduledDate))
      );
      const startDate =
        allDates.length > 0
          ? new Date(Math.min(...allDates.map((d) => d.getTime())))
          : prev.startDate;
      const endDate =
        allDates.length > 0
          ? new Date(Math.max(...allDates.map((d) => d.getTime())))
          : prev.endDate;

      const updated = {
        ...prev,
        locations: updatedLocations,
        locationCount: updatedLocations.length,
        sessionCount: updatedLocations.reduce(
          (sum, loc) => sum + loc.sessions.length,
          0
        ),
        startDate,
        endDate,
        dateRange: formatDateRange(startDate, endDate),
      };
      console.log("Updated event state:", updated);
      console.log("Updated locations:", updated.locations);
      return updated;
    });

    const newLocationsCount = Array.from(locationMap.values()).filter(
      (data) => !data.existingLocationId
    ).length;
    const totalSessions = sessions.length;

    console.log("Location map:", Array.from(locationMap.entries()));
    console.log("New locations count:", newLocationsCount);
    console.log("Total sessions:", totalSessions);

    toast.success(
      `Imported ${totalSessions} session${totalSessions > 1 ? "s" : ""}${
        newLocationsCount > 0
          ? ` across ${newLocationsCount} new location${
              newLocationsCount > 1 ? "s" : ""
            }`
          : ""
      }`
    );
    setIsBulkReviewModalOpen(false);
  };

  const mainContent = (
    <div className="h-full overflow-y-auto bg-white @container">
      {/* Page header */}
      <div>
        <div className="px-6 py-5">
          {/* Row 1: Title (editable) + Add Location */}
          <div className="flex items-center justify-between gap-3 mb-1">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              {isEditingEventName ? (
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Input
                    value={editedEventName}
                    onChange={(e) => setEditedEventName(e.target.value)}
                    className="text-xl font-semibold h-9 max-w-md"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && editedEventName.trim()) {
                        setEvent((prev) => ({
                          ...prev,
                          name: editedEventName.trim(),
                        }));
                        setIsEditingEventName(false);
                        toast.success("Event name updated");
                      } else if (e.key === "Escape") {
                        setIsEditingEventName(false);
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      if (editedEventName.trim()) {
                        setEvent((prev) => ({
                          ...prev,
                          name: editedEventName.trim(),
                        }));
                        setIsEditingEventName(false);
                        toast.success("Event name updated");
                      }
                    }}
                    className="p-1.5 hover:bg-green-100 rounded-md transition-colors text-green-600 flex-shrink-0"
                    title="Save"
                  >
                    <Check className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setIsEditingEventName(false)}
                    className="p-1.5 hover:bg-gray-100 rounded-md transition-colors text-gray-500 flex-shrink-0"
                    title="Cancel"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 min-w-0">
                  <h1 className="text-2xl font-semibold text-gray-900 truncate">
                    {event.name}
                  </h1>
                  <button
                    onClick={() => {
                      setEditedEventName(event.name);
                      setIsEditingEventName(true);
                    }}
                    className="p-1.5 hover:bg-gray-100 rounded-md transition-colors flex-shrink-0"
                    title="Edit event name"
                    aria-label="Edit event name"
                  >
                    <Edit2 className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
              )}
            </div>
            {/* Add Location button - primary action */}
            <Button
              onClick={() => setIsAddLocationModalOpen(true)}
              disabled={isPastEvent}
              className="bg-primary-teal-600 hover:bg-primary-teal-700 text-white flex-shrink-0"
              title={isPastEvent ? "Cannot add to past events" : "Add Location"}
            >
              <Plus className="h-4 w-4 @sm:mr-2" />
              <span className="hidden @sm:inline">Add Location</span>
            </Button>
          </div>

          {/* Row 2: Metadata + Public Summary Link */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-600 mb-4">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-gray-400" />
              {event.dateRange}
            </span>
            <span className="text-gray-300 hidden @sm:inline">·</span>
            <span>{event.locationCount} locations</span>
            <span className="text-gray-300">·</span>
            <span>{event.sessionCount} presentations</span>
            {event.publicSummaryUrl && (
              <>
                <span className="text-gray-300">·</span>
                <a
                  href={event.publicSummaryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-primary-teal-600 hover:text-primary-teal-700 font-medium"
                >
                  <ExternalLink className="h-4 w-4" />
                  Public Summaries Page
                </a>
              </>
            )}
          </div>

          {/* Row 3: Tabs (left) + Actions (right) - container-query responsive */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Tabs
              value={selectedTab}
              onValueChange={(value: any) => setSelectedTab(value)}
              className="flex-shrink-0"
            >
              <TabsList>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="past">Past</TabsTrigger>
                <TabsTrigger value="all">All</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Actions - responsive based on container width */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Only show bulk download when there are locations with sessions */}
              {event.locations.some((loc) => loc.sessions.length > 0) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDownloadForAV}
                  className="text-gray-600 hover:text-gray-900"
                  title="Bulk Download Links"
                >
                  <Download className="h-4 w-4 @md:mr-1.5" />
                  <span className="hidden @md:inline">Bulk Download Links</span>
                </Button>
              )}
              <Button
                onClick={() => setIsUploadModalOpen(true)}
                size="sm"
                variant="outline"
                disabled={isPastEvent}
                title={
                  isPastEvent
                    ? "Cannot add to past events"
                    : event.sessionCount > 0
                    ? "Replace all sessions with a new schedule from spreadsheet"
                    : "Upload locations and sessions from spreadsheet"
                }
              >
                <FileSpreadsheet className="h-4 w-4 @md:mr-1" />
                <span className="hidden @md:inline">
                  {event.sessionCount > 0 ? "Replace Schedule" : "Upload Schedule"}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule grouped by date */}
      <div className="px-6 pb-6 pt-4 space-y-4">
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
                  defaultExpanded={true}
                  eventTimezone={event.timezone}
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
                      toast.success(`Location "${location.name}" deleted`);
                    }
                  }}
                  onAddSession={handleAddSession}
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
            {/* New event - no locations at all */}
            {event.locations.length === 0 ? (
              <div className="space-y-2">
                <p className="text-gray-700 font-medium">
                  This is a new event
                </p>
                <p className="text-gray-600">
                  Click <span className="font-medium">Add Location</span> to add
                  locations one at a time, or{" "}
                  <span className="font-medium">Upload Schedule</span> to bulk
                  import from a spreadsheet.
                </p>
              </div>
            ) : (
              <p className="text-gray-600">
                {selectedTab === "active" && "No sessions scheduled for today"}
                {selectedTab === "upcoming" && "No upcoming sessions"}
                {selectedTab === "past" && "No past sessions"}
                {selectedTab === "all" && "No sessions found"}
              </p>
            )}
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
                className={`relative transition-all duration-200 rounded-lg ${
                  isDateExpanded
                    ? "border border-gray-300 bg-white shadow-sm"
                    : "border border-gray-200 bg-white hover:border-gray-300"
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
                          eventTimezone={event.timezone}
                          onStartLocation={(location, e) =>
                            handleStartLocation(location, event.name, e)
                          }
                          onLinksToJoin={(location, e) =>
                            handleWaysToJoin(location, event.name, e)
                          }
                          onEditSession={(session, location, e) =>
                            handleEditSession(session, location, e)
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
                          onAddSession={handleAddSession}
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
          passcode={waysToJoinModal.location.passcode}
        />
      )}

      {/* Add Location Modal */}
      <AddLocationModal
        open={isAddLocationModalOpen}
        onOpenChange={setIsAddLocationModalOpen}
        eventName={event.name}
        onSave={async (locationData: LocationFormData) => {
          // Create a new empty location with generated IDs
          const newLocation: Location = {
            id: `loc-${Date.now()}`,
            name: locationData.name,
            sessionCount: 0,
            locationSessionId:
              locationData.locationSessionId ||
              `LOC-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
            passcode:
              locationData.passcode || Math.random().toString().substring(2, 8),
            sessions: [],
          };

          // Update event state with new location
          setEvent((prev) => ({
            ...prev,
            locations: [...prev.locations, newLocation],
            locationCount: prev.locationCount + 1,
          }));

          toast.success(`Location "${locationData.name}" added successfully`);
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

            toast.success("Location renamed successfully");
            setIsEditLocationModalOpen(false);
            setEditLocationContext(null);
          }}
        />
      )}

      {/* Upload Schedule Modal */}
      <UploadScheduleModal
        open={isUploadModalOpen}
        onOpenChange={setIsUploadModalOpen}
        onUpload={handleBulkUpload}
        hasExistingSessions={event.sessionCount > 0}
      />

      {/* Bulk Upload Review Modal */}
      <BulkUploadReviewModal
        open={isBulkReviewModalOpen}
        onOpenChange={setIsBulkReviewModalOpen}
        onSubmit={handleBulkReviewSubmit}
        initialSessions={parsedSessions}
      />
    </div>
  );

  return (
    <div className="h-full">
      {sessionPanelState?.isOpen ? (
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel defaultSize={65} minSize={50}>
            {mainContent}
          </ResizablePanel>
          <ResizableHandle className="w-px bg-transparent hover:bg-gray-300 transition-colors" />
          <ResizablePanel defaultSize={35} minSize={25} maxSize={50}>
            <SessionPanel
              mode={sessionPanelState.mode}
              session={sessionPanelState.session}
              locationName={sessionPanelState.locationName}
              locationId={sessionPanelState.locationId}
              eventName={event.name}
              defaultDate={event.startDate.toISOString().split("T")[0]}
              locations={event.locations.map((loc) => ({ id: loc.id, name: loc.name }))}
              onClose={handleCloseSessionPanel}
              onSave={handleSaveSession}
              onAddLocation={() => setIsAddLocationModalOpen(true)}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      ) : (
        mainContent
      )}
    </div>
  );
}
