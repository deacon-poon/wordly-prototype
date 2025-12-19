# Wordly Events Feature - Technical Specification

**Version:** 2.0  
**Date:** December 18, 2025  
**Status:** Ready for Implementation

---

## Goal

Launch a dedicated **Events** product that provides organized, session-level transcription and summarization for customers running multi-session conferences.

Specifically, we must segment the Wordly transcription process to ensure that each individual session generates its own clean, standalone transcript and summary, thereby delivering relevant, focused content to attendees instead of a consolidated, confusing file.

---

## Problem

At conference events, typically they start Wordly in the morning and run one session all day. There are multiple sessions happening in that one Location, and at the end of the day we're generating one transcript. This means a lot of potentially unrelated content getting crammed together into one transcript (and one summary).

---

## Designs

- **Prototype:** https://wordly-prototype.vercel.app/events
- **Events page wireframe:** https://www.figma.com/design/0JDdb7soumAMKvrwjDFwCR/multiple-presentations-within-a-day?node-id=108-95
- **Flow chart:** https://www.figma.com/board/OcCAVykplJD2MjUGx4ve3b/Event-Summaries-Flow?node-id=0-1

---

## User Stories

### As an **Event Organizer**, I want to:

- **Upload my schedule** of sessions for my event and have Wordly create sessions automatically. The bulk upload spreadsheet includes:

  - Location
  - Title
  - Presenter
  - Date
  - Start Time
  - End Time
  - Timezone

- **Bulk upload to replace** the full event while keeping the QRs the same for the same location names

- **Set event-level defaults** for:

  - Event Name
  - Glossary
  - Accounts
  - Transcript
  - Access (open or require attendee passcode)
  - Starting presenter language
  - Other presenter languages
  - Custom fields

- **Create an empty event** and add locations and sessions one at a time:

  - Option during Event creation: "Create Event from spreadsheet" or "Create Event manually"
  - After that, add a location
  - For each location, add sessions

- **Location actions:**

  - Change the name
  - Delete the location
  - Add another location

- **See my session schedule** in an organized way in the portal

- **Get individual transcripts** (and artifacts) from each session with relevant titles and presenters based on the schedule

- **Ensure all workspace members** can see my event

- **View/edit session details** for upcoming sessions in my schedule. All the usual fields in the session details, except:

  - Session ID
  - Passcode
  - Duration
  - Pinned

  And with the new fields of:

  - End Time
  - Location
  - Timezone

### As an **AV Technician**, I want to:

- Start the present app for a Location at the start of the day and not have to manually control when it stops and starts after that

---

## Solution

- Daisy-chain multiple sessions via event/Location grouping
- Create individual transcripts as usual, but now they are grouped by Location and event
- All day groupings of sessions can be started at, say, 8am and ended at 5pm, but it's actually multiple individual sessions running on a schedule
- Transcript and Summary artifacts don't need to be modified

The user creates an "Event" grouping that includes a bunch of sessions. They can use an updated bulk session upload tool to populate it. Furthermore, Events can be grouped by Location, and the associated sessions are all the sessions in that Location on a given day.

Then when the user starts the present app with the inclusive Session ID at 8am, and it starts the first session in the list, end that session at the `endTime` and start the second session at its `scheduledStart`, etc. This way we don't have to modify our sessions too much, just create a new `eventId` and `locationId` to group them by, and add `endTime` to know when to end a session.

Ideally, Present app automates everything and can manage the daisy-chaining of sessions in a Location.

### Grouping of Sessions

```
Event
└── Location
    └── Session
```

This design would have long term benefits as it would provide the architecture for auto-generating summaries for entire events and subsequently publishing those to an event summaries page, like SnapSight does.

---

## Architecture Overview

### Data Model Hierarchy

```
Organization
└── Workspace
    └── Event
        └── Location
            └── Session (multiple, daisy-chained)
```

### New Data Structures

#### Event Object

```typescript
interface Event {
  id: string;
  workspaceId: string;
  name: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  timezone: string; // Event timezone (e.g., "America/Los_Angeles")

  // Session buffer periods (in minutes)
  bufferBefore: number; // Default: 5 minutes
  bufferAfter: number; // Default: 5 minutes

  // Session defaults for all sessions in event
  defaults: {
    glossaryId?: string;
    accountId: string;
    publishTranscripts: boolean;
    accessType: "open" | "passcode"; // Access control
    startingLanguage: string;
    otherLanguages: string[];
    customFields: Record<string, any>;
  };

  locations: Location[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}
```

#### Location Object

```typescript
interface Location {
  id: string;
  eventId: string;
  name: string;
  description?: string;

  // Public-facing credentials for the location
  locationSessionId: string; // Location Session ID (e.g., "MAIN-AUD-2024")
  passcode: string; // Location passcode (e.g., "MA2024-8372-19")
  mobileId: string; // Mobile ID for mobile app access (e.g., "83721901")

  sessions: Session[];
  createdAt: Date;
  updatedAt: Date;
}
```

#### Updated Session Object

```typescript
interface Session {
  // Existing fields...
  id: string;
  title: string;
  presenters: string[]; // Support multiple presenters
  accountId: string;
  // ... other existing fields

  // New fields for Events
  eventId?: string;
  locationId?: string;
  scheduledStart: Date;
  endTime: Date;
  timezone: string;

  // Chaining
  previousSessionId?: string;
  nextSessionId?: string;

  // Status tracking
  chainStatus?: "pending" | "active" | "completed" | "skipped";
}
```

---

## Feature Requirements

### 1. Events Management Page (Portal)

The following fields are set as "session defaults" when specifying an event: Glossary, Account, whether to publish the transcripts publicly, starting language, other quick-select languages, custom fields. These can be edited at the session level later.

#### Page Shows

- List of Events
- Each event contains Locations
- Each Location is an accordion that expands to show a list of sessions
- Each session has the following details:
  - Title
  - Presenter(s)
  - Start Time
  - End Time
  - Location
  - Event
  - Way to edit general session settings (except for Pinned, Session ID, Passcode, Zoom)

#### Event Creation Flow

**Option 1: Create from Spreadsheet**

1. Event details form (name, defaults)
2. Upload CSV/spreadsheet
3. Sessions are auto-created and grouped by Location
4. Review and validate
5. Generate Location QR codes

**Option 2: Create Manually**

1. Create event with event-level session defaults
2. Add locations one at a time
3. For each location, add sessions
4. Review and generate QR codes

#### Bulk Upload UX

- Reuse existing Bulk Upload component
- Required fields: Location, Title, Presenter(s), Start Time, End Time, Timezone
- Improve error display: tap/hover to get info per red cell
- Error checking: sort start times per Location and ensure end times are always before next start time

**Spreadsheet Format (.csv/.xlsx)**

```csv
Location,Title,Presenter,Date,Start Time,End Time,Timezone
Main Hall,Opening Keynote,"John Smith, Jane Doe",2025-06-15,09:00,10:00,America/New_York
Main Hall,Product Update,Jane Doe,2025-06-15,10:00,11:00,America/New_York
Breakout A,Workshop 1,"Bob Johnson, Sarah Lee",2025-06-15,09:00,10:30,America/New_York
```

**Key Notes:**

- **Presenters column:** Supports multiple presenters (comma-separated, quoted if multiple)
- **Date:** Separate from Start Time for better date handling
- **Timezone:** Required per session to handle multi-timezone events

**Upload Processing**

1. Parse file
2. Group by Event → Location
3. Sort sessions by start time per location
4. Run validation checks
5. Create Event/Location/Session objects
6. Return success/error report

#### Account Minutes Check

Check the minutes of the account selected during Event creation to ensure it has enough for the entire event. If not, notify the user to select a different account or buy more minutes.

#### Location QR Code Generation

A new link (and subsequent QR code) needs to be generated for the Location, so attendees only have one QR code to scan for a Location. This QR code would open the appropriate session based on the time. From the user's perspective, all presentations in one Location have the same Session ID (even though internally, these are separate sessions with separate IDs).

#### Downloadable PDF

Users should be able to download a PDF spreadsheet that gives the links to open the Present web app for each Location.

#### Accessibility

It must be possible to navigate into each of these features using keyboard navigation.

#### Event Edit Restrictions

Events that have already completed are no longer editable.

#### Keycloak Role Restriction

The Events page and associated features do not appear for people with the `transcripts-prohibited` keycloak role.

---

### 2. Validation Rules

**Critical Validations (Must Pass)**

```typescript
// 1. No overlapping sessions in same location
function validateNoOverlaps(sessions: Session[]): ValidationResult {
  const sorted = sessions.sort((a, b) => a.scheduledStart - b.scheduledStart);

  for (let i = 0; i < sorted.length - 1; i++) {
    if (sorted[i].endTime > sorted[i + 1].scheduledStart) {
      return {
        valid: false,
        error: `Session "${sorted[i].title}" ends after "${
          sorted[i + 1].title
        }" starts`,
      };
    }
  }

  return { valid: true };
}

// 2. Sufficient account minutes
function validateAccountMinutes(event: Event): ValidationResult {
  const totalMinutes = calculateTotalEventMinutes(event);
  const availableMinutes = getAccountBalance(event.defaults.accountId);

  if (totalMinutes > availableMinutes) {
    return {
      valid: false,
      error: `Event requires ${totalMinutes} minutes but account only has ${availableMinutes} available`,
    };
  }

  return { valid: true };
}

// 3. Valid time ranges
function validateTimeRanges(session: Session): ValidationResult {
  if (session.endTime <= session.scheduledStart) {
    return {
      valid: false,
      error: `Session "${session.title}" end time must be after start time`,
    };
  }

  return { valid: true };
}
```

**Warning Validations (Show Warning, Allow Proceed)**

- Sessions with very short durations (< 5 minutes)
- Large gaps between sessions (> 2 hours)
- Sessions scheduled outside typical hours

---

### 3. Backend API Updates

#### New Endpoints

```typescript
// Events
POST   /api/v1/events
GET    /api/v1/events
GET    /api/v1/events/:id
PUT    /api/v1/events/:id
DELETE /api/v1/events/:id

// Locations
POST   /api/v1/events/:eventId/locations
GET    /api/v1/events/:eventId/locations
PUT    /api/v1/locations/:id
DELETE /api/v1/locations/:id

// Bulk operations
POST   /api/v1/events/bulk-upload
POST   /api/v1/events/:eventId/sessions/bulk

// Location public access
GET    /api/v1/locations/:locationSessionId/active-session
```

#### Endpoint Requirements

The endpoint would need to be updated to:

- Check if another session is linked to the one that is started
- If so, automatically end the current session when next session starts
- Start next session (automatically) based on `scheduledStart` date and time
- Autofill Presenter name, and run Present with an open mic
- Add `endTime` to session details
- If no additional sessions are scheduled, end session at the `endTime`, or when the presenter ends it manually

#### Session Chaining Logic

```typescript
interface SessionChainManager {
  /**
   * Start a session chain - called when presenter starts first session
   */
  startChain(locationId: string): Promise<void>;

  /**
   * Monitor active session and trigger transitions
   */
  monitorActiveSession(sessionId: string): Promise<void>;

  /**
   * Transition from current to next session
   */
  transitionSession(currentId: string, nextId: string): Promise<void>;

  /**
   * Handle end of chain
   */
  endChain(sessionId: string): Promise<void>;
}

// Implementation pseudo-code
class SessionChainService implements SessionChainManager {
  async startChain(locationId: string) {
    const location = await getLocationWithSessions(locationId);
    const firstSession = location.sessions[0];

    // Start first session
    await this.startSession(firstSession.id);

    // Schedule monitoring
    await this.monitorActiveSession(firstSession.id);
  }

  async monitorActiveSession(sessionId: string) {
    const session = await getSession(sessionId);

    // Set up timer to check for end time
    const checkInterval = setInterval(async () => {
      const now = new Date();

      // Check if end time reached
      if (now >= session.endTime) {
        clearInterval(checkInterval);

        if (session.nextSessionId) {
          await this.transitionSession(sessionId, session.nextSessionId);
        } else {
          await this.endChain(sessionId);
        }
      }

      // Also check if next session should start (override end time)
      const nextSession = await getSession(session.nextSessionId);
      if (nextSession && now >= nextSession.scheduledStart) {
        clearInterval(checkInterval);
        await this.transitionSession(sessionId, session.nextSessionId);
      }
    }, 5000); // Check every 5 seconds
  }

  async transitionSession(currentId: string, nextId: string) {
    // End current session
    await this.endSession(currentId);

    // Start next session
    const nextSession = await getSession(nextId);
    await this.startSession(nextId, {
      presenterName: nextSession.presenters[0],
      autoOpenMic: true,
    });

    // Continue monitoring
    await this.monitorActiveSession(nextId);
  }

  async endChain(sessionId: string) {
    await this.endSession(sessionId);
    // Cleanup, send notifications, etc.
  }
}
```

#### Database Schema Changes

```sql
-- Events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  timezone VARCHAR(50) NOT NULL,
  buffer_before INTEGER DEFAULT 5,
  buffer_after INTEGER DEFAULT 5,
  default_glossary_id UUID REFERENCES glossaries(id),
  default_account_id UUID NOT NULL REFERENCES accounts(id),
  default_publish_transcripts BOOLEAN DEFAULT false,
  default_access_type VARCHAR(20) DEFAULT 'open',
  default_starting_language VARCHAR(10),
  default_other_languages JSONB,
  default_custom_fields JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);

-- Locations table
CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  location_session_id VARCHAR(50) UNIQUE NOT NULL, -- Public-facing ID
  passcode VARCHAR(50),
  mobile_id VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Update sessions table
ALTER TABLE sessions ADD COLUMN event_id UUID REFERENCES events(id);
ALTER TABLE sessions ADD COLUMN location_id UUID REFERENCES locations(id);
ALTER TABLE sessions ADD COLUMN scheduled_start TIMESTAMP;
ALTER TABLE sessions ADD COLUMN end_time TIMESTAMP;
ALTER TABLE sessions ADD COLUMN timezone VARCHAR(50);
ALTER TABLE sessions ADD COLUMN previous_session_id UUID REFERENCES sessions(id);
ALTER TABLE sessions ADD COLUMN next_session_id UUID REFERENCES sessions(id);
ALTER TABLE sessions ADD COLUMN chain_status VARCHAR(20);

-- Indexes for performance
CREATE INDEX idx_sessions_location_id ON sessions(location_id);
CREATE INDEX idx_sessions_event_id ON sessions(event_id);
CREATE INDEX idx_locations_event_id ON locations(event_id);
CREATE INDEX idx_sessions_scheduled_start ON sessions(scheduled_start);
```

---

### 4. Present App Updates

#### Key Changes

**On Launch**

1. Check if Session ID is actually a Location Session ID
2. If yes, determine current active session or next scheduled session
3. Load appropriate session
4. Display Location Session ID (not individual session ID)
5. Pre-populate "Enter Name" field with the Location name

**Time-Based Restrictions**

User may only run these Events sessions at the scheduled time. Trying to run them outside the schedule will return an error response along the lines of "This Event is not scheduled for this time. Please try again at the scheduled time or edit the Event schedule."

**Intelligent Session Transition Logic**

The Present app needs to intelligently end the running session around the `endTime` and automatically start the next session at the next `scheduledStart` time. The logic should be:

- If the session…
  - Has an `endTime` ≤ current time
  - OR current time is ≤ 5 minutes before the next session `startTime` AND transcript has not yet split (to account for cases where they don't build in a gap between sessions)
- AND There is a silence of at least 120 seconds
- THEN split and start the next session
- At the scheduled `startTime`, if the session has not been split since the previous session `startTime`, split it. (This accounts for cases where there's no pause in the audio.)
- All of the above should work reliably even if there are temporary internet issues at the four exact moments when endTime = currentTime, currentTime = 5 minutes before the next startTime, time since the last speech bubble = 120 seconds, and at startTime

**UI Updates Needed**

```typescript
// Display location ID instead of session ID
<SessionHeader>
  <SessionId>{location.locationSessionId}</SessionId>
  {nextSession && (
    <NextSession>
      Next: {nextSession.title} at {formatTime(nextSession.scheduledStart)}
    </NextSession>
  )}
</SessionHeader>

// Transition notification
<TransitionModal show={isTransitioning}>
  Ending current session and starting:
  <h2>{nextSession.title}</h2>
  <p>Presenter: {nextSession.presenters.join(', ')}</p>
</TransitionModal>
```

#### Auto-transition Flow

```typescript
interface PresentAppSessionManager {
  currentSession: Session;
  nextSession?: Session;
  transitionTimer?: NodeJS.Timeout;
  lastSpeechTimestamp: Date;

  async startLocationSession(locationSessionId: string) {
    // Get current or next session for location
    const activeSession = await api.getLocationActiveSession(locationSessionId);

    if (activeSession) {
      this.loadSession(activeSession);
      this.scheduleTransition(activeSession);
    } else {
      // Show error - not scheduled for this time
      this.showScheduleError();
    }
  }

  scheduleTransition(session: Session) {
    if (!session.nextSessionId) return;

    const nextSession = await api.getSession(session.nextSessionId);

    // Monitor for transition conditions
    this.monitorTransitionConditions(session, nextSession);
  }

  monitorTransitionConditions(currentSession: Session, nextSession: Session) {
    const checkInterval = setInterval(async () => {
      const now = new Date();
      const silenceDuration = now.getTime() - this.lastSpeechTimestamp.getTime();
      const silenceThreshold = 120 * 1000; // 120 seconds

      const isAfterEndTime = now >= currentSession.endTime;
      const isNearNextStart = nextSession &&
        (nextSession.scheduledStart.getTime() - now.getTime()) <= 5 * 60 * 1000;

      // Check transition conditions
      if ((isAfterEndTime || isNearNextStart) && silenceDuration >= silenceThreshold) {
        clearInterval(checkInterval);
        await this.executeTransition(nextSession.id);
      }

      // Hard cut at next session start time
      if (nextSession && now >= nextSession.scheduledStart) {
        clearInterval(checkInterval);
        await this.executeTransition(nextSession.id);
      }
    }, 5000);
  }

  async executeTransition(nextSessionId: string) {
    // Show transition UI
    this.showTransitionNotification();

    // End current session
    await this.endCurrentSession();

    // Load next session
    const nextSession = await api.getSession(nextSessionId);
    await this.startSession(nextSession, { autoOpenMic: true });

    // Schedule next transition if exists
    if (nextSession.nextSessionId) {
      this.scheduleTransition(nextSession);
    }
  }
}
```

---

### 5. Attend App Updates

#### Key Changes

**On Join**

1. Parse Session ID (might be Location Session ID)
2. Resolve to current active session
3. Auto-switch to next session when transition occurs

**Display**

- Display the Session ID for the Location (instead of the session's Session ID) at the top of the screen
- Refresh at the start of a new presentation to show only the text for that presentation

**Session Switching**

- Detect when backend switches sessions
- Seamlessly reconnect to new session stream
- Show brief "Switching presentations..." message
- Maintain translation language selection across transitions

```typescript
interface AttendAppSessionManager {
  locationSessionId: string;
  currentSessionId: string;
  websocket: WebSocket;

  async joinLocation(locationSessionId: string) {
    this.locationSessionId = locationSessionId;

    // Get current active session
    const activeSession = await api.getLocationActiveSession(locationSessionId);

    if (activeSession) {
      await this.connectToSession(activeSession.id);
    } else {
      this.showWaitingScreen();
    }

    // Listen for session changes
    this.listenForTransitions();
  }

  listenForTransitions() {
    this.websocket.on('session-transition', async (data) => {
      const { newSessionId, sessionTitle } = data;

      // Show transition message
      this.showTransitionMessage(`Now starting: ${sessionTitle}`);

      // Disconnect from current
      await this.disconnectFromSession(this.currentSessionId);

      // Connect to new - this refreshes to show only new session text
      await this.connectToSession(newSessionId);
    });
  }

  async connectToSession(sessionId: string) {
    this.currentSessionId = sessionId;

    // Maintain user's language preference
    const language = this.getUserLanguagePreference();

    // Connect to translation stream
    await this.connectTranslationStream(sessionId, language);

    // Update UI
    this.updateSessionInfo();
  }
}
```

---

## Edge Cases & Handling

### 1. Gaps Between Sessions (Breaks)

**Scenario:** End time is 12:00 PM, next session starts at 1:00 PM (lunch break)

**Per discussion:** We need to determine whether to follow the schedule strictly or try to listen to whether there's audio and slice logically based on the schedule. Slicing logically is more complex, but likely also necessary.

**Solution:**

```typescript
// During gap, session is ended but location remains "open"
// Attend app shows break screen
<BreakScreen>
  <h2>Session break</h2>
  <p>Next presentation starts at {nextSession.scheduledStart}</p>
  <Countdown until={nextSession.scheduledStart} />
</BreakScreen>

// Present app can show similar break screen
// If presenter manually unmutes, a warning appears
<Warning>
  No session is currently scheduled. Next session: {nextSession.title} at {time}
</Warning>
```

### 2. Manual Session Stop/Restart

**Scenario:** Presenter manually stops session mid-chain

**Per Jim:** This should behave consistent with whatever happens the rest of the day

**Solution:**

```typescript
// Show confirmation modal
<ConfirmModal>
  <p>This session is part of an event chain. Stopping it will:</p>
  <ul>
    <li>End the current session</li>
    <li>NOT automatically start the next session</li>
    <li>Require manual restart to continue the event</li>
  </ul>
  <Button onClick={confirmStop}>Stop Session</Button>
  <Button onClick={cancel}>Cancel</Button>
</ConfirmModal>;

// On restart, detect if there's a "next" session that should have already started
if (now > session.scheduledStart && previousSessionWasStopped) {
  // Show catch-up dialog
  <CatchUpDialog>
    The scheduled time has passed. Start this session now?
  </CatchUpDialog>;
}
```

### 3. Same Start/End Times

**Question:** Can the start time and end time be the same?

**Per Jim:** We handle feedback with the existing spreadsheet upload that gives info per cell.

**Recommendation:** Allow with 1-second buffer or require staggering

```typescript
// When end time equals start time of next session
if (session.endTime.getTime() === nextSession.scheduledStart.getTime()) {
  // Add 1-second buffer automatically
  session.endTime = new Date(session.endTime.getTime() - 1000);
}

// Or require users to stagger by at least 1 minute
const MIN_TRANSITION_TIME = 60000; // 1 minute
if (nextSession.scheduledStart - session.endTime < MIN_TRANSITION_TIME) {
  throw new ValidationError("Minimum 1 minute required between sessions");
}
```

### 4. Editing Sessions After Chain Starts

**Per Jim:** "I don't see why not" (can edit settings for sessions later in the chain before those sessions start)

**Rules:**

- Can edit future sessions before they start
- Cannot edit currently running session's end time or next session link
- Cannot edit past sessions
- Can add new sessions to end of chain

```typescript
function canEditSession(session: Session): boolean {
  const now = new Date();

  if (session.chainStatus === "active") {
    // Can edit some fields but not timing/chaining
    return { allowed: true, restricted: ["endTime", "nextSessionId"] };
  }

  if (session.chainStatus === "completed") {
    return { allowed: false, reason: "Session already completed" };
  }

  if (session.scheduledStart < now) {
    return { allowed: false, reason: "Session already started" };
  }

  return { allowed: true, restricted: [] };
}
```

### 5. Language Changes Between Sessions

**Question:** What happens if one presentation has a different language from the previous one?

**Per the discussion:** People should make the updates in the Portal and not try to change it in the present app day-of. When each new presentation starts, it'll use the settings for that presentation, not any changes that were made inside the Present app previously.

### 6. Transcript Slicing

**Question:** What happens if a user clicks to slice one of these sessions partway through?

**Per Jim:** Could hide the Slice button for these daisy-chained events, but that likely creates many future bugs; if people cut the session, that's their problem.

---

## Engineering Questions & Answers

| Question                                                                                     | Answer                                                                                                                                                           |
| -------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| What happens during lunch break when end time is before next start time?                     | Per discussion: need to determine whether to follow schedule strictly or slice logically based on audio. Slicing logically is more complex but likely necessary. |
| Can start time and end time be the same?                                                     | Per Jim: handle feedback with existing spreadsheet upload that gives info per cell.                                                                              |
| What intermediary milestones make sense?                                                     | Per Jim: it probably makes sense to just do with the Events page                                                                                                 |
| If someone manually stops a session during the day and restarts, does that present problems? | Per Jim: should behave consistent with whatever happens rest of day                                                                                              |
| Can people edit settings for sessions later in the chain before those start?                 | Per Jim: I don't see why not                                                                                                                                     |
| Can users run Events sessions outside scheduled time?                                        | Per Jim: it only works on that one scheduled time                                                                                                                |
| What happens if user clicks to slice one of these sessions partway through?                  | Per Jim: could hide Slice button, but that likely creates future bugs; if people cut the session, that's their problem                                           |
| Language override behavior when new session starts with different language?                  | Per discussion: people should make updates in Portal, not present app day-of. New presentation uses its settings, not previous present app changes.              |
| Is there hidden complexity with workspaces?                                                  | Events new objects inside workspaces - sessions already belong to Workspaces, so Events and Locations should also belong to Workspaces                           |

---

## Long Term Strategy

These features build on each other to support better summaries:

1. **Events** (this project)
2. **Automatic Summaries** - Auto-generate summaries per session
3. **Published Summaries** - Public page per event (like SnapSight)

### Possible Future Projects

- Additional summary format options
- **Remote Session Control** - Pause+restart all Presenter connections for a running session
- **Transcript Editing** - Address transcript timing issues
- **One-click marketing assets** - Generate full suite of marketing assets
- **Transcripts UX Update** - Portal UX improvements

---

## Implementation Phases

### Phase 1: Foundation (Weeks 1-2)

- [ ] Database schema updates
- [ ] Event/Location data models
- [ ] Basic Events management page (create, list, view)
- [ ] Manual session creation in events (no bulk upload yet)

### Phase 2: Session Chaining (Weeks 3-4)

- [ ] Session chain linking logic
- [ ] Auto-transition backend service
- [ ] Timer/scheduler implementation
- [ ] Monitoring and status updates

### Phase 3: Present/Attend Updates (Weeks 5-6)

- [ ] Present app location ID handling
- [ ] Auto-transition UI in Present
- [ ] Attend app session switching
- [ ] Transition notifications
- [ ] Pre-populate "Enter Name" field with Location name

### Phase 4: Bulk Upload & Validation (Week 7)

- [ ] Spreadsheet parser (Location, Title, Presenter, Date, Start Time, End Time, Timezone)
- [ ] Validation engine
- [ ] Error reporting UI with tap/hover info
- [ ] Bulk session creation

### Phase 5: Polish & Testing (Week 8)

- [ ] Edge case handling
- [ ] Error recovery
- [ ] QR code generation per location
- [ ] PDF download with Present app links per Location
- [ ] Documentation
- [ ] User testing
- [ ] Keycloak role restrictions

---

## Checklist

### Privacy Impact

- [ ] Transcript privacy settings configurable by user

### Security Impact

- [ ] No changes to security of sessions

### Keycloak Roles

- [ ] Add a Keycloak role for events? If so, hide the tab if user/workspace doesn't have that role
- [ ] Hide from users with `transcripts-prohibited` role

### Analytics

- [ ] Add analytics to portal before launch so we can assess usage of this new feature

### Pricing

- [ ] Should only be available to top tiers?

### Accessibility

- [ ] Build new page WCAG compliant - screen readable, navigable
- [ ] Keyboard navigation for all features

### Workspaces

- [ ] Sessions already belong to Workspaces, so Events and Locations (as grouping properties of sessions) should also belong to Workspaces

---

## Testing Strategy

### Unit Tests

```typescript
describe("Session Chaining", () => {
  test("creates proper chain links", () => {
    const sessions = createSessionChain(mockSessions);
    expect(sessions[0].nextSessionId).toBe(sessions[1].id);
    expect(sessions[1].previousSessionId).toBe(sessions[0].id);
  });

  test("validates no overlaps", () => {
    const result = validateNoOverlaps(overlappingSessions);
    expect(result.valid).toBe(false);
  });

  test("calculates total event minutes", () => {
    const total = calculateTotalEventMinutes(mockEvent);
    expect(total).toBe(480); // 8 hours
  });
});

describe("Auto-transition", () => {
  test("transitions at scheduled time", async () => {
    const manager = new SessionChainService();
    await manager.startChain(mockLocation.id);

    // Fast-forward time
    jest.advanceTimersByTime(session1.endTime - Date.now());

    expect(endSessionMock).toHaveBeenCalledWith(session1.id);
    expect(startSessionMock).toHaveBeenCalledWith(session2.id);
  });

  test("transitions after silence threshold when near end time", async () => {
    // Test the 120-second silence detection
  });

  test("hard cuts at next session start time regardless of silence", async () => {
    // Test the hard cut behavior
  });
});
```

### Integration Tests

- Test full event creation → session start → transition → end flow
- Test bulk upload with various file formats
- Test simultaneous events in different locations
- Test manual intervention during auto-chain
- Test schedule-based access restrictions

### Load Tests

- 100 concurrent events running
- 1000 attendees joining/leaving during transitions
- Database query performance with 10k+ sessions

---

## Monitoring & Observability

### Metrics to Track

```typescript
// Key metrics
events.active.count;
locations.active.count;
sessions.chain_transitions.count;
sessions.chain_transitions.success_rate;
sessions.chain_transitions.latency_ms;

// Errors
sessions.chain_errors.missed_transition;
sessions.chain_errors.overlap_detected;
sessions.chain_errors.account_insufficient_minutes;
sessions.chain_errors.schedule_access_denied;

// Business metrics
events.created.daily;
events.avg_sessions_per_event;
events.avg_duration_hours;
```

### Logging

```typescript
logger.info("Session chain transition", {
  eventId,
  locationId,
  fromSessionId: currentSession.id,
  toSessionId: nextSession.id,
  scheduledStart: nextSession.scheduledStart,
  actualStart: new Date(),
  latencyMs: actualStart - scheduledStart,
  silenceDurationMs: silenceDuration,
  triggerReason: "silence_threshold" | "next_session_start" | "manual",
});
```

---

## Risk Mitigation

### Technical Risks

**Risk:** Auto-transition fails during live event
**Mitigation:**

- Manual override buttons in Present app
- Fallback to manual session management
- Real-time monitoring dashboard for support team
- Automated alerts for failed transitions

**Risk:** Clock synchronization issues
**Mitigation:**

- Use server time, not client time
- Add buffer time for transitions (5-10 seconds)
- Allow manual trigger as backup
- Handle temporary internet issues at critical moments

**Risk:** Database performance with large event chains
**Mitigation:**

- Proper indexing on session queries
- Cache active session data
- Pagination for event views

### User Experience Risks

**Risk:** Confusing UI for complex events
**Mitigation:**

- Wizard-based event creation
- Clear visual timeline of sessions
- Validation feedback during setup
- Example templates

**Risk:** Attendee confusion during transitions
**Mitigation:**

- Clear transition messages
- Visual countdown timers
- Maintain language preferences
- Brief "Now starting..." notification

---

## Appendix

### Example Event JSON

```json
{
  "id": "evt_abc123",
  "workspaceId": "ws_xyz789",
  "name": "Annual Conference 2025",
  "startDate": "2025-06-15T08:00:00Z",
  "endDate": "2025-06-15T18:00:00Z",
  "timezone": "America/New_York",
  "defaults": {
    "accountId": "acc_def456",
    "glossaryId": "gls_ghi789",
    "publishTranscripts": true,
    "accessType": "open",
    "startingLanguage": "en",
    "otherLanguages": ["es", "fr", "de"]
  },
  "locations": [
    {
      "id": "loc_001",
      "eventId": "evt_abc123",
      "name": "Main Hall",
      "locationSessionId": "MAIN-HALL-2025",
      "passcode": "123456",
      "mobileId": "83721901",
      "sessions": [
        {
          "id": "ses_001",
          "title": "Opening Keynote",
          "presenters": ["John Smith", "Jane Doe"],
          "scheduledStart": "2025-06-15T09:00:00Z",
          "endTime": "2025-06-15T10:00:00Z",
          "timezone": "America/New_York",
          "nextSessionId": "ses_002",
          "chainStatus": "pending"
        },
        {
          "id": "ses_002",
          "title": "Product Roadmap",
          "presenters": ["Jane Doe"],
          "scheduledStart": "2025-06-15T10:00:00Z",
          "endTime": "2025-06-15T11:00:00Z",
          "timezone": "America/New_York",
          "previousSessionId": "ses_001",
          "nextSessionId": "ses_003",
          "chainStatus": "pending"
        }
      ]
    }
  ]
}
```

### Bulk Upload CSV Example

Download template: `wordly-event-import-template.csv`

```csv
Location,Title,Presenter,Date,Start Time,End Time,Timezone
Main Hall,Opening Keynote,"John Smith, Jane Doe",2025-06-15,09:00,10:00,America/New_York
Main Hall,Product Roadmap,Jane Doe,2025-06-15,10:00,11:00,America/New_York
Main Hall,Customer Success Stories,"Bob Johnson, Sarah Lee",2025-06-15,11:00,12:00,America/New_York
Breakout Room A,Technical Workshop,Sarah Lee,2025-06-15,13:00,14:30,America/New_York
Breakout Room A,Security Best Practices,"Mike Chen, Alex Wong",2025-06-15,14:30,16:00,America/New_York
```

**Format Notes:**

- **Location:** Groups sessions; same location name = same QR code
- **Presenter:** Multiple presenters separated by commas, wrapped in quotes
- **Date:** YYYY-MM-DD format
- **Start Time / End Time:** Time only (HH:MM format in 24-hour)
- **Timezone:** IANA timezone identifier (e.g., America/New_York)

---

## Inception Notes

### Stakeholder Meeting Key Points

- Allow bulk upload to replace the full event while keeping the QRs the same for the same Location name
- Allow changing the Location field for a session during the event (enables day-of tweaks without breaking things)
- Allow adding/deleting individual sessions within a Location
- Allow deleting a Location
- Explore error handling with existing bulk upload UI
- Enable adding an event piece by piece - add event, add Location, add session

---

## Previous Version History

### v1.1 Updates (November 2024)

**From User Research:**

- Manual session entry on devices (Location credentials display)
- AV crew handoff materials (Download for AV button)
- Session buffer periods (Buffer Before/After configuration)
- Multiple presenters per session
- Date-time display improvements (hierarchical grouping)
- Past event restrictions (read-only for completed events)

### v1.2 Updates (November 2024)

**Key Changes:**

- Simplified navigation (Event → Date → Locations → Presentations)
- Session ID format standardization
- CSV upload validation improvements
- Audio capture & transcript logic clarification
- Language management hierarchy
- Present app reconnection logic

---

**Document Version:** 2.0  
**Last Updated:** December 18, 2025  
**Authors:** Product Team, Engineering Team  
**Status:** Ready for Implementation
