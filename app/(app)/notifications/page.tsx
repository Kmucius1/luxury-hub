import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, formatDateTime } from "@/lib/utils";
import type { NotificationRow } from "@/lib/types";
import { markNotificationRead, markAllNotificationsRead } from "./actions";

export default async function NotificationsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("notifications").select("*").order("created_at", { ascending: false }).limit(100);
  const notifications = (data ?? []) as NotificationRow[];
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Notifications</h1>
          <p className="text-sm text-muted-foreground">Only meaningful events — approvals, replies, deliveries, high-score finds.</p>
        </div>
        {unreadCount > 0 ? (
          <form action={markAllNotificationsRead}>
            <Button type="submit" variant="outline" size="sm">
              Mark All Read
            </Button>
          </form>
        ) : null}
      </div>

      {notifications.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          Nothing yet. Notifications appear here for approvals, brand replies, and deliveries.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={cn("flex flex-wrap items-center justify-between gap-3 rounded-md border p-3 text-sm", n.read ? "border-border" : "border-accent/40 bg-accent/5")}
            >
              <div>
                <p className="font-medium">
                  {n.title} {!n.read ? <Badge variant="gold" className="ml-1">New</Badge> : null}
                </p>
                {n.body ? <p className="text-xs text-muted-foreground">{n.body}</p> : null}
                <p className="mt-0.5 text-xs text-muted-foreground">{formatDateTime(n.created_at)}</p>
              </div>
              {!n.read ? (
                <form action={markNotificationRead.bind(null, n.id)}>
                  <Button type="submit" variant="ghost" size="sm">
                    Mark Read
                  </Button>
                </form>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
