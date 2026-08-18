import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { formatCurrency, formatDate, REQUEST_METHOD_LABELS, REQUEST_STATUS_LABELS } from "@/lib/utils";
import type { SampleRequest } from "@/lib/types";

export default async function RequestsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("sample_requests").select("*, sample_opportunities(id, brand, product, estimated_value, category)").order("created_at", { ascending: false });
  const requests = (data ?? []) as SampleRequest[];
  return <div className="flex flex-col gap-6">
    <div className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-xl font-semibold tracking-tight">Requests</h1><p className="text-sm text-muted-foreground">Review drafts, send from your connected creator Gmail, and track replies and follow-ups.</p></div><Button asChild variant="gold"><Link href="/requests/new"><Plus className="size-4"/>New Request</Link></Button></div>
    {requests.length===0?<div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">No requests yet. Draft one from a verified sample opportunity.</div>:<div className="rounded-lg border border-border"><Table><TableHeader><TableRow><TableHead>Priority</TableHead><TableHead>Brand</TableHead><TableHead>Product</TableHead><TableHead>Value</TableHead><TableHead>Method</TableHead><TableHead>Status</TableHead><TableHead>Date Sent</TableHead><TableHead>Follow-Up</TableHead></TableRow></TableHeader><TableBody>{requests.map(r=><TableRow key={r.id}><TableCell className="text-sm capitalize">{r.priority}</TableCell><TableCell><Link href={`/requests/${r.id}`} className="font-medium hover:underline">{r.sample_opportunities?.brand??"—"}</Link></TableCell><TableCell className="text-sm text-muted-foreground">{r.sample_opportunities?.product??"—"}</TableCell><TableCell className="text-sm">{formatCurrency(r.sample_opportunities?.estimated_value)}</TableCell><TableCell className="text-sm">{r.method?REQUEST_METHOD_LABELS[r.method]:"—"}</TableCell><TableCell><Badge variant="outline">{REQUEST_STATUS_LABELS[r.status]}</Badge></TableCell><TableCell className="text-sm text-muted-foreground">{formatDate(r.date_sent)}</TableCell><TableCell className="text-sm text-muted-foreground">{formatDate(r.follow_up_date)}</TableCell></TableRow>)}</TableBody></Table></div>}
  </div>;
}
