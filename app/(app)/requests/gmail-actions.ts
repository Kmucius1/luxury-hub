"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { decryptSecret, gmailFetch, refreshAccessToken } from "@/lib/gmail";

function b64url(value: string) {
  return Buffer.from(value, "utf8").toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export async function sendRequestViaGmail(requestId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in.");

  const { data: request } = await supabase
    .from("sample_requests")
    .select("id,opportunity_id,contact_email,subject,message,status,sample_opportunities(id,brand,product,safety_badge,payment_required,card_required)")
    .eq("id", requestId)
    .single();
  if (!request) throw new Error("Request not found.");
  if (!request.contact_email) throw new Error("A verified contact email is required before sending.");

  const opportunity = Array.isArray(request.sample_opportunities) ? request.sample_opportunities[0] : request.sample_opportunities;
  if (!opportunity || opportunity.safety_badge !== "SAFE" || opportunity.payment_required || opportunity.card_required) {
    throw new Error("This request cannot be sent because the opportunity is not marked SAFE or has a payment/card risk.");
  }

  const { data: conn } = await supabase.from("gmail_connections").select("*").eq("user_id", user.id).eq("status", "connected").order("connected_at", { ascending: false }).limit(1).maybeSingle();
  if (!conn?.encrypted_refresh_token) throw new Error("Connect the creator Gmail in Settings → Gmail first.");

  const { access_token } = await refreshAccessToken(decryptSecret(conn.encrypted_refresh_token));
  const mime = [
    `To: ${request.contact_email}`,
    `From: ${conn.email}`,
    `Subject: ${request.subject ?? `PR / Creator Sample Consideration`}`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=UTF-8",
    "",
    request.message ?? "",
  ].join("\r\n");

  const res = await gmailFetch(access_token, "/messages/send", { method: "POST", body: JSON.stringify({ raw: b64url(mime) }) });
  if (!res.ok) throw new Error(`Gmail send failed (${res.status}).`);
  const sent = await res.json() as { id: string; threadId: string };
  const now = new Date();
  const followUp = new Date(now); followUp.setDate(followUp.getDate() + 7);

  await supabase.from("sample_requests").update({ status: "sent", date_sent: now.toISOString().slice(0,10), follow_up_date: followUp.toISOString().slice(0,10) }).eq("id", requestId);
  await supabase.from("sample_opportunities").update({ status: "request_sent", request_date: now.toISOString().slice(0,10), last_status_event: "sent", last_status_event_at: now.toISOString() }).eq("id", request.opportunity_id);
  await supabase.from("application_events").insert({ opportunity_id: request.opportunity_id, event_type: "sent", event_at: now.toISOString(), source: "gmail", gmail_message_id: sent.id, gmail_thread_id: sent.threadId, details: `Sent from ${conn.email} to ${request.contact_email}` });
  await supabase.from("audit_logs").insert({ action: "request_sent_via_gmail", entity_type: "sample_requests", entity_id: requestId, details: { opportunity_id: request.opportunity_id, sender: conn.email } });

  revalidatePath("/requests");
  revalidatePath(`/requests/${requestId}`);
  revalidatePath(`/samples/${request.opportunity_id}`);
  revalidatePath("/dashboard");
}
