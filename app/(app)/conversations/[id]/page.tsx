import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, formatDateTime } from "@/lib/utils";
import type { Conversation, ConversationMessage } from "@/lib/types";
import { addMessage, updateConversationStatus, deleteConversation } from "../actions";

export default async function ConversationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: conversation }, { data: messagesData }] = await Promise.all([
    supabase.from("conversations").select("*, sample_opportunities(id, brand, product)").eq("id", id).single(),
    supabase.from("conversation_messages").select("*").eq("conversation_id", id).order("sent_at", { ascending: true }),
  ]);

  if (!conversation) notFound();
  const c = conversation as Conversation;
  const messages = (messagesData ?? []) as ConversationMessage[];

  const boundAddMessage = addMessage.bind(null, id);
  const boundUpdateStatus = updateConversationStatus.bind(null, id);
  const boundDelete = deleteConversation.bind(null, id);

  return (
    <div className="flex flex-col gap-6">
      <Link href="/conversations" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" />
        Back to Conversations
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">{c.subject ?? c.sample_opportunities?.brand ?? "Conversation"}</h1>
          <p className="text-sm text-muted-foreground">{c.sample_opportunities?.product ?? "No linked opportunity"}</p>
        </div>
        <form action={boundUpdateStatus} className="flex items-center gap-2">
          <Select name="status" defaultValue={c.status} className="w-40">
            <option value="open">Open</option>
            <option value="waiting">Waiting</option>
            <option value="closed">Closed</option>
          </Select>
          <Button type="submit" variant="outline" size="sm">
            Update
          </Button>
        </form>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Messages</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {messages.length === 0 ? (
            <p className="text-sm text-muted-foreground">No messages yet — log what you sent or what the brand said.</p>
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "max-w-[85%] rounded-lg border p-3 text-sm",
                  m.direction === "outbound" ? "self-end border-primary/20 bg-primary/5" : "self-start border-border bg-secondary/40"
                )}
              >
                <p className="mb-1 text-xs font-medium text-muted-foreground">
                  {m.direction === "outbound" ? "You" : "Brand"} · {formatDateTime(m.sent_at)}
                </p>
                <p className="whitespace-pre-wrap">{m.body}</p>
              </div>
            ))
          )}

          <form action={boundAddMessage} className="flex flex-col gap-2 border-t border-border pt-4">
            <Textarea name="body" rows={3} placeholder="Paste the message you sent or received" required />
            <div className="flex items-center justify-between">
              <Select name="direction" defaultValue="inbound" className="w-44">
                <option value="outbound">Sent by you</option>
                <option value="inbound">Received from brand</option>
              </Select>
              <Button type="submit" variant="gold" size="sm">
                Log Message
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <form action={boundDelete} className="flex justify-end">
        <Button type="submit" variant="destructive" size="sm">
          Delete Conversation
        </Button>
      </form>
    </div>
  );
}
