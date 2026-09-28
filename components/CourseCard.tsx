import Link from "next/link";
import type { Course } from "@/lib/types";

const icons = ["📚", "💻", "📊", "📐", "🔬", "📝", "🧠", "💡"];
const colors = [
  "bg-blue-50 text-blue-600",
  "bg-purple-50 text-purple-600",
  "bg-green-50 text-green-600",
  "bg-orange-50 text-orange-600",
  "bg-red-50 text-red-600",
  "bg-teal-50 text-teal-600",
  "bg-indigo-50 text-indigo-600",
  "bg-pink-50 text-pink-600",
];

export function CourseCard({ course, index }: { course: Course; index: number }) {
  return (
    <Link
      href={`/course/${course.id}`}
      className="group flex flex-col rounded-2xl border border-[var(--line)] bg-white p-6 sm:p-7 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[var(--accent)] hover:shadow-lg min-h-[180px]"
    >
      <div className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl mb-5 transition-transform group-hover:scale-110 ${colors[index % colors.length]}`}>
        {icons[index % icons.length]}
      </div>
      <h2 className="text-xl font-bold text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors">
        {course.name}
      </h2>
      <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed line-clamp-2 flex-1">
        {course.description}
      </p>
      <div className="mt-5 flex items-center text-sm font-bold text-[var(--accent)]">
        View materials{" "}
        <span className="ml-1.5 group-hover:translate-x-1 transition-transform inline-block">→</span>
      </div>
    </Link>
  );
}
