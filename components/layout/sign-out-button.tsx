"use client";

import { LogOut } from "lucide-react";
import { signOut } from "@/app/login/actions";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  return (
    <form action={signOut}>
      <Button type="submit" variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
        <LogOut className="size-3.5" />
        Sign Out
      </Button>
    </form>
  );
}
