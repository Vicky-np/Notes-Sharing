import { createBrowserSupabase } from "@/lib/supabase/client";
import type { Resource } from "@/lib/types";

export function publicNotesUrl(filePath: string) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return null;
  return `${base}/storage/v1/object/public/public-notes/${filePath}`;
}

export function getResourceUrl(resource: Resource) {
  if (resource.file_url) return resource.file_url;
  if (!resource.file_path) return null;
  return publicNotesUrl(resource.file_path);
}

export async function getPendingSignedUrl(filePath: string) {
  const supabase = createBrowserSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase.storage
    .from("pending")
    .createSignedUrl(filePath, 60 * 10);
  if (error) return null;
  return data.signedUrl;
}
