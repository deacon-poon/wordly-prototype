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

---Feedback Nov 19, 2025---

# Wordly Events - Design Specification for Implementation

**Version:** 1.2  
**Date:** November 19, 2025  
**Target:** Q1 2025 Development  
**Team:** Features Team  
**Status:** Ready for Implementation

---

## Implementation Notes & Clarifications

### Reconciling v1.1 and v1.2 Changes

**Presenters Field:**

- **Keep:** Multiple presenters support from v1.1 (user research finding)
- **Data model:** `presenters: string[]`
- **CSV:** Support comma-separated presenters in quotes
- **UI:** Display multiple presenters with appropriate formatting

**Buffer Periods:**

- **Keep:** Buffer period configuration from v1.1 (user research finding)
- **Location:** Upload Schedule modal (global event setting)
- **Fields:** Buffer Before and Buffer After (minutes)

**Date Grouping:**

- **Keep:** Hierarchical date grouping from v1.1 for better UX
- **Apply:** Within each room, group presentations by date
- **Benefit:** Better scanability for multi-day events

**Terminology:**

- **Use "Presentation"** in Events context for individual items
- **Use "Session"** for legacy standalone sessions
- **Use "Stage"** for rooms in events (maintains consistency with existing implementation)
- **Session ID** refers to the access code (room-level)

---

## Overview

The Wordly Events feature enables enterprise users to manage multi-session conferences with stages (rooms), schedules, and automated session management. This document provides technical specifications for design and implementation.

---

## 1. Information Architecture & Navigation

### Event Hierarchy (SIMPLIFIED)

**OLD (Removed):**

```
Events Page
  └─ Event (accordion)
      └─ Room (accordion)
          └─ Date (accordion)
              └─ Presentations
```

**NEW (CORRECTED):**

```
Events List Page
  └─ [Click Event] → Event Detail Page
      └─ Dates (expandable sections)
          └─ Stages/Rooms (grouped by date)
              └─ Presentations (for that stage on that date)
```

### Key Changes

- Remove top-level event accordion
- Each event gets its own dedicated page
- **Dates are the primary grouping** (not rooms)
- Within each date, show all stages/rooms
- Provides intuitive day-by-day schedule view
- Presentations shown in compact cards with time, title, and presenters

---

## 2. Event Detail Page Layout

### Page Structure (UPDATED - Date-First Hierarchy)

```
┌──────────────────────────────────────────────────┐
│ [< Back to Events]    Event: TechConf 2025       │
├──────────────────────────────────────────────────┤
│ Tabs: [Active] [Upcoming] [Past] [All]           │
├──────────────────────────────────────────────────┤
│                                                   │
│ ▼ Thursday, November 14, 2024                    │
│   (8 presentations across 3 stages)              │
│                                                   │
│   📍 Main Auditorium                              │
│   Session ID: A1234 │ [Links] [Start Stage]     │
│   ├─ 09:00-10:30 │ Opening Keynote               │
│   ├─ 11:00-12:00 │ Technical Deep Dive           │
│   └─ 13:30-15:00 │ Panel Discussion              │
│                                                   │
│   📍 Workshop Room A                              │
│   Session ID: B5678 │ [Links] [Start Stage]     │
│   ├─ 09:00-11:00 │ Hands-on Workshop             │
│   └─ 11:30-13:00 │ Interactive Coding            │
│                                                   │
│ ▼ Friday, November 15, 2024                      │
│   (5 presentations across 2 stages)              │
│   [Collapsed by default]                         │
│                                                   │
└──────────────────────────────────────────────────┘
```

### Hierarchy

**Implemented Structure: Event → Date → Stages → Presentations**

**Rationale:**
This hierarchy matches how people naturally think about conference schedules:

- Primary question: "What's happening today/tomorrow?"
- Secondary: "What are the different tracks/rooms?"
- Tertiary: "What specific presentations can I attend?"

**Benefits:**

1. See the full day's schedule at a glance
2. View all tracks/stages for a given date
3. Easily compare what's happening simultaneously across rooms
4. Natural day-by-day navigation for multi-day events
5. Intuitive for both attendees and organizers

### Display Rules

**Active Tab (Default):**

- Show only events/rooms with sessions today
- Auto-expand rooms with current/upcoming sessions today

**Date-Aware Display:**

- **Upcoming sessions:** Full display, can edit (if not started)
- **Active sessions:** Highlighted, full display
- **Past sessions:** Collapsed/hidden by default
- Show count as "X upcoming sessions" not total

**Session Row Format:**

```
[Date, Time Range] | [Title] | Session ID: [ID] | [Links to join button]
```

---

## 3. Session IDs & Access

### Format Standards

| Field      | Format           | Example                 |
| ---------- | ---------------- | ----------------------- |
| Session ID | A-D + 1-4 digits | `A1234`, `BC42`, `D987` |
| Passcode   | 6-digit numeric  | `123456`, `789012`      |
| Mobile ID  | **REMOVED**      | N/A                     |

### Important Notes

- **Room-level IDs:** One Session ID per room for entire day
- Same ID used across all presentations in that room
- Automatic transition between presentations
- Update all prototypes, CSV templates, PDF exports

### Join Button

- **Label:** "Links to join" or "Get links to join"
- **Action:** Open existing "Ways to join a session" page
- Pass room-level Session ID
- No changes to existing join page for v1

---

## 4. Presentation Details UI

### New Component (Not Legacy)

**Requirements:**

- Build new component from scratch (don't reuse old "Session Details")
- Implement as resizable side panel
- Optimized for events workflow

**Form Fields:**

```
┌─────────────────────────────────┐
│ Presentation Details            │
├─────────────────────────────────┤
│ Title: [________________]       │
│ Room: [Main Auditorium ▼]      │
│ Date: [Nov 18, 2025]            │
│ Start Time: [09:00 AM]          │
│ End Time: [10:00 AM]            │
│ Speaker: [________________]     │
│ Languages: [☑ EN ☑ ES ☐ FR]    │
│ Session ID: A1234 (read-only)   │
│ Passcode: [______] (6 digits)   │
│                                  │
│ [Cancel] [Save]                 │
└─────────────────────────────────┘
```

**States:**

- Enabled: For future (not started) sessions
- Read-only: For active sessions
- Disabled: For past sessions

---

## 5. CSV Upload & Validation

### CSV Template Format

```csv
event_name,room_name,presentation_title,start_time,end_time,languages,speaker
TechConf 2025,Main Auditorium,Opening Keynote,2025-11-18 09:00,2025-11-18 10:00,"en,es,fr",John Doe
TechConf 2025,Main Auditorium,Panel Discussion,2025-11-18 10:15,2025-11-18 11:15,"en,es",Panel
TechConf 2025,Breakout A,AI Workshop,2025-11-19 09:00,2025-11-19 10:30,"en,zh",Jane Smith
```

### Validation Rules

**Must Check:**

- ✅ Schedule conflicts (overlapping times in same room)
- ✅ Required fields present
- ✅ Date/time format valid
- ✅ Session ID format (A-D + digits)
- ✅ Passcode format (6 numeric digits)
- ✅ Room names consistent

**Conflict Example:**

```
ERROR: Schedule conflict in "Main Auditorium"
- Session A ends at 9:05 AM
- Session B starts at 9:00 AM
Action: Fix times in CSV and re-upload
```

### Error Display

**Use existing bulk upload error UI:**

- Clear, actionable error messages
- Specific line numbers where applicable
- Instructions on how to fix
- Allow CSV fix and re-upload

---

## 6. Audio Capture & Transcript Logic

### Core Principle

**Capture more content rather than miss intended material**

### Transcript Cutting Rules

#### Between Back-to-Back Sessions (No Gap)

```
Session A: 9:00-10:00 AM
Session B: 10:00-11:00 AM
Speaker continues past 10:00 AM

RULE: Cut at Session B start time
Result:
- Session A transcript: 9:00-10:00 AM (hard cut)
- Session B transcript: 10:00 AM onwards
```

#### Session Extends Beyond End Time

```
Session: 9:00-10:00 AM (scheduled)
Speaker continues until 10:08 AM
Then 30 seconds silence

RULE: Continue until 30 seconds of silence after scheduled end
Result:
- Transcript ends at ~10:08:30 AM
```

#### With Break Between Sessions

```
Session A: 9:00-10:00 AM
Break: 10:00-10:15 AM
Session B: 10:15-11:00 AM
Speaker finishes at 10:05, then silence

RULE: 30-second silence gap applies
Result:
- Session A: 9:00-10:05:30 AM
- Session B: 10:15 AM onwards (as scheduled)
```

### Silence Gap Threshold

- **Default:** 30 seconds of silence after scheduled end time
- Applied when there's a gap to next session
- Not applied for back-to-back sessions (hard cut at next start)

---

## 7. Language Management

### Configuration Hierarchy

**Event Level → Presentation Level:**

1. Languages configured during event creation
2. Settings permeate to each presentation
3. Each presentation has predefined language list

### Automatic Language Selection (ALS)

- **Default:** ON for all event sessions
- Supports up to 8 languages for automatic detection
- Helps handle unexpected languages

### Present App Override Rule

**CRITICAL:** Session's predefined languages OVERRIDE present app manual changes

**Example:**

```
Session A (10:00-11:00): EN, ES, FR configured
└─ Presenter manually adds DE in present app ✓

Session B (11:00-12:00): EN, ES configured (no FR, no DE)
└─ At 11:00 transition: DE removed, FR removed ✗
└─ Only EN, ES available ✓
```

**Why:**

- Maintains expected behavior per session
- Respects 8-language limit
- Prevents configuration drift
- Each session = fresh start

---

## 8. Present App Behavior

### Reconnection Logic

**Rule:** Present app resumes based on current time and active session

**Scenario:**

```
Room: Sessions 9:00 AM - 5:00 PM
Presenter stops at 10:30 AM
Presenter restarts at 2:15 PM (same link)

Expected:
1. App checks current time (2:15 PM)
2. Identifies active session at 2:15 PM
3. Loads that session's configuration
4. Resumes with correct languages
5. Behaves as if app never stopped
```

### Requirements

- Present app must be schedule-aware
- Query current session based on timestamp
- Load appropriate session metadata
- Apply correct language settings for active session

**Note:** Detailed present app specification in separate document (action item)

---

## 9. Session Editing Rules

### Time Constraints

**CRITICAL:** Event sessions only work on scheduled day

### Edit Permissions

| Session State            | Can Edit Schedule | Can Edit Metadata |
| ------------------------ | ----------------- | ----------------- |
| Not started, future date | ✅ Yes            | ✅ Yes            |
| Started                  | ❌ No             | ❌ No             |
| Past                     | ❌ No             | ❌ No             |

### Rationale

- Times crucial for automatic decision-making
- Enables intelligent audio capture
- Prevents confusion with time-based automation

---

## 10. Technical Implementation Notes

### Session Chaining Architecture

**Structure:**

```json
{
  "event_id": "evt_123",
  "room_id": "room_456",
  "room_session_id": "A1234",
  "session_chain": [
    {
      "presentation_id": "pres_1",
      "start_time": "2025-11-18T09:00:00Z",
      "end_time": "2025-11-18T10:00:00Z",
      "languages": ["en", "es", "fr"],
      "title": "Opening Keynote"
    },
    {
      "presentation_id": "pres_2",
      "start_time": "2025-11-18T10:15:00Z",
      "end_time": "2025-11-18T11:15:00Z",
      "languages": ["en", "es"],
      "title": "Panel Discussion"
    }
  ]
}
```

### Audio Capture Pseudo-Logic

```python
def handle_session_end(current_session, next_session):
    if next_session and next_session.start_time == current_session.end_time:
        # Back-to-back: Hard cut at next start time
        cut_transcript_at(next_session.start_time)
        start_new_session(next_session)

    elif next_session:
        # Gap exists: Use silence detection
        continue_capturing_until(silence_gap=30_seconds)

        # When next session time arrives
        if current_time >= next_session.start_time:
            start_new_session(next_session)

    else:
        # Last session of day
        continue_capturing_until(silence_gap=30_seconds)
        finalize_transcript()
```

---

## 11. Design Changes Checklist

### Prototype Updates Required

**Navigation:**

- [ ] Remove top-level event accordion from Events page
- [ ] Create dedicated Event Detail page template
- [ ] Implement room expandable sections
- [ ] Create linear presentation list layout

**Session Display:**

- [ ] Update session row format (date, time inline)
- [ ] Implement "X upcoming sessions" counter
- [ ] Add date-aware show/hide logic
- [ ] Create Active/Upcoming/Past/All tabs
- [ ] Default to Active tab

**Session IDs:**

- [ ] Update all Session ID displays to new format (A-D + digits)
- [ ] Update passcode fields to 6-digit numeric
- [ ] Remove Mobile ID references
- [ ] Update CSV template
- [ ] Update PDF export templates

**Buttons & Labels:**

- [ ] Change to "Links to join" or "Get links to join"
- [ ] Ensure consistency across all instances

**Presentation Details:**

- [ ] Design new presentation details component
- [ ] Implement as resizable side panel
- [ ] Add all required fields (see Section 4)
- [ ] Create enabled/disabled/read-only states

**CSV Upload:**

- [ ] Update CSV template with new format
- [ ] Design error display using existing bulk upload UI
- [ ] Create example error messages

---

## 12. Out of Scope for V1

**DO NOT IMPLEMENT:**

- ❌ Automated buffer time configuration
- ❌ Event settings editing page (post-creation)
- ❌ Room-level language persistence
- ❌ Manual pause/restart during presentations
- ❌ Event/room fields on standalone session form
- ❌ "Apply to all sessions" functionality
- ❌ In-app CSV error correction (requires engineering feasibility study)

---

## 13. Design Patterns & Principles

### Layout Density

- **Tight, table-like layout** for presentation lists
- One row per presentation
- Minimize vertical space
- Easy scanning of schedule

### Progressive Disclosure

- Collapse past content by default
- Expand active/upcoming automatically
- Allow manual expand for review

### Consistent Terminology

- "Presentation" for individual sessions within event
- "Room" for physical/virtual space
- "Event" for overall conference
- "Session ID" for room-level access code

### State Communication

- Clear visual distinction between Upcoming/Active/Past
- Disabled state for non-editable fields
- Loading states during transitions
- Error states with actionable messages

---

## 14. Edge Cases to Handle

### Schedule Conflicts

```
Scenario: Upload CSV with overlapping times
Action: Display error with specific conflict details
User Flow: Fix CSV → Re-upload
```

### Early Session Start

```
Scenario: Next session starts before previous ends
Behavior: Hard cut at new session start time
UI: Show both sessions as active briefly during overlap
```

### Extended Silence

```
Scenario: Speaker finishes early, long silence
Behavior: Auto-end after 30 seconds of silence
UI: Session shows as completed
```

### Present App Disconnect

```
Scenario: Network interruption during event
Behavior: Reconnect to current session based on time
UI: Show reconnection status
```

### No Upcoming Sessions

```
Scenario: All sessions in room completed
Display: "No upcoming sessions" message
Option: View past sessions in All/Past tab
```

---

## 15. Testing Scenarios

### Critical Paths

1. Create event via CSV upload
2. View event detail page
3. Navigate between Active/Upcoming/Past tabs
4. Edit future presentation details
5. Get links to join room
6. Monitor active presentation
7. Verify session transitions
8. Handle schedule conflicts
9. Test present app reconnection
10. Validate language override behavior

### Edge Cases

1. Overlapping sessions error handling
2. Early session completion (silence)
3. Extended session (speaker runs over)
4. Back-to-back sessions (no gap)
5. Same-day room editing
6. Past event viewing
7. Multiple concurrent events
8. Large CSV uploads (100+ sessions)

---

## 16. Documentation Updates

### Required Updates

- [ ] CSV template file with examples
- [ ] Session ID format documentation
- [ ] Event creation wizard guide
- [ ] Audio capture behavior explanation
- [ ] Language configuration guide
- [ ] Present app reconnection behavior

---

## 17. Quick Reference Tables

### Session States

| State    | Visual        | Edit Schedule | Edit Metadata | Join |
| -------- | ------------- | ------------- | ------------- | ---- |
| Upcoming | Normal        | ✅            | ✅            | ✅   |
| Active   | Highlighted   | ❌            | ❌            | ✅   |
| Past     | Dimmed/Hidden | ❌            | ❌            | ❌   |

### ID Formats

| Type       | Format       | Length    | Example     |
| ---------- | ------------ | --------- | ----------- |
| Session ID | A-D + digits | 5-6 chars | A1234, BC42 |
| Passcode   | Numeric      | 6 digits  | 123456      |

### Tab Behavior

| Tab      | Shows                 | Default |
| -------- | --------------------- | ------- |
| Active   | Today's sessions only | ✅ Yes  |
| Upcoming | Future sessions       | No      |
| Past     | Completed sessions    | No      |
| All      | Everything            | No      |

---

## Implementation Priority

### Phase 1 (Core UI)

1. Event detail page layout
2. Linear presentation list
3. Date-aware display logic
4. Tab navigation

### Phase 2 (Details)

5. Presentation details component
6. Session ID updates
7. Button label updates
8. CSV template updates

### Phase 3 (Polish)

9. State management (active/past/upcoming)
10. Error display improvements
11. Responsive layout refinements
12. Documentation updates

---
