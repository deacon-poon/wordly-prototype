"use client";

import * as React from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { selectSidebarCollapsed } from "@/store/slices/sidebarSlice";
import { cn } from "@/lib/utils";
import { Folder, FolderGit2, FileText, Book, Plus } from "lucide-react";
import { SidebarSection, SidebarItem } from "@/components/ui/sidebar";
import { Button } from "./ui/button";

interface NavProjectsProps {
  pathname: string;
}

export function NavProjects({ pathname }: NavProjectsProps) {
  const isCollapsed = useSelector(selectSidebarCollapsed);

  const projectItems = [
    {
      title: "Marketing",
      href: "/projects/marketing",
      icon: Folder,
    },
    {
      title: "Sales Presentations",
      href: "/projects/sales",
      icon: FolderGit2,
    },
    {
      title: "Transcripts",
      href: "/projects/transcripts",
      icon: FileText,
    },
    {
      title: "Glossaries",
      href: "/projects/glossaries",
      icon: Book,
    },
  ];

  return (
    <SidebarSection title="Projects">
      {projectItems.map((item) => (
        <Link href={item.href} key={item.href}>
          <SidebarItem
            icon={<item.icon className="h-4 w-4" />}
            title={item.title}
            isActive={pathname === item.href}
          />
        </Link>
      ))}

      {!isCollapsed && (
        <div className="px-2 mt-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start text-xs text-brand-teal border-dashed border-brand-teal/20 hover:bg-brand-teal/5"
          >
            <Plus className="h-3.5 w-3.5 mr-2" />
            Add Project
          </Button>
        </div>
      )}
    </SidebarSection>
  );
}
