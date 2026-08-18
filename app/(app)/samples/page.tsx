import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SafetyBadgePill } from "@/components/samples/safety-badge";
import { ScoreBadge } from "@/components/samples/score-badge";
import { formatCurrency, formatDate, PIPELINE_STATUSES, PIPELINE_STATUS_LABELS, CATEGORY_LABELS } from "@/lib/utils";
import type { SampleOpportunity } from "@/lib/types";
import { cn } from "@/lib/utils";

const CONFIDENCE: Record<string,string> = {
  exact_confirmed: "Exact item confirmed",
  high: "Highly likely",
  medium: "Likely / partial evidence",
  low: "Possible item",
  unknown: "Not confirmed yet",
};

export default async function SamplesPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const supabase = await createClient();
  let query = supabase.from("sample_opportunities").select("*").order("date_found", { ascending: false });
  if (status) query = query.eq("status", status);
  const { data } = await query;
  const opportunities = (data ?? []) as SampleOpportunity[];

  return <div className="flex flex-col gap-6">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><h1 className="text-xl font-semibold tracking-tight">Samples Pipeline</h1><p className="text-sm text-muted-foreground">See the actual product/PR imagery, what you are most likely to receive, and the live application status.</p></div>
      <Button asChild variant="gold"><Link href="/samples/new"><Plus className="size-4" />Add Opportunity</Link></Button>
    </div>
    <div className="flex flex-wrap gap-1.5">
      <Link href="/samples"><Badge variant={!status ? "default" : "outline"} className="cursor-pointer">All</Badge></Link>
      {PIPELINE_STATUSES.map((s) => <Link key={s} href={`/samples?status=${s}`}><Badge variant={status === s ? "default" : "outline"} className="cursor-pointer">{PIPELINE_STATUS_LABELS[s]}</Badge></Link>)}
    </div>

    {opportunities.length === 0 ? <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">No opportunities yet.</div> :
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {opportunities.map((o) => {
          const image = o.pr_package_image_url || o.evidence_image_url || o.product_image_url;
          return <Link key={o.id} href={`/samples/${o.id}`} className={cn("overflow-hidden rounded-xl border border-border bg-card transition hover:border-foreground/20 hover:shadow-sm", o.safety_badge === "REJECTED" && "opacity-60")}>
            <div className="aspect-[4/3] bg-secondary/40">
              {image ? <img src={image} alt={`${o.brand} ${o.product}`} className="h-full w-full object-cover" loading="lazy" /> : <div className="flex h-full items-center justify-center px-6 text-center text-xs text-muted-foreground">Verified product / PR image not added yet</div>}
            </div>
            <div className="flex flex-col gap-3 p-4">
              <div className="flex items-start justify-between gap-3"><div><p className="font-semibold">{o.brand}</p><p className="text-sm text-muted-foreground">{o.product}</p></div><ScoreBadge score={o.opportunity_score} /></div>
              <div className="flex flex-wrap gap-1.5"><Badge variant="outline">{CATEGORY_LABELS[o.category]}</Badge><SafetyBadgePill badge={o.safety_badge} /><Badge variant="outline">{CONFIDENCE[o.receipt_confidence ?? "unknown"]}</Badge></div>
              {o.expected_contents ? <p className="line-clamp-2 text-xs text-muted-foreground"><span className="font-medium text-foreground">Expected:</span> {o.expected_contents}</p> : null}
              <div className="grid grid-cols-2 gap-2 text-xs"><div><p className="text-muted-foreground">Value</p><p className="font-medium">{formatCurrency(o.estimated_value)}</p></div><div><p className="text-muted-foreground">Posting</p><p className="font-medium">{o.posting_required ? "Required" : "None"}</p></div></div>
              <div className="border-t border-border pt-3"><div className="flex items-center justify-between gap-2"><Badge variant="outline">{PIPELINE_STATUS_LABELS[o.status]}</Badge><span className="text-xs text-muted-foreground">{formatDate(o.date_found)}</span></div>{o.last_status_event ? <p className="mt-2 text-xs text-muted-foreground">Latest: <span className="font-medium text-foreground">{o.last_status_event.replaceAll("_", " ")}</span>{o.last_status_event_at ? ` · ${new Date(o.last_status_event_at).toLocaleString()}` : ""}</p> : null}</div>
            </div>
          </Link>;
        })}
      </div>}
  </div>;
}
