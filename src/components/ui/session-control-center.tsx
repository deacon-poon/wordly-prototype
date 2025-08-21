"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Mic,
  MicOff,
  Play,
  Pause,
  Square,
  Settings,
  Minimize2,
  Maximize2,
  X,
  Move,
  Users,
  Bot,
  Presentation,
  Radio,
  Volume2,
  VolumeX,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BotRemoteControl } from "./bot-remote-control";

interface SessionInput {
  id: string;
  type: "present-app" | "rtmps" | "bot" | "mobile";
  name: string;
  language: string;
  status: "active" | "paused" | "muted" | "disconnected";
  userInfo?: {
    name: string;
    location?: string;
  };
}

interface SessionControlProps {
  sessionId: string;
  sessionName: string;
  inputs: SessionInput[];
  onSessionAction: (action: string, inputId?: string) => void;
  onLanguageChange: (inputId: string, language: string) => void;
  onListenToAudio: (inputId: string) => void;
}

function SessionControl({
  sessionId,
  sessionName,
  inputs,
  onSessionAction,
  onLanguageChange,
  onListenToAudio,
}: SessionControlProps) {
  const [isMinimized, setIsMinimized] = useState(false);

  const getInputIcon = (type: SessionInput["type"]) => {
    switch (type) {
      case "present-app":
        return <Presentation className="w-4 h-4" />;
      case "rtmps":
        return <Radio className="w-4 h-4" />;
      case "bot":
        return <Bot className="w-4 h-4" />;
      case "mobile":
        return <Users className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: SessionInput["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700 border-green-300";
      case "paused":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "muted":
        return "bg-orange-100 text-orange-700 border-orange-300";
      case "disconnected":
        return "bg-red-100 text-red-700 border-red-300";
    }
  };

  if (isMinimized) {
    return (
      <Card className="w-80 bg-white border border-gray-200 shadow-lg">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                {sessionId}
              </Badge>
              <span className="text-sm font-medium text-gray-700">
                {sessionName}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(false)}
              className="h-6 w-6 p-0"
            >
              <Maximize2 className="w-3 h-3" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-1">
            {inputs.map((input) => (
              <Badge
                key={input.id}
                variant="outline"
                className={cn("text-xs", getStatusColor(input.status))}
              >
                {getInputIcon(input.type)}
                <span className="ml-1">{input.type}</span>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-96 bg-white border border-gray-200 shadow-xl">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-800">
              Session Control
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                {sessionId}
              </Badge>
              <span className="text-sm text-gray-600">{sessionName}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(true)}
              className="h-8 w-8 p-0"
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Global Session Controls */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSessionAction("pause")}
              className="flex items-center gap-2"
            >
              <Pause className="w-4 h-4" />
              Pause All
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onSessionAction("end")}
              className="flex items-center gap-2"
            >
              <Square className="w-4 h-4" />
              End Session
            </Button>
          </div>
        </div>

        {/* Individual Input Controls */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-800">Active Inputs</h4>
          {inputs.map((input) => (
            <div
              key={input.id}
              className="p-3 border border-gray-200 rounded-lg bg-gray-50"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getInputIcon(input.type)}
                  <span className="font-medium text-gray-800">
                    {input.name}
                  </span>
                  <Badge
                    variant="outline"
                    className={cn("text-xs", getStatusColor(input.status))}
                  >
                    {input.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  {/* Listen to audio */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onListenToAudio(input.id)}
                    className="h-7 w-7 p-0"
                    title="Listen to audio"
                  >
                    <Volume2 className="w-3 h-3" />
                  </Button>

                  {/* Mute/Unmute */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      onSessionAction(
                        input.status === "muted" ? "unmute" : "mute",
                        input.id
                      )
                    }
                    className="h-7 w-7 p-0"
                  >
                    {input.status === "muted" ? (
                      <MicOff className="w-3 h-3 text-red-600" />
                    ) : (
                      <Mic className="w-3 h-3" />
                    )}
                  </Button>

                  {/* Pause/Resume */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      onSessionAction(
                        input.status === "paused" ? "resume" : "pause",
                        input.id
                      )
                    }
                    className="h-7 w-7 p-0"
                  >
                    {input.status === "paused" ? (
                      <Play className="w-3 h-3" />
                    ) : (
                      <Pause className="w-3 h-3" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Language Control */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Language:</span>
                <select
                  value={input.language}
                  onChange={(e) => onLanguageChange(input.id, e.target.value)}
                  className="text-sm border border-gray-300 rounded px-2 py-1"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="ko">Korean</option>
                  <option value="fr">French</option>
                </select>
              </div>

              {/* User info if available */}
              {input.userInfo && (
                <div className="mt-2 text-xs text-gray-500">
                  User: {input.userInfo.name}
                  {input.userInfo.location && ` (${input.userInfo.location})`}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function SessionControlCenter() {
  const [sessions] = useState([
    {
      sessionId: "SSOD-5071",
      sessionName: "Town Hall Public Comment",
      inputs: [
        {
          id: "present-1",
          type: "present-app" as const,
          name: "Podium Microphone",
          language: "en",
          status: "active" as const,
          userInfo: { name: "Town Hall Presenter", location: "Main Podium" },
        },
        {
          id: "bot-1",
          type: "bot" as const,
          name: "Teams Bot",
          language: "en",
          status: "active" as const,
        },
      ],
    },
    {
      sessionId: "SSOD-5072",
      sessionName: "Conference Room A",
      inputs: [
        {
          id: "rtmps-1",
          type: "rtmps" as const,
          name: "RTMPS Stream",
          language: "es",
          status: "active" as const,
        },
      ],
    },
  ]);

  const handleSessionAction = (action: string, inputId?: string) => {
    console.log(
      `Action: ${action}`,
      inputId ? `for input: ${inputId}` : "for session"
    );
    // Implementation would go here
  };

  const handleLanguageChange = (inputId: string, language: string) => {
    console.log(`Language changed to ${language} for input ${inputId}`);
    // Implementation would go here
  };

  const handleListenToAudio = (inputId: string) => {
    console.log(`Listening to audio for input ${inputId}`);
    // Implementation would go here
  };

  return (
    <div className="space-y-4">
      {sessions.map((session) => (
        <SessionControl
          key={session.sessionId}
          sessionId={session.sessionId}
          sessionName={session.sessionName}
          inputs={session.inputs}
          onSessionAction={handleSessionAction}
          onLanguageChange={handleLanguageChange}
          onListenToAudio={handleListenToAudio}
        />
      ))}
    </div>
  );
}
