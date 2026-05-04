import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronLeft } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import { Grader } from "./grader";

export default async function GradePage({
  params,
}: {
  params: { id: string; submissionId: string };
}) {
  const submission = await db.submission.findUnique({
    where: { id: params.submissionId },
    include: {
      user: { select: { id: true, name: true, avatar: true, email: true } },
      assignment: { include: { week: true } },
    },
  });
  if (!submission) notFound();

  // Find the next ungraded submission for this assignment to enable "next" navigation
  const nextUngraded = await db.submission.findFirst({
    where: {
      assignmentId: params.id,
      grade: null,
      isDraft: false,
      id: { not: submission.id },
    },
    orderBy: { submittedAt: "asc" },
    select: { id: true },
  });

  return (
    <div className="space-y-6">
      <Link
        href={`/admin/assignments/${params.id}`}
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-gold"
      >
        <ChevronLeft className="h-4 w-4" /> Back to all submissions
      </Link>

      {/* Header */}
      <div className="flex items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={submission.user.avatar ?? undefined} alt={submission.user.name} />
          <AvatarFallback>{submission.user.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h1 className="font-display text-2xl font-semibold text-brown-deep">
            {submission.user.name}
          </h1>
          <p className="text-sm text-muted">
            {submission.user.email} · Submitted {formatDateTime(submission.submittedAt)}
          </p>
        </div>
        <Badge variant={`act${submission.assignment.week.actNumber}` as any}>
          Week {submission.assignment.week.weekNumber}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: their submission */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Their submission</CardTitle>
            <p className="text-sm text-muted">
              {submission.assignment.title} · {submission.assignment.submissionType}
            </p>
          </CardHeader>
          <CardContent>
            {submission.assignment.submissionType === "URL" ||
            submission.assignment.submissionType === "FILE" ? (
              submission.fileUrl ? (
                <a
                  href={submission.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-cream-mid bg-cream-mid/30 px-3 py-2 text-sm text-gold hover:bg-cream-mid/50 break-all"
                >
                  {submission.fileUrl} ↗
                </a>
              ) : (
                <p className="text-sm text-muted">No URL submitted.</p>
              )
            ) : (
              <pre
                className={`whitespace-pre-wrap rounded-md border border-cream-mid bg-cream-mid/30 p-4 text-sm ${
                  submission.assignment.submissionType === "CODE"
                    ? "font-mono text-xs"
                    : "font-sans"
                }`}
              >
                {submission.content || "Nothing submitted."}
              </pre>
            )}
          </CardContent>
        </Card>

        {/* Right: grader */}
        <Grader
          submissionId={submission.id}
          assignmentId={params.id}
          passingScore={submission.assignment.passingScore}
          weekNumber={submission.assignment.week.weekNumber}
          initial={{
            grade: submission.grade,
            feedback: submission.feedback ?? "",
            needsRevision: submission.needsRevision,
          }}
          nextUngradedId={nextUngraded?.id ?? null}
        />
      </div>
    </div>
  );
}
