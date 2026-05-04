import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireCurriculumEditor } from "../../_helpers";

const updateSchema = z.object({
  title: z.string().min(2).optional(),
  type: z.enum(["VIDEO", "LIVE", "ASYNC_WORKSHOP", "SANDBOX", "READING"]).optional(),
  dayLabel: z.string().optional(),
  duration: z.number().int().min(0).optional(),
  isPublished: z.boolean().optional(),
  transcript: z.string().nullish().optional(),
  body: z.string().nullish().optional(),
  muxAssetId: z.string().nullish().optional(),
  muxPlaybackId: z.string().nullish().optional(),
  order: z.number().int().min(0).optional(),
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

    const lesson = await db.lesson.update({
      where: { id: params.id },
      data,
    });
    return NextResponse.json({ lesson });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input.", details: err.flatten() }, { status: 400 });
    }
    console.error("[admin/lessons PATCH]", err);
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
    await db.lesson.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/lessons DELETE]", err);
    return NextResponse.json({ error: "Could not delete lesson." }, { status: 500 });
  }
}
