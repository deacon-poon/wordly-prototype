# Wordly Mobile App v2 - Product Specification

## Overview

The native mobile apps for iOS and Android need to be refreshed and fine tuned to better serve our customers. A huge benefit of the mobile apps is that they can be built to run in the background even if your screen turns off or you switch to a different app while running a session. Creating/editing sessions on the app is not necessary, so we can streamline the user experience somewhat.

## Use Cases

- **AV person setting up an event using phone**
- **Push-to-talk concierge mode** - 2 tablets are set up in advance to facilitate conversation when someone comes in
- **Multi-lingual meeting around a table** with a shared session
- **Security levels**
  - Presenter - Passcode required, Login required
  - Attendee - No passcode required, Passcode required, Login required

## New Requirements

- **Must be developed as a native app** to enable deep integration with device audio systems, rather than functioning like a web app
- **Lighter version of the app** without add/edit sessions UX
- **Add push to talk** like the Present web app has
- **Add UI to turn on/off Automatic Language Switching** in Present mode. Needs to display languages already added, and allow user to add/remove languages from the list
- **Enable deep links** into native app to use with Attend URLs
- **Instant sessions**
- **Audio management improvements** - When plugging in headphones, it should not start playing overlapping audio from other apps at the same time. (On the current app, joining as an attendee starts playing my Audible book overlapping when I plug in headphones.)
- **Localization** into 6 primary languages: English, Spanish, French, Japanese, Chinese (Simplified), and German
- **Present mode needs an audio meter** to indicate that they're speaking
- **WCAG compliance from the ground up** - A/AA or AAA
- **Product Analytics integration** (eg. Amplitude, Mixpanel, TBD)

## Development Milestones

1. **Attendee** - Basic attendee functionality with session joining
2. **Presenter** - Advanced presenter controls and audio management
3. **Deep linking** - Universal link handling for seamless session joining
4. **Login** - User authentication and account management
5. **Instant sessions** - Dynamic session creation functionality
6. **Localization** - Multi-language support for global audience

## User Stories

### Attendee Experience

**Core Functionality:**

- Can select language on launch
- Can join a session as an attendee
  - without passcode
  - with passcode
- Can see whether any presenters are in the session
- Can change output language in session
- Can turn on or mute audio output (TTS). Also, audio output turns on automatically when plugging in headphones and turns off automatically when unplugging headphones.
- Can open a deep link URL to a session in the native app
- Can continue to get audio output from the app if the screen turns off or they switch to another app

### Presenter Experience

**Advanced Controls:**

- Can do everything the Attendee can do, plus the following…
- Can join a session as a presenter
  - Can manually enter a session ID (and passcode)
  - Sees session ID and passcode auto-populated if opening via a web deep link
  - Can choose Voice Input Mode
    - Join with microphone on
    - Join using push-to-talk (new to app)

**In-Session Presenter Features:**

- Can select on/off for Automatic Language Switching (UI would be new to app). Needs to display languages already added, and allow user to add/remove languages from the list
- Can see an audio meter to indicate that they're speaking
- Can continue to send input to the app if the screen turns off or they switch to another app
- Can manually select audio input device (for AV folks)

## Deep Linking Implementation

Mobile apps can intercept URLs from the browser and open the corresponding content in the app (if installed). In our case, those URLs are attend or present links.

### Universal Links Strategy

**URL Patterns:**

```
https://wordly.ai/attend/[session-id]?passcode=[code]&lang=[language]
https://wordly.ai/present/[session-id]?passcode=[code]
```

**Implementation Requirements:**

- **iOS**: Universal Links configuration with associated domains
- **Android**: App Links with intent filters and domain verification
- **Fallback Handling**: Graceful degradation to web app if mobile app not installed
- **Parameter Parsing**: Extract session ID, passcode, and language preferences from URLs

### Deep Link User Flow

```
User Flow:
1. User receives attend/present link
2. Clicks link on mobile device
3. If app installed → Opens directly in native app
4. If app not installed → Opens in browser with app store prompt
5. App parses URL parameters and pre-fills session join form
6. User confirms and joins session
```

## Login & Authentication

### Account Integration

**Wordly Account Features:**

- Allow users to login to existing Wordly account
- Enable session access control based on user permissions
- Display personalized session lists (future enhancement)
- Support for enterprise SSO integration (future)

**Authentication Flows:**

- **Email/Password** - Standard login form
- **Social Login** - Google/Apple Sign-In (optional)
- **Guest Access** - No login required for public sessions
- **Session-Level Security** - Login requirements configurable per session

## Instant Sessions

### Dynamic Session Creation

Similar to our functionality with Zoom sessions, we will enable the creation of new sessions instantaneously using predefined session defaults. These instant sessions are generated dynamically when needed (with a unique Session Id and Passcode), allowing for immediate use without additional configuration.

**Key Features:**

- **One-Tap Creation** - Generate session with single button press
- **Predefined Settings** - Use organization defaults for languages and settings
- **Unique Identifiers** - Automatic generation of session ID and passcode
- **Auto-Cleanup** - Sessions automatically removed when all participants disconnect
- **QR Code Generation** - Instant QR codes for easy sharing

**Implementation Requirements:**

- Backend API support for dynamic session creation
- Mobile UI for instant session management
- QR code generation and display
- Session lifecycle management

## Localization Strategy

### Supported Languages

Localize the app into 6 primary languages:

- English (en)
- Spanish (es)
- French (fr)
- Japanese (ja)
- Chinese Simplified (zh-CN)
- German (de)

### Implementation Approach

**Language Detection:**

1. Check OS-level preferred language settings
2. If primary language is supported → Use that language
3. If not supported → Check secondary, tertiary preferences
4. If none supported → Default to English

**Localization Scope:**

- All UI text and labels
- Error messages and notifications
- Audio prompts and TTS announcements
- Help documentation and tooltips
- App store descriptions and metadata

## Design Reference

**Figma Designs** (_Passcode: 42325_)

1. [Attendee experience](https://www.figma.com/design/BzurO71UR99SgXL3Gp1MMn/Mobile-Apps?node-id=525-1446)
2. [Presenter experience](https://www.figma.com/design/BzurO71UR99SgXL3Gp1MMn/Mobile-Apps?node-id=530-587)
3. [Deep linking](https://www.figma.com/design/BzurO71UR99SgXL3Gp1MMn/Mobile-Apps?node-id=574-452&t=Rfs9hTJ47SMAg63N-4)
4. [User authentication](https://www.figma.com/design/BzurO71UR99SgXL3Gp1MMn/Mobile-Apps?node-id=23-3682&t=Rfs9hTJ47SMAg63N-4)
5. [Instant sessions](https://www.figma.com/design/BzurO71UR99SgXL3Gp1MMn/Mobile-Apps?node-id=25-3818&t=Rfs9hTJ47SMAg63N-4)

## Acceptance Criteria

### Functional Requirements

- [ ] All User Stories from above are satisfied
- [ ] Testing in dev environment is completed
- [ ] Penetration & vulnerability testing completed
- [ ] WCAG compliance verified - A/AA or AAA
- [ ] Functionality reviewed and approved by Wordly Product, Engineering, Test, CS, Sales, Partner teams

### Performance Standards

- [ ] App launches in under 3 seconds
- [ ] Session join time under 5 seconds
- [ ] Background audio processing maintains quality
- [ ] Battery usage optimized for extended sessions
- [ ] Memory usage remains stable during long sessions

### Accessibility Standards

- [ ] Screen reader compatibility (VoiceOver/TalkBack)
- [ ] High contrast mode support
- [ ] Large text scaling support (up to 200%)
- [ ] Voice control compatibility
- [ ] Motor accessibility features

## Existing Requirements to Retain

### Right-to-Left Language Support

**Text Bubble Alignment:**

- **Left-to-Right Languages** (e.g. English): Left align all speech bubbles
- **Right-to-Left Languages** (e.g. Hebrew, Arabic): Right align all speech bubbles
- **Dynamic Layout**: UI adapts automatically based on active language

### WebSocket Communication Handling

**Asynchronous Message Processing:**

- **Empty Content Handling**: Occasionally, content of speech bubble is empty (e.g. swear word removed)
- **Out-of-Order Messages**: Sometimes a message arrives after the final message and must be discarded
- **Multi-Speaker Support**: Handle multiple speakers with messages arriving out of order
- **Message Identification**: Each bubble has unique ID, but ID order isn't guaranteed across reconnections
- **Final Message Indicator**: Proper handling of "final message" flags for each speech segment

**Technical Implementation:**

```typescript
interface SpeechBubble {
  id: string;
  speakerId: string;
  content: string;
  isFinal: boolean;
  timestamp: number;
  language: string;
}

// Handle asynchronous speech data
const processSpeechData = (message: SpeechBubble) => {
  // Check if message arrived after final flag
  if (isAfterFinal(message.id)) {
    discardMessage(message);
    return;
  }

  // Handle empty content appropriately
  if (!message.content && !message.isFinal) {
    // Don't display empty initial bubbles
    return;
  }

  // Update or create speech bubble
  updateSpeechBubble(message);
};
```

### Poor Internet Connection Handling

**Audio Buffering Strategy:**

- **Microphone Buffer**: Buffer microphone audio for 5-10 seconds during connection drops
- **Seamless Recovery**: Send buffered audio when connection returns
- **User Feedback**: Only show "lost connection" message for extended outages (>10 seconds)
- **Quality Maintenance**: Prioritize audio quality over real-time transmission during poor connectivity

**Audio Playback Management:**

- **TTS Audio Handling**: Final text bubbles trigger TTS audio file creation
- **Asynchronous Delivery**: Audio arrives separately from text
- **Timeout Management**: Wait limited time for audio before proceeding
- **Order Prevention**: Prevent out-of-order speech playback

**Implementation Strategy:**

```typescript
interface AudioBuffer {
  data: AudioData[];
  maxDuration: number; // 5-10 seconds
  connectionState: "connected" | "disconnected" | "reconnecting";
}

const handleAudioInput = (audioData: AudioData) => {
  if (connectionState === "connected") {
    sendImmediately(audioData);
  } else {
    bufferAudio(audioData);
    if (bufferDuration > maxDuration) {
      showConnectionWarning();
    }
  }
};

const onConnectionRestored = () => {
  sendBufferedAudio();
  clearBuffer();
  hideConnectionWarning();
};
```

### Audio Management Library

**Shared Audio Processing:**

- **Cross-Platform Library**: Shared audio management code between iOS and Android
- **Asynchronous Audio Handling**: Manage audio arrival timing and playback order
- **TTS Integration**: Handle text-to-speech audio file processing
- **Audio Device Management**: Support for multiple input/output devices

## Technical Architecture

### Platform-Specific Requirements

**iOS Implementation:**

- **SwiftUI Framework**: Modern declarative UI framework
- **AVAudioSession**: Advanced audio session management
- **CallKit Integration**: Professional call handling (future enhancement)
- **Background App Refresh**: Maintain session connectivity when backgrounded

**Android Implementation:**

- **Jetpack Compose**: Modern declarative UI framework
- **AudioManager**: System audio control and device management
- **Foreground Service**: Background audio processing
- **MediaSession**: Media control integration

### Shared Components

**Design System:**

- **Color Palette**: Consistent color scheme across platforms
- **Typography**: Standardized font scales and weights
- **Component Library**: Reusable UI components
- **Spacing System**: Consistent layout patterns

**Business Logic:**

- **API Client**: Shared networking layer
- **Session Management**: Common session state handling
- **Audio Processing**: Platform-agnostic audio logic
- **Data Models**: Consistent data structures

## Development Guidelines

### Code Quality Standards

- **Type Safety**: Strong typing for all data models
- **Error Handling**: Comprehensive error states and recovery
- **Testing Coverage**: Unit tests for business logic, UI tests for user flows
- **Performance Monitoring**: Real-time performance tracking
- **Crash Reporting**: Automatic crash detection and reporting

### Security Requirements

- **Data Encryption**: End-to-end encryption for audio streams
- **Secure Storage**: Encrypted local storage for sensitive data
- **Network Security**: Certificate pinning and secure communication
- **Privacy Compliance**: GDPR/CCPA compliance for data handling

This specification provides the comprehensive requirements for developing the Wordly Mobile App v2 with focus on native performance, accessibility, and user experience excellence.
