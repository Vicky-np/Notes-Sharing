import { isSupabaseConfigured } from "@/lib/config";
import { DEMO_COURSES, DEMO_RESOURCES } from "@/lib/demo-data";
import { createServerSupabase } from "@/lib/supabase/server";
import type { Course, Resource } from "@/lib/types";

export async function getCourses(): Promise<Course[]> {
  if (!isSupabaseConfigured()) return DEMO_COURSES;
  const supabase = await createServerSupabase();
  if (!supabase) return DEMO_COURSES;
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .order("sort_order");
  if (error || !data?.length) return DEMO_COURSES;
  return data;
}

export async function getCourse(id: string): Promise<Course | null> {
  const courses = await getCourses();
  return courses.find((course) => course.id === id || course.slug === id) ?? null;
}

export async function getResources(courseId: string): Promise<Resource[]> {
  if (!isSupabaseConfigured()) {
    return DEMO_RESOURCES.filter((item) => item.course_id === courseId);
  }
  const supabase = await createServerSupabase();
  if (!supabase) {
    return DEMO_RESOURCES.filter((item) => item.course_id === courseId);
  }
  const { data, error } = await supabase
    .from("resources")
    .select("*")
    .eq("course_id", courseId)
    .order("created_at", { ascending: false });
  if (error) {
    return DEMO_RESOURCES.filter((item) => item.course_id === courseId);
  }
  return data ?? [];
}

export async function getFeaturedResources(): Promise<Resource[]> {
  if (!isSupabaseConfigured()) {
    return DEMO_RESOURCES.filter((item) => item.featured).slice(0, 4);
  }
  const supabase = await createServerSupabase();
  if (!supabase) {
    return DEMO_RESOURCES.filter((item) => item.featured).slice(0, 4);
  }
  const { data, error } = await supabase
    .from("resources")
    .select("*, courses(id, name, slug)")
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(4);
  if (error || !data?.length) {
    return DEMO_RESOURCES.filter((item) => item.featured).slice(0, 4);
  }
  return data;
}
