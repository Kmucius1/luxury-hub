import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GmailSyncButton } from "@/components/gmail/sync-button";

export default async function GmailSettingsPage({ searchParams }: { searchParams: Promise<{connected?:string;error?:string}> }) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: connections } = await supabase.from("gmail_connections").select("id,email,status,connected_at,last_sync_at,scopes").eq("user_id", user!.id).order("connected_at", { ascending: false });
  const active = connections?.find((c) => c.status === "connected");

  return <div className="flex flex-col gap-6">
    <div>
      <Link href="/settings" className="text-sm text-muted-foreground hover:text-foreground">← Back to Settings</Link>
      <h1 className="mt-2 text-xl font-semibold tracking-tight">Gmail Connection</h1>
      <p className="text-sm text-muted-foreground">Connect the creator Gmail used for PR requests, brand replies, approvals, declines, shipping conversations, and follow-ups.</p>
    </div>

    {params.connected ? <div className="rounded-md border border-emerald-500/30 bg-emerald-500/5 p-3 text-sm">Gmail connected successfully.</div> : null}
    {params.error ? <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">Gmail connection failed ({params.error}). Check Google OAuth settings and try again.</div> : null}

    <Card>
      <CardHeader><CardTitle>Creator Inbox</CardTitle></CardHeader>
      <CardContent className="flex flex-col gap-4">
        {active ? <>
          <div className="flex flex-wrap items-center gap-2"><span className="font-medium">{active.email}</span><Badge variant="gold">Connected</Badge></div>
          <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
            <p>Connected: {new Date(active.connected_at).toLocaleString()}</p>
            <p>Last synced: {active.last_sync_at ? new Date(active.last_sync_at).toLocaleString() : "Not synced yet"}</p>
          </div>
          <GmailSyncButton />
          <Button asChild variant="outline" className="w-fit"><a href="/api/gmail/connect">Connect a Different Gmail</a></Button>
        </> : <>
          <p className="text-sm text-muted-foreground">No creator Gmail is connected yet. Connect the Gmail account you want this CRM to use.</p>
          <Button asChild variant="gold" className="w-fit"><a href="/api/gmail/connect">Connect Gmail</a></Button>
        </>}
      </CardContent>
    </Card>

    <Card>
      <CardHeader><CardTitle>What Gmail Sync Updates</CardTitle></CardHeader>
      <CardContent className="grid gap-2 text-sm text-muted-foreground">
        <p>• Matches brand replies to opportunities using verified contact email addresses.</p>
        <p>• Records replies, requests for more information, approvals, declines, waitlists, full campaigns, and shipping-address requests.</p>
        <p>• Adds a timestamped application event and notification instead of silently changing status.</p>
        <p>• Does not claim an email was “viewed” unless the CRM receives a real view/open signal from a supported source.</p>
      </CardContent>
    </Card>
  </div>;
}
