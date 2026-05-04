import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireCurriculumEditor } from "@/app/api/admin/_helpers";
import { awardWeekMilestoneBadge } from "@/lib/badges";

const schema = z.object({
  grade: z.number().min(0).max(100).nullable(),
  feedback: z.string().max(5000).optional().default(""),
  needsRevision: z.boolean().default(false),
});

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  const auth = await requireCurriculumEditor();
  if (!auth.ok) return auth.response;

  try {
    const body = await req.json();
    const data = schema.parse(body);

    const submission = await db.submission.update({
      where: { id: params.id },
      data: {
        grade: data.grade,
        feedback: data.feedback || null,
        needsRevision: data.needsRevision,
        gradedAt: data.grade !== null ? new Date() : null,
      },
      include: {
        assignment: { include: { week: true } },
      },
    });

    // Auto-award milestone badge if the grade meets the assignment's passing score
    let award = null;
    if (
      data.grade !== null &&
      data.grade >= submission.assignment.passingScore &&
      submission.assignment.week.weekNumber
    ) {
      award = await awardWeekMilestoneBadge(
        submission.userId,
        submission.assignment.week.weekNumber,
      );
    }

    // Notify the student that their grade is in
    if (data.grade !== null) {
      await db.notification.create({
        data: {
          userId: submission.userId,
          type: "ASSIGNMENT_GRADED",
          message: data.needsRevision
            ? `Your "${submission.assignment.title}" submission needs revision.`
            : `Your "${submission.assignment.title}" submission was graded: ${data.grade}/100.`,
          link: `/dashboard/assignments/${submission.assignmentId}`,
        },
      });
    }

    return NextResponse.json({ submission, award });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input.", details: err.flatten() },
        { status: 400 },
      );
    }
    console.error("[grade PATCH]", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
