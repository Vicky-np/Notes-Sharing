import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import { getCollegeName } from "@/lib/config";
import { getFeaturedResources } from "@/lib/data";
import { TYPE_LABELS } from "@/lib/types";

export default async function HomePage() {
  const college = getCollegeName();
  const featured = await getFeaturedResources();

  const stats = [
    { number: "500+", label: "Study Files" },
    { number: "20+", label: "Courses" },
    { number: "1000+", label: "Students Helped" },
    { number: "100%", label: "Free Forever" },
  ];

  const features = [
    {
      icon: "📖",
      title: "Read Freely",
      body: "No account needed to browse and read any file. Open syllabus, notes, and past papers instantly.",
    },
    {
      icon: "📄",
      title: "In-Browser PDF Viewer",
      body: "View documents without downloading. Read in the browser, then save to your device when you need.",
    },
    {
      icon: "🔒",
      title: "Quality Reviewed",
      body: "Every uploaded file is reviewed by the admin before going live, keeping the library clean and useful.",
    },
    {
      icon: "📲",
      title: "Works on Any Device",
      body: "Fully optimized for phones, tablets, and desktops. Study anywhere, anytime.",
    },
    {
      icon: "🔍",
      title: "Organized by Semester",
      body: "Materials are sorted by course and semester so you find exactly what you need in seconds.",
    },
    {
      icon: "📤",
      title: "Community Driven",
      body: "Sign in with Google to contribute your own notes. Help your classmates succeed too.",
    },
  ];

  const steps = [
    {
      step: "01",
      title: "Browse Courses",
      body: "Go to the Courses page and pick your subject from the list.",
    },
    {
      step: "02",
      title: "Select Semester",
      body: "Choose your semester or year to filter relevant materials.",
    },
    {
      step: "03",
      title: "View & Download",
      body: "Open the PDF in the browser or download it to study offline.",
    },
  ];

  return (
    <div className="w-full">
      {/* ── HERO SECTION ── */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-[var(--brand)]">
        {/* Background decorative circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-white/5" />
          <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-white/5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-white/3" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left — Text */}
            <FadeIn>
              <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold text-white uppercase tracking-wider mb-6">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                For Students, By Students
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-black text-white leading-[1.1] tracking-tight">
                {college}{" "}
                <span className="gradient-text block mt-1">Study Archive</span>
              </h1>
              <p className="mt-6 text-base sm:text-lg text-white/75 leading-relaxed max-w-xl">
                One place for all your college study materials — syllabus, class notes, and past exam papers. Browse freely, no account required.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/course"
                  className="rounded-full bg-white px-8 py-3.5 text-base font-bold text-[var(--brand)] shadow-lg hover:bg-gray-50 hover:shadow-xl active:scale-95 text-center"
                >
                  Browse Courses →
                </Link>
                <Link
                  href="/contribute"
                  className="rounded-full border-2 border-white/40 px-8 py-3.5 text-base font-bold text-white hover:bg-white/10 active:scale-95 text-center"
                >
                  Contribute a File
                </Link>
              </div>
            </FadeIn>

            {/* Right — Image Placeholder */}
            <FadeIn delay={0.15} className="hidden lg:flex justify-center">
              <div className="relative w-full max-w-md">
                {/* Main image placeholder */}
                <div className="relative rounded-3xl overflow-hidden bg-white/10 border border-white/20 aspect-[4/3] flex items-center justify-center backdrop-blur-sm">
                  {/* 
                    ─────────────────────────────────────────────
                    TO ADD YOUR HERO IMAGE:
                    1. Save your image to /public/hero.jpg  (or .png, .webp)
                    2. Replace the <div> below with:
                       <img src="/hero.jpg" alt="Students studying" className="w-full h-full object-cover" />
                    ─────────────────────────────────────────────
                  */}
                  <div className="text-center text-white/60 p-8">
                    <div className="text-6xl mb-4">📚</div>
                    <p className="text-sm font-semibold">Hero Image Placeholder</p>
                    <p className="text-xs mt-1 opacity-70">Add /public/hero.jpg to replace</p>
                  </div>
                  {/* Floating card 1 */}
                  <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-[var(--accent-light)] flex items-center justify-center text-lg">📝</div>
                    <div>
                      <p className="text-xs font-bold text-[var(--ink)]">500+ Notes</p>
                      <p className="text-[10px] text-[var(--muted)]">Available now</p>
                    </div>
                  </div>
                  {/* Floating card 2 */}
                  <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center text-lg">✅</div>
                    <div>
                      <p className="text-xs font-bold text-[var(--ink)]">Quality Reviewed</p>
                      <p className="text-[10px] text-[var(--muted)]">Admin approved</p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── STATS BANNER ── */}
      <section className="bg-[var(--mist)] border-y border-[var(--line)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 text-center">
            {stats.map((stat) => (
              <FadeIn key={stat.label}>
                <p className="text-3xl sm:text-4xl font-black text-[var(--accent)]">{stat.number}</p>
                <p className="mt-1 text-sm font-semibold text-[var(--muted)]">{stat.label}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT US ── */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Image placeholder */}
            <FadeIn>
              <div className="rounded-3xl overflow-hidden bg-[var(--mist)] border border-[var(--line)] aspect-[4/3] flex items-center justify-center relative">
                {/* 
                  ─────────────────────────────────────────────
                  TO ADD ABOUT IMAGE:
                  Replace this div with:
                  <img src="/about.jpg" alt="About us" className="w-full h-full object-cover" />
                  ─────────────────────────────────────────────
                */}
                <div className="text-center p-8 text-[var(--muted)]">
                  <div className="text-5xl mb-3">🎓</div>
                  <p className="text-sm font-semibold">About Image Placeholder</p>
                  <p className="text-xs mt-1">Add /public/about.jpg to replace</p>
                </div>
                {/* Decorative accent bar */}
                <div className="absolute top-0 left-0 w-2 h-full bg-[var(--brand)] rounded-l-3xl" />
              </div>
            </FadeIn>

            {/* Text */}
            <FadeIn delay={0.1}>
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent)] mb-3">About Us</p>
              <h2 className="text-[32px] font-black text-[var(--ink)] leading-tight">
                A Project Built for Every Student in This College
              </h2>
              <p className="mt-4 text-base text-[var(--muted)] leading-relaxed">
                {college} Study Archive was created as a college project to solve a simple but important problem — students couldn't easily find and share study resources with each other.
              </p>
              <p className="mt-3 text-base text-[var(--muted)] leading-relaxed">
                Every note, syllabus, and past paper uploaded here has been reviewed for quality. We believe open knowledge is the foundation of student success.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/course"
                  className="inline-flex justify-center items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-bold text-white hover:bg-[var(--accent-hover)] active:scale-95"
                >
                  Explore Materials →
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── WHAT WE DO ── */}
      <section className="py-20 sm:py-28 bg-[var(--mist)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <FadeIn className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent)] mb-3">What We Do</p>
            <h2 className="text-[32px] font-black text-[var(--ink)] leading-tight">
              Everything You Need to Study Smarter
            </h2>
            <p className="mt-4 text-base text-[var(--muted)] max-w-2xl mx-auto leading-relaxed">
              We organize and provide access to all study resources in one clean, easy-to-use platform built specifically for our college students.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <FadeIn key={f.title} delay={i * 0.06}>
                <div className="bg-white rounded-2xl border border-[var(--line)] p-6 sm:p-7 h-full flex flex-col card-hover group">
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-[var(--accent-light)] text-2xl mb-5 group-hover:scale-110 transition-transform">
                    {f.icon}
                  </div>
                  <h3 className="text-lg font-bold text-[var(--ink)]">{f.title}</h3>
                  <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed flex-1">{f.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <FadeIn className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent)] mb-3">How It Works</p>
            <h2 className="text-[32px] font-black text-[var(--ink)] leading-tight">
              Get Your Study Materials in 3 Steps
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 relative">
            {/* Connector line — hidden on mobile */}
            <div className="hidden sm:block absolute top-8 left-[16.67%] right-[16.67%] h-0.5 bg-[var(--line)]" />

            {steps.map((step, i) => (
              <FadeIn key={step.step} delay={i * 0.1}>
                <div className="relative text-center flex flex-col items-center">
                  <div className="relative w-16 h-16 flex items-center justify-center rounded-2xl bg-[var(--accent)] text-white text-xl font-black mb-5 shadow-lg z-10">
                    {step.step}
                  </div>
                  <h3 className="text-lg font-bold text-[var(--ink)]">{step.title}</h3>
                  <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed max-w-[220px]">{step.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT WE DELIVER / FEATURED ── */}
      <section className="py-20 sm:py-28 bg-[var(--mist)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <FadeIn className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent)] mb-3">What We Deliver</p>
              <h2 className="text-[32px] font-black text-[var(--ink)] leading-tight">
                Popular on Campus
              </h2>
              <p className="mt-3 text-base text-[var(--muted)] max-w-xl leading-relaxed">
                Files students open the most. Click any card to view the PDF right in your browser.
              </p>
            </div>
            <Link
              href="/course"
              className="shrink-0 rounded-full border-2 border-[var(--accent)] px-6 py-2.5 text-sm font-bold text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white active:scale-95"
            >
              View All →
            </Link>
          </FadeIn>

          {featured.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {featured.map((item, i) => (
                <FadeIn key={item.id} delay={i * 0.07}>
                  <Link
                    href={`/course/${item.course_id}`}
                    className="group flex flex-col bg-white rounded-2xl border border-[var(--line)] p-5 h-full card-hover"
                  >
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-[var(--accent)] mb-3">
                      {item.courses?.name || "Course"}
                      <span className="opacity-40">•</span>
                      {TYPE_LABELS[item.type]}
                    </span>
                    <h3 className="text-base font-bold text-[var(--ink)] leading-snug group-hover:text-[var(--accent)] flex-1">
                      {item.title}
                    </h3>
                    <p className="mt-4 text-xs font-semibold text-[var(--accent)] flex items-center gap-1">
                      Open PDF <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                    </p>
                  </Link>
                </FadeIn>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[var(--line)] bg-white p-10 text-center text-base text-[var(--muted)]">
              Files will appear here once content is added. <Link href="/course" className="text-[var(--accent)] font-bold">Browse courses →</Link>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-20 bg-[var(--brand)]">
        <FadeIn>
          <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
            <h2 className="text-[32px] sm:text-4xl font-black text-white leading-tight">
              Have Notes That Could Help Others?
            </h2>
            <p className="mt-4 text-base text-white/75 leading-relaxed">
              Sign in with your Google account and contribute your study materials. Help your classmates and build a better academic community.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
              <Link
                href="/contribute"
                className="rounded-full bg-white px-8 py-3.5 text-base font-bold text-[var(--brand)] shadow-lg hover:bg-gray-50 hover:shadow-xl active:scale-95"
              >
                Start Contributing →
              </Link>
              <Link
                href="/course"
                className="rounded-full border-2 border-white/40 px-8 py-3.5 text-base font-bold text-white hover:bg-white/10 active:scale-95"
              >
                Browse First
              </Link>
            </div>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
