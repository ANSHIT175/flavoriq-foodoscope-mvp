import type { Metadata } from "next";
import "./globals.css";
import { FlavorIqProvider } from "../context/FlavorIqContext";
import AppShell from "../components/AppShell";

export const metadata: Metadata = {
  title: "FLAVORIQ — AI-Powered Personalized Food & Flavor Intelligence Platform",
  description:
    "From What You Have to What You'll Love. Powered by RecipeDB & FlavorDB molecular pairing intelligence. Built by Team CodeXIT for Foodoscope Fork It Challenge 2026.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-brand-surface text-brand-dark antialiased">
        <FlavorIqProvider>
          <AppShell>{children}</AppShell>
        </FlavorIqProvider>
      </body>
    </html>
  );
}
