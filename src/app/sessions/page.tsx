"use client";

import { useState, useEffect } from "react";
import { AppShell, AppHeader, AppSidebar } from "@/components/layouts";
import { SessionsLayout } from "@/components/layouts/SessionsLayout";
import {
  Clock,
  Users,
  ClipboardList,
  ChevronDown,
  Mail,
  Copy,
  Printer,
  Download,
  Hash,
  Calendar,
  Settings,
  FileText,
  Volume2,
  KeyRound,
  User,
  Globe,
  Lock,
  Pin,
  BookOpen,
  Tag,
  Link,
  Languages as LanguagesIcon,
  Edit,
  QrCode as QrCodeIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useViewportSize } from "@/hooks/use-mobile";
import { QrCode } from "@/components/QrCode";

// Define the session type to match the mock data in SessionsLayout
interface Session {
  id: string;
  title: string;
  startDate: string;
  time: string;
  duration: number;
  status: string;
  attendees: { count: number };
  languages: Array<{ language: string; count: number }>;
}

export default function SessionsPage() {
  // Control the right panel visibility
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [showMobilePanel, setShowMobilePanel] = useState(false);
  const { width } = useViewportSize();
  const isSmallScreen = width < 768;

  const handleToggleRightPanel = () => {
    setShowRightPanel(!showRightPanel);
  };

  const handleSessionSelect = (session: Session) => {
    setSelectedSession(session);

    // Ensure the right panel is visible when a session is selected
    if (!showRightPanel) {
      setShowRightPanel(true);
    }

    // For mobile/tablet, trigger the mobile panel
    if (isSmallScreen) {
      setShowMobilePanel(true);

      // We need to notify the AppShell to show the mobile panel
      const appShellEvent = new CustomEvent("appshell-show-mobile-panel");
      window.dispatchEvent(appShellEvent);
    }
  };

  // Listen for app shell events
  useEffect(() => {
    const handleResize = () => {
      if (width >= 768) {
        setShowMobilePanel(false);
      }
    };

    const handleRightPanelClose = () => {
      setShowRightPanel(false);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("rightpanel-close", handleRightPanelClose);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("rightpanel-close", handleRightPanelClose);
    };
  }, [width]);

  return (
    <AppShell
      sidebar={<AppSidebar />}
      header={<AppHeader title="Sessions" />}
      showRightPanel={showRightPanel}
      rightPanel={
        <div className="h-full w-full flex flex-col">
          {selectedSession ? (
            <div className="p-0 flex-1 overflow-y-auto">
              <div className="flex flex-col">
                {/* Header with title */}
                <div className="p-5 border-b">
                  <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
                    <h2 className="font-semibold text-gray-700">Session</h2>
                  </div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    {selectedSession.title}
                  </h1>
                  <div className="flex items-center mt-1 text-sm text-gray-500">
                    <span>{selectedSession.id}</span>
                  </div>
                </div>

                {/* Main content */}
                <div className="p-5">
                  {/* Session Info - Two Column Layout */}
                  <div className="grid grid-cols-[120px_1fr] gap-y-4">
                    {/* Row 1: Presenter */}
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-gray-400 mr-2" />
                      <p className="text-sm font-medium text-gray-500">
                        Presenter:
                      </p>
                    </div>
                    <p className="text-sm font-medium">Deacon Poon</p>

                    {/* Row 2: Session ID */}
                    <div className="flex items-center">
                      <Hash className="h-4 w-4 text-gray-400 mr-2" />
                      <p className="text-sm font-medium text-gray-500">
                        Session ID:
                      </p>
                    </div>
                    <div className="flex items-center">
                      <p className="text-sm font-medium mr-2">
                        {selectedSession.id}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="h-3.5 w-3.5 text-gray-400" />
                      </Button>
                    </div>

                    {/* Row 3: Passcode */}
                    <div className="flex items-center">
                      <KeyRound className="h-4 w-4 text-gray-400 mr-2" />
                      <p className="text-sm font-medium text-gray-500">
                        Passcode:
                      </p>
                    </div>
                    <p className="text-sm font-medium">327269</p>

                    {/* Row 4: Start date */}
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      <p className="text-sm font-medium text-gray-500">
                        Start date:
                      </p>
                    </div>
                    <p className="text-sm font-medium">
                      {selectedSession.startDate} {selectedSession.time} (PDT)
                    </p>

                    {/* Row 5: Account */}
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                      <p className="text-sm font-medium text-gray-500">
                        Account:
                      </p>
                    </div>
                    <p className="text-sm font-medium">Deacon Poon (2a49e)</p>

                    {/* Row 6: Duration */}
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-400 mr-2" />
                      <p className="text-sm font-medium text-gray-500">
                        Duration:
                      </p>
                    </div>
                    <p className="text-sm font-medium">
                      {selectedSession.duration} mins
                    </p>

                    {/* Row 7: Language */}
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 text-gray-400 mr-2" />
                      <p className="text-sm font-medium text-gray-500">
                        Language:
                      </p>
                    </div>
                    <p className="text-sm font-medium">English (US)</p>

                    {/* Row 8: Auto Select */}
                    <div className="flex items-center">
                      <Settings className="h-4 w-4 text-gray-400 mr-2" />
                      <p className="text-sm font-medium text-gray-500">
                        Auto Select:
                      </p>
                    </div>
                    <p className="text-sm font-medium">Enabled</p>

                    {/* Row 9: Selections */}
                    <div className="flex items-center">
                      <LanguagesIcon className="h-4 w-4 text-gray-400 mr-2" />
                      <p className="text-sm font-medium text-gray-500">
                        Selections:
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-gray-100 text-xs rounded-full flex items-center">
                        <span className="mr-1">✓</span> Arabic
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-xs rounded-full flex items-center">
                        <span className="mr-1">✓</span> Chinese (Simplified)
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-xs rounded-full flex items-center">
                        + 6
                      </span>
                    </div>

                    {/* Row 10: Glossary */}
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 text-gray-400 mr-2" />
                      <p className="text-sm font-medium text-gray-500">
                        Glossary:
                      </p>
                    </div>
                    <p className="text-sm font-medium">-</p>

                    {/* Row 11: Transcript */}
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 text-gray-400 mr-2" />
                      <p className="text-sm font-medium text-gray-500">
                        Transcript:
                      </p>
                    </div>
                    <p className="text-sm font-medium">
                      Private Transcript Only
                    </p>

                    {/* Row 12: Access */}
                    <div className="flex items-center">
                      <Lock className="h-4 w-4 text-gray-400 mr-2" />
                      <p className="text-sm font-medium text-gray-500">
                        Access:
                      </p>
                    </div>
                    <p className="text-sm font-medium">Open</p>

                    {/* Row 13: Pinned */}
                    <div className="flex items-center">
                      <Pin className="h-4 w-4 text-gray-400 mr-2" />
                      <p className="text-sm font-medium text-gray-500">
                        Pinned:
                      </p>
                    </div>
                    <p className="text-sm font-medium">Yes</p>

                    {/* Row 14: Voice Pack */}
                    <div className="flex items-center">
                      <Volume2 className="h-4 w-4 text-gray-400 mr-2" />
                      <p className="text-sm font-medium text-gray-500">
                        Voice Pack:
                      </p>
                    </div>
                    <p className="text-sm font-medium">Voice Pack 1</p>

                    {/* Row 15: Label */}
                    <div className="flex items-center">
                      <Tag className="h-4 w-4 text-gray-400 mr-2" />
                      <p className="text-sm font-medium text-gray-500">
                        Label:
                      </p>
                    </div>
                    <p className="text-sm font-medium">-</p>
                  </div>

                  <div className="mt-6">
                    <Button className="w-full bg-brand-teal hover:bg-brand-teal/90 text-white">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Session
                    </Button>
                  </div>
                </div>

                {/* Attendee Shortcuts Section */}
                <div className="border-t mt-4">
                  <div className="p-5">
                    <div className="flex justify-between items-center">
                      <div className="flex">
                        <Users className="h-5 w-5 text-gray-600 mr-2" />
                        <h3 className="text-base font-semibold">
                          Attendee Shortcuts
                        </h3>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm text-gray-600">
                        To invite someone to attend this presentation or
                        webinar, use the URL or QR code below.
                      </p>

                      <div className="mt-4 space-y-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Link className="h-4 w-4 text-gray-400 mr-2" />
                            <p className="text-sm font-medium">URL:</p>
                          </div>
                          <div className="flex items-center">
                            <p className="text-sm text-brand-teal mr-2 truncate max-w-[180px]">
                              https://dev-attend.wordly.ai/join/
                              {selectedSession.id}
                            </p>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <Mail className="h-4 w-4 text-gray-400" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <Copy className="h-4 w-4 text-gray-400" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <QrCodeIcon className="h-4 w-4 text-gray-400 mr-2" />
                            <p className="text-sm font-medium">QR Code:</p>
                          </div>
                          <div className="flex items-center">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <Printer className="h-4 w-4 text-gray-400" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <Download className="h-4 w-4 text-gray-400" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex justify-center mt-2">
                          <div className="bg-gray-50 p-3 rounded-md w-[150px] h-[150px] flex items-center justify-center">
                            <div className="relative">
                              <QrCode />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="bg-white rounded-full p-1">
                                  <span className="text-brand-teal font-bold text-sm">
                                    W
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 flex-1 overflow-y-auto">
              <h2 className="text-lg font-semibold mb-4">Session Analysis</h2>
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="p-3 bg-gray-100 rounded-full mb-4">
                  <Clock className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">
                  No Session Selected
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Select a session from the list to view details
                </p>
              </div>
              <div className="space-y-3 mt-8">
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-xs text-gray-500 mb-1">Total Sessions</p>
                  <p className="text-xl font-semibold">24</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-xs text-gray-500 mb-1">Avg. Duration</p>
                  <p className="text-xl font-semibold">45 min</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-xs text-gray-500 mb-1">Common Languages</p>
                  <p className="text-xl font-semibold">English, Spanish</p>
                </div>
              </div>
            </div>
          )}
        </div>
      }
    >
      <SessionsLayout
        onToggleRightPanel={handleToggleRightPanel}
        onSelectSession={handleSessionSelect}
        selectedSession={selectedSession}
      />
    </AppShell>
  );
}
