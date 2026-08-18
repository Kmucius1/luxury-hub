"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function str(formData: FormData, key: string): string | null {
  const v = formData.get(key);
  const s = typeof v === "string" ? v.trim() : "";
  return s.length ? s : null;
}

export async function createConversation(formData: FormData) {
  const supabase = await createClient();
  const opportunityId = str(formData, "opportunity_id");
  const subject = str(formData, "subject");
  const firstMessage = str(formData, "first_message");

  const { data, error } = await supabase
    .from("conversations")
    .insert({ opportunity_id: opportunityId, subject, status: "open", last_message_at: firstMessage ? new Date().toISOString() : null })
    .select("id")
    .single();
  if (error) throw new Error(error.message);

  if (firstMessage) {
    await supabase.from("conversation_messages").insert({
      conversation_id: data.id,
      direction: str(formData, "direction") ?? "outbound",
      body: firstMessage,
    });
  }

  await supabase.from("audit_logs").insert({
    action: "conversation_started",
    entity_type: "conversations",
    entity_id: data.id,
    details: { opportunity_id: opportunityId },
  });

  revalidatePath("/conversations");
  redirect(`/conversations/${data.id}`);
}

export async function addMessage(conversationId: string, formData: FormData) {
  const supabase = await createClient();
  const body = str(formData, "body");
  if (!body) throw new Error("Message body is required.");
  const direction = str(formData, "direction") ?? "inbound";

  const { error } = await supabase.from("conversation_messages").insert({
    conversation_id: conversationId,
    direction,
    body,
  });
  if (error) throw new Error(error.message);

  await supabase.from("conversations").update({ last_message_at: new Date().toISOString() }).eq("id", conversationId);

  if (direction === "inbound") {
    const { data: convo } = await supabase.from("conversations").select("subject").eq("id", conversationId).single();
    await supabase.from("notifications").insert({
      type: "reply",
      title: `Brand replied: ${convo?.subject ?? "Conversation"}`,
      body: body.slice(0, 140),
    });
  }

  await supabase.from("audit_logs").insert({
    action: "message_logged",
    entity_type: "conversations",
    entity_id: conversationId,
    details: { direction },
  });

  revalidatePath(`/conversations/${conversationId}`);
  revalidatePath("/conversations");
}

export async function updateConversationStatus(conversationId: string, formData: FormData) {
  const supabase = await createClient();
  const status = str(formData, "status") ?? "open";
  const { error } = await supabase.from("conversations").update({ status }).eq("id", conversationId);
  if (error) throw new Error(error.message);
  revalidatePath(`/conversations/${conversationId}`);
  revalidatePath("/conversations");
}

export async function deleteConversation(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("conversations").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/conversations");
  redirect("/conversations");
}
