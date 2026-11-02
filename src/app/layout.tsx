import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FLAVORIQ — From What You Have to What You'll Love",
  description:
    "Flavor-aware personalized recipe recommendation engine powered by RecipeDB & FlavorDB intelligence. Built by Team CodeXIT.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-brand-surface text-brand-dark antialiased">
        {children}
      </body>
    </html>
  );
}
