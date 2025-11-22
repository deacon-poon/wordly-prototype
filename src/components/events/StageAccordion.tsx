"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronDown, Clock, MapPin, User, Edit2, Play, QrCode } from "lucide-react";

interface Session {
  id: string;
  title: string;
  presenters: string[];
  scheduledDate: string;
  scheduledStart: string;
  endTime: string;
  status: "pending" | "active" | "completed" | "skipped";
}

interface Stage {
  id: string;
  name: string;
  sessionCount: number;
  stageSessionId: string;
  passcode: string;
  sessions: Session[];
}

interface StageAccordionProps {
  stage: Stage;
  defaultExpanded?: boolean;
  onStartStage?: (stage: Stage, e: React.MouseEvent) => void;
  onLinksToJoin?: (stage: Stage, e: React.MouseEvent) => void;
  onEditSession?: (session: Session, stage: Stage, e: React.MouseEvent) => void;
  isPastEvent?: boolean;
  showCredentials?: boolean;
}

// Copy button component
const CopyButton = ({ text, label }: { text: string; label: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1.5 hover:bg-gray-100 rounded transition-colors"
      title={`Copy ${label}`}
    >
      {copied ? (
        <svg
          className="h-3.5 w-3.5 text-accent-green-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      ) : (
        <svg
          className="h-3.5 w-3.5 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      )}
    </button>
  );
};

// Stage Credentials Component
const StageCredentials = ({ stage }: { stage: Stage }) => {
  return (
    <div className="flex items-center gap-6 text-sm">
      <div className="flex items-center gap-2">
        <span className="text-gray-600 font-medium">Session ID:</span>
        <code className="px-2 py-0.5 bg-white border border-gray-200 rounded text-gray-900 font-mono text-xs">
          {stage.stageSessionId}
        </code>
        <CopyButton text={stage.stageSessionId} label="Session ID" />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-gray-600 font-medium">Passcode:</span>
        <code className="px-2 py-0.5 bg-white border border-gray-200 rounded text-gray-900 font-mono text-xs">
          {stage.passcode}
        </code>
        <CopyButton text={stage.passcode} label="Passcode" />
      </div>
    </div>
  );
};

export function StageAccordion({
  stage,
  defaultExpanded = false,
  onStartStage,
  onLinksToJoin,
  onEditSession,
  isPastEvent = false,
  showCredentials = true,
}: StageAccordionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div
      className={`relative transition-all duration-300 ease-in-out border rounded-xl bg-white border-gray-200 hover:border-gray-300 hover:shadow-md ${
        isExpanded ? "ring-2 ring-offset-1 shadow-lg ring-gray-200" : "shadow-sm"
      }`}
    >
      {/* Stage Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 flex items-center gap-6 text-left"
      >
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-5 w-5 text-primary-teal-600 flex-shrink-0" />
                <h4 className="font-semibold text-gray-900 text-lg">
                  {stage.name}
                </h4>
                <span className="text-sm text-gray-500">
                  ({stage.sessions.length} {stage.sessions.length === 1 ? "presentation" : "presentations"})
                </span>
              </div>
              {showCredentials && <StageCredentials stage={stage} />}
            </div>

            {/* Stage actions + Chevron - Right side together */}
            <div className="ml-4 flex items-center gap-2 flex-shrink-0">
              {onLinksToJoin && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLinksToJoin(stage, e);
                  }}
                  className="border-primary-teal-600 text-primary-teal-600 hover:bg-primary-teal-50 hover:border-primary-teal-700"
                >
                  <QrCode className="h-4 w-4 mr-2" />
                  Links to join
                </Button>
              )}
              {onStartStage && (
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isPastEvent) {
                      onStartStage(stage, e);
                    }
                  }}
                  disabled={isPastEvent}
                  className="bg-primary-teal-600 hover:bg-primary-teal-700 text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  title={
                    isPastEvent
                      ? "This event has ended and cannot be started"
                      : "Start Stage"
                  }
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Stage
                </Button>
              )}
              
              {/* Chevron indicator beside buttons */}
              <div className="ml-2 flex items-center justify-center">
                <ChevronDown
                  className={`h-5 w-5 text-primary-teal-600 transition-transform duration-200 ${
                    isExpanded ? "rotate-180" : "rotate-0"
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      </button>

      {/* Presentations - Collapsible - Compact with Prominent Time */}
      {isExpanded && (
        <div className="border-t border-primary-teal-200 divide-y divide-gray-100">
          {stage.sessions.map((session) => (
            <div
              key={session.id}
              className="px-6 py-3 hover:bg-gray-50 transition-colors group flex items-center gap-6"
            >
              {/* Title and Presenters - Left side */}
              <div className="flex-1 min-w-0">
                <h5 className="font-medium text-gray-900 truncate">
                  {session.title}
                </h5>
                <p className="text-xs text-gray-600 truncate mt-1">
                  <User className="h-3 w-3 inline mr-1 text-gray-400" />
                  {session.presenters.join(", ")}
                </p>
              </div>

              {/* Time - Right side for chronology - MORE PROMINENT */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-teal-50 border border-primary-teal-200 rounded-md">
                  <Clock className="h-4 w-4 text-primary-teal-600" />
                  <span className="text-sm font-bold text-primary-teal-700 whitespace-nowrap">
                    {session.scheduledStart} - {session.endTime}
                  </span>
                </div>
                
                {onEditSession && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      if (!isPastEvent) {
                        onEditSession(session, stage, e);
                      }
                    }}
                    disabled={isPastEvent}
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    title={
                      isPastEvent
                        ? "This event has ended and cannot be edited"
                        : "Edit presentation"
                    }
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

