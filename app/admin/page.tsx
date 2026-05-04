import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, ClipboardCheck, Radio, TrendingUp } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

export default async function AdminDashboard() {
  const [
    enrolledCount,
    completedCount,
    pendingSubmissions,
    upcomingSession,
    recentSubmissions,
    recentForum,
  ] = await Promise.all([
    db.enrollment.count({ where: { status: "ACTIVE" } }),
    db.progress.count({ where: { status: "COMPLETE" } }),
    db.submission.count({ where: { grade: null } }),
    db.liveSession.findFirst({
      where: { status: "SCHEDULED", scheduledAt: { gte: new Date() } },
      orderBy: { scheduledAt: "asc" },
      include: { week: true },
    }),
    db.submission.findMany({
      take: 5,
      orderBy: { submittedAt: "desc" },
      include: {
        user: { select: { name: true, avatar: true } },
        assignment: { select: { title: true } },
      },
    }),
    db.forumThread.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true } } },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <span className="eyebrow">Instructor view</span>
        <h1 className="mt-2 font-display text-4xl font-semibold text-brown-deep">Today's overview</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={Users} label="Active enrollments" value={enrolledCount} />
        <Stat icon={ClipboardCheck} label="Awaiting grading" value={pendingSubmissions} accent="terra" />
        <Stat icon={TrendingUp} label="Lessons completed (cohort)" value={completedCount} />
        <Stat icon={Radio} label="Next live session" value={upcomingSession ? formatDateTime(upcomingSession.scheduledAt) : "—"} small />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Recent submissions</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {recentSubmissions.map((s) => (
              <div key={s.id} className="flex items-center justify-between text-sm">
                <div>
                  <div className="font-medium text-brown-deep">{s.user.name}</div>
                  <div className="text-xs text-muted">{s.assignment.title}</div>
                </div>
                <Badge variant={s.grade !== null ? "success" : "outline"}>
                  {s.grade !== null ? `${s.grade}` : "Pending"}
                </Badge>
              </div>
            ))}
            {recentSubmissions.length === 0 && (
              <p className="text-sm text-muted">No submissions yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Recent forum activity</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {recentForum.map((t) => (
              <div key={t.id} className="text-sm">
                <div className="font-medium text-brown-deep">{t.title}</div>
                <div className="text-xs text-muted">#{t.channel} · {t.user.name}</div>
              </div>
            ))}
            {recentForum.length === 0 && <p className="text-sm text-muted">No threads yet.</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  accent,
  small,
}: {
  icon: any;
  label: string;
  value: string | number;
  accent?: "terra" | "gold";
  small?: boolean;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <Icon className={`h-5 w-5 ${accent === "terra" ? "text-terra" : "text-gold"}`} />
        </div>
        <div className={`mt-3 font-display ${small ? "text-base" : "text-3xl"} font-semibold text-brown-deep`}>
          {value}
        </div>
        <div className="mt-1 text-xs uppercase tracking-wider text-muted">{label}</div>
      </CardContent>
    </Card>
  );
}
