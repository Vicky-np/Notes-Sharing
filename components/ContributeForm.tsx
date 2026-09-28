"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { RESOURCE_TYPES, TYPE_LABELS, type Course } from "@/lib/types";

export function ContributeForm({
  courses,
  userId,
}: {
  courses: Course[];
  userId: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setStatus(null);
    const supabase = createBrowserSupabase();
    if (!supabase) {
      setError("Supabase is not connected yet. Add keys in .env.local first.");
      return;
    }

    const form = event.currentTarget;
    const data = new FormData(form);
    const courseId = String(data.get("course_id") || "");
    const semester = String(data.get("semester") || "").trim();
    const type = String(data.get("type") || "");
    const title = String(data.get("title") || "").trim();
    const message = String(data.get("message") || "").trim();
    const file = data.get("file") as File | null;

    if (!courseId || !semester || !type || !title || !file || file.size === 0) {
      setError("Please fill every required field and attach a PDF.");
      return;
    }
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setError("Please upload a PDF file.");
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setError("Please keep the PDF under 15 MB.");
      return;
    }

    setBusy(true);
    const path = `${userId}/${crypto.randomUUID()}.pdf`;
    const { error: uploadError } = await supabase.storage
      .from("pending")
      .upload(path, file, { contentType: "application/pdf" });

    if (uploadError) {
      setBusy(false);
      setError(uploadError.message);
      return;
    }

    const { error: insertError } = await supabase.from("contribution_requests").insert({
      user_id: userId,
      course_id: courseId,
      semester: semester,
      type,
      title,
      message: message || null,
      file_path: path,
      status: "pending",
    });

    setBusy(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }

    form.reset();
    setStatus("Request sent. We will review it and list it if it is a good fit.");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-2xl border border-[var(--line)] bg-white p-6 shadow-sm">
      <label className="block space-y-2 text-sm">
        <span className="text-[var(--muted)]">Course</span>
        <select
          name="course_id"
          required
          className="w-full rounded-xl border border-[var(--line)] bg-[var(--paper)] px-3 py-2"
        >
          <option value="">Choose a course</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>
      </label>
      <label className="block space-y-2 text-sm">
        <span className="text-[var(--muted)]">Semester / Year</span>
        <input
          name="semester"
          required
          placeholder='e.g. "Semester 1" or "Year 2"'
          className="w-full rounded-xl border border-[var(--line)] bg-[var(--paper)] px-3 py-2 focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] outline-none transition-shadow"
        />
      </label>
      <label className="block space-y-2 text-sm">
        <span className="text-[var(--muted)]">Type</span>
        <select
          name="type"
          required
          className="w-full rounded-xl border border-[var(--line)] bg-[var(--paper)] px-3 py-2"
        >
          {RESOURCE_TYPES.map((type) => (
            <option key={type} value={type}>
              {TYPE_LABELS[type]}
            </option>
          ))}
        </select>
      </label>
      <label className="block space-y-2 text-sm">
        <span className="text-[var(--muted)]">Title</span>
        <input
          name="title"
          required
          maxLength={120}
          placeholder="e.g. Unit 3 notes — optics"
          className="w-full rounded-xl border border-[var(--line)] bg-[var(--paper)] px-3 py-2"
        />
      </label>
      <label className="block space-y-2 text-sm">
        <span className="text-[var(--muted)]">Message (optional)</span>
        <textarea
          name="message"
          rows={3}
          placeholder="Anything the reviewer should know"
          className="w-full rounded-xl border border-[var(--line)] bg-[var(--paper)] px-3 py-2"
        />
      </label>
      <label className="block space-y-2 text-sm">
        <span className="text-[var(--muted)]">PDF file</span>
        <input
          name="file"
          type="file"
          accept="application/pdf,.pdf"
          required
          className="w-full text-sm"
        />
      </label>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      {status ? <p className="text-sm text-emerald-800">{status}</p> : null}
      <button
        type="submit"
        disabled={busy}
        className="rounded-full bg-[var(--ink)] px-5 py-2.5 text-sm text-[var(--paper)] disabled:opacity-60"
      >
        {busy ? "Sending…" : "Send request"}
      </button>
    </form>
  );
}
