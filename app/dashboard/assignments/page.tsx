import { db } from "@/lib/db";
import { getServerAuthSession } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export default async function AssignmentsPage() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;

  const assignments = await db.assignment.findMany({
    where: { isPublished: true },
    include: { week: true, submissions: { where: { userId: session.user.id } } },
    orderBy: { dueDate: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <span className="eyebrow">Assignments</span>
        <h1 className="mt-2 font-display text-4xl font-semibold text-brown-deep">Your assignments</h1>
        <p className="mt-1 text-muted">Submit, get feedback, level up.</p>
      </div>

      <div className="space-y-3">
        {assignments.map((a) => {
          const sub = a.submissions[0];
          const status = sub
            ? sub.grade !== null
              ? "graded"
              : "submitted"
            : "due";
          return (
            <Link key={a.id} href={`/dashboard/assignments/${a.id}`}>
              <Card className="transition-shadow hover:shadow-md">
                <CardContent className="flex items-center justify-between gap-4 p-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant={`act${a.week.actNumber}` as any}>Week {a.week.weekNumber}</Badge>
                      <Badge variant={status === "graded" ? "success" : status === "submitted" ? "secondary" : "outline"}>
                        {status === "graded" ? `Graded · ${sub?.grade}/100` : status}
                      </Badge>
                    </div>
                    <h3 className="mt-1 font-display text-lg font-semibold text-brown-deep">{a.title}</h3>
                    {a.dueDate && (
                      <p className="text-sm text-muted">Due {formatDate(a.dueDate)}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
