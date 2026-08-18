"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Gem, Send, MessageSquare, Truck, Package, Sparkles, Building2, Heart, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/samples", label: "Samples", icon: Gem },
  { href: "/requests", label: "Requests", icon: Send },
  { href: "/conversations", label: "Conversations", icon: MessageSquare },
  { href: "/shipping", label: "Shipping", icon: Truck },
  { href: "/my-products", label: "My Products", icon: Package },
  { href: "/brands", label: "Brands", icon: Sparkles },
  { href: "/pr-agencies", label: "PR Agencies", icon: Building2 },
  { href: "/wishlist", label: "Wish List", icon: Heart },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              active ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
            )}
          >
            <Icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
