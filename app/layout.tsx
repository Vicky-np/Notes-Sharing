import type { Metadata } from "next";
import { Assistant } from "next/font/google";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { getCollegeName } from "@/lib/config";
import "./globals.css";

const assistant = Assistant({
  variable: "--font-assistant",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${getCollegeName()} - Notes & Syllabus`,
  description: "View and download college notes, syllabus, and past questions. Contribute with Google after a short review.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${assistant.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-[var(--paper)] text-[var(--ink)]">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
