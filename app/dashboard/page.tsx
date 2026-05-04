import { getServerAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ProgressRing } from "@/components/charts/progress-ring";
import { ACTS, CURRICULUM } from "@/lib/curriculum";
import { Radio, BookOpen, Code2, Flame, ArrowRight, Trophy } from "lucide-react";
import { BadgeIcon } from "@/components/ui/badge-icon";
import { formatDateTime } from "@/lib/utils";

export default async function DashboardHome() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;

  // Pull live data
  const totalLessons = await db.lesson.count({ where: { isPublished: true } });
  const completed = await db.progress.count({
    where: { userId: session.user.id, status: "COMPLETE" },
  });
  const overallPct = totalLessons ? (completed / totalLessons) * 100 : 0;

  const cohort = session.user.cohortId
    ? await db.cohort.findUnique({ where: { id: session.user.cohortId } })
    : null;

  const upcomingLive = await db.liveSession.findFirst({
    where: { status: "SCHEDULED", scheduledAt: { gte: new Date() } },
    orderBy: { scheduledAt: "asc" },
    include: { week: true },
  });

  const myBadges = await db.userBadge.findMany({
    where: { userId: session.user.id },
    include: { badge: true },
    orderBy: { earnedAt: "desc" },
    take: 4,
  });
  const myUser = await db.user.findUnique({
    where: { id: session.user.id },
    select: { xp: true },
  });

  // Per-act progress
  const allWeeks = await db.week.findMany({
    include: { lessons: { where: { isPublished: true } } },
  });
  const progressByLesson = new Set(
    (
      await db.progress.findMany({
        where: { userId: session.user.id, status: "COMPLETE" },
        select: { lessonId: true },
      })
    ).map((p) => p.lessonId),
  );
  const actStats = ([1, 2, 3] as const).map((act) => {
    const weeks = allWeeks.filter((w) => w.actNumber === act);
    const lessons = weeks.flatMap((w) => w.lessons);
    const done = lessons.filter((l) => progressByLesson.has(l.id)).length;
    return {
      act,
      pct: lessons.length ? (done / lessons.length) * 100 : 0,
      done,
      total: lessons.length,
    };
  });

  // Find current week (first week with incomplete lessons)
  const currentWeekRow = allWeeks
    .sort((a, b) => a.weekNumber - b.weekNumber)
    .find((w) => w.lessons.some((l) => !progressByLesson.has(l.id)));
  const currentWeek = currentWeekRow
    ? CURRICULUM.find((w) => w.weekNumber === currentWeekRow.weekNumber)
    : null;

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl bg-brown-deep p-8 text-cream">
        <div className="absolute inset-0 bg-diamond-grid opacity-40" aria-hidden />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="eyebrow">Welcome back</span>
            <h1 className="mt-2 font-display text-4xl font-semibold">
              {session.user.name?.split(" ")[0]}, ready to keep building?
            </h1>
            <p className="mt-2 text-cream/70">
              {cohort?.name ?? "Founding Cohort"} · Week {currentWeek?.weekNumber ?? 1} of 10
            </p>
          </div>
          <Button asChild className="md:self-start">
            <Link href={upcomingLive ? `/dashboard/live/${upcomingLive.id}` : "/dashboard/curriculum"}>
              {upcomingLive ? "Join next live" : "Continue learning"} <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Main column */}
        <div className="space-y-6">
          {/* Current week */}
          {currentWeek && (
            <Card>
              <CardHeader className="flex-row items-start justify-between space-y-0">
                <div>
                  <Badge variant={`act${currentWeek.actNumber}` as any}>
                    Act {currentWeek.actNumber}
                  </Badge>
                  <CardTitle className="mt-2">
                    Week {currentWeek.weekNumber}: {currentWeek.title}
                  </CardTitle>
                  <p className="mt-1 text-sm text-muted">{currentWeek.tagline}</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {currentWeek.lessons.slice(0, 4).map((l, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg border border-cream-mid bg-cream-mid/20 p-3"
                  >
                    <div>
                      <div className="text-xs uppercase tracking-wider text-muted">
                        {l.dayLabel}
                      </div>
                      <div className="text-sm font-medium text-brown-deep">{l.title}</div>
                    </div>
                    <Badge variant="secondary" className="text-[11px]">{l.type.replace("_", " ").toLowerCase()}</Badge>
                  </div>
                ))}
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/dashboard/curriculum">Open full curriculum</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Quick links */}
          <div className="grid gap-4 sm:grid-cols-3">
            <QuickLink href="/dashboard/live" icon={Radio} label="Live Classroom" sub="Next: this week" />
            <QuickLink href="/dashboard/curriculum" icon={BookOpen} label="Continue Lesson" sub={`${completed} / ${totalLessons} complete`} />
            <QuickLink href="/dashboard/sandbox" icon={Code2} label="Open Sandbox" sub="Build & test agents" />
          </div>
        </div>

        {/* Sidebar column */}
        <div className="space-y-6">
          {/* Overall progress */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Overall progress</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <ProgressRing value={overallPct} label="Complete" />
              <div className="text-sm text-muted">
                {completed} of {totalLessons} lessons
              </div>
            </CardContent>
          </Card>

          {/* Per-act bars */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">By act</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {actStats.map(({ act, pct, done, total }) => (
                <div key={act}>
                  <div className="flex items-center justify-between text-sm">
                    <Badge variant={`act${act}` as any} className="text-[11px]">
                      Act {act}
                    </Badge>
                    <span className="text-muted">{done} / {total}</span>
                  </div>
                  <Progress
                    value={pct}
                    className="mt-2"
                    style={{ ["--act-color" as any]: ACTS[act].cssVar }}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Streak */}
          <Card>
            <CardHeader className="flex-row items-center gap-3 space-y-0">
              <Flame className="h-5 w-5 text-terra" />
              <CardTitle className="text-base">Active streak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-display text-4xl font-semibold text-brown-deep">7 days</div>
              <p className="mt-1 text-sm text-muted">Don't break the chain — open a lesson today.</p>
            </CardContent>
          </Card>

          {/* Badges */}
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <div className="flex items-center gap-3">
                <Trophy className="h-5 w-5 text-gold" />
                <CardTitle className="text-base">Badges</CardTitle>
              </div>
              <span className="text-xs text-muted">{myUser?.xp ?? 0} XP</span>
            </CardHeader>
            <CardContent>
              {myBadges.length === 0 ? (
                <p className="text-sm text-muted">
                  Ship your first deliverable to earn your first badge.
                </p>
              ) : (
                <>
                  <div className="grid grid-cols-4 gap-2">
                    {myBadges.map((u) => (
                      <div
                        key={u.id}
                        className="flex flex-col items-center gap-1 rounded-md bg-gold-pale p-2 text-center"
                        title={u.badge.name}
                      >
                        <BadgeIcon name={u.badge.icon} className="h-5 w-5 text-brown-deep" />
                        <span className="line-clamp-1 text-[10px] font-medium text-brown-deep">
                          {u.badge.name}
                        </span>
                      </div>
                    ))}
                  </div>
                  <Link
                    href="/dashboard/badges"
                    className="mt-3 inline-flex items-center gap-1 text-xs text-gold hover:underline"
                  >
                    View all badges <ArrowRight className="h-3 w-3" />
                  </Link>
                </>
              )}
            </CardContent>
          </Card>

          {/* Upcoming live */}
          {upcomingLive && (
            <Card className="border-2 border-gold">
              <CardHeader className="flex-row items-center gap-3 space-y-0">
                <Radio className="h-5 w-5 text-gold" />
                <CardTitle className="text-base">Next live session</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium text-brown-deep">{upcomingLive.title}</div>
                <div className="mt-1 text-xs text-muted">{formatDateTime(upcomingLive.scheduledAt)}</div>
                <Button size="sm" className="mt-3 w-full" asChild>
                  <Link href={`/dashboard/live/${upcomingLive.id}`}>Open lobby</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function QuickLink({
  href,
  icon: Icon,
  label,
  sub,
}: {
  href: string;
  icon: any;
  label: string;
  sub: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-cream-mid bg-white p-5 transition-shadow hover:shadow-md"
    >
      <Icon className="h-5 w-5 text-gold" />
      <div className="mt-3 font-display text-lg font-semibold text-brown-deep">{label}</div>
      <div className="text-xs text-muted">{sub}</div>
      <ArrowRight className="mt-3 h-4 w-4 text-muted transition-transform group-hover:translate-x-1" />
    </Link>
  );
}
