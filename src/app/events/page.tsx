"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Play,
  QrCode,
  Plus,
  Clock,
  MapPin,
  User,
  Edit,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { WaysToJoinModal } from "@/components/WaysToJoinModal";
import { Input } from "@/components/ui/input";
import { UploadScheduleModal } from "@/components/events/UploadScheduleModal";
import { EventSettingsModal } from "@/components/events/EventSettingsModal";

// Data interfaces
interface Session {
  id: string;
  title: string;
  presenter: string;
  scheduledStart: string;
  endTime: string;
  status: "pending" | "active" | "completed" | "skipped";
}

interface Room {
  id: string;
  name: string;
  sessionCount: number;
  roomSessionId: string;
  sessions: Session[];
}

type EventStatus = "active" | "upcoming" | "past";

interface Event {
  id: string;
  name: string;
  dateRange: string;
  startDate: Date;
  endDate: Date;
  roomCount: number;
  sessionCount: number;
  description: string;
  publicSummaryUrl?: string;
  rooms: Room[];
}

// Helper function to calculate event status
function getEventStatus(startDate: Date, endDate: Date): EventStatus {
  const now = new Date();
  if (now >= startDate && now <= endDate) {
    return "active";
  } else if (now < startDate) {
    return "upcoming";
  } else {
    return "past";
  }
}

// Helper function to get relative time string
function getRelativeTimeString(startDate: Date, endDate: Date): string {
  const now = new Date();
  const status = getEventStatus(startDate, endDate);

  if (status === "active") {
    return "Live now";
  }

  const diffTime = Math.abs(startDate.getTime() - now.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (status === "upcoming") {
    if (diffDays === 0) return "Starting today";
    if (diffDays === 1) return "Starting tomorrow";
    return `Starting in ${diffDays} days`;
  }

  // Past
  if (diffDays === 0) return "Ended today";
  if (diffDays === 1) return "Ended yesterday";
  return `Ended ${diffDays} days ago`;
}

// Helper to get date relative to today
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

// Mock data with active, upcoming, and past events
const mockEvents: Event[] = [
  // ACTIVE EVENT (happening now)
  {
    id: "evt-001",
    name: "AI & Machine Learning Summit 2024",
    dateRange: formatDateRange(getRelativeDate(0), getRelativeDate(1)),
    startDate: getRelativeDate(0),
    endDate: getRelativeDate(1),
    roomCount: 3,
    sessionCount: 10,
    description:
      "Live conference on the latest advances in AI, machine learning, and deep learning technologies",
    publicSummaryUrl: "/public/ai-ml-summit-2024",
    rooms: [
      {
        id: "room-001",
        name: "Main Auditorium",
        sessionCount: 5,
        roomSessionId: "MAIN-AUD-2024",
        sessions: [
          {
            id: "ses-001",
            title: "The Future of AI in Enterprise",
            presenter: "Dr. Sarah Chen",
            scheduledStart: "09:00",
            endTime: "10:30",
            status: "pending",
          },
          {
            id: "ses-002",
            title: "Scalable Cloud Architecture Patterns",
            presenter: "Mike Rodriguez",
            scheduledStart: "11:00",
            endTime: "12:00",
            status: "pending",
          },
          {
            id: "ses-003",
            title: "Cybersecurity Trends and Threats",
            presenter: "Alex Thompson",
            scheduledStart: "13:30",
            endTime: "14:30",
            status: "pending",
          },
          {
            id: "ses-004",
            title: "Building a DevOps Culture",
            presenter: "Jennifer Wu",
            scheduledStart: "15:00",
            endTime: "16:00",
            status: "pending",
          },
          {
            id: "ses-005",
            title: "Machine Learning in Production",
            presenter: "Robert Kim",
            scheduledStart: "16:30",
            endTime: "17:30",
            status: "pending",
          },
        ],
      },
      {
        id: "room-002",
        name: "Workshop Room A",
        sessionCount: 3,
        roomSessionId: "WORKSHOP-A-2024",
        sessions: [
          {
            id: "ses-006",
            title: "Hands-on Kubernetes Workshop",
            presenter: "Lisa Park",
            scheduledStart: "09:00",
            endTime: "11:00",
            status: "pending",
          },
          {
            id: "ses-007",
            title: "Advanced React Patterns",
            presenter: "David Martinez",
            scheduledStart: "11:30",
            endTime: "13:00",
            status: "pending",
          },
          {
            id: "ses-008",
            title: "Microservices Architecture",
            presenter: "Emily Zhang",
            scheduledStart: "14:00",
            endTime: "15:30",
            status: "pending",
          },
        ],
      },
      {
        id: "room-003",
        name: "Breakout Room B",
        sessionCount: 2,
        roomSessionId: "BREAKOUT-B-2024",
        sessions: [
          {
            id: "ses-009",
            title: "API Design Best Practices",
            presenter: "Tom Anderson",
            scheduledStart: "10:00",
            endTime: "11:30",
            status: "pending",
          },
          {
            id: "ses-010",
            title: "Performance Optimization Techniques",
            presenter: "Rachel Green",
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
    roomCount: 4,
    sessionCount: 18,
    description:
      "Two-day summit focused on cloud architecture, Kubernetes, and modern DevOps practices",
    publicSummaryUrl: "/public/cloud-devops-summit-2024",
    rooms: [
      {
        id: "room-004",
        name: "Cloud Theater",
        sessionCount: 5,
        roomSessionId: "CLOUD-THEATER-2024",
        sessions: [
          {
            id: "ses-011",
            title: "Kubernetes at Scale",
            presenter: "Maya Patel",
            scheduledStart: "09:00",
            endTime: "10:30",
            status: "pending",
          },
          {
            id: "ses-012",
            title: "Multi-Cloud Strategies",
            presenter: "James Wilson",
            scheduledStart: "11:00",
            endTime: "12:30",
            status: "pending",
          },
          {
            id: "ses-013",
            title: "Serverless Architecture Patterns",
            presenter: "Sofia Garcia",
            scheduledStart: "13:30",
            endTime: "15:00",
            status: "pending",
          },
          {
            id: "ses-014",
            title: "Infrastructure as Code Best Practices",
            presenter: "Chen Wei",
            scheduledStart: "15:30",
            endTime: "17:00",
            status: "pending",
          },
          {
            id: "ses-015",
            title: "Cloud Cost Optimization",
            presenter: "Amanda Lee",
            scheduledStart: "17:30",
            endTime: "18:30",
            status: "pending",
          },
        ],
      },
      {
        id: "room-005",
        name: "DevOps Workshop",
        sessionCount: 6,
        roomSessionId: "DEVOPS-WORKSHOP-2024",
        sessions: [
          {
            id: "ses-016",
            title: "CI/CD Pipeline Automation",
            presenter: "Marcus Johnson",
            scheduledStart: "09:00",
            endTime: "10:30",
            status: "pending",
          },
          {
            id: "ses-017",
            title: "GitOps with ArgoCD",
            presenter: "Yuki Tanaka",
            scheduledStart: "11:00",
            endTime: "12:30",
            status: "pending",
          },
          {
            id: "ses-018",
            title: "Observability & Monitoring",
            presenter: "Carlos Rivera",
            scheduledStart: "13:30",
            endTime: "15:00",
            status: "pending",
          },
          {
            id: "ses-019",
            title: "Security in DevOps",
            presenter: "Priya Sharma",
            scheduledStart: "15:30",
            endTime: "17:00",
            status: "pending",
          },
          {
            id: "ses-020",
            title: "Platform Engineering",
            presenter: "Oliver Brown",
            scheduledStart: "17:30",
            endTime: "18:30",
            status: "pending",
          },
          {
            id: "ses-021",
            title: "Developer Experience Tools",
            presenter: "Emma Davis",
            scheduledStart: "19:00",
            endTime: "20:00",
            status: "pending",
          },
        ],
      },
      {
        id: "room-006",
        name: "Container Lab",
        sessionCount: 4,
        roomSessionId: "CONTAINER-LAB-2024",
        sessions: [
          {
            id: "ses-022",
            title: "Docker Deep Dive",
            presenter: "Hassan Ali",
            scheduledStart: "10:00",
            endTime: "11:30",
            status: "pending",
          },
          {
            id: "ses-023",
            title: "Service Mesh Patterns",
            presenter: "Nina Kowalski",
            scheduledStart: "12:00",
            endTime: "13:30",
            status: "pending",
          },
          {
            id: "ses-024",
            title: "Container Security",
            presenter: "Ahmed Hassan",
            scheduledStart: "14:00",
            endTime: "15:30",
            status: "pending",
          },
          {
            id: "ses-025",
            title: "Microservices Best Practices",
            presenter: "Laura Martinez",
            scheduledStart: "16:00",
            endTime: "17:30",
            status: "pending",
          },
        ],
      },
      {
        id: "room-007",
        name: "Automation Studio",
        sessionCount: 3,
        roomSessionId: "AUTOMATION-STUDIO-2024",
        sessions: [
          {
            id: "ses-026",
            title: "Terraform at Enterprise Scale",
            presenter: "Kevin O'Brien",
            scheduledStart: "09:30",
            endTime: "11:00",
            status: "pending",
          },
          {
            id: "ses-027",
            title: "Ansible for Cloud Automation",
            presenter: "Isabella Romano",
            scheduledStart: "11:30",
            endTime: "13:00",
            status: "pending",
          },
          {
            id: "ses-028",
            title: "Policy as Code",
            presenter: "Daniel Kim",
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
    roomCount: 2,
    sessionCount: 8,
    description:
      "Explore the latest in design systems, UX research, and product design methodologies",
    publicSummaryUrl: "/public/design-ux-conf-2024",
    rooms: [
      {
        id: "room-008",
        name: "Design Theater",
        sessionCount: 5,
        roomSessionId: "DESIGN-THEATER-2024",
        sessions: [
          {
            id: "ses-029",
            title: "Building Scalable Design Systems",
            presenter: "Emma Thompson",
            scheduledStart: "09:00",
            endTime: "10:30",
            status: "pending",
          },
          {
            id: "ses-030",
            title: "Design Tokens in Practice",
            presenter: "Lucas Chen",
            scheduledStart: "11:00",
            endTime: "12:30",
            status: "pending",
          },
          {
            id: "ses-031",
            title: "Accessibility-First Design",
            presenter: "Aisha Ndiaye",
            scheduledStart: "13:30",
            endTime: "15:00",
            status: "pending",
          },
          {
            id: "ses-032",
            title: "Component API Design",
            presenter: "Ryan Mitchell",
            scheduledStart: "15:30",
            endTime: "17:00",
            status: "pending",
          },
          {
            id: "ses-033",
            title: "Design System Governance",
            presenter: "Sophia Berg",
            scheduledStart: "17:30",
            endTime: "18:30",
            status: "pending",
          },
        ],
      },
      {
        id: "room-009",
        name: "UX Research Lab",
        sessionCount: 3,
        roomSessionId: "UX-LAB-2024",
        sessions: [
          {
            id: "ses-034",
            title: "User Research at Scale",
            presenter: "Maria Santos",
            scheduledStart: "10:00",
            endTime: "11:30",
            status: "pending",
          },
          {
            id: "ses-035",
            title: "Rapid Prototyping Techniques",
            presenter: "Jacob Miller",
            scheduledStart: "12:00",
            endTime: "13:30",
            status: "pending",
          },
          {
            id: "ses-036",
            title: "Data-Driven Design Decisions",
            presenter: "Olivia Wang",
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
    roomCount: 2,
    sessionCount: 10,
    description:
      "Comprehensive summit on blockchain technology, smart contracts, and decentralized applications",
    publicSummaryUrl: "/public/web3-blockchain-2024",
    rooms: [
      {
        id: "room-010",
        name: "Blockchain Hall",
        sessionCount: 6,
        roomSessionId: "BLOCKCHAIN-HALL-2024",
        sessions: [
          {
            id: "ses-037",
            title: "Smart Contract Security",
            presenter: "Alex Turner",
            scheduledStart: "09:00",
            endTime: "10:30",
            status: "pending",
          },
          {
            id: "ses-038",
            title: "DeFi Architecture Patterns",
            presenter: "Raj Kapoor",
            scheduledStart: "11:00",
            endTime: "12:30",
            status: "pending",
          },
          {
            id: "ses-039",
            title: "NFT Marketplace Development",
            presenter: "Sophie Laurent",
            scheduledStart: "13:30",
            endTime: "15:00",
            status: "pending",
          },
          {
            id: "ses-040",
            title: "Layer 2 Scaling Solutions",
            presenter: "Mohammed Farah",
            scheduledStart: "15:30",
            endTime: "17:00",
            status: "pending",
          },
          {
            id: "ses-041",
            title: "Blockchain Interoperability",
            presenter: "Anna Kowalczyk",
            scheduledStart: "17:30",
            endTime: "18:30",
            status: "pending",
          },
          {
            id: "ses-042",
            title: "Web3 Gaming",
            presenter: "Tyler Jackson",
            scheduledStart: "19:00",
            endTime: "20:00",
            status: "pending",
          },
        ],
      },
      {
        id: "room-011",
        name: "DApp Workshop",
        sessionCount: 4,
        roomSessionId: "DAPP-WORKSHOP-2024",
        sessions: [
          {
            id: "ses-043",
            title: "Building with Ethereum",
            presenter: "Yuki Nakamura",
            scheduledStart: "10:00",
            endTime: "11:30",
            status: "pending",
          },
          {
            id: "ses-044",
            title: "Solidity Best Practices",
            presenter: "Carlos Mendez",
            scheduledStart: "12:00",
            endTime: "13:30",
            status: "pending",
          },
          {
            id: "ses-045",
            title: "Web3 Frontend Integration",
            presenter: "Lisa Anderson",
            scheduledStart: "14:00",
            endTime: "15:30",
            status: "pending",
          },
          {
            id: "ses-046",
            title: "DAO Governance Models",
            presenter: "Ibrahim Youssef",
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
    roomCount: 3,
    sessionCount: 12,
    description:
      "Advanced forum on data science, machine learning operations, and business analytics",
    publicSummaryUrl: "/public/data-science-forum-2024",
    rooms: [
      {
        id: "room-012",
        name: "Data Theater",
        sessionCount: 5,
        roomSessionId: "DATA-THEATER-2024",
        sessions: [
          {
            id: "ses-047",
            title: "MLOps Best Practices",
            presenter: "Grace Liu",
            scheduledStart: "09:00",
            endTime: "10:30",
            status: "pending",
          },
          {
            id: "ses-048",
            title: "Feature Engineering at Scale",
            presenter: "Marcus Williams",
            scheduledStart: "11:00",
            endTime: "12:30",
            status: "pending",
          },
          {
            id: "ses-049",
            title: "Model Monitoring & Drift Detection",
            presenter: "Elena Popov",
            scheduledStart: "13:30",
            endTime: "15:00",
            status: "pending",
          },
          {
            id: "ses-050",
            title: "Real-Time Analytics Pipelines",
            presenter: "Hassan Ibrahim",
            scheduledStart: "15:30",
            endTime: "17:00",
            status: "pending",
          },
          {
            id: "ses-051",
            title: "Ethical AI & Bias Mitigation",
            presenter: "Amara Jones",
            scheduledStart: "17:30",
            endTime: "18:30",
            status: "pending",
          },
        ],
      },
      {
        id: "room-013",
        name: "Analytics Lab",
        sessionCount: 4,
        roomSessionId: "ANALYTICS-LAB-2024",
        sessions: [
          {
            id: "ses-052",
            title: "Modern Data Stack",
            presenter: "Kevin Park",
            scheduledStart: "10:00",
            endTime: "11:30",
            status: "pending",
          },
          {
            id: "ses-053",
            title: "Data Visualization Best Practices",
            presenter: "Natalie Schmidt",
            scheduledStart: "12:00",
            endTime: "13:30",
            status: "pending",
          },
          {
            id: "ses-054",
            title: "Business Intelligence Strategies",
            presenter: "Raj Patel",
            scheduledStart: "14:00",
            endTime: "15:30",
            status: "pending",
          },
          {
            id: "ses-055",
            title: "Data Governance & Quality",
            presenter: "Sarah Cohen",
            scheduledStart: "16:00",
            endTime: "17:30",
            status: "pending",
          },
        ],
      },
      {
        id: "room-014",
        name: "ML Workshop",
        sessionCount: 3,
        roomSessionId: "ML-WORKSHOP-2024",
        sessions: [
          {
            id: "ses-056",
            title: "Deep Learning Architectures",
            presenter: "Zhang Wei",
            scheduledStart: "09:30",
            endTime: "11:00",
            status: "pending",
          },
          {
            id: "ses-057",
            title: "Natural Language Processing",
            presenter: "Isabella Costa",
            scheduledStart: "11:30",
            endTime: "13:00",
            status: "pending",
          },
          {
            id: "ses-058",
            title: "Computer Vision Applications",
            presenter: "Omar Farooq",
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
    roomCount: 2,
    sessionCount: 6,
    description:
      "Annual spring technology conference featuring software development trends and innovations",
    publicSummaryUrl: "/public/tech-conf-spring-2024",
    rooms: [
      {
        id: "room-015",
        name: "Main Stage",
        sessionCount: 4,
        roomSessionId: "MAIN-STAGE-SEPT-2024",
        sessions: [
          {
            id: "ses-059",
            title: "State of Software Development 2024",
            presenter: "John Peterson",
            scheduledStart: "09:00",
            endTime: "10:30",
            status: "completed",
          },
          {
            id: "ses-060",
            title: "Modern JavaScript Frameworks",
            presenter: "Anna Kowalski",
            scheduledStart: "11:00",
            endTime: "12:30",
            status: "completed",
          },
          {
            id: "ses-061",
            title: "API Design Principles",
            presenter: "Miguel Torres",
            scheduledStart: "13:30",
            endTime: "15:00",
            status: "completed",
          },
          {
            id: "ses-062",
            title: "Testing Strategies",
            presenter: "Rachel Green",
            scheduledStart: "15:30",
            endTime: "17:00",
            status: "completed",
          },
        ],
      },
      {
        id: "room-016",
        name: "Workshop Room",
        sessionCount: 2,
        roomSessionId: "WORKSHOP-SEPT-2024",
        sessions: [
          {
            id: "ses-063",
            title: "GraphQL Workshop",
            presenter: "David Chen",
            scheduledStart: "10:00",
            endTime: "12:00",
            status: "completed",
          },
          {
            id: "ses-064",
            title: "Performance Optimization",
            presenter: "Emma Wilson",
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
    roomCount: 3,
    sessionCount: 12,
    description:
      "Summit focused on iOS, Android, and cross-platform mobile development",
    publicSummaryUrl: "/public/mobile-dev-summit-2024",
    rooms: [
      {
        id: "room-017",
        name: "iOS Hall",
        sessionCount: 4,
        roomSessionId: "IOS-HALL-AUG-2024",
        sessions: [
          {
            id: "ses-065",
            title: "SwiftUI Advanced Patterns",
            presenter: "Sarah Johnson",
            scheduledStart: "09:00",
            endTime: "10:30",
            status: "completed",
          },
          {
            id: "ses-066",
            title: "iOS App Architecture",
            presenter: "Michael Chen",
            scheduledStart: "11:00",
            endTime: "12:30",
            status: "completed",
          },
          {
            id: "ses-067",
            title: "Core Data Best Practices",
            presenter: "Elena Rodriguez",
            scheduledStart: "13:30",
            endTime: "15:00",
            status: "completed",
          },
          {
            id: "ses-068",
            title: "App Store Optimization",
            presenter: "James Taylor",
            scheduledStart: "15:30",
            endTime: "17:00",
            status: "completed",
          },
        ],
      },
      {
        id: "room-018",
        name: "Android Studio",
        sessionCount: 5,
        roomSessionId: "ANDROID-STUDIO-AUG-2024",
        sessions: [
          {
            id: "ses-069",
            title: "Jetpack Compose",
            presenter: "Priya Sharma",
            scheduledStart: "09:00",
            endTime: "10:30",
            status: "completed",
          },
          {
            id: "ses-070",
            title: "Kotlin Coroutines",
            presenter: "David Kim",
            scheduledStart: "11:00",
            endTime: "12:30",
            status: "completed",
          },
          {
            id: "ses-071",
            title: "Material Design 3",
            presenter: "Lisa Wang",
            scheduledStart: "13:30",
            endTime: "15:00",
            status: "completed",
          },
          {
            id: "ses-072",
            title: "Android Testing Strategies",
            presenter: "Omar Hassan",
            scheduledStart: "15:30",
            endTime: "17:00",
            status: "completed",
          },
          {
            id: "ses-073",
            title: "Performance Optimization",
            presenter: "Anna Kowalski",
            scheduledStart: "17:30",
            endTime: "18:30",
            status: "completed",
          },
        ],
      },
      {
        id: "room-019",
        name: "Cross-Platform Lab",
        sessionCount: 3,
        roomSessionId: "XPLAT-LAB-AUG-2024",
        sessions: [
          {
            id: "ses-074",
            title: "React Native Advanced",
            presenter: "Carlos Rivera",
            scheduledStart: "10:00",
            endTime: "11:30",
            status: "completed",
          },
          {
            id: "ses-075",
            title: "Flutter Development",
            presenter: "Yuki Tanaka",
            scheduledStart: "12:00",
            endTime: "13:30",
            status: "completed",
          },
          {
            id: "ses-076",
            title: "Mobile CI/CD",
            presenter: "Marcus Brown",
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
    roomCount: 2,
    sessionCount: 8,
    description:
      "Annual conference on cybersecurity, threat detection, and enterprise security",
    publicSummaryUrl: "/public/cybersecurity-2024",
    rooms: [
      {
        id: "room-020",
        name: "Security Theater",
        sessionCount: 5,
        roomSessionId: "SEC-THEATER-JUL-2024",
        sessions: [
          {
            id: "ses-077",
            title: "Zero Trust Architecture",
            presenter: "Robert Fischer",
            scheduledStart: "09:00",
            endTime: "10:30",
            status: "completed",
          },
          {
            id: "ses-078",
            title: "Cloud Security Best Practices",
            presenter: "Mei Lin",
            scheduledStart: "11:00",
            endTime: "12:30",
            status: "completed",
          },
          {
            id: "ses-079",
            title: "Threat Intelligence",
            presenter: "Ahmed Ali",
            scheduledStart: "13:30",
            endTime: "15:00",
            status: "completed",
          },
          {
            id: "ses-080",
            title: "Incident Response",
            presenter: "Julia Martinez",
            scheduledStart: "15:30",
            endTime: "17:00",
            status: "completed",
          },
          {
            id: "ses-081",
            title: "Security Automation",
            presenter: "Kevin O'Neill",
            scheduledStart: "17:30",
            endTime: "18:30",
            status: "completed",
          },
        ],
      },
      {
        id: "room-021",
        name: "Penetration Testing Lab",
        sessionCount: 3,
        roomSessionId: "PENTEST-LAB-JUL-2024",
        sessions: [
          {
            id: "ses-082",
            title: "Ethical Hacking Techniques",
            presenter: "Nathan Wright",
            scheduledStart: "10:00",
            endTime: "11:30",
            status: "completed",
          },
          {
            id: "ses-083",
            title: "Web Application Security",
            presenter: "Sophia Berg",
            scheduledStart: "12:00",
            endTime: "13:30",
            status: "completed",
          },
          {
            id: "ses-084",
            title: "Network Security",
            presenter: "Daniel Park",
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
    roomCount: 2,
    sessionCount: 7,
    description:
      "Summit for product managers on strategy, roadmapping, and product-led growth",
    publicSummaryUrl: "/public/pm-summit-2024",
    rooms: [
      {
        id: "room-022",
        name: "Product Theater",
        sessionCount: 4,
        roomSessionId: "PRODUCT-THEATER-JUN-2024",
        sessions: [
          {
            id: "ses-085",
            title: "Product Strategy Frameworks",
            presenter: "Rachel Green",
            scheduledStart: "09:00",
            endTime: "10:30",
            status: "completed",
          },
          {
            id: "ses-086",
            title: "User Story Mapping",
            presenter: "Tom Anderson",
            scheduledStart: "11:00",
            endTime: "12:30",
            status: "completed",
          },
          {
            id: "ses-087",
            title: "Product Analytics",
            presenter: "Emma Davis",
            scheduledStart: "13:30",
            endTime: "15:00",
            status: "completed",
          },
          {
            id: "ses-088",
            title: "Pricing Strategies",
            presenter: "Oliver Smith",
            scheduledStart: "15:30",
            endTime: "17:00",
            status: "completed",
          },
        ],
      },
      {
        id: "room-023",
        name: "Strategy Workshop",
        sessionCount: 3,
        roomSessionId: "STRATEGY-WORKSHOP-JUN-2024",
        sessions: [
          {
            id: "ses-089",
            title: "OKRs for Product Teams",
            presenter: "Nina Patel",
            scheduledStart: "10:00",
            endTime: "11:30",
            status: "completed",
          },
          {
            id: "ses-090",
            title: "Roadmap Planning",
            presenter: "Lucas Chen",
            scheduledStart: "12:00",
            endTime: "13:30",
            status: "completed",
          },
          {
            id: "ses-091",
            title: "Stakeholder Management",
            presenter: "Isabella Romano",
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
    roomCount: 3,
    sessionCount: 11,
    description:
      "Conference dedicated to modern frontend development, frameworks, and tooling",
    publicSummaryUrl: "/public/frontend-conf-2024",
    rooms: [
      {
        id: "room-024",
        name: "JavaScript Hall",
        sessionCount: 5,
        roomSessionId: "JS-HALL-MAY-2024",
        sessions: [
          {
            id: "ses-092",
            title: "React Server Components",
            presenter: "Alex Turner",
            scheduledStart: "09:00",
            endTime: "10:30",
            status: "completed",
          },
          {
            id: "ses-093",
            title: "Vue 3 Composition API",
            presenter: "Sophie Laurent",
            scheduledStart: "11:00",
            endTime: "12:30",
            status: "completed",
          },
          {
            id: "ses-094",
            title: "Svelte & SvelteKit",
            presenter: "Hassan Ibrahim",
            scheduledStart: "13:30",
            endTime: "15:00",
            status: "completed",
          },
          {
            id: "ses-095",
            title: "TypeScript Advanced Types",
            presenter: "Maria Santos",
            scheduledStart: "15:30",
            endTime: "17:00",
            status: "completed",
          },
          {
            id: "ses-096",
            title: "Build Tools & Vite",
            presenter: "Ryan Mitchell",
            scheduledStart: "17:30",
            endTime: "18:30",
            status: "completed",
          },
        ],
      },
      {
        id: "room-025",
        name: "CSS & Design Workshop",
        sessionCount: 3,
        roomSessionId: "CSS-WORKSHOP-MAY-2024",
        sessions: [
          {
            id: "ses-097",
            title: "Modern CSS Layouts",
            presenter: "Olivia Wang",
            scheduledStart: "10:00",
            endTime: "11:30",
            status: "completed",
          },
          {
            id: "ses-098",
            title: "Tailwind CSS Best Practices",
            presenter: "Jacob Miller",
            scheduledStart: "12:00",
            endTime: "13:30",
            status: "completed",
          },
          {
            id: "ses-099",
            title: "CSS Animation Performance",
            presenter: "Aisha Ndiaye",
            scheduledStart: "14:00",
            endTime: "15:30",
            status: "completed",
          },
        ],
      },
      {
        id: "room-026",
        name: "Performance Lab",
        sessionCount: 3,
        roomSessionId: "PERF-LAB-MAY-2024",
        sessions: [
          {
            id: "ses-100",
            title: "Web Performance Metrics",
            presenter: "Tyler Jackson",
            scheduledStart: "09:30",
            endTime: "11:00",
            status: "completed",
          },
          {
            id: "ses-101",
            title: "Optimizing Core Web Vitals",
            presenter: "Grace Liu",
            scheduledStart: "11:30",
            endTime: "13:00",
            status: "completed",
          },
          {
            id: "ses-102",
            title: "Progressive Web Apps",
            presenter: "Carlos Mendez",
            scheduledStart: "14:00",
            endTime: "15:30",
            status: "completed",
          },
        ],
      },
    ],
  },
];

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<EventStatus | "all">("all");
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(
    new Set() // Start with all collapsed for better overview
  );
  const [expandedRooms, setExpandedRooms] = useState<Set<string>>(new Set());
  const [waysToJoinModal, setWaysToJoinModal] = useState<{
    isOpen: boolean;
    room?: Room;
    eventName?: string;
  }>({
    isOpen: false,
  });
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [uploadedFileData, setUploadedFileData] = useState<{
    file: File;
    timezone: string;
  } | null>(null);

  // Filter and search events
  const filteredEvents = useMemo(() => {
    let filtered = mockEvents;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((event) => {
        // Search in event name and description
        if (
          event.name.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query)
        ) {
          return true;
        }

        // Search in room names
        if (
          event.rooms.some((room) => room.name.toLowerCase().includes(query))
        ) {
          return true;
        }

        // Search in session titles and presenters
        return event.rooms.some((room) =>
          room.sessions.some(
            (session) =>
              session.title.toLowerCase().includes(query) ||
              session.presenter.toLowerCase().includes(query)
          )
        );
      });
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (event) =>
          getEventStatus(event.startDate, event.endDate) === statusFilter
      );
    }

    return filtered;
  }, [searchQuery, statusFilter]);

  // Group events by status
  const groupedEvents = useMemo(() => {
    const groups: Record<EventStatus, Event[]> = {
      active: [],
      upcoming: [],
      past: [],
    };

    filteredEvents.forEach((event) => {
      const status = getEventStatus(event.startDate, event.endDate);
      groups[status].push(event);
    });

    // Sort within each group
    groups.active.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
    groups.upcoming.sort(
      (a, b) => a.startDate.getTime() - b.startDate.getTime()
    );
    groups.past.sort((a, b) => b.endDate.getTime() - a.endDate.getTime());

    return groups;
  }, [filteredEvents]);

  // Calculate counts for each status
  const statusCounts = useMemo(() => {
    return {
      active: mockEvents.filter(
        (e) => getEventStatus(e.startDate, e.endDate) === "active"
      ).length,
      upcoming: mockEvents.filter(
        (e) => getEventStatus(e.startDate, e.endDate) === "upcoming"
      ).length,
      past: mockEvents.filter(
        (e) => getEventStatus(e.startDate, e.endDate) === "past"
      ).length,
      all: mockEvents.length,
    };
  }, []);

  // Auto-expand events and rooms when searching to show context
  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const eventsToExpand = new Set<string>();
      const roomsToExpand = new Set<string>();

      filteredEvents.forEach((event) => {
        // Check if search matches rooms or sessions (not just event name/description)
        const matchesRoomOrSession = event.rooms.some(
          (room) =>
            room.name.toLowerCase().includes(query) ||
            room.sessions.some(
              (session) =>
                session.title.toLowerCase().includes(query) ||
                session.presenter.toLowerCase().includes(query)
            )
        );

        if (matchesRoomOrSession) {
          eventsToExpand.add(event.id);
          // Also expand matching rooms
          event.rooms.forEach((room) => {
            if (
              room.name.toLowerCase().includes(query) ||
              room.sessions.some(
                (session) =>
                  session.title.toLowerCase().includes(query) ||
                  session.presenter.toLowerCase().includes(query)
              )
            ) {
              roomsToExpand.add(room.id);
            }
          });
        }
      });

      setExpandedEvents(eventsToExpand);
      setExpandedRooms(roomsToExpand);
    }
  }, [searchQuery, filteredEvents]);

  const toggleEventExpansion = (eventId: string) => {
    const newExpanded = new Set(expandedEvents);
    if (newExpanded.has(eventId)) {
      newExpanded.delete(eventId);
    } else {
      newExpanded.add(eventId);
    }
    setExpandedEvents(newExpanded);
  };

  const toggleRoomExpansion = (roomId: string) => {
    const newExpanded = new Set(expandedRooms);
    if (newExpanded.has(roomId)) {
      newExpanded.delete(roomId);
    } else {
      newExpanded.add(roomId);
    }
    setExpandedRooms(newExpanded);
  };

  const handleWaysToJoin = (
    room: Room,
    eventName: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setWaysToJoinModal({
      isOpen: true,
      room,
      eventName,
    });
  };

  const handleStartRoom = (room: Room, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Starting room:", room.name);
    // TODO: Start the room session chain
  };

  const handleEditSession = (session: Session, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Edit session:", session.id);
    // TODO: Open session edit modal
  };

  const handleAddEvent = () => {
    setIsUploadModalOpen(true);
  };

  const handleUpload = async (file: File, timezone: string) => {
    // Store the file data temporarily
    setUploadedFileData({ file, timezone });

    // Close upload modal and open settings modal
    setIsUploadModalOpen(false);
    setIsSettingsModalOpen(true);
  };

  const handleSaveEventSettings = async (settings: any) => {
    if (!uploadedFileData) return;

    try {
      console.log("Creating event with file:", uploadedFileData.file.name);
      console.log("Timezone:", uploadedFileData.timezone);
      console.log("Settings:", settings);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Here you would:
      // 1. Upload the file to your server
      // 2. Parse the CSV/Excel file with the timezone
      // 3. Create events, rooms, and sessions with the settings
      // 4. Refresh the events list

      console.log("Event created successfully");

      // Reset state
      setUploadedFileData(null);
    } catch (error) {
      console.error("Error creating event:", error);
      throw error;
    }
  };

  // Component for rendering status badge
  const StatusBadge = ({ event }: { event: Event }) => {
    const status = getEventStatus(event.startDate, event.endDate);
    const relativeTime = getRelativeTimeString(event.startDate, event.endDate);

    const badgeStyles = {
      active:
        "bg-accent-green-500/10 text-accent-green-600 border-accent-green-500/20",
      upcoming:
        "bg-primary-teal-500/10 text-primary-teal-600 border-primary-teal-500/20",
      past: "bg-gray-100 text-gray-600 border-gray-200",
    };

    return (
      <div className="flex items-center gap-2">
        <div
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${badgeStyles[status]}`}
        >
          {status === "active" && (
            <span className="w-1.5 h-1.5 rounded-full bg-accent-green-500 animate-pulse" />
          )}
          <span className="capitalize">{status}</span>
        </div>
        <span className="text-xs text-gray-600 font-medium">
          {relativeTime}
        </span>
      </div>
    );
  };

  // Component for rendering an event card
  const EventCard = ({ event }: { event: Event }) => {
    const isExpanded = expandedEvents.has(event.id);

    return (
      <Card className="overflow-hidden">
        {/* Event header - always visible */}
        <div className="p-6">
          {/* Title row with status badge and expand button */}
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {event.name}
              </h2>
              <StatusBadge event={event} />
            </div>
            <button
              onClick={() => toggleEventExpansion(event.id)}
              className="text-gray-400 hover:text-gray-600 transition-colors mt-1 flex-shrink-0"
            >
              {isExpanded ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Compact metadata line */}
          <div className="flex items-center gap-2 text-sm mb-3">
            <Calendar className="h-4 w-4 text-primary-teal-600" />
            <span className="text-gray-700 font-medium">{event.dateRange}</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600">{event.roomCount} rooms</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600">{event.sessionCount} sessions</span>
          </div>

          {/* Inline room badges - only when collapsed */}
          {!isExpanded && (
            <div className="flex items-start gap-2 mb-3">
              <MapPin className="h-4 w-4 text-primary-teal-600 mt-1 flex-shrink-0" />
              <div className="flex flex-wrap gap-2">
                {event.rooms.map((room) => (
                  <button
                    key={room.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleEventExpansion(event.id);
                      // Also expand this room
                      setTimeout(() => {
                        const newExpanded = new Set(expandedRooms);
                        newExpanded.add(room.id);
                        setExpandedRooms(newExpanded);
                      }, 100);
                    }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 rounded-md text-sm transition-all"
                  >
                    <span className="text-gray-700 font-medium">
                      {room.name}
                    </span>
                    <span className="text-gray-500 text-xs font-medium">
                      ({room.sessions.length})
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Description - only when expanded */}
          {isExpanded && (
            <p className="text-sm text-gray-700 mb-3">{event.description}</p>
          )}

          {/* Public summary link - shown in both states */}
          {event.publicSummaryUrl && (
            <a
              href={event.publicSummaryUrl}
              className="inline-flex items-center gap-1.5 text-sm text-primary-teal-600 hover:text-primary-teal-700 font-medium"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Public Summaries Page</span>
            </a>
          )}
        </div>

        {/* Expandable rooms section */}
        {isExpanded && (
          <div className="border-t">
            <div className="p-6 space-y-5">
              {event.rooms.map((room) => {
                const isRoomExpanded = expandedRooms.has(room.id);

                return (
                  <div
                    key={room.id}
                    className="border border-gray-200 rounded-lg overflow-hidden bg-white hover:border-gray-300 transition-all"
                  >
                    {/* Room header - matches Figma design */}
                    <div className="p-6 bg-gray-50/50">
                      <div className="flex items-center justify-between gap-6">
                        {/* Room info */}
                        <div className="flex items-center gap-3">
                          <button
                            className="flex items-center justify-center w-6 h-6 rounded hover:bg-gray-200 transition-colors flex-shrink-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleRoomExpansion(room.id);
                            }}
                          >
                            <ChevronDown
                              className={`h-4 w-4 text-gray-500 transition-transform ${
                                isRoomExpanded ? "rotate-0" : "-rotate-90"
                              }`}
                            />
                          </button>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-base">
                              {room.name}
                            </h3>
                            <p className="text-sm text-gray-600 mt-0.5">
                              {room.sessions.length} sessions
                            </p>
                          </div>
                        </div>

                        {/* Room actions - matching Figma */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) =>
                              handleWaysToJoin(room, event.name, e)
                            }
                            className="border-primary-teal-600 text-primary-teal-600 hover:bg-primary-teal-50 hover:border-primary-teal-700"
                          >
                            <QrCode className="h-4 w-4 mr-2" />
                            Ways to Join this Session
                          </Button>
                          <Button
                            size="sm"
                            onClick={(e) => handleStartRoom(room, e)}
                            className="bg-primary-teal-600 hover:bg-primary-teal-700 text-white shadow-sm"
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Start Room
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Expandable sessions list */}
                    {isRoomExpanded && room.sessions.length > 0 && (
                      <div className="border-t border-gray-200 bg-gray-50/30">
                        {room.sessions.map((session, index) => (
                          <div
                            key={session.id}
                            className={`p-5 bg-white hover:bg-gray-50 transition-colors ${
                              index !== room.sessions.length - 1
                                ? "border-b border-gray-200"
                                : ""
                            }`}
                          >
                            <div className="flex items-start justify-between gap-4">
                              {/* Session info */}
                              <div className="flex-1 space-y-2">
                                <div className="flex items-start justify-between gap-4">
                                  <h4 className="font-bold text-gray-900 text-base leading-snug flex-1">
                                    {session.title}
                                  </h4>
                                  {/* Time badge - non-clickable display */}
                                  <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center px-3 py-1.5 rounded-md border-2 border-primary-teal-600 bg-primary-teal-50 text-primary-teal-700 text-sm font-semibold whitespace-nowrap">
                                      {session.scheduledStart} -{" "}
                                      {session.endTime}
                                    </span>
                                    <button
                                      onClick={(e) =>
                                        handleEditSession(session, e)
                                      }
                                      className="p-2 border border-gray-200 rounded-lg hover:bg-white hover:border-gray-300 transition-colors flex-shrink-0"
                                      title="Edit session"
                                    >
                                      <Edit className="h-4 w-4 text-gray-600" />
                                    </button>
                                  </div>
                                </div>

                                {/* Session metadata - standardized with colored icons */}
                                <div className="flex items-center gap-6 text-sm">
                                  <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-primary-teal-600" />
                                    <span className="text-gray-700 font-medium">
                                      {session.presenter}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-primary-teal-600" />
                                    <span className="text-gray-700 font-medium">
                                      Time: {session.scheduledStart} -{" "}
                                      {session.endTime}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-primary-teal-600" />
                                    <span className="text-gray-700 font-medium">
                                      Room: {room.name}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-primary-teal-600" />
                                    <span className="text-gray-700 font-medium">
                                      Event: {event.name}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Card>
    );
  };

  return (
    <div className="h-full overflow-y-auto">
      {/* Page header */}
      <div className="border-b bg-white px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Events</h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage and organize your events, rooms, and sessions
            </p>
          </div>
          <Button
            onClick={handleAddEvent}
            className="bg-primary-teal-600 hover:bg-primary-teal-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </div>
      </div>

      {/* Search and filter bar - Horizontal layout */}
      <div className="border-b bg-white px-6 py-4">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search input - Left side */}
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search events, rooms, or sessions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 h-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                title="Clear search"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Status filter tabs - Right side */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                statusFilter === "all"
                  ? "bg-primary-teal-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All ({statusCounts.all})
            </button>
            <button
              onClick={() => setStatusFilter("active")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                statusFilter === "active"
                  ? "bg-accent-green-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Active ({statusCounts.active})
            </button>
            <button
              onClick={() => setStatusFilter("upcoming")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                statusFilter === "upcoming"
                  ? "bg-primary-teal-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Upcoming ({statusCounts.upcoming})
            </button>
            <button
              onClick={() => setStatusFilter("past")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                statusFilter === "past"
                  ? "bg-gray-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Past ({statusCounts.past})
            </button>
          </div>
        </div>
      </div>

      {/* Events list grouped by status */}
      <div className="p-6 space-y-8">
        {/* Search results indicator */}
        {searchQuery && (
          <div className="bg-primary-teal-50 border border-primary-teal-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5 text-primary-teal-600" />
                <span className="text-sm font-medium text-primary-teal-900">
                  Found {filteredEvents.length}{" "}
                  {filteredEvents.length === 1 ? "result" : "results"} for "
                  {searchQuery}"
                </span>
              </div>
              <button
                onClick={() => setSearchQuery("")}
                className="text-sm text-primary-teal-600 hover:text-primary-teal-700 font-medium"
              >
                Clear search
              </button>
            </div>
          </div>
        )}

        {/* Active events section */}
        {groupedEvents.active.length > 0 &&
          statusFilter === "all" &&
          !searchQuery && (
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

        {/* Upcoming events section */}
        {groupedEvents.upcoming.length > 0 &&
          statusFilter === "all" &&
          !searchQuery && (
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

        {/* Past events section */}
        {groupedEvents.past.length > 0 &&
          statusFilter === "all" &&
          !searchQuery && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b-2 border-gray-300">
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

        {/* Search results view (when searching) */}
        {searchQuery && (
          <div className="space-y-4">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}

        {/* Filtered view (when a specific status filter is active, but not searching) */}
        {statusFilter !== "all" && !searchQuery && (
          <div className="space-y-4">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-900 font-semibold text-lg mb-2">
              {searchQuery.trim() ? "No results found" : "No events found"}
            </p>
            <p className="text-gray-500 text-sm">
              {searchQuery.trim()
                ? `No events, rooms, or sessions match "${searchQuery}"`
                : "There are no events in this category"}
            </p>
            {searchQuery.trim() && (
              <button
                onClick={() => setSearchQuery("")}
                className="mt-4 text-sm text-primary-teal-600 hover:text-primary-teal-700 font-medium"
              >
                Clear search and view all events
              </button>
            )}
          </div>
        )}
      </div>

      {/* Ways to Join Modal */}
      {waysToJoinModal.room && (
        <WaysToJoinModal
          open={waysToJoinModal.isOpen}
          onOpenChange={(isOpen) =>
            setWaysToJoinModal({ ...waysToJoinModal, isOpen })
          }
          roomName={waysToJoinModal.room.name}
          roomSessionId={waysToJoinModal.room.roomSessionId}
          eventName={waysToJoinModal.eventName || ""}
        />
      )}

      {/* Upload Schedule Modal */}
      <UploadScheduleModal
        open={isUploadModalOpen}
        onOpenChange={setIsUploadModalOpen}
        onUpload={handleUpload}
      />

      {/* Event Settings Modal */}
      <EventSettingsModal
        open={isSettingsModalOpen}
        onOpenChange={setIsSettingsModalOpen}
        onSave={handleSaveEventSettings}
      />
    </div>
  );
}
