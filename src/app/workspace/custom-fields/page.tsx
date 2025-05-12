"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CustomFieldsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Custom Fields</CardTitle>
          <CardDescription>
            Configure custom fields for sessions in this workspace.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Custom fields configuration coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}
