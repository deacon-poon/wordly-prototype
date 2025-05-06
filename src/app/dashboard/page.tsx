import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="rounded-lg border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-col space-y-2">
            <h3 className="text-2xl font-semibold">Recent Sessions</h3>
            <p className="text-muted-foreground">No active sessions found</p>
            <Link
              href="/sessions"
              className="text-sm text-primary hover:underline mt-4"
            >
              View all sessions
            </Link>
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-col space-y-2">
            <h3 className="text-2xl font-semibold">Transcripts</h3>
            <p className="text-muted-foreground">No transcripts found</p>
            <Link
              href="/transcripts"
              className="text-sm text-primary hover:underline mt-4"
            >
              View all transcripts
            </Link>
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-col space-y-2">
            <h3 className="text-2xl font-semibold">Glossaries</h3>
            <p className="text-muted-foreground">No glossaries found</p>
            <Link
              href="/glossaries"
              className="text-sm text-primary hover:underline mt-4"
            >
              View all glossaries
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/sessions/new"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
          >
            New Session
          </Link>
          <Link
            href="/transcripts/upload"
            className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Upload Transcript
          </Link>
          <Link
            href="/glossaries/new"
            className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Create Glossary
          </Link>
        </div>
      </div>
    </div>
  );
}
