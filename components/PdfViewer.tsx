"use client";

import { useState } from "react";

export function PdfViewer({ url, title }: { url: string; title: string }) {
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  // Google Docs viewer as fallback for cross-origin PDFs
  const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;

  return (
    <div className="flex flex-col h-full min-h-[60vh] overflow-hidden rounded-2xl border border-[var(--line)] bg-white shadow-sm">
      {/* Header bar */}
      <div className="flex items-center justify-between gap-3 border-b border-[var(--line)] px-4 py-3 bg-[var(--mist)] shrink-0">
        <p className="truncate text-sm font-bold text-[var(--ink)] max-w-[60%]">{title}</p>
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-[var(--line)] bg-white px-3 py-1.5 text-xs font-bold text-[var(--accent)] hover:bg-[var(--accent-light)] transition-colors"
          >
            Open in tab ↗
          </a>
          <a
            href={url}
            download
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-[var(--accent)] px-4 py-1.5 text-xs font-bold text-white hover:bg-[var(--accent-hover)] transition-colors"
          >
            Download PDF
          </a>
        </div>
      </div>

      {/* PDF iframe */}
      <div className="relative flex-1">
        {loading && !failed && (
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--mist)] z-10">
            <div className="text-center">
              <div className="w-8 h-8 border-3 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-[var(--muted)]">Loading PDF...</p>
            </div>
          </div>
        )}

        {!failed ? (
          <iframe
            key={url}
            title={title}
            src={`${url}#toolbar=1&navpanes=0&scrollbar=1`}
            className="w-full h-full min-h-[60vh]"
            onLoad={() => setLoading(false)}
            onError={() => { setFailed(true); setLoading(false); }}
            style={{ border: "none" }}
          />
        ) : (
          /* Fallback: Google Docs Viewer */
          <div className="flex flex-col h-full min-h-[60vh]">
            <p className="text-xs text-[var(--muted)] text-center py-2 bg-yellow-50 border-b border-yellow-100">
              Direct embed unavailable — using Google Docs Viewer
            </p>
            <iframe
              key={googleViewerUrl}
              title={title}
              src={googleViewerUrl}
              className="w-full flex-1"
              style={{ border: "none" }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
