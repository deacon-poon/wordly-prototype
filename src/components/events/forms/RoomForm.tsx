"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Trash2, Plus, GripVertical } from "lucide-react";
import { RoomFormData, FormMode } from "./types";

// ============================================================================
// Single Room Form Props
// ============================================================================

interface RoomFormProps {
  /** Form data */
  data: RoomFormData;
  /** Callback when any field changes */
  onChange: (data: Partial<RoomFormData>) => void;
  /** Validation errors */
  errors?: Record<string, string>;
  /** Form mode (create or edit) */
  mode?: FormMode;
  /** Whether the form is read-only */
  readOnly?: boolean;
  /** Whether to show the full form or a compact version */
  compact?: boolean;
  /** Room index (for display purposes) */
  index?: number;
  /** Callback when delete is requested */
  onDelete?: () => void;
  /** Whether delete is allowed */
  canDelete?: boolean;
}

/**
 * Single room form - can be used standalone or as part of a list
 */
export function RoomForm({
  data,
  onChange,
  errors = {},
  mode = "create",
  readOnly = false,
  compact = false,
  index,
  onDelete,
  canDelete = true,
}: RoomFormProps) {
  return (
    <div className="space-y-4">
      {/* Room Name */}
      <div className="space-y-2">
        <Label
          htmlFor={`room-name-${index || 0}`}
          className="text-sm font-semibold text-gray-900"
        >
          Room Name *
        </Label>
        <Input
          id={`room-name-${index || 0}`}
          value={data.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="e.g., Main Auditorium, Workshop Room A"
          disabled={readOnly}
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      </div>

      {/* Delete button for list context */}
      {onDelete && canDelete && !readOnly && (
        <div className="flex justify-end">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Remove Room
          </Button>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Room List Form Props (for wizard multi-room editing)
// ============================================================================

interface RoomListFormProps {
  /** Array of room data */
  rooms: RoomFormData[];
  /** Callback when a room changes */
  onUpdateRoom: (index: number, data: Partial<RoomFormData>) => void;
  /** Callback to add a new room */
  onAddRoom: () => void;
  /** Callback to remove a room */
  onRemoveRoom: (index: number) => void;
  /** Errors by room index: { "0.name": "error message" } */
  errors?: Record<string, string>;
  /** Whether the form is read-only */
  readOnly?: boolean;
  /** Minimum number of rooms required */
  minRooms?: number;
}

/**
 * Room list form - used in wizard for managing multiple rooms
 */
export function RoomListForm({
  rooms,
  onUpdateRoom,
  onAddRoom,
  onRemoveRoom,
  errors = {},
  readOnly = false,
  minRooms = 1,
}: RoomListFormProps) {
  const getRoomErrors = (index: number): Record<string, string> => {
    const roomErrors: Record<string, string> = {};
    Object.entries(errors).forEach(([key, value]) => {
      if (key.startsWith(`${index}.`)) {
        roomErrors[key.replace(`${index}.`, "")] = value;
      }
    });
    return roomErrors;
  };

  return (
    <div className="space-y-4">
      {/* Info text */}
      <p className="text-sm text-gray-600">
        Add the physical rooms where presentations will take place. Each
        room will have its own Session ID and QR code.
      </p>

      {/* Room cards */}
      <div className="space-y-4">
        {rooms.map((room, index) => (
          <Card key={room.id || index} className="p-4 border-gray-200">
            <div className="flex items-start gap-3">
              {/* Drag handle (future: implement drag-to-reorder) */}
              <div className="pt-2 text-gray-400 cursor-grab">
                <GripVertical className="h-5 w-5" />
              </div>

              {/* Room icon */}
              <div className="pt-2">
                <MapPin className="h-5 w-5 text-primary-teal-600" />
              </div>

              {/* Form fields */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-gray-900">
                    Room {index + 1}
                  </h4>
                  {rooms.length > minRooms && !readOnly && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveRoom(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 px-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <RoomForm
                  data={room}
                  onChange={(data) => onUpdateRoom(index, data)}
                  errors={getRoomErrors(index)}
                  readOnly={readOnly}
                  compact={true}
                  index={index}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add room button */}
      {!readOnly && (
        <Button
          type="button"
          variant="outline"
          onClick={onAddRoom}
          className="w-full border-dashed border-2 border-gray-300 hover:border-primary-blue-400 hover:bg-primary-blue-50 text-gray-600 hover:text-primary-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Another Room
        </Button>
      )}

      {/* Empty state */}
      {rooms.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <MapPin className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p>No rooms added yet.</p>
          <p className="text-sm">Add at least one room to continue.</p>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Room Card (read-only display with actions)
// ============================================================================

interface RoomCardProps {
  room: RoomFormData;
  index: number;
  sessionCount?: number;
  onEdit?: () => void;
  onDelete?: () => void;
  onAddSession?: () => void;
}

/**
 * Room card - read-only display used in review step or event detail
 */
export function RoomCard({
  room,
  index,
  sessionCount = 0,
  onEdit,
  onDelete,
  onAddSession,
}: RoomCardProps) {
  return (
    <Card className="p-4 border-gray-200 hover:border-gray-300 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MapPin className="h-5 w-5 text-primary-teal-600" />
          <div>
            <h4 className="font-semibold text-gray-900">{room.name}</h4>
            <p className="text-xs text-gray-500 mt-1">
              {sessionCount} {sessionCount === 1 ? "session" : "sessions"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onAddSession && (
            <Button
              variant="outline"
              size="sm"
              onClick={onAddSession}
              className="text-primary-blue-600 border-primary-blue-600"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Session
            </Button>
          )}
          {onEdit && (
            <Button variant="ghost" size="sm" onClick={onEdit}>
              Edit
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
