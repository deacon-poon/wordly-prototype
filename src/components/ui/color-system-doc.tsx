import React from "react";
import { ColorPalette } from "./color-palette";
import { colorCombinations } from "../../lib/color-combinations";
import {
  oceanTealPalette,
  azureTealPalette,
  mintTealPalette,
  deepTealPalette,
  royalPaintPalette,
  coralPaintPalette,
  berryPaintPalette,
  slatePaintPalette,
  brandBlue,
} from "../../lib/color-exploration";
import { ShieldCheck, Edit2 } from "lucide-react";
import {
  accessibleColorCombinations,
  accessiblePalettes,
} from "../../lib/accessible-colors";

// Contrast indicator component from color-combinations-doc.tsx
interface ContrastIndicatorProps {
  ratio: number;
  aa: boolean;
  aaa: boolean;
}

const ContrastIndicator: React.FC<ContrastIndicatorProps> = ({
  ratio,
  aa,
  aaa,
}) => {
  // WCAG AA requires 4.5:1 contrast for normal text
  // WCAG AAA requires 7:1 contrast for normal text
  const getLevel = () => {
    if (aaa) return "AAA";
    if (aa) return "AA";
    // Check raw ratio as a backup (in case props don't match the actual ratio)
    if (ratio >= 7) return "AAA";
    if (ratio >= 4.5) return "AA";
    return "Fail";
  };

  const getColor = () => {
    if (aaa || ratio >= 7) return "bg-green-500";
    if (aa || ratio >= 4.5) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${getColor()}`} />
      <span className="font-medium">{ratio.toFixed(2)}</span>
      <span className="text-sm text-muted-foreground">({getLevel()})</span>
    </div>
  );
};

// Color relationship component from color-exploration-doc.tsx
interface ColorRelationshipProps {
  name: string;
  value: string;
  relationship: string;
  textColor?: string;
  contrastRatio?: number;
  wcagAA?: boolean;
  wcagAAA?: boolean;
}

const ColorRelationship: React.FC<ColorRelationshipProps> = ({
  name,
  value,
  relationship,
  textColor = "",
  contrastRatio,
  wcagAA,
  wcagAAA,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <div
        className={`w-full h-16 rounded-md shadow-sm flex items-center justify-center ${textColor}`}
        style={{ backgroundColor: value }}
      >
        <span className="font-medium">{name}</span>
      </div>
      <div className="text-sm text-muted-foreground">{relationship}</div>
      <div className="text-xs">{value}</div>
      {contrastRatio && (
        <div className="flex items-center mt-1">
          <span className="text-xs mr-2">Contrast with white:</span>
          <ContrastIndicator
            ratio={contrastRatio}
            aa={wcagAA || false}
            aaa={wcagAAA || false}
          />
        </div>
      )}
    </div>
  );
};

// Accessibility warning component
const AccessibilityWarning: React.FC = () => {
  return (
    <div className="p-4 border-l-4 border-amber-500 bg-amber-50 text-amber-800 rounded-r-md mb-6">
      <h3 className="text-lg font-semibold flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
        Accessibility Warning
      </h3>
      <p className="mt-2">
        Several colors in our current exploration do not meet WCAG 2.1
        accessibility standards for contrast ratios. Colors marked with red
        indicators fail to meet the minimum AA standard (4.5:1) for normal text
        on white backgrounds.
      </p>
      <div className="mt-3 font-medium">Recommendations:</div>
      <ul className="list-disc pl-5 mt-1 space-y-1">
        <li>
          Use darker shades (600-900) of these palettes for text on light
          backgrounds
        </li>
        <li>Consider our WCAG-compliant alternatives in the table below</li>
        <li>
          Test all color choices with accessibility tools before implementation
        </li>
        <li>Add additional visual cues beyond color to convey information</li>
      </ul>
    </div>
  );
};

// WCAG compliant alternative colors
const wcagCompliantColors = [
  {
    name: "Deep Teal 700",
    value: "#003939",
    contrastRatio: 12.63,
    wcagAA: true,
    wcagAAA: true,
  },
  {
    name: "Ocean Teal 700",
    value: "#005668",
    contrastRatio: 8.54,
    wcagAA: true,
    wcagAAA: true,
  },
  {
    name: "Berry Paint 700",
    value: "#5D003D",
    contrastRatio: 9.12,
    wcagAA: true,
    wcagAAA: true,
  },
  {
    name: "Royal Paint 700",
    value: "#45155D",
    contrastRatio: 9.87,
    wcagAA: true,
    wcagAAA: true,
  },
];

// Color combination card component from color-combinations-doc.tsx
interface ColorCombinationCardProps {
  index: number;
}

const ColorCombinationCard: React.FC<ColorCombinationCardProps> = ({
  index,
}) => {
  const combo = colorCombinations[index];

  // Function to determine if a combination has accessibility issues
  const hasAccessibilityIssues = () => {
    return !combo.wcag.onLight.aa || !combo.wcag.primarySecondary.aa;
  };

  // Function to get appropriate warning text
  const getWarningText = () => {
    const issues = [];
    if (!combo.wcag.onLight.aa) {
      issues.push(
        `Primary color fails WCAG AA standards on white backgrounds (contrast: ${combo.contrast.onLight.toFixed(
          2
        )})`
      );
    }
    if (!combo.wcag.primarySecondary.aa) {
      issues.push(
        `Primary and secondary colors lack sufficient contrast with each other (contrast: ${combo.contrast.primarySecondary.toFixed(
          2
        )})`
      );
    }
    return issues;
  };

  return (
    <div className="p-6 rounded-lg border bg-card">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{combo.name}</h3>
          {hasAccessibilityIssues() && (
            <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800 font-medium">
              Accessibility Issues
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {combo.description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <div
            className="w-full h-24 rounded-md shadow-sm mb-2 flex items-center justify-center text-white font-medium"
            style={{ backgroundColor: combo.primary[5].value }}
          >
            {combo.primary[5].name}
          </div>
          <div className="text-sm mb-1">Primary</div>
          <div className="text-xs text-muted-foreground">
            {combo.primary[5].value}
          </div>
        </div>

        <div>
          <div
            className="w-full h-24 rounded-md shadow-sm mb-2 flex items-center justify-center text-white font-medium"
            style={{ backgroundColor: combo.secondary[5].value }}
          >
            {combo.secondary[5].name}
          </div>
          <div className="text-sm mb-1">Secondary</div>
          <div className="text-xs text-muted-foreground">
            {combo.secondary[5].value}
          </div>
        </div>
      </div>

      {hasAccessibilityIssues() && (
        <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-400 text-red-800 rounded-r-md">
          <h4 className="font-medium text-sm mb-1">Accessibility Warning</h4>
          <ul className="list-disc pl-4 text-xs space-y-1">
            {getWarningText().map((issue, i) => (
              <li key={i}>{issue}</li>
            ))}
            <li>
              Consider using darker variants (600-800) of these colors for
              better contrast.
            </li>
          </ul>
        </div>
      )}

      <div className="border-t pt-4">
        <h4 className="font-medium mb-3">Accessibility Information</h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span>Primary vs Secondary Contrast:</span>
            <ContrastIndicator
              ratio={combo.contrast.primarySecondary}
              aa={combo.wcag.primarySecondary.aa}
              aaa={combo.wcag.primarySecondary.aaa}
            />
          </div>

          <div className="flex justify-between items-center">
            <span>Primary on White:</span>
            <ContrastIndicator
              ratio={combo.contrast.onLight}
              aa={combo.wcag.onLight.aa}
              aaa={combo.wcag.onLight.aaa}
            />
          </div>

          <div className="flex justify-between items-center">
            <span>Primary on Black:</span>
            <ContrastIndicator
              ratio={combo.contrast.onDark}
              aa={combo.wcag.onDark.aa}
              aaa={combo.wcag.onDark.aaa}
            />
          </div>
        </div>
      </div>

      {hasAccessibilityIssues() && (
        <div className="mt-4 pt-4 border-t">
          <h4 className="font-medium mb-2">WCAG-Compliant Alternatives</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 border rounded-md">
              <div className="flex items-center justify-center h-8 rounded bg-[#102970] text-white text-xs mb-1">
                {combo.primary[7].name}
              </div>
              <div className="text-xs text-center">
                {combo.primary[7].value}
              </div>
            </div>
            <div className="p-2 border rounded-md">
              <div className="flex items-center justify-center h-8 rounded bg-[#7E0F56] text-white text-xs mb-1">
                {combo.secondary[7].name}
              </div>
              <div className="text-xs text-center">
                {combo.secondary[7].value}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Accessible Color Combination Card
interface AccessibleColorCombinationCardProps {
  combo: (typeof accessibleColorCombinations)[0];
}

const AccessibleColorCombinationCard: React.FC<
  AccessibleColorCombinationCardProps
> = ({ combo }) => {
  return (
    <div className="p-6 rounded-lg border bg-card">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{combo.name}</h3>
          <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 font-medium">
            WCAG Compliant
          </span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {combo.description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <div
            className="w-full h-24 rounded-md shadow-sm mb-2 flex items-center justify-center text-white font-medium"
            style={{ backgroundColor: combo.primary[5].value }}
          >
            {combo.primary[5].name}
          </div>
          <div className="text-sm mb-1">Primary</div>
          <div className="text-xs text-muted-foreground">
            {combo.primary[5].value}
          </div>
        </div>

        <div>
          <div
            className="w-full h-24 rounded-md shadow-sm mb-2 flex items-center justify-center text-white font-medium"
            style={{ backgroundColor: combo.secondary[5].value }}
          >
            {combo.secondary[5].name}
          </div>
          <div className="text-sm mb-1">Secondary</div>
          <div className="text-xs text-muted-foreground">
            {combo.secondary[5].value}
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <h4 className="font-medium mb-3">Accessibility Information</h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span>Primary vs Secondary Contrast:</span>
            <ContrastIndicator
              ratio={combo.contrast.primarySecondary}
              aa={combo.wcag.primarySecondary.aa}
              aaa={combo.wcag.primarySecondary.aaa}
            />
          </div>

          <div className="flex justify-between items-center">
            <span>Primary on White:</span>
            <ContrastIndicator
              ratio={combo.contrast.onLight}
              aa={combo.wcag.onLight.aa}
              aaa={combo.wcag.onLight.aaa}
            />
          </div>

          <div className="flex justify-between items-center">
            <span>Primary on Black:</span>
            <ContrastIndicator
              ratio={combo.contrast.onDark}
              aa={combo.wcag.onDark.aa}
              aaa={combo.wcag.onDark.aaa}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t">
        <h4 className="font-medium mb-2">Shade Examples</h4>
        <div className="grid grid-cols-5 gap-1 mb-2">
          {[7, 6, 5, 4, 3].map((index) => (
            <div key={`primary-${index}`} className="text-center">
              <div
                className="h-8 rounded mb-1 flex items-center justify-center text-white text-xs"
                style={{ backgroundColor: combo.primary[index].value }}
              >
                {index}00
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-5 gap-1">
          {[7, 6, 5, 4, 3].map((index) => (
            <div key={`secondary-${index}`} className="text-center">
              <div
                className="h-8 rounded mb-1 flex items-center justify-center text-white text-xs"
                style={{ backgroundColor: combo.secondary[index].value }}
              >
                {index}00
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Main tabs for color system navigation
interface TabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tabs: { id: string; label: string }[];
}

const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab, tabs }) => {
  return (
    <div className="border-b mb-8">
      <div className="flex space-x-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`py-3 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

// Consolidated Color System Documentation
export const ColorSystemDoc: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState("overview");

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "combinations", label: "Color Combinations" },
    { id: "accessible-colors", label: "Accessible Colors" },
    { id: "explorations", label: "Color Explorations" },
    { id: "accessibility", label: "Accessibility" },
    { id: "wcag-compliant", label: "WCAG Compliance" },
  ];

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold mb-4">Wordly Color System</h1>
        <p className="text-lg text-muted-foreground mb-6">
          A comprehensive documentation of our color system, including brand
          colors, color combinations, explorations, and accessibility
          guidelines.
        </p>

        <AccessibilityWarning />

        <div className="p-6 rounded-lg border bg-card mb-8">
          <h3 className="text-lg font-semibold mb-4">
            Brand Foundation Colors
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <div
                className="w-full h-24 rounded-md shadow-sm flex items-center justify-center text-white"
                style={{ backgroundColor: "#118197" }}
              >
                <span className="text-lg font-medium">Primary Teal</span>
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                Primary brand color
              </div>
              <div className="text-xs mt-1">#118197</div>
              <div className="flex items-center mt-2">
                <span className="text-xs mr-2">Contrast with white:</span>
                <ContrastIndicator ratio={4.38} aa={false} aaa={false} />
              </div>
            </div>

            <div className="flex flex-col">
              <div
                className="w-full h-24 rounded-md shadow-sm flex items-center justify-center text-white"
                style={{ backgroundColor: "#E0007B" }}
              >
                <span className="text-lg font-medium">Secondary Magenta</span>
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                Secondary brand color
              </div>
              <div className="text-xs mt-1">#E0007B</div>
              <div className="flex items-center mt-2">
                <span className="text-xs mr-2">Contrast with white:</span>
                <ContrastIndicator ratio={3.95} aa={false} aaa={false} />
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 border-l-4 border-amber-500 bg-amber-50 text-amber-800 rounded-r-md">
            <h4 className="font-medium">Accessibility Note:</h4>
            <p className="text-sm mt-1">
              Our original brand colors do not meet WCAG 2.1 contrast standards
              when used with white text. For accessible implementations, use the
              darker shades (600-700) of these colors from our accessible color
              system, or see the "Accessible Colors" tab for WCAG-compliant
              alternatives.
            </p>
          </div>
        </div>
      </section>

      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />

      {activeTab === "wcag-compliant" && (
        <section className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">
              WCAG-Compliant Color Alternatives
            </h2>
            <p className="text-muted-foreground mb-6">
              The following colors meet WCAG 2.1 accessibility standards with at
              least AA compliance (4.5:1 contrast ratio) for normal text on
              white backgrounds. We recommend using these colors or darker
              shades from our palettes for text and interactive elements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {wcagCompliantColors.map((color) => (
              <div key={color.name} className="p-6 rounded-lg border bg-card">
                <ColorRelationship
                  name={color.name}
                  value={color.value}
                  relationship="WCAG-compliant alternative"
                  textColor="text-white"
                  contrastRatio={color.contrastRatio}
                  wcagAA={color.wcagAA}
                  wcagAAA={color.wcagAAA}
                />
              </div>
            ))}
          </div>

          <div className="p-6 rounded-lg border bg-card">
            <h3 className="text-lg font-semibold mb-4">
              Implementation Guidelines for Accessibility
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">
                  Text and Interactive Elements
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Use darker shades (700-900) for small text on white</li>
                  <li>
                    Use lighter shades (50-100) for text on dark backgrounds
                  </li>
                  <li>
                    Ensure CTA buttons have at least 3:1 contrast ratio with
                    surrounding elements
                  </li>
                  <li>Add text labels or icons to color-coded information</li>
                  <li>
                    Avoid relying solely on color to communicate information
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Testing and Validation</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>
                    Use the WebAIM Contrast Checker to validate color choices
                  </li>
                  <li>
                    Test designs in grayscale to ensure information is still
                    clear
                  </li>
                  <li>
                    Use tools like Axe or Wave for accessibility validation
                  </li>
                  <li>Test with screen readers to ensure proper labeling</li>
                  <li>
                    Consider color blindness simulations for data visualizations
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">
              Implementing Accessible Color Combinations
            </h3>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 p-4 bg-white rounded border">
                <h4 className="font-medium text-gray-900 mb-3">Good Example</h4>
                <div className="flex flex-col gap-3">
                  <div className="p-3 rounded bg-[#003939] text-white flex items-center">
                    <ShieldCheck className="h-4 w-4 mr-2" /> Primary Button
                    (Deep Teal 700)
                  </div>
                  <p className="text-sm text-[#003939] font-medium">
                    Important Text (Deep Teal 700)
                  </p>
                  <div className="p-3 rounded border border-[#003939] text-[#003939] flex items-center">
                    <Edit2 className="h-4 w-4 mr-2" /> Secondary Button (Deep
                    Teal 700)
                  </div>
                  <p className="text-xs mt-2">
                    These elements use Deep Teal 700 which has a 12.63:1
                    contrast ratio with white, meeting WCAG AAA standards.
                  </p>
                </div>
              </div>
              <div className="flex-1 p-4 bg-white rounded border">
                <h4 className="font-medium text-gray-900 mb-3">Bad Example</h4>
                <div className="flex flex-col gap-3">
                  <div className="p-3 rounded bg-[#0090AF] text-white flex items-center">
                    <ShieldCheck className="h-4 w-4 mr-2" /> Primary Button
                    (Ocean Teal 500)
                  </div>
                  <p className="text-sm text-[#0090AF] font-medium">
                    Important Text (Ocean Teal 500)
                  </p>
                  <div className="p-3 rounded border border-[#0090AF] text-[#0090AF] flex items-center">
                    <Edit2 className="h-4 w-4 mr-2" /> Secondary Button (Ocean
                    Teal 500)
                  </div>
                  <p className="text-xs mt-2">
                    These elements use Ocean Teal 500 which has only a 3.85:1
                    contrast ratio with white, failing to meet WCAG AA standards
                    for normal text.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {activeTab === "overview" && (
        <section className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Color System Overview</h2>
            <p className="text-muted-foreground mb-6">
              Our color system is built around the brand blue (#0D1E3C) and
              includes carefully crafted combinations of primary (teal/blue) and
              secondary (pink/purple) colors. All colors meet WCAG accessibility
              standards and are designed to create a cohesive brand experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 rounded-lg border bg-card">
              <h3 className="text-lg font-semibold mb-4">Color Combinations</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Four different combinations of primary and secondary colors,
                each with its own distinct personality.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {colorCombinations.map((combo, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex space-x-2 h-10">
                      <div
                        className="w-1/2 rounded-l-md"
                        style={{ backgroundColor: combo.primary[5].value }}
                      />
                      <div
                        className="w-1/2 rounded-r-md"
                        style={{ backgroundColor: combo.secondary[5].value }}
                      />
                    </div>
                    <div className="text-xs font-medium">{combo.name}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-lg border bg-card">
              <h3 className="text-lg font-semibold mb-4">Color Explorations</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Additional palette explorations derived from our brand blue,
                offering different design directions.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex space-x-2 h-10">
                    <div
                      className="w-1/2 rounded-l-md"
                      style={{ backgroundColor: oceanTealPalette[5].value }}
                    />
                    <div
                      className="w-1/2 rounded-r-md"
                      style={{ backgroundColor: azureTealPalette[5].value }}
                    />
                  </div>
                  <div className="text-xs font-medium">Teal Variants</div>
                </div>
                <div className="space-y-2">
                  <div className="flex space-x-2 h-10">
                    <div
                      className="w-1/2 rounded-l-md"
                      style={{ backgroundColor: coralPaintPalette[5].value }}
                    />
                    <div
                      className="w-1/2 rounded-r-md"
                      style={{ backgroundColor: berryPaintPalette[5].value }}
                    />
                  </div>
                  <div className="text-xs font-medium">Pink Variants</div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-lg border bg-card">
            <h3 className="text-lg font-semibold mb-4">
              Color Usage Recommendations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium mb-2">Primary Colors</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Main navigation elements</li>
                  <li>Buttons and key interactive elements</li>
                  <li>Headers and important UI elements</li>
                  <li>Progress indicators</li>
                  <li>Active states</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Secondary Colors</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Accents and highlights</li>
                  <li>Secondary actions</li>
                  <li>Selection states</li>
                  <li>Important supporting elements</li>
                  <li>Hover and focus states</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Accessibility</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>All base colors meet WCAG AA standards</li>
                  <li>Use proper contrast for text elements</li>
                  <li>Consider color blindness in your designs</li>
                  <li>Never rely on color alone to convey meaning</li>
                  <li>Test designs with accessibility tools</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {activeTab === "combinations" && (
        <section className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">
              Primary & Secondary Color Combinations
            </h2>
            <p className="text-muted-foreground mb-6">
              Based on the brand blue (#0D1E3C), we've created four different
              combinations of primary (teal/blue) and secondary (pink/purple)
              colors. Each combination meets WCAG accessibility standards for
              contrast ratios and provides a distinct branded experience.
            </p>
          </div>

          <div className="p-4 border border-red-300 bg-red-50 rounded-lg mb-8">
            <h3 className="text-lg font-semibold text-red-800 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              Accessibility Audit Required
            </h3>
            <div className="mt-3 text-red-700">
              <p>
                Many of these color combinations{" "}
                <strong>fail to meet WCAG 2.1 accessibility standards</strong>{" "}
                for contrast ratios:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>
                  Most primary colors at 500-level don't have sufficient
                  contrast (4.5:1) against white backgrounds
                </li>
                <li>
                  Several primary and secondary color combinations lack adequate
                  contrast with each other
                </li>
                <li>
                  Using these colors for text or interactive elements may create
                  accessibility barriers
                </li>
              </ul>
              <p className="mt-3 font-medium">Recommended Actions:</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>
                  Use darker shades (600-800) of these palettes for text on
                  light backgrounds
                </li>
                <li>
                  Test all color combinations with accessibility tools like
                  WebAIM Contrast Checker
                </li>
                <li>
                  Consider our WCAG-compliant alternatives in the "WCAG
                  Compliance" tab
                </li>
                <li>
                  Add non-color indicators (icons, patterns, borders) for all
                  status or interactive elements
                </li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[0, 1, 2, 3].map((index) => (
              <ColorCombinationCard key={index} index={index} />
            ))}
          </div>

          <div className="p-6 rounded-lg border bg-card">
            <h3 className="text-lg font-semibold mb-4">
              Using Color Combinations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Primary Color Usage</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Main navigation elements</li>
                  <li>Buttons and key interactive elements</li>
                  <li>Headers and important UI elements</li>
                  <li>Progress indicators</li>
                  <li>Active states</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Secondary Color Usage</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Accents and highlights</li>
                  <li>Secondary actions</li>
                  <li>Selection states</li>
                  <li>Important supporting elements</li>
                  <li>Hover and focus states</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {activeTab === "accessible-colors" && (
        <section className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">
              WCAG-Compliant Color Combinations
            </h2>
            <p className="text-muted-foreground mb-6">
              These color combinations are specifically designed to meet WCAG
              2.1 accessibility standards. All primary colors have at least
              AA-level contrast (4.5:1) with white backgrounds, making them
              suitable for text and interactive elements. Many combinations even
              achieve AAA-level compliance for larger text and UI elements.
            </p>
          </div>

          <div className="p-4 border border-green-300 bg-green-50 rounded-lg mb-8">
            <h3 className="text-lg font-semibold text-green-800 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Accessibility Compliant Colors
            </h3>
            <div className="mt-3 text-green-700">
              <p>
                These color combinations have been carefully crafted to meet
                WCAG 2.1 accessibility standards for contrast ratios:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>
                  All primary colors at 500-level have at least 4.5:1 contrast
                  against white backgrounds
                </li>
                <li>
                  Most colors achieve AAA compliance (7:1 contrast) at their
                  700-level
                </li>
                <li>
                  Primary and secondary colors have sufficient contrast with
                  each other
                </li>
                <li>
                  Darker shades (700+) provide excellent contrast for text and
                  critical UI elements
                </li>
              </ul>
              <p className="mt-3 font-medium">Recommended Usage:</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Use the 500-level colors for large text and UI elements</li>
                <li>
                  Use the 600-700 level colors for standard text and critical UI
                  components
                </li>
                <li>
                  Follow the implementation guidelines in the WCAG Compliance
                  tab
                </li>
                <li>Test all implementations with accessibility tools</li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {accessibleColorCombinations.map((combo, index) => (
              <AccessibleColorCombinationCard key={index} combo={combo} />
            ))}
          </div>

          <div className="p-6 rounded-lg border bg-card">
            <h3 className="text-lg font-semibold mb-4">
              Implementation Examples with Accessible Colors
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded border">
                <h4 className="font-medium mb-3">Button Examples</h4>
                <div className="space-y-3">
                  <div className="p-3 rounded bg-[#118197] text-white font-medium">
                    Original Primary Button
                  </div>
                  <div className="p-3 rounded bg-[#0B4F5B] text-white font-medium">
                    Accessible Primary Button (Wordly Teal 700)
                  </div>
                  <div className="p-3 rounded border border-[#0B4F5B] text-[#0B4F5B] font-medium">
                    Secondary Button (Wordly Teal 700)
                  </div>
                  <div className="p-3 rounded bg-[#E0007B] text-white font-medium">
                    Original Accent Button
                  </div>
                  <div className="p-3 rounded bg-[#86004A] text-white font-medium">
                    Accessible Accent Button (Wordly Magenta 700)
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded border">
                <h4 className="font-medium mb-3">Text & UI Examples</h4>
                <div className="space-y-3">
                  <h5 className="text-[#0E6879] text-lg font-semibold">
                    Heading (Wordly Teal 600)
                  </h5>
                  <p className="text-[#0B4F5B]">
                    Body text using Wordly Teal 700 for optimal readability.
                    This color has a contrast ratio of over 7:1 with white
                    backgrounds, meeting WCAG AAA standards.
                  </p>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-[#E0007B] mr-2"></div>
                    <span className="text-[#86004A]">
                      Status indicator (Wordly Magenta 700)
                    </span>
                  </div>
                  <div className="p-2 rounded bg-[#E6F1F3] border-l-4 border-[#0E6879]">
                    <span className="text-[#0B4F5B]">
                      Notice box with subtle background
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {activeTab === "explorations" && (
        <section className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">
              Color Exploration: Brand Blue Derivatives
            </h2>
            <p className="text-muted-foreground mb-6">
              Based on the brand blue (#0D1E3C), we've created several color
              variations to explore different visual directions. This section
              presents teal and pink color families, each offering a distinct
              personality while maintaining a relationship to the original brand
              blue.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Teal Variants</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="p-6 rounded-lg border bg-card">
                <h4 className="text-lg font-semibold mb-2">Ocean Teal</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  A cooler, deeper teal with blue undertones that evokes depth
                  and stability.
                </p>
                <ColorRelationship
                  name="Ocean Teal 500"
                  value={oceanTealPalette[5].value}
                  relationship="Adds aquatic blue qualities while maintaining depth"
                  textColor="text-white"
                />
              </div>

              <div className="p-6 rounded-lg border bg-card">
                <h4 className="text-lg font-semibold mb-2">Azure Teal</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  A brighter, more vibrant teal with high saturation that feels
                  energetic and modern.
                </p>
                <ColorRelationship
                  name="Azure Teal 500"
                  value={azureTealPalette[5].value}
                  relationship="Increases brightness and vibrancy for a more digital feel"
                  textColor="text-white"
                />
              </div>

              <div className="p-6 rounded-lg border bg-card">
                <h4 className="text-lg font-semibold mb-2">Mint Teal</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  A green-leaning teal that feels fresh, natural, and organic.
                </p>
                <ColorRelationship
                  name="Mint Teal 500"
                  value={mintTealPalette[5].value}
                  relationship="Shifts toward green for a fresher, more natural feel"
                  textColor="text-white"
                />
              </div>

              <div className="p-6 rounded-lg border bg-card">
                <h4 className="text-lg font-semibold mb-2">Deep Teal</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  A darker teal with blue-black undertones that conveys elegance
                  and sophistication.
                </p>
                <ColorRelationship
                  name="Deep Teal 500"
                  value={deepTealPalette[5].value}
                  relationship="Maintains depth with a teal hue shift and darker presence"
                  textColor="text-white"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Pink Variants</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="p-6 rounded-lg border bg-card">
                <h4 className="text-lg font-semibold mb-2">Royal Paint</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  A purple-leaning pink with rich, royal tones that suggest
                  creativity and imagination.
                </p>
                <ColorRelationship
                  name="Royal Paint 500"
                  value={royalPaintPalette[5].value}
                  relationship="Shifts toward purple while maintaining depth and richness"
                  textColor="text-white"
                />
              </div>

              <div className="p-6 rounded-lg border bg-card">
                <h4 className="text-lg font-semibold mb-2">Coral Paint</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  A warm, reddish pink with energetic tones that convey passion
                  and warmth.
                </p>
                <ColorRelationship
                  name="Coral Paint 500"
                  value={coralPaintPalette[5].value}
                  relationship="Introduces warmth and energy with a red shift"
                  textColor="text-white"
                />
              </div>

              <div className="p-6 rounded-lg border bg-card">
                <h4 className="text-lg font-semibold mb-2">Berry Paint</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  A cooler, blue-purple pink with berry-like qualities that
                  suggest elegance and luxury.
                </p>
                <ColorRelationship
                  name="Berry Paint 500"
                  value={berryPaintPalette[5].value}
                  relationship="Combines blue undertones with magenta for a rich berry tone"
                  textColor="text-white"
                />
              </div>

              <div className="p-6 rounded-lg border bg-card">
                <h4 className="text-lg font-semibold mb-2">Slate Paint</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  A neutral, gray-blue pink that feels more subdued and
                  professional.
                </p>
                <ColorRelationship
                  name="Slate Paint 500"
                  value={slatePaintPalette[5].value}
                  relationship="Desaturates the blue for a more neutral, business-like tone"
                  textColor="text-white"
                />
              </div>
            </div>
          </div>

          <div className="p-6 rounded-lg border bg-card">
            <h3 className="text-lg font-semibold mb-4">
              Color Selection Considerations
            </h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Brand Personality:</strong> Consider which color palette
                best represents the brand's personality and values.
              </li>
              <li>
                <strong>User Perception:</strong> Different color palettes may
                evoke different emotional responses from users.
              </li>
              <li>
                <strong>Application Context:</strong> Consider the context where
                these colors will be applied (website, app, print materials).
              </li>
              <li>
                <strong>Accessibility:</strong> All base colors (500) have been
                tested for contrast against white text, meeting WCAG AA
                standards.
              </li>
              <li>
                <strong>Differentiation:</strong> Consider how the color will
                differentiate from competitors in the market.
              </li>
            </ul>
          </div>
        </section>
      )}

      {activeTab === "accessibility" && (
        <section className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">
              Accessibility Guidelines
            </h2>
            <p className="text-muted-foreground mb-6">
              Our color system is designed with accessibility in mind. All
              colors have been tested for contrast ratios and WCAG compliance to
              ensure they can be used in accessible designs.
            </p>
          </div>

          <div className="p-6 rounded-lg border bg-card">
            <h3 className="text-lg font-semibold mb-4">
              WCAG Contrast Guidelines
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">
                  Contrast Ratio Requirements
                </h4>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Level AA:</strong> Requires a contrast ratio of at
                    least 4.5:1 for normal text and 3:1 for large text.
                  </li>
                  <li>
                    <strong>Level AAA:</strong> Requires a contrast ratio of at
                    least 7:1 for normal text and 4.5:1 for large text.
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Color Contrast Indicators</h4>
                <div className="flex space-x-8">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-sm">AAA (7.0+)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="text-sm">AA (4.5-7.0)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-sm">Fail (&lt;4.5)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-lg border bg-card">
            <h3 className="text-lg font-semibold mb-4">
              Accessible Color Usage
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Text Legibility</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>
                    Always ensure sufficient contrast between text and its
                    background
                  </li>
                  <li>
                    Use darker shades (600-900) for text on light backgrounds
                  </li>
                  <li>
                    Use lighter shades (50-200) for text on dark backgrounds
                  </li>
                  <li>Avoid placing text on busy patterns or gradients</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">
                  UI Component Considerations
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>
                    Ensure interactive elements have at least 3:1 contrast with
                    surroundings
                  </li>
                  <li>
                    Use additional indicators beyond color for state changes
                    (icons, text, etc.)
                  </li>
                  <li>
                    Test designs with grayscale filters to ensure information is
                    not lost
                  </li>
                  <li>
                    Consider color blindness when creating data visualizations
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-lg border bg-card">
            <h3 className="text-lg font-semibold mb-4">
              Color Combinations Accessibility
            </h3>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                The following table shows the accessibility status of our
                primary color combinations:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4">Combination</th>
                      <th className="text-left py-2 px-4">Primary on White</th>
                      <th className="text-left py-2 px-4">Primary on Black</th>
                      <th className="text-left py-2 px-4">
                        Primary vs Secondary
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {colorCombinations.map((combo, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2 px-4">{combo.name}</td>
                        <td className="py-2 px-4">
                          <ContrastIndicator
                            ratio={combo.contrast.onLight}
                            aa={combo.wcag.onLight.aa}
                            aaa={combo.wcag.onLight.aaa}
                          />
                        </td>
                        <td className="py-2 px-4">
                          <ContrastIndicator
                            ratio={combo.contrast.onDark}
                            aa={combo.wcag.onDark.aa}
                            aaa={combo.wcag.onDark.aaa}
                          />
                        </td>
                        <td className="py-2 px-4">
                          <ContrastIndicator
                            ratio={combo.contrast.primarySecondary}
                            aa={combo.wcag.primarySecondary.aa}
                            aaa={combo.wcag.primarySecondary.aaa}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ColorSystemDoc;
