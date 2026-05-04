import { db } from "@/lib/db";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Radio, Calendar } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

export default async function LivePage() {
  const sessions = await db.liveSession.findMany({
    include: { week: true },
    orderBy: { scheduledAt: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <span className="eyebrow">Live Classroom</span>
        <h1 className="mt-2 font-display text-4xl font-semibold text-brown-deep">
          Sessions
        </h1>
        <p className="mt-1 text-muted">Cohort sessions appear here when scheduled.</p>
      </div>

      <div className="space-y-3">
        {sessions.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center text-muted">
              No live sessions scheduled yet.
            </CardContent>
          </Card>
        )}
        {sessions.map((s) => {
          const isLive = s.status === "LIVE";
          const isEnded = s.status === "ENDED";
          return (
            <Link key={s.id} href={`/dashboard/live/${s.id}`}>
              <Card className="transition-shadow hover:shadow-md">
                <CardContent className="flex items-center gap-4 p-5">
                  <div
                    className={`rounded-lg p-3 ${
                      isLive ? "bg-terra/10 text-terra" : isEnded ? "bg-cream-mid" : "bg-gold-pale text-gold"
                    }`}
                  >
                    {isLive ? <Radio className="h-5 w-5" /> : <Calendar className="h-5 w-5" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={`act${s.week.actNumber}` as any}>
                        Week {s.week.weekNumber}
                      </Badge>
                      {isLive && <Badge variant="destructive">🔴 Live now</Badge>}
                      {isEnded && <Badge variant="secondary">Recording available</Badge>}
                    </div>
                    <h3 className="mt-1 font-display text-lg font-semibold text-brown-deep">
                      {s.title}
                    </h3>
                    <p className="text-sm text-muted">{formatDateTime(s.scheduledAt)} · {s.durationMin} min</p>
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
