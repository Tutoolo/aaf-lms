import { db } from "@/lib/db";
import { getServerAuthSession } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Bell } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

export default async function NotificationsPage() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;

  const notifications = await db.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <span className="eyebrow">Notifications</span>
        <h1 className="mt-2 font-display text-4xl font-semibold text-brown-deep">Inbox</h1>
      </div>

      <div className="space-y-2">
        {notifications.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center text-muted">No notifications yet.</CardContent>
          </Card>
        )}
        {notifications.map((n) => (
          <Card key={n.id} className={n.isRead ? "opacity-70" : ""}>
            <CardContent className="flex items-start gap-3 p-4">
              <div className="rounded-lg bg-gold-pale p-2">
                <Bell className="h-4 w-4 text-gold" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-brown-deep">{n.message}</p>
                <p className="text-xs text-muted">{formatDateTime(n.createdAt)}</p>
              </div>
              {!n.isRead && <span className="mt-2 h-2 w-2 rounded-full bg-terra" />}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
