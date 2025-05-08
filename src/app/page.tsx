import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="relative z-20 shadow-sm bg-gradient-to-r from-brand-teal/15 via-brand-teal/5 to-brand-pink/5">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Image
              src="/logo/wordly-logo.png"
              alt="Wordly Logo"
              width={32}
              height={32}
              className="h-auto w-auto"
            />
            <span className="text-2xl font-bold text-brand-teal">Wordly</span>
          </div>
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
        <section className="container mx-auto py-12 px-4">
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Testing Shadcn Components
          </h1>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>This is a Card</CardTitle>
                <CardDescription>
                  Testing if shadcn/ui styling works
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>This is card content to test styling</p>
              </CardContent>
              <CardFooter>
                <Button>Primary Button</Button>
                <Button variant="outline" className="ml-2">
                  Outline Button
                </Button>
              </CardFooter>
            </Card>

            <div className="border p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-4">
                Plain HTML for comparison
              </h3>
              <p>This is unstyled content</p>
              <Separator className="my-4" />
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-blue-500 text-white rounded">
                  Plain Button
                </button>
              </div>
            </div>
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
