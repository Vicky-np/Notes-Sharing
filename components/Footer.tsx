import Link from "next/link";
import { FC } from "react";
import { getCollegeName } from "@/lib/config";

const Footer: FC = () => {
  const collegeName = getCollegeName();
  
  return (
    <footer className="bg-[var(--brand)] text-[var(--brand-text)] mt-auto">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="text-xl font-bold tracking-tight text-[var(--brand-text)]">
                {collegeName.split(' ')[0]}<span className="opacity-80 ml-1">{collegeName.split(' ').slice(1).join(' ')}</span>
              </span>
            </Link>
            <p className="text-sm opacity-80 max-w-xs leading-relaxed">
              A collaborative platform for college students to share, find, and access study materials, past questions, and syllabi.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 opacity-90">Navigation</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-sm opacity-80 hover:opacity-100 transition-opacity">Home</Link>
              </li>
              <li>
                <Link href="/course" className="text-sm opacity-80 hover:opacity-100 transition-opacity">Courses</Link>
              </li>
              <li>
                <Link href="/contribute" className="text-sm opacity-80 hover:opacity-100 transition-opacity">Contribute</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 opacity-90">Support</h3>
            <ul className="space-y-3">
              <li>
                <a href="mailto:admin@example.com" className="text-sm opacity-80 hover:opacity-100 transition-opacity">Contact Admin</a>
              </li>
              <li>
                <Link href="/admin" className="text-sm opacity-80 hover:opacity-100 transition-opacity">Admin Login</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm opacity-80">
            &copy; {new Date().getFullYear()} {collegeName}. All rights reserved.
          </p>
          <p className="text-sm opacity-90 font-medium flex items-center gap-1">
            Created with <span className="text-red-400">❤️</span> by Me
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
