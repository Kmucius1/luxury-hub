import Link from "next/link";
import { Bell } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Nav } from "@/components/layout/nav";
import { SignOutButton } from "@/components/layout/sign-out-button";
import { Badge } from "@/components/ui/badge";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { count: unreadCount } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("read", false);

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border p-4 md:flex">
        <div className="mb-4 flex items-center justify-between px-1">
          <div>
            <p className="text-sm font-semibold tracking-tight text-foreground">Luxury Samples Hub</p>
            <p className="text-xs text-muted-foreground">Zoe Taylor · @Zoettaylor14</p>
          </div>
          <Link href="/notifications" className="relative rounded-md p-1.5 text-muted-foreground hover:bg-secondary/60 hover:text-foreground" aria-label="Notifications">
            <Bell className="size-4" />
            {unreadCount ? (
              <Badge variant="gold" className="absolute -right-1 -top-1 h-4 min-w-4 justify-center rounded-full px-1 text-[10px]">
                {unreadCount}
              </Badge>
            ) : null}
          </Link>
        </div>
        <Nav />
        <div className="mt-auto flex flex-col gap-2 border-t border-border pt-4">
          <p className="truncate px-1 text-xs text-muted-foreground">{user?.email}</p>
          <SignOutButton />
        </div>
      </aside>
      <main className="flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-6xl px-5 py-6 md:px-8 md:py-8">{children}</div>
      </main>
    </div>
  );
}
