import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireCurriculumEditor } from "../../_helpers";

const updateSchema = z.object({
  weekNumber: z.number().int().min(1).max(99).optional(),
  title: z.string().min(2).optional(),
  tagline: z.string().min(2).optional(),
  actNumber: z.number().int().min(1).max(3).optional(),
  releaseDate: z.string().datetime().nullish().optional(),
  isPublished: z.boolean().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  const auth = await requireCurriculumEditor();
  if (!auth.ok) return auth.response;

  try {
    const body = await req.json();
    const data = updateSchema.parse(body);

    const week = await db.week.update({
      where: { id: params.id },
      data: {
        ...data,
        releaseDate:
          data.releaseDate === undefined
            ? undefined
            : data.releaseDate
              ? new Date(data.releaseDate)
              : null,
      },
    });
    return NextResponse.json({ week });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input.", details: err.flatten() }, { status: 400 });
    }
    console.error("[admin/weeks PATCH]", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const auth = await requireCurriculumEditor();
  if (!auth.ok) return auth.response;

  try {
    await db.week.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/weeks DELETE]", err);
    return NextResponse.json({ error: "Could not delete week." }, { status: 500 });
  }
}
