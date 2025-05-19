"use client";

import { Button } from "@/components/ui/button";

export default function OrganizationCustomFieldsPage() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold">Custom Fields</h2>
          <p className="text-sm text-gray-500 mt-1">
            Configure custom fields for sessions across all workspaces.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="default"
            className="bg-[#006064] hover:bg-[#00474a] text-white"
          >
            Add Custom Field
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden p-6">
        <p className="text-gray-500">
          Organization-wide custom fields configuration coming soon.
        </p>
      </div>
    </div>
  );
}
