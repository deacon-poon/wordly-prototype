"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
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
                    ? "bg-brand-teal/10"
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
