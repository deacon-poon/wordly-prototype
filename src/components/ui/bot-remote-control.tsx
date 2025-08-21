"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Settings,
  Minimize2,
  Maximize2,
  X,
  Move,
  Users,
  Globe,
  Languages,
  Trash2,
  Presentation,
  Radio,
  Bot,
  Play,
  Pause,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

interface BotRemoteControlProps {
  sessionId: string;
  sessionName?: string;
  sessionType?: "bot" | "present-app" | "rtmps" | "mixed";
  isActive: boolean;
  onEndSession: () => void;
  onClose: () => void;
  onListenToAudio?: () => void;
  onLanguageChange?: (language: string) => void;
  inputs?: SessionInput[];
  initialPosition?: { x: number; y: number };
}

interface ActiveLanguage {
  code: string;
  name: string;
  selected: boolean;
}

export function BotRemoteControl({
  sessionId,
  sessionName = "Live Session",
  sessionType = "bot",
  isActive,
  onEndSession,
  onClose,
  onListenToAudio,
  onLanguageChange,
  inputs = [],
  initialPosition = { x: 20, y: 20 },
}: BotRemoteControlProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState(() => {
    // Safe initial position calculation
    if (typeof window !== "undefined") {
      return {
        x: Math.max(20, window.innerWidth - 420),
        y: 20,
      };
    }
    return initialPosition;
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isMuted, setIsMuted] = useState(false);
  const [autoLanguageSelect, setAutoLanguageSelect] = useState(true);

  const controlRef = useRef<HTMLDivElement>(null);

  // Mock language data based on the screenshot
  const [activeLanguages, setActiveLanguages] = useState<ActiveLanguage[]>([
    { code: "en-US", name: "English (US)", selected: true },
    { code: "ar", name: "Arabic", selected: true },
    { code: "zh-CN", name: "Chinese (Simplified)", selected: true },
    { code: "fr", name: "French (FR)", selected: true },
    { code: "de", name: "German", selected: true },
    { code: "ja", name: "Japanese", selected: true },
    { code: "ko", name: "Korean", selected: true },
    { code: "es", name: "Spanish (ES)", selected: true },
  ]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!controlRef.current) return;

    const rect = controlRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;

      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const toggleLanguage = (code: string) => {
    setActiveLanguages((langs) =>
      langs.map((lang) =>
        lang.code === code ? { ...lang, selected: !lang.selected } : lang
      )
    );
  };

  const removeLanguage = (code: string) => {
    setActiveLanguages((langs) => langs.filter((lang) => lang.code !== code));
  };

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

  const getSessionTypeIcon = () => {
    switch (sessionType) {
      case "present-app":
        return <Presentation className="w-4 h-4" />;
      case "rtmps":
        return <Radio className="w-4 h-4" />;
      case "bot":
        return <Bot className="w-4 h-4" />;
      case "mixed":
        return <Settings className="w-4 h-4" />;
      default:
        return <Bot className="w-4 h-4" />;
    }
  };

  if (!isActive) return null;

  // Minimized state - compact control bar
  if (isMinimized) {
    return (
      <div
        ref={controlRef}
        className="fixed z-50 bg-white border border-gray-200 rounded-xl shadow-lg transition-all duration-300 ease-in-out"
        style={{ left: position.x, top: position.y }}
      >
        <div className="flex items-center gap-3 px-4 py-3">
          {/* Drag handle */}
          <div
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded-lg transition-colors"
            onMouseDown={handleMouseDown}
          >
            <Move className="w-4 h-4 text-gray-600" />
          </div>

          {/* Session indicator */}
          <div className="flex items-center gap-2">
            {getSessionTypeIcon()}
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-gray-700">
              {sessionName}
            </span>
          </div>

          {/* Key controls */}
          {onListenToAudio && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onListenToAudio}
              className="h-8 w-8 p-0 hover:bg-gray-100 rounded-lg"
              title="Listen to audio"
            >
              <Volume2 className="w-4 h-4 text-gray-600" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMuted(!isMuted)}
            className="h-8 w-8 p-0 hover:bg-gray-100 rounded-lg"
          >
            {isMuted ? (
              <MicOff className="w-4 h-4 text-red-600" />
            ) : (
              <Mic className="w-4 h-4 text-gray-600" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onEndSession}
            className="h-8 w-8 p-0 hover:bg-red-50 text-red-600 rounded-lg"
          >
            <X className="w-4 h-4" />
          </Button>

          {/* Expand button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(false)}
            className="h-8 w-8 p-0 hover:bg-gray-100 rounded-lg"
          >
            <Maximize2 className="w-4 h-4 text-gray-600" />
          </Button>
        </div>
      </div>
    );
  }

  // Expanded state - full control panel
  return (
    <div
      ref={controlRef}
      className={cn(
        "fixed z-50 w-96 bg-white border border-gray-200",
        "shadow-xl rounded-xl transition-all duration-300 ease-in-out",
        isDragging ? "cursor-grabbing" : "cursor-auto"
      )}
      style={{
        left: Math.max(20, position.x),
        top: Math.max(20, position.y),
      }}
    >
      <Card className="border-none bg-transparent shadow-none">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded-lg transition-colors"
                onMouseDown={handleMouseDown}
              >
                <Move className="w-4 h-4 text-gray-600" />
              </div>
              <CardTitle className="text-gray-800 text-lg font-semibold flex items-center gap-2">
                {getSessionTypeIcon()}
                Remote Session Control
              </CardTitle>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(true)}
                className="h-8 w-8 p-0 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Minimize2 className="w-4 h-4 text-gray-600" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              {sessionId}
            </Badge>
            <Badge variant="outline" className="text-xs text-gray-600">
              {sessionName}
            </Badge>
            {sessionType !== "bot" && (
              <Badge
                variant="outline"
                className="text-xs text-blue-600 bg-blue-50"
              >
                {sessionType.toUpperCase()}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Session Controls */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <Button
              variant="destructive"
              size="sm"
              onClick={onEndSession}
              className="flex items-center gap-2"
            >
              End Session
            </Button>

            <div className="flex items-center gap-2">
              {onListenToAudio && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onListenToAudio}
                  className="flex items-center gap-2"
                >
                  <Volume2 className="w-4 h-4" />
                  Listen
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMuted(!isMuted)}
                className={cn(
                  "flex items-center gap-2",
                  isMuted && "bg-red-50 border-red-200 text-red-700"
                )}
              >
                {isMuted ? (
                  <MicOff className="w-4 h-4" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
                {isMuted ? "Unmute" : "Mute"}
              </Button>
            </div>
          </div>

          {/* Language Controls */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-800 flex items-center gap-2">
                <Languages className="w-4 h-4 text-gray-600" />
                Active Meeting Bot
              </h4>
              <div className="text-sm text-gray-500">Joining</div>
            </div>

            {/* Primary Language */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-800">
                  Wordly on Google Meet
                </span>
              </div>
              <select className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-800 focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition-all duration-200">
                <option>English (US)</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>

            {/* Language Selection */}
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {activeLanguages.map((lang) => (
                  <div
                    key={lang.code}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1 rounded-full text-xs border transition-all duration-200",
                      lang.selected
                        ? "bg-primary-teal-100 border-primary-teal-300 text-primary-teal-700"
                        : "bg-gray-100 border-gray-300 text-gray-600"
                    )}
                  >
                    <span>{lang.name}</span>
                    <button
                      onClick={() => removeLanguage(lang.code)}
                      className="hover:text-red-600 transition-colors duration-200"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Auto Language Selection */}
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-xl bg-gray-50">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-800">
                  Enable automatic language selection
                </span>
              </div>
              <Switch
                checked={autoLanguageSelect}
                onCheckedChange={setAutoLanguageSelect}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
