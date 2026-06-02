import { Button } from "@wordly/ui";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-foreground">
          Wordly Lab Prototype
        </h1>
        <p className="text-muted-foreground">
          Replace this with your prototype. Components from{" "}
          <code className="text-brand-blue-400">@wordly/ui</code>.
        </p>
        <Button>Get Started</Button>
      </div>
    </main>
  );
}
