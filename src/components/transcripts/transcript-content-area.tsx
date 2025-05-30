import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Languages, Download, FileText, Copy, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

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

interface TranscriptContentAreaProps {
  transcriptContent: TranscriptContent[];
  availableLanguages: Language[];
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
  onTranslate: (language: string) => void;
  onGenerateSummary: (language: string) => void;
  editMode?: boolean;
}

export function TranscriptContentArea({
  transcriptContent,
  availableLanguages,
  selectedLanguage,
  onLanguageChange,
  onTranslate,
  onGenerateSummary,
  editMode = false,
}: TranscriptContentAreaProps) {
  const [editedContent, setEditedContent] = useState<Record<string, string[]>>(
    {}
  );
  const [copied, setCopied] = useState(false);

  // Get the current content for the selected language
  const currentContent = transcriptContent.find(
    (content) => content.language === selectedLanguage
  );

  // Get content text for editing
  const getContentText = () => {
    if (!currentContent) return "";
    const content = editedContent[selectedLanguage] || currentContent.content;
    return content.join("\n\n");
  };

  // Handle content changes in edit mode
  const handleContentChange = (value: string) => {
    const lines = value.split("\n\n").filter((line) => line.trim());
    setEditedContent((prev) => ({
      ...prev,
      [selectedLanguage]: lines,
    }));
  };

  // Handle copy to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getContentText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  // Get content type badge variant
  const getContentTypeBadge = (type: string) => {
    switch (type) {
      case "original":
        return "default";
      case "translation":
        return "secondary";
      case "summary":
        return "outline";
      default:
        return "default";
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header with language selection and actions */}
      <div className="flex items-center justify-between border-b p-4 bg-gray-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Languages className="h-4 w-4 text-gray-500" />
            <Select value={selectedLanguage} onValueChange={onLanguageChange}>
              <SelectTrigger className="w-[200px]">
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
          </div>

          {currentContent && (
            <Badge variant={getContentTypeBadge(currentContent.type)}>
              {currentContent.type === "original"
                ? "Original"
                : currentContent.type === "translation"
                ? "Translation"
                : "Summary"}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="flex items-center gap-1.5"
          >
            {copied ? (
              <CheckCircle className="h-3.5 w-3.5 text-green-600" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
            {copied ? "Copied!" : "Copy"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onTranslate(selectedLanguage)}
            disabled={selectedLanguage === "original"}
          >
            <Languages className="h-3.5 w-3.5 mr-1.5" />
            Translate
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onGenerateSummary(selectedLanguage)}
          >
            <FileText className="h-3.5 w-3.5 mr-1.5" />
            Summarize
          </Button>

          <Button variant="outline" size="sm">
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Export
          </Button>
        </div>
      </div>

      {/* Content display/edit area */}
      <div className="flex-1 overflow-auto p-4">
        {currentContent ? (
          editMode ? (
            <div className="space-y-4">
              <div className="text-sm text-gray-600 mb-2">
                Edit mode: Make changes to the transcript content below
              </div>
              <Textarea
                value={getContentText()}
                onChange={(e) => handleContentChange(e.target.value)}
                className="min-h-[500px] font-mono text-sm"
                placeholder="Enter transcript content..."
              />
            </div>
          ) : (
            <div className="space-y-6">
              {(editedContent[selectedLanguage] || currentContent.content).map(
                (paragraph, index) => (
                  <div
                    key={index}
                    className={cn(
                      "p-4 rounded-lg border-l-4 bg-gray-50",
                      currentContent.type === "original" &&
                        "border-l-primary-teal-500",
                      currentContent.type === "translation" &&
                        "border-l-secondary-navy-500",
                      currentContent.type === "summary" &&
                        "border-l-accent-light-blue-500"
                    )}
                  >
                    <div className="text-sm text-gray-500 mb-2">
                      Paragraph {index + 1}
                    </div>
                    <p className="text-gray-900 leading-relaxed">{paragraph}</p>
                  </div>
                )
              )}
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Languages className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No content available
            </h3>
            <p className="text-gray-500">
              {selectedLanguage === "original"
                ? "No transcript content found for this session."
                : `No ${selectedLanguage} translation available. Click "Translate" to generate content.`}
            </p>
            {selectedLanguage !== "original" && (
              <Button
                className="mt-4"
                onClick={() => onTranslate(selectedLanguage)}
              >
                <Languages className="h-4 w-4 mr-2" />
                Translate to{" "}
                {availableLanguages.find((l) => l.code === selectedLanguage)
                  ?.name || selectedLanguage}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
