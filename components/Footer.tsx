import Link from "next/link";
import { getCollegeName } from "@/lib/config";

export default function Footer() {
  const collegeName = getCollegeName();

  return (
    <footer className="bg-[var(--brand)] text-white">
      {/* Top section */}
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 text-white font-black text-sm">
                CN
              </div>
              <span className="text-lg font-bold">{collegeName}</span>
            </Link>
            <p className="text-sm text-white/70 max-w-xs leading-relaxed">
              A free, collaborative platform where students share syllabus, class notes, and past exam papers — reviewed for quality.
            </p>
            <p className="mt-4 text-xs text-white/50">
              Built for students, by students.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-4 text-white/60">Navigation</h3>
            <ul className="space-y-2.5">
              {[
                { href: "/", label: "Home" },
                { href: "/course", label: "Courses" },
                { href: "/contribute", label: "Contribute" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/75 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-4 text-white/60">Support</h3>
            <ul className="space-y-2.5">
              <li>
                <a href="mailto:admin@example.com" className="text-sm text-white/75 hover:text-white transition-colors">
                  Contact Admin
                </a>
              </li>
              <li>
                <Link href="/admin" className="text-sm text-white/75 hover:text-white transition-colors">
                  Admin Panel
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider & Bottom */}
        <div className="mt-10 border-t border-white/15 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/60 text-center sm:text-left">
            &copy; {new Date().getFullYear()} {collegeName}. All rights reserved.
          </p>
          <p className="text-sm text-white/70 font-semibold flex items-center gap-1">
            Created with <span className="text-red-400">❤️</span> by Me
          </p>
        </div>
      </div>
    </footer>
  );
}
