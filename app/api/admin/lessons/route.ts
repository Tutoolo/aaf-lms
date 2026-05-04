import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireCurriculumEditor } from "../_helpers";

const createSchema = z.object({
  weekId: z.string(),
  title: z.string().min(2),
  type: z.enum(["VIDEO", "LIVE", "ASYNC_WORKSHOP", "SANDBOX", "READING"]),
  dayLabel: z.string().default(""),
  duration: z.number().int().min(0).default(0),
  isPublished: z.boolean().default(false),
});

export async function POST(req: Request) {
  const auth = await requireCurriculumEditor();
  if (!auth.ok) return auth.response;

  try {
    const body = await req.json();
    const data = createSchema.parse(body);

    // Find next order index in the week
    const last = await db.lesson.findFirst({
      where: { weekId: data.weekId },
      orderBy: { order: "desc" },
    });
    const order = last ? last.order + 1 : 0;

    const lesson = await db.lesson.create({
      data: { ...data, order, createdById: auth.userId },
    });
    return NextResponse.json({ lesson });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input.", details: err.flatten() }, { status: 400 });
    }
    console.error("[admin/lessons POST]", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
