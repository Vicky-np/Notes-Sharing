"use client";

export function PdfViewer({
  url,
  title,
}: {
  url: string;
  title: string;
}) {
  return (
    <div className="flex flex-col h-full overflow-hidden rounded-2xl border border-[var(--line)] bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-[var(--line)] px-4 py-3 bg-[var(--paper)]">
        <p className="truncate text-sm font-medium text-[var(--ink)]">{title}</p>
        <a
          href={url}
          download
          target="_blank"
          rel="noreferrer"
          className="shrink-0 rounded-full bg-[var(--ink)] px-4 py-1.5 text-xs font-semibold tracking-wide text-white transition hover:bg-[var(--accent)]"
        >
          Download PDF
        </a>
      </div>
      <iframe
        title={title}
        src={`${url}#view=FitH`}
        className="flex-1 w-full bg-[var(--mist)]"
      />
    </div>
  );
}
