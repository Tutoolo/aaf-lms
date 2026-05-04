/**
 * Badge auto-award logic.
 *
 * The single entry point is `awardWeekMilestoneBadge` — call it whenever a
 * piece of work is graded above the passing threshold. It looks up the
 * milestone badge attached to that week (if any) and awards it to the user
 * if they don't already have it.
 *
 * Designed to be idempotent: calling it twice for the same user+week is a no-op.
 */

import { db } from "@/lib/db";

export type AwardResult =
  | { awarded: true; badgeName: string; pointsEarned: number }
  | { awarded: false; reason: "no-badge-for-week" | "already-earned" };

export async function awardWeekMilestoneBadge(
  userId: string,
  weekNumber: number,
): Promise<AwardResult> {
  const badge = await db.badge.findFirst({
    where: { weekNumber, category: "MILESTONE" },
  });
  if (!badge) return { awarded: false, reason: "no-badge-for-week" };

  // Idempotent: skip if already earned
  const existing = await db.userBadge.findUnique({
    where: { userId_badgeId: { userId, badgeId: badge.id } },
  });
  if (existing) return { awarded: false, reason: "already-earned" };

  // Award + bump XP + drop a notification
  await db.$transaction([
    db.userBadge.create({
      data: { userId, badgeId: badge.id, context: `week-${weekNumber}-milestone` },
    }),
    db.user.update({
      where: { id: userId },
      data: { xp: { increment: badge.points } },
    }),
    db.notification.create({
      data: {
        userId,
        type: "BADGE_EARNED",
        message: `You earned the ${badge.name} badge — +${badge.points} XP`,
        link: "/dashboard/badges",
      },
    }),
  ]);

  return { awarded: true, badgeName: badge.name, pointsEarned: badge.points };
}
