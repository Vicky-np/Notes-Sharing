import { notFound } from "next/navigation";
import { CourseMaterials } from "@/components/CourseMaterials";
import { FadeIn } from "@/components/FadeIn";
import { getCourse, getResources } from "@/lib/data";
import Link from "next/link";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = await getCourse(id);
  if (!course) notFound();
  const resources = await getResources(course.id);

  return (
    <div className="mx-auto max-w-6xl w-full px-4 sm:px-6 py-12 sm:py-16">
      <FadeIn>
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-[var(--muted)] mb-6">
          <Link href="/course" className="hover:text-[var(--accent)] font-medium transition-colors">Courses</Link>
          <span>/</span>
          <span className="font-bold text-[var(--ink)]">{course.name}</span>
        </nav>
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent)] mb-2">Course</p>
        <h1 className="text-[32px] sm:text-4xl font-black text-[var(--ink)]">{course.name}</h1>
        <p className="mt-3 max-w-2xl text-base text-[var(--muted)] leading-relaxed">{course.description}</p>
      </FadeIn>

      <FadeIn delay={0.1} className="mt-10">
        <CourseMaterials resources={resources} />
      </FadeIn>
    </div>
  );
}
