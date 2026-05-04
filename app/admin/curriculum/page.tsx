import { db } from "@/lib/db";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ACTS } from "@/lib/curriculum";
import { Plus, ChevronRight, Eye, EyeOff } from "lucide-react";
import { CreateWeekButton } from "./create-week-button";

export default async function CurriculumBuilderPage() {
  // We assume one course for v1 — find it (or create if missing).
  let course = await db.course.findFirst();
  if (!course) {
    course = await db.course.create({
      data: {
        title: "AI Agent Engineering Fellowship",
        slug: "agent-engineering-fellowship",
        description: "Default course",
        actNumber: 0,
      },
    });
  }

  const weeks = await db.week.findMany({
    where: { courseId: course.id },
    include: {
      _count: { select: { lessons: true } },
    },
    orderBy: { weekNumber: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <span className="eyebrow">Curriculum Builder</span>
          <h1 className="mt-2 font-display text-4xl font-semibold text-brown-deep">
            Weeks & Lessons
          </h1>
          <p className="mt-1 text-muted">
            Manage the 10-week structure that powers the public site, the seed, and the student dashboard.
          </p>
        </div>
        <CreateWeekButton courseId={course.id} nextWeekNumber={(weeks.at(-1)?.weekNumber ?? 0) + 1} />
      </div>

      {weeks.length === 0 && (
        <Card>
          <CardContent className="p-10 text-center text-muted">
            No weeks yet. Click <span className="font-medium text-brown-deep">Add week</span> to start.
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {weeks.map((w) => {
          const act = ACTS[w.actNumber as 1 | 2 | 3];
          return (
            <Link key={w.id} href={`/admin/curriculum/${w.id}`}>
              <Card className="transition-shadow hover:shadow-md">
                <CardContent className="grid grid-cols-[100px_1fr_auto] items-center gap-4 p-5">
                  <div
                    className="flex flex-col items-center justify-center rounded-md py-3 text-cream"
                    style={{ backgroundColor: act?.cssVar ?? "var(--brown-deep)" }}
                  >
                    <div className="text-[10px] uppercase tracking-wider opacity-70">Week</div>
                    <div className="font-display text-3xl font-semibold leading-none">
                      {w.weekNumber}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      {act && <Badge variant={`act${w.actNumber}` as any}>Act {w.actNumber}</Badge>}
                      {w.isPublished ? (
                        <Badge variant="success" className="gap-1">
                          <Eye className="h-3 w-3" /> Published
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="gap-1">
                          <EyeOff className="h-3 w-3" /> Draft
                        </Badge>
                      )}
                    </div>
                    <h3 className="mt-1 truncate font-display text-lg font-semibold text-brown-deep">
                      {w.title}
                    </h3>
                    <p className="truncate text-sm text-muted">{w.tagline}</p>
                    <p className="mt-1 text-xs text-muted">
                      {w._count.lessons} {w._count.lessons === 1 ? "lesson" : "lessons"}
                    </p>
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
