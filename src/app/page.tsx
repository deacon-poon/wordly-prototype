import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Home() {
  // For logged-in users, redirect to sessions. For now, show the landing page.
  // redirect("/sessions");

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Image
              src="/logo/wordly-logo.svg"
              alt="Wordly Logo"
              width={32}
              height={32}
            />
            <span className="text-2xl font-bold text-primary-teal-600">
              wordly
            </span>
          </div>
          <nav className="flex items-center gap-6">
            <Link
              href="/sessions"
              className="text-sm font-medium hover:underline"
            >
              Sessions
            </Link>
            <Link href="/login" className="text-sm font-medium hover:underline">
              Login
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to Wordly</h1>
          <p className="text-lg text-gray-600 mb-8">
            The multilingual interpretation platform
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="/sessions">View Sessions</Link>
            </Button>
            <Button variant="outline">
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </main>
      <footer className="border-t py-6">
        <div className="container mx-auto text-center text-sm text-gray-500">
          © {new Date().getFullYear()} wordly. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
// Trigger build
