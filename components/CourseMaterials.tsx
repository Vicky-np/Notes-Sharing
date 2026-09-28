"use client";

import { useMemo, useState } from "react";
import { getResourceUrl } from "@/lib/resource-url";
import { TYPE_LABELS, type Resource, type ResourceType } from "@/lib/types";
import { PdfViewer } from "@/components/PdfViewer";

const typeTabs: ResourceType[] = ["syllabus", "notes", "past_question", "other"];

export function CourseMaterials({ resources }: { resources: Resource[] }) {
  // Extract unique semesters from resources (defaulting null/undefined to "General")
  const semesters = useMemo(() => {
    const s = Array.from(new Set(resources.map(r => r.semester || "General")));
    return s.sort((a, b) => a.localeCompare(b));
  }, [resources]);

  const [activeSemester, setActiveSemester] = useState<string>(semesters[0] || "General");

  // Filter resources by active semester
  const semesterResources = useMemo(
    () => resources.filter(r => (r.semester || "General") === activeSemester),
    [resources, activeSemester]
  );

  const availableTypes = typeTabs.filter((t) => semesterResources.some((item) => item.type === t));
  const [activeType, setActiveType] = useState<ResourceType>(availableTypes[0] ?? "notes");

  // Update active type when semester changes if current type is not available
  useMemo(() => {
    if (!availableTypes.includes(activeType) && availableTypes.length > 0) {
      setActiveType(availableTypes[0]);
    }
  }, [activeSemester, availableTypes, activeType]);

  const items = useMemo(
    () => semesterResources.filter((item) => item.type === activeType),
    [semesterResources, activeType],
  );

  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null);
  
  // When items change, update active ID if the old one is no longer in the list
  useMemo(() => {
    if (items.length > 0 && !items.find(i => i.id === activeId)) {
      setActiveId(items[0].id);
    } else if (items.length === 0) {
      setActiveId(null);
    }
  }, [items, activeId]);

  const active = items.find((item) => item.id === activeId) ?? items[0];
  const url = active ? getResourceUrl(active) : null;

  if (!resources.length) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--line)] bg-white p-10 text-center text-[var(--muted)]">
        Nothing listed for this course yet. Check back after someone contributes
        and the admin approves it.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Semester/Year Selector */}
      {semesters.length > 1 && (
        <div className="flex flex-wrap gap-2 pb-4 border-b border-[var(--line)]">
          <span className="text-sm font-semibold text-[var(--ink)] flex items-center mr-2">Semester / Year:</span>
          {semesters.map((sem) => (
            <button
              key={sem}
              type="button"
              onClick={() => setActiveSemester(sem)}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition ${
                activeSemester === sem
                  ? "bg-[var(--accent)] text-white shadow-sm"
                  : "bg-white text-[var(--muted)] ring-1 ring-inset ring-[var(--line)] hover:bg-gray-50 hover:text-[var(--ink)]"
              }`}
            >
              {sem}
            </button>
          ))}
        </div>
      )}

      {/* Resource Type Selector */}
      <div className="flex flex-wrap gap-2">
        {typeTabs.map((item) => {
          const count = semesterResources.filter((row) => row.type === item).length;
          if (!count) return null;
          return (
            <button
              key={item}
              type="button"
              onClick={() => setActiveType(item)}
              className={`rounded-full px-4 py-2 text-sm transition ${
                activeType === item
                  ? "bg-[var(--ink)] text-[var(--paper)]"
                  : "bg-white text-[var(--muted)] ring-1 ring-[var(--line)] hover:text-[var(--ink)]"
              }`}
            >
              {TYPE_LABELS[item]} ({count})
            </button>
          );
        })}
      </div>

      {/* Resources List and Viewer */}
      {items.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <ul className="space-y-2 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
            {items.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setActiveId(item.id)}
                  className={`w-full text-left transition group ${
                    active?.id === item.id
                      ? "rounded-xl bg-[var(--mist)] p-4 ring-1 ring-[var(--line)]"
                      : "rounded-xl bg-white p-4 text-[var(--muted)] ring-1 ring-[var(--line)] hover:text-[var(--ink)] hover:bg-gray-50"
                  }`}
                >
                  <p className={`font-medium ${active?.id === item.id ? "text-[var(--ink)]" : ""}`}>
                    {item.title}
                  </p>
                  <p className="mt-1 text-xs opacity-70">
                    Added {new Date(item.created_at).toLocaleDateString()}
                  </p>
                </button>
              </li>
            ))}
          </ul>
          {url && active ? (
            <div className="h-[800px] rounded-2xl overflow-hidden ring-1 ring-[var(--line)] shadow-sm bg-white">
              <PdfViewer url={url} title={active.title} />
            </div>
          ) : (
            <div className="flex h-[400px] items-center justify-center rounded-2xl bg-white ring-1 ring-[var(--line)]">
              <p className="text-[var(--muted)]">No file available for this item.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[var(--line)] bg-white p-10 text-center text-[var(--muted)]">
          No {TYPE_LABELS[activeType].toLowerCase()} available for {activeSemester}.
        </div>
      )}
    </div>
  );
}
