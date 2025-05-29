"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  X,
  Edit,
  Trash2,
  Share2,
  MoreHorizontal,
  ExternalLink,
  BookOpen,
  Globe,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

// Types
interface Language {
  code: string;
  name: string;
  count: number;
}

interface Glossary {
  id: string;
  title: string;
  description?: string;
  isDefault: boolean;
  status: "available" | "pending";
  languages: Language[];
  owner: string;
  createdAt: string;
  lastModified: string;
  termCount: number;
}

// Mock data
const mockGlossaries: Glossary[] = [
  {
    id: "1",
    title: "Council Meetings",
    description:
      "Official terminology for city council meetings and procedures",
    isDefault: true,
    status: "available",
    languages: [
      { code: "en-US", name: "English (US)", count: 45 },
      { code: "es", name: "Spanish", count: 42 },
      { code: "fr", name: "French", count: 38 },
    ],
    owner: "Deacon Poon",
    createdAt: "2023-12-15",
    lastModified: "2023-12-20",
    termCount: 45,
  },
  {
    id: "2",
    title: "Legal Terms",
    description: "Standard legal terminology and phrases",
    isDefault: false,
    status: "available",
    languages: [
      { code: "en-US", name: "English (US)", count: 128 },
      { code: "de", name: "German", count: 95 },
    ],
    owner: "John Smith",
    createdAt: "2023-12-10",
    lastModified: "2023-12-18",
    termCount: 128,
  },
  {
    id: "3",
    title: "Medical Procedures",
    description: "Healthcare and medical procedure terminology",
    isDefault: false,
    status: "pending",
    languages: [{ code: "en-US", name: "English (US)", count: 67 }],
    owner: "Dr. Sarah Johnson",
    createdAt: "2023-12-22",
    lastModified: "2023-12-22",
    termCount: 67,
  },
];

const availableLanguages = [
  { code: "en-US", name: "English (US)" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "nl", name: "Dutch — Nederlands" },
  { code: "af", name: "Afrikaans" },
  { code: "sq", name: "Albanian" },
  { code: "ar", name: "Arabic — العربية" },
  { code: "zh-CN", name: "Chinese (Simplified)" },
  { code: "zh-TW", name: "Chinese (Traditional)" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "ru", name: "Russian" },
];

export default function GlossariesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("available");
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedGlossary, setSelectedGlossary] = useState<Glossary | null>(
    null
  );
  const [isMobile, setIsMobile] = useState(false);

  // Add glossary form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    isDefault: false,
    languages: [] as Language[],
    selectedLanguage: "",
    boostPhrases: "",
    blockPhrases: "",
    replacePhrases: "",
  });

  // Check if screen is mobile
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Filter glossaries based on search and tab
  const filteredGlossaries = mockGlossaries.filter((glossary) => {
    const matchesSearch =
      glossary.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      glossary.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = glossary.status === activeTab;
    return matchesSearch && matchesTab;
  });

  // Handle form submission
  const handleSaveGlossary = () => {
    console.log("Saving glossary:", formData);
    // Reset form and close
    setFormData({
      title: "",
      description: "",
      isDefault: false,
      languages: [],
      selectedLanguage: "",
      boostPhrases: "",
      blockPhrases: "",
      replacePhrases: "",
    });
    setShowAddForm(false);
  };

  // Handle adding a language
  const handleAddLanguage = () => {
    if (formData.selectedLanguage) {
      const language = availableLanguages.find(
        (l) => l.code === formData.selectedLanguage
      );
      if (
        language &&
        !formData.languages.find((l) => l.code === language.code)
      ) {
        setFormData({
          ...formData,
          languages: [...formData.languages, { ...language, count: 0 }],
          selectedLanguage: "",
        });
      }
    }
  };

  // Handle removing a language
  const handleRemoveLanguage = (code: string) => {
    setFormData({
      ...formData,
      languages: formData.languages.filter((l) => l.code !== code),
    });
  };

  // Render glossary card
  const renderGlossaryCard = (glossary: Glossary) => (
    <div
      key={glossary.id}
      className={cn(
        "p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md",
        selectedGlossary?.id === glossary.id
          ? "border-brand-teal bg-brand-teal/5"
          : "border-gray-200 bg-white"
      )}
      onClick={() => setSelectedGlossary(glossary)}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900">{glossary.title}</h3>
          {glossary.isDefault && (
            <Badge variant="secondary" className="text-xs">
              Default
            </Badge>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </DropdownMenuItem>
            <DropdownMenuItem>
              <ExternalLink className="h-4 w-4 mr-2" />
              Export
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {glossary.description && (
        <p className="text-sm text-gray-600 mb-3">{glossary.description}</p>
      )}

      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
        <span>{glossary.termCount} terms</span>
        <span>{glossary.languages.length} languages</span>
        <span>By {glossary.owner}</span>
      </div>

      <div className="flex flex-wrap gap-1">
        {glossary.languages.map((lang) => (
          <Badge key={lang.code} variant="outline" className="text-xs">
            {lang.name} ({lang.count})
          </Badge>
        ))}
      </div>
    </div>
  );

  // Render add glossary form
  const renderAddGlossaryForm = () => (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="font-semibold">Add Glossary</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowAddForm(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-6">
        {/* Title and ID */}
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            Title:
          </label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="Enter glossary title"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">
            Description:
          </label>
          <Input
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Optional description"
          />
        </div>

        {/* Set as Default */}
        <div className="flex items-center justify-between">
          <label htmlFor="default" className="text-sm font-medium">
            Set as Default:
          </label>
          <Switch
            id="default"
            checked={formData.isDefault}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, isDefault: checked })
            }
          />
        </div>

        {/* Languages */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Languages:</label>

          {/* Added languages */}
          <div className="space-y-2">
            {formData.languages.map((lang) => (
              <div
                key={lang.code}
                className="flex items-center justify-between p-2 border rounded"
              >
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{lang.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {lang.count}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveLanguage(lang.code)}
                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Add language */}
          <div className="flex gap-2">
            <Select
              value={formData.selectedLanguage}
              onValueChange={(value) =>
                setFormData({ ...formData, selectedLanguage: value })
              }
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select a language to add" />
              </SelectTrigger>
              <SelectContent>
                {availableLanguages
                  .filter(
                    (lang) =>
                      !formData.languages.find((l) => l.code === lang.code)
                  )
                  .map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={handleAddLanguage}
              disabled={!formData.selectedLanguage}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Boost/Block/Replace Tabs */}
        <div className="space-y-3">
          <Tabs defaultValue="boost" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="boost">Boost (0)</TabsTrigger>
              <TabsTrigger value="block">Block (0)</TabsTrigger>
              <TabsTrigger value="replace">Replace (0)</TabsTrigger>
            </TabsList>

            <TabsContent value="boost" className="mt-3">
              <Textarea
                placeholder="Enter boost phrases"
                value={formData.boostPhrases}
                onChange={(e) =>
                  setFormData({ ...formData, boostPhrases: e.target.value })
                }
                className="min-h-[120px]"
              />
            </TabsContent>

            <TabsContent value="block" className="mt-3">
              <Textarea
                placeholder="Enter block phrases"
                value={formData.blockPhrases}
                onChange={(e) =>
                  setFormData({ ...formData, blockPhrases: e.target.value })
                }
                className="min-h-[120px]"
              />
            </TabsContent>

            <TabsContent value="replace" className="mt-3">
              <Textarea
                placeholder="Enter replace phrases"
                value={formData.replacePhrases}
                onChange={(e) =>
                  setFormData({ ...formData, replacePhrases: e.target.value })
                }
                className="min-h-[120px]"
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Form Actions */}
      <div className="p-4 border-t flex justify-between">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() =>
              setFormData({
                title: "",
                description: "",
                isDefault: false,
                languages: [],
                selectedLanguage: "",
                boostPhrases: "",
                blockPhrases: "",
                replacePhrases: "",
              })
            }
          >
            Reset
          </Button>
          <Button
            variant="outline"
            className="text-brand-teal border-brand-teal hover:bg-brand-teal/10"
          >
            Add Language
          </Button>
        </div>
        <Button
          onClick={handleSaveGlossary}
          className="bg-brand-teal hover:bg-brand-teal/90"
        >
          Save
        </Button>
      </div>
    </div>
  );

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader title="Glossaries" />
        <main className="flex-1 overflow-hidden bg-[#f8f9fa]">
          {!isMobile ? (
            /* Desktop: Resizable Layout */
            <ResizablePanelGroup direction="horizontal" className="h-full">
              {/* Main Panel */}
              <ResizablePanel defaultSize={showAddForm ? 60 : 100} minSize={50}>
                <div className="h-full flex flex-col bg-white">
                  {/* Header */}
                  <div className="p-6 border-b">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h1 className="text-2xl font-bold">Glossaries</h1>
                        <p className="text-gray-600">
                          Manage terminology and translation glossaries
                        </p>
                      </div>
                      <Button
                        onClick={() => setShowAddForm(true)}
                        className="bg-brand-teal hover:bg-brand-teal/90"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Glossary
                      </Button>
                    </div>

                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="border-b">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="h-12 w-full justify-start rounded-none border-0 bg-transparent p-0">
                        <TabsTrigger
                          value="available"
                          className="rounded-none border-b-2 border-transparent data-[state=active]:border-brand-teal data-[state=active]:bg-transparent"
                        >
                          Available
                        </TabsTrigger>
                        <TabsTrigger
                          value="pending"
                          className="rounded-none border-b-2 border-transparent data-[state=active]:border-brand-teal data-[state=active]:bg-transparent"
                        >
                          Pending
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>

                  {/* Content */}
                  <div className="flex-1 overflow-auto p-6">
                    {filteredGlossaries.length > 0 ? (
                      <div className="grid gap-4">
                        {filteredGlossaries.map(renderGlossaryCard)}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <BookOpen className="h-12 w-12 mb-4 text-gray-300" />
                        <h3 className="text-lg font-semibold mb-2">
                          No glossaries found
                        </h3>
                        <p className="text-center text-gray-400">
                          {searchQuery
                            ? "Try adjusting your search terms"
                            : `No ${activeTab} glossaries available`}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </ResizablePanel>

              {/* Add Glossary Panel */}
              {showAddForm && (
                <>
                  <ResizableHandle withHandle />
                  <ResizablePanel defaultSize={40} minSize={30} maxSize={60}>
                    {renderAddGlossaryForm()}
                  </ResizablePanel>
                </>
              )}
            </ResizablePanelGroup>
          ) : (
            /* Mobile: Stacked Layout */
            <div className="h-full">
              {showAddForm ? (
                renderAddGlossaryForm()
              ) : (
                <div className="h-full flex flex-col bg-white">
                  {/* Mobile Header */}
                  <div className="p-4 border-b">
                    <div className="flex items-center justify-between mb-4">
                      <h1 className="text-xl font-bold">Glossaries</h1>
                      <Button
                        onClick={() => setShowAddForm(true)}
                        size="sm"
                        className="bg-brand-teal hover:bg-brand-teal/90"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Mobile Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Mobile Tabs */}
                  <div className="border-b">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="h-12 w-full justify-start rounded-none border-0 bg-transparent p-0">
                        <TabsTrigger
                          value="available"
                          className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-brand-teal data-[state=active]:bg-transparent"
                        >
                          Available
                        </TabsTrigger>
                        <TabsTrigger
                          value="pending"
                          className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-brand-teal data-[state=active]:bg-transparent"
                        >
                          Pending
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>

                  {/* Mobile Content */}
                  <div className="flex-1 overflow-auto p-4">
                    {filteredGlossaries.length > 0 ? (
                      <div className="space-y-4">
                        {filteredGlossaries.map(renderGlossaryCard)}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <BookOpen className="h-12 w-12 mb-4 text-gray-300" />
                        <h3 className="text-lg font-semibold mb-2">
                          No glossaries found
                        </h3>
                        <p className="text-center text-gray-400">
                          {searchQuery
                            ? "Try adjusting your search terms"
                            : `No ${activeTab} glossaries available`}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
