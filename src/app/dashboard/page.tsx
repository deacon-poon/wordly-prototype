"use client";

import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar-redux";
import Link from "next/link";
import { useSelector } from "react-redux";
import { selectUserPlan, selectUserActivity } from "@/store/slices/userSlice";

export default function DashboardPage() {
  const userPlan = useSelector(selectUserPlan);
  const userActivity = useSelector(selectUserActivity);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Plan Info Card */}
            <div className="rounded-lg border bg-card text-card-foreground shadow">
              <div className="p-6 flex flex-col space-y-4">
                <h3 className="text-xl font-semibold">
                  Your Plan: {userPlan.name}
                </h3>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Available time: {userPlan.availableTime} mins
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Scheduled time: {userPlan.scheduledTime} mins
                  </p>
                </div>
                <div className="w-full max-w-[100px] h-10 rounded-md bg-[#00B8D9] flex items-center justify-center text-white">
                  {userPlan.availableTime}
                </div>
                <Link
                  href="/purchase"
                  className="text-sm text-[#00B8D9] hover:underline inline-flex items-center"
                >
                  Purchase
                </Link>
              </div>
            </div>

            {/* Recent Usage Card */}
            <div className="rounded-lg border bg-card text-card-foreground shadow">
              <div className="p-6 flex flex-col space-y-4">
                <h3 className="text-xl font-semibold">Recent Usage</h3>
                <div className="w-full h-[100px] flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">
                    No usage data available
                  </p>
                </div>
              </div>
            </div>

            {/* Try it Now Card */}
            <div className="rounded-lg border bg-card text-card-foreground shadow">
              <div className="p-6 flex flex-col space-y-4">
                <h3 className="text-xl font-semibold">Try it Now</h3>
                <p className="text-sm text-muted-foreground">
                  To see Wordly in action, click the link below to open a
                  demonstration session.
                </p>
                <Link
                  href="#"
                  className="text-sm text-[#00B8D9] hover:underline inline-flex items-center"
                >
                  Try it Now
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {/* Session Activity Card */}
            <div className="rounded-lg border bg-card text-card-foreground shadow">
              <div className="p-6 flex flex-col space-y-4">
                <h3 className="text-xl font-semibold">Session Activity</h3>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Last: {userActivity.lastSession || "-"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Next: {userActivity.nextSession || "-"}
                  </p>
                </div>
                <Link
                  href="/activity"
                  className="text-sm text-[#00B8D9] hover:underline inline-flex items-center"
                >
                  Activity
                </Link>
              </div>
            </div>

            {/* Schedule Card */}
            <div className="rounded-lg border bg-card text-card-foreground shadow">
              <div className="p-6 flex flex-col space-y-4">
                <h3 className="text-xl font-semibold">Schedule</h3>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Schedule a session in advance.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Get links for an upcoming session.
                  </p>
                </div>
                <Link
                  href="/schedule"
                  className="text-sm text-[#00B8D9] hover:underline inline-flex items-center"
                >
                  Schedule
                </Link>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
