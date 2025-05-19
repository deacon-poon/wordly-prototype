"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import {
  CreditCard,
  PlusCircle,
  ChevronDown,
  FileText,
  UserPlus,
  Book,
  Search,
  Clock,
  Users,
  X,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface AppHeaderProps {
  title?: string;
}

export function AppHeader({ title = "Dashboard" }: AppHeaderProps) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isSearching, setIsSearching] = React.useState(false);

  // Mock search results
  const searchResults = [
    { id: 1, type: "session", title: "Marketing Meeting", date: "Today" },
    { id: 2, type: "transcript", title: "Product Demo", date: "Yesterday" },
    { id: 3, type: "glossary", title: "Technical Terms", date: "2 days ago" },
    { id: 4, type: "user", title: "Sarah Johnson", date: "Team Member" },
  ];

  // Generate breadcrumb items from pathname
  const getBreadcrumbItems = () => {
    const segments = pathname.split("/").filter(Boolean);

    if (segments.length === 0) {
      return [{ label: "Home", href: "/", active: true }];
    }

    const items = [{ label: "Home", href: "/", active: false }];

    let currentPath = "";

    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;

      // Format the segment label
      let label = segment.charAt(0).toUpperCase() + segment.slice(1);

      // Special cases for specific segments
      if (segment === "organization" && index === 0) {
        label = "Organization Management";
      } else if (segments[0] === "organization") {
        // Format organization sub-pages
        switch (segment) {
          case "users":
            label = "All Users";
            break;
          case "custom-fields":
            label = "Custom Fields";
            break;
          case "workspace":
            label = "Workspace";
            break;
          // Keep defaults for others
        }
      } else if (segments[0] === "workspace") {
        // Format workspace sub-pages
        switch (segment) {
          case "users":
            label = "Users";
            break;
          case "defaults":
            label = "Session Defaults";
            break;
          // Keep defaults for others
        }
      }

      items.push({
        label,
        href: currentPath,
        active: index === segments.length - 1,
      });
    });

    return items;
  };

  const breadcrumbItems = getBreadcrumbItems();

  // Get the title from the pathname if not provided
  const pageTitle =
    title ||
    (pathname.split("/").pop()
      ? pathname.split("/").pop()!.charAt(0).toUpperCase() +
        pathname.split("/").pop()!.slice(1)
      : "Dashboard");

  // Mock user balance
  const userBalance = 2345; // Minutes available

  const getSearchIcon = (type: string) => {
    switch (type) {
      case "session":
        return <Clock className="h-4 w-4 text-brand-teal" />;
      case "transcript":
        return <FileText className="h-4 w-4 text-brand-pink" />;
      case "glossary":
        return <Book className="h-4 w-4 text-blue-500" />;
      case "user":
        return <Users className="h-4 w-4 text-purple-500" />;
      default:
        return <Search className="h-4 w-4" />;
    }
  };

  return (
    <header className="flex sticky top-0 h-16 shrink-0 items-center gap-2 px-4 z-20 shadow-sm bg-gradient-to-r from-brand-teal/15 via-brand-teal/5 to-brand-pink/5 w-full">
      {/* Left Section */}
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
      </div>

      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
          {breadcrumbItems.map((item, index) => (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                {item.active ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      {/* Right Section */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Search Bar */}
        <div className="relative hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              className="h-9 w-[240px] pl-10 pr-10 rounded-md border-gray-200 bg-white focus-visible:ring-brand-teal"
              placeholder="Search across Wordly..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearching(e.target.value.length > 0);
              }}
            />
            {searchQuery && (
              <button
                className="absolute right-3 top-2.5"
                onClick={() => {
                  setSearchQuery("");
                  setIsSearching(false);
                }}
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            )}
          </div>

          {/* Search Results Dropdown */}
          {isSearching && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md shadow-lg border z-50">
              <div className="p-2 text-xs text-gray-500 border-b">
                {searchResults.length} results
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    className="px-3 py-2 hover:bg-gray-50 cursor-pointer flex items-center"
                  >
                    <div className="mr-2">{getSearchIcon(result.type)}</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{result.title}</p>
                      <p className="text-xs text-gray-500">
                        <span className="capitalize">{result.type}</span> •{" "}
                        {result.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-2 text-center border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-brand-teal text-xs"
                >
                  View all results
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Minutes Balance */}
        <div className="flex items-center gap-2 px-4 py-2 bg-brand-teal/10 rounded-md border border-brand-teal/20">
          <CreditCard className="h-4 w-4 text-brand-teal" />
          <span className="text-sm font-medium text-brand-teal">
            {userBalance} minutes
          </span>
        </div>

        {/* Quick Add Button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-brand-teal hover:bg-brand-teal/90 text-white text-sm px-3">
              <PlusCircle className="h-4 w-4 mr-2" />
              Quick Add
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <FileText className="mr-2 h-4 w-4" />
                <span>New Session</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Book className="mr-2 h-4 w-4" />
                <span>New Glossary</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <UserPlus className="mr-2 h-4 w-4" />
                <span>Invite User</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
