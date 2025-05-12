import type { Meta, StoryObj } from "@storybook/react";
import { AccessibilityGuide, AccessibilityRule } from "./accessibility-guide";
import { Button } from "./button";
import { Typography } from "./typography";

const meta: Meta<typeof AccessibilityGuide> = {
  title: "Design System/Accessibility",
  component: AccessibilityGuide,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AccessibilityGuide>;

export const AccessibilityGuidelines: Story = {
  render: () => (
    <div className="space-y-12">
      <AccessibilityGuide
        title="Accessibility Guidelines"
        description="Our design system is built with accessibility as a core principle. These guidelines ensure that our applications are usable by everyone, including people with disabilities."
      >
        <AccessibilityRule
          title="Provide sufficient color contrast"
          description="Text should have a contrast ratio of at least 4.5:1 against its background for normal text and 3:1 for large text."
          importance="critical"
          wcagCriteria="WCAG 2.1 Success Criterion 1.4.3 Contrast (Minimum)"
          goodExample={
            <div className="bg-gray-900 p-4 rounded">
              <span className="text-white">
                White text on dark background (Ratio: 16:1)
              </span>
            </div>
          }
          badExample={
            <div className="bg-gray-300 p-4 rounded">
              <span className="text-gray-500">
                Light gray text on gray background (Ratio: 2:1)
              </span>
            </div>
          }
        />

        <AccessibilityRule
          title="Include text alternatives for images"
          description="All images that convey information must have alt text or be described in context."
          importance="critical"
          wcagCriteria="WCAG 2.1 Success Criterion 1.1.1 Non-text Content"
          goodExample={
            <div className="p-2">
              <code>{'<img src="logo.png" alt="Wordly company logo" />'}</code>
            </div>
          }
          badExample={
            <div className="p-2">
              <code>{'<img src="logo.png" />'}</code>
            </div>
          }
        />

        <AccessibilityRule
          title="Ensure keyboard accessibility"
          description="All interactive elements must be accessible and operable with a keyboard alone."
          importance="critical"
          wcagCriteria="WCAG 2.1 Success Criterion 2.1.1 Keyboard"
          goodExample={
            <div className="p-2">
              <Button>Keyboard accessible button</Button>
            </div>
          }
          badExample={
            <div className="p-2">
              <div
                role="button"
                className="inline-block px-4 py-2 bg-blue-500 text-white rounded"
                onClick={() => {}}
              >
                Div with onClick but no keyboard handling
              </div>
            </div>
          }
        />

        <AccessibilityRule
          title="Use semantic HTML"
          description="Use appropriate HTML elements for their intended purpose to ensure good structure and navigation."
          importance="high"
          wcagCriteria="WCAG 2.1 Success Criterion 1.3.1 Info and Relationships"
          goodExample={
            <div className="p-2">
              <code>{'<button type="button">Click me</button>'}</code>
            </div>
          }
          badExample={
            <div className="p-2">
              <code>
                {'<div className="button" onClick={handleClick}>Click me</div>'}
              </code>
            </div>
          }
        />

        <AccessibilityRule
          title="Provide visible focus indicators"
          description="Users navigating with a keyboard must be able to see which element is currently focused."
          importance="high"
          wcagCriteria="WCAG 2.1 Success Criterion 2.4.7 Focus Visible"
          goodExample={
            <div className="p-2 border">
              <Button className="ring ring-offset-2 ring-blue-500">
                Focused button with visible outline
              </Button>
            </div>
          }
          badExample={
            <div className="p-2 border">
              <code>{":focus { outline: none; }"}</code>
              <Typography variant="small" className="block mt-2">
                Removing focus indicators without alternatives
              </Typography>
            </div>
          }
        />

        <AccessibilityRule
          title="Use ARIA attributes correctly"
          description="When HTML semantics are not sufficient, use ARIA attributes to enhance accessibility."
          importance="high"
          wcagCriteria="WCAG 2.1 Success Criterion 4.1.2 Name, Role, Value"
          goodExample={
            <div className="p-2">
              <code>
                {
                  '<div role="button" aria-pressed="false" tabIndex={0}>Toggle</div>'
                }
              </code>
            </div>
          }
          badExample={
            <div className="p-2">
              <code>{'<div role="button">Toggle</div>'}</code>
              <Typography variant="small" className="block mt-2">
                Missing keyboard accessibility and state
              </Typography>
            </div>
          }
        />

        <AccessibilityRule
          title="Support text resizing"
          description="Content must remain accessible when text is resized up to 200% without loss of functionality."
          importance="medium"
          wcagCriteria="WCAG 2.1 Success Criterion 1.4.4 Resize Text"
          goodExample={
            <div className="p-2">
              <Typography variant="small">
                Use relative units (rem, em) for text sizing
              </Typography>
              <code className="block mt-2">
                {"font-size: 1rem; /* Scales with user preferences */"}
              </code>
            </div>
          }
          badExample={
            <div className="p-2">
              <Typography variant="small">
                Fixed pixel sizes don't scale well
              </Typography>
              <code className="block mt-2">
                {"font-size: 12px; /* Doesn't adapt to user preferences */"}
              </code>
            </div>
          }
        />

        <AccessibilityRule
          title="Provide clear form labels"
          description="All form fields should have visible, associated labels."
          importance="high"
          wcagCriteria="WCAG 2.1 Success Criterion 3.3.2 Labels or Instructions"
          goodExample={
            <div className="p-2">
              <div className="mb-2">
                <label
                  htmlFor="name-good"
                  className="block text-sm font-medium mb-1"
                >
                  Name
                </label>
                <input
                  id="name-good"
                  type="text"
                  className="px-3 py-2 border rounded w-full"
                />
              </div>
            </div>
          }
          badExample={
            <div className="p-2">
              <input
                type="text"
                placeholder="Name"
                className="px-3 py-2 border rounded w-full"
              />
              <Typography variant="small" className="block mt-2">
                Placeholder text as the only label
              </Typography>
            </div>
          }
        />
      </AccessibilityGuide>

      <AccessibilityGuide
        title="Testing Accessibility"
        description="Use these methods to test accessibility in your applications."
      >
        <AccessibilityRule
          title="Automated testing tools"
          description="Use automated tools as a first pass to catch obvious accessibility issues."
          importance="recommendation"
          goodExample={
            <div className="space-y-2">
              <Typography variant="small">Recommended tools:</Typography>
              <ul className="list-disc list-inside">
                <li>axe DevTools</li>
                <li>WAVE</li>
                <li>Lighthouse</li>
                <li>ESLint jsx-a11y plugin</li>
              </ul>
            </div>
          }
        />

        <AccessibilityRule
          title="Keyboard navigation testing"
          description="Test all functionality using only the keyboard."
          importance="high"
          goodExample={
            <div className="space-y-2">
              <Typography variant="small">Testing checklist:</Typography>
              <ul className="list-disc list-inside">
                <li>Can you reach all interactive elements using Tab?</li>
                <li>Is the focus order logical?</li>
                <li>Can you activate all controls with Enter or Space?</li>
                <li>Can you use Escape to close modals?</li>
                <li>Can you navigate all dropdown menus using arrow keys?</li>
              </ul>
            </div>
          }
        />

        <AccessibilityRule
          title="Screen reader testing"
          description="Test with screen readers to ensure content is properly announced."
          importance="high"
          goodExample={
            <div className="space-y-2">
              <Typography variant="small">
                Recommended screen readers:
              </Typography>
              <ul className="list-disc list-inside">
                <li>NVDA or JAWS (Windows)</li>
                <li>VoiceOver (macOS)</li>
                <li>TalkBack (Android)</li>
                <li>VoiceOver (iOS)</li>
              </ul>
            </div>
          }
        />
      </AccessibilityGuide>
    </div>
  ),
};
