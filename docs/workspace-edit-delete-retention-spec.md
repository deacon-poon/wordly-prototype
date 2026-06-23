# Workspace — Edit, Delete & Data Retention (Design Spec)

**Status:** Draft · **Scope:** net-new design (no Angular portal equivalent) ·
**Surface:** `/workspace/settings` (`src/app/workspace/settings/page.tsx`)
**PRD basis:** `src/documentation/wordly-workspaces.md`
(Admin user stories `:61–79`, permissions `:105–117`, edge case `:162`, retention `:75–77`)

> This is the spec that backs task #10. Edit + Delete + Retention are all
> **net-new** — the deployed Angular portal has no workspace edit/delete screen,
> so this defines behavior rather than mirroring an existing one. UI is built on
> the same `MainContainer` + `wordly-form` anatomy as the aligned workspace pages.

---

## 1. Who can do this (permissions)

| Action                         | Admin | Editor | Viewer |
| ------------------------------ | ----- | ------ | ------ |
| Edit workspace name / settings | ✅    | ❌     | ❌     |
| Delete workspace               | ✅    | ❌     | ❌     |

- Per the PRD, "Edit Workspace name" and "Delete workspaces" are **Admin-only**
  user stories (`:69`, `:75`). Editors/Viewers should not see the affordance.
- A user's **personal "My Workspace"** (`:131`) is **not deletable** — it is the
  migration fallback that preserves the legacy single-user experience.

---

## 2. Edit Workspace

**Entry:** sidebar → _Workspace Admin → Workspace Settings_, or the workspace
selector → _Workspace Settings_.

**General section**

- **Workspace name** — single text field.
  - Required; **max 50 characters** (mirrors the create-workspace dialog rule).
  - Live character counter; inline error when empty or over the limit.
  - **Save changes** enabled only when the value is dirty _and_ valid.
  - **Cancel** reverts to the current name.
- Saving updates the active workspace label everywhere it appears (selector, nav,
  breadcrumbs). Mock: toast "Workspace name updated."

**Future fields** (out of scope for the first pass, noted for layout): default
account / session defaults are their own page (`/workspace/defaults`); custom
fields are their own page. Keep Settings focused on identity + lifecycle.

---

## 3. Delete Workspace

**Placement:** a **Danger Zone** card at the bottom of Settings — red border,
`AlertTriangle`, separated from the General section.

### 3.1 Pre-flight guards (checked before the confirm dialog opens)

1. **Shared-account guard** (PRD `:162`). If this workspace **owns an account
   that is shared with another workspace** and that other workspace has **no other
   account**, deletion is **blocked**. Show:
   > "_{Workspace}_ owns an account shared with other workspaces. Reassign or set
   > another default account for those workspaces before deleting."
   > The Delete button is disabled (or opens an explanatory dialog instead of the
   > confirm dialog), listing the blocking account(s)/workspace(s).
2. **Personal workspace guard.** "My Workspace" cannot be deleted (button hidden).
3. **Last-admin / sole-workspace** considerations — flagged as an open question
   (§6).

### 3.2 Confirm flow (type-to-confirm)

1. Click **Delete workspace** → destructive `ConfirmationDialog`.
2. Dialog states the consequence and the **retention** outcome (see §4):
   > "This schedules _{Workspace}_ and all of its sessions, transcripts, and
   > glossaries for deletion. Data is recoverable for **90 days**, after which it
   > is permanently deleted."
3. User must **type the exact workspace name** to enable the confirm button.
4. Confirm → workspace enters the **Pending deletion** state (§4); user is routed
   to `/dashboard` (or the next available workspace) with a toast:
   > "_{Workspace}_ scheduled for deletion — recoverable for 90 days."

### 3.3 What is deleted

Per PRD `:76`: the workspace plus its **Sessions, Transcripts, Glossaries**, and
its settings (session defaults, custom fields), and user→workspace assignments.
**Accounts are not deleted** — they belong to the Organization (`:133`) and are
unshared/reassigned, subject to the §3.1 guard.

---

## 4. Data Retention (90-day window)

PRD `:77`: "Retain workspace data for 90 days, then permanently delete."

**Lifecycle**

```
Active ──delete──▶ Pending deletion (Day 0–90) ──auto──▶ Permanently deleted
                          │
                          └── Restore (Admin / Org Admin) ──▶ Active
```

- **Pending deletion** — the workspace is hidden from normal use (not in the
  selector list by default), data retained and **recoverable**. Surfaced to Org
  Admins in a "Recently deleted" list with the **purge date** and a **Restore**
  action.
- **Day 90** — data is **permanently and irreversibly** purged.
- **Messaging must never imply instant hard delete.** Today's copy
  ("permanently deletes … cannot be undone") is **wrong for the 90-day model** and
  must change to the "recoverable for 90 days, then permanent" framing (§3.2).

**Copy to change in the current build:**

- Danger-zone description, confirm-dialog description, and the post-delete toast →
  adopt the recovery-window language above.

---

## 5. States summary

| State                         | Selector                    | Data     | Reversible? |
| ----------------------------- | --------------------------- | -------- | ----------- |
| Active                        | listed                      | live     | n/a         |
| Pending deletion (Day 0–90)   | hidden / "Recently deleted" | retained | ✅ Restore  |
| Permanently deleted (Day 90+) | gone                        | purged   | ❌          |

---

## 6. Open questions

1. **Restore UX location** — Org-level "Recently deleted" list vs. a per-user
   surface? (Org Admin owns cross-workspace views per PRD `:39`.)
2. **Sole workspace** — if a user would be left with no workspace, do we block, or
   fall back to their personal "My Workspace"?
3. **Shared-account guard messaging** — block hard, or offer inline reassignment?
4. **Who can restore** — workspace Admin within 90 days, or Org Admin only?
5. **Notification** — email the billing/Org Admin when a workspace is scheduled
   for deletion and again before the 90-day purge?

---

## 7. Implementation status vs. this spec

| Piece                                      | Built                  | Gap                                  |
| ------------------------------------------ | ---------------------- | ------------------------------------ |
| Edit name (validate, save/cancel, counter) | ✅                     | —                                    |
| Danger Zone + type-to-confirm delete       | ✅                     | copy implies instant delete          |
| 90-day retention messaging                 | ❌                     | adopt recovery-window copy (§3.2/§4) |
| Shared-account guard                       | ❌                     | pre-flight block (§3.1)              |
| Pending-deletion / Restore                 | ❌                     | net-new state + list (§4)            |
| Admin-only gating                          | ❌ (mock shows always) | gate affordance by role              |
