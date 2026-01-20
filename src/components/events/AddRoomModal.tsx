"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, MapPin } from "lucide-react";
import { useStandaloneRoomForm, RoomFormData } from "./forms";

// ============================================================================
// Types
// ============================================================================

interface AddRoomModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (room: RoomFormData) => Promise<void>;
  eventName?: string;
}

// ============================================================================
// Component
// ============================================================================

/**
 * Modal for adding a new room to an existing event.
 * Creates an empty room - sessions can be added after via "Add Session" or "Upload Schedule".
 */
export function AddRoomModal({
  open,
  onOpenChange,
  onSave,
  eventName,
}: AddRoomModalProps) {
  const { room, updateRoom, errors, validate, reset } =
    useStandaloneRoomForm();
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = async () => {
    if (!validate()) return;

    setIsSaving(true);
    try {
      await onSave(room);
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to add room:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent-green-100 flex items-center justify-center">
              <MapPin className="h-5 w-5 text-primary-teal-600" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold text-gray-900">
                Add Room
              </DialogTitle>
              {eventName && (
                <DialogDescription className="text-sm text-gray-600">
                  Adding room to: {eventName}
                </DialogDescription>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {/* Room Name */}
          <div className="space-y-2">
            <Label
              htmlFor="room-name"
              className="text-sm font-semibold text-gray-900"
            >
              Room Name *
            </Label>
            <Input
              id="room-name"
              value={room.name}
              onChange={(e) => updateRoom({ name: e.target.value })}
              placeholder="e.g., Main Auditorium, Workshop Room A"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Hint */}
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-600">
              After creating the room, you can add sessions individually or
              use &quot;Upload Schedule&quot; to bulk import.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || !room.name.trim()}
            className="bg-primary-blue-600 hover:bg-primary-blue-700 text-white"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Adding...
              </>
            ) : (
              "Add Room"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
// Edit Room Modal (Reuses the same form)
// ============================================================================

interface EditRoomModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (room: RoomFormData) => Promise<void>;
  initialData: RoomFormData;
  eventName?: string;
}

/**
 * Modal for editing an existing room.
 */
export function EditRoomModal({
  open,
  onOpenChange,
  onSave,
  initialData,
  eventName,
}: EditRoomModalProps) {
  const { room, updateRoom, errors, validate, reset } =
    useStandaloneRoomForm(initialData);
  const [isSaving, setIsSaving] = React.useState(false);

  // Reset form when modal opens with new data
  React.useEffect(() => {
    if (open && initialData) {
      updateRoom(initialData);
    }
  }, [open, initialData]);

  const handleSave = async () => {
    if (!validate()) return;

    setIsSaving(true);
    try {
      await onSave(room);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update room:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent-green-100 flex items-center justify-center">
              <MapPin className="h-5 w-5 text-primary-teal-600" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold text-gray-900">
                Edit Room
              </DialogTitle>
              {eventName && (
                <DialogDescription className="text-sm text-gray-600">
                  Editing room in: {eventName}
                </DialogDescription>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          {/* Room Name */}
          <div className="space-y-2">
            <Label
              htmlFor="edit-room-name"
              className="text-sm font-semibold text-gray-900"
            >
              Room Name *
            </Label>
            <Input
              id="edit-room-name"
              value={room.name}
              onChange={(e) => updateRoom({ name: e.target.value })}
              placeholder="e.g., Main Auditorium, Workshop Room A"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || !room.name.trim()}
            className="bg-primary-blue-600 hover:bg-primary-blue-700 text-white"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
