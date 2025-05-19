"use client";

import { Button } from "@/components/ui/button";
import { CardHeaderLayout } from "@/components/workspace/card-header-layout";

export default function CustomFieldsPage() {
  const actions = (
    <Button
      variant="default"
      className="bg-[#006064] hover:bg-[#00474a] text-white"
    >
      Add Custom Field
    </Button>
  );

  return (
    <CardHeaderLayout
      title="Custom Fields"
      description="Configure custom fields for sessions in this workspace."
      actions={actions}
    >
      <p className="text-gray-500">Custom fields configuration coming soon.</p>
    </CardHeaderLayout>
  );
}
