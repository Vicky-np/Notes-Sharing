export function isSupabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || "";
  if (!url || !key) return false;
  if (url.includes("YOUR-PROJECT")) return false;
  if (key === "your-anon-key") return false;
  return true;
}

export function getCollegeName() {
  return process.env.NEXT_PUBLIC_COLLEGE_NAME?.trim() || "Campus Notes";
}

export function getAdminEmail() {
  return process.env.NEXT_PUBLIC_ADMIN_EMAIL?.trim().toLowerCase() || "";
}

export function isAdminEmail(email: string | null | undefined) {
  const admin = getAdminEmail();
  if (!admin || !email) return false;
  return email.toLowerCase() === admin;
}
