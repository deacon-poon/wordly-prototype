"use client";

/**
 * Accounts — 1:1 React port of the Angular portal `app-user-accounts` screen
 * (wordly_portal: src/app/modules/user-accounts/*). Faithful to:
 *   - user-accounts.component.html (two tabs, header actions, account/invite rows, paginator)
 *   - user-accounts-detail.component.html (account detail: title/owner/desc/balance/default,
 *     share + sharing-with list + invited-to-share list, edit form)
 *   - user-accounts-invitation.component.html (invitation detail: date/from/name/set-default,
 *     invitation text, Decline/Accept)
 *   - user-account-transfer.component.html (transfer form: From/To/Minutes, Cancel/Transfer)
 *
 * Built on shared `@/components/ui/*` atoms. Representative mock data; actions are
 * local-state no-ops (prototype). Right side panel on desktop, inline on mobile.
 */

import * as React from "react";
import {
  Plus,
  Shuffle,
  Mail,
  Pencil,
  Trash2,
  BookText,
  ShoppingCart,
  Share2,
} from "lucide-react";

import { MainContainer } from "@/components/ui/main-container";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

interface SharedUser {
  email: string;
  name: string;
}
interface PendingShare {
  email: string;
  dateFormat: string;
}
interface AccountModel {
  id: string;
  titleLabel: string;
  ownerName: string;
  description: string;
  balanceMinutes: number;
  isOwned: boolean;
  sharing: SharedUser[];
  invitations: PendingShare[];
}

const ACCOUNTS: AccountModel[] = [
  {
    id: "acct-hq",
    titleLabel: "Main HQ Pool",
    ownerName: "Deacon Poon",
    description: "Primary minute pool for headquarters meetings.",
    balanceMinutes: 3140,
    isOwned: true,
    sharing: [
      { email: "justin@wordly.ai", name: "Justin Lee" },
      { email: "graham@wordly.ai", name: "Graham Diehl" },
    ],
    invitations: [{ email: "newhire@wordly.ai", dateFormat: "2026-06-10" }],
  },
  {
    id: "acct-events",
    titleLabel: "Events Pool",
    ownerName: "Deacon Poon",
    description: "Shared pool reserved for large public events.",
    balanceMinutes: 12500,
    isOwned: true,
    sharing: [{ email: "events@wordly.ai", name: "Events Team" }],
    invitations: [],
  },
  {
    id: "acct-trial",
    titleLabel: "Trial Pool",
    ownerName: "Deacon Poon",
    description: "Evaluation minutes for new prospects.",
    balanceMinutes: 0,
    isOwned: true,
    sharing: [],
    invitations: [],
  },
  {
    id: "acct-partner",
    titleLabel: "Partner Org Pool",
    ownerName: "Lakshman Rathnam",
    description: "Account shared with the partner organization.",
    balanceMinutes: 860,
    isOwned: false,
    sharing: [],
    invitations: [],
  },
];

interface InvitationModel {
  id: string;
  resourceTitle: string;
  date: string;
  inviterEmail: string;
  inviterName: string;
}

const INVITATIONS: InvitationModel[] = [
  {
    id: "inv-1",
    resourceTitle: "Regional Sales Pool",
    date: "2026-06-12",
    inviterEmail: "sandra@wordly.ai",
    inviterName: "Sandra Kim",
  },
  {
    id: "inv-2",
    resourceTitle: "Q3 Marketing Pool",
    date: "2026-06-15",
    inviterEmail: "marco@wordly.ai",
    inviterName: "Marco Diaz",
  },
];

const PAGE_SIZE_OPTIONS = [25, 50, 100];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function minsLabel(mins: number) {
  return `${mins.toLocaleString()} mins`;
}

// ---------------------------------------------------------------------------
// Account detail (port of user-accounts-detail.component.html, view mode)
// ---------------------------------------------------------------------------

function AccountDetail({
  account,
  isDefault,
  onSetDefault,
}: {
  account: AccountModel;
  isDefault: boolean;
  onSetDefault: () => void;
}) {
  return (
    <div className="account-details space-y-4">
      {/* account-head */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-900">Account</span>
        {account.isOwned ? (
          <span className="flex items-center gap-2">
            <button
              type="button"
              title="Edit Account"
              className="text-primary-blue-500 hover:text-primary-blue-600"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              type="button"
              title="Remove Account"
              className="text-primary-blue-500 hover:text-primary-blue-600"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </span>
        ) : null}
      </div>

      {/* account-content / account-detail items */}
      <div className="space-y-3 text-sm">
        {/* Title */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-gray-700">Title:</span>
          <span className="flex min-w-0 items-center gap-2">
            <span className="truncate text-gray-900">
              {account.titleLabel || "-"}
            </span>
            <button
              type="button"
              title="Go To Transactions"
              className="text-primary-blue-500 hover:text-primary-blue-600"
            >
              <BookText className="h-4 w-4" />
            </button>
          </span>
        </div>

        {/* Owner */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-gray-700">Owner:</span>
          <span className="text-gray-900">{account.ownerName || "-"}</span>
        </div>

        {/* Description */}
        <div className="flex items-center justify-between gap-2">
          <span className="shrink-0 text-gray-700">Description:</span>
          <span className="text-right text-gray-900">
            {account.description || "-"}
          </span>
        </div>

        {/* Balance */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-gray-700">Balance:</span>
          <span className="flex items-center gap-2">
            <span className="text-gray-900">
              {minsLabel(account.balanceMinutes)}
            </span>
            {account.isOwned ? (
              <button
                type="button"
                title="Add Minutes"
                className="text-primary-blue-500 hover:text-primary-blue-600"
              >
                <ShoppingCart className="h-4 w-4" />
              </button>
            ) : null}
          </span>
        </div>

        {/* Set as Default */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-gray-700">Set as Default:</span>
          <span className="value-set-default">
            <Checkbox
              checked={isDefault}
              disabled={isDefault}
              onCheckedChange={() => {
                if (!isDefault) onSetDefault();
              }}
              aria-label="Set as default account"
            />
          </span>
        </div>
      </div>

      {/* account-share */}
      <div>
        {account.isOwned ? (
          <Button variant="outline" size="sm">
            Share
          </Button>
        ) : (
          <span className="text-sm text-gray-700">Owned by sharer</span>
        )}
      </div>

      {/* Sharing With */}
      {account.isOwned && account.sharing.length > 0 ? (
        <div className="space-y-2">
          <Separator />
          <div className="text-sm font-semibold text-gray-900">
            Sharing With
          </div>
          {account.sharing.map((share, i) => (
            <div
              key={`${share.email}-${i}`}
              className="flex items-center justify-between gap-2 text-sm"
            >
              <span className="min-w-0 truncate text-gray-900">
                {share.email}
              </span>
              <span className="truncate text-gray-700">{share.name}</span>
              <button
                type="button"
                title="Unshare with User"
                className="ml-auto text-primary-blue-500 hover:text-primary-blue-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      ) : null}

      {/* Invited to Share */}
      {account.isOwned && account.invitations.length > 0 ? (
        <div className="space-y-2">
          <Separator />
          <div className="text-sm font-semibold text-gray-900">
            Invited to Share
          </div>
          {account.invitations.map((invite, i) => (
            <div
              key={`${invite.email}-${i}`}
              className="flex items-center justify-between gap-2 text-sm"
            >
              <span className="min-w-0 truncate text-gray-900">
                {invite.email || "email"}
              </span>
              <span className="text-gray-700">{invite.dateFormat}</span>
              <span className="ml-auto flex items-center gap-2">
                <button
                  type="button"
                  title="Resend Invitation"
                  className="text-primary-blue-500 hover:text-primary-blue-600"
                >
                  <Share2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  title="Revoke Invitation"
                  className="text-primary-blue-500 hover:text-primary-blue-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Transfer form (port of user-account-transfer.component.html)
// ---------------------------------------------------------------------------

function TransferForm({ onClose }: { onClose: () => void }) {
  const ownAccounts = ACCOUNTS.filter((a) => a.isOwned);
  const [fromId, setFromId] = React.useState(ownAccounts[0]?.id ?? "");
  const [toId, setToId] = React.useState(ownAccounts[1]?.id ?? "");
  const [minutes, setMinutes] = React.useState("1");

  const fromAccount = ownAccounts.find((a) => a.id === fromId);
  const mins = Number(minutes);
  const sameAccount = fromId === toId;
  const overBalance = !!fromAccount && fromAccount.balanceMinutes < mins;
  const invalid = sameAccount || mins <= 0 || overBalance;

  return (
    <div className="account-transfer space-y-4">
      <div className="text-sm font-semibold text-gray-900">
        Transfer Minutes
      </div>
      <div className="space-y-4 text-sm">
        {/* From */}
        <div className="space-y-1">
          <label className="text-gray-700">From Account:</label>
          <Select value={fromId} onValueChange={setFromId}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ownAccounts.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.titleLabel}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* To */}
        <div className="space-y-1">
          <label className="text-gray-700">To Account:</label>
          <Select value={toId} onValueChange={setToId}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ownAccounts.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.titleLabel}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {sameAccount ? (
          <div className="text-sm text-destructive">
            Please select different accounts.
          </div>
        ) : null}

        {/* Minutes */}
        <div className="space-y-1">
          <label className="text-gray-700">Minutes:</label>
          <Input
            type="number"
            min={1}
            step={1}
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
          />
        </div>

        {fromAccount ? (
          <div
            className={cn(
              "text-sm",
              overBalance || mins <= 0
                ? "text-destructive"
                : "text-muted-foreground"
            )}
          >
            You can transfer up to {fromAccount.balanceMinutes.toLocaleString()}{" "}
            Minutes
          </div>
        ) : null}

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" disabled={invalid}>
            Transfer
          </Button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Add account form (port of user-accounts-detail edit mode, inAdd)
// ---------------------------------------------------------------------------

function AddAccountForm({ onClose }: { onClose: () => void }) {
  return (
    <div className="space-y-4">
      <div className="text-sm font-semibold text-gray-900">Add Account</div>
      <div className="space-y-3 text-sm">
        <div className="space-y-1">
          <label className="text-gray-700">Title:</label>
          <Input type="text" placeholder="Account title" />
        </div>
        <div className="space-y-1">
          <label className="text-gray-700">Description:</label>
          <Input type="text" placeholder="Description" />
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-gray-700">Set as Default:</span>
          <Checkbox aria-label="Set as default account" />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onClose}>
          Reset
        </Button>
        <Button size="sm">Save</Button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Invitation detail (port of user-accounts-invitation.component.html)
// ---------------------------------------------------------------------------

function InvitationDetail({ invitation }: { invitation: InvitationModel }) {
  const [isDefault, setIsDefault] = React.useState(true);
  return (
    <div className="account-inv-details space-y-4">
      <div className="truncate text-sm font-semibold text-gray-900">
        {invitation.resourceTitle}
      </div>
      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between gap-2">
          <span className="text-gray-700">Date:</span>
          <span className="text-gray-900">{invitation.date || "-"}</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-gray-700">From:</span>
          <span className="text-gray-900">
            {invitation.inviterEmail || "-"}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-gray-700">Name:</span>
          <span className="text-gray-900">{invitation.inviterName || "-"}</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-gray-700">Set as Default:</span>
          <Checkbox
            checked={isDefault}
            onCheckedChange={(v) => setIsDefault(v === true)}
            aria-label="Set as default account"
          />
        </div>
        <p className="text-gray-700">
          You have been invited to use this account. If you accept, it will be
          added to your available accounts.
        </p>
        <p className="text-gray-700">
          If you check &quot;Set as default&quot;, this account will be used
          when creating new sessions.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm">
            Decline
          </Button>
          <Button size="sm">Accept</Button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function AccountsPage() {
  const [tab, setTab] = React.useState<"accounts" | "invitations">("accounts");

  // My Accounts state
  const [defaultAccountId, setDefaultAccountId] = React.useState(
    ACCOUNTS[0].id
  );
  const [expandedAccountId, setExpandedAccountId] = React.useState<
    string | null
  >(ACCOUNTS[0].id);
  const [transferOpen, setTransferOpen] = React.useState(false);
  const [addOpen, setAddOpen] = React.useState(false);
  const [pageSize, setPageSize] = React.useState(PAGE_SIZE_OPTIONS[0]);

  // Pending Invitations state
  const [selectedInvitationId, setSelectedInvitationId] = React.useState<
    string | null
  >(INVITATIONS[0]?.id ?? null);

  const enableTransfer = ACCOUNTS.filter((a) => a.isOwned).length > 1;
  const invitationsCount = INVITATIONS.length;

  const selectedAccount =
    ACCOUNTS.find((a) => a.id === expandedAccountId) ?? null;
  const selectedInvitation =
    INVITATIONS.find((i) => i.id === selectedInvitationId) ?? null;

  const pagedAccounts = ACCOUNTS.slice(0, pageSize);
  const pagedInvitations = INVITATIONS.slice(0, pageSize);

  // Desktop side panel content mirrors selection on the My Accounts tab.
  const sidePanel =
    tab === "accounts" ? (
      transferOpen ? (
        <TransferForm onClose={() => setTransferOpen(false)} />
      ) : addOpen ? (
        <AddAccountForm onClose={() => setAddOpen(false)} />
      ) : selectedAccount ? (
        <AccountDetail
          account={selectedAccount}
          isDefault={selectedAccount.id === defaultAccountId}
          onSetDefault={() => setDefaultAccountId(selectedAccount.id)}
        />
      ) : (
        <div className="text-sm text-muted-foreground">
          No account selected.
        </div>
      )
    ) : selectedInvitation ? (
      <InvitationDetail invitation={selectedInvitation} />
    ) : (
      <div className="text-sm text-muted-foreground">
        No invitation selected.
      </div>
    );

  const headerActions = (
    <>
      {enableTransfer ? (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setAddOpen(false);
            setTransferOpen((v) => !v);
          }}
          title="Transfer between Accounts"
        >
          <Shuffle className="mr-2 h-4 w-4" />
          Transfer Minutes
        </Button>
      ) : null}
      <Button
        size="sm"
        onClick={() => {
          setTransferOpen(false);
          setAddOpen((v) => !v);
        }}
        title="Add Account"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Account
      </Button>
    </>
  );

  return (
    <MainContainer
      title={<span className="font-bold">Accounts</span>}
      action={headerActions}
      hasSidePanel
      sidePanelOpen
      showSidePanelToggle={false}
      sidePanel={sidePanel}
    >
      <Tabs
        value={tab}
        onValueChange={(v) => setTab(v as "accounts" | "invitations")}
        className="w-full"
      >
        <TabsList>
          <TabsTrigger value="accounts">My Accounts</TabsTrigger>
          <TabsTrigger value="invitations" className="gap-2">
            Pending Invitations
            {invitationsCount > 0 ? (
              <Badge variant="navy" size="sm">
                {invitationsCount}
              </Badge>
            ) : null}
          </TabsTrigger>
        </TabsList>

        {/* ----------------------------- My Accounts ----------------------------- */}
        <TabsContent value="accounts" className="space-y-2">
          {/* Inline Transfer action (mobile) — expands inline like Angular */}
          {enableTransfer ? (
            <Collapsible open={transferOpen} onOpenChange={setTransferOpen}>
              <CollapsibleTrigger asChild>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-md border border-input px-4 py-3 text-sm font-semibold text-gray-900 hover:bg-muted md:hidden"
                >
                  <Shuffle className="h-4 w-4" />
                  Transfer Minutes
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="rounded-md border border-input p-4 md:hidden">
                <TransferForm onClose={() => setTransferOpen(false)} />
              </CollapsibleContent>
            </Collapsible>
          ) : null}

          {/* Inline Add action (mobile) */}
          <Collapsible open={addOpen} onOpenChange={setAddOpen}>
            <CollapsibleTrigger asChild>
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-md border border-input px-4 py-3 text-sm font-semibold text-gray-900 hover:bg-muted md:hidden"
              >
                <Plus className="h-4 w-4" />
                Add Account
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="rounded-md border border-input p-4 md:hidden">
              <AddAccountForm onClose={() => setAddOpen(false)} />
            </CollapsibleContent>
          </Collapsible>

          {/* Account list */}
          <div className="space-y-2">
            {pagedAccounts.map((account) => {
              const isExpanded = account.id === expandedAccountId;
              const isDefault = account.id === defaultAccountId;
              return (
                <Collapsible
                  key={account.id}
                  open={isExpanded}
                  onOpenChange={(open) => {
                    setTransferOpen(false);
                    setAddOpen(false);
                    setExpandedAccountId(open ? account.id : null);
                  }}
                  className={cn(
                    "rounded-md border",
                    isExpanded ? "border-primary-blue-500" : "border-input"
                  )}
                >
                  <CollapsibleTrigger asChild>
                    <button
                      type="button"
                      className="flex w-full items-center gap-4 px-4 py-3 text-left text-sm hover:bg-muted"
                    >
                      <span className="min-w-0 flex-1 truncate font-semibold text-gray-900">
                        {account.titleLabel || "-"}
                      </span>
                      <span className="hidden min-w-0 flex-1 truncate text-gray-700 sm:block">
                        {account.ownerName}
                      </span>
                      <span className="whitespace-nowrap text-gray-700">
                        {minsLabel(account.balanceMinutes)}
                      </span>
                      <span className="flex w-6 justify-center">
                        {isDefault ? (
                          <Checkbox
                            checked
                            disabled
                            aria-label="Default account"
                          />
                        ) : null}
                      </span>
                    </button>
                  </CollapsibleTrigger>
                  {/* Inline detail — mobile only; desktop shows it in the side panel */}
                  <CollapsibleContent className="border-t border-input p-4 md:hidden">
                    <AccountDetail
                      account={account}
                      isDefault={isDefault}
                      onSetDefault={() => setDefaultAccountId(account.id)}
                    />
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </div>

          {/* Paginator */}
          <div className="flex items-center justify-end gap-3 pt-4 text-sm text-muted-foreground">
            <span>Rows per page</span>
            <Select
              value={String(pageSize)}
              onValueChange={(v) => setPageSize(Number(v))}
            >
              <SelectTrigger className="h-8 w-[80px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZE_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={String(opt)}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span>
              1–{Math.min(pageSize, ACCOUNTS.length)} of {ACCOUNTS.length}
            </span>
          </div>
        </TabsContent>

        {/* -------------------------- Pending Invitations -------------------------- */}
        <TabsContent value="invitations" className="space-y-2">
          {invitationsCount > 0 ? (
            <>
              <div className="space-y-2">
                {pagedInvitations.map((invitation) => {
                  const isSelected = invitation.id === selectedInvitationId;
                  return (
                    <Collapsible
                      key={invitation.id}
                      open={isSelected}
                      onOpenChange={(open) =>
                        setSelectedInvitationId(open ? invitation.id : null)
                      }
                      className={cn(
                        "rounded-md border",
                        isSelected ? "border-primary-blue-500" : "border-input"
                      )}
                    >
                      <CollapsibleTrigger asChild>
                        <button
                          type="button"
                          className="flex w-full items-center gap-4 px-4 py-3 text-left text-sm hover:bg-muted"
                        >
                          <span className="min-w-0 flex-1 truncate font-semibold text-gray-900">
                            {invitation.resourceTitle}
                          </span>
                          <span className="flex items-center gap-2 text-gray-700">
                            <span>Invitation</span>
                            <Mail className="h-4 w-4 text-primary-blue-500" />
                          </span>
                        </button>
                      </CollapsibleTrigger>
                      {/* Inline detail — mobile only */}
                      <CollapsibleContent className="border-t border-input p-4 md:hidden">
                        <InvitationDetail invitation={invitation} />
                      </CollapsibleContent>
                    </Collapsible>
                  );
                })}
              </div>

              {/* Paginator */}
              <div className="flex items-center justify-end gap-3 pt-4 text-sm text-muted-foreground">
                <span>Rows per page</span>
                <Select
                  value={String(pageSize)}
                  onValueChange={(v) => setPageSize(Number(v))}
                >
                  <SelectTrigger className="h-8 w-[80px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAGE_SIZE_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={String(opt)}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span>
                  1–{Math.min(pageSize, INVITATIONS.length)} of{" "}
                  {INVITATIONS.length}
                </span>
              </div>
            </>
          ) : (
            <div className="py-12 text-center">
              <p className="text-base font-semibold text-gray-900">
                No pending invitations
              </p>
              <p className="mt-1 text-sm text-gray-700">
                When an account is shared with you, you will be able to view the
                invitation here.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </MainContainer>
  );
}
