import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "./table";

/**
 * Table is a thin set of styled primitives (Table, TableHeader, TableBody,
 * TableFooter, TableHead, TableRow, TableCell, TableCaption) that compose into
 * a full data table. There are no variant props, so each story is a composed
 * example mirroring the meaningful states from the portal table component:
 * basic data, selectable rows, row numbers, a footer summary, loading, and empty.
 */
const meta: Meta<typeof Table> = {
  title: "Design System/Organisms/Table",
  component: Table,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof Table>;

type Session = {
  id: string;
  name: string;
  language: string;
  attendees: number;
  status: string;
};

const SESSIONS: Session[] = [
  {
    id: "s1",
    name: "Opening Keynote",
    language: "English (US)",
    attendees: 412,
    status: "Live",
  },
  {
    id: "s2",
    name: "Product Deep Dive",
    language: "Spanish (MX)",
    attendees: 188,
    status: "Scheduled",
  },
  {
    id: "s3",
    name: "Partner Panel",
    language: "French (FR)",
    attendees: 96,
    status: "Scheduled",
  },
  {
    id: "s4",
    name: "Closing Remarks",
    language: "Welsh - Cymraeg",
    attendees: 54,
    status: "Draft",
  },
];

// --- Basic data table -------------------------------------------------------

export const Default: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Session</TableHead>
          <TableHead>Language</TableHead>
          <TableHead className="text-right">Attendees</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {SESSIONS.map((s) => (
          <TableRow key={s.id}>
            <TableCell className="font-medium">{s.name}</TableCell>
            <TableCell>{s.language}</TableCell>
            <TableCell className="text-right">{s.attendees}</TableCell>
            <TableCell>{s.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

// --- With caption -----------------------------------------------------------

export const WithCaption: Story = {
  render: () => (
    <Table>
      <TableCaption>A list of sessions for this event.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Session</TableHead>
          <TableHead>Language</TableHead>
          <TableHead className="text-right">Attendees</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {SESSIONS.map((s) => (
          <TableRow key={s.id}>
            <TableCell className="font-medium">{s.name}</TableCell>
            <TableCell>{s.language}</TableCell>
            <TableCell className="text-right">{s.attendees}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

// --- With footer summary ----------------------------------------------------

export const WithFooter: Story = {
  render: () => {
    const total = SESSIONS.reduce((sum, s) => sum + s.attendees, 0);
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Session</TableHead>
            <TableHead>Language</TableHead>
            <TableHead className="text-right">Attendees</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {SESSIONS.map((s) => (
            <TableRow key={s.id}>
              <TableCell className="font-medium">{s.name}</TableCell>
              <TableCell>{s.language}</TableCell>
              <TableCell className="text-right">{s.attendees}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell className="text-right">{total}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    );
  },
};

// --- Row numbers ------------------------------------------------------------

/** Mirrors the portal table showRowNumber option. */
export const WithRowNumbers: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">#</TableHead>
          <TableHead>Session</TableHead>
          <TableHead>Language</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {SESSIONS.map((s, i) => (
          <TableRow key={s.id}>
            <TableCell className="text-muted-foreground">{i + 1}</TableCell>
            <TableCell className="font-medium">{s.name}</TableCell>
            <TableCell>{s.language}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

// --- Selectable rows --------------------------------------------------------

/** Clicking a row toggles its selected state via the data-state attribute. */
export const SelectableRows: Story = {
  render: () => {
    const [selected, setSelected] = React.useState<string | null>("s1");
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Session</TableHead>
            <TableHead>Language</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {SESSIONS.map((s) => (
            <TableRow
              key={s.id}
              data-state={selected === s.id ? "selected" : undefined}
              className="cursor-pointer"
              onClick={() => setSelected(selected === s.id ? null : s.id)}
            >
              <TableCell className="font-medium">{s.name}</TableCell>
              <TableCell>{s.language}</TableCell>
              <TableCell>{s.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  },
};

// --- Loading state ----------------------------------------------------------

/** Skeleton placeholder rows while data is being fetched. */
export const Loading: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Session</TableHead>
          <TableHead>Language</TableHead>
          <TableHead className="text-right">Attendees</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 4 }).map((_, i) => (
          <TableRow key={i}>
            <TableCell>
              <div className="h-4 w-40 animate-pulse rounded bg-muted" />
            </TableCell>
            <TableCell>
              <div className="h-4 w-28 animate-pulse rounded bg-muted" />
            </TableCell>
            <TableCell className="text-right">
              <div className="ml-auto h-4 w-12 animate-pulse rounded bg-muted" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

// --- Empty state ------------------------------------------------------------

/** No rows: a full-width message cell stands in for the body. */
export const Empty: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Session</TableHead>
          <TableHead>Language</TableHead>
          <TableHead className="text-right">Attendees</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell
            colSpan={3}
            className="h-24 text-center text-muted-foreground"
          >
            No sessions yet.
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};
