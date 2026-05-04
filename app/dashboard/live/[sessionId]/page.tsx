import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { PageStub } from "@/components/layout/page-stub";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

export default async function LiveRoomPage({
  params,
}: {
  params: { sessionId: string };
}) {
  const sess = await db.liveSession.findUnique({
    where: { id: params.sessionId },
    include: { week: true },
  });
  if (!sess) notFound();

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2">
            <Badge variant={`act${sess.week.actNumber}` as any}>
              Week {sess.week.weekNumber}
            </Badge>
            <Badge variant={sess.status === "LIVE" ? "destructive" : sess.status === "ENDED" ? "secondary" : "outline"}>
              {sess.status}
            </Badge>
          </div>
          <h1 className="mt-2 font-display text-3xl font-semibold text-brown-deep">{sess.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted">
            <span className="inline-flex items-center gap-1.5"><Calendar className="h-4 w-4" />{formatDateTime(sess.scheduledAt)}</span>
            <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" />{sess.durationMin} min</span>
            <span className="inline-flex items-center gap-1.5"><Users className="h-4 w-4" />{sess.attendees} expected</span>
          </div>
          {sess.agenda && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-brown-deep">Agenda</h3>
              <pre className="mt-2 whitespace-pre-wrap font-sans text-sm text-muted">{sess.agenda}</pre>
            </div>
          )}
        </CardContent>
      </Card>

      <PageStub
        title="Live Classroom Room"
        description="Full virtual classroom: instructor stage, participant tiles, chat, Q&A, polls, breakouts, recording."
        features={[
          "Pre-session lobby (countdown, tech check, energy poll, early-arrival chat)",
          "Main stage + participant tile grid (100ms.live SDK)",
          "Right panel: Chat | Q&A | Participants | Poll | Resources",
          "Instructor controls: mute all, spotlight, recording, polls, breakouts, screen share, slides",
          "Student controls: hand-raise, reactions, DM instructor, upvote Q&A, breakout chat",
          "Auto-attached recording on lesson page within 2 hours of session end",
          "Post-session 2-question survey",
        ]}
        note="100ms.live SDK is wired in lib/integrations/hms.ts as a stub. Set HMS_ACCESS_KEY + HMS_SECRET to go live."
      />
    </div>
  );
}
