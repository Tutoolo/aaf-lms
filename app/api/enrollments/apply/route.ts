import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { stripe } from "@/lib/integrations";

const schema = z.object({
  track: z.enum(["self_paced", "fellowship", "scholarship"]),
  name: z.string().min(2),
  email: z.string().email(),
  country: z.string().optional(),
  diaspora: z.boolean().optional(),
  motivation: z.string().optional(),
});

const TRACK_MAP = {
  self_paced: "SELF_PACED",
  fellowship: "FELLOWSHIP",
  scholarship: "SCHOLARSHIP",
} as const;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    // Find or create the user (passwordless application — they'll set a password later)
    const email = data.email.toLowerCase();
    let user = await db.user.findUnique({ where: { email } });
    if (!user) {
      user = await db.user.create({
        data: { name: data.name, email, role: "STUDENT" },
      });
    }

    // Find the active or upcoming cohort
    const cohort = await db.cohort.findFirst({
      where: { status: { in: ["UPCOMING", "ACTIVE"] } },
      orderBy: { startDate: "asc" },
    });
    if (!cohort) {
      return NextResponse.json(
        { error: "No open cohort right now. Join the waitlist." },
        { status: 400 },
      );
    }

    const track = TRACK_MAP[data.track];

    // Upsert enrollment
    const enrollment = await db.enrollment.upsert({
      where: { userId_cohortId: { userId: user.id, cohortId: cohort.id } },
      create: {
        userId: user.id,
        cohortId: cohort.id,
        track,
        status: "PENDING",
        paymentStatus: track === "SCHOLARSHIP" ? "WAIVED" : "UNPAID",
        motivation: data.motivation,
      },
      update: { track, motivation: data.motivation },
    });

    // For paid tracks, kick off Stripe checkout
    if (track !== "SCHOLARSHIP") {
      const session = await stripe.createCheckoutSession({
        userId: user.id,
        email,
        track,
        cohortId: cohort.id,
        diaspora: data.diaspora,
      });
      await db.enrollment.update({
        where: { id: enrollment.id },
        data: { stripeSessionId: session.sessionId },
      });
      return NextResponse.json({ checkoutUrl: session.url });
    }

    // Scholarship → admin reviews
    return NextResponse.json({ ok: true, status: "pending_review" });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input.", details: err.flatten() },
        { status: 400 },
      );
    }
    console.error("[apply]", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
