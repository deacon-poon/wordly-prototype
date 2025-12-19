# Wordly Events - Gap Analysis

**Date:** December 18, 2025  
**Comparing:** Current Prototype Implementation vs. Updated Spec v2.0

---

## Summary

| Category         | Implemented | Partial | Missing | Total  |
| ---------------- | ----------- | ------- | ------- | ------ |
| Core UI/UX       | 10          | 4       | 6       | 20     |
| Event Management | 4           | 2       | 5       | 11     |
| Bulk Upload      | 3           | 2       | 4       | 9      |
| Access Control   | 1           | 1       | 3       | 5      |
| Validation       | 0           | 1       | 4       | 5      |
| **Total**        | **18**      | **10**  | **22**  | **50** |

**Implementation Status:** ~36% Complete (Feature Prototype Level)

---

## Terminology Update ✅

**RESOLVED:** Terminology has been updated from "Stage" to "Location" throughout the codebase.

| Updated Term                      | Status                         |
| --------------------------------- | ------------------------------ |
| `Location` (interface, variables) | ✅ Complete                    |
| `locationSessionId`               | ✅ Complete                    |
| `location.passcode`               | ✅ Complete                    |
| `LocationAccordion.tsx`           | ✅ Renamed from StageAccordion |

**Updated files:**

- ✅ `src/app/events/page.tsx`
- ✅ `src/app/events/[eventId]/page.tsx`
- ✅ `src/components/events/LocationAccordion.tsx` (renamed)
- ✅ `src/components/events/PresentationEditDrawer.tsx`
- ✅ `src/components/events/SessionEditDrawer.tsx`
- ✅ `src/components/WaysToJoinModal.tsx`

---

## Feature-by-Feature Gap Analysis

### 1. Events List Page (`/events`)

| Feature                                      | Status         | Notes                                      |
| -------------------------------------------- | -------------- | ------------------------------------------ |
| List of Events                               | ✅ Implemented | Working with mock data                     |
| Active/Upcoming/Past/All tabs                | ✅ Implemented | Correctly filters by date                  |
| Status badges (Live now, Starting in X days) | ✅ Implemented | Good UX                                    |
| Event cards with metadata                    | ✅ Implemented | Shows dates, location count, session count |
| Location preview chips                       | ❌ Removed     | Removed per UX feedback (not actionable)   |
| Public summary URL link                      | ✅ Implemented | External link icon                         |
| "Add Event" button                           | ✅ Implemented | Opens upload modal                         |

**Gaps:**
| Missing Feature | Priority | Spec Reference |
|-----------------|----------|----------------|
| "Create Event manually" option | 🔴 High | User Story: Create empty event |
| Keycloak role check (`transcripts-prohibited`) | 🟡 Medium | Hide for users with this role |

---

### 2. Event Creation Flow

#### 2a. Option 1: Create from Spreadsheet

| Feature                         | Status         | Notes                              |
| ------------------------------- | -------------- | ---------------------------------- |
| Upload Schedule Modal           | ✅ Implemented | File upload with timezone          |
| Download CSV template           | ✅ Implemented | Provides example format            |
| Event Settings Modal            | ✅ Implemented | Name, glossary, account, languages |
| File type validation (CSV/XLSX) | ✅ Implemented | Checks MIME type                   |

**Gaps:**
| Missing Feature | Priority | Spec Reference |
|-----------------|----------|----------------|
| Timezone column per session | 🔴 High | CSV: "Location, Title, Presenter, Date, Start Time, End Time, **Timezone**" |
| CSV uses "Room Name" not "Location" | 🟡 Medium | Terminology alignment |
| Error display with tap/hover per cell | 🔴 High | "Improve how we show what the error is for each red cell" |
| Schedule conflict validation | 🔴 High | "Ensure end times are always before next start time" |
| Account minutes check | 🟡 Medium | "Check minutes of account selected during Event creation" |

#### 2b. Option 2: Create Manually

| Feature                           | Status             | Notes                        |
| --------------------------------- | ------------------ | ---------------------------- |
| Create empty event                | ❌ Not Implemented | No option in current flow    |
| Add locations one at a time       | ❌ Not Implemented | No UI for this               |
| Add sessions to location          | ❌ Not Implemented | No UI for this               |
| Choice between spreadsheet/manual | ❌ Not Implemented | Only spreadsheet flow exists |

---

### 3. Event Detail Page (`/events/[eventId]`)

| Feature                                          | Status         | Notes                    |
| ------------------------------------------------ | -------------- | ------------------------ |
| Date-first hierarchy (Date → Location → Session) | ✅ Implemented | Matches spec             |
| Collapsible date sections                        | ✅ Implemented | Auto-expands today       |
| Location accordion within dates                  | ✅ Implemented | Shows presentations      |
| Active/Upcoming/Past/All tabs                    | ✅ Implemented | Filters by date          |
| Session ID & Passcode display                    | ✅ Implemented | With copy buttons        |
| "Links to Join" button                           | ✅ Implemented | Opens WaysToJoin modal   |
| "Start Location" button                          | ✅ Implemented | Disabled for past events |
| Presentation edit side panel                     | ✅ Implemented | Resizable panel          |
| "Download for AV"                                | ✅ Implemented | Generates CSV            |
| Public Summary URL link                          | ✅ Implemented | Conditional display      |

**Gaps:**
| Missing Feature | Priority | Spec Reference |
|-----------------|----------|----------------|
| PDF download (not just CSV) | 🟡 Medium | "PDF spreadsheet with Present app links" |
| Rename location | 🟡 Medium | Location actions: "change the name" |
| Delete location | 🟡 Medium | Location actions: "delete the location" |
| Add new location | 🟡 Medium | Location actions: "add another location" |
| Add session to location | 🟡 Medium | "Add sessions one at a time" |
| Bulk replace while keeping QRs | 🔴 High | "Replace full event while keeping QRs the same" |

---

### 4. Presentation Edit Drawer

| Feature                        | Status         | Notes                 |
| ------------------------------ | -------------- | --------------------- |
| Title field                    | ✅ Implemented | Required              |
| Presenters field               | ✅ Implemented | Comma-separated       |
| Date field                     | ✅ Implemented | Date picker           |
| Start Time / End Time          | ✅ Implemented | Time pickers          |
| Languages selection (up to 8)  | ✅ Implemented | Checkbox grid         |
| Location display (read-only)   | ✅ Implemented | Shows location name   |
| Session ID (read-only)         | ✅ Implemented | Room-level            |
| Passcode (read-only)           | ✅ Implemented | Room-level            |
| Read-only for started sessions | ✅ Implemented | Shows warning message |

**Gaps:**
| Missing Feature | Priority | Spec Reference |
|-----------------|----------|----------------|
| Timezone field | 🟡 Medium | "Timezone" as editable field per session |
| Location dropdown (to move session) | 🟢 Low | "Allow changing the Location field" |

**Fields correctly excluded (per spec):**

- ✅ Session ID (read-only, not editable)
- ✅ Passcode (read-only, not editable)
- ✅ Duration (derived from start/end, not shown)
- ✅ Pinned (not applicable to events)

---

### 5. Event Settings Modal (Defaults)

| Feature                     | Status         | Notes                    |
| --------------------------- | -------------- | ------------------------ |
| Event Name                  | ✅ Implemented | Required field           |
| Glossary selector           | ✅ Implemented | Dropdown with options    |
| Account selector            | ✅ Implemented | Dropdown with options    |
| Publish Summary Publicly    | ✅ Implemented | Yes/No dropdown          |
| Starting Presenter Language | ✅ Implemented | Language dropdown        |
| Other Presenter Languages   | ✅ Implemented | Multi-select with badges |
| Custom Fields               | ✅ Implemented | Dynamic based on config  |

**Gaps:**
| Missing Feature | Priority | Spec Reference |
|-----------------|----------|----------------|
| Access Type (open vs passcode) | 🟡 Medium | "Access (open or require attendee passcode)" |
| Transcript settings | 🟡 Medium | "Transcript" in defaults list |

---

### 6. Access Control & Validation

| Feature                    | Status         | Notes                           |
| -------------------------- | -------------- | ------------------------------- |
| Past events non-editable   | ✅ Implemented | Buttons disabled, tooltip shown |
| Started sessions read-only | ✅ Implemented | Edit form shows warning         |

**Gaps:**
| Missing Feature | Priority | Spec Reference |
|-----------------|----------|----------------|
| Schedule-based run restriction | 🔴 High | "Sessions only run at scheduled time" |
| Error: "This Event is not scheduled for this time" | 🔴 High | Present app enforcement |
| Keycloak `transcripts-prohibited` role | 🟡 Medium | Hide Events page |
| Account minutes validation | 🟡 Medium | Prevent event creation if insufficient |

---

### 7. Accessibility & UX

| Feature               | Status     | Notes                                |
| --------------------- | ---------- | ------------------------------------ |
| Keyboard navigation   | ⚠️ Partial | Standard React behavior, needs audit |
| Screen reader support | ⚠️ Partial | Labels present, needs WCAG audit     |
| Focus management      | ⚠️ Partial | Default behavior                     |

**Gaps:**
| Missing Feature | Priority | Spec Reference |
|-----------------|----------|----------------|
| Full WCAG compliance audit | 🟡 Medium | "screen readable, navigable" |
| Keyboard navigation verification | 🟡 Medium | "navigate using keyboard navigation" |

---

### 8. Data Model Alignment

#### Current Interface (in code):

```typescript
interface Location {
  id: string;
  name: string;
  sessionCount: number;
  locationSessionId: string; // ✅ Updated
  passcode: string;
  sessions: Session[];
}

interface Session {
  id: string;
  title: string;
  presenters: string[];
  scheduledDate: string;
  scheduledStart: string;
  endTime: string;
  status: "pending" | "active" | "completed" | "skipped";
}
```

#### Spec Interface (required):

```typescript
interface Location {
  id: string;
  eventId: string;
  name: string;
  description?: string;
  locationSessionId: string;
  passcode: string;
  mobileId: string; // ❌ Missing
  sessions: Session[];
  createdAt: Date; // ❌ Missing
  updatedAt: Date; // ❌ Missing
}

interface Session {
  id: string;
  title: string;
  presenters: string[];
  accountId: string; // ❌ Missing
  eventId?: string; // ❌ Missing
  locationId?: string; // ❌ Missing
  scheduledStart: Date; // Type mismatch (string vs Date)
  endTime: Date; // Type mismatch (string vs Date)
  timezone: string; // ❌ Missing
  previousSessionId?: string; // ❌ Missing
  nextSessionId?: string; // ❌ Missing
  chainStatus?: string; // ❌ Missing
}
```

---

### 9. Present App Integration

| Feature            | Status         | Notes                                   |
| ------------------ | -------------- | --------------------------------------- |
| Ways to Join Modal | ✅ Implemented | Opens with location info                |
| QR Code display    | ⚠️ Placeholder | Component exists, needs real generation |

**Gaps (Present App - Out of Scope for Portal):**
| Missing Feature | Priority | Spec Reference |
|-----------------|----------|----------------|
| Pre-populate "Enter Name" with Location name | 🟡 Medium | Present app change |
| Schedule-based session transitions | 🔴 High | Present app change |
| 120-second silence detection | 🔴 High | Present app change |
| Display Location Session ID | 🔴 High | Present app change |

---

### 10. CSV Template Format

#### Current Template:

```csv
Event Name,Room Name,Session Title,Presenters,Start Date,Start Time,End Time
```

#### Required Template (per spec):

```csv
Location,Title,Presenter,Date,Start Time,End Time,Timezone
```

**Differences:**
| Current | Spec | Action |
|---------|------|--------|
| `Event Name` | Not in per-row data | Remove (event name set separately) |
| `Room Name` | `Location` | Rename column |
| `Session Title` | `Title` | Rename column |
| `Presenters` | `Presenter` | Singular name, but still supports multiple |
| `Start Date` | `Date` | Rename column |
| Missing | `Timezone` | Add column |

---

## Priority Implementation Roadmap

### Phase 1: Critical Gaps (Week 1-2)

1. **Terminology Update** 🔴

   - ✅ Renamed "Stage" → "Location" throughout
   - Update all interfaces and components

2. **CSV Template Update** 🔴

   - Add Timezone column
   - Update column names per spec
   - Add schedule conflict validation

3. **Error Display Improvement** 🔴

   - Tap/hover for error info per cell
   - Clear error messages for conflicts

4. **Account Minutes Validation** 🟡
   - Check before event creation
   - Show warning if insufficient

### Phase 2: Feature Gaps (Week 3-4)

5. **Manual Event Creation** 🔴

   - Add "Create Event manually" option
   - Build add location UI
   - Build add session UI

6. **Location Management** 🟡

   - Rename location
   - Delete location
   - Add new location

7. **Bulk Replace with QR Preservation** 🔴
   - Re-upload while keeping Location QR codes

### Phase 3: Enhancement Gaps (Week 5-6)

8. **Access Type Setting** 🟡

   - Add open/passcode option to event settings

9. **Timezone in Session Edit** 🟡

   - Add timezone field to presentation edit

10. **PDF Export** 🟡
    - Add PDF generation for AV download

### Phase 4: Integration & Compliance (Week 7-8)

11. **Keycloak Role Check** 🟡

    - Hide Events for `transcripts-prohibited` users

12. **WCAG Compliance Audit** 🟡

    - Keyboard navigation verification
    - Screen reader testing

13. **Schedule Enforcement** 🔴
    - Backend integration for time-based restrictions

---

## Files to Create/Modify

### New Components Needed:

- ✅ `src/components/events/LocationAccordion.tsx` (renamed from StageAccordion)
- `src/components/events/AddLocationModal.tsx`
- `src/components/events/AddSessionModal.tsx`
- `src/components/events/ManualEventCreationFlow.tsx`
- `src/components/events/BulkUploadErrorDisplay.tsx`

### Components to Modify:

- `src/app/events/page.tsx` - Add manual creation option
- `src/app/events/[eventId]/page.tsx` - Terminology + location management
- `src/components/events/UploadScheduleModal.tsx` - CSV format + validation
- `src/components/events/EventSettingsModal.tsx` - Add access type
- `src/components/events/PresentationEditDrawer.tsx` - Add timezone

### New Utilities Needed:

- `src/utils/events/schedule-validator.ts` - Conflict detection
- `src/utils/events/account-minutes.ts` - Minutes calculation
- `src/utils/events/pdf-generator.ts` - PDF export

---

## Notes

1. **Mock Data:** Current implementation uses mock data. Real API integration will be Phase 2 of overall project.

2. **Present/Attend Apps:** Changes to Present and Attend apps are out of scope for Portal development but are critical for full feature functionality.

3. **Backend Dependencies:** Schedule enforcement and session chaining require backend API changes.

---

**Document Status:** Gap Analysis Complete  
**Next Steps:** Prioritize and begin Phase 1 implementation  
**Review Date:** December 18, 2025
