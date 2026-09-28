import { AdminQueue } from "@/components/AdminQueue";
import { FadeIn } from "@/components/FadeIn";
import { GoogleSignIn } from "@/components/GoogleSignIn";
import { isAdminEmail, isSupabaseConfigured } from "@/lib/config";
import { createServerSupabase } from "@/lib/supabase/server";
import type { ContributionRequest } from "@/lib/types";

export default async function AdminPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-14">
        <h1 className="text-[32px] font-bold text-[var(--ink)]">Admin</h1>
        <p className="mt-4 text-base text-[var(--muted)]">
          Connect Supabase in <code className="font-bold text-[var(--ink)]">.env.local</code> to review contribution
          requests here.
        </p>
      </div>
    );
  }

  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  if (!user) {
    return (
      <div className="mx-auto max-w-xl px-4 py-14 text-center">
        <h1 className="text-[32px] font-bold text-[var(--ink)]">Admin</h1>
        <p className="mt-4 mb-8 text-base text-[var(--muted)]">
          Sign in with the Gmail listed in <code className="font-bold text-[var(--ink)]">NEXT_PUBLIC_ADMIN_EMAIL</code>.
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
      <div className="mx-auto max-w-xl px-4 py-14">
        <h1 className="text-[32px] font-bold text-[var(--ink)]">Admin</h1>
        <p className="mt-4 text-base text-[var(--muted)]">
          This page is only for the site owner. You are signed in as <span className="font-bold text-[var(--ink)]">{user.email}</span>.
        </p>
      </div>
    );
  }

  const { data: rows } = await supabase!
    .from("contribution_requests")
    .select("*, courses(id, name)")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  const requests = (rows ?? []) as ContributionRequest[];
  const userIds = [...new Set(requests.map((row) => row.user_id))];
  const { data: profiles } = userIds.length
    ? await supabase!.from("profiles").select("id, email, full_name").in("id", userIds)
    : { data: [] };

  const withPeople = requests.map((row) => ({
    ...row,
    profiles:
      profiles?.find((person) => person.id === row.user_id) ?? row.profiles,
  }));

  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <FadeIn>
        <h1 className="text-[32px] font-bold text-[var(--ink)]">Admin</h1>
        <p className="mt-3 text-base text-[var(--muted)] leading-relaxed">
          Approve a file to publish it on the matching course page. Reject if it
          does not belong.
        </p>
      </FadeIn>
      <div className="mt-8">
        <AdminQueue requests={withPeople} />
      </div>
    </div>
  );
}
