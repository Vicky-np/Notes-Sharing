"use client";

import { createBrowserSupabase } from "@/lib/supabase/client";

export function GoogleSignIn({ next = "/contribute" }: { next?: string }) {
  async function signIn() {
    const supabase = createBrowserSupabase();
    if (!supabase) return;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
  }

  return (
    <button
      type="button"
      onClick={signIn}
      className="rounded-full bg-[var(--ink)] px-6 py-3 text-sm text-[var(--paper)] shadow-sm transition hover:bg-[var(--accent)]"
    >
      Continue with Google
    </button>
  );
}
