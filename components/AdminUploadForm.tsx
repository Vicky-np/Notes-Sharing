"use client";

import { FormEvent, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { RESOURCE_TYPES, TYPE_LABELS, type Course } from "@/lib/types";
import { useRouter } from "next/navigation";

export function AdminUploadForm({ courses }: { courses: Course[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setProgress(0);

    const supabase = createBrowserSupabase();
    if (!supabase) {
      setError("Supabase is not connected. Add your keys to .env.local first.");
      return;
    }

    const form = e.currentTarget;
    const data = new FormData(form);
    const courseId = String(data.get("course_id") || "");
    const semester = String(data.get("semester") || "").trim();
    const type = String(data.get("type") || "");
    const title = String(data.get("title") || "").trim();
    const fileInput = data.get("file") as File | null;

    if (!courseId || !semester || !type || !title || !fileInput || fileInput.size === 0) {
      setError("Please fill every field and attach a PDF.");
      return;
    }
    if (!fileInput.name.toLowerCase().endsWith(".pdf") && fileInput.type !== "application/pdf") {
      setError("Only PDF files are accepted.");
      return;
    }
    if (fileInput.size > 25 * 1024 * 1024) {
      setError("PDF must be under 25 MB.");
      return;
    }

    setBusy(true);
    setProgress(20);

    // Upload directly to public-notes bucket
    const filePath = `${courseId}/${crypto.randomUUID()}.pdf`;
    const { error: uploadError } = await supabase.storage
      .from("public-notes")
      .upload(filePath, fileInput, { contentType: "application/pdf" });

    if (uploadError) {
      setBusy(false);
      setError(`Upload failed: ${uploadError.message}`);
      return;
    }

    setProgress(70);

    // Insert into resources table directly
    const { error: insertError } = await supabase.from("resources").insert({
      course_id: courseId,
      semester,
      type,
      title,
      file_path: filePath,
      featured: data.get("featured") === "on",
    });

    setBusy(false);
    setProgress(100);

    if (insertError) {
      setError(`Database error: ${insertError.message}`);
      return;
    }

    setSuccess(`✅ "${title}" uploaded and published successfully!`);
    form.reset();
    router.refresh();
  }

  const inputClass =
    "w-full rounded-xl border border-[var(--line)] bg-white px-4 py-3 text-sm text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-shadow";
  const labelClass = "block text-sm font-bold text-[var(--ink)] mb-1.5";

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5 rounded-2xl border border-[var(--line)] bg-white p-6 sm:p-8 shadow-sm"
    >
      {/* Course */}
      <div>
        <label className={labelClass}>Course <span className="text-red-500">*</span></label>
        <select name="course_id" required className={inputClass}>
          <option value="">Select a course...</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Semester */}
      <div>
        <label className={labelClass}>Semester / Year <span className="text-red-500">*</span></label>
        <input
          name="semester"
          required
          placeholder='e.g. "Semester 1" or "Year 2" or "All Semesters"'
          className={inputClass}
        />
        <p className="text-xs text-[var(--muted)] mt-1">This is how it will be grouped on the course page.</p>
      </div>

      {/* Type */}
      <div>
        <label className={labelClass}>Content Type <span className="text-red-500">*</span></label>
        <select name="type" required className={inputClass}>
          {RESOURCE_TYPES.map((t) => (
            <option key={t} value={t}>{TYPE_LABELS[t]}</option>
          ))}
        </select>
      </div>

      {/* Title */}
      <div>
        <label className={labelClass}>File Title <span className="text-red-500">*</span></label>
        <input
          name="title"
          required
          maxLength={120}
          placeholder='e.g. "Unit 3 Notes — Thermodynamics" or "Final Exam 2023"'
          className={inputClass}
        />
      </div>

      {/* PDF file */}
      <div>
        <label className={labelClass}>PDF File <span className="text-red-500">*</span></label>
        <div className="rounded-xl border-2 border-dashed border-[var(--line)] bg-[var(--mist)] p-6 text-center hover:border-[var(--accent)] transition-colors">
          <input
            name="file"
            type="file"
            accept="application/pdf,.pdf"
            required
            className="w-full text-sm text-[var(--muted)] file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[var(--accent)] file:text-white hover:file:bg-[var(--accent-hover)]"
          />
          <p className="text-xs text-[var(--muted)] mt-2">Maximum 25 MB · PDF only</p>
        </div>
      </div>

      {/* Featured toggle */}
      <div className="flex items-center gap-3 rounded-xl border border-[var(--line)] bg-[var(--mist)] px-4 py-3">
        <input
          id="featured"
          name="featured"
          type="checkbox"
          className="h-4 w-4 rounded accent-[var(--accent)]"
        />
        <label htmlFor="featured" className="text-sm font-semibold text-[var(--ink)] cursor-pointer">
          Show on Home page (Featured)
        </label>
      </div>

      {/* Progress bar */}
      {busy && (
        <div className="h-2 w-full rounded-full bg-[var(--line)] overflow-hidden">
          <div
            className="h-full bg-[var(--accent)] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Messages */}
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm font-medium text-green-700">
          {success}
        </div>
      )}

      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-full bg-[var(--accent)] px-6 py-3.5 text-sm font-black text-white shadow hover:bg-[var(--accent-hover)] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
      >
        {busy ? `Uploading… ${progress}%` : "Upload & Publish Now"}
      </button>
    </form>
  );
}
