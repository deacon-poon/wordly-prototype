"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Trash2, Plus, GripVertical } from "lucide-react";
import { LocationFormData, FormMode } from "./types";

// ============================================================================
// Single Location Form Props
// ============================================================================

interface LocationFormProps {
  /** Form data */
  data: LocationFormData;
  /** Callback when any field changes */
  onChange: (data: Partial<LocationFormData>) => void;
  /** Validation errors */
  errors?: Record<string, string>;
  /** Form mode (create or edit) */
  mode?: FormMode;
  /** Whether the form is read-only */
  readOnly?: boolean;
  /** Whether to show the full form or a compact version */
  compact?: boolean;
  /** Location index (for display purposes) */
  index?: number;
  /** Callback when delete is requested */
  onDelete?: () => void;
  /** Whether delete is allowed */
  canDelete?: boolean;
}

/**
 * Single location form - can be used standalone or as part of a list
 */
export function LocationForm({
  data,
  onChange,
  errors = {},
  mode = "create",
  readOnly = false,
  compact = false,
  index,
  onDelete,
  canDelete = true,
}: LocationFormProps) {
  return (
    <div className="space-y-4">
      {/* Location Name */}
      <div className="space-y-2">
        <Label
          htmlFor={`location-name-${index || 0}`}
          className="text-sm font-semibold text-gray-900"
        >
          Location Name *
        </Label>
        <Input
          id={`location-name-${index || 0}`}
          value={data.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="e.g., Main Auditorium, Workshop Room A"
          disabled={readOnly}
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      </div>

      {/* Description (optional, shown in full mode) */}
      {!compact && (
        <div className="space-y-2">
          <Label
            htmlFor={`location-description-${index || 0}`}
            className="text-sm font-medium text-gray-700"
          >
            Description (optional)
          </Label>
          <Textarea
            id={`location-description-${index || 0}`}
            value={data.description || ""}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="Brief description of this location"
            disabled={readOnly}
            rows={2}
          />
        </div>
      )}

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
            Remove Location
          </Button>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Location List Form Props (for wizard multi-location editing)
// ============================================================================

interface LocationListFormProps {
  /** Array of location data */
  locations: LocationFormData[];
  /** Callback when a location changes */
  onUpdateLocation: (index: number, data: Partial<LocationFormData>) => void;
  /** Callback to add a new location */
  onAddLocation: () => void;
  /** Callback to remove a location */
  onRemoveLocation: (index: number) => void;
  /** Errors by location index: { "0.name": "error message" } */
  errors?: Record<string, string>;
  /** Whether the form is read-only */
  readOnly?: boolean;
  /** Minimum number of locations required */
  minLocations?: number;
}

/**
 * Location list form - used in wizard for managing multiple locations
 */
export function LocationListForm({
  locations,
  onUpdateLocation,
  onAddLocation,
  onRemoveLocation,
  errors = {},
  readOnly = false,
  minLocations = 1,
}: LocationListFormProps) {
  const getLocationErrors = (index: number): Record<string, string> => {
    const locationErrors: Record<string, string> = {};
    Object.entries(errors).forEach(([key, value]) => {
      if (key.startsWith(`${index}.`)) {
        locationErrors[key.replace(`${index}.`, "")] = value;
      }
    });
    return locationErrors;
  };

  return (
    <div className="space-y-4">
      {/* Info text */}
      <p className="text-sm text-gray-600">
        Add the physical locations where presentations will take place. Each
        location will have its own Session ID and QR code.
      </p>

      {/* Location cards */}
      <div className="space-y-4">
        {locations.map((location, index) => (
          <Card key={location.id || index} className="p-4 border-gray-200">
            <div className="flex items-start gap-3">
              {/* Drag handle (future: implement drag-to-reorder) */}
              <div className="pt-2 text-gray-400 cursor-grab">
                <GripVertical className="h-5 w-5" />
              </div>

              {/* Location icon */}
              <div className="pt-2">
                <MapPin className="h-5 w-5 text-primary-teal-600" />
              </div>

              {/* Form fields */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-gray-900">
                    Location {index + 1}
                  </h4>
                  {locations.length > minLocations && !readOnly && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveLocation(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 px-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <LocationForm
                  data={location}
                  onChange={(data) => onUpdateLocation(index, data)}
                  errors={getLocationErrors(index)}
                  readOnly={readOnly}
                  compact={true}
                  index={index}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add location button */}
      {!readOnly && (
        <Button
          type="button"
          variant="outline"
          onClick={onAddLocation}
          className="w-full border-dashed border-2 border-gray-300 hover:border-primary-teal-400 hover:bg-primary-teal-50 text-gray-600 hover:text-primary-teal-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Another Location
        </Button>
      )}

      {/* Empty state */}
      {locations.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <MapPin className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p>No locations added yet.</p>
          <p className="text-sm">Add at least one location to continue.</p>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Location Card (read-only display with actions)
// ============================================================================

interface LocationCardProps {
  location: LocationFormData;
  index: number;
  sessionCount?: number;
  onEdit?: () => void;
  onDelete?: () => void;
  onAddSession?: () => void;
}

/**
 * Location card - read-only display used in review step or event detail
 */
export function LocationCard({
  location,
  index,
  sessionCount = 0,
  onEdit,
  onDelete,
  onAddSession,
}: LocationCardProps) {
  return (
    <Card className="p-4 border-gray-200 hover:border-gray-300 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MapPin className="h-5 w-5 text-primary-teal-600" />
          <div>
            <h4 className="font-semibold text-gray-900">{location.name}</h4>
            {location.description && (
              <p className="text-sm text-gray-600">{location.description}</p>
            )}
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
              className="text-primary-teal-600 border-primary-teal-600"
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
