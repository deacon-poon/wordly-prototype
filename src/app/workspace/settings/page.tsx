"use client";

/**
 * Workspace Settings — [WS] Edit & Delete Workspaces (net-new design).
 *
 * Iteration surface for the workspace edit/delete flows. Renders inside the legacy
 * site-nav shell. Reuses shared atoms (@/components/ui/*). Mock-only: no backend.
 *
 *   - General: rename the workspace (max 50, mirrors the create-dialog rule)
 *   - Danger Zone: delete the workspace (type-to-confirm via ConfirmationDialog)
 */

import * as React from "react";
import { useRouter } from "next/navigation";
import { Trash2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { useWorkspace } from "@/contexts/workspace-context";

const NAME_MAX = 50;

export default function WorkspaceSettingsPage() {
  const router = useRouter();
  const { activeWorkspace, setActiveWorkspace } = useWorkspace();

  const [name, setName] = React.useState(activeWorkspace);
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  // Keep the field in sync if the active workspace changes from the nav.
  React.useEffect(() => setName(activeWorkspace), [activeWorkspace]);

  const trimmed = name.trim();
  const dirty = trimmed !== activeWorkspace;
  const nameError =
    trimmed.length === 0
      ? "Workspace name is required."
      : trimmed.length > NAME_MAX
        ? `Name must be ${NAME_MAX} characters or fewer.`
        : null;
  const canSave = dirty && !nameError;

  const handleSave = () => {
    if (!canSave) return;
    setActiveWorkspace(trimmed);
    toast.success("Workspace name updated.");
  };

  const handleDelete = () => {
    toast.success(`Workspace “${activeWorkspace}” deleted.`);
    router.push("/dashboard");
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Workspace Settings
        </h1>
        <p className="text-sm text-gray-700 mt-1">
          Manage settings for{" "}
          <span className="font-medium">{activeWorkspace}</span>.
        </p>
      </div>

      {/* General -------------------------------------------------------- */}
      <Card>
        <CardHeader>
          <CardTitle>General</CardTitle>
          <CardDescription>
            Change how this workspace appears across the portal.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="workspace-name" className="text-gray-700">
              Workspace name
            </Label>
            <Input
              id="workspace-name"
              value={name}
              maxLength={NAME_MAX + 10}
              onChange={(e) => setName(e.target.value)}
              aria-invalid={!!nameError}
              className="max-w-md"
            />
            <div className="flex items-center justify-between max-w-md">
              <span className="text-xs text-red-600">{nameError ?? ""}</span>
              <span className="text-xs text-gray-500">
                {trimmed.length}/{NAME_MAX}
              </span>
            </div>
          </div>
          <div className="flex justify-end gap-2 max-w-md">
            <Button
              variant="outline"
              onClick={() => setName(activeWorkspace)}
              disabled={!dirty}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!canSave}>
              Save changes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone ---------------------------------------------------- */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Deleting a workspace is permanent and cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Separator className="mb-4" />
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-gray-900">
                Delete this workspace
              </p>
              <p className="text-sm text-gray-700">
                Removes the workspace and all of its sessions, transcripts, and
                settings.
              </p>
            </div>
            <Button
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-50 hover:text-red-800 shrink-0"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete workspace
            </Button>
          </div>
        </CardContent>
      </Card>

      <ConfirmationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        variant="destructive"
        icon={<Trash2 className="h-8 w-8" />}
        title={`Delete “${activeWorkspace}”?`}
        description="This permanently deletes the workspace and everything in it. This action cannot be undone."
        confirmText="Delete workspace"
        validationLabel={`Type the workspace name to confirm`}
        validationText={activeWorkspace}
        onConfirm={handleDelete}
      />
    </div>
  );
}
