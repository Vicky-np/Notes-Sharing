import { CourseCard } from "@/components/CourseCard";
import { FadeIn } from "@/components/FadeIn";
import { getCourses } from "@/lib/data";

export default async function CoursePage() {
  const courses = await getCourses();

  return (
    <div className="mx-auto max-w-6xl w-full px-4 sm:px-6 py-12 sm:py-16">
      <FadeIn>
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent)] mb-2">Library</p>
        <h1 className="text-[32px] sm:text-4xl font-black text-[var(--ink)]">All Courses</h1>
        <p className="mt-3 max-w-2xl text-base text-[var(--muted)] leading-relaxed">
          Pick a course below. You will find syllabus, notes, past questions, and
          other study materials organized by semester.
        </p>
      </FadeIn>
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {courses.map((course, index) => (
          <FadeIn key={course.id} delay={index * 0.05}>
            <CourseCard course={course} index={index} />
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
