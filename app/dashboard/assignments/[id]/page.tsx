import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { getServerAuthSession } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { SubmissionForm } from "./submission-form";

export default async function AssignmentDetail({ params }: { params: { id: string } }) {
  const session = await getServerAuthSession();
  if (!session?.user) return null;

  const a = await db.assignment.findUnique({
    where: { id: params.id },
    include: { week: true },
  });
  if (!a) notFound();

  const submission = await db.submission.findUnique({
    where: { assignmentId_userId: { assignmentId: a.id, userId: session.user.id } },
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2">
            <Badge variant={`act${a.week.actNumber}` as any}>Week {a.week.weekNumber}</Badge>
            <Badge variant="secondary">{a.submissionType}</Badge>
            {a.dueDate && <span className="text-xs text-muted">Due {formatDate(a.dueDate)}</span>}
            <span className="text-xs text-muted">· Pass at {a.passingScore}%</span>
          </div>
          <h1 className="mt-2 font-display text-3xl font-semibold text-brown-deep">{a.title}</h1>
          <pre className="mt-4 whitespace-pre-wrap font-sans text-sm text-foreground">{a.description}</pre>
        </CardContent>
      </Card>

      <SubmissionForm
        assignmentId={a.id}
        submissionType={a.submissionType}
        initial={
          submission
            ? {
                content: submission.content ?? "",
                fileUrl: submission.fileUrl ?? "",
                isDraft: submission.isDraft,
                grade: submission.grade,
                feedback: submission.feedback,
                needsRevision: submission.needsRevision,
                submittedAt: submission.submittedAt,
                gradedAt: submission.gradedAt,
              }
            : null
        }
      />
    </div>
  );
}
