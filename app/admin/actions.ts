"use server";

import { isAdminEmail } from "@/lib/config";
import { createServerSupabase } from "@/lib/supabase/server";
import type { ResourceType } from "@/lib/types";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const supabase = await createServerSupabase();
  if (!supabase) {
    return { error: "Supabase is not configured.", supabase: null, user: null };
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Please sign in first.", supabase, user: null };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .maybeSingle();

  if (!isAdminEmail(user.email) && !profile?.is_admin) {
    return { error: "Only the admin can do this.", supabase, user };
  }
  if (!profile?.is_admin) {
    return {
      error:
        "Your Gmail matches the admin setting, but the database has not marked you as admin yet. Run supabase/schema.sql once (with your Gmail in site_config), then sign out and sign in again.",
      supabase,
      user,
    };
  }
  return { error: null, supabase, user };
}

export async function approveRequest(requestId: string) {
  const { error, supabase } = await requireAdmin();
  if (error || !supabase) return { error: error || "Not ready." };

  const { data: request, error: loadError } = await supabase
    .from("contribution_requests")
    .select("*")
    .eq("id", requestId)
    .single();

  if (loadError || !request) {
    return { error: loadError?.message || "Request not found." };
  }
  if (request.status !== "pending") {
    return { error: "This request was already handled." };
  }

  const { data: file, error: downloadError } = await supabase.storage
    .from("pending")
    .download(request.file_path);

  if (downloadError || !file) {
    return { error: downloadError?.message || "Could not read the uploaded file." };
  }

  const publicPath = `${request.course_id}/${crypto.randomUUID()}.pdf`;
  const { error: uploadError } = await supabase.storage
    .from("public-notes")
    .upload(publicPath, file, { contentType: "application/pdf", upsert: false });

  if (uploadError) {
    return { error: uploadError.message };
  }

  const { error: insertError } = await supabase.from("resources").insert({
    course_id: request.course_id,
    semester: request.semester,
    type: request.type as ResourceType,
    title: request.title,
    file_path: publicPath,
    featured: false,
  });

  if (insertError) {
    return { error: insertError.message };
  }

  const { error: updateError } = await supabase
    .from("contribution_requests")
    .update({ status: "approved" })
    .eq("id", requestId);

  if (updateError) {
    return { error: updateError.message };
  }

  await supabase.storage.from("pending").remove([request.file_path]);

  revalidatePath("/admin");
  revalidatePath("/course");
  revalidatePath("/");
  return { error: null };
}

export async function rejectRequest(requestId: string, adminNote: string) {
  const { error, supabase } = await requireAdmin();
  if (error || !supabase) return { error: error || "Not ready." };

  const { data: request, error: loadError } = await supabase
    .from("contribution_requests")
    .select("file_path, status")
    .eq("id", requestId)
    .single();

  if (loadError || !request) {
    return { error: loadError?.message || "Request not found." };
  }

  const { error: updateError } = await supabase
    .from("contribution_requests")
    .update({
      status: "rejected",
      admin_note: adminNote.trim() || "Not a fit for this course yet.",
    })
    .eq("id", requestId);

  if (updateError) {
    return { error: updateError.message };
  }

  if (request.file_path) {
    await supabase.storage.from("pending").remove([request.file_path]);
  }

  revalidatePath("/admin");
  return { error: null };
}
