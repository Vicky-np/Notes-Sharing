import { CourseCard } from "@/components/CourseCard";
import { FadeIn } from "@/components/FadeIn";
import { getCourses } from "@/lib/data";

export default async function CoursePage() {
  const courses = await getCourses();

  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <FadeIn>
        <h1 className="text-[32px] font-bold text-[var(--ink)]">Courses</h1>
        <p className="mt-3 max-w-2xl text-base text-[var(--muted)] leading-relaxed">
          Pick a course. You will find syllabus, notes, past questions, and
          anything else that has been approved.
        </p>
      </FadeIn>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course, index) => (
          <FadeIn key={course.id} delay={index * 0.04}>
            <CourseCard course={course} index={index} />
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
