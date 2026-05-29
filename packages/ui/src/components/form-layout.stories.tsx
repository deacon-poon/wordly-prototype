import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Design System/Mobile/Form Layout Guidelines",
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const FormLayoutGuidelines: Story = {
  render: () => (
    <div className="space-y-12">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Form Layout Guidelines
          </h1>
          <p className="text-gray-600 mt-2">
            Cross-platform form design patterns optimized for usability and
            accessibility.
          </p>
        </div>
      </div>

      <section className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Form Field Standards
          </h2>
          <p className="text-gray-600 mb-6">
            Consistent field sizing and spacing for optimal user experience.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="border border-gray-200 rounded-lg p-6 bg-white">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Input Field Sizing
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Standard Input (48px height)
                  </label>
                  <input
                    type="text"
                    className="w-full h-12 px-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Standard text input"
                  />
                  <p className="text-xs text-gray-500">
                    Minimum 48px height for touch accessibility
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Large Input (56px height)
                  </label>
                  <input
                    type="text"
                    className="w-full h-14 px-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Large text input for mobile"
                  />
                  <p className="text-xs text-gray-500">
                    Recommended 56px height for mobile-first design
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Textarea (Multiple rows)
                  </label>
                  <textarea
                    className="w-full h-24 px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
                    placeholder="Multi-line text input"
                    rows={3}
                  />
                  <p className="text-xs text-gray-500">
                    Minimum 3 rows, allow vertical resize
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 bg-white">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Button Sizing
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">
                    Primary Action (48px)
                  </p>
                  <button className="w-full h-12 px-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    Submit Form
                  </button>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">
                    Secondary Action (44px)
                  </p>
                  <button className="w-full h-11 px-6 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    Cancel
                  </button>
                </div>

                <div className="flex space-x-3">
                  <button className="flex-1 h-12 px-6 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Primary
                  </button>
                  <button className="flex-1 h-12 px-6 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50">
                    Secondary
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  Side-by-side buttons for dual actions
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="border border-gray-200 rounded-lg p-6 bg-white">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Spacing Standards
              </h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    Vertical Spacing
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span>Between form fields:</span>
                      <code className="bg-gray-100 px-2 py-1 rounded">
                        16px
                      </code>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Between field groups:</span>
                      <code className="bg-gray-100 px-2 py-1 rounded">
                        24px
                      </code>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Before submit button:</span>
                      <code className="bg-gray-100 px-2 py-1 rounded">
                        32px
                      </code>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Between form sections:</span>
                      <code className="bg-gray-100 px-2 py-1 rounded">
                        40px
                      </code>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    Label Positioning
                  </h4>
                  <div className="space-y-3">
                    <div className="border border-gray-200 rounded p-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Top Label (Recommended)
                      </label>
                      <input
                        type="text"
                        className="w-full h-12 px-4 border border-gray-300 rounded-md"
                        placeholder="Input field"
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Top labels work best for mobile and accessibility
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 bg-white">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Error States
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full h-12 px-4 border-2 border-red-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="your@email.com"
                    value="invalid-email"
                    readOnly
                  />
                  <p className="text-sm text-red-600 flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Please enter a valid email address
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    type="password"
                    className="w-full h-12 px-4 border-2 border-red-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="••••••••"
                    value="123"
                    readOnly
                  />
                  <p className="text-sm text-red-600 flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Password must be at least 8 characters
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Form Layout Patterns
          </h2>
          <p className="text-gray-600 mb-6">
            Common form layouts that work well across different screen sizes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="border border-gray-200 rounded-lg p-6 bg-white">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Single Column (Mobile-First)
            </h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  className="w-full h-12 px-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  className="w-full h-12 px-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full h-12 px-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="john@example.com"
                />
              </div>
              <div className="pt-4">
                <button className="w-full h-12 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Submit
                </button>
              </div>
            </form>
            <p className="text-xs text-gray-500 mt-4">
              Optimal for mobile devices and narrow screens
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-6 bg-white">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Two Column (Desktop)
            </h3>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="w-full h-12 px-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="w-full h-12 px-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full h-12 px-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="john@example.com"
                />
              </div>
              <div className="pt-4">
                <button className="w-full h-12 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Submit
                </button>
              </div>
            </form>
            <p className="text-xs text-gray-500 mt-4">
              Use for related fields on wider screens
            </p>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-6 bg-white">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Multi-Section Form
          </h3>
          <form className="space-y-8">
            <section>
              <h4 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Personal Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="w-full h-12 px-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="w-full h-12 px-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Doe"
                  />
                </div>
              </div>
            </section>

            <section>
              <h4 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Contact Information
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full h-12 px-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="w-full h-12 px-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
            </section>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button className="flex-1 h-12 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Save & Continue
              </button>
              <button className="flex-1 h-12 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50">
                Save as Draft
              </button>
            </div>
          </form>
          <p className="text-xs text-gray-500 mt-4">
            Break long forms into logical sections with clear headers
          </p>
        </div>
      </section>

      <section className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Platform-Specific Considerations
          </h2>
          <p className="text-gray-600 mb-6">
            Platform-specific form behavior and interaction patterns.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="border border-gray-200 rounded-lg p-6 bg-white">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              iOS Forms
            </h3>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">
                  Native Behaviors
                </h4>
                <ul className="text-sm space-y-1 text-blue-800">
                  <li>• Auto-zoom on input focus</li>
                  <li>• Native keyboard types</li>
                  <li>• Haptic feedback on errors</li>
                  <li>• Native date/time pickers</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">
                  Implementation Tips
                </h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• Use appropriate inputmode attributes</li>
                  <li>• Implement proper autocomplete</li>
                  <li>• Support Dynamic Type scaling</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-6 bg-white">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Android Forms
            </h3>
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">
                  Material Design
                </h4>
                <ul className="text-sm space-y-1 text-green-800">
                  <li>• Floating labels</li>
                  <li>• Material ripple effects</li>
                  <li>• Consistent elevation</li>
                  <li>• Material You theming</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">
                  Implementation Tips
                </h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• Use Material Text Fields</li>
                  <li>• Implement proper autofill</li>
                  <li>• Support system font scaling</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-6 bg-white">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Web Forms
            </h3>
            <div className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-2">
                  Web Standards
                </h4>
                <ul className="text-sm space-y-1 text-purple-800">
                  <li>• HTML5 form validation</li>
                  <li>• Keyboard navigation</li>
                  <li>• Screen reader support</li>
                  <li>• Progressive enhancement</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">
                  Implementation Tips
                </h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• Use semantic HTML elements</li>
                  <li>• Implement ARIA labels</li>
                  <li>• Support browser autofill</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  ),
};
