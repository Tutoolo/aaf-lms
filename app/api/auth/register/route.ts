import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    const existing = await db.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });
    if (existing) {
      return NextResponse.json(
        { error: "An account with that email already exists." },
        { status: 409 },
      );
    }

    const hash = await bcrypt.hash(data.password, 10);
    const user = await db.user.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        password: hash,
        role: "STUDENT",
      },
      select: { id: true, email: true, name: true },
    });

    return NextResponse.json({ user });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input.", details: err.flatten() },
        { status: 400 },
      );
    }
    console.error("[register]", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
