import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageStub } from "@/components/layout/page-stub";
import { VideoPlayer } from "@/components/video/video-player";
import { ArrowLeft, ArrowRight, PlayCircle } from "lucide-react";
import { formatDuration } from "@/lib/utils";

export default async function LessonPlayer({
  params,
}: {
  params: { lessonId: string };
}) {
  const lesson = await db.lesson.findUnique({
    where: { id: params.lessonId },
    include: { week: true },
  });
  if (!lesson) notFound();

  // Find next / previous lesson in the same course
  const allLessons = await db.lesson.findMany({
    where: { week: { courseId: lesson.week.courseId } },
    include: { week: true },
    orderBy: [{ week: { weekNumber: "asc" } }, { order: "asc" }],
  });
  const idx = allLessons.findIndex((l) => l.id === lesson.id);
  const prev = idx > 0 ? allLessons[idx - 1] : null;
  const next = idx < allLessons.length - 1 ? allLessons[idx + 1] : null;

  return (
    <div className="space-y-6">
      {/* Lesson header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant={`act${lesson.week.actNumber}` as any}>Week {lesson.week.weekNumber}</Badge>
          <Badge variant="secondary">{lesson.type.replace("_", " ")}</Badge>
          <span className="text-xs text-muted">{lesson.dayLabel}</span>
        </div>
        <h1 className="font-display text-3xl font-semibold text-brown-deep">{lesson.title}</h1>
        <p className="text-sm text-muted">{formatDuration(lesson.duration)}</p>
      </div>

      {/* Player or content */}
      <Card>
        <CardContent className="p-0">
          {lesson.type === "VIDEO" || lesson.type === "LIVE" ? (
            lesson.muxPlaybackId ? (
              <VideoPlayer playbackId={lesson.muxPlaybackId} />
            ) : (
              <div className="flex aspect-video items-center justify-center bg-brown-deep text-cream">
                <div className="text-center">
                  <PlayCircle className="mx-auto h-16 w-16 text-gold" />
                  <p className="mt-4 text-sm text-cream/70">No video uploaded yet</p>
                </div>
              </div>
            )
          ) : lesson.type === "READING" ? (
            <div className="prose prose-sm max-w-none p-8">
              <div className="whitespace-pre-wrap">{lesson.body ?? "Reading content goes here."}</div>
            </div>
          ) : (
            <div className="p-8 text-muted">
              <p>This is a {lesson.type.replace("_", " ").toLowerCase()} lesson.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Module-stub: notes, transcript, Q&A all live here */}
      <PageStub
        title="Lesson Player Features"
        description="The full lesson player includes notes, transcript search, resources, and a per-lesson Q&A thread."
        features={[
          "Mux video player with playback speed, captions, fullscreen",
          "Auto-track watch progress (Progress table updates every 30s)",
          "Mark complete: manual button + auto at 90% watched",
          "Notes panel (TipTap rich text, localStorage + server save)",
          "Resources sidebar (linked Resource records for this week)",
          "Searchable transcript tab",
          "Per-lesson Q&A forum thread inline",
          "For LIVE lessons: recording auto-replaces this player after session ends",
        ]}
      />

      {/* Prev / next navigation */}
      <div className="flex items-center justify-between gap-3">
        {prev ? (
          <Button variant="outline" asChild>
            <Link href={`/dashboard/lessons/${prev.id}`}>
              <ArrowLeft className="h-4 w-4" /> {prev.title}
            </Link>
          </Button>
        ) : <span />}
        {next && (
          <Button asChild>
            <Link href={`/dashboard/lessons/${next.id}`}>
              {next.title} <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
