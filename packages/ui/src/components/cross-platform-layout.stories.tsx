import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

const meta: Meta = {
  title: "Design System/Mobile/Cross-Platform Layout",
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const LayoutGuidelines: Story = {
  render: () => (
    <div className="space-y-12">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Cross-Platform Layout Guidelines
          </h1>
          <p className="text-gray-600 mt-2">
            Universal layout principles that work across web, iOS, and Android
            platforms.
          </p>
        </div>
      </div>

      <section className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Responsive Breakpoints
          </h2>
          <p className="text-gray-600 mb-6">
            Standard breakpoints for responsive design across all platforms.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-lg p-6 bg-white">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Mobile First Breakpoints
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                <span className="font-medium">Small (sm)</span>
                <code className="text-sm bg-white px-2 py-1 rounded">
                  ≥ 640px
                </code>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                <span className="font-medium">Medium (md)</span>
                <code className="text-sm bg-white px-2 py-1 rounded">
                  ≥ 768px
                </code>
              </div>
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
                <span className="font-medium">Large (lg)</span>
                <code className="text-sm bg-white px-2 py-1 rounded">
                  ≥ 1024px
                </code>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
                <span className="font-medium">Extra Large (xl)</span>
                <code className="text-sm bg-white px-2 py-1 rounded">
                  ≥ 1280px
                </code>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-6 bg-white">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Platform Considerations
            </h3>
            <div className="space-y-3">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-medium text-gray-900">iOS</h4>
                <p className="text-sm text-gray-600">
                  iPhone: 375px - 428px
                  <br />
                  iPad: 768px - 1024px+
                </p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-medium text-gray-900">Android</h4>
                <p className="text-sm text-gray-600">
                  Phone: 360px - 414px
                  <br />
                  Tablet: 768px - 1024px+
                </p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-medium text-gray-900">Web</h4>
                <p className="text-sm text-gray-600">
                  Mobile: 320px - 768px
                  <br />
                  Desktop: 1024px+
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Container Guidelines
          </h2>
          <p className="text-gray-600 mb-6">
            Standard container widths and padding for optimal content
            presentation.
          </p>
        </div>

        <div className="space-y-6">
          <div className="border border-gray-200 rounded-lg p-6 bg-white">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Content Container Widths
            </h3>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">
                  Reading Content
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Optimal line length:</span>
                    <code className="ml-2 bg-white px-2 py-1 rounded">
                      45-75 characters
                    </code>
                  </div>
                  <div>
                    <span className="text-gray-600">Max width:</span>
                    <code className="ml-2 bg-white px-2 py-1 rounded">
                      672px (42rem)
                    </code>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Form Content</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Single column:</span>
                    <code className="ml-2 bg-white px-2 py-1 rounded">
                      480px (30rem)
                    </code>
                  </div>
                  <div>
                    <span className="text-gray-600">Multi-column:</span>
                    <code className="ml-2 bg-white px-2 py-1 rounded">
                      768px (48rem)
                    </code>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">
                  Dashboard Content
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Standard:</span>
                    <code className="ml-2 bg-white px-2 py-1 rounded">
                      1200px (75rem)
                    </code>
                  </div>
                  <div>
                    <span className="text-gray-600">Wide:</span>
                    <code className="ml-2 bg-white px-2 py-1 rounded">
                      1440px (90rem)
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-6 bg-white">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Safe Area & Padding
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-semibold text-red-900 mb-2">
                  Mobile (&lt; 768px)
                </h4>
                <ul className="text-sm space-y-1">
                  <li>
                    Side padding:{" "}
                    <code className="bg-white px-1 rounded">16px</code>
                  </li>
                  <li>
                    Top/bottom:{" "}
                    <code className="bg-white px-1 rounded">16px</code>
                  </li>
                  <li>
                    Safe area:{" "}
                    <code className="bg-white px-1 rounded">
                      Respect platform
                    </code>
                  </li>
                </ul>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">
                  Tablet (768px+)
                </h4>
                <ul className="text-sm space-y-1">
                  <li>
                    Side padding:{" "}
                    <code className="bg-white px-1 rounded">24px</code>
                  </li>
                  <li>
                    Top/bottom:{" "}
                    <code className="bg-white px-1 rounded">24px</code>
                  </li>
                  <li>
                    Content max-width:{" "}
                    <code className="bg-white px-1 rounded">Based on type</code>
                  </li>
                </ul>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">
                  Desktop (1024px+)
                </h4>
                <ul className="text-sm space-y-1">
                  <li>
                    Side padding:{" "}
                    <code className="bg-white px-1 rounded">32px</code>
                  </li>
                  <li>
                    Top/bottom:{" "}
                    <code className="bg-white px-1 rounded">32px</code>
                  </li>
                  <li>
                    Center content:{" "}
                    <code className="bg-white px-1 rounded">Auto margins</code>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Grid Systems
          </h2>
          <p className="text-gray-600 mb-6">
            Flexible grid systems for consistent layouts across platforms.
          </p>
        </div>

        <div className="space-y-6">
          <div className="border border-gray-200 rounded-lg p-6 bg-white">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              12-Column Grid
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-12 gap-2 text-xs">
                {Array.from({ length: 12 }, (_, i) => (
                  <div key={i} className="bg-blue-100 p-2 text-center rounded">
                    {i + 1}
                  </div>
                ))}
              </div>
              <div className="text-sm text-gray-600">
                <p>
                  <strong>Mobile:</strong> Stack to single column below 768px
                </p>
                <p>
                  <strong>Tablet:</strong> Use 6-column or 4-column layouts
                </p>
                <p>
                  <strong>Desktop:</strong> Full 12-column flexibility
                </p>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-6 bg-white">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Common Layout Patterns
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Two-Column Layout</h4>
                <div className="grid grid-cols-2 gap-2 h-16">
                  <div className="bg-gray-200 rounded flex items-center justify-center text-xs">
                    Main (8 cols)
                  </div>
                  <div className="bg-gray-300 rounded flex items-center justify-center text-xs">
                    Sidebar (4 cols)
                  </div>
                </div>
                <p className="text-xs text-gray-600">
                  Responsive: Stack on mobile
                </p>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">
                  Three-Column Layout
                </h4>
                <div className="grid grid-cols-3 gap-2 h-16">
                  <div className="bg-gray-200 rounded flex items-center justify-center text-xs">
                    4 cols
                  </div>
                  <div className="bg-gray-300 rounded flex items-center justify-center text-xs">
                    4 cols
                  </div>
                  <div className="bg-gray-200 rounded flex items-center justify-center text-xs">
                    4 cols
                  </div>
                </div>
                <p className="text-xs text-gray-600">
                  Responsive: Stack on tablet, single on mobile
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Navigation Patterns
          </h2>
          <p className="text-gray-600 mb-6">
            Platform-appropriate navigation implementations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="border border-gray-200 rounded-lg p-6 bg-white">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Mobile Navigation
            </h3>
            <div className="space-y-4">
              <div className="bg-gray-50 p-3 rounded">
                <h4 className="font-medium text-sm mb-2">Bottom Tab Bar</h4>
                <div className="flex justify-between text-xs">
                  <div className="text-center">
                    <div className="w-6 h-6 bg-blue-200 rounded mb-1 mx-auto"></div>
                    <span>Home</span>
                  </div>
                  <div className="text-center">
                    <div className="w-6 h-6 bg-gray-200 rounded mb-1 mx-auto"></div>
                    <span>Search</span>
                  </div>
                  <div className="text-center">
                    <div className="w-6 h-6 bg-gray-200 rounded mb-1 mx-auto"></div>
                    <span>Profile</span>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  iOS & Android standard
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <h4 className="font-medium text-sm mb-2">Hamburger Menu</h4>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gray-300 rounded"></div>
                  <span className="text-sm">Slide-out navigation</span>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Web fallback pattern
                </p>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-6 bg-white">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Tablet Navigation
            </h3>
            <div className="space-y-4">
              <div className="bg-gray-50 p-3 rounded">
                <h4 className="font-medium text-sm mb-2">Split View</h4>
                <div className="grid grid-cols-3 gap-2 h-12">
                  <div className="bg-gray-300 rounded flex items-center justify-center text-xs">
                    Sidebar
                  </div>
                  <div className="col-span-2 bg-gray-200 rounded flex items-center justify-center text-xs">
                    Content
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  iPad standard pattern
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <h4 className="font-medium text-sm mb-2">Top Tab Bar</h4>
                <div className="space-y-2">
                  <div className="flex space-x-1">
                    <div className="flex-1 bg-blue-200 text-center py-1 rounded text-xs">
                      Active
                    </div>
                    <div className="flex-1 bg-gray-200 text-center py-1 rounded text-xs">
                      Tab 2
                    </div>
                    <div className="flex-1 bg-gray-200 text-center py-1 rounded text-xs">
                      Tab 3
                    </div>
                  </div>
                  <div className="h-8 bg-gray-100 rounded"></div>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Android tablet pattern
                </p>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-6 bg-white">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Desktop Navigation
            </h3>
            <div className="space-y-4">
              <div className="bg-gray-50 p-3 rounded">
                <h4 className="font-medium text-sm mb-2">Horizontal Nav</h4>
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <div className="bg-blue-200 px-3 py-1 rounded text-xs">
                      Home
                    </div>
                    <div className="bg-gray-200 px-3 py-1 rounded text-xs">
                      Products
                    </div>
                    <div className="bg-gray-200 px-3 py-1 rounded text-xs">
                      About
                    </div>
                  </div>
                  <div className="h-8 bg-gray-100 rounded"></div>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Web standard pattern
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <h4 className="font-medium text-sm mb-2">Sidebar + Header</h4>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="grid grid-cols-4 gap-2 h-8">
                    <div className="bg-gray-300 rounded"></div>
                    <div className="col-span-3 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Dashboard applications
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  ),
};
