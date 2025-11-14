# Wordly Events Feature - Technical Specification

## Executive Summary

The Events feature introduces hierarchical event management to Wordly, enabling automatic session daisy-chaining for multi-presentation conference days. This solves the current problem of single all-day sessions generating unwieldy combined transcripts.

**Key Goals:**

- Generate individual transcripts per presentation while maintaining seamless attendee experience
- Automate session transitions based on scheduled times
- Provide unified room-level access via single QR code/Session ID
- Enable better summaries and future event-level analytics

---

## Architecture Overview

### Data Model Hierarchy

```
Organization
└── Workspace
    └── Event
        └── Room
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
    startingLanguage: string;
    quickSelectLanguages: string[];
    customFields: Record<string, any>;
  };

  rooms: Room[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}
```

#### Room Object (Stage)

```typescript
interface Room {
  id: string;
  eventId: string;
  name: string;
  description?: string;

  // Public-facing credentials for the stage
  roomSessionId: string; // Stage Session ID (e.g., "MAIN-AUD-2024")
  passcode: string; // Stage passcode (e.g., "MA2024-8372-19")
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
  presenters: string[]; // UPDATED: Support multiple presenters (was singular)
  accountId: string;
  // ... other existing fields

  // New fields for Events
  eventId?: string;
  roomId?: string;
  scheduledStart: Date;
  endTime: Date;

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

#### UI Components Needed

**Event List View**

- Table/card view showing all events
- Filters: Date range, status (upcoming/active/past)
- Sort by: Date, name, room count
- Actions: Create new event, edit, delete, duplicate

**Event Detail View**

- Event metadata (name, dates, description)
- Room accordion list
- Each room expands to show session list
- Session table columns:
  - Title
  - Presenter
  - Start Time
  - End Time
  - Status indicator
  - Actions (edit, delete, reorder)

**Event Creation Flow**

1. Event details form
2. Session defaults configuration
3. Add rooms
4. Import sessions (bulk upload or manual)
5. Review and validate
6. Generate room QR codes

#### Bulk Upload

**Spreadsheet Format (.csv/.xlsx)**

```
Event Name, Room Name, Session Title, Presenters, Start Date, Start Time, End Time, Custom Field 1, Custom Field 2
Conference 2025, Main Hall, Opening Keynote, "John Smith, Jane Doe", 2025-06-15, 09:00, 10:00, Marketing, Executive
Conference 2025, Main Hall, Product Update, Jane Doe, 2025-06-15, 10:00, 11:00, Product, Update
Conference 2025, Breakout A, Workshop 1, "Bob Johnson, Sarah Lee", 2025-06-15, 09:00, 10:30, Engineering, Workshop
```

**Key Changes:**

- **Presenters column** now supports multiple presenters (comma-separated, quoted if multiple)
- **Start Date** is now separate from Start Time for better date handling
- Buffer periods are applied at upload time (configured globally, not per-session)

**Upload Processing**

1. Parse file
2. Group by Event → Room
3. Sort sessions by start time per room
4. Run validation checks
5. Create Event/Room/Session objects
6. Return success/error report

#### Validation Rules

**Critical Validations (Must Pass)**

```typescript
// 1. No overlapping sessions in same room
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

### 2. Backend API Updates

#### New Endpoints

```typescript
// Events
POST   /api/v1/events
GET    /api/v1/events
GET    /api/v1/events/:id
PUT    /api/v1/events/:id
DELETE /api/v1/events/:id

// Rooms
POST   /api/v1/events/:eventId/rooms
GET    /api/v1/events/:eventId/rooms
PUT    /api/v1/rooms/:id
DELETE /api/v1/rooms/:id

// Bulk operations
POST   /api/v1/events/bulk-upload
POST   /api/v1/events/:eventId/sessions/bulk

// Room public access
GET    /api/v1/rooms/:roomSessionId/active-session
```

#### Session Chaining Logic

```typescript
interface SessionChainManager {
  /**
   * Start a session chain - called when presenter starts first session
   */
  startChain(roomId: string): Promise<void>;

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
  async startChain(roomId: string) {
    const room = await getRoomWithSessions(roomId);
    const firstSession = room.sessions[0];

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
      presenterName: nextSession.presenter,
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
  default_glossary_id UUID REFERENCES glossaries(id),
  default_account_id UUID NOT NULL REFERENCES accounts(id),
  default_publish_transcripts BOOLEAN DEFAULT false,
  default_starting_language VARCHAR(10),
  default_quick_languages JSONB,
  default_custom_fields JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);

-- Rooms table
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  room_session_id VARCHAR(50) UNIQUE NOT NULL, -- Public-facing ID
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Update sessions table
ALTER TABLE sessions ADD COLUMN event_id UUID REFERENCES events(id);
ALTER TABLE sessions ADD COLUMN room_id UUID REFERENCES rooms(id);
ALTER TABLE sessions ADD COLUMN scheduled_start TIMESTAMP;
ALTER TABLE sessions ADD COLUMN end_time TIMESTAMP;
ALTER TABLE sessions ADD COLUMN previous_session_id UUID REFERENCES sessions(id);
ALTER TABLE sessions ADD COLUMN next_session_id UUID REFERENCES sessions(id);
ALTER TABLE sessions ADD COLUMN chain_status VARCHAR(20);

-- Indexes for performance
CREATE INDEX idx_sessions_room_id ON sessions(room_id);
CREATE INDEX idx_sessions_event_id ON sessions(event_id);
CREATE INDEX idx_rooms_event_id ON rooms(event_id);
CREATE INDEX idx_sessions_scheduled_start ON sessions(scheduled_start);
```

---

### 3. Present App Updates

#### Key Changes

**On Launch**

1. Check if Session ID is actually a Room Session ID
2. If yes, determine current active session or next scheduled session
3. Load appropriate session
4. Display Room Session ID (not individual session ID)

**Session Monitoring**

- Display countdown to next session
- Auto-end current session at `endTime`
- Auto-start next session at `scheduledStart`
- Show presenter transition notification

**UI Updates Needed**

```typescript
// Display room ID instead of session ID
<SessionHeader>
  <SessionId>{room.roomSessionId}</SessionId>
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
  <p>Presenter: {nextSession.presenter}</p>
</TransitionModal>
```

#### Auto-transition Flow

```typescript
interface PresentAppSessionManager {
  currentSession: Session;
  nextSession?: Session;
  transitionTimer?: NodeJS.Timeout;

  async startRoomSession(roomSessionId: string) {
    // Get current or next session for room
    const activeSession = await api.getRoomActiveSession(roomSessionId);

    if (activeSession) {
      this.loadSession(activeSession);
      this.scheduleTransition(activeSession);
    } else {
      // Show waiting screen for first session
      this.showWaitingForStart();
    }
  }

  scheduleTransition(session: Session) {
    if (!session.nextSessionId) return;

    const timeUntilEnd = session.endTime.getTime() - Date.now();

    this.transitionTimer = setTimeout(() => {
      this.executeTransition(session.nextSessionId);
    }, timeUntilEnd);
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

### 4. Attend App Updates

#### Key Changes

**On Join**

1. Parse Session ID (might be Room Session ID)
2. Resolve to current active session
3. Auto-switch to next session when transition occurs

**Session Switching**

- Detect when backend switches sessions
- Seamlessly reconnect to new session stream
- Show brief "Switching presentations..." message
- Maintain translation language selection across transitions

```typescript
interface AttendAppSessionManager {
  roomSessionId: string;
  currentSessionId: string;
  websocket: WebSocket;

  async joinRoom(roomSessionId: string) {
    this.roomSessionId = roomSessionId;

    // Get current active session
    const activeSession = await api.getRoomActiveSession(roomSessionId);

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

      // Connect to new
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

**Solution:**

```typescript
// During gap, session is ended but room remains "open"
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

**Decision Required:** Allow or reject?

**Recommendation:** Allow with 1-second buffer

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

---

## Implementation Phases

### Phase 1: Foundation (Weeks 1-2)

- [ ] Database schema updates
- [ ] Event/Room data models
- [ ] Basic Events management page (create, list, view)
- [ ] Manual session creation in events (no bulk upload yet)

### Phase 2: Session Chaining (Weeks 3-4)

- [ ] Session chain linking logic
- [ ] Auto-transition backend service
- [ ] Timer/scheduler implementation
- [ ] Monitoring and status updates

### Phase 3: Present/Attend Updates (Weeks 5-6)

- [ ] Present app room ID handling
- [ ] Auto-transition UI in Present
- [ ] Attend app session switching
- [ ] Transition notifications

### Phase 4: Bulk Upload & Validation (Week 7)

- [ ] Spreadsheet parser
- [ ] Validation engine
- [ ] Error reporting UI
- [ ] Bulk session creation

### Phase 5: Polish & Testing (Week 8)

- [ ] Edge case handling
- [ ] Error recovery
- [ ] QR code generation per room
- [ ] Documentation
- [ ] User testing

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
    await manager.startChain(mockRoom.id);

    // Fast-forward time
    jest.advanceTimersByTime(session1.endTime - Date.now());

    expect(endSessionMock).toHaveBeenCalledWith(session1.id);
    expect(startSessionMock).toHaveBeenCalledWith(session2.id);
  });
});
```

### Integration Tests

- Test full event creation → session start → transition → end flow
- Test bulk upload with various file formats
- Test simultaneous events in different rooms
- Test manual intervention during auto-chain

### Load Tests

- 100 concurrent events running
- 1000 attendees joining/leaving during transitions
- Database query performance with 10k+ sessions

---

## Monitoring & Observability

### Metrics to Track

```typescript
// Key metrics
-events.active.count -
  rooms.active.count -
  sessions.chain_transitions.count -
  sessions.chain_transitions.success_rate -
  sessions.chain_transitions.latency_ms -
  // Errors
  sessions.chain_errors.missed_transition -
  sessions.chain_errors.overlap_detected -
  sessions.chain_errors.account_insufficient_minutes -
  // Business metrics
  events.created.daily -
  events.avg_sessions_per_event -
  events.avg_duration_hours;
```

### Logging

```typescript
logger.info("Session chain transition", {
  eventId,
  roomId,
  fromSessionId: currentSession.id,
  toSessionId: nextSession.id,
  scheduledStart: nextSession.scheduledStart,
  actualStart: new Date(),
  latencyMs: actualStart - scheduledStart,
});
```

---

## Documentation Needs

### User Documentation

- [ ] How to create an event
- [ ] Bulk upload spreadsheet format guide
- [ ] Understanding session chaining
- [ ] Best practices for scheduling sessions
- [ ] Troubleshooting common issues

### API Documentation

- [ ] Events API endpoints
- [ ] Rooms API endpoints
- [ ] Updated Sessions API
- [ ] Webhook events for transitions

### Internal Documentation

- [ ] Architecture decision records
- [ ] Session chain state machine
- [ ] Database migration guide
- [ ] Deployment checklist

---

## Future Enhancements

### Automatic Summaries

- Generate summary per session
- Aggregate summaries at room level
- Full event summary combining all rooms

### Published Summaries

- Public page per event (like SnapSight)
- Shareable summary links
- Embedded summaries on customer websites

### Advanced Scheduling

- Recurring events (weekly meetings)
- Template events (reuse structure)
- Dynamic rescheduling during live events

### Analytics

- Attendee counts per session
- Language distribution
- Engagement metrics
- Popular sessions/speakers

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

## Success Criteria

### Functional

- [x] Can create events with multiple rooms and sessions
- [x] Sessions auto-transition at scheduled times
- [x] Single room QR code works for all sessions
- [x] Individual transcripts generated per session
- [x] No manual intervention needed during event

### Performance

- [x] Transition latency < 2 seconds
- [x] Support 100+ simultaneous events
- [x] Page load time < 1 second for event management
- [x] Bulk upload processes 500 sessions in < 30 seconds

### Business

- [x] 80% of conference customers adopt Events feature
- [x] Average transcript usefulness rating increases
- [x] Reduction in support tickets related to transcript management
- [x] Enables new enterprise pricing tier

---

## Recent Updates from User Research (Nov 2024)

### Key Findings from Customer Interviews

Based on customer feedback sessions, the following requirements have been identified:

#### 1. Manual Session Entry on Devices

**Finding:** Most users enter session details manually on presenter/attendee devices rather than using QR codes exclusively.

**Implementation:**

- **Display stage credentials prominently** in the Events UI:
  - **Stage Session ID** (e.g., "MAIN-AUD-2024")
  - **Passcode** (e.g., "MA2024-8372-19")
  - **Mobile ID** (e.g., "83721901")
- Add copy-to-clipboard buttons for each credential
- Show credentials in the stage card header (always visible when event is expanded)
- Include credentials in downloadable materials (see below)

**Status:** ✅ Implemented in UI (v1.1)

---

#### 2. AV Crew Handoff Materials

**Finding:** Users provide PDFs or spreadsheets to AV staff with session information and launch links.

**Implementation:**

- **Download for AV** button on each event card
- Generate comprehensive PDF/spreadsheet containing:
  - Event overview (name, dates, timezone)
  - All stages with credentials
  - All sessions with full schedule (date + time)
  - Present web app launch URLs for each stage
  - QR codes for each stage
  - Presenter names
- Format options: PDF (preferred for printing), Excel (for editing)

**Status:** ✅ Implemented (v1.1)

---

#### 3. Session Buffer Periods

**Finding:** Users need a buffer period before/after each session for setup and teardown (typically 5 minutes).

**Implementation:**

- Add **Buffer Period** configuration in Upload Schedule modal
- Two separate fields:
  - **Buffer Before** (minutes) - Default: 5
  - **Buffer After** (minutes) - Default: 5
- User-editable defaults that apply to entire event
- Buffers extend the actual session times but don't affect the displayed schedule
- Example:
  - Scheduled: 09:00 - 10:00
  - Actual with buffers: 08:55 - 10:05
  - Display: Still shows 09:00 - 10:00 to attendees

**Rationale:**

- Allows presenters to connect early and test equipment
- Prevents abrupt cutoffs at end of session
- Improves presenter experience without confusing attendees

**Status:** ✅ Implemented (v1.1)

---

#### 4. Multiple Presenters per Session

**Finding:** Many sessions have multiple presenters (panels, co-presenters, interviewers, etc.).

**Implementation:**

- Update Session data model: `presenters: string[]` (array instead of single string)
- CSV format: Support comma-separated presenters in quotes
  - Example: `"John Smith, Jane Doe, Bob Johnson"`
- UI display: Show all presenters (comma-separated or as badges)
- Pre-populate Present app "Enter Name" field with first presenter name

**Status:** ✅ Implemented (v1.1)

---

#### 5. Date-Time Display Improvements

**Finding:** Multi-day events need clear date context, not just times.

**Implementation:**

- **Option A (Inline):** Show full date-time for each session
  - Example: "Nov 15, 2024 09:00 - 10:30"
- **Option B (Hierarchical):** Group sessions by date with date headers
  - Example:
    ```
    📅 November 15, 2024
      ├─ Main Auditorium
      │   ├─ 09:00 - 10:30 Opening Keynote
      │   └─ 11:00 - 12:00 Product Update
    📅 November 16, 2024
      └─ Main Auditorium
          └─ 09:00 - 10:30 Closing Session
    ```

**Decision:** Using **Option B (Hierarchical)** for better scanability in multi-day events.

**Status:** ✅ Implemented (v1.1)

---

#### 6. Past Event Restrictions

**Finding:** Completed events should not be editable or runnable.

**Implementation:**

- Disable "Start Stage" button for past events
- Disable "Edit" buttons for sessions in past events
- Add tooltip: "This event has ended and cannot be modified"
- Visual styling: Gray out controls, show `cursor-not-allowed`
- Read-only access: Users can still view and download materials

**Status:** ✅ Implemented (v1.1)

---

### Deferred Features (Fast-Follow)

The following items require additional product/design decisions and are deferred to a later release:

#### 1. ALS Field in Settings

- **Status:** ❓ Pending clarification on meaning and requirements
- **Priority:** Medium

#### 2. Manual Pause/Restart Controls

- **Requirement:** Ability to manually pause and restart presenter connections during active sessions
- **Status:** 🔜 Fast-follow (v1.2)
- **Priority:** Medium

#### 3. Split Transcript Feature for Events

- **Question:** Should "Split Transcript" button be removed/hidden for events?
- **Status:** ❓ Pending product decision
- **Priority:** Low

#### 4. Language Override Behavior

- **Question:** When a new session starts with a different language than the previous one, should it:
  - Reset to event default languages?
  - Preserve previous session's language selection?
  - Prompt presenter to confirm language?
- **Status:** ❓ Pending UX design
- **Priority:** Low (relevant only after session transitions are built)

---

## Questions for Product/Design

1. **UI Design:** Do we need a calendar/timeline view for events, or is accordion list sufficient?
2. **Permissions:** Should Events follow Workspace permissions, or have separate event-level permissions?
3. **Notifications:** Should presenters/admins get notifications before transitions?
4. **Mobile:** Any specific mobile considerations for event management?
5. **Branding:** Should events have custom branding options separate from workspace branding?

## Questions for Engineering

1. **Architecture:** Should we use WebSockets or polling for transition updates?
2. **Timing:** What's acceptable transition latency? (Current thinking: < 2 seconds)
3. **Reliability:** Should we use a job queue (e.g., Celery, Bull) for scheduled transitions?
4. **State Management:** How to handle distributed state across multiple server instances?
5. **Recovery:** If server crashes during event, how to resume session chain?
6. **Performance:** Expected database query load with 1000+ active events?

---

## Open Issues

| Issue                                | Status | Priority | Owner   | Notes                                        |
| ------------------------------------ | ------ | -------- | ------- | -------------------------------------------- |
| Decide on start/end time rules       | Open   | High     | Product | Can they be equal?                           |
| Define validation error UX           | Open   | High     | Design  | Block upload or allow with warnings?         |
| WebSocket vs polling for transitions | Open   | High     | Eng     | Performance implications                     |
| Manual edit restrictions             | Open   | Medium   | Product | What can be edited mid-event?                |
| Lunch break behavior                 | Open   | Medium   | Product | Muted session or fully ended?                |
| Integration with remote controls     | Open   | Low      | Eng     | Deferred to later phase                      |
| Transcript slicing alternative       | Open   | Low      | Product | Build this first or go straight to chaining? |

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
  "defaults": {
    "accountId": "acc_def456",
    "glossaryId": "gls_ghi789",
    "publishTranscripts": true,
    "startingLanguage": "en",
    "quickSelectLanguages": ["es", "fr", "de"]
  },
  "rooms": [
    {
      "id": "room_001",
      "eventId": "evt_abc123",
      "name": "Main Hall",
      "roomSessionId": "MAIN-HALL-2025",
      "sessions": [
        {
          "id": "ses_001",
          "title": "Opening Keynote",
          "presenter": "John Smith",
          "scheduledStart": "2025-06-15T09:00:00Z",
          "endTime": "2025-06-15T10:00:00Z",
          "nextSessionId": "ses_002",
          "chainStatus": "pending"
        },
        {
          "id": "ses_002",
          "title": "Product Roadmap",
          "presenter": "Jane Doe",
          "scheduledStart": "2025-06-15T10:00:00Z",
          "endTime": "2025-06-15T11:00:00Z",
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
Event Name,Room Name,Session Title,Presenters,Start Date,Start Time,End Time
Annual Conference 2025,Main Hall,Opening Keynote,"John Smith, Jane Doe",2025-06-15,09:00,10:00
Annual Conference 2025,Main Hall,Product Roadmap,Jane Doe,2025-06-15,10:00,11:00
Annual Conference 2025,Main Hall,Customer Success Stories,"Bob Johnson, Sarah Lee",2025-06-15,11:00,12:00
Annual Conference 2025,Breakout Room A,Technical Workshop,Sarah Lee,2025-06-15,13:00,14:30
Annual Conference 2025,Breakout Room A,Security Best Practices,"Mike Chen, Alex Wong",2025-06-15,14:30,16:00
```

**Format Notes:**

- **Presenters:** Multiple presenters separated by commas, wrapped in quotes
- **Start Date:** Separate date column (YYYY-MM-DD format)
- **Start Time / End Time:** Time only (HH:MM format in 24-hour)
- **Buffer Periods:** Configured globally at upload time, not per-row

---

**Document Version:** 1.1  
**Last Updated:** November 14, 2024  
**Authors:** Product Team, Engineering Team  
**Status:** In Development - v1.1 Updates
