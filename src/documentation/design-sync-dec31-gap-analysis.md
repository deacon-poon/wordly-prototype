# Design Sync Gap Analysis - Dec 31, 2025

## Summary of Key Decisions

| Topic | Decision | Current Status |
|-------|----------|----------------|
| Event Creation Flow | Create blank event → event page → manual add OR bulk upload | ✅ Implemented |
| Bulk Upload Button | Next to "Add Location" at event level | ✅ Implemented |
| Add Session Button | At bottom of session list (not empty state only) | ⚠️ Partial |
| Unified Session Panel | Side panel for both add and edit | ✅ Implemented |
| **Event Defaults** | **ELIMINATE** - rely on session defaults instead | ❌ Not implemented |
| Session Form | Hide irrelevant fields (Session ID, Passcode) | ⚠️ Shown but read-only |
| Error Display | Pastel pink or remove row color | ❌ Needs update |
| Branding Colors | Use Brand Blue 500 instead of action teal | ❌ Needs update |
| Post-Creation Edits | Only event name editable | ❌ Not enforced |
| QR Code Info | Text explaining QR preservation on re-upload | ❌ Missing |
| Start Location Link | Link to join.wordly.ai | ❌ Missing |
| Public Summary Page | Show schedule for unrun sessions | ⚠️ Partial |

---

## Detailed Gap Analysis

### 1. ❌ ELIMINATE Event Defaults (HIGH PRIORITY)

**Decision:** Remove event-level defaults entirely. Rely on session defaults from account settings.

**Current State:**
- `EventDetailsForm` captures many "event defaults": timezone, glossary, account, access type, publish transcripts, starting language, other languages
- `ManualEventWizard` uses full `EventDetailsForm` with all these fields

**Required Changes:**
- Simplify event creation to capture ONLY: **Event Name**, **Start Date**, **End Date**, **Description** (optional)
- Remove from event form: timezone, glossary, account, access type, publish settings, languages
- Bulk upload modal should inherit from **session defaults** (account-level)
- Bulk upload modal should remember changes within that event for subsequent uploads

### 2. ⚠️ Add Session Button Placement

**Decision:** "Add Session" should appear at the **bottom** of the session list within each location.

**Current State:**
- Empty locations show "Add Session" button in empty state ✅
- Locations WITH sessions only have "Add Session" in dropdown menu ❌

**Required Change:**
- Add an "Add Session" button at the bottom of the session list (always visible when location is expanded)

### 3. ❌ Error Display in Bulk Upload

**Decision:** Make errors more prominent - either remove row color or use very pastel pink.

**Current State:**
- Uses pink/red row highlighting that obscures the actual error cell
- Error indicator competes visually with row color

**Required Changes:**
- Remove row background color OR use very light pastel pink (e.g., `bg-red-50`)
- Make error cell border/highlight more prominent
- Consider separating errors and valid rows into sections

### 4. ❌ Branding Colors

**Decision:** Use Brand Blue 500 (logo color) instead of action teal throughout.

**Current State:**
- Uses `primary-teal-600`, `primary-teal-700`, etc. throughout
- Buttons, icons, accents all use teal

**Required Changes:**
- Audit all teal color usage
- Replace with brand blue (verify accessible contrast ratios)
- Update tailwind config if needed

### 5. ⚠️ Session Form Simplification

**Decision:** Hide irrelevant fields in event context (Session ID, Passcode are location-level, not needed in session form).

**Current State:**
- `SessionForm` shows Session ID and Passcode as read-only fields
- These are confusing because they're location-level, not session-level

**Required Changes:**
- Remove Session ID and Passcode display from `SessionForm`
- Consider collapsing advanced fields (timezone, languages) by default
- Graham to send mockups for minimalistic session form

### 6. ❌ Post-Creation Event Edit Restrictions

**Decision:** After creation, only **event name** should be editable. Other defaults can't be safely changed.

**Current State:**
- No edit functionality exists for event details post-creation
- No display of "event defaults" on event page

**Required Changes:**
- Add ability to edit event name
- Display event defaults as read-only on event page (so users know what they are)
- Explicitly prevent editing of other defaults

### 7. ❌ QR Code Preservation Info Text

**Decision:** Add text in upload modal explaining that locations matching the upload retain QR codes and session IDs.

**Current State:**
- No such explanation exists in `UploadScheduleModal`

**Required Change:**
- Add info callout: "Locations with matching names will retain their existing QR codes and session IDs."

### 8. ❌ Start Location Link

**Decision:** Link "Start Location" button to join.wordly.ai.

**Current State:**
- Button opens the present URL but may not be correct

**Required Change:**
- Verify the URL pattern is `https://join.wordly.ai/{sessionId}`

### 9. ⚠️ Public Summary Page Updates

**Decisions:**
- Move public summary link up next to "3 locations, 12 presentations"
- Show schedule for sessions that haven't run yet (title, time, speaker - no summary)
- Remove unfeasible sections (unified tags, speaker info)

**Current State:**
- Link placement needs verification
- Sessions without summaries need proper display state

---

## Action Items by Priority

### HIGH Priority
1. **Simplify Event Creation Form**
   - Remove event-level defaults (timezone, glossary, account, etc.)
   - Keep only: Name, Start Date, End Date, Description
   
2. **Update Bulk Upload to Use Session Defaults**
   - Remove event defaults from modal
   - Inherit from account's session defaults
   - Remember changes within event context

### MEDIUM Priority
3. **Add Session Button at Bottom of List**
   - Show "Add Session" button below sessions in expanded location

4. **Error Display in Bulk Upload**
   - Reduce/remove row color
   - Make error cells more prominent

5. **Session Form Cleanup**
   - Remove Session ID and Passcode display
   - Consider collapsing advanced fields

### LOWER Priority
6. **Branding Color Update** (coordinate with design)
   - Replace teal with brand blue
   - Verify accessibility

7. **Info Text Updates**
   - Add QR preservation explanation to upload modal
   - Verify Start Location URL

8. **Event Edit Restrictions**
   - Add event name edit capability
   - Display defaults as read-only

---

## Files Requiring Changes

| File | Changes Needed |
|------|----------------|
| `EventDetailsForm.tsx` | Remove most fields, keep Name/Dates/Description |
| `ManualEventWizard.tsx` | Update to use simplified form |
| `forms/types.ts` | Update `EventDetailsFormData` type |
| `UploadScheduleModal.tsx` | Add QR info text, inherit session defaults |
| `BulkUploadReviewModal.tsx` | Update error row styling |
| `LocationAccordion.tsx` | Add "Add Session" at bottom of session list |
| `SessionForm.tsx` | Remove Session ID, Passcode fields |
| `SessionPanel.tsx` | Update to use simplified form |
| `tailwind.config.js` | Add brand blue colors (if not present) |
| Multiple components | Replace teal with brand blue |

---

## Questions to Clarify

1. **Session Defaults Inheritance**: Where do session defaults come from? Is there a settings page we need to integrate with?

2. **Brand Blue Values**: What are the exact hex values for Brand Blue 500 and related shades?

3. **QR Preservation Logic**: Is location name matching case-sensitive? What about partial matches?

4. **Bulk Upload Memory**: How should we persist "remembered" defaults within an event context?
