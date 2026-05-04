import type { Role } from "@prisma/client";

/**
 * Permission helpers — single source of truth for role-based access checks.
 *
 * Hierarchy (top has most authority):
 *   ADMIN / DEVELOPER         → can do anything
 *   CHIEF_PROGRAM_COORDINATOR → owns the program across all cohorts
 *   COHORT_COORDINATOR        → runs day-to-day for their cohort
 *   INSTRUCTOR                → teaches, grades, runs live sessions
 *   STUDENT                   → enrolled learner
 */

/** Anyone with backstage access (i.e. /admin should be reachable). */
export const ADMIN_ROLES: Role[] = [
  "INSTRUCTOR",
  "COHORT_COORDINATOR",
  "CHIEF_PROGRAM_COORDINATOR",
  "ADMIN",
  "DEVELOPER",
];

/**
 * Roles that can upload / edit course content.
 * Day-to-day this is INSTRUCTOR + CHIEF_PROGRAM_COORDINATOR.
 * ADMIN is included as a superuser fallback for emergencies — they typically
 * shouldn't be the one writing curriculum.
 * DEVELOPER and COHORT_COORDINATOR can NOT edit content.
 */
export const CURRICULUM_EDIT_ROLES: Role[] = [
  "INSTRUCTOR",
  "CHIEF_PROGRAM_COORDINATOR",
  "ADMIN",
];

/** Roles that can issue or revoke certificates. */
export const CERTIFICATE_ROLES: Role[] = [
  "CHIEF_PROGRAM_COORDINATOR",
  "ADMIN",
  "DEVELOPER",
];

/** Roles that can access /admin/developer (system + integrations). */
export const DEVELOPER_ROLES: Role[] = ["ADMIN", "DEVELOPER"];

/** Roles that can see analytics & financial data. */
export const FINANCE_ROLES: Role[] = [
  "CHIEF_PROGRAM_COORDINATOR",
  "ADMIN",
  "DEVELOPER",
];

export function hasRole(userRole: Role | undefined | null, allowed: Role[]) {
  return !!userRole && allowed.includes(userRole);
}

/** Friendly labels for role badges in the admin UI. */
export const ROLE_LABEL: Record<Role, string> = {
  STUDENT: "Student",
  INSTRUCTOR: "Instructor",
  COHORT_COORDINATOR: "Cohort Coordinator",
  CHIEF_PROGRAM_COORDINATOR: "Chief Program Coordinator",
  ADMIN: "Admin",
  DEVELOPER: "Developer",
};
