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
  Globe,
  Languages,
  Edit3,
  ExternalLink,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const [originalLanguage, setOriginalLanguage] = useState<string>("original");
  const [translationLanguage, setTranslationLanguage] = useState<string>(
    transcripts.find((t) => t.type === "translation")?.language || "en-US"
  );
  const [selectedTab, setSelectedTab] = useState<string>("transcript");
  const [editMode, setEditMode] = useState<boolean>(false);

  // Get available languages for original, translation and summary
  const getAvailableLanguagesForType = (
    type: "original" | "translation" | "summary"
  ) => {
    const languageCodes = transcripts
      .filter((t) => {
        if (type === "original") return t.type === "original";
        if (type === "translation") return t.type === "translation";
        return t.type === "summary";
      })
      .map((t) => t.language);

    // Always include "original" for original
    if (type === "original" && !languageCodes.includes("original")) {
      languageCodes.unshift("original");
    }

    return languageCodes;
  };

  // Get content for selected language and type
  const getContent = (
    language: string,
    type: "original" | "translation" | "summary"
  ) => {
    const searchType =
      type === "original"
        ? "original"
        : type === "translation"
        ? "translation"
        : "summary";

    const content = transcripts.find(
      (t) =>
        t.type === searchType &&
        (language === "original" || t.language === language)
    );

    return content?.content || [];
  };

  // Available languages for different types
  const availableOriginalLanguages = getAvailableLanguagesForType("original");
  const availableTranslationLanguages =
    getAvailableLanguagesForType("translation");
  const availableSummaryLanguages = getAvailableLanguagesForType("summary");

  // Get content
  const originalContent = getContent(originalLanguage, "original");
  const translationContent = getContent(translationLanguage, "translation");
  const originalSummaryContent = getContent(originalLanguage, "summary");
  const translationSummaryContent = getContent(translationLanguage, "summary");

  // Options for creating new translations/summaries
  const missingTranslationLanguages = availableLanguages.filter(
    (lang) => !availableTranslationLanguages.includes(lang.code)
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
      <div className="flex items-center justify-between border-b pb-2 px-4 pt-3">
        <div>
          <h2 className="text-lg font-semibold flex items-center">
            {session.name}
            <span className="text-gray-500 text-sm font-normal ml-2">
              {session.datetime} {session.timezone}
            </span>
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Tabs
            value={selectedTab}
            onValueChange={setSelectedTab}
            className="mr-4"
          >
            <TabsList>
              <TabsTrigger value="transcript" className="text-xs px-3">
                Transcript
              </TabsTrigger>
              <TabsTrigger value="summary" className="text-xs px-3">
                Summary
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditMode(!editMode)}
          >
            <Edit3 className="h-3.5 w-3.5 mr-1.5" />
            {editMode ? "View Mode" : "Edit Mode"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onDownload({ languages: ["all"], types: ["all"] })}
          >
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Download
          </Button>

          <Button variant="outline" size="sm" onClick={() => onDelete()}>
            <Trash2 className="h-3.5 w-3.5 mr-1.5" />
            Delete
          </Button>
        </div>
      </div>

      <TabsContent value="transcript" className="flex-1 mt-0 p-0">
        {/* Content Area */}
        <ResizablePanelGroup
          direction="horizontal"
          className="flex-1 overflow-hidden"
        >
          {/* Original Language Panel */}
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="h-full overflow-auto flex flex-col">
              <div className="flex items-center justify-between px-4 py-2 border-b bg-gray-50">
                <div className="flex items-center">
                  <FileTextIcon className="h-3.5 w-3.5 mr-1.5" />
                  <span className="font-medium">Original Language</span>
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={originalLanguage}
                    onValueChange={setOriginalLanguage}
                  >
                    <SelectTrigger className="w-[140px] h-8 text-xs">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableOriginalLanguages.map((langCode) => (
                        <SelectItem key={langCode} value={langCode}>
                          {getLanguageName(langCode)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() =>
                      onEdit(
                        transcripts.find((t) => t.type === "original")?.id || ""
                      )
                    }
                    disabled={
                      !transcripts.some((t) => t.type === "original") ||
                      editMode
                    }
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              <div className={cn("p-4", editMode ? "flex-1" : "")}>
                {originalContent.length > 0 ? (
                  editMode ? (
                    <textarea
                      className="w-full h-full min-h-[300px] p-3 text-sm border rounded-md"
                      defaultValue={originalContent.join("\n\n")}
                    />
                  ) : (
                    originalContent.map((line, index) => (
                      <div
                        key={index}
                        className="py-2 px-3 rounded-md bg-gray-50 mb-2 text-sm leading-relaxed"
                      >
                        {line}
                      </div>
                    ))
                  )
                ) : (
                  <div className="flex items-center justify-center h-32 text-gray-500">
                    No transcript available in this language.
                  </div>
                )}
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Translation Panel */}
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="h-full overflow-auto flex flex-col">
              <div className="flex items-center justify-between px-4 py-2 border-b bg-gray-50">
                <div className="flex items-center">
                  <Languages className="h-3.5 w-3.5 mr-1.5" />
                  <span className="font-medium">Translation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={translationLanguage}
                    onValueChange={setTranslationLanguage}
                  >
                    <SelectTrigger className="w-[140px] h-8 text-xs">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTranslationLanguages.length > 0 ? (
                        availableTranslationLanguages.map((langCode) => (
                          <SelectItem key={langCode} value={langCode}>
                            {getLanguageName(langCode)}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-2 py-1.5 text-xs text-gray-500">
                          No translations available
                        </div>
                      )}

                      {missingTranslationLanguages.length > 0 && (
                        <>
                          <DropdownMenuSeparator />
                          <div className="px-2 py-1.5 text-xs text-gray-500">
                            Translate to:
                          </div>
                          {missingTranslationLanguages.map((lang) => (
                            <SelectItem
                              key={lang.code}
                              value={`translate:${lang.code}`}
                              onClick={() => onTranslate(lang.code)}
                            >
                              + {lang.name}
                            </SelectItem>
                          ))}
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className={cn("p-4", editMode ? "flex-1" : "")}>
                {translationContent.length > 0 ? (
                  editMode ? (
                    <textarea
                      className="w-full h-full min-h-[300px] p-3 text-sm border rounded-md"
                      defaultValue={translationContent.join("\n\n")}
                    />
                  ) : (
                    translationContent.map((line, index) => (
                      <div
                        key={index}
                        className="py-2 px-3 rounded-md bg-gray-50 mb-2 text-sm leading-relaxed"
                      >
                        {line}
                      </div>
                    ))
                  )
                ) : (
                  <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                    <p className="mb-2">
                      No translation available for this language.
                    </p>
                    {missingTranslationLanguages.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          onTranslate(missingTranslationLanguages[0].code)
                        }
                      >
                        Translate to {missingTranslationLanguages[0].name}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </TabsContent>

      <TabsContent value="summary" className="flex-1 mt-0 p-0">
        {/* Summary Content Area */}
        <ResizablePanelGroup
          direction="horizontal"
          className="flex-1 overflow-hidden"
        >
          {/* Original Summary Panel */}
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="h-full overflow-auto">
              <div className="flex items-center justify-between px-4 py-2 border-b bg-gray-50">
                <div className="flex items-center">
                  <FileQuestion className="h-3.5 w-3.5 mr-1.5" />
                  <span className="font-medium">Original Summary</span>
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={originalLanguage}
                    onValueChange={setOriginalLanguage}
                  >
                    <SelectTrigger className="w-[140px] h-8 text-xs">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableOriginalLanguages.map((langCode) => (
                        <SelectItem key={langCode} value={langCode}>
                          {getLanguageName(langCode)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="p-4">
                {originalSummaryContent.length > 0 ? (
                  originalSummaryContent.map((line, index) => (
                    <div
                      key={index}
                      className="py-2 px-3 rounded-md bg-gray-50 mb-2 text-sm leading-relaxed"
                    >
                      {line}
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                    <p className="mb-2">
                      No summary available for this language.
                    </p>
                    {originalLanguage !== "original" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onGenerateSummary(originalLanguage)}
                      >
                        Generate Summary
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Translation Summary Panel */}
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="h-full overflow-auto">
              <div className="flex items-center justify-between px-4 py-2 border-b bg-gray-50">
                <div className="flex items-center">
                  <FileQuestion className="h-3.5 w-3.5 mr-1.5" />
                  <span className="font-medium">Translated Summary</span>
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={translationLanguage}
                    onValueChange={setTranslationLanguage}
                  >
                    <SelectTrigger className="w-[140px] h-8 text-xs">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTranslationLanguages.length > 0 ? (
                        availableTranslationLanguages.map((langCode) => (
                          <SelectItem key={langCode} value={langCode}>
                            {getLanguageName(langCode)}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-2 py-1.5 text-xs text-gray-500">
                          No translations available
                        </div>
                      )}

                      {missingSummaryLanguages.length > 0 && (
                        <>
                          <DropdownMenuSeparator />
                          <div className="px-2 py-1.5 text-xs text-gray-500">
                            Generate summary in:
                          </div>
                          {missingSummaryLanguages.map((lang) => (
                            <SelectItem
                              key={lang.code}
                              value={`generate:${lang.code}`}
                              onClick={() => onGenerateSummary(lang.code)}
                            >
                              + {lang.name}
                            </SelectItem>
                          ))}
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="p-4">
                {translationSummaryContent.length > 0 ? (
                  translationSummaryContent.map((line, index) => (
                    <div
                      key={index}
                      className="py-2 px-3 rounded-md bg-gray-50 mb-2 text-sm leading-relaxed"
                    >
                      {line}
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                    <p className="mb-2">
                      No summary available for this language.
                    </p>
                    {translationLanguage !== "original" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onGenerateSummary(translationLanguage)}
                      >
                        Generate Summary
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </TabsContent>

      {/* Edit Mode Button (shown at bottom when in edit mode) */}
      {editMode && (
        <div className="flex justify-end p-4 border-t bg-gray-50">
          <Button
            variant="outline"
            size="sm"
            className="mr-2"
            onClick={() => setEditMode(false)}
          >
            Cancel
          </Button>
          <Button
            className="bg-brand-teal hover:bg-brand-teal/90 text-white"
            size="sm"
          >
            Save Changes
          </Button>
        </div>
      )}

      {/* Full Edit View Button */}
      <Button
        variant="outline"
        size="sm"
        className="absolute bottom-4 right-4 flex items-center gap-1 rounded-full px-3 py-1 bg-white shadow-md border-gray-200"
        onClick={() => {
          // Logic to open full editing view
          onEdit(transcripts.find((t) => t.type === "original")?.id || "");
        }}
      >
        <ExternalLink className="h-3.5 w-3.5" />
        <span className="text-xs">Open in Editor</span>
      </Button>
    </div>
  );
}
