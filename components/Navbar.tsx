import Link from "next/link";
import { FC } from "react";
import { getCollegeName } from "@/lib/config";

const Navbar: FC = () => {
  const collegeName = getCollegeName();
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[var(--brand)] bg-[var(--brand)] shadow-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold tracking-tight text-[var(--brand-text)]">
              {collegeName.split(' ')[0]}<span className="opacity-80 ml-1">{collegeName.split(' ').slice(1).join(' ')}</span>
            </span>
          </Link>
          <div className="hidden md:block">
            <div className="flex items-center gap-6">
              <Link href="/" className="text-sm font-medium text-[var(--brand-text)] opacity-90 hover:opacity-100 transition-opacity">
                Home
              </Link>
              <Link href="/course" className="text-sm font-medium text-[var(--brand-text)] opacity-90 hover:opacity-100 transition-opacity">
                Courses
              </Link>
              <Link href="/contribute" className="text-sm font-medium text-[var(--brand-text)] opacity-90 hover:opacity-100 transition-opacity">
                Contribute
              </Link>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/contribute"
            className="rounded-full bg-white px-5 py-2 text-sm font-bold text-[var(--brand)] shadow-sm hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[var(--brand)]"
          >
            Contribute Notes
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
