import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireCurriculumEditor } from "../_helpers";

const createSchema = z.object({
  courseId: z.string(),
  weekNumber: z.number().int().min(1).max(99),
  title: z.string().min(2),
  tagline: z.string().min(2),
  actNumber: z.number().int().min(1).max(3),
  releaseDate: z.string().datetime().nullish(),
  isPublished: z.boolean().default(false),
});

export async function POST(req: Request) {
  const auth = await requireCurriculumEditor();
  if (!auth.ok) return auth.response;

  try {
    const body = await req.json();
    const data = createSchema.parse(body);

    const week = await db.week.create({
      data: {
        ...data,
        releaseDate: data.releaseDate ? new Date(data.releaseDate) : null,
        createdById: auth.userId,
      },
    });
    return NextResponse.json({ week });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input.", details: err.flatten() }, { status: 400 });
    }
    console.error("[admin/weeks POST]", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
