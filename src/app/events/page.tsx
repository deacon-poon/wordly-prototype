"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Calendar, ExternalLink, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ManualEventWizard } from "@/components/events/ManualEventWizard";
import type { EventDetailsFormData } from "@/components/events/forms";
import { saveEvent, serializeEvent } from "@/lib/eventStore";

// Data interfaces
interface Session {
  id: string;
  title: string;
  presenters: string[];
  scheduledDate: string;
  scheduledStart: string;
  endTime: string;
  status: "pending" | "active" | "completed" | "skipped";
}

interface Location {
  id: string;
  name: string;
  sessionCount: number;
  locationSessionId: string;
  passcode: string;
  sessions: Session[];
}

type EventStatus = "active" | "upcoming" | "past";

interface Event {
  id: string;
  name: string;
  dateRange: string;
  startDate: Date;
  endDate: Date;
  locationCount: number;
  sessionCount: number;
  description: string;
  publicSummaryUrl?: string;
  locations: Location[];
}

// Helper functions
function getEventStatus(startDate: Date, endDate: Date): EventStatus {
  const now = new Date();
  // Compare dates only (ignore time) to avoid timezone issues
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const start = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate()
  );
  const end = new Date(
    endDate.getFullYear(),
    endDate.getMonth(),
    endDate.getDate()
  );

  if (today >= start && today <= end) {
    return "active";
  } else if (today < start) {
    return "upcoming";
  } else {
    return "past";
  }
}

const getRelativeDate = (daysFromNow: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date;
};

const formatDateRange = (startDate: Date, endDate: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
  };
  const start = startDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
  const end = endDate.toLocaleDateString("en-US", options);
  return `${start}-${endDate.getDate()}, ${endDate.getFullYear()}`;
};

export default function EventsPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<EventStatus | "all">(
    "active"
  );
  // Event creation modal
  const [isManualWizardOpen, setIsManualWizardOpen] = useState(false);

  // Events state - initialized with mock data
  // In production, this would be fetched from an API
  const [events, setEvents] = useState<Event[]>(() => [
    // ACTIVE EVENT (happening now)
    {
      id: "evt-001",
      name: "AI & Machine Learning Summit 2024",
      dateRange: formatDateRange(getRelativeDate(0), getRelativeDate(1)),
      startDate: getRelativeDate(0),
      endDate: getRelativeDate(1),
      locationCount: 3,
      sessionCount: 10,
      description:
        "Live conference on the latest advances in AI, machine learning, and deep learning technologies",
      publicSummaryUrl: "/public/ai-ml-summit-2024",
      locations: [
        {
          id: "loc-001",
          name: "Main Auditorium",
          sessionCount: 5,
          locationSessionId: "MAIN-1234",
          passcode: "123456",
          sessions: [
            {
              id: "ses-001",
              title: "The Future of AI in Enterprise",
              presenters: ["Dr. Sarah Chen"],
              scheduledDate: new Date(getRelativeDate(0).setHours(9, 0, 0, 0))
                .toISOString()
                .split("T")[0],
              scheduledStart: "09:00",
              endTime: "10:30",
              status: "pending",
            },
            {
              id: "ses-002",
              title: "Scalable Cloud Architecture Patterns",
              presenters: ["Mike Rodriguez"],
              scheduledDate: new Date(getRelativeDate(0).setHours(11, 0, 0, 0))
                .toISOString()
                .split("T")[0],
              scheduledStart: "11:00",
              endTime: "12:00",
              status: "pending",
            },
            {
              id: "ses-003",
              title: "Cybersecurity Trends and Threats",
              presenters: ["Alex Thompson"],
              scheduledDate: new Date(getRelativeDate(0).setHours(13, 30, 0, 0))
                .toISOString()
                .split("T")[0],
              scheduledStart: "13:30",
              endTime: "14:30",
              status: "pending",
            },
            {
              id: "ses-004",
              title: "Building a DevOps Culture",
              presenters: ["Jennifer Wu"],
              scheduledDate: new Date(getRelativeDate(1).setHours(9, 0, 0, 0))
                .toISOString()
                .split("T")[0],
              scheduledStart: "09:00",
              endTime: "10:30",
              status: "pending",
            },
            {
              id: "ses-005",
              title: "Machine Learning in Production",
              presenters: ["Robert Kim", "Dr. Lisa Wang"],
              scheduledDate: new Date(getRelativeDate(1).setHours(11, 0, 0, 0))
                .toISOString()
                .split("T")[0],
              scheduledStart: "11:00",
              endTime: "12:30",
              status: "pending",
            },
          ],
        },
        {
          id: "loc-002",
          name: "Workshop Room A",
          sessionCount: 3,
          locationSessionId: "HALL-5678",
          passcode: "234567",
          sessions: [
            {
              id: "ses-006",
              title: "Hands-on Kubernetes Workshop",
              presenters: ["Lisa Park"],
              scheduledDate: "2025-11-17",
              scheduledStart: "09:00",
              endTime: "11:00",
              status: "pending",
            },
            {
              id: "ses-007",
              title: "Advanced React Patterns",
              presenters: ["David Martinez"],
              scheduledDate: "2025-11-17",
              scheduledStart: "11:30",
              endTime: "13:00",
              status: "pending",
            },
            {
              id: "ses-008",
              title: "Microservices Architecture",
              presenters: ["Emily Zhang"],
              scheduledDate: "2025-11-17",
              scheduledStart: "14:00",
              endTime: "15:30",
              status: "pending",
            },
          ],
        },
        {
          id: "loc-003",
          name: "Breakout Room B",
          sessionCount: 2,
          locationSessionId: "WORK-1234",
          passcode: "345678",
          sessions: [
            {
              id: "ses-009",
              title: "API Design Best Practices",
              presenters: ["Tom Anderson"],
              scheduledDate: "2025-11-17",
              scheduledStart: "10:00",
              endTime: "11:30",
              status: "pending",
            },
            {
              id: "ses-010",
              title: "Performance Optimization Techniques",
              presenters: ["Rachel Green"],
              scheduledDate: "2025-11-17",
              scheduledStart: "12:00",
              endTime: "13:30",
              status: "pending",
            },
          ],
        },
      ],
    },
    // UPCOMING EVENTS
    {
      id: "evt-002",
      name: "Cloud Infrastructure & DevOps Summit",
      dateRange: formatDateRange(getRelativeDate(7), getRelativeDate(8)),
      startDate: getRelativeDate(7),
      endDate: getRelativeDate(8),
      locationCount: 4,
      sessionCount: 18,
      description:
        "Two-day summit focused on cloud architecture, Kubernetes, and modern DevOps practices",
      publicSummaryUrl: "/public/cloud-devops-summit-2024",
      locations: [
        {
          id: "loc-004",
          name: "Cloud Theater",
          sessionCount: 5,
          locationSessionId: "BREK-5678",
          passcode: "456789",
          sessions: [
            {
              id: "ses-011",
              title: "Kubernetes at Scale",
              presenters: ["Maya Patel"],
              scheduledDate: "2025-11-17",
              scheduledStart: "09:00",
              endTime: "10:30",
              status: "pending",
            },
            {
              id: "ses-012",
              title: "Multi-Cloud Strategies",
              presenters: ["James Wilson"],
              scheduledDate: "2025-11-17",
              scheduledStart: "11:00",
              endTime: "12:30",
              status: "pending",
            },
            {
              id: "ses-013",
              title: "Serverless Architecture Patterns",
              presenters: ["Sofia Garcia"],
              scheduledDate: "2025-11-17",
              scheduledStart: "13:30",
              endTime: "15:00",
              status: "pending",
            },
            {
              id: "ses-014",
              title: "Infrastructure as Code Best Practices",
              presenters: ["Chen Wei"],
              scheduledDate: "2025-11-17",
              scheduledStart: "15:30",
              endTime: "17:00",
              status: "pending",
            },
            {
              id: "ses-015",
              title: "Cloud Cost Optimization",
              presenters: ["Amanda Lee"],
              scheduledDate: "2025-11-17",
              scheduledStart: "17:30",
              endTime: "18:30",
              status: "pending",
            },
          ],
        },
        {
          id: "loc-005",
          name: "DevOps Workshop",
          sessionCount: 6,
          locationSessionId: "EXPO-1234",
          passcode: "567890",
          sessions: [
            {
              id: "ses-016",
              title: "CI/CD Pipeline Automation",
              presenters: ["Marcus Johnson"],
              scheduledDate: "2025-11-17",
              scheduledStart: "09:00",
              endTime: "10:30",
              status: "pending",
            },
            {
              id: "ses-017",
              title: "GitOps with ArgoCD",
              presenters: ["Yuki Tanaka"],
              scheduledDate: "2025-11-17",
              scheduledStart: "11:00",
              endTime: "12:30",
              status: "pending",
            },
            {
              id: "ses-018",
              title: "Observability & Monitoring",
              presenters: ["Carlos Rivera"],
              scheduledDate: "2025-11-17",
              scheduledStart: "13:30",
              endTime: "15:00",
              status: "pending",
            },
            {
              id: "ses-019",
              title: "Security in DevOps",
              presenters: ["Priya Sharma"],
              scheduledDate: "2025-11-17",
              scheduledStart: "15:30",
              endTime: "17:00",
              status: "pending",
            },
            {
              id: "ses-020",
              title: "Platform Engineering",
              presenters: ["Oliver Brown"],
              scheduledDate: "2025-11-17",
              scheduledStart: "17:30",
              endTime: "18:30",
              status: "pending",
            },
            {
              id: "ses-021",
              title: "Developer Experience Tools",
              presenters: ["Emma Davis"],
              scheduledDate: "2025-11-17",
              scheduledStart: "19:00",
              endTime: "20:00",
              status: "pending",
            },
          ],
        },
        {
          id: "loc-006",
          name: "Container Lab",
          sessionCount: 4,
          locationSessionId: "TECH-5678",
          passcode: "678901",
          sessions: [
            {
              id: "ses-022",
              title: "Docker Deep Dive",
              presenters: ["Hassan Ali"],
              scheduledDate: "2025-11-17",
              scheduledStart: "10:00",
              endTime: "11:30",
              status: "pending",
            },
            {
              id: "ses-023",
              title: "Service Mesh Patterns",
              presenters: ["Nina Kowalski"],
              scheduledDate: "2025-11-17",
              scheduledStart: "12:00",
              endTime: "13:30",
              status: "pending",
            },
            {
              id: "ses-024",
              title: "Container Security",
              presenters: ["Ahmed Hassan"],
              scheduledDate: "2025-11-17",
              scheduledStart: "14:00",
              endTime: "15:30",
              status: "pending",
            },
            {
              id: "ses-025",
              title: "Microservices Best Practices",
              presenters: ["Laura Martinez"],
              scheduledDate: "2025-11-17",
              scheduledStart: "16:00",
              endTime: "17:30",
              status: "pending",
            },
          ],
        },
        {
          id: "loc-007",
          name: "Automation Studio",
          sessionCount: 3,
          locationSessionId: "BIZZ-1234",
          passcode: "789012",
          sessions: [
            {
              id: "ses-026",
              title: "Terraform at Enterprise Scale",
              presenters: ["Kevin O'Brien"],
              scheduledDate: "2025-11-17",
              scheduledStart: "09:30",
              endTime: "11:00",
              status: "pending",
            },
            {
              id: "ses-027",
              title: "Ansible for Cloud Automation",
              presenters: ["Isabella Romano"],
              scheduledDate: "2025-11-17",
              scheduledStart: "11:30",
              endTime: "13:00",
              status: "pending",
            },
            {
              id: "ses-028",
              title: "Policy as Code",
              presenters: ["Daniel Kim"],
              scheduledDate: "2025-11-17",
              scheduledStart: "14:00",
              endTime: "15:30",
              status: "pending",
            },
          ],
        },
      ],
    },
    {
      id: "evt-003",
      name: "Design Systems & UX Conference",
      dateRange: formatDateRange(getRelativeDate(20), getRelativeDate(21)),
      startDate: getRelativeDate(20),
      endDate: getRelativeDate(21),
      locationCount: 2,
      sessionCount: 8,
      description:
        "Explore the latest in design systems, UX research, and product design methodologies",
      publicSummaryUrl: "/public/design-ux-conf-2024",
      locations: [
        {
          id: "loc-008",
          name: "Design Theater",
          sessionCount: 5,
          locationSessionId: "LEAD-5678",
          passcode: "890123",
          sessions: [
            {
              id: "ses-029",
              title: "Building Scalable Design Systems",
              presenters: ["Emma Thompson"],
              scheduledDate: "2025-11-17",
              scheduledStart: "09:00",
              endTime: "10:30",
              status: "pending",
            },
            {
              id: "ses-030",
              title: "Design Tokens in Practice",
              presenters: ["Lucas Chen"],
              scheduledDate: "2025-11-17",
              scheduledStart: "11:00",
              endTime: "12:30",
              status: "pending",
            },
            {
              id: "ses-031",
              title: "Accessibility-First Design",
              presenters: ["Aisha Ndiaye"],
              scheduledDate: "2025-11-17",
              scheduledStart: "13:30",
              endTime: "15:00",
              status: "pending",
            },
            {
              id: "ses-032",
              title: "Component API Design",
              presenters: ["Ryan Mitchell"],
              scheduledDate: "2025-11-17",
              scheduledStart: "15:30",
              endTime: "17:00",
              status: "pending",
            },
            {
              id: "ses-033",
              title: "Design System Governance",
              presenters: ["Sophia Berg"],
              scheduledDate: "2025-11-17",
              scheduledStart: "17:30",
              endTime: "18:30",
              status: "pending",
            },
          ],
        },
        {
          id: "loc-009",
          name: "UX Research Lab",
          sessionCount: 3,
          locationSessionId: "AMPH-9012",
          passcode: "901234",
          sessions: [
            {
              id: "ses-034",
              title: "User Research at Scale",
              presenters: ["Maria Santos"],
              scheduledDate: "2025-11-17",
              scheduledStart: "10:00",
              endTime: "11:30",
              status: "pending",
            },
            {
              id: "ses-035",
              title: "Rapid Prototyping Techniques",
              presenters: ["Jacob Miller"],
              scheduledDate: "2025-11-17",
              scheduledStart: "12:00",
              endTime: "13:30",
              status: "pending",
            },
            {
              id: "ses-036",
              title: "Data-Driven Design Decisions",
              presenters: ["Olivia Wang"],
              scheduledDate: "2025-11-17",
              scheduledStart: "14:30",
              endTime: "16:00",
              status: "pending",
            },
          ],
        },
      ],
    },
    {
      id: "evt-004",
      name: "Web3 & Blockchain Summit",
      dateRange: formatDateRange(getRelativeDate(33), getRelativeDate(34)),
      startDate: getRelativeDate(33),
      endDate: getRelativeDate(34),
      locationCount: 2,
      sessionCount: 10,
      description:
        "Comprehensive summit on blockchain technology, smart contracts, and decentralized applications",
      publicSummaryUrl: "/public/web3-blockchain-2024",
      locations: [
        {
          id: "loc-010",
          name: "Blockchain Hall",
          sessionCount: 6,
          locationSessionId: "STGE-9012",
          passcode: "112233",
          sessions: [
            {
              id: "ses-037",
              title: "Smart Contract Security",
              presenters: ["Alex Turner"],
              scheduledDate: "2025-11-17",
              scheduledStart: "09:00",
              endTime: "10:30",
              status: "pending",
            },
            {
              id: "ses-038",
              title: "DeFi Architecture Patterns",
              presenters: ["Raj Kapoor"],
              scheduledDate: "2025-11-17",
              scheduledStart: "11:00",
              endTime: "12:30",
              status: "pending",
            },
            {
              id: "ses-039",
              title: "NFT Marketplace Development",
              presenters: ["Sophie Laurent"],
              scheduledDate: "2025-11-17",
              scheduledStart: "13:30",
              endTime: "15:00",
              status: "pending",
            },
            {
              id: "ses-040",
              title: "Layer 2 Scaling Solutions",
              presenters: ["Mohammed Farah"],
              scheduledDate: "2025-11-17",
              scheduledStart: "15:30",
              endTime: "17:00",
              status: "pending",
            },
            {
              id: "ses-041",
              title: "Blockchain Interoperability",
              presenters: ["Anna Kowalczyk"],
              scheduledDate: "2025-11-17",
              scheduledStart: "17:30",
              endTime: "18:30",
              status: "pending",
            },
            {
              id: "ses-042",
              title: "Web3 Gaming",
              presenters: ["Tyler Jackson"],
              scheduledDate: "2025-11-17",
              scheduledStart: "19:00",
              endTime: "20:00",
              status: "pending",
            },
          ],
        },
        {
          id: "loc-011",
          name: "DApp Workshop",
          sessionCount: 4,
          locationSessionId: "AUDI-9012",
          passcode: "223344",
          sessions: [
            {
              id: "ses-043",
              title: "Building with Ethereum",
              presenters: ["Yuki Nakamura"],
              scheduledDate: "2025-11-17",
              scheduledStart: "10:00",
              endTime: "11:30",
              status: "pending",
            },
            {
              id: "ses-044",
              title: "Solidity Best Practices",
              presenters: ["Carlos Mendez"],
              scheduledDate: "2025-11-17",
              scheduledStart: "12:00",
              endTime: "13:30",
              status: "pending",
            },
            {
              id: "ses-045",
              title: "Web3 Frontend Integration",
              presenters: ["Lisa Anderson"],
              scheduledDate: "2025-11-17",
              scheduledStart: "14:00",
              endTime: "15:30",
              status: "pending",
            },
            {
              id: "ses-046",
              title: "DAO Governance Models",
              presenters: ["Ibrahim Youssef"],
              scheduledDate: "2025-11-17",
              scheduledStart: "16:00",
              endTime: "17:30",
              status: "pending",
            },
          ],
        },
      ],
    },
    {
      id: "evt-005",
      name: "Data Science & Analytics Forum",
      dateRange: formatDateRange(getRelativeDate(47), getRelativeDate(48)),
      startDate: getRelativeDate(47),
      endDate: getRelativeDate(48),
      locationCount: 3,
      sessionCount: 12,
      description:
        "Advanced forum on data science, machine learning operations, and business analytics",
      publicSummaryUrl: "/public/data-science-forum-2024",
      locations: [
        {
          id: "loc-012",
          name: "Data Theater",
          sessionCount: 5,
          locationSessionId: "ROOM-9012",
          passcode: "334455",
          sessions: [
            {
              id: "ses-047",
              title: "MLOps Best Practices",
              presenters: ["Grace Liu"],
              scheduledDate: "2025-11-17",
              scheduledStart: "09:00",
              endTime: "10:30",
              status: "pending",
            },
            {
              id: "ses-048",
              title: "Feature Engineering at Scale",
              presenters: ["Marcus Williams"],
              scheduledDate: "2025-11-17",
              scheduledStart: "11:00",
              endTime: "12:30",
              status: "pending",
            },
            {
              id: "ses-049",
              title: "Model Monitoring & Drift Detection",
              presenters: ["Elena Popov"],
              scheduledDate: "2025-11-17",
              scheduledStart: "13:30",
              endTime: "15:00",
              status: "pending",
            },
            {
              id: "ses-050",
              title: "Real-Time Analytics Pipelines",
              presenters: ["Hassan Ibrahim"],
              scheduledDate: "2025-11-17",
              scheduledStart: "15:30",
              endTime: "17:00",
              status: "pending",
            },
            {
              id: "ses-051",
              title: "Ethical AI & Bias Mitigation",
              presenters: ["Amara Jones"],
              scheduledDate: "2025-11-17",
              scheduledStart: "17:30",
              endTime: "18:30",
              status: "pending",
            },
          ],
        },
        {
          id: "loc-013",
          name: "Analytics Lab",
          sessionCount: 4,
          locationSessionId: "CONF-1230",
          passcode: "445566",
          sessions: [
            {
              id: "ses-052",
              title: "Modern Data Stack",
              presenters: ["Kevin Park"],
              scheduledDate: "2025-11-17",
              scheduledStart: "10:00",
              endTime: "11:30",
              status: "pending",
            },
            {
              id: "ses-053",
              title: "Data Visualization Best Practices",
              presenters: ["Natalie Schmidt"],
              scheduledDate: "2025-11-17",
              scheduledStart: "12:00",
              endTime: "13:30",
              status: "pending",
            },
            {
              id: "ses-054",
              title: "Business Intelligence Strategies",
              presenters: ["Raj Patel"],
              scheduledDate: "2025-11-17",
              scheduledStart: "14:00",
              endTime: "15:30",
              status: "pending",
            },
            {
              id: "ses-055",
              title: "Data Governance & Quality",
              presenters: ["Sarah Cohen"],
              scheduledDate: "2025-11-17",
              scheduledStart: "16:00",
              endTime: "17:30",
              status: "pending",
            },
          ],
        },
        {
          id: "loc-014",
          name: "ML Workshop",
          sessionCount: 3,
          locationSessionId: "MEET-4560",
          passcode: "556677",
          sessions: [
            {
              id: "ses-056",
              title: "Deep Learning Architectures",
              presenters: ["Zhang Wei"],
              scheduledDate: "2025-11-17",
              scheduledStart: "09:30",
              endTime: "11:00",
              status: "pending",
            },
            {
              id: "ses-057",
              title: "Natural Language Processing",
              presenters: ["Isabella Costa"],
              scheduledDate: "2025-11-17",
              scheduledStart: "11:30",
              endTime: "13:00",
              status: "pending",
            },
            {
              id: "ses-058",
              title: "Computer Vision Applications",
              presenters: ["Omar Farooq"],
              scheduledDate: "2025-11-17",
              scheduledStart: "14:00",
              endTime: "15:30",
              status: "pending",
            },
          ],
        },
      ],
    },
    // PAST EVENTS
    {
      id: "evt-006",
      name: "Tech Conference 2024 Spring Edition",
      dateRange: formatDateRange(getRelativeDate(-36), getRelativeDate(-35)),
      startDate: getRelativeDate(-36),
      endDate: getRelativeDate(-35),
      locationCount: 2,
      sessionCount: 6,
      description:
        "Annual spring technology conference featuring software development trends and innovations",
      publicSummaryUrl: "/public/tech-conf-spring-2024",
      locations: [
        {
          id: "loc-015",
          name: "Main Stage",
          sessionCount: 4,
          locationSessionId: "BALL-7890",
          passcode: "667788",
          sessions: [
            {
              id: "ses-059",
              title: "State of Software Development 2024",
              presenters: ["John Peterson"],
              scheduledDate: "2025-11-17",
              scheduledStart: "09:00",
              endTime: "10:30",
              status: "completed",
            },
            {
              id: "ses-060",
              title: "Modern JavaScript Frameworks",
              presenters: ["Anna Kowalski"],
              scheduledDate: "2025-11-17",
              scheduledStart: "11:00",
              endTime: "12:30",
              status: "completed",
            },
            {
              id: "ses-061",
              title: "API Design Principles",
              presenters: ["Miguel Torres"],
              scheduledDate: "2025-11-17",
              scheduledStart: "13:30",
              endTime: "15:00",
              status: "completed",
            },
            {
              id: "ses-062",
              title: "Testing Strategies",
              presenters: ["Rachel Green"],
              scheduledDate: "2025-11-17",
              scheduledStart: "15:30",
              endTime: "17:00",
              status: "completed",
            },
          ],
        },
        {
          id: "loc-016",
          name: "Workshop Room",
          sessionCount: 2,
          locationSessionId: "CENT-0120",
          passcode: "778899",
          sessions: [
            {
              id: "ses-063",
              title: "GraphQL Workshop",
              presenters: ["David Chen"],
              scheduledDate: "2025-11-17",
              scheduledStart: "10:00",
              endTime: "12:00",
              status: "completed",
            },
            {
              id: "ses-064",
              title: "Performance Optimization",
              presenters: ["Emma Wilson"],
              scheduledDate: "2025-11-17",
              scheduledStart: "13:00",
              endTime: "15:00",
              status: "completed",
            },
          ],
        },
      ],
    },
    {
      id: "evt-007",
      name: "Mobile Development Summit 2024",
      dateRange: formatDateRange(getRelativeDate(-57), getRelativeDate(-56)),
      startDate: getRelativeDate(-57),
      endDate: getRelativeDate(-56),
      locationCount: 3,
      sessionCount: 12,
      description:
        "Summit focused on iOS, Android, and cross-platform mobile development",
      publicSummaryUrl: "/public/mobile-dev-summit-2024",
      locations: [
        {
          id: "loc-017",
          name: "iOS Hall",
          sessionCount: 4,
          locationSessionId: "EXEC-1110",
          passcode: "889900",
          sessions: [
            {
              id: "ses-065",
              title: "SwiftUI Advanced Patterns",
              presenters: ["Sarah Johnson"],
              scheduledDate: "2025-11-17",
              scheduledStart: "09:00",
              endTime: "10:30",
              status: "completed",
            },
            {
              id: "ses-066",
              title: "iOS App Architecture",
              presenters: ["Michael Chen"],
              scheduledDate: "2025-11-17",
              scheduledStart: "11:00",
              endTime: "12:30",
              status: "completed",
            },
            {
              id: "ses-067",
              title: "Core Data Best Practices",
              presenters: ["Elena Rodriguez"],
              scheduledDate: "2025-11-17",
              scheduledStart: "13:30",
              endTime: "15:00",
              status: "completed",
            },
            {
              id: "ses-068",
              title: "App Store Optimization",
              presenters: ["James Taylor"],
              scheduledDate: "2025-11-17",
              scheduledStart: "15:30",
              endTime: "17:00",
              status: "completed",
            },
          ],
        },
        {
          id: "loc-018",
          name: "Android Studio",
          sessionCount: 5,
          locationSessionId: "PRES-2220",
          passcode: "990011",
          sessions: [
            {
              id: "ses-069",
              title: "Jetpack Compose",
              presenters: ["Priya Sharma"],
              scheduledDate: "2025-11-17",
              scheduledStart: "09:00",
              endTime: "10:30",
              status: "completed",
            },
            {
              id: "ses-070",
              title: "Kotlin Coroutines",
              presenters: ["David Kim"],
              scheduledDate: "2025-11-17",
              scheduledStart: "11:00",
              endTime: "12:30",
              status: "completed",
            },
            {
              id: "ses-071",
              title: "Material Design 3",
              presenters: ["Lisa Wang"],
              scheduledDate: "2025-11-17",
              scheduledStart: "13:30",
              endTime: "15:00",
              status: "completed",
            },
            {
              id: "ses-072",
              title: "Android Testing Strategies",
              presenters: ["Omar Hassan"],
              scheduledDate: "2025-11-17",
              scheduledStart: "15:30",
              endTime: "17:00",
              status: "completed",
            },
            {
              id: "ses-073",
              title: "Performance Optimization",
              presenters: ["Anna Kowalski"],
              scheduledDate: "2025-11-17",
              scheduledStart: "17:30",
              endTime: "18:30",
              status: "completed",
            },
          ],
        },
        {
          id: "loc-019",
          name: "Cross-Platform Lab",
          sessionCount: 3,
          locationSessionId: "VENT-3330",
          passcode: "101112",
          sessions: [
            {
              id: "ses-074",
              title: "React Native Advanced",
              presenters: ["Carlos Rivera"],
              scheduledDate: "2025-11-17",
              scheduledStart: "10:00",
              endTime: "11:30",
              status: "completed",
            },
            {
              id: "ses-075",
              title: "Flutter Development",
              presenters: ["Yuki Tanaka"],
              scheduledDate: "2025-11-17",
              scheduledStart: "12:00",
              endTime: "13:30",
              status: "completed",
            },
            {
              id: "ses-076",
              title: "Mobile CI/CD",
              presenters: ["Marcus Brown"],
              scheduledDate: "2025-11-17",
              scheduledStart: "14:00",
              endTime: "15:30",
              status: "completed",
            },
          ],
        },
      ],
    },
    {
      id: "evt-008",
      name: "Cybersecurity Conference 2024",
      dateRange: formatDateRange(getRelativeDate(-93), getRelativeDate(-92)),
      startDate: getRelativeDate(-93),
      endDate: getRelativeDate(-92),
      locationCount: 2,
      sessionCount: 8,
      description:
        "Annual conference on cybersecurity, threat detection, and enterprise security",
      publicSummaryUrl: "/public/cybersecurity-2024",
      locations: [
        {
          id: "loc-020",
          name: "Security Theater",
          sessionCount: 5,
          locationSessionId: "THEA-4440",
          passcode: "131415",
          sessions: [
            {
              id: "ses-077",
              title: "Zero Trust Architecture",
              presenters: ["Robert Fischer"],
              scheduledDate: "2025-11-17",
              scheduledStart: "09:00",
              endTime: "10:30",
              status: "completed",
            },
            {
              id: "ses-078",
              title: "Cloud Security Best Practices",
              presenters: ["Mei Lin"],
              scheduledDate: "2025-11-17",
              scheduledStart: "11:00",
              endTime: "12:30",
              status: "completed",
            },
            {
              id: "ses-079",
              title: "Threat Intelligence",
              presenters: ["Ahmed Ali"],
              scheduledDate: "2025-11-17",
              scheduledStart: "13:30",
              endTime: "15:00",
              status: "completed",
            },
            {
              id: "ses-080",
              title: "Incident Response",
              presenters: ["Julia Martinez"],
              scheduledDate: "2025-11-17",
              scheduledStart: "15:30",
              endTime: "17:00",
              status: "completed",
            },
            {
              id: "ses-081",
              title: "Security Automation",
              presenters: ["Kevin O'Neill"],
              scheduledDate: "2025-11-17",
              scheduledStart: "17:30",
              endTime: "18:30",
              status: "completed",
            },
          ],
        },
        {
          id: "loc-021",
          name: "Penetration Testing Lab",
          sessionCount: 3,
          locationSessionId: "GATH-5500",
          passcode: "161718",
          sessions: [
            {
              id: "ses-082",
              title: "Ethical Hacking Techniques",
              presenters: ["Nathan Wright"],
              scheduledDate: "2025-11-17",
              scheduledStart: "10:00",
              endTime: "11:30",
              status: "completed",
            },
            {
              id: "ses-083",
              title: "Web Application Security",
              presenters: ["Sophia Berg"],
              scheduledDate: "2025-11-17",
              scheduledStart: "12:00",
              endTime: "13:30",
              status: "completed",
            },
            {
              id: "ses-084",
              title: "Network Security",
              presenters: ["Daniel Park"],
              scheduledDate: "2025-11-17",
              scheduledStart: "14:00",
              endTime: "15:30",
              status: "completed",
            },
          ],
        },
      ],
    },
    {
      id: "evt-009",
      name: "Product Management Summit 2024",
      dateRange: formatDateRange(getRelativeDate(-128), getRelativeDate(-127)),
      startDate: getRelativeDate(-128),
      endDate: getRelativeDate(-127),
      locationCount: 2,
      sessionCount: 7,
      description:
        "Summit for product managers on strategy, roadmapping, and product-led growth",
      publicSummaryUrl: "/public/pm-summit-2024",
      locations: [
        {
          id: "loc-022",
          name: "Product Theater",
          sessionCount: 4,
          locationSessionId: "SPAC-6600",
          passcode: "192021",
          sessions: [
            {
              id: "ses-085",
              title: "Product Strategy Frameworks",
              presenters: ["Rachel Green"],
              scheduledDate: "2025-11-17",
              scheduledStart: "09:00",
              endTime: "10:30",
              status: "completed",
            },
            {
              id: "ses-086",
              title: "User Story Mapping",
              presenters: ["Tom Anderson"],
              scheduledDate: "2025-11-17",
              scheduledStart: "11:00",
              endTime: "12:30",
              status: "completed",
            },
            {
              id: "ses-087",
              title: "Product Analytics",
              presenters: ["Emma Davis"],
              scheduledDate: "2025-11-17",
              scheduledStart: "13:30",
              endTime: "15:00",
              status: "completed",
            },
            {
              id: "ses-088",
              title: "Pricing Strategies",
              presenters: ["Oliver Smith"],
              scheduledDate: "2025-11-17",
              scheduledStart: "15:30",
              endTime: "17:00",
              status: "completed",
            },
          ],
        },
        {
          id: "loc-023",
          name: "Strategy Workshop",
          sessionCount: 3,
          locationSessionId: "LOBY-7700",
          passcode: "222324",
          sessions: [
            {
              id: "ses-089",
              title: "OKRs for Product Teams",
              presenters: ["Nina Patel"],
              scheduledDate: "2025-11-17",
              scheduledStart: "10:00",
              endTime: "11:30",
              status: "completed",
            },
            {
              id: "ses-090",
              title: "Roadmap Planning",
              presenters: ["Lucas Chen"],
              scheduledDate: "2025-11-17",
              scheduledStart: "12:00",
              endTime: "13:30",
              status: "completed",
            },
            {
              id: "ses-091",
              title: "Stakeholder Management",
              presenters: ["Isabella Romano"],
              scheduledDate: "2025-11-17",
              scheduledStart: "14:00",
              endTime: "15:30",
              status: "completed",
            },
          ],
        },
      ],
    },
    {
      id: "evt-010",
      name: "Frontend Development Conference",
      dateRange: formatDateRange(getRelativeDate(-164), getRelativeDate(-163)),
      startDate: getRelativeDate(-164),
      endDate: getRelativeDate(-163),
      locationCount: 3,
      sessionCount: 11,
      description:
        "Conference dedicated to modern frontend development, frameworks, and tooling",
      publicSummaryUrl: "/public/frontend-conf-2024",
      locations: [
        {
          id: "loc-024",
          name: "JavaScript Hall",
          sessionCount: 5,
          locationSessionId: "AREA-8800",
          passcode: "252627",
          sessions: [
            {
              id: "ses-092",
              title: "React Server Components",
              presenters: ["Alex Turner"],
              scheduledDate: "2025-11-17",
              scheduledStart: "09:00",
              endTime: "10:30",
              status: "completed",
            },
            {
              id: "ses-093",
              title: "Vue 3 Composition API",
              presenters: ["Sophie Laurent"],
              scheduledDate: "2025-11-17",
              scheduledStart: "11:00",
              endTime: "12:30",
              status: "completed",
            },
            {
              id: "ses-094",
              title: "Svelte & SvelteKit",
              presenters: ["Hassan Ibrahim"],
              scheduledDate: "2025-11-17",
              scheduledStart: "13:30",
              endTime: "15:00",
              status: "completed",
            },
            {
              id: "ses-095",
              title: "TypeScript Advanced Types",
              presenters: ["Maria Santos"],
              scheduledDate: "2025-11-17",
              scheduledStart: "15:30",
              endTime: "17:00",
              status: "completed",
            },
            {
              id: "ses-096",
              title: "Build Tools & Vite",
              presenters: ["Ryan Mitchell"],
              scheduledDate: "2025-11-17",
              scheduledStart: "17:30",
              endTime: "18:30",
              status: "completed",
            },
          ],
        },
        {
          id: "loc-025",
          name: "CSS & Design Workshop",
          sessionCount: 3,
          locationSessionId: "ZOON-9900",
          passcode: "282930",
          sessions: [
            {
              id: "ses-097",
              title: "Modern CSS Layouts",
              presenters: ["Olivia Wang"],
              scheduledDate: "2025-11-17",
              scheduledStart: "10:00",
              endTime: "11:30",
              status: "completed",
            },
            {
              id: "ses-098",
              title: "Tailwind CSS Best Practices",
              presenters: ["Jacob Miller"],
              scheduledDate: "2025-11-17",
              scheduledStart: "12:00",
              endTime: "13:30",
              status: "completed",
            },
            {
              id: "ses-099",
              title: "CSS Animation Performance",
              presenters: ["Aisha Ndiaye"],
              scheduledDate: "2025-11-17",
              scheduledStart: "14:00",
              endTime: "15:30",
              status: "completed",
            },
          ],
        },
        {
          id: "loc-026",
          name: "Performance Lab",
          sessionCount: 3,
          locationSessionId: "WEBR-1100",
          passcode: "313233",
          sessions: [
            {
              id: "ses-100",
              title: "Web Performance Metrics",
              presenters: ["Tyler Jackson"],
              scheduledDate: "2025-11-17",
              scheduledStart: "09:30",
              endTime: "11:00",
              status: "completed",
            },
            {
              id: "ses-101",
              title: "Optimizing Core Web Vitals",
              presenters: ["Grace Liu"],
              scheduledDate: "2025-11-17",
              scheduledStart: "11:30",
              endTime: "13:00",
              status: "completed",
            },
            {
              id: "ses-102",
              title: "Progressive Web Apps",
              presenters: ["Carlos Mendez"],
              scheduledDate: "2025-11-17",
              scheduledStart: "14:00",
              endTime: "15:30",
              status: "completed",
            },
          ],
        },
      ],
    },
  ]);

  const filteredEvents = useMemo(() => {
    if (statusFilter === "all") return events;
    return events.filter(
      (event) => getEventStatus(event.startDate, event.endDate) === statusFilter
    );
  }, [events, statusFilter]);

  const groupedEvents = useMemo(() => {
    return {
      active: events.filter(
        (e) => getEventStatus(e.startDate, e.endDate) === "active"
      ),
      upcoming: events.filter(
        (e) => getEventStatus(e.startDate, e.endDate) === "upcoming"
      ),
      past: events.filter(
        (e) => getEventStatus(e.startDate, e.endDate) === "past"
      ),
      all: events,
    };
  }, [events]);

  const statusCounts = {
    active: groupedEvents.active.length,
    upcoming: groupedEvents.upcoming.length,
    past: groupedEvents.past.length,
    all: events.length,
  };

  const handleAddEvent = () => {
    // Open the event creation modal directly
    setIsManualWizardOpen(true);
  };

  const handleManualEventComplete = async (data: {
    eventDetails: EventDetailsFormData;
  }) => {
    // Create a new event ID
    const newEventId = `evt-${Date.now()}`;

    // Parse dates from the form data
    const startDate = new Date(data.eventDetails.startDate);
    const endDate = new Date(data.eventDetails.endDate);

    // Create the new event object
    const newEvent: Event = {
      id: newEventId,
      name: data.eventDetails.name,
      dateRange: formatDateRange(startDate, endDate),
      startDate,
      endDate,
      locationCount: 0,
      sessionCount: 0,
      description: data.eventDetails.description || "",
      locations: [],
    };

    // Add the new event to the list
    setEvents((prev) => [newEvent, ...prev]);

    // Save to localStorage for persistence across pages
    saveEvent(serializeEvent(newEvent));

    setIsManualWizardOpen(false);

    toast.success(`Event "${data.eventDetails.name}" created`);

    // Navigate to the new event detail page where user can add locations/sessions
    router.push(`/events/${newEventId}`);
  };

  const EventCard = ({ event }: { event: Event }) => {
    const eventStatus = getEventStatus(event.startDate, event.endDate);

    return (
      <Card
        className="overflow-hidden hover:border-primary-teal-300 hover:shadow-lg transition-all cursor-pointer shadow-sm border-2"
        onClick={() => router.push(`/events/${event.id}`)}
      >
        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">{event.name}</h2>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm mb-3">
            <Calendar className="h-4 w-4 text-primary-teal-600" />
            <span className="text-gray-700 font-medium">{event.dateRange}</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600">
              {event.locationCount} locations
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600">
              {event.sessionCount} presentations
            </span>
          </div>

          <p className="text-sm text-gray-700 mb-3">{event.description}</p>

          {event.publicSummaryUrl && (
            <a
              href={event.publicSummaryUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 text-sm text-primary-teal-600 hover:text-primary-teal-700 font-medium"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Public Summaries Page</span>
            </a>
          )}
        </div>
      </Card>
    );
  };

  return (
    <div className="h-full overflow-y-auto bg-white">
      {/* Page header */}
      <div className="border-b">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Events</h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage and organize your events, locations, and presentations
              </p>
            </div>
            <Button
              onClick={handleAddEvent}
              className="bg-primary-teal-600 hover:bg-primary-teal-700 text-white shadow-sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </div>

          {/* Tab navigation */}
          <Tabs
            value={statusFilter}
            onValueChange={(value: any) => setStatusFilter(value)}
          >
            <TabsList>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {statusFilter === "all" && groupedEvents.active.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b-2 border-accent-green-500">
              <span className="w-2 h-2 rounded-full bg-accent-green-500 animate-pulse" />
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Active Now ({groupedEvents.active.length})
              </h3>
            </div>
            <div className="space-y-4">
              {groupedEvents.active.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        )}

        {statusFilter === "all" && groupedEvents.upcoming.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b-2 border-primary-teal-500">
              <span className="w-2 h-2 rounded-full bg-primary-teal-500" />
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Upcoming ({groupedEvents.upcoming.length})
              </h3>
            </div>
            <div className="space-y-4">
              {groupedEvents.upcoming.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        )}

        {statusFilter === "all" && groupedEvents.past.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b-2 border-gray-400">
              <span className="w-2 h-2 rounded-full bg-gray-400" />
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Past ({groupedEvents.past.length})
              </h3>
            </div>
            <div className="space-y-4">
              {groupedEvents.past.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        )}

        {statusFilter !== "all" && filteredEvents.length > 0 && (
          <div className="space-y-4">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}

        {filteredEvents.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-gray-600 text-lg">
              {statusFilter === "active" && "No active events"}
              {statusFilter === "upcoming" && "No upcoming events"}
              {statusFilter === "past" && "No past events"}
              {statusFilter === "all" && "No events found"}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Click "Add Event" to create your first event
            </p>
          </Card>
        )}
      </div>

      {/* Event Creation Modal */}
      <ManualEventWizard
        open={isManualWizardOpen}
        onOpenChange={setIsManualWizardOpen}
        onComplete={handleManualEventComplete}
      />
    </div>
  );
}
