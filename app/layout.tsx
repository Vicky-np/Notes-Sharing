import type { Metadata, Viewport } from "next";
import { Assistant } from "next/font/google";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { getCollegeName } from "@/lib/config";
import "./globals.css";

const assistant = Assistant({
  variable: "--font-assistant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: `${getCollegeName()} - Notes & Syllabus`,
  description:
    "Free study materials for college students. Download syllabus, class notes, and past exam papers. Organized by course and semester.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${assistant.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-[var(--paper)] text-[var(--ink)] selection:bg-[var(--accent)] selection:text-white">
        <Navbar />
        <main className="flex-1 flex flex-col w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
