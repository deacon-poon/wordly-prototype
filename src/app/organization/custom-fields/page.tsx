"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash } from "lucide-react";
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
}

export default function OrganizationCustomFieldsPage() {
  const [fields, setFields] = useState<CustomField[]>([
    {
      id: "1",
      name: "Event Notes*",
      type: "free text",
      default: "(blank)",
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
    },
    {
      id: "3",
      name: "Internal ID",
      type: "numeric",
      default: "11-100",
    },
    {
      id: "4",
      name: "Venues",
      type: "single-select",
      default: "Holiday Inn",
      possibleValues: ["Holiday Inn", "Conference Center", "Virtual"],
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentField, setCurrentField] = useState<CustomField | null>(null);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  // Listen for field deselection events from the parent layout
  useEffect(() => {
    const handleFieldDeselected = (e: CustomEvent) => {
      if (e.detail.fieldId === selectedField) {
        setSelectedField(null);
      }
    };

    window.addEventListener("field-deselected" as any, handleFieldDeselected);
    return () => {
      window.removeEventListener(
        "field-deselected" as any,
        handleFieldDeselected
      );
    };
  }, [selectedField]);

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
      if (selectedField === id) {
        setSelectedField(null);
        // Notify parent layout
        window.dispatchEvent(
          new CustomEvent("field-selected", {
            detail: { fieldId: null, content: null },
          })
        );
      }
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

  // Handle field selection
  const handleFieldSelect = (field: CustomField) => {
    const newSelectedId = field.id === selectedField ? null : field.id;
    setSelectedField(newSelectedId);

    // Create details panel content
    const detailsContent = newSelectedId ? renderDetailsPanel(field) : null;

    // Dispatch event to parent layout
    window.dispatchEvent(
      new CustomEvent("field-selected", {
        detail: {
          fieldId: newSelectedId,
          content: detailsContent,
        },
      })
    );
  };

  // Render the details panel for the selected field
  const renderDetailsPanel = (field: CustomField) => {
    return (
      <div className="h-full p-6 overflow-auto">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-sm text-gray-500 mb-1">
              Field Type
            </h4>
            <p>{formatTypeDisplay(field)}</p>
          </div>

          <div>
            <h4 className="font-medium text-sm text-gray-500 mb-1">
              Default Value
            </h4>
            <p>{field.default}</p>
          </div>

          {field.possibleValues && (
            <div>
              <h4 className="font-medium text-sm text-gray-500 mb-2">
                Possible Values
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {field.possibleValues.map((value, index) => (
                  <div
                    key={index}
                    className="px-2 py-1 bg-white border rounded text-gray-700"
                  >
                    {value}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => openEditDialog(field)}
              className="mr-2"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Field
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => handleDeleteField(field.id)}
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete Field
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6 flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold">
            Custom Fields (across workspaces)
          </h2>
          <p className="text-gray-500 mt-1">
            You can add custom fields to help understand where your minutes are
            being used when bulk exporting your usage data.
          </p>
        </div>
        <Button
          variant="default"
          className="bg-[#006064] hover:bg-[#00474a] text-white"
          onClick={openAddDialog}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Custom Field
        </Button>
      </div>

      <div className="border-t">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>Field Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Default</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.map((field) => (
              <TableRow
                key={field.id}
                className={`hover:bg-gray-50 cursor-pointer ${
                  selectedField === field.id ? "bg-gray-100" : ""
                }`}
                onClick={() => handleFieldSelect(field)}
              >
                <TableCell className="font-medium">{field.name}</TableCell>
                <TableCell>{formatTypeDisplay(field)}</TableCell>
                <TableCell>{field.default}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditDialog(field);
                      }}
                      className="h-8 w-8 p-0 text-gray-500 hover:text-[#006064]"
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteField(field.id);
                      }}
                      className="h-8 w-8 p-0 text-gray-500 hover:text-red-600"
                    >
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Dialog for adding/editing fields */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {currentField ? "Edit Custom Field" : "Add New Custom Field"}
            </DialogTitle>
            <DialogDescription>
              {currentField
                ? "Modify the details of this custom field."
                : "Create a new custom field for usage data tracking."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Field Name
              </Label>
              <Input
                id="name"
                defaultValue={currentField?.name || ""}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Field Type
              </Label>
              <Select defaultValue={currentField?.type || "free text"}>
                <SelectTrigger className="col-span-3">
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="default" className="text-right">
                Default Value
              </Label>
              <Input
                id="default"
                defaultValue={currentField?.default || ""}
                className="col-span-3"
              />
            </div>
            {/* Additional fields for select options would go here */}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-[#006064] hover:bg-[#00474a] text-white"
              onClick={handleSaveField}
            >
              Save Custom Field
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
