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
  Search,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { TranscriptDetailView } from "@/components/transcripts/transcript-detail-view";
import { EnhancedTranscriptEditor } from "@/components/transcripts/enhanced-transcript-editor";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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

// Enhanced mock data for new editor
const mockTranscriptSegments = [
  {
    id: "seg-1",
    startTime: 0,
    endTime: 3,
    speakerId: "speaker-1",
    speakerName: "Deacon Poon",
    originalText: "Hello, hello, hello.",
    translatedText: "Hola, hola, hola.",
    confidence: 0.95,
    isEdited: false,
    glossaryTermsUsed: [],
  },
  {
    id: "seg-2",
    startTime: 3,
    endTime: 7,
    speakerId: "speaker-1",
    speakerName: "Deacon Poon",
    originalText: "I am naughty boy deacon.",
    translatedText: "Soy un chico travieso diácono.",
    confidence: 0.87,
    isEdited: false,
    glossaryTermsUsed: ["naughty boy"],
  },
  {
    id: "seg-3",
    startTime: 7,
    endTime: 11,
    speakerId: "speaker-1",
    speakerName: "Deacon Poon",
    originalText: "你好，她是信使，你們喜歡明我講什麽?",
    translatedText:
      "Hello, she is the messenger, what would you like me to talk about?",
    confidence: 0.92,
    isEdited: false,
    glossaryTermsUsed: ["messenger"],
  },
  {
    id: "seg-4",
    startTime: 11,
    endTime: 13,
    speakerId: "speaker-1",
    speakerName: "Deacon Poon",
    originalText: "हिंदी",
    translatedText: "Hindi",
    confidence: 0.98,
    isEdited: false,
    glossaryTermsUsed: [],
  },
];

const mockSpeakers = [
  {
    id: "speaker-1",
    name: "Deacon Poon",
    language: "Multilingual",
    avatar: undefined,
  },
  {
    id: "speaker-2",
    name: "Attendee 1",
    language: "English",
    avatar: undefined,
  },
];

const mockSessionInfo = {
  id: "ssod-5071",
  title: "SSOD-5071",
  date: "May 7, 2025 8:57 PM",
  duration: "56:23",
  status: "completed" as const,
  participants: 8,
  selectedGlossary: {
    id: "glossary-1",
    name: "Technical Terms",
    description: "Common technical terminology for product discussions",
  },
};

const mockAvailableGlossaries = [
  {
    id: "glossary-1",
    name: "Technical Terms",
    description: "Common technical terminology for product discussions",
  },
  {
    id: "glossary-2",
    name: "Business Vocabulary",
    description: "Business and corporate terminology",
  },
  {
    id: "glossary-3",
    name: "Medical Terms",
    description: "Healthcare and medical terminology",
  },
];

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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentView, setCurrentView] = useState<"list" | "detail">("list");
  const [isEnhancedEditorOpen, setIsEnhancedEditorOpen] = useState(false);

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
    setCurrentView("detail");
  };

  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleBackToList = () => {
    setCurrentView("list");
    setIsFullscreen(false);
  };

  const handleGenerateTranslation = (
    targetLanguage: string,
    useGlossary: boolean
  ) => {
    console.log(
      "Generating translation to:",
      targetLanguage,
      "with glossary:",
      useGlossary
    );
    // In a real app, call translation API
  };

  const handleGenerateSummary = (language: string) => {
    console.log("Generating summary in:", language);
    // In a real app, call summary API
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
    console.log("Edit transcript:", transcriptId);
    // Open enhanced editor
    setIsEnhancedEditorOpen(true);
  };

  // Enhanced editor handlers
  const handleSaveSegments = (segments: any[]) => {
    console.log("Saving transcript segments:", segments);
    // In a real app, save to backend
  };

  const handleUpdateGlossary = (glossaryId: string) => {
    console.log("Updating glossary:", glossaryId);
    // In a real app, update session glossary
  };

  const handleNavigateToSession = () => {
    console.log("Navigate to session");
    // In a real app, navigate to sessions page
    window.location.href = "/sessions";
  };

  const handleNavigateToGlossary = (glossaryId: string) => {
    console.log("Navigate to glossary:", glossaryId);
    // In a real app, navigate to glossary page
    window.location.href = `/glossaries?id=${glossaryId}`;
  };

  const handleCloseEnhancedEditor = () => {
    setIsEnhancedEditorOpen(false);
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

  // On larger screens (lg+), show both in a panel layout unless fullscreen is enabled
  return (
    <div className="flex flex-col h-full p-4 max-w-full mx-auto">
      {/* Mobile/Tablet View Tabs */}
      <div className="lg:hidden mb-4">
        <Tabs
          defaultValue="list"
          value={currentView}
          onValueChange={(value) => setCurrentView(value as "list" | "detail")}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">Transcript List</TabsTrigger>
            <TabsTrigger value="detail" disabled={!selectedTranscript}>
              Selected Transcript
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Mobile/Tablet View */}
      <div className="lg:hidden flex-1">
        {currentView === "list" && (
          <div className="flex flex-col h-full bg-white rounded-lg border shadow-sm">
            {/* Header and search */}
            <div className="flex items-center justify-between p-4 border-b">
              <h1 className="text-lg font-semibold">Transcripts</h1>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" title="Refresh">
                  <RefreshCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="px-4 py-3 border-b">
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

            {/* Selected Items Actions */}
            {selectedTranscripts.length > 0 && (
              <div className="flex items-center gap-2 p-3 border-b bg-gray-50">
                <span className="text-sm text-gray-600">
                  {selectedTranscripts.length} selected
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleGenerateSummary("en-US")}
                  className="h-8"
                >
                  <FileQuestion className="h-3.5 w-3.5 mr-1.5" />
                  Summarize
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadSelected}
                  className="h-8"
                >
                  <Download className="h-3.5 w-3.5 mr-1.5" />
                  Download
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteSelected}
                  className="h-8"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                  Delete
                </Button>
              </div>
            )}

            {/* Transcript list */}
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
                          selectedTranscriptId === transcript.id
                            ? "bg-gray-100"
                            : ""
                        }`}
                        onClick={() => handleSelectTranscript(transcript.id)}
                      >
                        <TableCell className="p-2">
                          <Checkbox
                            checked={selectedTranscripts.includes(
                              transcript.id
                            )}
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
                          <div className="font-medium hover:text-secondary-navy-600">
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
                                  handleEdit(transcript.id);
                                }}
                              >
                                <FileText className="mr-2 h-4 w-4" />
                                Edit Transcript
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleGenerateSummary("en-US");
                                }}
                              >
                                <FileQuestion className="mr-2 h-4 w-4" />
                                Summarize
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleShare(transcript.id);
                                }}
                              >
                                <Share2 className="mr-2 h-4 w-4" />
                                Share
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete();
                                }}
                                className="text-red-600"
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
        )}

        {currentView === "detail" && selectedTranscript && (
          <div className="flex flex-col h-full bg-white rounded-lg border shadow-sm">
            <div className="px-4 py-2 border-b">
              <Button variant="outline" size="sm" onClick={handleBackToList}>
                ← Back to List
              </Button>
            </div>
            <div className="flex-1">
              {isEnhancedEditorOpen ? (
                <EnhancedTranscriptEditor
                  sessionInfo={mockSessionInfo}
                  segments={mockTranscriptSegments}
                  speakers={mockSpeakers}
                  availableLanguages={availableLanguages}
                  availableGlossaries={mockAvailableGlossaries}
                  onSave={handleSaveSegments}
                  onGenerateTranslation={handleGenerateTranslation}
                  onGenerateSummary={handleGenerateSummary}
                  onUpdateGlossary={handleUpdateGlossary}
                  onNavigateToSession={handleNavigateToSession}
                  onNavigateToGlossary={handleNavigateToGlossary}
                  onClose={handleCloseEnhancedEditor}
                />
              ) : (
                <TranscriptDetailView
                  session={mockSession}
                  transcripts={transcriptContent}
                  availableLanguages={availableLanguages}
                  onTranslate={handleTranslate}
                  onDownload={handleDownload}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                  onGenerateSummary={handleGenerateSummary}
                  isFullscreen={isFullscreen}
                  onToggleFullscreen={handleToggleFullscreen}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Desktop View: Resizable Panels */}
      <div className="hidden lg:block flex-1">
        {isFullscreen && selectedTranscript ? (
          <div className="h-full bg-white rounded-lg border shadow-sm">
            <TranscriptDetailView
              session={mockSession}
              transcripts={transcriptContent}
              availableLanguages={availableLanguages}
              onTranslate={handleTranslate}
              onDownload={handleDownload}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onGenerateSummary={handleGenerateSummary}
              isFullscreen={true}
              onToggleFullscreen={handleToggleFullscreen}
            />
          </div>
        ) : (
          <ResizablePanelGroup
            direction="horizontal"
            className="h-full border rounded-lg overflow-hidden bg-white"
          >
            {/* List Panel */}
            <ResizablePanel defaultSize={30} minSize={20} maxSize={50}>
              <div className="flex flex-col h-full">
                {/* Header and search */}
                <div className="flex items-center justify-between p-4 border-b">
                  <h1 className="text-lg font-semibold">Transcripts</h1>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" title="Refresh">
                      <RefreshCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="px-4 py-3 border-b">
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

                {/* Selected Items Actions */}
                {selectedTranscripts.length > 0 && (
                  <div className="flex items-center gap-2 p-3 border-b bg-gray-50">
                    <span className="text-sm text-gray-600">
                      {selectedTranscripts.length} selected
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleGenerateSummary("en-US")}
                      className="h-8"
                    >
                      <FileQuestion className="h-3.5 w-3.5 mr-1.5" />
                      Summarize
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownloadSelected}
                      className="h-8"
                    >
                      <Download className="h-3.5 w-3.5 mr-1.5" />
                      Download
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleDeleteSelected}
                      className="h-8"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                      Delete
                    </Button>
                  </div>
                )}

                {/* Transcript list */}
                <div className="flex-1 overflow-auto">
                  <Table>
                    <TableHeader className="sticky top-0 bg-white z-10">
                      <TableRow>
                        <TableHead className="w-[40px]">
                          <Checkbox
                            checked={
                              selectedTranscripts.length ===
                                transcripts.length && transcripts.length > 0
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
                          className="cursor-pointer w-[180px]"
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
                            onClick={() =>
                              handleSelectTranscript(transcript.id)
                            }
                          >
                            <TableCell className="p-2">
                              <Checkbox
                                checked={selectedTranscripts.includes(
                                  transcript.id
                                )}
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
                              <div className="font-medium hover:text-secondary-navy-600">
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
                              </div>
                            </TableCell>
                            <TableCell>
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
                                      handleEdit(transcript.id);
                                    }}
                                  >
                                    <FileText className="mr-2 h-4 w-4" />
                                    Edit Transcript
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleGenerateSummary("en-US");
                                    }}
                                  >
                                    <FileQuestion className="mr-2 h-4 w-4" />
                                    Summarize
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleShare(transcript.id);
                                    }}
                                  >
                                    <Share2 className="mr-2 h-4 w-4" />
                                    Share
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDelete();
                                    }}
                                    className="text-red-600"
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
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Detail Panel */}
            <ResizablePanel defaultSize={70}>
              <div className="h-full">
                {selectedTranscript ? (
                  <>
                    {isEnhancedEditorOpen ? (
                      <EnhancedTranscriptEditor
                        sessionInfo={mockSessionInfo}
                        segments={mockTranscriptSegments}
                        speakers={mockSpeakers}
                        availableLanguages={availableLanguages}
                        availableGlossaries={mockAvailableGlossaries}
                        onSave={handleSaveSegments}
                        onGenerateTranslation={handleGenerateTranslation}
                        onGenerateSummary={handleGenerateSummary}
                        onUpdateGlossary={handleUpdateGlossary}
                        onNavigateToSession={handleNavigateToSession}
                        onNavigateToGlossary={handleNavigateToGlossary}
                        onClose={handleCloseEnhancedEditor}
                      />
                    ) : (
                      <TranscriptDetailView
                        session={mockSession}
                        transcripts={transcriptContent}
                        availableLanguages={availableLanguages}
                        onTranslate={handleTranslate}
                        onDownload={handleDownload}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                        onGenerateSummary={handleGenerateSummary}
                        isFullscreen={isFullscreen}
                        onToggleFullscreen={handleToggleFullscreen}
                      />
                    )}
                  </>
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
        )}
      </div>
    </div>
  );
}

// This function is needed for proper type checking
const handleShare = (id: string) => {
  alert(`Sharing transcript ${id}`);
};

export default function TranscriptsPage() {
  return <TranscriptsPageContent />;
}
