import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";

// The Contribute page now explains that only the admin can upload.
// Students can still request files via email.
export default function ContributePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:py-24">
      <FadeIn>
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent)] mb-3">Contribute</p>
        <h1 className="text-[32px] sm:text-4xl font-black text-[var(--ink)] leading-tight">
          Want to Help Your Classmates?
        </h1>
        <p className="mt-4 text-base text-[var(--muted)] leading-relaxed max-w-2xl">
          We are always looking for quality study materials. If you have notes, syllabi, or past papers, you can request them to be added to the archive.
        </p>
      </FadeIn>

      <FadeIn delay={0.08} className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Option 1 — Email request */}
        <div className="rounded-2xl border border-[var(--line)] bg-white p-7 shadow-sm flex flex-col">
          <div className="w-12 h-12 rounded-xl bg-[var(--accent-light)] flex items-center justify-center text-2xl mb-5">
            📧
          </div>
          <h2 className="text-xl font-bold text-[var(--ink)]">Send a Request</h2>
          <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed flex-1">
            Email us the file with the course name and semester. The admin will review and upload it if it meets quality standards.
          </p>
          <a href="mailto:bikashsharmalamsal@gmail.com?subject=Hello%20Bikash&body=Hello%20Bikash,%0A%0AI%20would%20like%20to%20contact%20you.">
  Email Me
</a>
        </div>

        {/* Option 2 — What happens */}
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--mist)] p-7 flex flex-col">
          <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-2xl mb-5 shadow-sm">
            🛡️
          </div>
          <h2 className="text-xl font-bold text-[var(--ink)]">How It Works</h2>
          <ul className="mt-3 space-y-3 flex-1">
            {[
              "You send your file via email",
              "Admin reviews it for quality",
              "If approved, it is uploaded to the correct course & semester",
              "All students can then access it for free",
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-[var(--muted)]">
                <span className="shrink-0 w-5 h-5 rounded-full bg-[var(--accent)] text-white text-[10px] font-black flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ul>
        </div>
      </FadeIn>

      <FadeIn delay={0.15} className="mt-8 rounded-2xl border border-[var(--line)] bg-white p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-[var(--ink)]">Looking for study materials?</p>
          <p className="text-sm text-[var(--muted)] mt-0.5">Browse all available courses and download what you need.</p>
        </div>
        <Link
          href="/course"
          className="shrink-0 rounded-full bg-[var(--ink)] px-6 py-3 text-sm font-bold text-white hover:bg-[var(--accent-hover)] transition-colors active:scale-95"
        >
          Browse Courses →
        </Link>
      </FadeIn>
    </div>
  );
}
