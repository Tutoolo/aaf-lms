import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getServerAuthSession } from "@/lib/auth";
import { FINANCE_ROLES, hasRole } from "@/lib/permissions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, BookOpen, Award, MessageSquare, ClipboardCheck, TrendingUp } from "lucide-react";

export default async function AnalyticsPage() {
  const session = await getServerAuthSession();
  if (!session?.user) redirect("/login");
  if (!hasRole(session.user.role, FINANCE_ROLES)) redirect("/admin");

  const [
    totalStudents,
    activeEnrollments,
    pendingEnrollments,
    totalLessons,
    totalCompletions,
    totalSubmissions,
    gradedSubmissions,
    passingSubmissions,
    totalAttempts,
    passedAttempts,
    threadCount,
    replyCount,
    badgesEarned,
  ] = await Promise.all([
    db.user.count({ where: { role: "STUDENT" } }),
    db.enrollment.count({ where: { status: "ACTIVE" } }),
    db.enrollment.count({ where: { status: "PENDING" } }),
    db.lesson.count({ where: { isPublished: true } }),
    db.progress.count({ where: { status: "COMPLETE" } }),
    db.submission.count({ where: { isDraft: false } }),
    db.submission.count({ where: { isDraft: false, grade: { not: null } } }),
    db.submission.count({ where: { isDraft: false, grade: { gte: 70 } } }),
    db.quizAttempt.count(),
    db.quizAttempt.count({ where: { passed: true } }),
    db.forumThread.count(),
    db.forumReply.count(),
    db.userBadge.count(),
  ]);

  // Lesson completion rate (by lesson, top + bottom)
  const lessonRates = await db.lesson.findMany({
    where: { isPublished: true },
    include: {
      progress: { where: { status: "COMPLETE" }, select: { id: true } },
      week: { select: { weekNumber: true, actNumber: true, title: true } },
    },
  });
  const enrolledStudentCount = activeEnrollments;
  const lessonsRanked = lessonRates
    .map((l) => ({
      title: l.title,
      week: l.week.weekNumber,
      act: l.week.actNumber,
      pct: enrolledStudentCount > 0 ? (l.progress.length / enrolledStudentCount) * 100 : 0,
    }))
    .sort((a, b) => b.pct - a.pct);

  const topLessons = lessonsRanked.slice(0, 5);
  const bottomLessons = lessonsRanked.filter((l) => l.pct < 100).slice(-5).reverse();

  // Grading rate
  const gradingRate = totalSubmissions > 0 ? (gradedSubmissions / totalSubmissions) * 100 : 0;
  const passRate = gradedSubmissions > 0 ? (passingSubmissions / gradedSubmissions) * 100 : 0;
  const quizPassRate = totalAttempts > 0 ? (passedAttempts / totalAttempts) * 100 : 0;

  // Lesson completion overall
  const totalPossibleCompletions = totalLessons * enrolledStudentCount;
  const completionRate =
    totalPossibleCompletions > 0 ? (totalCompletions / totalPossibleCompletions) * 100 : 0;

  return (
    <div className="space-y-6">
      <div>
        <span className="eyebrow">Analytics</span>
        <h1 className="mt-2 font-display text-4xl font-semibold text-brown-deep">
          Cohort overview
        </h1>
        <p className="mt-1 text-muted">
          Live data across enrollment, learning progress, and engagement.
        </p>
      </div>

      {/* Top stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={Users} label="Active enrollments" value={activeEnrollments.toString()} sub={`${pendingEnrollments} pending`} />
        <Stat icon={BookOpen} label="Lesson completions" value={totalCompletions.toString()} sub={`${completionRate.toFixed(0)}% of total possible`} />
        <Stat icon={ClipboardCheck} label="Submissions" value={totalSubmissions.toString()} sub={`${gradedSubmissions} graded · ${(totalSubmissions - gradedSubmissions)} pending`} />
        <Stat icon={Award} label="Badges earned" value={badgesEarned.toString()} sub={`Across ${totalStudents} students`} />
      </div>

      {/* Rates */}
      <div className="grid gap-4 lg:grid-cols-3">
        <RateCard
          title="Cohort lesson completion"
          pct={completionRate}
          sub={`${totalCompletions} of ${totalPossibleCompletions} possible (${enrolledStudentCount} students × ${totalLessons} published lessons)`}
        />
        <RateCard
          title="Assignment pass rate"
          pct={passRate}
          sub={`${passingSubmissions} of ${gradedSubmissions} graded submissions ≥70%`}
        />
        <RateCard
          title="Quiz pass rate"
          pct={quizPassRate}
          sub={`${passedAttempts} of ${totalAttempts} attempts passed`}
        />
      </div>

      {/* Engagement */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Community engagement</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <EngagementTile label="Forum threads" value={threadCount} icon={MessageSquare} />
          <EngagementTile label="Forum replies" value={replyCount} icon={MessageSquare} />
          <EngagementTile
            label="Avg replies per thread"
            value={threadCount > 0 ? (replyCount / threadCount).toFixed(1) : "0"}
            icon={TrendingUp}
          />
        </CardContent>
      </Card>

      {/* Lesson performance */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top-performing lessons</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topLessons.length === 0 && (
              <p className="text-sm text-muted">No completion data yet.</p>
            )}
            {topLessons.map((l) => (
              <LessonRow key={l.title} l={l} />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Lessons with lowest completion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {bottomLessons.length === 0 && (
              <p className="text-sm text-muted">All lessons fully completed.</p>
            )}
            {bottomLessons.map((l) => (
              <LessonRow key={l.title} l={l} />
            ))}
          </CardContent>
        </Card>
      </div>

      <p className="text-xs text-muted">
        All data is live from the database. CSV export and time-series charts are next on the
        roadmap.
      </p>
    </div>
  );
}

function Stat({ icon: Icon, label, value, sub }: { icon: any; label: string; value: string; sub: string }) {
  return (
    <Card>
      <CardContent className="p-5">
        <Icon className="h-5 w-5 text-gold" />
        <div className="mt-3 font-display text-3xl font-semibold text-brown-deep">{value}</div>
        <div className="mt-1 text-xs uppercase tracking-wider text-muted">{label}</div>
        <div className="mt-1 text-xs text-muted">{sub}</div>
      </CardContent>
    </Card>
  );
}

function RateCard({ title, pct, sub }: { title: string; pct: number; sub: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-3 flex items-baseline gap-2">
          <span className="font-display text-4xl font-semibold text-brown-deep">
            {pct.toFixed(0)}%
          </span>
        </div>
        <Progress value={pct} />
        <p className="mt-3 text-xs text-muted">{sub}</p>
      </CardContent>
    </Card>
  );
}

function EngagementTile({ label, value, icon: Icon }: { label: string; value: string | number; icon: any }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-cream-mid bg-cream-mid/20 p-4">
      <Icon className="h-5 w-5 text-gold" />
      <div>
        <div className="font-display text-2xl font-semibold text-brown-deep">{value}</div>
        <div className="text-xs uppercase tracking-wider text-muted">{label}</div>
      </div>
    </div>
  );
}

function LessonRow({
  l,
}: {
  l: { title: string; week: number; act: number; pct: number };
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Badge variant={`act${l.act}` as any} className="text-[10px]">
              Wk {l.week}
            </Badge>
          </div>
          <p className="mt-1 truncate text-sm font-medium text-brown-deep">{l.title}</p>
        </div>
        <span className="text-sm font-medium text-brown-deep">{l.pct.toFixed(0)}%</span>
      </div>
      <Progress value={l.pct} className="mt-1" />
    </div>
  );
}
