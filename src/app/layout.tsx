import type { Metadata } from "next";
import { roboto } from "./font";
import "./globals.css";
import { Providers } from "@/store/providers";
import { ChromeProvider } from "@/components/chrome/chrome-context";
import { Spotlight } from "@/components/spotlight/Spotlight";
import { AppShellProvider } from "@/components/layouts/AppShellProvider";
import { VercelToolbar } from "@/components/VercelToolbar";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Wordly - Intelligent Speech Platform",
  description:
    "Wordly is an intelligent speech platform for multilingual communication",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${roboto.variable}`}>
      <body className={`font-sans antialiased`}>
        <Providers>
          <ChromeProvider>
            <AppShellProvider>{children}</AppShellProvider>
            <Spotlight />
          </ChromeProvider>
        </Providers>
        <Toaster position="top-right" richColors closeButton />
        <VercelToolbar />
      </body>
    </html>
  );
}
