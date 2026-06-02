"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import { cn } from "../lib/utils";
import { CheckCircle, Clock } from "lucide-react";

export interface TableColumn<T> {
  header: string;
  accessorKey: string;
  cell?: (row: T) => React.ReactNode;
  className?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  onRowClick?: (row: T) => void;
  selectedItem?: T;
  idField?: keyof T;
  rowClassName?: (row: T) => string;
  emptyMessage?: string;
}

export function DataTable<T>({
  data,
  columns,
  onRowClick,
  selectedItem,
  idField = "id" as keyof T,
  rowClassName,
  emptyMessage = "No data available",
}: DataTableProps<T>) {
  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column, index) => (
              <TableHead key={index} className={cn(column.className)}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="text-center py-6 text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, rowIndex) => (
              <TableRow
                key={idField ? String(row[idField]) : rowIndex}
                className={cn(
                  "cursor-pointer hover:bg-gray-50",
                  selectedItem &&
                    idField &&
                    row[idField] === selectedItem[idField]
                    ? "bg-accent-green-50"
                    : "",
                  rowClassName && rowClassName(row)
                )}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map((column, colIndex) => (
                  <TableCell key={colIndex} className={cn(column.className)}>
                    {column.cell
                      ? column.cell(row)
                      : String(row[column.accessorKey as keyof T] || "")}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

/**
 * Highlights matching substrings within text.
 * Supports fuzzy-style highlighting by bolding all occurrences of the query.
 */
export function HighlightText({
  text,
  query,
  className,
}: {
  text: string;
  query?: string;
  className?: string;
}) {
  if (!query?.trim()) return <span className={className}>{text}</span>;

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();

  // Find all match positions
  const parts: { text: string; highlight: boolean }[] = [];
  let lastIndex = 0;
  let searchFrom = 0;

  while (searchFrom < lowerText.length) {
    const idx = lowerText.indexOf(lowerQuery, searchFrom);
    if (idx === -1) break;

    if (idx > lastIndex) {
      parts.push({ text: text.slice(lastIndex, idx), highlight: false });
    }
    parts.push({ text: text.slice(idx, idx + query.length), highlight: true });
    lastIndex = idx + query.length;
    searchFrom = lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push({ text: text.slice(lastIndex), highlight: false });
  }

  if (parts.length === 0) return <span className={className}>{text}</span>;

  return (
    <span className={className}>
      {parts.map((part, i) =>
        part.highlight ? (
          <mark
            key={i}
            className="bg-amber-200/70 text-inherit rounded-sm px-0.5"
          >
            {part.text}
          </mark>
        ) : (
          <span key={i}>{part.text}</span>
        )
      )}
    </span>
  );
}

export const StatusBadge = ({ status }: { status: string }) => {
  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "ACTIVE":
      case "COMPLETED":
      case "ENDED":
        return "bg-green-100 text-green-800";
      case "SCHEDULED":
        return "bg-blue-100 text-blue-800";
      case "CANCELED":
        return "bg-red-100 text-red-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case "ACTIVE":
      case "COMPLETED":
      case "ENDED":
        return <CheckCircle className="w-3.5 h-3.5 mr-1.5" />;
      case "SCHEDULED":
      case "PENDING":
        return <Clock className="w-3.5 h-3.5 mr-1.5" />;
      default:
        return null;
    }
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
        status
      )}`}
    >
      {getStatusIcon(status)}
      {status}
    </span>
  );
};
