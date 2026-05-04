import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { WeekEditor } from "./week-editor";

export default async function WeekEditPage({
  params,
}: {
  params: { weekId: string };
}) {
  const week = await db.week.findUnique({
    where: { id: params.weekId },
    include: {
      createdBy: { select: { id: true, name: true, role: true } },
      lessons: {
        orderBy: { order: "asc" },
        include: {
          createdBy: { select: { id: true, name: true, role: true } },
        },
      },
    },
  });
  if (!week) notFound();

  return (
    <div className="space-y-6">
      <Link
        href="/admin/curriculum"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-gold"
      >
        <ChevronLeft className="h-4 w-4" /> All weeks
      </Link>
      <WeekEditor
        week={week}
        lessons={week.lessons}
        weekCreator={week.createdBy}
      />
    </div>
  );
}
