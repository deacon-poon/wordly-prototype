"use client";

import { useState, useRef } from "react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Trash2,
  FileText,
  Languages,
  Plus,
  FileQuestion,
  FileText as FileTextIcon,
  MoreHorizontal,
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
  const [selectedTab, setSelectedTab] = useState<"transcript" | "summary">(
    "transcript"
  );
  const [selectedLanguage, setSelectedLanguage] = useState<string>("original");
  const [compareLanguage, setCompareLanguage] = useState<string | null>(
    transcripts.find(
      (t) =>
        t.language !== "original" &&
        (t.type === "translation" || t.type === "original")
    )?.language || null
  );
  const [showComparison, setShowComparison] = useState<boolean>(true);

  // Get available languages for current tab type
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

  // Available languages for current tab
  const availableTabLanguages = getAvailableLanguagesForType(selectedTab);

  // Get transcript content
  const primaryContent = getContent(selectedLanguage, selectedTab);
  const secondaryContent = compareLanguage
    ? getContent(compareLanguage, selectedTab)
    : [];

  // Options for creating new translations/summaries
  const missingLanguages = availableLanguages.filter(
    (lang) =>
      !availableTabLanguages.includes(lang.code) ||
      (selectedTab === "summary" && lang.code === "original")
  );

  // Function to get language name by code
  const getLanguageName = (code: string) => {
    if (code === "original") return "Original";
    return availableLanguages.find((l) => l.code === code)?.name || code;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4 mb-4">
        <div>
          <h1 className="text-2xl font-bold">
            {session.name}{" "}
            <span className="text-gray-500 text-sm font-normal ml-2">
              {session.datetime} {session.timezone}
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => onDelete()}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
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
                Download Current Transcript
              </DropdownMenuItem>
              {selectedTab === "summary" && (
                <DropdownMenuItem
                  onClick={() =>
                    onDownload({
                      languages: [selectedLanguage],
                      types: ["summary"],
                    })
                  }
                >
                  Download Current Summary
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  onDownload({
                    languages: availableTabLanguages,
                    types: [selectedTab],
                  })
                }
              >
                Download All{" "}
                {selectedTab === "transcript" ? "Transcripts" : "Summaries"}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  onDownload({ languages: ["all"], types: ["all"] })
                }
              >
                Download Everything
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowComparison(!showComparison)}
            className={showComparison ? "bg-gray-100" : ""}
          >
            {showComparison ? (
              <ChevronRight className="h-4 w-4 mr-2" />
            ) : (
              <ChevronLeft className="h-4 w-4 mr-2" />
            )}
            {showComparison ? "Hide Comparison" : "Compare"}
          </Button>
        </div>
      </div>

      {/* Tab Navigation and Language Selection */}
      <div className="flex items-center justify-between mb-4">
        <Tabs
          value={selectedTab}
          onValueChange={(value) => {
            setSelectedTab(value as "transcript" | "summary");
            setSelectedLanguage("original"); // Reset to original when switching tabs
            setCompareLanguage(null);
          }}
          className="w-[400px]"
        >
          <TabsList>
            <TabsTrigger value="transcript" className="flex items-center">
              <FileTextIcon className="h-4 w-4 mr-2" />
              Transcript
            </TabsTrigger>
            <TabsTrigger value="summary" className="flex items-center">
              <FileQuestion className="h-4 w-4 mr-2" />
              Summary
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-2">Language:</span>
            <Select
              value={selectedLanguage}
              onValueChange={(value) => setSelectedLanguage(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {availableTabLanguages.map((langCode) => (
                  <SelectItem key={langCode} value={langCode}>
                    {getLanguageName(langCode)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {showComparison && (
            <div className="flex items-center ml-4">
              <span className="text-sm text-gray-500 mr-2">Compare with:</span>
              <Select
                value={compareLanguage || ""}
                onValueChange={(value) => setCompareLanguage(value || null)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {availableTabLanguages
                    .filter((lang) => lang !== selectedLanguage)
                    .map((langCode) => (
                      <SelectItem key={langCode} value={langCode}>
                        {getLanguageName(langCode)}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {selectedTab === "transcript" && (
                <>
                  <DropdownMenuItem
                    onClick={() =>
                      onEdit(
                        transcripts.find((t) => t.type === "original")?.id || ""
                      )
                    }
                    disabled={!transcripts.some((t) => t.type === "original")}
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit Transcript
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}

              {missingLanguages.length > 0 ? (
                <>
                  <div className="px-2 py-1 text-xs text-gray-500">
                    Translate to:
                  </div>
                  {missingLanguages.map((lang) => (
                    <DropdownMenuItem
                      key={lang.code}
                      onClick={() =>
                        selectedTab === "transcript"
                          ? onTranslate(lang.code)
                          : onGenerateSummary(lang.code)
                      }
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

      {/* Content Area */}
      <ResizablePanelGroup
        direction="horizontal"
        className="flex-grow border rounded-md overflow-hidden"
      >
        <ResizablePanel defaultSize={showComparison ? 50 : 100} minSize={30}>
          <div className="h-full overflow-auto p-4">
            <div className="mb-2 text-sm font-medium text-gray-500">
              {getLanguageName(selectedLanguage)}
            </div>
            {primaryContent.length > 0 ? (
              primaryContent.map((line, index) => (
                <div
                  key={index}
                  className="py-2 px-3 rounded-md bg-gray-100 mb-2"
                >
                  {line}
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No content available for the selected language and type.
              </div>
            )}
          </div>
        </ResizablePanel>

        {showComparison && (
          <>
            <ResizableHandle />

            <ResizablePanel defaultSize={50} minSize={30}>
              <div className="h-full overflow-auto p-4">
                <div className="mb-2 text-sm font-medium text-gray-500">
                  {compareLanguage
                    ? getLanguageName(compareLanguage)
                    : "Select language to compare"}
                </div>
                {secondaryContent.length > 0 ? (
                  secondaryContent.map((line, index) => (
                    <div
                      key={index}
                      className="py-2 px-3 rounded-md bg-gray-100 mb-2"
                    >
                      {line}
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    {compareLanguage
                      ? "No content available for this language and type."
                      : "Please select a language to compare."}
                  </div>
                )}
              </div>
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </div>
  );
}
