"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash, Save } from "lucide-react";
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
  required: boolean;
  possibleValues?: string[];
}

// Panel mode types
type PanelMode = "view" | "edit" | "add";

export default function OrganizationCustomFieldsPage() {
  const [fields, setFields] = useState<CustomField[]>([
    {
      id: "1",
      name: "Event Notes",
      type: "free text",
      default: "(blank)",
      required: true,
    },
    {
      id: "2",
      name: "Products Used",
      type: "multi-select",
      default: "(4 default values)",
      required: false,
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
      required: false,
    },
    {
      id: "4",
      name: "Venues",
      type: "single-select",
      default: "Holiday Inn",
      required: false,
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
  const [formRequired, setFormRequired] = useState(false);
  const [formPossibleValues, setFormPossibleValues] = useState<string[]>([]);

  // Keep track of the current panel content
  const [panelContent, setPanelContent] = useState<React.ReactNode | null>(
    null
  );

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
    setFormRequired(false);
    setFormPossibleValues([]);
    setEditingField(null);
  };

  // Initialize form with field values for editing
  const initFormWithField = (field: CustomField) => {
    setFormName(field.name);
    setFormType(field.type);
    setFormDefault(field.default);
    setFormRequired(field.required);
    setFormPossibleValues(field.possibleValues || []);
    setEditingField(field);
  };

  // Open add new field panel
  const openAddPanel = () => {
    // Set up form for a new field
    setEditingField(null);
    setFormName("");
    setFormType("free text");
    setFormDefault("");
    setFormRequired(false);
    setFormPossibleValues([]);
    setPanelMode("add");
    setSelectedField("new-field");

    // Create element for add panel with blank form
    const addPanelElement = (
      <div className="h-full overflow-auto">
        <div className="space-y-6 p-6">
          <div className="space-y-2">
            <Label htmlFor="field-name">Custom field name:</Label>
            <Input
              id="field-name"
              defaultValue=""
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g., Client ID, Project Name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="field-required">Is required?</Label>
            <div className="flex items-center space-x-6 mt-2">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="required-yes"
                  name="field-required"
                  className="h-4 w-4 text-[#006064] focus:ring-[#006064]"
                  defaultChecked={false}
                  onChange={() => setFormRequired(true)}
                />
                <Label
                  htmlFor="required-yes"
                  className="font-normal cursor-pointer"
                >
                  Required
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="required-no"
                  name="field-required"
                  className="h-4 w-4 text-[#006064] focus:ring-[#006064]"
                  defaultChecked={true}
                  onChange={() => setFormRequired(false)}
                />
                <Label
                  htmlFor="required-no"
                  className="font-normal cursor-pointer"
                >
                  Optional
                </Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="field-type">Field type:</Label>
            <Select
              defaultValue="free text"
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
            <p className="text-xs text-gray-500 mt-1">
              (When adding a session, people will be able to type any text in
              this field.)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="field-default">Default value:</Label>
            <Select
              defaultValue="(blank)"
              onValueChange={(value) => setFormDefault(value)}
            >
              <SelectTrigger id="field-default">
                <SelectValue placeholder="Select default value" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="(blank)">(blank)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4 flex justify-end">
            <Button
              variant="default"
              className="bg-brand-teal hover:bg-brand-teal/90 text-white rounded-full px-8"
              onClick={handleSaveField}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    );

    // Update the panel content
    setPanelContent(addPanelElement);

    // Open panel with blank form
    window.dispatchEvent(
      new CustomEvent("field-selected", {
        detail: {
          fieldId: "new-field",
          content: addPanelElement,
          mode: "add",
        },
      })
    );
  };

  // Open edit field panel
  const openEditPanel = (field: CustomField) => {
    // First set the editing field and update form state
    setEditingField(field);
    setFormName(field.name);
    setFormType(field.type);
    setFormDefault(field.default);
    setFormRequired(field.required);
    setFormPossibleValues(field.possibleValues || []);
    setPanelMode("edit");
    setSelectedField(field.id);

    // Create an element that will render the edit panel with inline data
    const editPanelElement = (
      <div className="h-full overflow-auto">
        <div className="space-y-6 p-6">
          <div className="space-y-2">
            <Label htmlFor="field-name">Custom field name:</Label>
            <Input
              id="field-name"
              defaultValue={field.name}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g., Client ID, Project Name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="field-required">Is required?</Label>
            <div className="flex items-center space-x-6 mt-2">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="required-yes"
                  name="field-required"
                  className="h-4 w-4 text-[#006064] focus:ring-[#006064]"
                  defaultChecked={field.required}
                  onChange={() => setFormRequired(true)}
                />
                <Label
                  htmlFor="required-yes"
                  className="font-normal cursor-pointer"
                >
                  Required
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="required-no"
                  name="field-required"
                  className="h-4 w-4 text-[#006064] focus:ring-[#006064]"
                  defaultChecked={!field.required}
                  onChange={() => setFormRequired(false)}
                />
                <Label
                  htmlFor="required-no"
                  className="font-normal cursor-pointer"
                >
                  Optional
                </Label>
              </div>
            </div>
            {field.required && (
              <p className="text-xs text-gray-500 mt-1">
                An asterisk (*) will be shown next to the field name.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="field-type">Field type:</Label>
            <Select
              defaultValue={field.type}
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
            {field.type === "free text" && (
              <p className="text-xs text-gray-500 mt-1">
                (When adding a session, people will be able to type any text in
                this field.)
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="field-default">Default value:</Label>
            <Select
              defaultValue={field.default || "(blank)"}
              onValueChange={(value) => setFormDefault(value)}
            >
              <SelectTrigger id="field-default">
                <SelectValue placeholder="Select default value" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="(blank)">(blank)</SelectItem>
                {field.type === "single-select" &&
                  field.possibleValues &&
                  field.possibleValues.length > 0 &&
                  field.possibleValues.map((value, index) => (
                    <SelectItem key={index} value={value}>
                      {value}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {(field.type === "single-select" ||
            field.type === "multi-select") && (
            <div className="space-y-2">
              <Label htmlFor="field-possible-values">Possible values:</Label>
              <div className="border rounded-md p-4 space-y-2">
                {(field.possibleValues || []).map((value, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      defaultValue={value}
                      onChange={(e) => {
                        const updatedValues = [...formPossibleValues];
                        updatedValues[index] = e.target.value;
                        setFormPossibleValues(updatedValues);
                      }}
                      placeholder={`Value ${index + 1}`}
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
              className="bg-brand-teal hover:bg-brand-teal/90 text-white rounded-full px-8"
              onClick={handleSaveField}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    );

    // Update the panel content
    setPanelContent(editPanelElement);

    // Dispatch event to parent layout with the actual panel content
    window.dispatchEvent(
      new CustomEvent("field-selected", {
        detail: {
          fieldId: field.id,
          content: editPanelElement,
          mode: "edit",
        },
      })
    );
  };

  // Handle form submission
  const handleSaveField = () => {
    // Validate form data
    if (!formName.trim()) {
      alert("Field name is required");
      return;
    }

    // Create new field object with current form values
    const updatedField: CustomField = {
      id: editingField ? editingField.id : `field-${Date.now()}`,
      name: formName,
      type: formType,
      default: formDefault,
      required: formRequired,
      possibleValues: formType.includes("select")
        ? formPossibleValues.filter((val) => val.trim() !== "")
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
    showFieldDetails(updatedField);
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

  // Format display name with required indicator
  const formatDisplayName = (field: CustomField) => {
    return field.required ? `${field.name}*` : field.name;
  };

  // Format type display for table
  const formatTypeDisplay = (field: CustomField) => {
    if (field.type === "single-select" || field.type === "multi-select") {
      const count = field.possibleValues?.length || 0;
      return `${field.type} with ${count} possible values`;
    }
    return field.type;
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

  // Render the view panel for the selected field
  const renderViewPanel = (field: CustomField) => {
    return (
      <div className="h-full p-6 overflow-auto">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-3">
            {formatDisplayName(field)}
          </h3>

          <div>
            <h4 className="font-medium text-sm text-gray-500 mb-1">Required</h4>
            <p>{field.required ? "Yes" : "No"}</p>
          </div>

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
            <p>{field.default || "(blank)"}</p>
          </div>

          {field.possibleValues && field.possibleValues.length > 0 && (
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
              <Edit2 className="h-4 w-4 mr-2" />
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
          <h2 className="text-xl font-semibold">Custom Fields</h2>
          <p className="text-gray-500 mt-1">
            Add and manage custom fields for organizing and filtering your usage
            data across workspaces.
          </p>
        </div>
        <Button
          variant="default"
          className="bg-brand-teal hover:bg-brand-teal/90 text-white"
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
                className={`hover:bg-gray-50 ${
                  selectedField === field.id ? "bg-gray-100" : ""
                }`}
              >
                <TableCell className="font-medium">
                  {formatDisplayName(field)}
                </TableCell>
                <TableCell>{formatTypeDisplay(field)}</TableCell>
                <TableCell>{field.default}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditPanel(field)}
                      className="h-8 w-8 p-0 text-gray-500 hover:text-[#006064]"
                    >
                      <Edit2 className="h-4 w-4" />
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
