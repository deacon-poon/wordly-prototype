"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Save,
  MoreHorizontal,
  Edit3,
  Languages,
  FileText,
  Download,
  Share2,
  Trash2,
  Play,
  Pause,
  Volume2,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
  User,
  Settings,
  BookOpen,
  Zap,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface TranscriptSegment {
  id: string;
  startTime: number;
  endTime: number;
  speakerId: string;
  speakerName: string;
  originalText: string;
  translatedText?: string;
  confidence: number;
  isEdited: boolean;
  glossaryTermsUsed: string[];
}

interface Speaker {
  id: string;
  name: string;
  language: string;
  avatar?: string;
}

interface GlossaryTerm {
  id: string;
  source: string;
  target: string;
  definition?: string;
  confidence: number;
  category: "boost" | "block" | "replace";
  usageCount: number;
}

interface SessionInfo {
  id: string;
  title: string;
  date: string;
  duration: string;
  status: "live" | "completed" | "processing";
  participants: number;
  selectedGlossary?: {
    id: string;
    name: string;
    description: string;
  };
}

interface EnhancedTranscriptEditorProps {
  sessionInfo: SessionInfo;
  segments: TranscriptSegment[];
  speakers: Speaker[];
  availableLanguages: { code: string; name: string }[];
  availableGlossaries: { id: string; name: string; description: string }[];
  onSave: (segments: TranscriptSegment[]) => void;
  onGenerateTranslation: (targetLanguage: string, useGlossary: boolean) => void;
  onGenerateSummary: (language: string) => void;
  onUpdateGlossary: (glossaryId: string) => void;
  onNavigateToSession: () => void;
  onNavigateToGlossary: (glossaryId: string) => void;
  onClose?: () => void;
}

export function EnhancedTranscriptEditor({
  sessionInfo,
  segments: initialSegments,
  speakers,
  availableLanguages,
  availableGlossaries,
  onSave,
  onGenerateTranslation,
  onGenerateSummary,
  onUpdateGlossary,
  onNavigateToSession,
  onNavigateToGlossary,
  onClose,
}: EnhancedTranscriptEditorProps) {
  // State management
  const [segments, setSegments] =
    useState<TranscriptSegment[]>(initialSegments);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("original");
  const [editingSegmentId, setEditingSegmentId] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showGlossaryDialog, setShowGlossaryDialog] = useState(false);
  const [selectedGlossary, setSelectedGlossary] = useState<string>(
    sessionInfo.selectedGlossary?.id || ""
  );
  const [autoSave, setAutoSave] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showTimestamps, setShowTimestamps] = useState(true);
  const [highlightCurrent, setHighlightCurrent] = useState(true);
  const [highlightGlossaryTerms, setHighlightGlossaryTerms] = useState(true);
  const [showAddTermDialog, setShowAddTermDialog] = useState(false);
  const [newTerm, setNewTerm] = useState({
    source: "",
    target: "",
    definition: "",
  });
  const [selectedTextForGlossary, setSelectedTextForGlossary] = useState("");

  // Mock glossary terms for the selected glossary
  const [glossaryTerms, setGlossaryTerms] = useState<GlossaryTerm[]>([
    {
      id: "term-1",
      source: "naughty boy",
      target: "chico travieso",
      definition: "A mischievous or playful young male",
      confidence: 0.95,
      category: "boost",
      usageCount: 3,
    },
    {
      id: "term-2",
      source: "messenger",
      target: "mensajero",
      definition: "A person who carries or delivers messages",
      confidence: 0.92,
      category: "boost",
      usageCount: 1,
    },
    {
      id: "term-3",
      source: "technical terms",
      target: "términos técnicos",
      definition: "Specialized vocabulary related to technology",
      confidence: 0.88,
      category: "boost",
      usageCount: 0,
    },
  ]);

  // Auto-save effect
  useEffect(() => {
    if (autoSave && hasUnsavedChanges) {
      const timer = setTimeout(() => {
        handleSave();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [segments, autoSave, hasUnsavedChanges]);

  // Handlers
  const handleSegmentEdit = (segmentId: string, newText: string) => {
    setSegments((prev) =>
      prev.map((segment) =>
        segment.id === segmentId
          ? { ...segment, originalText: newText, isEdited: true }
          : segment
      )
    );
    setHasUnsavedChanges(true);
  };

  const handleStartEdit = (segment: TranscriptSegment) => {
    setEditingSegmentId(segment.id);
    setEditText(segment.originalText);
  };

  const handleSaveEdit = () => {
    if (editingSegmentId) {
      handleSegmentEdit(editingSegmentId, editText);
      setEditingSegmentId(null);
      setEditText("");
    }
  };

  const handleCancelEdit = () => {
    setEditingSegmentId(null);
    setEditText("");
  };

  const handleSave = () => {
    onSave(segments);
    setHasUnsavedChanges(false);
  };

  const handleGenerateTranslation = (language: string) => {
    onGenerateTranslation(language, !!selectedGlossary);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getLanguageName = (code: string) => {
    if (code === "original") return "Original";
    return availableLanguages.find((lang) => lang.code === code)?.name || code;
  };

  const getCurrentSegment = () => {
    return segments.find(
      (segment) =>
        currentTime >= segment.startTime && currentTime <= segment.endTime
    );
  };

  // Function to highlight glossary terms in text
  const highlightGlossaryTermsInText = (text: string) => {
    if (!highlightGlossaryTerms || !sessionInfo.selectedGlossary) {
      return <span>{text}</span>;
    }

    let highlightedText = text;
    const parts: JSX.Element[] = [];
    let lastIndex = 0;

    // Sort terms by length (longest first) to avoid partial matches
    const sortedTerms = [...glossaryTerms].sort(
      (a, b) => b.source.length - a.source.length
    );

    for (const term of sortedTerms) {
      const regex = new RegExp(`\\b${term.source}\\b`, "gi");
      const matches = [...text.matchAll(regex)];

      for (const match of matches) {
        if (match.index !== undefined) {
          // Add text before the match
          if (match.index > lastIndex) {
            parts.push(
              <span key={`text-${lastIndex}`}>
                {text.slice(lastIndex, match.index)}
              </span>
            );
          }

          // Add highlighted term
          parts.push(
            <span
              key={`term-${match.index}`}
              className="bg-blue-100 border-b-2 border-blue-300 cursor-help font-medium"
              title={`${term.target} - ${term.definition || "No definition"}`}
            >
              {match[0]}
            </span>
          );

          lastIndex = match.index + match[0].length;
        }
      }
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(
        <span key={`text-${lastIndex}`}>{text.slice(lastIndex)}</span>
      );
    }

    return parts.length > 0 ? <>{parts}</> : <span>{text}</span>;
  };

  // Handler for adding new glossary term
  const handleAddTerm = () => {
    if (newTerm.source && newTerm.target) {
      const term: GlossaryTerm = {
        id: `term-${Date.now()}`,
        source: newTerm.source,
        target: newTerm.target,
        definition: newTerm.definition,
        confidence: 1.0,
        category: "boost",
        usageCount: 0,
      };

      setGlossaryTerms((prev) => [...prev, term]);
      setNewTerm({ source: "", target: "", definition: "" });
      setShowAddTermDialog(false);
      setHasUnsavedChanges(true);
    }
  };

  // Handler for text selection
  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      setSelectedTextForGlossary(selection.toString().trim());
      setNewTerm((prev) => ({ ...prev, source: selection.toString().trim() }));
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b bg-white p-4 space-y-4">
        {/* Navigation and Session Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose || onNavigateToSession}
              className="text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              {onClose ? "Back to Transcript" : "Back to Session"}
            </Button>
            <div className="h-6 w-px bg-gray-300" />
            <div>
              <h1 className="text-lg font-semibold">{sessionInfo.title}</h1>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="h-3 w-3" />
                <span>{sessionInfo.date}</span>
                <span>•</span>
                <span>{sessionInfo.duration}</span>
                <span>•</span>
                <User className="h-3 w-3" />
                <span>{sessionInfo.participants} participants</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant={sessionInfo.status === "live" ? "default" : "secondary"}
            >
              {sessionInfo.status === "live" && (
                <div className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse" />
              )}
              {sessionInfo.status.toUpperCase()}
            </Badge>

            {hasUnsavedChanges && (
              <Badge
                variant="outline"
                className="text-amber-600 border-amber-600"
              >
                <AlertCircle className="h-3 w-3 mr-1" />
                Unsaved Changes
              </Badge>
            )}

            <Button variant="outline" size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem>
                  <Download className="h-4 w-4 mr-2" />
                  Export Transcript
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Language and Glossary Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium">Language:</Label>
              <Select
                value={selectedLanguage}
                onValueChange={setSelectedLanguage}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
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

            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium">Glossary:</Label>
              {sessionInfo.selectedGlossary ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    onNavigateToGlossary(sessionInfo.selectedGlossary!.id)
                  }
                  className="h-8"
                >
                  <BookOpen className="h-3 w-3 mr-1" />
                  {sessionInfo.selectedGlossary.name}
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              ) : (
                <Dialog
                  open={showGlossaryDialog}
                  onOpenChange={setShowGlossaryDialog}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8">
                      <BookOpen className="h-3 w-3 mr-1" />
                      Select Glossary
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Select Glossary</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Select
                        value={selectedGlossary}
                        onValueChange={setSelectedGlossary}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a glossary" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableGlossaries.map((glossary) => (
                            <SelectItem key={glossary.id} value={glossary.id}>
                              <div>
                                <div className="font-medium">
                                  {glossary.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {glossary.description}
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setShowGlossaryDialog(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={() => {
                            if (selectedGlossary) {
                              onUpdateGlossary(selectedGlossary);
                              setShowGlossaryDialog(false);
                            }
                          }}
                        >
                          Apply Glossary
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label className="text-sm">Auto-save</Label>
              <Switch checked={autoSave} onCheckedChange={setAutoSave} />
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleGenerateTranslation(selectedLanguage)}
              disabled={selectedLanguage === "original"}
            >
              <Languages className="h-4 w-4 mr-1" />
              Generate Translation
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onGenerateSummary(selectedLanguage)}
            >
              <FileText className="h-4 w-4 mr-1" />
              Generate Summary
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Transcript Editor */}
        <div className="flex-1 flex flex-col">
          {/* Audio Controls */}
          <div className="border-b bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>

                <div className="text-sm font-mono">
                  {formatTime(currentTime)} / {sessionInfo.duration}
                </div>

                <Button variant="ghost" size="sm">
                  <Volume2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="text-sm text-gray-500">
                {getCurrentSegment() && (
                  <span>Speaking: {getCurrentSegment()?.speakerName}</span>
                )}
              </div>
            </div>
          </div>

          {/* Transcript Segments */}
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {segments.map((segment) => (
              <Card
                key={segment.id}
                className={cn(
                  "transition-all duration-200",
                  currentTime >= segment.startTime &&
                    currentTime <= segment.endTime
                    ? "border-blue-500 bg-blue-50/50"
                    : "",
                  segment.isEdited ? "border-amber-500/50" : ""
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Speaker Info */}
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium">
                          {segment.speakerName.charAt(0)}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-700">
                            {segment.speakerName}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatTime(segment.startTime)}
                          </span>
                          {segment.confidence < 0.8 && (
                            <Badge variant="outline" className="text-xs">
                              Low Confidence
                            </Badge>
                          )}
                          {segment.glossaryTermsUsed.length > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              <Zap className="h-3 w-3 mr-1" />
                              Glossary Applied
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          {editingSegmentId === segment.id ? (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleSaveEdit}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleCancelEdit}
                              >
                                <AlertCircle className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleStartEdit(segment)}
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Text Content */}
                      <div onMouseUp={handleTextSelection}>
                        {editingSegmentId === segment.id ? (
                          <Textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="min-h-[80px]"
                            autoFocus
                          />
                        ) : (
                          <div className="text-sm leading-relaxed">
                            {selectedLanguage === "original"
                              ? highlightGlossaryTermsInText(
                                  segment.originalText
                                )
                              : highlightGlossaryTermsInText(
                                  segment.translatedText || segment.originalText
                                )}
                          </div>
                        )}
                      </div>

                      {/* Glossary Terms Used */}
                      {segment.glossaryTermsUsed.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-2">
                          <span className="text-xs text-gray-500">
                            Glossary terms:
                          </span>
                          {segment.glossaryTermsUsed.map((term, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {term}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Sidebar - Additional Tools */}
        <div className="w-80 border-l bg-gray-50/50 p-4 overflow-auto">
          <Tabs defaultValue="speakers" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="speakers" className="text-xs">
                Speakers
              </TabsTrigger>
              <TabsTrigger value="glossary" className="text-xs">
                Glossary
              </TabsTrigger>
              <TabsTrigger value="settings" className="text-xs">
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="speakers" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Speakers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {speakers.map((speaker) => (
                    <div key={speaker.id} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium">
                          {speaker.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">
                          {speaker.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {speaker.language}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="glossary" className="mt-4">
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">Glossary Terms</CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAddTermDialog(true)}
                        className="h-7 text-xs"
                      >
                        + Add Term
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {sessionInfo.selectedGlossary ? (
                      <>
                        <div className="text-xs text-gray-500 mb-3">
                          Active: {sessionInfo.selectedGlossary.name}
                        </div>

                        <div className="max-h-60 overflow-auto space-y-2">
                          {glossaryTerms.map((term) => (
                            <div
                              key={term.id}
                              className="p-2 border rounded-md bg-white"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="text-sm font-medium text-blue-600">
                                    {term.source}
                                  </div>
                                  <div className="text-sm text-gray-700">
                                    → {term.target}
                                  </div>
                                  {term.definition && (
                                    <div className="text-xs text-gray-500 mt-1">
                                      {term.definition}
                                    </div>
                                  )}
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {term.category}
                                    </Badge>
                                    <span className="text-xs text-gray-400">
                                      Used: {term.usageCount}x
                                    </span>
                                  </div>
                                </div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0"
                                    >
                                      <MoreHorizontal className="h-3 w-3" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem className="text-xs">
                                      <Edit3 className="h-3 w-3 mr-1" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-xs text-red-600">
                                      <Trash2 className="h-3 w-3 mr-1" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          ))}
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() =>
                            onNavigateToGlossary(
                              sessionInfo.selectedGlossary!.id
                            )
                          }
                        >
                          <BookOpen className="h-4 w-4 mr-1" />
                          Edit Full Glossary
                        </Button>
                      </>
                    ) : (
                      <p className="text-xs text-gray-500">
                        No glossary selected. Choose one to improve translation
                        accuracy.
                      </p>
                    )}
                  </CardContent>
                </Card>

                {selectedTextForGlossary && (
                  <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="p-3">
                      <div className="text-xs font-medium text-blue-700 mb-2">
                        Selected Text: "{selectedTextForGlossary}"
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          setNewTerm((prev) => ({
                            ...prev,
                            source: selectedTextForGlossary,
                          }));
                          setShowAddTermDialog(true);
                        }}
                      >
                        Add to Glossary
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="settings" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Editor Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Auto-save</Label>
                    <Switch checked={autoSave} onCheckedChange={setAutoSave} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Show timestamps</Label>
                    <Switch
                      checked={showTimestamps}
                      onCheckedChange={setShowTimestamps}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Highlight current</Label>
                    <Switch
                      checked={highlightCurrent}
                      onCheckedChange={setHighlightCurrent}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Highlight glossary terms</Label>
                    <Switch
                      checked={highlightGlossaryTerms}
                      onCheckedChange={setHighlightGlossaryTerms}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Add Term Dialog */}
      <Dialog open={showAddTermDialog} onOpenChange={setShowAddTermDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Glossary Term</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Source Term</Label>
              <Input
                value={newTerm.source}
                onChange={(e) =>
                  setNewTerm((prev) => ({ ...prev, source: e.target.value }))
                }
                placeholder="Enter the original term"
              />
            </div>
            <div>
              <Label className="text-sm font-medium">Target Translation</Label>
              <Input
                value={newTerm.target}
                onChange={(e) =>
                  setNewTerm((prev) => ({ ...prev, target: e.target.value }))
                }
                placeholder="Enter the translation"
              />
            </div>
            <div>
              <Label className="text-sm font-medium">
                Definition (Optional)
              </Label>
              <Textarea
                value={newTerm.definition}
                onChange={(e) =>
                  setNewTerm((prev) => ({
                    ...prev,
                    definition: e.target.value,
                  }))
                }
                placeholder="Enter a definition or context"
                className="min-h-[60px]"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddTermDialog(false);
                  setNewTerm({ source: "", target: "", definition: "" });
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleAddTerm}>Add Term</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
