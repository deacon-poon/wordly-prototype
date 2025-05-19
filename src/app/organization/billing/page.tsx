"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

// Sample billing project data
interface BillingProject {
  id: string;
  name: string;
  workspace: string;
  description: string;
  balance: string;
}

export default function BillingProjectsPage() {
  const [projects, setProjects] = useState<BillingProject[]>([
    {
      id: "1",
      name: "Gardendale City",
      workspace: "Gardendale City",
      description: "the main project for Gardendale city council",
      balance: "5,514 minutes",
    },
    {
      id: "2",
      name: "Parks and Rec",
      workspace: "Gardendale City",
      description: "-",
      balance: "14 minutes",
    },
    {
      id: "3",
      name: "Safety Outreach",
      workspace: "Gardendale City",
      description: "funding for disaster preparedness and fire prevention",
      balance: "5,514 minutes",
    },
  ]);

  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [workspaceFilter, setWorkspaceFilter] = useState<string>("all");

  // Handle filter change
  const handleFilterChange = (value: string) => {
    setWorkspaceFilter(value);
  };

  // Handle row selection
  const handleRowSelect = (projectId: string) => {
    if (selectedProjects.includes(projectId)) {
      setSelectedProjects(selectedProjects.filter((id) => id !== projectId));
    } else {
      setSelectedProjects([...selectedProjects, projectId]);
    }
  };

  // Handle header checkbox
  const handleSelectAll = () => {
    if (selectedProjects.length === filteredProjects.length) {
      setSelectedProjects([]);
    } else {
      setSelectedProjects(filteredProjects.map((project) => project.id));
    }
  };

  // Filter projects based on workspace
  const filteredProjects =
    workspaceFilter === "all"
      ? projects
      : projects.filter((project) => project.workspace === workspaceFilter);

  // Get unique workspaces for filter dropdown
  const workspaces = Array.from(
    new Set(projects.map((project) => project.workspace))
  );

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6 flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold">Billing Projects</h2>
          <p className="text-gray-500 mt-1">
            Manage billing projects to track and allocate minutes across
            workspaces.
          </p>
        </div>
        <Button
          variant="default"
          className="bg-[#006064] hover:bg-[#00474a] text-white"
          onClick={() => {
            // Handle add new billing project
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Billing Project
        </Button>
      </div>

      <div className="border-t border-gray-200">
        <div className="px-6 py-4 flex justify-between items-center bg-gray-50 border-b">
          <Button
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
            disabled={selectedProjects.length === 0}
          >
            <Eye className="h-4 w-4 mr-2" />
            View transactions for selected
          </Button>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Filter:</span>
            <Select value={workspaceFilter} onValueChange={handleFilterChange}>
              <SelectTrigger className="w-[180px] bg-white">
                <SelectValue placeholder="Select workspace" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">all</SelectItem>
                {workspaces.map((workspace) => (
                  <SelectItem key={workspace} value={workspace}>
                    {workspace}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-[40px] pl-6">
                <Checkbox
                  checked={
                    filteredProjects.length > 0 &&
                    selectedProjects.length === filteredProjects.length
                  }
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>Billing Project</TableHead>
              <TableHead>Workspace</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <TableRow
                  key={project.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleRowSelect(project.id)}
                >
                  <TableCell className="pl-6">
                    <Checkbox
                      checked={selectedProjects.includes(project.id)}
                      onCheckedChange={() => handleRowSelect(project.id)}
                      aria-label={`Select ${project.name}`}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell>{project.workspace}</TableCell>
                  <TableCell>
                    {project.description === "-" ? (
                      <span className="text-gray-400 italic">
                        No description
                      </span>
                    ) : (
                      project.description
                    )}
                  </TableCell>
                  <TableCell className="font-medium text-right pr-6">
                    {project.balance}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <p className="mb-2">No billing projects found</p>
                    <p className="text-sm">
                      Try changing your filter or add a new billing project
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
