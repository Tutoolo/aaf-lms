import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Users } from "lucide-react";

export default async function CohortsPage() {
  const cohorts = await db.cohort.findMany({
    include: { _count: { select: { enrollments: true, users: true } } },
    orderBy: { startDate: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <span className="eyebrow">Cohorts</span>
        <h1 className="mt-2 font-display text-4xl font-semibold text-brown-deep">Cohort management</h1>
      </div>

      <div className="space-y-3">
        {cohorts.map((c) => (
          <Card key={c.id}>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant={c.status === "ACTIVE" ? "success" : c.status === "UPCOMING" ? "outline" : "secondary"}>
                    {c.status}
                  </Badge>
                </div>
                <h3 className="mt-1 font-display text-lg font-semibold text-brown-deep">{c.name}</h3>
                <p className="text-sm text-muted">
                  {formatDate(c.startDate)} → {formatDate(c.endDate)}
                </p>
              </div>
              <div className="text-right">
                <div className="inline-flex items-center gap-2 text-sm text-muted">
                  <Users className="h-4 w-4" />
                  {c._count.enrollments} / {c.maxStudents}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
