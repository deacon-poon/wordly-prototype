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
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
}: TranscriptDetailViewProps) {
  // State
  const [transcriptLanguage, setTranscriptLanguage] =
    useState<string>("original");
  const [summaryLanguage, setSummaryLanguage] = useState<string>(
    transcripts.find((t) => t.type === "summary")?.language || "en-US"
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

  // Get transcript content for selected language and type
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

  // Available languages for transcripts and summaries
  const availableTranscriptLanguages =
    getAvailableLanguagesForType("transcript");
  const availableSummaryLanguages = getAvailableLanguagesForType("summary");

  // Get content
  const transcriptContent = getContent(transcriptLanguage, "transcript");
  const summaryContent = getContent(summaryLanguage, "summary");

  // Options for creating new translations/summaries
  const missingTranscriptLanguages = availableLanguages.filter(
    (lang) => !availableTranscriptLanguages.includes(lang.code)
  );

  const missingSummaryLanguages = availableLanguages.filter(
    (lang) =>
      !availableSummaryLanguages.includes(lang.code) && lang.code !== "original"
  );

  // Function to get language name by code
  const getLanguageName = (code: string) => {
    if (code === "original") return "Original";
    return availableLanguages.find((l) => l.code === code)?.name || code;
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
                    languages: [transcriptLanguage],
                    types: ["transcript"],
                  })
                }
              >
                Download Transcript
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  onDownload({
                    languages: [summaryLanguage],
                    types: ["summary"],
                  })
                }
              >
                Download Summary
              </DropdownMenuItem>
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
        </div>
      </div>

      {/* Content Area */}
      <ResizablePanelGroup
        direction="horizontal"
        className="flex-1 border-t overflow-hidden"
      >
        {/* Transcript Panel */}
        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="h-full overflow-auto">
            <div className="flex items-center justify-between px-4 py-2 border-b">
              <div className="flex items-center">
                <FileTextIcon className="h-3.5 w-3.5 mr-1.5" />
                <span className="font-medium">Transcript</span>
              </div>
              <div className="flex items-center gap-2">
                <Select
                  value={transcriptLanguage}
                  onValueChange={setTranscriptLanguage}
                >
                  <SelectTrigger className="w-[140px] h-8 text-xs">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTranscriptLanguages.map((langCode) => (
                      <SelectItem key={langCode} value={langCode}>
                        {getLanguageName(langCode)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() =>
                        onEdit(
                          transcripts.find((t) => t.type === "original")?.id ||
                            ""
                        )
                      }
                      disabled={!transcripts.some((t) => t.type === "original")}
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit Transcript
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {missingTranscriptLanguages.length > 0 && (
                      <>
                        <div className="px-2 py-1 text-xs text-gray-500">
                          Translate to:
                        </div>
                        {missingTranscriptLanguages.map((lang) => (
                          <DropdownMenuItem
                            key={lang.code}
                            onClick={() => onTranslate(lang.code)}
                          >
                            {lang.name}
                          </DropdownMenuItem>
                        ))}
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="p-4">
              {transcriptContent.length > 0 ? (
                transcriptContent.map((line, index) => (
                  <div
                    key={index}
                    className="py-2 px-3 rounded-md bg-gray-50 mb-2 text-sm leading-relaxed"
                  >
                    {line}
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-32 text-gray-500">
                  No transcript available for the selected language.
                </div>
              )}
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Summary Panel */}
        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="h-full overflow-auto">
            <div className="flex items-center justify-between px-4 py-2 border-b">
              <div className="flex items-center">
                <FileQuestion className="h-3.5 w-3.5 mr-1.5" />
                <span className="font-medium">Summary</span>
              </div>
              <div className="flex items-center gap-2">
                <Select
                  value={summaryLanguage}
                  onValueChange={setSummaryLanguage}
                >
                  <SelectTrigger className="w-[140px] h-8 text-xs">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSummaryLanguages.map((langCode) => (
                      <SelectItem key={langCode} value={langCode}>
                        {getLanguageName(langCode)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {missingSummaryLanguages.length > 0 ? (
                      <>
                        <div className="px-2 py-1 text-xs text-gray-500">
                          Generate summary in:
                        </div>
                        {missingSummaryLanguages.map((lang) => (
                          <DropdownMenuItem
                            key={lang.code}
                            onClick={() => onGenerateSummary(lang.code)}
                          >
                            {lang.name}
                          </DropdownMenuItem>
                        ))}
                      </>
                    ) : (
                      <div className="px-2 py-1 text-xs text-gray-500">
                        All languages available
                      </div>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="p-4">
              {summaryContent.length > 0 ? (
                summaryContent.map((line, index) => (
                  <div
                    key={index}
                    className="py-2 px-3 rounded-md bg-gray-50 mb-2 text-sm leading-relaxed"
                  >
                    {line}
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-32 text-gray-500">
                  {availableSummaryLanguages.length === 0 ? (
                    <div className="text-center">
                      <p className="mb-2">No summary available.</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onGenerateSummary("en-US")}
                      >
                        Generate Summary
                      </Button>
                    </div>
                  ) : (
                    "No summary available for the selected language."
                  )}
                </div>
              )}
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
