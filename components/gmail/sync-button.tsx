"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function GmailSyncButton() {
  const [state, setState] = useState<"idle"|"syncing"|"done"|"error">("idle");
  const [message, setMessage] = useState("");
  async function sync() {
    setState("syncing"); setMessage("");
    try {
      const res = await fetch("/api/gmail/sync", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Sync failed");
      setState("done"); setMessage(`Scanned ${data.scanned} messages and matched ${data.matched} opportunity replies.`);
      window.location.reload();
    } catch (e) {
      setState("error"); setMessage(e instanceof Error ? e.message : "Sync failed");
    }
  }
  return <div className="flex flex-col items-start gap-2">
    <Button type="button" variant="gold" onClick={sync} disabled={state === "syncing"}>{state === "syncing" ? "Syncing Gmail…" : "Sync Gmail Now"}</Button>
    {message ? <p className={`text-xs ${state === "error" ? "text-destructive" : "text-muted-foreground"}`}>{message}</p> : null}
  </div>;
}
