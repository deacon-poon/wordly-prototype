import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import {
  Section,
  ComponentEntry,
  Preview,
} from "../../_components/showcase";

export default function DataPage() {
  return (
    <Section
      title="Data Display"
      description="Components for presenting information: avatars, progress, tables and status."
    >
      <ComponentEntry
        id="avatar"
        name="Avatar"
        source="@/components/ui/avatar"
        description="User image with a text fallback when the image fails or is absent."
      >
        <Preview className="gap-4">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>WL</AvatarFallback>
          </Avatar>
          <Avatar className="h-14 w-14">
            <AvatarFallback className="bg-primary-blue-100 text-primary-blue-800">
              JD
            </AvatarFallback>
          </Avatar>
        </Preview>
      </ComponentEntry>

      <ComponentEntry
        id="progress"
        name="Progress"
        source="@/components/ui/progress"
        description="Determinate progress bar. value is 0–100."
      >
        <Preview className="block space-y-4">
          <Progress value={25} className="max-w-md" />
          <Progress value={60} className="max-w-md" />
          <Progress value={90} className="max-w-md" />
        </Preview>
      </ComponentEntry>

      <ComponentEntry
        id="skeleton"
        name="Skeleton"
        source="@/components/ui/skeleton"
        description="Placeholder shimmer shown while content loads."
      >
        <Preview>
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </Preview>
      </ComponentEntry>

      <ComponentEntry
        id="table"
        name="Table"
        source="@/components/ui/table"
        description="Structured tabular data with header, body and caption."
      >
        <Preview className="block">
          <Table>
            <TableCaption>Recent sessions.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Session</TableHead>
                <TableHead>Language</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Q3 All-Hands</TableCell>
                <TableCell>English → Spanish</TableCell>
                <TableCell className="text-right">
                  <Badge variant="accent">Live</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Board Review</TableCell>
                <TableCell>English → Japanese</TableCell>
                <TableCell className="text-right">
                  <Badge variant="secondary">Ended</Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Preview>
      </ComponentEntry>

      <ComponentEntry
        id="alert"
        name="Alert"
        source="@/components/ui/alert"
        description="Inline informational callout (Alert + AlertDescription)."
      >
        <Preview className="block">
          <Alert>
            <AlertDescription>
              Your changes have been saved. They will sync across devices
              shortly.
            </AlertDescription>
          </Alert>
        </Preview>
      </ComponentEntry>

      <ComponentEntry
        id="breadcrumb"
        name="Breadcrumb"
        source="@/components/ui/breadcrumb"
        description="Hierarchical navigation trail."
      >
        <Preview>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/sessions">Sessions</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Q3 All-Hands</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </Preview>
      </ComponentEntry>
    </Section>
  );
}
