import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getServerAuthSession } from "@/lib/auth";

const schema = z.object({
  name: z.string().min(2).max(100),
  bio: z.string().max(500).optional().default(""),
  linkedIn: z.string().url().or(z.literal("")).optional().default(""),
  avatar: z.string().url().or(z.literal("")).optional().default(""),
});

export async function PATCH(req: Request) {
  const session = await getServerAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = schema.parse(body);

    const user = await db.user.update({
      where: { id: session.user.id },
      data: {
        name: data.name,
        bio: data.bio || null,
        linkedIn: data.linkedIn || null,
        avatar: data.avatar || null,
      },
      select: { id: true, name: true, bio: true, linkedIn: true, avatar: true },
    });

    return NextResponse.json({ user });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input.", details: err.flatten() },
        { status: 400 },
      );
    }
    console.error("[user/profile]", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
