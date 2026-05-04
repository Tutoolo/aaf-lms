import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pin, MessageSquare } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

const CHANNELS = [
  "general",
  "week-1-help",
  "week-3-help",
  "show-and-tell",
  "help-me-debug",
  "resources",
  "jobs",
  "demo-day",
];

export default async function CommunityPage() {
  const threads = await db.forumThread.findMany({
    include: {
      user: { select: { name: true, avatar: true } },
      _count: { select: { replies: true } },
    },
    orderBy: [{ isPinned: "desc" }, { updatedAt: "desc" }],
  });

  return (
    <div className="space-y-6">
      <div>
        <span className="eyebrow">Community</span>
        <h1 className="mt-2 font-display text-4xl font-semibold text-brown-deep">Forum</h1>
        <p className="mt-1 text-muted">Ask, share, debug, celebrate. Your cohort lives here.</p>
      </div>

      {/* Channels strip */}
      <div className="flex flex-wrap gap-2">
        {CHANNELS.map((c) => (
          <Badge key={c} variant="outline" className="cursor-pointer hover:bg-cream-mid">#{c}</Badge>
        ))}
      </div>

      <div className="space-y-3">
        {threads.map((t) => (
          <Card key={t.id} className="transition-shadow hover:shadow-md">
            <CardContent className="flex items-start gap-4 p-5">
              <Avatar className="h-10 w-10">
                <AvatarImage src={t.user.avatar ?? undefined} alt={t.user.name} />
                <AvatarFallback>{t.user.name[0]}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-muted">#{t.channel}</span>
                  {t.isPinned && (
                    <Badge variant="outline" className="text-[10px]"><Pin className="mr-1 h-3 w-3" />Pinned</Badge>
                  )}
                  <span className="text-muted">· {formatDateTime(t.updatedAt)}</span>
                </div>
                <h3 className="mt-1 font-display text-lg font-semibold text-brown-deep">{t.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted">{t.body}</p>
                <div className="mt-3 flex items-center gap-4 text-xs text-muted">
                  <span className="inline-flex items-center gap-1"><MessageSquare className="h-3 w-3" />{t._count.replies} replies</span>
                  <span>by {t.user.name}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
