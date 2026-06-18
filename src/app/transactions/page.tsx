"use client";

/**
 * Transactions — minute purchases/usage ledger.
 *
 * EXACT 1:1 React port of the Angular portal `app-transactions`
 * (wordly_portal: src/app/modules/transactions/transactions/transactions.component.*)
 * and `app-transaction-detail`.
 *
 * Anatomy reproduced faithfully:
 *   - Top actions row: From Date + To Date calendar pickers (with clear/today
 *     affordances) + a search input + a Download option (`app-download-options`).
 *   - Transaction header (`box-view transaction-header`): Account label +
 *     account dropdown + "Available Minutes: <n>".
 *   - Ledger LIST (`transactions-list-content` → `transactions-box` rows), NOT a
 *     generic table. Each row: amount-based icon (circle when 0 / circle-arrow
 *     for non-zero, success-green for credit, danger-red for debit), the
 *     `minDateFormat` date, the description (+ optional `(sessionLabel)`), and
 *     the signed `<n> mins` amount.
 *   - Expandable detail per row (`app-transaction-detail`): Time, Description,
 *     Amount, Type, Balance, User, Label. Built on Collapsible.
 *   - Pagination with 25 / 50 / 100 rows-per-page options (`p-paginator`).
 *
 * Mock-only: account switching, date filtering, search and paging all run
 * client-side over local mock ledgers. No production/backend logic.
 */

import * as React from "react";
import {
  ArrowUp,
  ArrowDown,
  Circle,
  Download,
  Search,
  RotateCcw,
  ChevronDown,
} from "lucide-react";

import { MainContainer } from "@/components/ui/main-container";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Model — mirrors the Angular `Transaction` / `LedgerModel` shape
// ---------------------------------------------------------------------------

interface Transaction {
  id: string;
  ledgerSequence: number;
  /** ISO timestamp. */
  timestamp: string;
  /** Signed minutes — positive = credit, negative = debit, 0 = neutral. */
  amount: number;
  description: string;
  sessionLabel: string;
  /** "credit" | "debit" (Angular transaction.action). */
  action: string;
  /** Running balance after this entry (Angular netTotal). */
  netTotal: number;
  /** Acting user (Angular actor). */
  actor: string;
  note: string;
}

interface MockAccount {
  id: string;
  title: string;
  availableMinutes: number;
  transactions: Transaction[];
}

// ---------------------------------------------------------------------------
// Locale-aware formatting helpers (mirror moment(...).format + i18next minutes)
// ---------------------------------------------------------------------------

/** Mirrors constants.minDateFormat used for the list row date. */
function formatMinDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Mirrors constants.dateMinTimeFormat used in the detail "Time" field. */
function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/** Mirrors the i18next `timeFormat.minutes` => "<n> mins" with locale digits. */
function formatMinutes(mins: number): string {
  const sign = mins > 0 ? "+" : "";
  return `${sign}${mins.toLocaleString()} mins`;
}

// ---------------------------------------------------------------------------
// Mock ledgers — 2026 dates, mix of credits + debits, some session labels.
// Each account has its own balance + transactions (matches account switching).
// ---------------------------------------------------------------------------

function buildLedger(
  entries: Array<{
    ts: string;
    amount: number;
    description: string;
    sessionLabel?: string;
    actor?: string;
    note?: string;
  }>
): Transaction[] {
  // Walk oldest→newest to compute a running balance, then present newest first.
  const chronological = [...entries].reverse();
  let running = 0;
  const withBalance = chronological.map((e, i) => {
    running += e.amount;
    return {
      id: `tx-${i}`,
      ledgerSequence: i + 1,
      timestamp: e.ts,
      amount: e.amount,
      description: e.description,
      sessionLabel: e.sessionLabel ?? "",
      action: e.amount >= 0 ? "credit" : "debit",
      netTotal: running,
      actor: e.actor ?? "system@wordly.ai",
      note: e.note ?? "",
    } satisfies Transaction;
  });
  return withBalance.reverse();
}

const ACCOUNTS: MockAccount[] = [
  {
    id: "acc-001-PROD9",
    title: "Acme Global Events",
    availableMinutes: 0, // filled below
    transactions: buildLedger([
      {
        ts: "2026-01-05T09:00:00Z",
        amount: 5000,
        description: "Minute pack — 5,000",
        actor: "deacon.poon@wordly.ai",
      },
      {
        ts: "2026-01-12T14:30:00Z",
        amount: -120,
        description: "Session usage — Product Team Weekly",
        sessionLabel: "PROD-WEEKLY",
      },
      {
        ts: "2026-02-01T08:00:00Z",
        amount: 2000,
        description: "Monthly plan allotment",
      },
      {
        ts: "2026-02-09T16:15:00Z",
        amount: -90,
        description: "Session usage — All-Hands Q1",
        sessionLabel: "ALLHANDS-Q1",
      },
      {
        ts: "2026-02-18T11:00:00Z",
        amount: -45,
        description: "Session usage — Investor Update",
        sessionLabel: "INV-FEB",
      },
      {
        ts: "2026-03-01T08:00:00Z",
        amount: 2000,
        description: "Monthly plan allotment",
      },
      {
        ts: "2026-03-03T10:45:00Z",
        amount: 0,
        description: "Plan adjustment — no minute change",
      },
      {
        ts: "2026-03-15T13:20:00Z",
        amount: -210,
        description: "Session usage — Customer Summit",
        sessionLabel: "SUMMIT-26",
      },
      {
        ts: "2026-04-01T08:00:00Z",
        amount: 2000,
        description: "Monthly plan allotment",
      },
      {
        ts: "2026-04-07T15:00:00Z",
        amount: -62,
        description: "Session usage — Engineering Standup",
        sessionLabel: "ENG-STANDUP",
      },
      {
        ts: "2026-04-22T09:30:00Z",
        amount: -150,
        description: "Session usage — Board Meeting",
        sessionLabel: "BOARD-Q1",
      },
      {
        ts: "2026-05-01T08:00:00Z",
        amount: 2000,
        description: "Monthly plan allotment",
      },
      {
        ts: "2026-05-11T12:00:00Z",
        amount: 10000,
        description: "Minute pack — 10,000",
        actor: "deacon.poon@wordly.ai",
      },
      {
        ts: "2026-05-19T14:00:00Z",
        amount: -300,
        description: "Session usage — Annual Conference",
        sessionLabel: "CONF-2026",
      },
      {
        ts: "2026-06-01T08:00:00Z",
        amount: 2000,
        description: "Monthly plan allotment",
      },
      {
        ts: "2026-06-08T10:00:00Z",
        amount: -75,
        description: "Session usage — Sales Kickoff",
        sessionLabel: "SKO-JUN",
      },
      {
        ts: "2026-06-14T16:45:00Z",
        amount: -48,
        description: "Session usage — Marketing Sync",
      },
    ]),
  },
  {
    id: "acc-002-EDU42",
    title: "Riverside University",
    availableMinutes: 0,
    transactions: buildLedger([
      {
        ts: "2026-01-08T09:00:00Z",
        amount: 3000,
        description: "Minute pack — 3,000",
        actor: "registrar@riverside.edu",
      },
      {
        ts: "2026-01-20T13:00:00Z",
        amount: -80,
        description: "Session usage — Lecture: Intro to Linguistics",
        sessionLabel: "LING-101",
      },
      {
        ts: "2026-02-03T10:00:00Z",
        amount: -120,
        description: "Session usage — Faculty Town Hall",
        sessionLabel: "FAC-TH",
      },
      {
        ts: "2026-02-14T15:30:00Z",
        amount: -65,
        description: "Session usage — Graduate Seminar",
      },
      {
        ts: "2026-03-01T08:00:00Z",
        amount: 1000,
        description: "Monthly plan allotment",
      },
      {
        ts: "2026-03-18T11:15:00Z",
        amount: -95,
        description: "Session usage — Commencement Rehearsal",
        sessionLabel: "COMM-26",
      },
      {
        ts: "2026-04-05T14:00:00Z",
        amount: 3000,
        description: "Minute pack — 3,000",
        actor: "registrar@riverside.edu",
      },
      {
        ts: "2026-04-29T09:45:00Z",
        amount: -140,
        description: "Session usage — International Symposium",
        sessionLabel: "INTL-SYMP",
      },
      {
        ts: "2026-05-22T16:00:00Z",
        amount: -55,
        description: "Session usage — Alumni Webinar",
      },
      {
        ts: "2026-06-10T10:30:00Z",
        amount: -70,
        description: "Session usage — Summer Orientation",
        sessionLabel: "ORIENT-26",
      },
    ]),
  },
  {
    id: "acc-003-GOV17",
    title: "City of Lakeside",
    availableMinutes: 0,
    transactions: buildLedger([
      {
        ts: "2026-02-01T08:00:00Z",
        amount: 1500,
        description: "Monthly plan allotment",
      },
      {
        ts: "2026-02-12T18:00:00Z",
        amount: -110,
        description: "Session usage — City Council Meeting",
        sessionLabel: "COUNCIL-FEB",
      },
      {
        ts: "2026-03-01T08:00:00Z",
        amount: 1500,
        description: "Monthly plan allotment",
      },
      {
        ts: "2026-03-12T18:00:00Z",
        amount: -130,
        description: "Session usage — City Council Meeting",
        sessionLabel: "COUNCIL-MAR",
      },
      {
        ts: "2026-04-01T08:00:00Z",
        amount: 1500,
        description: "Monthly plan allotment",
      },
      {
        ts: "2026-04-09T17:30:00Z",
        amount: -85,
        description: "Session usage — Public Works Hearing",
        sessionLabel: "PW-HEARING",
      },
      {
        ts: "2026-05-14T19:00:00Z",
        amount: -160,
        description: "Session usage — Budget Town Hall",
        sessionLabel: "BUDGET-26",
      },
    ]),
  },
];

// Compute each account's available minutes as the final running balance.
for (const acc of ACCOUNTS) {
  acc.availableMinutes = acc.transactions.length
    ? acc.transactions[0].netTotal
    : 0;
}

// ---------------------------------------------------------------------------
// Single-date picker — mirrors the Angular <p-calendar> (icon + showButtonBar
// with Today + Clear). Uses the shared Calendar primitive in a Popover.
// ---------------------------------------------------------------------------

function startOfDayLocal(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function CalendarFilter({
  id,
  label,
  value,
  onChange,
  min,
  max,
}: {
  id: string;
  label: string;
  value: Date | null;
  onChange: (d: Date | null) => void;
  min?: Date;
  max?: Date;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        className="text-xs font-medium leading-none text-gray-700"
      >
        {label}
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            id={id}
            type="button"
            className={cn(
              "flex h-9 w-[170px] items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-[color,box-shadow]",
              "hover:bg-accent focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
              !value && "text-muted-foreground"
            )}
          >
            <span className="truncate">
              {value
                ? value.toLocaleDateString(undefined, {
                    month: "2-digit",
                    day: "2-digit",
                    year: "numeric",
                  })
                : "MM/DD/YYYY"}
            </span>
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value ?? undefined}
            onSelect={(d) => {
              onChange(d ? startOfDayLocal(d) : null);
              if (d) setOpen(false);
            }}
            defaultMonth={value ?? undefined}
            disabled={[
              ...(min ? [{ before: min }] : []),
              ...(max ? [{ after: max }] : []),
            ]}
          />
          {/* Angular p-calendar showButtonBar: Today + Clear (clear styled danger). */}
          <div className="flex items-center justify-between gap-2 border-t border-border p-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                onChange(startOfDayLocal(new Date()));
                setOpen(false);
              }}
            >
              Today
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => {
                onChange(null);
                setOpen(false);
              }}
            >
              Clear
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Transaction detail — 1:1 port of app-transaction-detail (Time / Description /
// Amount / Type / Balance / User / Label rows).
// ---------------------------------------------------------------------------

function DetailItem({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-2 py-0.5 text-sm">
      <span className="min-w-[96px] font-medium text-gray-700">{label}:</span>
      <span className="text-gray-900">{children}</span>
    </div>
  );
}

function TransactionDetail({ transaction }: { transaction: Transaction }) {
  return (
    <div className="rounded-md bg-gray-50 px-4 py-3">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
        Transaction
      </div>
      <DetailItem label="Time">
        {formatDateTime(transaction.timestamp)}
      </DetailItem>
      <DetailItem label="Description">
        {transaction.description || "-"}
      </DetailItem>
      <DetailItem label="Amount">
        {formatMinutes(transaction.amount)}
      </DetailItem>
      <DetailItem label="Type">
        {transaction.action === "credit" ? "Credit" : "Debit"}
      </DetailItem>
      <DetailItem label="Balance">
        {transaction.netTotal.toLocaleString()} mins
      </DetailItem>
      <DetailItem label="User">{transaction.actor || "-"}</DetailItem>
      <DetailItem label="Label">{transaction.sessionLabel || "-"}</DetailItem>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

const PAGE_SIZES = [25, 50, 100];

export default function TransactionsPage() {
  const [accountId, setAccountId] = React.useState(ACCOUNTS[0].id);
  const [fromDate, setFromDate] = React.useState<Date | null>(null);
  const [toDate, setToDate] = React.useState<Date | null>(null);
  // searchInput is the live input value; searchFilter is the applied value
  // (Angular only filters on reload / Enter, not every keystroke).
  const [searchInput, setSearchInput] = React.useState("");
  const [searchFilter, setSearchFilter] = React.useState("");
  const [pageSize, setPageSize] = React.useState(PAGE_SIZES[0]);
  const [page, setPage] = React.useState(1);
  // The expanded (active) ledger row, mirrors activeTransaction.ledgerSequence.
  const [activeSeq, setActiveSeq] = React.useState<number | null>(null);

  const account = React.useMemo(
    () => ACCOUNTS.find((a) => a.id === accountId) ?? ACCOUNTS[0],
    [accountId]
  );

  const timeNow = React.useMemo(() => new Date(), []);

  // --- Client-side filtering (date range + search) ---
  const filtered = React.useMemo(() => {
    const fromMs = fromDate ? startOfDayLocal(fromDate).getTime() : null;
    const toMs = toDate
      ? new Date(
          toDate.getFullYear(),
          toDate.getMonth(),
          toDate.getDate(),
          23,
          59,
          59,
          999
        ).getTime()
      : null;
    const q = searchFilter.trim().toLowerCase();

    return account.transactions.filter((t) => {
      const ts = new Date(t.timestamp).getTime();
      if (fromMs !== null && ts < fromMs) return false;
      if (toMs !== null && ts > toMs) return false;
      if (q) {
        const haystack = `${t.description} ${t.sessionLabel}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [account, fromDate, toDate, searchFilter]);

  const total = filtered.length;
  const pageStart = (page - 1) * pageSize;
  const pageItems = filtered.slice(pageStart, pageStart + pageSize);
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  // Reset to first page on any filter / account / page-size change.
  React.useEffect(() => {
    setPage(1);
    setActiveSeq(null);
  }, [accountId, fromDate, toDate, searchFilter, pageSize]);

  function applySearch() {
    setSearchFilter(searchInput);
  }

  const filterDirty = searchInput.trim() !== searchFilter.trim();

  // The header account dropdown + Available Minutes (Angular transaction-header).
  const accountHeader = (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-4 rounded-md border border-border bg-gray-50/60 px-4 py-3">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">Account:</span>
        <Select value={accountId} onValueChange={setAccountId}>
          <SelectTrigger className="h-9 w-[240px]">
            <SelectValue placeholder="Select an Account" />
          </SelectTrigger>
          <SelectContent>
            {ACCOUNTS.map((a) => (
              <SelectItem key={a.id} value={a.id}>
                {a.title} ({a.id.slice(-5)})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="text-sm font-semibold text-gray-900">
        Available Minutes:{" "}
        <span className="text-accent-green-600">
          {account.availableMinutes.toLocaleString()}
        </span>
      </div>
    </div>
  );

  return (
    <div className="p-8">
      <MainContainer
        title={<span className="font-bold">Transactions</span>}
        description="Minute credits and usage for this account."
      >
        {/* Top actions: From/To date + Search + Download (Angular transactions-actions) */}
        <div className="mb-6 flex flex-wrap items-end gap-4">
          <CalendarFilter
            id="fromDate"
            label="From Date"
            value={fromDate}
            onChange={setFromDate}
            max={toDate && toDate < timeNow ? toDate : timeNow}
          />
          <span className="pb-2 text-gray-400">-</span>
          <CalendarFilter
            id="toDate"
            label="To Date"
            value={toDate}
            onChange={setToDate}
            min={fromDate ?? undefined}
            max={timeNow}
          />

          <div className="flex flex-col gap-1">
            <label
              htmlFor="pCodeSearch"
              className="text-xs font-medium leading-none text-gray-700"
            >
              Search
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                id="pCodeSearch"
                type="text"
                placeholder="search"
                value={searchInput}
                maxLength={200}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyUp={(e) => {
                  if (e.key === "Enter") applySearch();
                }}
                className="w-[220px] pl-8"
              />
            </div>
          </div>

          {/* Reload / Search Transactions trigger (Angular reload-transactions) */}
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-9 w-9"
            title={filterDirty ? "Search Transactions" : "Reload Transactions"}
            onClick={applySearch}
          >
            {filterDirty ? (
              <Search className="h-4 w-4" />
            ) : (
              <RotateCcw className="h-4 w-4" />
            )}
          </Button>

          <div className="ml-auto">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!pageItems.length}
              title="Download Transactions"
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </div>

        {/* Account header + Available Minutes */}
        {accountHeader}

        {/* Ledger LIST */}
        <div className="divide-y divide-border rounded-md border border-border">
          {pageItems.length === 0 ? (
            <div className="px-4 py-12 text-center text-sm text-muted-foreground">
              No transactions found.
            </div>
          ) : (
            pageItems.map((t) => {
              const isOpen = activeSeq === t.ledgerSequence;
              return (
                <Collapsible
                  key={t.id}
                  open={isOpen}
                  onOpenChange={(o) =>
                    setActiveSeq(o ? t.ledgerSequence : null)
                  }
                  className={cn(isOpen && "bg-primary-blue-50/40")}
                >
                  <CollapsibleTrigger asChild>
                    <div className="flex cursor-pointer items-center gap-4 px-4 py-3 hover:bg-gray-50">
                      {/* Amount-based icon */}
                      <div className="shrink-0">
                        {t.amount === 0 ? (
                          <Circle className="h-5 w-5 text-primary-blue-500" />
                        ) : t.amount > 0 ? (
                          <ArrowUp className="h-5 w-5 text-accent-green-600" />
                        ) : (
                          <ArrowDown className="h-5 w-5 text-destructive" />
                        )}
                      </div>
                      {/* Date */}
                      <div className="w-[110px] shrink-0 text-sm text-gray-500">
                        {formatMinDate(t.timestamp)}
                      </div>
                      {/* Description (+ optional session label) */}
                      <div className="min-w-0 flex-1 truncate text-sm text-gray-900">
                        {t.description}
                        {t.sessionLabel ? (
                          <span className="text-gray-500">
                            {" "}
                            ({t.sessionLabel})
                          </span>
                        ) : null}
                      </div>
                      {/* Signed amount */}
                      <div
                        className={cn(
                          "shrink-0 text-right text-sm font-medium tabular-nums",
                          t.amount > 0
                            ? "text-accent-green-600"
                            : t.amount < 0
                              ? "text-destructive"
                              : "text-gray-700"
                        )}
                      >
                        {formatMinutes(t.amount)}
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="px-4 pb-3">
                      <TransactionDetail transaction={t} />
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              );
            })
          )}
        </div>

        {/* Pagination + page-size selector (Angular p-paginator) */}
        {total > 0 ? (
          <>
            <Separator className="my-4" />
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="text-sm text-muted-foreground">
                Showing {total === 0 ? 0 : pageStart + 1}–
                {Math.min(pageStart + pageSize, total)} of {total}
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">Rows:</span>
                  <Select
                    value={String(pageSize)}
                    onValueChange={(v) => setPageSize(Number(v))}
                  >
                    <SelectTrigger className="h-9 w-[80px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PAGE_SIZES.map((size) => (
                        <SelectItem key={size} value={String(size)}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-700">
                    Page {page} of {pageCount}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={page >= pageCount}
                    onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </MainContainer>
    </div>
  );
}
