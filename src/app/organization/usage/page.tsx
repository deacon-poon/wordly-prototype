"use client";

import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Search,
  Download,
  Building2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  BarChart3,
  PanelRight,
  ChevronUp,
  FileText,
  Clock,
  Tag,
  CheckCircle2,
  Users,
  CalendarDays,
  Hash,
  Globe,
  Zap,
  XCircle,
  Link2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { DateRangePicker } from "@/components/ui/datetime-picker";
import {
  DataTable,
  StatusBadge,
  HighlightText,
  type TableColumn,
} from "@/components/ui/data-table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import {
  UnifiedSearch,
  type ActiveFilter,
  type SearchFilterCategory,
} from "@/components/ui/unified-search";
import { useViewportSize } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

interface UsageSession {
  id: string;
  title: string;
  sessionId: string;
  workspace: string;
  workspaceType: "shared" | "personal";
  date: string;
  time: string;
  minutesUsed: number;
  realDuration: number;
  attendees: number;
  status: string;
  label: string;
  location: string;
  languages: { name: string; count: number }[];
  presenters: {
    name: string;
    duration: number;
    platform: string;
  }[];
}

// ============================================================================
// Mock Data
// ============================================================================

const mockUsageSessions: UsageSession[] = [
  {
    id: "1",
    title: "Monthly Council Meeting",
    sessionId: "BGNA-3762",
    workspace: "Gardendale City",
    workspaceType: "shared",
    date: "Nov 21, 2025",
    time: "8:05 AM",
    minutesUsed: 62,
    realDuration: 67,
    attendees: 8,
    status: "ENDED",
    label: "",
    location: "City Hall - Chamber A",
    languages: [
      { name: "English (US)", count: 2 },
      { name: "Spanish (LatAm)", count: 6 },
    ],
    presenters: [
      { name: "English (US)", duration: 62, platform: "Web app" },
      { name: "English (US)", duration: 32, platform: "Android" },
      { name: "Spanish (LatAm)", duration: 41, platform: "Web app" },
    ],
  },
  {
    id: "2",
    title: "Budget Committee",
    sessionId: "ABCD-1234",
    workspace: "Gardendale City",
    workspaceType: "shared",
    date: "Nov 20, 2025",
    time: "2:00 PM",
    minutesUsed: 63,
    realDuration: 68,
    attendees: 11,
    status: "ENDED",
    label: "Finance",
    location: "Virtual",
    languages: [
      { name: "English (US)", count: 7 },
      { name: "Spanish (LatAm)", count: 4 },
    ],
    presenters: [
      { name: "English (US)", duration: 63, platform: "Web app" },
      { name: "English (US)", duration: 45, platform: "Teams" },
    ],
  },
  {
    id: "3",
    title: "Monthly Council Meeting About the T...",
    sessionId: "BGNA-3762",
    workspace: "Akira Liu's Workspace",
    workspaceType: "personal",
    date: "Nov 19, 2025",
    time: "10:30 AM",
    minutesUsed: 29,
    realDuration: 35,
    attendees: 9,
    status: "ENDED",
    label: "",
    location: "Remote",
    languages: [
      { name: "English (US)", count: 5 },
      { name: "Japanese", count: 4 },
    ],
    presenters: [
      { name: "English (US)", duration: 29, platform: "Web app" },
    ],
  },
  {
    id: "4",
    title: "Budget Committee",
    sessionId: "ABCD-1234",
    workspace: "Gardendale City",
    workspaceType: "shared",
    date: "Nov 18, 2025",
    time: "1:00 PM",
    minutesUsed: 63,
    realDuration: 70,
    attendees: 11,
    status: "ENDED",
    label: "Finance",
    location: "Conference Room B",
    languages: [
      { name: "English (US)", count: 8 },
      { name: "Spanish (LatAm)", count: 3 },
    ],
    presenters: [
      { name: "English (US)", duration: 63, platform: "Web app" },
    ],
  },
  {
    id: "5",
    title: "Monthly Council Meeting About the T...",
    sessionId: "BGNA-3762",
    workspace: "Gardendale City",
    workspaceType: "shared",
    date: "Nov 17, 2025",
    time: "9:00 AM",
    minutesUsed: 29,
    realDuration: 33,
    attendees: 9,
    status: "ENDED",
    label: "",
    location: "City Hall",
    languages: [
      { name: "English (US)", count: 6 },
      { name: "Korean", count: 3 },
    ],
    presenters: [
      { name: "English (US)", duration: 29, platform: "Teams" },
      { name: "Korean", duration: 22, platform: "Web app" },
    ],
  },
  {
    id: "6",
    title: "Budget Committee",
    sessionId: "ABCD-1234",
    workspace: "Gardendale City",
    workspaceType: "shared",
    date: "Nov 16, 2025",
    time: "3:30 PM",
    minutesUsed: 63,
    realDuration: 67,
    attendees: 11,
    status: "ENDED",
    label: "Finance",
    location: "Virtual",
    languages: [
      { name: "English (US)", count: 9 },
      { name: "Spanish (LatAm)", count: 2 },
    ],
    presenters: [
      { name: "English (US)", duration: 63, platform: "Web app" },
    ],
  },
  {
    id: "7",
    title: "Monthly Council Meeting About the T...",
    sessionId: "BGNA-3762",
    workspace: "Gardendale City",
    workspaceType: "shared",
    date: "Nov 15, 2025",
    time: "8:00 AM",
    minutesUsed: 29,
    realDuration: 31,
    attendees: 9,
    status: "ENDED",
    label: "",
    location: "City Hall - Chamber A",
    languages: [
      { name: "English (US)", count: 5 },
      { name: "Hindi", count: 4 },
    ],
    presenters: [
      { name: "English (US)", duration: 29, platform: "Web app" },
    ],
  },
  {
    id: "8",
    title: "Budget Committee",
    sessionId: "ABCD-1234",
    workspace: "Gardendale City",
    workspaceType: "shared",
    date: "Nov 14, 2025",
    time: "2:00 PM",
    minutesUsed: 63,
    realDuration: 65,
    attendees: 11,
    status: "ENDED",
    label: "Finance",
    location: "Conference Room B",
    languages: [
      { name: "English (US)", count: 7 },
      { name: "Portuguese (PT)", count: 4 },
    ],
    presenters: [
      { name: "English (US)", duration: 63, platform: "Teams" },
      { name: "Portuguese (PT)", duration: 48, platform: "Web app" },
    ],
  },
  {
    id: "9",
    title: "Monthly Council Meeting About the T...",
    sessionId: "BGNA-3762",
    workspace: "Gardendale City",
    workspaceType: "shared",
    date: "Nov 13, 2025",
    time: "9:00 AM",
    minutesUsed: 29,
    realDuration: 34,
    attendees: 9,
    status: "ENDED",
    label: "",
    location: "Remote",
    languages: [
      { name: "English (US)", count: 6 },
      { name: "Spanish (LatAm)", count: 3 },
    ],
    presenters: [
      { name: "English (US)", duration: 29, platform: "Web app" },
    ],
  },
];

const workspaceOptions = [
  { name: "Gardendale City", type: "shared" as const },
  { name: "Marketing Team", type: "shared" as const },
  { name: "Sales Department", type: "shared" as const },
  { name: "Akira Liu's Workspace", type: "personal" as const },
  { name: "Jordan's Workspace", type: "personal" as const },
];

// ============================================================================
// Unified Search Categories
// ============================================================================

const searchCategories: SearchFilterCategory[] = [
  {
    key: "status",
    label: "Status",
    icon: Globe,
    color: "green",
    options: [
      { value: "ACTIVE", label: "Active", icon: Zap },
      { value: "ENDED", label: "Ended", icon: XCircle },
    ],
    multiple: false,
  },
  {
    key: "workspace",
    label: "Workspace",
    icon: Building2,
    color: "blue",
    options: workspaceOptions.map((w) => ({
      value: w.name,
      label: w.name,
      icon: w.type === "personal" ? Users : Building2,
    })),
  },
];

// ============================================================================
// Section heading (matches SessionPanel's "SESSION DETAILS" / "SCHEDULE" style)
// ============================================================================

function SectionHeading({
  icon: Icon,
  children,
}: {
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <h4 className="flex items-center gap-2 text-xs font-semibold tracking-wide uppercase text-primary-teal-600 pt-1">
      <Icon className="h-3.5 w-3.5" />
      {children}
    </h4>
  );
}

// ============================================================================
// Collapsible participant section
// ============================================================================

function CollapsibleSection({
  title,
  count,
  defaultOpen = true,
  children,
}: {
  title: string;
  count: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-2.5 text-left group"
      >
        <span className="text-sm font-semibold text-gray-900">
          {title}:{" "}
          <span className="font-semibold text-gray-600">{count}</span>
        </span>
        <ChevronUp
          className={cn(
            "h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-transform duration-200",
            !open && "rotate-180"
          )}
        />
      </button>
      {open && <div className="pb-1">{children}</div>}
    </div>
  );
}

// ============================================================================
// Usage Record Panel
// ============================================================================

function UsageRecordPanel({
  session,
  onClose,
}: {
  session: UsageSession;
  onClose: () => void;
}) {
  const usagePercent = Math.round(
    (session.minutesUsed / session.realDuration) * 100
  );

  return (
    <div className="h-full flex flex-col bg-white border-l border-gray-200">
      {/* Sticky Header */}
      <div className="flex-shrink-0 px-6 py-4 flex items-center justify-between bg-white border-b border-gray-200">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary-blue-600 flex-shrink-0" />
            <h2 className="text-lg font-semibold text-gray-900">
              Usage Record
            </h2>
          </div>
          <p className="text-sm text-gray-600 mt-0.5 truncate">
            {session.workspace} · {session.sessionId}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-9 w-9 p-0 hover:bg-primary-blue-50 flex-shrink-0"
        >
          <PanelRight className="h-4 w-4 text-gray-600 hover:text-primary-blue-600 transition-colors" />
          <span className="sr-only">Close panel</span>
        </Button>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="p-6 space-y-6">
          {/* Session Details section */}
          <div className="space-y-4">
            <SectionHeading icon={FileText}>Session Details</SectionHeading>

            <div className="space-y-3">
              <DetailRow label="Session Name" value={session.title} bold />
              <DetailRow label="Session ID" value={session.sessionId} />
              <DetailRow label="Date" value={`${session.date} at ${session.time}`} />
              {session.location && (
                <DetailRow label="Location" value={session.location} />
              )}
              <DetailRow label="Workspace" value={session.workspace} />
              <DetailRow
                label="Label"
                value={session.label || "(none)"}
                muted={!session.label}
              />
              <DetailRow label="Status">
                <StatusBadge status={session.status} />
              </DetailRow>
              <DetailRow
                label="Real Duration"
                value={`${session.realDuration} minutes`}
              />
              <DetailRow
                label="Minutes Billed"
                value={`${session.minutesUsed} minutes`}
                bold
              />
            </div>
          </div>

          {/* Usage meter */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">
                Usage
              </span>
              <span className="text-sm font-semibold text-gray-900 tabular-nums">
                {session.minutesUsed} / {session.realDuration} min
                <span className="text-gray-500 font-normal ml-1.5">
                  ({usagePercent}%)
                </span>
              </span>
            </div>
            <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-gray-200/60">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${usagePercent}%`,
                  background: "linear-gradient(90deg, #3CFF52 0%, #00D0FF 51%, #017CFF 100%)",
                }}
              />
            </div>
          </div>

          {/* Participants section */}
          <div className="space-y-1">
            <SectionHeading icon={Users}>Participants</SectionHeading>

            {/* Presenters */}
            <CollapsibleSection
              title="Presenters"
              count={session.presenters.length}
            >
              <div className="rounded-lg border border-gray-200 overflow-hidden">
                {session.presenters.map((p, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex items-center justify-between px-3 py-2.5 text-sm",
                      i !== session.presenters.length - 1 &&
                        "border-b border-gray-100"
                    )}
                  >
                    <span className="text-gray-800">{p.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-900 tabular-nums">
                        {p.duration} mins
                      </span>
                      <span className="text-xs text-gray-500 bg-gray-100 rounded px-1.5 py-0.5">
                        {p.platform}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleSection>

            {/* Attendees */}
            <CollapsibleSection title="Attendees" count={session.attendees}>
              <div className="rounded-lg border border-gray-200 overflow-hidden">
                {session.languages.map((l, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex items-center justify-between px-3 py-2.5 text-sm",
                      i !== session.languages.length - 1 &&
                        "border-b border-gray-100"
                    )}
                  >
                    <span className="text-gray-800">{l.name}</span>
                    <span className="font-semibold text-gray-900 tabular-nums">
                      {l.count}
                    </span>
                  </div>
                ))}
              </div>
            </CollapsibleSection>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Key-value row for the detail panel */
function DetailRow({
  label,
  value,
  muted,
  bold,
  children,
}: {
  label: string;
  value?: string;
  muted?: boolean;
  bold?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-sm text-gray-600 flex-shrink-0">{label}:</span>
      {children ?? (
        <span
          className={cn(
            "text-sm text-right",
            muted
              ? "text-gray-400 italic"
              : bold
                ? "font-semibold text-gray-900"
                : "font-medium text-gray-900"
          )}
        >
          {value}
        </span>
      )}
    </div>
  );
}

// ============================================================================
// Main Page
// ============================================================================

export default function OrganizationUsagePage() {
  const [selectedSession, setSelectedSession] =
    useState<UsageSession | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 25;

  const { width } = useViewportSize();
  const isDesktop = width >= 1028;
  const isMobile = width < 640;

  const handleFiltersChange = useCallback((filters: ActiveFilter[]) => {
    setActiveFilters(filters);
    setCurrentPage(1);
  }, []);

  const handleQueryChange = useCallback((q: string) => {
    setSearchQuery(q);
    setCurrentPage(1);
  }, []);

  const filteredSessions = useMemo(() => {
    let result = mockUsageSessions;

    // Apply faceted filters
    const workspaceFilters = activeFilters
      .filter((f) => f.categoryKey === "workspace")
      .map((f) => f.value);
    if (workspaceFilters.length > 0) {
      result = result.filter((s) => workspaceFilters.includes(s.workspace));
    }

    const statusFilters = activeFilters
      .filter((f) => f.categoryKey === "status")
      .map((f) => f.value);
    if (statusFilters.length > 0) {
      result = result.filter((s) => statusFilters.includes(s.status));
    }

    // Apply free-text search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.sessionId.toLowerCase().includes(q) ||
          s.label.toLowerCase().includes(q)
      );
    }

    return result;
  }, [activeFilters, searchQuery]);

  const totalMinutes = filteredSessions.reduce(
    (acc, s) => acc + s.minutesUsed,
    0
  );
  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;
  const totalPages = Math.max(
    1,
    Math.ceil(filteredSessions.length / pageSize)
  );
  const paginatedSessions = filteredSessions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSessionSelect = (session: UsageSession) => {
    setSelectedSession(session);
  };

  const handleClosePanel = () => {
    setSelectedSession(null);
  };

  const handleDownloadReport = () => {
    const headers = [
      "Session Name",
      "Session ID",
      "Workspace",
      "Minutes Billed",
      "Attendees",
      "Status",
      "Date",
    ];
    const rows = filteredSessions.map((s) => [
      `"${s.title}"`,
      s.sessionId,
      `"${s.workspace}"`,
      s.minutesUsed,
      s.attendees,
      s.status,
      `${s.date} ${s.time}`,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `org-usage-report-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const columns: TableColumn<UsageSession>[] = [
    {
      header: "Session Name",
      accessorKey: "title",
      cell: (row) => (
        <div className="flex items-center gap-2 min-w-0">
          {row.status === "ACTIVE" && (
            <span className="flex-shrink-0 w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          )}
          <HighlightText
            text={row.title}
            query={searchQuery}
            className="font-medium text-gray-900 truncate"
          />
        </div>
      ),
      className: "min-w-[160px] max-w-[240px]",
    },
    {
      header: "Session ID",
      accessorKey: "sessionId",
      cell: (row) => (
        <HighlightText
          text={row.sessionId}
          query={searchQuery}
          className="text-gray-600 font-mono text-xs"
        />
      ),
      className: "w-[100px]",
    },
    {
      header: "Workspace",
      accessorKey: "workspace",
      cell: (row) => (
        <HighlightText
          text={row.workspace}
          query={searchQuery}
          className="text-gray-700 truncate block max-w-[160px]"
        />
      ),
      className: "min-w-[120px] hidden lg:table-cell",
    },
    {
      header: "Minutes used",
      accessorKey: "minutesUsed",
      cell: (row) => (
        <span className="font-medium text-gray-900 tabular-nums">
          {row.minutesUsed}
        </span>
      ),
      className: "text-center w-[100px]",
    },
    {
      header: "Attendees",
      accessorKey: "attendees",
      cell: (row) => (
        <span className="text-gray-700 tabular-nums">{row.attendees}</span>
      ),
      className: "text-center w-[80px]",
    },
  ];

  // ---- Main Content ----
  const mainContent = (
    <div className="h-full overflow-y-auto bg-white @container">
      <div className="px-8 py-6 space-y-6 max-w-[1200px]">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Usage</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your pools of minutes available for each workspace to draw
              from.
            </p>
          </div>
          <Button
            onClick={handleDownloadReport}
            className="bg-primary-blue-600 hover:bg-primary-blue-700 text-white shrink-0 gap-2"
          >
            <Download className="h-4 w-4" />
            Download Activity Report
          </Button>
        </div>

        {/* Separator */}
        <div className="border-t border-gray-200" />

        {/* Filter bar: date range + unified search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
          <FilterField label="Date Range">
            <DateRangePicker
              from={dateFrom}
              to={dateTo}
              onChange={({ from, to }) => {
                setDateFrom(from);
                setDateTo(to);
                setCurrentPage(1);
              }}
              placeholder="All dates"
              className="h-10 w-[260px] text-sm bg-white"
            />
          </FilterField>

          <div className="flex-1 min-w-0">
            <UnifiedSearch
              categories={searchCategories}
              activeFilters={activeFilters}
              query={searchQuery}
              onFiltersChange={handleFiltersChange}
              onQueryChange={handleQueryChange}
              placeholder="Search by ID, title, label, or filter by status, workspace..."
            />
          </div>
        </div>

        {/* Table */}
        <div>
          {/* Summary row */}
          <div className="flex justify-between items-center py-2.5 px-1 border-b border-gray-300">
            <span className="text-sm font-semibold text-gray-700 tabular-nums">
              TOTAL: {filteredSessions.length} records
            </span>
            <span className="text-sm font-semibold text-gray-700 tabular-nums">
              {totalHours > 0 ? `${totalHours} hours, ` : ""}
              {remainingMinutes} minutes
            </span>
          </div>

          <DataTable
            data={paginatedSessions}
            columns={columns}
            onRowClick={handleSessionSelect}
            selectedItem={selectedSession ?? undefined}
            idField="id"
            emptyMessage="No usage records found for the selected filters."
          />
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-1.5 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(1)}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "h-8 w-8 p-0",
                    currentPage === page &&
                      "bg-primary-blue-600 text-white hover:bg-primary-blue-700"
                  )}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages, p + 1))
              }
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(totalPages)}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
            <Select value={String(pageSize)} onValueChange={() => {}}>
              <SelectTrigger className="h-8 w-[65px] text-xs ml-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );

  const isPanelOpen = !!selectedSession;
  const isPanelOverlay = isPanelOpen && !isDesktop;

  // Desktop: resizable side-by-side
  if (isPanelOpen && isDesktop) {
    return (
      <div className="h-full overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel defaultSize={60} minSize={45}>
            {mainContent}
          </ResizablePanel>
          <ResizableHandle className="w-px bg-gray-200 hover:bg-gray-300 transition-colors" />
          <ResizablePanel defaultSize={40} minSize={25} maxSize={50}>
            <UsageRecordPanel
              session={selectedSession}
              onClose={handleClosePanel}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    );
  }

  // Mobile/Tablet: overlay panel
  return (
    <div className="h-full overflow-hidden relative">
      <div
        className={cn(
          "h-full",
          isPanelOverlay ? "overflow-hidden" : ""
        )}
      >
        {mainContent}
      </div>
      {isPanelOverlay && selectedSession && (
        <>
          {!isMobile && (
            <div
              className="absolute inset-0 z-30 bg-black/20"
              onClick={handleClosePanel}
            />
          )}
          <div
            className={cn(
              "absolute inset-y-0 right-0 z-40 bg-white animate-in slide-in-from-right duration-300",
              isMobile ? "left-0" : "w-[65%] shadow-xl"
            )}
          >
            <UsageRecordPanel
              session={selectedSession}
              onClose={handleClosePanel}
            />
          </div>
        </>
      )}
    </div>
  );
}

/** Small wrapper for filter fields with labels */
function FilterField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-gray-500">{label}</span>
      {children}
    </div>
  );
}
