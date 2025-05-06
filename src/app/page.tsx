import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="text-2xl font-bold">Wordly</div>
          <nav className="flex items-center gap-6">
            <Link href="/dashboard" className="hover:underline">
              Dashboard
            </Link>
            <Link href="/sessions" className="hover:underline">
              Sessions
            </Link>
            <Link href="/transcripts" className="hover:underline">
              Transcripts
            </Link>
            <Link href="/glossaries" className="hover:underline">
              Glossaries
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="container mx-auto flex flex-col items-center justify-center gap-6 py-12 text-center px-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            AI-Powered Translation Platform
          </h1>
          <p className="max-w-[700px] text-lg text-muted-foreground">
            Translate your audio and video content into multiple languages with
            high accuracy using our advanced AI technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/dashboard"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
            >
              Get Started
            </Link>
            <Link
              href="/about"
              className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Learn More
            </Link>
          </div>
        </section>
      </main>
      <footer className="border-t py-6">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Wordly. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
