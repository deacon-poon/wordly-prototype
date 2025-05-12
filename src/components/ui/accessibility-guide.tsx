import React from "react";
import { Typography } from "./typography";

export interface AccessibilityRuleProps {
  title: string;
  description: string;
  goodExample?: React.ReactNode;
  badExample?: React.ReactNode;
  wcagCriteria?: string;
  importance: "critical" | "high" | "medium" | "recommendation";
}

export const AccessibilityRule: React.FC<AccessibilityRuleProps> = ({
  title,
  description,
  goodExample,
  badExample,
  wcagCriteria,
  importance,
}) => {
  const importanceClasses = {
    critical: "bg-red-50 border-red-500",
    high: "bg-orange-50 border-orange-500",
    medium: "bg-yellow-50 border-yellow-500",
    recommendation: "bg-blue-50 border-blue-500",
  };

  const importanceLabels = {
    critical: "Critical",
    high: "High Priority",
    medium: "Medium Priority",
    recommendation: "Recommendation",
  };

  const importanceLabelClasses = {
    critical: "bg-red-100 text-red-800",
    high: "bg-orange-100 text-orange-800",
    medium: "bg-yellow-100 text-yellow-800",
    recommendation: "bg-blue-100 text-blue-800",
  };

  return (
    <div
      className={`p-6 border-l-4 rounded-md ${importanceClasses[importance]}`}
    >
      <div className="flex flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Typography variant="h4">{title}</Typography>
          <span
            className={`text-xs px-2 py-1 rounded-full ${importanceLabelClasses[importance]}`}
          >
            {importanceLabels[importance]}
          </span>
        </div>

        <Typography variant="p">{description}</Typography>

        {wcagCriteria && (
          <div className="mt-2">
            <Typography variant="small" className="font-semibold">
              WCAG Criteria:
            </Typography>
            <Typography variant="small" className="mt-1">
              {wcagCriteria}
            </Typography>
          </div>
        )}

        {(goodExample || badExample) && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {goodExample && (
              <div className="p-4 border border-green-200 bg-green-50 rounded-md">
                <Typography
                  variant="small"
                  className="text-green-800 font-semibold mb-2"
                >
                  ✓ Good Example
                </Typography>
                <div>{goodExample}</div>
              </div>
            )}

            {badExample && (
              <div className="p-4 border border-red-200 bg-red-50 rounded-md">
                <Typography
                  variant="small"
                  className="text-red-800 font-semibold mb-2"
                >
                  ✗ Bad Example
                </Typography>
                <div>{badExample}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export interface AccessibilityGuideProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export const AccessibilityGuide: React.FC<AccessibilityGuideProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <div className="p-6 bg-card rounded-lg border">
      <div className="mb-6">
        <Typography variant="h2">{title}</Typography>
        {description && (
          <Typography variant="lead" className="mt-2">
            {description}
          </Typography>
        )}
      </div>
      <div className="space-y-8">{children}</div>
    </div>
  );
};
