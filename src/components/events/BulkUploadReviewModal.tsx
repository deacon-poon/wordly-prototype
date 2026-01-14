"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  X,
  Check,
  AlertCircle,
  Loader2,
  Pencil,
  Trash2,
  Filter,
  Search,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { TIMEZONES, LANGUAGES } from "./forms/types";

// ============================================================================
// Types
// ============================================================================

export interface UploadedSession {
  id: string;
  rowNumber: number;
  location: string; // Required - groups sessions by location
  title: string;
  presenter: string;
  date: string;
  startTime: string; // Renamed from 'time' for clarity
  endTime: string; // Required per spec
  timezone: string;
  duration: number; // in minutes (calculated from start/end)
  glossary: string;
  account: string;
  voicePack: string;
  language: string;
  label?: string;
  // Validation state
  isValid: boolean;
  errors: SessionValidationError[];
}

export interface SessionValidationError {
  field: string;
  message: string;
  type: "error" | "warning";
}

type StatusFilter = "all" | "valid" | "invalid";

// ============================================================================
// Mock Data (for dropdowns)
// ============================================================================

const GLOSSARIES = [
  { id: "none", name: "None" },
  { id: "tech", name: "Technical Terms" },
  { id: "medical", name: "Medical Terminology" },
  { id: "legal", name: "Legal Terms" },
];

const ACCOUNTS = [
  { id: "1", name: "Deacon Poon (2a4...)" },
  { id: "2", name: "Main Account (8ff...)" },
  { id: "3", name: "Development (3a2...)" },
];

const VOICE_PACKS = [
  { id: "feminine", name: "Feminine Voice" },
  { id: "masculine", name: "Masculine Voice" },
  { id: "neutral", name: "Neutral Voice" },
];

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Parse time string to minutes since midnight for comparison
 */
function parseTimeToMinutes(timeStr: string): number {
  // Handle formats like "09:00", "9:00 AM", "14:30", "2:30 PM"
  const cleanTime = timeStr.trim().toUpperCase();

  // Check for AM/PM format
  const isPM = cleanTime.includes("PM");
  const isAM = cleanTime.includes("AM");
  const timeOnly = cleanTime.replace(/\s*(AM|PM)\s*/i, "").trim();

  const [hoursStr, minsStr] = timeOnly.split(":");
  let hours = parseInt(hoursStr, 10);
  const mins = parseInt(minsStr || "0", 10);

  if (isPM && hours !== 12) hours += 12;
  if (isAM && hours === 12) hours = 0;

  return hours * 60 + mins;
}

/**
 * Calculate duration in minutes between two time strings
 */
function calculateDuration(startTime: string, endTime: string): number {
  const startMins = parseTimeToMinutes(startTime);
  const endMins = parseTimeToMinutes(endTime);
  return endMins - startMins;
}

// ============================================================================
// Validation Logic
// ============================================================================

function validateSession(
  session: UploadedSession,
  allSessions: UploadedSession[]
): SessionValidationError[] {
  const errors: SessionValidationError[] = [];

  // Check for empty required fields
  if (!session.location?.trim()) {
    errors.push({
      field: "location",
      message: "Location is required",
      type: "error",
    });
  }

  if (!session.title.trim()) {
    errors.push({
      field: "title",
      message: "Title is required",
      type: "error",
    });
  }

  if (!session.presenter.trim()) {
    errors.push({
      field: "presenter",
      message: "Presenter is required",
      type: "error",
    });
  }

  if (!session.date) {
    errors.push({
      field: "date",
      message: "Date is required",
      type: "error",
    });
  }

  if (!session.startTime) {
    errors.push({
      field: "startTime",
      message: "Start time is required",
      type: "error",
    });
  }

  if (!session.endTime) {
    errors.push({
      field: "endTime",
      message: "End time is required",
      type: "error",
    });
  }

  // Validate end time is after start time
  if (session.startTime && session.endTime) {
    const startMins = parseTimeToMinutes(session.startTime);
    const endMins = parseTimeToMinutes(session.endTime);

    if (endMins <= startMins) {
      errors.push({
        field: "endTime",
        message: "End time must be after start time",
        type: "error",
      });
    }
  }

  // Get sessions in the SAME LOCATION on the same date for conflict checking
  const sameLocationSessions = allSessions.filter(
    (other) =>
      other.id !== session.id &&
      other.location === session.location &&
      other.date === session.date
  );

  // Check for exact time conflicts within same location
  const conflictingSessions = sameLocationSessions.filter(
    (other) => other.startTime === session.startTime
  );

  if (conflictingSessions.length > 0) {
    errors.push({
      field: "startTime",
      message: `Time conflict with: ${conflictingSessions
        .map((s) => s.title || `Row ${s.rowNumber}`)
        .join(", ")}`,
      type: "error",
    });
  }

  // Check for overlapping sessions within same location
  if (session.startTime && session.endTime) {
    const sessionStart = parseTimeToMinutes(session.startTime);
    const sessionEnd = parseTimeToMinutes(session.endTime);

    const overlapping = sameLocationSessions.filter((other) => {
      if (!other.startTime || !other.endTime) return false;

      const otherStart = parseTimeToMinutes(other.startTime);
      const otherEnd = parseTimeToMinutes(other.endTime);

      // Check if ranges overlap
      return sessionStart < otherEnd && sessionEnd > otherStart;
    });

    if (overlapping.length > 0) {
      errors.push({
        field: "startTime",
        message: `Overlaps with: ${overlapping
          .map((s) => s.title || `Row ${s.rowNumber}`)
          .join(", ")}`,
        type: "error",
      });
    }

    // Check for large gaps between sessions (warning only)
    // Find the next session in the same location
    const sortedLocationSessions = [...sameLocationSessions, session]
      .filter((s) => s.startTime && s.endTime)
      .sort(
        (a, b) =>
          parseTimeToMinutes(a.startTime) - parseTimeToMinutes(b.startTime)
      );

    const sessionIndex = sortedLocationSessions.findIndex(
      (s) => s.id === session.id
    );
    if (sessionIndex > 0) {
      const prevSession = sortedLocationSessions[sessionIndex - 1];
      const prevEnd = parseTimeToMinutes(prevSession.endTime);
      const gap = sessionStart - prevEnd;

      if (gap > 120) {
        // More than 2 hours gap
        errors.push({
          field: "startTime",
          message: `Large gap (${Math.round(gap / 60)}h ${
            gap % 60
          }m) from previous session`,
          type: "warning",
        });
      }
    }
  }

  // Validate duration (warning if very short or very long)
  if (session.duration < 5) {
    errors.push({
      field: "duration",
      message: "Duration is less than 5 minutes",
      type: "warning",
    });
  }

  if (session.duration > 480) {
    errors.push({
      field: "duration",
      message: "Duration exceeds 8 hours",
      type: "warning",
    });
  }

  // Warning for sessions outside typical hours (before 6am or after 10pm)
  if (session.startTime) {
    const startMins = parseTimeToMinutes(session.startTime);
    if (startMins < 360 || startMins > 1320) {
      // 6:00 AM = 360, 10:00 PM = 1320
      errors.push({
        field: "startTime",
        message: "Session scheduled outside typical hours (6am-10pm)",
        type: "warning",
      });
    }
  }

  return errors;
}

function validateAllSessions(sessions: UploadedSession[]): UploadedSession[] {
  return sessions.map((session) => {
    // Recalculate duration from start/end times
    let duration = session.duration;
    if (session.startTime && session.endTime) {
      const calculated = calculateDuration(session.startTime, session.endTime);
      if (calculated > 0) duration = calculated;
    }

    const updatedSession = { ...session, duration };
    const errors = validateSession(updatedSession, sessions);
    return {
      ...updatedSession,
      errors,
      isValid: errors.filter((e) => e.type === "error").length === 0,
    };
  });
}

// ============================================================================
// Generate Mock Upload Data
// ============================================================================

function generateMockUploadData(): UploadedSession[] {
  const baseDate = "2025-12-18";

  // Create sessions with locations - some conflicts within same location
  const mockData = [
    // Main Auditorium - has time conflicts at 1:00 PM
    {
      location: "Main Auditorium",
      startTime: "09:00",
      endTime: "10:00",
      title: "Opening Keynote",
    },
    {
      location: "Main Auditorium",
      startTime: "10:30",
      endTime: "11:30",
      title: "Product Roadmap",
    },
    {
      location: "Main Auditorium",
      startTime: "13:00",
      endTime: "14:00",
      title: "Customer Success Stories",
    },
    {
      location: "Main Auditorium",
      startTime: "13:00",
      endTime: "14:30",
      title: "Conflicting Session",
    }, // CONFLICT
    {
      location: "Main Auditorium",
      startTime: "15:00",
      endTime: "16:00",
      title: "Closing Remarks",
    },
    // Breakout Room A - valid sessions
    {
      location: "Breakout Room A",
      startTime: "09:00",
      endTime: "10:30",
      title: "Technical Workshop",
    },
    {
      location: "Breakout Room A",
      startTime: "11:00",
      endTime: "12:00",
      title: "Hands-on Lab",
    },
    {
      location: "Breakout Room A",
      startTime: "14:00",
      endTime: "15:30",
      title: "Advanced Topics",
    },
    // Breakout Room B - has an overlap
    {
      location: "Breakout Room B",
      startTime: "09:30",
      endTime: "11:00",
      title: "Design Thinking",
    },
    {
      location: "Breakout Room B",
      startTime: "10:30",
      endTime: "12:00",
      title: "Overlapping Workshop",
    }, // OVERLAP
    {
      location: "Breakout Room B",
      startTime: "13:00",
      endTime: "14:00",
      title: "UX Best Practices",
    },
    // Next day session
    {
      location: "Main Auditorium",
      startTime: "09:00",
      endTime: "10:00",
      title: "Day 2 Opening",
      date: "2025-12-19",
    },
  ];

  const sessions: UploadedSession[] = mockData.map((item, index) => ({
    id: `session-${index + 1}`,
    rowNumber: index + 1,
    location: item.location,
    title: item.title,
    presenter: "John Doe",
    date: item.date || baseDate,
    startTime: item.startTime,
    endTime: item.endTime,
    timezone: "America/Los_Angeles",
    duration: calculateDuration(item.startTime, item.endTime),
    glossary: "none",
    account: "1",
    voicePack: "feminine",
    language: "en-US",
    isValid: true,
    errors: [],
  }));

  return validateAllSessions(sessions);
}

// ============================================================================
// Props
// ============================================================================

interface BulkUploadReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (sessions: UploadedSession[]) => void;
  initialSessions?: UploadedSession[];
}

// ============================================================================
// Component
// ============================================================================

export function BulkUploadReviewModal({
  open,
  onOpenChange,
  onSubmit,
  initialSessions,
}: BulkUploadReviewModalProps) {
  // State
  const [sessions, setSessions] = useState<UploadedSession[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize/update sessions when modal opens or initialSessions changes
  useEffect(() => {
    if (open) {
      if (initialSessions && initialSessions.length > 0) {
        // Use parsed data from file upload
        console.log("Using parsed sessions:", initialSessions.length);
        setSessions(validateAllSessions(initialSessions));
      } else {
        // Fall back to mock data for demo purposes
        console.log("Using mock data");
        setSessions(generateMockUploadData());
      }
      // Reset filters when modal opens
      setStatusFilter("all");
      setSearchQuery("");
      setEditingRowId(null);
    }
  }, [open, initialSessions]);

  // Filtered and sorted sessions
  // Invalid sessions are surfaced at the top, valid at the bottom (per existing portal UX)
  const filteredSessions = useMemo(() => {
    let filtered = sessions;

    // Filter by status
    if (statusFilter === "valid") {
      filtered = filtered.filter((s) => s.isValid);
    } else if (statusFilter === "invalid") {
      filtered = filtered.filter((s) => !s.isValid);
    }

    // Filter by search query (includes location)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.title.toLowerCase().includes(query) ||
          s.presenter.toLowerCase().includes(query) ||
          s.location.toLowerCase().includes(query)
      );
    }

    // Sort: invalid sessions first, then valid sessions
    // Within each group, maintain original row order
    filtered = [...filtered].sort((a, b) => {
      if (a.isValid === b.isValid) {
        return a.rowNumber - b.rowNumber; // Maintain row order within group
      }
      return a.isValid ? 1 : -1; // Invalid first (false < true)
    });

    return filtered;
  }, [sessions, statusFilter, searchQuery]);

  // Stats
  const validCount = sessions.filter((s) => s.isValid).length;
  const invalidCount = sessions.filter((s) => !s.isValid).length;

  // Update a session field
  const updateSession = useCallback(
    (id: string, field: keyof UploadedSession, value: any) => {
      setSessions((prev) => {
        const updated = prev.map((s) =>
          s.id === id ? { ...s, [field]: value } : s
        );
        // Re-validate all sessions
        return validateAllSessions(updated);
      });
    },
    []
  );

  // Delete a session
  const deleteSession = useCallback((id: string) => {
    setSessions((prev) => {
      const filtered = prev.filter((s) => s.id !== id);
      // Re-number and re-validate
      const renumbered = filtered.map((s, i) => ({
        ...s,
        rowNumber: i + 1,
      }));
      return validateAllSessions(renumbered);
    });
  }, []);

  // Check if field has error
  const hasFieldError = (session: UploadedSession, field: string): boolean => {
    return session.errors.some((e) => e.field === field && e.type === "error");
  };

  // Check if field has warning
  const hasFieldWarning = (
    session: UploadedSession,
    field: string
  ): boolean => {
    return session.errors.some(
      (e) => e.field === field && e.type === "warning"
    );
  };

  // Get all field errors/warnings
  const getFieldErrors = (
    session: UploadedSession,
    field: string
  ): SessionValidationError[] => {
    return session.errors.filter((e) => e.field === field);
  };

  // Handle submit
  const handleSubmit = async () => {
    console.log("Submit clicked - sessions:", sessions.length, "invalid:", invalidCount, "valid:", validCount);
    
    // Get only valid sessions
    const validSessions = sessions.filter((s) => s.isValid);
    
    if (validSessions.length === 0) {
      toast.error("No valid sessions to import. Please fix all errors first.");
      return;
    }

    // If there are invalid sessions, ask for confirmation
    if (invalidCount > 0) {
      const proceed = window.confirm(
        `${invalidCount} session(s) have errors and will be skipped. Import ${validCount} valid session(s)?`
      );
      if (!proceed) return;
    }

    setIsSubmitting(true);
    try {
      console.log("Submitting valid sessions:", validSessions);
      await onSubmit(validSessions);
      onOpenChange(false);
      
      if (invalidCount > 0) {
        toast.success(`Imported ${validCount} sessions. ${invalidCount} skipped due to errors.`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render cell with error/warning tooltip
  const renderCellWithTooltip = (
    session: UploadedSession,
    field: string,
    content: React.ReactNode
  ) => {
    const fieldErrors = getFieldErrors(session, field);
    const hasError = fieldErrors.some((e) => e.type === "error");
    const hasWarning = fieldErrors.some((e) => e.type === "warning");

    if (fieldErrors.length === 0) {
      return content;
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={`inline-flex items-center gap-1 px-2 py-1 rounded cursor-help ${
              hasError
                ? "bg-red-50 text-red-900 border-2 border-red-400 font-medium"
                : hasWarning
                ? "bg-yellow-50 text-yellow-900 border border-yellow-400"
                : ""
            }`}
          >
            {content}
            {hasError && <AlertCircle className="h-3 w-3 text-red-600" />}
            {!hasError && hasWarning && (
              <AlertCircle className="h-3 w-3 text-yellow-600" />
            )}
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs bg-white border border-gray-200 shadow-lg">
          <div className="space-y-1">
            {fieldErrors.map((err, i) => (
              <div
                key={i}
                className={`text-xs font-medium ${
                  err.type === "error" ? "text-red-600" : "text-amber-600"
                }`}
              >
                {err.type === "error" ? "⛔" : "⚠️"} {err.message}
              </div>
            ))}
          </div>
        </TooltipContent>
      </Tooltip>
    );
  };

  // Render editable cell
  const renderEditableCell = (
    session: UploadedSession,
    field: keyof UploadedSession,
    type: "text" | "date" | "time" | "select",
    options?: { id: string; name: string }[]
  ) => {
    const isEditing = editingRowId === session.id;
    const value = session[field] as string;
    const hasError = hasFieldError(session, field);
    const hasWarning = hasFieldWarning(session, field);

    if (!isEditing) {
      const displayValue =
        type === "select"
          ? options?.find((o) => o.id === value)?.name || value
          : value || "—";

      return renderCellWithTooltip(session, field, displayValue);
    }

    // Editing mode
    const inputClassName = `h-8 ${
      hasError
        ? "border-red-500 focus:ring-red-500"
        : hasWarning
        ? "border-yellow-500 focus:ring-yellow-500"
        : ""
    }`;

    switch (type) {
      case "text":
        return (
          <Input
            value={value || ""}
            onChange={(e) => updateSession(session.id, field, e.target.value)}
            className={inputClassName}
          />
        );
      case "date":
        return (
          <Input
            type="date"
            value={value || ""}
            onChange={(e) => updateSession(session.id, field, e.target.value)}
            className={`${inputClassName} w-32`}
          />
        );
      case "time":
        return (
          <Input
            type="time"
            value={value || ""}
            onChange={(e) => updateSession(session.id, field, e.target.value)}
            className={`${inputClassName} w-24`}
          />
        );
      case "select":
        return (
          <Select
            value={value || ""}
            onValueChange={(v) => updateSession(session.id, field, v)}
          >
            <SelectTrigger className={`${inputClassName} w-32`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {options?.map((opt) => (
                <SelectItem key={opt.id} value={opt.id}>
                  {opt.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-[1400px] max-h-[90vh] p-0 flex flex-col">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Review Uploaded Sessions
            </DialogTitle>
            {/* Stats */}
            <div className="flex items-center gap-3 text-sm">
              <span className="flex items-center gap-1 text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                {validCount} valid
              </span>
              <span className="flex items-center gap-1 text-red-600">
                <XCircle className="h-4 w-4" />
                {invalidCount} invalid
              </span>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4 mt-4">
            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <Select
                value={statusFilter}
                onValueChange={(v) => setStatusFilter(v as StatusFilter)}
              >
                <SelectTrigger className="w-32 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <span className="flex items-center gap-2">Show all</span>
                  </SelectItem>
                  <SelectItem value="valid">
                    <span className="flex items-center gap-2">
                      <Check className="h-3 w-3 text-green-600" />
                      Valid
                    </span>
                  </SelectItem>
                  <SelectItem value="invalid">
                    <span className="flex items-center gap-2">
                      <X className="h-3 w-3 text-red-600" />
                      Invalid
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Search */}
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Filter by content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
          </div>
        </DialogHeader>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <TooltipProvider delayDuration={200}>
            <Table>
              <TableHeader className="sticky top-0 bg-white z-10">
                <TableRow className="bg-gray-50">
                  <TableHead className="w-12 text-center">#</TableHead>
                  <TableHead className="w-16 text-center">Status</TableHead>
                  <TableHead className="w-20">Actions</TableHead>
                  <TableHead className="min-w-[140px]">Location</TableHead>
                  <TableHead className="min-w-[180px]">Title</TableHead>
                  <TableHead className="min-w-[130px]">Presenter</TableHead>
                  <TableHead className="w-32">Date</TableHead>
                  <TableHead className="w-28">Start Time</TableHead>
                  <TableHead className="w-28">End Time</TableHead>
                  <TableHead className="w-40">Timezone</TableHead>
                  <TableHead className="w-24">Duration</TableHead>
                  <TableHead className="w-32">Glossary</TableHead>
                  <TableHead className="w-40">Account</TableHead>
                  <TableHead className="w-36">Voice Pack</TableHead>
                  <TableHead className="w-32">Language</TableHead>
                  <TableHead className="w-28">Label</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSessions.map((session) => {
                  const isEditing = editingRowId === session.id;

                  return (
                    <TableRow
                      key={session.id}
                      className={isEditing ? "bg-blue-50" : ""}
                    >
                      {/* Row number */}
                      <TableCell className="text-center text-gray-500">
                        {session.rowNumber}
                      </TableCell>

                      {/* Status */}
                      <TableCell className="text-center">
                        {session.isValid ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600 mx-auto" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600 mx-auto" />
                        )}
                      </TableCell>

                      {/* Actions */}
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {isEditing ? (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 text-green-600"
                                onClick={() => setEditingRowId(null)}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 text-red-600"
                                onClick={() => setEditingRowId(null)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 text-primary-teal-600"
                                onClick={() => setEditingRowId(session.id)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 text-red-600"
                                onClick={() => deleteSession(session.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>

                      {/* Location */}
                      <TableCell>
                        {renderEditableCell(session, "location", "text")}
                      </TableCell>

                      {/* Title */}
                      <TableCell>
                        {renderEditableCell(session, "title", "text")}
                      </TableCell>

                      {/* Presenter */}
                      <TableCell>
                        {renderEditableCell(session, "presenter", "text")}
                      </TableCell>

                      {/* Date */}
                      <TableCell>
                        {renderEditableCell(session, "date", "date")}
                      </TableCell>

                      {/* Start Time */}
                      <TableCell>
                        {renderEditableCell(session, "startTime", "time")}
                      </TableCell>

                      {/* End Time */}
                      <TableCell>
                        {renderEditableCell(session, "endTime", "time")}
                      </TableCell>

                      {/* Timezone */}
                      <TableCell>
                        {renderEditableCell(
                          session,
                          "timezone",
                          "select",
                          TIMEZONES.map((tz) => ({
                            id: tz.value,
                            name: tz.label,
                          }))
                        )}
                      </TableCell>

                      {/* Duration (read-only, calculated) */}
                      <TableCell>
                        {renderCellWithTooltip(
                          session,
                          "duration",
                          <span className="text-gray-600">
                            {session.duration > 0
                              ? `${session.duration} mins`
                              : "—"}
                          </span>
                        )}
                      </TableCell>

                      {/* Glossary */}
                      <TableCell>
                        {renderEditableCell(
                          session,
                          "glossary",
                          "select",
                          GLOSSARIES
                        )}
                      </TableCell>

                      {/* Account */}
                      <TableCell>
                        {renderEditableCell(
                          session,
                          "account",
                          "select",
                          ACCOUNTS
                        )}
                      </TableCell>

                      {/* Voice Pack */}
                      <TableCell>
                        {renderEditableCell(
                          session,
                          "voicePack",
                          "select",
                          VOICE_PACKS
                        )}
                      </TableCell>

                      {/* Language */}
                      <TableCell>
                        {renderEditableCell(
                          session,
                          "language",
                          "select",
                          LANGUAGES.map((l) => ({ id: l.code, name: l.name }))
                        )}
                      </TableCell>

                      {/* Label (optional) */}
                      <TableCell>
                        {renderEditableCell(session, "label", "text")}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TooltipProvider>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between flex-shrink-0">
          <div className="text-sm text-gray-600">
            Showing {filteredSessions.length} of {sessions.length} sessions
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || invalidCount > 0}
              className="bg-primary-teal-600 hover:bg-primary-teal-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
