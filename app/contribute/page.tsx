import { ContributeForm } from "@/components/ContributeForm";
import { FadeIn } from "@/components/FadeIn";
import { GoogleSignIn } from "@/components/GoogleSignIn";
import { isSupabaseConfigured } from "@/lib/config";
import { getCourses } from "@/lib/data";
import { createServerSupabase } from "@/lib/supabase/server";

export default async function ContributePage() {
  const courses = await getCourses();
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  return (
    <div className="mx-auto max-w-xl px-4 py-14">
      <FadeIn>
        <h1 className="text-[32px] font-bold text-[var(--ink)]">Contribute</h1>
        <p className="mt-3 text-base text-[var(--muted)] leading-relaxed">
          Share a syllabus, notes, past paper, or other useful PDF. Sign in with
          Google, fill the form, and wait for approval. Nothing goes public
          until it is reviewed.
        </p>
      </FadeIn>

      <FadeIn delay={0.08} className="mt-8">
        {!isSupabaseConfigured() ? (
          <p className="rounded-2xl border border-[var(--line)] bg-[var(--mist)] p-6 text-base leading-relaxed text-[var(--muted)]">
            Google sign-in will work after you add your Supabase keys to{" "}
            <code className="font-bold text-[var(--ink)]">.env.local</code>. Until then you can still browse courses and
            sample PDFs.
          </p>
        ) : !user ? (
          <div className="rounded-2xl border border-[var(--line)] bg-white p-8 text-center shadow-sm">
            <p className="mb-6 text-base text-[var(--muted)]">
              Use your college Google account. We only need it so we know who
              sent the file.
            </p>
            <GoogleSignIn />
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm font-medium text-[var(--muted)]">Signed in as <span className="text-[var(--ink)]">{user.email}</span></p>
            <ContributeForm courses={courses} userId={user.id} />
          </div>
        )}
      </FadeIn>
    </div>
  );
}
