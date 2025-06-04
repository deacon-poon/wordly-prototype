# Mobile Design Prototyping Strategy

## Overview

This document outlines the technical approach for creating high-fidelity mobile design prototypes using Expo as the design source of truth. **Note: This prototyping approach is separate from the actual native iOS/Android development - Expo is used solely for design validation and stakeholder review.**

## Architecture Philosophy

### Design Source of Truth

- **Expo Framework**: Used exclusively for design prototyping and validation
- **Native Development**: Actual iOS and Android apps will be developed natively
- **Shared Design System**: Common design tokens and UI patterns across all platforms

### Prototyping vs Production

```
Prototyping Stack (Design Source of Truth):
├── Expo + Expo Router
├── TypeScript
├── NativeWind (Tailwind for Mobile)
├── Shared Storybook
└── React Native Web (for URL sharing)

Production Stack (Actual Apps):
├── Native iOS (Swift/SwiftUI)
├── Native Android (Kotlin/Compose)
├── Shared Design Tokens
└── API Integration Layer
```

## Technical Implementation Details

### Framework Selection: Expo + Expo Router

**Why Expo Router for Prototyping:**

- **Familiar Patterns**: Mirrors Next.js App Router structure
- **File-based Routing**: Same mental model as current web app
- **TypeScript First**: Consistent development experience
- **Rapid Iteration**: Changes reflect instantly via hot reload

**Project Structure:**

```
wordly-mobile-prototype/
├── app/                    # Expo Router (mirrors Next.js)
│   ├── (tabs)/
│   │   ├── index.tsx      # Home/Language Selection
│   │   └── sessions.tsx   # Session Management
│   ├── session/
│   │   └── [id].tsx       # Dynamic session screens
│   ├── present/
│   │   └── [id].tsx       # Presenter interface
│   └── _layout.tsx        # Root navigation layout
├── components/            # Reusable UI components
├── design-system/         # Shared design tokens
└── shared/               # Business logic (for native apps)
```

### Styling Strategy: Maximum Design Parity

**NativeWind Implementation:**

```jsx
// Identical Tailwind classes work across platforms
<View className="flex-1 bg-white p-4">
  <Text className="text-lg font-semibold text-gray-900 mb-4">Join Session</Text>
  <Pressable className="bg-blue-500 px-6 py-3 rounded-lg">
    <Text className="text-white font-medium">Connect</Text>
  </Pressable>
</View>
```

**Design Token System:**

```typescript
// design-system/tokens.ts - Shared across all platforms
export const designTokens = {
  colors: {
    primary: {
      50: "#eff6ff",
      500: "#3b82f6",
      900: "#1e3a8a",
    },
    semantic: {
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
    },
  },
  typography: {
    fontFamily: {
      sans: ["Inter", "system-ui", "sans-serif"],
      mono: ["SF Mono", "Menlo", "monospace"],
    },
    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
};
```

### Component Architecture

**Platform-Agnostic Design Components:**

```typescript
// Shared component interfaces
interface SessionJoinProps {
  sessionId?: string;
  language?: string;
  mode: "attendee" | "presenter";
  onJoin: (data: SessionJoinData) => void;
}

// Prototype implementation (Expo)
const SessionJoinForm: React.FC<SessionJoinProps> = ({ mode, onJoin }) => {
  // High-fidelity prototype implementation
};

// Native implementation guidelines exported for developers
export const nativeImplementationGuide = {
  ios: "Use SwiftUI Form with matching visual design",
  android: "Use Compose LazyColumn with Material Design 3",
  sharedLogic: "Business logic patterns defined in shared/ folder",
};
```

### Storybook Integration

**Unified Design System Documentation:**

```typescript
// components/SessionJoin/SessionJoin.stories.tsx
export default {
  title: "Mobile/Session/Join",
  component: SessionJoinForm,
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
    docs: {
      description: {
        component:
          "Session join interface for both attendee and presenter modes",
      },
    },
  },
};

export const AttendeeMode: StoryObj = {
  args: {
    mode: "attendee",
    sessionId: "DEMO-001",
  },
};

export const PresenterMode: StoryObj = {
  args: {
    mode: "presenter",
    requiresPasscode: true,
  },
};

// Cross-platform comparison view
export const PlatformComparison: StoryObj = {
  render: () => (
    <div className="grid grid-cols-3 gap-4">
      <div className="text-center">
        <h3>Expo Prototype</h3>
        <SessionJoinForm mode="attendee" />
      </div>
      <div className="text-center">
        <h3>iOS Guidelines</h3>
        <NativeImplementationPreview platform="ios" />
      </div>
      <div className="text-center">
        <h3>Android Guidelines</h3>
        <NativeImplementationPreview platform="android" />
      </div>
    </div>
  ),
};
```

## Deliverable Strategy

### Multi-Platform Sharing

**Primary Deliverable - Web Version:**

```bash
# Deploy prototype as web app for instant sharing
npx expo export --platform web
vercel deploy

# Shareable URL: https://wordly-mobile-prototype.vercel.app
```

**Secondary Deliverables:**

- **QR Code Access**: `exp://exp.host/@wordly/mobile-prototype` (requires Expo Go)
- **Cloud Simulator**: Appetize.io embed for browser-based testing
- **Development Builds**: EAS builds for internal team testing

### Feature Demonstrations

**Interactive Prototyping Features:**

```typescript
// Mock QR scanning for web demonstrations
const QRScannerDemo = () => {
  const mockQRCodes = [
    { id: "ATTEND-001", sessionId: "medical-conference-123", mode: "attendee" },
    { id: "PRESENT-001", sessionId: "board-meeting-456", mode: "presenter" },
  ];

  return (
    <View className="p-4">
      <Text className="text-xl font-bold mb-4">Demo QR Codes</Text>
      {mockQRCodes.map((qr) => (
        <MockQRCode
          key={qr.id}
          data={qr}
          onScan={() => navigateToSession(qr)}
        />
      ))}
    </View>
  );
};
```

**High-Fidelity Interactions:**

- **Audio Simulation**: Mock audio streams with visual feedback
- **Push-to-Talk**: Visual indicators and state management
- **Language Switching**: Smooth transitions and UI updates
- **Deep Link Handling**: URL parameter parsing and navigation

## Development Workflow

### Prototype Development Cycle

```bash
# Development commands
npm run dev                # Expo development server
npm run dev:storybook      # Component documentation
npm run deploy:web         # Web version deployment
npm run deploy:native      # Update native prototype

# Testing workflow
npm run test               # Component unit tests
npm run test:e2e          # End-to-end user flows
npm run audit:a11y        # Accessibility compliance
```

### Design Handoff Process

**For Native Development Teams:**

1. **Visual Specifications**: Storybook documentation with exact measurements
2. **Interaction Patterns**: Prototype demonstrates user flows
3. **Design Tokens**: Exported JSON/XML for native implementation
4. **Behavioral Logic**: Shared TypeScript interfaces and state patterns

```typescript
// Export specifications for native teams
export const nativeSpecs = {
  components: {
    button: {
      variants: ["primary", "secondary", "ghost"],
      sizes: ["sm", "md", "lg"],
      states: ["default", "pressed", "disabled"],
      animations: {
        press: "scale(0.95) with 100ms ease",
        ripple: "material design ripple effect",
      },
    },
  },
  navigation: {
    transitions: "iOS: push/pop, Android: slide/fade",
    tabBar: "bottom navigation with badges",
    modal: "sheet presentation on iOS, fullscreen on Android",
  },
};
```

## Quality Assurance

### Accessibility First Design

**WCAG Compliance Implementation:**

```jsx
// Accessibility-first component design
<Pressable
  accessible={true}
  accessibilityRole="button"
  accessibilityLabel="Join session as attendee"
  accessibilityHint="Connects you to the interpretation session"
  className="bg-blue-500 px-6 py-3 rounded-lg"
>
  <Text className="text-white font-medium">Join Session</Text>
</Pressable>
```

**Testing Checklist:**

- [ ] Screen reader compatibility (iOS VoiceOver, Android TalkBack)
- [ ] High contrast mode support
- [ ] Large text scaling (up to 200%)
- [ ] Keyboard navigation (external keyboards)
- [ ] Color contrast ratios (AA minimum, AAA preferred)

### Cross-Platform Validation

**Design Consistency Checks:**

- Visual regression testing across viewport sizes
- Component behavior consistency verification
- Performance benchmarks (60fps interactions)
- Internationalization layout testing (RTL languages)

## Integration with Native Development

### Design Token Export

**For iOS Development:**

```swift
// Generated from design tokens
struct WordlyDesignTokens {
    struct Colors {
        static let primary500 = UIColor(hex: "#3b82f6")
        static let background = UIColor(hex: "#ffffff")
    }

    struct Typography {
        static let bodyLarge = UIFont.systemFont(ofSize: 18, weight: .regular)
        static let headlineMedium = UIFont.systemFont(ofSize: 20, weight: .semibold)
    }
}
```

**For Android Development:**

```xml
<!-- Generated colors.xml -->
<resources>
    <color name="primary_500">#3b82f6</color>
    <color name="background">#ffffff</color>
</resources>

<!-- Generated dimens.xml -->
<resources>
    <dimen name="spacing_sm">8dp</dimen>
    <dimen name="spacing_md">16dp</dimen>
</resources>
```

### Shared Business Logic

**TypeScript Interfaces for Native Implementation:**

```typescript
// Shared data models and business logic
export interface SessionData {
  id: string;
  passcode?: string;
  languages: Language[];
  mode: "attendee" | "presenter";
  audioSettings: AudioSettings;
}

export interface AudioSettings {
  inputDevice?: AudioDevice;
  outputEnabled: boolean;
  pushToTalkEnabled: boolean;
  automaticLanguageSwitching: boolean;
}

// State management patterns
export const sessionReducer = (state: SessionState, action: SessionAction) => {
  // Business logic that native apps should mirror
};
```

## Maintenance and Updates

### Prototype Lifecycle

**Continuous Design Validation:**

- Weekly stakeholder reviews via web URL
- Bi-weekly native team sync for implementation guidance
- Monthly accessibility audits
- Quarterly design system updates

**Version Control:**

```
main branch:     Production-ready prototype
develop branch:  Active feature development
feature branches: Individual feature prototypes
release tags:    Milestone deliverables
```

This prototyping strategy ensures that design decisions are validated early while providing clear implementation guidance for the native development teams.
