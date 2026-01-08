"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
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
import { getTimezoneAbbr } from "@/components/ui/datetime-picker";

interface Session {
  id: string;
  title: string;
  presenters: string[];
  scheduledDate: string;
  scheduledStart: string;
  endTime: string;
  timezone?: string;
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
  /** Event-level timezone - used for displaying session times */
  eventTimezone?: string;
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

export function LocationAccordion({
  location,
  defaultExpanded = false,
  eventTimezone = "America/Los_Angeles",
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
      className={`relative transition-all duration-200 rounded-lg bg-white border border-gray-100 ${
        isExpanded ? "border-gray-200/60" : "hover:border-gray-200/60"
      }`}
    >
      {/* Location Header - using div with role="button" to avoid nested button issue */}
      <div className="w-full px-4 py-3 flex items-center text-left">
        {/* Clickable area for expand/collapse */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => setIsExpanded(!isExpanded)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setIsExpanded(!isExpanded);
            }
          }}
          className="flex items-center flex-1 min-w-0 cursor-pointer"
        >
          {/* Left: Icon column (fixed width for alignment with date icon) */}
          <div className="w-8 flex-shrink-0 flex items-center justify-center">
            <MapPin className="h-5 w-5 text-primary-teal-600" />
          </div>

          {/* Center: Name + Count (grows) */}
          <div className="flex-1 flex items-center gap-2 min-w-0">
            <h4 className="font-semibold text-gray-900 truncate">
              {location.name}
            </h4>
            <span className="text-sm text-gray-500 flex-shrink-0">
              ({location.sessions.length}{" "}
              {location.sessions.length === 1
                ? "presentation"
                : "presentations"}
              )
            </span>
          </div>
        </div>

        {/* Right: Actions - NOT inside the clickable area */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {onLinksToJoin && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onLinksToJoin(location, e);
              }}
              className="text-primary-teal-600 hover:text-primary-teal-700 hover:bg-primary-teal-50"
              title="Links to join"
            >
              <QrCode className="h-4 w-4 @md:mr-1.5" />
              <span className="hidden @md:inline">Links to join</span>
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
              className="bg-primary-teal-600 hover:bg-primary-teal-700 text-white disabled:opacity-50"
              title={isPastEvent ? "This event has ended" : "Start Location"}
            >
              <Play className="h-4 w-4 @md:mr-1.5" />
              <span className="hidden @md:inline">Start Location</span>
            </Button>
          )}

          {/* More actions dropdown */}
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
                  <DropdownMenuItem onClick={() => onAddSession(location)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Session
                  </DropdownMenuItem>
                )}
                {onRenameLocation && (
                  <DropdownMenuItem onClick={() => onRenameLocation(location)}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Rename Location
                  </DropdownMenuItem>
                )}
                {onDeleteLocation && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDeleteLocation(location)}
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
        </div>

        {/* Right: Chevron column - also clickable for expand/collapse */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => setIsExpanded(!isExpanded)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setIsExpanded(!isExpanded);
            }
          }}
          className="w-10 flex-shrink-0 flex items-center justify-center cursor-pointer"
        >
          <ChevronDown
            className={`h-5 w-5 text-primary-teal-600 transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {/* Credentials row - aligned with icon column */}
      {showCredentials && (
        <div className="px-4 pb-3 flex items-center">
          {/* Spacer matching icon column */}
          <div className="w-8 flex-shrink-0" />
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>
              Session ID:{" "}
              <code className="font-mono text-gray-700">
                {location.locationSessionId}
              </code>
            </span>
            <span>
              Passcode:{" "}
              <code className="font-mono text-gray-700">
                {location.passcode}
              </code>
            </span>
          </div>
        </div>
      )}

      {/* Presentations - Collapsible */}
      {isExpanded && (
        <div className="border-t border-gray-200 divide-y divide-gray-100">
          {/* Empty state when no sessions */}
          {location.sessions.length === 0 && (
            <div className="px-4 py-6 text-center">
              <p className="text-sm text-gray-500 mb-3">
                No sessions in this location yet.
              </p>
              {onAddSession && !isPastEvent && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAddSession(location)}
                  className="text-primary-teal-600 border-primary-teal-600 hover:bg-primary-teal-50"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Session
                </Button>
              )}
            </div>
          )}
          {location.sessions.map((session) => (
            <div
              key={session.id}
              className="px-4 py-3 hover:bg-gray-50 transition-colors group flex items-center"
            >
              {/* Left: Spacer matching icon column */}
              <div className="w-8 flex-shrink-0" />

              {/* Center: Title and Presenters (grows) */}
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

              {/* Right: Time badge + Edit button (aligns with action buttons above) */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-teal-50 border border-primary-teal-200 rounded-md">
                  <span className="text-sm font-bold text-primary-teal-700 whitespace-nowrap">
                    {session.scheduledStart} – {session.endTime}
                  </span>
                  <span className="text-xs font-medium text-primary-teal-600 bg-primary-teal-100 px-1.5 py-0.5 rounded">
                    {getTimezoneAbbr(session.timezone || eventTimezone)}
                  </span>
                </div>

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
                    className="h-8 w-8 p-0 text-gray-500 hover:text-primary-teal-600"
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

              {/* Right: Spacer matching chevron column */}
              <div className="w-10 flex-shrink-0" />
            </div>
          ))}

          {/* Add Session button at bottom of list (always visible when expanded with sessions) */}
          {location.sessions.length > 0 && onAddSession && !isPastEvent && (
            <div className="px-4 py-3 border-t border-gray-100">
              <div className="flex items-center">
                <div className="w-8 flex-shrink-0" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onAddSession(location)}
                  className="text-primary-teal-600 hover:text-primary-teal-700 hover:bg-primary-teal-50 -ml-2"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Session
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
