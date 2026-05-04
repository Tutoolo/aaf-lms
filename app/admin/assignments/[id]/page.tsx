import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatDate, formatDateTime } from "@/lib/utils";

export default async function AssignmentSubmissionsPage({
  params,
}: {
  params: { id: string };
}) {
  const a = await db.assignment.findUnique({
    where: { id: params.id },
    include: {
      week: true,
      submissions: {
        where: { isDraft: false },
        include: { user: { select: { id: true, name: true, avatar: true } } },
        orderBy: [{ grade: { sort: "asc", nulls: "first" } }, { submittedAt: "asc" }],
      },
    },
  });
  if (!a) notFound();

  return (
    <div className="space-y-6">
      <Link
        href="/admin/assignments"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-gold"
      >
        <ChevronLeft className="h-4 w-4" /> All assignments
      </Link>

      <div>
        <Badge variant={`act${a.week.actNumber}` as any}>Week {a.week.weekNumber}</Badge>
        <h1 className="mt-2 font-display text-3xl font-semibold text-brown-deep">{a.title}</h1>
        {a.dueDate && (
          <p className="mt-1 text-sm text-muted">
            Due {formatDate(a.dueDate)} · Pass at {a.passingScore}%
          </p>
        )}
      </div>

      <div className="space-y-3">
        {a.submissions.length === 0 && (
          <Card>
            <CardContent className="p-10 text-center text-muted">
              No submissions yet.
            </CardContent>
          </Card>
        )}
        {a.submissions.map((s) => (
          <Link key={s.id} href={`/admin/assignments/${a.id}/submissions/${s.id}`}>
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="flex items-center gap-4 p-5">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={s.user.avatar ?? undefined} alt={s.user.name} />
                  <AvatarFallback>{s.user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-brown-deep">{s.user.name}</span>
                    {s.grade === null ? (
                      <Badge variant="warning">Ungraded</Badge>
                    ) : s.needsRevision ? (
                      <Badge variant="warning">Needs revision</Badge>
                    ) : s.grade >= a.passingScore ? (
                      <Badge variant="success">{s.grade} / 100</Badge>
                    ) : (
                      <Badge variant="destructive">{s.grade} / 100</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted">
                    Submitted {formatDateTime(s.submittedAt)}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
