import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "College Readiness Tracker",
  description: "Track your path to college readiness.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
