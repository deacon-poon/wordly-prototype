import type { Meta, StoryObj } from "@storybook/react";
import {
  MobileGuideline,
  GuidelineSection,
  ImplementationGuide,
  SizingStandard,
} from "./mobile-guidelines";

const meta: Meta<typeof MobileGuideline> = {
  title: "Design System/Mobile/Guidelines",
  component: MobileGuideline,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof MobileGuideline>;

export const MobileImplementationGuidelines: Story = {
  render: () => (
    <div className="space-y-12">
      <MobileGuideline
        title="Cross-Platform Sizing Standards"
        description="Universal sizing guidelines for implementing components across iOS, Android, and web platforms."
      >
        <GuidelineSection
          title="Touch Target Standards"
          description="Minimum interactive area requirements for accessibility and usability"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SizingStandard
              component="Primary Buttons"
              description="Main action buttons in forms and dialogs"
              specifications={[
                {
                  property: "Minimum height",
                  value: "44px",
                  notes: "iOS requirement",
                },
                {
                  property: "Recommended height",
                  value: "48px",
                  notes: "Better for Android Material Design",
                },
                {
                  property: "Minimum width",
                  value: "88dp/88px",
                  notes: "Material Design guideline",
                },
                {
                  property: "Border radius",
                  value: "8px",
                  notes: "Use design token radius-lg",
                },
              ]}
              touchTarget={{
                minimum: "44px × 44px",
                recommended: "48px × 48px",
                notes: "Include padding in touch target calculation",
              }}
            />

            <SizingStandard
              component="Secondary Buttons"
              description="Secondary actions and ghost buttons"
              specifications={[
                {
                  property: "Minimum height",
                  value: "40px",
                  notes: "Can be smaller than primary",
                },
                {
                  property: "Recommended height",
                  value: "44px",
                  notes: "Consistency with touch targets",
                },
                {
                  property: "Border width",
                  value: "1px",
                  notes: "Ensure visibility on all backgrounds",
                },
                {
                  property: "Border radius",
                  value: "8px",
                  notes: "Match primary button radius",
                },
              ]}
              touchTarget={{
                minimum: "44px × 44px",
                recommended: "44px × 88px",
                notes:
                  "Ensure adequate spacing between multiple secondary buttons",
              }}
            />

            <SizingStandard
              component="Form Inputs"
              description="Text fields, selects, and input components"
              specifications={[
                {
                  property: "Minimum height",
                  value: "48px",
                  notes: "Accessibility and touch-friendly",
                },
                {
                  property: "Recommended height",
                  value: "56px",
                  notes: "Material Design standard",
                },
                {
                  property: "Horizontal padding",
                  value: "16px",
                  notes: "Comfortable text spacing",
                },
                {
                  property: "Border radius",
                  value: "4px",
                  notes: "Use design token radius-md",
                },
              ]}
              touchTarget={{
                minimum: "48px × 48px",
                recommended: "56px × full width",
                notes: "Full-width inputs are easier to target on mobile",
              }}
            />

            <SizingStandard
              component="Icon Buttons"
              description="Icon-only interactive elements"
              specifications={[
                {
                  property: "Button size",
                  value: "44px × 44px",
                  notes: "Minimum touch target",
                },
                {
                  property: "Icon size",
                  value: "24px × 24px",
                  notes: "Clear visibility",
                },
                { property: "Padding", value: "10px", notes: "(44 - 24) / 2" },
                {
                  property: "Border radius",
                  value: "22px",
                  notes: "Circular or 4px for square",
                },
              ]}
              touchTarget={{
                minimum: "44px × 44px",
                recommended: "48px × 48px",
                notes: "Consider larger size for primary actions",
              }}
            />
          </div>
        </GuidelineSection>

        <GuidelineSection
          title="Typography Sizing"
          description="Text sizing standards for mobile readability"
        >
          <div className="space-y-4">
            <SizingStandard
              component="Body Text"
              description="Main content text"
              specifications={[
                {
                  property: "Font size",
                  value: "16px",
                  notes: "iOS recommendation, Android default",
                },
                {
                  property: "Line height",
                  value: "24px (1.5)",
                  notes: "Optimal reading experience",
                },
                {
                  property: "Minimum contrast",
                  value: "4.5:1",
                  notes: "WCAG AA requirement",
                },
                {
                  property: "Preferred contrast",
                  value: "7:1",
                  notes: "WCAG AAA recommendation",
                },
              ]}
            />

            <SizingStandard
              component="Small Text"
              description="Captions, footnotes, helper text"
              specifications={[
                {
                  property: "Font size",
                  value: "14px",
                  notes: "Minimum for mobile readability",
                },
                {
                  property: "Line height",
                  value: "20px (1.43)",
                  notes: "Tighter spacing for small text",
                },
                {
                  property: "Use cases",
                  value: "Captions, timestamps, helper text",
                  notes: "Avoid for primary content",
                },
              ]}
            />

            <SizingStandard
              component="Headings"
              description="Section titles and headings"
              specifications={[
                { property: "H1 size", value: "32px", notes: "Page titles" },
                {
                  property: "H2 size",
                  value: "24px",
                  notes: "Section headings",
                },
                {
                  property: "H3 size",
                  value: "20px",
                  notes: "Subsection headings",
                },
                {
                  property: "Line height",
                  value: "1.2-1.3",
                  notes: "Tighter for headings",
                },
              ]}
            />
          </div>
        </GuidelineSection>

        <GuidelineSection
          title="Spacing & Layout"
          description="Consistent spacing for mobile layouts"
        >
          <div className="space-y-4">
            <SizingStandard
              component="Screen Padding"
              description="Edge spacing from screen borders"
              specifications={[
                {
                  property: "Mobile padding",
                  value: "16px",
                  notes: "iOS and Android standard",
                },
                {
                  property: "Tablet padding",
                  value: "24px",
                  notes: "More generous on larger screens",
                },
                {
                  property: "Safe area",
                  value: "Respect platform",
                  notes: "iOS notch, Android gesture area",
                },
              ]}
            />

            <SizingStandard
              component="Component Spacing"
              description="Vertical spacing between elements"
              specifications={[
                {
                  property: "Small gap",
                  value: "8px",
                  notes: "Related elements",
                },
                {
                  property: "Medium gap",
                  value: "16px",
                  notes: "Form fields, card content",
                },
                {
                  property: "Large gap",
                  value: "24px",
                  notes: "Sections, major content blocks",
                },
                {
                  property: "Section break",
                  value: "32px",
                  notes: "Major layout sections",
                },
              ]}
            />
          </div>
        </GuidelineSection>
      </MobileGuideline>

      <MobileGuideline
        title="Platform-Specific Implementation"
        description="Platform-specific considerations for iOS, Android, and web implementations."
      >
        <GuidelineSection
          title="iOS Implementation"
          description="iOS-specific design and interaction patterns"
        >
          <ImplementationGuide
            platform="iOS (Swift/SwiftUI)"
            requirements={[
              "Use SF Pro font family for text",
              "Follow iOS Human Interface Guidelines",
              "Implement haptic feedback for interactions",
              "Support Dynamic Type for accessibility",
              "Use iOS-native navigation patterns",
            ]}
            examples={[
              { label: "Primary font", value: "SF Pro Text/Display" },
              { label: "System button height", value: "44pt minimum" },
              { label: "Corner radius", value: "8pt (maps to 8px)" },
              { label: "Safe area", value: "Use safeAreaInsets" },
            ]}
            notes={[
              "Points (pt) in iOS equal pixels (px) on @1x screens",
              "Use semantic colors that adapt to dark mode",
              "Consider larger text sizes for accessibility",
            ]}
          />
        </GuidelineSection>

        <GuidelineSection
          title="Android Implementation"
          description="Android-specific design and Material Design patterns"
        >
          <ImplementationGuide
            platform="Android (Kotlin/Jetpack Compose)"
            requirements={[
              "Use Roboto font family for text",
              "Follow Material Design 3 guidelines",
              "Implement Material ripple effects",
              "Support Material You dynamic colors",
              "Use Android-native navigation patterns",
            ]}
            examples={[
              { label: "Primary font", value: "Roboto Regular/Medium/Bold" },
              { label: "Button height", value: "48dp recommended" },
              { label: "Corner radius", value: "8dp" },
              { label: "Elevation", value: "2dp for cards, 6dp for FAB" },
            ]}
            notes={[
              "Use dp (density-independent pixels) for all sizing",
              "Support material color schemes",
              "Consider gesture navigation spacing",
            ]}
          />
        </GuidelineSection>

        <GuidelineSection
          title="Web Implementation"
          description="Web-specific responsive design considerations"
        >
          <ImplementationGuide
            platform="Web (React/CSS)"
            requirements={[
              "Use system font stack for performance",
              "Implement responsive breakpoints",
              "Support keyboard navigation",
              "Provide focus indicators",
              "Ensure proper semantic HTML",
            ]}
            examples={[
              { label: "Font stack", value: "system-ui, sans-serif" },
              { label: "Mobile breakpoint", value: "768px" },
              { label: "Touch targets", value: "44px minimum" },
              { label: "Focus outline", value: "2px solid currentColor" },
            ]}
            notes={[
              "Use rem units for scalable text",
              "Consider hover states for desktop",
              "Test with browser zoom up to 200%",
            ]}
          />
        </GuidelineSection>
      </MobileGuideline>

      <MobileGuideline
        title="Accessibility Standards"
        description="Universal accessibility requirements for all platforms."
      >
        <GuidelineSection
          title="Visual Accessibility"
          description="Color, contrast, and visual design requirements"
        >
          <div className="space-y-4">
            <SizingStandard
              component="Color Contrast"
              description="Text and background color requirements"
              specifications={[
                {
                  property: "Normal text",
                  value: "4.5:1 minimum",
                  notes: "WCAG AA standard",
                },
                {
                  property: "Large text",
                  value: "3:1 minimum",
                  notes: "18pt+ or 14pt+ bold",
                },
                {
                  property: "UI components",
                  value: "3:1 minimum",
                  notes: "Buttons, form controls",
                },
                {
                  property: "Focus indicators",
                  value: "3:1 minimum",
                  notes: "Against adjacent colors",
                },
              ]}
            />

            <SizingStandard
              component="Focus Management"
              description="Keyboard and assistive technology navigation"
              specifications={[
                {
                  property: "Focus outline",
                  value: "2px minimum",
                  notes: "Visible focus indicator",
                },
                {
                  property: "Focus order",
                  value: "Logical sequence",
                  notes: "Top to bottom, left to right",
                },
                {
                  property: "Skip links",
                  value: "Provide for main content",
                  notes: "Keyboard navigation efficiency",
                },
              ]}
            />
          </div>
        </GuidelineSection>

        <GuidelineSection
          title="Interaction Accessibility"
          description="Touch and interaction accessibility standards"
        >
          <ImplementationGuide
            platform="Universal Accessibility"
            requirements={[
              "Minimum 44px × 44px touch targets",
              "Adequate spacing between interactive elements",
              "Clear labels for all interactive elements",
              "Consistent interaction patterns",
              "Error prevention and clear error messages",
            ]}
            examples={[
              { label: "Touch target", value: "44px × 44px minimum" },
              { label: "Target spacing", value: "8px minimum between" },
              {
                label: "Label association",
                value: "aria-label or associated <label>",
              },
              { label: "Error announcement", value: "aria-live regions" },
            ]}
            notes={[
              "Test with screen readers on each platform",
              "Provide alternative text for images",
              "Ensure form validation is announced",
            ]}
          />
        </GuidelineSection>
      </MobileGuideline>
    </div>
  ),
};

export const QuickReference: Story = {
  render: () => (
    <MobileGuideline
      title="Quick Reference Guide"
      description="Essential measurements and standards for immediate reference."
    >
      <GuidelineSection title="Essential Measurements">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Touch Targets</h4>
            <ul className="text-sm space-y-1">
              <li>
                <strong>Minimum:</strong> 44px × 44px
              </li>
              <li>
                <strong>Recommended:</strong> 48px × 48px
              </li>
              <li>
                <strong>Spacing:</strong> 8px minimum between
              </li>
            </ul>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-2">Typography</h4>
            <ul className="text-sm space-y-1">
              <li>
                <strong>Body text:</strong> 16px minimum
              </li>
              <li>
                <strong>Small text:</strong> 14px minimum
              </li>
              <li>
                <strong>Line height:</strong> 1.5 for body text
              </li>
            </ul>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold text-purple-900 mb-2">Spacing</h4>
            <ul className="text-sm space-y-1">
              <li>
                <strong>Screen padding:</strong> 16px mobile
              </li>
              <li>
                <strong>Component gap:</strong> 16px standard
              </li>
              <li>
                <strong>Section break:</strong> 32px major
              </li>
            </ul>
          </div>
        </div>
      </GuidelineSection>

      <GuidelineSection title="Platform Font Stacks">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-200 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">iOS</h4>
            <code className="text-xs bg-gray-100 p-2 rounded block">
              SF Pro Text, SF Pro Display, system-ui
            </code>
          </div>
          <div className="border border-gray-200 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Android</h4>
            <code className="text-xs bg-gray-100 p-2 rounded block">
              Roboto, system-ui, sans-serif
            </code>
          </div>
          <div className="border border-gray-200 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Web</h4>
            <code className="text-xs bg-gray-100 p-2 rounded block">
              system-ui, -apple-system, sans-serif
            </code>
          </div>
        </div>
      </GuidelineSection>
    </MobileGuideline>
  ),
};
