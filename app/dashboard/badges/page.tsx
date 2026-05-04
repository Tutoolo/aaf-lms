import { db } from "@/lib/db";
import { getServerAuthSession } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BadgeIcon } from "@/components/ui/badge-icon";
import { Lock } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { BadgeCategory, BadgeRarity, Badge as BadgeRow } from "@prisma/client";

const RARITY_STYLE: Record<BadgeRarity, { ring: string; label: string; chip: string }> = {
  COMMON: {
    ring: "ring-cream-mid",
    label: "Common",
    chip: "bg-cream-mid text-foreground",
  },
  RARE: {
    ring: "ring-gold/60",
    label: "Rare",
    chip: "bg-gold text-brown-deep",
  },
  LEGENDARY: {
    ring: "ring-terra/60",
    label: "Legendary",
    chip: "bg-terra text-white",
  },
};

const CATEGORY_LABEL: Record<BadgeCategory, string> = {
  MILESTONE: "Milestones",
  ENGAGEMENT: "Engagement",
  COMMUNITY: "Community",
  DELIVERABLE: "Capstone",
};

const CATEGORY_ORDER: BadgeCategory[] = ["MILESTONE", "DELIVERABLE", "ENGAGEMENT", "COMMUNITY"];

export default async function BadgesPage() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;

  const [user, allBadges, mine] = await Promise.all([
    db.user.findUnique({ where: { id: session.user.id }, select: { xp: true } }),
    db.badge.findMany({ orderBy: [{ category: "asc" }, { weekNumber: "asc" }, { rarity: "asc" }] }),
    db.userBadge.findMany({
      where: { userId: session.user.id },
      include: { badge: true },
      orderBy: { earnedAt: "desc" },
    }),
  ]);

  const earnedSlugs = new Set(mine.map((u) => u.badge.slug));
  const earnedAtMap = new Map(mine.map((u) => [u.badge.slug, u.earnedAt]));

  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    badges: allBadges.filter((b) => b.category === cat),
  }));

  return (
    <div className="space-y-6">
      {/* Header with XP + count */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="eyebrow">Achievements</span>
          <h1 className="mt-2 font-display text-4xl font-semibold text-brown-deep">
            Your badges
          </h1>
          <p className="mt-1 text-muted">
            Earn them by shipping work, hitting milestones, and helping your cohort.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Stat label="Earned" value={`${mine.length} / ${allBadges.length}`} />
          <Stat label="Total XP" value={`${user?.xp ?? 0}`} />
        </div>
      </div>

      {/* Recently earned strip */}
      {mine.length > 0 && (
        <Card>
          <CardContent className="p-5">
            <div className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-gold">
              Recently earned
            </div>
            <div className="flex flex-wrap gap-3">
              {mine.slice(0, 6).map((u) => (
                <div
                  key={u.id}
                  className="flex items-center gap-2 rounded-full bg-gold-pale px-3 py-1.5 text-sm"
                >
                  <BadgeIcon name={u.badge.icon} className="h-4 w-4 text-brown-deep" />
                  <span className="font-medium text-brown-deep">{u.badge.name}</span>
                  <span className="text-xs text-muted">{formatDate(u.earnedAt)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Category sections */}
      {grouped.map(({ category, badges }) => (
        <section key={category}>
          <h2 className="mb-3 font-display text-2xl font-semibold text-brown-deep">
            {CATEGORY_LABEL[category]}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {badges.map((b) => (
              <BadgeTile
                key={b.id}
                badge={b}
                earned={earnedSlugs.has(b.slug)}
                earnedAt={earnedAtMap.get(b.slug)}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function BadgeTile({
  badge,
  earned,
  earnedAt,
}: {
  badge: BadgeRow;
  earned: boolean;
  earnedAt?: Date;
}) {
  const r = RARITY_STYLE[badge.rarity];
  return (
    <Card
      className={`overflow-hidden transition-shadow ${earned ? "shadow-sm hover:shadow-md" : "opacity-60"}`}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-full ring-2 ${r.ring} ${
              earned ? "bg-gold-pale text-brown-deep" : "bg-cream-mid text-muted"
            }`}
          >
            {earned ? (
              <BadgeIcon name={badge.icon} className="h-6 w-6" />
            ) : (
              <Lock className="h-5 w-5" />
            )}
          </div>
          <Badge
            variant={
              badge.rarity === "LEGENDARY"
                ? "destructive"
                : badge.rarity === "RARE"
                  ? "default"
                  : "secondary"
            }
            className="text-[10px]"
          >
            {r.label}
          </Badge>
        </div>
        <h3 className="mt-4 font-display text-lg font-semibold text-brown-deep">
          {badge.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted">
          {earned ? badge.description : badge.criteria}
        </p>
        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="text-gold">+{badge.points} XP</span>
          {earned && earnedAt && (
            <span className="text-muted">{formatDate(earnedAt)}</span>
          )}
          {!earned && badge.weekNumber && (
            <span className="text-muted">Week {badge.weekNumber}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-cream-mid bg-white px-4 py-2">
      <div className="text-xs uppercase tracking-wider text-muted">{label}</div>
      <div className="font-display text-2xl font-semibold text-brown-deep">{value}</div>
    </div>
  );
}
