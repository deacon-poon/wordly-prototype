"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash, Save } from "lucide-react";
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

// Panel mode types
type PanelMode = "view" | "edit" | "add";

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

  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [panelMode, setPanelMode] = useState<PanelMode>("view");
  const [editingField, setEditingField] = useState<CustomField | null>(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formType, setFormType] = useState<FieldType>("free text");
  const [formDefault, setFormDefault] = useState("");
  const [formPossibleValues, setFormPossibleValues] = useState<string[]>([]);

  // Listen for field deselection events from the parent layout
  useEffect(() => {
    const handleFieldDeselected = (e: CustomEvent) => {
      if (e.detail.fieldId === selectedField) {
        setSelectedField(null);
        setPanelMode("view");
        resetForm();
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

  // Reset form to default values
  const resetForm = () => {
    setFormName("");
    setFormType("free text");
    setFormDefault("");
    setFormPossibleValues([]);
    setEditingField(null);
  };

  // Initialize form with field values for editing
  const initFormWithField = (field: CustomField) => {
    setFormName(field.name);
    setFormType(field.type);
    setFormDefault(field.default);
    setFormPossibleValues(field.possibleValues || []);
    setEditingField(field);
  };

  // Open add new field panel
  const openAddPanel = () => {
    resetForm();
    setPanelMode("add");

    // Send event to show the panel
    window.dispatchEvent(
      new CustomEvent("field-selected", {
        detail: {
          fieldId: "new",
          content: renderEditPanel(),
          mode: "add",
        },
      })
    );

    setSelectedField("new");
  };

  // Open edit field panel
  const openEditPanel = (field: CustomField) => {
    initFormWithField(field);
    setPanelMode("edit");

    // Update the panel content
    window.dispatchEvent(
      new CustomEvent("field-selected", {
        detail: {
          fieldId: field.id,
          content: renderEditPanel(),
          mode: "edit",
        },
      })
    );

    setSelectedField(field.id);
  };

  // Handle form submission
  const handleSaveField = () => {
    // Create new field object
    const updatedField: CustomField = {
      id: editingField ? editingField.id : `${Date.now()}`,
      name: formName,
      type: formType,
      default: formDefault,
      possibleValues: formType.includes("select")
        ? formPossibleValues
        : undefined,
    };

    if (panelMode === "add") {
      // Add new field
      setFields([...fields, updatedField]);
    } else {
      // Update existing field
      setFields(
        fields.map((field) =>
          field.id === updatedField.id ? updatedField : field
        )
      );
    }

    // Switch back to view mode and show the updated field details
    setPanelMode("view");

    // Update the panel to show the saved field
    handleFieldSelect(updatedField);
  };

  // Delete a field
  const handleDeleteField = (id: string) => {
    if (confirm("Are you sure you want to delete this custom field?")) {
      setFields(fields.filter((field) => field.id !== id));
      if (selectedField === id) {
        setSelectedField(null);
        // Notify parent layout to close panel
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

  // Handle field selection - updating this to display view-only details
  const handleFieldSelect = (field: CustomField) => {
    // If we're in edit mode, ask for confirmation before switching
    if (panelMode !== "view" && selectedField) {
      if (!confirm("Discard unsaved changes?")) {
        return;
      }
    }

    // If already selected, do nothing
    if (field.id === selectedField) {
      return;
    }

    // Set the selected field and show view panel
    setSelectedField(field.id);
    setPanelMode("view");

    // Create details panel content with view panel
    const detailsContent = renderViewPanel(field);

    // Dispatch event to parent layout
    window.dispatchEvent(
      new CustomEvent("field-selected", {
        detail: {
          fieldId: field.id,
          content: detailsContent,
          mode: "view",
        },
      })
    );
  };

  // Render the view panel for the selected field
  const renderViewPanel = (field: CustomField) => {
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
              onClick={() => openEditPanel(field)}
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

  // Render the edit panel form
  const renderEditPanel = () => {
    return (
      <div className="h-full overflow-auto">
        <div className="space-y-6 p-6">
          <div className="space-y-2">
            <Label htmlFor="field-name">Field Name</Label>
            <Input
              id="field-name"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g., Client ID, Project Name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="field-type">Field Type</Label>
            <Select
              value={formType}
              onValueChange={(value: FieldType) => setFormType(value)}
            >
              <SelectTrigger id="field-type">
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
            <Label htmlFor="field-default">Default Value</Label>
            <Input
              id="field-default"
              value={formDefault}
              onChange={(e) => setFormDefault(e.target.value)}
              placeholder="Default value"
            />
          </div>

          {(formType === "single-select" || formType === "multi-select") && (
            <div className="space-y-2">
              <Label>Possible Values</Label>
              <div className="border rounded-md p-4 space-y-2">
                {formPossibleValues.map((value, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={value}
                      onChange={(e) => {
                        const updatedValues = [...formPossibleValues];
                        updatedValues[index] = e.target.value;
                        setFormPossibleValues(updatedValues);
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-gray-500 hover:text-red-600"
                      onClick={() => {
                        const updatedValues = formPossibleValues.filter(
                          (_, i) => i !== index
                        );
                        setFormPossibleValues(updatedValues);
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() =>
                    setFormPossibleValues([...formPossibleValues, ""])
                  }
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Value
                </Button>
              </div>
            </div>
          )}

          <div className="pt-4 flex justify-end">
            <Button
              variant="default"
              className="bg-[#006064] hover:bg-[#00474a] text-white"
              onClick={handleSaveField}
            >
              <Save className="h-4 w-4 mr-2" />
              {panelMode === "add" ? "Add Field" : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // Show field details when row is clicked
  const showFieldDetails = (field: CustomField) => {
    // If we're in edit mode, ask for confirmation before switching
    if (panelMode !== "view" && selectedField) {
      if (!confirm("Discard unsaved changes?")) {
        return;
      }
    }

    // Set the selected field and show view panel
    setSelectedField(field.id);
    setPanelMode("view");

    // Create details panel content with view panel
    const detailsContent = renderViewPanel(field);

    // Dispatch event to parent layout
    window.dispatchEvent(
      new CustomEvent("field-selected", {
        detail: {
          fieldId: field.id,
          content: detailsContent,
          mode: "view",
        },
      })
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
          onClick={openAddPanel}
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
                onClick={() => showFieldDetails(field)}
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
                        openEditPanel(field);
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
    </div>
  );
}
