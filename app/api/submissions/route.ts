import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getServerAuthSession } from "@/lib/auth";

const schema = z.object({
  assignmentId: z.string(),
  content: z.string().max(20_000).optional().default(""),
  fileUrl: z.string().url().or(z.literal("")).optional().default(""),
  isDraft: z.boolean().default(false),
});

/**
 * Student creates or updates their submission for a given assignment.
 * One row per (user, assignment) — upsert.
 */
export async function POST(req: Request) {
  const session = await getServerAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = schema.parse(body);

    const assignment = await db.assignment.findUnique({
      where: { id: data.assignmentId },
    });
    if (!assignment) {
      return NextResponse.json({ error: "Assignment not found." }, { status: 404 });
    }

    const submission = await db.submission.upsert({
      where: {
        assignmentId_userId: {
          assignmentId: data.assignmentId,
          userId: session.user.id,
        },
      },
      create: {
        assignmentId: data.assignmentId,
        userId: session.user.id,
        content: data.content || null,
        fileUrl: data.fileUrl || null,
        isDraft: data.isDraft,
      },
      update: {
        content: data.content || null,
        fileUrl: data.fileUrl || null,
        isDraft: data.isDraft,
        // Reset revision flag and grade if student is re-submitting work that needed revision
        ...(data.isDraft
          ? {}
          : { needsRevision: false, submittedAt: new Date() }),
      },
    });

    return NextResponse.json({ submission });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input.", details: err.flatten() },
        { status: 400 },
      );
    }
    console.error("[submissions POST]", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
