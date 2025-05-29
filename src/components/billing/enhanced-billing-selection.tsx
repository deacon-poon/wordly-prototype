import React from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface BillingItem {
  id: string;
  name: string;
  workspace?: string;
  balance: string;
  minutesValue: number;
}

interface EnhancedBillingSelectionProps {
  items: BillingItem[];
  selectedItem: string | "all" | null;
  onSelectionChange: (selection: string | "all") => void;
  viewLevel: "workspace" | "account" | "project";
  userRole: "organization_admin" | "workspace_admin";
}

export function EnhancedBillingSelection({
  items,
  selectedItem,
  onSelectionChange,
  viewLevel,
  userRole,
}: EnhancedBillingSelectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">
          {viewLevel === "workspace" && "Workspaces"}
          {viewLevel === "account" && "Accounts"}
          {viewLevel === "project" && "Billing Projects"}
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSelectionChange("all")}
          className={selectedItem === "all" ? "bg-blue-50 border-blue-200" : ""}
        >
          View All Combined
        </Button>
      </div>

      <RadioGroup value={selectedItem || ""} onValueChange={onSelectionChange}>
        {userRole === "organization_admin" && (
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="all" />
            <Label htmlFor="all" className="text-sm">
              All {viewLevel}s (Aggregated View)
            </Label>
          </div>
        )}

        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={item.id} id={item.id} />
              <Label htmlFor={item.id} className="flex-1 cursor-pointer">
                <div className="flex items-center justify-between w-full">
                  <div>
                    <div className="font-medium">{item.name}</div>
                    {item.workspace && (
                      <div className="text-xs text-gray-500">
                        {item.workspace}
                      </div>
                    )}
                  </div>
                  <Badge variant="outline" className="ml-4">
                    {item.balance}
                  </Badge>
                </div>
              </Label>
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
