import type { Metadata } from "next";
import "../styles/tokens.css";
import "../styles/glass.css";
import "./globals.css";
import DbHealthCheck from "@/components/DbHealthCheck";
import { ThemeProvider } from "./ThemeContext";

export const metadata: Metadata = {
  title: "ApexReach B2B | Lead Automation Console",
  description: "High-fidelity CRM and automated lead generation sequencer for Google Maps, Jiji, and Apify.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <DbHealthCheck />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

