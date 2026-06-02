import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}

