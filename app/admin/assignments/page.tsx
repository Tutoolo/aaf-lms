import { db } from "@/lib/db";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, ClipboardCheck } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function AssignmentsAdminPage() {
  const assignments = await db.assignment.findMany({
    include: {
      week: true,
      submissions: { select: { id: true, grade: true, isDraft: true } },
    },
    orderBy: [{ week: { weekNumber: "asc" } }],
  });

  return (
    <div className="space-y-6">
      <div>
        <span className="eyebrow">Assignments</span>
        <h1 className="mt-2 font-display text-4xl font-semibold text-brown-deep">
          Grading queue
        </h1>
        <p className="mt-1 text-muted">
          Click into an assignment to see all submissions for it.
        </p>
      </div>

      {assignments.length === 0 && (
        <Card>
          <CardContent className="p-10 text-center text-muted">
            No assignments yet. Create one from the Curriculum Builder.
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {assignments.map((a) => {
          const subs = a.submissions.filter((s) => !s.isDraft);
          const ungraded = subs.filter((s) => s.grade === null).length;
          const graded = subs.length - ungraded;

          return (
            <Link key={a.id} href={`/admin/assignments/${a.id}`}>
              <Card className="transition-shadow hover:shadow-md">
                <CardContent className="grid grid-cols-[40px_1fr_auto_auto] items-center gap-4 p-5">
                  <ClipboardCheck className="h-6 w-6 text-gold" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge variant={`act${a.week.actNumber}` as any}>
                        Week {a.week.weekNumber}
                      </Badge>
                      <Badge variant="secondary" className="text-[10px]">
                        {a.submissionType}
                      </Badge>
                      {!a.isPublished && <Badge variant="outline">Draft</Badge>}
                    </div>
                    <h3 className="mt-1 truncate font-display text-lg font-semibold text-brown-deep">
                      {a.title}
                    </h3>
                    {a.dueDate && (
                      <p className="text-xs text-muted">Due {formatDate(a.dueDate)}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    {ungraded > 0 ? (
                      <Badge variant="warning">{ungraded} ungraded</Badge>
                    ) : (
                      <Badge variant="secondary">All graded</Badge>
                    )}
                    <span className="text-xs text-muted">
                      {graded} / {subs.length} graded
                    </span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted" />
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
