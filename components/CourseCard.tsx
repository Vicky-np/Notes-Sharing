import Link from "next/link";
import type { Course } from "@/lib/types";

const icons = ["📚", "💻", "📊", "📐", "🔬", "📝", "🧠", "💡"];

export function CourseCard({ course, index }: { course: Course; index: number }) {
  return (
    <Link
      href={`/course/${course.id}`}
      className="group block rounded-3xl border border-[var(--line)] bg-white p-8 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[var(--accent)] hover:shadow-lg"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--mist)] text-2xl mb-6 group-hover:scale-110 transition-transform group-hover:bg-[var(--accent)] group-hover:text-white">
        {icons[index % icons.length]}
      </div>
      <h2 className="text-2xl font-bold text-[var(--ink)]">{course.name}</h2>
      <p className="mt-3 text-base leading-relaxed text-[var(--muted)] line-clamp-2">{course.description}</p>
      <div className="mt-8 flex items-center text-base font-bold text-[var(--accent)] group-hover:text-[var(--accent-hover)] transition-colors">
        View course materials <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
      </div>
    </Link>
  );
}
