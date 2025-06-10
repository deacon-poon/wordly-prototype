# Wordly Mobile App v2 - Technical Specification

## Overview

The native mobile apps for iOS and Android need to be refreshed and fine tuned to better serve our customers. A huge benefit of the mobile apps is that they can be built to run in the background even if your screen turns off or you switch to a different app while running a session. Creating/editing sessions on the app is not necessary, so we can streamline the user experience somewhat.

## Use Cases

### Primary Use Cases

- **AV person setting up an event using phone** - Technical setup and monitoring
- **Push-to-talk concierge mode** - 2 tablets are set up in advance to facilitate conversation when someone comes in
- **Multi-lingual meeting around a table** - Shared session for group conversations
- **Security levels** - Flexible access control based on requirements

### Security Level Requirements

- **Presenter** - Passcode required, Login required
- **Attendee** - No passcode required, Passcode required, Login required

## New Requirements

### Core Technical Requirements

- [x] **Native app development** - Must be developed as a native app to enable deep integration with device audio systems, rather than functioning like a web app
- [x] **Streamlined UX** - Lighter version of the app without add/edit sessions UX
- [ ] **Push-to-talk functionality** - Add push to talk like the Present web app has
- [ ] **Automatic Language Switching UI** - Add UI to turn on/off Automatic Language Switching in Present mode. Needs to display languages already added, and allow user to add/remove languages from the list
- [ ] **Deep linking** - Enable deep links into native app to use with Attend URLs
- [ ] **Instant sessions** - Quick session creation capability
- [ ] **Audio management** - When plugging in headphones, it should not start playing overlapping audio from other apps at the same time

### Quality & Accessibility Requirements

- [ ] **Localization** - Into 6 primary languages: English, Spanish, French, Japanese, Chinese (Simplified), and German
- [ ] **Audio indicators** - Present mode needs an audio meter to indicate that they're speaking
- [ ] **WCAG compliance** - From the ground up - A/AA or AAA
- [ ] **Analytics integration** - Product Analytics integration (eg. Amplitude, Mixpanel, TBD)

## Development Milestones

### Phase 1: Attendee Experience

- [ ] Basic attendee functionality
- [ ] Language selection and audio output
- [ ] Session joining capabilities
- [ ] Background audio support

### Phase 2: Presenter Experience

- [ ] Presenter-specific features
- [ ] Push-to-talk functionality
- [ ] Audio input controls
- [ ] Language switching UI

### Phase 3: Deep Linking

- [ ] Universal Links implementation
- [ ] URL interception and handling
- [ ] Session auto-population

### Phase 4: Authentication

- [ ] Wordly account login
- [ ] Session access control
- [ ] User session management

### Phase 5: Instant Sessions

- [ ] Dynamic session creation
- [ ] Predefined defaults integration
- [ ] Auto-cleanup functionality

### Phase 6: Localization & Polish

- [ ] Multi-language UI support
- [ ] WCAG compliance verification
- [ ] Analytics implementation
- [ ] Performance optimization

## User Stories

### Attendee User Stories

#### Language & Audio Management

- **As an attendee**, I can select my preferred language on app launch
- **As an attendee**, I can change my output language during an active session
- **As an attendee**, I can turn on or mute audio output (TTS)
- **As an attendee**, I experience automatic audio activation when plugging in headphones
- **As an attendee**, I experience automatic audio deactivation when unplugging headphones

#### Session Participation

- **As an attendee**, I can join a session without requiring a passcode
- **As an attendee**, I can join a session by entering a required passcode
- **As an attendee**, I can see whether any presenters are currently in the session
- **As an attendee**, I can continue receiving audio output when my screen turns off
- **As an attendee**, I can continue receiving audio output when switching to another app

#### Deep Linking

- **As an attendee**, I can open a deep link URL to a session directly in the native app

### Presenter User Stories

#### Enhanced Capabilities

- **As a presenter**, I can perform all attendee functions plus additional presenter-specific features
- **As a presenter**, I can manually enter a session ID and passcode
- **As a presenter**, I can see session ID and passcode auto-populated when opening via web deep link
- **As a presenter**, I can choose my Voice Input Mode:
  - Join with microphone always on
  - Join using push-to-talk mode

#### Session Management

- **As a presenter**, I can toggle Automatic Language Switching on/off
- **As a presenter**, I can view currently added languages
- **As a presenter**, I can add/remove languages from the active list
- **As a presenter**, I can see an audio meter indicating when I'm speaking
- **As a presenter**, I can continue sending input when my screen turns off
- **As a presenter**, I can continue sending input when switching to another app
- **As a presenter**, I can manually select my audio input device (for AV professionals)

## Technical Implementation Details

### Deep Linking Architecture

Mobile apps can intercept URLs from the browser and open the corresponding content in the app (if installed). In our case, those URLs are attend or present links.

#### Universal Links Implementation

- iOS Universal Links configuration
- Android App Links setup
- URL pattern matching for attend/present links
- Fallback to web browser when app not installed

### Authentication System

#### Wordly Account Integration

- Allow users to login to existing Wordly accounts
- Enable session access control based on user permissions
- Support for displaying user-accessible session lists
- Future capability for login-required presenter/attendee sessions

### Instant Sessions Feature

Similar to Zoom session functionality, enable creation of new sessions instantaneously using predefined session defaults.

#### Technical Requirements

- Dynamic session generation with unique Session ID and Passcode
- Integration with predefined session defaults
- Automatic session cleanup when ended or all participants disconnect
- Backend engineering support required for full functionality

### Localization Framework

#### Supported Languages

1. English (default)
2. Spanish
3. French
4. Japanese
5. Chinese (Simplified)
6. German

#### Implementation Strategy

- OS-level preferred language detection
- Cascade through user's language preferences (1st, 2nd, 3rd choice)
- Default to English if no supported language found
- Full UI localization for all supported languages

## Design Resources

### Figma Documentation

_Passcode for Figma access: 42325_

1. **Attendee Experience**: [Figma Link](https://www.figma.com/design/BzurO71UR99SgXL3Gp1MMn/Mobile-Apps?node-id=525-1446)
2. **Presenter Experience**: [Figma Link](https://www.figma.com/design/BzurO71UR99SgXL3Gp1MMn/Mobile-Apps?node-id=530-587)
3. **Deep Linking**: [Figma Link](https://www.figma.com/design/BzurO71UR99SgXL3Gp1MMn/Mobile-Apps?node-id=574-452&t=Rfs9hTJ47SMAg63N-4)
4. **User Authentication**: [Figma Link](https://www.figma.com/design/BzurO71UR99SgXL3Gp1MMn/Mobile-Apps?node-id=23-3682&t=Rfs9hTJ47SMAg63N-4)
5. **Instant Sessions**: [Figma Link](https://www.figma.com/design/BzurO71UR99SgXL3Gp1MMn/Mobile-Apps?node-id=25-3818&t=Rfs9hTJ47SMAg63N-4)

## Acceptance Criteria

### Functional Requirements

- [ ] All user stories from above are satisfied
- [ ] Testing in development environment completed
- [ ] Penetration & vulnerability testing passed
- [ ] WCAG compliance verified (A/AA or AAA level)
- [ ] Functionality reviewed and approved by all stakeholder teams:
  - [ ] Wordly Product team
  - [ ] Engineering team
  - [ ] Test team
  - [ ] Customer Success team
  - [ ] Sales team
  - [ ] Partner team

## Legacy Requirements (Retain/Rebuild)

### Right-to-Left Language Support

#### Text Bubble Alignment

- **Left-to-right languages** (e.g., English): Left align all speech bubbles
- **Right-to-left languages** (e.g., Hebrew): Right align all speech bubbles

### WebSocket Communication Handling

#### Asynchronous Data Stream Management

- **Speech bubble components**: speaker, content, "final message" indicator
- **Out-of-order message handling**: Messages can arrive out of sequence with multiple speakers
- **Empty content handling**:
  - Initial empty bubbles should not display
  - Content removal from existing bubbles is valid behavior
- **Late message management**: Discard messages arriving after "final" flag
- **Bubble identification**: Each bubble has unique ID (order not guaranteed across reconnections)

#### Edge Cases

- Occasionally, speech bubble content is empty (e.g., inappropriate content removed)
- Messages may arrive after final message and must be discarded
- Connection drops require careful state management

### Poor Internet Connection Resilience

#### Audio Input Buffering

- **Buffer duration**: 5-10 seconds of microphone audio during connection drops
- **Seamless recovery**: Buffered audio sends automatically when connection restores
- **User experience**: Minimize "lost connection" messages for brief outages
- **Extended outages**: Display connection status only for longer disruptions

#### Audio Output Management

- **TTS audio delivery**: Final text bubbles trigger audio file creation and transmission
- **Atomic delivery**: App receives complete message or nothing (no partial buffering)
- **Asynchronous handling**: Audio arrives separately from text
- **Timing management**:
  - App anticipates audio upon receiving final text
  - Limited wait time before proceeding without audio
  - Prevent out-of-order speech playback
- **Shared library**: Common audio management component handles asynchronous delivery

#### Connection Drop Documentation

- Some documentation exists for connection drops
- Out-of-order message handling complexities not fully documented
- Requires comprehensive edge case handling

## Technology Stack

### Development Framework

- **React Native + Expo** - Cross-platform development
- **NativeWind** - TailwindCSS for React Native styling
- **TypeScript** - Type safety and development experience

### Audio & Media

- **Native audio APIs** - Deep device integration
- **WebSocket connections** - Real-time communication
- **Audio buffering** - Connection resilience

### Analytics & Monitoring

- **Product Analytics** - Amplitude, Mixpanel, or similar
- **Performance monitoring** - React Native performance tools
- **Crash reporting** - Native crash detection and reporting

## Next Steps - Attendee App Focus

### Immediate Development Priority

1. **Attendee experience implementation** - Core functionality first
2. **Language selection and audio management** - Foundation features
3. **Session joining capabilities** - Basic connectivity
4. **Background audio support** - Key differentiator from web app

### Development Environment

- Expo development environment is ready
- Focus on attendee user stories as the foundation
- Iterate on design and functionality before expanding to presenter features

---

_Last updated: [Current Date]_
_Document version: 1.0_
_Status: Initial specification - Ready for attendee app development_
