"use client";

import { useMemo, useState } from "react";
import { getResourceUrl } from "@/lib/resource-url";
import { TYPE_LABELS, type Resource, type ResourceType } from "@/lib/types";
import { PdfViewer } from "@/components/PdfViewer";

const typeTabs: ResourceType[] = ["syllabus", "notes", "past_question", "other"];

export function CourseMaterials({ resources }: { resources: Resource[] }) {
  const semesters = useMemo(() => {
    const s = Array.from(new Set(resources.map((r) => r.semester || "General")));
    return s.sort((a, b) => a.localeCompare(b));
  }, [resources]);

  const [activeSemester, setActiveSemester] = useState<string>(semesters[0] || "General");
  const [showPdf, setShowPdf] = useState(false); // mobile: toggle between list and pdf

  const semesterResources = useMemo(
    () => resources.filter((r) => (r.semester || "General") === activeSemester),
    [resources, activeSemester],
  );

  const availableTypes = typeTabs.filter((t) => semesterResources.some((item) => item.type === t));
  const [activeType, setActiveType] = useState<ResourceType>(availableTypes[0] ?? "notes");

  const items = useMemo(
    () => semesterResources.filter((item) => item.type === activeType),
    [semesterResources, activeType],
  );

  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null);
  const active = items.find((item) => item.id === activeId) ?? items[0];
  const url = active ? getResourceUrl(active) : null;

  if (!resources.length) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--line)] bg-white p-10 sm:p-14 text-center text-base text-[var(--muted)]">
        <div className="text-4xl mb-3">📭</div>
        <p className="font-semibold">Nothing here yet</p>
        <p className="text-sm mt-1">Check back after materials are uploaded and approved.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Semester/Year Tabs ── */}
      {semesters.length > 1 && (
        <div className="flex flex-wrap gap-2 pb-4 border-b border-[var(--line)]">
          <span className="text-sm font-bold text-[var(--ink)] flex items-center mr-1 shrink-0">
            Period:
          </span>
          {semesters.map((sem) => (
            <button
              key={sem}
              type="button"
              onClick={() => {
                setActiveSemester(sem);
                setShowPdf(false);
              }}
              className={`rounded-full px-4 py-1.5 text-sm font-bold transition-all ${
                activeSemester === sem
                  ? "bg-[var(--accent)] text-white shadow-sm"
                  : "bg-white text-[var(--muted)] ring-1 ring-inset ring-[var(--line)] hover:ring-[var(--accent)] hover:text-[var(--accent)]"
              }`}
            >
              {sem}
            </button>
          ))}
        </div>
      )}

      {/* ── Resource Type Tabs ── */}
      <div className="flex flex-wrap gap-2">
        {typeTabs.map((t) => {
          const count = semesterResources.filter((r) => r.type === t).length;
          if (!count) return null;
          return (
            <button
              key={t}
              type="button"
              onClick={() => {
                setActiveType(t);
                setShowPdf(false);
              }}
              className={`rounded-full px-4 py-2 text-sm font-bold transition-all ${
                activeType === t
                  ? "bg-[var(--ink)] text-white"
                  : "bg-white text-[var(--muted)] ring-1 ring-[var(--line)] hover:text-[var(--ink)] hover:ring-[var(--ink)]"
              }`}
            >
              {TYPE_LABELS[t]}{" "}
              <span className={`text-xs ${activeType === t ? "opacity-60" : "opacity-50"}`}>({count})</span>
            </button>
          );
        })}
      </div>

      {/* ── Content ── */}
      {items.length > 0 ? (
        <>
          {/* Mobile: back button when PDF is open */}
          {showPdf && (
            <button
              type="button"
              onClick={() => setShowPdf(false)}
              className="md:hidden flex items-center gap-2 text-sm font-bold text-[var(--accent)] mb-2"
            >
              ← Back to list
            </button>
          )}

          {/* Desktop: side-by-side | Mobile: stacked with toggle */}
          <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-4 md:gap-6">
            {/* File list — hidden on mobile when PDF open */}
            <ul className={`space-y-2 max-h-[70vh] overflow-y-auto pr-1 custom-scrollbar ${showPdf ? "hidden md:block" : "block"}`}>
              {items.map((item) => {
                const isActive = active?.id === item.id;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveId(item.id);
                        setShowPdf(true);
                      }}
                      className={`w-full text-left rounded-xl px-4 py-3.5 transition-all group ${
                        isActive
                          ? "bg-[var(--accent-light)] ring-1 ring-[var(--accent)]"
                          : "bg-white ring-1 ring-[var(--line)] hover:ring-[var(--accent)] hover:bg-[var(--accent-light)]"
                      }`}
                    >
                      <p className={`text-sm font-bold leading-snug ${isActive ? "text-[var(--accent)]" : "text-[var(--ink)]"}`}>
                        {item.title}
                      </p>
                      <p className="text-xs text-[var(--muted)] mt-1">
                        Added {new Date(item.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                      </p>
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* PDF Viewer — on mobile only shown when showPdf=true */}
            <div className={`h-[75vh] min-h-[400px] ${showPdf ? "block" : "hidden md:block"}`}>
              {url && active ? (
                <PdfViewer url={url} title={active.title} />
              ) : (
                <div className="flex h-full items-center justify-center rounded-2xl bg-[var(--mist)] ring-1 ring-[var(--line)] text-base text-[var(--muted)]">
                  <div className="text-center">
                    <div className="text-4xl mb-3">📄</div>
                    <p>Select a file to preview</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="rounded-2xl border border-dashed border-[var(--line)] bg-white p-10 text-center text-base text-[var(--muted)]">
          No {TYPE_LABELS[activeType].toLowerCase()} available for {activeSemester} yet.
        </div>
      )}
    </div>
  );
}
