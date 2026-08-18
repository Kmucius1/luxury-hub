import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/requests/copy-button";
import { REQUEST_METHODS, REQUEST_METHOD_LABELS, REQUEST_STATUSES, REQUEST_STATUS_LABELS } from "@/lib/utils";
import type { SampleRequest } from "@/lib/types";
import { updateRequest, deleteRequest } from "../actions";
import { sendRequestViaGmail } from "../gmail-actions";

export default async function RequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const [{ data }, { data: gmail }] = await Promise.all([
    supabase.from("sample_requests").select("*, sample_opportunities(id, brand, product, estimated_value, category)").eq("id", id).single(),
    user ? supabase.from("gmail_connections").select("email,status").eq("user_id", user.id).eq("status", "connected").order("connected_at", { ascending: false }).limit(1).maybeSingle() : Promise.resolve({ data: null }),
  ]);

  if (!data) notFound();
  const r = data as SampleRequest;

  return <div className="flex flex-col gap-6">
    <div><Link href="/requests" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-3.5"/>Back to Requests</Link><h1 className="mt-2 text-xl font-semibold tracking-tight">{r.sample_opportunities?.brand ?? "Request"}</h1><p className="text-sm text-muted-foreground">{r.sample_opportunities?.product}</p></div>

    <Card>
      <CardHeader className="flex flex-row items-center justify-between"><div><CardTitle>Outreach Message</CardTitle><p className="mt-1 text-xs text-muted-foreground">Review the message before sending. It will send from the Gmail account connected inside this CRM.</p></div><CopyButton text={`Subject: ${r.subject ?? ""}\n\n${r.message ?? ""}`}/></CardHeader>
      <CardContent className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm">{gmail ? <div className="flex items-center gap-2"><Badge variant="gold">Gmail Connected</Badge><span className="text-muted-foreground">{gmail.email}</span></div> : <div className="flex items-center gap-2"><Badge variant="outline">No Gmail Connected</Badge><Link href="/settings/gmail" className="underline underline-offset-4">Connect Gmail</Link></div>}</div>
        {r.status === "draft" && gmail ? <form action={sendRequestViaGmail.bind(null,id)}><Button type="submit" variant="gold">Send from {gmail.email}</Button></form> : null}
      </CardContent>
    </Card>

    <form action={updateRequest.bind(null,id)} className="flex flex-col gap-6">
      <Card><CardHeader><CardTitle>Message</CardTitle></CardHeader><CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5"><Label htmlFor="subject">Subject</Label><Input id="subject" name="subject" defaultValue={r.subject ?? ""}/></div>
        <div className="flex flex-col gap-1.5"><Label htmlFor="message">Message</Label><Textarea id="message" name="message" rows={12} defaultValue={r.message ?? ""} className="font-mono text-xs"/></div>
      </CardContent></Card>

      <Card><CardHeader><CardTitle>Tracking</CardTitle></CardHeader><CardContent className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5"><Label htmlFor="priority">Priority</Label><Select id="priority" name="priority" defaultValue={r.priority}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></Select></div>
        <div className="flex flex-col gap-1.5"><Label htmlFor="method">Method</Label><Select id="method" name="method" defaultValue={r.method ?? "email"}>{REQUEST_METHODS.map(m=><option key={m} value={m}>{REQUEST_METHOD_LABELS[m]}</option>)}</Select></div>
        <div className="flex flex-col gap-1.5"><Label htmlFor="status">Status</Label><Select id="status" name="status" defaultValue={r.status}>{REQUEST_STATUSES.map(s=><option key={s} value={s}>{REQUEST_STATUS_LABELS[s]}</option>)}</Select></div>
        <div className="flex flex-col gap-1.5"><Label htmlFor="contact_name">Contact Name</Label><Input id="contact_name" name="contact_name" defaultValue={r.contact_name ?? ""}/></div>
        <div className="flex flex-col gap-1.5"><Label htmlFor="contact_email">Contact Email</Label><Input id="contact_email" name="contact_email" type="email" defaultValue={r.contact_email ?? ""}/></div>
        <div className="flex flex-col gap-1.5"><Label htmlFor="date_sent">Date Sent</Label><Input id="date_sent" name="date_sent" type="date" defaultValue={r.date_sent ?? ""}/></div>
        <div className="flex flex-col gap-1.5"><Label htmlFor="follow_up_date">Follow-Up Date</Label><Input id="follow_up_date" name="follow_up_date" type="date" defaultValue={r.follow_up_date ?? ""}/><p className="text-xs text-muted-foreground">One follow-up maximum for gifting/PR requests.</p></div>
        <div className="col-span-full flex flex-col gap-1.5"><Label htmlFor="response">Response Notes</Label><Textarea id="response" name="response" defaultValue={r.response ?? ""}/></div>
      </CardContent></Card>

      <div className="flex justify-end"><Button type="submit" variant="gold" size="lg">Save Changes</Button></div>
    </form>

    <form action={deleteRequest.bind(null,id)} className="flex justify-end"><Button type="submit" variant="destructive" size="sm">Delete Request</Button></form>
  </div>;
}
