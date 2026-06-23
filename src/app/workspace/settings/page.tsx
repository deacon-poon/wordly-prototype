"use client";

/**
 * Workspace Settings — [WS] Edit & Delete Workspaces (net-new design).
 *
 * Styled to mimic the Angular workspace app: v2-wrapper (`p-8`) → MainContainer
 * (title / description / content / footer), with the wordly-form FormControlWrapper
 * for the rename field — the same anatomy as workspace-users and sessions-default.
 * This is the base surface for mocking up the deletion design.
 *
 *   - General: rename the workspace (max 50, mirrors the create-dialog rule)
 *   - Danger Zone: delete the workspace (type-to-confirm via ConfirmationDialog)
 *
 * Mock-only: no backend.
 */

import * as React from "react";
import { useRouter } from "next/navigation";
import { Trash2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

import { MainContainer } from "@/components/ui/main-container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormControlWrapper } from "@/components/ui/form-control-wrapper";
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
    <div className="p-8">
      <MainContainer
        title={<span className="font-bold">Workspace Settings</span>}
        description={`Manage settings for ${activeWorkspace}.`}
        footerAlignment="right"
        footer={
          <div className="flex items-center gap-3">
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
        }
      >
        <div className="wordly-form-group flex flex-col gap-6 px-4">
          {/* General -------------------------------------------------- */}
          <FormControlWrapper
            label="Workspace name"
            layoutVariant="stacked"
            labelContextVariant="stacked"
            contentContextVariant="stacked"
            required
            showError={false}
          >
            <div className="max-w-md">
              <Input
                id="workspace-name"
                value={name}
                maxLength={NAME_MAX + 10}
                onChange={(e) => setName(e.target.value)}
                aria-invalid={!!nameError}
              />
              <div className="mt-1 flex items-center justify-between">
                <span className="text-xs text-destructive">
                  {nameError ?? ""}
                </span>
                <span className="text-xs text-muted-foreground">
                  {trimmed.length}/{NAME_MAX}
                </span>
              </div>
            </div>
          </FormControlWrapper>

          {/* Danger Zone --------------------------------------------- */}
          <section className="rounded-lg border border-red-200 bg-red-50/40">
            <div className="border-b border-red-100 px-4 py-3">
              <h2 className="flex items-center gap-2 text-base font-semibold text-red-700">
                <AlertTriangle className="h-5 w-5" />
                Danger Zone
              </h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Deleting a workspace is permanent and cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-between gap-4 px-4 py-4">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Delete this workspace
                </p>
                <p className="text-sm text-gray-600">
                  Removes the workspace and all of its sessions, transcripts,
                  and settings.
                </p>
              </div>
              <Button
                variant="outline"
                className="shrink-0 border-red-300 text-red-700 hover:bg-red-50 hover:text-red-800"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete workspace
              </Button>
            </div>
          </section>
        </div>
      </MainContainer>

      <ConfirmationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        variant="destructive"
        icon={<Trash2 className="h-8 w-8" />}
        title={`Delete “${activeWorkspace}”?`}
        description="This permanently deletes the workspace and everything in it. This action cannot be undone."
        confirmText="Delete workspace"
        validationLabel="Type the workspace name to confirm"
        validationText={activeWorkspace}
        onConfirm={handleDelete}
      />
    </div>
  );
}
