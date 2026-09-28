"use client";

import Link from "next/link";
import { useState } from "react";
import { getCollegeName } from "@/lib/config";

export default function Navbar() {
  const collegeName = getCollegeName();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/course", label: "Courses" },
    { href: "/contribute", label: "Contribute" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-[var(--brand)] shadow-lg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 text-white font-black text-sm">
            CN
          </div>
          <span className="text-lg font-bold text-white tracking-tight">
            {collegeName}
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 rounded-full text-sm font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-all"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/contribute"
            className="rounded-full bg-white px-5 py-2 text-sm font-bold text-[var(--brand)] shadow hover:bg-gray-50 hover:shadow-md active:scale-95"
          >
            Contribute Notes
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-white/10"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span className={`block h-0.5 w-6 bg-white transition-all ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block h-0.5 w-6 bg-white transition-all ${mobileOpen ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 w-6 bg-white transition-all ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[var(--brand-hover)] border-t border-white/10 px-4 pb-4 pt-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-3 text-sm font-semibold text-white/90 hover:text-white border-b border-white/10 last:border-0"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contribute"
            onClick={() => setMobileOpen(false)}
            className="mt-4 block text-center rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[var(--brand)]"
          >
            Contribute Notes
          </Link>
        </div>
      )}
    </nav>
  );
}
