import { NextResponse } from "next/server";
import { getServerAuthSession } from "@/lib/auth";
import { CURRICULUM_EDIT_ROLES, hasRole } from "@/lib/permissions";

/**
 * Guards an admin API route. Returns either:
 *   - { ok: true, userId } if the user has curriculum-edit access
 *   - a NextResponse to return immediately (401/403)
 */
export async function requireCurriculumEditor() {
  const session = await getServerAuthSession();
  if (!session?.user?.id) {
    return { ok: false as const, response: NextResponse.json({ error: "Not signed in." }, { status: 401 }) };
  }
  if (!hasRole(session.user.role, CURRICULUM_EDIT_ROLES)) {
    return { ok: false as const, response: NextResponse.json({ error: "Forbidden." }, { status: 403 }) };
  }
  return { ok: true as const, userId: session.user.id, role: session.user.role };
}
