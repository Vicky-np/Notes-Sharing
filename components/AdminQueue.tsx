"use client";

import { useState } from "react";
import { approveRequest, rejectRequest } from "@/app/admin/actions";
import { getPendingSignedUrl } from "@/lib/resource-url";
import { TYPE_LABELS, type ContributionRequest } from "@/lib/types";

export function AdminQueue({ requests }: { requests: ContributionRequest[] }) {
  const [note, setNote] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  async function onApprove(id: string) {
    setBusy(id);
    setMessage(null);
    const result = await approveRequest(id);
    setBusy(null);
    setMessage(result.error || "Approved. It now appears on the course page.");
  }

  async function onReject(id: string) {
    setBusy(id);
    setMessage(null);
    const result = await rejectRequest(id, note[id] || "");
    setBusy(null);
    setMessage(result.error || "Rejected.");
  }

  async function preview(path: string) {
    const url = await getPendingSignedUrl(path);
    if (url) window.open(url, "_blank");
  }

  if (!requests.length) {
    return (
      <p className="rounded-2xl border border-dashed border-[var(--line)] bg-white p-10 text-center text-base text-[var(--muted)]">
        No pending requests. New contributions will show up here.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {message ? <p className="text-sm font-bold text-[var(--accent)]">{message}</p> : null}
      {requests.map((item) => (
        <article
          key={item.id}
          className="rounded-2xl border border-[var(--line)] bg-white p-6 shadow-sm"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[var(--accent)] flex items-center gap-2">
                {item.courses?.name} <span className="w-1 h-1 rounded-full bg-[var(--line)]" /> {item.semester || "General"} <span className="w-1 h-1 rounded-full bg-[var(--line)]" /> {TYPE_LABELS[item.type]}
              </p>
              <h2 className="mt-2 text-xl font-bold text-[var(--ink)]">{item.title}</h2>
              <p className="mt-1 text-sm font-medium text-[var(--muted)]">
                From {item.profiles?.full_name || item.profiles?.email || "a student"}
              </p>
              {item.message ? (
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{item.message}</p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => preview(item.file_path)}
              className="text-sm font-bold text-[var(--brand)] hover:text-[var(--accent-hover)] underline transition-colors"
            >
              Preview PDF
            </button>
          </div>
          <textarea
            placeholder="Optional note if you reject"
            value={note[item.id] || ""}
            onChange={(event) =>
              setNote((current) => ({ ...current, [item.id]: event.target.value }))
            }
            className="mt-6 w-full rounded-xl border border-[var(--line)] bg-[var(--paper)] px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--accent)] focus:border-[var(--accent)]"
            rows={2}
          />
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              disabled={busy === item.id}
              onClick={() => onApprove(item.id)}
              className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-emerald-700 disabled:opacity-60"
            >
              Approve
            </button>
            <button
              type="button"
              disabled={busy === item.id}
              onClick={() => onReject(item.id)}
              className="rounded-full bg-red-600 px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
            >
              Reject
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
