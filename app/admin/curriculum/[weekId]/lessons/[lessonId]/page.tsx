import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { LessonEditor } from "./lesson-editor";

export default async function LessonEditPage({
  params,
}: {
  params: { weekId: string; lessonId: string };
}) {
  const lesson = await db.lesson.findUnique({
    where: { id: params.lessonId },
    include: {
      week: true,
      createdBy: { select: { name: true, role: true } },
    },
  });
  if (!lesson) notFound();

  return (
    <div className="space-y-6">
      <Link
        href={`/admin/curriculum/${params.weekId}`}
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-gold"
      >
        <ChevronLeft className="h-4 w-4" /> Back to Week {lesson.week.weekNumber}
      </Link>
      <LessonEditor
        lesson={lesson}
        weekTitle={lesson.week.title}
        creator={lesson.createdBy}
        createdAt={lesson.createdAt}
      />
    </div>
  );
}
