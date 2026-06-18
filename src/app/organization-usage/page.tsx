"use client";

/**
 * Organization Usage — usage rolled up across an org's workspaces.
 *
 * 1:1 design-parity port of the Angular `app-usage` component
 * (wordly_portal: src/app/modules/v2/usage) with isOrgUsage = true. Same screen
 * as Usage, with two additions driven by `hasWorkspaceColumn`:
 *   - a "Workspace" column (between Session ID and Minutes Billed)
 *   - a Workspace selector filter (with an "All Workspaces" option)
 *
 * title "Usage" / description "See how long sessions ran and how many people attended."
 * Filter bar: Date Range (default last 30 days), Workspace selector, Session Title
 * search, Live checkbox. Sticky-header table + infinite scroll, TOTAL subheader,
 * "Download Usage Report" action, usage-record side panel.
 */

import * as React from "react";
import { Download, BarChart3, FileText, Users, PanelRight } from "lucide-react";

import { MainContainer } from "@/components/ui/main-container";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DateRangePicker,
  type DateRangeValue,
} from "@/components/ui/date-range-picker";
import { InfiniteScroll } from "@/components/ui/infinite-scroll";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Mock data — mirrors UsageSummary; rows spread across 4 workspaces
// ---------------------------------------------------------------------------

interface UsageRow {
  id: string;
  sessionTitle: string;
  startTime: string; // ISO
  formattedDatetime: string;
  pCode: string;
  workspaceName: string;
  consumedMinutes: number;
  attendeeCount: number;
  status: string; // "ended" | "started"
  label: string;
  realDuration: number;
  languages: { language: string; count: number }[];
  presenters: { language: string; minutes: number }[];
}

const ACTIVE_STATUS = "started";

const WORKSPACES = [
  "North America HQ",
  "EMEA Operations",
  "APAC Sales",
  "LATAM Success",
];

const ROWS: UsageRow[] = [
  {
    id: "o1",
    sessionTitle: "Global All-Hands Q2",
    startTime: "2026-06-17T15:00:00Z",
    formattedDatetime: "Jun 17, 2026, 3:00 PM",
    pCode: "GAH-9920A",
    workspaceName: "North America HQ",
    consumedMinutes: 96,
    attendeeCount: 312,
    status: "started",
    label: "Company",
    realDuration: 92,
    languages: [
      { language: "Spanish", count: 88 },
      { language: "Japanese", count: 41 },
    ],
    presenters: [{ language: "English", minutes: 92 }],
  },
  {
    id: "o2",
    sessionTitle: "EMEA Sales Kickoff",
    startTime: "2026-06-16T18:30:00Z",
    formattedDatetime: "Jun 16, 2026, 6:30 PM",
    pCode: "EMK-3318B",
    workspaceName: "EMEA Operations",
    consumedMinutes: 72,
    attendeeCount: 54,
    status: "ended",
    label: "Sales",
    realDuration: 69,
    languages: [
      { language: "German", count: 18 },
      { language: "French", count: 14 },
    ],
    presenters: [{ language: "English", minutes: 69 }],
  },
  {
    id: "o3",
    sessionTitle: "APAC Customer Webinar",
    startTime: "2026-06-14T08:00:00Z",
    formattedDatetime: "Jun 14, 2026, 8:00 AM",
    pCode: "APW-7741C",
    workspaceName: "APAC Sales",
    consumedMinutes: 58,
    attendeeCount: 127,
    status: "ended",
    label: "Marketing",
    realDuration: 56,
    languages: [
      { language: "Mandarin", count: 44 },
      { language: "Korean", count: 31 },
    ],
    presenters: [{ language: "English", minutes: 56 }],
  },
  {
    id: "o4",
    sessionTitle: "LATAM Onboarding — Globex",
    startTime: "2026-06-12T16:00:00Z",
    formattedDatetime: "Jun 12, 2026, 4:00 PM",
    pCode: "LAT-2205D",
    workspaceName: "LATAM Success",
    consumedMinutes: 45,
    attendeeCount: 9,
    status: "ended",
    label: "Success",
    realDuration: 44,
    languages: [{ language: "Portuguese", count: 9 }],
    presenters: [{ language: "Spanish", minutes: 44 }],
  },
  {
    id: "o5",
    sessionTitle: "Product Roadmap Review",
    startTime: "2026-06-10T14:00:00Z",
    formattedDatetime: "Jun 10, 2026, 2:00 PM",
    pCode: "PRR-9913E",
    workspaceName: "North America HQ",
    consumedMinutes: 64,
    attendeeCount: 22,
    status: "ended",
    label: "Product",
    realDuration: 61,
    languages: [{ language: "French", count: 6 }],
    presenters: [{ language: "English", minutes: 61 }],
  },
  {
    id: "o6",
    sessionTitle: "EMEA Compliance Briefing",
    startTime: "2026-06-08T13:00:00Z",
    formattedDatetime: "Jun 8, 2026, 1:00 PM",
    pCode: "ECB-5530F",
    workspaceName: "EMEA Operations",
    consumedMinutes: 38,
    attendeeCount: 31,
    status: "ended",
    label: "Legal",
    realDuration: 37,
    languages: [
      { language: "German", count: 11 },
      { language: "Italian", count: 8 },
    ],
    presenters: [{ language: "English", minutes: 37 }],
  },
  {
    id: "o7",
    sessionTitle: "APAC Partner Sync",
    startTime: "2026-06-05T07:30:00Z",
    formattedDatetime: "Jun 5, 2026, 7:30 AM",
    pCode: "APS-1148G",
    workspaceName: "APAC Sales",
    consumedMinutes: 29,
    attendeeCount: 12,
    status: "ended",
    label: "Partnerships",
    realDuration: 28,
    languages: [{ language: "Japanese", count: 5 }],
    presenters: [{ language: "English", minutes: 28 }],
  },
  {
    id: "o8",
    sessionTitle: "LATAM Quarterly Review",
    startTime: "2026-06-03T15:30:00Z",
    formattedDatetime: "Jun 3, 2026, 3:30 PM",
    pCode: "LQR-6672H",
    workspaceName: "LATAM Success",
    consumedMinutes: 51,
    attendeeCount: 28,
    status: "ended",
    label: "Executive",
    realDuration: 49,
    languages: [{ language: "Spanish", count: 16 }],
    presenters: [{ language: "Spanish", minutes: 49 }],
  },
  {
    id: "o9",
    sessionTitle: "Engineering Town Hall",
    startTime: "2026-05-30T16:00:00Z",
    formattedDatetime: "May 30, 2026, 4:00 PM",
    pCode: "ETH-3391J",
    workspaceName: "North America HQ",
    consumedMinutes: 82,
    attendeeCount: 96,
    status: "ended",
    label: "Engineering",
    realDuration: 79,
    languages: [
      { language: "Mandarin", count: 18 },
      { language: "Korean", count: 9 },
    ],
    presenters: [{ language: "English", minutes: 79 }],
  },
  {
    id: "o10",
    sessionTitle: "EMEA Marketing Workshop",
    startTime: "2026-05-28T18:00:00Z",
    formattedDatetime: "May 28, 2026, 6:00 PM",
    pCode: "EMW-2217K",
    workspaceName: "EMEA Operations",
    consumedMinutes: 44,
    attendeeCount: 17,
    status: "ended",
    label: "Marketing",
    realDuration: 42,
    languages: [{ language: "French", count: 7 }],
    presenters: [{ language: "English", minutes: 42 }],
  },
  {
    id: "o11",
    sessionTitle: "APAC New Hire Orientation",
    startTime: "2026-05-26T08:30:00Z",
    formattedDatetime: "May 26, 2026, 8:30 AM",
    pCode: "ANH-9042L",
    workspaceName: "APAC Sales",
    consumedMinutes: 60,
    attendeeCount: 41,
    status: "ended",
    label: "People",
    realDuration: 58,
    languages: [{ language: "Japanese", count: 14 }],
    presenters: [{ language: "English", minutes: 58 }],
  },
  {
    id: "o12",
    sessionTitle: "LATAM Investor Update",
    startTime: "2026-05-22T17:00:00Z",
    formattedDatetime: "May 22, 2026, 5:00 PM",
    pCode: "LIU-7767M",
    workspaceName: "LATAM Success",
    consumedMinutes: 47,
    attendeeCount: 63,
    status: "ended",
    label: "Executive",
    realDuration: 45,
    languages: [
      { language: "Spanish", count: 22 },
      { language: "Portuguese", count: 18 },
    ],
    presenters: [{ language: "English", minutes: 45 }],
  },
  {
    id: "o13",
    sessionTitle: "Design Systems Guild",
    startTime: "2026-05-18T15:00:00Z",
    formattedDatetime: "May 18, 2026, 3:00 PM",
    pCode: "DSG-4430N",
    workspaceName: "North America HQ",
    consumedMinutes: 33,
    attendeeCount: 14,
    status: "ended",
    label: "Design",
    realDuration: 32,
    languages: [{ language: "Japanese", count: 3 }],
    presenters: [{ language: "English", minutes: 32 }],
  },
  {
    id: "o14",
    sessionTitle: "EMEA Support Retro",
    startTime: "2026-05-15T14:30:00Z",
    formattedDatetime: "May 15, 2026, 2:30 PM",
    pCode: "ESR-1185P",
    workspaceName: "EMEA Operations",
    consumedMinutes: 26,
    attendeeCount: 8,
    status: "ended",
    label: "Support",
    realDuration: 25,
    languages: [{ language: "German", count: 3 }],
    presenters: [{ language: "English", minutes: 25 }],
  },
];

// ---------------------------------------------------------------------------
// Helpers — mirrors UtilsService.minToHourFormat
// ---------------------------------------------------------------------------

function minToHourFormat(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  if (hours <= 0) return `${mins} mins`;
  return `${hours}h ${mins}m`;
}

const PAGE_LIMIT = 8;
const ALL_WORKSPACES = "ALL";

// ---------------------------------------------------------------------------
// Side panel — port of usage-record.component.html (org adds Workspace row)
// ---------------------------------------------------------------------------

function UsageRecordPanel({
  record,
  onClose,
}: {
  record: UsageRow;
  onClose: () => void;
}) {
  const isLive = record.status === ACTIVE_STATUS;
  return (
    <section className="flex flex-col">
      <div className="flex flex-row items-start justify-between p-6">
        <div className="flex flex-col gap-1">
          <h3 className="flex items-center gap-2 text-xl font-bold">
            <span className="inline-flex items-center text-primary">
              <BarChart3 className="h-5 w-5" />
            </span>
            Usage Record
          </h3>
          <span className="text-sm font-normal text-muted-foreground">
            {record.sessionTitle} · {record.formattedDatetime}
          </span>
        </div>
        <button
          type="button"
          className="cursor-pointer text-muted-foreground hover:text-foreground"
          title="Close side panel"
          aria-label="Close side panel"
          onClick={onClose}
        >
          <PanelRight className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-col gap-4 px-6 pb-6">
        <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <span className="text-primary">
            <FileText className="h-4 w-4" />
          </span>
          Session Details
        </h3>
        <div className="flex flex-col">
          <Detail label="Session Title:" value={record.sessionTitle} />
          <Detail label="Session ID:" value={record.pCode} mono />
          <Detail label="Start Time:" value={record.formattedDatetime} />
          <Detail label="Workspace:" value={record.workspaceName} />
          <Detail label="Label:" value={record.label || "-"} />
          <Detail label="Status:" value={isLive ? "LIVE" : "Ended"} />
          <Detail
            label="Real Duration:"
            value={`${record.realDuration} mins`}
          />
          <Detail
            label="Minutes Billed:"
            value={`${record.consumedMinutes} mins`}
          />
        </div>

        <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <span className="text-primary">
            <Users className="h-4 w-4" />
          </span>
          Participants
        </h3>

        {record.presenters.length > 0 ? (
          <div>
            <span className="text-sm font-semibold">
              Presenters: {record.presenters.length}
            </span>
            <div className="mt-2 flex flex-col gap-2 rounded-lg border p-3">
              {record.presenters.map((p, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border-b px-4 py-2.5 last:border-b-0"
                >
                  <span className="text-sm">{p.language}</span>
                  <span className="text-sm font-semibold">
                    {p.minutes} mins
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {record.languages.length > 0 ? (
          <div>
            <span className="text-sm font-semibold">
              Attendees: {record.attendeeCount}
            </span>
            <div className="mt-2 flex flex-col gap-2 rounded-lg border p-3">
              {record.languages.map((l, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border-b px-4 py-2.5 last:border-b-0"
                >
                  <span className="text-sm">{l.language}</span>
                  <span className="text-sm font-semibold">{l.count}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function Detail({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span
        className={cn(
          "min-w-0 break-words text-right text-sm font-semibold",
          mono && "font-mono"
        )}
      >
        {value}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function OrganizationUsagePage() {
  const last30: DateRangeValue = React.useMemo(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 29);
    return [start, end];
  }, []);

  const [dateRange, setDateRange] = React.useState<DateRangeValue>(last30);
  const [workspaceId, setWorkspaceId] = React.useState<string>(ALL_WORKSPACES);
  const [search, setSearch] = React.useState("");
  const [liveOnly, setLiveOnly] = React.useState(false);

  const [visibleCount, setVisibleCount] = React.useState(PAGE_LIMIT);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [panelOpen, setPanelOpen] = React.useState(false);

  // Client-side filtering (mirrors the API filter params).
  const filtered = React.useMemo(() => {
    return ROWS.filter((r) => {
      if (search) {
        const q = search.toLowerCase();
        const match =
          r.sessionTitle.toLowerCase().includes(q) ||
          r.pCode.toLowerCase().includes(q) ||
          r.label.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (workspaceId !== ALL_WORKSPACES && r.workspaceName !== workspaceId)
        return false;
      if (liveOnly && r.status !== ACTIVE_STATUS) return false;
      if (dateRange) {
        const t = new Date(r.startTime).getTime();
        if (t < dateRange[0].getTime() || t > dateRange[1].getTime())
          return false;
      }
      return true;
    });
  }, [search, workspaceId, liveOnly, dateRange]);

  React.useEffect(() => {
    setVisibleCount(PAGE_LIMIT);
  }, [search, workspaceId, liveOnly, dateRange]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const totalRecords = filtered.length;
  const totalMinutes = filtered.reduce((s, r) => s + r.consumedMinutes, 0);

  const selected = filtered.find((r) => r.id === selectedId) ?? null;

  function handleRowSelect(row: UsageRow) {
    setSelectedId(row.id);
    setPanelOpen(true);
  }

  return (
    <div className="p-8">
      <MainContainer
        title={<span className="text-2xl font-bold">Usage</span>}
        description="See how long sessions ran and how many people attended."
        bodyClass="bg-card"
        showBorders={false}
        hasSidePanel
        showSidePanelPadding={false}
        showSidePanelToggle={false}
        sidePanelOpen={panelOpen && !!selected}
        onSidePanelToggle={(open) => setPanelOpen(open)}
        action={
          <Button
            className="gap-2"
            disabled={totalRecords === 0}
            onClick={() =>
              alert(`Preparing usage report for ${totalRecords} records…`)
            }
            aria-label="Download Usage Report"
          >
            <Download className="h-4 w-4" />
            <span>Download Usage Report</span>
          </Button>
        }
        sidePanel={
          selected ? (
            <UsageRecordPanel
              record={selected}
              onClose={() => setPanelOpen(false)}
            />
          ) : null
        }
      >
        <div className="flex flex-col gap-4">
          {/* Filters */}
          <div className="flex flex-wrap items-end gap-4">
            <DateRangePicker
              label="Date Range"
              value={dateRange}
              onValueChange={setDateRange}
              max={new Date()}
            />
            <div className="flex w-full max-w-xs flex-col gap-2">
              <label className="text-sm font-medium leading-none text-foreground">
                Workspace
              </label>
              <Select value={workspaceId} onValueChange={setWorkspaceId}>
                <SelectTrigger>
                  <SelectValue placeholder="All Workspaces" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_WORKSPACES}>All Workspaces</SelectItem>
                  {WORKSPACES.map((w) => (
                    <SelectItem key={w} value={w}>
                      {w}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-full max-w-xs flex-col gap-2">
              <label className="text-sm font-medium leading-none text-foreground">
                Search
              </label>
              <Input
                placeholder="ID, Label, or Custom Fields"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <label className="flex h-9 cursor-pointer items-center gap-2 text-sm font-medium text-foreground">
              <Checkbox
                checked={liveOnly}
                onCheckedChange={(c) => setLiveOnly(c === true)}
              />
              Live
            </label>
          </div>

          {/* Table */}
          <InfiniteScroll
            hasMore={hasMore}
            onLoadMore={() =>
              setVisibleCount((c) => Math.min(c + PAGE_LIMIT, filtered.length))
            }
            className="max-h-[calc(100vh-320px)]"
          >
            <Table className="text-sm">
              <TableHeader className="sticky top-0 z-10 bg-card">
                <TableRow>
                  <TableHead style={{ width: "200px" }}>
                    Session Title
                  </TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>Session ID</TableHead>
                  <TableHead>Workspace</TableHead>
                  <TableHead className="text-right">Minutes Billed</TableHead>
                  <TableHead className="text-right">Attendees</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* TOTAL subheader row */}
                <TableRow className="border-b bg-muted/30 hover:bg-muted/30">
                  <TableCell className="whitespace-nowrap px-2 py-1">
                    <span className="font-bold">TOTAL:</span>{" "}
                    <span className="text-muted-foreground">
                      {totalRecords} records
                    </span>
                  </TableCell>
                  <TableCell />
                  <TableCell />
                  <TableCell />
                  <TableCell className="whitespace-nowrap px-2 py-1 text-right text-muted-foreground">
                    {minToHourFormat(totalMinutes)}
                  </TableCell>
                  <TableCell />
                  <TableCell />
                </TableRow>

                {visible.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="py-8 text-center text-sm text-muted-foreground"
                    >
                      No records found
                    </TableCell>
                  </TableRow>
                ) : (
                  visible.map((r) => {
                    const isLive = r.status === ACTIVE_STATUS;
                    return (
                      <TableRow
                        key={r.id}
                        data-state={
                          selectedId === r.id && panelOpen
                            ? "selected"
                            : undefined
                        }
                        className="cursor-pointer [&_td]:px-2 [&_td]:py-6"
                        onClick={() => handleRowSelect(r)}
                      >
                        <TableCell className="font-medium">
                          <span className="flex items-center gap-2">
                            {r.sessionTitle}
                            {isLive ? (
                              <Badge className="bg-accent-green-100 text-accent-green-700 hover:bg-accent-green-100">
                                LIVE
                              </Badge>
                            ) : null}
                          </span>
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-muted-foreground">
                          {r.formattedDatetime}
                        </TableCell>
                        <TableCell className="font-mono text-muted-foreground">
                          {r.pCode}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {r.workspaceName}
                        </TableCell>
                        <TableCell className="text-right">
                          {r.consumedMinutes}
                        </TableCell>
                        <TableCell className="text-right">
                          {r.attendeeCount}
                        </TableCell>
                        <TableCell className="w-10" />
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </InfiniteScroll>
        </div>
      </MainContainer>
    </div>
  );
}
