"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CardHeaderLayout } from "@/components/workspace/card-header-layout";
import { Plus, ChevronDown, ChevronUp, Edit, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Field types
type FieldType = "free text" | "numeric" | "single-select" | "multi-select";

// Sample custom field data
interface CustomField {
  id: string;
  name: string;
  type: FieldType;
  default: string;
  possibleValues?: string[];
  expanded?: boolean;
}

export default function OrganizationCustomFieldsPage() {
  const [fields, setFields] = useState<CustomField[]>([
    {
      id: "1",
      name: "Event Notes*",
      type: "free text",
      default: "(blank)",
      expanded: false,
    },
    {
      id: "2",
      name: "Products Used",
      type: "multi-select",
      default: "(4 default values)",
      possibleValues: [
        "Product A",
        "Product B",
        "Product C",
        "Product D",
        // ... more products up to 21
      ],
      expanded: false,
    },
    {
      id: "3",
      name: "Internal ID",
      type: "numeric",
      default: "11-100",
      expanded: false,
    },
    {
      id: "4",
      name: "Venues",
      type: "single-select",
      default: "Holiday Inn",
      possibleValues: ["Holiday Inn", "Conference Center", "Virtual"],
      expanded: false,
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentField, setCurrentField] = useState<CustomField | null>(null);
  const [allExpanded, setAllExpanded] = useState(false);

  // Toggle expansion state for all fields
  const toggleAllExpand = () => {
    const newExpandState = !allExpanded;
    setAllExpanded(newExpandState);
    setFields(
      fields.map((field) => ({
        ...field,
        expanded: newExpandState,
      }))
    );
  };

  // Toggle expansion state for a single field
  const toggleExpand = (id: string) => {
    setFields(
      fields.map((field) =>
        field.id === id ? { ...field, expanded: !field.expanded } : field
      )
    );

    // Update allExpanded state based on whether all fields are now expanded
    const allFieldsExpanded = fields
      .map((field) => (field.id === id ? !field.expanded : field.expanded))
      .every((expanded) => expanded);
    setAllExpanded(allFieldsExpanded);
  };

  // Open dialog to add a new field
  const openAddDialog = () => {
    setCurrentField(null);
    setIsDialogOpen(true);
  };

  // Open dialog to edit an existing field
  const openEditDialog = (field: CustomField) => {
    setCurrentField({ ...field });
    setIsDialogOpen(true);
  };

  // Handle dialog form submission
  const handleSaveField = () => {
    // Implement save logic
    setIsDialogOpen(false);
  };

  // Delete a field
  const handleDeleteField = (id: string) => {
    if (confirm("Are you sure you want to delete this custom field?")) {
      setFields(fields.filter((field) => field.id !== id));
    }
  };

  // Format type display for table
  const formatTypeDisplay = (field: CustomField) => {
    if (field.type === "single-select" || field.type === "multi-select") {
      const count = field.possibleValues?.length || 0;
      return `${field.type} with ${count} possible values`;
    }
    return field.type;
  };

  const actions = (
    <Button
      variant="default"
      className="bg-[#006064] hover:bg-[#00474a] text-white"
      onClick={openAddDialog}
    >
      <Plus className="h-4 w-4 mr-2" />
      Add New Custom Field
    </Button>
  );

  return (
    <>
      <CardHeaderLayout
        title="Custom Fields (across workspaces)"
        description="You can add custom fields to help understand where your minutes are being used when bulk exporting your usage data."
        actions={actions}
      >
        <div className="overflow-hidden -m-6">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead>Field Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Default</TableHead>
                <TableHead className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleAllExpand}
                    className="font-medium text-gray-700 hover:text-[#006064]"
                  >
                    {allExpanded ? "collapse all" : "expand all"}
                    {allExpanded ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((field) => (
                <React.Fragment key={field.id}>
                  <TableRow className="hover:bg-gray-50">
                    <TableCell className="font-medium">{field.name}</TableCell>
                    <TableCell>{formatTypeDisplay(field)}</TableCell>
                    <TableCell>{field.default}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(field)}
                          className="h-8 w-8 p-0 text-gray-500 hover:text-[#006064]"
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteField(field.id)}
                          className="h-8 w-8 p-0 text-gray-500 hover:text-red-600"
                        >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpand(field.id)}
                          className="h-8 w-8 p-0 text-gray-500"
                        >
                          {field.expanded ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                          <span className="sr-only">Toggle</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  {field.expanded && field.possibleValues && (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="bg-gray-50 p-4 border-t border-b"
                      >
                        <div className="text-sm">
                          <h4 className="font-medium mb-2">Possible Values:</h4>
                          <div className="grid grid-cols-3 gap-2">
                            {field.possibleValues.map((value, index) => (
                              <div
                                key={index}
                                className="px-2 py-1 bg-white border rounded text-gray-700"
                              >
                                {value}
                              </div>
                            ))}
                            {field.type === "multi-select" && (
                              <div className="px-2 py-1 border rounded border-dashed text-gray-500 flex items-center justify-center">
                                <Plus className="h-3 w-3 mr-1" />
                                Add value
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardHeaderLayout>

      {/* Add/Edit Custom Field Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {currentField ? "Edit Custom Field" : "Add New Custom Field"}
            </DialogTitle>
            <DialogDescription>
              {currentField
                ? "Update the details of your custom field."
                : "Add a new custom field to use across workspaces."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Field Name</Label>
              <Input
                id="name"
                placeholder="e.g., Client ID, Project Name"
                defaultValue={currentField?.name}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Field Type</Label>
              <Select defaultValue={currentField?.type || "free text"}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select field type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free text">Free Text</SelectItem>
                  <SelectItem value="numeric">Numeric</SelectItem>
                  <SelectItem value="single-select">Single Select</SelectItem>
                  <SelectItem value="multi-select">Multi Select</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="default">Default Value</Label>
              <Input
                id="default"
                placeholder="Default value"
                defaultValue={
                  currentField?.default === "(blank)"
                    ? ""
                    : currentField?.default
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveField}
              className="bg-[#006064] hover:bg-[#00474a] text-white"
            >
              {currentField ? "Save Changes" : "Add Field"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
