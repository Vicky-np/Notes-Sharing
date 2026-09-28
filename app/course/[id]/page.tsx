import { notFound } from "next/navigation";
import { CourseMaterials } from "@/components/CourseMaterials";
import { FadeIn } from "@/components/FadeIn";
import { getCourse, getResources } from "@/lib/data";

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
    <div className="mx-auto max-w-6xl px-4 py-14">
      <FadeIn>
        <p className="text-sm font-bold uppercase tracking-wider text-[var(--accent)] mb-2">Course</p>
        <h1 className="text-[32px] font-bold text-[var(--ink)]">{course.name}</h1>
        <p className="mt-3 max-w-2xl text-base text-[var(--muted)] leading-relaxed">{course.description}</p>
      </FadeIn>
      <FadeIn delay={0.1} className="mt-10">
        <CourseMaterials resources={resources} />
      </FadeIn>
    </div>
  );
}
