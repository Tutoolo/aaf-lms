import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { getServerAuthSession } from "@/lib/auth";

const schema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(200),
});

export async function POST(req: Request) {
  const session = await getServerAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = schema.parse(body);

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, password: true },
    });
    if (!user || !user.password) {
      return NextResponse.json(
        {
          error:
            "This account doesn't have a password yet. Sign in with Google or use a password reset link.",
        },
        { status: 400 },
      );
    }

    const ok = await bcrypt.compare(data.currentPassword, user.password);
    if (!ok) {
      return NextResponse.json(
        { error: "Current password is incorrect." },
        { status: 401 },
      );
    }

    const hash = await bcrypt.hash(data.newPassword, 10);
    await db.user.update({
      where: { id: user.id },
      data: { password: hash },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input.", details: err.flatten() },
        { status: 400 },
      );
    }
    console.error("[user/password]", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
