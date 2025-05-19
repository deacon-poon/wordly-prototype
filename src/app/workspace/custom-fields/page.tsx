"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function WorkspaceCustomFieldsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the organization custom fields page
    router.push("/organization/custom-fields");
  }, [router]);

  return (
    <div className="p-6">
      <p className="text-gray-500">
        Redirecting to organization custom fields...
      </p>
    </div>
  );
}
