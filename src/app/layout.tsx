import type { Metadata } from "next";
import { roboto } from "./font";
import "./globals.css";
import { Providers } from "@/store/providers";
import { AppShellProvider } from "@/components/layouts/AppShellProvider";

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
      <body className={`font-sans antialiased h-screen overflow-hidden`}>
        <Providers>
          <AppShellProvider>{children}</AppShellProvider>
        </Providers>
      </body>
    </html>
  );
}
