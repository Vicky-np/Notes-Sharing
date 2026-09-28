import { FadeIn } from "@/components/FadeIn";
import { GoogleSignIn } from "@/components/GoogleSignIn";
import { AdminUploadForm } from "@/components/AdminUploadForm";
import { isAdminEmail, isSupabaseConfigured } from "@/lib/config";
import { getCourses, getResources } from "@/lib/data";
import { createServerSupabase } from "@/lib/supabase/server";
import { TYPE_LABELS } from "@/lib/types";
import Link from "next/link";

export default async function AdminPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-[32px] font-black text-[var(--ink)]">Admin Panel</h1>
        <div className="mt-6 rounded-2xl border border-[var(--line)] bg-[var(--mist)] p-6">
          <p className="text-base text-[var(--muted)]">
            Supabase is not connected yet. Add your keys to{" "}
            <code className="font-bold text-[var(--ink)] bg-[var(--line)] px-1.5 py-0.5 rounded">.env.local</code>{" "}
            to enable the admin panel.
          </p>
        </div>
      </div>
    );
  }

  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <div className="text-5xl mb-4">🔐</div>
        <h1 className="text-[32px] font-black text-[var(--ink)]">Admin Login</h1>
        <p className="mt-3 mb-8 text-base text-[var(--muted)] leading-relaxed">
          Sign in with the Google account set as <code className="font-bold text-[var(--ink)]">NEXT_PUBLIC_ADMIN_EMAIL</code>.
        </p>
        <GoogleSignIn next="/admin" />
      </div>
    );
  }

  const { data: profile } = await supabase!
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .maybeSingle();

  const allowed = isAdminEmail(user.email) || Boolean(profile?.is_admin);
  if (!allowed) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <div className="text-5xl mb-4">⛔</div>
        <h1 className="text-[32px] font-black text-[var(--ink)]">Access Denied</h1>
        <p className="mt-3 text-base text-[var(--muted)]">
          This page is only for the site owner. You are signed in as{" "}
          <span className="font-bold text-[var(--ink)]">{user.email}</span>.
        </p>
      </div>
    );
  }

  const courses = await getCourses();

  // Load all resources for the resource table
  let allResources: Awaited<ReturnType<typeof getResources>> = [];
  for (const course of courses) {
    const res = await getResources(course.id);
    allResources = allResources.concat(res.map((r) => ({ ...r, courses: { id: course.id, name: course.name, slug: course.slug } })));
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
      {/* Header */}
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent)] mb-1">Admin Panel</p>
            <h1 className="text-[32px] font-black text-[var(--ink)]">Manage Content</h1>
            <p className="text-sm text-[var(--muted)] mt-1">Signed in as <span className="font-bold text-[var(--ink)]">{user.email}</span></p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 border border-green-200 px-3 py-1.5 text-xs font-bold text-green-700">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Admin Active
            </span>
          </div>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10 lg:gap-12">
        {/* Left — Published files */}
        <FadeIn delay={0.05}>
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-[var(--ink)]">Published Files</h2>
              <span className="text-sm font-bold text-[var(--muted)]">{allResources.length} total</span>
            </div>

            {allResources.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[var(--line)] bg-white p-10 text-center text-base text-[var(--muted)]">
                <div className="text-4xl mb-3">📭</div>
                <p>No files uploaded yet.</p>
                <p className="text-sm mt-1">Use the form to upload your first PDF.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {allResources.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-[var(--line)] bg-white px-5 py-4 shadow-sm"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="inline-flex items-center rounded-md bg-[var(--accent-light)] px-2 py-0.5 text-xs font-bold text-[var(--accent)]">
                          {(item as any).courses?.name ?? "Unknown"}
                        </span>
                        <span className="text-xs text-[var(--muted)]">{item.semester || "General"}</span>
                        <span className="text-xs text-[var(--muted)]">· {TYPE_LABELS[item.type]}</span>
                        {item.featured && (
                          <span className="inline-flex items-center rounded-md bg-yellow-50 border border-yellow-200 px-2 py-0.5 text-xs font-bold text-yellow-700">
                            ⭐ Featured
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-bold text-[var(--ink)] truncate">{item.title}</p>
                      <p className="text-xs text-[var(--muted)] mt-0.5">
                        {new Date(item.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        href={`/course/${item.course_id}`}
                        className="text-xs font-bold text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
                      >
                        View →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </FadeIn>

        {/* Right — Upload form */}
        <FadeIn delay={0.1} className="lg:sticky lg:top-24 self-start">
          <div>
            <h2 className="text-xl font-bold text-[var(--ink)] mb-5">Upload New PDF</h2>
            <AdminUploadForm courses={courses} />
            {/* Quick guide */}
            <div className="mt-6 rounded-2xl bg-[var(--mist)] border border-[var(--line)] p-5">
              <h3 className="text-sm font-bold text-[var(--ink)] mb-3">📋 Quick Upload Guide</h3>
              <ol className="space-y-2">
                {[
                  "Select the course the file belongs to",
                  'Enter the semester (e.g. "Semester 1")',
                  "Choose the content type (Notes, Syllabus, etc.)",
                  "Give it a clear, descriptive title",
                  "Choose your PDF from your computer",
                  "Check Featured if it should show on the home page",
                  'Click "Upload & Publish Now" — it goes live instantly!',
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-[var(--muted)]">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-[var(--accent)] text-white text-[10px] font-black flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
