"use client";

/**
 * Workspace Users — 1:1 port of the deployed Angular screen.
 *
 *   wordly_portal@origin/main:
 *     src/app/modules/v2/workspace-users/workspace-users.component.html / .ts
 *
 * Canonical route: /workspace/users (consolidated from the former
 * /workspace-users duplicate). Anatomy (mirrors the template): MainContainer
 * with title "{workspace}'s Users", a description, a primary "Add Users to
 * Workspace" action, and content that is either an empty state or a list of
 * users (name + email + destructive delete). Add uses the ported
 * UserSelectorDialog; delete uses ConfirmationDialog.
 *
 * Angular DI (WorkspaceState/Api/Data services, i18next, form builder) is dropped:
 * users are mock state. The Angular guard redirects personal workspaces to
 * /dashboard; not modelled here (mock workspace is shared).
 */

import * as React from "react";
import { Trash2 } from "lucide-react";

import { MainContainer } from "@/components/ui/main-container";
import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import {
  UserSelectorDialog,
  UserSelectorOption,
  MOCK_USERS,
} from "@/components/workspace/user-selector-dialog";
import { useWorkspace } from "@/contexts/workspace-context";

export default function WorkspaceUsersPage() {
  const { activeWorkspace } = useWorkspace();

  // Seed with a couple of members (Angular fetches via the API service).
  const [users, setUsers] = React.useState<UserSelectorOption[]>(() =>
    MOCK_USERS.slice(0, 2)
  );
  const [pendingDelete, setPendingDelete] =
    React.useState<UserSelectorOption | null>(null);

  const addUsers = (selected: UserSelectorOption[]) => {
    setUsers((prev) => {
      const existing = new Set(prev.map((u) => u.id));
      return [...prev, ...selected.filter((u) => !existing.has(u.id))];
    });
  };

  const confirmDelete = () => {
    if (pendingDelete) {
      setUsers((prev) => prev.filter((u) => u.id !== pendingDelete.id));
    }
  };

  return (
    <div className="p-8">
      <MainContainer
        showContentPadding={false}
        title={<span className="font-bold">{activeWorkspace}’s Users</span>}
        description="These users can use the same Sessions and Glossaries as you in this workspace"
        action={
          <UserSelectorDialog
            buttonText="Add Users to Workspace"
            excludedUsers={users}
            onUsersSelected={addUsers}
          />
        }
      >
        {users.length === 0 ? (
          <p className="text-sm text-muted-foreground p-6">
            No users found in this workspace.
          </p>
        ) : (
          users.map((user) => (
            <div key={user.id} className="p-4 border-b border-border flex">
              <div className="flex-1">
                <h2 className="text-lg font-medium">{user.name}</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <div>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Remove ${user.name}`}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => setPendingDelete(user)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </MainContainer>

      {/* Delete confirmation (Angular: WordlyConfirmDialog) */}
      <ConfirmationDialog
        open={!!pendingDelete}
        onOpenChange={(o) => !o && setPendingDelete(null)}
        variant="destructive"
        icon={<Trash2 className="h-8 w-8" />}
        title={`Remove ${pendingDelete?.name ?? "user"}?`}
        description={`This removes ${pendingDelete?.name ?? "the user"} from ${activeWorkspace}. They’ll lose access to this workspace’s sessions and glossaries.`}
        confirmText="Remove user"
        onConfirm={confirmDelete}
      />
    </div>
  );
}
