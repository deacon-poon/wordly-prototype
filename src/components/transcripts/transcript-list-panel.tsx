"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  FileText,
  RefreshCcw,
  Trash2,
  Languages,
  FileQuestion,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Search,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TranscriptData } from "./transcript-workspace";

interface TranscriptListPanelProps {
  transcripts: TranscriptData[];
  selectedTranscriptId: string | null;
  selectedTranscripts: string[];
  onSelectTranscript: (id: string) => void;
  onToggleSelectTranscript: (id: string) => void;
  onBulkAction: (
    action: "translate" | "summarize" | "download" | "delete"
  ) => void;
}

export function TranscriptListPanel({
  transcripts,
  selectedTranscriptId,
  selectedTranscripts,
  onSelectTranscript,
  onToggleSelectTranscript,
  onBulkAction,
}: TranscriptListPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Filter transcripts by search query
  const filteredTranscripts = transcripts.filter(
    (transcript) =>
      transcript.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transcript.date.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort transcripts
  const sortedTranscripts = [...filteredTranscripts].sort((a, b) => {
    let comparison = 0;
    if (sortBy === "name") {
      comparison = a.name.localeCompare(b.name);
    } else if (sortBy === "date") {
      // Sort by date and then by time for same-day transcripts
      const dateComparison =
        new Date(a.date).getTime() - new Date(b.date).getTime();
      comparison =
        dateComparison === 0 ? a.time.localeCompare(b.time) : dateComparison;
    } else if (sortBy === "duration") {
      // Convert durations to seconds for comparison
      const [aMin, aSec] = a.duration.split(":").map(Number);
      const [bMin, bSec] = b.duration.split(":").map(Number);
      const aSeconds = aMin * 60 + (aSec || 0);
      const bSeconds = bMin * 60 + (bSec || 0);
      comparison = aSeconds - bSeconds;
    }

    return sortDirection === "asc" ? comparison : -comparison;
  });

  // Toggle select all
  const toggleSelectAll = () => {
    if (selectedTranscripts.length === transcripts.length) {
      // Deselect all
      onBulkAction("translate"); // This just sends an empty array
    } else {
      // Select all
      transcripts.forEach((t) => {
        if (!selectedTranscripts.includes(t.id)) {
          onToggleSelectTranscript(t.id);
        }
      });
    }
  };

  // Handle sort column click
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  };

  // Sort indicator component
  const SortIndicator = ({ column }: { column: string }) => {
    if (sortBy !== column) return null;
    return sortDirection === "asc" ? (
      <ArrowUp className="ml-1 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-1 h-4 w-4" />
    );
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border shadow-sm">
      {/* Header and Search */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-lg font-semibold">Transcripts</h2>
          <Button variant="ghost" size="icon" title="Refresh">
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search transcripts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedTranscripts.length > 0 && (
        <div className="flex items-center gap-2 p-3 border-b bg-gray-50">
          <span className="text-sm text-gray-600 mr-1">
            {selectedTranscripts.length} selected
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onBulkAction("translate")}
            className="h-8"
          >
            <Languages className="h-3.5 w-3.5 mr-1.5" />
            Translate
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onBulkAction("summarize")}
            className="h-8"
          >
            <FileQuestion className="h-3.5 w-3.5 mr-1.5" />
            Summarize
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onBulkAction("download")}
            className="h-8"
          >
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Download
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onBulkAction("delete")}
            className="h-8"
          >
            <Trash2 className="h-3.5 w-3.5 mr-1.5" />
            Delete
          </Button>
        </div>
      )}

      {/* Transcript List */}
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-white z-10">
            <TableRow>
              <TableHead className="w-[40px]">
                <Checkbox
                  checked={
                    selectedTranscripts.length === transcripts.length &&
                    transcripts.length > 0
                  }
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center">
                  Name <SortIndicator column="name" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer w-[180px] hidden md:table-cell"
                onClick={() => handleSort("date")}
              >
                <div className="flex items-center">
                  Date <SortIndicator column="date" />
                </div>
              </TableHead>
              <TableHead className="w-[40px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTranscripts.length > 0 ? (
              sortedTranscripts.map((transcript) => (
                <TableRow
                  key={transcript.id}
                  className={`cursor-pointer hover:bg-gray-50 ${
                    selectedTranscriptId === transcript.id ? "bg-gray-100" : ""
                  }`}
                  onClick={() => onSelectTranscript(transcript.id)}
                >
                  <TableCell className="p-2">
                    <Checkbox
                      checked={selectedTranscripts.includes(transcript.id)}
                      onCheckedChange={() =>
                        onToggleSelectTranscript(transcript.id)
                      }
                      onClick={(e) => e.stopPropagation()}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="font-medium hover:text-secondary-navy-600">
                      {transcript.name}
                      <div className="flex flex-wrap gap-1 mt-1">
                        <Badge variant="outline" className="bg-gray-50 text-xs">
                          <FileText className="mr-1 h-3 w-3" />
                          {transcript.languages.length}
                        </Badge>
                        {transcript.hasSummary && (
                          <Badge
                            variant="outline"
                            className="bg-gray-50 text-xs"
                          >
                            <FileQuestion className="mr-1 h-3 w-3" />
                            Summary
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 md:hidden">
                        {transcript.date} · {transcript.duration}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div>{transcript.date}</div>
                    <div className="text-xs text-gray-500">
                      {transcript.duration}
                    </div>
                  </TableCell>
                  <TableCell className="p-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Languages className="mr-2 h-4 w-4" />
                          Translate
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileQuestion className="mr-2 h-4 w-4" />
                          Summarize
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  <div className="text-gray-500">
                    {searchQuery
                      ? "No transcripts found matching your search."
                      : "No transcripts available."}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
