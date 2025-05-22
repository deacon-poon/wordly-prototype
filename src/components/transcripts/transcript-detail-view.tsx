"use client";

import { useState } from "react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import {
  Download,
  Trash2,
  FileText as FileTextIcon,
  FileQuestion,
  Plus,
  Pencil,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Languages,
  Maximize2,
  Minimize2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// Types
interface TranscriptSession {
  id: string;
  name: string;
  datetime: string;
  timezone: string;
}

interface TranscriptContent {
  id: string;
  language: string;
  content: string[];
  type: "original" | "translation" | "summary";
}

interface TranscriptDetailViewProps {
  session: TranscriptSession;
  transcripts: TranscriptContent[];
  availableLanguages: { code: string; name: string }[];
  onTranslate: (language: string) => void;
  onDownload: (options: { languages: string[]; types: string[] }) => void;
  onDelete: () => void;
  onEdit: (transcriptId: string) => void;
  onGenerateSummary: (language: string) => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export function TranscriptDetailView({
  session,
  transcripts,
  availableLanguages,
  onTranslate,
  onDownload,
  onDelete,
  onEdit,
  onGenerateSummary,
  isFullscreen = false,
  onToggleFullscreen,
}: TranscriptDetailViewProps) {
  // State
  const [selectedLanguage, setSelectedLanguage] = useState<string>("original");
  const [summaryExpanded, setSummaryExpanded] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState<{ [key: string]: string }>(
    {}
  );

  // Get available languages for transcript and summary
  const getAvailableLanguagesForType = (type: "transcript" | "summary") => {
    const languageCodes = transcripts
      .filter((t) =>
        type === "transcript"
          ? t.type === "original" || t.type === "translation"
          : t.type === "summary"
      )
      .map((t) => t.language);

    // Always include "original" for transcripts
    if (type === "transcript" && !languageCodes.includes("original")) {
      languageCodes.unshift("original");
    }

    return languageCodes;
  };

  // Get content
  const getContent = (language: string, type: "transcript" | "summary") => {
    const searchType =
      type === "transcript"
        ? language === "original"
          ? "original"
          : "translation"
        : "summary";

    const content = transcripts.find(
      (t) =>
        t.type === searchType &&
        (language === "original" || t.language === language)
    );

    return content?.content || [];
  };

  // Get transcripts and summaries for the selected language
  const transcriptContent = getContent(selectedLanguage, "transcript");
  const summaryContent = getContent(selectedLanguage, "summary");

  // Available languages
  const availableTranscriptLanguages =
    getAvailableLanguagesForType("transcript");
  const availableSummaryLanguages = getAvailableLanguagesForType("summary");

  // Missing languages (for translation options)
  const missingLanguages = availableLanguages.filter(
    (lang) =>
      !availableTranscriptLanguages.includes(lang.code) &&
      lang.code !== "original"
  );

  // Missing summary languages
  const missingSummaryLanguages = availableLanguages.filter(
    (lang) =>
      !availableSummaryLanguages.includes(lang.code) && lang.code !== "original"
  );

  // Determine if summary is available in selected language
  const hasSummaryInSelectedLanguage =
    availableSummaryLanguages.includes(selectedLanguage);

  // Function to get language name by code
  const getLanguageName = (code: string) => {
    if (code === "original") return "Original";
    return availableLanguages.find((l) => l.code === code)?.name || code;
  };

  // Handle language change
  const handleLanguageChange = (language: string) => {
    // If user selects a language that doesn't exist, offer to translate
    if (
      !availableTranscriptLanguages.includes(language) &&
      language !== "original"
    ) {
      onTranslate(language);
    } else {
      setSelectedLanguage(language);
      // Cancel edit mode when language changes
      if (editMode) {
        setEditMode(false);
        setEditedContent({});
      }
    }
  };

  // Handle edit mode
  const handleToggleEditMode = () => {
    if (editMode) {
      // Save changes (in a real app, we would call an API here)
      setEditMode(false);
      setEditedContent({});
      onEdit(transcripts.find((t) => t.type === "original")?.id || "");
    } else {
      setEditMode(true);
    }
  };

  // Handle editing a segment
  const handleEditSegment = (index: number, newText: string) => {
    setEditedContent((prev) => ({
      ...prev,
      [index]: newText,
    }));
  };

  // Render a transcript segment
  const renderSegment = (text: string, index: number) => {
    if (editMode && selectedLanguage === "original") {
      return (
        <div
          key={index}
          className="py-3 px-4 rounded-md bg-gray-50 mb-3 text-sm leading-relaxed group relative"
        >
          <textarea
            value={
              editedContent[index] !== undefined ? editedContent[index] : text
            }
            onChange={(e) => handleEditSegment(index, e.target.value)}
            className="w-full min-h-[60px] p-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      );
    }

    return (
      <div
        key={index}
        className={cn(
          "py-3 px-4 rounded-md mb-3 text-sm leading-relaxed group relative",
          editMode ? "hover:bg-blue-50 cursor-text" : "bg-gray-50"
        )}
        onClick={() => editMode && handleEditSegment(index, text)}
      >
        {text}
        {editMode && selectedLanguage === "original" && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              handleEditSegment(index, text);
            }}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-3 px-4 pt-4 mb-2">
        <div>
          <h2 className="text-xl font-semibold">
            {session.name}
            <span className="text-gray-500 text-sm font-normal ml-2">
              {session.datetime} {session.timezone}
            </span>
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Unified Language Selector */}
          <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-[160px] h-9">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="original">Original</SelectItem>
              {availableLanguages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Action Buttons */}
          {onToggleFullscreen && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onToggleFullscreen}
                  >
                    {isFullscreen ? (
                      <Minimize2 className="h-4 w-4" />
                    ) : (
                      <Maximize2 className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          <Button
            variant={editMode ? "default" : "outline"}
            size="sm"
            onClick={handleToggleEditMode}
            disabled={selectedLanguage !== "original" && !editMode}
          >
            {editMode ? (
              <>
                <Check className="h-3.5 w-3.5 mr-1.5" />
                Save
              </>
            ) : (
              <>
                <Pencil className="h-3.5 w-3.5 mr-1.5" />
                Edit
              </>
            )}
          </Button>

          {editMode && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEditMode(false);
                setEditedContent({});
              }}
            >
              <X className="h-3.5 w-3.5 mr-1.5" />
              Cancel
            </Button>
          )}

          <Button variant="outline" size="sm" onClick={() => onDelete()}>
            <Trash2 className="h-3.5 w-3.5 mr-1.5" />
            Delete
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-3.5 w-3.5 mr-1.5" />
                Download
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() =>
                  onDownload({
                    languages: [selectedLanguage],
                    types: ["transcript"],
                  })
                }
              >
                <FileTextIcon className="h-4 w-4 mr-2" />
                Download Transcript
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() =>
                  onDownload({
                    languages: [selectedLanguage],
                    types: ["summary"],
                  })
                }
                disabled={!hasSummaryInSelectedLanguage}
              >
                <FileQuestion className="h-4 w-4 mr-2" />
                Download Summary
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuLabel className="text-xs text-gray-500">
                Format
              </DropdownMenuLabel>
              <DropdownMenuItem>SRT (Subtitles)</DropdownMenuItem>
              <DropdownMenuItem>VTT (Web Subtitles)</DropdownMenuItem>
              <DropdownMenuItem>Text File</DropdownMenuItem>
              <DropdownMenuItem>Word Document</DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() =>
                  onDownload({ languages: ["all"], types: ["all"] })
                }
              >
                Download Everything
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {missingLanguages.length > 0 && (
                <>
                  <DropdownMenuLabel className="text-xs text-gray-500">
                    Translate transcript to:
                  </DropdownMenuLabel>
                  {missingLanguages.map((lang) => (
                    <DropdownMenuItem
                      key={lang.code}
                      onClick={() => onTranslate(lang.code)}
                    >
                      <Languages className="h-4 w-4 mr-2" />
                      {lang.name}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                </>
              )}

              {missingSummaryLanguages.length > 0 && (
                <>
                  <DropdownMenuLabel className="text-xs text-gray-500">
                    Generate summary in:
                  </DropdownMenuLabel>
                  {missingSummaryLanguages.map((lang) => (
                    <DropdownMenuItem
                      key={lang.code}
                      onClick={() => onGenerateSummary(lang.code)}
                    >
                      <FileQuestion className="h-4 w-4 mr-2" />
                      {lang.name}
                    </DropdownMenuItem>
                  ))}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Content Area - Side-by-side layout */}
      <div className="flex-1 overflow-hidden">
        {/* Use ResizablePanelGroup for side-by-side layout */}
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Transcript Panel */}
          <ResizablePanel defaultSize={60} minSize={30}>
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between px-4 py-3 sticky top-0 bg-white border-b z-10">
                <div className="flex items-center">
                  <FileTextIcon className="h-4 w-4 mr-2" />
                  <span className="font-medium">Transcript</span>
                  {selectedLanguage !== "original" && (
                    <span className="ml-2 text-sm text-gray-500">
                      ({getLanguageName(selectedLanguage)})
                    </span>
                  )}
                </div>

                {editMode && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Editing Mode</span>
                  </div>
                )}
              </div>

              <div className="p-4 overflow-auto flex-1">
                {transcriptContent.length > 0 ? (
                  transcriptContent.map((line, index) =>
                    renderSegment(line, index)
                  )
                ) : (
                  <div className="flex items-center justify-center h-32 text-gray-500">
                    {missingLanguages.length > 0 ? (
                      <div className="text-center">
                        <p className="mb-2">
                          No transcript available in this language.
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onTranslate(selectedLanguage)}
                        >
                          Translate to {getLanguageName(selectedLanguage)}
                        </Button>
                      </div>
                    ) : (
                      "No transcript content available."
                    )}
                  </div>
                )}
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Summary Panel */}
          <ResizablePanel defaultSize={40} minSize={20}>
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between px-4 py-3 sticky top-0 bg-white border-b z-10">
                <div className="flex items-center">
                  <FileQuestion className="h-4 w-4 mr-2" />
                  <span className="font-medium">Summary</span>
                </div>
              </div>

              <div className="p-4 overflow-auto flex-1">
                {summaryContent.length > 0 ? (
                  summaryContent.map((line, index) => (
                    <div
                      key={index}
                      className="py-2 px-3 rounded-md bg-gray-50 mb-2 text-sm"
                    >
                      {line}
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center text-center h-full">
                    <FileQuestion className="h-6 w-6 text-gray-400 mb-2" />
                    <p className="text-gray-600 mb-3">
                      No summary available in this language
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onGenerateSummary(selectedLanguage)}
                    >
                      Generate Summary
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
