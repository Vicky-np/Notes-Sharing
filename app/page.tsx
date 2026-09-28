import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import { getCollegeName } from "@/lib/config";
import { getFeaturedResources } from "@/lib/data";
import { TYPE_LABELS } from "@/lib/types";

export default async function HomePage() {
  const college = getCollegeName();
  const featured = await getFeaturedResources();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
      <FadeIn>
        <p className="text-sm uppercase tracking-[0.2em] font-bold text-[var(--accent)]">
          For students, by students
        </p>
        {/* Main Heading - 32px (text-3xl in Tailwind is 1.875rem = 30px, text-4xl is 36px. We will use a custom class or inline style for exactly 32px if needed, but text-3xl or 4xl is fine. Let's use text-[32px] for exactness) */}
        <h1 className="mt-4 max-w-4xl text-[32px] font-bold leading-[1.2] text-[var(--ink)] sm:text-[48px]">
          {college} <br />
          <span className="text-[var(--muted)]">Study Archive</span>
        </h1>
        {/* Secondary text - 16px (text-base in Tailwind is 16px) */}
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--muted)]">
          One quiet place for syllabus, class notes, and past questions. Anyone
          can read and download. If you want to add a file, sign in with Google
          and send a request — it goes live only after a short review.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/course"
            className="rounded-full bg-[var(--accent)] px-8 py-3.5 text-base font-bold text-white transition-all hover:bg-[var(--accent-hover)] hover:scale-105 shadow-md"
          >
            Browse courses
          </Link>
          <Link
            href="/contribute"
            className="rounded-full border-2 border-[var(--accent)] bg-transparent px-8 py-3.5 text-base font-bold text-[var(--accent)] transition-colors hover:bg-[var(--accent)] hover:text-white"
          >
            Contribute a file
          </Link>
        </div>
      </FadeIn>

      <FadeIn delay={0.12} className="mt-32">
        <h2 className="text-[32px] font-bold text-[var(--ink)]">Famous on campus</h2>
        <p className="mt-3 max-w-2xl text-base text-[var(--muted)] leading-relaxed">
          A few files people open most. Click a course to view the PDF directly in your
          browser or download it for offline reading.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((item) => (
            <Link
              key={item.id}
              href={`/course/${item.course_id}`}
              className="group flex flex-col rounded-2xl border border-[var(--line)] bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-lg hover:border-[var(--accent)]"
            >
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--accent)] mb-3 flex items-center gap-2">
                {item.courses?.name || "Course"} <span className="w-1 h-1 rounded-full bg-[var(--line)]" /> {TYPE_LABELS[item.type]}
              </p>
              <h3 className="text-xl font-bold text-[var(--ink)] leading-snug group-hover:text-[var(--accent)] transition-colors">
                {item.title}
              </h3>
              <p className="mt-auto pt-6 text-sm font-bold text-[var(--muted)] flex items-center gap-2 group-hover:text-[var(--accent)] transition-colors">
                Open in reader →
              </p>
            </Link>
          ))}
        </div>
      </FadeIn>

      <FadeIn delay={0.2} className="mt-32 border-t border-[var(--line)] pt-16">
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              title: "Read freely",
              body: "No account needed to view syllabus, notes, or past papers. Knowledge should be accessible to everyone.",
              icon: "📖",
            },
            {
              title: "PDF in the browser",
              body: "Open the file directly on the page without leaving the site, then download if you want a local copy.",
              icon: "📄",
            },
            {
              title: "Reviewed uploads",
              body: "Contributions wait in a queue so the library stays tidy, organized, and free of spam.",
              icon: "🛡️",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-3xl bg-white p-8 border border-[var(--line)] shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-3xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold text-[var(--ink)]">{item.title}</h3>
              <p className="mt-3 text-base leading-relaxed text-[var(--muted)]">{item.body}</p>
            </div>
          ))}
        </div>
      </FadeIn>
    </div>
  );
}
