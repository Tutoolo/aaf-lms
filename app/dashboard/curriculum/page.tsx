import { db } from "@/lib/db";
import { getServerAuthSession } from "@/lib/auth";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ACTS } from "@/lib/curriculum";
import { CheckCircle2, Lock, PlayCircle, Radio } from "lucide-react";
import { formatDate, formatDuration } from "@/lib/utils";

export default async function CurriculumPage() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;

  const weeks = await db.week.findMany({
    include: {
      lessons: { orderBy: { order: "asc" } },
      liveSessions: true,
    },
    orderBy: { weekNumber: "asc" },
  });

  const myProgress = new Map(
    (
      await db.progress.findMany({
        where: { userId: session.user.id },
        select: { lessonId: true, status: true },
      })
    ).map((p) => [p.lessonId, p.status]),
  );

  return (
    <div className="space-y-8">
      <div>
        <span className="eyebrow">Curriculum</span>
        <h1 className="mt-2 font-display text-4xl font-semibold text-brown-deep">
          Your 10-week journey
        </h1>
        <p className="mt-1 text-muted">
          Lessons unlock as your cohort progresses through each week.
        </p>
      </div>

      {([1, 2, 3] as const).map((act) => {
        const actWeeks = weeks.filter((w) => w.actNumber === act);
        return (
          <div key={act}>
            <div className="mb-4 flex items-center gap-3">
              <div
                className="h-8 w-1 rounded-full"
                style={{ backgroundColor: ACTS[act].cssVar }}
              />
              <Badge variant={`act${act}` as any}>Act {act}</Badge>
              <h2 className="font-display text-2xl font-semibold text-brown-deep">
                {ACTS[act].name.split(" — ")[1]}
              </h2>
            </div>
            <div className="space-y-3">
              {actWeeks.map((week) => {
                const locked = !week.isPublished;
                return (
                  <Card key={week.id} className={`overflow-hidden ${locked ? "opacity-60" : ""}`}>
                    <div className="grid md:grid-cols-[160px_1fr]">
                      <div
                        className="flex flex-col justify-center p-5 text-cream"
                        style={{ backgroundColor: ACTS[act].cssVar }}
                      >
                        <div className="text-xs uppercase tracking-wider opacity-70">Week</div>
                        <div className="font-display text-4xl font-semibold">{week.weekNumber}</div>
                      </div>
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-display text-xl font-semibold text-brown-deep">
                              {week.title}
                            </h3>
                            <p className="text-sm text-muted">{week.tagline}</p>
                          </div>
                          {locked && (
                            <div className="flex items-center gap-1 text-xs text-muted">
                              <Lock className="h-3 w-3" />
                              {week.releaseDate
                                ? `Unlocks ${formatDate(week.releaseDate)}`
                                : "Locked"}
                            </div>
                          )}
                        </div>
                        <div className="mt-4 grid gap-2">
                          {week.lessons.map((l) => {
                            const status = myProgress.get(l.id);
                            const isLive = l.type === "LIVE";
                            const Icon = status === "COMPLETE" ? CheckCircle2 : isLive ? Radio : PlayCircle;
                            return (
                              <Link
                                key={l.id}
                                href={locked ? "#" : `/dashboard/lessons/${l.id}`}
                                className={`flex items-center gap-3 rounded-md border border-cream-mid bg-cream-mid/20 px-3 py-2 text-sm transition-colors ${
                                  locked
                                    ? "pointer-events-none"
                                    : "hover:border-gold/40 hover:bg-cream-mid/40"
                                }`}
                              >
                                <Icon
                                  className={`h-4 w-4 shrink-0 ${
                                    status === "COMPLETE"
                                      ? "text-emerald-600"
                                      : isLive
                                        ? "text-terra"
                                        : "text-gold"
                                  }`}
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="text-xs uppercase tracking-wider text-muted">
                                    {l.dayLabel}
                                  </div>
                                  <div className="truncate font-medium text-brown-deep">{l.title}</div>
                                </div>
                                <span className="text-xs text-muted">{formatDuration(l.duration)}</span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
