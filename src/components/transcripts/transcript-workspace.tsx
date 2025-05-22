"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Maximize2,
  Minimize2,
  Download,
  Trash2,
  FileText,
  FileQuestion,
  Languages,
  Edit,
  Check,
  X,
} from "lucide-react";
import { TranscriptListPanel } from "./transcript-list-panel";
import { TranscriptContentArea } from "./transcript-content-area";
import { cn } from "@/lib/utils";

// Types
export interface TranscriptSession {
  id: string;
  name: string;
  datetime: string;
  timezone: string;
}

export interface TranscriptData {
  id: string;
  name: string;
  date: string;
  time: string;
  duration: string;
  languages: string[];
  hasSummary: boolean;
}

export interface TranscriptContent {
  id: string;
  language: string;
  content: string[];
  type: "original" | "translation" | "summary";
}

export interface Language {
  code: string;
  name: string;
}

interface TranscriptWorkspaceProps {
  transcripts: TranscriptData[];
  availableLanguages: Language[];
  initialTranscriptContent?: TranscriptContent[];
  initialSession?: TranscriptSession;
}

export function TranscriptWorkspace({
  transcripts,
  availableLanguages,
  initialTranscriptContent = [],
  initialSession,
}: TranscriptWorkspaceProps) {
  // State
  const [selectedTranscriptId, setSelectedTranscriptId] = useState<
    string | null
  >(transcripts[0]?.id || null);
  const [selectedTranscripts, setSelectedTranscripts] = useState<string[]>([]);
  const [transcriptContent, setTranscriptContent] = useState(
    initialTranscriptContent
  );
  const [session, setSession] = useState(initialSession);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("original");

  // Handlers
  const handleSelectTranscript = (id: string) => {
    setSelectedTranscriptId(id);
    // In a real app, we would fetch the transcript content and session data
    // For this prototype, we'll just use the initial data
  };

  const handleToggleSelectTranscript = (id: string) => {
    setSelectedTranscripts((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleToggleEditMode = () => {
    if (editMode) {
      // In a real app, we would save changes here
      setEditMode(false);
    } else {
      setEditMode(true);
    }
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
  };

  const handleTranslate = (language: string) => {
    // In a real app, we would call an API to translate the transcript
    console.log(`Translating to ${language}`);
  };

  const handleGenerateSummary = (language: string) => {
    // In a real app, we would call an API to generate a summary
    console.log(`Generating summary in ${language}`);
  };

  const handleDownload = (options: {
    languages: string[];
    types: string[];
  }) => {
    // In a real app, we would generate and download the files
    console.log(
      `Downloading ${options.types.join(", ")} in ${options.languages.join(
        ", "
      )}`
    );
  };

  const handleDelete = () => {
    // In a real app, we would call an API to delete the transcript
    console.log(`Deleting transcript ${selectedTranscriptId}`);
  };

  const handleBulkAction = (
    action: "translate" | "summarize" | "download" | "delete"
  ) => {
    // In a real app, we would handle bulk actions
    console.log(
      `Performing ${action} on ${selectedTranscripts.length} transcripts`
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
        {/* Left Panel (List) - Hidden in fullscreen mode */}
        <div
          className={cn(
            "lg:col-span-1 h-full overflow-hidden",
            isFullscreen && "hidden"
          )}
        >
          <TranscriptListPanel
            transcripts={transcripts}
            selectedTranscriptId={selectedTranscriptId}
            selectedTranscripts={selectedTranscripts}
            onSelectTranscript={handleSelectTranscript}
            onToggleSelectTranscript={handleToggleSelectTranscript}
            onBulkAction={handleBulkAction}
          />
        </div>

        {/* Main Content Area (Right Panel) */}
        <div
          className={cn(
            "lg:col-span-2 h-full overflow-hidden",
            isFullscreen && "lg:col-span-3"
          )}
        >
          <div className="flex flex-col h-full bg-white rounded-lg border shadow-sm">
            {/* Context Header */}
            {session && (
              <div className="flex items-center justify-between border-b p-4">
                <div>
                  <h2 className="text-xl font-semibold">
                    {session.name}
                    <span className="text-gray-500 text-sm font-normal ml-2">
                      {session.datetime} {session.timezone}
                    </span>
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleToggleFullscreen}
                    title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                  >
                    {isFullscreen ? (
                      <Minimize2 className="h-4 w-4" />
                    ) : (
                      <Maximize2 className="h-4 w-4" />
                    )}
                  </Button>

                  <Button
                    variant={editMode ? "default" : "outline"}
                    size="sm"
                    onClick={handleToggleEditMode}
                  >
                    {editMode ? (
                      <>
                        <Check className="h-3.5 w-3.5 mr-1.5" />
                        Save Edits
                      </>
                    ) : (
                      <>
                        <Edit className="h-3.5 w-3.5 mr-1.5" />
                        Edit
                      </>
                    )}
                  </Button>

                  {editMode && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditMode(false)}
                    >
                      <X className="h-3.5 w-3.5 mr-1.5" />
                      Cancel
                    </Button>
                  )}

                  <Button variant="outline" size="sm" onClick={handleDelete}>
                    <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                    Delete
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleDownload({
                        languages: [selectedLanguage],
                        types: ["transcript", "summary"],
                      })
                    }
                  >
                    <Download className="h-3.5 w-3.5 mr-1.5" />
                    Download
                  </Button>
                </div>
              </div>
            )}

            {/* Content Area */}
            <div className="flex-1 overflow-auto">
              {session && transcriptContent.length > 0 && (
                <TranscriptContentArea
                  transcriptContent={transcriptContent}
                  availableLanguages={availableLanguages}
                  selectedLanguage={selectedLanguage}
                  onLanguageChange={handleLanguageChange}
                  onTranslate={handleTranslate}
                  onGenerateSummary={handleGenerateSummary}
                  editMode={editMode}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
