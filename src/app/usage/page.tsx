"use client";

/**
 * Usage — workspace-level usage report.
 *
 * 1:1 design-parity port of the Angular `app-usage` component
 * (wordly_portal: src/app/modules/v2/usage) with isOrgUsage = false:
 *   - title "Usage" / description "See how long sessions ran and how many people attended."
 *   - filter bar: Date Range (default last 30 days), Session Title search, Live checkbox
 *   - sticky-header table (Session Title, Start Time, Session ID, Minutes Billed [r],
 *     Attendees [r], action) with infinite scroll
 *   - TOTAL subheader row (record count + total minutes, right-aligned under Minutes Billed)
 *   - "Download Usage Report" primary action in the header
 *   - usage-record side panel for the selected row
 *
 * Workspace-level => NO Workspace column and NO workspace selector (org-usage adds those).
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
  DateRangePicker,
  type DateRangeValue,
} from "@/components/ui/date-range-picker";
import { InfiniteScroll } from "@/components/ui/infinite-scroll";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Mock data — mirrors UsageSummary (subset used by the table + record panel)
// ---------------------------------------------------------------------------

interface UsageRow {
  id: string;
  sessionTitle: string;
  startTime: string; // ISO
  formattedDatetime: string;
  pCode: string;
  consumedMinutes: number;
  attendeeCount: number;
  status: string; // "ended" | "started"
  label: string;
  realDuration: number;
  languages: { language: string; count: number }[];
  presenters: { language: string; minutes: number }[];
}

const ACTIVE_STATUS = "started";

const ROWS: UsageRow[] = [
  {
    id: "u1",
    sessionTitle: "Product Team Weekly Sync",
    startTime: "2026-06-17T15:00:00Z",
    formattedDatetime: "Jun 17, 2026, 3:00 PM",
    pCode: "PRD-8821A",
    consumedMinutes: 62,
    attendeeCount: 8,
    status: "started",
    label: "Engineering",
    realDuration: 58,
    languages: [
      { language: "Spanish", count: 3 },
      { language: "French", count: 2 },
    ],
    presenters: [{ language: "English", minutes: 58 }],
  },
  {
    id: "u2",
    sessionTitle: "Customer Onboarding — Acme Corp",
    startTime: "2026-06-16T18:30:00Z",
    formattedDatetime: "Jun 16, 2026, 6:30 PM",
    pCode: "ONB-4417C",
    consumedMinutes: 45,
    attendeeCount: 4,
    status: "ended",
    label: "Success",
    realDuration: 43,
    languages: [{ language: "German", count: 4 }],
    presenters: [{ language: "English", minutes: 43 }],
  },
  {
    id: "u3",
    sessionTitle: "All-Hands Q2 Town Hall",
    startTime: "2026-06-12T16:00:00Z",
    formattedDatetime: "Jun 12, 2026, 4:00 PM",
    pCode: "AHQ-2026B",
    consumedMinutes: 96,
    attendeeCount: 124,
    status: "ended",
    label: "Company",
    realDuration: 92,
    languages: [
      { language: "Spanish", count: 48 },
      { language: "Portuguese", count: 31 },
      { language: "Japanese", count: 22 },
    ],
    presenters: [{ language: "English", minutes: 92 }],
  },
  {
    id: "u4",
    sessionTitle: "Marketing Campaign Review",
    startTime: "2026-06-10T14:00:00Z",
    formattedDatetime: "Jun 10, 2026, 2:00 PM",
    pCode: "MKT-7730D",
    consumedMinutes: 30,
    attendeeCount: 6,
    status: "ended",
    label: "Marketing",
    realDuration: 29,
    languages: [{ language: "French", count: 6 }],
    presenters: [{ language: "English", minutes: 29 }],
  },
  {
    id: "u5",
    sessionTitle: "Engineering Architecture Deep Dive",
    startTime: "2026-06-08T17:00:00Z",
    formattedDatetime: "Jun 8, 2026, 5:00 PM",
    pCode: "ENG-9912E",
    consumedMinutes: 78,
    attendeeCount: 15,
    status: "ended",
    label: "Engineering",
    realDuration: 75,
    languages: [{ language: "Mandarin", count: 9 }],
    presenters: [{ language: "English", minutes: 75 }],
  },
  {
    id: "u6",
    sessionTitle: "Quarterly Board Briefing",
    startTime: "2026-06-05T13:00:00Z",
    formattedDatetime: "Jun 5, 2026, 1:00 PM",
    pCode: "BRD-5503F",
    consumedMinutes: 54,
    attendeeCount: 11,
    status: "ended",
    label: "Executive",
    realDuration: 52,
    languages: [{ language: "Spanish", count: 5 }],
    presenters: [{ language: "English", minutes: 52 }],
  },
  {
    id: "u7",
    sessionTitle: "Sales Pipeline Standup",
    startTime: "2026-06-03T15:30:00Z",
    formattedDatetime: "Jun 3, 2026, 3:30 PM",
    pCode: "SAL-1184G",
    consumedMinutes: 22,
    attendeeCount: 7,
    status: "ended",
    label: "Sales",
    realDuration: 21,
    languages: [{ language: "Italian", count: 3 }],
    presenters: [{ language: "English", minutes: 21 }],
  },
  {
    id: "u8",
    sessionTitle: "Localization Working Group",
    startTime: "2026-05-30T16:00:00Z",
    formattedDatetime: "May 30, 2026, 4:00 PM",
    pCode: "LOC-6675H",
    consumedMinutes: 41,
    attendeeCount: 19,
    status: "ended",
    label: "Product",
    realDuration: 40,
    languages: [
      { language: "Korean", count: 8 },
      { language: "Japanese", count: 7 },
    ],
    presenters: [{ language: "English", minutes: 40 }],
  },
  {
    id: "u9",
    sessionTitle: "Customer Advisory Council",
    startTime: "2026-05-28T18:00:00Z",
    formattedDatetime: "May 28, 2026, 6:00 PM",
    pCode: "CAC-3390J",
    consumedMinutes: 88,
    attendeeCount: 34,
    status: "ended",
    label: "Success",
    realDuration: 84,
    languages: [{ language: "Spanish", count: 14 }],
    presenters: [{ language: "English", minutes: 84 }],
  },
  {
    id: "u10",
    sessionTitle: "Support Team Retro",
    startTime: "2026-05-26T14:30:00Z",
    formattedDatetime: "May 26, 2026, 2:30 PM",
    pCode: "SUP-2218K",
    consumedMinutes: 35,
    attendeeCount: 9,
    status: "ended",
    label: "Support",
    realDuration: 34,
    languages: [{ language: "Portuguese", count: 4 }],
    presenters: [{ language: "English", minutes: 34 }],
  },
  {
    id: "u11",
    sessionTitle: "New Hire Orientation",
    startTime: "2026-05-22T16:30:00Z",
    formattedDatetime: "May 22, 2026, 4:30 PM",
    pCode: "HRO-9041L",
    consumedMinutes: 60,
    attendeeCount: 23,
    status: "ended",
    label: "People",
    realDuration: 57,
    languages: [{ language: "French", count: 6 }],
    presenters: [{ language: "English", minutes: 57 }],
  },
  {
    id: "u12",
    sessionTitle: "Investor Update Webinar",
    startTime: "2026-05-20T17:00:00Z",
    formattedDatetime: "May 20, 2026, 5:00 PM",
    pCode: "INV-7766M",
    consumedMinutes: 47,
    attendeeCount: 58,
    status: "ended",
    label: "Executive",
    realDuration: 45,
    languages: [
      { language: "German", count: 12 },
      { language: "Spanish", count: 9 },
    ],
    presenters: [{ language: "English", minutes: 45 }],
  },
  {
    id: "u13",
    sessionTitle: "Design Critique — Mobile",
    startTime: "2026-05-18T15:00:00Z",
    formattedDatetime: "May 18, 2026, 3:00 PM",
    pCode: "DSN-4429N",
    consumedMinutes: 33,
    attendeeCount: 5,
    status: "ended",
    label: "Design",
    realDuration: 32,
    languages: [{ language: "Japanese", count: 2 }],
    presenters: [{ language: "English", minutes: 32 }],
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

// ---------------------------------------------------------------------------
// Side panel — port of usage-record.component.html
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

export default function UsagePage() {
  const last30: DateRangeValue = React.useMemo(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 29);
    return [start, end];
  }, []);

  const [dateRange, setDateRange] = React.useState<DateRangeValue>(last30);
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
      if (liveOnly && r.status !== ACTIVE_STATUS) return false;
      if (dateRange) {
        const t = new Date(r.startTime).getTime();
        if (t < dateRange[0].getTime() || t > dateRange[1].getTime())
          return false;
      }
      return true;
    });
  }, [search, liveOnly, dateRange]);

  React.useEffect(() => {
    setVisibleCount(PAGE_LIMIT);
  }, [search, liveOnly, dateRange]);

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
                  <TableCell className="whitespace-nowrap px-2 py-1 text-right text-muted-foreground">
                    {minToHourFormat(totalMinutes)}
                  </TableCell>
                  <TableCell />
                  <TableCell />
                </TableRow>

                {visible.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
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
