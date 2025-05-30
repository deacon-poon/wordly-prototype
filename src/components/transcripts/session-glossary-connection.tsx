"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowRight,
  BookOpen,
  FileText,
  Users,
  Settings,
  PlayCircle,
  StopCircle,
  CheckCircle,
  Clock,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Session {
  id: string;
  title: string;
  status: "scheduled" | "live" | "completed";
  participants: number;
  startTime: string;
  glossaryId?: string;
}

interface Glossary {
  id: string;
  name: string;
  description: string;
  status: "available" | "pending";
  termCount: number;
  languages: string[];
}

interface Transcript {
  id: string;
  sessionId: string;
  language: string;
  status: "processing" | "ready" | "translated";
  hasAudio: boolean;
  hasSummary: boolean;
}

interface SessionGlossaryConnectionProps {
  session: Session;
  availableGlossaries: Glossary[];
  transcripts: Transcript[];
  onSessionUpdate: (sessionId: string, updates: Partial<Session>) => void;
  onCreateSession: () => void;
  onRunSession: (sessionId: string) => void;
  onUpdateGlossary: (glossaryId: string) => void;
  onNavigateToTranscript: (transcriptId: string) => void;
  onNavigateToGlossary: (glossaryId: string) => void;
}

export function SessionGlossaryConnection({
  session,
  availableGlossaries,
  transcripts,
  onSessionUpdate,
  onCreateSession,
  onRunSession,
  onUpdateGlossary,
  onNavigateToTranscript,
  onNavigateToGlossary,
}: SessionGlossaryConnectionProps) {
  const [showGlossaryDialog, setShowGlossaryDialog] = useState(false);
  const [selectedGlossaryId, setSelectedGlossaryId] = useState<string>(
    session.glossaryId || ""
  );

  const selectedGlossary = availableGlossaries.find(
    (g) => g.id === session.glossaryId
  );

  const sessionTranscripts = transcripts.filter(
    (t) => t.sessionId === session.id
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Clock className="h-4 w-4" />;
      case "live":
        return <PlayCircle className="h-4 w-4 text-red-500" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "live":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleUpdateSessionGlossary = () => {
    if (selectedGlossaryId) {
      onSessionUpdate(session.id, { glossaryId: selectedGlossaryId });
      setShowGlossaryDialog(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Workflow Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Session Workflow</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onCreateSession}>
            Create New Session
          </Button>
        </div>
      </div>

      {/* Workflow Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Step 1: Session */}
        <Card className="relative">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                {getStatusIcon(session.status)}
                Session
              </CardTitle>
              <Badge className={getStatusColor(session.status)}>
                {session.status.toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h3 className="font-medium text-sm">{session.title}</h3>
              <p className="text-xs text-gray-500">{session.startTime}</p>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Users className="h-3 w-3" />
              <span>{session.participants} participants</span>
            </div>

            {session.status === "scheduled" && (
              <Button
                size="sm"
                className="w-full"
                onClick={() => onRunSession(session.id)}
              >
                <PlayCircle className="h-4 w-4 mr-1" />
                Run Session
              </Button>
            )}

            {session.status === "live" && (
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-red-600 font-medium">Live Session</span>
              </div>
            )}
          </CardContent>

          {/* Connection Arrow */}
          <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-white border rounded-full p-1 hidden lg:block">
            <ArrowRight className="h-4 w-4 text-gray-400" />
          </div>
        </Card>

        {/* Step 2: Glossary */}
        <Card className="relative">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Glossary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {selectedGlossary ? (
              <>
                <div>
                  <h3 className="font-medium text-sm">
                    {selectedGlossary.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {selectedGlossary.description}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">
                    {selectedGlossary.termCount} terms
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {selectedGlossary.status}
                  </Badge>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => onNavigateToGlossary(selectedGlossary.id)}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onUpdateGlossary(selectedGlossary.id)}
                  >
                    <RefreshCw className="h-3 w-3" />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-500">No glossary selected</p>
                <Dialog
                  open={showGlossaryDialog}
                  onOpenChange={setShowGlossaryDialog}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full">
                      <BookOpen className="h-4 w-4 mr-1" />
                      Select Glossary
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Choose Glossary</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Select
                        value={selectedGlossaryId}
                        onValueChange={setSelectedGlossaryId}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a glossary..." />
                        </SelectTrigger>
                        <SelectContent>
                          {availableGlossaries.map((glossary) => (
                            <SelectItem key={glossary.id} value={glossary.id}>
                              <div>
                                <div className="font-medium">
                                  {glossary.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {glossary.termCount} terms • {glossary.status}
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
                        <Button onClick={handleUpdateSessionGlossary}>
                          Apply Glossary
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </CardContent>

          {/* Connection Arrow */}
          <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-white border rounded-full p-1 hidden lg:block">
            <ArrowRight className="h-4 w-4 text-gray-400" />
          </div>
        </Card>

        {/* Step 3: Transcripts */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Transcripts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {sessionTranscripts.length > 0 ? (
              <>
                <div className="text-xs text-gray-500">
                  {sessionTranscripts.length} transcript(s) generated
                </div>
                <div className="space-y-2">
                  {sessionTranscripts.map((transcript) => (
                    <div
                      key={transcript.id}
                      className="flex items-center justify-between p-2 border rounded-md text-xs"
                    >
                      <div>
                        <div className="font-medium">{transcript.language}</div>
                        <div className="flex items-center gap-2 text-gray-500">
                          <Badge variant="outline" className="text-xs">
                            {transcript.status}
                          </Badge>
                          {transcript.hasAudio && (
                            <span className="text-xs">Audio</span>
                          )}
                          {transcript.hasSummary && (
                            <span className="text-xs">Summary</span>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onNavigateToTranscript(transcript.id)}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center text-gray-500 py-4">
                <FileText className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No transcripts yet</p>
                <p className="text-xs">
                  Transcripts will appear after running the session
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Additional Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Translation & Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-xs text-gray-500">
              Generated translations and summaries use the selected glossary for
              improved accuracy and consistency.
            </p>
            {selectedGlossary && (
              <div className="flex items-center gap-2 text-xs">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>Glossary integration active</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">
              Presenter & Attendee Flags
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-xs text-gray-500">
              Session roles determine translation priorities and glossary
              application settings.
            </p>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-xs">
                Presenter Mode
              </Badge>
              <Badge variant="outline" className="text-xs">
                Auto Translation
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
