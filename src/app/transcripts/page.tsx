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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Download,
  FileText,
  MoreHorizontal,
  RefreshCcw,
  Share2,
  Trash2,
  Languages,
  FileQuestion,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { TranscriptDetailView } from "@/components/transcripts/transcript-detail-view";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

// Mock data
const mockTranscripts = [
  {
    id: "ssod-5071",
    name: "SSOD-5071",
    date: "May 7, 2025",
    time: "8:57 PM",
    duration: "56:23",
    languages: ["original", "en-US", "es-MX"],
    hasSummary: true,
  },
  {
    id: "ssod-4982",
    name: "SSOD-4982",
    date: "May 5, 2025",
    time: "10:15 AM",
    duration: "42:10",
    languages: ["original", "en-US"],
    hasSummary: true,
  },
  {
    id: "mtg-alpha-283",
    name: "MTG-ALPHA-283",
    date: "May 2, 2025",
    time: "3:30 PM",
    duration: "28:45",
    languages: ["original"],
    hasSummary: false,
  },
  {
    id: "ssod-4831",
    name: "SSOD-4831",
    date: "April 28, 2025",
    time: "1:20 PM",
    duration: "1:05:32",
    languages: ["original", "en-US", "es-MX", "fr-FR"],
    hasSummary: true,
  },
  {
    id: "ssod-4822",
    name: "SSOD-4822",
    date: "April 27, 2025",
    time: "11:45 AM",
    duration: "35:12",
    languages: ["original", "en-US", "zh-CN"],
    hasSummary: true,
  },
];

// Mock transcript content
const mockTranscriptContent = [
  {
    id: "transcript-original",
    language: "original",
    type: "original" as const,
    content: [
      "Hello, hello, hello.",
      "I am naughty boy deacon.",
      "Hello.",
      "Hello.",
      "你好，她是信使，你們喜歡明我講什麽?",
      "हिंदी",
      "And this is another line of text for the transcript.",
      "We can add more content here to demonstrate scrolling.",
      "The transcript should be able to display multiple paragraphs.",
    ],
  },
  {
    id: "transcript-en",
    language: "en-US",
    type: "translation" as const,
    content: [
      "Hello, hello, hello.",
      "I am naughty boy deacon.",
      "Hello.",
      "Hello.",
      "Hello, she is the messenger, what would you like me to talk about?",
      "Hindi",
      "And this is another line of text for the transcript.",
      "We can add more content here to demonstrate scrolling.",
      "The transcript should be able to display multiple paragraphs.",
    ],
  },
  {
    id: "transcript-es",
    language: "es-MX",
    type: "translation" as const,
    content: [
      "Hola, hola, hola.",
      "Soy un chico travieso diácono.",
      "Hola.",
      "Hola.",
      "Hola, ella es la mensajera, ¿de qué les gustaría que hablara?",
      "Hindi",
      "Y esta es otra línea de texto para la transcripción.",
      "Podemos agregar más contenido aquí para demostrar el desplazamiento.",
      "La transcripción debería poder mostrar múltiples párrafos.",
    ],
  },
  {
    id: "summary-en",
    language: "en-US",
    type: "summary" as const,
    content: [
      "The conversation begins with greetings.",
      "The speaker introduces himself as 'naughty boy deacon'.",
      "The speaker then starts speaking in different languages including Chinese and Hindi.",
      "There are multiple lines of text to demonstrate how a transcript would appear with various paragraphs and content.",
    ],
  },
  {
    id: "summary-es",
    language: "es-MX",
    type: "summary" as const,
    content: [
      "La conversación comienza con saludos.",
      "El hablante se presenta como 'travieso diácono'.",
      "Luego, el hablante comienza a hablar en diferentes idiomas, incluidos el chino y el hindi.",
      "Hay varias líneas de texto para demostrar cómo aparecería una transcripción con varios párrafos y contenido.",
    ],
  },
];

const availableLanguages = [
  { code: "en-US", name: "English (US)" },
  { code: "es-MX", name: "Spanish (Mexico)" },
  { code: "fr-FR", name: "French (France)" },
  { code: "de-DE", name: "German" },
  { code: "zh-CN", name: "Chinese (Simplified)" },
  { code: "ja-JP", name: "Japanese" },
  { code: "ko-KR", name: "Korean" },
  { code: "ru-RU", name: "Russian" },
  { code: "ar-SA", name: "Arabic" },
  { code: "hi-IN", name: "Hindi" },
];

const mockSession = {
  id: "ssod-5071",
  name: "SSOD-5071",
  datetime: "May 7, 2025 8:57 PM",
  timezone: "(GMT-5)",
};

function TranscriptsPageContent() {
  const [transcripts, setTranscripts] = useState(mockTranscripts);
  const [selectedTranscripts, setSelectedTranscripts] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTranscriptId, setSelectedTranscriptId] = useState<
    string | null
  >(mockTranscripts[0]?.id || null);
  const [transcriptContent, setTranscriptContent] = useState(
    mockTranscriptContent
  );

  // Filtered and sorted transcripts
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

  // Get the selected transcript
  const selectedTranscript = selectedTranscriptId
    ? transcripts.find((t) => t.id === selectedTranscriptId)
    : null;

  // Handlers
  const toggleSelectAll = () => {
    if (selectedTranscripts.length === transcripts.length) {
      setSelectedTranscripts([]);
    } else {
      setSelectedTranscripts(transcripts.map((t) => t.id));
    }
  };

  const toggleSelectTranscript = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedTranscripts((prev) =>
      prev.includes(id) ? prev.filter((tId) => tId !== id) : [...prev, id]
    );
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  };

  const handleSelectTranscript = (id: string) => {
    setSelectedTranscriptId(id);
  };

  const handleGenerateTranslation = () => {
    alert(
      `Generating translations for ${selectedTranscripts.length} transcript(s)`
    );
  };

  const handleGenerateSummary = (language: string) => {
    alert(`Generating summary for ${language}`);
  };

  const handleDeleteSelected = () => {
    alert(`Deleting ${selectedTranscripts.length} transcript(s)`);
    setTranscripts((prev) =>
      prev.filter((t) => !selectedTranscripts.includes(t.id))
    );
    setSelectedTranscripts([]);
  };

  const handleDownloadSelected = () => {
    alert(`Downloading ${selectedTranscripts.length} transcript(s)`);
  };

  const handleTranslate = (language: string) => {
    alert(`Translating to ${language}`);
  };

  const handleDownload = (options: {
    languages: string[];
    types: string[];
  }) => {
    alert(
      `Downloading ${options.types.join(", ")} in ${options.languages.join(
        ", "
      )}`
    );
  };

  const handleDelete = () => {
    alert("Deleting transcript");
  };

  const handleEdit = (transcriptId: string) => {
    alert(`Editing transcript ${transcriptId}`);
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
    <div className="flex flex-col h-full">
      {/* Header and search */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Transcripts</h1>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search transcripts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-72"
          />
          <Button>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Selected Items Actions */}
      {selectedTranscripts.length > 0 && (
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-gray-600">
            {selectedTranscripts.length} item(s) selected
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerateTranslation}
          >
            <Languages className="mr-2 h-4 w-4" />
            Translate
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleGenerateSummary("en-US")}
          >
            <FileQuestion className="mr-2 h-4 w-4" />
            Summarize
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadSelected}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDeleteSelected}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      )}

      {/* Main content with resizable panels */}
      <ResizablePanelGroup
        direction="horizontal"
        className="flex-1 border rounded-md overflow-hidden"
      >
        {/* Transcript list panel */}
        <ResizablePanel defaultSize={30} minSize={20} maxSize={50}>
          <div className="h-full overflow-auto">
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
                        selectedTranscriptId === transcript.id
                          ? "bg-gray-100"
                          : ""
                      }`}
                      onClick={() => handleSelectTranscript(transcript.id)}
                    >
                      <TableCell className="p-2">
                        <Checkbox
                          checked={selectedTranscripts.includes(transcript.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedTranscripts((prev) => [
                                ...prev,
                                transcript.id,
                              ]);
                            } else {
                              setSelectedTranscripts((prev) =>
                                prev.filter((id) => id !== transcript.id)
                              );
                            }
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium hover:text-blue-600">
                          {transcript.name}
                          <div className="flex flex-wrap gap-1 mt-1">
                            <Badge
                              variant="outline"
                              className="bg-gray-50 text-xs"
                            >
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
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTranslate("en-US");
                              }}
                            >
                              <Languages className="mr-2 h-4 w-4" />
                              Translate
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownload({
                                  languages: ["original"],
                                  types: ["transcript"],
                                });
                              }}
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                alert("Sharing transcript");
                              }}
                            >
                              <Share2 className="mr-2 h-4 w-4" />
                              Share
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete();
                              }}
                            >
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
                      {searchQuery ? (
                        <div>
                          <p className="text-lg font-semibold">
                            No matching transcripts found
                          </p>
                          <p className="text-gray-500">
                            Try a different search term
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-lg font-semibold">
                            No transcripts yet
                          </p>
                          <p className="text-gray-500">
                            Transcripts will appear here after you create them
                          </p>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Transcript detail panel */}
        <ResizablePanel defaultSize={70}>
          <div className="h-full overflow-auto p-0">
            {selectedTranscript ? (
              <TranscriptDetailView
                session={mockSession}
                transcripts={transcriptContent}
                availableLanguages={availableLanguages}
                onTranslate={handleTranslate}
                onDownload={handleDownload}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onGenerateSummary={handleGenerateSummary}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <FileText className="h-12 w-12 mb-4 mx-auto text-gray-300" />
                  <p className="text-lg font-semibold">
                    Select a transcript to view
                  </p>
                  <p className="text-gray-400">
                    Click on any transcript in the list to view its details
                  </p>
                </div>
              </div>
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

export default function TranscriptsPage() {
  return <TranscriptsPageContent />;
}
