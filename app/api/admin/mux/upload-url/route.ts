import { NextResponse } from "next/server";
import { mux } from "@/lib/integrations/mux";
import { requireCurriculumEditor } from "../../_helpers";

/**
 * Returns a direct-upload URL for Mux. In mock mode this returns a fake URL
 * — the lesson edit page short-circuits the real PUT and just generates a
 * fake playbackId so the rest of the flow works for development.
 */
export async function POST() {
  const auth = await requireCurriculumEditor();
  if (!auth.ok) return auth.response;

  try {
    const upload = await mux.createUploadUrl();
    return NextResponse.json({ ...upload, mock: mux.isMock });
  } catch (err) {
    console.error("[mux/upload-url]", err);
    return NextResponse.json({ error: "Could not create upload URL." }, { status: 500 });
  }
}
