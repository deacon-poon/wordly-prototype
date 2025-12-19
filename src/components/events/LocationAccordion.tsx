"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  Clock,
  MapPin,
  User,
  Users,
  Edit2,
  Play,
  QrCode,
  MoreVertical,
  Pencil,
  Trash2,
  Plus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Session {
  id: string;
  title: string;
  presenters: string[];
  scheduledDate: string;
  scheduledStart: string;
  endTime: string;
  status: "pending" | "active" | "completed" | "skipped";
}

interface Location {
  id: string;
  name: string;
  sessionCount: number;
  locationSessionId: string;
  passcode: string;
  sessions: Session[];
}

interface LocationAccordionProps {
  location: Location;
  defaultExpanded?: boolean;
  onStartLocation?: (location: Location, e: React.MouseEvent) => void;
  onLinksToJoin?: (location: Location, e: React.MouseEvent) => void;
  onEditSession?: (
    session: Session,
    location: Location,
    e: React.MouseEvent
  ) => void;
  onRenameLocation?: (location: Location) => void;
  onDeleteLocation?: (location: Location) => void;
  onAddSession?: (location: Location) => void;
  isPastEvent?: boolean;
  showCredentials?: boolean;
}

// Location Credentials Component
const LocationCredentials = ({ location }: { location: Location }) => {
  return (
    <div className="flex items-center gap-6 text-sm">
      <div className="flex items-center gap-2">
        <span className="text-gray-600 font-medium">Session ID:</span>
        <code className="px-2 py-0.5 bg-white border border-gray-200 rounded text-gray-900 font-mono text-xs">
          {location.locationSessionId}
        </code>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-gray-600 font-medium">Passcode:</span>
        <code className="px-2 py-0.5 bg-white border border-gray-200 rounded text-gray-900 font-mono text-xs">
          {location.passcode}
        </code>
      </div>
    </div>
  );
};

export function LocationAccordion({
  location,
  defaultExpanded = false,
  onStartLocation,
  onLinksToJoin,
  onEditSession,
  onRenameLocation,
  onDeleteLocation,
  onAddSession,
  isPastEvent = false,
  showCredentials = true,
}: LocationAccordionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const hasLocationActions =
    onRenameLocation || onDeleteLocation || onAddSession;

  return (
    <div
      className={`relative transition-all duration-300 ease-in-out border rounded-xl bg-white border-gray-200 hover:border-gray-300 hover:shadow-md ${
        isExpanded
          ? "ring-2 ring-offset-1 shadow-lg ring-gray-200"
          : "shadow-sm"
      }`}
    >
      {/* Location Header */}
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
                  {location.name}
                </h4>
                <span className="text-sm text-gray-500">
                  ({location.sessions.length}{" "}
                  {location.sessions.length === 1
                    ? "presentation"
                    : "presentations"}
                  )
                </span>
              </div>
              {showCredentials && <LocationCredentials location={location} />}
            </div>

            {/* Location actions + Chevron - Right side together */}
            <div className="ml-4 flex items-center gap-2 flex-shrink-0">
              {onLinksToJoin && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLinksToJoin(location, e);
                  }}
                  className="border-primary-teal-600 text-primary-teal-600 hover:bg-primary-teal-50 hover:border-primary-teal-700"
                >
                  <QrCode className="h-4 w-4 mr-2" />
                  Links to join
                </Button>
              )}
              {onStartLocation && (
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isPastEvent) {
                      onStartLocation(location, e);
                    }
                  }}
                  disabled={isPastEvent}
                  className="bg-primary-teal-600 hover:bg-primary-teal-700 text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  title={
                    isPastEvent
                      ? "This event has ended and cannot be started"
                      : "Start Location"
                  }
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Location
                </Button>
              )}

              {/* Location actions dropdown */}
              {hasLocationActions && !isPastEvent && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {onAddSession && (
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddSession(location);
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Session
                      </DropdownMenuItem>
                    )}
                    {onRenameLocation && (
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          onRenameLocation(location);
                        }}
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Rename Location
                      </DropdownMenuItem>
                    )}
                    {onDeleteLocation && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteLocation(location);
                          }}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Location
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
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
          {location.sessions.map((session) => (
            <div
              key={session.id}
              className="px-6 py-3 hover:bg-gray-50 transition-colors group flex items-center gap-6"
            >
              {/* Title and Presenters - Left side - Clickable to edit */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onEditSession && !isPastEvent) {
                    onEditSession(session, location, e);
                  }
                }}
                disabled={isPastEvent || !onEditSession}
                className={`flex-1 min-w-0 text-left ${
                  !isPastEvent && onEditSession
                    ? "hover:text-primary-teal-700 cursor-pointer"
                    : "cursor-default"
                }`}
                title={
                  isPastEvent
                    ? "This event has ended"
                    : onEditSession
                    ? "Click to edit presentation"
                    : undefined
                }
              >
                <h5 className="font-medium text-gray-900 truncate">
                  {session.title}
                </h5>
                <p className="text-xs text-gray-600 truncate mt-1">
                  {session.presenters.length > 1 ? (
                    <Users className="h-3 w-3 inline mr-1 text-gray-400" />
                  ) : (
                    <User className="h-3 w-3 inline mr-1 text-gray-400" />
                  )}
                  {session.presenters.join(", ")}
                </p>
              </button>

              {/* Time - Right side for chronology - Clickable to edit */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onEditSession && !isPastEvent) {
                      onEditSession(session, location, e);
                    }
                  }}
                  disabled={isPastEvent || !onEditSession}
                  className={`flex items-center gap-2 px-3 py-1.5 bg-primary-teal-50 border border-primary-teal-200 rounded-md transition-all ${
                    !isPastEvent && onEditSession
                      ? "hover:bg-primary-teal-100 hover:border-primary-teal-300 cursor-pointer"
                      : "cursor-default"
                  }`}
                  title={
                    isPastEvent
                      ? "This event has ended"
                      : onEditSession
                      ? "Click to edit presentation time"
                      : undefined
                  }
                >
                  <Clock className="h-4 w-4 text-primary-teal-600" />
                  <span className="text-sm font-bold text-primary-teal-700 whitespace-nowrap">
                    {session.scheduledStart} - {session.endTime}
                  </span>
                </button>

                {onEditSession && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isPastEvent) {
                        onEditSession(session, location, e);
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
