import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="text-[32px] font-bold text-[var(--ink)]">Page not found</h1>
      <p className="mt-3 text-base text-[var(--muted)]">That course or page is not here.</p>
      <Link href="/course" className="mt-6 inline-block font-bold text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors">
        Back to courses →
      </Link>
    </div>
  );
}
