"use client";

import React from "react";

interface CardHeaderLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export function CardHeaderLayout({
  title,
  description,
  children,
  actions,
}: CardHeaderLayoutProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
              <p className="text-sm text-gray-500 mt-1">{description}</p>
            </div>
            {actions && <div className="flex gap-3">{actions}</div>}
          </div>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
