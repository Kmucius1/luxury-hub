import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { classifyReply, decryptSecret, gmailFetch, refreshAccessToken } from "@/lib/gmail";

function header(headers: Array<{name:string;value:string}> | undefined, name: string) {
  return headers?.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value ?? "";
}

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: conn } = await supabase.from("gmail_connections").select("*").eq("user_id", user.id).eq("status", "connected").order("connected_at", { ascending: false }).limit(1).maybeSingle();
  if (!conn?.encrypted_refresh_token) return NextResponse.json({ error: "No Gmail account connected" }, { status: 400 });

  const { access_token } = await refreshAccessToken(decryptSecret(conn.encrypted_refresh_token));
  const listRes = await gmailFetch(access_token, "/messages?q=newer_than:30d&maxResults=100");
  if (!listRes.ok) return NextResponse.json({ error: "Gmail sync failed" }, { status: 502 });
  const list = await listRes.json() as { messages?: Array<{id:string;threadId:string}>; resultSizeEstimate?: number };

  const { data: opportunities } = await supabase.from("sample_opportunities").select("id,brand,product,contact_email,status");
  const byEmail = new Map<string, {id:string;brand:string;product:string;status:string}>();
  for (const o of opportunities ?? []) if (o.contact_email) byEmail.set(o.contact_email.toLowerCase(), o);

  let matched = 0;
  for (const m of list.messages ?? []) {
    const msgRes = await gmailFetch(access_token, `/messages/${m.id}?format=metadata&metadataHeaders=From&metadataHeaders=To&metadataHeaders=Subject&metadataHeaders=Date`);
    if (!msgRes.ok) continue;
    const msg = await msgRes.json() as { id:string; threadId:string; snippet?:string; payload?:{headers?:Array<{name:string;value:string}>}; internalDate?:string };
    const from = header(msg.payload?.headers, "From");
    const emailMatch = from.match(/<([^>]+)>/)?.[1] ?? from;
    const opp = byEmail.get(emailMatch.trim().toLowerCase());
    if (!opp) continue;

    const { data: exists } = await supabase.from("application_events").select("id").eq("gmail_message_id", msg.id).maybeSingle();
    if (exists) continue;

    const eventType = classifyReply(`${header(msg.payload?.headers, "Subject")} ${msg.snippet ?? ""}`);
    const eventAt = msg.internalDate ? new Date(Number(msg.internalDate)).toISOString() : new Date().toISOString();
    await supabase.from("application_events").insert({
      opportunity_id: opp.id,
      event_type: eventType,
      event_at: eventAt,
      source: "gmail",
      gmail_message_id: msg.id,
      gmail_thread_id: msg.threadId,
      details: `${header(msg.payload?.headers, "Subject")}${msg.snippet ? ` — ${msg.snippet}` : ""}`,
    });

    const statusMap: Record<string,string> = { approved:"approved", declined:"declined", waitlisted:"waiting", campaign_full:"declined", address_requested:"address_requested", replied:"waiting", needs_info:"waiting" };
    await supabase.from("sample_opportunities").update({
      last_status_event_at: eventAt,
      last_status_event: eventType,
      ...(statusMap[eventType] ? { status: statusMap[eventType] } : {}),
    }).eq("id", opp.id);

    await supabase.from("notifications").insert({
      type: "brand_reply",
      title: `${opp.brand}: ${eventType.replaceAll("_", " ")}`,
      body: msg.snippet ?? header(msg.payload?.headers, "Subject"),
      related_opportunity_id: opp.id,
    });
    matched++;
  }

  await supabase.from("gmail_connections").update({ last_sync_at: new Date().toISOString() }).eq("id", conn.id);
  return NextResponse.json({ ok: true, scanned: list.messages?.length ?? 0, matched });
}
