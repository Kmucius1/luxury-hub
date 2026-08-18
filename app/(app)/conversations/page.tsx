import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/utils";
import type { Conversation, SampleOpportunity } from "@/lib/types";
import { createConversation } from "./actions";

export default async function ConversationsPage() {
  const supabase = await createClient();
  const [{ data: conversationsData }, { data: opportunitiesData }] = await Promise.all([
    supabase
      .from("conversations")
      .select("*, sample_opportunities(id, brand, product)")
      .order("last_message_at", { ascending: false, nullsFirst: false }),
    supabase.from("sample_opportunities").select("*").order("brand"),
  ]);

  const conversations = (conversationsData ?? []) as Conversation[];
  const opportunities = (opportunitiesData ?? []) as SampleOpportunity[];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Conversations</h1>
        <p className="text-sm text-muted-foreground">Log what brands actually say back — matched to the opportunity that started it.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Start a Conversation</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createConversation} className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="opportunity_id">Opportunity</Label>
              <Select id="opportunity_id" name="opportunity_id" defaultValue="">
                <option value="">— None —</option>
                {opportunities.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.brand} — {o.product}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" name="subject" />
            </div>
            <div className="col-span-full flex flex-col gap-1.5">
              <Label htmlFor="first_message">First Message (optional)</Label>
              <Textarea id="first_message" name="first_message" rows={2} placeholder="Paste what you sent, or what the brand said" />
            </div>
            <input type="hidden" name="direction" value="outbound" />
            <div className="col-span-full flex justify-end">
              <Button type="submit" variant="gold">
                <Plus className="size-4" />
                Start Conversation
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {conversations.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">No conversations logged yet.</div>
      ) : (
        <div className="flex flex-col gap-2">
          {conversations.map((c) => (
            <Link
              key={c.id}
              href={`/conversations/${c.id}`}
              className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-border p-3 text-sm hover:bg-secondary/50"
            >
              <div>
                <p className="font-medium">{c.subject ?? c.sample_opportunities?.brand ?? "Conversation"}</p>
                <p className="text-xs text-muted-foreground">{c.sample_opportunities?.product ?? "No linked opportunity"}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{formatDateTime(c.last_message_at)}</span>
                <Badge variant={c.status === "open" ? "outline" : "secondary"} className="capitalize">
                  {c.status}
                </Badge>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
