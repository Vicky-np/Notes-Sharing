export const RESOURCE_TYPES = [
  "syllabus",
  "notes",
  "past_question",
  "other",
] as const;

export type ResourceType = (typeof RESOURCE_TYPES)[number];

export type Course = {
  id: string;
  name: string;
  slug: string;
  description: string;
  sort_order: number;
};

export type Resource = {
  id: string;
  course_id: string;
  semester?: string | null;
  type: ResourceType;
  title: string;
  file_path: string | null;
  file_url: string | null;
  featured: boolean;
  created_at: string;
  courses?: Pick<Course, "id" | "name" | "slug"> | null;
};

export type ContributionStatus = "pending" | "approved" | "rejected";

export type ContributionRequest = {
  id: string;
  user_id: string;
  course_id: string;
  semester?: string | null;
  type: ResourceType;
  title: string;
  message: string | null;
  file_path: string;
  status: ContributionStatus;
  admin_note: string | null;
  created_at: string;
  courses?: Pick<Course, "id" | "name"> | null;
  profiles?: { email: string | null; full_name: string | null } | null;
};

export const TYPE_LABELS: Record<ResourceType, string> = {
  syllabus: "Syllabus",
  notes: "Notes",
  past_question: "Past questions",
  other: "Other",
};
